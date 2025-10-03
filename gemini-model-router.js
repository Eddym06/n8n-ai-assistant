/**
 * GEMINI MODEL ROUTER - SISTEMA INTELIGENTE DE ROUTING
 * Gestiona automáticamente fallbacks entre modelos cuando se agoten cuotas
 * Optimiza costos y rendimiento según el tipo de agente
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODELS_CONFIG, MODEL_UTILS } from './gemini-models-config.js';
import GeminiCacheSystem from './gemini-cache-system.js';
import fs from 'fs/promises';
import path from 'path';

class GeminiModelRouter {
  constructor(apiKey = process.env.GEMINI_API_KEY, options = {}) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY es requerido para el Model Router');
    }

    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Configuración del router
    this.options = {
      enableFallback: true,
      enableMetrics: true,
      enableLogging: true,
      enableCache: true,
      ...options
    };

    // Inicializar sistema de cache
    this.cacheSystem = this.options.enableCache 
      ? new GeminiCacheSystem({
          maxSize: 500,
          ttlMs: 12 * 60 * 60 * 1000, // 12 horas
          persistFile: 'gemini-router-cache.json'
        })
      : null;

    // Estado del router
    this.modelInstances = new Map(); // Cache de instancias de modelos
    this.usageStats = new Map();     // Estadísticas de uso por modelo
    this.errorCounts = new Map();    // Contadores de errores
    this.lastRequestTime = new Map(); // Último tiempo de request por modelo
    
    // Persistencia de métricas
    this.metricsFile = path.join(process.cwd(), 'gemini-router-metrics.json');
    
    console.log('🚀 Gemini Model Router inicializado');
    console.log(`📊 Modelos Pro disponibles: ${Object.keys(GEMINI_MODELS_CONFIG.PRO_MODELS).length}`);
    console.log(`⚡ Modelos Flash disponibles: ${Object.keys(GEMINI_MODELS_CONFIG.FLASH_MODELS).length}`);
    
    // Cargar métricas existentes
    this.loadMetrics();
  }

  /**
   * MÉTODO PRINCIPAL: Genera contenido con fallback automático y cache
   */
  async generateContent(prompt, agentName = 'default', options = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`🎯 Router: Procesando request para agente '${agentName}'`);
      
      // Verificar cache primero
      if (this.cacheSystem) {
        const cachedResponse = await this.cacheSystem.get(prompt, agentName, options);
        if (cachedResponse) {
          return {
            content: cachedResponse,
            modelUsed: 'cache',
            modelName: 'Cache Hit',
            attemptNumber: 0,
            responseTime: Date.now() - startTime,
            cost: 0,
            fromCache: true
          };
        }
      }
      
      // Determinar la cadena de modelos a usar
      const modelChain = this.getModelChain(agentName);
      console.log(`🔗 Cadena de modelos: ${modelChain.map(m => m.name).join(' → ')}`);
      
      // Intentar con cada modelo en la cadena
      let lastError = null;
      for (let i = 0; i < modelChain.length; i++) {
        const modelConfig = modelChain[i];
        
        try {
          console.log(`🔄 Intentando con ${modelConfig.name} (${i + 1}/${modelChain.length})`);
          
          // Verificar límites antes de hacer la request
          if (!this.canMakeRequest(modelConfig)) {
            console.log(`⏸️ Modelo ${modelConfig.name} ha alcanzado sus límites, saltando...`);
            continue;
          }
          
          // Realizar la llamada
          const result = await this.makeRequest(modelConfig, prompt, options);
          
          // Guardar en cache si está habilitado
          if (this.cacheSystem && result) {
            await this.cacheSystem.set(prompt, agentName, options, result);
          }
          
          // Registrar éxito
          this.recordSuccess(modelConfig, Date.now() - startTime);
          
          console.log(`✅ Éxito con ${modelConfig.name} en ${Date.now() - startTime}ms`);
          return {
            content: result,
            modelUsed: modelConfig.id,
            modelName: modelConfig.name,
            attemptNumber: i + 1,
            responseTime: Date.now() - startTime,
            cost: this.calculateCost(modelConfig, prompt, result),
            fromCache: false
          };
          
        } catch (error) {
          lastError = error;
          this.recordError(modelConfig, error);
          
          console.warn(`❌ Error con ${modelConfig.name}: ${error.message}`);
          
          // Si es el último modelo, lanzar error
          if (i === modelChain.length - 1) {
            throw new Error(`Todos los modelos fallaron. Último error: ${error.message}`);
          }
          
          // Aplicar delay antes del siguiente intento
          await this.applyBackoff(i);
        }
      }
      
      throw lastError || new Error('No se pudieron procesar con ningún modelo');
      
    } catch (error) {
      console.error(`🚨 Router Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Determina la cadena de modelos a usar según el agente
   */
  getModelChain(agentName) {
    // Obtener configuración específica del agente
    const agentConfig = GEMINI_MODELS_CONFIG.AGENT_CONFIGURATIONS[agentName];
    
    if (!agentConfig) {
      console.log(`⚠️ Agente '${agentName}' no configurado, usando Flash por defecto`);
      return MODEL_UTILS.getModelsByPriority('flash');
    }
    
    // Construir cadena basada en configuración del agente
    const modelType = agentName === 'extension-server' ? 'PRO_MODELS' : 'FLASH_MODELS';
    const models = GEMINI_MODELS_CONFIG[modelType];
    
    return agentConfig.fallbackChain
      .map(chainKey => models[chainKey])
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Verifica si se puede hacer una request a un modelo
   */
  canMakeRequest(modelConfig) {
    const modelId = modelConfig.id;
    const now = Date.now();
    const stats = this.usageStats.get(modelId) || this.initModelStats(modelId);
    
    // Verificar límites diarios
    const today = new Date().toDateString();
    if (stats.dailyRequests[today] >= modelConfig.limits.requestsPerDay) {
      console.log(`📊 ${modelConfig.name}: Límite diario alcanzado (${stats.dailyRequests[today]}/${modelConfig.limits.requestsPerDay})`);
      return false;
    }
    
    // Verificar límites por minuto
    const oneMinuteAgo = now - 60000;
    const recentRequests = stats.requestTimes.filter(time => time > oneMinuteAgo);
    if (recentRequests.length >= modelConfig.limits.requestsPerMinute) {
      console.log(`⏱️ ${modelConfig.name}: Límite por minuto alcanzado (${recentRequests.length}/${modelConfig.limits.requestsPerMinute})`);
      return false;
    }
    
    return true;
  }

  /**
   * Realiza la request al modelo específico
   */
  async makeRequest(modelConfig, prompt, options = {}) {
    const modelId = modelConfig.id;
    
    // Obtener o crear instancia del modelo
    let model = this.modelInstances.get(modelId);
    if (!model) {
      model = this.genAI.getGenerativeModel({ 
        model: modelId,
        generationConfig: {
          temperature: options.temperature || 0.7,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
          maxOutputTokens: options.maxOutputTokens || Math.min(modelConfig.outputLimit, 32768),
          ...options.generationConfig
        }
      });
      this.modelInstances.set(modelId, model);
    }
    
    // Registrar intento
    this.recordAttempt(modelConfig);
    
    // Realizar la llamada con timeout
    const timeout = GEMINI_MODELS_CONFIG.FALLBACK_STRATEGY.timeouts[modelId] || 30000;
    
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
    
    if (!result.response) {
      throw new Error('No se recibió respuesta válida del modelo');
    }
    
    return result.response.text();
  }

  /**
   * Registra un intento de request
   */
  recordAttempt(modelConfig) {
    const modelId = modelConfig.id;
    const stats = this.usageStats.get(modelId) || this.initModelStats(modelId);
    const now = Date.now();
    const today = new Date().toDateString();
    
    // Actualizar estadísticas
    stats.totalRequests++;
    stats.requestTimes.push(now);
    stats.dailyRequests[today] = (stats.dailyRequests[today] || 0) + 1;
    
    // Limpiar tiempos antiguos (mantener solo última hora)
    const oneHourAgo = now - 3600000;
    stats.requestTimes = stats.requestTimes.filter(time => time > oneHourAgo);
    
    this.usageStats.set(modelId, stats);
    this.lastRequestTime.set(modelId, now);
  }

  /**
   * Registra un éxito
   */
  recordSuccess(modelConfig, responseTime) {
    const modelId = modelConfig.id;
    const stats = this.usageStats.get(modelId) || this.initModelStats(modelId);
    
    stats.successfulRequests++;
    stats.totalResponseTime += responseTime;
    stats.avgResponseTime = stats.totalResponseTime / stats.successfulRequests;
    
    this.usageStats.set(modelId, stats);
    
    // Resetear contador de errores consecutivos
    this.errorCounts.set(modelId, 0);
  }

  /**
   * Registra un error
   */
  recordError(modelConfig, error) {
    const modelId = modelConfig.id;
    const stats = this.usageStats.get(modelId) || this.initModelStats(modelId);
    
    stats.failedRequests++;
    stats.lastError = {
      message: error.message,
      timestamp: Date.now(),
      code: error.code || 'UNKNOWN'
    };
    
    this.usageStats.set(modelId, stats);
    
    // Incrementar contador de errores consecutivos
    const consecutiveErrors = (this.errorCounts.get(modelId) || 0) + 1;
    this.errorCounts.set(modelId, consecutiveErrors);
    
    // Log detallado para debugging
    console.log(`📊 Error registrado para ${modelConfig.name}:`);
    console.log(`   💥 Errores consecutivos: ${consecutiveErrors}`);
    console.log(`   📈 Total fallos: ${stats.failedRequests}`);
    console.log(`   🎯 Tasa de éxito: ${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%`);
  }

  /**
   * Inicializa estadísticas para un modelo
   */
  initModelStats(modelId) {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0,
      avgResponseTime: 0,
      requestTimes: [],
      dailyRequests: {},
      lastError: null
    };
  }

  /**
   * Calcula el costo estimado de una request
   */
  calculateCost(modelConfig, prompt, response) {
    if (!modelConfig.pricing) return 0;
    
    // Estimación básica de tokens (1 token ≈ 4 caracteres)
    const inputTokens = Math.ceil(prompt.length / 4);
    const outputTokens = Math.ceil((response?.length || 0) / 4);
    
    const inputCost = (inputTokens / 1000000) * modelConfig.pricing.inputTokens;
    const outputCost = (outputTokens / 1000000) * modelConfig.pricing.outputTokens;
    
    return inputCost + outputCost;
  }

  /**
   * Aplica backoff exponencial entre intentos
   */
  async applyBackoff(attemptNumber) {
    const { initialDelay, backoffMultiplier, maxDelay } = GEMINI_MODELS_CONFIG.FALLBACK_STRATEGY;
    const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attemptNumber), maxDelay);
    
    console.log(`⏳ Aplicando backoff: ${delay}ms antes del siguiente intento`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Obtiene estadísticas del router
   */
  getStats() {
    const stats = {
      modelsAvailable: this.modelInstances.size,
      totalRequests: 0,
      totalSuccessful: 0,
      totalFailed: 0,
      avgResponseTime: 0,
      modelStats: {}
    };

    for (const [modelId, modelStats] of this.usageStats.entries()) {
      stats.totalRequests += modelStats.totalRequests;
      stats.totalSuccessful += modelStats.successfulRequests;
      stats.totalFailed += modelStats.failedRequests;
      
      stats.modelStats[modelId] = {
        ...modelStats,
        successRate: modelStats.totalRequests > 0 
          ? (modelStats.successfulRequests / modelStats.totalRequests * 100).toFixed(2)
          : 0
      };
    }

    stats.successRate = stats.totalRequests > 0 
      ? (stats.totalSuccessful / stats.totalRequests * 100).toFixed(2)
      : 0;

    return stats;
  }

  /**
   * Guarda métricas en archivo
   */
  async saveMetrics() {
    if (!this.options.enableMetrics) return;
    
    try {
      const metrics = {
        timestamp: Date.now(),
        stats: this.getStats(),
        usageStats: Object.fromEntries(this.usageStats),
        errorCounts: Object.fromEntries(this.errorCounts)
      };
      
      await fs.writeFile(this.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.warn('⚠️ No se pudieron guardar métricas:', error.message);
    }
  }

  /**
   * Carga métricas desde archivo
   */
  async loadMetrics() {
    if (!this.options.enableMetrics) return;
    
    try {
      const data = await fs.readFile(this.metricsFile, 'utf8');
      const metrics = JSON.parse(data);
      
      // Restaurar estadísticas (solo del día actual para límites diarios)
      if (metrics.usageStats) {
        const today = new Date().toDateString();
        for (const [modelId, stats] of Object.entries(metrics.usageStats)) {
          // Filtrar solo requests del día actual
          const todayStats = { ...stats };
          todayStats.dailyRequests = { [today]: stats.dailyRequests?.[today] || 0 };
          todayStats.requestTimes = []; // Resetear para nueva sesión
          
          this.usageStats.set(modelId, todayStats);
        }
      }
      
      if (metrics.errorCounts) {
        this.errorCounts = new Map(Object.entries(metrics.errorCounts));
      }
      
      console.log('📊 Métricas cargadas desde archivo');
    } catch (error) {
      console.log('📊 No se encontraron métricas previas, iniciando limpio');
    }
  }

  /**
   * Limpia estadísticas (útil para testing)
   */
  resetStats() {
    this.usageStats.clear();
    this.errorCounts.clear();
    if (this.cacheSystem) {
      this.cacheSystem.clear();
    }
    console.log('🧹 Estadísticas y cache limpiados');
  }

  /**
   * Obtener estadísticas del cache
   */
  getCacheStats() {
    if (!this.cacheSystem) {
      return { enabled: false };
    }
    
    return {
      enabled: true,
      ...this.cacheSystem.getStats()
    };
  }

  /**
   * Limpiar cache manualmente
   */
  clearCache() {
    if (this.cacheSystem) {
      this.cacheSystem.clear();
      console.log('🗑️ Cache del router limpiado manualmente');
    }
  }

  /**
   * Cleanup automático del cache
   */
  cleanupCache() {
    if (this.cacheSystem) {
      return this.cacheSystem.cleanup();
    }
    return 0;
    this.lastRequestTime.clear();
    console.log('🧹 Estadísticas del router reseteadas');
  }
}

export default GeminiModelRouter;
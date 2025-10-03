/**
 * Prompt Enhancement Agent - VERSIÓN FINAL OPTIMIZADA CON ROUTER
 * Corrige el loop infinito Y mantiene la funcionalidad completa
 * Usa Gemini Model Router para gestión inteligente de modelos
 */

import GeminiModelRouter from './gemini-model-router.js';
import fs from 'fs';
import path from 'path';

class PromptEnhancementAgentOptimized {
  constructor(options = {}) {
    // Usar el router en lugar de GoogleGenerativeAI directo
    this.geminiRouter = new GeminiModelRouter();
    
    this.options = {
      maxRetries: 3,
      timeout: 15000,
      preventRecursion: true,
      ...options
    };
    
    // Configuración de análisis de complejidad
    this.promptComplexityAnalyzer = {
      vagueIndicators: {
        general: ['hacer', 'crear', 'generar', 'automático', 'sistema', 'workflow'],
        nonspecific: ['algo', 'cosa', 'proceso', 'simple', 'básico', 'normal'],
        beginnerTerms: ['email', 'datos', 'archivo', 'guardar', 'enviar', 'recibir']
      },
      intermediateIndicators: {
        technical: ['webhook', 'api', 'json', 'trigger', 'condition', 'filter'],
        specific: ['conectar', 'procesar', 'transformar', 'validar', 'integrar']
      },
      expertIndicators: {
        advanced: ['n8n-nodes-base', 'javascript', 'expression', 'conditional', 'loop'],
        professional: ['authentication', 'oauth', 'endpoint', 'payload', 'schema']
      }
    };
    
    console.log('✅ Prompt Enhancement Agent Optimized inicializado con Gemini Router');
  }

  /**
   * Análisis de complejidad INDEPENDIENTE (sin llamadas externas)
   */
  analyzePromptComplexity(prompt) {
    // Validar que prompt sea string
    if (typeof prompt !== 'string') {
      console.warn('⚠️ Prompt no es string, convirtiendo...');
      prompt = String(prompt);
    }
    
    const lowerPrompt = prompt.toLowerCase();
    let vagueScore = 0;
    let intermediateScore = 0;
    let advancedScore = 0;
    
    // Análisis de indicadores vagos (principiante)
    Object.values(this.promptComplexityAnalyzer.vagueIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        vagueScore += 0.1;
      }
    });
    
    // Análisis de indicadores intermedios
    Object.values(this.promptComplexityAnalyzer.intermediateIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        intermediateScore += 0.2;
      }
    });
    
    // Análisis de indicadores avanzados
    Object.values(this.promptComplexityAnalyzer.expertIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        advancedScore += 0.3;
      }
    });
    
    const complexityScore = Math.max(vagueScore, intermediateScore, advancedScore);
    
    let userLevel, enhancementNeeded;
    
    if (advancedScore > 0.3) {
      userLevel = 'EXPERT';
      enhancementNeeded = 'MINIMAL';
    } else if (intermediateScore > 0.2) {
      userLevel = 'INTERMEDIATE';
      enhancementNeeded = 'MODERATE';
    } else {
      userLevel = 'NOVICE';
      enhancementNeeded = 'FULL';
    }
    
    return {
      userLevel,
      complexityScore,
      enhancementNeeded,
      debug: {
        vagueScore,
        intermediateScore,
        advancedScore
      }
    };
  }

  /**
   * Procesamiento adaptativo SIN RECURSIÓN - VERSIÓN OPTIMIZADA
   */
  async adaptivePromptProcessing(prompt, isRecursiveCall = false) {
    console.log('🧠 Analizando complejidad del prompt...');
    
    // Protección contra recursión infinita
    if (isRecursiveCall) {
      console.log('🛡️ Llamada recursiva detectada, aplicando procesamiento directo');
      return {
        originalPrompt: prompt,
        processedPrompt: prompt, // Sin modificaciones en llamadas recursivas
        complexity: { userLevel: 'INTERMEDIATE', enhancementNeeded: 'NONE' },
        processingApplied: 'NONE_RECURSION_PROTECTION'
      };
    }
    
    const complexity = this.analyzePromptComplexity(prompt);
    console.log(`📊 Nivel detectado: ${complexity.userLevel} (Score: ${complexity.complexityScore.toFixed(2)})`);
    console.log(`🔧 Mejoras necesarias: ${complexity.enhancementNeeded}`);
    
    let processedPrompt = prompt;
    
    // Procesamiento directo SIN llamadas recursivas
    switch (complexity.enhancementNeeded) {
      case 'FULL':
        console.log('🔄 Usuario novato detectado - Aplicando traducción directa');
        processedPrompt = this.translateVaguePromptDirect(prompt);
        break;
        
      case 'MODERATE':
        console.log('⚙️ Usuario intermedio detectado - Aplicando mejoras directas');
        processedPrompt = this.enhanceSpecificityDirect(prompt);
        break;
        
      case 'MINIMAL':
        console.log('✨ Usuario experto detectado - Sin modificaciones');
        processedPrompt = prompt;
        break;
        
      default:
        processedPrompt = prompt;
    }
    
    return {
      originalPrompt: prompt,
      processedPrompt,
      complexity,
      processingApplied: complexity.enhancementNeeded
    };
  }

  /**
   * Traducción directa sin recursión
   */
  translateVaguePromptDirect(prompt) {
    console.log('🔄 Aplicando traducción directa de intenciones...');
    
    let enhanced = prompt;
    
    // Traducciones directas basadas en patrones
    const translations = {
      'crear webhook': 'crear un nodo Webhook que reciba datos HTTP y los procese',
      'enviar email': 'configurar un nodo Gmail/Email para envío automatizado de mensajes',
      'procesar datos': 'usar nodos de transformación como Set y Code para procesar información',
      'guardar en base de datos': 'conectar con nodo de base de datos (MySQL/PostgreSQL) para almacenar',
      'leer archivos': 'usar nodo Read Binary File para leer archivos del sistema',
      'crear workflow': 'generar un flujo de trabajo n8n con nodos conectados secuencialmente',
      'hacer algo': 'crear un workflow específico con nodos n8n',
      'automatizar': 'crear automatización con triggers y acciones'
    };
    
    // Añadir contexto técnico básico si no existe
    if (!enhanced.toLowerCase().includes('n8n') && !enhanced.toLowerCase().includes('nodo')) {
      enhanced = `Para n8n: ${enhanced}. Usar nodos específicos con configuración adecuada.`;
    }
    
    // Aplicar traducciones
    Object.keys(translations).forEach(pattern => {
      const regex = new RegExp(pattern, 'gi');
      if (enhanced.match(regex)) {
        enhanced = enhanced.replace(regex, translations[pattern]);
        console.log(`🔧 Traducción aplicada: ${pattern} → ${translations[pattern]}`);
      }
    });
    
    return enhanced;
  }

  /**
   * Mejora de especificidad directa
   */
  enhanceSpecificityDirect(prompt) {
    console.log('⚙️ Aplicando mejoras de especificidad directas...');
    
    let enhanced = prompt;
    
    // Añadir contexto técnico intermedio
    if (!enhanced.includes('n8n') && !enhanced.includes('nodo')) {
      enhanced = `Workflow n8n: ${enhanced}. Configurar con parámetros específicos.`;
    }
    
    // Añadir sugerencias técnicas específicas
    if (enhanced.toLowerCase().includes('webhook')) {
      enhanced += ' (Configurar método HTTP, headers y validación de payload)';
    }
    
    if (enhanced.toLowerCase().includes('api')) {
      enhanced += ' (Incluir autenticación, manejo de errores y rate limiting)';
    }
    
    return enhanced;
  }

  /**
   * Método principal SIN recursión - VERSIÓN OPTIMIZADA
   */
  async enhancePrompt(prompt, context = {}, options = {}) {
    console.log('✨ Prompt Enhancement Agent Optimized: Iniciando procesamiento...');

    try {
      // Procesamiento adaptativo marcando que es la llamada principal
      const adaptiveResult = await this.adaptivePromptProcessing(prompt, false);
      
      console.log(`📊 Procesamiento aplicado: ${adaptiveResult.processingApplied}`);
      console.log(`👤 Nivel de usuario: ${adaptiveResult.complexity.userLevel}`);
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: adaptiveResult.processedPrompt,
        complexity: adaptiveResult.complexity,
        processingApplied: adaptiveResult.processingApplied,
        improvements: {
          clarityImprovement: adaptiveResult.processingApplied !== 'NONE' && adaptiveResult.processingApplied !== 'NONE_RECURSION_PROTECTION',
          technicalTranslation: adaptiveResult.processingApplied === 'FULL',
          specificityEnhancement: adaptiveResult.processingApplied === 'MODERATE'
        },
        success: true,
        optimized: true
      };
      
    } catch (error) {
      console.error('❌ Error en Prompt Enhancement Agent Optimized:', error.message);
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: prompt,
        error: error.message,
        success: false,
        fallback: true
      };
    }
  }

  /**
   * Método para análisis independiente de intenciones
   */
  static detectIntentions(prompt) {
    const intentions = [];
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('webhook')) intentions.push('webhook_integration');
    if (lowerPrompt.includes('email')) intentions.push('email_processing');
    if (lowerPrompt.includes('datos') || lowerPrompt.includes('data')) intentions.push('data_processing');
    if (lowerPrompt.includes('api')) intentions.push('api_integration');
    if (lowerPrompt.includes('archivo') || lowerPrompt.includes('file')) intentions.push('file_processing');
    if (lowerPrompt.includes('base de datos') || lowerPrompt.includes('database')) intentions.push('database_operations');
    
    return intentions;
  }
}

export default PromptEnhancementAgentOptimized;
/**
 * CONFIGURACIÓN DE MODELOS GEMINI - ROUTER INTELIGENTE
 * Gestiona múltiples modelos con fallback automático cuando se agoten cuotas
 */

export const GEMINI_MODELS_CONFIG = {
  // ===== MODELOS PRO (Para Extension Server - Tareas Complejas) =====
  PRO_MODELS: {
    primary: {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Modelo principal con máximo rendimiento y precisión',
      tier: 'premium',
      priority: 1,
      capabilities: ['thinking', 'multimodal', 'large-context', 'code-execution'],
      limits: {
        requestsPerDay: 50,
        requestsPerMinute: 2,
        tokensPerMinute: 32000,
        tokensPerDay: 1000000
      },
      pricing: {
        inputTokens: 1.25, // por millón
        outputTokens: 2.50  // por millón
      },
      contextWindow: 1048576,
      outputLimit: 65536
    },
    
    // FALLBACK A FLASH PARA PRO CUANDO NO ESTÉ DISPONIBLE
    fallback_flash: {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash (Pro Fallback)',
      description: 'Fallback rápido cuando Pro no está disponible',
      tier: 'fallback',
      priority: 2,
      capabilities: ['thinking', 'multimodal', 'fast-response'],
      limits: {
        requestsPerDay: 1500,
        requestsPerMinute: 15,
        tokensPerMinute: 1000000,
        tokensPerDay: 1000000
      },
      pricing: {
        inputTokens: 0.075,
        outputTokens: 0.30
      },
      contextWindow: 1048576,
      outputLimit: 65536
    }
  },

  // ===== MODELOS FLASH (Para Agentes - Tareas Rápidas) =====
  FLASH_MODELS: {
    primary: {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Mejor relación precio-rendimiento con capacidades completas',
      tier: 'standard',
      priority: 1,
      capabilities: ['thinking', 'multimodal', 'fast-response'],
      limits: {
        requestsPerDay: 1500,
        requestsPerMinute: 15,
        tokensPerMinute: 1000000,
        tokensPerDay: 1000000
      },
      pricing: {
        inputTokens: 0.075,  // por millón
        outputTokens: 0.30   // por millón
      },
      contextWindow: 1048576,
      outputLimit: 65536
    },

    lite: {
      id: 'gemini-2.5-flash-lite',
      name: 'Gemini 2.5 Flash Lite',
      description: 'Más eficiente para tareas simples y alto volumen',
      tier: 'lite',
      priority: 3,
      capabilities: ['fast-response', 'high-throughput'],
      limits: {
        requestsPerDay: 15000,
        requestsPerMinute: 300,
        tokensPerMinute: 4000000,
        tokensPerDay: 4000000
      },
      pricing: {
        inputTokens: 0.0375, // por millón
        outputTokens: 0.15   // por millón
      },
      contextWindow: 1048576,
      outputLimit: 65536
    },

    experimental_v2: {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      description: 'Nueva generación con características avanzadas',
      tier: 'next-gen',
      priority: 2,
      capabilities: ['realtime-streaming', 'enhanced-speed'],
      limits: {
        requestsPerDay: 1000,
        requestsPerMinute: 10,
        tokensPerMinute: 800000,
        tokensPerDay: 2000000
      },
      pricing: {
        inputTokens: 0.075,
        outputTokens: 0.30
      },
      contextWindow: 1048576,
      outputLimit: 65536
    }
  },

  // ===== CONFIGURACIÓN DE AGENTES =====
  AGENT_CONFIGURATIONS: {
    // Agentes de alta complejidad (usan Flash estándar)
    'flow-coherence': {
      models: ['gemini-2.5-flash', 'gemini-2.0-flash'],
      fallbackChain: ['primary', 'experimental_v2'],
      minComplexity: 'medium'
    },
    
    'prompt-enhancement': {
      models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'],
      fallbackChain: ['primary', 'lite'],
      minComplexity: 'low'
    },
    
    'workflow-validator': {
      models: ['gemini-2.5-flash', 'gemini-2.0-flash'],
      fallbackChain: ['primary', 'experimental_v2'],
      minComplexity: 'medium'
    },
    
    'intelligent-positioning': {
      models: ['gemini-2.5-flash-lite', 'gemini-2.5-flash'],
      fallbackChain: ['lite', 'primary'],
      minComplexity: 'low'
    },
    
    'semantic-memory': {
      models: ['gemini-2.5-flash-lite'],
      fallbackChain: ['lite'],
      minComplexity: 'low'
    },

    // Extension Server (usa modelos Pro con fallback a Flash)
    'extension-server': {
      models: ['gemini-2.5-pro', 'gemini-2.5-flash'],
      fallbackChain: ['primary', 'fallback_flash'],
      minComplexity: 'high'
    }
  },

  // ===== CONFIGURACIÓN DE FALLBACK =====
  FALLBACK_STRATEGY: {
    retryAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 1000, // 1 segundo
    maxDelay: 30000,    // 30 segundos
    
    // Códigos de error que activan fallback
    fallbackErrorCodes: [
      429, // Rate limit exceeded
      503, // Service unavailable
      'QUOTA_EXCEEDED',
      'RATE_LIMIT_EXCEEDED',
      'MODEL_OVERLOADED'
    ],
    
    // Estrategia de rotación
    rotationStrategy: 'priority', // 'priority' | 'round-robin' | 'least-used'
    
    // Timeout por modelo
    timeouts: {
      'gemini-2.5-pro': 60000,      // 60s para Pro
      'gemini-2.5-flash': 30000,     // 30s para Flash
      'gemini-2.5-flash-lite': 15000 // 15s para Lite
    }
  },

  // ===== MÉTRICAS Y MONITOREO =====
  MONITORING: {
    trackUsage: true,
    logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
    metricsCollection: {
      requestCount: true,
      responseTime: true,
      errorRate: true,
      tokenUsage: true,
      costTracking: true
    },
    
    // Umbrales para alertas
    thresholds: {
      dailyUsageWarning: 0.8,  // 80% del límite diario
      errorRateWarning: 0.1,   // 10% de errores
      avgResponseTimeWarning: 5000 // 5 segundos
    }
  }
};

// ===== UTILIDADES DE CONFIGURACIÓN =====
export const MODEL_UTILS = {
  /**
   * Obtiene la configuración de un modelo por ID
   */
  getModelConfig(modelId) {
    // Buscar en modelos Pro
    for (const [key, config] of Object.entries(GEMINI_MODELS_CONFIG.PRO_MODELS)) {
      if (config.id === modelId) {
        return { ...config, type: 'pro', key };
      }
    }
    
    // Buscar en modelos Flash
    for (const [key, config] of Object.entries(GEMINI_MODELS_CONFIG.FLASH_MODELS)) {
      if (config.id === modelId) {
        return { ...config, type: 'flash', key };
      }
    }
    
    return null;
  },

  /**
   * Obtiene la cadena de fallback para un agente
   */
  getAgentFallbackChain(agentName) {
    const agentConfig = GEMINI_MODELS_CONFIG.AGENT_CONFIGURATIONS[agentName];
    if (!agentConfig) return null;
    
    return agentConfig.fallbackChain.map(chain => {
      // Determinar el tipo de modelo según el agente
      const modelType = agentName === 'extension-server' ? 'PRO_MODELS' : 'FLASH_MODELS';
      return GEMINI_MODELS_CONFIG[modelType][chain];
    }).filter(Boolean);
  },

  /**
   * Valida si un modelo está disponible
   */
  isModelAvailable(modelId) {
    return this.getModelConfig(modelId) !== null;
  },

  /**
   * Obtiene modelos ordenados por prioridad
   */
  getModelsByPriority(type = 'flash') {
    const models = type === 'pro' ? GEMINI_MODELS_CONFIG.PRO_MODELS : GEMINI_MODELS_CONFIG.FLASH_MODELS;
    return Object.entries(models)
      .sort(([,a], [,b]) => a.priority - b.priority)
      .map(([key, config]) => ({ key, ...config }));
  }
};

export default GEMINI_MODELS_CONFIG;
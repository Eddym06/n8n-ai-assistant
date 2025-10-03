/**
 * CONFIGURACIÓN CENTRALIZADA PARA EL SERVER N8N AI ASSISTANT
 * Centraliza todas las configuraciones, variables de entorno y constantes
 */

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * CONFIGURACIÓN PRINCIPAL DEL SISTEMA
 */
export const CONFIG = {
    
    // CONFIGURACIÓN DEL SERVIDOR
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development',
        timeout: parseInt(process.env.SERVER_TIMEOUT) || 30000,
        maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb'
    },

    // CONFIGURACIÓN DE LOGGING
    logging: {
        level: process.env.LOG_LEVEL || 'INFO',
        enableEmojis: process.env.LOG_EMOJIS !== 'false',
        enableColors: process.env.LOG_COLORS !== 'false',
        showTimestamp: process.env.LOG_TIMESTAMP !== 'false',
        enableFileLogging: process.env.LOG_TO_FILE === 'true',
        logFile: process.env.LOG_FILE || './logs/server.log'
    },

    // CONFIGURACIÓN DE AGENTES
    agents: {
        // Control de carga de agentes
        enableV3Agents: process.env.ENABLE_V3_AGENTS !== 'false',
        enableV4Agents: process.env.ENABLE_V4_AGENTS !== 'false',
        enableUltraAgent: process.env.ENABLE_ULTRA_AGENT !== 'false',
        
        // Rutas de agentes
        paths: {
            flowCoherence: './SISTEMA PRINCIPAL/flow-coherence-agent-v2.js',
            positioningV2: './Agentes y sistemas Antiguos/intelligent-positioning-agent-v2.js',
            positioningV4: './SISTEMA PRINCIPAL/intelligent-positioning-agent-v4-ai-enhanced.js',
            nodeConfigV3: './intelligent-node-config-agent-v3-FIXED.js',
            ultraAgent: './ultra-intelligent-fallback-agent-v2.js',
            intelligentAgent: './intelligent-agent-main.js',
            workflowValidator: './SISTEMA PRINCIPAL/intelligent-workflow-validator.js'
        },

        // Timeouts de inicialización
        initTimeout: parseInt(process.env.AGENT_INIT_TIMEOUT) || 10000,
        
        // Configuración de fallback
        enableFallback: process.env.ENABLE_AGENT_FALLBACK !== 'false',
        fallbackAgent: 'ultraAgent'
    },

    // CONFIGURACIÓN DE MODELOS AI
    ai: {
        // OpenAI
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
            defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini',
            maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
            timeout: parseInt(process.env.OPENAI_TIMEOUT) || 30000
        },

        // Gemini
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
            baseURL: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
            defaultModel: process.env.GEMINI_DEFAULT_MODEL || 'gemini-1.5-flash',
            maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 4000,
            temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
            timeout: parseInt(process.env.GEMINI_TIMEOUT) || 30000
        },

        // Grok
        grok: {
            apiKey: process.env.GROK_API_KEY,
            baseURL: process.env.GROK_BASE_URL || 'https://api.x.ai/v1',
            defaultModel: process.env.GROK_DEFAULT_MODEL || 'grok-beta',
            maxTokens: parseInt(process.env.GROK_MAX_TOKENS) || 4000,
            temperature: parseFloat(process.env.GROK_TEMPERATURE) || 0.7,
            timeout: parseInt(process.env.GROK_TIMEOUT) || 30000
        },

        // Configuración general
        defaultProvider: process.env.AI_DEFAULT_PROVIDER || 'openai',
        enableProviderFallback: process.env.AI_ENABLE_FALLBACK !== 'false',
        maxRetries: parseInt(process.env.AI_MAX_RETRIES) || 3,
        retryDelay: parseInt(process.env.AI_RETRY_DELAY) || 1000
    },

    // CONFIGURACIÓN DE WORKFLOW
    workflow: {
        // Límites
        maxNodes: parseInt(process.env.MAX_WORKFLOW_NODES) || 50,
        maxConnections: parseInt(process.env.MAX_WORKFLOW_CONNECTIONS) || 100,
        maxGenerationTime: parseInt(process.env.MAX_GENERATION_TIME) || 60000,
        
        // Validación
        enableValidation: process.env.ENABLE_WORKFLOW_VALIDATION !== 'false',
        enableArchitecturalValidation: process.env.ENABLE_ARCHITECTURAL_VALIDATION !== 'false',
        enableSemanticValidation: process.env.ENABLE_SEMANTIC_VALIDATION !== 'false',
        
        // Optimización
        enableOptimization: process.env.ENABLE_WORKFLOW_OPTIMIZATION !== 'false',
        enablePositioning: process.env.ENABLE_NODE_POSITIONING !== 'false',
        enableIntelligentConnections: process.env.ENABLE_INTELLIGENT_CONNECTIONS !== 'false',
        
        // Archivos
        outputDirectory: process.env.WORKFLOW_OUTPUT_DIR || './generated-workflows',
        templateDirectory: process.env.WORKFLOW_TEMPLATE_DIR || './templates',
        backupDirectory: process.env.WORKFLOW_BACKUP_DIR || './backups'
    },

    // CONFIGURACIÓN DE PERFORMANCE
    performance: {
        // Memoria
        maxMemoryUsage: process.env.MAX_MEMORY_USAGE || '512MB',
        enableMemoryMonitoring: process.env.ENABLE_MEMORY_MONITORING === 'true',
        memoryCheckInterval: parseInt(process.env.MEMORY_CHECK_INTERVAL) || 30000,
        
        // CPU
        maxCpuUsage: parseFloat(process.env.MAX_CPU_USAGE) || 80,
        enableCpuMonitoring: process.env.ENABLE_CPU_MONITORING === 'true',
        
        // Concurrencia
        maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS) || 10,
        queueTimeout: parseInt(process.env.QUEUE_TIMEOUT) || 60000,
        
        // Cache
        enableCache: process.env.ENABLE_CACHE !== 'false',
        cacheTimeout: parseInt(process.env.CACHE_TIMEOUT) || 300000, // 5 minutos
        maxCacheSize: parseInt(process.env.MAX_CACHE_SIZE) || 100
    },

    // CONFIGURACIÓN DE DEBUGGING
    debug: {
        enabled: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
        verbose: process.env.DEBUG_VERBOSE === 'true',
        saveDebugFiles: process.env.SAVE_DEBUG_FILES === 'true',
        debugDirectory: process.env.DEBUG_DIR || './debug',
        enableTiming: process.env.DEBUG_TIMING !== 'false',
        enableMemoryTracking: process.env.DEBUG_MEMORY === 'true'
    },

    // CONFIGURACIÓN DE SEGURIDAD
    security: {
        enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 min
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        enableCors: process.env.ENABLE_CORS !== 'false',
        corsOrigin: process.env.CORS_ORIGIN || '*',
        enableApiKey: process.env.ENABLE_API_KEY === 'true',
        apiKey: process.env.API_KEY
    },

    // CONFIGURACIÓN DE ARCHIVOS
    files: {
        maxFileSize: process.env.MAX_FILE_SIZE || '10MB',
        allowedExtensions: (process.env.ALLOWED_EXTENSIONS || '.json,.js,.yaml,.yml').split(','),
        uploadDirectory: process.env.UPLOAD_DIR || './uploads',
        tempDirectory: process.env.TEMP_DIR || './temp'
    }
};

/**
 * CONSTANTES DEL SISTEMA
 */
export const CONSTANTS = {
    
    // Tipos de nodos N8N más comunes
    NODE_TYPES: {
        TRIGGERS: [
            'n8n-nodes-base.webhook',
            'n8n-nodes-base.cron',
            'n8n-nodes-base.start',
            'n8n-nodes-base.manualTrigger',
            'n8n-nodes-base.emailReadImap',
            'n8n-nodes-base.formTrigger'
        ],
        
        AI_NODES: [
            'n8n-nodes-base.openAi',
            'n8n-nodes-base.anthropic',
            'n8n-nodes-base.googleGemini',
            'n8n-nodes-base.huggingFace',
            'n8n-nodes-base.cohere',
            'n8n-nodes-base.replicate'
        ],
        
        PROCESSING: [
            'n8n-nodes-base.code',
            'n8n-nodes-base.function',
            'n8n-nodes-base.set',
            'n8n-nodes-base.merge',
            'n8n-nodes-base.itemLists'
        ],
        
        CONDITIONAL: [
            'n8n-nodes-base.if',
            'n8n-nodes-base.switch',
            'n8n-nodes-base.filter'
        ],
        
        INTEGRATIONS: [
            'n8n-nodes-base.salesforce',
            'n8n-nodes-base.hubspot',
            'n8n-nodes-base.mailchimp',
            'n8n-nodes-base.slack',
            'n8n-nodes-base.googleSheets',
            'n8n-nodes-base.airtable'
        ]
    },

    // Dominios de negocio
    BUSINESS_DOMAINS: {
        CRM: 'crm',
        MARKETING: 'marketing',
        ECOMMERCE: 'ecommerce',
        SUPPORT: 'support',
        FINANCE: 'finance',
        HR: 'hr',
        GENERAL: 'general'
    },

    // Niveles de complejidad
    COMPLEXITY_LEVELS: {
        SIMPLE: 'simple',
        MEDIUM: 'medium',
        HIGH: 'high',
        ENTERPRISE: 'enterprise'
    },

    // Estados del workflow
    WORKFLOW_STATES: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        ERROR: 'error',
        CANCELLED: 'cancelled'
    },

    // Códigos de respuesta
    RESPONSE_CODES: {
        SUCCESS: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TIMEOUT: 408,
        RATE_LIMITED: 429,
        SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    }
};

/**
 * UTILIDADES DE CONFIGURACIÓN
 */
export class ConfigValidator {
    
    static validate() {
        const errors = [];
        
        // Validar configuración crítica
        if (CONFIG.server.port < 1 || CONFIG.server.port > 65535) {
            errors.push('Puerto del servidor debe estar entre 1 y 65535');
        }
        
        if (CONFIG.workflow.maxNodes < 1) {
            errors.push('Máximo de nodos debe ser mayor a 0');
        }
        
        if (CONFIG.performance.maxConcurrentRequests < 1) {
            errors.push('Máximo de requests concurrentes debe ser mayor a 0');
        }
        
        // Validar que directorios existen o se pueden crear
        const requiredDirs = [
            CONFIG.workflow.outputDirectory,
            CONFIG.files.uploadDirectory,
            CONFIG.files.tempDirectory
        ];
        
        if (CONFIG.logging.enableFileLogging) {
            requiredDirs.push(path.dirname(CONFIG.logging.logFile));
        }
        
        if (CONFIG.debug.enabled && CONFIG.debug.saveDebugFiles) {
            requiredDirs.push(CONFIG.debug.debugDirectory);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    static printConfig() {
        console.log('\n🔧 CONFIGURACIÓN DEL SISTEMA:');
        console.log('================================');
        console.log(`Servidor: ${CONFIG.server.host}:${CONFIG.server.port}`);
        console.log(`Entorno: ${CONFIG.server.environment}`);
        console.log(`Logging: ${CONFIG.logging.level}`);
        console.log(`Agentes: V3=${CONFIG.agents.enableV3Agents}, V4=${CONFIG.agents.enableV4Agents}`);
        console.log(`IA Provider: ${CONFIG.ai.defaultProvider}`);
        console.log(`Debug: ${CONFIG.debug.enabled}`);
        console.log(`Performance Monitoring: ${CONFIG.performance.enableMemoryMonitoring}`);
        console.log('================================\n');
    }
}

/**
 * HELPERS PARA OBTENER CONFIGURACIÓN
 */
export const getConfig = (path, defaultValue = null) => {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
};

export const isProduction = () => CONFIG.server.environment === 'production';
export const isDevelopment = () => CONFIG.server.environment === 'development';
export const isDebugEnabled = () => CONFIG.debug.enabled;

export default CONFIG;
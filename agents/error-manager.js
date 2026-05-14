/**
 * SISTEMA AVANZADO DE GESTIÓN DE ERRORES
 * Manejo centralizado de errores con logging inteligente y recuperación automática
 */

import { IntelligentLogger } from './intelligent-logger.js';
import { CONFIG } from './server-config.js';

/**
 * TIPOS DE ERRORES PERSONALIZADOS
 */
export class WorkflowError extends Error {
    constructor(message, code = 'WORKFLOW_ERROR', details = {}) {
        super(message);
        this.name = 'WorkflowError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

export class AgentError extends Error {
    constructor(message, agentName, code = 'AGENT_ERROR', details = {}) {
        super(message);
        this.name = 'AgentError';
        this.code = code;
        this.agentName = agentName;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

export class AIProviderError extends Error {
    constructor(message, provider, code = 'AI_PROVIDER_ERROR', details = {}) {
        super(message);
        this.name = 'AIProviderError';
        this.code = code;
        this.provider = provider;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

export class ValidationError extends Error {
    constructor(message, field, value, code = 'VALIDATION_ERROR') {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
        this.field = field;
        this.value = value;
        this.timestamp = new Date().toISOString();
    }
}

export class ConfigurationError extends Error {
    constructor(message, config, code = 'CONFIG_ERROR') {
        super(message);
        this.name = 'ConfigurationError';
        this.code = code;
        this.config = config;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * GESTOR PRINCIPAL DE ERRORES
 */
export class ErrorManager {
    
    constructor() {
        this.logger = new IntelligentLogger('ErrorManager');
        this.errorStats = {
            total: 0,
            byType: {},
            byCode: {},
            recentErrors: [],
            startTime: Date.now()
        };
        
        // Configurar manejo global de errores no capturados
        this.setupGlobalErrorHandling();
    }

    /**
     * CONFIGURAR MANEJO GLOBAL DE ERRORES
     */
    setupGlobalErrorHandling() {
        // Errores no capturados
        process.on('uncaughtException', (error) => {
            this.handleCriticalError(error, 'uncaughtException');
        });

        // Promesas rechazadas no manejadas
        process.on('unhandledRejection', (reason, promise) => {
            this.handleCriticalError(reason, 'unhandledRejection', { promise });
        });

        // Advertencias
        process.on('warning', (warning) => {
            this.logger.warn(`⚠️ Advertencia del sistema: ${warning.message}`, {
                name: warning.name,
                stack: warning.stack
            });
        });
    }

    /**
     * MANEJAR ERRORES CRÍTICOS
     */
    handleCriticalError(error, type, context = {}) {
        this.logger.error(`🚨 ERROR CRÍTICO [${type}]: ${error.message}`, {
            error: this.serializeError(error),
            type,
            context,
            timestamp: new Date().toISOString()
        });

        // En producción, intentar graceful shutdown
        if (CONFIG.server.environment === 'production') {
            this.logger.error('🛑 Iniciando proceso de apagado graceful...');
            setTimeout(() => {
                process.exit(1);
            }, 5000); // 5 segundos para cleanup
        }
    }

    /**
     * MANEJAR ERROR GENERAL
     */
    handleError(error, context = {}) {
        try {
            // Actualizar estadísticas
            this.updateErrorStats(error);
            
            // Determinar nivel de severidad
            const severity = this.determineSeverity(error);
            
            // Serializar error para logging
            const serializedError = this.serializeError(error);
            
            // Log según severidad
            const logData = {
                error: serializedError,
                context,
                severity,
                timestamp: new Date().toISOString()
            };

            switch (severity) {
                case 'critical':
                    this.logger.error(`🚨 ${error.message}`, logData);
                    break;
                case 'high':
                    this.logger.error(`❌ ${error.message}`, logData);
                    break;
                case 'medium':
                    this.logger.warn(`⚠️ ${error.message}`, logData);
                    break;
                case 'low':
                    this.logger.info(`ℹ️ ${error.message}`, logData);
                    break;
                default:
                    this.logger.debug(`🔍 ${error.message}`, logData);
            }

            // Intentar recuperación automática si es posible
            const recovery = this.attemptRecovery(error, context);
            
            return {
                handled: true,
                severity,
                error: serializedError,
                context,
                recovery
            };

        } catch (handlingError) {
            // Si falla el manejo de errores, usar fallback
            console.error('❌ Error en ErrorManager:', handlingError);
            console.error('📋 Error original:', error);
            
            return {
                handled: false,
                error: this.serializeError(error),
                handlingError: this.serializeError(handlingError)
            };
        }
    }

    /**
     * DETERMINAR SEVERIDAD DEL ERROR
     */
    determineSeverity(error) {
        // Errores críticos
        if (error.name === 'ConfigurationError' || 
            error.code === 'ENOTFOUND' ||
            error.code === 'ECONNREFUSED' ||
            error.message.includes('out of memory')) {
            return 'critical';
        }

        // Errores altos
        if (error.name === 'AgentError' ||
            error.name === 'AIProviderError' ||
            error.code === 'TIMEOUT' ||
            error.code === 'AUTH_ERROR') {
            return 'high';
        }

        // Errores medios
        if (error.name === 'WorkflowError' ||
            error.name === 'ValidationError' ||
            error.code === 'RATE_LIMITED') {
            return 'medium';
        }

        // Errores bajos (warnings)
        if (error.code === 'DEPRECATED' ||
            error.code === 'FALLBACK_USED') {
            return 'low';
        }

        return 'medium'; // Default
    }

    /**
     * INTENTAR RECUPERACIÓN AUTOMÁTICA
     */
    attemptRecovery(error, context) {
        const recovery = {
            attempted: false,
            successful: false,
            method: null,
            details: null
        };

        try {
            // Recuperación por tipo de error
            switch (error.name) {
                case 'AIProviderError':
                    recovery.attempted = true;
                    recovery.method = 'provider_fallback';
                    recovery.details = this.recoverFromAIProviderError(error, context);
                    recovery.successful = recovery.details.success;
                    break;

                case 'AgentError':
                    recovery.attempted = true;
                    recovery.method = 'agent_fallback';
                    recovery.details = this.recoverFromAgentError(error, context);
                    recovery.successful = recovery.details.success;
                    break;

                case 'WorkflowError':
                    recovery.attempted = true;
                    recovery.method = 'workflow_repair';
                    recovery.details = this.recoverFromWorkflowError(error, context);
                    recovery.successful = recovery.details.success;
                    break;

                default:
                    // No hay recuperación automática disponible
                    break;
            }

        } catch (recoveryError) {
            recovery.error = this.serializeError(recoveryError);
            this.logger.warn('🔄 Falló la recuperación automática', {
                originalError: error.message,
                recoveryError: recoveryError.message
            });
        }

        return recovery;
    }

    /**
     * RECUPERACIÓN DE ERRORES DE PROVEEDOR AI
     */
    recoverFromAIProviderError(error, context) {
        if (!CONFIG.ai.enableProviderFallback) {
            return { success: false, reason: 'Fallback deshabilitado' };
        }

        try {
            // Intentar con el siguiente proveedor disponible
            const currentProvider = error.provider || context.provider;
            const providers = ['openai', 'gemini', 'grok'];
            const currentIndex = providers.indexOf(currentProvider);
            
            if (currentIndex >= 0 && currentIndex < providers.length - 1) {
                const fallbackProvider = providers[currentIndex + 1];
                
                this.logger.info(`🔄 Usando proveedor fallback: ${fallbackProvider}`, {
                    originalProvider: currentProvider,
                    fallbackProvider
                });

                return {
                    success: true,
                    fallbackProvider,
                    action: 'provider_switch'
                };
            }

            return { success: false, reason: 'No hay más proveedores disponibles' };

        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /**
     * RECUPERACIÓN DE ERRORES DE AGENTE
     */
    recoverFromAgentError(error, context) {
        if (!CONFIG.agents.enableFallback) {
            return { success: false, reason: 'Fallback de agentes deshabilitado' };
        }

        try {
            const fallbackAgent = CONFIG.agents.fallbackAgent;
            
            this.logger.info(`🔄 Usando agente fallback: ${fallbackAgent}`, {
                originalAgent: error.agentName,
                fallbackAgent
            });

            return {
                success: true,
                fallbackAgent,
                action: 'agent_switch'
            };

        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /**
     * RECUPERACIÓN DE ERRORES DE WORKFLOW
     */
    recoverFromWorkflowError(error, context) {
        try {
            // Intentar reparación básica del workflow
            if (context.workflow) {
                const repairAttempt = this.basicWorkflowRepair(context.workflow);
                
                if (repairAttempt.success) {
                    this.logger.info('🔧 Workflow reparado automáticamente', {
                        repairs: repairAttempt.repairs
                    });

                    return {
                        success: true,
                        repairedWorkflow: repairAttempt.workflow,
                        repairs: repairAttempt.repairs
                    };
                }
            }

            return { success: false, reason: 'No se pudo reparar el workflow' };

        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /**
     * REPARACIÓN BÁSICA DE WORKFLOW
     */
    basicWorkflowRepair(workflow) {
        const repairs = [];
        let repaired = { ...workflow };

        try {
            // Verificar estructura básica
            if (!repaired.nodes) {
                repaired.nodes = [];
                repairs.push('Añadidos nodos vacíos');
            }

            if (!repaired.connections) {
                repaired.connections = {};
                repairs.push('Añadidas conexiones vacías');
            }

            // Verificar que todos los nodos tengan IDs únicos
            const nodeIds = new Set();
            repaired.nodes = repaired.nodes.filter(node => {
                if (!node.id || nodeIds.has(node.id)) {
                    repairs.push(`Removido nodo duplicado/sin ID: ${node.id || 'undefined'}`);
                    return false;
                }
                nodeIds.add(node.id);
                return true;
            });

            // Limpiar conexiones rotas
            const validNodeIds = new Set(repaired.nodes.map(n => n.id));
            Object.keys(repaired.connections).forEach(nodeId => {
                if (!validNodeIds.has(nodeId)) {
                    delete repaired.connections[nodeId];
                    repairs.push(`Removidas conexiones del nodo inexistente: ${nodeId}`);
                }
            });

            return {
                success: repairs.length > 0,
                workflow: repaired,
                repairs
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * SERIALIZAR ERROR PARA LOGGING
     */
    serializeError(error) {
        if (!error) return null;

        return {
            name: error.name || 'Error',
            message: error.message || 'Sin mensaje',
            code: error.code || null,
            stack: CONFIG.debug.enabled ? error.stack : null,
            timestamp: error.timestamp || new Date().toISOString(),
            // Propiedades específicas de errores personalizados
            ...(error.agentName && { agentName: error.agentName }),
            ...(error.provider && { provider: error.provider }),
            ...(error.field && { field: error.field }),
            ...(error.value && { value: error.value }),
            ...(error.config && { config: error.config }),
            ...(error.details && { details: error.details })
        };
    }

    /**
     * ACTUALIZAR ESTADÍSTICAS DE ERRORES
     */
    updateErrorStats(error) {
        this.errorStats.total++;
        
        // Por tipo
        const type = error.name || 'UnknownError';
        this.errorStats.byType[type] = (this.errorStats.byType[type] || 0) + 1;
        
        // Por código
        const code = error.code || 'NO_CODE';
        this.errorStats.byCode[code] = (this.errorStats.byCode[code] || 0) + 1;
        
        // Errores recientes (últimos 100)
        this.errorStats.recentErrors.unshift({
            timestamp: new Date().toISOString(),
            type,
            code,
            message: error.message
        });
        
        if (this.errorStats.recentErrors.length > 100) {
            this.errorStats.recentErrors = this.errorStats.recentErrors.slice(0, 100);
        }
    }

    /**
     * OBTENER ESTADÍSTICAS DE ERRORES
     */
    getErrorStats() {
        const uptime = Date.now() - this.errorStats.startTime;
        
        return {
            ...this.errorStats,
            uptime: uptime,
            uptimeFormatted: this.formatUptime(uptime),
            errorRate: this.errorStats.total / (uptime / 1000 / 60), // errores por minuto
            topErrors: this.getTopErrors()
        };
    }

    /**
     * OBTENER TOP ERRORES
     */
    getTopErrors() {
        const byType = Object.entries(this.errorStats.byType)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
            
        const byCode = Object.entries(this.errorStats.byCode)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        return { byType, byCode };
    }

    /**
     * FORMATEAR UPTIME
     */
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * RESET ESTADÍSTICAS
     */
    resetStats() {
        this.errorStats = {
            total: 0,
            byType: {},
            byCode: {},
            recentErrors: [],
            startTime: Date.now()
        };
        
        this.logger.info('📊 Estadísticas de errores reiniciadas');
    }

    /**
     * CREAR REPORTE DE ERRORES
     */
    generateErrorReport() {
        const stats = this.getErrorStats();
        
        return {
            summary: {
                totalErrors: stats.total,
                uptime: stats.uptimeFormatted,
                errorRate: Math.round(stats.errorRate * 100) / 100,
                timestamp: new Date().toISOString()
            },
            topErrorsByType: stats.topErrors.byType,
            topErrorsByCode: stats.topErrors.byCode,
            recentErrors: stats.recentErrors.slice(0, 10),
            recommendations: this.generateRecommendations(stats)
        };
    }

    /**
     * GENERAR RECOMENDACIONES
     */
    generateRecommendations(stats) {
        const recommendations = [];

        // Alto rate de errores
        if (stats.errorRate > 10) {
            recommendations.push('🚨 Rate de errores muy alto - revisar logs y configuración');
        }

        // Muchos errores de configuración
        if (stats.byType.ConfigurationError > 5) {
            recommendations.push('⚙️ Revisar configuración del sistema');
        }

        // Muchos errores de IA
        if ((stats.byType.AIProviderError || 0) > 10) {
            recommendations.push('🤖 Problemas con proveedores de IA - verificar conectividad y API keys');
        }

        // Muchos errores de agentes
        if ((stats.byType.AgentError || 0) > 10) {
            recommendations.push('🤖 Problemas con agentes - revisar inicialización y dependencias');
        }

        return recommendations;
    }
}

// Instancia global del gestor de errores
export const errorManager = new ErrorManager();

/**
 * DECORADOR PARA MANEJO AUTOMÁTICO DE ERRORES
 */
export function handleErrors(target, propertyName, descriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args) {
        try {
            return await method.apply(this, args);
        } catch (error) {
            const context = {
                class: target.constructor.name,
                method: propertyName,
                args: args.length
            };
            
            errorManager.handleError(error, context);
            throw error; // Re-throw para que el llamador pueda manejar
        }
    };

    return descriptor;
}

/**
 * UTILIDADES DE VALIDACIÓN
 */
export const ValidationUtils = {
    
    required(value, fieldName) {
        if (value === null || value === undefined || value === '') {
            throw new ValidationError(`${fieldName} es requerido`, fieldName, value);
        }
        return value;
    },

    string(value, fieldName, options = {}) {
        if (typeof value !== 'string') {
            throw new ValidationError(`${fieldName} debe ser string`, fieldName, value);
        }
        
        if (options.minLength && value.length < options.minLength) {
            throw new ValidationError(`${fieldName} debe tener al menos ${options.minLength} caracteres`, fieldName, value);
        }
        
        if (options.maxLength && value.length > options.maxLength) {
            throw new ValidationError(`${fieldName} debe tener máximo ${options.maxLength} caracteres`, fieldName, value);
        }
        
        return value;
    },

    number(value, fieldName, options = {}) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new ValidationError(`${fieldName} debe ser un número válido`, fieldName, value);
        }
        
        if (options.min !== undefined && value < options.min) {
            throw new ValidationError(`${fieldName} debe ser mayor o igual a ${options.min}`, fieldName, value);
        }
        
        if (options.max !== undefined && value > options.max) {
            throw new ValidationError(`${fieldName} debe ser menor o igual a ${options.max}`, fieldName, value);
        }
        
        return value;
    },

    array(value, fieldName, options = {}) {
        if (!Array.isArray(value)) {
            throw new ValidationError(`${fieldName} debe ser un array`, fieldName, value);
        }
        
        if (options.minLength && value.length < options.minLength) {
            throw new ValidationError(`${fieldName} debe tener al menos ${options.minLength} elementos`, fieldName, value);
        }
        
        if (options.maxLength && value.length > options.maxLength) {
            throw new ValidationError(`${fieldName} debe tener máximo ${options.maxLength} elementos`, fieldName, value);
        }
        
        return value;
    },

    object(value, fieldName) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new ValidationError(`${fieldName} debe ser un objeto`, fieldName, value);
        }
        return value;
    }
};

export default ErrorManager;
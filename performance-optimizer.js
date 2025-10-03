/**
 * OPTIMIZADOR DE PERFORMANCE DEL SISTEMA
 * Monitoreo, análisis y optimización automática del rendimiento
 */

import { IntelligentLogger } from './intelligent-logger.js';
import { CONFIG } from './server-config.js';
import os from 'os';
import { performance } from 'perf_hooks';

/**
 * MONITOR DE MÉTRICAS DE SISTEMA
 */
export class SystemMetrics {
    
    constructor() {
        this.logger = new IntelligentLogger('SystemMetrics');
        this.metrics = {
            startTime: Date.now(),
            requests: {
                total: 0,
                successful: 0,
                failed: 0,
                pending: 0,
                avgResponseTime: 0,
                responseTimeHistory: []
            },
            memory: {
                current: 0,
                peak: 0,
                history: []
            },
            cpu: {
                current: 0,
                peak: 0,
                history: []
            },
            agents: {
                loads: 0,
                failures: 0,
                avgLoadTime: 0,
                activeAgents: new Set()
            },
            workflows: {
                generated: 0,
                failed: 0,
                avgGenerationTime: 0,
                generationTimeHistory: []
            }
        };
        
        this.monitoringInterval = null;
        this.isMonitoring = false;
    }

    /**
     * INICIAR MONITOREO
     */
    startMonitoring(interval = 30000) {
        if (this.isMonitoring) {
            this.logger.warn('⚠️ Monitoreo ya está activo');
            return;
        }

        this.isMonitoring = true;
        this.logger.info(`📊 Iniciando monitoreo de performance (${interval}ms)`);

        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
        }, interval);

        // Recolectar métricas iniciales
        this.collectMetrics();
    }

    /**
     * DETENER MONITOREO
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        this.isMonitoring = false;
        this.logger.info('⏹️ Monitoreo de performance detenido');
    }

    /**
     * RECOLECTAR MÉTRICAS
     */
    collectMetrics() {
        try {
            // Métricas de memoria
            const memoryUsage = process.memoryUsage();
            const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
            
            this.metrics.memory.current = memoryMB;
            if (memoryMB > this.metrics.memory.peak) {
                this.metrics.memory.peak = memoryMB;
            }
            
            this.metrics.memory.history.push({
                timestamp: Date.now(),
                value: memoryMB,
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                external: Math.round(memoryUsage.external / 1024 / 1024)
            });

            // Mantener solo las últimas 100 mediciones
            if (this.metrics.memory.history.length > 100) {
                this.metrics.memory.history = this.metrics.memory.history.slice(-100);
            }

            // Métricas de CPU
            const cpuUsage = process.cpuUsage();
            const cpuPercent = Math.round((cpuUsage.user + cpuUsage.system) / 1000 / 10);
            
            this.metrics.cpu.current = cpuPercent;
            if (cpuPercent > this.metrics.cpu.peak) {
                this.metrics.cpu.peak = cpuPercent;
            }
            
            this.metrics.cpu.history.push({
                timestamp: Date.now(),
                value: cpuPercent,
                user: cpuUsage.user,
                system: cpuUsage.system
            });

            if (this.metrics.cpu.history.length > 100) {
                this.metrics.cpu.history = this.metrics.cpu.history.slice(-100);
            }

            // Log de alertas si es necesario
            this.checkAlerts();

        } catch (error) {
            this.logger.error('❌ Error recolectando métricas', { error: error.message });
        }
    }

    /**
     * VERIFICAR ALERTAS
     */
    checkAlerts() {
        const { memory, cpu } = this.metrics;

        // Alerta de memoria
        const memoryLimit = parseInt(CONFIG.performance.maxMemoryUsage.replace('MB', ''));
        if (memory.current > memoryLimit * 0.9) {
            this.logger.warn(`🧠 Alto uso de memoria: ${memory.current}MB (límite: ${memoryLimit}MB)`);
        }

        // Alerta de CPU
        if (cpu.current > CONFIG.performance.maxCpuUsage * 0.9) {
            this.logger.warn(`⚡ Alto uso de CPU: ${cpu.current}% (límite: ${CONFIG.performance.maxCpuUsage}%)`);
        }
    }

    /**
     * REGISTRAR REQUEST
     */
    recordRequest(responseTime, success = true) {
        this.metrics.requests.total++;
        
        if (success) {
            this.metrics.requests.successful++;
        } else {
            this.metrics.requests.failed++;
        }

        // Actualizar tiempo promedio de respuesta
        this.metrics.requests.responseTimeHistory.push({
            timestamp: Date.now(),
            responseTime,
            success
        });

        if (this.metrics.requests.responseTimeHistory.length > 1000) {
            this.metrics.requests.responseTimeHistory = this.metrics.requests.responseTimeHistory.slice(-1000);
        }

        // Calcular promedio
        const recentTimes = this.metrics.requests.responseTimeHistory
            .slice(-100)
            .map(r => r.responseTime);
        
        this.metrics.requests.avgResponseTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
    }

    /**
     * REGISTRAR CARGA DE AGENTE
     */
    recordAgentLoad(agentName, loadTime, success = true) {
        this.metrics.agents.loads++;
        
        if (success) {
            this.metrics.agents.activeAgents.add(agentName);
            
            // Actualizar tiempo promedio de carga
            if (this.metrics.agents.avgLoadTime === 0) {
                this.metrics.agents.avgLoadTime = loadTime;
            } else {
                this.metrics.agents.avgLoadTime = (this.metrics.agents.avgLoadTime + loadTime) / 2;
            }
        } else {
            this.metrics.agents.failures++;
        }
    }

    /**
     * REGISTRAR GENERACIÓN DE WORKFLOW
     */
    recordWorkflowGeneration(generationTime, success = true) {
        if (success) {
            this.metrics.workflows.generated++;
        } else {
            this.metrics.workflows.failed++;
        }

        this.metrics.workflows.generationTimeHistory.push({
            timestamp: Date.now(),
            generationTime,
            success
        });

        if (this.metrics.workflows.generationTimeHistory.length > 100) {
            this.metrics.workflows.generationTimeHistory = this.metrics.workflows.generationTimeHistory.slice(-100);
        }

        // Calcular promedio
        const recentTimes = this.metrics.workflows.generationTimeHistory
            .filter(w => w.success)
            .map(w => w.generationTime);
        
        if (recentTimes.length > 0) {
            this.metrics.workflows.avgGenerationTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
        }
    }

    /**
     * OBTENER RESUMEN DE MÉTRICAS
     */
    getMetricsSummary() {
        const uptime = Date.now() - this.metrics.startTime;
        const systemInfo = {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
            freememory: Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB',
            cpus: os.cpus().length
        };

        return {
            uptime: this.formatUptime(uptime),
            systemInfo,
            requests: {
                ...this.metrics.requests,
                successRate: this.metrics.requests.total > 0 ? 
                    Math.round((this.metrics.requests.successful / this.metrics.requests.total) * 100) : 0,
                failureRate: this.metrics.requests.total > 0 ? 
                    Math.round((this.metrics.requests.failed / this.metrics.requests.total) * 100) : 0
            },
            memory: {
                ...this.metrics.memory,
                trend: this.calculateTrend(this.metrics.memory.history.slice(-10).map(h => h.value))
            },
            cpu: {
                ...this.metrics.cpu,
                trend: this.calculateTrend(this.metrics.cpu.history.slice(-10).map(h => h.value))
            },
            agents: {
                ...this.metrics.agents,
                successRate: this.metrics.agents.loads > 0 ? 
                    Math.round(((this.metrics.agents.loads - this.metrics.agents.failures) / this.metrics.agents.loads) * 100) : 0,
                activeCount: this.metrics.agents.activeAgents.size
            },
            workflows: {
                ...this.metrics.workflows,
                successRate: (this.metrics.workflows.generated + this.metrics.workflows.failed) > 0 ? 
                    Math.round((this.metrics.workflows.generated / (this.metrics.workflows.generated + this.metrics.workflows.failed)) * 100) : 0
            }
        };
    }

    /**
     * CALCULAR TENDENCIA
     */
    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const first = values[0];
        const last = values[values.length - 1];
        const change = ((last - first) / first) * 100;
        
        if (change > 10) return 'increasing';
        if (change < -10) return 'decreasing';
        return 'stable';
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
}

/**
 * OPTIMIZADOR DE PERFORMANCE
 */
export class PerformanceOptimizer {
    
    constructor() {
        this.logger = new IntelligentLogger('PerformanceOptimizer');
        this.metrics = new SystemMetrics();
        this.optimizations = new Map();
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
    }

    /**
     * INICIALIZAR OPTIMIZADOR
     */
    initialize() {
        this.logger.info('🚀 Inicializando optimizador de performance');
        
        // Iniciar monitoreo si está habilitado
        if (CONFIG.performance.enableMemoryMonitoring) {
            this.metrics.startMonitoring(CONFIG.performance.memoryCheckInterval);
        }

        // Configurar cache si está habilitado
        if (CONFIG.performance.enableCache) {
            this.setupCache();
        }

        // Configurar cola de requests
        this.setupRequestQueue();

        this.logger.info('✅ Optimizador de performance inicializado');
    }

    /**
     * CONFIGURAR CACHE
     */
    setupCache() {
        this.logger.info('💾 Configurando sistema de cache');
        
        // Limpiar cache periódicamente
        setInterval(() => {
            this.cleanupCache();
        }, CONFIG.performance.cacheTimeout);
    }

    /**
     * CONFIGURAR COLA DE REQUESTS
     */
    setupRequestQueue() {
        this.logger.info('📋 Configurando cola de requests');
        
        // Procesar cola periódicamente
        setInterval(() => {
            this.processRequestQueue();
        }, 1000);
    }

    /**
     * PROCESAR COLA DE REQUESTS
     */
    async processRequestQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;
        const maxConcurrent = CONFIG.performance.maxConcurrentRequests;
        const batch = this.requestQueue.splice(0, maxConcurrent);

        try {
            await Promise.all(batch.map(request => this.executeRequest(request)));
        } catch (error) {
            this.logger.error('❌ Error procesando cola de requests', { error: error.message });
        } finally {
            this.isProcessingQueue = false;
        }
    }

    /**
     * EJECUTAR REQUEST
     */
    async executeRequest(request) {
        const startTime = performance.now();
        
        try {
            const result = await request.handler(...request.args);
            const responseTime = performance.now() - startTime;
            
            this.metrics.recordRequest(responseTime, true);
            
            if (request.resolve) {
                request.resolve(result);
            }
            
            return result;
            
        } catch (error) {
            const responseTime = performance.now() - startTime;
            this.metrics.recordRequest(responseTime, false);
            
            if (request.reject) {
                request.reject(error);
            }
            
            throw error;
        }
    }

    /**
     * AÑADIR REQUEST A LA COLA
     */
    queueRequest(handler, ...args) {
        return new Promise((resolve, reject) => {
            const request = {
                id: Date.now() + Math.random(),
                handler,
                args,
                resolve,
                reject,
                timestamp: Date.now()
            };

            this.requestQueue.push(request);

            // Timeout para requests en cola
            setTimeout(() => {
                const index = this.requestQueue.findIndex(r => r.id === request.id);
                if (index >= 0) {
                    this.requestQueue.splice(index, 1);
                    reject(new Error('Request timeout in queue'));
                }
            }, CONFIG.performance.queueTimeout);
        });
    }

    /**
     * OPTIMIZAR CARGA DE AGENTES
     */
    async optimizeAgentLoading(agentPath, agentName) {
        const startTime = performance.now();
        
        try {
            // Verificar cache primero
            if (this.cache.has(agentPath)) {
                const cached = this.cache.get(agentPath);
                if (Date.now() - cached.timestamp < CONFIG.performance.cacheTimeout) {
                    this.logger.debug(`📦 Agente ${agentName} cargado desde cache`);
                    return cached.agent;
                }
            }

            // Cargar agente con timeout
            const agent = await Promise.race([
                import(agentPath),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Agent loading timeout')), 
                    CONFIG.agents.initTimeout)
                )
            ]);

            const loadTime = performance.now() - startTime;
            
            // Cachear agente
            if (CONFIG.performance.enableCache) {
                this.cache.set(agentPath, {
                    agent,
                    timestamp: Date.now()
                });
            }

            this.metrics.recordAgentLoad(agentName, loadTime, true);
            
            this.logger.debug(`✅ Agente ${agentName} cargado en ${Math.round(loadTime)}ms`);
            
            return agent;

        } catch (error) {
            const loadTime = performance.now() - startTime;
            this.metrics.recordAgentLoad(agentName, loadTime, false);
            
            this.logger.error(`❌ Error cargando agente ${agentName}`, { 
                error: error.message,
                loadTime: Math.round(loadTime)
            });
            
            throw error;
        }
    }

    /**
     * OPTIMIZAR GENERACIÓN DE WORKFLOW
     */
    async optimizeWorkflowGeneration(generationFunction, prompt, context = {}) {
        const startTime = performance.now();
        
        try {
            // Verificar cache si está habilitado
            const cacheKey = this.generateCacheKey(prompt, context);
            if (CONFIG.performance.enableCache && this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < CONFIG.performance.cacheTimeout) {
                    this.logger.debug('📦 Workflow generado desde cache');
                    return cached.workflow;
                }
            }

            // Generar workflow con timeout
            const workflow = await Promise.race([
                generationFunction(prompt, context),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Workflow generation timeout')), 
                    CONFIG.workflow.maxGenerationTime)
                )
            ]);

            const generationTime = performance.now() - startTime;

            // Cachear resultado
            if (CONFIG.performance.enableCache) {
                this.cache.set(cacheKey, {
                    workflow,
                    timestamp: Date.now()
                });
            }

            this.metrics.recordWorkflowGeneration(generationTime, true);
            
            this.logger.debug(`✅ Workflow generado en ${Math.round(generationTime)}ms`);
            
            return workflow;

        } catch (error) {
            const generationTime = performance.now() - startTime;
            this.metrics.recordWorkflowGeneration(generationTime, false);
            
            this.logger.error('❌ Error en generación de workflow', { 
                error: error.message,
                generationTime: Math.round(generationTime)
            });
            
            throw error;
        }
    }

    /**
     * GENERAR CLAVE DE CACHE
     */
    generateCacheKey(prompt, context) {
        const data = JSON.stringify({ prompt, context });
        return `workflow_${this.simpleHash(data)}`;
    }

    /**
     * HASH SIMPLE
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * LIMPIAR CACHE
     */
    cleanupCache() {
        const now = Date.now();
        const timeout = CONFIG.performance.cacheTimeout;
        let cleaned = 0;

        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > timeout) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            this.logger.debug(`🧹 Cache limpiado: ${cleaned} entradas removidas`);
        }

        // Limitar tamaño máximo del cache
        if (this.cache.size > CONFIG.performance.maxCacheSize) {
            const excess = this.cache.size - CONFIG.performance.maxCacheSize;
            const keys = Array.from(this.cache.keys()).slice(0, excess);
            
            keys.forEach(key => this.cache.delete(key));
            
            this.logger.debug(`📏 Cache limitado: ${excess} entradas removidas por tamaño`);
        }
    }

    /**
     * OBTENER ESTADÍSTICAS DE PERFORMANCE
     */
    getPerformanceStats() {
        return {
            metrics: this.metrics.getMetricsSummary(),
            cache: {
                size: this.cache.size,
                maxSize: CONFIG.performance.maxCacheSize,
                enabled: CONFIG.performance.enableCache
            },
            queue: {
                pending: this.requestQueue.length,
                maxConcurrent: CONFIG.performance.maxConcurrentRequests,
                isProcessing: this.isProcessingQueue
            },
            optimizations: Array.from(this.optimizations.entries()).map(([key, value]) => ({
                key,
                ...value
            }))
        };
    }

    /**
     * GENERAR REPORTE DE PERFORMANCE
     */
    generatePerformanceReport() {
        const stats = this.getPerformanceStats();
        const recommendations = this.generateOptimizationRecommendations(stats);

        return {
            timestamp: new Date().toISOString(),
            summary: {
                uptime: stats.metrics.uptime,
                memoryUsage: `${stats.metrics.memory.current}MB`,
                cpuUsage: `${stats.metrics.cpu.current}%`,
                requestSuccessRate: `${stats.metrics.requests.successRate}%`,
                workflowSuccessRate: `${stats.metrics.workflows.successRate}%`
            },
            details: stats,
            recommendations,
            alerts: this.generateAlerts(stats)
        };
    }

    /**
     * GENERAR RECOMENDACIONES DE OPTIMIZACIÓN
     */
    generateOptimizationRecommendations(stats) {
        const recommendations = [];

        // Memoria
        if (stats.metrics.memory.current > 400) {
            recommendations.push('🧠 Considerar aumentar límite de memoria o optimizar uso');
        }

        // CPU
        if (stats.metrics.cpu.current > 70) {
            recommendations.push('⚡ Alto uso de CPU - revisar procesos intensivos');
        }

        // Cache
        if (!CONFIG.performance.enableCache) {
            recommendations.push('💾 Habilitar cache para mejorar performance');
        }

        // Requests
        if (stats.metrics.requests.avgResponseTime > 5000) {
            recommendations.push('⏱️ Tiempo de respuesta alto - optimizar procesamiento');
        }

        // Cola
        if (stats.queue.pending > 10) {
            recommendations.push('📋 Cola de requests saturada - aumentar concurrencia');
        }

        return recommendations;
    }

    /**
     * GENERAR ALERTAS
     */
    generateAlerts(stats) {
        const alerts = [];

        if (stats.metrics.memory.current > 450) {
            alerts.push({ level: 'warning', message: 'Alto uso de memoria' });
        }

        if (stats.metrics.cpu.current > 80) {
            alerts.push({ level: 'warning', message: 'Alto uso de CPU' });
        }

        if (stats.metrics.requests.successRate < 95) {
            alerts.push({ level: 'error', message: 'Baja tasa de éxito en requests' });
        }

        if (stats.queue.pending > 20) {
            alerts.push({ level: 'warning', message: 'Cola de requests saturada' });
        }

        return alerts;
    }

    /**
     * CERRAR OPTIMIZADOR
     */
    shutdown() {
        this.logger.info('🛑 Cerrando optimizador de performance');
        
        this.metrics.stopMonitoring();
        this.cache.clear();
        this.requestQueue.length = 0;
        
        this.logger.info('✅ Optimizador cerrado correctamente');
    }
}

// Instancia global del optimizador
export const performanceOptimizer = new PerformanceOptimizer();

export default PerformanceOptimizer;
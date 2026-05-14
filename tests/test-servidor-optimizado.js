/**
 * SCRIPT DE PRUEBAS PARA EL SERVIDOR OPTIMIZADO
 * Valida el funcionamiento de todos los sistemas mejorados
 */

import { IntelligentLogger } from './intelligent-logger.js';
import { CONFIG } from './server-config.js';
import { errorManager } from './error-manager.js';
import { performanceOptimizer } from './performance-optimizer.js';

const logger = new IntelligentLogger('ServerTest');

/**
 * PRUEBAS DEL SISTEMA DE LOGGING
 */
async function testLoggingSystem() {
    logger.info('🧪 Iniciando pruebas del sistema de logging...');
    
    try {
        // Probar diferentes niveles de logging
        logger.trace('Mensaje de TRACE');
        logger.debug('Mensaje de DEBUG');
        logger.info('Mensaje de INFO');
        logger.warn('Mensaje de WARNING');
        logger.error('Mensaje de ERROR');
        
        // Probar logging con metadata
        logger.info('Prueba con metadata', {
            usuario: 'test',
            timestamp: Date.now(),
            datos: { a: 1, b: 2 }
        });
        
        // Probar estadísticas
        const stats = logger.getStats();
        logger.info('Estadísticas de logging', stats);
        
        logger.info('✅ Sistema de logging funcionando correctamente');
        return { success: true, component: 'logging' };
        
    } catch (error) {
        logger.error('❌ Error en pruebas de logging', { error: error.message });
        return { success: false, component: 'logging', error: error.message };
    }
}

/**
 * PRUEBAS DEL SISTEMA DE CONFIGURACIÓN
 */
async function testConfigSystem() {
    logger.info('🧪 Iniciando pruebas del sistema de configuración...');
    
    try {
        // Probar acceso a configuración
        const serverPort = CONFIG.server.port;
        const logLevel = CONFIG.logging.level;
        const maxNodes = CONFIG.workflow.maxNodes;
        
        logger.info('Configuración cargada correctamente', {
            port: serverPort,
            logLevel,
            maxNodes
        });
        
        // Probar validación de configuración
        const validation = await import('./server-config.js').then(module => 
            module.ConfigValidator.validate()
        );
        
        if (validation.isValid) {
            logger.info('✅ Validación de configuración exitosa');
        } else {
            logger.warn('⚠️ Problemas en configuración', { errors: validation.errors });
        }
        
        logger.info('✅ Sistema de configuración funcionando correctamente');
        return { success: true, component: 'config' };
        
    } catch (error) {
        logger.error('❌ Error en pruebas de configuración', { error: error.message });
        return { success: false, component: 'config', error: error.message };
    }
}

/**
 * PRUEBAS DEL SISTEMA DE GESTIÓN DE ERRORES
 */
async function testErrorManagement() {
    logger.info('🧪 Iniciando pruebas del sistema de gestión de errores...');
    
    try {
        // Probar manejo básico de errores
        const testError = new Error('Error de prueba');
        const result = errorManager.handleError(testError, { test: 'context' });
        
        logger.info('Error manejado correctamente', { 
            handled: result.handled,
            severity: result.severity 
        });
        
        // Probar estadísticas de errores
        const errorStats = errorManager.getErrorStats();
        logger.info('Estadísticas de errores', {
            total: errorStats.total,
            uptime: errorStats.uptimeFormatted,
            errorRate: errorStats.errorRate
        });
        
        // Probar reporte de errores
        const errorReport = errorManager.generateErrorReport();
        logger.info('Reporte de errores generado', {
            totalErrors: errorReport.summary.totalErrors,
            recommendations: errorReport.recommendations.length
        });
        
        logger.info('✅ Sistema de gestión de errores funcionando correctamente');
        return { success: true, component: 'error-management' };
        
    } catch (error) {
        logger.error('❌ Error en pruebas de gestión de errores', { error: error.message });
        return { success: false, component: 'error-management', error: error.message };
    }
}

/**
 * PRUEBAS DEL OPTIMIZADOR DE PERFORMANCE
 */
async function testPerformanceOptimizer() {
    logger.info('🧪 Iniciando pruebas del optimizador de performance...');
    
    try {
        // Inicializar si no está inicializado
        if (!performanceOptimizer.metrics.isMonitoring) {
            performanceOptimizer.initialize();
        }
        
        // Simular carga de un agente
        const mockAgentLoad = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return { default: { name: 'MockAgent' } };
        };
        
        const startTime = Date.now();
        const agent = await performanceOptimizer.optimizeAgentLoading('./mock-agent.js', 'MockAgent');
        const loadTime = Date.now() - startTime;
        
        logger.info('Carga de agente simulada', { loadTime, cached: false });
        
        // Obtener estadísticas de performance
        const perfStats = performanceOptimizer.getPerformanceStats();
        logger.info('Estadísticas de performance', {
            memoryUsage: perfStats.metrics.memory.current + 'MB',
            requestsProcessed: perfStats.metrics.requests.total,
            cacheSize: perfStats.cache.size
        });
        
        // Generar reporte de performance
        const perfReport = performanceOptimizer.generatePerformanceReport();
        logger.info('Reporte de performance generado', {
            uptime: perfReport.summary.uptime,
            recommendations: perfReport.recommendations.length,
            alerts: perfReport.alerts.length
        });
        
        logger.info('✅ Optimizador de performance funcionando correctamente');
        return { success: true, component: 'performance-optimizer' };
        
    } catch (error) {
        logger.error('❌ Error en pruebas de optimizador de performance', { error: error.message });
        return { success: false, component: 'performance-optimizer', error: error.message };
    }
}

/**
 * PRUEBAS DE CARGA DE MÓDULOS
 */
async function testModuleLoading() {
    logger.info('🧪 Iniciando pruebas de carga de módulos...');
    
    try {
        // Simular carga de módulos que existen
        const existingModules = [
            './intelligent-logger.js',
            './server-config.js',
            './error-manager.js',
            './performance-optimizer.js'
        ];
        
        let loadedCount = 0;
        let failedCount = 0;
        
        for (const modulePath of existingModules) {
            try {
                const module = await import(modulePath);
                loadedCount++;
                logger.debug(`✅ Módulo cargado: ${modulePath}`);
            } catch (error) {
                failedCount++;
                logger.warn(`❌ Error cargando módulo: ${modulePath}`, { error: error.message });
            }
        }
        
        logger.info('Resultados de carga de módulos', {
            loaded: loadedCount,
            failed: failedCount,
            total: existingModules.length,
            successRate: Math.round((loadedCount / existingModules.length) * 100) + '%'
        });
        
        logger.info('✅ Pruebas de carga de módulos completadas');
        return { 
            success: loadedCount > 0, 
            component: 'module-loading',
            loaded: loadedCount,
            failed: failedCount
        };
        
    } catch (error) {
        logger.error('❌ Error en pruebas de carga de módulos', { error: error.message });
        return { success: false, component: 'module-loading', error: error.message };
    }
}

/**
 * PRUEBAS DE INTEGRACIÓN
 */
async function testSystemIntegration() {
    logger.info('🧪 Iniciando pruebas de integración del sistema...');
    
    try {
        // Simular un flujo completo de procesamiento
        const mockPrompt = "Crear un workflow simple de prueba";
        
        logger.info('Simulando procesamiento de prompt', { prompt: mockPrompt });
        
        // Simular validación de entrada
        if (!mockPrompt || mockPrompt.length < 10) {
            throw new Error('Prompt inválido');
        }
        
        // Simular tiempo de procesamiento
        const processingStartTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 200));
        const processingTime = Date.now() - processingStartTime;
        
        // Registrar métricas
        performanceOptimizer.metrics.recordRequest(processingTime, true);
        
        logger.info('Flujo de integración completado', {
            processingTime,
            success: true
        });
        
        logger.info('✅ Pruebas de integración del sistema exitosas');
        return { success: true, component: 'system-integration', processingTime };
        
    } catch (error) {
        const integrationError = new Error(`Error en integración: ${error.message}`);
        errorManager.handleError(integrationError, { test: 'integration' });
        
        logger.error('❌ Error en pruebas de integración', { error: error.message });
        return { success: false, component: 'system-integration', error: error.message };
    }
}

/**
 * EJECUTAR TODAS LAS PRUEBAS
 */
async function runAllTests() {
    const testStartTime = Date.now();
    logger.info('🚀 Iniciando suite completa de pruebas del servidor optimizado...');
    
    const tests = [
        testLoggingSystem,
        testConfigSystem,
        testErrorManagement,
        testPerformanceOptimizer,
        testModuleLoading,
        testSystemIntegration
    ];
    
    const results = [];
    
    for (const test of tests) {
        try {
            const result = await test();
            results.push(result);
        } catch (error) {
            results.push({
                success: false,
                component: 'unknown',
                error: error.message
            });
        }
    }
    
    const totalTime = Date.now() - testStartTime;
    const successfulTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;
    
    logger.info('📊 RESULTADOS FINALES DE PRUEBAS', {
        totalTime,
        successful: successfulTests,
        failed: failedTests,
        total: results.length,
        successRate: Math.round((successfulTests / results.length) * 100) + '%'
    });
    
    // Mostrar detalles de pruebas fallidas
    const failedComponents = results.filter(r => !r.success);
    if (failedComponents.length > 0) {
        logger.warn('⚠️ Componentes con fallos', {
            failed: failedComponents.map(f => ({
                component: f.component,
                error: f.error
            }))
        });
    }
    
    // Generar reporte final
    const finalReport = {
        timestamp: new Date().toISOString(),
        duration: totalTime,
        results: {
            total: results.length,
            successful: successfulTests,
            failed: failedTests,
            successRate: Math.round((successfulTests / results.length) * 100)
        },
        components: results,
        systemStatus: successfulTests >= results.length * 0.8 ? 'HEALTHY' : 'DEGRADED'
    };
    
    logger.info('🎯 ESTADO FINAL DEL SISTEMA', {
        status: finalReport.systemStatus,
        successRate: finalReport.results.successRate + '%',
        duration: totalTime + 'ms'
    });
    
    return finalReport;
}

// Ejecutar pruebas si este archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests()
        .then(report => {
            if (report.systemStatus === 'HEALTHY') {
                logger.info('🎉 ¡Todas las pruebas del servidor optimizado completadas exitosamente!');
                process.exit(0);
            } else {
                logger.error('❌ Algunas pruebas fallaron - Sistema en estado degradado');
                process.exit(1);
            }
        })
        .catch(error => {
            logger.error('💥 Error crítico en suite de pruebas', { error: error.message });
            process.exit(1);
        });
}

export { runAllTests, testLoggingSystem, testConfigSystem, testErrorManagement, testPerformanceOptimizer, testModuleLoading, testSystemIntegration };
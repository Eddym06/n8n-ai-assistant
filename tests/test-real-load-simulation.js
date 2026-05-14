/**
 * SIMULACIÓN DE CARGA REAL - EXTENSION SERVER OFICIAL
 * ===================================================
 * Simula el comportamiento real del extension server bajo diferentes
 * escenarios de carga y tipos de consultas que los usuarios reales harían.
 */

import WorkflowVectorSearchEngine from './SISTEMA PRINCIPAL/workflow-vector-search-engine-esm.js';
import fs from 'fs';
import path from 'path';

class RealLoadSimulator {
    constructor() {
        this.searchEngine = null;
        this.testResults = [];
        this.concurrentUsers = [1, 5, 10, 20, 50]; // Escalado progresivo
        this.realQueries = [
            // Consultas típicas de usuarios reales
            "automation email sending",
            "webhook data processing", 
            "database sync workflow",
            "telegram bot notifications",
            "slack integration alerts",
            "csv file processing",
            "api data transformation",
            "scheduled task automation",
            "form submission handling",
            "social media posting",
            "payment processing flow",
            "inventory management",
            "customer support automation",
            "backup and sync",
            "report generation",
            "user authentication flow",
            "file upload processing",
            "notification system",
            "data validation workflow",
            "monitoring and alerts"
        ];
    }

    async initialize() {
        console.log('🚀 INICIALIZANDO SIMULACIÓN DE CARGA REAL...\n');
        
        const vectorDbPath = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\Workflows Vectorizados Oficial';
        
        if (!fs.existsSync(vectorDbPath)) {
            throw new Error(`❌ Base de datos no encontrada: ${vectorDbPath}`);
        }

        console.log('📊 Inicializando motor de búsqueda...');
        this.searchEngine = new WorkflowVectorSearchEngine(vectorDbPath);
        await this.searchEngine.initialize();
        
        const stats = this.searchEngine.getStats();
        console.log(`✅ Motor inicializado: ${stats.totalWorkflows} workflows en ${stats.totalCategories} categorías\n`);
    }

    // Simula una sesión de usuario real con múltiples búsquedas
    async simulateUserSession() {
        const sessionQueries = this.getRandomQueries(3, 7); // Entre 3 y 7 búsquedas por sesión
        const sessionResults = [];

        for (const query of sessionQueries) {
            const startTime = performance.now();
            
            try {
                const results = await this.searchEngine.searchSimilarWorkflows(query, { maxResults: 10 });
                const endTime = performance.now();
                const responseTime = endTime - startTime;

                sessionResults.push({
                    query,
                    responseTime,
                    resultsCount: results.length,
                    success: true,
                    topSimilarity: results.length > 0 ? results[0].similarity : 0
                });

                // Simular tiempo de usuario leyendo resultados
                await this.sleep(Math.random() * 2000 + 500); // 0.5-2.5 segundos

            } catch (error) {
                sessionResults.push({
                    query,
                    responseTime: -1,
                    resultsCount: 0,
                    success: false,
                    error: error.message
                });
            }
        }

        return sessionResults;
    }

    // Simula múltiples usuarios concurrentes
    async simulateConcurrentLoad(userCount) {
        console.log(`\n🔄 SIMULANDO ${userCount} USUARIOS CONCURRENTES`);
        console.log('=' .repeat(50));

        const startTime = performance.now();
        const userPromises = [];

        // Crear promesas para usuarios concurrentes
        for (let i = 0; i < userCount; i++) {
            userPromises.push(this.simulateUserSession());
        }

        // Ejecutar todas las sesiones de usuario en paralelo
        const allSessionResults = await Promise.all(userPromises);
        const endTime = performance.now();

        // Agregar y analizar resultados
        const flatResults = allSessionResults.flat();
        const totalQueries = flatResults.length;
        const successfulQueries = flatResults.filter(r => r.success).length;
        const avgResponseTime = flatResults
            .filter(r => r.success)
            .reduce((sum, r) => sum + r.responseTime, 0) / successfulQueries;
        const maxResponseTime = Math.max(...flatResults.filter(r => r.success).map(r => r.responseTime));
        const minResponseTime = Math.min(...flatResults.filter(r => r.success).map(r => r.responseTime));

        const loadTestResult = {
            userCount,
            totalDuration: endTime - startTime,
            totalQueries,
            successfulQueries,
            failedQueries: totalQueries - successfulQueries,
            successRate: (successfulQueries / totalQueries) * 100,
            avgResponseTime,
            maxResponseTime,
            minResponseTime,
            queriesPerSecond: totalQueries / ((endTime - startTime) / 1000)
        };

        this.displayLoadTestResults(loadTestResult);
        return loadTestResult;
    }

    displayLoadTestResults(result) {
        console.log(`📈 Usuarios concurrentes: ${result.userCount}`);
        console.log(`⏱️  Duración total: ${result.totalDuration.toFixed(2)}ms`);
        console.log(`🔍 Total consultas: ${result.totalQueries}`);
        console.log(`✅ Consultas exitosas: ${result.successfulQueries}`);
        console.log(`❌ Consultas fallidas: ${result.failedQueries}`);
        console.log(`📊 Tasa de éxito: ${result.successRate.toFixed(1)}%`);
        console.log(`⚡ Tiempo respuesta promedio: ${result.avgResponseTime.toFixed(2)}ms`);
        console.log(`🔥 Tiempo respuesta máximo: ${result.maxResponseTime.toFixed(2)}ms`);
        console.log(`💨 Tiempo respuesta mínimo: ${result.minResponseTime.toFixed(2)}ms`);
        console.log(`🚀 Consultas por segundo: ${result.queriesPerSecond.toFixed(2)}`);
        
        // Evaluación de rendimiento
        const performance = this.evaluatePerformance(result);
        console.log(`🎯 EVALUACIÓN: ${performance.rating} - ${performance.description}`);
    }

    evaluatePerformance(result) {
        if (result.successRate < 95) {
            return { rating: '❌ CRÍTICO', description: 'Tasa de éxito muy baja' };
        }
        
        if (result.avgResponseTime > 200) {
            return { rating: '⚠️ DEFICIENTE', description: 'Tiempo de respuesta muy alto' };
        }
        
        if (result.avgResponseTime > 100) {
            return { rating: '🔶 REGULAR', description: 'Tiempo de respuesta alto' };
        }
        
        if (result.avgResponseTime > 50) {
            return { rating: '🟡 BUENO', description: 'Rendimiento aceptable' };
        }
        
        return { rating: '🟢 EXCELENTE', description: 'Rendimiento óptimo' };
    }

    // Simula un pico de tráfico repentino
    async simulateTrafficSpike() {
        console.log('\n🔥 SIMULANDO PICO DE TRÁFICO REPENTINO');
        console.log('=' .repeat(50));
        
        // Simular 100 consultas simultáneas en ráfaga
        const spikePromises = [];
        const spikeQuery = "email automation workflow"; // Query popular
        
        console.log('⚡ Ejecutando 100 consultas simultáneas...');
        
        const startTime = performance.now();
        
        for (let i = 0; i < 100; i++) {
            spikePromises.push(this.searchEngine.searchSimilarWorkflows(spikeQuery, { maxResults: 5 }));
        }
        
        const results = await Promise.all(spikePromises);
        const endTime = performance.now();
        
        const spikeResults = {
            totalQueries: 100,
            totalDuration: endTime - startTime,
            queriesPerSecond: 100 / ((endTime - startTime) / 1000),
            averageResults: results.reduce((sum, r) => sum + r.length, 0) / results.length
        };
        
        console.log(`⏱️  Duración del pico: ${spikeResults.totalDuration.toFixed(2)}ms`);
        console.log(`🚀 Consultas por segundo: ${spikeResults.queriesPerSecond.toFixed(2)}`);
        console.log(`📊 Promedio resultados: ${spikeResults.averageResults.toFixed(1)}`);
        
        if (spikeResults.totalDuration < 5000) {
            console.log('🟢 PICO MANEJADO EXITOSAMENTE - Sistema estable bajo carga');
        } else {
            console.log('⚠️ PICO PROBLEMÁTICO - Sistema lento bajo carga extrema');
        }
        
        return spikeResults;
    }

    // Obtiene consultas aleatorias
    getRandomQueries(min, max) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...this.realQueries].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Ejecuta toda la simulación
    async runFullSimulation() {
        console.log('🎯 INICIANDO SIMULACIÓN COMPLETA DE CARGA REAL');
        console.log('='.repeat(60));
        
        await this.initialize();
        
        // 1. Pruebas de carga escalada
        for (const userCount of this.concurrentUsers) {
            const result = await this.simulateConcurrentLoad(userCount);
            this.testResults.push(result);
            
            // Pausa entre pruebas para estabilizar
            await this.sleep(2000);
        }
        
        // 2. Prueba de pico de tráfico
        const spikeResult = await this.simulateTrafficSpike();
        
        // 3. Resumen final
        this.displayFinalSummary();
        
        return {
            loadTests: this.testResults,
            trafficSpike: spikeResult
        };
    }

    displayFinalSummary() {
        console.log('\n🏆 RESUMEN FINAL DE LA SIMULACIÓN');
        console.log('='.repeat(60));
        
        console.log('\n📊 RESULTADOS POR NIVEL DE CARGA:');
        this.testResults.forEach((result, index) => {
            console.log(`${index + 1}. ${result.userCount} usuarios: ${result.avgResponseTime.toFixed(2)}ms promedio, ${result.successRate.toFixed(1)}% éxito`);
        });
        
        // Encontrar el punto de saturación
        const saturationPoint = this.findSaturationPoint();
        if (saturationPoint) {
            console.log(`\n⚠️  PUNTO DE SATURACIÓN: ~${saturationPoint} usuarios concurrentes`);
        } else {
            console.log('\n🎉 SIN PUNTO DE SATURACIÓN DETECTADO - Sistema muy robusto');
        }
        
        // Recomendaciones
        console.log('\n💡 RECOMENDACIONES:');
        const lastResult = this.testResults[this.testResults.length - 1];
        if (lastResult.avgResponseTime < 100) {
            console.log('✅ El sistema está listo para producción');
            console.log('✅ Puede manejar alta concurrencia sin problemas');
        } else {
            console.log('⚠️  Considerar optimizaciones adicionales para alta carga');
        }
    }

    findSaturationPoint() {
        for (let i = 1; i < this.testResults.length; i++) {
            const current = this.testResults[i];
            const previous = this.testResults[i - 1];
            
            // Si el tiempo de respuesta se duplica o la tasa de éxito cae significativamente
            if (current.avgResponseTime > previous.avgResponseTime * 2 || 
                current.successRate < previous.successRate - 10) {
                return current.userCount;
            }
        }
        return null;
    }
}

// Ejecutar simulación
async function main() {
    try {
        const simulator = new RealLoadSimulator();
        await simulator.runFullSimulation();
    } catch (error) {
        console.error('❌ Error en la simulación:', error.message);
        process.exit(1);
    }
}

main();
/**
 * Test de Validación Simplificado con Optimizaciones API
 * Verifica que el sistema funcione con mínimas llamadas API
 */

import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';

class SimplifiedValidator {
    constructor() {
        this.system = new V4UltraHybridSystem();
        this.testPrompts = [
            "Crear workflow simple de webhook a email",
            "Workflow básico de procesamiento de datos",
            "Sistema simple de notificaciones"
        ];
    }

    /**
     * Test ultra-ligero con foco en eficiencia API
     */
    async runOptimizedValidation() {
        console.log('🚀 INICIANDO VALIDACIÓN OPTIMIZADA');
        console.log('==========================================');
        
        const startTime = Date.now();
        const results = [];
        let totalApiCalls = 0;
        
        try {
            for (let i = 0; i < this.testPrompts.length; i++) {
                const prompt = this.testPrompts[i];
                console.log(`\n📋 Test ${i + 1}/3: ${prompt}`);
                console.log('-'.repeat(50));
                
                const testStart = Date.now();
                
                try {
                    const result = await this.system.generateWorkflow(prompt, {
                        mode: 'efficiency',
                        skipDetailedValidation: true,
                        maxNodes: 5, // Limitar complejidad
                        prioritizeSpeed: true
                    });
                    
                    const testTime = Date.now() - testStart;
                    
                    // Estimar API calls (será más preciso con el API optimizer)
                    const estimatedCalls = this.estimateAPICalls(result);
                    totalApiCalls += estimatedCalls;
                    
                    const testResult = {
                        prompt,
                        success: result.success,
                        quality: result.quality || 0,
                        nodeCount: result.workflow?.nodes?.length || 0,
                        processingTime: testTime,
                        estimatedApiCalls: estimatedCalls,
                        method: result.method || 'unknown'
                    };
                    
                    results.push(testResult);
                    
                    console.log(`✅ Resultado: Calidad ${testResult.quality}% | ${testResult.nodeCount} nodos | ${testTime}ms`);
                    console.log(`📞 Estimado: ~${estimatedCalls} API calls`);
                    
                    // Pausa entre tests para respetar rate limits
                    if (i < this.testPrompts.length - 1) {
                        console.log('⏳ Pausa entre tests...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                } catch (error) {
                    console.log(`❌ Error en test ${i + 1}: ${error.message}`);
                    results.push({
                        prompt,
                        success: false,
                        error: error.message,
                        processingTime: Date.now() - testStart,
                        estimatedApiCalls: 1
                    });
                    totalApiCalls += 1;
                }
            }
            
        } catch (globalError) {
            console.error(`💥 Error global: ${globalError.message}`);
        }
        
        const totalTime = Date.now() - startTime;
        
        // Generar reporte final
        console.log('\n🎯 REPORTE DE VALIDACIÓN OPTIMIZADA');
        console.log('=====================================');
        
        const successfulTests = results.filter(r => r.success);
        const avgQuality = successfulTests.length > 0 
            ? successfulTests.reduce((sum, r) => sum + (r.quality || 0), 0) / successfulTests.length 
            : 0;
        const avgTime = results.length > 0 
            ? results.reduce((sum, r) => sum + r.processingTime, 0) / results.length 
            : 0;
        
        console.log(`📊 Tests ejecutados: ${results.length}`);
        console.log(`✅ Tests exitosos: ${successfulTests.length}`);
        console.log(`📈 Tasa de éxito: ${Math.round((successfulTests.length / results.length) * 100)}%`);
        console.log(`🎯 Calidad promedio: ${Math.round(avgQuality)}%`);
        console.log(`⏱️ Tiempo promedio: ${Math.round(avgTime)}ms`);
        console.log(`📞 Total API calls estimadas: ${totalApiCalls}`);
        console.log(`⚡ Throughput: ${Math.round((results.length / totalTime) * 1000 * 60)} workflows/min`);
        
        // Evaluación de eficiencia
        const efficiency = this.evaluateEfficiency(totalApiCalls, successfulTests.length, avgTime);
        console.log(`\n🏆 EVALUACIÓN DE EFICIENCIA: ${efficiency.rating}`);
        console.log(`   ${efficiency.description}`);
        
        // Detalles por test
        console.log('\n📋 DETALLES POR TEST:');
        results.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            console.log(`   ${status} Test ${index + 1}: ${result.quality || 0}% | ${result.processingTime}ms | ~${result.estimatedApiCalls} calls`);
        });
        
        return {
            summary: {
                totalTests: results.length,
                successful: successfulTests.length,
                successRate: Math.round((successfulTests.length / results.length) * 100),
                avgQuality: Math.round(avgQuality),
                avgTime: Math.round(avgTime),
                totalApiCalls,
                efficiency: efficiency.rating
            },
            results,
            duration: totalTime
        };
    }
    
    /**
     * Estima el número de API calls basado en el resultado
     */
    estimateAPICalls(result) {
        let calls = 1; // Al menos 1 call para generación principal
        
        // Estimar calls adicionales basados en complejidad
        if (result.workflow) {
            const nodeCount = result.workflow.nodes?.length || 0;
            if (nodeCount > 3) calls += 1; // Call adicional para workflows complejos
        }
        
        // Estimar calls de post-procesamiento
        if (result.method && result.method.includes('coherence')) {
            calls += 1; // FlowCoherenceAgent call
        }
        
        return calls;
    }
    
    /**
     * Evalúa la eficiencia general del sistema
     */
    evaluateEfficiency(totalApiCalls, successfulTests, avgTime) {
        const callsPerSuccess = successfulTests > 0 ? totalApiCalls / successfulTests : Infinity;
        
        if (callsPerSuccess <= 2 && avgTime < 5000) {
            return {
                rating: '🌟 EXCELENTE',
                description: 'Sistema ultra-eficiente, bajo consumo API y tiempos rápidos'
            };
        } else if (callsPerSuccess <= 4 && avgTime < 10000) {
            return {
                rating: '🟢 BUENO',
                description: 'Sistema eficiente con consumo API controlado'
            };
        } else if (callsPerSuccess <= 8 && avgTime < 20000) {
            return {
                rating: '🟡 MODERADO',
                description: 'Sistema funcional pero puede mejorar eficiencia'
            };
        } else {
            return {
                rating: '🔴 NECESITA OPTIMIZACIÓN',
                description: 'Alto consumo API o tiempos lentos, requiere mejoras'
            };
        }
    }
}

// Ejecutar validación si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new SimplifiedValidator();
    validator.runOptimizedValidation()
        .then(results => {
            console.log('\n✅ Validación completada exitosamente');
            process.exit(0);
        })
        .catch(error => {
            console.error(`💥 Error en validación: ${error.message}`);
            process.exit(1);
        });
}

export default SimplifiedValidator;
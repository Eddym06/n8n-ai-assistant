import dotenv from 'dotenv';
import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';

dotenv.config();

console.log('🎯 VALIDACIÓN INTEGRAL FINAL V4 ULTRA');
console.log('=====================================');

class ComprehensiveSystemValidator {
    constructor() {
        this.v4Ultra = new V4UltraHybridSystem();
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
    }

    async runCompleteValidation() {
        console.log('🚀 Iniciando validación integral completa...\n');

        // Test 1: Prompts simples (usuarios novatos)
        await this.testSimplePrompts();

        // Test 2: Prompts intermedios (usuarios técnicos)
        await this.testIntermediatePrompts();

        // Test 3: Prompts complejos (usuarios expertos)
        await this.testComplexPrompts();

        // Test 4: Casos edge y problemas conocidos
        await this.testEdgeCases();

        // Test 5: Rendimiento y escalabilidad
        await this.testPerformance();

        // Resultados finales
        this.generateFinalReport();

        return this.testResults;
    }

    async testSimplePrompts() {
        console.log('📝 TEST 1: PROMPTS SIMPLES');
        console.log('----------------------------');

        const simplePrompts = [
            "crear un webhook que reciba datos",
            "enviar emails automaticamente",
            "conectar con google sheets",
            "procesar archivos csv",
            "notificar por slack"
        ];

        for (const prompt of simplePrompts) {
            await this.runSingleTest('SIMPLE', prompt, {
                expectedNodes: [2, 6],
                expectedQuality: [70, 100],
                maxTime: 30000
            });
        }
    }

    async testIntermediatePrompts() {
        console.log('\n📋 TEST 2: PROMPTS INTERMEDIOS');
        console.log('-------------------------------');

        const intermediatePrompts = [
            "crear un workflow que sincronice datos entre CRM y base de datos MySQL",
            "automatizar proceso de onboarding con validación de documentos",
            "integrar API de pagos con notificaciones por email y SMS",
            "workflow de análisis de sentimientos en redes sociales",
            "sistema de backup automático con compresión y encriptación"
        ];

        for (const prompt of intermediatePrompts) {
            await this.runSingleTest('INTERMEDIATE', prompt, {
                expectedNodes: [5, 15],
                expectedQuality: [75, 100],
                maxTime: 45000
            });
        }
    }

    async testComplexPrompts() {
        console.log('\n🎯 TEST 3: PROMPTS COMPLEJOS');
        console.log('-----------------------------');

        const complexPrompts = [
            `Crear un sistema completo de e-commerce que:
            1. Reciba pedidos por webhook desde múltiples plataformas
            2. Valide datos del cliente usando IA
            3. Procese pagos con Stripe y PayPal
            4. Gestione inventario en tiempo real
            5. Envíe confirmaciones por email y SMS
            6. Actualice CRM (Salesforce) y ERP
            7. Genere reportes analytics
            8. Maneje devoluciones y reembolsos
            9. Integre con sistemas de envío (FedEx, UPS)
            10. Implemente seguimiento y notificaciones push`,

            `Sistema de gestión de leads inteligente que:
            - Capture leads de múltiples fuentes (web, redes sociales, eventos)
            - Clasifique leads usando machine learning
            - Asigne automáticamente a vendedores según criterios
            - Ejecute secuencias de nurturing personalizadas
            - Integre con calendarios para agendar reuniones
            - Trackee interacciones y engagement
            - Genere reportes predictivos de conversión
            - Sincronice con HubSpot y Salesforce
            - Maneje escalaciones automáticas
            - Implemente scoring dinámico de leads`,

            `Plataforma de automatización de recursos humanos que:
            - Gestione procesos de reclutamiento end-to-end
            - Automatice screening de CVs con IA
            - Coordine entrevistas y evaluaciones
            - Maneje onboarding de nuevos empleados
            - Automatice evaluaciones de desempeño
            - Gestione vacaciones y permisos
            - Procese nóminas y beneficios
            - Maneje offboarding y documentación
            - Genere analytics de talento y retención
            - Integre con sistemas de HRIS existentes`
        ];

        for (const prompt of complexPrompts) {
            await this.runSingleTest('COMPLEX', prompt, {
                expectedNodes: [15, 50],
                expectedQuality: [80, 100],
                maxTime: 60000
            });
        }
    }

    async testEdgeCases() {
        console.log('\n⚠️ TEST 4: CASOS EDGE');
        console.log('----------------------');

        const edgeCases = [
            {
                name: "Prompt muy corto",
                prompt: "webhook",
                expected: { nodes: [1, 3], quality: [60, 100] }
            },
            {
                name: "Prompt con caracteres especiales",
                prompt: "crear workflow con símbolos: @#$%^&*()+={}[]|;:,.<>?",
                expected: { nodes: [2, 5], quality: [65, 100] }
            },
            {
                name: "Prompt en mayúsculas",
                prompt: "CREAR UN SISTEMA DE NOTIFICACIONES MASIVAS",
                expected: { nodes: [3, 8], quality: [70, 100] }
            },
            {
                name: "Prompt con números y fechas",
                prompt: "automatizar reporte diario a las 9:00 AM con datos de últimas 24 horas",
                expected: { nodes: [4, 10], quality: [75, 100] }
            },
            {
                name: "Prompt multiidioma mezclado",
                prompt: "crear workflow para process automation with gestión de datos",
                expected: { nodes: [3, 8], quality: [70, 100] }
            }
        ];

        for (const testCase of edgeCases) {
            await this.runSingleTest('EDGE_CASE', testCase.prompt, {
                expectedNodes: testCase.expected.nodes,
                expectedQuality: testCase.expected.quality,
                maxTime: 35000,
                testName: testCase.name
            });
        }
    }

    async testPerformance() {
        console.log('\n⚡ TEST 5: RENDIMIENTO Y ESCALABILIDAD');
        console.log('--------------------------------------');

        // Test de carga - múltiples requests simultáneos
        const simultaneousPrompts = [
            "crear webhook básico",
            "procesar emails",
            "conectar con database",
            "enviar notificaciones",
            "generar reportes"
        ];

        console.log('📊 Probando 5 requests simultáneos...');
        const startTime = Date.now();
        
        try {
            const promises = simultaneousPrompts.map(prompt => 
                this.v4Ultra.generateWorkflow(prompt)
            );
            
            const results = await Promise.all(promises);
            const totalTime = Date.now() - startTime;
            
            const successCount = results.filter(r => r.success).length;
            const avgQuality = results
                .filter(r => r.success)
                .reduce((sum, r) => sum + (r.workflow.quality || 0), 0) / successCount;

            console.log(`  ✅ ${successCount}/${simultaneousPrompts.length} exitosos`);
            console.log(`  ⏱️ Tiempo total: ${totalTime}ms`);
            console.log(`  📊 Calidad promedio: ${avgQuality.toFixed(1)}/100`);
            console.log(`  📈 Throughput: ${(successCount / totalTime * 1000).toFixed(2)} workflows/segundo`);

            this.recordTest('PERFORMANCE', 'Requests simultáneos', true, {
                successRate: successCount / simultaneousPrompts.length,
                totalTime,
                avgQuality,
                throughput: successCount / totalTime * 1000
            });

        } catch (error) {
            console.log(`  ❌ Error en test de performance: ${error.message}`);
            this.recordTest('PERFORMANCE', 'Requests simultáneos', false, { error: error.message });
        }
    }

    async runSingleTest(category, prompt, criteria) {
        this.totalTests++;
        const testId = `${category}_${this.totalTests}`;
        
        console.log(`\n🧪 Test ${testId}: ${criteria.testName || prompt.substring(0, 50)}...`);
        
        try {
            const startTime = Date.now();
            const result = await this.v4Ultra.generateWorkflow(prompt);
            const endTime = Date.now();
            const processingTime = endTime - startTime;

            if (result.success) {
                const workflow = result.workflow;
                const nodeCount = workflow.nodes.length;
                const quality = workflow.quality || 0;
                const connectionCount = Object.keys(workflow.connections).length;

                // Validar criterios
                const nodeValid = nodeCount >= criteria.expectedNodes[0] && nodeCount <= criteria.expectedNodes[1];
                const qualityValid = quality >= criteria.expectedQuality[0] && quality <= criteria.expectedQuality[1];
                const timeValid = processingTime <= criteria.maxTime;

                const passed = nodeValid && qualityValid && timeValid;

                if (passed) {
                    this.passedTests++;
                    console.log(`  ✅ PASS - Nodos: ${nodeCount}, Calidad: ${quality}, Tiempo: ${processingTime}ms`);
                } else {
                    console.log(`  ❌ FAIL - Nodos: ${nodeCount} ${nodeValid ? '✅' : '❌'}, Calidad: ${quality} ${qualityValid ? '✅' : '❌'}, Tiempo: ${processingTime}ms ${timeValid ? '✅' : '❌'}`);
                }

                this.recordTest(category, prompt, passed, {
                    nodeCount,
                    quality,
                    processingTime,
                    connectionCount,
                    criteria,
                    validations: { nodeValid, qualityValid, timeValid }
                });

            } else {
                console.log(`  ❌ FAIL - Error: ${result.error}`);
                this.recordTest(category, prompt, false, { error: result.error });
            }

        } catch (error) {
            console.log(`  💥 ERROR - ${error.message}`);
            this.recordTest(category, prompt, false, { error: error.message });
        }
    }

    recordTest(category, prompt, passed, data) {
        this.testResults.push({
            id: this.totalTests,
            category,
            prompt: prompt.substring(0, 100),
            passed,
            timestamp: Date.now(),
            data
        });
    }

    generateFinalReport() {
        console.log('\n🎯 REPORTE FINAL DE VALIDACIÓN');
        console.log('==============================');

        const passRate = (this.passedTests / this.totalTests * 100).toFixed(1);
        
        console.log(`📊 Tests ejecutados: ${this.totalTests}`);
        console.log(`✅ Tests exitosos: ${this.passedTests}`);
        console.log(`❌ Tests fallidos: ${this.totalTests - this.passedTests}`);
        console.log(`📈 Tasa de éxito: ${passRate}%`);

        // Estadísticas por categoría
        const categories = ['SIMPLE', 'INTERMEDIATE', 'COMPLEX', 'EDGE_CASE', 'PERFORMANCE'];
        
        console.log('\n📋 ESTADÍSTICAS POR CATEGORÍA:');
        categories.forEach(category => {
            const categoryTests = this.testResults.filter(t => t.category === category);
            const categoryPassed = categoryTests.filter(t => t.passed).length;
            const categoryRate = categoryTests.length > 0 ? (categoryPassed / categoryTests.length * 100).toFixed(1) : 0;
            
            console.log(`  ${category}: ${categoryPassed}/${categoryTests.length} (${categoryRate}%)`);
        });

        // Métricas de rendimiento
        const successfulTests = this.testResults.filter(t => t.passed && t.data.processingTime);
        if (successfulTests.length > 0) {
            const avgTime = successfulTests.reduce((sum, t) => sum + t.data.processingTime, 0) / successfulTests.length;
            const avgQuality = successfulTests.reduce((sum, t) => sum + (t.data.quality || 0), 0) / successfulTests.length;
            const avgNodes = successfulTests.reduce((sum, t) => sum + (t.data.nodeCount || 0), 0) / successfulTests.length;

            console.log('\n📈 MÉTRICAS GENERALES:');
            console.log(`  ⏱️ Tiempo promedio: ${avgTime.toFixed(0)}ms`);
            console.log(`  📊 Calidad promedio: ${avgQuality.toFixed(1)}/100`);
            console.log(`  🔗 Nodos promedio: ${avgNodes.toFixed(1)}`);
        }

        console.log('\n🏆 EVALUACIÓN FINAL:');
        if (passRate >= 90) {
            console.log('🟢 EXCELENTE - Sistema funcionando de manera óptima');
        } else if (passRate >= 80) {
            console.log('🟡 BUENO - Sistema funcional con algunas mejoras pendientes');
        } else if (passRate >= 70) {
            console.log('🟠 REGULAR - Sistema requiere optimizaciones');
        } else {
            console.log('🔴 CRÍTICO - Sistema requiere revisión mayor');
        }
    }
}

// Ejecutar validación completa
async function runValidation() {
    const validator = new ComprehensiveSystemValidator();
    
    try {
        await validator.runCompleteValidation();
    } catch (error) {
        console.error('💥 Error fatal en validación:', error);
    }
}

runValidation();
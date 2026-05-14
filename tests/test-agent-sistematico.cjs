/**
 * TEST INDEPENDIENTE DEL ULTRA INTELLIGENT FALLBACK AGENT
 * Simula las condiciones del servidor oficial para debugging sistemático
 */

import UltraIntelligentFallbackAgent from './ultra-intelligent-fallback-agent-v2.js';

class AgentTester {
    constructor() {
        this.agent = new UltraIntelligentFallbackAgent();
        this.testResults = [];
    }

    // Simula el semanticAnalysis que viene del servidor oficial
    mockSemanticAnalysis(prompt) {
        return {
            domain: 'ecommerce',
            complexity: 'medium',
            intentions: ['webhook_receive', 'data_validation', 'payment_processing'],
            entities: ['order', 'customer', 'payment'],
            requiredIntegrations: ['shopify', 'mysql', 'stripe'],
            estimatedNodes: 15,
            criticalPath: ['webhook', 'validation', 'payment', 'response'],
            businessLogic: {
                hasConditionals: true,
                hasLoops: false,
                hasErrorHandling: true,
                requiresAI: true
            }
        };
    }

    async testBasicGeneration() {
        console.log('🧪 TEST 1: Generación básica del workflow...');
        
        try {
            const prompt = "Sistema básico de e-commerce: webhook Shopify, validar stock MySQL, procesar pago Stripe";
            const semanticAnalysis = this.mockSemanticAnalysis(prompt);
            
            const result = await this.agent.generateIntelligentWorkflow(prompt, semanticAnalysis);
            
            console.log('✅ Generación básica exitosa');
            console.log(`   📊 Nodos generados: ${result.nodes?.length || 0}`);
            console.log(`   🔗 Conexiones: ${Object.keys(result.connections || {}).length}`);
            console.log(`   🏷️ Metadatos: ${result.metadata ? 'Presentes' : 'Ausentes'}`);
            
            this.testResults.push({
                test: 'basic_generation',
                success: true,
                nodes: result.nodes?.length || 0,
                connections: Object.keys(result.connections || {}).length
            });
            
            return result;
            
        } catch (error) {
            console.log('❌ Error en generación básica:', error.message);
            console.log('📍 Stack:', error.stack);
            
            this.testResults.push({
                test: 'basic_generation',
                success: false,
                error: error.message
            });
            
            throw error;
        }
    }

    async testSemanticAnalysis() {
        console.log('🧪 TEST 2: Análisis semántico...');
        
        try {
            const prompt = "Sistema complejo de e-commerce con IA para detección de fraude";
            const analysis = this.agent.performSemanticAnalysis(prompt);
            
            console.log('✅ Análisis semántico exitoso');
            console.log(`   🎯 Dominio: ${analysis.domain}`);
            console.log(`   📊 Complejidad: ${analysis.complexity}`);
            console.log(`   🎪 Intenciones: ${analysis.intentions.length}`);
            
            this.testResults.push({
                test: 'semantic_analysis',
                success: true,
                domain: analysis.domain,
                complexity: analysis.complexity
            });
            
            return analysis;
            
        } catch (error) {
            console.log('❌ Error en análisis semántico:', error.message);
            
            this.testResults.push({
                test: 'semantic_analysis',
                success: false,
                error: error.message
            });
            
            throw error;
        }
    }

    async testWorkflowPlanning() {
        console.log('🧪 TEST 3: Planificación de workflow...');
        
        try {
            const semanticAnalysis = this.mockSemanticAnalysis("Test prompt");
            const plan = this.agent.createIntelligentWorkflowPlan(semanticAnalysis);
            
            console.log('✅ Planificación exitosa');
            console.log(`   📋 Pasos planificados: ${plan.steps?.length || 0}`);
            console.log(`   🎯 Nodos estimados: ${plan.estimatedNodes || 0}`);
            
            this.testResults.push({
                test: 'workflow_planning',
                success: true,
                steps: plan.steps?.length || 0,
                estimatedNodes: plan.estimatedNodes || 0
            });
            
            return plan;
            
        } catch (error) {
            console.log('❌ Error en planificación:', error.message);
            
            this.testResults.push({
                test: 'workflow_planning',
                success: false,
                error: error.message
            });
            
            throw error;
        }
    }

    async testNodeGeneration() {
        console.log('🧪 TEST 4: Generación de nodos...');
        
        try {
            const semanticAnalysis = this.mockSemanticAnalysis("Test prompt");
            const plan = this.agent.createIntelligentWorkflowPlan(semanticAnalysis);
            
            const nodes = this.agent.generateIntelligentNodes(plan, semanticAnalysis);
            
            console.log('✅ Generación de nodos exitosa');
            console.log(`   🔢 Nodos creados: ${nodes.length}`);
            
            // Verificar estructura de nodos
            let validNodes = 0;
            nodes.forEach(node => {
                if (node.id && node.name && node.type) {
                    validNodes++;
                }
            });
            
            console.log(`   ✅ Nodos válidos: ${validNodes}/${nodes.length}`);
            
            this.testResults.push({
                test: 'node_generation',
                success: true,
                totalNodes: nodes.length,
                validNodes: validNodes
            });
            
            return nodes;
            
        } catch (error) {
            console.log('❌ Error en generación de nodos:', error.message);
            
            this.testResults.push({
                test: 'node_generation',
                success: false,
                error: error.message
            });
            
            throw error;
        }
    }

    async testConnectionGeneration() {
        console.log('🧪 TEST 5: Generación de conexiones...');
        
        try {
            const semanticAnalysis = this.mockSemanticAnalysis("Test prompt");
            const plan = this.agent.createIntelligentWorkflowPlan(semanticAnalysis);
            const nodes = this.agent.generateIntelligentNodes(plan, semanticAnalysis);
            
            const connections = this.agent.generateIntelligentConnections(nodes, plan, semanticAnalysis);
            
            console.log('✅ Generación de conexiones exitosa');
            console.log(`   🔗 Conexiones creadas: ${Object.keys(connections).length}`);
            
            this.testResults.push({
                test: 'connection_generation',
                success: true,
                connections: Object.keys(connections).length
            });
            
            return connections;
            
        } catch (error) {
            console.log('❌ Error en generación de conexiones:', error.message);
            
            this.testResults.push({
                test: 'connection_generation',
                success: false,
                error: error.message
            });
            
            throw error;
        }
    }

    async runAllTests() {
        console.log('🚀 INICIANDO TESTS SISTEMÁTICOS DEL AGENTE ULTRA INTELIGENTE...\n');
        
        const tests = [
            () => this.testSemanticAnalysis(),
            () => this.testWorkflowPlanning(), 
            () => this.testNodeGeneration(),
            () => this.testConnectionGeneration(),
            () => this.testBasicGeneration()
        ];
        
        for (let i = 0; i < tests.length; i++) {
            try {
                await tests[i]();
                console.log(''); // Línea en blanco entre tests
            } catch (error) {
                console.log(`💥 Test ${i+1} falló, deteniendo suite de tests\n`);
                break;
            }
        }
        
        this.printResults();
    }

    printResults() {
        console.log('📊 RESUMEN DE RESULTADOS:');
        console.log('═══════════════════════════\n');
        
        let passed = 0;
        let failed = 0;
        
        this.testResults.forEach(result => {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${result.test}: ${result.success ? 'PASSED' : 'FAILED'}`);
            
            if (result.success) {
                passed++;
                if (result.nodes) console.log(`   📊 Nodos: ${result.nodes}`);
                if (result.connections) console.log(`   🔗 Conexiones: ${result.connections}`);
            } else {
                failed++;
                console.log(`   💥 Error: ${result.error}`);
            }
            console.log('');
        });
        
        console.log(`📈 TOTAL: ${passed} passed, ${failed} failed`);
        console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    }
}

// Ejecutar tests
async function main() {
    const tester = new AgentTester();
    await tester.runAllTests();
}

main().catch(console.error);
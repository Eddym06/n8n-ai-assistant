/**
 * TEST SIMPLE PARA DEBUGGEAR EL ULTRA INTELLIGENT FALLBACK AGENT
 * Vamos a ejecutar paso a paso para ver dónde falla
 */

import UltraIntelligentFallbackAgent from './ultra-intelligent-fallback-agent-v2.js';

async function testAgentStepByStep() {
    console.log('🧪 INICIANDO TEST DEL ULTRA INTELLIGENT FALLBACK AGENT');
    console.log('=' .repeat(60));

    const agent = new UltraIntelligentFallbackAgent();
    const testPrompt = "Crear un sistema completo de e-commerce que reciba órdenes por webhook desde Shopify";

    try {
        console.log('🔍 1. Probando análisis semántico...');
        const semanticAnalysis = await agent.performDeepSemanticAnalysis(testPrompt);
        console.log('   ✅ Análisis semántico exitoso:', {
            domain: semanticAnalysis.businessDomain,
            complexity: semanticAnalysis.complexity,
            integrations: semanticAnalysis.requiredIntegrations?.length || 0
        });

        console.log('🎯 2. Probando planificación de workflow...');
        const workflowPlan = agent.createIntelligentWorkflowPlan(semanticAnalysis, []);
        console.log('   ✅ Plan de workflow exitoso:', {
            estimatedNodes: workflowPlan.estimatedNodes,
            branches: workflowPlan.parallelBranches
        });

        console.log('⚡ 3. Probando generación de nodos...');
        const nodes = await agent.generateIntelligentNodes(workflowPlan, semanticAnalysis);
        console.log(`   ✅ Generación de nodos exitosa: ${nodes.length} nodos`);

        console.log('🔗 4. Probando creación de conexiones...');
        const connections = agent.createIntelligentConnections(nodes, workflowPlan);
        console.log(`   ✅ Conexiones creadas: ${Object.keys(connections).length}`);

        console.log('🔍 5. Probando validación...');
        const workflow = { nodes, connections };
        const validation = await agent.performDeepWorkflowValidation(workflow, semanticAnalysis);
        console.log('   ✅ Validación completada:', {
            isValid: validation.isValid,
            errors: validation.errors?.length || 0
        });

        console.log('🎉 TODAS LAS FUNCIONES FUNCIONAN CORRECTAMENTE');
        console.log(`📊 Workflow final: ${nodes.length} nodos, ${Object.keys(connections).length} conexiones`);

        return {
            success: true,
            nodes: nodes.length,
            connections: Object.keys(connections).length
        };

    } catch (error) {
        console.error('❌ ERROR ENCONTRADO:', error.message);
        console.error('📍 Stack trace:', error.stack);
        
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}

// Ejecutar test
testAgentStepByStep()
    .then(result => {
        if (result.success) {
            console.log('\n🎯 RESULTADO: El agente funciona correctamente');
            console.log(`   Puede generar ${result.nodes} nodos y ${result.connections} conexiones`);
        } else {
            console.log('\n💥 RESULTADO: El agente tiene un problema');
            console.log(`   Error: ${result.error}`);
        }
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('\n💥 ERROR CRÍTICO EN EL TEST:', error);
        process.exit(1);
    });
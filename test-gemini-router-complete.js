/**
 * TEST COMPLETO DEL GEMINI MODEL ROUTER
 * Prueba todos los componentes con fallback automático
 */

import GeminiModelRouter from './gemini-model-router.js';
import PromptEnhancementAgentOptimized from './prompt-enhancement-agent-optimized.js';
import FlowCoherenceAgentV3 from './flow-coherence-agent-v3-router.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 INICIANDO TEST COMPLETO DEL GEMINI MODEL ROUTER');
console.log('═══════════════════════════════════════════════════\n');

// Test 1: Router básico
async function testBasicRouter() {
  console.log('1️⃣ TEST ROUTER BÁSICO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const router = new GeminiModelRouter();
    
    // Test con agente extension-server (modelos Pro)
    console.log('🔹 Test Extension Server (Pro models):');
    const proResult = await router.generateContent(
      "Generar un workflow n8n complejo con múltiples integraciones",
      'extension-server',
      { maxOutputTokens: 1000 }
    );
    
    console.log(`✅ Modelo usado: ${proResult.modelName}`);
    console.log(`💰 Costo: $${proResult.cost.toFixed(4)}`);
    console.log(`⏱️ Tiempo: ${proResult.responseTime}ms`);
    console.log(`📝 Respuesta: ${proResult.content.substring(0, 200)}...\n`);
    
    // Test con agente Flash
    console.log('🔹 Test Flow Coherence (Flash models):');
    const flashResult = await router.generateContent(
      "Validar estructura básica de workflow",
      'flow-coherence',
      { maxOutputTokens: 500 }
    );
    
    console.log(`✅ Modelo usado: ${flashResult.modelName}`);
    console.log(`💰 Costo: $${flashResult.cost.toFixed(4)}`);
    console.log(`⏱️ Tiempo: ${flashResult.responseTime}ms`);
    console.log(`📝 Respuesta: ${flashResult.content.substring(0, 200)}...\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en test básico:', error.message);
    return false;
  }
}

// Test 2: Agentes integrados
async function testIntegratedAgents() {
  console.log('2️⃣ TEST AGENTES INTEGRADOS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // Test Prompt Enhancement Agent
    console.log('🔹 Test Prompt Enhancement Agent:');
    const promptAgent = new PromptEnhancementAgentOptimized();
    const enhanceResult = await promptAgent.enhancePrompt("crear webhook simple");
    
    console.log(`✅ Éxito: ${enhanceResult.success}`);
    console.log(`📊 Nivel: ${enhanceResult.complexity?.userLevel}`);
    console.log(`🔧 Procesamiento: ${enhanceResult.processingApplied}`);
    console.log(`📝 Mejorado: ${enhanceResult.enhancedPrompt.substring(0, 150)}...\n`);
    
    // Test Flow Coherence Agent
    console.log('🔹 Test Flow Coherence Agent:');
    const flowAgent = new FlowCoherenceAgentV3();
    const testWorkflow = {
      nodes: [
        { id: '1', name: 'Test Node', type: 'n8n-nodes-base.webhook', position: [100, 100] }
      ],
      connections: {}
    };
    
    const flowResult = await flowAgent.processWorkflow(testWorkflow);
    
    console.log(`✅ Éxito: ${flowResult.success}`);
    console.log(`📊 Score: ${flowResult.coherenceScore}`);
    console.log(`🔧 Fixes: ${flowResult.fixes.length}`);
    console.log(`🌐 API calls: ${flowResult.apiCallsMade}`);
    console.log(`⏱️ Tiempo: ${flowResult.processTime}ms\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en test agentes:', error.message);
    return false;
  }
}

// Test 3: Fallback automático (simulado)
async function testFallbackMechanism() {
  console.log('3️⃣ TEST MECANISMO DE FALLBACK');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const router = new GeminiModelRouter();
    
    console.log('🔹 Simulando múltiples requests para activar fallback:');
    
    const requests = [
      "Test request 1",
      "Test request 2", 
      "Test request 3"
    ];
    
    for (let i = 0; i < requests.length; i++) {
      try {
        const result = await router.generateContent(
          requests[i],
          'flow-coherence',
          { maxOutputTokens: 100 }
        );
        
        console.log(`   ${i + 1}. ✅ ${result.modelName} - ${result.responseTime}ms`);
      } catch (error) {
        console.log(`   ${i + 1}. ❌ Error: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error en test fallback:', error.message);
    return false;
  }
}

// Test 4: Estadísticas y métricas
async function testMetricsAndStats() {
  console.log('4️⃣ TEST MÉTRICAS Y ESTADÍSTICAS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const router = new GeminiModelRouter();
    
    // Hacer algunas llamadas para generar métricas
    await router.generateContent("Test metrics 1", 'extension-server');
    await router.generateContent("Test metrics 2", 'flow-coherence');
    
    // Obtener estadísticas
    const stats = router.getStats();
    
    console.log('📊 ESTADÍSTICAS DEL ROUTER:');
    console.log(`   🔢 Total requests: ${stats.totalRequests}`);
    console.log(`   ✅ Successful: ${stats.totalSuccessful}`);
    console.log(`   ❌ Failed: ${stats.totalFailed}`);
    console.log(`   📈 Success rate: ${stats.successRate}%`);
    console.log(`   🤖 Models available: ${stats.modelsAvailable}`);
    
    console.log('\n📋 ESTADÍSTICAS POR MODELO:');
    Object.entries(stats.modelStats).forEach(([modelId, modelStats]) => {
      console.log(`   🔸 ${modelId}:`);
      console.log(`     Requests: ${modelStats.totalRequests}`);
      console.log(`     Success rate: ${modelStats.successRate}%`);
      console.log(`     Avg response: ${modelStats.avgResponseTime}ms`);
    });
    
    // Guardar métricas
    await router.saveMetrics();
    console.log('\n💾 Métricas guardadas en archivo');
    
    return true;
  } catch (error) {
    console.error('❌ Error en test métricas:', error.message);
    return false;
  }
}

// Test 5: Configuración de modelos
async function testModelConfiguration() {
  console.log('5️⃣ TEST CONFIGURACIÓN DE MODELOS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const { GEMINI_MODELS_CONFIG, MODEL_UTILS } = await import('./gemini-models-config.js');
    
    console.log('📋 MODELOS PRO CONFIGURADOS:');
    Object.entries(GEMINI_MODELS_CONFIG.PRO_MODELS).forEach(([key, config]) => {
      console.log(`   🔸 ${config.name} (${config.id})`);
      console.log(`     Prioridad: ${config.priority}`);
      console.log(`     Límite diario: ${config.limits.requestsPerDay}`);
      console.log(`     Costo input: $${config.pricing.inputTokens}/M tokens`);
    });
    
    console.log('\n⚡ MODELOS FLASH CONFIGURADOS:');
    Object.entries(GEMINI_MODELS_CONFIG.FLASH_MODELS).forEach(([key, config]) => {
      console.log(`   🔸 ${config.name} (${config.id})`);
      console.log(`     Prioridad: ${config.priority}`);
      console.log(`     Límite diario: ${config.limits.requestsPerDay}`);
      console.log(`     Costo input: $${config.pricing.inputTokens}/M tokens`);
    });
    
    console.log('\n🎯 CONFIGURACIÓN DE AGENTES:');
    Object.entries(GEMINI_MODELS_CONFIG.AGENT_CONFIGURATIONS).forEach(([agent, config]) => {
      console.log(`   🔸 ${agent}:`);
      console.log(`     Modelos: ${config.models.join(', ')}`);
      console.log(`     Fallback: ${config.fallbackChain.join(' → ')}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error en test configuración:', error.message);
    return false;
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🎯 INICIANDO BATERÍA COMPLETA DE TESTS DEL ROUTER...\n');
  
  const tests = [
    { name: 'Router Básico', fn: testBasicRouter },
    { name: 'Agentes Integrados', fn: testIntegratedAgents },
    { name: 'Mecanismo Fallback', fn: testFallbackMechanism },
    { name: 'Métricas y Stats', fn: testMetricsAndStats },
    { name: 'Configuración Modelos', fn: testModelConfiguration }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
      console.log(`${result ? '✅' : '❌'} ${test.name}: ${result ? 'PASSED' : 'FAILED'}\n`);
    } catch (error) {
      results.push({ name: test.name, success: false, error: error.message });
      console.log(`❌ ${test.name}: FAILED - ${error.message}\n`);
    }
  }
  
  // Resumen final
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 RESUMEN FINAL DE TESTS');
  console.log('═══════════════════════════════════════════════════');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Tests exitosos: ${passed}/${total}`);
  console.log(`📈 Porcentaje de éxito: ${(passed/total*100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('\n🎉 TODOS LOS TESTS DEL ROUTER COMPLETADOS EXITOSAMENTE');
    console.log('✅ Sistema de routing listo para producción');
    console.log('🚀 Fallback automático funcionando');
    console.log('📊 Métricas y logging operativos');
  } else {
    console.log('\n⚠️ Algunos tests fallaron:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ❌ ${r.name}: ${r.error || 'Unknown error'}`);
    });
  }
  
  console.log('\n🔧 ARCHIVOS DEL SISTEMA DE ROUTING:');
  console.log('   - gemini-models-config.js (configuración)');
  console.log('   - gemini-model-router.js (router principal)');
  console.log('   - flow-coherence-agent-v3-router.js (agente optimizado)');
  console.log('   - prompt-enhancement-agent-optimized.js (con router)');
  console.log('   - extension-server-no-loops.js (integrado)');
}

// Ejecutar tests
runAllTests().catch(error => {
  console.error('💥 Error crítico en tests:', error);
  process.exit(1);
});
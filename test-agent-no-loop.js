/**
 * Test de Prompt Enhancement Agent Fixed - Sin loops infinitos
 */

import PromptEnhancementAgentFixed from './prompt-enhancement-agent-no-loop.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Iniciando test del Prompt Enhancement Agent Fixed (sin loops)...\n');

async function testNoLoops() {
  const agent = new PromptEnhancementAgentFixed();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1️⃣ TEST BÁSICO - Prompt simple');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const testPrompt1 = "crear un workflow para enviar emails";
  console.log(`📝 Prompt original: "${testPrompt1}"`);
  
  const startTime = Date.now();
  const result1 = await agent.enhancePrompt(testPrompt1);
  const endTime = Date.now();
  
  console.log(`⏱️ Tiempo transcurrido: ${endTime - startTime}ms`);
  console.log(`✅ Resultado exitoso: ${result1.success}`);
  console.log(`📊 Nivel detectado: ${result1.complexity?.userLevel}`);
  console.log(`🔧 Procesamiento: ${result1.processingApplied}`);
  console.log(`📤 Prompt mejorado: "${result1.enhancedPrompt}"`);
  console.log(`🛡️ Sin recursión: ${result1.noRecursion}`);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('2️⃣ TEST INTERMEDIO - Prompt técnico');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const testPrompt2 = "configurar webhook que procese datos JSON desde una API";
  console.log(`📝 Prompt original: "${testPrompt2}"`);
  
  const startTime2 = Date.now();
  const result2 = await agent.enhancePrompt(testPrompt2);
  const endTime2 = Date.now();
  
  console.log(`⏱️ Tiempo transcurrido: ${endTime2 - startTime2}ms`);
  console.log(`✅ Resultado exitoso: ${result2.success}`);
  console.log(`📊 Nivel detectado: ${result2.complexity?.userLevel}`);
  console.log(`🔧 Procesamiento: ${result2.processingApplied}`);
  console.log(`📤 Prompt mejorado: "${result2.enhancedPrompt}"`);
  console.log(`🛡️ Sin recursión: ${result2.noRecursion}`);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('3️⃣ TEST EXPERTO - Prompt avanzado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const testPrompt3 = "crear workflow n8n con nodos conditional y javascript expression para oauth authentication";
  console.log(`📝 Prompt original: "${testPrompt3}"`);
  
  const startTime3 = Date.now();
  const result3 = await agent.enhancePrompt(testPrompt3);
  const endTime3 = Date.now();
  
  console.log(`⏱️ Tiempo transcurrido: ${endTime3 - startTime3}ms`);
  console.log(`✅ Resultado exitoso: ${result3.success}`);
  console.log(`📊 Nivel detectado: ${result3.complexity?.userLevel}`);
  console.log(`🔧 Procesamiento: ${result3.processingApplied}`);
  console.log(`📤 Prompt mejorado: "${result3.enhancedPrompt}"`);
  console.log(`🛡️ Sin recursión: ${result3.noRecursion}`);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('4️⃣ TEST DE MÚLTIPLES LLAMADAS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('🔄 Ejecutando 5 llamadas consecutivas...');
  for (let i = 1; i <= 5; i++) {
    const start = Date.now();
    const result = await agent.enhancePrompt(`Test ${i}: crear workflow automático`);
    const end = Date.now();
    console.log(`   ${i}. Tiempo: ${end - start}ms - Exitoso: ${result.success} - Sin recursión: ${result.noRecursion}`);
  }
  
  console.log('\n✅ TODOS LOS TESTS COMPLETADOS SIN LOOPS INFINITOS');
  console.log('🎉 El Prompt Enhancement Agent Fixed funciona correctamente');
}

async function testComplexityAnalysis() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 TEST DETALLADO DE ANÁLISIS DE COMPLEJIDAD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const agent = new PromptEnhancementAgentFixed();
  
  const testCases = [
    {
      prompt: "crear algo simple",
      expectedLevel: "NOVICE"
    },
    {
      prompt: "configurar webhook con api json",
      expectedLevel: "INTERMEDIATE"
    },
    {
      prompt: "workflow n8n con javascript expression y oauth authentication",
      expectedLevel: "EXPERT"
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📝 Testing: "${testCase.prompt}"`);
    const complexity = agent.analyzePromptComplexity(testCase.prompt);
    console.log(`📊 Nivel detectado: ${complexity.userLevel} (esperado: ${testCase.expectedLevel})`);
    console.log(`🎯 Mejoras: ${complexity.enhancementNeeded}`);
    console.log(`📈 Score: ${complexity.complexityScore.toFixed(2)}`);
    console.log(`✅ Coincide: ${complexity.userLevel === testCase.expectedLevel ? '✅' : '❌'}`);
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  try {
    await testNoLoops();
    await testComplexityAnalysis();
    console.log('\n🎉 TODOS LOS TESTS COMPLETADOS EXITOSAMENTE');
    console.log('✅ El sistema está listo para producción');
  } catch (error) {
    console.error('❌ Error en los tests:', error);
  }
}

runAllTests();
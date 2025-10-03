// Test específico para verificar la transformación funcional directa
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testDirectTransformation() {
  console.log('🔧 TEST DE TRANSFORMACIÓN FUNCIONAL DIRECTA\n');

  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: false, // Desactivar Gemini para probar solo la transformación local
    maxEnhancements: 1
  });

  const originalPrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio";

  console.log('📝 PROMPT ORIGINAL:');
  console.log('-'.repeat(80));
  console.log(originalPrompt);
  console.log('-'.repeat(80));

  // Test directo del método de identificación
  console.log('\n🔍 IDENTIFICANDO TIPO DE WORKFLOW...');
  const workflowType = agent.identifyWorkflowType(originalPrompt);
  console.log(`Tipo detectado: ${workflowType}`);

  // Test directo de la transformación funcional
  console.log('\n⚙️ APLICANDO TRANSFORMACIÓN FUNCIONAL...');
  const analysis = { vagueness: 0.8, specificity: 0.3 };
  const functionalResult = await agent.enhanceFunctionalWorkflow(originalPrompt, analysis);

  console.log(`\n✨ RESULTADO DE TRANSFORMACIÓN:`);
  console.log(`- Tipo: ${functionalResult.type}`);
  console.log(`- Descripción: ${functionalResult.description}`);
  console.log(`- Mejora: ${(functionalResult.improvement * 100).toFixed(1)}%`);
  console.log(`- Workflow Type: ${functionalResult.metadata?.workflowType}`);

  console.log('\n📊 ESTADÍSTICAS:');
  console.log(`- Longitud original: ${originalPrompt.length} caracteres`);
  console.log(`- Longitud transformada: ${functionalResult.enhanced.length} caracteres`);
  console.log(`- Incremento: ${((functionalResult.enhanced.length / originalPrompt.length - 1) * 100).toFixed(1)}%`);
  console.log(`- Ratio: ${(functionalResult.enhanced.length / originalPrompt.length).toFixed(1)}x más detallado`);

  // Verificar elementos técnicos
  const technicalElements = [
    'STEP', 'NODE', 'OAuth2', 'webhook', 'JavaScript', 'regex', 
    'authentication', 'API', 'JSON', 'variables', 'function',
    'configuration', 'error handling', 'validation'
  ];

  const elementsFound = technicalElements.filter(element => 
    functionalResult.enhanced.toLowerCase().includes(element.toLowerCase())
  ).length;

  console.log(`\n🔍 ELEMENTOS TÉCNICOS ENCONTRADOS: ${elementsFound}/${technicalElements.length}`);
  
  technicalElements.forEach(element => {
    if (functionalResult.enhanced.toLowerCase().includes(element.toLowerCase())) {
      console.log(`✅ ${element}`);
    }
  });

  // Verificar código incluido
  const codeBlocks = [];
  if (functionalResult.enhanced.includes('```javascript')) codeBlocks.push('JavaScript');
  if (functionalResult.enhanced.includes('```json')) codeBlocks.push('JSON');
  if (functionalResult.enhanced.includes('```html')) codeBlocks.push('HTML');
  if (functionalResult.enhanced.includes('```env')) codeBlocks.push('ENV Variables');

  if (codeBlocks.length > 0) {
    console.log(`\n💻 BLOQUES DE CÓDIGO INCLUIDOS: ${codeBlocks.join(', ')}`);
  }

  // Mostrar fragmento de la transformación
  console.log('\n📄 FRAGMENTO DE LA TRANSFORMACIÓN (primeros 500 caracteres):');
  console.log('='.repeat(80));
  console.log(functionalResult.enhanced.substring(0, 500) + '...');
  console.log('='.repeat(80));

  // Test con el agente completo usando solo la mejora funcional
  console.log('\n🧪 TEST CON AGENTE COMPLETO (solo functional_workflow):');
  const result = await agent.enhancePrompt(originalPrompt, {}, {
    maxEnhancements: 1
  });

  console.log(`Mejoras aplicadas: ${result.enhancements.length}`);
  result.enhancements.forEach((enhancement, index) => {
    console.log(`${index + 1}. ${enhancement.type} - ${enhancement.description}`);
    console.log(`   Mejora: ${(enhancement.improvement * 100).toFixed(1)}%`);
  });

  console.log(`\n🎯 LONGITUD FINAL: ${result.enhancedPrompt.length} caracteres`);
  console.log(`🚀 INCREMENTO TOTAL: ${((result.enhancedPrompt.length / originalPrompt.length - 1) * 100).toFixed(1)}%`);

  if (result.enhancedPrompt.length > originalPrompt.length * 5) {
    console.log('\n✅ ¡TRANSFORMACIÓN EXITOSA! El prompt es significativamente más detallado');
  } else {
    console.log('\n❌ La transformación no está funcionando como esperado');
  }
}

testDirectTransformation().catch(console.error);

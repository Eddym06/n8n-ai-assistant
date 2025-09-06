// Test específico para mejorar prompts vagos y confusos
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testVaguePromptEnhancement() {
  console.log('🧪 Probando mejora de prompts vagos y confusos\n');

  const agent = new PromptEnhancementAgent();

  // Prompt de prueba muy vago y confuso
  const vaguePrompt = `quiero hacer algo con marketing digital y automatización, tipo emails y redes sociales, pero no sé bien cómo, tal vez con datos de clientes o algo, y que funcione solo, como magia, pero que sea bueno y no cueste mucho, y que la gente compre más, o algo así, no sé exactamente, pero suena bien`;

  console.log('=== Prompt Original (Vago) ===');
  console.log(vaguePrompt);
  console.log('\nAnálisis del prompt original:');
  const originalAnalysis = await agent.analyzePrompt(vaguePrompt);
  console.log(`- Longitud: ${originalAnalysis.length} caracteres`);
  console.log(`- Palabras: ${originalAnalysis.wordCount}`);
  console.log(`- Claridad: ${(originalAnalysis.clarity * 100).toFixed(1)}%`);
  console.log(`- Especificidad: ${(originalAnalysis.specificity * 100).toFixed(1)}%`);
  console.log(`- Completitud: ${(originalAnalysis.completeness * 100).toFixed(1)}%`);
  console.log(`- Acción: ${(originalAnalysis.actionability * 100).toFixed(1)}%`);
  console.log(`- Tipo detectado: ${originalAnalysis.type}`);
  console.log(`- Elementos faltantes: ${originalAnalysis.missingElements.join(', ')}`);

  console.log('\n=== Aplicando Mejoras ===');
  const result = await agent.enhancePrompt(vaguePrompt);

  console.log('\n=== Prompt Mejorado ===');
  console.log(result.enhancedPrompt);

  console.log('\n=== Métricas de Mejora ===');
  console.log(`- Mejoras aplicadas: ${result.enhancements.length}`);
  console.log(`- Tiempo de procesamiento: ${result.metadata.processingTime}ms`);
  console.log(`- Mejora de calidad: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);

  console.log('\n=== Análisis del Prompt Mejorado ===');
  const enhancedAnalysis = result.validation.enhancedAnalysis;
  console.log(`- Longitud: ${enhancedAnalysis.length} caracteres`);
  console.log(`- Palabras: ${enhancedAnalysis.wordCount}`);
  console.log(`- Claridad: ${(enhancedAnalysis.clarity * 100).toFixed(1)}%`);
  console.log(`- Especificidad: ${(enhancedAnalysis.specificity * 100).toFixed(1)}%`);
  console.log(`- Completitud: ${(enhancedAnalysis.completeness * 100).toFixed(1)}%`);
  console.log(`- Acción: ${(enhancedAnalysis.actionability * 100).toFixed(1)}%`);

  console.log('\n=== Detalles de Mejoras Aplicadas ===');
  result.enhancements.forEach((enhancement, index) => {
    console.log(`${index + 1}. ${enhancement.type}: ${enhancement.description}`);
    console.log(`   Mejora: ${(enhancement.improvement * 100).toFixed(1)}%`);
  });

  console.log('\n✅ Test completado exitosamente!');
  return result;
}

// Ejecutar test
testVaguePromptEnhancement().catch(console.error);

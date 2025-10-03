// Test avanzado del Prompt Enhancement Agent con Gemini AI
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testGeminiEnhancedAgent() {
  console.log('🤖 Probando Prompt Enhancement Agent con Gemini AI\n');

  // Crear agente con Gemini habilitado
  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: process.env.GEMINI_API_KEY
  });

  console.log('=== Prompt muy vago del usuario ===');
  const vaguePrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio. También necesito que des una respuesta al cliente en donde diga que los datos se han enviado correctamente";

  console.log('📝 Prompt original (con múltiples problemas):');
  console.log(`"${vaguePrompt}"\n`);

  const result = await agent.enhancePrompt(vaguePrompt, {
    userPreferences: {
      language: 'spanish',
      platform: 'n8n'
    },
    technicalConstraints: {
      integrations: ['telegram', 'google-calendar', 'email']
    }
  });

  console.log('🔍 Análisis detallado:');
  if (result.analysis.geminiEnhanced) {
    console.log('✅ Análisis potenciado por Gemini AI');
  } else {
    console.log('⚠️ Análisis básico (Gemini no disponible)');
  }

  console.log(`- Nivel de vaguedad: ${(result.analysis.vagueness * 100).toFixed(1)}%`);
  console.log(`- Claridad: ${(result.analysis.clarity * 100).toFixed(1)}%`);
  console.log(`- Especificidad: ${(result.analysis.specificity * 100).toFixed(1)}%`);
  console.log(`- Completitud: ${(result.analysis.completeness * 100).toFixed(1)}%`);

  if (result.analysis.detectedErrors) {
    console.log(`- Errores detectados: ${result.analysis.detectedErrors.join(', ')}`);
  }

  if (result.analysis.aiSuggestions) {
    console.log(`- Sugerencias de IA: ${result.analysis.aiSuggestions.slice(0, 3).join(', ')}`);
  }

  console.log('\n✨ Prompt mejorado:');
  console.log(`"${result.enhancedPrompt}"\n`);

  console.log('🔧 Mejoras aplicadas:');
  result.enhancements.forEach((enhancement, index) => {
    console.log(`${index + 1}. ${enhancement.description}`);
    if (enhancement.type === 'gemini_enhancement') {
      console.log('   🤖 Potenciado por Gemini AI');
    }
  });

  console.log(`\n📊 Mejora total de calidad: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);

  // Comparar versiones
  console.log('\n📈 Comparación detallada:');
  console.log('Antes:', {
    longitud: result.originalPrompt.length,
    palabras: result.analysis.wordCount,
    vaguedad: `${(result.analysis.vagueness * 100).toFixed(1)}%`
  });

  if (result.validation.enhancedAnalysis) {
    const enhanced = result.validation.enhancedAnalysis;
    console.log('Después:', {
      longitud: result.enhancedPrompt.length,
      palabras: enhanced.wordCount || 'N/A',
      vaguedad: `${((enhanced.vagueness || 0) * 100).toFixed(1)}%`
    });
  }

  console.log('\n✅ Test completado exitosamente!');
  return result;
}

// Ejecutar el test
testGeminiEnhancedAgent().catch(error => {
  console.error('❌ Error en el test:', error.message);
  console.log('\n💡 Tip: Asegúrate de tener configurada la variable GEMINI_API_KEY');
});

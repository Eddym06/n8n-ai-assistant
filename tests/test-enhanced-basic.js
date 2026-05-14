// Test del Prompt Enhancement Agent sin Gemini (modo básico)
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testBasicEnhancedAgent() {
  console.log('🧪 Probando Prompt Enhancement Agent (modo básico sin Gemini)\n');

  // Crear agente sin Gemini
  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: false
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
  console.log('⚙️ Análisis básico (sin Gemini AI)');

  console.log(`- Nivel de vaguedad: ${(result.analysis.vagueness * 100).toFixed(1)}%`);
  console.log(`- Claridad: ${(result.analysis.clarity * 100).toFixed(1)}%`);
  console.log(`- Especificidad: ${(result.analysis.specificity * 100).toFixed(1)}%`);
  console.log(`- Completitud: ${(result.analysis.completeness * 100).toFixed(1)}%`);
  console.log(`- Elementos faltantes: ${result.analysis.missingElements?.join(', ') || 'ninguno'}`);

  console.log('\n✨ Prompt mejorado:');
  console.log(`"${result.enhancedPrompt}"\n`);

  console.log('🔧 Mejoras aplicadas:');
  result.enhancements.forEach((enhancement, index) => {
    console.log(`${index + 1}. ${enhancement.description} (${enhancement.type})`);
    console.log(`   Mejora estimada: ${(enhancement.improvement * 100).toFixed(1)}%`);
  });

  console.log(`\n📊 Mejora total de calidad: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);

  // Demostrar detección inteligente de vaguedad
  console.log('\n🎯 Sistema inteligente de detección de vaguedad:');
  
  const vagueTests = [
    "algo de marketing automático",
    "necesito un workflow que haga cosas de ventas",
    "crear algo para clientes que no sé bien qué",
    "automatizar procesos tipo CRM o algo así"
  ];

  for (const testPrompt of vagueTests) {
    const analysis = await agent.analyzePrompt(testPrompt);
    console.log(`"${testPrompt}" → Vaguedad: ${(analysis.vagueness * 100).toFixed(1)}%`);
  }

  console.log('\n✅ Test completado exitosamente!');
  console.log('\n💡 Mejoras implementadas en el sistema:');
  console.log('- ✅ Detección inteligente de vaguedad con múltiples indicadores');
  console.log('- ✅ Corrección automática de errores ortográficos');
  console.log('- ✅ Análisis específico para workflows de Telegram/Calendar');
  console.log('- ✅ Mejoras contextuales basadas en integraciones');
  console.log('- ✅ Sistema preparado para Gemini AI (cuando esté disponible)');

  return result;
}

// Ejecutar el test
testBasicEnhancedAgent().catch(error => {
  console.error('❌ Error en el test:', error.message);
});

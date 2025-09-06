// Configuración manual de Gemini API Key para pruebas
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testWithRealGeminiKey() {
  console.log('🚀 Test con clave real de Gemini AI\n');

  // IMPORTANTE: Reemplaza 'TU_CLAVE_GEMINI_AQUI' con tu clave real
  const GEMINI_API_KEY = 'TU_CLAVE_GEMINI_AQUI'; // ⚠️ Cambiar por tu clave real

  if (GEMINI_API_KEY === 'TU_CLAVE_GEMINI_AQUI') {
    console.log('❌ Error: Debes configurar tu clave real de Gemini');
    console.log('📝 Pasos para obtener la clave:');
    console.log('1. Ve a: https://makersuite.google.com/app/apikey');
    console.log('2. Crea una nueva API key');
    console.log('3. Reemplaza "TU_CLAVE_GEMINI_AQUI" en este archivo');
    console.log('4. Ejecuta nuevamente el test');
    return;
  }

  // Crear agente con clave real
  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: GEMINI_API_KEY
  });

  console.log('🧪 Probando análisis inteligente con Gemini...');
  
  const testPrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars";

  try {
    const result = await agent.enhancePrompt(testPrompt);

    console.log('\n✅ Gemini AI funcionando correctamente!');
    console.log('📊 Resultados del análisis:');
    console.log('- Gemini habilitado:', result.analysis.geminiEnhanced);
    console.log('- Vaguedad detectada:', (result.analysis.vagueness * 100).toFixed(1) + '%');
    console.log('- Errores detectados:', result.analysis.detectedErrors?.join(', ') || 'ninguno');
    console.log('- Sugerencias de IA:', result.analysis.aiSuggestions?.slice(0, 2).join(', ') || 'ninguna');

    console.log('\n📝 Prompt original:');
    console.log(`"${result.originalPrompt}"`);
    
    console.log('\n✨ Prompt mejorado por Gemini:');
    console.log(`"${result.enhancedPrompt}"`);

  } catch (error) {
    console.error('❌ Error al conectar con Gemini:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 La clave API parece ser inválida');
    } else if (error.message.includes('quota')) {
      console.log('💡 Límite de cuota alcanzado');
    } else {
      console.log('💡 Revisa tu conexión a internet y la clave API');
    }
  }
}

// Ejecutar el test
testWithRealGeminiKey().catch(console.error);

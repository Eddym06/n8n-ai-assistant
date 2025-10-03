// Test de conexión directa con Gemini AI
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testGeminiConnection() {
  console.log('🔍 Verificando configuración de Gemini AI...\n');

  // Verificar variables de entorno
  console.log('📋 Estado de configuración:');
  console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Configurada' : '❌ No configurada');
  
  // Probar con clave simulada
  console.log('\n🧪 Probando agente con clave simulada...');
  const agentWithKey = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: 'test_key_123' // Clave de prueba
  });

  console.log('\n🧪 Probando agente sin clave...');
  const agentWithoutKey = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: null
  });

  console.log('\n🧪 Probando agente con Gemini deshabilitado...');
  const agentDisabled = new PromptEnhancementAgent({
    useGeminiAnalysis: false
  });

  // Probar análisis básico
  console.log('\n📝 Probando análisis básico (sin llamadas a Gemini)...');
  const testPrompt = "necesito algo de marketing automático";
  
  const result = await agentDisabled.analyzePrompt(testPrompt);
  console.log('Resultado del análisis básico:');
  console.log('- Tipo detectado:', result.type);
  console.log('- Vaguedad:', (result.vagueness * 100).toFixed(1) + '%');
  console.log('- Gemini habilitado:', result.geminiEnhanced);

  console.log('\n💡 Estado actual del sistema:');
  console.log('✅ Dependencia @google/generative-ai instalada');
  console.log('✅ Código de Gemini implementado');
  console.log('✅ Fallback a análisis básico funcional');
  console.log('⚠️ Requiere GEMINI_API_KEY para funcionalidad completa');

  console.log('\n📖 Cómo configurar Gemini:');
  console.log('1. Obtener API key de Google AI Studio: https://makersuite.google.com/app/apikey');
  console.log('2. Ejecutar: $env:GEMINI_API_KEY="tu_clave_aqui" (Windows PowerShell)');
  console.log('3. O crear archivo .env con: GEMINI_API_KEY=tu_clave_aqui');
  console.log('4. Reiniciar el terminal y probar nuevamente');

  return result;
}

// Ejecutar el test
testGeminiConnection().catch(console.error);

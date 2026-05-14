// Test específico con Gemini usando dotenv y el prompt del usuario
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import { config } from 'dotenv';

// Cargar variables de entorno del archivo .env
config();

async function testUserPromptWithGemini() {
  console.log('🚀 Probando Prompt Enhancement Agent con Gemini AI y prompt del usuario\n');

  // Verificar que la API key está cargada
  console.log('🔑 Verificando configuración:');
  console.log('- GEMINI_API_KEY configurada:', !!process.env.GEMINI_API_KEY);
  console.log('- Longitud de la clave:', process.env.GEMINI_API_KEY?.length || 0);
  console.log('- Inicia con AIza:', process.env.GEMINI_API_KEY?.startsWith('AIza') || false);

  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ Error: No se pudo cargar GEMINI_API_KEY del archivo .env');
    return;
  }

  console.log('\n✅ API Key cargada correctamente\n');

  // Crear agente con Gemini habilitado
  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: process.env.GEMINI_API_KEY
  });

  // El prompt exacto del usuario
  const userPrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio. También necesito que des una respuesta al cliente en donde diga que los datos se han enviado correctamente";

  console.log('📝 Prompt original del usuario:');
  console.log(`"${userPrompt}"\n`);

  console.log('🧠 Analizando con Gemini AI...');

  try {
    const result = await agent.enhancePrompt(userPrompt, {
      userPreferences: {
        language: 'spanish',
        platform: 'n8n',
        workflowType: 'automation'
      },
      technicalConstraints: {
        integrations: ['telegram', 'google-calendar', 'email'],
        nodes: ['telegram-trigger', 'google-calendar', 'email-send'],
        requirements: ['error-handling', 'confirmation-message']
      }
    });

    console.log('\n🎯 Resultados del análisis con Gemini:');
    console.log('- Análisis potenciado por Gemini:', result.analysis.geminiEnhanced);
    console.log('- Tipo de prompt detectado:', result.analysis.type);
    console.log('- Nivel de vaguedad:', (result.analysis.vagueness * 100).toFixed(1) + '%');
    console.log('- Claridad:', (result.analysis.clarity * 100).toFixed(1) + '%');
    console.log('- Especificidad:', (result.analysis.specificity * 100).toFixed(1) + '%');
    console.log('- Completitud:', (result.analysis.completeness * 100).toFixed(1) + '%');

    if (result.analysis.detectedErrors) {
      console.log('- Errores detectados por Gemini:', result.analysis.detectedErrors.join(', '));
    }

    if (result.analysis.aiSuggestions) {
      console.log('- Sugerencias de Gemini:');
      result.analysis.aiSuggestions.slice(0, 3).forEach((suggestion, i) => {
        console.log(`  ${i + 1}. ${suggestion}`);
      });
    }

    console.log('\n✨ Prompt mejorado por Gemini AI:');
    console.log(`"${result.enhancedPrompt}"\n`);

    console.log('🔧 Mejoras aplicadas:');
    result.enhancements.forEach((enhancement, index) => {
      console.log(`${index + 1}. ${enhancement.description}`);
      if (enhancement.type === 'gemini_enhancement') {
        console.log('   🤖 Mejora generada por Gemini AI');
      } else {
        console.log(`   📊 Tipo: ${enhancement.type} | Mejora: ${(enhancement.improvement * 100).toFixed(1)}%`);
      }
    });

    console.log(`\n📈 Mejora total de calidad: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);

    // Comparación antes/después
    console.log('\n📊 Comparación detallada:');
    console.log('ANTES:');
    console.log(`- Longitud: ${result.originalPrompt.length} caracteres`);
    console.log(`- Palabras: ${result.analysis.wordCount}`);
    console.log(`- Errores ortográficos: ${result.analysis.detectedErrors?.length || 0}`);

    console.log('\nDESPUÉS:');
    console.log(`- Longitud: ${result.enhancedPrompt.length} caracteres`);
    console.log(`- Mejoras aplicadas: ${result.enhancements.length}`);
    if (result.validation.enhancedAnalysis) {
      console.log(`- Nueva vaguedad: ${((result.validation.enhancedAnalysis.vagueness || 0) * 100).toFixed(1)}%`);
    }

    console.log('\n✅ Test completado exitosamente con Gemini AI!');

  } catch (error) {
    console.error('\n❌ Error al usar Gemini:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 La clave API parece ser inválida. Verifica en Google AI Studio.');
    } else if (error.message.includes('quota')) {
      console.log('💡 Límite de cuota alcanzado. Espera un momento e intenta de nuevo.');
    } else if (error.message.includes('403')) {
      console.log('💡 Error de permisos. Verifica que la API key tenga acceso a Gemini.');
    } else {
      console.log('💡 Error de conexión. Verifica tu internet y la configuración.');
    }
    
    console.log('\n🔄 Reintentando con análisis básico...');
    
    // Fallback a análisis básico
    const basicAgent = new PromptEnhancementAgent({ useGeminiAnalysis: false });
    const basicResult = await basicAgent.enhancePrompt(userPrompt);
    
    console.log('📊 Resultado con análisis básico:');
    console.log(`- Vaguedad: ${(basicResult.analysis.vagueness * 100).toFixed(1)}%`);
    console.log(`- Prompt mejorado: "${basicResult.enhancedPrompt.substring(0, 100)}..."`);
  }
}

// Ejecutar el test
testUserPromptWithGemini().catch(console.error);

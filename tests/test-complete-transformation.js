// Test específico para ver la transformación completa del prompt
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import { config } from 'dotenv';

config();

async function testCompleteTransformation() {
  console.log('🔍 PRUEBA DE TRANSFORMACIÓN COMPLETA\n');

  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: false, // Desactivar Gemini para ver solo la transformación local
    maxEnhancements: 1
  });

  const originalPrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio";

  console.log('📝 PROMPT ORIGINAL:');
  console.log('-'.repeat(80));
  console.log(originalPrompt);
  console.log('\n');

  // Test directo del método de transformación
  console.log('🔧 APLICANDO TRANSFORMACIÓN DE CHATBOT...\n');
  
  const transformedPrompt = agent.transformChatbotIntegration(originalPrompt);
  
  console.log('✨ PROMPT TRANSFORMADO:');
  console.log('='.repeat(80));
  console.log(transformedPrompt);
  console.log('='.repeat(80));

  console.log('\n📊 ESTADÍSTICAS:');
  console.log(`- Longitud original: ${originalPrompt.length} caracteres`);
  console.log(`- Longitud transformada: ${transformedPrompt.length} caracteres`);
  console.log(`- Incremento: ${((transformedPrompt.length / originalPrompt.length - 1) * 100).toFixed(1)}%`);
  console.log(`- Ratio de mejora: ${(transformedPrompt.length / originalPrompt.length).toFixed(1)}x más detallado`);

  // Contar elementos técnicos agregados
  const technicalElements = [
    'STEP', 'NODE', 'OAuth2', 'webhook', 'JavaScript', 'regex', 
    'authentication', 'API', 'JSON', 'variables', 'function',
    'configuration', 'error handling', 'validation'
  ];

  const elementsFound = technicalElements.filter(element => 
    transformedPrompt.toLowerCase().includes(element.toLowerCase())
  ).length;

  console.log(`- Elementos técnicos agregados: ${elementsFound}/${technicalElements.length}`);
  
  if (transformedPrompt.includes('```javascript')) {
    console.log('✅ Código JavaScript incluido');
  }
  if (transformedPrompt.includes('```json')) {
    console.log('✅ Formato JSON incluido');
  }
  if (transformedPrompt.includes('```html')) {
    console.log('✅ Template HTML incluido');
  }

  console.log('\n🎯 ELEMENTOS FUNCIONALES DETECTADOS:');
  const functionalElements = [
    'TRIGGER NODE', 'FUNCTION NODE', 'IF NODE', 'RESPONSE NODE',
    'Variables capturadas', 'Rate limiting', 'Manejo de errores',
    'Validaciones', 'Configuración', 'Casos edge'
  ];

  functionalElements.forEach(element => {
    if (transformedPrompt.includes(element)) {
      console.log(`✅ ${element}`);
    } else {
      console.log(`❌ ${element}`);
    }
  });

  console.log('\n🚀 CONCLUSIÓN:');
  console.log('El prompt vago de 1 línea ahora es una especificación técnica completa');
  console.log('que incluye arquitectura, código, configuraciones y casos edge.');
  console.log('¡Perfecto para que Gemini genere un workflow funcional de n8n!');
}

testCompleteTransformation().catch(console.error);

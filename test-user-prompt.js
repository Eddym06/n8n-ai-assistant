// Test específico con el prompt del usuario
import PromptEnhancementAgent from './prompt-enhancement-agent.js';

async function testUserPrompt() {
  console.log('🔍 TESTING CON PROMPT ESPECÍFICO DEL USUARIO');
  console.log('=============================================');
  
  try {
    const agent = new PromptEnhancementAgent();
    
    const userPrompt = 'necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio. También necesito que des una respuesta al cliente en donde diga que los datos se han enviado correctamente';
    
    console.log();
    console.log('📝 PROMPT ORIGINAL:');
    console.log('===================');
    console.log(`"${userPrompt}"`);
    console.log(`Longitud: ${userPrompt.length} caracteres`);
    console.log();
    
    console.log('🔄 Procesando mejora...');
    const result = await agent.enhancePrompt(userPrompt);
    
    console.log('📈 ESTADÍSTICAS DE MEJORA:');
    console.log('==========================');
    console.log(`Longitud original: ${userPrompt.length} caracteres`);
    console.log(`Longitud mejorada: ${result.enhancedPrompt.length} caracteres`);
    console.log(`Ratio de mejora: ${(result.enhancedPrompt.length / userPrompt.length).toFixed(1)}x más detallado`);
    console.log(`Incremento: +${result.enhancedPrompt.length - userPrompt.length} caracteres`);
    console.log(`Mejoras aplicadas: ${result.enhancements.length}`);
    console.log();
    
    console.log('🚀 PROMPT MEJORADO COMPLETO:');
    console.log('============================');
    console.log(result.enhancedPrompt);
    console.log();
    
    console.log('✅ TRANSFORMACIÓN COMPLETADA');
    console.log('============================');
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUserPrompt();
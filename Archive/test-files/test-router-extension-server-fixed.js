// Test directo del Router Gemini en Extension Server Fixed (EL REY 👑)
import dotenv from 'dotenv';
import GeminiModelRouter from './gemini-model-router.js';

dotenv.config();

console.log('👑 TESTING ROUTER GEMINI EN EXTENSION SERVER FIXED (EL REY)');
console.log('===============================================================');

async function testRouterInExtensionServerFixed() {
  try {
    // Inicializar el router
    const router = new GeminiModelRouter();
    console.log('🚀 Router Gemini inicializado para testing');
    
    // Test prompt simple
    const prompt = "crear workflow simple con webhook para testing del router";
    console.log(`📝 Prompt de prueba: "${prompt}"`);
    console.log('👑 Ejecutando con agente "extension-server" (Pro models)...');
    
    const startTime = Date.now();
    
    // Llamar al router como lo haría el extension server
    const response = await router.generateContent(
      prompt, 
      'extension-server',  // Agente específico para modelos Pro
      { 
        maxTokens: 1000, 
        temperature: 0.7,
        metadata: {
          source: 'extension-server-fixed-test',
          test: true
        }
      }
    );
    
    const endTime = Date.now();
    
    console.log('✅ RESPUESTA EXITOSA DEL ROUTER:');
    console.log(`⏱️ Tiempo de respuesta: ${endTime - startTime}ms`);
    console.log('🔍 Tipo de respuesta:', typeof response);
    console.log('📊 Estructura de respuesta:', response);
    
    // Si es un string, mostrar información
    if (typeof response === 'string') {
      console.log(`📏 Longitud de respuesta: ${response.length} caracteres`);
      console.log('📊 Primeros 200 caracteres:');
      console.log(response.substring(0, 200) + '...');
    } else {
      console.log('📦 Respuesta completa:', JSON.stringify(response, null, 2));
    }
    
    // Mostrar métricas del router
    console.log('\n📊 MÉTRICAS DEL ROUTER:');
    const metrics = router.getMetrics();
    console.log('📈 Estadísticas globales:', metrics);
    
    console.log('\n🎯 TEST COMPLETADO - Router funcionando correctamente en Extension Server Fixed!');
    
  } catch (error) {
    console.error('❌ ERROR EN TEST DEL ROUTER:', error.message);
    console.error('🔍 Stack trace:', error.stack);
  }
}

// Ejecutar test
testRouterInExtensionServerFixed();
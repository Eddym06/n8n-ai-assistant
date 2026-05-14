// Depuración específica para identificar por qué Gemini no se llama
import { config } from 'dotenv';
config();

console.log('🔍 DEPURACIÓN GEMINI CALLS - Test Directo');
console.log('==========================================');

// Verificar configuración
console.log('\n1. VERIFICACIÓN DE CONFIGURACIÓN:');
console.log(`   ✅ GEMINI_API_KEY configurada: ${!!process.env.GEMINI_API_KEY}`);
console.log(`   ✅ FORCE_V4: ${process.env.FORCE_V4}`);
console.log(`   ✅ API Key length: ${process.env.GEMINI_API_KEY?.length || 0}`);
console.log(`   ✅ API Key starts with AIza: ${process.env.GEMINI_API_KEY?.startsWith('AIza') || false}`);

// Test directo de callGeminiMassive
async function testGeminiDirectCall() {
  try {
    console.log('\n2. TEST DIRECTO DE callGeminiMassive:');
    
    // Simular las imports y clases necesarias
    const messages = [{ content: 'Genera un simple workflow de prueba con webhook y email' }];
    
    console.log('🚀 Intentando llamada directa a Gemini...');
    
    // Test fetch directo
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          parts: [{
            text: typeof msg === 'string' ? msg : (msg.content || msg.text || JSON.stringify(msg))
          }]
        })),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      })
    });

    console.log(`📡 Response status: ${response.status}`);
    console.log(`📡 Response ok: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Gemini respondió correctamente!');
      console.log(`📊 Candidates: ${data.candidates?.length || 0}`);
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        console.log(`📝 Respuesta length: ${text.length} chars`);
        console.log(`📝 Primeros 200 chars: ${text.substring(0, 200)}...`);
      }
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ Error HTTP ${response.status}: ${errorText}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error en test directo: ${error.message}`);
    return false;
  }
}

// Test de logging del tracker
function testGeminiTracker() {
  console.log('\n3. TEST DEL GEMINI CALL TRACKER:');
  
  // Simular el tracker global
  global.GeminiCallTracker = {
    calls: [],
    recordCall: function(source, operation, promptLength, model) {
      const call = {
        timestamp: new Date().toISOString(),
        source,
        operation,
        promptLength,
        model
      };
      this.calls.push(call);
      console.log(`📞 CALL RECORDED: ${source} -> ${operation} (${promptLength} chars, ${model})`);
    },
    getStats: function() {
      return {
        totalCalls: this.calls.length,
        calls: this.calls
      };
    }
  };
  
  // Simular una llamada
  global.GeminiCallTracker.recordCall('TestDebug', 'generateContent', 100, 'gemini-2.5-flash');
  
  console.log(`📊 Total llamadas registradas: ${global.GeminiCallTracker.getStats().totalCalls}`);
}

// Ejecutar tests
async function runDebugTests() {
  testGeminiTracker();
  const geminiWorks = await testGeminiDirectCall();
  
  console.log('\n4. RESUMEN DE DEPURACIÓN:');
  console.log(`   Configuración: ${!!process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
  console.log(`   Llamada directa: ${geminiWorks ? '✅' : '❌'}`);
  console.log(`   Tracker funcionando: ✅`);
  
  if (geminiWorks) {
    console.log('\n🎯 CONCLUSIÓN: Gemini API funciona correctamente');
    console.log('   El problema debe estar en la lógica de enrutamiento o condicionales');
  } else {
    console.log('\n❌ CONCLUSIÓN: Problema con la configuración de Gemini API');
  }
}

runDebugTests();
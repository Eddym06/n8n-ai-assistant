// Test para simular exactamente lo que hace el sistema principal
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function callGeminiMassiveTest(messages, maxTokens = 50000, temperature = 1.0) {
  try {
    console.log(`🚀 Llamada masiva a Gemini con ${messages.length} mensaje(s)`);
    
    // Verificar que existe API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('❌ GEMINI_API_KEY no configurada en archivo .env');
    }
    
    console.log('🔑 DEBUG: API Key existe:', !!process.env.GEMINI_API_KEY);
    console.log('🔑 DEBUG: API Key longitud:', process.env.GEMINI_API_KEY.length);
    console.log('🔑 DEBUG: API Key inicia con AIza:', process.env.GEMINI_API_KEY.startsWith('AIza'));
    console.log('🔑 DEBUG: API Key valor (primeros 10):', process.env.GEMINI_API_KEY.substring(0, 10));
    
    console.log('🔮 Usando Gemini 2.5 Flash real de Google con salida masiva');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    console.log('🌐 URL construida:', url.substring(0, 120) + '...');
    
    const payload = {
      contents: messages.map(msg => ({
        parts: [{
          text: typeof msg === 'string' ? msg : (msg.content || msg.text || JSON.stringify(msg))
        }]
      })),
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
      }
    };
    
    console.log('📦 Payload:', JSON.stringify(payload, null, 2).substring(0, 300) + '...');
    
    console.log('🚀 Enviando request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Error en API de Gemini:`, response.status, errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta recibida exitosamente');
    
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error(`❌ Error en callGeminiMassive:`, error.message);
    throw error;
  }
}

// Test con el mismo formato que usa el sistema
const testMessages = [{ role: 'user', content: 'Hola, test simple' }];
callGeminiMassiveTest(testMessages);

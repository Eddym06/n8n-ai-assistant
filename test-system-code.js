// Test que copia exactamente el código del sistema principal
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Cargar .env exactamente como lo hace el sistema
dotenv.config();

console.log('🔍 Test exacto del código del sistema principal...');

// Verificar que tenemos la API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error('❌ GEMINI_API_KEY no configurada en archivo .env');
}

console.log('🔮 Usando Gemini 2.5 Flash real de Google con salida masiva - TEST DIRECTO');

// Copiar exactamente el código del sistema principal
const finalPrompt = 'Crear un workflow simple en n8n';
const maxTokens = 50000;
const temperature = 1.0;

async function testSystemCode() {
  try {
    // Usar fetch directamente para test
    const fetchModule = fetch;

    const response = await fetchModule(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: finalPrompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Error en API de Gemini:`, response.status, errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ ¡Llamada exitosa!');
    console.log('📝 Respuesta:', data.candidates[0].content.parts[0].text.substring(0, 100) + '...');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

testSystemCode();

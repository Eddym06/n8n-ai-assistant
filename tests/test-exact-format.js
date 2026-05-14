// Test exacto del formato de mensajes que usa el sistema principal
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Cargar .env
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testExactSystemFormat() {
  try {
    console.log('🔍 Probando formato exacto del sistema principal...');

    // Este es exactamente el formato que usa el sistema principal
    const messages = [{ role: 'user', content: 'Hola, prueba de formato exacto' }];

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
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
          temperature: 1.0,
          maxOutputTokens: 50000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Error en respuesta:', response.status, response.statusText);
      console.error('📄 Error details:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ ¡Llamada exitosa con formato exacto!');
    console.log('📝 Respuesta:', data.candidates[0].content.parts[0].text.substring(0, 100) + '...');
    return true;

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

testExactSystemFormat();

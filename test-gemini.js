// Archivo de prueba para Gemini API
// Prueba rápida de conexión con Gemini

import fetch from 'node-fetch';

const GEMINI_API_KEY = 'your_google_api_key_here';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function testGeminiConnection() {
  try {
    console.log('🔮 Probando conexión con Gemini API...');

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hola, esta es una prueba de conexión. Responde con "Conexión exitosa" si puedes leerme.'
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error en la respuesta:', response.status, response.statusText);
      console.error('📄 Detalles del error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ Conexión exitosa con Gemini!');
    console.log('📝 Respuesta:', data.candidates[0].content.parts[0].text);
    return true;

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// Ejecutar prueba
testGeminiConnection().then(success => {
  if (success) {
    console.log('🎉 ¡La API key funciona correctamente!');
  } else {
    console.log('⚠️ La API key no es válida o hay un problema de conexión.');
  }
});

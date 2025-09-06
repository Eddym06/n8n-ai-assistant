// Debug script para verificar configuración del sistema principal
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Cargar .env
dotenv.config();

console.log('🔍 Verificando configuración del sistema...');
console.log('GEMINI_API_KEY existe:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY longitud:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
console.log('GEMINI_API_KEY inicia con AIza:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.startsWith('AIza') : false);

// Probar la misma llamada que hace el sistema principal
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testMainSystemCall() {
  try {
    console.log('🚀 Probando llamada idéntica al sistema principal...');

    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Prueba de conexión desde debug script'
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Error en respuesta:', response.status, response.statusText);
      console.error('📄 Error details:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ ¡Llamada exitosa!');
    console.log('📝 Respuesta:', data.candidates[0].content.parts[0].text);
    return true;

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

testMainSystemCall();

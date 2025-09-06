// Debug script para verificar configuración de .env
import dotenv from 'dotenv';

console.log('🔍 Verificando configuración de .env...');

// Cargar variables de entorno
const result = dotenv.config();
console.log('📄 Resultado de carga .env:', result);

console.log('🔑 GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Configurada' : '❌ No configurada');
console.log('📊 Longitud de API key:', process.env.GEMINI_API_KEY?.length || 0);

if (process.env.GEMINI_API_KEY) {
  console.log('🔐 API Key (primeros 10 caracteres):', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
}

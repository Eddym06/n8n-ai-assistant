// Test de carga de .env en el contexto del sistema principal
import dotenv from 'dotenv';

// Simular la carga de .env como lo hace el sistema principal
dotenv.config();

console.log('🔍 Verificando carga de .env en contexto del sistema...');
console.log('process.env.GEMINI_API_KEY existe:', !!process.env.GEMINI_API_KEY);
console.log('process.env.GEMINI_API_KEY valor:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'undefined');
console.log('process.env.GEMINI_API_KEY longitud:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

// Verificar que sea la misma key que funciona en otros tests
const expectedKey = 'your_google_api_key_here';
console.log('¿Es la key esperada?', process.env.GEMINI_API_KEY === expectedKey);

// Verificar todas las variables de entorno
console.log('\n📋 Todas las variables de entorno:');
Object.keys(process.env).forEach(key => {
  if (key.includes('GEMINI') || key.includes('API')) {
    console.log(`${key}: ${process.env[key] ? process.env[key].substring(0, 10) + '...' : 'undefined'}`);
  }
});

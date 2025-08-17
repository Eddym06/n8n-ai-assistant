// Quick test para diagnosticar el servidor
import http from 'http';

console.log('🧪 Iniciando quick test del servidor Phase 3...');

// Wait a bit for server to be ready
setTimeout(async () => {
  await runQuickTests();
}, 1000);

// Test simple de conectividad
const testServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/health', { 
      method: 'GET',
      timeout: 5000 
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Servidor respondió:', res.statusCode);
        console.log('📊 Respuesta:', data);
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log('❌ Error de conexión:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout de conexión');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Test con API key
const testWithApiKey = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/memory/stats',
      method: 'GET',
      headers: {
        'X-API-Key': 'n8n-ai-phase3-key',
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ API endpoint respondió:', res.statusCode);
        console.log('📊 Respuesta API:', data);
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log('❌ Error API:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout API');
      req.destroy();
      reject(new Error('API Timeout'));
    });

    req.end();
  });
};

// Ejecutar tests
async function runQuickTests() {
  try {
    console.log('\n1️⃣ Probando endpoint /health...');
    await testServer();
    
    console.log('\n2️⃣ Probando endpoint con API key...');
    await testWithApiKey();
    
    console.log('\n🎉 Todos los tests pasaron!');
  } catch (error) {
    console.log('\n💥 Test falló:', error.message);
    
    // Diagnóstico adicional
    console.log('\n🔍 Diagnóstico:');
    console.log('- Puerto esperado: 3000');
    console.log('- API Key esperado: n8n-ai-phase3-key');
    console.log('- Verificar que el servidor esté ejecutándose');
    
    // Verificar si hay procesos node ejecutándose
    console.log('\n🔎 Verificando procesos Node.js...');
  }
}

runQuickTests();

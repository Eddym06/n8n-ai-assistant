// Simple test para el servidor Phase 3
import http from 'http';

console.log('🧪 Testando servidor Phase 3...');

// Simple health check
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('✅ Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Response body:', data);
    
    // Test API endpoint
    testApiEndpoint();
  });
});

req.on('error', (error) => {
  console.log('❌ Error:', error.message);
  console.log('❌ El servidor no está respondiendo en puerto 3000');
});

req.on('timeout', () => {
  console.log('❌ Timeout - servidor no respondió');
  req.destroy();
});

req.end();

// Test API endpoint
function testApiEndpoint() {
  console.log('\n🔬 Testando endpoint API...');
  
  const apiOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/memory/stats',
    method: 'GET',
    headers: {
      'X-API-Key': 'n8n-ai-phase3-key',
      'Content-Type': 'application/json'
    },
    timeout: 3000
  };

  const apiReq = http.request(apiOptions, (res) => {
    console.log('✅ API Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ API Response:', data);
      console.log('\n🎉 Servidor funcionando correctamente!');
    });
  });

  apiReq.on('error', (error) => {
    console.log('❌ API Error:', error.message);
  });

  apiReq.on('timeout', () => {
    console.log('❌ API Timeout');
    apiReq.destroy();
  });

  apiReq.end();
}

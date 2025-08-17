// Servidor mínimo para testing
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta básica de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    message: 'Phase 3 server is running'
  });
});

// Ruta con API key
app.get('/api/test', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'n8n-ai-phase3-key') {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  res.json({
    message: 'API test successful',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor mínimo corriendo en puerto ${port}`);
  console.log(`🔧 Health: http://localhost:${port}/health`);
  console.log(`🔑 API Test: http://localhost:${port}/api/test`);
});

server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

// Manejo de cierre
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});

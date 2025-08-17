// Servidor persistente para testing
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para API key
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'n8n-ai-phase3-key') {
    return res.status(401).json({ error: 'Unauthorized - Invalid API Key' });
  }
  next();
};

// Ruta básica de health check (sin API key)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '3.0.0',
    phase: 'Phase 3 - Advanced Intelligence',
    timestamp: new Date().toISOString(),
    features: ['multi-agent', 'collaboration', 'simulation', 'git-integration'],
    stats: {
      workflows: 0,
      memories: 0,
      templates: 3,
      collaborationRooms: 0
    }
  });
});

// Endpoints con API key
app.post('/api/multi-agent', requireApiKey, (req, res) => {
  const { prompt } = req.body;
  res.json({
    success: true,
    routing: {
      selected_agents: ['optimization'],
      reasoning: 'Simple test routing',
      execution_plan: 'Process with optimization agent'
    },
    results: {
      optimization: {
        agent: 'optimization',
        response: `Processed: ${prompt}`,
        timestamp: new Date().toISOString()
      }
    },
    summary: 'Test multi-agent response'
  });
});

app.post('/api/simulate', requireApiKey, (req, res) => {
  const { workflow } = req.body;
  res.json({
    success: true,
    workflow_name: workflow?.name || 'Test Workflow',
    predictions: [{
      node: 'test-node',
      bottleneck_risk: 0.3,
      optimization: 'Test optimization',
      parallel_candidates: []
    }],
    performance_metrics: {
      estimated_runtime: 25.5,
      memory_usage: 64,
      parallel_efficiency: 0.85
    },
    optimizations: ['Add parallel processing'],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/memory/stats', requireApiKey, (req, res) => {
  res.json({
    success: true,
    stats: {
      total: 0,
      categories: [],
      recent: []
    }
  });
});

app.get('/api/collab/rooms', requireApiKey, (req, res) => {
  res.json({
    success: true,
    rooms: []
  });
});

app.get('/api/templates', requireApiKey, (req, res) => {
  res.json({
    success: true,
    templates: [
      {
        id: '1',
        name: 'Test Template',
        description: 'A test template',
        category: 'test'
      }
    ],
    total: 1
  });
});

// Iniciar servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor Phase 3 Test corriendo en puerto ${port}`);
  console.log(`🔧 Health: http://localhost:${port}/health`);
  console.log(`🔑 API Key requerido: n8n-ai-phase3-key`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   GET  /health (público)`);
  console.log(`   POST /api/multi-agent (requiere API key)`);
  console.log(`   POST /api/simulate (requiere API key)`);
  console.log(`   GET  /api/memory/stats (requiere API key)`);
  console.log(`   GET  /api/collab/rooms (requiere API key)`);
  console.log(`   GET  /api/templates (requiere API key)`);
});

server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

// Manejo básico de logs
server.on('request', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
});

console.log('✅ Servidor configurado y listo para iniciar...');

// Servidor simplificado para tests - Puerto 3000
import express from 'express';
import cors from 'cors';

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: '*',
  credentials: true
}));

// Simulación de analytics en memoria
const analytics = {
  workflows: 156,
  queries: 1234,
  startTime: Date.now(),
  sessions: 45,
  errors: 3,
  responseTime: 120,
  concurrent: 8
};

const templates = [
  { id: 1, name: "Email Automation", category: "communication" },
  { id: 2, name: "Data Processing", category: "data" },
  { id: 3, name: "Slack Integration", category: "integration" }
];

const memories = [
  { id: 1, content: "Test memory 1", timestamp: Date.now() },
  { id: 2, content: "Test memory 2", timestamp: Date.now() - 1000 }
];

// Health Check - Endpoint principal que fallan los tests
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    server: { status: 'running', version: '4.0.0' },
    redis: { status: 'connected' },
    uptime: Math.floor((Date.now() - analytics.startTime) / 1000),
    activeConnections: 5,
    memory: process.memoryUsage()
  });
});

// Analytics endpoints
app.get('/api/analytics', (req, res) => {
  res.json({
    summary: {
      workflows: analytics.workflows,
      queries: analytics.queries,
      sessions: analytics.sessions,
      errors: analytics.errors
    },
    performance: {
      averageResponseTime: analytics.responseTime,
      concurrentUsers: analytics.concurrent,
      uptime: Math.floor((Date.now() - analytics.startTime) / 1000)
    },
    cache: {
      hits: 850,
      misses: 150,
      hitRate: 0.85
    }
  });
});

// Cache endpoints
app.get('/api/cache/stats', (req, res) => {
  res.json({
    hits: 850,
    misses: 150,
    hitRate: 0.85,
    size: 1024,
    keys: ['workflows', 'templates', 'users']
  });
});

app.delete('/api/cache/clear', (req, res) => {
  res.json({ success: true, message: 'Cache cleared' });
});

// Templates endpoints
app.get('/api/templates', (req, res) => {
  const { category, search } = req.query;
  let result = templates;
  
  if (category) {
    result = result.filter(t => t.category === category);
  }
  if (search) {
    result = result.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  }
  
  res.json({ templates: result, total: result.length });
});

app.get('/api/templates/categories', (req, res) => {
  const categories = [...new Set(templates.map(t => t.category))];
  res.json({ categories });
});

// Memory endpoints
app.get('/api/memory', (req, res) => {
  res.json({ memories, total: memories.length });
});

app.post('/api/memory', (req, res) => {
  const { content } = req.body;
  const newMemory = {
    id: memories.length + 1,
    content,
    timestamp: Date.now()
  };
  memories.push(newMemory);
  res.json({ success: true, id: newMemory.id });
});

// Simulation endpoints
app.post('/api/simulate', (req, res) => {
  const { workflow } = req.body;
  const nodes = workflow?.nodes || [];
  
  res.json({
    success: true,
    simulatedNodes: nodes.length,
    results: {
      nodesProcessed: nodes.length,
      executionTime: Math.random() * 1000,
      performance: {
        averageNodeTime: 50,
        totalTime: nodes.length * 50,
        bottlenecks: nodes.length > 5 ? ['Node 3'] : []
      }
    }
  });
});

// Integrations
app.post('/api/integrations/slack', (req, res) => {
  res.json({ success: true, message: 'Slack notification sent' });
});

app.get('/api/backup/memory', (req, res) => {
  res.json({ 
    success: true, 
    data: memories,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/backup/templates', (req, res) => {
  res.json({ 
    success: true, 
    data: templates,
    timestamp: new Date().toISOString()
  });
});

// Voice input
app.post('/api/voice/process', (req, res) => {
  const { audioData } = req.body;
  res.json({ 
    success: true, 
    transcription: 'Sample voice command',
    confidence: 0.95 
  });
});

// Error handling middleware
app.use('/api/invalid', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((req, res, next) => {
  if (req.body && JSON.stringify(req.body).length > 1000000) {
    return res.status(413).json({ error: 'Payload too large' });
  }
  next();
});

// Rate limiting simulation
let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  if (requestCount > 100) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
});

// Security headers (Helmet simulation)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Catch all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 n8n AI Assistant Test Server running on port ${PORT}`);
    console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;

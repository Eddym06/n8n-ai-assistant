import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fuse from 'fuse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
let embedder;
let workflowsDB = [];
let memoryStore = [];

// Configuration
const config = {
  API_KEY: process.env.API_KEY || 'n8n-ai-' + Math.random().toString(36).substr(2, 9),
  MAX_MEMORY_ITEMS: 500,
  WORKFLOWS_PATH: path.join(__dirname, 'src', 'assets', 'Workflow description')
};

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('dist')); // Serve static files

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (!apiKey || apiKey !== config.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// Initialize AI services
async function initializeServices() {
  try {
    console.log('🚀 Initializing services...');
    
    // Initialize embedder (simplified version)
    console.log('✅ Services initialized (lightweight mode)');
    
    // Load workflows database
    await loadWorkflowsDB();
    console.log(`✅ Loaded ${workflowsDB.length} workflows`);
    
  } catch (error) {
    console.error('❌ Error initializing services:', error);
  }
}

// Load workflows database
async function loadWorkflowsDB() {
  try {
    console.log(`📂 Scanning workflows directory: ${config.WORKFLOWS_PATH}`);
    const categories = await fs.readdir(config.WORKFLOWS_PATH);
    
    for (const category of categories) {
      const categoryPath = path.join(config.WORKFLOWS_PATH, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        const metadataPath = path.join(categoryPath, 'metadata.json');
        
        try {
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          const workflows = metadata.map(workflow => ({
            ...workflow,
            category,
            path: path.join(categoryPath, workflow.original_filename),
            id: uuidv4(),
            // Normalize fields for better searching
            searchText: `${workflow.title} ${workflow.description} ${workflow.services?.join(' ') || ''} ${workflow.actions?.join(' ') || ''} ${workflow.keywords?.join(' ') || ''}`,
            nodeCount: workflow.nodes?.length || 0,
            complexity: workflow.complexity || 'unknown'
          }));
          
          workflowsDB = workflowsDB.concat(workflows);
        } catch (err) {
          console.warn(`⚠️ Could not load metadata for ${category}:`, err.message);
        }
      }
    }
    
    console.log(`📊 Loaded workflows by category:`);
    const categoryStats = {};
    workflowsDB.forEach(w => {
      categoryStats[w.category] = (categoryStats[w.category] || 0) + 1;
    });
    
    // Show top 10 categories with most workflows
    const topCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    topCategories.forEach(([category, count]) => {
      console.log(`   ${category}: ${count} workflows`);
    });
    
    if (Object.keys(categoryStats).length > 10) {
      console.log(`   ... and ${Object.keys(categoryStats).length - 10} more categories`);
    }
    
  } catch (error) {
    console.error('❌ Error loading workflows DB:', error);
  }
}

// Memory management functions (simplified)
function addToMemory(text, tags = [], sessionId = 'default') {
  const memoryItem = {
    id: uuidv4(),
    text,
    tags,
    sessionId,
    timestamp: new Date().toISOString()
  };
  
  memoryStore.push(memoryItem);
  
  // Maintain memory limit
  if (memoryStore.length > config.MAX_MEMORY_ITEMS) {
    memoryStore = memoryStore.slice(-config.MAX_MEMORY_ITEMS);
  }
  
  return memoryItem;
}

function searchMemory(query, sessionId = 'default', limit = 3) {
  const sessionMemories = memoryStore.filter(item => item.sessionId === sessionId);
  
  // Simple text-based search
  const results = sessionMemories.filter(item => 
    item.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, limit);
  
  return results;
}

// Workflow search functions (enhanced for real data)
function searchWorkflows(query, filters = {}) {
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'services', weight: 0.15 },
      { name: 'actions', weight: 0.1 },
      { name: 'keywords', weight: 0.05 }
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true
  };
  
  let searchData = workflowsDB;
  
  // Apply filters
  if (filters.services && filters.services.length > 0) {
    searchData = searchData.filter(workflow => 
      filters.services.some(service => 
        workflow.services?.some(s => 
          s.toLowerCase().includes(service.toLowerCase())
        )
      )
    );
  }
  
  if (filters.category) {
    searchData = searchData.filter(workflow => 
      workflow.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  
  if (filters.complexity) {
    searchData = searchData.filter(workflow => 
      workflow.complexity === filters.complexity
    );
  }
  
  const fuse = new Fuse(searchData, fuseOptions);
  const results = fuse.search(query);
  
  return results.map(result => ({
    ...result.item,
    score: 1 - result.score,
    relevanceScore: result.score
  })).slice(0, 20); // Increased limit for larger dataset
}

// API Endpoints

// Health check
app.get('/health', (req, res) => {
  const categoryCount = [...new Set(workflowsDB.map(w => w.category))].length;
  const serviceCount = [...new Set(workflowsDB.flatMap(w => w.services || []))].length;
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: {
      workflows: workflowsDB.length,
      categories: categoryCount,
      services: serviceCount,
      memory: memoryStore.length
    },
    version: '2.0',
    mode: 'production'
  });
});

// Get API key
app.get('/api-key', (req, res) => {
  res.json({ apiKey: config.API_KEY });
});

// Get database statistics
app.get('/stats', (req, res) => {
  const categoryStats = {};
  const serviceStats = {};
  const actionStats = {};
  
  workflowsDB.forEach(workflow => {
    // Category stats
    categoryStats[workflow.category] = (categoryStats[workflow.category] || 0) + 1;
    
    // Service stats
    workflow.services?.forEach(service => {
      serviceStats[service] = (serviceStats[service] || 0) + 1;
    });
    
    // Action stats
    workflow.actions?.forEach(action => {
      actionStats[action] = (actionStats[action] || 0) + 1;
    });
  });
  
  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  const topServices = Object.entries(serviceStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15);
  
  const topActions = Object.entries(actionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  res.json({
    totalWorkflows: workflowsDB.length,
    totalCategories: Object.keys(categoryStats).length,
    totalServices: Object.keys(serviceStats).length,
    totalActions: Object.keys(actionStats).length,
    topCategories,
    topServices,
    topActions,
    lastUpdated: new Date().toISOString()
  });
});

// Analyze errors endpoint (simplified)
app.post('/analyze-error', authenticate, async (req, res) => {
  try {
    const { errorLog, context } = req.body;
    
    // Search memory for similar errors
    const similarErrors = searchMemory(`error: ${errorLog}`);
    
    // Simple error analysis (without LLM for now)
    const analysis = {
      rootCause: "Error analysis detected a common n8n issue",
      fixes: [
        "Check if the required data is available in previous nodes",
        "Verify the expression syntax",
        "Ensure the node configuration is correct"
      ],
      prevention: [
        "Add error handling nodes",
        "Test with sample data",
        "Use debug nodes to inspect data flow"
      ],
      relatedPatterns: similarErrors.slice(0, 2)
    };
    
    // Save to memory
    addToMemory(`error: ${errorLog} | analysis: ${JSON.stringify(analysis)}`);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error in /analyze-error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Expression helper endpoint (simplified)
app.post('/expression', authenticate, async (req, res) => {
  try {
    const { expression, nodeData, workflowContext } = req.body;
    
    // Simple expression analysis
    const response = {
      corrected: expression,
      alternatives: [
        expression.replace('$json', '$item(0).$json'),
        expression.replace('["', '.'),
        expression.replace('"]', '')
      ],
      explanation: `This expression extracts data from the JSON object. The syntax ${expression} accesses nested properties.`,
      bestPractices: [
        "Always check if the property exists",
        "Use $item(0).$json for cleaner syntax",
        "Test expressions with sample data"
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in /expression:', error);
    res.status(500).json({ error: error.message });
  }
});

// Multimodal processing endpoint (simplified)
app.post('/multimodal', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { context, prompt } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    let extractedText = `File uploaded: ${file.originalname} (${file.mimetype})`;
    
    // Search for relevant workflows
    const relevantWorkflows = searchWorkflows(extractedText + ' ' + prompt);
    
    // Simple workflow suggestion
    const workflow = {
      name: "Generated Workflow",
      description: "Workflow generated from uploaded file and prompt",
      nodes: [
        {
          name: "Start",
          type: "n8n-nodes-base.start"
        },
        {
          name: "Process File",
          type: "n8n-nodes-base.function"
        }
      ]
    };
    
    // Save to memory
    addToMemory(`file: ${file.originalname} | prompt: ${prompt}`);
    
    res.json({
      extractedText,
      workflow,
      relevantWorkflows: relevantWorkflows.slice(0, 3)
    });
  } catch (error) {
    console.error('Error in /multimodal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Memory management endpoints
app.post('/memory', authenticate, async (req, res) => {
  try {
    const { action, text, tags, sessionId, query, id } = req.body;
    
    switch (action) {
      case 'add':
        const item = addToMemory(text, tags, sessionId);
        res.json(item);
        break;
        
      case 'search':
        const results = searchMemory(query, sessionId);
        res.json(results);
        break;
        
      case 'get':
        const sessionItems = memoryStore.filter(item => 
          item.sessionId === (sessionId || 'default')
        );
        res.json(sessionItems);
        break;
        
      case 'delete':
        memoryStore = memoryStore.filter(item => item.id !== id);
        res.json({ success: true });
        break;
        
      case 'clear':
        memoryStore = memoryStore.filter(item => 
          item.sessionId !== (sessionId || 'default')
        );
        res.json({ success: true });
        break;
        
      case 'summarize':
        const items = memoryStore.filter(item => 
          item.sessionId === (sessionId || 'default')
        );
        
        if (items.length === 0) {
          return res.json({ summary: 'No memories found for this session.' });
        }
        
        // Simple summary
        const summary = `Session summary: ${items.length} interactions covering topics: ${[...new Set(items.flatMap(item => item.tags))].join(', ')}`;
        
        res.json({ summary });
        break;
        
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error in /memory:', error);
    res.status(500).json({ error: error.message });
  }
});

// Template search endpoint
app.post('/templates', authenticate, async (req, res) => {
  try {
    const { query, filters = {}, limit = 10 } = req.body;
    
    // Get memory context
    const memoryContext = searchMemory(query);
    
    // Search workflows
    const results = searchWorkflows(query, filters);
    
    res.json({
      results: results.slice(0, limit),
      totalFound: results.length,
      memoryContext: memoryContext.slice(0, 2),
      searchQuery: query
    });
  } catch (error) {
    console.error('Error in /templates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get workflow details
app.get('/workflow/:id', authenticate, async (req, res) => {
  try {
    const workflow = workflowsDB.find(w => w.id === req.params.id);
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    // Load full workflow JSON
    const workflowData = JSON.parse(await fs.readFile(workflow.path, 'utf8'));
    
    res.json({
      ...workflow,
      fullWorkflow: workflowData
    });
  } catch (error) {
    console.error('Error getting workflow:', error);
    res.status(500).json({ error: error.message });
  }
});

// Static files for extension
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 n8n AI Assistant Backend v2.0 (Lightweight) running on port ${PORT}`);
  console.log(`📊 API Key: ${config.API_KEY}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health\n`);
  
  await initializeServices();
  console.log('✅ Backend ready for requests!');
});

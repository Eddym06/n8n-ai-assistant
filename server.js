import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import pdf from 'pdf-parse';
import Fuse from 'fuse.js';
import { ChromaClient } from 'chromadb';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { pipeline } from '@xenova/transformers';
import { Client } from 'langsmith';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
let embedder;
let chromaClient;
let langsmithClient;
let workflowsDB = [];
let memoryStore = [];

// Configuration
const config = {
  API_KEY: process.env.API_KEY || 'n8n-ai-' + Math.random().toString(36).substr(2, 9),
  MAX_MEMORY_ITEMS: 500,
  LANGSMITH_PROJECT: 'n8n-ai-assistant',
  WORKFLOWS_PATH: path.join(__dirname, 'src', 'assets', 'workflows'),
  EMBEDDINGS_MODEL: 'Xenova/all-MiniLM-L6-v2'
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
    console.log('🚀 Initializing AI services...');
    
    // Initialize embedder
    embedder = await pipeline('feature-extraction', config.EMBEDDINGS_MODEL);
    console.log('✅ Embedder initialized');
    
    // Initialize Chroma client
    chromaClient = new ChromaClient();
    console.log('✅ Chroma client initialized');
    
    // Initialize LangSmith if API key is provided
    if (process.env.LANGCHAIN_API_KEY) {
      langsmithClient = new Client({
        apiUrl: 'https://api.smith.langchain.com',
        apiKey: process.env.LANGCHAIN_API_KEY
      });
      console.log('✅ LangSmith initialized');
    }
    
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
            embedding: null // Will be generated on demand
          }));
          
          workflowsDB = workflowsDB.concat(workflows);
        } catch (err) {
          console.warn(`⚠️ Could not load metadata for ${category}:`, err.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error loading workflows DB:', error);
  }
}

// Generate embeddings
async function generateEmbedding(text) {
  try {
    const embeddings = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(embeddings.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

// Cosine similarity calculation
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Memory management functions
async function addToMemory(text, tags = [], sessionId = 'default') {
  const embedding = await generateEmbedding(text);
  if (!embedding) return null;
  
  const memoryItem = {
    id: uuidv4(),
    text,
    embedding,
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

async function searchMemory(query, sessionId = 'default', limit = 3) {
  const queryEmbedding = await generateEmbedding(query);
  if (!queryEmbedding) return [];
  
  const sessionMemories = memoryStore.filter(item => item.sessionId === sessionId);
  
  const similarities = sessionMemories.map(item => ({
    ...item,
    similarity: cosineSimilarity(queryEmbedding, item.embedding)
  }));
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// Workflow search functions
async function searchWorkflows(query, filters = {}) {
  // Extract entities from query using LLM
  const entities = await extractEntities(query);
  
  // Fuzzy search
  const fuseOptions = {
    keys: ['title', 'description', 'services', 'actions'],
    threshold: 0.4,
    includeScore: true
  };
  
  const fuse = new Fuse(workflowsDB, fuseOptions);
  const fuzzyResults = fuse.search(query);
  
  // Semantic search
  const queryEmbedding = await generateEmbedding(query);
  let semanticResults = [];
  
  if (queryEmbedding) {
    for (const workflow of workflowsDB) {
      if (!workflow.embedding) {
        const searchText = `${workflow.title} ${workflow.description} ${workflow.services.join(' ')} ${workflow.actions.join(' ')}`;
        workflow.embedding = await generateEmbedding(searchText);
      }
      
      if (workflow.embedding) {
        const similarity = cosineSimilarity(queryEmbedding, workflow.embedding);
        semanticResults.push({ ...workflow, similarity });
      }
    }
    
    semanticResults.sort((a, b) => b.similarity - a.similarity);
  }
  
  // Combine and rank results
  const combinedResults = new Map();
  
  // Add fuzzy results
  fuzzyResults.forEach((result, index) => {
    const id = result.item.id;
    combinedResults.set(id, {
      ...result.item,
      fuzzyScore: 1 - result.score,
      fuzzyRank: index + 1,
      semanticScore: 0,
      semanticRank: Infinity
    });
  });
  
  // Add semantic results
  semanticResults.forEach((result, index) => {
    const id = result.id;
    if (combinedResults.has(id)) {
      const existing = combinedResults.get(id);
      existing.semanticScore = result.similarity;
      existing.semanticRank = index + 1;
    } else if (index < 20) { // Only top semantic results
      combinedResults.set(id, {
        ...result,
        fuzzyScore: 0,
        fuzzyRank: Infinity,
        semanticScore: result.similarity,
        semanticRank: index + 1
      });
    }
  });
  
  // Calculate combined score and apply filters
  const finalResults = Array.from(combinedResults.values())
    .map(result => {
      const combinedScore = (result.fuzzyScore * 0.6) + (result.semanticScore * 0.4);
      return { ...result, combinedScore };
    })
    .filter(result => {
      // Apply service filters
      if (filters.services && filters.services.length > 0) {
        return filters.services.some(service => 
          result.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
        );
      }
      return true;
    })
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, 10);
  
  return finalResults;
}

async function extractEntities(query) {
  try {
    const llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0
    });
    
    const template = `Extract the following entities from the user query:
- services: Array of service names mentioned (e.g., Gmail, Slack, Webhook)
- actions: Array of actions mentioned (e.g., send, create, update, notify)
- conditions: Array of conditions mentioned (e.g., when, if, after)
- keywords: Array of relevant keywords

Query: {query}

Return only a JSON object with the extracted entities.`;
    
    const prompt = PromptTemplate.fromTemplate(template);
    const chain = new LLMChain({ llm, prompt });
    
    const response = await chain.call({ query });
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error extracting entities:', error);
    return { services: [], actions: [], conditions: [], keywords: [] };
  }
}

// API Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      embedder: !!embedder,
      chroma: !!chromaClient,
      langsmith: !!langsmithClient,
      workflows: workflowsDB.length
    }
  });
});

// Get API key
app.get('/api-key', (req, res) => {
  res.json({ apiKey: config.API_KEY });
});

// Analyze errors endpoint
app.post('/analyze-error', authenticate, async (req, res) => {
  try {
    const { errorLog, context } = req.body;
    
    // Search memory for similar errors
    const similarErrors = await searchMemory(`error: ${errorLog}`);
    
    const llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.3
    });
    
    const template = `Analyze this n8n workflow error and suggest fixes:

Error Log: {errorLog}
Context: {context}
Similar Past Errors: {similarErrors}

Provide:
1. Root cause analysis
2. Specific fix suggestions
3. Prevention tips
4. Related workflow patterns that might help

Format as JSON with fields: rootCause, fixes, prevention, relatedPatterns.`;
    
    const prompt = PromptTemplate.fromTemplate(template);
    const chain = new LLMChain({ llm, prompt });
    
    const response = await chain.call({
      errorLog,
      context: JSON.stringify(context),
      similarErrors: JSON.stringify(similarErrors.map(e => e.text))
    });
    
    // Save to memory
    await addToMemory(`error: ${errorLog} | solution: ${response.text}`);
    
    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Error in /analyze-error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Expression helper endpoint
app.post('/expression', authenticate, async (req, res) => {
  try {
    const { expression, nodeData, workflowContext } = req.body;
    
    const llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.1
    });
    
    const template = `Help with this n8n expression:

Expression: {expression}
Node Type: {nodeType}
Available Data: {availableData}
Context: {context}

Provide:
1. Corrected expression if there are syntax errors
2. Alternative expressions that achieve the same goal
3. Explanation of what the expression does
4. Best practices for this type of expression

Format as JSON with fields: corrected, alternatives, explanation, bestPractices.`;
    
    const prompt = PromptTemplate.fromTemplate(template);
    const chain = new LLMChain({ llm, prompt });
    
    const response = await chain.call({
      expression,
      nodeType: nodeData?.type || 'unknown',
      availableData: JSON.stringify(nodeData?.inputData || {}),
      context: JSON.stringify(workflowContext || {})
    });
    
    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Error in /expression:', error);
    res.status(500).json({ error: error.message });
  }
});

// Multimodal processing endpoint
app.post('/multimodal', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { context, prompt } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    let extractedText = '';
    
    // Process PDF
    if (file.mimetype === 'application/pdf') {
      // const pdfData = await pdf(file.buffer);
      // extractedText = pdfData.text;
      extractedText = `PDF uploaded: ${file.originalname}. PDF processing temporarily disabled.`;
    }
    // Process images (placeholder - would need vision model)
    else if (file.mimetype.startsWith('image/')) {
      extractedText = `Image uploaded: ${file.originalname}. Please implement vision model integration.`;
    }
    
    // Search for relevant workflows
    const relevantWorkflows = await searchWorkflows(extractedText + ' ' + prompt);
    
    const llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.3
    });
    
    const template = `Based on the extracted content and context, create an n8n workflow:

Extracted Content: {extractedText}
User Prompt: {prompt}
Context: {context}
Relevant Workflows: {relevantWorkflows}

Generate a complete n8n workflow JSON that addresses the user's needs.
Include proper node connections, configurations, and error handling.`;
    
    const promptTemplate = PromptTemplate.fromTemplate(template);
    const chain = new LLMChain({ llm, prompt: promptTemplate });
    
    const response = await chain.call({
      extractedText,
      prompt,
      context: JSON.stringify(context),
      relevantWorkflows: JSON.stringify(relevantWorkflows.slice(0, 3))
    });
    
    // Save to memory
    await addToMemory(`file: ${file.originalname} | content: ${extractedText.slice(0, 500)}`);
    
    res.json({
      extractedText: extractedText.slice(0, 1000), // Truncate for response
      workflow: response.text,
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
        const item = await addToMemory(text, tags, sessionId);
        res.json(item);
        break;
        
      case 'search':
        const results = await searchMemory(query, sessionId);
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
        
        const llm = new ChatOpenAI({ temperature: 0.3 });
        const template = `Summarize these conversation memories in 3-5 key points:

Memories: {memories}

Provide a concise summary of the main topics and decisions.`;
        
        const prompt = PromptTemplate.fromTemplate(template);
        const chain = new LLMChain({ llm, prompt });
        
        const summary = await chain.call({
          memories: JSON.stringify(items.map(item => item.text))
        });
        
        res.json({ summary: summary.text });
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
    const memoryContext = await searchMemory(query);
    
    // Search workflows
    const results = await searchWorkflows(query, filters);
    
    // Enhanced results with context
    const enhancedResults = results.slice(0, limit).map(workflow => ({
      ...workflow,
      contextRelevance: memoryContext.length > 0 ? 
        Math.max(...memoryContext.map(ctx => 
          cosineSimilarity(workflow.embedding || [], ctx.embedding || [])
        )) : 0
    }));
    
    res.json({
      results: enhancedResults,
      totalFound: results.length,
      memoryContext: memoryContext.slice(0, 2), // Top 2 relevant memories
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
  console.log(`\n🚀 n8n AI Assistant Backend v2.0 running on port ${PORT}`);
  console.log(`📊 API Key: ${config.API_KEY}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health\n`);
  
  await initializeServices();
  console.log('✅ Backend ready for requests!');
});

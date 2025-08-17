// n8n AI Assistant - Phase 3: Advanced Intelligence & Collaboration
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fuse from 'fuse.js';
import ip from 'ip';
import dotenv from 'dotenv';
import Ajv from 'ajv';

// LangChain & Multi-Agent System
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { Tool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StateGraph, END, START } from '@langgraph/core';
import { pipeline } from '@xenova/transformers';

// Git & Collaboration
import { Octokit } from '@octokit/rest';
import simpleGit from 'simple-git';

// Tracing & Analytics
import { Client as LangSmithClient } from 'langsmith';
import { traceable } from 'langsmith/traceable';

// Configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express and Socket.IO
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Global Configuration
const config = {
  API_KEY: process.env.API_KEY || 'n8n-ai-' + Math.random().toString(36).substr(2, 9),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  MAX_MEMORY_ITEMS: 500,
  LANGSMITH_PROJECT: 'n8n-ai-phase3',
  WORKFLOWS_PATH: path.join(__dirname, 'src', 'assets', 'Workflow description'),
  EMBEDDINGS_MODEL: 'Xenova/all-MiniLM-L6-v2',
  DEFAULT_LLM: process.env.DEFAULT_LLM || 'openai',
  COLLAB_MODE: process.env.NODE_ENV === 'collaboration' || process.argv.includes('--collab')
};

// Global state
let embedder;
let workflowsDB = [];
let memoryStore = [];
let collaborationRooms = new Map();
let activeAgents = new Map();
let llmInstances = {};
let git;
let octokit;
let langsmithClient;
let ajv;

// JSON Schema Validator
const initializeAjv = () => {
  ajv = new Ajv({ allErrors: true });
  
  // Workflow simulation schema
  ajv.addSchema({
    type: "object",
    properties: {
      workflow: { type: "object" },
      predictions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            node: { type: "string" },
            bottleneck_risk: { type: "number", minimum: 0, maximum: 1 },
            optimization: { type: "string" },
            parallel_candidates: { type: "array", items: { type: "string" } }
          }
        }
      },
      performance_metrics: {
        type: "object",
        properties: {
          estimated_runtime: { type: "number" },
          memory_usage: { type: "number" },
          parallel_efficiency: { type: "number" }
        }
      }
    },
    required: ["workflow", "predictions"]
  }, "simulation-result");
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('dist'));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// API Key Authentication Middleware
const requireAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKey || apiKey !== config.API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};

// Initialize LLM instances
const initializeLLMs = () => {
  try {
    if (config.OPENAI_API_KEY) {
      llmInstances.openai = new ChatOpenAI({
        openAIApiKey: config.OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        temperature: 0.1
      });
    }
    
    if (config.ANTHROPIC_API_KEY) {
      llmInstances.anthropic = new ChatAnthropic({
        anthropicApiKey: config.ANTHROPIC_API_KEY,
        modelName: 'claude-3-haiku-20240307',
        temperature: 0.1
      });
    }
    
    if (config.GROQ_API_KEY) {
      llmInstances.groq = new ChatGroq({
        apiKey: config.GROQ_API_KEY,
        modelName: 'llama-3.1-8b-instant',
        temperature: 0.1
      });
    }
    
    if (config.GOOGLE_API_KEY) {
      llmInstances.google = new ChatGoogleGenerativeAI({
        apiKey: config.GOOGLE_API_KEY,
        modelName: 'gemini-1.5-flash',
        temperature: 0.1
      });
    }
    
    console.log(`✅ Initialized LLMs: ${Object.keys(llmInstances).join(', ')}`);
  } catch (error) {
    console.warn('⚠️ Some LLMs failed to initialize:', error.message);
  }
};

// Get active LLM
const getLLM = (provider = null) => {
  const targetProvider = provider || config.DEFAULT_LLM;
  return llmInstances[targetProvider] || llmInstances[Object.keys(llmInstances)[0]];
};

// Multi-Agent System Tools
class AnalyzeN8nLogTool extends Tool {
  name = "analyze_n8n_log";
  description = "Analyzes n8n workflow execution logs for errors and performance issues";
  
  async _call(input) {
    const { log, workflow_context } = JSON.parse(input);
    
    const llm = getLLM();
    if (!llm) return "No LLM available for log analysis";
    
    const prompt = PromptTemplate.fromTemplate(`
    Analyze this n8n workflow execution log for errors, warnings, and performance bottlenecks:
    
    LOG: {log}
    WORKFLOW CONTEXT: {workflow_context}
    
    Provide analysis in JSON format:
    {{
      "errors": [{{ "node": "node_name", "error": "description", "severity": "high|medium|low" }}],
      "warnings": [{{ "node": "node_name", "warning": "description" }}],
      "performance": [{{ "node": "node_name", "issue": "description", "optimization": "suggestion" }}],
      "summary": "Overall assessment"
    }}
    `);
    
    const chain = prompt.pipe(llm);
    const result = await chain.invoke({ log, workflow_context });
    
    try {
      return JSON.parse(result.content);
    } catch {
      return { summary: result.content };
    }
  }
}

class SimulateWorkflowTool extends Tool {
  name = "simulate_workflow";
  description = "Simulates n8n workflow execution and predicts performance";
  
  async _call(input) {
    const { workflow, context } = JSON.parse(input);
    
    const llm = getLLM();
    if (!llm) return "No LLM available for simulation";
    
    const prompt = PromptTemplate.fromTemplate(`
    Simulate this n8n workflow and predict performance bottlenecks:
    
    WORKFLOW: {workflow}
    CONTEXT: {context}
    
    Analyze each node's potential execution time, memory usage, and identify:
    1. Bottleneck risks (0-1 score)
    2. Parallel execution opportunities
    3. Optimization suggestions
    
    Response as JSON:
    {{
      "predictions": [{{
        "node": "node_name",
        "bottleneck_risk": 0.8,
        "optimization": "suggestion",
        "parallel_candidates": ["node1", "node2"]
      }}],
      "performance_metrics": {{
        "estimated_runtime": 45.2,
        "memory_usage": 128,
        "parallel_efficiency": 0.75
      }}
    }}
    `);
    
    const chain = prompt.pipe(llm);
    const result = await chain.invoke({ workflow: JSON.stringify(workflow), context });
    
    try {
      const parsed = JSON.parse(result.content);
      
      // Validate with AJV
      if (ajv.validate('simulation-result', { workflow, ...parsed })) {
        return parsed;
      } else {
        console.warn('Simulation result validation failed:', ajv.errors);
        return parsed;
      }
    } catch {
      return { summary: result.content };
    }
  }
}

class NodeCodeGeneratorTool extends Tool {
  name = "generate_custom_node";
  description = "Generates custom JavaScript code for n8n nodes";
  
  async _call(input) {
    const { description, inputs, outputs, logic } = JSON.parse(input);
    
    const llm = getLLM();
    if (!llm) return "No LLM available for code generation";
    
    const prompt = PromptTemplate.fromTemplate(`
    Generate a custom n8n node with the following specifications:
    
    DESCRIPTION: {description}
    INPUTS: {inputs}
    OUTPUTS: {outputs}
    LOGIC: {logic}
    
    Generate complete n8n node code with:
    1. Proper n8n node structure
    2. Input/output definitions
    3. Execute method implementation
    4. Error handling
    5. TypeScript types
    
    Format as JSON:
    {{
      "node_code": "complete node implementation",
      "node_definition": {{ "name": "", "displayName": "", "description": "" }},
      "usage_example": "how to use the node"
    }}
    `);
    
    const chain = prompt.pipe(llm);
    const result = await chain.invoke({ description, inputs, outputs, logic });
    
    try {
      return JSON.parse(result.content);
    } catch {
      return { node_code: result.content };
    }
  }
}

// Multi-Agent System Definition
class MultiAgentSystem {
  constructor() {
    this.tools = [
      new AnalyzeN8nLogTool(),
      new SimulateWorkflowTool(),
      new NodeCodeGeneratorTool()
    ];
    
    this.agents = {
      error: this.createErrorAgent(),
      optimization: this.createOptimizationAgent(),
      custom_node: this.createCustomNodeAgent(),
      router: this.createRouterAgent()
    };
  }
  
  createErrorAgent() {
    return {
      name: "Error Analysis Agent",
      description: "Analyzes n8n errors and provides solutions",
      tools: ["analyze_n8n_log"],
      prompt: `You are an expert n8n error analysis agent. You specialize in:
      - Analyzing workflow execution logs
      - Identifying error patterns
      - Providing specific solutions
      - Learning from past errors via memory search
      
      Always provide actionable solutions and reference similar cases from memory when available.`
    };
  }
  
  createOptimizationAgent() {
    return {
      name: "Workflow Optimization Agent",
      description: "Optimizes n8n workflows for performance",
      tools: ["simulate_workflow"],
      prompt: `You are an expert n8n optimization agent. You specialize in:
      - Performance bottleneck detection
      - Parallel execution strategies
      - Resource usage optimization
      - Workflow efficiency improvements
      
      Always suggest specific node configurations and parallel execution patterns.`
    };
  }
  
  createCustomNodeAgent() {
    return {
      name: "Custom Node Generation Agent",
      description: "Generates custom n8n nodes and code",
      tools: ["generate_custom_node"],
      prompt: `You are an expert n8n custom node developer. You specialize in:
      - Custom node architecture
      - JavaScript/TypeScript for n8n
      - API integrations
      - Complex data transformations
      
      Always generate production-ready, well-documented code.`
    };
  }
  
  createRouterAgent() {
    return {
      name: "Router Agent",
      description: "Routes requests to appropriate specialized agents",
      tools: [],
      prompt: `You are a router agent that decides which specialized agents to activate based on user requests:
      
      - ERROR AGENT: For error analysis, debugging, log analysis
      - OPTIMIZATION AGENT: For performance, bottlenecks, parallel execution
      - CUSTOM NODE AGENT: For code generation, custom nodes, integrations
      
      Analyze the user request and respond with JSON:
      {
        "selected_agents": ["agent1", "agent2"],
        "reasoning": "why these agents were selected",
        "execution_plan": "step by step plan"
      }`
    };
  }
  
  async processRequest(request, context = {}) {
    const llm = getLLM();
    if (!llm) {
      return { error: "No LLM available for multi-agent processing" };
    }
    
    try {
      // Step 1: Router decides which agents to use
      const routerPrompt = this.agents.router.prompt + "\n\nUSER REQUEST: " + request;
      const routerResponse = await llm.invoke([new SystemMessage(routerPrompt)]);
      
      let routing;
      try {
        routing = JSON.parse(routerResponse.content);
      } catch {
        // Fallback routing based on keywords
        routing = this.fallbackRouting(request);
      }
      
      // Step 2: Execute selected agents
      const results = {};
      for (const agentName of routing.selected_agents || []) {
        if (this.agents[agentName]) {
          results[agentName] = await this.executeAgent(agentName, request, context);
        }
      }
      
      return {
        routing: routing,
        results: results,
        summary: this.synthesizeResults(results)
      };
      
    } catch (error) {
      console.error('Multi-agent processing error:', error);
      return { error: error.message };
    }
  }
  
  fallbackRouting(request) {
    const lower = request.toLowerCase();
    const selected_agents = [];
    
    if (lower.includes('error') || lower.includes('debug') || lower.includes('fail')) {
      selected_agents.push('error');
    }
    if (lower.includes('optimize') || lower.includes('performance') || lower.includes('slow')) {
      selected_agents.push('optimization');
    }
    if (lower.includes('custom') || lower.includes('node') || lower.includes('code')) {
      selected_agents.push('custom_node');
    }
    
    return {
      selected_agents: selected_agents.length > 0 ? selected_agents : ['optimization'],
      reasoning: "Fallback routing based on keywords",
      execution_plan: "Execute selected agents based on request content"
    };
  }
  
  async executeAgent(agentName, request, context) {
    const agent = this.agents[agentName];
    const llm = getLLM();
    
    const agentPrompt = agent.prompt + "\n\nUSER REQUEST: " + request + 
                      "\n\nCONTEXT: " + JSON.stringify(context, null, 2);
    
    try {
      const response = await llm.invoke([new SystemMessage(agentPrompt)]);
      return {
        agent: agentName,
        response: response.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        agent: agentName,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  synthesizeResults(results) {
    const summaries = Object.values(results).map(r => r.response || r.error).filter(Boolean);
    return summaries.join('\n\n---\n\n');
  }
}

// Initialize Multi-Agent System
let multiAgentSystem;

// Memory System (enhanced from Phase 2)
const searchMemory = async (query, limit = 5) => {
  if (!embedder || memoryStore.length === 0) return [];
  
  try {
    const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true });
    
    const similarities = memoryStore.map(memory => {
      if (!memory.embedding) return { memory, similarity: 0 };
      
      const similarity = cosineSimilarity(queryEmbedding.data, memory.embedding);
      return { memory, similarity };
    });
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.memory);
  } catch (error) {
    console.error('Memory search error:', error);
    return memoryStore.slice(-limit);
  }
};

const addToMemory = async (content, tags = [], type = 'general') => {
  try {
    let embedding;
    if (embedder) {
      const result = await embedder(content, { pooling: 'mean', normalize: true });
      embedding = Array.from(result.data);
    }
    
    const memory = {
      id: uuidv4(),
      content,
      tags: Array.isArray(tags) ? tags : [tags],
      type,
      embedding,
      timestamp: new Date().toISOString(),
      access_count: 0
    };
    
    memoryStore.unshift(memory);
    
    if (memoryStore.length > config.MAX_MEMORY_ITEMS) {
      memoryStore = memoryStore.slice(0, config.MAX_MEMORY_ITEMS);
    }
    
    return memory;
  } catch (error) {
    console.error('Add to memory error:', error);
    return null;
  }
};

// Utility Functions
const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Load Workflows Database
const loadWorkflowsDB = async () => {
  console.log('📂 Scanning workflows directory:', config.WORKFLOWS_PATH);
  
  try {
    const categories = await fs.readdir(config.WORKFLOWS_PATH);
    let totalWorkflows = 0;
    const categoryStats = {};
    
    for (const category of categories) {
      const categoryPath = path.join(config.WORKFLOWS_PATH, category);
      
      try {
        const stat = await fs.stat(categoryPath);
        if (!stat.isDirectory()) continue;
        
        const files = await fs.readdir(categoryPath);
        const workflowFiles = files.filter(file => file.endsWith('.json') && file !== 'metadata.json');
        
        // Load metadata if exists
        let metadata = {};
        try {
          const metadataPath = path.join(categoryPath, 'metadata.json');
          const metadataContent = await fs.readFile(metadataPath, 'utf8');
          metadata = JSON.parse(metadataContent);
        } catch (e) {
          // No metadata file, continue
        }
        
        // Load workflows
        for (const file of workflowFiles) {
          try {
            const filePath = path.join(categoryPath, file);
            const workflowContent = await fs.readFile(filePath, 'utf8');
            const workflow = JSON.parse(workflowContent);
            
            const workflowId = path.basename(file, '.json');
            const workflowMeta = metadata[workflowId] || {};
            
            workflowsDB.push({
              id: workflowId,
              category,
              title: workflowMeta.title || workflowId,
              description: workflowMeta.description || 'No description',
              services: workflowMeta.services || [],
              actions: workflowMeta.actions || [],
              keywords: workflowMeta.keywords || [],
              rating: workflowMeta.rating || 0,
              userAdded: workflowMeta.userAdded || false,
              workflow,
              filePath
            });
            
            totalWorkflows++;
          } catch (e) {
            console.warn(`⚠️ Error loading workflow ${file}:`, e.message);
          }
        }
        
        categoryStats[category] = workflowFiles.length;
        
      } catch (e) {
        console.warn(`⚠️ Error processing category ${category}:`, e.message);
      }
    }
    
    // Sort categories by workflow count
    const sortedCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    console.log('\n📊 Loaded workflows by category:');
    sortedCategories.forEach(([category, count]) => {
      console.log(`   ${category}: ${count} workflows`);
    });
    
    console.log(`\n✅ Loaded ${totalWorkflows} workflows from ${Object.keys(categoryStats).length} categories`);
    
  } catch (error) {
    console.error('❌ Error loading workflows:', error);
  }
};

// Search Workflows (enhanced)
const searchWorkflows = (query, options = {}) => {
  const { 
    category = null, 
    services = [], 
    limit = 20,
    minRating = 0 
  } = options;
  
  let filteredWorkflows = workflowsDB;
  
  // Apply filters
  if (category) {
    filteredWorkflows = filteredWorkflows.filter(w => w.category === category);
  }
  
  if (services.length > 0) {
    filteredWorkflows = filteredWorkflows.filter(w => 
      services.some(service => w.services.includes(service))
    );
  }
  
  if (minRating > 0) {
    filteredWorkflows = filteredWorkflows.filter(w => w.rating >= minRating);
  }
  
  if (!query.trim()) {
    return filteredWorkflows.slice(0, limit);
  }
  
  // Fuzzy search with weighted fields
  const fuse = new Fuse(filteredWorkflows, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'services', weight: 0.15 },
      { name: 'actions', weight: 0.1 },
      { name: 'keywords', weight: 0.05 }
    ],
    threshold: 0.6,
    includeScore: true
  });
  
  const results = fuse.search(query, { limit });
  return results.map(result => ({
    ...result.item,
    score: result.score
  }));
};

// Initialize Services
const initializeServices = async () => {
  console.log('🚀 Initializing Phase 3 services...');
  
  try {
    // Initialize embedder
    embedder = await pipeline('feature-extraction', config.EMBEDDINGS_MODEL);
    console.log('✅ Embedder initialized');
    
    // Initialize LLMs
    initializeLLMs();
    
    // Initialize Multi-Agent System
    multiAgentSystem = new MultiAgentSystem();
    console.log('✅ Multi-Agent System initialized');
    
    // Initialize Git (if GitHub token available)
    if (config.GITHUB_TOKEN) {
      git = simpleGit(__dirname);
      octokit = new Octokit({ auth: config.GITHUB_TOKEN });
      console.log('✅ Git integration initialized');
    }
    
    // Initialize LangSmith (if API key available)
    if (config.LANGSMITH_API_KEY) {
      langsmithClient = new LangSmithClient({
        apiKey: config.LANGSMITH_API_KEY,
        apiUrl: "https://api.smith.langchain.com"
      });
      console.log('✅ LangSmith tracing initialized');
    }
    
    // Initialize JSON Schema Validator
    initializeAjv();
    console.log('✅ JSON Schema Validator initialized');
    
    // Load workflows database
    await loadWorkflowsDB();
    
    console.log('✅ Phase 3 services initialized');
    console.log(`🌐 Server will run on: http://localhost:${PORT}`);
    if (config.COLLAB_MODE) {
      const localIP = ip.address();
      console.log(`🤝 Collaboration mode active: http://${localIP}:${PORT}`);
    }
    
  } catch (error) {
    console.error('❌ Service initialization error:', error);
    process.exit(1);
  }
};

// ======================
// API ENDPOINTS
// ======================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '3.0.0',
    phase: 'Advanced Intelligence & Collaboration',
    timestamp: new Date().toISOString(),
    workflows: workflowsDB.length,
    memory_items: memoryStore.length,
    collaboration_rooms: collaborationRooms.size,
    active_agents: Object.keys(multiAgentSystem?.agents || {}),
    llms_available: Object.keys(llmInstances),
    features: {
      multi_agent: !!multiAgentSystem,
      collaboration: config.COLLAB_MODE,
      git_integration: !!git,
      langsmith_tracing: !!langsmithClient
    }
  });
});

// Get API key
app.get('/api-key', (req, res) => {
  res.json({
    api_key: config.API_KEY,
    instructions: 'Include this key in X-API-Key header or api_key query parameter'
  });
});

// System statistics
app.get('/stats', (req, res) => {
  const categoryStats = {};
  workflowsDB.forEach(workflow => {
    categoryStats[workflow.category] = (categoryStats[workflow.category] || 0) + 1;
  });
  
  const sortedCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  
  const memoryTypes = {};
  memoryStore.forEach(memory => {
    memoryTypes[memory.type] = (memoryTypes[memory.type] || 0) + 1;
  });
  
  res.json({
    workflows: {
      total: workflowsDB.length,
      categories: Object.keys(categoryStats).length,
      by_category: sortedCategories
    },
    memory: {
      total: memoryStore.length,
      by_type: memoryTypes,
      capacity: config.MAX_MEMORY_ITEMS
    },
    collaboration: {
      active_rooms: collaborationRooms.size,
      total_connections: Array.from(collaborationRooms.values()).reduce((sum, room) => sum + room.users.size, 0)
    },
    system: {
      llms_available: Object.keys(llmInstances),
      default_llm: config.DEFAULT_LLM,
      git_enabled: !!git,
      tracing_enabled: !!langsmithClient
    }
  });
});

// Multi-Agent Processing Endpoint
app.post('/multi-agent', requireAPIKey, traceable(async (req, res) => {
  const { prompt, context = {}, llm_provider = null } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  if (!multiAgentSystem) {
    return res.status(503).json({ error: 'Multi-agent system not initialized' });
  }
  
  try {
    // Enhance context with memory and workflow data
    const memoryContext = await searchMemory(prompt, 3);
    const workflowContext = searchWorkflows(prompt, { limit: 5 });
    
    const enhancedContext = {
      ...context,
      memory: memoryContext,
      relevant_workflows: workflowContext,
      timestamp: new Date().toISOString()
    };
    
    // Process with multi-agent system
    const result = await multiAgentSystem.processRequest(prompt, enhancedContext);
    
    // Store interaction in memory
    await addToMemory(
      `Multi-agent request: ${prompt}\nResult: ${JSON.stringify(result.summary)}`,
      ['multi-agent', 'interaction'],
      'agent_interaction'
    );
    
    res.json({
      success: true,
      request: prompt,
      ...result,
      context_used: {
        memory_items: memoryContext.length,
        workflow_matches: workflowContext.length
      }
    });
    
  } catch (error) {
    console.error('Multi-agent processing error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "multi-agent-processing" }));

// Workflow Simulation Endpoint
app.post('/simulate', requireAPIKey, traceable(async (req, res) => {
  const { workflow, options = {} } = req.body;
  
  if (!workflow) {
    return res.status(400).json({ error: 'Workflow is required' });
  }
  
  try {
    const simulationTool = new SimulateWorkflowTool();
    const context = {
      memory: await searchMemory(`simulate workflow ${workflow.name || 'unnamed'}`, 3),
      similar_workflows: searchWorkflows(workflow.name || '', { limit: 3 }),
      options
    };
    
    const result = await simulationTool._call(JSON.stringify({ workflow, context }));
    
    // Store simulation in memory
    await addToMemory(
      `Workflow simulation: ${workflow.name || 'unnamed'}\nResult: ${JSON.stringify(result)}`,
      ['simulation', 'workflow', 'performance'],
      'simulation'
    );
    
    res.json({
      success: true,
      workflow: workflow,
      simulation: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "workflow-simulation" }));

// Git Integration Endpoint
app.post('/git', requireAPIKey, traceable(async (req, res) => {
  const { action, message, branch = 'main' } = req.body;
  
  if (!git) {
    return res.status(503).json({ error: 'Git integration not available' });
  }
  
  try {
    let result;
    
    switch (action) {
      case 'status':
        result = await git.status();
        break;
        
      case 'add':
        await git.add('.');
        result = { message: 'Files added to staging' };
        break;
        
      case 'commit':
        if (!message) {
          return res.status(400).json({ error: 'Commit message required' });
        }
        result = await git.commit(message);
        break;
        
      case 'push':
        result = await git.push('origin', branch);
        break;
        
      case 'pull':
        result = await git.pull('origin', branch);
        break;
        
      case 'generate-changelog':
        // Generate AI-powered changelog
        const logs = await git.log({ maxCount: 10 });
        const llm = getLLM();
        
        if (llm) {
          const prompt = `Generate a changelog based on these git commits:\n${logs.all.map(log => `- ${log.message}`).join('\n')}\n\nFormat as markdown with categories (Features, Bug Fixes, Improvements, etc.)`;
          const changelog = await llm.invoke([new SystemMessage(prompt)]);
          result = { changelog: changelog.content };
        } else {
          result = { logs: logs.all };
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Unknown git action' });
    }
    
    res.json({ success: true, action, result });
    
  } catch (error) {
    console.error('Git operation error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "git-integration" }));

// Enhanced Memory Endpoint
app.post('/memory', requireAPIKey, traceable(async (req, res) => {
  const { action, content, tags = [], query, id, type = 'general' } = req.body;
  
  try {
    let result;
    
    switch (action) {
      case 'add':
        if (!content) {
          return res.status(400).json({ error: 'Content is required' });
        }
        result = await addToMemory(content, tags, type);
        break;
        
      case 'search':
        if (!query) {
          return res.status(400).json({ error: 'Query is required' });
        }
        result = await searchMemory(query, req.body.limit || 10);
        break;
        
      case 'get':
        result = memoryStore.find(memory => memory.id === id);
        if (result) {
          result.access_count++;
        }
        break;
        
      case 'delete':
        const index = memoryStore.findIndex(memory => memory.id === id);
        if (index !== -1) {
          result = memoryStore.splice(index, 1)[0];
        }
        break;
        
      case 'clear':
        const count = memoryStore.length;
        memoryStore.length = 0;
        result = { cleared: count };
        break;
        
      case 'summarize':
        const recentMemories = memoryStore.slice(0, 20);
        const llm = getLLM();
        
        if (llm && recentMemories.length > 0) {
          const prompt = `Summarize these recent memory entries:\n${recentMemories.map(m => m.content).join('\n---\n')}\n\nProvide a concise summary of key themes and insights.`;
          const summary = await llm.invoke([new SystemMessage(prompt)]);
          result = { summary: summary.content, memories_analyzed: recentMemories.length };
        } else {
          result = { message: 'No memories to summarize or LLM unavailable' };
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Unknown memory action' });
    }
    
    res.json({ success: true, action, result });
    
  } catch (error) {
    console.error('Memory operation error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "memory-operations" }));

// Enhanced Template Search
app.post('/templates', requireAPIKey, traceable(async (req, res) => {
  const { query, category, services = [], limit = 20, minRating = 0 } = req.body;
  
  try {
    const results = searchWorkflows(query || '', {
      category,
      services,
      limit,
      minRating
    });
    
    // Enhance with memory context
    if (query) {
      const memoryContext = await searchMemory(query, 3);
      
      res.json({
        success: true,
        query,
        results,
        total: results.length,
        memory_context: memoryContext,
        filters_applied: {
          category: !!category,
          services: services.length > 0,
          minRating: minRating > 0
        }
      });
    } else {
      res.json({
        success: true,
        results,
        total: results.length
      });
    }
    
  } catch (error) {
    console.error('Template search error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "template-search" }));

// Enhanced Error Analysis
app.post('/analyze-error', requireAPIKey, traceable(async (req, res) => {
  const { error, workflow_context = {}, logs = [] } = req.body;
  
  if (!error) {
    return res.status(400).json({ error: 'Error information is required' });
  }
  
  try {
    // Search for similar errors in memory
    const similarErrors = await searchMemory(`error ${error}`, 5);
    
    // Use Error Agent from multi-agent system
    const analysisPrompt = `Analyze this n8n error:
    
    ERROR: ${error}
    WORKFLOW CONTEXT: ${JSON.stringify(workflow_context)}
    LOGS: ${logs.join('\n')}
    
    Similar cases from memory:
    ${similarErrors.map(m => m.content).join('\n---\n')}
    
    Provide:
    1. Root cause analysis
    2. Specific fix suggestions
    3. Prevention strategies
    4. Related n8n documentation links`;
    
    const result = await multiAgentSystem?.processRequest(analysisPrompt, {
      type: 'error_analysis',
      similar_errors: similarErrors,
      workflow_context
    }) || { summary: 'Multi-agent system unavailable' };
    
    // Store analysis in memory
    await addToMemory(
      `Error analysis: ${error}\nSolution: ${result.summary}`,
      ['error', 'analysis', 'solution'],
      'error_analysis'
    );
    
    res.json({
      success: true,
      error,
      analysis: result,
      similar_cases: similarErrors.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error analysis failed:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "error-analysis" }));

// Enhanced Expression Helper
app.post('/expression', requireAPIKey, traceable(async (req, res) => {
  const { expression, context = {}, node_type = 'unknown' } = req.body;
  
  if (!expression) {
    return res.status(400).json({ error: 'Expression is required' });
  }
  
  try {
    // Search for similar expressions in memory
    const similarExpressions = await searchMemory(`expression ${expression}`, 3);
    
    const llm = getLLM();
    if (!llm) {
      return res.status(503).json({ error: 'LLM not available' });
    }
    
    const prompt = `Analyze this n8n expression and provide improvements:
    
    EXPRESSION: ${expression}
    NODE TYPE: ${node_type}
    CONTEXT: ${JSON.stringify(context)}
    
    Similar expressions from memory:
    ${similarExpressions.map(m => m.content).join('\n---\n')}
    
    Provide:
    1. Syntax validation
    2. Alternative implementations
    3. Performance optimization
    4. Best practices
    5. Common pitfalls to avoid
    
    Format as JSON:
    {
      "is_valid": true/false,
      "issues": ["issue1", "issue2"],
      "alternatives": ["alt1", "alt2"],
      "optimized": "optimized_expression",
      "explanation": "detailed explanation"
    }`;
    
    const result = await llm.invoke([new SystemMessage(prompt)]);
    
    let analysis;
    try {
      analysis = JSON.parse(result.content);
    } catch {
      analysis = { explanation: result.content };
    }
    
    // Store expression analysis in memory
    await addToMemory(
      `Expression analysis: ${expression}\nResult: ${JSON.stringify(analysis)}`,
      ['expression', 'n8n', node_type],
      'expression_analysis'
    );
    
    res.json({
      success: true,
      expression,
      analysis,
      similar_cases: similarExpressions.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Expression analysis error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "expression-analysis" }));

// Multimodal Processing (Enhanced)
app.post('/multimodal', requireAPIKey, upload.single('file'), traceable(async (req, res) => {
  const { prompt, analyze_type = 'auto' } = req.body;
  const file = req.file;
  
  if (!file && !prompt) {
    return res.status(400).json({ error: 'File or prompt is required' });
  }
  
  try {
    let result = {};
    
    if (file) {
      result.file_info = {
        name: file.originalname,
        type: file.mimetype,
        size: file.size
      };
      
      // Process different file types
      if (file.mimetype.startsWith('image/')) {
        // Image processing would go here (requires vision model)
        result.analysis = "Image processing requires vision-enabled LLM";
      } else if (file.mimetype === 'application/pdf') {
        // PDF processing is disabled in current setup
        result.analysis = "PDF processing temporarily disabled";
      } else {
        // Text files
        try {
          const content = file.buffer.toString('utf8');
          result.content = content.substring(0, 5000); // Limit content
          
          if (prompt) {
            const llm = getLLM();
            if (llm) {
              const analysisPrompt = `${prompt}\n\nFile content:\n${result.content}`;
              const response = await llm.invoke([new SystemMessage(analysisPrompt)]);
              result.analysis = response.content;
            }
          }
        } catch (e) {
          result.error = "Failed to process file content";
        }
      }
    } else if (prompt) {
      // Text-only prompt
      const llm = getLLM();
      if (llm) {
        const response = await llm.invoke([new SystemMessage(prompt)]);
        result.analysis = response.content;
      }
    }
    
    // Store multimodal interaction in memory
    if (result.analysis) {
      await addToMemory(
        `Multimodal analysis: ${prompt || 'File processing'}\nResult: ${result.analysis}`,
        ['multimodal', analyze_type, file?.mimetype || 'text'],
        'multimodal'
      );
    }
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Multimodal processing error:', error);
    res.status(500).json({ error: error.message });
  }
}, { name: "multimodal-processing" }));

// Get Workflow Details
app.get('/workflow/:id', requireAPIKey, (req, res) => {
  const { id } = req.params;
  const workflow = workflowsDB.find(w => w.id === id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  res.json({
    success: true,
    workflow
  });
});

// ======================
// WEBSOCKET COLLABORATION
// ======================

io.on('connection', (socket) => {
  console.log(`🤝 User connected: ${socket.id}`);
  
  // Join collaboration room
  socket.on('join-room', async (data) => {
    const { roomId, username = 'Anonymous', userColor = '#3B82F6' } = data;
    
    if (!roomId) {
      socket.emit('error', { message: 'Room ID is required' });
      return;
    }
    
    // Create room if doesn't exist
    if (!collaborationRooms.has(roomId)) {
      collaborationRooms.set(roomId, {
        id: roomId,
        users: new Map(),
        workflowState: null,
        changes: [],
        created: new Date().toISOString()
      });
    }
    
    const room = collaborationRooms.get(roomId);
    
    // Add user to room
    room.users.set(socket.id, {
      id: socket.id,
      username,
      userColor,
      joined: new Date().toISOString()
    });
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;
    
    // Notify room about new user
    io.to(roomId).emit('user-joined', {
      user: room.users.get(socket.id),
      users: Array.from(room.users.values()),
      totalUsers: room.users.size
    });
    
    // Send current workflow state to new user
    if (room.workflowState) {
      socket.emit('workflow-state', room.workflowState);
    }
    
    console.log(`👤 ${username} joined room ${roomId}`);
  });
  
  // Handle workflow changes
  socket.on('workflow-change', async (data) => {
    const { change, workflowState, timestamp } = data;
    const roomId = socket.roomId;
    
    if (!roomId || !collaborationRooms.has(roomId)) {
      socket.emit('error', { message: 'Not in a valid room' });
      return;
    }
    
    const room = collaborationRooms.get(roomId);
    
    // Store change
    const changeRecord = {
      id: uuidv4(),
      userId: socket.id,
      username: socket.username,
      change,
      timestamp: timestamp || new Date().toISOString()
    };
    
    room.changes.push(changeRecord);
    room.workflowState = workflowState;
    
    // Broadcast to other users in room
    socket.to(roomId).emit('workflow-changed', {
      change: changeRecord,
      workflowState,
      from: {
        id: socket.id,
        username: socket.username
      }
    });
    
    // Store collaboration event in memory
    await addToMemory(
      `Collaboration change by ${socket.username}: ${JSON.stringify(change)}`,
      ['collaboration', 'workflow-change', roomId],
      'collaboration'
    );
  });
  
  // Handle conflict resolution
  socket.on('resolve-conflict', async (data) => {
    const { conflictId, resolution, mergedState } = data;
    const roomId = socket.roomId;
    
    if (!roomId || !collaborationRooms.has(roomId)) {
      return;
    }
    
    const room = collaborationRooms.get(roomId);
    
    // Use Error Agent for conflict resolution if available
    if (multiAgentSystem) {
      const conflictAnalysis = await multiAgentSystem.processRequest(
        `Resolve workflow collaboration conflict: ${JSON.stringify(resolution)}`,
        { type: 'conflict_resolution', room: roomId }
      );
      
      // Broadcast resolution
      io.to(roomId).emit('conflict-resolved', {
        conflictId,
        resolution,
        mergedState,
        analysis: conflictAnalysis.summary,
        resolvedBy: socket.username
      });
      
      room.workflowState = mergedState;
    }
  });
  
  // Handle chat messages
  socket.on('chat-message', async (data) => {
    const { message, type = 'text' } = data;
    const roomId = socket.roomId;
    
    if (!roomId) return;
    
    const chatMessage = {
      id: uuidv4(),
      userId: socket.id,
      username: socket.username,
      message,
      type,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast chat message
    io.to(roomId).emit('chat-message', chatMessage);
    
    // Store chat in memory
    await addToMemory(
      `Chat message from ${socket.username}: ${message}`,
      ['collaboration', 'chat', roomId],
      'chat'
    );
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const roomId = socket.roomId;
    
    if (roomId && collaborationRooms.has(roomId)) {
      const room = collaborationRooms.get(roomId);
      room.users.delete(socket.id);
      
      // Notify room about user leaving
      io.to(roomId).emit('user-left', {
        userId: socket.id,
        username: socket.username,
        users: Array.from(room.users.values()),
        totalUsers: room.users.size
      });
      
      // Clean up empty rooms
      if (room.users.size === 0) {
        collaborationRooms.delete(roomId);
        console.log(`🗑️  Cleaned up empty room: ${roomId}`);
      }
    }
    
    console.log(`👋 User disconnected: ${socket.id}`);
  });
});

// Collaboration room management endpoints
app.get('/collab/rooms', requireAPIKey, (req, res) => {
  const rooms = Array.from(collaborationRooms.values()).map(room => ({
    id: room.id,
    userCount: room.users.size,
    users: Array.from(room.users.values()),
    created: room.created,
    hasWorkflow: !!room.workflowState
  }));
  
  res.json({ success: true, rooms });
});

app.post('/collab/create-room', requireAPIKey, (req, res) => {
  const { roomId = uuidv4(), name = null } = req.body;
  
  if (collaborationRooms.has(roomId)) {
    return res.status(409).json({ error: 'Room already exists' });
  }
  
  collaborationRooms.set(roomId, {
    id: roomId,
    name,
    users: new Map(),
    workflowState: null,
    changes: [],
    created: new Date().toISOString()
  });
  
  res.json({
    success: true,
    room: {
      id: roomId,
      name,
      created: new Date().toISOString()
    }
  });
});

// ======================
// ERROR HANDLING & STARTUP
// ======================

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'GET /api-key', 
      'GET /stats',
      'POST /multi-agent',
      'POST /simulate',
      'POST /git',
      'POST /memory',
      'POST /templates',
      'POST /analyze-error',
      'POST /expression',
      'POST /multimodal',
      'GET /workflow/:id',
      'GET /collab/rooms',
      'POST /collab/create-room'
    ]
  });
});

// Initialize and start server
const startServer = async () => {
  await initializeServices();
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 n8n AI Assistant Phase 3 (Advanced Intelligence) running on port ${PORT}`);
    console.log(`📊 API Key: ${config.API_KEY}`);
    console.log(`🔧 Health check: http://localhost:${PORT}/health`);
    
    if (config.COLLAB_MODE) {
      const localIP = ip.address();
      console.log(`\n🤝 COLLABORATION MODE ACTIVE`);
      console.log(`🌐 Local access: http://localhost:${PORT}`);
      console.log(`🌐 Network access: http://${localIP}:${PORT}`);
      console.log(`📱 Share this IP for collaboration: ${localIP}:${PORT}`);
    }
    
    console.log(`\n✅ Backend ready for requests!\n`);
  });
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// n8n AI Assistant - Phase 3 Server (Simplified)
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

class Phase3Server {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.PORT || 3000;
    this.apiKey = process.env.API_KEY || 'n8n-ai-phase3-key';
    
    // Storage
    this.workflows = [];
    this.memories = [];
    this.templates = [];
    this.collaborationRooms = new Map();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    
    // API Key validation middleware
    this.app.use('/api', (req, res, next) => {
      const providedKey = req.headers['x-api-key'];
      if (!providedKey || providedKey !== this.apiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        version: '3.0.0',
        phase: 'Phase 3 - Advanced Intelligence',
        timestamp: new Date().toISOString(),
        features: ['multi-agent', 'collaboration', 'simulation', 'git-integration'],
        stats: {
          workflows: this.workflows.length,
          memories: this.memories.length,
          templates: this.templates.length,
          collaborationRooms: this.collaborationRooms.size
        }
      });
    });

    // Multi-Agent System (Simplified)
    this.app.post('/api/multi-agent', async (req, res) => {
      try {
        const { prompt, context, llm_provider = 'openai' } = req.body;
        
        // Simple agent routing logic
        const routing = this.routeToAgents(prompt);
        const results = {};
        
        // Simulate agent processing
        for (const agent of routing.selected_agents) {
          results[agent] = {
            agent,
            response: this.simulateAgentResponse(agent, prompt, context),
            timestamp: new Date().toISOString()
          };
        }

        res.json({
          success: true,
          routing,
          results,
          summary: `Processed request with ${routing.selected_agents.length} agents`
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }
    });

    // Workflow Simulation
    this.app.post('/api/simulate', async (req, res) => {
      try {
        const { workflow, options = {} } = req.body;
        
        const simulation = {
          workflow_name: workflow.name || 'Unnamed Workflow',
          predictions: this.analyzeWorkflowBottlenecks(workflow),
          performance_metrics: this.calculatePerformanceMetrics(workflow),
          optimizations: this.generateOptimizations(workflow),
          timestamp: new Date().toISOString()
        };

        res.json({
          success: true,
          ...simulation
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }
    });

    // Collaboration endpoints
    this.app.post('/api/collab/create-room', (req, res) => {
      const { roomId = uuidv4(), name } = req.body;
      
      if (!this.collaborationRooms.has(roomId)) {
        this.collaborationRooms.set(roomId, {
          id: roomId,
          name: name || `Room ${roomId.slice(0, 8)}`,
          users: new Set(),
          created: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });
      }
      
      const room = this.collaborationRooms.get(roomId);
      res.json({ success: true, room });
    });

    this.app.get('/api/collab/rooms', (req, res) => {
      const rooms = Array.from(this.collaborationRooms.values()).map(room => ({
        ...room,
        users: Array.from(room.users)
      }));
      res.json({ success: true, rooms });
    });

    this.app.get('/api/collab/room-info/:roomId', (req, res) => {
      const { roomId } = req.params;
      const room = this.collaborationRooms.get(roomId);
      
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      
      res.json({ 
        success: true, 
        room: { ...room, users: Array.from(room.users) } 
      });
    });

    // Memory operations
    this.app.post('/api/memory/add', (req, res) => {
      const { content, tags = [], category = 'general' } = req.body;
      
      const memory = {
        id: uuidv4(),
        content,
        tags,
        category,
        timestamp: new Date().toISOString(),
        embedding: this.generateSimpleEmbedding(content)
      };
      
      this.memories.push(memory);
      res.json({ success: true, memory });
    });

    this.app.get('/api/memory/search', (req, res) => {
      const { query, limit = 10 } = req.query;
      
      const fuse = new Fuse(this.memories, {
        keys: ['content', 'tags', 'category'],
        threshold: 0.6
      });
      
      const results = query ? 
        fuse.search(query).slice(0, limit).map(result => result.item) :
        this.memories.slice(0, limit);
      
      res.json({ success: true, results });
    });

    this.app.get('/api/memory/stats', (req, res) => {
      const stats = {
        total: this.memories.length,
        categories: [...new Set(this.memories.map(m => m.category))],
        recent: this.memories.slice(-5)
      };
      res.json({ success: true, stats });
    });

    // Templates
    this.app.get('/api/templates', (req, res) => {
      res.json({ 
        success: true, 
        templates: this.templates,
        total: this.templates.length 
      });
    });

    this.app.get('/api/templates/search', (req, res) => {
      const { query } = req.query;
      const fuse = new Fuse(this.templates, {
        keys: ['name', 'description', 'category'],
        threshold: 0.6
      });
      
      const results = query ? 
        fuse.search(query).map(result => result.item) : 
        this.templates;
      
      res.json({ success: true, results });
    });

    this.app.get('/api/templates/categories', (req, res) => {
      const categories = [...new Set(this.templates.map(t => t.category))];
      res.json({ success: true, categories });
    });

    // Git integration (simplified)
    this.app.post('/api/git', (req, res) => {
      const { action } = req.body;
      
      switch (action) {
        case 'status':
          res.json({ 
            success: true, 
            status: 'No git repository found',
            action: 'status'
          });
          break;
        case 'init':
          res.json({ 
            success: true, 
            message: 'Git repository initialized (simulated)',
            action: 'init'
          });
          break;
        default:
          res.json({ 
            success: true, 
            message: `Git action '${action}' completed (simulated)`,
            action 
          });
      }
    });
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 Client connected: ${socket.id}`);

      socket.on('join-room', (data) => {
        const { roomId, username, userColor = '#3B82F6' } = data;
        
        if (!this.collaborationRooms.has(roomId)) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        
        const room = this.collaborationRooms.get(roomId);
        room.users.add(username);
        room.lastActivity = new Date().toISOString();
        
        socket.join(roomId);
        socket.roomId = roomId;
        socket.username = username;
        
        socket.to(roomId).emit('user-joined', { username, userColor });
        socket.emit('room-joined', { roomId, users: Array.from(room.users) });
        
        console.log(`👤 ${username} joined room ${roomId}`);
      });

      socket.on('workflow-change', (data) => {
        if (socket.roomId) {
          socket.to(socket.roomId).emit('workflow-changed', {
            ...data,
            from: socket.username,
            timestamp: new Date().toISOString()
          });
        }
      });

      socket.on('chat-message', (data) => {
        if (socket.roomId) {
          const message = {
            ...data,
            from: socket.username,
            timestamp: new Date().toISOString(),
            id: uuidv4()
          };
          
          this.io.to(socket.roomId).emit('chat-message', message);
        }
      });

      socket.on('disconnect', () => {
        if (socket.roomId && socket.username) {
          const room = this.collaborationRooms.get(socket.roomId);
          if (room) {
            room.users.delete(socket.username);
            socket.to(socket.roomId).emit('user-left', { 
              username: socket.username 
            });
          }
        }
        console.log(`🔗 Client disconnected: ${socket.id}`);
      });
    });
  }

  // Agent routing logic
  routeToAgents(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const agents = [];
    
    if (lowerPrompt.includes('error') || lowerPrompt.includes('debug') || lowerPrompt.includes('fix')) {
      agents.push('error');
    }
    
    if (lowerPrompt.includes('optimize') || lowerPrompt.includes('performance') || lowerPrompt.includes('speed')) {
      agents.push('optimization');
    }
    
    if (lowerPrompt.includes('custom') || lowerPrompt.includes('node') || lowerPrompt.includes('generate')) {
      agents.push('custom_node');
    }
    
    // Default to optimization if no specific agent detected
    if (agents.length === 0) {
      agents.push('optimization');
    }
    
    return {
      selected_agents: agents,
      reasoning: `Detected keywords for ${agents.join(', ')} agents`,
      execution_plan: `Process request with ${agents.length} specialized agent${agents.length > 1 ? 's' : ''}`
    };
  }

  // Simulate agent responses
  simulateAgentResponse(agent, prompt, context) {
    const responses = {
      error: `Error analysis completed. Identified potential issues in workflow execution. Common problems include API timeouts, missing error handlers, and data validation failures. Recommend adding retry logic and proper error handling.`,
      optimization: `Performance optimization analysis shows potential for 40-60% improvement. Suggest implementing parallel execution, reducing API calls, and optimizing data transformations. Estimated execution time reduction from 45s to 18s.`,
      custom_node: `Custom node generation available. Can create specialized JavaScript nodes for API integrations, data processing, and business logic. Recommend using n8n's node development framework with TypeScript for better maintainability.`
    };
    
    return responses[agent] || `Agent ${agent} processed request successfully.`;
  }

  // Workflow analysis methods
  analyzeWorkflowBottlenecks(workflow) {
    if (!workflow.nodes) return [];
    
    return workflow.nodes.map(node => ({
      node: node.name || node.id,
      bottleneck_risk: Math.random() * 0.8 + 0.1, // Simulate risk score
      optimization: `Consider optimizing ${node.type || 'node'} configuration`,
      parallel_candidates: this.findParallelCandidates(workflow, node.id)
    }));
  }

  calculatePerformanceMetrics(workflow) {
    const nodeCount = workflow.nodes?.length || 1;
    return {
      estimated_runtime: Math.round((nodeCount * 3.5 + Math.random() * 10) * 10) / 10,
      memory_usage: Math.round(nodeCount * 12 + Math.random() * 50),
      parallel_efficiency: Math.round((0.6 + Math.random() * 0.3) * 100) / 100
    };
  }

  generateOptimizations(workflow) {
    return [
      "Implement parallel execution for independent nodes",
      "Add caching for repeated API calls",
      "Optimize data transformations",
      "Use batch processing where possible",
      "Implement proper error handling and retries"
    ];
  }

  findParallelCandidates(workflow, nodeId) {
    // Simplified logic to find parallel execution candidates
    return workflow.nodes?.filter(n => n.id !== nodeId).slice(0, 2).map(n => n.id) || [];
  }

  generateSimpleEmbedding(text) {
    // Simple hash-based embedding for demonstration
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Array.from({ length: 10 }, (_, i) => (hash >> i) & 1);
  }

  async loadSampleData() {
    // Load sample workflows and templates
    try {
      const workflowsDir = path.join(__dirname, 'src', 'assets');
      if (await fs.access(workflowsDir).then(() => true).catch(() => false)) {
        console.log('📂 Loading sample workflows...');
        // Add sample data loading logic here
      }
    } catch (error) {
      console.log('ℹ️  No sample data directory found, starting with empty data');
    }

    // Add sample templates
    this.templates = [
      {
        id: '1',
        name: 'API Error Handler',
        description: 'Template for handling API errors with retry logic',
        category: 'error-handling',
        complexity: 'medium'
      },
      {
        id: '2', 
        name: 'Data Transformation Pipeline',
        description: 'Optimized data processing with parallel execution',
        category: 'data-processing',
        complexity: 'high'
      },
      {
        id: '3',
        name: 'Webhook Listener',
        description: 'Basic webhook receiver with validation',
        category: 'integration',
        complexity: 'low'
      }
    ];

    console.log(`✅ Loaded ${this.templates.length} templates`);
  }

  async start() {
    await this.loadSampleData();
    
    this.server.listen(this.port, '0.0.0.0', () => {
      const localIP = ip.address();
      console.log(`🚀 n8n AI Assistant Phase 3 Server running on port ${this.port}`);
      console.log(`📊 API Key: ${this.apiKey}`);
      console.log(`🔧 Health check: http://localhost:${this.port}/health`);
      console.log(`🌐 Network access: http://${localIP}:${this.port}/health`);
      console.log(`🤝 WebSocket server ready for collaboration`);
      console.log(`\n✅ Phase 3 server ready with advanced features:`);
      console.log(`   🤖 Multi-agent system`);
      console.log(`   🤝 Real-time collaboration`);
      console.log(`   🔬 Workflow simulation`);
      console.log(`   🧠 Memory system`);
      console.log(`   📝 Template management`);
      console.log(`   🔧 Git integration`);
    });

    this.server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });

    // Handle process termination gracefully
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      this.server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  }
}

// Start server
const server = new Phase3Server();
server.start().catch(console.error);

export default Phase3Server;

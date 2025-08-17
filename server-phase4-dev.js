// n8n AI Assistant - Phase 4 Development Server
// Optimized for development without Redis dependency

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Development Configuration
const CONFIG = {
    PORT: process.env.PORT || 3000,
    ENVIRONMENT: 'development',
    CACHE_ENABLED: false, // No Redis in dev mode
    ANALYTICS_ENABLED: true,
    BACKUP_ENABLED: true,
    HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX: 100, // Max requests per window
};

// Logger Configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'n8n-assistant-dev.log' })
    ]
});

// In-memory cache for development
class DevCache {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }

    set(key, value, ttl = 3600) {
        this.cache.set(key, value);
        
        // Clear existing timer if exists
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        // Set expiration timer
        const timer = setTimeout(() => {
            this.cache.delete(key);
            this.timers.delete(key);
        }, ttl * 1000);
        
        this.timers.set(key, timer);
        logger.info(`Cache set: ${key} (TTL: ${ttl}s)`);
    }

    get(key) {
        const value = this.cache.get(key);
        if (value) {
            logger.info(`Cache hit: ${key}`);
        } else {
            logger.info(`Cache miss: ${key}`);
        }
        return value;
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        const deleted = this.cache.delete(key);
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        logger.info(`Cache deleted: ${key}`);
        return deleted;
    }

    clear() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.cache.clear();
        this.timers.clear();
        logger.info('Cache cleared');
    }

    size() {
        return this.cache.size;
    }
}

// Phase 4 Development Server Class
class Phase4DevServer {
    constructor() {
        this.app = express();
        this.cache = new DevCache();
        this.analytics = {
            requests: 0,
            errors: 0,
            uptime: Date.now(),
            workflows: 0,
            cache_hits: 0,
            cache_misses: 0
        };
        this.workflows = [];
        this.templates = [];
        
        this.setupMiddleware();
        this.setupRoutes();
        this.loadInitialData();
        this.startHealthMonitor();
    }

    setupMiddleware() {
        // Security
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "https:"],
                },
            },
        }));

        // CORS
        this.app.use(cors({
            origin: ['http://localhost:3000', 'chrome-extension://*'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: CONFIG.RATE_LIMIT_WINDOW,
            max: CONFIG.RATE_LIMIT_MAX,
            message: {
                error: 'Too many requests',
                retryAfter: Math.ceil(CONFIG.RATE_LIMIT_WINDOW / 1000)
            },
            standardHeaders: true,
            legacyHeaders: false
        });
        this.app.use('/api/', limiter);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging and analytics
        this.app.use((req, res, next) => {
            this.analytics.requests++;
            const start = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - start;
                logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
                
                if (res.statusCode >= 400) {
                    this.analytics.errors++;
                }
            });
            
            next();
        });

        logger.info('✅ Middleware configured');
    }

    setupRoutes() {
        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: Date.now() - this.analytics.uptime,
                environment: CONFIG.ENVIRONMENT,
                cache: {
                    enabled: CONFIG.CACHE_ENABLED,
                    size: this.cache.size()
                },
                version: '4.0.0'
            });
        });

        // Analytics dashboard data
        this.app.get('/api/analytics', (req, res) => {
            const uptime = Date.now() - this.analytics.uptime;
            res.json({
                ...this.analytics,
                uptime: uptime,
                cache_size: this.cache.size(),
                memory: process.memoryUsage(),
                performance: {
                    avg_response_time: this.calculateAvgResponseTime(),
                    requests_per_minute: this.calculateRequestsPerMinute(),
                    error_rate: this.analytics.requests > 0 ? 
                        (this.analytics.errors / this.analytics.requests * 100).toFixed(2) : 0
                }
            });
        });

        // Workflow endpoints
        this.app.get('/api/workflows', (req, res) => {
            const cached = this.cache.get('workflows_list');
            if (cached) {
                this.analytics.cache_hits++;
                return res.json(cached);
            }

            this.analytics.cache_misses++;
            const response = {
                workflows: this.workflows,
                total: this.workflows.length,
                categories: this.getCategoriesFromWorkflows()
            };
            
            this.cache.set('workflows_list', response, 300); // 5 min TTL
            res.json(response);
        });

        this.app.post('/api/workflows/generate', async (req, res) => {
            try {
                const { prompt, category = 'custom' } = req.body;
                
                if (!prompt) {
                    return res.status(400).json({ error: 'Prompt is required' });
                }

                // Check cache first
                const cacheKey = `workflow_${Buffer.from(prompt).toString('base64').slice(0, 20)}`;
                const cached = this.cache.get(cacheKey);
                
                if (cached) {
                    this.analytics.cache_hits++;
                    return res.json(cached);
                }

                this.analytics.cache_misses++;

                // Simulate workflow generation
                const workflow = await this.generateMockWorkflow(prompt, category);
                this.workflows.push(workflow);
                this.analytics.workflows++;

                // Cache the result
                this.cache.set(cacheKey, workflow, 1800); // 30 min TTL

                res.json(workflow);
            } catch (error) {
                logger.error('Workflow generation error:', error);
                res.status(500).json({ error: 'Failed to generate workflow' });
            }
        });

        // Templates
        this.app.get('/api/templates', (req, res) => {
            const { category, search } = req.query;
            let filteredTemplates = this.templates;

            if (category && category !== 'all') {
                filteredTemplates = filteredTemplates.filter(t => t.category === category);
            }

            if (search) {
                const searchLower = search.toLowerCase();
                filteredTemplates = filteredTemplates.filter(t =>
                    t.name.toLowerCase().includes(searchLower) ||
                    t.description.toLowerCase().includes(searchLower)
                );
            }

            res.json({
                templates: filteredTemplates,
                total: filteredTemplates.length,
                categories: [...new Set(this.templates.map(t => t.category))]
            });
        });

        // Workflow simulation
        this.app.post('/api/simulate', async (req, res) => {
            try {
                const { workflow, options = {} } = req.body;
                
                if (!workflow || !workflow.nodes) {
                    return res.status(400).json({ error: 'Invalid workflow data' });
                }

                const simulation = await this.simulateWorkflow(workflow, options);
                res.json(simulation);
            } catch (error) {
                logger.error('Simulation error:', error);
                res.status(500).json({ error: 'Simulation failed' });
            }
        });

        // Backup endpoints
        this.app.post('/api/backup', async (req, res) => {
            try {
                const { type = 'full' } = req.body;
                const backup = await this.createBackup(type);
                res.json(backup);
            } catch (error) {
                logger.error('Backup error:', error);
                res.status(500).json({ error: 'Backup failed' });
            }
        });

        // System info
        this.app.get('/api/system', (req, res) => {
            res.json({
                node_version: process.version,
                platform: process.platform,
                memory: process.memoryUsage(),
                cpu_usage: process.cpuUsage(),
                uptime: process.uptime(),
                environment: CONFIG.ENVIRONMENT,
                features: {
                    cache: CONFIG.CACHE_ENABLED,
                    analytics: CONFIG.ANALYTICS_ENABLED,
                    backup: CONFIG.BACKUP_ENABLED
                }
            });
        });

        // Static files
        this.app.use(express.static(path.join(__dirname, 'dist')));

        // Catch all route
        this.app.get('*', (req, res) => {
            if (req.path.startsWith('/api/')) {
                res.status(404).json({ error: 'API endpoint not found' });
            } else {
                res.sendFile(path.join(__dirname, 'dist', 'index.html'));
            }
        });

        logger.info('✅ Routes configured');
    }

    async loadInitialData() {
        try {
            // Load default templates
            this.templates = [
                {
                    id: 'email-automation',
                    name: 'Email Automation',
                    description: 'Automated email workflows with triggers',
                    category: 'communication',
                    nodes: 5,
                    complexity: 'medium',
                    created: new Date().toISOString()
                },
                {
                    id: 'data-sync',
                    name: 'Data Synchronization',
                    description: 'Sync data between multiple systems',
                    category: 'data',
                    nodes: 8,
                    complexity: 'high',
                    created: new Date().toISOString()
                },
                {
                    id: 'slack-notifications',
                    name: 'Slack Notifications',
                    description: 'Send notifications to Slack channels',
                    category: 'communication',
                    nodes: 3,
                    complexity: 'low',
                    created: new Date().toISOString()
                }
            ];

            logger.info(`📁 Loaded ${this.templates.length} templates`);
        } catch (error) {
            logger.error('Failed to load initial data:', error);
        }
    }

    async generateMockWorkflow(prompt, category) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const nodeCount = Math.floor(Math.random() * 8) + 3;
        const workflow = {
            id: `workflow_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: this.generateWorkflowName(prompt),
            description: `Generated workflow: ${prompt.slice(0, 100)}...`,
            category,
            nodes: Array.from({ length: nodeCount }, (_, i) => ({
                id: `node_${i + 1}`,
                type: this.getRandomNodeType(),
                name: `Node ${i + 1}`,
                position: { x: i * 200, y: Math.floor(i / 3) * 150 }
            })),
            connections: this.generateMockConnections(nodeCount),
            created: new Date().toISOString(),
            complexity: nodeCount < 5 ? 'low' : nodeCount < 8 ? 'medium' : 'high',
            estimated_runtime: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
        };

        return workflow;
    }

    generateWorkflowName(prompt) {
        const keywords = prompt.toLowerCase().split(' ').filter(word => word.length > 3);
        const mainKeyword = keywords[0] || 'automation';
        return `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} Workflow`;
    }

    getRandomNodeType() {
        const types = ['trigger', 'http', 'email', 'database', 'transform', 'condition', 'slack', 'webhook'];
        return types[Math.floor(Math.random() * types.length)];
    }

    generateMockConnections(nodeCount) {
        const connections = [];
        for (let i = 0; i < nodeCount - 1; i++) {
            connections.push({
                from: `node_${i + 1}`,
                to: `node_${i + 2}`,
                type: 'main'
            });
        }
        return connections;
    }

    async simulateWorkflow(workflow, options) {
        const startTime = Date.now();
        const nodeCount = workflow.nodes?.length || 0;
        
        // Simulate processing each node
        const results = [];
        for (let i = 0; i < nodeCount; i++) {
            await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
            
            results.push({
                node_id: workflow.nodes[i].id,
                status: Math.random() > 0.1 ? 'success' : 'warning',
                execution_time: Math.floor(Math.random() * 500) + 100,
                data_processed: Math.floor(Math.random() * 1000) + 10
            });
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        return {
            simulation_id: `sim_${Date.now()}`,
            workflow_id: workflow.id,
            status: results.every(r => r.status === 'success') ? 'completed' : 'completed_with_warnings',
            execution_time: totalTime,
            nodes_processed: nodeCount,
            node_results: results,
            performance: {
                avg_node_time: Math.floor(totalTime / nodeCount),
                throughput: Math.floor(nodeCount / (totalTime / 1000)),
                bottlenecks: results.filter(r => r.execution_time > 400).map(r => r.node_id)
            },
            completed_at: new Date().toISOString()
        };
    }

    async createBackup(type) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backup = {
            id: `backup_${timestamp}`,
            type,
            created: new Date().toISOString(),
            size: Math.floor(Math.random() * 10000) + 1000, // Mock size in KB
        };

        if (type === 'full' || type === 'workflows') {
            backup.workflows = this.workflows.length;
        }

        if (type === 'full' || type === 'templates') {
            backup.templates = this.templates.length;
        }

        if (type === 'full' || type === 'analytics') {
            backup.analytics = { ...this.analytics };
        }

        logger.info(`📦 Created ${type} backup: ${backup.id}`);
        return backup;
    }

    getCategoriesFromWorkflows() {
        const categories = [...new Set(this.workflows.map(w => w.category))];
        return categories.length > 0 ? categories : ['automation', 'data', 'communication'];
    }

    calculateAvgResponseTime() {
        // Mock calculation
        return Math.floor(Math.random() * 200) + 50;
    }

    calculateRequestsPerMinute() {
        const uptime = Date.now() - this.analytics.uptime;
        const minutes = uptime / (1000 * 60);
        return minutes > 0 ? Math.floor(this.analytics.requests / minutes) : 0;
    }

    startHealthMonitor() {
        setInterval(() => {
            const memUsage = process.memoryUsage();
            logger.info('Health check:', {
                memory: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
                uptime: `${Math.floor((Date.now() - this.analytics.uptime) / 1000)}s`,
                cache_size: this.cache.size(),
                requests: this.analytics.requests,
                errors: this.analytics.errors
            });
        }, CONFIG.HEALTH_CHECK_INTERVAL);
    }

    async start() {
        const server = this.app.listen(CONFIG.PORT, () => {
            logger.info(`
🚀 n8n AI Assistant - Phase 4 Development Server Started
📍 Port: ${CONFIG.PORT}
🔴 Redis: disabled (dev mode)
🧠 LLM: mock/simulation
🌍 Environment: ${CONFIG.ENVIRONMENT}
📊 Version: 4.0.0
            `);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully');
            server.close(() => {
                process.exit(0);
            });
        });

        return server;
    }
}

// Start server if this file is run directly
const server = new Phase4DevServer();
server.start().catch(error => {
    logger.error('Failed to start server:', error);
    process.exit(1);
});

export { Phase4DevServer, DevCache, CONFIG };

/**
 * AGENTE INTELIGENTE PRINCIPAL DE WORKFLOWS N8N
 * Integra todos los motores de inteligencia para generar workflows profesionales
 */

import { SemanticAnalysisEngine, LogicalInferenceEngine, FlowOptimizationEngine } from './intelligent-workflow-agent.js';
import fs from 'fs';

// ============== SISTEMA DE APRENDIZAJE ==============
class LearningEngine {
    constructor() {
        this.workflowDatabase = new Map();
        this.patternLibrary = new Map();
        this.successMetrics = new Map();
    }

    learnFromWorkflow(workflow, prompt, success = true) {
        const workflowId = this.generateWorkflowId(workflow);
        
        // Almacenar workflow para aprendizaje futuro
        this.workflowDatabase.set(workflowId, {
            workflow,
            prompt,
            success,
            createdAt: new Date(),
            nodeCount: workflow.nodes.length,
            complexity: this.assessWorkflowComplexity(workflow)
        });

        // Extraer patrones exitosos
        if (success) {
            this.extractPatterns(workflow, prompt);
        }

        console.log(`📚 Workflow aprendido: ${workflowId} (${success ? 'exitoso' : 'fallido'})`);
    }

    generateWorkflowId(workflow) {
        const nodeTypes = workflow.nodes.map(n => n.type).sort().join('|');
        const hash = this.simpleHash(nodeTypes);
        return `wf_${hash}`;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    extractPatterns(workflow, prompt) {
        // Extraer patrones de conexión exitosos
        const connectionPatterns = this.analyzeConnectionPatterns(workflow);
        
        // Extraer patrones de configuración
        const configurationPatterns = this.analyzeConfigurationPatterns(workflow);
        
        // Almacenar en biblioteca de patrones
        const promptKeywords = prompt.toLowerCase().split(/\s+/);
        promptKeywords.forEach(keyword => {
            if (!this.patternLibrary.has(keyword)) {
                this.patternLibrary.set(keyword, {
                    connections: [],
                    configurations: [],
                    frequency: 0
                });
            }
            
            const pattern = this.patternLibrary.get(keyword);
            pattern.connections.push(...connectionPatterns);
            pattern.configurations.push(...configurationPatterns);
            pattern.frequency++;
        });
    }

    analyzeConnectionPatterns(workflow) {
        const patterns = [];
        
        for (const [source, connections] of Object.entries(workflow.connections)) {
            if (connections.main && connections.main[0]) {
                const sourceNode = workflow.nodes.find(n => n.name === source);
                connections.main[0].forEach(target => {
                    const targetNode = workflow.nodes.find(n => n.name === target.node);
                    if (sourceNode && targetNode) {
                        patterns.push({
                            from: sourceNode.type,
                            to: targetNode.type,
                            pattern: `${sourceNode.type}->${targetNode.type}`
                        });
                    }
                });
            }
        }
        
        return patterns;
    }

    analyzeConfigurationPatterns(workflow) {
        return workflow.nodes.map(node => ({
            type: node.type,
            parameters: node.parameters,
            hasCredentials: Object.keys(node.credentials || {}).length > 0
        }));
    }

    getSimilarWorkflows(prompt, limit = 5) {
        const promptLower = prompt.toLowerCase();
        const scored = [];

        for (const [id, data] of this.workflowDatabase) {
            if (data.success) {
                const similarity = this.calculateSimilarity(promptLower, data.prompt.toLowerCase());
                if (similarity > 0.1) {
                    scored.push({
                        id,
                        ...data,
                        similarity
                    });
                }
            }
        }

        return scored
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }

    calculateSimilarity(prompt1, prompt2) {
        const words1 = new Set(prompt1.split(/\s+/));
        const words2 = new Set(prompt2.split(/\s+/));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    assessWorkflowComplexity(workflow) {
        const nodeCount = workflow.nodes.length;
        const connectionCount = Object.keys(workflow.connections).length;
        const hasConditionals = workflow.nodes.some(n => n.type.includes('if'));
        const hasIntegrations = workflow.nodes.some(n => 
            n.type.includes('hubspot') || n.type.includes('salesforce') || n.type.includes('stripe')
        );

        let score = 0;
        if (nodeCount > 5) score += 2;
        if (connectionCount > 3) score += 1;
        if (hasConditionals) score += 2;
        if (hasIntegrations) score += 1;

        if (score <= 2) return 'SIMPLE';
        if (score <= 4) return 'MEDIUM';
        if (score <= 6) return 'COMPLEX';
        return 'VERY_COMPLEX';
    }
}

// ============== AGENTE PRINCIPAL ==============
class IntelligentWorkflowAgent {
    constructor() {
        console.log('🤖 INICIALIZANDO AGENTE INTELIGENTE DE WORKFLOWS...');
        
        this.semanticEngine = new SemanticAnalysisEngine();
        this.inferenceEngine = new LogicalInferenceEngine(this.semanticEngine);
        this.optimizationEngine = new FlowOptimizationEngine();
        this.learningEngine = new LearningEngine();
        
        // Base de workflows de referencia simulada (en producción vendría de base de datos)
        this.initializeReferenceWorkflows();
        
        console.log('✅ Agente inicializado con 4 motores de inteligencia');
    }

    initializeReferenceWorkflows() {
        // Simular workflows de referencia exitosos
        const referenceWorkflows = [
            {
                name: "Advanced CRM Pipeline",
                description: "Sistema CRM completo con validación multi-nivel",
                nodes: [
                    { name: "Lead Webhook", type: "n8n-nodes-base.webhook" },
                    { name: "Data Validation", type: "n8n-nodes-base.if" },
                    { name: "Enrich Lead Data", type: "n8n-nodes-base.function" },
                    { name: "Update Salesforce", type: "n8n-nodes-base.salesforce" },
                    { name: "Send Welcome Email", type: "n8n-nodes-base.emailSend" },
                    { name: "Notify Sales Team", type: "n8n-nodes-base.slack" },
                    { name: "Track Analytics", type: "n8n-nodes-base.googleAnalytics" }
                ],
                connections: {
                    "Lead Webhook": ["Data Validation"],
                    "Data Validation": ["Enrich Lead Data", "Notify Sales Team"],
                    "Enrich Lead Data": ["Update Salesforce"],
                    "Update Salesforce": ["Send Welcome Email"],
                    "Send Welcome Email": ["Track Analytics"],
                    "Notify Sales Team": ["Track Analytics"]
                },
                keywords: ["lead", "crm", "salesforce", "validation", "email", "analytics"],
                success_rate: 0.95
            },
            {
                name: "E-commerce Order Processor",
                description: "Procesamiento completo de pedidos con pagos y inventario",
                nodes: [
                    { name: "Order Webhook", type: "n8n-nodes-base.webhook" },
                    { name: "Validate Order", type: "n8n-nodes-base.if" },
                    { name: "Check Inventory", type: "n8n-nodes-base.postgres" },
                    { name: "Process Payment", type: "n8n-nodes-base.stripe" },
                    { name: "Generate Invoice", type: "n8n-nodes-base.function" },
                    { name: "Send Confirmation", type: "n8n-nodes-base.emailSend" },
                    { name: "Update Inventory", type: "n8n-nodes-base.postgres" },
                    { name: "Notify Fulfillment", type: "n8n-nodes-base.slack" }
                ],
                connections: {
                    "Order Webhook": ["Validate Order"],
                    "Validate Order": ["Check Inventory"],
                    "Check Inventory": ["Process Payment"],
                    "Process Payment": ["Generate Invoice"],
                    "Generate Invoice": ["Send Confirmation"],
                    "Send Confirmation": ["Update Inventory"],
                    "Update Inventory": ["Notify Fulfillment"]
                },
                keywords: ["order", "ecommerce", "payment", "inventory", "stripe", "invoice"],
                success_rate: 0.92
            }
        ];

        // Aprender de workflows de referencia
        referenceWorkflows.forEach(ref => {
            const workflow = {
                nodes: ref.nodes.map(node => ({
                    ...node,
                    id: this.generateNodeId(),
                    position: [Math.random() * 800 + 100, Math.random() * 600 + 100],
                    parameters: {},
                    typeVersion: 1
                })),
                connections: ref.connections
            };
            
            this.learningEngine.learnFromWorkflow(workflow, ref.description, true);
        });
    }

    async generateIntelligentWorkflow(prompt) {
        console.log('\n🎯 GENERANDO WORKFLOW CON INTELIGENCIA ARTIFICIAL...');
        console.log(`📝 Prompt: "${prompt}"`);
        
        // Fase 1: Análisis semántico profundo
        const analysis = this.semanticEngine.analyzePrompt(prompt);
        
        // Fase 2: Buscar workflows similares aprendidos
        const similarWorkflows = this.learningEngine.getSimilarWorkflows(prompt, 3);
        console.log(`🔍 Workflows similares encontrados: ${similarWorkflows.length}`);
        
        // Fase 3: Generar estructura base
        let workflow = await this.generateBaseWorkflow(prompt, analysis, similarWorkflows);
        
        // Fase 4: Inferir configuraciones inteligentes
        workflow = this.applyIntelligentConfiguration(workflow, prompt, analysis);
        
        // Fase 5: Optimizar flujo
        workflow = this.optimizationEngine.optimizeWorkflow(workflow, analysis);
        
        // Fase 6: Validación final y limpieza
        workflow = this.finalizeWorkflow(workflow, analysis);
        
        // Fase 7: Aprender del workflow generado
        this.learningEngine.learnFromWorkflow(workflow, prompt, true);
        
        console.log('✅ WORKFLOW INTELIGENTE GENERADO');
        return workflow;
    }

    async generateBaseWorkflow(prompt, analysis, similarWorkflows) {
        console.log('🏗️ Generando estructura base del workflow...');
        
        let baseWorkflow = null;
        
        // Si hay workflows similares, usar el mejor como base
        if (similarWorkflows.length > 0) {
            console.log(`   📋 Usando workflow similar como base: ${similarWorkflows[0].id}`);
            baseWorkflow = this.adaptWorkflowFromReference(similarWorkflows[0].workflow, prompt, analysis);
        } else {
            console.log('   🔨 Generando workflow desde cero');
            baseWorkflow = this.generateWorkflowFromScratch(prompt, analysis);
        }
        
        // Generar nodos complementarios basados en análisis
        const complementaryNodes = this.generateIntelligentComplementaryNodes(prompt, analysis, baseWorkflow);
        if (complementaryNodes.length > 0) {
            console.log(`   ➕ Agregando ${complementaryNodes.length} nodos complementarios inteligentes`);
            baseWorkflow = this.integrateComplementaryNodes(baseWorkflow, complementaryNodes, analysis);
        }
        
        return baseWorkflow;
    }

    adaptWorkflowFromReference(referenceWorkflow, prompt, analysis) {
        const workflow = {
            nodes: [],
            connections: {}
        };
        
        // Adaptar nodos de referencia
        for (const refNode of referenceWorkflow.nodes) {
            const adaptedNode = {
                id: this.generateNodeId(),
                name: this.generateIntelligentNodeName(refNode.name, prompt, analysis),
                type: refNode.type,
                position: [Math.random() * 800 + 100, Math.random() * 600 + 100],
                parameters: {},
                typeVersion: 1,
                credentials: this.inferCredentials(refNode.type)
            };
            
            workflow.nodes.push(adaptedNode);
        }
        
        // Adaptar conexiones
        workflow.connections = this.adaptIntelligentConnections(referenceWorkflow.connections, workflow.nodes);
        
        return workflow;
    }

    generateWorkflowFromScratch(prompt, analysis) {
        const workflow = {
            nodes: [],
            connections: {}
        };
        
        // Generar nodos basado en análisis semántico
        const requiredNodes = this.inferRequiredNodes(analysis);
        
        for (const nodeSpec of requiredNodes) {
            const node = {
                id: this.generateNodeId(),
                name: nodeSpec.name,
                type: nodeSpec.type,
                position: [Math.random() * 800 + 100, Math.random() * 600 + 100],
                parameters: {},
                typeVersion: 1,
                credentials: this.inferCredentials(nodeSpec.type)
            };
            
            workflow.nodes.push(node);
        }
        
        // Generar conexiones inteligentes
        workflow.connections = this.generateIntelligentConnections(workflow.nodes, analysis);
        
        return workflow;
    }

    generateIntelligentNodeName(baseName, prompt, analysis) {
        const promptLower = prompt.toLowerCase();
        
        // Mapeo inteligente de nombres basado en contexto
        const intelligentMappings = {
            'webhook': this.getIntelligentWebhookName(promptLower, analysis),
            'validation': this.getIntelligentValidationName(promptLower, analysis),
            'function': this.getIntelligentFunctionName(baseName, promptLower, analysis),
            'email': this.getIntelligentEmailName(promptLower, analysis),
            'slack': this.getIntelligentSlackName(promptLower, analysis)
        };
        
        for (const [pattern, name] of Object.entries(intelligentMappings)) {
            if (baseName.toLowerCase().includes(pattern)) {
                return name;
            }
        }
        
        return this.contextualizeNodeName(baseName, analysis);
    }

    getIntelligentWebhookName(prompt, analysis) {
        const primaryDomain = analysis.domains[0]?.name;
        
        if (primaryDomain === 'crm') return 'Webhook de Leads CRM';
        if (primaryDomain === 'ecommerce') return 'Webhook de Pedidos';
        if (prompt.includes('contact')) return 'Webhook de Contactos';
        if (prompt.includes('payment')) return 'Webhook de Pagos';
        if (prompt.includes('notification')) return 'Webhook de Notificaciones';
        
        return 'Webhook de Entrada Inteligente';
    }

    getIntelligentValidationName(prompt, analysis) {
        if (prompt.includes('lead')) return 'Validación Avanzada de Leads';
        if (prompt.includes('order') || prompt.includes('pedido')) return 'Validación de Pedidos';
        if (prompt.includes('payment')) return 'Validación de Pagos';
        if (prompt.includes('email')) return 'Validación de Email';
        
        return 'Validación Inteligente de Datos';
    }

    getIntelligentFunctionName(baseName, prompt, analysis) {
        if (baseName.toLowerCase().includes('pdf')) return 'Generador Avanzado de PDF';
        if (baseName.toLowerCase().includes('calculation')) return 'Motor de Cálculos Empresariales';
        if (baseName.toLowerCase().includes('transform')) return 'Transformador Inteligente de Datos';
        if (prompt.includes('enrich')) return 'Enriquecedor de Datos';
        
        return 'Procesador Inteligente';
    }

    getIntelligentEmailName(prompt, analysis) {
        if (prompt.includes('welcome') || prompt.includes('bienvenida')) return 'Email de Bienvenida Personalizado';
        if (prompt.includes('confirmation') || prompt.includes('confirmacion')) return 'Email de Confirmación Automático';
        if (prompt.includes('notification')) return 'Notificación Email Inteligente';
        
        return 'Sistema de Email Inteligente';
    }

    getIntelligentSlackName(prompt, analysis) {
        if (prompt.includes('sales') || prompt.includes('ventas')) return 'Notificación Slack - Equipo de Ventas';
        if (prompt.includes('support') || prompt.includes('soporte')) return 'Notificación Slack - Soporte';
        if (prompt.includes('alert') || prompt.includes('error')) return 'Alerta Slack - Sistema';
        
        return 'Notificación Slack Inteligente';
    }

    contextualizeNodeName(baseName, analysis) {
        const primaryDomain = analysis.domains[0]?.name;
        const context = {
            'crm': 'CRM',
            'ecommerce': 'E-commerce',
            'communication': 'Comunicación',
            'data': 'Datos',
            'automation': 'Automatización'
        }[primaryDomain] || 'Sistema';
        
        return `${baseName} - ${context}`;
    }

    inferRequiredNodes(analysis) {
        const nodes = [];
        
        // Trigger node basado en intenciones
        if (analysis.intents.some(i => i.intent === 'data-capture')) {
            nodes.push({
                name: this.getIntelligentWebhookName('', analysis),
                type: 'n8n-nodes-base.webhook'
            });
        }
        
        // Validation node si se detecta necesidad de validación
        if (analysis.intents.some(i => i.intent === 'data-validation')) {
            nodes.push({
                name: this.getIntelligentValidationName('', analysis),
                type: 'n8n-nodes-base.if'
            });
        }
        
        // Processing nodes basado en dominios
        analysis.domains.forEach(domain => {
            if (domain.name === 'crm' && domain.confidence > 0.7) {
                nodes.push({
                    name: 'Actualizar CRM Inteligente',
                    type: 'n8n-nodes-base.salesforce'
                });
            }
            
            if (domain.name === 'ecommerce' && domain.confidence > 0.7) {
                nodes.push({
                    name: 'Procesador de Pagos Inteligente',
                    type: 'n8n-nodes-base.stripe'
                });
            }
            
            if (domain.name === 'communication' && domain.confidence > 0.5) {
                nodes.push({
                    name: this.getIntelligentEmailName('', analysis),
                    type: 'n8n-nodes-base.emailSend'
                });
            }
        });
        
        return nodes;
    }

    generateIntelligentComplementaryNodes(prompt, analysis, existingWorkflow) {
        const complementary = [];
        const existingTypes = existingWorkflow.nodes.map(n => n.type);
        const promptLower = prompt.toLowerCase();
        
        // Análisis inteligente de funcionalidades faltantes
        const missingFeatures = this.analyzeMissingFeatures(prompt, analysis, existingTypes);
        
        missingFeatures.forEach(feature => {
            switch (feature.type) {
                case 'analytics':
                    complementary.push({
                        name: 'Analytics Inteligente',
                        type: 'n8n-nodes-base.googleAnalytics',
                        purpose: 'intelligent-analytics',
                        priority: feature.priority
                    });
                    break;
                    
                case 'pdf-generation':
                    complementary.push({
                        name: 'Generador PDF Avanzado',
                        type: 'n8n-nodes-base.function',
                        purpose: 'advanced-pdf-generation',
                        priority: feature.priority
                    });
                    break;
                    
                case 'data-enrichment':
                    complementary.push({
                        name: 'Enriquecedor de Datos IA',
                        type: 'n8n-nodes-base.function',
                        purpose: 'data-enrichment',
                        priority: feature.priority
                    });
                    break;
                    
                case 'error-handling':
                    complementary.push({
                        name: 'Manejador Inteligente de Errores',
                        type: 'n8n-nodes-base.function',
                        purpose: 'intelligent-error-handling',
                        priority: feature.priority
                    });
                    break;
            }
        });
        
        // Ordenar por prioridad
        return complementary.sort((a, b) => b.priority - a.priority);
    }

    analyzeMissingFeatures(prompt, analysis, existingTypes) {
        const features = [];
        const promptLower = prompt.toLowerCase();
        
        // Detección inteligente de funcionalidades
        if (promptLower.includes('analytics') && !existingTypes.includes('n8n-nodes-base.googleAnalytics')) {
            features.push({ type: 'analytics', priority: 0.8 });
        }
        
        if (promptLower.includes('pdf') && !existingTypes.some(t => t.includes('function'))) {
            features.push({ type: 'pdf-generation', priority: 0.9 });
        }
        
        if (analysis.complexity === 'VERY_COMPLEX' && !existingTypes.some(t => t.includes('function'))) {
            features.push({ type: 'data-enrichment', priority: 0.7 });
        }
        
        if (existingTypes.some(t => t.includes('httpRequest') || t.includes('stripe'))) {
            features.push({ type: 'error-handling', priority: 0.6 });
        }
        
        return features;
    }

    applyIntelligentConfiguration(workflow, prompt, analysis) {
        console.log('🔧 Aplicando configuración inteligente...');
        
        workflow.nodes.forEach(node => {
            const intelligentConfig = this.inferenceEngine.inferNodeConfiguration(
                node.type, 
                node.name, 
                prompt, 
                analysis
            );
            
            // Fusionar configuración inteligente
            node.parameters = { ...node.parameters, ...intelligentConfig };
            
            // Agregar configuración avanzada
            this.applyAdvancedConfiguration(node, analysis);
        });
        
        return workflow;
    }

    applyAdvancedConfiguration(node, analysis) {
        // Configuración avanzada basada en complejidad
        if (analysis.complexity === 'VERY_COMPLEX') {
            node.continueOnFail = true;
            node.retryOnFail = true;
            node.maxTries = 3;
            node.waitBetweenTries = 2000;
        }
        
        // Configuración específica por tipo
        if (node.type.includes('httpRequest') || node.type.includes('stripe')) {
            node.onError = 'continueRegularOutput';
            node.alwaysOutputData = true;
        }
        
        // Configuración de credenciales inteligente
        if (!node.credentials) {
            node.credentials = this.inferCredentials(node.type);
        }
    }

    finalizeWorkflow(workflow, analysis) {
        console.log('✨ Finalizando workflow inteligente...');
        
        // Validación y limpieza final
        workflow = this.validateAndCleanWorkflow(workflow);
        
        // Agregar metadatos inteligentes
        workflow.metadata = this.generateIntelligentMetadata(workflow, analysis);
        
        return workflow;
    }

    validateAndCleanWorkflow(workflow) {
        // Eliminar nodos duplicados
        const uniqueNodes = [];
        const seen = new Set();
        
        workflow.nodes.forEach(node => {
            const key = `${node.type}-${node.name}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueNodes.push(node);
            }
        });
        
        workflow.nodes = uniqueNodes;
        
        // Validar conexiones
        const validConnections = {};
        const nodeNames = new Set(workflow.nodes.map(n => n.name));
        
        for (const [source, connections] of Object.entries(workflow.connections)) {
            if (nodeNames.has(source) && connections.main && connections.main[0]) {
                const validTargets = connections.main[0].filter(target => 
                    nodeNames.has(target.node)
                );
                
                if (validTargets.length > 0) {
                    validConnections[source] = {
                        main: [validTargets]
                    };
                }
            }
        }
        
        workflow.connections = validConnections;
        
        return workflow;
    }

    generateIntelligentMetadata(workflow, analysis) {
        return {
            generatedBy: 'intelligent-workflow-agent-v1.0',
            generatedAt: new Date().toISOString(),
            analysis: {
                domains: analysis.domains.map(d => d.name),
                complexity: analysis.complexity,
                intents: analysis.intents.map(i => i.intent),
                confidence: analysis.domains[0]?.confidence || 0.5
            },
            metrics: {
                nodeCount: workflow.nodes.length,
                connectionCount: Object.keys(workflow.connections).length,
                estimatedExecutionTime: this.estimateIntelligentExecutionTime(workflow),
                confidenceScore: this.calculateWorkflowConfidence(workflow, analysis)
            }
        };
    }

    estimateIntelligentExecutionTime(workflow) {
        let totalTime = 0;
        
        // Estimación más precisa basada en tipos de nodos y configuración
        workflow.nodes.forEach(node => {
            const baseTime = this.getNodeBaseExecutionTime(node.type);
            const complexityMultiplier = this.getNodeComplexityMultiplier(node);
            totalTime += baseTime * complexityMultiplier;
        });
        
        return `${(totalTime / 1000).toFixed(2)} segundos (estimación inteligente)`;
    }

    getNodeBaseExecutionTime(nodeType) {
        const baseTimes = {
            'n8n-nodes-base.webhook': 50,
            'n8n-nodes-base.if': 25,
            'n8n-nodes-base.function': 200,
            'n8n-nodes-base.httpRequest': 800,
            'n8n-nodes-base.emailSend': 1500,
            'n8n-nodes-base.salesforce': 2000,
            'n8n-nodes-base.stripe': 1800,
            'n8n-nodes-base.slack': 600,
            'n8n-nodes-base.postgres': 400,
            'n8n-nodes-base.googleAnalytics': 1000
        };
        
        return baseTimes[nodeType] || 500;
    }

    getNodeComplexityMultiplier(node) {
        let multiplier = 1;
        
        // Factor de complejidad basado en parámetros
        const paramCount = Object.keys(node.parameters || {}).length;
        if (paramCount > 5) multiplier += 0.5;
        
        // Factor de reintentos
        if (node.retryOnFail) multiplier += 0.3;
        
        // Factor de credenciales (operaciones autenticadas son más lentas)
        if (node.credentials && Object.keys(node.credentials).length > 0) {
            multiplier += 0.2;
        }
        
        return multiplier;
    }

    calculateWorkflowConfidence(workflow, analysis) {
        let confidence = 0.5;
        
        // Factor de análisis semántico
        if (analysis.domains.length > 0) {
            confidence += analysis.domains[0].confidence * 0.3;
        }
        
        // Factor de complejidad apropiada
        const nodeCount = workflow.nodes.length;
        if (nodeCount >= 3 && nodeCount <= 10) {
            confidence += 0.2;
        }
        
        // Factor de conexiones lógicas
        const connectionRatio = Object.keys(workflow.connections).length / workflow.nodes.length;
        if (connectionRatio >= 0.3 && connectionRatio <= 0.8) {
            confidence += 0.2;
        }
        
        return Math.min(confidence, 1.0);
    }

    // Métodos auxiliares
    generateNodeId() {
        return 'intelligent-' + Math.random().toString(36).substr(2, 9);
    }

    inferCredentials(nodeType) {
        const credentialMap = {
            'n8n-nodes-base.salesforce': { salesforce: { id: "sf-creds", name: "Salesforce API" } },
            'n8n-nodes-base.hubspot': { hubspot: { id: "hs-creds", name: "HubSpot API" } },
            'n8n-nodes-base.stripe': { stripeApi: { id: "stripe-creds", name: "Stripe API" } },
            'n8n-nodes-base.slack': { slackApi: { id: "slack-creds", name: "Slack API" } },
            'n8n-nodes-base.emailSend': { smtp: { id: "email-creds", name: "SMTP Server" } },
            'n8n-nodes-base.postgres': { postgres: { id: "pg-creds", name: "PostgreSQL DB" } },
            'n8n-nodes-base.googleAnalytics': { googleAnalytics: { id: "ga-creds", name: "Google Analytics" } }
        };
        
        return credentialMap[nodeType] || {};
    }

    // Métodos de conexión inteligente (implementados previamente)
    adaptIntelligentConnections(referenceConnections, nodes) {
        // Implementación de adaptación inteligente de conexiones
        const connections = {};
        const nodeNames = nodes.map(n => n.name);
        
        for (const [source, targets] of Object.entries(referenceConnections)) {
            const sourceNode = nodes.find(n => this.isNodeEquivalent(source, n.name));
            if (sourceNode && targets.length > 0) {
                const validTargets = targets.map(target => {
                    const targetNode = nodes.find(n => this.isNodeEquivalent(target, n.name));
                    return targetNode ? {
                        node: targetNode.name,
                        type: 'main',
                        index: 0
                    } : null;
                }).filter(Boolean);
                
                if (validTargets.length > 0) {
                    connections[sourceNode.name] = { main: [validTargets] };
                }
            }
        }
        
        return connections;
    }

    generateIntelligentConnections(nodes, analysis) {
        const connections = {};
        
        // Crear conexiones inteligentes basadas en tipos y flujo lógico
        for (let i = 0; i < nodes.length - 1; i++) {
            const currentNode = nodes[i];
            const nextNode = nodes[i + 1];
            
            connections[currentNode.name] = {
                main: [[{
                    node: nextNode.name,
                    type: 'main',
                    index: 0
                }]]
            };
        }
        
        return connections;
    }

    integrateComplementaryNodes(workflow, complementaryNodes, analysis) {
        // Integrar nodos complementarios inteligentemente
        complementaryNodes.forEach(compNode => {
            const node = {
                id: this.generateNodeId(),
                name: compNode.name,
                type: compNode.type,
                position: [Math.random() * 800 + 100, Math.random() * 600 + 100],
                parameters: {},
                typeVersion: 1,
                credentials: this.inferCredentials(compNode.type)
            };
            
            workflow.nodes.push(node);
            
            // Conectar inteligentemente basado en propósito
            this.connectComplementaryNode(workflow, node, compNode.purpose);
        });
        
        return workflow;
    }

    connectComplementaryNode(workflow, node, purpose) {
        // Lógica de conexión inteligente basada en propósito
        switch (purpose) {
            case 'intelligent-analytics':
                const lastNode = this.findLastProcessingNode(workflow.nodes);
                if (lastNode) {
                    if (!workflow.connections[lastNode.name]) {
                        workflow.connections[lastNode.name] = { main: [[]] };
                    }
                    workflow.connections[lastNode.name].main[0].push({
                        node: node.name,
                        type: 'main',
                        index: 0
                    });
                }
                break;
                
            default:
                // Conexión por defecto al final del flujo
                const finalNode = this.findLastProcessingNode(workflow.nodes);
                if (finalNode && finalNode.name !== node.name) {
                    if (!workflow.connections[finalNode.name]) {
                        workflow.connections[finalNode.name] = { main: [[]] };
                    }
                    workflow.connections[finalNode.name].main[0].push({
                        node: node.name,
                        type: 'main',
                        index: 0
                    });
                }
        }
    }

    findLastProcessingNode(nodes) {
        const processingNodes = nodes.filter(node => 
            !node.name.toLowerCase().includes('analytics') &&
            !node.name.toLowerCase().includes('error')
        );
        return processingNodes[processingNodes.length - 1];
    }

    isNodeEquivalent(name1, name2) {
        const normalize = name => name.toLowerCase()
            .replace(/\b(intelligent|smart|advanced|sistema|de|del|la|el)\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
            
        return normalize(name1).includes(normalize(name2)) || 
               normalize(name2).includes(normalize(name1));
    }

    // Método principal público
    async generateFullWorkflowJSON(prompt) {
        const workflow = await this.generateIntelligentWorkflow(prompt);
        
        return {
            name: `Workflow Inteligente - ${new Date().toLocaleDateString()}`,
            active: false,
            nodes: workflow.nodes.map(node => ({
                ...node,
                continueOnFail: node.continueOnFail || false,
                onError: node.onError || "stopWorkflow",
                retryOnFail: node.retryOnFail || false,
                maxTries: node.maxTries || 3,
                waitBetweenTries: node.waitBetweenTries || 1000,
                alwaysOutputData: node.alwaysOutputData || false
            })),
            connections: workflow.connections,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: {
                executionOrder: "v1",
                saveManualExecutions: true,
                callerPolicy: "workflowsFromSameOwner",
                errorWorkflow: "",
                timezone: "Europe/Madrid"
            },
            staticData: {},
            tags: ["intelligent-agent", "ai-generated", "professional"],
            triggerCount: 0,
            versionId: "2.0.0",
            meta: workflow.metadata
        };
    }
}

export { IntelligentWorkflowAgent };
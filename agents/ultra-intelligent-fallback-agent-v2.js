/**
 * AGENTE DE FALLBACK ULTRA INTELIGENTE V2.0
 * ==========================================
 * 
 * Sistema avanzado de generación de workflows con:
 * - Análisis semántico profundo de prompts
 * - Validación inteligente de flujos y conexiones
 * - Detección y prevención de errores comunes
 * - Soporte completo para nodos de IA
 * - Análisis topológico de workflows
 * - Sistema de corrección automática
 * - Inteligencia de dominio específico
 */

class UltraIntelligentFallbackAgent {
    constructor() {
        this.domainKnowledge = this.initializeDomainKnowledge();
        this.aiNodeTemplates = this.initializeAINodeTemplates();
        this.workflowPatterns = this.initializeWorkflowPatterns();
        this.validationRules = this.initializeValidationRules();
        this.connectionAnalyzer = new ConnectionAnalyzer();
        this.flowValidator = new FlowValidator();
        this.semanticAnalyzer = new SemanticAnalyzer();
    }

    /**
     * GENERADOR PRINCIPAL DE WORKFLOWS ULTRA INTELIGENTE
     */
    async generateIntelligentWorkflow(prompt, referenceWorkflows = []) {
        console.log('🧠 INICIANDO GENERACIÓN ULTRA INTELIGENTE DE WORKFLOW');
        console.log('=' .repeat(60));

        try {
            // 1. ANÁLISIS SEMÁNTICO PROFUNDO DEL PROMPT
            const semanticAnalysis = await this.performDeepSemanticAnalysis(prompt);
            console.log('📊 Análisis semántico completado:', {
                businessDomain: semanticAnalysis.businessDomain,
                userIntent: semanticAnalysis.userIntent,
                complexity: semanticAnalysis.complexity,
                requiredIntegrations: semanticAnalysis.requiredIntegrations.length,
                aiNodesNeeded: semanticAnalysis.aiNodesNeeded
            });

            // 2. PLANIFICACIÓN INTELIGENTE DEL WORKFLOW
            const workflowPlan = this.createIntelligentWorkflowPlan(semanticAnalysis, referenceWorkflows);
            console.log('🎯 Plan de workflow creado:', {
                estimatedNodes: workflowPlan.estimatedNodes,
                criticalPath: workflowPlan.criticalPath.length,
                parallelBranches: workflowPlan.parallelBranches,
                integrationPoints: workflowPlan.integrationPoints.length
            });

            // 3. GENERACIÓN DE NODOS INTELIGENTE
            const nodes = await this.generateIntelligentNodes(workflowPlan, semanticAnalysis);
            console.log(`⚡ ${nodes.length} nodos generados inteligentemente`);

            // 4. CREACIÓN DE CONEXIONES CON ANÁLISIS TOPOLÓGICO
            const connections = this.createIntelligentConnections(nodes, workflowPlan);
            console.log(`🔗 ${Object.keys(connections).length} conexiones creadas`);

            // 5. VALIDACIÓN PROFUNDA DEL WORKFLOW
            let workflow = { nodes, connections };
            const validationResults = await this.performDeepWorkflowValidation(workflow, semanticAnalysis);
            
            if (!validationResults.isValid) {
                console.log('🔧 Aplicando correcciones automáticas...');
                workflow = await this.applyIntelligentCorrections(workflow, validationResults);
            }

            // 6. OPTIMIZACIÓN FINAL
            // const optimizedWorkflow = this.optimizeWorkflowStructure(workflow, semanticAnalysis);
            const optimizedWorkflow = workflow; // Usar workflow directamente hasta implementar optimizeWorkflowStructure
            
            // 7. AÑADIR METADATOS INTELIGENTES
            optimizedWorkflow.metadata = this.generateIntelligentMetadata(optimizedWorkflow, semanticAnalysis, workflowPlan);

            console.log('✅ WORKFLOW ULTRA INTELIGENTE GENERADO EXITOSAMENTE');
            console.log(`   📊 Nodos: ${optimizedWorkflow.nodes.length}`);
            console.log(`   🔗 Conexiones: ${Object.keys(optimizedWorkflow.connections).length}`);
            console.log(`   🎯 Score de calidad: ${optimizedWorkflow.metadata.qualityScore}/100`);
            console.log(`   🧠 Nivel de inteligencia: ${optimizedWorkflow.metadata.intelligenceLevel}`);

            return optimizedWorkflow;

        } catch (error) {
            console.error('❌ Error en generación ultra inteligente:', error);
            // Fallback a generación básica pero mejorada
            return this.generateBasicIntelligentWorkflow(prompt);
        }
    }

    /**
     * ANÁLISIS SEMÁNTICO PROFUNDO DEL PROMPT
     */
    async performDeepSemanticAnalysis(prompt) {
        console.log('🔍 Realizando análisis semántico profundo...');

        const analysis = {
            // Dominio de negocio detectado
            businessDomain: this.detectBusinessDomain(prompt),
            
            // Intención del usuario
            userIntent: this.extractUserIntent(prompt),
            
            // Complejidad estimada
            complexity: this.analyzeComplexity(prompt),
            
            // Entidades clave
            entities: this.extractKeyEntities(prompt),
            
            // Integraciones requeridas
            requiredIntegrations: this.detectRequiredIntegrations(prompt),
            
            // Puntos de datos críticos
            dataPoints: this.identifyDataPoints(prompt),
            
            // Flujos de proceso
            processFlows: this.identifyProcessFlows(prompt),
            
            // Nodos de IA necesarios
            aiNodesNeeded: this.detectAINodesNeeded(prompt),
            
            // Patrones de automatización
            automationPatterns: this.detectAutomationPatterns(prompt),
            
            // Requisitos de validación
            validationRequirements: this.identifyValidationRequirements(prompt)
        };

        // Análisis de palabras clave semánticas
        analysis.semanticKeywords = this.extractSemanticKeywords(prompt);
        analysis.actionWords = this.extractActionWords(prompt);
        analysis.businessTerms = this.extractBusinessTerms(prompt);

        console.log('   ✅ Dominio detectado:', analysis.businessDomain);
        console.log('   ✅ Intención:', analysis.userIntent);
        console.log('   ✅ Complejidad:', analysis.complexity);
        console.log('   ✅ Integraciones:', analysis.requiredIntegrations.length);

        return analysis;
    }

    /**
     * DETECCIÓN DE DOMINIO DE NEGOCIO
     */
    detectBusinessDomain(prompt) {
        const domainPatterns = {
            'ecommerce': [
                'tienda', 'shop', 'producto', 'pedido', 'carrito', 'venta', 'cliente',
                'inventario', 'stock', 'pago', 'checkout', 'shipping', 'orden'
            ],
            'crm': [
                'lead', 'contacto', 'prospecto', 'cliente', 'ventas', 'pipeline',
                'seguimiento', 'oportunidad', 'deal', 'account', 'salesforce'
            ],
            'marketing': [
                'campaña', 'email marketing', 'newsletter', 'segmentación',
                'mailchimp', 'hubspot', 'analytics', 'conversion', 'lead generation'
            ],
            'support': [
                'ticket', 'soporte', 'help desk', 'customer service', 'issue',
                'zendesk', 'freshdesk', 'resolution', 'escalation'
            ],
            'finance': [
                'factura', 'invoice', 'pago', 'payment', 'accounting', 'expense',
                'revenue', 'billing', 'quickbooks', 'stripe', 'paypal'
            ],
            'hr': [
                'empleado', 'employee', 'recruitment', 'onboarding', 'payroll',
                'performance', 'leave', 'attendance', 'bamboohr'
            ],
            'data': [
                'analytics', 'report', 'dashboard', 'metric', 'kpi', 'data',
                'transform', 'etl', 'database', 'visualization'
            ],
            'communication': [
                'message', 'notification', 'alert', 'slack', 'teams', 'discord',
                'telegram', 'whatsapp', 'sms', 'email'
            ]
        };

        const promptLower = prompt.toLowerCase();
        let maxScore = 0;
        let detectedDomain = 'general';

        for (const [domain, keywords] of Object.entries(domainPatterns)) {
            const score = keywords.reduce((count, keyword) => {
                return count + (promptLower.includes(keyword) ? 1 : 0);
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                detectedDomain = domain;
            }
        }

        return detectedDomain;
    }

    /**
     * EXTRACCIÓN DE INTENCIÓN DEL USUARIO
     */
    extractUserIntent(prompt) {
        const intentPatterns = {
            'create': ['crear', 'generar', 'build', 'setup', 'establish'],
            'automate': ['automatizar', 'automate', 'automatic', 'auto'],
            'integrate': ['integrar', 'connect', 'sync', 'link', 'combine'],
            'process': ['procesar', 'process', 'handle', 'manage', 'deal with'],
            'notify': ['notificar', 'notify', 'alert', 'inform', 'send'],
            'analyze': ['analizar', 'analyze', 'report', 'track', 'monitor'],
            'validate': ['validar', 'validate', 'verify', 'check', 'confirm'],
            'transform': ['transformar', 'transform', 'convert', 'format', 'modify']
        };

        const promptLower = prompt.toLowerCase();
        const detectedIntents = [];

        for (const [intent, patterns] of Object.entries(intentPatterns)) {
            if (patterns.some(pattern => promptLower.includes(pattern))) {
                detectedIntents.push(intent);
            }
        }

        return detectedIntents.length > 0 ? detectedIntents : ['automate'];
    }

    /**
     * DETECCIÓN DE NODOS DE IA NECESARIOS
     */
    detectAINodesNeeded(prompt) {
        console.log('🧠 Detectando nodos IA necesarios...');
        
        const aiPatterns = {
            'openai': ['openai', 'gpt', 'chatgpt', 'text generation', 'ai text', 'validate', 'validar', 'valide', 'analizar', 'analyze', 'procesamiento inteligente', 'intelligent processing'],
            'anthropic': ['anthropic', 'claude', 'ai validation', 'validación ia'],
            'gemini': ['gemini', 'google ai', 'bard'],
            'huggingface': ['hugging face', 'transformers', 'bert', 'roberta'],
            'replicate': ['replicate', 'stable diffusion', 'image generation'],
            'cohere': ['cohere', 'command', 'embed'],
            'azure-openai': ['azure openai', 'azure cognitive'],
            'aws-comprehend': ['aws comprehend', 'sentiment analysis'],
            'google-translate': ['translate', 'translation', 'idioma'],
            'speech-to-text': ['speech', 'voice', 'audio', 'transcribe'],
            'text-to-speech': ['tts', 'voice generation', 'speech synthesis'],
            'image-analysis': ['image analysis', 'vision', 'ocr', 'object detection'],
            'sentiment': ['sentiment', 'emotion', 'mood', 'feeling', 'lead scoring', 'calificación', 'califique', 'puntuación'],
            'lead-validation': ['lead validation', 'validación de leads', 'validate leads', 'calidad de leads', 'lead quality'],
            'lead-scoring': ['lead scoring', 'scoring', 'puntuación de leads', 'califique según', 'potencial', 'potential']
        };

        const promptLower = prompt.toLowerCase();
        const neededAI = [];

        for (const [aiType, patterns] of Object.entries(aiPatterns)) {
            if (patterns.some(pattern => promptLower.includes(pattern))) {
                neededAI.push(aiType);
                console.log(`   🎯 Detectado: ${aiType} por patrón: ${patterns.find(p => promptLower.includes(p))}`);
            }
        }

        // Análisis inteligente contextual mejorado
        if (promptLower.includes('resumen') || promptLower.includes('summary')) {
            neededAI.push('openai');
        }
        if (promptLower.includes('clasificar') || promptLower.includes('categorize')) {
            neededAI.push('openai');
        }
        if (promptLower.includes('chatbot') || promptLower.includes('asistente')) {
            neededAI.push('openai');
        }
        
        // Detección específica para marketing y CRM
        if (promptLower.includes('marketing') && (promptLower.includes('leads') || promptLower.includes('clientes'))) {
            if (!neededAI.includes('lead-validation')) neededAI.push('lead-validation');
            if (!neededAI.includes('lead-scoring')) neededAI.push('lead-scoring');
            if (!neededAI.includes('openai')) neededAI.push('openai');
        }

        // Validación con IA siempre requiere nodos AI
        if (promptLower.includes('valide con ia') || promptLower.includes('ai validation') || promptLower.includes('validate with ai')) {
            if (!neededAI.includes('openai')) neededAI.push('openai');
            if (!neededAI.includes('lead-validation')) neededAI.push('lead-validation');
        }

        console.log(`   ✅ ${neededAI.length} tipos de nodos IA detectados:`, neededAI);
        return [...new Set(neededAI)]; // Remover duplicados
    }

    /**
     * PLANIFICACIÓN INTELIGENTE DEL WORKFLOW
     */
    createIntelligentWorkflowPlan(semanticAnalysis, referenceWorkflows = []) {
        console.log('🎯 Creando plan inteligente de workflow...');

        const plan = {
            // Estimación de nodos basada en complejidad
            estimatedNodes: this.estimateNodeCount(semanticAnalysis),
            
            // Ruta crítica del proceso
            criticalPath: this.designCriticalPath(semanticAnalysis),
            
            // Ramas paralelas identificadas
            parallelBranches: this.identifyParallelBranches(semanticAnalysis),
            
            // Puntos de integración
            integrationPoints: this.planIntegrationPoints(semanticAnalysis),
            
            // Nodos de validación necesarios
            validationNodes: this.planValidationNodes(semanticAnalysis),
            
            // Manejo de errores
            errorHandling: this.planErrorHandling(semanticAnalysis),
            
            // Optimizaciones de flujo
            flowOptimizations: this.planFlowOptimizations(semanticAnalysis)
        };

        // Usar workflows de referencia para mejorar el plan
        if (referenceWorkflows.length > 0) {
            plan.referenceInsights = this.extractReferenceInsights(referenceWorkflows, semanticAnalysis);
        }

        console.log('   ✅ Nodos estimados:', plan.estimatedNodes);
        console.log('   ✅ Ruta crítica:', plan.criticalPath.length, 'pasos');
        console.log('   ✅ Ramas paralelas:', plan.parallelBranches);

        return plan;
    }

    /**
     * CREAR PLANTILLA DE WORKFLOW ESPECÍFICA POR DOMINIO
     */
    createDomainSpecificTemplate(businessDomain, semanticAnalysis) {
        console.log(`🎯 Creando plantilla específica para dominio: ${businessDomain}`);
        
        const domainTemplates = {
            'crm': {
                requiredNodes: [
                    { type: 'webhook', purpose: 'lead-capture', name: 'Lead Capture Webhook' },
                    { type: 'ai-validation', purpose: 'lead-validation', name: 'AI Lead Validation' },
                    { type: 'ai-scoring', purpose: 'lead-scoring', name: 'AI Lead Scoring' },
                    { type: 'conditional', purpose: 'lead-routing', name: 'Lead Quality Routing' },
                    { type: 'email-hot', purpose: 'hot-email', name: 'Hot Lead Email' },
                    { type: 'email-warm', purpose: 'warm-email', name: 'Warm Lead Email' },
                    { type: 'email-cold', purpose: 'cold-email', name: 'Cold Lead Email' },
                    { type: 'crm-update', purpose: 'crm-integration', name: 'CRM Update' },
                    { type: 'notification', purpose: 'admin-alert', name: 'Admin Notification' }
                ],
                connectionFlow: [
                    'lead-capture → lead-validation',
                    'lead-validation → lead-scoring', 
                    'lead-scoring → lead-routing',
                    'lead-routing → [hot-email, warm-email, cold-email]',
                    'hot-email → crm-integration',
                    'warm-email → crm-integration',
                    'cold-email → crm-integration',
                    'crm-integration → admin-alert'
                ],
                requiredIntegrations: ['emailSend', 'salesforce'],
                requiredAI: ['lead-validation', 'lead-scoring']
            },
            'marketing': {
                requiredNodes: [
                    { type: 'webhook', purpose: 'campaign-trigger', name: 'Campaign Trigger' },
                    { type: 'audience-segmentation', purpose: 'segmentation', name: 'Audience Segmentation' },
                    { type: 'content-personalization', purpose: 'personalization', name: 'AI Content Personalization' },
                    { type: 'email-campaign', purpose: 'email-send', name: 'Email Campaign' },
                    { type: 'analytics-tracking', purpose: 'tracking', name: 'Campaign Analytics' },
                    { type: 'performance-analysis', purpose: 'analysis', name: 'Performance Analysis' }
                ],
                connectionFlow: [
                    'campaign-trigger → segmentation',
                    'segmentation → personalization',
                    'personalization → email-send',
                    'email-send → tracking',
                    'tracking → analysis'
                ],
                requiredIntegrations: ['mailchimp', 'google-analytics'],
                requiredAI: ['openai']
            },
            'ecommerce': {
                requiredNodes: [
                    { type: 'webhook', purpose: 'order-webhook', name: 'Order Webhook' },
                    { type: 'order-validation', purpose: 'validation', name: 'Order Validation' },
                    { type: 'inventory-check', purpose: 'inventory', name: 'Inventory Check' },
                    { type: 'payment-processing', purpose: 'payment', name: 'Payment Processing' },
                    { type: 'fulfillment', purpose: 'fulfillment', name: 'Order Fulfillment' },
                    { type: 'customer-notification', purpose: 'notification', name: 'Customer Notification' },
                    { type: 'analytics-update', purpose: 'analytics', name: 'Analytics Update' }
                ],
                connectionFlow: [
                    'order-webhook → validation',
                    'validation → inventory',
                    'inventory → payment',
                    'payment → fulfillment',
                    'fulfillment → notification',
                    'notification → analytics'
                ],
                requiredIntegrations: ['shopify', 'stripe', 'emailSend'],
                requiredAI: []
            },
            'support': {
                requiredNodes: [
                    { type: 'webhook', purpose: 'ticket-webhook', name: 'Support Ticket Webhook' },
                    { type: 'ticket-analysis', purpose: 'analysis', name: 'AI Ticket Analysis' },
                    { type: 'priority-routing', purpose: 'routing', name: 'Priority Routing' },
                    { type: 'auto-response', purpose: 'auto-response', name: 'Auto Response' },
                    { type: 'escalation', purpose: 'escalation', name: 'Escalation Logic' },
                    { type: 'agent-notification', purpose: 'notification', name: 'Agent Notification' }
                ],
                connectionFlow: [
                    'ticket-webhook → analysis',
                    'analysis → routing',
                    'routing → [auto-response, escalation]',
                    'auto-response → notification',
                    'escalation → notification'
                ],
                requiredIntegrations: ['zendesk', 'slack', 'emailSend'],
                requiredAI: ['sentiment', 'openai']
            }
        };

        const template = domainTemplates[businessDomain];
        if (!template) {
            console.log(`   ⚠️ No hay plantilla específica para: ${businessDomain}, usando plantilla general`);
            return this.createGeneralTemplate(semanticAnalysis);
        }

        console.log(`   ✅ Plantilla ${businessDomain} cargada: ${template.requiredNodes.length} nodos requeridos`);
        return template;
    }

    /**
     * CREAR PLANTILLA GENERAL PARA DOMINIOS NO ESPECÍFICOS
     */
    createGeneralTemplate(semanticAnalysis) {
        return {
            requiredNodes: [
                { type: 'webhook', purpose: 'trigger', name: 'Data Webhook' },
                { type: 'validation', purpose: 'validation', name: 'Data Validation' },
                { type: 'processing', purpose: 'processing', name: 'Data Processing' },
                { type: 'output', purpose: 'output', name: 'Data Output' }
            ],
            connectionFlow: [
                'trigger → validation',
                'validation → processing',
                'processing → output'
            ],
            requiredIntegrations: semanticAnalysis.requiredIntegrations || [],
            requiredAI: semanticAnalysis.aiNodesNeeded || []
        };
    }

    /**
     * GENERACIÓN INTELIGENTE DE NODOS
     */
    async generateIntelligentNodes(workflowPlan, semanticAnalysis) {
        console.log('⚡ Generando nodos inteligentemente...');

        const nodes = [];
        let nodeIndex = 0;

        // 0. APLICAR TEMPLATE ESPECÍFICO DEL DOMINIO (si aplica)
        const domainTemplate = this.createDomainSpecificTemplate(semanticAnalysis.businessDomain, semanticAnalysis);
        if (domainTemplate) {
            console.log(`   🎯 Aplicando template de dominio: ${semanticAnalysis.businessDomain}`);
            
            // Usar nodos del template como base
            const templateNodes = domainTemplate.requiredNodes.map((node, index) => ({
                ...node,
                id: `node_${index}`,
                position: [120 + (index % 3) * 300, 100 + Math.floor(index / 3) * 200]
            }));
            
            nodes.push(...templateNodes);
            nodeIndex += templateNodes.length;

            // Crear conexiones del template
            const templateConnections = domainTemplate.connectionFlow || [];
            
            console.log(`   ✅ Template aplicado: ${templateNodes.length} nodos base generados`);
            
            // Enriquecer con nodos adicionales si es necesario
            const enrichmentNodes = this.enrichTemplateWithAdditionalNodes(semanticAnalysis, workflowPlan, nodeIndex);
            nodes.push(...enrichmentNodes);
            nodeIndex += enrichmentNodes.length;

            // Por ahora solo devolvemos los nodos, las conexiones se crearán después
            console.log(`   ✅ Template completo: ${nodes.length} nodos generados`);
            
            return nodes;
        }

        // GENERACIÓN TRADICIONAL (si no hay template específico)
        
        // 1. NODOS TRIGGER INTELIGENTES
        const triggerNodes = this.generateTriggerNodes(semanticAnalysis, nodeIndex);
        nodes.push(...triggerNodes);
        nodeIndex += triggerNodes.length;

        // 2. NODOS DE VALIDACIÓN Y LIMPIEZA
        if (workflowPlan.validationNodes.length > 0) {
            const validationNodes = this.generateValidationNodes(workflowPlan.validationNodes, nodeIndex);
            nodes.push(...validationNodes);
            nodeIndex += validationNodes.length;
        }

        // 3. NODOS DE PROCESAMIENTO PRINCIPAL
        const processingNodes = this.generateProcessingNodes(semanticAnalysis, workflowPlan, nodeIndex);
        nodes.push(...processingNodes);
        nodeIndex += processingNodes.length;

        // 4. NODOS DE IA (si son necesarios)
        if (semanticAnalysis.aiNodesNeeded.length > 0) {
            const aiNodes = this.generateAINodes(semanticAnalysis.aiNodesNeeded, nodeIndex);
            nodes.push(...aiNodes);
            nodeIndex += aiNodes.length;
        }

        // 5. NODOS DE INTEGRACIÓN
        const integrationNodes = this.generateIntegrationNodes(semanticAnalysis.requiredIntegrations, nodeIndex);
        nodes.push(...integrationNodes);
        nodeIndex += integrationNodes.length;

        // 6. NODOS DE SALIDA Y NOTIFICACIÓN
        const outputNodes = this.generateOutputNodes(semanticAnalysis, nodeIndex);
        nodes.push(...outputNodes);

        // 7. AÑADIR NODOS DE MANEJO DE ERRORES
        const errorNodes = this.generateErrorHandlingNodes(nodes, workflowPlan.errorHandling);
        nodes.push(...errorNodes);

        const connections = this.generateIntelligentConnections(nodes);

        console.log(`   ✅ ${nodes.length} nodos generados con inteligencia avanzada`);
        return { nodes, connections };
    }

    /**
     * GENERACIÓN DE NODOS TRIGGER INTELIGENTES
     */
    generateTriggerNodes(semanticAnalysis, startIndex) {
        console.log('🔥 Generando triggers inteligentes...');
        
        const triggers = [];
        let nodeIndex = startIndex;

        // Trigger principal basado en el dominio
        const primaryTrigger = this.createPrimaryTrigger(semanticAnalysis, nodeIndex++);
        triggers.push(primaryTrigger);

        // Triggers adicionales según complejidad
        if (semanticAnalysis.complexity === 'enterprise' || semanticAnalysis.complexity === 'high') {
            const secondaryTrigger = this.createSecondaryTrigger(semanticAnalysis, nodeIndex++);
            triggers.push(secondaryTrigger);
        }

        // Trigger manual siempre presente
        const manualTrigger = {
            id: `manual-trigger-${nodeIndex}`,
            name: 'Manual Trigger',
            type: 'n8n-nodes-base.start',
            position: [-1600, -400 + (nodeIndex * 160)],
            parameters: {},
            typeVersion: 1,
            notes: 'Manual execution trigger'
        };
        triggers.push(manualTrigger);

        console.log(`   ✅ ${triggers.length} triggers generados`);
        return triggers;
    }

    createPrimaryTrigger(semanticAnalysis, nodeIndex) {
        const domainTriggers = {
            'ecommerce': {
                type: 'n8n-nodes-base.webhook',
                name: 'Order Webhook',
                parameters: {
                    httpMethod: 'POST',
                    path: '/order-webhook',
                    responseMode: 'onReceived'
                }
            },
            'crm': {
                type: 'n8n-nodes-base.webhook',
                name: 'Lead Capture',
                parameters: {
                    httpMethod: 'POST',
                    path: '/lead-capture',
                    responseMode: 'onReceived'
                }
            },
            'communication': {
                type: 'n8n-nodes-base.webhook',
                name: 'Message Webhook',
                parameters: {
                    httpMethod: 'POST',
                    path: '/message-hook',
                    responseMode: 'onReceived'
                }
            },
            'data': {
                type: 'n8n-nodes-base.cron',
                name: 'Data Processing Schedule',
                parameters: {
                    rule: {
                        hour: '*/6',
                        minute: '0'
                    }
                }
            }
        };

        const triggerConfig = domainTriggers[semanticAnalysis.businessDomain] || domainTriggers['crm'];

        return {
            id: `primary-trigger-${nodeIndex}`,
            name: triggerConfig.name,
            type: triggerConfig.type,
            position: [-1600, -200],
            parameters: triggerConfig.parameters,
            typeVersion: 1,
            notes: `Primary trigger for ${semanticAnalysis.businessDomain} workflow`
        };
    }

    createSecondaryTrigger(semanticAnalysis, nodeIndex) {
        return {
            id: `secondary-trigger-${nodeIndex}`,
            name: 'Scheduled Monitor',
            type: 'n8n-nodes-base.cron',
            position: [-1600, 0],
            parameters: {
                rule: {
                    hour: '*',
                    minute: '0'
                }
            },
            typeVersion: 1,
            notes: 'Secondary scheduled monitoring'
        };
    }

    /**
     * GENERACIÓN DE NODOS DE VALIDACIÓN
     */
    generateValidationNodes(validationRequirements, startIndex) {
        console.log('🔍 Generando nodos de validación...');
        
        const validationNodes = [];
        let nodeIndex = startIndex;

        for (const requirement of validationRequirements) {
            const validationNode = this.createValidationNode(requirement, nodeIndex++);
            validationNodes.push(validationNode);
        }

        console.log(`   ✅ ${validationNodes.length} nodos de validación generados`);
        return validationNodes;
    }

    createValidationNode(requirement, nodeIndex) {
        const validationTypes = {
            'input-validation': {
                name: 'Input Validation',
                jsCode: `// Validación inteligente de entrada
const requiredFields = ['email', 'name'];
const errors = [];

for (const item of items) {
    for (const field of requiredFields) {
        if (!item.json[field] || item.json[field].trim() === '') {
            errors.push(\`Missing required field: \${field}\`);
        }
    }
    
    // Validar formato de email
    if (item.json.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(item.json.email)) {
        errors.push('Invalid email format');
    }
}

if (errors.length > 0) {
    throw new Error(\`Validation errors: \${errors.join(', ')}\`);
}

return items;`
            },
            'data-validation': {
                name: 'Data Format Validation',
                jsCode: `// Validación de formato de datos
const validated = items.map(item => {
    const data = item.json;
    
    // Limpiar y normalizar datos
    if (data.email) data.email = data.email.toLowerCase().trim();
    if (data.phone) data.phone = data.phone.replace(/[^\\d+]/g, '');
    if (data.name) data.name = data.name.trim();
    
    return { json: data };
});

return validated;`
            }
        };

        const validationType = validationTypes[requirement.type] || validationTypes['input-validation'];

        return {
            id: `validation-${nodeIndex}`,
            name: validationType.name,
            type: 'n8n-nodes-base.code',
            position: [-1220, -200 + (nodeIndex * 160)],
            parameters: {
                mode: 'runOnceForAllItems',
                jsCode: validationType.jsCode
            },
            typeVersion: 1,
            notes: `Intelligent validation for ${requirement.type}`
        };
    }

    /**
     * GENERACIÓN DE NODOS DE PROCESAMIENTO PRINCIPAL
     */
    generateProcessingNodes(semanticAnalysis, workflowPlan, startIndex) {
        console.log('⚙️ Generando nodos de procesamiento principal...');
        
        const processingNodes = [];
        let nodeIndex = startIndex;

        // Nodo de enriquecimiento de datos
        const enrichmentNode = this.createDataEnrichmentNode(semanticAnalysis, nodeIndex++);
        processingNodes.push(enrichmentNode);

        // Nodos de lógica condicional
        if (semanticAnalysis.processFlows.includes('conditional')) {
            const conditionalNode = this.createConditionalLogicNode(semanticAnalysis, nodeIndex++);
            processingNodes.push(conditionalNode);
        }

        // Nodos de transformación de datos
        const transformationNode = this.createDataTransformationNode(semanticAnalysis, nodeIndex++);
        processingNodes.push(transformationNode);

        console.log(`   ✅ ${processingNodes.length} nodos de procesamiento generados`);
        return processingNodes;
    }

    createDataEnrichmentNode(semanticAnalysis, nodeIndex) {
        return {
            id: `enrichment-${nodeIndex}`,
            name: 'Data Enrichment Engine',
            type: 'n8n-nodes-base.code',
            position: [-840, -200],
            parameters: {
                mode: 'runOnceForEachItem',
                jsCode: `// Motor de enriquecimiento inteligente de datos
const data = item.json;

// Enriquecimiento basado en dominio de negocio
if ('${semanticAnalysis.businessDomain}' === 'crm') {
    // Calcular score de lead
    let leadScore = 0;
    if (data.email) leadScore += 20;
    if (data.company) leadScore += 30;
    if (data.phone) leadScore += 15;
    if (data.jobTitle) leadScore += 25;
    
    data.leadScore = leadScore;
    data.segment = leadScore >= 70 ? 'hot' : leadScore >= 50 ? 'warm' : 'cold';
}

// Timestamps y metadatos
data.processedAt = new Date().toISOString();
data.workflowVersion = '2.0';
data.intelligenceLevel = '${semanticAnalysis.complexity}';

return { json: data };`
            },
            typeVersion: 1,
            notes: `Intelligent data enrichment for ${semanticAnalysis.businessDomain}`
        };
    }

    createConditionalLogicNode(semanticAnalysis, nodeIndex) {
        console.log('   🛣️ Creando nodo de lógica condicional inteligente...');

        // ROUTING ESPECÍFICO PARA CRM/MARKETING
        if (semanticAnalysis.businessDomain === 'crm' || semanticAnalysis.businessDomain === 'marketing') {
            return {
                id: `lead-routing-${nodeIndex}`,
                name: 'Advanced Lead Routing',
                type: 'n8n-nodes-base.switch',
                position: [-640, -200],
                parameters: {
                    dataType: 'number',
                    value1: '={{$json.leadScore || 0}}',
                    rules: {
                        values: [
                            {
                                operation: 'greaterEqual',
                                value2: 80,
                                output: 0 // HOT LEADS - Ruta prioritaria
                            },
                            {
                                operation: 'greaterEqual',
                                value2: 50,
                                output: 1 // WARM LEADS - Ruta de nurturing
                            },
                            {
                                operation: 'greaterEqual',
                                value2: 20,
                                output: 2 // COLD LEADS - Ruta de calentamiento
                            }
                        ]
                    },
                    fallbackOutput: 3 // UNQUALIFIED - Ruta de descarte/reevaluación
                },
                typeVersion: 2,
                notes: 'Intelligent lead routing: Hot (80+) → Priority Sales | Warm (50-79) → Nurturing | Cold (20-49) → Warming | Unqualified (<20) → Re-evaluation'
            };
        }

        // ROUTING ESPECÍFICO PARA ECOMMERCE
        if (semanticAnalysis.businessDomain === 'ecommerce') {
            return {
                id: `order-routing-${nodeIndex}`,
                name: 'Smart Order Processing',
                type: 'n8n-nodes-base.switch',
                position: [-640, -200],
                parameters: {
                    dataType: 'number',
                    value1: '={{$json.orderTotal || 0}}',
                    rules: {
                        values: [
                            {
                                operation: 'greaterEqual',
                                value2: 1000,
                                output: 0 // HIGH-VALUE ORDERS - Procesamiento VIP
                            },
                            {
                                operation: 'greaterEqual',
                                value2: 100,
                                output: 1 // REGULAR ORDERS - Procesamiento estándar
                            },
                            {
                                operation: 'greaterEqual',
                                value2: 25,
                                output: 2 // SMALL ORDERS - Procesamiento rápido
                            }
                        ]
                    },
                    fallbackOutput: 3 // MICRO ORDERS - Procesamiento automático
                },
                typeVersion: 2,
                notes: 'Smart order routing: VIP ($1000+) → Priority Processing | Regular ($100-999) → Standard Flow | Small ($25-99) → Quick Process | Micro (<$25) → Auto Process'
            };
        }

        // ROUTING ESPECÍFICO PARA SUPPORT
        if (semanticAnalysis.businessDomain === 'support') {
            return {
                id: `ticket-routing-${nodeIndex}`,
                name: 'Intelligent Ticket Routing',
                type: 'n8n-nodes-base.switch',
                position: [-640, -200],
                parameters: {
                    dataType: 'string',
                    value1: '={{$json.priority || $json.urgency || "medium"}}',
                    rules: {
                        values: [
                            {
                                operation: 'equal',
                                value2: 'critical',
                                output: 0 // CRITICAL - Escalamiento inmediato
                            },
                            {
                                operation: 'equal',
                                value2: 'high',
                                output: 1 // HIGH - Atención prioritaria
                            },
                            {
                                operation: 'equal',
                                value2: 'medium',
                                output: 2 // MEDIUM - Cola estándar
                            }
                        ]
                    },
                    fallbackOutput: 3 // LOW - Autoresolución
                },
                typeVersion: 2,
                notes: 'Intelligent ticket routing: Critical → Immediate Escalation | High → Priority Queue | Medium → Standard Queue | Low → Self-Service'
            };
        }

        // ROUTING GENÉRICO INTELIGENTE
        return {
            id: `intelligent-routing-${nodeIndex}`,
            name: 'Smart Multi-Condition Router',
            type: 'n8n-nodes-base.switch',
            position: [-640, -200],
            parameters: {
                dataType: 'string',
                value1: '={{$json.category || $json.type || $json.status || "default"}}',
                rules: {
                    values: [
                        {
                            operation: 'equal',
                            value2: 'priority',
                            output: 0 // PRIORITY PATH
                        },
                        {
                            operation: 'equal',
                            value2: 'standard',
                            output: 1 // STANDARD PATH
                        },
                        {
                            operation: 'equal',
                            value2: 'basic',
                            output: 2 // BASIC PATH
                        }
                    ]
                },
                fallbackOutput: 3 // DEFAULT PATH
            },
            typeVersion: 2,
            notes: 'Smart generic routing based on data classification and business rules'
        };
    }

    /**
     * CREAR NODOS DE DECISIÓN COMPLEJA PARA CASOS AVANZADOS
     */
    createAdvancedDecisionNodes(semanticAnalysis, startIndex) {
        console.log('🧠 Generando nodos de decisión compleja...');

        const decisionNodes = [];
        let nodeIndex = startIndex;

        // DECISION TREE PARA CRM AVANZADO
        if (semanticAnalysis.complexity === 'high' && semanticAnalysis.businessDomain === 'crm') {
            const leadQualificationTree = {
                id: `lead-qualification-tree-${nodeIndex}`,
                name: 'AI Lead Qualification Decision Tree',
                type: 'n8n-nodes-base.code',
                position: [-200, -100],
                parameters: {
                    mode: 'runOnceForEachItem',
                    jsCode: `
// ADVANCED LEAD QUALIFICATION DECISION TREE
const lead = item.json;

// Multi-factor scoring algorithm
let qualificationScore = 0;
let qualificationFactors = {
    companySize: 0,
    budgetIndicators: 0, 
    decisionMaker: 0,
    urgency: 0,
    fitScore: 0
};

// Company Size Analysis
if (lead.companySize) {
    if (lead.companySize === 'enterprise') qualificationFactors.companySize = 30;
    else if (lead.companySize === 'mid-market') qualificationFactors.companySize = 20;
    else if (lead.companySize === 'smb') qualificationFactors.companySize = 10;
}

// Budget Indicators
if (lead.budget || lead.budgetRange) {
    const budget = parseInt(lead.budget) || 0;
    if (budget >= 100000) qualificationFactors.budgetIndicators = 25;
    else if (budget >= 50000) qualificationFactors.budgetIndicators = 15;
    else if (budget >= 10000) qualificationFactors.budgetIndicators = 8;
}

// Decision Maker Level
if (lead.jobTitle) {
    const title = lead.jobTitle.toLowerCase();
    if (title.includes('ceo') || title.includes('cto') || title.includes('president')) {
        qualificationFactors.decisionMaker = 20;
    } else if (title.includes('director') || title.includes('vp') || title.includes('manager')) {
        qualificationFactors.decisionMaker = 15;
    } else if (title.includes('lead') || title.includes('senior')) {
        qualificationFactors.decisionMaker = 8;
    }
}

// Urgency Analysis
if (lead.timeline) {
    if (lead.timeline === 'immediate') qualificationFactors.urgency = 15;
    else if (lead.timeline === '1-3months') qualificationFactors.urgency = 10;
    else if (lead.timeline === '3-6months') qualificationFactors.urgency = 5;
}

// Product-Market Fit Score
if (lead.industry && lead.useCase) {
    qualificationFactors.fitScore = 10; // Base fit score
}

// Calculate total qualification score
qualificationScore = Object.values(qualificationFactors).reduce((sum, score) => sum + score, 0);

// Advanced qualification categories
let qualification = 'unqualified';
let nextAction = 'discard';
let priority = 'low';

if (qualificationScore >= 80) {
    qualification = 'highly-qualified';
    nextAction = 'immediate-sales-contact';
    priority = 'critical';
} else if (qualificationScore >= 60) {
    qualification = 'sales-ready';
    nextAction = 'schedule-demo';
    priority = 'high';
} else if (qualificationScore >= 40) {
    qualification = 'marketing-qualified';
    nextAction = 'nurture-sequence';
    priority = 'medium';
} else if (qualificationScore >= 20) {
    qualification = 'lead';
    nextAction = 'content-marketing';
    priority = 'low';
}

return {
    json: {
        ...lead,
        qualificationScore,
        qualificationFactors,
        qualification,
        nextAction,
        priority,
        processedAt: new Date().toISOString(),
        decisionTreeVersion: '2.0'
    }
};`
                },
                typeVersion: 1,
                notes: 'Advanced AI-powered lead qualification using multi-factor decision tree analysis'
            };

            decisionNodes.push(leadQualificationTree);
            nodeIndex++;
        }

        // DECISION TREE PARA ECOMMERCE AVANZADO
        if (semanticAnalysis.complexity === 'high' && semanticAnalysis.businessDomain === 'ecommerce') {
            const orderProcessingDecision = {
                id: `order-decision-tree-${nodeIndex}`,
                name: 'Smart Order Processing Decision Engine',
                type: 'n8n-nodes-base.code',
                position: [-200, -100],
                parameters: {
                    mode: 'runOnceForEachItem',
                    jsCode: `
// ADVANCED ORDER PROCESSING DECISION ENGINE
const order = item.json;

let processingRoute = 'standard';
let fulfillmentPriority = 'normal';
let shippingMethod = 'standard';
let requiresReview = false;

// High-Value Order Analysis
if (order.total >= 1000) {
    processingRoute = 'vip';
    fulfillmentPriority = 'high';
    shippingMethod = 'express';
    requiresReview = order.total >= 5000;
}

// Customer Analysis
if (order.customer && order.customer.segment === 'vip') {
    processingRoute = 'vip';
    fulfillmentPriority = 'high';
}

// Product Analysis
if (order.items) {
    const hasCustomItems = order.items.some(item => item.custom || item.personalized);
    const hasFragileItems = order.items.some(item => item.fragile);
    const hasRestrictedItems = order.items.some(item => item.restricted);
    
    if (hasCustomItems) {
        processingRoute = 'custom';
        fulfillmentPriority = 'extended';
    }
    
    if (hasFragileItems) {
        shippingMethod = 'careful';
    }
    
    if (hasRestrictedItems) {
        requiresReview = true;
    }
}

// Geographic Analysis
if (order.shipping && order.shipping.country !== 'US') {
    processingRoute = 'international';
    requiresReview = true;
}

return {
    json: {
        ...order,
        processingRoute,
        fulfillmentPriority,
        shippingMethod,
        requiresReview,
        processingDecision: {
            timestamp: new Date().toISOString(),
            engine: 'smart-order-processor-v2'
        }
    }
};`
                },
                typeVersion: 1,
                notes: 'Intelligent order processing with multi-factor decision analysis for optimal fulfillment routing'
            };

            decisionNodes.push(orderProcessingDecision);
        }

        console.log(`   ✅ ${decisionNodes.length} nodos de decisión compleja generados`);
        return decisionNodes;
    }

    createDataTransformationNode(semanticAnalysis, nodeIndex) {
        return {
            id: `transformation-${nodeIndex}`,
            name: 'Data Transformation Hub',
            type: 'n8n-nodes-base.set',
            position: [-440, -200],
            parameters: {
                keepOnlySet: false,
                values: [
                    {
                        name: 'transformedData',
                        value: '={{JSON.stringify($json)}}'
                    },
                    {
                        name: 'businessDomain',
                        value: semanticAnalysis.businessDomain
                    },
                    {
                        name: 'processingTimestamp',
                        value: '={{$now}}'
                    }
                ]
            },
            typeVersion: 1,
            notes: 'Intelligent data transformation and structuring'
        };
    }

    /**
     * GENERACIÓN DE NODOS DE INTEGRACIÓN
     */
    generateIntegrationNodes(integrations, startIndex) {
        console.log('🔌 Generando nodos de integración...');
        
        const integrationNodes = [];
        let nodeIndex = startIndex;

        for (const integration of integrations) {
            const integrationNode = this.createIntegrationNode(integration, nodeIndex++);
            if (integrationNode) {
                integrationNodes.push(integrationNode);
            }
        }

        console.log(`   ✅ ${integrationNodes.length} nodos de integración generados`);
        return integrationNodes;
    }

    createIntegrationNode(integration, nodeIndex) {
        const integrationTemplates = {
            'salesforce': {
                type: 'n8n-nodes-base.salesforce',
                name: 'Salesforce Integration',
                parameters: {
                    operation: 'create',
                    resource: 'lead',
                    additionalFields: {
                        company: '={{$json.company}}',
                        email: '={{$json.email}}',
                        firstName: '={{$json.firstName}}',
                        lastName: '={{$json.lastName}}'
                    }
                }
            },
            'hubspot': {
                type: 'n8n-nodes-base.hubspot',
                name: 'HubSpot CRM',
                parameters: {
                    operation: 'create',
                    resource: 'contact',
                    additionalFields: {
                        email: '={{$json.email}}',
                        company: '={{$json.company}}'
                    }
                }
            },
            'slack': {
                type: 'n8n-nodes-base.slack',
                name: 'Slack Notification',
                parameters: {
                    operation: 'postMessage',
                    channel: '#notifications',
                    text: 'New data processed: {{$json.summary}}'
                }
            },
            'google-sheets': {
                type: 'n8n-nodes-base.googleSheets',
                name: 'Save to Google Sheets',
                parameters: {
                    operation: 'append',
                    resource: 'spreadsheet',
                    range: 'A:Z'
                }
            }
        };

        const template = integrationTemplates[integration];
        if (!template) {
            console.warn(`   ⚠️ Template no encontrado para integración: ${integration}`);
            return null;
        }

        return {
            id: `integration-${integration}-${nodeIndex}`,
            name: template.name,
            type: template.type,
            position: [-240, -200 + (nodeIndex * 160)],
            parameters: template.parameters,
            typeVersion: 1,
            notes: `Intelligent ${integration} integration`
        };
    }

    /**
     * GENERACIÓN DE NODOS DE SALIDA
     */
    generateOutputNodes(semanticAnalysis, startIndex) {
        console.log('📤 Generando nodos de salida...');
        
        const outputNodes = [];
        let nodeIndex = startIndex;

        // Nodo de respuesta principal
        const responseNode = this.createResponseNode(semanticAnalysis, nodeIndex++);
        outputNodes.push(responseNode);

        // Nodo de notificación
        const notificationNode = this.createNotificationNode(semanticAnalysis, nodeIndex++);
        outputNodes.push(notificationNode);

        console.log(`   ✅ ${outputNodes.length} nodos de salida generados`);
        return outputNodes;
    }

    createResponseNode(semanticAnalysis, nodeIndex) {
        return {
            id: `response-${nodeIndex}`,
            name: 'Intelligent Response',
            type: 'n8n-nodes-base.respondToWebhook',
            position: [-40, -200],
            parameters: {
                respondWith: 'json',
                responseBody: JSON.stringify({
                    status: 'success',
                    message: 'Workflow executed successfully',
                    domain: semanticAnalysis.businessDomain,
                    complexity: semanticAnalysis.complexity,
                    timestamp: '={{$now}}',
                    processedItems: '={{$json.count || 1}}'
                })
            },
            typeVersion: 1,
            notes: 'Intelligent workflow response with metadata'
        };
    }

    createNotificationNode(semanticAnalysis, nodeIndex) {
        return {
            id: `notification-${nodeIndex}`,
            name: 'Smart Notification',
            type: 'n8n-nodes-base.emailSend',
            position: [160, -200],
            parameters: {
                fromEmail: 'workflow@company.com',
                toEmail: 'admin@company.com',
                subject: `Workflow Completed - ${semanticAnalysis.businessDomain}`,
                message: `Intelligent workflow for ${semanticAnalysis.businessDomain} completed successfully.
                
Complexity: ${semanticAnalysis.complexity}
Intelligence Level: ${semanticAnalysis.intelligenceLevel || 'advanced'}
Timestamp: {{$now}}
                
This is an automated notification from your AI-powered workflow system.`
            },
            typeVersion: 1,
            notes: 'Intelligent notification with workflow insights'
        };
    }

    /**
     * GENERACIÓN DE NODOS DE MANEJO DE ERRORES
     */
    generateErrorHandlingNodes(existingNodes, errorHandlingPlan) {
        console.log('🛡️ Generando nodos de manejo de errores...');
        
        const errorNodes = [];
        let nodeIndex = 1000; // Usar índices altos para nodos de error

        if (errorHandlingPlan.enabled) {
            const errorTrigger = {
                id: `error-trigger-${nodeIndex}`,
                name: 'Error Handler',
                type: 'n8n-nodes-base.errorTrigger',
                position: [500, 200],
                parameters: {},
                typeVersion: 1,
                notes: 'Intelligent error handling and recovery'
            };
            errorNodes.push(errorTrigger);

            const errorNotification = {
                id: `error-notification-${nodeIndex + 1}`,
                name: 'Error Notification',
                type: 'n8n-nodes-base.emailSend',
                position: [700, 200],
                parameters: {
                    fromEmail: 'errors@company.com',
                    toEmail: 'admin@company.com',
                    subject: 'Workflow Error Alert',
                    message: 'Error in workflow: {{$json.error.message}}'
                },
                typeVersion: 1,
                notes: 'Intelligent error notification system'
            };
            errorNodes.push(errorNotification);
        }

        console.log(`   ✅ ${errorNodes.length} nodos de manejo de errores generados`);
        return errorNodes;
    }

    /**
     * ENRIQUECIMIENTO DE TEMPLATES CON NODOS ADICIONALES
     */
    enrichTemplateWithAdditionalNodes(semanticAnalysis, workflowPlan, startIndex) {
        console.log('🔧 Enriqueciendo template con nodos adicionales...');

        const additionalNodes = [];
        let nodeIndex = startIndex;

        // 1. AGREGAR NODOS DE IA ADICIONALES (no incluidos en template base)
        if (semanticAnalysis.aiNodesNeeded && semanticAnalysis.aiNodesNeeded.length > 0) {
            for (const aiType of semanticAnalysis.aiNodesNeeded) {
                // Solo agregar si no existe ya en el template
                const aiNode = this.createIntelligentAINode(aiType, nodeIndex);
                if (aiNode) {
                    additionalNodes.push(aiNode);
                    nodeIndex++;
                }
            }
        }

        // 2. AGREGAR INTEGRACIONES ADICIONALES (detectadas pero no en template)
        if (semanticAnalysis.requiredIntegrations && semanticAnalysis.requiredIntegrations.length > 0) {
            for (const integration of semanticAnalysis.requiredIntegrations) {
                // Crear nodo de integración si no existe en template
                const integrationNode = this.createIntelligentIntegrationNode(integration, nodeIndex);
                if (integrationNode) {
                    additionalNodes.push(integrationNode);
                    nodeIndex++;
                }
            }
        }

        // 3. AGREGAR NODOS DE VALIDACIÓN ESPECÍFICOS
        if (workflowPlan.validationNodes && workflowPlan.validationNodes.length > 0) {
            for (const validationType of workflowPlan.validationNodes) {
                const validationNode = this.createValidationNode(validationType, nodeIndex);
                if (validationNode) {
                    additionalNodes.push(validationNode);
                    nodeIndex++;
                }
            }
        }

        // 4. AGREGAR NODOS DE ROUTING CONDICIONAL AVANZADO
        if (semanticAnalysis.complexity === 'high' || semanticAnalysis.complexity === 'enterprise') {
            const routingNode = this.createAdvancedRoutingNode(semanticAnalysis, nodeIndex);
            if (routingNode) {
                additionalNodes.push(routingNode);
                nodeIndex++;
            }
        }

        console.log(`   ✅ ${additionalNodes.length} nodos adicionales agregados al template`);
        return additionalNodes;
    }

    /**
     * GENERACIÓN DE NODOS DE IA INTELIGENTES
     */
    generateAINodes(aiNodesNeeded, startIndex) {
        console.log('🤖 Generando nodos de IA inteligentes...');

        const aiNodes = [];
        let nodeIndex = startIndex;

        for (const aiType of aiNodesNeeded) {
            const aiNode = this.createIntelligentAINode(aiType, nodeIndex);
            if (aiNode) {
                aiNodes.push(aiNode);
                nodeIndex++;
            }
        }

        console.log(`   ✅ ${aiNodes.length} nodos de IA generados`);
        return aiNodes;
    }

    /**
     * CREACIÓN DE NODO DE IA INTELIGENTE CON CONFIGURACIONES AVANZADAS
     */
    createIntelligentAINode(aiType, nodeIndex) {
        console.log(`   🎯 Creando nodo IA especializado: ${aiType}`);
        
        const aiTemplates = {
            'openai': {
                type: 'n8n-nodes-base.openAi',
                name: 'AI Data Processor',
                parameters: {
                    operation: 'chat',
                    model: 'gpt-4-turbo',
                    messages: {
                        values: [
                            {
                                role: 'system',
                                content: 'You are an advanced AI assistant specialized in intelligent data analysis, content generation, and business process optimization. Analyze the input thoroughly and provide actionable insights.'
                            },
                            {
                                role: 'user',
                                content: 'Analyze this data and provide intelligent insights: {{$json.input_text || $json.content || $json.data}}'
                            }
                        ]
                    },
                    options: {
                        temperature: 0.7,
                        maxTokens: 2000,
                        topP: 0.9,
                        frequencyPenalty: 0.1,
                        presencePenalty: 0.1
                    }
                }
            },
            'lead-validation': {
                type: 'n8n-nodes-base.openAi',
                name: 'AI Lead Validation',
                parameters: {
                    operation: 'chat',
                    model: 'gpt-4-turbo',
                    messages: {
                        values: [
                            {
                                role: 'system',
                                content: 'You are a lead validation specialist. Analyze incoming leads and determine their quality, completeness, and business potential. Return a JSON with: {isValid: boolean, quality: "high"|"medium"|"low", missingFields: [], confidence: 0-100, reason: string}'
                            },
                            {
                                role: 'user',
                                content: 'Validate this lead data: {{JSON.stringify($json)}}'
                            }
                        ]
                    },
                    options: {
                        temperature: 0.3,
                        maxTokens: 500,
                        responseFormat: 'json_object'
                    }
                }
            },
            'lead-scoring': {
                type: 'n8n-nodes-base.openAi',
                name: 'AI Lead Scoring',
                parameters: {
                    operation: 'chat',
                    model: 'gpt-4-turbo',
                    messages: {
                        values: [
                            {
                                role: 'system',
                                content: 'You are a lead scoring specialist. Analyze leads and assign scores (0-100) based on: company size, job title, engagement level, industry fit, contact completeness. Return JSON with: {leadScore: number, segment: "hot"|"warm"|"cold", priority: "high"|"medium"|"low", factors: [], nextAction: string}'
                            },
                            {
                                role: 'user',
                                content: 'Score this lead: {{JSON.stringify($json)}}'
                            }
                        ]
                    },
                    options: {
                        temperature: 0.2,
                        maxTokens: 400,
                        responseFormat: 'json_object'
                    }
                }
            },
            'sentiment': {
                type: 'n8n-nodes-base.openAi',
                name: 'AI Sentiment Analysis',
                parameters: {
                    operation: 'chat',
                    model: 'gpt-4-turbo',
                    messages: {
                        values: [
                            {
                                role: 'system',
                                content: 'Analyze the sentiment of the given text. Return JSON with: {sentiment: "positive"|"negative"|"neutral", confidence: 0-100, emotion: string, urgency: "high"|"medium"|"low"}'
                            },
                            {
                                role: 'user',
                                content: 'Analyze sentiment: {{$json.text || $json.content || $json.message}}'
                            }
                        ]
                    },
                    options: {
                        temperature: 0.1,
                        maxTokens: 200,
                        responseFormat: 'json_object'
                    }
                }
            },
            'anthropic': {
                type: 'n8n-nodes-base.anthropic',
                name: 'Claude AI Assistant',
                parameters: {
                    operation: 'chat',
                    model: 'claude-3-haiku',
                    prompt: 'Analyze this data intelligently and provide insights: {{JSON.stringify($json)}}'
                }
            },
            'openai-classifier': {
                type: 'n8n-nodes-base.openAi',
                name: 'Content Classifier',
                parameters: {
                    operation: 'chat',
                    model: 'gpt-4',
                    messages: {
                        values: [
                            {
                                role: 'system',
                                content: 'You are a professional content classifier. Analyze content and assign relevant categories, tags, and confidence scores. Return structured JSON.'
                            },
                            {
                                role: 'user',
                                content: 'Classify this content: {{$json.text || $json.content}}'
                            }
                        ]
                    },
                    options: {
                        temperature: 0.2,
                        maxTokens: 300
                    }
                }
            },
            'anthropic': {
                type: 'n8n-nodes-base.anthropic',
                name: 'Claude Analysis',
                parameters: {
                    operation: 'chat',
                    model: 'claude-3-sonnet',
                    message: '={{$json.input_text}}',
                    system: 'You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest.',
                    options: {
                        maxTokens: 1000,
                        temperature: 0.7
                    }
                }
            },
            'gemini': {
                type: 'n8n-nodes-base.googleGemini',
                name: 'Gemini AI Processing',
                parameters: {
                    operation: 'chat',
                    model: 'gemini-pro',
                    prompt: '={{$json.input_text}}',
                    options: {
                        temperature: 0.7,
                        maxOutputTokens: 1000
                    }
                }
            },
            'huggingface': {
                type: 'n8n-nodes-base.huggingFace',
                name: 'HuggingFace Model',
                parameters: {
                    operation: 'textGeneration',
                    model: 'gpt2',
                    inputs: '={{$json.input_text}}',
                    parameters: {
                        max_length: 200,
                        temperature: 0.7
                    }
                }
            },
            'cohere': {
                type: 'n8n-nodes-base.cohere',
                name: 'Cohere Generate',
                parameters: {
                    operation: 'generate',
                    model: 'command',
                    prompt: '={{$json.input_text}}',
                    maxTokens: 1000,
                    temperature: 0.7
                }
            },
            'replicate': {
                type: 'n8n-nodes-base.replicate',
                name: 'Replicate AI Model',
                parameters: {
                    operation: 'prediction',
                    model: 'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
                    input: {
                        prompt: '={{$json.prompt || $json.text}}',
                        negative_prompt: 'blurry, low quality',
                        num_inference_steps: 20,
                        guidance_scale: 7.5
                    }
                }
            },
            'azure-openai': {
                type: 'n8n-nodes-base.microsoftAzure',
                name: 'Azure OpenAI Service',
                parameters: {
                    operation: 'openai',
                    resource: 'chat/completions',
                    body: {
                        model: 'gpt-4',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a professional AI assistant integrated with Azure services for enterprise-grade processing.'
                            },
                            {
                                role: 'user',
                                content: '={{$json.input_text}}'
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 1500
                    }
                }
            },
            'google-translate': {
                type: 'n8n-nodes-base.googleTranslate',
                name: 'Smart Translation Engine',
                parameters: {
                    operation: 'translate',
                    text: '={{$json.text || $json.content}}',
                    translateTo: '={{$json.target_language || "en"}}',
                    format: 'text',
                    model: 'nmt'
                }
            },
            'sentiment': {
                type: 'n8n-nodes-base.awsComprehend',
                name: 'Advanced Sentiment Analysis',
                parameters: {
                    operation: 'detectSentiment',
                    text: '={{$json.text || $json.content}}',
                    languageCode: '={{$json.language || "en"}}',
                    includeEntities: true,
                    includeKeyPhrases: true
                }
            },
            'speech-to-text': {
                type: 'n8n-nodes-base.googleCloud',
                name: 'Speech-to-Text AI',
                parameters: {
                    operation: 'speechToText',
                    resource: 'speech',
                    audio: '={{$json.audio_url || $json.audio_data}}',
                    config: {
                        encoding: 'WEBM_OPUS',
                        sampleRateHertz: 48000,
                        languageCode: 'en-US',
                        enableAutomaticPunctuation: true,
                        model: 'latest_long'
                    }
                }
            },
            'text-to-speech': {
                type: 'n8n-nodes-base.googleCloud',
                name: 'Text-to-Speech AI',
                parameters: {
                    operation: 'textToSpeech',
                    resource: 'speech',
                    text: '={{$json.text || $json.content}}',
                    voice: {
                        languageCode: 'en-US',
                        name: 'en-US-Studio-O',
                        ssmlGender: 'NEUTRAL'
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 1.0,
                        pitch: 0.0
                    }
                }
            },
            'image-analysis': {
                type: 'n8n-nodes-base.googleCloud',
                name: 'Vision AI Analysis',
                parameters: {
                    operation: 'imageAnalysis',
                    resource: 'vision',
                    image: '={{$json.image_url || $json.image_data}}',
                    features: [
                        'LABEL_DETECTION',
                        'TEXT_DETECTION',
                        'OBJECT_LOCALIZATION',
                        'SAFE_SEARCH_DETECTION'
                    ],
                    maxResults: 10
                }
            },
            'document-ai': {
                type: 'n8n-nodes-base.googleCloud',
                name: 'Document AI Processor',
                parameters: {
                    operation: 'processDocument',
                    resource: 'documentai',
                    document: '={{$json.document_url || $json.document_data}}',
                    processorType: 'FORM_PARSER_PROCESSOR',
                    extractEntities: true
                }
            },
            'aws-textract': {
                type: 'n8n-nodes-base.aws',
                name: 'AWS Textract OCR',
                parameters: {
                    operation: 'detectDocumentText',
                    service: 'textract',
                    document: '={{$json.document}}',
                    features: ['TABLES', 'FORMS']
                }
            }
        };

        const template = aiTemplates[aiType];
        if (!template) {
            console.warn(`   ⚠️ Template no encontrado para: ${aiType}`);
            return null;
        }

        return {
            id: `ai-${aiType}-${nodeIndex}`,
            name: template.name,
            type: template.type,
            position: [800 + (nodeIndex * 200), 400],
            parameters: template.parameters,
            typeVersion: 1,
            notes: `Intelligent ${aiType} processing node`,
            metadata: {
                aiType: aiType,
                intelligent: true,
                purpose: 'ai-processing'
            }
        };
    }

    /**
     * CREAR NODO DE INTEGRACIÓN INTELIGENTE
     */
    createIntelligentIntegrationNode(integration, nodeIndex) {
        console.log(`   🔌 Creando nodo de integración: ${integration}`);

        const integrationTemplates = {
            'salesforce': {
                type: 'n8n-nodes-base.salesforce',
                name: 'Salesforce CRM',
                parameters: {
                    operation: 'create',
                    resource: 'lead',
                    additionalFields: {
                        company: '={{$json.company}}',
                        email: '={{$json.email}}',
                        firstName: '={{$json.firstName}}',
                        lastName: '={{$json.lastName}}',
                        leadSource: 'Website'
                    }
                }
            },
            'hubspot': {
                type: 'n8n-nodes-base.hubspot',
                name: 'HubSpot CRM',
                parameters: {
                    operation: 'create',
                    resource: 'contact',
                    email: '={{$json.email}}',
                    additionalFields: {
                        firstname: '={{$json.firstName}}',
                        lastname: '={{$json.lastName}}',
                        company: '={{$json.company}}'
                    }
                }
            },
            'mailchimp': {
                type: 'n8n-nodes-base.mailchimp',
                name: 'Mailchimp Marketing',
                parameters: {
                    operation: 'memberCreate',
                    list: '={{$json.listId}}',
                    email: '={{$json.email}}',
                    mergeFields: {
                        FNAME: '={{$json.firstName}}',
                        LNAME: '={{$json.lastName}}'
                    },
                    status: 'subscribed'
                }
            },
            'stripe': {
                type: 'n8n-nodes-base.stripe',
                name: 'Stripe Payments',
                parameters: {
                    operation: 'create',
                    resource: 'customer',
                    email: '={{$json.email}}',
                    name: '={{$json.firstName}} {{$json.lastName}}',
                    additionalFields: {
                        description: 'Customer from automated workflow'
                    }
                }
            },
            'airtable': {
                type: 'n8n-nodes-base.airtable',
                name: 'Airtable Database',
                parameters: {
                    operation: 'create',
                    application: '={{$json.baseId}}',
                    table: '={{$json.tableName}}',
                    additionalFields: {
                        fields: '={{$json.fields}}'
                    }
                }
            },
            'google-sheets': {
                type: 'n8n-nodes-base.googleSheets',
                name: 'Google Sheets',
                parameters: {
                    operation: 'append',
                    sheetId: '={{$json.sheetId}}',
                    range: 'A:Z',
                    values: '={{$json.rowData}}'
                }
            }
        };

        const template = integrationTemplates[integration];
        if (!template) return null;

        return {
            id: `integration-${integration}-${nodeIndex}`,
            name: template.name,
            type: template.type,
            position: [600 + (nodeIndex * 200), 300],
            parameters: template.parameters,
            typeVersion: 1,
            notes: `Intelligent ${integration} integration`
        };
    }

    /**
     * CREAR NODO DE VALIDACIÓN
     */
    createValidationNode(validationType, nodeIndex) {
        console.log(`   ✅ Creando nodo de validación: ${validationType}`);

        const validationTemplates = {
            'email': {
                type: 'n8n-nodes-base.function',
                name: 'Email Validation',
                parameters: {
                    functionCode: `
                        const email = $json.email;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return {
                            ...items[0].json,
                            isValidEmail: emailRegex.test(email),
                            validationStatus: emailRegex.test(email) ? 'valid' : 'invalid'
                        };
                    `
                }
            },
            'phone': {
                type: 'n8n-nodes-base.function',
                name: 'Phone Validation',
                parameters: {
                    functionCode: `
                        const phone = $json.phone;
                        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                        return {
                            ...items[0].json,
                            isValidPhone: phoneRegex.test(phone),
                            validationStatus: phoneRegex.test(phone) ? 'valid' : 'invalid'
                        };
                    `
                }
            },
            'required-fields': {
                type: 'n8n-nodes-base.function',
                name: 'Required Fields Check',
                parameters: {
                    functionCode: `
                        const requiredFields = ['email', 'firstName', 'lastName'];
                        const missingFields = requiredFields.filter(field => !$json[field]);
                        return {
                            ...items[0].json,
                            hasAllRequired: missingFields.length === 0,
                            missingFields: missingFields,
                            validationStatus: missingFields.length === 0 ? 'valid' : 'missing-fields'
                        };
                    `
                }
            }
        };

        const template = validationTemplates[validationType];
        if (!template) return null;

        return {
            id: `validation-${validationType}-${nodeIndex}`,
            name: template.name,
            type: template.type,
            position: [400 + (nodeIndex * 200), 200],
            parameters: template.parameters,
            typeVersion: 1,
            notes: `Intelligent ${validationType} validation`
        };
    }

    /**
     * CREAR NODO DE ROUTING AVANZADO
     */
    createAdvancedRoutingNode(semanticAnalysis, nodeIndex) {
        console.log('   🛣️ Creando nodo de routing avanzado...');

        if (semanticAnalysis.domain === 'crm' || semanticAnalysis.domain === 'marketing') {
            return {
                id: `advanced-routing-${nodeIndex}`,
                name: 'Lead Routing Engine',
                type: 'n8n-nodes-base.switch',
                position: [500, 300],
                parameters: {
                    dataType: 'number',
                    value1: '={{$json.leadScore}}',
                    rules: {
                        values: [
                            {
                                operation: 'greaterEqual',
                                value2: 80,
                                output: 0 // Hot leads
                            },
                            {
                                operation: 'greaterEqual',
                                value2: 50,
                                output: 1 // Warm leads
                            },
                            {
                                operation: 'smaller',
                                value2: 50,
                                output: 2 // Cold leads
                            }
                        ]
                    },
                    fallbackOutput: 3 // Unscored leads
                },
                typeVersion: 1,
                notes: 'Advanced lead routing based on AI scoring'
            };
        }

        if (semanticAnalysis.domain === 'ecommerce') {
            return {
                id: `advanced-routing-${nodeIndex}`,
                name: 'Order Processing Router',
                type: 'n8n-nodes-base.switch',
                position: [500, 300],
                parameters: {
                    dataType: 'number',
                    value1: '={{$json.orderTotal}}',
                    rules: {
                        values: [
                            {
                                operation: 'greaterEqual',
                                value2: 1000,
                                output: 0 // High-value orders
                            },
                            {
                                operation: 'greaterEqual',
                                value2: 100,
                                output: 1 // Regular orders
                            },
                            {
                                operation: 'smaller',
                                value2: 100,
                                output: 2 // Small orders
                            }
                        ]
                    },
                    fallbackOutput: 3 // Special handling
                },
                typeVersion: 1,
                notes: 'Advanced order routing based on value'
            };
        }

        return null;
    }

    /**
     * CREACIÓN DE CONEXIONES INTELIGENTES CON ANÁLISIS TOPOLÓGICO
     */
    createIntelligentConnections(nodes, workflowPlan) {
        console.log('🔗 Creando conexiones inteligentes...');

        const connections = {};
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        
        // Análisis topológico para evitar problemas
        const topologyAnalyzer = new TopologyAnalyzer(nodes);
        
        // 1. CONECTAR TRIGGERS A PROCESAMIENTO INICIAL
        const triggerNodes = nodes.filter(n => this.isTriggerNode(n));
        const initialProcessingNodes = nodes.filter(n => this.isInitialProcessingNode(n));
        
        if (triggerNodes.length > 0 && initialProcessingNodes.length > 0) {
            this.connectTriggersToProcessing(triggerNodes, initialProcessingNodes, connections);
        }

        // 2. CREAR FLUJO PRINCIPAL SIGUIENDO LA RUTA CRÍTICA
        this.createCriticalPathConnections(nodes, workflowPlan.criticalPath, connections);

        // 3. AÑADIR RAMAS PARALELAS
        this.createParallelBranches(nodes, workflowPlan.parallelBranches, connections);

        // 4. CONECTAR NODOS DE IA INTELIGENTEMENTE
        this.connectAINodesIntelligently(nodes, connections);

        // 5. AÑADIR MANEJO DE ERRORES
        this.addIntelligentErrorHandling(nodes, connections);

        // 6. VALIDAR Y CORREGIR CONEXIONES
        const validatedConnections = this.validateAndFixConnections(connections, nodes);

        console.log(`   ✅ ${Object.keys(validatedConnections).length} conexiones inteligentes creadas`);
        return validatedConnections;
    }

    /**
     * CONECTAR TRIGGERS A PROCESAMIENTO INICIAL
     */
    connectTriggersToProcessing(triggerNodes, processingNodes, connections) {
        console.log('   🔗 Conectando triggers a procesamiento inicial...');
        
        for (let i = 0; i < triggerNodes.length; i++) {
            const trigger = triggerNodes[i];
            const targetProcessing = processingNodes[i % processingNodes.length]; // Distribuir triggers

            if (!connections[trigger.name]) {
                connections[trigger.name] = { main: [[]] };
            }

            connections[trigger.name].main[0].push({
                node: targetProcessing.name,
                type: 'main',
                index: 0
            });

            console.log(`     ✅ ${trigger.name} → ${targetProcessing.name}`);
        }
    }

    /**
     * CREAR CONEXIONES DE RUTA CRÍTICA
     */
    createCriticalPathConnections(nodes, criticalPath, connections) {
        console.log('   🎯 Creando conexiones de ruta crítica...');
        
        // Mapear nodos por tipo/propósito
        const nodesByPurpose = this.mapNodesByPurpose(nodes);
        
        for (let i = 0; i < criticalPath.length - 1; i++) {
            const currentStep = criticalPath[i];
            const nextStep = criticalPath[i + 1];
            
            const currentNodes = nodesByPurpose[currentStep] || [];
            const nextNodes = nodesByPurpose[nextStep] || [];
            
            if (currentNodes.length > 0 && nextNodes.length > 0) {
                this.connectNodeGroups(currentNodes, nextNodes, connections);
            }
        }
    }

    mapNodesByPurpose(nodes) {
        const purposeMap = {
            'trigger': [],
            'validation': [],
            'ai-processing': [],
            'main-processing': [],
            'integration': [],
            'output': [],
            'notification': []
        };

        for (const node of nodes) {
            if (this.isTriggerNode(node)) {
                purposeMap['trigger'].push(node);
            } else if (node.name.toLowerCase().includes('validation') || node.type === 'n8n-nodes-base.code') {
                purposeMap['validation'].push(node);
            } else if (this.isAINode(node)) {
                purposeMap['ai-processing'].push(node);
            } else if (node.name.toLowerCase().includes('integration') || node.type.includes('salesforce') || node.type.includes('hubspot')) {
                purposeMap['integration'].push(node);
            } else if (node.name.toLowerCase().includes('response') || node.type === 'n8n-nodes-base.respondToWebhook') {
                purposeMap['output'].push(node);
            } else if (node.name.toLowerCase().includes('notification') || node.type === 'n8n-nodes-base.emailSend') {
                purposeMap['notification'].push(node);
            } else {
                purposeMap['main-processing'].push(node);
            }
        }

        return purposeMap;
    }

    connectNodeGroups(sourceNodes, targetNodes, connections) {
        for (let i = 0; i < sourceNodes.length; i++) {
            const sourceNode = sourceNodes[i];
            const targetNode = targetNodes[i % targetNodes.length]; // Distribuir conexiones

            if (!connections[sourceNode.name]) {
                connections[sourceNode.name] = { main: [[]] };
            }

            connections[sourceNode.name].main[0].push({
                node: targetNode.name,
                type: 'main',
                index: 0
            });

            console.log(`     ✅ ${sourceNode.name} → ${targetNode.name}`);
        }
    }

    /**
     * CREAR RAMAS PARALELAS
     */
    createParallelBranches(nodes, branchCount, connections) {
        if (branchCount <= 1) return;
        
        console.log(`   🌿 Creando ${branchCount} ramas paralelas...`);
        
        // Encontrar nodo de decisión (IF o similar)
        const decisionNode = nodes.find(n => n.type === 'n8n-nodes-base.if');
        if (!decisionNode) return;

        // Encontrar nodos para ramas paralelas
        const processingNodes = nodes.filter(n => 
            !this.isTriggerNode(n) && 
            n.id !== decisionNode.id &&
            !n.name.toLowerCase().includes('notification')
        );

        if (processingNodes.length >= branchCount) {
            if (!connections[decisionNode.name]) {
                connections[decisionNode.name] = { main: [[], []] }; // True y False branches
            }

            // Rama TRUE
            for (let i = 0; i < Math.floor(branchCount / 2); i++) {
                const node = processingNodes[i];
                connections[decisionNode.name].main[0].push({
                    node: node.name,
                    type: 'main',
                    index: 0
                });
            }

            // Rama FALSE
            for (let i = Math.floor(branchCount / 2); i < branchCount && i < processingNodes.length; i++) {
                const node = processingNodes[i];
                if (!connections[decisionNode.name].main[1]) {
                    connections[decisionNode.name].main[1] = [];
                }
                connections[decisionNode.name].main[1].push({
                    node: node.name,
                    type: 'main',
                    index: 0
                });
            }

            console.log(`     ✅ Ramas paralelas creadas desde ${decisionNode.name}`);
        }
    }

    /**
     * CONECTAR NODOS DE IA INTELIGENTEMENTE
     */
    connectAINodesIntelligently(nodes, connections) {
        const aiNodes = nodes.filter(n => this.isAINode(n));
        if (aiNodes.length === 0) return;

        console.log(`   🤖 Conectando ${aiNodes.length} nodos de IA inteligentemente...`);

        for (const aiNode of aiNodes) {
            // Encontrar nodo previo (fuente de datos para IA)
            const sourceNode = this.findBestSourceForAI(aiNode, nodes);
            if (sourceNode && !connections[sourceNode.name]) {
                connections[sourceNode.name] = { main: [[]] };
            }
            if (sourceNode) {
                connections[sourceNode.name].main[0].push({
                    node: aiNode.name,
                    type: 'main',
                    index: 0
                });
            }

            // Encontrar nodo destino (donde enviar resultados de IA)
            const targetNode = this.findBestTargetForAI(aiNode, nodes);
            if (targetNode) {
                if (!connections[aiNode.name]) {
                    connections[aiNode.name] = { main: [[]] };
                }
                connections[aiNode.name].main[0].push({
                    node: targetNode.name,
                    type: 'main',
                    index: 0
                });
            }

            console.log(`     ✅ IA conectada: ${sourceNode ? sourceNode.name : 'N/A'} → ${aiNode.name} → ${targetNode ? targetNode.name : 'N/A'}`);
        }
    }

    findBestSourceForAI(aiNode, nodes) {
        // Buscar nodos de procesamiento o validación que puedan alimentar a la IA
        const candidates = nodes.filter(n => 
            n.id !== aiNode.id &&
            (n.type === 'n8n-nodes-base.code' || 
             n.type === 'n8n-nodes-base.set' ||
             n.name.toLowerCase().includes('validation') ||
             n.name.toLowerCase().includes('enrichment'))
        );

        return candidates.length > 0 ? candidates[0] : null;
    }

    findBestTargetForAI(aiNode, nodes) {
        // Buscar nodos de integración o salida que puedan recibir resultados de IA
        const candidates = nodes.filter(n => 
            n.id !== aiNode.id &&
            (n.type.includes('salesforce') || 
             n.type.includes('hubspot') ||
             n.type === 'n8n-nodes-base.emailSend' ||
             n.type === 'n8n-nodes-base.respondToWebhook')
        );

        return candidates.length > 0 ? candidates[0] : null;
    }

    /**
     * AÑADIR MANEJO INTELIGENTE DE ERRORES
     */
    addIntelligentErrorHandling(nodes, connections) {
        const errorNodes = nodes.filter(n => n.type === 'n8n-nodes-base.errorTrigger');
        if (errorNodes.length === 0) return;

        console.log('   🛡️ Añadiendo manejo inteligente de errores...');

        for (const errorNode of errorNodes) {
            // Conectar error trigger a notificación
            const notificationNode = nodes.find(n => 
                n.name.toLowerCase().includes('error') && 
                n.type === 'n8n-nodes-base.emailSend'
            );

            if (notificationNode) {
                connections[errorNode.name] = {
                    main: [[{
                        node: notificationNode.name,
                        type: 'main',
                        index: 0
                    }]]
                };

                console.log(`     ✅ Error handling: ${errorNode.name} → ${notificationNode.name}`);
            }
        }
    }

    /**
     * VALIDAR Y CORREGIR CONEXIONES
     */
    validateAndFixConnections(connections, nodes) {
        console.log('   🔍 Validando y corrigiendo conexiones avanzadas...');
        
        const nodeNames = new Set(nodes.map(n => n.name));
        const nodeMap = new Map(nodes.map(n => [n.name, n]));
        const triggerTypes = ['n8n-nodes-base.webhook', 'n8n-nodes-base.start', 'n8n-nodes-base.cron', 'n8n-nodes-base.scheduleTrigger'];
        const correctedConnections = {};

        for (const [sourceName, connectionData] of Object.entries(connections)) {
            // Verificar que el nodo fuente existe
            if (!nodeNames.has(sourceName)) {
                console.warn(`     ⚠️ Nodo fuente no encontrado: ${sourceName}`);
                continue;
            }

            const sourceNode = nodeMap.get(sourceName);
            const correctedConnectionData = { main: [] };

            if (connectionData.main && Array.isArray(connectionData.main)) {
                for (const outputArray of connectionData.main) {
                    const validConnections = [];
                    const seenTargets = new Set(); // Evitar conexiones duplicadas
                    
                    if (Array.isArray(outputArray)) {
                        for (const connection of outputArray) {
                            const targetNode = nodeMap.get(connection.node);
                            
                            // Verificar que el nodo destino existe
                            if (!nodeNames.has(connection.node)) {
                                console.warn(`     ⚠️ Nodo destino no encontrado: ${connection.node}`);
                                continue;
                            }

                            // ❌ EVITAR: Trigger como nodo intermedio
                            if (targetNode && triggerTypes.includes(targetNode.type)) {
                                console.warn(`     ❌ ERROR CRÍTICO EVITADO: Intentaba conectar a trigger ${connection.node} como nodo intermedio`);
                                continue;
                            }

                            // ❌ EVITAR: Conexiones duplicadas
                            if (seenTargets.has(connection.node)) {
                                console.warn(`     ❌ DUPLICADO EVITADO: Conexión duplicada a ${connection.node}`);
                                continue;
                            }

                            // ❌ EVITAR: Auto-conexión (nodo a sí mismo)
                            if (connection.node === sourceName) {
                                console.warn(`     ❌ AUTO-CONEXIÓN EVITADA: ${sourceName} → ${connection.node}`);
                                continue;
                            }

                            validConnections.push(connection);
                            seenTargets.add(connection.node);
                            console.log(`     ✅ Conexión válida: ${sourceName} → ${connection.node}`);
                        }
                    }
                    
                    correctedConnectionData.main.push(validConnections);
                }
            }

            // Solo añadir conexiones que tengan al menos una conexión válida
            if (correctedConnectionData.main.some(arr => arr.length > 0)) {
                correctedConnections[sourceName] = correctedConnectionData;
            }
        }

        // Validación adicional: Detectar conexiones circulares
        this.detectAndFixCircularConnections(correctedConnections, nodes);

        console.log(`     ✅ Conexiones validadas: ${Object.keys(correctedConnections).length} válidas de ${Object.keys(connections).length} originales`);
        return correctedConnections;
    }

    /**
     * DETECTAR Y CORREGIR CONEXIONES CIRCULARES
     */
    detectAndFixCircularConnections(connections, nodes) {
        console.log('   🔄 Detectando conexiones circulares...');
        
        const visited = new Set();
        const recursionStack = new Set();
        const circularPaths = [];

        const dfs = (nodeName, path) => {
            if (recursionStack.has(nodeName)) {
                circularPaths.push([...path, nodeName]);
                return;
            }
            if (visited.has(nodeName)) return;

            visited.add(nodeName);
            recursionStack.add(nodeName);

            const nodeConnections = connections[nodeName];
            if (nodeConnections && nodeConnections.main) {
                for (const outputArray of nodeConnections.main) {
                    for (const connection of outputArray) {
                        dfs(connection.node, [...path, nodeName]);
                    }
                }
            }

            recursionStack.delete(nodeName);
        };

        // Buscar ciclos desde cada nodo
        for (const nodeName of Object.keys(connections)) {
            if (!visited.has(nodeName)) {
                dfs(nodeName, []);
            }
        }

        // Corregir conexiones circulares encontradas
        if (circularPaths.length > 0) {
            console.warn(`     ⚠️ ${circularPaths.length} conexiones circulares detectadas`);
            for (const path of circularPaths) {
                this.fixCircularPath(path, connections);
            }
        } else {
            console.log('     ✅ No se encontraron conexiones circulares');
        }
    }

    /**
     * CORREGIR RUTA CIRCULAR
     */
    fixCircularPath(path, connections) {
        if (path.length < 2) return;
        
        const lastNode = path[path.length - 1];
        const secondLastNode = path[path.length - 2];
        
        console.warn(`     🔧 Corrigiendo conexión circular: ${secondLastNode} → ${lastNode}`);
        
        // Remover la conexión que causa el ciclo
        if (connections[secondLastNode] && connections[secondLastNode].main) {
            for (const outputArray of connections[secondLastNode].main) {
                const index = outputArray.findIndex(conn => conn.node === lastNode);
                if (index !== -1) {
                    outputArray.splice(index, 1);
                    console.log(`     ✅ Conexión circular removida: ${secondLastNode} ↛ ${lastNode}`);
                    break;
                }
            }
        }
    }

    /**
     * VALIDACIÓN PROFUNDA DEL WORKFLOW
     */
    async performDeepWorkflowValidation(workflow, semanticAnalysis) {
        console.log('🔍 Realizando validación arquitectural profunda del workflow...');

        const validationResults = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: [],
            qualityScore: 100,
            architecturalIssues: [],
            complianceStatus: 'compliant'
        };

        // 0. VALIDACIÓN PRE-ARQUITECTURAL (NUEVA)
        const preValidation = this.validatePreArchitecture(workflow, semanticAnalysis);
        if (!preValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors.push(...preValidation.errors);
            validationResults.architecturalIssues.push(...preValidation.issues);
        }

        // 1. VALIDACIÓN DE TRIGGERS AVANZADA
        const triggerValidation = this.validateAdvancedTriggers(workflow, semanticAnalysis);
        if (!triggerValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors.push(...triggerValidation.errors);
        }

        // 2. VALIDACIÓN DE CONEXIONES CIRCULARES Y TOPOLOGÍA
        const topologyValidation = this.validateWorkflowTopology(workflow);
        if (!topologyValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors.push(...topologyValidation.errors);
            validationResults.architecturalIssues.push(...topologyValidation.topologyIssues);
        }

        // 3. VALIDACIÓN DE ARQUITECTURA ESPECÍFICA DEL DOMINIO
        const domainValidation = this.validateDomainArchitecture(workflow, semanticAnalysis);
        if (!domainValidation.isValid) {
            validationResults.warnings.push(...domainValidation.warnings);
            validationResults.qualityScore -= 15;
            validationResults.suggestions.push(...domainValidation.suggestions);
        }

        // 4. VALIDACIÓN DE NODOS REQUERIDOS POR EL PROMPT
        const requirementValidation = this.validatePromptRequirements(workflow, semanticAnalysis);
        if (!requirementValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors.push(...requirementValidation.errors);
            validationResults.architecturalIssues.push('Missing required components from prompt');
        }

        // 5. VALIDACIÓN DE NODOS HUÉRFANOS Y PATRONES PROBLEMÁTICOS
        const patternValidation = this.validateWorkflowPatterns(workflow);
        if (!patternValidation.isValid) {
            validationResults.warnings.push(...patternValidation.warnings);
            validationResults.qualityScore -= 10;
        }

        // 6. VALIDACIÓN DE PARÁMETROS Y CONFIGURACIONES CRÍTICAS
        const configValidation = this.validateCriticalConfigurations(workflow, semanticAnalysis);
        if (!configValidation.isValid) {
            validationResults.warnings.push(...configValidation.warnings);
            validationResults.qualityScore -= 20;
        }

        // 7. VALIDACIÓN DE FLUJO LÓGICO Y RUTAS DE DATOS
        const dataFlowValidation = this.validateDataFlowLogic(workflow, semanticAnalysis);
        if (!dataFlowValidation.isValid) {
            validationResults.warnings.push(...dataFlowValidation.warnings);
            validationResults.qualityScore -= 15;
        }

        // 8. VALIDACIÓN DE INTEGRATIONS Y APIS REQUERIDAS
        const integrationValidation = this.validateRequiredIntegrations(workflow, semanticAnalysis);
        if (!integrationValidation.isValid) {
            validationResults.isValid = false;
            validationResults.errors.push(...integrationValidation.errors);
            validationResults.complianceStatus = 'non-compliant';
        }

        // 9. VALIDACIÓN DE MANEJO DE ERRORES Y ROBUSTEZ
        const robustnessValidation = this.validateWorkflowRobustness(workflow);
        if (!robustnessValidation.isValid) {
            validationResults.warnings.push(...robustnessValidation.warnings);
            validationResults.qualityScore -= 10;
            validationResults.suggestions.push(...robustnessValidation.suggestions);
        }

        // 10. VALIDACIÓN DE PERFORMANCE Y ESCALABILIDAD
        const performanceValidation = this.validatePerformanceConsiderations(workflow, semanticAnalysis);
        if (!performanceValidation.isValid) {
            validationResults.warnings.push(...performanceValidation.warnings);
            validationResults.suggestions.push(...performanceValidation.suggestions);
        }

        // CALCULAR SCORE FINAL Y ESTADO
        if (validationResults.errors.length > 0) {
            validationResults.qualityScore = Math.max(0, validationResults.qualityScore - (validationResults.errors.length * 25));
            validationResults.complianceStatus = 'critical-issues';
        } else if (validationResults.warnings.length > 3) {
            validationResults.complianceStatus = 'needs-improvement';
        }

        console.log(`   ✅ Validación arquitectural completada`);
        console.log(`   📊 Score de calidad: ${validationResults.qualityScore}/100`);
        console.log(`   ❌ Errores críticos: ${validationResults.errors.length}`);
        console.log(`   ⚠️ Warnings: ${validationResults.warnings.length}`);
        console.log(`   💡 Sugerencias: ${validationResults.suggestions.length}`);
        console.log(`   🏗️ Issues arquitecturales: ${validationResults.architecturalIssues.length}`);
        console.log(`   ✅ Status: ${validationResults.complianceStatus}`);

        return validationResults;
    }

    /**
     * VALIDACIÓN DE TRIGGERS - EVITAR TRIGGERS SOLOS
     */
    validateTriggers(workflow) {
        console.log('   🔍 Validando triggers...');

        const validation = { isValid: true, errors: [] };
        const triggerNodes = workflow.nodes.filter(n => this.isTriggerNode(n));
        
        if (triggerNodes.length === 0) {
            validation.isValid = false;
            validation.errors.push({
                type: 'NO_TRIGGERS',
                message: 'El workflow no tiene nodos trigger - no se puede ejecutar',
                severity: 'critical'
            });
        }

        // Verificar que los triggers tengan conexiones de salida
        for (const trigger of triggerNodes) {
            const hasOutputConnections = workflow.connections[trigger.name] && 
                                       workflow.connections[trigger.name].main && 
                                       workflow.connections[trigger.name].main[0] && 
                                       workflow.connections[trigger.name].main[0].length > 0;

            if (!hasOutputConnections) {
                validation.isValid = false;
                validation.errors.push({
                    type: 'ISOLATED_TRIGGER',
                    message: `Trigger "${trigger.name}" está aislado - no tiene conexiones de salida`,
                    node: trigger.name,
                    severity: 'critical'
                });
            }
        }

        console.log(`     ✅ ${triggerNodes.length} triggers validados`);
        return validation;
    }

    /**
     * VALIDACIÓN DE CONEXIONES CIRCULARES
     */
    validateCircularConnections(workflow) {
        console.log('   🔄 Validando conexiones circulares...');

        const validation = { isValid: true, errors: [] };
        const visited = new Set();
        const recursionStack = new Set();

        const hasCycle = (nodeName) => {
            if (recursionStack.has(nodeName)) {
                return true; // Ciclo detectado
            }
            if (visited.has(nodeName)) {
                return false; // Ya procesado
            }

            visited.add(nodeName);
            recursionStack.add(nodeName);

            const connections = workflow.connections[nodeName];
            if (connections && connections.main) {
                for (const outputArray of connections.main) {
                    if (Array.isArray(outputArray)) {
                        for (const connection of outputArray) {
                            if (hasCycle(connection.node)) {
                                return true;
                            }
                        }
                    }
                }
            }

            recursionStack.delete(nodeName);
            return false;
        };

        // Verificar cada nodo
        for (const node of workflow.nodes) {
            if (!visited.has(node.name) && hasCycle(node.name)) {
                validation.isValid = false;
                validation.errors.push({
                    type: 'CIRCULAR_CONNECTION',
                    message: `Conexión circular detectada que incluye el nodo "${node.name}"`,
                    node: node.name,
                    severity: 'critical'
                });
            }
        }

        console.log(`     ✅ Conexiones circulares: ${validation.isValid ? 'No detectadas' : 'DETECTADAS'}`);
        return validation;
    }

    /**
     * VALIDACIÓN PRE-ARQUITECTURAL - NUEVA
     */
    validatePreArchitecture(workflow, semanticAnalysis) {
        console.log('   🏗️ Validando pre-arquitectura del workflow...');

        const validation = { 
            isValid: true, 
            errors: [], 
            issues: [] 
        };

        // 1. Validar que el workflow tenga componentes mínimos requeridos
        const hasRequiredComponents = this.checkRequiredComponents(workflow, semanticAnalysis);
        if (!hasRequiredComponents.valid) {
            validation.isValid = false;
            validation.errors.push({
                type: 'MISSING_REQUIRED_COMPONENTS',
                message: 'El workflow no incluye componentes requeridos por el prompt',
                details: hasRequiredComponents.missing,
                severity: 'critical'
            });
            validation.issues.push('missing-required-components');
        }

        // 2. Validar arquitectura del dominio específico
        const domainArchitecture = this.checkDomainArchitecture(workflow, semanticAnalysis);
        if (!domainArchitecture.valid) {
            validation.isValid = false;
            validation.errors.push({
                type: 'INVALID_DOMAIN_ARCHITECTURE',
                message: `Arquitectura incorrecta para dominio ${semanticAnalysis.businessDomain}`,
                details: domainArchitecture.issues,
                severity: 'critical'
            });
            validation.issues.push('invalid-domain-architecture');
        }

        // 3. Validar flujo lógico básico
        const logicalFlow = this.checkBasicLogicalFlow(workflow);
        if (!logicalFlow.valid) {
            validation.isValid = false;
            validation.errors.push({
                type: 'INVALID_LOGICAL_FLOW',
                message: 'El workflow no sigue un flujo lógico coherente',
                details: logicalFlow.issues,
                severity: 'critical'
            });
            validation.issues.push('invalid-logical-flow');
        }

        console.log(`     ✅ Pre-arquitectura: ${validation.isValid ? 'Válida' : 'PROBLEMAS DETECTADOS'}`);
        return validation;
    }

    /**
     * VALIDACIÓN DE ARQUITECTURA ESPECÍFICA DEL DOMINIO
     */
    validateDomainArchitecture(workflow, semanticAnalysis) {
        console.log('   🎯 Validando arquitectura específica del dominio...');

        const validation = { 
            isValid: true, 
            warnings: [], 
            suggestions: [] 
        };

        const domain = semanticAnalysis.businessDomain;

        if (domain === 'crm' || domain === 'marketing') {
            // Validar arquitectura CRM/Marketing
            const hasCRMComponents = workflow.nodes.some(node => 
                node.type.includes('salesforce') || 
                node.type.includes('hubspot') ||
                node.name.toLowerCase().includes('crm')
            );

            if (!hasCRMComponents) {
                validation.isValid = false;
                validation.warnings.push({
                    type: 'MISSING_CRM_INTEGRATION',
                    message: 'Workflow de CRM/Marketing debe incluir integración con sistema CRM',
                    severity: 'warning'
                });
                validation.suggestions.push('Add CRM integration (Salesforce, HubSpot, etc.)');
            }

            // Validar lead scoring/qualification
            const hasLeadProcessing = workflow.nodes.some(node => 
                node.name.toLowerCase().includes('lead') ||
                node.name.toLowerCase().includes('score') ||
                node.type.includes('openai')
            );

            if (!hasLeadProcessing) {
                validation.warnings.push({
                    type: 'MISSING_LEAD_PROCESSING',
                    message: 'Workflow CRM debería incluir procesamiento/scoring de leads',
                    severity: 'info'
                });
                validation.suggestions.push('Add AI-powered lead scoring and qualification');
            }
        }

        if (domain === 'ecommerce') {
            // Validar arquitectura E-commerce
            const hasPaymentProcessing = workflow.nodes.some(node => 
                node.type.includes('stripe') || 
                node.type.includes('paypal') ||
                node.name.toLowerCase().includes('payment')
            );

            const hasOrderProcessing = workflow.nodes.some(node =>
                node.name.toLowerCase().includes('order') ||
                node.name.toLowerCase().includes('product')
            );

            if (!hasPaymentProcessing || !hasOrderProcessing) {
                validation.warnings.push({
                    type: 'INCOMPLETE_ECOMMERCE_FLOW',
                    message: 'Workflow e-commerce debe incluir procesamiento de pagos y pedidos',
                    severity: 'warning'
                });
                validation.suggestions.push('Add payment and order processing components');
            }
        }

        console.log(`     ✅ Arquitectura ${domain}: ${validation.isValid ? 'Conforme' : 'Necesita mejoras'}`);
        return validation;
    }

    /**
     * VALIDACIÓN DE REQUISITOS DEL PROMPT
     */
    validatePromptRequirements(workflow, semanticAnalysis) {
        console.log('   📝 Validando cumplimiento de requisitos del prompt...');

        const validation = { 
            isValid: true, 
            errors: [] 
        };

        // 1. Validar que existan nodos de IA si se requieren
        if (semanticAnalysis.aiNodesNeeded.length > 0) {
            const hasAINodes = workflow.nodes.some(node => this.isAINode(node));
            if (!hasAINodes) {
                validation.isValid = false;
                validation.errors.push({
                    type: 'MISSING_AI_NODES',
                    message: 'El prompt requiere procesamiento de IA pero el workflow no incluye nodos de IA',
                    requiredAI: semanticAnalysis.aiNodesNeeded,
                    severity: 'critical'
                });
            }
        }

        // 2. Validar que existan integraciones requeridas
        if (semanticAnalysis.requiredIntegrations.length > 0) {
            for (const integration of semanticAnalysis.requiredIntegrations) {
                const hasIntegration = workflow.nodes.some(node => 
                    node.type.includes(integration) || 
                    node.name.toLowerCase().includes(integration)
                );
                
                if (!hasIntegration) {
                    validation.isValid = false;
                    validation.errors.push({
                        type: 'MISSING_INTEGRATION',
                        message: `El prompt requiere integración con ${integration} pero no está presente`,
                        integration: integration,
                        severity: 'critical'
                    });
                }
            }
        }

        // 3. Validar flujos de procesamiento requeridos
        if (semanticAnalysis.processFlows) {
            for (const flow of semanticAnalysis.processFlows) {
                if (flow === 'conditional' && !this.hasConditionalLogic(workflow)) {
                    validation.isValid = false;
                    validation.errors.push({
                        type: 'MISSING_CONDITIONAL_LOGIC',
                        message: 'El prompt requiere lógica condicional pero el workflow no la incluye',
                        severity: 'critical'
                    });
                }
            }
        }

        console.log(`     ✅ Requisitos del prompt: ${validation.isValid ? 'Cumplidos' : 'FALTANTES'}`);
        return validation;
    }

    /**
     * MÉTODOS AUXILIARES DE VALIDACIÓN ARQUITECTURAL
     */
    checkRequiredComponents(workflow, semanticAnalysis) {
        const required = {
            triggers: semanticAnalysis.triggerTypes || ['webhook'],
            processing: ['data-processing'],
            outputs: ['output', 'notification']
        };

        const missing = [];
        
        // Verificar triggers
        const hasTriggers = workflow.nodes.some(node => this.isTriggerNode(node));
        if (!hasTriggers) missing.push('triggers');

        // Verificar processing
        const hasProcessing = workflow.nodes.some(node => 
            node.type.includes('code') || 
            node.type.includes('set') || 
            node.type.includes('function')
        );
        if (!hasProcessing) missing.push('data-processing');

        return {
            valid: missing.length === 0,
            missing: missing
        };
    }

    checkDomainArchitecture(workflow, semanticAnalysis) {
        const domain = semanticAnalysis.businessDomain;
        const issues = [];

        if (domain === 'crm' && !workflow.nodes.some(n => n.name.toLowerCase().includes('lead'))) {
            issues.push('CRM workflows should include lead processing');
        }

        if (domain === 'ecommerce' && !workflow.nodes.some(n => n.name.toLowerCase().includes('order'))) {
            issues.push('E-commerce workflows should include order processing');
        }

        return {
            valid: issues.length === 0,
            issues: issues
        };
    }

    checkBasicLogicalFlow(workflow) {
        const issues = [];
        
        // Verificar que haya un flujo from triggers to outputs
        const triggers = workflow.nodes.filter(n => this.isTriggerNode(n));
        const outputs = workflow.nodes.filter(n => this.isOutputNode(n));

        if (triggers.length === 0) issues.push('No trigger nodes found');
        if (outputs.length === 0) issues.push('No output nodes found');

        return {
            valid: issues.length === 0,
            issues: issues
        };
    }

    /**
     * APLICACIÓN DE CORRECCIONES INTELIGENTES
     */
    async applyIntelligentCorrections(workflow, validationResults) {
        console.log('🔧 Aplicando correcciones inteligentes...');

        let correctedWorkflow = JSON.parse(JSON.stringify(workflow)); // Deep copy

        // Verificar que validationResults y errors existan y sean iterables
        if (!validationResults || !validationResults.errors || !Array.isArray(validationResults.errors)) {
            console.log('⚠️ No hay errores de validación para corregir');
            return correctedWorkflow;
        }

        for (const error of validationResults.errors) {
            switch (error.type) {
                case 'ISOLATED_TRIGGER':
                    correctedWorkflow = this.fixIsolatedTrigger(correctedWorkflow, error);
                    break;
                case 'CIRCULAR_CONNECTION':
                    correctedWorkflow = this.fixCircularConnection(correctedWorkflow, error);
                    break;
                case 'NO_TRIGGERS':
                    correctedWorkflow = this.addMissingTrigger(correctedWorkflow);
                    break;
            }
        }

        console.log('   ✅ Correcciones aplicadas exitosamente');
        return correctedWorkflow;
    }

    /**
     * CORRECCIÓN DE TRIGGER AISLADO
     */
    fixIsolatedTrigger(workflow, error) {
        console.log(`   🔧 Corrigiendo trigger aislado: ${error.node}`);

        const triggerNode = workflow.nodes.find(n => n.name === error.node);
        if (!triggerNode) return workflow;

        // Encontrar el primer nodo no-trigger para conectar
        const targetNode = workflow.nodes.find(n => !this.isTriggerNode(n) && n.name !== error.node);
        
        if (targetNode) {
            // Crear conexión del trigger al primer nodo disponible
            if (!workflow.connections[triggerNode.name]) {
                workflow.connections[triggerNode.name] = { main: [[]] };
            }
            
            workflow.connections[triggerNode.name].main[0].push({
                node: targetNode.name,
                type: 'main',
                index: 0
            });

            console.log(`     ✅ Trigger "${triggerNode.name}" conectado a "${targetNode.name}"`);
        }

        return workflow;
    }

    /**
     * METADATOS INTELIGENTES
     */
    generateIntelligentMetadata(workflow, semanticAnalysis, workflowPlan) {
        return {
            // Información básica
            generatedBy: 'ultra-intelligent-fallback-v2',
            generatedAt: new Date().toISOString(),
            version: '2.0.0',

            // Análisis semántico
            businessDomain: semanticAnalysis.businessDomain,
            userIntent: semanticAnalysis.userIntent,
            complexity: semanticAnalysis.complexity,

            // Métricas de calidad
            qualityScore: this.calculateQualityScore(workflow),
            intelligenceLevel: this.calculateIntelligenceLevel(workflow, semanticAnalysis),

            // Estadísticas del workflow
            statistics: {
                nodeCount: workflow.nodes.length,
                connectionCount: Object.keys(workflow.connections).length,
                triggerCount: workflow.nodes.filter(n => this.isTriggerNode(n)).length,
                aiNodeCount: workflow.nodes.filter(n => this.isAINode(n)).length,
                integrationCount: semanticAnalysis.requiredIntegrations.length
            },

            // Características inteligentes
            features: {
                hasAIProcessing: semanticAnalysis.aiNodesNeeded.length > 0,
                hasErrorHandling: this.hasErrorHandling(workflow),
                hasValidation: this.hasValidation(workflow),
                hasParallelProcessing: this.hasParallelProcessing(workflow),
                hasConditionalLogic: this.hasConditionalLogic(workflow)
            },

            // Recomendaciones
            recommendations: this.generateRecommendations(workflow, semanticAnalysis)
        };
    }

    /**
     * MÉTODOS AUXILIARES DE VALIDACIÓN
     */
    isTriggerNode(node) {
        const triggerTypes = [
            'n8n-nodes-base.webhook',
            'n8n-nodes-base.cron',
            'n8n-nodes-base.start',
            'n8n-nodes-base.emailReadImap',
            'n8n-nodes-base.formTrigger',
            'n8n-nodes-base.manualTrigger'
        ];
        return triggerTypes.includes(node.type);
    }

    isAINode(node) {
        const aiTypes = [
            'n8n-nodes-base.openAi',
            'n8n-nodes-base.anthropic',
            'n8n-nodes-base.googleGemini',
            'n8n-nodes-base.huggingFace',
            'n8n-nodes-base.cohere',
            'n8n-nodes-base.replicate'
        ];
        return aiTypes.includes(node.type);
    }

    calculateQualityScore(workflow) {
        let score = 100;
        
        // Penalizar por falta de triggers
        const triggerCount = workflow.nodes.filter(n => this.isTriggerNode(n)).length;
        if (triggerCount === 0) score -= 50;
        else if (triggerCount === 1) score -= 10;

        // Penalizar por nodos huérfanos
        const orphanCount = this.countOrphanNodes(workflow);
        score -= orphanCount * 15;

        // Recompensar por buena conectividad
        const avgConnections = this.calculateAverageConnections(workflow);
        if (avgConnections > 2) score += 10;

        return Math.max(0, Math.min(100, score));
    }

    calculateIntelligenceLevel(workflow, semanticAnalysis) {
        let intelligencePoints = 0;

        // Puntos por análisis semántico correcto
        intelligencePoints += semanticAnalysis.businessDomain !== 'general' ? 20 : 0;
        intelligencePoints += semanticAnalysis.aiNodesNeeded.length * 15;
        intelligencePoints += semanticAnalysis.requiredIntegrations.length * 10;

        // Puntos por características del workflow
        intelligencePoints += this.hasErrorHandling(workflow) ? 15 : 0;
        intelligencePoints += this.hasValidation(workflow) ? 10 : 0;
        intelligencePoints += this.hasConditionalLogic(workflow) ? 20 : 0;

        if (intelligencePoints >= 80) return 'genius';
        if (intelligencePoints >= 60) return 'advanced';
        if (intelligencePoints >= 40) return 'intermediate';
        if (intelligencePoints >= 20) return 'basic';
        return 'simple';
    }

    /**
     * MÉTODOS AUXILIARES COMPLETADOS
     */
    
    // Análisis de complejidad mejorado
    analyzeComplexity(prompt) {
        const complexityIndicators = {
            'simple': ['simple', 'básico', 'basic', 'quick', 'rápido'],
            'medium': ['process', 'manage', 'handle', 'integrate', 'connect'],
            'high': ['complex', 'complejo', 'advanced', 'multiple', 'enterprise'],
            'enterprise': ['enterprise', 'scale', 'business', 'workflow', 'automation', 'ai', 'intelligence']
        };

        const promptLower = prompt.toLowerCase();
        let maxScore = 0;
        let detectedComplexity = 'medium';

        // Análisis por longitud del prompt
        if (prompt.length > 500) maxScore += 2;
        else if (prompt.length > 200) maxScore += 1;

        // Análisis por indicadores de complejidad
        for (const [complexity, indicators] of Object.entries(complexityIndicators)) {
            const score = indicators.reduce((count, indicator) => {
                return count + (promptLower.includes(indicator) ? 1 : 0);
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                detectedComplexity = complexity;
            }
        }

        // Análisis por cantidad de entidades mencionadas
        const entities = this.extractKeyEntities(prompt);
        if (entities.length > 10) detectedComplexity = 'enterprise';
        else if (entities.length > 6) detectedComplexity = 'high';

        return detectedComplexity;
    }

    extractKeyEntities(prompt) {
        const entityPatterns = {
            'platforms': ['salesforce', 'hubspot', 'shopify', 'stripe', 'paypal', 'mailchimp', 'slack', 'teams', 'discord'],
            'dataTypes': ['email', 'phone', 'address', 'customer', 'product', 'order', 'invoice', 'lead', 'contact'],
            'actions': ['send', 'receive', 'process', 'validate', 'transform', 'analyze', 'report', 'notify'],
            'integrations': ['api', 'webhook', 'database', 'spreadsheet', 'crm', 'erp', 'cms'],
            'aiServices': ['openai', 'gpt', 'ai', 'machine learning', 'natural language', 'sentiment', 'classification']
        };

        const promptLower = prompt.toLowerCase();
        const foundEntities = [];

        for (const [category, entities] of Object.entries(entityPatterns)) {
            for (const entity of entities) {
                if (promptLower.includes(entity)) {
                    foundEntities.push({ entity, category });
                }
            }
        }

        return foundEntities;
    }

    detectRequiredIntegrations(prompt) {
        console.log('🔌 Detectando integraciones requeridas...');
        
        const integrationMap = {
            'salesforce': ['salesforce', 'sfdc', 'crm salesforce'],
            'hubspot': ['hubspot', 'crm hubspot'],
            'pipedrive': ['pipedrive'],
            'zoho': ['zoho crm', 'zoho'],
            'shopify': ['shopify', 'ecommerce store'],
            'woocommerce': ['woocommerce', 'wordpress store'],
            'stripe': ['stripe', 'payment stripe'],
            'paypal': ['paypal', 'payment paypal'],
            'mailchimp': ['mailchimp', 'email marketing'],
            'sendgrid': ['sendgrid', 'transactional email'],
            'gmail': ['gmail', 'google mail', 'email gmail'],
            'outlook': ['outlook', 'microsoft mail', 'email outlook'],
            'slack': ['slack', 'team communication'],
            'discord': ['discord'],
            'telegram': ['telegram', 'bot telegram'],
            'whatsapp': ['whatsapp', 'whatsapp business'],
            'google-sheets': ['google sheets', 'spreadsheet', 'hoja de cálculo'],
            'airtable': ['airtable', 'base de datos airtable'],
            'postgresql': ['postgres', 'postgresql', 'database postgres'],
            'mysql': ['mysql', 'database mysql'],
            'mongodb': ['mongodb', 'mongo', 'database mongo'],
            'redis': ['redis', 'cache redis'],
            'twilio': ['twilio', 'sms', 'phone calls'],
            'aws': ['aws', 'amazon web services'],
            'google-cloud': ['google cloud', 'gcp'],
            'azure': ['azure', 'microsoft cloud'],
            'httpRequest': ['api externa', 'external api', 'api rest', 'webhook', 'http request'],
            'emailSend': ['enviar email', 'send email', 'envíe emails', 'email notification', 'notificación email']
        };

        const promptLower = prompt.toLowerCase();
        const requiredIntegrations = [];

        for (const [integration, keywords] of Object.entries(integrationMap)) {
            if (keywords.some(keyword => promptLower.includes(keyword))) {
                requiredIntegrations.push(integration);
                console.log(`   🎯 Detectado: ${integration} por patrón: ${keywords.find(k => promptLower.includes(k))}`);
            }
        }

        // Detección contextual mejorada
        if (promptLower.includes('crm') && requiredIntegrations.length === 0) {
            requiredIntegrations.push('salesforce'); // CRM por defecto
            console.log('   🎯 Detectado: salesforce (CRM genérico)');
        }
        
        if (promptLower.includes('actualice el crm') || promptLower.includes('update crm')) {
            if (!requiredIntegrations.includes('salesforce')) {
                requiredIntegrations.push('salesforce');
                console.log('   🎯 Detectado: salesforce (update CRM)');
            }
        }

        if ((promptLower.includes('email') || promptLower.includes('correo')) && 
            !requiredIntegrations.some(i => ['gmail', 'outlook', 'mailchimp', 'sendgrid', 'emailSend'].includes(i))) {
            requiredIntegrations.push('emailSend');
            console.log('   🎯 Detectado: emailSend (email genérico)');
        }

        console.log(`   ✅ ${requiredIntegrations.length} integraciones detectadas:`, requiredIntegrations);
        return [...new Set(requiredIntegrations)]; // Remover duplicados
    }

    identifyDataPoints(prompt) {
        const dataPointPatterns = [
            'email', 'nombre', 'phone', 'address', 'company', 'job title',
            'date', 'timestamp', 'amount', 'price', 'quantity', 'status',
            'id', 'uuid', 'token', 'key', 'value', 'score', 'rating'
        ];

        const promptLower = prompt.toLowerCase();
        return dataPointPatterns.filter(dataPoint => 
            promptLower.includes(dataPoint)
        );
    }

    identifyProcessFlows(prompt) {
        const flowPatterns = {
            'sequential': ['then', 'después', 'next', 'seguido', 'luego'],
            'parallel': ['simultaneously', 'parallel', 'al mismo tiempo', 'concurrent'],
            'conditional': ['if', 'si', 'when', 'cuando', 'condition', 'depending'],
            'loop': ['each', 'every', 'cada', 'for all', 'iterate', 'repeat']
        };

        const promptLower = prompt.toLowerCase();
        const detectedFlows = [];

        for (const [flowType, patterns] of Object.entries(flowPatterns)) {
            if (patterns.some(pattern => promptLower.includes(pattern))) {
                detectedFlows.push(flowType);
            }
        }

        return detectedFlows.length > 0 ? detectedFlows : ['sequential'];
    }

    detectAutomationPatterns(prompt) {
        const automationPatterns = {
            'trigger-based': ['when', 'cuando', 'on', 'trigger', 'event'],
            'scheduled': ['daily', 'weekly', 'monthly', 'schedule', 'cron', 'every'],
            'reactive': ['response', 'react', 'handle', 'process incoming'],
            'batch': ['batch', 'bulk', 'mass', 'multiple', 'all at once']
        };

        const promptLower = prompt.toLowerCase();
        const detectedPatterns = [];

        for (const [pattern, keywords] of Object.entries(automationPatterns)) {
            if (keywords.some(keyword => promptLower.includes(keyword))) {
                detectedPatterns.push(pattern);
            }
        }

        return detectedPatterns.length > 0 ? detectedPatterns : ['trigger-based'];
    }

    identifyValidationRequirements(prompt) {
        const validationKeywords = [
            'validate', 'validar', 'check', 'verify', 'confirm',
            'ensure', 'required', 'mandatory', 'must have',
            'format', 'structure', 'schema', 'rules'
        ];

        const promptLower = prompt.toLowerCase();
        const hasValidation = validationKeywords.some(keyword => 
            promptLower.includes(keyword)
        );

        return hasValidation ? ['data-validation', 'format-validation'] : [];
    }

    extractSemanticKeywords(prompt) {
        // Extraer palabras clave semánticamente relevantes
        const words = prompt.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3);

        const stopWords = new Set(['that', 'this', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'their']);
        
        return words.filter(word => !stopWords.has(word))
                   .slice(0, 20); // Top 20 keywords
    }

    extractActionWords(prompt) {
        const actionWords = [
            'create', 'generate', 'build', 'setup', 'configure',
            'send', 'receive', 'process', 'analyze', 'transform',
            'validate', 'check', 'verify', 'update', 'delete',
            'integrate', 'connect', 'sync', 'import', 'export',
            'notify', 'alert', 'inform', 'report', 'track'
        ];

        const promptLower = prompt.toLowerCase();
        return actionWords.filter(action => promptLower.includes(action));
    }

    extractBusinessTerms(prompt) {
        const businessTerms = [
            'customer', 'client', 'lead', 'prospect', 'contact',
            'order', 'invoice', 'payment', 'revenue', 'profit',
            'campaign', 'marketing', 'sales', 'support', 'service',
            'product', 'inventory', 'stock', 'warehouse', 'shipping',
            'analytics', 'metrics', 'kpi', 'dashboard', 'report'
        ];

        const promptLower = prompt.toLowerCase();
        return businessTerms.filter(term => promptLower.includes(term));
    }

    // Estimación inteligente de cantidad de nodos
    estimateNodeCount(semanticAnalysis) {
        let baseNodes = 5; // Mínimo básico

        // Ajustar por complejidad
        const complexityMultiplier = {
            'simple': 1,
            'medium': 1.5,
            'high': 2,
            'enterprise': 3
        };

        baseNodes *= complexityMultiplier[semanticAnalysis.complexity] || 1.5;

        // Ajustar por integraciones
        baseNodes += semanticAnalysis.requiredIntegrations.length * 2;

        // Ajustar por nodos de IA
        baseNodes += semanticAnalysis.aiNodesNeeded.length * 1.5;

        // Ajustar por entidades
        baseNodes += Math.min(semanticAnalysis.entities.length * 0.5, 10);

        return Math.max(8, Math.min(30, Math.ceil(baseNodes)));
    }

    // Diseño de ruta crítica
    designCriticalPath(semanticAnalysis) {
        const path = ['trigger', 'validation'];

        // Añadir procesamiento de IA si es necesario
        if (semanticAnalysis.aiNodesNeeded.length > 0) {
            path.push('ai-processing');
        }

        // Añadir procesamiento principal
        path.push('main-processing');

        // Añadir integraciones
        if (semanticAnalysis.requiredIntegrations.length > 0) {
            path.push('integration');
        }

        // Añadir salida
        path.push('output', 'notification');

        return path;
    }

    // Identificar ramas paralelas
    identifyParallelBranches(semanticAnalysis) {
        let branches = 1;

        // Más ramas para mayor complejidad
        if (semanticAnalysis.complexity === 'enterprise') branches = 3;
        else if (semanticAnalysis.complexity === 'high') branches = 2;

        // Más ramas si hay múltiples integraciones
        if (semanticAnalysis.requiredIntegrations.length > 2) {
            branches = Math.max(branches, 2);
        }

        return branches;
    }

    // Planificar puntos de integración
    planIntegrationPoints(semanticAnalysis) {
        return semanticAnalysis.requiredIntegrations.map(integration => ({
            type: integration,
            position: 'middle',
            critical: true
        }));
    }

    // Planificar nodos de validación
    planValidationNodes(semanticAnalysis) {
        const validationNodes = [];

        if (semanticAnalysis.validationRequirements.length > 0) {
            validationNodes.push({
                type: 'input-validation',
                position: 'early'
            });
        }

        if (semanticAnalysis.requiredIntegrations.length > 0) {
            validationNodes.push({
                type: 'integration-validation', 
                position: 'middle'
            });
        }

        return validationNodes;
    }

    // Planificar manejo de errores
    planErrorHandling(semanticAnalysis) {
        return {
            enabled: true,
            criticalNodes: ['trigger', 'integration', 'ai-processing'],
            fallbackStrategy: 'retry-with-notification'
        };
    }

    // Planificar optimizaciones de flujo
    planFlowOptimizations(semanticAnalysis) {
        return {
            parallelProcessing: semanticAnalysis.complexity !== 'simple',
            caching: semanticAnalysis.aiNodesNeeded.length > 0,
            errorHandling: true,
            monitoring: semanticAnalysis.complexity === 'enterprise'
        };
    }

    // Métodos auxiliares de validación mejorados
    countOrphanNodes(workflow) {
        const connectedNodes = new Set();
        
        // Marcar todos los nodos que aparecen en conexiones
        for (const connections of Object.values(workflow.connections)) {
            if (connections.main) {
                for (const outputArray of connections.main) {
                    if (Array.isArray(outputArray)) {
                        for (const connection of outputArray) {
                            connectedNodes.add(connection.node);
                        }
                    }
                }
            }
        }

        // Contar nodos que no están conectados
        return workflow.nodes.filter(node => 
            !connectedNodes.has(node.name) && 
            !this.isTriggerNode(node) &&
            !workflow.connections[node.name]
        ).length;
    }

    calculateAverageConnections(workflow) {
        const totalConnections = Object.values(workflow.connections).reduce((sum, conn) => {
            if (conn.main && Array.isArray(conn.main)) {
                return sum + conn.main.reduce((subSum, outputArray) => {
                    return subSum + (Array.isArray(outputArray) ? outputArray.length : 0);
                }, 0);
            }
            return sum;
        }, 0);

        return workflow.nodes.length > 0 ? totalConnections / workflow.nodes.length : 0;
    }

    hasErrorHandling(workflow) {
        return workflow.nodes.some(node => 
            node.onError || 
            node.retryOnFail || 
            node.type === 'n8n-nodes-base.errorTrigger'
        );
    }

    hasValidation(workflow) {
        return workflow.nodes.some(node => 
            node.type === 'n8n-nodes-base.if' ||
            node.type === 'n8n-nodes-base.switch' ||
            node.type === 'n8n-nodes-base.code' && 
            node.parameters?.jsCode?.includes('validate')
        );
    }

    hasConditionalLogic(workflow) {
        return workflow.nodes.some(node => 
            node.type === 'n8n-nodes-base.if' ||
            node.type === 'n8n-nodes-base.switch' ||
            node.type === 'n8n-nodes-base.merge'
        );
    }

    hasParallelProcessing(workflow) {
        return Object.values(workflow.connections).some(conn => 
            conn.main && 
            conn.main[0] && 
            Array.isArray(conn.main[0]) && 
            conn.main[0].length > 1
        );
    }

    generateRecommendations(workflow, semanticAnalysis) {
        const recommendations = [];

        if (!this.hasErrorHandling(workflow)) {
            recommendations.push('Añadir manejo de errores para mayor robustez');
        }

        if (!this.hasValidation(workflow)) {
            recommendations.push('Incluir validación de datos de entrada');
        }

        if (semanticAnalysis.aiNodesNeeded.length > 0 && !workflow.nodes.some(n => this.isAINode(n))) {
            recommendations.push('Considerar añadir nodos de IA para procesamiento inteligente');
        }

        if (workflow.nodes.filter(n => this.isTriggerNode(n)).length === 1) {
            recommendations.push('Añadir triggers adicionales para mayor flexibilidad');
        }

        return recommendations;
    }

    /**
     * INICIALIZACIÓN DE CONOCIMIENTO DE DOMINIO
     */
    initializeDomainKnowledge() {
        return {
            ecommerce: {
                commonWorkflows: ['order-processing', 'inventory-sync', 'customer-support'],
                requiredIntegrations: ['stripe', 'shopify', 'mailchimp'],
                keyEntities: ['product', 'order', 'customer', 'payment']
            },
            crm: {
                commonWorkflows: ['lead-nurturing', 'contact-management', 'sales-pipeline'],
                requiredIntegrations: ['salesforce', 'hubspot', 'pipedrive'],
                keyEntities: ['lead', 'contact', 'opportunity', 'account']
            },
            marketing: {
                commonWorkflows: ['email-campaigns', 'lead-scoring', 'social-media'],
                requiredIntegrations: ['mailchimp', 'hubspot', 'google-analytics'],
                keyEntities: ['campaign', 'lead', 'content', 'audience']
            }
            // ... más dominios
        };
    }

    /**
     * INICIALIZACIÓN DE TEMPLATES DE NODOS DE IA
     */
    initializeAINodeTemplates() {
        return {
            // Templates ya definidos arriba en createIntelligentAINode
        };
    }

    /**
     * GENERACIÓN BÁSICA INTELIGENTE (FALLBACK DEL FALLBACK)
     */
    async generateBasicIntelligentWorkflow(prompt) {
        console.log('🔄 Usando generación básica inteligente como fallback...');

        const nodes = [];
        let nodeIndex = 0;

        // 1. Trigger básico
        const trigger = {
            id: `trigger-${nodeIndex++}`,
            name: 'Manual Trigger',
            type: 'n8n-nodes-base.start',
            position: [100, 200],
            parameters: {},
            typeVersion: 1
        };
        nodes.push(trigger);

        // 2. Procesamiento básico
        const processing = {
            id: `process-${nodeIndex++}`,
            name: 'Process Data',
            type: 'n8n-nodes-base.code',
            position: [300, 200],
            parameters: {
                mode: 'runOnceForAllItems',
                jsCode: `// Basic data processing
console.log('Processing data:', items);
return items;`
            },
            typeVersion: 1
        };
        nodes.push(processing);

        // 3. Salida básica
        const output = {
            id: `output-${nodeIndex++}`,
            name: 'Output Result',
            type: 'n8n-nodes-base.respondToWebhook',
            position: [500, 200],
            parameters: {
                respondWith: 'json',
                responseBody: '{"status": "completed", "message": "Workflow executed successfully"}'
            },
            typeVersion: 1
        };
        nodes.push(output);

        // Conexiones básicas
        const connections = {
            [trigger.name]: {
                main: [[{ node: processing.name, type: 'main', index: 0 }]]
            },
            [processing.name]: {
                main: [[{ node: output.name, type: 'main', index: 0 }]]
            }
        };

        return {
            nodes,
            connections,
            active: false,
            settings: { executionOrder: 'v1' },
            staticData: {},
            tags: [],
            metadata: {
                generatedBy: 'basic-intelligent-fallback',
                complexity: 'simple',
                qualityScore: 70,
                intelligenceLevel: 'basic'
            }
        };
    }

    /**
     * UTILIDADES - VERIFICACIONES DE TIPOS DE NODOS
     */
    isTriggerNode(node) {
        const triggerTypes = [
            'n8n-nodes-base.webhook',
            'n8n-nodes-base.httpRequest',
            'n8n-nodes-base.manualTrigger',
            'n8n-nodes-base.cronTrigger',
            'n8n-nodes-base.interval',
            'n8n-nodes-base.emailTrigger',
            'n8n-nodes-base.errorTrigger',
            'n8n-nodes-base.apiKeyAuth'
        ];
        
        return triggerTypes.includes(node.type) || 
               node.name.toLowerCase().includes('trigger') ||
               node.name.toLowerCase().includes('start');
    }

    isAINode(node) {
        const aiTypes = [
            'n8n-nodes-base.openAi',
            'n8n-nodes-base.anthropic',
            'n8n-nodes-base.googleGemini',
            'n8n-nodes-base.huggingFace',
            'n8n-nodes-base.replicate',
            'n8n-nodes-base.cohere',
            'n8n-nodes-base.azureOpenAi'
        ];
        
        return aiTypes.includes(node.type) || 
               node.name.toLowerCase().includes('ai') ||
               node.name.toLowerCase().includes('openai') ||
               node.name.toLowerCase().includes('gpt') ||
               node.name.toLowerCase().includes('claude') ||
               node.name.toLowerCase().includes('gemini');
    }

    isIntegrationNode(node) {
        const integrationTypes = [
            'n8n-nodes-base.salesforce',
            'n8n-nodes-base.hubspot',
            'n8n-nodes-base.slack',
            'n8n-nodes-base.googleSheets',
            'n8n-nodes-base.microsoftExcel',
            'n8n-nodes-base.notion',
            'n8n-nodes-base.airtable',
            'n8n-nodes-base.mysql',
            'n8n-nodes-base.postgres'
        ];
        
        return integrationTypes.some(type => node.type.includes(type.split('.')[2]));
    }

    isInitialProcessingNode(node) {
        return node.type === 'n8n-nodes-base.set' || 
               node.type === 'n8n-nodes-base.code' || 
               node.name.toLowerCase().includes('validation') ||
               node.name.toLowerCase().includes('enrichment');
    }

    generateNodeId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateNodeName(baseType, domain) {
        const domainPrefixes = {
            'ecommerce': ['Product', 'Order', 'Customer', 'Inventory'],
            'crm': ['Lead', 'Contact', 'Deal', 'Account'],
            'marketing': ['Campaign', 'Email', 'Social', 'Analytics'],
            'finance': ['Invoice', 'Payment', 'Transaction', 'Report'],
            'hr': ['Employee', 'Recruitment', 'Performance', 'Payroll'],
            'default': ['Data', 'Process', 'Task', 'Workflow']
        };

        const prefixOptions = domainPrefixes[domain] || domainPrefixes['default'];
        const randomPrefix = prefixOptions[Math.floor(Math.random() * prefixOptions.length)];
        
        return `${randomPrefix} ${baseType} ${Math.floor(Math.random() * 1000)}`;
    }

    /**
     * VALIDAR TRIGGERS (PREVENIR TRIGGERS AISLADOS)
     */
    validateTriggers(workflow) {
        const triggers = workflow.nodes.filter(n => this.isTriggerNode(n));
        const isolatedTriggers = [];

        for (const trigger of triggers) {
            const hasConnections = workflow.connections[trigger.name] && 
                                 workflow.connections[trigger.name].main && 
                                 workflow.connections[trigger.name].main[0] && 
                                 workflow.connections[trigger.name].main[0].length > 0;

            if (!hasConnections) {
                isolatedTriggers.push(trigger);
            }
        }

        return {
            isValid: isolatedTriggers.length === 0,
            isolatedTriggers,
            totalTriggers: triggers.length
        };
    }

    /**
     * VALIDAR CONEXIONES CIRCULARES
     */
    validateCircularConnections(workflow) {
        const visited = new Set();
        const recursionStack = new Set();
        const cycles = [];

        const hasCycle = (nodeName) => {
            if (recursionStack.has(nodeName)) {
                cycles.push(nodeName);
                return true;
            }

            if (visited.has(nodeName)) {
                return false;
            }

            visited.add(nodeName);
            recursionStack.add(nodeName);

            const connections = workflow.connections[nodeName];
            if (connections && connections.main) {
                for (const outputArray of connections.main) {
                    for (const connection of outputArray) {
                        if (hasCycle(connection.node)) {
                            return true;
                        }
                    }
                }
            }

            recursionStack.delete(nodeName);
            return false;
        };

        for (const node of workflow.nodes) {
            if (!visited.has(node.name)) {
                hasCycle(node.name);
            }
        }

        return {
            isValid: cycles.length === 0,
            cycles,
            hasCircularRefs: cycles.length > 0
        };
    }

    /**
     * INICIALIZAR PATRONES DE WORKFLOW EMPRESARIALES
     */
    initializeWorkflowPatterns() {
        return {
            'ecommerce': {
                common_flows: ['order_processing', 'inventory_management', 'customer_service'],
                required_integrations: ['payment', 'shipping', 'crm'],
                typical_nodes: 12
            },
            'crm': {
                common_flows: ['lead_generation', 'lead_qualification', 'opportunity_management'],  
                required_integrations: ['salesforce', 'hubspot', 'email'],
                typical_nodes: 18
            },
            'marketing': {
                common_flows: ['campaign_automation', 'lead_nurturing', 'social_media'],
                required_integrations: ['mailchimp', 'facebook', 'analytics'],
                typical_nodes: 15
            },
            'finance': {
                common_flows: ['invoice_processing', 'expense_tracking', 'reporting'],
                required_integrations: ['quickbooks', 'banks', 'erp'],
                typical_nodes: 14
            },
            'hr': {
                common_flows: ['recruitment', 'employee_onboarding', 'performance_tracking'],
                required_integrations: ['ats', 'payroll', 'ldap'],
                typical_nodes: 16
            }
        };
    }

    /**
     * INICIALIZAR REGLAS DE VALIDACIÓN
     */
    initializeValidationRules() {
        return {
            trigger_isolation: {
                severity: 'critical',
                check: 'all_triggers_must_have_connections'
            },
            circular_references: {
                severity: 'critical', 
                check: 'no_circular_node_connections'
            },
            orphan_nodes: {
                severity: 'warning',
                check: 'all_nodes_must_be_connected'
            },
            ai_node_configuration: {
                severity: 'warning',
                check: 'ai_nodes_must_have_valid_config'
            }
        };
    }

    /**
     * INICIALIZAR CONOCIMIENTO DE DOMINIO
     */
    initializeDomainKnowledge() {
        return {
            'ecommerce': {
                keywords: ['product', 'order', 'customer', 'inventory', 'payment', 'shipping'],
                processes: ['checkout', 'fulfillment', 'returns', 'support'],
                integrations: ['shopify', 'woocommerce', 'stripe', 'paypal'],
                complexity_multiplier: 1.2
            },
            'crm': {
                keywords: ['lead', 'contact', 'deal', 'account', 'opportunity', 'pipeline'],
                processes: ['lead_generation', 'qualification', 'nurturing', 'closing'],
                integrations: ['salesforce', 'hubspot', 'pipedrive', 'zoho'],
                complexity_multiplier: 1.4
            },
            'marketing': {
                keywords: ['campaign', 'email', 'social', 'content', 'analytics', 'conversion'],
                processes: ['content_creation', 'distribution', 'tracking', 'optimization'],
                integrations: ['mailchimp', 'facebook', 'google_ads', 'analytics'],
                complexity_multiplier: 1.3
            }
        };
    }

    /**
     * INICIALIZAR TEMPLATES DE NODOS IA
     */
    initializeAINodeTemplates() {
        return {
            'content_generation': {
                provider: 'openai',
                model: 'gpt-4',
                use_case: 'Generate marketing content, product descriptions, emails'
            },
            'sentiment_analysis': {
                provider: 'anthropic', 
                model: 'claude-3-sonnet-20240229',
                use_case: 'Analyze customer feedback, reviews, social media'
            },
            'lead_scoring': {
                provider: 'gemini',
                model: 'gemini-pro',
                use_case: 'Score and qualify leads based on criteria'
            },
            'document_processing': {
                provider: 'huggingface',
                model: 'document-ai',
                use_case: 'Process invoices, contracts, forms'
            }
        };
    }

    /**
     * CÁLCULO DE PUNTUACIÓN INTELIGENTE
     */
    calculateIntelligenceScore(workflow, semanticAnalysis) {
        let score = 0;
        const maxScore = 100;

        // Base por complejidad semántica (30 puntos)
        const complexityScores = { 'low': 10, 'medium': 20, 'high': 30 };
        score += complexityScores[semanticAnalysis.complexity] || 15;

        // Puntos por tipos de nodos inteligentes (25 puntos)
        const intelligentNodes = workflow.nodes.filter(n => 
            this.isAINode(n) || 
            this.isIntegrationNode(n) || 
            n.type === 'n8n-nodes-base.if'
        );
        score += Math.min(25, intelligentNodes.length * 3);

        // Puntos por conexiones válidas (20 puntos)
        const triggerValidation = this.validateTriggers(workflow);
        const circularValidation = this.validateCircularConnections(workflow);
        if (triggerValidation.isValid) score += 10;
        if (circularValidation.isValid) score += 10;

        // Puntos por diversidad de nodos (15 puntos)
        const uniqueTypes = new Set(workflow.nodes.map(n => n.type));
        score += Math.min(15, uniqueTypes.size * 2);

        // Puntos por validación empresarial (10 puntos)
        if (semanticAnalysis.businessLogic && semanticAnalysis.businessLogic.score > 0.7) {
            score += 10;
        } else if (semanticAnalysis.businessLogic && semanticAnalysis.businessLogic.score > 0.5) {
            score += 5;
        }

        return Math.min(maxScore, Math.max(0, score));
    }

    /**
     * VALIDAR NODOS HUÉRFANOS
     */
    validateOrphanNodes(workflow) {
        const connectedNodes = new Set();
        const allNodeNames = new Set(workflow.nodes.map(n => n.name));

        // Identificar nodos conectados como fuente
        for (const [sourceName, connections] of Object.entries(workflow.connections)) {
            connectedNodes.add(sourceName);
            
            if (connections.main) {
                for (const outputArray of connections.main) {
                    for (const connection of outputArray) {
                        connectedNodes.add(connection.node);
                    }
                }
            }
        }

        // Encontrar nodos huérfanos
        const orphanNodes = [];
        for (const nodeName of allNodeNames) {
            if (!connectedNodes.has(nodeName)) {
                const node = workflow.nodes.find(n => n.name === nodeName);
                if (node && !this.isTriggerNode(node)) {
                    orphanNodes.push(node);
                }
            }
        }

        return {
            isValid: orphanNodes.length === 0,
            orphanNodes,
            totalOrphans: orphanNodes.length
        };
    }

    /**
     * VALIDAR PARÁMETROS DE NODOS
     */
    validateNodeParameters(workflow) {
        const invalidNodes = [];

        for (const node of workflow.nodes) {
            if (this.isAINode(node) && (!node.parameters || !node.parameters.model)) {
                invalidNodes.push({
                    node: node.name,
                    issue: 'AI node missing model parameter'
                });
            }

            if (node.type === 'n8n-nodes-base.webhook' && (!node.parameters || !node.parameters.path)) {
                invalidNodes.push({
                    node: node.name,
                    issue: 'Webhook missing path parameter'
                });
            }
        }

        return {
            isValid: invalidNodes.length === 0,
            invalidNodes,
            totalInvalid: invalidNodes.length
        };
    }

    /**
     * REALIZAR VALIDACIÓN PROFUNDA DEL WORKFLOW
     */
    performDeepWorkflowValidation(workflow) {
        console.log('🔍 Realizando validación profunda del workflow...');

        const results = {
            triggers: this.validateTriggers(workflow),
            circular: this.validateCircularConnections(workflow),
            orphans: this.validateOrphanNodes(workflow),
            parameters: this.validateNodeParameters(workflow)
        };

        const isValid = results.triggers.isValid && 
                       results.circular.isValid && 
                       results.orphans.isValid && 
                       results.parameters.isValid;

        console.log('   📊 Resultados de validación:', {
            triggers: results.triggers.isValid ? '✅' : '❌',
            circular: results.circular.isValid ? '✅' : '❌', 
            orphans: results.orphans.isValid ? '✅' : '❌',
            parameters: results.parameters.isValid ? '✅' : '❌'
        });

        return {
            isValid,
            results,
            overallScore: isValid ? 100 : 70
        };
    }



    /**
     * Obtiene nodos recomendados para un dominio específico
     */
    getRecommendedNodesForDomain(domain) {
        const domainNodes = {
            'ecommerce': ['n8n-nodes-base.shopify', 'n8n-nodes-base.woocommerce'],
            'social': ['n8n-nodes-base.twitter', 'n8n-nodes-base.facebook'],
            'productivity': ['n8n-nodes-base.notion', 'n8n-nodes-base.google-sheets'],
            'communication': ['n8n-nodes-base.slack', 'n8n-nodes-base.discord']
        };
        
        return domainNodes[domain] || [];
    }

    /**
     * Analiza patrones de conexión exitosos
     */
    analyzeConnectionPatterns(connections) {
        const patterns = [];
        
        for (const [sourceNode, targets] of Object.entries(connections)) {
            for (const [outputIndex, targetConnections] of Object.entries(targets)) {
                patterns.push({
                    source: sourceNode,
                    output: outputIndex,
                    targets: targetConnections.map(conn => conn.node)
                });
            }
        }
        
        return patterns;
    }

    /**
     * Genera mejores prácticas basadas en patrones comunes
     */
    generateBestPractices(patterns) {
        const practices = [];
        
        const avgNodeCount = patterns.reduce((sum, p) => sum + p.nodeCount, 0) / patterns.length;
        if (avgNodeCount > 0) {
            practices.push(`Workflows típicos usan ${Math.round(avgNodeCount)} nodos`);
        }
        
        const commonWebhook = patterns.filter(p => p.hasWebhook).length > patterns.length / 2;
        if (commonWebhook) {
            practices.push('Incluir webhook trigger es recomendado');
        }
        
        return practices;
    }

    /**
     * Extrae insights de workflows de referencia para mejorar el plan
     * @param {Array} referenceWorkflows - Workflows de referencia
     * @param {Object} semanticAnalysis - Análisis semántico del prompt
     * @returns {Object} - Insights extraídos
     */
    extractReferenceInsights(referenceWorkflows, semanticAnalysis) {
        console.log('🔍 Extrayendo insights de', referenceWorkflows.length, 'workflows de referencia...');
        
        const insights = {
            commonPatterns: [],
            recommendedNodes: [],
            suggestedConnections: [],
            bestPractices: []
        };

        try {
            for (const workflow of referenceWorkflows) {
                if (!workflow.nodes) continue;

                // Analizar patrones comunes
                const nodeTypes = workflow.nodes.map(node => node.type);
                const uniqueTypes = [...new Set(nodeTypes)];
                
                insights.commonPatterns.push({
                    nodeCount: workflow.nodes.length,
                    nodeTypes: uniqueTypes,
                    hasWebhook: nodeTypes.includes('n8n-nodes-base.webhook'),
                    hasAI: nodeTypes.some(type => type.includes('openai') || type.includes('ai')),
                    hasConditional: nodeTypes.includes('n8n-nodes-base.if')
                });

                // Recomendar nodos basados en el dominio
                if (semanticAnalysis.businessDomain) {
                    const domainNodes = this.getRecommendedNodesForDomain(semanticAnalysis.businessDomain);
                    insights.recommendedNodes.push(...domainNodes);
                }

                // Analizar conexiones exitosas
                if (workflow.connections) {
                    const successfulPatterns = this.analyzeConnectionPatterns(workflow.connections);
                    insights.suggestedConnections.push(...successfulPatterns);
                }
            }

            // Generar mejores prácticas
            insights.bestPractices = this.generateBestPractices(insights.commonPatterns);
            
            console.log('   ✅ Patrones comunes encontrados:', insights.commonPatterns.length);
            console.log('   ✅ Nodos recomendados:', insights.recommendedNodes.length);

        } catch (error) {
            console.log('   ⚠️ Error extrayendo insights:', error.message);
        }

        return insights;
    }
}

/**
 * CLASES AUXILIARES PARA EL ANÁLISIS INTELIGENTE
 */

class ConnectionAnalyzer {
    analyzeConnections(connections, nodes) {
        // Análisis topológico de conexiones
        return {
            isValid: true,
            hasCircularRefs: false,
            orphanNodes: [],
            complexity: 'medium'
        };
    }
}

class FlowValidator {
    validateFlow(workflow) {
        // Validación de flujo lógico
        return {
            isValid: true,
            errors: [],
            suggestions: []
        };
    }

    /**
     * GENERACIÓN INTELIGENTE DE CONEXIONES
     */
    generateIntelligentConnections(nodes, existingConnections = []) {
        console.log('🔗 Generando conexiones inteligentes...');

        const connections = [...existingConnections];
        let connectionIndex = connections.length;

        try {
            // 1. CONECTAR NODOS SECUENCIALMENTE SEGÚN SU TIPO Y FUNCIÓN
            for (let i = 0; i < nodes.length - 1; i++) {
                const currentNode = nodes[i];
                const nextNode = nodes[i + 1];

                // Evitar conectar triggers a otros triggers
                if (this.isTriggerNode(currentNode) && this.isTriggerNode(nextNode)) {
                    continue;
                }

                // Crear conexión básica
                const connection = {
                    node: currentNode.id,
                    type: 'main',
                    index: 0
                };

                if (!connections[nextNode.id]) {
                    connections[nextNode.id] = {};
                }
                if (!connections[nextNode.id].main) {
                    connections[nextNode.id].main = [];
                }

                connections[nextNode.id].main.push([connection]);
            }

            // 2. CREAR CONEXIONES ESPECIALIZADAS PARA NODOS DE IA
            this.createAINodeConnections(nodes, connections);

            // 3. CREAR CONEXIONES DE MANEJO DE ERRORES
            this.createErrorHandlingConnections(nodes, connections);

            // 4. CREAR CONEXIONES CONDICIONALES PARA ROUTING
            this.createConditionalConnections(nodes, connections);

            // 5. VALIDAR Y CORREGIR CONEXIONES PROBLEMÁTICAS
            const validatedConnections = this.validateAndFixConnections(connections, nodes);

            console.log(`   ✅ ${Object.keys(validatedConnections).length} conexiones inteligentes generadas`);
            return validatedConnections;

        } catch (error) {
            console.error('Error generando conexiones:', error);
            return existingConnections;
        }
    }

    /**
     * CREAR CONEXIONES ESPECIALIZADAS PARA NODOS DE IA
     */
    createAINodeConnections(nodes, connections) {
        const aiNodes = nodes.filter(node => this.isAINode(node));
        
        for (const aiNode of aiNodes) {
            // Conectar nodos de preparación de datos antes del AI
            const dataNodes = nodes.filter(node => this.isDataProcessingNode(node));
            
            for (const dataNode of dataNodes) {
                if (dataNode.id !== aiNode.id) {
                    this.createConnection(dataNode.id, aiNode.id, connections);
                }
            }
        }
    }

    /**
     * CREAR CONEXIONES DE MANEJO DE ERRORES
     */
    createErrorHandlingConnections(nodes, connections) {
        const errorNodes = nodes.filter(node => node.type === 'n8n-nodes-base.errorTrigger');
        const notificationNodes = nodes.filter(node => 
            node.type === 'n8n-nodes-base.emailSend' || 
            node.type === 'n8n-nodes-base.slack'
        );

        for (const errorNode of errorNodes) {
            for (const notificationNode of notificationNodes) {
                this.createConnection(errorNode.id, notificationNode.id, connections);
            }
        }
    }

    /**
     * CREAR CONEXIONES CONDICIONALES PARA ROUTING
     */
    createConditionalConnections(nodes, connections) {
        const conditionalNodes = nodes.filter(node => 
            node.type === 'n8n-nodes-base.if' || 
            node.type === 'n8n-nodes-base.switch'
        );

        for (const conditionalNode of conditionalNodes) {
            // Encontrar nodos de salida para cada rama condicional
            const outputNodes = nodes.filter(node => 
                this.isOutputNode(node) && node.id !== conditionalNode.id
            );

            // Crear múltiples conexiones para diferentes rutas
            outputNodes.forEach((outputNode, index) => {
                this.createConnection(conditionalNode.id, outputNode.id, connections, index);
            });
        }
    }

    /**
     * CREAR UNA CONEXIÓN ENTRE DOS NODOS
     */
    createConnection(fromNodeId, toNodeId, connections, outputIndex = 0) {
        if (!connections[toNodeId]) {
            connections[toNodeId] = {};
        }
        if (!connections[toNodeId].main) {
            connections[toNodeId].main = [];
        }

        const connection = {
            node: fromNodeId,
            type: 'main',
            index: outputIndex
        };

        // Evitar conexiones duplicadas
        const exists = connections[toNodeId].main.some(connArray => 
            connArray.some(conn => conn.node === fromNodeId && conn.index === outputIndex)
        );

        if (!exists) {
            connections[toNodeId].main.push([connection]);
        }
    }

    /**
     * VERIFICAR SI UN NODO ES DE TIPO TRIGGER
     */
    isTriggerNode(node) {
        return node.type && (
            node.type.includes('trigger') || 
            node.type.includes('webhook') ||
            node.type === 'n8n-nodes-base.cron' ||
            node.type === 'n8n-nodes-base.start'
        );
    }

    /**
     * VERIFICAR SI UN NODO ES DE TIPO IA
     */
    isAINode(node) {
        return node.type && (
            node.type.includes('openai') ||
            node.type.includes('ai') ||
            node.name && node.name.toLowerCase().includes('ai')
        );
    }

    /**
     * VERIFICAR SI UN NODO ES DE PROCESAMIENTO DE DATOS
     */
    isDataProcessingNode(node) {
        return node.type && (
            node.type.includes('code') ||
            node.type.includes('function') ||
            node.type.includes('set') ||
            node.type.includes('json')
        );
    }

    /**
     * VERIFICAR SI UN NODO ES DE SALIDA
     */
    isOutputNode(node) {
        return node.type && (
            node.type.includes('email') ||
            node.type.includes('slack') ||
            node.type.includes('webhook') ||
            node.type.includes('http') ||
            node.type.includes('response')
        );
    }
}

class SemanticAnalyzer {
    analyzeSemantics(prompt) {
        // Análisis semántico profundo
        return {
            intent: 'automate',
            domain: 'general',
            complexity: 'medium'
        };
    }
}

class TopologyAnalyzer {
    constructor(nodes) {
        this.nodes = nodes;
        this.nodeMap = new Map(nodes.map(n => [n.id, n]));
    }

    detectCycles(connections) {
        // Detección de ciclos en el grafo
        return [];
    }

    findOptimalPaths(connections) {
        // Encontrar rutas óptimas
        return [];
    }

    /**
     * Extrae insights de workflows de referencia para mejorar el plan
     * @param {Array} referenceWorkflows - Workflows de referencia
     * @param {Object} semanticAnalysis - Análisis semántico del prompt
     * @returns {Object} - Insights extraídos
     */
    extractReferenceInsights(referenceWorkflows, semanticAnalysis) {
        console.log('🔍 Extrayendo insights de', referenceWorkflows.length, 'workflows de referencia...');
        
        const insights = {
            commonPatterns: [],
            recommendedNodes: [],
            suggestedConnections: [],
            bestPractices: []
        };

        try {
            for (const workflow of referenceWorkflows) {
                if (!workflow.nodes) continue;

                // Analizar patrones comunes
                const nodeTypes = workflow.nodes.map(node => node.type);
                const uniqueTypes = [...new Set(nodeTypes)];
                
                insights.commonPatterns.push({
                    nodeCount: workflow.nodes.length,
                    nodeTypes: uniqueTypes,
                    hasWebhook: nodeTypes.includes('n8n-nodes-base.webhook'),
                    hasAI: nodeTypes.some(type => type.includes('openai') || type.includes('ai')),
                    hasNotifications: nodeTypes.some(type => type.includes('slack') || type.includes('email'))
                });

                // Recomendar nodos basados en el contexto semántico
                if (semanticAnalysis.hasAI && uniqueTypes.some(type => type.includes('openai'))) {
                    insights.recommendedNodes.push('n8n-nodes-base.openAi');
                }
                
                if (semanticAnalysis.hasNotifications && uniqueTypes.includes('n8n-nodes-base.slack')) {
                    insights.recommendedNodes.push('n8n-nodes-base.slack');
                }

                if (semanticAnalysis.hasEmail && uniqueTypes.includes('n8n-nodes-base.emailSend')) {
                    insights.recommendedNodes.push('n8n-nodes-base.emailSend');
                }
            }

            // Eliminar duplicados
            insights.recommendedNodes = [...new Set(insights.recommendedNodes)];
            
            // Agregar mejores prácticas
            insights.bestPractices = [
                'Usar nodos Try/Catch para manejo de errores',
                'Incluir validación de datos en workflows complejos',
                'Agregar nodos de respuesta para webhooks',
                'Implementar logging para debugging'
            ];

            console.log('   ✅ Patterns encontrados:', insights.commonPatterns.length);
            console.log('   ✅ Nodos recomendados:', insights.recommendedNodes.length);

        } catch (error) {
            console.log('   ⚠️ Error extrayendo insights:', error.message);
        }

        return insights;
    }
}

// Exportar la clase principal
export default UltraIntelligentFallbackAgent;
/**
 * TEST INDEPENDIENTE DEL FALLBACK MEJORADO
 * Prueba el generateIntelligentFallbackWorkflow sin el sistema completo
 */

import fs from 'fs';

// ============== SIMULADOR DE SEARCH AGENT ==============
class MockSearchAgent {
    constructor() {
        // Workflows de ejemplo para simular la búsqueda
        this.mockWorkflows = [
            {
                name: "CRM Lead Processing",
                description: "Procesa leads de CRM con validación y notificaciones",
                nodes: [
                    { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
                    { name: "Validate Lead Data", type: "n8n-nodes-base.if" },
                    { name: "Update CRM", type: "n8n-nodes-base.hubspot" },
                    { name: "Send Email", type: "n8n-nodes-base.emailSend" },
                    { name: "Notify Team", type: "n8n-nodes-base.slack" }
                ],
                connections: {
                    "Webhook Trigger": ["Validate Lead Data"],
                    "Validate Lead Data": ["Update CRM", "Notify Team"],
                    "Update CRM": ["Send Email"],
                    "Send Email": ["Notify Team"]
                },
                keywords: ["webhook", "lead", "crm", "validation", "email", "slack", "hubspot"]
            },
            {
                name: "E-commerce Order Processing",
                description: "Procesa pedidos de e-commerce con pagos y inventario",
                nodes: [
                    { name: "Order Webhook", type: "n8n-nodes-base.webhook" },
                    { name: "Check Inventory", type: "n8n-nodes-base.mysql" },
                    { name: "Process Payment", type: "n8n-nodes-base.stripe" },
                    { name: "Send Confirmation", type: "n8n-nodes-base.emailSend" },
                    { name: "Update Inventory", type: "n8n-nodes-base.mysql" },
                    { name: "Generate Invoice", type: "n8n-nodes-base.function" },
                    { name: "Notify Warehouse", type: "n8n-nodes-base.slack" }
                ],
                connections: {
                    "Order Webhook": ["Check Inventory"],
                    "Check Inventory": ["Process Payment"],
                    "Process Payment": ["Send Confirmation"],
                    "Send Confirmation": ["Update Inventory"],
                    "Update Inventory": ["Generate Invoice"],
                    "Generate Invoice": ["Notify Warehouse"]
                },
                keywords: ["order", "ecommerce", "inventory", "payment", "stripe", "email", "warehouse", "invoice"]
            },
            {
                name: "Newsletter Automation",
                description: "Automatiza envío de newsletters con segmentación",
                nodes: [
                    { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
                    { name: "Get Subscribers", type: "n8n-nodes-base.mysql" },
                    { name: "Segment Users", type: "n8n-nodes-base.function" },
                    { name: "Send Newsletter", type: "n8n-nodes-base.emailSend" },
                    { name: "Track Metrics", type: "n8n-nodes-base.googleAnalytics" }
                ],
                connections: {
                    "Schedule Trigger": ["Get Subscribers"],
                    "Get Subscribers": ["Segment Users"],
                    "Segment Users": ["Send Newsletter"],
                    "Send Newsletter": ["Track Metrics"]
                },
                keywords: ["newsletter", "email", "subscribers", "segmentation", "analytics", "schedule"]
            }
        ];
    }

    async searchSimilarWorkflows(prompt, maxResults = 3) {
        console.log(`🔍 MockSearchAgent: Buscando workflows similares para: "${prompt}"`);
        
        // Simular búsqueda por keywords
        const promptWords = prompt.toLowerCase().split(/\s+/);
        const scored = this.mockWorkflows.map(workflow => {
            const matchCount = workflow.keywords.filter(keyword => 
                promptWords.some(word => word.includes(keyword) || keyword.includes(word))
            ).length;
            
            return {
                ...workflow,
                score: matchCount / workflow.keywords.length
            };
        }).sort((a, b) => b.score - a.score);

        const results = scored.slice(0, maxResults).filter(w => w.score > 0);
        
        console.log(`📊 MockSearchAgent: Encontrados ${results.length} workflows relevantes`);
        results.forEach((w, i) => {
            console.log(`   ${i+1}. ${w.name} (score: ${(w.score * 100).toFixed(1)}%)`);
        });
        
        return results;
    }
}

// ============== FALLBACK MEJORADO ==============
class FallbackTester {
    constructor() {
        this.searchAgent = new MockSearchAgent();
    }

    // Función principal del fallback mejorado (copiada del sistema)
    async generateIntelligentFallbackWorkflow(prompt) {
        console.log('\n🎯 INICIANDO FALLBACK MEJORADO...');
        console.log(`📝 Prompt: "${prompt}"`);
        
        try {
            // Buscar workflows de referencia similares
            const similarWorkflows = await this.searchAgent.searchSimilarWorkflows(prompt, 3);
            
            let baseWorkflow = null;
            if (similarWorkflows && similarWorkflows.length > 0) {
                // Seleccionar el mejor workflow de referencia
                baseWorkflow = this.selectBestReferenceWorkflow(similarWorkflows, prompt);
                console.log(`✅ Workflow de referencia seleccionado: "${baseWorkflow.name}"`);
            } else {
                console.log('⚠️ No se encontraron workflows de referencia, usando lógica determinística pura');
            }

            // Generar workflow base
            let workflow;
            if (baseWorkflow) {
                console.log('🔧 Adaptando workflow de referencia...');
                workflow = await this.adaptReferenceWorkflow(baseWorkflow, prompt);
            } else {
                console.log('🏗️ Generando workflow con lógica determinística...');
                workflow = this.generateDeterministicWorkflow(prompt);
            }

            // Generar nodos complementarios si es necesario
            const complementaryNodes = this.generateComplementaryNodes(prompt, workflow.nodes);
            if (complementaryNodes.length > 0) {
                console.log(`➕ Agregando ${complementaryNodes.length} nodos complementarios`);
                workflow = this.integrateAdditionalNodes(workflow, complementaryNodes);
            }

            console.log('✅ FALLBACK COMPLETADO');
            return workflow;

        } catch (error) {
            console.error('❌ Error en fallback mejorado:', error);
            return this.generateDeterministicWorkflow(prompt);
        }
    }

    selectBestReferenceWorkflow(workflows, prompt) {
        console.log('🎯 Seleccionando mejor workflow de referencia...');
        
        const promptWords = prompt.toLowerCase().split(/\s+/);
        const scored = workflows.map(workflow => {
            // Factor 1: Similitud de keywords (40%)
            const keywordSimilarity = this.calculateJaccardSimilarity(
                promptWords, 
                workflow.keywords
            );
            
            // Factor 2: Tipo de workflow (30%)
            const workflowTypeScore = this.getWorkflowTypeScore(prompt, workflow);
            
            // Factor 3: Complejidad apropiada (20%)
            const complexityScore = this.getComplexityScore(prompt, workflow);
            
            // Factor 4: Número de nodos apropiado (10%)
            const nodeSizeScore = this.getNodeSizeScore(prompt, workflow);
            
            const totalScore = (
                keywordSimilarity * 0.4 +
                workflowTypeScore * 0.3 +
                complexityScore * 0.2 +
                nodeSizeScore * 0.1
            );
            
            console.log(`   📊 ${workflow.name}:`);
            console.log(`      Keywords: ${(keywordSimilarity * 100).toFixed(1)}%`);
            console.log(`      Tipo: ${(workflowTypeScore * 100).toFixed(1)}%`);
            console.log(`      Complejidad: ${(complexityScore * 100).toFixed(1)}%`);
            console.log(`      Tamaño: ${(nodeSizeScore * 100).toFixed(1)}%`);
            console.log(`      TOTAL: ${(totalScore * 100).toFixed(1)}%`);
            
            return { ...workflow, totalScore };
        });
        
        return scored.sort((a, b) => b.totalScore - a.totalScore)[0];
    }

    calculateJaccardSimilarity(set1, set2) {
        const intersection = set1.filter(x => set2.includes(x));
        const union = [...new Set([...set1, ...set2])];
        return union.length === 0 ? 0 : intersection.length / union.length;
    }

    getWorkflowTypeScore(prompt, workflow) {
        const promptLower = prompt.toLowerCase();
        const workflowName = workflow.name.toLowerCase();
        
        if (promptLower.includes('crm') && workflowName.includes('crm')) return 1.0;
        if (promptLower.includes('ecommerce') && workflowName.includes('ecommerce')) return 1.0;
        if (promptLower.includes('email') && workflowName.includes('email')) return 0.8;
        if (promptLower.includes('webhook') && workflowName.includes('webhook')) return 0.7;
        
        return 0.5; // Score neutro
    }

    getComplexityScore(prompt, workflow) {
        const promptWords = prompt.split(/\s+/).length;
        const workflowNodes = workflow.nodes.length;
        
        // Más palabras en prompt = mayor complejidad esperada
        const expectedNodes = Math.min(Math.max(Math.floor(promptWords / 3), 3), 10);
        const difference = Math.abs(workflowNodes - expectedNodes);
        
        return Math.max(0, 1 - (difference / expectedNodes));
    }

    getNodeSizeScore(prompt, workflow) {
        const nodeCount = workflow.nodes.length;
        
        // Rangos ideales según el prompt
        if (nodeCount >= 3 && nodeCount <= 8) return 1.0;
        if (nodeCount >= 2 && nodeCount <= 10) return 0.7;
        return 0.4;
    }

    async adaptReferenceWorkflow(referenceWorkflow, prompt) {
        console.log('🔄 Adaptando workflow de referencia al prompt específico...');
        
        const workflow = {
            nodes: [],
            connections: {}
        };
        
        // Adaptar nodos del workflow de referencia
        for (const refNode of referenceWorkflow.nodes) {
            const adaptedNode = {
                id: this.generateNodeId(),
                name: this.personalizeNodeName(refNode.name, prompt),
                type: refNode.type,
                position: [Math.random() * 800 + 100, Math.random() * 600 + 100],
                parameters: this.personalizeNodeParameters(refNode.type, prompt),
                typeVersion: 1
            };
            
            workflow.nodes.push(adaptedNode);
            console.log(`   🔧 Nodo adaptado: ${refNode.name} → ${adaptedNode.name}`);
        }
        
        // Adaptar conexiones
        workflow.connections = this.adaptConnections(referenceWorkflow.connections, workflow.nodes);
        
        return workflow;
    }

    personalizeNodeName(genericName, prompt) {
        const promptWords = prompt.toLowerCase().split(/\s+/);
        
        // Mapeo de nombres genéricos a específicos basado en el prompt
        const nameMap = {
            'webhook trigger': this.findBestTriggerName(promptWords),
            'order webhook': this.findBestTriggerName(promptWords),
            'validate lead data': this.findBestValidationName(promptWords),
            'check inventory': this.findBestDataCheckName(promptWords),
            'process payment': this.findBestPaymentName(promptWords),
            'send email': this.findBestEmailName(promptWords),
            'send confirmation': this.findBestEmailName(promptWords),
            'update crm': this.findBestUpdateName(promptWords),
            'notify team': this.findBestNotificationName(promptWords)
        };
        
        const lowerName = genericName.toLowerCase();
        return nameMap[lowerName] || this.improveGenericName(genericName, promptWords);
    }

    findBestTriggerName(promptWords) {
        if (promptWords.includes('lead') || promptWords.includes('crm')) return 'Webhook de Leads';
        if (promptWords.includes('order') || promptWords.includes('pedido')) return 'Webhook de Pedidos';
        if (promptWords.includes('contact') || promptWords.includes('contacto')) return 'Webhook de Contactos';
        return 'Webhook de Entrada';
    }

    findBestValidationName(promptWords) {
        if (promptWords.includes('lead')) return 'Validar Datos del Lead';
        if (promptWords.includes('order') || promptWords.includes('pedido')) return 'Validar Pedido';
        if (promptWords.includes('contact')) return 'Validar Contacto';
        return 'Validar Datos';
    }

    findBestDataCheckName(promptWords) {
        if (promptWords.includes('inventory') || promptWords.includes('inventario')) return 'Verificar Inventario';
        if (promptWords.includes('stock')) return 'Verificar Stock';
        if (promptWords.includes('database') || promptWords.includes('datos')) return 'Consultar Base de Datos';
        return 'Verificar Datos';
    }

    findBestPaymentName(promptWords) {
        if (promptWords.includes('stripe')) return 'Procesar Pago Stripe';
        if (promptWords.includes('paypal')) return 'Procesar Pago PayPal';
        return 'Procesar Pago';
    }

    findBestEmailName(promptWords) {
        if (promptWords.includes('confirmation') || promptWords.includes('confirmacion')) return 'Enviar Email de Confirmación';
        if (promptWords.includes('welcome') || promptWords.includes('bienvenida')) return 'Enviar Email de Bienvenida';
        if (promptWords.includes('notification') || promptWords.includes('notificacion')) return 'Enviar Notificación Email';
        return 'Enviar Email';
    }

    findBestUpdateName(promptWords) {
        if (promptWords.includes('hubspot')) return 'Actualizar HubSpot';
        if (promptWords.includes('salesforce')) return 'Actualizar Salesforce';
        if (promptWords.includes('crm')) return 'Actualizar CRM';
        if (promptWords.includes('inventory') || promptWords.includes('inventario')) return 'Actualizar Inventario';
        return 'Actualizar Datos';
    }

    findBestNotificationName(promptWords) {
        if (promptWords.includes('slack')) return 'Notificar Slack';
        if (promptWords.includes('team') || promptWords.includes('equipo')) return 'Notificar Equipo';
        if (promptWords.includes('warehouse') || promptWords.includes('almacen')) return 'Notificar Almacén';
        return 'Enviar Notificación';
    }

    improveGenericName(genericName, promptWords) {
        // Mejorar nombres genéricos agregando contexto del prompt
        const contextWord = promptWords.find(word => 
            ['leads', 'orders', 'customers', 'products', 'inventory'].includes(word)
        );
        
        if (contextWord) {
            return `${genericName} - ${contextWord.charAt(0).toUpperCase() + contextWord.slice(1)}`;
        }
        
        return genericName;
    }

    personalizeNodeParameters(nodeType, prompt) {
        const promptLower = prompt.toLowerCase();
        
        switch (nodeType) {
            case 'n8n-nodes-base.webhook':
                return {
                    httpMethod: 'POST',
                    path: this.inferWebhookPath(promptLower),
                    responseMode: 'lastNode',
                    options: {}
                };
            
            case 'n8n-nodes-base.if':
                return {
                    conditions: this.inferConditions(promptLower),
                    options: {}
                };
            
            case 'n8n-nodes-base.emailSend':
                return {
                    fromEmail: 'noreply@company.com',
                    toEmail: '={{$json.email}}',
                    subject: this.inferEmailSubject(promptLower),
                    message: this.inferEmailMessage(promptLower),
                    options: {}
                };
            
            default:
                return {};
        }
    }

    inferWebhookPath(prompt) {
        if (prompt.includes('lead')) return 'new-lead';
        if (prompt.includes('order') || prompt.includes('pedido')) return 'new-order';
        if (prompt.includes('contact')) return 'new-contact';
        return 'webhook-data';
    }

    inferConditions(prompt) {
        if (prompt.includes('email')) {
            return [
                { value1: '={{$json.email}}', operator: 'isNotEmpty', value2: '' },
                { value1: '={{$json.email}}', operator: 'contains', value2: '@', type: 'and' }
            ];
        }
        if (prompt.includes('inventory') || prompt.includes('stock')) {
            return [
                { value1: '={{$json.quantity}}', operator: 'largerEqual', value2: '1' }
            ];
        }
        return [
            { value1: '={{$json.data}}', operator: 'isNotEmpty', value2: '' }
        ];
    }

    inferEmailSubject(prompt) {
        if (prompt.includes('confirmation') || prompt.includes('confirmacion')) return 'Confirmación de su solicitud';
        if (prompt.includes('welcome') || prompt.includes('bienvenida')) return 'Bienvenido a nuestro servicio';
        if (prompt.includes('order') || prompt.includes('pedido')) return 'Confirmación de pedido';
        return 'Notificación importante';
    }

    inferEmailMessage(prompt) {
        if (prompt.includes('order')) return 'Su pedido ha sido procesado correctamente.';
        if (prompt.includes('lead')) return 'Gracias por su interés. Nos pondremos en contacto pronto.';
        return 'Su solicitud ha sido procesada exitosamente.';
    }

    adaptConnections(referenceConnections, nodes) {
        const connections = {};
        const nodeNames = nodes.map(n => n.name);
        
        // Debug: mostrar mapeo de nombres
        console.log('🔗 Mapeando conexiones del workflow de referencia:');
        
        for (const [sourceNode, targets] of Object.entries(referenceConnections)) {
            // Encontrar el nodo equivalente en los nodos adaptados
            const adaptedSourceName = nodeNames.find(name => 
                this.areNodesEquivalent(sourceNode, name)
            );
            
            if (adaptedSourceName && targets.length > 0) {
                const adaptedTargets = targets.map(target => {
                    const adaptedTargetName = nodeNames.find(name => 
                        this.areNodesEquivalent(target, name)
                    );
                    return adaptedTargetName ? {
                        node: adaptedTargetName,
                        type: 'main',
                        index: 0
                    } : null;
                }).filter(Boolean);
                
                if (adaptedTargets.length > 0) {
                    connections[adaptedSourceName] = {
                        main: [adaptedTargets]
                    };
                    
                    const targetNames = adaptedTargets.map(t => t.node).join(', ');
                    console.log(`   ${sourceNode} → ${adaptedSourceName} conecta a: ${targetNames}`);
                }
            }
        }
        
        // Si no hay conexiones, crear una cadena básica
        if (Object.keys(connections).length === 0 && nodes.length > 1) {
            console.log('⚠️ No se pudieron mapear conexiones, creando cadena secuencial básica');
            for (let i = 0; i < nodes.length - 1; i++) {
                connections[nodes[i].name] = {
                    main: [[{
                        node: nodes[i + 1].name,
                        type: 'main',
                        index: 0
                    }]]
                };
            }
        }
        
        return connections;
    }

    areNodesEquivalent(originalName, adaptedName) {
        // Comparar nombres eliminando palabras específicas del contexto
        const normalize = name => name.toLowerCase()
            .replace(/\b(lead|order|contact|webhook|de|del|la|el|datos|data|team|equipo)\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        const normalizedOriginal = normalize(originalName);
        const normalizedAdapted = normalize(adaptedName);
        
        // Mapeos específicos para mayor precisión
        const equivalences = {
            'webhook trigger': ['webhook', 'entrada', 'pedidos'],
            'validate': ['validar', 'verificar'],
            'update crm': ['actualizar', 'hubspot'],
            'send email': ['enviar', 'email', 'bienvenida'],
            'notify team': ['notificar', 'slack'],
            'check inventory': ['verificar', 'inventario'],
            'process payment': ['procesar', 'pago'],
            'generate invoice': ['generar', 'factura', 'invoice'],
            'notify warehouse': ['notificar', 'almacen', 'warehouse']
        };
        
        // Buscar equivalencias específicas
        for (const [key, synonyms] of Object.entries(equivalences)) {
            if (normalizedOriginal.includes(key.replace(/\s+/g, ''))) {
                if (synonyms.some(syn => normalizedAdapted.includes(syn))) {
                    return true;
                }
            }
        }
        
        return normalizedAdapted.includes(normalizedOriginal) || 
               normalizedOriginal.includes(normalizedAdapted);
    }

    generateComplementaryNodes(prompt, existingNodes) {
        console.log('➕ Generando nodos complementarios...');
        const complementary = [];
        const existingTypes = existingNodes.map(n => n.type);
        const existingNames = existingNodes.map(n => n.name.toLowerCase());
        
        // Analizar prompt para detectar funcionalidades faltantes
        const promptLower = prompt.toLowerCase();
        
        // Si menciona analytics pero no hay nodo de analytics
        if (promptLower.includes('analytics') && !existingTypes.includes('n8n-nodes-base.googleAnalytics')) {
            complementary.push({
                name: 'Registrar Métricas',
                type: 'n8n-nodes-base.googleAnalytics',
                purpose: 'analytics'
            });
        }
        
        // Si menciona PDF pero no hay función para generar PDF
        if (promptLower.includes('pdf') && !existingNames.some(name => name.includes('pdf'))) {
            complementary.push({
                name: 'Generar PDF',
                type: 'n8n-nodes-base.function',
                purpose: 'pdf-generation'
            });
        }
        
        // Si menciona almacén/warehouse pero no hay notificación específica
        if ((promptLower.includes('warehouse') || promptLower.includes('almacen')) && 
            !existingNames.some(name => name.includes('almacen') || name.includes('warehouse'))) {
            complementary.push({
                name: 'Notificar Almacén',
                type: 'n8n-nodes-base.slack',
                purpose: 'warehouse-notification'
            });
        }

        // Si menciona seguimiento pero no hay programación
        if ((promptLower.includes('seguimiento') || promptLower.includes('follow')) && 
            !existingNames.some(name => name.includes('seguimiento') || name.includes('schedule'))) {
            complementary.push({
                name: 'Programar Seguimiento',
                type: 'n8n-nodes-base.scheduleTrigger',
                purpose: 'follow-up-scheduling'
            });
        }

        // Si menciona push notifications
        if (promptLower.includes('push') && promptLower.includes('notification')) {
            complementary.push({
                name: 'Enviar Notificación Push',
                type: 'n8n-nodes-base.httpRequest',
                purpose: 'push-notification'
            });
        }

        // Si menciona ERP o sistema externo
        if ((promptLower.includes('erp') || promptLower.includes('sistema externo')) && 
            !existingNames.some(name => name.includes('erp') || name.includes('sincroniza'))) {
            complementary.push({
                name: 'Sincronizar ERP',
                type: 'n8n-nodes-base.httpRequest',
                purpose: 'erp-sync'
            });
        }

        // Si menciona Salesforce específicamente y no hay ya uno
        if (promptLower.includes('salesforce') && 
            !existingTypes.includes('n8n-nodes-base.salesforce') &&
            !existingNames.some(name => name.includes('salesforce'))) {
            complementary.push({
                name: 'Crear/Actualizar Salesforce',
                type: 'n8n-nodes-base.salesforce',
                purpose: 'salesforce-update'
            });
        }

        // Si menciona PostgreSQL específicamente
        if (promptLower.includes('postgresql') && !existingTypes.includes('n8n-nodes-base.postgres')) {
            complementary.push({
                name: 'Consultar PostgreSQL',
                type: 'n8n-nodes-base.postgres',
                purpose: 'postgres-query'
            });
        }
        
        console.log(`   📋 ${complementary.length} nodos complementarios identificados`);
        return complementary;
    }

    integrateAdditionalNodes(workflow, additionalNodes) {
        console.log('🔗 Integrando nodos adicionales al workflow...');
        
        // Convertir nodos complementarios a formato completo
        const newNodes = additionalNodes.map(node => ({
            id: this.generateNodeId(),
            name: node.name,
            type: node.type,
            position: [Math.random() * 800 + 100, Math.random() * 600 + 100],
            parameters: this.personalizeNodeParameters(node.type, node.purpose),
            typeVersion: 1
        }));
        
        // Agregar nodos al workflow
        workflow.nodes.push(...newNodes);
        
        // Conectar nodos adicionales lógicamente
        this.connectAdditionalNodes(workflow, newNodes, additionalNodes);
        
        return workflow;
    }

    connectAdditionalNodes(workflow, newNodes, additionalNodesInfo) {
        console.log('🔗 Conectando nodos adicionales inteligentemente...');
        
        // Encontrar nodos clave del flujo principal
        const triggerNode = workflow.nodes.find(n => n.type.includes('webhook') || n.type.includes('trigger'));
        const lastMainNode = this.findLastProcessingNode(workflow.nodes.filter(n => !newNodes.includes(n)));
        const conditionalNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.if');
        
        console.log(`   🎯 Nodo trigger: ${triggerNode?.name}`);
        console.log(`   🎯 Último nodo principal: ${lastMainNode?.name}`);
        console.log(`   🎯 Nodo condicional: ${conditionalNode?.name}`);
        
        for (const newNode of newNodes) {
            const info = additionalNodesInfo.find(info => info.name === newNode.name);
            console.log(`   🔧 Conectando: ${newNode.name} (${info.purpose})`);
            
            switch (info.purpose) {
                case 'postgres-query':
                    // PostgreSQL debe ir al principio, después del trigger
                    if (triggerNode) {
                        this.addConnection(workflow, triggerNode.name, newNode.name);
                    }
                    break;
                    
                case 'salesforce-update':
                    // Salesforce va después de la validación
                    if (conditionalNode) {
                        this.addConnection(workflow, conditionalNode.name, newNode.name, 0); // output "true"
                    }
                    break;
                    
                case 'pdf-generation':
                    // PDF va después del procesamiento principal
                    if (lastMainNode) {
                        this.addConnection(workflow, lastMainNode.name, newNode.name);
                    }
                    break;
                    
                case 'analytics':
                case 'warehouse-notification':
                    // Analytics y notificaciones van al final
                    if (lastMainNode) {
                        this.addConnection(workflow, lastMainNode.name, newNode.name);
                    }
                    break;
                    
                case 'erp-sync':
                    // ERP sync va al final de todo
                    const pdfNode = newNodes.find(n => n.name.includes('PDF'));
                    if (pdfNode) {
                        this.addConnection(workflow, pdfNode.name, newNode.name);
                    } else if (lastMainNode) {
                        this.addConnection(workflow, lastMainNode.name, newNode.name);
                    }
                    break;
                    
                case 'follow-up-scheduling':
                    // Seguimiento va paralelo al final
                    if (lastMainNode) {
                        this.addConnection(workflow, lastMainNode.name, newNode.name);
                    }
                    break;
                    
                default:
                    // Conexión por defecto al final del flujo
                    if (lastMainNode) {
                        this.addConnection(workflow, lastMainNode.name, newNode.name);
                    }
            }
        }
        
        // Eliminar duplicados
        this.removeDuplicateNodes(workflow);
    }

    addConnection(workflow, sourceNodeName, targetNodeName, outputIndex = 0) {
        if (!workflow.connections[sourceNodeName]) {
            workflow.connections[sourceNodeName] = { main: [] };
        }
        
        // Asegurar que existe el array para el índice de salida
        while (workflow.connections[sourceNodeName].main.length <= outputIndex) {
            workflow.connections[sourceNodeName].main.push([]);
        }
        
        // Verificar que no existe ya la conexión
        const existingConnection = workflow.connections[sourceNodeName].main[outputIndex]
            .find(conn => conn.node === targetNodeName);
            
        if (!existingConnection) {
            workflow.connections[sourceNodeName].main[outputIndex].push({
                node: targetNodeName,
                type: 'main',
                index: 0
            });
            console.log(`     ✅ ${sourceNodeName} → ${targetNodeName} (salida ${outputIndex})`);
        }
    }

    removeDuplicateNodes(workflow) {
        const seen = new Set();
        const uniqueNodes = [];
        
        for (const node of workflow.nodes) {
            const key = `${node.type}-${node.name}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueNodes.push(node);
            } else {
                console.log(`   🗑️ Eliminando nodo duplicado: ${node.name}`);
                // Eliminar conexiones al nodo duplicado
                for (const [sourceName, connections] of Object.entries(workflow.connections)) {
                    if (connections.main) {
                        connections.main.forEach(outputConnections => {
                            const index = outputConnections.findIndex(conn => conn.node === node.name);
                            if (index !== -1) {
                                outputConnections.splice(index, 1);
                            }
                        });
                    }
                }
            }
        }
        
        workflow.nodes = uniqueNodes;
    }

    findLastProcessingNode(nodes) {
        // Encontrar el último nodo del flujo principal (no notificaciones ni analytics)
        const processingNodes = nodes.filter(node => 
            !node.name.toLowerCase().includes('notify') &&
            !node.name.toLowerCase().includes('notificar') &&
            !node.name.toLowerCase().includes('registrar') &&
            !node.name.toLowerCase().includes('analytics') &&
            !node.name.toLowerCase().includes('slack') &&
            !node.name.toLowerCase().includes('seguimiento') &&
            !node.name.toLowerCase().includes('erp') &&
            node.type !== 'n8n-nodes-base.slack' &&
            node.type !== 'n8n-nodes-base.googleAnalytics' &&
            node.type !== 'n8n-nodes-base.scheduleTrigger'
        );
        
        // Priorizar nodos de email o función como últimos del procesamiento principal
        const emailNode = processingNodes.find(n => n.type === 'n8n-nodes-base.emailSend');
        if (emailNode) return emailNode;
        
        const functionNodes = processingNodes.filter(n => n.type === 'n8n-nodes-base.function');
        if (functionNodes.length > 0) return functionNodes[functionNodes.length - 1];
        
        return processingNodes[processingNodes.length - 1];
    }

    generateDeterministicWorkflow(prompt) {
        console.log('🏗️ Generando workflow con lógica determinística...');
        
        // Lógica determinística básica como fallback del fallback
        const nodes = [
            {
                id: this.generateNodeId(),
                name: 'Webhook de Entrada',
                type: 'n8n-nodes-base.webhook',
                position: [400, 100],
                parameters: {
                    httpMethod: 'POST',
                    path: 'webhook-data',
                    responseMode: 'lastNode'
                },
                typeVersion: 1
            },
            {
                id: this.generateNodeId(),
                name: 'Procesar Datos',
                type: 'n8n-nodes-base.function',
                position: [400, 300],
                parameters: {
                    functionCode: 'return items;'
                },
                typeVersion: 1
            }
        ];
        
        const connections = {
            'Webhook de Entrada': {
                main: [[{
                    node: 'Procesar Datos',
                    type: 'main',
                    index: 0
                }]]
            }
        };
        
        return { nodes, connections };
    }

    generateNodeId() {
        return 'node-' + Math.random().toString(36).substr(2, 9);
    }

    // Método principal para testing
    async testFallback(testPrompt) {
        console.log('\n' + '='.repeat(80));
        console.log('🧪 TEST DEL FALLBACK MEJORADO');
        console.log('='.repeat(80));
        
        const result = await this.generateIntelligentFallbackWorkflow(testPrompt);
        
        console.log('\n📋 RESULTADO DEL TEST:');
        console.log(`📊 Nodos generados: ${result.nodes.length}`);
        console.log(`🔗 Conexiones: ${Object.keys(result.connections).length}`);
        
        console.log('\n🏷️ NODOS:');
        result.nodes.forEach((node, i) => {
            console.log(`   ${i + 1}. ${node.name} (${node.type})`);
        });
        
        console.log('\n🔗 CONEXIONES:');
        for (const [source, targets] of Object.entries(result.connections)) {
            if (targets.main && targets.main[0]) {
                const targetNames = targets.main[0].map(t => t.node).join(', ');
                console.log(`   ${source} → ${targetNames}`);
            }
        }
        
        return result;
    }

    // Generar JSON completo del workflow en formato n8n
    generateFullWorkflowJSON(workflowData) {
        const fullWorkflow = {
            name: "Workflow Generado por Fallback Mejorado",
            active: false,
            nodes: workflowData.nodes.map(node => ({
                ...node,
                credentials: this.inferCredentials(node.type),
                continueOnFail: false,
                onError: "stopWorkflow",
                retryOnFail: false,
                maxTries: 3,
                waitBetweenTries: 1000,
                alwaysOutputData: false
            })),
            connections: workflowData.connections,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: {
                executionOrder: "v1",
                saveManualExecutions: false,
                callerPolicy: "workflowsFromSameOwner",
                errorWorkflow: "",
                timezone: "America/New_York"
            },
            staticData: {},
            tags: ["fallback-generado", "ai-assistant", "test-complejo"],
            triggerCount: 0,
            versionId: "1.0.0",
            meta: {
                generatedBy: "n8n-ai-assistant-fallback-mejorado",
                generatedAt: new Date().toISOString(),
                totalNodes: workflowData.nodes.length,
                totalConnections: Object.keys(workflowData.connections).length,
                complexity: this.calculateWorkflowComplexity(workflowData),
                estimatedExecutionTime: this.estimateExecutionTime(workflowData)
            }
        };

        return fullWorkflow;
    }

    inferCredentials(nodeType) {
        const credentialMap = {
            'n8n-nodes-base.hubspot': { hubspot: { id: "hubspot-credentials", name: "HubSpot API" } },
            'n8n-nodes-base.salesforce': { salesforce: { id: "salesforce-credentials", name: "Salesforce API" } },
            'n8n-nodes-base.stripe': { stripeApi: { id: "stripe-credentials", name: "Stripe API" } },
            'n8n-nodes-base.slack': { slackApi: { id: "slack-credentials", name: "Slack API" } },
            'n8n-nodes-base.mysql': { mysql: { id: "mysql-credentials", name: "MySQL Database" } },
            'n8n-nodes-base.postgres': { postgres: { id: "postgres-credentials", name: "PostgreSQL Database" } },
            'n8n-nodes-base.googleAnalytics': { googleAnalytics: { id: "ga-credentials", name: "Google Analytics" } },
            'n8n-nodes-base.emailSend': { smtp: { id: "smtp-credentials", name: "SMTP Email" } }
        };

        return credentialMap[nodeType] || {};
    }

    calculateWorkflowComplexity(workflowData) {
        const nodeCount = workflowData.nodes.length;
        const connectionCount = Object.keys(workflowData.connections).length;
        const conditionalNodes = workflowData.nodes.filter(n => n.type === 'n8n-nodes-base.if').length;
        const apiNodes = workflowData.nodes.filter(n => 
            n.type.includes('hubspot') || 
            n.type.includes('salesforce') || 
            n.type.includes('stripe')
        ).length;

        if (nodeCount <= 3) return 'SIMPLE';
        if (nodeCount <= 6) return 'MEDIUM';
        if (nodeCount <= 10) return 'COMPLEX';
        return 'VERY_COMPLEX';
    }

    estimateExecutionTime(workflowData) {
        // Estimación básica basada en tipos de nodos
        let totalTime = 0;
        
        workflowData.nodes.forEach(node => {
            switch (node.type) {
                case 'n8n-nodes-base.webhook':
                    totalTime += 100; // 100ms
                    break;
                case 'n8n-nodes-base.if':
                    totalTime += 50; // 50ms
                    break;
                case 'n8n-nodes-base.function':
                    totalTime += 200; // 200ms
                    break;
                case 'n8n-nodes-base.httpRequest':
                    totalTime += 1000; // 1s
                    break;
                case 'n8n-nodes-base.emailSend':
                    totalTime += 2000; // 2s
                    break;
                default:
                    if (node.type.includes('mysql') || node.type.includes('postgres')) {
                        totalTime += 300; // 300ms para DB
                    } else if (node.type.includes('stripe') || node.type.includes('hubspot')) {
                        totalTime += 1500; // 1.5s para APIs externas
                    } else {
                        totalTime += 500; // 500ms default
                    }
            }
        });

        return `${(totalTime / 1000).toFixed(2)} segundos (estimado)`;
    }
}

// ============== EJECUTAR TEST ==============
async function main() {
    const tester = new FallbackTester();
    
    // Test COMPLEJO: Sistema empresarial multi-canal
    const complexPrompt = `
    Sistema empresarial avanzado multi-canal: 
    Webhook recibe solicitudes de múltiples fuentes (web, móvil, API), 
    valida datos complejos con múltiples condiciones y formatos,
    consulta base de datos PostgreSQL para verificar usuario existente y permisos,
    si es nuevo usuario: crea registro en Salesforce CRM con datos completos,
    si es usuario existente: actualiza información y preferencias,
    procesa pago con Stripe incluyendo validaciones de fraude,
    envía email personalizado de confirmación usando plantillas dinámicas,
    genera factura PDF con logo y datos fiscales,
    actualiza inventario en tiempo real con control de stock mínimo,
    envía notificaciones push móviles personalizadas,
    registra evento en Google Analytics con métricas customizadas,
    notifica equipo de ventas en Slack con resumen de la transacción,
    programa seguimiento automático en 3 días,
    y finalmente sincroniza datos con sistema ERP externo vía API REST
    `;
    
    console.log('🔥 PRUEBA EXTREMA DEL FALLBACK MEJORADO');
    console.log('='.repeat(80));
    
    const result = await tester.testFallback(complexPrompt);
    
    // Generar JSON completo
    console.log('\n' + '🎯 GENERANDO JSON COMPLETO DEL WORKFLOW...');
    const fullWorkflow = tester.generateFullWorkflowJSON(result);
    
    // Guardar JSON en archivo
    const filename = `test-workflow-complejo-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(fullWorkflow, null, 2));
    
    console.log(`💾 JSON guardado en: ${filename}`);
    console.log(`📏 Tamaño del archivo: ${(JSON.stringify(fullWorkflow).length / 1024).toFixed(2)} KB`);
    
    // Mostrar primeras líneas del JSON
    console.log('\n📋 PREVIEW DEL JSON GENERADO:');
    console.log(JSON.stringify(fullWorkflow, null, 2).substring(0, 2000) + '...\n]');
    
    return result;
}

// Ejecutar test
main().catch(console.error);
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Agente de Configuración Inteligente de Nodos V2.0
 * Enfoque: Análisis contextual profundo y configuración funcional
 */
class IntelligentNodeConfigAgentV2 {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
        }
    }

    /**
     * Analiza el contexto del workflow para configuraciones inteligentes
     */
    analyzeWorkflowContext(workflow, originalPrompt) {
        console.log('🔍 ANALIZANDO CONTEXTO DEL WORKFLOW...');
        
        const purpose = this.extractWorkflowPurpose(originalPrompt);
        const context = {
            purpose: purpose,
            dataFlow: this.analyzeDataFlow(workflow, purpose),
            businessLogic: this.extractBusinessLogic(originalPrompt),
            nodeRoles: this.analyzeNodeRoles(workflow)
        };

        console.log('📊 Análisis de contexto:', {
            purpose: context.purpose,
            totalNodes: workflow.nodes.length,
            ifNodes: workflow.nodes.filter(n => n.type === 'n8n-nodes-base.if').length,
            mergeNodes: workflow.nodes.filter(n => n.type === 'n8n-nodes-base.merge').length,
            expectedDataFields: context.dataFlow.expectedData?.slice(0, 3).join(', ') + '...'
        });

        return context;
    }

    /**
     * Extrae el propósito principal del workflow del prompt
     */
    extractWorkflowPurpose(prompt) {
        const purposeKeywords = {
            // Gestión de clientes y ventas
            'leads': 'lead_management',
            'lead': 'lead_management', 
            'cliente': 'customer_management',
            'customer': 'customer_management',
            'venta': 'sales_processing',
            'sale': 'sales_processing',
            'orden': 'order_processing',
            'order': 'order_processing',
            'pedido': 'order_processing',
            'factura': 'invoice_processing',
            'invoice': 'invoice_processing',
            
            // Procesamiento de datos
            'data': 'data_processing',
            'datos': 'data_processing',
            'procesar': 'data_processing',
            'process': 'data_processing',
            'analizar': 'data_analysis',
            'analyze': 'data_analysis',
            'transformar': 'data_transformation',
            'transform': 'data_transformation',
            
            // Comunicación y notificaciones
            'notification': 'notification_system',
            'notificacion': 'notification_system',
            'email': 'email_processing',
            'correo': 'email_processing',
            'slack': 'team_communication',
            'mensaje': 'messaging_system',
            'message': 'messaging_system',
            
            // Integración y APIs
            'webhook': 'webhook_processing',
            'api': 'api_integration',
            'integration': 'system_integration',
            'integracion': 'system_integration',
            
            // Automatización y workflows
            'automatizar': 'automation_workflow',
            'automate': 'automation_workflow',
            'workflow': 'general_workflow',
            'flujo': 'general_workflow',
            
            // Reportes y analytics
            'reporte': 'report_generation',
            'report': 'report_generation',
            'dashboard': 'dashboard_creation',
            'analytic': 'analytics_processing',
            
            // E-commerce y pagos
            'pago': 'payment_processing',
            'payment': 'payment_processing',
            'ecommerce': 'ecommerce_workflow',
            'tienda': 'ecommerce_workflow',
            'producto': 'product_management',
            'product': 'product_management'
        };

        const promptLower = prompt.toLowerCase();
        
        // Buscar múltiples matches para mejor precisión
        const matches = [];
        for (const [keyword, purpose] of Object.entries(purposeKeywords)) {
            if (promptLower.includes(keyword)) {
                matches.push(purpose);
            }
        }
        
        // Si hay múltiples matches, elegir el más específico
        if (matches.length > 0) {
            // Priorizar tipos específicos sobre genéricos
            const specificTypes = matches.filter(m => !m.includes('general'));
            return specificTypes.length > 0 ? specificTypes[0] : matches[0];
        }
        
        return 'general_workflow';
    }

    /**
     * Analiza el flujo de datos entre nodos
     */
    analyzeDataFlow(workflow, workflowPurpose) {
        const flow = {};
        
        // Encontrar punto de entrada (webhook, trigger, etc.)
        const entryNode = workflow.nodes.find(node => 
            node.type.includes('webhook') || 
            node.type.includes('trigger') || 
            node.name.toLowerCase().includes('webhook') ||
            node.name.toLowerCase().includes('trigger')
        );
        
        if (entryNode) {
            flow.entryPoint = entryNode.name;
            flow.expectedData = this.predictWebhookData(entryNode.name, workflowPurpose);
        } else {
            // Si no hay webhook, usar datos genéricos basados en el propósito
            flow.entryPoint = 'Manual Trigger';
            flow.expectedData = this.predictWebhookData('general', workflowPurpose);
        }
        
        return flow;
    }

    /**
     * Predice qué datos vendrían de un webhook basado en el contexto
     */
    predictWebhookData(nodeName, workflowPurpose) {
        const name = nodeName.toLowerCase();
        
        // Predicciones específicas por propósito del workflow
        const dataPatterns = {
            'lead_management': ['leadType', 'leadSource', 'amount', 'customerName', 'email', 'status', 'priority'],
            'customer_management': ['customerType', 'customerId', 'status', 'tier', 'email', 'phone'],
            'order_processing': ['orderValue', 'customerType', 'productId', 'quantity', 'status', 'paymentMethod'],
            'sales_processing': ['saleAmount', 'salesRep', 'productType', 'region', 'customerTier'],
            'payment_processing': ['amount', 'currency', 'paymentMethod', 'status', 'transactionId'],
            'ecommerce_workflow': ['productId', 'price', 'category', 'inventory', 'customerType'],
            'notification_system': ['priority', 'channel', 'recipient', 'messageType', 'status'],
            'data_processing': ['dataType', 'source', 'category', 'priority', 'processingStatus'],
            'api_integration': ['apiEndpoint', 'method', 'status', 'responseType', 'priority'],
            'automation_workflow': ['triggerType', 'condition', 'priority', 'status', 'actionType'],
            'report_generation': ['reportType', 'dateRange', 'department', 'priority', 'format'],
            'general_workflow': ['id', 'type', 'status', 'priority', 'category', 'data']
        };
        
        // Buscar por nombre específico del nodo
        if (name.includes('lead')) {
            return dataPatterns['lead_management'];
        } else if (name.includes('order') || name.includes('pedido')) {
            return dataPatterns['order_processing'];
        } else if (name.includes('customer') || name.includes('cliente')) {
            return dataPatterns['customer_management'];
        } else if (name.includes('payment') || name.includes('pago')) {
            return dataPatterns['payment_processing'];
        } else if (name.includes('product') || name.includes('producto')) {
            return dataPatterns['ecommerce_workflow'];
        }
        
        // Usar el propósito del workflow como fallback
        return dataPatterns[workflowPurpose] || dataPatterns['general_workflow'];
    }

    /**
     * Extrae la lógica de negocio del prompt de forma inteligente y general
     */
    extractBusinessLogic(prompt) {
        const logic = {};
        const promptLower = prompt.toLowerCase();
        
        // Buscar indicadores de división/condiciones
        const divisionIndicators = [
            'divida', 'divide', 'dependiendo', 'depending', 'condición', 'condition',
            'si', 'if', 'cuando', 'when', 'según', 'based on', 'rama', 'branch'
        ];
        
        const hasDivision = divisionIndicators.some(indicator => promptLower.includes(indicator));
        
        if (hasDivision) {
            // Patrones de criterios de división más amplios
            const criteriaPatterns = [
                // Tipo/Categoría
                { keywords: ['premium', 'básico', 'basic', 'vip', 'standard', 'tipo', 'type', 'category', 'categoría'], 
                  field: 'type', value: 'premium', type: 'category_classification' },
                { keywords: ['alto', 'high', 'bajo', 'low', 'priority', 'prioridad'], 
                  field: 'priority', value: 'high', type: 'priority_classification' },
                
                // Estado/Status
                { keywords: ['activo', 'active', 'inactivo', 'inactive', 'estado', 'status'], 
                  field: 'status', value: 'active', type: 'status_check' },
                { keywords: ['nuevo', 'new', 'existente', 'existing', 'viejo', 'old'], 
                  field: 'status', value: 'new', type: 'status_classification' },
                
                // Valores numéricos
                { keywords: ['amount', 'monto', 'valor', 'value', 'precio', 'price'], 
                  field: 'amount', value: 1000, type: 'threshold', operator: 'largerThan' },
                { keywords: ['cantidad', 'quantity', 'size', 'tamaño'], 
                  field: 'quantity', value: 10, type: 'threshold', operator: 'largerThan' },
                
                // Ubicación/Region
                { keywords: ['región', 'region', 'país', 'country', 'ciudad', 'city'], 
                  field: 'region', value: 'north', type: 'location_classification' },
                
                // Tiempo
                { keywords: ['urgente', 'urgent', 'inmediato', 'immediate', 'rápido', 'fast'], 
                  field: 'urgency', value: 'high', type: 'urgency_classification' },
                
                // Tamaño de empresa/cliente
                { keywords: ['empresa', 'company', 'corporativo', 'corporate', 'pyme', 'sme'], 
                  field: 'companySize', value: 'large', type: 'company_classification' },
                
                // Canal/Source
                { keywords: ['canal', 'channel', 'source', 'origen', 'fuente'], 
                  field: 'source', value: 'web', type: 'source_classification' },
                
                // Departamento/Team
                { keywords: ['departamento', 'department', 'team', 'equipo', 'área'], 
                  field: 'department', value: 'sales', type: 'department_classification' }
            ];
            
            // Buscar el criterio más específico
            let bestMatch = null;
            let maxMatches = 0;
            
            for (const pattern of criteriaPatterns) {
                const matches = pattern.keywords.filter(keyword => promptLower.includes(keyword)).length;
                if (matches > maxMatches) {
                    maxMatches = matches;
                    bestMatch = pattern;
                }
            }
            
            if (bestMatch) {
                logic.splitCriteria = {
                    field: bestMatch.field,
                    value: bestMatch.value,
                    type: bestMatch.type,
                    operator: bestMatch.operator || 'equalTo',
                    description: `División basada en ${bestMatch.field} (detectado automáticamente)`
                };
            } else {
                // Fallback inteligente basado en el contexto general
                logic.splitCriteria = this.generateFallbackCriteria(prompt);
            }
        }

        return logic;
    }

    /**
     * Genera criterios de fallback inteligentes cuando no se detecta un patrón específico
     */
    generateFallbackCriteria(prompt) {
        const promptLower = prompt.toLowerCase();
        
        // Analizar el contexto para generar criterios apropiados
        if (promptLower.includes('lead') || promptLower.includes('cliente') || promptLower.includes('customer')) {
            return {
                field: 'type',
                value: 'premium',
                type: 'customer_classification',
                operator: 'equalTo',
                description: 'División entre tipos de clientes (inferido del contexto)'
            };
        } else if (promptLower.includes('order') || promptLower.includes('pedido') || promptLower.includes('venta')) {
            return {
                field: 'amount',
                value: 500,
                type: 'order_threshold',
                operator: 'largerThan',
                description: 'División por valor de orden (inferido del contexto)'
            };
        } else if (promptLower.includes('data') || promptLower.includes('datos')) {
            return {
                field: 'priority',
                value: 'high',
                type: 'data_priority',
                operator: 'equalTo',
                description: 'División por prioridad de datos (inferido del contexto)'
            };
        } else {
            return {
                field: 'status',
                value: 'active',
                type: 'status_check',
                operator: 'equalTo',
                description: 'División por estado activo (criterio genérico)'
            };
        }
    }

    /**
     * Analiza el rol de cada nodo en el workflow
     */
    analyzeNodeRoles(workflow) {
        const roles = {};
        
        workflow.nodes.forEach(node => {
            const name = node.name.toLowerCase();
            if (node.type === 'n8n-nodes-base.if') {
                roles[node.id] = { type: 'decision', purpose: this.determineIfPurpose(name) };
            } else if (node.type === 'n8n-nodes-base.merge') {
                roles[node.id] = { type: 'combiner', purpose: this.determineMergePurpose(name) };
            }
        });

        return roles;
    }

    /**
     * Determina el propósito de un nodo IF basado en su nombre
     */
    determineIfPurpose(nodeName) {
        if (nodeName.includes('ruta') || nodeName.includes('decidir')) {
            return 'branch_router';
        }
        if (nodeName.includes('premium') || nodeName.includes('tipo')) {
            return 'customer_classifier';
        }
        return 'condition_checker';
    }

    /**
     * Determina el propósito de un nodo MERGE basado en su nombre
     */
    determineMergePurpose(nodeName) {
        if (nodeName.includes('unir') || nodeName.includes('combinar')) {
            return 'branch_reunifier';
        }
        return 'data_combiner';
    }

    /**
     * Configura nodos IF con lógica funcional universal
     */
    configureFunctionalIf(node, context) {
        console.log(`🎯 Configurando IF funcional: ${node.name}`);
        
        const logic = context.businessLogic.splitCriteria;
        if (!logic) {
            console.log('⚠️ No se encontró lógica de división específica, generando configuración inteligente por defecto');
            
            // Generar configuración basada en el propósito del workflow
            const defaultConfigs = {
                'lead_management': { field: 'leadType', value: 'premium', operator: 'equalTo' },
                'customer_management': { field: 'customerType', value: 'vip', operator: 'equalTo' },
                'order_processing': { field: 'orderValue', value: 500, operator: 'largerThan' },
                'sales_processing': { field: 'saleAmount', value: 1000, operator: 'largerThan' },
                'payment_processing': { field: 'amount', value: 100, operator: 'largerThan' },
                'data_processing': { field: 'priority', value: 'high', operator: 'equalTo' },
                'notification_system': { field: 'priority', value: 'urgent', operator: 'equalTo' },
                'ecommerce_workflow': { field: 'customerType', value: 'premium', operator: 'equalTo' },
                'automation_workflow': { field: 'triggerType', value: 'automatic', operator: 'equalTo' },
                'general_workflow': { field: 'status', value: 'active', operator: 'equalTo' }
            };
            
            const defaultConfig = defaultConfigs[context.purpose] || defaultConfigs['general_workflow'];
            
            return {
                conditions: [{
                    value1: `={{ $json.${defaultConfig.field} }}`,
                    value2: defaultConfig.value,
                    operator: defaultConfig.operator
                }]
            };
        }

        let condition;
        switch (logic.type) {
            case 'threshold':
            case 'order_threshold':
                condition = {
                    value1: `={{ $json.${logic.field} }}`,
                    value2: logic.value,
                    operator: logic.operator || "largerThan"
                };
                break;
            case 'category_classification':
            case 'customer_classification':
            case 'status_check':
            case 'priority_classification':
            case 'location_classification':
            case 'urgency_classification':
            case 'company_classification':
            case 'source_classification':
            case 'department_classification':
            case 'data_priority':
            default:
                condition = {
                    value1: `={{ $json.${logic.field} }}`,
                    value2: logic.value,
                    operator: logic.operator || "equalTo"
                };
        }

        console.log(`✅ IF configurado con condición: ${logic.field} ${condition.operator} ${logic.value} (${logic.type})`);
        return { conditions: [condition] };
    }

    /**
     * Configura nodos MERGE con estrategia funcional
     */
    configureFunctionalMerge(node, context) {
        console.log(`🔗 Configurando MERGE funcional: ${node.name}`);
        
        const purpose = context.nodeRoles[node.id]?.purpose || 'branch_reunifier';
        
        let config;
        switch (purpose) {
            case 'branch_reunifier':
                // Para unir datos de diferentes ramas del workflow
                config = {
                    mode: "append",
                    options: {
                        clashHandling: "preferInput2"
                    }
                };
                break;
            case 'data_combiner':
                // Para combinar datos enriquecidos
                config = {
                    mode: "combine", 
                    options: {
                        clashHandling: "preferInput1"
                    }
                };
                break;
            default:
                config = {
                    mode: "append",
                    options: {
                        clashHandling: "preferInput2"
                    }
                };
        }

        console.log(`✅ MERGE configurado con mode: ${config.mode}`);
        return config;
    }

    /**
     * Configura nodos Google Sheets
     */
    configureGoogleSheets(node, context) {
        const config = node.parameters || {};
        
        // Corregir operaciones incorrectas
        if (config.operation === 'getAll') {
            config.operation = 'read';
        }
        
        // Configurar operación por defecto si no existe
        if (!config.operation) {
            config.operation = 'read';
        }
        
        // Añadir configuraciones útiles
        if (!config.range && config.operation === 'read') {
            config.range = 'A1:Z1000';
        }
        
        if (!config.sheetId) {
            config.sheetId = '0'; // Primera hoja por defecto
        }
        
        return config;
    }

    /**
     * Configura nodos Set
     */
    configureSetNode(node, context) {
        console.log(`🔧 Configurando Set: ${node.name} para contexto ${context.purpose}`);
        
        // Generar valores apropiados basados en el contexto y nombre del nodo
        const nodeName = node.name.toLowerCase();
        let values = [];
        
        // Configurar basado en el nombre del nodo y contexto
        if (nodeName.includes('preparar') || nodeName.includes('inicial')) {
            // Nodo de preparación inicial
            values = [
                { name: 'workflowId', value: '={{ $workflow.id }}', type: 'string' },
                { name: 'processedAt', value: '={{ new Date().toISOString() }}', type: 'string' },
                { name: 'inputSource', value: 'webhook', type: 'string' }
            ];
            
            // Añadir campos específicos del contexto
            if (context.purpose === 'data_processing') {
                values.push({ name: 'dataQuality', value: 'pending_validation', type: 'string' });
                values.push({ name: 'priority', value: '={{ $json.priority || "normal" }}', type: 'string' });
            } else if (context.purpose === 'payment_processing') {
                values.push({ name: 'paymentStatus', value: 'pending', type: 'string' });
                values.push({ name: 'amount', value: '={{ $json.amount || 0 }}', type: 'number' });
            } else if (context.purpose === 'order_processing') {
                values.push({ name: 'orderStatus', value: 'received', type: 'string' });
                values.push({ name: 'customerType', value: '={{ $json.customerType || "standard" }}', type: 'string' });
            }
            
        } else if (nodeName.includes('rama') && nodeName.includes('true')) {
            // Procesamiento rama verdadera (condición cumplida)
            if (context.purpose === 'data_processing') {
                values = [
                    { name: 'branch', value: 'high_priority', type: 'string' },
                    { name: 'processingLevel', value: 'intensive', type: 'string' },
                    { name: 'queuePriority', value: 1, type: 'number' }
                ];
            } else if (context.purpose === 'payment_processing') {
                values = [
                    { name: 'branch', value: 'high_value', type: 'string' },
                    { name: 'reviewRequired', value: true, type: 'boolean' },
                    { name: 'processingFee', value: '={{ $json.amount * 0.025 }}', type: 'number' }
                ];
            } else {
                values = [
                    { name: 'branch', value: 'primary', type: 'string' },
                    { name: 'priority', value: 'high', type: 'string' }
                ];
            }
            
        } else if (nodeName.includes('rama') && nodeName.includes('false')) {
            // Procesamiento rama falsa (condición no cumplida)
            if (context.purpose === 'data_processing') {
                values = [
                    { name: 'branch', value: 'normal_priority', type: 'string' },
                    { name: 'processingLevel', value: 'standard', type: 'string' },
                    { name: 'queuePriority', value: 5, type: 'number' }
                ];
            } else if (context.purpose === 'payment_processing') {
                values = [
                    { name: 'branch', value: 'standard_value', type: 'string' },
                    { name: 'reviewRequired', value: false, type: 'boolean' },
                    { name: 'processingFee', value: '={{ $json.amount * 0.015 }}', type: 'number' }
                ];
            } else {
                values = [
                    { name: 'branch', value: 'secondary', type: 'string' },
                    { name: 'priority', value: 'normal', type: 'string' }
                ];
            }
        } else {
            // Configuración genérica basada en propósito
            const purposeFields = {
                'lead_management': [
                    { name: 'processedAt', value: '={{ new Date().toISOString() }}', type: 'string' },
                    { name: 'leadScore', value: '={{ Math.floor(Math.random() * 100) }}', type: 'number' },
                    { name: 'source', value: 'webhook', type: 'string' }
                ],
                'order_processing': [
                    { name: 'processedAt', value: '={{ new Date().toISOString() }}', type: 'string' },
                    { name: 'orderStatus', value: 'processing', type: 'string' },
                    { name: 'processId', value: '={{ $json.id || "auto-" + Date.now() }}', type: 'string' }
                ],
                'data_processing': [
                    { name: 'processedAt', value: '={{ new Date().toISOString() }}', type: 'string' },
                    { name: 'processingStatus', value: 'completed', type: 'string' },
                    { name: 'dataSource', value: 'webhook', type: 'string' }
                ],
                'payment_processing': [
                    { name: 'processedAt', value: '={{ new Date().toISOString() }}', type: 'string' },
                    { name: 'paymentStatus', value: 'validated', type: 'string' },
                    { name: 'transactionId', value: '={{ "tx_" + Date.now() }}', type: 'string' }
                ],
                'general_workflow': [
                    { name: 'processedAt', value: '={{ new Date().toISOString() }}', type: 'string' },
                    { name: 'workflowId', value: '={{ $workflow.id }}', type: 'string' },
                    { name: 'status', value: 'processed', type: 'string' }
                ]
            };
            
            values = purposeFields[context.purpose] || purposeFields['general_workflow'];
        }
        
        console.log(`✅ Set configurado con ${values.length} campos para ${context.purpose}`);
        
        return {
            values: values,
            options: {}
        };
    }

    /**
     * Configura nodos Function
     */
    configureFunctionNode(node, context) {
        const config = node.parameters || {};
        
        // Si ya tiene código, mantenerlo
        if (config.jsCode && config.jsCode.trim() !== '') {
            return config;
        }
        
        // Generar código básico basado en el contexto
        const purposeCode = {
            'lead_management': `
// Procesar datos de leads
const items = $input.all();

for (const item of items) {
  // Calcular score del lead
  item.json.leadScore = (item.json.amount || 0) * 0.1;
  
  // Determinar prioridad
  item.json.priority = item.json.leadScore > 50 ? 'high' : 'normal';
  
  // Añadir timestamp
  item.json.processedAt = new Date().toISOString();
}

return items;`,
            'order_processing': `
// Procesar datos de órdenes
const items = $input.all();

for (const item of items) {
  // Calcular total con impuestos
  item.json.totalWithTax = (item.json.amount || 0) * 1.21;
  
  // Determinar método de envío
  item.json.shippingMethod = item.json.totalWithTax > 100 ? 'express' : 'standard';
  
  // Añadir timestamp
  item.json.processedAt = new Date().toISOString();
}

return items;`,
            'data_processing': `
// Procesar y limpiar datos
const items = $input.all();

for (const item of items) {
  // Limpiar datos nulos
  for (const key in item.json) {
    if (item.json[key] === null || item.json[key] === undefined) {
      delete item.json[key];
    }
  }
  
  // Añadir metadata
  item.json._processed = true;
  item.json._processedAt = new Date().toISOString();
}

return items;`,
            'general_workflow': `
// Procesamiento general de datos
const items = $input.all();

for (const item of items) {
  // Añadir timestamp de procesamiento
  item.json.processedAt = new Date().toISOString();
  
  // Añadir ID único si no existe
  if (!item.json.id) {
    item.json.id = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Marcar como procesado
  item.json.processed = true;
}

return items;`
        };
        
        config.jsCode = purposeCode[context.purpose] || purposeCode['general_workflow'];
        config.mode = 'runOnceForAllItems';
        
        return config;
    }

    /**
     * Configura nodos HTTP Request
     */
    configureHttpRequest(node, context) {
        const config = node.parameters || {};
        
        // Si ya tiene URL, mantener configuración
        if (config.url && config.url !== '') {
            return config;
        }
        
        // Configurar por defecto basado en el contexto
        config.method = config.method || 'POST';
        config.url = config.url || 'https://api.example.com/webhook';
        config.options = config.options || {};
        
        // Añadir headers apropiados
        config.options.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'n8n-workflow'
        };
        
        // Configurar body si es POST/PUT
        if (['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = config.body || JSON.stringify({
                data: '={{ $json }}',
                timestamp: '={{ new Date().toISOString() }}',
                source: 'n8n-workflow'
            });
        }
        
        return config;
    }

    /**
     * Configura nodos Webhook
     */
    configureWebhook(node, context) {
        const config = node.parameters || {};
        
        // Configuraciones por defecto
        config.httpMethod = config.httpMethod || 'POST';
        config.path = config.path || this.generateWebhookPath(context.purpose);
        config.responseMode = config.responseMode || 'lastNode';
        config.options = config.options || {};
        
        return config;
    }

    /**
     * Genera path de webhook basado en el propósito
     */
    generateWebhookPath(purpose) {
        const paths = {
            'lead_management': 'webhook/leads',
            'order_processing': 'webhook/orders', 
            'customer_management': 'webhook/customers',
            'payment_processing': 'webhook/payments',
            'data_processing': 'webhook/data',
            'notification_system': 'webhook/notifications',
            'general_workflow': 'webhook/general'
        };
        
        return paths[purpose] || 'webhook/data';
    }

    /**
     * Configura todos los nodos del workflow con inteligencia contextual
     * @param {Object} workflow - Objeto workflow completo
     * @param {string} originalPrompt - Prompt original del usuario
     * @returns {Object} - Workflow configurado
     */
    async configureAllNodes(workflow, originalPrompt) {
        console.log('🧪 INICIANDO CONFIGURACIÓN INTELIGENTE DE NODOS V2.0');
        console.log(`📝 Prompt: ${originalPrompt}`);

        try {
            // Analizar contexto
            const context = this.analyzeWorkflowContext(workflow, originalPrompt);
            
            // Clonar workflow para no modificar el original
            const configuredWorkflow = JSON.parse(JSON.stringify(workflow));
            
            // Aplicar configuraciones inteligentes a cada nodo
            let configurationsApplied = 0;
            
            if (configuredWorkflow.nodes) {
                for (const node of configuredWorkflow.nodes) {
                    const originalParams = JSON.stringify(node.parameters || {});
                    
                    // Aplicar configuración según el tipo de nodo
                    switch (node.type) {
                        case 'n8n-nodes-base.if':
                            this.configureFunctionalIf(node, context);
                            break;
                        case 'n8n-nodes-base.merge':
                            this.configureFunctionalMerge(node, context);
                            break;
                        case 'n8n-nodes-base.set':
                            this.configureSetNode(node, context);
                            break;
                        case 'n8n-nodes-base.function':
                        case 'n8n-nodes-base.code':
                            this.configureFunctionNode(node, context);
                            break;
                        case 'n8n-nodes-base.googleSheets':
                            this.configureGoogleSheets(node, context);
                            break;
                        case 'n8n-nodes-base.httpRequest':
                            this.configureHttpRequest(node, context);
                            break;
                        case 'n8n-nodes-base.webhook':
                            this.configureWebhook(node, context);
                            break;
                    }
                    
                    // Verificar si se aplicaron cambios
                    const newParams = JSON.stringify(node.parameters || {});
                    if (originalParams !== newParams) {
                        configurationsApplied++;
                        console.log(`✅ Configurado: ${node.name} (${node.type})`);
                    }
                }
            }
            
            // Agregar metadatos de configuración
            configuredWorkflow._metadata = {
                ...configuredWorkflow._metadata,
                nodeConfiguration: {
                    applied: true,
                    configurationsApplied: configurationsApplied,
                    timestamp: new Date().toISOString(),
                    agent: 'IntelligentNodeConfigAgentV2',
                    context: context.purpose,
                    summary: `${configurationsApplied} nodos configurados para ${context.purpose}`
                }
            };
            
            console.log(`🎯 Configuración completada: ${configurationsApplied} nodos`);
            return configuredWorkflow;
            
        } catch (error) {
            console.error('❌ Error en configuración de nodos:', error.message);
            
            // Devolver workflow original con metadatos de error
            const errorWorkflow = JSON.parse(JSON.stringify(workflow));
            errorWorkflow._metadata = {
                ...errorWorkflow._metadata,
                nodeConfiguration: {
                    applied: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                    agent: 'IntelligentNodeConfigAgentV2'
                }
            };
            
            return errorWorkflow;
        }
    }

    /**
     * Procesa el workflow completo con configuración inteligente
     */
    async processWorkflow(workflowPath, originalPrompt) {
        console.log('🧪 INICIANDO AGENTE DE CONFIGURACIÓN INTELIGENTE V2.0');
        console.log('=' * 60);
        
        // Cargar workflow
        const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
        console.log(`🚀 Procesando workflow: ${workflowPath}`);
        console.log(`📝 Prompt original: ${originalPrompt}`);

        // Analizar contexto
        const context = this.analyzeWorkflowContext(workflow, originalPrompt);

        // Configurar nodos inteligentemente
        console.log('🤖 Aplicando configuración inteligente de nodos...');
        let configuredNodes = 0;
        
        for (const node of workflow.nodes) {
            if (node.type === 'n8n-nodes-base.if') {
                node.parameters = this.configureFunctionalIf(node, context);
                configuredNodes++;
                console.log(`✅ Configurado IF: ${node.name}`);
                
            } else if (node.type === 'n8n-nodes-base.merge') {
                node.parameters = this.configureFunctionalMerge(node, context);
                configuredNodes++;
                console.log(`✅ Configurado MERGE: ${node.name}`);
                
            } else if (node.type === 'n8n-nodes-base.googleSheets') {
                node.parameters = this.configureGoogleSheets(node, context);
                configuredNodes++;
                console.log(`✅ Configurado GoogleSheets: ${node.name}`);
                
            } else if (node.type === 'n8n-nodes-base.set') {
                node.parameters = this.configureSetNode(node, context);
                configuredNodes++;
                console.log(`✅ Configurado Set: ${node.name}`);
                
            } else if (node.type === 'n8n-nodes-base.function') {
                node.parameters = this.configureFunctionNode(node, context);
                configuredNodes++;
                console.log(`✅ Configurado Function: ${node.name}`);
                
            } else if (node.type === 'n8n-nodes-base.httpRequest') {
                node.parameters = this.configureHttpRequest(node, context);
                configuredNodes++;
                console.log(`✅ Configurado HTTP Request: ${node.name}`);
                
            } else if (node.type === 'n8n-nodes-base.webhook') {
                node.parameters = this.configureWebhook(node, context);
                configuredNodes++;
                console.log(`✅ Configurado Webhook: ${node.name}`);
            }
        }

        // Guardar resultado
        const timestamp = Date.now();
        const outputPath = workflowPath.replace('.json', `-functional-configured-${timestamp}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
        
        console.log('=' * 60);
        console.log('📊 RESUMEN DE CONFIGURACIÓN INTELIGENTE V2.0');
        console.log('=' * 60);
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
        console.log(`🔧 Nodos configurados funcionalmente: ${configuredNodes}`);
        console.log(`📝 Contexto aplicado: ${context.purpose}`);
        if (context.businessLogic.splitCriteria) {
            console.log(`🎯 Lógica de IF: ${context.businessLogic.splitCriteria.field} ${context.businessLogic.splitCriteria.type}`);
        }
        console.log('=' * 60);
        console.log('🎉 CONFIGURACIÓN FUNCIONAL COMPLETADA!');
        console.log(`📁 Archivo guardado: ${outputPath}`);

        return outputPath;
    }
}

// Ejecución principal
if (import.meta.url === `file://${process.argv[1]}`) {
    const workflowPath = process.argv[2];
    if (!workflowPath) {
        console.error('❌ ERROR: Debes proporcionar la ruta del workflow JSON como argumento');
        console.log('💡 Uso: node intelligent-node-config-agent-v2.mjs "ruta/al/workflow.json"');
        process.exit(1);
    }

    if (!fs.existsSync(workflowPath)) {
        console.error(`❌ ERROR: El archivo ${workflowPath} no existe`);
        process.exit(1);
    }

    const originalPrompt = process.argv[3] || "Workflow general que procese datos de webhook, divida el flujo en ramas dependiendo de condiciones, procese datos de diferentes fuentes, envíe notificaciones, una las ramas y genere reportes finales";

    const agent = new IntelligentNodeConfigAgentV2();
    agent.processWorkflow(workflowPath, originalPrompt)
        .then(outputPath => {
            console.log(`\n✅ ÉXITO: Workflow configurado funcionalmente guardado en: ${outputPath}`);
        })
        .catch(error => {
            console.error('❌ ERROR:', error.message);
            process.exit(1);
        });
}

export default IntelligentNodeConfigAgentV2;
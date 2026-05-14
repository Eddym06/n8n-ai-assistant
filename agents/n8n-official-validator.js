// 🛡️ SISTEMA DE VALIDACIÓN OFICIAL N8N
// Basado en investigación exhaustiva del repositorio n8n-io/n8n
// Valida tipos de nodos, conexiones y estructura según especificaciones oficiales

/**
 * TIPOS DE NODOS OFICIALES VÁLIDOS
 * Extraídos de packages/frontend/editor-ui/src/constants.ts
 * y packages/nodes-base/package.json
 */
const VALID_NODE_TYPES = [
    // 🔥 TRIGGER NODES
    'n8n-nodes-base.manualTrigger',
    'n8n-nodes-base.webhook',
    'n8n-nodes-base.scheduleTrigger',
    'n8n-nodes-base.cron',
    'n8n-nodes-base.interval',
    'n8n-nodes-base.formTrigger',
    'n8n-nodes-base.chatTrigger',
    'n8n-nodes-base.start',
    'n8n-nodes-base.calendlyTrigger',
    'n8n-nodes-base.githubTrigger',
    'n8n-nodes-base.hubspotTrigger',
    'n8n-nodes-base.jiraTrigger',
    'n8n-nodes-base.notionTrigger',
    'n8n-nodes-base.slackTrigger',
    'n8n-nodes-base.telegramTrigger',
    'n8n-nodes-base.workflowTrigger',
    'n8n-nodes-base.errorTrigger',

    // ⚡ CORE NODES
    'n8n-nodes-base.httpRequest',
    'n8n-nodes-base.code',
    'n8n-nodes-base.function',
    'n8n-nodes-base.set',
    'n8n-nodes-base.edit',
    'n8n-nodes-base.if',
    'n8n-nodes-base.switch',
    'n8n-nodes-base.merge',
    'n8n-nodes-base.wait',
    'n8n-nodes-base.noOp',
    'n8n-nodes-base.stopAndError',
    'n8n-nodes-base.respondToWebhook',

    // 📊 DATA TRANSFORMATION
    'n8n-nodes-base.itemLists',
    'n8n-nodes-base.splitInBatches',
    'n8n-nodes-base.aggregate',
    'n8n-nodes-base.summarize',
    'n8n-nodes-base.limit',
    'n8n-nodes-base.removeDuplicates',
    'n8n-nodes-base.splitOut',
    'n8n-nodes-base.filter',
    'n8n-nodes-base.sort',

    // 📁 FILE PROCESSING
    'n8n-nodes-base.extractFromFile',
    'n8n-nodes-base.convertToFile',
    'n8n-nodes-base.spreadsheetFile',
    'n8n-nodes-base.csv',
    'n8n-nodes-base.xml',
    'n8n-nodes-base.html',
    'n8n-nodes-base.markdown',
    'n8n-nodes-base.compression',
    'n8n-nodes-base.editImage',

    // 🗄️ DATABASES
    'n8n-nodes-base.mysql',
    'n8n-nodes-base.postgres',
    'n8n-nodes-base.mongodb',
    'n8n-nodes-base.redis',
    'n8n-nodes-base.microsoftSql',
    'n8n-nodes-base.questDb',

    // 📧 COMMUNICATION
    'n8n-nodes-base.emailSend',
    'n8n-nodes-base.emailReadImap',
    'n8n-nodes-base.gmail',
    'n8n-nodes-base.slack',
    'n8n-nodes-base.telegram',
    'n8n-nodes-base.discord',
    'n8n-nodes-base.microsoftTeams',
    'n8n-nodes-base.whatsApp',
    'n8n-nodes-base.twilio',
    'n8n-nodes-base.messageBird',

    // 💼 BUSINESS APPLICATIONS
    'n8n-nodes-base.salesforce',
    'n8n-nodes-base.hubspot',
    'n8n-nodes-base.pipedrive',
    'n8n-nodes-base.airtable',
    'n8n-nodes-base.googleSheets',
    'n8n-nodes-base.microsoftExcel',
    'n8n-nodes-base.notion',
    'n8n-nodes-base.trello',
    'n8n-nodes-base.asana',
    'n8n-nodes-base.monday',
    'n8n-nodes-base.github',
    'n8n-nodes-base.gitlab',
    'n8n-nodes-base.jira',
    'n8n-nodes-base.jenkins',

    // 🛒 E-COMMERCE
    'n8n-nodes-base.shopify',
    'n8n-nodes-base.woocommerce',
    'n8n-nodes-base.stripe',
    'n8n-nodes-base.paypal',

    // 📈 MARKETING
    'n8n-nodes-base.mailchimp',
    'n8n-nodes-base.sendinblue',
    'n8n-nodes-base.googleAnalytics',
    'n8n-nodes-base.facebook',
    'n8n-nodes-base.twitter',
    'n8n-nodes-base.linkedin',

    // ☁️ CLOUD STORAGE
    'n8n-nodes-base.googleDrive',
    'n8n-nodes-base.dropbox',
    'n8n-nodes-base.box',
    'n8n-nodes-base.oneDrive',
    'n8n-nodes-base.awsS3',

    // 🏢 ENTERPRISE
    'n8n-nodes-base.microsoftOutlook',
    'n8n-nodes-base.googleDocs',
    'n8n-nodes-base.googleCalendar',
    'n8n-nodes-base.serviceNow',
    'n8n-nodes-base.bambooHr',
    'n8n-nodes-base.clearbit',

    // 🎨 CONTENT & MEDIA
    'n8n-nodes-base.rss',
    'n8n-nodes-base.wordpress',
    'n8n-nodes-base.contentful',
    'n8n-nodes-base.youtube',
    'n8n-nodes-base.vimeo',

    // 📋 FORMS & SURVEYS
    'n8n-nodes-base.form',
    'n8n-nodes-base.typeform',
    'n8n-nodes-base.surveyMonkey',
    'n8n-nodes-base.jotform',

    // 🛠️ UTILITIES
    'n8n-nodes-base.dateTime',
    'n8n-nodes-base.crypto',
    'n8n-nodes-base.hash',
    'n8n-nodes-base.ftp',
    'n8n-nodes-base.ssh',
    'n8n-nodes-base.mqtt',
    'n8n-nodes-base.pingdom',
    'n8n-nodes-base.uptimeRobot'
];

/**
 * TIPOS DE CONEXIONES VÁLIDAS
 * Según packages/workflow/src/interfaces.ts
 */
const VALID_CONNECTION_TYPES = [
    'main',
    'ai_tool',
    'ai_chain',
    'ai_agent',
    'ai_languageModel',
    'ai_memory',
    'ai_document',
    'ai_vectorStore',
    'ai_embeddings',
    'ai_textSplitter',
    'ai_retriever',
    'ai_outputParser'
];

/**
 * PATRONES INVÁLIDOS QUE NUNCA DEBEN APARECER
 */
const INVALID_PATTERNS = [
    '@n8n/n8n-nodes-langchain',
    'n8n-nodes-langchain',
    '@n8n/nodes-langchain',
    'langchain-nodes'
];

/**
 * CAMPOS REQUERIDOS POR TIPO DE NODO
 */
const REQUIRED_FIELDS_BY_NODE = {
    'n8n-nodes-base.webhook': ['httpMethod', 'path'],
    'n8n-nodes-base.httpRequest': ['method', 'url'],
    'n8n-nodes-base.code': ['language'],
    'n8n-nodes-base.if': ['conditions'],
    'n8n-nodes-base.switch': ['routing'],
    'n8n-nodes-base.merge': ['mode'],
    'n8n-nodes-base.emailSend': ['to', 'subject'],
    'n8n-nodes-base.slack': ['operation'],
    'n8n-nodes-base.scheduleTrigger': ['triggerTimes'],
    'n8n-nodes-base.cron': ['cronExpression']
};

/**
 * CLASE PRINCIPAL DE VALIDACIÓN
 */
class N8nOfficialValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalNodes: 0,
            validNodes: 0,
            invalidNodes: 0,
            totalConnections: 0,
            validConnections: 0,
            invalidConnections: 0
        };
    }

    /**
     * VALIDAR WORKFLOW COMPLETO
     */
    validateWorkflow(workflow) {
        console.log('🛡️ Iniciando validación oficial de workflow...');
        
        this.reset();
        
        if (!this.validateBasicStructure(workflow)) {
            return this.getValidationResult(false);
        }

        this.validateNodes(workflow.nodes);
        this.validateConnections(workflow);
        this.validateMetadata(workflow);

        const isValid = this.errors.length === 0;
        
        console.log(`✅ Validación completada. Válido: ${isValid}`);
        console.log(`📊 Estadísticas: ${this.stats.validNodes}/${this.stats.totalNodes} nodos válidos`);
        
        return this.getValidationResult(isValid);
    }

    /**
     * VALIDAR ESTRUCTURA BÁSICA
     */
    validateBasicStructure(workflow) {
        if (!workflow) {
            this.addError('workflow_null', 'Workflow es null o undefined');
            return false;
        }

        if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
            this.addError('no_nodes', 'Workflow debe tener un array de nodos');
            return false;
        }

        if (workflow.nodes.length === 0) {
            this.addWarning('empty_workflow', 'Workflow no tiene nodos');
        }

        return true;
    }

    /**
     * VALIDAR NODOS
     */
    validateNodes(nodes) {
        this.stats.totalNodes = nodes.length;

        nodes.forEach((node, index) => {
            this.validateNode(node, index);
        });
    }

    /**
     * VALIDAR NODO INDIVIDUAL
     */
    validateNode(node, index) {
        const nodeId = `nodo_${index}_${node.name || 'unnamed'}`;

        // Campos básicos requeridos
        if (!node.id) {
            this.addError(`${nodeId}_no_id`, `Nodo ${index} no tiene ID`);
        }

        if (!node.name) {
            this.addError(`${nodeId}_no_name`, `Nodo ${index} no tiene nombre`);
        }

        if (!node.type) {
            this.addError(`${nodeId}_no_type`, `Nodo ${node.name} no tiene tipo`);
            this.stats.invalidNodes++;
            return;
        }

        // Validar tipo de nodo
        if (!this.isValidNodeType(node.type)) {
            this.addError(`${nodeId}_invalid_type`, 
                `Nodo ${node.name} tiene tipo inválido: ${node.type}`);
            this.stats.invalidNodes++;
            return;
        }

        // Validar posición
        if (!node.position || !Array.isArray(node.position) || node.position.length < 2) {
            this.addWarning(`${nodeId}_no_position`, 
                `Nodo ${node.name} no tiene posición válida`);
        }

        // Validar parámetros requeridos
        this.validateNodeParameters(node, nodeId);

        // Validar typeVersion
        if (!node.typeVersion) {
            this.addWarning(`${nodeId}_no_version`, 
                `Nodo ${node.name} no tiene typeVersion`);
        }

        this.stats.validNodes++;
    }

    /**
     * VALIDAR PARÁMETROS DE NODO
     */
    validateNodeParameters(node, nodeId) {
        const requiredFields = REQUIRED_FIELDS_BY_NODE[node.type];
        
        if (!requiredFields) return; // No hay campos requeridos definidos

        if (!node.parameters) {
            this.addError(`${nodeId}_no_params`, 
                `Nodo ${node.name} requiere parámetros: ${requiredFields.join(', ')}`);
            return;
        }

        requiredFields.forEach(field => {
            if (node.parameters[field] === undefined || node.parameters[field] === null) {
                this.addError(`${nodeId}_missing_${field}`, 
                    `Nodo ${node.name} falta parámetro requerido: ${field}`);
            }
        });
    }

    /**
     * VALIDAR CONEXIONES
     */
    validateConnections(workflow) {
        if (!workflow.connections) {
            this.addWarning('no_connections', 'Workflow no tiene conexiones');
            return;
        }

        const nodeNames = workflow.nodes.map(n => n.name);
        let connectionCount = 0;

        Object.keys(workflow.connections).forEach(sourceNodeName => {
            if (!nodeNames.includes(sourceNodeName)) {
                this.addError(`connection_orphan_source`, 
                    `Conexión desde nodo inexistente: ${sourceNodeName}`);
                return;
            }

            const nodeConnections = workflow.connections[sourceNodeName];
            
            Object.keys(nodeConnections).forEach(connectionType => {
                if (!this.isValidConnectionType(connectionType)) {
                    this.addError(`connection_invalid_type`, 
                        `Tipo de conexión inválido: ${connectionType}`);
                }

                const connections = nodeConnections[connectionType];
                if (!Array.isArray(connections)) return;

                connections.forEach(connArray => {
                    if (!Array.isArray(connArray)) return;

                    connArray.forEach(conn => {
                        connectionCount++;
                        this.validateConnection(conn, sourceNodeName, nodeNames);
                    });
                });
            });
        });

        this.stats.totalConnections = connectionCount;
    }

    /**
     * VALIDAR CONEXIÓN INDIVIDUAL
     */
    validateConnection(connection, sourceNodeName, nodeNames) {
        if (!connection.node) {
            this.addError('connection_no_target', 
                `Conexión desde ${sourceNodeName} sin nodo destino`);
            this.stats.invalidConnections++;
            return;
        }

        if (!nodeNames.includes(connection.node)) {
            this.addError('connection_invalid_target', 
                `Conexión desde ${sourceNodeName} a nodo inexistente: ${connection.node}`);
            this.stats.invalidConnections++;
            return;
        }

        if (connection.type && !this.isValidConnectionType(connection.type)) {
            this.addError('connection_invalid_type', 
                `Conexión desde ${sourceNodeName} con tipo inválido: ${connection.type}`);
        }

        if (connection.index === undefined || connection.index < 0) {
            this.addWarning('connection_no_index', 
                `Conexión desde ${sourceNodeName} sin índice válido`);
        }

        this.stats.validConnections++;
    }

    /**
     * VALIDAR METADATOS
     */
    validateMetadata(workflow) {
        if (!workflow.meta) {
            this.addWarning('no_metadata', 'Workflow no tiene metadatos');
            return;
        }

        if (!workflow.meta.instanceId) {
            this.addWarning('no_instance_id', 'Workflow no tiene instanceId');
        }
    }

    /**
     * VERIFICAR SI ES TIPO DE NODO VÁLIDO
     */
    isValidNodeType(type) {
        // Verificar que esté en la lista oficial
        if (VALID_NODE_TYPES.includes(type)) {
            return true;
        }

        // Verificar que no contenga patrones inválidos
        if (INVALID_PATTERNS.some(pattern => type.includes(pattern))) {
            return false;
        }

        // Verificar que empiece con n8n-nodes-base.
        if (!type.startsWith('n8n-nodes-base.')) {
            return false;
        }

        // Tipo personalizado válido
        return true;
    }

    /**
     * VERIFICAR SI ES TIPO DE CONEXIÓN VÁLIDO
     */
    isValidConnectionType(type) {
        return VALID_CONNECTION_TYPES.includes(type);
    }

    /**
     * UTILITIES
     */
    addError(code, message) {
        this.errors.push({ code, message, level: 'error' });
        console.error(`❌ ${code}: ${message}`);
    }

    addWarning(code, message) {
        this.warnings.push({ code, message, level: 'warning' });
        console.warn(`⚠️ ${code}: ${message}`);
    }

    reset() {
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalNodes: 0,
            validNodes: 0,
            invalidNodes: 0,
            totalConnections: 0,
            validConnections: 0,
            invalidConnections: 0
        };
    }

    getValidationResult(isValid) {
        return {
            valid: isValid,
            errors: this.errors,
            warnings: this.warnings,
            stats: this.stats,
            summary: {
                totalIssues: this.errors.length + this.warnings.length,
                errorCount: this.errors.length,
                warningCount: this.warnings.length,
                nodeValidationRate: this.stats.totalNodes > 0 ? 
                    (this.stats.validNodes / this.stats.totalNodes * 100).toFixed(1) + '%' : 'N/A',
                connectionValidationRate: this.stats.totalConnections > 0 ? 
                    (this.stats.validConnections / this.stats.totalConnections * 100).toFixed(1) + '%' : 'N/A'
            }
        };
    }
}

/**
 * FUNCIÓN DE VALIDACIÓN RÁPIDA
 */
function validateWorkflow(workflow) {
    const validator = new N8nOfficialValidator();
    return validator.validateWorkflow(workflow);
}

/**
 * FUNCIÓN DE VALIDACIÓN SOLO TIPOS DE NODOS
 */
function validateNodeTypes(workflow) {
    const validator = new N8nOfficialValidator();
    
    if (!workflow || !workflow.nodes) {
        return { valid: false, invalidTypes: [], message: 'Workflow inválido' };
    }

    const invalidTypes = [];
    
    workflow.nodes.forEach(node => {
        if (!validator.isValidNodeType(node.type)) {
            invalidTypes.push({
                name: node.name,
                type: node.type,
                reason: INVALID_PATTERNS.some(p => node.type.includes(p)) ? 
                    'Contiene patrón inválido' : 'Tipo no oficial'
            });
        }
    });

    return {
        valid: invalidTypes.length === 0,
        invalidTypes: invalidTypes,
        message: invalidTypes.length === 0 ? 
            'Todos los tipos de nodos son válidos' : 
            `${invalidTypes.length} tipos de nodos inválidos encontrados`
    };
}

/**
 * FUNCIÓN DE VERIFICACIÓN RÁPIDA
 */
function isWorkflowValid(workflow) {
    try {
        const result = validateWorkflow(workflow);
        return result.valid;
    } catch (error) {
        console.error('Error en validación:', error);
        return false;
    }
}

// EXPORT
module.exports = {
    N8nOfficialValidator,
    validateWorkflow,
    validateNodeTypes,
    isWorkflowValid,
    VALID_NODE_TYPES,
    VALID_CONNECTION_TYPES,
    INVALID_PATTERNS,
    REQUIRED_FIELDS_BY_NODE
};

// Para uso directo
if (require.main === module) {
    console.log('🛡️ Validador Oficial N8N');
    console.log(`📋 ${VALID_NODE_TYPES.length} tipos de nodos válidos registrados`);
    console.log(`🔗 ${VALID_CONNECTION_TYPES.length} tipos de conexiones válidas`);
    console.log(`❌ ${INVALID_PATTERNS.length} patrones inválidos detectables`);
}
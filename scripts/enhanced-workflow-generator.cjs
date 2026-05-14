/**
 * 🏗️ GENERADOR DE WORKFLOWS FUNCIONALES V2.0
 * ==========================================
 * 
 * Actualizado basándose en análisis de flujo de referencia funcional:
 * - Estructura conforme a estándares de n8n
 * - IDs en formato UUID
 * - Meta información completa
 * - Campos requeridos y recomendados
 * - Conexiones válidas
 * - Sin campos problemáticos
 */

const fs = require('fs');
const path = require('path');

class EnhancedWorkflowGenerator {
    constructor() {
        this.outputDir = './generated-workflows/';
        this.ensureOutputDir();
    }

    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    generateInstanceId() {
        return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    generateWorkflowId() {
        return Array.from({length: 16}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    }

    createStandardWorkflowBase(name, description = '') {
        return {
            id: this.generateWorkflowId(),
            meta: {
                instanceId: this.generateInstanceId()
            },
            name: name,
            tags: [
                {
                    id: this.generateWorkflowId(),
                    name: "🧪 Generated",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ],
            nodes: [],
            connections: {},
            active: false,
            settings: {
                executionOrder: "v1"
            },
            versionId: this.generateUUID()
        };
    }

    createStandardNode(name, type, position, parameters = {}, additionalProps = {}) {
        const node = {
            id: this.generateUUID(),
            name: name,
            type: type,
            position: position,
            parameters: parameters,
            typeVersion: additionalProps.typeVersion || 1,
            ...additionalProps
        };

        // Eliminar campos undefined
        Object.keys(node).forEach(key => {
            if (node[key] === undefined) {
                delete node[key];
            }
        });

        return node;
    }

    createConnection(sourceNode, targetNode, sourceIndex = 0, targetIndex = 0) {
        return {
            node: targetNode,
            type: "main",
            index: targetIndex
        };
    }

    generateAdvancedTestWorkflow() {
        console.log('🔬 Generando workflow de prueba avanzado...');
        
        const workflow = this.createStandardWorkflowBase(
            "Test_Workflow_Advanced_Structure",
            "Workflow de prueba con estructura completa según estándares de referencia"
        );

        // Nodos con estructura completa
        const scheduleNode = this.createStandardNode(
            "Schedule Trigger",
            "n8n-nodes-base.scheduleTrigger",
            [-400, 300],
            {
                rule: {
                    interval: [{}]
                }
            },
            { typeVersion: 1.1 }
        );

        const codeNode = this.createStandardNode(
            "Process Data",
            "n8n-nodes-base.code",
            [-200, 300],
            {
                jsCode: "// Procesar datos de entrada\\nreturn [{ processed: true, timestamp: new Date().toISOString() }];"
            },
            { 
                typeVersion: 2,
                notes: "Procesa los datos de entrada",
                notesInFlow: true
            }
        );

        const httpNode = this.createStandardNode(
            "Send Notification",
            "n8n-nodes-base.httpRequest",
            [0, 300],
            {
                url: "https://httpbin.org/post",
                method: "POST",
                options: {},
                sendBody: true,
                specifyBody: "json",
                jsonBody: "={{ { \"message\": \"Test completed\", \"data\": $json } }}"
            },
            { 
                typeVersion: 4.1,
                continueOnFail: true
            }
        );

        const waitNode = this.createStandardNode(
            "Wait 1 second",
            "n8n-nodes-base.wait",
            [200, 300],
            {
                amount: 1,
                unit: "seconds"
            },
            { typeVersion: 1.1 }
        );

        workflow.nodes = [scheduleNode, codeNode, httpNode, waitNode];

        // Conexiones válidas
        workflow.connections = {
            "Schedule Trigger": {
                main: [
                    [this.createConnection("Schedule Trigger", "Process Data")]
                ]
            },
            "Process Data": {
                main: [
                    [this.createConnection("Process Data", "Send Notification")]
                ]
            },
            "Send Notification": {
                main: [
                    [this.createConnection("Send Notification", "Wait 1 second")]
                ]
            }
        };

        const outputPath = path.join(this.outputDir, 'workflow-ADVANCED-TEST-V2.json');
        fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
        console.log(`✅ Workflow avanzado generado: ${outputPath}`);
        
        return outputPath;
    }

    generateEnterpriseWorkflow() {
        console.log('🏢 Generando workflow empresarial completo...');
        
        const workflow = this.createStandardWorkflowBase(
            "Enterprise_Data_Processing_Pipeline",
            "Pipeline empresarial completo con múltiples etapas de procesamiento"
        );

        // Agregar tag empresarial
        workflow.tags.push({
            id: this.generateWorkflowId(),
            name: "🏢 Enterprise",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Nodos del pipeline empresarial
        const webhookNode = this.createStandardNode(
            "Webhook Trigger",
            "n8n-nodes-base.webhook",
            [-800, 400],
            {
                path: "enterprise-data",
                httpMethod: "POST",
                responseMode: "onReceived"
            },
            { 
                typeVersion: 1.1,
                webhookId: this.generateUUID()
            }
        );

        const validateNode = this.createStandardNode(
            "Validate Input",
            "n8n-nodes-base.code",
            [-600, 400],
            {
                jsCode: "// Validar estructura de datos\\nif (!$json.data || !$json.source) {\\n  throw new Error('Invalid input structure');\\n}\\nreturn [$json];"
            },
            { 
                typeVersion: 2,
                notes: "Valida la estructura de datos de entrada",
                notesInFlow: true
            }
        );

        const splitNode = this.createStandardNode(
            "Split Data Batches",
            "n8n-nodes-base.splitInBatches",
            [-400, 400],
            {
                batchSize: 10,
                options: {}
            },
            { typeVersion: 2 }
        );

        const processNode = this.createStandardNode(
            "Process Business Logic",
            "n8n-nodes-base.code",
            [-200, 400],
            {
                jsCode: "// Lógica de negocio empresarial\\nconst processed = {\\n  ...item,\\n  processedAt: new Date().toISOString(),\\n  status: 'processed',\\n  businessValue: Math.random() * 1000\\n};\\nreturn [processed];"
            },
            { 
                typeVersion: 2,
                notes: "Aplica reglas de negocio específicas"
            }
        );

        const enrichNode = this.createStandardNode(
            "Enrich Data",
            "n8n-nodes-base.httpRequest",
            [0, 400],
            {
                url: "https://api.example.com/enrich",
                method: "POST",
                options: {},
                sendBody: true,
                specifyBody: "json",
                jsonBody: "={{ $json }}"
            },
            { 
                typeVersion: 4.1,
                continueOnFail: true,
                disabled: true
            }
        );

        const aggregateNode = this.createStandardNode(
            "Aggregate Results",
            "n8n-nodes-base.itemLists",
            [200, 400],
            {
                operation: "aggregate",
                fieldToAggregate: "businessValue",
                options: {}
            },
            { typeVersion: 3 }
        );

        const notifyNode = this.createStandardNode(
            "Send Notification",
            "n8n-nodes-base.httpRequest",
            [400, 400],
            {
                url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
                method: "POST",
                options: {},
                sendBody: true,
                specifyBody: "json",
                jsonBody: "={{ { \"text\": \"Processing completed: \" + $json.length + \" items processed\" } }}"
            },
            { 
                typeVersion: 4.1,
                disabled: true,
                notes: "Configurar webhook de Slack real"
            }
        );

        const auditNode = this.createStandardNode(
            "Log Audit Trail",
            "n8n-nodes-base.code",
            [600, 400],
            {
                jsCode: "// Registro de auditoría\\nconsole.log('Audit:', {\\n  timestamp: new Date().toISOString(),\\n  items: $json.length,\\n  workflow: 'Enterprise_Data_Processing'\\n});\\nreturn [$json];"
            },
            { typeVersion: 2 }
        );

        workflow.nodes = [
            webhookNode, validateNode, splitNode, processNode, 
            enrichNode, aggregateNode, notifyNode, auditNode
        ];

        // Conexiones del pipeline empresarial
        workflow.connections = {
            "Webhook Trigger": {
                main: [
                    [this.createConnection("Webhook Trigger", "Validate Input")]
                ]
            },
            "Validate Input": {
                main: [
                    [this.createConnection("Validate Input", "Split Data Batches")]
                ]
            },
            "Split Data Batches": {
                main: [
                    [this.createConnection("Split Data Batches", "Process Business Logic")]
                ]
            },
            "Process Business Logic": {
                main: [
                    [this.createConnection("Process Business Logic", "Enrich Data")]
                ]
            },
            "Enrich Data": {
                main: [
                    [this.createConnection("Enrich Data", "Aggregate Results")]
                ]
            },
            "Aggregate Results": {
                main: [
                    [
                        this.createConnection("Aggregate Results", "Send Notification"),
                        this.createConnection("Aggregate Results", "Log Audit Trail")
                    ]
                ]
            }
        };

        const outputPath = path.join(this.outputDir, 'workflow-ENTERPRISE-V2.json');
        fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
        console.log(`✅ Workflow empresarial generado: ${outputPath}`);
        
        return outputPath;
    }

    generateComplexSecurityWorkflow() {
        console.log('🔐 Generando workflow de seguridad complejo...');
        
        const workflow = this.createStandardWorkflowBase(
            "Security_Incident_Response_System",
            "Sistema automatizado de respuesta a incidentes de seguridad"
        );

        // Tags de seguridad
        workflow.tags = [
            {
                id: this.generateWorkflowId(),
                name: "🔐 Security",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateWorkflowId(),
                name: "🚨 Critical",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        // Crear nodos de seguridad
        const alertTrigger = this.createStandardNode(
            "Security Alert Trigger",
            "n8n-nodes-base.webhook",
            [-1000, 500],
            {
                path: "security-alert",
                httpMethod: "POST",
                responseMode: "onReceived"
            },
            { 
                typeVersion: 1.1,
                webhookId: this.generateUUID()
            }
        );

        const parseAlert = this.createStandardNode(
            "Parse Alert Data",
            "n8n-nodes-base.code",
            [-800, 500],
            {
                jsCode: "// Parsear datos de alerta de seguridad\\nconst alert = {\\n  id: $json.id || 'unknown',\\n  severity: $json.severity || 'medium',\\n  source: $json.source || 'unknown',\\n  timestamp: new Date().toISOString(),\\n  details: $json.details || {}\\n};\\nreturn [alert];"
            },
            { 
                typeVersion: 2,
                notes: "Normaliza el formato de alertas"
            }
        );

        const enrichThreat = this.createStandardNode(
            "Enrich Threat Intelligence",
            "n8n-nodes-base.httpRequest",
            [-600, 500],
            {
                url: "https://api.virustotal.com/api/v3/ip_addresses/{{ $json.details.source_ip }}",
                method: "GET",
                options: {},
                authentication: "predefinedCredentialType"
            },
            { 
                typeVersion: 4.1,
                continueOnFail: true,
                disabled: true,
                notes: "Requiere configuración de API de VirusTotal"
            }
        );

        const classifyThreat = this.createStandardNode(
            "Classify Threat Level",
            "n8n-nodes-base.code",
            [-400, 500],
            {
                jsCode: "// Clasificar nivel de amenaza\\nlet threatLevel = 'low';\\nif ($json.severity === 'high' || $json.details.malicious) {\\n  threatLevel = 'critical';\\n} else if ($json.severity === 'medium') {\\n  threatLevel = 'high';\\n}\\nreturn [{ ...$json, threatLevel }];"
            },
            { typeVersion: 2 }
        );

        const createTicket = this.createStandardNode(
            "Create Security Ticket",
            "n8n-nodes-base.httpRequest",
            [-200, 400],
            {
                url: "https://your-jira.com/rest/api/2/issue",
                method: "POST",
                options: {},
                sendBody: true,
                specifyBody: "json",
                jsonBody: "={{ { \"fields\": { \"project\": { \"key\": \"SEC\" }, \"summary\": \"Security Alert: \" + $json.id, \"description\": \"Threat Level: \" + $json.threatLevel, \"issuetype\": { \"name\": \"Bug\" } } } }}"
            },
            { 
                typeVersion: 4.1,
                disabled: true,
                notes: "Configurar autenticación JIRA"
            }
        );

        const notifyTeam = this.createStandardNode(
            "Notify Security Team",
            "n8n-nodes-base.httpRequest",
            [-200, 600],
            {
                url: "https://hooks.slack.com/services/YOUR/SECURITY/WEBHOOK",
                method: "POST",
                sendBody: true,
                specifyBody: "json",
                jsonBody: "={{ { \"text\": \"🚨 Security Alert: \" + $json.id + \" | Threat Level: \" + $json.threatLevel, \"channel\": \"#security-alerts\" } }}"
            },
            { 
                typeVersion: 4.1,
                disabled: true
            }
        );

        const blockThreat = this.createStandardNode(
            "Auto Block Threat",
            "n8n-nodes-base.code",
            [0, 400],
            {
                jsCode: "// Lógica de bloqueo automático\\nif ($json.threatLevel === 'critical') {\\n  // Aquí iría la lógica para bloquear IP en firewall\\n  console.log('Blocking IP:', $json.details.source_ip);\\n  return [{ ...$json, blocked: true }];\\n}\\nreturn [{ ...$json, blocked: false }];"
            },
            { 
                typeVersion: 2,
                notes: "Bloqueo automático para amenazas críticas"
            }
        );

        const logIncident = this.createStandardNode(
            "Log Security Incident",
            "n8n-nodes-base.code",
            [200, 500],
            {
                jsCode: "// Registro detallado del incidente\\nconst incident = {\\n  ...item,\\n  loggedAt: new Date().toISOString(),\\n  responseTime: Date.now() - new Date(item.timestamp).getTime(),\\n  status: 'processed'\\n};\\nconsole.log('Security Incident Logged:', incident);\\nreturn [incident];"
            },
            { typeVersion: 2 }
        );

        workflow.nodes = [
            alertTrigger, parseAlert, enrichThreat, classifyThreat,
            createTicket, notifyTeam, blockThreat, logIncident
        ];

        // Conexiones del sistema de seguridad
        workflow.connections = {
            "Security Alert Trigger": {
                main: [
                    [this.createConnection("Security Alert Trigger", "Parse Alert Data")]
                ]
            },
            "Parse Alert Data": {
                main: [
                    [this.createConnection("Parse Alert Data", "Enrich Threat Intelligence")]
                ]
            },
            "Enrich Threat Intelligence": {
                main: [
                    [this.createConnection("Enrich Threat Intelligence", "Classify Threat Level")]
                ]
            },
            "Classify Threat Level": {
                main: [
                    [
                        this.createConnection("Classify Threat Level", "Create Security Ticket"),
                        this.createConnection("Classify Threat Level", "Notify Security Team")
                    ]
                ]
            },
            "Create Security Ticket": {
                main: [
                    [this.createConnection("Create Security Ticket", "Auto Block Threat")]
                ]
            },
            "Notify Security Team": {
                main: [
                    [this.createConnection("Notify Security Team", "Log Security Incident")]
                ]
            },
            "Auto Block Threat": {
                main: [
                    [this.createConnection("Auto Block Threat", "Log Security Incident")]
                ]
            }
        };

        const outputPath = path.join(this.outputDir, 'workflow-SECURITY-SYSTEM-V2.json');
        fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
        console.log(`✅ Workflow de seguridad generado: ${outputPath}`);
        
        return outputPath;
    }

    validateGeneratedWorkflow(workflowPath) {
        console.log(`\n🔍 Validando workflow generado: ${path.basename(workflowPath)}`);
        
        try {
            const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
            
            // Validaciones básicas
            const checks = {
                hasId: !!workflow.id,
                hasMeta: !!workflow.meta,
                hasInstanceId: !!(workflow.meta && workflow.meta.instanceId),
                hasName: !!workflow.name,
                hasNodes: !!(workflow.nodes && workflow.nodes.length > 0),
                hasConnections: !!workflow.connections,
                hasVersionId: !!workflow.versionId,
                allNodesHaveUUID: workflow.nodes ? workflow.nodes.every(n => /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(n.id)) : false
            };
            
            const passedChecks = Object.values(checks).filter(Boolean).length;
            const totalChecks = Object.keys(checks).length;
            
            console.log(`  📊 Validaciones pasadas: ${passedChecks}/${totalChecks}`);
            
            if (passedChecks === totalChecks) {
                console.log('  ✅ Workflow válido según estándares de referencia');
            } else {
                console.log('  ⚠️  Workflow necesita mejoras');
                Object.entries(checks).forEach(([check, passed]) => {
                    if (!passed) console.log(`    ❌ ${check}`);
                });
            }
            
            return passedChecks / totalChecks;
            
        } catch (error) {
            console.log(`  ❌ Error validando workflow: ${error.message}`);
            return 0;
        }
    }

    generateAllWorkflows() {
        console.log('🏗️ GENERADOR DE WORKFLOWS FUNCIONALES V2.0');
        console.log('============================================\n');
        
        const generatedFiles = [];
        
        try {
            // Generar workflows mejorados
            generatedFiles.push(this.generateAdvancedTestWorkflow());
            generatedFiles.push(this.generateEnterpriseWorkflow());
            generatedFiles.push(this.generateComplexSecurityWorkflow());
            
            console.log('\n📊 VALIDACIÓN DE WORKFLOWS GENERADOS');
            console.log('===================================');
            
            let totalScore = 0;
            generatedFiles.forEach(file => {
                const score = this.validateGeneratedWorkflow(file);
                totalScore += score;
            });
            
            const averageScore = (totalScore / generatedFiles.length) * 100;
            console.log(`\n🎯 Puntuación promedio: ${averageScore.toFixed(1)}%`);
            
            console.log('\n✅ GENERACIÓN COMPLETADA');
            console.log(`📁 Archivos creados en: ${this.outputDir}`);
            generatedFiles.forEach(file => {
                console.log(`  - ${path.basename(file)}`);
            });
            
        } catch (error) {
            console.error('❌ Error durante la generación:', error.message);
        }
    }
}

// Función principal
if (require.main === module) {
    const generator = new EnhancedWorkflowGenerator();
    generator.generateAllWorkflows();
}

module.exports = { EnhancedWorkflowGenerator };
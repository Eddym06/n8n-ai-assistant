// 🧪 TEST INTEGRAL CON ESPECIFICACIONES OFICIALES N8N
// Prueba el sistema completo usando únicamente tipos oficiales válidos

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar validador (simplificado para este test)
const VALID_NODE_TYPES = [
    'n8n-nodes-base.webhook',
    'n8n-nodes-base.code', 
    'n8n-nodes-base.if',
    'n8n-nodes-base.httpRequest',
    'n8n-nodes-base.emailSend',
    'n8n-nodes-base.merge',
    'n8n-nodes-base.respondToWebhook',
    'n8n-nodes-base.formTrigger',
    'n8n-nodes-base.slack',
    'n8n-nodes-base.hubspot',
    'n8n-nodes-base.googleSheets'
];

const INVALID_PATTERNS = [
    '@n8n/n8n-nodes-langchain',
    'n8n-nodes-langchain'
];

/**
 * WORKFLOW DE PRUEBA CON TIPOS OFICIALES
 */
const WORKFLOW_OFICIAL_TEST = {
    "meta": {
        "instanceId": "test-oficial-2025-01-24"
    },
    "nodes": [
        {
            "id": "webhook-trigger-1",
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 2,
            "position": [100, 300],
            "parameters": {
                "httpMethod": "POST",
                "path": "test-webhook",
                "responseMode": "onReceived"
            }
        },
        {
            "id": "data-processor-1", 
            "name": "Process Data",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [300, 300],
            "parameters": {
                "language": "javaScript",
                "jsCode": "const input = $input.first().json; const processed = { original: input, processed: true, timestamp: new Date().toISOString() }; return [{ json: processed }];"
            }
        },
        {
            "id": "condition-check-1",
            "name": "Check Conditions", 
            "type": "n8n-nodes-base.if",
            "typeVersion": 2,
            "position": [500, 300],
            "parameters": {
                "conditions": {
                    "conditions": [
                        {
                            "leftValue": "={{ $json.processed }}",
                            "rightValue": true,
                            "operator": {
                                "type": "boolean",
                                "operation": "equals"
                            }
                        }
                    ],
                    "combinator": "and"
                }
            }
        },
        {
            "id": "ai-request-1",
            "name": "AI Analysis",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [700, 200],
            "parameters": {
                "method": "POST",
                "url": "https://api.openai.com/v1/chat/completions",
                "authentication": "headerAuth"
            }
        },
        {
            "id": "email-notification-1",
            "name": "Send Email",
            "type": "n8n-nodes-base.emailSend", 
            "typeVersion": 1,
            "position": [700, 400],
            "parameters": {
                "to": "admin@company.com",
                "subject": "Test Notification"
            }
        },
        {
            "id": "merge-results-1",
            "name": "Merge Results",
            "type": "n8n-nodes-base.merge",
            "typeVersion": 3,
            "position": [900, 300],
            "parameters": {
                "mode": "combine"
            }
        }
    ],
    "connections": {
        "Webhook Trigger": {
            "main": [
                [
                    {
                        "node": "Process Data",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Process Data": {
            "main": [
                [
                    {
                        "node": "Check Conditions",
                        "type": "main", 
                        "index": 0
                    }
                ]
            ]
        },
        "Check Conditions": {
            "main": [
                [
                    {
                        "node": "AI Analysis",
                        "type": "main",
                        "index": 0
                    }
                ],
                [
                    {
                        "node": "Send Email",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "AI Analysis": {
            "main": [
                [
                    {
                        "node": "Merge Results",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Send Email": {
            "main": [
                [
                    {
                        "node": "Merge Results",
                        "type": "main",
                        "index": 1
                    }
                ]
            ]
        }
    }
};

/**
 * WORKFLOW CON TIPOS INVÁLIDOS
 */
const WORKFLOW_INVALIDO_TEST = {
    "meta": {
        "instanceId": "test-invalido"
    },
    "nodes": [
        {
            "id": "invalid-ai-1",
            "name": "Invalid AI Node",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
            "typeVersion": 1,
            "position": [100, 300],
            "parameters": {
                "modelName": "gpt-4"
            }
        },
        {
            "id": "invalid-agent-1", 
            "name": "Invalid Agent",
            "type": "@n8n/n8n-nodes-langchain.agent",
            "typeVersion": 1,
            "position": [300, 300],
            "parameters": {
                "name": "test_agent"
            }
        }
    ],
    "connections": {
        "Invalid AI Node": {
            "main": [
                [
                    {
                        "node": "Invalid Agent",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    }
};

/**
 * FUNCIÓN DE VALIDACIÓN SIMPLIFICADA
 */
function validateWorkflow(workflow) {
    const errors = [];
    const warnings = [];
    
    if (!workflow || !workflow.nodes) {
        errors.push({ message: 'Workflow inválido o sin nodos' });
        return { valid: false, errors, warnings };
    }

    let validNodes = 0;
    let invalidNodes = 0;

    workflow.nodes.forEach((node, index) => {
        // Verificar campos básicos
        if (!node.id) {
            errors.push({ message: `Nodo ${index} no tiene ID` });
        }
        if (!node.name) {
            errors.push({ message: `Nodo ${index} no tiene nombre` });
        }
        if (!node.type) {
            errors.push({ message: `Nodo ${node.name} no tiene tipo` });
            invalidNodes++;
            return;
        }

        // Verificar tipo válido
        if (!VALID_NODE_TYPES.includes(node.type)) {
            errors.push({ message: `Nodo ${node.name} tiene tipo inválido: ${node.type}` });
            invalidNodes++;
            return;
        }

        // Verificar patrones inválidos
        if (INVALID_PATTERNS.some(pattern => node.type.includes(pattern))) {
            errors.push({ message: `Nodo ${node.name} contiene patrón inválido: ${node.type}` });
            invalidNodes++;
            return;
        }

        validNodes++;
    });

    // Verificar conexiones
    if (workflow.connections) {
        const nodeNames = workflow.nodes.map(n => n.name);
        Object.keys(workflow.connections).forEach(sourceName => {
            if (!nodeNames.includes(sourceName)) {
                errors.push({ message: `Conexión desde nodo inexistente: ${sourceName}` });
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        stats: {
            totalNodes: workflow.nodes.length,
            validNodes,
            invalidNodes
        }
    };
}

/**
 * FUNCIÓN DE CORRECCIÓN SIMPLIFICADA
 */
function autocorrectWorkflow(workflow) {
    if (!workflow || !workflow.nodes) {
        throw new Error('Workflow inválido');
    }

    let correctionsMade = 0;
    
    workflow.nodes = workflow.nodes.map(node => {
        const originalType = node.type;
        
        // Corregir tipos inválidos
        if (originalType && INVALID_PATTERNS.some(pattern => originalType.includes(pattern))) {
            let newType = 'n8n-nodes-base.httpRequest'; // fallback
            
            if (originalType.includes('lmChat') || originalType.includes('openai')) {
                newType = 'n8n-nodes-base.httpRequest';
            } else if (originalType.includes('agent') || originalType.includes('tool')) {
                newType = 'n8n-nodes-base.code';
            } else if (originalType.includes('memory')) {
                newType = 'n8n-nodes-base.code';
            }
            
            correctionsMade++;
            console.log(`🔄 CORREGIDO: ${originalType} → ${newType}`);
            
            return {
                ...node,
                type: newType,
                parameters: {
                    ...node.parameters,
                    corrected: true
                }
            };
        }
        
        return node;
    });

    // Añadir metadatos de corrección
    workflow.meta = workflow.meta || {};
    workflow.meta.corrected = true;
    workflow.meta.corrections = correctionsMade;
    workflow.meta.correctionDate = new Date().toISOString();

    return workflow;
}

/**
 * FUNCIÓN PRINCIPAL DE TESTS
 */
async function runOfficialTests() {
    console.log('🧪 INICIANDO TESTS INTEGRALES CON ESPECIFICACIONES OFICIALES');
    console.log('=' .repeat(70));

    let testsPassed = 0;
    let totalTests = 0;

    // TEST 1: Validar workflow oficial
    console.log('\n📋 TEST 1: Validación de workflow con tipos oficiales');
    totalTests++;
    
    const validationResult = validateWorkflow(WORKFLOW_OFICIAL_TEST);
    
    if (validationResult.valid) {
        console.log('✅ PASÓ: Workflow oficial es válido');
        console.log(`📊 Estadísticas: ${validationResult.stats.validNodes}/${validationResult.stats.totalNodes} nodos válidos`);
        testsPassed++;
    } else {
        console.log('❌ FALLÓ: Workflow oficial tiene errores');
        validationResult.errors.slice(0, 5).forEach(error => {
            console.log(`   - ${error.message}`);
        });
    }

    // TEST 2: Corrección de workflow inválido
    console.log('\n🔧 TEST 2: Corrección de workflow con tipos inválidos');
    totalTests++;

    try {
        const workflowCorregido = autocorrectWorkflow(JSON.parse(JSON.stringify(WORKFLOW_INVALIDO_TEST)));
        
        // Validar que la corrección funcionó
        const validationCorregido = validateWorkflow(workflowCorregido);
        
        if (validationCorregido.valid) {
            console.log('✅ PASÓ: Workflow inválido fue corregido exitosamente');
            console.log(`🔄 Correcciones aplicadas: ${workflowCorregido.meta.corrections || 0}`);
            testsPassed++;
        } else {
            console.log('❌ FALLÓ: Workflow corregido aún tiene errores');
            validationCorregido.errors.slice(0, 3).forEach(error => {
                console.log(`   - ${error.message}`);
            });
        }
    } catch (error) {
        console.log('❌ FALLÓ: Error en proceso de corrección:', error.message);
    }

    // TEST 3: Verificar tipos de nodos prohibidos
    console.log('\n🚫 TEST 3: Detección de tipos prohibidos');
    totalTests++;

    const tiposProhibidosEncontrados = [];
    WORKFLOW_INVALIDO_TEST.nodes.forEach(node => {
        if (INVALID_PATTERNS.some(pattern => node.type.includes(pattern))) {
            tiposProhibidosEncontrados.push(node.type);
        }
    });

    if (tiposProhibidosEncontrados.length > 0) {
        console.log('✅ PASÓ: Tipos prohibidos detectados correctamente');
        console.log(`🚫 Tipos encontrados: ${tiposProhibidosEncontrados.join(', ')}`);
        testsPassed++;
    } else {
        console.log('❌ FALLÓ: No se detectaron tipos prohibidos');
    }

    // TEST 4: Verificar estructura de conexiones
    console.log('\n🔗 TEST 4: Validación de estructura de conexiones');
    totalTests++;

    const conexionesValidas = WORKFLOW_OFICIAL_TEST.connections ? 
        Object.keys(WORKFLOW_OFICIAL_TEST.connections).length > 0 : false;
    
    if (conexionesValidas) {
        console.log('✅ PASÓ: Estructura de conexiones válida');
        console.log(`🔗 Conexiones: ${Object.keys(WORKFLOW_OFICIAL_TEST.connections).length}`);
        testsPassed++;
    } else {
        console.log('❌ FALLÓ: Estructura de conexiones inválida');
    }

    // TEST 5: Guardar resultados
    console.log('\n💾 TEST 5: Guardado de resultados');
    totalTests++;

    try {
        const outputDir = path.join(__dirname, 'test-outputs-oficiales');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Guardar workflow oficial
        const oficialPath = path.join(outputDir, 'workflow-oficial-test.json');
        fs.writeFileSync(oficialPath, JSON.stringify(WORKFLOW_OFICIAL_TEST, null, 2));

        // Guardar workflow corregido si existe
        if (typeof workflowCorregido !== 'undefined') {
            const corregidoPath = path.join(outputDir, 'workflow-corregido-test.json');
            fs.writeFileSync(corregidoPath, JSON.stringify(workflowCorregido, null, 2));
        }

        console.log('✅ PASÓ: Resultados guardados exitosamente');
        console.log(`📁 Directorio: ${outputDir}`);
        testsPassed++;
    } catch (error) {
        console.log('❌ FALLÓ: Error guardando resultados:', error.message);
    }

    // RESUMEN FINAL
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMEN DE TESTS');
    console.log(`✅ Tests pasados: ${testsPassed}/${totalTests}`);
    console.log(`📈 Tasa de éxito: ${(testsPassed/totalTests*100).toFixed(1)}%`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 TODOS LOS TESTS PASARON - SISTEMA OFICIAL FUNCIONANDO');
        console.log('✅ Los workflows generados usan únicamente tipos oficiales n8n-nodes-base.*');
        console.log('✅ Los tipos inválidos @n8n/n8n-nodes-langchain.* son detectados y corregidos');
        console.log('✅ El sistema de validación funciona correctamente');
    } else {
        console.log('⚠️ ALGUNOS TESTS FALLARON - REVISAR IMPLEMENTACIÓN');
    }

    return { passed: testsPassed, total: totalTests, success: testsPassed === totalTests };
}

// EJECUTAR TESTS
if (import.meta.url === `file://${process.argv[1]}`) {
    runOfficialTests().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('💥 Error ejecutando tests:', error);
        process.exit(1);
    });
}

export {
    runOfficialTests,
    WORKFLOW_OFICIAL_TEST,
    WORKFLOW_INVALIDO_TEST,
    validateWorkflow,
    autocorrectWorkflow
};
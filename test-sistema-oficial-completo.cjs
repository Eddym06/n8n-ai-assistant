// 🧪 TEST INTEGRAL CON ESPECIFICACIONES OFICIALES N8N
// Prueba el sistema completo usando únicamente tipos oficiales válidos

const fs = require('fs');
const path = require('path');

// Importar sistemas corregidos
const { autocorrectWorkflow } = require('./workflow-autocorrector-v4-OFICIAL.js');
const { validateWorkflow } = require('./n8n-official-validator.js');

/**
 * WORKFLOW DE PRUEBA CON TIPOS OFICIALES
 * Basado en la investigación del repositorio n8n-io/n8n
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
                "jsCode": `
// Procesar datos de entrada
const input = $input.first().json;

// Lógica de procesamiento
const processed = {
    original: input,
    processed: true,
    timestamp: new Date().toISOString(),
    type: 'webhook_data',
    sentiment: input.message ? 'analyzed' : 'no_message'
};

return [{ json: processed }];
`
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
                    "options": {
                        "caseSensitive": true,
                        "leftValue": "",
                        "typeValidation": "strict"
                    },
                    "conditions": [
                        {
                            "id": "condition1",
                            "leftValue": "={{ $json.sentiment }}",
                            "rightValue": "analyzed",
                            "operator": {
                                "type": "string",
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
                "authentication": "headerAuth",
                "headerAuth": {
                    "name": "Authorization",
                    "value": "Bearer {{ $env.OPENAI_API_KEY }}"
                },
                "sendHeaders": true,
                "headerParameters": {
                    "parameters": [
                        {
                            "name": "Content-Type",
                            "value": "application/json"
                        }
                    ]
                },
                "sendBody": true,
                "bodyContentType": "json",
                "jsonBody": {
                    "model": "gpt-4",
                    "temperature": 0.7,
                    "messages": [
                        {
                            "role": "system",
                            "content": "Analiza el sentimiento del texto y responde en JSON."
                        },
                        {
                            "role": "user",
                            "content": "{{ $json.original.message }}"
                        }
                    ]
                }
            }
        },
        {
            "id": "email-notification-1",
            "name": "Send Email Notification",
            "type": "n8n-nodes-base.emailSend", 
            "typeVersion": 1,
            "position": [700, 400],
            "parameters": {
                "to": "admin@company.com",
                "subject": "Webhook Data Received",
                "body": "Se recibió data: {{ $json.original.message }}"
            }
        },
        {
            "id": "merge-results-1",
            "name": "Merge Results",
            "type": "n8n-nodes-base.merge",
            "typeVersion": 3,
            "position": [900, 300],
            "parameters": {
                "mode": "combine",
                "combinationMode": "mergeByPosition"
            }
        },
        {
            "id": "final-processing-1",
            "name": "Final Processing",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1100, 300],
            "parameters": {
                "language": "javaScript",
                "jsCode": `
// Procesamiento final
const allData = $input.all();

const finalResult = {
    workflow_completed: true,
    timestamp: new Date().toISOString(),
    processed_items: allData.length,
    data: allData.map(item => item.json),
    status: 'success'
};

return [{ json: finalResult }];
`
            }
        },
        {
            "id": "webhook-response-1",
            "name": "Webhook Response",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [1300, 300],
            "parameters": {
                "responseBody": "{{ $json }}",
                "options": {
                    "responseCode": 200,
                    "responseHeaders": {
                        "Content-Type": "application/json"
                    }
                }
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
                        "node": "Send Email Notification",
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
        "Send Email Notification": {
            "main": [
                [
                    {
                        "node": "Merge Results",
                        "type": "main",
                        "index": 1
                    }
                ]
            ]
        },
        "Merge Results": {
            "main": [
                [
                    {
                        "node": "Final Processing",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Final Processing": {
            "main": [
                [
                    {
                        "node": "Webhook Response",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    },
    "pinData": {},
    "settings": {
        "executionOrder": "v1"
    },
    "staticData": {},
    "tags": [],
    "triggerCount": 0,
    "updatedAt": "2025-01-24T00:00:00.000Z",
    "versionId": "oficial-test-v1"
};

/**
 * WORKFLOW CON TIPOS INVÁLIDOS PARA PRUEBA DE CORRECCIÓN
 */
const WORKFLOW_INVALIDO_TEST = {
    "meta": {
        "instanceId": "test-invalido-para-corregir"
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
        },
        {
            "id": "invalid-memory-1",
            "name": "Invalid Memory",
            "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
            "typeVersion": 1,
            "position": [500, 300],
            "parameters": {
                "memoryKey": "test_memory"
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
        },
        "Invalid Agent": {
            "main": [
                [
                    {
                        "node": "Invalid Memory",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    }
};

/**
 * FUNCIÓN DE PRUEBAS PRINCIPALES
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
        validationResult.errors.forEach(error => {
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
            validationCorregido.errors.forEach(error => {
                console.log(`   - ${error.message}`);
            });
        }
    } catch (error) {
        console.log('❌ FALLÓ: Error en proceso de corrección:', error.message);
    }

    // TEST 3: Generación de workflow complejo
    console.log('\n🏗️ TEST 3: Generación de workflow e-commerce complejo');
    totalTests++;

    const workflowComplejo = generateEcommerceWorkflow();
    const validationComplejo = validateWorkflow(workflowComplejo);

    if (validationComplejo.valid) {
        console.log('✅ PASÓ: Workflow e-commerce generado es válido');
        console.log(`🛒 Nodos: ${workflowComplejo.nodes.length}, Conexiones: ${Object.keys(workflowComplejo.connections).length}`);
        testsPassed++;
    } else {
        console.log('❌ FALLÓ: Workflow e-commerce tiene errores');
        validationComplejo.errors.slice(0, 5).forEach(error => {
            console.log(`   - ${error.message}`);
        });
    }

    // TEST 4: Workflow de automatización empresarial
    console.log('\n🏢 TEST 4: Workflow de automatización empresarial');
    totalTests++;

    const workflowEmpresarial = generateBusinessAutomationWorkflow();
    const validationEmpresarial = validateWorkflow(workflowEmpresarial);

    if (validationEmpresarial.valid) {
        console.log('✅ PASÓ: Workflow empresarial es válido');
        console.log(`🏢 Integraciones: Slack, Email, Google Sheets, CRM`);
        testsPassed++;
    } else {
        console.log('❌ FALLÓ: Workflow empresarial tiene errores');
        validationEmpresarial.errors.slice(0, 5).forEach(error => {
            console.log(`   - ${error.message}`);
        });
    }

    // TEST 5: Guardar workflows de prueba
    console.log('\n💾 TEST 5: Guardado de workflows válidos');
    totalTests++;

    try {
        saveTestWorkflows({
            oficial: WORKFLOW_OFICIAL_TEST,
            corregido: workflowCorregido || null,
            ecommerce: workflowComplejo,
            empresarial: workflowEmpresarial
        });
        console.log('✅ PASÓ: Workflows guardados exitosamente');
        testsPassed++;
    } catch (error) {
        console.log('❌ FALLÓ: Error guardando workflows:', error.message);
    }

    // RESUMEN FINAL
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMEN DE TESTS');
    console.log(`✅ Tests pasados: ${testsPassed}/${totalTests}`);
    console.log(`📈 Tasa de éxito: ${(testsPassed/totalTests*100).toFixed(1)}%`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 TODOS LOS TESTS PASARON - SISTEMA OFICIAL FUNCIONANDO');
    } else {
        console.log('⚠️ ALGUNOS TESTS FALLARON - REVISAR IMPLEMENTACIÓN');
    }

    return { passed: testsPassed, total: totalTests, success: testsPassed === totalTests };
}

/**
 * GENERAR WORKFLOW E-COMMERCE COMPLEJO
 */
function generateEcommerceWorkflow() {
    return {
        "meta": {
            "instanceId": "ecommerce-oficial-test"
        },
        "nodes": [
            {
                "id": "shopify-webhook-1",
                "name": "Shopify Order",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 2,
                "position": [100, 300],
                "parameters": {
                    "httpMethod": "POST",
                    "path": "shopify-order",
                    "responseMode": "onReceived"
                }
            },
            {
                "id": "order-validation-1",
                "name": "Validate Order",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [300, 300],
                "parameters": {
                    "language": "javaScript",
                    "jsCode": `
const order = $input.first().json;

// Validar datos de orden
const validation = {
    valid: order.total_price && order.customer && order.line_items,
    total: parseFloat(order.total_price || 0),
    customer_email: order.customer?.email,
    items_count: order.line_items?.length || 0,
    order_id: order.id
};

return [{ json: { ...order, validation } }];
`
                }
            },
            {
                "id": "payment-check-1",
                "name": "Check Payment",
                "type": "n8n-nodes-base.if",
                "typeVersion": 2,
                "position": [500, 300],
                "parameters": {
                    "conditions": {
                        "conditions": [
                            {
                                "leftValue": "={{ $json.financial_status }}",
                                "rightValue": "paid",
                                "operator": {
                                    "type": "string",
                                    "operation": "equals"
                                }
                            }
                        ],
                        "combinator": "and"
                    }
                }
            },
            {
                "id": "stripe-verification-1",
                "name": "Verify Payment",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4,
                "position": [700, 200],
                "parameters": {
                    "method": "GET",
                    "url": "https://api.stripe.com/v1/charges/{{ $json.payment_id }}",
                    "authentication": "headerAuth",
                    "headerAuth": {
                        "name": "Authorization",
                        "value": "Bearer {{ $env.STRIPE_SECRET_KEY }}"
                    }
                }
            },
            {
                "id": "inventory-update-1",
                "name": "Update Inventory",
                "type": "n8n-nodes-base.googleSheets",
                "typeVersion": 4,
                "position": [700, 400],
                "parameters": {
                    "operation": "update",
                    "documentId": "{{ $env.INVENTORY_SHEET_ID }}",
                    "sheetName": "Inventory",
                    "columns": {
                        "mappingMode": "defineBelow",
                        "value": {
                            "SKU": "={{ $json.line_items[0].sku }}",
                            "Quantity": "={{ $json.line_items[0].quantity }}",
                            "Status": "sold"
                        }
                    }
                }
            },
            {
                "id": "customer-notification-1",
                "name": "Customer Email",
                "type": "n8n-nodes-base.emailSend",
                "typeVersion": 1,
                "position": [900, 300],
                "parameters": {
                    "to": "={{ $json.customer.email }}",
                    "subject": "Confirmación de pedido #{{ $json.order_number }}",
                    "body": "Hola {{ $json.customer.first_name }},\n\nTu pedido #{{ $json.order_number }} ha sido confirmado.\n\nTotal: ${{ $json.total_price }}\nEstado: {{ $json.financial_status }}\n\nGracias por tu compra!"
                }
            }
        ],
        "connections": {
            "Shopify Order": {
                "main": [
                    [
                        {
                            "node": "Validate Order",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Validate Order": {
                "main": [
                    [
                        {
                            "node": "Check Payment",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Check Payment": {
                "main": [
                    [
                        {
                            "node": "Verify Payment",
                            "type": "main",
                            "index": 0
                        }
                    ],
                    [
                        {
                            "node": "Update Inventory",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Verify Payment": {
                "main": [
                    [
                        {
                            "node": "Customer Email",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Update Inventory": {
                "main": [
                    [
                        {
                            "node": "Customer Email",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        }
    };
}

/**
 * GENERAR WORKFLOW EMPRESARIAL
 */
function generateBusinessAutomationWorkflow() {
    return {
        "meta": {
            "instanceId": "business-automation-oficial"
        },
        "nodes": [
            {
                "id": "form-trigger-1",
                "name": "Support Request",
                "type": "n8n-nodes-base.formTrigger",
                "typeVersion": 1,
                "position": [100, 300],
                "parameters": {
                    "formTitle": "Support Request Form",
                    "formFields": {
                        "values": [
                            {
                                "fieldLabel": "Name",
                                "fieldType": "text",
                                "requiredField": true
                            },
                            {
                                "fieldLabel": "Email", 
                                "fieldType": "email",
                                "requiredField": true
                            },
                            {
                                "fieldLabel": "Issue",
                                "fieldType": "textarea",
                                "requiredField": true
                            }
                        ]
                    }
                }
            },
            {
                "id": "priority-analysis-1",
                "name": "Analyze Priority",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [300, 300],
                "parameters": {
                    "language": "javaScript",
                    "jsCode": `
const request = $input.first().json;
const issue = (request.issue || '').toLowerCase();

// Determinar prioridad basado en palabras clave
let priority = 'low';
let urgency = 1;

if (issue.includes('urgent') || issue.includes('critical') || issue.includes('down')) {
    priority = 'high';
    urgency = 3;
} else if (issue.includes('important') || issue.includes('problem')) {
    priority = 'medium';
    urgency = 2;
}

return [{
    json: {
        ...request,
        priority,
        urgency,
        ticket_id: 'TKT-' + Date.now(),
        created_at: new Date().toISOString()
    }
}];
`
                }
            },
            {
                "id": "high-priority-check-1",
                "name": "High Priority?",
                "type": "n8n-nodes-base.if",
                "typeVersion": 2,
                "position": [500, 300],
                "parameters": {
                    "conditions": {
                        "conditions": [
                            {
                                "leftValue": "={{ $json.priority }}",
                                "rightValue": "high",
                                "operator": {
                                    "type": "string",
                                    "operation": "equals"
                                }
                            }
                        ]
                    }
                }
            },
            {
                "id": "slack-urgent-1",
                "name": "Urgent Slack Alert",
                "type": "n8n-nodes-base.slack",
                "typeVersion": 1,
                "position": [700, 200],
                "parameters": {
                    "operation": "postMessage",
                    "channel": "#urgent-support",
                    "message": "🚨 URGENT SUPPORT REQUEST\nTicket: {{ $json.ticket_id }}\nFrom: {{ $json.name }} ({{ $json.email }})\nIssue: {{ $json.issue }}"
                }
            },
            {
                "id": "crm-record-1",
                "name": "Create CRM Record",
                "type": "n8n-nodes-base.hubspot",
                "typeVersion": 1,
                "position": [700, 400],
                "parameters": {
                    "operation": "create",
                    "resource": "ticket",
                    "properties": {
                        "subject": "{{ $json.ticket_id }}: Support Request",
                        "content": "{{ $json.issue }}",
                        "priority": "{{ $json.priority }}",
                        "source": "Form Submission"
                    }
                }
            },
            {
                "id": "auto-response-1",
                "name": "Auto Response",
                "type": "n8n-nodes-base.emailSend",
                "typeVersion": 1,
                "position": [900, 300],
                "parameters": {
                    "to": "{{ $json.email }}",
                    "subject": "Re: {{ $json.ticket_id }} - Support Request Received",
                    "body": "Hola {{ $json.name }},\n\nHemos recibido tu solicitud de soporte con el ticket #{{ $json.ticket_id }}.\n\nPrioridad: {{ $json.priority }}\nEstado: En proceso\n\nNuestro equipo te contactará pronto.\n\nSaludos,\nEquipo de Soporte"
                }
            }
        ],
        "connections": {
            "Support Request": {
                "main": [
                    [
                        {
                            "node": "Analyze Priority",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Analyze Priority": {
                "main": [
                    [
                        {
                            "node": "High Priority?",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "High Priority?": {
                "main": [
                    [
                        {
                            "node": "Urgent Slack Alert",
                            "type": "main",
                            "index": 0
                        }
                    ],
                    [
                        {
                            "node": "Create CRM Record",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Urgent Slack Alert": {
                "main": [
                    [
                        {
                            "node": "Auto Response",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Create CRM Record": {
                "main": [
                    [
                        {
                            "node": "Auto Response",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        }
    };
}

/**
 * GUARDAR WORKFLOWS DE PRUEBA
 */
function saveTestWorkflows(workflows) {
    const outputDir = path.join(__dirname, 'test-outputs-oficiales');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    Object.entries(workflows).forEach(([name, workflow]) => {
        if (workflow) {
            const filename = `workflow-${name}-oficial-${new Date().toISOString().split('T')[0]}.json`;
            const filepath = path.join(outputDir, filename);
            fs.writeFileSync(filepath, JSON.stringify(workflow, null, 2));
            console.log(`📄 Guardado: ${filename}`);
        }
    });
}

// EJECUTAR TESTS SI SE LLAMA DIRECTAMENTE
if (require.main === module) {
    runOfficialTests().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('💥 Error ejecutando tests:', error);
        process.exit(1);
    });
}

module.exports = {
    runOfficialTests,
    WORKFLOW_OFICIAL_TEST,
    WORKFLOW_INVALIDO_TEST,
    generateEcommerceWorkflow,
    generateBusinessAutomationWorkflow
};
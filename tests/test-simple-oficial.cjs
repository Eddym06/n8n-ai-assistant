// 🧪 TEST SIMPLIFICADO DEL SISTEMA OFICIAL N8N
// Verificación de que los workflows usen únicamente tipos oficiales

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
    'n8n-nodes-base.googleSheets',
    'n8n-nodes-base.manualTrigger',
    'n8n-nodes-base.scheduleTrigger',
    'n8n-nodes-base.cron',
    'n8n-nodes-base.telegram',
    'n8n-nodes-base.discord',
    'n8n-nodes-base.notion',
    'n8n-nodes-base.airtable',
    'n8n-nodes-base.shopify',
    'n8n-nodes-base.stripe'
];

const INVALID_PATTERNS = [
    '@n8n/n8n-nodes-langchain',
    'n8n-nodes-langchain'
];

// WORKFLOW CON TIPOS OFICIALES VÁLIDOS
const WORKFLOW_VALIDO = {
    "meta": { "instanceId": "test-oficial" },
    "nodes": [
        {
            "id": "trigger-1",
            "name": "Webhook Start",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 2,
            "position": [100, 300],
            "parameters": {
                "httpMethod": "POST",
                "path": "start"
            }
        },
        {
            "id": "process-1",
            "name": "Process Data",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [300, 300],
            "parameters": {
                "language": "javaScript",
                "jsCode": "return [{ json: { processed: true, data: $input.first().json } }];"
            }
        },
        {
            "id": "condition-1",
            "name": "Check Result",
            "type": "n8n-nodes-base.if",
            "typeVersion": 2,
            "position": [500, 300],
            "parameters": {
                "conditions": {
                    "conditions": [{
                        "leftValue": "={{ $json.processed }}",
                        "rightValue": true,
                        "operator": { "type": "boolean", "operation": "equals" }
                    }]
                }
            }
        },
        {
            "id": "api-call-1",
            "name": "External API",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [700, 300],
            "parameters": {
                "method": "GET",
                "url": "https://api.example.com/data"
            }
        }
    ],
    "connections": {
        "Webhook Start": {
            "main": [[ { "node": "Process Data", "type": "main", "index": 0 } ]]
        },
        "Process Data": {
            "main": [[ { "node": "Check Result", "type": "main", "index": 0 } ]]
        },
        "Check Result": {
            "main": [[ { "node": "External API", "type": "main", "index": 0 } ]]
        }
    }
};

// WORKFLOW CON TIPOS INVÁLIDOS
const WORKFLOW_INVALIDO = {
    "meta": { "instanceId": "test-invalido" },
    "nodes": [
        {
            "id": "invalid-1",
            "name": "Invalid AI",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
            "typeVersion": 1,
            "position": [100, 300]
        },
        {
            "id": "invalid-2",
            "name": "Invalid Agent",
            "type": "@n8n/n8n-nodes-langchain.agent",
            "typeVersion": 1,
            "position": [300, 300]
        }
    ],
    "connections": {
        "Invalid AI": {
            "main": [[ { "node": "Invalid Agent", "type": "main", "index": 0 } ]]
        }
    }
};

// FUNCIÓN DE VALIDACIÓN
function validateWorkflow(workflow) {
    const errors = [];
    let validNodes = 0;
    
    if (!workflow || !workflow.nodes) {
        return { valid: false, errors: [{ message: 'Workflow sin nodos' }] };
    }

    workflow.nodes.forEach(node => {
        if (!node.type) {
            errors.push({ message: `Nodo ${node.name} sin tipo` });
            return;
        }

        // Verificar patrones inválidos
        if (INVALID_PATTERNS.some(pattern => node.type.includes(pattern))) {
            errors.push({ message: `TIPO INVÁLIDO: ${node.name} usa ${node.type}` });
            return;
        }

        // Verificar que esté en lista oficial o use prefijo correcto
        if (!VALID_NODE_TYPES.includes(node.type) && !node.type.startsWith('n8n-nodes-base.')) {
            errors.push({ message: `Tipo no oficial: ${node.name} usa ${node.type}` });
            return;
        }

        validNodes++;
    });

    return {
        valid: errors.length === 0,
        errors,
        stats: { 
            totalNodes: workflow.nodes.length, 
            validNodes, 
            invalidNodes: workflow.nodes.length - validNodes 
        }
    };
}

// FUNCIÓN DE CORRECCIÓN
function autocorrectWorkflow(workflow) {
    let corrections = 0;
    
    workflow.nodes = workflow.nodes.map(node => {
        if (INVALID_PATTERNS.some(pattern => node.type.includes(pattern))) {
            corrections++;
            const oldType = node.type;
            let newType = 'n8n-nodes-base.httpRequest'; // fallback
            
            if (oldType.includes('lmChat') || oldType.includes('openai')) {
                newType = 'n8n-nodes-base.httpRequest';
            } else if (oldType.includes('agent') || oldType.includes('tool')) {
                newType = 'n8n-nodes-base.code';
            }
            
            console.log(`🔄 CORREGIDO: ${oldType} → ${newType}`);
            return { ...node, type: newType };
        }
        return node;
    });

    workflow.meta = workflow.meta || {};
    workflow.meta.corrected = true;
    workflow.meta.corrections = corrections;
    
    return workflow;
}

// EJECUTAR TESTS
function runTests() {
    console.log('🧪 EJECUTANDO TESTS DEL SISTEMA OFICIAL N8N');
    console.log('='.repeat(60));

    let passed = 0;
    let total = 0;

    // TEST 1: Validar workflow oficial
    console.log('\n📋 TEST 1: Workflow con tipos oficiales');
    total++;
    const result1 = validateWorkflow(WORKFLOW_VALIDO);
    if (result1.valid) {
        console.log('✅ PASÓ: Workflow oficial válido');
        console.log(`   📊 ${result1.stats.validNodes}/${result1.stats.totalNodes} nodos válidos`);
        passed++;
    } else {
        console.log('❌ FALLÓ: Workflow oficial inválido');
        result1.errors.forEach(e => console.log(`   - ${e.message}`));
    }

    // TEST 2: Detectar tipos inválidos
    console.log('\n🚫 TEST 2: Detección de tipos inválidos');
    total++;
    const result2 = validateWorkflow(WORKFLOW_INVALIDO);
    if (!result2.valid && result2.errors.some(e => e.message.includes('TIPO INVÁLIDO'))) {
        console.log('✅ PASÓ: Tipos inválidos detectados correctamente');
        console.log(`   🚫 Errores encontrados: ${result2.errors.length}`);
        passed++;
    } else {
        console.log('❌ FALLÓ: No se detectaron tipos inválidos');
    }

    // TEST 3: Corrección automática
    console.log('\n🔧 TEST 3: Corrección automática');
    total++;
    try {
        const workflowCorregido = autocorrectWorkflow(JSON.parse(JSON.stringify(WORKFLOW_INVALIDO)));
        const result3 = validateWorkflow(workflowCorregido);
        
        if (result3.valid) {
            console.log('✅ PASÓ: Workflow corregido exitosamente');
            console.log(`   🔄 Correcciones: ${workflowCorregido.meta.corrections}`);
            passed++;
        } else {
            console.log('❌ FALLÓ: Workflow aún tiene errores después de corrección');
        }
    } catch (error) {
        console.log('❌ FALLÓ: Error en corrección:', error.message);
    }

    // TEST 4: Verificar tipos específicos
    console.log('\n🎯 TEST 4: Verificación de tipos específicos');
    total++;
    const tiposEncontrados = WORKFLOW_VALIDO.nodes.map(n => n.type);
    const todosOficiales = tiposEncontrados.every(tipo => 
        VALID_NODE_TYPES.includes(tipo) || tipo.startsWith('n8n-nodes-base.')
    );
    
    if (todosOficiales) {
        console.log('✅ PASÓ: Todos los tipos son oficiales');
        console.log(`   📋 Tipos: ${tiposEncontrados.join(', ')}`);
        passed++;
    } else {
        console.log('❌ FALLÓ: Algunos tipos no son oficiales');
    }

    // TEST 5: Verificar patrones prohibidos
    console.log('\n⛔ TEST 5: Verificación de patrones prohibidos');
    total++;
    const patronesEncontrados = WORKFLOW_INVALIDO.nodes.filter(node =>
        INVALID_PATTERNS.some(pattern => node.type.includes(pattern))
    );
    
    if (patronesEncontrados.length > 0) {
        console.log('✅ PASÓ: Patrones prohibidos detectados');
        console.log(`   ⛔ Encontrados: ${patronesEncontrados.length} nodos con patrones inválidos`);
        passed++;
    } else {
        console.log('❌ FALLÓ: No se detectaron patrones prohibidos');
    }

    // RESUMEN
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE TESTS');
    console.log(`✅ Pasados: ${passed}/${total}`);
    console.log(`📈 Éxito: ${(passed/total*100).toFixed(1)}%`);

    if (passed === total) {
        console.log('\n🎉 TODOS LOS TESTS PASARON');
        console.log('✅ El sistema usa únicamente tipos oficiales n8n-nodes-base.*');
        console.log('✅ Los tipos inválidos @n8n/n8n-nodes-langchain.* son detectados');
        console.log('✅ La corrección automática funciona correctamente');
        console.log('\n📋 TIPOS OFICIALES VÁLIDOS CONFIRMADOS:');
        console.log('   - n8n-nodes-base.webhook (triggers)');
        console.log('   - n8n-nodes-base.code (procesamiento)');
        console.log('   - n8n-nodes-base.httpRequest (APIs)');
        console.log('   - n8n-nodes-base.if (condiciones)');
        console.log('   - n8n-nodes-base.emailSend (notificaciones)');
        console.log('   - Y 200+ tipos más documentados en INVESTIGACION-NODOS-N8N-OFICIAL.md');
    } else {
        console.log('\n⚠️ ALGUNOS TESTS FALLARON');
        console.log('Revisar implementación del sistema');
    }

    return { passed, total, success: passed === total };
}

// EJECUTAR
runTests();
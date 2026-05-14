const fs = require('fs');

// Crear un flujo minimalista basado en el problemático pero ultra simplificado
const problematicFile = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757337804197.json';

console.log('🔬 Creando versión minimalista para diagnóstico...');

try {
    const workflow = JSON.parse(fs.readFileSync(problematicFile, 'utf8'));
    
    // Crear versión super simplificada con solo 3 nodos
    const minimalWorkflow = {
        "nodes": [
            {
                "id": "webhook-node-1",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "position": [100, 100],
                "parameters": {
                    "httpMethod": "POST",
                    "path": "test"
                },
                "typeVersion": 1
            },
            {
                "id": "set-node-2", 
                "name": "Set Data",
                "type": "n8n-nodes-base.set",
                "position": [300, 100],
                "parameters": {
                    "values": [
                        {
                            "name": "test",
                            "value": "Hello World"
                        }
                    ]
                },
                "typeVersion": 1
            },
            {
                "id": "http-node-3",
                "name": "HTTP Request",
                "type": "n8n-nodes-base.httpRequest",
                "position": [500, 100],
                "parameters": {
                    "url": "https://httpbin.org/post",
                    "method": "POST"
                },
                "typeVersion": 1
            }
        ],
        "connections": {
            "Webhook": {
                "main": [
                    [
                        {
                            "node": "Set Data",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Set Data": {
                "main": [
                    [
                        {
                            "node": "HTTP Request", 
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "settings": {}
    };
    
    // Guardar versión minimalista
    const minimalFile = problematicFile.replace('.json', '-MINIMAL.json');
    fs.writeFileSync(minimalFile, JSON.stringify(minimalWorkflow, null, 2));
    
    console.log('✅ Versión minimalista creada');
    console.log(`📄 Archivo: ${minimalFile.split('\\').pop()}`);
    console.log('📊 Contenido: 3 nodos básicos con conexiones simples');
    
    // También crear versión con algunos nodos del original pero limpiados
    console.log('\n🔄 Creando versión reducida con nodos originales...');
    
    const reducedWorkflow = {
        nodes: workflow.nodes.slice(0, 5).map((node, index) => ({
            id: `node-${index + 1}`,
            name: node.name || `Node ${index + 1}`,
            type: node.type || 'n8n-nodes-base.noOp',
            position: [100 + (index * 200), 100],
            parameters: {},
            typeVersion: 1
        })),
        connections: {},
        settings: {}
    };
    
    const reducedFile = problematicFile.replace('.json', '-REDUCED.json');
    fs.writeFileSync(reducedFile, JSON.stringify(reducedWorkflow, null, 2));
    
    console.log('✅ Versión reducida creada');
    console.log(`📄 Archivo: ${reducedFile.split('\\').pop()}`);
    console.log('📊 Contenido: 5 primeros nodos del original, sin conexiones');
    
    console.log('\n🎯 Prueba importar estos archivos en orden:');
    console.log('1. -MINIMAL.json (debe funcionar siempre)');
    console.log('2. -REDUCED.json (5 nodos originales)');
    console.log('3. -ULTRA-CLEAN.json (flujo completo limpio)');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
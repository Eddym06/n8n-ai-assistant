#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO DE INSTANCIAS N8N
 * Este script ayuda a identificar diferencias entre instancias de n8n
 * que causan que el mismo workflow funcione en una pero falle en otra
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE INSTANCIAS N8N');
console.log('================================');

// Función para verificar archivo de workflow problemático
function analizarWorkflowProblematico() {
    console.log('\n📁 ANÁLISIS DEL WORKFLOW PROBLEMÁTICO:');
    
    const workflowPath = './generated-workflows/workflow-masivo-gemini-1757339505161.json';
    
    try {
        if (!fs.existsSync(workflowPath)) {
            console.log('❌ Archivo no encontrado:', workflowPath);
            return;
        }
        
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        const workflow = JSON.parse(workflowContent);
        
        console.log('✅ Archivo válido');
        console.log(`📊 Nodos: ${workflow.nodes?.length || 0}`);
        console.log(`🔗 Conexiones: ${Object.keys(workflow.connections || {}).length}`);
        
        // Analizar tipos de nodos únicos
        const nodeTypes = [...new Set(workflow.nodes?.map(n => n.type) || [])];
        console.log(`🧩 Tipos de nodos únicos: ${nodeTypes.length}`);
        
        // Buscar nodos problemáticos conocidos
        const problematicTypes = [
            'n8n-nodes-base.openAi',
            'n8n-nodes-base.anthropic', 
            'n8n-nodes-base.googleSheets',
            'n8n-nodes-base.slack',
            'n8n-nodes-base.telegram',
            'n8n-nodes-base.twilio'
        ];
        
        const foundProblematic = nodeTypes.filter(type => 
            problematicTypes.some(prob => type.includes(prob.split('.')[1]))
        );
        
        if (foundProblematic.length > 0) {
            console.log('⚠️ Nodos que pueden requerir credenciales/configuración:');
            foundProblematic.forEach(type => console.log(`   • ${type}`));
        }
        
        // Verificar parámetros complejos
        let nodosConParametrosComplejos = 0;
        workflow.nodes?.forEach(node => {
            if (node.parameters && Object.keys(node.parameters).length > 5) {
                nodosConParametrosComplejos++;
            }
        });
        
        console.log(`🔧 Nodos con parámetros complejos: ${nodosConParametrosComplejos}`);
        
    } catch (error) {
        console.error('❌ Error analizando workflow:', error.message);
    }
}

// Función para generar comandos de verificación
function generarComandosVerificacion() {
    console.log('\n🛠️ COMANDOS PARA EJECUTAR EN CADA INSTANCIA N8N:');
    console.log('==================================================');
    
    console.log('\n1️⃣ VERIFICAR VERSIÓN:');
    console.log('```bash');
    console.log('npm list n8n');
    console.log('npm list -g n8n');
    console.log('n8n --version');
    console.log('```');
    
    console.log('\n2️⃣ VERIFICAR CONFIGURACIÓN:');
    console.log('```bash');
    console.log('echo $N8N_PORT');
    console.log('echo $N8N_HOST'); 
    console.log('echo $N8N_PROTOCOL');
    console.log('echo $N8N_DATABASE_TYPE');
    console.log('echo $N8N_DATABASE_SQLITE_DATABASE');
    console.log('```');
    
    console.log('\n3️⃣ VERIFICAR LOGS DE ERROR:');
    console.log('- En la instancia que falla, abrir DevTools (F12)');
    console.log('- Ir a Console y buscar errores rojos');
    console.log('- Ir a Network y buscar requests fallidos (status 400-500)');
    
    console.log('\n4️⃣ VERIFICAR URL DE LAS INSTANCIAS:');
    console.log('- Instancia 1: http://localhost:5678');
    console.log('- Instancia 2: http://localhost:????');
    console.log('- ¿Cuál es el puerto de la segunda instancia?');
}

// Función para crear script de prueba
function crearScriptPrueba() {
    console.log('\n🧪 CREANDO SCRIPT DE PRUEBA SIMPLE...');
    
    const testWorkflow = {
        "nodes": [
            {
                "id": "test-webhook",
                "name": "Test Webhook Simple", 
                "type": "n8n-nodes-base.webhook",
                "position": [100, 100],
                "parameters": {
                    "httpMethod": "POST",
                    "path": "test-simple"
                },
                "typeVersion": 1
            },
            {
                "id": "test-set",
                "name": "Test Set Data",
                "type": "n8n-nodes-base.set", 
                "position": [300, 100],
                "parameters": {
                    "values": {
                        "string": [
                            {
                                "name": "test_message",
                                "value": "Hello from test workflow"
                            }
                        ]
                    }
                },
                "typeVersion": 1
            }
        ],
        "connections": {
            "Test Webhook Simple": {
                "main": [
                    [
                        {
                            "node": "Test Set Data",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "settings": {}
    };
    
    const testFilePath = './test-workflow-simple.json';
    
    try {
        fs.writeFileSync(testFilePath, JSON.stringify(testWorkflow, null, 2));
        console.log('✅ Workflow de prueba creado:', testFilePath);
        console.log('🔍 Prueba este workflow simple en ambas instancias');
        console.log('   Si este también falla, el problema es más básico');
        console.log('   Si este funciona, el problema está en la complejidad del workflow masivo');
    } catch (error) {
        console.error('❌ Error creando workflow de prueba:', error.message);
    }
}

// Función principal
function main() {
    analizarWorkflowProblematico();
    generarComandosVerificacion();
    crearScriptPrueba();
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('==================');
    console.log('1. Ejecuta los comandos de verificación en ambas instancias');
    console.log('2. Compara los resultados');
    console.log('3. Prueba el workflow simple test-workflow-simple.json');
    console.log('4. Revisa los logs de error en DevTools');
    console.log('5. Comparte los resultados para diagnóstico específico');
    
    console.log('\n💡 HIPÓTESIS MÁS PROBABLES:');
    console.log('• Versiones diferentes de n8n');
    console.log('• Una instancia no tiene ciertos nodos instalados');
    console.log('• Configuración de base de datos diferente');
    console.log('• Variables de entorno conflictivas');
    console.log('• Una instancia corriendo en modo desarrollo vs producción');
}

// Ejecutar diagnóstico
main();

/**
 * Script para probar la importación de workflows en n8n sistemáticamente
 * Usa la API REST de n8n para importar workflows y detectar errores
 */

const fs = require('fs');
const path = require('path');

const N8N_BASE_URL = 'http://localhost:5678';
const WORKFLOWS_DIR = './generated-workflows';

const testWorkflows = [
    'workflow-masivo-gemini-1757337804197-MINIMAL.json',
    'workflow-masivo-gemini-1757337804197-REDUCED.json', 
    'workflow-masivo-gemini-1757337804197-ULTRA-CLEAN.json',
    'workflow-masivo-gemini-1757337804197.json' // Original problemático
];

async function testWorkflowImport(filename) {
    const filePath = path.join(WORKFLOWS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Archivo no encontrado: ${filename}`);
        return false;
    }

    try {
        console.log(`\n🔄 Probando: ${filename}`);
        
        // Leer el archivo
        const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        console.log(`📊 Estadísticas:
        - Nodos: ${workflowData.nodes?.length || 0}
        - Conexiones: ${Object.keys(workflowData.connections || {}).length}
        - Tiene settings: ${!!workflowData.settings}`);

        // Preparar payload para n8n API
        const payload = {
            name: `Test ${Date.now()}`,
            ...workflowData
        };

        // Intentar importar via API de n8n
        const response = await fetch(`${N8N_BASE_URL}/rest/workflows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`✅ ÉXITO: Workflow importado con ID ${result.id}`);
            
            // Eliminar el workflow de prueba
            await fetch(`${N8N_BASE_URL}/rest/workflows/${result.id}`, {
                method: 'DELETE'
            });
            console.log(`🗑️ Workflow de prueba eliminado`);
            
            return true;
        } else {
            const error = await response.text();
            console.log(`❌ ERROR HTTP ${response.status}: ${error}`);
            return false;
        }

    } catch (error) {
        console.log(`💥 ERROR: ${error.message}`);
        
        // Analizar errores específicos
        if (error.message.includes('toLowerCase')) {
            console.log(`🎯 ERROR DETECTADO: toLowerCase() - Problema de campos undefined`);
        }
        
        return false;
    }
}

async function runTests() {
    console.log(`🚀 Iniciando pruebas de importación de workflows`);
    console.log(`📍 n8n Server: ${N8N_BASE_URL}`);
    console.log(`📁 Directorio: ${WORKFLOWS_DIR}`);
    
    const results = {};
    
    for (const filename of testWorkflows) {
        const success = await testWorkflowImport(filename);
        results[filename] = success;
        
        // Pausa entre pruebas
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📋 RESUMEN DE RESULTADOS:`);
    console.log(`==========================================`);
    
    for (const [filename, success] of Object.entries(results)) {
        const status = success ? '✅ ÉXITO' : '❌ FALLO';
        console.log(`${status} - ${filename}`);
    }
    
    const successful = Object.values(results).filter(Boolean).length;
    const total = Object.values(results).length;
    
    console.log(`\n🎯 CONCLUSIÓN: ${successful}/${total} workflows importados exitosamente`);
    
    if (successful < total) {
        console.log(`\n🔧 RECOMENDACIONES:`);
        console.log(`- Usar la versión MINIMAL o ULTRA-CLEAN que funcionó`);
        console.log(`- Evitar campos problemáticos como 'originalId'`);
        console.log(`- Verificar estructura JSON antes de importar`);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testWorkflowImport, runTests };
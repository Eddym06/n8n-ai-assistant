/**
 * 🧪 VALIDADOR FINAL DE WORKFLOWS
 * ===============================
 * Script final para validar workflows antes de importar en n8n
 */

const fs = require('fs');

function finalValidation(filePath) {
    console.log('🧪 VALIDACIÓN FINAL DE WORKFLOW');
    console.log('===============================');
    console.log(`📁 Archivo: ${filePath}`);
    console.log('');

    try {
        const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Obtener nombres de nodos
        const nodeNames = new Set(workflow.nodes.map(n => n.name));
        console.log(`📊 Nodos en el workflow: ${nodeNames.size}`);
        nodeNames.forEach(name => console.log(`  - ${name}`));
        
        console.log('\n🔗 Verificando conexiones:');
        let connectionsValid = true;
        let totalConnections = 0;
        
        Object.entries(workflow.connections).forEach(([fromNode, outputs]) => {
            console.log(`\n  Desde: ${fromNode}`);
            
            // Verificar que el nodo origen existe
            if (!nodeNames.has(fromNode)) {
                console.log(`    ❌ ERROR: Nodo origen "${fromNode}" no existe`);
                connectionsValid = false;
                return;
            }
            
            Object.entries(outputs).forEach(([outputType, targets]) => {
                console.log(`    📤 Salida ${outputType}: ${targets.length} conexiones`);
                
                targets.forEach((target, index) => {
                    totalConnections++;
                    if (!target.node || !nodeNames.has(target.node)) {
                        console.log(`      ❌ ${index + 1}. → "${target.node}" (NODO NO EXISTE)`);
                        connectionsValid = false;
                    } else {
                        console.log(`      ✅ ${index + 1}. → "${target.node}"`);
                    }
                });
            });
        });
        
        console.log(`\n📊 RESUMEN DE VALIDACIÓN:`);
        console.log(`  - Total conexiones: ${totalConnections}`);
        console.log(`  - Conexiones válidas: ${connectionsValid ? 'SÍ' : 'NO'}`);
        console.log(`  - Campo meta: ${workflow.meta ? 'SÍ' : 'NO'}`);
        console.log(`  - Estructura JSON: VÁLIDA`);
        
        if (connectionsValid && workflow.meta) {
            console.log(`\n✅ WORKFLOW VÁLIDO PARA IMPORTAR EN N8N`);
            return true;
        } else {
            console.log(`\n❌ WORKFLOW REQUIERE CORRECCIÓN`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        return false;
    }
}

// Probar ambos workflows
console.log('🎯 VALIDACIÓN FINAL DE TODOS LOS WORKFLOWS');
console.log('==========================================\n');

const workflows = [
    './generated-workflows/workflow-TEST-MINIMAL-FINAL.json',
    './generated-workflows/workflow-empresarial-FUNCIONAL-FINAL.json'
];

workflows.forEach(workflow => {
    if (fs.existsSync(workflow)) {
        const isValid = finalValidation(workflow);
        console.log(`${'='.repeat(60)}\n`);
    } else {
        console.log(`❌ Archivo no encontrado: ${workflow}\n`);
    }
});

console.log('🚀 INSTRUCCIONES PARA PROBAR EN N8N:');
console.log('====================================');
console.log('1. Inicia n8n: npx n8n start');
console.log('2. Abre http://localhost:5678');
console.log('3. Clic en "+" para nuevo workflow');
console.log('4. Clic en "..." → "Import"');
console.log('5. Pega el contenido del JSON');
console.log('6. Si da error toLowerCase(), el problema está en n8n mismo');
console.log('');
console.log('💡 ARCHIVOS A PROBAR (en orden):');
console.log('  1. workflow-TEST-MINIMAL-FINAL.json (más simple)');
console.log('  2. workflow-empresarial-FUNCIONAL-FINAL.json (más completo)');
console.log('  3. workflow-masivo-gemini-1757337804197-FIXED-V2.json (original funcional)');
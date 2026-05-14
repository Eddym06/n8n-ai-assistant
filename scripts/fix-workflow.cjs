const fs = require('fs');
const path = require('path');

// Leer el flujo problemático
const problematicFile = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757337804197.json';
const workingFile = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757129829740.json';

console.log('🔧 Analizando diferencias entre flujos...');

// Leer ambos archivos
const problematicWorkflow = JSON.parse(fs.readFileSync(problematicFile, 'utf8'));
const workingWorkflow = JSON.parse(fs.readFileSync(workingFile, 'utf8'));

console.log('📊 Estadísticas:');
console.log(`Flujo problemático: ${problematicWorkflow.nodes.length} nodos`);
console.log(`Flujo funcional: ${workingWorkflow.nodes.length} nodos`);

// Identificar problemas
const issues = [];

// 1. Verificar campo originalId
const hasOriginalId = problematicWorkflow.nodes.some(node => node.hasOwnProperty('originalId'));
if (hasOriginalId) {
    issues.push('❌ Campo "originalId" presente (no estándar de n8n)');
}

// 2. Verificar estructura de nodos
const invalidNodes = problematicWorkflow.nodes.filter(node => {
    return !node.id || !node.name || !node.type || !node.position;
});

if (invalidNodes.length > 0) {
    issues.push(`❌ ${invalidNodes.length} nodos con estructura inválida`);
}

// 3. Verificar tipos de nodos
const nodeTypes = [...new Set(problematicWorkflow.nodes.map(n => n.type))];
console.log('\n🔍 Tipos de nodos encontrados:', nodeTypes);

// 4. Verificar conexiones
const connectionIssues = [];
for (const [sourceNode, connections] of Object.entries(problematicWorkflow.connections || {})) {
    const sourceExists = problematicWorkflow.nodes.find(n => n.name === sourceNode);
    if (!sourceExists) {
        connectionIssues.push(`Conexión de nodo inexistente: ${sourceNode}`);
    }
    
    if (connections.main) {
        connections.main.flat().forEach(conn => {
            const targetExists = problematicWorkflow.nodes.find(n => n.name === conn.node);
            if (!targetExists) {
                connectionIssues.push(`Conexión a nodo inexistente: ${conn.node}`);
            }
        });
    }
}

if (connectionIssues.length > 0) {
    issues.push(`❌ ${connectionIssues.length} conexiones inválidas`);
}

console.log('\n🚨 Problemas identificados:');
issues.forEach(issue => console.log(`  ${issue}`));

console.log('\n💡 Diferencias clave:');
console.log(`  • Flujo problemático tiene campo "originalId"`);
console.log(`  • Flujo problemático es ${Math.round(problematicWorkflow.nodes.length / workingWorkflow.nodes.length * 100)}% más grande`);

// Crear versión limpia
console.log('\n🛠️ Creando versión limpia...');

const cleanWorkflow = {
    nodes: problematicWorkflow.nodes.map(node => {
        const cleanNode = { ...node };
        // Remover campos problemáticos
        delete cleanNode.originalId;
        return cleanNode;
    }),
    connections: problematicWorkflow.connections || {},
    settings: problematicWorkflow.settings || {}
};

// Guardar versión limpia
const cleanFile = problematicFile.replace('.json', '-CLEAN.json');
fs.writeFileSync(cleanFile, JSON.stringify(cleanWorkflow, null, 2));

console.log(`✅ Flujo limpio guardado como: ${path.basename(cleanFile)}`);
console.log('\n📋 Resumen de correcciones:');
console.log('  • Removidos campos "originalId"');
console.log('  • Estructura normalizada');
console.log('\n🎯 Prueba importar el archivo -CLEAN.json en n8n');
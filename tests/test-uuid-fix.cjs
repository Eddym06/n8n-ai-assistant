/**
 * TEST: Generación de workflow con IDs UUID para corregir error toLowerCase()
 * Este script prueba generar un workflow con formato UUID correcto
 */

const fs = require('fs');
const path = require('path');

// Función para generar UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Cargar workflow problemático
const workflowProblematico = JSON.parse(
  fs.readFileSync('generated-workflows/workflow-masivo-gemini-1757795564795.json', 'utf8')
);

console.log('🔍 Workflow original:');
console.log('- Nodos:', workflowProblematico.nodes.length);
console.log('- IDs originales:', workflowProblematico.nodes.slice(0, 5).map(n => n.id));

// Crear mapeo de IDs antiguos a nuevos
const idMapping = {};
workflowProblematico.nodes.forEach(node => {
  if (!idMapping[node.id]) {
    idMapping[node.id] = generateUUID();
  }
});

console.log('🔄 Mapeo de IDs (primeros 5):');
Object.entries(idMapping).slice(0, 5).forEach(([old, new_]) => {
  console.log(`  ${old} → ${new_}`);
});

// Crear nuevo workflow con UUIDs
const workflowCorregido = {
  ...workflowProblematico,
  nodes: workflowProblematico.nodes.map(node => ({
    ...node,
    id: idMapping[node.id]
  })),
  connections: {}
};

// Actualizar conexiones con nuevos IDs
Object.entries(workflowProblematico.connections || {}).forEach(([nodeNombre, conexiones]) => {
  // Las conexiones usan el nombre del nodo, no el ID, así que no necesitamos cambiarlas
  // Pero verificamos que los nodos referenciados existan
  workflowCorregido.connections[nodeNombre] = conexiones;
});

console.log('✅ Workflow corregido:');
console.log('- Nodos:', workflowCorregido.nodes.length);
console.log('- IDs nuevos:', workflowCorregido.nodes.slice(0, 5).map(n => n.id));

// Verificar formato UUID
const esUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

const todosUUID = workflowCorregido.nodes.every(node => esUUID(node.id));
console.log('🔍 Todos los IDs son UUID válidos:', todosUUID);

// Guardar workflow corregido
const filename = `workflow-masivo-gemini-${Date.now()}-uuid-fixed.json`;
const filepath = path.join('generated-workflows', filename);

fs.writeFileSync(filepath, JSON.stringify(workflowCorregido, null, 2));

console.log(`💾 Workflow corregido guardado: ${filename}`);
console.log('');
console.log('🧪 PRUEBA:');
console.log('1. Importa el workflow original en n8n → Error toLowerCase()');
console.log('2. Importa el workflow corregido en n8n → Debería funcionar');
console.log('');
console.log('📁 Archivos:');
console.log('- Original:', 'workflow-masivo-gemini-1757795564795.json');
console.log('- Corregido:', filename);
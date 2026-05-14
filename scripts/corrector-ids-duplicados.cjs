/**
 * CORRECTOR INMEDIATO: Arregla IDs duplicados en workflows
 */

const fs = require('fs');
const path = require('path');

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// Buscar el workflow más reciente con problemas
const workflowDir = path.join(process.cwd(), 'generated-workflows');
const files = fs.readdirSync(workflowDir)
  .filter(f => f.startsWith('workflow-masivo-gemini-') && f.endsWith('.json'))
  .map(f => ({
    name: f,
    time: fs.statSync(path.join(workflowDir, f)).mtime
  }))
  .sort((a, b) => b.time - a.time);

if (files.length === 0) {
  console.log('❌ No se encontraron workflows para corregir');
  process.exit(1);
}

const latestFile = files[0].name;
console.log(`🔍 Corrigiendo archivo: ${latestFile}`);

try {
  const workflow = JSON.parse(fs.readFileSync(path.join(workflowDir, latestFile), 'utf8'));
  
  console.log(`📊 Workflow original: ${workflow.nodes?.length || 0} nodos`);
  
  if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
    throw new Error('Workflow no válido - no tiene nodos');
  }
  
  // Detectar y corregir IDs duplicados
  const usedIds = new Set();
  const duplicateIds = new Set();
  let correcciones = 0;
  
  // Primera pasada: detectar duplicados
  workflow.nodes.forEach(node => {
    if (usedIds.has(node.id)) {
      duplicateIds.add(node.id);
    } else {
      usedIds.add(node.id);
    }
  });
  
  console.log(`🚨 IDs duplicados encontrados: ${duplicateIds.size}`);
  duplicateIds.forEach(id => console.log(`   - ${id}`));
  
  // Segunda pasada: corregir duplicados
  usedIds.clear();
  workflow.nodes.forEach((node, index) => {
    if (!node.id || !isValidUUID(node.id) || usedIds.has(node.id)) {
      let newId;
      do {
        newId = generateUUID();
      } while (usedIds.has(newId));
      
      const oldId = node.id;
      node.id = newId;
      usedIds.add(newId);
      correcciones++;
      console.log(`   ✅ Nodo ${index + 1}: ${oldId} → ${newId}`);
    } else {
      usedIds.add(node.id);
    }
  });
  
  // Guardar workflow corregido
  const timestamp = Date.now();
  const newFilename = `workflow-masivo-gemini-${timestamp}-DUPLICADOS-FIXED.json`;
  const newPath = path.join(workflowDir, newFilename);
  
  fs.writeFileSync(newPath, JSON.stringify(workflow, null, 2));
  
  console.log(`\n✅ CORRECCIÓN COMPLETADA:`);
  console.log(`   📁 Archivo original: ${latestFile}`);
  console.log(`   📁 Archivo corregido: ${newFilename}`);
  console.log(`   🔧 Correcciones aplicadas: ${correcciones}`);
  console.log(`   📊 Total nodos: ${workflow.nodes.length}`);
  console.log(`   ✅ IDs únicos: ${usedIds.size}`);
  
  console.log(`\n🚀 SIGUIENTE PASO:`);
  console.log(`   Importa este archivo en n8n: ${newFilename}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
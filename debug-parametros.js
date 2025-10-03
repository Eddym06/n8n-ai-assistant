/**
 * 🔍 DIAGNÓSTICO PROFUNDO DE PARÁMETROS
 * ===================================
 * 
 * Busca específicamente parámetros null/undefined que pueden causar toLowerCase()
 */

import fs from 'fs';

const workflowPath = './generated-workflows/workflow-masivo-gemini-1757795564795.json';

console.log('🔍 DIAGNÓSTICO PROFUNDO DE PARÁMETROS');
console.log('====================================');

try {
  const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  
  console.log('🔍 REVISANDO PARÁMETROS DE CADA NODO...\n');
  
  let problemsFound = 0;
  
  workflowData.nodes.forEach((node, index) => {
    console.log(`📋 Nodo ${index + 1}: ${node.name} (${node.type})`);
    
    if (!node.parameters) {
      console.log('   ⚠️ Sin parámetros');
      return;
    }
    
    // Revisar cada parámetro
    for (const [key, value] of Object.entries(node.parameters)) {
      if (value === null) {
        console.log(`   🚨 PARÁMETRO NULL: ${key} = null`);
        problemsFound++;
      } else if (value === undefined) {
        console.log(`   🚨 PARÁMETRO UNDEFINED: ${key} = undefined`);
        problemsFound++;
      } else if (typeof value === 'string' && value.trim() === '') {
        console.log(`   ⚠️ PARÁMETRO VACÍO: ${key} = ""`);
      } else {
        console.log(`   ✅ ${key}: ${typeof value} = ${JSON.stringify(value)}`);
      }
    }
    
    console.log('');
  });
  
  console.log(`\n📊 RESUMEN: ${problemsFound} problemas críticos encontrados`);
  
  if (problemsFound === 0) {
    console.log('\n🤔 El JSON parece correcto. El error puede ser:');
    console.log('1. En el proceso de importación de n8n');
    console.log('2. En alguna validación específica de n8n');
    console.log('3. En la estructura de las conexiones');
    console.log('\n🔍 Verificando conexiones...');
    
    // Verificar conexiones más profundamente
    for (const [sourceNode, connections] of Object.entries(workflowData.connections || {})) {
      console.log(`\n🔗 Conexiones de "${sourceNode}":`);
      
      if (connections.main) {
        connections.main.forEach((outputArray, outputIndex) => {
          if (Array.isArray(outputArray)) {
            outputArray.forEach((connection, connIndex) => {
              console.log(`   Salida ${outputIndex}[${connIndex}]: -> ${connection.node}`);
              
              if (!connection.node || typeof connection.node !== 'string') {
                console.log(`   🚨 CONEXIÓN PROBLEMÁTICA: node = ${connection.node}`);
                problemsFound++;
              }
              if (!connection.type || typeof connection.type !== 'string') {
                console.log(`   🚨 CONEXIÓN PROBLEMÁTICA: type = ${connection.type}`);
                problemsFound++;
              }
              if (connection.index === null || connection.index === undefined) {
                console.log(`   🚨 CONEXIÓN PROBLEMÁTICA: index = ${connection.index}`);
                problemsFound++;
              }
            });
          }
        });
      }
    }
  }
  
  console.log(`\n🎯 TOTAL DE PROBLEMAS ENCONTRADOS: ${problemsFound}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
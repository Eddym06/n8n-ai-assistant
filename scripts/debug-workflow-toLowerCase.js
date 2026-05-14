/**
 * 🔍 SCRIPT DE DIAGNÓSTICO DE ERROR toLowerCase()
 * ==============================================
 * 
 * Este script analiza el JSON del workflow problemático para encontrar
 * exactamente dónde y por qué ocurre el error de toLowerCase().
 */

import fs from 'fs';

// Cargar el workflow problemático
const workflowPath = './generated-workflows/workflow-masivo-gemini-1757795564795.json';

console.log('🔍 DIAGNÓSTICO DE ERROR toLowerCase()');
console.log('=====================================');

try {
  const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  
  console.log('✅ JSON válido - se puede parsear correctamente');
  console.log(`📊 Nodos: ${workflowData.nodes?.length || 'N/A'}`);
  console.log(`🔗 Conexiones: ${Object.keys(workflowData.connections || {}).length}`);
  
  // Buscar campos problemáticos específicos
  console.log('\n🔍 ANALIZANDO POSIBLES CAUSAS DEL ERROR toLowerCase()...\n');
  
  // 1. Verificar tipos de nodos
  console.log('1️⃣ VERIFICANDO TIPOS DE NODOS:');
  workflowData.nodes.forEach((node, index) => {
    if (!node.type || typeof node.type !== 'string') {
      console.log(`❌ Nodo ${index + 1} (${node.name}) tiene type inválido:`, node.type);
    } else {
      console.log(`✅ Nodo ${index + 1} (${node.name}): ${node.type}`);
    }
  });
  
  // 2. Verificar nombres de nodos
  console.log('\n2️⃣ VERIFICANDO NOMBRES DE NODOS:');
  workflowData.nodes.forEach((node, index) => {
    if (!node.name || typeof node.name !== 'string') {
      console.log(`❌ Nodo ${index + 1} tiene name inválido:`, node.name);
    } else {
      console.log(`✅ Nodo ${index + 1}: "${node.name}"`);
    }
  });
  
  // 3. Verificar IDs de nodos
  console.log('\n3️⃣ VERIFICANDO IDs DE NODOS:');
  workflowData.nodes.forEach((node, index) => {
    if (!node.id || (typeof node.id !== 'string' && typeof node.id !== 'number')) {
      console.log(`❌ Nodo ${index + 1} (${node.name}) tiene id inválido:`, node.id);
    } else {
      console.log(`✅ Nodo ${index + 1} (${node.name}): id = ${node.id}`);
    }
  });
  
  // 4. Verificar conexiones
  console.log('\n4️⃣ VERIFICANDO CONEXIONES:');
  for (const [sourceNode, connections] of Object.entries(workflowData.connections || {})) {
    if (typeof sourceNode !== 'string') {
      console.log(`❌ Nombre de nodo fuente inválido:`, sourceNode);
    }
    
    if (connections && connections.main) {
      connections.main.forEach((outputConnections, outputIndex) => {
        if (Array.isArray(outputConnections)) {
          outputConnections.forEach((connection, connIndex) => {
            if (!connection.node || typeof connection.node !== 'string') {
              console.log(`❌ Conexión inválida en ${sourceNode}[${outputIndex}][${connIndex}]:`, connection);
            }
          });
        }
      });
    }
  }
  
  // 5. Simular el proceso de n8n que puede causar toLowerCase()
  console.log('\n5️⃣ SIMULANDO PROCESO DE n8n:');
  
  // Buscar donde se podría llamar toLowerCase()
  const possibleProblems = [];
  
  workflowData.nodes.forEach((node, index) => {
    // Verificar parámetros que podrían causar toLowerCase()
    if (node.parameters) {
      for (const [key, value] of Object.entries(node.parameters)) {
        if (value === null || value === undefined) {
          possibleProblems.push(`Nodo ${node.name}: parámetro "${key}" es ${value}`);
        }
        
        // Verificar operaciones específicas
        if (key === 'operation' && (value === null || value === undefined)) {
          possibleProblems.push(`Nodo ${node.name}: operación es ${value} - CAUSA PROBABLE`);
        }
        
        // Verificar resource
        if (key === 'resource' && (value === null || value === undefined)) {
          possibleProblems.push(`Nodo ${node.name}: resource es ${value} - CAUSA PROBABLE`);
        }
      }
    }
    
    // Verificar propiedades críticas del nodo
    if (!node.typeVersion) {
      possibleProblems.push(`Nodo ${node.name}: falta typeVersion`);
    }
  });
  
  if (possibleProblems.length > 0) {
    console.log('\n🚨 PROBLEMAS POTENCIALES ENCONTRADOS:');
    possibleProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem}`);
    });
  } else {
    console.log('✅ No se encontraron problemas evidentes');
  }
  
  // 6. Verificar estructura específica que n8n espera
  console.log('\n6️⃣ VERIFICANDO ESTRUCTURA ESPECÍFICA DE n8n:');
  
  // Verificar que todos los nodos tengan las propiedades mínimas
  const requiredProps = ['id', 'name', 'type', 'position'];
  workflowData.nodes.forEach((node, index) => {
    const missing = requiredProps.filter(prop => !(prop in node));
    if (missing.length > 0) {
      console.log(`❌ Nodo ${index + 1} (${node.name}) faltan propiedades: ${missing.join(', ')}`);
    }
  });
  
  console.log('\n🎯 DIAGNÓSTICO COMPLETADO');
  
} catch (error) {
  console.error('❌ Error al cargar o analizar el workflow:', error.message);
  console.error('Stack:', error.stack);
}
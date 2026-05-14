/**
 * 🔍 DETECTOR ESPECÍFICO DEL ERROR "propertyValues[itemName] no es iterable"
 */

import fs from 'fs';

function detectIterableError(workflowPath) {
  console.log(`🔍 Analizando: ${workflowPath}`);
  
  try {
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    
    console.log(`📊 Workflow: ${workflow.nodes.length} nodos, ${Object.keys(workflow.connections).length} conexiones`);
    
    // Buscar patrones problemáticos
    let issues = [];
    
    workflow.nodes.forEach((node, index) => {
      console.log(`\n🔍 Nodo ${index + 1}: ${node.name} (${node.type})`);
      
      // Verificar parámetros
      if (node.parameters) {
        for (const [key, value] of Object.entries(node.parameters)) {
          // Buscar objetos que podrían estar mal formados
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            console.log(`   📝 Parámetro '${key}':`, typeof value, JSON.stringify(value).substring(0, 100) + '...');
            
            // Verificar si tiene propiedades que parecen arrays pero no son
            if (value.hasOwnProperty('length') && typeof value.length === 'number' && !Array.isArray(value)) {
              issues.push(`❌ POSIBLE PROBLEMA: Nodo '${node.name}' parámetro '${key}' parece array pero no es iterable`);
            }
            
            // Verificar propiedades undefined o null
            for (const [subKey, subValue] of Object.entries(value)) {
              if (subValue === undefined) {
                issues.push(`⚠️ Nodo '${node.name}' parámetro '${key}.${subKey}' es undefined`);
              }
              if (subValue === null) {
                issues.push(`⚠️ Nodo '${node.name}' parámetro '${key}.${subKey}' es null`);
              }
            }
          }
          
          // Verificar arrays mal formados
          if (Array.isArray(value)) {
            console.log(`   📝 Array '${key}': ${value.length} elementos`);
            
            value.forEach((item, idx) => {
              if (item === undefined || item === null) {
                issues.push(`⚠️ Nodo '${node.name}' array '${key}[${idx}]' es ${item}`);
              }
            });
          }
          
          // Verificar strings problemáticos
          if (typeof value === 'string' && value.includes('propertyValues')) {
            issues.push(`❌ POSIBLE PROBLEMA: Nodo '${node.name}' contiene referencia a 'propertyValues' en parámetro '${key}'`);
          }
        }
      }
      
      // Verificar tipos específicos problemáticos
      if (node.type === 'n8n-nodes-base.function') {
        checkFunctionNode(node, issues);
      }
      
      if (node.type === 'n8n-nodes-base.if') {
        checkIfNode(node, issues);
      }
      
      if (node.type === 'n8n-nodes-base.emailSend') {
        checkEmailNode(node, issues);
      }
    });
    
    // Reporte final
    console.log(`\n📊 ANÁLISIS COMPLETADO:`);
    console.log(`✅ Nodos analizados: ${workflow.nodes.length}`);
    console.log(`❌ Problemas detectados: ${issues.length}`);
    
    if (issues.length > 0) {
      console.log(`\n❌ PROBLEMAS DETECTADOS:`);
      issues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log(`\n✅ No se detectaron problemas relacionados con 'propertyValues[itemName] no es iterable'`);
    }
    
  } catch (error) {
    console.error(`❌ Error al analizar: ${error.message}`);
  }
}

function checkFunctionNode(node, issues) {
  const params = node.parameters || {};
  
  // Verificar código JavaScript duplicado o mal formado
  if (params.functionCode && params.jsCode) {
    if (params.functionCode === params.jsCode) {
      issues.push(`⚠️ Function node '${node.name}': Código duplicado en functionCode y jsCode`);
    }
  }
  
  // Verificar parámetros específicos de Function nodes
  if (params.mode && typeof params.mode !== 'string') {
    issues.push(`❌ Function node '${node.name}': 'mode' debe ser string`);
  }
}

function checkIfNode(node, issues) {
  const params = node.parameters || {};
  
  // Verificar estructura de conditions
  if (params.conditions) {
    if (!params.conditions.conditions || !Array.isArray(params.conditions.conditions)) {
      issues.push(`❌ IF node '${node.name}': 'conditions.conditions' debe ser array`);
    }
    
    if (params.conditions.options && typeof params.conditions.options !== 'object') {
      issues.push(`❌ IF node '${node.name}': 'conditions.options' debe ser objeto`);
    }
  }
}

function checkEmailNode(node, issues) {
  const params = node.parameters || {};
  
  // Verificar estructura de recipients
  if (params.recipients) {
    if (typeof params.recipients !== 'object') {
      issues.push(`❌ Email node '${node.name}': 'recipients' debe ser objeto`);
    } else {
      if (params.recipients.to && !Array.isArray(params.recipients.to)) {
        issues.push(`❌ Email node '${node.name}': 'recipients.to' debe ser array`);
      }
    }
  }
  
  // Verificar options
  if (params.options && typeof params.options !== 'object') {
    issues.push(`❌ Email node '${node.name}': 'options' debe ser objeto`);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log('Uso: node detect-iterable-error.js <workflow.json>');
    process.exit(1);
  }
  
  detectIterableError(filePath);
}

export { detectIterableError };
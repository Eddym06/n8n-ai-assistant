// ===================================================================
// 🧪 PRUEBA DEL AGENTE DE COHERENCIA DE FLUJO (ACF) - FASE 1
// ===================================================================

import N8nAIAssistant from './extension server fixed.js';

async function testACFDetection() {
  console.log("🚀 INICIANDO PRUEBA DEL ACF - FASE 1");
  console.log("=======================================");

  // Crear una instancia del asistente (sin API key para esta prueba)
  const assistant = new N8nAIAssistant("fake-api-key");

  // Workflow de prueba con nodos huérfanos
  const brokenWorkflow = {
    "nodes": [
      {
        "name": "Webhook Trigger",
        "type": "n8n-nodes-base.webhook",
        "position": [100, 200]
      },
      {
        "name": "Validate Data IF",  // NODO HUÉRFANO - Sin entrada
        "type": "n8n-nodes-base.if", 
        "position": [300, 200]
      },
      {
        "name": "Send Email",  // NODO HUÉRFANO - Sin entrada
        "type": "n8n-nodes-base.email",
        "position": [500, 200]
      },
      {
        "name": "Merge Results",  // NODO HUÉRFANO - Sin salida
        "type": "n8n-nodes-base.merge",
        "position": [700, 200]
      },
      {
        "name": "Process Data",
        "type": "n8n-nodes-base.function",
        "position": [300, 400]
      }
    ],
    "connections": {
      "Webhook Trigger": {
        "main": [[
          {
            "node": "Process Data",
            "type": "main",
            "index": 0
          }
        ]]
      }
    }
  };

  console.log("📋 Workflow de prueba creado:");
  console.log(`   • ${brokenWorkflow.nodes.length} nodos`);
  console.log(`   • ${Object.keys(brokenWorkflow.connections).length} nodos con conexiones`);
  console.log("");

  // PASO 1: Detectar nodos huérfanos
  console.log("🔍 PASO 1: Detectando nodos huérfanos...");
  const orphanNodes = assistant.detectOrphanNodes(brokenWorkflow);
  
  console.log(`   ✅ Detectados ${orphanNodes.length} nodos huérfanos:`);
  orphanNodes.forEach(nodeName => {
    console.log(`      • ${nodeName}`);
  });
  console.log("");

  // PASO 2: Verificar que la detección sea correcta
  console.log("✅ PASO 2: Verificando resultados...");
  const expectedOrphans = ["Validate Data IF", "Send Email", "Merge Results"];
  const allDetected = expectedOrphans.every(node => orphanNodes.includes(node));
  
  if (allDetected && orphanNodes.length === expectedOrphans.length) {
    console.log("   🎉 ¡ÉXITO! El detector ACF funciona correctamente");
    console.log("   ✅ Todos los nodos huérfanos fueron detectados");
  } else {
    console.log("   ❌ FALLO: La detección no es correcta");
    console.log(`   Expected: ${expectedOrphans.join(', ')}`);
    console.log(`   Detected: ${orphanNodes.join(', ')}`);
  }
  console.log("");

  // PASO 3: Mostrar análisis detallado
  console.log("📊 PASO 3: Análisis detallado del workflow...");
  
  // Crear mapas para análisis
  const nodeNames = new Set(brokenWorkflow.nodes.map(n => n.name));
  const nodesWithInput = new Set();
  const nodesWithOutput = new Set(Object.keys(brokenWorkflow.connections));

  // Analizar conexiones
  Object.values(brokenWorkflow.connections).forEach(source => {
    if (source.main) {
      source.main.forEach(group => {
        if (Array.isArray(group)) {
          group.forEach(connection => {
            if (connection && connection.node) {
              nodesWithInput.add(connection.node);
            }
          });
        }
      });
    }
  });

  console.log("   🔗 Nodos con entrada:", Array.from(nodesWithInput).join(', ') || 'Ninguno');
  console.log("   🔗 Nodos con salida:", Array.from(nodesWithOutput).join(', ') || 'Ninguno');
  
  brokenWorkflow.nodes.forEach(node => {
    const nodeType = (node.type || '').toLowerCase();
    const isTrigger = nodeType.includes('trigger') || 
                     nodeType.includes('webhook') || 
                     nodeType.includes('cron') ||
                     nodeType.includes('manual');
    const hasInput = nodesWithInput.has(node.name);
    const hasOutput = nodesWithOutput.has(node.name);
    const isOrphan = orphanNodes.includes(node.name);
    
    console.log(`   📦 ${node.name}:`);
    console.log(`      • Tipo: ${node.type}`);
    console.log(`      • Es trigger: ${isTrigger ? '✅' : '❌'}`);
    console.log(`      • Tiene entrada: ${hasInput ? '✅' : '❌'}`);
    console.log(`      • Tiene salida: ${hasOutput ? '✅' : '❌'}`);
    console.log(`      • Es huérfano: ${isOrphan ? '🔴 SÍ' : '🟢 NO'}`);
    console.log("");
  });

  console.log("🎯 CONCLUSIÓN:");
  if (orphanNodes.length > 0) {
    console.log(`   ⚠️ El workflow tiene ${orphanNodes.length} problemas que requieren corrección`);
    console.log("   🔧 Los nodos huérfanos necesitan ser conectados o eliminados");
  } else {
    console.log("   ✅ El workflow está correctamente conectado");
  }
  
  console.log("");
  console.log("=======================================");
  console.log("🏁 PRUEBA DEL ACF COMPLETADA");
}

// Ejecutar la prueba
testACFDetection().catch(console.error);

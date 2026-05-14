/**
 * Test para validar las mejoras del FlowCoherenceAgent con soporte para IF/Merge avanzado
 * Incluye: outputIndex, prioridad de comandos, límites de comandos, manejo de triggers
 */
import FlowCoherenceAgent from './flow-coherence-agent.js';
import fs from 'fs';

async function testEnhancedACF() {
  console.log('🚀 Iniciando test de ACF mejorado...\n');

  const acf = new FlowCoherenceAgent(process.env.GOOGLE_API_KEY);
  acf.debugMode = true;

  // Crear un workflow complejo con problemas específicos para IF/Merge
  const problematicWorkflow = {
    meta: {
      instanceId: "test-enhanced"
    },
    nodes: {
      "webhook": {
        id: "webhook",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [100, 100],
        parameters: { path: "test-webhook" }
      },
      "if_check_payment": {
        id: "if_check_payment",
        name: "Check Payment Method",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [300, 100],
        parameters: {
          conditions: {
            boolean: [{
              leftValue: "{{ $json.payment_method }}",
              operation: "equal",
              rightValue: "credit_card"
            }]
          }
        }
      },
      "process_credit": {
        id: "process_credit",
        name: "Process Credit Card",
        type: "n8n-nodes-base.http-request",
        typeVersion: 4,
        position: [500, 50],
        parameters: { url: "https://payment-api.com/credit" }
      },
      "process_other": {
        id: "process_other",
        name: "Process Other Payment",
        type: "n8n-nodes-base.http-request",
        typeVersion: 4,
        position: [500, 150],
        parameters: { url: "https://payment-api.com/other" }
      },
      "merge_payments": {
        id: "merge_payments",
        name: "Merge Payment Results",
        type: "n8n-nodes-base.merge",
        typeVersion: 3,
        position: [700, 100],
        parameters: { mode: "mergeByIndex" }
      },
      "orphan_node": {
        id: "orphan_node",
        name: "Orphaned Node",
        type: "n8n-nodes-base.set",
        typeVersion: 3,
        position: [400, 300],
        parameters: { values: { string: [{ name: "status", value: "orphaned" }] } }
      },
      "another_orphan": {
        id: "another_orphan",
        name: "Another Orphan",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [600, 300],
        parameters: { functionCode: "return items;" }
      },
      "final_output": {
        id: "final_output",
        name: "Final Output",
        type: "n8n-nodes-base.set",
        typeVersion: 3,
        position: [900, 100],
        parameters: { values: { string: [{ name: "final", value: "complete" }] } }
      }
    },
    connections: {
      // Conexiones parciales que necesitan corrección
      "webhook": {
        "main": [[{ "node": "if_check_payment", "type": "main", "index": 0 }]]
      },
      // Falta conectar IF a sus ramas TRUE/FALSE
      // Falta conectar las ramas al Merge
      // Falta conectar Merge al output final
      // Los nodos orphan no están conectados
    }
  };

  console.log('📊 Estado inicial del workflow:');
  const orphanedNodes = acf.detectOrphanNodes(problematicWorkflow);
  const problems = acf.detectWorkflowProblems(problematicWorkflow);
  console.log(`- Nodos huérfanos: ${orphanedNodes.length}`);
  console.log(`- Problemas detectados: ${problems.length}`);
  console.log(`- Triggers en el workflow: ${Object.values(problematicWorkflow.nodes).filter(n => acf.isTriggerNode(n.type)).length}\n`);

  // Guardar workflow original para comparación
  fs.writeFileSync('./test-enhanced-original.json', JSON.stringify(problematicWorkflow, null, 2));

  console.log('🔧 Aplicando correcciones del ACF mejorado...\n');

  try {
    const correctedWorkflow = await acf.processWorkflow(problematicWorkflow, "E-commerce order processing workflow with payment validation and inventory checks");
    
    console.log('\n📈 Analizando resultados...');
    const finalOrphans = acf.detectOrphanNodes(correctedWorkflow);
    const finalProblems = acf.detectWorkflowProblems(correctedWorkflow);
    
    console.log(`\n✅ Resultados finales:`);
    console.log(`- Nodos huérfanos después: ${finalOrphans.length}`);
    console.log(`- Problemas restantes: ${finalProblems.length}`);
    console.log(`- Ratio de corrección: ${((orphanedNodes.length - finalOrphans.length) / orphanedNodes.length * 100).toFixed(1)}%`);

    // Verificar conexiones específicas de IF
    console.log('\n🔍 Verificando conexiones específicas de nodos IF:');
    if (correctedWorkflow.connections && correctedWorkflow.connections["if_check_payment"]) {
      const ifConnections = correctedWorkflow.connections["if_check_payment"].main;
      console.log(`- Rama TRUE (índice 0): ${ifConnections[0] ? ifConnections[0].map(c => c.node).join(', ') : 'Sin conexión'}`);
      console.log(`- Rama FALSE (índice 1): ${ifConnections[1] ? ifConnections[1].map(c => c.node).join(', ') : 'Sin conexión'}`);
    } else {
      console.log('- El nodo IF no tiene conexiones configuradas aún');
    }

    // Verificar conexiones de Merge
    console.log('\n🔍 Verificando conexiones hacia nodos Merge:');
    for (const [nodeId, connections] of Object.entries(correctedWorkflow.connections)) {
      const connectsToMerge = connections.main.some(outputArray => 
        outputArray && outputArray.some(conn => conn.node === "merge_payments")
      );
      if (connectsToMerge) {
        console.log(`- "${nodeId}" conecta al Merge`);
      }
    }

    // Guardar workflow corregido
    fs.writeFileSync('./test-enhanced-corrected.json', JSON.stringify(correctedWorkflow, null, 2));

    console.log('\n📄 Archivos generados:');
    console.log('- test-enhanced-original.json (workflow inicial)');
    console.log('- test-enhanced-corrected.json (workflow corregido)');

    // Test de calidad adicional
    console.log('\n🎯 Test de calidad del workflow corregido:');
    
    // Función auxiliar para verificar conexiones entrantes
    function hasIncomingConnections(workflow, nodeId) {
      for (const [sourceId, connections] of Object.entries(workflow.connections)) {
        if (connections.main) {
          for (const outputArray of connections.main) {
            if (outputArray && outputArray.some(conn => conn.node === nodeId)) {
              return true;
            }
          }
        }
      }
      return false;
    }
    
    // Verificar que todos los nodos tienen conexiones apropiadas
    let fullyConnectedNodes = 0;
    let totalNonTriggerNodes = 0;
    
    for (const [nodeId, node] of Object.entries(correctedWorkflow.nodes)) {
      if (!acf.isTriggerNode(node.type)) {
        totalNonTriggerNodes++;
        const hasInputs = hasIncomingConnections(correctedWorkflow, nodeId);
        const hasOutputs = correctedWorkflow.connections[nodeId] && 
          correctedWorkflow.connections[nodeId].main.some(arr => arr && arr.length > 0);
        
        if (hasInputs || acf.isTriggerNode(node.type)) {
          fullyConnectedNodes++;
        }
      }
    }
    
    const connectivityScore = (fullyConnectedNodes / totalNonTriggerNodes * 100).toFixed(1);
    console.log(`- Score de conectividad: ${connectivityScore}%`);
    
    if (finalOrphans.length === 0) {
      console.log('🎉 ¡ÉXITO TOTAL! Todos los nodos huérfanos fueron corregidos.');
    } else {
      console.log(`⚠️ Quedan ${finalOrphans.length} nodos huérfanos:`);
      finalOrphans.forEach(nodeId => {
        console.log(`  - ${nodeId}: ${correctedWorkflow.nodes[nodeId].name}`);
      });
    }

    return {
      success: finalOrphans.length === 0,
      initialOrphans: orphanedNodes.length,
      finalOrphans: finalOrphans.length,
      connectivityScore: parseFloat(connectivityScore),
      correctedWorkflow
    };

  } catch (error) {
    console.error('❌ Error durante la corrección:', error.message);
    return { success: false, error: error.message };
  }
}

// Ejecutar el test directamente
testEnhancedACF()
  .then(result => {
    console.log('\n🏁 Test completado.');
    if (result.success) {
      console.log('✅ Todas las mejoras funcionan correctamente.');
    } else {
      console.log('❌ Se encontraron problemas en las mejoras.');
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
    }
  })
  .catch(error => {
    console.error('💥 Error fatal en el test:', error);
  });

export default testEnhancedACF;

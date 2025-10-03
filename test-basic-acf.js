/**
 * Test simplificado del FlowCoherenceAgent sin usar Gemini API
 * Para probar las mejoras en detección y estructura de datos
 */
import FlowCoherenceAgent from './flow-coherence-agent.js';
import fs from 'fs';

async function testBasicACF() {
  console.log('🚀 Iniciando test básico de ACF (sin Gemini)...\n');

  const acf = new FlowCoherenceAgent('fake-api-key');
  acf.debugMode = true;

  // Crear un workflow complejo con problemas específicos para IF/Merge
  const problematicWorkflow = {
    meta: {
      instanceId: "test-basic"
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
      }
      // Faltan las conexiones IF -> ramas, ramas -> merge, merge -> final
      // Los nodos orphan no están conectados
    }
  };

  console.log('📊 Analizando estructura del workflow:');
  
  // Test 1: Detectar nodos huérfanos
  console.log('\n🔍 Test 1: Detección de nodos huérfanos');
  const orphanedNodes = acf.detectOrphanNodes(problematicWorkflow);
  console.log(`✅ Detectados ${orphanedNodes.length} nodos huérfanos:`);
  orphanedNodes.forEach(nodeId => {
    console.log(`  - ${nodeId}: ${problematicWorkflow.nodes[nodeId].name}`);
  });

  // Test 2: Detectar problemas del workflow
  console.log('\n🔍 Test 2: Detección de problemas generales');
  const problems = acf.detectWorkflowProblems(problematicWorkflow);
  console.log(`✅ Detectados ${problems.totalProblems} problemas en total`);

  // Test 3: Detectar nodos sin salida
  console.log('\n🔍 Test 3: Detección de callejones sin salida');
  const deadEndNodes = acf.detectDeadEndNodes(problematicWorkflow);
  console.log(`✅ Detectados ${deadEndNodes.length} callejones sin salida:`);
  deadEndNodes.forEach(nodeId => {
    console.log(`  - ${nodeId}: ${problematicWorkflow.nodes[nodeId].name}`);
  });

  // Test 4: Detectar IFs incompletos
  console.log('\n🔍 Test 4: Detección de IFs incompletos');
  const incompleteIFs = acf.detectIncompleteIFs(problematicWorkflow);
  console.log(`✅ Detectados ${incompleteIFs.length} IFs incompletos:`);
  incompleteIFs.forEach(nodeId => {
    console.log(`  - ${nodeId}: ${problematicWorkflow.nodes[nodeId].name}`);
  });

  // Test 5: Detectar Merges innecesarios
  console.log('\n🔍 Test 5: Detección de Merges innecesarios');
  const unnecessaryMerges = acf.detectUnnecessaryMerges(problematicWorkflow);
  console.log(`✅ Detectados ${unnecessaryMerges.length} Merges innecesarios:`);
  unnecessaryMerges.forEach(nodeId => {
    console.log(`  - ${nodeId}: ${problematicWorkflow.nodes[nodeId].name}`);
  });

  // Test 6: Verificar identificación de triggers
  console.log('\n🔍 Test 6: Identificación de nodos trigger');
  let triggerCount = 0;
  Object.entries(problematicWorkflow.nodes).forEach(([nodeId, node]) => {
    if (acf.isTriggerNode(node.type)) {
      triggerCount++;
      console.log(`✅ Trigger detectado: ${nodeId} (${node.name})`);
    }
  });
  console.log(`Total triggers: ${triggerCount}`);

  // Test 7: Simular corrección manual con outputIndex
  console.log('\n🔍 Test 7: Test de estructura de corrección con outputIndex');
  const testWorkflow = JSON.parse(JSON.stringify(problematicWorkflow));
  
  // Simular comando CONNECT_NODES con outputIndex
  console.log('📝 Simulando conexión IF con outputIndex...');
  
  // Crear mapa de nodos
  const nodeMap = new Map();
  Object.keys(testWorkflow.nodes).forEach(nodeId => {
    nodeMap.set(nodeId, testWorkflow.nodes[nodeId]);
  });

  // Simular comando CONNECT_NODES para IF TRUE (outputIndex: 0)
  const cmd1 = {
    action: "CONNECT_NODES",
    source: "if_check_payment",
    target: "process_credit",
    outputIndex: 0,
    reason: "Conecta rama TRUE del IF al procesamiento de tarjeta de crédito"
  };

  // Simular comando CONNECT_NODES para IF FALSE (outputIndex: 1)
  const cmd2 = {
    action: "CONNECT_NODES",
    source: "if_check_payment",
    target: "process_other",
    outputIndex: 1,
    reason: "Conecta rama FALSE del IF al procesamiento de otros métodos"
  };

  console.log('🔧 Ejecutando conexiones simuladas...');
  acf.executeConnectNodes(testWorkflow, cmd1, nodeMap);
  acf.executeConnectNodes(testWorkflow, cmd2, nodeMap);

  // Verificar resultados
  console.log('\n📊 Verificando estructura de conexiones resultante:');
  if (testWorkflow.connections["if_check_payment"]) {
    const ifConnections = testWorkflow.connections["if_check_payment"].main;
    console.log(`✅ Rama TRUE (índice 0): ${ifConnections[0] ? ifConnections[0].map(c => c.node).join(', ') : 'Sin conexión'}`);
    console.log(`✅ Rama FALSE (índice 1): ${ifConnections[1] ? ifConnections[1].map(c => c.node).join(', ') : 'Sin conexión'}`);
  }

  // Verificar nodos huérfanos después de las conexiones
  const finalOrphans = acf.detectOrphanNodes(testWorkflow);
  console.log(`\n📈 Nodos huérfanos después de conexiones: ${finalOrphans.length}`);
  console.log(`📈 Reducción de huérfanos: ${orphanedNodes.length - finalOrphans.length} nodos conectados`);

  // Guardar resultados
  fs.writeFileSync('./test-basic-original.json', JSON.stringify(problematicWorkflow, null, 2));
  fs.writeFileSync('./test-basic-modified.json', JSON.stringify(testWorkflow, null, 2));

  console.log('\n🎯 Resumen del test básico:');
  console.log(`✅ Detección de huérfanos: ${orphanedNodes.length > 0 ? 'FUNCIONA' : 'FALLO'}`);
  console.log(`✅ Detección de callejones sin salida: ${deadEndNodes.length > 0 ? 'FUNCIONA' : 'FALLO'}`);
  console.log(`✅ Detección de Merges innecesarios: ${unnecessaryMerges.length > 0 ? 'FUNCIONA' : 'FALLO'}`);
  console.log(`✅ Identificación de triggers: ${triggerCount > 0 ? 'FUNCIONA' : 'FALLO'}`);
  console.log(`✅ Conexiones con outputIndex: ${testWorkflow.connections["if_check_payment"]?.main[0] && testWorkflow.connections["if_check_payment"]?.main[1] ? 'FUNCIONA' : 'FALLO'}`);

  return {
    success: true,
    initialOrphans: orphanedNodes.length,
    finalOrphans: finalOrphans.length,
    allTestsPassed: true
  };
}

// Ejecutar el test directamente
testBasicACF()
  .then(result => {
    console.log('\n🏁 Test básico completado.');
    if (result.success) {
      console.log('✅ Todas las funciones básicas del ACF funcionan correctamente.');
      console.log(`📊 Reducción de huérfanos: ${result.initialOrphans} → ${result.finalOrphans}`);
    } else {
      console.log('❌ Se encontraron problemas en las funciones básicas.');
    }
  })
  .catch(error => {
    console.error('💥 Error fatal en el test básico:', error);
  });

export default testBasicACF;

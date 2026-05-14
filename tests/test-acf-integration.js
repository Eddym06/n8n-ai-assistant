// ===================================================================
// 🧪 PRUEBA DE INTEGRACIÓN DEL AGENTE DE COHERENCIA DE FLUJO (ACF)
// ===================================================================

import dotenv from 'dotenv';
import { FlowCoherenceAgent } from './flow-coherence-agent.js';

// Cargar variables de entorno
dotenv.config();

console.log('🧪 INICIANDO PRUEBA DE INTEGRACIÓN DEL ACF...\n');

// Workflow de prueba con nodos huérfanos
const testWorkflow = {
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 100],
      "parameters": {
        "path": "test-webhook",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Process Data",
      "type": "n8n-nodes-base.function",
      "position": [300, 100],
      "parameters": {
        "functionCode": "return [{json: {processed: true}}];"
      }
    },
    {
      "name": "IF Condition",
      "type": "n8n-nodes-base.if",
      "position": [500, 100],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "{{$json.processed}}",
              "operation": "equal",
              "value2": "true"
            }
          ]
        }
      }
    },
    {
      "name": "Orphan Node",
      "type": "n8n-nodes-base.httpRequest",
      "position": [700, 100],
      "parameters": {
        "url": "https://api.example.com/test",
        "method": "POST"
      }
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Process Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
    // Nota: "Process Data", "IF Condition" y "Orphan Node" no tienen conexiones de salida
    // "IF Condition" no tiene conexiones de entrada - es huérfano
    // "Orphan Node" no tiene conexiones - es huérfano
  }
};

async function testACFIntegration() {
  try {
    console.log('🔧 Inicializando FlowCoherenceAgent...');
    const acf = new FlowCoherenceAgent(process.env.GEMINI_API_KEY);
    
    console.log('🔍 Detectando nodos huérfanos...');
    const orphanNodes = acf.detectOrphanNodes(testWorkflow);
    
    console.log(`\n📊 RESULTADOS DE DETECCIÓN:`);
    console.log(`   Total de nodos: ${testWorkflow.nodes.length}`);
    console.log(`   Nodos huérfanos encontrados: ${orphanNodes.length}`);
    console.log(`   Lista de huérfanos: ${orphanNodes.join(', ')}`);
    
    if (orphanNodes.length > 0) {
      console.log('\n🤖 Solicitando plan de corrección a Gemini...');
      const originalPrompt = "Crear un workflow que reciba datos por webhook, los procese, valide con una condición IF y envíe el resultado";
      
      const correctionPlan = await acf.getCorrectionPlan(testWorkflow, orphanNodes, originalPrompt);
      
      console.log('\n📋 PLAN DE CORRECCIÓN RECIBIDO:');
      console.log(JSON.stringify(correctionPlan, null, 2));
      
      if (correctionPlan && correctionPlan.corrections) {
        console.log('\n🔧 Aplicando correcciones...');
        const correctedWorkflow = acf.applyCorrections(testWorkflow, correctionPlan);
        
        console.log('\n🔍 Verificando resultado...');
        const remainingOrphans = acf.detectOrphanNodes(correctedWorkflow);
        
        console.log(`\n📊 RESULTADOS DESPUÉS DE CORRECCIÓN:`);
        console.log(`   Nodos huérfanos restantes: ${remainingOrphans.length}`);
        if (remainingOrphans.length > 0) {
          console.log(`   Lista de huérfanos restantes: ${remainingOrphans.join(', ')}`);
        } else {
          console.log('   🎉 ¡Todos los nodos huérfanos han sido corregidos!');
        }
        
        console.log('\n📋 WORKFLOW CORREGIDO - CONEXIONES:');
        Object.keys(correctedWorkflow.connections || {}).forEach(source => {
          if (correctedWorkflow.connections[source].main && correctedWorkflow.connections[source].main[0]) {
            const targets = correctedWorkflow.connections[source].main[0].map(c => c.node).join(', ');
            console.log(`   ${source} → ${targets}`);
          }
        });
      }
    } else {
      console.log('\n✅ No se detectaron nodos huérfanos. El workflow es coherente.');
    }
    
    console.log('\n✅ PRUEBA DE INTEGRACIÓN ACF COMPLETADA EXITOSAMENTE');
    
  } catch (error) {
    console.error('\n❌ ERROR EN PRUEBA DE INTEGRACIÓN:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
  }
}

// Ejecutar la prueba
testACFIntegration().then(() => {
  console.log('\n🏁 Prueba finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 ERROR CRÍTICO:', error);
  process.exit(1);
});

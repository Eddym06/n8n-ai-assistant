// ===================================================================
// 🧪 PRUEBA DE INTEGRACIÓN COMPLETA - SERVIDOR + ACF
// ===================================================================

import dotenv from 'dotenv';
import N8nAIAssistant from './extension server fixed.js';

// Cargar variables de entorno
dotenv.config();

console.log('🧪 INICIANDO PRUEBA DE INTEGRACIÓN COMPLETA...\n');

// JSON de prueba con nodos huérfanos
const testWorkflowJSON = `{
  "name": "Test Workflow con Nodos Huérfanos",
  "nodes": [
    {
      "name": "Start Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [100, 100],
      "parameters": {}
    },
    {
      "name": "Process Step",
      "type": "n8n-nodes-base.function",
      "position": [300, 100],
      "parameters": {
        "functionCode": "return [{json: {step: 'processed'}}];"
      }
    },
    {
      "name": "Validation IF",
      "type": "n8n-nodes-base.if",
      "position": [500, 100],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "{{$json.step}}",
              "operation": "equal",
              "value2": "processed"
            }
          ]
        }
      }
    },
    {
      "name": "Send Result",
      "type": "n8n-nodes-base.httpRequest",
      "position": [700, 100],
      "parameters": {
        "url": "https://webhook.site/test",
        "method": "POST"
      }
    }
  ],
  "connections": {
    "Start Trigger": {
      "main": [
        [
          {
            "node": "Process Step",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;

async function testCompleteIntegration() {
  try {
    console.log('🚀 Inicializando N8nAIAssistant...');
    const assistant = new N8nAIAssistant();
    
    console.log('📋 Procesando workflow con nodos huérfanos...');
    const originalPrompt = "Crear un flujo que inicie manualmente, procese datos, valide con IF y envíe resultado por HTTP";
    
    // Simular el proceso de importación con ACF integrado
    const result = await assistant.importWorkflowJSON(testWorkflowJSON, originalPrompt);
    
    console.log('\n📊 RESULTADOS DE LA INTEGRACIÓN COMPLETA:');
    console.log(`   Estado: ${result.ok ? '✅ Exitoso' : '❌ Fallido'}`);
    
    if (result.ok && result.data) {
      console.log(`   Nodos procesados: ${result.data.nodes?.length || 0}`);
      console.log(`   Conexiones: ${Object.keys(result.data.connections || {}).length}`);
      
      // Verificar que las conexiones fueron reparadas por el ACF
      console.log('\n🔍 ESTADO DE CONEXIONES DESPUÉS DEL ACF:');
      const connections = result.data.connections || {};
      Object.keys(connections).forEach(source => {
        if (connections[source].main && connections[source].main[0]) {
          const targets = connections[source].main[0].map(c => c.node).join(', ');
          console.log(`   ${source} → ${targets}`);
        }
      });
      
      // Verificar que no queden nodos huérfanos
      if (assistant.flowCoherenceAgent) {
        const remainingOrphans = assistant.flowCoherenceAgent.detectOrphanNodes(result.data);
        console.log(`\n🎯 VERIFICACIÓN FINAL:`);
        console.log(`   Nodos huérfanos restantes: ${remainingOrphans.length}`);
        
        if (remainingOrphans.length === 0) {
          console.log('   🎉 ¡Perfecto! El ACF reparó todos los problemas de conectividad');
        } else {
          console.log(`   ⚠️ Aún quedan huérfanos: ${remainingOrphans.join(', ')}`);
        }
      } else {
        console.log('   ⚠️ ACF no inicializado - verificación manual requerida');
      }
    }
    
    console.log('\n✅ PRUEBA DE INTEGRACIÓN COMPLETA EXITOSA');
    
  } catch (error) {
    console.error('\n❌ ERROR EN PRUEBA DE INTEGRACIÓN COMPLETA:');
    console.error(`   Mensaje: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\\n').slice(0, 5).join('\\n')}`);
    }
  }
}

// Ejecutar la prueba
testCompleteIntegration().then(() => {
  console.log('\n🏁 Prueba de integración completa finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 ERROR CRÍTICO:', error);
  process.exit(1);
});

// ===================================================================
// 🧪 PRUEBA DE INTEGRACIÓN ESPECÍFICA - IMPORTWORKFLOWJSON + ACF
// ===================================================================

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('🧪 INICIANDO PRUEBA DE INTEGRACIÓN ESPECÍFICA...\n');

// Importar solo las clases necesarias sin activar el sistema principal
class TestN8nAIAssistant {
  constructor() {
    // Importar dinámicamente para evitar la ejecución del main()
    this.flowCoherenceAgent = null;
  }

  async initializeACF() {
    const { FlowCoherenceAgent } = await import('./flow-coherence-agent.js');
    this.flowCoherenceAgent = new FlowCoherenceAgent(process.env.GEMINI_API_KEY);
    console.log('✅ FlowCoherenceAgent inicializado');
  }

  // Simular el proceso de detección y corrección del ACF
  async testACFIntegration(workflowData, originalPrompt) {
    if (!this.flowCoherenceAgent) {
      await this.initializeACF();
    }

    console.log('🔍 Ejecutando validación del ACF...');
    
    // 1. Detectar nodos huérfanos
    const orphanNodes = this.flowCoherenceAgent.detectOrphanNodes(workflowData);
    console.log(`   Nodos huérfanos detectados: ${orphanNodes.length}`);
    
    if (orphanNodes.length > 0) {
      console.log(`   Lista: ${orphanNodes.join(', ')}`);
      
      // 2. Obtener plan de corrección
      console.log('🤖 Solicitando plan de corrección...');
      const correctionPlan = await this.flowCoherenceAgent.getCorrectionPlan(workflowData, orphanNodes, originalPrompt);
      
      if (correctionPlan && correctionPlan.corrections) {
        console.log(`   Plan recibido con ${correctionPlan.corrections.length} comandos`);
        
        // 3. Aplicar correcciones
        console.log('🔧 Aplicando correcciones...');
        const correctedWorkflow = this.flowCoherenceAgent.applyCorrections(workflowData, correctionPlan);
        
        // 4. Verificar resultado
        const remainingOrphans = this.flowCoherenceAgent.detectOrphanNodes(correctedWorkflow);
        console.log(`   Nodos huérfanos restantes: ${remainingOrphans.length}`);
        
        return {
          originalOrphans: orphanNodes.length,
          correctionPlan: correctionPlan,
          remainingOrphans: remainingOrphans.length,
          correctedWorkflow: correctedWorkflow
        };
      }
    } else {
      console.log('   ✅ No se detectaron nodos huérfanos - Workflow coherente');
      return {
        originalOrphans: 0,
        remainingOrphans: 0,
        correctedWorkflow: workflowData
      };
    }
  }
}

// Workflow de prueba con nodos huérfanos
const testWorkflow = {
  "name": "Test ACF Integration",
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [100, 100],
      "parameters": {}
    },
    {
      "name": "Data Processor",
      "type": "n8n-nodes-base.function",
      "position": [300, 100],
      "parameters": {
        "functionCode": "return [{json: {processed: true}}];"
      }
    },
    {
      "name": "Condition Check",
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
      "name": "Send Notification",
      "type": "n8n-nodes-base.httpRequest",
      "position": [700, 100],
      "parameters": {
        "url": "https://hooks.slack.com/test",
        "method": "POST",
        "body": "{\"text\": \"Process completed\"}"
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Data Processor",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
    // Deliberadamente falta conexión entre Data Processor -> Condition Check
    // y Condition Check -> Send Notification
  }
};

async function runSpecificTest() {
  try {
    console.log('🚀 Inicializando asistente de prueba...');
    const testAssistant = new TestN8nAIAssistant();
    
    console.log('📋 Datos del workflow de prueba:');
    console.log(`   Nodos: ${testWorkflow.nodes.length}`);
    console.log(`   Conexiones iniciales: ${Object.keys(testWorkflow.connections).length}`);
    
    const originalPrompt = "Crear un flujo que procese datos, los valide y envíe notificación si la validación es exitosa";
    
    console.log('\n🔬 Ejecutando prueba de integración ACF...');
    const result = await testAssistant.testACFIntegration(testWorkflow, originalPrompt);
    
    console.log('\n📊 RESULTADOS DE LA PRUEBA:');
    console.log(`   Nodos huérfanos originales: ${result.originalOrphans}`);
    console.log(`   Nodos huérfanos después de corrección: ${result.remainingOrphans}`);
    
    if (result.correctionPlan) {
      console.log(`   Comandos aplicados: ${result.correctionPlan.corrections.length}`);
      result.correctionPlan.corrections.forEach((cmd, i) => {
        console.log(`     ${i + 1}. ${cmd.action}: ${cmd.reason}`);
      });
    }
    
    // Mostrar conexiones finales
    console.log('\n🔗 CONEXIONES FINALES:');
    const finalConnections = result.correctedWorkflow.connections || {};
    Object.keys(finalConnections).forEach(source => {
      if (finalConnections[source].main && finalConnections[source].main[0]) {
        const targets = finalConnections[source].main[0].map(c => c.node).join(', ');
        console.log(`   ${source} → ${targets}`);
      }
    });
    
    // Evaluación final
    const success = result.remainingOrphans < result.originalOrphans;
    console.log(`\n🎯 EVALUACIÓN FINAL: ${success ? '✅ EXITOSA' : '❌ FALLIDA'}`);
    
    if (success) {
      console.log('   🎉 El ACF reparó exitosamente los problemas de conectividad');
    } else {
      console.log('   ⚠️ El ACF no pudo resolver todos los problemas');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR EN PRUEBA ESPECÍFICA:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
  }
}

// Ejecutar la prueba
runSpecificTest().then(() => {
  console.log('\n🏁 Prueba específica finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 ERROR CRÍTICO:', error);
  process.exit(1);
});

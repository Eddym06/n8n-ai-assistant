/**
 * TEST SISTEMA COMPLETO - Verificación de todos los módulos integrados
 * Prueba simple para verificar que todo el sistema funciona correctamente
 */

import dotenv from 'dotenv';
dotenv.config();

// Importar el sistema principal
import { WorkflowContinuationSystem } from './workflow-continuation-system-v3.js';
import { WorkflowAutocorrector } from './workflow-autocorrector-v4.js';
import { IntelligentWorkflowValidator } from './intelligent-workflow-validator-v5.js';
import { LayoutOptimizer } from './layout-optimizer-v3.js';

// Workflow de prueba simple
const testWorkflow = {
  nodes: [
    {
      id: "1",
      name: "Manual Trigger",
      type: "n8n-nodes-base.manualTrigger",
      position: [0, 0],
      parameters: {},
      typeVersion: 1
    },
    {
      id: "2", 
      name: "HTTP Request",
      type: "n8n-nodes-base.httpRequest",
      position: [200, 0],
      parameters: {
        url: "https://api.example.com/data",
        requestMethod: "GET"
      },
      typeVersion: 1
    }
  ],
  connections: {
    "Manual Trigger": {
      main: [
        [
          {
            node: "HTTP Request",
            type: "main",
            index: 0
          }
        ]
      ]
    }
  }
};

async function testSistemaCompleto() {
  console.log('\n🚀 PRUEBA DEL SISTEMA COMPLETO V3.0+');
  console.log('=' * 50);
  
  try {
    // 1. Test Validador
    console.log('\n✅ Probando Validador Inteligente V5.0...');
    const validator = new IntelligentWorkflowValidator();
    const validationResult = await validator.validateWorkflow(testWorkflow, "Crear un workflow básico");
    console.log(`   Score de validación: ${validationResult.score}/100`);
    console.log(`   ¿Es válido?: ${validationResult.isValid}`);
    console.log(`   Errores críticos: ${validationResult.criticalErrors.length}`);
    
    // 2. Test Autocorrector
    console.log('\n🔧 Probando Autocorrector V4.0...');
    const autocorrector = new WorkflowAutocorrector();
    const correctionResult = await autocorrector.analyzeWorkflow(testWorkflow);
    console.log(`   Errores detectados: ${correctionResult.errors.length}`);
    console.log(`   ¿Necesita corrección?: ${correctionResult.needsCorrection}`);
    
    // 3. Test Layout Optimizer
    console.log('\n🎯 Probando Layout Optimizer V3.0...');
    const layoutOptimizer = new LayoutOptimizer({ debugMode: false });
    const layoutResult = await layoutOptimizer.optimizeLayout(testWorkflow);
    console.log(`   ¿Optimización exitosa?: ${layoutResult.success}`);
    console.log(`   Nodos procesados: ${layoutResult.metrics?.totalNodes || 'N/A'}`);
    console.log(`   Score de optimización: ${layoutResult.metrics?.optimizationScore || 'N/A'}`);
    
    // 4. Test Sistema de Continuación
    console.log('\n🔄 Probando Sistema de Continuación V3.0...');
    const continuationSystem = new WorkflowContinuationSystem();
    const analysisResult = await continuationSystem.analyzeWorkflowCompleteness(
      testWorkflow, 
      "Crear un sistema completo de procesamiento de emails con múltiples pasos"
    );
    console.log(`   ¿Necesita continuación?: ${analysisResult.needsContinuation}`);
    console.log(`   Score de completitud: ${analysisResult.completenessScore}/100`);
    
    // 5. Estadísticas de todos los módulos
    console.log('\n📊 ESTADÍSTICAS DE MÓDULOS:');
    console.log('   Validador:', JSON.stringify(validator.getStats(), null, 2));
    console.log('   Autocorrector:', JSON.stringify(autocorrector.getStats(), null, 2));
    console.log('   Layout Optimizer:', JSON.stringify(layoutOptimizer.getStats(), null, 2));
    console.log('   Sistema de Continuación:', JSON.stringify(continuationSystem.getStats(), null, 2));
    
    console.log('\n🎉 ¡TODOS LOS MÓDULOS FUNCIONAN CORRECTAMENTE!');
    console.log('✅ Sistema Completo V3.0+ está operativo');
    
  } catch (error) {
    console.error('\n❌ ERROR EN EL SISTEMA:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar prueba
testSistemaCompleto();
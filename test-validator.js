// 🧪 Script de prueba para WorkflowValidator
// Versión: 1.0.0 - Pruebas de funcionalidad

import { WorkflowValidator } from './workflow-validator.js';

// Crear instancia del validador
const validator = new WorkflowValidator({
  detailedLogging: true,
  strictMode: false
});

// Workflow de ejemplo válido
const validWorkflow = {
  name: "Test Workflow",
  nodes: [
    {
      id: "1",
      name: "Webhook Trigger",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1,
      position: [100, 100],
      parameters: {
        httpMethod: "POST",
        path: "/webhook"
      }
    },
    {
      id: "2",
      name: "Set Data",
      type: "n8n-nodes-base.set",
      typeVersion: 1,
      position: [300, 100],
      parameters: {
        values: {
          string: [
            {
              name: "message",
              value: "Hello World"
            }
          ]
        }
      }
    }
  ],
  connections: {
    "1": {
      "main": [
        {
          node: "2",
          type: "main",
          index: 0
        }
      ]
    }
  }
};

// Workflow de ejemplo con errores
const invalidWorkflow = {
  name: "",
  nodes: [
    {
      id: "1",
      name: "",
      type: "invalid-type",
      position: [100, 100]
    }
  ],
  connections: {}
};

console.log('🚀 Iniciando pruebas del WorkflowValidator...\n');

// Prueba 1: Workflow válido
console.log('📋 Prueba 1: Workflow válido');
const validResult = validator.validate(validWorkflow);
console.log('Resultado:', validResult.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO');
console.log('Errores:', validResult.errors.length);
console.log('Advertencias:', validResult.warnings.length);
console.log('Resumen:', validResult.summary);
console.log();

// Prueba 2: Workflow inválido
console.log('📋 Prueba 2: Workflow inválido');
const invalidResult = validator.validate(invalidWorkflow);
console.log('Resultado:', invalidResult.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO');
console.log('Errores:', invalidResult.errors.length);
console.log('Errores encontrados:');
invalidResult.errors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error.message}`);
});
console.log();

// Prueba 3: Reporte detallado
console.log('📋 Prueba 3: Reporte detallado');
const detailedReport = validator.getDetailedValidationReport(validWorkflow);
console.log('Timestamp:', detailedReport.timestamp);
console.log('Versión del validador:', detailedReport.validatorVersion);
console.log('Información del workflow:', detailedReport.workflowInfo);
console.log('Recomendaciones:', detailedReport.recommendations);

console.log('\n🎉 Pruebas completadas exitosamente!');

// 🧪 PRUEBA INDEPENDIENTE DEL SISTEMA DE VALIDACIÓN
// Archivo para probar el sistema de validación de manera aislada

import { N8nValidationSystem } from './validation-system.js';

console.log('🧪 INICIANDO PRUEBA DEL SISTEMA DE VALIDACIÓN...\n');

// Crear instancia del sistema de validación
let validationSystem;
try {
  validationSystem = new N8nValidationSystem();
  console.log('✅ Sistema de validación creado exitosamente\n');
} catch (error) {
  console.error('❌ Error al crear el sistema de validación:', error);
  process.exit(1);
}

// Probar métodos básicos
console.log('🔍 PROBANDO MÉTODOS BÁSICOS...\n');

try {
  // Probar getAllValidTypes
  const allTypes = validationSystem.getAllValidTypes();
  console.log(`✅ getAllValidTypes(): ${allTypes.length} tipos válidos`);
  console.log('📊 Primeros 10 tipos:', allTypes.slice(0, 10));

  // Probar isValidNodeType
  const testTypes = [
    'n8n-nodes-base.cron',
    'n8n-nodes-base.telegramTrigger',
    'n8n-nodes-base.invalidType'
  ];

  testTypes.forEach(type => {
    const isValid = validationSystem.isValidNodeType(type);
    console.log(`🔍 ${type}: ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  });

  // Probar addNodeType
  console.log('\n🆕 PROBANDO AGREGAR NUEVO TIPO...');
  validationSystem.addNodeType('test', 'n8n-nodes-base.testNode');
  const updatedTypes = validationSystem.getAllValidTypes();
  console.log(`✅ Después de agregar: ${updatedTypes.length} tipos válidos`);

  // Probar validación de workflow
  console.log('\n🔬 PROBANDO VALIDACIÓN DE WORKFLOW...\n');

  const testWorkflow = {
    nodes: [
      {
        id: '1',
        name: 'Test Cron',
        type: 'n8n-nodes-base.cron',
        parameters: { mode: 'everyMinute' }
      },
      {
        id: '2',
        name: 'Test Telegram',
        type: 'n8n-nodes-base.telegramTrigger',
        parameters: {}
      },
      {
        id: '3',
        name: 'Test Invalid',
        type: 'n8n-nodes-base.invalidType',
        parameters: {}
      }
    ],
    connections: {}
  };

  const validationResult = await validationSystem.validateWorkflow(testWorkflow);

  console.log('📊 RESULTADO DE VALIDACIÓN:');
  console.log(`   ✅ Válido: ${validationResult.isValid}`);
  console.log(`   🚨 Errores: ${validationResult.errors.length}`);
  console.log(`   ⚠️ Advertencias: ${validationResult.warnings.length}`);
  console.log(`   🔧 Correcciones: ${validationResult.corrections}`);

  if (validationResult.errors.length > 0) {
    console.log('\n🚨 ERRORES DETECTADOS:');
    validationResult.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }

  if (validationResult.warnings.length > 0) {
    console.log('\n⚠️ ADVERTENCIAS DETECTADAS:');
    validationResult.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
  }

  // Probar auto-corrección
  console.log('\n🔧 PROBANDO AUTO-CORRECCIÓN...\n');
  const corrections = validationSystem.autoCorrectInvalidNodes(testWorkflow);
  console.log(`✅ Correcciones aplicadas: ${corrections}`);

  // Validar nuevamente después de correcciones
  const finalValidation = await validationSystem.validateWorkflow(testWorkflow);
  console.log(`\n📊 VALIDACIÓN FINAL:`);
  console.log(`   ✅ Válido: ${finalValidation.isValid}`);
  console.log(`   🚨 Errores restantes: ${finalValidation.errors.length}`);

} catch (error) {
  console.error('❌ Error durante las pruebas:', error);
  console.error('Stack trace:', error.stack);
}

console.log('\n🎉 PRUEBA COMPLETADA\n');

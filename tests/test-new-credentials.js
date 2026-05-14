// 🧪 PRUEBA DE NUEVAS CREDENCIALES AGREGADAS
// Verificar que las 50+ credenciales nuevas funcionen correctamente

import { WorkflowValidator } from './workflow-validator.js';

const validator = new WorkflowValidator({ detailedLogging: false });

console.log('🔬 PRUEBA DE NUEVAS CREDENCIALES AGREGADAS\n');

// Verificar estadísticas actualizadas
const credentialValidations = validator.getCredentialValidations();

console.log('📊 ESTADÍSTICAS ACTUALIZADAS:');
console.log(`- Credenciales totales: ${Object.keys(credentialValidations).length}`);
console.log(`- Credenciales nuevas agregadas: 50+`);
console.log();

// Prueba de credenciales críticas del proyecto
console.log('🧪 PRUEBA DE CREDENCIALES CRÍTICAS:');

const criticalCredentials = [
  'customerIoApi',
  'microsoftExchangeOAuth2',
  'openaiApi',
  'stripeApi',
  'shopifyApi',
  'mailchimpApi',
  'awsS3',
  'zendeskApi'
];

criticalCredentials.forEach(cred => {
  const validation = credentialValidations[cred];
  console.log(`- ${cred}: ${validation ? '✅' : '❌'}`);
  if (validation) {
    console.log(`  - Campos requeridos: ${validation.requiredFields?.length || 0}`);
  }
});

console.log();

// Prueba de validación de credenciales específicas
console.log('🧪 PRUEBA DE VALIDACIÓN DE CREDENCIALES:');

// Prueba Customer.io
const customerIoValidation = validator.getCredentialValidations()['customerIoApi'];
if (customerIoValidation) {
  const testResult1 = customerIoValidation.validateCredential({
    apiKey: 'sk_test_1234567890',
    siteId: '12345'
  });
  console.log(`- Customer.io válida: ${testResult1 === null ? '✅' : '❌'} (${testResult1 || 'OK'})`);

  const testResult2 = customerIoValidation.validateCredential({
    apiKey: 'invalid_key',
    siteId: '12345'
  });
  console.log(`- Customer.io inválida: ${testResult2 !== null ? '✅' : '❌'} (${testResult2 || 'OK'})`);
}

// Prueba OpenAI
const openaiValidation = validator.getCredentialValidations()['openaiApi'];
if (openaiValidation) {
  const testResult3 = openaiValidation.validateCredential({
    apiKey: 'sk-test1234567890'
  });
  console.log(`- OpenAI válida: ${testResult3 === null ? '✅' : '❌'} (${testResult3 || 'OK'})`);

  const testResult4 = openaiValidation.validateCredential({
    apiKey: 'invalid_key'
  });
  console.log(`- OpenAI inválida: ${testResult4 !== null ? '✅' : '❌'} (${testResult4 || 'OK'})`);
}

// Prueba Microsoft Exchange
const exchangeValidation = validator.getCredentialValidations()['microsoftExchangeOAuth2'];
if (exchangeValidation) {
  const testResult5 = exchangeValidation.validateCredential({
    clientId: 'test-client-id',
    clientSecret: 'test-secret',
    tenantId: 'test-tenant'
  });
  console.log(`- Microsoft Exchange válida: ${testResult5 === null ? '✅' : '❌'} (${testResult5 || 'OK'})`);
}

console.log('\n🎉 PRUEBA COMPLETADA!');

// Verificación final
const totalCredentials = Object.keys(credentialValidations).length;
const expectedTotal = 76 + 50; // 76 originales + 50 nuevas

console.log('\n📈 VERIFICACIÓN FINAL:');
console.log(`Credenciales totales: ${totalCredentials}/${expectedTotal} ${totalCredentials >= expectedTotal ? '✅' : '⚠️'}`);
console.log(`Credenciales críticas del proyecto: ${criticalCredentials.every(cred => credentialValidations[cred]) ? '✅ TODAS PRESENTES' : '❌ FALTAN ALGUNAS'}`);

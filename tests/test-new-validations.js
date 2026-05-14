// 🧪 PRUEBA ESPECÍFICA DE NUEVAS VALIDACIONES
// Verificar que las 140+ nuevas validaciones funcionen correctamente

import { WorkflowValidator } from './workflow-validator.js';

const validator = new WorkflowValidator({ detailedLogging: false });

console.log('🔬 PRUEBA DE NUEVAS VALIDACIONES\n');

// Verificar cantidad de validaciones
const nodeValidations = validator.getNodeValidations();
const credentialValidations = validator.getCredentialValidations();
const validNodeTypes = validator.getValidNodeTypes();

console.log('📊 ESTADÍSTICAS DE VALIDACIONES:');
console.log(`- Categorías de nodos válidos: ${Object.keys(validNodeTypes).length}`);
console.log(`- Validaciones específicas de nodos: ${Object.keys(nodeValidations).length}`);
console.log(`- Validaciones de credenciales: ${Object.keys(credentialValidations).length}`);

// Contar nodos totales en todas las categorías
let totalNodes = 0;
Object.values(validNodeTypes).forEach(category => {
  if (Array.isArray(category)) {
    totalNodes += category.length;
  }
});
console.log(`- Total de nodos válidos: ${totalNodes}`);
console.log();

// Prueba de algunos nodos nuevos en las categorías
console.log('🧪 PRUEBA DE NODOS NUEVOS:');

const testNodes = [
  { type: 'n8n-nodes-base.customerio.updateCustomer', category: 'actions' },
  { type: 'n8n-nodes-base.microsoftExchange.sendEmail', category: 'actions' },
  { type: 'n8n-nodes-base.jenkins.runJenkinsfile', category: 'actions' },
  { type: 'n8n-nodes-base.openai.chatCompletion', category: 'actions' },
  { type: 'n8n-nodes-base.awsS3.uploadFile', category: 'actions' },
  { type: 'n8n-nodes-base.webhook', category: 'triggers' }
];

testNodes.forEach(node => {
  const category = validNodeTypes[node.category];
  const exists = category && Array.isArray(category) && category.includes(node.type);
  console.log(`- ${node.type} (${node.category}): ${exists ? '✅' : '❌'}`);
});

console.log();

// Prueba de validaciones específicas
console.log('🧪 PRUEBA DE VALIDACIONES ESPECÍFICAS:');

const testValidations = [
  'n8n-nodes-base.httpRequest',
  'n8n-nodes-base.slack',
  'n8n-nodes-base.customerio.updateCustomer',
  'n8n-nodes-base.microsoftExchange.sendEmail'
];

testValidations.forEach(type => {
  const validation = nodeValidations[type];
  console.log(`- ${type}: ${validation ? '✅' : '❌'}`);
  if (validation) {
    console.log(`  - Parámetros requeridos: ${validation.requiredParams?.length || 0}`);
    console.log(`  - Credenciales: ${validation.credentials?.length || 0}`);
  }
});

console.log();

// Prueba de credenciales
console.log('🧪 PRUEBA DE CREDENCIALES:');

const testCredentials = [
  'gmailOAuth2',
  'slackApi',
  'customerIoApi',
  'microsoftExchangeOAuth2',
  'openaiApi'
];

testCredentials.forEach(cred => {
  const validation = credentialValidations[cred];
  console.log(`- ${cred}: ${validation ? '✅' : '❌'}`);
});

console.log('\n🎉 PRUEBA COMPLETADA!');

// Verificación final
const totalExpected = {
  nodeValidations: 39,
  credentials: 76
};

console.log('\n📈 VERIFICACIÓN FINAL:');
console.log(`Nodos válidos: ${totalNodes}/${700} ${totalNodes >= 700 ? '✅' : '⚠️'}`);
console.log(`Validaciones: ${Object.keys(nodeValidations).length}/${totalExpected.nodeValidations} ${Object.keys(nodeValidations).length >= totalExpected.nodeValidations ? '✅' : '⚠️'}`);
console.log(`Credenciales: ${Object.keys(credentialValidations).length}/${totalExpected.credentials} ${Object.keys(credentialValidations).length >= totalExpected.credentials ? '✅' : '⚠️'}`);

/**
 * 🔧 CORRECTOR DE WORKFLOW - AGREGAR PARÁMETROS FALTANTES
 * =======================================================
 * 
 * Este script corrige el workflow de 50 nodos agregando los parámetros
 * mínimos requeridos para evitar el error de toLowerCase()
 */

import fs from 'fs';

const workflowPath = './generated-workflows/workflow-masivo-gemini-1757795564795.json';
const outputPath = './generated-workflows/workflow-masivo-gemini-1757795564795-CORREGIDO.json';

console.log('🔧 CORRECTOR DE WORKFLOW - PARÁMETROS FALTANTES');
console.log('===============================================');

try {
  const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  
  console.log('📊 Workflow original cargado');
  console.log(`   • Nodos: ${workflowData.nodes.length}`);
  console.log(`   • Conexiones: ${Object.keys(workflowData.connections || {}).length}`);
  
  let corrections = 0;
  
  // Definir parámetros mínimos por tipo de nodo
  const minimumParameters = {
    'n8n-nodes-base.salesforce': {
      operation: 'create',
      resource: 'contact'
    },
    'n8n-nodes-base.hubspot': {
      operation: 'create',
      resource: 'contact'
    },
    'n8n-nodes-base.emailSend': {
      fromEmail: 'workflow@example.com',
      toEmail: 'admin@example.com',
      subject: 'Notification from n8n',
      text: 'This is an automated message from your n8n workflow.'
    },
    'n8n-nodes-base.twilio': {
      operation: 'send',
      resource: 'sms',
      to: '+1234567890',
      from: '+0987654321',
      body: 'Message from n8n workflow'
    },
    'n8n-nodes-base.slack': {
      operation: 'post',
      resource: 'message',
      channel: '#general',
      text: 'Notification from n8n workflow'
    },
    'n8n-nodes-base.start': {
      // Start node doesn't need parameters
    },
    'n8n-nodes-base.googleAnalytics': {
      operation: 'get',
      resource: 'report'
    },
    'n8n-nodes-base.sendgrid': {
      operation: 'send',
      resource: 'mail',
      to: 'admin@example.com',
      from: 'workflow@example.com',
      subject: 'Notification from n8n',
      text: 'This is an automated message from your n8n workflow.'
    },
    'n8n-nodes-base.stripe': {
      operation: 'create',
      resource: 'charge'
    }
  };
  
  // Corregir cada nodo
  workflowData.nodes.forEach((node, index) => {
    console.log(`🔍 Revisando nodo ${index + 1}: ${node.name} (${node.type})`);
    
    // Asegurar que el nodo tenga parameters
    if (!node.parameters) {
      node.parameters = {};
      corrections++;
      console.log(`   ✅ Agregado objeto parameters vacío`);
    }
    
    // Agregar parámetros mínimos según el tipo
    if (minimumParameters[node.type]) {
      let addedParams = 0;
      for (const [key, value] of Object.entries(minimumParameters[node.type])) {
        if (!(key in node.parameters)) {
          node.parameters[key] = value;
          addedParams++;
          corrections++;
        }
      }
      if (addedParams > 0) {
        console.log(`   ✅ Agregados ${addedParams} parámetros mínimos`);
      }
    }
    
    // Asegurar typeVersion
    if (!node.typeVersion) {
      node.typeVersion = 1;
      corrections++;
      console.log(`   ✅ Agregado typeVersion = 1`);
    }
    
    // Verificar parámetros específicos problemáticos
    if (node.type === 'n8n-nodes-base.googleSheets' && !node.parameters.operation) {
      node.parameters.operation = 'append';
      corrections++;
      console.log(`   ✅ Corregido: operation = "append"`);
    }
    
    if (node.type === 'n8n-nodes-base.googleCalendar' && !node.parameters.operation) {
      node.parameters.operation = 'create';
      corrections++;
      console.log(`   ✅ Corregido: operation = "create"`);
    }
  });
  
  console.log(`\n📊 CORRECCIONES APLICADAS: ${corrections}`);
  
  // Guardar el workflow corregido
  fs.writeFileSync(outputPath, JSON.stringify(workflowData, null, 2), 'utf8');
  
  console.log(`✅ Workflow corregido guardado en:`);
  console.log(`   ${outputPath}`);
  console.log(`\n🎯 El workflow corregido debería importarse sin errores en n8n`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
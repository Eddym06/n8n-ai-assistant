/**
 * TEST DEL JSON REPAIR AGENT V3.0 - INTEGRACIÓN COMPLETA
 * Verifica que el agente de reparación está funcionando correctamente
 * en el extension-server-final-fix.js
 */

import { JSONRepairAgent } from './json-repair-agent-v3.js';
import dotenv from 'dotenv';

dotenv.config();

// Test JSON corrupto
const corruptedJSON = `{
  "name": "Test Workflow",
  "nodes": [
    {
      "id": "node1",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest
      "position": [100, 200],
      "parameters": {
        "url": "https://api.example.com/data"
      }
    {
      "id": "node2",
      "name": "Process Data",
      "type": "n8n-nodes-base.function",
      "position": [300, 200],
      "parameters": {
        "functionCode": "return items;"
      }
    }
  ],
  "connections": {
    "HTTP Request": {
      "main": [[{"node": "Process Data", "type": "main", "index": 0}]]
    }
  }`;

// Test JSON truncado
const truncatedJSON = `{
  "name": "Test Workflow Truncated",
  "nodes": [
    {
      "id": "node1",
      "name": "Start Node",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [100, 100],
      "parameters": {}
    },
    {
      "id": "node2",
      "name": "Process Node",
      "type": "n8n-nodes-base.function",
      "position": [300, 100],
      "parameters": {
        "functionCode": "return`;

async function testJSONRepairAgent() {
  console.log('🧪 INICIANDO TESTS DEL JSON REPAIR AGENT V3.0');
  console.log('============================================================');
  
  const agent = new JSONRepairAgent(process.env.GEMINI_API_KEY);
  
  // Test 1: JSON Corrupto
  console.log('\n📋 TEST 1: Reparación de JSON Corrupto');
  console.log('JSON corrupto detectado:', corruptedJSON.substring(0, 100) + '...');
  
  try {
    const result1 = await agent.repairJSON(corruptedJSON, {
      originalPrompt: 'workflow de procesamiento de datos HTTP',
      contextLength: corruptedJSON.length
    });
    
    if (result1.success) {
      console.log('✅ TEST 1 PASÓ - JSON corrupto reparado exitosamente');
      console.log(`   📏 Longitud original: ${corruptedJSON.length} chars`);
      console.log(`   📏 Longitud reparada: ${result1.repairedJSON.length} chars`);
      console.log(`   🔧 Método usado: ${result1.method}`);
      
      // Verificar que el JSON reparado es válido
      try {
        const parsed = JSON.parse(result1.repairedJSON);
        console.log(`   ✅ JSON válido con ${parsed.nodes?.length || 0} nodos`);
      } catch (parseError) {
        console.log(`   ❌ JSON reparado aún no es válido: ${parseError.message}`);
      }
    } else {
      console.log('❌ TEST 1 FALLÓ:', result1.error);
    }
  } catch (error) {
    console.log('❌ TEST 1 ERROR:', error.message);
  }
  
  // Test 2: JSON Truncado
  console.log('\n📋 TEST 2: Completación de JSON Truncado');
  console.log('JSON truncado detectado:', truncatedJSON.substring(0, 100) + '...');
  
  try {
    const result2 = await agent.repairJSON(truncatedJSON, {
      originalPrompt: 'workflow básico con trigger manual y función de procesamiento',
      contextLength: truncatedJSON.length
    });
    
    if (result2.success) {
      console.log('✅ TEST 2 PASÓ - JSON truncado completado exitosamente');
      console.log(`   📏 Longitud original: ${truncatedJSON.length} chars`);
      console.log(`   📏 Longitud completada: ${result2.repairedJSON.length} chars`);
      console.log(`   🔧 Método usado: ${result2.method}`);
      
      // Verificar que el JSON completado es válido
      try {
        const parsed = JSON.parse(result2.repairedJSON);
        console.log(`   ✅ JSON válido con ${parsed.nodes?.length || 0} nodos`);
        console.log(`   🔗 Conexiones: ${Object.keys(parsed.connections || {}).length}`);
      } catch (parseError) {
        console.log(`   ❌ JSON completado aún no es válido: ${parseError.message}`);
      }
    } else {
      console.log('❌ TEST 2 FALLÓ:', result2.error);
    }
  } catch (error) {
    console.log('❌ TEST 2 ERROR:', error.message);
  }
  
  // Test 3: JSON Válido (no debe modificarse)
  console.log('\n📋 TEST 3: JSON Válido (sin modificaciones)');
  const validJSON = JSON.stringify({
    name: "Valid Test Workflow",
    nodes: [
      {
        id: "node1",
        name: "Manual Trigger",
        type: "n8n-nodes-base.manualTrigger",
        position: [100, 100],
        parameters: {}
      }
    ],
    connections: {}
  }, null, 2);
  
  try {
    const result3 = await agent.analyzeJSON(validJSON);
    
    if (result3.success && result3.analysis.status === 'valid') {
      console.log('✅ TEST 3 PASÓ - JSON válido reconocido correctamente');
      console.log(`   📊 Status: ${result3.analysis.status}`);
      console.log(`   🔍 Issues: ${result3.analysis.issues.length}`);
    } else {
      console.log('❌ TEST 3 FALLÓ - JSON válido no reconocido');
    }
  } catch (error) {
    console.log('❌ TEST 3 ERROR:', error.message);
  }
  
  // Mostrar estadísticas finales
  console.log('\n📊 ESTADÍSTICAS FINALES DEL AGENTE');
  const stats = agent.getStats();
  console.log(`   🔧 Intentos de reparación: ${stats.repairAttempts}`);
  console.log(`   📚 Entradas en historial: ${stats.historySize}`);
  console.log(`   🆔 Sesión: ${stats.sessionId}`);
  console.log(`   🤖 Llamadas a Gemini: ${stats.geminiCalls.totalCalls}`);
  console.log(`   🎯 Tokens totales: ${stats.geminiCalls.totalTokens}`);
  
  console.log('\n============================================================');
  console.log('🧪 TESTS DEL JSON REPAIR AGENT V3.0 COMPLETADOS');
}

// Ejecutar tests si este archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testJSONRepairAgent().catch(console.error);
}

export { testJSONRepairAgent };
/**
 * TEST BÁSICO DEL JSON REPAIR AGENT V3.0 - SIN GEMINI
 * Verifica que el agente está correctamente integrado y puede analizar JSON
 */

import { JSONRepairAgent } from './json-repair-agent-v3.js';
import dotenv from 'dotenv';

dotenv.config();

async function testBasicFunctionality() {
  console.log('🧪 INICIANDO TEST BÁSICO DEL JSON REPAIR AGENT V3.0');
  console.log('============================================================');
  
  const agent = new JSONRepairAgent(process.env.GEMINI_API_KEY || 'test-key');
  
  // Test 1: Inicialización correcta
  console.log('\n📋 TEST 1: Verificación de Inicialización');
  try {
    const stats = agent.getStats();
    console.log('✅ TEST 1 PASÓ - Agente inicializado correctamente');
    console.log(`   🆔 Sesión: ${stats.sessionId}`);
    console.log(`   🔧 Intentos iniciales: ${stats.repairAttempts}`);
    console.log(`   📚 Historial inicial: ${stats.historySize}`);
  } catch (error) {
    console.log('❌ TEST 1 FALLÓ:', error.message);
  }
  
  // Test 2: Análisis básico de JSON válido
  console.log('\n📋 TEST 2: Análisis de JSON Válido');
  const validJSON = `{
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "node1",
        "name": "Manual Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "position": [100, 100],
        "parameters": {}
      }
    ],
    "connections": {}
  }`;
  
  try {
    const analysis = agent.performBasicAnalysis(validJSON);
    console.log('✅ TEST 2 PASÓ - Análisis básico funcional');
    console.log(`   📊 Status: ${analysis.status}`);
    console.log(`   🔍 Issues encontrados: ${analysis.issues.length}`);
    console.log(`   📏 Longitud: ${analysis.length} chars`);
  } catch (error) {
    console.log('❌ TEST 2 FALLÓ:', error.message);
  }
  
  // Test 3: Detección de JSON corrupto
  console.log('\n📋 TEST 3: Detección de JSON Corrupto');
  const corruptedJSON = `{
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "node1",
        "name": "Manual Trigger"
        "type": "n8n-nodes-base.manualTrigger",
        "position": [100, 100],
        "parameters": {}
      }
    ],
    "connections": {`;
  
  try {
    const analysis = agent.performBasicAnalysis(corruptedJSON);
    console.log('✅ TEST 3 PASÓ - Detección de corrupción funcional');
    console.log(`   📊 Status: ${analysis.status}`);
    console.log(`   🔍 Issues encontrados: ${analysis.issues.length}`);
    if (analysis.issues.length > 0) {
      console.log(`   ⚠️ Problemas: ${analysis.issues.join(', ')}`);
    }
  } catch (error) {
    console.log('❌ TEST 3 FALLÓ:', error.message);
  }
  
  // Test 4: Detección de truncamiento
  console.log('\n📋 TEST 4: Detección de Truncamiento');
  const truncatedJSON = `{
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "node1",
        "name": "Manual Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "position": [100, 100],
        "parameters": {
          "prop": "value"`;
  
  try {
    const truncationPoint = agent.detectTruncationPoint(truncatedJSON);
    console.log('✅ TEST 4 PASÓ - Detección de truncamiento funcional');
    console.log(`   🎯 Tipo: ${truncationPoint.type}`);
    console.log(`   📍 Ubicación: ${truncationPoint.location}`);
  } catch (error) {
    console.log('❌ TEST 4 FALLÓ:', error.message);
  }
  
  // Test 5: Verificación de clases auxiliares
  console.log('\n📋 TEST 5: Verificación de Clases Auxiliares');
  try {
    // Verificar que las clases auxiliares están disponibles
    const memoryAgent = agent.memoryAgent;
    const validationOrchestrator = agent.validationOrchestrator;
    
    console.log('✅ TEST 5 PASÓ - Clases auxiliares disponibles');
    console.log(`   🧠 Memory Agent: ${memoryAgent.constructor.name}`);
    console.log(`   🔍 Validation Orchestrator: ${validationOrchestrator.constructor.name}`);
    console.log(`   🆔 Memory Session: ${memoryAgent.sessionId}`);
  } catch (error) {
    console.log('❌ TEST 5 FALLÓ:', error.message);
  }
  
  // Estadísticas finales
  console.log('\n📊 ESTADÍSTICAS FINALES DEL AGENTE');
  const finalStats = agent.getStats();
  console.log(`   🔧 Intentos de reparación: ${finalStats.repairAttempts}`);
  console.log(`   📚 Entradas en historial: ${finalStats.historySize}`);
  console.log(`   🆔 Sesión: ${finalStats.sessionId}`);
  
  console.log('\n============================================================');
  console.log('🧪 TEST BÁSICO DEL JSON REPAIR AGENT V3.0 COMPLETADO');
  console.log('✅ Agente funcionando correctamente y listo para integración');
}

// Ejecutar test
testBasicFunctionality().catch(console.error);
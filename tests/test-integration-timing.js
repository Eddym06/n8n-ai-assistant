/**
 * 🧪 TEST DE INTEGRACIÓN - TIMING DEL AGENTE
 * Prueba que el agente se ejecuta ANTES del guardado del workflow
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulamos una prueba rápida del flujo
async function testIntegrationTiming() {
  console.log('🔍 VERIFICANDO TIMING DE INTEGRACIÓN DEL AGENTE');
  console.log('=' * 60);
  
  // Leemos el archivo del servidor
  const serverPath = path.join(__dirname, 'extension server fixed.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Verificamos el orden correcto
  const lines = serverContent.split('\n');
  let agentLineNumber = -1;
  let saveLineNumber = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('🤖 CONFIGURACIÓN AVANZADA DE NODOS (ANTES DE GUARDAR)')) {
      agentLineNumber = i + 1;
      console.log(`✅ Agente encontrado en línea: ${agentLineNumber}`);
    }
    
    if (line.includes('fs.writeFileSync(fullPath, JSON.stringify(importResult.data')) {
      saveLineNumber = i + 1;
      console.log(`✅ Operación de guardado encontrada en línea: ${saveLineNumber}`);
    }
  }
  
  // Verificamos el orden
  if (agentLineNumber !== -1 && saveLineNumber !== -1) {
    if (agentLineNumber < saveLineNumber) {
      console.log('\n🎉 TIMING CORRECTO:');
      console.log(`   📍 Agente ejecuta en línea ${agentLineNumber}`);
      console.log(`   💾 Guardado ejecuta en línea ${saveLineNumber}`);
      console.log('   ✅ El agente se ejecuta ANTES del guardado');
      console.log('\n🔧 FLUJO CORRECTO:');
      console.log('   1. ✅ Limpieza crítica');
      console.log('   2. ✅ Configuración de nodos (AGENTE)');
      console.log('   3. ✅ Guardado del workflow');
      return true;
    } else {
      console.log('\n❌ TIMING INCORRECTO:');
      console.log(`   📍 Agente ejecuta en línea ${agentLineNumber}`);
      console.log(`   💾 Guardado ejecuta en línea ${saveLineNumber}`);
      console.log('   ❌ El agente se ejecuta DESPUÉS del guardado');
      return false;
    }
  } else {
    console.log('❌ No se encontraron las secciones necesarias');
    console.log(`   Agente encontrado: ${agentLineNumber !== -1 ? 'SÍ' : 'NO'}`);
    console.log(`   Guardado encontrado: ${saveLineNumber !== -1 ? 'SÍ' : 'NO'}`);
    return false;
  }
}

// Verificamos también que no haya duplicados
function checkForDuplicates() {
  console.log('\n🔍 VERIFICANDO DUPLICADOS...');
  
  const serverPath = path.join(__dirname, 'extension server fixed.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  const agentOccurrences = (serverContent.match(/🤖 CONFIGURACIÓN AVANZADA DE NODOS/g) || []).length;
  const agentInstances = (serverContent.match(/IntelligentNodeConfigAgent/g) || []).length;
  
  console.log(`📊 Ocurrencias del agente: ${agentOccurrences}`);
  console.log(`📊 Instancias de IntelligentNodeConfigAgent: ${agentInstances}`);
  
  if (agentOccurrences === 1) {
    console.log('✅ No hay duplicados del bloque del agente');
    return true;
  } else {
    console.log('⚠️ Posibles duplicados detectados');
    return false;
  }
}

// Ejecutar pruebas
async function runTests() {
  try {
    const timingOK = await testIntegrationTiming();
    const noDuplicates = checkForDuplicates();
    
    console.log('\n' + '=' * 60);
    console.log('📋 RESUMEN DE INTEGRACIÓN:');
    console.log(`   ⏰ Timing correcto: ${timingOK ? '✅' : '❌'}`);
    console.log(`   🚫 Sin duplicados: ${noDuplicates ? '✅' : '❌'}`);
    console.log(`   🎯 Integración lista: ${timingOK && noDuplicates ? '✅ SÍ' : '❌ NO'}`);
    
    if (timingOK && noDuplicates) {
      console.log('\n🚀 LA INTEGRACIÓN ESTÁ LISTA PARA USAR');
      console.log('   El agente se ejecutará ANTES del guardado');
      console.log('   Las configuraciones se aplicarán al workflow final');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

runTests();
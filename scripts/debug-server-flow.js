// Test para verificar el flujo real de llamadas en el extension server
import { config } from 'dotenv';
config();

console.log('🔍 TEST DE FLUJO REAL - Extension Server');
console.log('=========================================');

// Simular el entorno del extension server
import fs from 'fs';

try {
  // Leer el archivo del extension server
  const serverCode = fs.readFileSync('./extension server fixed.js', 'utf8');
  
  console.log('\n1. ANÁLISIS DEL CÓDIGO DEL SERVIDOR:');
  console.log(`   📄 Archivo leído: ${Math.round(serverCode.length / 1024)}KB`);
  
  // Buscar patterns de llamadas a Gemini
  const geminiCallPattern = /callGeminiMassive\s*\(/g;
  const geminiCalls = serverCode.match(geminiCallPattern);
  console.log(`   📞 Occurrencias de callGeminiMassive: ${geminiCalls?.length || 0}`);
  
  // Buscar patterns de processUserPromptV2
  const v2Pattern = /processUserPromptV2\s*\(/g;
  const v2Calls = serverCode.match(v2Pattern);
  console.log(`   🔄 Occurrencias de processUserPromptV2: ${v2Calls?.length || 0}`);
  
  // Buscar patterns de processUserPromptV4Ultra
  const v4Pattern = /processUserPromptV4Ultra\s*\(/g;
  const v4Calls = serverCode.match(v4Pattern);
  console.log(`   🚀 Occurrencias de processUserPromptV4Ultra: ${v4Calls?.length || 0}`);
  
  // Buscar la lógica de decisión FORCE_V4
  const forceV4Pattern = /FORCE_V4.*?===.*?['"`]true['"`]/g;
  const forceV4Logic = serverCode.match(forceV4Pattern);
  console.log(`   ⚡ Lógica FORCE_V4 encontrada: ${forceV4Logic?.length || 0}`);
  
  // Verificar variable de entorno
  console.log('\n2. CONFIGURACIÓN ACTUAL:');
  console.log(`   ⚡ FORCE_V4 actual: "${process.env.FORCE_V4}"`);
  console.log(`   ⚡ FORCE_V4 === 'true': ${process.env.FORCE_V4 === 'true'}`);
  
  // Buscar condicionales que puedan estar bloqueando las llamadas
  console.log('\n3. BÚSQUEDA DE POSIBLES BLOQUEOS:');
  
  // Buscar uso de workflows de referencia
  const referencesPattern = /workflows?\s+reales?\s+como\s+referencia/gi;
  const referencesFound = serverCode.match(referencesPattern);
  console.log(`   📚 Referencias a "workflows reales como referencia": ${referencesFound?.length || 0}`);
  
  // Buscar fallbacks
  const fallbackPattern = /fallback|usar.*referencia|sin.*gemini/gi;
  const fallbacksFound = serverCode.match(fallbackPattern);
  console.log(`   🔄 Patterns de fallback encontrados: ${fallbacksFound?.length || 0}`);
  
  // Buscar condicionales de testing/debugging
  const testPattern = /if.*test|if.*debug|if.*mock/gi;
  const testConditions = serverCode.match(testPattern);
  console.log(`   🧪 Condicionales de test/debug: ${testConditions?.length || 0}`);
  
  // Análisis específico de processUserPromptV2
  console.log('\n4. ANÁLISIS DE processUserPromptV2:');
  
  const v2MethodStart = serverCode.indexOf('async processUserPromptV2(');
  if (v2MethodStart !== -1) {
    const v2MethodEnd = serverCode.indexOf('\n  }', v2MethodStart + 2000); // Buscar hasta ~2000 chars después
    const v2Method = serverCode.substring(v2MethodStart, v2MethodEnd + 4);
    
    // Verificar si llama a callGeminiMassive
    const hasGeminiCall = v2Method.includes('callGeminiMassive');
    console.log(`   📞 processUserPromptV2 llama a callGeminiMassive: ${hasGeminiCall ? '✅' : '❌'}`);
    
    if (!hasGeminiCall) {
      // Buscar qué otros métodos llama
      const methodCalls = v2Method.match(/\w+\s*\([^)]*\)\s*;/g) || [];
      console.log(`   🔍 Métodos llamados en processUserPromptV2:`);
      methodCalls.slice(0, 10).forEach((call, idx) => {
        console.log(`      ${idx + 1}. ${call.trim()}`);
      });
    }
  }
  
  console.log('\n5. RECOMENDACIONES:');
  if (process.env.FORCE_V4 === 'true') {
    console.log('   ✅ FORCE_V4 está activado, debería usar processUserPromptV4Ultra');
    console.log('   📝 Verificar que processUserPromptV4Ultra esté llamando a Gemini');
  } else {
    console.log('   ⚠️  FORCE_V4 no está activado, puede usar cualquier versión');
    console.log('   📝 Activar FORCE_V4=true para forzar uso de V4');
  }
  
} catch (error) {
  console.error(`❌ Error leyendo archivo: ${error.message}`);
}
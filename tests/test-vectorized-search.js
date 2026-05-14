#!/usr/bin/env node

// Script para probar específicamente la búsqueda vectorizada
import WorkflowVectorSearchEngine from './SISTEMA PRINCIPAL/workflow-vector-search-engine-esm.js';

async function testVectorizedSearch() {
  console.log('🧪 PROBANDO BÚSQUEDA VECTORIZADA CORREGIDA...\n');
  
  try {
    // Inicializar el motor de búsqueda
    console.log('⚙️ Inicializando WorkflowVectorSearchEngine...');
    const searchEngine = new WorkflowVectorSearchEngine();
    
    // Probar con diferentes consultas
    const testQueries = [
      'quiero crear un workflow para telegram',
      'enviar emails automaticos',
      'procesar datos de google sheets',
      'automatizar slack',
      'webhook para whatsapp'
    ];
    
    for (const query of testQueries) {
      console.log(`\n🔍 BUSCANDO: "${query}"`);
      console.log('─'.repeat(50));
      
      const startTime = Date.now();
      const results = await searchEngine.searchSimilarWorkflows(query);
      const searchTime = Date.now() - startTime;
      
      console.log(`⏱️ Tiempo de búsqueda: ${searchTime}ms`);
      console.log(`📊 Resultados encontrados: ${results.length}`);
      
      if (results.length > 0) {
        console.log('🎯 Top 3 resultados:');
        results.slice(0, 3).forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.name} (score: ${result.similarity.toFixed(3)})`);
          console.log(`      📂 Categoria: ${result.category}`);
          if (result.description) {
            console.log(`      📝 ${result.description.substring(0, 80)}...`);
          }
        });
      } else {
        console.log('❌ No se encontraron resultados relevantes');
      }
    }
    
    console.log('\n✅ Prueba de búsqueda vectorizada completada');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('📋 Stack:', error.stack);
  }
}

// Ejecutar la prueba
testVectorizedSearch();
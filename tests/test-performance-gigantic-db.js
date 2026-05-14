// 🧪 PRUEBAS DE RENDIMIENTO PARA BASE DE DATOS GIGANTE
// 3 Pruebas diferentes para evaluar cantidad y precisión

import WorkflowVectorSearchEngine from './SISTEMA PRINCIPAL/workflow-vector-search-engine-esm.js';

async function performanceTests() {
    console.log('🧪 ================================================');
    console.log('🧪 PRUEBAS DE RENDIMIENTO - BASE DE DATOS GIGANTE');
    console.log('🧪 ================================================\n');
    
    const searchEngine = new WorkflowVectorSearchEngine();
    await searchEngine.initialize();
    
    const results = {
        totalWorkflows: searchEngine.metrics.totalWorkflows,
        tests: []
    };
    
    // 📋 PRUEBA 1: Búsqueda específica - Telegram Bot
    console.log('🔍 PRUEBA 1: Búsqueda específica "Telegram bot automation"');
    const startTime1 = Date.now();
    const test1Results = await searchEngine.searchSimilarWorkflows('telegram bot automation schedule message');
    const time1 = Date.now() - startTime1;
    
    console.log(`⏱️ Tiempo: ${time1}ms`);
    console.log(`📊 Resultados: ${test1Results.length}`);
    console.log(`🎯 Top 3 resultados:`);
    test1Results.slice(0, 3).forEach((r, i) => {
        console.log(`  ${i+1}. ${r.workflow?.name || r.workflow?.workflow_info?.file_name || 'Sin nombre'} (${(r.similarity*100).toFixed(1)}%)`);
    });
    
    results.tests.push({
        name: 'Telegram Bot Automation',
        query: 'telegram bot automation schedule message',
        resultsCount: test1Results.length,
        timeMs: time1,
        topSimilarity: test1Results[0]?.similarity || 0,
        avgSimilarity: test1Results.reduce((sum, r) => sum + r.similarity, 0) / test1Results.length
    });
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 📋 PRUEBA 2: Búsqueda amplia - Email automation
    console.log('🔍 PRUEBA 2: Búsqueda amplia "Email automation workflow"');
    const startTime2 = Date.now();
    const test2Results = await searchEngine.searchSimilarWorkflows('email automation workflow send gmail outlook');
    const time2 = Date.now() - startTime2;
    
    console.log(`⏱️ Tiempo: ${time2}ms`);
    console.log(`📊 Resultados: ${test2Results.length}`);
    console.log(`🎯 Top 3 resultados:`);
    test2Results.slice(0, 3).forEach((r, i) => {
        console.log(`  ${i+1}. ${r.workflow?.name || r.workflow?.workflow_info?.file_name || 'Sin nombre'} (${(r.similarity*100).toFixed(1)}%)`);
    });
    
    results.tests.push({
        name: 'Email Automation',
        query: 'email automation workflow send gmail outlook',
        resultsCount: test2Results.length,
        timeMs: time2,
        topSimilarity: test2Results[0]?.similarity || 0,
        avgSimilarity: test2Results.reduce((sum, r) => sum + r.similarity, 0) / test2Results.length
    });
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 📋 PRUEBA 3: Búsqueda técnica - Database operations
    console.log('🔍 PRUEBA 3: Búsqueda técnica "Database operations sync data"');
    const startTime3 = Date.now();
    const test3Results = await searchEngine.searchSimilarWorkflows('database operations sync data postgres mysql spreadsheet');
    const time3 = Date.now() - startTime3;
    
    console.log(`⏱️ Tiempo: ${time3}ms`);
    console.log(`📊 Resultados: ${test3Results.length}`);
    console.log(`🎯 Top 3 resultados:`);
    test3Results.slice(0, 3).forEach((r, i) => {
        console.log(`  ${i+1}. ${r.workflow?.name || r.workflow?.workflow_info?.file_name || 'Sin nombre'} (${(r.similarity*100).toFixed(1)}%)`);
    });
    
    results.tests.push({
        name: 'Database Operations',
        query: 'database operations sync data postgres mysql spreadsheet',
        resultsCount: test3Results.length,
        timeMs: time3,
        topSimilarity: test3Results[0]?.similarity || 0,
        avgSimilarity: test3Results.reduce((sum, r) => sum + r.similarity, 0) / test3Results.length
    });
    
    // 📊 RESUMEN FINAL
    console.log('\n🏁 ================================================');
    console.log('🏁 RESUMEN DE PRUEBAS DE RENDIMIENTO');
    console.log('🏁 ================================================');
    
    const avgTime = results.tests.reduce((sum, t) => sum + t.timeMs, 0) / results.tests.length;
    const totalResults = results.tests.reduce((sum, t) => sum + t.resultsCount, 0);
    const avgResults = totalResults / results.tests.length;
    const avgTopSimilarity = results.tests.reduce((sum, t) => sum + t.topSimilarity, 0) / results.tests.length;
    
    console.log(`📊 Base de datos: ${results.totalWorkflows} workflows en 168 categorías`);
    console.log(`⏱️ Tiempo promedio: ${avgTime.toFixed(1)}ms`);
    console.log(`📈 Resultados promedio: ${avgResults.toFixed(1)} workflows por búsqueda`);
    console.log(`🎯 Similitud promedio del mejor resultado: ${(avgTopSimilarity * 100).toFixed(1)}%`);
    
    console.log('\n📋 DETALLE POR PRUEBA:');
    results.tests.forEach((test, i) => {
        console.log(`${i+1}. ${test.name}:`);
        console.log(`   ⏱️ ${test.timeMs}ms | 📊 ${test.resultsCount} resultados | 🎯 ${(test.topSimilarity * 100).toFixed(1)}% mejor`);
    });
    
    // 📈 EVALUACIÓN DE RENDIMIENTO
    console.log('\n🚀 EVALUACIÓN FINAL:');
    if (avgTime < 100) {
        console.log('✅ RENDIMIENTO: EXCELENTE (< 100ms promedio)');
    } else if (avgTime < 500) {
        console.log('✅ RENDIMIENTO: BUENO (< 500ms promedio)');
    } else {
        console.log('⚠️ RENDIMIENTO: MEJORABLE (> 500ms promedio)');
    }
    
    if (avgResults >= 10) {
        console.log('✅ COBERTURA: EXCELENTE (10+ resultados promedio)');
    } else if (avgResults >= 5) {
        console.log('✅ COBERTURA: BUENA (5+ resultados promedio)');
    } else {
        console.log('⚠️ COBERTURA: LIMITADA (< 5 resultados promedio)');
    }
    
    if (avgTopSimilarity > 0.25) {
        console.log('✅ PRECISIÓN: EXCELENTE (25%+ similitud promedio)');
    } else if (avgTopSimilarity > 0.15) {
        console.log('✅ PRECISIÓN: BUENA (15%+ similitud promedio)');
    } else {
        console.log('⚠️ PRECISIÓN: MEJORABLE (< 15% similitud promedio)');
    }
    
    return results;
}

performanceTests().then(results => {
    console.log('\n🎉 ¡Pruebas de rendimiento completadas!');
}).catch(error => {
    console.error('💥 Error en las pruebas:', error);
});
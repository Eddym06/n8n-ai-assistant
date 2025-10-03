/**
 * Test Rápido de Optimizaciones API
 * Verifica las mejoras implementadas
 */

console.log('🚀 Iniciando test rápido de optimizaciones...');

// Importar sistema
let V4UltraHybridSystem;
let apiOptimizer;

try {
    const systemModule = await import('./v4-ultra-hybrid-system.js');
    V4UltraHybridSystem = systemModule.default;
    
    const optimizerModule = await import('./api-optimization-manager.mjs');
    apiOptimizer = optimizerModule.apiOptimizer;
    
    console.log('✅ Módulos cargados correctamente');
} catch (error) {
    console.error('❌ Error cargando módulos:', error.message);
    process.exit(1);
}

async function runQuickTest() {
    try {
        console.log('\n📊 Estado inicial del API Optimizer:');
        const initialStats = apiOptimizer.getUsageStats();
        console.log(`   📞 Calls realizadas: ${initialStats.minute.used}/${initialStats.minute.limit}`);
        console.log(`   💾 Cache size: ${initialStats.cache.size}`);
        
        console.log('\n🧪 Probando sistema de cache...');
        
        // Test del cache
        const testContent = 'test-content-123';
        const cachedResult = apiOptimizer.getCachedResult('test', testContent);
        console.log(`   Cache inicial: ${cachedResult ? 'HIT' : 'MISS'}`);
        
        apiOptimizer.setCachedResult('test', testContent, { success: true });
        const cachedResult2 = apiOptimizer.getCachedResult('test', testContent);
        console.log(`   Cache después de save: ${cachedResult2 ? 'HIT' : 'MISS'}`);
        
        console.log('\n⏳ Probando rate limiting...');
        const canMakeRequest = apiOptimizer.canMakeRequest();
        console.log(`   ¿Puede hacer request?: ${canMakeRequest ? 'SÍ' : 'NO'}`);
        
        const waitTime = apiOptimizer.getWaitTime();
        console.log(`   Tiempo de espera: ${waitTime}ms`);
        
        console.log('\n🎯 Probando generación simple...');
        const system = new V4UltraHybridSystem();
        
        // Test muy básico
        const startTime = Date.now();
        const result = await system.generateWorkflow('Crear webhook simple', {
            mode: 'efficiency',
            skipDetailedValidation: true,
            maxNodes: 3
        });
        const endTime = Date.now();
        
        console.log(`✅ Generación completada en ${endTime - startTime}ms`);
        console.log(`   Éxito: ${result.success}`);
        console.log(`   Calidad: ${result.quality || 'N/A'}`);
        console.log(`   Nodos: ${result.workflow?.nodes?.length || 0}`);
        console.log(`   Método: ${result.method || 'N/A'}`);
        
        console.log('\n📊 Estado final del API Optimizer:');
        const finalStats = apiOptimizer.getUsageStats();
        console.log(`   📞 Calls realizadas: ${finalStats.minute.used}/${finalStats.minute.limit}`);
        console.log(`   💾 Cache size: ${finalStats.cache.size}`);
        console.log(`   📈 Hit rate estimado: ${Math.round(finalStats.cache.hitRate * 100)}%`);
        
        const callsUsed = finalStats.minute.used - initialStats.minute.used;
        console.log(`\n🎯 RESULTADO: ${callsUsed} API calls utilizadas`);
        
        if (callsUsed <= 2) {
            console.log('🌟 EXCELENTE: Sistema ultra-eficiente');
        } else if (callsUsed <= 5) {
            console.log('🟢 BUENO: Sistema eficiente');
        } else {
            console.log('🟡 MODERADO: Puede mejorar');
        }
        
        return { success: true, callsUsed, processingTime: endTime - startTime };
        
    } catch (error) {
        console.error('❌ Error en test:', error.message);
        return { success: false, error: error.message };
    }
}

// Ejecutar test
runQuickTest()
    .then(result => {
        console.log('\n✅ Test completado');
        if (result.success) {
            console.log(`🎯 Calls usadas: ${result.callsUsed}, Tiempo: ${result.processingTime}ms`);
        }
    })
    .catch(error => {
        console.error('💥 Error global:', error.message);
    });
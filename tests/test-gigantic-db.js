// 🧪 TEST PARA BASE DE DATOS GIGANTE
// Verificar que el agente optimizado funcione con 2,714+ workflows

import WorkflowVectorSearchEngine from './SISTEMA PRINCIPAL/workflow-vector-search-engine-esm.js';

async function testGiganticDatabase() {
    console.log('🧪 ================================================');
    console.log('🧪 TESTING BASE DE DATOS GIGANTE');
    console.log('🧪 ================================================\n');
    
    try {
        // 1. Inicializar el motor optimizado
        console.log('⚙️ Inicializando WorkflowVectorSearchEngine optimizado...');
        const searchEngine = new WorkflowVectorSearchEngine();
        
        // 2. Verificar estructura de datos
        console.log('\n📊 VERIFICACIÓN DE ESTRUCTURA DE DATOS:');
        const initResult = await searchEngine.initialize();
        
        if (initResult) {
            console.log('✅ Motor inicializado correctamente');
            console.log(`📈 Métricas: ${searchEngine.metrics.totalWorkflows} workflows disponibles`);
            
            // 3. Verificar categorías cargadas
            console.log('\n📁 CATEGORÍAS DISPONIBLES:');
            for (const [categoryName, workflows] of searchEngine.vectorizedData) {
                console.log(`  📂 ${categoryName}: ${workflows.length} workflows`);
            }
            
            // 4. TEST RÁPIDO: Buscar "telegram"
            console.log('\n🔍 TEST RÁPIDO - Buscar "telegram":');
            const quickResults = await searchEngine.searchSimilarWorkflows('telegram bot automation');
            console.log(`🎯 Resultados encontrados: ${quickResults.length}`);
            
            if (quickResults.length > 0) {
                console.log('\n📋 PRIMEROS 3 RESULTADOS:');
                quickResults.slice(0, 3).forEach((result, index) => {
                    console.log(`${index + 1}. ${result.workflow?.name || result.workflow?.workflow_info?.file_name || 'Sin nombre'}`);
                    console.log(`   📊 Similitud: ${(result.similarity * 100).toFixed(1)}%`);
                    console.log(`   📁 Categoría: ${result.category}`);
                    console.log(`   🔧 Nodos: ${result.metadata?.nodeCount || 'N/A'}`);
                    console.log('');
                });
                
                return { success: true, totalWorkflows: searchEngine.metrics.totalWorkflows, testResults: quickResults.length };
            } else {
                console.log('⚠️ No se encontraron resultados para la prueba');
                return { success: false, error: 'No results found' };
            }
            
        } else {
            console.log('❌ Error inicializando el motor');
            return { success: false, error: 'Initialization failed' };
        }
        
    } catch (error) {
        console.error('💥 Error durante el test:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar test
testGiganticDatabase().then(result => {
    console.log('\n🏁 ================================================');
    console.log('🏁 RESULTADO FINAL DEL TEST');
    console.log('🏁 ================================================');
    
    if (result.success) {
        console.log('✅ TEST EXITOSO');
        console.log(`📊 Base de datos: ${result.totalWorkflows} workflows`);
        console.log(`🔍 Resultados de prueba: ${result.testResults}`);
        console.log('🚀 El agente está listo para la base de datos gigante!');
    } else {
        console.log('❌ TEST FALLIDO');
        console.log(`💥 Error: ${result.error}`);
    }
}).catch(error => {
    console.error('💥 Error crítico:', error);
});
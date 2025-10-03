/**
 * ✅ TEST SIMPLE - VERIFICACIÓN DE IDENTIFICADORES DEL AGENTE
 * 
 * Este test valida que el WorkflowVectorSearchEngine proporciona
 * correctamente los identificadores específicos (fileName, id, name)
 * que necesita el Extension Server para inyectar workflows específicos
 * en el system prompt.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import WorkflowVectorSearchEngine from './SISTEMA PRINCIPAL/workflow-vector-search-engine-esm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testIdentificacion() {
    console.log('🧪 TEST SIMPLE - VERIFICACIÓN DE IDENTIFICADORES');
    console.log('================================================');
    
    // 1. Inicializar el motor de búsqueda
    const searchEngine = new WorkflowVectorSearchEngine({
        vectorizedPath: path.join(__dirname, 'Workflows Vectorizados Oficial')
    });
    
    console.log('📊 Inicializando motor de búsqueda...');
    await searchEngine.initialize();
    
    // 2. Query simple para obtener algunos workflows
    const query = "telegram automation workflow";
    
    console.log(`🔍 Buscando workflows con query: "${query}"`);
    const results = await searchEngine.searchSimilarWorkflows(query, {
        limit: 5,  // Solo 5 resultados para hacer el test más claro
        minSimilarity: 0.25
    });
    
    console.log(`\n✅ ${results.length} workflows encontrados`);
    console.log('==============================================');
    
    // 3. Verificar identificadores de cada resultado
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        
        console.log(`\n📄 WORKFLOW ${i + 1}/${results.length}:`);
        console.log(`   📋 category: "${result.category}"`);
        console.log(`   📁 fileName: "${result.fileName}"`);
        console.log(`   🆔 id: "${result.id}"`);
        console.log(`   📝 name: "${result.name}"`);
        console.log(`   🎯 similarity: ${result.similarity.toFixed(3)}`);
        
        // Verificar que los campos críticos están presentes
        const hasFileName = result.fileName && result.fileName !== '';
        const hasId = result.id && result.id !== '';
        const hasName = result.name && result.name !== 'Sin nombre';
        
        if (hasFileName && hasId && hasName) {
            console.log(`   ✅ IDENTIFICACIÓN COMPLETA`);
        } else {
            console.log(`   ❌ IDENTIFICACIÓN INCOMPLETA:`);
            if (!hasFileName) console.log(`      - Falta fileName`);
            if (!hasId) console.log(`      - Falta id`);
            if (!hasName) console.log(`      - Falta name`);
        }
        
        // Mostrar información adicional del workflow interno
        if (result.workflow) {
            console.log(`   🔧 workflow.fileName: "${result.workflow.fileName || 'N/A'}"`);
            console.log(`   🔧 workflow.id: "${result.workflow.id || 'N/A'}"`);
            console.log(`   🔧 workflow.name: "${result.workflow.name || 'N/A'}"`);
        }
    }
    
    // 4. Estadísticas finales
    console.log('\n📊 ESTADÍSTICAS DE IDENTIFICACIÓN:');
    console.log('================================');
    
    const totalWorkflows = results.length;
    const correctIdentifications = results.filter(r => 
        r.fileName && r.fileName !== '' &&
        r.id && r.id !== '' &&
        r.name && r.name !== 'Sin nombre'
    ).length;
    
    const precision = totalWorkflows > 0 ? (correctIdentifications / totalWorkflows * 100) : 0;
    
    console.log(`   📄 Total workflows: ${totalWorkflows}`);
    console.log(`   ✅ Identificaciones correctas: ${correctIdentifications}`);
    console.log(`   📊 Precisión: ${precision.toFixed(1)}%`);
    
    if (precision >= 90) {
        console.log(`   🎉 EXCELENTE - Extension Server puede usar estos workflows`);
    } else if (precision >= 70) {
        console.log(`   ⚠️  BUENO - Extension Server puede usar la mayoría de workflows`);
    } else if (precision >= 50) {
        console.log(`   🔴 REGULAR - Extension Server tendrá problemas`);
    } else {
        console.log(`   💥 CRÍTICO - Extension Server no puede usar estos workflows`);
    }
    
    console.log('\n🏁 Test completado');
}

// Ejecutar el test
testIdentificacion().catch(console.error);
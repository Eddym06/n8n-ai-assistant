const WorkflowSearchAgent = require('./workflow-search-agent-new.cjs');

async function testSearches() {
  console.log('🔍 Probando el nuevo agente de búsqueda con base de datos real...\n');
  
  const agent = new WorkflowSearchAgent();
  
  const searches = [
    'gmail automatización',
    'slack notificaciones',
    'procesar datos excel',
    'webhook api rest',
    'programar tareas automáticas'
  ];

  for (const query of searches) {
    console.log(`\n📍 Búsqueda: "${query}"`);
    console.log('─'.repeat(50));
    
    try {
      const result = await agent.search(query, { limit: 3 });
      
      console.log(`✅ Encontrados ${result.results.length} de ${result.totalResults} resultados en ${result.searchTime}ms`);
      console.log(`📊 Fuente: ${result.databaseUsed ? 'Base de datos real' : 'Ejemplos curados'}`);
      
      result.results.forEach((workflow, i) => {
        console.log(`\n  ${i + 1}. ${workflow.title}`);
        console.log(`     📝 ${workflow.description}`);
        console.log(`     🏷️  Categoría: ${workflow.category} | Complejidad: ${workflow.complexity}`);
        console.log(`     🔧 Servicios: ${workflow.services.slice(0, 3).join(', ')}`);
        console.log(`     🎯 Relevancia: ${(workflow.finalScore || workflow.relevanceScore || 0).toFixed(2)}`);
        if (workflow.matchType) {
          console.log(`     🎲 Match: ${workflow.matchType}`);
        }
      });
      
    } catch (error) {
      console.error(`❌ Error en búsqueda: ${error.message}`);
    }
  }

  // Probar búsqueda de workflows similares (API del servidor)
  console.log('\n\n🔍 Probando búsqueda de workflows similares...');
  console.log('─'.repeat(50));
  
  try {
    const similarWorkflows = await agent.searchSimilarWorkflows(
      'Necesito crear un workflow que procese emails de Gmail y envíe notificaciones a Slack'
    );
    
    console.log(`✅ Encontrados ${similarWorkflows.length} workflows similares`);
    
    similarWorkflows.forEach((item, i) => {
      console.log(`\n  ${i + 1}. ${item.workflow.name || item.workflow.id}`);
      console.log(`     📝 ${item.metadata.description}`);
      console.log(`     🎯 Similitud: ${item.similarity.toFixed(2)}`);
      console.log(`     🏷️  Tags: ${item.metadata.tags.slice(0, 3).join(', ')}`);
    });
    
  } catch (error) {
    console.error(`❌ Error en búsqueda similar: ${error.message}`);
  }
}

testSearches().catch(console.error);
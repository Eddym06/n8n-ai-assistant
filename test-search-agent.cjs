const WorkflowSearchAgent = require('./workflow-search-agent-new.cjs');

console.log('Tipo del módulo:', typeof WorkflowSearchAgent);
console.log('¿Es función?:', typeof WorkflowSearchAgent === 'function');

if (typeof WorkflowSearchAgent === 'function') {
  console.log('✅ Creando instancia...');
  const agent = new WorkflowSearchAgent();
  console.log('✅ Instancia creada exitosamente');
  
  // Probar búsqueda
  agent.search('email automation').then(result => {
    console.log('✅ Búsqueda exitosa');
    console.log('Query:', result.query);
    console.log('Resultados:', result.results.length);
    console.log('Base de datos:', result.databaseUsed ? 'Real' : 'Fallback');
    
    if (result.results.length > 0) {
      console.log('Primer resultado:', result.results[0].title);
    }
  }).catch(err => {
    console.error('❌ Error en búsqueda:', err.message);
  });
} else {
  console.error('❌ El módulo no es una función constructora');
  console.log('Contenido del módulo:', WorkflowSearchAgent);
}
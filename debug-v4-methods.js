// Test específico para identificar el método que falta en PromptEnhancementAgentV4
console.log('🔍 DEBUG: PromptEnhancementAgentV4 Method Check');
console.log('==============================================');

// Crear una instancia mock para probar
const mockMainAgent = {
  generateGeminiContent: () => Promise.resolve('mock response'),
  // otros métodos que puedan ser necesarios...
};

try {
  // Importar la clase
  const PromptEnhancementAgentV4 = (await import('./prompt-enhancement-agent-v4.js')).default;
  
  console.log('✅ Clase importada correctamente');
  
  // Lista de métodos que intenta hacer bind
  const methodsToCheck = [
    'performLogicalDeconstruction',
    'generateDAGPlan', 
    'performNodeMapping',
    'enhanceClarity',
    'enhanceSpecificity', 
    'enhanceStructure',
    'enhanceFunctionalWorkflow',
    'generateGeminiEnhancements'
  ];
  
  console.log('\n📋 Verificando métodos requeridos:');
  
  // Crear instancia temporal para verificar métodos
  const prototype = PromptEnhancementAgentV4.prototype;
  
  for (const methodName of methodsToCheck) {
    const exists = typeof prototype[methodName] === 'function';
    console.log(`   ${exists ? '✅' : '❌'} ${methodName}: ${exists ? 'EXISTS' : 'MISSING'}`);
    
    if (!exists) {
      console.log(`      🚨 MÉTODO FALTANTE: ${methodName}`);
    }
  }
  
  console.log('\n🔧 Intentando crear instancia con mock...');
  
  try {
    // Test de creación con mock básico
    const instance = new PromptEnhancementAgentV4(mockMainAgent);
    console.log('✅ Instancia creada exitosamente');
  } catch (constructorError) {
    console.error(`❌ Error en constructor: ${constructorError.message}`);
    console.error(`   En línea: ${constructorError.stack?.split('\n')[1]}`);
  }
  
} catch (importError) {
  console.error(`❌ Error importando clase: ${importError.message}`);
}
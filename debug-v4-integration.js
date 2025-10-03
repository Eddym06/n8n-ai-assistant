// Test específico para verificar la carga de V4 Integration
import { config } from 'dotenv';
config();

console.log('🔍 TEST DE V4 INTEGRATION');
console.log('==========================');

console.log('\n1. VERIFICACIÓN DE VARIABLES DE ENTORNO:');
console.log(`   FORCE_V4: "${process.env.FORCE_V4}"`);
console.log(`   ENABLE_V4_ULTRA: "${process.env.ENABLE_V4_ULTRA}"`);
console.log(`   v4Enabled logic: ${process.env.ENABLE_V4_ULTRA !== 'false'}`);

console.log('\n2. TEST DE IMPORTACIÓN V4:');
try {
  const { integrateV4Ultra } = await import('./extension-server-v4-integration.js');
  console.log('✅ integrateV4Ultra importado correctamente');
  console.log(`   Tipo: ${typeof integrateV4Ultra}`);
  
  if (typeof integrateV4Ultra === 'function') {
    console.log('\n3. TEST DE CREACIÓN DE INSTANCIA V4:');
    
    // Crear un mock basic del assistant para probar
    const mockAssistant = {
      getCurrentWorkflowJSON: () => ({}),
      searchAgent: { findSimilarWorkflows: () => [], getCuratedExamples: () => [] },
      memoryAgent: { getMemoryContext: () => '' },
      promptEnhancementAgent: { enhancePrompt: (p) => p },
      autocorrector: { repairJSON: (j) => j },
      repositioner: { optimizeLayout: (w) => w },
      intelligent: { positionNodes: (w) => w }
    };
    
    try {
      const v4Integration = integrateV4Ultra(mockAssistant);
      console.log('✅ V4 Integration creado exitosamente');
      console.log(`   Tipo: ${typeof v4Integration}`);
      console.log(`   Tiene processUserPromptV4Ultra: ${typeof v4Integration?.processUserPromptV4Ultra}`);
      
      if (v4Integration && typeof v4Integration.processUserPromptV4Ultra === 'function') {
        console.log('\n4. TEST DE MÉTODO PRINCIPAL:');
        console.log('✅ Método processUserPromptV4Ultra disponible');
        
        // Test básico (no llamar realmente, solo verificar estructura)
        console.log('   📋 Estructura del V4 Integration verificada correctamente');
      } else {
        console.log('❌ processUserPromptV4Ultra no es una función válida');
      }
      
    } catch (integrationError) {
      console.error('❌ Error creando V4 Integration:', integrationError.message);
      console.error('   Stack:', integrationError.stack?.split('\n').slice(0, 3).join('\n'));
    }
    
  } else {
    console.log('❌ integrateV4Ultra no es una función');
  }
  
} catch (importError) {
  console.error('❌ Error importando V4 Integration:', importError.message);
  console.error('   Stack:', importError.stack?.split('\n').slice(0, 3).join('\n'));
  
  // Verificar si el archivo existe
  try {
    const fs = await import('fs');
    const exists = fs.existsSync('./extension-server-v4-integration.js');
    console.log(`   📁 Archivo existe: ${exists}`);
  } catch (fsError) {
    console.log('   📁 No se pudo verificar la existencia del archivo');
  }
}

console.log('\n5. RECOMENDACIONES:');
console.log('   📝 Si V4 Integration falla, el sistema caerá en processUserPromptV2');
console.log('   📝 processUserPromptV2 NO llama a Gemini (solo usa workflows de referencia)');
console.log('   📝 Hay que asegurar que V4 Integration funcione para que haga llamadas reales a Gemini');
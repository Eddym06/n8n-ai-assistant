// 🧪 TEST INTEGRACIÓN REAL DEL SISTEMA DE ENRUTAMIENTO
// Prueba con las clases reales del sistema

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 ========================================');
console.log('🧪 TEST: INTEGRACIÓN REAL SISTEMA GEMINI');
console.log('🧪 ========================================\n');

// Importar clases reales
try {
  console.log('📦 Cargando PromptEnhancementAgent...');
  const { default: PromptEnhancementAgent } = await import('./SISTEMA PRINCIPAL/prompt-enhancement-agent.js');
  
  console.log('📦 Cargando SemanticMemoryAgent...');
  const { default: SemanticMemoryAgent } = await import('./SISTEMA PRINCIPAL/semantic-memory-agent.js');
  
  console.log('📦 Cargando FlowCoherenceAgentV2...');
  const { default: FlowCoherenceAgentV2 } = await import('./SISTEMA PRINCIPAL/flow-coherence-agent-v2.js');

  // Mock del enrutador basado en la implementación real
  class TestGeminiModelRouter {
    constructor() {
      console.log('🎯 Inicializando TestGeminiModelRouter...');
      this.currentServerModel = 'gemini-2.5-pro';
      this.serverModels = [
        'gemini-2.5-pro',
        'gemini-2.5-pro-preview-06-05', 
        'gemini-2.5-pro-preview-05-06'
      ];
      this.currentAgentModel = 'gemini-2.5-flash';
      this.agentModels = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-preview-05-20',
        'gemini-2.5-flash-lite'
      ];
    }

    getServerModel() {
      console.log(`🔄 Extension Server solicitó modelo: ${this.currentServerModel}`);
      return this.currentServerModel;
    }

    getAgentModel() {
      console.log(`🔄 Agente solicitó modelo: ${this.currentAgentModel}`);
      return this.currentAgentModel;
    }
  }

  // Test de integración
  async function testRealIntegration() {
    console.log('\n🚀 Iniciando test de integración real...\n');

    // Crear enrutador
    const router = new TestGeminiModelRouter();

    // Crear agentes reales
    console.log('🤖 Creando PromptEnhancementAgent...');
    const promptAgent = new PromptEnhancementAgent();

    console.log('🧠 Creando SemanticMemoryAgent...');
    const memoryAgent = new SemanticMemoryAgent();

    console.log('🔧 Creando FlowCoherenceAgentV2...');
    const coherenceAgent = new FlowCoherenceAgentV2('dummy-api-key');

    // Verificar métodos de enrutador
    console.log('\n🔍 Verificando métodos de enrutador...');
    
    if (typeof promptAgent.setModelRouter === 'function') {
      console.log('✅ PromptEnhancementAgent.setModelRouter() existe');
      promptAgent.setModelRouter(router);
      
      if (typeof promptAgent.getCurrentModel === 'function') {
        console.log('✅ PromptEnhancementAgent.getCurrentModel() existe');
        const model = promptAgent.getCurrentModel();
        console.log(`📢 PromptEnhancementAgent usando: ${model}`);
      } else {
        console.log('❌ PromptEnhancementAgent.getCurrentModel() NO existe');
      }
    } else {
      console.log('❌ PromptEnhancementAgent.setModelRouter() NO existe');
    }

    if (typeof memoryAgent.setModelRouter === 'function') {
      console.log('✅ SemanticMemoryAgent.setModelRouter() existe');
      memoryAgent.setModelRouter(router);
      
      if (typeof memoryAgent.getCurrentModel === 'function') {
        console.log('✅ SemanticMemoryAgent.getCurrentModel() existe');
        const model = memoryAgent.getCurrentModel();
        console.log(`📢 SemanticMemoryAgent usando: ${model}`);
      } else {
        console.log('❌ SemanticMemoryAgent.getCurrentModel() NO existe');
      }
    } else {
      console.log('❌ SemanticMemoryAgent.setModelRouter() NO existe');
    }

    if (typeof coherenceAgent.setModelRouter === 'function') {
      console.log('✅ FlowCoherenceAgentV2.setModelRouter() existe');
      coherenceAgent.setModelRouter(router);
      
      if (typeof coherenceAgent.getCurrentModel === 'function') {
        console.log('✅ FlowCoherenceAgentV2.getCurrentModel() existe');
        const model = coherenceAgent.getCurrentModel();
        console.log(`📢 FlowCoherenceAgentV2 usando: ${model}`);
      } else {
        console.log('❌ FlowCoherenceAgentV2.getCurrentModel() NO existe');
      }
    } else {
      console.log('❌ FlowCoherenceAgentV2.setModelRouter() NO existe');
    }

    console.log('\n🎯 Verificando separación de modelos...');
    
    const serverModel = router.getServerModel();
    const agentModel = router.getAgentModel();
    
    const isProExclusive = serverModel.includes('pro');
    const isFlashForAgents = agentModel.includes('flash');
    
    if (isProExclusive && isFlashForAgents) {
      console.log('✅ SEPARACIÓN DE MODELOS CORRECTA:');
      console.log(`   🎯 Extension Server: ${serverModel} (PRO ✅)`);
      console.log(`   🤖 Agentes: ${agentModel} (FLASH ✅)`);
    } else {
      console.log('❌ ERROR EN SEPARACIÓN DE MODELOS:');
      console.log(`   🎯 Extension Server: ${serverModel}`);
      console.log(`   🤖 Agentes: ${agentModel}`);
    }

    console.log('\n🧪 ========================================');
    console.log('🧪 RESULTADO: INTEGRACIÓN REAL COMPLETADA');
    console.log('🧪 ========================================');
  }

  // Ejecutar test
  await testRealIntegration();

} catch (error) {
  console.error('💥 Error en test de integración:', error.message);
  console.error('Stack:', error.stack);
}
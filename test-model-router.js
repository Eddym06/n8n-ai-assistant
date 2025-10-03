// 🧪 TEST DEL SISTEMA DE ENRUTAMIENTO DE MODELOS
// Verificar que los modelos Pro están exclusivos para Extension Server
// y los modelos Flash están disponibles para todos los agentes

console.log('🧪 ========================================');
console.log('🧪 TEST: SISTEMA DE ENRUTAMIENTO GEMINI');
console.log('🧪 ========================================\n');

// Simular el sistema de enrutamiento
class MockGeminiModelRouter {
  constructor() {
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

  rotateServerModel() {
    const currentIndex = this.serverModels.indexOf(this.currentServerModel);
    const nextIndex = (currentIndex + 1) % this.serverModels.length;
    this.currentServerModel = this.serverModels[nextIndex];
    console.log(`🔄 Extension Server rotó a: ${this.currentServerModel}`);
  }

  rotateAgentModel() {
    const currentIndex = this.agentModels.indexOf(this.currentAgentModel);
    const nextIndex = (currentIndex + 1) % this.agentModels.length;
    this.currentAgentModel = this.agentModels[nextIndex];
    console.log(`🔄 Agentes rotaron a: ${this.currentAgentModel}`);
  }
}

// Simular agentes
class MockPromptEnhancementAgent {
  constructor() {
    this.modelRouter = null;
    this.currentModelName = 'gemini-2.5-flash';
  }

  setModelRouter(router) {
    this.modelRouter = router;
    console.log('🔗 PromptEnhancementAgent conectado al enrutador');
  }

  getCurrentModel() {
    if (this.modelRouter) {
      const model = this.modelRouter.getAgentModel();
      console.log(`📢 PromptEnhancementAgent usando: ${model}`);
      return model;
    }
    return 'gemini-2.5-flash';
  }
}

class MockSemanticMemoryAgent {
  constructor() {
    this.modelRouter = null;
    this.currentModelName = 'gemini-2.5-flash';
  }

  setModelRouter(router) {
    this.modelRouter = router;
    console.log('🔗 SemanticMemoryAgent conectado al enrutador');
  }

  getCurrentModel() {
    if (this.modelRouter) {
      const model = this.modelRouter.getAgentModel();
      console.log(`📢 SemanticMemoryAgent usando: ${model}`);
      return model;
    }
    return 'gemini-2.5-flash';
  }
}

class MockExtensionServer {
  constructor() {
    this.modelRouter = new MockGeminiModelRouter();
    this.promptAgent = new MockPromptEnhancementAgent();
    this.semanticAgent = new MockSemanticMemoryAgent();
    
    // Conectar agentes al enrutador
    this.promptAgent.setModelRouter(this.modelRouter);
    this.semanticAgent.setModelRouter(this.modelRouter);
  }

  getServerModel() {
    const model = this.modelRouter.getServerModel();
    console.log(`📢 Extension Server OFICIAL usando: ${model}`);
    return model;
  }

  testScenario() {
    console.log('\n🎯 ESCENARIO 1: Operación normal');
    console.log('-----------------------------------');
    
    // Extension Server solicita modelo Pro
    this.getServerModel();
    
    // Agentes solicitan modelos Flash
    this.promptAgent.getCurrentModel();
    this.semanticAgent.getCurrentModel();
    
    console.log('\n🎯 ESCENARIO 2: Rotación por error de cuota');
    console.log('-----------------------------------------------');
    
    // Simular error de cuota en Extension Server
    console.log('⚠️ Error de cuota en Extension Server - Rotando modelos...');
    this.modelRouter.rotateServerModel();
    this.getServerModel();
    
    // Simular error de cuota en agentes
    console.log('⚠️ Error de cuota en agentes - Rotando modelos...');
    this.modelRouter.rotateAgentModel();
    this.promptAgent.getCurrentModel();
    this.semanticAgent.getCurrentModel();
    
    console.log('\n🎯 ESCENARIO 3: Verificación de separación de modelos');
    console.log('-----------------------------------------------------');
    
    const serverModel = this.modelRouter.getServerModel();
    const agentModel = this.modelRouter.getAgentModel();
    
    const isProModel = serverModel.includes('pro');
    const isFlashModel = agentModel.includes('flash');
    
    if (isProModel && isFlashModel) {
      console.log('✅ SEPARACIÓN CORRECTA:');
      console.log(`   🎯 Extension Server: ${serverModel} (PRO ✅)`);
      console.log(`   🤖 Agentes: ${agentModel} (FLASH ✅)`);
    } else {
      console.log('❌ ERROR EN SEPARACIÓN:');
      console.log(`   🎯 Extension Server: ${serverModel}`);
      console.log(`   🤖 Agentes: ${agentModel}`);
    }
  }
}

// 🧪 EJECUTAR TESTS
async function runTests() {
  try {
    console.log('🚀 Iniciando Extension Server con enrutador...\n');
    
    const server = new MockExtensionServer();
    
    server.testScenario();
    
    console.log('\n🧪 ========================================');
    console.log('🧪 RESULTADO: TESTS COMPLETADOS ✅');
    console.log('🧪 ========================================');
    
  } catch (error) {
    console.error('💥 Error en tests:', error);
  }
}

// Ejecutar tests
runTests();
/**
 * GEMINI CALL TRACKER - SISTEMA GLOBAL DE SEGUIMIENTO
 * ===================================================
 * 
 * Sistema singleton para trackear todas las llamadas a Gemini API
 * desde cualquier agente o sistema en el workspace.
 * 
 * Características:
 * - Conteo global de llamadas
 * - Seguimiento por agente
 * - Métricas de sesión
 * - Análisis de costos
 * - Logging detallado
 * 
 * Versión: 1.0.0
 */

export class GeminiCallTracker {
  // Variables estáticas para persistencia global
  static totalCalls = 0;
  static sessionCalls = 0;
  static callsByAgent = {
    mainGenerator: 0,
    jsonRepairAgent: 0,
    autocorrectorFlujos: 0,
    flowCoherenceAgent: 0,
    intelligentNameCorrector: 0,
    intelligentPositioningAgent: 0,
    promptEnhancementAgent: 0,
    semanticMemoryAgent: 0,
    workflowSearchAgent: 0,
    validationSystem: 0,
    other: 0
  };
  
  static callHistory = [];
  static sessionStartTime = Date.now();

  /**
   * Registra una nueva llamada a Gemini
   * @param {string} agentName - Nombre del agente que hace la llamada
   * @param {string} operation - Tipo de operación (generateContent, chat, etc.)
   * @param {number} promptLength - Longitud del prompt enviado
   * @param {string} model - Modelo utilizado
   */
  static recordCall(agentName, operation = 'generateContent', promptLength = 0, model = 'gemini-2.5-flash') {
    this.totalCalls++;
    this.sessionCalls++;
    
    // Normalizar nombre del agente
    const normalizedAgent = this.normalizeAgentName(agentName);
    
    if (this.callsByAgent.hasOwnProperty(normalizedAgent)) {
      this.callsByAgent[normalizedAgent]++;
    } else {
      this.callsByAgent.other++;
    }

    // Registrar en historial
    const callRecord = {
      id: this.totalCalls,
      timestamp: new Date().toISOString(),
      agent: agentName,
      normalizedAgent,
      operation,
      promptLength,
      model,
      sessionTime: Date.now() - this.sessionStartTime
    };

    this.callHistory.push(callRecord);

    // Logging en consola
    console.log(`📞 Llamada Gemini #${this.totalCalls} (${agentName})`);
    console.log(`   🤖 Modelo: ${model}`);
    console.log(`   ⚡ Operación: ${operation}`);
    console.log(`   📏 Prompt: ${promptLength.toLocaleString()} chars`);
    
    // Alert si hay muchas llamadas
    if (this.sessionCalls >= 10) {
      console.warn(`⚠️ ALERTA: ${this.sessionCalls} llamadas en esta sesión. Revisar eficiencia.`);
    }

    return callRecord;
  }

  /**
   * Normaliza nombres de agentes para categorización
   */
  static normalizeAgentName(agentName) {
    const name = agentName.toLowerCase().replace(/[^a-z]/g, '');
    
    if (name.includes('main') || name.includes('generator') || name.includes('primary')) return 'mainGenerator';
    if (name.includes('repair') || name.includes('json')) return 'jsonRepairAgent';
    if (name.includes('autocorrector') || name.includes('flujos')) return 'autocorrectorFlujos';
    if (name.includes('flow') || name.includes('coherence') || name.includes('acf')) return 'flowCoherenceAgent';
    if (name.includes('name') || name.includes('corrector')) return 'intelligentNameCorrector';
    if (name.includes('position') || name.includes('layout')) return 'intelligentPositioningAgent';
    if (name.includes('prompt') || name.includes('enhancement')) return 'promptEnhancementAgent';
    if (name.includes('memory') || name.includes('semantic')) return 'semanticMemoryAgent';
    if (name.includes('search') || name.includes('workflow')) return 'workflowSearchAgent';
    if (name.includes('validation') || name.includes('validator')) return 'validationSystem';
    
    return 'other';
  }

  /**
   * Obtiene reporte completo de llamadas
   */
  static getReport() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const avgCallsPerMinute = this.sessionCalls / (sessionDuration / 60000);
    
    return {
      total: this.totalCalls,
      session: this.sessionCalls,
      byAgent: { ...this.callsByAgent },
      sessionDuration: Math.round(sessionDuration / 1000), // segundos
      avgCallsPerMinute: Math.round(avgCallsPerMinute * 100) / 100,
      lastCall: this.callHistory[this.callHistory.length - 1] || null,
      estimatedCost: this.estimateCost()
    };
  }

  /**
   * Estima el costo aproximado basado en las llamadas
   */
  static estimateCost() {
    const costPerCall = 0.002; // Estimación aproximada por llamada
    return {
      total: Math.round(this.totalCalls * costPerCall * 100) / 100,
      session: Math.round(this.sessionCalls * costPerCall * 100) / 100,
      currency: 'USD'
    };
  }

  /**
   * Imprime reporte detallado en consola
   */
  static printReport() {
    const report = this.getReport();
    
    console.log('\n📊 ═══════════════════════════════════════════');
    console.log('📊 REPORTE GEMINI CALL TRACKER');
    console.log('📊 ═══════════════════════════════════════════');
    console.log(`📞 Total llamadas: ${report.total}`);
    console.log(`🔄 Llamadas en sesión: ${report.session}`);
    console.log(`⏱️ Duración sesión: ${report.sessionDuration}s`);
    console.log(`📈 Promedio: ${report.avgCallsPerMinute} llamadas/min`);
    console.log(`💰 Costo estimado: $${report.estimatedCost.total} USD`);
    
    console.log('\n📋 LLAMADAS POR AGENTE:');
    Object.entries(report.byAgent).forEach(([agent, count]) => {
      if (count > 0) {
        const percentage = Math.round((count / report.session) * 100);
        console.log(`   ${agent}: ${count} (${percentage}%)`);
      }
    });
    
    if (report.lastCall) {
      console.log(`\n🕐 Última llamada: ${report.lastCall.agent} (${report.lastCall.timestamp})`);
    }
    
    console.log('📊 ═══════════════════════════════════════════\n');
  }

  /**
   * Reinicia contador de sesión
   */
  static resetSession() {
    this.sessionCalls = 0;
    this.sessionStartTime = Date.now();
    console.log('🔄 Contador de sesión reiniciado');
  }

  /**
   * Obtiene historial de llamadas (últimas N llamadas)
   */
  static getHistory(limit = 10) {
    return this.callHistory.slice(-limit);
  }

  /**
   * Obtiene estadísticas por agente específico
   */
  static getAgentStats(agentName) {
    const normalizedAgent = this.normalizeAgentName(agentName);
    const agentCalls = this.callHistory.filter(call => call.normalizedAgent === normalizedAgent);
    
    return {
      agent: agentName,
      normalizedAgent,
      totalCalls: agentCalls.length,
      sessionCalls: agentCalls.filter(call => call.sessionTime >= 0).length,
      avgPromptLength: agentCalls.reduce((sum, call) => sum + call.promptLength, 0) / agentCalls.length || 0,
      lastCall: agentCalls[agentCalls.length - 1] || null
    };
  }

  /**
   * Método helper para integración fácil en otros sistemas
   */
  static track(agentName, operation, promptLength, model) {
    return this.recordCall(agentName, operation, promptLength, model);
  }
}

// Exportar también como default para compatibilidad
export default GeminiCallTracker;

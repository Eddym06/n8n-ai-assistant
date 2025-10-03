// 🔍 AGENTE DE VALIDACIÓN INTELIGENTE PARA WORKFLOWS N8N
// Versión: 2.0 - Sistema avanzado de análisis de coherencia y conectividad

export default class IntelligentWorkflowValidator {
  constructor() {
    this.validationRules = this.initializeValidationRules();
    this.nodeTypeRequirements = this.initializeNodeTypeRequirements();
    this.connectionPatterns = this.initializeConnectionPatterns();
  }

  // 🎯 VALIDACIÓN PRINCIPAL DE WORKFLOW
  async validateWorkflow(workflowData, originalPrompt = '') {
    console.log('🔍 Iniciando validación inteligente de workflow...');
    
    const results = {
      isValid: true,
      criticalErrors: [],
      warnings: [],
      suggestions: [],
      score: 0,
      analysisDetails: {}
    };

    try {
      // 1. Validaciones críticas
      await this.validateStructure(workflowData, results);
      await this.validateConnectivity(workflowData, results);
      await this.validateNodeConfiguration(workflowData, results);
      await this.validateLogicalFlow(workflowData, results);
      
      // 2. Análisis de coherencia
      await this.analyzeCoherence(workflowData, originalPrompt, results);
      
      // 3. Cálculo de score final
      this.calculateQualityScore(results);
      
      console.log(`✅ Validación completada. Score: ${results.score}/100`);
      return results;
      
    } catch (error) {
      console.error('❌ Error en validación:', error);
      results.isValid = false;
      results.criticalErrors.push(`Error de validación: ${error.message}`);
      return results;
    }
  }

  // 🏗️ VALIDACIÓN DE ESTRUCTURA BÁSICA
  async validateStructure(workflowData, results) {
    console.log('🔧 Validando estructura básica...');
    
    // Verificar propiedades básicas
    if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
      results.criticalErrors.push('Falta array de nodos válido');
      results.isValid = false;
      return;
    }

    if (!workflowData.connections || typeof workflowData.connections !== 'object') {
      results.criticalErrors.push('Falta objeto de conexiones válido');
      results.isValid = false;
      return;
    }

    // Validar nodos individuales
    for (const node of workflowData.nodes) {
      if (!node.id || !node.name || !node.type) {
        results.criticalErrors.push(`Nodo incompleto: falta id, name o type`);
        results.isValid = false;
      }

      if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
        results.criticalErrors.push(`Nodo ${node.name}: posición inválida o faltante`);
        results.isValid = false;
      }

      // Validar tipos de nodos conocidos
      if (!this.isValidNodeType(node.type)) {
        results.warnings.push(`Nodo ${node.name}: tipo '${node.type}' no reconocido`);
      }
    }

    results.analysisDetails.structureValid = results.criticalErrors.length === 0;
  }

  // 🔗 VALIDACIÓN DE CONECTIVIDAD
  async validateConnectivity(workflowData, results) {
    console.log('🔗 Validando conectividad...');
    
    const nodeNames = workflowData.nodes.map(n => n.name);
    const nodeTypes = new Map(workflowData.nodes.map(n => [n.name, n.type]));
    const connections = workflowData.connections;
    
    // 1. Verificar nodos huérfanos
    const connectedNodes = new Set();
    
    for (const [sourceName, sourceConnections] of Object.entries(connections)) {
      if (!nodeNames.includes(sourceName)) {
        results.criticalErrors.push(`Conexión desde nodo inexistente: ${sourceName}`);
        results.isValid = false;
        continue;
      }
      
      connectedNodes.add(sourceName);
      
      if (sourceConnections.main) {
        for (const outputBranch of sourceConnections.main) {
          for (const targetConnection of outputBranch) {
            if (!nodeNames.includes(targetConnection.node)) {
              results.criticalErrors.push(`Conexión hacia nodo inexistente: ${targetConnection.node}`);
              results.isValid = false;
            } else {
              connectedNodes.add(targetConnection.node);
            }
          }
        }
      }
    }

    // 2. Detectar nodos huérfanos
    const orphanedNodes = nodeNames.filter(name => !connectedNodes.has(name));
    if (orphanedNodes.length > 0) {
      // Permitir algunos triggers sin conexiones de entrada
      const orphanedNonTriggers = orphanedNodes.filter(name => {
        const nodeType = nodeTypes.get(name);
        return !this.isTriggerType(nodeType);
      });
      
      if (orphanedNonTriggers.length > 0) {
        results.criticalErrors.push(`Nodos huérfanos detectados: ${orphanedNonTriggers.join(', ')}`);
        results.isValid = false;
      }
    }

    // 3. Validar triggers
    await this.validateTriggers(workflowData, results);
    
    // 4. Validar nodos IF
    await this.validateIfNodes(workflowData, results);
    
    // 5. Validar nodos Merge
    await this.validateMergeNodes(workflowData, results);

    results.analysisDetails.connectivityValid = results.criticalErrors.length === 0;
  }

  // ⚙️ VALIDACIÓN DE CONFIGURACIÓN DE NODOS
  async validateNodeConfiguration(workflowData, results) {
    console.log('⚙️ Validando configuración de nodos...');
    
    for (const node of workflowData.nodes) {
      const requirements = this.nodeTypeRequirements.get(node.type) || {};
      
      // Validar parámetros requeridos
      if (requirements.requiredParams) {
        for (const param of requirements.requiredParams) {
          if (!node.parameters || !node.parameters[param]) {
            results.warnings.push(`Nodo ${node.name}: falta parámetro requerido '${param}'`);
          }
        }
      }

      // Validar configuración específica por tipo
      if (node.type.includes('if')) {
        this.validateIfConfiguration(node, results);
      } else if (node.type.includes('merge')) {
        this.validateMergeConfiguration(node, results);
      } else if (node.type.includes('webhook')) {
        this.validateWebhookConfiguration(node, results);
      }
    }
  }

  // 📊 VALIDACIÓN DE FLUJO LÓGICO
  async validateLogicalFlow(workflowData, results) {
    console.log('📊 Validando flujo lógico...');
    
    // 1. Verificar que hay al menos un trigger
    const triggers = workflowData.nodes.filter(n => this.isTriggerType(n.type));
    if (triggers.length === 0) {
      results.criticalErrors.push('No se encontró ningún nodo trigger');
      results.isValid = false;
    }

    // 2. Verificar flujos completos desde triggers
    for (const trigger of triggers) {
      const reachableNodes = this.getReachableNodes(trigger.name, workflowData.connections);
      if (reachableNodes.size <= 1) {
        results.warnings.push(`Trigger ${trigger.name} no tiene flujo descendente`);
      }
    }

    // 3. Detectar flujos circulares
    const circularPaths = this.detectCircularDependencies(workflowData);
    if (circularPaths.length > 0) {
      results.criticalErrors.push(`Dependencias circulares detectadas: ${circularPaths.join(', ')}`);
      results.isValid = false;
    }

    // 4. Verificar balance de flujos paralelos
    this.validateParallelFlows(workflowData, results);
  }

  // 🧠 ANÁLISIS DE COHERENCIA SEMÁNTICA
  async analyzeCoherence(workflowData, originalPrompt, results) {
    console.log('🧠 Analizando coherencia semántica...');
    
    const promptLower = originalPrompt.toLowerCase();
    const nodeTypes = workflowData.nodes.map(n => n.type);
    const nodeNames = workflowData.nodes.map(n => n.name.toLowerCase());
    
    // 1. Verificar alineación con el prompt
    const expectedFeatures = this.extractExpectedFeatures(promptLower);
    const missingFeatures = expectedFeatures.filter(feature => 
      !this.isFeatureImplemented(feature, nodeTypes, nodeNames)
    );
    
    if (missingFeatures.length > 0) {
      results.warnings.push(`Características posiblemente faltantes: ${missingFeatures.join(', ')}`);
    }

    // 2. Verificar coherencia de nombres
    this.validateNamingCoherence(workflowData, results);
    
    // 3. Análizar complejidad apropiada
    this.analyzeComplexityAlignment(workflowData, originalPrompt, results);

    results.analysisDetails.coherenceScore = this.calculateCoherenceScore(workflowData, originalPrompt);
  }

  // 📊 CÁLCULO DE SCORE DE CALIDAD
  calculateQualityScore(results) {
    let score = 100;
    
    // Penalizaciones por errores críticos
    score -= results.criticalErrors.length * 20;
    
    // Penalizaciones por warnings
    score -= results.warnings.length * 5;
    
    // Bonificaciones por buenas prácticas
    if (results.analysisDetails.connectivityValid) score += 5;
    if (results.analysisDetails.structureValid) score += 5;
    if (results.analysisDetails.coherenceScore > 0.8) score += 10;
    
    results.score = Math.max(0, Math.min(100, score));
  }

  // 🔧 MÉTODOS DE UTILIDAD Y VALIDACIONES ESPECÍFICAS

  validateTriggers(workflowData, results) {
    const triggers = workflowData.nodes.filter(n => this.isTriggerType(n.type));
    
    for (const trigger of triggers) {
      const hasOutgoingConnections = workflowData.connections[trigger.name]?.main?.length > 0;
      if (!hasOutgoingConnections) {
        results.criticalErrors.push(`Trigger ${trigger.name} no tiene conexiones de salida`);
        results.isValid = false;
      }
    }
  }

  validateIfNodes(workflowData, results) {
    const ifNodes = workflowData.nodes.filter(n => n.type.includes('if'));
    
    for (const ifNode of ifNodes) {
      const connections = workflowData.connections[ifNode.name];
      if (!connections || !connections.main || connections.main.length < 2) {
        results.criticalErrors.push(`Nodo IF ${ifNode.name} debe tener conexiones true/false`);
        results.isValid = false;
      }
    }
  }

  validateMergeNodes(workflowData, results) {
    const mergeNodes = workflowData.nodes.filter(n => n.type.includes('merge'));
    
    for (const mergeNode of mergeNodes) {
      const incomingConnections = this.getIncomingConnections(mergeNode.name, workflowData);
      if (incomingConnections.length < 2) {
        results.criticalErrors.push(`Nodo Merge ${mergeNode.name} debe tener al menos 2 entradas`);
        results.isValid = false;
      }
    }
  }

  // Métodos auxiliares
  isValidNodeType(type) {
    const validPrefixes = ['n8n-nodes-base', 'n8n-nodes-community', '@n8n'];
    return validPrefixes.some(prefix => type.startsWith(prefix));
  }

  isTriggerType(type) {
    const triggerTypes = ['webhook', 'cron', 'manual', 'trigger'];
    return triggerTypes.some(trigger => type.includes(trigger));
  }

  getReachableNodes(startNode, connections, visited = new Set()) {
    if (visited.has(startNode)) return visited;
    visited.add(startNode);
    
    const nodeConnections = connections[startNode];
    if (nodeConnections?.main) {
      for (const branch of nodeConnections.main) {
        for (const connection of branch) {
          this.getReachableNodes(connection.node, connections, visited);
        }
      }
    }
    
    return visited;
  }

  detectCircularDependencies(workflowData) {
    // Implementación simplificada - detecta cycles básicos
    const visiting = new Set();
    const visited = new Set();
    const cycles = [];
    
    const dfs = (node, path) => {
      if (visiting.has(node)) {
        cycles.push([...path, node]);
        return;
      }
      if (visited.has(node)) return;
      
      visiting.add(node);
      const connections = workflowData.connections[node];
      if (connections?.main) {
        for (const branch of connections.main) {
          for (const connection of branch) {
            dfs(connection.node, [...path, node]);
          }
        }
      }
      visiting.delete(node);
      visited.add(node);
    };
    
    for (const node of workflowData.nodes) {
      if (!visited.has(node.name)) {
        dfs(node.name, []);
      }
    }
    
    return cycles;
  }

  // Inicialización de reglas y configuraciones
  initializeValidationRules() {
    return {
      maxNodes: 50,
      minNodes: 1,
      maxConnections: 100,
      requiredTrigger: true
    };
  }

  initializeNodeTypeRequirements() {
    const requirements = new Map();
    
    requirements.set('n8n-nodes-base.webhook', {
      requiredParams: ['httpMethod', 'path'],
      maxIncoming: 0,
      minOutgoing: 1
    });
    
    requirements.set('n8n-nodes-base.if', {
      requiredParams: ['conditions'],
      minIncoming: 1,
      minOutgoing: 2
    });
    
    requirements.set('n8n-nodes-base.merge', {
      requiredParams: ['mode'],
      minIncoming: 2,
      maxOutgoing: 1
    });
    
    return requirements;
  }

  initializeConnectionPatterns() {
    return {
      sequential: ['trigger', 'validation', 'processing', 'output'],
      parallel: ['split', 'process_a', 'process_b', 'merge'],
      conditional: ['input', 'condition', 'branch_a', 'branch_b']
    };
  }

  // Métodos adicionales de análisis
  extractExpectedFeatures(prompt) {
    const features = [];
    
    if (prompt.includes('whatsapp') || prompt.includes('mensaje')) features.push('messaging');
    if (prompt.includes('audio') || prompt.includes('voz')) features.push('audio_processing');
    if (prompt.includes('texto') || prompt.includes('transcrib')) features.push('text_processing');
    if (prompt.includes('ia') || prompt.includes('inteligente')) features.push('ai_integration');
    if (prompt.includes('tienda') || prompt.includes('productos')) features.push('commerce');
    
    return features;
  }

  isFeatureImplemented(feature, nodeTypes, nodeNames) {
    const featureMap = {
      messaging: ['telegram', 'slack', 'whatsapp', 'mensaje'],
      audio_processing: ['openai', 'audio', 'transcribe'],
      text_processing: ['set', 'code', 'function', 'texto'],
      ai_integration: ['openai', 'anthropic', 'gemini'],
      commerce: ['stripe', 'shopify', 'products']
    };
    
    const indicators = featureMap[feature] || [];
    return indicators.some(indicator => 
      nodeTypes.some(type => type.includes(indicator)) ||
      nodeNames.some(name => name.includes(indicator))
    );
  }

  validateNamingCoherence(workflowData, results) {
    const names = workflowData.nodes.map(n => n.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      results.criticalErrors.push(`Nombres duplicados detectados: ${[...new Set(duplicates)].join(', ')}`);
      results.isValid = false;
    }
  }

  analyzeComplexityAlignment(workflowData, originalPrompt, results) {
    const nodeCount = workflowData.nodes.length;
    const promptComplexity = this.estimatePromptComplexity(originalPrompt);
    
    if (promptComplexity === 'simple' && nodeCount > 15) {
      results.suggestions.push('El workflow podría ser demasiado complejo para la solicitud');
    } else if (promptComplexity === 'complex' && nodeCount < 8) {
      results.suggestions.push('El workflow podría ser demasiado simple para la solicitud');
    }
  }

  estimatePromptComplexity(prompt) {
    const keywords = prompt.toLowerCase();
    let complexity = 0;
    
    if (keywords.includes('multiple') || keywords.includes('varios')) complexity++;
    if (keywords.includes('integrar') || keywords.includes('conectar')) complexity++;
    if (keywords.includes('automatizar') || keywords.includes('procesar')) complexity++;
    if (keywords.includes('validar') || keywords.includes('verificar')) complexity++;
    
    return complexity > 2 ? 'complex' : complexity > 0 ? 'medium' : 'simple';
  }

  calculateCoherenceScore(workflowData, originalPrompt) {
    let score = 0.5; // Base score
    
    // Incrementar por buenas prácticas
    if (workflowData.nodes.some(n => this.isTriggerType(n.type))) score += 0.1;
    if (workflowData.nodes.some(n => n.type.includes('if'))) score += 0.1;
    if (workflowData.nodes.length >= 5) score += 0.1;
    
    return Math.min(1.0, score);
  }

  getIncomingConnections(nodeName, workflowData) {
    const incoming = [];
    
    for (const [sourceName, connections] of Object.entries(workflowData.connections)) {
      if (connections.main) {
        for (const branch of connections.main) {
          for (const connection of branch) {
            if (connection.node === nodeName) {
              incoming.push(sourceName);
            }
          }
        }
      }
    }
    
    return incoming;
  }

  validateParallelFlows(workflowData, results) {
    // Análisis simplificado de flujos paralelos
    const parallelNodes = new Map();
    
    for (const [sourceName, connections] of Object.entries(workflowData.connections)) {
      if (connections.main && connections.main.length > 1) {
        const targets = connections.main.flat().map(c => c.node);
        parallelNodes.set(sourceName, targets);
      }
    }
    
    // Verificar que flujos paralelos converjan
    for (const [source, targets] of parallelNodes.entries()) {
      if (targets.length > 1) {
        results.analysisDetails.hasParallelFlows = true;
        // Aquí podrías agregar lógica para verificar convergencia
      }
    }
  }

  validateIfConfiguration(node, results) {
    if (!node.parameters?.conditions) {
      results.warnings.push(`Nodo IF ${node.name}: configuración de condiciones incompleta`);
    }
  }

  validateMergeConfiguration(node, results) {
    if (!node.parameters?.mode) {
      results.warnings.push(`Nodo Merge ${node.name}: falta configuración de modo`);
    }
  }

  validateWebhookConfiguration(node, results) {
    if (!node.parameters?.httpMethod || !node.parameters?.path) {
      results.warnings.push(`Webhook ${node.name}: configuración incompleta`);
    }
  }
}
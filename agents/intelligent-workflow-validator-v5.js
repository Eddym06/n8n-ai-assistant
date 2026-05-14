/**
 * INTELLIGENT WORKFLOW VALIDATOR V5.0 - Sistema Avanzado de Validación de Workflows
 * Modernizado y expandido desde intelligent-workflow-validator.js
 * 
 * Características:
 * - Validación estructural avanzada
 * - Análisis de coherencia contextual
 * - Detección de patrones de error comunes
 * - Validación específica para nodos LangChain
 * - Sistema de scoring inteligente
 * - Sugerencias de optimización automática
 * - Validación de flujos de IA
 */

import dotenv from 'dotenv';

dotenv.config();

// CONSTANTES DE VALIDACIÓN
const VALIDATION_LEVELS = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
  SUGGESTION: 'suggestion'
};

const VALIDATION_CATEGORIES = {
  STRUCTURE: 'structure',
  CONNECTIVITY: 'connectivity',
  CONFIGURATION: 'configuration',
  LOGIC_FLOW: 'logic_flow',
  COHERENCE: 'coherence',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  AI_SPECIFIC: 'ai_specific'
};

const NODE_TYPE_CLASSIFICATIONS = {
  TRIGGERS: [
    'n8n-nodes-base.manualTrigger',
    'n8n-nodes-base.webhook',
    'n8n-nodes-base.cron',
    'n8n-nodes-base.schedule',
    'n8n-nodes-base.interval',
    'n8n-nodes-base.emailTrigger',
    'n8n-nodes-base.slackTrigger'
  ],
  PROCESSING: [
    'n8n-nodes-base.function',
    'n8n-nodes-base.code',
    'n8n-nodes-base.httpRequest',
    'n8n-nodes-base.set',
    'n8n-nodes-base.itemLists'
  ],
  CONTROL_FLOW: [
    'n8n-nodes-base.if',
    'n8n-nodes-base.switch',
    'n8n-nodes-base.merge',
    'n8n-nodes-base.splitInBatches'
  ],
  COMMUNICATION: [
    'n8n-nodes-base.slack',
    'n8n-nodes-base.telegram',
    'n8n-nodes-base.emailSend',
    'n8n-nodes-base.whatsApp',
    'n8n-nodes-base.discord'
  ],
  AI_LANGCHAIN: [
    '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    '@n8n/n8n-nodes-langchain.lmChatAnthropic',
    '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
    '@n8n/n8n-nodes-langchain.memoryBufferWindow',
    '@n8n/n8n-nodes-langchain.agentExecutor',
    '@n8n/n8n-nodes-langchain.toolWorkflow',
    '@n8n/n8n-nodes-langchain.vectorStoreInMemory',
    '@n8n/n8n-nodes-langchain.embeddingsOpenAi'
  ],
  STORAGE: [
    'n8n-nodes-base.googleSheets',
    'n8n-nodes-base.microsoftExcel',
    'n8n-nodes-base.googleDrive',
    'n8n-nodes-base.awsS3',
    'n8n-nodes-base.dropbox'
  ]
};

// Sistema de tracking de validaciones
class ValidationTracker {
  static validations = [];
  static stats = {
    totalValidations: 0,
    criticalErrors: 0,
    warnings: 0,
    avgScore: 0,
    byCategory: {}
  };
  
  static recordValidation(result) {
    this.validations.push({
      timestamp: new Date().toISOString(),
      score: result.score,
      criticalErrors: result.criticalErrors.length,
      warnings: result.warnings.length,
      categories: Object.keys(result.analysisDetails)
    });
    
    this.stats.totalValidations++;
    this.stats.criticalErrors += result.criticalErrors.length;
    this.stats.warnings += result.warnings.length;
    this.stats.avgScore = this.validations.reduce((acc, v) => acc + v.score, 0) / this.validations.length;
  }
  
  static getStats() {
    return {
      ...this.stats,
      recentValidations: this.validations.slice(-10)
    };
  }
}

// CLASE PRINCIPAL DEL VALIDADOR INTELIGENTE V5.0
export class IntelligentWorkflowValidator {
  constructor(options = {}) {
    this.options = {
      strictMode: options.strictMode || false,
      enableAIValidation: options.enableAIValidation !== false,
      enablePerformanceCheck: options.enablePerformanceCheck !== false,
      enableSecurityCheck: options.enableSecurityCheck !== false,
      ...options
    };
    
    this.validationRules = this.initializeValidationRules();
    this.nodeTypeRequirements = this.initializeNodeTypeRequirements();
    this.aiValidationRules = this.initializeAIValidationRules();
    this.validationCache = new Map();
    
    console.log('🔍 IntelligentWorkflowValidator V5.0 inicializado');
  }

  /**
   * Método principal de validación completa
   */
  async validateWorkflow(workflowData, originalPrompt = '', options = {}) {
    console.log('🔍 Iniciando validación inteligente V5.0...');
    
    const validationId = `validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const results = {
      validationId,
      isValid: true,
      score: 0,
      criticalErrors: [],
      warnings: [],
      suggestions: [],
      optimizations: [],
      analysisDetails: {},
      metadata: {
        validationTime: 0,
        validatorVersion: '5.0',
        timestamp: new Date().toISOString()
      }
    };

    try {
      // Verificar cache
      const cacheKey = this.generateCacheKey(workflowData);
      if (this.validationCache.has(cacheKey) && !options.skipCache) {
        console.log('📋 Usando resultado de validación cacheado');
        return this.validationCache.get(cacheKey);
      }

      // Fases de validación
      console.log('🏗️ Fase 1: Validación estructural');
      await this.validateStructure(workflowData, results);
      
      console.log('🔗 Fase 2: Validación de conectividad');
      await this.validateConnectivity(workflowData, results);
      
      console.log('⚙️ Fase 3: Validación de configuración');
      await this.validateNodeConfiguration(workflowData, results);
      
      console.log('📊 Fase 4: Validación de flujo lógico');
      await this.validateLogicalFlow(workflowData, results);
      
      console.log('🧠 Fase 5: Análisis de coherencia');
      await this.analyzeCoherence(workflowData, originalPrompt, results);
      
      if (this.options.enableAIValidation) {
        console.log('🤖 Fase 6: Validación específica de IA');
        await this.validateAIWorkflow(workflowData, results);
      }
      
      if (this.options.enablePerformanceCheck) {
        console.log('⚡ Fase 7: Análisis de rendimiento');
        await this.analyzePerformance(workflowData, results);
      }
      
      if (this.options.enableSecurityCheck) {
        console.log('🔒 Fase 8: Análisis de seguridad');
        await this.analyzeSecurityrisks(workflowData, results);
      }
      
      // Cálculo de score final y sugerencias
      this.calculateQualityScore(results);
      this.generateOptimizationSuggestions(workflowData, results);
      
      // Completar metadata
      results.metadata.validationTime = Date.now() - startTime;
      
      // Cachear resultado
      this.validationCache.set(cacheKey, results);
      
      // Registrar en tracker
      ValidationTracker.recordValidation(results);
      
      console.log(`✅ Validación completada. Score: ${results.score}/100 (${results.metadata.validationTime}ms)`);
      return results;
      
    } catch (error) {
      console.error('❌ Error en validación V5.0:', error);
      results.isValid = false;
      results.criticalErrors.push(`Error crítico de validación: ${error.message}`);
      results.metadata.validationTime = Date.now() - startTime;
      return results;
    }
  }

  /**
   * Validación estructural avanzada
   */
  async validateStructure(workflowData, results) {
    const structureChecks = {
      hasNodes: false,
      hasConnections: false,
      nodeStructureValid: true,
      connectionStructureValid: true
    };

    // Verificar propiedades básicas
    if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
      results.criticalErrors.push('Estructura inválida: falta array de nodos válido');
      results.isValid = false;
    } else {
      structureChecks.hasNodes = true;
      
      if (workflowData.nodes.length === 0) {
        results.criticalErrors.push('Workflow vacío: no contiene nodos');
        results.isValid = false;
      }
    }

    if (!workflowData.connections || typeof workflowData.connections !== 'object') {
      results.criticalErrors.push('Estructura inválida: falta objeto de conexiones válido');
      results.isValid = false;
    } else {
      structureChecks.hasConnections = true;
    }

    // Validar estructura de nodos individuales
    if (structureChecks.hasNodes) {
      const nodeNames = new Set();
      const nodeIds = new Set();
      
      for (const [index, node] of workflowData.nodes.entries()) {
        const nodeContext = `Nodo ${index + 1} (${node.name || 'sin nombre'})`;
        
        // Campos requeridos
        if (!node.id) {
          results.criticalErrors.push(`${nodeContext}: falta campo 'id' requerido`);
          structureChecks.nodeStructureValid = false;
        } else if (nodeIds.has(node.id)) {
          results.criticalErrors.push(`${nodeContext}: ID duplicado '${node.id}'`);
          structureChecks.nodeStructureValid = false;
        } else {
          nodeIds.add(node.id);
        }

        if (!node.name) {
          results.criticalErrors.push(`${nodeContext}: falta campo 'name' requerido`);
          structureChecks.nodeStructureValid = false;
        } else if (nodeNames.has(node.name)) {
          results.criticalErrors.push(`${nodeContext}: nombre duplicado '${node.name}'`);
          structureChecks.nodeStructureValid = false;
        } else {
          nodeNames.add(node.name);
        }

        if (!node.type) {
          results.criticalErrors.push(`${nodeContext}: falta campo 'type' requerido`);
          structureChecks.nodeStructureValid = false;
        }

        // Validar posición
        if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
          results.warnings.push(`${nodeContext}: posición inválida o faltante`);
        } else {
          const [x, y] = node.position;
          if (typeof x !== 'number' || typeof y !== 'number') {
            results.warnings.push(`${nodeContext}: coordenadas de posición deben ser números`);
          }
        }

        // Validar typeVersion
        if (!node.typeVersion || typeof node.typeVersion !== 'number') {
          results.warnings.push(`${nodeContext}: typeVersion inválido o faltante`);
        }

        // Validar parámetros básicos
        if (node.parameters && typeof node.parameters !== 'object') {
          results.warnings.push(`${nodeContext}: parameters debe ser un objeto`);
        }
      }
    }

    // Validar estructura de conexiones
    if (structureChecks.hasConnections && structureChecks.hasNodes) {
      const nodeNames = new Set(workflowData.nodes.map(n => n.name));
      
      for (const [sourceName, connections] of Object.entries(workflowData.connections)) {
        if (!nodeNames.has(sourceName)) {
          results.criticalErrors.push(`Conexión desde nodo inexistente: '${sourceName}'`);
          structureChecks.connectionStructureValid = false;
        }
        
        if (connections.main && Array.isArray(connections.main)) {
          for (const [branchIndex, branch] of connections.main.entries()) {
            if (!Array.isArray(branch)) {
              results.warnings.push(`Conexión de '${sourceName}': rama ${branchIndex} debe ser un array`);
              continue;
            }
            
            for (const [connIndex, connection] of branch.entries()) {
              if (!connection.node) {
                results.criticalErrors.push(`Conexión de '${sourceName}' rama ${branchIndex}[${connIndex}]: falta nodo destino`);
                structureChecks.connectionStructureValid = false;
              } else if (!nodeNames.has(connection.node)) {
                results.criticalErrors.push(`Conexión hacia nodo inexistente: '${connection.node}'`);
                structureChecks.connectionStructureValid = false;
              }
              
              if (!connection.type) {
                results.warnings.push(`Conexión '${sourceName}' → '${connection.node}': falta tipo de conexión`);
              }
              
              if (typeof connection.index !== 'number') {
                results.warnings.push(`Conexión '${sourceName}' → '${connection.node}': índice debe ser un número`);
              }
            }
          }
        }
      }
    }

    results.analysisDetails.structure = structureChecks;
  }

  /**
   * Validación avanzada de conectividad
   */
  async validateConnectivity(workflowData, results) {
    const connectivityChecks = {
      hasTriggers: false,
      triggersConnected: true,
      noOrphans: true,
      noCircularDeps: true,
      ifNodesProperlyConnected: true,
      mergeNodesProperlyConnected: true
    };

    if (!workflowData.nodes || !workflowData.connections) {
      results.analysisDetails.connectivity = connectivityChecks;
      return;
    }

    const nodeMap = new Map(workflowData.nodes.map(n => [n.name, n]));
    const incomingConnections = new Map();
    const outgoingConnections = new Map();

    // Mapear todas las conexiones
    for (const [sourceName, connections] of Object.entries(workflowData.connections)) {
      if (!outgoingConnections.has(sourceName)) {
        outgoingConnections.set(sourceName, []);
      }
      
      if (connections.main) {
        for (const branch of connections.main) {
          for (const connection of branch) {
            if (!incomingConnections.has(connection.node)) {
              incomingConnections.set(connection.node, []);
            }
            incomingConnections.get(connection.node).push(sourceName);
            outgoingConnections.get(sourceName).push(connection.node);
          }
        }
      }
    }

    // 1. Validar triggers
    const triggers = workflowData.nodes.filter(n => this.isTriggerType(n.type));
    connectivityChecks.hasTriggers = triggers.length > 0;
    
    if (!connectivityChecks.hasTriggers) {
      results.criticalErrors.push('No se encontró ningún nodo trigger en el workflow');
      results.isValid = false;
    }

    // Verificar que los triggers tengan conexiones de salida
    for (const trigger of triggers) {
      if (!outgoingConnections.has(trigger.name) || outgoingConnections.get(trigger.name).length === 0) {
        results.warnings.push(`Trigger '${trigger.name}' no tiene conexiones de salida`);
        connectivityChecks.triggersConnected = false;
      }
    }

    // 2. Detectar nodos huérfanos
    const allConnectedNodes = new Set([...incomingConnections.keys(), ...outgoingConnections.keys()]);
    const orphanedNodes = workflowData.nodes.filter(n => {
      const isConnected = allConnectedNodes.has(n.name);
      const isTrigger = this.isTriggerType(n.type);
      return !isConnected && !isTrigger;
    });

    if (orphanedNodes.length > 0) {
      results.warnings.push(`Nodos huérfanos detectados: ${orphanedNodes.map(n => n.name).join(', ')}`);
      connectivityChecks.noOrphans = false;
    }

    // 3. Detectar dependencias circulares
    const circularPaths = this.detectCircularDependencies(workflowData);
    if (circularPaths.length > 0) {
      results.criticalErrors.push(`Dependencias circulares detectadas: ${circularPaths.join(', ')}`);
      connectivityChecks.noCircularDeps = false;
      results.isValid = false;
    }

    // 4. Validar nodos IF específicamente
    const ifNodes = workflowData.nodes.filter(n => n.type.includes('if'));
    for (const ifNode of ifNodes) {
      const outgoing = outgoingConnections.get(ifNode.name) || [];
      if (outgoing.length < 2) {
        results.warnings.push(`Nodo IF '${ifNode.name}' debería tener al menos 2 conexiones de salida (true/false)`);
        connectivityChecks.ifNodesProperlyConnected = false;
      }
    }

    // 5. Validar nodos Merge específicamente
    const mergeNodes = workflowData.nodes.filter(n => n.type.includes('merge'));
    for (const mergeNode of mergeNodes) {
      const incoming = incomingConnections.get(mergeNode.name) || [];
      if (incoming.length < 2) {
        results.warnings.push(`Nodo Merge '${mergeNode.name}' debería tener al menos 2 conexiones de entrada`);
        connectivityChecks.mergeNodesProperlyConnected = false;
      }
    }

    results.analysisDetails.connectivity = connectivityChecks;
  }

  /**
   * Validación de configuración de nodos
   */
  async validateNodeConfiguration(workflowData, results) {
    const configurationChecks = {
      allNodesConfigured: true,
      missingRequiredParams: [],
      invalidParams: [],
      credentialsValid: true
    };

    if (!workflowData.nodes) {
      results.analysisDetails.configuration = configurationChecks;
      return;
    }

    for (const node of workflowData.nodes) {
      const nodeContext = `Nodo '${node.name}' (${node.type})`;
      
      // Verificar parámetros requeridos por tipo de nodo
      const requirements = this.nodeTypeRequirements.get(node.type);
      if (requirements?.requiredParams) {
        for (const param of requirements.requiredParams) {
          if (!node.parameters || !node.parameters[param]) {
            results.warnings.push(`${nodeContext}: falta parámetro requerido '${param}'`);
            configurationChecks.missingRequiredParams.push(`${node.name}.${param}`);
            configurationChecks.allNodesConfigured = false;
          }
        }
      }

      // Validar tipos específicos de parámetros
      if (node.parameters) {
        // Validar URLs
        if (node.parameters.url && typeof node.parameters.url === 'string') {
          try {
            new URL(node.parameters.url);
          } catch (error) {
            results.warnings.push(`${nodeContext}: URL inválida '${node.parameters.url}'`);
            configurationChecks.invalidParams.push(`${node.name}.url`);
          }
        }

        // Validar emails
        if (node.parameters.email && typeof node.parameters.email === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(node.parameters.email)) {
            results.warnings.push(`${nodeContext}: email inválido '${node.parameters.email}'`);
            configurationChecks.invalidParams.push(`${node.name}.email`);
          }
        }

        // Validar números
        ['timeout', 'maxTokens', 'temperature', 'retries'].forEach(param => {
          if (node.parameters[param] !== undefined) {
            const value = parseFloat(node.parameters[param]);
            if (isNaN(value)) {
              results.warnings.push(`${nodeContext}: '${param}' debe ser un número válido`);
              configurationChecks.invalidParams.push(`${node.name}.${param}`);
            }
          }
        });
      }

      // Verificar credenciales
      if (node.credentials && Object.keys(node.credentials).length > 0) {
        Object.keys(node.credentials).forEach(credType => {
          if (!node.credentials[credType]) {
            results.warnings.push(`${nodeContext}: credencial '${credType}' no configurada`);
            configurationChecks.credentialsValid = false;
          }
        });
      }
    }

    results.analysisDetails.configuration = configurationChecks;
  }

  /**
   * Validación de flujo lógico
   */
  async validateLogicalFlow(workflowData, results) {
    const logicalFlowChecks = {
      hasValidFlow: true,
      circularDependencies: [],
      unreachableNodes: [],
      deadEnds: [],
      logicalInconsistencies: []
    };

    if (!workflowData.nodes || !workflowData.connections) {
      results.analysisDetails.logicalFlow = logicalFlowChecks;
      return;
    }

    // 1. Detectar dependencias circulares
    const circularPaths = this.detectCircularDependencies(workflowData);
    if (circularPaths.length > 0) {
      logicalFlowChecks.circularDependencies = circularPaths;
      logicalFlowChecks.hasValidFlow = false;
      results.criticalErrors.push(`Dependencias circulares detectadas: ${circularPaths.join(', ')}`);
    }

    // 2. Detectar nodos no alcanzables
    const reachableNodes = this.findReachableNodes(workflowData);
    const allNodeNames = new Set(workflowData.nodes.map(n => n.name));
    const unreachableNodes = Array.from(allNodeNames).filter(name => !reachableNodes.has(name));
    
    if (unreachableNodes.length > 0) {
      logicalFlowChecks.unreachableNodes = unreachableNodes;
      results.warnings.push(`Nodos no alcanzables: ${unreachableNodes.join(', ')}`);
    }

    // 3. Detectar callejones sin salida
    const deadEnds = workflowData.nodes.filter(node => {
      const hasOutgoingConnections = workflowData.connections[node.name]?.main?.some(branch => branch.length > 0);
      const isEndNode = ['n8n-nodes-base.emailSend', 'n8n-nodes-base.slack', 'n8n-nodes-base.webhook'].some(type => 
        node.type.includes(type.split('.').pop())
      );
      return !hasOutgoingConnections && !isEndNode;
    }).map(n => n.name);

    if (deadEnds.length > 0) {
      logicalFlowChecks.deadEnds = deadEnds;
      results.suggestions.push(`Nodos sin conexiones de salida: ${deadEnds.join(', ')}. Considera añadir acciones finales.`);
    }

    // 4. Validar consistencia lógica de nodos condicionales
    const ifNodes = workflowData.nodes.filter(n => n.type.includes('if'));
    for (const ifNode of ifNodes) {
      const connections = workflowData.connections[ifNode.name];
      if (connections?.main) {
        const branchCount = connections.main.filter(branch => branch.length > 0).length;
        if (branchCount < 2) {
          logicalFlowChecks.logicalInconsistencies.push(`IF node '${ifNode.name}' debe tener al menos 2 ramas`);
          results.warnings.push(`Nodo IF '${ifNode.name}' incompleto: faltan ramas true/false`);
        }
      }
    }

    results.analysisDetails.logicalFlow = logicalFlowChecks;
  }

  /**
   * Encontrar nodos alcanzables desde los triggers
   */
  findReachableNodes(workflowData) {
    const reachable = new Set();
    const triggers = workflowData.nodes.filter(n => this.isTriggerType(n.type));
    
    const dfs = (nodeName) => {
      if (reachable.has(nodeName)) return;
      reachable.add(nodeName);
      
      const connections = workflowData.connections[nodeName];
      if (connections?.main) {
        connections.main.flat().forEach(conn => {
          if (conn.node) {
            dfs(conn.node);
          }
        });
      }
    };

    triggers.forEach(trigger => dfs(trigger.name));
    return reachable;
  }

  /**
   * Validación específica para nodos de IA/LangChain
   */
  async validateAIWorkflow(workflowData, results) {
    const aiChecks = {
      hasAINodes: false,
      aiNodesProperlyConfigured: true,
      hasMemoryManagement: false,
      hasEmbeddings: false,
      hasVectorStore: false,
      aiConnectionsValid: true
    };

    const aiNodes = workflowData.nodes.filter(n => 
      NODE_TYPE_CLASSIFICATIONS.AI_LANGCHAIN.some(type => n.type.includes(type.split('.').pop()))
    );

    aiChecks.hasAINodes = aiNodes.length > 0;

    if (!aiChecks.hasAINodes) {
      results.analysisDetails.aiSpecific = aiChecks;
      return;
    }

    console.log(`🤖 Validando ${aiNodes.length} nodos de IA...`);

    for (const node of aiNodes) {
      // Validar configuración específica de LangChain
      if (node.type.includes('lmChat')) {
        if (!node.parameters?.modelName) {
          results.warnings.push(`Nodo IA '${node.name}': falta configuración de modelo`);
          aiChecks.aiNodesProperlyConfigured = false;
        }
        
        if (node.parameters?.temperature !== undefined) {
          const temp = parseFloat(node.parameters.temperature);
          if (isNaN(temp) || temp < 0 || temp > 2) {
            results.warnings.push(`Nodo IA '${node.name}': temperatura fuera de rango (0-2)`);
          }
        }
        
        if (node.parameters?.maxTokens !== undefined) {
          const tokens = parseInt(node.parameters.maxTokens);
          if (isNaN(tokens) || tokens <= 0) {
            results.warnings.push(`Nodo IA '${node.name}': maxTokens debe ser un número positivo`);
          }
        }
      }
      
      // Detectar nodos específicos
      if (node.type.includes('memory')) {
        aiChecks.hasMemoryManagement = true;
      }
      
      if (node.type.includes('embeddings')) {
        aiChecks.hasEmbeddings = true;
      }
      
      if (node.type.includes('vectorStore')) {
        aiChecks.hasVectorStore = true;
      }
    }

    // Validar conexiones de IA
    for (const node of aiNodes) {
      const connections = workflowData.connections[node.name];
      if (connections?.main) {
        for (const branch of connections.main) {
          for (const connection of branch) {
            // Verificar tipos de conexión específicos de IA
            if (connection.type && !['main', 'ai_memory', 'ai_languageModel', 'ai_tool'].includes(connection.type)) {
              results.warnings.push(`Nodo IA '${node.name}': tipo de conexión no estándar '${connection.type}'`);
            }
          }
        }
      }
    }

    // Sugerencias para workflows de IA
    if (aiChecks.hasAINodes && !aiChecks.hasMemoryManagement) {
      results.suggestions.push('Considera añadir nodos de memoria para conversaciones más coherentes');
    }
    
    if (aiChecks.hasAINodes && !aiChecks.hasVectorStore && aiNodes.length > 2) {
      results.suggestions.push('Para workflows complejos de IA, considera usar vector stores para mejor contexto');
    }

    results.analysisDetails.aiSpecific = aiChecks;
  }

  /**
   * Análisis de rendimiento del workflow
   */
  async analyzePerformance(workflowData, results) {
    const performanceChecks = {
      nodeCount: workflowData.nodes.length,
      complexity: 0,
      parallelPaths: 0,
      potentialBottlenecks: [],
      optimizationOpportunities: []
    };

    // Calcular complejidad
    for (const node of workflowData.nodes) {
      if (node.type.includes('function') || node.type.includes('code')) {
        performanceChecks.complexity += 3;
      } else if (node.type.includes('http')) {
        performanceChecks.complexity += 2;
      } else {
        performanceChecks.complexity += 1;
      }
    }

    // Detectar cuellos de botella potenciales
    for (const [nodeName, connections] of Object.entries(workflowData.connections)) {
      if (connections.main) {
        const totalConnections = connections.main.reduce((sum, branch) => sum + branch.length, 0);
        if (totalConnections > 3) {
          performanceChecks.potentialBottlenecks.push(`${nodeName} tiene ${totalConnections} conexiones de salida`);
        }
      }
    }

    // Sugerencias de optimización
    if (performanceChecks.nodeCount > 20) {
      performanceChecks.optimizationOpportunities.push('Workflow muy grande, considera dividirlo en sub-workflows');
    }
    
    if (performanceChecks.complexity > 50) {
      performanceChecks.optimizationOpportunities.push('Alta complejidad detectada, revisa nodos de procesamiento');
    }

    results.analysisDetails.performance = performanceChecks;
  }

  /**
   * Análisis de riesgos de seguridad
   */
  async analyzeSecurityrisks(workflowData, results) {
    const securityChecks = {
      hasCredentials: false,
      hasWebhooks: false,
      hasHttpRequests: false,
      potentialRisks: [],
      recommendations: []
    };

    for (const node of workflowData.nodes) {
      // Detectar uso de credenciales
      if (node.credentials && Object.keys(node.credentials).length > 0) {
        securityChecks.hasCredentials = true;
      }
      
      // Detectar webhooks
      if (node.type.includes('webhook')) {
        securityChecks.hasWebhooks = true;
        securityChecks.potentialRisks.push(`Webhook en nodo '${node.name}' - verificar autenticación`);
      }
      
      // Detectar HTTP requests
      if (node.type.includes('httpRequest')) {
        securityChecks.hasHttpRequests = true;
        if (node.parameters?.url && !node.parameters.url.startsWith('https://')) {
          securityChecks.potentialRisks.push(`HTTP request no seguro en '${node.name}' - usar HTTPS`);
        }
      }
    }

    // Recomendaciones
    if (securityChecks.hasWebhooks) {
      securityChecks.recommendations.push('Implementar autenticación en webhooks públicos');
    }
    
    if (securityChecks.hasCredentials) {
      securityChecks.recommendations.push('Verificar que las credenciales están correctamente configuradas');
    }

    results.analysisDetails.security = securityChecks;
  }

  /**
   * Generar sugerencias de optimización
   */
  generateOptimizationSuggestions(workflowData, results) {
    const optimizations = [];

    // Sugerencias basadas en el análisis
    if (results.analysisDetails.connectivity && !results.analysisDetails.connectivity.hasTriggers) {
      optimizations.push({
        type: 'critical',
        category: 'structure',
        suggestion: 'Añadir un nodo trigger para iniciar el workflow'
      });
    }

    if (results.analysisDetails.performance && results.analysisDetails.performance.nodeCount > 15) {
      optimizations.push({
        type: 'suggestion',
        category: 'performance',
        suggestion: 'Considerar dividir el workflow en componentes más pequeños'
      });
    }

    if (results.analysisDetails.aiSpecific && results.analysisDetails.aiSpecific.hasAINodes && 
        !results.analysisDetails.aiSpecific.hasMemoryManagement) {
      optimizations.push({
        type: 'suggestion',
        category: 'ai',
        suggestion: 'Añadir nodos de memoria para mejorar coherencia en conversaciones de IA'
      });
    }

    results.optimizations = optimizations;
  }

  /**
   * Calcular score de calidad del workflow
   */
  calculateQualityScore(results) {
    let score = 100;
    
    // Penalizar errores críticos
    score -= results.criticalErrors.length * 20;
    
    // Penalizar warnings
    score -= results.warnings.length * 5;
    
    // Bonificaciones por buenas prácticas
    if (results.analysisDetails.structure && results.analysisDetails.structure.nodeStructureValid) {
      score += 10;
    }
    
    if (results.analysisDetails.connectivity && results.analysisDetails.connectivity.hasTriggers) {
      score += 10;
    }
    
    if (results.analysisDetails.aiSpecific && results.analysisDetails.aiSpecific.hasMemoryManagement) {
      score += 5;
    }
    
    // Asegurar que el score esté en el rango 0-100
    results.score = Math.max(0, Math.min(100, score));
  }

  /**
   * Métodos auxiliares de clasificación de nodos
   */
  isTriggerType(nodeType) {
    return NODE_TYPE_CLASSIFICATIONS.TRIGGERS.some(type => nodeType.includes(type));
  }

  isAIType(nodeType) {
    return NODE_TYPE_CLASSIFICATIONS.AI_LANGCHAIN.some(type => nodeType.includes(type));
  }

  /**
   * Detectar dependencias circulares
   */
  detectCircularDependencies(workflowData) {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    const dfs = (nodeName, path = []) => {
      if (recursionStack.has(nodeName)) {
        const cycleStart = path.indexOf(nodeName);
        cycles.push(path.slice(cycleStart).concat(nodeName).join(' → '));
        return;
      }
      
      if (visited.has(nodeName)) return;
      
      visited.add(nodeName);
      recursionStack.add(nodeName);
      
      const connections = workflowData.connections[nodeName];
      if (connections?.main) {
        for (const branch of connections.main) {
          for (const connection of branch) {
            dfs(connection.node, [...path, nodeName]);
          }
        }
      }
      
      recursionStack.delete(nodeName);
    };

    for (const node of workflowData.nodes) {
      if (!visited.has(node.name)) {
        dfs(node.name);
      }
    }

    return cycles;
  }

  /**
   * Inicializar reglas de validación
   */
  initializeValidationRules() {
    return new Map([
      ['required_fields', ['id', 'name', 'type', 'position']],
      ['position_format', [2, 'number', 'number']],
      ['connection_types', ['main', 'ai_memory', 'ai_languageModel', 'ai_tool']]
    ]);
  }

  /**
   * Inicializar requisitos por tipo de nodo
   */
  initializeNodeTypeRequirements() {
    return new Map([
      ['n8n-nodes-base.httpRequest', { requiredParams: ['url', 'requestMethod'] }],
      ['n8n-nodes-base.function', { requiredParams: ['functionCode'] }],
      ['n8n-nodes-base.if', { requiredParams: ['conditions'] }],
      ['@n8n/n8n-nodes-langchain.lmChatOpenAi', { requiredParams: ['modelName'] }]
    ]);
  }

  /**
   * Inicializar reglas específicas de IA
   */
  initializeAIValidationRules() {
    return new Map([
      ['temperature_range', [0, 2]],
      ['max_tokens_range', [1, 32000]],
      ['required_ai_connections', ['ai_languageModel', 'ai_memory']]
    ]);
  }

  /**
   * Generar clave de cache
   */
  generateCacheKey(workflowData) {
    const simplified = {
      nodeCount: workflowData.nodes?.length || 0,
      connectionCount: Object.keys(workflowData.connections || {}).length,
      nodeTypes: workflowData.nodes?.map(n => n.type).sort().join(',') || ''
    };
    return btoa(JSON.stringify(simplified));
  }

  /**
   * Análisis de coherencia con el prompt original
   */
  async analyzeCoherence(workflowData, originalPrompt, results) {
    const coherenceChecks = {
      promptAlignment: 0,
      functionalityComplete: true,
      logicalFlow: true
    };

    if (originalPrompt && originalPrompt.length > 0) {
      // Análisis básico de coherencia con prompt
      const promptLower = originalPrompt.toLowerCase();
      const nodeNames = workflowData.nodes.map(n => n.name.toLowerCase()).join(' ');
      
      // Buscar palabras clave del prompt en los nombres de nodos
      const promptWords = promptLower.split(/\s+/).filter(word => word.length > 3);
      const matchingWords = promptWords.filter(word => nodeNames.includes(word));
      
      coherenceChecks.promptAlignment = promptWords.length > 0 ? 
        (matchingWords.length / promptWords.length) * 100 : 50;
      
      if (coherenceChecks.promptAlignment < 30) {
        results.suggestions.push('Los nombres de nodos podrían reflejar mejor el propósito del workflow');
      }
    }

    results.analysisDetails.coherence = coherenceChecks;
  }

  /**
   * Obtener estadísticas del validador
   */
  getStats() {
    return {
      cacheSize: this.validationCache.size,
      validationRules: this.validationRules.size,
      nodeTypeRequirements: this.nodeTypeRequirements.size,
      globalStats: ValidationTracker.getStats()
    };
  }

  /**
   * Limpiar cache y recursos
   */
  cleanup() {
    this.validationCache.clear();
    console.log('🧹 IntelligentWorkflowValidator limpiado');
  }
}

// Exportaciones adicionales
export { ValidationTracker, VALIDATION_LEVELS, VALIDATION_CATEGORIES, NODE_TYPE_CLASSIFICATIONS };

// Función de conveniencia para uso rápido
export async function validateWorkflow(workflowData, originalPrompt = '', options = {}) {
  const validator = new IntelligentWorkflowValidator(options);
  return await validator.validateWorkflow(workflowData, originalPrompt, options);
}

console.log('📦 Intelligent Workflow Validator V5.0 cargado y listo para uso');
/**
 * WORKFLOW AUTOCORRECTOR V4.0 - Sistema Avanzado de Corrección de Workflows
 * Modernizado y expandido desde Herramienta-Autocorrector.js
 * 
 * Características:
 * - Corrección inteligente de tipos de nodos n8n
 * - Validación y reparación de conexiones
 * - Optimización de parámetros de nodos
 * - Detección y corrección de errores comunes
 * - Soporte para nodos LangChain modernos
 * - Sistema de reglas personalizables
 */

import dotenv from 'dotenv';

dotenv.config();

// CONSTANTES DE CONFIGURACIÓN
const CORRECTION_RULES = {
  PRIORITY: {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  },
  TYPES: {
    NODE_TYPE: 'node_type',
    OPERATION: 'operation',
    PARAMETER: 'parameter',
    CONNECTION: 'connection',
    POSITION: 'position'
  }
};

// Base de datos extendida de correcciones
const CORRECTION_DATABASE = {
  // Tipos de nodos modernos (incluye LangChain)
  nodeTypes: {
    // Nodos básicos
    'http': 'n8n-nodes-base.httpRequest',
    'http request': 'n8n-nodes-base.httpRequest',
    'webhook': 'n8n-nodes-base.webhook',
    'trigger': 'n8n-nodes-base.manualTrigger',
    'manual': 'n8n-nodes-base.manualTrigger',
    'cron': 'n8n-nodes-base.cron',
    'schedule': 'n8n-nodes-base.schedule',
    'timer': 'n8n-nodes-base.interval',
    
    // Comunicación
    'email': 'n8n-nodes-base.emailSend',
    'gmail': 'n8n-nodes-base.gmail',
    'slack': 'n8n-nodes-base.slack',
    'discord': 'n8n-nodes-base.discord',
    'telegram': 'n8n-nodes-base.telegram',
    'whatsapp': 'n8n-nodes-base.whatsApp',
    'teams': 'n8n-nodes-base.microsoftTeams',
    
    // Almacenamiento
    'sheets': 'n8n-nodes-base.googleSheets',
    'google sheets': 'n8n-nodes-base.googleSheets',
    'excel': 'n8n-nodes-base.microsoftExcel',
    'drive': 'n8n-nodes-base.googleDrive',
    'dropbox': 'n8n-nodes-base.dropbox',
    'aws s3': 'n8n-nodes-base.awsS3',
    's3': 'n8n-nodes-base.awsS3',
    
    // Procesamiento
    'if': 'n8n-nodes-base.if',
    'switch': 'n8n-nodes-base.switch',
    'code': 'n8n-nodes-base.code',
    'function': 'n8n-nodes-base.function',
    'set': 'n8n-nodes-base.set',
    'transform': 'n8n-nodes-base.itemLists',
    'merge': 'n8n-nodes-base.merge',
    'split': 'n8n-nodes-base.splitInBatches',
    
    // LangChain modernos
    'openai': '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    'gpt': '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    'chatgpt': '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    'claude': '@n8n/n8n-nodes-langchain.lmChatAnthropic',
    'anthropic': '@n8n/n8n-nodes-langchain.lmChatAnthropic',
    'gemini': '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
    'google ai': '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
    'huggingface': '@n8n/n8n-nodes-langchain.lmChatHuggingFace',
    'ollama': '@n8n/n8n-nodes-langchain.lmChatOllama',
    'memory': '@n8n/n8n-nodes-langchain.memoryBufferWindow',
    'chat memory': '@n8n/n8n-nodes-langchain.memoryBufferWindow',
    'vector store': '@n8n/n8n-nodes-langchain.vectorStoreInMemory',
    'embeddings': '@n8n/n8n-nodes-langchain.embeddingsOpenAi',
    'agent': '@n8n/n8n-nodes-langchain.agentExecutor',
    'ai agent': '@n8n/n8n-nodes-langchain.agentExecutor',
    'tool': '@n8n/n8n-nodes-langchain.toolWorkflow',
    'retriever': '@n8n/n8n-nodes-langchain.retrieverVectorStore',
    'output parser': '@n8n/n8n-nodes-langchain.outputParserStructured'
  },
  
  // Operaciones comunes
  operations: {
    'get': 'get',
    'create': 'create',
    'post': 'create',
    'update': 'update',
    'patch': 'update',
    'put': 'update',
    'delete': 'delete',
    'remove': 'delete',
    'list': 'list',
    'getAll': 'getAll',
    'send': 'send',
    'receive': 'receive',
    'execute': 'execute',
    'run': 'execute',
    'upload': 'upload',
    'download': 'download'
  },
  
  // Parámetros comunes y sus correcciones
  parameters: {
    // HTTP Request
    'url': 'url',
    'uri': 'url',
    'endpoint': 'url',
    'method': 'requestMethod',
    'httpMethod': 'requestMethod',
    'headers': 'headers',
    'body': 'body',
    'payload': 'body',
    'data': 'body',
    
    // Funciones
    'code': 'functionCode',
    'script': 'functionCode',
    'function': 'functionCode',
    'javascript': 'functionCode',
    
    // Condicionales
    'condition': 'conditions',
    'expression': 'conditions',
    'rule': 'conditions'
  }
};

// Sistema de tracking de correcciones
class CorrectionTracker {
  static corrections = [];
  static stats = {
    totalCorrections: 0,
    byType: {},
    byPriority: {}
  };
  
  static recordCorrection(type, original, corrected, priority = CORRECTION_RULES.PRIORITY.MEDIUM) {
    const correction = {
      timestamp: new Date().toISOString(),
      type,
      original,
      corrected,
      priority
    };
    
    this.corrections.push(correction);
    this.stats.totalCorrections++;
    this.stats.byType[type] = (this.stats.byType[type] || 0) + 1;
    this.stats.byPriority[priority] = (this.stats.byPriority[priority] || 0) + 1;
  }
  
  static getStats() {
    return {
      ...this.stats,
      recentCorrections: this.corrections.slice(-10),
      totalSessions: this.corrections.length
    };
  }
  
  static reset() {
    this.corrections = [];
    this.stats = {
      totalCorrections: 0,
      byType: {},
      byPriority: {}
    };
  }
}

// CLASE PRINCIPAL DEL AUTOCORRECTOR V4.0
export class WorkflowAutocorrector {
  constructor(options = {}) {
    this.options = {
      strictMode: options.strictMode || false,
      preserveOriginal: options.preserveOriginal !== false,
      enableLangChain: options.enableLangChain !== false,
      logCorrections: options.logCorrections !== false,
      ...options
    };
    
    this.corrections = { ...CORRECTION_DATABASE };
    this.customRules = new Map();
    this.correctionHistory = [];
    
    console.log('🔧 WorkflowAutocorrector V4.0 inicializado');
    if (this.options.logCorrections) {
      console.log('📊 Logging de correcciones habilitado');
    }
  }

  /**
   * Analizar workflow para detectar errores y determinar necesidad de corrección
   */
  async analyzeWorkflow(workflowData) {
    console.log('🔍 Analizando workflow para detectar errores...');
    
    const analysis = {
      errors: [],
      warnings: [],
      suggestions: [],
      needsCorrection: false,
      hasStructuralErrors: false,
      hasParameterErrors: false,
      hasConnectionErrors: false,
      severity: 'low', // low, medium, high, critical
      score: 100 // Score de calidad 0-100
    };

    try {
      // Extraer datos del workflow
      const actualWorkflowData = this.extractWorkflowData(workflowData);
      
      // 1. Validar estructura básica
      if (!this.validateWorkflowStructure(actualWorkflowData)) {
        analysis.errors.push('Estructura del workflow inválida');
        analysis.hasStructuralErrors = true;
        analysis.needsCorrection = true;
        analysis.severity = 'critical';
        analysis.score -= 50;
      }

      // 2. Analizar nodos
      if (actualWorkflowData.nodes && Array.isArray(actualWorkflowData.nodes)) {
        for (const [index, node] of actualWorkflowData.nodes.entries()) {
          const nodeErrors = this.analyzeNode(node, `node_${index}`);
          
          if (nodeErrors.errors.length > 0) {
            analysis.errors.push(...nodeErrors.errors.map(e => `Nodo '${node.name}': ${e}`));
            analysis.hasParameterErrors = true;
            analysis.needsCorrection = true;
            analysis.score -= nodeErrors.errors.length * 5;
          }
          
          if (nodeErrors.warnings.length > 0) {
            analysis.warnings.push(...nodeErrors.warnings.map(w => `Nodo '${node.name}': ${w}`));
            analysis.score -= nodeErrors.warnings.length * 2;
          }
        }
      }

      // 3. Analizar conexiones
      if (actualWorkflowData.connections) {
        const connectionErrors = this.analyzeConnections(actualWorkflowData.connections, actualWorkflowData.nodes);
        
        if (connectionErrors.errors.length > 0) {
          analysis.errors.push(...connectionErrors.errors);
          analysis.hasConnectionErrors = true;
          analysis.needsCorrection = true;
          analysis.score -= connectionErrors.errors.length * 10;
        }
        
        if (connectionErrors.warnings.length > 0) {
          analysis.warnings.push(...connectionErrors.warnings);
          analysis.score -= connectionErrors.warnings.length * 3;
        }
      }

      // 4. Determinar severidad
      if (analysis.errors.length > 5) {
        analysis.severity = 'critical';
      } else if (analysis.errors.length > 2) {
        analysis.severity = 'high';
      } else if (analysis.errors.length > 0 || analysis.warnings.length > 3) {
        analysis.severity = 'medium';
      }

      // 5. Generar sugerencias
      if (analysis.hasParameterErrors) {
        analysis.suggestions.push('Revisar configuración de parámetros en nodos problemáticos');
      }
      if (analysis.hasConnectionErrors) {
        analysis.suggestions.push('Verificar y corregir conexiones entre nodos');
      }
      if (analysis.hasStructuralErrors) {
        analysis.suggestions.push('Reestructurar workflow para cumplir con formato n8n válido');
      }

      // Asegurar que el score esté en el rango 0-100
      analysis.score = Math.max(0, Math.min(100, analysis.score));

      console.log(`🔍 Análisis completado: ${analysis.errors.length} errores, ${analysis.warnings.length} advertencias, score: ${analysis.score}/100`);
      
      return analysis;

    } catch (error) {
      console.error('❌ Error en análisis del workflow:', error.message);
      return {
        ...analysis,
        errors: [`Error crítico en análisis: ${error.message}`],
        needsCorrection: true,
        severity: 'critical',
        score: 0
      };
    }
  }

  /**
   * Analizar un nodo individual para detectar errores
   */
  analyzeNode(node, nodeId) {
    const nodeAnalysis = {
      errors: [],
      warnings: []
    };

    // Verificar campos requeridos
    if (!node.id) {
      nodeAnalysis.errors.push('Falta campo requerido: id');
    }
    if (!node.name) {
      nodeAnalysis.errors.push('Falta campo requerido: name');
    }
    if (!node.type) {
      nodeAnalysis.errors.push('Falta campo requerido: type');
    }
    if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
      nodeAnalysis.warnings.push('Posición inválida o faltante');
    }

    // Verificar typeVersion
    if (!node.typeVersion || typeof node.typeVersion !== 'number') {
      nodeAnalysis.warnings.push('typeVersion faltante o inválido');
    }

    // Verificar parámetros específicos por tipo
    if (node.type && node.type.includes('httpRequest')) {
      if (!node.parameters?.url) {
        nodeAnalysis.errors.push('HTTP Request requiere parámetro url');
      }
      if (!node.parameters?.requestMethod) {
        nodeAnalysis.warnings.push('HTTP Request debería especificar requestMethod');
      }
    }

    // Verificar nodos de función
    if (node.type && node.type.includes('function')) {
      if (!node.parameters?.functionCode) {
        nodeAnalysis.errors.push('Function node requiere functionCode');
      }
    }

    // Verificar nodos condicionales
    if (node.type && node.type.includes('if')) {
      if (!node.parameters?.conditions) {
        nodeAnalysis.errors.push('IF node requiere condiciones');
      }
    }

    return nodeAnalysis;
  }

  /**
   * Analizar conexiones para detectar errores
   */
  analyzeConnections(connections, nodes) {
    const connectionAnalysis = {
      errors: [],
      warnings: []
    };

    if (!connections || typeof connections !== 'object') {
      connectionAnalysis.errors.push('Objeto de conexiones inválido');
      return connectionAnalysis;
    }

    const nodeNames = new Set(nodes?.map(n => n.name) || []);

    for (const [sourceName, connectionData] of Object.entries(connections)) {
      // Verificar que el nodo fuente existe
      if (!nodeNames.has(sourceName)) {
        connectionAnalysis.errors.push(`Nodo fuente inexistente: ${sourceName}`);
        continue;
      }

      if (!connectionData.main || !Array.isArray(connectionData.main)) {
        connectionAnalysis.warnings.push(`Conexiones principales faltantes para: ${sourceName}`);
        continue;
      }

      // Verificar cada rama de conexión
      connectionData.main.forEach((branch, branchIndex) => {
        if (!Array.isArray(branch)) {
          connectionAnalysis.warnings.push(`Rama ${branchIndex} de ${sourceName} no es un array`);
          return;
        }

        branch.forEach((connection, connIndex) => {
          if (!connection.node) {
            connectionAnalysis.errors.push(`Conexión ${sourceName}[${branchIndex}][${connIndex}]: falta nodo destino`);
          } else if (!nodeNames.has(connection.node)) {
            connectionAnalysis.errors.push(`Nodo destino inexistente: ${connection.node}`);
          }

          if (typeof connection.index !== 'number') {
            connectionAnalysis.warnings.push(`Conexión ${sourceName} → ${connection.node}: índice inválido`);
          }

          if (!connection.type) {
            connectionAnalysis.warnings.push(`Conexión ${sourceName} → ${connection.node}: tipo faltante`);
          }
        });
      });
    }

    return connectionAnalysis;
  }

  /**
   * Método principal para corregir un workflow completo
   */
  async correctWorkflow(workflowData, options = {}) {
    try {
      console.log('🔧 Autocorrector V4.0: Iniciando corrección del workflow...');
      
      // Extraer datos del workflow si vienen encapsulados
      const actualWorkflowData = this.extractWorkflowData(workflowData);
      
      if (!this.validateWorkflowStructure(actualWorkflowData)) {
        throw new Error('Estructura del workflow inválida');
      }

      const correctedWorkflow = this.options.preserveOriginal 
        ? JSON.parse(JSON.stringify(actualWorkflowData))
        : actualWorkflowData;

      let correctionCount = 0;
      const sessionId = `session_${Date.now()}`;

      // Paso 1: Corregir nodos
      if (correctedWorkflow.nodes && Array.isArray(correctedWorkflow.nodes)) {
        console.log(`📋 Corrigiendo ${correctedWorkflow.nodes.length} nodos...`);
        
        correctedWorkflow.nodes = await Promise.all(
          correctedWorkflow.nodes.map(async (node, index) => {
            const correctedNode = await this.correctNode(node, sessionId, `node_${index}`);
            if (JSON.stringify(correctedNode) !== JSON.stringify(node)) {
              correctionCount++;
            }
            return correctedNode;
          })
        );
      }

      // Paso 2: Corregir conexiones
      if (correctedWorkflow.connections && typeof correctedWorkflow.connections === 'object') {
        console.log('🔗 Corrigiendo conexiones...');
        const correctedConnections = this.correctConnections(correctedWorkflow.connections, correctedWorkflow.nodes);
        if (JSON.stringify(correctedConnections) !== JSON.stringify(correctedWorkflow.connections)) {
          correctedWorkflow.connections = correctedConnections;
          correctionCount++;
        }
      }

      // Paso 3: Optimizar posiciones si están desordenadas
      if (options.optimizePositions !== false) {
        console.log('📐 Optimizando posiciones de nodos...');
        this.optimizeNodePositions(correctedWorkflow);
      }

      // Paso 4: Validación final
      const validationResult = this.validateCorrectedWorkflow(correctedWorkflow);
      if (!validationResult.isValid) {
        console.warn('⚠️ Advertencias en validación final:', validationResult.warnings);
      }

      console.log(`✅ Autocorrector V4.0: Workflow corregido exitosamente`);
      console.log(`📊 Total de correcciones aplicadas: ${correctionCount}`);

      return {
        success: true,
        workflow: correctedWorkflow,
        correctionCount,
        sessionId,
        validationResult,
        stats: this.getSessionStats(sessionId)
      };

    } catch (error) {
      console.error('❌ Error en Autocorrector V4.0:', error.message);
      return {
        success: false,
        error: error.message,
        workflow: workflowData.workflow || workflowData
      };
    }
  }

  /**
   * Extraer datos del workflow desde diferentes formatos
   */
  extractWorkflowData(data) {
    if (!data) throw new Error('No se proporcionaron datos del workflow');
    
    // Si es un objeto con propiedad workflow
    if (data.workflow && typeof data.workflow === 'object') {
      return data.workflow;
    }
    
    // Si es directamente un workflow
    if (data.nodes || data.connections) {
      return data;
    }
    
    // Si es una string JSON
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return this.extractWorkflowData(parsed);
      } catch (e) {
        throw new Error('JSON inválido proporcionado');
      }
    }
    
    throw new Error('Formato de datos del workflow no reconocido');
  }

  /**
   * Validar estructura básica del workflow
   */
  validateWorkflowStructure(workflow) {
    if (!workflow || typeof workflow !== 'object') {
      return false;
    }
    
    // Debe tener al menos nodos o conexiones
    if (!workflow.nodes && !workflow.connections) {
      return false;
    }
    
    // Si tiene nodos, debe ser un array
    if (workflow.nodes && !Array.isArray(workflow.nodes)) {
      return false;
    }
    
    // Si tiene conexiones, debe ser un objeto
    if (workflow.connections && typeof workflow.connections !== 'object') {
      return false;
    }
    
    return true;
  }

  /**
   * Corregir un nodo individual con análisis avanzado
   */
  async correctNode(node, sessionId, nodeId) {
    if (!node || typeof node !== 'object') return node;

    const correctedNode = { ...node };
    let correctionsMade = 0;

    // Corrección 1: Tipo de nodo
    if (correctedNode.type && typeof correctedNode.type === 'string') {
      const originalType = correctedNode.type;
      const correctedType = this.correctNodeType(originalType);
      
      if (correctedType !== originalType) {
        correctedNode.type = correctedType;
        correctionsMade++;
        
        CorrectionTracker.recordCorrection(
          CORRECTION_RULES.TYPES.NODE_TYPE,
          originalType,
          correctedType,
          CORRECTION_RULES.PRIORITY.HIGH
        );
        
        if (this.options.logCorrections) {
          console.log(`📝 [${nodeId}] Tipo corregido: "${originalType}" → "${correctedType}"`);
        }
      }
    }

    // Corrección 2: Parámetros del nodo
    if (correctedNode.parameters && typeof correctedNode.parameters === 'object') {
      const correctedParams = this.correctNodeParameters(correctedNode.parameters, correctedNode.type);
      if (JSON.stringify(correctedParams) !== JSON.stringify(correctedNode.parameters)) {
        correctedNode.parameters = correctedParams;
        correctionsMade++;
      }
    }

    // Corrección 3: Campos requeridos faltantes
    const requiredFields = this.getRequiredFields(correctedNode.type);
    requiredFields.forEach(field => {
      if (!correctedNode[field]) {
        correctedNode[field] = this.getDefaultValue(field, correctedNode.type);
        correctionsMade++;
        
        if (this.options.logCorrections) {
          console.log(`📝 [${nodeId}] Campo requerido añadido: ${field}`);
        }
      }
    });

    // Corrección 4: TypeVersion
    if (!correctedNode.typeVersion || typeof correctedNode.typeVersion !== 'number') {
      correctedNode.typeVersion = 1;
      correctionsMade++;
    }

    // Corrección 5: Posición válida
    if (!correctedNode.position || !Array.isArray(correctedNode.position) || correctedNode.position.length !== 2) {
      correctedNode.position = [100, 100]; // Posición por defecto
      correctionsMade++;
    }

    // Registrar en historial si hubo correcciones
    if (correctionsMade > 0) {
      this.correctionHistory.push({
        sessionId,
        nodeId,
        originalNode: node,
        correctedNode: correctedNode,
        correctionCount: correctionsMade,
        timestamp: new Date().toISOString()
      });
    }

    return correctedNode;
  }

  /**
   * Corregir tipo de nodo con lógica avanzada
   */
  correctNodeType(type) {
    if (!type || typeof type !== 'string') return type;
    
    const typeLower = type.toLowerCase().trim();
    
    // Búsqueda exacta primero
    if (this.corrections.nodeTypes[typeLower]) {
      return this.corrections.nodeTypes[typeLower];
    }

    // Búsqueda por palabras clave
    for (const [keyword, correctType] of Object.entries(this.corrections.nodeTypes)) {
      if (typeLower.includes(keyword) || keyword.includes(typeLower)) {
        return correctType;
      }
    }

    // Aplicar reglas personalizadas
    for (const [pattern, replacement] of this.customRules) {
      if (pattern instanceof RegExp && pattern.test(type)) {
        return replacement;
      } else if (typeof pattern === 'string' && type.includes(pattern)) {
        return replacement;
      }
    }

    // Si no hay corrección, verificar si es un tipo válido conocido
    if (this.isValidNodeType(type)) {
      return type;
    }

    // Como último recurso, sugerir un tipo genérico
    if (typeLower.includes('trigger')) {
      return 'n8n-nodes-base.manualTrigger';
    } else if (typeLower.includes('http') || typeLower.includes('api')) {
      return 'n8n-nodes-base.httpRequest';
    } else if (typeLower.includes('function') || typeLower.includes('code')) {
      return 'n8n-nodes-base.function';
    }

    return type; // Devolver original si no se puede corregir
  }

  /**
   * Verificar si un tipo de nodo es válido
   */
  isValidNodeType(type) {
    const validPrefixes = [
      'n8n-nodes-base.',
      '@n8n/n8n-nodes-langchain.',
      'n8n-nodes-community.',
      'n8n-nodes-custom.'
    ];
    
    return validPrefixes.some(prefix => type.startsWith(prefix));
  }

  /**
   * Corregir parámetros de un nodo
   */
  correctNodeParameters(parameters, nodeType) {
    if (!parameters || typeof parameters !== 'object') {
      return parameters;
    }

    const correctedParams = { ...parameters };

    // Corregir operación si existe
    if (correctedParams.operation && typeof correctedParams.operation === 'string') {
      const originalOp = correctedParams.operation;
      const correctedOp = this.correctOperation(originalOp);
      
      if (correctedOp !== originalOp) {
        correctedParams.operation = correctedOp;
        
        CorrectionTracker.recordCorrection(
          CORRECTION_RULES.TYPES.OPERATION,
          originalOp,
          correctedOp,
          CORRECTION_RULES.PRIORITY.MEDIUM
        );
      }
    }

    // Aplicar correcciones específicas por tipo de nodo
    if (nodeType) {
      const specificCorrections = this.getNodeSpecificCorrections(nodeType);
      Object.keys(correctedParams).forEach(key => {
        if (specificCorrections[key]) {
          const originalValue = correctedParams[key];
          const correctedValue = specificCorrections[key](originalValue);
          if (correctedValue !== originalValue) {
            correctedParams[key] = correctedValue;
          }
        }
      });
    }

    return correctedParams;
  }

  /**
   * Corregir operación
   */
  correctOperation(operation) {
    if (!operation || typeof operation !== 'string') return operation;
    
    const opLower = operation.toLowerCase().trim();
    
    if (this.corrections.operations[opLower]) {
      return this.corrections.operations[opLower];
    }

    return operation;
  }

  /**
   * Obtener correcciones específicas por tipo de nodo
   */
  getNodeSpecificCorrections(nodeType) {
    const corrections = {};
    
    // HTTP Request corrections
    if (nodeType === 'n8n-nodes-base.httpRequest') {
      corrections.method = (value) => {
        const methodMap = { 'post': 'POST', 'get': 'GET', 'put': 'PUT', 'delete': 'DELETE' };
        return methodMap[value?.toLowerCase()] || value;
      };
    }
    
    // Function node corrections
    if (nodeType === 'n8n-nodes-base.function') {
      corrections.functionCode = (value) => {
        if (!value || typeof value !== 'string') {
          return 'return items;'; // Código básico por defecto
        }
        return value;
      };
    }

    // LangChain corrections
    if (nodeType.startsWith('@n8n/n8n-nodes-langchain.')) {
      corrections.temperature = (value) => {
        const temp = parseFloat(value);
        return isNaN(temp) ? 0.7 : Math.max(0, Math.min(2, temp));
      };
      
      corrections.maxTokens = (value) => {
        const tokens = parseInt(value);
        return isNaN(tokens) ? 1000 : Math.max(1, Math.min(32000, tokens));
      };
    }

    return corrections;
  }

  /**
   * Obtener campos requeridos para un tipo de nodo
   */
  getRequiredFields(nodeType) {
    const baseFields = ['id', 'name', 'type', 'position', 'typeVersion'];
    
    if (nodeType === 'n8n-nodes-base.httpRequest') {
      return [...baseFields, 'parameters'];
    }
    
    if (nodeType === 'n8n-nodes-base.function') {
      return [...baseFields, 'parameters'];
    }
    
    return baseFields;
  }

  /**
   * Obtener valor por defecto para un campo
   */
  getDefaultValue(field, nodeType) {
    const defaults = {
      id: () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: () => 'Unnamed Node',
      typeVersion: () => 1,
      position: () => [100, 100],
      parameters: () => ({})
    };
    
    return defaults[field] ? defaults[field]() : null;
  }

  /**
   * Corregir conexiones del workflow
   */
  correctConnections(connections, nodes) {
    if (!connections || typeof connections !== 'object' || !nodes) {
      return connections;
    }

    const correctedConnections = { ...connections };
    const nodeNames = new Set(nodes.map(n => n.name));
    
    // Limpiar conexiones a nodos que no existen
    Object.keys(correctedConnections).forEach(sourceName => {
      if (!nodeNames.has(sourceName)) {
        console.log(`🗑️ Eliminando conexiones de nodo inexistente: ${sourceName}`);
        delete correctedConnections[sourceName];
        return;
      }
      
      const sourceConnections = correctedConnections[sourceName];
      if (sourceConnections.main) {
        sourceConnections.main = sourceConnections.main.map(connectionGroup => 
          connectionGroup.filter(connection => {
            if (!nodeNames.has(connection.node)) {
              console.log(`🗑️ Eliminando conexión a nodo inexistente: ${connection.node}`);
              return false;
            }
            return true;
          })
        );
        
        // Limpiar grupos de conexiones vacíos
        sourceConnections.main = sourceConnections.main.filter(group => group.length > 0);
      }
      
      // Si no quedan conexiones, eliminar la entrada
      if (!sourceConnections.main || sourceConnections.main.length === 0) {
        delete correctedConnections[sourceName];
      }
    });

    return correctedConnections;
  }

  /**
   * Optimizar posiciones de nodos
   */
  optimizeNodePositions(workflow) {
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) return;

    // Algoritmo simple de layout en grid
    const gridSpacing = 300;
    const startX = 100;
    const startY = 100;
    
    workflow.nodes.forEach((node, index) => {
      const row = Math.floor(index / 4); // 4 nodos por fila
      const col = index % 4;
      
      node.position = [
        startX + (col * gridSpacing),
        startY + (row * gridSpacing)
      ];
    });
  }

  /**
   * Validar workflow corregido
   */
  validateCorrectedWorkflow(workflow) {
    const warnings = [];
    
    // Verificar que todos los nodos tengan nombres únicos
    const nodeNames = workflow.nodes.map(n => n.name);
    const duplicateNames = nodeNames.filter((name, index) => nodeNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      warnings.push(`Nombres de nodos duplicados: ${duplicateNames.join(', ')}`);
    }
    
    // Verificar que todas las conexiones apunten a nodos existentes
    const validNodeNames = new Set(nodeNames);
    Object.values(workflow.connections).forEach(conn => {
      if (conn.main) {
        conn.main.forEach(group => {
          group.forEach(connection => {
            if (!validNodeNames.has(connection.node)) {
              warnings.push(`Conexión a nodo inexistente: ${connection.node}`);
            }
          });
        });
      }
    });
    
    return {
      isValid: warnings.length === 0,
      warnings
    };
  }

  /**
   * Agregar regla personalizada de corrección
   */
  addCustomRule(pattern, replacement) {
    this.customRules.set(pattern, replacement);
  }

  /**
   * Obtener estadísticas de la sesión
   */
  getSessionStats(sessionId) {
    const sessionCorrections = this.correctionHistory.filter(c => c.sessionId === sessionId);
    
    return {
      sessionId,
      totalCorrections: sessionCorrections.length,
      nodesCorrected: sessionCorrections.length,
      totalCorrectionChanges: sessionCorrections.reduce((sum, c) => sum + c.correctionCount, 0),
      globalStats: CorrectionTracker.getStats()
    };
  }

  /**
   * Obtener estadísticas generales
   */
  getStats() {
    return {
      totalSessions: new Set(this.correctionHistory.map(c => c.sessionId)).size,
      totalCorrections: this.correctionHistory.length,
      customRules: this.customRules.size,
      availableCorrections: {
        nodeTypes: Object.keys(this.corrections.nodeTypes).length,
        operations: Object.keys(this.corrections.operations).length,
        parameters: Object.keys(this.corrections.parameters).length
      },
      globalTracker: CorrectionTracker.getStats()
    };
  }

  /**
   * Limpiar historial y estadísticas
   */
  cleanup() {
    this.correctionHistory = [];
    this.customRules.clear();
    CorrectionTracker.reset();
    console.log('🧹 WorkflowAutocorrector limpiado');
  }
}

// Exportaciones adicionales
export { CorrectionTracker, CORRECTION_RULES, CORRECTION_DATABASE };

// Función de conveniencia para uso rápido
export async function correctWorkflow(workflowData, options = {}) {
  const corrector = new WorkflowAutocorrector(options);
  return await corrector.correctWorkflow(workflowData, options);
}

console.log('📦 Workflow Autocorrector V4.0 cargado y listo para uso');
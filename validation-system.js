// Sistema de Validación Independiente para n8n AI Assistant
// Módulo modular y ampliable para validaciones de workflows

class IntegratedValidationOrchestrator {
  constructor() {
    console.log('🔍 ValidationOrchestrator inicializado');
  }

  async validateRepair(repairedJSON, originalJSON, analysis) {
    console.log('🔬 ValidationOrchestrator iniciando validación final...');

    try {
      // Limpieza básica antes de validación
      const cleanedJSON = repairedJSON.replace(/```json|```/g, '').trim();
      console.log(`🧹 JSON limpiado: ${cleanedJSON.length} caracteres`);

      // Intentar parsear el JSON
      const parsed = JSON.parse(cleanedJSON);
      console.log('📊 Validación completada: VÁLIDO (Score: 1)');
      console.log('🐛 Problemas encontrados: 0');

      return {
        isValid: true,
        score: 1,
        issues: [],
        cleanedJSON: cleanedJSON
      };
    } catch (error) {
      console.log('❌ Error de parseo en validación:', error.message);
      return {
        isValid: false,
        score: 0,
        issues: [error.message],
        error: `JSON inválido: ${error.message}`
      };
    }
  }
}

// 🏗️ SISTEMA DE VALIDACIÓN MODULAR PRINCIPAL
class N8nValidationSystem {
  constructor() {
    try {
      console.log('🚀 Sistema de Validación n8n inicializado');

      // 🆕 DEFINICIÓN DE TIPOS DE NODOS VÁLIDOS
      this.validNodeTypes = {
        triggers: [
          'n8n-nodes-base.manualTrigger',
          'n8n-nodes-base.scheduleTrigger',
          'n8n-nodes-base.cron',
          'n8n-nodes-base.webhook',
          'n8n-nodes-base.emailTrigger',
          'n8n-nodes-base.telegramTrigger',
          'n8n-nodes-base.formTrigger'
        ],
        actions: [
          'n8n-nodes-base.set',
          'n8n-nodes-base.function',
          'n8n-nodes-base.httpRequest',
          'n8n-nodes-base.if',
          'n8n-nodes-base.switch',
          'n8n-nodes-base.loopOverItems',
          'n8n-nodes-base.merge',
          'n8n-nodes-base.splitInBatches',
          'n8n-nodes-base.code',
          'n8n-nodes-base.respondToWebhook'
        ],
        data: [
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.mysql',
          'n8n-nodes-base.postgres',
          'n8n-nodes-base.mongodb',
          'n8n-nodes-base.redis',
          'n8n-nodes-base.spreadsheetFile'
        ],
        communication: [
          'n8n-nodes-base.gmail',
          'n8n-nodes-base.telegram',
          'n8n-nodes-base.slack',
          'n8n-nodes-base.discord',
          'n8n-nodes-base.twilio',
          'n8n-nodes-base.sendgrid',
          'n8n-nodes-base.emailSend'
        ],
        calendar: [
          'n8n-nodes-base.googleCalendar',
          'n8n-nodes-base.outlook',
          'n8n-nodes-base.notion',
          'n8n-nodes-base.todoist'
        ],
        ai: [
          'n8n-nodes-base.openAi',
          'n8n-nodes-base.anthropic',
          'n8n-nodes-base.huggingFaceInference',
          'n8n-nodes-base.replicate',
          'n8n-nodes-base.cohere',
          'n8n-nodes-base.pinecone',
          'n8n-nodes-base.weaviate',
          'n8n-nodes-base.chroma',
          'n8n-nodes-base.qdrant'
        ],
        integrations: [
          'n8n-nodes-base.httpRequest',
          'n8n-nodes-base.graphql',
          'n8n-nodes-base.soap',
          'n8n-nodes-base.rssFeed',
          'n8n-nodes-base.ftp',
          'n8n-nodes-base.sftp',
          'n8n-nodes-base.ssh'
        ],
        // 🆕 NUEVAS CATEGORÍAS AMPLIABLES
        analytics: [
          'n8n-nodes-base.googleAnalytics',
          'n8n-nodes-base.mixpanel',
          'n8n-nodes-base.amplitude',
          'n8n-nodes-base.segment'
        ],
        payment: [
          'n8n-nodes-base.stripe',
          'n8n-nodes-base.paypal',
          'n8n-nodes-base.braintree',
          'n8n-nodes-base.authorizeNet'
        ],
        crm: [
          'n8n-nodes-base.salesforce',
          'n8n-nodes-base.hubspot',
          'n8n-nodes-base.zoho',
          'n8n-nodes-base.pipedrive'
        ],
        devops: [
          'n8n-nodes-base.jenkins',
          'n8n-nodes-base.github',
          'n8n-nodes-base.gitlab',
          'n8n-nodes-base.docker'
        ],
        security: [
          'n8n-nodes-base.virusTotal',
          'n8n-nodes-base.shodan',
          'n8n-nodes-base.haveibeenpwned'
        ]
      };

      // 🆕 INICIALIZACIÓN SEGURA CON MANEJO DE ERRORES
      this.nodeValidations = this.getNodeValidations();
      this.credentialValidations = this.getCredentialValidations();
      this.connectionValidations = this.getConnectionValidations();

      // 🆕 INICIALIZACIÓN DEL ORCHESTRATOR
      this.validationOrchestrator = new IntegratedValidationOrchestrator();

      console.log('✅ Sistema de Validación n8n inicializado correctamente');

    } catch (error) {
      console.error('❌ Error en constructor de N8nValidationSystem:', error);
      // Fallback: inicializar con valores mínimos
      this.validNodeTypes = { triggers: [], actions: [], data: [], communication: [], calendar: [], ai: [], integrations: [] };
      this.nodeValidations = {};
      this.credentialValidations = {};
      this.connectionValidations = {};
      this.validationOrchestrator = null;
    }
  }

  // 🎯 MÉTODO PRINCIPAL PARA VALIDAR WORKFLOW COMPLETO
  async validateWorkflow(workflow) {
    console.log('🔍 Iniciando validación completa del workflow...');

    const results = {
      isValid: true,
      errors: [],
      warnings: [],
      corrections: 0
    };

    try {
      // 1. Validación de tipos de nodos
      const nodeValidation = this.validateNodeTypes(workflow);
      results.errors.push(...nodeValidation.errors);
      results.warnings.push(...nodeValidation.warnings);

      // 2. Corrección automática de nodos inválidos
      const corrections = this.autoCorrectInvalidNodes(workflow);
      results.corrections = corrections;

      // 3. Validación de parámetros
      const paramValidation = this.validateNodeParameters(workflow);
      results.errors.push(...paramValidation.errors);
      results.warnings.push(...paramValidation.warnings);

      // 4. Validación de conexiones
      const connectionValidation = this.validateConnections(workflow);
      results.errors.push(...connectionValidation.errors);
      results.warnings.push(...connectionValidation.warnings);

      // 5. Validación de credenciales
      const credentialValidation = this.validateCredentials(workflow);
      results.errors.push(...credentialValidation.errors);
      results.warnings.push(...credentialValidation.warnings);

      results.isValid = results.errors.length === 0;

      console.log(`✅ Validación completada: ${results.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
      console.log(`📊 Errores: ${results.errors.length}, Advertencias: ${results.warnings.length}, Correcciones: ${results.corrections}`);

    } catch (error) {
      console.error('❌ Error en validación:', error);
      results.isValid = false;
      results.errors.push(`Error de validación: ${error.message}`);
    }

    return results;
  }

  // 🔧 VALIDACIÓN DE TIPOS DE NODOS
  validateNodeTypes(workflow) {
    const results = { errors: [], warnings: [] };
    const allValidTypes = Object.values(this.validNodeTypes).flat();

    workflow.nodes.forEach(node => {
      if (!allValidTypes.includes(node.type)) {
        results.errors.push(`Nodo "${node.name}" usa tipo inválido: ${node.type}`);
      }
    });

    return results;
  }

  // 🔧 CORRECCIÓN AUTOMÁTICA DE NODOS INVÁLIDOS
  autoCorrectInvalidNodes(workflow) {
    console.log('🔧 DEBUG: autoCorrectInvalidNodes called');
    console.log('🔧 DEBUG: this.validNodeTypes exists:', !!this.validNodeTypes);
    console.log('🔧 DEBUG: this.validNodeTypes value:', this.validNodeTypes);

    const corrections = this.getNodeCorrections();
    const allValidTypes = Object.values(this.validNodeTypes).flat();
    let correctedCount = 0;

    // 🆕 PRIMERA FASE: CORREGIR IDS DUPLICADOS Y POSICIONES
    const usedIds = new Set();
    const usedPositions = new Set();

    workflow.nodes.forEach((node, index) => {
      // Corregir IDs duplicados
      if (usedIds.has(node.id)) {
        const originalId = node.id;
        node.id = `${node.id}-${Date.now()}-${index}`;
        console.log(`🔧 ID duplicado corregido: ${originalId} → ${node.id}`);
        correctedCount++;
      }
      usedIds.add(node.id);

      // Corregir posiciones superpuestas
      if (node.position && Array.isArray(node.position) && node.position.length >= 2) {
        const positionKey = `${node.position[0]},${node.position[1]}`;
        if (usedPositions.has(positionKey)) {
          const newX = 200 + (index * 350);
          const newY = 200 + ((index % 4) * 200);
          node.position = [newX, newY];
          console.log(`🔧 Posición superpuesta corregida: ${node.name} → [${newX}, ${newY}]`);
          correctedCount++;
        }
        usedPositions.add(positionKey);
      } else {
        // Asignar posición por defecto si no existe
        const defaultX = 200 + (index * 350);
        const defaultY = 200 + ((index % 4) * 200);
        node.position = [defaultX, defaultY];
        console.log(`🔧 Posición por defecto asignada: ${node.name} → [${defaultX}, ${defaultY}]`);
        correctedCount++;
        usedPositions.add(`${defaultX},${defaultY}`);
      }
    });

    // 🆕 SEGUNDA FASE: CORREGIR TIPOS DE NODOS INVÁLIDOS
    workflow.nodes.forEach((node, index) => {
      // Verificar si el tipo de nodo es inválido
      if (!allValidTypes.includes(node.type) && corrections[node.type]) {
        const correction = corrections[node.type];

        console.log(`🔧 CORRIGIENDO NODO INVÁLIDO:`);
        console.log(`   📝 Nombre: ${node.name}`);
        console.log(`   ❌ Tipo anterior: ${node.type}`);
        console.log(`   ✅ Tipo nuevo: ${correction.newType}`);
        console.log(`   💡 Razón: ${correction.reason}`);

        // Aplicar corrección
        const newParams = correction.generateParams(node.parameters || {});

        workflow.nodes[index] = {
          ...node,
          type: correction.newType,
          parameters: newParams,
          name: node.name.replace(/^(Google Vision|WhatsApp Business|Anthropic|Stripe Trigger) - /, '') + ` (${correction.newType.split('.')[1]})`
        };

        correctedCount++;
      }
    });

    // 🆕 TERCERA FASE: CORREGIR CONEXIONES CIRCULARES
    this.fixCircularConnections(workflow);

    // CORRECCIONES ADICIONALES DE PARÁMETROS
    const paramCorrections = this.correctCommonParameterErrors(workflow);
    correctedCount += paramCorrections;

    if (correctedCount > 0) {
      console.log(`✅ ${correctedCount} correcciones automáticas aplicadas`);
    }

    return correctedCount;
  }

  // 🔧 VALIDACIÓN DE PARÁMETROS DE NODOS
  validateNodeParameters(workflow) {
    const results = { errors: [], warnings: [] };

    workflow.nodes.forEach((node, index) => {
      const validation = this.nodeValidations[node.type];
      if (validation) {
        // Verificar parámetros requeridos
        const missingParams = validation.requiredParams.filter(param =>
          !node.parameters || !node.parameters[param]
        );

        if (missingParams.length > 0) {
          results.warnings.push(`Nodo "${node.name}": parámetros faltantes: ${missingParams.join(', ')}`);
        }

        // Verificar tipos de parámetros
        if (validation.parameterTypes) {
          Object.entries(validation.parameterTypes).forEach(([param, expectedType]) => {
            const value = node.parameters?.[param];
            if (value !== undefined && typeof value !== expectedType) {
              results.warnings.push(`Nodo "${node.name}": parámetro "${param}" debería ser ${expectedType}, es ${typeof value}`);
            }
          });
        }
      }
    });

    return results;
  }

  // 🔧 VALIDACIÓN DE CONEXIONES
  validateConnections(workflow) {
    const results = { errors: [], warnings: [] };

    if (!workflow.connections) return results;

    Object.entries(workflow.connections).forEach(([sourceNode, connections]) => {
      const sourceNodeObj = workflow.nodes.find(n => n.name === sourceNode);
      if (!sourceNodeObj) {
        results.errors.push(`Nodo fuente no encontrado: ${sourceNode}`);
        return;
      }

      Object.entries(connections).forEach(([outputName, targets]) => {
        targets.forEach(target => {
          const targetNode = workflow.nodes.find(n => n.name === target.node);
          if (!targetNode) {
            results.errors.push(`Nodo destino no encontrado: ${target.node}`);
            return;
          }

          // Validar compatibilidad de conexiones
          const connectionValidation = this.connectionValidations[sourceNodeObj.type];
          if (connectionValidation) {
            const issues = connectionValidation.validateConnection(targetNode.type, outputName);
            results.errors.push(...issues.errors);
            results.warnings.push(...issues.warnings);
          }
        });
      });
    });

    return results;
  }

  // 🔧 VALIDACIÓN DE CREDENCIALES
  validateCredentials(workflow) {
    const results = { errors: [], warnings: [] };

    workflow.nodes.forEach(node => {
      const credentialValidation = this.credentialValidations[node.type];
      if (credentialValidation) {
        const issues = credentialValidation.validateCredentials(node.parameters || {});
        results.errors.push(...issues.errors);
        results.warnings.push(...issues.warnings);
      }
    });

    return results;
  }

  // 🛠️ MÉTODOS DE UTILIDAD

  // Obtener todos los tipos válidos
  getAllValidTypes() {
    try {
      if (!this.validNodeTypes) {
        console.warn('⚠️ validNodeTypes no definido, usando valores por defecto');
        return [];
      }
      const allTypes = Object.values(this.validNodeTypes).flat();
      console.log(`📊 getAllValidTypes retornando ${allTypes.length} tipos válidos`);
      return allTypes;
    } catch (error) {
      console.error('❌ Error en getAllValidTypes:', error);
      return [];
    }
  }

  // Verificar si un tipo de nodo es válido
  isValidNodeType(nodeType) {
    return this.getAllValidTypes().includes(nodeType);
  }

  // Obtener sugerencia para tipo de nodo inválido
  suggestSimilarNodeType(invalidType) {
    const allValidTypes = Object.values(this.validNodeTypes).flat();

    // Buscar coincidencias por palabras clave
    const invalidWords = invalidType.toLowerCase().split(/[-_.\s]+/);

    for (const validType of allValidTypes) {
      const validWords = validType.toLowerCase().split(/[-_.\s]+/);
      const matches = invalidWords.filter(word =>
        validWords.some(validWord => validWord.includes(word) || word.includes(validWord))
      );

      if (matches.length >= Math.ceil(invalidWords.length / 2)) {
        return validType;
      }
    }

    // Fallback: devolver el tipo más común
    return 'n8n-nodes-base.function';
  }

  // 🆕 MÉTODO PARA EXTENDER VALIDACIONES
  addCustomValidation(validationType, validationFunction) {
    if (!this.customValidations) {
      this.customValidations = {};
    }
    this.customValidations[validationType] = validationFunction;
    console.log(`✅ Validación personalizada agregada: ${validationType}`);
  }

  // 🆕 MÉTODO PARA AGREGAR NUEVOS TIPOS DE NODOS
  addNodeType(category, nodeType) {
    if (!this.validNodeTypes[category]) {
      this.validNodeTypes[category] = [];
    }
    if (!this.validNodeTypes[category].includes(nodeType)) {
      this.validNodeTypes[category].push(nodeType);
      console.log(`✅ Nuevo tipo de nodo agregado: ${nodeType} en categoría ${category}`);
    }
  }

  // 🆕 MÉTODO PARA VALIDAR NODOS DE ANALYTICS
  validateAnalyticsNode(node) {
    const analyticsValidations = {
      'n8n-nodes-base.googleAnalytics': {
        requiredParams: ['trackingId', 'operation'],
        parameterTypes: { trackingId: 'string', operation: 'string' }
      },
      'n8n-nodes-base.mixpanel': {
        requiredParams: ['projectToken', 'operation'],
        parameterTypes: { projectToken: 'string', operation: 'string' }
      }
    };

    return this.validateNodeByType(node, analyticsValidations[node.type]);
  }

  // 🆕 MÉTODO PARA VALIDAR NODOS DE PAYMENT
  validatePaymentNode(node) {
    const paymentValidations = {
      'n8n-nodes-base.stripe': {
        requiredParams: ['operation'],
        parameterTypes: { operation: 'string' },
        requiresCredentials: true
      },
      'n8n-nodes-base.paypal': {
        requiredParams: ['operation'],
        parameterTypes: { operation: 'string' },
        requiresCredentials: true
      }
    };

    return this.validateNodeByType(node, paymentValidations[node.type]);
  }

  // 🆕 MÉTODO PARA VALIDAR NODOS CRM
  validateCrmNode(node) {
    const crmValidations = {
      'n8n-nodes-base.salesforce': {
        requiredParams: ['operation'],
        parameterTypes: { operation: 'string' },
        requiresCredentials: true
      },
      'n8n-nodes-base.hubspot': {
        requiredParams: ['operation'],
        parameterTypes: { operation: 'string' },
        requiresCredentials: true
      }
    };

    return this.validateNodeByType(node, crmValidations[node.type]);
  }

  // 🆕 MÉTODO AUXILIAR PARA VALIDACIÓN POR TIPO
  validateNodeByType(node, validationRules) {
    if (!validationRules) return { isValid: true, errors: [], warnings: [] };

    const results = { isValid: true, errors: [], warnings: [] };

    // Verificar parámetros requeridos
    if (validationRules.requiredParams) {
      const missingParams = validationRules.requiredParams.filter(param =>
        !node.parameters || !node.parameters[param]
      );
      if (missingParams.length > 0) {
        results.errors.push(`Parámetros requeridos faltantes: ${missingParams.join(', ')}`);
        results.isValid = false;
      }
    }

    // Verificar tipos de parámetros
    if (validationRules.parameterTypes) {
      Object.entries(validationRules.parameterTypes).forEach(([param, expectedType]) => {
        const value = node.parameters?.[param];
        if (value !== undefined && typeof value !== expectedType) {
          results.warnings.push(`Parámetro "${param}" debería ser ${expectedType}, es ${typeof value}`);
        }
      });
    }

    // Verificar credenciales requeridas
    if (validationRules.requiresCredentials && !node.credentials) {
      results.errors.push('Este nodo requiere credenciales');
      results.isValid = false;
    }

    return results;
  }

  // 🆕 MÉTODO PARA REMOVER TIPOS DE NODOS
  removeNodeType(nodeType) {
    Object.keys(this.validNodeTypes).forEach(category => {
      const index = this.validNodeTypes[category].indexOf(nodeType);
      if (index > -1) {
        this.validNodeTypes[category].splice(index, 1);
        console.log(`❌ Tipo de nodo removido: ${nodeType} de categoría ${category}`);
      }
    });
  }

  // ==================== FUNCIONES DE VALIDACIÓN DETALLADAS ====================

  getNodeValidations() {
    return {
      'n8n-nodes-base.webhook': {
        requiredParams: ['httpMethod', 'path'],
        parameterTypes: {
          httpMethod: 'string',
          path: 'string',
          responseMode: 'string'
        }
      },
      'n8n-nodes-base.telegram': {
        requiredParams: ['chatId', 'text'],
        parameterTypes: {
          chatId: 'string',
          text: 'string'
        }
      },
      'n8n-nodes-base.gmail': {
        requiredParams: ['operation'],
        parameterTypes: {
          operation: 'string'
        }
      },
      'n8n-nodes-base.googleSheets': {
        requiredParams: ['operation', 'sheetId'],
        parameterTypes: {
          operation: 'string',
          sheetId: 'string'
        }
      },
      'n8n-nodes-base.httpRequest': {
        requiredParams: ['method', 'url'],
        parameterTypes: {
          method: 'string',
          url: 'string'
        }
      },
      'n8n-nodes-base.telegramTrigger': {
        requiredParams: [],
        canBeFirst: true,
        canBeMiddle: false,
        canBeLast: false
      },
      'n8n-nodes-base.googleCalendar': {
        requiredParams: ['operation'],
        parameterTypes: {
          operation: 'string'
        }
      }
    };
  }

  getCredentialValidations() {
    return {
      'n8n-nodes-base.telegram': {
        validateCredentials: (params) => {
          const issues = { errors: [], warnings: [] };
          if (!params.chatId) {
            issues.warnings.push('chatId requerido para Telegram');
          }
          return issues;
        }
      },
      'n8n-nodes-base.gmail': {
        validateCredentials: (params) => {
          const issues = { errors: [], warnings: [] };
          if (!params.serviceAccount || !params.serviceAccountFile) {
            issues.warnings.push('Credenciales de Gmail requeridas');
          }
          return issues;
        }
      },
      'n8n-nodes-base.googleSheets': {
        validateCredentials: (params) => {
          const issues = { errors: [], warnings: [] };
          if (!params.serviceAccount || !params.serviceAccountFile) {
            issues.warnings.push('Credenciales de Google Sheets requeridas');
          }
          return issues;
        }
      },
      'n8n-nodes-base.telegramTrigger': {
        validateCredentials: (params) => {
          const issues = { errors: [], warnings: [] };
          // Telegram trigger requiere credenciales de bot
          issues.warnings.push('Credenciales de bot de Telegram requeridas');
          return issues;
        }
      },
      'n8n-nodes-base.googleCalendar': {
        validateCredentials: (params) => {
          const issues = { errors: [], warnings: [] };
          if (!params.serviceAccount || !params.serviceAccountFile) {
            issues.warnings.push('Credenciales de Google Calendar requeridas');
          }
          return issues;
        }
      }
    };
  }

  getConnectionValidations() {
    return {
      // ===== SECURITY VALIDATIONS =====
      security: {
        requiresAuth: [
          'n8n-nodes-base.gmail',
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.telegram',
          'n8n-nodes-base.slack',
          'n8n-nodes-base.discord',
          'n8n-nodes-base.twitter',
          'n8n-nodes-base.linkedin',
          'n8n-nodes-base.facebook',
          'n8n-nodes-base.instagram',
          'n8n-nodes-base.tiktok',
          'n8n-nodes-base.youtube',
          'n8n-nodes-base.twitch',
          'n8n-nodes-base.spotify',
          'n8n-nodes-base.stripe',
          'n8n-nodes-base.paypal',
          'n8n-nodes-base.shopify',
          'n8n-nodes-base.woocommerce',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.notion',
          'n8n-nodes-base.zapier',
          'n8n-nodes-base.ifttt',
          'n8n-nodes-base.webex',
          'n8n-nodes-base.zoom',
          'n8n-nodes-base.microsoftTeams',
          'n8n-nodes-base.outlook',
          'n8n-nodes-base.office365'
        ]
      },

      // ===== COMPATIBILITY VALIDATIONS =====
      compatibility: {
        'n8n-nodes-base.cron': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.webhook': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.manualTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.scheduleTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.emailTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.telegramTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.slackTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.if': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.switch': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.filter': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.loopOverItems': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.set': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.function': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.code': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.httpRequest': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.emailSend': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.slack': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.telegram': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.googleSheets': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.mysql': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.postgres': { canBeFirst: false, canBeMiddle: true, canBeLast: true }
      },

      // ===== DATA FLOW VALIDATIONS =====
      dataFlow: {
        canWorkWithoutInput: [
          'n8n-nodes-base.cron',
          'n8n-nodes-base.webhook',
          'n8n-nodes-base.manualTrigger',
          'n8n-nodes-base.scheduleTrigger',
          'n8n-nodes-base.emailTrigger',
          'n8n-nodes-base.telegramTrigger',
          'n8n-nodes-base.slackTrigger'
        ]
      },

      // ===== STRUCTURE VALIDATIONS =====
      structure: {
        maxDepth: 10
      },

      // ===== INDIVIDUAL NODE CONNECTION VALIDATIONS =====
      'n8n-nodes-base.telegramTrigger': {
        validateConnection: (targetType, outputName) => {
          const issues = { errors: [], warnings: [] };
          // Validar conexiones desde telegramTrigger
          if (outputName !== 'main') {
            issues.warnings.push(`telegramTrigger debería usar output 'main', no '${outputName}'`);
          }
          return issues;
        }
      },
      'n8n-nodes-base.emailSend': {
        validateConnection: (targetType, outputName) => {
          const issues = { errors: [], warnings: [] };
          // emailSend normalmente no debería tener conexiones salientes
          issues.warnings.push('emailSend es un nodo final y no debería tener conexiones salientes');
          return issues;
        }
      }
    };
  }

  getNodeCorrections() {
    return {
      // Correcciones para tipos de nodos que no existen o son incorrectos
      'n8n-nodes-base.googleVision': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Google Vision debe usar HTTP Request con la API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://vision.googleapis.com/v1/images:annotate',
          authentication: 'serviceAccount',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            requests: [
              {
                image: {
                  content: originalParams.imageUrl ?
                    `={{ $httpRequest("${originalParams.imageUrl}").body }}` :
                    '={{ $base64($binary.data) }}'
                },
                features: [{
                  type: originalParams.operation === 'textDetection' ? 'TEXT_DETECTION' : 'LABEL_DETECTION',
                  maxResults: 50
                }]
              }
            ]
          }
        })
      },

      'n8n-nodes-base.whatsappBusiness': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'WhatsApp Business debe usar HTTP Request con Graph API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://graph.facebook.com/v18.0/{{ $credentials.whatsappPhoneNumberId }}/messages',
          authentication: 'predefinedCredentialType',
          headers: {
            'Authorization': 'Bearer {{ $credentials.whatsappToken }}',
            'Content-Type': 'application/json'
          },
          body: {
            messaging_product: 'whatsapp',
            to: originalParams.to || '={{ $json.phoneNumber }}',
            type: 'text',
            text: {
              body: originalParams.text || originalParams.message || '={{ $json.message }}'
            }
          }
        })
      },

      'n8n-nodes-base.anthropic': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Anthropic/Claude debe usar HTTP Request con la API oficial',
        generateParams: () => ({
          method: 'POST',
          url: 'https://api.anthropic.com/v1/messages',
          authentication: 'predefinedCredentialType',
          headers: {
            'x-api-key': '={{ $credentials.anthropicApiKey }}',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: '={{ $json.prompt }}'
              }
            ]
          }
        })
      },

      'n8n-nodes-base.webhookTrigger': {
        newType: 'n8n-nodes-base.webhook',
        reason: 'Corregir nombre de nodo Webhook',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.cronTrigger': {
        newType: 'n8n-nodes-base.cron',
        reason: 'Corregir nombre de nodo Cron',
        generateParams: (originalParams) => originalParams
      },

      // CORRECCIONES PARA BASES DE DATOS
      'n8n-nodes-base.mysqlDb': {
        newType: 'n8n-nodes-base.mysql',
        reason: 'Usar nodo MySQL oficial',
        generateParams: (originalParams) => ({
          operation: 'executeQuery',
          query: originalParams.query || 'SELECT * FROM table_name LIMIT 10',
          ...originalParams
        })
      },

      'n8n-nodes-base.postgresDb': {
        newType: 'n8n-nodes-base.postgres',
        reason: 'Usar nodo PostgreSQL oficial',
        generateParams: (originalParams) => ({
          operation: 'executeQuery',
          query: originalParams.query || 'SELECT * FROM table_name LIMIT 10',
          ...originalParams
        })
      }
    };
  }

  // 🆕 MÉTODO PARA CORREGIR CONEXIONES CIRCULARES
  fixCircularConnections(workflow) {
    const nodeNames = workflow.nodes.map(node => node.name);
    const connections = workflow.connections || {};

    console.log('🔄 Detectando y corrigiendo conexiones circulares...');

    // Detectar nodos que son tanto triggers como receptores finales
    const triggers = workflow.nodes.filter(node =>
      node.type.includes('webhook') || node.type.includes('trigger') || node.type.includes('cron')
    );

    // Implementar lógica para corregir conexiones circulares
    // (Esta es una implementación básica, se puede expandir)
    Object.keys(connections).forEach(sourceName => {
      if (connections[sourceName].main) {
        connections[sourceName].main = connections[sourceName].main.filter(target => {
          const targetNode = workflow.nodes.find(n => n.name === target.node);
          if (!targetNode) return false;

          // Remover conexiones circulares básicas
          if (target.node === sourceName) {
            console.log(`🔧 Conexión circular removida: ${sourceName} → ${target.node}`);
            return false;
          }

          return true;
        });
      }
    });
  }

  // 🆕 MÉTODO PARA CORREGIR ERRORES COMUNES DE PARÁMETROS
  correctCommonParameterErrors(workflow) {
    let corrections = 0;

    workflow.nodes.forEach((node, index) => {
      // Corrección de parámetros de Telegram
      if (node.type === 'n8n-nodes-base.telegram' && node.parameters) {
        if (node.parameters.chatId && typeof node.parameters.chatId === 'number') {
          node.parameters.chatId = node.parameters.chatId.toString();
          corrections++;
        }
      }

      // Corrección de parámetros de Google Calendar
      if (node.type === 'n8n-nodes-base.googleCalendar' && node.parameters) {
        if (!node.parameters.operation) {
          node.parameters.operation = 'create';
          corrections++;
        }
      }

      // Corrección de parámetros de HTTP Request
      if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters) {
        if (!node.parameters.method) {
          node.parameters.method = 'GET';
          corrections++;
        }
        if (!node.parameters.url) {
          node.parameters.url = 'https://api.example.com';
          corrections++;
        }
      }
    });

    return corrections;
  }
}

// Exportar las clases principales
export { N8nValidationSystem, IntegratedValidationOrchestrator };

// Exportar instancia por defecto para uso fácil
export default new N8nValidationSystem();

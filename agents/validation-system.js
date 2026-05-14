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
          'n8n-nodes-base.start',  // ✅ CORREGIDO: start es el tipo válido
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
          'n8n-nodes-base.aiAgent',
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

      // 🔧 MAPA DE CORRECCIÓN DE TIPOS INVÁLIDOS - FASE 1
      this.invalidTypeCorrections = {
        // Tipos inválidos comunes → Tipos válidos
        'n8n-nodes-base.manualTrigger': 'n8n-nodes-base.start',
        'n8n-nodes-base.manual': 'n8n-nodes-base.start',
        'n8n-nodes-base.trigger': 'n8n-nodes-base.start',
        'manualTrigger': 'n8n-nodes-base.start',
        'manual': 'n8n-nodes-base.start',
        'trigger': 'n8n-nodes-base.start',
        
        // Otras correcciones comunes
        'n8n-nodes-base.mysql': 'n8n-nodes-base.mySql',
        'n8n-nodes-base.mongodb': 'n8n-nodes-base.mongoDb',
        'n8n-nodes-base.email': 'n8n-nodes-base.emailSend',
        'n8n-nodes-base.http': 'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.api': 'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.request': 'n8n-nodes-base.httpRequest',
        
        // Tipos sin prefijo
        'start': 'n8n-nodes-base.start',
        'webhook': 'n8n-nodes-base.webhook',
        'function': 'n8n-nodes-base.function',
        'set': 'n8n-nodes-base.set',
        'if': 'n8n-nodes-base.if',
        'switch': 'n8n-nodes-base.switch',
        'merge': 'n8n-nodes-base.merge',
        'httpRequest': 'n8n-nodes-base.httpRequest',
        'emailSend': 'n8n-nodes-base.emailSend',
        'slack': 'n8n-nodes-base.slack',
        'discord': 'n8n-nodes-base.discord',
        'telegram': 'n8n-nodes-base.telegram',
        'googleSheets': 'n8n-nodes-base.googleSheets',
        'stripe': 'n8n-nodes-base.stripe',
        'salesforce': 'n8n-nodes-base.salesforce',
        'hubspot': 'n8n-nodes-base.hubspot'
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

      // 2. Corrección automática de tipos inválidos - FASE 1
      const typeCorrections = this.autoCorrectInvalidTypes(workflow);
      results.corrections += typeCorrections;

      // 2.5. Limpieza de conexiones fantasma - FASE 2
      const phantomConnectionsCleared = this.cleanPhantomConnections(workflow);
      results.corrections += phantomConnectionsCleared;

      // 2.7. Mejora de nomenclatura de nodos - FASE 3
      const namingImprovements = this.improveNodeNaming(workflow);
      results.corrections += namingImprovements;

      // 2.9. Posicionamiento avanzado con algoritmo Sugiyama - FASE 4
      const positioningImprovements = await this.applyAdvancedPositioning(workflow);
      results.corrections += positioningImprovements;

      // 3. Corrección automática de nodos inválidos (resto de correcciones)
      const generalCorrections = this.autoCorrectInvalidNodes ? this.autoCorrectInvalidNodes(workflow) : 0;
      results.corrections += generalCorrections;

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

  // 🔧 CORRECCIÓN AUTOMÁTICA DE TIPOS INVÁLIDOS - FASE 1
  autoCorrectInvalidTypes(workflow) {
    console.log('🔧 FASE 1: Iniciando corrección automática de tipos inválidos...');
    const allValidTypes = Object.values(this.validNodeTypes).flat();
    let correctedCount = 0;

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      console.warn('⚠️ No hay nodos para corregir');
      return 0;
    }

    workflow.nodes.forEach((node, index) => {
      // Verificar si el tipo es inválido
      if (!allValidTypes.includes(node.type)) {
        const originalType = node.type;
        
        // Buscar corrección en el mapa
        if (this.invalidTypeCorrections[originalType]) {
          node.type = this.invalidTypeCorrections[originalType];
          correctedCount++;
          console.log(`✅ CORREGIDO: "${node.name}" → ${originalType} → ${node.type}`);
        } else {
          // Intento de corrección inteligente basada en el nombre
          const intelligentType = this.getIntelligentTypeFromName(node.name);
          if (intelligentType && allValidTypes.includes(intelligentType)) {
            node.type = intelligentType;
            correctedCount++;
            console.log(`🧠 CORRECCIÓN INTELIGENTE: "${node.name}" → ${originalType} → ${node.type}`);
          } else {
            // Fallback a tipo por defecto
            node.type = 'n8n-nodes-base.function';
            correctedCount++;
            console.log(`⚡ FALLBACK: "${node.name}" → ${originalType} → ${node.type}`);
          }
        }

        // Asegurar parámetros básicos para el tipo corregido
        this.ensureBasicParameters(node);
      }
    });

    console.log(`✅ FASE 1 COMPLETADA: ${correctedCount} tipos corregidos`);
    return correctedCount;
  }

  // 🧠 INTELIGENCIA PARA DETECTAR TIPO BASADO EN NOMBRE
  getIntelligentTypeFromName(nodeName) {
    if (!nodeName || typeof nodeName !== 'string') {
      return null;
    }

    const name = nodeName.toLowerCase().trim();

    // Mapeo inteligente por palabras clave
    const typeMapping = {
      webhook: 'n8n-nodes-base.webhook',
      http: 'n8n-nodes-base.httpRequest',
      api: 'n8n-nodes-base.httpRequest',
      email: 'n8n-nodes-base.emailSend',
      slack: 'n8n-nodes-base.slack',
      discord: 'n8n-nodes-base.discord',
      telegram: 'n8n-nodes-base.telegram',
      stripe: 'n8n-nodes-base.stripe',
      paypal: 'n8n-nodes-base.paypal',
      salesforce: 'n8n-nodes-base.salesforce',
      hubspot: 'n8n-nodes-base.hubspot',
      sheets: 'n8n-nodes-base.googleSheets',
      mysql: 'n8n-nodes-base.mySql',
      postgres: 'n8n-nodes-base.postgres',
      mongodb: 'n8n-nodes-base.mongoDb',
      if: 'n8n-nodes-base.if',
      switch: 'n8n-nodes-base.switch',
      merge: 'n8n-nodes-base.merge',
      function: 'n8n-nodes-base.function',
      trigger: 'n8n-nodes-base.start',
      start: 'n8n-nodes-base.start',
      manual: 'n8n-nodes-base.start'
    };

    // Buscar coincidencias en el nombre
    for (const [keyword, type] of Object.entries(typeMapping)) {
      if (name.includes(keyword)) {
        return type;
      }
    }

    return null;
  }

  // 🔧 ASEGURAR PARÁMETROS BÁSICOS PARA TIPOS CORREGIDOS
  ensureBasicParameters(node) {
    if (!node.parameters) {
      node.parameters = {};
    }

    // Configuraciones específicas por tipo
    switch (node.type) {
      case 'n8n-nodes-base.function':
        if (!node.parameters.functionCode) {
          node.parameters.functionCode = 'return items;';
        }
        break;
      case 'n8n-nodes-base.start':
        // Los nodos start no necesitan parámetros especiales
        break;
      case 'n8n-nodes-base.webhook':
        if (!node.parameters.httpMethod) {
          node.parameters.httpMethod = 'POST';
        }
        if (!node.parameters.path) {
          node.parameters.path = '/webhook';
        }
        break;
      case 'n8n-nodes-base.httpRequest':
        if (!node.parameters.url) {
          node.parameters.url = 'https://api.example.com';
        }
        if (!node.parameters.requestMethod) {
          node.parameters.requestMethod = 'GET';
        }
        break;
    }

    // Asegurar typeVersion
    if (!node.typeVersion) {
      node.typeVersion = 1;
    }
  }

  // 🧹 LIMPIEZA AVANZADA DE CONEXIONES FANTASMA - FASE 2
  cleanPhantomConnections(workflow) {
    console.log('🧹 FASE 2: Iniciando limpieza de conexiones fantasma...');
    let cleanedCount = 0;

    if (!workflow.connections || typeof workflow.connections !== 'object') {
      console.warn('⚠️ No hay conexiones para limpiar');
      return 0;
    }

    // Lista ampliada de patrones problemáticos
    const phantomPatterns = [
      // Palabras exactas problemáticas
      'undefined', 'Undefined', 'UNDEFINED', 'null', 'NULL', 'Null',
      'PREVIOUS_NODE', 'DummyNodeForMerge', 'any_valid_upstream_node',
      'any_previous_node', 'UNKNOWN_SOURCE', 'UNKNOWN_NODE',
      'cualquier_nodo_previo', 'some_upstream_node', 'any_subsequent_node',
      'UNKNOWN_DESTINATION', 'DUMMY_NODE', 'TEMP_NODE', 'PLACEHOLDER_NODE',
      'nodo_temporal', 'upstream_node', 'downstream_node', 'previous_node',
      'next_node', 'source_node', 'target_node', 'phantom_node',
      
      // Patrones de expresiones regulares
      /^any_.*/i,           // Cualquier cosa que empiece con "any_"
      /.*_NODE$/i,          // Cualquier cosa que termine con "_NODE"
      /^UNKNOWN.*/i,        // Cualquier cosa que empiece con "UNKNOWN"
      /.*previous.*/i,      // Cualquier cosa que contenga "previous"
      /.*upstream.*/i,      // Cualquier cosa que contenga "upstream"
      /.*downstream.*/i,    // Cualquier cosa que contenga "downstream"
      /.*phantom.*/i,       // Cualquier cosa que contenga "phantom"
      /.*dummy.*/i,         // Cualquier cosa que contenga "dummy"
      /.*temp.*/i,          // Cualquier cosa que contenga "temp"
      /.*placeholder.*/i,   // Cualquier cosa que contenga "placeholder"
      /^\s*$/,              // Strings vacíos o solo espacios
      /^[0-9]+$/,           // Solo números (IDs problemáticos)
      /.*cualquier.*/i      // Cualquier cosa que contenga "cualquier"
    ];

    // Obtener todos los nombres de nodos válidos
    const validNodeNames = new Set();
    if (workflow.nodes && Array.isArray(workflow.nodes)) {
      workflow.nodes.forEach(node => {
        if (node.name && typeof node.name === 'string' && node.name.trim() !== '') {
          validNodeNames.add(node.name.trim());
        }
      });
    }

    console.log(`🔍 Nodos válidos encontrados: ${validNodeNames.size}`);
    console.log(`📋 Lista de nodos válidos: ${Array.from(validNodeNames).join(', ')}`);

    // Limpiar conexiones problemáticas
    const keysToDelete = [];
    
    Object.keys(workflow.connections).forEach(sourceNodeName => {
      let shouldDeleteSource = false;

      // Verificar si el nombre del nodo fuente es problemático
      if (!sourceNodeName || typeof sourceNodeName !== 'string' || sourceNodeName.trim() === '') {
        shouldDeleteSource = true;
        console.log(`🚨 Eliminando conexión con nombre de fuente vacío/inválido`);
      } else {
        // Verificar contra patrones fantasma
        for (const pattern of phantomPatterns) {
          if (typeof pattern === 'string') {
            if (sourceNodeName === pattern || sourceNodeName.toLowerCase() === pattern.toLowerCase()) {
              shouldDeleteSource = true;
              console.log(`🚨 Eliminando conexión fantasma (patrón exacto): "${sourceNodeName}"`);
              break;
            }
          } else if (pattern instanceof RegExp) {
            if (pattern.test(sourceNodeName)) {
              shouldDeleteSource = true;
              console.log(`🚨 Eliminando conexión fantasma (patrón regex): "${sourceNodeName}"`);
              break;
            }
          }
        }

        // Verificar si el nodo fuente realmente existe
        if (!shouldDeleteSource && !validNodeNames.has(sourceNodeName)) {
          shouldDeleteSource = true;
          console.log(`🚨 Eliminando conexión a nodo inexistente: "${sourceNodeName}"`);
        }
      }

      if (shouldDeleteSource) {
        keysToDelete.push(sourceNodeName);
        cleanedCount++;
      } else {
        // Verificar conexiones específicas dentro del nodo
        const connections = workflow.connections[sourceNodeName];
        if (connections && connections.main && Array.isArray(connections.main)) {
          connections.main.forEach((outputConnections, outputIndex) => {
            if (Array.isArray(outputConnections)) {
              const validConnections = outputConnections.filter(conn => {
                if (!conn || typeof conn !== 'object' || !conn.node) {
                  console.log(`🚨 Eliminando conexión inválida desde "${sourceNodeName}"`);
                  cleanedCount++;
                  return false;
                }

                const targetNodeName = conn.node;
                
                // Verificar si el nombre del nodo destino es problemático
                for (const pattern of phantomPatterns) {
                  if (typeof pattern === 'string') {
                    if (targetNodeName === pattern || targetNodeName.toLowerCase() === pattern.toLowerCase()) {
                      console.log(`🚨 Eliminando conexión a nodo fantasma: "${sourceNodeName}" → "${targetNodeName}"`);
                      cleanedCount++;
                      return false;
                    }
                  } else if (pattern instanceof RegExp) {
                    if (pattern.test(targetNodeName)) {
                      console.log(`🚨 Eliminando conexión a nodo fantasma (regex): "${sourceNodeName}" → "${targetNodeName}"`);
                      cleanedCount++;
                      return false;
                    }
                  }
                }

                // Verificar si el nodo destino realmente existe
                if (!validNodeNames.has(targetNodeName)) {
                  console.log(`🚨 Eliminando conexión a nodo inexistente: "${sourceNodeName}" → "${targetNodeName}"`);
                  cleanedCount++;
                  return false;
                }

                return true;
              });

              // Actualizar las conexiones filtradas
              if (validConnections.length !== outputConnections.length) {
                connections.main[outputIndex] = validConnections;
              }
            }
          });
        }
      }
    });

    // Eliminar nodos fuente problemáticos
    keysToDelete.forEach(key => {
      delete workflow.connections[key];
    });

    console.log(`✅ FASE 2 COMPLETADA: ${cleanedCount} conexiones fantasma eliminadas`);
    return cleanedCount;
  }

  // 🏷️ MEJORA DE NOMENCLATURA DE NODOS - FASE 3
  improveNodeNaming(workflow) {
    console.log('🏷️ FASE 3: Iniciando mejora de nomenclatura de nodos...');
    let improvedCount = 0;

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      console.warn('⚠️ No hay nodos para mejorar nombres');
      return 0;
    }

    // Patrones de nombres problemáticos que necesitan mejora
    const problematicNamePatterns = [
      /^CriticalNode_\d+$/i,        // Nombres críticos temporales
      /^Node\d*$/i,                 // Nombres genéricos como "Node1"
      /^nodo\d*$/i,                 // Nombres genéricos en español
      /^temp.*/i,                   // Nombres temporales
      /^test.*/i,                   // Nombres de prueba
      /^placeholder.*/i,            // Nombres placeholder
      /^dummy.*/i,                  // Nombres dummy
      /^default.*/i,                // Nombres por defecto
      /^new.*/i,                    // Nombres "new..."
      /^untitled.*/i,               // Nombres sin título
      /^unnamed.*/i,                // Nombres sin nombre
      /^\d+$/,                      // Solo números
      /^[a-z]$/i,                   // Solo una letra
      /^[a-z]{1,3}$/i,             // Muy cortos (1-3 letras)
      /.*undefined.*/i,             // Contiene "undefined"
      /.*null.*/i,                  // Contiene "null"
      /.*UNKNOWN.*/i,               // Contiene "UNKNOWN"
      /^\s*$/                       // Vacío o solo espacios
    ];

    // Crear conjunto de nombres existentes para evitar duplicados
    const existingNames = new Set();
    workflow.nodes.forEach(node => {
      if (node.name && typeof node.name === 'string' && node.name.trim() !== '') {
        existingNames.add(node.name.trim().toLowerCase());
      }
    });

    // Mejorar nombres de nodos
    workflow.nodes.forEach((node, index) => {
      let needsImprovement = false;
      const originalName = node.name;

      // Verificar si el nombre actual es problemático
      if (!node.name || typeof node.name !== 'string' || node.name.trim() === '') {
        needsImprovement = true;
      } else {
        for (const pattern of problematicNamePatterns) {
          if (pattern.test(node.name.trim())) {
            needsImprovement = true;
            break;
          }
        }
      }

      if (needsImprovement) {
        const improvedName = this.generateIntelligentNodeName(node, index, existingNames);
        const oldName = node.name;
        node.name = improvedName;
        existingNames.add(improvedName.toLowerCase());
        
        // Actualizar conexiones para reflejar el cambio de nombre
        this.updateConnectionsForRenamedNode(workflow, oldName, improvedName);
        
        improvedCount++;
        console.log(`🏷️ NOMBRE MEJORADO: "${oldName}" → "${improvedName}" (${node.type})`);
      }
    });

    console.log(`✅ FASE 3 COMPLETADA: ${improvedCount} nombres de nodos mejorados`);
    return improvedCount;
  }

  // 🧠 GENERADOR INTELIGENTE DE NOMBRES DE NODOS
  generateIntelligentNodeName(node, index, existingNames) {
    let baseName = '';

    // Generar nombre base según el tipo de nodo
    switch (node.type) {
      case 'n8n-nodes-base.start':
        baseName = 'Start Workflow';
        break;
      case 'n8n-nodes-base.webhook':
        baseName = 'Webhook Trigger';
        break;
      case 'n8n-nodes-base.httpRequest':
        baseName = 'HTTP Request';
        break;
      case 'n8n-nodes-base.emailSend':
        baseName = 'Send Email';
        break;
      case 'n8n-nodes-base.function':
        baseName = 'Process Data';
        break;
      case 'n8n-nodes-base.if':
        baseName = 'Condition Check';
        break;
      case 'n8n-nodes-base.switch':
        baseName = 'Route Data';
        break;
      case 'n8n-nodes-base.merge':
        baseName = 'Merge Data';
        break;
      case 'n8n-nodes-base.set':
        baseName = 'Set Variables';
        break;
      case 'n8n-nodes-base.slack':
        baseName = 'Slack Message';
        break;
      case 'n8n-nodes-base.discord':
        baseName = 'Discord Message';
        break;
      case 'n8n-nodes-base.telegram':
        baseName = 'Telegram Message';
        break;
      case 'n8n-nodes-base.googleSheets':
        baseName = 'Google Sheets';
        break;
      case 'n8n-nodes-base.stripe':
        baseName = 'Stripe Payment';
        break;
      case 'n8n-nodes-base.salesforce':
        baseName = 'Salesforce CRM';
        break;
      case 'n8n-nodes-base.hubspot':
        baseName = 'HubSpot CRM';
        break;
      case 'n8n-nodes-base.mySql':
        baseName = 'MySQL Database';
        break;
      case 'n8n-nodes-base.postgres':
        baseName = 'PostgreSQL Database';
        break;
      case 'n8n-nodes-base.mongoDb':
        baseName = 'MongoDB Database';
        break;
      case 'n8n-nodes-base.cron':
        baseName = 'Schedule Trigger';
        break;
      case 'n8n-nodes-base.wait':
        baseName = 'Wait Delay';
        break;
      case 'n8n-nodes-base.openAi':
        baseName = 'OpenAI Chat';
        break;
      case 'n8n-nodes-base.anthropic':
        baseName = 'Claude AI';
        break;
      default:
        // Intentar extraer el nombre del tipo
        const typeWithoutPrefix = node.type.replace('n8n-nodes-base.', '');
        baseName = typeWithoutPrefix.charAt(0).toUpperCase() + typeWithoutPrefix.slice(1);
        break;
    }

    // Asegurar que el nombre sea único
    let finalName = baseName;
    let counter = 1;
    
    while (existingNames.has(finalName.toLowerCase())) {
      finalName = `${baseName} ${counter}`;
      counter++;
    }

    return finalName;
  }

  // 🔄 ACTUALIZAR CONEXIONES DESPUÉS DE RENOMBRAR NODO
  updateConnectionsForRenamedNode(workflow, oldName, newName) {
    if (!workflow.connections || !oldName || oldName === newName) {
      return;
    }

    // Actualizar conexiones donde el nodo es fuente
    if (workflow.connections[oldName]) {
      workflow.connections[newName] = workflow.connections[oldName];
      delete workflow.connections[oldName];
      console.log(`🔄 Conexión fuente actualizada: "${oldName}" → "${newName}"`);
    }

    // Actualizar conexiones donde el nodo es destino
    Object.keys(workflow.connections).forEach(sourceNodeName => {
      const connections = workflow.connections[sourceNodeName];
      if (connections && connections.main && Array.isArray(connections.main)) {
        connections.main.forEach(outputConnections => {
          if (Array.isArray(outputConnections)) {
            outputConnections.forEach(conn => {
              if (conn && conn.node === oldName) {
                conn.node = newName;
                console.log(`🔄 Conexión destino actualizada: "${sourceNodeName}" → "${oldName}" → "${newName}"`);
              }
            });
          }
        });
      }
    });
  }

  // 🔧 CORRECCIÓN AUTOMÁTICA DE NODOS INVÁLIDOS (VERSIÓN CORREGIDA CON nameChangeMap)
  autoCorrectInvalidNodes(workflow) {
    console.log('🔧 DEBUG: autoCorrectInvalidNodes called');
    console.log('🔧 DEBUG: this.validNodeTypes exists:', !!this.validNodeTypes);
    console.log('🔧 DEBUG: this.validNodeTypes value:', this.validNodeTypes);
    
    const corrections = this.getNodeCorrections();
    const allValidTypes = Object.values(this.validNodeTypes).flat();
    let correctedCount = 0;

    // 🆕 PRIMERA FASE: CORREGIR IDS DUPLICADOS Y POSICIONES
    console.log('🔍 DEBUG autoCorrectInvalidNodes - FASE 1: Corrigiendo IDs y posiciones...');
    
    // 🔍 DEBUG - Conexiones ANTES de FASE 1
    console.log('🔍 DEBUG FASE 1 - Conexiones ANTES:');
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(source => {
        if (workflow.connections[source].main && workflow.connections[source].main[0] && workflow.connections[source].main[0].length > 0) {
          console.log(`   ${source} conecta a: ${workflow.connections[source].main[0].map(c => c.node).join(', ')}`);
        }
      });
    }
    
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

    // 🔍 DEBUG - Conexiones DESPUÉS de FASE 1
    console.log('🔍 DEBUG FASE 1 - Conexiones DESPUÉS:');
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(source => {
        if (workflow.connections[source].main && workflow.connections[source].main[0] && workflow.connections[source].main[0].length > 0) {
          console.log(`   ${source} conecta a: ${workflow.connections[source].main[0].map(c => c.node).join(', ')}`);
        } else {
          console.log(`   ${source} NO TIENE CONEXIONES VÁLIDAS`);
        }
      });
    }

    // 🆕 SEGUNDA FASE: CORREGIR TIPOS DE NODOS INVÁLIDOS
    console.log('🔍 DEBUG autoCorrectInvalidNodes - FASE 2: Corrigiendo tipos de nodos...');
    const nameChangeMap = new Map(); // ✅ CLAVE: Mapa para rastrear cambios de nombre

    workflow.nodes.forEach((node, index) => {
      // Verificar si el tipo de nodo es inválido
      if (!allValidTypes.includes(node.type) && corrections[node.type]) {
        const correction = corrections[node.type];
        const originalName = node.name; // ✅ CLAVE: Guardar el nombre original
        
        console.log(`🔧 CORRIGIENDO NODO INVÁLIDO:`);
        console.log(`   📝 Nombre: ${node.name}`);
        console.log(`   ❌ Tipo anterior: ${node.type}`);
        console.log(`   ✅ Tipo nuevo: ${correction.newType}`);
        console.log(`   💡 Razón: ${correction.reason}`);

        // Aplicar corrección
        const newParams = correction.generateParams(node.parameters || {});
        const newName = node.name.replace(/^(Google Vision|WhatsApp Business|Anthropic|Stripe Trigger) - /, '') + ` (${correction.newType.split('.')[1]})`;

        workflow.nodes[index] = {
          ...node,
          type: correction.newType,
          parameters: newParams,
          name: newName
        };

        // ✅ CLAVE: REGISTRAR EL CAMBIO DE NOMBRE PARA ACTUALIZAR CONEXIONES
        if (originalName !== newName) {
          nameChangeMap.set(originalName, newName);
          console.log(`   🔗 Cambio de nombre registrado: "${originalName}" → "${newName}"`);
        }

        correctedCount++;
      }
    });

    // ✅ CLAVE: FASE 2.5: ACTUALIZAR EL OBJETO DE CONEXIONES CON LOS NUEVOS NOMBRES
    if (nameChangeMap.size > 0 && workflow.connections) {
      console.log('🔗 Actualizando objeto de conexiones con nombres corregidos...');
      const newConnections = {};

      // Iterar sobre las claves originales de las conexiones
      for (const sourceName in workflow.connections) {
        const updatedSourceName = nameChangeMap.get(sourceName) || sourceName;
        
        // Obtener las conexiones del nodo fuente
        const sourceConnections = workflow.connections[sourceName];
        
        if (sourceConnections.main) {
          // Actualizar los nodos de destino en la rama 'main'
          sourceConnections.main.forEach(outputGroup => {
            if (Array.isArray(outputGroup)) {
              outputGroup.forEach(connection => {
                const originalTargetName = connection.node;
                connection.node = nameChangeMap.get(connection.node) || connection.node;
                if (originalTargetName !== connection.node) {
                  console.log(`   🎯 Conexión destino actualizada: "${originalTargetName}" → "${connection.node}"`);
                }
              });
            }
          });
        }

        if (sourceConnections.error) {
          // Actualizar los nodos de destino en la rama 'error'
          sourceConnections.error.forEach(outputGroup => {
            if (Array.isArray(outputGroup)) {
              outputGroup.forEach(connection => {
                const originalTargetName = connection.node;
                connection.node = nameChangeMap.get(connection.node) || connection.node;
                if (originalTargetName !== connection.node) {
                  console.log(`   🎯 Conexión error actualizada: "${originalTargetName}" → "${connection.node}"`);
                }
              });
            }
          });
        }

        // Asignar las conexiones actualizadas a la nueva clave de nombre
        newConnections[updatedSourceName] = sourceConnections;
        
        if (sourceName !== updatedSourceName) {
          console.log(`   🔑 Clave de conexión actualizada: "${sourceName}" → "${updatedSourceName}"`);
        }
      }

      workflow.connections = newConnections; // ✅ CLAVE: Reemplazar el objeto de conexiones antiguo
      console.log(`✅ ${nameChangeMap.size} referencia(s) en conexiones actualizada(s).`);
    }

    // 🔍 DEBUG - Conexiones DESPUÉS de FASE 2
    console.log('🔍 DEBUG FASE 2 - Conexiones DESPUÉS:');
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(source => {
        if (workflow.connections[source].main && workflow.connections[source].main[0] && workflow.connections[source].main[0].length > 0) {
          console.log(`   ${source} conecta a: ${workflow.connections[source].main[0].map(c => c.node).join(', ')}`);
        } else {
          console.log(`   ${source} NO TIENE CONEXIONES VÁLIDAS`);
        }
      });
    }

    // 🆕 TERCERA FASE: CORREGIR CONEXIONES CIRCULARES (SIMPLIFICADO)
    console.log('🔍 DEBUG autoCorrectInvalidNodes - FASE 3: Verificando conexiones circulares...');
    workflow = this.fixCircularConnections(workflow);
    console.log('🔍 DEBUG autoCorrectInvalidNodes - FASE 3 completada');

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
    const invalidWords = (invalidType || '').toLowerCase().split(/[-_.\s]+/);

    for (const validType of allValidTypes) {
      const validWords = (validType || '').toLowerCase().split(/[-_.\s]+/);
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

  // 🆕 MÉTODO PARA CORREGIR CONEXIONES CIRCULARES (CORREGIDO)
  fixCircularConnections(workflow) {
    console.log('🔄 Detectando y corrigiendo conexiones circulares...');
    
    // ✅ CORRECCIÓN: Validar que workflow y connections existen
    if (!workflow || !workflow.connections) {
      console.log('⚠️ No hay conexiones para revisar');
      return workflow;
    }
    
    const nodeNames = workflow.nodes.map(node => node.name);
    let connectionsModified = false;

    // Detectar nodos que son tanto triggers como receptores finales
    const triggers = workflow.nodes.filter(node =>
      node.type.includes('webhook') || node.type.includes('trigger') || node.type.includes('cron')
    );

    // ✅ CORRECCIÓN: Modificar directamente workflow.connections (no una copia local)
    Object.keys(workflow.connections).forEach(sourceName => {
      if (workflow.connections[sourceName].main) {
        const originalCount = workflow.connections[sourceName].main.length;
        
        workflow.connections[sourceName].main = workflow.connections[sourceName].main.filter(outputArray => {
          if (!Array.isArray(outputArray)) return outputArray;
          
          return outputArray.filter(connection => {
            const targetNode = workflow.nodes.find(n => n.name === connection.node);
            if (!targetNode) return false;

            // Remover conexiones circulares básicas
            if (connection.node === sourceName) {
              console.log(`🔧 Conexión circular removida: ${sourceName} → ${connection.node}`);
              connectionsModified = true;
              return false;
            }

            return true;
          });
        });
        
        const newCount = workflow.connections[sourceName].main.length;
        if (originalCount !== newCount) {
          connectionsModified = true;
        }
      }
    });
    
    if (connectionsModified) {
      console.log('✅ Conexiones circulares corregidas');
    } else {
      console.log('✅ No se encontraron conexiones circulares');
    }
    
    // ✅ CORRECCIÓN: Retornar el workflow modificado
    return workflow;
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

  // 🎯 POSICIONAMIENTO AVANZADO CON ALGORITMO SUGIYAMA - FASE 4
  async applyAdvancedPositioning(workflow) {
    console.log('🎯 FASE 4: Iniciando posicionamiento avanzado con algoritmo Sugiyama...');
    
    try {
      // Importar el agente de posicionamiento avanzado
      const { default: AdvancedPositioningAgentV3 } = await import('./advanced-positioning-agent-v3.js');
      const positioningAgent = new AdvancedPositioningAgentV3();
      
      // Aplicar algoritmo Sugiyama
      const positionsUpdated = positioningAgent.applySugiyamaLayout(workflow);
      
      console.log(`✅ FASE 4 COMPLETADA: ${positionsUpdated} posiciones actualizadas con algoritmo Sugiyama`);
      return positionsUpdated;
      
    } catch (error) {
      console.error('❌ Error en posicionamiento avanzado:', error);
      
      // Fallback: posicionamiento simple
      console.log('🔄 Aplicando posicionamiento simple de fallback...');
      return this.applySimplePositioning(workflow);
    }
  }

  // 📊 POSICIONAMIENTO SIMPLE DE FALLBACK
  applySimplePositioning(workflow) {
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      return 0;
    }

    let positioned = 0;
    const cols = Math.ceil(Math.sqrt(workflow.nodes.length));
    const spacing = 250;

    workflow.nodes.forEach((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 100 + col * spacing;
      const y = 100 + row * spacing;
      
      node.position = [x, y];
      positioned++;
    });

    console.log(`📊 Posicionamiento simple aplicado: ${positioned} nodos`);
    return positioned;
  }
}

// Exportar las clases principales
export { N8nValidationSystem, IntegratedValidationOrchestrator };

// Exportar instancia por defecto para uso fácil
export default new N8nValidationSystem();

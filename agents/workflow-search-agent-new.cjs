const fs = require('fs').promises;
const path = require('path');

class WorkflowSearchAgentNew {
  constructor(databasePath = null) {
    // Configuración de la base de datos
    this.databasePath = databasePath || "C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\workflows";
    
    // Índices para búsqueda rápida
    this.workflowDatabase = new Map(); // category -> workflows[]
    this.categoryIndex = new Map();    // category -> workflows[]
    this.serviceIndex = new Map();     // service -> workflows[]
    this.keywordIndex = new Map();     // keyword -> workflows[]
    this.tagIndex = new Map();         // tag -> workflows[]
    
    // Estado de inicialización
    this.isInitialized = false;
    this.initializationPromise = null;
    
    // Caché para búsquedas en tiempo real
    this.realTimeIndex = new Map();
    
    console.log(`📁 WorkflowSearchAgentNew configurado para usar: ${this.databasePath}`);
  }

  /**
   * Inicializar la base de datos indexando todos los workflows
   */
  async initializeDatabase() {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    await this.initializationPromise;
  }

  async _performInitialization() {
    try {
      const startTime = Date.now();
      console.log('🔄 Inicializando base de datos de workflows...');

      // Verificar si la ruta existe
      try {
        await fs.access(this.databasePath);
      } catch (error) {
        console.warn(`⚠️ Base de datos no accesible en ${this.databasePath}, usando ejemplos curados`);
        this.isInitialized = true;
        return;
      }

      // Leer todas las categorías
      const categories = await fs.readdir(this.databasePath);
      
      for (const category of categories) {
        const categoryPath = path.join(this.databasePath, category);
        
        try {
          const stat = await fs.stat(categoryPath);
          if (!stat.isDirectory()) continue;

          // Leer metadata de la categoría
          const metadataPath = path.join(categoryPath, 'metadata.json');
          let categoryMetadata = {};
          
          try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            categoryMetadata = JSON.parse(metadataContent);
          } catch (metaError) {
            console.warn(`⚠️ No se pudo leer metadata para categoría ${category}`);
          }

          // Leer todos los workflows de la categoría
          const files = await fs.readdir(categoryPath);
          const workflows = [];

          for (const file of files) {
            if (file.endsWith('.json') && file !== 'metadata.json') {
              try {
                const workflowPath = path.join(categoryPath, file);
                const workflowContent = await fs.readFile(workflowPath, 'utf8');
                const workflowData = JSON.parse(workflowContent);

                // Crear entrada de workflow enriquecida
                const workflowEntry = {
                  id: workflowData.id || `${category}_${file}`,
                  filename: file,
                  category: category,
                  title: workflowData.name || categoryMetadata.title || file.replace('.json', ''),
                  description: workflowData.description || categoryMetadata.description || '',
                  services: this.extractServices(workflowData),
                  actions: this.extractActions(workflowData, categoryMetadata),
                  keywords: this.extractKeywords(workflowData, categoryMetadata),
                  complexity: this.determineComplexity(workflowData),
                  nodeCount: workflowData.nodes ? workflowData.nodes.length : 0,
                  workflow: workflowData
                };

                workflows.push(workflowEntry);
                this.indexWorkflow(workflowEntry);

              } catch (fileError) {
                console.warn(`⚠️ Error procesando archivo ${file} en ${category}:`, fileError.message);
              }
            }
          }

          if (workflows.length > 0) {
            this.workflowDatabase.set(category, workflows);
            this.categoryIndex.set(category, workflows);
            console.log(`✅ Categoría ${category}: ${workflows.length} workflows indexados`);
          }

        } catch (categoryError) {
          console.warn(`⚠️ Error procesando categoría ${category}:`, categoryError.message);
        }
      }

      const endTime = Date.now();
      const totalWorkflows = this.getTotalWorkflowCount();
      
      console.log(`✅ Base de datos inicializada en ${endTime - startTime}ms`);
      console.log(`📊 Total: ${totalWorkflows} workflows en ${this.workflowDatabase.size} categorías`);
      
      this.isInitialized = true;

    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error);
      this.isInitialized = true; // Continuar con ejemplos curados
    }
  }

  /**
   * Indexar un workflow individual para búsqueda rápida
   */
  indexWorkflow(workflow) {
    // Índice por servicios
    for (const service of workflow.services) {
      if (!this.serviceIndex.has(service)) {
        this.serviceIndex.set(service, []);
      }
      this.serviceIndex.get(service).push(workflow);
    }

    // Índice por palabras clave
    for (const keyword of workflow.keywords) {
      if (!this.keywordIndex.has(keyword)) {
        this.keywordIndex.set(keyword, []);
      }
      this.keywordIndex.get(keyword).push(workflow);
    }

    // Índice por acciones
    for (const action of workflow.actions) {
      if (!this.tagIndex.has(action)) {
        this.tagIndex.set(action, []);
      }
      this.tagIndex.get(action).push(workflow);
    }
  }

  /**
   * Extraer servicios del workflow
   */
  extractServices(workflowData) {
    const services = new Set();
    
    if (workflowData.nodes) {
      for (const node of workflowData.nodes) {
        if (node.type) {
          // Extraer servicio del tipo de nodo
          const serviceMatch = node.type.match(/n8n-nodes-base\.(\w+)/);
          if (serviceMatch) {
            services.add(serviceMatch[1]);
          }
        }
      }
    }

    return Array.from(services);
  }

  /**
   * Extraer acciones del workflow y metadata
   */
  extractActions(workflowData, metadata) {
    const actions = new Set();
    
    // Acciones desde metadata
    if (metadata && metadata.actions) {
      metadata.actions.forEach(action => actions.add(action.toLowerCase()));
    }

    // Acciones inferidas del contenido
    const content = JSON.stringify(workflowData).toLowerCase();
    const actionPatterns = [
      'send', 'enviar', 'create', 'crear', 'update', 'actualizar',
      'delete', 'eliminar', 'read', 'leer', 'process', 'procesar',
      'transform', 'transformar', 'filter', 'filtrar', 'notify', 'notificar'
    ];

    for (const pattern of actionPatterns) {
      if (content.includes(pattern)) {
        actions.add(pattern);
      }
    }

    return Array.from(actions);
  }

  /**
   * Extraer palabras clave del workflow y metadata
   */
  extractKeywords(workflowData, metadata) {
    const keywords = new Set();
    
    // Keywords desde metadata
    if (metadata && metadata.keywords) {
      metadata.keywords.forEach(keyword => keywords.add(keyword.toLowerCase()));
    }

    // Keywords desde el nombre y descripción
    const name = (workflowData.name || '').toLowerCase();
    const description = (workflowData.description || '').toLowerCase();
    
    // Palabras del título
    name.split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });

    // Palabras de la descripción
    description.split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });

    return Array.from(keywords);
  }

  /**
   * Determinar complejidad del workflow
   */
  determineComplexity(workflowData) {
    const nodeCount = workflowData.nodes ? workflowData.nodes.length : 0;
    
    if (nodeCount <= 3) return 'simple';
    if (nodeCount <= 7) return 'medium';
    return 'high';
  }

  /**
   * Búsqueda principal (API pública)
   */
  async search(query, options = {}) {
    await this.initializeDatabase();
    
    try {
      const startTime = Date.now();
      
      // Si no hay base de datos disponible, usar ejemplos curados
      if (this.workflowDatabase.size === 0) {
        return this.fallbackToCuratedExamples(query);
      }

      // Realizar búsqueda híbrida
      const results = await this.hybridSearch(query, options);
      const searchTime = Date.now() - startTime;

      return {
        query,
        results: results.slice(0, options.limit || 10),
        totalResults: results.length,
        searchTime,
        databaseUsed: true
      };

    } catch (error) {
      console.error('Error en búsqueda:', error);
      return this.fallbackToCuratedExamples(query);
    }
  }

  /**
   * Búsqueda híbrida combinando múltiples estrategias
   */
  async hybridSearch(query, options) {
    const resultsMap = new Map();
    const queryLower = query.toLowerCase();

    // 1. Búsqueda por categoría inferida
    const inferredCategory = this.inferCategoryFromQuery(query);
    if (inferredCategory && this.categoryIndex.has(inferredCategory)) {
      const categoryResults = this.categoryIndex.get(inferredCategory).map(w => ({
        ...w,
        relevanceScore: 0.9,
        matchType: 'category'
      }));
      this.addToResults(resultsMap, categoryResults, 'category');
    }

    // 2. Búsqueda por servicios
    for (const [service, workflows] of this.serviceIndex.entries()) {
      if (this.isServiceMentioned(queryLower, service)) {
        const serviceResults = workflows.map(w => ({
          ...w,
          relevanceScore: 0.95,
          matchType: 'service'
        }));
        this.addToResults(resultsMap, serviceResults, 'service');
      }
    }

    // 3. Búsqueda por palabras clave
    const queryWords = queryLower.split(/\s+/);
    for (const word of queryWords) {
      if (word.length > 2) {
        for (const [keyword, workflows] of this.keywordIndex.entries()) {
          if (keyword.includes(word) || word.includes(keyword)) {
            const relevance = this.calculateKeywordRelevance(word, keyword);
            const keywordResults = workflows.map(w => ({
              ...w,
              relevanceScore: relevance,
              matchType: 'keyword'
            }));
            this.addToResults(resultsMap, keywordResults, 'keyword');
          }
        }
      }
    }

    // 4. Búsqueda semántica
    const queryTerms = this.extractSemanticTerms(query);
    for (const [category, workflows] of this.workflowDatabase.entries()) {
      for (const workflow of workflows) {
        const semanticScore = this.calculateSemanticScore(workflow, queryTerms, queryLower);
        if (semanticScore > 0.3) {
          const key = workflow.id || `${workflow.category}_${workflow.filename}`;
          if (!resultsMap.has(key)) {
            resultsMap.set(key, {
              ...workflow,
              relevanceScore: semanticScore,
              matchType: 'semantic'
            });
          }
        }
      }
    }

    // Convertir a array y rankear
    const results = Array.from(resultsMap.values());
    return this.rankResultsByRelevance(results, query, options);
  }

  /**
   * Añadir resultados evitando duplicados
   */
  addToResults(resultsMap, newResults, matchType) {
    for (const result of newResults) {
      const key = result.id || `${result.category}_${result.filename}`;
      if (!resultsMap.has(key)) {
        resultsMap.set(key, { ...result, matchType });
      } else {
        // Combinar tipos de match si ya existe
        const existing = resultsMap.get(key);
        existing.matchType = `${existing.matchType},${matchType}`;
        existing.relevanceScore = Math.max(existing.relevanceScore, result.relevanceScore || 0);
      }
    }
  }

  /**
   * Determinar si un servicio es mencionado en el query
   */
  isServiceMentioned(queryLower, service) {
    // Mapeo de aliases comunes
    const serviceAliases = {
      'gmail': ['email', 'correo', 'mail'],
      'slack': ['canal', 'mensaje', 'notificación'],
      'googlesheets': ['hoja de cálculo', 'excel', 'spreadsheet'],
      'googledrive': ['drive', 'archivo', 'subir'],
      'webhook': ['endpoint', 'api call', 'http'],
      'cron': ['programar', 'schedule', 'automático']
    };

    const aliases = serviceAliases[service] || [];
    return aliases.some(alias => queryLower.includes(alias));
  }

  /**
   * Calcular relevancia de keyword
   */
  calculateKeywordRelevance(queryWord, keyword) {
    if (queryWord === keyword) return 1.0;
    if (queryWord.includes(keyword) || keyword.includes(queryWord)) return 0.8;
    return 0.6;
  }

  /**
   * Extraer términos semánticos del query
   */
  extractSemanticTerms(query) {
    const terms = query.split(/\s+/).filter(word => word.length > 2);
    return {
      actions: terms.filter(term => this.isActionWord(term)),
      entities: terms.filter(term => this.isEntityWord(term)),
      modifiers: terms.filter(term => this.isModifierWord(term)),
      allTerms: terms
    };
  }

  isActionWord(word) {
    const actionWords = ['enviar', 'crear', 'actualizar', 'procesar', 'automatizar', 'notificar', 'leer', 'escribir'];
    return actionWords.some(action => word.includes(action) || action.includes(word));
  }

  isEntityWord(word) {
    const entityWords = ['email', 'archivo', 'datos', 'mensaje', 'notificación', 'pedido', 'cliente'];
    return entityWords.some(entity => word.includes(entity) || entity.includes(word));
  }

  isModifierWord(word) {
    const modifierWords = ['automático', 'manual', 'programado', 'inmediato', 'condicional'];
    return modifierWords.some(modifier => word.includes(modifier) || modifier.includes(word));
  }

  /**
   * Calcular score semántico
   */
  calculateSemanticScore(workflow, queryTerms, queryLower) {
    let score = 0;
    const title = (workflow.title || '').toLowerCase();
    const description = (workflow.description || '').toLowerCase();
    const keywords = (workflow.keywords || []).join(' ').toLowerCase();
    const actions = (workflow.actions || []).join(' ').toLowerCase();

    // Puntuación por coincidencias en título (peso alto)
    for (const term of queryTerms.allTerms) {
      if (title.includes(term)) score += 0.3;
      if (description.includes(term)) score += 0.2;
      if (keywords.includes(term)) score += 0.25;
      if (actions.includes(term)) score += 0.2;
    }

    // Bonus por coincidencias de acciones
    for (const action of queryTerms.actions) {
      if (actions.includes(action)) score += 0.15;
    }

    // Normalizar score
    return Math.min(score, 1.0);
  }

  /**
   * Inferir categoría del query
   */
  inferCategoryFromQuery(query) {
    const queryLower = query.toLowerCase();
    
    const categoryMap = {
      'gmail': ['gmail', 'email', 'correo'],
      'slack': ['slack', 'canal', 'mensaje'],
      'googlesheets': ['sheets', 'hoja de cálculo', 'excel'],
      'crm': ['crm', 'cliente', 'contacto', 'hubspot'],
      'automation': ['automatizar', 'programar', 'trigger'],
      'api-integration': ['api', 'webhook', 'endpoint'],
      'data-processing': ['procesar', 'transformar', 'datos'],
      'e-commerce': ['tienda', 'pedido', 'producto', 'shopify'],
      'social-media': ['social', 'twitter', 'facebook', 'instagram']
    };

    for (const [category, terms] of Object.entries(categoryMap)) {
      if (terms.some(term => queryLower.includes(term))) {
        return category;
      }
    }

    return null;
  }

  /**
   * Rankear resultados por relevancia
   */
  rankResultsByRelevance(results, query, options) {
    return results
      .map(result => {
        // Calcular score combinado
        let finalScore = result.relevanceScore || 0;
        
        // Bonus por match múltiple
        if (result.matchType && result.matchType.includes(',')) {
          finalScore += 0.2;
        }

        // Bonus por complejidad apropiada
        if (query.toLowerCase().includes('simple') && result.complexity === 'simple') {
          finalScore += 0.1;
        }
        if (query.toLowerCase().includes('complejo') && result.complexity === 'high') {
          finalScore += 0.1;
        }

        return { ...result, finalScore };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  /**
   * Fallback a ejemplos curados si la base de datos no está disponible
   */
  fallbackToCuratedExamples(query) {
    console.log('⚠️ Usando fallback a ejemplos curados');
    const curatedExamples = this.getCuratedExamples();
    
    return {
      query,
      results: curatedExamples.slice(0, 5),
      totalResults: curatedExamples.length,
      searchTime: 0,
      fallback: true,
      message: 'Base de datos no disponible, usando ejemplos curados'
    };
  }

  /**
   * Obtener ejemplos curados originales
   */
  getCuratedExamples() {
    return [
      {
        id: 'gmail-automation',
        title: 'Automatización de Gmail',
        description: 'Procesa emails entrantes automáticamente',
        services: ['Gmail', 'Webhook'],
        actions: ['leer', 'procesar', 'responder'],
        keywords: ['email', 'automatización', 'filtros'],
        complexity: 'medium',
        nodeCount: 5,
        category: 'gmail',
        filename: 'gmail-automation.json'
      },
      {
        id: 'slack-notifications',
        title: 'Notificaciones Slack',
        description: 'Envía notificaciones automáticas a Slack',
        services: ['Slack', 'Webhook'],
        actions: ['enviar', 'notificar'],
        keywords: ['slack', 'notificaciones', 'webhook'],
        complexity: 'simple',
        nodeCount: 3,
        category: 'slack',
        filename: 'slack-notifications.json'
      },
      {
        id: 'data-sync',
        title: 'Sincronización de Datos',
        description: 'Sincroniza datos entre diferentes servicios',
        services: ['Google Sheets', 'API'],
        actions: ['sincronizar', 'actualizar'],
        keywords: ['datos', 'sincronización', 'api'],
        complexity: 'high',
        nodeCount: 8,
        category: 'data-processing',
        filename: 'data-sync.json'
      }
    ];
  }

  /**
   * Obtener total de workflows
   */
  getTotalWorkflowCount() {
    let total = 0;
    for (const workflows of this.workflowDatabase.values()) {
      total += workflows.length;
    }
    return total;
  }

  /**
   * Método para buscar workflows similares (usado por el servidor)
   */
  async searchSimilarWorkflows(prompt) {
    try {
      const searchPrompt = typeof prompt === 'string' ? prompt : 
                          prompt?.enhancedPrompt || prompt?.prompt || 
                          JSON.stringify(prompt);
                          
      console.log('🔍 Buscando workflows similares para:', searchPrompt.substring(0, 100) + '...');
      
      const searchResult = await this.search(searchPrompt, { limit: 5 });
      
      return searchResult.results.map(workflow => ({
        workflow: workflow.workflow || {
          id: workflow.id,
          name: workflow.title,
          description: workflow.description,
          nodes: [],
          connections: {}
        },
        similarity: workflow.finalScore || workflow.relevanceScore || 0,
        metadata: {
          description: workflow.description,
          tags: workflow.keywords || [],
          category: workflow.category || 'general',
          complexity: workflow.complexity || 'medium'
        }
      }));

    } catch (error) {
      console.error('Error buscando workflows similares:', error);
      
      // Fallback a ejemplos curados
      const curatedExamples = this.getCuratedExamples();
      return curatedExamples.slice(0, 3).map(example => ({
        workflow: {
          id: example.id,
          name: example.title,
          description: example.description,
          nodes: [],
          connections: {}
        },
        similarity: 0.7,
        metadata: {
          description: example.description,
          tags: example.keywords,
          category: example.category,
          complexity: example.complexity
        }
      }));
    }
  }
}

module.exports = WorkflowSearchAgentNew;
// Workflow Search Agent New - Versión Avanzada con Búsqueda en Tiempo Real
// Sistema de búsqueda inteligente mejorado con características avanzadas

class WorkflowSearchAgentNew {
  constructor(options = {}) {
    this.options = {
      maxResults: options.maxResults || 100,
      searchTimeout: options.searchTimeout || 5000,
      realTimeSearch: options.realTimeSearch !== false,
      advancedFilters: options.advancedFilters !== false,
      fuzzyMatching: options.fuzzyMatching !== false,
      semanticBoost: options.semanticBoost !== false,
      indexUpdateInterval: options.indexUpdateInterval || 1800000, // 30 minutos
      ...options
    };

    this.workflowIndex = new Map();
    this.realTimeIndex = new Map();
    this.filterIndex = new Map();
    this.semanticIndex = new Map();
    this.searchHistory = [];
    this.popularSearches = new Map();

    this.searchStrategies = {
      realtime: this.performRealTimeSearch.bind(this),
      advanced: this.performAdvancedSearch.bind(this),
      semantic: this.enhancedSemanticSearch.bind(this),
      fuzzy: this.enhancedFuzzySearch.bind(this),
      hybrid: this.performAdvancedSearch.bind(this)
    };

    this.filterTypes = {
      date: this.filterByDate.bind(this),
      author: this.filterByAuthor.bind(this),
      tags: this.filterByTags.bind(this),
      complexity: this.filterByComplexity.bind(this),
      performance: this.filterByPerformance.bind(this),
      custom: this.filterByCustom.bind(this)
    };

    this.lastIndexUpdate = Date.now();
    this.isIndexing = false;
    this.searchMetrics = {
      totalSearches: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      popularQueries: []
    };

    console.log('🔍 Workflow Search Agent New inicializado con búsqueda en tiempo real');
  }

  // Método principal de búsqueda mejorado
  async search(query, options = {}) {
    try {
      console.log('🔍 Workflow Search Agent New: Búsqueda avanzada...');

      if (!query || typeof query !== 'string') {
        throw new Error('Consulta de búsqueda inválida');
      }

      const searchOptions = { ...this.options, ...options };
      const startTime = Date.now();

      // Registrar búsqueda para analytics
      this.recordSearch(query, searchOptions);

      // Búsqueda en tiempo real si está habilitada
      if (searchOptions.realTimeSearch) {
        return await this.performRealTimeSearch(query, searchOptions);
      }

      // Búsqueda avanzada normal
      const results = await this.performAdvancedSearch(query, searchOptions);

      // Aplicar filtros avanzados
      const filteredResults = await this.applyAdvancedFilters(results, searchOptions);

      // Rankear con algoritmo mejorado
      const rankedResults = await this.enhancedRanking(filteredResults, query, searchOptions);

      // Preparar respuesta con métricas
      const response = {
        query: query,
        results: rankedResults.slice(0, searchOptions.maxResults),
        totalResults: rankedResults.length,
        searchTime: Date.now() - startTime,
        searchOptions: searchOptions,
        metrics: this.getSearchMetrics(),
        suggestions: this.generateSearchSuggestions(query),
        facets: this.generateFacets(rankedResults)
      };

      return response;

    } catch (error) {
      console.error('❌ Error en Workflow Search Agent New:', error);
      return {
        query: query,
        results: [],
        error: error.message,
        searchTime: 0
      };
    }
  }

  // Búsqueda en tiempo real
  async performRealTimeSearch(query, options) {
    const results = [];
    const searchId = this.generateSearchId();

    // Iniciar búsqueda en tiempo real
    this.realTimeIndex.set(searchId, {
      query: query,
      results: results,
      isActive: true,
      startTime: Date.now()
    });

    try {
      // Primera búsqueda inmediata
      const immediateResults = await this.quickSearch(query, options);
      if (Array.isArray(immediateResults)) {
        results.push(...immediateResults);
      } else if (immediateResults && immediateResults.results) {
        results.push(...immediateResults.results);
      }

      // Continuar búsqueda en background si es necesario
      if (options.deepSearch) {
        setTimeout(async () => {
          const deepResults = await this.deepSearch(query, options);
          if (Array.isArray(deepResults)) {
            results.push(...deepResults);
          } else if (deepResults && deepResults.results) {
            results.push(...deepResults.results);
          }
          this.updateRealTimeResults(searchId, results);
        }, 100);
      }

      return {
        query: query,
        results: results,
        isRealTime: true,
        searchId: searchId,
        partial: !options.deepSearch
      };

    } catch (error) {
      this.realTimeIndex.delete(searchId);
      throw error;
    }
  }

  // Búsqueda avanzada
  async performAdvancedSearch(query, options) {
    const results = [];

    // Extraer componentes de la consulta
    const queryComponents = this.parseQuery(query);

    // Búsqueda paralela por múltiples estrategias
    const searchPromises = [
      this.enhancedSemanticSearch(queryComponents, options),
      this.enhancedKeywordSearch(queryComponents, options),
      this.enhancedTagSearch(queryComponents, options),
      this.enhancedNodeSearch(queryComponents, options)
    ];

    if (options.fuzzyMatching) {
      searchPromises.push(this.enhancedFuzzySearch(queryComponents, options));
    }

    const searchResults = await Promise.all(searchPromises);

    // Combinar y deduplicar resultados
    const allResults = searchResults.flat();
    const uniqueResults = this.deduplicateResults(allResults);

    return uniqueResults;
  }

  // Parsear consulta avanzada
  parseQuery(query) {
    const components = {
      keywords: [],
      tags: [],
      nodes: [],
      filters: {},
      operators: []
    };

    // Extraer tags (#tag)
    const tagMatches = query.match(/#(\w+)/g);
    if (tagMatches) {
      components.tags = tagMatches.map(tag => tag.slice(1));
      query = query.replace(/#\w+/g, '');
    }

    // Extraer operadores (author:, date:, complexity:)
    const operatorMatches = query.match(/(\w+):/g);
    if (operatorMatches) {
      for (const op of operatorMatches) {
        const opName = op.slice(0, -1);
        const opValue = query.match(new RegExp(`${opName}:\\s*([^\\s]+)`))?.[1];
        if (opValue) {
          components.filters[opName] = opValue;
          query = query.replace(new RegExp(`${opName}:\\s*[^\\s]+`), '');
        }
      }
    }

    // Extraer palabras clave
    components.keywords = query.trim().split(/\s+/).filter(word => word.length > 0);

    // Detectar tipos de nodos
    const nodeTypes = ['webhook', 'http', 'email', 'slack', 'discord', 'telegram', 'github', 'schedule'];
    components.nodes = components.keywords.filter(word =>
      nodeTypes.some(type => word.toLowerCase().includes(type))
    );

    return components;
  }

  // Búsqueda semántica mejorada
  async enhancedSemanticSearch(queryComponents, options) {
    const results = [];
    const semanticQuery = queryComponents.keywords.join(' ');

    for (const [workflowId, workflowData] of this.workflowIndex) {
      const semanticScore = this.calculateEnhancedSemanticSimilarity(semanticQuery, workflowData);
      if (semanticScore >= (options.semanticThreshold || 0.6)) {
        results.push({
          workflowId: workflowId,
          workflow: workflowData.workflow,
          score: semanticScore,
          matchType: 'semantic',
          metadata: workflowData.metadata,
          highlights: this.generateHighlights(semanticQuery, workflowData)
        });
      }
    }

    return results;
  }

  // Búsqueda por palabras clave mejorada
  async enhancedKeywordSearch(queryComponents, options) {
    const results = [];
    const keywords = queryComponents.keywords;

    for (const [workflowId, workflowData] of this.workflowIndex) {
      const keywordMatches = this.findEnhancedKeywordMatches(keywords, workflowData);
      if (keywordMatches.length > 0) {
        const score = this.calculateEnhancedKeywordScore(keywordMatches, keywords);
        results.push({
          workflowId: workflowId,
          workflow: workflowData.workflow,
          score: score,
          matchType: 'keyword',
          matches: keywordMatches,
          metadata: workflowData.metadata,
          highlights: this.generateHighlights(keywords.join(' '), workflowData)
        });
      }
    }

    return results;
  }

  // Búsqueda por tags mejorada
  async enhancedTagSearch(queryComponents, options) {
    const results = [];
    const queryTags = queryComponents.tags;

    for (const tag of queryTags) {
      const workflowIds = this.filterIndex.get(`tag_${tag.toLowerCase()}`) || [];
      for (const workflowId of workflowIds) {
        const workflowData = this.workflowIndex.get(workflowId);
        if (workflowData) {
          results.push({
            workflowId: workflowId,
            workflow: workflowData.workflow,
            score: 1.0,
            matchType: 'tag',
            matchedTag: tag,
            metadata: workflowData.metadata
          });
        }
      }
    }

    return results;
  }

  // Búsqueda por nodos mejorada
  async enhancedNodeSearch(queryComponents, options) {
    const results = [];
    const queryNodes = queryComponents.nodes;

    for (const nodeType of queryNodes) {
      const workflowIds = this.filterIndex.get(`node_${nodeType.toLowerCase()}`) || [];
      for (const workflowId of workflowIds) {
        const workflowData = this.workflowIndex.get(workflowId);
        if (workflowData) {
          const nodeCount = this.countNodeTypeEnhanced(workflowData.workflow, nodeType);
          const score = Math.min(nodeCount / 10, 1.0);
          results.push({
            workflowId: workflowId,
            workflow: workflowData.workflow,
            score: score,
            matchType: 'node',
            matchedNode: nodeType,
            nodeCount: nodeCount,
            metadata: workflowData.metadata
          });
        }
      }
    }

    return results;
  }

  // Búsqueda difusa mejorada
  async enhancedFuzzySearch(queryComponents, options) {
    const results = [];
    const fuzzyThreshold = options.fuzzyThreshold || 0.7;
    const query = queryComponents.keywords.join(' ');

    for (const [workflowId, workflowData] of this.workflowIndex) {
      const fuzzyScore = this.calculateEnhancedFuzzyMatch(query, workflowData);
      if (fuzzyScore >= fuzzyThreshold) {
        results.push({
          workflowId: workflowId,
          workflow: workflowData.workflow,
          score: fuzzyScore,
          matchType: 'fuzzy',
          metadata: workflowData.metadata
        });
      }
    }

    return results;
  }

  // Aplicar filtros avanzados
  async applyAdvancedFilters(results, options) {
    let filtered = results;

    // Aplicar filtros personalizados
    if (options.filters) {
      for (const [filterType, filterValue] of Object.entries(options.filters)) {
        const filterMethod = this.filterTypes[filterType];
        if (filterMethod) {
          filtered = await filterMethod(filtered, filterValue);
        }
      }
    }

    // Filtro por rango de puntuación
    if (options.minScore !== undefined) {
      filtered = filtered.filter(result => result.score >= options.minScore);
    }

    if (options.maxScore !== undefined) {
      filtered = filtered.filter(result => result.score <= options.maxScore);
    }

    // Filtro por tipos de coincidencia
    if (options.matchTypes) {
      filtered = filtered.filter(result => options.matchTypes.includes(result.matchType));
    }

    return filtered;
  }

  // Ranking mejorado
  async enhancedRanking(results, query, options) {
    const rankedResults = results.map(result => ({
      ...result,
      score: this.calculateEnhancedScore(result, query, options)
    }));

    // Ordenar por puntuación mejorada
    rankedResults.sort((a, b) => b.score - a.score);

    // Aplicar boosting por popularidad
    if (options.boostPopular) {
      rankedResults.forEach(result => {
        const popularity = result.metadata?.usageCount || 0;
        result.score *= (1 + popularity / 1000);
      });
    }

    // Aplicar boosting por recencia
    if (options.boostRecent) {
      const now = Date.now();
      rankedResults.forEach(result => {
        const age = now - (result.metadata?.lastModified || now);
        const recencyBoost = Math.max(0, 1 - (age / (30 * 24 * 60 * 60 * 1000)));
        result.score *= (1 + recencyBoost * 0.2);
      });
    }

    return rankedResults;
  }

  // Filtros avanzados
  async filterByDate(results, dateRange) {
    const [startDate, endDate] = dateRange.split(' to ').map(d => new Date(d));
    return results.filter(result => {
      const workflowDate = new Date(result.metadata?.createdAt || 0);
      return workflowDate >= startDate && workflowDate <= endDate;
    });
  }

  async filterByAuthor(results, author) {
    return results.filter(result =>
      result.metadata?.author?.toLowerCase().includes(author.toLowerCase())
    );
  }

  async filterByTags(results, tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    return results.filter(result => {
      const workflowTags = result.metadata?.tags || [];
      return tagArray.some(tag => workflowTags.includes(tag));
    });
  }

  async filterByComplexity(results, complexityRange) {
    const [min, max] = complexityRange.split('-').map(Number);
    return results.filter(result => {
      const complexity = this.calculateWorkflowComplexity(result.workflow);
      return complexity >= min && complexity <= max;
    });
  }

  async filterByPerformance(results, performanceThreshold) {
    return results.filter(result =>
      (result.metadata?.performance || 0) >= performanceThreshold
    );
  }

  async filterByCustom(results, customFilter) {
    // Implementación de filtro personalizado
    return results.filter(result => customFilter(result));
  }

  // Utilidades mejoradas
  calculateEnhancedSemanticSimilarity(query, workflowData) {
    // Implementación mejorada con TF-IDF y word embeddings
    const queryVector = this.generateEnhancedQueryVector(query);
    const workflowVector = workflowData.enhancedVector || this.generateEnhancedWorkflowVector(workflowData.workflow);

    return this.cosineSimilarity(queryVector, workflowData);
  }

  calculateEnhancedKeywordScore(matches, keywords) {
    let score = 0;

    for (const match of matches) {
      const keywordIndex = keywords.indexOf(match.keyword);
      if (keywordIndex !== -1) {
        // Bonus por posición en la consulta
        const positionBonus = 1 / (keywordIndex + 1);
        // Bonus por frecuencia
        const frequencyBonus = Math.min(match.frequency / 5, 1);
        // Bonus por contexto
        const contextBonus = match.inTitle ? 0.2 : 0;

        score += (positionBonus + frequencyBonus + contextBonus) * match.weight;
      }
    }

    return Math.min(score / keywords.length, 1.0);
  }

  calculateEnhancedFuzzyMatch(query, workflowData) {
    // Implementación mejorada con n-gramas
    const queryNgrams = this.generateNgrams(query, 3);
    const content = JSON.stringify(workflowData.workflow).toLowerCase();
    const contentNgrams = this.generateNgrams(content, 3);

    let matches = 0;
    for (const ngram of queryNgrams) {
      if (contentNgrams.has(ngram)) {
        matches++;
      }
    }

    return matches / queryNgrams.length;
  }

  calculateEnhancedScore(result, query, options) {
    let score = result.score;

    // Factor de relevancia semántica
    if (options.semanticBoost && result.matchType === 'semantic') {
      score *= 1.2;
    }

    // Factor de calidad del workflow
    const qualityFactor = this.calculateWorkflowQuality(result.workflow);
    score *= (0.8 + qualityFactor * 0.4);

    // Factor de popularidad
    const popularityFactor = Math.min((result.metadata?.usageCount || 0) / 100, 1);
    score *= (0.9 + popularityFactor * 0.2);

    return score;
  }

  // Generar highlights para resultados
  generateHighlights(query, workflowData) {
    const highlights = [];
    const content = JSON.stringify(workflowData.workflow);
    const queryWords = query.toLowerCase().split(/\s+/);

    for (const word of queryWords) {
      const regex = new RegExp(`(${word})`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        highlights.push({
          word: word,
          count: matches.length,
          context: this.extractContext(content, word, 50)
        });
      }
    }

    return highlights;
  }

  // Generar facetas para filtros
  generateFacets(results) {
    const facets = {
      authors: new Map(),
      tags: new Map(),
      nodeTypes: new Map(),
      complexity: { min: Infinity, max: 0 },
      dates: new Map()
    };

    for (const result of results) {
      // Faceta de autores
      const author = result.metadata?.author || 'unknown';
      facets.authors.set(author, (facets.authors.get(author) || 0) + 1);

      // Faceta de tags
      const tags = result.metadata?.tags || [];
      for (const tag of tags) {
        facets.tags.set(tag, (facets.tags.get(tag) || 0) + 1);
      }

      // Faceta de tipos de nodos
      const nodeTypes = this.extractNodeTypes(result.workflow);
      for (const nodeType of nodeTypes) {
        facets.nodeTypes.set(nodeType, (facets.nodeTypes.get(nodeType) || 0) + 1);
      }

      // Faceta de complejidad
      const complexity = this.calculateWorkflowComplexity(result.workflow);
      facets.complexity.min = Math.min(facets.complexity.min, complexity);
      facets.complexity.max = Math.max(facets.complexity.max, complexity);

      // Faceta de fechas
      const date = new Date(result.metadata?.createdAt || 0).toISOString().split('T')[0];
      facets.dates.set(date, (facets.dates.get(date) || 0) + 1);
    }

    return facets;
  }

  // Generar sugerencias de búsqueda
  generateSearchSuggestions(query) {
    const suggestions = [];

    // Sugerencias basadas en historial
    const similarQueries = this.findSimilarQueries(query);
    suggestions.push(...similarQueries.map(q => `¿Quisiste decir "${q}"?`));

    // Sugerencias basadas en corrección ortográfica
    const correctedQuery = this.spellCheckQuery(query);
    if (correctedQuery !== query) {
      suggestions.push(`Búsqueda corregida: "${correctedQuery}"`);
    }

    // Sugerencias basadas en términos relacionados
    const relatedTerms = this.findRelatedTerms(query);
    if (relatedTerms.length > 0) {
      suggestions.push(`Términos relacionados: ${relatedTerms.join(', ')}`);
    }

    return suggestions;
  }

  // Utilidades adicionales
  generateSearchId() {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  recordSearch(query, options) {
    this.searchHistory.push({
      query: query,
      timestamp: Date.now(),
      options: options
    });

    // Mantener historial limitado
    if (this.searchHistory.length > 1000) {
      this.searchHistory = this.searchHistory.slice(-1000);
    }

    // Actualizar búsquedas populares
    const queryKey = query.toLowerCase();
    this.popularSearches.set(queryKey, (this.popularSearches.get(queryKey) || 0) + 1);
  }

  updateRealTimeResults(searchId, results) {
    const searchData = this.realTimeIndex.get(searchId);
    if (searchData) {
      searchData.results = results;
      searchData.lastUpdate = Date.now();
    }
  }

  getSearchMetrics() {
    return {
      ...this.searchMetrics,
      totalWorkflows: this.workflowIndex.size,
      activeSearches: this.realTimeIndex.size
    };
  }

  findSimilarQueries(query) {
    // Implementación simplificada
    return this.searchHistory
      .filter(item => this.calculateStringSimilarity(item.query, query) > 0.8)
      .map(item => item.query)
      .slice(0, 3);
  }

  spellCheckQuery(query) {
    // Implementación básica de corrección ortográfica
    return query; // Placeholder
  }

  findRelatedTerms(query) {
    // Implementación de términos relacionados
    const relatedTerms = {
      'email': ['gmail', 'outlook', 'sendgrid'],
      'slack': ['discord', 'telegram', 'teams'],
      'webhook': ['api', 'http', 'rest']
    };

    const words = query.toLowerCase().split(/\s+/);
    const related = [];

    for (const word of words) {
      if (relatedTerms[word]) {
        related.push(...relatedTerms[word]);
      }
    }

    return related.slice(0, 5);
  }

  // Métodos de utilidad adicionales
  generateNgrams(text, n) {
    const ngrams = new Set();
    const words = text.toLowerCase().split(/\s+/);

    for (let i = 0; i <= words.length - n; i++) {
      const ngram = words.slice(i, i + n).join(' ');
      ngrams.add(ngram);
    }

    return ngrams;
  }

  extractContext(text, word, contextLength) {
    const index = text.toLowerCase().indexOf(word.toLowerCase());
    if (index === -1) return '';

    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + word.length + contextLength);

    return text.substring(start, end);
  }

  extractNodeTypes(workflow) {
    const types = new Set();
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        types.add(node.type);
      }
    }
    return Array.from(types);
  }

  calculateWorkflowQuality(workflow) {
    // Calcular calidad basada en varios factores
    let quality = 0.5;

    if (workflow.nodes?.length > 0) {
      quality += 0.1;
    }

    if (workflow.connections) {
      quality += 0.1;
    }

    if (workflow.settings) {
      quality += 0.1;
    }

    return Math.min(quality, 1.0);
  }

  cosineSimilarity(vector1, vector2) {
    // Implementación de similitud coseno
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      magnitude1 += vector1[i] * vector1[i];
      magnitude2 += vector2[i] * vector2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
  }

  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(shorter, longer);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  // Placeholders para métodos no implementados
  generateEnhancedQueryVector(query) {
    // Placeholder - implementación real requeriría modelo de embeddings
    return new Array(300).fill(0).map(() => Math.random());
  }

  generateEnhancedWorkflowVector(workflow) {
    // Placeholder
    return new Array(300).fill(0).map(() => Math.random());
  }

  findEnhancedKeywordMatches(keywords, workflowData) {
    // Placeholder
    return keywords.map(keyword => ({
      keyword: keyword,
      frequency: 1,
      weight: 1.0,
      inTitle: false
    }));
  }

  countNodeTypeEnhanced(workflow, nodeType) {
    if (!workflow.nodes) return 0;
    return workflow.nodes.filter(node =>
      node.type.toLowerCase().includes(nodeType.toLowerCase())
    ).length;
  }

  calculateWorkflowComplexity(workflow) {
    if (!workflow.nodes) return 0;
    return workflow.nodes.length;
  }

  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = result.workflowId;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  quickSearch(query, options) {
    // Implementación simplificada - devolver en formato consistente
    return this.performAdvancedSearch(query, { ...options, maxResults: 10 });
  }

  deepSearch(query, options) {
    // Implementación simplificada - devolver en formato consistente
    return this.performAdvancedSearch(query, options);
  }

  // Método para obtener ejemplos curados (usado por el servidor)
  getCuratedExamples() {
    try {
      // Devolver algunos ejemplos básicos si no hay workflows indexados
      return [
        {
          workflow: {
            id: 'example-1',
            name: 'Google Sheets to Email',
            nodes: [
              { id: '1', type: 'n8n-nodes-base.googleSheets', name: 'Google Sheets' },
              { id: '2', type: 'n8n-nodes-base.emailSend', name: 'Send Email' }
            ],
            connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] } }
          },
          description: 'Leer datos de Google Sheets y enviar por email'
        },
        {
          workflow: {
            id: 'example-2',
            name: 'Webhook to Slack',
            nodes: [
              { id: '1', type: 'n8n-nodes-base.webhook', name: 'Webhook' },
              { id: '2', type: 'n8n-nodes-base.slack', name: 'Slack' }
            ],
            connections: { '1': { main: [[{ node: '2', type: 'main', index: 0 }]] } }
          },
          description: 'Recibir webhooks y enviar notificaciones a Slack'
        }
      ];
    } catch (error) {
      console.error('Error obteniendo ejemplos curados:', error);
      return [];
    }
  }

  // Método para búsqueda rápida
  async fastSearch(query) {
    return await this.search(query, {
      maxResults: 20,
      realTimeSearch: false,
      advancedFilters: false
    });
  }

  // Método para búsqueda profunda
  async deepSearch(query) {
    return await this.search(query, {
      maxResults: 100,
      realTimeSearch: true,
      advancedFilters: true,
      deepSearch: true
    });
  }

  // Método para obtener estadísticas
  getStats() {
    return {
      totalWorkflows: this.workflowIndex.size,
      totalSearches: this.searchHistory.length,
      activeRealTimeSearches: this.realTimeIndex.size,
      popularSearches: Array.from(this.popularSearches.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  }

  // Método para limpiar caché
  clearCache() {
    this.realTimeIndex.clear();
    this.searchHistory.length = 0;
    console.log('🧹 Caché de búsqueda limpiado');
  }
  // Método para buscar workflows similares (usado por el servidor)
  async searchSimilarWorkflows(prompt) {
    try {
      // Usar el método de búsqueda existente con configuración básica
      const results = await this.search(prompt, {
        maxResults: 5,
        searchStrategy: 'semantic',
        rankingAlgorithm: 'relevance'
      });

      // Formatear resultados para compatibilidad con el servidor
      return results.results.map(result => ({
        workflow: result.workflow,
        similarity: result.score,
        metadata: result.metadata
      }));

    } catch (error) {
      console.error('Error buscando workflows similares:', error);
      return [];
    }
  }
}

// Exportar la clase
export default WorkflowSearchAgentNew;

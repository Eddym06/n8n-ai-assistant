// Workflow Search Agent - Agente de Búsqueda de Workflows Inteligente
// Sistema avanzado para buscar, indexar y recuperar workflows de n8n

class WorkflowSearchAgent {
  constructor(options = {}) {
    this.options = {
      maxResults: options.maxResults || 50,
      searchTimeout: options.searchTimeout || 30000,
      indexUpdateInterval: options.indexUpdateInterval || 3600000, // 1 hora
      similarityThreshold: options.similarityThreshold || 0.7,
      enableCaching: options.enableCaching !== false,
      cacheSize: options.cacheSize || 100,
      ...options
    };

    this.workflowIndex = new Map();
    this.searchCache = new Map();
    this.tagIndex = new Map();
    this.nodeIndex = new Map();
    this.metadataIndex = new Map();

    this.searchStrategies = {
      semantic: this.semanticSearch.bind(this),
      keyword: this.keywordSearch.bind(this),
      tag: this.tagSearch.bind(this),
      node: this.nodeSearch.bind(this),
      fuzzy: this.fuzzySearch.bind(this),
      hybrid: this.hybridSearch.bind(this)
    };

    this.rankingAlgorithms = {
      relevance: this.rankByRelevance.bind(this),
      popularity: this.rankByPopularity.bind(this),
      recency: this.rankByRecency.bind(this),
      complexity: this.rankByComplexity.bind(this),
      hybrid: this.rankByHybrid.bind(this)
    };

    this.lastIndexUpdate = Date.now();
    this.isIndexing = false;

    console.log('🔍 Workflow Search Agent inicializado');
  }

  // Método principal de búsqueda
  async search(query, options = {}) {
    try {
      console.log('🔍 Workflow Search Agent: Buscando workflows...');

      if (!query || typeof query !== 'string') {
        throw new Error('Consulta de búsqueda inválida');
      }

      const searchOptions = { ...this.options, ...options };
      const startTime = Date.now();

      // Verificar caché
      if (searchOptions.enableCaching) {
        const cacheKey = this.generateCacheKey(query, searchOptions);
        const cachedResult = this.searchCache.get(cacheKey);
        if (cachedResult && (Date.now() - cachedResult.timestamp) < 300000) { // 5 minutos
          console.log('📋 Resultado obtenido del caché');
          return cachedResult.data;
        }
      }

      // Actualizar índice si es necesario
      await this.updateIndexIfNeeded();

      // Ejecutar búsqueda
      const rawResults = await this.executeSearch(query, searchOptions);

      // Rankear resultados
      const rankedResults = await this.rankResults(rawResults, query, searchOptions);

      // Aplicar filtros y límites
      const filteredResults = this.applyFilters(rankedResults, searchOptions);

      // Preparar respuesta
      const response = {
        query: query,
        results: filteredResults.slice(0, searchOptions.maxResults),
        totalResults: filteredResults.length,
        searchTime: Date.now() - startTime,
        searchOptions: searchOptions,
        metadata: {
          indexSize: this.workflowIndex.size,
          lastUpdate: this.lastIndexUpdate,
          cacheHits: this.getCacheStats()
        }
      };

      // Almacenar en caché
      if (searchOptions.enableCaching) {
        const cacheKey = this.generateCacheKey(query, searchOptions);
        this.searchCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });

        // Limpiar caché si es necesario
        if (this.searchCache.size > searchOptions.cacheSize) {
          this.cleanCache();
        }
      }

      return response;

    } catch (error) {
      console.error('❌ Error en Workflow Search Agent:', error);
      return {
        query: query,
        results: [],
        error: error.message,
        searchTime: 0
      };
    }
  }

  // Ejecutar búsqueda según estrategia
  async executeSearch(query, options) {
    const strategy = options.searchStrategy || 'hybrid';
    const searchMethod = this.searchStrategies[strategy];

    if (!searchMethod) {
      throw new Error(`Estrategia de búsqueda no válida: ${strategy}`);
    }

    return await searchMethod(query, options);
  }

  // Búsqueda semántica
  async semanticSearch(query, options) {
    const results = [];
    const queryVector = this.generateQueryVector(query);

    for (const [workflowId, workflowData] of this.workflowIndex) {
      const similarity = this.calculateSemanticSimilarity(queryVector, workflowData.vector);
      if (similarity >= options.similarityThreshold) {
        results.push({
          workflowId: workflowId,
          workflow: workflowData.workflow,
          score: similarity,
          matchType: 'semantic',
          metadata: workflowData.metadata
        });
      }
    }

    return results;
  }

  // Búsqueda por palabras clave
  async keywordSearch(query, options) {
    const results = [];
    const keywords = this.extractKeywords(query);

    for (const [workflowId, workflowData] of this.workflowIndex) {
      const matches = this.findKeywordMatches(keywords, workflowData);
      if (matches.length > 0) {
        const score = this.calculateKeywordScore(matches, keywords);
        results.push({
          workflowId: workflowId,
          workflow: workflowData.workflow,
          score: score,
          matchType: 'keyword',
          matches: matches,
          metadata: workflowData.metadata
        });
      }
    }

    return results;
  }

  // Búsqueda por tags
  async tagSearch(query, options) {
    const results = [];
    const queryTags = this.extractTags(query);

    for (const tag of queryTags) {
      const workflowIds = this.tagIndex.get(tag.toLowerCase()) || [];
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

  // Búsqueda por nodos
  async nodeSearch(query, options) {
    const results = [];
    const queryNodes = this.extractNodeTypes(query);

    for (const nodeType of queryNodes) {
      const workflowIds = this.nodeIndex.get(nodeType.toLowerCase()) || [];
      for (const workflowId of workflowIds) {
        const workflowData = this.workflowIndex.get(workflowId);
        if (workflowData) {
          const nodeCount = this.countNodeType(workflowData.workflow, nodeType);
          const score = Math.min(nodeCount / 10, 1.0); // Normalizar
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

  // Búsqueda difusa
  async fuzzySearch(query, options) {
    const results = [];
    const fuzzyThreshold = options.fuzzyThreshold || 0.8;

    for (const [workflowId, workflowData] of this.workflowIndex) {
      const fuzzyScore = this.calculateFuzzyMatch(query, workflowData);
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

  // Búsqueda híbrida
  async hybridSearch(query, options) {
    const [semanticResults, keywordResults, tagResults, nodeResults] = await Promise.all([
      this.semanticSearch(query, { ...options, similarityThreshold: 0.5 }),
      this.keywordSearch(query, options),
      this.tagSearch(query, options),
      this.nodeSearch(query, options)
    ]);

    // Combinar y desduplicar resultados
    const allResults = [...semanticResults, ...keywordResults, ...tagResults, ...nodeResults];
    const uniqueResults = this.deduplicateResults(allResults);

    // Recalcular scores para resultados híbridos
    for (const result of uniqueResults) {
      result.score = this.calculateHybridScore(result, query);
      result.matchType = 'hybrid';
    }

    return uniqueResults;
  }

  // Rankear resultados
  async rankResults(results, query, options) {
    const rankingAlgorithm = options.rankingAlgorithm || 'hybrid';
    const rankMethod = this.rankingAlgorithms[rankingAlgorithm];

    if (!rankMethod) {
      throw new Error(`Algoritmo de ranking no válido: ${rankingAlgorithm}`);
    }

    const rankedResults = await rankMethod(results, query, options);

    // Ordenar por score descendente
    return rankedResults.sort((a, b) => b.score - a.score);
  }

  // Ranking por relevancia
  rankByRelevance(results, query, options) {
    return results.map(result => ({
      ...result,
      score: result.score * this.calculateRelevanceMultiplier(result, query)
    }));
  }

  // Ranking por popularidad
  rankByPopularity(results, query, options) {
    return results.map(result => ({
      ...result,
      score: result.score * (result.metadata?.usageCount || 1) / 100
    }));
  }

  // Ranking por recencia
  rankByRecency(results, query, options) {
    const now = Date.now();
    return results.map(result => {
      const age = now - (result.metadata?.lastModified || now);
      const recencyScore = Math.max(0, 1 - (age / (30 * 24 * 60 * 60 * 1000))); // 30 días
      return {
        ...result,
        score: result.score * recencyScore
      };
    });
  }

  // Ranking por complejidad
  rankByComplexity(results, query, options) {
    return results.map(result => {
      const complexity = this.calculateWorkflowComplexity(result.workflow);
      const complexityScore = Math.min(complexity / 20, 1.0); // Normalizar
      return {
        ...result,
        score: result.score * complexityScore
      };
    });
  }

  // Ranking híbrido
  rankByHybrid(results, query, options) {
    return results.map(result => {
      const relevanceScore = this.calculateRelevanceMultiplier(result, query);
      const popularityScore = (result.metadata?.usageCount || 1) / 100;
      const recencyScore = this.calculateRecencyScore(result);
      const complexityScore = this.calculateWorkflowComplexity(result.workflow) / 20;

      const hybridScore = (
        relevanceScore * 0.4 +
        popularityScore * 0.3 +
        recencyScore * 0.2 +
        complexityScore * 0.1
      );

      return {
        ...result,
        score: result.score * hybridScore
      };
    });
  }

  // Aplicar filtros
  applyFilters(results, options) {
    let filtered = results;

    // Filtro por tipo de workflow
    if (options.workflowType) {
      filtered = filtered.filter(result =>
        result.workflow.type === options.workflowType
      );
    }

    // Filtro por autor
    if (options.author) {
      filtered = filtered.filter(result =>
        result.metadata?.author?.toLowerCase() === options.author.toLowerCase()
      );
    }

    // Filtro por rango de fechas
    if (options.dateFrom) {
      const fromDate = new Date(options.dateFrom);
      filtered = filtered.filter(result =>
        new Date(result.metadata?.createdAt || 0) >= fromDate
      );
    }

    if (options.dateTo) {
      const toDate = new Date(options.dateTo);
      filtered = filtered.filter(result =>
        new Date(result.metadata?.createdAt || 0) <= toDate
      );
    }

    // Filtro por complejidad
    if (options.minComplexity !== undefined) {
      filtered = filtered.filter(result =>
        this.calculateWorkflowComplexity(result.workflow) >= options.minComplexity
      );
    }

    if (options.maxComplexity !== undefined) {
      filtered = filtered.filter(result =>
        this.calculateWorkflowComplexity(result.workflow) <= options.maxComplexity
      );
    }

    return filtered;
  }

  // Indexar workflow
  async indexWorkflow(workflow, metadata = {}) {
    try {
      if (!workflow || !workflow.id) {
        throw new Error('Workflow inválido para indexar');
      }

      const workflowId = workflow.id;
      const workflowData = {
        workflow: workflow,
        vector: this.generateWorkflowVector(workflow),
        metadata: {
          indexedAt: Date.now(),
          lastModified: workflow.updatedAt || Date.now(),
          author: metadata.author || 'unknown',
          tags: metadata.tags || [],
          usageCount: metadata.usageCount || 0,
          ...metadata
        }
      };

      // Indexar workflow principal
      this.workflowIndex.set(workflowId, workflowData);

      // Indexar tags
      for (const tag of workflowData.metadata.tags) {
        const tagKey = tag.toLowerCase();
        if (!this.tagIndex.has(tagKey)) {
          this.tagIndex.set(tagKey, []);
        }
        this.tagIndex.get(tagKey).push(workflowId);
      }

      // Indexar nodos
      if (workflow.nodes) {
        for (const node of workflow.nodes) {
          const nodeType = node.type.toLowerCase();
          if (!this.nodeIndex.has(nodeType)) {
            this.nodeIndex.set(nodeType, []);
          }
          this.nodeIndex.get(nodeType).push(workflowId);
        }
      }

      // Indexar metadatos
      this.metadataIndex.set(workflowId, workflowData.metadata);

      console.log(`📝 Workflow indexado: ${workflowId}`);
      return true;

    } catch (error) {
      console.error('Error indexando workflow:', error);
      return false;
    }
  }

  // Actualizar índice
  async updateIndexIfNeeded() {
    const now = Date.now();
    if (now - this.lastIndexUpdate > this.options.indexUpdateInterval) {
      await this.updateIndex();
    }
  }

  async updateIndex() {
    if (this.isIndexing) return;

    try {
      this.isIndexing = true;
      console.log('🔄 Actualizando índice de búsqueda...');

      // Aquí iría la lógica para actualizar el índice desde una fuente de datos
      // Por ahora, solo actualizamos el timestamp
      this.lastIndexUpdate = Date.now();

      console.log('✅ Índice actualizado');
    } catch (error) {
      console.error('Error actualizando índice:', error);
    } finally {
      this.isIndexing = false;
    }
  }

  // Utilidades de búsqueda
  generateQueryVector(query) {
    // Implementación simplificada de vectorización
    const words = query.toLowerCase().split(/\s+/);
    const vector = new Array(100).fill(0);

    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      const position = hash % vector.length;
      vector[position] += 1;
    });

    // Normalizar
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
  }

  generateWorkflowVector(workflow) {
    // Generar vector basado en contenido del workflow
    const content = JSON.stringify(workflow);
    return this.generateQueryVector(content);
  }

  calculateSemanticSimilarity(vector1, vector2) {
    if (!vector1 || !vector2 || vector1.length !== vector2.length) {
      return 0;
    }

    // Coseno similarity
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

  extractKeywords(query) {
    return query.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .map(word => word.replace(/[^\w]/g, ''));
  }

  extractTags(query) {
    const tagMatches = query.match(/#(\w+)/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  }

  extractNodeTypes(query) {
    // Extraer tipos de nodos mencionados en la consulta
    const nodeTypes = ['webhook', 'http', 'email', 'slack', 'discord', 'telegram', 'twitter', 'github'];
    return nodeTypes.filter(type => query.toLowerCase().includes(type));
  }

  findKeywordMatches(keywords, workflowData) {
    const matches = [];
    const content = JSON.stringify(workflowData.workflow).toLowerCase();

    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        matches.push(keyword);
      }
    }

    return matches;
  }

  calculateKeywordScore(matches, keywords) {
    const matchRatio = matches.length / keywords.length;
    const exactMatches = matches.filter(match => keywords.includes(match)).length;
    const exactRatio = exactMatches / keywords.length;

    return (matchRatio * 0.6) + (exactRatio * 0.4);
  }

  countNodeType(workflow, nodeType) {
    if (!workflow.nodes) return 0;
    return workflow.nodes.filter(node =>
      node.type.toLowerCase().includes(nodeType.toLowerCase())
    ).length;
  }

  calculateFuzzyMatch(query, workflowData) {
    // Implementación simplificada de fuzzy matching
    const queryWords = this.extractKeywords(query);
    const content = JSON.stringify(workflowData.workflow).toLowerCase();
    let totalScore = 0;

    for (const word of queryWords) {
      if (content.includes(word)) {
        totalScore += 1;
      } else {
        // Calcular distancia de Levenshtein simplificada
        const words = content.split(/\s+/);
        for (const contentWord of words) {
          if (this.levenshteinDistance(word, contentWord) <= 2) {
            totalScore += 0.5;
            break;
          }
        }
      }
    }

    return totalScore / queryWords.length;
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

  calculateWorkflowComplexity(workflow) {
    if (!workflow.nodes) return 0;

    let complexity = workflow.nodes.length;

    // Agregar complejidad por conexiones
    if (workflow.connections) {
      complexity += Object.keys(workflow.connections).length * 0.5;
    }

    // Agregar complejidad por tipos de nodos únicos
    const uniqueNodeTypes = new Set(workflow.nodes.map(node => node.type));
    complexity += uniqueNodeTypes.size * 0.2;

    return complexity;
  }

  calculateRelevanceMultiplier(result, query) {
    let multiplier = 1.0;

    // Bonus por coincidencias exactas
    if (result.matchType === 'keyword') {
      multiplier += 0.2;
    }

    // Bonus por tags
    if (result.matchType === 'tag') {
      multiplier += 0.3;
    }

    // Bonus por nodos específicos
    if (result.matchType === 'node') {
      multiplier += 0.25;
    }

    return multiplier;
  }

  calculateRecencyScore(result) {
    const now = Date.now();
    const age = now - (result.metadata?.lastModified || now);
    return Math.max(0, 1 - (age / (30 * 24 * 60 * 60 * 1000))); // 30 días
  }

  calculateHybridScore(result, query) {
    const relevanceScore = this.calculateRelevanceMultiplier(result, query);
    const recencyScore = this.calculateRecencyScore(result);
    const popularityScore = (result.metadata?.usageCount || 1) / 100;

    return (relevanceScore * 0.5) + (recencyScore * 0.3) + (popularityScore * 0.2);
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

  generateCacheKey(query, options) {
    const keyData = {
      query: query,
      strategy: options.searchStrategy,
      ranking: options.rankingAlgorithm,
      filters: options
    };
    return this.simpleHash(JSON.stringify(keyData));
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32 bits
    }
    return Math.abs(hash);
  }

  cleanCache() {
    const entries = Array.from(this.searchCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, Math.floor(entries.length * 0.2));
    for (const [key] of toRemove) {
      this.searchCache.delete(key);
    }
  }

  getCacheStats() {
    return {
      size: this.searchCache.size,
      maxSize: this.options.cacheSize
    };
  }

  // Método público para búsqueda rápida
  async quickSearch(query) {
    return await this.search(query, {
      maxResults: 10,
      searchStrategy: 'keyword',
      rankingAlgorithm: 'relevance'
    });
  }

  // Método público para búsqueda avanzada
  async advancedSearch(query, options = {}) {
    return await this.search(query, {
      searchStrategy: 'hybrid',
      rankingAlgorithm: 'hybrid',
      maxResults: 100,
      ...options
    });
  }

  // Método para obtener estadísticas del índice
  getIndexStats() {
    return {
      totalWorkflows: this.workflowIndex.size,
      totalTags: this.tagIndex.size,
      totalNodeTypes: this.nodeIndex.size,
      lastUpdate: this.lastIndexUpdate,
      isIndexing: this.isIndexing
    };
  }

  // Método para limpiar el índice
  clearIndex() {
    this.workflowIndex.clear();
    this.tagIndex.clear();
    this.nodeIndex.clear();
    this.metadataIndex.clear();
    this.searchCache.clear();
    this.lastIndexUpdate = Date.now();
    console.log('🧹 Índice limpiado');
  }
}

// Exportar la clase
export default WorkflowSearchAgent;

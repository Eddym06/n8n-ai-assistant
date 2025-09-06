// Semantic Memory Agent - Agente de Memoria Semántica Inteligente
// Sistema avanzado de memoria y aprendizaje para el asistente n8n

class SemanticMemoryAgent {
  constructor(options = {}) {
    this.options = {
      maxMemories: options.maxMemories || 1000,
      similarityThreshold: options.similarityThreshold || 0.7,
      learningRate: options.learningRate || 0.1,
      decayFactor: options.decayFactor || 0.95,
      ...options
    };

    this.memories = new Map();
    this.semanticIndex = new Map();
    this.patterns = new Map();
    this.contextHistory = [];

    // Inicializar componentes
    this.initializeMemorySystem();
    this.loadExistingMemories();

    console.log('🧠 Semantic Memory Agent inicializado');
  }

  // Inicializar sistema de memoria
  initializeMemorySystem() {
    this.memoryCategories = {
      userPreferences: new Map(),
      workflowPatterns: new Map(),
      errorPatterns: new Map(),
      successPatterns: new Map(),
      contextPatterns: new Map(),
      learningPatterns: new Map()
    };

    this.semanticVectors = {
      actions: this.createSemanticVector('actions'),
      workflows: this.createSemanticVector('workflows'),
      errors: this.createSemanticVector('errors'),
      preferences: this.createSemanticVector('preferences')
    };
  }

  // Crear vector semántico
  createSemanticVector(type) {
    const baseVectors = {
      actions: ['create', 'update', 'delete', 'execute', 'configure', 'optimize'],
      workflows: ['trigger', 'process', 'output', 'condition', 'loop', 'transform'],
      errors: ['syntax', 'connection', 'authentication', 'timeout', 'validation'],
      preferences: ['ui', 'layout', 'automation', 'notification', 'performance']
    };

    return baseVectors[type] || [];
  }

  // Cargar memorias existentes
  async loadExistingMemories() {
    try {
      // En un sistema real, esto cargaría desde una base de datos
      // Por ahora, inicializamos vacío
      this.memories.clear();
      console.log('📚 Memorias existentes cargadas');
    } catch (error) {
      console.error('Error cargando memorias:', error);
    }
  }

  // Método principal para almacenar memoria
  async storeMemory(category, key, data, metadata = {}) {
    try {
      const memory = {
        id: this.generateMemoryId(),
        category: category,
        key: key,
        data: data,
        metadata: {
          timestamp: new Date().toISOString(),
          accessCount: 0,
          lastAccess: new Date().toISOString(),
          importance: metadata.importance || 1,
          context: metadata.context || {},
          ...metadata
        },
        semanticVector: await this.generateSemanticVector(data)
      };

      // Almacenar en memoria principal
      this.memories.set(memory.id, memory);

      // Indexar semánticamente
      await this.indexSemantically(memory);

      // Almacenar por categoría
      if (!this.memoryCategories[category]) {
        this.memoryCategories[category] = new Map();
      }
      this.memoryCategories[category].set(key, memory);

      // Aplicar límite de memoria
      await this.enforceMemoryLimit();

      console.log(`💾 Memoria almacenada: ${category}:${key}`);
      return memory.id;

    } catch (error) {
      console.error('Error almacenando memoria:', error);
      return null;
    }
  }

  // Método principal para recuperar memoria
  async retrieveMemory(category, key, options = {}) {
    try {
      let memory = null;

      // Buscar por clave exacta
      if (this.memoryCategories[category] && this.memoryCategories[category].has(key)) {
        memory = this.memoryCategories[category].get(key);
      }

      // Si no se encuentra, buscar semánticamente
      if (!memory) {
        memory = await this.semanticSearch(category, key, options);
      }

      if (memory) {
        // Actualizar estadísticas de acceso
        await this.updateMemoryAccess(memory);
        return memory;
      }

      return null;

    } catch (error) {
      console.error('Error recuperando memoria:', error);
      return null;
    }
  }

  // Búsqueda semántica
  async semanticSearch(category, query, options = {}) {
    try {
      const queryVector = await this.generateSemanticVector(query);
      let bestMatch = null;
      let bestSimilarity = 0;

      // Buscar en todas las memorias de la categoría
      const categoryMemories = this.memoryCategories[category];
      if (categoryMemories) {
        for (const [key, memory] of categoryMemories) {
          const similarity = this.calculateSimilarity(queryVector, memory.semanticVector);

          if (similarity > bestSimilarity && similarity >= this.options.similarityThreshold) {
            bestMatch = memory;
            bestSimilarity = similarity;
          }
        }
      }

      return bestMatch;

    } catch (error) {
      console.error('Error en búsqueda semántica:', error);
      return null;
    }
  }

  // Generar vector semántico
  async generateSemanticVector(data) {
    try {
      const text = typeof data === 'string' ? data : JSON.stringify(data);
      const words = this.tokenize(text.toLowerCase());

      const vector = {};

      // Contar frecuencia de palabras clave
      words.forEach(word => {
        if (this.isSemanticWord(word)) {
          vector[word] = (vector[word] || 0) + 1;
        }
      });

      // Normalizar vector
      const magnitude = Math.sqrt(Object.values(vector).reduce((sum, val) => sum + val * val, 0));
      if (magnitude > 0) {
        Object.keys(vector).forEach(key => {
          vector[key] = vector[key] / magnitude;
        });
      }

      return vector;

    } catch (error) {
      console.error('Error generando vector semántico:', error);
      return {};
    }
  }

  // Tokenizar texto
  tokenize(text) {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  // Verificar si es una palabra semántica
  isSemanticWord(word) {
    const semanticWords = new Set([
      'workflow', 'node', 'connection', 'trigger', 'action', 'condition',
      'error', 'success', 'create', 'update', 'delete', 'execute',
      'configure', 'optimize', 'validate', 'repair', 'search', 'find',
      'generate', 'transform', 'process', 'output', 'input', 'data',
      'json', 'api', 'http', 'database', 'email', 'slack', 'discord'
    ]);

    return semanticWords.has(word) || word.length > 4;
  }

  // Calcular similitud coseno entre vectores
  calculateSimilarity(vector1, vector2) {
    try {
      const words = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);
      let dotProduct = 0;
      let magnitude1 = 0;
      let magnitude2 = 0;

      for (const word of words) {
        const val1 = vector1[word] || 0;
        const val2 = vector2[word] || 0;

        dotProduct += val1 * val2;
        magnitude1 += val1 * val1;
        magnitude2 += val2 * val2;
      }

      magnitude1 = Math.sqrt(magnitude1);
      magnitude2 = Math.sqrt(magnitude2);

      if (magnitude1 === 0 || magnitude2 === 0) return 0;

      return dotProduct / (magnitude1 * magnitude2);

    } catch (error) {
      console.error('Error calculando similitud:', error);
      return 0;
    }
  }

  // Indexar semánticamente
  async indexSemantically(memory) {
    try {
      const vector = memory.semanticVector;

      for (const [word, weight] of Object.entries(vector)) {
        if (!this.semanticIndex.has(word)) {
          this.semanticIndex.set(word, []);
        }

        this.semanticIndex.get(word).push({
          memoryId: memory.id,
          weight: weight,
          category: memory.category
        });
      }

    } catch (error) {
      console.error('Error indexando semánticamente:', error);
    }
  }

  // Actualizar acceso a memoria
  async updateMemoryAccess(memory) {
    try {
      memory.metadata.accessCount++;
      memory.metadata.lastAccess = new Date().toISOString();

      // Aplicar decaimiento temporal
      const age = Date.now() - new Date(memory.metadata.timestamp).getTime();
      const ageInDays = age / (1000 * 60 * 60 * 24);
      memory.metadata.importance *= Math.pow(this.options.decayFactor, ageInDays);

    } catch (error) {
      console.error('Error actualizando acceso a memoria:', error);
    }
  }

  // Aplicar límite de memoria
  async enforceMemoryLimit() {
    try {
      if (this.memories.size > this.options.maxMemories) {
        // Ordenar por importancia y eliminar las menos importantes
        const sortedMemories = Array.from(this.memories.values())
          .sort((a, b) => b.metadata.importance - a.metadata.importance);

        const toRemove = sortedMemories.slice(this.options.maxMemories);

        for (const memory of toRemove) {
          this.memories.delete(memory.id);

          // Remover de categorías
          if (this.memoryCategories[memory.category]) {
            this.memoryCategories[memory.category].delete(memory.key);
          }
        }

        console.log(`🗑️ Eliminadas ${toRemove.length} memorias menos importantes`);
      }

    } catch (error) {
      console.error('Error aplicando límite de memoria:', error);
    }
  }

  // Generar ID único para memoria
  generateMemoryId() {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Aprender de patrones
  async learnFromPattern(pattern, outcome, context) {
    try {
      const patternKey = this.generatePatternKey(pattern);

      if (!this.patterns.has(patternKey)) {
        this.patterns.set(patternKey, {
          pattern: pattern,
          outcomes: [],
          confidence: 0,
          usageCount: 0
        });
      }

      const patternData = this.patterns.get(patternKey);
      patternData.outcomes.push({
        outcome: outcome,
        context: context,
        timestamp: new Date().toISOString()
      });
      patternData.usageCount++;

      // Actualizar confianza basada en resultados positivos
      const positiveOutcomes = patternData.outcomes.filter(o => o.outcome === 'success').length;
      patternData.confidence = positiveOutcomes / patternData.outcomes.length;

      console.log(`🎓 Patrón aprendido: ${patternKey} (Confianza: ${(patternData.confidence * 100).toFixed(1)}%)`);

    } catch (error) {
      console.error('Error aprendiendo patrón:', error);
    }
  }

  // Generar clave de patrón
  generatePatternKey(pattern) {
    return typeof pattern === 'string' ? pattern : JSON.stringify(pattern);
  }

  // Obtener estadísticas de memoria
  getMemoryStats() {
    const stats = {
      totalMemories: this.memories.size,
      categories: {},
      semanticIndexSize: this.semanticIndex.size,
      patternsLearned: this.patterns.size,
      averageImportance: 0,
      oldestMemory: null,
      newestMemory: null
    };

    // Estadísticas por categoría
    for (const [category, memories] of Object.entries(this.memoryCategories)) {
      stats.categories[category] = memories.size;
    }

    // Calcular importancia promedio
    let totalImportance = 0;
    let oldest = new Date();
    let newest = new Date(0);

    for (const memory of this.memories.values()) {
      totalImportance += memory.metadata.importance;

      const memoryDate = new Date(memory.metadata.timestamp);
      if (memoryDate < oldest) oldest = memoryDate;
      if (memoryDate > newest) newest = memoryDate;
    }

    stats.averageImportance = this.memories.size > 0 ? totalImportance / this.memories.size : 0;
    stats.oldestMemory = oldest.toISOString();
    stats.newestMemory = newest.toISOString();

    return stats;
  }

  // Limpiar memorias antiguas
  async cleanupOldMemories(thresholdDays = 30) {
    try {
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - thresholdDays);

      const toRemove = [];

      for (const [id, memory] of this.memories) {
        if (new Date(memory.metadata.lastAccess) < threshold) {
          toRemove.push(id);
        }
      }

      for (const id of toRemove) {
        const memory = this.memories.get(id);
        this.memories.delete(id);

        if (this.memoryCategories[memory.category]) {
          this.memoryCategories[memory.category].delete(memory.key);
        }
      }

      console.log(`🧹 Limpieza completada: ${toRemove.length} memorias eliminadas`);
      return toRemove.length;

    } catch (error) {
      console.error('Error limpiando memorias:', error);
      return 0;
    }
  }

  // Exportar memorias
  async exportMemories() {
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalMemories: this.memories.size,
          version: '1.0'
        },
        memories: Array.from(this.memories.values()),
        patterns: Array.from(this.patterns.values())
      };

      return exportData;

    } catch (error) {
      console.error('Error exportando memorias:', error);
      return null;
    }
  }

  // Importar memorias
  async importMemories(importData) {
    try {
      if (!importData || !importData.memories) {
        throw new Error('Datos de importación inválidos');
      }

      let imported = 0;

      for (const memory of importData.memories) {
        if (memory.id && memory.category && memory.key) {
          this.memories.set(memory.id, memory);

          if (!this.memoryCategories[memory.category]) {
            this.memoryCategories[memory.category] = new Map();
          }
          this.memoryCategories[memory.category].set(memory.key, memory);

          imported++;
        }
      }

      console.log(`📥 Importadas ${imported} memorias`);
      return imported;

    } catch (error) {
      console.error('Error importando memorias:', error);
      return 0;
    }
  }

  // Método público para recordar contexto
  async rememberContext(contextType, contextData) {
    return await this.storeMemory('contextPatterns', contextType, contextData, {
      importance: 0.8,
      context: { type: 'context_remembrance' }
    });
  }

  // Método público para recordar preferencias de usuario
  async rememberPreference(userId, preference, value) {
    return await this.storeMemory('userPreferences', `${userId}:${preference}`, value, {
      importance: 0.9,
      context: { userId, type: 'user_preference' }
    });
  }

  // Método público para recordar patrones de workflow
  async rememberWorkflowPattern(pattern, success) {
    return await this.storeMemory('workflowPatterns', pattern, { success }, {
      importance: success ? 0.7 : 0.5,
      context: { type: 'workflow_pattern' }
    });
  }
}

// Exportar la clase
export default SemanticMemoryAgent;

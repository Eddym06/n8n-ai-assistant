// 🧠 WORKFLOW VECTORIZATION ENGINE V1.0
// Sistema de vectorización semántica para workflows de ejemplo
// Integrado con GeminiModelRouter para usar modelos Flash

import { GoogleGenerativeAI } from '@google/generative-ai';

export default class WorkflowVectorizationEngine {
  constructor() {
    this.version = '1.0.0';
    
    // Referencia al enrutador de modelos (se asignará desde Extension Server)
    this.modelRouter = null;
    this.currentModelName = 'gemini-2.5-flash';
    
    // Inicializar Gemini AI con modelo Flash para embeddings
    try {
      if (process.env.GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log('🧠 WorkflowVectorizationEngine inicializado con Gemini Flash');
      } else {
        console.log('⚠️ Gemini AI no disponible para vectorización');
      }
    } catch (error) {
      console.log('⚠️ Error inicializando Gemini para vectorización:', error.message);
    }

    // Base de datos de vectores en memoria (en producción sería una BD externa)
    this.vectorDatabase = new Map();
    this.embeddingCache = new Map();
    this.workflowExamples = [];
    
    // Métricas de rendimiento
    this.metrics = {
      totalVectorizations: 0,
      cacheHits: 0,
      averageSearchTime: 0,
      lastUpdate: new Date().toISOString()
    };
    
    // Inicializar con workflows de ejemplo
    this.initializeWorkflowExamples();
    
    console.log('🎯 WorkflowVectorizationEngine v1.0 listo');
  }

  /**
   * 🎯 Configurar enrutador de modelos desde Extension Server
   */
  setModelRouter(modelRouter) {
    this.modelRouter = modelRouter;
    console.log('🔗 WorkflowVectorizationEngine conectado al enrutador de modelos');
  }

  /**
   * 🤖 Obtener modelo actual desde el enrutador
   */
  getCurrentModel() {
    if (this.modelRouter) {
      const agentModel = this.modelRouter.getAgentModel();
      // Actualizar el modelo de Gemini si es diferente
      if (this.genAI && this.model && agentModel !== this.currentModelName) {
        this.model = this.genAI.getGenerativeModel({ model: agentModel });
        this.currentModelName = agentModel;
        console.log(`🔄 WorkflowVectorizationEngine actualizó a: ${agentModel}`);
      }
      return agentModel;
    }
    return 'gemini-2.5-flash'; // Fallback
  }

  /**
   * 📚 Inicializar base de workflows de ejemplo con categorías semánticas
   */
  initializeWorkflowExamples() {
    this.workflowExamples = [
      // Categoría: E-commerce y Tiendas Online
      {
        id: 'ecommerce_instagram_email',
        category: 'e-commerce',
        description: 'Capturar posts de Instagram de productos y enviar por email',
        keywords: ['instagram', 'ecommerce', 'email', 'productos', 'redes sociales'],
        complexity: 'intermediate',
        workflow: {
          nodes: [
            { type: 'n8n-nodes-base.instagramTrigger', name: 'Instagram Monitor' },
            { type: 'n8n-nodes-base.if', name: 'Es Producto?' },
            { type: 'n8n-nodes-base.gmail', name: 'Enviar Email' }
          ]
        },
        semanticVector: null // Se calculará después
      },
      
      // Categoría: Automatización de Comunicaciones
      {
        id: 'whatsapp_crm_integration',
        category: 'communication',
        description: 'Integrar WhatsApp con CRM para gestión automática de clientes',
        keywords: ['whatsapp', 'crm', 'clientes', 'comunicación', 'integración'],
        complexity: 'advanced',
        workflow: {
          nodes: [
            { type: 'n8n-nodes-base.webhookTrigger', name: 'WhatsApp Webhook' },
            { type: 'n8n-nodes-base.function', name: 'Procesar Mensaje' },
            { type: 'n8n-nodes-base.salesforce', name: 'Actualizar CRM' }
          ]
        },
        semanticVector: null
      },

      // Categoría: Procesamiento de Datos
      {
        id: 'csv_database_sync',
        category: 'data-processing',
        description: 'Sincronizar archivos CSV con base de datos automáticamente',
        keywords: ['csv', 'database', 'sincronización', 'datos', 'automation'],
        complexity: 'intermediate',
        workflow: {
          nodes: [
            { type: 'n8n-nodes-base.scheduleTrigger', name: 'Programador' },
            { type: 'n8n-nodes-base.csvFile', name: 'Leer CSV' },
            { type: 'n8n-nodes-base.mysql', name: 'Actualizar BD' }
          ]
        },
        semanticVector: null
      },

      // Categoría: Monitoreo y Alertas
      {
        id: 'website_monitoring_slack',
        category: 'monitoring',
        description: 'Monitorear sitio web y enviar alertas por Slack cuando hay problemas',
        keywords: ['monitoring', 'website', 'slack', 'alertas', 'uptime'],
        complexity: 'beginner',
        workflow: {
          nodes: [
            { type: 'n8n-nodes-base.cron', name: 'Verificar cada 5min' },
            { type: 'n8n-nodes-base.httpRequest', name: 'Ping Website' },
            { type: 'n8n-nodes-base.slack', name: 'Alerta Slack' }
          ]
        },
        semanticVector: null
      },

      // Categoría: Inteligencia Artificial
      {
        id: 'ai_content_generation',
        category: 'artificial-intelligence',
        description: 'Generar contenido automáticamente usando IA para redes sociales',
        keywords: ['ai', 'contenido', 'generación', 'redes sociales', 'automatización'],
        complexity: 'advanced',
        workflow: {
          nodes: [
            { type: 'n8n-nodes-base.scheduleTrigger', name: 'Diario a las 9am' },
            { type: 'n8n-nodes-base.openAI', name: 'Generar Contenido' },
            { type: 'n8n-nodes-base.twitter', name: 'Publicar Tweet' }
          ]
        },
        semanticVector: null
      },

      // Categoría: Finanzas y Reportes
      {
        id: 'financial_reporting_automation',
        category: 'finance',
        description: 'Automatizar reportes financieros desde múltiples fuentes',
        keywords: ['finanzas', 'reportes', 'automatización', 'excel', 'contabilidad'],
        complexity: 'expert',
        workflow: {
          nodes: [
            { type: 'n8n-nodes-base.scheduleTrigger', name: 'Fin de Mes' },
            { type: 'n8n-nodes-base.googleSheets', name: 'Datos Ventas' },
            { type: 'n8n-nodes-base.excel', name: 'Generar Reporte' }
          ]
        },
        semanticVector: null
      }
    ];

    console.log(`📚 ${this.workflowExamples.length} workflows de ejemplo cargados para vectorización`);
  }

  /**
   * 🧮 Generar embedding/vector semántico usando Gemini
   */
  async generateEmbedding(text) {
    try {
      // Verificar cache primero
      const cacheKey = this.generateCacheKey(text);
      if (this.embeddingCache.has(cacheKey)) {
        this.metrics.cacheHits++;
        return this.embeddingCache.get(cacheKey);
      }

      // Obtener modelo actual del enrutador
      this.getCurrentModel();

      if (!this.model) {
        console.log('⚠️ Modelo no disponible para embedding');
        return this.generateFallbackVector(text);
      }

      // Usar Gemini para generar embedding
      const prompt = `Genera un vector semántico para este texto de workflow:
      
      "${text}"
      
      Devuelve solo un array de números entre -1 y 1, separados por comas, que representen el significado semántico del texto. El vector debe tener exactamente 50 dimensiones.
      
      Formato: [0.1, -0.3, 0.7, ...]`;

      console.log(`🧮 Generando embedding con ${this.currentModelName}...`);
      
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parsear el vector de la respuesta
      const vector = this.parseVectorFromResponse(response);
      
      // Guardar en cache
      this.embeddingCache.set(cacheKey, vector);
      this.metrics.totalVectorizations++;
      
      console.log(`✅ Embedding generado: ${vector.length} dimensiones`);
      return vector;

    } catch (error) {
      console.error('❌ Error generando embedding:', error.message);
      return this.generateFallbackVector(text);
    }
  }

  /**
   * 🔄 Generar vector de fallback usando hashing simple
   */
  generateFallbackVector(text) {
    console.log('🔄 Generando vector de fallback...');
    const vector = [];
    const normalizedText = text.toLowerCase();
    
    // Generar 50 dimensiones basadas en características del texto
    for (let i = 0; i < 50; i++) {
      const char = normalizedText.charCodeAt(i % normalizedText.length) || 0;
      const hash = (char * (i + 1)) % 200 - 100; // Rango -100 a 100
      vector.push(hash / 100); // Normalizar a -1 a 1
    }
    
    return vector;
  }

  /**
   * 📝 Parsear vector de la respuesta de Gemini
   */
  parseVectorFromResponse(response) {
    try {
      // Buscar array de números en la respuesta
      const vectorMatch = response.match(/\[([\d\.,\-\s]+)\]/);
      if (vectorMatch) {
        const numbers = vectorMatch[1]
          .split(',')
          .map(n => parseFloat(n.trim()))
          .filter(n => !isNaN(n));
        
        if (numbers.length >= 50) {
          return numbers.slice(0, 50); // Tomar exactamente 50 dimensiones
        }
      }
      
      // Si no se puede parsear, generar vector fallback
      throw new Error('No se pudo parsear vector de la respuesta');
      
    } catch (error) {
      console.log('⚠️ Error parseando vector, usando fallback');
      return this.generateFallbackVector(response);
    }
  }

  /**
   * 🔑 Generar clave de cache
   */
  generateCacheKey(text) {
    return text.slice(0, 100).replace(/\s+/g, '_').toLowerCase();
  }

  /**
   * 📐 Calcular similitud coseno entre dos vectores
   */
  calculateCosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return isNaN(similarity) ? 0 : similarity;
  }

  /**
   * 🔍 Vectorizar prompt del usuario
   */
  async vectorizeUserPrompt(userPrompt) {
    console.log('🔍 Vectorizando prompt del usuario...');
    
    // Preparar texto para vectorización
    const searchText = `${userPrompt}`;
    
    return await this.generateEmbedding(searchText);
  }

  /**
   * 🎯 Buscar workflows similares por vectores semánticos
   */
  async findSimilarWorkflows(userVector, topK = 3) {
    const startTime = Date.now();
    console.log(`🎯 Buscando ${topK} workflows más similares...`);
    
    // Asegurarse de que todos los workflows tienen vectores
    await this.ensureAllWorkflowsVectorized();
    
    const similarities = [];
    
    for (const workflow of this.workflowExamples) {
      if (workflow.semanticVector) {
        const similarity = this.calculateCosineSimilarity(userVector, workflow.semanticVector);
        similarities.push({
          workflow,
          similarity,
          score: Math.round(similarity * 100)
        });
      }
    }
    
    // Ordenar por similitud descendente
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    const topResults = similarities.slice(0, topK);
    
    const searchTime = Date.now() - startTime;
    this.metrics.averageSearchTime = searchTime;
    
    console.log(`✅ Búsqueda completada en ${searchTime}ms:`);
    topResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.workflow.description} (${result.score}% similar)`);
    });
    
    return topResults;
  }

  /**
   * 🛠️ Asegurar que todos los workflows estén vectorizados
   */
  async ensureAllWorkflowsVectorized() {
    const unvectorized = this.workflowExamples.filter(w => !w.semanticVector);
    
    if (unvectorized.length > 0) {
      console.log(`🛠️ Vectorizando ${unvectorized.length} workflows pendientes...`);
      
      for (const workflow of unvectorized) {
        const textToVectorize = `${workflow.description} ${workflow.keywords.join(' ')} ${workflow.category}`;
        workflow.semanticVector = await this.generateEmbedding(textToVectorize);
        
        // Pequeña pausa para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('✅ Todos los workflows vectorizados');
    }
  }

  /**
   * 📝 Generar contexto enriquecido para Gemini
   */
  async generateEnrichedContext(userPrompt) {
    console.log('📝 Generando contexto enriquecido...');
    
    try {
      // Vectorizar prompt del usuario
      const userVector = await this.vectorizeUserPrompt(userPrompt);
      
      // Encontrar workflows similares
      const similarWorkflows = await this.findSimilarWorkflows(userVector, 3);
      
      // Formatear contexto para Gemini
      const context = this.formatContextForGemini(similarWorkflows, userPrompt);
      
      console.log('✅ Contexto enriquecido generado');
      return context;
      
    } catch (error) {
      console.error('❌ Error generando contexto:', error.message);
      return this.generateFallbackContext(userPrompt);
    }
  }

  /**
   * 📋 Formatear contexto para Gemini
   */
  formatContextForGemini(similarWorkflows, userPrompt) {
    if (similarWorkflows.length === 0) {
      return this.generateFallbackContext(userPrompt);
    }

    let context = `📚 WORKFLOWS SIMILARES DETECTADOS (Basado en análisis semántico):\n\n`;
    
    similarWorkflows.forEach((result, index) => {
      const { workflow, score } = result;
      context += `${index + 1}. **${workflow.description}** (${score}% similar)\n`;
      context += `   Categoría: ${workflow.category}\n`;
      context += `   Complejidad: ${workflow.complexity}\n`;
      context += `   Nodos principales: ${workflow.workflow.nodes.map(n => n.name).join(', ')}\n`;
      context += `   Palabras clave: ${workflow.keywords.join(', ')}\n\n`;
    });
    
    context += `🎯 RECOMENDACIÓN: Usa estos workflows como referencia para crear una solución similar pero adaptada al prompt: "${userPrompt}"\n\n`;
    
    return context;
  }

  /**
   * 🔄 Generar contexto de fallback
   */
  generateFallbackContext(userPrompt) {
    return `📋 CONTEXTO BÁSICO: Genera un workflow para: "${userPrompt}"\n\n`;
  }

  /**
   * 📊 Obtener métricas del sistema
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.embeddingCache.size,
      workflowsVectorized: this.workflowExamples.filter(w => w.semanticVector).length,
      totalWorkflows: this.workflowExamples.length
    };
  }

  /**
   * 🧹 Limpiar cache
   */
  clearCache() {
    this.embeddingCache.clear();
    console.log('🧹 Cache de embeddings limpiado');
  }

  /**
   * 📈 Agregar nuevo workflow de ejemplo
   */
  async addWorkflowExample(workflowData) {
    console.log(`📈 Agregando nuevo workflow: ${workflowData.description}`);
    
    // Generar vector inmediatamente
    const textToVectorize = `${workflowData.description} ${workflowData.keywords.join(' ')} ${workflowData.category}`;
    workflowData.semanticVector = await this.generateEmbedding(textToVectorize);
    
    this.workflowExamples.push(workflowData);
    console.log('✅ Workflow agregado y vectorizado');
  }
}
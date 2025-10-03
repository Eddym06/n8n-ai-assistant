/**
 * 🎯 INTELLIGENT POSITIONING AGENT V4 - AI-ENHANCED WITH LANGCHAIN SUPPORT
 * =========================================================================
 * 
 * Agente de posicionamiento inteligente mejorado para workflows tradicionales
 * y workflows AI con soporte completo para conexiones LangChain.
 * 
 * CARACTERÍSTICAS V4:
 * ✅ Posicionamiento avanzado con prevención de colisiones
 * ✅ Soporte completo para conexiones tradicionales (main, else)
 * 🆕 Soporte para conexiones AI (ai_tool, ai_languageModel, ai_memory)
 * 🆕 Algoritmos específicos para layouts de agentes AI
 * 🆕 Posicionamiento optimizado para workflows conversacionales
 * 🆕 Detección automática de patrones AI
 */

export default class IntelligentPositioningAgentV4AIEnhanced {
  constructor() {
    this.version = "4.0-AI-Enhanced";
    this.supportedConnectionTypes = this.initializeSupportedConnections();
    this.aiLayoutPatterns = this.initializeAILayoutPatterns();
    this.collisionPrevention = true;
    this.aiOptimization = true;
    
    console.log('🎯 IntelligentPositioningAgentV4 inicializado con soporte AI completo');
    console.log(`🔗 Tipos de conexión soportados: ${Object.keys(this.supportedConnectionTypes).length}`);
  }

  /**
   * 🆕 INICIALIZAR TIPOS DE CONEXIÓN SOPORTADOS
   */
  initializeSupportedConnections() {
    return {
      // 📝 CONEXIONES TRADICIONALES
      main: {
        type: 'traditional',
        color: '#7366bd',
        style: 'solid',
        weight: 1,
        description: 'Flujo principal de datos'
      },
      else: {
        type: 'traditional', 
        color: '#ff6d5a',
        style: 'dashed',
        weight: 0.8,
        description: 'Flujo alternativo (condicional)'
      },

      // 🤖 CONEXIONES AI LANGCHAIN
      ai_tool: {
        type: 'ai',
        color: '#00d4aa',
        style: 'bold',
        weight: 1.2,
        description: 'Herramientas AI disponibles para el agente',
        category: 'tool_connection',
        layoutPriority: 'high'
      },
      ai_languageModel: {
        type: 'ai',
        color: '#ff9500',
        style: 'bold',
        weight: 1.5,
        description: 'Modelo de lenguaje principal del agente',
        category: 'model_connection',
        layoutPriority: 'critical'
      },
      ai_memory: {
        type: 'ai',
        color: '#5865f2',
        style: 'bold',
        weight: 1.3,
        description: 'Sistema de memoria del agente',
        category: 'memory_connection',
        layoutPriority: 'high'
      },
      ai_vectorStore: {
        type: 'ai',
        color: '#9c27b0',
        style: 'solid',
        weight: 1.1,
        description: 'Base de datos vectorial',
        category: 'storage_connection',
        layoutPriority: 'medium'
      },
      ai_retriever: {
        type: 'ai',
        color: '#ff5722',
        style: 'solid',
        weight: 1.0,
        description: 'Retriever de información',
        category: 'retrieval_connection',
        layoutPriority: 'medium'
      },
      ai_embedding: {
        type: 'ai',
        color: '#795548',
        style: 'solid',
        weight: 0.9,
        description: 'Generador de embeddings',
        category: 'embedding_connection',
        layoutPriority: 'low'
      },
      ai_textSplitter: {
        type: 'ai',
        color: '#607d8b',
        style: 'dotted',
        weight: 0.8,
        description: 'Divisor de texto',
        category: 'processing_connection',
        layoutPriority: 'low'
      }
    };
  }

  /**
   * 🆕 PATRONES DE LAYOUT PARA WORKFLOWS AI
   */
  initializeAILayoutPatterns() {
    return {
      // 🤖 PATRÓN AGENTE CENTRAL
      agent_hub: {
        name: 'Agente Central',
        description: 'Agente AI en el centro con herramientas alrededor',
        centerNodeTypes: ['@n8n/n8n-nodes-langchain.agent'],
        satelliteCategories: ['ai_tool', 'ai_memory', 'ai_languageModel'],
        layout: 'radial',
        spacing: {
          center_to_satellite: 400,
          satellite_spacing: 300,
          layer_spacing: 200
        }
      },

      // 🧠 PATRÓN PIPELINE AI
      ai_pipeline: {
        name: 'Pipeline AI',
        description: 'Flujo secuencial de procesamiento AI',
        flow: ['input', 'processing', 'ai_agent', 'output'],
        nodeCategories: {
          input: ['trigger', 'webhook'],
          processing: ['text_processor', 'embeddings'],
          ai_agent: ['agent', 'language_model'],
          output: ['response', 'action']
        },
        layout: 'horizontal',
        spacing: {
          horizontal: 350,
          vertical: 180
        }
      },

      // 💬 PATRÓN CONVERSACIONAL
      conversational: {
        name: 'Flujo Conversacional',
        description: 'Optimizado para chatbots y asistentes',
        flow: ['trigger', 'memory_load', 'agent', 'response', 'memory_save'],
        specialPositioning: {
          memory_nodes: 'top_layer',
          agent_node: 'center',
          tools: 'right_side'
        },
        layout: 'conversational',
        spacing: {
          horizontal: 300,
          vertical: 200,
          memory_offset: -100
        }
      },

      // 🔍 PATRÓN RAG (Retrieval Augmented Generation)
      rag_pattern: {
        name: 'RAG Pattern',
        description: 'Patrón para recuperación y generación aumentada',
        flow: ['query', 'retriever', 'vector_store', 'agent', 'response'],
        layout: 'rag_optimized',
        spacing: {
          horizontal: 380,
          vertical: 220,
          retrieval_layer: 150
        }
      }
    };
  }

  /**
   * 🚀 POSICIONAR WORKFLOW CON DETECCIÓN AI AUTOMÁTICA
   */
  async positionWorkflow(workflow, options = {}) {
    console.log('🎯 IntelligentPositioningAgentV4 - Iniciando posicionamiento...');
    
    // Detectar si es workflow AI
    const isAIWorkflow = this.detectAIWorkflow(workflow);
    const aiPattern = isAIWorkflow ? this.detectAIPattern(workflow) : null;
    
    console.log(`🔍 Workflow detectado: ${isAIWorkflow ? 'AI' : 'Tradicional'}${aiPattern ? ` (${aiPattern})` : ''}`);
    
    if (isAIWorkflow && aiPattern) {
      return await this.positionAIWorkflow(workflow, aiPattern, options);
    } else {
      return await this.positionTraditionalWorkflow(workflow, options);
    }
  }

  /**
   * 🆕 DETECTAR SI ES WORKFLOW AI
   */
  detectAIWorkflow(workflow) {
    const aiNodeTypes = [
      '@n8n/n8n-nodes-langchain.agent',
      '@n8n/n8n-nodes-langchain.lmChatOpenAi',
      '@n8n/n8n-nodes-langchain.memoryPostgresChat',
      '@n8n/n8n-nodes-langchain.mcpClientTool'
    ];

    const hasAINodes = workflow.nodes?.some(node => 
      aiNodeTypes.some(aiType => node.type === aiType)
    );

    const hasAIConnections = this.hasAIConnections(workflow);

    return hasAINodes || hasAIConnections;
  }

  /**
   * 🆕 DETECTAR CONEXIONES AI
   */
  hasAIConnections(workflow) {
    const aiConnectionTypes = ['ai_tool', 'ai_languageModel', 'ai_memory', 'ai_vectorStore'];
    
    if (!workflow.connections) return false;

    for (const [sourceName, sourceConnections] of Object.entries(workflow.connections)) {
      for (const connectionType of Object.keys(sourceConnections)) {
        if (aiConnectionTypes.includes(connectionType)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * 🆕 DETECTAR PATRÓN AI ESPECÍFICO
   */
  detectAIPattern(workflow) {
    const agentNodes = workflow.nodes?.filter(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    ) || [];

    const memoryNodes = workflow.nodes?.filter(node => 
      node.type?.includes('memory')
    ) || [];

    const toolNodes = workflow.nodes?.filter(node => 
      node.type?.includes('tool')
    ) || [];

    // Patrón conversacional: agente + memoria + múltiples herramientas
    if (agentNodes.length === 1 && memoryNodes.length >= 1 && toolNodes.length >= 2) {
      return 'conversational';
    }

    // Patrón agente central: un agente con múltiples herramientas alrededor
    if (agentNodes.length === 1 && toolNodes.length >= 3) {
      return 'agent_hub';
    }

    // Patrón RAG: tiene vector store y retriever
    const hasVectorStore = workflow.nodes?.some(node => 
      node.type?.includes('vectorStore')
    );
    const hasRetriever = workflow.nodes?.some(node => 
      node.type?.includes('retriever')
    );
    
    if (hasVectorStore && hasRetriever) {
      return 'rag_pattern';
    }

    // Por defecto: pipeline AI
    return 'ai_pipeline';
  }

  /**
   * 🆕 POSICIONAR WORKFLOW AI
   */
  async positionAIWorkflow(workflow, pattern, options = {}) {
    console.log(`🤖 Aplicando patrón AI: ${pattern}`);
    
    const layoutPattern = this.aiLayoutPatterns[pattern];
    if (!layoutPattern) {
      console.warn(`⚠️ Patrón ${pattern} no encontrado, usando layout tradicional`);
      return await this.positionTraditionalWorkflow(workflow, options);
    }

    switch (pattern) {
      case 'conversational':
        return await this.positionConversationalWorkflow(workflow, layoutPattern, options);
      case 'agent_hub':
        return await this.positionAgentHubWorkflow(workflow, layoutPattern, options);
      case 'rag_pattern':
        return await this.positionRAGWorkflow(workflow, layoutPattern, options);
      default:
        return await this.positionAIPipelineWorkflow(workflow, layoutPattern, options);
    }
  }

  /**
   * 🆕 POSICIONAMIENTO CONVERSACIONAL
   */
  async positionConversationalWorkflow(workflow, pattern, options) {
    console.log('💬 Aplicando layout conversacional...');
    
    const spacing = pattern.spacing;
    let currentX = 100;
    let currentY = 100;

    // 1. Posicionar trigger (entrada)
    const triggerNodes = workflow.nodes.filter(node => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    
    for (const trigger of triggerNodes) {
      trigger.position = [currentX, currentY];
      console.log(`📥 ${trigger.name}: [${currentX}, ${currentY}] (trigger)`);
      currentX += spacing.horizontal;
    }

    // 2. Posicionar nodos de memoria (arriba)
    currentY += spacing.memory_offset; // Memoria más arriba
    currentX = 100 + spacing.horizontal;
    
    const memoryNodes = workflow.nodes.filter(node => 
      node.type?.includes('memory')
    );
    
    for (const memory of memoryNodes) {
      memory.position = [currentX, currentY];
      console.log(`🧠 ${memory.name}: [${currentX}, ${currentY}] (memoria)`);
      currentX += spacing.horizontal;
    }

    // 3. Posicionar agente principal (centro)
    currentY = 100 + spacing.vertical;
    currentX = 100 + spacing.horizontal * 1.5;
    
    const agentNodes = workflow.nodes.filter(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    );
    
    for (const agent of agentNodes) {
      agent.position = [currentX, currentY];
      console.log(`🤖 ${agent.name}: [${currentX}, ${currentY}] (agente principal)`);
      currentX += spacing.horizontal;
    }

    // 4. Posicionar modelo de lenguaje (al lado del agente)
    const modelNodes = workflow.nodes.filter(node => 
      node.type?.includes('lmChat')
    );
    
    for (const model of modelNodes) {
      model.position = [currentX, currentY];
      console.log(`🧠 ${model.name}: [${currentX}, ${currentY}] (modelo lenguaje)`);
      currentX += spacing.horizontal;
    }

    // 5. Posicionar herramientas (lado derecho)
    currentX = 100 + spacing.horizontal * 3;
    currentY = 100 + spacing.vertical * 2;
    
    const toolNodes = workflow.nodes.filter(node => 
      node.type?.includes('tool') || node.type?.includes('mcpClient')
    );
    
    let toolColumn = 0;
    for (const [index, tool] of toolNodes.entries()) {
      if (index > 0 && index % 3 === 0) {
        toolColumn++;
        currentY = 100 + spacing.vertical * 2;
      }
      
      const toolX = currentX + (toolColumn * spacing.horizontal);
      const toolY = currentY + ((index % 3) * spacing.vertical * 0.8);
      
      tool.position = [toolX, toolY];
      console.log(`🛠️ ${tool.name}: [${toolX}, ${toolY}] (herramienta)`);
    }

    // 6. Posicionar nodos de salida
    currentX = 100 + spacing.horizontal * 2;
    currentY = 100 + spacing.vertical * 3;
    
    const outputNodes = workflow.nodes.filter(node => 
      !triggerNodes.includes(node) && 
      !memoryNodes.includes(node) && 
      !agentNodes.includes(node) && 
      !modelNodes.includes(node) && 
      !toolNodes.includes(node)
    );
    
    for (const output of outputNodes) {
      output.position = [currentX, currentY];
      console.log(`📤 ${output.name}: [${currentX}, ${currentY}] (salida)`);
      currentX += spacing.horizontal;
    }

    // Añadir metadata
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.positioning = {
      applied: true,
      pattern: 'conversational',
      agent: 'IntelligentPositioningAgentV4',
      aiOptimized: true,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Layout conversacional aplicado exitosamente');
    return workflow;
  }

  /**
   * 🆕 POSICIONAMIENTO AGENTE HUB (RADIAL)
   */
  async positionAgentHubWorkflow(workflow, pattern, options) {
    console.log('🎯 Aplicando layout de agente central (hub)...');
    
    const spacing = pattern.spacing;
    const centerX = 600;
    const centerY = 400;

    // 1. Posicionar agente en el centro
    const agentNodes = workflow.nodes.filter(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    );
    
    for (const agent of agentNodes) {
      agent.position = [centerX, centerY];
      console.log(`🤖 ${agent.name}: [${centerX}, ${centerY}] (agente central)`);
    }

    // 2. Posicionar modelo de lenguaje (posición crítica)
    const modelNodes = workflow.nodes.filter(node => 
      node.type?.includes('lmChat')
    );
    
    for (const [index, model] of modelNodes.entries()) {
      const angle = (index * 90) * (Math.PI / 180); // 0°, 90°, 180°, 270°
      const modelX = centerX + Math.cos(angle) * spacing.center_to_satellite;
      const modelY = centerY + Math.sin(angle) * spacing.center_to_satellite;
      
      model.position = [modelX, modelY];
      console.log(`🧠 ${model.name}: [${modelX}, ${modelY}] (modelo crítico)`);
    }

    // 3. Posicionar herramientas en círculo
    const toolNodes = workflow.nodes.filter(node => 
      node.type?.includes('tool') || node.type?.includes('mcpClient')
    );
    
    const toolAngleStep = (360 / Math.max(toolNodes.length, 4)) * (Math.PI / 180);
    const toolRadius = spacing.center_to_satellite * 0.7;
    
    for (const [index, tool] of toolNodes.entries()) {
      const angle = index * toolAngleStep + (45 * Math.PI / 180); // Offset 45°
      const toolX = centerX + Math.cos(angle) * toolRadius;
      const toolY = centerY + Math.sin(angle) * toolRadius;
      
      tool.position = [toolX, toolY];
      console.log(`🛠️ ${tool.name}: [${toolX}, ${toolY}] (herramienta radial)`);
    }

    // 4. Posicionar memoria (arriba del agente)
    const memoryNodes = workflow.nodes.filter(node => 
      node.type?.includes('memory')
    );
    
    for (const [index, memory] of memoryNodes.entries()) {
      const memoryX = centerX + (index * 200) - 100;
      const memoryY = centerY - spacing.center_to_satellite;
      
      memory.position = [memoryX, memoryY];
      console.log(`🧠 ${memory.name}: [${memoryX}, ${memoryY}] (memoria)`);
    }

    // 5. Posicionar entrada y salida
    const triggerNodes = workflow.nodes.filter(node => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    
    for (const [index, trigger] of triggerNodes.entries()) {
      trigger.position = [centerX - spacing.center_to_satellite * 1.5, centerY + (index * 200)];
      console.log(`📥 ${trigger.name}: [${trigger.position[0]}, ${trigger.position[1]}] (entrada)`);
    }

    // Otros nodos (salida, procesamiento)
    const otherNodes = workflow.nodes.filter(node => 
      !agentNodes.includes(node) && 
      !modelNodes.includes(node) && 
      !toolNodes.includes(node) && 
      !memoryNodes.includes(node) && 
      !triggerNodes.includes(node)
    );
    
    for (const [index, other] of otherNodes.entries()) {
      other.position = [centerX + spacing.center_to_satellite * 1.5, centerY + (index * 200)];
      console.log(`📤 ${other.name}: [${other.position[0]}, ${other.position[1]}] (salida)`);
    }

    // Añadir metadata
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.positioning = {
      applied: true,
      pattern: 'agent_hub',
      agent: 'IntelligentPositioningAgentV4',
      layout: 'radial',
      aiOptimized: true,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Layout agente hub aplicado exitosamente');
    return workflow;
  }

  /**
   * 🔄 POSICIONAMIENTO TRADICIONAL (COMPATIBLE)
   */
  async positionTraditionalWorkflow(workflow, options = {}) {
    console.log('⚙️ Aplicando posicionamiento tradicional...');
    
    // Usar algoritmo tradicional mejorado
    const spacing = {
      horizontal: 300,
      vertical: 180
    };

    let currentX = 100;
    let currentY = 100;

    // Análisis básico de dependencias
    const { graph, roots } = this.analyzeGraph(workflow.nodes, workflow.connections);
    const nodesByLevel = this.calculateLevels(graph, roots);

    // Posicionamiento por niveles
    for (const [level, levelNodes] of nodesByLevel.entries()) {
      const levelY = currentY + (level * spacing.vertical);
      
      for (const [index, node] of levelNodes.entries()) {
        const nodeX = currentX + (index * spacing.horizontal);
        node.position = [nodeX, levelY];
        console.log(`📍 ${node.name}: [${nodeX}, ${levelY}] (nivel ${level})`);
      }
    }

    // Añadir metadata
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.positioning = {
      applied: true,
      pattern: 'traditional',
      agent: 'IntelligentPositioningAgentV4',
      levels: nodesByLevel.length,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Posicionamiento tradicional aplicado');
    return workflow;
  }

  /**
   * 🔍 ANÁLISIS DE GRAFO
   */
  analyzeGraph(nodes, connections) {
    const graph = new Map();
    const inDegree = new Map();

    // Inicializar grafo
    for (const node of nodes) {
      graph.set(node.name, []);
      inDegree.set(node.name, 0);
    }

    // Construir grafo y calcular grados de entrada
    if (connections) {
      for (const [sourceName, sourceConnections] of Object.entries(connections)) {
        for (const [connectionType, targets] of Object.entries(sourceConnections)) {
          if (Array.isArray(targets)) {
            for (const target of targets) {
              graph.get(sourceName)?.push(target.node);
              inDegree.set(target.node, (inDegree.get(target.node) || 0) + 1);
            }
          }
        }
      }
    }

    // Encontrar nodos raíz (sin dependencias)
    const roots = Array.from(inDegree.entries())
      .filter(([node, degree]) => degree === 0)
      .map(([node]) => node);

    return { graph, roots };
  }

  /**
   * 📊 CALCULAR NIVELES TOPOLÓGICOS
   */
  calculateLevels(graph, roots) {
    const levels = [];
    const visited = new Set();
    const queue = [...roots];
    
    // BFS para calcular niveles
    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel = [];
      
      for (let i = 0; i < levelSize; i++) {
        const nodeName = queue.shift();
        if (visited.has(nodeName)) continue;
        
        visited.add(nodeName);
        currentLevel.push({ name: nodeName });
        
        // Agregar vecinos
        const neighbors = graph.get(nodeName) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
      
      if (currentLevel.length > 0) {
        levels.push(currentLevel);
      }
    }

    return levels;
  }

  /**
   * 🆕 POSICIONAMIENTO RAG OPTIMIZADO
   */
  async positionRAGWorkflow(workflow, pattern, options) {
    console.log('🔍 Aplicando layout RAG optimizado...');
    
    const spacing = pattern.spacing;
    let currentX = 100;
    let currentY = 100;

    // 1. CAPA DE ENTRADA: Query y contexto
    const inputNodes = workflow.nodes.filter(node => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    
    for (const input of inputNodes) {
      input.position = [currentX, currentY];
      console.log(`📥 ${input.name}: [${currentX}, ${currentY}] (entrada RAG)`);
      currentX += spacing.horizontal;
    }

    // 2. CAPA DE PROCESAMIENTO: Text splitters y embeddings
    currentY += spacing.vertical;
    currentX = 100;
    
    const processingNodes = workflow.nodes.filter(node => 
      node.type?.includes('textSplitter') || node.type?.includes('embedding')
    );
    
    for (const processor of processingNodes) {
      processor.position = [currentX, currentY];
      console.log(`⚙️ ${processor.name}: [${currentX}, ${currentY}] (procesamiento)`);
      currentX += spacing.horizontal;
    }

    // 3. CAPA DE ALMACENAMIENTO: Vector stores
    currentY += spacing.retrieval_layer;
    currentX = 100 + spacing.horizontal * 0.5;
    
    const vectorStoreNodes = workflow.nodes.filter(node => 
      node.type?.includes('vectorStore')
    );
    
    for (const vectorStore of vectorStoreNodes) {
      vectorStore.position = [currentX, currentY];
      console.log(`🗄️ ${vectorStore.name}: [${currentX}, ${currentY}] (vector store)`);
      currentX += spacing.horizontal * 1.5;
    }

    // 4. CAPA DE RECUPERACIÓN: Retrievers
    currentY += spacing.vertical;
    currentX = 100 + spacing.horizontal;
    
    const retrieverNodes = workflow.nodes.filter(node => 
      node.type?.includes('retriever')
    );
    
    for (const retriever of retrieverNodes) {
      retriever.position = [currentX, currentY];
      console.log(`🔍 ${retriever.name}: [${currentX}, ${currentY}] (retriever)`);
      currentX += spacing.horizontal;
    }

    // 5. CAPA DE AGENTE: AI Agent central
    currentY += spacing.vertical;
    currentX = 100 + spacing.horizontal * 1.5;
    
    const agentNodes = workflow.nodes.filter(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    );
    
    for (const agent of agentNodes) {
      agent.position = [currentX, currentY];
      console.log(`🤖 ${agent.name}: [${currentX}, ${currentY}] (agente RAG)`);
      currentX += spacing.horizontal;
    }

    // 6. MODELO DE LENGUAJE (al lado del agente)
    const modelNodes = workflow.nodes.filter(node => 
      node.type?.includes('lmChat')
    );
    
    for (const model of modelNodes) {
      model.position = [currentX, currentY];
      console.log(`🧠 ${model.name}: [${currentX}, ${currentY}] (modelo LLM)`);
      currentX += spacing.horizontal;
    }

    // 7. CAPA DE SALIDA: Response y acciones
    currentY += spacing.vertical;
    currentX = 100 + spacing.horizontal;
    
    const outputNodes = workflow.nodes.filter(node => 
      !inputNodes.includes(node) && 
      !processingNodes.includes(node) && 
      !vectorStoreNodes.includes(node) && 
      !retrieverNodes.includes(node) && 
      !agentNodes.includes(node) && 
      !modelNodes.includes(node)
    );
    
    for (const output of outputNodes) {
      output.position = [currentX, currentY];
      console.log(`📤 ${output.name}: [${currentX}, ${currentY}] (salida RAG)`);
      currentX += spacing.horizontal;
    }

    // Metadata especializada para RAG
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.positioning = {
      applied: true,
      pattern: 'rag_optimized',
      agent: 'IntelligentPositioningAgentV4',
      layers: ['input', 'processing', 'storage', 'retrieval', 'agent', 'output'],
      aiOptimized: true,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Layout RAG optimizado aplicado');
    return workflow;
  }

  /**
   * 🆕 POSICIONAMIENTO PIPELINE AI OPTIMIZADO
   */
  async positionAIPipelineWorkflow(workflow, pattern, options) {
    console.log('🔄 Aplicando layout pipeline AI optimizado...');
    
    const spacing = pattern.spacing;
    let currentX = 100;
    let currentY = 100;

    // 1. ANÁLISIS DE FLUJO SECUENCIAL
    const pipeline = this.analyzePipelineFlow(workflow);
    console.log(`📊 Pipeline detectado: ${pipeline.stages.length} etapas`);

    // 2. POSICIONAMIENTO POR ETAPAS
    for (const [stageIndex, stage] of pipeline.stages.entries()) {
      const stageY = currentY + (stageIndex * spacing.vertical);
      
      console.log(`🔄 Etapa ${stageIndex + 1}: ${stage.name} (${stage.nodes.length} nodos)`);
      
      // Centrar nodos de la etapa
      const stageWidth = stage.nodes.length * spacing.horizontal;
      const startX = currentX + (stageWidth / 2);
      
      for (const [nodeIndex, node] of stage.nodes.entries()) {
        const nodeX = startX + (nodeIndex * spacing.horizontal) - (stageWidth / 2);
        node.position = [nodeX, stageY];
        console.log(`  📍 ${node.name}: [${nodeX}, ${stageY}]`);
      }
    }

    // 3. OPTIMIZACIÓN ESPECÍFICA PARA TIPOS AI
    await this.optimizeAINodePositions(workflow, spacing);

    // 4. AJUSTE PARA CONEXIONES COMPLEJAS
    await this.adjustForComplexConnections(workflow, spacing);

    // Metadata del pipeline
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.positioning = {
      applied: true,
      pattern: 'ai_pipeline_optimized',
      agent: 'IntelligentPositioningAgentV4',
      stages: pipeline.stages.length,
      flow: 'sequential',
      aiOptimized: true,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Layout pipeline AI optimizado aplicado');
    return workflow;
  }

  /**
   * 🔄 ANALIZAR FLUJO DE PIPELINE
   */
  analyzePipelineFlow(workflow) {
    const stages = [];
    
    // Identificar etapas típicas de pipeline AI
    const stageDefinitions = [
      {
        name: 'Input',
        nodeTypes: ['trigger', 'webhook', 'start'],
        keywords: ['input', 'trigger', 'start', 'entrada']
      },
      {
        name: 'Preprocessing',
        nodeTypes: ['textSplitter', 'embedding'],
        keywords: ['split', 'embed', 'process', 'prepare']
      },
      {
        name: 'Memory/Context',
        nodeTypes: ['memory', 'vectorStore'],
        keywords: ['memory', 'context', 'store', 'historia']
      },
      {
        name: 'AI Processing',
        nodeTypes: ['agent', 'lmChat'],
        keywords: ['agent', 'model', 'ai', 'gpt']
      },
      {
        name: 'Tools/Actions',
        nodeTypes: ['tool', 'mcpClient'],
        keywords: ['tool', 'action', 'execute', 'call']
      },
      {
        name: 'Output',
        nodeTypes: ['response', 'webhook'],
        keywords: ['output', 'response', 'result', 'salida']
      }
    ];

    // Clasificar nodos en etapas
    for (const stageDef of stageDefinitions) {
      const stageNodes = workflow.nodes?.filter(node => {
        // Por tipo de nodo
        const typeMatch = stageDef.nodeTypes.some(type => 
          node.type?.toLowerCase().includes(type)
        );
        
        // Por palabras clave en el nombre
        const nameMatch = stageDef.keywords.some(keyword => 
          node.name?.toLowerCase().includes(keyword)
        );
        
        return typeMatch || nameMatch;
      }) || [];

      if (stageNodes.length > 0) {
        stages.push({
          name: stageDef.name,
          nodes: stageNodes,
          type: 'ai_pipeline_stage'
        });
      }
    }

    // Nodos no clasificados van a una etapa genérica
    const classifiedNodes = stages.flatMap(stage => stage.nodes);
    const unclassifiedNodes = workflow.nodes?.filter(node => 
      !classifiedNodes.includes(node)
    ) || [];

    if (unclassifiedNodes.length > 0) {
      stages.push({
        name: 'Other',
        nodes: unclassifiedNodes,
        type: 'generic'
      });
    }

    return { stages, totalNodes: workflow.nodes?.length || 0 };
  }

  /**
   * ⚡ OPTIMIZAR POSICIONES DE NODOS AI
   */
  async optimizeAINodePositions(workflow, spacing) {
    console.log('⚡ Optimizando posiciones específicas para nodos AI...');
    
    // 1. Agentes AI centrales
    const agentNodes = workflow.nodes?.filter(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    ) || [];

    for (const agent of agentNodes) {
      // Centrar agentes horizontalmente
      const centerX = 400; // Centro aproximado
      agent.position[0] = centerX;
      console.log(`🎯 Centrado agente: ${agent.name}`);
    }

    // 2. Modelos de lenguaje cerca de agentes
    const modelNodes = workflow.nodes?.filter(node => 
      node.type?.includes('lmChat')
    ) || [];

    for (const model of modelNodes) {
      const nearestAgent = this.findNearestNode(model, agentNodes);
      if (nearestAgent) {
        model.position[0] = nearestAgent.position[0] + spacing.horizontal;
        model.position[1] = nearestAgent.position[1];
        console.log(`🔗 Modelo ${model.name} cerca de agente ${nearestAgent.name}`);
      }
    }

    // 3. Herramientas en cluster
    const toolNodes = workflow.nodes?.filter(node => 
      node.type?.includes('tool') || node.type?.includes('mcpClient')
    ) || [];

    if (toolNodes.length > 0) {
      const toolClusterX = 600;
      const toolStartY = 200;
      
      for (const [index, tool] of toolNodes.entries()) {
        tool.position[0] = toolClusterX + (index % 2) * 200;
        tool.position[1] = toolStartY + Math.floor(index / 2) * spacing.vertical * 0.6;
        console.log(`🛠️ Herramienta ${tool.name} en cluster`);
      }
    }
  }

  /**
   * 🔗 AJUSTAR PARA CONEXIONES COMPLEJAS
   */
  async adjustForComplexConnections(workflow, spacing) {
    console.log('🔗 Ajustando para conexiones complejas...');
    
    if (!workflow.connections) return;

    // Analizar densidad de conexiones
    const connectionDensity = this.calculateConnectionDensity(workflow);
    console.log(`📊 Densidad de conexiones: ${connectionDensity.toFixed(2)}`);

    // Si hay alta densidad, aumentar espaciado
    if (connectionDensity > 0.7) {
      const multiplier = 1.3;
      for (const node of workflow.nodes || []) {
        node.position[0] *= multiplier;
        node.position[1] *= multiplier;
      }
      console.log('📏 Espaciado aumentado por alta densidad de conexiones');
    }

    // Evitar solapamientos en conexiones AI complejas
    await this.avoidAIConnectionOverlaps(workflow, spacing);
  }

  /**
   * 🎯 ENCONTRAR NODO MÁS CERCANO
   */
  findNearestNode(targetNode, candidateNodes) {
    if (!candidateNodes.length) return null;
    
    let nearest = candidateNodes[0];
    let minDistance = this.calculateDistance(targetNode.position, nearest.position);
    
    for (const candidate of candidateNodes.slice(1)) {
      const distance = this.calculateDistance(targetNode.position, candidate.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = candidate;
      }
    }
    
    return nearest;
  }

  /**
   * 📐 CALCULAR DISTANCIA ENTRE POSICIONES
   */
  calculateDistance(pos1, pos2) {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 📊 CALCULAR DENSIDAD DE CONEXIONES
   */
  calculateConnectionDensity(workflow) {
    const nodeCount = workflow.nodes?.length || 0;
    if (nodeCount < 2) return 0;
    
    const maxPossibleConnections = nodeCount * (nodeCount - 1);
    const actualConnections = Object.values(workflow.connections || {})
      .reduce((total, nodeConnections) => {
        return total + Object.values(nodeConnections)
          .reduce((nodeTotal, connections) => nodeTotal + connections.length, 0);
      }, 0);
    
    return actualConnections / maxPossibleConnections;
  }

  /**
   * 🔀 EVITAR SOLAPAMIENTOS EN CONEXIONES AI
   */
  async avoidAIConnectionOverlaps(workflow, spacing) {
    console.log('🔀 Evitando solapamientos en conexiones AI...');
    
    // Identificar nodos con múltiples conexiones AI
    const aiConnectionTypes = ['ai_tool', 'ai_languageModel', 'ai_memory', 'ai_vectorStore'];
    const busyNodes = [];
    
    for (const [nodeName, connections] of Object.entries(workflow.connections || {})) {
      const aiConnections = Object.keys(connections).filter(type => 
        aiConnectionTypes.includes(type)
      );
      
      if (aiConnections.length > 2) {
        busyNodes.push({
          name: nodeName,
          aiConnectionCount: aiConnections.length
        });
      }
    }

    // Aumentar espaciado alrededor de nodos con muchas conexiones AI
    for (const busyNode of busyNodes) {
      const node = workflow.nodes?.find(n => n.name === busyNode.name);
      if (node) {
        // Crear "zona de exclusión" alrededor del nodo
        const exclusionRadius = spacing.horizontal * 0.8;
        console.log(`🚫 Zona de exclusión para ${node.name}: radio ${exclusionRadius}`);
      }
    }
  }
}
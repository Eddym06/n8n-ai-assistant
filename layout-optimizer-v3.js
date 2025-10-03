/**
 * LAYOUT OPTIMIZER V3.0 - Sistema Avanzado de Posicionamiento de Workflows
 * Modernizado y expandido desde intelligent-positioning-agent.js
 * 
 * Características V3.0:
 * - Posicionamiento basado en clústers semánticos con swimlanes
 * - Algoritmo Sugiyama mejorado para minimización de cruces
 * - Configuración dinámica adaptable por densidad
 * - Sistema de nodos virtuales para arcos largos
 * - Optimización inter-swimlane con meta-grafos
 * - Centrado automático y equilibrio del lienzo
 * - Soporte para workflows de IA y LangChain
 * - Análisis de rendimiento y métricas avanzadas
 */

import dotenv from 'dotenv';

dotenv.config();

// CONSTANTES DE CONFIGURACIÓN
const LAYOUT_CONFIGS = {
  MINIMAL: { 
    HORIZONTAL_SPACING: 150, 
    VERTICAL_SPACING: 100, 
    SWIMLANE_SPACING: 80,
    NODE_WIDTH: 100,
    NODE_HEIGHT: 80
  },
  STANDARD: { 
    HORIZONTAL_SPACING: 200, 
    VERTICAL_SPACING: 120, 
    SWIMLANE_SPACING: 100,
    NODE_WIDTH: 120,
    NODE_HEIGHT: 90
  },
  SPACIOUS: { 
    HORIZONTAL_SPACING: 280, 
    VERTICAL_SPACING: 160, 
    SWIMLANE_SPACING: 140,
    NODE_WIDTH: 140,
    NODE_HEIGHT: 100
  },
  AI_OPTIMIZED: { 
    HORIZONTAL_SPACING: 250, 
    VERTICAL_SPACING: 140, 
    SWIMLANE_SPACING: 120,
    NODE_WIDTH: 160,
    NODE_HEIGHT: 110
  }
};

const NODE_TYPE_CLASSIFICATIONS = {
  TRIGGERS: ['manualTrigger', 'webhook', 'cron', 'schedule', 'interval'],
  PROCESSING: ['function', 'code', 'httpRequest', 'set', 'itemLists'],
  CONTROL_FLOW: ['if', 'switch', 'merge', 'splitInBatches'],
  AI_LANGCHAIN: ['lmChat', 'memory', 'agent', 'vectorStore', 'embeddings'],
  COMMUNICATION: ['slack', 'telegram', 'email', 'discord', 'whatsApp'],
  STORAGE: ['googleSheets', 'microsoftExcel', 'googleDrive', 'awsS3', 'dropbox']
};

// Sistema de tracking de métricas y rendimiento
class LayoutTracker {
  static layouts = [];
  static stats = {
    totalLayouts: 0,
    avgProcessingTime: 0,
    avgOptimizationScore: 0,
    nodesClustered: 0,
    swimlanesCreated: 0
  };
  
  static recordLayout(result) {
    this.layouts.push({
      timestamp: new Date().toISOString(),
      processingTime: result.processingTime,
      optimizationScore: result.optimizationScore,
      nodeCount: result.nodeCount,
      swimlaneCount: result.swimlaneCount,
      crossingReduction: result.crossingReduction
    });
    
    this.stats.totalLayouts++;
    this.stats.avgProcessingTime = this.layouts.reduce((acc, l) => acc + l.processingTime, 0) / this.layouts.length;
    this.stats.avgOptimizationScore = this.layouts.reduce((acc, l) => acc + l.optimizationScore, 0) / this.layouts.length;
    this.stats.nodesClustered += result.nodeCount;
    this.stats.swimlanesCreated += result.swimlaneCount;
  }
  
  static getStats() {
    return {
      ...this.stats,
      recentLayouts: this.layouts.slice(-5)
    };
  }
}

// CLASE PRINCIPAL DEL OPTIMIZADOR DE LAYOUT V3.0
export class LayoutOptimizer {
  constructor(options = {}) {
    this.version = '3.0.0';
    this.options = {
      debugMode: options.debugMode || false,
      enableAIOptimization: options.enableAIOptimization !== false,
      enablePerformanceTracking: options.enablePerformanceTracking !== false,
      layoutStyle: options.layoutStyle || 'STANDARD',
      strictClustering: options.strictClustering || false,
      ...options
    };
    
    // Métricas avanzadas
    this.metrics = {
      totalNodes: 0,
      totalClusters: 0,
      swimlanesCreated: 0,
      processingTime: 0,
      crossingsBefore: 0,
      crossingsAfter: 0,
      optimizationScore: 0,
      virtualNodesCreated: 0
    };
    
    // Cache para optimizaciones
    this.layoutCache = new Map();
    this.clusterAnalysisCache = new Map();
    
    console.log('🎯 LayoutOptimizer V3.0 inicializado');
  }

  /**
   * Método principal de optimización de layout
   */
  async optimizeLayout(workflow, clusterManifest = null, options = {}) {
    console.log('🎯 Iniciando optimización de layout V3.0...');
    
    const startTime = Date.now();
    const layoutId = `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Validación inicial
      if (!workflow?.nodes || workflow.nodes.length === 0) {
        console.warn('⚠️ Workflow vacío, no hay nodos para posicionar');
        return this.createEmptyLayoutResult(workflow, layoutId);
      }

      this.metrics.totalNodes = workflow.nodes.length;
      
      // Generar clústers automáticamente si no se proporcionan
      if (!clusterManifest) {
        console.log('🔄 Generando clústers automáticamente...');
        clusterManifest = await this.generateAutomaticClusters(workflow);
      }
      
      this.metrics.totalClusters = Object.keys(clusterManifest.definitions || {}).length;
      
      // Verificar cache
      const cacheKey = this.generateCacheKey(workflow, clusterManifest);
      if (this.layoutCache.has(cacheKey) && !options.skipCache) {
        console.log('📋 Usando layout cacheado');
        return this.layoutCache.get(cacheKey);
      }

      // Optimización del orden de swimlanes
      const optimizedClusterOrder = this.optimizeSwimlanesOrder(clusterManifest, workflow.connections);
      console.log(`🔄 Procesando ${optimizedClusterOrder.length} swimlanes optimizados`);

      // Configuración dinámica
      const baseConfig = this.getLayoutConfig();
      let currentYOffset = baseConfig.VERTICAL_SPACING;

      // Procesar cada swimlane
      for (const { name: clusterName, nodes: clusterNodes } of optimizedClusterOrder) {
        if (this.options.debugMode) {
          console.log(`\n--- Posicionando swimlane [${clusterName}] (${clusterNodes.length} nodos) ---`);
        }

        // Crear sub-workflow para este clúster
        const subWorkflow = this.createSubWorkflow(clusterNodes, workflow.connections);
        
        // Configuración dinámica basada en densidad
        const clusterConfig = this.getDynamicConfigForCluster(subWorkflow.nodes.length, baseConfig);
        
        // Análisis del grafo y ordenamiento topológico
        const { graph, roots } = this.analyzeGraph(subWorkflow.nodes, subWorkflow.connections);
        let nodesByLevel = this.calculateTopologicalLevels(graph, roots);
        
        // Insertar nodos virtuales para arcos largos
        const { augmentedNodesByLevel, virtualNodes } = this.insertVirtualNodes(nodesByLevel, graph);
        
        // Minimización de cruces iterativa
        const optimizedLevels = this.minimizeCrossingsIterative(augmentedNodesByLevel, graph, virtualNodes);
        
        // Asignación de coordenadas finales
        this.assignCoordinates(subWorkflow.nodes, optimizedLevels, currentYOffset, clusterConfig);
        
        // Calcular altura del carril
        const laneHeight = this.calculateLaneHeight(optimizedLevels, clusterConfig);
        currentYOffset += laneHeight + clusterConfig.SWIMLANE_SPACING;
        
        this.metrics.swimlanesCreated++;
        
        if (this.options.debugMode) {
          console.log(`   ✅ Swimlane [${clusterName}] completado. Altura: ${laneHeight}px`);
        }
      }

      // Centrado y equilibrio del lienzo
      this.centerAndBalanceLayout(workflow);
      
      // Generar rutas de conexión optimizadas
      this.generateOptimizedConnectionPaths(workflow, clusterManifest);
      
      // Calcular métricas finales
      this.calculateOptimizationMetrics(workflow);
      
      // Completar métricas
      this.metrics.processingTime = Date.now() - startTime;
      
      const result = {
        layoutId,
        workflow,
        success: true,
        metrics: { ...this.metrics },
        metadata: {
          version: this.version,
          timestamp: new Date().toISOString(),
          options: this.options
        }
      };
      
      // Cachear resultado
      this.layoutCache.set(cacheKey, result);
      
      // Registrar en tracker
      LayoutTracker.recordLayout({
        processingTime: this.metrics.processingTime,
        optimizationScore: this.metrics.optimizationScore,
        nodeCount: this.metrics.totalNodes,
        swimlaneCount: this.metrics.swimlanesCreated,
        crossingReduction: ((this.metrics.crossingsBefore - this.metrics.crossingsAfter) / Math.max(this.metrics.crossingsBefore, 1)) * 100
      });
      
      console.log(`\n🎯 Layout V3.0 completado en ${this.metrics.processingTime}ms`);
      console.log(`   📊 Score: ${this.metrics.optimizationScore}/100, Swimlanes: ${this.metrics.swimlanesCreated}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en optimización de layout:', error);
      return {
        layoutId,
        workflow,
        success: false,
        error: error.message,
        metrics: { ...this.metrics }
      };
    }
  }

  /**
   * Optimización del orden de swimlanes para minimizar cruces
   */
  optimizeSwimlanesOrder(clusterManifest, allConnections) {
    if (!clusterManifest?.definitions) {
      return [];
    }

    const clusters = Object.keys(clusterManifest.definitions);
    const clusterNodeMap = new Map();
    
    // Mapear nodos a clústers
    clusters.forEach(clusterName => {
      clusterManifest.definitions[clusterName].forEach(node => {
        clusterNodeMap.set(node.name, clusterName);
      });
    });

    // Construir meta-grafo de clústers
    const metaGraph = new Map();
    clusters.forEach(cluster => {
      metaGraph.set(cluster, { 
        outgoing: new Map(), 
        incoming: new Set(),
        weight: 0
      });
    });

    // Analizar conexiones inter-clúster
    Object.entries(allConnections || {}).forEach(([sourceName, connections]) => {
      const sourceCluster = clusterNodeMap.get(sourceName);
      if (!sourceCluster || !connections.main) return;

      connections.main.flat().forEach(conn => {
        const targetCluster = clusterNodeMap.get(conn.node);
        if (!targetCluster || sourceCluster === targetCluster) return;

        // Incrementar peso de conexión
        const current = metaGraph.get(sourceCluster).outgoing.get(targetCluster) || 0;
        metaGraph.get(sourceCluster).outgoing.set(targetCluster, current + 1);
        metaGraph.get(targetCluster).incoming.add(sourceCluster);
        
        // Incrementar peso total del clúster
        metaGraph.get(sourceCluster).weight += 1;
        metaGraph.get(targetCluster).weight += 1;
      });
    });

    // Ordenamiento topológico con prioridad por peso
    const ordered = [];
    const visited = new Set();
    const inDegree = new Map();
    
    clusters.forEach(cluster => {
      inDegree.set(cluster, metaGraph.get(cluster).incoming.size);
    });

    // Procesar clústers sin dependencias entrantes
    const queue = clusters
      .filter(cluster => inDegree.get(cluster) === 0)
      .sort((a, b) => metaGraph.get(b).weight - metaGraph.get(a).weight);

    while (queue.length > 0) {
      const cluster = queue.shift();
      ordered.push({
        name: cluster,
        nodes: clusterManifest.definitions[cluster]
      });
      visited.add(cluster);

      // Actualizar grados de entrada
      metaGraph.get(cluster).outgoing.forEach((weight, targetCluster) => {
        inDegree.set(targetCluster, inDegree.get(targetCluster) - 1);
        if (inDegree.get(targetCluster) === 0) {
          queue.push(targetCluster);
          queue.sort((a, b) => metaGraph.get(b).weight - metaGraph.get(a).weight);
        }
      });
    }

    // Añadir clústers restantes (ciclos)
    clusters.forEach(cluster => {
      if (!visited.has(cluster)) {
        ordered.push({
          name: cluster,
          nodes: clusterManifest.definitions[cluster]
        });
      }
    });

    return ordered;
  }

  /**
   * Insertar nodos virtuales para arcos largos
   */
  insertVirtualNodes(nodesByLevel, graph) {
    const levelMap = new Map();
    const virtualNodes = new Map();
    let virtualCounter = 0;

    // Mapear nodos a niveles
    nodesByLevel.forEach((level, levelIndex) => {
      level.forEach(nodeName => {
        levelMap.set(nodeName, levelIndex);
      });
    });

    const augmentedLevels = nodesByLevel.map(level => [...level]);
    
    // Detectar y procesar arcos largos
    graph.forEach((nodeData, nodeName) => {
      const nodesToRemove = [];
      const nodesToAdd = [];
      
      nodeData.children.forEach(childName => {
        const sourceLevel = levelMap.get(nodeName);
        const targetLevel = levelMap.get(childName);
        
        if (targetLevel - sourceLevel > 1) {
          const virtualNodesList = [];
          
          // Crear nodos virtuales para cada nivel intermedio
          for (let level = sourceLevel + 1; level < targetLevel; level++) {
            const virtualNodeName = `__virtual_${virtualCounter++}`;
            virtualNodesList.push(virtualNodeName);
            
            augmentedLevels[level].push(virtualNodeName);
            
            virtualNodes.set(virtualNodeName, {
              source: nodeName,
              target: childName,
              level: level,
              isVirtual: true
            });
          }
          
          if (virtualNodesList.length > 0) {
            nodesToRemove.push(childName);
            
            // Crear cadena de conexiones virtuales
            let prevNode = nodeName;
            virtualNodesList.forEach(virtualNode => {
              graph.set(virtualNode, {
                node: { name: virtualNode, type: 'virtual' },
                parents: new Set([prevNode]),
                children: new Set()
              });
              
              nodesToAdd.push({ from: prevNode, to: virtualNode });
              prevNode = virtualNode;
            });
            
            nodesToAdd.push({ from: prevNode, to: childName });
            this.metrics.virtualNodesCreated += virtualNodesList.length;
          }
        }
      });
      
      // Aplicar cambios
      nodesToRemove.forEach(child => {
        nodeData.children.delete(child);
        if (graph.has(child)) {
          graph.get(child).parents.delete(nodeName);
        }
      });
      
      nodesToAdd.forEach(({ from, to }) => {
        if (graph.has(from)) {
          graph.get(from).children.add(to);
        }
        if (graph.has(to)) {
          graph.get(to).parents.add(from);
        }
      });
    });

    return { augmentedNodesByLevel: augmentedLevels, virtualNodes };
  }

  /**
   * Minimización iterativa de cruces (Algoritmo Sugiyama mejorado)
   */
  minimizeCrossingsIterative(nodesByLevel, graph, virtualNodes, maxIterations = 5) {
    let currentLevels = nodesByLevel.map(level => [...level]);
    let bestCrossings = this.countCrossings(currentLevels, graph);
    let bestConfiguration = currentLevels.map(level => [...level]);
    
    this.metrics.crossingsBefore = bestCrossings;
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Barrido hacia abajo
      for (let i = 1; i < currentLevels.length; i++) {
        currentLevels[i] = this.optimizeLevelOrder(currentLevels[i], currentLevels[i - 1], graph, 'down');
      }
      
      // Barrido hacia arriba
      for (let i = currentLevels.length - 2; i >= 0; i--) {
        currentLevels[i] = this.optimizeLevelOrder(currentLevels[i], currentLevels[i + 1], graph, 'up');
      }
      
      const currentCrossings = this.countCrossings(currentLevels, graph);
      
      if (currentCrossings < bestCrossings) {
        bestCrossings = currentCrossings;
        bestConfiguration = currentLevels.map(level => [...level]);
      }
      
      if (this.options.debugMode) {
        console.log(`   🔄 Iteración ${iteration + 1}: ${currentCrossings} cruces`);
      }
    }
    
    this.metrics.crossingsAfter = bestCrossings;
    return bestConfiguration;
  }

  /**
   * Contar cruces entre niveles adyacentes
   */
  countCrossings(nodesByLevel, graph) {
    let totalCrossings = 0;
    
    for (let i = 0; i < nodesByLevel.length - 1; i++) {
      const upperLevel = nodesByLevel[i];
      const lowerLevel = nodesByLevel[i + 1];
      
      const connections = [];
      upperLevel.forEach((node, upperIndex) => {
        if (graph.has(node)) {
          graph.get(node).children.forEach(child => {
            const lowerIndex = lowerLevel.indexOf(child);
            if (lowerIndex !== -1) {
              connections.push([upperIndex, lowerIndex]);
            }
          });
        }
      });
      
      // Contar cruces usando algoritmo de inversiones
      for (let j = 0; j < connections.length; j++) {
        for (let k = j + 1; k < connections.length; k++) {
          if ((connections[j][0] < connections[k][0] && connections[j][1] > connections[k][1]) ||
              (connections[j][0] > connections[k][0] && connections[j][1] < connections[k][1])) {
            totalCrossings++;
          }
        }
      }
    }
    
    return totalCrossings;
  }

  /**
   * Optimizar orden de un nivel específico
   */
  optimizeLevelOrder(level, adjacentLevel, graph, direction) {
    if (level.length <= 1) return level;
    
    // Calcular posiciones promedio de vecinos
    const nodePositions = level.map(node => {
      const neighbors = [];
      
      if (direction === 'down') {
        // Mirar conexiones hacia el nivel inferior
        if (graph.has(node)) {
          graph.get(node).children.forEach(child => {
            const pos = adjacentLevel.indexOf(child);
            if (pos !== -1) neighbors.push(pos);
          });
        }
      } else {
        // Mirar conexiones hacia el nivel superior
        if (graph.has(node)) {
          graph.get(node).parents.forEach(parent => {
            const pos = adjacentLevel.indexOf(parent);
            if (pos !== -1) neighbors.push(pos);
          });
        }
      }
      
      const avgPosition = neighbors.length > 0 ? 
        neighbors.reduce((sum, pos) => sum + pos, 0) / neighbors.length : 
        level.indexOf(node);
      
      return { node, avgPosition, originalPosition: level.indexOf(node) };
    });
    
    // Ordenar por posición promedio de vecinos
    nodePositions.sort((a, b) => {
      if (Math.abs(a.avgPosition - b.avgPosition) < 0.1) {
        return a.originalPosition - b.originalPosition;
      }
      return a.avgPosition - b.avgPosition;
    });
    
    return nodePositions.map(item => item.node);
  }

  /**
   * Asignar coordenadas finales a los nodos
   */
  assignCoordinates(nodes, optimizedLevels, yOffset, config) {
    const nodeMap = new Map(nodes.map(n => [n.name, n]));
    
    optimizedLevels.forEach((level, levelIndex) => {
      const levelY = yOffset + (levelIndex * config.VERTICAL_SPACING);
      const levelWidth = level.length * config.HORIZONTAL_SPACING;
      const startX = -levelWidth / 2;
      
      level.forEach((nodeName, nodeIndex) => {
        if (nodeMap.has(nodeName)) {
          const node = nodeMap.get(nodeName);
          node.position = [
            startX + (nodeIndex * config.HORIZONTAL_SPACING),
            levelY
          ];
        }
      });
    });
  }

  /**
   * Centrar y equilibrar el layout del workflow
   */
  centerAndBalanceLayout(workflow) {
    if (!workflow.nodes || workflow.nodes.length === 0) return;
    
    // Calcular límites actuales
    const positions = workflow.nodes.map(n => n.position || [0, 0]);
    const minX = Math.min(...positions.map(p => p[0]));
    const maxX = Math.max(...positions.map(p => p[0]));
    const minY = Math.min(...positions.map(p => p[1]));
    const maxY = Math.max(...positions.map(p => p[1]));
    
    // Calcular offsets de centrado
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const offsetX = -centerX;
    const offsetY = Math.max(100 - minY, 0); // Asegurar margen superior
    
    // Aplicar centrado
    workflow.nodes.forEach(node => {
      if (node.position) {
        node.position[0] += offsetX;
        node.position[1] += offsetY;
      }
    });
    
    if (this.options.debugMode) {
      console.log(`   🎯 Layout centrado. Offset: [${offsetX}, ${offsetY}]`);
    }
  }

  /**
   * Generar clústers automáticamente si no se proporcionan
   */
  async generateAutomaticClusters(workflow) {
    console.log('🔄 Generando clústers automáticos por tipo de nodo...');
    
    const clusters = {
      definitions: {},
      metadata: {
        generated: true,
        method: 'automatic_by_type',
        timestamp: new Date().toISOString()
      }
    };
    
    // Clasificar nodos por tipo
    const nodesByType = new Map();
    
    workflow.nodes.forEach(node => {
      const nodeType = this.classifyNodeType(node.type);
      if (!nodesByType.has(nodeType)) {
        nodesByType.set(nodeType, []);
      }
      nodesByType.get(nodeType).push(node);
    });
    
    // Crear clústers por tipo
    nodesByType.forEach((nodes, type) => {
      clusters.definitions[type] = nodes;
    });
    
    console.log(`   📊 Generados ${nodesByType.size} clústers automáticos`);
    return clusters;
  }

  /**
   * Clasificar tipo de nodo para clustering automático
   */
  classifyNodeType(nodeType) {
    const type = nodeType.toLowerCase();
    
    for (const [category, types] of Object.entries(NODE_TYPE_CLASSIFICATIONS)) {
      if (types.some(t => type.includes(t.toLowerCase()))) {
        return category.toLowerCase();
      }
    }
    
    return 'miscellaneous';
  }

  /**
   * Obtener configuración de layout basada en opciones
   */
  getLayoutConfig() {
    const configName = this.options.layoutStyle || 'STANDARD';
    
    if (this.options.enableAIOptimization && this.hasAINodes) {
      return { ...LAYOUT_CONFIGS.AI_OPTIMIZED };
    }
    
    return { ...LAYOUT_CONFIGS[configName] } || { ...LAYOUT_CONFIGS.STANDARD };
  }

  /**
   * Configuración dinámica por densidad de clúster
   */
  getDynamicConfigForCluster(nodeCount, baseConfig) {
    const config = { ...baseConfig };
    
    if (nodeCount > 15) {
      // Clúster denso - más espaciado
      config.HORIZONTAL_SPACING *= 1.2;
      config.VERTICAL_SPACING *= 1.15;
    } else if (nodeCount < 5) {
      // Clúster pequeño - menos espaciado
      config.HORIZONTAL_SPACING *= 0.8;
      config.VERTICAL_SPACING *= 0.9;
    }
    
    return config;
  }

  /**
   * Crear sub-workflow para un clúster
   */
  createSubWorkflow(clusterNodes, allConnections) {
    const nodeNames = new Set(clusterNodes.map(n => n.name));
    const subConnections = {};
    
    // Filtrar conexiones internas del clúster
    Object.entries(allConnections || {}).forEach(([source, connections]) => {
      if (!nodeNames.has(source)) return;
      
      const filteredConnections = { main: [] };
      
      if (connections.main) {
        connections.main.forEach(branch => {
          const filteredBranch = branch.filter(conn => nodeNames.has(conn.node));
          if (filteredBranch.length > 0) {
            filteredConnections.main.push(filteredBranch);
          }
        });
      }
      
      if (filteredConnections.main.length > 0) {
        subConnections[source] = filteredConnections;
      }
    });
    
    return {
      nodes: clusterNodes,
      connections: subConnections
    };
  }

  /**
   * Analizar grafo de dependencias
   */
  analyzeGraph(nodes, connections) {
    const graph = new Map();
    const roots = new Set();
    
    // Inicializar nodos en el grafo
    nodes.forEach(node => {
      graph.set(node.name, {
        node,
        parents: new Set(),
        children: new Set()
      });
      roots.add(node.name);
    });
    
    // Procesar conexiones
    Object.entries(connections || {}).forEach(([source, connectionData]) => {
      if (!connectionData.main) return;
      
      connectionData.main.flat().forEach(conn => {
        if (graph.has(source) && graph.has(conn.node)) {
          graph.get(source).children.add(conn.node);
          graph.get(conn.node).parents.add(source);
          roots.delete(conn.node);
        }
      });
    });
    
    return { graph, roots: Array.from(roots) };
  }

  /**
   * Calcular niveles topológicos
   */
  calculateTopologicalLevels(graph, roots) {
    const levels = [];
    const visited = new Set();
    const queue = [...roots];
    
    while (queue.length > 0) {
      const currentLevel = [];
      const nextQueue = [];
      
      queue.forEach(nodeName => {
        if (visited.has(nodeName)) return;
        
        visited.add(nodeName);
        currentLevel.push(nodeName);
        
        // Añadir hijos al siguiente nivel
        if (graph.has(nodeName)) {
          graph.get(nodeName).children.forEach(child => {
            if (!visited.has(child)) {
              // Verificar si todos los padres han sido visitados
              const allParentsVisited = Array.from(graph.get(child).parents)
                .every(parent => visited.has(parent));
              
              if (allParentsVisited && !nextQueue.includes(child)) {
                nextQueue.push(child);
              }
            }
          });
        }
      });
      
      if (currentLevel.length > 0) {
        levels.push(currentLevel);
      }
      
      queue.length = 0;
      queue.push(...nextQueue);
    }
    
    return levels;
  }

  /**
   * Calcular altura del carril
   */
  calculateLaneHeight(levels, config) {
    return levels.length * config.VERTICAL_SPACING + config.NODE_HEIGHT;
  }

  /**
   * Generar rutas optimizadas para conexiones
   */
  generateOptimizedConnectionPaths(workflow, clusterManifest) {
    // Esta funcionalidad se puede expandir para generar
    // rutas de conexión optimizadas entre swimlanes
    if (this.options.debugMode) {
      console.log('   🔗 Generando rutas de conexión optimizadas...');
    }
  }

  /**
   * Calcular métricas de optimización
   */
  calculateOptimizationMetrics(workflow) {
    let score = 100;
    
    // Penalizar cruces de conexiones
    const crossingPenalty = this.metrics.crossingsAfter * 2;
    score -= crossingPenalty;
    
    // Bonificar reducción de cruces
    if (this.metrics.crossingsBefore > 0) {
      const reductionRatio = (this.metrics.crossingsBefore - this.metrics.crossingsAfter) / this.metrics.crossingsBefore;
      score += reductionRatio * 20;
    }
    
    // Bonificar uso de swimlanes
    if (this.metrics.swimlanesCreated > 1) {
      score += Math.min(this.metrics.swimlanesCreated * 5, 20);
    }
    
    // Bonificar nodos virtuales apropiados
    if (this.metrics.virtualNodesCreated > 0) {
      score += Math.min(this.metrics.virtualNodesCreated * 2, 10);
    }
    
    this.metrics.optimizationScore = Math.max(0, Math.min(100, score));
  }

  /**
   * Crear resultado para workflow vacío
   */
  createEmptyLayoutResult(workflow, layoutId) {
    return {
      layoutId,
      workflow,
      success: true,
      metrics: { ...this.metrics },
      metadata: {
        version: this.version,
        timestamp: new Date().toISOString(),
        empty: true
      }
    };
  }

  /**
   * Generar clave de cache
   */
  generateCacheKey(workflow, clusterManifest) {
    const workflowHash = {
      nodeCount: workflow.nodes?.length || 0,
      nodeTypes: workflow.nodes?.map(n => n.type).sort().join(',') || '',
      connectionCount: Object.keys(workflow.connections || {}).length
    };
    
    const clusterHash = {
      clusterCount: Object.keys(clusterManifest?.definitions || {}).length,
      clusterNames: Object.keys(clusterManifest?.definitions || {}).sort().join(',')
    };
    
    return btoa(JSON.stringify({ workflow: workflowHash, cluster: clusterHash }));
  }

  /**
   * Obtener estadísticas del optimizador
   */
  getStats() {
    return {
      version: this.version,
      cacheSize: this.layoutCache.size,
      currentMetrics: { ...this.metrics },
      globalStats: LayoutTracker.getStats()
    };
  }

  /**
   * Limpiar cache y recursos
   */
  cleanup() {
    this.layoutCache.clear();
    this.clusterAnalysisCache.clear();
    console.log('🧹 LayoutOptimizer limpiado');
  }
}

// Exportaciones adicionales
export { LayoutTracker, LAYOUT_CONFIGS, NODE_TYPE_CLASSIFICATIONS };

// Función de conveniencia para uso rápido
export async function optimizeWorkflowLayout(workflow, clusterManifest = null, options = {}) {
  const optimizer = new LayoutOptimizer(options);
  return await optimizer.optimizeLayout(workflow, clusterManifest, options);
}

console.log('📦 Layout Optimizer V3.0 cargado y listo para uso');
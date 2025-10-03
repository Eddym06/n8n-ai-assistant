// 🎯 INTELLIGENT POSITIONING AGENT V2.0 - EL DISEÑADOR VISUAL
// Sistema de posicionamiento topológico con swimlanes y arcos visuales

export default class IntelligentPositioningAgentV2 {
  constructor() {
    this.version = '2.0.0';
    this.debugMode = true;
    this.metrics = {
      processedWorkflows: 0,
      averageProcessingTime: 0,
      qualityScores: []
    };
    
    console.log('🎯 IntelligentPositioningAgent v2.0 inicializado');
  }

  /**
   * MÉTODO PRINCIPAL - Orquesta todo el proceso de posicionamiento topológico
   */
  optimizeLayout(workflow, topologyManifest = null) {
    const startTime = Date.now();
    console.log('🎯 IPA v2.0: Iniciando layout topológico y estético...');
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      console.log('⚠️ Workflow vacío, no hay nodos para posicionar');
      return workflow;
    }

    // Usar manifiesto provisto o generar análisis propio
    const manifest = topologyManifest || this.analyzeWorkflowTopology(workflow);
    
    // Obtener configuración dinámica basada en complejidad
    const config = this.getDynamicConfig(workflow.nodes.length, manifest.complexity);
    
    console.log(`📊 Configuración aplicada (${manifest.complexity}):`);
    console.log(`   🔸 Espaciado horizontal: ${config.HORIZONTAL_SPACING}px`);
    console.log(`   🔸 Espaciado vertical: ${config.VERTICAL_SPACING}px`);
    console.log(`   🔸 Separación swimlanes: ${config.SWIMLANE_SPACING}px`);

    let currentYOffset = config.Y_OFFSET;
    let processedNodes = 0;

    // Procesar cada sub-flujo en su propio carril (swimlane)
    for (const [rootName, subflowData] of manifest.subWorkflows.entries()) {
      console.log(`--- Posicionando carril para: ${rootName} (${subflowData.nodeCount} nodos) ---`);
      
      // Crear workflow temporal para análisis independiente
      const tempWorkflow = this.createTempWorkflow(subflowData.nodes, workflow.connections);
      
      // Analizar grafo del sub-flujo
      const { graph, roots } = this.analyzeGraph(tempWorkflow.nodes, tempWorkflow.connections);
      
      // Calcular niveles topológicos
      const nodesByLevel = this.calculateLevels(graph, roots);
      
      // Asignar coordenadas con arcos visuales
      this.assignCoordinates(
        subflowData.nodes, 
        nodesByLevel, 
        currentYOffset, 
        config,
        subflowData.modulePrefix
      );

      // Calcular altura del carril y actualizar offset
      const laneHeight = this.calculateLaneHeight(nodesByLevel, config);
      currentYOffset += laneHeight + config.SWIMLANE_SPACING;
      processedNodes += subflowData.nodeCount;
      
      console.log(`   ✅ Carril ${subflowData.modulePrefix}: ${subflowData.nodeCount} nodos, altura ${laneHeight}px`);
    }

    // Métricas finales
    const processingTime = Date.now() - startTime;
    const qualityScore = this.calculateLayoutQuality(workflow, manifest);
    
    this.updateMetrics(processingTime, qualityScore);
    
    console.log(`🎯 IPA v2.0 Completado:`);
    console.log(`   📊 ${processedNodes} nodos posicionados en ${manifest.subWorkflows.size} carriles`);
    console.log(`   ⭐ Score de calidad visual: ${qualityScore}/100`);
    console.log(`   ⏱️ Tiempo de procesamiento: ${processingTime}ms`);
    console.log(`   🎨 Canvas estimado: ${this.estimateCanvasSize(workflow)}px`);

    return workflow;
  }

  /**
   * Adapta el espaciado según el tamaño y complejidad del workflow
   */
  getDynamicConfig(nodeCount, complexity) {
    const baseConfigs = {
      massive: { 
        HORIZONTAL_SPACING: 350, 
        VERTICAL_SPACING: 160, 
        SWIMLANE_SPACING: 600, 
        ARC_STRENGTH: 60,
        COMPACT_MODE: true 
      },
      large: { 
        HORIZONTAL_SPACING: 380, 
        VERTICAL_SPACING: 180, 
        SWIMLANE_SPACING: 700, 
        ARC_STRENGTH: 50,
        COMPACT_MODE: false 
      },
      medium: { 
        HORIZONTAL_SPACING: 420, 
        VERTICAL_SPACING: 200, 
        SWIMLANE_SPACING: 800, 
        ARC_STRENGTH: 40,
        COMPACT_MODE: false 
      },
      small: { 
        HORIZONTAL_SPACING: 450, 
        VERTICAL_SPACING: 250, 
        SWIMLANE_SPACING: 500, 
        ARC_STRENGTH: 30,
        COMPACT_MODE: false 
      }
    };

    const config = baseConfigs[complexity] || baseConfigs.medium;
    
    // Ajustes adicionales por número de nodos
    if (nodeCount > 200) {
      config.HORIZONTAL_SPACING -= 30;
      config.VERTICAL_SPACING -= 20;
      config.COMPACT_MODE = true;
    }

    return {
      ...config,
      X_OFFSET: 100,
      Y_OFFSET: 100,
      NODE_WIDTH: 240,
      NODE_HEIGHT: 100
    };
  }

  /**
   * Asigna coordenadas [x, y] con distribución en arco para ramas paralelas
   */
  assignCoordinates(nodesInGroup, nodesByLevel, yOffset, config, modulePrefix) {
    const nodeMap = new Map(nodesInGroup.map(node => [node.name, node]));
    
    // Colores por módulo para debug visual
    const moduleColors = {
      'HR': '🟦', 'SALES': '🟩', 'FIN': '🟨', 
      'OPS': '🟧', 'SUP': '🟪', 'INT': '⬜', 'DEFAULT': '⬜'
    };
    
    console.log(`   ${moduleColors[modulePrefix] || '⬜'} Módulo ${modulePrefix}: ${nodesByLevel.length} niveles`);

    nodesByLevel.forEach((levelNodes, levelIndex) => {
      const x_base = config.X_OFFSET + (levelIndex * config.HORIZONTAL_SPACING);
      const numNodes = levelNodes.length;
      
      if (numNodes === 0) return;

      // Cálculo de distribución vertical
      let nodePositions = this.calculateVerticalDistribution(
        numNodes, 
        yOffset, 
        config.VERTICAL_SPACING,
        config.COMPACT_MODE
      );

      levelNodes.forEach((nodeName, nodeIndex) => {
        const node = nodeMap.get(nodeName);
        if (!node) return;

        let x = x_base;
        
        // Aplicar efecto de arco para múltiples nodos
        if (numNodes > 2 && !config.COMPACT_MODE) {
          const arcOffset = this.calculateArcOffset(
            nodeIndex, 
            numNodes, 
            config.ARC_STRENGTH
          );
          x += arcOffset;
        }

        // Aplicar micro-ajustes para evitar colisiones
        const finalPosition = this.applyCollisionAvoidance(
          x, 
          nodePositions[nodeIndex], 
          node, 
          nodesInGroup,
          config
        );

        node.position = [Math.round(finalPosition.x), Math.round(finalPosition.y)];
        
        if (this.debugMode && levelIndex === 0) {
          console.log(`     🎯 ${node.name}: [${node.position[0]}, ${node.position[1]}]`);
        }
      });
    });
  }

  /**
   * Calcula distribución vertical inteligente
   */
  calculateVerticalDistribution(numNodes, baseY, spacing, compactMode) {
    if (numNodes === 1) return [baseY];

    const positions = [];
    
    if (compactMode && numNodes > 8) {
      // Distribución compacta para workflows masivos
      const compactSpacing = spacing * 0.8;
      const totalHeight = (numNodes - 1) * compactSpacing;
      const startY = baseY - totalHeight / 2;
      
      for (let i = 0; i < numNodes; i++) {
        positions.push(startY + (i * compactSpacing));
      }
    } else {
      // Distribución normal con espaciado estético
      const totalHeight = (numNodes - 1) * spacing;
      const startY = baseY - totalHeight / 2;
      
      for (let i = 0; i < numNodes; i++) {
        positions.push(startY + (i * spacing));
      }
    }

    return positions;
  }

  /**
   * Calcula offset de arco para efectos visuales curvos
   */
  calculateArcOffset(nodeIndex, totalNodes, arcStrength) {
    if (totalNodes <= 2) return 0;

    const midIndex = (totalNodes - 1) / 2;
    const distanceFromMid = nodeIndex - midIndex;
    
    // Función coseno para curva suave
    const normalizedDistance = distanceFromMid / (totalNodes / 2);
    const arcFactor = Math.cos(normalizedDistance * Math.PI / 2);
    
    return arcStrength * (1 - arcFactor);
  }

  /**
   * Aplica micro-ajustes para evitar colisiones de nodos
   */
  applyCollisionAvoidance(x, y, currentNode, allNodes, config) {
    const buffer = 10; // Espacio adicional de seguridad
    const minDistance = config.NODE_WIDTH + buffer;
    
    // Verificar colisiones con otros nodos ya posicionados
    for (const otherNode of allNodes) {
      if (otherNode === currentNode || !otherNode.position) continue;
      
      const [otherX, otherY] = otherNode.position;
      const distance = Math.sqrt(Math.pow(x - otherX, 2) + Math.pow(y - otherY, 2));
      
      if (distance < minDistance) {
        // Ajustar posición para evitar colisión
        x += buffer;
      }
    }

    return { x, y };
  }

  /**
   * Calcula la altura total de un carril (swimlane)
   */
  calculateLaneHeight(nodesByLevel, config) {
    if (nodesByLevel.length === 0) return config.VERTICAL_SPACING;

    const maxNodesInLevel = Math.max(...nodesByLevel.map(level => level.length));
    const estimatedHeight = maxNodesInLevel * config.VERTICAL_SPACING;
    
    return Math.max(estimatedHeight, config.VERTICAL_SPACING * 2);
  }

  /**
   * Calcula score de calidad del layout
   */
  calculateLayoutQuality(workflow, manifest) {
    let score = 100;
    
    // Evaluar distribución de nodos
    const positions = workflow.nodes.map(n => n.position);
    const avgX = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
    const avgY = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;
    
    // Penalizar por distribución desigual
    const xVariance = positions.reduce((sum, pos) => sum + Math.pow(pos[0] - avgX, 2), 0) / positions.length;
    const yVariance = positions.reduce((sum, pos) => sum + Math.pow(pos[1] - avgY, 2), 0) / positions.length;
    
    if (xVariance < 1000) score -= 10; // Muy agrupado horizontalmente
    if (yVariance < 1000) score -= 10; // Muy agrupado verticalmente
    
    // Bonificar por organización modular
    if (manifest.subWorkflows.size > 1) score += 15;
    
    // Bonificar por distribución equilibrada
    const avgNodesPerModule = workflow.nodes.length / manifest.subWorkflows.size;
    if (avgNodesPerModule > 2 && avgNodesPerModule < 25) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Estima el tamaño total del canvas
   */
  estimateCanvasSize(workflow) {
    const positions = workflow.nodes.map(n => n.position);
    const maxX = Math.max(...positions.map(pos => pos[0])) + 300;
    const maxY = Math.max(...positions.map(pos => pos[1])) + 200;
    const minX = Math.min(...positions.map(pos => pos[0])) - 100;
    const minY = Math.min(...positions.map(pos => pos[1])) - 100;
    
    return `${maxX - minX} × ${maxY - minY}`;
  }

  /**
   * Actualiza métricas del agente
   */
  updateMetrics(processingTime, qualityScore) {
    this.metrics.processedWorkflows++;
    this.metrics.qualityScores.push(qualityScore);
    
    // Calcular promedio de tiempo de procesamiento
    const totalTime = this.metrics.averageProcessingTime * (this.metrics.processedWorkflows - 1) + processingTime;
    this.metrics.averageProcessingTime = totalTime / this.metrics.processedWorkflows;
  }

  /**
   * Obtiene estadísticas del agente
   */
  getMetrics() {
    const avgQuality = this.metrics.qualityScores.length > 0 
      ? this.metrics.qualityScores.reduce((a, b) => a + b, 0) / this.metrics.qualityScores.length 
      : 0;

    return {
      version: this.version,
      processedWorkflows: this.metrics.processedWorkflows,
      averageProcessingTime: Math.round(this.metrics.averageProcessingTime),
      averageQualityScore: Math.round(avgQuality),
      lastQualityScore: this.metrics.qualityScores[this.metrics.qualityScores.length - 1] || 0
    };
  }

  // ================================
  // MÉTODOS DE UTILIDAD COMPARTIDOS
  // ================================

  /**
   * Crea un workflow temporal para análisis independiente
   */
  createTempWorkflow(nodes, allConnections) {
    const nodeNames = new Set(nodes.map(n => n.name));
    
    const filteredConnections = {};
    Object.keys(allConnections).forEach(sourceName => {
      if (nodeNames.has(sourceName)) {
        const sourceConnections = allConnections[sourceName];
        const filteredSourceConnections = {};
        
        if (sourceConnections.main) {
          filteredSourceConnections.main = sourceConnections.main.map(outputArray =>
            outputArray.filter(conn => nodeNames.has(conn.node))
          ).filter(outputArray => outputArray.length > 0);
        }
        
        if (sourceConnections.else) {
          filteredSourceConnections.else = sourceConnections.else.filter(conn => 
            nodeNames.has(conn.node)
          );
        }
        
        if (filteredSourceConnections.main?.length > 0 || filteredSourceConnections.else?.length > 0) {
          filteredConnections[sourceName] = filteredSourceConnections;
        }
      }
    });

    return { nodes: nodes, connections: filteredConnections };
  }

  /**
   * Analiza grafo de dependencias
   */
  analyzeGraph(nodes, connections) {
    const graph = new Map();
    
    // Inicializar nodos en el grafo
    nodes.forEach(node => {
      graph.set(node.name, {
        node: node,
        parents: new Set(),
        children: new Set()
      });
    });

    // Mapear conexiones
    Object.keys(connections).forEach(sourceName => {
      const sourceConnections = connections[sourceName];
      
      if (sourceConnections.main) {
        sourceConnections.main.flat().forEach(conn => {
          if (graph.has(conn.node)) {
            graph.get(sourceName).children.add(conn.node);
            graph.get(conn.node).parents.add(sourceName);
          }
        });
      }
      
      if (sourceConnections.else) {
        sourceConnections.else.forEach(conn => {
          if (graph.has(conn.node)) {
            graph.get(sourceName).children.add(conn.node);
            graph.get(conn.node).parents.add(sourceName);
          }
        });
      }
    });

    // Identificar nodos raíz
    const roots = nodes.filter(node => 
      graph.get(node.name).parents.size === 0
    ).map(node => node.name);

    return { graph, roots };
  }

  /**
   * Calcula niveles topológicos usando algoritmo de Kahn
   */
  calculateLevels(graph, roots) {
    const levels = [];
    const visited = new Set();
    const inDegree = new Map();
    
    // Calcular grado de entrada
    graph.forEach((nodeData, nodeName) => {
      inDegree.set(nodeName, nodeData.parents.size);
    });

    // Cola con nodos de grado 0 (raíces)
    let queue = [...roots];
    
    while (queue.length > 0) {
      const currentLevel = [...queue];
      queue = [];
      
      levels.push(currentLevel);
      
      currentLevel.forEach(nodeName => {
        visited.add(nodeName);
        
        // Reducir grado de entrada de hijos
        graph.get(nodeName).children.forEach(childName => {
          const newInDegree = inDegree.get(childName) - 1;
          inDegree.set(childName, newInDegree);
          
          if (newInDegree === 0 && !visited.has(childName)) {
            queue.push(childName);
          }
        });
      });
    }
    
    // Verificar nodos no visitados (posibles ciclos)
    const unvisited = [];
    graph.forEach((nodeData, nodeName) => {
      if (!visited.has(nodeName)) {
        unvisited.push(nodeName);
      }
    });
    
    if (unvisited.length > 0) {
      console.warn(`⚠️ Nodos con posibles ciclos detectados: ${unvisited.join(', ')}`);
      levels.push(unvisited); // Agregar al final
    }

    return levels;
  }

  /**
   * ANÁLISIS TOPOLÓGICO SIMPLIFICADO (para uso independiente)
   */
  analyzeWorkflowTopology(workflow) {
    const subWorkflows = new Map();
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return { 
        subWorkflows, 
        complexity: 'empty',
        totalNodes: 0,
        totalSubflows: 0
      };
    }

    // Construcción del grafo
    const graph = new Map(workflow.nodes.map(node => [
      node.name, 
      { node, children: new Set(), parents: new Set() }
    ]));
    
    const nodeNames = new Set(workflow.nodes.map(n => n.name));

    // Mapear conexiones
    if (workflow.connections) {
      for (const sourceName in workflow.connections) {
        if (!nodeNames.has(sourceName)) continue;
        const connections = (workflow.connections[sourceName].main || []).flat();
        connections.forEach(conn => {
          if (nodeNames.has(conn.node)) {
            graph.get(sourceName).children.add(conn.node);
            graph.get(conn.node).parents.add(sourceName);
          }
        });
      }
    }

    // Identificar raíces
    const rootNodes = workflow.nodes.filter(node => 
      graph.get(node.name).parents.size === 0
    );

    // Construir sub-flujos
    rootNodes.forEach(rootNode => {
      const subgraphNodes = new Set();
      const queue = [rootNode.name];
      const visited = new Set([rootNode.name]);
      
      while (queue.length > 0) {
        const currentName = queue.shift();
        subgraphNodes.add(graph.get(currentName).node);
        
        graph.get(currentName).children.forEach(childName => {
          if (!visited.has(childName)) {
            visited.add(childName);
            queue.push(childName);
          }
        });
      }
      
      const modulePrefix = rootNode.name.match(/^([A-Z]+)_/)?.[1] || 'DEFAULT';
      
      subWorkflows.set(rootNode.name, {
        nodes: Array.from(subgraphNodes),
        rootNode: rootNode,
        modulePrefix: modulePrefix,
        pattern: this.analyzePattern(Array.from(subgraphNodes)),
        nodeCount: subgraphNodes.size
      });
    });

    // Determinar complejidad
    const complexity = workflow.nodes.length > 100 ? 'massive' : 
                      workflow.nodes.length > 50 ? 'large' : 
                      workflow.nodes.length > 10 ? 'medium' : 'small';

    return { 
      subWorkflows, 
      complexity,
      totalNodes: workflow.nodes.length,
      totalSubflows: subWorkflows.size
    };
  }

  /**
   * Analiza patrón de un conjunto de nodos
   */
  analyzePattern(nodes) {
    if (nodes.length <= 2) return 'simple';
    if (nodes.length <= 5) return 'linear';
    if (nodes.length <= 15) return 'branching';
    return 'complex-branching';
  }
}

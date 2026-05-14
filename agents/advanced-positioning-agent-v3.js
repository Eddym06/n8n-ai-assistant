// 🎯 AGENTE DE POSICIONAMIENTO INTELIGENTE V3.0 - CON ALGORITMO SUGIYAMA
// Sistema avanzado de layout jerárquico con minimización de cruces

class AdvancedPositioningAgentV3 {
  constructor() {
    console.log('🎯 Inicializando Agente de Posicionamiento Avanzado V3.0...');
    
    // Configuración del algoritmo Sugiyama
    this.config = {
      levelHeight: 200,        // Altura entre niveles
      nodeWidth: 200,          // Ancho promedio de nodos
      nodeHeight: 80,          // Altura promedio de nodos
      minHorizontalSpacing: 250, // Espaciado mínimo horizontal
      minVerticalSpacing: 150,   // Espaciado mínimo vertical
      maxNodesPerLevel: 8,       // Máximo nodos por nivel antes de dividir
      crossingPenalty: 10,       // Penalización por cruces
      bendPenalty: 5             // Penalización por curvas
    };
  }

  // 🎯 MÉTODO PRINCIPAL: APLICAR ALGORITMO SUGIYAMA
  applySugiyamaLayout(workflow) {
    console.log('🎯 Aplicando algoritmo Sugiyama para layout jerárquico...');
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
      console.warn('⚠️ No hay nodos para posicionar');
      return 0;
    }

    try {
      // Fase 1: Análisis de dependencias y creación de grafo dirigido
      const graph = this.buildDirectedGraph(workflow);
      console.log(`📊 Grafo construido: ${graph.nodes.length} nodos, ${graph.edges.length} aristas`);

      // Fase 2: Asignación de niveles (layer assignment)
      const levels = this.assignLevels(graph);
      console.log(`📊 Niveles asignados: ${levels.length} niveles`);

      // Fase 3: Reducción de cruces (crossing reduction)
      const optimizedLevels = this.reduceCrossings(levels, graph);
      console.log(`📊 Cruces minimizados en ${optimizedLevels.length} niveles`);

      // Fase 4: Asignación de coordenadas (coordinate assignment)
      const positionedNodes = this.assignCoordinates(optimizedLevels);
      console.log(`📊 Coordenadas asignadas a ${positionedNodes.length} nodos`);

      // Fase 5: Aplicar posiciones al workflow
      let positionsUpdated = this.applyPositionsToWorkflow(workflow, positionedNodes);
      
      console.log(`✅ Algoritmo Sugiyama completado: ${positionsUpdated} posiciones actualizadas`);
      return positionsUpdated;

    } catch (error) {
      console.error('❌ Error en algoritmo Sugiyama:', error);
      // Fallback a posicionamiento simple
      return this.applySimpleGridLayout(workflow);
    }
  }

  // 🔗 CONSTRUCCIÓN DEL GRAFO DIRIGIDO
  buildDirectedGraph(workflow) {
    const graph = {
      nodes: [],
      edges: [],
      nodeMap: new Map()
    };

    // Agregar nodos al grafo
    workflow.nodes.forEach((node, index) => {
      const graphNode = {
        id: node.name,
        originalIndex: index,
        type: node.type,
        isSource: true,
        isTarget: true,
        inDegree: 0,
        outDegree: 0,
        level: -1
      };
      
      graph.nodes.push(graphNode);
      graph.nodeMap.set(node.name, graphNode);
    });

    // Agregar aristas basadas en conexiones
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(sourceNodeName => {
        const sourceNode = graph.nodeMap.get(sourceNodeName);
        if (!sourceNode) return;

        const connections = workflow.connections[sourceNodeName];
        if (connections && connections.main && Array.isArray(connections.main)) {
          connections.main.forEach(outputConnections => {
            if (Array.isArray(outputConnections)) {
              outputConnections.forEach(conn => {
                if (conn && conn.node) {
                  const targetNode = graph.nodeMap.get(conn.node);
                  if (targetNode) {
                    graph.edges.push({
                      source: sourceNodeName,
                      target: conn.node,
                      sourceIndex: conn.output || 0,
                      targetIndex: conn.input || 0
                    });
                    
                    sourceNode.outDegree++;
                    targetNode.inDegree++;
                    targetNode.isSource = false;
                  }
                }
              });
            }
          });
        }
      });
    }

    // Marcar nodos fuente y sumidero
    graph.nodes.forEach(node => {
      if (node.inDegree === 0) node.isSource = true;
      if (node.outDegree === 0) node.isTarget = true;
    });

    return graph;
  }

  // 📊 ASIGNACIÓN DE NIVELES (ALGORITMO DE COFFMAN-GRAHAM)
  assignLevels(graph) {
    const levels = [];
    const visited = new Set();
    const processing = new Set();

    // Identificar nodos fuente (sin dependencias)
    const sourceNodes = graph.nodes.filter(node => node.inDegree === 0);
    
    if (sourceNodes.length === 0) {
      // Si no hay nodos fuente claros, usar el primer nodo
      console.warn('⚠️ No se encontraron nodos fuente, usando el primer nodo');
      sourceNodes.push(graph.nodes[0]);
    }

    // Asignar nivel 0 a nodos fuente
    sourceNodes.forEach(node => {
      node.level = 0;
      this.addNodeToLevel(levels, node, 0);
      visited.add(node.id);
    });

    // Procesar nodos restantes usando topological sort
    let currentLevel = 0;
    let hasChanges = true;

    while (hasChanges && currentLevel < 20) { // Límite de seguridad
      hasChanges = false;
      currentLevel++;

      graph.nodes.forEach(node => {
        if (visited.has(node.id)) return;

        // Verificar si todas las dependencias están resueltas
        const incomingEdges = graph.edges.filter(edge => edge.target === node.id);
        const allDependenciesResolved = incomingEdges.every(edge => {
          const sourceNode = graph.nodeMap.get(edge.source);
          return sourceNode && visited.has(sourceNode.id);
        });

        if (allDependenciesResolved) {
          // Calcular el nivel basado en el máximo nivel de dependencias + 1
          let maxDependencyLevel = -1;
          incomingEdges.forEach(edge => {
            const sourceNode = graph.nodeMap.get(edge.source);
            if (sourceNode && sourceNode.level >= 0) {
              maxDependencyLevel = Math.max(maxDependencyLevel, sourceNode.level);
            }
          });

          node.level = Math.max(0, maxDependencyLevel + 1);
          this.addNodeToLevel(levels, node, node.level);
          visited.add(node.id);
          hasChanges = true;
        }
      });
    }

    // Procesar nodos no visitados (posibles ciclos)
    graph.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        console.warn(`⚠️ Nodo no procesado (posible ciclo): ${node.id}`);
        node.level = Math.max(0, currentLevel);
        this.addNodeToLevel(levels, node, node.level);
      }
    });

    return levels;
  }

  // 📊 AGREGAR NODO A NIVEL
  addNodeToLevel(levels, node, level) {
    while (levels.length <= level) {
      levels.push([]);
    }
    levels[level].push(node);
  }

  // ✂️ REDUCCIÓN DE CRUCES (BARYCENTER HEURISTIC)
  reduceCrossings(levels, graph) {
    if (levels.length <= 1) return levels;

    let improved = true;
    let iterations = 0;
    const maxIterations = 10;

    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;

      // Procesar de arriba hacia abajo
      for (let i = 1; i < levels.length; i++) {
        const newOrder = this.optimizeLevelOrder(levels[i], levels[i - 1], graph, 'down');
        if (this.hasOrderChanged(levels[i], newOrder)) {
          levels[i] = newOrder;
          improved = true;
        }
      }

      // Procesar de abajo hacia arriba
      for (let i = levels.length - 2; i >= 0; i--) {
        const newOrder = this.optimizeLevelOrder(levels[i], levels[i + 1], graph, 'up');
        if (this.hasOrderChanged(levels[i], newOrder)) {
          levels[i] = newOrder;
          improved = true;
        }
      }
    }

    console.log(`📊 Optimización de cruces completada en ${iterations} iteraciones`);
    return levels;
  }

  // 📊 OPTIMIZAR ORDEN DE NIVEL
  optimizeLevelOrder(currentLevel, adjacentLevel, graph, direction) {
    const nodeScores = new Map();

    currentLevel.forEach(node => {
      let score = 0;
      let connections = 0;

      // Calcular barycenter basado en conexiones
      const relevantEdges = graph.edges.filter(edge => {
        if (direction === 'down') {
          return edge.source === node.id;
        } else {
          return edge.target === node.id;
        }
      });

      relevantEdges.forEach(edge => {
        const connectedNodeId = direction === 'down' ? edge.target : edge.source;
        const connectedNode = adjacentLevel.find(n => n.id === connectedNodeId);
        if (connectedNode) {
          const position = adjacentLevel.indexOf(connectedNode);
          score += position;
          connections++;
        }
      });

      // Calcular barycenter promedio
      const barycenter = connections > 0 ? score / connections : adjacentLevel.length / 2;
      nodeScores.set(node.id, barycenter);
    });

    // Ordenar por barycenter
    return [...currentLevel].sort((a, b) => {
      const scoreA = nodeScores.get(a.id) || 0;
      const scoreB = nodeScores.get(b.id) || 0;
      return scoreA - scoreB;
    });
  }

  // 📊 VERIFICAR SI EL ORDEN CAMBIÓ
  hasOrderChanged(oldOrder, newOrder) {
    if (oldOrder.length !== newOrder.length) return true;
    return oldOrder.some((node, index) => node.id !== newOrder[index].id);
  }

  // 📍 ASIGNACIÓN DE COORDENADAS
  assignCoordinates(levels) {
    const positionedNodes = [];
    
    levels.forEach((level, levelIndex) => {
      const y = levelIndex * this.config.levelHeight + 100; // Offset inicial
      const totalWidth = level.length * this.config.nodeWidth + (level.length - 1) * this.config.minHorizontalSpacing;
      const startX = Math.max(100, (1000 - totalWidth) / 2); // Centrar en viewport de ~1000px

      level.forEach((node, nodeIndex) => {
        const x = startX + nodeIndex * (this.config.nodeWidth + this.config.minHorizontalSpacing);
        
        positionedNodes.push({
          id: node.id,
          originalIndex: node.originalIndex,
          position: [x, y],
          level: levelIndex
        });
      });
    });

    return positionedNodes;
  }

  // 📍 APLICAR POSICIONES AL WORKFLOW
  applyPositionsToWorkflow(workflow, positionedNodes) {
    let updated = 0;

    positionedNodes.forEach(posNode => {
      const workflowNode = workflow.nodes.find(n => n.name === posNode.id);
      if (workflowNode) {
        workflowNode.position = posNode.position;
        updated++;
        console.log(`📍 Posición aplicada: ${posNode.id} → [${posNode.position[0]}, ${posNode.position[1]}] (nivel ${posNode.level})`);
      }
    });

    return updated;
  }

  // 📊 FALLBACK: LAYOUT SIMPLE EN GRID
  applySimpleGridLayout(workflow) {
    console.log('📊 Aplicando layout simple de fallback...');
    let updated = 0;

    const cols = Math.ceil(Math.sqrt(workflow.nodes.length));
    
    workflow.nodes.forEach((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 100 + col * this.config.minHorizontalSpacing;
      const y = 100 + row * this.config.minVerticalSpacing;
      
      node.position = [x, y];
      updated++;
    });

    return updated;
  }
}

export default AdvancedPositioningAgentV3;
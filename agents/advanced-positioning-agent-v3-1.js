// 🎯 AGENTE DE POSICIONAMIENTO AVANZADO V3.1 - CORREGIDO
// Implementación del algoritmo Sugiyama optimizado para workflows de n8n

export default class AdvancedPositioningAgentV3_1 {
  constructor() {
    console.log('🎯 Inicializando Agente de Posicionamiento Avanzado V3.1 (CORREGIDO)...');
    this.config = {
      nodeWidth: 240,
      nodeHeight: 80,
      horizontalSpacing: 350,
      verticalSpacing: 200,
      maxNodesPerLevel: 8, // Máximo nodos por nivel horizontal
      startX: 100,
      startY: 100
    };
  }

  // 🎯 MÉTODO PRINCIPAL - ALGORITMO SUGIYAMA CORREGIDO
  applySugiyamaLayout(workflow) {
    try {
      console.log('🎯 Aplicando algoritmo Sugiyama CORREGIDO para layout jerárquico...');
      
      // Fase 1: Construir grafo dirigido (CORREGIDO)
      const graph = this.buildDirectedGraphCorrected(workflow);
      console.log(`📊 Grafo construido: ${graph.nodes.length} nodos, ${graph.edges.length} aristas`);

      // Fase 2: Asignación de niveles (OPTIMIZADO)
      this.assignLevelsOptimized(graph);
      const maxLevel = Math.max(...graph.nodes.map(n => n.level));
      console.log(`📊 Niveles asignados: ${maxLevel + 1} niveles (OPTIMIZADO)`);

      // Fase 3: Minimización de cruces (SIMPLIFICADO)
      this.reduceCrossingsSimple(graph, maxLevel);
      console.log(`📊 Optimización de cruces completada`);

      // Fase 4: Asignación de coordenadas (VERTICAL LAYOUT)
      const positionedNodes = this.assignCoordinatesVertical(graph);
      console.log(`📊 Coordenadas asignadas a ${positionedNodes.length} nodos`);

      // Fase 5: Aplicar posiciones al workflow
      let positionsUpdated = this.applyPositionsToWorkflow(workflow, positionedNodes);
      
      console.log(`✅ Algoritmo Sugiyama V3.1 completado: ${positionsUpdated} posiciones actualizadas`);
      return positionsUpdated;

    } catch (error) {
      console.error('❌ Error en algoritmo Sugiyama V3.1:', error);
      // Fallback a posicionamiento simple
      return this.applySimpleGridLayout(workflow);
    }
  }

  // 🔗 CONSTRUCCIÓN DEL GRAFO DIRIGIDO - CORREGIDO
  buildDirectedGraphCorrected(workflow) {
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
        inDegree: 0,
        outDegree: 0,
        level: -1,
        position: [0, 0],
        parents: [],
        children: []
      };
      
      graph.nodes.push(graphNode);
      graph.nodeMap.set(node.name, graphNode);
    });

    // Agregar aristas basadas en conexiones - CORREGIDO
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
                    // Crear arista
                    graph.edges.push({
                      source: sourceNodeName,
                      target: conn.node
                    });
                    
                    // Actualizar relaciones
                    sourceNode.outDegree++;
                    targetNode.inDegree++;
                    sourceNode.children.push(targetNode);
                    targetNode.parents.push(sourceNode);
                  }
                }
              });
            }
          });
        }
      });
    }

    return graph;
  }

  // 📊 ASIGNACIÓN DE NIVELES - OPTIMIZADO
  assignLevelsOptimized(graph) {
    // Encontrar nodos fuente (sin padres)
    const sourceNodes = graph.nodes.filter(n => n.inDegree === 0);
    
    if (sourceNodes.length === 0) {
      // Si no hay nodos fuente, tomar el primer nodo
      graph.nodes[0].level = 0;
      sourceNodes.push(graph.nodes[0]);
    }

    // Asignar nivel 0 a nodos fuente
    sourceNodes.forEach(node => {
      node.level = 0;
    });

    // Propagación de niveles usando BFS
    const queue = [...sourceNodes];
    const visited = new Set();

    while (queue.length > 0) {
      const currentNode = queue.shift();
      
      if (visited.has(currentNode.id)) continue;
      visited.add(currentNode.id);

      // Procesar hijos
      currentNode.children.forEach(child => {
        // Nivel del hijo es máximo de (nivel actual + 1, nivel actual del hijo)
        child.level = Math.max(child.level, currentNode.level + 1);
        
        // Agregar a cola si todos los padres han sido procesados
        const allParentsProcessed = child.parents.every(parent => visited.has(parent.id));
        if (allParentsProcessed && !visited.has(child.id)) {
          queue.push(child);
        }
      });
    }

    // Asignar nivel 0 a nodos sin nivel asignado
    graph.nodes.forEach(node => {
      if (node.level === -1) {
        node.level = 0;
      }
    });
  }

  // ✂️ MINIMIZACIÓN DE CRUCES - SIMPLIFICADO
  reduceCrossingsSimple(graph, maxLevel) {
    // Agrupar nodos por nivel
    const levels = [];
    for (let i = 0; i <= maxLevel; i++) {
      levels[i] = graph.nodes.filter(n => n.level === i);
    }

    // Ordenar nodos en cada nivel por número de conexiones
    levels.forEach(level => {
      level.sort((a, b) => {
        return (b.inDegree + b.outDegree) - (a.inDegree + a.outDegree);
      });
    });
  }

  // 📍 ASIGNACIÓN DE COORDENADAS - LAYOUT VERTICAL
  assignCoordinatesVertical(graph) {
    const maxLevel = Math.max(...graph.nodes.map(n => n.level));
    const positionedNodes = [];

    // Agrupar nodos por nivel
    const levelGroups = [];
    for (let level = 0; level <= maxLevel; level++) {
      levelGroups[level] = graph.nodes.filter(n => n.level === level);
    }

    // Asignar coordenadas nivel por nivel
    levelGroups.forEach((nodesInLevel, level) => {
      const y = this.config.startY + (level * this.config.verticalSpacing);
      
      // Distribuir nodos horizontalmente en el nivel
      const totalWidth = Math.max(1, nodesInLevel.length - 1) * this.config.horizontalSpacing;
      const startX = this.config.startX;

      nodesInLevel.forEach((node, index) => {
        let x;
        if (nodesInLevel.length === 1) {
          x = startX;
        } else {
          x = startX + (index * this.config.horizontalSpacing);
        }

        node.position = [x, y];
        positionedNodes.push({
          name: node.id,
          position: [x, y],
          level: level
        });

        console.log(`📍 Posición aplicada: ${node.id} → [${x}, ${y}] (nivel ${level})`);
      });
    });

    return positionedNodes;
  }

  // 🎨 APLICAR POSICIONES AL WORKFLOW
  applyPositionsToWorkflow(workflow, positionedNodes) {
    let updated = 0;
    
    positionedNodes.forEach(positioned => {
      const node = workflow.nodes.find(n => n.name === positioned.name);
      if (node) {
        node.position = positioned.position;
        updated++;
      }
    });

    return updated;
  }

  // 🔄 FALLBACK: LAYOUT SIMPLE EN GRID
  applySimpleGridLayout(workflow) {
    console.log('🔄 Aplicando layout simple en grid como fallback...');
    
    const cols = Math.ceil(Math.sqrt(workflow.nodes.length));
    let updated = 0;

    workflow.nodes.forEach((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const x = this.config.startX + (col * this.config.horizontalSpacing);
      const y = this.config.startY + (row * this.config.verticalSpacing);
      
      node.position = [x, y];
      updated++;
    });

    return updated;
  }
}
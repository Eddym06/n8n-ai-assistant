// 🎯 AGENTE DE POSICIONAMIENTO INTELIGENTE V5 - EL ARQUITECTO VISUAL
// Principios: Orden topológico, Minimización de cruces, Layout horizontal y Swimlanes

export default class IntelligentPositioningAgentV5 {
  constructor() {
    console.log('🎯 Inicializando Agente de Posicionamiento V5 - EL ARQUITECTO VISUAL...');
    this.config = {
      HORIZONTAL_SPACING: 380,  // Espacio entre columnas (niveles)
      VERTICAL_SPACING: 180,    // Espacio entre nodos en la misma columna
      SWIMLANE_SPACING: 600,    // Espacio entre grupos lógicos
      X_OFFSET: 150,           // Margen izquierdo
      Y_OFFSET: 150            // Margen superior
    };
  }

  // 🎯 MÉTODO PRINCIPAL - RESPETA ORDEN TOPOLÓGICO
  applyLayout(workflow, clusterManifest = null) {
    if (!workflow.nodes || workflow.nodes.length === 0) return workflow;

    console.log('🎯 Aplicando Layout V5 - Arquitecto Visual...');

    // Si no hay manifiesto de clusters, tratar todo como un cluster único
    if (!clusterManifest) {
      console.log('📊 Sin clusters definidos - tratando como flujo unificado');
      return this._applySingleClusterLayout(workflow);
    }

    // Procesar múltiples swimlanes
    return this._applyMultiClusterLayout(workflow, clusterManifest);
  }

  // 🔄 LAYOUT PARA FLUJO UNIFICADO (SIN SWIMLANES)
  _applySingleClusterLayout(workflow) {
    console.log('🔄 Aplicando layout unificado horizontal...');

    // 1. Análisis del grafo completo
    const { graph, roots } = this._analyzeGraph(workflow.nodes, workflow.connections);
    console.log(`📊 Grafo analizado: ${graph.size} nodos, ${roots.length} nodos raíz`);

    // 2. Cálculo de niveles topológicos REALES (SIN compresión)
    let nodesByLevel = this._calculateTopologicalLevels(graph, roots);
    console.log(`📊 Niveles topológicos: ${nodesByLevel.length} niveles reales`);

    // 3. MINIMIZACIÓN DE CRUCES (EL PASO CRÍTICO)
    nodesByLevel = this._minimizeCrossings(nodesByLevel, graph);
    console.log('✅ Cruces minimizados exitosamente');

    // 4. Asignación de coordenadas horizontales
    this._assignCoordinates(workflow.nodes, nodesByLevel, this.config.Y_OFFSET, this.config);
    
    const totalWidth = (nodesByLevel.length - 1) * this.config.HORIZONTAL_SPACING + this.config.X_OFFSET;
    const maxNodesInLevel = Math.max(...nodesByLevel.map(level => level.length));
    const totalHeight = (maxNodesInLevel - 1) * this.config.VERTICAL_SPACING + this.config.Y_OFFSET;
    
    console.log(`📊 Layout final: ${totalWidth}px × ${totalHeight}px`);
    return workflow;
  }

  // 🏊 LAYOUT PARA MÚLTIPLES SWIMLANES
  _applyMultiClusterLayout(workflow, clusterManifest) {
    console.log('🏊 Aplicando layout multi-swimlane...');
    
    let currentYOffset = this.config.Y_OFFSET;

    for (const clusterName in clusterManifest.definitions) {
      const clusterNodeNames = clusterManifest.definitions[clusterName];
      const clusterNodes = workflow.nodes.filter(n => clusterNodeNames.includes(n.name));
      
      console.log(`--- Posicionando Swimlane [${clusterName}] (${clusterNodes.length} nodos) ---`);

      // Crear sub-workflow para el cluster
      const subWorkflow = this._createSubWorkflow(clusterNodes, workflow.connections);

      // Aplicar el mismo proceso que el layout unificado
      const { graph, roots } = this._analyzeGraph(subWorkflow.nodes, subWorkflow.connections);
      let nodesByLevel = this._calculateTopologicalLevels(graph, roots);
      nodesByLevel = this._minimizeCrossings(nodesByLevel, graph);

      // Asignar coordenadas en el swimlane actual
      this._assignCoordinates(clusterNodes, nodesByLevel, currentYOffset, this.config);

      // Calcular altura del swimlane y mover al siguiente
      const laneHeight = this._calculateLaneHeight(nodesByLevel, this.config);
      currentYOffset += laneHeight + this.config.SWIMLANE_SPACING;
    }

    return workflow;
  }

  // 🔍 ANÁLISIS DEL GRAFO - CONSTRUIR DEPENDENCIAS
  _analyzeGraph(nodes, connections) {
    const graph = new Map();
    const inDegree = new Map();

    // Inicializar nodos
    nodes.forEach(node => {
      graph.set(node.name, {
        name: node.name,
        parents: new Set(),
        children: new Set()
      });
      inDegree.set(node.name, 0);
    });

    // Procesar conexiones
    if (connections) {
      Object.keys(connections).forEach(sourceNodeName => {
        const conns = connections[sourceNodeName];
        if (conns && conns.main && Array.isArray(conns.main)) {
          conns.main.forEach(output => {
            if (Array.isArray(output)) {
              output.forEach(conn => {
                if (conn && conn.node && graph.has(conn.node)) {
                  const sourceNode = graph.get(sourceNodeName);
                  const targetNode = graph.get(conn.node);
                  
                  if (sourceNode && targetNode) {
                    sourceNode.children.add(conn.node);
                    targetNode.parents.add(sourceNodeName);
                    inDegree.set(conn.node, inDegree.get(conn.node) + 1);
                  }
                }
              });
            }
          });
        }
      });
    }

    // Encontrar nodos raíz (sin padres)
    const roots = Array.from(inDegree.entries())
      .filter(([nodeName, degree]) => degree === 0)
      .map(([nodeName]) => nodeName);

    return { graph, roots };
  }

  // 📊 CÁLCULO DE NIVELES TOPOLÓGICOS (ALGORITMO DE KAHN)
  _calculateTopologicalLevels(graph, roots) {
    const levels = [];
    const nodeLevel = new Map();
    const queue = [...roots];
    const inDegreeMap = new Map();

    // Inicializar grados de entrada
    graph.forEach((node, nodeName) => {
      inDegreeMap.set(nodeName, node.parents.size);
    });

    // Asignar nivel 0 a nodos raíz
    roots.forEach(root => {
      nodeLevel.set(root, 0);
    });

    // Procesamiento por niveles
    while (queue.length > 0) {
      const currentNode = queue.shift();
      const currentLevel = nodeLevel.get(currentNode);
      
      // Asegurar que existe el array del nivel
      while (levels.length <= currentLevel) {
        levels.push([]);
      }
      levels[currentLevel].push(currentNode);

      // Procesar hijos
      const node = graph.get(currentNode);
      if (node) {
        node.children.forEach(childName => {
          const newInDegree = inDegreeMap.get(childName) - 1;
          inDegreeMap.set(childName, newInDegree);
          
          if (newInDegree === 0) {
            const childLevel = currentLevel + 1;
            nodeLevel.set(childName, childLevel);
            queue.push(childName);
          }
        });
      }
    }

    return levels;
  }

  // ✂️ MINIMIZACIÓN DE CRUCES (MÉTODO DEL BARICENTRO)
  _minimizeCrossings(levels, graph) {
    console.log('✂️ Minimizando cruces entre niveles...');
    
    const positions = new Map();
    
    // Inicializar posiciones
    levels.forEach(level => {
      level.forEach((node, index) => {
        positions.set(node, index);
      });
    });

    // Iterar para estabilizar (múltiples pasadas)
    for (let iteration = 0; iteration < 4; iteration++) {
      // Barrido hacia adelante (de izquierda a derecha)
      for (let levelIndex = 1; levelIndex < levels.length; levelIndex++) {
        const currentLevel = levels[levelIndex];
        const barycenters = new Map();

        currentLevel.forEach(nodeName => {
          const node = graph.get(nodeName);
          const parents = Array.from(node.parents);
          
          if (parents.length > 0) {
            const avgParentPos = parents.reduce((sum, parentName) => {
              return sum + positions.get(parentName);
            }, 0) / parents.length;
            barycenters.set(nodeName, avgParentPos);
          } else {
            barycenters.set(nodeName, positions.get(nodeName));
          }
        });

        // Reordenar por baricentro
        currentLevel.sort((a, b) => barycenters.get(a) - barycenters.get(b));
        
        // Actualizar posiciones
        currentLevel.forEach((nodeName, index) => {
          positions.set(nodeName, index);
        });
      }

      // Barrido hacia atrás (de derecha a izquierda)
      for (let levelIndex = levels.length - 2; levelIndex >= 0; levelIndex--) {
        const currentLevel = levels[levelIndex];
        const barycenters = new Map();

        currentLevel.forEach(nodeName => {
          const node = graph.get(nodeName);
          const children = Array.from(node.children);
          
          if (children.length > 0) {
            const avgChildPos = children.reduce((sum, childName) => {
              return sum + positions.get(childName);
            }, 0) / children.length;
            barycenters.set(nodeName, avgChildPos);
          } else {
            barycenters.set(nodeName, positions.get(nodeName));
          }
        });

        // Reordenar por baricentro
        currentLevel.sort((a, b) => barycenters.get(a) - barycenters.get(b));
        
        // Actualizar posiciones
        currentLevel.forEach((nodeName, index) => {
          positions.set(nodeName, index);
        });
      }
    }

    console.log(`✅ Cruces minimizados en ${4} iteraciones`);
    return levels;
  }

  // 🎨 ASIGNACIÓN DE COORDENADAS (LAYOUT HORIZONTAL)
  _assignCoordinates(clusterNodes, nodesByLevel, yOffset, config) {
    const nodeMap = new Map(clusterNodes.map(node => [node.name, node]));
    const maxNodesInLevel = Math.max(1, ...nodesByLevel.map(level => level.length));
    const laneHeight = (maxNodesInLevel - 1) * config.VERTICAL_SPACING;

    nodesByLevel.forEach((levelNodes, levelIndex) => {
      const x = config.X_OFFSET + (levelIndex * config.HORIZONTAL_SPACING);
      const numNodes = levelNodes.length;
      const startY = yOffset + (laneHeight / 2) - ((numNodes - 1) * config.VERTICAL_SPACING / 2);

      levelNodes.forEach((nodeName, nodeIndex) => {
        const node = nodeMap.get(nodeName);
        if (node) {
          const y = startY + (nodeIndex * config.VERTICAL_SPACING);
          node.position = [Math.round(x), Math.round(y)];
          console.log(`📍 V5: ${nodeName} → [${Math.round(x)}, ${Math.round(y)}] (nivel ${levelIndex})`);
        }
      });
    });
  }

  // 📏 UTILIDADES DE SOPORTE
  _createSubWorkflow(clusterNodes, allConnections) {
    const nodeNames = new Set(clusterNodes.map(n => n.name));
    const subConnections = {};

    // Filtrar solo conexiones dentro del cluster
    Object.keys(allConnections).forEach(source => {
      if (nodeNames.has(source)) {
        const conns = allConnections[source];
        if (conns && conns.main) {
          const filteredMain = conns.main.map(output => {
            if (Array.isArray(output)) {
              return output.filter(conn => conn && nodeNames.has(conn.node));
            }
            return output;
          }).filter(output => Array.isArray(output) && output.length > 0);
          
          if (filteredMain.length > 0) {
            subConnections[source] = { main: filteredMain };
          }
        }
      }
    });

    return {
      nodes: clusterNodes,
      connections: subConnections
    };
  }

  _calculateLaneHeight(nodesByLevel, config) {
    const maxNodesInLevel = Math.max(1, ...nodesByLevel.map(level => level.length));
    return (maxNodesInLevel - 1) * config.VERTICAL_SPACING + config.Y_OFFSET;
  }
}
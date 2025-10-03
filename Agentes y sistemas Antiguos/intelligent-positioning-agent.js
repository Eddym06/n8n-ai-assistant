/**
 * 🎯 INTELLIGENT POSITIONING AGENT V3.0 - EL ARQUITECTO VISUAL
 * =====================================      
      if (this.debugMode) {
        console.log(`   ✅ Swimlane [${clusterName}] completado. Altura: ${laneHeight}px`);
      }
    }); // Cerrar el forEach

    // [NUEVA MEJORA] Centrado y Equilibrio del Lienzo
    this._centerAndBalanceLayout(workflow);

    this.metrics.processingTime = Date.now() - startTime;===============
 * Sistema de posicionamiento topológico basado en clústers semánticos (Swimlanes)
 *
 * Responsabilidades:
 * 1. Aceptar un manifiesto de clústers de un agente de coherencia (ACF).
 * 2. Asignar cada clúster a un "carril" (swimlane) vertical en el lienzo.
 * 3. Calcular un layout topológico óptimo DENTRO de cada carril de forma independiente.
 * 4. Aplicar algoritmos estéticos para mejorar la legibilidad (reducción de cruces, arcos).
 * 5. Adaptar dinámicamente el espaciado según la densidad de cada carril.
 *
 * Versión: 3.0.0
 * Mejoras:
 * - Integración nativa con el sistema de clústers del ACF V3.0.
 * - Lógica robusta de Swimlanes con espaciado dinámico.
 * - Algoritmo de posicionamiento Sugiyama (simplificado) para minimizar cruces de líneas.
 * - Configuración adaptable por clúster.
 */
export default class IntelligentPositioningAgentV3 {
  constructor() {
    this.version = '3.0.0';
    this.debugMode = true;
    
    // Métricas para análisis
    this.metrics = {
      totalNodes: 0,
      totalClusters: 0,
      processingTime: 0,
      swimlanesCreated: 0
    };
  }

  /**
   * MÉTODO PRINCIPAL - Orquesta el posicionamiento basado en clústers.
   * Acepta el workflow y un manifiesto de clústers del ACF.
   * @param {object} workflow - El workflow completo con nodos y conexiones
   * @param {object} clusterManifest - Manifiesto de clústers del ACF V3.0
   * @returns {object} - El workflow con posiciones optimizadas
   */
  optimizeLayout(workflow, clusterManifest) {
    const startTime = Date.now();
    console.log('🎯 IPA v3.0: Iniciando layout basado en clústers semánticos...');

    if (!workflow.nodes || workflow.nodes.length === 0) {
      console.log('⚠️ Workflow vacío, no hay nodos para posicionar.');
      return workflow;
    }

    // El manifiesto de clústers ahora es un requisito.
    if (!clusterManifest || !clusterManifest.definitions || Object.keys(clusterManifest.definitions).length === 0) {
      console.error('❌ Error Crítico: El manifiesto de clústers es requerido para el IPA V3.0. Ejecute el ACF V3.0 primero.');
      console.warn('🔄 Volviendo al posicionamiento básico sin clústers...');
      return this._fallbackBasicLayout(workflow);
    }

    this.metrics.totalNodes = workflow.nodes.length;
    this.metrics.totalClusters = Object.keys(clusterManifest.definitions).length;

    // [NUEVA MEJORA] Optimización del Orden de Carriles (Inter-Swimlane)
    const optimizedClusterOrder = this._optimizeSwimlanesOrder(clusterManifest, workflow.connections);
    console.log('🔄 Orden optimizado de swimlanes:', optimizedClusterOrder.map(c => c.name));

    let currentYOffset = 100; // Posición Y inicial para el primer carril.

    // Procesar cada clúster en el orden optimizado
    optimizedClusterOrder.forEach(({ name: clusterName, nodes: clusterNodes }) => {
      
      if (this.debugMode) {
        console.log(`\n--- Posicionando Swimlane para [${clusterName}] (${clusterNodes.length} nodos) ---`);
      }

      // 1. Crear un sub-workflow temporal y aislado para este clúster.
      const subWorkflow = this._createSubWorkflow(clusterNodes, workflow.connections);
      
      // 2. Obtener configuración dinámica basada en la complejidad de ESTE clúster.
      const config = this._getDynamicConfigForCluster(subWorkflow.nodes.length);
      if (this.debugMode) {
        console.log(`   📊 Configuración para [${clusterName}]: Espaciado H:${config.HORIZONTAL_SPACING}, V:${config.VERTICAL_SPACING}`);
      }

      // 3. Análisis del Grafo y Ordenamiento Topológico.
      const { graph, roots } = this._analyzeGraph(subWorkflow.nodes, subWorkflow.connections);
      let nodesByLevel = this._calculateTopologicalLevels(graph, roots);

      // 4. [MEJORA] Insertar Nodos Virtuales para Arcos Largos
      const { augmentedNodesByLevel, virtualNodes } = this._insertVirtualNodes(nodesByLevel, graph);

      // 5. [MEJORA CLAVE] Minimización de Cruces Iterativa (Algoritmo de Sugiyama Mejorado)
      const optimizedLevels = this._minimizeCrossingsIterative(augmentedNodesByLevel, graph, virtualNodes);

      // 6. Asignación de Coordenadas Finales
      this._assignCoordinates(
        subWorkflow.nodes,
        optimizedLevels,
        currentYOffset,
        config,
        virtualNodes
      );

      // 7. [NUEVO] Generar Rutas de Conexión Armónicas (Arcos)
      this._generateConnectionPaths(workflow, clusterManifest);

      // 8. Calcular la altura del carril y actualizar el offset para el siguiente.
      const laneHeight = this._calculateLaneHeight(optimizedLevels, config);
      currentYOffset += laneHeight + config.SWIMLANE_SPACING;
      
      this.metrics.swimlanesCreated++;
      
      if (this.debugMode) {
        console.log(`   ✅ Swimlane [${clusterName}] completado. Altura: ${laneHeight}px`);
      }
    }); // Cerrar el forEach

    // [NUEVA MEJORA] Centrado y Equilibrio del Lienzo
    this._centerAndBalanceLayout(workflow);

    this.metrics.processingTime = Date.now() - startTime;
    console.log(`\n🎯 IPA v3.0 Completado en ${this.metrics.processingTime}ms.`);
    console.log(`   📊 Estadísticas: ${this.metrics.totalNodes} nodos, ${this.metrics.totalClusters} clústers, ${this.metrics.swimlanesCreated} swimlanes`);
    
    return workflow;
  }

  // === NUEVAS MEJORAS IMPLEMENTADAS ===

  /**
   * [MEJORA 3] Optimización del Orden de Carriles (Inter-Swimlane)
   * Analiza las conexiones entre clústers y ordena los swimlanes para minimizar cruces
   * @param {object} clusterManifest - Manifiesto de clústers
   * @param {object} allConnections - Todas las conexiones del workflow
   * @returns {Array<object>} - Clústers ordenados por conectividad
   */
  _optimizeSwimlanesOrder(clusterManifest, allConnections) {
    const clusters = Object.keys(clusterManifest.definitions);
    const clusterNodeMap = new Map();
    
    // Mapear qué nodos pertenecen a qué clúster
    clusters.forEach(clusterName => {
      clusterManifest.definitions[clusterName].forEach(node => {
        clusterNodeMap.set(node.name, clusterName);
      });
    });

    // Construir meta-grafo de clústers con pesos de conexión
    const metaGraph = new Map();
    clusters.forEach(cluster => {
      metaGraph.set(cluster, { outgoing: new Map(), incoming: new Set() });
    });

    // Analizar conexiones entre clústers
    Object.entries(allConnections).forEach(([sourceName, connections]) => {
      const sourceCluster = clusterNodeMap.get(sourceName);
      if (!sourceCluster || !connections.main) return;

      connections.main.flat().forEach(conn => {
        const targetCluster = clusterNodeMap.get(conn.node);
        if (!targetCluster || sourceCluster === targetCluster) return;

        // Incrementar peso de conexión entre clústers
        const current = metaGraph.get(sourceCluster).outgoing.get(targetCluster) || 0;
        metaGraph.get(sourceCluster).outgoing.set(targetCluster, current + 1);
        metaGraph.get(targetCluster).incoming.add(sourceCluster);
      });
    });

    // Ordenamiento topológico del meta-grafo con prioridad por peso
    const ordered = [];
    const visited = new Set();
    const inDegree = new Map();
    
    clusters.forEach(cluster => {
      inDegree.set(cluster, metaGraph.get(cluster).incoming.size);
    });

    // Encontrar clústers raíz (sin dependencias entrantes)
    const queue = clusters.filter(cluster => inDegree.get(cluster) === 0)
      .sort((a, b) => {
        // Priorizar por número de conexiones salientes
        const aOutgoing = Array.from(metaGraph.get(a).outgoing.values()).reduce((sum, w) => sum + w, 0);
        const bOutgoing = Array.from(metaGraph.get(b).outgoing.values()).reduce((sum, w) => sum + w, 0);
        return bOutgoing - aOutgoing;
      });

    while (queue.length > 0) {
      const cluster = queue.shift();
      ordered.push({
        name: cluster,
        nodes: clusterManifest.definitions[cluster]
      });
      visited.add(cluster);

      // Reducir grado de entrada de clústers dependientes
      metaGraph.get(cluster).outgoing.forEach((weight, targetCluster) => {
        inDegree.set(targetCluster, inDegree.get(targetCluster) - 1);
        if (inDegree.get(targetCluster) === 0) {
          queue.push(targetCluster);
          queue.sort((a, b) => {
            const aOutgoing = Array.from(metaGraph.get(a).outgoing.values()).reduce((sum, w) => sum + w, 0);
            const bOutgoing = Array.from(metaGraph.get(b).outgoing.values()).reduce((sum, w) => sum + w, 0);
            return bOutgoing - aOutgoing;
          });
        }
      });
    }

    // Añadir clústers restantes (en caso de ciclos)
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
   * [MEJORA 2] Insertar Nodos Virtuales para Arcos Largos
   * Detecta conexiones que saltan múltiples niveles e inserta nodos virtuales
   * @param {Array<Array<string>>} nodesByLevel - Nodos organizados por niveles
   * @param {Map} graph - Representación del grafo
   * @returns {object} - Niveles aumentados y mapa de nodos virtuales
   */
  _insertVirtualNodes(nodesByLevel, graph) {
    const levelMap = new Map();
    const virtualNodes = new Map();
    let virtualCounter = 0;

    // Mapear cada nodo a su nivel
    nodesByLevel.forEach((level, levelIndex) => {
      level.forEach(nodeName => {
        levelMap.set(nodeName, levelIndex);
      });
    });

    // Detectar arcos largos y crear nodos virtuales
    const augmentedLevels = nodesByLevel.map(level => [...level]);
    
    graph.forEach((nodeData, nodeName) => {
      nodeData.children.forEach(childName => {
        const sourceLevel = levelMap.get(nodeName);
        const targetLevel = levelMap.get(childName);
        
        // Si el arco salta más de un nivel, insertar nodos virtuales
        if (targetLevel - sourceLevel > 1) {
          const virtualNodesList = [];
          
          for (let level = sourceLevel + 1; level < targetLevel; level++) {
            const virtualNodeName = `__virtual_${virtualCounter++}`;
            virtualNodesList.push(virtualNodeName);
            
            // Añadir nodo virtual al nivel correspondiente
            augmentedLevels[level].push(virtualNodeName);
            
            // Registrar en el mapa de nodos virtuales
            virtualNodes.set(virtualNodeName, {
              source: nodeName,
              target: childName,
              level: level,
              isVirtual: true
            });
          }
          
          // Actualizar las conexiones del grafo para incluir los nodos virtuales
          if (virtualNodesList.length > 0) {
            // Remover conexión directa original
            nodeData.children.delete(childName);
            graph.get(childName).parents.delete(nodeName);
            
            // Crear cadena de conexiones virtuales
            let prevNode = nodeName;
            virtualNodesList.forEach(virtualNode => {
              // Crear entrada en el grafo para el nodo virtual
              graph.set(virtualNode, {
                node: { name: virtualNode, type: 'virtual' },
                parents: new Set([prevNode]),
                children: new Set()
              });
              
              // Conectar el nodo anterior al virtual
              graph.get(prevNode).children.add(virtualNode);
              prevNode = virtualNode;
            });
            
            // Conectar el último nodo virtual al objetivo final
            graph.get(prevNode).children.add(childName);
            graph.get(childName).parents.add(prevNode);
          }
        }
      });
    });

    console.log(`   🔗 ${virtualNodes.size} nodos virtuales insertados para arcos largos`);
    
    return { 
      augmentedNodesByLevel: augmentedLevels,
      virtualNodes 
    };
  }

  /**
   * [MEJORA 1 REFINADA] Minimización de Cruces Iterativa
   * Implementa barridos múltiples (arriba-abajo) para optimización estable
   * @param {Array<Array<string>>} nodesByLevel - Nodos por niveles
   * @param {Map} graph - Representación del grafo
   * @param {Map} virtualNodes - Mapa de nodos virtuales
   * @returns {Array<Array<string>>} - Niveles optimizados
   */
  _minimizeCrossingsIterative(nodesByLevel, graph, virtualNodes) {
    let optimizedLevels = nodesByLevel.map(level => [...level]);
    const maxIterations = 3; // 2-4 iteraciones suelen ser suficientes
    
    console.log(`   🔄 Iniciando minimización iterativa de cruces (${maxIterations} iteraciones)`);
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasChanges = false;
      
      // Barrido hacia abajo (basado en padres)
      for (let level = 1; level < optimizedLevels.length; level++) {
        const newOrder = this._calculateBarycenterOrder(optimizedLevels[level], optimizedLevels[level - 1], graph, 'parents');
        if (!this._arraysEqual(newOrder, optimizedLevels[level])) {
          optimizedLevels[level] = newOrder;
          hasChanges = true;
        }
      }
      
      // Barrido hacia arriba (basado en hijos)
      for (let level = optimizedLevels.length - 2; level >= 0; level--) {
        const newOrder = this._calculateBarycenterOrder(optimizedLevels[level], optimizedLevels[level + 1], graph, 'children');
        if (!this._arraysEqual(newOrder, optimizedLevels[level])) {
          optimizedLevels[level] = newOrder;
          hasChanges = true;
        }
      }
      
      if (!hasChanges) {
        console.log(`   ✅ Convergencia alcanzada en iteración ${iteration + 1}`);
        break;
      }
    }
    
    console.log(`   📊 Minimización de cruces completada`);
    return optimizedLevels;
  }

  /**
   * Calcula el orden de baricentro para un nivel específico
   * @param {Array<string>} currentLevel - Nodos del nivel actual
   * @param {Array<string>} referenceLevel - Nivel de referencia
   * @param {Map} graph - Representación del grafo
   * @param {string} direction - 'parents' o 'children'
   * @returns {Array<string>} - Nodos reordenados por baricentro
   */
  _calculateBarycenterOrder(currentLevel, referenceLevel, graph, direction) {
    const referencePosMap = new Map();
    referenceLevel.forEach((nodeName, index) => {
      referencePosMap.set(nodeName, index);
    });

    const nodeBaryCenters = currentLevel.map(nodeName => {
      const nodeData = graph.get(nodeName);
      if (!nodeData) return { nodeName, baryCenter: 0 };

      const connections = direction === 'parents' ? nodeData.parents : nodeData.children;
      if (connections.size === 0) return { nodeName, baryCenter: 0 };

      const sum = Array.from(connections).reduce((acc, connectedNode) => {
        const pos = referencePosMap.get(connectedNode);
        return acc + (pos !== undefined ? pos : 0);
      }, 0);

      return {
        nodeName,
        baryCenter: sum / connections.size
      };
    });

    // Ordenar por baricentro, manteniendo orden original para empates
    nodeBaryCenters.sort((a, b) => {
      if (Math.abs(a.baryCenter - b.baryCenter) < 0.001) {
        return currentLevel.indexOf(a.nodeName) - currentLevel.indexOf(b.nodeName);
      }
      return a.baryCenter - b.baryCenter;
    });

    return nodeBaryCenters.map(item => item.nodeName);
  }

  /**
   * [NUEVO] Generar Rutas de Conexión Armónicas (Arcos)
   * Calcula rutas de curvas de Bézier para conexiones suaves
   * @param {object} workflow - El workflow completo
   * @param {object} clusterManifest - Manifiesto de clústers
   */
  _generateConnectionPaths(workflow, clusterManifest) {
    const nodeMap = new Map(workflow.nodes.map(n => [n.name, n]));
    let pathsGenerated = 0;

    for (const sourceName in workflow.connections) {
      const sourceNode = nodeMap.get(sourceName);
      if (!sourceNode || !sourceNode.position) continue;

      const [x1, y1] = sourceNode.position;

      if (workflow.connections[sourceName].main) {
        workflow.connections[sourceName].main.flat().forEach(conn => {
          const targetNode = nodeMap.get(conn.node);
          if (!targetNode || !targetNode.position) return;

          const [x2, y2] = targetNode.position;

          // Configuración dinámica de arcos
          const config = this._getDynamicConfigForCluster(10);
          const arcStrength = config.ARC_STRENGTH || 80;
          
          // Calcular puntos de control para la curva de Bézier
          const midX = (x1 + x2) / 2;
          let cx1, cy1, cx2, cy2;

          if (x2 > x1) {
            // Conexión hacia adelante (normal)
            cx1 = midX + arcStrength;
            cy1 = y1;
            cx2 = midX - arcStrength;
            cy2 = y2;
          } else {
            // Conexión hacia atrás (bucle de retorno) - arco más pronunciado
            const backArcStrength = arcStrength * 1.5;
            cx1 = x1 + backArcStrength;
            cy1 = y1 - backArcStrength;
            cx2 = x2 + backArcStrength;
            cy2 = y2 - backArcStrength;
          }

          // Generar path SVG para curva de Bézier cúbica
          conn.pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
          pathsGenerated++;
        });
      }
    }

    console.log(`   🎨 ${pathsGenerated} rutas de conexión con arcos generadas`);
  }

  /**
   * [NUEVA MEJORA] Centrado y Equilibrio del Lienzo
   * Normaliza las posiciones para centrar el workflow en el viewport
   * @param {object} workflow - El workflow completo
   */
  _centerAndBalanceLayout(workflow) {
    if (!workflow.nodes || workflow.nodes.length === 0) return;

    // Encontrar bounding box del layout
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    workflow.nodes.forEach(node => {
      if (node.position) {
        const [x, y] = node.position;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    });

    // Calcular offset para centrar
    const layoutWidth = maxX - minX;
    const layoutHeight = maxY - minY;
    const margin = 100;
    
    const offsetX = margin - minX;
    const offsetY = margin - minY;

    // Aplicar offset a todos los nodos
    workflow.nodes.forEach(node => {
      if (node.position) {
        node.position[0] += offsetX;
        node.position[1] += offsetY;
      }
    });

    console.log(`   ⚖️ Layout centrado: ${layoutWidth}x${layoutHeight}px con margen ${margin}px`);
  }

  /**
   * Utilidad para comparar arrays
   * @param {Array} arr1 - Primer array
   * @param {Array} arr2 - Segundo array
   * @returns {boolean} - true si son iguales
   */
  _arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
  }

  /**
   * [NUEVO] Adapta el espaciado según el tamaño del CLÚSTER, no del workflow completo.
   * @param {number} nodeCount - Número de nodos en el clúster
   * @returns {object} - Configuración de espaciado para el clúster
   */
  _getDynamicConfigForCluster(nodeCount) {
    let config;
    if (nodeCount > 50) {
      config = { 
        HORIZONTAL_SPACING: 350, 
        VERTICAL_SPACING: 160, 
        SWIMLANE_SPACING: 600, 
        ARC_STRENGTH: 60 
      };
    } else if (nodeCount > 20) {
      config = { 
        HORIZONTAL_SPACING: 380, 
        VERTICAL_SPACING: 180, 
        SWIMLANE_SPACING: 700, 
        ARC_STRENGTH: 50 
      };
    } else if (nodeCount > 5) {
      config = { 
        HORIZONTAL_SPACING: 420, 
        VERTICAL_SPACING: 200, 
        SWIMLANE_SPACING: 800, 
        ARC_STRENGTH: 40 
      };
    } else {
      config = { 
        HORIZONTAL_SPACING: 450, 
        VERTICAL_SPACING: 250, 
        SWIMLANE_SPACING: 500, 
        ARC_STRENGTH: 30 
      };
    }
    return { ...config, X_OFFSET: 100 };
  }

  /**
   * [NUEVO Y CRÍTICO] Reordena los nodos dentro de cada nivel para minimizar los cruces de líneas.
   * Utiliza el método del baricentro, una heurística clave del algoritmo de Sugiyama.
   * @param {Array<Array<string>>} levels - Nodos organizados por niveles
   * @param {Map} graph - Representación del grafo
   * @returns {Array<Array<string>>} - Niveles optimizados para reducir cruces
   */
  _minimizeCrossings(levels, graph) {
    const positions = new Map();
    
    // Asignar posiciones iniciales
    levels.forEach(level => {
      level.forEach((nodeName, index) => {
        positions.set(nodeName, index);
      });
    });

    // Barridos hacia abajo y hacia arriba para refinar posiciones (simplificado a un barrido)
    for (let i = 1; i < levels.length; i++) {
        const currentLevel = levels[i];
        
        // Calcular el "peso" (baricentro) de cada nodo basado en la posición de sus padres.
        const barycenters = new Map();
        currentLevel.forEach(nodeName => {
            const parents = Array.from(graph.get(nodeName).parents);
            if (parents.length === 0) {
                barycenters.set(nodeName, -1); // Mantener al principio si no tiene padres en el nivel anterior
                return;
            }
            const avgParentPos = parents.reduce((sum, parentName) => sum + positions.get(parentName), 0) / parents.length;
            barycenters.set(nodeName, avgParentPos);
        });

        // Reordenar el nivel actual basado en los baricentros.
        currentLevel.sort((a, b) => barycenters.get(a) - barycenters.get(b));

        // Actualizar las posiciones para el siguiente nivel.
        currentLevel.forEach((nodeName, index) => {
            positions.set(nodeName, index);
        });
    }
    
    if (this.debugMode) {
      console.log("   ✨ Niveles optimizados para minimizar cruces de líneas.");
    }
    return levels;
  }

  /**
   * [MODIFICADO] Asigna coordenadas [x, y] a los nodos de un clúster.
   * @param {Array<object>} clusterNodes - Nodos del clúster
   * @param {Array<Array<string>>} nodesByLevel - Nodos organizados por niveles
   * @param {number} yOffset - Offset Y base para el swimlane
   * @param {object} config - Configuración de espaciado
   */
  _assignCoordinates(clusterNodes, nodesByLevel, yOffset, config) {
    const nodeMap = new Map(clusterNodes.map(node => [node.name, node]));
    const maxNodesInLevel = Math.max(...nodesByLevel.map(level => level.length));
    const totalHeight = (maxNodesInLevel - 1) * config.VERTICAL_SPACING;

    nodesByLevel.forEach((levelNodes, levelIndex) => {
      const x = config.X_OFFSET + (levelIndex * config.HORIZONTAL_SPACING);
      const numNodesInThisLevel = levelNodes.length;

      levelNodes.forEach((nodeName, nodeIndex) => {
        const node = nodeMap.get(nodeName);
        if (!node) return;

        // La posición Y se basa en el orden optimizado para minimizar cruces.
        const startY = yOffset + (totalHeight / 2) - ((numNodesInThisLevel - 1) * config.VERTICAL_SPACING / 2);
        const y = startY + (nodeIndex * config.VERTICAL_SPACING);

        node.position = [Math.round(x), Math.round(y)];
      });
    });
  }
  
  // --- MÉTODOS DE UTILIDAD (Reutilizados y mejorados para V3.0) ---
  
  /**
   * Crea un sub-workflow temporal para un clúster específico
   * @param {Array<object>} nodes - Nodos del clúster
   * @param {object} allConnections - Todas las conexiones del workflow
   * @returns {object} - Sub-workflow con nodos y conexiones del clúster
   */
  _createSubWorkflow(nodes, allConnections) {
    const nodeNames = new Set(nodes.map(n => n.name));
    const filteredConnections = {};
    
    Object.entries(allConnections).forEach(([sourceName, connections]) => {
      if (nodeNames.has(sourceName)) {
        const newConns = { main: [] };
        if (connections.main) {
          connections.main.forEach(group => {
            const filteredGroup = group.filter(conn => nodeNames.has(conn.node));
            if (filteredGroup.length > 0) {
              newConns.main.push(filteredGroup);
            }
          });
        }
        if (newConns.main.length > 0) {
          filteredConnections[sourceName] = newConns;
        }
      }
    });
    
    return { nodes, connections: filteredConnections };
  }

  /**
   * Analiza la estructura del grafo para un conjunto de nodos
   * @param {Array<object>} nodes - Nodos a analizar
   * @param {object} connections - Conexiones entre nodos
   * @returns {object} - Grafo y nodos raíz
   */
  _analyzeGraph(nodes, connections) {
    const graph = new Map();
    
    nodes.forEach(node => {
      graph.set(node.name, { 
        node, 
        parents: new Set(), 
        children: new Set() 
      });
    });

    Object.entries(connections).forEach(([sourceName, conns]) => {
      if (graph.has(sourceName) && conns.main) {
        conns.main.flat().forEach(conn => {
          if (graph.has(conn.node)) {
            graph.get(sourceName).children.add(conn.node);
            graph.get(conn.node).parents.add(sourceName);
          }
        });
      }
    });

    const roots = nodes.filter(node => 
      this.isTriggerNode(node.type) || 
      graph.get(node.name).parents.size === 0
    ).map(n => n.name);
    
    return { graph, roots };
  }

  /**
   * Calcula los niveles topológicos usando algoritmo de Kahn
   * @param {Map} graph - Representación del grafo
   * @param {Array<string>} roots - Nodos raíz
   * @returns {Array<Array<string>>} - Nodos organizados por niveles
   */
  _calculateTopologicalLevels(graph, roots) {
    const levels = [];
    const visited = new Set();
    const inDegree = new Map();
    
    graph.forEach((data, name) => inDegree.set(name, data.parents.size));

    let queue = roots.filter(r => inDegree.get(r) === 0);
    
    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel = [];
      
      for (let i = 0; i < levelSize; i++) {
        const nodeName = queue.shift();
        currentLevel.push(nodeName);
        visited.add(nodeName);
        
        graph.get(nodeName).children.forEach(childName => {
          inDegree.set(childName, inDegree.get(childName) - 1);
          if (inDegree.get(childName) === 0) {
            queue.push(childName);
          }
        });
      }
      levels.push(currentLevel);
    }
    
    // Manejo de ciclos: si quedan nodos, póngalos en un último nivel de "error"
    const unvisited = Array.from(graph.keys()).filter(name => !visited.has(name));
    if (unvisited.length > 0) {
      console.warn(`⚠️ Posible ciclo detectado en nodos: ${unvisited.join(', ')}. Se colocarán al final.`);
      levels.push(unvisited);
    }
    
    return levels;
  }
  
  /**
   * Calcula la altura total de un swimlane
   * @param {Array<Array<string>>} nodesByLevel - Nodos por nivel
   * @param {object} config - Configuración de espaciado
   * @returns {number} - Altura del swimlane en píxeles
   */
  _calculateLaneHeight(nodesByLevel, config) {
    if (nodesByLevel.length === 0) return config.VERTICAL_SPACING;
    const maxNodesInLevel = Math.max(...nodesByLevel.map(level => level.length));
    // Damos un poco más de espacio vertical para que no se vea apretado.
    return (maxNodesInLevel + 1) * config.VERTICAL_SPACING;
  }

  /**
   * Verifica si un tipo de nodo es un trigger
   * @param {string} nodeType - Tipo del nodo
   * @returns {boolean} - true si es un trigger
   */
  isTriggerNode(nodeType) {
    const type = (nodeType || '').toLowerCase();
    return type.includes('trigger') || 
           type.includes('webhook') || 
           type.includes('cron') || 
           type.includes('manual');
  }

  /**
   * Fallback al posicionamiento básico si no hay clústers disponibles
   * @param {object} workflow - Workflow a posicionar
   * @returns {object} - Workflow con posicionamiento básico
   */
  _fallbackBasicLayout(workflow) {
    console.log('🔄 Aplicando layout básico sin clústers...');
    
    const config = this._getDynamicConfigForCluster(workflow.nodes.length);
    const { graph, roots } = this._analyzeGraph(workflow.nodes, workflow.connections);
    const nodesByLevel = this._calculateTopologicalLevels(graph, roots);
    
    this._assignCoordinates(workflow.nodes, nodesByLevel, 100, config);
    
    console.log('✅ Layout básico aplicado.');
    return workflow;
  }

  /**
   * Habilita o deshabilita el modo debug
   * @param {boolean} enabled - true para habilitar debug
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  /**
   * Obtiene las métricas de rendimiento del último procesamiento
   * @returns {object} - Métricas de rendimiento
   */
  getMetrics() {
    return { ...this.metrics };
  }
}

// Exportaciones para retrocompatibilidad
export { IntelligentPositioningAgentV3 };
export { IntelligentPositioningAgentV3 as IntelligentPositioningAgent };
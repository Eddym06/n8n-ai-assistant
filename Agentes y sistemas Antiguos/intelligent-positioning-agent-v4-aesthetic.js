/**
 * 🎨 AGENTE DE POSICIONAMIENTO INTELIGENTE V4 ESTÉTICO
 * ═══════════════════════════════════════════════════════
 * 
 * Sistema avanzado para crear layouts profesionales y estéticamente
 * agradables que imiten el posicionamiento manual de workflows.
 * 
 * MEJORAS V4:
 * - Algoritmo orgánico de posicionamiento no-lineal
 * - Distribución curva y natural
 * - Espaciado dinámico basado en contexto  
 * - Prevención inteligente de colisiones
 * - Optimización estética automática
 */

class IntelligentPositioningAgentV4Aesthetic {
  constructor() {
    this.version = "4.0-aesthetic";
    console.log(`🎨 Agente de Posicionamiento Estético V${this.version} inicializado`);
  }

  /**
   * 🚀 Punto de entrada principal - Posicionamiento estético completo
   */
  optimizeWorkflowLayout(workflow) {
    console.log('🎨 === INICIANDO OPTIMIZACIÓN ESTÉTICA DE LAYOUT ===');
    
    if (!workflow || !workflow.nodes || workflow.nodes.length === 0) {
      console.warn('⚠️ Workflow vacío o inválido');
      return workflow;
    }

    try {
      // 1. Análisis del contexto y patrón
      const analysisResult = this.analyzeWorkflowContext(workflow);
      console.log(`📊 Contexto detectado: ${analysisResult.pattern} (${analysisResult.complexity})`);
      
      // 2. Configuración dinámica basada en contexto
      const config = this.createAestheticConfig(analysisResult);
      
      // 3. Distribución orgánica de módulos
      const distributedGroups = this.distributeModulesOrganically(workflow, config, analysisResult);
      
      // 4. Posicionamiento estético de nodos
      this.applyAestheticPositioning(distributedGroups, config, analysisResult);
      
      // 5. Post-procesamiento y refinamiento
      this.applyFinalAestheticRefinement(workflow, config);

      console.log('✨ Optimización estética completada exitosamente');
      return workflow;
      
    } catch (error) {
      console.error('❌ Error en optimización estética:', error);
      return workflow;
    }
  }

  /**
   * 📊 Análisis profundo del contexto del workflow
   */
  analyzeWorkflowContext(workflow) {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};
    
    // Análisis de estructura
    const nodeTypes = this.categorizeNodes(nodes);
    const connectionPatterns = this.analyzeConnectionPatterns(connections);
    const flowCharacteristics = this.analyzeFlowCharacteristics(nodes, connections);
    
    // Determinar patrón principal
    let pattern = 'linear';
    let complexity = 'simple';
    
    if (flowCharacteristics.branchingRatio > 0.4) {
      pattern = 'complex-branching';
      complexity = 'complex';
    } else if (flowCharacteristics.branchingRatio > 0.2) {
      pattern = 'branching';
      complexity = 'medium';
    } else if (flowCharacteristics.hasParallelPaths) {
      pattern = 'parallel';
      complexity = 'medium';
    }
    
    return {
      pattern,
      complexity,
      nodeTypes,
      connectionPatterns,
      flowCharacteristics,
      nodeCount: nodes.length
    };
  }

  /**
   * 🎯 Categorización inteligente de nodos
   */
  categorizeNodes(nodes) {
    const categories = {
      triggers: [],
      processors: [],
      conditionals: [],
      outputs: [],
      utilities: []
    };
    
    nodes.forEach(node => {
      const type = node.type?.toLowerCase() || '';
      const name = node.name?.toLowerCase() || '';
      
      if (type.includes('trigger') || type.includes('webhook') || type.includes('schedule')) {
        categories.triggers.push(node);
      } else if (type.includes('if') || type.includes('switch') || type.includes('condition')) {
        categories.conditionals.push(node);
      } else if (type.includes('email') || type.includes('slack') || type.includes('notification')) {
        categories.outputs.push(node);
      } else if (type.includes('set') || type.includes('function') || type.includes('code')) {
        categories.utilities.push(node);
      } else {
        categories.processors.push(node);
      }
    });
    
    return categories;
  }

  /**
   * 🔗 Análisis de patrones de conexión
   */
  analyzeConnectionPatterns(connections) {
    const patterns = {
      sequential: 0,
      branching: 0,
      merging: 0,
      parallel: 0
    };
    
    Object.entries(connections).forEach(([nodeName, nodeConnections]) => {
      let totalOutputs = 0;
      
      Object.values(nodeConnections).forEach(typeConnections => {
        const connArray = Array.isArray(typeConnections) ? typeConnections : typeConnections.flat();
        totalOutputs += connArray.length;
      });
      
      if (totalOutputs === 1) patterns.sequential++;
      else if (totalOutputs > 1) patterns.branching++;
    });
    
    return patterns;
  }

  /**
   * 🌊 Análisis de características de flujo
   */
  analyzeFlowCharacteristics(nodes, connections) {
    const characteristics = {
      totalConnections: 0,
      branchingNodes: 0,
      maxOutgoing: 0,
      hasParallelPaths: false,
      branchingRatio: 0,
      avgConnections: 0
    };
    
    Object.entries(connections).forEach(([nodeName, nodeConnections]) => {
      let outgoingCount = 0;
      
      Object.values(nodeConnections).forEach(typeConnections => {
        const connArray = Array.isArray(typeConnections) ? typeConnections : typeConnections.flat();
        outgoingCount += connArray.length;
        characteristics.totalConnections += connArray.length;
      });
      
      if (outgoingCount > 1) characteristics.branchingNodes++;
      characteristics.maxOutgoing = Math.max(characteristics.maxOutgoing, outgoingCount);
    });
    
    characteristics.branchingRatio = characteristics.branchingNodes / nodes.length;
    characteristics.avgConnections = characteristics.totalConnections / nodes.length;
    characteristics.hasParallelPaths = characteristics.maxOutgoing > 2;
    
    return characteristics;
  }

  /**
   * ⚙️ Configuración estética dinámica
   */
  createAestheticConfig(analysisResult) {
    const baseConfigs = {
      simple: {
        BASE_SPACING: 300,
        VERTICAL_FLOW: 180,
        CURVE_INTENSITY: 0.3,
        ORGANIC_FACTOR: 0.2,
        AESTHETIC_MODE: 'minimal',
        HORIZONTAL_VARIANCE: 80
      },
      medium: {
        BASE_SPACING: 400,
        VERTICAL_FLOW: 220,
        CURVE_INTENSITY: 0.5,
        ORGANIC_FACTOR: 0.4,
        AESTHETIC_MODE: 'balanced',
        HORIZONTAL_VARIANCE: 120
      },
      complex: {
        BASE_SPACING: 500,
        VERTICAL_FLOW: 280,
        CURVE_INTENSITY: 0.7,
        ORGANIC_FACTOR: 0.6,
        AESTHETIC_MODE: 'spacious',
        HORIZONTAL_VARIANCE: 160
      }
    };

    let config = { ...baseConfigs[analysisResult.complexity] };

    // Ajustes según patrón específico
    switch (analysisResult.pattern) {
      case 'linear':
        config.CURVE_INTENSITY *= 0.4;
        config.ORGANIC_FACTOR *= 0.3;
        config.LAYOUT_STYLE = 'flowing-linear';
        break;
      case 'branching':
        config.CURVE_INTENSITY *= 1.2;
        config.ORGANIC_FACTOR *= 1.3;
        config.LAYOUT_STYLE = 'organic-tree';
        break;
      case 'complex-branching':
        config.CURVE_INTENSITY *= 1.5;
        config.ORGANIC_FACTOR *= 1.6;
        config.LAYOUT_STYLE = 'artistic-web';
        break;
      case 'parallel':
        config.VERTICAL_FLOW *= 1.4;
        config.LAYOUT_STYLE = 'parallel-streams';
        break;
    }

    // Configuración base
    return {
      ...config,
      CANVAS_WIDTH: 2000,
      CANVAS_HEIGHT: 1500,
      STARTING_POINT: [200, 300],
      NODE_SIZE: { width: 240, height: 100 },
      COLLISION_BUFFER: 50,
      GOLDEN_RATIO: 1.618,
      BEZIER_SMOOTHNESS: 0.8,
      HORIZONTAL_VARIANCE: config.HORIZONTAL_VARIANCE || 100
    };
  }

  /**
   * 🌿 Distribución orgánica de módulos
   */
  distributeModulesOrganically(workflow, config, analysisResult) {
    console.log('🌿 Aplicando distribución orgánica de módulos...');
    
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};
    
    // 1. Identificar flujo principal y ramificaciones
    const flowStructure = this.mapFlowStructure(nodes, connections);
    
    // 2. Crear grupos lógicos naturales
    const organicGroups = this.createOrganicGroups(flowStructure, analysisResult);
    
    // 3. Distribuir grupos en el canvas con forma orgánica
    return this.distributeGroupsAesthetically(organicGroups, config);
  }

  /**
   * 🗺️ Mapeo de estructura de flujo
   */
  mapFlowStructure(nodes, connections) {
    const structure = {
      mainPath: [],
      branches: [],
      convergencePoints: [],
      isolatedNodes: []
    };
    
    // Encontrar nodos de inicio (sin conexiones entrantes)
    const nodeMap = new Map(nodes.map(node => [node.name, node]));
    const hasIncoming = new Set();
    
    Object.values(connections).forEach(nodeConnections => {
      Object.values(nodeConnections).forEach(typeConnections => {
        const connArray = Array.isArray(typeConnections) ? typeConnections : typeConnections.flat();
        connArray.forEach(conn => {
          if (conn.node) hasIncoming.add(conn.node);
        });
      });
    });
    
    const startingNodes = nodes.filter(node => !hasIncoming.has(node.name));
    
    // Trazar camino principal desde el primer nodo de inicio
    if (startingNodes.length > 0) {
      structure.mainPath = this.traceMainPath(startingNodes[0], connections, nodeMap);
    }
    
    // Identificar ramificaciones
    structure.branches = this.identifyBranches(structure.mainPath, connections, nodeMap);
    
    return structure;
  }

  /**
   * 🛤️ Trazado del camino principal
   */
  traceMainPath(startNode, connections, nodeMap) {
    const path = [startNode];
    let currentNode = startNode;
    
    while (currentNode && connections[currentNode.name]) {
      const nodeConnections = connections[currentNode.name];
      let nextNode = null;
      
      // Buscar la conexión principal (primera conexión main)
      Object.values(nodeConnections).forEach(typeConnections => {
        if (nextNode) return;
        
        const connArray = Array.isArray(typeConnections) ? typeConnections : typeConnections.flat();
        const mainConnection = connArray.find(conn => conn.type === 'main' || !conn.type);
        
        if (mainConnection && mainConnection.node) {
          nextNode = nodeMap.get(mainConnection.node);
        }
      });
      
      if (nextNode && !path.includes(nextNode)) {
        path.push(nextNode);
        currentNode = nextNode;
      } else {
        break;
      }
    }
    
    return path;
  }

  /**
   * 🌳 Identificación de ramificaciones
   */
  identifyBranches(mainPath, connections, nodeMap) {
    const branches = [];
    const mainPathNames = new Set(mainPath.map(node => node.name));
    
    mainPath.forEach(node => {
      if (!connections[node.name]) return;
      
      const nodeConnections = connections[node.name];
      Object.values(nodeConnections).forEach(typeConnections => {
        const connArray = Array.isArray(typeConnections) ? typeConnections : typeConnections.flat();
        
        connArray.forEach(conn => {
          if (conn.node && !mainPathNames.has(conn.node)) {
            // Trazar rama desde este punto
            const branchPath = this.traceBranch(nodeMap.get(conn.node), connections, nodeMap, mainPathNames);
            if (branchPath.length > 0) {
              branches.push({
                parentNode: node,
                path: branchPath,
                connectionType: conn.type || 'main'
              });
            }
          }
        });
      });
    });
    
    return branches;
  }

  /**
   * 🌿 Trazado de rama
   */
  traceBranch(startNode, connections, nodeMap, excludeNodes) {
    if (!startNode || excludeNodes.has(startNode.name)) return [];
    
    const path = [startNode];
    let currentNode = startNode;
    
    while (currentNode && connections[currentNode.name]) {
      const nodeConnections = connections[currentNode.name];
      let nextNode = null;
      
      Object.values(nodeConnections).forEach(typeConnections => {
        if (nextNode) return;
        
        const connArray = Array.isArray(typeConnections) ? typeConnections : typeConnections.flat();
        const connection = connArray.find(conn => 
          conn.node && !excludeNodes.has(conn.node) && 
          !path.find(n => n.name === conn.node)
        );
        
        if (connection) {
          nextNode = nodeMap.get(connection.node);
        }
      });
      
      if (nextNode) {
        path.push(nextNode);
        currentNode = nextNode;
      } else {
        break;
      }
    }
    
    return path;
  }

  /**
   * 🎨 Creación de grupos orgánicos
   */
  createOrganicGroups(flowStructure, analysisResult) {
    const groups = [];
    
    // Grupo principal
    if (flowStructure.mainPath.length > 0) {
      groups.push({
        type: 'main',
        nodes: flowStructure.mainPath,
        priority: 1,
        layoutStyle: 'flowing-curve'
      });
    }
    
    // Grupos de ramificaciones
    flowStructure.branches.forEach((branch, index) => {
      groups.push({
        type: 'branch',
        nodes: branch.path,
        parentNode: branch.parentNode,
        connectionType: branch.connectionType,
        priority: 2,
        layoutStyle: branch.connectionType === 'else' ? 'alternative-path' : 'support-branch',
        branchIndex: index
      });
    });
    
    return groups;
  }

  /**
   * 🏞️ Distribución estética de grupos
   */
  distributeGroupsAesthetically(organicGroups, config) {
    console.log('🏞️ Distribuyendo grupos estéticamente...');
    
    const distributedGroups = [];
    let currentY = config.STARTING_POINT[1];
    
    organicGroups.forEach((group, groupIndex) => {
      console.log(`  🎯 Grupo ${groupIndex + 1}: ${group.type} (${group.nodes.length} nodos)`);
      
      const groupConfig = this.createGroupSpecificConfig(group, config);
      const positionedGroup = this.positionGroupNodes(group, groupConfig, currentY);
      
      distributedGroups.push(positionedGroup);
      
      // Calcular siguiente posición Y basada en el grupo actual
      const groupBounds = this.calculateGroupBounds(positionedGroup);
      currentY = groupBounds.maxY + groupConfig.GROUP_SPACING;
    });
    
    return distributedGroups;
  }

  /**
   * ⚙️ Configuración específica por grupo
   */
  createGroupSpecificConfig(group, baseConfig) {
    const groupConfig = { ...baseConfig };
    
    switch (group.layoutStyle) {
      case 'flowing-curve':
        groupConfig.FLOW_CURVE = 0.6;
        groupConfig.HORIZONTAL_VARIANCE = 100;
        groupConfig.GROUP_SPACING = baseConfig.VERTICAL_FLOW * 0.8;
        break;
      case 'alternative-path':
        groupConfig.FLOW_CURVE = 0.8;
        groupConfig.HORIZONTAL_VARIANCE = 150;
        groupConfig.GROUP_SPACING = baseConfig.VERTICAL_FLOW * 1.2;
        break;
      case 'support-branch':
        groupConfig.FLOW_CURVE = 0.4;
        groupConfig.HORIZONTAL_VARIANCE = 80;
        groupConfig.GROUP_SPACING = baseConfig.VERTICAL_FLOW * 0.6;
        break;
    }
    
    return groupConfig;
  }

  /**
   * 📍 Posicionamiento de nodos en grupo
   */
  positionGroupNodes(group, config, startY) {
    if (group.type === 'main') {
      const positionedNodes = this.positionMainFlowNodes(group.nodes, config, startY);
      return {
        ...group,
        nodes: positionedNodes
      };
    } else {
      return this.positionBranchNodes(group, config, startY);
    }
  }

  /**
   * 🌊 Posicionamiento de flujo principal con curva natural
   */
  positionMainFlowNodes(nodes, config, startY) {
    const positionedNodes = [];
    const totalNodes = nodes.length;
    
    nodes.forEach((node, index) => {
      // Crear una curva suave para el flujo principal
      const progress = index / Math.max(totalNodes - 1, 1);
      
      // Calcular X progresivo de izquierda a derecha (SIEMPRE HACIA ADELANTE)
      const baseX = config.STARTING_POINT[0] + (index * config.BASE_SPACING);
      
      // Aplicar variación estética SOLO hacia adelante y verticalmente
      const forwardVariation = Math.abs(Math.sin(progress * Math.PI)) * config.HORIZONTAL_VARIANCE * config.FLOW_CURVE * 0.3;
      const x = baseX + forwardVariation; // Solo sumar, nunca restar
      
      // Calcular Y con espaciado natural
      const verticalVariation = Math.sin(progress * Math.PI * 2) * config.ORGANIC_FACTOR * 30;
      const y = startY + (index * config.VERTICAL_FLOW) + verticalVariation;
      
      // Crear copia del nodo con nueva posición
      const positionedNode = { ...node };
      positionedNode.position = [Math.round(x), Math.round(y)];
      positionedNodes.push(positionedNode);
      
      console.log(`    🌊 ${node.name}: [${Math.round(x)}, ${Math.round(y)}]`);
    });
    
    return positionedNodes;
  }

  /**
   * 🌿 Posicionamiento de nodos de rama
   */
  positionBranchNodes(group, config, startY) {
    const positionedNodes = [];
    const totalNodes = group.nodes.length;
    
    // Encontrar posición del nodo padre como referencia
    let parentX = config.STARTING_POINT[0];
    if (group.parentNode && group.parentNode.position) {
      parentX = group.parentNode.position[0];
    }
    
    // Calcular base X SIEMPRE AVANZANDO hacia la derecha
    const baseAdvance = config.BASE_SPACING * 0.8; // Avance base para ramas
    
    group.nodes.forEach((node, index) => {
      const progress = index / Math.max(totalNodes - 1, 1);
      
      // Posición X: SIEMPRE hacia la derecha, con separación vertical para ramas
      const baseX = parentX + baseAdvance + (index * config.BASE_SPACING * 0.6);
      
      // Separación vertical para ramas diferentes (en lugar de lateral)
      const branchVerticalOffset = group.connectionType === 'else' ? 60 : -60;
      const branchIndex = group.branchIndex || 0;
      const verticalSeparation = (branchIndex % 2 === 0 ? 1 : -1) * branchVerticalOffset;
      
      // X siempre progresivo
      const x = baseX;
      
      // Y con separación vertical para diferentes ramas
      const y = startY + (index * config.VERTICAL_FLOW * 0.8) + verticalSeparation;
      
      const positionedNode = { ...node };
      positionedNode.position = [Math.round(x), Math.round(y)];
      positionedNodes.push(positionedNode);
      
      console.log(`    🌿 ${node.name}: [${Math.round(x)}, ${Math.round(y)}]`);
    });
    
    return {
      ...group,
      nodes: positionedNodes
    };
  }

  /**
   * 🎯 Aplicación de posicionamiento estético final
   */
  applyAestheticPositioning(distributedGroups, config, analysisResult) {
    console.log('🎯 Aplicando posicionamiento estético final...');
    
    // Reunir todos los nodos posicionados
    const allPositionedNodes = [];
    distributedGroups.forEach(group => {
      allPositionedNodes.push(...group.nodes);
    });
    
    // NUEVO: Garantizar flujo progresivo de izquierda a derecha
    this.enforceLeftToRightProgression(allPositionedNodes, config);
    
    // Aplicar prevención de colisiones estética
    this.applyAestheticCollisionAvoidance(allPositionedNodes, config);
    
    // Optimización de espaciado visual
    this.optimizeVisualSpacing(allPositionedNodes, config);
  }

  /**
   * ➡️ Garantizar progresión de izquierda a derecha
   */
  enforceLeftToRightProgression(nodes, config) {
    console.log('➡️ Aplicando progresión estricta de izquierda a derecha...');
    
    // Ordenar nodos por posición X actual
    nodes.sort((a, b) => (a.position?.[0] || 0) - (b.position?.[0] || 0));
    
    let currentMinX = config.STARTING_POINT?.[0] || 200;
    const minSpacing = config.BASE_SPACING * 0.6; // Espaciado mínimo entre niveles
    
    nodes.forEach((node, index) => {
      if (!node.position) return;
      
      const [currentX, currentY] = node.position;
      
      // Garantizar que cada nodo esté más a la derecha que el anterior
      if (currentX < currentMinX) {
        node.position[0] = currentMinX;
        console.log(`  ➡️ Movido ${node.name}: ${currentX} → ${currentMinX}`);
      } else {
        node.position[0] = currentMinX;
        console.log(`  ➡️ Reubicado ${node.name}: ${currentX} → ${currentMinX}`);
      }
      
      // Incrementar mínimo X para el próximo nodo
      currentMinX += minSpacing;
    });
    
    console.log('✅ Progresión de izquierda a derecha garantizada');
  }

  /**
   * 🛡️ Prevención de colisiones estética
   */
  applyAestheticCollisionAvoidance(nodes, config) {
    const minDistance = config.NODE_SIZE.width + config.COLLISION_BUFFER;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        if (!node1.position || !node2.position) continue;
        
        const [x1, y1] = node1.position;
        const [x2, y2] = node2.position;
        
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        if (distance < minDistance) {
          // Determinar cuál nodo está más a la izquierda
          const leftNode = x1 <= x2 ? node1 : node2;
          const rightNode = x1 <= x2 ? node2 : node1;
          
          // Calcular separación necesaria
          const horizontalSeparation = minDistance * 0.7;
          const verticalSeparation = minDistance * 0.5;
          
          // Mover nodos: izquierdo hacia arriba, derecho hacia abajo
          // NUNCA mover hacia atrás en X
          if (Math.abs(x2 - x1) < horizontalSeparation) {
            rightNode.position[1] += verticalSeparation / 2;
            leftNode.position[1] -= verticalSeparation / 2;
          }
          
          console.log(`  🛡️ Colisión evitada: ${leftNode.name} vs ${rightNode.name}`);
        }
      }
    }
  }

  /**
   * 📏 Optimización de espaciado visual
   */
  optimizeVisualSpacing(nodes, config) {
    // Aplicar proporción áurea para espaciado óptimo
    const goldenRatio = config.GOLDEN_RATIO;
    
    // Encontrar centroide del layout
    const centroidX = nodes.reduce((sum, node) => sum + node.position[0], 0) / nodes.length;
    const centroidY = nodes.reduce((sum, node) => sum + node.position[1], 0) / nodes.length;
    
    // Aplicar ajustes sutiles basados en proporción áurea
    nodes.forEach(node => {
      const [x, y] = node.position;
      const distanceFromCenter = Math.sqrt(Math.pow(x - centroidX, 2) + Math.pow(y - centroidY, 2));
      
      // Aplicar factor de proporción áurea muy sutil
      const goldenFactor = 1 + ((distanceFromCenter / 1000) * 0.1 * (goldenRatio - 1));
      
      const adjustedX = centroidX + (x - centroidX) * goldenFactor;
      const adjustedY = centroidY + (y - centroidY) * goldenFactor;
      
      node.position[0] = Math.round(adjustedX);
      node.position[1] = Math.round(adjustedY);
    });
  }

  /**
   * ✨ Refinamiento estético final
   */
  applyFinalAestheticRefinement(workflow, config) {
    console.log('✨ Aplicando refinamiento estético final...');
    
    const nodes = workflow.nodes || [];
    
    // 1. Alineación sutil de elementos relacionados
    this.applySubtleAlignment(nodes);
    
    // 2. Suavizado de transiciones
    this.smoothLayoutTransitions(nodes);
    
    // 3. Validación de boundaries del canvas
    this.validateCanvasBoundaries(nodes, config);
    
    console.log('🎨 Refinamiento estético completado');
  }

  /**
   * 📐 Alineación sutil de elementos
   */
  applySubtleAlignment(nodes) {
    // Alinear nodos que están muy cerca en Y
    const tolerance = 30;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        if (!node1.position || !node2.position) continue;
        
        const yDiff = Math.abs(node1.position[1] - node2.position[1]);
        
        if (yDiff <= tolerance) {
          // Alinear al promedio
          const avgY = Math.round((node1.position[1] + node2.position[1]) / 2);
          node1.position[1] = avgY;
          node2.position[1] = avgY;
        }
      }
    }
  }

  /**
   * 🌊 Suavizado de transiciones de layout
   */
  smoothLayoutTransitions(nodes) {
    // Aplicar un suavizado muy sutil a las posiciones
    nodes.forEach(node => {
      if (node.position) {
        // Redondear a múltiplos de 10 para posicionamiento más limpio
        node.position[0] = Math.round(node.position[0] / 10) * 10;
        node.position[1] = Math.round(node.position[1] / 10) * 10;
      }
    });
  }

  /**
   * 🖼️ Validación de boundaries del canvas
   */
  validateCanvasBoundaries(nodes, config) {
    const margin = 100;
    const maxX = config.CANVAS_WIDTH - config.NODE_SIZE.width - margin;
    const maxY = config.CANVAS_HEIGHT - config.NODE_SIZE.height - margin;
    
    nodes.forEach(node => {
      if (node.position) {
        node.position[0] = Math.max(margin, Math.min(node.position[0], maxX));
        node.position[1] = Math.max(margin, Math.min(node.position[1], maxY));
      }
    });
  }

  /**
   * 📊 Cálculo de boundaries de grupo
   */
  calculateGroupBounds(group) {
    if (!group.nodes || group.nodes.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    
    const positions = group.nodes.map(node => node.position).filter(pos => pos);
    
    if (positions.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    
    return {
      minX: Math.min(...positions.map(pos => pos[0])),
      maxX: Math.max(...positions.map(pos => pos[0])),
      minY: Math.min(...positions.map(pos => pos[1])),
      maxY: Math.max(...positions.map(pos => pos[1]))
    };
  }
}

// Exportar clase para uso en otros módulos ES6
export default IntelligentPositioningAgentV4Aesthetic;

console.log('🎨 Agente de Posicionamiento Estético V4 cargado exitosamente');
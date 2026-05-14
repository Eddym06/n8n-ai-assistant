// 🎯 AGENTE DE POSICIONAMIENTO INTELIGENTE V4 - FINAL
// Optimizado específicamente para workflows de cadena larga como el masivo

export default class IntelligentPositioningAgentV4 {
  constructor() {
    console.log('🎯 Inicializando Agente de Posicionamiento Inteligente V4 - FINAL...');
    this.config = {
      nodeWidth: 240,
      nodeHeight: 80,
      horizontalSpacing: 350,
      verticalSpacing: 150, // Reduced spacing
      maxNodesPerLevel: 6, // Más nodos por nivel
      compactLevels: 12,   // Máximo 12 niveles para compactar
      startX: 100,
      startY: 100
    };
  }

  // 🎯 MÉTODO PRINCIPAL - LAYOUT INTELIGENTE COMPACTO
  applyIntelligentLayout(workflow) {
    try {
      console.log('🎯 Aplicando layout inteligente compacto...');
      
      // Paso 1: Analizar estructura
      const structure = this.analyzeWorkflowStructure(workflow);
      console.log(`📊 Estructura: ${structure.triggers.length} triggers, ${structure.chainLength} niveles máximos`);

      // Paso 2: Crear layout compacto
      const layout = this.createCompactLayout(workflow, structure);
      console.log(`📊 Layout compacto: ${layout.levels} niveles finales`);

      // Paso 3: Aplicar posiciones
      const updated = this.applyCompactPositions(workflow, layout);
      
      console.log(`✅ Layout inteligente V4 completado: ${updated} posiciones actualizadas`);
      return updated;

    } catch (error) {
      console.error('❌ Error en layout inteligente V4:', error);
      return this.applyFallbackLayout(workflow);
    }
  }

  // 🔍 ANALIZAR ESTRUCTURA DEL WORKFLOW
  analyzeWorkflowStructure(workflow) {
    const nodeMap = new Map();
    const connectionMap = new Map();
    
    // Mapear nodos - SOLO crear referencias, no modificar originales
    workflow.nodes.forEach(node => {
      nodeMap.set(node.name, {
        name: node.name,
        originalNode: node, // Referencia al nodo original
        inDegree: 0,
        outDegree: 0,
        level: -1,
        isProcessed: false
      });
    });

    // Mapear conexiones
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(source => {
        const conns = workflow.connections[source];
        if (conns && conns.main && Array.isArray(conns.main)) {
          conns.main.forEach(output => {
            if (Array.isArray(output)) {
              output.forEach(conn => {
                if (conn && conn.node && nodeMap.has(conn.node)) {
                  if (!connectionMap.has(source)) {
                    connectionMap.set(source, []);
                  }
                  connectionMap.get(source).push(conn.node);
                  
                  const sourceNode = nodeMap.get(source);
                  const targetNode = nodeMap.get(conn.node);
                  if (sourceNode && targetNode) {
                    sourceNode.outDegree++;
                    targetNode.inDegree++;
                  }
                }
              });
            }
          });
        }
      });
    }

    // Encontrar triggers (nodos sin entradas)
    const triggers = Array.from(nodeMap.values()).filter(node => node.inDegree === 0);
    
    // Calcular cadena más larga
    let maxChainLength = this.calculateMaxChainLength(triggers, connectionMap, nodeMap);
    
    return {
      nodeMap,
      connectionMap,
      triggers,
      chainLength: maxChainLength,
      totalNodes: workflow.nodes.length
    };
  }

  // 📏 CALCULAR LONGITUD MÁXIMA DE CADENA
  calculateMaxChainLength(triggers, connectionMap, nodeMap) {
    let maxLength = 0;
    const visited = new Set();

    function dfs(nodeName, depth) {
      if (visited.has(nodeName)) return depth;
      visited.add(nodeName);
      
      const connections = connectionMap.get(nodeName) || [];
      let maxDepth = depth;
      
      connections.forEach(child => {
        maxDepth = Math.max(maxDepth, dfs(child, depth + 1));
      });
      
      return maxDepth;
    }

    triggers.forEach(trigger => {
      visited.clear();
      const depth = dfs(trigger.name, 0);
      maxLength = Math.max(maxLength, depth);
    });

    return maxLength;
  }

  // 🏗️ CREAR LAYOUT COMPACTO
  createCompactLayout(workflow, structure) {
    const { nodeMap, connectionMap, triggers } = structure;
    
    // Asignar niveles compactos
    this.assignCompactLevels(triggers, connectionMap, nodeMap);
    
    // Redistribuir en niveles compactos
    const compactLevels = this.redistributeIntoCompactLevels(nodeMap);
    
    return {
      levels: compactLevels.length,
      levelData: compactLevels
    };
  }

  // 📊 ASIGNAR NIVELES COMPACTOS
  assignCompactLevels(triggers, connectionMap, nodeMap) {
    // BFS para asignar niveles iniciales
    const queue = triggers.map(t => ({ node: t, level: 0 }));
    const visited = new Set();

    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (visited.has(node.name)) continue;
      visited.add(node.name);
      
      node.level = level;
      
      const connections = connectionMap.get(node.name) || [];
      connections.forEach(childName => {
        const childNode = nodeMap.get(childName);
        if (childNode && !visited.has(childName)) {
          queue.push({ node: childNode, level: level + 1 });
        }
      });
    }
  }

  // 🗜️ REDISTRIBUIR EN NIVELES COMPACTOS
  redistributeIntoCompactLevels(nodeMap) {
    const nodes = Array.from(nodeMap.values());
    const maxOriginalLevel = Math.max(...nodes.map(n => n.level));
    
    // Calcular factor de compresión
    const compressionFactor = Math.max(1, Math.ceil(maxOriginalLevel / this.config.compactLevels));
    
    // Agrupar nodos en niveles compactos
    const compactLevels = [];
    
    for (let i = 0; i < this.config.compactLevels; i++) {
      compactLevels[i] = [];
    }
    
    nodes.forEach(node => {
      const compactLevel = Math.min(
        this.config.compactLevels - 1,
        Math.floor(node.level / compressionFactor)
      );
      compactLevels[compactLevel].push(node);
    });
    
    // Balancear niveles (evitar niveles sobrecargados)
    this.balanceCompactLevels(compactLevels);
    
    return compactLevels;
  }

  // ⚖️ BALANCEAR NIVELES COMPACTOS
  balanceCompactLevels(compactLevels) {
    const maxNodesPerLevel = this.config.maxNodesPerLevel;
    
    for (let i = 0; i < compactLevels.length - 1; i++) {
      const currentLevel = compactLevels[i];
      const nextLevel = compactLevels[i + 1];
      
      // Si el nivel actual tiene demasiados nodos, mover algunos al siguiente
      while (currentLevel.length > maxNodesPerLevel && nextLevel.length < maxNodesPerLevel) {
        const nodeToMove = currentLevel.pop();
        nextLevel.unshift(nodeToMove);
      }
    }
  }

  // 🎨 APLICAR POSICIONES COMPACTAS
  applyCompactPositions(workflow, layout) {
    let updated = 0;
    
    layout.levelData.forEach((nodesInLevel, levelIndex) => {
      const y = this.config.startY + (levelIndex * this.config.verticalSpacing);
      
      // Distribuir nodos horizontalmente
      nodesInLevel.forEach((node, nodeIndex) => {
        const x = this.config.startX + (nodeIndex * this.config.horizontalSpacing);
        
        // Encontrar nodo en workflow y actualizar posición
        const workflowNode = workflow.nodes.find(n => n.name === node.name);
        if (workflowNode) {
          workflowNode.position = [x, y];
          updated++;
          
          console.log(`📍 Posición compacta: ${node.name} → [${x}, ${y}] (nivel ${levelIndex})`);
        }
      });
    });
    
    return updated;
  }

  // 🔄 FALLBACK LAYOUT
  applyFallbackLayout(workflow) {
    console.log('🔄 Aplicando layout fallback...');
    
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
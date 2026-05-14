// Layout Learning Engine - Motor de Aprendizaje de Layouts
// Sistema inteligente para aprender y optimizar layouts de workflows

class LayoutLearningEngine {
  constructor(options = {}) {
    this.options = {
      learningRate: options.learningRate || 0.1,
      memorySize: options.memorySize || 1000,
      minConfidence: options.minConfidence || 0.6,
      adaptationThreshold: options.adaptationThreshold || 0.8,
      enablePatternLearning: options.enablePatternLearning !== false,
      enableUserFeedback: options.enableUserFeedback !== false,
      ...options
    };

    this.layoutPatterns = new Map();
    this.nodePositionHistory = new Map();
    this.workflowLayouts = new Map();
    this.userPreferences = new Map();
    this.performanceMetrics = new Map();

    this.learningAlgorithms = {
      reinforcement: this.reinforcementLearning.bind(this),
      pattern: this.patternLearning.bind(this),
      collaborative: this.collaborativeLearning.bind(this),
      adaptive: this.adaptiveLearning.bind(this)
    };

    this.layoutStrategies = {
      grid: this.gridLayout.bind(this),
      hierarchical: this.hierarchicalLayout.bind(this),
      force: this.forceDirectedLayout.bind(this),
      custom: this.customLayout.bind(this)
    };

    this.confidenceScores = new Map();
    this.lastLearningUpdate = Date.now();

    console.log('🎯 Layout Learning Engine inicializado');
  }

  // Método principal para aprender layout
  async learnLayout(workflow, layout, feedback = {}) {
    try {
      console.log('🧠 Layout Learning Engine: Aprendiendo layout...');

      if (!workflow || !layout) {
        throw new Error('Workflow o layout inválido');
      }

      const workflowId = workflow.id || this.generateWorkflowId(workflow);
      const layoutData = {
        workflow: workflow,
        layout: layout,
        timestamp: Date.now(),
        feedback: feedback,
        performance: this.calculateLayoutPerformance(workflow, layout)
      };

      // Almacenar layout
      this.storeLayout(workflowId, layoutData);

      // Aprender patrones
      if (this.options.enablePatternLearning) {
        await this.learnPatterns(workflow, layout, feedback);
      }

      // Actualizar preferencias de usuario
      if (feedback.userId && this.options.enableUserFeedback) {
        await this.updateUserPreferences(feedback.userId, layoutData);
      }

      // Actualizar métricas de rendimiento
      this.updatePerformanceMetrics(workflowId, layoutData);

      console.log(`✅ Layout aprendido para workflow: ${workflowId}`);
      return {
        workflowId: workflowId,
        learned: true,
        patternsLearned: this.layoutPatterns.size,
        confidence: this.calculateConfidence(workflowId)
      };

    } catch (error) {
      console.error('❌ Error aprendiendo layout:', error);
      return {
        workflowId: workflow?.id || 'unknown',
        learned: false,
        error: error.message
      };
    }
  }

  // Método principal para sugerir layout
  async suggestLayout(workflow, context = {}) {
    try {
      console.log('💡 Layout Learning Engine: Sugiriendo layout...');

      if (!workflow) {
        throw new Error('Workflow inválido');
      }

      const workflowId = workflow.id || this.generateWorkflowId(workflow);
      const suggestions = [];

      // Obtener layouts similares
      const similarWorkflows = await this.findSimilarWorkflows(workflow);

      // Generar sugerencias basadas en patrones aprendidos
      for (const similar of similarWorkflows) {
        const layout = this.workflowLayouts.get(similar.workflowId);
        if (layout) {
          const adaptedLayout = await this.adaptLayout(workflow, layout.layout, context);
          const confidence = this.calculateSuggestionConfidence(workflow, adaptedLayout, similar);

          suggestions.push({
            layout: adaptedLayout,
            confidence: confidence,
            source: 'learned',
            similarWorkflowId: similar.workflowId,
            reasoning: this.generateReasoning(workflow, adaptedLayout, similar)
          });
        }
      }

      // Generar layout basado en mejores prácticas
      const bestPracticeLayout = await this.generateBestPracticeLayout(workflow, context);
      suggestions.push({
        layout: bestPracticeLayout,
        confidence: 0.7,
        source: 'best-practice',
        reasoning: 'Layout basado en mejores prácticas de diseño de workflows'
      });

      // Ordenar por confianza
      suggestions.sort((a, b) => b.confidence - a.confidence);

      return {
        workflowId: workflowId,
        suggestions: suggestions.slice(0, 5), // Top 5
        totalSuggestions: suggestions.length,
        learningData: {
          patternsAvailable: this.layoutPatterns.size,
          similarWorkflowsFound: similarWorkflows.length
        }
      };

    } catch (error) {
      console.error('❌ Error sugiriendo layout:', error);
      return {
        workflowId: workflow?.id || 'unknown',
        suggestions: [],
        error: error.message
      };
    }
  }

  // Aprender patrones de layout
  async learnPatterns(workflow, layout, feedback) {
    try {
      const patterns = this.extractPatterns(workflow, layout);

      for (const pattern of patterns) {
        const patternKey = this.generatePatternKey(pattern);

        if (!this.layoutPatterns.has(patternKey)) {
          this.layoutPatterns.set(patternKey, {
            pattern: pattern,
            occurrences: 0,
            layouts: [],
            feedback: [],
            firstSeen: Date.now(),
            lastSeen: Date.now()
          });
        }

        const patternData = this.layoutPatterns.get(patternKey);
        patternData.occurrences++;
        patternData.layouts.push(layout);
        patternData.lastSeen = Date.now();

        if (feedback.rating) {
          patternData.feedback.push(feedback);
        }

        // Limitar layouts almacenados
        if (patternData.layouts.length > 10) {
          patternData.layouts = patternData.layouts.slice(-10);
        }
      }

      // Limpiar patrones antiguos si es necesario
      if (this.layoutPatterns.size > this.options.memorySize) {
        this.cleanOldPatterns();
      }

    } catch (error) {
      console.error('Error aprendiendo patrones:', error);
    }
  }

  // Extraer patrones del workflow y layout
  extractPatterns(workflow, layout) {
    const patterns = [];

    if (!workflow.nodes || !layout.positions) return patterns;

    // Patrón de estructura
    const structurePattern = {
      type: 'structure',
      nodeCount: workflow.nodes.length,
      connectionCount: this.countConnections(workflow),
      layoutType: this.detectLayoutType(layout),
      density: this.calculateLayoutDensity(layout)
    };
    patterns.push(structurePattern);

    // Patrones de posicionamiento
    const positioningPatterns = this.extractPositioningPatterns(workflow, layout);
    patterns.push(...positioningPatterns);

    // Patrones de agrupamiento
    const groupingPatterns = this.extractGroupingPatterns(workflow, layout);
    patterns.push(...groupingPatterns);

    return patterns;
  }

  // Extraer patrones de posicionamiento
  extractPositioningPatterns(workflow, layout) {
    const patterns = [];

    if (!workflow.nodes || !layout.positions) return patterns;

    // Calcular centroides por tipo de nodo
    const typeCentroids = {};
    const typeCounts = {};

    for (const node of workflow.nodes) {
      const position = layout.positions[node.id];
      if (position) {
        const nodeType = node.type;
        if (!typeCentroids[nodeType]) {
          typeCentroids[nodeType] = { x: 0, y: 0 };
          typeCounts[nodeType] = 0;
        }
        typeCentroids[nodeType].x += position.x;
        typeCentroids[nodeType].y += position.y;
        typeCounts[nodeType]++;
      }
    }

    // Crear patrones de posicionamiento
    for (const [nodeType, centroid] of Object.entries(typeCentroids)) {
      centroid.x /= typeCounts[nodeType];
      centroid.y /= typeCounts[nodeType];

      patterns.push({
        type: 'positioning',
        nodeType: nodeType,
        centroid: centroid,
        count: typeCounts[nodeType],
        relativePosition: this.calculateRelativePosition(centroid, layout)
      });
    }

    return patterns;
  }

  // Extraer patrones de agrupamiento
  extractGroupingPatterns(workflow, layout) {
    const patterns = [];

    if (!workflow.nodes || !layout.positions) return patterns;

    // Detectar grupos de nodos cercanos
    const groups = this.detectNodeGroups(workflow, layout);

    for (const group of groups) {
      if (group.nodes.length > 2) {
        patterns.push({
          type: 'grouping',
          nodes: group.nodes,
          centroid: group.centroid,
          spread: group.spread,
          nodeTypes: group.nodeTypes
        });
      }
    }

    return patterns;
  }

  // Detectar grupos de nodos
  detectNodeGroups(workflow, layout) {
    const groups = [];
    const processedNodes = new Set();
    const threshold = 200; // Distancia máxima para considerar nodos en el mismo grupo

    for (const node of workflow.nodes) {
      if (processedNodes.has(node.id)) continue;

      const group = {
        nodes: [node.id],
        centroid: { ...layout.positions[node.id] },
        nodeTypes: [node.type]
      };

      processedNodes.add(node.id);

      // Encontrar nodos cercanos
      for (const otherNode of workflow.nodes) {
        if (processedNodes.has(otherNode.id) || otherNode.id === node.id) continue;

        const distance = this.calculateDistance(
          layout.positions[node.id],
          layout.positions[otherNode.id]
        );

        if (distance <= threshold) {
          group.nodes.push(otherNode.id);
          group.centroid.x = (group.centroid.x + layout.positions[otherNode.id].x) / 2;
          group.centroid.y = (group.centroid.y + layout.positions[otherNode.id].y) / 2;
          group.nodeTypes.push(otherNode.type);
          processedNodes.add(otherNode.id);
        }
      }

      if (group.nodes.length > 1) {
        group.spread = this.calculateGroupSpread(group.nodes, layout);
        groups.push(group);
      }
    }

    return groups;
  }

  // Adaptar layout para un nuevo workflow
  async adaptLayout(targetWorkflow, sourceLayout, context) {
    try {
      const adaptedLayout = {
        positions: {},
        connections: sourceLayout.connections || {},
        metadata: {
          adapted: true,
          sourceWorkflow: context.sourceWorkflowId,
          adaptationMethod: 'pattern-based'
        }
      };

      // Mapear nodos similares
      const nodeMapping = this.mapSimilarNodes(targetWorkflow, context.sourceWorkflow);

      // Aplicar posiciones basadas en el mapeo
      for (const [targetNodeId, sourceNodeId] of Object.entries(nodeMapping)) {
        if (sourceLayout.positions[sourceNodeId]) {
          adaptedLayout.positions[targetNodeId] = {
            ...sourceLayout.positions[sourceNodeId]
          };
        }
      }

      // Generar posiciones para nodos no mapeados
      const unmappedNodes = targetWorkflow.nodes.filter(node => !adaptedLayout.positions[node.id]);
      for (const node of unmappedNodes) {
        adaptedLayout.positions[node.id] = this.generatePosition(node, adaptedLayout, targetWorkflow);
      }

      // Optimizar layout adaptado
      return await this.optimizeLayout(adaptedLayout, targetWorkflow);

    } catch (error) {
      console.error('Error adaptando layout:', error);
      return sourceLayout; // Retornar layout original si falla la adaptación
    }
  }

  // Mapear nodos similares entre workflows
  mapSimilarNodes(targetWorkflow, sourceWorkflow) {
    const mapping = {};

    if (!targetWorkflow.nodes || !sourceWorkflow.nodes) return mapping;

    for (const targetNode of targetWorkflow.nodes) {
      let bestMatch = null;
      let bestSimilarity = 0;

      for (const sourceNode of sourceWorkflow.nodes) {
        const similarity = this.calculateNodeSimilarity(targetNode, sourceNode);
        if (similarity > bestSimilarity && similarity > 0.7) {
          bestMatch = sourceNode.id;
          bestSimilarity = similarity;
        }
      }

      if (bestMatch) {
        mapping[targetNode.id] = bestMatch;
      }
    }

    return mapping;
  }

  // Calcular similitud entre nodos
  calculateNodeSimilarity(node1, node2) {
    let similarity = 0;

    // Similitud por tipo
    if (node1.type === node2.type) {
      similarity += 0.5;
    } else if (node1.type.toLowerCase().includes(node2.type.toLowerCase()) ||
               node2.type.toLowerCase().includes(node1.type.toLowerCase())) {
      similarity += 0.3;
    }

    // Similitud por nombre
    if (node1.name && node2.name) {
      const nameSimilarity = this.calculateStringSimilarity(node1.name, node2.name);
      similarity += nameSimilarity * 0.3;
    }

    // Similitud por conexiones (si está disponible)
    if (node1.connections && node2.connections) {
      const connectionSimilarity = this.calculateConnectionSimilarity(node1.connections, node2.connections);
      similarity += connectionSimilarity * 0.2;
    }

    return Math.min(similarity, 1.0);
  }

  // Generar layout basado en mejores prácticas
  async generateBestPracticeLayout(workflow, context) {
    const layout = {
      positions: {},
      connections: {},
      metadata: {
        generated: true,
        method: 'best-practice'
      }
    };

    if (!workflow.nodes) return layout;

    // Organizar nodos por tipo y función
    const categorizedNodes = this.categorizeNodes(workflow.nodes);

    let currentY = 100;
    const columnWidth = 300;
    const rowHeight = 150;

    // Colocar triggers en la parte superior
    if (categorizedNodes.triggers.length > 0) {
      this.placeNodesInRow(categorizedNodes.triggers, layout, 100, currentY, columnWidth);
      currentY += rowHeight;
    }

    // Colocar procesadores en el medio
    if (categorizedNodes.processors.length > 0) {
      this.placeNodesInRow(categorizedNodes.processors, layout, 100, currentY, columnWidth);
      currentY += rowHeight;
    }

    // Colocar outputs en la parte inferior
    if (categorizedNodes.outputs.length > 0) {
      this.placeNodesInRow(categorizedNodes.outputs, layout, 100, currentY, columnWidth);
    }

    return layout;
  }

  // Categorizar nodos
  categorizeNodes(nodes) {
    const categories = {
      triggers: [],
      processors: [],
      outputs: []
    };

    const triggerTypes = ['webhook', 'schedule', 'email-trigger', 'slack-trigger'];
    const outputTypes = ['email', 'slack', 'discord', 'telegram', 'http-request'];

    for (const node of nodes) {
      const nodeType = node.type.toLowerCase();

      if (triggerTypes.some(type => nodeType.includes(type))) {
        categories.triggers.push(node);
      } else if (outputTypes.some(type => nodeType.includes(type))) {
        categories.outputs.push(node);
      } else {
        categories.processors.push(node);
      }
    }

    return categories;
  }

  // Colocar nodos en fila
  placeNodesInRow(nodes, layout, startX, y, spacing) {
    let currentX = startX;

    for (const node of nodes) {
      layout.positions[node.id] = {
        x: currentX,
        y: y
      };
      currentX += spacing;
    }
  }

  // Generar posición para un nodo
  generatePosition(node, layout, workflow) {
    // Estrategia simple: colocar en una cuadrícula
    const existingPositions = Object.values(layout.positions);
    const gridSize = 200;

    let x = 100;
    let y = 100;

    // Encontrar posición libre
    while (existingPositions.some(pos => pos.x === x && pos.y === y)) {
      x += gridSize;
      if (x > 1000) {
        x = 100;
        y += gridSize;
      }
    }

    return { x, y };
  }

  // Optimizar layout
  async optimizeLayout(layout, workflow) {
    // Aplicar algoritmo de optimización simple
    const optimized = { ...layout };

    // Evitar superposiciones
    optimized.positions = this.avoidOverlaps(optimized.positions);

    // Mejorar legibilidad
    optimized.positions = this.improveReadability(optimized.positions, workflow);

    return optimized;
  }

  // Evitar superposiciones
  avoidOverlaps(positions) {
    const optimized = { ...positions };
    const minDistance = 150;
    const positionList = Object.entries(optimized);

    for (let i = 0; i < positionList.length; i++) {
      for (let j = i + 1; j < positionList.length; j++) {
        const [id1, pos1] = positionList[i];
        const [id2, pos2] = positionList[j];

        const distance = this.calculateDistance(pos1, pos2);
        if (distance < minDistance) {
          // Separar nodos
          const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
          const moveDistance = (minDistance - distance) / 2;

          optimized[id1].x -= Math.cos(angle) * moveDistance;
          optimized[id1].y -= Math.sin(angle) * moveDistance;
          optimized[id2].x += Math.cos(angle) * moveDistance;
          optimized[id2].y += Math.sin(angle) * moveDistance;
        }
      }
    }

    return optimized;
  }

  // Mejorar legibilidad
  improveReadability(positions, workflow) {
    // Implementación básica: ordenar por flujo de datos
    const optimized = { ...positions };

    if (workflow.connections) {
      // Aquí iría lógica más compleja para ordenar nodos por flujo
    }

    return optimized;
  }

  // Encontrar workflows similares
  async findSimilarWorkflows(workflow) {
    const similar = [];

    for (const [workflowId, layoutData] of this.workflowLayouts) {
      const similarity = this.calculateWorkflowSimilarity(workflow, layoutData.workflow);
      if (similarity > 0.6) {
        similar.push({
          workflowId: workflowId,
          similarity: similarity,
          layout: layoutData.layout
        });
      }
    }

    return similar.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  // Calcular similitud entre workflows
  calculateWorkflowSimilarity(workflow1, workflow2) {
    let similarity = 0;

    // Similitud por estructura
    const structure1 = this.getWorkflowStructure(workflow1);
    const structure2 = this.getWorkflowStructure(workflow2);
    similarity += this.calculateObjectSimilarity(structure1, structure2) * 0.4;

    // Similitud por tipos de nodos
    const types1 = this.getNodeTypeDistribution(workflow1);
    const types2 = this.getNodeTypeDistribution(workflow2);
    similarity += this.calculateDistributionSimilarity(types1, types2) * 0.3;

    // Similitud por conexiones
    const connections1 = this.countConnections(workflow1);
    const connections2 = this.countConnections(workflow2);
    const connectionSimilarity = 1 - Math.abs(connections1 - connections2) / Math.max(connections1, connections2, 1);
    similarity += connectionSimilarity * 0.3;

    return similarity;
  }

  // Utilidades
  generateWorkflowId(workflow) {
    return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  storeLayout(workflowId, layoutData) {
    this.workflowLayouts.set(workflowId, layoutData);

    // Limitar memoria
    if (this.workflowLayouts.size > this.options.memorySize) {
      this.cleanOldLayouts();
    }
  }

  updateUserPreferences(userId, layoutData) {
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, {
        layouts: [],
        preferences: {}
      });
    }

    const userData = this.userPreferences.get(userId);
    userData.layouts.push(layoutData);

    // Limitar historial
    if (userData.layouts.length > 50) {
      userData.layouts = userData.layouts.slice(-50);
    }
  }

  updatePerformanceMetrics(workflowId, layoutData) {
    this.performanceMetrics.set(workflowId, {
      layout: layoutData.layout,
      performance: layoutData.performance,
      timestamp: Date.now()
    });
  }

  calculateLayoutPerformance(workflow, layout) {
    // Calcular métricas de rendimiento del layout
    const metrics = {
      readability: this.calculateReadability(layout),
      efficiency: this.calculateEfficiency(workflow, layout),
      aesthetics: this.calculateAesthetics(layout)
    };

    return {
      overall: (metrics.readability + metrics.efficiency + metrics.aesthetics) / 3,
      metrics: metrics
    };
  }

  calculateReadability(layout) {
    if (!layout.positions) return 0.5;

    const positions = Object.values(layout.positions);
    let totalDistance = 0;
    let pairCount = 0;

    // Calcular distancia promedio entre nodos
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        totalDistance += this.calculateDistance(positions[i], positions[j]);
        pairCount++;
      }
    }

    const avgDistance = totalDistance / Math.max(pairCount, 1);
    // Normalizar: distancia ideal ~300px
    return Math.max(0, 1 - Math.abs(avgDistance - 300) / 300);
  }

  calculateEfficiency(workflow, layout) {
    // Eficiencia basada en minimización de cruces y longitud de conexiones
    let efficiency = 0.5;

    if (workflow.connections && layout.positions) {
      // Aquí iría cálculo más complejo de eficiencia
      efficiency = 0.7; // Placeholder
    }

    return efficiency;
  }

  calculateAesthetics(layout) {
    if (!layout.positions) return 0.5;

    const positions = Object.values(layout.positions);
    let aesthetics = 0.5;

    // Verificar alineación
    const alignedX = this.countAlignedPositions(positions, 'x');
    const alignedY = this.countAlignedPositions(positions, 'y');

    aesthetics += (alignedX + alignedY) / (positions.length * 2) * 0.3;

    return Math.min(aesthetics, 1.0);
  }

  countAlignedPositions(positions, axis) {
    const values = positions.map(pos => pos[axis]);
    const uniqueValues = new Set(values);
    return values.length - uniqueValues.size + 1; // +1 para evitar división por cero
  }

  calculateConfidence(workflowId) {
    const layoutData = this.workflowLayouts.get(workflowId);
    if (!layoutData) return 0;

    let confidence = 0.5;

    // Confianza basada en feedback
    if (layoutData.feedback && layoutData.feedback.length > 0) {
      const avgRating = layoutData.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / layoutData.feedback.length;
      confidence += (avgRating / 5) * 0.3; // Asumiendo rating de 1-5
    }

    // Confianza basada en rendimiento
    if (layoutData.performance) {
      confidence += layoutData.performance.overall * 0.4;
    }

    return Math.min(confidence, 1.0);
  }

  calculateSuggestionConfidence(workflow, layout, similarWorkflow) {
    let confidence = 0.5;

    // Confianza basada en similitud
    confidence += similarWorkflow.similarity * 0.4;

    // Confianza basada en rendimiento del layout original
    if (similarWorkflow.layout?.performance) {
      confidence += similarWorkflow.layout.performance.overall * 0.3;
    }

    // Confianza basada en feedback
    if (similarWorkflow.layout?.feedback?.length > 0) {
      const avgRating = similarWorkflow.layout.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / similarWorkflow.layout.feedback.length;
      confidence += (avgRating / 5) * 0.3;
    }

    return Math.min(confidence, 1.0);
  }

  generateReasoning(workflow, layout, similarWorkflow) {
    const reasons = [];

    reasons.push(`Layout adaptado de workflow similar con ${Math.round(similarWorkflow.similarity * 100)}% de similitud`);

    if (similarWorkflow.layout?.performance) {
      reasons.push(`Rendimiento esperado: ${Math.round(similarWorkflow.layout.performance.overall * 100)}%`);
    }

    if (similarWorkflow.layout?.feedback?.length > 0) {
      const avgRating = similarWorkflow.layout.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / similarWorkflow.layout.feedback.length;
      reasons.push(`Rating promedio de usuarios: ${avgRating.toFixed(1)}/5`);
    }

    return reasons.join('. ');
  }

  // Utilidades adicionales
  calculateDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  }

  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(shorter, longer);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  calculateObjectSimilarity(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const commonKeys = keys1.filter(key => keys2.includes(key));
    const totalKeys = new Set([...keys1, ...keys2]).size;

    return commonKeys.length / totalKeys;
  }

  calculateDistributionSimilarity(dist1, dist2) {
    const allKeys = new Set([...Object.keys(dist1), ...Object.keys(dist2)]);
    let similarity = 0;

    for (const key of allKeys) {
      const val1 = dist1[key] || 0;
      const val2 = dist2[key] || 0;
      const maxVal = Math.max(val1, val2, 1);
      similarity += 1 - Math.abs(val1 - val2) / maxVal;
    }

    return similarity / allKeys.size;
  }

  getWorkflowStructure(workflow) {
    return {
      nodeCount: workflow.nodes?.length || 0,
      connectionCount: this.countConnections(workflow),
      nodeTypes: this.getNodeTypeDistribution(workflow)
    };
  }

  getNodeTypeDistribution(workflow) {
    const distribution = {};

    if (!workflow.nodes) return distribution;

    for (const node of workflow.nodes) {
      distribution[node.type] = (distribution[node.type] || 0) + 1;
    }

    return distribution;
  }

  countConnections(workflow) {
    if (!workflow.connections) return 0;

    let count = 0;
    for (const [sourceId, connections] of Object.entries(workflow.connections)) {
      for (const [outputIndex, targets] of Object.entries(connections)) {
        count += targets.length;
      }
    }

    return count;
  }

  generatePatternKey(pattern) {
    return `${pattern.type}_${JSON.stringify(pattern).length}_${Date.now()}`;
  }

  calculateLayoutDensity(layout) {
    if (!layout.positions) return 0;

    const positions = Object.values(layout.positions);
    if (positions.length === 0) return 0;

    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);

    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    const area = width * height;

    return positions.length / Math.max(area, 1);
  }

  detectLayoutType(layout) {
    if (!layout.positions) return 'unknown';

    const positions = Object.values(layout.positions);
    if (positions.length < 3) return 'simple';

    // Detectar si es una cuadrícula
    const xs = positions.map(p => p.x).sort((a, b) => a - b);
    const ys = positions.map(p => p.y).sort((a, b) => a - b);

    const xDiffs = [];
    const yDiffs = [];

    for (let i = 1; i < xs.length; i++) {
      xDiffs.push(xs[i] - xs[i - 1]);
      yDiffs.push(ys[i] - ys[i - 1]);
    }

    const avgXDiff = xDiffs.reduce((sum, diff) => sum + diff, 0) / xDiffs.length;
    const avgYDiff = yDiffs.reduce((sum, diff) => sum + diff, 0) / yDiffs.length;

    const xVariance = xDiffs.reduce((sum, diff) => sum + Math.pow(diff - avgXDiff, 2), 0) / xDiffs.length;
    const yVariance = yDiffs.reduce((sum, diff) => sum + Math.pow(diff - avgYDiff, 2), 0) / yDiffs.length;

    if (xVariance < 1000 && yVariance < 1000) {
      return 'grid';
    }

    return 'organic';
  }

  calculateRelativePosition(position, layout) {
    if (!layout.positions) return { x: 0.5, y: 0.5 };

    const positions = Object.values(layout.positions);
    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: (position.x - minX) / Math.max(maxX - minX, 1),
      y: (position.y - minY) / Math.max(maxY - minY, 1)
    };
  }

  calculateGroupSpread(nodeIds, layout) {
    if (nodeIds.length < 2) return 0;

    const positions = nodeIds.map(id => layout.positions[id]).filter(Boolean);
    if (positions.length < 2) return 0;

    const centroid = positions.reduce(
      (acc, pos) => ({ x: acc.x + pos.x, y: acc.y + pos.y }),
      { x: 0, y: 0 }
    );

    centroid.x /= positions.length;
    centroid.y /= positions.length;

    const distances = positions.map(pos => this.calculateDistance(centroid, pos));
    const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;

    return avgDistance;
  }

  calculateConnectionSimilarity(connections1, connections2) {
    // Implementación simplificada
    const count1 = Object.keys(connections1).length;
    const count2 = Object.keys(connections2).length;

    return 1 - Math.abs(count1 - count2) / Math.max(count1, count2, 1);
  }

  cleanOldPatterns() {
    const entries = Array.from(this.layoutPatterns.entries());
    entries.sort((a, b) => a[1].lastSeen - b[1].lastSeen);

    const toRemove = Math.floor(entries.length * 0.1); // Remover 10% más antiguos
    for (let i = 0; i < toRemove; i++) {
      this.layoutPatterns.delete(entries[i][0]);
    }
  }

  cleanOldLayouts() {
    const entries = Array.from(this.workflowLayouts.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = Math.floor(entries.length * 0.1); // Remover 10% más antiguos
    for (let i = 0; i < toRemove; i++) {
      this.workflowLayouts.delete(entries[i][0]);
    }
  }

  // Métodos de algoritmos de aprendizaje (placeholders para futuras implementaciones)
  async reinforcementLearning(data) {
    // Implementación de aprendizaje por refuerzo
    console.log('Aprendizaje por refuerzo no implementado aún');
  }

  async patternLearning(data) {
    // Implementación de aprendizaje de patrones
    console.log('Aprendizaje de patrones no implementado aún');
  }

  async collaborativeLearning(data) {
    // Implementación de aprendizaje colaborativo
    console.log('Aprendizaje colaborativo no implementado aún');
  }

  async adaptiveLearning(data) {
    // Implementación de aprendizaje adaptativo
    console.log('Aprendizaje adaptativo no implementado aún');
  }

  // Layout strategies (placeholders)
  gridLayout(workflow) {
    console.log('Layout en cuadrícula no implementado aún');
    return { positions: {} };
  }

  hierarchicalLayout(workflow) {
    console.log('Layout jerárquico no implementado aún');
    return { positions: {} };
  }

  forceDirectedLayout(workflow) {
    console.log('Layout por fuerzas no implementado aún');
    return { positions: {} };
  }

  customLayout(workflow) {
    console.log('Layout personalizado no implementado aún');
    return { positions: {} };
  }

  // Método para obtener estadísticas
  getStats() {
    return {
      patternsLearned: this.layoutPatterns.size,
      layoutsStored: this.workflowLayouts.size,
      usersTracked: this.userPreferences.size,
      lastUpdate: this.lastLearningUpdate
    };
  }

  // Método para resetear el motor
  reset() {
    this.layoutPatterns.clear();
    this.nodePositionHistory.clear();
    this.workflowLayouts.clear();
    this.userPreferences.clear();
    this.performanceMetrics.clear();
    this.confidenceScores.clear();
    this.lastLearningUpdate = Date.now();
    console.log('🧹 Layout Learning Engine reseteado');
  }
}

// Exportar la clase
export default LayoutLearningEngine;

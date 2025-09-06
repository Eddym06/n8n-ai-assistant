// Intelligent Positioning Agent V4.0
// Sistema avanzado de posicionamiento inteligente para workflows n8n

class IntelligentPositioningAgent {
  constructor() {
    this.positioningRules = {
      // Reglas de posicionamiento para tipos de nodos comunes
      nodeTypes: {
        'n8n-nodes-base.webhook': { preferredPosition: 'start', priority: 10 },
        'n8n-nodes-base.cron': { preferredPosition: 'start', priority: 9 },
        'n8n-nodes-base.schedule': { preferredPosition: 'start', priority: 8 },
        'n8n-nodes-base.httpRequest': { preferredPosition: 'middle', priority: 7 },
        'n8n-nodes-base.if': { preferredPosition: 'middle', priority: 6 },
        'n8n-nodes-base.switch': { preferredPosition: 'middle', priority: 5 },
        'n8n-nodes-base.code': { preferredPosition: 'middle', priority: 4 },
        'n8n-nodes-base.function': { preferredPosition: 'middle', priority: 3 },
        'n8n-nodes-base.emailSend': { preferredPosition: 'end', priority: 2 },
        'n8n-nodes-base.slack': { preferredPosition: 'end', priority: 1 }
      },
      
      // Reglas de agrupamiento por funcionalidad
      functionalGroups: {
        'trigger': ['webhook', 'cron', 'schedule'],
        'processing': ['httpRequest', 'if', 'switch', 'code', 'function'],
        'output': ['emailSend', 'slack', 'discord', 'telegram']
      }
    };
    
    this.layoutTemplates = {
      'linear': this.linearLayout.bind(this),
      'branching': this.branchingLayout.bind(this),
      'centralized': this.centralizedLayout.bind(this)
    };
  }

  // Método principal para optimizar el posicionamiento de nodos
  optimizeLayout(workflowData, options = {}) {
    try {
      console.log('🎯 IntelligentPositioningAgent: Optimizando layout del workflow...');
      
      if (!workflowData || !workflowData.nodes || !Array.isArray(workflowData.nodes)) {
        throw new Error('Datos del workflow inválidos para optimización');
      }

      const nodes = workflowData.nodes;
      
      // Clasificar nodos por tipo y función
      const classifiedNodes = this.classifyNodes(nodes);
      
      // Aplicar estrategia de layout según el tipo de workflow
      const layoutStrategy = options.layoutStrategy || this.determineBestLayout(classifiedNodes);
      
      console.log(`📐 Aplicando estrategia de layout: ${layoutStrategy}`);
      
      // Reordenar nodos según la estrategia seleccionada
      const optimizedNodes = this.layoutTemplates[layoutStrategy](classifiedNodes);
      
      // Actualizar conexiones basadas en el nuevo orden
      workflowData.nodes = optimizedNodes;
      workflowData.connections = this.updateConnections(workflowData.connections, optimizedNodes);
      
      console.log('✅ Layout optimizado exitosamente');
      return workflowData;
      
    } catch (error) {
      console.error('❌ Error en IntelligentPositioningAgent:', error.message);
      return workflowData;
    }
  }

  // Clasificar nodos por tipo y función
  classifyNodes(nodes) {
    const classified = {
      triggers: [],
      processors: [],
      outputs: []
    };

    nodes.forEach(node => {
      const nodeType = node.type || '';
      
      if (this.isTriggerNode(nodeType)) {
        classified.triggers.push(node);
      } else if (this.isOutputNode(nodeType)) {
        classified.outputs.push(node);
      } else {
        classified.processors.push(node);
      }
    });

    return classified;
  }

  // Determinar el mejor layout basado en los nodos
  determineBestLayout(classifiedNodes) {
    const { triggers, processors, outputs } = classifiedNodes;
    
    if (triggers.length > 1 || processors.length > 5) {
      return 'branching';
    } else if (outputs.length > 2) {
      return 'centralized';
    } else {
      return 'linear';
    }
  }

  // Layout lineal (trigger -> processors -> outputs)
  linearLayout(classifiedNodes) {
    const { triggers, processors, outputs } = classifiedNodes;
    return [...triggers, ...processors, ...outputs];
  }

  // Layout con branching
  branchingLayout(classifiedNodes) {
    const { triggers, processors, outputs } = classifiedNodes;
    
    // Ordenar procesadores por complejidad
    const sortedProcessors = this.sortByComplexity(processors);
    
    return [...triggers, ...sortedProcessors, ...outputs];
  }

  // Layout centralizado
  centralizedLayout(classifiedNodes) {
    const { triggers, processors, outputs } = classifiedNodes;
    
    // Colocar triggers primero, luego outputs centralizados, luego procesadores
    return [...triggers, ...outputs, ...processors];
  }

  // Ordenar nodos por complejidad
  sortByComplexity(nodes) {
    return nodes.sort((a, b) => {
      const complexityA = this.calculateNodeComplexity(a);
      const complexityB = this.calculateNodeComplexity(b);
      return complexityB - complexityA; // Mayor complejidad primero
    });
  }

  // Calcular complejidad de un nodo
  calculateNodeComplexity(node) {
    let complexity = 0;
    
    // Basado en tipo de nodo
    const typeRules = this.positioningRules.nodeTypes[node.type];
    if (typeRules) {
      complexity += typeRules.priority;
    }
    
    // Basado en parámetros
    if (node.parameters) {
      const paramCount = Object.keys(node.parameters).length;
      complexity += paramCount * 0.5;
    }
    
    return complexity;
  }

  // Actualizar conexiones después de reordenar nodos
  updateConnections(connections, optimizedNodes) {
    if (!connections) return connections;
    
    // Este es un placeholder - en una implementación real se necesitaría
    // lógica más compleja para mantener las conexiones válidas
    return connections;
  }

  // Verificar si es nodo trigger
  isTriggerNode(nodeType) {
    return this.positioningRules.functionalGroups.trigger.some(
      trigger => nodeType.includes(trigger)
    );
  }

  // Verificar si es nodo de output
  isOutputNode(nodeType) {
    return this.positioningRules.functionalGroups.output.some(
      output => nodeType.includes(output)
    );
  }

  // Método para agregar reglas personalizadas
  addPositioningRule(nodeType, rule) {
    this.positioningRules.nodeTypes[nodeType] = rule;
  }

  // Obtener estadísticas de posicionamiento
  getPositioningStats() {
    return {
      nodeTypes: Object.keys(this.positioningRules.nodeTypes).length,
      functionalGroups: Object.keys(this.positioningRules.functionalGroups).length,
      layoutTemplates: Object.keys(this.layoutTemplates).length
    };
  }
}

// Exportar la clase como default para ES6 modules
export default IntelligentPositioningAgent;
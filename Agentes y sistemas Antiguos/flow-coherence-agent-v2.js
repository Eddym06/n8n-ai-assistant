// 🔧 FLOW COHERENCE AGENT V2.0 - EL ARQUITECTO LÓGICO
// Validador y corrector de coherencia de flujos de trabajo con análisis topológico

import { GoogleGenerativeAI } from '@google/generative-ai';
import GeminiCallTracker from './gemini-call-tracker.js';

export default class FlowCoherenceAgentV2 {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // Cache para análisis repetidos
    this.analysisCache = new Map();
    
    console.log('🔧 FlowCoherenceAgent v2.0 inicializado');
  }

  /**
   * MÉTODO PRINCIPAL - Procesa workflow usando análisis topológico
   */
  async processWorkflow(workflow, originalPrompt, topologyManifest = null) {
    console.log('🕵️ ACF 2.0: Iniciando procesamiento topológico...');
    
    // Usar manifiesto provisto o generar uno nuevo
    const manifest = topologyManifest || this.analyzeWorkflowTopology(workflow);
    
    let finalWorkflow = JSON.parse(JSON.stringify(workflow));
    let allChanges = [];
    let totalProblemsFixed = 0;

    console.log(`📊 Procesando ${manifest.subWorkflows.size} sub-flujo(s) independientes...`);

    // Procesar cada sub-flujo de forma aislada
    for (const [rootNodeName, subflowData] of manifest.subWorkflows.entries()) {
      console.log(`--- Procesando sub-flujo: ${rootNodeName} (${subflowData.nodeCount} nodos) ---`);
      
      // Crear workflow temporal para este sub-flujo
      const tempWorkflow = this.createTempWorkflow(subflowData.nodes, workflow.connections);
      
      // Detectar problemas específicos de este sub-flujo
      const problems = this.detectWorkflowProblems(tempWorkflow);
      
      if (problems.totalProblems > 0) {
        console.log(`🔍 Detectados ${problems.totalProblems} problemas en ${rootNodeName}`);
        
        // Usar prompt ultra-enfocado para este sub-flujo específico
        const contextualPrompt = this.generateContextualPrompt(
          subflowData, 
          originalPrompt, 
          manifest.complexity
        );
        
        try {
          // Obtener plan de corrección enfocado
          const plan = await this.getCorrectionPlan(tempWorkflow, problems, contextualPrompt);
          
          if (plan && plan.corrections && plan.corrections.length > 0) {
            console.log(`📋 Plan de corrección recibido: ${plan.corrections.length} acciones`);
            
            // Aplicar correcciones al workflow principal
            finalWorkflow = this.applyCorrections(finalWorkflow, plan);
            allChanges.push(...plan.corrections);
            totalProblemsFixed += problems.totalProblems;
            
            console.log(`✅ Sub-flujo ${rootNodeName} corregido exitosamente`);
          }
        } catch (error) {
          console.warn(`⚠️ Error procesando ${rootNodeName}:`, error.message);
        }
      } else {
        console.log(`✅ Sub-flujo ${rootNodeName} sin problemas detectados`);
      }
    }

    // Validación final inter-módulos
    const finalProblems = this.detectWorkflowProblems(finalWorkflow);
    
    console.log(`🎯 ACF 2.0 Completado:`);
    console.log(`   🔧 ${totalProblemsFixed} problemas corregidos`);
    console.log(`   📊 ${allChanges.length} cambios aplicados`);
    console.log(`   ⚠️ ${finalProblems.totalProblems} problemas remanentes`);

    return {
      workflow: finalWorkflow,
      corrected: allChanges.length > 0,
      changes: allChanges,
      problemsFixed: totalProblemsFixed,
      remainingProblems: finalProblems.totalProblems,
      manifest: manifest
    };
  }

  /**
   * Crea un workflow temporal para análisis aislado de sub-flujo
   */
  createTempWorkflow(nodes, allConnections) {
    const nodeNames = new Set(nodes.map(n => n.name));
    
    // Filtrar conexiones que pertenecen solo a estos nodos
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

    return {
      nodes: nodes,
      connections: filteredConnections
    };
  }

  /**
   * Genera prompt contextual para sub-flujo específico
   */
  generateContextualPrompt(subflowData, originalPrompt, complexity) {
    const moduleContext = this.getModuleContext(subflowData.modulePrefix);
    
    return `
CONTEXTO DEL SUB-FLUJO:
- Módulo: ${subflowData.modulePrefix} (${moduleContext})
- Nodos: ${subflowData.nodeCount}
- Patrón: ${subflowData.pattern}
- Complejidad general: ${complexity}

PROMPT ORIGINAL RELEVANTE:
${this.extractRelevantPromptSection(originalPrompt, subflowData.modulePrefix)}

ENFOQUE DE CORRECCIÓN:
${this.getCorrectionStrategy(subflowData.pattern, complexity)}
`;
  }

  /**
   * Obtiene contexto del módulo empresarial
   */
  getModuleContext(modulePrefix) {
    const contexts = {
      'HR': 'Recursos Humanos - Gestión de personal, onboarding, nómina',
      'SALES': 'Ventas - CRM, leads, oportunidades, seguimiento',
      'FIN': 'Financiero - Facturación, contabilidad, pagos, reportes',
      'OPS': 'Operaciones - Inventario, logística, producción, calidad',
      'SUP': 'Soporte - Tickets, helpdesk, atención al cliente',
      'INT': 'Integración - Consolidación, reportes, coordinación',
      'DEFAULT': 'Módulo general'
    };
    
    return contexts[modulePrefix] || contexts['DEFAULT'];
  }

  /**
   * Extrae sección relevante del prompt original
   */
  extractRelevantPromptSection(originalPrompt, modulePrefix) {
    if (!originalPrompt) return 'No disponible';
    
    const modulePatterns = {
      'HR': /MODULO DE RECURSOS HUMANOS.*?(?=MODULO|$)/s,
      'SALES': /MODULO DE VENTAS.*?(?=MODULO|$)/s,
      'FIN': /MODULO FINANCIERO.*?(?=MODULO|$)/s,
      'OPS': /MODULO DE OPERACIONES.*?(?=MODULO|$)/s,
      'SUP': /MODULO DE SOPORTE.*?(?=MODULO|$)/s,
      'INT': /MODULO DE INTEGRACION.*?(?=MODULO|$)/s
    };
    
    const pattern = modulePatterns[modulePrefix];
    if (pattern) {
      const match = originalPrompt.match(pattern);
      if (match) return match[0].trim();
    }
    
    return originalPrompt.slice(0, 200) + '...';
  }

  /**
   * Obtiene estrategia de corrección según patrón
   */
  getCorrectionStrategy(pattern, complexity) {
    const strategies = {
      'simple': 'Validación básica de conexiones lineales',
      'linear': 'Asegurar secuencia lógica y continuidad de flujo',
      'branching': 'Validar IFs, condiciones y rutas alternativas',
      'complex-branching': 'Análisis profundo de múltiples ramas y convergencias'
    };
    
    let strategy = strategies[pattern] || strategies['simple'];
    
    if (complexity === 'massive') {
      strategy += '. Enfoque de alta tolerancia para workflows masivos.';
    }
    
    return strategy;
  }

  /**
   * ANÁLISIS TOPOLÓGICO SIMPLIFICADO (para uso independiente)
   */
  analyzeWorkflowTopology(workflow) {
    const subWorkflows = new Map();
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return { subWorkflows, complexity: 'empty' };
    }

    // Construcción básica del grafo
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

    // Identificar raíces y construir sub-flujos
    const rootNodes = workflow.nodes.filter(node => 
      graph.get(node.name).parents.size === 0
    );

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
        pattern: subgraphNodes.size > 5 ? 'complex-branching' : 'linear',
        nodeCount: subgraphNodes.size
      });
    });

    const complexity = workflow.nodes.length > 50 ? 'massive' : 
                      workflow.nodes.length > 20 ? 'large' : 'medium';

    return { subWorkflows, complexity };
  }

  /**
   * PROMPT MEJORADO V2.0 - Ultra-enfocado y contextual
   */
  async getCorrectionPlan(workflow, problems, contextualPrompt) {
    // Registrar llamada en el tracker
    GeminiCallTracker.recordCall('FlowCoherenceAgent', 'getCorrectionPlan');

    const prompt = `
Eres un experto en automatización empresarial con n8n. Analiza este sub-flujo específico y corrige SOLO los problemas detectados.

${contextualPrompt}

WORKFLOW A ANALIZAR (SUB-FLUJO AISLADO):
${JSON.stringify(workflow, null, 2)}

PROBLEMAS DETECTADOS:
${JSON.stringify(problems, null, 2)}

REGLAS DE CORRECCIÓN V2.0:

🔗 NODOS IF:
- Todo IF debe tener al menos una salida 'main' y opcionalmente 'else'
- Validar condiciones realistas según el contexto del módulo
- Priorizar flujo positivo (main) sobre error (else)

🔀 NODOS MERGE:
- Usar cuando múltiples flujos deben converger
- Un Merge puede recibir múltiples entradas
- Debe tener una sola salida hacia el siguiente proceso

🔄 FLUJOS PARALELOS:
- Son válidos y esperados en workflows empresariales
- Múltiples webhooks independientes son normales
- No forzar conexiones entre módulos independientes

⚡ TOLERANCIA MASIVA:
- Para workflows >50 nodos, ser más permisivo
- Permitir arquitecturas modulares complejas
- Enfocarse solo en errores críticos de conectividad

RESPONDE SOLO EN FORMATO JSON:
{
  "corrections": [
    {
      "type": "connect_nodes",
      "source": "nombre_nodo_origen",
      "target": "nombre_nodo_destino",
      "outputType": "main",
      "reason": "explicación_breve"
    }
  ],
  "summary": "resumen_cambios_aplicados"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Limpiar respuesta y parsear JSON
      const cleanResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
      
    } catch (error) {
      console.error('❌ Error obteniendo plan de corrección:', error);
      return { corrections: [], summary: 'Error en generación de plan' };
    }
  }

  /**
   * Detecta problemas en un workflow
   */
  detectWorkflowProblems(workflow) {
    const problems = {
      orphanNodes: [],
      incompleteIFs: [],
      disconnectedNodes: [],
      totalProblems: 0
    };

    if (!workflow.nodes || workflow.nodes.length === 0) return problems;

    const nodeNames = new Set(workflow.nodes.map(n => n.name));
    const connectedNodes = new Set();
    
    // Analizar conexiones
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(sourceName => {
        const connections = workflow.connections[sourceName];
        if (connections.main) {
          connections.main.flat().forEach(conn => {
            if (nodeNames.has(conn.node)) {
              connectedNodes.add(conn.node);
            }
          });
        }
        if (connections.else) {
          connections.else.forEach(conn => {
            if (nodeNames.has(conn.node)) {
              connectedNodes.add(conn.node);
            }
          });
        }
      });
    }

    // Detectar huérfanos
    workflow.nodes.forEach(node => {
      const isRoot = !connectedNodes.has(node.name);
      const isTrigger = this.isTriggerNode(node.type);
      
      if (isRoot && !isTrigger) {
        problems.orphanNodes.push(node.name);
      }
      
      // Detectar IFs incompletos
      if (node.type?.includes('if')) {
        const nodeConnections = workflow.connections[node.name];
        if (!nodeConnections || !nodeConnections.main || nodeConnections.main.length === 0) {
          problems.incompleteIFs.push(node.name);
        }
      }
    });

    problems.totalProblems = problems.orphanNodes.length + 
                           problems.incompleteIFs.length + 
                           problems.disconnectedNodes.length;

    return problems;
  }

  /**
   * Aplica correcciones al workflow
   */
  applyCorrections(workflow, correctionPlan) {
    let modifiedWorkflow = JSON.parse(JSON.stringify(workflow));
    
    if (!correctionPlan.corrections) return modifiedWorkflow;

    correctionPlan.corrections.forEach(correction => {
      if (correction.type === 'connect_nodes') {
        this.connectNodes(
          modifiedWorkflow, 
          correction.source, 
          correction.target, 
          correction.outputType || 'main'
        );
      }
    });

    return modifiedWorkflow;
  }

  /**
   * Conecta dos nodos en el workflow
   */
  connectNodes(workflow, sourceName, targetName, outputType = 'main') {
    if (!workflow.connections) {
      workflow.connections = {};
    }

    if (!workflow.connections[sourceName]) {
      workflow.connections[sourceName] = {};
    }

    if (outputType === 'main') {
      if (!workflow.connections[sourceName].main) {
        workflow.connections[sourceName].main = [[]];
      }
      
      // Evitar duplicados
      const existingConnection = workflow.connections[sourceName].main[0].find(
        conn => conn.node === targetName
      );
      
      if (!existingConnection) {
        workflow.connections[sourceName].main[0].push({
          node: targetName,
          type: 'main',
          index: 0
        });
      }
    } else if (outputType === 'else') {
      if (!workflow.connections[sourceName].else) {
        workflow.connections[sourceName].else = [];
      }
      
      const existingConnection = workflow.connections[sourceName].else.find(
        conn => conn.node === targetName
      );
      
      if (!existingConnection) {
        workflow.connections[sourceName].else.push({
          node: targetName,
          type: 'main',
          index: 0
        });
      }
    }
  }

  /**
   * Verifica si un tipo de nodo es un trigger
   */
  isTriggerNode(nodeType) {
    const type = (nodeType || '').toLowerCase();
    return type.includes('trigger') || 
           type.includes('webhook') || 
           type.includes('cron') ||
           type.includes('manual');
  }

  /**
   * Detecta nodos huérfanos (compatibilidad con versión anterior)
   */
  detectOrphanNodes(workflow) {
    const problems = this.detectWorkflowProblems(workflow);
    return problems.orphanNodes;
  }
}

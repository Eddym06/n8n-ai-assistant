/**
 * AGENTE DE COHERENCIA DE FLUJO (ACF) - VERSIÓN 3.1 "EL ARQUITECTO"
 * ==================================================
 *
 * Responsabilidades:
 * 1. Identificar y aislar sub-flujos (clusters) basados en la semántica del negocio.
 * 2. Aplicar heurísticas arquitecturales inteligentes (anclajes lógicos).
 * 3. Limpiar conexiones inter-cluster para asegurar independencia.
 * 4. Analizar y corregir cada sub-flujo de forma independiente.
 * 5. Consultar a Gemini con un contexto reducido y enfocado para obtener planes de reparación más precisos.
 * 6. Ejecutar comandos de reparación de forma segura y validada.
 * 7. Consolidar puntos finales al merge central correspondiente.
 * 8. Orquestar la reparación completa del workflow.
 *
 * Versión: 3.1.0 "EL ARQUITECTO"
 * Mejoras V3.1:
 * - Heurísticas de anclaje lógico (triggers → acciones, acciones → IFs, IFs → rechazos)
 * - Limpieza automática de conexiones inter-cluster
 * - Prompts arquitecturales directivos para la IA
 * - Consolidación automática a nodos merge centrales
 * - Configuración automática de .env para API keys
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Configurar variables de entorno desde .env
dotenv.config();
import GeminiCallTracker from './gemini-call-tracker.js';

export default class FlowCoherenceAgentV3 {
  constructor(apiKey = null) {
    // Usar la API key pasada como parámetro, o la del .env como fallback
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('❌ GEMINI_API_KEY no configurada. Asegúrate de tener un archivo .env con GEMINI_API_KEY o pasa la API key como parámetro.');
    }
    
    console.log('🔑 ACF V3.1 inicializado con API key desde:', apiKey ? 'parámetro' : '.env');
    console.log('🔑 API Key válida:', this.apiKey.startsWith('AIza') ? '✅' : '❌');
    
    this.model = null;
    this.debugMode = true;
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
   * Inicializa el modelo de Gemini
   */
  async initializeModel() {
    if (!this.model) {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  // --- NUEVOS MÉTODOS DE CLUSTERING V3.0 ---

  /**
   * [NUEVO] Identifica sub-flujos lógicos (clusters) basados en prefijos de nombres.
   * Esta es la implementación central de la estrategia "Divide y Vencerás".
   * @param {Array<object>} nodes - La lista completa de nodos del workflow.
   * @returns {object} - Un objeto donde cada clave es un prefijo (ej. "RH") y el valor es un array de nodos.
   */
  clusterWorkflowByPrefix(nodes) {
    if (!nodes) return {};

    const clusters = {};
    const unclassifiedKey = 'Unclassified';

    nodes.forEach(node => {
      const parts = node.name.split('_');
      // Si el nombre tiene un prefijo (ej. "RH_Webhook"), lo usamos. Si no, va a "Unclassified".
      const key = parts.length > 1 ? parts[0] : unclassifiedKey;

      if (!clusters[key]) {
        clusters[key] = [];
      }
      clusters[key].push(node);
    });

    // Validación: Un clúster debe tener al menos un trigger para ser válido
    Object.keys(clusters).forEach(key => {
      const hasTrigger = clusters[key].some(node => this.isTriggerNode(node.type));
      if (!hasTrigger && key !== 'Unclassified') {
        if (this.debugMode) {
          console.warn(`⚠️ Clúster [${key}] no tiene triggers. Puede necesitar atención especial.`);
        }
      }
    });

    if (this.debugMode) {
      console.log('🏛️ Workflow clusterizado. Sub-flujos identificados:');
      Object.keys(clusters).forEach(key => {
        console.log(`  - ${key}: ${clusters[key].length} nodos`);
      });
    }

    return clusters;
  }

  /**
   * [NUEVO] Crea un objeto de workflow temporal para un clúster específico.
   * Esto es esencial para enviar un contexto limpio y enfocado a Gemini.
   * @param {Array<object>} clusterNodes - Nodos pertenecientes a un único clúster.
   * @param {object} allConnections - El objeto de conexiones completo del workflow original.
   * @returns {object} - Un objeto de workflow que solo contiene los nodos y conexiones del clúster.
   */
  _createSubWorkflow(clusterNodes, allConnections) {
    const subWorkflow = {
      nodes: clusterNodes,
      connections: {}
    };
    const nodeNamesInCluster = new Set(clusterNodes.map(n => n.name));

    // Iteramos sobre las conexiones del clúster para reconstruir el objeto de conexiones.
    clusterNodes.forEach(sourceNode => {
      const sourceName = sourceNode.name;
      // Si el nodo original tenía conexiones de salida, las filtramos.
      if (allConnections[sourceName]) {
        const originalSourceConnections = allConnections[sourceName];
        const newSourceConnections = { main: [] };

        if (originalSourceConnections.main) {
          originalSourceConnections.main.forEach(outputGroup => {
            // Filtramos para mantener solo las conexiones que apuntan a otro nodo DENTRO del mismo clúster.
            const filteredGroup = outputGroup.filter(conn => nodeNamesInCluster.has(conn.node));
            newSourceConnections.main.push(filteredGroup);
          });
        }
        // (Opcional) Se podría hacer lo mismo para las conexiones de error si se usan.
        if (originalSourceConnections.error) {
          newSourceConnections.error = [];
          originalSourceConnections.error.forEach(outputGroup => {
            const filteredGroup = outputGroup.filter(conn => nodeNamesInCluster.has(conn.node));
            newSourceConnections.error.push(filteredGroup);
          });
        }

        // Solo añadimos la entrada si tiene conexiones válidas dentro del clúster.
        if (newSourceConnections.main.some(group => group.length > 0) || 
            (newSourceConnections.error && newSourceConnections.error.some(group => group.length > 0))) {
            subWorkflow.connections[sourceName] = newSourceConnections;
        }
      }
    });

    return subWorkflow;
  }

  /**
   * NUEVA FUNCIÓN: Establecer puntos de anclaje lógicos heurísticamente
   * Esta función implementa la lógica de "Arquitecto" para crear conexiones básicas inteligentes
   * ANTES de consultar con la IA, estableciendo una estructura sólida.
   */
  _establishLogicalAnchors(subWorkflow, clusterPrefix) {
    const nodes = subWorkflow.nodes;
    const connections = subWorkflow.connections;
    let anchorChanges = 0;

    console.log(`🔧 ESTABLECIENDO ANCLAJES para clúster: ${clusterPrefix}`);

    // 1. ANCLAJE DE INICIO: Conectar trigger con primer nodo de acción
    const triggerNode = nodes.find(n => 
      n.type === 'n8n-nodes-base.webhook' || 
      n.type === 'n8n-nodes-base.manualTrigger' ||
      n.name.toLowerCase().includes('webhook') ||
      n.name.toLowerCase().includes('trigger')
    );

    if (triggerNode) {
      // Buscar primer nodo de acción lógico (validación, procesamiento, etc.)
      const actionNode = nodes.find(n => 
        n.name !== triggerNode.name && (
          n.name.toLowerCase().includes('validacion') ||
          n.name.toLowerCase().includes('verificacion') ||
          n.name.toLowerCase().includes('scoring') ||
          n.name.toLowerCase().includes('clasificacion') ||
          n.name.toLowerCase().includes('analisis')
        )
      );

      if (actionNode && !connections[triggerNode.name]) {
        connections[triggerNode.name] = {
          main: [[{ node: actionNode.name, type: "main", index: 0 }]]
        };
        anchorChanges++;
        console.log(`✅ ANCLAJE INICIO: ${triggerNode.name} → ${actionNode.name}`);
      }
    }

    // 2. ANCLAJE DE DECISIÓN: Conectar nodos de acción con sus IFs correspondientes
    const ifNodes = nodes.filter(n => 
      n.type === 'n8n-nodes-base.if' || 
      n.name.toLowerCase().includes(' if ') ||
      n.name.toLowerCase().includes('_if_')
    );

    ifNodes.forEach(ifNode => {
      // Buscar el nodo de acción relacionado basándose en palabras clave comunes
      const ifBaseName = ifNode.name.toLowerCase()
        .replace(clusterPrefix.toLowerCase() + '_', '')
        .replace(' if', '')
        .replace('_if_', '_')
        .replace('_', ' ');

      const relatedActionNode = nodes.find(n => 
        n.name !== ifNode.name && 
        n.type !== 'n8n-nodes-base.if' &&
        (ifBaseName.split(' ').some(keyword => 
          keyword.length > 3 && n.name.toLowerCase().includes(keyword)
        ))
      );

      if (relatedActionNode) {
        // Conectar acción → IF
        if (!connections[relatedActionNode.name]) {
          connections[relatedActionNode.name] = {
            main: [[{ node: ifNode.name, type: "main", index: 0 }]]
          };
          anchorChanges++;
          console.log(`✅ ANCLAJE DECISIÓN: ${relatedActionNode.name} → ${ifNode.name}`);
        }

        // Conectar rama FALSE del IF a nodo de rechazo/error
        const rejectionNode = nodes.find(n => 
          n.name !== ifNode.name && 
          n.name !== relatedActionNode.name && (
            n.name.toLowerCase().includes('notificar') ||
            n.name.toLowerCase().includes('rechazo') ||
            n.name.toLowerCase().includes('invalido') ||
            n.name.toLowerCase().includes('error') ||
            n.name.toLowerCase().includes('rechazar')
          )
        );

        if (rejectionNode && (!connections[ifNode.name] || !connections[ifNode.name].main)) {
          connections[ifNode.name] = {
            main: [
              [{ node: rejectionNode.name, type: "main", index: 0 }], // FALSE
              [] // TRUE - se llenará después con IA
            ]
          };
          anchorChanges++;
          console.log(`✅ ANCLAJE RECHAZO: ${ifNode.name} [FALSE] → ${rejectionNode.name}`);
        }
      }
    });

    console.log(`🔧 ANCLAJES ESTABLECIDOS: ${anchorChanges} conexiones creadas`);
    return anchorChanges;
  }

  /**
   * NUEVA FUNCIÓN: Limpiar conexiones inter-cluster 
   * Elimina conexiones que violan la independencia de los clusters
   */
  _cleanInterClusterConnections(subWorkflow, allTriggerNodes, clusterPrefix) {
    let cleanedCount = 0;
    const connections = subWorkflow.connections;
    const clusterNodeNames = new Set(subWorkflow.nodes.map(n => n.name));

    console.log(`🧹 LIMPIANDO conexiones inter-cluster para: ${clusterPrefix}`);

    // Eliminar conexiones que vengan de triggers de otros clusters hacia este cluster
    Object.keys(connections).forEach(nodeName => {
      if (connections[nodeName] && connections[nodeName].main) {
        connections[nodeName].main.forEach((connectionArray, index) => {
          if (connectionArray) {
            const originalLength = connectionArray.length;
            connections[nodeName].main[index] = connectionArray.filter(conn => {
              // Verificar si la conexión apunta a un nodo de otro cluster (especialmente triggers)
              const isPointingToOtherClusterTrigger = allTriggerNodes.some(trigger => 
                trigger.name === conn.node && 
                !clusterNodeNames.has(trigger.name)
              );
              
              if (isPointingToOtherClusterTrigger) {
                cleanedCount++;
                console.log(`🧹 ELIMINADA: ${nodeName} → ${conn.node} (conexión inter-cluster)`);
                return false;
              }
              return true;
            });
          }
        });
      }
    });

    console.log(`🧹 LIMPIEZA COMPLETADA: ${cleanedCount} conexiones inter-cluster eliminadas`);
    return cleanedCount;
  }

  /**
   * NUEVA FUNCIÓN: Consolidar puntos finales al merge central
   * Conecta nodos sin salida al nodo merge central correspondiente
   */
  _consolidateToMerge(subWorkflow, clusterPrefix) {
    const connections = subWorkflow.connections;
    const nodes = subWorkflow.nodes;
    let mergeConnections = 0;

    // Buscar el nodo merge central correspondiente a este cluster
    const mergeNodeName = `Central_Merge ${clusterPrefix}`;
    const mergeNode = nodes.find(n => n.name === mergeNodeName);
    
    if (!mergeNode) {
      console.log(`⚠️  No se encontró nodo merge para: ${clusterPrefix}`);
      return 0;
    }

    // Encontrar todos los nodos sin salida (callejones sin salida)
    const nodesWithoutOutput = nodes.filter(node => {
      return !connections[node.name] || 
             !connections[node.name].main || 
             connections[node.name].main.every(group => group.length === 0);
    });

    // Conectar callejones sin salida al merge central
    nodesWithoutOutput.forEach(node => {
      if (node.name !== mergeNodeName) {
        connections[node.name] = {
          main: [[{ node: mergeNodeName, type: "main", index: 0 }]]
        };
        mergeConnections++;
        console.log(`🔗 CONSOLIDADO: ${node.name} → ${mergeNodeName}`);
      }
    });

    console.log(`🔗 CONSOLIDACIÓN: ${mergeConnections} nodos conectados a merge central`);
    return mergeConnections;
  }

  /**
   * Detecta nodos huérfanos en un workflow.
   * Un nodo es huérfano si no es un trigger y no tiene conexiones de entrada.
   * También detecta nodos "callejones sin salida" que no son nodos finales lógicos.
   * @param {object} workflow - El objeto del workflow a analizar.
   * @returns {Array<string>} - Un array con los nombres de los nodos huérfanos.
   */
  detectOrphanNodes(workflow) {
    if (!workflow.nodes || !workflow.connections) {
      return [];
    }

    const nodeNames = new Set(Object.keys(workflow.nodes));
    const nodesWithInput = new Set();
    const nodesWithOutput = new Set(Object.keys(workflow.connections));

    // Mapear todos los nodos que tienen conexiones de entrada
    Object.values(workflow.connections).forEach(source => {
      if (source.main) {
        source.main.forEach(group => {
          if (Array.isArray(group)) {
            group.forEach(connection => nodesWithInput.add(connection.node));
          }
        });
      }
      if (source.error) {
        source.error.forEach(group => {
          if (Array.isArray(group)) {
            group.forEach(connection => nodesWithInput.add(connection.node));
          }
        });
      }
    });

    const orphanNodes = Object.entries(workflow.nodes).filter(([nodeId, node]) => {
      const nodeType = (node.type || '').toLowerCase();
      const isTrigger = nodeType.includes('trigger') || 
                       nodeType.includes('webhook') || 
                       nodeType.includes('cron') ||
                       nodeType.includes('manual');
      const hasInput = nodesWithInput.has(nodeId);
      
      // Es un huérfano si no es un trigger y no tiene ninguna entrada
      if (!isTrigger && !hasInput) {
        return true;
      }

      // También es problemático si es un nodo de lógica (IF/Merge) y no tiene salida
      const isLogicNode = nodeType.includes('.if') || 
                         nodeType.includes('.switch') || 
                         nodeType.includes('.merge');
      const hasOutput = nodesWithOutput.has(nodeId);
      if (isLogicNode && !hasOutput) {
        return true;
      }

      return false;
    }).map(([nodeId, node]) => nodeId);

    if (this.debugMode && orphanNodes.length > 0) {
      console.log('🔍 Nodos huérfanos detectados:', orphanNodes);
    }

    return orphanNodes;
  }

  /**
   * Detecta problemas adicionales en el workflow
   * @param {object} workflow - El objeto del workflow a analizar
   * @returns {object} - Objeto con diferentes tipos de problemas detectados
   */
  detectWorkflowProblems(workflow) {
    const orphanNodes = this.detectOrphanNodes(workflow);
    const deadEnds = this.detectDeadEndNodes(workflow);
    const incompleteIFs = this.detectIncompleteIFs(workflow);
    const unnecessaryMerges = this.detectUnnecessaryMerges(workflow);

    return {
      orphanNodes,
      deadEnds,
      incompleteIFs,
      unnecessaryMerges,
      totalProblems: orphanNodes.length + deadEnds.length + incompleteIFs.length + unnecessaryMerges.length
    };
  }

  /**
   * Detecta nodos que son callejones sin salida
   */
  detectDeadEndNodes(workflow) {
    if (!workflow.nodes || !workflow.connections) {
      return [];
    }

    const nodesWithOutput = new Set(Object.keys(workflow.connections));
    const finalNodeTypes = ['telegram', 'slack', 'gmail', 'webhook', 'email', 'notification'];

    const deadEndNodes = Object.entries(workflow.nodes).filter(([nodeId, node]) => {
      const nodeType = (node.type || '').toLowerCase();
      const hasOutput = nodesWithOutput.has(nodeId);
      const isFinalNode = finalNodeTypes.some(type => nodeType.includes(type));

      // Es un callejón sin salida si no tiene salida y no es un nodo final lógico
      return !hasOutput && !isFinalNode;
    });

    return deadEndNodes.map(([nodeId, node]) => nodeId);
  }

  /**
   * Detecta nodos IF con configuración incompleta
   */
  detectIncompleteIFs(workflow) {
    if (!workflow.nodes) {
      return [];
    }

    const incompleteIFs = Object.entries(workflow.nodes).filter(([nodeId, node]) => {
      const nodeType = (node.type || '').toLowerCase();
      
      if (nodeType.includes('.if')) {
        const params = node.parameters || {};
        
        // Verificar si tiene condiciones configuradas
        if (!params.conditions || 
            !params.conditions.conditions || 
            !Array.isArray(params.conditions.conditions) ||
            params.conditions.conditions.length === 0) {
          return true;
        }

        // Verificar si las condiciones están completas
        const hasIncompleteCondition = params.conditions.conditions.some(condition => {
          return !condition.field || !condition.operation;
        });

        return hasIncompleteCondition;
      }

      return false;
    });

    return incompleteIFs.map(([nodeId, node]) => nodeId);
  }

  /**
   * Detecta nodos Merge innecesarios o mal configurados
   */
  detectUnnecessaryMerges(workflow) {
    if (!workflow.nodes || !workflow.connections) {
      return [];
    }

    const unnecessaryMerges = Object.entries(workflow.nodes).filter(([nodeId, node]) => {
      const nodeType = (node.type || '').toLowerCase();
      
      if (nodeType.includes('.merge')) {
        // Contar cuántas conexiones de entrada tiene este merge
        let inputConnections = 0;
        
        Object.values(workflow.connections).forEach(source => {
          if (source.main) {
            source.main.forEach(group => {
              if (Array.isArray(group)) {
                group.forEach(connection => {
                  if (connection.node === nodeId) {
                    inputConnections++;
                  }
                });
              }
            });
          }
        });

        // Es innecesario si tiene menos de 2 conexiones de entrada
        return inputConnections < 2;
      }

      return false;
    });

    return unnecessaryMerges.map(([nodeId, node]) => nodeId);
  }

  /**
   * [MODIFICADO V3.0] Obtiene un plan de corrección de Gemini con contexto de clúster.
   * @param {object} subWorkflow - El workflow del clúster con problemas.
   * @param {object} problems - Problemas detectados DENTRO del clúster.
   * @param {string} originalPrompt - El prompt original del usuario (contexto global).
   * @param {string} clusterName - El nombre del clúster (ej. "RH", "Ventas").
   * @returns {object} - Plan de corrección estructurado.
   */
  async getCorrectionPlan(subWorkflow, problems, originalPrompt, clusterName = 'General') {
    await this.initializeModel();

    // Manejar tanto array de strings como objeto de problemas (retrocompatibilidad V2.0)
    if (Array.isArray(problems)) {
      problems = {
        orphanNodes: problems,
        deadEnds: [],
        incompleteIFs: [],
        unnecessaryMerges: []
      };
    } else {
      problems = problems || {
        orphanNodes: [],
        deadEnds: [],
        incompleteIFs: [],
        unnecessaryMerges: []
      };
    }

    // El prompt ahora es mucho más inteligente. Le dice a la IA en qué sub-flujo específico está trabajando.
    const prompt = `[ROL]
Eres un arquitecto experto de n8n. Tu tarea es reparar un sub-flujo de trabajo específico que forma parte de un sistema más grande. Debes enfocarte ÚNICAMENTE en hacer que este sub-flujo sea lógicamente coherente.

[CONTEXTO GLOBAL DEL USUARIO]
"${originalPrompt}"

[CONTEXTO DEL SUB-FLUJO ACTUAL]
Estás trabajando en el módulo de "${clusterName}". Todos los nodos proporcionados pertenecen a este módulo. Tu objetivo es conectarlos para que cumplan su función dentro de este dominio. NO intentes conectar nodos a otros módulos.

[SUB-FLUJO DEFECTUOSO (${clusterName})]
\`\`\`json
${JSON.stringify(subWorkflow, null, 2)}
\`\`\`

[PROBLEMAS DETECTADOS EN ESTE SUB-FLUJO]
- Nodos huérfanos: ${problems.orphanNodes.join(', ') || 'ninguno'}
- Callejones sin salida: ${problems.deadEnds.join(', ') || 'ninguno'}
- IFs incompletos: ${problems.incompleteIFs.join(', ') || 'ninguno'}
- Merges innecesarios: ${problems.unnecessaryMerges.join(', ') || 'ninguno'}

[REGLAS ESPECÍFICAS PARA NODOS IF Y MERGE]

**🔀 NODOS IF (Condicionales) - Guía Completa:**
1. **Cuándo usar IF:**
   - Para decisiones binarias basadas en datos (true/false)
   - Validación de condiciones (ej: email válido, stock disponible)
   - Bifurcación de flujos según criterios específicos
   
2. **Configuración de IF:**
   - SIEMPRE configurar conditions.boolean, conditions.number, o conditions.string
   - Usar {{ $json.campo }} para referencias a datos
   - Operaciones válidas: equal, notEqual, larger, smaller, contains, isEmpty, isNotEmpty
   
3. **Conexiones de IF:**
   - outputIndex: 0 = Rama TRUE (condición cumplida)
   - outputIndex: 1 = Rama FALSE (condición no cumplida)
   - AMBAS ramas deben conectarse a nodos lógicos
   - Si no hay nodo para FALSE, conectar a notificación de error/log

**🔄 NODOS MERGE - Guía Completa:**
1. **Cuándo usar MERGE:**
   - Para reunir datos de múltiples ramas paralelas
   - Después de bifurcaciones IF/Switch que necesitan reconverger
   - Para combinar resultados de diferentes APIs/procesos
   - NUNCA uses Merge si solo tienes una entrada
   
2. **Configuración de MERGE:**
   - mode: "mergeByIndex" (más común), "mergeByKey", "append"

[TAREA]
Genera un plan de reparación JSON para conectar y configurar los nodos DENTRO de este sub-flujo de "${clusterName}". Sigue las reglas de acción (CONNECT_NODES, REMOVE_NODE, UPDATE_PARAMETERS). Prioriza una secuencia lógica que comience en un nodo trigger (como un Webhook) y fluya a través de las operaciones hasta llegar a nodos finales (como emails o actualizaciones de DB).

[EJEMPLO DE SALIDA ESPERADA]
{
  "corrections": [
    {
      "action": "CONNECT_NODES",
      "source": "${clusterName}_Nodo_A",
      "target": "${clusterName}_Nodo_B",
      "reason": "Conexión lógica dentro del flujo de ${clusterName}."
    }
  ]
}

[INSTRUCCIONES FINALES]
- Devuelve SOLO el objeto JSON con el array \`corrections\`. No incluyas nada más en tu respuesta.`;

    try {
      // Registrar llamada en el tracker global
      const promptLength = prompt.length;
      GeminiCallTracker.recordCall('FlowCoherenceAgentV3', 'generateContent', promptLength, 'gemini-1.5-flash');
      
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      if (this.debugMode) {
        console.log(`🤖 Respuesta del Arquitecto para el clúster [${clusterName}]:`, responseText.slice(0, 300) + '...');
      }

      // Extraer JSON de la respuesta
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      
      throw new Error(`No se pudo extraer un plan JSON válido para el clúster ${clusterName}`);
    } catch (error) {
      console.error(`❌ Error obteniendo plan de corrección para [${clusterName}]:`, error.message);
      return { corrections: [] }; // Devolver un plan vacío en caso de error para no detener todo el proceso.
    }
  }

  /**
   * Aplica un plan de corrección generado por la IA a un objeto de workflow.
   * Actúa como un "Ingeniero" que ejecuta instrucciones de manera segura.
   * @param {object} workflow - El objeto del workflow a modificar.
   * @param {object} correctionPlan - El plan con el array de comandos de la IA.
   * @returns {object} - El workflow modificado.
   */
  applyCorrections(workflow, correctionPlan) {
    if (!correctionPlan || !correctionPlan.corrections || !Array.isArray(correctionPlan.corrections)) {
      console.warn("⚠️ Plan de corrección inválido o vacío. No se aplicarán cambios.");
      return workflow;
    }

    // Crear un mapa para acceder a los nodos por su nombre rápidamente
    const nodeMap = new Map(workflow.nodes.map(node => [node.name, node]));
    let nodesToRemove = new Set();

    if (this.debugMode) {
      console.log(`🔧 Aplicando ${correctionPlan.corrections.length} correcciones...`);
    }

    // Iterar sobre cada instrucción del plan de la IA
    correctionPlan.corrections.forEach((cmd, index) => {
      if (this.debugMode) {
        console.log(`🔧 [${index + 1}] Ejecutando comando: ${cmd.action} - Razón: ${cmd.reason}`);
      }

      switch (cmd.action) {
        case 'CONNECT_NODES':
          this.executeConnectNodes(workflow, cmd, nodeMap);
          break;

        case 'REMOVE_NODE':
          this.executeRemoveNode(workflow, cmd, nodeMap, nodesToRemove);
          break;

        case 'UPDATE_PARAMETERS':
          this.executeUpdateParameters(workflow, cmd, nodeMap);
          break;
        
        default:
          console.warn(`   ⚠️ Comando desconocido de la IA ignorado: "${cmd.action}"`);
      }
    });

    // Eliminar los nodos marcados del array de nodos al final
    if (nodesToRemove.size > 0) {
      workflow.nodes = workflow.nodes.filter(node => !nodesToRemove.has(node.name));
      if (this.debugMode) {
        console.log(`   🗑️ ${nodesToRemove.size} nodo(s) eliminados permanentemente.`);
      }
    }

    return workflow;
  }

  /**
   * Ejecuta el comando CONNECT_NODES
   */
  executeConnectNodes(workflow, cmd, nodeMap) {
    // Validar que ambos nodos existen antes de intentar conectar
    if (nodeMap.has(cmd.source) && nodeMap.has(cmd.target)) {
      // Determinar el índice de salida (default 0, o específico para nodos IF)
      const outputIndex = cmd.outputIndex || 0;
      
      // Asegurar que la estructura de conexión existe
      if (!workflow.connections[cmd.source]) {
        workflow.connections[cmd.source] = { main: [] };
      }
      if (!workflow.connections[cmd.source].main) {
        workflow.connections[cmd.source].main = [];
      }
      
      // Asegurar que el array de salida específico existe
      while (workflow.connections[cmd.source].main.length <= outputIndex) {
        workflow.connections[cmd.source].main.push([]);
      }
      
      if (!workflow.connections[cmd.source].main[outputIndex]) {
        workflow.connections[cmd.source].main[outputIndex] = [];
      }

      // Evitar agregar conexiones duplicadas en el mismo outputIndex
      const alreadyExists = workflow.connections[cmd.source].main[outputIndex]
        .some(conn => conn.node === cmd.target);

      if (!alreadyExists) {
        workflow.connections[cmd.source].main[outputIndex].push({
          node: cmd.target,
          type: 'main',
          index: 0
        });
        if (this.debugMode) {
          const branchInfo = outputIndex === 1 ? ' (rama FALSE)' : outputIndex === 0 ? ' (rama TRUE)' : '';
          console.log(`   ✅ Conectado: "${cmd.source}" -> "${cmd.target}"${branchInfo}`);
        }
      } else {
        if (this.debugMode) {
          console.log(`   ⏭️ Omitido: La conexión "${cmd.source}" -> "${cmd.target}" ya existe.`);
        }
      }
    } else {
      console.warn(`   ⚠️ No se pudo conectar: Nodo "${cmd.source}" o "${cmd.target}" no encontrado.`);
    }
  }

  /**
   * Ejecuta el comando REMOVE_NODE
   */
  executeRemoveNode(workflow, cmd, nodeMap, nodesToRemove) {
    if (nodeMap.has(cmd.node)) {
      // Marcar el nodo para ser eliminado
      nodesToRemove.add(cmd.node);

      // Eliminar cualquier conexión que APUNTE a este nodo
      for (const sourceName in workflow.connections) {
        const source = workflow.connections[sourceName];
        if (source.main) {
          source.main.forEach((group, i) => {
            if (Array.isArray(group)) {
              source.main[i] = group.filter(conn => conn.node !== cmd.node);
            }
          });
        }
        if (source.error) {
          source.error.forEach((group, i) => {
            if (Array.isArray(group)) {
              source.error[i] = group.filter(conn => conn.node !== cmd.node);
            }
          });
        }
      }

      // Eliminar conexiones que PARTAN de este nodo
      delete workflow.connections[cmd.node];
      
      if (this.debugMode) {
        console.log(`   ✅ Nodo "${cmd.node}" y sus conexiones marcados para eliminación.`);
      }
    } else {
      console.warn(`   ⚠️ No se pudo eliminar: Nodo "${cmd.node}" no encontrado.`);
    }
  }

  /**
   * Ejecuta el comando UPDATE_PARAMETERS
   */
  executeUpdateParameters(workflow, cmd, nodeMap) {
    if (nodeMap.has(cmd.node) && cmd.parameters) {
      const nodeToUpdate = nodeMap.get(cmd.node);
      
      // Asegurar que el nodo tiene una estructura de parámetros
      if (!nodeToUpdate.parameters) {
        nodeToUpdate.parameters = {};
      }

      // Fusionar los nuevos parámetros con los existentes
      Object.assign(nodeToUpdate.parameters, cmd.parameters);
      
      if (this.debugMode) {
        console.log(`   ✅ Parámetros actualizados para el nodo "${cmd.node}".`);
      }
    } else {
      console.warn(`   ⚠️ No se pudo actualizar: Nodo "${cmd.node}" no encontrado o parámetros no proporcionados.`);
    }
  }

  /**
   * [MODIFICADO V3.0 - ORQUESTADOR PRINCIPAL]
   * Detecta y corrige problemas aplicando una estrategia de clustering.
   * @param {object} workflow - El workflow COMPLETO a analizar y corregir.
   * @param {string} originalPrompt - El prompt original del usuario.
   * @returns {object} - El workflow corregido y un reporte de cambios.
   */
  async processWorkflow(workflow, originalPrompt) {
    console.log('🏗️ Ejecutando Agente de Coherencia de Flujo V3.1 "EL ARQUITECTO"...');

    // Identificar todos los triggers para la limpieza posterior
    const allTriggerNodes = workflow.nodes.filter(n => 
      n.type === 'n8n-nodes-base.webhook' || 
      n.type === 'n8n-nodes-base.manualTrigger' ||
      n.name.toLowerCase().includes('webhook') ||
      n.name.toLowerCase().includes('trigger')
    );

    // 1. CLUSTERIZACIÓN: Dividir el workflow en sub-flujos manejables.
    const clusters = this.clusterWorkflowByPrefix(workflow.nodes);
    const allChanges = [];
    let corrected = false;
    let totalArchitecturalChanges = 0;
    
    // 2. PROCESAMIENTO ARQUITECTURAL POR CLÚSTER
    for (const clusterName in clusters) {
      console.log(`\n🏗️ === ARQUITECTURA DE CLÚSTER: [${clusterName}] ===`);
      const clusterNodes = clusters[clusterName];
      
      // PASO 1: AISLAR - Crear subworkflow temporal
      const subWorkflow = this._createSubWorkflow(clusterNodes, workflow.connections);
      
      // PASO 2: LIMPIAR - Eliminar conexiones inter-cluster
      const cleanedConnections = this._cleanInterClusterConnections(subWorkflow, allTriggerNodes, clusterName);
      totalArchitecturalChanges += cleanedConnections;
      
      // PASO 3: ANCLAR - Establecer puntos de anclaje heurísticos
      const anchorChanges = this._establishLogicalAnchors(subWorkflow, clusterName);
      totalArchitecturalChanges += anchorChanges;
      
      // PASO 4: DETECTAR problemas RESTANTES después de las heurísticas
      const problems = this.detectWorkflowProblems(subWorkflow);
      
      if (problems.totalProblems === 0) {
        console.log(`✅ Clúster [${clusterName}] arquitectónicamente correcto.`);
        // Aplicar cambios de vuelta al workflow principal
        this._mergeSubWorkflowBack(workflow, subWorkflow, clusterName);
        continue;
      }

      console.log(`🤖 Clúster [${clusterName}] necesita IA: ${problems.totalProblems} problemas restantes...`);
      
      // PASO 5: DELEGAR - Consultar IA con contexto arquitectural
      const correctionPlan = await this._getArchitecturalCorrectionPlan(subWorkflow, problems, originalPrompt, clusterName);
      
      if (correctionPlan.corrections && correctionPlan.corrections.length > 0) {
        // PASO 6: APLICAR correcciones de IA al subworkflow
        const correctedSubWorkflow = this.applyCorrections(subWorkflow, correctionPlan);
        
        // PASO 7: CONSOLIDAR - Conectar puntos finales al merge central
        const mergeConnections = this._consolidateToMerge(correctedSubWorkflow, clusterName);
        totalArchitecturalChanges += mergeConnections;
        
        // Aplicar cambios de vuelta al workflow principal
        this._mergeSubWorkflowBack(workflow, correctedSubWorkflow, clusterName);
        
        // Etiquetar las correcciones con el clúster de origen
        const taggedCorrections = correctionPlan.corrections.map(correction => ({
          ...correction,
          cluster: clusterName,
          architectural: true
        }));
        
        allChanges.push(...taggedCorrections);
        corrected = true;
      } else {
        console.log(`ℹ️ Clúster [${clusterName}] - IA no propuso cambios adicionales.`);
        // Aún aplicar cambios heurísticos
        this._mergeSubWorkflowBack(workflow, subWorkflow, clusterName);
      }
    }
    
    console.log(`\n🏗️ ARQUITECTURA COMPLETADA:`);
    console.log(`  📊 Cambios Arquitecturales: ${totalArchitecturalChanges}`);
    console.log(`  🤖 Correcciones de IA: ${allChanges.length}`);
    
    if (corrected || totalArchitecturalChanges > 0) {
        console.log('\n✅ Workflow reconstituido exitosamente por el ARQUITECTO V3.1.');
    } else {
        console.log('\n✅ El workflow ya tenía arquitectura sólida.');
    }

    // Devolver resultado completo con métricas arquitecturales
    return {
      workflow,
      corrected: corrected || totalArchitecturalChanges > 0,
      changes: allChanges,
      architecturalChanges: totalArchitecturalChanges,
      clusters: {
        definitions: clusters,
        clusterNames: Object.keys(clusters),
        nodeCount: Object.fromEntries(
          Object.entries(clusters).map(([key, nodes]) => [key, nodes.length])
        )
      },
      problems: this.detectWorkflowProblems(workflow)
    };
  }

  /**
   * NUEVA FUNCIÓN: Fusionar subworkflow modificado de vuelta al workflow principal
   */
  _mergeSubWorkflowBack(mainWorkflow, subWorkflow, clusterName) {
    console.log(`🔄 Fusionando cambios del clúster [${clusterName}] al workflow principal...`);
    
    // Actualizar conexiones del cluster en el workflow principal
    subWorkflow.nodes.forEach(node => {
      const nodeName = node.name;
      // Actualizar o eliminar conexiones
      if (subWorkflow.connections[nodeName]) {
        mainWorkflow.connections[nodeName] = { ...subWorkflow.connections[nodeName] };
      } else {
        // Si el nodo no tiene conexiones en el subworkflow, limpiar en el principal
        delete mainWorkflow.connections[nodeName];
      }
    });
    
    console.log(`✅ Clúster [${clusterName}] fusionado exitosamente.`);
  }

  /**
   * NUEVA FUNCIÓN: Generar prompt arquitectural más directivo para la IA
   */
  async _getArchitecturalCorrectionPlan(subWorkflow, problems, originalPrompt, clusterName) {
    // Identificar nodos ya conectados (estructura base)
    const connectedNodes = new Set();
    const unconnectedNodes = [];
    
    Object.keys(subWorkflow.connections).forEach(sourceName => {
      connectedNodes.add(sourceName);
      if (subWorkflow.connections[sourceName].main) {
        subWorkflow.connections[sourceName].main.forEach(group => {
          group.forEach(conn => connectedNodes.add(conn.node));
        });
      }
    });
    
    // Identificar nodos sin conectar que necesitan integrarse
    subWorkflow.nodes.forEach(node => {
      if (!connectedNodes.has(node.name)) {
        unconnectedNodes.push(node.name);
      }
    });

    // Buscar punto de entrada (IF con rama TRUE vacía)
    const availableEntryPoint = Object.keys(subWorkflow.connections).find(nodeName => {
      const node = subWorkflow.nodes.find(n => n.name === nodeName);
      if (!node || node.type !== 'n8n-nodes-base.if') return false;
      
      const connections = subWorkflow.connections[nodeName];
      return connections.main && 
             connections.main.length > 1 && 
             connections.main[1] && 
             connections.main[1].length === 0; // Rama TRUE vacía
    });

    // Crear prompt arquitectural más directivo
    const architecturalPrompt = `CONTEXTO ARQUITECTURAL:
Estás completando el flujo de trabajo del dominio ${clusterName}. 

ESTRUCTURA YA ESTABLECIDA:
- El flujo base ya está conectado con triggers, validaciones e IFs principales
- Nodos ya integrados: ${Array.from(connectedNodes).join(', ')}

TU TAREA ESPECÍFICA:
Tomar estos nodos restantes y conectarlos en una secuencia lógica:
${unconnectedNodes.join(', ')}

${availableEntryPoint ? `PUNTO DE ENTRADA DISPONIBLE: 
- Conecta la primera acción desde la rama TRUE del nodo ${availableEntryPoint}
` : ''}

OBJETIVO:
Crear una secuencia operativa coherente que transforme los datos desde el punto de entrada hasta uno o más puntos finales lógicos (emails de confirmación, registros en base de datos, etc.).

PROBLEMAS DETECTADOS:
${JSON.stringify(problems, null, 2)}

PROMPT ORIGINAL DEL USUARIO:
${originalPrompt}

Proporciona un plan de conexiones que complete la funcionalidad del clúster ${clusterName}.`;

    return await this.getCorrectionPlan(subWorkflow, problems, architecturalPrompt, clusterName);
  }

  /**
   * Habilita o deshabilita el modo debug
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }
}

// Exportar la clase V3.0
export { FlowCoherenceAgentV3 };

// Mantener retrocompatibilidad con V2.0
export { FlowCoherenceAgentV3 as FlowCoherenceAgent };

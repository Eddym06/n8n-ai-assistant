/**
 * WORKFLOW CONTINUATION SYSTEM V3.0 - Sistema Modular de Continuación de Workflows
 * Extraído y modernizado desde extension-server-fixed.js
 * 
 * Características:
 * - Generación de workflows en múltiples fases
 * - Identificación inteligente de puntos de extensión
 * - Merge avanzado de workflows complejos
 * - Validación y reparación automática
 * - Integración con sistemas de IA modernos
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// CONSTANTES DE CONFIGURACIÓN
const EXTENSION_LIMITS = {
  MAX_EXTENSIONS: 3,          // Máximo número de extensiones por workflow
  NODE_SPACING: 300,          // Espaciado entre nodos en extensiones
  MAX_RETRY_ATTEMPTS: 3,      // Reintentos para generación de extensiones
  EXTENSION_TIMEOUT: 30000    // Timeout para cada extensión en ms
};

const WORKFLOW_TYPES = {
  SIMPLE: 'simple',
  COMPLEX: 'complex',
  MULTI_PLATFORM: 'multi-platform-social',
  ECOMMERCE: 'ecommerce',
  CRM: 'crm',
  MARKETING: 'marketing',
  AUTOMATION: 'automation'
};

// Sistema de tracking para extensiones
class ExtensionTracker {
  static extensions = [];
  static totalMerges = 0;
  static successfulExtensions = 0;
  
  static recordExtension(originalNodes, finalNodes, extensionPoints, success) {
    this.extensions.push({
      timestamp: new Date().toISOString(),
      originalNodeCount: originalNodes,
      finalNodeCount: finalNodes,
      extensionPointsUsed: extensionPoints,
      success,
      growthFactor: finalNodes / originalNodes
    });
    
    if (success) this.successfulExtensions++;
  }
  
  static getStats() {
    return {
      totalExtensions: this.extensions.length,
      successfulExtensions: this.successfulExtensions,
      averageGrowth: this.extensions.length > 0 
        ? this.extensions.reduce((acc, ext) => acc + ext.growthFactor, 0) / this.extensions.length
        : 0,
      extensions: this.extensions
    };
  }
}

// CLASE PRINCIPAL DEL SISTEMA DE CONTINUACIÓN
export class WorkflowContinuationSystem {
  constructor(geminiApiKey, workflowGenerator = null) {
    this.apiKey = geminiApiKey;
    this.workflowGenerator = workflowGenerator; // Referencia al generador principal
    this.extensionHistory = new Map();
    this.activeExtensions = new Set();
    
    console.log('🔄 WorkflowContinuationSystem V3.0 inicializado');
  }

  /**
   * Método principal para extender workflows complejos
   */
  async extendWorkflow(initialPrompt, options = {}) {
    console.log('🚀 INICIANDO EXTENSOR DE FLUJO V3.0...');
    console.log(`📝 Prompt original: ${initialPrompt.substring(0, 200)}...`);

    const extensionId = `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.activeExtensions.add(extensionId);

    try {
      // Paso 1: Generar el workflow inicial (primera fase)
      console.log('⚡ PASO 1: Generando workflow inicial (primera fase)...');
      const initialResult = await this.generateInitialWorkflow(initialPrompt, options);

      if (!initialResult.success) {
        throw new Error(`No se pudo generar el workflow inicial: ${initialResult.error}`);
      }

      const initialWorkflow = initialResult.workflow;
      console.log(`✅ Workflow inicial generado: ${initialWorkflow.nodes.length} nodos`);

      // Paso 2: Identificar puntos de extensión inteligentes
      console.log('🔍 PASO 2: Identificando puntos de extensión inteligentes...');
      const extensionPoints = this.identifyExtensionPoints(initialWorkflow);
      console.log(`📍 Puntos de extensión encontrados: ${extensionPoints.length}`);

      if (extensionPoints.length === 0) {
        console.log('ℹ️ No se encontraron puntos de extensión, retornando workflow inicial');
        return this.wrapResult(initialWorkflow, extensionId, 0);
      }

      // Paso 3: Generar extensiones progresivas
      console.log('⚡ PASO 3: Generando extensiones progresivas...');
      let extendedWorkflow = initialWorkflow;
      let extensionsCreated = 0;

      for (let i = 0; i < Math.min(extensionPoints.length, EXTENSION_LIMITS.MAX_EXTENSIONS); i++) {
        const point = extensionPoints[i];
        console.log(`🔧 Extendiendo desde nodo: ${point.nodeName} (${point.reason})`);

        const extension = await this.generateWorkflowExtension(
          initialPrompt, 
          extendedWorkflow, 
          point, 
          extensionsCreated + 1
        );

        if (extension && extension.nodes && extension.nodes.length > 0) {
          console.log(`✅ Extensión ${i + 1} generada: ${extension.nodes.length} nodos adicionales`);
          extendedWorkflow = this.mergeWorkflows(extendedWorkflow, extension, point);
          extensionsCreated++;
          console.log(`📊 Workflow combinado: ${extendedWorkflow.nodes.length} nodos totales`);
        } else {
          console.log(`⚠️ Extensión ${i + 1} falló, continuando con siguiente punto`);
        }
      }

      // Paso 4: Validación y optimización final
      console.log('🔧 PASO 4: Validando y optimizando workflow extendido...');
      const finalWorkflow = this.validateAndRepairExtendedWorkflow(extendedWorkflow);
      
      // Calcular métricas finales
      const finalMetrics = this.calculateWorkflowMetrics(finalWorkflow);
      
      console.log('🎉 EXTENSOR DE FLUJO V3.0 COMPLETADO:');
      console.log(`   📊 Nodos finales: ${finalWorkflow.nodes.length}`);
      console.log(`   🔗 Conexiones: ${Object.keys(finalWorkflow.connections || {}).length}`);
      console.log(`   📏 Profundidad: ${finalMetrics.depth}`);
      console.log(`   🚀 Factor de crecimiento: ${(finalWorkflow.nodes.length / initialWorkflow.nodes.length).toFixed(2)}x`);

      // Registrar en tracker
      ExtensionTracker.recordExtension(
        initialWorkflow.nodes.length,
        finalWorkflow.nodes.length,
        extensionsCreated,
        true
      );

      return this.wrapResult(finalWorkflow, extensionId, extensionsCreated, finalMetrics);

    } catch (error) {
      console.error('❌ Error en extensor de flujo V3.0:', error.message);
      
      // Registrar fallo
      ExtensionTracker.recordExtension(0, 0, 0, false);
      
      // Fallback: intentar generar workflow completo tradicional
      console.log('🔄 Fallback: Generando workflow completo tradicional...');
      const fallbackResult = await this.generateFallbackWorkflow(initialPrompt);
      
      return {
        success: !!fallbackResult,
        workflow: fallbackResult,
        extensionId,
        extensionsCreated: 0,
        method: 'fallback',
        error: error.message
      };
    } finally {
      this.activeExtensions.delete(extensionId);
    }
  }

  /**
   * Generar workflow inicial (primera fase)
   */
  async generateInitialWorkflow(prompt, options = {}) {
    try {
      const optimizedPrompt = this.optimizeInitialPrompt(prompt);
      
      // Si hay un generador de workflows disponible, usarlo
      if (this.workflowGenerator && typeof this.workflowGenerator.generateWorkflow === 'function') {
        const result = await this.workflowGenerator.generateWorkflow(optimizedPrompt + ' (Genera solo la primera parte del flujo, los nodos principales)');
        return result;
      }
      
      // Fallback: generar usando método simple
      return await this.generateSimpleWorkflow(optimizedPrompt);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Optimizar prompt para la fase inicial
   */
  optimizeInitialPrompt(prompt) {
    const workflowType = this.detectWorkflowType(prompt);
    
    let optimizedPrompt = `${prompt}\n\n[FASE INICIAL] Genera solo los nodos principales y conexiones básicas para establecer la estructura base del workflow.`;
    
    switch (workflowType) {
      case WORKFLOW_TYPES.MULTI_PLATFORM:
        optimizedPrompt += ' Incluye: trigger principal, validación inicial, y primer nodo de procesamiento.';
        break;
      case WORKFLOW_TYPES.ECOMMERCE:
        optimizedPrompt += ' Incluye: trigger de pedidos, validación de datos, y nodo de verificación de inventario.';
        break;
      case WORKFLOW_TYPES.AUTOMATION:
        optimizedPrompt += ' Incluye: trigger apropiado, validación de entrada, y primer paso de procesamiento.';
        break;
      default:
        optimizedPrompt += ' Incluye: trigger, validación, y primer nodo de lógica principal.';
    }
    
    return optimizedPrompt;
  }

  /**
   * Detectar tipo de workflow basado en el prompt
   */
  detectWorkflowType(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return WORKFLOW_TYPES.SIMPLE;
    }
    
    const promptLower = prompt.toLowerCase();
    
    // Multi-plataforma social
    const socialPlatforms = ['instagram', 'whatsapp', 'telegram', 'slack', 'twitter', 'linkedin'];
    const socialCount = socialPlatforms.filter(platform => promptLower.includes(platform)).length;
    if (socialCount >= 2) return WORKFLOW_TYPES.MULTI_PLATFORM;
    
    // E-commerce
    const ecommerceKeywords = ['pedido', 'order', 'pago', 'payment', 'inventario', 'stock', 'shopify', 'woocommerce'];
    if (ecommerceKeywords.some(keyword => promptLower.includes(keyword))) return WORKFLOW_TYPES.ECOMMERCE;
    
    // CRM
    const crmKeywords = ['cliente', 'customer', 'lead', 'crm', 'contacto', 'seguimiento'];
    if (crmKeywords.some(keyword => promptLower.includes(keyword))) return WORKFLOW_TYPES.CRM;
    
    // Marketing
    const marketingKeywords = ['campaña', 'campaign', 'newsletter', 'promocion', 'marketing', 'email'];
    if (marketingKeywords.some(keyword => promptLower.includes(keyword))) return WORKFLOW_TYPES.MARKETING;
    
    return WORKFLOW_TYPES.AUTOMATION;
  }

  /**
   * Identificar puntos de extensión inteligentes en el workflow
   */
  identifyExtensionPoints(workflow) {
    const points = [];
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      return points;
    }
    
    // Estrategia 1: Buscar nodos sin conexiones de salida (nodos finales)
    workflow.nodes.forEach(node => {
      const hasOutgoingConnections = workflow.connections[node.name] && 
                                   workflow.connections[node.name].main && 
                                   workflow.connections[node.name].main.length > 0;
      
      if (!hasOutgoingConnections) {
        points.push({
          nodeName: node.name,
          nodeType: node.type,
          position: node.position || [0, 0],
          reason: 'Nodo final sin conexiones de salida',
          priority: this.calculateExtensionPriority(node, workflow)
        });
      }
    });
    
    // Estrategia 2: Buscar nodos que típicamente necesitan extensión
    workflow.nodes.forEach(node => {
      if (this.isExtensibleNodeType(node.type)) {
        const alreadyAdded = points.some(p => p.nodeName === node.name);
        if (!alreadyAdded) {
          points.push({
            nodeName: node.name,
            nodeType: node.type,
            position: node.position || [0, 0],
            reason: `Nodo tipo ${node.type} típicamente extensible`,
            priority: this.calculateExtensionPriority(node, workflow)
          });
        }
      }
    });
    
    // Si no hay puntos obvios, usar el último nodo
    if (points.length === 0 && workflow.nodes.length > 0) {
      const lastNode = workflow.nodes[workflow.nodes.length - 1];
      points.push({
        nodeName: lastNode.name,
        nodeType: lastNode.type,
        position: lastNode.position || [0, 0],
        reason: 'Último nodo del workflow (fallback)',
        priority: 1
      });
    }
    
    // Ordenar por prioridad (mayor prioridad primero)
    points.sort((a, b) => b.priority - a.priority);
    
    return points.slice(0, EXTENSION_LIMITS.MAX_EXTENSIONS);
  }

  /**
   * Calcular prioridad de extensión para un nodo
   */
  calculateExtensionPriority(node, workflow) {
    let priority = 1;
    
    // Mayor prioridad para nodos de procesamiento
    if (node.type.includes('function') || node.type.includes('code')) priority += 3;
    if (node.type.includes('http') || node.type.includes('webhook')) priority += 2;
    if (node.type.includes('if') || node.type.includes('switch')) priority += 2;
    
    // Menor prioridad para nodos finales típicos
    if (node.type.includes('noOp') || node.type.includes('stopAndError')) priority -= 1;
    
    // Considerar posición en el workflow
    const nodeIndex = workflow.nodes.findIndex(n => n.name === node.name);
    if (nodeIndex > workflow.nodes.length * 0.7) priority += 1; // Nodos hacia el final
    
    return Math.max(1, priority);
  }

  /**
   * Verificar si un tipo de nodo es típicamente extensible
   */
  isExtensibleNodeType(nodeType) {
    const extensibleTypes = [
      'n8n-nodes-base.function',
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.if',
      'n8n-nodes-base.switch',
      'n8n-nodes-base.merge',
      '@n8n/n8n-nodes-langchain.lmChatOpenAi',
      '@n8n/n8n-nodes-langchain.agentExecutor'
    ];
    
    return extensibleTypes.some(type => nodeType.includes(type.split('.').pop()));
  }

  /**
   * Generar extensión específica para un punto de extensión
   */
  async generateWorkflowExtension(originalPrompt, currentWorkflow, extensionPoint, extensionNumber) {
    try {
      console.log(`🔮 Generando extensión ${extensionNumber} para: ${extensionPoint.nodeName}`);
      
      const extensionPrompt = this.buildExtensionPrompt(originalPrompt, currentWorkflow, extensionPoint, extensionNumber);
      
      // Usar timeout para evitar bloqueos
      const extension = await Promise.race([
        this.generateExtensionWithAI(extensionPrompt, extensionPoint),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Extension timeout')), EXTENSION_LIMITS.EXTENSION_TIMEOUT))
      ]);
      
      if (extension && this.validateExtension(extension, extensionPoint)) {
        return extension;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error generando extensión ${extensionNumber}:`, error.message);
      return null;
    }
  }

  /**
   * Construir prompt específico para la extensión
   */
  buildExtensionPrompt(originalPrompt, currentWorkflow, extensionPoint, extensionNumber) {
    const nextPosition = [
      extensionPoint.position[0] + EXTENSION_LIMITS.NODE_SPACING,
      extensionPoint.position[1]
    ];
    
    return `GENERADOR DE EXTENSIÓN DE WORKFLOW - FASE ${extensionNumber}

CONTEXTO ORIGINAL: ${originalPrompt}

WORKFLOW ACTUAL:
- Nodos existentes: ${currentWorkflow.nodes.length}
- Último nodo procesado: ${extensionPoint.nodeName}
- Tipo de nodo: ${extensionPoint.nodeType}

INSTRUCCIONES PARA EXTENSIÓN:
1. Continúa el workflow desde "${extensionPoint.nodeName}"
2. Genera 2-4 nodos adicionales que extiendan la funcionalidad
3. Los nuevos nodos deben seguir la lógica del prompt original
4. Usa IDs únicos para evitar conflictos
5. Posiciona los nodos comenzando desde [${nextPosition[0]}, ${nextPosition[1]}]

TIPOS DE EXTENSIÓN RECOMENDADOS:
- Si es un nodo de procesamiento: añade validación, transformación, o routing
- Si es un nodo final: añade notificaciones, logging, o almacenamiento
- Si es un nodo de decisión: expande las ramas true/false

FORMATO DE RESPUESTA (JSON válido):
{
  "nodes": [
    {
      "id": "extension_node_1",
      "name": "Nombre Descriptivo",
      "type": "n8n-nodes-base.tipoApropiado",
      "typeVersion": 1,
      "position": [${nextPosition[0]}, ${nextPosition[1]}],
      "parameters": {}
    }
  ],
  "connections": {
    "${extensionPoint.nodeName}": {
      "main": [
        [{"node": "Nombre Descriptivo", "type": "main", "index": 0}]
      ]
    }
  }
}

RESPONDE ÚNICAMENTE con el JSON válido.`;
  }

  /**
   * Generar extensión usando IA
   */
  async generateExtensionWithAI(prompt, extensionPoint) {
    // Si hay acceso al generador principal, usarlo
    if (this.workflowGenerator && typeof this.workflowGenerator.callGeminiMassive === 'function') {
      try {
        const response = await this.workflowGenerator.callGeminiMassive([prompt], 15000, 0.7);
        return this.parseExtensionResponse(response);
      } catch (error) {
        console.warn('Fallo en generador principal, usando método directo');
      }
    }
    
    // Método directo usando Gemini
    return await this.generateExtensionDirect(prompt);
  }

  /**
   * Generar extensión directamente con Gemini
   */
  async generateExtensionDirect(prompt) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseExtensionResponse(response);
    } catch (error) {
      console.error('Error en generación directa:', error.message);
      return null;
    }
  }

  /**
   * Parsear respuesta de IA para extraer extensión
   */
  parseExtensionResponse(response) {
    try {
      if (!response || typeof response !== 'string') {
        return null;
      }
      
      // Buscar JSON en la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }
      
      let jsonText = jsonMatch[0];
      
      // Limpiar caracteres problemáticos
      jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      // Intentar parsear
      const extension = JSON.parse(jsonText);
      
      // Validar estructura básica
      if (!extension.nodes || !Array.isArray(extension.nodes) || extension.nodes.length === 0) {
        return null;
      }
      
      return extension;
    } catch (error) {
      console.error('Error parseando respuesta de extensión:', error.message);
      return null;
    }
  }

  /**
   * Validar que la extensión generada es válida
   */
  validateExtension(extension, extensionPoint) {
    try {
      // Verificar estructura básica
      if (!extension || !extension.nodes || !Array.isArray(extension.nodes)) {
        return false;
      }
      
      // Verificar que todos los nodos tienen campos requeridos
      for (const node of extension.nodes) {
        if (!node.name || !node.type || !node.id || !node.position) {
          return false;
        }
      }
      
      // Verificar que las conexiones hacen referencia a nodos válidos
      if (extension.connections) {
        for (const connections of Object.values(extension.connections)) {
          if (connections.main) {
            for (const connectionGroup of connections.main) {
              for (const connection of connectionGroup) {
                const referencedNode = extension.nodes.find(n => n.name === connection.node);
                if (!referencedNode) {
                  console.warn(`Conexión inválida: nodo ${connection.node} no encontrado`);
                  return false;
                }
              }
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validando extensión:', error.message);
      return false;
    }
  }

  /**
   * Combinar workflows de forma inteligente
   */
  mergeWorkflows(baseWorkflow, extension, extensionPoint) {
    console.log('🔗 Combinando workflows de forma inteligente...');
    
    const merged = {
      nodes: [...baseWorkflow.nodes],
      connections: JSON.parse(JSON.stringify(baseWorkflow.connections || {})),
      settings: baseWorkflow.settings || {},
      meta: { ...baseWorkflow.meta || {}, lastExtended: new Date().toISOString() }
    };
    
    // Añadir nodos de la extensión con verificación de duplicados
    if (extension.nodes) {
      extension.nodes.forEach(node => {
        const exists = merged.nodes.some(existing => existing.name === node.name || existing.id === node.id);
        if (!exists) {
          merged.nodes.push(node);
        } else {
          console.warn(`Nodo duplicado detectado: ${node.name}, asignando nuevo nombre`);
          node.name = `${node.name}_ext_${Date.now()}`;
          node.id = `${node.id}_ext_${Date.now()}`;
          merged.nodes.push(node);
        }
      });
    }
    
    // Añadir conexiones de la extensión
    if (extension.connections) {
      Object.keys(extension.connections).forEach(sourceName => {
        if (!merged.connections[sourceName]) {
          merged.connections[sourceName] = extension.connections[sourceName];
        } else {
          // Combinar conexiones existentes
          const existingMain = merged.connections[sourceName].main || [];
          const newMain = extension.connections[sourceName].main || [];
          merged.connections[sourceName].main = [...existingMain, ...newMain];
        }
      });
    }
    
    console.log(`✅ Workflows combinados: ${merged.nodes.length} nodos totales`);
    return merged;
  }

  /**
   * Validar y reparar workflow extendido
   */
  validateAndRepairExtendedWorkflow(workflow) {
    console.log('🔧 Validando y reparando workflow extendido...');
    
    if (!workflow.nodes || !workflow.connections) {
      throw new Error('Workflow inválido: faltan nodos o conexiones');
    }

    const repairedWorkflow = JSON.parse(JSON.stringify(workflow));
    const nodeNames = new Set(workflow.nodes.map(n => n.name));
    
    // Limpiar conexiones a nodos que no existen
    Object.keys(repairedWorkflow.connections).forEach(sourceName => {
      if (!nodeNames.has(sourceName)) {
        console.warn(`Eliminando conexiones de nodo inexistente: ${sourceName}`);
        delete repairedWorkflow.connections[sourceName];
        return;
      }
      
      const sourceConnections = repairedWorkflow.connections[sourceName];
      if (sourceConnections.main) {
        sourceConnections.main = sourceConnections.main.map(connectionGroup => 
          connectionGroup.filter(connection => {
            const targetExists = nodeNames.has(connection.node);
            if (!targetExists) {
              console.warn(`Eliminando conexión a nodo inexistente: ${connection.node}`);
            }
            return targetExists;
          })
        );
      }
    });
    
    // Verificar que todos los nodos tienen posiciones válidas
    repairedWorkflow.nodes.forEach((node, index) => {
      if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
        console.warn(`Reparando posición inválida para nodo: ${node.name}`);
        node.position = [100 + (index * 300), 100];
      }
    });
    
    console.log('✅ Workflow extendido validado y reparado');
    return repairedWorkflow;
  }

  /**
   * Calcular métricas del workflow
   */
  calculateWorkflowMetrics(workflow) {
    const metrics = {
      nodeCount: workflow.nodes.length,
      connectionCount: Object.keys(workflow.connections).length,
      depth: 0,
      branches: 0,
      complexity: 0
    };
    
    // Calcular profundidad máxima
    const calculateDepth = (nodeName, visited = new Set(), currentDepth = 0) => {
      if (visited.has(nodeName)) return currentDepth;
      visited.add(nodeName);
      
      const connections = workflow.connections[nodeName];
      if (!connections || !connections.main) return currentDepth;
      
      let maxDepth = currentDepth;
      for (const connectionGroup of connections.main) {
        for (const connection of connectionGroup) {
          const depth = calculateDepth(connection.node, new Set(visited), currentDepth + 1);
          maxDepth = Math.max(maxDepth, depth);
        }
      }
      
      return maxDepth;
    };
    
    // Encontrar nodos trigger (sin conexiones entrantes)
    const triggerNodes = workflow.nodes.filter(node => {
      return !Object.values(workflow.connections).some(conn => 
        conn.main && conn.main.some(group => 
          group.some(c => c.node === node.name)
        )
      );
    });
    
    // Calcular profundidad desde cada trigger
    triggerNodes.forEach(trigger => {
      const depth = calculateDepth(trigger.name);
      metrics.depth = Math.max(metrics.depth, depth);
    });
    
    // Calcular complejidad basada en tipos de nodos
    workflow.nodes.forEach(node => {
      if (node.type.includes('if') || node.type.includes('switch')) metrics.branches++;
      if (node.type.includes('function') || node.type.includes('code')) metrics.complexity += 2;
      else metrics.complexity += 1;
    });
    
    return metrics;
  }

  /**
   * Generar workflow simple como fallback
   */
  async generateSimpleWorkflow(prompt) {
    // Implementación básica para casos donde no hay generador principal
    const simpleWorkflow = {
      nodes: [
        {
          id: "trigger_1",
          name: "Manual Trigger",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [100, 100],
          parameters: {}
        },
        {
          id: "function_1",
          name: "Process Data",
          type: "n8n-nodes-base.function",
          typeVersion: 1,
          position: [400, 100],
          parameters: {
            functionCode: "// Procesamiento basado en: " + prompt.substring(0, 100) + "\nreturn items;"
          }
        }
      ],
      connections: {
        "Manual Trigger": {
          main: [
            [{"node": "Process Data", "type": "main", "index": 0}]
          ]
        }
      }
    };
    
    return { success: true, workflow: simpleWorkflow };
  }

  /**
   * Generar workflow de fallback
   */
  async generateFallbackWorkflow(prompt) {
    return (await this.generateSimpleWorkflow(prompt)).workflow;
  }

  /**
   * Analizar completitud de workflow para determinar necesidad de extensión
   */
  async analyzeWorkflowCompleteness(workflowData, originalPrompt = '') {
    console.log('🔍 Analizando completitud del workflow...');
    
    const analysis = {
      isComplete: false,
      completenessScore: 0, // 0-100
      missingComponents: [],
      extensionSuggestions: [],
      canBeExtended: false,
      complexity: 'unknown', // simple, medium, complex
      readiness: 'unknown' // ready, needs_work, insufficient
    };

    try {
      // Extraer datos del workflow
      const actualWorkflowData = this.extractWorkflowData(workflowData);
      
      if (!actualWorkflowData || !actualWorkflowData.nodes) {
        analysis.readiness = 'insufficient';
        analysis.missingComponents.push('Estructura de workflow inválida');
        return analysis;
      }

      const nodes = actualWorkflowData.nodes;
      const connections = actualWorkflowData.connections || {};

      // 1. Análisis básico de estructura
      const structureAnalysis = this.analyzeWorkflowStructure(nodes, connections);
      analysis.completenessScore += structureAnalysis.score;

      // 2. Análisis de tipos de nodos
      const nodeTypesAnalysis = this.analyzeNodeTypes(nodes);
      analysis.completenessScore += nodeTypesAnalysis.score;
      analysis.complexity = nodeTypesAnalysis.complexity;

      // 3. Análisis de flujo lógico
      const flowAnalysis = this.analyzeWorkflowFlow(nodes, connections);
      analysis.completenessScore += flowAnalysis.score;

      // 4. Identificar componentes faltantes
      const missingAnalysis = this.identifyMissingComponents(nodes, originalPrompt);
      analysis.missingComponents = missingAnalysis.missing;
      analysis.extensionSuggestions = missingAnalysis.suggestions;

      // 5. Determinar si puede ser extendido
      analysis.canBeExtended = this.canWorkflowBeExtended(nodes, connections);
      analysis.needsContinuation = !analysis.isComplete && analysis.canBeExtended;

      // 6. Calcular score final (promedio de los componentes)
      analysis.completenessScore = Math.round(analysis.completenessScore / 3);

      // 7. Determinar completitud
      analysis.isComplete = analysis.completenessScore >= 80 && analysis.missingComponents.length === 0;

      // 8. Determinar readiness
      if (analysis.completenessScore >= 70) {
        analysis.readiness = 'ready';
      } else if (analysis.completenessScore >= 40) {
        analysis.readiness = 'needs_work';
      } else {
        analysis.readiness = 'insufficient';
      }

      console.log(`🔍 Análisis completado: ${analysis.completenessScore}% completo, ${analysis.missingComponents.length} componentes faltantes`);
      
      return analysis;

    } catch (error) {
      console.error('❌ Error en análisis de completitud:', error.message);
      return {
        ...analysis,
        readiness: 'insufficient',
        missingComponents: [`Error en análisis: ${error.message}`]
      };
    }
  }

  /**
   * Analizar estructura básica del workflow
   */
  analyzeWorkflowStructure(nodes, connections) {
    let score = 0;
    
    // Verificar que hay nodos
    if (nodes && nodes.length > 0) score += 20;
    
    // Verificar que hay conexiones
    if (connections && Object.keys(connections).length > 0) score += 20;
    
    // Verificar que hay al menos un trigger
    const hasTrigger = nodes.some(node => 
      node.type && (node.type.includes('trigger') || node.type.includes('webhook'))
    );
    if (hasTrigger) score += 30;
    
    // Verificar que hay nodos de procesamiento
    const hasProcessing = nodes.some(node => 
      node.type && (node.type.includes('function') || node.type.includes('http'))
    );
    if (hasProcessing) score += 30;
    
    return { score };
  }

  /**
   * Analizar tipos de nodos para determinar complejidad
   */
  analyzeNodeTypes(nodes) {
    const nodeTypes = new Set();
    let score = 0;
    
    nodes.forEach(node => {
      if (node.type) {
        nodeTypes.add(node.type);
      }
    });
    
    // Score basado en diversidad de tipos
    const typeCount = nodeTypes.size;
    if (typeCount >= 5) score = 40;
    else if (typeCount >= 3) score = 30;
    else if (typeCount >= 2) score = 20;
    else score = 10;
    
    // Determinar complejidad
    let complexity = 'simple';
    if (typeCount >= 5 || nodes.length >= 10) complexity = 'complex';
    else if (typeCount >= 3 || nodes.length >= 5) complexity = 'medium';
    
    return { score, complexity };
  }

  /**
   * Analizar flujo lógico del workflow
   */
  analyzeWorkflowFlow(nodes, connections) {
    let score = 0;
    
    // Verificar continuidad del flujo
    const connectedNodes = new Set();
    
    Object.values(connections).forEach(nodeConnections => {
      if (nodeConnections.main) {
        nodeConnections.main.forEach(branch => {
          if (Array.isArray(branch)) {
            branch.forEach(conn => {
              if (conn.node) {
                connectedNodes.add(conn.node);
              }
            });
          }
        });
      }
    });
    
    const connectionRatio = connectedNodes.size / Math.max(nodes.length - 1, 1);
    score = Math.round(connectionRatio * 40);
    
    return { score };
  }

  /**
   * Identificar componentes faltantes
   */
  identifyMissingComponents(nodes, originalPrompt) {
    const missing = [];
    const suggestions = [];
    
    // Verificar tipos básicos de nodos
    const hasHttpRequest = nodes.some(n => n.type?.includes('httpRequest'));
    const hasFunction = nodes.some(n => n.type?.includes('function'));
    const hasIf = nodes.some(n => n.type?.includes('if'));
    const hasSet = nodes.some(n => n.type?.includes('set'));
    
    // Sugerir componentes faltantes basado en el prompt
    if (originalPrompt.toLowerCase().includes('api') && !hasHttpRequest) {
      missing.push('HTTP Request node para llamadas API');
      suggestions.push('Añadir nodos HTTP Request para integración con APIs');
    }
    
    if (originalPrompt.toLowerCase().includes('condition') && !hasIf) {
      missing.push('Nodos condicionales para lógica de decisión');
      suggestions.push('Implementar lógica condicional con nodos IF');
    }
    
    if (originalPrompt.toLowerCase().includes('transform') && !hasFunction) {
      missing.push('Nodos de función para transformación de datos');
      suggestions.push('Añadir nodos Function para procesamiento avanzado');
    }
    
    if (nodes.length < 3) {
      missing.push('Workflow demasiado simple');
      suggestions.push('Expandir workflow con más pasos de procesamiento');
    }
    
    return { missing, suggestions };
  }

  /**
   * Determinar si un workflow puede ser extendido
   */
  canWorkflowBeExtended(nodes, connections) {
    // Un workflow puede ser extendido si:
    // 1. Tiene al menos 2 nodos
    // 2. Tiene conexiones válidas
    // 3. No está en un estado de error crítico
    
    return nodes.length >= 2 && 
           Object.keys(connections).length > 0 && 
           nodes.length < 20; // Límite para evitar workflows demasiado complejos
  }

  /**
   * Extraer datos del workflow (maneja diferentes formatos)
   */
  extractWorkflowData(workflowData) {
    if (!workflowData) return null;
    
    // Si ya es un objeto workflow válido
    if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
      return workflowData;
    }
    
    // Si está envuelto en una estructura adicional
    if (workflowData.workflow && workflowData.workflow.nodes) {
      return workflowData.workflow;
    }
    
    // Si es un string JSON
    if (typeof workflowData === 'string') {
      try {
        const parsed = JSON.parse(workflowData);
        return this.extractWorkflowData(parsed);
      } catch (e) {
        console.error('Error parsing workflow JSON:', e.message);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Envolver resultado con metadatos
   */
  wrapResult(workflow, extensionId, extensionsCreated, metrics = null) {
    return {
      success: true,
      workflow,
      extensionId,
      extensionsCreated,
      method: 'continuation_system_v3',
      metrics: metrics || this.calculateWorkflowMetrics(workflow),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Obtener estadísticas del sistema
   */
  getStats() {
    return {
      activeExtensions: this.activeExtensions.size,
      extensionHistory: this.extensionHistory.size,
      globalStats: ExtensionTracker.getStats()
    };
  }

  /**
   * Limpiar recursos
   */
  cleanup() {
    this.activeExtensions.clear();
    this.extensionHistory.clear();
    console.log('🧹 WorkflowContinuationSystem limpiado');
  }
}

// Exportaciones adicionales
export { ExtensionTracker, WORKFLOW_TYPES, EXTENSION_LIMITS };

// Función de conveniencia para uso rápido
export async function extendWorkflow(prompt, apiKey, workflowGenerator = null) {
  const system = new WorkflowContinuationSystem(apiKey, workflowGenerator);
  return await system.extendWorkflow(prompt);
}

console.log('📦 Workflow Continuation System V3.0 cargado y listo para uso');
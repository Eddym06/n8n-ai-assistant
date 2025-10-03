// Servidor Node que simula la extensión n8n AI Assistant - VERSIÓN ULTRA FINAL
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { setTimeout, clearTimeout } from 'timers';
import util from 'util';
import logger from './ultra-logging-system.js';

// 🚀🚀🚀 IMPORTACIÓN DE AGENTES ULTRA FUSIONADOS 🚀🚀🚀
import { WorkflowValidator } from './workflow-validator.js'; // Se mantiene por compatibilidad
import { N8nValidationSystem } from './validation-system.js';
import IntelligentWorkflowValidatorUltra from './intelligent-workflow-validator-ultra.js';
import FlowCoherenceAgentUltra from './flow-coherence-agent-ultra.js';
import IntelligentPositioningAgentUltra from './intelligent-positioning-agent-ultra.js';
import PromptEnhancementAgentUltra from './prompt-enhancement-agent-ultra.js';
import WorkflowSearchAgentNew from './workflow-search-agent-wrapper.js';
import SemanticMemoryAgent from './semantic-memory-agent.js';
import { integrateV4Ultra } from './extension-server-v4-integration.js';
import GeminiCallTracker from './gemini-call-tracker.js';
import GeminiModelRouter from './gemini-model-router.js';
import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';
import AutocorrectorFlujos from './Herramienta-Autocorrector.js';
import IntelligentNameCorrector from './intelligent-name-corrector.js';
import { JSONRepairAgent } from './json-repair-agent-v3.js';

// 🔥🔥🔥 CLASES INTEGRADAS ESENCIALES DESDE EL SERVIDOR PRINCIPAL 🔥🔥🔥

// Agente de Reparación JSON Integrado
class IntegratedJSONRepairAgent {
  constructor(apiKey, existingModel = null) {
    this.apiKey = apiKey;
    this.model = existingModel;
    this.memoryAgent = new IntegratedSemanticMemoryAgent();
    this.repairAttempts = 0;
    this.maxRepairAttempts = 3;
    this.repairHistory = new Map();
    this.stats = {
      totalRepairs: 0,
      successfulRepairs: 0,
      repairMethods: {},
      avgRepairTime: 0
    };
  }

  async analyzeJSON(jsonString, contextLength = 0) {
    try {
      console.log('🔍 JSONRepairAgent iniciando análisis...');
      
      const analysis = this.performBasicAnalysis(jsonString);
      console.log(`📊 Análisis completado: ${analysis.status} - ${analysis.issues.length} problemas detectados`);
      
      if (analysis.status === 'corrupted' && analysis.issues.length > 0) {
        console.log('🔄 Manejando JSON corrupto...');
        return await this.handleCorruptedJSON(jsonString, analysis);
      }
      
      if (analysis.status === 'truncated') {
        console.log('📏 JSON truncado detectado, iniciando reparación...');
        return await this.repairTruncatedJSON(jsonString, { contextLength });
      }
      
      return { success: true, repairedJSON: jsonString, analysis };
    } catch (error) {
      console.error('❌ Error en análisis JSON:', error.message);
      return { success: false, error: error.message };
    }
  }

  performBasicAnalysis(jsonString) {
    const issues = [];
    let status = 'valid';
    
    if (!jsonString.trim().startsWith('{') && !jsonString.trim().startsWith('[')) {
      issues.push('Invalid JSON start');
      status = 'corrupted';
    }
    
    if (!jsonString.trim().endsWith('}') && !jsonString.trim().endsWith(']')) {
      issues.push('Incomplete JSON structure');
      status = 'truncated';
    }
    
    const controlChars = jsonString.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
    if (controlChars) {
      issues.push(`Control characters found: ${controlChars.length}`);
      status = 'corrupted';
    }
    
    const quotes = jsonString.match(/"/g);
    if (quotes && quotes.length % 2 !== 0) {
      issues.push('Unbalanced quotes');
      status = 'corrupted';
    }
    
    return { status, issues, length: jsonString.length };
  }

  async handleCorruptedJSON(jsonString, analysis) {
    console.log('🔄 Manejando JSON corrupto...');
    
    const repairResult = await this.requestGeminiRepair(jsonString, analysis);
    
    if (repairResult.success) {
      console.log(`📥 Recibido JSON reparado: ${repairResult.repairedJSON.length} caracteres`);
      this.stats.successfulRepairs++;
      this.stats.repairMethods['gemini-repair'] = (this.stats.repairMethods['gemini-repair'] || 0) + 1;
      return { success: true, repairedJSON: repairResult.repairedJSON, method: 'gemini-repair' };
    }
    
    return { success: false, error: 'No se pudo reparar el JSON corrupto' };
  }

  async repairTruncatedJSON(jsonString, options = {}) {
    console.log('🔧 JSONRepairAgent: Iniciando reparación de JSON truncado...');
    
    const originalPrompt = options.originalPrompt || 'workflow automatización';
    const truncationPoint = this.detectTruncationPoint(jsonString);
    
    const completionResult = await this.requestGeminiCompletion(jsonString, truncationPoint, options, originalPrompt);
    
    if (completionResult.success) {
      try {
        JSON.parse(completionResult.completedJSON);
        this.stats.successfulRepairs++;
        this.stats.repairMethods['gemini-completion'] = (this.stats.repairMethods['gemini-completion'] || 0) + 1;
        return { success: true, repairedJSON: completionResult.completedJSON, method: 'gemini-completion' };
      } catch (parseError) {
        return await this.handleCorruptedJSON(completionResult.completedJSON, { 
          status: 'corrupted', 
          issues: ['Parse error after completion'] 
        });
      }
    }
    
    return { success: false, error: completionResult.error };
  }

  detectTruncationPoint(jsonString) {
    const lastPart = jsonString.substring(Math.max(0, jsonString.length - 100));
    
    if (lastPart.includes('"parameters"')) return { type: 'incomplete_parameters', location: 'parameters' };
    if (lastPart.includes('"position"')) return { type: 'incomplete_position', location: 'position' };
    if (lastPart.includes('"connections"')) return { type: 'incomplete_connections', location: 'connections' };
    if (lastPart.includes('":')) return { type: 'incomplete_property_value', location: 'object' };
    if (lastPart.includes(',')) return { type: 'incomplete_array_element', location: 'array' };
    
    return { type: 'unknown_truncation', location: 'unknown' };
  }

  async requestGeminiCompletion(truncatedJSON, truncationPoint, options, originalPrompt) {
    try {
      if (!this.model) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      }

      const prompt = `SISTEMA EXPERTO EN REPARACIÓN DE JSON n8n - COMPLETACIÓN CONTEXTUAL

CONTEXTO ORIGINAL: ${originalPrompt}
JSON TRUNCADO: ${truncatedJSON}
PUNTO DE TRUNCAMIENTO: ${truncationPoint.type} en ${truncationPoint.location}

INSTRUCCIONES:
1. Completa el JSON manteniendo fidelidad al contexto original
2. Cada nodo DEBE tener: name, type, id, position, parameters, typeVersion
3. Usa condiciones IF inteligentes cuando sea necesario
4. Asegúrate de que sea válido sintácticamente

RESPUESTA: Devuelve ÚNICAMENTE el JSON completo y válido.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return { success: true, completedJSON: response.trim() };
    } catch (error) {
      return { success: false, error: `Gemini completion failed: ${error.message}` };
    }
  }

  async requestGeminiRepair(corruptedJSON, analysis) {
    try {
      if (!this.model) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      }

      const prompt = `SISTEMA EXPERTO EN REPARACIÓN DE JSON

JSON CORRUPTO: ${corruptedJSON.substring(0, 2000)}...
PROBLEMAS: ${analysis.issues.join(', ')}

INSTRUCCIONES:
1. Corrige ÚNICAMENTE errores de sintaxis JSON
2. NO modifiques contenido semántico
3. Mantén estructura de nodos y conexiones n8n

RESPUESTA: Devuelve ÚNICAMENTE el JSON reparado.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return { success: true, repairedJSON: response.trim() };
    } catch (error) {
      return { success: false, error: `Gemini repair failed: ${error.message}` };
    }
  }

  async repairJSON(jsonString, options = {}) {
    const startTime = Date.now();
    this.stats.totalRepairs++;
    
    const result = await this.analyzeJSON(jsonString, options.contextLength || 0);
    
    this.stats.avgRepairTime = ((this.stats.avgRepairTime * (this.stats.totalRepairs - 1)) + 
                               (Date.now() - startTime)) / this.stats.totalRepairs;
    
    return result;
  }

  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.totalRepairs > 0 ? 
        (this.stats.successfulRepairs / this.stats.totalRepairs * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// Agente de Memoria Semántica Integrado
class IntegratedSemanticMemoryAgent {
  constructor() {
    this.memoryStore = new Map();
    this.contextStore = new Map();
    this.maxMemorySize = 1000;
    this.cleanupThreshold = 800;
  }

  async storeContext(key, context, metadata = {}) {
    try {
      const entry = {
        context,
        metadata: {
          ...metadata,
          timestamp: Date.now(),
          accessCount: 0
        }
      };
      
      this.memoryStore.set(key, entry);
      
      if (this.memoryStore.size > this.maxMemorySize) {
        this.cleanup();
      }
      
      return true;
    } catch (error) {
      console.error('Error storing context:', error);
      return false;
    }
  }

  async retrieveContext(key) {
    try {
      const entry = this.memoryStore.get(key);
      if (!entry) return null;
      
      entry.metadata.accessCount++;
      entry.metadata.lastAccessed = Date.now();
      
      return entry.context;
    } catch (error) {
      console.error('Error retrieving context:', error);
      return null;
    }
  }

  cleanup() {
    const entries = Array.from(this.memoryStore.entries());
    entries.sort((a, b) => {
      const scoreA = a[1].metadata.accessCount + (Date.now() - a[1].metadata.timestamp) / 1000000;
      const scoreB = b[1].metadata.accessCount + (Date.now() - b[1].metadata.timestamp) / 1000000;
      return scoreA - scoreB;
    });
    
    const toRemove = entries.slice(0, this.memoryStore.size - this.cleanupThreshold);
    toRemove.forEach(([key]) => this.memoryStore.delete(key));
  }

  getStats() {
    return {
      totalEntries: this.memoryStore.size,
      maxSize: this.maxMemorySize,
      cleanupThreshold: this.cleanupThreshold
    };
  }
}

// 🔥🔥🔥 IMPORTACIÓN DE MÓDULOS EXTRAÍDOS Y MODERNIZADOS V3.0+ 🔥🔥🔥
import { WorkflowContinuationSystem } from './workflow-continuation-system-v3.js';
import { WorkflowAutocorrector } from './workflow-autocorrector-v4.js';
import { IntelligentWorkflowValidator } from './intelligent-workflow-validator-v5.js';
import { LayoutOptimizer } from './layout-optimizer-v3.js';

// ... (Se omiten las funciones helper y clases integradas por brevedad, se asume que están aquí) ...

// CLASE PRINCIPAL DEL ASISTENTE - VERSIÓN ULTRA
class N8nAIAssistant {
  constructor() {
    logger.info('SYSTEM', 'Inicializando Ecosistema de Agentes ULTRA + Módulos Extraídos V3.0+...');
    this.geminiRouter = new GeminiModelRouter();
    this.searchAgent = new WorkflowSearchAgentNew();
    this.semanticMemory = new SemanticMemoryAgent();
    this.promptAgent = new PromptEnhancementAgentUltra();
    this.intelligentValidator = new IntelligentWorkflowValidatorUltra();
    this.flowCoherenceAgent = new FlowCoherenceAgentUltra();
    this.positioningAgent = new IntelligentPositioningAgentUltra();
    this.validationSystem = new N8nValidationSystem();
    this.workflowValidator = new WorkflowValidator(); // Compatibilidad
    this.v4UltraHybrid = new V4UltraHybridSystem();
    this.jsonRepairAgent = new IntegratedJSONRepairAgent(process.env.GEMINI_API_KEY); // Usar clase integrada
    this.semanticMemory = new IntegratedSemanticMemoryAgent(); // Agregar memoria semántica integrada
    
    // 🔥 INTEGRACIÓN DE MÓDULOS EXTRAÍDOS Y MODERNIZADOS 🔥
    this.continuationSystem = new WorkflowContinuationSystem({
      geminiApiKey: process.env.GEMINI_API_KEY,
      debugMode: true
    });
    this.workflowAutocorrector = new WorkflowAutocorrector({
      geminiApiKey: process.env.GEMINI_API_KEY,
      enableLangChainSupport: true,
      debugMode: true
    });
    this.modernValidator = new IntelligentWorkflowValidator({
      enableAIValidation: true,
      enablePerformanceCheck: true,
      enableSecurityCheck: true,
      strictMode: false
    });
    this.layoutOptimizer = new LayoutOptimizer({
      debugMode: true,
      enableAIOptimization: true,
      layoutStyle: 'AI_OPTIMIZED'
    });
    
    this.requestCache = new Map();
    this.timeouts = new Set();
    this.autocorrector = null;
    this.currentWorkflow = '';
    this.v4Integration = null;
    this.v4Enabled = process.env.ENABLE_V4_ULTRA !== 'false';

    logger.info('SYSTEM', 'Ecosistema de Agentes ULTRA + Módulos V3.0+ cargado', { 
      agentCount: 14, // Incrementado por los 4 módulos nuevos
      v4Enabled: this.v4Enabled,
      jsonRepairEnabled: true,
      continuationSystemEnabled: true,
      autocorrectorV4Enabled: true,
      modernValidatorEnabled: true,
      layoutOptimizerEnabled: true
    });
  }

  // 🔥 MÉTODOS DE LOS MÓDULOS EXTRAÍDOS Y MODERNIZADOS 🔥

  /**
   * Continuar workflow usando el Sistema de Continuación V3.0
   */
  async continueWorkflow(workflowData, originalPrompt = '', options = {}) {
    try {
      logger.info('CONTINUATION', 'Iniciando continuación de workflow con Sistema V3.0');
      
      const result = await this.continuationSystem.continueWorkflow(workflowData, originalPrompt, options);
      
      if (result.success) {
        logger.success('CONTINUATION', 'Workflow continuado exitosamente', {
          originalNodes: workflowData.nodes?.length || 0,
          extendedNodes: result.extendedWorkflow?.nodes?.length || 0,
          phases: result.phases,
          extensionStrategy: result.extensionStrategy
        });
      } else {
        logger.error('CONTINUATION', 'Error en continuación de workflow', { error: result.error });
      }
      
      return result;
    } catch (error) {
      logger.error('CONTINUATION', 'Error crítico en continuación', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Autocorregir workflow usando el Autocorrector V4.0
   */
  async autocorrectWorkflow(workflowData, originalPrompt = '', options = {}) {
    try {
      logger.info('AUTOCORRECT', 'Iniciando autocorrección con Autocorrector V4.0');
      
      const result = await this.workflowAutocorrector.correctWorkflow(workflowData, originalPrompt, options);
      
      if (result.success) {
        logger.success('AUTOCORRECT', 'Workflow autocorregido exitosamente', {
          correctionsApplied: result.correctionsApplied,
          correctionTypes: result.correctionTypes,
          score: result.qualityScore
        });
      } else {
        logger.error('AUTOCORRECT', 'Error en autocorrección', { error: result.error });
      }
      
      return result;
    } catch (error) {
      logger.error('AUTOCORRECT', 'Error crítico en autocorrección', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Validar workflow usando el Validador Inteligente V5.0
   */
  async validateWorkflowModern(workflowData, originalPrompt = '', options = {}) {
    try {
      logger.info('VALIDATION', 'Iniciando validación con Validador Inteligente V5.0');
      
      const result = await this.modernValidator.validateWorkflow(workflowData, originalPrompt, options);
      
      logger.info('VALIDATION', 'Validación completada', {
        isValid: result.isValid,
        score: result.score,
        criticalErrors: result.criticalErrors.length,
        warnings: result.warnings.length,
        suggestions: result.suggestions.length
      });
      
      return result;
    } catch (error) {
      logger.error('VALIDATION', 'Error crítico en validación moderna', { error: error.message });
      return { 
        isValid: false, 
        error: error.message,
        criticalErrors: [error.message],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Optimizar layout usando el Layout Optimizer V3.0
   */
  async optimizeWorkflowLayout(workflowData, clusterManifest = null, options = {}) {
    try {
      logger.info('LAYOUT', 'Iniciando optimización de layout con Layout Optimizer V3.0');
      
      const result = await this.layoutOptimizer.optimizeLayout(workflowData, clusterManifest, options);
      
      if (result.success) {
        logger.success('LAYOUT', 'Layout optimizado exitosamente', {
          nodeCount: result.metrics.totalNodes,
          swimlanes: result.metrics.swimlanesCreated,
          optimizationScore: result.metrics.optimizationScore,
          processingTime: result.metrics.processingTime
        });
      } else {
        logger.error('LAYOUT', 'Error en optimización de layout', { error: result.error });
      }
      
      return result;
    } catch (error) {
      logger.error('LAYOUT', 'Error crítico en optimización de layout', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Procesamiento completo con todos los módulos integrados
   */
  async processWorkflowComplete(workflowData, originalPrompt = '', options = {}) {
    try {
      logger.info('COMPLETE', 'Iniciando procesamiento completo con todos los módulos V3.0+');
      
      const results = {
        validation: null,
        autocorrection: null,
        continuation: null,
        layoutOptimization: null,
        finalWorkflow: workflowData,
        success: true,
        processingSteps: []
      };

      // 1. Validación inicial
      logger.info('COMPLETE', 'Paso 1: Validación inicial');
      results.validation = await this.validateWorkflowModern(workflowData, originalPrompt, options);
      results.processingSteps.push('validation');

      // 2. Autocorrección si es necesario
      if (results.validation.criticalErrors.length > 0 || results.validation.score < 70) {
        logger.info('COMPLETE', 'Paso 2: Autocorrección necesaria');
        results.autocorrection = await this.autocorrectWorkflow(workflowData, originalPrompt, options);
        if (results.autocorrection.success) {
          results.finalWorkflow = results.autocorrection.correctedWorkflow;
        }
        results.processingSteps.push('autocorrection');
      }

      // 3. Continuación si está truncado
      if (options.enableContinuation !== false && originalPrompt.length > 100) {
        logger.info('COMPLETE', 'Paso 3: Verificación de continuación');
        const continuationCheck = await this.continuationSystem.analyzeWorkflowCompleteness(results.finalWorkflow, originalPrompt);
        
        if (continuationCheck.needsContinuation) {
          logger.info('COMPLETE', 'Aplicando continuación de workflow');
          results.continuation = await this.continueWorkflow(results.finalWorkflow, originalPrompt, options);
          if (results.continuation.success) {
            results.finalWorkflow = results.continuation.extendedWorkflow;
          }
          results.processingSteps.push('continuation');
        }
      }

      // 4. Optimización de layout
      logger.info('COMPLETE', 'Paso 4: Optimización de layout');
      results.layoutOptimization = await this.optimizeWorkflowLayout(results.finalWorkflow, null, options);
      if (results.layoutOptimization.success) {
        results.finalWorkflow = results.layoutOptimization.workflow;
      }
      results.processingSteps.push('layout_optimization');

      // 5. Validación final
      logger.info('COMPLETE', 'Paso 5: Validación final');
      const finalValidation = await this.validateWorkflowModern(results.finalWorkflow, originalPrompt, options);
      results.finalValidation = finalValidation;
      results.processingSteps.push('final_validation');

      logger.success('COMPLETE', 'Procesamiento completo finalizado', {
        stepsCompleted: results.processingSteps.length,
        finalScore: finalValidation.score,
        finalValid: finalValidation.isValid
      });

      return results;
      
    } catch (error) {
      logger.error('COMPLETE', 'Error crítico en procesamiento completo', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  // Método para reparar JSON usando el agente integrado
  async repairWorkflowJSON(jsonString, originalPrompt = '', options = {}) {
    try {
      logger.info('REPAIR', 'Iniciando reparación de JSON con JSONRepairAgent V3.0');
      
      const repairOptions = {
        originalPrompt,
        contextLength: jsonString.length,
        ...options
      };
      
      const result = await this.jsonRepairAgent.repairJSON(jsonString, repairOptions);
      
      if (result.success) {
        logger.success('REPAIR', 'JSON reparado exitosamente', { 
          method: result.method,
          originalLength: jsonString.length,
          repairedLength: result.repairedJSON.length
        });
        
        // Obtener estadísticas del agente
        const stats = this.jsonRepairAgent.getStats();
        logger.info('REPAIR', 'Estadísticas del JSONRepairAgent', stats);
        
        return {
          success: true,
          repairedJSON: result.repairedJSON,
          method: result.method,
          stats
        };
      } else {
        logger.error('REPAIR', 'Fallo en reparación de JSON', { error: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      logger.error('REPAIR', 'Error crítico en reparación de JSON', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  // Método para reparar JSON usando el agente integrado
  async repairWorkflowJSON(jsonString, originalPrompt = '', options = {}) {
    try {
      logger.info('REPAIR', 'Iniciando reparación de JSON con JSONRepairAgent V3.0');
      
      const repairOptions = {
        originalPrompt,
        contextLength: jsonString.length,
        ...options
      };
      
      const result = await this.jsonRepairAgent.repairJSON(jsonString, repairOptions);
      
      if (result.success) {
        logger.success('REPAIR', 'JSON reparado exitosamente', { 
          method: result.method,
          originalLength: jsonString.length,
          repairedLength: result.repairedJSON.length
        });
        
        // Obtener estadísticas del agente
        const stats = this.jsonRepairAgent.getStats();
        logger.info('REPAIR', 'Estadísticas del JSONRepairAgent', stats);
        
        return {
          success: true,
          repairedJSON: result.repairedJSON,
          method: result.method,
          stats
        };
      } else {
        logger.error('REPAIR', 'Fallo en reparación de JSON', { error: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      logger.error('REPAIR', 'Error crítico en reparación de JSON', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  async callGeminiMassive(messages, maxTokens = 50000, temperature = 1.0) {
    try {
      logger.info('GEMINI', 'Llamada masiva a Gemini', { messageCount: messages.length });
      logger.info('SYSTEM', 'Extension Server (ULTRA) usando Router Gemini Inteligente');
      
      const promptText = messages.map(msg => 
        typeof msg === 'string' ? msg : (msg.content || msg.text || JSON.stringify(msg))
      ).join(' ');
      
      const response = await this.geminiRouter.generateContent(
        promptText, 
        'extension-server',
        { maxTokens, temperature }
      );
      
      logger.success('GEMINI', 'Respuesta exitosa del Router Gemini');
      return response;
      
    } catch (error) {
      logger.error('GEMINI', 'Error en callGeminiMassive con Router', { error: error.message });
      logger.warn('FALLBACK', 'Intentando fallback al método directo...');
      // Aquí iría la lógica de fallback si se desea mantener
      throw error;
    }
  }

  /**
   * Método principal para procesar prompts de usuario
   */
  async processUserPrompt(prompt) {
    try {
      logger.info('PROMPT', 'Procesando prompt del usuario', { prompt: prompt.substring(0, 100) + '...' });

      // 1. Mejora del prompt usando el agente de mejora
      let finalPrompt = prompt; // Usar el prompt original como fallback
      try {
        const enhancedResult = await this.promptAgent.enhancePrompt(prompt);
        finalPrompt = typeof enhancedResult === 'string' ? enhancedResult : 
                      enhancedResult?.enhancedPrompt || enhancedResult?.prompt || prompt;
      } catch (enhanceError) {
        logger.warn('PROMPT', 'Error en mejora de prompt, usando original', { error: enhanceError.message });
      }
      
      logger.info('PROMPT', 'Prompt procesado', { 
        originalLength: prompt.length, 
        finalLength: finalPrompt.length,
        enhanced: finalPrompt !== prompt
      });

      // 2. Buscar workflows similares
      logger.info('SEARCH', 'Buscando workflows similares...');
      const searchResults = await this.searchAgent.searchSimilarWorkflows(finalPrompt);
      const curatedExamples = this.searchAgent.getCuratedExamples();
      
      logger.success('SEARCH', 'Búsqueda completada', {
        searchResults: searchResults.length,
        curatedExamples: curatedExamples.length,
        totalWorkflows: searchResults.length + curatedExamples.length
      });

      // 3. Preparar contexto de ejemplos
      const exampleContext = this.prepareExampleContext(searchResults, curatedExamples);

      // 4. Usar el sistema híbrido V4 Ultra para generar el workflow
      logger.info('GENERATION', 'Iniciando generación con V4UltraHybrid');
      const result = await this.v4UltraHybrid.generateWorkflow(finalPrompt, {
        searchResults,
        curatedExamples,
        exampleContext,
        enableContinuation: true,
        enableAutocorrection: true,
        enableValidation: true,
        enableLayoutOptimization: true
      });

      if (result.success) {
        logger.success('GENERATION', 'Workflow generado exitosamente', {
          filename: result.filename,
          nodeCount: result.workflow?.nodes?.length || 0,
          method: result.method || 'v4-ultra-hybrid'
        });

        // 5. Procesar con módulos V3.0+ para mejorar calidad
        if (result.workflow) {
          logger.info('PROCESSING', 'Aplicando procesamiento completo con módulos V3.0+');
          const processedResult = await this.processWorkflowComplete(result.workflow, finalPrompt, {
            enableContinuation: true,
            enableAutocorrection: true,
            enableLayoutOptimization: true
          });

          if (processedResult.success) {
            result.workflow = processedResult.finalWorkflow;
            result.processingSteps = processedResult.processingSteps;
            result.validationResults = processedResult.validation;
            
            logger.success('PROCESSING', 'Procesamiento completo exitoso', {
              stepsCompleted: processedResult.processingSteps.length,
              finalScore: processedResult.finalValidation?.score
            });
          }
        }
      } else {
        logger.error('GENERATION', 'Error en generación de workflow', { error: result.error });
      }

      return result;

    } catch (error) {
      logger.error('PROMPT', 'Error crítico en procesamiento de prompt', { 
        error: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Preparar contexto de ejemplos para generación
   */
  prepareExampleContext(searchResults, curatedExamples) {
    const allExamples = [...searchResults, ...curatedExamples];
    
    // Seleccionar los mejores ejemplos basados en relevancia
    const relevantExamples = allExamples
      .filter(example => example.similarity > 0.3 || example.relevanceScore > 0.3)
      .slice(0, 3) // Limitar a los 3 más relevantes
      .map(example => ({
        name: example.workflow?.name || 'Workflow Example',
        description: example.description || example.metadata?.description || 'No description',
        nodes: example.workflow?.nodes?.length || 0,
        category: example.metadata?.category || 'general'
      }));

    return {
      exampleCount: relevantExamples.length,
      examples: relevantExamples,
      categories: [...new Set(relevantExamples.map(e => e.category))],
      totalNodes: relevantExamples.reduce((sum, e) => sum + e.nodes, 0)
    };
  }

  /**
   * Búsqueda avanzada de workflows con contexto
   */
  async searchWorkflowsWithContext(prompt, maxResults = 5) {
    try {
      logger.info('SEARCH', 'Búsqueda avanzada iniciada', { prompt: prompt.substring(0, 50) + '...' });

      // Búsqueda en paralelo con diferentes estrategias
      const [similarResults, fastResults] = await Promise.all([
        this.searchAgent.searchSimilarWorkflows(prompt),
        this.searchAgent.fastSearch(prompt)
      ]);

      // Combinar y deduplificar resultados
      const combinedResults = [...similarResults, ...fastResults.results]
        .filter((result, index, array) => 
          array.findIndex(r => r.workflow?.id === result.workflow?.id) === index
        )
        .sort((a, b) => (b.similarity || b.relevanceScore || 0) - (a.similarity || a.relevanceScore || 0))
        .slice(0, maxResults);

      logger.success('SEARCH', 'Búsqueda avanzada completada', {
        totalFound: combinedResults.length,
        avgRelevance: combinedResults.length > 0 ? 
          (combinedResults.reduce((sum, r) => sum + (r.similarity || r.relevanceScore || 0), 0) / combinedResults.length).toFixed(3) : 0
      });

      return combinedResults;

    } catch (error) {
      logger.error('SEARCH', 'Error en búsqueda avanzada', { error: error.message });
      return [];
    }
  }
}

// Función principal para ejecutar el servidor
async function main() {
  logger.info('SYSTEM', '============================================================');
  logger.info('SYSTEM', '🤖 n8n AI ASSISTANT - SISTEMA ULTRA');
  logger.info('SYSTEM', '============================================================');

  const args = process.argv.slice(2);
  const inputPrompt = args.join(' ').trim();

  if (!inputPrompt) {
    logger.error('INPUT', 'Debes proporcionar un prompt.');
    process.exit(1);
  }

  logger.info('MAIN', 'Iniciando generación de workflow', { prompt: inputPrompt.substring(0, 100) + '...' });
  
  const assistant = new N8nAIAssistant();
  
  try {
    // Usar el método de procesamiento completo en lugar del híbrido directo
    const result = await assistant.processUserPrompt(inputPrompt);
    
    if (result.success) {
        logger.success('WORKFLOW', 'Workflow generado exitosamente', { 
          filename: result.filename,
          nodeCount: result.workflow?.nodes?.length || 0,
          processingSteps: result.processingSteps?.length || 0,
          finalScore: result.validationResults?.score || 'N/A'
        });
    } else {
        logger.error('WORKFLOW', 'Error en generación de workflow', { error: result.error });
    }
  } catch (error) {
    logger.error('SYSTEM', 'Error crítico en generación', { error: error.message, stack: error.stack });
  }
}

main();

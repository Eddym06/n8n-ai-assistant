/**
 * JSON REPAIR AGENT V3.0 - Sistema Independiente de Reparación de JSON
 * Extraído de extension-server-fixed.js para uso modular
 * 
 * Características:
 * - Análisis automático de JSON corrupto o truncado
 * - Integración con Gemini AI para reparaciones inteligentes
 * - Validación avanzada de workflows n8n
 * - Sistema de memoria semántica integrado
 * - Manejo robusto de errores y reintentos
 */

import dotenv from 'dotenv';

// Lazy loading de fetch para mejor performance
let fetch;
const getFetch = async () => {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
  return fetch;
};

dotenv.config();

// CONSTANTES GLOBALES PARA OPTIMIZACIÓN
const COMPLEXITY_THRESHOLD = {
  LENGTH: 500,
  COMMA_COUNT: 6
};

const TOKEN_LIMITS = {
  COMPLEX: 32000,  // Incrementado masivamente para workflows de 20+ nodos
  SIMPLE: 15000,   // Incrementado para workflows más completos  
  CONTINUATION: 25000 // Específico para continuaciones
};

// Sistema de tracking de llamadas a Gemini (compatible con el sistema principal)
class GeminiCallTracker {
  static calls = [];
  static totalTokens = 0;
  
  static recordCall(agent, method, tokens, model) {
    this.calls.push({
      timestamp: new Date().toISOString(),
      agent,
      method,
      tokens,
      model
    });
    this.totalTokens += tokens;
  }
  
  static getStats() {
    return {
      totalCalls: this.calls.length,
      totalTokens: this.totalTokens,
      calls: this.calls
    };
  }
}

// CLASES AUXILIARES INTEGRADAS

class IntegratedSemanticMemoryAgent {
  constructor() {
    this.memoryStore = new Map();
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🧠 SemanticMemoryAgent inicializado - Sesión: ${this.sessionId}`);
  }

  async retrieveContext(query) {
    return this.memoryStore.get(this.hashQuery(query));
  }

  async storeContext(query, context) {
    this.memoryStore.set(this.hashQuery(query), context);
  }

  hashQuery(query) {
    if (!query || typeof query !== 'string') {
      return 'default_query_hash';
    }
    // Asegurar que query es una cadena válida antes de usar toLowerCase
    const safeQuery = String(query || '').trim();
    if (!safeQuery) {
      return 'default_query_hash';
    }
    return safeQuery.toLowerCase().replace(/\W/g, '').substring(0, 50);
  }
}

class IntegratedValidationOrchestrator {
  constructor() {
    this.validationRules = new Map();
    this.setupDefaultRules();
  }

  setupDefaultRules() {
    // Reglas básicas de validación para workflows n8n
    this.validationRules.set('required_fields', {
      name: 'Validación de campos requeridos',
      validator: (json) => {
        try {
          const data = typeof json === 'string' ? JSON.parse(json) : json;
          if (!data.nodes || !Array.isArray(data.nodes)) {
            return { isValid: false, error: 'Falta el array de nodos' };
          }
          if (!data.connections || typeof data.connections !== 'object') {
            return { isValid: false, error: 'Falta el objeto de conexiones' };
          }
          return { isValid: true };
        } catch (error) {
          return { isValid: false, error: `Error de parsing: ${error.message}` };
        }
      }
    });

    this.validationRules.set('node_structure', {
      name: 'Validación de estructura de nodos',
      validator: (json) => {
        try {
          const data = typeof json === 'string' ? JSON.parse(json) : json;
          for (const node of data.nodes || []) {
            if (!node.name || !node.type || !node.id || !node.position) {
              return { 
                isValid: false, 
                error: `Nodo incompleto: ${JSON.stringify(node).substring(0, 100)}...` 
              };
            }
          }
          return { isValid: true };
        } catch (error) {
          return { isValid: false, error: `Error validando nodos: ${error.message}` };
        }
      }
    });
  }

  async validateRepair(repairedJSON, originalJSON, analysis) {
    console.log('🔍 IntegratedValidationOrchestrator: Iniciando validación...');
    
    // Ejecutar todas las reglas de validación
    for (const [ruleId, rule] of this.validationRules) {
      console.log(`📋 Ejecutando regla: ${rule.name}`);
      const result = rule.validator(repairedJSON);
      if (!result.isValid) {
        console.log(`❌ Regla ${rule.name} falló: ${result.error}`);
        return { isValid: false, error: result.error, failedRule: ruleId };
      }
    }

    console.log('✅ Todas las reglas de validación pasaron');
    return { isValid: true };
  }
}

// === JSON REPAIR AGENT PRINCIPAL V3.0 ===

export class JSONRepairAgent {
  constructor(apiKey, existingModel = null) {
    this.apiKey = apiKey;
    this.model = existingModel;
    this.memoryAgent = new IntegratedSemanticMemoryAgent();
    this.validationOrchestrator = new IntegratedValidationOrchestrator();
    this.repairAttempts = 0;
    this.maxRepairAttempts = 3;
    this.repairHistory = new Map();
    
    console.log('🔧 JSONRepairAgent V3.0 inicializado');
  }

  async analyzeJSON(jsonString, contextLength = 0) {
    try {
      console.log('🔍 JSONRepairAgent iniciando análisis...');
      
      // Análisis básico de la estructura JSON
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
    
    // Detección de problemas comunes
    if (!jsonString.trim().startsWith('{') && !jsonString.trim().startsWith('[')) {
      issues.push('Invalid JSON start');
      status = 'corrupted';
    }
    
    if (!jsonString.trim().endsWith('}') && !jsonString.trim().endsWith(']')) {
      issues.push('Incomplete JSON structure');
      status = 'truncated';
    }
    
    // Detección de caracteres de control problemáticos
    const controlChars = jsonString.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
    if (controlChars) {
      issues.push(`Control characters found: ${controlChars.length}`);
      status = 'corrupted';
    }
    
    // Detección de comillas desbalanceadas
    const quotes = jsonString.match(/"/g);
    if (quotes && quotes.length % 2 !== 0) {
      issues.push('Unbalanced quotes');
      status = 'corrupted';
    }
    
    return { status, issues, length: jsonString.length };
  }

  async handleCorruptedJSON(jsonString, analysis) {
    console.log('🔄 Manejando JSON corrupto...');
    
    // Verificar si hay contexto en memoria semántica
    const memoryContext = await this.memoryAgent.retrieveContext(jsonString.substring(0, 200));
    if (!memoryContext) {
      console.log('⚠️ No se encontró contexto almacenado en la memoria semántica');
    }
    
    // Solicitar reparación a Gemini
    console.log('📤 Enviando request de reparación a Gemini...');
    const repairResult = await this.requestGeminiRepair(jsonString, analysis);
    
    if (repairResult.success) {
      console.log(`📥 Recibido JSON reparado: ${repairResult.repairedJSON.length} caracteres`);
      
      // Validar el JSON reparado
      const validationResult = await this.validationOrchestrator.validateRepair(
        repairResult.repairedJSON, 
        jsonString, 
        analysis
      );
      
      if (validationResult.isValid) {
        console.log('✅ JSON corrupto reparado exitosamente');
        return { success: true, repairedJSON: repairResult.repairedJSON, method: 'gemini-repair' };
      } else {
        console.log('❌ Validación de reparación falló:', validationResult.error);
        return { success: false, error: `Validación de reparación falló: ${validationResult.error}` };
      }
    }
    
    return { success: false, error: 'No se pudo reparar el JSON corrupto' };
  }

  async repairTruncatedJSON(jsonString, options = {}) {
    console.log('🔧 JSONRepairAgent: Iniciando reparación de JSON truncado...');
    console.log(`📏 Tamaño del JSON truncado: ${jsonString.length} caracteres`);
    
    // Extraer prompt original desde options
    const originalPrompt = options.originalPrompt || 'workflow automatización';
    console.log(`🎯 Usando prompt original para contexto: ${originalPrompt.substring(0, 100)}...`);
    
    // Mostrar contexto del truncamiento
    const lastChars = jsonString.substring(Math.max(0, jsonString.length - 200));
    console.log(`📄 Últimos 200 chars: ${lastChars}`);
    
    // Detectar punto de truncamiento
    const truncationPoint = this.detectTruncationPoint(jsonString);
    console.log(`🎯 Punto de truncamiento detectado: ${truncationPoint.type} en ${truncationPoint.location}`);
    
    // Solicitar completación a Gemini CON CONTEXTO ORIGINAL
    console.log('🤖 Solicitando completación del JSON a Gemini con contexto original...');
    const completionResult = await this.requestGeminiCompletion(jsonString, truncationPoint, options, originalPrompt);
    
    if (completionResult.success) {
      console.log(`📝 Respuesta de Gemini: ${completionResult.completedJSON.length} caracteres`);
      
      try {
        const parsedJSON = JSON.parse(completionResult.completedJSON);
        console.log('✅ JSON completado exitosamente parseado');
        
        if (parsedJSON.nodes && Array.isArray(parsedJSON.nodes)) {
          console.log(`✅ Workflow completado con ${parsedJSON.nodes.length} nodos`);
        }
        
        return { success: true, repairedJSON: completionResult.completedJSON, method: 'gemini-completion' };
      } catch (parseError) {
        console.log('⚠️ JSON completado requiere reparaciones adicionales...');
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

      // 🎯 PROMPT MEJORADO CON CONTEXTO ORIGINAL Y IFs INTELIGENTES
      const prompt = `SISTEMA EXPERTO EN REPARACIÓN DE JSON n8n - COMPLETACIÓN CONTEXTUAL DE WORKFLOW 

CONTEXTO ORIGINAL DEL USUARIO:
${originalPrompt}

JSON TRUNCADO RECIBIDO:
${truncatedJSON}

ANÁLISIS DEL TRUNCAMIENTO:
- Tipo: ${truncationPoint.type}
- Ubicación: ${truncationPoint.location}
- Tamaño actual: ${truncatedJSON.length} caracteres

INSTRUCCIONES CRÍTICAS PARA COMPLETACIÓN CONTEXTUAL:
1. Este es un workflow de n8n truncado que necesita ser completado
2. DEBES completar el JSON manteniendo FIDELIDAD TOTAL al contexto original del usuario
3. Mantén la estructura existente intacta
4. Completa solo las partes faltantes basándote en el CONTEXTO ORIGINAL
5. 🚨 CAMPOS OBLIGATORIOS: CADA nodo DEBE tener estos campos sin excepción:
   - "name": string único y descriptivo (ej. "Validate Email", "Send Notification")
   - "type": string válido n8n (ej. "n8n-nodes-base.httpRequest", "n8n-nodes-base.function")
   - "id": string único (ej. "node123", "emailValidator")
   - "position": array [x, y] con números (ej. [100, 200])
   - "parameters": objeto con configuración (mínimo {} si está vacío)
   - "typeVersion": número (usar 1 por defecto)

6. Para nodos IF, usa estas condiciones inteligentes basadas en el contexto:

🎯 CONDICIONES IF INTELIGENTES ESPECÍFICAS:
- "If Duplicate Lead": {{ "{{ $json.email === $('Check CRM for Duplicate').first().json.email }}" }}
- "If Lead Qualified": {{ "{{ $json.score >= 75 }}" }}
- "If Lead Score > Threshold": {{ "{{ $json.leadScore > 70 }}" }}
- "Check Milestone Dates": {{ "{{ new Date($json.dueDate) <= new Date() }}" }}
- "If Escalation Needed": {{ "{{ $json.priority === 'high' || $json.urgency === 'critical' }}" }}
- "If Stock Low": {{ "{{ $json.currentStock <= $json.minimumStock }}" }}

7. Para nodos de procesamiento, usa parámetros realistas basados en el contexto original
8. El workflow debe ser 100% ejecutable y funcional según los requisitos originales
9. Asegúrate de que el JSON final sea válido sintácticamente

RESPUESTA REQUERIDA:
Devuelve ÚNICAMENTE el JSON completo y válido, sin explicaciones ni comentarios.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Registrar llamada en el tracker global
      GeminiCallTracker.recordCall('JSONRepairAgent', 'generateContent', prompt.length, 'gemini-2.5-flash');
      
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

      const prompt = `SISTEMA EXPERTO EN REPARACIÓN DE JSON - CORRECCIÓN DE ESTRUCTURAS CORRUPTAS

JSON CORRUPTO DETECTADO:
${corruptedJSON.substring(0, 2000)}...

PROBLEMAS IDENTIFICADOS:
${analysis.issues.join(', ')}

INSTRUCCIONES DE REPARACIÓN:
1. Corrige ÚNICAMENTE los errores de sintaxis JSON
2. NO modifiques el contenido semántico del workflow
3. Asegúrate de que el JSON final sea válido y parseable
4. Mantén la estructura de nodos y conexiones de n8n
5. Corrige caracteres de control, comillas desbalanceadas, etc.

RESPUESTA:
Devuelve ÚNICAMENTE el JSON reparado, sin explicaciones.`;

      // Registrar llamada en el tracker global
      GeminiCallTracker.recordCall('JSONRepairAgent', 'generateContent', prompt.length, 'gemini-2.5-flash');

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return { success: true, repairedJSON: response.trim() };
    } catch (error) {
      return { success: false, error: `Gemini repair failed: ${error.message}` };
    }
  }

  // Método público para integración con otros sistemas
  async repairJSON(jsonString, options = {}) {
    console.log('🔧 JSONRepairAgent: Iniciando proceso de reparación...');
    
    this.repairAttempts++;
    const repairId = `repair_${Date.now()}_${this.repairAttempts}`;
    
    // Almacenar en historial
    this.repairHistory.set(repairId, {
      originalJSON: jsonString.substring(0, 1000), // Solo primeros 1000 chars para memoria
      timestamp: new Date().toISOString(),
      options
    });
    
    const result = await this.analyzeJSON(jsonString, options.contextLength || 0);
    
    // Actualizar historial con resultado
    const historyEntry = this.repairHistory.get(repairId);
    historyEntry.result = result;
    historyEntry.success = result.success;
    
    return result;
  }

  // Método para obtener estadísticas del agente
  getStats() {
    return {
      repairAttempts: this.repairAttempts,
      maxRepairAttempts: this.maxRepairAttempts,
      historySize: this.repairHistory.size,
      sessionId: this.memoryAgent.sessionId,
      geminiCalls: GeminiCallTracker.getStats()
    };
  }
}

// Exportaciones adicionales para compatibilidad
export { GeminiCallTracker, IntegratedSemanticMemoryAgent, IntegratedValidationOrchestrator };

// Función de conveniencia para uso rápido
export async function repairJSON(jsonString, apiKey, options = {}) {
  const agent = new JSONRepairAgent(apiKey);
  return await agent.repairJSON(jsonString, options);
}

console.log('📦 JSON Repair Agent V3.0 cargado y listo para uso');
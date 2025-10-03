// Servidor Node que simula la extensión n8n AI Assistant - CON SISTEMA DE CONTINUACIÓN Y AUTOCORRECTOR
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Definiciones globales optimizadas
import { URL } from 'url';
import { setTimeout, clearTimeout } from 'timers';
import util from 'util';

// 🎯 IMPORTACIÓN DE MÓDULOS INDEPENDIENTES
import { WorkflowValidator } from './workflow-validator.js';

// 🔧 IMPORTACIÓN DEL SISTEMA DE VALIDACIÓN INDEPENDIENTE
import { N8nValidationSystem, IntegratedValidationOrchestrator } from './validation-system.js';

// 🔧 INTEGRACIÓN DEL AUTOCORRECTOR INTELIGENTE
import AutocorrectorFlujos from './Herramienta-Autocorrector.js';

// 🔧 INTEGRACIÓN DEL CORRECTOR DE NOMBRES INTELIGENTE
import IntelligentNameCorrector from './intelligent-name-corrector.js';

// 🎯 INTEGRACIÓN DEL SISTEMA DE POSICIONAMIENTO INTELIGENTE V4.0
import IntelligentPositioningAgent from './intelligent-positioning-agent.js';

// 🎯 INTEGRACIÓN DE AGENTES INDEPENDIENTES
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import WorkflowSearchAgentNew from './workflow-search-agent-new.js';
import SemanticMemoryAgent from './semantic-memory-agent.js';

// === JSON REPAIR AGENT INTEGRADO ===
// Sistema integrado de reparación de JSON con IA avanzada - VERSIÓN INTEGRADA V4.0

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

// CLASES AUXILIARES INTEGRADAS (para evitar dependencias externas)

// === JSON REPAIR AGENT INTEGRADO V4.0 ===
// Sistema ultra-robusto de reparación de JSON con IA avanzada

class IntegratedJSONRepairAgent {
  constructor(apiKey, existingModel = null) {
    this.apiKey = apiKey;
    this.model = existingModel;
    this.memoryAgent = new IntegratedSemanticMemoryAgent();
    this.validationOrchestrator = new IntegratedValidationOrchestrator();
    this.repairAttempts = 0;
    this.maxRepairAttempts = 3;
    this.repairHistory = new Map();
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
5. Para nodos IF, usa estas condiciones inteligentes basadas en el contexto:

🎯 CONDICIONES IF INTELIGENTES ESPECÍFICAS:
- "If Duplicate Lead": {{ "{{ $json.email === $('Check CRM for Duplicate').first().json.email }}" }}
- "If Lead Qualified": {{ "{{ $json.score >= 75 }}" }}
- "If Lead Score > Threshold": {{ "{{ $json.leadScore > 70 }}" }}
- "Check Milestone Dates": {{ "{{ new Date($json.dueDate) <= new Date() }}" }}
- "If Escalation Needed": {{ "{{ $json.priority === 'high' || $json.urgency === 'critical' }}" }}
- "If Stock Low": {{ "{{ $json.currentStock <= $json.minimumStock }}" }}

6. Para nodos de procesamiento, usa parámetros realistas basados en el contexto original
7. El workflow debe ser 100% ejecutable y funcional según los requisitos originales
8. Asegúrate de que el JSON final sea válido sintácticamente

RESPUESTA REQUERIDA:
Devuelve ÚNICAMENTE el JSON completo y válido, sin explicaciones ni comentarios.`;

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

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return { success: true, repairedJSON: response.trim() };
    } catch (error) {
      return { success: false, error: `Gemini repair failed: ${error.message}` };
    }
  }
}

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
    return query.toLowerCase().replace(/\W/g, '').substring(0, 50);
  }
}

// === FIN DE LA CLASE ANTERIOR ===

// Función principal modificada para recibir prompt desde terminal
async function main() {
  console.log('============================================================');
  console.log('🤖 n8n AI ASSISTANT - SISTEMA DE PRODUCCIÓN CON MÚLTIPLES MODELOS');
  console.log('============================================================');

  // Mostrar modelos disponibles
  const tempAssistant = new N8nAIAssistant();
  tempAssistant.showAvailableModels();

  // Obtener prompt desde argumentos de línea de comandos
  const args = process.argv.slice(2);
  const isTestExtender = args[0] === 'test-extender';
  const inputPrompt = isTestExtender ? args.slice(1).join(' ').trim() : args.join(' ').trim();

  if (!inputPrompt) {
    console.log('❌ ERROR: Debes proporcionar un prompt como argumento');
    console.log('');
    console.log('📋 USAGE:');
    console.log('  node "extension server models.js" "tu prompt aquí"');
    console.log('  node "extension server models.js" test-extender "tu prompt para extender"');
    console.log('');
    console.log('🔧 CAMBIAR MODELO:');
    console.log('  DEFAULT_MODEL=gemini node "extension server models.js" "tu prompt"');
    console.log('  DEFAULT_MODEL=openai node "extension server models.js" "tu prompt"');
    console.log('  DEFAULT_MODEL=openrouter node "extension server models.js" "tu prompt"');
    console.log('');
    console.log('💡 EJEMPLOS:');
    console.log('  node "extension server models.js" "Crear un workflow que lea emails y los guarde en Google Sheets"');
    console.log('  DEFAULT_MODEL=openai node "extension server models.js" "Sistema complejo de e-commerce con IA"');
    console.log('  DEFAULT_MODEL=openrouter node "extension server models.js" test-extender "Workflow de Telegram"');
    process.exit(1);
  }

  console.log(`🎯 PROMPT:`);
  console.log(`"${inputPrompt}"`);
  console.log('');

  const assistant = new N8nAIAssistant();
  
  try {
    if (isTestExtender) {
      console.log('🚀 INICIANDO PRUEBA DEL EXTENSOR DE FLUJOS...');
      const result = await assistant.extendWorkflow(inputPrompt);
      console.log('🎉 PRUEBA DE EXTENSOR COMPLETADA:');
      console.log(`   📊 Nodos generados: ${result?.nodes?.length || 0}`);
      console.log(`   🔗 Conexiones: ${Object.keys(result?.connections || {}).length}`);
      console.log(`   📁 Archivo guardado: ${result?.filename || 'N/A'}`);
    } else {
      const result = await assistant.processUserPromptV2(inputPrompt);
      if (result.success) {
        console.log(`\n🎯 ¡Workflow generado exitosamente!`);
        console.log(`📁 Archivo: ${result.filename}`);
        console.log(`📊 Nodos: ${result.workflow?.nodes?.length || 0}`);
        console.log(`🔗 Conexiones: ${Object.keys(result.workflow?.connections || {}).length}`);
        console.log(`📝 Mensaje: ${result.message}`);
        console.log('');
        console.log('💡 Para generar otro workflow usa: node "extension server fixed.js" "nuevo prompt"');
      
      // Información del sistema de continuación
      if (result.wasIncomplete) {
        console.log(`\n🔄 SISTEMA DE CONTINUACIÓN ACTIVADO:`);
        console.log(`✅ Completado automáticamente: ${result.completedAutomatically}`);
        if (!result.completedAutomatically && result.incompletionReason) {
          console.log(`❌ Razón de fallo: ${result.incompletionReason}`);
        }
      }
      
      console.log(`📝 Mensaje: ${result.message}`);
      console.log('\n💡 Para generar otro workflow usa: node "extension server fixed.js" "nuevo prompt"');
      } else {
        console.log(`\n❌ Error: ${result.error}`);
      }
    }
  } catch (error) {
    console.error(`\n💥 Error crítico: ${error.message}`);
  }
}

// CLASE PRINCIPAL DEL ASISTENTE
class N8nAIAssistant {
  constructor() {
    this.searchAgent = new WorkflowSearchAgentNew();
    this.promptAgent = new PromptEnhancementAgent();
    this.semanticMemory = new SemanticMemoryAgent();

    // 🚀 INTEGRACIÓN DEL SISTEMA DE VALIDACIÓN INDEPENDIENTE
    this.validationSystem = new N8nValidationSystem();
    this.workflowValidator = new WorkflowValidator(); // Mantenido por compatibilidad

    this.isComplexPrompt = false;
    this.requestCache = new Map(); // Cache para evitar llamadas duplicadas
    this.timeouts = new Set(); // Para manejo de timeouts

    // 🚀 INTEGRACIÓN DEL JSON REPAIR AGENT V3.0
    this.jsonRepairAgent = null; // Inicializado bajo demanda para mejor performance - VERSIÓN INTEGRADA V4.0

    // 🔧 INICIALIZACIÓN DEL AUTOCORRECTOR
    this.autocorrector = null; // Inicializado bajo demanda

    this.currentWorkflow = '';

    // 🆕 EL SISTEMA DE VALIDACIÓN AHORA ESTÁ EN EL MÓDULO INDEPENDIENTE
    // this.validNodeTypes = { ... } // Movido a validation-system.js
    // this.nodeValidations = this.getNodeValidations(); // Movido a validation-system.js
    // this.credentialValidations = this.getCredentialValidations(); // Movido a validation-system.js
    // this.connectionValidations = this.getConnectionValidations(); // Movido a validation-system.js
  }

  // 🆕 MÉTODO PARA GENERAR IDs ÚNICOS DE NODOS
  generateNodeId() {
    return `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // SISTEMA DE CORRECCIÓN AUTOMÁTICA DE NODOS
  getNodeCorrections() {
    return {
      // Correcciones para tipos de nodos que no existen o son incorrectos
      'n8n-nodes-base.googleVision': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Google Vision debe usar HTTP Request con la API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://vision.googleapis.com/v1/images:annotate',
          authentication: 'serviceAccount',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            requests: [
              {
                image: { 
                  content: originalParams.imageUrl ? 
                    `={{ $httpRequest(\"${originalParams.imageUrl}\").body }}` : 
                    '={{ $base64($binary.data) }}'
                },
                features: [{ 
                  type: originalParams.operation === 'textDetection' ? 'TEXT_DETECTION' : 'LABEL_DETECTION',
                  maxResults: 50 
                }]
              }
            ]
          }
        })
      },

      'n8n-nodes-base.whatsappBusiness': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'WhatsApp Business debe usar HTTP Request con Graph API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://graph.facebook.com/v18.0/{{ $credentials.whatsappPhoneNumberId }}/messages',
          authentication: 'predefinedCredentialType',
          headers: {
            'Authorization': 'Bearer {{ $credentials.whatsappToken }}',
            'Content-Type': 'application/json'
          },
          body: {
            messaging_product: 'whatsapp',
            to: originalParams.to || '={{ $json.phoneNumber }}',
            type: 'text',
            text: { 
              body: originalParams.text || originalParams.message || '={{ $json.message }}'
            }
          }
        })
      },

      'n8n-nodes-base.anthropic': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Anthropic/Claude debe usar HTTP Request con la API oficial',
        generateParams: () => ({
          method: 'POST',
          url: 'https://api.anthropic.com/v1/messages',
          authentication: 'predefinedCredentialType',
          headers: {
            'x-api-key': '={{ $credentials.anthropicApiKey }}',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: '={{ $json.prompt }}'
              }
            ]
          }
        })
      },

      'n8n-nodes-base.stripeTrigger': {
        newType: 'n8n-nodes-base.webhook',
        reason: 'Stripe debe usar Webhook para recibir eventos',
        generateParams: (originalParams) => ({
          httpMethod: 'POST',
          path: 'stripe-webhook',
          responseMode: 'onReceived',
          options: {}
        })
      },

      'n8n-nodes-base.googleDriveApi': {
        newType: 'n8n-nodes-base.googleDrive',
        reason: 'Usar el nodo oficial de Google Drive',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.telegramBot': {
        newType: 'n8n-nodes-base.telegram',
        reason: 'Usar el nodo oficial de Telegram',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.paypalApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'PayPal debe usar HTTP Request con la API REST',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://api-m.paypal.com/v1/payments/payment',
          authentication: 'oAuth2Api',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      },

      // CORRECCIONES ADICIONALES PARA APIS COMUNES
      'n8n-nodes-base.openaiApi': {
        newType: 'n8n-nodes-base.openAi',
        reason: 'Usar el nodo oficial de OpenAI',
        generateParams: (originalParams) => ({
          model: originalParams.model || 'gpt-3.5-turbo',
          messages: originalParams.messages || [
            {
              role: 'user',
              content: originalParams.prompt || '={{ $json.prompt }}'
            }
          ]
        })
      },

      'n8n-nodes-base.geminiApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Gemini debe usar HTTP Request con Google AI API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
          headers: {
            'x-goog-api-key': '={{ $credentials.geminiApiKey }}',
            'Content-Type': 'application/json'
          },
          body: {
            contents: [{
              parts: [{
                text: originalParams.prompt || '={{ $json.prompt }}'
              }]
            }]
          }
        })
      },

      'n8n-nodes-base.claudeApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Claude debe usar HTTP Request con Anthropic API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://api.anthropic.com/v1/messages',
          headers: {
            'x-api-key': '={{ $credentials.anthropicApiKey }}',
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: {
            model: originalParams.model || 'claude-3-sonnet-20240229',
            max_tokens: originalParams.max_tokens || 1024,
            messages: [{
              role: 'user',
              content: originalParams.prompt || '={{ $json.prompt }}'
            }]
          }
        })
      },

      // CORRECCIONES PARA SERVICIOS DE MENSAJERÍA
      'n8n-nodes-base.whatsappApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'WhatsApp debe usar HTTP Request con Business API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://graph.facebook.com/v18.0/{{ $credentials.phoneNumberId }}/messages',
          headers: {
            'Authorization': 'Bearer {{ $credentials.accessToken }}',
            'Content-Type': 'application/json'
          },
          body: {
            messaging_product: 'whatsapp',
            to: originalParams.to || '={{ $json.phoneNumber }}',
            type: 'text',
            text: {
              body: originalParams.message || '={{ $json.message }}'
            }
          }
        })
      },

      'n8n-nodes-base.messengerApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Facebook Messenger debe usar HTTP Request con Graph API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://graph.facebook.com/v18.0/me/messages',
          headers: {
            'Authorization': 'Bearer {{ $credentials.pageAccessToken }}',
            'Content-Type': 'application/json'
          },
          body: {
            recipient: { id: originalParams.recipientId || '={{ $json.recipientId }}' },
            message: { text: originalParams.message || '={{ $json.message }}' }
          }
        })
      },

      // CORRECCIONES PARA SERVICIOS EN LA NUBE
      'n8n-nodes-base.awsApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'AWS debe usar HTTP Request con autenticación AWS',
        generateParams: (originalParams) => ({
          method: originalParams.method || 'GET',
          url: originalParams.url || 'https://{{ $credentials.region }}.amazonaws.com/',
          authentication: 'aws',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      },

      'n8n-nodes-base.gcpApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Google Cloud debe usar HTTP Request with Service Account',
        generateParams: (originalParams) => ({
          method: originalParams.method || 'GET',
          url: originalParams.url || 'https://googleapis.com/',
          authentication: 'serviceAccount',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      },

      'n8n-nodes-base.azureApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Azure debe usar HTTP Request con OAuth2',
        generateParams: (originalParams) => ({
          method: originalParams.method || 'GET',
          url: originalParams.url || 'https://management.azure.com/',
          authentication: 'oAuth2Api',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      },

      // CORRECCIONES PARA BASES DE DATOS
      'n8n-nodes-base.mongodbApi': {
        newType: 'n8n-nodes-base.mongoDb',
        reason: 'Usar el nodo oficial de MongoDB',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.mysqlApi': {
        newType: 'n8n-nodes-base.mysql',
        reason: 'Usar el nodo oficial de MySQL',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.postgresApi': {
        newType: 'n8n-nodes-base.postgres',
        reason: 'Usar el nodo oficial de PostgreSQL',
        generateParams: (originalParams) => originalParams
      },

      // CORRECCIONES PARA SERVICIOS DE EMAIL
      'n8n-nodes-base.emailApi': {
        newType: 'n8n-nodes-base.emailSend',
        reason: 'Usar el nodo oficial de Email Send',
        generateParams: (originalParams) => ({
          to: originalParams.to || '={{ $json.email }}',
          subject: originalParams.subject || '={{ $json.subject }}',
          text: originalParams.text || originalParams.body || '={{ $json.message }}'
        })
      },

      'n8n-nodes-base.sendgridApi': {
        newType: 'n8n-nodes-base.sendgrid',
        reason: 'Usar el nodo oficial de SendGrid',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.mailgunApi': {
        newType: 'n8n-nodes-base.mailgun',
        reason: 'Usar el nodo oficial de Mailgun',
        generateParams: (originalParams) => originalParams
      },

      // CORRECCIONES PARA REDES SOCIALES
      'n8n-nodes-base.twitterApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Twitter debe usar HTTP Request con OAuth 2.0',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://api.twitter.com/2/tweets',
          authentication: 'oAuth2Api',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            text: originalParams.text || originalParams.tweet || '={{ $json.message }}'
          }
        })
      },

      'n8n-nodes-base.facebookApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Facebook debe usar HTTP Request con Graph API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://graph.facebook.com/v18.0/{{ $credentials.pageId }}/feed',
          headers: {
            'Authorization': 'Bearer {{ $credentials.accessToken }}',
            'Content-Type': 'application/json'
          },
          body: {
            message: originalParams.message || '={{ $json.message }}'
          }
        })
      },

      'n8n-nodes-base.instagramApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Instagram debe usar HTTP Request con Graph API',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://graph.facebook.com/v18.0/{{ $credentials.instagramAccountId }}/media',
          headers: {
            'Authorization': 'Bearer {{ $credentials.accessToken }}',
            'Content-Type': 'application/json'
          },
          body: {
            image_url: originalParams.imageUrl || '={{ $json.imageUrl }}',
            caption: originalParams.caption || '={{ $json.caption }}'
          }
        })
      },

      'n8n-nodes-base.linkedinApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'LinkedIn debe usar HTTP Request con OAuth 2.0',
        generateParams: (originalParams) => ({
          method: 'POST',
          url: 'https://api.linkedin.com/v2/ugcPosts',
          authentication: 'oAuth2Api',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            author: '={{ $credentials.personUrn }}',
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: originalParams.text || '={{ $json.message }}'
                }
              }
            }
          }
        })
      },

      // CORRECCIONES PARA SERVICIOS DE ALMACENAMIENTO
      'n8n-nodes-base.dropboxApi': {
        newType: 'n8n-nodes-base.dropbox',
        reason: 'Usar el nodo oficial de Dropbox',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.oneDriveApi': {
        newType: 'n8n-nodes-base.microsoftOneDrive',
        reason: 'Usar el nodo oficial de Microsoft OneDrive',
        generateParams: (originalParams) => originalParams
      },

      // CORRECCIONES PARA NODOS DE IA Y AGENTES (LOS MÁS PROBLEMÁTICOS)
      'n8n-nodes-base.documentLoader': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'DocumentLoader no existe - usar HTTP Request para cargar documentos web',
        generateParams: (originalParams) => ({
          method: 'GET',
          url: originalParams.url || 'https://docs.n8n.io',
          options: {
            response: {
              response: {
                responseFormat: 'text'
              }
            }
          }
        })
      },

      'n8n-nodes-base.textSplitter': {
        newType: 'n8n-nodes-base.function',
        reason: 'TextSplitter no existe - usar Function para dividir texto',
        generateParams: (originalParams) => ({
          functionCode: `
// Función para dividir texto en chunks
const text = $input.first().json.data || $input.first().json.text || "";
const chunkSize = ${originalParams.chunkSize || 1000};
const chunkOverlap = ${originalParams.chunkOverlap || 200};

const chunks = [];
for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
  chunks.push({
    text: text.slice(i, i + chunkSize),
    index: Math.floor(i / (chunkSize - chunkOverlap))
  });
}

return chunks.map(chunk => ({ json: chunk }));`
        })
      },

      'n8n-nodes-base.embeddings': {
        newType: 'n8n-nodes-base.openAi',
        reason: 'Embeddings no existe - usar OpenAI para generar embeddings',
        generateParams: (originalParams) => ({
          resource: 'text',
          operation: 'complete',
          model: 'text-embedding-ada-002',
          prompt: originalParams.text || '={{ $json.text }}',
          options: {}
        })
      },

      'n8n-nodes-base.chromaDb': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'ChromaDB no existe - usar HTTP Request para vector database',
        generateParams: (originalParams) => ({
          method: originalParams.operation === 'addDocuments' ? 'POST' : 'GET',
          url: `http://localhost:8000/api/v1/collections/${originalParams.collectionName || 'default'}/add`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            documents: originalParams.documents || '={{ $json.data }}',
            ids: ['doc-{{ $json.index }}']
          }
        })
      },

      'n8n-nodes-base.aiMemory': {
        newType: 'n8n-nodes-base.function',
        reason: 'aiMemory no existe - usar Function para memoria conversacional',
        generateParams: (originalParams) => ({
          functionCode: `
// Función para manejo de memoria conversacional
const sessionId = $input.first().json.sessionId || 'default';
const input = $input.first().json.query || $input.first().json.input || '';

// Simular memoria conversacional (en producción usar Redis/DB)
const memory = {
  sessionId: sessionId,
  input: input,
  timestamp: new Date().toISOString(),
  context: 'Conversational memory loaded'
};

return [{ json: { memory, sessionId, input } }];`
        })
      },

      'n8n-nodes-base.langchain-agent': {
        newType: 'n8n-nodes-base.openAi',
        reason: 'LangChain Agent no existe - usar OpenAI como agente inteligente',
        generateParams: (originalParams) => ({
          resource: 'chat',
          operation: 'complete',
          model: 'gpt-4',
          messages: {
            messageType: 'multipleMessages',
            values: [
              {
                role: 'system',
                content: originalParams.prompt || 'You are an AI assistant that can process documents, remember conversations, and execute applications. Respond to the user query and suggest actions when needed.'
              },
              {
                role: 'user', 
                content: '={{ $json.query || $json.input || "Please help me with my request" }}'
              }
            ]
          },
          options: {
            temperature: 0.7,
            maxTokens: 1000
          }
        })
      },

      'n8n-nodes-base.webhookResponse': {
        newType: 'n8n-nodes-base.respondToWebhook',
        reason: 'webhookResponse no existe - usar respondToWebhook',
        generateParams: (originalParams) => ({
          options: {},
          responseBody: originalParams.responseData || '={{ $json.response || $json }}',
          responseCode: 200,
          responseHeaders: {
            'Content-Type': 'application/json'
          }
        })
      },
      'n8n-nodes-base.httpApi': {
        newType: 'n8n-nodes-base.httpRequest',
        reason: 'Corregir nombre de nodo HTTP',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.webhookTrigger': {
        newType: 'n8n-nodes-base.webhook',
        reason: 'Corregir nombre de nodo Webhook',
        generateParams: (originalParams) => originalParams
      },

      'n8n-nodes-base.cronTrigger': {
        newType: 'n8n-nodes-base.cron',
        reason: 'Corregir nombre de nodo Cron',
        generateParams: (originalParams) => originalParams
      },

      // CORRECCIONES PARA BASES DE DATOS
      'n8n-nodes-base.mysqlDb': {
        newType: 'n8n-nodes-base.mysql',
        reason: 'Usar nodo MySQL oficial',
        generateParams: (originalParams) => ({
          operation: 'executeQuery',
          query: originalParams.query || 'SELECT * FROM table_name LIMIT 10',
          ...originalParams
        })
      },

      'n8n-nodes-base.postgresDb': {
        newType: 'n8n-nodes-base.postgres',
        reason: 'Usar nodo PostgreSQL oficial',
        generateParams: (originalParams) => ({
          operation: 'executeQuery',
          query: originalParams.query || 'SELECT * FROM table_name LIMIT 10',
          ...originalParams
        })
      },

      'n8n-nodes-base.mongoDatabase': {
        newType: 'n8n-nodes-base.mongoDb',
        reason: 'Usar nodo MongoDB oficial',
        generateParams: (originalParams) => ({
          operation: 'find',
          collection: originalParams.collection || 'documents',
          ...originalParams
        })
      },

      'n8n-nodes-base.redisDb': {
        newType: 'n8n-nodes-base.redis',
        reason: 'Usar nodo Redis oficial',
        generateParams: (originalParams) => ({
          operation: 'get',
          key: originalParams.key || 'default_key',
          ...originalParams
        })
      },

      // CORRECCIONES PARA SERVICIOS DE ARCHIVO Y STORAGE
      'n8n-nodes-base.awsS3Api': {
        newType: 'n8n-nodes-base.awsS3',
        reason: 'Usar nodo AWS S3 oficial',
        generateParams: (originalParams) => ({
          operation: 'upload',
          bucketName: originalParams.bucket || 'my-bucket',
          ...originalParams
        })
      },

      'n8n-nodes-base.googleDriveApi': {
        newType: 'n8n-nodes-base.googleDrive',
        reason: 'Usar nodo Google Drive oficial',
        generateParams: (originalParams) => ({
          operation: 'upload',
          ...originalParams
        })
      },

      // CORRECCIONES PARA SERVICIOS DE COMUNICACIÓN ADICIONALES
      'n8n-nodes-base.discordBot': {
        newType: 'n8n-nodes-base.discord',
        reason: 'Usar nodo Discord oficial',
        generateParams: (originalParams) => ({
          resource: 'message',
          operation: 'send',
          channelId: originalParams.channelId || '{{ $json.channelId }}',
          content: originalParams.message || '{{ $json.message }}',
          ...originalParams
        })
      },

      'n8n-nodes-base.telegramBot': {
        newType: 'n8n-nodes-base.telegram',
        reason: 'Usar nodo Telegram oficial',
        generateParams: (originalParams) => ({
          resource: 'message',
          operation: 'sendMessage',
          chatId: originalParams.chatId || '{{ $json.chatId }}',
          text: originalParams.message || '{{ $json.message }}',
          ...originalParams
        })
      },

      'n8n-nodes-base.slackBot': {
        newType: 'n8n-nodes-base.slack',
        reason: 'Usar nodo Slack oficial',
        generateParams: (originalParams) => ({
          resource: 'message',
          operation: 'post',
          channel: originalParams.channel || '#general',
          text: originalParams.message || '{{ $json.message }}',
          ...originalParams
        })
      },

      // CORRECCIONES PARA APIs DE PAGO Y FINANZAS
      'n8n-nodes-base.stripeApi': {
        newType: 'n8n-nodes-base.stripe',
        reason: 'Usar nodo Stripe oficial',
        generateParams: (originalParams) => ({
          resource: 'charge',
          operation: 'create',
          ...originalParams
        })
      },

      'n8n-nodes-base.paypalApi': {
        newType: 'n8n-nodes-base.payPal',
        reason: 'Usar nodo PayPal oficial',
        generateParams: (originalParams) => originalParams
      },

      // CORRECCIONES PARA SERVICIOS DE ANALYTICS
      'n8n-nodes-base.googleAnalyticsApi': {
        newType: 'n8n-nodes-base.googleAnalytics',
        reason: 'Usar nodo Google Analytics oficial',
        generateParams: (originalParams) => ({
          resource: 'report',
          operation: 'get',
          ...originalParams
        })
      },

      // CORRECCIONES PARA SERVICIOS DE AUTOMATIZACIÓN
      'n8n-nodes-base.zapierWebhook': {
        newType: 'n8n-nodes-base.webhook',
        reason: 'Usar webhook nativo de n8n en lugar de Zapier',
        generateParams: (originalParams) => ({
          httpMethod: 'POST',
          path: 'automation-webhook',
          responseMode: 'onReceived',
          ...originalParams
        })
      },

      // CORRECCIONES PARA NODOS DE TRANSFORMACIÓN
      'n8n-nodes-base.transform': {
        newType: 'n8n-nodes-base.set',
        reason: 'Usar nodo Set para transformaciones de datos',
        generateParams: (originalParams) => ({
          values: originalParams.values || [{ name: 'output', value: '={{ $json }}' }],
          ...originalParams
        })
      },

      'n8n-nodes-base.mapper': {
        newType: 'n8n-nodes-base.set',
        reason: 'Usar nodo Set para mapeo de datos',
        generateParams: (originalParams) => ({
          values: originalParams.mapping || [{ name: 'mapped', value: '={{ $json }}' }],
          ...originalParams
        })
      }
    };
  }

  // 🚀 INICIALIZACIÓN DEL JSON REPAIR AGENT INTEGRADO V4.0
  async initializeJSONRepairAgent(apiKey, existingModel = null) {
    if (!this.jsonRepairAgent) {
      console.log('🔄 Inicializando JSON Repair Agent Integrado V4.0...');
      this.jsonRepairAgent = new IntegratedJSONRepairAgent(apiKey, existingModel);
      console.log('✅ JSON Repair Agent Integrado V4.0 listo para usar');
    }
    
    // 🔧 INICIALIZAR CORRECTOR DE NOMBRES ULTRA-ROBUSTO
    if (!this.nameCorrector) {
      console.log('🔧 Inicializando Corrector de Nombres Ultra-Robusto V1.0...');
      this.nameCorrector = new IntelligentNameCorrector();
      console.log('✅ Corrector de Nombres Ultra-Robusto V1.0 listo para usar');
    }

    // 🔧 INICIALIZAR AUTOCORRECTOR SI NO EXISTE
    if (!this.autocorrector) {
      console.log('🔧 Inicializando Autocorrector Inteligente...');
      this.autocorrector = new AutocorrectorFlujos(apiKey);
      console.log('✅ Autocorrector Inteligente listo para usar');
    }
    
    return this.jsonRepairAgent;
  }

  // APLICAR CORRECCIONES AUTOMÁTICAS A NODOS INCORRECTOS
  autoCorrectInvalidNodes(workflow) {
    console.log('🔧 DEBUG: autoCorrectInvalidNodes called');
    console.log('🔧 DEBUG: this.validationSystem.validNodeTypes exists:', !!this.validationSystem?.validNodeTypes);
    console.log('🔧 DEBUG: this.validationSystem.validNodeTypes value:', this.validationSystem?.validNodeTypes);
    
    const corrections = this.getNodeCorrections();
    const allValidTypes = Object.values(this.validationSystem.validNodeTypes).flat();
    let correctedCount = 0;

    // 🆕 PRIMERA FASE: CORREGIR IDS DUPLICADOS Y POSICIONES
    const usedIds = new Set();
    const usedPositions = new Set();
    
    workflow.nodes.forEach((node, index) => {
      // Corregir IDs duplicados
      if (usedIds.has(node.id)) {
        const originalId = node.id;
        node.id = `${node.id}-${Date.now()}-${index}`;
        console.log(`🔧 ID duplicado corregido: ${originalId} → ${node.id}`);
        correctedCount++;
      }
      usedIds.add(node.id);
      
      // Corregir posiciones superpuestas
      const positionKey = `${node.position[0]},${node.position[1]}`;
      if (usedPositions.has(positionKey)) {
        const newX = 200 + (index * 350);
        const newY = 200 + ((index % 4) * 200);
        node.position = [newX, newY];
        console.log(`🔧 Posición superpuesta corregida: ${node.name} → [${newX}, ${newY}]`);
        correctedCount++;
      }
      usedPositions.add(`${node.position[0]},${node.position[1]}`);
    });

    // 🆕 SEGUNDA FASE: CORREGIR TIPOS DE NODOS INVÁLIDOS
    workflow.nodes.forEach((node, index) => {
      // Verificar si el tipo de nodo es inválido
      if (!allValidTypes.includes(node.type) && corrections[node.type]) {
        const correction = corrections[node.type];
        
        console.log(`🔧 CORRIGIENDO NODO INVÁLIDO:`);
        console.log(`   📝 Nombre: ${node.name}`);
        console.log(`   ❌ Tipo anterior: ${node.type}`);
        console.log(`   ✅ Tipo nuevo: ${correction.newType}`);
        console.log(`   💡 Razón: ${correction.reason}`);

        // Aplicar corrección
        const newParams = correction.generateParams(node.parameters || {});
        
        workflow.nodes[index] = {
          ...node,
          type: correction.newType,
          parameters: newParams,
          name: node.name.replace(/^(Google Vision|WhatsApp Business|Anthropic|Stripe Trigger) - /, '') + ` (${correction.newType.split('.')[1]})`
        };

        correctedCount++;
      }
    });

    // 🆕 TERCERA FASE: CORREGIR CONEXIONES CIRCULARES
    this.fixCircularConnections(workflow);

    // CORRECCIONES ADICIONALES DE PARÁMETROS
    const paramCorrections = this.correctCommonParameterErrors(workflow);
    correctedCount += paramCorrections;

    if (correctedCount > 0) {
      console.log(`✅ ${correctedCount} correcciones automáticas aplicadas`);
    }

    return correctedCount;
  }

  // 🆕 FUNCIÓN PARA CORREGIR CONEXIONES CIRCULARES
  fixCircularConnections(workflow) {
    const nodeNames = workflow.nodes.map(node => node.name);
    const connections = workflow.connections || {};
    
    console.log('🔄 Detectando y corrigiendo conexiones circulares...');
    
    // Detectar nodos que son tanto triggers como receptores finales
    const triggers = workflow.nodes.filter(node => 
      node.type.includes('webhook') || node.type.includes('trigger') || node.type.includes('cron')
    );
    
    const finalNodes = workflow.nodes.filter(node =>
      node.type.includes('response') || (node.name || '').toLowerCase().includes('final') || (node.name || '').toLowerCase().includes('respuesta')
    );
    
    // Eliminar conexiones de nodos finales hacia triggers
    finalNodes.forEach(finalNode => {
      if (connections[finalNode.name]) {
        const originalConnections = connections[finalNode.name].main[0] || [];
        const filteredConnections = originalConnections.filter(conn => {
          const targetNode = workflow.nodes.find(n => n.name === conn.node);
          const isCircular = targetNode && (targetNode.type.includes('trigger') || targetNode.type.includes('webhook'));
          
          if (isCircular) {
            console.log(`🔧 Conexión circular eliminada: ${finalNode.name} → ${conn.node}`);
          }
          
          return !isCircular;
        });
        
        if (filteredConnections.length !== originalConnections.length) {
          if (filteredConnections.length === 0) {
            delete connections[finalNode.name];
          } else {
            connections[finalNode.name].main[0] = filteredConnections;
          }
        }
      }
    });
  }

  // CORREGIR ERRORES COMUNES EN PARÁMETROS DE NODOS
  correctCommonParameterErrors(workflow) {
    let corrections = 0;

    workflow.nodes.forEach((node, index) => {
      const nodeType = node.type;
      let paramsChanged = false;

      // Correcciones específicas por tipo de nodo
      switch (nodeType) {
        case 'n8n-nodes-base.webhook':
          if (!node.parameters.httpMethod) {
            node.parameters.httpMethod = 'POST';
            paramsChanged = true;
          }
          if (!node.parameters.path) {
            node.parameters.path = (node.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            paramsChanged = true;
          }
          if (!node.parameters.responseMode) {
            node.parameters.responseMode = 'onReceived';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.cron':
          if (!node.parameters.cronExpression) {
            node.parameters.cronExpression = '0 */6 * * *'; // Cada 6 horas por defecto
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.if':
          if (!node.parameters.conditions || node.parameters.conditions.length === 0) {
            node.parameters.conditions = [{
              leftValue: '={{ $json.value }}',
              rightValue: '',
              operation: 'notEmpty'
            }];
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.httpRequest':
          if (!node.parameters.method) {
            node.parameters.method = 'GET';
            paramsChanged = true;
          }
          if (!node.parameters.url) {
            node.parameters.url = 'https://api.example.com/';
            paramsChanged = true;
          }
          // Corregir headers malformados
          if (node.parameters.headers && typeof node.parameters.headers === 'object') {
            const cleanHeaders = {};
            Object.keys(node.parameters.headers).forEach(key => {
              if (typeof node.parameters.headers[key] === 'string') {
                cleanHeaders[key] = node.parameters.headers[key];
              }
            });
            node.parameters.headers = cleanHeaders;
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.function':
          if (node.parameters.code && (
            node.parameters.code.includes('eval') ||
            node.parameters.code.includes('Function(') ||
            node.parameters.code.includes('new Function')
          )) {
            console.log(`   ⚠️ Código potencialmente peligroso detectado en ${node.name}`);
            // No corregir automáticamente, solo advertir
          }
          break;

        case 'n8n-nodes-base.emailSend':
          if (!node.parameters.to) {
            node.parameters.to = '={{ $json.email }}';
            paramsChanged = true;
          }
          if (!node.parameters.subject) {
            node.parameters.subject = 'Notification from n8n';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.openAi':
          // Corregir parámetros de OpenAI según el recurso
          if (node.parameters.resource === 'chat') {
            if (!node.parameters.model) {
              node.parameters.model = 'gpt-3.5-turbo';
              paramsChanged = true;
            }
            if (!node.parameters.messages) {
              node.parameters.messages = {
                messageType: 'singleMessage',
                message: '={{ $json.input || $json.query || "Hello, how can I help you?" }}'
              };
              paramsChanged = true;
            }
          } else if (node.parameters.resource === 'text') {
            if (!node.parameters.model) {
              node.parameters.model = 'text-davinci-003';
              paramsChanged = true;
            }
            if (!node.parameters.prompt) {
              node.parameters.prompt = '={{ $json.input || $json.query || "Complete this text:" }}';
              paramsChanged = true;
            }
          }
          break;

        case 'n8n-nodes-base.respondToWebhook':
          if (!node.parameters.responseBody) {
            node.parameters.responseBody = '={{ $json.response || $json }}';
            paramsChanged = true;
          }
          if (!node.parameters.responseCode) {
            node.parameters.responseCode = 200;
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.function':
          if (!node.parameters.functionCode && !node.parameters.code) {
            node.parameters.functionCode = `
// Función de procesamiento básica
const inputData = $input.first().json;
return [{ json: { ...inputData, processed: true, timestamp: new Date().toISOString() } }];`;
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.postgres':
        case 'n8n-nodes-base.mysql':
        case 'n8n-nodes-base.mongoDb':
          if (!node.parameters.operation) {
            node.parameters.operation = 'find';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.set':
          if (!node.parameters.values || (Array.isArray(node.parameters.values) && node.parameters.values.length === 0)) {
            node.parameters.values = [{
              name: 'output',
              value: '={{ $json }}'
            }];
            paramsChanged = true;
          }
          // Convertir objeto a array si es necesario
          if (node.parameters.values && !Array.isArray(node.parameters.values)) {
            // Convertir objeto de valores a array
            const valuesObj = node.parameters.values;
            node.parameters.values = Object.keys(valuesObj).map(key => ({
              name: key,
              value: valuesObj[key]
            }));
            paramsChanged = true;
          }
          // Validar que cada valor tenga name y value
          if (node.parameters.values && Array.isArray(node.parameters.values)) {
            node.parameters.values.forEach((val, idx) => {
              if (!val.name) {
                val.name = `value_${idx}`;
                paramsChanged = true;
              }
              if (!val.value) {
                val.value = '={{ $json }}';
                paramsChanged = true;
              }
            });
          }
          break;

        case 'n8n-nodes-base.if':
          if (!node.parameters.conditions || !node.parameters.conditions.conditions) {
            node.parameters.conditions = {
              conditions: [{
                field: '{{ $json.status }}',
                operation: 'equal',
                value: 'success'
              }]
            };
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.switch':
          if (!node.parameters.rules || !node.parameters.rules.rules) {
            node.parameters.rules = {
              rules: [{
                operation: 'equal',
                value: 'option1'
              }]
            };
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.code':
          if (!node.parameters.jsCode) {
            node.parameters.jsCode = `// Process each item
return items.map(item => {
  return {
    json: {
      ...item.json,
      processed: true,
      timestamp: new Date().toISOString()
    }
  };
});`;
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.cron':
          if (!node.parameters.cronExpression) {
            node.parameters.cronExpression = '0 9 * * 1-5'; // Every weekday at 9 AM
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.wait':
          if (!node.parameters.amount) {
            node.parameters.amount = 5;
            node.parameters.unit = 'seconds';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.merge':
          if (!node.parameters.mode) {
            node.parameters.mode = 'append';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.split':
          if (!node.parameters.fieldToSplitOut) {
            node.parameters.fieldToSplitOut = 'data';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.googleSheets':
          if (!node.parameters.operation) {
            node.parameters.operation = 'append';
            node.parameters.resource = 'spreadsheet';
            paramsChanged = true;
          }
          if (!node.parameters.documentId) {
            node.parameters.documentId = '={{ $json.spreadsheetId }}';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.gmail':
          if (!node.parameters.operation) {
            node.parameters.operation = 'send';
            node.parameters.resource = 'message';
            paramsChanged = true;
          }
          if (node.parameters.operation === 'send') {
            if (!node.parameters.to) {
              node.parameters.to = '={{ $json.email }}';
              paramsChanged = true;
            }
            if (!node.parameters.subject) {
              node.parameters.subject = '={{ $json.subject }}';
              paramsChanged = true;
            }
            if (!node.parameters.message) {
              node.parameters.message = '={{ $json.message }}';
              paramsChanged = true;
            }
          }
          break;

        case 'n8n-nodes-base.slack':
          if (!node.parameters.operation) {
            node.parameters.operation = 'post';
            node.parameters.resource = 'message';
            paramsChanged = true;
          }
          if (!node.parameters.channel) {
            node.parameters.channel = '#general';
            paramsChanged = true;
          }
          if (!node.parameters.text) {
            node.parameters.text = '={{ $json.message }}';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.discord':
          if (!node.parameters.operation) {
            node.parameters.operation = 'send';
            node.parameters.resource = 'message';
            paramsChanged = true;
          }
          if (!node.parameters.channelId) {
            node.parameters.channelId = '={{ $json.channelId }}';
            paramsChanged = true;
          }
          if (!node.parameters.content) {
            node.parameters.content = '={{ $json.message }}';
            paramsChanged = true;
          }
          break;

        case 'n8n-nodes-base.telegram':
          if (!node.parameters.operation) {
            node.parameters.operation = 'sendMessage';
            node.parameters.resource = 'message';
            paramsChanged = true;
          }
          if (!node.parameters.chatId) {
            node.parameters.chatId = '={{ $json.chatId }}';
            paramsChanged = true;
          }
          if (!node.parameters.text) {
            node.parameters.text = '={{ $json.message }}';
            paramsChanged = true;
          }
          break;
      }

      // Correcciones generales para todos los nodos
      if (!node.parameters.options) {
        node.parameters.options = {};
        paramsChanged = true;
      }

      if (paramsChanged) {
        console.log(`🔧 Parámetros corregidos en: ${node.name}`);
        corrections++;
      }
    });

    return corrections;
  }

  // MÉTODO DE REPARACIÓN EXTREMA DE JSON COMO ÚLTIMO RECURSO
  extremeJSONRepair(jsonStr) {
    console.log('   🔥 Iniciando reparación extrema de JSON...');

    try {
      // 1. Intentar extraer la estructura básica usando patrones más flexibles
      let nodes = [];
      let connections = {};

      // Extraer sección de nodos de forma más robusta
      const nodesStartMatch = jsonStr.match(/"nodes":\s*\[/);
      if (nodesStartMatch) {
        const nodesStart = nodesStartMatch.index + nodesStartMatch[0].length;
        let bracketCount = 0;
        let inString = false;
        let escapeNext = false;
        let nodesEnd = nodesStart;

        for (let i = nodesStart; i < jsonStr.length; i++) {
          const char = jsonStr[i];

          if (escapeNext) {
            escapeNext = false;
            continue;
          }

          if (char === '\\') {
            escapeNext = true;
            continue;
          }

          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }

          if (!inString) {
            if (char === '{') bracketCount++;
            if (char === '}') bracketCount--;
            if (char === ']' && bracketCount === 0) {
              nodesEnd = i;
              break;
            }
          }
        }

        const nodesSection = jsonStr.substring(nodesStart, nodesEnd);
        console.log(`   📝 Sección de nodos extraída: ${nodesSection.length} caracteres`);

        // Parse individual de nodos usando una aproximación más simple
        const nodeMatches = nodesSection.match(/\{[^}]*?"type":[^}]*?\}/g);
        if (nodeMatches) {
          nodeMatches.forEach((nodeStr, index) => {
            try {
              // Limpiar y intentar parsear el nodo individual
              let cleanNode = nodeStr
                .replace(/\\"/g, '"')
                .replace(/\\n/g, ' ')
                .replace(/\\t/g, ' ');

              // Intentar extraer campos básicos manualmente
              const idMatch = cleanNode.match(/"id":\s*"([^"]+)"/);
              const nameMatch = cleanNode.match(/"name":\s*"([^"]+)"/);
              const typeMatch = cleanNode.match(/"type":\s*"([^"]+)"/);
              const positionMatch = cleanNode.match(/"position":\s*\[([^\]]+)\]/);

              if (idMatch && nameMatch && typeMatch) {
                const node = {
                  id: idMatch[1],
                  name: nameMatch[1],
                  type: typeMatch[1],
                  position: positionMatch ?
                    positionMatch[1].split(',').map(p => parseInt(p.trim())) :
                    [index * 300, 200],
                  parameters: this.getDefaultParameterValue(typeMatch[1]) || {}
                };

                nodes.push(node);
                console.log(`   ✅ Nodo rescatado: ${node.name}`);
              }
            } catch (nodeError) {
              console.log(`   ⚠️ Error procesando nodo ${index}: ${nodeError.message}`);
            }
          });
        }
      }

      // Extraer conexiones de forma similar
      const connectionsMatch = jsonStr.match(/"connections":\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      if (connectionsMatch && nodes.length > 1) {
        const connectionsStr = connectionsMatch[1];

        // Crear conexiones básicas secuenciales
        for (let i = 0; i < nodes.length - 1; i++) {
          const sourceNode = nodes[i];
          const targetNode = nodes[i + 1];

          connections[sourceNode.name] = {
            main: [[{
              node: targetNode.name,
              type: 'main',
              index: 0
            }]]
          };
        }
      }

      const result = {
        nodes: nodes,
        connections: connections,
        settings: {
          executionOrder: 'v1'
        }
      };

      console.log(`   ✅ Reconstruido con ${nodes.length} nodos`);

      if (nodes.length === 0) {
        // Última oportunidad: crear workflow mínimo válido
        result.nodes = [{
          id: 'webhook-1',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          position: [100, 200],
          parameters: {
            httpMethod: 'POST',
            path: '/webhook',
            responseMode: 'lastNode'
          }
        }];
        console.log('   🚨 Creado workflow mínimo de emergencia');
      }

      return JSON.stringify(result, null, 2);

    } catch (error) {
      console.log(`   ❌ Error en reparación extrema: ${error.message}`);

      // Fallback absoluto: crear workflow básico
      const fallbackWorkflow = {
        nodes: [{
          id: 'webhook-fallback',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          position: [100, 200],
          parameters: {
            httpMethod: 'POST',
            path: '/webhook',
            responseMode: 'lastNode'
          }
        }],
        connections: {},
        settings: {
          executionOrder: 'v1'
        }
      };

      return JSON.stringify(fallbackWorkflow, null, 2);
    }
  }

  // EXTRACTOR DE WORKFLOW RESILIENTE - MEJORADO PARA PRESERVAR CONEXIONES
  extractWorkflowFromCorruptedResponse(response) {
    console.log('🔧 EXTRACTOR ULTRA-RESILIENTE: Iniciando extracción completa de workflow corrupto...');

    try {
      // 1. Buscar patrones de nodos usando regex específico
      const nodeMatches = [];
      const nodePattern = /"id":\s*"([^"]+)"\s*,\s*"name":\s*"([^"]+)"\s*,\s*"type":\s*"([^"]+)"/g;

      let match;
      while ((match = nodePattern.exec(response)) !== null) {
        const [, id, name, type] = match;
        nodeMatches.push({ id, name, type });
      }

      if (nodeMatches.length === 0) {
        console.log('❌ No se encontraron nodos válidos');
        return null;
      }

      console.log(`✅ Encontrados ${nodeMatches.length} nodos potenciales`);

      // 2. EXTRAER CONEXIONES DEL JSON CORRUPTO CON PATRONES MEJORADOS
      const connections = {};
      const connectionMatches = [];

      // Buscar patrones de conexiones usando múltiples regex más robustos
      const connectionPatterns = [
        // Patrón específico para conexiones n8n
        /"([^"]+)"\s*:\s*{\s*"main"\s*:\s*\[\s*\[\s*{\s*"node"\s*:\s*"([^"]+)"(?:\s*,\s*"type"\s*:\s*"([^"]*)")?(?:\s*,\s*"index"\s*:\s*(\d+))?\s*}\s*\]\s*\]\s*}/g,
        // Patrón simplificado
        /"([^"]+)"\s*:\s*{\s*"main"\s*:\s*\[\s*\[\s*{\s*"node"\s*:\s*"([^"]+)"[^}]*}\s*\]\s*\]\s*}/g,
        // Patrón para conexiones sin comillas en keys
        /([^"\s]+)\s*:\s*{\s*"main"\s*:\s*\[\s*\[\s*{\s*"node"\s*:\s*"([^"]+)"[^}]*}\s*\]\s*\]\s*}/g,
        // Patrón para sección completa de connections
        /"connections"\s*:\s*{([^}]+)}/g
      ];

      // Ejecutar todos los patrones
      connectionPatterns.forEach((pattern, index) => {
        console.log(`🔍 Probando patrón de conexiones ${index + 1}...`);
        let connMatch;
        while ((connMatch = pattern.exec(response)) !== null) {
          if (connMatch[1] && connMatch[2]) {
            connectionMatches.push({
              source: connMatch[1].replace(/"/g, ''), // Remover comillas si existen
              target: connMatch[2],
              type: connMatch[3] || 'main',
              index: parseInt(connMatch[4]) || 0
            });
            console.log(`🔗 Conexión encontrada: ${connMatch[1]} → ${connMatch[2]}`);
          }
        }
      });

      console.log(`🔗 Encontradas ${connectionMatches.length} conexiones potenciales en JSON corrupto`);

      // 3. Construir workflow válido con los nodos encontrados
      const nodes = nodeMatches.map((node, index) => {
        const newId = node.id || `node-${index}`;
        return {
          id: newId,
          originalId: node.id || newId, // Guardar ID original para mapeo de conexiones
          name: node.name || `Node ${index + 1}`,
          type: node.type || 'n8n-nodes-base.webhook',
          position: [100 + (index * 200), 100 + (index % 3) * 100],
          parameters: this.getDefaultParametersForNodeType(node.type),
          typeVersion: 1
        };
      });

      // 4. PRESERVAR CONEXIONES EXTRAÍDAS O CREAR CONEXIONES INTELIGENTES
      if (connectionMatches.length > 0) {
        // Usar conexiones extraídas del JSON corrupto
        console.log('🔄 Preservando conexiones extraídas del JSON corrupto...');
        connectionMatches.forEach(conn => {
          // Buscar nodos por nombre o ID
          const sourceNode = nodes.find(n => n.name === conn.source || n.id === conn.source);
          const targetNode = nodes.find(n => n.name === conn.target || n.id === conn.target);

          if (sourceNode && targetNode) {
            if (!connections[sourceNode.name]) {
              connections[sourceNode.name] = { main: [[]] };
            }
            if (!connections[sourceNode.name].main) {
              connections[sourceNode.name].main = [[]];
            }
            if (!connections[sourceNode.name].main[0]) {
              connections[sourceNode.name].main[0] = [];
            }

            // Evitar duplicados
            const exists = connections[sourceNode.name].main[0].some(c =>
              c.node === targetNode.name && c.type === conn.type
            );

            if (!exists) {
              connections[sourceNode.name].main[0].push({
                node: targetNode.name,
                type: conn.type,
                index: conn.index
              });
              console.log(`🔗 Conexión preservada: ${sourceNode.name} → ${targetNode.name}`);
            }
          } else {
            console.log(`⚠️ Conexión inválida: ${conn.source} → ${conn.target} (nodos no encontrados)`);
          }
        });
      } else {
        // Fallback: Crear conexiones básicas secuenciales si no se encontraron conexiones
        console.log('⚠️ No se encontraron conexiones en JSON corrupto, creando flujo secuencial inteligente...');

        // Crear flujo lógico: Trigger → Extract → Calendar → Email → Telegram
        const flowOrder = [
          'Telegram Chatbot Trigger',
          'Extract Chat Data',
          'Create Calendar Event',
          'Send Notification Email',
          'Send Confirmation to Client'
        ];

        for (let i = 0; i < flowOrder.length - 1; i++) {
          const currentNode = nodes.find(n => n.name === flowOrder[i]);
          const nextNode = nodes.find(n => n.name === flowOrder[i + 1]);

          if (currentNode && nextNode) {
            connections[currentNode.name] = {
              main: [[{
                node: nextNode.name,
                type: 'main',
                index: 0
              }]]
            };
            console.log(`🔗 Conexión secuencial creada: ${currentNode.name} → ${nextNode.name}`);
          }
        }
      }

      const workflow = {
        nodes: nodes,
        connections: connections,
        settings: {}
      };

      console.log(`✅ Workflow extraído exitosamente con ${nodes.length} nodos y ${Object.keys(connections).length} conexiones`);
      return JSON.stringify(workflow, null, 2);

    } catch (error) {
      console.error('❌ Error extrayendo workflow:', error.message);
      return null;
    }
  }

  // EXTRAER PARÁMETROS COMPLETOS DE UN NODO
  extractNodeParameters(jsonString, nodeId) {
    try {
      // Buscar el bloque de parámetros para este nodo
      const nodeBlockPattern = new RegExp(`"id"\\s*:\\s*"${nodeId}"[\\s\\S]*?"parameters"\\s*:\\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}`, 'i');
      const match = jsonString.match(nodeBlockPattern);

      if (match && match[1]) {
        // Intentar parsear los parámetros
        const paramsString = `{${match[1]}}`;
        return JSON.parse(paramsString);
      }
    } catch (e) {
      console.log(`⚠️ No se pudieron extraer parámetros para nodo ${nodeId}`);
    }
    return {};
  }

  // CREAR FLUJO INTELIGENTE BASADO EN TIPOS DE NODOS
  createIntelligentFlow(nodes) {
    const connections = {};
    const flowOrder = this.determineOptimalFlowOrder(nodes);

    console.log('🎯 Creando flujo inteligente:', flowOrder.map(n => n.name).join(' → '));

    for (let i = 0; i < flowOrder.length - 1; i++) {
      const currentNode = flowOrder[i];
      const nextNode = flowOrder[i + 1];

      connections[currentNode.name] = {
        main: [[{
          node: nextNode.name,
          type: 'main',
          index: 0
        }]]
      };
    }

    return connections;
  }

  // DETERMINAR ORDEN ÓPTIMO DE FLUJO BASADO EN TIPOS
  determineOptimalFlowOrder(nodes) {
    const categorized = {
      triggers: [],
      processors: [],
      outputs: []
    };

    nodes.forEach(node => {
      if (node.type.includes('Trigger')) {
        categorized.triggers.push(node);
      } else if (node.type.includes('email') || node.type.includes('telegram') || node.type.includes('calendar')) {
        categorized.outputs.push(node);
      } else {
        categorized.processors.push(node);
      }
    });

    return [...categorized.triggers, ...categorized.processors, ...categorized.outputs];
  }

  // GENERADOR INTELIGENTE DE WORKFLOW FALLBACK - MÍNIMO 10 NODOS
  generateIntelligentFallbackWorkflow(prompt) {
    // Detectar complejidad del prompt para determinar cantidad de nodos
    const complexity = this.analyzePromptComplexity(prompt);
    const minNodes = complexity === 'enterprise' ? 20 : (complexity === 'high' ? 15 : 10);
    
    console.log(`🤖 Generando workflow inteligente con MÍNIMO ${minNodes} NODOS...`);
    console.log(`   📊 Complejidad detectada: ${complexity}`);
    
    const workflowType = this.detectWorkflowType(prompt);
    const entities = this.extractEntitiesFromPrompt(prompt);
    
    console.log(`   📊 Tipo de workflow detectado: ${workflowType}`);
    console.log(`   🏷️ Entidades detectadas: ${entities.join(', ')}`);
    
    // Generar nodos según el tipo de workflow
    let nodes = [];
    let connections = {};
    let nodeCount = 0;
    
    // 1. MÚLTIPLES TRIGGERS (2-4 nodos según complejidad)
    const webhookTrigger = this.createTriggerNode('webhook', nodeCount++);
    const cronTrigger = this.createTriggerNode('cron', nodeCount++);
    nodes.push(webhookTrigger, cronTrigger);
    
    if (minNodes >= 15) {
      const emailTrigger = this.createTriggerNode('email', nodeCount++);
      const manualTrigger = this.createTriggerNode('manual', nodeCount++);
      nodes.push(emailTrigger, manualTrigger);
    }
    
    // 2. VALIDACIÓN Y PROCESAMIENTO INICIAL (2-4 nodos)
    const validationNode = this.createValidationNode(nodeCount++);
    const enrichmentNode = this.createEnrichmentNode(nodeCount++);
    nodes.push(validationNode, enrichmentNode);
    
    if (minNodes >= 15) {
      const dataCleaningNode = this.createDataCleaningNode(nodeCount++);
      const deduplicationNode = this.createDeduplicationNode(nodeCount++);
      nodes.push(dataCleaningNode, deduplicationNode);
    }
    
    // 3. NODOS DE LÓGICA DE NEGOCIO (3-6 nodos)
    const conditionNode = this.createConditionNode(nodeCount++);
    const processingNode1 = this.createProcessingNodeForEntity('email', workflowType, nodeCount++);
    const processingNode2 = this.createProcessingNodeForEntity('api', workflowType, nodeCount++);
    nodes.push(conditionNode, processingNode1, processingNode2);
    
    if (minNodes >= 15) {
      const scoringNode = this.createScoringNode(nodeCount++);
      const segmentationNode = this.createAdvancedSegmentationNode(nodeCount++);
      const personalizationNode = this.createPersonalizationNode(nodeCount++);
      nodes.push(scoringNode, segmentationNode, personalizationNode);
    }
    
    // 4. NODOS DE INTEGRACIÓN (2-6 nodos)
    const crmNode = this.createCRMNode(nodeCount++);
    const storageNode = this.createStorageNode(nodeCount++);
    nodes.push(crmNode, storageNode);
    
    if (minNodes >= 15) {
      const salesforceNode = this.createSalesforceNode(nodeCount++);
      const marketingNode = this.createMarketingAutomationNode(nodeCount++);
      nodes.push(salesforceNode, marketingNode);
    }
    
    if (minNodes >= 20) {
      const analyticsNode = this.createAnalyticsNode(nodeCount++);
      const reportingNode = this.createReportingNode(nodeCount++);
      nodes.push(analyticsNode, reportingNode);
    }
    
    // 5. NODOS DE NOTIFICACIÓN (1-4 nodos)
    const notificationNode = this.createNotificationNode(nodeCount++);
    nodes.push(notificationNode);
    
    if (minNodes >= 15) {
      const smsNode = this.createSMSNode(nodeCount++);
      const whatsappNode = this.createWhatsAppNode(nodeCount++);
      nodes.push(smsNode, whatsappNode);
    }
    
    if (minNodes >= 20) {
      const dashboardNode = this.createDashboardNode(nodeCount++);
      nodes.push(dashboardNode);
    }
    
    console.log(`✅ Generados ${nodes.length} nodos (target: ${minNodes}+)`);
    
    // CREAR CONEXIONES COMPLEJAS
    connections = this.createIntelligentConnections(nodes);
    
    const workflow = {
      nodes,
      connections,
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      staticData: {},
      tags: [],
      triggerCount: 0,
      updatedAt: new Date().toISOString(),
      versionId: 'v1',
      metadata: {
        workflowStatus: 'complete',
        generatedBy: 'fallback-enhanced',
        estimatedNodes: nodes.length,
        lastNodeName: notificationNode.name,
        complexity: 'high'
      }
    };

    
    // Aplicar posicionamiento profesional V4.0
    return this.optimizeNodePositions(workflow);
  }
  
  // ANÁLISIS DE COMPLEJIDAD DEL PROMPT
  analyzePromptComplexity(prompt) {
    const enterpriseKeywords = [
      'omnichannel', 'múltiples', 'integración', 'sistemas', 'plataformas',
      'automatización', 'completo', 'empresarial', 'dashboards', 'analítica',
      'machine learning', 'ia', 'inteligencia', 'predictivo', 'reportes',
      'multi-canal', 'loyalty', 'campañas', 'logística', 'facturación'
    ];
    
    const highKeywords = [
      'crm', 'email', 'marketing', 'notificaciones', 'procesamiento',
      'validación', 'enriquecimiento', 'segmentación', 'personalizado'
    ];
    
    const enterpriseCount = enterpriseKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)).length;
    const highCount = highKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)).length;
    
    if (enterpriseCount >= 8 || prompt.length > 800) {
      return 'enterprise';
    } else if (enterpriseCount >= 4 || highCount >= 6) {
      return 'high';
    } else {
      return 'medium';
    }
  }

  // FUNCIONES AUXILIARES PARA GENERACIÓN DE NODOS ESPECÍFICOS
  createValidationNode(nodeIndex) {
    return {
      id: `validation-${nodeIndex}`,
      name: "Data Validation",
      type: "n8n-nodes-base.code",
      position: [300, 300],
      parameters: {
        jsCode: "// Validate input data\nif (!items[0].json.email) throw new Error('Email required');\nreturn items;"
      },
      typeVersion: 1
    };
  }

  createEnrichmentNode(nodeIndex) {
    return {
      id: `enrichment-${nodeIndex}`,
      name: "Data Enrichment",
      type: "n8n-nodes-base.httpRequest",
      position: [600, 300],
      parameters: {
        url: "https://api.clearbit.com/v2/people/find",
        method: "GET",
        headers: {
          "Authorization": "Bearer YOUR_API_KEY"
        }
      },
      typeVersion: 1
    };
  }

  createConditionNode(nodeIndex) {
    return {
      id: `condition-${nodeIndex}`,
      name: "Lead Segmentation",
      type: "n8n-nodes-base.if",
      position: [900, 300],
      parameters: {
        conditions: [
          {
            leftValue: "{{ $json.score }}",
            operation: "larger",
            rightValue: 75
          }
        ]
      },
      typeVersion: 1
    };
  }

  createCRMNode(nodeIndex) {
    return {
      id: `crm-${nodeIndex}`,
      name: "Update CRM",
      type: "n8n-nodes-base.hubspot",
      position: [1500, 300],
      parameters: {
        operation: "create",
        resource: "contact"
      },
      typeVersion: 1
    };
  }

  createStorageNode(nodeIndex) {
    return {
      id: `storage-${nodeIndex}`,
      name: "Save to Database",
      type: "n8n-nodes-base.googleSheets",
      position: [1800, 300],
      parameters: {
        operation: "append",
        sheetId: "YOUR_SHEET_ID"
      },
      typeVersion: 1
    };
  }

  createNotificationNode(nodeIndex) {
    return {
      id: `notification-${nodeIndex}`,
      name: "Team Notification",
      type: "n8n-nodes-base.slack",
      position: [2100, 300],
      parameters: {
        operation: "post",
        channel: "#general",
        text: "Workflow completed successfully"
      },
      typeVersion: 1
    };
  }

  // NODOS ADICIONALES PARA WORKFLOWS COMPLEJOS
  createDataCleaningNode(nodeIndex) {
    return {
      id: `datacleaning-${nodeIndex}`,
      name: "Data Cleaning",
      type: "n8n-nodes-base.code",
      position: [600, 500],
      parameters: {
        mode: "runOnceForAllItems",
        jsCode: "// Clean and normalize data\nconst cleanedData = items.map(item => ({\n  ...item.json,\n  email: item.json.email?.toLowerCase().trim(),\n  phone: item.json.phone?.replace(/[^\\d+]/g, '')\n}));\nreturn cleanedData.map(data => ({json: data}));"
      },
      typeVersion: 1
    };
  }

  createDeduplicationNode(nodeIndex) {
    return {
      id: `deduplication-${nodeIndex}`,
      name: "Remove Duplicates",
      type: "n8n-nodes-base.code",
      position: [800, 500],
      parameters: {
        mode: "runOnceForAllItems",
        jsCode: "// Remove duplicate entries\nconst uniqueItems = [];\nconst seen = new Set();\nfor (const item of items) {\n  const key = `${item.json.email}-${item.json.phone}`;\n  if (!seen.has(key)) {\n    seen.add(key);\n    uniqueItems.push(item);\n  }\n}\nreturn uniqueItems;"
      },
      typeVersion: 1
    };
  }

  createScoringNode(nodeIndex) {
    return {
      id: `scoring-${nodeIndex}`,
      name: "Lead Scoring",
      type: "n8n-nodes-base.code",
      position: [1000, 600],
      parameters: {
        mode: "runOnceForEachItem",
        jsCode: "// Calculate lead score\nlet score = 0;\nif (item.json.email) score += 20;\nif (item.json.phone) score += 15;\nif (item.json.company) score += 25;\nif (item.json.jobTitle) score += 20;\nif (item.json.industry) score += 10;\nreturn {json: {...item.json, leadScore: score}};"
      },
      typeVersion: 1
    };
  }

  createAdvancedSegmentationNode(nodeIndex) {
    return {
      id: `segmentation-${nodeIndex}`,
      name: "Advanced Segmentation",
      type: "n8n-nodes-base.code",
      position: [1200, 600],
      parameters: {
        mode: "runOnceForEachItem",
        jsCode: "// Advanced lead segmentation\nconst score = item.json.leadScore || 0;\nlet segment = 'cold';\nif (score >= 80) segment = 'hot';\nelse if (score >= 60) segment = 'warm';\nelse if (score >= 40) segment = 'interested';\nreturn {json: {...item.json, segment}};"
      },
      typeVersion: 1
    };
  }

  createPersonalizationNode(nodeIndex) {
    return {
      id: `personalization-${nodeIndex}`,
      name: "Content Personalization",
      type: "n8n-nodes-base.code",
      position: [1400, 600],
      parameters: {
        mode: "runOnceForEachItem",
        jsCode: "// Personalize content based on segment\nconst templates = {\n  hot: 'Priority follow-up required',\n  warm: 'Schedule demo call',\n  interested: 'Send educational content',\n  cold: 'Add to nurture campaign'\n};\nconst action = templates[item.json.segment] || templates.cold;\nreturn {json: {...item.json, recommendedAction: action}};"
      },
      typeVersion: 1
    };
  }

  createSalesforceNode(nodeIndex) {
    return {
      id: `salesforce-${nodeIndex}`,
      name: "Salesforce Integration",
      type: "n8n-nodes-base.salesforce",
      position: [1600, 400],
      parameters: {
        operation: "create",
        resource: "lead"
      },
      typeVersion: 1
    };
  }

  createMarketingAutomationNode(nodeIndex) {
    return {
      id: `marketing-${nodeIndex}`,
      name: "Marketing Automation",
      type: "n8n-nodes-base.mailchimp",
      position: [1800, 400],
      parameters: {
        operation: "create",
        resource: "member"
      },
      typeVersion: 1
    };
  }

  createAnalyticsNode(nodeIndex) {
    return {
      id: `analytics-${nodeIndex}`,
      name: "Analytics Tracking",
      type: "n8n-nodes-base.googleAnalytics",
      position: [2000, 500],
      parameters: {
        operation: "event",
        category: "Lead Management",
        action: "Lead Processed"
      },
      typeVersion: 1
    };
  }

  createReportingNode(nodeIndex) {
    return {
      id: `reporting-${nodeIndex}`,
      name: "Executive Reporting",
      type: "n8n-nodes-base.googleSheets",
      position: [2200, 500],
      parameters: {
        operation: "append",
        resource: "spreadsheet",
        range: "A:Z"
      },
      typeVersion: 1
    };
  }

  createSMSNode(nodeIndex) {
    return {
      id: `sms-${nodeIndex}`,
      name: "SMS Notifications",
      type: "n8n-nodes-base.twilio",
      position: [2000, 200],
      parameters: {
        operation: "send",
        resource: "sms",
        to: "+1234567890",
        body: "New lead processed"
      },
      typeVersion: 1
    };
  }

  createWhatsAppNode(nodeIndex) {
    return {
      id: `whatsapp-${nodeIndex}`,
      name: "WhatsApp Business",
      type: "n8n-nodes-base.whatsApp",
      position: [2200, 200],
      parameters: {
        operation: "sendMessage",
        messageType: "text",
        message: "Lead update notification"
      },
      typeVersion: 1
    };
  }

  createDashboardNode(nodeIndex) {
    return {
      id: `dashboard-${nodeIndex}`,
      name: "Real-time Dashboard",
      type: "n8n-nodes-base.httpRequest",
      position: [2400, 300],
      parameters: {
        method: "POST",
        url: "https://api.dashboard.com/metrics",
        sendBody: true,
        specifyBody: "json",
        jsonBody: '{"metric": "leads_processed", "value": "{{$json.count}}"}'
      },
      typeVersion: 1
    };
  }

  createNotificationNode(nodeIndex) {
    return {
      id: `notification-${nodeIndex}`,
      name: "Team Notification",
      type: "n8n-nodes-base.slack",
      position: [2100, 300],
      parameters: {
        operation: "postMessage",
        channel: "#marketing",
        text: "New lead processed: {{ $json.name }}"
      },
      typeVersion: 1
    };
  }

  createIntelligentConnections(nodes) {
    const connections = {};
    
    // Conectar webhook trigger → validation
    connections[nodes[0].name] = {
      main: [[{ node: nodes[2].name, type: 'main', index: 0 }]]
    };
    
    // Conectar cron trigger → enrichment  
    connections[nodes[1].name] = {
      main: [[{ node: nodes[3].name, type: 'main', index: 0 }]]
    };
    
    // Validación → Condición
    connections[nodes[2].name] = {
      main: [[{ node: nodes[4].name, type: 'main', index: 0 }]]
    };
    
    // Enriquecimiento → Condición
    connections[nodes[3].name] = {
      main: [[{ node: nodes[4].name, type: 'main', index: 0 }]]
    };
    
    // Condición → Ramas paralelas (email + api)
    connections[nodes[4].name] = {
      main: [
        [
          { node: nodes[5].name, type: 'main', index: 0 },
          { node: nodes[6].name, type: 'main', index: 0 }
        ]
      ]
    };
    
    // Email → CRM
    connections[nodes[5].name] = {
      main: [[{ node: nodes[7].name, type: 'main', index: 0 }]]
    };
    
    // API → Storage
    connections[nodes[6].name] = {
      main: [[{ node: nodes[8].name, type: 'main', index: 0 }]]
    };
    
    // CRM → Notification
    connections[nodes[7].name] = {
      main: [[{ node: nodes[9].name, type: 'main', index: 0 }]]
    };
    
    // Storage → Notification
    connections[nodes[8].name] = {
      main: [[{ node: nodes[9].name, type: 'main', index: 0 }]]
    };
    
    return connections;
  }

  // CREAR NODO TRIGGER SEGÚN TIPO - MEJORADO PARA MÚLTIPLES TRIGGERS
  createTriggerNode(triggerType, nodeId) {
    const triggers = {
      'webhook': {
        type: 'n8n-nodes-base.webhook',
        name: 'Lead Capture Webhook',
        parameters: {
          httpMethod: 'POST',
          path: '/lead-capture',
          responseMode: 'onReceived'
        }
      },
      'cron': {
        type: 'n8n-nodes-base.cron',
        name: 'Scheduled Monitor',
        parameters: {
          rule: {
            interval: [{
              field: 'cronExpression',
              expression: '0 */1 * * *'  // Cada hora
            }]
          }
        }
      },
      'email': {
        type: 'n8n-nodes-base.emailReadImap',
        name: 'Email Monitor',
        parameters: {
          host: 'imap.gmail.com',
          port: 993,
          secure: true
        }
      },
      'manual': {
        type: 'n8n-nodes-base.manualTrigger',
        name: 'Manual Start',
        parameters: {}
      }
    };

    const triggerConfig = triggers[triggerType] || triggers['webhook'];
    
    return {
      id: `trigger-${nodeId}`,
      name: triggerConfig.name,
      type: triggerConfig.type,
      position: [100, 200 + (nodeId * 150)],
      parameters: triggerConfig.parameters,
      typeVersion: 1
    };
  }

  // CREAR NODO DE PROCESAMIENTO PARA ENTIDAD
  createProcessingNodeForEntity(entity, workflowType, nodeId) {
    const entityLower = entity.toLowerCase();
    
    // Mapear entidades a nodos específicos
    const entityNodeMap = {
      'instagram': {
        type: 'n8n-nodes-base.httpRequest',
        name: 'Instagram API',
        parameters: {
          url: 'https://graph.instagram.com/v12.0/me/media',
          authentication: 'predefinedCredentialType',
          nodeCredentialType: 'instagramOAuth2Api',
          method: 'GET'
        }
      },
      'whatsapp': {
        type: 'n8n-nodes-base.whatsApp',
        name: 'WhatsApp Business',
        parameters: {
          operation: 'sendMessage',
          messageType: 'text'
        }
      },
      'telegram': {
        type: 'n8n-nodes-base.telegram',
        name: 'Telegram Bot',
        parameters: {
          operation: 'sendMessage',
          chatId: '',
          text: ''
        }
      },
      'discord': {
        type: 'n8n-nodes-base.discord',
        name: 'Discord Bot',
        parameters: {
          operation: 'sendMessage'
        }
      },
      'slack': {
        type: 'n8n-nodes-base.slack',
        name: 'Slack Message',
        parameters: {
          operation: 'postMessage',
          channel: ''
        }
      },
      'email': {
        type: 'n8n-nodes-base.emailSend',
        name: 'Send Email',
        parameters: {
          fromEmail: '',
          toEmail: '',
          subject: '',
          message: ''
        }
      },
      'shopify': {
        type: 'n8n-nodes-base.shopify',
        name: 'Shopify Store',
        parameters: {
          operation: 'getAll',
          resource: 'product'
        }
      },
      'hubspot': {
        type: 'n8n-nodes-base.hubspot',
        name: 'HubSpot CRM',
        parameters: {
          operation: 'getAll',
          resource: 'contact'
        }
      }
    };
    
    const nodeConfig = entityNodeMap[entityLower] || {
      type: 'n8n-nodes-base.httpRequest',
      name: `${entity} API`,
      parameters: {
        url: `https://api.${entityLower}.com/v1/data`,
        method: 'GET'
      }
    };
    
    return {
      id: `process-${entityLower}-${nodeId}`,
      name: nodeConfig.name,
      type: nodeConfig.type,
      position: [300 + (nodeId * 200), 200 + (nodeId * 150)],
      parameters: nodeConfig.parameters,
      typeVersion: 1
    };
  }

  // CREAR NODO HTTP GENÉRICO
  createGenericHttpNode(nodeId) {
    return {
      id: `http-request-${nodeId}`,
      name: 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      position: [300, 200 + (nodeId * 150)],
      parameters: {
        url: 'https://api.example.com/data',
        method: 'GET',
        options: {}
      },
      typeVersion: 4.1
    };
  }

  // CREAR NODO DE SALIDA
  createOutputNode(workflowType, nodeId) {
    const outputs = {
      'multi-platform-social': {
        type: 'n8n-nodes-base.respondToWebhook',
        name: 'Social Response',
        parameters: {
          respondWith: 'json',
          responseBody: '{"status": "success", "message": "Social media workflow completed"}'
        }
      },
      'ecommerce': {
        type: 'n8n-nodes-base.emailSend',
        name: 'Order Notification',
        parameters: {
          fromEmail: 'orders@company.com',
          subject: 'New Order Processed',
          message: 'Order has been successfully processed'
        }
      },
      'crm': {
        type: 'n8n-nodes-base.hubspot',
        name: 'Update CRM',
        parameters: {
          operation: 'create',
          resource: 'contact'
        }
      },
      'marketing': {
        type: 'n8n-nodes-base.googleSheets',
        name: 'Save to Spreadsheet',
        parameters: {
          operation: 'append',
          resource: 'spreadsheet'
        }
      },
      'automation': {
        type: 'n8n-nodes-base.respondToWebhook',
        name: 'Workflow Complete',
        parameters: {
          respondWith: 'json',
          responseBody: '{"status": "completed", "timestamp": "{{$now}}"}'
        }
      }
    };
    
    const output = outputs[workflowType] || outputs['automation'];
    
    return {
      id: `output-${nodeId}`,
      name: output.name,
      type: output.type,
      position: [500 + (nodeId * 200), 200 + (nodeId * 150)],
      parameters: output.parameters,
      typeVersion: 1
    };
  }

  // EXTRAER ENTIDADES DEL PROMPT
  extractEntitiesFromPrompt(prompt) {
    const entities = [];
    const promptLower = prompt.toLowerCase();
    
    // Plataformas sociales
    const socialPlatforms = ['instagram', 'whatsapp', 'telegram', 'discord', 'slack', 'twitter', 'facebook', 'linkedin'];
    socialPlatforms.forEach(platform => {
      if (promptLower.includes(platform)) entities.push(platform);
    });
    
    // Plataformas de ecommerce
    const ecommercePlatforms = ['shopify', 'woocommerce', 'magento', 'prestashop'];
    ecommercePlatforms.forEach(platform => {
      if (promptLower.includes(platform)) entities.push(platform);
    });
    
    // CRMs
    const crmPlatforms = ['hubspot', 'salesforce', 'pipedrive', 'zoho'];
    crmPlatforms.forEach(platform => {
      if (promptLower.includes(platform)) entities.push(platform);
    });
    
    // Servicios generales
    const generalServices = ['email', 'sms', 'database', 'api', 'webhook'];
    generalServices.forEach(service => {
      if (promptLower.includes(service)) entities.push(service);
    });
    
    return [...new Set(entities)]; // Eliminar duplicados
  }

  // PREVENIR CONEXIONES CIRCULARES
  removeCircularConnections(connections, nodes) {
    const visited = new Set();
    const visiting = new Set();
    const nodeNames = new Set(nodes.map(n => n.name));
    
    const hasCircle = (nodeName) => {
      if (visiting.has(nodeName)) return true; // Círculo detectado
      if (visited.has(nodeName)) return false; // Ya procesado
      
      visiting.add(nodeName);
      
      if (connections[nodeName] && connections[nodeName].main) {
        for (const connection of connections[nodeName].main[0] || []) {
          if (nodeNames.has(connection.node) && hasCircle(connection.node)) {
            // Romper conexión circular
            console.log(`🔧 Removiendo conexión circular: ${nodeName} → ${connection.node}`);
            connections[nodeName].main[0] = connections[nodeName].main[0].filter(
              c => c.node !== connection.node
            );
            return true;
          }
        }
      }
      
      visiting.delete(nodeName);
      visited.add(nodeName);
      return false;
    };
    
    // Verificar todos los nodos
    for (const node of nodes) {
      hasCircle(node.name);
    }
  }

  // PARÁMETROS POR DEFECTO SEGÚN TIPO DE NODO
  // FUNCIÓN AUXILIAR PARA ASEGURAR ESTRUCTURA DE CONEXIONES
  ensureConnectionsArray(connections, nodeName) {
    if (!connections[nodeName]) {
      connections[nodeName] = { main: [[]] };
    }
    if (!connections[nodeName].main) {
      connections[nodeName].main = [[]];
    }
    if (!connections[nodeName].main[0]) {
      connections[nodeName].main[0] = [];
    }
    // Asegurar que main[0] es un array
    if (!Array.isArray(connections[nodeName].main[0])) {
      connections[nodeName].main[0] = [connections[nodeName].main[0]];
    }
  }

  // SISTEMA HÍBRIDO DE POSICIONAMIENTO V5.0 - GEMINI + SISTEMA PROFESIONAL
  optimizeNodePositions(workflow) {
    console.log('🎯 Aplicando posicionamiento híbrido V5.0...');
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      console.warn('⚠️ No se encontraron nodos válidos para posicionar');
      return workflow;
    }

    // 1. DETECTAR SI GEMINI INCLUYÓ POSICIONES
    const nodosConPosicion = workflow.nodes.filter(node => 
      node.position && Array.isArray(node.position) && node.position.length === 2);
    const nodosSinPosicion = workflow.nodes.filter(node => 
      !node.position || !Array.isArray(node.position) || node.position.length !== 2);

    console.log(`📊 Análisis posiciones: ${nodosConPosicion.length} con posición, ${nodosSinPosicion.length} sin posición`);

    if (nodosConPosicion.length === 0) {
      // CASO 1: NINGUNA POSICIÓN - CREAR DESDE CERO CON SISTEMA PROFESIONAL
      console.log('🎨 Generando posiciones profesionales desde cero...');
      return this.aplicarPosicionamientoProfesionalCompleto(workflow);
    } else if (nodosSinPosicion.length === 0) {
      // CASO 2: TODAS LAS POSICIONES PRESENTES - MEJORAR POSICIONES DE GEMINI
      console.log('✨ Mejorando posiciones existentes de Gemini...');
      return this.mejorarPosicionesExistentes(workflow);
    } else {
      // CASO 3: POSICIONES MIXTAS - COMPLETAR Y MEJORAR
      console.log('🔧 Completando posiciones faltantes y mejorando existentes...');
      return this.completarYMejorarPosiciones(workflow);
    }
  }

  /**
   * POSICIONAMIENTO PROFESIONAL COMPLETO (sin posiciones de Gemini) - V6.0 OPTIMIZADO
   */
  aplicarPosicionamientoProfesionalCompleto(workflow) {
    console.log('🎨 Aplicando posicionamiento profesional completo desde cero...');
    
    // Categorizar nodos profesionalmente
    const categorias = this.categorizarNodosPorFuncionProfesional(workflow.nodes);
    
    // Aplicar layout profesional optimizado
    return this.aplicarLayoutProfesionalOptimizado(workflow, categorias);
  }

  /**
   * MEJORAR POSICIONES EXISTENTES DE GEMINI - VERSION PROFESIONAL V6.0
   */
  mejorarPosicionesExistentes(workflow) {
    console.log('🔍 Analizando posiciones para aplicar layout profesional...');
    
    // Categorizar nodos por función (como en los JSON ejemplos)
    const categorias = this.categorizarNodosPorFuncionProfesional(workflow.nodes);
    
    // Aplicar posicionamiento profesional con espaciado optimizado
    return this.aplicarLayoutProfesionalOptimizado(workflow, categorias);
  }

  /**
   * CATEGORIZACIÓN PROFESIONAL DE NODOS (Basada en ejemplos JSON exitosos)
   */
  categorizarNodosPorFuncionProfesional(nodes) {
    const categorias = {
      entrada: [], // webhooks, triggers
      validacion: [], // if, conditions, validations
      procesamiento: [], // transformaciones, set, code
      integraciones: [], // APIs, CRM, servicios externos
      notificaciones: [], // email, SMS, chat
      almacenamiento: [], // databases, sheets, files
      salida: [] // dashboards, finales, confirmaciones
    };
    
    nodes.forEach(node => {
      const tipo = (node.type || '').toLowerCase();
      const nombre = (node.name || '').toLowerCase();
      
      if (tipo.includes('webhook') || tipo.includes('trigger') || tipo.includes('cron') || nombre.includes('webhook')) {
        categorias.entrada.push(node);
      } else if (tipo.includes('if') || nombre.includes('validar') || nombre.includes('validación') || nombre.includes('check')) {
        categorias.validacion.push(node);
      } else if (tipo.includes('set') || tipo.includes('code') || nombre.includes('procesar') || nombre.includes('transformar')) {
        categorias.procesamiento.push(node);
      } else if (tipo.includes('hubspot') || tipo.includes('salesforce') || tipo.includes('stripe') || tipo.includes('fedex') || tipo.includes('quickbooks')) {
        categorias.integraciones.push(node);
      } else if (tipo.includes('email') || tipo.includes('twilio') || tipo.includes('slack') || tipo.includes('telegram') || nombre.includes('notificar')) {
        categorias.notificaciones.push(node);
      } else if (tipo.includes('sheets') || tipo.includes('database') || tipo.includes('aws') || nombre.includes('guardar') || nombre.includes('backup')) {
        categorias.almacenamiento.push(node);
      } else if (nombre.includes('dashboard') || nombre.includes('final') || nombre.includes('confirmación')) {
        categorias.salida.push(node);
      } else {
        // Nodos genéricos van a procesamiento
        categorias.procesamiento.push(node);
      }
    });
    
    // Filtrar categorías vacías
    Object.keys(categorias).forEach(key => {
      if (categorias[key].length === 0) {
        delete categorias[key];
      }
    });
    
    return categorias;
  }

  /**
   * APLICAR LAYOUT PROFESIONAL OPTIMIZADO (Como en ejemplos JSON)
   */
  aplicarLayoutProfesionalOptimizado(workflow, categorias) {
    console.log('🎨 Aplicando layout profesional optimizado...');
    
    // Configuración de espaciado optimizada (más natural, menos exagerada)
    const CONFIG = {
      espaciadoHorizontal: 280, // Reducido de 350 a 280
      espaciadoVertical: 140,   // Reducido de 180 a 140  
      margenInicial: 100,
      separacionNiveles: 200,   // Separación entre niveles funcionales
      maxNodosPorFila: 4        // Para controlar distribución
    };
    
    let yActual = CONFIG.margenInicial;
    const categoriasOrdenadas = ['entrada', 'validacion', 'procesamiento', 'integraciones', 'notificaciones', 'almacenamiento', 'salida'];
    
    categoriasOrdenadas.forEach(categoria => {
      if (categorias[categoria] && categorias[categoria].length > 0) {
        const nodos = categorias[categoria];
        console.log(`   📍 Posicionando ${nodos.length} nodos de ${categoria}`);
        
        // Calcular distribución óptima para esta categoría
        const distribucion = this.calcularDistribucionOptima(nodos.length, CONFIG);
        
        // Posicionar nodos de esta categoría
        nodos.forEach((node, index) => {
          const posicion = this.calcularPosicionNodo(index, distribucion, yActual, CONFIG);
          node.position = [posicion.x, posicion.y];
        });
        
        // Avanzar al siguiente nivel
        yActual += CONFIG.separacionNiveles;
        if (nodos.length > CONFIG.maxNodosPorFila) {
          yActual += CONFIG.espaciadoVertical; // Espacio extra para múltiples filas
        }
      }
    });
    
    console.log(`   ✅ ${workflow.nodes.length} nodos organizados en layout profesional`);
    return workflow;
  }

  /**
   * CALCULAR DISTRIBUCIÓN ÓPTIMA PARA CATEGORÍA
   */
  calcularDistribucionOptima(cantidadNodos, CONFIG) {
    if (cantidadNodos <= CONFIG.maxNodosPorFila) {
      // Una sola fila - centrar horizontalmente
      const anchoTotal = (cantidadNodos - 1) * CONFIG.espaciadoHorizontal;
      return {
        filas: 1,
        nodosPorFila: cantidadNodos,
        xInicial: -anchoTotal / 2 // Centrar en X=0
      };
    } else {
      // Múltiples filas - distribuir de manera equilibrada
      const filas = Math.ceil(cantidadNodos / CONFIG.maxNodosPorFila);
      const nodosPorFila = Math.ceil(cantidadNodos / filas);
      const anchoTotal = (nodosPorFila - 1) * CONFIG.espaciadoHorizontal;
      
      return {
        filas: filas,
        nodosPorFila: nodosPorFila,
        xInicial: -anchoTotal / 2
      };
    }
  }

  /**
   * CALCULAR POSICIÓN ESPECÍFICA DEL NODO
   */
  calcularPosicionNodo(indice, distribucion, yBase, CONFIG) {
    const fila = Math.floor(indice / distribucion.nodosPorFila);
    const columna = indice % distribucion.nodosPorFila;
    
    // Ajustar X para centrar filas parciales
    let x = distribucion.xInicial + (columna * CONFIG.espaciadoHorizontal);
    
    // Si es la última fila y tiene menos nodos, centrarla
    const esUltimaFila = fila === distribucion.filas - 1;
    const nodosEnEstaFila = Math.min(distribucion.nodosPorFila, 
      distribucion.nodosPorFila * distribucion.filas - (fila * distribucion.nodosPorFila));
    
    if (esUltimaFila && nodosEnEstaFila < distribucion.nodosPorFila) {
      const anchoFilaParcial = (nodosEnEstaFila - 1) * CONFIG.espaciadoHorizontal;
      x = (-anchoFilaParcial / 2) + (columna * CONFIG.espaciadoHorizontal);
    }
    
    const y = yBase + (fila * CONFIG.espaciadoVertical);
    
    return { x, y };
  }

  /**
   * COMPLETAR Y MEJORAR POSICIONES MIXTAS
   */
  completarYMejorarPosiciones(workflow) {
    console.log('🔧 Completando posiciones faltantes...');
    
    // Primero completar posiciones faltantes
    const nodosConPosicion = workflow.nodes.filter(node => 
      node.position && Array.isArray(node.position));
    const nodosSinPosicion = workflow.nodes.filter(node => 
      !node.position || !Array.isArray(node.position));

    // Analizar el patrón existente
    const patronExistente = this.analizarPatronExistente(nodosConPosicion);
    
    // Completar nodos faltantes siguiendo el patrón
    this.completarPosicionesFaltantes(nodosSinPosicion, patronExistente, workflow);

    // Luego mejorar todo el conjunto
    return this.mejorarPosicionesExistentes(workflow);
  }

  /**
   * ORGANIZAR FLUJO DE MANERA NATURAL V5.0
   */
  organizarFlujoNaturalV5(workflow, categorias) {
    const flujo = [];
    const procesados = new Set();

    // Nivel 0: Triggers y entradas
    const nivel0 = [...categorias.triggers, ...categorias.inputs];
    if (nivel0.length > 0) {
      flujo.push(nivel0);
      nivel0.forEach(nodo => procesados.add(nodo));
    }

    // Nivel 1: Validación inicial
    if (categorias.validation.length > 0) {
      flujo.push(categorias.validation);
      categorias.validation.forEach(nodo => procesados.add(nodo));
    }

    // Nivel 2: Procesamiento principal
    const nivel2 = categorias.processing.filter(nodo => !procesados.has(nodo));
    if (nivel2.length > 0) {
      flujo.push(nivel2);
      nivel2.forEach(nodo => procesados.add(nodo));
    }

    // Nivel 3: Condiciones y AI
    const nivel3 = [...categorias.conditions, ...categorias.ai].filter(nodo => !procesados.has(nodo));
    if (nivel3.length > 0) {
      flujo.push(nivel3);
      nivel3.forEach(nodo => procesados.add(nodo));
    }

    // Nivel 4: Integraciones
    if (categorias.integrations.length > 0) {
      flujo.push(categorias.integrations.filter(nodo => !procesados.has(nodo)));
      categorias.integrations.forEach(nodo => procesados.add(nodo));
    }

    // Nivel 5: Salidas y notificaciones
    const nivel5 = [...categorias.outputs, ...categorias.notifications, ...categorias.storage]
      .filter(nodo => !procesados.has(nodo));
    if (nivel5.length > 0) {
      flujo.push(nivel5);
    }

    // Agregar nodos no procesados
    const nodesRestantes = workflow.nodes
      .filter(node => !procesados.has(node.name))
      .map(node => node.name);
    if (nodesRestantes.length > 0) {
      flujo.push(nodesRestantes);
    }

    return flujo.filter(nivel => nivel.length > 0);
  }

  /**
   * APLICAR POSICIONES NATURALES V5.0
   */
  aplicarPosicionesNaturalesV5(workflow, flujoOrganizado, CONFIG) {
    const posicionesUsadas = new Set();
    
    flujoOrganizado.forEach((nivel, indiceFlujo) => {
      const baseX = CONFIG.START_X + (indiceFlujo * CONFIG.SPACING_X);
      
      // Distribuir nodos del nivel de manera natural
      nivel.forEach((nombreNodo, indiceNodo) => {
        const node = workflow.nodes.find(n => n.name === nombreNodo);
        if (!node) return;

        let posY;
        
        if (nivel.length === 1) {
          // Un solo nodo: centrado
          posY = CONFIG.START_Y;
        } else if (nivel.length === 2) {
          // Dos nodos: arriba y abajo simétricos
          posY = CONFIG.START_Y + (indiceNodo === 0 ? -CONFIG.PARALLEL_OFFSET_Y/2 : CONFIG.PARALLEL_OFFSET_Y/2);
        } else {
          // Múltiples nodos: distribución vertical natural
          const offsetTotal = (nivel.length - 1) * CONFIG.SPACING_Y;
          const startY = CONFIG.START_Y - offsetTotal/2;
          posY = startY + (indiceNodo * CONFIG.SPACING_Y);
        }

        // Prevenir solapamientos
        let posicion = [baseX, posY];
        let ajustes = 0;
        while (posicionesUsadas.has(`${posicion[0]},${posicion[1]}`) && ajustes < 10) {
          posicion[1] += CONFIG.PARALLEL_OFFSET_Y;
          ajustes++;
        }

        posicionesUsadas.add(`${posicion[0]},${posicion[1]}`);
        node.position = posicion;
      });
    });
  }

  /**
   * DETECTAR PATRÓN LINEAL
   */
  detectarPatronLineal(posiciones) {
    if (posiciones.length < 3) return false;
    
    // Detectar si todos los nodos están en la misma Y (línea horizontal)
    const mismaY = posiciones.every(pos => pos.y === posiciones[0].y);
    
    // O si están en la misma X (línea vertical)
    const mismaX = posiciones.every(pos => pos.x === posiciones[0].x);
    
    return mismaY || mismaX;
  }

  /**
   * DETECTAR PATRÓN EN ESCALERA
   */
  detectarPatronEscalera(posiciones) {
    if (posiciones.length < 3) return false;
    
    // Ordenar por X
    const ordenados = [...posiciones].sort((a, b) => a.x - b.x);
    
    // Verificar si Y aumenta consistentemente con X (escalera diagonal)
    let esEscalera = true;
    for (let i = 1; i < ordenados.length - 1; i++) {
      const deltaX1 = ordenados[i].x - ordenados[i-1].x;
      const deltaY1 = ordenados[i].y - ordenados[i-1].y;
      const deltaX2 = ordenados[i+1].x - ordenados[i].x;
      const deltaY2 = ordenados[i+1].y - ordenados[i].y;
      
      // Si los incrementos son muy similares, es escalera
      if (Math.abs(deltaX1 - deltaX2) > 100 || Math.abs(deltaY1 - deltaY2) > 100) {
        esEscalera = false;
        break;
      }
    }
    
    return esEscalera;
  }

  /**
   * REORGANIZAR LAYOUT NATURAL
   */
  reorganizarLayoutNatural(workflow, posicionesActuales) {
    console.log('🎨 Aplicando reorganización natural anti-lineal...');
    
    // Organizar por flujo lógico en lugar de posiciones actuales
    const categorias = this.categorizarNodosPorFuncionV4(workflow.nodes);
    const flujoNatural = this.organizarFlujoNaturalV5(workflow, categorias);
    
    const CONFIG_NATURAL = {
      SPACING_X: 370,         // Reducido de 450 a 370
      SPACING_Y: 170,         // Reducido de 200 a 170
      PARALLEL_OFFSET_Y: 140, // Reducido de 160 a 140
      START_X: -1000,         // Reducido de -1200 a -1000
      START_Y: 0,
      BRANCH_OFFSET: 230      // Reducido de 280 a 230
    };

    this.aplicarPosicionesNaturalesV5(workflow, flujoNatural, CONFIG_NATURAL);
    
    console.log('✅ Layout reorganizado de manera natural');
    return workflow;
  }

  /**
   * OPTIMIZAR ESPACIADO EXISTENTE
   */
  optimizarEspaciadoExistente(workflow, posicionesActuales) {
    console.log('✨ Optimizando espaciado y alineación existente...');
    
    // Encontrar espaciado promedio actual
    const espaciadoX = this.calcularEspaciadoPromedio(posicionesActuales, 'x');
    const espaciadoY = this.calcularEspaciadoPromedio(posicionesActuales, 'y');
    
    // Si el espaciado es muy pequeño, expandirlo
    const factorExpansion = Math.max(1.2, 350 / Math.max(espaciadoX, 200));
    
    workflow.nodes.forEach(node => {
      if (node.position) {
        node.position[0] *= factorExpansion;
        node.position[1] *= factorExpansion * 0.8; // Y menos expansión
      }
    });
    
    console.log(`✅ Espaciado optimizado (factor: ${factorExpansion.toFixed(2)})`);
    return workflow;
  }

  /**
   * ANALIZAR PATRÓN EXISTENTE
   */
  analizarPatronExistente(nodosConPosicion) {
    if (nodosConPosicion.length === 0) return null;
    
    const posiciones = nodosConPosicion.map(n => ({ x: n.position[0], y: n.position[1] }));
    
    return {
      minX: Math.min(...posiciones.map(p => p.x)),
      maxX: Math.max(...posiciones.map(p => p.x)),
      minY: Math.min(...posiciones.map(p => p.y)),
      maxY: Math.max(...posiciones.map(p => p.y)),
      espaciadoPromedioX: this.calcularEspaciadoPromedio(posiciones, 'x'),
      espaciadoPromedioY: this.calcularEspaciadoPromedio(posiciones, 'y')
    };
  }

  /**
   * COMPLETAR POSICIONES FALTANTES
   */
  completarPosicionesFaltantes(nodosSinPosicion, patron, workflow) {
    if (!patron) {
      // Sin patrón, usar posicionamiento básico
      nodosSinPosicion.forEach((node, i) => {
        node.position = [patron?.maxX + 400 || 100, 200 + (i * 200)];
      });
      return;
    }

    // Continuar el patrón existente
    let siguienteX = patron.maxX + patron.espaciadoPromedioX;
    let siguienteY = patron.minY;
    
    nodosSinPosicion.forEach((node, i) => {
      node.position = [siguienteX, siguienteY + (i * patron.espaciadoPromedioY)];
    });
  }

  /**
   * CALCULAR ESPACIADO PROMEDIO
   */
  calcularEspaciadoPromedio(posiciones, eje) {
    if (posiciones.length < 2) return 300;
    
    const valores = posiciones.map(p => p[eje]).sort((a, b) => a - b);
    const diferencias = [];
    
    for (let i = 1; i < valores.length; i++) {
      const diff = valores[i] - valores[i-1];
      if (diff > 50) diferencias.push(diff); // Ignorar diferencias muy pequeñas
    }
    
    return diferencias.length > 0 
      ? diferencias.reduce((a, b) => a + b, 0) / diferencias.length
      : 300;
  }

  /**
   * DETERMINAR TIPO DE NODO
   */
  determinarTipoNodo(node) {
    const tipo = (node.type || '').toLowerCase();
    const nombre = (node.name || '').toLowerCase();
    
    if (tipo.includes('webhook') || tipo.includes('trigger')) return 'trigger';
    if (tipo.includes('if') || nombre.includes('condition')) return 'condition';
    if (tipo.includes('ai') || nombre.includes('ai')) return 'ai';
    if (tipo.includes('slack') || tipo.includes('email')) return 'notification';
    if (tipo.includes('http') || nombre.includes('api')) return 'integration';
    return 'processing';
  }

  /**
   * Categorizar nodos por función específica V4.0 (mantener compatibilidad)
   */
  categorizarNodosPorFuncionV4(nodes) {
    const categorias = {
      triggers: [],
      inputs: [], 
      validation: [],
      processing: [],
      conditions: [],
      integrations: [],
      ai: [],
      outputs: [],
      notifications: [],
      storage: []
    };

    nodes.forEach(node => {
      const tipo = (node.type || '').toLowerCase();
      const nombre = (node.name || '').toLowerCase();
      
      if (tipo.includes('trigger') || tipo.includes('webhook') || tipo.includes('cron')) {
        categorias.triggers.push(node.name);
      } else if (tipo.includes('if') || nombre.includes('condition') || nombre.includes('filter')) {
        categorias.conditions.push(node.name);
      } else if (nombre.includes('validate') || nombre.includes('check') || nombre.includes('verify')) {
        categorias.validation.push(node.name);
      } else if (tipo.includes('ai') || nombre.includes('ai') || nombre.includes('gpt') || nombre.includes('gemini')) {
        categorias.ai.push(node.name);
      } else if (tipo.includes('email') || tipo.includes('slack') || tipo.includes('telegram')) {
        categorias.notifications.push(node.name);
      } else if (tipo.includes('sheets') || tipo.includes('database') || nombre.includes('save') || nombre.includes('store')) {
        categorias.storage.push(node.name);
      } else if (tipo.includes('http') || tipo.includes('api') || nombre.includes('api')) {
        categorias.integrations.push(node.name);
      } else if (nombre.includes('input') || nombre.includes('get') || nombre.includes('read')) {
        categorias.inputs.push(node.name);
      } else {
        categorias.processing.push(node.name);
      }
    });

    return categorias;
  }

  /**
   * Organizar flujo por niveles V4.0
   */
  organizarFlujoPorNivelesV4(workflow, categorias) {
    const niveles = [];
    const visitados = new Set();
    const procesados = new Set();

    const organizarNivel = (nombreNodo, nivelActual) => {
      if (procesados.has(nombreNodo)) return;
      
      if (!niveles[nivelActual]) {
        niveles[nivelActual] = [];
      }
      
      if (!visitados.has(nombreNodo)) {
        visitados.add(nombreNodo);
        niveles[nivelActual].push(nombreNodo);
        procesados.add(nombreNodo);

        const conexiones = workflow.connections[nombreNodo]?.main?.[0] || [];
        conexiones.forEach(connection => {
          organizarNivel(connection.node, nivelActual + 1);
        });
      }
    };

    // Priorizar triggers
    categorias.triggers.forEach(trigger => {
      organizarNivel(trigger, 0);
    });

    // Luego inputs si no hay triggers
    if (categorias.triggers.length === 0) {
      categorias.inputs.forEach(input => {
        organizarNivel(input, 0);
      });
    }

    // Procesar nodos huérfanos
    workflow.nodes.forEach(node => {
      if (!procesados.has(node.name)) {
        const nivelBase = niveles.length > 0 ? niveles.length : 0;
        organizarNivel(node.name, nivelBase);
      }
    });

    return niveles.filter(nivel => nivel.length > 0); // Filtrar niveles vacíos
  }

  /**
   * Calcular posición Y inteligente
   */
  calcularPosicionY(nivel, indiceNodo, CONFIG) {
    if (nivel.length === 1) {
      return CONFIG.START_Y + 400; // Un nodo: centrado
    } else if (nivel.length <= 3) {
      return CONFIG.START_Y + (indiceNodo * CONFIG.SPACING_Y) + 200; // Pocos nodos: espaciado amplio
    } else {
      return CONFIG.START_Y + (indiceNodo * CONFIG.PARALLEL_OFFSET_Y) + 100; // Muchos nodos: compacto
    }
  }

  // Categorizar nodos por su funcionalidad
  categorizeNodes(nodes) {
    const categories = {
      trigger: [],
      validation: [],
      processing: [],
      ai: [],
      output: [],
      error: [],
      utility: []
    };

    nodes.forEach(node => {
      const category = this.getNodeCategory(node.type);
      if (categories[category]) {
        categories[category].push(node);
      }
    });

    return categories;
  }

  // Obtener categoría de un nodo basado en su tipo
  getNodeCategory(nodeType) {
    const type = nodeType.toLowerCase();
    
    if (type.includes('webhook') || type.includes('trigger') || type.includes('cron') || type.includes('manual')) {
      return 'trigger';
    } else if (type.includes('if') || type.includes('switch') || type.includes('validate')) {
      return 'validation';
    } else if (type.includes('set') || type.includes('code') || type.includes('function') || type.includes('merge')) {
      return 'processing';
    } else if (type.includes('openai') || type.includes('anthropic') || type.includes('ai') || type.includes('langchain')) {
      return 'ai';
    } else if (type.includes('telegram') || type.includes('slack') || type.includes('gmail') || type.includes('mysql') || type.includes('sheets')) {
      return 'output';
    } else if (type.includes('error') || type.includes('catch')) {
      return 'error';
    } else {
      return 'utility';
    }
  }

  // Calcular niveles de flujo basado en conexiones
  calculateFlowLevels(nodes, connections) {
    const levels = {};
    const visited = new Set();
    const processing = new Set();

    // Inicializar todos los nodos en nivel 0
    nodes.forEach(node => {
      levels[node.name] = 0;
    });

    // Función recursiva para calcular niveles
    const calculateLevel = (nodeName, currentLevel = 0) => {
      if (processing.has(nodeName)) {
        return currentLevel; // Evitar ciclos infinitos
      }
      
      if (visited.has(nodeName)) {
        return levels[nodeName];
      }

      processing.add(nodeName);
      visited.add(nodeName);
      
      let maxLevel = currentLevel;
      
      // Revisar conexiones salientes
      if (connections && connections[nodeName] && connections[nodeName].main) {
        connections[nodeName].main.forEach(mainConnArray => {
          if (Array.isArray(mainConnArray)) {
            mainConnArray.forEach(conn => {
              const targetLevel = calculateLevel(conn.node, currentLevel + 1);
              maxLevel = Math.max(maxLevel, targetLevel);
            });
          }
        });
      }

      levels[nodeName] = Math.max(levels[nodeName], maxLevel);
      processing.delete(nodeName);
      
      return levels[nodeName];
    };

    // Encontrar nodos trigger (sin conexiones entrantes)
    const triggerNodes = nodes.filter(node => {
      const hasIncoming = Object.values(connections || {}).some(nodeConn =>
        nodeConn.main && nodeConn.main.some(mainArray =>
          Array.isArray(mainArray) && mainArray.some(conn => conn.node === node.name)
        )
      );
      return !hasIncoming || this.getNodeCategory(node.type) === 'trigger';
    });

    // Calcular niveles desde los triggers
    triggerNodes.forEach(trigger => {
      calculateLevel(trigger.name, 0);
    });

    return levels;
  }

  // Validar posición de nodo para evitar superposición
  validateNodePosition(proposedPosition, allNodes, currentIndex, config) {
    const [x, y] = proposedPosition;
    let adjustedY = y;

    // Verificar superposición con nodos ya posicionados
    for (let i = 0; i < currentIndex; i++) {
      const otherNode = allNodes[i];
      if (otherNode.position) {
        const [otherX, otherY] = otherNode.position;
        
        // Si están muy cerca horizontalmente y verticalmente
        if (Math.abs(x - otherX) < config.horizontalSpacing * 0.3 && 
            Math.abs(adjustedY - otherY) < config.nodeHeight + config.minGap) {
          
          // Mover hacia abajo
          adjustedY = otherY + config.nodeHeight + config.minGap;
        }
      }
    }

    return [x, adjustedY];
  }

  // Distribución equilibrada final
  balanceNodeDistribution(workflow, config) {
    // Agrupar nodos por nivel X
    const xGroups = {};
    
    workflow.nodes.forEach(node => {
      const x = node.position[0];
      if (!xGroups[x]) {
        xGroups[x] = [];
      }
      xGroups[x].push(node);
    });

    // Redistribuir nodos en cada grupo X para evitar amontonamiento
    Object.values(xGroups).forEach(group => {
      if (group.length > 1) {
        group.sort((a, b) => a.position[1] - b.position[1]); // Ordenar por Y
        
        group.forEach((node, index) => {
          const baseY = config.startY + (index * (config.verticalSpacing * 0.8));
          node.position[1] = baseY;
        });
      }
    });
  }

  // PARÁMETROS POR DEFECTO SEGÚN TIPO DE NODO
  getDefaultParametersForNodeType(nodeType) {
    const defaults = {
      'n8n-nodes-base.webhook': {
        httpMethod: 'POST',
        path: 'webhook',
        responseMode: 'onReceived'
      },
      'n8n-nodes-base.httpRequest': {
        method: 'GET',
        url: 'https://api.example.com'
      },
      'n8n-nodes-base.set': {
        values: [{ name: 'data', value: '={{ $json }}' }]
      },
      'n8n-nodes-base.code': {
        mode: 'runOnceForAllItems',
        jsCode: 'return items;'
      },
      'n8n-nodes-base.gmail': {
        operation: 'get',
        resource: 'message'
      },
      'n8n-nodes-base.whatsappBusiness': {
        operation: 'send',
        resource: 'message'
      },
      'n8n-nodes-base.googleVision': {
        operation: 'analyze',
        resource: 'image'
      }
    };
    
    return defaults[nodeType] || {};
  }

  // SISTEMA DE MANEJO INTELIGENTE DE BRANCHES DE ERROR
  addIntelligentErrorHandling(workflow) {
    console.log('🛡️ Añadiendo manejo inteligente de errores...');
    
    const errorHandlingAdded = [];
    const nodesByName = {};
    workflow.nodes.forEach(node => {
      nodesByName[node.name] = node;
    });

    // Identificar nodos que deberían tener manejo de errores
    const criticalNodes = workflow.nodes.filter(node => {
      return this.isCriticalNode(node.type);
    });

    criticalNodes.forEach(node => {
      const errorHandling = this.createErrorHandlingForNode(node, workflow);
      if (errorHandling.errorNodes.length > 0) {
        // Agregar nodos de error
        workflow.nodes.push(...errorHandling.errorNodes);
        
        // Agregar conexiones de error
        if (!workflow.connections[node.name]) {
          workflow.connections[node.name] = { main: [] };
        }
        workflow.connections[node.name].error = errorHandling.errorConnections;
        
        // Agregar conexiones entre nodos de error
        Object.assign(workflow.connections, errorHandling.internalConnections);
        
        errorHandlingAdded.push(`${node.name} -> ${errorHandling.errorNodes.map(n => n.name).join(', ')}`);
      }
    });

    if (errorHandlingAdded.length > 0) {
      console.log(`✅ Manejo de errores añadido a ${errorHandlingAdded.length} nodos críticos`);
      errorHandlingAdded.forEach(msg => console.log(`   🛡️ ${msg}`));
    }

    return workflow;
  }

  isCriticalNode(nodeType) {
    const criticalTypes = [
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.mysql',
      'n8n-nodes-base.postgres',
      'n8n-nodes-base.mongoDb',
      'n8n-nodes-base.gmail',
      'n8n-nodes-base.slack',
      'n8n-nodes-base.telegram',
      'n8n-nodes-base.openAi',
      'n8n-nodes-base.anthropic',
      'n8n-nodes-base.googleSheets'
    ];
    
    return criticalTypes.includes(nodeType);
  }

  createErrorHandlingForNode(node, workflow) {
    const errorNodes = [];
    const errorConnections = [];
    const internalConnections = {};
    
    const nodePosition = node.position || [500, 200];
    const errorY = nodePosition[1] + 200; // Posicionar errores más abajo
    
    // 1. Nodo de formateo de error
    const errorFormatterName = `${node.name} Error Handler`;
    const errorFormatter = {
      id: `error-${node.id || Math.random().toString(36).substr(2, 9)}`,
      name: errorFormatterName,
      type: 'n8n-nodes-base.set',
      position: [nodePosition[0], errorY],
      parameters: {
        values: [
          {
            name: 'errorType',
            value: `{{ $node["${node.name}"].error.name }}`
          },
          {
            name: 'errorMessage', 
            value: `{{ $node["${node.name}"].error.message }}`
          },
          {
            name: 'nodeName',
            value: node.name
          },
          {
            name: 'timestamp',
            value: '{{ $now }}'
          },
          {
            name: 'originalData',
            value: '{{ $json }}'
          }
        ]
      }
    };
    errorNodes.push(errorFormatter);

    // 2. Nodo de notificación de error
    const notificationName = `${node.name} Error Notification`;
    const errorNotification = this.createErrorNotificationNode(notificationName, nodePosition, errorY + 120);
    errorNodes.push(errorNotification);

    // 3. Conexiones de error
    errorConnections.push([{
      node: errorFormatterName,
      type: 'main',
      index: 0
    }]);

    // Conexión interna: formatter -> notification
    internalConnections[errorFormatterName] = {
      main: [[{
        node: notificationName,
        type: 'main',
        index: 0
      }]]
    };

    return {
      errorNodes,
      errorConnections,
      internalConnections
    };
  }

  createErrorNotificationNode(name, originalPosition, yPosition) {
    // Determinar el mejor canal de notificación basado en nodos existentes
    const notificationTypes = ['telegram', 'slack', 'gmail'];
    let chosenType = 'telegram'; // default
    
    const node = {
      id: `notify-${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      type: `n8n-nodes-base.${chosenType}`,
      position: [originalPosition[0], yPosition],
      parameters: {}
    };

    // Configurar parámetros según el tipo
    switch (chosenType) {
      case 'telegram':
        node.parameters = {
          resource: 'message',
          operation: 'sendMessage',
          chatId: '{{ $env.TELEGRAM_ERROR_CHAT_ID }}',
          text: `🚨 ERROR en workflow n8n\n\n` +
                `Nodo: {{ $json.nodeName }}\n` +
                `Tipo: {{ $json.errorType }}\n` +
                `Mensaje: {{ $json.errorMessage }}\n` +
                `Timestamp: {{ $json.timestamp }}\n\n` +
                `Datos originales: {{ JSON.stringify($json.originalData, null, 2) }}`
        };
        break;
      case 'slack':
        node.parameters = {
          resource: 'message',
          operation: 'post',
          channel: '#errors',
          text: `🚨 *ERROR en workflow n8n*\n\n*Nodo:* {{ $json.nodeName }}\n*Tipo:* {{ $json.errorType }}\n*Mensaje:* {{ $json.errorMessage }}\n*Timestamp:* {{ $json.timestamp }}`
        };
        break;
      case 'gmail':
        node.parameters = {
          resource: 'message',
          operation: 'send',
          to: '{{ $env.ERROR_EMAIL }}',
          subject: 'ERROR en workflow n8n - {{ $json.nodeName }}',
          message: `Error detectado en el nodo {{ $json.nodeName }}\n\nTipo: {{ $json.errorType }}\nMensaje: {{ $json.errorMessage }}\nTimestamp: {{ $json.timestamp }}\n\nDatos: {{ JSON.stringify($json.originalData, null, 2) }}`
        };
        break;
    }

    return node;
  }
  validateSpecificParameters(workflow) {
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: [],
      autoFixed: [],
      suggestions: []
    };

    for (const node of workflow.nodes) {
      const nodeValidation = this.validateNodeSpecificParams(node);
      
      if (!nodeValidation.isValid) {
        validationResults.isValid = false;
        validationResults.errors.push(...nodeValidation.errors);
      }
      
      validationResults.warnings.push(...nodeValidation.warnings);
      validationResults.autoFixed.push(...nodeValidation.autoFixed);
      validationResults.suggestions.push(...nodeValidation.suggestions);
    }

    return validationResults;
  }

  validateNodeSpecificParams(node) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      autoFixed: [],
      suggestions: []
    };

    switch (node.type) {
      case 'n8n-nodes-base.gmail':
        result.isValid = this.validateGmailParams(node, result);
        break;
      case 'n8n-nodes-base.telegram':
        result.isValid = this.validateTelegramParams(node, result);
        break;
      case 'n8n-nodes-base.slack':
        result.isValid = this.validateSlackParams(node, result);
        break;
      case 'n8n-nodes-base.if':
        result.isValid = this.validateIfParams(node, result);
        break;
      case 'n8n-nodes-base.webhook':
        result.isValid = this.validateWebhookParams(node, result);
        break;
      case 'n8n-nodes-base.httpRequest':
        result.isValid = this.validateHttpRequestParams(node, result);
        break;
      case 'n8n-nodes-base.mysql':
      case 'n8n-nodes-base.postgres':
        result.isValid = this.validateDatabaseParams(node, result);
        break;
      case 'n8n-nodes-base.set':
        result.isValid = this.validateSetParams(node, result);
        break;
      case 'n8n-nodes-base.code':
        result.isValid = this.validateCodeParams(node, result);
        break;
    }

    return result;
  }

  // VALIDACIONES ESPECÍFICAS POR TIPO DE NODO
  validateGmailParams(node, result) {
    if (!node.parameters.to) {
      result.errors.push(`${node.name}: Gmail "to" field is required`);
      return false;
    }

    // Validar formato de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const toField = node.parameters.to;
    
    if (typeof toField === 'string' && !toField.startsWith('={{') && !emailPattern.test(toField)) {
      result.errors.push(`${node.name}: Invalid email format in "to" field`);
      result.suggestions.push(`Consider using: {{ $json.email }} or a valid email address`);
      return false;
    }

    if (!node.parameters.subject) {
      node.parameters.subject = 'Notification from n8n Workflow';
      result.autoFixed.push(`${node.name}: Added default subject`);
    }

    if (!node.parameters.message) {
      node.parameters.message = '={{ $json.message }}';
      result.autoFixed.push(`${node.name}: Added default message template`);
    }

    return true;
  }

  validateTelegramParams(node, result) {
    if (!node.parameters.chatId) {
      result.errors.push(`${node.name}: Telegram chatId is required`);
      return false;
    }

    const chatId = node.parameters.chatId;
    if (typeof chatId === 'string' && !chatId.startsWith('={{')) {
      // Validar formato de Chat ID
      const isNumeric = /^-?\d+$/.test(chatId);
      const isUsername = chatId.startsWith('@');
      const isGroupId = chatId.startsWith('-');
      
      if (!isNumeric && !isUsername && !isGroupId) {
        result.errors.push(`${node.name}: Chat ID should be a number or start with @ for usernames or - for groups`);
        result.suggestions.push(`Examples: 123456789, @username, -123456789, or {{ $json.chatId }}`);
        return false;
      }
    }

    if (!node.parameters.text) {
      node.parameters.text = '{{ $json.message }}';
      result.autoFixed.push(`${node.name}: Added default text template`);
    }

    return true;
  }

  validateSlackParams(node, result) {
    if (!node.parameters.channel) {
      result.errors.push(`${node.name}: Slack channel is required`);
      return false;
    }

    const channel = node.parameters.channel;
    if (typeof channel === 'string' && !channel.startsWith('={{')) {
      if (!channel.startsWith('#') && !channel.startsWith('@') && !channel.startsWith('C')) {
        result.warnings.push(`${node.name}: Slack channel should start with # for channels, @ for DMs, or C for channel IDs`);
        result.suggestions.push(`Examples: #general, @username, C1234567890, or {{ $json.channel }}`);
      }
    }

    if (!node.parameters.text) {
      node.parameters.text = '{{ $json.message }}';
      result.autoFixed.push(`${node.name}: Added default text template`);
    }

    return true;
  }

  validateIfParams(node, result) {
    if (!node.parameters.conditions || !node.parameters.conditions.conditions || 
        node.parameters.conditions.conditions.length === 0) {
      result.errors.push(`${node.name}: If node requires at least one condition`);
      return false;
    }

    const conditions = node.parameters.conditions.conditions;
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      
      if (!condition.field || condition.field.trim() === '') {
        result.errors.push(`${node.name}: Condition ${i + 1}: Left value (field) is required`);
        return false;
      }

      if (!condition.operation) {
        result.errors.push(`${node.name}: Condition ${i + 1}: Operation is required`);
        return false;
      }

      if (condition.value === undefined || condition.value === '') {
        result.warnings.push(`${node.name}: Condition ${i + 1}: Right value is empty, consider if this is intentional`);
      }
    }

    return true;
  }

  validateWebhookParams(node, result) {
    if (!node.parameters.httpMethod) {
      node.parameters.httpMethod = 'POST';
      result.autoFixed.push(`${node.name}: Set default HTTP method to POST`);
    }

    if (!node.parameters.path) {
      node.parameters.path = 'webhook';
      result.autoFixed.push(`${node.name}: Set default webhook path`);
    }

    const path = node.parameters.path;
    if (typeof path === 'string' && path.includes(' ')) {
      result.warnings.push(`${node.name}: Webhook path contains spaces, consider using hyphens or underscores`);
      result.suggestions.push(`Example: webhook-endpoint instead of "webhook endpoint"`);
    }

    if (!node.parameters.responseMode) {
      node.parameters.responseMode = 'onReceived';
      result.autoFixed.push(`${node.name}: Set default response mode`);
    }

    return true;
  }

  validateHttpRequestParams(node, result) {
    if (!node.parameters.url) {
      result.errors.push(`${node.name}: HTTP Request URL is required`);
      return false;
    }

    const url = node.parameters.url;
    if (typeof url === 'string' && !url.startsWith('{{') && !url.startsWith('http')) {
      result.errors.push(`${node.name}: URL must start with http:// or https://`);
      result.suggestions.push(`Example: https://api.example.com/endpoint`);
      return false;
    }

    if (!node.parameters.method) {
      node.parameters.method = 'GET';
      result.autoFixed.push(`${node.name}: Set default HTTP method to GET`);
    }

    const method = node.parameters.method;
    if (['POST', 'PUT', 'PATCH'].includes(method) && !node.parameters.body) {
      result.warnings.push(`${node.name}: ${method} requests typically require a body`);
      result.suggestions.push(`Consider adding body content or using GET method`);
    }

    return true;
  }

  validateDatabaseParams(node, result) {
    if (!node.parameters.operation) {
      node.parameters.operation = 'executeQuery';
      result.autoFixed.push(`${node.name}: Set default operation to executeQuery`);
    }

    if (node.parameters.operation === 'executeQuery' && !node.parameters.query) {
      result.errors.push(`${node.name}: Database query is required for executeQuery operation`);
      return false;
    }

    return true;
  }

  validateSetParams(node, result) {
    // Manejar tanto arrays como objetos en parameters.values
    if (!node.parameters.values) {
      node.parameters.values = [{ name: 'output', value: '={{ $json }}' }];
      result.autoFixed.push(`${node.name}: Added default value mapping`);
    } else if (!Array.isArray(node.parameters.values)) {
      // Convertir objeto de valores a array
      const valuesObj = node.parameters.values;
      node.parameters.values = Object.keys(valuesObj).map(key => ({
        name: key,
        value: valuesObj[key]
      }));
      result.autoFixed.push(`${node.name}: Converted values object to array`);
    } else if (node.parameters.values.length === 0) {
      node.parameters.values = [{ name: 'output', value: '={{ $json }}' }];
      result.autoFixed.push(`${node.name}: Added default value mapping`);
    }

    if (Array.isArray(node.parameters.values)) {
      node.parameters.values.forEach((value, index) => {
        if (!value.name || value.name.trim() === '') {
          value.name = `field_${index + 1}`;
          result.autoFixed.push(`${node.name}: Fixed empty name in value ${index + 1}`);
        }
        
        if (!value.value && value.value !== 0 && value.value !== false) {
          value.value = '={{ $json }}';
          result.autoFixed.push(`${node.name}: Added default value for ${value.name}`);
        }
      });
    }

    return true;
  }

  validateCodeParams(node, result) {
    if (!node.parameters.jsCode) {
      node.parameters.jsCode = `// Process items
return items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));`;
      result.autoFixed.push(`${node.name}: Added default code template`);
    }

    const code = node.parameters.jsCode;
    if (!code.includes('return')) {
      result.warnings.push(`${node.name}: Code should include a return statement`);
      result.suggestions.push(`Example: return items.map(item => ({ json: item.json }));`);
    }

    return true;
  }
  getNodeValidations() {
    return {
      // ===== WEBHOOK & API VALIDATIONS =====
      'n8n-nodes-base.webhook': {
        requiredParams: ['httpMethod', 'path'],
        recommendedParams: ['responseMode', 'responseData'],
        validateParams: (params) => {
          if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(params.httpMethod)) {
            return 'HTTP method must be GET, POST, PUT, PATCH, or DELETE';
          }
          if (!params.path || params.path.length < 1) {
            return 'Path parameter is required';
          }
          if (params.path.includes(' ')) {
            return 'Path should not contain spaces, use hyphens or underscores';
          }
          return null;
        },
        performance: {
          maxExecutionTime: 30000, // 30 seconds
          recommendedTimeout: 10000
        }
      },

      // ===== TELEGRAM VALIDATIONS =====
      'n8n-nodes-base.telegram': {
        requiredParams: ['chatId'],
        conditionalParams: {
          'text': ['document', 'photo', 'audio', 'video', 'animation']
        },
        validateParams: (params) => {
          if (!params.chatId) {
            return 'Chat ID is required for Telegram messages';
          }
          if (!params.text && !params.document && !params.photo && !params.audio && !params.video && !params.animation) {
            return 'At least one content type (text, document, photo, audio, video, or animation) is required';
          }
          if (params.chatId && !params.chatId.toString().startsWith('@') && !params.chatId.toString().startsWith('-') && isNaN(params.chatId)) {
            return 'Chat ID should be a number or start with @ for usernames or - for groups';
          }
          return null;
        },
        security: {
          sensitiveParams: ['chatId'],
          rateLimit: 30 // messages per second
        }
      },

      // ===== GMAIL VALIDATIONS =====
      'n8n-nodes-base.gmail': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          const validOps = ['send', 'reply', 'draft', 'get', 'getAll', 'markAsRead', 'markAsUnread', 'move', 'trash'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }

          // Validation based on operation
          switch (params.operation) {
            case 'send':
              if (!params.to) return 'Recipient email (to) is required for send operation';
              if (params.to && !this.isValidEmail(params.to)) return 'Invalid email format in "to" field';
              break;
            case 'reply':
              if (!params.threadId) return 'Thread ID is required for reply operation';
              break;
            case 'get':
            case 'getAll':
              if (!params.messageId && !params.q) return 'Message ID or search query (q) is required';
              break;
          }

          if (params.cc && !this.isValidEmail(params.cc)) return 'Invalid email format in "cc" field';
          if (params.bcc && !this.isValidEmail(params.bcc)) return 'Invalid email format in "bcc" field';

          return null;
        },
        performance: {
          batchSize: 50, // emails per batch
          rateLimit: 250 // emails per day for free tier
        }
      },

      // ===== GOOGLE SHEETS VALIDATIONS =====
      'n8n-nodes-base.googleSheets': {
        requiredParams: ['operation', 'sheetId'],
        validateParams: (params) => {
          const validOps = ['append', 'read', 'update', 'clear', 'delete', 'create', 'get', 'search'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }
          if (!params.sheetId) {
            return 'Sheet ID is required';
          }

          // Validate sheet ID format
          if (!/^[a-zA-Z0-9-_]{44}$/.test(params.sheetId) && !params.sheetId.includes('/d/')) {
            return 'Invalid Google Sheets ID format';
          }

          // Operation-specific validations
          if (['append', 'update'].includes(params.operation) && !params.data) {
            return 'Data parameter is required for append/update operations';
          }

          if (params.range && !/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(params.range)) {
            return 'Range should be in format A1:B2';
          }

          return null;
        },
        performance: {
          maxRows: 10000,
          batchSize: 1000
        }
      },

      // ===== HTTP REQUEST VALIDATIONS =====
      'n8n-nodes-base.httpRequest': {
        requiredParams: ['method', 'url'],
        validateParams: (params) => {
          if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(params.method)) {
            return 'HTTP method must be GET, POST, PUT, PATCH, DELETE, HEAD, or OPTIONS';
          }
          if (!params.url || !params.url.startsWith('http')) {
            return 'Valid URL starting with http:// or https:// is required';
          }

          // URL validation
          try {
            new URL(params.url);
          } catch {
            return 'Invalid URL format';
          }

          // Headers validation
          if (params.headers) {
            const invalidHeaders = Object.keys(params.headers).filter(header =>
              !/^[a-zA-Z0-9-_]+$/.test(header)
            );
            if (invalidHeaders.length > 0) {
              return `Invalid header names: ${invalidHeaders.join(', ')}`;
            }
          }

          // Timeout validation
          if (params.timeout && (params.timeout < 1000 || params.timeout > 300000)) {
            return 'Timeout should be between 1000ms and 300000ms (5 minutes)';
          }

          return null;
        },
        security: {
          sensitiveParams: ['authentication', 'headers.Authorization'],
          sslRequired: true
        },
        performance: {
          defaultTimeout: 30000,
          maxRetries: 3
        }
      },

      // ===== CODE NODE VALIDATIONS =====
      'n8n-nodes-base.code': {
        requiredParams: ['mode'],
        validateParams: (params) => {
          if (!['runOnceForAllItems', 'runOnceForEachItem'].includes(params.mode)) {
            return 'Mode must be runOnceForAllItems or runOnceForEachItem';
          }
          if (!params.jsCode && !params.pythonCode) {
            return 'JavaScript or Python code is required';
          }

          // Code quality checks
          const code = params.jsCode || params.pythonCode;
          if (code && code.length > 10000) {
            return 'Code is too long (>10KB). Consider splitting into multiple nodes';
          }

          // Basic syntax validation for JavaScript
          if (params.jsCode) {
            try {
              new Function(params.jsCode);
            } catch (e) {
              return `JavaScript syntax error: ${e.message}`;
            }
          }

          return null;
        },
        performance: {
          maxExecutionTime: 60000, // 1 minute
          memoryLimit: '128MB'
        }
      },

      // ===== FUNCTION NODE VALIDATIONS =====
      'n8n-nodes-base.function': {
        requiredParams: ['functionCode'],
        validateParams: (params) => {
          if (!params.functionCode || params.functionCode.trim().length === 0) {
            return 'Function code is required';
          }

          // Code analysis
          const code = params.functionCode;
          if (code.length > 5000) {
            return 'Function code is too long (>5KB). Consider using Code node for complex logic';
          }

          // Check for dangerous patterns
          const dangerousPatterns = [
            /eval\s*\(/,
            /Function\s*\(/,
            /require\s*\(/,
            /import\s*\(/
          ];

          for (const pattern of dangerousPatterns) {
            if (pattern.test(code)) {
              return 'Potentially dangerous code pattern detected. Avoid using eval, Function constructor, or dynamic imports';
            }
          }

          return null;
        },
        performance: {
          maxExecutionTime: 30000,
          recommendedComplexity: 'O(n)'
        }
      },

      // ===== CRON TRIGGER VALIDATIONS =====
      'n8n-nodes-base.cron': {
        requiredParams: ['cronExpression'],
        validateParams: (params) => {
          if (!params.cronExpression) {
            return 'Cron expression is required';
          }

          const parts = params.cronExpression.split(' ');
          if (parts.length !== 5 && parts.length !== 6) {
            return 'Cron expression must have 5 or 6 parts (minute hour day month weekday [year])';
          }

          // Validate each part
          const validations = [
            { name: 'minute', range: [0, 59] },
            { name: 'hour', range: [0, 23] },
            { name: 'day', range: [1, 31] },
            { name: 'month', range: [1, 12] },
            { name: 'weekday', range: [0, 7] }
          ];

          for (let i = 0; i < Math.min(parts.length, validations.length); i++) {
            const part = parts[i];
            const validation = validations[i];

            if (part !== '*' && part !== '?' && !/^[0-9,-/*]+$/.test(part)) {
              return `Invalid ${validation.name} format: ${part}`;
            }
          }

          return null;
        },
        performance: {
          minInterval: 60, // 1 minute minimum
          recommendedMaxFrequency: '*/15 * * * *' // every 15 minutes
        }
      },

      // ===== IF NODE VALIDATIONS =====
      'n8n-nodes-base.if': {
        requiredParams: ['conditions'],
        validateParams: (params) => {
          if (!params.conditions || !Array.isArray(params.conditions) || params.conditions.length === 0) {
            return 'At least one condition is required';
          }

          // Validate each condition
          for (let i = 0; i < params.conditions.length; i++) {
            const condition = params.conditions[i];

            if (!condition.leftValue || !condition.rightValue) {
              return `Condition ${i + 1}: Both left and right values are required`;
            }

            if (!condition.operation) {
              return `Condition ${i + 1}: Operation is required`;
            }

            const validOperations = ['equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'contains', 'notContains', 'startsWith', 'endsWith', 'regex', 'isEmpty', 'isNotEmpty'];
            if (!validOperations.includes(condition.operation)) {
              return `Condition ${i + 1}: Invalid operation. Must be one of: ${validOperations.join(', ')}`;
            }
          }

          return null;
        },
        performance: {
          maxConditions: 10,
          recommendedConditions: 3
        }
      },

      // ===== LOOP VALIDATIONS =====
      'n8n-nodes-base.loopOverItems': {
        requiredParams: ['batchSize'],
        validateParams: (params) => {
          if (params.batchSize && (params.batchSize < 1 || params.batchSize > 1000)) {
            return 'Batch size must be between 1 and 1000';
          }

          if (!params.batchSize) {
            return 'Batch size is required';
          }

          return null;
        },
        performance: {
          defaultBatchSize: 100,
          maxBatchSize: 1000,
          recommendedBatchSize: 50
        }
      },

      // ===== OPENAI VALIDATIONS =====
      'n8n-nodes-base.openAi': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          const validOps = ['chat', 'completion', 'image', 'audio', 'moderation', 'embedding', 'analyze', 'predict'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }

          // Operation-specific validations
          switch (params.operation) {
            case 'chat':
              if (!params.messages || !Array.isArray(params.messages)) {
                return 'Messages array is required for chat operation';
              }
              if (!params.model) {
                return 'Model is required for chat operation (gpt-4, gpt-3.5-turbo, etc.)';
              }
              break;
            case 'completion':
              if (!params.prompt) return 'Prompt is required for completion operation';
              break;
            case 'image':
              if (!params.prompt) return 'Prompt is required for image generation';
              if (params.size && !['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'].includes(params.size)) {
                return 'Image size must be 256x256, 512x512, 1024x1024, 1024x1792, or 1792x1024';
              }
              break;
            case 'analyze':
              if (!params.input) return 'Input data is required for analysis';
              break;
            case 'predict':
              if (!params.data) return 'Data is required for prediction';
              break;
          }

          return null;
        },
        performance: {
          maxTokens: 128000, // GPT-4 Turbo limit
          rateLimit: 60, // requests per minute
          costOptimization: true
        },
        useCases: [
          'sentiment analysis',
          'text classification',
          'content generation',
          'data analysis',
          'prediction',
          'churn analysis',
          'customer insights',
          'code analysis',
          'documentation generation'
        ]
      },

      // ===== ANTHROPIC CLAUDE VALIDATIONS =====
      'n8n-nodes-base.anthropic': {
        requiredParams: ['messages'],
        validateParams: (params) => {
          if (!params.messages || !Array.isArray(params.messages)) {
            return 'Messages array is required for Anthropic Claude';
          }
          if (!params.model) {
            return 'Model is required (claude-3-opus, claude-3-sonnet, claude-3-haiku)';
          }
          const validModels = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-2.1', 'claude-2.0'];
          if (!validModels.some(model => params.model.includes(model))) {
            return `Model should be one of: ${validModels.join(', ')}`;
          }

          // Validate messages format
          for (const message of params.messages) {
            if (!message.role || !['user', 'assistant', 'system'].includes(message.role)) {
              return 'Each message must have a valid role: user, assistant, or system';
            }
            if (!message.content) {
              return 'Each message must have content';
            }
          }

          return null;
        },
        performance: {
          maxTokens: 200000, // Claude 3 context window
          rateLimit: 50,
          bestFor: ['reasoning', 'analysis', 'creative writing', 'code review']
        }
      },

      // ===== GOOGLE VERTEX AI VALIDATIONS =====
      'n8n-nodes-base.googleVertexAi': {
        requiredParams: ['operation', 'model'],
        validateParams: (params) => {
          const validOps = ['predict', 'chat', 'embedding', 'classification'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }
          if (!params.projectId) return 'GCP Project ID is required';
          if (!params.location) return 'Location is required (us-central1, europe-west1, etc.)';

          return null;
        },
        performance: {
          maxTokens: 32000,
          rateLimit: 100,
          costEffective: true
        }
      },

      // ===== HUGGING FACE VALIDATIONS =====
      'n8n-nodes-base.huggingFace': {
        requiredParams: ['model', 'task'],
        validateParams: (params) => {
          const validTasks = ['text-classification', 'sentiment-analysis', 'text-generation', 'question-answering', 'summarization'];
          if (!validTasks.includes(params.task)) {
            return `Task must be one of: ${validTasks.join(', ')}`;
          }
          if (!params.model) return 'Model name is required (e.g., bert-base-uncased, gpt2)';
          if (!params.inputs) return 'Input text is required';

          return null;
        },
        performance: {
          maxInputLength: 512,
          rateLimit: 30,
          openSource: true
        }
      },

      // ===== GOOGLE GEMINI VALIDATIONS =====
      'n8n-nodes-base.googleGemini': {
        requiredParams: ['operation', 'model'],
        validateParams: (params) => {
          const validOps = ['generateContent', 'chat', 'countTokens', 'embedding', 'batchEmbedding'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }
          const validModels = ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];
          if (!validModels.some(model => params.model.includes(model))) {
            return `Model should be one of: ${validModels.join(', ')}`;
          }
          if (!params.prompt && !params.messages) return 'Prompt or messages required';
          return null;
        },
        performance: {
          maxTokens: 2000000, // Gemini 1.5 Pro context window
          rateLimit: 60,
          multiModal: true
        }
      },

      // ===== AZURE OPENAI VALIDATIONS =====
      'n8n-nodes-base.azureOpenAi': {
        requiredParams: ['operation', 'deploymentName'],
        validateParams: (params) => {
          const validOps = ['chat', 'completion', 'embedding', 'image', 'audio'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }
          if (!params.deploymentName) return 'Azure deployment name is required';
          if (!params.resourceName) return 'Azure resource name is required';
          if (!params.apiVersion) return 'API version is required (e.g., 2023-12-01-preview)';
          return null;
        },
        performance: {
          maxTokens: 128000,
          rateLimit: 240,
          enterprise: true
        }
      },

      // ===== AWS BEDROCK VALIDATIONS =====
      'n8n-nodes-base.awsBedrock': {
        requiredParams: ['modelId', 'operation'],
        validateParams: (params) => {
          const validModels = ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'llama2-70b', 'titan-text-express'];
          if (!validModels.some(model => params.modelId.includes(model))) {
            return `Model ID should contain one of: ${validModels.join(', ')}`;
          }
          if (!params.region) return 'AWS region is required (e.g., us-east-1)';
          if (!params.body) return 'Request body is required';
          return null;
        },
        performance: {
          maxTokens: 200000,
          rateLimit: 100,
          awsNative: true
        }
      },

      // ===== MISTRAL AI VALIDATIONS =====
      'n8n-nodes-base.mistral': {
        requiredParams: ['model', 'messages'],
        validateParams: (params) => {
          const validModels = ['mistral-tiny', 'mistral-small', 'mistral-medium', 'mistral-large'];
          if (!validModels.includes(params.model)) {
            return `Model must be one of: ${validModels.join(', ')}`;
          }
          if (!params.messages || !Array.isArray(params.messages)) {
            return 'Messages array is required';
          }
          return null;
        },
        performance: {
          maxTokens: 32000,
          rateLimit: 60,
          europeanAI: true
        }
      },

      // ===== PERPLEXITY VALIDATIONS =====
      'n8n-nodes-base.perplexity': {
        requiredParams: ['model', 'messages'],
        validateParams: (params) => {
          const validModels = ['pplx-7b-online', 'pplx-70b-online', 'pplx-7b-chat', 'pplx-70b-chat'];
          if (!validModels.includes(params.model)) {
            return `Model must be one of: ${validModels.join(', ')}`;
          }
          if (!params.messages) return 'Messages are required';
          return null;
        },
        performance: {
          maxTokens: 4096,
          rateLimit: 20,
          realTimeSearch: true
        }
      },

      // ===== ELEVENLABS VALIDATIONS =====
      'n8n-nodes-base.elevenlabs': {
        requiredParams: ['voiceId', 'text'],
        validateParams: (params) => {
          if (!params.voiceId) return 'Voice ID is required';
          if (!params.text) return 'Text to speak is required';
          if (params.text.length > 5000) return 'Text too long (max 5000 characters)';
          return null;
        },
        performance: {
          maxCharacters: 5000,
          rateLimit: 30,
          audioOutput: true
        }
      },

      // ===== STABLE DIFFUSION VALIDATIONS =====
      'n8n-nodes-base.stablediffusion': {
        requiredParams: ['prompt'],
        validateParams: (params) => {
          if (!params.prompt) return 'Prompt is required for image generation';
          if (params.steps && (params.steps < 10 || params.steps > 150)) {
            return 'Steps should be between 10 and 150';
          }
          if (params.cfg_scale && (params.cfg_scale < 1 || params.cfg_scale > 20)) {
            return 'CFG scale should be between 1 and 20';
          }
          return null;
        },
        performance: {
          maxPromptLength: 1000,
          rateLimit: 10,
          imageGeneration: true
        }
      },

      // ===== LEONARDO AI VALIDATIONS =====
      'n8n-nodes-base.leonardo': {
        requiredParams: ['prompt', 'modelId'],
        validateParams: (params) => {
          if (!params.prompt) return 'Prompt is required';
          if (!params.modelId) return 'Model ID is required';
          if (params.num_images && (params.num_images < 1 || params.num_images > 8)) {
            return 'Number of images should be between 1 and 8';
          }
          return null;
        },
        performance: {
          maxImages: 8,
          rateLimit: 15,
          premiumFeatures: true
        }
      },

      // ===== OLLAMA CHAT VALIDATIONS =====
      'n8n-nodes-base.ollamaChat': {
        requiredParams: ['model', 'prompt'],
        validateParams: (params) => {
          if (!params.model) return 'Ollama model name is required (e.g., llama2, codellama)';
          if (!params.prompt) return 'Prompt is required';
          if (!params.baseUrl) return 'Ollama base URL is required (e.g., http://localhost:11434)';
          return null;
        },
        performance: {
          maxTokens: 4096,
          localModel: true,
          offline: true
        }
      },

      // ===== LANGCHAIN AGENT VALIDATIONS =====
      'n8n-nodes-base.langchain-agent': {
        requiredParams: ['agentType', 'tools', 'llm'],
        validateParams: (params) => {
          const validAgents = ['zero-shot-react-description', 'react-docstore', 'self-ask-with-search', 'conversational-react-description'];
          if (!validAgents.includes(params.agentType)) {
            return `Agent type must be one of: ${validAgents.join(', ')}`;
          }
          if (!params.tools || !Array.isArray(params.tools)) {
            return 'Tools array is required';
          }
          if (!params.llm) return 'LLM configuration is required';
          return null;
        },
        performance: {
          maxIterations: 15,
          timeout: 300000,
          agentFramework: true
        }
      },

      // ===== CREW AI VALIDATIONS =====
      'n8n-nodes-base.crewai': {
        requiredParams: ['agents', 'tasks'],
        validateParams: (params) => {
          if (!params.agents || !Array.isArray(params.agents)) {
            return 'Agents array is required';
          }
          if (!params.tasks || !Array.isArray(params.tasks)) {
            return 'Tasks array is required';
          }
          if (params.agents.length === 0) return 'At least one agent is required';
          if (params.tasks.length === 0) return 'At least one task is required';
          return null;
        },
        performance: {
          maxAgents: 10,
          maxTasks: 20,
          multiAgentSystem: true
        }
      },

      // ===== COHERE VALIDATIONS =====
      'n8n-nodes-base.cohere': {
        requiredParams: ['model', 'prompt'],
        validateParams: (params) => {
          const validModels = ['command', 'command-light', 'command-nightly'];
          if (!validModels.includes(params.model)) {
            return `Model must be one of: ${validModels.join(', ')}`;
          }
          if (!params.prompt) return 'Prompt is required';
          return null;
        },
        performance: {
          maxTokens: 4096,
          rateLimit: 100,
          enterpriseGrade: true
        }
      },

      // ===== TOGETHER AI VALIDATIONS =====
      'n8n-nodes-base.together': {
        requiredParams: ['model', 'messages'],
        validateParams: (params) => {
          if (!params.model) return 'Model name is required';
          if (!params.messages) return 'Messages are required';
          return null;
        },
        performance: {
          maxTokens: 8192,
          rateLimit: 60,
          openSource: true
        }
      },

      // ===== FIREWORKS AI VALIDATIONS =====
      'n8n-nodes-base.fireworks': {
        requiredParams: ['model', 'messages'],
        validateParams: (params) => {
          if (!params.model) return 'Model name is required';
          if (!params.messages) return 'Messages are required';
          return null;
        },
        performance: {
          maxTokens: 4096,
          rateLimit: 120,
          ultraFast: true
        }
      },

      // ===== WHISPER VALIDATIONS =====
      'n8n-nodes-base.whisper': {
        requiredParams: ['file'],
        validateParams: (params) => {
          if (!params.file) return 'Audio file is required';
          const supportedFormats = ['mp3', 'wav', 'm4a', 'flac', 'webm'];
          if (params.file && !supportedFormats.some(format => params.file.toLowerCase().includes(format))) {
            return `File format should be one of: ${supportedFormats.join(', ')}`;
          }
          return null;
        },
        performance: {
          maxFileSize: '25MB',
          rateLimit: 50,
          speechToText: true
        }
      },

      // ===== DEEPL VALIDATIONS =====
      'n8n-nodes-base.deepl': {
        requiredParams: ['text', 'targetLanguage'],
        validateParams: (params) => {
          if (!params.text) return 'Text to translate is required';
          if (!params.targetLanguage) return 'Target language is required';
          const supportedLangs = ['EN', 'DE', 'FR', 'ES', 'IT', 'JA', 'KO', 'PT', 'RU', 'ZH'];
          if (!supportedLangs.includes(params.targetLanguage.toUpperCase())) {
            return `Target language must be one of: ${supportedLangs.join(', ')}`;
          }
          return null;
        },
        performance: {
          maxCharacters: 5000,
          rateLimit: 100,
          premiumTranslation: true
        }
      },

      // ===== REPLICATE VALIDATIONS =====
      'n8n-nodes-base.replicate': {
        requiredParams: ['version', 'input'],
        validateParams: (params) => {
          if (!params.version) return 'Model version is required (e.g., stability-ai/stable-diffusion:v1.4)';
          if (!params.input) return 'Input parameters are required';
          return null;
        },
        performance: {
          maxExecutionTime: 300000, // 5 minutes
          rateLimit: 20,
          openSourceModels: true
        }
      },

      // ===== PIKA LABS VALIDATIONS =====
      'n8n-nodes-base.pika': {
        requiredParams: ['prompt'],
        validateParams: (params) => {
          if (!params.prompt) return 'Video generation prompt is required';
          if (params.duration && (params.duration < 1 || params.duration > 4)) {
            return 'Duration should be between 1 and 4 seconds';
          }
          return null;
        },
        performance: {
          maxDuration: 4,
          rateLimit: 10,
          videoGeneration: true
        }
      },

      // ===== RUNWAY VALIDATIONS =====
      'n8n-nodes-base.runway': {
        requiredParams: ['model', 'prompt'],
        validateParams: (params) => {
          const validModels = ['gen-2', 'gen-1', 'inpainting', 'image-to-video'];
          if (!validModels.includes(params.model)) {
            return `Model must be one of: ${validModels.join(', ')}`;
          }
          if (!params.prompt) return 'Prompt is required';
          return null;
        },
        performance: {
          maxDuration: 8,
          rateLimit: 5,
          professionalVideo: true
        }
      },

      // ===== SYNTHESIA VALIDATIONS =====
      'n8n-nodes-base.synthesia': {
        requiredParams: ['script', 'avatar'],
        validateParams: (params) => {
          if (!params.script) return 'Video script is required';
          if (!params.avatar) return 'Avatar selection is required';
          if (params.script.length > 10000) return 'Script is too long (max 10,000 characters)';
          return null;
        },
        performance: {
          maxDuration: 600, // 10 minutes
          rateLimit: 10,
          aiPresenters: true
        }
      },

      // ===== TENSORFLOW VALIDATIONS =====
      'n8n-nodes-base.tensorflow': {
        requiredParams: ['model', 'input'],
        validateParams: (params) => {
          if (!params.model) return 'TensorFlow model path is required';
          if (!params.input) return 'Input data is required';
          return null;
        },
        performance: {
          maxModelSize: '2GB',
          rateLimit: 30,
          mlFramework: true
        }
      },

      // ===== PYTORCH VALIDATIONS =====
      'n8n-nodes-base.pytorch': {
        requiredParams: ['model', 'input'],
        validateParams: (params) => {
          if (!params.model) return 'PyTorch model path is required';
          if (!params.input) return 'Input tensor is required';
          return null;
        },
        performance: {
          maxModelSize: '2GB',
          rateLimit: 30,
          deepLearning: true
        }
      },

      // ===== LOCAL AI VALIDATIONS =====
      'n8n-nodes-base.localAi': {
        requiredParams: ['model', 'prompt'],
        validateParams: (params) => {
          if (!params.model) return 'Local AI model name is required';
          if (!params.prompt) return 'Prompt is required';
          if (!params.baseUrl) return 'Local AI base URL is required';
          return null;
        },
        performance: {
          maxTokens: 4096,
          localHosting: true,
          privacyFirst: true
        }
      },

      // ===== RUNPOD VALIDATIONS =====
      'n8n-nodes-base.runpod': {
        requiredParams: ['endpoint', 'input'],
        validateParams: (params) => {
          if (!params.endpoint) return 'RunPod endpoint ID is required';
          if (!params.input) return 'Input data is required';
          return null;
        },
        performance: {
          maxExecutionTime: 300000,
          rateLimit: 100,
          serverlessGPU: true
        }
      },

      // ===== MODAL VALIDATIONS =====
      'n8n-nodes-base.modal': {
        requiredParams: ['function', 'input'],
        validateParams: (params) => {
          if (!params.function) return 'Modal function name is required';
          if (!params.input) return 'Input parameters are required';
          return null;
        },
        performance: {
          maxExecutionTime: 900000, // 15 minutes
          rateLimit: 50,
          cloudCompute: true
        }
      },

      // ===== DALLE-3 VALIDATIONS =====
      'n8n-nodes-base.dalleE3': {
        requiredParams: ['prompt'],
        validateParams: (params) => {
          if (!params.prompt) return 'Image generation prompt is required';
          if (params.size && !['1024x1024', '1024x1792', '1792x1024'].includes(params.size)) {
            return 'Size must be 1024x1024, 1024x1792, or 1792x1024';
          }
          if (params.quality && !['standard', 'hd'].includes(params.quality)) {
            return 'Quality must be standard or hd';
          }
          return null;
        },
        performance: {
          maxImages: 1,
          rateLimit: 50,
          highQuality: true
        }
      },

      // ===== KANDINSKY VALIDATIONS =====
      'n8n-nodes-base.kandinsky': {
        requiredParams: ['prompt'],
        validateParams: (params) => {
          if (!params.prompt) return 'Image generation prompt is required';
          if (params.steps && (params.steps < 10 || params.steps > 100)) {
            return 'Steps should be between 10 and 100';
          }
          return null;
        },
        performance: {
          maxSteps: 100,
          rateLimit: 20,
          russianAI: true
        }
      },

      // ===== DATABASE VALIDATIONS =====
      'n8n-nodes-base.mongoDb': {
        requiredParams: ['operation', 'collection'],
        validateParams: (params) => {
          const validOps = ['find', 'findOne', 'insert', 'update', 'delete', 'aggregate', 'count'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }

          if (!params.collection) {
            return 'Collection name is required';
          }

          // Validate collection name
          if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(params.collection)) {
            return 'Invalid collection name format';
          }

          return null;
        },
        security: {
          sensitiveParams: ['connectionString'],
          encryptionRequired: true
        }
      },

      // ===== AIRTABLE VALIDATIONS =====
      'n8n-nodes-base.airtable': {
        requiredParams: ['operation', 'baseId', 'table'],
        validateParams: (params) => {
          const validOps = ['get', 'getAll', 'create', 'update', 'delete', 'search'];
          if (!validOps.includes(params.operation)) {
            return `Operation must be one of: ${validOps.join(', ')}`;
          }

          if (!params.baseId) {
            return 'Base ID is required';
          }

          if (!params.table) {
            return 'Table name is required';
          }

          // Validate Airtable base ID format
          if (!/^app[a-zA-Z0-9]{14}$/.test(params.baseId)) {
            return 'Invalid Airtable base ID format (should start with "app" followed by 14 characters)';
          }

          return null;
        },
        performance: {
          maxRecords: 100,
          rateLimit: 5 // requests per second
        }
      }
    };
  }

  // VALIDACIONES DE CONEXIONES - MEJORADAS
  getConnectionValidations() {
    return {
      // Reglas de compatibilidad entre tipos de nodos
      compatibility: {
        // Triggers solo pueden ser el primer nodo
        'n8n-nodes-base.webhook': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.telegramTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.cron': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.scheduleTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.gmailTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },
        'n8n-nodes-base.jiraTrigger': { canBeFirst: true, canBeMiddle: false, canBeLast: false },

        // Actions pueden estar en cualquier posición
        'n8n-nodes-base.set': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.function': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.code': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.httpRequest': { canBeFirst: false, canBeMiddle: true, canBeLast: true },

        // Outputs solo pueden ser últimos
        'n8n-nodes-base.emailSend': { canBeFirst: false, canBeMiddle: false, canBeLast: true },
        'n8n-nodes-base.gmail': { canBeFirst: false, canBeMiddle: false, canBeLast: true },
        'n8n-nodes-base.telegram': { canBeFirst: false, canBeMiddle: false, canBeLast: true },
        'n8n-nodes-base.discord': { canBeFirst: false, canBeMiddle: false, canBeLast: true },
        'n8n-nodes-base.slack': { canBeFirst: false, canBeMiddle: false, canBeLast: true },

        // Bases de datos pueden estar en medio
        'n8n-nodes-base.mongoDb': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.airtable': { canBeFirst: false, canBeMiddle: true, canBeLast: true },
        'n8n-nodes-base.googleSheets': { canBeFirst: false, canBeMiddle: true, canBeLast: true },

        // Nodos condicionales
        'n8n-nodes-base.if': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.switch': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.filter': { canBeFirst: false, canBeMiddle: true, canBeLast: false },

        // Nodos de bucle
        'n8n-nodes-base.loopOverItems': { canBeFirst: false, canBeMiddle: true, canBeLast: false },
        'n8n-nodes-base.splitInBatches': { canBeFirst: false, canBeMiddle: true, canBeLast: false }
      },

      // Reglas de flujo de datos mejoradas
      dataFlow: {
        // Nodos que requieren datos de entrada
        requiresInput: [
          'n8n-nodes-base.set',
          'n8n-nodes-base.function',
          'n8n-nodes-base.code',
          'n8n-nodes-base.if',
          'n8n-nodes-base.filter',
          'n8n-nodes-base.switch',
          'n8n-nodes-base.loopOverItems',
          'n8n-nodes-base.emailSend',
          'n8n-nodes-base.gmail',
          'n8n-nodes-base.telegram',
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.notion',
          'n8n-nodes-base.mongoDb',
          'n8n-nodes-base.openAi'
        ],

        // Nodos que pueden funcionar sin entrada (triggers y algunos servicios)
        canWorkWithoutInput: [
          'n8n-nodes-base.webhook',
          'n8n-nodes-base.cron',
          'n8n-nodes-base.scheduleTrigger',
          'n8n-nodes-base.telegramTrigger',
          'n8n-nodes-base.gmailTrigger',
          'n8n-nodes-base.jiraTrigger',
          'n8n-nodes-base.httpRequest',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.googleSheets'
        ],

        // Nodos que generan datos de salida
        producesOutput: [
          'n8n-nodes-base.webhook',
          'n8n-nodes-base.httpRequest',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.mongoDb',
          'n8n-nodes-base.openAi',
          'n8n-nodes-base.function',
          'n8n-nodes-base.code',
          'n8n-nodes-base.set'
        ]
      },

      // Reglas de secuenciación
      sequencing: {
        // Nodos que deben ir después de otros específicos
        mustFollow: {
          'n8n-nodes-base.if': ['n8n-nodes-base.set', 'n8n-nodes-base.function', 'n8n-nodes-base.code'],
          'n8n-nodes-base.filter': ['n8n-nodes-base.set', 'n8n-nodes-base.function', 'n8n-nodes-base.code'],
          'n8n-nodes-base.loopOverItems': ['n8n-nodes-base.set', 'n8n-nodes-base.function', 'n8n-nodes-base.code']
        },

        // Nodos que no deberían ir después de otros
        shouldNotFollow: {
          'n8n-nodes-base.emailSend': ['n8n-nodes-base.emailSend', 'n8n-nodes-base.gmail'],
          'n8n-nodes-base.gmail': ['n8n-nodes-base.emailSend', 'n8n-nodes-base.gmail']
        }
      },

      // Reglas de rendimiento
      performance: {
        // Nodos que pueden causar cuellos de botella
        potentialBottlenecks: [
          'n8n-nodes-base.loopOverItems',
          'n8n-nodes-base.httpRequest',
          'n8n-nodes-base.openAi',
          'n8n-nodes-base.function',
          'n8n-nodes-base.code'
        ],

        // Límite de conexiones por nodo
        maxConnectionsPerNode: 5,

        // Profundidad máxima recomendada
        maxDepth: 15,

        // Tamaño máximo de lote recomendado
        maxBatchSize: 100
      },

      // Reglas de seguridad
      security: {
        // Nodos que requieren autenticación
        requiresAuth: [
          'n8n-nodes-base.gmail',
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.telegram',
          'n8n-nodes-base.slack',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.openAi',
          'n8n-nodes-base.github',
          'n8n-nodes-base.gitlab'
        ],

        // Nodos que manejan datos sensibles
        handlesSensitiveData: [
          'n8n-nodes-base.gmail',
          'n8n-nodes-base.emailSend',
          'n8n-nodes-base.airtable',
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.mongoDb'
        ]
      },

      // Validaciones de estructura de workflow
      structure: {
        maxConnectionsPerNode: 10,
        maxDepth: 50,
        validateCircularReferences: true,
        requireTriggerNodes: true,
        allowOrphanNodes: false,
        validateDataFlow: true
      }
    };
  }

  // VALIDACIONES DE CREDENCIALES
  getCredentialValidations() {
    return {
      'n8n-nodes-base.telegram': ['telegramApi'],
      'n8n-nodes-base.telegramTrigger': ['telegramApi'],
      'n8n-nodes-base.gmail': ['gmailApi'],
      'n8n-nodes-base.googleSheets': ['googleSheetsApi'],
      'n8n-nodes-base.googleCalendar': ['googleCalendarApi'],
      'n8n-nodes-base.googleDrive': ['googleDriveApi'],
      'n8n-nodes-base.slack': ['slackApi'],
      'n8n-nodes-base.discord': ['discordApi'],
      'n8n-nodes-base.twitter': ['twitterApi'],
      'n8n-nodes-base.facebook': ['facebookApi'],
      'n8n-nodes-base.instagram': ['instagramApi'],
      'n8n-nodes-base.linkedin': ['linkedinApi'],
      'n8n-nodes-base.shopify': ['shopifyApi'],
      'n8n-nodes-base.stripe': ['stripeApi'],
      'n8n-nodes-base.paypal': ['paypalApi'],
      'n8n-nodes-base.twilio': ['twilioApi'],
      'n8n-nodes-base.sendgrid': ['sendgridApi'],
      'n8n-nodes-base.mailgun': ['mailgunApi'],
      'n8n-nodes-base.openAi': ['openAiApi'],
      'n8n-nodes-base.anthropic': ['anthropicApi'],
      'n8n-nodes-base.huggingFace': ['huggingFaceApi'],
      'n8n-nodes-base.airtable': ['airtableApi'],
      'n8n-nodes-base.notion': ['notionApi'],
      'n8n-nodes-base.github': ['githubApi'],
      'n8n-nodes-base.gitlab': ['gitlabApi'],
      'n8n-nodes-base.jira': ['jiraApi'],
      'n8n-nodes-base.zendesk': ['zendeskApi'],
      'n8n-nodes-base.asana': ['asanaApi'],
      'n8n-nodes-base.trello': ['trelloApi'],
      'n8n-nodes-base.awsS3': ['awsApi'],
      'n8n-nodes-base.postgres': ['postgresApi'],
      'n8n-nodes-base.mysql': ['mysqlApi'],
      'n8n-nodes-base.mongoDb': ['mongoDbApi']
    };
  }

  // ===== FUNCIONES DE VALIDACIÓN AVANZADAS =====

  // VALIDACIÓN INTEGRAL DEL WORKFLOW COMPLETO
  async validateWorkflow(workflow) {
    const results = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      corrections: [],
      stats: {
        totalNodes: 0,
        totalConnections: 0,
        triggers: 0,
        actions: 0,
        aiNodes: 0,
        complexity: 'low'
      }
    };

    try {
      // 1. VALIDACIÓN BÁSICA DE ESTRUCTURA
      if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
        results.errors.push('Workflow must have a nodes array');
        results.isValid = false;
        return results;
      }

      results.stats.totalNodes = workflow.nodes.length;
      results.stats.totalConnections = Object.keys(workflow.connections || {}).length;

      // 2. VALIDACIÓN DE NODOS INDIVIDUALES
      for (const node of workflow.nodes) {
        const nodeValidation = await this.validateSingleNode(node);

        if (!nodeValidation.isValid) {
          results.errors.push(`Node "${node.name}": ${nodeValidation.errors.join(', ')}`);
          results.isValid = false;
        }

        if (nodeValidation.warnings) {
          results.warnings.push(...nodeValidation.warnings.map(w => `Node "${node.name}": ${w}`));
        }

        if (nodeValidation.corrections) {
          results.corrections.push(...nodeValidation.corrections);
        }

        // Estadísticas por tipo
        if (this.validationSystem.validNodeTypes.triggers.includes(node.type)) {
          results.stats.triggers++;
        } else {
          results.stats.actions++;
        }

        if (this.validationSystem.validNodeTypes.ai.includes(node.type)) {
          results.stats.aiNodes++;
        }
      }

      // 3. VALIDACIÓN DE CONEXIONES
      const connectionValidation = this.validateConnections(workflow);
      if (!connectionValidation.isValid) {
        results.errors.push(...connectionValidation.errors);
        results.isValid = false;
      }

      // 4. DETECCIÓN Y CORRECCIÓN DE NODOS DE IA INCORRECTOS
      const aiCorrections = this.detectAndCorrectAINodes(workflow);
      if (aiCorrections.length > 0) {
        results.corrections.push(...aiCorrections);
        results.warnings.push(`Found ${aiCorrections.length} AI nodes using incorrect node types`);
      }

      // 5. ANÁLISIS DE COMPLEJIDAD
      results.stats.complexity = this.calculateWorkflowComplexity(workflow);

      // 6. SUGERENCIAS DE OPTIMIZACIÓN
      const optimizations = this.generateOptimizationSuggestions(workflow);
      results.suggestions.push(...optimizations);

      // 7. VALIDACIÓN DE SEGURIDAD
      const securityCheck = this.validateWorkflowSecurity(workflow);
      if (securityCheck.warnings.length > 0) {
        results.warnings.push(...securityCheck.warnings);
      }

      return results;

    } catch (error) {
      results.errors.push(`Validation error: ${error.message}`);
      results.isValid = false;
      return results;
    }
  }

  // VALIDACIÓN DE UN SOLO NODO
  async validateSingleNode(node) {
    const result = { isValid: true, errors: [], warnings: [], corrections: [] };

    // Validación básica
    if (!node.type || !node.name || !node.parameters) {
      result.errors.push('Node must have type, name, and parameters');
      result.isValid = false;
      return result;
    }

    // Validación específica por tipo
    const validation = this.validationSystem.nodeValidations[node.type];
    if (validation && validation.validateParams) {
      const paramError = validation.validateParams(node.parameters);
      if (paramError) {
        result.errors.push(paramError);
        result.isValid = false;
      }
    }

    return result;
  }

  // VALIDAR CONEXIONES DEL WORKFLOW
  validateConnections(workflow) {
    const result = { isValid: true, errors: [], warnings: [], autoFixed: [] };

    if (!workflow.connections) {
      result.errors.push('Workflow must have connections object');
      result.isValid = false;
      return result;
    }

    const nodeNames = workflow.nodes.map(n => n.name);
    const nodesByName = {};
    workflow.nodes.forEach(node => {
      nodesByName[node.name] = node;
    });

    // Verificar que todas las conexiones referencien nodos existentes
    Object.keys(workflow.connections).forEach(sourceName => {
      if (!nodeNames.includes(sourceName)) {
        result.errors.push(`Connection references non-existent node: ${sourceName}`);
        result.isValid = false;
      } else {
        // Verificar conexiones salientes
        const connections = workflow.connections[sourceName];
        if (connections.main && Array.isArray(connections.main)) {
          connections.main.forEach((connectionGroup, groupIndex) => {
            if (Array.isArray(connectionGroup)) {
              connectionGroup.forEach((connection, connIndex) => {
                if (!nodeNames.includes(connection.node)) {
                  result.errors.push(`Node "${sourceName}" connects to non-existent node: ${connection.node}`);
                  result.isValid = false;
                }
              });
            }
          });
        }
      }
    });

    // CORRECCIÓN AUTOMÁTICA: Crear conexiones faltantes para nodos desconectados
    const connectedNodes = new Set();
    const sourceNodes = new Set(Object.keys(workflow.connections));
    
    // Marcar nodos que ya tienen conexiones entrantes
    Object.keys(workflow.connections).forEach(sourceName => {
      const connections = workflow.connections[sourceName];
      if (connections.main) {
        connections.main.forEach(connectionGroup => {
          if (Array.isArray(connectionGroup)) {
            connectionGroup.forEach(connection => {
              connectedNodes.add(connection.node);
            });
          }
        });
      }
    });

    // Encontrar nodos huérfanos (sin conexiones entrantes excepto triggers)
    const triggerTypes = ['n8n-nodes-base.webhook', 'n8n-nodes-base.cron', 'n8n-nodes-base.emailTrigger'];
    const orphanNodes = workflow.nodes.filter(node => {
      const isOrphan = !connectedNodes.has(node.name) && !triggerTypes.includes(node.type);
      return isOrphan;
    });

    // AUTO-FIX: Conectar nodos huérfanos secuencialmente
    if (orphanNodes.length > 0) {
      console.log(`🔧 Auto-conectando ${orphanNodes.length} nodos huérfanos...`);
      
      // Encontrar el último nodo conectado o usar trigger si no hay conexiones
      let lastConnectedNode = null;
      const triggerNodes = workflow.nodes.filter(n => triggerTypes.includes(n.type));
      
      if (sourceNodes.size > 0) {
        // Buscar el nodo que no tiene conexiones salientes (nodo final)
        const finalNodes = workflow.nodes.filter(n => 
          connectedNodes.has(n.name) && !sourceNodes.has(n.name)
        );
        lastConnectedNode = finalNodes[finalNodes.length - 1];
      } else if (triggerNodes.length > 0) {
        lastConnectedNode = triggerNodes[0];
      }

      if (lastConnectedNode) {
        orphanNodes.forEach((orphanNode, index) => {
          const sourceNodeName = index === 0 ? lastConnectedNode.name : orphanNodes[index - 1].name;
          
          // Crear conexión
          if (!workflow.connections[sourceNodeName]) {
            workflow.connections[sourceNodeName] = { main: [] };
          }
          if (!workflow.connections[sourceNodeName].main[0]) {
            workflow.connections[sourceNodeName].main[0] = [];
          }
          
          workflow.connections[sourceNodeName].main[0].push({
            node: orphanNode.name,
            type: 'main',
            index: 0
          });

          result.autoFixed.push(`Connected ${sourceNodeName} → ${orphanNode.name}`);
        });
      }
    }

    // VALIDACIÓN ADICIONAL: Verificar lógica de flujo
    const triggerNodes = workflow.nodes.filter(n => triggerTypes.includes(n.type));
    if (triggerNodes.length === 0) {
      result.warnings.push('Workflow should have at least one trigger node');
    }

    // Verificar nodos finales (sin conexiones salientes)
    const finalNodes = workflow.nodes.filter(n => !sourceNodes.has(n.name));
    if (finalNodes.length === 0) {
      result.warnings.push('All nodes have outgoing connections, consider adding a final action node');
    }

    return result;
  }

  // DETECCIÓN Y CORRECCIÓN AUTOMÁTICA DE NODOS DE IA
  detectAndCorrectAINodes(workflow) {
    const corrections = [];

    for (const node of workflow.nodes) {
      // Detectar nodos que deberían usar OpenAI
      if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters?.url) {
        const url = node.parameters.url.toLowerCase();

        // Detectar llamadas a APIs de IA que deberían usar nodos específicos
        if (url.includes('openai.com') || url.includes('api.openai.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for OpenAI API',
            recommendation: 'Use n8n-nodes-base.openAi instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.openAi',
            suggestedParams: this.convertHttpRequestToOpenAI(node.parameters)
          });
        }

        if (url.includes('anthropic.com') || url.includes('api.anthropic.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Anthropic API',
            recommendation: 'Use n8n-nodes-base.anthropic instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.anthropic',
            suggestedParams: this.convertHttpRequestToAnthropic(node.parameters)
          });
        }

        if (url.includes('generativelanguage.googleapis.com') || url.includes('gemini')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Google Gemini API',
            recommendation: 'Use n8n-nodes-base.googleGemini instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.googleGemini',
            suggestedParams: this.convertHttpRequestToGemini(node.parameters)
          });
        }

        if (url.includes('azure.com') && (url.includes('openai') || url.includes('cognitive'))) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Azure OpenAI',
            recommendation: 'Use n8n-nodes-base.azureOpenAi instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.azureOpenAi',
            suggestedParams: this.convertHttpRequestToAzureOpenAI(node.parameters)
          });
        }

        if (url.includes('bedrock') && url.includes('amazonaws.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for AWS Bedrock',
            recommendation: 'Use n8n-nodes-base.awsBedrock instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.awsBedrock'
          });
        }

        if (url.includes('api.mistral.ai')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Mistral AI',
            recommendation: 'Use n8n-nodes-base.mistral instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.mistral'
          });
        }

        if (url.includes('api.perplexity.ai')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Perplexity AI',
            recommendation: 'Use n8n-nodes-base.perplexity instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.perplexity'
          });
        }

        if (url.includes('api.elevenlabs.io')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for ElevenLabs API',
            recommendation: 'Use n8n-nodes-base.elevenlabs instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.elevenlabs'
          });
        }

        if (url.includes('stability.ai') || url.includes('stablediffusionapi.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Stable Diffusion',
            recommendation: 'Use n8n-nodes-base.stablediffusion instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.stablediffusion'
          });
        }

        if (url.includes('leonardo.ai')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Leonardo AI',
            recommendation: 'Use n8n-nodes-base.leonardo instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.leonardo'
          });
        }

        if (url.includes('vertexai.googleapis.com') || url.includes('googleapis.com/v1')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Google Vertex AI',
            recommendation: 'Use n8n-nodes-base.openAi with proper model configuration',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.openAi',
            suggestedParams: this.convertVertexAIToOpenAI(node.parameters)
          });
        }

        if (url.includes('huggingface.co') || url.includes('api-inference.huggingface.co')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Hugging Face API',
            recommendation: 'Use n8n-nodes-base.huggingFace instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.huggingFace',
            suggestedParams: this.convertHttpRequestToHuggingFace(node.parameters)
          });
        }

        if (url.includes('localhost:11434') || url.includes('ollama')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Ollama',
            recommendation: 'Use n8n-nodes-base.ollamaChat instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.ollamaChat'
          });
        }

        if (url.includes('api.cohere.ai') || url.includes('cohere.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Cohere API',
            recommendation: 'Use n8n-nodes-base.cohere instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.cohere'
          });
        }

        if (url.includes('api.together.xyz') || url.includes('together.ai')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Together AI',
            recommendation: 'Use n8n-nodes-base.together instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.together'
          });
        }

        if (url.includes('api.fireworks.ai')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Fireworks AI',
            recommendation: 'Use n8n-nodes-base.fireworks instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.fireworks'
          });
        }

        if (url.includes('api.deepl.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for DeepL API',
            recommendation: 'Use n8n-nodes-base.deepl instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.deepl'
          });
        }

        if (url.includes('api.replicate.com') || url.includes('replicate.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Replicate API',
            recommendation: 'Use n8n-nodes-base.replicate instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.replicate'
          });
        }

        if (url.includes('pika.art') || url.includes('pikalabs.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Pika Labs API',
            recommendation: 'Use n8n-nodes-base.pika instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.pika'
          });
        }

        if (url.includes('runwayml.com') || url.includes('api.runwayml.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Runway ML API',
            recommendation: 'Use n8n-nodes-base.runway instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.runway'
          });
        }

        if (url.includes('api.synthesia.io')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Synthesia API',
            recommendation: 'Use n8n-nodes-base.synthesia instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.synthesia'
          });
        }

        if (url.includes('runpod.io') || url.includes('api.runpod.io')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for RunPod API',
            recommendation: 'Use n8n-nodes-base.runpod instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.runpod'
          });
        }

        if (url.includes('modal.com') || url.includes('api.modal.com')) {
          corrections.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: 'Using httpRequest for Modal API',
            recommendation: 'Use n8n-nodes-base.modal instead',
            currentType: node.type,
            suggestedType: 'n8n-nodes-base.modal'
          });
        }
      }

      // Validar nodos de IA existentes
      if (this.validationSystem.validNodeTypes.ai.includes(node.type)) {
        const validation = this.validateAINodeConfiguration(node);
        if (validation.corrections.length > 0) {
          corrections.push(...validation.corrections);
        }
      }
    }

    return corrections;
  }

  // CONVERTIR HTTP REQUEST A OPENAI NODE
  convertHttpRequestToOpenAI(httpParams) {
    return {
      operation: 'chat',
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: '={{ $json.prompt || $json.input || $json.text }}'
        }
      ],
      maxTokens: 1000,
      temperature: 0.7
    };
  }

  // CONVERTIR HTTP REQUEST A ANTHROPIC NODE
  convertHttpRequestToAnthropic(httpParams) {
    return {
      model: 'claude-3-opus-20240229',
      messages: [
        {
          role: 'user',
          content: '={{ $json.prompt || $json.input || $json.text }}'
        }
      ],
      maxTokens: 1000
    };
  }

  // CONVERTIR VERTEX AI A OPENAI COMPATIBLE
  convertVertexAIToOpenAI(httpParams) {
    return {
      operation: 'chat',
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: '={{ $json.instances[0].prompt || $json.prompt || $json.input }}'
        }
      ],
      maxTokens: 2000,
      temperature: 0.2
    };
  }

  // CONVERTIR HTTP REQUEST A HUGGING FACE NODE
  convertHttpRequestToHuggingFace(httpParams) {
    return {
      task: 'text-classification',
      model: 'bert-base-uncased',
      inputs: '={{ $json.inputs || $json.text || $json.prompt }}'
    };
  }

  // CONVERTIR HTTP REQUEST A GOOGLE GEMINI NODE
  convertHttpRequestToGemini(httpParams) {
    return {
      operation: 'generateContent',
      model: 'gemini-1.5-pro',
      prompt: '={{ $json.contents[0].parts[0].text || $json.prompt || $json.input }}',
      maxTokens: 8192,
      temperature: 0.7
    };
  }

  // CONVERTIR HTTP REQUEST A AZURE OPENAI NODE
  convertHttpRequestToAzureOpenAI(httpParams) {
    return {
      operation: 'chat',
      deploymentName: 'gpt-4',
      resourceName: 'your-azure-resource',
      apiVersion: '2023-12-01-preview',
      messages: [
        {
          role: 'user',
          content: '={{ $json.messages[0].content || $json.prompt || $json.input }}'
        }
      ],
      maxTokens: 4000
    };
  }

  // CONVERTIR HTTP REQUEST A COHERE NODE
  convertHttpRequestToCohere(httpParams) {
    return {
      operation: 'generate',
      resource: 'text',
      model: 'command-r-plus',
      text: '={{ $json.prompt || $json.input || $json.text }}',
      maxTokens: 4000,
      temperature: 0.7,
      additionalFields: {
        stream: false,
        returnLikelihoods: 'NONE',
        numGenerations: 1
      }
    };
  }

  // CONVERTIR HTTP REQUEST A REPLICATE NODE
  convertHttpRequestToReplicate(httpParams) {
    return {
      operation: 'run',
      model: 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
      input: {
        prompt: '={{ $json.prompt || $json.input }}',
        max_tokens: 4000,
        temperature: 0.7,
        system_prompt: 'You are a helpful AI assistant.'
      }
    };
  }

  // CONVERTIR HTTP REQUEST A DEEPL NODE
  convertHttpRequestToDeepL(httpParams) {
    return {
      operation: 'translate',
      text: '={{ $json.text || $json.input }}',
      targetLang: 'ES',
      sourceLang: 'EN',
      options: {
        formality: 'default',
        splitSentences: '1',
        preserveFormatting: '0',
        glossaryId: '',
        tagHandling: '',
        nonSplittingTags: '',
        outlineDetection: '1',
        splittingTags: ''
      }
    };
  }

  // CONVERTIR HTTP REQUEST A LOCALAI NODE
  convertHttpRequestToLocalAI(httpParams) {
    return {
      operation: 'chatCompletion',
      model: 'gpt-3.5-turbo',
      messages: {
        values: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant.'
          },
          {
            role: 'user',
            content: '={{ $json.query || $json.prompt || $json.input }}'
          }
        ]
      },
      options: {
        maxTokens: 4000,
        temperature: 0.7,
        topP: 1,
        stream: false
      }
    };
  }

  // VALIDAR CONFIGURACIÓN DE NODOS DE IA
  validateAINodeConfiguration(node) {
    const validation = { corrections: [], warnings: [] };

    switch (node.type) {
      case 'n8n-nodes-base.openAi':
        if (!node.parameters?.operation) {
          validation.corrections.push({
            nodeId: node.id,
            issue: 'Missing operation parameter',
            fix: 'Add operation: "chat"'
          });
        }
        if (!node.parameters?.model) {
          validation.corrections.push({
            nodeId: node.id,
            issue: 'Missing model parameter',
            fix: 'Add model: "gpt-4" or "gpt-3.5-turbo"'
          });
        }
        break;

      case 'n8n-nodes-base.anthropic':
        if (!node.parameters?.model) {
          validation.corrections.push({
            nodeId: node.id,
            issue: 'Missing model parameter',
            fix: 'Add model: "claude-3-opus-20240229"'
          });
        }
        break;
    }

    return validation;
  }

  // CALCULAR COMPLEJIDAD DEL WORKFLOW
  calculateWorkflowComplexity(workflow) {
    const nodeCount = workflow.nodes.length;
    const connectionCount = Object.keys(workflow.connections || {}).length;

    if (nodeCount <= 5 && connectionCount <= 5) return 'low';
    if (nodeCount <= 15 && connectionCount <= 20) return 'medium';
    if (nodeCount <= 30 && connectionCount <= 40) return 'high';
    return 'ultra-complex';
  }

  // GENERAR SUGERENCIAS DE OPTIMIZACIÓN
  generateOptimizationSuggestions(workflow) {
    const suggestions = [];

    if (workflow.nodes.length > 50) {
      suggestions.push('Consider splitting this workflow into smaller, more manageable workflows');
    }

    const aiNodes = workflow.nodes.filter(n => this.validationSystem.validNodeTypes.ai.includes(n.type));
    if (aiNodes.length > 5) {
      suggestions.push('High AI usage detected. Consider optimizing API calls and implementing caching');
    }

    return suggestions;
  }

  // VALIDAR SEGURIDAD DEL WORKFLOW
  validateWorkflowSecurity(workflow) {
    const result = { warnings: [] };

    for (const node of workflow.nodes) {
      if (this.validationSystem.connectionValidations.security.requiresAuth.includes(node.type) && !node.credentials) {
        result.warnings.push(`Node "${node.name}" requires authentication but has no credentials configured`);
      }
    }

    return result;
  }

  // VALIDADOR DE EMAIL
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getSettings() {
    // CONFIGURACIÓN DE MODELOS MÚLTIPLES CON API KEYS DIRECTAS
    const availableModels = {
      gemini: {
        provider: 'gemini',
        apiKey: 'your_google_api_key_here',
        model: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash'
      },
      openai: {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
        model: 'gpt-4.1-2025-04-14',
        name: 'OpenAI GPT-4.1 (2025-04-14)'
      },
      openrouter: {
        provider: 'openrouter',
        apiKey: process.env.OPENROUTER_API_KEY || 'your_openrouter_api_key_here',
        model: 'qwen/qwen3-coder:free',
        name: 'OpenRouter Qwen3 Coder (Free)'
      }
    };

    // SELECTOR DE MODELOS - Puedes cambiar la variable de entorno o usar argumentos
    const defaultModel = process.env.DEFAULT_MODEL || 'gemini'; // Opciones: 'gemini', 'openai', 'openrouter'

    // Verificar si el modelo seleccionado existe
    if (!availableModels[defaultModel]) {
      console.warn(`⚠️ Modelo '${defaultModel}' no encontrado. Usando Gemini por defecto.`);
      console.log('📋 Modelos disponibles:', Object.keys(availableModels).join(', '));
      return availableModels.gemini;
    }

    const selectedModel = availableModels[defaultModel];
    console.log(`🤖 Usando modelo: ${selectedModel.name}`);
    console.log(`🔧 Proveedor: ${selectedModel.provider}`);
    console.log(`🎯 Modelo: ${selectedModel.model}`);

    return selectedModel;
  }

  // MÉTODO PARA MOSTRAR MODELOS DISPONIBLES
  showAvailableModels() {
    console.log('\n🤖 MODELOS DISPONIBLES:');
    console.log('======================');
    console.log('1. 🔮 Gemini 2.5 Flash (Google) - Recomendado');
    console.log('2. 🤖 OpenAI GPT-4.1-2025-04-14 (OpenAI)');
    console.log('3. 🚀 OpenRouter Qwen3 Coder (Free)');
    console.log('\n📝 Para cambiar de modelo:');
    console.log('   - Variable de entorno: DEFAULT_MODEL=gemini|openai|openrouter');
    console.log('   - Ejemplo: DEFAULT_MODEL=openai node extension server models.js "tu prompt"');
    console.log('   - O modifica la línea en getSettings()');
    console.log('');
  }

  getCurrentWorkflowJSON() {
    try {
      const txt = this.currentWorkflow || '';
      if (txt) return txt;
    } catch {}
    return '';
  }

  // MÉTODO CALLLLM FUNCIONAL - COPIADO EXACTO DEL ARCHIVO V2
  async callLLMV2({ provider, apiKey, model, prompt }) {
    const workflow = this.getCurrentWorkflowJSON();
    const basePrompt = `You are an n8n expert. Current workflow: ${workflow || '""'}. Based on user prompt: ${prompt}. Return only the updated workflow JSON.`;

    if (provider === 'gemini') {
      // GEMINI 2.5 FLASH REAL - MÁXIMA SALIDA MASIVA
      console.log('🔮 Usando Gemini 2.5 Flash real de Google con salida masiva');
      
      const body = {
        contents: [{ parts: [{ text: basePrompt }] }],
        generationConfig: {
          // GEMINI MASIVO - TOKENS DE SALIDA SIN RESTRICCIONES
          maxOutputTokens: model?.includes('2.5-flash') ? 65536 :   // CORREGIDO: Límite real 2.5-flash
                          model?.includes('2.5-pro') ? 65536 :     // MÁXIMO ABSOLUTO 2.5-pro
                          model?.includes('1.5-pro') ? 32768 :     // MÁXIMO 1.5-pro
                          model?.includes('1.5-flash') ? 16384 :   // MÁXIMO 1.5-flash
                          model?.includes('1.0-pro') ? 8192 : 65536, // Por defecto máximo aumentado
          temperature: 0.02,      // MÍNIMA para máxima consistencia JSON
          topP: 0.98,            // MÁXIMA calidad de respuesta
          topK: 50,              // Mayor diversidad controlada
          candidateCount: 1,     // Una sola respuesta perfecta
          stopSequences: [],     // Sin paradas automáticas - workflows ilimitados
          responseMimeType: "application/json" // Forzar JSON válido
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      };
      
      const mdl = model || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent`;
      
      const fetch = await getFetch();
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Gemini API Error:', res.status, res.statusText);
        console.error('📄 Error Details:', errorText);
        throw new Error(`Gemini API Error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        console.error('❌ No candidates in Gemini response:', JSON.stringify(data, null, 2));
        throw new Error('No candidates in Gemini response');
      }
      
      const candidate = data.candidates[0];
      
      if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts)) {
        console.error('❌ Invalid candidate structure:', JSON.stringify(candidate, null, 2));
        throw new Error('Invalid candidate structure from Gemini');
      }
      
      // 🎯 SISTEMA DE CONTINUACIÓN: Permitir que MAX_TOKENS llegue al JSONRepairAgent
      if (candidate.finishReason === 'MAX_TOKENS') {
        console.log('⚠️ MAX_TOKENS detectado - Continuará con JSONRepairAgent...');
      }
      
      if (candidate.content.parts.length === 0) {
        console.error('❌ No parts in candidate content');
        throw new Error('No content parts in Gemini response');
      }
      
      const text = candidate.content.parts[0].text || '';
      
      if (!text.trim()) {
        console.error('❌ Empty response from Gemini');
        throw new Error('Empty response from Gemini');
      }

      // Estadísticas de respuesta masiva
      console.log('📊 GEMINI MASIVO - Respuesta recibida:');
      console.log(`   📏 Longitud: ${text.length.toLocaleString()} caracteres`);
      console.log(`   📄 Líneas: ${text.split('\n').length.toLocaleString()}`);
      console.log(`   🏁 Finish Reason: ${candidate.finishReason}`);
      console.log(`   ⚡ Tokens estimados: ${Math.ceil(text.length / 4).toLocaleString()}`);

      return text;

    } else if (provider === 'openai') {
      // OPENAI GPT-4.1 - SOPORTE COMPLETO
      console.log('🤖 Usando OpenAI GPT-4.1-2025-04-14 con salida masiva');

      const body = {
        model: model || 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an n8n expert that creates professional workflows. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: basePrompt
          }
        ],
        max_tokens: 32768, // Máximo para GPT-4.1-2025-04-14
        temperature: 0.02,
        top_p: 0.98,
        presence_penalty: 0,
        frequency_penalty: 0
      };

      const fetch = await getFetch();

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ OpenAI API Error:', res.status, res.statusText);
        console.error('📄 Error Details:', errorText);
        throw new Error(`OpenAI API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error('❌ No choices in OpenAI response:', JSON.stringify(data, null, 2));
        throw new Error('No choices in OpenAI response');
      }

      const choice = data.choices[0];
      const text = choice.message?.content || '';

      if (!text.trim()) {
        console.error('❌ Empty response from OpenAI');
        throw new Error('Empty response from OpenAI');
      }

      console.log('📊 OPENAI - Respuesta recibida:');
      console.log(`   📏 Longitud: ${text.length.toLocaleString()} caracteres`);
      console.log(`   📄 Líneas: ${text.split('\n').length.toLocaleString()}`);
      console.log(`   🏁 Finish Reason: ${choice.finish_reason}`);
      console.log(`   ⚡ Tokens usados: ${data.usage?.total_tokens || 'N/A'}`);

      return text;

    } else if (provider === 'openrouter') {
      // OPENROUTER QWEN3 CODER - SOPORTE COMPLETO
      console.log('🚀 Usando OpenRouter Qwen3 Coder (Free) con salida masiva');

      const body = {
        model: model || 'qwen/qwen3-coder:free',
        messages: [
          {
            role: 'system',
            content: 'You are an n8n expert that creates professional workflows. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: basePrompt
          }
        ],
        max_tokens: 16384, // Límite para modelos free
        temperature: 0.02,
        top_p: 0.98
      };

      const fetch = await getFetch();

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://n8n-ai-assistant.com',
          'X-Title': 'n8n AI Assistant'
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ OpenRouter API Error:', res.status, res.statusText);
        console.error('📄 Error Details:', errorText);
        throw new Error(`OpenRouter API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error('❌ No choices in OpenRouter response:', JSON.stringify(data, null, 2));
        throw new Error('No choices in OpenRouter response');
      }

      const choice = data.choices[0];
      const text = choice.message?.content || '';

      if (!text.trim()) {
        console.error('❌ Empty response from OpenRouter');
        throw new Error('Empty response from OpenRouter');
      }

      console.log('📊 OPENROUTER - Respuesta recibida:');
      console.log(`   📏 Longitud: ${text.length.toLocaleString()} caracteres`);
      console.log(`   📄 Líneas: ${text.split('\n').length.toLocaleString()}`);
      console.log(`   🏁 Finish Reason: ${choice.finish_reason}`);
      console.log(`   ⚡ Tokens usados: ${data.usage?.total_tokens || 'N/A'}`);

      return text;
    }

    throw new Error(`Proveedor ${provider} no soportado`);
  }

  async callLLM({ provider, apiKey, model, prompt, workflow }) {
    const currentWorkflow = workflow || this.getCurrentWorkflowJSON();
    const basePrompt = `🚀 EXPERTO n8n - CREADOR DE WORKFLOWS PROFESIONALES AVANZADO

PROMPT DEL USUARIO: ${prompt}

WORKFLOW ACTUAL: ${currentWorkflow || 'CREAR NUEVO'}

📋 INSTRUCCIONES CRÍTICAS - GENERACIÓN DE 10+ NODOS:
=================================================
1. GENERAR EXACTAMENTE 10-12 NODOS mínimo para workflows complejos
2. USAR MÚLTIPLES TRIGGERS cuando sea apropiado (webhook + cron + manual)
3. TODOS los nodos deben estar CONECTADOS en flujo lógico
4. NOMBRES EXACTOS de nodos en las conexiones (CRÍTICO)
5. INCLUIR RAMAS PARALELAS para procesamiento simultáneo
6. AÑADIR VALIDACIONES y manejo de errores
7. POSICIONAMIENTO ORGANIZADO inspirado en workflows profesionales

🎯 ESTRUCTURA PROFESIONAL REQUERIDA:
==================================
NIVEL 1 (X: -1600): TRIGGERS (1-2 nodos)
- webhook, cron, manual triggers cuando aplique

NIVEL 2 (X: -1220): INPUT/VALIDATION (2-3 nodos)  
- validación de datos, enriquecimiento, filtros

NIVEL 3 (X: -840): PROCESSING (2-3 nodos)
- lógica de negocio, transformaciones, condiciones

NIVEL 4 (X: -460): INTEGRATIONS (2-3 nodos)
- APIs, bases de datos, servicios externos  

NIVEL 5 (X: -80): OUTPUTS (2-3 nodos)
- notificaciones, reportes, almacenamiento

POSICIONAMIENTO Y ORGANIZACIÓN:
- Espaciado horizontal: 380px entre niveles
- Espaciado vertical: 200px para nodos individuales  
- Espaciado vertical paralelo: 160px para ramas múltiples
- Posición inicial: [-1600, -200] para triggers

🔗 REGLA CRÍTICA CONEXIONES:
- En "connections", usar EXACTAMENTE el mismo "name" que en los nodos
- Ejemplo: Si el nodo se llama "Send Email Notification", la conexión debe usar "Send Email Notification" (EXACTO)

✅ EJEMPLO CORRECTO:
{
  "nodes": [
    {"name": "Telegram Bot", "type": "n8n-nodes-base.telegram"},
    {"name": "Process Message", "type": "n8n-nodes-base.set"},
    {"name": "Send Reply", "type": "n8n-nodes-base.telegram"}
  ],
  "connections": {
    "Telegram Bot": {"main": [[{"node": "Process Message", "type": "main", "index": 0}]]},
    "Process Message": {"main": [[{"node": "Send Reply", "type": "main", "index": 0}]]}
  }
}

🎯 TIPOS DE NODOS VÁLIDOS POR CATEGORÍA:

🔥 TRIGGERS (Inicio del workflow):
- n8n-nodes-base.webhook (HTTP endpoints)
- n8n-nodes-base.telegramTrigger (Mensajes de Telegram)
- n8n-nodes-base.gmailTrigger (Nuevos emails)
- n8n-nodes-base.slackTrigger (Mensajes de Slack)
- n8n-nodes-base.cron (Programador de tiempo)
- n8n-nodes-base.scheduleTrigger (Horarios personalizados)
- n8n-nodes-base.emailReadImap (Lectura de emails)
- n8n-nodes-base.rssFeedRead (Feeds RSS)
- n8n-nodes-base.githubTrigger (Eventos de GitHub)
- n8n-nodes-base.gitlabTrigger (Eventos de GitLab)
- n8n-nodes-base.jiraTrigger (Issues de Jira)
- n8n-nodes-base.trelloTrigger (Eventos de Trello)
- n8n-nodes-base.asanaTrigger (Eventos de Asana)
- n8n-nodes-base.zendeskTrigger (Tickets de Zendesk)
- n8n-nodes-base.shopifyTrigger (Pedidos de Shopify)
- n8n-nodes-base.stripeTrigger (Pagos de Stripe)
- n8n-nodes-base.paypalTrigger (Pagos de PayPal)
- n8n-nodes-base.twilioTrigger (Mensajes de Twilio)
- n8n-nodes-base.discordTrigger (Mensajes de Discord)
- n8n-nodes-base.whatsappTrigger (Mensajes de WhatsApp)

⚙️ ACCIONES Y PROCESAMIENTO:
- n8n-nodes-base.set (Establecer/Modificar datos)
- n8n-nodes-base.function (Código JavaScript personalizado)
- n8n-nodes-base.code (Código Python/JavaScript)
- n8n-nodes-base.httpRequest (Llamadas HTTP API)
- n8n-nodes-base.webhook (Webhooks)
- n8n-nodes-base.emailSend (Enviar emails)
- n8n-nodes-base.gmail (Gmail operations)
- n8n-nodes-base.telegram (Mensajes de Telegram)
- n8n-nodes-base.discord (Mensajes de Discord)
- n8n-nodes-base.whatsappBusiness (WhatsApp Business)
- n8n-nodes-base.twilio (SMS/Voz)
- n8n-nodes-base.sms77 (SMS)
- n8n-nodes-base.sendgrid (Email marketing)
- n8n-nodes-base.mailgun (Email transaccional)

📧 COMUNICACIÓN:
- n8n-nodes-base.emailSend (Enviar emails)
- n8n-nodes-base.gmail (Gmail operations)
- n8n-nodes-base.telegram (Mensajes de Telegram)
- n8n-nodes-base.slack (Mensajes de Slack)
- n8n-nodes-base.discord (Mensajes de Discord)
- n8n-nodes-base.whatsappBusiness (WhatsApp Business)
- n8n-nodes-base.twilio (SMS/Voz)
- n8n-nodes-base.sendgrid (Email marketing)
- n8n-nodes-base.mailgun (Email transaccional)

☁️ GOOGLE SERVICES:
- n8n-nodes-base.googleSheets (Hojas de cálculo)
- n8n-nodes-base.googleCalendar (Calendario)
- n8n-nodes-base.googleDrive (Almacenamiento)
- n8n-nodes-base.googleDocs (Documentos)
- n8n-nodes-base.gmail (Email)
- n8n-nodes-base.googleAnalytics (Analytics)
- n8n-nodes-base.googleCloudStorage (Cloud Storage)
- n8n-nodes-base.googleTranslate (Traducción)
- n8n-nodes-base.googleVision (IA Visual)
- n8n-nodes-base.googleBigQuery (BigQuery)

🗄️ BASES DE DATOS:
- n8n-nodes-base.postgres (PostgreSQL)
- n8n-nodes-base.mysql (MySQL)
- n8n-nodes-base.mongoDb (MongoDB)
- n8n-nodes-base.redis (Redis)
- n8n-nodes-base.graphql (GraphQL)
- n8n-nodes-base.airtable (Airtable)
- n8n-nodes-base.notion (Notion)
- n8n-nodes-base.supabase (Supabase)
- n8n-nodes-base.firestore (Firebase)
- n8n-nodes-base.dynamoDb (DynamoDB)

🤖 AGENTES DE IA Y AUTOMATIZACIÓN AVANZADA:
- n8n-nodes-base.agent (Agente de IA genérico)
- n8n-nodes-base.openAi (OpenAI GPT, DALL-E, Whisper)
- n8n-nodes-base.anthropic (Claude, Anthropic)
- n8n-nodes-base.llamaIndex (LlamaIndex para RAG)
- n8n-nodes-base.langchain (LangChain Framework)
- n8n-nodes-base.vectorStore (Vector Database)
- n8n-nodes-base.chromaDb (ChromaDB Vector Store)
- n8n-nodes-base.pinecone (Pinecone Vector Database)
- n8n-nodes-base.weaviate (Weaviate Vector Search)
- n8n-nodes-base.qdrant (Qdrant Vector Engine)
- n8n-nodes-base.aiMemory (AI Conversation Memory)
- n8n-nodes-base.conversationChain (Chain de conversación)
- n8n-nodes-base.documentLoader (Cargador de documentos)
- n8n-nodes-base.textSplitter (Divisor de texto)
- n8n-nodes-base.embeddings (Generador de embeddings)
- n8n-nodes-base.retriever (Recuperador de información)
- n8n-nodes-base.promptTemplate (Plantillas de prompts)

📱 APLICACIONES Y ACCIONES:
- n8n-nodes-base.executeWorkflow (Ejecutar workflow)
- n8n-nodes-base.executeCommand (Ejecutar comando)
- n8n-nodes-base.executeSSH (Ejecutar SSH)
- n8n-nodes-base.executePython (Ejecutar Python)
- n8n-nodes-base.executeBash (Ejecutar Bash)
- n8n-nodes-base.apiCall (Llamada API)
- n8n-nodes-base.webhookResponse (Respuesta webhook)
- n8n-nodes-base.workflowManager (Gestor de workflows)
- n8n-nodes-base.processManager (Gestor de procesos)
- n8n-nodes-base.fileWatcher (Monitor de archivos)
- n8n-nodes-base.systemMonitor (Monitor del sistema)
- n8n-nodes-base.dockerExec (Ejecutar en Docker)

🌊 FLUI Y AUTOMATIZACIÓN DE FLUJOS:
- n8n-nodes-base.flui (Flui genérico)
- n8n-nodes-base.fluiTrigger (Trigger Flui)
- n8n-nodes-base.fluiAction (Acción Flui)
- n8n-nodes-base.fluiCondition (Condición Flui)
- n8n-nodes-base.fluiLoop (Bucle Flui)
- n8n-nodes-base.fluiWebhook (Webhook Flui)
- n8n-nodes-base.fluiDatabase (Base de datos Flui)
- n8n-nodes-base.fluiEmail (Email Flui)
- n8n-nodes-base.fluiChat (Chat Flui)
- n8n-nodes-base.fluiFile (Archivo Flui)
- n8n-nodes-base.fluiCalendar (Calendario Flui)

🌐 INFRAESTRUCTURA REAL:
- n8n-nodes-base.docker (Docker Containers)
- n8n-nodes-base.kubernetes (Kubernetes)
- n8n-nodes-base.awsLambda (AWS Lambda)
- n8n-nodes-base.awsS3 (AWS S3)
- n8n-nodes-base.googleCloudFunctions (Google Cloud Functions)
- n8n-nodes-base.azureFunctions (Azure Functions)
- n8n-nodes-base.heroku (Heroku)
- n8n-nodes-base.vercel (Vercel)
- n8n-nodes-base.netlify (Netlify)
- n8n-nodes-base.helm (Helm Charts)
- n8n-nodes-base.podman (Podman Containers)
- n8n-nodes-base.containerd (Container Runtime)
- n8n-nodes-base.cri (Container Runtime Interface)
- n8n-nodes-base.openshift (OpenShift)
- n8n-nodes-base.rancher (Rancher Management)
- n8n-nodes-base.nomad (HashiCorp Nomad)

🤖 IA & MACHINE LEARNING - USO CORRECTO OBLIGATORIO:
- n8n-nodes-base.openAi (GPT models) - USAR PARA: chat, completion, análisis, predicciones
- n8n-nodes-base.anthropic (Claude) - USAR PARA: sentiment analysis, reasoning, analysis
- n8n-nodes-base.huggingFace (Modelos Hugging Face) - USAR PARA: classification, NLP tasks
- n8n-nodes-base.replicate (Modelos Replicate) - USAR PARA: image generation, AI models
- n8n-nodes-base.stabilityAi (Stable Diffusion) - USAR PARA: image generation
- n8n-nodes-base.midjourney (Midjourney) - USAR PARA: image generation
- n8n-nodes-base.cohere (Cohere AI) - USAR PARA: text processing
- n8n-nodes-base.pinecone (Vector database) - USAR PARA: vector search
- n8n-nodes-base.weaviate (Vector search) - USAR PARA: semantic search
- n8n-nodes-base.langchain (LangChain) - USAR PARA: agent orchestration
- n8n-nodes-base.vectorStore (Vector stores) - USAR PARA: vector storage
- n8n-nodes-base.googlePalm (Google PaLM) - USAR PARA: text generation
- n8n-nodes-base.googleBard (Google Bard) - USAR PARA: conversational AI
- n8n-nodes-base.googleGemini (Google Gemini) - USAR PARA: multimodal AI
- n8n-nodes-base.azureOpenAi (Azure OpenAI) - USAR PARA: enterprise AI
- n8n-nodes-base.awsBedrock (AWS Bedrock) - USAR PARA: cloud AI
- n8n-nodes-base.awsSagemaker (AWS SageMaker) - USAR PARA: ML models
- n8n-nodes-base.googleVertexAi (Google Vertex AI) - USAR PARA: enterprise AI
- n8n-nodes-base.perplexity (Perplexity) - USAR PARA: research AI
- n8n-nodes-base.together (Together AI) - USAR PARA: open source models
- n8n-nodes-base.fireworks (Fireworks AI) - USAR PARA: fast inference
- n8n-nodes-base.mistral (Mistral AI) - USAR PARA: European AI
- n8n-nodes-base.elevenlabs (ElevenLabs) - USAR PARA: text-to-speech
- n8n-nodes-base.whisper (Whisper) - USAR PARA: speech-to-text
- n8n-nodes-base.deepl (DeepL) - USAR PARA: translation
- n8n-nodes-base.chatgpt (ChatGPT) - USAR PARA: conversational AI
- n8n-nodes-base.claude (Claude) - USAR PARA: advanced reasoning
- n8n-nodes-base.llama (Llama) - USAR PARA: open source LLMs
- n8n-nodes-base.falcon (Falcon) - USAR PARA: efficient models
- n8n-nodes-base.vicuna (Vicuna) - USAR PARA: chat models
- n8n-nodes-base.alpaca (Alpaca) - USAR PARA: instruction-tuned models
- n8n-nodes-base.ollamaChat (Ollama Chat) - USAR PARA: local models
- n8n-nodes-base.localAi (Local AI) - USAR PARA: local inference
- n8n-nodes-base.runpod (RunPod) - USAR PARA: GPU inference
- n8n-nodes-base.modal (Modal) - USAR PARA: serverless AI
- n8n-nodes-base.leonardo (Leonardo AI) - USAR PARA: image generation
- n8n-nodes-base.dalleE3 (DALL-E 3) - USAR PARA: advanced image generation
- n8n-nodes-base.stablediffusion (Stable Diffusion) - USAR PARA: image generation
- n8n-nodes-base.kandinsky (Kandinsky) - USAR PARA: artistic generation
- n8n-nodes-base.pika (Pika Labs) - USAR PARA: video generation
- n8n-nodes-base.runway (Runway ML) - USAR PARA: video and image
- n8n-nodes-base.synthesia (Synthesia) - USAR PARA: video avatars
- n8n-nodes-base.tensorflow (TensorFlow) - USAR PARA: ML frameworks
- n8n-nodes-base.pytorch (PyTorch) - USAR PARA: deep learning
- n8n-nodes-base.sklearn (Scikit-learn) - USAR PARA: traditional ML
- n8n-nodes-base.keras (Keras) - USAR PARA: neural networks
- n8n-nodes-base.transformers (Transformers) - USAR PARA: NLP models
- n8n-nodes-base.langchain-agent (LangChain Agent) - USAR PARA: AI agents
- n8n-nodes-base.autogen (AutoGen) - USAR PARA: multi-agent systems
- n8n-nodes-base.crewai (CrewAI) - USAR PARA: collaborative AI

🚫 REGLA CRÍTICA: NUNCA usar n8n-nodes-base.httpRequest para APIs de IA
❌ INCORRECTO: {"type": "n8n-nodes-base.httpRequest", "url": "https://api.openai.com/..." }
✅ CORRECTO: {"type": "n8n-nodes-base.openAi", "parameters": {"operation": "chat", "model": "gpt-4"} }

EJEMPLOS DE IA CORRECTOS:

✅ OpenAI para análisis de sentimientos:
{
  "type": "n8n-nodes-base.openAi",
  "parameters": {
    "operation": "chat",
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Analyze sentiment: {{ $json.text }}"}]
  }
}

✅ Anthropic Claude para análisis:
{
  "type": "n8n-nodes-base.anthropic",
  "parameters": {
    "model": "claude-3-opus-20240229",
    "messages": [{"role": "user", "content": "Analyze: {{ $json.input }}"}]
  }
}

✅ Predicción de churn con OpenAI:
{
  "type": "n8n-nodes-base.openAi",
  "parameters": {
    "operation": "chat",
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Predict churn risk for customer data: {{ JSON.stringify($json.customer) }}"}]
  }
}

🛒 E-COMMERCE:
- n8n-nodes-base.shopify (Tienda online)
- n8n-nodes-base.woocommerce (WordPress)
- n8n-nodes-base.stripe (Pagos)
- n8n-nodes-base.paypal (Pagos)
- n8n-nodes-base.square (Pagos)
- n8n-nodes-base.amazon (Marketplace)
- n8n-nodes-base.ebay (Marketplace)
- n8n-nodes-base.etsy (Marketplace)

💼 BUSINESS TOOLS:
- n8n-nodes-base.zendesk (Support tickets)
- n8n-nodes-base.jira (Project management)
- n8n-nodes-base.trello (Kanban boards)
- n8n-nodes-base.asana (Task management)
- n8n-nodes-base.monday (Work management)
- n8n-nodes-base.clickup (Project management)
- n8n-nodes-base.salesforce (CRM)
- n8n-nodes-base.hubspot (CRM)
- n8n-nodes-base.pipedrive (CRM)
- n8n-nodes-base.zoho (CRM)
- n8n-nodes-base.quickbooks (Contabilidad)
- n8n-nodes-base.xero (Contabilidad)

🔧 DEVOPS & MONITORING:
- n8n-nodes-base.jenkins (CI/CD)
- n8n-nodes-base.github (Git operations)
- n8n-nodes-base.gitlab (Git operations)
- n8n-nodes-base.bitbucket (Git operations)
- n8n-nodes-base.docker (Container management)
- n8n-nodes-base.kubernetes (Orchestration)
- n8n-nodes-base.awsLambda (Serverless)
- n8n-nodes-base.googleCloudFunctions (Serverless)
- n8n-nodes-base.azureFunctions (Serverless)
- n8n-nodes-base.datadog (Monitoring)
- n8n-nodes-base.newRelic (APM)
- n8n-nodes-base.sentry (Error tracking)

📱 SOCIAL MEDIA:
- n8n-nodes-base.twitter (X/Twitter)
- n8n-nodes-base.facebook (Facebook)
- n8n-nodes-base.instagram (Instagram)
- n8n-nodes-base.linkedin (LinkedIn)
- n8n-nodes-base.youtube (YouTube)
- n8n-nodes-base.tiktok (TikTok)
- n8n-nodes-base.reddit (Reddit)
- n8n-nodes-base.discord (Discord)
- n8n-nodes-base.slack (Slack)
- n8n-nodes-base.telegram (Telegram)

💾 ALMACENAMIENTO:
- n8n-nodes-base.awsS3 (Amazon S3)
- n8n-nodes-base.googleCloudStorage (GCP)
- n8n-nodes-base.azureBlobStorage (Azure)
- n8n-nodes-base.dropbox (Dropbox)
- n8n-nodes-base.onedrive (Microsoft)
- n8n-nodes-base.box (Box)
- n8n-nodes-base.nextcloud (Nextcloud)
- n8n-nodes-base.ftp (FTP/SFTP)

⚠️ NOTAS IMPORTANTES:
- SIEMPRE incluir "credentials" cuando el nodo lo requiera
- Usar parámetros realistas y completos
- Posicionar nodos con coordenadas [x,y] apropiadas
- Crear workflows complejos con múltiples ramas cuando sea necesario
- Incluir manejo de errores y validaciones

🔄 VALIDACIONES PRE-ENVÍO:
======================
1. Todos los nodos deben tener conexiones válidas
2. No debe haber nodos huérfanos sin conexiones
3. Los parámetros deben estar completos según el tipo de nodo
4. Las credenciales deben estar especificadas cuando sea necesario
5. El workflow debe tener un flujo lógico desde trigger hasta acciones finales

📊 INDICADORES DE COMPLETITUD:
============================
Por favor, incluye en tu respuesta JSON:
- "workflowStatus": "complete" si consideras que el workflow está totalmente implementado
- "workflowStatus": "partial" si crees que se requieren más pasos para completarlo
- "lastNodeName": "nombre_del_ultimo_nodo_logico" para indicar dónde continuar si es parcial
- "estimatedNodes": número estimado de nodos que debería tener el workflow completo

🚨 FORMATO DE SALIDA CRÍTICO - SOLO JSON:
========================================
⚠️ INSTRUCCIONES ESTRICTAS PARA GEMINI:
1. NO escribir texto explicativo antes del JSON
2. NO escribir introducción como "Aquí tienes el workflow..."
3. NO usar bloques de código con marcadores
4. EMPEZAR INMEDIATAMENTE con {
5. TERMINAR con } sin texto adicional
6. GENERAR MÍNIMO 10 NODOS como se solicita

📋 EJEMPLO COMPLETO DE FORMATO ESPERADO (5 NODOS):
{
  "nodes": [
    {
      "id": "webhook-001",
      "name": "Form Submission",
      "type": "n8n-nodes-base.webhook",
      "position": [-1600, 200],
      "parameters": {
        "httpMethod": "POST",
        "path": "/form-submit",
        "responseMode": "onReceived"
      },
      "typeVersion": 1
    },
    {
      "id": "validate-002", 
      "name": "Validate Data",
      "type": "n8n-nodes-base.code",
      "position": [-1220, 200],
      "parameters": {
        "jsCode": "if (!items[0].json.email) throw new Error('Email required'); return items;"
      },
      "typeVersion": 1
    },
    ... MÁS NODOS HASTA 10+ ...
  ],
  "connections": {
    "Form Submission": {
      "main": [[{"node": "Validate Data", "type": "main", "index": 0}]]
    }
  },
  "active": false,
  "settings": {"executionOrder": "v1"},
  "staticData": {},
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-09-04T01:00:00.000Z",
  "versionId": "v1",
  "metadata": {"workflowStatus": "complete", "estimatedNodes": 10}
}

🚀 USAR ESTE FORMATO EXACTO PERO EXPANDIDO A 10+ NODOS
🚀 COMENZAR RESPUESTA INMEDIATAMENTE CON { - SIN TEXTO PREVIO`;

    if (provider === 'gemini') {
      // GEMINI 2.5 FLASH REAL - MÁXIMA SALIDA MASIVA
      console.log('🔮 Usando Gemini 2.5 Flash real de Google con salida masiva');

      const body = {
        contents: [{ parts: [{ text: basePrompt }] }],
        generationConfig: {
          // GEMINI - TOKENS DE SALIDA CORREGIDOS (VALORES REALES)
          maxOutputTokens: model?.includes('2.5-flash') ? 65536 :   // Gemini 2.5-flash-preview-05-06
                          model?.includes('2.5-pro')   ? 65536 :   // Gemini 2.5-pro-preview-05-06
                          model?.includes('1.5-pro')   ? 8192  :   // Gemini 1.5-pro
                          model?.includes('1.5-flash') ? 8192  :   // Gemini 1.5-flash
                          model?.includes('1.0-pro')   ? 2048  :   // Gemini 1.0-pro
                          8192, // Por defecto
          temperature: 0.02,      // MÍNIMA para máxima consistencia JSON
          topP: 0.98,            // MÁXIMA calidad de respuesta
          topK: 50,              // Mayor diversidad controlada
          candidateCount: 1,     // Una sola respuesta perfecta
          stopSequences: [],     // Sin paradas automáticas - workflows ilimitados
          responseMimeType: "application/json" // Forzar JSON válido
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      };

      const mdl = model || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent`;

      const fetch = await getFetch();
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Gemini API Error:', res.status, res.statusText);
        console.error('📄 Error Details:', errorText);

        // Manejo específico de errores de Gemini
        if (res.status === 400) {
          console.error('🚫 Bad Request - Revisar configuración de Gemini');
        } else if (res.status === 429) {
          console.error('⏰ Rate Limit - Gemini está ocupado, reintentando...');
        } else if (res.status === 500) {
          console.error('🔥 Server Error - Gemini tiene problemas internos');
        }

        throw new Error(`Gemini API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // Validación robusta de estructura de respuesta de Gemini
      if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        console.error('❌ No candidates in Gemini response:', JSON.stringify(data, null, 2));
        throw new Error('No candidates in Gemini response');
      }

      const candidate = data.candidates[0];

      if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts)) {
        console.error('❌ Invalid candidate structure:', JSON.stringify(candidate, null, 2));
        throw new Error('Invalid candidate structure from Gemini');
      }

      if (candidate.content.parts.length === 0) {
        console.error('❌ No parts in candidate content');
        throw new Error('No content parts in Gemini response');
      }

      const text = candidate.content.parts[0].text || '';

      if (!text.trim()) {
        console.error('❌ Empty response from Gemini');
        console.error('📊 Candidates:', data.candidates.length);
        console.error('📝 Finish Reason:', candidate.finishReason);
        console.error('🚨 Safety Ratings:', candidate.safetyRatings);
        throw new Error('Empty response from Gemini');
      }

      // Estadísticas de la respuesta masiva
      console.log('📊 GEMINI MASIVO - Respuesta recibida:');
      console.log(`   📏 Longitud: ${text.length.toLocaleString()} caracteres`);
      console.log(`   📄 Líneas: ${text.split('\n').length.toLocaleString()}`);
      console.log(`   🏁 Finish Reason: ${candidate.finishReason}`);
      console.log(`   ⚡ Tokens estimados: ${Math.ceil(text.length / 4).toLocaleString()}`);

      return text;
    }

    throw new Error('Proveedor LLM no soportado. Solo Gemini está disponible en esta versión.');
  }

  async importWorkflowJSON(jsonStr, originalPrompt = null, geminiModel = null) {
    try {
      // Limpieza de respuesta para JSON masivo de Gemini
      let cleanedJson = jsonStr.trim();

      // PASO 0: Limpieza preventiva ULTRA-ROBUSTA de caracteres de control problemáticos
      console.log('🔧 Aplicando limpieza preventiva ULTRA-ROBUSTA de caracteres de control...');
      
      // === NIVEL 1: Caracteres de control ASCII problemáticos ===
      cleanedJson = cleanedJson.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ''); // Control chars + extended ASCII
      cleanedJson = cleanedJson.replace(/\x0D\x0A/g, '\n'); // Normalizar CRLF a LF
      cleanedJson = cleanedJson.replace(/\r\n/g, '\n'); // Asegurar normalización
      cleanedJson = cleanedJson.replace(/\r/g, '\n'); // CR solitarios a LF
      
      // === NIVEL 2: Escape sequences Unicode problemáticos ===
      cleanedJson = cleanedJson.replace(/\\u000[0-8bcdef]/gi, ''); // Control Unicode
      cleanedJson = cleanedJson.replace(/\\u00[89ab][0-9a-f]/gi, ''); // Latin-1 Supplement problemáticos
      cleanedJson = cleanedJson.replace(/\\u[fF][eE][fF][fF]/g, ''); // BOM y caracteres especiales
      
      // === NIVEL 3: Corrección inteligente de escape sequences válidos ===
      cleanedJson = cleanedJson.replace(/\\([bfnrt])/g, (match, char) => {
        const escapeMap = {
          'b': ' ',      // backspace -> espacio
          'f': ' ',      // form feed -> espacio
          'n': '\\n',    // mantener salto de línea válido
          'r': '\\r',    // mantener retorno válido
          't': '\\t'     // mantener tab válido
        };
        return escapeMap[char] || match;
      });
      
      // === NIVEL 4: Limpieza de strings complejos con contenido problemático ===
      // Detectar y limpiar strings que contienen código JavaScript embedded
      cleanedJson = cleanedJson.replace(/"([^"\\]*(\\.[^"\\]*)*)"(\s*:\s*"[^"\\]*(\\.[^"\\]*)*")/g, (match, key, _, valueSection) => {
        // Limpiar clave
        let cleanKey = key.replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Control chars
                          .replace(/\n\s*/g, ' ')                // Saltos de línea -> espacio
                          .replace(/\t+/g, ' ')                  // Múltiples tabs -> espacio
                          .replace(/\s+/g, ' ')                  // Múltiples espacios -> uno
                          .trim();
        
        // Limpiar valor con cuidado especial para código JavaScript
        let cleanValue = valueSection;
        if (valueSection.includes('function') || valueSection.includes('=>') || valueSection.includes('console.')) {
          // Es código JavaScript, manejar cuidadosamente
          cleanValue = valueSection.replace(/\n\s*/g, '\\n')     // Saltos -> \\n
                                  .replace(/\r/g, '\\r')         // CR -> \\r
                                  .replace(/\t/g, '\\t')         // Tab -> \\t
                                  .replace(/"/g, '\\"')          // Comillas -> \\"
                                  .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Control chars
        } else {
          // Contenido normal
          cleanValue = valueSection.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Control -> espacio
                                  .replace(/\n\s*/g, ' ')                   // Saltos -> espacio
                                  .replace(/\s+/g, ' ');                    // Múltiples espacios -> uno
        }
        
        return `"${cleanKey}"${cleanValue}`;
      });
      
      // === NIVEL 5: Limpieza específica para contenido de parámetros n8n ===
      cleanedJson = cleanedJson.replace(/"parameters":\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g, (match, params) => {
        const cleanParams = params
          .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')    // Control chars -> espacio
          .replace(/\n\s*/g, ' ')                   // Saltos -> espacio
          .replace(/\t+/g, ' ')                     // Tabs -> espacio
          .replace(/\s+/g, ' ')                     // Múltiples espacios -> uno
          .replace(/\s*:\s*/g, ': ')                // Normalizar separadores
          .replace(/\s*,\s*/g, ', ')                // Normalizar comas
          .trim();
        return `"parameters": {${cleanParams}}`;
      });
      
      // === NIVEL 6: Validación final de caracteres problemáticos ===
      const problematicChars = cleanedJson.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
      if (problematicChars) {
        console.log(`⚠️ Encontrados ${problematicChars.length} caracteres problemáticos restantes, aplicando limpieza final...`);
        cleanedJson = cleanedJson.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      }
      
      console.log('✅ Limpieza preventiva ULTRA-ROBUSTA completada');

      // Remover bloques de código markdown si existen
      const codeBlockMatch = cleanedJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        cleanedJson = codeBlockMatch[1].trim();
      }

      // Buscar JSON válido en respuesta masiva
      const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedJson = jsonMatch[0];
      }

      // LIMPIEZA AVANZADA DEL JSON PARA MANEJAR ERRORES COMUNES DEL LLM
      console.log('🧹 LIMPIANDO JSON AVANZADO...');

      // 1. Remover caracteres de control problemáticos PRIMERO
      cleanedJson = cleanedJson.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remover todos los caracteres de control
      cleanedJson = cleanedJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Unicode control chars

      // 2. Corregir caracteres de escape problemáticos en strings
      cleanedJson = cleanedJson.replace(/\\"/g, '"');  // Corregir comillas escapadas incorrectamente
      cleanedJson = cleanedJson.replace(/\\n/g, ' ');  // Reemplazar saltos de línea con espacios
      cleanedJson = cleanedJson.replace(/\\t/g, ' ');  // Reemplazar tabs con espacios
      cleanedJson = cleanedJson.replace(/\\\\/g, '\\'); // Corregir barras invertidas dobles

      // 3. Corregir valores de string con comillas simples dentro de comillas dobles
      cleanedJson = cleanedJson.replace(/"([^"]*)'([^']*)'([^"]*)"/g, '"$1\'$2\'$3"');

      // 4. Corregir código JavaScript problemático en strings (para nodos Function)
      cleanedJson = cleanedJson.replace(/"functionCode":\s*"([^"]*(?:\\.[^"]*)*)"/g, (match, code) => {
        // Limpiar código JavaScript problemático
        const cleanCode = code
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/"/g, '\\"');
        return `"functionCode": "${cleanCode}"`;
      });

      // 5. Corregir arrays y objetos malformados
      cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1'); // Remover comas finales antes de cierre

      // 6. Corregir valores booleanos y null malformados
      cleanedJson = cleanedJson.replace(/\bTrue\b/g, 'true');
      cleanedJson = cleanedJson.replace(/\bFalse\b/g, 'false');
      cleanedJson = cleanedJson.replace(/\bNone\b/g, 'null');

      // 7. Corregir números malformados
      cleanedJson = cleanedJson.replace(/:\s*"(\d+)"/g, ': $1'); // Números como strings
      cleanedJson = cleanedJson.replace(/:\s*"(\d+\.\d+)"/g, ': $1'); // Números decimales como strings

      // 8. Corregir problemas específicos de sintaxis JSON
      cleanedJson = cleanedJson.replace(/,(\s*)}/g, '}'); // Remover comas antes de llaves de cierre
      cleanedJson = cleanedJson.replace(/,(\s*)]/g, ']'); // Remover comas antes de corchetes de cierre
      cleanedJson = cleanedJson.replace(/}(\s*),(\s*){/g, '},{'); // Corregir objetos consecutivos
      cleanedJson = cleanedJson.replace(/](\s*),(\s*)\[/g, '],['); // Corregir arrays consecutivos

      // 9. Corregir strings malformados específicamente en parámetros de nodos
      cleanedJson = cleanedJson.replace(/"parameters":\s*{([^}]*?)}/g, (match, params) => {
        // Limpiar parámetros que pueden tener caracteres problemáticos
        const cleanParams = params
          .replace(/\n\s*/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\r/g, ' ');
        return `"parameters": {${cleanParams}}`;
      });

      // 10. SISTEMA DE REPARACIÓN JSON ULTRA-AVANZADO CON MÚLTIPLES INTENTOS
      let parsedSuccessfully = false;
      let attempts = 0;
      const maxAttempts = 6;

      while (!parsedSuccessfully && attempts < maxAttempts) {
        attempts++;
        console.log(`   🔄 Intento de parsing ${attempts}/${maxAttempts}...`);
        
        try {
          const tempParsed = JSON.parse(cleanedJson);
          
          // 🔧 APLICAR CORRECTOR DE NOMBRES ULTRA-ROBUSTO
          console.log('🔧 Aplicando corrector de nombres automático...');
          const nameCorrector = new IntelligentNameCorrector();
          const correctedWorkflow = nameCorrector.correctWorkflowJSON(tempParsed);
          
          // Actualizar el JSON con las correcciones
          cleanedJson = JSON.stringify(correctedWorkflow, null, 2);
          
          parsedSuccessfully = true;
          console.log('   ✅ JSON válido después de limpieza y corrección automática');
        } catch (parseError) {
          console.log(`   ⚠️ Error de parsing: ${parseError.message}`);
          
          // Reparaciones específicas basadas en el tipo de error
          const errorMessage = parseError.message;
          
          if (errorMessage.includes('Bad control character')) {
            // Eliminar TODOS los caracteres de control
            cleanedJson = cleanedJson.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
            cleanedJson = cleanedJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            console.log('   🧹 Caracteres de control eliminados');
            
          } else if (errorMessage.includes('Unexpected token')) {
            // Buscar y corregir tokens inesperados
            const positionMatch = errorMessage.match(/at position (\d+)/);
            if (positionMatch) {
              const position = parseInt(positionMatch[1]);
              const char = cleanedJson[position];
              console.log(`   🔧 Token inesperado '${char}' en posición ${position}`);
              
              // Corregir caracteres problemáticos específicos
              if (char === '"' && position > 0) {
                const prevChar = cleanedJson[position - 1];
                if (prevChar !== '\\' && prevChar !== ':' && prevChar !== '[' && prevChar !== '{' && prevChar !== ',') {
                  cleanedJson = cleanedJson.substring(0, position) + '\\"' + cleanedJson.substring(position + 1);
                }
              } else if (['\n', '\r', '\t'].includes(char)) {
                cleanedJson = cleanedJson.substring(0, position) + ' ' + cleanedJson.substring(position + 1);
              }
            }
            
          } else if (errorMessage.includes('Expected') && errorMessage.includes('after property value')) {
            // Problemas con comas o llaves faltantes
            const positionMatch = errorMessage.match(/at position (\d+)/);
            if (positionMatch) {
              const position = parseInt(positionMatch[1]);
              const context = cleanedJson.substring(Math.max(0, position - 10), position + 10);
              console.log(`   🔍 Contexto: ...${context}...`);
              
              // Intentar añadir coma faltante
              if (position > 0 && cleanedJson[position] === '"' && cleanedJson[position - 1] === '}') {
                cleanedJson = cleanedJson.substring(0, position) + ',' + cleanedJson.substring(position);
              }
            }
          }
          
          // Reparaciones progresivas por intento
          if (attempts === 2) {
            console.log('   🔧 Aplicando reparaciones de nivel 2...');
            // Corregir strings con contenido JavaScript problemático
            cleanedJson = cleanedJson.replace(/"functionCode":\s*"([^"]*(?:\\.[^"]*)*)"/, (match, code) => {
              const cleanCode = code.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/"/g, '\\"');
              return `"functionCode": "${cleanCode}"`;
            });
            
          } else if (attempts === 3) {
            console.log('   🏗️ Aplicando reconstrucción estructural...');
            // Reparar objetos y arrays malformados
            cleanedJson = cleanedJson.replace(/}(\s*){/g, '}, {');
            cleanedJson = cleanedJson.replace(/](\s*)\[/g, '], [');
            cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1');
            
          } else if (attempts === 4) {
            console.log('   🔧 Aplicando reparaciones de nivel 4...');
            // Reparación más conservadora - solo limpiar caracteres problemáticos
            cleanedJson = cleanedJson.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
            cleanedJson = cleanedJson.replace(/\\"/g, '"');
            cleanedJson = cleanedJson.replace(/\\\\/g, '\\');
            
          } else if (attempts === 5) {
            console.log('   🚨 ÚLTIMO RECURSO: Activando JSONRepairAgent para JSON truncado...');
            
            // MEJORAR DETECCIÓN DE TRUNCAMIENTO - Más precisa
            const wasTruncated = !jsonStr.trim().startsWith('{') || 
                               (!jsonStr.trim().endsWith('}') && !jsonStr.trim().endsWith(']')) ||
                               jsonStr.length > 10000; // JSON muy grande probablemente truncado
            
            if (wasTruncated) {
              console.log('   🔧 JSON truncado detectado - Activando JSONRepairAgent V3.0...');
              try {
                // Inicializar JSONRepairAgent si no existe (con modelo compartido)
                await this.initializeJSONRepairAgent(process.env.GEMINI_API_KEY, geminiModel);
                
                // Usar JSONRepairAgent para reparar el JSON truncado (usar modelo existente)
                const repairedJson = await this.jsonRepairAgent.repairTruncatedJSON(jsonStr, {
                  originalPrompt: originalPrompt || 'workflow automatización',
                  context: 'n8n-workflow',
                  expectedStructure: 'workflow',
                  existingModel: geminiModel // Pasar el modelo ya inicializado
                });
                
                if (repairedJson && repairedJson.success && repairedJson.repairedJson) {
                  cleanedJson = repairedJson.repairedJson;
                  console.log('   ✅ JSON reparado exitosamente con JSONRepairAgent');
                  
                  // Verificar que el JSON reparado es válido
                  try {
                    JSON.parse(cleanedJson);
                    parsedSuccessfully = true;
                    console.log('   ✅ JSON reparado validado correctamente');
                  } catch (validationError) {
                    console.log(`   ⚠️ JSON reparado es inválido: ${validationError.message}`);
                    throw new Error('JSON reparado es inválido');
                  }
                } else {
                  throw new Error('JSONRepairAgent no pudo reparar el JSON');
                }
              } catch (repairError) {
                console.log(`   ⚠️ JSONRepairAgent falló: ${repairError.message}`);
                console.log('   🔄 Fallback: Extrayendo workflow desde respuesta corrupta...');
                
                const extractedWorkflow = this.extractWorkflowFromCorruptedResponse(jsonStr);
                if (extractedWorkflow) {
                  cleanedJson = extractedWorkflow;
                  console.log('   ✅ Workflow extraído exitosamente desde respuesta corrupta');
                } else {
                  console.log('   ❌ No se pudo extraer workflow válido - FALLBACK BLOQUEADO');
                  throw new Error('No se pudo extraer workflow válido y fallback está bloqueado');
                }
              }
            } else {
              // No es un problema de truncamiento, usar extractor normal
              const extractedWorkflow = this.extractWorkflowFromCorruptedResponse(jsonStr);
              if (extractedWorkflow) {
                cleanedJson = extractedWorkflow;
                console.log('   ✅ Workflow extraído exitosamente desde respuesta corrupta');
              } else {
                console.log('   ❌ No se pudo extraer workflow válido - FALLBACK BLOQUEADO');
                throw new Error('No se pudo extraer workflow válido y fallback está bloqueado');
              }
            }
          }
        }
      }

      if (!parsedSuccessfully) {
        console.error('   ❌ JSON irreparable después de múltiples intentos');
        console.log('   📝 Últimos 500 chars del JSON:', cleanedJson.slice(-500));
        throw new Error('JSON corrupto no se pudo reparar');
      }

      console.log('   ✅ Limpieza avanzada completada');

      // Estadísticas del JSON masivo antes del parsing
      console.log('🔍 ANÁLISIS JSON MASIVO:');
      console.log(`   📏 Tamaño original: ${jsonStr.length.toLocaleString()} chars`);
      console.log(`   📏 Tamaño limpio: ${cleanedJson.length.toLocaleString()} chars`);
      console.log(`   📄 Líneas: ${cleanedJson.split('\n').length.toLocaleString()}`);

      // Preview del JSON masivo (primeros y últimos caracteres)
      if (cleanedJson.length > 2000) {
        console.log(`   👀 Preview inicio: ${cleanedJson.slice(0, 500)}...`);
        console.log(`   👀 Preview final: ...${cleanedJson.slice(-500)}`);
      } else {
        console.log(`   👀 JSON completo: ${cleanedJson.slice(0, 1000)}${cleanedJson.length > 1000 ? '...' : ''}`);
      }

      let data = JSON.parse(cleanedJson);

      // ASIGNAR IDs ÚNICOS A NODOS QUE NO LOS TIENEN
      if (data.nodes && Array.isArray(data.nodes)) {
        console.log('🔧 ASIGNANDO IDs ÚNICOS A NODOS...');
        const usedIds = new Set();

        data.nodes.forEach((node, index) => {
          if (!node.id) {
            let newId;
            do {
              newId = Math.random().toString(36).substring(2, 15);
            } while (usedIds.has(newId));

            node.id = newId;
            usedIds.add(newId);
            console.log(`   📌 ID asignado a "${node.name}": ${newId}`);
          } else {
            usedIds.add(node.id);
          }
        });
        console.log(`   ✅ IDs asignados a ${data.nodes.filter(n => n.id).length}/${data.nodes.length} nodos`);
        
        // ACTUALIZAR CONEXIONES PARA USAR LOS NUEVOS IDs
        if (data.connections) {
          console.log('🔗 ACTUALIZANDO CONEXIONES CON NUEVOS IDs...');
          const idMap = {};
          
          // Crear mapa de IDs originales a nuevos IDs
          data.nodes.forEach(node => {
            if (node.originalId && node.originalId !== node.id) {
              idMap[node.originalId] = node.id;
            }
          });
          
          // Si no hay originalId, intentar mapear por posición en el array
          if (Object.keys(idMap).length === 0) {
            data.nodes.forEach((node, index) => {
              const originalId = (index + 1).toString(); // Asumir IDs originales como "1", "2", "3", etc.
              if (originalId !== node.id) {
                idMap[originalId] = node.id;
              }
            });
          }
          
          // Actualizar conexiones usando el mapa
          const updatedConnections = {};
          Object.keys(data.connections).forEach(sourceKey => {
            const newSourceKey = idMap[sourceKey] || sourceKey;
            updatedConnections[newSourceKey] = data.connections[sourceKey];
            
            // Actualizar referencias dentro de las conexiones
            const connection = updatedConnections[newSourceKey];
            if (connection.main && Array.isArray(connection.main)) {
              connection.main.forEach(outputArray => {
                if (Array.isArray(outputArray)) {
                  outputArray.forEach(target => {
                    if (target.node && idMap[target.node]) {
                      target.node = idMap[target.node];
                    }
                  });
                }
              });
            }
          });
          
          data.connections = updatedConnections;
          console.log(`   ✅ Conexiones actualizadas para ${Object.keys(idMap).length} nodos`);
        }
      }

      // Validate first with AJV using the modular validator
      const validationErrors = this.workflowValidator.validate(data);
      if (validationErrors.length > 0) {
        const msg = validationErrors.join('\n');
        console.error('❌ VALIDACIÓN FALLIDA del JSON masivo:');
        console.error('📋 Errores:', msg);
        throw new Error(`JSON inválido para workflow n8n:\n${msg}`);
      }

      // ✨ NUEVA VALIDACIÓN ESTRUCTURAL AVANZADA
      console.log('🔍 EJECUTANDO VALIDACIÓN ESTRUCTURAL AVANZADA...');
      const structuralValidation = this.validateWorkflowStructure(data);
      
      if (!structuralValidation.isValid) {
        console.error('❌ ERRORES ESTRUCTURALES CRÍTICOS DETECTADOS:');
        structuralValidation.errors.forEach(error => console.error(`   🚨 ${error}`));
        throw new Error(`Workflow con errores estructurales críticos:\n${structuralValidation.errors.join('\n')}`);
      }

      if (structuralValidation.warnings.length > 0) {
        console.warn('⚠️ ADVERTENCIAS ESTRUCTURALES:');
        structuralValidation.warnings.forEach(warning => console.warn(`   ⚠️ ${warning}`));
      }

      console.log('✅ VALIDACIÓN ESTRUCTURAL COMPLETADA:');
      console.log(`   📊 ${structuralValidation.nodeCount} nodos, ${structuralValidation.connectionCount} grupos de conexiones`);
      console.log(`   🔍 ${structuralValidation.errors.length} errores, ${structuralValidation.warnings.length} advertencias`);

      // VALIDACIÓN CRÍTICA: Conexiones deben usar nombres exactos de nodos
      console.log('🔍 VALIDANDO INTEGRIDAD DE CONEXIONES...');
      if (data.nodes && data.connections) {
        const nodeNames = data.nodes.map(node => node.name);
        const connectionKeys = Object.keys(data.connections);

        console.log('📝 Nombres de nodos encontrados:', nodeNames);
        console.log('🔗 Claves en conexiones:', connectionKeys);

        // Verificar que todas las conexiones usen nombres válidos
        const invalidConnections = connectionKeys.filter(key => !nodeNames.includes(key));
        if (invalidConnections.length > 0) {
          console.error('❌ CONEXIONES INVÁLIDAS DETECTADAS:');
          console.error('🚨 Claves de conexión sin nodo correspondiente:', invalidConnections);

          // Limpiar conexiones inválidas automáticamente
          invalidConnections.forEach(invalidKey => {
            delete data.connections[invalidKey];
            console.log(`🧹 Conexión inválida eliminada: ${invalidKey}`);
          });
        }

        // 🔧 VERIFICAR Y REPARAR CONEXIONES FALTANTES
        console.log('🔧 VERIFICANDO Y REPARANDO CONEXIONES FALTANTES...');

        // INICIALIZAR CONEXIONES SI NO EXISTEN
        if (!data.connections) {
          console.log('🔧 Inicializando conexiones vacías...');
          data.connections = {};
        }

        // Identificar nodos que están referenciados en conexiones pero que pueden necesitar más conexiones
        const connectedAsTarget = new Set();
        const allConnectionTargets = [];

        Object.values(data.connections).forEach(conn => {
          if (conn.main) {
            conn.main.forEach(mainConnArray => {
              if (Array.isArray(mainConnArray)) {
                mainConnArray.forEach(connection => {
                  connectedAsTarget.add(connection.node);
                  allConnectionTargets.push(connection.node);
                });
              } else if (mainConnArray && mainConnArray.node) {
                connectedAsTarget.add(mainConnArray.node);
                allConnectionTargets.push(mainConnArray.node);
              }
            });
          }
        });

        // Encontrar nodos finales que podrían necesitar conexiones adicionales
        const triggerTypes = ['webhook', 'telegramTrigger', 'httpRequest', 'schedule', 'cron', 'manual'];
        const potentialOrphanNodes = data.nodes.filter(node => {
          const isTrigger = triggerTypes.some(trigger => (node.type || '').toLowerCase().includes(trigger.toLowerCase()));
          const isConnectedAsTarget = connectedAsTarget.has(node.name);
          const hasOutgoingConnections = data.connections[node.name]?.main?.length > 0;

          // Un nodo puede necesitar conexión si no es trigger y no tiene conexiones salientes
          return !isTrigger && !hasOutgoingConnections;
        });

        console.log('🔍 Nodos potencialmente desconectados:', potentialOrphanNodes.map(n => n.name));

        // Intentar conectar nodos según su lógica
        this.repairWorkflowConnectionsV3(data);

        // Validación completa de integridad V3.0
        console.log('🔍 Ejecutando validación completa de integridad V3.0...');
        const integrityCheck = this.validateWorkflowIntegrityV3(data);
        
        if (!integrityCheck.valid) {
          console.log('⚠️ Problemas de integridad detectados:', integrityCheck.errors);
          console.log('📋 Correcciones aplicadas:', integrityCheck.fixes);
        } else {
          console.log(`✅ Workflow válido - Score de integridad: ${integrityCheck.score}/100`);
        }

        // Mostrar resumen de validación
        if (integrityCheck.warnings.length > 0) {
          console.log('⚠️ Advertencias:', integrityCheck.warnings);
        }

        // Verificar conexiones de salida también
        Object.values(data.connections).forEach((connections, index) => {
          if (connections.main) {
            connections.main.forEach((mainConnectionsArray) => {
              if (Array.isArray(mainConnectionsArray)) {
                mainConnectionsArray.forEach((conn) => {
                  if (conn.node && !nodeNames.includes(conn.node)) {
                    console.error('❌ Conexión de salida inválida:', conn.node);
                    // En lugar de fallar, vamos a limpiar la conexión
                    const index = mainConnectionsArray.indexOf(conn);
                    if (index > -1) {
                      mainConnectionsArray.splice(index, 1);
                      console.log(`🧹 Conexión de salida inválida limpiada: ${conn.node}`);
                    }
                  }
                });
              }
            });
          }
        });

        console.log('✅ Integridad de conexiones verificada y reparada');
      }

      // 🆕 VALIDACIONES AVANZADAS ADICIONALES
      console.log('🔬 EJECUTANDO VALIDACIONES AVANZADAS...');

      // 1. VALIDACIÓN Y CORRECCIÓN AUTOMÁTICA DE TIPOS DE NODOS
      console.log('📋 VALIDANDO TIPOS DE NODOS...');
      
      // Aplicar correcciones automáticas PRIMERO
      const correctedCount = this.validationSystem.autoCorrectInvalidNodes(data);

      // Luego validar si quedan nodos inválidos
      const allValidTypes = this.validationSystem.getAllValidTypes();
      const invalidNodeTypes = data.nodes.filter(node => !allValidTypes.includes(node.type));

      if (invalidNodeTypes.length > 0) {
        console.error('❌ NODOS CON TIPOS AÚN INVÁLIDOS DESPUÉS DE CORRECCIÓN:');
        invalidNodeTypes.forEach(node => {
          console.error(`   🚫 "${node.name}" usa tipo inválido: ${node.type}`);
        });
        console.log('✅ Sugiriendo tipos válidos más similares...');

        // Intentar corregir tipos manualmente como fallback
        invalidNodeTypes.forEach(node => {
          const suggestedType = this.suggestSimilarNodeType(node.type);
          if (suggestedType) {
            console.log(`🔧 CORRECCIÓN MANUAL: "${node.type}" → "${suggestedType}"`);
            node.type = suggestedType;
          }
        });
      } else if (correctedCount === 0) {
        console.log('✅ Todos los tipos de nodos son válidos');
      }

      // 2. VALIDACIÓN DE PARÁMETROS ESPECÍFICOS POR NODO
      console.log('⚙️ VALIDANDO PARÁMETROS DE NODOS...');
      data.nodes.forEach((node, index) => {
        const validation = this.validationSystem.nodeValidations[node.type];
        if (validation) {
          // Verificar parámetros requeridos
          const missingParams = validation.requiredParams.filter(param =>
            !node.parameters || node.parameters[param] === undefined || node.parameters[param] === null
          );

          if (missingParams.length > 0) {
            console.error(`❌ Nodo "${node.name}" (${node.type}) falta parámetros requeridos: ${missingParams.join(', ')}`);
            // Agregar parámetros por defecto si es posible
            missingParams.forEach(param => {
              if (this.getDefaultParameterValue(node.type, param)) {
                node.parameters[param] = this.getDefaultParameterValue(node.type, param);
                console.log(`🔧 Agregando parámetro por defecto: ${param} = ${node.parameters[param]}`);
              }
            });
          }

          // Validar parámetros específicos
          if (validation.validateParams) {
            const paramError = validation.validateParams(node.parameters);
            if (paramError) {
              console.error(`❌ Parámetros inválidos en "${node.name}": ${paramError}`);
              // Intentar corregir automáticamente
              this.autoCorrectParameters(node);
            }
          }
        }
      });

      // 3. VALIDACIÓN DE CREDENCIALES
      console.log('🔐 VALIDANDO CREDENCIALES...');
      data.nodes.forEach(node => {
        const requiredCreds = this.validationSystem.credentialValidations[node.type];
        if (requiredCreds && requiredCreds.length > 0) {
          if (!node.credentials || Object.keys(node.credentials).length === 0) {
            console.warn(`⚠️ Nodo "${node.name}" requiere credenciales: ${requiredCreds.join(', ')}`);
            // Agregar estructura de credenciales vacía
            node.credentials = {};
            requiredCreds.forEach(cred => {
              node.credentials[cred] = { id: cred, name: `${cred} Credentials` };
            });
            console.log(`🔧 Agregada estructura de credenciales para: ${requiredCreds.join(', ')}`);
          }
        }
      });

      // 4. VALIDACIÓN DE COMPATIBILIDAD ENTRE NODOS CONECTADOS
      console.log('🔗 VALIDANDO COMPATIBILIDAD DE CONEXIONES...');
      if (data.nodes && data.connections) {
        const nodeMap = new Map(data.nodes.map(node => [node.name, node]));

        Object.entries(data.connections).forEach(([sourceName, sourceConnections]) => {
          const sourceNode = nodeMap.get(sourceName);
          if (!sourceNode) return;

          if (sourceConnections.main) {
            sourceConnections.main.forEach(mainConn => {
              if (Array.isArray(mainConn)) {
                mainConn.forEach(conn => {
                  const targetNode = nodeMap.get(conn.node);
                  if (targetNode) {
                    const compatibilityError = this.validateNodeCompatibility(sourceNode, targetNode);
                    if (compatibilityError) {
                      console.warn(`⚠️ Conexión potencialmente problemática: ${sourceName} → ${conn.node}`);
                      console.warn(`   ${compatibilityError}`);
                    }
                  }
                });
              } else {
                // Si no es un array, es un objeto de conexión directo
                const targetNode = nodeMap.get(mainConn.node);
                if (targetNode) {
                  const compatibilityError = this.validateNodeCompatibility(sourceNode, targetNode);
                  if (compatibilityError) {
                    console.warn(`⚠️ Conexión potencialmente problemática: ${sourceName} → ${mainConn.node}`);
                    console.warn(`   ${compatibilityError}`);
                  }
                }
              }
            });
          }
        });
      }

      // 5. VALIDACIÓN DE POSICIONES DE NODOS
      console.log('📍 VALIDANDO POSICIONES DE NODOS...');
      data.nodes.forEach((node, index) => {
        if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
          console.warn(`⚠️ Nodo "${node.name}" tiene posición inválida, asignando automática...`);
          // Crear nuevo array en lugar de reasignar
          const newPosition = [index * 300, Math.floor(index / 3) * 150];
          node.position = newPosition;
          console.log(`🔧 Posición asignada: [${node.position[0]}, ${node.position[1]}]`);
        }
      });

      // 6. VALIDACIÓN DE FLUJO DE DATOS
      console.log('🌊 VALIDANDO FLUJO DE DATOS...');
      const triggerNodes = data.nodes.filter(node =>
        this.validationSystem.connectionValidations.compatibility[node.type]?.canBeFirst
      );

      if (triggerNodes.length === 0) {
        console.warn('⚠️ No se encontraron nodos trigger válidos. Agregando webhook por defecto...');
        const webhookNode = {
          id: 'default-webhook',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          position: [0, 0],
          parameters: {
            httpMethod: 'POST',
            path: '/webhook',
            responseMode: 'lastNode'
          }
        };
        data.nodes.unshift(webhookNode);
        console.log('✅ Nodo webhook trigger agregado automáticamente');
      }

      // 7. VALIDACIÓN DE ESTRUCTURA GENERAL
      console.log('🏗️ VALIDANDO ESTRUCTURA GENERAL...');

      // Verificar nodos huérfanos
      const connectedNodes = new Set();
      Object.values(data.connections).forEach(sourceConn => {
        if (sourceConn.main) {
          sourceConn.main.forEach(mainConn => {
            if (Array.isArray(mainConn)) {
              mainConn.forEach(conn => {
                connectedNodes.add(conn.node);
              });
            } else {
              connectedNodes.add(mainConn.node);
            }
          });
        }
      });

      const orphanNodes = data.nodes.filter(node =>
        !connectedNodes.has(node.name) &&
        !this.validationSystem.connectionValidations.dataFlow.canWorkWithoutInput.includes(node.type)
      );

      if (orphanNodes.length > 0) {
        console.warn('⚠️ NODOS HUÉRFANOS DETECTADOS:');
        orphanNodes.forEach(node => {
          console.warn(`   🏃 "${node.name}" no tiene conexiones de entrada y podría no funcionar`);
        });
      }

      // Verificar profundidad máxima
      const maxDepth = this.calculateWorkflowDepth(data);
      if (maxDepth > this.validationSystem.connectionValidations.structure.maxDepth) {
        console.warn(`⚠️ Workflow muy profundo (${maxDepth} niveles). Puede ser difícil de mantener.`);
      }

      console.log('✅ TODAS LAS VALIDACIONES AVANZADAS COMPLETADAS');

      // NUEVAS MEJORAS AVANZADAS
      console.log('🔧 APLICANDO MEJORAS AVANZADAS...');
      
      // 1. Validaciones específicas de parámetros
      console.log('📋 Ejecutando validaciones específicas de parámetros...');
      const specificValidation = this.validateSpecificParameters(data);
      if (specificValidation.autoFixed.length > 0) {
        console.log(`✅ ${specificValidation.autoFixed.length} parámetros corregidos automáticamente:`);
        specificValidation.autoFixed.forEach(fix => console.log(`   🔧 ${fix}`));
      }
      if (specificValidation.errors.length > 0) {
        console.log(`❌ ${specificValidation.errors.length} errores de parámetros:`);
        specificValidation.errors.forEach(error => console.log(`   ❌ ${error}`));
      }
      if (specificValidation.warnings.length > 0) {
        console.log(`⚠️ ${specificValidation.warnings.length} advertencias de parámetros:`);
        specificValidation.warnings.forEach(warning => console.log(`   ⚠️ ${warning}`));
      }

      // 2. Optimización de posicionamiento de nodos
      console.log('🎯 Optimizando posicionamiento de nodos...');
      data = this.optimizeNodePositions(data);

      // 3. Adición de manejo inteligente de errores
      console.log('🛡️ Añadiendo manejo inteligente de errores...');
      // data = this.addIntelligentErrorHandling(data); // Comentado temporalmente para evitar error de constante

      console.log('✅ MEJORAS AVANZADAS COMPLETADAS');

      // 🔧 INTEGRACIÓN DEL AUTOCORRECTOR INTELIGENTE
      console.log('🔧 APLICANDO AUTOCORRECCIÓN INTELIGENTE...');
      try {
        // Inicializar autocorrector con API key
        const settings = await this.getSettings();
        const autocorrector = new AutocorrectorFlujos(settings.apiKey);
        
        // Aplicar autocorrección contextual
        const autocorrectionResult = await autocorrector.corregirWorkflow({
          workflow: data,
          promptOriginal: this.currentPrompt || '',
          targetComplexity: this.isComplexPrompt ? 'alta' : 'media',
          domainContext: this.extractDomainFromPrompt(this.currentPrompt || '')
        });

        // Si la autocorrección fue exitosa, usar el workflow corregido
        if (autocorrectionResult && autocorrectionResult !== data) {
          data = autocorrectionResult;
          
          console.log('✅ AUTOCORRECCIÓN COMPLETADA:');
          console.log(`   🎯 Workflow corregido exitosamente`);
          console.log(`   � Nodos corregidos: ${data.nodes?.length || 0}`);
        } else {
          console.log('⚠️ Autocorrección no aplicada - continuando con workflow original');
        }
      } catch (autocorrectorError) {
        console.warn('⚠️ Error en autocorrección (continuando con workflow original):', autocorrectorError.message);
      }

      // 🎯 APLICAR POSICIONAMIENTO INTELIGENTE V4.0
      console.log('🎯 Aplicando Sistema de Posicionamiento Inteligente V4.0...');
      try {
        const positioningAgent = new IntelligentPositioningAgent();
        const workflowStr = JSON.stringify(data, null, 2);
        const optimizedWorkflow = await positioningAgent.optimizeLayout(data);
        
        if (optimizedWorkflow && optimizedWorkflow !== data) {
          data = optimizedWorkflow;
          console.log('✅ Posicionamiento V4.0 aplicado exitosamente');
          
          // Mostrar estadísticas del posicionamiento con validación mejorada
          try {
            if (positioningAgent && typeof positioningAgent.getCanvasSize === 'function') {
              const dimensions = positioningAgent.getCanvasSize(data);
              console.log(`   🎨 Dimensiones del canvas: ${dimensions.width}×${dimensions.height}`);
              console.log(`   🔢 Nodos posicionados: ${data.nodes?.length || 0}`);
            } else {
              console.log(`   🔢 Nodos posicionados: ${data.nodes?.length || 0}`);
            }
          } catch (e) {
            console.log(`   � Nodos posicionados: ${data.nodes?.length || 0}`);
            console.log('   📊 Estadísticas detalladas no disponibles (posicionamiento aplicado correctamente)');
          }
        } else {
          console.log('ℹ️ Posicionamiento no modificado - mantiene layout actual');
        }
      } catch (positioningError) {
        console.warn('⚠️ Error en posicionamiento V4.0 (continuando con workflow actual):', positioningError.message);
      }

      // En el servidor, solo guardamos - no hay n8n real para importar
      this.currentWorkflow = JSON.stringify(data, null, 2);

      // Estadísticas del workflow masivo procesado
      console.log('✅ WORKFLOW MASIVO PROCESADO:');
      console.log(`   🔢 Nodos: ${data.nodes?.length || 0}`);
      console.log(`   🔗 Conexiones: ${Object.keys(data.connections || {}).length}`);
      console.log(`   📊 Tamaño final: ${this.currentWorkflow.length.toLocaleString()} chars`);

      return { ok: true };
    } catch (e) {
      // Mejor error handling para JSON masivo con más contexto
      console.error('❌ ERROR PROCESANDO JSON MASIVO:');
      console.error('🚨 Error:', e.message);
      console.error('📏 Longitud original:', jsonStr.length.toLocaleString(), 'caracteres');

      // Mostrar más contexto para JSON masivo
      if (jsonStr.length > 5000) {
        console.error('📝 Inicio (1000 chars):', jsonStr.slice(0, 1000));
        console.error('📝 Medio (1000 chars):', jsonStr.slice(Math.floor(jsonStr.length/2) - 500, Math.floor(jsonStr.length/2) + 500));
        console.error('📝 Final (1000 chars):', jsonStr.slice(-1000));
      } else {
        console.error('📝 JSON completo:', jsonStr);
      }

      return { ok: false, error: e.message };
    }
  }

  // 🆕 MÉTODOS AUXILIARES PARA VALIDACIONES AVANZADAS

  // Sugerir tipo de nodo similar basado en el tipo inválido
  suggestSimilarNodeType(invalidType) {
    const allValidTypes = Object.values(this.validationSystem.validNodeTypes).flat();

    // Buscar coincidencias por palabras clave
    const invalidWords = invalidType.toLowerCase().split(/[-_.\s]+/);

    for (const validType of allValidTypes) {
      const validWords = validType.toLowerCase().split(/[-_.\s]+/);
      const matches = invalidWords.filter(word =>
        validWords.some(validWord => validWord.includes(word) || word.includes(validWord))
      );

      if (matches.length >= Math.ceil(invalidWords.length / 2)) {
        return validType;
      }
    }

    // Fallback: devolver el tipo más común
    return 'n8n-nodes-base.function';
  }

  // Obtener valores por defecto para parámetros
  getDefaultParameterValue(nodeType, parameter) {
    const defaults = {
      'n8n-nodes-base.webhook': {
        httpMethod: 'POST',
        path: '/webhook',
        responseMode: 'lastNode'
      },
      'n8n-nodes-base.telegram': {
        chatId: '{{ $json.chat_id }}',
        text: 'Mensaje procesado correctamente'
      },
      'n8n-nodes-base.gmail': {
        operation: 'send'
      },
      'n8n-nodes-base.googleSheets': {
        operation: 'append',
        sheetId: '0'
      },
      'n8n-nodes-base.httpRequest': {
        method: 'GET',
        url: 'https://api.example.com'
      },
      'n8n-nodes-base.code': {
        mode: 'runOnceForAllItems'
      },
      'n8n-nodes-base.function': {
        functionCode: 'return items;'
      },
      'n8n-nodes-base.cron': {
        cronExpression: '0 */6 * * *'
      },
      'n8n-nodes-base.if': {
        conditions: [{
          leftValue: '{{ $json.status }}',
          rightValue: 'success',
          operator: 'equal'
        }]
      },
      'n8n-nodes-base.loopOverItems': {
        batchSize: 10
      }
    };

    return defaults[nodeType]?.[parameter];
  }

  // Corrección automática de parámetros mejorada
  autoCorrectParameters(node) {
    if (!node.parameters) {
      node.parameters = {};
    }

    const corrections = {
      'n8n-nodes-base.webhook': (params) => {
        if (!params.httpMethod) params.httpMethod = 'POST';
        if (!params.path) params.path = `webhook-${Date.now()}`;
        if (!params.responseMode) params.responseMode = 'onReceived';
        if (!params.options) params.options = {};
        console.log(`🔧 Parámetros corregidos en webhook`);
      },

      'n8n-nodes-base.httpRequest': (params) => {
        if (!params.method) params.method = 'GET';
        if (!params.url) params.url = 'https://api.example.com/endpoint';
        if (params.method && !['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(params.method)) {
          params.method = 'GET';
        }
        if (params.url && !params.url.startsWith('http')) {
          params.url = `https://${params.url}`;
        }
        if (!params.options) params.options = {};
        console.log(`🔧 Parámetros corregidos en httpRequest`);
      },

      'n8n-nodes-base.gmail': (params) => {
        if (!params.operation) params.operation = 'send';
        if (!params.to && params.operation === 'send') params.to = 'recipient@example.com';
        if (!params.subject && params.operation === 'send') params.subject = 'Asunto del email';
        if (!params.message && params.operation === 'send') params.message = 'Contenido del mensaje';
        if (!params.options) params.options = {};
        console.log(`🔧 Parámetros corregidos en gmail`);
      },

      'n8n-nodes-base.slack': (params) => {
        if (!params.channel) params.channel = '#general';
        if (!params.text) params.text = 'Mensaje desde n8n';
        if (!params.username) params.username = 'n8n';
        if (!params.attachments) params.attachments = [];
        console.log(`🔧 Parámetros corregidos en slack`);
      },

      'n8n-nodes-base.telegram': (params) => {
        if (!params.chatId) params.chatId = '{{$json.chatId}}';
        if (!params.text) params.text = 'Mensaje desde n8n';
        if (!params.operation) params.operation = 'sendMessage';
        console.log(`🔧 Parámetros corregidos en telegram`);
      },

      'n8n-nodes-base.googleSheets': (params) => {
        if (!params.operation) params.operation = 'read';
        if (!params.documentId) params.documentId = '1ABC123-example-sheet-id';
        if (!params.sheetName) params.sheetName = 'Sheet1';
        if (!params.range) params.range = 'A:Z';
        if (!params.sheetId) params.sheetId = '0';
        console.log(`🔧 Parámetros corregidos en googleSheets`);
      },

      'n8n-nodes-base.mysql': (params) => {
        if (!params.operation) params.operation = 'executeQuery';
        if (!params.query && params.operation === 'executeQuery') params.query = 'SELECT * FROM table_name LIMIT 10';
        console.log(`🔧 Parámetros corregidos en mysql`);
      },

      'n8n-nodes-base.postgres': (params) => {
        if (!params.operation) params.operation = 'executeQuery';
        if (!params.query && params.operation === 'executeQuery') params.query = 'SELECT * FROM table_name LIMIT 10';
        console.log(`🔧 Parámetros corregidos en postgres`);
      },

      'n8n-nodes-base.if': (params, node) => {
        if (!params.conditions) {
          // 🎯 CONDICIONES IF INTELIGENTES BASADAS EN CONTEXTO
          const nodeName = (node.name || '').toLowerCase();
          
          if (nodeName.includes('duplicate') && nodeName.includes('lead')) {
            params.conditions = [{
              leftValue: '{{ $json.email }}',
              operation: 'equal',
              rightValue: '{{ $("Check CRM for Duplicate").first().json.email }}'
            }];
          } else if (nodeName.includes('qualified') && nodeName.includes('lead')) {
            params.conditions = [{
              leftValue: '{{ $json.score }}',
              operation: 'greaterEqual',
              rightValue: '75'
            }];
          } else if (nodeName.includes('score') && nodeName.includes('threshold')) {
            params.conditions = [{
              leftValue: '{{ $json.leadScore }}',
              operation: 'greaterThan',
              rightValue: '70'
            }];
          } else if (nodeName.includes('milestone') && nodeName.includes('date')) {
            params.conditions = [{
              leftValue: '{{ new Date($json.dueDate).getTime() }}',
              operation: 'lessEqual',
              rightValue: '{{ new Date().getTime() }}'
            }];
          } else if (nodeName.includes('escalation')) {
            params.conditions = [{
              leftValue: '{{ $json.priority }}',
              operation: 'equal',
              rightValue: 'high'
            }];
          } else if (nodeName.includes('stock') && nodeName.includes('low')) {
            params.conditions = [{
              leftValue: '{{ $json.currentStock }}',
              operation: 'lessEqual',
              rightValue: '{{ $json.minimumStock }}'
            }];
          } else {
            // Condición genérica como fallback
            params.conditions = [{
              leftValue: '{{ $json.field }}',
              operation: 'equal',
              rightValue: 'expected_value'
            }];
          }
        }
        if (!params.options) params.options = {};
        // Corregir operaciones inválidas
        if (Array.isArray(params.conditions)) {
          params.conditions.forEach((condition, idx) => {
            const validOperations = ['equal', 'notEqual', 'greaterEqual', 'lessEqual', 'greaterThan', 'lessThan', 'contains', 'notContains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'];
            if (condition.operation && !validOperations.includes(condition.operation)) {
              condition.operation = 'equal';
              console.log(`🔧 Operación IF corregida en condición ${idx + 1}`);
            }
          });
        }
        console.log(`🔧 Parámetros corregidos en if`);
      },

      'n8n-nodes-base.set': (params) => {
        if (!params.values) {
          params.values = [{
            name: 'processedData',
            value: '{{ $json }}'
          }];
        }
        if (!params.options) params.options = {};
        console.log(`🔧 Parámetros corregidos en set`);
      },

      'n8n-nodes-base.code': (params) => {
        if (!params.jsCode) params.jsCode = 'return items;';
        if (!params.mode) params.mode = 'runOnceForAllItems';
        console.log(`🔧 Parámetros corregidos en code`);
      },

      'n8n-nodes-base.function': (params) => {
        if (!params.functionCode) params.functionCode = 'return items;';
        console.log(`🔧 Parámetros corregidos en function`);
      },

      'n8n-nodes-base.switch': (params) => {
        if (!params.mode) params.mode = 'expression';
        if (!params.rules) {
          params.rules = [{
            output: 0,
            expression: '{{ $json.field }}'
          }];
        }
        console.log(`🔧 Parámetros corregidos en switch`);
      },

      'n8n-nodes-base.merge': (params) => {
        if (!params.mode) params.mode = 'combine';
        if (!params.joinMode) params.joinMode = 'inner';
        console.log(`🔧 Parámetros corregidos en merge`);
      },

      'n8n-nodes-base.wait': (params) => {
        if (!params.amount) params.amount = 1;
        if (!params.unit) params.unit = 'seconds';
        console.log(`🔧 Parámetros corregidos en wait`);
      },

      'n8n-nodes-base.woocommerce': (params) => {
        if (!params.operation) params.operation = 'getAll';
        if (!params.resource) params.resource = 'product';
        console.log(`🔧 Parámetros corregidos en woocommerce`);
      },

      'n8n-nodes-base.cron': (params) => {
        if (!params.rule) params.rule = '0 */6 * * *';
        if (!params.timezone) params.timezone = 'UTC';
        if (params.cronExpression) {
          const parts = params.cronExpression.split(' ');
          if (parts.length < 5 || parts.length > 6) {
            params.cronExpression = '0 */6 * * *';
            console.log(`🔧 Corregida expresión cron inválida`);
          }
        }
        console.log(`🔧 Parámetros corregidos en cron`);
      },

      // 5 nodos adicionales solicitados
      'n8n-nodes-base.discord': (params) => {
        if (!params.webhookUrl) params.webhookUrl = 'https://discord.com/api/webhooks/...';
        if (!params.content) params.content = 'Mensaje desde n8n';
        console.log(`🔧 Parámetros corregidos en discord`);
      },

      'n8n-nodes-base.notion': (params) => {
        if (!params.operation) params.operation = 'create';
        if (!params.databaseId) params.databaseId = 'database-id-here';
        if (!params.resource) params.resource = 'databasePage';
        console.log(`🔧 Parámetros corregidos en notion`);
      },

      'n8n-nodes-base.stripe': (params) => {
        if (!params.operation) params.operation = 'get';
        if (!params.resource) params.resource = 'customer';
        console.log(`🔧 Parámetros corregidos en stripe`);
      },

      'n8n-nodes-base.airtable': (params) => {
        if (!params.operation) params.operation = 'list';
        if (!params.application) params.application = 'appXXXXXXXXX';
        if (!params.table) params.table = 'Table1';
        console.log(`🔧 Parámetros corregidos en airtable`);
      },

      'n8n-nodes-base.shopify': (params) => {
        if (!params.operation) params.operation = 'getAll';
        if (!params.resource) params.resource = 'product';
        console.log(`🔧 Parámetros corregidos en shopify`);
      }
    };

    if (corrections[node.type]) {
      corrections[node.type](node.parameters, node);
    }

    // Agregar credenciales si son necesarias (expandido)
    const credentialsRequired = {
      'n8n-nodes-base.gmail': 'gmailApi',
      'n8n-nodes-base.googleSheets': 'googleSheetsApi', 
      'n8n-nodes-base.slack': 'slackApi',
      'n8n-nodes-base.telegram': 'telegramApi',
      'n8n-nodes-base.mysql': 'mysql',
      'n8n-nodes-base.postgres': 'postgres',
      'n8n-nodes-base.woocommerce': 'woocommerceApi',
      'n8n-nodes-base.discord': 'discordWebhook',
      'n8n-nodes-base.notion': 'notionApi',
      'n8n-nodes-base.stripe': 'stripeApi',
      'n8n-nodes-base.airtable': 'airtableApi',
      'n8n-nodes-base.shopify': 'shopifyApi'
    };

    const credType = credentialsRequired[node.type];
    if (credType && (!node.credentials || !node.credentials[credType])) {
      if (!node.credentials) node.credentials = {};
      node.credentials[credType] = {
        id: credType,
        name: `${credType} Credentials`
      };
    }
  }

  // Validar compatibilidad entre nodos conectados
  validateNodeCompatibility(sourceNode, targetNode) {
    const compatibilityRules = {
      // Triggers solo pueden conectar a procesadores o acciones
      'n8n-nodes-base.webhook': {
        invalidTargets: ['n8n-nodes-base.cron', 'n8n-nodes-base.scheduleTrigger']
      },
      'n8n-nodes-base.cron': {
        invalidTargets: ['n8n-nodes-base.webhook', 'n8n-nodes-base.telegramTrigger']
      },

      // Outputs no deberían tener conexiones salientes
      'n8n-nodes-base.emailSend': {
        shouldNotHaveOutputs: true
      },
      'n8n-nodes-base.telegram': {
        shouldNotHaveOutputs: true
      },

      // Algunos nodos requieren datos específicos
      'n8n-nodes-base.googleSheets': {
        requiresDataFields: ['spreadsheetId']
      },
      'n8n-nodes-base.googleCalendar': {
        requiresDataFields: ['calendarId']
      }
    };

    const sourceRules = compatibilityRules[sourceNode.type];
    if (sourceRules) {
      if (sourceRules.invalidTargets && sourceRules.invalidTargets.includes(targetNode.type)) {
        return `${sourceNode.type} no debería conectar directamente a ${targetNode.type}`;
      }

      if (sourceRules.shouldNotHaveOutputs) {
        return `${sourceNode.type} es un nodo de salida y no debería tener conexiones salientes`;
      }
    }

    return null; // Compatible
  }

  // Reparar conexiones de workflow inteligentemente
  repairWorkflowConnections(data) {
    if (!data.nodes || !data.connections) return;

    console.log('🔧 REPARANDO CONEXIONES INTELIGENTEMENTE...');

    const nodesByType = this.groupNodesByType(data.nodes);
    const triggerTypes = ['webhook', 'telegramTrigger', 'httpRequest', 'schedule', 'cron', 'manual'];
    const outputTypes = ['telegram', 'gmail', 'slack', 'webhook'];

    // Encontrar nodos de entrada (triggers)
    const triggerNodes = data.nodes.filter(node =>
      triggerTypes.some(trigger => (node.type || '').toLowerCase().includes(trigger.toLowerCase()))
    );

    // Encontrar nodos de salida
    const outputNodes = data.nodes.filter(node =>
      outputTypes.some(output => (node.type || '').toLowerCase().includes(output.toLowerCase()))
    );

    // Encontrar nodos de procesamiento intermedios
    const processingNodes = data.nodes.filter(node =>
      !triggerNodes.includes(node) && !outputNodes.includes(node)
    );

    // Lógica de reparación: asegurar flujo trigger → processing → output
    let repairsMade = 0;

    // 1. Conectar triggers desconectados al primer nodo de procesamiento
    triggerNodes.forEach(triggerNode => {
      if (!data.connections[triggerNode.name] || !data.connections[triggerNode.name].main) {
        const firstProcessingNode = processingNodes[0];
        if (firstProcessingNode) {
          if (!data.connections[triggerNode.name]) {
            data.connections[triggerNode.name] = { main: [[]] };
          }
          data.connections[triggerNode.name].main[0] = [{
            node: firstProcessingNode.name,
            type: 'main',
            index: 0
          }];
          console.log(`🔗 Trigger conectado: ${triggerNode.name} → ${firstProcessingNode.name}`);
          repairsMade++;
        }
      }
    });

    // 2. Conectar nodos de procesamiento en secuencia lógica
    const connectedAsTarget = new Set();
    Object.values(data.connections).forEach(conn => {
      if (conn.main) {
        conn.main.forEach(mainConnArray => {
          if (Array.isArray(mainConnArray)) {
            mainConnArray.forEach(connection => {
              connectedAsTarget.add(connection.node);
            });
          } else if (mainConnArray?.node) {
            connectedAsTarget.add(mainConnArray.node);
          }
        });
      }
    });

    // Encontrar nodos de procesamiento desconectados
    const disconnectedProcessingNodes = processingNodes.filter(node =>
      !connectedAsTarget.has(node.name) &&
      (!data.connections[node.name] || !data.connections[node.name].main?.length)
    );

    // Conectar nodos desconectados al flujo principal
    disconnectedProcessingNodes.forEach(disconnectedNode => {
      // Buscar el último nodo en el flujo para conectarlo
      const lastConnectedNode = this.findLastConnectedNode(data, processingNodes);
      if (lastConnectedNode && lastConnectedNode !== disconnectedNode.name) {
        if (!data.connections[lastConnectedNode]) {
          data.connections[lastConnectedNode] = { main: [[]] };
        }
        if (!data.connections[lastConnectedNode].main[0]) {
          data.connections[lastConnectedNode].main[0] = [];
        }

        data.connections[lastConnectedNode].main[0].push({
          node: disconnectedNode.name,
          type: 'main',
          index: 0
        });
        console.log(`🔗 Nodo de procesamiento conectado: ${lastConnectedNode} → ${disconnectedNode.name}`);
        repairsMade++;
      }
    });

    // 3. Asegurar que hay conexión a nodos de salida
    const lastProcessingNode = this.findLastProcessingNode(data, processingNodes);
    outputNodes.forEach(outputNode => {
      if (!connectedAsTarget.has(outputNode.name) && lastProcessingNode) {
        if (!data.connections[lastProcessingNode]) {
          data.connections[lastProcessingNode] = { main: [[]] };
        }
        if (!data.connections[lastProcessingNode].main[0]) {
          data.connections[lastProcessingNode].main[0] = [];
        }

        // Evitar conexiones duplicadas
        const alreadyConnected = this.safeCheckConnection(data, lastProcessingNode, outputNode.name);

        if (!alreadyConnected) {
          data.connections[lastProcessingNode].main[0].push({
            node: outputNode.name,
            type: 'main',
            index: 0
          });
          console.log(`🔗 Nodo de salida conectado: ${lastProcessingNode} → ${outputNode.name}`);
          repairsMade++;
        }
      }
    });

    console.log(`✅ Reparaciones de conexión completadas: ${repairsMade} conexiones añadidas`);
  }

  // Agrupar nodos por tipo para análisis
  groupNodesByType(nodes) {
    return nodes.reduce((groups, node) => {
      const category = this.categorizeNode(node.type);
      if (!groups[category]) groups[category] = [];
      groups[category].push(node);
      return groups;
    }, {});
  }

  // Categorizar nodo por tipo
  categorizeNode(nodeType) {
    const type = nodeType.toLowerCase();

    if (type.includes('trigger') || type.includes('webhook') || type.includes('schedule') || type.includes('cron')) {
      return 'trigger';
    }
    if (type.includes('telegram') || type.includes('gmail') || type.includes('slack') || type.includes('discord')) {
      return 'communication';
    }
    if (type.includes('openai') || type.includes('anthropic') || type.includes('gemini') || type.includes('ai')) {
      return 'ai';
    }
    if (type.includes('calendar') || type.includes('sheets') || type.includes('drive')) {
      return 'google';
    }
    if (type.includes('set') || type.includes('code') || type.includes('function')) {
      return 'processing';
    }
    if (type.includes('if') || type.includes('switch') || type.includes('merge')) {
      return 'logic';
    }

    return 'general';
  }

  // Encontrar el último nodo conectado en el flujo
  findLastConnectedNode(data, processingNodes) {
    // Buscar un nodo que tenga conexiones salientes
    for (let i = processingNodes.length - 1; i >= 0; i--) {
      const node = processingNodes[i];
      if (data.connections[node.name]?.main?.length > 0) {
        return node.name;
      }
    }
    // Si no hay ninguno con conexiones salientes, usar el último nodo
    return processingNodes.length > 0 ? processingNodes[processingNodes.length - 1].name : null;
  }

  // Encontrar el último nodo de procesamiento que debe conectarse a outputs
  findLastProcessingNode(data, processingNodes) {
    // Buscar nodos que no tengan conexiones salientes o que tengan pocas
    const candidateNodes = processingNodes.filter(node => {
      const connections = data.connections[node.name]?.main?.[0] || [];
      return connections.length < 2; // Nodos que pueden tener más conexiones
    });

    return candidateNodes.length > 0 ? candidateNodes[candidateNodes.length - 1].name :
           (processingNodes.length > 0 ? processingNodes[processingNodes.length - 1].name : null);
  }

  // ===== EXTENSOR DE FLUJO AVANZADO =====

  // EXTENSOR DE FLUJO ULTRA-AVANZADO
  async extendWorkflow(initialPrompt) {
    console.log('🚀 INICIANDO EXTENSOR DE FLUJO...');
    console.log('📝 Prompt original:', initialPrompt.substring(0, 200) + '...');

    try {
      // Paso 1: Generar el flujo inicial (primera parte)
      console.log('⚡ PASO 1: Generando flujo inicial...');
      const initialResult = await this.processUserPrompt(initialPrompt + ' (Genera solo la primera parte del flujo, los nodos principales y sus conexiones básicas)');

      if (!initialResult.success) {
        throw new Error('No se pudo generar el flujo inicial: ' + initialResult.error);
      }

      // Leer el archivo generado
      const initialWorkflowContent = await fs.promises.readFile(initialResult.filename, 'utf8');
      const initialWorkflow = JSON.parse(initialWorkflowContent);

      if (!initialWorkflow || !initialWorkflow.nodes) {
        throw new Error('No se pudo generar el flujo inicial');
      }

      console.log(`✅ Flujo inicial generado: ${initialWorkflow.nodes.length} nodos`);

      // Paso 2: Identificar puntos de extensión
      console.log('🔍 PASO 2: Identificando puntos de extensión...');
      const extensionPoints = this.identifyExtensionPoints(initialWorkflow);
      console.log(`📍 Puntos de extensión encontrados: ${extensionPoints.length}`);

      // Paso 3: Generar extensiones para cada punto
      console.log('⚡ PASO 3: Generando extensiones...');
      let extendedWorkflow = initialWorkflow;

      for (let i = 0; i < extensionPoints.length && i < 3; i++) { // Máximo 3 extensiones
        const point = extensionPoints[i];
        console.log(`🔧 Extendiendo desde nodo: ${point.nodeName}`);

        const extensionPrompt = `Continúa el siguiente workflow desde el nodo "${point.nodeName}".
        Añade los nodos necesarios para completar el flujo según el prompt original: "${initialPrompt}".

        Flujo actual:
        - Total nodos: ${extendedWorkflow.nodes.length}
        - Último nodo: ${point.nodeName}
        - Conexiones actuales: ${Object.keys(extendedWorkflow.connections || {}).length}

        Genera SOLO los nodos adicionales y sus conexiones, empezando desde "${point.nodeName}".`;

        const extension = await this.generateWorkflowExtension(extensionPrompt, point);

        if (extension && extension.nodes && extension.nodes.length > 0) {
          console.log(`✅ Extensión ${i + 1} generada: ${extension.nodes.length} nodos adicionales`);
          extendedWorkflow = this.mergeWorkflows(extendedWorkflow, extension, point);
          console.log(`📊 Flujo combinado: ${extendedWorkflow.nodes.length} nodos totales`);
        }
      }

      // Paso 4: Validar y reparar conexiones del flujo completo
      console.log('🔧 PASO 4: Validando flujo extendido...');
      const finalWorkflow = this.validateAndRepairExtendedWorkflow(extendedWorkflow);

      console.log('🎉 EXTENSOR DE FLUJO COMPLETADO:');
      console.log(`   📊 Nodos finales: ${finalWorkflow.nodes.length}`);
      console.log(`   🔗 Conexiones: ${Object.keys(finalWorkflow.connections || {}).length}`);
      console.log(`   📏 Profundidad: ${this.calculateWorkflowDepth(finalWorkflow)}`);

      return finalWorkflow;

    } catch (error) {
      console.error('❌ Error en extensor de flujo:', error.message);
      // Fallback: intentar generar todo de una vez
      console.log('🔄 Fallback: Generando workflow completo...');
      const fallbackResult = await this.processUserPrompt(initialPrompt);
      if (fallbackResult.success) {
        const fallbackContent = await fs.promises.readFile(fallbackResult.filename, 'utf8');
        return JSON.parse(fallbackContent);
      }
      return null;
    }
  }


  // ===== MÉTODOS DE OPTIMIZACIÓN - EXTRAÍDOS DE processUserPrompt =====

  // Método optimizado para mejorar prompts
  async enhanceUserPrompt(prompt) {
    console.log('🔧 Mejorando claridad del prompt...');
    console.log('🔧 AGENTE DE MEJORA DE PROMPTS ACTIVADO');
    console.log(`📝 Prompt original: ${prompt}`);
    
    const promptEnhancement = await this.promptAgent.enhancePrompt(prompt);
    const finalPrompt = promptEnhancement.enhanced || prompt;

    if (promptEnhancement.enhanced && promptEnhancement.enhanced !== prompt) {
      console.log('✨ Prompt mejorado generado');
      console.log(`📝 Versión mejorada: ${finalPrompt.slice(0, 200)}...`);
    } else {
      console.log('✅ Prompt original es suficientemente claro');
    }

    return finalPrompt;
  }

  // Método optimizado para detectar y simplificar prompts complejos
  optimizeComplexPrompt(prompt) {
    this.isComplexPrompt = prompt.length > COMPLEXITY_THRESHOLD.LENGTH || 
                          prompt.split(',').length > COMPLEXITY_THRESHOLD.COMMA_COUNT;
    
    console.log('🎯 Optimizando prompt para workflow completo y funcional...');

    // Detectar tipo de workflow y optimizar específicamente
    const workflowType = this.detectWorkflowType(prompt);
    console.log(`📊 Tipo de workflow detectado: ${workflowType}`);

    let optimizedPrompt;
    
    switch (workflowType) {
      case 'multi-platform-social':
        optimizedPrompt = `Crear un workflow completo de publicación multi-plataforma con:
        1. TRIGGER: Webhook para recibir contenido
        2. VALIDACIÓN: Validar datos de entrada (contenido, plataformas)
        3. PROCESAMIENTO: Formatear contenido para cada plataforma
        4. PUBLICACIÓN: Enviar a Instagram, WhatsApp, Telegram simultáneamente
        5. AGREGACIÓN: Combinar resultados de todas las plataformas
        6. NOTIFICACIÓN: Telegram con estado final
        7. LOGGING: Registrar actividad completa
        Incluye manejo de errores en cada paso y retry logic.`;
        break;
        
      case 'ecommerce':
        optimizedPrompt = `Crear un workflow completo de e-commerce con:
        1. TRIGGER: Webhook de pedidos
        2. VALIDACIÓN: Validar datos del pedido
        3. INVENTARIO: Verificar stock disponible
        4. PAGO: Procesar pagos con Stripe/PayPal
        5. ACTUALIZACIÓN: Actualizar inventario y estado
        6. NOTIFICACIONES: Email cliente + Slack interno
        7. LOGGING: Registrar toda la transacción
        Con manejo completo de errores y rollback.`;
        break;
        
      case 'automation':
        optimizedPrompt = `Crear un workflow completo de automatización con:
        1. TRIGGER: Webhook o schedule según necesidad
        2. VALIDACIÓN: Validar datos de entrada
        3. PROCESAMIENTO: Lógica principal del negocio
        4. NOTIFICACIONES: Múltiples canales (Telegram, Slack, Email)
        5. ALMACENAMIENTO: Guardar resultados en BD o Sheets
        6. MONITOREO: Logging y alertas
        Con arquitectura robusta y escalable.`;
        break;
        
      default:
        optimizedPrompt = `Crear un workflow n8n completo y funcional con mínimo 6-8 nodos:
        1. TRIGGER apropiado para el caso de uso
        2. VALIDACIÓN de datos de entrada
        3. PROCESAMIENTO lógico principal
        4. MÚLTIPLES SALIDAS según necesidad
        5. NOTIFICACIONES de estado
        6. LOGGING para monitoreo
        Con conexiones completas entre todos los nodos.`;
    }

    console.log(`📝 Prompt optimizado para: ${workflowType}`);
    return optimizedPrompt;
  }

  // Nueva función para detectar tipo de workflow
  detectWorkflowType(prompt) {
    const promptLower = prompt.toLowerCase();
    
    // Multi-plataforma social
    const socialPlatforms = ['instagram', 'whatsapp', 'telegram', 'slack', 'twitter', 'linkedin'];
    const socialCount = socialPlatforms.filter(platform => promptLower.includes(platform)).length;
    
    if (socialCount >= 2) {
      return 'multi-platform-social';
    }
    
    // E-commerce
    const ecommerceKeywords = ['pedido', 'order', 'pago', 'payment', 'inventario', 'stock', 'shopify', 'woocommerce', 'stripe'];
    if (ecommerceKeywords.some(keyword => promptLower.includes(keyword))) {
      return 'ecommerce';
    }
    
    // CRM
    const crmKeywords = ['cliente', 'customer', 'lead', 'crm', 'contacto', 'seguimiento'];
    if (crmKeywords.some(keyword => promptLower.includes(keyword))) {
      return 'crm';
    }
    
    // Marketing
    const marketingKeywords = ['campaña', 'campaign', 'newsletter', 'promocion', 'marketing', 'email'];
    if (marketingKeywords.some(keyword => promptLower.includes(keyword))) {
      return 'marketing';
    }
    
    return 'automation';
  }

  // Método para ejecutar operaciones con retry y cache
  async executeWithRetry(operation, maxAttempts = 3, cacheKey = null) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxAttempts}...`);
        console.log('🔑 DEBUG executeWithRetry: API Key existe:', !!process.env.GEMINI_API_KEY);
        console.log('🔑 DEBUG executeWithRetry: API Key longitud:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
        
        const result = await operation();
        
        // Cachear resultado exitoso
        if (cacheKey && result) {
          this.requestCache.set(cacheKey, result);
          // Limpiar cache después de 10 minutos
          setTimeout(() => this.requestCache.delete(cacheKey), 600000);
        }
        
        return result;
      } catch (error) {
        console.warn(`⚠️ Intento ${attempt} falló:`, error.message);
        
        if (attempt === maxAttempts) {
          throw new Error(`Operación falló después de ${maxAttempts} intentos: ${error.message}`);
        }
        
        // Espera exponencial entre reintentos
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Método para limpiar recursos y cache
  cleanup() {
    console.log('🧹 Limpiando recursos...');
    
    // Limpiar timeouts activos
    this.timeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.timeouts.clear();
    
    // Limpiar cache de requests
    this.requestCache.clear();
    
    console.log('✅ Recursos limpiados');
  }

  // Método optimizado para preparar contexto de ejemplos
  prepareExampleContext(searchResults, curatedExamples) {
    const allExamples = [...searchResults, ...curatedExamples];
    console.log(`📚 Encontrados ${allExamples.length} workflows de referencia`);

    const exampleContext = allExamples.length > 0
      ? `\nEJEMPLO COMPACTO:\n${JSON.stringify(allExamples[0].workflow, null, 0).slice(0, 300)}...`
      : '';

    return { allExamples, exampleContext };
  }

  // Método optimizado para construir prompt de workflow
  buildWorkflowPrompt(optimizedPrompt, exampleContext, workflow) {
    return `🚀 MAESTRO n8n ENTERPRISE v8.0 - ARQUITECTO DE WORKFLOWS PROFESIONALES 🚀

SOLICITUD: ${optimizedPrompt}

${exampleContext}

⚡ INSTRUCCIONES CRÍTICAS ULTRA-AVANZADAS:
========================================
🎯 GENERA UN WORKFLOW ENTERPRISE DE 10-25 NODOS COMPLETAMENTE FUNCIONAL
🎯 INCLUYE ARQUITECTURA COMPLETA: TRIGGER → VALIDACIÓN → PROCESAMIENTO PARALELO → INTEGRACIÓN MULTI-SISTEMA → MANEJO ERRORES → NOTIFICACIONES → AUDITORIA
🎯 CONFIGURA PARÁMETROS REALES Y FUNCIONALES (NO GENÉRICOS)
🎯 IMPLEMENTA LÓGICA EMPRESARIAL REAL CON VALIDACIONES ROBUSTAS
🎯 DEVUELVE ÚNICAMENTE JSON VÁLIDO SIN TEXTO ADICIONAL

ARQUITECTURA OBLIGATORIA PARA PROMPT DE MÚLTIPLES PLATAFORMAS:
=============================================================
1. **TRIGGER**: Webhook para recibir contenido
2. **VALIDACIÓN**: Code node para validar datos de entrada
3. **PREPARACIÓN**: Set nodes para formatear contenido para cada plataforma
4. **PROCESAMIENTO PARALELO**: Nodos específicos para cada plataforma (Instagram, WhatsApp, etc.)
5. **AGREGACIÓN**: Merge node para combinar resultados
6. **NOTIFICACIONES**: Telegram para notificar estado
7. **LOGGING**: Set node para registrar actividad

NODOS n8n VÁLIDOS CON CONFIGURACIÓN EXACTA:
==========================================
🔗 TRIGGERS:
- n8n-nodes-base.webhook: {"httpMethod": "POST", "path": "/webhook-path", "responseMode": "onReceived"}
- n8n-nodes-base.cron: {"rule": "0 */2 * * *", "timezone": "UTC"}
- n8n-nodes-base.manualTrigger: {}

📧 COMUNICACIÓN:
- n8n-nodes-base.telegram: {"operation": "sendMessage", "chatId": "{{$json.chatId}}", "text": "{{$json.message}}"}
- n8n-nodes-base.slack: {"operation": "postMessage", "channel": "#general", "text": "{{$json.message}}"}
- n8n-nodes-base.gmail: {"operation": "send", "toEmail": "{{$json.email}}", "subject": "{{$json.subject}}", "message": "{{$json.body}}"}
- n8n-nodes-base.whatsApp: {"operation": "sendMessage", "to": "{{$json.phoneNumber}}", "message": "{{$json.content}}"}

📱 REDES SOCIALES:
- n8n-nodes-base.httpRequest: {"method": "POST", "url": "https://api.instagram.com/v1/media", "headers": {"Authorization": "Bearer {{$credentials.accessToken}}"}, "body": {"caption": "{{$json.caption}}", "image_url": "{{$json.imageUrl}}"}}

� PROCESAMIENTO:
- n8n-nodes-base.if: {"conditions": [{"leftValue": "{{$json.content}}", "operation": "isNotEmpty"}]}
- n8n-nodes-base.set: {"values": [{"name": "processedData", "value": "{{$json.rawData}}"}]}
- n8n-nodes-base.code: {"jsCode": "// Validar datos\nif (!items[0].json.content) throw new Error('Content required');\nreturn items;"}
- n8n-nodes-base.merge: {"mode": "append"}
- n8n-nodes-base.function: {"functionCode": "return items.map(item => ({...item, processed: true}));"}

📊 BASES DE DATOS:
- n8n-nodes-base.mysql: {"operation": "select", "query": "SELECT * FROM content WHERE id = {{$json.id}}"}
- n8n-nodes-base.googleSheets: {"operation": "append", "documentId": "sheet-id", "range": "A:Z", "values": "{{$json.data}}"}

🚨 CORRECCIONES DE SINTAXIS CRÍTICAS - USAR EXACTAMENTE:
========================================================
⚠️ OPERACIONES IF - USA EXACTAMENTE:
- "operation": "equal" ✅ (NO "equals")
- "operation": "notEqual" ✅ (NO "notEquals") 
- "operation": "greaterThan" ✅
- "operation": "lessThan" ✅
- "operation": "contains" ✅
- "operation": "isEmpty" ✅
- "operation": "isNotEmpty" ✅

⚠️ TIPOS DE NODOS - USA EXACTAMENTE:
- "n8n-nodes-base.hubspot" ✅ (NO "n8n-nodes-hubspot.hubspot")
- "n8n-nodes-base.slack" ✅ (NO "n8n-nodes-slack.slack")
- "n8n-nodes-base.awsS3" ✅ (NO "n8n-nodes-aws.s3")
- "n8n-nodes-base.mailchimp" ✅ (NO "n8n-nodes-mailchimp.mailchimp")
- "n8n-nodes-base.telegram" ✅
- "n8n-nodes-base.whatsApp" ✅

🔥 INTEGRACIÓN EMPRESARIAL:
- n8n-nodes-base.hubspot: {"operation": "create", "resource": "contact", "email": "{{$json.email}}", "firstname": "{{$json.name}}"}
- n8n-nodes-base.awsS3: {"operation": "upload", "bucketName": "my-bucket", "fileName": "{{$json.filename}}", "fileContent": "{{$json.content}}"}
- n8n-nodes-base.mailchimp: {"operation": "memberAdd", "list": "list-id", "email": "{{$json.email}}", "status": "subscribed"}

EJEMPLO DE WORKFLOW COMPLETO PARA MÚLTIPLES PLATAFORMAS:
========================================================
{
  "nodes": [
    {
      "id": "webhook-content",
      "name": "Content Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 200],
      "parameters": {"httpMethod": "POST", "path": "/content", "responseMode": "onReceived"}
    },
    {
      "id": "validate-content",
      "name": "Validate Content",
      "type": "n8n-nodes-base.code",
      "position": [400, 200],
      "parameters": {"jsCode": "if (!items[0].json.content) throw new Error('Content required');\nif (!items[0].json.platforms) throw new Error('Platforms required');\nreturn items;"}
    },
    {
      "id": "format-instagram",
      "name": "Format for Instagram",
      "type": "n8n-nodes-base.set",
      "position": [700, 100],
      "parameters": {"values": [{"name": "caption", "value": "{{$json.content}} #instagram"}, {"name": "platform", "value": "instagram"}]}
    },
    {
      "id": "format-whatsapp",
      "name": "Format for WhatsApp",
      "type": "n8n-nodes-base.set",
      "position": [700, 200],
      "parameters": {"values": [{"name": "message", "value": "{{$json.content}}"}, {"name": "platform", "value": "whatsapp"}]}
    },
    {
      "id": "post-instagram",
      "name": "Post to Instagram",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1000, 100],
      "parameters": {"method": "POST", "url": "https://api.instagram.com/v1/media", "headers": {"Authorization": "Bearer token"}, "body": {"caption": "{{$json.caption}}"}}
    },
    {
      "id": "send-whatsapp",
      "name": "Send WhatsApp",
      "type": "n8n-nodes-base.whatsApp",
      "position": [1000, 200],
      "parameters": {"operation": "sendMessage", "to": "{{$json.phoneNumber}}", "message": "{{$json.message}}"}
    },
    {
      "id": "merge-results",
      "name": "Merge Results",
      "type": "n8n-nodes-base.merge",
      "position": [1300, 150],
      "parameters": {"mode": "append"}
    },
    {
      "id": "notify-telegram",
      "name": "Notify Status",
      "type": "n8n-nodes-base.telegram",
      "position": [1600, 150],
      "parameters": {"operation": "sendMessage", "chatId": "123456", "text": "Content published successfully"}
    }
  ],
  "connections": {
    "Content Webhook": {"main": [[{"node": "Validate Content", "type": "main", "index": 0}]]},
    "Validate Content": {"main": [[{"node": "Format for Instagram", "type": "main", "index": 0}, {"node": "Format for WhatsApp", "type": "main", "index": 0}]]},
    "Format for Instagram": {"main": [[{"node": "Post to Instagram", "type": "main", "index": 0}]]},
    "Format for WhatsApp": {"main": [[{"node": "Send WhatsApp", "type": "main", "index": 0}]]},
    "Post to Instagram": {"main": [[{"node": "Merge Results", "type": "main", "index": 0}]]},
    "Send WhatsApp": {"main": [[{"node": "Merge Results", "type": "main", "index": 1}]]},
    "Merge Results": {"main": [[{"node": "Notify Status", "type": "main", "index": 0}]]}
  }
}

RESPUESTA REQUERIDA:
==================
🎯 GENERA AHORA EL WORKFLOW ENTERPRISE PARA: ${optimizedPrompt}`;
  }

  // Método eliminado - duplicado

  // Método optimizado para manejar workflow incompleto
  async handleIncompleteWorkflow(prompt, parsedWorkflow, lastNodeName) {
    console.log('🔍 VERIFICANDO COMPLETITUD DEL WORKFLOW...');

    // Verificar si el workflow está realmente completo
    const workflowStatus = parsedWorkflow.metadata?.workflowStatus || parsedWorkflow.workflowStatus;
    const lastNode = parsedWorkflow.metadata?.lastNodeName || parsedWorkflow.lastNodeName;
    const estimatedNodes = parsedWorkflow.metadata?.estimatedNodes || parsedWorkflow.estimatedNodes;

    // Heurísticas mejoradas para determinar si el workflow está incompleto
    const hasPartialStatus = workflowStatus === 'partial';
    const tooFewNodes = parsedWorkflow.nodes.length < 3; // Reducido de 5 a 3 como mínimo absoluto
    const hasIncompleteStructure = this.detectIncompleteWorkflowStructure(parsedWorkflow, prompt);
    
    // Criterios más estrictos para workflows completos
    const hasValidTrigger = parsedWorkflow.nodes.some(node => 
      node.type.includes('webhook') || node.type.includes('trigger') || node.type.includes('cron')
    );
    const hasProcessingNodes = parsedWorkflow.nodes.some(node => 
      node.type.includes('set') || node.type.includes('code') || node.type.includes('function') || 
      node.type.includes('if') || node.type.includes('httpRequest')
    );
    const hasOutputNodes = parsedWorkflow.nodes.some(node => 
      node.type.includes('telegram') || node.type.includes('slack') || node.type.includes('gmail') || 
      node.type.includes('mysql') || node.type.includes('sheets')
    );
    
    // Workflow es completo si tiene estructura básica válida
    const isLogicallyComplete = workflowStatus === 'complete' || 
                               (parsedWorkflow.nodes.length >= 3 && 
                                hasValidTrigger && 
                                (hasProcessingNodes || hasOutputNodes) && 
                                !hasIncompleteStructure);

    console.log(`📊 Análisis de completitud:`);
    console.log(`   🏷️ Status reportado: ${workflowStatus || 'no especificado'}`);
    console.log(`   📈 Nodos actuales: ${parsedWorkflow.nodes.length}`);
    console.log(`   📊 Nodos estimados: ${estimatedNodes || 'no especificado'}`);
    console.log(`   🏁 Último nodo: ${lastNode || 'no especificado'}`);
    console.log(`   ✅ Estructuralmente completo: ${!hasIncompleteStructure}`);

    if (!isLogicallyComplete) {
      console.warn('⚠️ WORKFLOW GENERADO PARECE INCOMPLETO. Iniciando sistema de continuación...');

      // Iniciar el proceso de re-prompt/extensión con reintentos limitados
      const extendedResult = await this.rePromptForCompletion(prompt, parsedWorkflow, lastNodeName || lastNode);

      if (extendedResult.success) {
        // Reemplazar el currentWorkflow con el resultado extendido
        this.currentWorkflow = JSON.stringify(extendedResult.workflow, null, 2);
        parsedWorkflow = extendedResult.workflow; // Actualizar para el resto de la función
        console.log('✅ Workflow completado exitosamente con sistema de continuación.');
        console.log(`📊 Nodos finales: ${parsedWorkflow.nodes.length}`);
      } else {
        console.warn('⚠️ No se pudo completar el workflow con el sistema de continuación');
        console.warn(`   Error: ${extendedResult.error}`);
        console.warn('   🔄 Continuando con el workflow parcial generado...');
      }
    }

    return { parsedWorkflow, isLogicallyComplete };
  }

  // MÉTODO PRINCIPAL OPTIMIZADO PARA RESPUESTAS MASIVAS DE GEMINI (V2 FUNCIONAL)
  async processUserPromptV2(userPrompt) {
    console.log('🚀 Procesando prompt del usuario:', userPrompt);
    
    try {
      // 1. Mejora del prompt antes de procesarlo
      console.log('🔧 Mejorando claridad del prompt...');
      const promptEnhancement = await this.promptAgent.enhancePrompt(userPrompt);
      const finalPrompt = promptEnhancement.enhanced || userPrompt;
      
      if (promptEnhancement.enhanced && promptEnhancement.enhanced !== userPrompt) {
        console.log('✨ Prompt mejorado aplicado');
        console.log('📝 Versión mejorada:', finalPrompt.slice(0, 200) + '...');
      } else {
        console.log('✅ Prompt original es suficientemente claro');
      }

      // 2. Obtener configuración
      const settings = await this.getSettings();
      console.log('⚙️ Configuración cargada:', { provider: settings.provider, model: settings.model });

      if (!settings.apiKey) {
        throw new Error('API Key no configurada');
      }

      // 3. Buscar workflows similares
      console.log('🔍 Buscando workflows similares para usar como referencia...');
      const similarWorkflows = await this.searchAgent.searchSimilarWorkflows(finalPrompt);
      const curatedExamples = this.searchAgent.getCuratedExamples();
      const allExamples = [...similarWorkflows, ...curatedExamples];
      
      console.log(`📚 Encontrados ${allExamples.length} workflows de referencia`);

      // 4. Preparar prompt OPTIMIZADO Y COMPACTO para Gemini masivo
      const workflow = this.getCurrentWorkflowJSON();
      const exampleContext = allExamples.length > 0 
        ? `\nEJEMPLO COMPACTO:\n${JSON.stringify(allExamples[0].workflow, null, 0).slice(0, 500)}...`
        : '';

      const enhancedPrompt = `ARQUITECTO n8n: Crear workflow MASIVO para: ${finalPrompt}

${exampleContext}

REGLAS CRÍTICAS:
- WORKFLOWS MASIVOS permitidos - Sin límites de nodos
- SOLO tipos válidos (webhook,cron,googleSheets,slack,etc)
- IDs únicos, posiciones [x,y]  
- POSICIÓN OBLIGATORIA: Cada nodo DEBE tener position:[x,y]
- Parámetros completos para producción
- Credenciales si necesario

🚨 CONEXIONES OBLIGATORIAS - REGLAS CRÍTICAS:
- CONEXIONES SIEMPRE PRESENTES: El objeto "connections" NUNCA debe estar vacío
- FLUJO LÓGICO OBLIGATORIO: Trigger → Procesador → Output (mínimo)
- CONEXIONES COMPLETAS: Cada nodo (excepto outputs finales) DEBE tener al menos una conexión de salida
- VALIDACIÓN INTERNA: Asegurar que todas las conexiones referencien nodos existentes
- ESTRUCTURA RIGUROSA: {"NodeName":{"main":[[{"node":"NextName","type":"main","index":0}]]}}

ESTRUCTURA JSON MASIVA:
{
  "nodes": [{"id":"uuid","name":"Nombre Descriptivo del Nodo","type":"n8n-nodes-base.webhook","position":[x,y],"parameters":{...},"credentials":{...}}],
  "connections": {"Nombre Descriptivo del Nodo":{"main":[[{"node":"Nombre Descriptivo del Siguiente Nodo","type":"main","index":0}]]}},
  "settings": {}
}

⚠️ REGLAS CRÍTICAS PARA CONEXIONES:
- CONEXIONES DEBEN usar "name" de nodos, NO "id"
- Cada conexión DEBE referenciar el "name" exacto del nodo destino
- Estructura: "connections": {"Nombre Nodo Origen": {"main": [{"node": "Nombre Nodo Destino"}]}}
- Nombres deben coincidir EXACTAMENTE con los definidos en "nodes"

OUTPUT: JSON masivo válido completo con conexiones funcionales.`;

      // 5. Llamar a Gemini con configuración masiva
      console.log('🤖 Llamando a', settings.provider, 'con configuración masiva');
      const response = await this.callLLMV2({
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.model,
        prompt: enhancedPrompt
      });

      // 6. Procesar respuesta masiva
      const match = response.match(/```json[\s\S]*?```|\{[\s\S]*\}/);
      const jsonText = match ? match[0].replace(/```json|```/g, '') : response;

      console.log('✅ Respuesta masiva procesada, validando...');

      // 7. Validar e importar workflow masivo
      const importResult = await this.importWorkflowJSON(jsonText);
      
      if (importResult.ok) {
        // 8. Guardar resultado
        const filename = `workflow-masivo-gemini-${Date.now()}.json`;
        
        // Crear directorio generated-workflows si no existe
        const workflowDir = path.join(process.cwd(), 'generated-workflows');
        if (!fs.existsSync(workflowDir)) {
          fs.mkdirSync(workflowDir, { recursive: true });
        }
        
        const fullPath = path.join(workflowDir, filename);
        fs.writeFileSync(fullPath, this.currentWorkflow);
        
        console.log(`🎉 Workflow MASIVO generado: ${fullPath}`);
        
        // Parsear para mostrar estadísticas
        const parsed = JSON.parse(this.currentWorkflow);
        console.log(`📊 Nodos: ${parsed.nodes?.length || 0}`);
        console.log(`🔗 Conexiones: ${Object.keys(parsed.connections || {}).length}`);
        
        if (parsed.nodes) {
          console.log('\n📋 Nodos generados:');
          parsed.nodes.forEach((node, i) => {
            console.log(`  ${i + 1}. ${node.name} (${node.type})`);
          });
        }

        return {
          success: true,
          filename: fullPath,
          workflow: parsed,
          examples: allExamples,
          message: `Workflow MASIVO generado usando ${allExamples.length} workflows reales como referencia`
        };
      } else {
        throw new Error(importResult.error);
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MÉTODO PRINCIPAL PARA PROCESAR PROMPTS DE USUARIO - PRODUCCIÓN
  async processUserPrompt(prompt) {
    try {
      console.log(`🚀 Procesando prompt del usuario: ${prompt}`);

      // 1. Mejora del prompt
      const finalPrompt = await this.enhanceUserPrompt(prompt);

      // 2. Obtener configuración
      console.log('⚙️ Configuración cargada:', `{ provider: '${process.env.OPENAI_PROVIDER}', model: '${process.env.OPENAI_MODEL}' }`);
      const settings = await this.getSettings();

      if (!settings.apiKey) {
        throw new Error('API Key no configurada');
      }

      // 3. Buscar workflows similares
      console.log('🔍 Buscando workflows similares para usar como referencia...');
      console.log(`🔍 Searching for workflows similar to: "${finalPrompt}"`);
      console.log('📁 Searching local workflows database...');
      
      const searchResults = await this.searchAgent.searchSimilarWorkflows(finalPrompt);
      console.log(`🎯 BÚSQUEDA COMPLETADA: ${searchResults.length} workflows candidatos encontrados`);
      
      // Análisis detallado de resultados
      if (searchResults.length > 0) {
        console.log('📋 WORKFLOWS ENCONTRADOS:');
        searchResults.slice(0, 5).forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.title} (Score: ${result.finalScore?.toFixed(3) || result.score.toFixed(3)})`);
          console.log(`     📍 Match: ${result.matchType}, Entidad: ${result.targetEntity || 'N/A'}`);
          if (result.metadata) {
            console.log(`     🏷️ Dominio: ${result.metadata.domain}, Complejidad: ${result.metadata.complexity}`);
          }
        });
        
        // Verificar si encontramos workflows para entidades específicas
        const entitiesFound = [...new Set(searchResults.map(r => r.targetEntity).filter(e => e))];
        if (entitiesFound.length > 0) {
          console.log(`🎯 Workflows específicos encontrados para: ${entitiesFound.join(', ')}`);
        }
      }
      
      const curatedExamples = this.searchAgent.getCuratedExamples();
      const { exampleContext } = this.prepareExampleContext(searchResults, curatedExamples);
      
      // 🆕 LOGGING DETALLADO DE WORKFLOWS ENCONTRADOS
      if (searchResults.length > 0) {
        console.log(`📚 Found ${searchResults.length} matching workflows with advanced search`);
        console.log(`📚 Using curated workflow examples...`);
        console.log(`✅ Total: ${searchResults.length + curatedExamples.length} workflows (${searchResults.length} advanced, ${curatedExamples.length} curated)`);
      } else {
        console.log('📚 Using curated workflow examples...');
      }
      
      console.log(`📚 Total workflows: ${searchResults.length + curatedExamples.length}`);

      // 4. Optimizar prompt si es complejo
      const optimizedPrompt = this.optimizeComplexPrompt(finalPrompt);

      // 5. Preparar prompt completo
      const workflow = this.getCurrentWorkflowJSON();
      const enhancedPrompt = this.buildWorkflowPrompt(optimizedPrompt, exampleContext, workflow);

      // Definir el ejemplo de workflow fuera del template string
      const exampleWorkflow = {
        "nodes": [
          {"id":"trigger-1","name":"Start Webhook","type":"n8n-nodes-base.webhook","position":[100,200],"parameters":{"httpMethod":"POST","path":"automation","responseMode":"onReceived"}},
          {"id":"validate-1","name":"Validate Data","type":"n8n-nodes-base.if","position":[400,200],"parameters":{"conditions":{"conditions":[{"field":"{{ $json.email }}","operation":"isNotEmpty","value":""}]}}},
          {"id":"process-1","name":"Process Data","type":"n8n-nodes-base.set","position":[700,200],"parameters":{"values":[{"name":"processed","value":"{{ $json }}"}]}}
        ],
        "connections": {
          "Start Webhook": {"main": [[{"node": "Validate Data","type": "main","index": 0}]]},
          "Validate Data": {"main": [[{"node": "Process Data","type": "main","index": 0}]]}
        },
        "settings": {"executionOrder": "v1"}
      };

      // Template string para el prompt de la IA
      const promptTemplate = `
REGLAS COMPACTAS OBLIGATORIAS:
=============================
✅ TIPOS VÁLIDOS BÁSICOS: webhook, cron, httpRequest, gmail, slack, telegram, mysql, postgres, if, set, code, googleSheets
✅ AGENTES DE IA: openAi, anthropic, langchain, vectorStore, chromaDb, pinecone, agent, aiMemory, documentLoader
✅ APLICACIONES: executeWorkflow, executeCommand, executePython, dockerExec, workflowManager, fileWatcher, apiCall
✅ FLUI: flui, fluiTrigger, fluiAction, fluiCondition, fluiDatabase, fluiEmail, fluiChat, fluiFile
✅ INFRAESTRUCTURA: docker, kubernetes, awsLambda, awsS3, googleCloudFunctions, azureFunctions, heroku, vercel
✅ PARÁMETROS COMPLETOS: webhook(httpMethod,path), httpRequest(method,url), gmail(to,subject), telegram(chatId,text)
✅ IA PARAMS: openAi(operation,model,prompt), langchain(chainType,input), vectorStore(operation,collection)
✅ ESTRUCTURA: trigger → validación → procesamiento → IA/aplicaciones → notificaciones → manejo errores
✅ CONEXIONES: nombres exactos, sin circulares, branches de error
✅ POSICIÓN OBLIGATORIA: Cada nodo DEBE tener "position":[x,y]. Usar flujo horizontal +400px por nivel, vertical +200px para paralelos

IMPORTANTE POSICIONES: Analiza el flujo lógico y asigna posiciones naturales:
- TRIGGERS: [100, 200] (inicio)
- PROCESAMIENTO: [500, 200] (secuencial) 
- PARALELOS: mismo X, +200Y
- FINALES: [1000+, 200] (hacia derecha)
- DISTRIBUCIÓN NATURAL según conexiones

ESTRUCTURA COMPACTA CON IA Y APLICACIONES:
=========================================
{
  "nodes": [
    {"id":"trigger-1","name":"Start Webhook","type":"n8n-nodes-base.webhook","position":[100,200],"parameters":{"httpMethod":"POST","path":"automation","responseMode":"onReceived"}},
    {"id":"validate-1","name":"Validate Data","type":"n8n-nodes-base.if","position":[500,200],"parameters":{"conditions":{"conditions":[{"field":"{{ $json.message }}","operation":"isNotEmpty","value":""}]}}},
    {"id":"ai-1","name":"Process with AI","type":"n8n-nodes-base.openAi","position":[900,200],"parameters":{"operation":"text","model":"gpt-3.5-turbo","prompt":"{{ $json.message }}"}},
    {"id":"action-1","name":"Execute Action","type":"n8n-nodes-base.executeWorkflow","position":[1300,200],"parameters":{"workflowId":"workflow-123"}}
  ],
  "connections": {
    "Start Webhook": {"main": [[{"node": "Validate Data","type": "main","index": 0}]]},
    "Validate Data": {"main": [[{"node": "Process with AI","type": "main","index": 0}]]},
    "Process with AI": {"main": [[{"node": "Execute Action","type": "main","index": 0}]]}
  },
  "settings": {"executionOrder": "v1"}
}

OUTPUT: JSON válido COMPACTO con POSICIONES OBLIGATORIAS (max 50000 chars) SIN explicaciones.`;

      // 5. Llamar a Gemini con configuración masiva optimizada
      console.log('🤖 Llamando a', settings.provider, 'con configuración masiva optimizada');
      
      // Configuración optimizada usando constantes globales
      const maxTokens = this.isComplexPrompt ? TOKEN_LIMITS.COMPLEX : TOKEN_LIMITS.SIMPLE;
      const temperature = 0.3; // Más determinístico para workflows complejos
      
      console.log(`🎯 Configuración optimizada: maxTokens=${maxTokens}, complex=${this.isComplexPrompt}`);
      
      // Cache key para evitar llamadas duplicadas
      const cacheKey = `${optimizedPrompt}-${maxTokens}`;
      if (this.requestCache.has(cacheKey)) {
        console.log('🚀 Respuesta recuperada del cache');
        return this.requestCache.get(cacheKey);
      }

      // Llamada con manejo de errores y reintentos optimizado
      const self = this; // Preservar contexto de this
      const response = await this.executeWithRetry(
        async () => {
          console.log('🔧 DEBUG: Ejecutando callGeminiMassive...');
          return await self.callGeminiMassive([{ role: 'user', content: finalPrompt }], maxTokens, temperature);
        },
        3,
        cacheKey
      );

      // Procesar la respuesta del LLM
      return await this.processLLMResponse(response, prompt, finalPrompt, searchResults, curatedExamples);
    } catch (error) {
      console.error('❌ Error en processUserPrompt:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Método para procesar respuesta de LLM
  async processLLMResponse(response, prompt, finalPrompt, searchResults = [], curatedExamples = []) {
    try {
      // 6. Procesar respuesta masiva
      console.log('✅ Respuesta masiva procesada, validando...');
      const match = response.match(/```json[\s\S]*?```|\{[\s\S]*\}/);
      const jsonText = match ? match[0].replace(/```json|```/g, '') : response;

      // Estadísticas del JSON masivo antes del parsing
      console.log('🔍 ANÁLISIS JSON MASIVO:');
      console.log(`   📏 Tamaño original: ${response.length.toLocaleString()} chars`);
      console.log(`   📏 Tamaño limpio: ${jsonText.length.toLocaleString()} chars`);
      console.log(`   📄 Líneas: ${jsonText.split('\n').length.toLocaleString()}`);

      // Preview del JSON masivo (primeros y últimos caracteres)
      if (jsonText.length > 2000) {
        console.log(`   👀 Preview inicio: ${jsonText.slice(0, 500)}...`);
        console.log(`   👀 Preview final: ...${jsonText.slice(-500)}`);
      } else {
        console.log(`   👀 JSON completo: ${jsonText.slice(0, 1000)}${jsonText.length > 1000 ? '...' : ''}`);
      }

      // 7. Validar e importar workflow masivo (pasando modelo para JSONRepairAgent)
      const settings = await this.getSettings();
      const geminiModel = this.genAI?.getGenerativeModel({ model: settings.model || "gemini-2.5-flash" });
      let importResult = await this.importWorkflowJSON(jsonText, prompt, geminiModel);
      
      // Si el JSON está corrupto o incompleto, usar JSONRepairAgent V3.0
      if (!importResult.ok) {
        console.warn('⚠️ JSON CORRUPTO DETECTADO. Activando JSON Repair Agent V3.0...');
        console.log(`❌ Error de importación: ${importResult.error}`);
        
        try {
          // 🚀 ACTIVAR JSON REPAIR AGENT V3.0
          const settings = await this.getSettings();
          await this.initializeJSONRepairAgent(settings.apiKey);
          
          console.log('🔧 Iniciando reparación inteligente del JSON...');
          const repairResult = await this.jsonRepairAgent.analyzeJSON(jsonText, finalPrompt.length);
          
          if (repairResult.success && repairResult.data) {
            console.log('✅ JSON REPARADO EXITOSAMENTE por JSON Repair Agent V3.0');
            console.log(`📊 Tipo de reparación: ${repairResult.repairType || 'intelligent_repair'}`);
            console.log(`🔧 Correcciones aplicadas: ${repairResult.corrections || 'multiple'}`);
            
            // Usar el workflow reparado
            if (repairResult.data.workflow) {
              this.currentWorkflow = JSON.stringify(repairResult.data.workflow, null, 2);
              console.log('🎯 Workflow reparado aplicado exitosamente');
              importResult = { ok: true };
            } else if (typeof repairResult.data === 'object') {
              this.currentWorkflow = JSON.stringify(repairResult.data, null, 2);
              console.log('🎯 JSON reparado aplicado exitosamente');
              importResult = { ok: true };
            }
          } else {
            console.warn('⚠️ JSON Repair Agent no pudo reparar el JSON');
            console.log('❌ FALLBACK BLOQUEADO: No se usará sistema de fallback');
            throw new Error('JSON incompleto - fallback bloqueado por configuración de alta robustez');
          }
        } catch (repairError) {
          console.warn(`❌ Error en JSON Repair Agent: ${repairError.message}`);
          console.log('❌ FALLBACK BLOQUEADO: JSON Repair Agent falló');
          throw new Error('JSON Repair Agent no pudo procesar el JSON - sin fallback disponible');
        }
      }
      
      if (importResult.ok) {
        let parsedWorkflow;
        try {
          parsedWorkflow = JSON.parse(this.currentWorkflow); // Obtenemos el JSON validado y reparado
          
          // Validar que parsedWorkflow tiene la estructura correcta
          if (!parsedWorkflow || typeof parsedWorkflow !== 'object') {
            throw new Error('parsedWorkflow no es un objeto válido');
          }
          
          if (!parsedWorkflow.nodes || !Array.isArray(parsedWorkflow.nodes)) {
            throw new Error('parsedWorkflow no tiene un array de nodos válido');
          }
          
          if (parsedWorkflow.nodes.length === 0) {
            throw new Error('parsedWorkflow no tiene nodos');
          }
          
        } catch (parseError) {
          console.error('❌ Error parseando currentWorkflow:', parseError.message);
          console.error('📝 currentWorkflow:', this.currentWorkflow ? this.currentWorkflow.slice(0, 1000) + '...' : 'undefined');
          throw new Error(`Error parseando workflow procesado: ${parseError.message}`);
        }

        // Aquí deberían continuar las validaciones y el retorno de la función
        return {
          success: true,
          workflow: parsedWorkflow,
          message: 'Workflow procesado exitosamente'
        };
      } else {
        throw new Error(`Error importando workflow: ${importResult.error}`);
      }
    } catch (error) {
      console.error('❌ ERROR PROCESANDO RESPUESTA LLM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  } // Cierre de processLLMResponse

    // ===== MÉTODOS AUXILIARES PARA EXTENSOR =====

    // Identificar puntos donde se puede extender el workflow
    identifyExtensionPoints(workflow) {
    const points = [];
    
    // Buscar nodos sin conexiones de salida (nodos finales)
    workflow.nodes.forEach(node => {
      const hasOutgoingConnections = workflow.connections[node.name] && 
                                   workflow.connections[node.name].main && 
                                   workflow.connections[node.name].main.length > 0;
      
      if (!hasOutgoingConnections) {
        points.push({
          nodeName: node.name,
          nodeType: node.type,
          position: node.position || [0, 0],
          reason: 'Nodo final sin conexiones de salida'
        });
      }
    });
    
    // Si no hay nodos finales, usar el último nodo
    if (points.length === 0 && workflow.nodes.length > 0) {
      const lastNode = workflow.nodes[workflow.nodes.length - 1];
      points.push({
        nodeName: lastNode.name,
        nodeType: lastNode.type,
        position: lastNode.position || [0, 0],
        reason: 'Último nodo del workflow'
      });
    }
    
    return points;
  }

  // Generar extensión específica para un punto
  async generateWorkflowExtension(prompt, extensionPoint) {
    try {
      console.log(`🔮 Generando extensión para: ${extensionPoint.nodeName}`);
      
      const response = await this.callLLM({
        provider: 'gemini',
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-2.5-flash',
        prompt: `${prompt}
        
        REQUISITOS ESPECÍFICOS:
        - Conecta desde el nodo "${extensionPoint.nodeName}" 
        - Usa IDs únicos para los nuevos nodos
        - Posiciona los nodos comenzando desde [${extensionPoint.position[0] + 300}, ${extensionPoint.position[1]}]
        - Incluye solo nodos adicionales, NO dupliques "${extensionPoint.nodeName}"
        
        FORMATO JSON:
        {
          "nodes": [nodos adicionales],
          "connections": {conexiones adicionales},
          "extensionFrom": "${extensionPoint.nodeName}"
        }`
      });
      
      if (response && response.length > 100) {
        const cleanJson = this.extractAndCleanJSON(response);
        return JSON.parse(cleanJson);
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error generando extensión:`, error.message);
      return null;
    }
  }

  // Combinar dos workflows en uno solo
  mergeWorkflows(baseWorkflow, extension, extensionPoint) {
    console.log('🔗 Combinando workflows...');
    
    const merged = {
      nodes: [...baseWorkflow.nodes],
      connections: { ...baseWorkflow.connections },
      settings: baseWorkflow.settings || {},
      meta: baseWorkflow.meta || {}
    };
    
    // Añadir nodos de la extensión
    if (extension.nodes) {
      extension.nodes.forEach(node => {
        // Verificar que el nodo no exista ya
        const exists = merged.nodes.some(existing => existing.name === node.name);
        if (!exists) {
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
    
    // Conectar el punto de extensión con el primer nodo de la extensión
    if (extension.nodes && extension.nodes.length > 0) {
      const firstExtensionNode = extension.nodes[0];
      
      if (!merged.connections[extensionPoint.nodeName]) {
        merged.connections[extensionPoint.nodeName] = { main: [] };
      }
      
      if (!merged.connections[extensionPoint.nodeName].main) {
        merged.connections[extensionPoint.nodeName].main = [];
      }
      
      merged.connections[extensionPoint.nodeName].main.push({
        node: firstExtensionNode.name,
        type: 'main',
        index: 0
      });
    }
    
    return merged;
  }

  // Validar y reparar workflow extendido
  validateAndRepairExtendedWorkflow(workflow) {
    console.log('🔧 Validando workflow extendido...');
    
    if (!workflow.nodes || !workflow.connections) {
      throw new Error('Workflow inválido: faltan nodos o conexiones');
    }

    const repairedWorkflow = { ...workflow };
    const nodeNames = workflow.nodes.map(n => n.name);
    
    // Limpiar conexiones a nodos que no existen
    Object.keys(repairedWorkflow.connections).forEach(sourceName => {
      const sourceExists = nodeNames.includes(sourceName);
      if (!sourceExists) {
        delete repairedWorkflow.connections[sourceName];
      }
    });
    
    console.log('✅ Workflow extendido validado y reparado');
    return repairedWorkflow;
  }

  // Extraer y limpiar JSON de respuesta de IA
  extractAndCleanJSON(text) {
    if (!text || typeof text !== 'string') {
      return '{}';
    }

    // Buscar JSON válido en el texto
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return '{}';
    }

    let jsonText = jsonMatch[0];

    // Limpiar caracteres problemáticos
    jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    // Asegurar que sea JSON válido
    try {
      JSON.parse(jsonText);
      return jsonText;
    } catch (e) {
      console.warn('JSON inválido, intentando limpiar...');
      // Intentar limpiar comillas simples, etc.
      jsonText = jsonText.replace(/'/g, '"');
      jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');

      try {
        JSON.parse(jsonText);
        return jsonText;
      } catch (e2) {
        console.error('No se pudo parsear JSON:', e2.message);
        return '{}';
      }
    }
  }


  // MÉTODO PARA LLAMADAS MASIVAS A GEMINI - MODO PRODUCCIÓN
  async callGeminiMassive(messages, maxTokens = 50000, temperature = 1.0) {
    try {
      console.log(`🚀 Llamada masiva a Gemini con ${messages.length} mensaje(s)`);
      
      // Verificar que existe API key
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('❌ GEMINI_API_KEY no configurada en archivo .env');
      }
      
      console.log('� DEBUG: API Key existe:', !!process.env.GEMINI_API_KEY);
      console.log('🔑 DEBUG: API Key longitud:', process.env.GEMINI_API_KEY.length);
      console.log('🔑 DEBUG: API Key inicia con AIza:', process.env.GEMINI_API_KEY.startsWith('AIza'));
      console.log('🔑 DEBUG: API Key valor (primeros 10):', process.env.GEMINI_API_KEY.substring(0, 10));
      
      console.log('�🔮 Usando Gemini 2.5 Flash real de Google con salida masiva');
      const fetchModule = await getFetch();
      
      const response = await fetchModule(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            parts: [{
              text: typeof msg === 'string' ? msg : (msg.content || msg.text || JSON.stringify(msg))
            }]
          })),
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxTokens,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ Error en API de Gemini:`, response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      // Validaciones robustas para evitar errores de acceso a propiedades undefined
      if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
        console.error('❌ Respuesta de Gemini sin candidatos válidos:', data);
        throw new Error('Respuesta inválida de Gemini API: no candidates');
      }
      
      const candidate = data.candidates[0];
      
      // Manejar diferentes estructuras de respuesta de Gemini
      let text = '';
      
      if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
        // Estructura normal
        text = candidate.content.parts[0].text;
      } else if (candidate.content && typeof candidate.content === 'string') {
        // Contenido directo como string
        text = candidate.content;
      } else if (candidate.text) {
        // Texto directo en el candidato
        text = candidate.text;
      } else {
        // Caso especial: respuesta truncada por MAX_TOKENS sin contenido válido
        console.warn('⚠️ Respuesta de Gemini truncada por MAX_TOKENS sin contenido válido');
        console.warn('📊 Información del candidato:', JSON.stringify(candidate, null, 2));
        
        if (candidate.finishReason === 'MAX_TOKENS') {
          throw new Error('Respuesta truncada por límite de tokens - reducir complejidad del prompt');
        } else {
          throw new Error('Respuesta inválida de Gemini API: no content available');
        }
      }
      
      if (typeof text !== 'string' || text.trim().length === 0) {
        console.error('❌ Texto extraído de Gemini inválido:', { text, candidate });
        throw new Error('Respuesta inválida de Gemini API: no valid text content');
      }
      if (typeof text !== 'string') {
        console.error('❌ Respuesta de Gemini sin texto válido:', candidate.content.parts[0]);
        throw new Error('Respuesta inválida de Gemini API: no valid text');
      }
      
      // Estadísticas detalladas de la respuesta masiva
      console.log('📊 GEMINI MASIVO - Respuesta recibida:');
      console.log(`   📏 Longitud: ${text.length.toLocaleString()} caracteres`);
      console.log(`   📄 Líneas: ${text.split('\n').length.toLocaleString()}`);
      console.log(`   🏁 Finish Reason: ${candidate.finishReason || 'unknown'}`);
      console.log(`   ⚡ Tokens estimados: ${Math.ceil(text.length / 4).toLocaleString()}`);
      
      return text;
      
    } catch (error) {
      console.error(`❌ Error en callGeminiMassive:`, error.message);
      throw error;
    }
  }

  // Método para validar estructura JSON y detectar errores comunes
  validateWorkflowStructure(parsedWorkflow) {
    console.log('🔍 Validando estructura del workflow...');
    
    const errors = [];
    const warnings = [];
    
    // 1. Validar estructura básica
    if (!parsedWorkflow.nodes || !Array.isArray(parsedWorkflow.nodes)) {
      errors.push('Estructura "nodes" faltante o inválida');
      return { isValid: false, errors, warnings };
    }
    
    if (!parsedWorkflow.connections || typeof parsedWorkflow.connections !== 'object') {
      errors.push('Estructura "connections" faltante o inválida');
      return { isValid: false, errors, warnings };
    }
    
    // 2. Validar nodos
    const nodeNames = new Set();
    const nodeIds = new Set();
    
    parsedWorkflow.nodes.forEach((node, index) => {
      // IDs y nombres únicos
      if (!node.id) {
        errors.push(`Nodo ${index} sin ID`);
      } else if (nodeIds.has(String(node.id))) {
        errors.push(`ID duplicado: ${node.id}`);
      } else {
        nodeIds.add(String(node.id)); // Convertir a string para consistencia
      }
      
      if (!node.name) {
        errors.push(`Nodo ${index} sin nombre`);
      } else if (nodeNames.has(node.name)) {
        errors.push(`Nombre duplicado: ${node.name}`);
      } else {
        nodeNames.add(node.name);
      }
      
      // Tipo de nodo válido
      if (!node.type || !node.type.startsWith('n8n-nodes-base.')) {
        errors.push(`Tipo de nodo inválido en ${node.name}: ${node.type}`);
      }
      
      // Posición válida
      if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
        warnings.push(`Posición inválida en nodo ${node.name}`);
      }
      
      // Parámetros según tipo
      this.validateNodeParameters(node, errors, warnings);
    });
    
    // 3. Validar conexiones (soportar tanto IDs como nombres)
    Object.keys(parsedWorkflow.connections).forEach(sourceName => {
      console.log(`🔍 DEBUG: Validando conexión desde: "${sourceName}"`);
      console.log(`🔍 DEBUG: nodeIds contiene:`, Array.from(nodeIds));
      console.log(`🔍 DEBUG: nodeNames contiene:`, Array.from(nodeNames));
      
      // Verificar que el nodo origen existe (por nombre o ID)
      const sourceExists = nodeNames.has(sourceName) || nodeIds.has(String(sourceName));
      console.log(`🔍 DEBUG: sourceExists = ${sourceExists} (name: ${nodeNames.has(sourceName)}, id: ${nodeIds.has(String(sourceName))})`);
      
      if (!sourceExists) {
        errors.push(`Conexión desde nodo inexistente: "${sourceName}"`);
        return;
      }
      
      const connection = parsedWorkflow.connections[sourceName];
      if (connection.main && Array.isArray(connection.main)) {
        connection.main.forEach((outputArray, outputIndex) => {
          if (Array.isArray(outputArray)) {
            outputArray.forEach((target, targetIndex) => {
              // Verificar que el nodo destino existe (por nombre o ID)
              const targetExists = nodeNames.has(target.node) || nodeIds.has(String(target.node));
              if (!targetExists) {
                errors.push(`Conexión hacia nodo inexistente: "${sourceName}" -> "${target.node}"`);
              }
              
              // Verificar estructura de la conexión
              if (!target.type || !Number.isInteger(target.index)) {
                warnings.push(`Estructura de conexión incompleta: ${sourceName}[${outputIndex}][${targetIndex}]`);
              }
            });
          }
        });
      }
    });
    
    // 4. Detectar conexiones circulares
    const circularPaths = this.detectCircularConnections(parsedWorkflow);
    if (circularPaths.length > 0) {
      errors.push(`Conexiones circulares detectadas: ${circularPaths.join(', ')}`);
    }
    
    // 5. Verificar nodos huérfanos (sin conexiones entrantes, excepto triggers)
    const orphanNodes = this.findOrphanNodes(parsedWorkflow, nodeNames);
    if (orphanNodes.length > 0) {
      warnings.push(`Nodos posiblemente huérfanos: ${orphanNodes.join(', ')}`);
    }
    
    // 6. VALIDACIÓN ADICIONAL 1: Verificar formato de datos y tipos
    parsedWorkflow.nodes.forEach(node => {
      if (node.parameters) {
        // Validar URLs 
        if (node.parameters.url && typeof node.parameters.url === 'string') {
          const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
          if (!urlRegex.test(node.parameters.url)) {
            warnings.push(`URL con formato inválido en ${node.name}: ${node.parameters.url}`);
          }
        }
        
        // Validar emails
        if (node.parameters.to && typeof node.parameters.to === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(node.parameters.to)) {
            warnings.push(`Email con formato inválido en ${node.name}: ${node.parameters.to}`);
          }
        }
        
        // Validar expresiones cron
        if (node.parameters.cronExpression && typeof node.parameters.cronExpression === 'string') {
          const cronParts = node.parameters.cronExpression.split(' ');
          if (cronParts.length < 5 || cronParts.length > 6) {
            errors.push(`Expresión cron inválida en ${node.name}: ${node.parameters.cronExpression}`);
          }
        }
      }
    });
    
    // 7. VALIDACIÓN ADICIONAL 2: Verificar rangos numéricos válidos
    parsedWorkflow.nodes.forEach(node => {
      if (node.parameters) {
        // Validar timeouts (deben ser positivos y razonables)
        if (node.parameters.timeout && typeof node.parameters.timeout === 'number') {
          if (node.parameters.timeout < 0 || node.parameters.timeout > 300000) { // max 5 minutos
            warnings.push(`Timeout fuera de rango en ${node.name}: ${node.parameters.timeout}ms (debe estar entre 0-300000)`);
          }
        }
        
        // Validar wait amounts
        if (node.type === 'n8n-nodes-base.wait' && node.parameters.amount) {
          const amount = parseInt(node.parameters.amount);
          if (isNaN(amount) || amount < 1 || amount > 3600) {
            warnings.push(`Cantidad de espera inválida en ${node.name}: ${node.parameters.amount} (debe estar entre 1-3600)`);
          }
        }
        
        // Validar límites de batch size
        if (node.parameters.batchSize && typeof node.parameters.batchSize === 'number') {
          if (node.parameters.batchSize < 1 || node.parameters.batchSize > 1000) {
            warnings.push(`Tamaño de batch fuera de rango en ${node.name}: ${node.parameters.batchSize} (debe estar entre 1-1000)`);
          }
        }
      }
    });
    
    // 8. VALIDACIÓN ADICIONAL 3: Verificar consistencia en credenciales
    const credentialTypes = new Set();
    parsedWorkflow.nodes.forEach(node => {
      if (node.credentials) {
        Object.keys(node.credentials).forEach(credType => {
          credentialTypes.add(credType);
        });
      }
      
      // Verificar que nodos que requieren credenciales las tengan
      const needsCredentials = {
        'n8n-nodes-base.gmail': 'gmailApi',
        'n8n-nodes-base.googleSheets': 'googleSheetsApi',
        'n8n-nodes-base.slack': 'slackApi',
        'n8n-nodes-base.telegram': 'telegramApi',
        'n8n-nodes-base.mysql': 'mysql',
        'n8n-nodes-base.postgres': 'postgres'
      };
      
      const requiredCred = needsCredentials[node.type];
      if (requiredCred && (!node.credentials || !node.credentials[requiredCred])) {
        warnings.push(`Nodo ${node.name} requiere credenciales de tipo ${requiredCred}`);
      }
    });
    
    // 9. VALIDACIÓN ADICIONAL 4: Verificar estado del sistema y compatibilidad
    const nodeTypeCounts = {};
    parsedWorkflow.nodes.forEach(node => {
      nodeTypeCounts[node.type] = (nodeTypeCounts[node.type] || 0) + 1;
    });
    
    // Advertir sobre demasiados triggers
    const triggerTypes = ['n8n-nodes-base.webhook', 'n8n-nodes-base.cron', 'n8n-nodes-base.manualTrigger'];
    const triggerCount = triggerTypes.reduce((count, type) => count + (nodeTypeCounts[type] || 0), 0);
    
    if (triggerCount > 3) {
      warnings.push(`Demasiados triggers (${triggerCount}). Considera simplificar el workflow.`);
    }
    
    if (triggerCount === 0) {
      warnings.push('Workflow sin triggers. Añade al menos un trigger para activar la ejecución.');
    }
    
    // Verificar nodos de output
    const outputTypes = ['n8n-nodes-base.emailSend', 'n8n-nodes-base.slack', 'n8n-nodes-base.telegram'];
    const outputCount = outputTypes.reduce((count, type) => count + (nodeTypeCounts[type] || 0), 0);
    
    if (outputCount === 0 && parsedWorkflow.nodes.length > 1) {
      warnings.push('Workflow sin nodos de salida. Considera añadir acciones que produzcan resultados.');
    }
    
    // 10. VALIDACIÓN ADICIONAL 5: Verificar complejidad y rendimiento
    const totalNodes = parsedWorkflow.nodes.length;
    const totalConnections = Object.keys(parsedWorkflow.connections).length;
    
    if (totalNodes > 50) {
      warnings.push(`Workflow muy complejo (${totalNodes} nodos). Considera dividirlo en sub-workflows más pequeños.`);
    }
    
    if (totalConnections > totalNodes * 2) {
      warnings.push(`Demasiadas conexiones (${totalConnections}). El workflow puede ser difícil de mantener.`);
    }
    
    // Verificar profundidad del workflow
    const depths = this.calculateNodeDepths(parsedWorkflow);
    const maxDepth = Math.max(...Object.values(depths));
    
    if (maxDepth > 10) {
      warnings.push(`Workflow muy profundo (${maxDepth} niveles). Considera optimizar la estructura.`);
    }
    
    // Detectar nodos potencialmente lentos en secuencia
    const slowNodes = ['n8n-nodes-base.httpRequest', 'n8n-nodes-base.mysql', 'n8n-nodes-base.postgres', 'n8n-nodes-base.wait'];
    let consecutiveSlowNodes = 0;
    let maxConsecutive = 0;
    
    parsedWorkflow.nodes.forEach(node => {
      if (slowNodes.includes(node.type)) {
        consecutiveSlowNodes++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveSlowNodes);
      } else {
        consecutiveSlowNodes = 0;
      }
    });
    
    if (maxConsecutive > 3) {
      warnings.push(`Demasiados nodos lentos consecutivos (${maxConsecutive}). Considera paralelización.`);
    }
    
    console.log(`📊 Validación completada: ${errors.length} errores, ${warnings.length} advertencias`);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      nodeCount: parsedWorkflow.nodes.length,
      connectionCount: Object.keys(parsedWorkflow.connections).length
    };
  }

  // Calcular la profundidad de cada nodo en el workflow
  calculateNodeDepths(workflow) {
    const depths = {};
    const connections = workflow.connections;
    
    // Inicializar todos los nodos con profundidad 0
    workflow.nodes.forEach(node => {
      depths[node.name] = 0;
    });
    
    // Encontrar nodos trigger (sin conexiones entrantes)
    const triggerNodes = workflow.nodes.filter(node => {
      const hasIncoming = Object.values(connections).some(conn => {
        if (conn.main && Array.isArray(conn.main)) {
          return conn.main.some(outputArray => 
            Array.isArray(outputArray) && outputArray.some(target => target.node === node.name)
          );
        }
        return false;
      });
      return !hasIncoming;
    });
    
    // BFS para calcular profundidades
    const queue = triggerNodes.map(node => ({ name: node.name, depth: 0 }));
    const visited = new Set();
    
    while (queue.length > 0) {
      const { name, depth } = queue.shift();
      
      if (visited.has(name)) continue;
      visited.add(name);
      
      depths[name] = Math.max(depths[name], depth);
      
      // Agregar nodos conectados
      if (connections[name] && connections[name].main) {
        connections[name].main.forEach(outputArray => {
          if (Array.isArray(outputArray)) {
            outputArray.forEach(target => {
              if (!visited.has(target.node)) {
                queue.push({ name: target.node, depth: depth + 1 });
              }
            });
          }
        });
      }
    }
    
    return depths;
  }

  // Validar parámetros específicos por tipo de nodo
  validateNodeParameters(node, errors, warnings) {
    const requiredParams = {
      'n8n-nodes-base.webhook': ['httpMethod', 'path'],
      'n8n-nodes-base.httpRequest': ['method', 'url'],
      'n8n-nodes-base.gmail': ['operation'],
      'n8n-nodes-base.slack': ['channel', 'text'],
      'n8n-nodes-base.telegram': ['chatId', 'text'],
      'n8n-nodes-base.mysql': ['operation'],
      'n8n-nodes-base.postgres': ['operation'],
      'n8n-nodes-base.if': ['conditions'],
      'n8n-nodes-base.set': ['values'],
      'n8n-nodes-base.googleSheets': ['operation'],
      'n8n-nodes-base.woocommerce': ['operation'],
      'n8n-nodes-base.code': ['jsCode'],
      'n8n-nodes-base.function': ['functionCode'],
      'n8n-nodes-base.switch': ['rules'],
      'n8n-nodes-base.merge': ['mode'],
      'n8n-nodes-base.wait': ['amount', 'unit'],
      
      // 🤖 PARÁMETROS REQUERIDOS PARA AGENTES DE IA
      'n8n-nodes-base.agent': ['agentType', 'systemPrompt'],
      'n8n-nodes-base.openAi': ['operation', 'model'],
      'n8n-nodes-base.anthropic': ['model', 'prompt'],
      'n8n-nodes-base.llamaIndex': ['indexType', 'query'],
      'n8n-nodes-base.langchain': ['chainType', 'input'],
      'n8n-nodes-base.vectorStore': ['operation', 'collection'],
      'n8n-nodes-base.chromaDb': ['collection', 'operation'],
      'n8n-nodes-base.pinecone': ['index', 'operation'],
      'n8n-nodes-base.weaviate': ['className', 'operation'],
      'n8n-nodes-base.qdrant': ['collection', 'operation'],
      'n8n-nodes-base.milvus': ['collection', 'operation'],
      'n8n-nodes-base.aiMemory': ['memoryType', 'sessionId'],
      'n8n-nodes-base.conversationChain': ['llm', 'memory'],
      'n8n-nodes-base.chatMemoryBuffer': ['sessionId'],
      'n8n-nodes-base.documentLoader': ['source', 'type'],
      'n8n-nodes-base.textSplitter': ['chunkSize', 'chunkOverlap'],
      'n8n-nodes-base.embeddings': ['text', 'model'],
      'n8n-nodes-base.retriever': ['query', 'k'],
      'n8n-nodes-base.outputParser': ['format'],
      'n8n-nodes-base.promptTemplate': ['template', 'variables'],

      // 📱 PARÁMETROS REQUERIDOS PARA APLICACIONES
      'n8n-nodes-base.executeWorkflow': ['workflowId'],
      'n8n-nodes-base.executeCommand': ['command'],
      'n8n-nodes-base.executeSSH': ['command', 'host'],
      'n8n-nodes-base.executePython': ['code'],
      'n8n-nodes-base.executeNode': ['nodeType'],
      'n8n-nodes-base.executeBash': ['script'],
      'n8n-nodes-base.executePowershell': ['script'],
      'n8n-nodes-base.apiCall': ['url', 'method'],
      'n8n-nodes-base.webhookResponse': ['statusCode'],
      'n8n-nodes-base.scheduleWorkflow': ['schedule'],
      'n8n-nodes-base.workflowManager': ['action', 'workflowId'],
      'n8n-nodes-base.processManager': ['action', 'processId'],
      'n8n-nodes-base.fileWatcher': ['path'],
      'n8n-nodes-base.directoryWatcher': ['directory'],
      'n8n-nodes-base.systemMonitor': ['metric'],
      'n8n-nodes-base.serviceManager': ['service', 'action'],
      'n8n-nodes-base.dockerExec': ['containerId', 'command'],
      'n8n-nodes-base.windowsService': ['service', 'action'],
      'n8n-nodes-base.macosApp': ['application', 'action'],
      'n8n-nodes-base.linuxDaemon': ['service', 'action'],

      // 🌊 PARÁMETROS REQUERIDOS PARA FLUI
      'n8n-nodes-base.flui': ['fluiAction'],
      'n8n-nodes-base.fluiTrigger': ['triggerType'],
      'n8n-nodes-base.fluiAction': ['actionType'],
      'n8n-nodes-base.fluiCondition': ['condition'],
      'n8n-nodes-base.fluiLoop': ['loopType', 'iterations'],
      'n8n-nodes-base.fluiDelay': ['delay'],
      'n8n-nodes-base.fluiSchedule': ['schedule'],
      'n8n-nodes-base.fluiWebhook': ['url'],
      'n8n-nodes-base.fluiDatabase': ['operation', 'table'],
      'n8n-nodes-base.fluiEmail': ['to', 'subject'],
      'n8n-nodes-base.fluiSms': ['phoneNumber', 'message'],
      'n8n-nodes-base.fluiChat': ['platform', 'message'],
      'n8n-nodes-base.fluiFile': ['operation', 'filePath'],
      'n8n-nodes-base.fluiImage': ['operation'],
      'n8n-nodes-base.fluiAudio': ['operation'],
      'n8n-nodes-base.fluiVideo': ['operation'],
      'n8n-nodes-base.fluiPdf': ['operation'],
      'n8n-nodes-base.fluiSpreadsheet': ['operation'],
      'n8n-nodes-base.fluiCalendar': ['operation'],
      'n8n-nodes-base.fluiForm': ['formId'],
      
      // 🌐 PARÁMETROS REQUERIDOS PARA CONTENEDORES E INFRAESTRUCTURA
      'n8n-nodes-base.docker': ['image', 'operation'],
      'n8n-nodes-base.kubernetes': ['resource', 'operation'],
      'n8n-nodes-base.awsLambda': ['functionName', 'operation'],
      'n8n-nodes-base.awsS3': ['bucket', 'operation'],
      'n8n-nodes-base.googleCloudFunctions': ['functionName', 'operation'],
      'n8n-nodes-base.azureFunctions': ['functionName', 'operation'],
      'n8n-nodes-base.heroku': ['app', 'operation'],
      'n8n-nodes-base.vercel': ['project', 'operation'],
      'n8n-nodes-base.netlify': ['site', 'operation']
    };

    const validOperations = {
      'n8n-nodes-base.gmail': ['send', 'get', 'getAll', 'reply', 'sendAndWait'],
      'n8n-nodes-base.googleSheets': ['append', 'read', 'update', 'clear', 'delete', 'getAll'],
      'n8n-nodes-base.mysql': ['select', 'insert', 'update', 'delete', 'executeQuery'],
      'n8n-nodes-base.postgres': ['select', 'insert', 'update', 'delete', 'executeQuery'],
      'n8n-nodes-base.woocommerce': ['get', 'getAll', 'create', 'update', 'delete'],
      'n8n-nodes-base.if': ['greaterEqual', 'lessEqual', 'equal', 'notEqual', 'contains', 'notContains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
      
      // 🤖 OPERACIONES VÁLIDAS PARA AGENTES DE IA
      'n8n-nodes-base.openAi': ['text', 'image', 'audio', 'embedding', 'moderation', 'vision'],
      'n8n-nodes-base.anthropic': ['generate', 'complete', 'chat'],
      'n8n-nodes-base.langchain': ['chain', 'agent', 'memory', 'retrieval'],
      'n8n-nodes-base.vectorStore': ['upsert', 'query', 'delete', 'describe'],
      'n8n-nodes-base.chromaDb': ['add', 'query', 'update', 'delete', 'peek'],
      'n8n-nodes-base.pinecone': ['upsert', 'query', 'delete', 'fetch', 'update'],
      'n8n-nodes-base.weaviate': ['create', 'get', 'update', 'delete', 'query'],
      'n8n-nodes-base.qdrant': ['upsert', 'search', 'retrieve', 'delete'],
      'n8n-nodes-base.aiMemory': ['store', 'retrieve', 'update', 'clear'],
      'n8n-nodes-base.documentLoader': ['load', 'parse', 'split', 'embed'],
      'n8n-nodes-base.textSplitter': ['split', 'chunk', 'merge'],
      
      // 📱 OPERACIONES VÁLIDAS PARA APLICACIONES
      'n8n-nodes-base.executeWorkflow': ['run', 'trigger', 'schedule'],
      'n8n-nodes-base.executeCommand': ['run', 'exec', 'shell'],
      'n8n-nodes-base.executePython': ['run', 'exec', 'import'],
      'n8n-nodes-base.dockerExec': ['exec', 'run', 'stop', 'start'],
      'n8n-nodes-base.workflowManager': ['start', 'stop', 'pause', 'resume'],
      'n8n-nodes-base.fileWatcher': ['watch', 'unwatch', 'trigger'],
      
      // 🌊 OPERACIONES VÁLIDAS PARA FLUI
      'n8n-nodes-base.flui': ['trigger', 'action', 'condition', 'loop'],
      'n8n-nodes-base.fluiTrigger': ['webhook', 'schedule', 'manual', 'email'],
      'n8n-nodes-base.fluiAction': ['send', 'create', 'update', 'delete'],
      'n8n-nodes-base.fluiDatabase': ['insert', 'update', 'delete', 'select'],
      'n8n-nodes-base.fluiEmail': ['send', 'receive', 'forward', 'reply'],
      'n8n-nodes-base.fluiFile': ['read', 'write', 'copy', 'move', 'delete'],
      
      // 🌐 OPERACIONES VÁLIDAS PARA CONTENEDORES E INFRAESTRUCTURA
      'n8n-nodes-base.docker': ['run', 'stop', 'start', 'restart', 'remove', 'logs', 'exec', 'inspect'],
      'n8n-nodes-base.kubernetes': ['apply', 'delete', 'get', 'describe', 'logs', 'exec', 'port-forward', 'deploy', 'scale', 'rollout'],
      'n8n-nodes-base.awsLambda': ['invoke', 'create', 'update', 'delete', 'list'],
      'n8n-nodes-base.awsS3': ['upload', 'download', 'delete', 'list', 'copy'],
      'n8n-nodes-base.googleCloudFunctions': ['call', 'deploy', 'delete', 'list'],
      'n8n-nodes-base.azureFunctions': ['trigger', 'create', 'update', 'delete'],
      'n8n-nodes-base.heroku': ['deploy', 'restart', 'scale', 'logs'],
      'n8n-nodes-base.vercel': ['deploy', 'redeploy', 'delete', 'logs']
    };

    const validHttpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    
    const required = requiredParams[node.type];
    if (required && node.parameters) {
      required.forEach(param => {
        if (!(param in node.parameters)) {
          warnings.push(`Parámetro faltante en ${node.name}: ${param}`);
        }
      });

      // Validaciones específicas por tipo
      if (node.type === 'n8n-nodes-base.webhook' && node.parameters.httpMethod) {
        if (!validHttpMethods.includes(node.parameters.httpMethod.toUpperCase())) {
          errors.push(`Método HTTP inválido en ${node.name}: ${node.parameters.httpMethod}`);
        }
      }

      if (node.type === 'n8n-nodes-base.httpRequest' && node.parameters.method) {
        if (!validHttpMethods.includes(node.parameters.method.toUpperCase())) {
          errors.push(`Método HTTP inválido en ${node.name}: ${node.parameters.method}`);
        }
      }

      if (node.type === 'n8n-nodes-base.gmail' && node.parameters.operation) {
        const validOps = validOperations[node.type];
        if (!validOps.includes(node.parameters.operation)) {
          errors.push(`Operación Gmail inválida en ${node.name}: ${node.parameters.operation}. Válidas: ${validOps.join(', ')}`);
        }
      }

      if (node.type === 'n8n-nodes-base.googleSheets' && node.parameters.operation) {
        const validOps = validOperations[node.type];
        if (!validOps.includes(node.parameters.operation)) {
          errors.push(`Operación Google Sheets inválida en ${node.name}: ${node.parameters.operation}. Válidas: ${validOps.join(', ')}`);
        }
      }

      if (node.type === 'n8n-nodes-base.if' && node.parameters.conditions) {
        const conditions = Array.isArray(node.parameters.conditions) ? node.parameters.conditions : [node.parameters.conditions];
        conditions.forEach((condition, idx) => {
          if (condition.operation && !validOperations['n8n-nodes-base.if'].includes(condition.operation)) {
            errors.push(`Operación IF inválida en ${node.name} condición ${idx + 1}: ${condition.operation}. Válidas: ${validOperations['n8n-nodes-base.if'].join(', ')}`);
          }
        });
      }

      // 🤖 VALIDACIONES ESPECÍFICAS PARA AGENTES DE IA
      if (node.type.includes('ai') || node.type.includes('Agent') || node.type.includes('openAi') || 
          node.type.includes('anthropic') || node.type.includes('langchain')) {
        
        // Validar configuración de OpenAI
        if (node.type === 'n8n-nodes-base.openAi' && node.parameters.operation) {
          const validOps = ['chat', 'completion', 'text', 'image', 'audio', 'embedding', 'moderation', 'analyze', 'predict'];
          if (!validOps.includes(node.parameters.operation)) {
            errors.push(`Operación OpenAI inválida en ${node.name}: ${node.parameters.operation}. Válidas: ${validOps.join(', ')}`);
          }
          
          if ((node.parameters.operation === 'text' || node.parameters.operation === 'completion') && !node.parameters.prompt) {
            errors.push(`Prompt requerido para operación de texto en ${node.name}`);
          }
        }

        // Validar Anthropic
        if (node.type === 'n8n-nodes-base.anthropic' && node.parameters.model) {
          const validModels = ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2'];
          if (!validModels.includes(node.parameters.model)) {
            warnings.push(`Modelo Anthropic no reconocido en ${node.name}: ${node.parameters.model}`);
          }
        }

        // Validar LangChain Agent
        if (node.type === 'n8n-nodes-base.langchain-agent' && node.parameters.agentType) {
          const validTypes = ['zero-shot-react', 'react-docstore', 'self-ask-with-search', 'conversational'];
          if (!validTypes.includes(node.parameters.agentType)) {
            errors.push(`Tipo de agente LangChain inválido en ${node.name}: ${node.parameters.agentType}. Válidos: ${validTypes.join(', ')}`);
          }
        }

        // Validar Vector Store
        if (node.type === 'n8n-nodes-base.vectorStore' && node.parameters.operation) {
          const validOps = ['upsert', 'query', 'delete', 'describe'];
          if (!validOps.includes(node.parameters.operation)) {
            errors.push(`Operación Vector Store inválida en ${node.name}: ${node.parameters.operation}. Válidas: ${validOps.join(', ')}`);
          }
        }
      }

      // 📱 VALIDACIONES ESPECÍFICAS PARA APLICACIONES
      if (node.type.includes('execute') || node.type.includes('Application') || node.type.includes('Flui')) {
        
        // Validar Execute Command
        if (node.type === 'n8n-nodes-base.executeCommand' && node.parameters.command) {
          if (node.parameters.command.includes('rm -rf /') || 
              node.parameters.command.includes('format C:') ||
              node.parameters.command.includes('del /Q /S C:\\')) {
            errors.push(`Comando peligroso detectado en ${node.name}: ${node.parameters.command}`);
          }
        }

        // Validar Flui nodes
        if (node.type.includes('flui') && node.parameters.fluiAction) {
          const validActions = ['trigger', 'condition', 'loop', 'delay', 'webhook', 'database'];
          if (!validActions.includes(node.parameters.fluiAction)) {
            warnings.push(`Acción Flui no reconocida en ${node.name}: ${node.parameters.fluiAction}`);
          }
        }

        // Validar Docker Exec
        if (node.type === 'n8n-nodes-base.dockerExec' && !node.parameters.containerId) {
          errors.push(`Container ID requerido para Docker Exec en ${node.name}`);
        }
      }

      // 🌐 VALIDACIONES ESPECÍFICAS PARA CONTENEDORES
      if (node.type.includes('docker') || node.type.includes('kubernetes') || node.type.includes('container')) {
        if (node.type === 'n8n-nodes-base.docker' && node.parameters.image) {
          // Validar formato de imagen Docker
          if (!node.parameters.image.includes(':')) {
            warnings.push(`Se recomienda especificar tag en la imagen Docker de ${node.name} (ej: nginx:latest)`);
          }
        }

        if (node.type === 'n8n-nodes-base.kubernetes' && node.parameters.operation) {
          const validOps = validOperations[node.type];
          if (!validOps.includes(node.parameters.operation)) {
            errors.push(`Operación Kubernetes inválida en ${node.name}: ${node.parameters.operation}. Válidas: ${validOps.join(', ')}`);
          }
        }

        if (node.type === 'n8n-nodes-base.helm' && node.parameters.operation) {
          const validOps = validOperations[node.type];
          if (!validOps.includes(node.parameters.operation)) {
            errors.push(`Operación Helm inválida en ${node.name}: ${node.parameters.operation}. Válidas: ${validOps.join(', ')}`);
          }
        }
      }
    } else if (required) {
      errors.push(`Nodo ${node.name} sin parámetros obligatorios`);
    }
  }

  // Detectar conexiones circulares usando DFS
  detectCircularConnections(workflow) {
    const visited = new Set();
    const recursionStack = new Set();
    const circularPaths = [];
    
    const dfs = (nodeName, path = []) => {
      if (recursionStack.has(nodeName)) {
        const cycleStart = path.indexOf(nodeName);
        if (cycleStart !== -1) {
          circularPaths.push(path.slice(cycleStart).concat([nodeName]).join(' -> '));
        }
        return;
      }
      
      if (visited.has(nodeName)) return;
      
      visited.add(nodeName);
      recursionStack.add(nodeName);
      path.push(nodeName);
      
      const connections = workflow.connections[nodeName];
      if (connections && connections.main) {
        connections.main.forEach(outputArray => {
          if (Array.isArray(outputArray)) {
            outputArray.forEach(target => {
              dfs(target.node, [...path]);
            });
          }
        });
      }
      
      recursionStack.delete(nodeName);
    };
    
    // Iniciar DFS desde todos los nodos
    workflow.nodes.forEach(node => {
      if (!visited.has(node.name)) {
        dfs(node.name);
      }
    });
    
    return circularPaths;
  }

  // Encontrar nodos huérfanos (sin conexiones entrantes)
  findOrphanNodes(workflow, nodeNames) {
    const nodesWithIncoming = new Set();
    
    // Marcar todos los nodos que tienen conexiones entrantes
    Object.values(workflow.connections).forEach(connection => {
      if (connection.main) {
        connection.main.forEach(outputArray => {
          if (Array.isArray(outputArray)) {
            outputArray.forEach(target => {
              nodesWithIncoming.add(target.node);
            });
          }
        });
      }
    });
    
    // Encontrar nodos sin conexiones entrantes (excluyendo triggers comunes)
    const triggerTypes = ['webhook', 'cron', 'manualTrigger', 'interval'];
    const orphans = [];
    
    workflow.nodes.forEach(node => {
      const isTrigger = triggerTypes.some(trigger => node.type.includes(trigger));
      if (!nodesWithIncoming.has(node.name) && !isTrigger) {
        orphans.push(node.name);
      }
    });
    
    return orphans;
  }

  // CALCULAR PROFUNDIDAD MÁXIMA DEL WORKFLOW
  calculateWorkflowDepth(workflow) {
    if (!workflow.nodes || !workflow.connections) {
      return 0;
    }

    const nodeMap = new Map();
    workflow.nodes.forEach(node => nodeMap.set(node.name, node));

    const visited = new Set();
    const depths = new Map();

    // Función recursiva para calcular profundidad
    const calculateDepth = (nodeName, currentDepth = 0) => {
      if (visited.has(nodeName)) {
        return depths.get(nodeName) || 0;
      }

      visited.add(nodeName);
      depths.set(nodeName, currentDepth);

      const connections = workflow.connections[nodeName];
      if (!connections || !connections.main) {
        return currentDepth;
      }

      let maxChildDepth = currentDepth;
      for (const connection of connections.main) {
        for (const target of connection) {
          if (target.node && nodeMap.has(target.node)) {
            const childDepth = calculateDepth(target.node, currentDepth + 1);
            maxChildDepth = Math.max(maxChildDepth, childDepth);
          }
        }
      }

      depths.set(nodeName, maxChildDepth);
      return maxChildDepth;
    };

    // Calcular profundidad para todos los nodos
    let maxDepth = 0;
    for (const node of workflow.nodes) {
      const depth = calculateDepth(node.name);
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  // ===== MÉTODOS AVANZADOS DE VALIDACIÓN Y REPARACIÓN =====

  // Sugerir tipo de nodo similar basado en el tipo inválido
  suggestSimilarNodeType(invalidType) {
    const allValidTypes = Object.values(this.validationSystem.validNodeTypes).flat();

    // Buscar coincidencias por palabras clave
    const invalidWords = invalidType.toLowerCase().split(/[-_.\s]+/);

    for (const validType of allValidTypes) {
      const validWords = validType.toLowerCase().split(/[-_.\s]+/);
      const matches = invalidWords.filter(word =>
        validWords.some(validWord => validWord.includes(word) || word.includes(validWord))
      );

      if (matches.length >= Math.ceil(invalidWords.length / 2)) {
        return validType;
      }
    }

    // Fallback: devolver el tipo más común
    return 'n8n-nodes-base.function';
  }

  // Obtener valores por defecto para parámetros
  getDefaultParameterValue(nodeType, parameter) {
    const defaults = {
      'n8n-nodes-base.webhook': {
        httpMethod: 'POST',
        path: '/webhook',
        responseMode: 'lastNode'
      },
      'n8n-nodes-base.telegram': {
        chatId: '{{ $json.chat_id }}',
        text: 'Mensaje procesado correctamente'
      },
      'n8n-nodes-base.gmail': {
        operation: 'send'
      },
      'n8n-nodes-base.googleSheets': {
        operation: 'append',
        sheetId: '0'
      },
      'n8n-nodes-base.httpRequest': {
        method: 'GET',
        url: 'https://api.example.com'
      },
      'n8n-nodes-base.code': {
        mode: 'runOnceForAllItems'
      },
      'n8n-nodes-base.function': {
        functionCode: 'return items;'
      },
      'n8n-nodes-base.cron': {
        cronExpression: '0 */6 * * *'
      },
      'n8n-nodes-base.if': {
        conditions: [{
          leftValue: '{{ $json.status }}',
          rightValue: 'success',
          operator: 'equal'
        }]
      },
      'n8n-nodes-base.loopOverItems': {
        batchSize: 10
      }
    };

    return defaults[nodeType]?.[parameter];
  }

  // Corrección automática de parámetros
  // Validar compatibilidad entre nodos conectados
  validateNodeCompatibility(sourceNode, targetNode) {
    const compatibilityRules = {
      // Triggers solo pueden conectar a procesadores o acciones
      'n8n-nodes-base.webhook': {
        invalidTargets: ['n8n-nodes-base.cron', 'n8n-nodes-base.scheduleTrigger']
      },
      'n8n-nodes-base.cron': {
        invalidTargets: ['n8n-nodes-base.webhook', 'n8n-nodes-base.telegramTrigger']
      },

      // Outputs no deberían tener conexiones salientes
      'n8n-nodes-base.emailSend': {
        shouldNotHaveOutputs: true
      },
      'n8n-nodes-base.telegram': {
        shouldNotHaveOutputs: true
      },

      // Algunos nodos requieren datos específicos
      'n8n-nodes-base.googleSheets': {
        requiresDataFields: ['spreadsheetId']
      },
      'n8n-nodes-base.googleCalendar': {
        requiresDataFields: ['calendarId']
      }
    };

    const sourceRules = compatibilityRules[sourceNode.type];
    if (sourceRules) {
      if (sourceRules.invalidTargets && sourceRules.invalidTargets.includes(targetNode.type)) {
        return `${sourceNode.type} no debería conectar directamente a ${targetNode.type}`;
      }

      if (sourceRules.shouldNotHaveOutputs) {
        return `${sourceNode.type} es un nodo de salida y no debería tener conexiones salientes`;
      }
    }

    return null; // Compatible
  }

  // Reparar conexiones de workflow inteligentemente
  repairWorkflowConnections(data) {
    if (!data.nodes || !data.connections) return;

    console.log('🔧 REPARANDO CONEXIONES INTELIGENTEMENTE...');

    const nodesByType = this.groupNodesByType(data.nodes);
    const triggerTypes = ['webhook', 'telegramTrigger', 'httpRequest', 'schedule', 'cron', 'manual'];
    const outputTypes = ['telegram', 'gmail', 'slack', 'webhook'];

    // Encontrar nodos de entrada (triggers)
    const triggerNodes = data.nodes.filter(node =>
      triggerTypes.some(trigger => (node.type || '').toLowerCase().includes(trigger.toLowerCase()))
    );

    // Encontrar nodos de salida
    const outputNodes = data.nodes.filter(node =>
      outputTypes.some(output => (node.type || '').toLowerCase().includes(output.toLowerCase()))
    );

    // Encontrar nodos de procesamiento intermedios
    const processingNodes = data.nodes.filter(node =>
      !triggerNodes.includes(node) && !outputNodes.includes(node)
    );

    // Lógica de reparación: asegurar flujo trigger → processing → output
    let repairsMade = 0;

    // 1. Conectar triggers desconectados al primer nodo de procesamiento
    triggerNodes.forEach(triggerNode => {
      if (!data.connections[triggerNode.name] || !data.connections[triggerNode.name].main) {
        const firstProcessingNode = processingNodes[0];
        if (firstProcessingNode) {
          if (!data.connections[triggerNode.name]) {
            data.connections[triggerNode.name] = { main: [[]] };
          }
          data.connections[triggerNode.name].main[0] = [{
            node: firstProcessingNode.name,
            type: 'main',
            index: 0
          }];
          console.log(`🔗 Trigger conectado: ${triggerNode.name} → ${firstProcessingNode.name}`);
          repairsMade++;
        }
      }
    });

    // 2. Conectar nodos de procesamiento en secuencia lógica
    const connectedAsTarget = new Set();
    Object.values(data.connections).forEach(conn => {
      if (conn.main) {
        conn.main.forEach(mainConnArray => {
          if (Array.isArray(mainConnArray)) {
            mainConnArray.forEach(connection => {
              connectedAsTarget.add(connection.node);
            });
          } else if (mainConnArray?.node) {
            connectedAsTarget.add(mainConnArray.node);
          }
        });
      }
    });

    // Encontrar nodos de procesamiento desconectados
    const disconnectedProcessingNodes = processingNodes.filter(node =>
      !connectedAsTarget.has(node.name) &&
      (!data.connections[node.name] || !data.connections[node.name].main?.length)
    );

    // Conectar nodos desconectados al flujo principal
    disconnectedProcessingNodes.forEach(disconnectedNode => {
      // Buscar el último nodo en el flujo para conectarlo
      const lastConnectedNode = this.findLastConnectedNode(data, processingNodes);
      if (lastConnectedNode && lastConnectedNode !== disconnectedNode.name) {
        if (!data.connections[lastConnectedNode]) {
          data.connections[lastConnectedNode] = { main: [[]] };
        }
        if (!data.connections[lastConnectedNode].main[0]) {
          data.connections[lastConnectedNode].main[0] = [];
        }

        data.connections[lastConnectedNode].main[0].push({
          node: disconnectedNode.name,
          type: 'main',
          index: 0
        });
        console.log(`🔗 Nodo de procesamiento conectado: ${lastConnectedNode} → ${disconnectedNode.name}`);
        repairsMade++;
      }
    });

    // 3. Asegurar que hay conexión a nodos de salida
    const lastProcessingNode = this.findLastProcessingNode(data, processingNodes);
    outputNodes.forEach(outputNode => {
      if (!connectedAsTarget.has(outputNode.name) && lastProcessingNode) {
        if (!data.connections[lastProcessingNode]) {
          data.connections[lastProcessingNode] = { main: [[]] };
        }
        if (!data.connections[lastProcessingNode].main[0]) {
          data.connections[lastProcessingNode].main[0] = [];
        }

        // Evitar conexiones duplicadas
        const alreadyConnected = this.safeCheckConnection(data, lastProcessingNode, outputNode.name);

        if (!alreadyConnected) {
          data.connections[lastProcessingNode].main[0].push({
            node: outputNode.name,
            type: 'main',
            index: 0
          });
          console.log(`🔗 Nodo de salida conectado: ${lastProcessingNode} → ${outputNode.name}`);
          repairsMade++;
        }
      }
    });

    console.log(`✅ Reparaciones de conexión completadas: ${repairsMade} conexiones añadidas`);
  }

  // Agrupar nodos por tipo para análisis
  groupNodesByType(nodes) {
    return nodes.reduce((groups, node) => {
      const category = this.categorizeNode(node.type);
      if (!groups[category]) groups[category] = [];
      groups[category].push(node);
      return groups;
    }, {});
  }

  // Categorizar nodo por tipo
  categorizeNode(nodeType) {
    const type = nodeType.toLowerCase();

    if (type.includes('trigger') || type.includes('webhook') || type.includes('schedule') || type.includes('cron')) {
      return 'trigger';
    }
    if (type.includes('telegram') || type.includes('gmail') || type.includes('slack') || type.includes('discord')) {
      return 'communication';
    }
    if (type.includes('openai') || type.includes('anthropic') || type.includes('gemini') || type.includes('ai')) {
      return 'ai';
    }
    if (type.includes('calendar') || type.includes('sheets') || type.includes('drive')) {
      return 'google';
    }
    if (type.includes('set') || type.includes('code') || type.includes('function')) {
      return 'processing';
    }
    if (type.includes('if') || type.includes('switch') || type.includes('merge')) {
      return 'logic';
    }

    return 'general';
  }

  // Encontrar el último nodo conectado en el flujo
  findLastConnectedNode(data, processingNodes) {
    // Buscar un nodo que tenga conexiones salientes
    for (let i = processingNodes.length - 1; i >= 0; i--) {
      const node = processingNodes[i];
      if (data.connections[node.name]?.main?.length > 0) {
        return node.name;
      }
    }
    // Si no hay ninguno con conexiones salientes, usar el último nodo
    return processingNodes.length > 0 ? processingNodes[processingNodes.length - 1].name : null;
  }

  // Encontrar el último nodo de procesamiento que debe conectarse a outputs
  findLastProcessingNode(data, processingNodes) {
    // Buscar nodos que no tengan conexiones salientes o que tengan pocas
    const candidateNodes = processingNodes.filter(node => {
      const connections = data.connections[node.name]?.main?.[0] || [];
      return connections.length < 2; // Nodos que pueden tener más conexiones
    });

    return candidateNodes.length > 0 ? candidateNodes[candidateNodes.length - 1].name :
           (processingNodes.length > 0 ? processingNodes[processingNodes.length - 1].name : null);
  }

  // ===== MÉTODOS DE SEGURIDAD Y CUMPLIMIENTO =====

  // Validar seguridad del workflow
  validateWorkflowSecurity(workflow) {
    const result = { warnings: [] };

    for (const node of workflow.nodes) {
      if (this.validationSystem.connectionValidations.security.requiresAuth.includes(node.type) && !node.credentials) {
        result.warnings.push(`Node "${node.name}" requires authentication but has no credentials configured`);
      }
    }

    return result;
  }

  // ===== MÉTODOS DE ANÁLISIS Y OPTIMIZACIÓN =====

  // Generar sugerencias de optimización
  generateOptimizationSuggestions(workflow) {
    const suggestions = [];

    if (workflow.nodes.length > 50) {
      suggestions.push('Consider splitting this workflow into smaller, more manageable workflows');
    }

    const aiNodes = workflow.nodes.filter(n => this.validationSystem.validNodeTypes.ai.includes(n.type));
    if (aiNodes.length > 5) {
      suggestions.push('High AI usage detected. Consider optimizing API calls and implementing caching');
    }

    return suggestions;
  }

  // ===== MÉTODOS DE CONVERSIÓN AVANZADOS =====

  // CONVERTIR HTTP REQUEST A VERTEX AI NODE
  convertHttpRequestToVertexAI(httpParams) {
    return {
      operation: 'chat',
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: '={{ $json.instances[0].prompt || $json.prompt || $json.input }}'
        }
      ],
      maxTokens: 2000,
      temperature: 0.2
    };
  }

  // CONVERTIR HTTP REQUEST A HUGGING FACE NODE
  convertHttpRequestToHuggingFace(httpParams) {
    return {
      task: 'text-classification',
      model: 'bert-base-uncased',
      inputs: '={{ $json.inputs || $json.text || $json.prompt }}'
    };
  }

  // CONVERTIR HTTP REQUEST A AZURE OPENAI NODE
  convertHttpRequestToAzureOpenAI(httpParams) {
    return {
      operation: 'chat',
      deploymentName: 'gpt-4',
      resourceName: 'your-azure-resource',
      apiVersion: '2023-12-01-preview',
      messages: [
        {
          role: 'user',
          content: '={{ $json.messages[0].content || $json.prompt || $json.input }}'
        }
      ],
      maxTokens: 4000
    };
  }

  // CONVERTIR HTTP REQUEST A COHERE NODE
  convertHttpRequestToCohere(httpParams) {
    return {
      operation: 'generate',
      resource: 'text',
      model: 'command-r-plus',
      text: '={{ $json.prompt || $json.input || $json.text }}',
      maxTokens: 4000,
      temperature: 0.7,
      additionalFields: {
        stream: false,
        returnLikelihoods: 'NONE',
        numGenerations: 1
      }
    };
  }

  // CONVERTIR HTTP REQUEST A REPLICATE NODE
  convertHttpRequestToReplicate(httpParams) {
    return {
      operation: 'run',
      model: 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
      input: {
        prompt: '={{ $json.prompt || $json.input }}',
        max_tokens: 4000,
        temperature: 0.7,
        system_prompt: 'You are a helpful AI assistant.'
      }
    };
  }

  // CONVERTIR HTTP REQUEST A DEEPL NODE
  convertHttpRequestToDeepL(httpParams) {
    return {
      operation: 'translate',
      text: '={{ $json.text || $json.input }}',
      targetLang: 'ES',
      sourceLang: 'EN',
      options: {
        formality: 'default',
        splitSentences: '1',
        preserveFormatting: '0',
        glossaryId: '',
        tagHandling: '',
        nonSplittingTags: '',
        outlineDetection: '1',
        splittingTags: ''
      }
    };
  }

  // CONVERTIR HTTP REQUEST A LOCALAI NODE
  convertHttpRequestToLocalAI(httpParams) {
    return {
      operation: 'chatCompletion',
      model: 'gpt-3.5-turbo',
      messages: {
        values: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant.'
          },
          {
            role: 'user',
            content: '={{ $json.query || $json.prompt || $json.input }}'
          }
        ]
      },
      options: {
        maxTokens: 4000,
        temperature: 0.7,
        topP: 1,
        stream: false
      }
    };
  }

  // ===== EXTENSOR DE FLUJO AVANZADO =====

  // EXTENSOR DE FLUJO ULTRA-AVANZADO
  async extendWorkflow(initialPrompt) {
    console.log('🚀 INICIANDO EXTENSOR DE FLUJO ULTRA-AVANZADO...');
    console.log('📝 Prompt original:', initialPrompt.substring(0, 200) + '...');

    try {
      // Paso 1: Generar el flujo inicial (primera parte)
      console.log('⚡ PASO 1: Generando flujo inicial...');
      const initialResult = await this.processUserPrompt(initialPrompt + ' (Genera solo la primera parte del flujo, los nodos principales y sus conexiones básicas)');

      if (!initialResult.success) {
        throw new Error('No se pudo generar el flujo inicial: ' + initialResult.error);
      }

      // Leer el archivo generado
      const fs = await import('fs');
      const path = await import('path');

      const workflowDir = path.join(process.cwd(), 'generated-workflows');
      if (!fs.existsSync(workflowDir)) {
        fs.mkdirSync(workflowDir, { recursive: true });
      }

      const files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json')).sort();
      if (files.length === 0) {
        throw new Error('No se encontró ningún archivo de workflow generado');
      }

      const latestFile = path.join(workflowDir, files[files.length - 1]);
      const initialWorkflow = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

      console.log('📊 Flujo inicial cargado:', {
        nodes: initialWorkflow.nodes?.length || 0,
        connections: Object.keys(initialWorkflow.connections || {}).length
      });

      // Paso 2: Generar extensiones adicionales
      console.log('⚡ PASO 2: Generando extensiones ultra-avanzadas...');

      const extensionPrompts = [
        'Agrega funcionalidades de análisis de datos y reportes automáticos con IA avanzada',
        'Incluye manejo de errores y notificaciones inteligentes con machine learning',
        'Agrega validaciones y lógica condicional avanzada con predicción automática',
        'Incluye integración con bases de datos y almacenamiento cloud distribuido',
        'Agrega funcionalidades de IA multimodal y procesamiento cognitivo',
        'Implementa monitoreo en tiempo real y alertas predictivas',
        'Agrega capacidades de auto-escalado y optimización automática'
      ];

      let extendedWorkflow = { ...initialWorkflow };
      let extensionCount = 0;

      for (const extensionPrompt of extensionPrompts) {
        console.log(`🔄 Generando extensión ultra-avanzada: ${extensionPrompt}`);

        const extensionResult = await this.processUserPrompt(
          `Extiende este workflow existente con capacidades ULTRA-AVANZADAS: ${extensionPrompt}. ` +
          `Workflow actual: ${JSON.stringify(extendedWorkflow, null, 2).substring(0, 2000)}... ` +
          `Asegúrate de usar los tipos de nodos más avanzados disponibles y crear un sistema realmente complejo.`
        );

        if (extensionResult.success) {
          // Leer el workflow extendido
          const extendedFiles = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json')).sort();
          const latestExtendedFile = path.join(workflowDir, extendedFiles[extendedFiles.length - 1]);
          const newWorkflow = JSON.parse(fs.readFileSync(latestExtendedFile, 'utf8'));

          // Fusionar workflows con lógica avanzada
          extendedWorkflow = this.mergeWorkflowsAdvanced(extendedWorkflow, newWorkflow);
          extensionCount++;

          console.log(`✅ Extensión ultra-avanzada ${extensionCount} aplicada:`, {
            nodes: extendedWorkflow.nodes?.length || 0,
            connections: Object.keys(extendedWorkflow.connections || {}).length
          });
        }
      }

      // Paso 3: Validar y optimizar el flujo completo
      console.log('🔧 PASO 3: Validando y optimizando flujo ultra-completo...');
      const finalWorkflow = this.validateAndOptimizeExtendedWorkflow(extendedWorkflow);

      // Paso 4: Generar archivo final con metadatos
      const finalFilename = `ultra-extended-workflow-${Date.now()}.json`;
      const finalPath = path.join(workflowDir, finalFilename);

      const workflowWithMetadata = {
        ...finalWorkflow,
        metadata: {
          generatedAt: new Date().toISOString(),
          extensionsApplied: extensionCount,
          complexity: this.calculateWorkflowComplexity(finalWorkflow),
          securityValidation: this.validateWorkflowSecurity(finalWorkflow),
          optimizationSuggestions: this.generateOptimizationSuggestions(finalWorkflow)
        }
      };

      fs.writeFileSync(finalPath, JSON.stringify(workflowWithMetadata, null, 2));

      console.log('🎉 EXTENSOR ULTRA-AVANZADO COMPLETADO:');
      console.log(`   📁 Archivo: ${finalFilename}`);
      console.log(`   🔢 Extensiones aplicadas: ${extensionCount}`);
      console.log(`   📊 Nodos finales: ${finalWorkflow.nodes?.length || 0}`);
      console.log(`   🔗 Conexiones finales: ${Object.keys(finalWorkflow.connections || {}).length}`);
      console.log(`   🛡️ Validaciones de seguridad: ${workflowWithMetadata.metadata.securityValidation.warnings.length} warnings`);
      console.log(`   ⚡ Complejidad: ${workflowWithMetadata.metadata.complexity.level}`);

      return {
        success: true,
        filename: finalFilename,
        message: `Workflow ULTRA-AVANZADO generado exitosamente con ${extensionCount} extensiones avanzadas`,
        nodes: finalWorkflow.nodes?.length || 0,
        connections: Object.keys(finalWorkflow.connections || {}).length,
        metadata: workflowWithMetadata.metadata
      };

    } catch (error) {
      console.error('❌ Error en extensor ultra-avanzado:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fusionar workflows con lógica avanzada
  mergeWorkflowsAdvanced(baseWorkflow, extensionWorkflow) {
    const merged = { ...baseWorkflow };

    // Fusionar nodos (evitar duplicados por nombre y tipo)
    const existingNodeNames = new Set(baseWorkflow.nodes?.map(n => n.name) || []);

    if (extensionWorkflow.nodes) {
      for (const node of extensionWorkflow.nodes) {
        if (!existingNodeNames.has(node.name)) {
          merged.nodes = merged.nodes || [];
          merged.nodes.push(node);
          existingNodeNames.add(node.name);
        }
      }
    }

    // Fusionar conexiones con resolución de conflictos
    merged.connections = merged.connections || {};
    if (extensionWorkflow.connections) {
      Object.keys(extensionWorkflow.connections).forEach(sourceName => {
        if (!merged.connections[sourceName]) {
          merged.connections[sourceName] = extensionWorkflow.connections[sourceName];
        } else {
          // Combinar conexiones existentes con resolución inteligente
          this.mergeConnectionsIntelligently(merged.connections[sourceName], extensionWorkflow.connections[sourceName]);
        }
      });
    }

    return merged;
  }

  // Fusionar conexiones con resolución inteligente de conflictos
  mergeConnectionsIntelligently(existingConnections, newConnections) {
    if (newConnections.main) {
      if (!existingConnections.main) {
        existingConnections.main = newConnections.main;
      } else {
        // Combinar arrays de conexiones evitando duplicados
        newConnections.main.forEach((newMainArray, index) => {
          if (!existingConnections.main[index]) {
            existingConnections.main[index] = [];
          }

          newMainArray.forEach(newConn => {
            const exists = existingConnections.main[index].some(existingConn =>
              existingConn.node === newConn.node && existingConn.type === newConn.type
            );

            if (!exists) {
              existingConnections.main[index].push(newConn);
            }
          });
        });
      }
    }
  }

  // Validar y optimizar workflow extendido
  validateAndOptimizeExtendedWorkflow(workflow) {
    console.log('🔧 VALIDANDO Y OPTIMIZANDO WORKFLOW EXTENDIDO...');

    // Aplicar todas las validaciones avanzadas
    this.repairWorkflowConnections(workflow);

    // Optimizar posiciones de nodos
    this.optimizeNodePositions(workflow);

    // Eliminar nodos redundantes
    this.removeRedundantNodes(workflow);

    // Optimizar conexiones
    this.optimizeConnections(workflow);

    return workflow;
  }

  // Método eliminado - duplicado

  // Calcular columna óptima para un nodo
  calculateOptimalColumn(workflow, nodeName) {
    const node = workflow.nodes.find(n => n.name === nodeName);
    if (!node) return 0;

    const type = (node.type || '').toLowerCase();

    // Triggers en columna 0
    if (type.includes('trigger') || type.includes('webhook') || type.includes('cron')) {
      return 0;
    }

    // Procesamiento en columnas 1-2
    if (type.includes('set') || type.includes('code') || type.includes('function')) {
      return 1;
    }

    // Lógica condicional en columna 2
    if (type.includes('if') || type.includes('switch')) {
      return 2;
    }

    // IA en columna 3
    if (type.includes('ai') || type.includes('openai') || type.includes('anthropic')) {
      return 3;
    }

    // Outputs en la última columna
    if (type.includes('telegram') || type.includes('gmail') || type.includes('slack')) {
      return 4;
    }

    return 1; // Default
  }

  // Eliminar nodos redundantes
  removeRedundantNodes(workflow) {
    if (!workflow.nodes) return;

    const nodesToRemove = [];

    workflow.nodes.forEach((node, index) => {
      // Identificar nodos sin conexiones
      const hasConnections = workflow.connections[node.name] ||
                           Object.values(workflow.connections).some(conn =>
                             conn.main?.some(mainArray =>
                               mainArray.some(c => c.node === node.name)
                             )
                           );

      if (!hasConnections && !this.isTriggerNode(node)) {
        nodesToRemove.push(index);
        console.log(`🗑️ Nodo redundante eliminado: ${node.name}`);
      }
    });

    // Eliminar nodos en orden inverso para mantener índices correctos
    nodesToRemove.reverse().forEach(index => {
      workflow.nodes.splice(index, 1);
    });
  }

  // Verificar si un nodo es trigger
  isTriggerNode(node) {
    const triggerTypes = ['webhook', 'telegramTrigger', 'httpRequest', 'schedule', 'cron', 'manual'];
    return triggerTypes.some(trigger => (node.type || '').toLowerCase().includes(trigger.toLowerCase()));
  }

  // Optimizar conexiones
  optimizeConnections(workflow) {
    if (!workflow.connections) return;

    // Eliminar conexiones a nodos que no existen
    Object.keys(workflow.connections).forEach(sourceName => {
      const sourceConnections = workflow.connections[sourceName];
      if (sourceConnections.main) {
        sourceConnections.main.forEach(mainArray => {
          mainArray.forEach((conn, index) => {
            const targetExists = workflow.nodes.some(node => node.name === conn.node);
            if (!targetExists) {
              mainArray.splice(index, 1);
              console.log(`🔗 Conexión inválida eliminada: ${sourceName} → ${conn.node}`);
            }
          });
        });
      }
    });
  }

  // ===== SISTEMA DE CONTINUACIÓN DE WORKFLOWS TRUNCADOS =====

  // Helper function para asegurar estructura de array en conexiones
  ensureConnectionsArray(data, nodeName) {
    if (!data.connections[nodeName]) {
      data.connections[nodeName] = { main: [[]] };
      return;
    }
    
    if (!data.connections[nodeName].main) {
      data.connections[nodeName].main = [[]];
      return;
    }

    if (!Array.isArray(data.connections[nodeName].main)) {
      data.connections[nodeName].main = [[]];
      return;
    }

    if (!data.connections[nodeName].main[0]) {
      data.connections[nodeName].main[0] = [];
      return;
    }

    if (!Array.isArray(data.connections[nodeName].main[0])) {
      data.connections[nodeName].main[0] = [];
      return;
    }
  }

  // Helper function para verificar conexiones de manera segura
  safeCheckConnection(data, sourceName, targetName) {
    try {
      if (!data.connections[sourceName] || 
          !data.connections[sourceName].main || 
          !Array.isArray(data.connections[sourceName].main) ||
          !data.connections[sourceName].main[0] ||
          !Array.isArray(data.connections[sourceName].main[0])) {
        this.ensureConnectionsArray(data, sourceName);
        return false;
      }

      return data.connections[sourceName].main[0].some(conn =>
        conn && conn.node === targetName
      );
    } catch (e) {
      console.warn(`⚠️ Error verificando conexión ${sourceName} → ${targetName}: ${e.message}`);
      this.ensureConnectionsArray(data, sourceName);
      return false;
    }
  }

  // Detectar si el workflow tiene estructura incompleta
  detectIncompleteWorkflowStructure(workflow, originalPrompt) {
    console.log('🔍 Analizando estructura del workflow para detectar incompleción...');
    
    // Indicadores de incompleción
    const indicators = {
      missingTrigger: false,
      missingProcessing: false,
      missingOutput: false,
      hasOrphanNodes: false,
      incompleteFlow: false
    };

    // 1. Verificar nodos trigger
    const triggerNodes = workflow.nodes.filter(node => 
      ['webhook', 'trigger', 'cron', 'schedule'].some(t => 
        (node.type || '').toLowerCase().includes(t.toLowerCase())
      )
    );
    indicators.missingTrigger = triggerNodes.length === 0;

    // 2. Verificar nodos de procesamiento (set, function, code, if, etc.)
    const processingNodes = workflow.nodes.filter(node =>
      ['set', 'function', 'code', 'if', 'switch', 'merge'].some(t =>
        (node.type || '').toLowerCase().includes(t.toLowerCase())
      )
    );
    indicators.missingProcessing = processingNodes.length === 0 && workflow.nodes.length > 2;

    // 3. Verificar nodos de salida (notifications, database, etc.)
    const outputNodes = workflow.nodes.filter(node =>
      ['gmail', 'telegram', 'slack', 'discord', 'webhook', 'mysql', 'postgres', 'sheets'].some(t =>
        (node.type || '').toLowerCase().includes(t.toLowerCase())
      )
    );
    indicators.missingOutput = outputNodes.length === 0;

    // 4. Verificar nodos huérfanos
    const connectedNodes = new Set();
    Object.values(workflow.connections || {}).forEach(sourceConnections => {
      if (sourceConnections.main) {
        sourceConnections.main.forEach(mainArray => {
          if (Array.isArray(mainArray)) {
            mainArray.forEach(conn => connectedNodes.add(conn.node));
          }
        });
      }
    });
    
    const orphanCount = workflow.nodes.filter(node => 
      !connectedNodes.has(node.name) && !triggerNodes.includes(node)
    ).length;
    indicators.hasOrphanNodes = orphanCount > 1;

    // 5. Verificar flujo lógico basado en el prompt
    const promptKeywords = originalPrompt.toLowerCase();
    const hasEmailMention = promptKeywords.includes('email') || promptKeywords.includes('gmail');
    const hasTelegramMention = promptKeywords.includes('telegram');
    const hasSlackMention = promptKeywords.includes('slack');
    const hasDBMention = promptKeywords.includes('mysql') || promptKeywords.includes('database') || promptKeywords.includes('postgres');

    const hasEmailNode = workflow.nodes.some(n => n.type.includes('gmail') || n.type.includes('email'));
    const hasTelegramNode = workflow.nodes.some(n => n.type.includes('telegram'));
    const hasSlackNode = workflow.nodes.some(n => n.type.includes('slack'));
    const hasDBNode = workflow.nodes.some(n => n.type.includes('mysql') || n.type.includes('postgres'));

    indicators.incompleteFlow = (hasEmailMention && !hasEmailNode) ||
                               (hasTelegramMention && !hasTelegramNode) ||
                               (hasSlackMention && !hasSlackNode) ||
                               (hasDBMention && !hasDBNode);

    const incompleteCount = Object.values(indicators).filter(Boolean).length;
    const isIncomplete = incompleteCount > 1;

    console.log(`📊 Indicadores de incompleción encontrados: ${incompleteCount}/5`);
    Object.entries(indicators).forEach(([key, value]) => {
      if (value) console.log(`   ⚠️ ${key}: ${value}`);
    });

    return isIncomplete;
  }

  // Sistema de Continuación Mejorado - Maneja JSONs Incompletos/Corruptos
  async rePromptForCompletion(originalPrompt, partialWorkflow, lastNodeName, originalCorruptedJSON = null) {
    console.log('🔄 INICIANDO SISTEMA DE RE-PROMPT PARA COMPLETAR WORKFLOW...');
    
    try {
      // Validaciones de parámetros de entrada
      if (!originalPrompt || typeof originalPrompt !== 'string') {
        throw new Error('originalPrompt debe ser una string válida');
      }
      
      if (!partialWorkflow || !partialWorkflow.nodes || !Array.isArray(partialWorkflow.nodes)) {
        throw new Error('partialWorkflow debe tener un array de nodos válido');
      }
      
      if (partialWorkflow.nodes.length === 0) {
        throw new Error('partialWorkflow no puede estar vacío');
      }
      
      const settings = await this.getSettings();
      if (!settings.apiKey) {
        throw new Error('API Key no configurada para re-prompt.');
      }

      // Identificar el último nodo lógico del workflow parcial
      const lastNodeInPartial = partialWorkflow.nodes[partialWorkflow.nodes.length - 1];
      const connectionPoint = lastNodeName || lastNodeInPartial?.name || "START";

      console.log(`🔗 Punto de conexión identificado: "${connectionPoint}"`);

      // Si tenemos el JSON original corrupto, lo incluimos para mejor contexto
      let corruptedContext = "";
      if (originalCorruptedJSON && typeof originalCorruptedJSON === 'string') {
        console.log('📝 Usando JSON corrupto como contexto adicional...');
        corruptedContext = `\n\n🧩 JSON ORIGINAL CORRUPTO/INCOMPLETO (para referencia):
${originalCorruptedJSON.slice(0, 2000)}${originalCorruptedJSON.length > 2000 ? '...[TRUNCADO]' : ''}

⚠️ El JSON anterior tenía errores o estaba incompleto. Úsalo como referencia para entender la intención, pero genera JSON completamente válido.`;
      }

      const rePromptText = `PROMPT ORIGINAL DEL USUARIO: ${originalPrompt}

WORKFLOW PARCIAL GENERADO HASTA AHORA:
${JSON.stringify(partialWorkflow, null, 2)}${corruptedContext}

🚨 INSTRUCCIONES CRÍTICAS DE CONTINUACIÓN:
El workflow anterior está incompleto, fue truncado o contenía errores de JSON. Por favor, genera nodos adicionales para completarlo a partir del nodo "${connectionPoint}".

REQUISITOS OBLIGATORIOS:
1. ❌ NO duplicar nodos ya existentes en el "WORKFLOW PARCIAL"
2. 🔗 Conectar lógicamente los nuevos nodos empezando desde "${connectionPoint}"
3. 🆔 Mantener IDs únicos (usar prefijos como "extension-" para evitar duplicados)
4. ✅ Incluir "workflowStatus": "complete" cuando el workflow esté terminado
5. 📋 Completar según el prompt original del usuario
6. 🎯 Enfocarse en nodos de procesamiento, validación y salida que falten
7. 🧹 Generar SOLO JSON válido y bien formado

🚨 CONEXIONES OBLIGATORIAS EN EXTENSIÓN:
- CONEXIONES SIEMPRE PRESENTES: El objeto "connections" NUNCA debe estar vacío
- CONEXIÓN INICIAL OBLIGATORIA: Conectar desde "${connectionPoint}" hacia el primer nuevo nodo
- FLUJO LÓGICO OBLIGATORIO: Procesador → Procesador → Output (mínimo)
- CONEXIONES COMPLETAS: Cada nodo nuevo (excepto outputs finales) DEBE tener al menos una conexión de salida
- VALIDACIÓN INTERNA: Asegurar que todas las conexiones referencien nodos existentes o nuevos
- ESTRUCTURA RIGUROSA: {"NodeName":{"main":[[{"node":"NextName","type":"main","index":0}]]}}

ANÁLISIS DEL WORKFLOW PARCIAL:
- Nodos actuales: ${partialWorkflow.nodes?.length || 0}
- Último nodo: "${connectionPoint}"
- Estado: ${partialWorkflow.workflowStatus || 'incompleto'}

TIPOS DE NODOS RECOMENDADOS PARA EXTENSIÓN:
✅ Procesamiento: n8n-nodes-base.set, n8n-nodes-base.function, n8n-nodes-base.code
✅ Validación: n8n-nodes-base.if, n8n-nodes-base.switch, n8n-nodes-base.merge  
✅ Notificaciones: n8n-nodes-base.gmail, n8n-nodes-base.telegram, n8n-nodes-base.slack
✅ APIs: n8n-nodes-base.httpRequest, n8n-nodes-base.webhook
✅ Datos: n8n-nodes-base.googleSheets, n8n-nodes-base.mysql, n8n-nodes-base.postgres

POSICIONAMIENTO DE NODOS:
- Coordenadas iniciales: [${(lastNodeInPartial?.position?.[0] || 0) + 300}, ${lastNodeInPartial?.position?.[1] || 0}]
- Incremento horizontal: +300px por nodo
- Ramas de error: +100px vertical

⚡ SALIDA REQUERIDA: JSON válido y completo ÚNICAMENTE para la extensión del workflow (nuevos nodos + conexiones).

⚠️ REGLAS CRÍTICAS PARA CONEXIONES EN EXTENSIÓN:
- CONEXIONES DEBEN usar "name" de nodos, NO "id"
- Conectar DESDE "${connectionPoint}" hacia el primer nuevo nodo
- Cada conexión DEBE referenciar el "name" exacto del nodo destino
- Estructura: "connections": {"Nombre Nodo Origen": {"main": [{"node": "Nombre Nodo Destino"}]}}
- Nombres deben coincidir EXACTAMENTE con los definidos en "nodes"

🎯 OBJETIVO: Completar un workflow funcional que implemente completamente el prompt original del usuario.`;

      console.log('🔮 Enviando re-prompt a Gemini...');
      
      // Usar límite específico para continuaciones - con fallback si no está definido
      let continuationTokens = (typeof TOKEN_LIMITS !== 'undefined' && TOKEN_LIMITS.CONTINUATION) ? TOKEN_LIMITS.CONTINUATION : 4000;

      // Llamar a Gemini con configuración optimizada para continuación
      let retryCount = 0;
      const maxRetries = 3; // Aumentado a 3 para intentos con diferentes tamaños de token

      while (retryCount < maxRetries) {
        try {
          console.log(`🔄 Intento ${retryCount + 1}/${maxRetries}...`);

          // Validar que callGeminiMassive existe
          if (typeof this.callGeminiMassive !== 'function') {
            throw new Error('Método callGeminiMassive no está disponible');
          }

          const response = await this.callGeminiMassive(
            [{ role: 'user', content: rePromptText }], 
            continuationTokens, 
            0.2 // Temperatura más baja para continuaciones más precisas
          );

          // Validar que la respuesta es válida
          if (!response || typeof response !== 'string') {
            throw new Error('Respuesta de Gemini inválida o vacía');
          }

          const match = response.match(/```json[\s\S]*?```|\{[\s\S]*\}/);
          const jsonText = match ? match[0].replace(/```json|```/g, '') : response;

          // Importar la extensión usando el mismo validador/limpiador
          const extensionImportResult = await this.importWorkflowJSON(jsonText, originalPrompt);

          if (!extensionImportResult.ok) {
            throw new Error(`No se pudo importar la extensión: ${extensionImportResult.error}`);
          }
          
          // Validar que this.currentWorkflow existe y es válido
          if (!this.currentWorkflow) {
            throw new Error('currentWorkflow no se estableció después de importWorkflowJSON');
          }
          
          let extensionWorkflow;
          try {
            // El importWorkflowJSON actualiza this.currentWorkflow con el último JSON.
            // Aquí necesitamos ensamblar el partialWorkflow original con el nuevo this.currentWorkflow (que es la extensión).
            extensionWorkflow = JSON.parse(this.currentWorkflow);
          } catch (parseError) {
            throw new Error(`Error parseando currentWorkflow: ${parseError.message}`);
          }

          if (!extensionWorkflow || !extensionWorkflow.nodes || !Array.isArray(extensionWorkflow.nodes)) {
            throw new Error('extensionWorkflow no tiene una estructura válida de nodos');
          }

          console.log(`📦 Extensión generada con ${extensionWorkflow.nodes?.length || 0} nodos`);

          // Ensamblar el workflow original con la extensión
          const finalMergedWorkflow = this.mergeWorkflowsAdvanced(partialWorkflow, extensionWorkflow, connectionPoint);
          
          console.log('✅ Workflow parcial ensamblado exitosamente.');
          console.log(`📊 Nodos totales: ${finalMergedWorkflow.nodes?.length || 0}`);

          return {
            success: true,
            workflow: finalMergedWorkflow
          };

        } catch (error) {
          console.error(`❌ Error en intento ${retryCount + 1}/${maxRetries}: ${error.message}`);
          console.error('Stack trace:', error.stack);
          
          // Manejo especial para respuesta truncada por MAX_TOKENS
          if (error.message.includes('truncada por límite de tokens')) {
            console.log('🔄 Reduciendo límite de tokens y reintentando...');
            continuationTokens = Math.max(1000, Math.floor(continuationTokens * 0.6)); // Reducir tokens un 40%
            console.log(`📊 Nuevo límite de tokens: ${continuationTokens}`);
          }
          
          retryCount++;
          if (retryCount >= maxRetries) {
            // En el último intento fallido, usar el sistema inteligente de fallback
            console.log('🤖 Último intento fallido, usando sistema inteligente de fallback...');
            
            try {
              const fallbackWorkflow = await this.generateIntelligentFallbackWorkflow(originalPrompt);
              
              if (fallbackWorkflow && fallbackWorkflow.nodes && fallbackWorkflow.nodes.length > 0) {
                console.log('✅ Sistema de fallback generó workflow alternativo');
                
                // Fusionar el workflow parcial con el fallback
                const finalMergedWorkflow = this.mergeWorkflowsAdvanced(partialWorkflow, fallbackWorkflow, connectionPoint);
                
                return {
                  success: true,
                  workflow: finalMergedWorkflow,
                  fallback: true
                };
              }
            } catch (fallbackError) {
              console.error('❌ Error en sistema de fallback:', fallbackError.message);
            }
            
            throw error;
          }
          
          console.log('🔄 Reintentando re-prompt...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
        }
      }

    } catch (error) {
      console.error('❌ Error crítico en rePromptForCompletion:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fusión avanzada de workflows con punto de conexión específico
  mergeWorkflowsAdvanced(baseWorkflow, extensionWorkflow, lastConnectionPointName = null) {
    console.log('🔀 INICIANDO FUSIÓN AVANZADA DE WORKFLOWS...');
    
    const merged = JSON.parse(JSON.stringify(baseWorkflow)); // Deep copy

    if (!extensionWorkflow.nodes || extensionWorkflow.nodes.length === 0) {
      console.log('⚠️ Extensión vacía, retornando workflow base');
      return merged;
    }

    // 1. Asegurar arrays de nodos y conexiones
    if (!merged.nodes) merged.nodes = [];
    if (!merged.connections) merged.connections = {};
    if (!extensionWorkflow.connections) extensionWorkflow.connections = {};

    // 2. Añadir nodos de la extensión asegurando IDs únicos
    const existingNodeNames = new Set(merged.nodes.map(n => n.name));
    const extensionNodes = [];

    extensionWorkflow.nodes.forEach((node, index) => {
      let uniqueName = node.name;
      
      // Resolver conflictos de nombres
      if (existingNodeNames.has(uniqueName)) {
        let counter = 1;
        do {
          uniqueName = `${node.name}-ext-${counter}`;
          counter++;
        } while (existingNodeNames.has(uniqueName));
        
        console.log(`🔄 Nombre de nodo renombrado: ${node.name} → ${uniqueName}`);
      }

      const mergedNode = {
        ...node,
        name: uniqueName,
        id: node.id || `extension-node-${Date.now()}-${index}`
      };

      extensionNodes.push(mergedNode);
      existingNodeNames.add(uniqueName);
    });

    merged.nodes.push(...extensionNodes);

    // 3. Añadir conexiones de la extensión actualizando nombres de nodos
    Object.entries(extensionWorkflow.connections).forEach(([sourceName, sourceConnections]) => {
      // Encontrar el nombre actualizado del nodo fuente
      const updatedSourceName = extensionNodes.find(n => 
        n.name === sourceName || n.name.startsWith(sourceName + '-ext-')
      )?.name || sourceName;

      if (sourceConnections.main) {
        if (!merged.connections[updatedSourceName]) {
          merged.connections[updatedSourceName] = { main: [] };
        }

        sourceConnections.main.forEach(mainArray => {
          if (Array.isArray(mainArray)) {
            const updatedConnections = mainArray.map(conn => {
              // Encontrar el nombre actualizado del nodo destino
              const updatedTargetName = extensionNodes.find(n => 
                n.name === conn.node || n.name.startsWith(conn.node + '-ext-')
              )?.name || conn.node;

              return {
                ...conn,
                node: updatedTargetName
              };
            });

            merged.connections[updatedSourceName].main.push(updatedConnections);
          }
        });
      }
    });

    // 4. CRÍTICO: Conectar el punto de extensión con el primer nodo de la extensión
    if (lastConnectionPointName && extensionNodes.length > 0) {
      const firstExtensionNode = extensionNodes[0];
      
      // Asegurar que el nodo de conexión existe
      if (merged.nodes.some(n => n.name === lastConnectionPointName)) {
        if (!merged.connections[lastConnectionPointName]) {
          merged.connections[lastConnectionPointName] = { main: [] };
        }
        if (!merged.connections[lastConnectionPointName].main) {
          merged.connections[lastConnectionPointName].main = [];
        }

        // Verificar si ya hay una conexión para evitar duplicados
        const existingConnection = merged.connections[lastConnectionPointName].main.find(mainArr => 
          Array.isArray(mainArr) && mainArr.some(conn => conn.node === firstExtensionNode.name)
        );

        if (!existingConnection) {
          merged.connections[lastConnectionPointName].main.push([{
            node: firstExtensionNode.name,
            type: 'main',
            index: 0
          }]);
          
          console.log(`🔗 CONEXIÓN ESTABLECIDA: "${lastConnectionPointName}" → "${firstExtensionNode.name}"`);
        } else {
          console.log(`🔗 Conexión ya existe: "${lastConnectionPointName}" → "${firstExtensionNode.name}"`);
        }
      } else {
        console.warn(`⚠️ Nodo de conexión "${lastConnectionPointName}" no encontrado en el workflow base`);
      }
    }

    // 5. Actualizar metadata del workflow
    merged.metadata = {
      ...merged.metadata,
      workflowStatus: 'complete',
      lastNodeName: extensionNodes[extensionNodes.length - 1]?.name,
      totalNodes: merged.nodes.length,
      mergedAt: new Date().toISOString()
    };

    console.log(`✅ FUSIÓN COMPLETADA:`);
    console.log(`   📊 Nodos base: ${baseWorkflow.nodes?.length || 0}`);
    console.log(`   ➕ Nodos extensión: ${extensionNodes.length}`);
    console.log(`   🎯 Nodos totales: ${merged.nodes.length}`);
    console.log(`   🔗 Conexiones totales: ${Object.keys(merged.connections).length}`);

    return merged;
  }

  // ===== EXTENSOR DE FLUJO AVANZADO =====

  async extendWorkflow(initialPrompt) {
    console.log('🚀 INICIANDO EXTENSOR DE FLUJO ULTRA-AVANZADO...');
    console.log('📝 Prompt original:', initialPrompt.substring(0, 200) + '...');

    try {
      // Paso 1: Generar el flujo inicial (primera parte)
      console.log('⚡ PASO 1: Generando flujo inicial...');
      const initialResult = await this.processUserPrompt(initialPrompt + ' (Genera solo la primera parte del flujo, los nodos principales y sus conexiones básicas)');

      if (!initialResult.success) {
        throw new Error('No se pudo generar el flujo inicial: ' + initialResult.error);
      }

      // Leer el archivo generado
      const workflowDir = path.join(process.cwd(), 'generated-workflows');
      
      if (!fs.existsSync(workflowDir)) {
        fs.mkdirSync(workflowDir, { recursive: true });
      }

      const files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json')).sort();
      if (files.length === 0) {
        throw new Error('No se encontró ningún archivo de workflow generado');
      }

      const latestFile = path.join(workflowDir, files[files.length - 1]);
      const initialWorkflow = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

      console.log('📊 Flujo inicial cargado:', {
        nodes: initialWorkflow.nodes?.length || 0,
        connections: Object.keys(initialWorkflow.connections || {}).length
      });

      // Paso 2: Identificar puntos de extensión
      console.log('🔍 PASO 2: Identificando puntos de extensión...');
      const extensionPoints = this.identifyExtensionPoints(initialWorkflow);
      console.log(`📍 Puntos de extensión encontrados: ${extensionPoints.length}`);

      if (extensionPoints.length === 0) {
        console.log('⚠️ No se encontraron puntos de extensión válidos, devolviendo workflow inicial');
        return {
          ...initialWorkflow,
          filename: latestFile
        };
      }

      // Paso 3: Generar extensiones para cada punto
      console.log('🔧 PASO 3: Generando extensiones...');
      let extendedWorkflow = { ...initialWorkflow };
      
      for (let i = 0; i < extensionPoints.length && i < 3; i++) { // Limitar a 3 extensiones max
        const point = extensionPoints[i];
        console.log(`🎯 Extendiendo desde nodo: ${point.nodeName} (tipo: ${point.type})`);
        
        const extensionPrompt = this.generateExtensionPrompt(initialPrompt, point, i + 1);
        const extensionResult = await this.generateWorkflowExtension(extensionPrompt, extendedWorkflow, point);
        
        if (extensionResult.success) {
          extendedWorkflow = this.mergeWorkflowExtension(extendedWorkflow, extensionResult.workflow, point);
          console.log(`✅ Extensión ${i + 1} integrada con éxito`);
        } else {
          console.log(`❌ Error en extensión ${i + 1}: ${extensionResult.error}`);
        }
      }

      // Paso 4: Guardar resultado final
      const timestamp = Date.now();
      const extendedFilename = path.join(workflowDir, `workflow-extended-${timestamp}.json`);
      fs.writeFileSync(extendedFilename, JSON.stringify(extendedWorkflow, null, 2));

      console.log(`🎉 EXTENSOR COMPLETADO:`);
      console.log(`   📊 Nodos finales: ${extendedWorkflow.nodes.length}`);
      console.log(`   🔗 Conexiones finales: ${Object.keys(extendedWorkflow.connections).length}`);
      console.log(`   💾 Archivo guardado: ${extendedFilename}`);

      return {
        ...extendedWorkflow,
        filename: extendedFilename
      };

    } catch (error) {
      console.error('❌ Error en extensor de flujo:', error.message);
      return {
        nodes: [],
        connections: {},
        error: error.message
      };
    }
  }

  identifyExtensionPoints(workflow) {
    const extensionPoints = [];
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      return extensionPoints;
    }

    workflow.nodes.forEach(node => {
      // Identificar nodos finales (sin conexiones de salida)
      const hasOutput = workflow.connections[node.name] && 
                       workflow.connections[node.name].main && 
                       workflow.connections[node.name].main.length > 0;
      
      if (!hasOutput) {
        extensionPoints.push({
          nodeName: node.name,
          nodeType: node.type,
          type: 'terminal',
          description: 'Nodo final sin conexiones de salida'
        });
      }

      // Identificar nodos de procesamiento que pueden expandirse
      if (node.type.includes('If') || node.type.includes('Switch')) {
        extensionPoints.push({
          nodeName: node.name,
          nodeType: node.type,
          type: 'conditional',
          description: 'Nodo condicional expandible'
        });
      }

      // Identificar nodos de datos que pueden procesarse más
      if (node.type.includes('Set') || node.type.includes('Function')) {
        extensionPoints.push({
          nodeName: node.name,
          nodeType: node.type,
          type: 'processing',
          description: 'Nodo de procesamiento expandible'
        });
      }
    });

    return extensionPoints;
  }

  generateExtensionPrompt(originalPrompt, extensionPoint, extensionNumber) {
    const basePrompt = `Basándote en el workflow existente, crea una EXTENSIÓN ${extensionNumber} que continúe desde el nodo "${extensionPoint.nodeName}".

CONTEXTO ORIGINAL: ${originalPrompt}

PUNTO DE EXTENSIÓN: 
- Nodo: ${extensionPoint.nodeName}
- Tipo: ${extensionPoint.nodeType}  
- Descripción: ${extensionPoint.description}

INSTRUCCIONES PARA LA EXTENSIÓN:
1. Crear 2-4 nodos adicionales que extiendan la funcionalidad
2. Los nodos deben conectarse comenzando desde "${extensionPoint.nodeName}"
3. Incluir procesamiento adicional, validaciones o acciones complementarias
4. Mantener coherencia con el flujo original
5. Agregar manejo de errores si es necesario

SOLO generar la EXTENSIÓN, no recrear el workflow completo.`;

    return basePrompt;
  }

  async generateWorkflowExtension(prompt, baseWorkflow, extensionPoint) {
    try {
      console.log(`🔧 Generando extensión para: ${extensionPoint.nodeName}`);
      
      // Usar el sistema de prompt optimizado para generar extensión
      const settings = await this.getSettings();
      const result = await this.callLLMV2({ 
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.model,
        prompt: prompt
      });
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Intentar parsear la respuesta como workflow
      const extensionWorkflow = this.parseWorkflowFromResponse(result.response);
      
      if (!extensionWorkflow.nodes || extensionWorkflow.nodes.length === 0) {
        return { success: false, error: 'No se pudieron generar nodos de extensión' };
      }

      return {
        success: true,
        workflow: extensionWorkflow
      };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  mergeWorkflowExtension(baseWorkflow, extensionWorkflow, extensionPoint) {
    console.log(`🔗 Fusionando extensión en nodo: ${extensionPoint.nodeName}`);
    
    const merged = JSON.parse(JSON.stringify(baseWorkflow)); // Deep clone
    
    // Agregar nodos de extensión con IDs únicos
    let nodeCounter = merged.nodes.length + 1;
    const extensionNodes = extensionWorkflow.nodes.map(node => {
      const newNode = { ...node };
      if (!newNode.id) {
        newNode.id = `extension-${nodeCounter++}`;
      }
      return newNode;
    });

    merged.nodes.push(...extensionNodes);

    // Conectar primer nodo de extensión al punto de extensión
    if (extensionNodes.length > 0 && extensionPoint.nodeName) {
      const firstExtensionNode = extensionNodes[0];
      
      if (!merged.connections[extensionPoint.nodeName]) {
        merged.connections[extensionPoint.nodeName] = { main: [[]] };
      }
      
      if (!merged.connections[extensionPoint.nodeName].main[0]) {
        merged.connections[extensionPoint.nodeName].main[0] = [];
      }
      
      merged.connections[extensionPoint.nodeName].main[0].push({
        node: firstExtensionNode.name,
        type: 'main',
        index: 0
      });
    }

    // Agregar conexiones internas de la extensión
    if (extensionWorkflow.connections) {
      Object.keys(extensionWorkflow.connections).forEach(sourceNode => {
        if (merged.connections[sourceNode]) {
          // Fusionar conexiones existentes
          const sourceConnections = extensionWorkflow.connections[sourceNode];
          if (sourceConnections.main) {
            if (!merged.connections[sourceNode].main) {
              merged.connections[sourceNode].main = [];
            }
            sourceConnections.main.forEach((connections, index) => {
              if (!merged.connections[sourceNode].main[index]) {
                merged.connections[sourceNode].main[index] = [];
              }
              merged.connections[sourceNode].main[index].push(...connections);
            });
          }
        } else {
          merged.connections[sourceNode] = extensionWorkflow.connections[sourceNode];
        }
      });
    }

    return merged;
  }

  // ===== SISTEMA DE VALIDACIÓN Y REPARACIÓN AVANZADO V3.0 =====

  // Validación exhaustiva de conexiones mejorada
  validateWorkflowConnectionsV3(data) {
    console.log('🔍 VALIDACIÓN EXHAUSTIVA DE CONEXIONES V3.0...');
    
    const results = { errors: [], warnings: [], analysis: {} };
    results.analysis = this.analyzeWorkflowTopologyV3(data);
    
    this.validateNodeReferencesV3(data, results);
    this.validateLogicalFlowV3(data, results);
    this.validateConnectionIntegrity(data, results);
    
    return results;
  }

  // Análisis topológico mejorado
  analyzeWorkflowTopologyV3(data) {
    const analysis = {
      triggers: [], processors: [], outputs: [], utilities: [],
      connectionMatrix: {}, isolatedNodes: [], duplicateIds: [], 
      backwardConnections: [], circularReferences: [], orphanNodes: [],
      isValid: true, issues: []
    };

    if (!data.nodes || !Array.isArray(data.nodes)) {
      analysis.isValid = false;
      analysis.issues.push('Estructura de nodos inválida');
      return analysis;
    }

    // 🔍 DETECTAR IDs DUPLICADOS
    const seenIds = new Set();
    const seenNames = new Set();
    
    data.nodes.forEach(node => {
      // IDs duplicados
      if (node.id && seenIds.has(node.id)) {
        analysis.duplicateIds.push(node.id);
        analysis.issues.push(`ID duplicado encontrado: ${node.id}`);
        analysis.isValid = false;
      }
      if (node.id) seenIds.add(node.id);

      // Nombres duplicados
      if (seenNames.has(node.name)) {
        analysis.issues.push(`Nombre de nodo duplicado: ${node.name}`);
        analysis.isValid = false;
      }
      seenNames.add(node.name);

      const category = this.categorizeNodeV3(node);
      analysis[category].push(node);
      analysis.connectionMatrix[node.name] = { incoming: [], outgoing: [] };
    });

    // 🔗 ANALIZAR CONEXIONES Y DETECTAR PROBLEMAS
    if (data.connections) {
      Object.keys(data.connections).forEach(sourceName => {
        const conns = data.connections[sourceName];
        if (conns.main) {
          conns.main.forEach(mainArray => {
            if (Array.isArray(mainArray)) {
              mainArray.forEach(conn => {
                // Verificar que el nodo destino existe
                if (!seenNames.has(conn.node)) {
                  analysis.issues.push(`Conexión hacia nodo inexistente: "${sourceName}" → "${conn.node}"`);
                  analysis.isValid = false;
                  return;
                }

                // Detectar conexiones hacia atrás (flujo ilógico)
                const sourceNode = data.nodes.find(n => n.name === sourceName);
                const targetNode = data.nodes.find(n => n.name === conn.node);
                
                if (sourceNode && targetNode) {
                  // Si el nodo destino tiene posición X menor que el origen, puede ser conexión hacia atrás
                  if (targetNode.position && sourceNode.position && 
                      targetNode.position[0] < sourceNode.position[0]) {
                    analysis.backwardConnections.push(`${sourceName} → ${conn.node}`);
                    analysis.issues.push(`Posible flujo hacia atrás: ${sourceName} → ${conn.node}`);
                  }
                  
                  // Verificar si es trigger conectando a otro trigger (problemático)
                  if (this.categorizeNodeV3(sourceNode) === 'triggers' && 
                      this.categorizeNodeV3(targetNode) === 'triggers') {
                    analysis.issues.push(`Trigger conectando a otro trigger: ${sourceName} → ${conn.node}`);
                  }
                }

                if (analysis.connectionMatrix[sourceName]) {
                  analysis.connectionMatrix[sourceName].outgoing.push(conn.node);
                }
                if (analysis.connectionMatrix[conn.node]) {
                  analysis.connectionMatrix[conn.node].incoming.push(sourceName);
                }
              });
            }
          });
        }
      });
    }

    // 🔍 DETECTAR NODOS HUÉRFANOS Y AISLADOS
    analysis.isolatedNodes = data.nodes.filter(node => 
      analysis.connectionMatrix[node.name] &&
      analysis.connectionMatrix[node.name].incoming.length === 0 && 
      analysis.connectionMatrix[node.name].outgoing.length === 0
    );

    analysis.orphanNodes = data.nodes.filter(node => {
      const matrix = analysis.connectionMatrix[node.name];
      if (!matrix) return true;
      
      // Nodo sin entradas (excepto triggers) o sin salidas (excepto outputs)
      const category = this.categorizeNodeV3(node);
      if (category !== 'triggers' && matrix.incoming.length === 0) return true;
      if (category !== 'outputs' && matrix.outgoing.length === 0) return true;
      
      return false;
    });

    // 🔄 DETECTAR REFERENCIAS CIRCULARES
    this.detectCircularReferences(data, analysis);

    if (analysis.issues.length > 0) {
      analysis.isValid = false;
    }

    return analysis;
  }

  // 🔄 Detectar referencias circulares
  detectCircularReferences(data, analysis) {
    const visited = new Set();
    const visiting = new Set();
    
    const dfs = (nodeName) => {
      if (visiting.has(nodeName)) {
        analysis.circularReferences.push(nodeName);
        analysis.issues.push(`Referencia circular detectada en: ${nodeName}`);
        analysis.isValid = false;
        return true;
      }
      
      if (visited.has(nodeName)) return false;
      
      visiting.add(nodeName);
      
      const matrix = analysis.connectionMatrix[nodeName];
      if (matrix && matrix.outgoing) {
        for (const target of matrix.outgoing) {
          if (dfs(target)) return true;
        }
      }
      
      visiting.delete(nodeName);
      visited.add(nodeName);
      return false;
    };
    
    data.nodes.forEach(node => {
      if (!visited.has(node.name)) {
        dfs(node.name);
      }
    });
  }

  // Categorizar nodos V3
  categorizeNodeV3(node) {
    const type = (node.type || '').toLowerCase();
    const name = (node.name || '').toLowerCase();

    if (type.includes('webhook') || type.includes('trigger') || type.includes('cron') || 
        name.includes('trigger') || name.includes('start')) return 'triggers';
    if (type.includes('respondtowebhook') || type.includes('webhookresponse') || 
        name.includes('response') || name.includes('reply')) return 'outputs';
    if (type.includes('gmail') || type.includes('slack') || type.includes('telegram') || 
        name.includes('send') || name.includes('email')) return 'outputs';
    if (type.includes('if') || type.includes('switch') || type.includes('merge') || 
        type.includes('wait')) return 'utilities';
    return 'processors';
  }

  // Validar referencias V3
  validateNodeReferencesV3(data, results) {
    const nodeNames = new Set(data.nodes.map(n => n.name));
    let connectionErrors = 0;
    
    // 🔍 VALIDAR ESTRUCTURA DE CONEXIONES
    if (!data.connections || typeof data.connections !== 'object') {
      results.errors.push('Estructura de conexiones faltante o inválida');
      return;
    }
    
    Object.keys(data.connections).forEach(sourceName => {
      if (!nodeNames.has(sourceName)) {
        results.errors.push(`Conexión desde nodo inexistente: "${sourceName}"`);
        connectionErrors++;
        return;
      }

      const conns = data.connections[sourceName];
      if (!conns || typeof conns !== 'object') {
        results.errors.push(`Estructura de conexión inválida para: "${sourceName}"`);
        return;
      }

      if (conns.main) {
        if (!Array.isArray(conns.main)) {
          results.errors.push(`Conexión main no es array en: "${sourceName}"`);
          return;
        }

        conns.main.forEach((mainArray, idx) => {
          if (!Array.isArray(mainArray)) {
            results.errors.push(`Conexión main[${idx}] no es array en: "${sourceName}"`);
            return;
          }

          mainArray.forEach((conn, connIdx) => {
            // Validar estructura de conexión
            if (!conn || typeof conn !== 'object') {
              results.errors.push(`Conexión inválida en ${sourceName}[${idx}][${connIdx}]`);
              return;
            }

            if (!conn.node || typeof conn.node !== 'string') {
              results.errors.push(`Nodo destino faltante en ${sourceName}[${idx}][${connIdx}]`);
              return;
            }

            if (!nodeNames.has(conn.node)) {
              results.errors.push(`Conexión hacia nodo inexistente: "${sourceName}" → "${conn.node}"`);
              connectionErrors++;
              return;
            }

            if (!conn.type || typeof conn.index !== 'number') {
              results.warnings.push(`Estructura de conexión incompleta en ${sourceName} → ${conn.node}`);
            }

            // 🚨 DETECTAR AUTOCONEXIÓN (nodo conecta consigo mismo)
            if (conn.node === sourceName) {
              results.errors.push(`Autoconexión detectada en: ${sourceName}`);
              connectionErrors++;
            }
          });
        });
      }
    });

    // 🔍 DETECTAR NODOS SIN CONEXIONES
    const connectedNodes = new Set();
    Object.keys(data.connections).forEach(sourceName => {
      connectedNodes.add(sourceName);
      const conns = data.connections[sourceName];
      if (conns.main) {
        conns.main.forEach(mainArray => {
          if (Array.isArray(mainArray)) {
            mainArray.forEach(conn => {
              if (conn.node) connectedNodes.add(conn.node);
            });
          }
        });
      }
    });

    const unconnectedNodes = data.nodes.filter(node => !connectedNodes.has(node.name));
    if (unconnectedNodes.length > 0) {
      results.warnings.push(`Nodos desconectados: ${unconnectedNodes.map(n => n.name).join(', ')}`);
    }

    // Añadir score de conexiones
    results.connectionScore = Math.max(0, 100 - (connectionErrors * 10));
  }

  // Validar flujo lógico V3
  validateLogicalFlowV3(data, results) {
    const analysis = results.analysis;
    
    // 🚨 VALIDACIONES CRÍTICAS
    if (analysis.triggers.length === 0) {
      results.errors.push('Workflow sin triggers - No se puede ejecutar');
    }

    if (analysis.triggers.length > 1) {
      results.warnings.push(`Múltiples triggers detectados (${analysis.triggers.length}) - Puede causar conflictos`);
    }

    // 🔍 VALIDAR CADA TRIGGER
    analysis.triggers.forEach(trigger => {
      const outgoing = analysis.connectionMatrix[trigger.name]?.outgoing || [];
      if (outgoing.length === 0) {
        results.errors.push(`Trigger sin salida: ${trigger.name} - Workflow no funcionará`);
      }

      // Validar que triggers no reciban conexiones (excepto casos especiales)
      const incoming = analysis.connectionMatrix[trigger.name]?.incoming || [];
      if (incoming.length > 0) {
        results.warnings.push(`Trigger "${trigger.name}" recibe conexiones de: ${incoming.join(', ')} - Verificar si es intencional`);
      }
    });

    // 🔍 VALIDAR NODOS DE SALIDA
    analysis.outputs.forEach(output => {
      const incoming = analysis.connectionMatrix[output.name]?.incoming || [];
      if (incoming.length === 0) {
        results.warnings.push(`Output "${output.name}" sin entrada - No recibirá datos`);
      }

      const outgoing = analysis.connectionMatrix[output.name]?.outgoing || [];
      if (outgoing.length > 0) {
        results.warnings.push(`Output "${output.name}" tiene salidas hacia: ${outgoing.join(', ')} - Verificar flujo`);
      }
    });

    // 🔍 VALIDAR PROCESADORES
    analysis.processors.forEach(processor => {
      const incoming = analysis.connectionMatrix[processor.name]?.incoming || [];
      const outgoing = analysis.connectionMatrix[processor.name]?.outgoing || [];
      
      if (incoming.length === 0) {
        results.warnings.push(`Procesador "${processor.name}" sin entrada - No recibirá datos`);
      }
      
      if (outgoing.length === 0) {
        results.warnings.push(`Procesador "${processor.name}" sin salida - Los datos se perderán`);
      }
    });

    // 🔍 DETECTAR CAMINOS MUERTOS (Dead ends)
    const deadEnds = data.nodes.filter(node => {
      const category = this.categorizeNodeV3(node);
      const outgoing = analysis.connectionMatrix[node.name]?.outgoing || [];
      
      // Un nodo que no es output pero no tiene salidas es un dead end
      return category !== 'outputs' && outgoing.length === 0;
    });

    if (deadEnds.length > 0) {
      results.warnings.push(`Caminos muertos detectados: ${deadEnds.map(n => n.name).join(', ')}`);
    }

    // 🔍 DETECTAR NODOS INALCANZABLES
    const reachableNodes = new Set();
    const traverse = (nodeName) => {
      if (reachableNodes.has(nodeName)) return;
      reachableNodes.add(nodeName);
      
      const outgoing = analysis.connectionMatrix[nodeName]?.outgoing || [];
      outgoing.forEach(target => traverse(target));
    };

    // Comenzar desde todos los triggers
    analysis.triggers.forEach(trigger => traverse(trigger.name));

    const unreachableNodes = data.nodes.filter(node => !reachableNodes.has(node.name));
    if (unreachableNodes.length > 0) {
      results.errors.push(`Nodos inalcanzables: ${unreachableNodes.map(n => n.name).join(', ')}`);
    }
  }

  // Validar integridad de conexiones
  validateConnectionIntegrity(data, results) {
    Object.keys(data.connections).forEach(sourceName => {
      const conns = data.connections[sourceName];
      if (!conns.main || !Array.isArray(conns.main)) {
        results.errors.push(`Estructura de conexión inválida en ${sourceName}`);
        return;
      }

      conns.main.forEach((mainArray, idx) => {
        if (Array.isArray(mainArray)) {
          const targets = mainArray.map(c => c.node);
          const uniqueTargets = [...new Set(targets)];
          if (targets.length !== uniqueTargets.length) {
            results.warnings.push(`Conexiones duplicadas en ${sourceName}[${idx}]`);
          }
        }
      });
    });
  }

  // V3.0 - Validación avanzada de configuraciones de nodo
  validateNodeConfigurationsV3(workflowData) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      fixes: []
    };

    if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
      validation.valid = false;
      validation.errors.push('No se encontraron nodos válidos en el workflow');
      return validation;
    }

    workflowData.nodes.forEach((node, index) => {
      // Validación básica de estructura del nodo
      if (!node.name || typeof node.name !== 'string') {
        validation.errors.push(`Nodo ${index}: Falta nombre válido`);
        validation.valid = false;
      }

      if (!node.type || typeof node.type !== 'string') {
        validation.errors.push(`Nodo ${node.name || index}: Falta tipo válido`);
        validation.valid = false;
      }

      if (!node.parameters || typeof node.parameters !== 'object') {
        validation.warnings.push(`Nodo ${node.name}: Parámetros faltantes o inválidos`);
        node.parameters = {};
        validation.fixes.push(`Inicializados parámetros vacíos para ${node.name}`);
      }

      // Validaciones específicas por tipo de nodo
      this.validateSpecificNodeType(node, validation);

      // Validación de posición del nodo
      if (!node.position || typeof node.position !== 'object') {
        validation.warnings.push(`Nodo ${node.name}: Posición faltante`);
        node.position = [100 + index * 200, 100];
        validation.fixes.push(`Asignada posición por defecto a ${node.name}`);
      } else {
        if (!Array.isArray(node.position) || node.position.length !== 2) {
          node.position = [100 + index * 200, 100];
          validation.fixes.push(`Corregida posición de ${node.name}`);
        }
      }

      // Validación de typeVersion
      if (!node.typeVersion || typeof node.typeVersion !== 'number') {
        node.typeVersion = 1;
        validation.fixes.push(`Asignada typeVersion por defecto a ${node.name}`);
      }

      // Validación de campos requeridos específicos
      this.validateRequiredFields(node, validation);
    });

    return validation;
  }

  validateSpecificNodeType(node, validation) {
    const nodeType = node.type;
    
    switch (nodeType) {
      case 'n8n-nodes-base.start':
      case 'n8n-nodes-base.manualTrigger':
        // Los triggers no necesitan configuraciones especiales
        break;

      case 'n8n-nodes-base.httpRequest':
        if (!node.parameters.url) {
          validation.warnings.push(`Nodo HTTP Request ${node.name}: Falta URL`);
          node.parameters.url = 'https://api.example.com';
          validation.fixes.push(`URL por defecto asignada a ${node.name}`);
        }
        if (!node.parameters.requestMethod) {
          node.parameters.requestMethod = 'GET';
          validation.fixes.push(`Método GET asignado por defecto a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.webhook':
        if (!node.parameters.httpMethod) {
          node.parameters.httpMethod = 'POST';
          validation.fixes.push(`Método POST asignado por defecto a webhook ${node.name}`);
        }
        if (!node.parameters.path) {
          node.parameters.path = `/webhook-${(node.name || '').toLowerCase().replace(/\s+/g, '-')}`;
          validation.fixes.push(`Ruta por defecto asignada a webhook ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.set':
        if (!node.parameters.values || !node.parameters.values.string) {
          validation.warnings.push(`Nodo Set ${node.name}: Faltan valores a establecer`);
          if (!node.parameters.values) node.parameters.values = {};
          if (!node.parameters.values.string) node.parameters.values.string = [];
          validation.fixes.push(`Valores vacíos inicializados para ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.if':
        if (!node.parameters.conditions || !node.parameters.conditions.string) {
          validation.warnings.push(`Nodo IF ${node.name}: Faltan condiciones`);
          if (!node.parameters.conditions) node.parameters.conditions = {};
          if (!node.parameters.conditions.string) {
            node.parameters.conditions.string = [{
              value1: '{{$json["field"]}}',
              operation: 'equal',
              value2: 'value'
            }];
          }
          validation.fixes.push(`Condición básica asignada a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.function':
      case 'n8n-nodes-base.functionItem':
        if (!node.parameters.functionCode) {
          validation.warnings.push(`Nodo Function ${node.name}: Falta código de función`);
          node.parameters.functionCode = 'return items;';
          validation.fixes.push(`Código básico asignado a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.code':
        if (!node.parameters.jsCode) {
          validation.warnings.push(`Nodo Code ${node.name}: Falta código JavaScript`);
          node.parameters.jsCode = 'return $input.all();';
          validation.fixes.push(`Código básico asignado a ${node.name}`);
        }
        if (!node.parameters.mode) {
          node.parameters.mode = 'runOnceForAllItems';
          validation.fixes.push(`Modo por defecto asignado a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.wait':
        if (!node.parameters.amount || !node.parameters.unit) {
          validation.warnings.push(`Nodo Wait ${node.name}: Faltan parámetros de tiempo`);
          if (!node.parameters.amount) node.parameters.amount = 1;
          if (!node.parameters.unit) node.parameters.unit = 'seconds';
          validation.fixes.push(`Tiempo por defecto (1 segundo) asignado a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.merge':
        if (!node.parameters.mode) {
          node.parameters.mode = 'append';
          validation.fixes.push(`Modo append asignado por defecto a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.itemLists':
        if (!node.parameters.operation) {
          node.parameters.operation = 'splitInBatches';
          validation.fixes.push(`Operación por defecto asignada a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.switch':
        if (!node.parameters.rules || !Array.isArray(node.parameters.rules) || node.parameters.rules.length === 0) {
          validation.warnings.push(`Nodo Switch ${node.name}: Faltan reglas de decisión`);
          node.parameters.rules = [{
            conditions: { string: [{ value1: '{{$json["field"]}}', operation: 'equal', value2: 'value' }] },
            output: 0
          }];
          validation.fixes.push(`Regla básica asignada a ${node.name}`);
        }
        break;

      case 'n8n-nodes-base.filter':
        if (!node.parameters.conditions || !node.parameters.conditions.string) {
          validation.warnings.push(`Nodo Filter ${node.name}: Faltan condiciones de filtro`);
          if (!node.parameters.conditions) node.parameters.conditions = {};
          if (!node.parameters.conditions.string) {
            node.parameters.conditions.string = [{
              value1: '{{$json["field"]}}',
              operation: 'exists'
            }];
          }
          validation.fixes.push(`Condición de filtro básica asignada a ${node.name}`);
        }
        break;

      default:
        // Validación genérica para otros tipos de nodos
        if (!node.parameters || Object.keys(node.parameters).length === 0) {
          validation.warnings.push(`Nodo ${node.name} (${nodeType}): Configuración mínima detectada`);
        }
        break;
    }
  }

  validateRequiredFields(node, validation) {
    // Campos requeridos comunes
    const requiredFields = ['name', 'type', 'position', 'parameters'];
    
    requiredFields.forEach(field => {
      if (!node[field]) {
        validation.errors.push(`Nodo ${node.name || 'unknown'}: Campo requerido '${field}' faltante`);
        validation.valid = false;
      }
    });

    // Validar IDs únicos
    if (!node.id || typeof node.id !== 'string') {
      node.id = this.generateNodeId();
      validation.fixes.push(`ID generado para ${node.name}`);
    }
  }

  // V3.0 - Validación completa de integridad del workflow
  validateWorkflowIntegrityV3(workflowData) {
    console.log('🔍 Iniciando validación completa de integridad V3.0...');
    
    const integrity = {
      valid: true,
      score: 100,
      errors: [],
      warnings: [],
      fixes: [],
      details: {
        nodes: { valid: true, count: 0, issues: [] },
        connections: { valid: true, count: 0, issues: [] },
        configurations: { valid: true, issues: [] },
        topology: { valid: true, issues: [] }
      }
    };

    try {
      // 1. Validar estructura básica
      if (!workflowData || typeof workflowData !== 'object') {
        integrity.valid = false;
        integrity.errors.push('Datos del workflow inválidos');
        integrity.score = 0;
        return integrity;
      }

      // 2. Validar configuraciones de nodos
      const nodeValidation = this.validateNodeConfigurationsV3(workflowData);
      integrity.details.configurations.valid = nodeValidation.valid;
      integrity.details.configurations.issues = [...nodeValidation.errors, ...nodeValidation.warnings];
      integrity.errors.push(...nodeValidation.errors);
      integrity.warnings.push(...nodeValidation.warnings);
      integrity.fixes.push(...nodeValidation.fixes);

      // 3. Validar conexiones con V3.0
      const connectionValidation = this.validateWorkflowConnectionsV3(workflowData);
      integrity.details.connections.valid = connectionValidation.valid;
      integrity.details.connections.count = connectionValidation.validConnections || 0;
      integrity.details.connections.issues = [...connectionValidation.errors, ...connectionValidation.warnings];
      integrity.errors.push(...connectionValidation.errors);
      integrity.warnings.push(...connectionValidation.warnings);

      // 4. Validar topología
      const topologyAnalysis = this.analyzeWorkflowTopologyV3(workflowData);
      integrity.details.topology.valid = topologyAnalysis.isValid || true;
      integrity.details.topology.issues = topologyAnalysis.issues || [];
      
      if (topologyAnalysis.orphanNodes && topologyAnalysis.orphanNodes.length > 0) {
        integrity.warnings.push(`${topologyAnalysis.orphanNodes.length} nodos huérfanos detectados`);
      }

      // 5. Validar lógica de flujo (V3.0)
      const logicValidation = this.validateWorkflowLogicV3(workflowData);
      if (!logicValidation.valid) {
        integrity.details.topology.issues.push(...(logicValidation.issues || []));
        integrity.warnings.push(...(logicValidation.issues || []));
      }
      if (logicValidation.suggestions && logicValidation.suggestions.length > 0) {
        integrity.warnings.push(`Sugerencias de optimización: ${logicValidation.suggestions.join(', ')}`);
      }

      // 6. Calcular score de integridad
      let deductions = 0;
      deductions += integrity.errors.length * 20;
      deductions += integrity.warnings.length * 5;
      integrity.score = Math.max(0, 100 - deductions);

      integrity.valid = integrity.errors.length === 0 && integrity.score >= 60;

      console.log(`✅ Validación completa - Score: ${integrity.score}/100, Válido: ${integrity.valid}`);
      
      return integrity;

    } catch (error) {
      console.error('❌ Error en validación de integridad:', error);
      integrity.valid = false;
      integrity.score = 0;
      integrity.errors.push(`Error interno de validación: ${error.message}`);
      return integrity;
    }
  }

  // V3.0 - Validación de lógica de flujo del workflow
  validateWorkflowLogicV3(workflowData) {
    console.log('🧠 Analizando lógica de flujo del workflow...');
    
    const logic = {
      valid: true,
      issues: [],
      suggestions: [],
      flowPaths: []
    };

    if (!workflowData.nodes || !workflowData.connections) {
      logic.valid = false;
      logic.issues.push('Estructura del workflow incompleta');
      return logic;
    }

    const nodes = workflowData.nodes;
    const connections = workflowData.connections;

    // Detectar patrones problemáticos
    this.detectProblematicPatterns(nodes, connections, logic);
    
    // Analizar flujos lógicos
    this.analyzeLogicalFlows(nodes, connections, logic);
    
    // Validar configuraciones contextuales
    this.validateContextualConfigurations(nodes, connections, logic);

    return logic;
  }

  detectProblematicPatterns(nodes, connections, logic) {
    // 1. Detectar nodos sin propósito claro
    const purposelessNodes = nodes.filter(node => {
      if (node.type === 'n8n-nodes-base.set' && 
          (!node.parameters.values || !node.parameters.values.string || 
           node.parameters.values.string.length === 0)) {
        return true;
      }
      return false;
    });

    if (purposelessNodes.length > 0) {
      logic.issues.push(`${purposelessNodes.length} nodos Set sin configuración útil`);
      logic.suggestions.push('Configurar o eliminar nodos Set vacíos');
    }

    // 2. Detectar funciones duplicadas
    const functionNodes = nodes.filter(node => 
      node.type === 'n8n-nodes-base.function' || 
      node.type === 'n8n-nodes-base.functionItem'
    );

    const duplicateFunctions = this.findDuplicateFunctions(functionNodes);
    if (duplicateFunctions.length > 0) {
      logic.issues.push(`${duplicateFunctions.length} funciones potencialmente duplicadas`);
      logic.suggestions.push('Consolidar funciones similares en una sola');
    }

    // 3. Detectar cadenas innecesariamente largas
    const paths = this.findAllPaths(nodes, connections);
    const longPaths = paths.filter(path => path.length > 10);
    
    if (longPaths.length > 0) {
      logic.issues.push(`${longPaths.length} cadenas de nodos muy largas (>10 nodos)`);
      logic.suggestions.push('Considerar subdividir en workflows más pequeños');
    }
  }

  analyzeLogicalFlows(nodes, connections, logic) {
    const triggerNodes = nodes.filter(node => 
      node.type.includes('trigger') || 
      node.type === 'n8n-nodes-base.start' ||
      node.type === 'n8n-nodes-base.manualTrigger'
    );

    const outputNodes = nodes.filter(node =>
      node.type.includes('webhook') ||
      node.type.includes('email') ||
      node.type.includes('slack') ||
      node.type.includes('discord') ||
      !this.hasOutgoingConnections(node.name, connections)
    );

    // Analizar cada flujo desde trigger a output
    triggerNodes.forEach(trigger => {
      const flows = this.traceFlowPaths(trigger.name, connections, nodes);
      logic.flowPaths.push({
        trigger: trigger.name,
        paths: flows,
        complete: flows.some(path => 
          outputNodes.some(output => path.includes(output.name))
        )
      });
    });

    // Verificar que todos los flujos sean completos
    const incompleteFlows = logic.flowPaths.filter(flow => !flow.complete);
    if (incompleteFlows.length > 0) {
      logic.issues.push(`${incompleteFlows.length} flujos no llegan a un nodo de salida`);
      logic.suggestions.push('Agregar nodos de salida a todos los flujos');
    }
  }

  validateContextualConfigurations(nodes, connections, logic) {
    // Validar configuraciones que dependen del contexto
    nodes.forEach(node => {
      const incomingConnections = this.getIncomingConnections(node.name, connections);
      const outgoingConnections = this.getOutgoingConnections(node.name, connections);

      // Validar nodos IF con múltiples salidas
      if (node.type === 'n8n-nodes-base.if' && outgoingConnections.length < 2) {
        logic.issues.push(`Nodo IF ${node.name} debería tener al menos 2 salidas (true/false)`);
        logic.suggestions.push(`Configurar ambas ramas del IF en ${node.name}`);
      }

      // Validar nodos Switch
      if (node.type === 'n8n-nodes-base.switch') {
        const rules = node.parameters.rules || [];
        if (outgoingConnections.length !== rules.length + 1) {
          logic.issues.push(`Nodo Switch ${node.name} tiene desbalance entre reglas y salidas`);
          logic.suggestions.push(`Ajustar conexiones del Switch ${node.name}`);
        }
      }

      // Validar nodos Merge esperando múltiples entradas
      if (node.type === 'n8n-nodes-base.merge' && incomingConnections.length < 2) {
        logic.issues.push(`Nodo Merge ${node.name} necesita al menos 2 entradas`);
        logic.suggestions.push(`Conectar múltiples flujos al Merge ${node.name}`);
      }
    });
  }

  findDuplicateFunctions(functionNodes) {
    const duplicates = [];
    const seenCode = new Map();

    functionNodes.forEach(node => {
      const code = node.parameters.functionCode || '';
      const normalizedCode = code.replace(/\s+/g, ' ').trim();
      
      if (seenCode.has(normalizedCode)) {
        duplicates.push({
          original: seenCode.get(normalizedCode),
          duplicate: node.name
        });
      } else {
        seenCode.set(normalizedCode, node.name);
      }
    });

    return duplicates;
  }

  findAllPaths(nodes, connections) {
    // Implementación simplificada para encontrar todos los caminos
    const paths = [];
    const visited = new Set();
    
    const nodeMap = new Map(nodes.map(node => [node.name, node]));
    
    const dfs = (nodeName, currentPath) => {
      if (visited.has(nodeName)) return;
      
      const newPath = [...currentPath, nodeName];
      const outgoing = this.getOutgoingConnections(nodeName, connections);
      
      if (outgoing.length === 0) {
        paths.push(newPath);
        return;
      }

      outgoing.forEach(targetNode => {
        dfs(targetNode, newPath);
      });
    };

    // Iniciar DFS desde nodos trigger
    nodes.filter(node => 
      node.type.includes('trigger') || 
      node.type === 'n8n-nodes-base.start'
    ).forEach(trigger => {
      visited.clear();
      dfs(trigger.name, []);
    });

    return paths;
  }

  traceFlowPaths(startNode, connections, nodes) {
    const paths = [];
    const visited = new Set();

    const dfs = (nodeName, path) => {
      if (visited.has(nodeName)) return;
      visited.add(nodeName);
      
      const newPath = [...path, nodeName];
      const outgoing = this.getOutgoingConnections(nodeName, connections);
      
      if (outgoing.length === 0) {
        paths.push(newPath);
        visited.delete(nodeName);
        return;
      }

      outgoing.forEach(targetNode => {
        dfs(targetNode, newPath);
      });
      
      visited.delete(nodeName);
    };

    dfs(startNode, []);
    return paths;
  }

  hasOutgoingConnections(nodeName, connections) {
    return connections[nodeName] && 
           connections[nodeName].main && 
           connections[nodeName].main.length > 0;
  }

  getIncomingConnections(nodeName, connections) {
    const incoming = [];
    Object.keys(connections).forEach(sourceNode => {
      if (connections[sourceNode].main) {
        connections[sourceNode].main.forEach(connectionArray => {
          if (connectionArray) {
            connectionArray.forEach(conn => {
              if (conn.node === nodeName) {
                incoming.push(sourceNode);
              }
            });
          }
        });
      }
    });
    return incoming;
  }

  getOutgoingConnections(nodeName, connections) {
    const outgoing = [];
    if (connections[nodeName] && connections[nodeName].main) {
      connections[nodeName].main.forEach(connectionArray => {
        if (connectionArray) {
          connectionArray.forEach(conn => {
            outgoing.push(conn.node);
          });
        }
      });
    }
    return outgoing;
  }

  // Sistema de reparación V3.0
  repairWorkflowConnectionsV3(data) {
    console.log('🔧 REPARACIÓN INTELIGENTE DE CONEXIONES V3.0...');
    
    const validation = this.validateWorkflowConnectionsV3(data);
    let totalRepairs = 0;

    // 1. Limpiar referencias rotas
    totalRepairs += this.cleanBrokenConnections(data);
    
    // 2. Conectar nodos aislados
    totalRepairs += this.connectOrphanNodes(data, validation.analysis);
    
    // 3. Optimizar flujo
    totalRepairs += this.optimizeConnectionFlow(data, validation.analysis);

    console.log(`✅ Reparación V3.0: ${totalRepairs} correcciones aplicadas`);
    return totalRepairs;
  }

  // Limpiar conexiones rotas
  cleanBrokenConnections(data) {
    let cleanups = 0;
    const nodeNames = new Set(data.nodes.map(n => n.name));

    // VERIFICAR QUE EXISTAN CONEXIONES
    if (!data.connections) {
      return 0;
    }

    Object.keys(data.connections).forEach(sourceName => {
      if (!nodeNames.has(sourceName)) {
        delete data.connections[sourceName];
        console.log(`🗑️ Limpiada conexión de nodo inexistente: ${sourceName}`);
        cleanups++;
        return;
      }

      const conns = data.connections[sourceName];
      if (conns.main) {
        conns.main = conns.main.map(mainArray => {
          if (Array.isArray(mainArray)) {
            return mainArray.filter(conn => {
              if (!nodeNames.has(conn.node)) {
                console.log(`🗑️ Limpiada conexión rota: ${sourceName} → ${conn.node}`);
                cleanups++;
                return false;
              }
              return true;
            });
          }
          return mainArray;
        }).filter(mainArray => mainArray.length > 0);

        if (conns.main.length === 0) {
          delete data.connections[sourceName];
        }
      }
    });

    return cleanups;
  }

  // Conectar nodos huérfanos
  connectOrphanNodes(data, analysis) {
    let connections = 0;

    // INICIALIZAR CONEXIONES SI NO EXISTEN
    if (!data.connections) {
      data.connections = {};
    }

    // Conectar triggers sin salida
    analysis.triggers.forEach(trigger => {
      if (analysis.connectionMatrix[trigger.name].outgoing.length === 0) {
        const target = analysis.processors[0] || analysis.outputs[0];
        if (target) {
          if (!data.connections[trigger.name]) {
            data.connections[trigger.name] = { main: [[]] };
          }
          // Asegurar que main[0] existe
          if (!data.connections[trigger.name].main[0]) {
            data.connections[trigger.name].main[0] = [];
          }
          data.connections[trigger.name].main[0].push({
            node: target.name, type: 'main', index: 0
          });
          console.log(`🔗 Trigger conectado: ${trigger.name} → ${target.name}`);
          connections++;
        }
      }
    });

    // Conectar outputs sin entrada
    analysis.outputs.forEach(output => {
      if (analysis.connectionMatrix[output.name].incoming.length === 0) {
        const source = analysis.processors[analysis.processors.length - 1] || analysis.triggers[0];
        if (source) {
          if (!data.connections[source.name]) {
            data.connections[source.name] = { main: [[]] };
          }
          // Asegurar que main[0] existe
          if (!data.connections[source.name].main[0]) {
            data.connections[source.name].main[0] = [];
          }
          data.connections[source.name].main[0].push({
            node: output.name, type: 'main', index: 0
          });
          console.log(`🔗 Output conectado: ${source.name} → ${output.name}`);
          connections++;
        }
      }
    });

    return connections;
  }

  // Optimizar flujo de conexiones
  optimizeConnectionFlow(data, analysis) {
    let optimizations = 0;

    // INICIALIZAR CONEXIONES SI NO EXISTEN
    if (!data.connections) {
      data.connections = {};
    }

    // Crear secuencia entre procesadores
    for (let i = 0; i < analysis.processors.length - 1; i++) {
      const current = analysis.processors[i];
      const next = analysis.processors[i + 1];
      
      if (analysis.connectionMatrix[next.name].incoming.length === 0) {
        if (!data.connections[current.name]) data.connections[current.name] = { main: [[]] };
        if (!data.connections[current.name].main[0]) data.connections[current.name].main[0] = [];
        
        data.connections[current.name].main[0].push({
          node: next.name, type: 'main', index: 0
        });
        console.log(`🔗 Secuencia optimizada: ${current.name} → ${next.name}`);
        optimizations++;
      }
    }

    return optimizations;
  }

  // 🧠 MÉTODO AUXILIAR PARA AUTOCORRECCIÓN: Extraer dominio del prompt
  extractDomainFromPrompt(prompt) {
    const promptLower = prompt.toLowerCase();
    
    // Dominios específicos basados en palabras clave
    if (promptLower.includes('ecommerce') || promptLower.includes('e-commerce') || 
        promptLower.includes('tienda') || promptLower.includes('pedidos') || 
        promptLower.includes('carrito') || promptLower.includes('ventas')) {
      return 'ecommerce';
    }
    
    if (promptLower.includes('crm') || promptLower.includes('leads') || 
        promptLower.includes('clientes') || promptLower.includes('contactos') ||
        promptLower.includes('seguimiento')) {
      return 'crm';
    }
    
    if (promptLower.includes('marketing') || promptLower.includes('email marketing') ||
        promptLower.includes('campaña') || promptLower.includes('newsletter') ||
        promptLower.includes('promociones')) {
      return 'marketing';
    }
    
    if (promptLower.includes('datos') || promptLower.includes('procesamiento') ||
        promptLower.includes('análisis') || promptLower.includes('transformar') ||
        promptLower.includes('csv') || promptLower.includes('excel')) {
      return 'data-processing';
    }
    
    if (promptLower.includes('automatización') || promptLower.includes('automático') ||
        promptLower.includes('trigger') || promptLower.includes('webhook') ||
        promptLower.includes('notificación')) {
      return 'automation';
    }
    
    // Dominio genérico por defecto
    return 'general';
  }
}

// Exportar la clase para testing
export default N8nAIAssistant;

// Ejecutar la función principal
main().catch(console.error);

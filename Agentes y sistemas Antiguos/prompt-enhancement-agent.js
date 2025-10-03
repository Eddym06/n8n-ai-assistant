// Prompt Enhancement Agent - Versión corregida enfocada en QUÉ hacer
// Sistema para mejorar prompts vagos en descripciones funcionales claras

import { GoogleGenerativeAI } from '@google/generative-ai';
import GeminiCallTracker from './gemini-call-tracker.js';

class PromptEnhancementAgent {
  constructor(options = {}) {
    this.options = {
      maxEnhancements: options.maxEnhancements || 5,
      qualityThreshold: options.qualityThreshold || 0.7,
      creativityLevel: options.creativityLevel || 0.5,
      detailLevel: options.detailLevel || 0.8
    };

    // 🧠 SISTEMA HÍBRIDO DE DETECCIÓN DE COMPLEJIDAD DE PROMPTS
    this.promptComplexityAnalyzer = {
      // Indicadores de prompts VAGOS (usuarios novatos) - Score: 0.1-0.3
      vagueIndicators: {
        basicWords: ['hacer algo', 'crear sistema', 'automatizar', 'procesar', 'manejar'],
        simpleActions: ['enviar', 'recibir', 'guardar', 'cargar', 'conectar', 'integrar'],
        basicTech: ['transcribir', 'convertir', 'generar', 'validar', 'verificar'],
        consumerTerms: ['usar ia', 'usar ai', 'chatbot', 'whatsapp', 'email', 'base de datos'],
        vagueRequests: ['quiero', 'necesito', 'puede hacer', 'ayuda con', 'como hago']
      },
      
      // Indicadores de prompts INTERMEDIOS (usuarios con algo de experiencia) - Score: 0.4-0.6
      intermediateIndicators: {
        workflowTerms: ['workflow', 'trigger', 'node', 'connection', 'parameter', 'configuration'],
        businessTerms: ['integration', 'synchronization', 'mapping', 'filtering', 'transformation'],
        operationalTerms: ['notification', 'monitoring', 'logging', 'scheduling', 'routing'],
        platformTerms: ['api', 'webhook', 'database', 'crm', 'erp', 'saas']
      },
      
      // Indicadores de prompts AVANZADOS (usuarios expertos) - Score: 0.7-1.0
      advancedIndicators: {
        technicalSpecs: ['webhook', 'api endpoint', 'json schema', 'http headers', 'authentication'],
        advancedAuth: ['oauth', 'jwt token', 'rate limiting', 'pagination', 'batch processing'],
        errorHandling: ['error handling', 'retry logic', 'conditional logic', 'exception handling'],
        dataProcessing: ['data transformation', 'regex patterns', 'xpath selectors', 'sql queries'],
        advancedProtocols: ['graphql', 'rest api', 'soap', 'xml parsing', 'csv processing'],
        systemLevel: ['binary data', 'file upload', 'streaming', 'async processing'],
        architecture: ['queue management', 'load balancing', 'circuit breaker', 'microservices'],
        n8nSpecific: ['n8n-nodes-base', 'operation:', 'resource:', 'parameters:', 'credentials:'],
        expressions: ['{{$json', '{{$node', '{{$parameter', '{{$env', '{{$execution']
      }
    };

    this.qualityMetrics = {
      clarity: 0,
      specificity: 0,
      completeness: 0,
      actionability: 0,
      vagueness: 0,
      technicalLevel: 0,  // Nuevo: mide nivel técnico del prompt
      complexityScore: 0  // Nuevo: score de complejidad 0-1
    };

    // Inicializar Gemini AI si está disponible
    try {
      if (process.env.GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('🤖 Gemini AI habilitado para análisis inteligente de prompts');
      } else {
        console.log('⚠️ Gemini AI no disponible, usando análisis básico');
      }
    } catch (error) {
      console.log('⚠️ Gemini AI no disponible, usando análisis básico');
    }

    // Transformadores funcionales enfocados en objetivos
    this.enhancementMethods = {
      clarity: this.enhanceClarity.bind(this),
      specificity: this.enhanceSpecificity.bind(this),
      structure: this.enhanceStructure.bind(this),
      functional_workflow: this.enhanceFunctionalWorkflow.bind(this),
      gemini_enhancement: this.generateGeminiEnhancements.bind(this)
    };

    // Lista de nodos válidos de n8n para validación
    this.validN8nNodes = {
      triggers: [
        'n8n-nodes-base.manualTrigger',
        'n8n-nodes-base.scheduleTrigger', 
        'n8n-nodes-base.cron',
        'n8n-nodes-base.webhook',
        'n8n-nodes-base.emailTrigger',
        'n8n-nodes-base.telegramTrigger',
        'n8n-nodes-base.formTrigger'
      ],
      actions: [
        'n8n-nodes-base.set',
        'n8n-nodes-base.function',
        'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.if',
        'n8n-nodes-base.switch',
        'n8n-nodes-base.loopOverItems',
        'n8n-nodes-base.merge',
        'n8n-nodes-base.splitInBatches',
        'n8n-nodes-base.wait'
      ],
      communication: [
        'n8n-nodes-base.gmail',
        'n8n-nodes-base.telegram',
        'n8n-nodes-base.slack',
        'n8n-nodes-base.discord',
        'n8n-nodes-base.twilio',
        'n8n-nodes-base.sendgrid'
      ],
      data: [
        'n8n-nodes-base.googleSheets',
        'n8n-nodes-base.airtable',
        'n8n-nodes-base.mysql',
        'n8n-nodes-base.postgres',
        'n8n-nodes-base.mongodb',
        'n8n-nodes-base.redis',
        'n8n-nodes-base.spreadsheetFile',
        'n8n-nodes-base.csv',
        'n8n-nodes-base.supabase',
        'n8n-nodes-base.firebase'
      ],
      ai: [
        'n8n-nodes-base.openAi',
        'n8n-nodes-base.agent',
        'n8n-nodes-base.anthropic',
        'n8n-nodes-base.gemini',
        'n8n-nodes-base.embeddings',
        'n8n-nodes-base.vectorStore'
      ],
      productivity: [
        'n8n-nodes-base.googleCalendar',
        'n8n-nodes-base.outlook',
        'n8n-nodes-base.notion',
        'n8n-nodes-base.todoist'
      ]
    };

    // 🚨 MAPEO CRÍTICO: Operaciones válidas por tipo de nodo para evitar errores
    this.validNodeOperations = {
      'n8n-nodes-base.openAi': {
        validOperations: ['chat', 'completion', 'text', 'image', 'audio', 'embedding', 'moderation', 'analyze', 'predict'],
        commonMistakes: {
          'transcribeAudio': 'audio',
          'transcribe': 'audio',
          'speech-to-text': 'audio',
          'stt': 'audio',
          'whisper': 'audio',
          'voiceToText': 'audio',
          'audioTranscription': 'audio',
          'generateText': 'chat',
          'generateResponse': 'chat',
          'askQuestion': 'chat',
          'chatGPT': 'chat',
          'complete': 'completion',
          'textCompletion': 'completion'
        },
        examples: {
          'audio': '{"operation": "audio", "model": "whisper-1", "audioInput": "{{$json.audioFile}}"}',
          'chat': '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.message}}"}]}',
          'completion': '{"operation": "completion", "model": "gpt-3.5-turbo", "prompt": "{{$json.prompt}}"}'
        }
      },
      'n8n-nodes-base.googleSheets': {
        validOperations: ['append', 'getAll', 'update', 'clear', 'delete', 'read'],
        commonMistakes: {
          'read': 'getAll',
          'get': 'getAll',
          'fetch': 'getAll',
          'load': 'getAll',
          'insert': 'append',
          'add': 'append',
          'create': 'append',
          'write': 'append',
          'save': 'append'
        },
        examples: {
          'getAll': '{"operation": "getAll", "spreadsheetId": "SHEET_ID", "sheetName": "Sheet1", "returnAllFields": true}',
          'append': '{"operation": "append", "spreadsheetId": "SHEET_ID", "sheetName": "Sheet1", "range": "A:Z"}'
        }
      },
      'n8n-nodes-base.httpRequest': {
        validOperations: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        commonMistakes: {
          'whatsapp': 'POST',
          'whatsAppSend': 'POST',
          'sendWhatsApp': 'POST',
          'whatsAppMessage': 'POST',
          'telegram': 'POST',
          'telegramSend': 'POST',
          'api': 'GET',
          'fetch': 'GET',
          'call': 'GET'
        },
        examples: {
          'POST': '{"method": "POST", "url": "https://api.example.com/endpoint", "body": "{{$json.data}}"}',
          'GET': '{"method": "GET", "url": "https://api.example.com/data", "headers": {"Authorization": "Bearer TOKEN"}}'
        }
      },
      'n8n-nodes-base.if': {
        validOperations: ['equal', 'notEqual', 'larger', 'smaller', 'contains', 'notContains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
        commonMistakes: {
          'equals': 'equal',
          'notEquals': 'notEqual',
          'greaterThan': 'larger',
          'lessThan': 'smaller',
          'includes': 'contains',
          'hasValue': 'isNotEmpty',
          'hasNoValue': 'isEmpty',
          'beginsWith': 'startsWith',
          'finishesWith': 'endsWith'
        },
        examples: {
          'equal': '{"conditions": [{"leftValue": "{{$json.type}}", "operation": "equal", "rightValue": "audio"}]}',
          'contains': '{"conditions": [{"leftValue": "{{$json.message}}", "operation": "contains", "rightValue": "audio"}]}'
        },
        // 🎯 CONOCIMIENTO ESPECÍFICO PARA NODO IF
        usagePatterns: {
          messageTypeDetection: {
            condition: '{{$json.message.type}} equal "audio"',
            trueOutput: 'Procesar con transcripción de audio',
            falseOutput: 'Procesar como texto o mostrar error si es sticker/imagen',
            description: 'Detectar si el mensaje es audio, texto, sticker, imagen, etc.'
          },
          contentValidation: {
            condition: '{{$json.message.type}} contains "text,audio"',
            trueOutput: 'Procesar con IA',
            falseOutput: 'Enviar mensaje de error: "Tipo de mensaje no soportado"',
            description: 'Validar que el contenido sea procesable (texto o audio)'
          },
          businessLogic: {
            condition: '{{$json.classification}} equal "product_inquiry"',
            trueOutput: 'Buscar en base de datos de productos',
            falseOutput: 'Buscar en base de datos de servicios',
            description: 'Enrutar según clasificación de intención'
          }
        }
      },
      'n8n-nodes-base.merge': {
        validOperations: ['merge', 'combine', 'union'],
        commonMistakes: {
          'join': 'merge',
          'concatenate': 'merge',
          'append': 'merge',
          'concat': 'merge'
        },
        examples: {
          'merge': '{"mode": "multiplex", "options": {}}'
        },
        // 🎯 CONOCIMIENTO ESPECÍFICO PARA NODO MERGE
        usagePatterns: {
          multipleInputSources: {
            inputs: ['textMessage', 'audioMessage', 'imageMessage'],
            output: 'unifiedMessage',
            description: 'Recibir múltiples tipos de mensajes y unificarlos para procesamiento'
          },
          databaseDataConsolidation: {
            inputs: ['products', 'services', 'inventory'],
            outputs: ['audioProducts', 'imageProducts', 'textProducts'],
            description: 'Consolidar datos de múltiples fuentes y clasificar por tipo'
          },
          agentInputPreparation: {
            inputs: ['userMessage', 'context', 'history'],
            output: 'agentInput',
            description: 'Preparar entrada completa para agente IA con contexto'
          },
          responseAggregation: {
            inputs: ['aiResponse', 'databaseResults', 'userPreferences'],
            output: 'finalResponse',
            description: 'Combinar respuesta de IA con datos y preferencias'
          }
        }
      },
      'n8n-nodes-base.agent': {
        validOperations: ['execute', 'run', 'process'],
        commonMistakes: {
          'ask': 'execute',
          'query': 'execute',
          'analyze': 'execute',
          'classify': 'execute',
          'generate': 'execute'
        },
        examples: {
          'execute': '{"task": "{{$json.task}}", "model": "gpt-4", "instructions": "{{$json.instructions}}", "tools": []}'
        },
        // 🎯 CONOCIMIENTO ESPECÍFICO PARA NODO AI AGENT
        usagePatterns: {
          messageClassification: {
            task: 'Clasificar la intención del mensaje del usuario',
            instructions: 'Analiza el mensaje y determina si es: consulta_producto, consulta_servicio, soporte_tecnico, informacion_general',
            input: '{{$json.userMessage}}',
            output: 'classification',
            tools: ['text_analyzer'],
            description: 'Clasificar intención de mensajes para enrutamiento'
          },
          productRecommendation: {
            task: 'Recomendar productos basado en consulta del usuario',
            instructions: 'Basado en el mensaje del usuario y el inventario disponible, recomienda los 3 mejores productos',
            input: '{{$json.userMessage}} + {{$json.inventory}}',
            output: 'recommendations',
            tools: ['database_search', 'text_analyzer'],
            description: 'Generar recomendaciones personalizadas de productos'
          },
          customerSupport: {
            task: 'Proporcionar soporte al cliente',
            instructions: 'Responde de manera útil y profesional a la consulta del cliente sobre productos/servicios',
            input: '{{$json.userMessage}} + {{$json.context}}',
            output: 'supportResponse',
            tools: ['knowledge_base', 'text_generator'],
            description: 'Generar respuestas de soporte inteligentes'
          },
          dataAnalysis: {
            task: 'Analizar y estructurar datos de entrada',
            instructions: 'Extrae información clave del mensaje y estructura los datos para procesamiento posterior',
            input: '{{$json.rawData}}',
            output: 'structuredData',
            tools: ['data_extractor', 'json_formatter'],
            description: 'Procesar y estructurar datos no estructurados'
          }
        }
      },
      'n8n-nodes-base.supabase': {
        validOperations: ['insert', 'select', 'update', 'delete', 'upsert'],
        commonMistakes: {
          'add': 'insert',
          'create': 'insert',
          'save': 'insert',
          'get': 'select',
          'fetch': 'select',
          'read': 'select',
          'load': 'select',
          'find': 'select'
        },
        examples: {
          'insert': '{"operation": "insert", "table": "{{$json.table}}", "rows": "{{$json.data}}"}',
          'select': '{"operation": "select", "table": "{{$json.table}}", "filters": "{{$json.filters}}"}'
        }
      }
    };

    // 🧠 TRADUCTOR INTELIGENTE: Mapeo de intenciones vagas a configuraciones técnicas
    // 🚀 MAPEO MASIVO DE INTENCIONES A ESPECIFICACIONES TÉCNICAS
    // Sistema expandido para cubrir TODOS los casos de uso empresariales
    this.intentionToTechnical = {
      // ========== COMUNICACIÓN Y MENSAJERÍA ==========
      'transcribir audio': {
        node: 'n8n-nodes-base.openAi',
        operation: 'audio',
        config: '{"operation": "audio", "model": "whisper-1", "audioInput": "{{$json.audioFile}}", "responseFormat": "text"}'
      },
      'convertir audio a texto': {
        node: 'n8n-nodes-base.openAi',
        operation: 'audio',
        config: '{"operation": "audio", "model": "whisper-1", "audioInput": "{{$json.audioFile}}", "responseFormat": "text"}'
      },
      'speech to text': {
        node: 'n8n-nodes-base.openAi',
        operation: 'audio',
        config: '{"operation": "audio", "model": "whisper-1", "audioInput": "{{$json.audioFile}}", "responseFormat": "text"}'
      },
      'procesar audio': {
        node: 'n8n-nodes-base.openAi',
        operation: 'audio',
        config: '{"operation": "audio", "model": "whisper-1", "audioInput": "{{$json.audioFile}}", "responseFormat": "text"}'
      },
      
      // WhatsApp y Mensajería
      'whatsapp': {
        node: 'n8n-nodes-base.httpRequest',
        operation: 'POST',
        config: '{"method": "POST", "url": "https://graph.facebook.com/v18.0/PHONE_ID/messages", "headers": {"Authorization": "Bearer {{$credentials.whatsAppToken}}", "Content-Type": "application/json"}, "body": {"messaging_product": "whatsapp", "to": "{{$json.phoneNumber}}", "text": {"body": "{{$json.message}}"}}}'
      },
      'enviar whatsapp': {
        node: 'n8n-nodes-base.httpRequest',
        operation: 'POST',
        config: '{"method": "POST", "url": "https://graph.facebook.com/v18.0/PHONE_ID/messages", "headers": {"Authorization": "Bearer {{$credentials.whatsAppToken}}", "Content-Type": "application/json"}, "body": {"messaging_product": "whatsapp", "to": "{{$json.phoneNumber}}", "text": {"body": "{{$json.message}}"}}}'
      },
      'mensaje whatsapp': {
        node: 'n8n-nodes-base.httpRequest',
        operation: 'POST',
        config: '{"method": "POST", "url": "https://graph.facebook.com/v18.0/PHONE_ID/messages", "headers": {"Authorization": "Bearer {{$credentials.whatsAppToken}}", "Content-Type": "application/json"}, "body": {"messaging_product": "whatsapp", "to": "{{$json.phoneNumber}}", "text": {"body": "{{$json.message}}"}}}'
      },
      'whatsapp business': {
        node: 'n8n-nodes-base.httpRequest',
        operation: 'POST',
        config: '{"method": "POST", "url": "https://graph.facebook.com/v18.0/PHONE_ID/messages", "headers": {"Authorization": "Bearer {{$credentials.whatsAppBusinessToken}}", "Content-Type": "application/json"}, "body": {"messaging_product": "whatsapp", "to": "{{$json.phoneNumber}}", "type": "template", "template": {"name": "{{$json.templateName}}", "language": {"code": "{{$json.languageCode}}"}}}}'
      },
      
      // Email y Comunicación
      'enviar email': {
        node: 'n8n-nodes-base.emailSend',
        operation: 'send',
        config: '{"fromEmail": "{{$json.fromEmail}}", "toEmail": "{{$json.toEmail}}", "subject": "{{$json.subject}}", "message": "{{$json.message}}", "format": "html"}'
      },
      'correo electronico': {
        node: 'n8n-nodes-base.emailSend',
        operation: 'send',
        config: '{"fromEmail": "{{$json.fromEmail}}", "toEmail": "{{$json.toEmail}}", "subject": "{{$json.subject}}", "message": "{{$json.message}}", "format": "html"}'
      },
      'notificacion email': {
        node: 'n8n-nodes-base.emailSend',
        operation: 'send',
        config: '{"fromEmail": "{{$json.fromEmail}}", "toEmail": "{{$json.toEmail}}", "subject": "Notificación: {{$json.subject}}", "message": "{{$json.notification}}", "format": "html"}'
      },
      'gmail': {
        node: 'n8n-nodes-base.gmail',
        operation: 'send',
        config: '{"to": "{{$json.toEmail}}", "subject": "{{$json.subject}}", "message": "{{$json.message}}", "attachments": "{{$json.attachments}}"}'
      },
      'sendgrid': {
        node: 'n8n-nodes-base.sendgrid',
        operation: 'send',
        config: '{"fromEmail": "{{$json.fromEmail}}", "fromName": "{{$json.fromName}}", "toEmail": "{{$json.toEmail}}", "subject": "{{$json.subject}}", "content": "{{$json.content}}", "contentType": "text/html"}'
      },
      
      // Telegram
      'telegram': {
        node: 'n8n-nodes-base.telegram',
        operation: 'sendMessage',
        config: '{"chatId": "{{$json.chatId}}", "text": "{{$json.message}}", "parseMode": "HTML"}'
      },
      'enviar telegram': {
        node: 'n8n-nodes-base.telegram',
        operation: 'sendMessage',
        config: '{"chatId": "{{$json.chatId}}", "text": "{{$json.message}}", "parseMode": "HTML", "disableWebPagePreview": true}'
      },
      
      // Slack y Discord
      'slack': {
        node: 'n8n-nodes-base.slack',
        operation: 'postMessage',
        config: '{"channel": "{{$json.channel}}", "text": "{{$json.message}}", "username": "{{$json.botName}}"}'
      },
      'discord': {
        node: 'n8n-nodes-base.discord',
        operation: 'sendMessage',
        config: '{"channelId": "{{$json.channelId}}", "content": "{{$json.message}}"}'
      },
      
      // SMS
      'sms': {
        node: 'n8n-nodes-base.twilio',
        operation: 'send',
        config: '{"from": "{{$json.fromNumber}}", "to": "{{$json.toNumber}}", "message": "{{$json.message}}"}'
      },
      'enviar sms': {
        node: 'n8n-nodes-base.twilio',
        operation: 'send',
        config: '{"from": "{{$json.fromNumber}}", "to": "{{$json.toNumber}}", "message": "{{$json.message}}"}'
      },
      
      // ========== INTELIGENCIA ARTIFICIAL ==========
      'agente de ia': {
        node: 'n8n-nodes-base.agent',
        operation: 'execute',
        config: '{"task": "{{$json.task}}", "model": "gpt-4", "instructions": "{{$json.instructions}}", "tools": []}'
      },
      'chatbot': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "system", "content": "Eres un asistente útil."}, {"role": "user", "content": "{{$json.message}}"}]}'
      },
      'generar respuesta': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.message}}"}]}'
      },
      'procesar con ia': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.message}}"}]}'
      },
      'responder': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.message}}"}]}'
      },
      'automatizar': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.message}}"}]}'
      },
      'corregir texto': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "Corrige los errores en este texto: {{$json.text}}"}]}'
      },
      'clasificar mensaje': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "Clasifica este mensaje: {{$json.message}}"}]}'
      },
      'analizar sentimiento': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "Analiza el sentimiento de este texto: {{$json.text}}"}]}'
      },
      'extraer datos': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "Extrae los datos estructurados de este texto: {{$json.text}}"}]}'
      },
      'resumir texto': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "Resume este texto: {{$json.text}}"}]}'
      },
      'traducir': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "Traduce este texto a {{$json.targetLanguage}}: {{$json.text}}"}]}'
      },
      'generar imagen': {
        node: 'n8n-nodes-base.openAi',
        operation: 'image',
        config: '{"operation": "generate", "prompt": "{{$json.prompt}}", "size": "1024x1024", "quality": "standard"}'
      },
      'openai': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.prompt}}"}]}'
      },
      'gpt': {
        node: 'n8n-nodes-base.openAi',
        operation: 'chat',
        config: '{"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.prompt}}"}]}'
      },
      'anthropic': {
        node: 'n8n-nodes-base.anthropic',
        operation: 'chat',
        config: '{"model": "claude-3-sonnet", "maxTokens": 1000, "messages": [{"role": "user", "content": "{{$json.prompt}}"}]}'
      },
      'claude': {
        node: 'n8n-nodes-base.anthropic',
        operation: 'chat',
        config: '{"model": "claude-3-sonnet", "maxTokens": 1000, "messages": [{"role": "user", "content": "{{$json.prompt}}"}]}'
      },
      'gemini': {
        node: 'n8n-nodes-base.gemini',
        operation: 'chat',
        config: '{"model": "gemini-pro", "prompt": "{{$json.prompt}}"}'
      },
      
      // ========== BASES DE DATOS Y ALMACENAMIENTO ==========
      'base de datos productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'cargar productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'leer productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'google sheets': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "SHEETS_ID", "sheetName": "Sheet1", "returnAllFields": true}'
      },
      'hoja de calculo': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "SHEETS_ID", "sheetName": "Sheet1", "returnAllFields": true}'
      },
      'excel': {
        node: 'n8n-nodes-base.spreadsheetFile',
        operation: 'read',
        config: '{"operation": "read", "file": "{{$json.filePath}}", "options": {"sheetName": "Sheet1"}}'
      },
      'csv': {
        node: 'n8n-nodes-base.csv',
        operation: 'csvToJson',
        config: '{"data": "{{$json.csvData}}", "delimiter": ",", "includeEmptyValues": false}'
      },
      'airtable': {
        node: 'n8n-nodes-base.airtable',
        operation: 'list',
        config: '{"baseId": "{{$json.baseId}}", "table": "{{$json.table}}"}'
      },
      'supabase': {
        node: 'n8n-nodes-base.supabase',
        operation: 'select',
        config: '{"operation": "select", "table": "{{$json.table}}", "filters": "{{$json.filters}}"}'
      },
      'guardar': {
        node: 'n8n-nodes-base.supabase',
        operation: 'insert',
        config: '{"operation": "insert", "table": "{{$json.table}}", "data": "{{$json.data}}"}'
      },
      'insertar datos': {
        node: 'n8n-nodes-base.supabase',
        operation: 'insert',
        config: '{"operation": "insert", "table": "{{$json.table}}", "data": "{{$json.data}}"}'
      },
      'actualizar datos': {
        node: 'n8n-nodes-base.supabase',
        operation: 'update',
        config: '{"operation": "update", "table": "{{$json.table}}", "data": "{{$json.data}}", "filters": "{{$json.filters}}"}'
      },
      'mysql': {
        node: 'n8n-nodes-base.mysql',
        operation: 'executeQuery',
        config: '{"query": "{{$json.query}}", "additionalFields": {"mode": "independently"}}'
      },
      'postgres': {
        node: 'n8n-nodes-base.postgres',
        operation: 'executeQuery',
        config: '{"query": "{{$json.query}}", "additionalFields": {"mode": "independently"}}'
      },
      'mongodb': {
        node: 'n8n-nodes-base.mongodb',
        operation: 'find',
        config: '{"collection": "{{$json.collection}}", "query": "{{$json.query}}"}'
      },
      'redis': {
        node: 'n8n-nodes-base.redis',
        operation: 'get',
        config: '{"key": "{{$json.key}}"}'
      },
      'firebase': {
        node: 'n8n-nodes-base.firebase',
        operation: 'get',
        config: '{"collection": "{{$json.collection}}", "documentId": "{{$json.documentId}}"}'
      },
      
      // ========== CRM Y VENTAS ==========
      'salesforce': {
        node: 'n8n-nodes-base.salesforce',
        operation: 'getAll',
        config: '{"resource": "{{$json.resource}}", "returnAll": true}'
      },
      'hubspot': {
        node: 'n8n-nodes-base.hubspot',
        operation: 'getAll',
        config: '{"resource": "contact", "returnAll": true}'
      },
      'pipedrive': {
        node: 'n8n-nodes-base.pipedrive',
        operation: 'getAll',
        config: '{"resource": "deal", "returnAll": true}'
      },
      'crear contacto': {
        node: 'n8n-nodes-base.hubspot',
        operation: 'create',
        config: '{"resource": "contact", "properties": {"email": "{{$json.email}}", "firstname": "{{$json.firstName}}", "lastname": "{{$json.lastName}}"}}'
      },
      'crear lead': {
        node: 'n8n-nodes-base.salesforce',
        operation: 'create',
        config: '{"resource": "lead", "properties": {"Email": "{{$json.email}}", "FirstName": "{{$json.firstName}}", "LastName": "{{$json.lastName}}", "Company": "{{$json.company}}"}}'
      },
      'crm': {
        node: 'n8n-nodes-base.hubspot',
        operation: 'getAll',
        config: '{"resource": "contact", "returnAll": true}'
      },
      
      // ========== E-COMMERCE ==========
      'shopify': {
        node: 'n8n-nodes-base.shopify',
        operation: 'getAll',
        config: '{"resource": "product", "returnAll": true}'
      },
      'woocommerce': {
        node: 'n8n-nodes-base.wooCommerce',
        operation: 'getAll',
        config: '{"resource": "product", "returnAll": true}'
      },
      'magento': {
        node: 'n8n-nodes-base.magento2',
        operation: 'getAll',
        config: '{"resource": "product", "returnAll": true}'
      },
      'pedido': {
        node: 'n8n-nodes-base.shopify',
        operation: 'getAll',
        config: '{"resource": "order", "returnAll": true}'
      },
      'inventario': {
        node: 'n8n-nodes-base.shopify',
        operation: 'getAll',
        config: '{"resource": "inventoryLevel", "returnAll": true}'
      },
      'cliente': {
        node: 'n8n-nodes-base.shopify',
        operation: 'getAll',
        config: '{"resource": "customer", "returnAll": true}'
      },
      
      // ========== MARKETING Y AUTOMATIZACIÓN ==========
      'mailchimp': {
        node: 'n8n-nodes-base.mailchimp',
        operation: 'memberAdd',
        config: '{"listId": "{{$json.listId}}", "email": "{{$json.email}}", "status": "subscribed"}'
      },
      'campaña email': {
        node: 'n8n-nodes-base.mailchimp',
        operation: 'send',
        config: '{"campaignId": "{{$json.campaignId}}"}'
      },
      'newsletter': {
        node: 'n8n-nodes-base.mailchimp',
        operation: 'memberAdd',
        config: '{"listId": "{{$json.listId}}", "email": "{{$json.email}}", "status": "subscribed"}'
      },
      'facebook ads': {
        node: 'n8n-nodes-base.facebookGraph',
        operation: 'post',
        config: '{"edge": "ads", "data": "{{$json.adData}}"}'
      },
      'google ads': {
        node: 'n8n-nodes-base.googleAds',
        operation: 'getAll',
        config: '{"resource": "campaign", "returnAll": true}'
      },
      'analytics': {
        node: 'n8n-nodes-base.googleAnalytics',
        operation: 'report',
        config: '{"reportId": "{{$json.reportId}}", "dateRange": "{{$json.dateRange}}"}'
      },
      
      // ========== FINANZAS Y PAGOS ==========
      'stripe': {
        node: 'n8n-nodes-base.stripe',
        operation: 'getAll',
        config: '{"resource": "charge", "returnAll": true}'
      },
      'paypal': {
        node: 'n8n-nodes-base.payPal',
        operation: 'getAll',
        config: '{"resource": "payment", "returnAll": true}'
      },
      'factura': {
        node: 'n8n-nodes-base.stripe',
        operation: 'create',
        config: '{"resource": "invoice", "customer": "{{$json.customerId}}", "amount": "{{$json.amount}}"}'
      },
      'pago': {
        node: 'n8n-nodes-base.stripe',
        operation: 'create',
        config: '{"resource": "paymentIntent", "amount": "{{$json.amount}}", "currency": "{{$json.currency}}"}'
      },
      'cobro': {
        node: 'n8n-nodes-base.stripe',
        operation: 'create',
        config: '{"resource": "charge", "amount": "{{$json.amount}}", "currency": "{{$json.currency}}", "source": "{{$json.source}}"}'
      },
      
      // ========== PRODUCTIVIDAD ==========
      'google calendar': {
        node: 'n8n-nodes-base.googleCalendar',
        operation: 'create',
        config: '{"summary": "{{$json.title}}", "start": "{{$json.startDate}}", "end": "{{$json.endDate}}"}'
      },
      'evento calendario': {
        node: 'n8n-nodes-base.googleCalendar',
        operation: 'create',
        config: '{"summary": "{{$json.title}}", "start": "{{$json.startDate}}", "end": "{{$json.endDate}}"}'
      },
      'outlook': {
        node: 'n8n-nodes-base.microsoftOutlook',
        operation: 'create',
        config: '{"subject": "{{$json.subject}}", "start": "{{$json.startDate}}", "end": "{{$json.endDate}}"}'
      },
      'notion': {
        node: 'n8n-nodes-base.notion',
        operation: 'create',
        config: '{"databaseId": "{{$json.databaseId}}", "properties": "{{$json.properties}}"}'
      },
      'todoist': {
        node: 'n8n-nodes-base.todoist',
        operation: 'create',
        config: '{"content": "{{$json.task}}", "projectId": "{{$json.projectId}}"}'
      },
      'trello': {
        node: 'n8n-nodes-base.trello',
        operation: 'create',
        config: '{"name": "{{$json.cardName}}", "listId": "{{$json.listId}}"}'
      },
      'asana': {
        node: 'n8n-nodes-base.asana',
        operation: 'create',
        config: '{"name": "{{$json.taskName}}", "projects": "{{$json.projectId}}"}'
      },
      'jira': {
        node: 'n8n-nodes-base.jira',
        operation: 'create',
        config: '{"issueType": "{{$json.issueType}}", "summary": "{{$json.summary}}", "project": "{{$json.project}}"}'
      },
      
      // ========== VALIDACIÓN Y CONTROL DE FLUJO ==========
      'cargar productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'leer productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'productos': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "PRODUCTS_SHEET_ID", "sheetName": "Products", "returnAllFields": true}'
      },
      'google sheets': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "SHEETS_ID", "sheetName": "Sheet1", "returnAllFields": true}'
      },
      'base de datos servicios': {
        node: 'n8n-nodes-base.googleSheets',
        operation: 'getAll',
        config: '{"operation": "getAll", "spreadsheetId": "SERVICES_SHEET_ID", "sheetName": "Services", "returnAllFields": true}'
      },
      'supabase': {
        node: 'n8n-nodes-base.supabase',
        operation: 'select',
        config: '{"operation": "select", "table": "{{$json.table}}", "filters": "{{$json.filters}}"}'
      },
      'guardar': {
        node: 'n8n-nodes-base.supabase',
        operation: 'insert',
        config: '{"operation": "insert", "table": "{{$json.table}}", "data": "{{$json.data}}"}'
      },
      
      // ========== VALIDACIÓN Y CONTROL DE FLUJO AVANZADO ==========
      'validar': {
        node: 'n8n-nodes-base.if',
        operation: 'isNotEmpty',
        config: '{"conditions": [{"leftValue": "{{$json.field}}", "operation": "isNotEmpty", "rightValue": ""}]}'
      },
      'verificar': {
        node: 'n8n-nodes-base.if',
        operation: 'equal',
        config: '{"conditions": [{"leftValue": "{{$json.field}}", "operation": "equal", "rightValue": "{{$json.expectedValue}}"}]}'
      },
      'comprobar': {
        node: 'n8n-nodes-base.if',
        operation: 'equal',
        config: '{"conditions": [{"leftValue": "{{$json.field}}", "operation": "equal", "rightValue": "{{$json.expectedValue}}"}]}'
      },
      'condicion': {
        node: 'n8n-nodes-base.if',
        operation: 'equal',
        config: '{"conditions": [{"leftValue": "{{$json.condition}}", "operation": "equal", "rightValue": true}]}'
      },
      'si contiene': {
        node: 'n8n-nodes-base.if',
        operation: 'contains',
        config: '{"conditions": [{"leftValue": "{{$json.text}}", "operation": "contains", "rightValue": "{{$json.searchText}}"}]}'
      },
      'comprobar si contiene audio': {
        node: 'n8n-nodes-base.if',
        operation: 'contains',
        config: '{"conditions": [{"leftValue": "{{$json.messageType}}", "operation": "contains", "rightValue": "audio"}]}'
      },
      'clasificar tipo mensaje': {
        node: 'n8n-nodes-base.if',
        operation: 'equal',
        config: '{"conditions": [{"leftValue": "{{$json.messageType}}", "operation": "equal", "rightValue": "audio"}]}'
      },
      
      // ========== PATRONES ESPECÍFICOS DE USO INTELIGENTE ==========
      
      // 🎯 NODO IF - Detección y validación inteligente
      'validar tipo de mensaje': {
        node: 'n8n-nodes-base.if',
        operation: 'contains',
        config: '{"conditions": [{"leftValue": "{{$json.message.type}}", "operation": "contains", "rightValue": "text,audio"}]}',
        flowPattern: {
          trueOutput: 'Procesar con IA',
          falseOutput: 'Enviar: "Tipo de mensaje no soportado. Solo acepto texto y audio."'
        }
      },
      'detectar audio o texto': {
        node: 'n8n-nodes-base.if',
        operation: 'equal',
        config: '{"conditions": [{"leftValue": "{{$json.message.type}}", "operation": "equal", "rightValue": "audio"}]}',
        flowPattern: {
          trueOutput: 'Transcribir con OpenAI Whisper',
          falseOutput: 'Procesar como texto directamente'
        }
      },
      'filtrar stickers e imagenes': {
        node: 'n8n-nodes-base.if',
        operation: 'notContains',
        config: '{"conditions": [{"leftValue": "{{$json.message.type}}", "operation": "notContains", "rightValue": "sticker,image"}]}',
        flowPattern: {
          trueOutput: 'Continuar procesamiento',
          falseOutput: 'Enviar: "No puedo procesar stickers o imágenes. Envía texto o audio."'
        }
      },
      'verificar contenido valido': {
        node: 'n8n-nodes-base.if',
        operation: 'isNotEmpty',
        config: '{"conditions": [{"leftValue": "{{$json.message.content}}", "operation": "isNotEmpty"}]}',
        flowPattern: {
          trueOutput: 'Analizar contenido',
          falseOutput: 'Solicitar mensaje válido'
        }
      },
      
      // 🔄 NODO MERGE - Unificación inteligente de datos
      'unificar tipos de mensaje': {
        node: 'n8n-nodes-base.merge',
        operation: 'merge',
        config: '{"mode": "multiplex", "options": {}}',
        flowPattern: {
          inputs: ['mensajeTexto', 'mensajeAudio', 'mensajeImagen'],
          output: 'mensajeUnificado',
          description: 'Recibir múltiples tipos de entrada y unificarlos'
        }
      },
      'consolidar datos base': {
        node: 'n8n-nodes-base.merge',
        operation: 'merge',
        config: '{"mode": "multiplex", "options": {}}',
        flowPattern: {
          inputs: ['productosDB', 'serviciosDB', 'inventarioDB'],
          outputs: ['productosAudio', 'productosTexto', 'productosImagen'],
          description: 'Consolidar base de datos y clasificar por tipo'
        }
      },
      'preparar entrada agente': {
        node: 'n8n-nodes-base.merge',
        operation: 'merge',
        config: '{"mode": "multiplex", "options": {}}',
        flowPattern: {
          inputs: ['mensajeUsuario', 'contextoHistorial', 'datosBaseDatos'],
          output: 'entradaCompleta',
          description: 'Preparar entrada completa para agente IA'
        }
      },
      'agregar respuestas': {
        node: 'n8n-nodes-base.merge',
        operation: 'merge',
        config: '{"mode": "multiplex", "options": {}}',
        flowPattern: {
          inputs: ['respuestaIA', 'resultadosDB', 'preferenciasUsuario'],
          output: 'respuestaFinal',
          description: 'Combinar respuesta IA con datos contextuales'
        }
      },
      
      // 🤖 NODO AI AGENT - Inteligencia artificial avanzada
      'clasificar intencion usuario': {
        node: 'n8n-nodes-base.agent',
        operation: 'execute',
        config: '{"task": "Clasificar intención del mensaje", "model": "gpt-4", "instructions": "Analiza el mensaje y clasifica como: consulta_producto, consulta_servicio, soporte_tecnico, informacion_general", "tools": ["text_analyzer"]}',
        aiPattern: {
          input: 'mensajeUsuario',
          output: 'clasificacion',
          purpose: 'Determinar qué tipo de respuesta necesita el usuario'
        }
      },
      'recomendar productos ia': {
        node: 'n8n-nodes-base.agent',
        operation: 'execute',
        config: '{"task": "Recomendar productos", "model": "gpt-4", "instructions": "Basado en la consulta del usuario y el inventario, recomienda los 3 mejores productos con explicación", "tools": ["database_search", "recommendation_engine"]}',
        aiPattern: {
          input: 'consultaUsuario + inventarioDisponible',
          output: 'recomendacionesPersonalizadas',
          purpose: 'Generar recomendaciones inteligentes de productos'
        }
      },
      'soporte inteligente': {
        node: 'n8n-nodes-base.agent',
        operation: 'execute',
        config: '{"task": "Proporcionar soporte", "model": "gpt-4", "instructions": "Responde profesionalmente a consultas sobre productos/servicios de la tienda", "tools": ["knowledge_base", "customer_context"]}',
        aiPattern: {
          input: 'consultaUsuario + contextoCliente',
          output: 'respuestaSoporte',
          purpose: 'Generar respuestas de soporte contextualizadas'
        }
      },
      'analizar datos estructurados': {
        node: 'n8n-nodes-base.agent',
        operation: 'execute',
        config: '{"task": "Analizar y estructurar datos", "model": "gpt-4", "instructions": "Extrae información clave y estructura los datos para procesamiento", "tools": ["data_extractor", "json_formatter"]}',
        aiPattern: {
          input: 'datosNoEstructurados',
          output: 'datosEstructurados',
          purpose: 'Convertir datos complejos en formato procesable'
        }
      },
      'generar respuesta contextual': {
        node: 'n8n-nodes-base.agent',
        operation: 'execute',
        config: '{"task": "Generar respuesta contextual", "model": "gpt-4", "instructions": "Crea una respuesta personalizada considerando el historial y preferencias del usuario", "tools": ["context_analyzer", "response_generator"]}',
        aiPattern: {
          input: 'mensajeUsuario + historial + preferencias',
          output: 'respuestaPersonalizada',
          purpose: 'Crear respuestas altamente contextualizadas'
        }
      }
    };

    console.log('✨ Prompt Enhancement Agent inicializado con validación de nodos n8n');
  }

  // 🧠 DETECTOR DE COMPLEJIDAD DE PROMPTS - Análisis inteligente del nivel del usuario
  analyzePromptComplexity(prompt) {
    // Validar que prompt sea string
    if (typeof prompt !== 'string') {
      console.warn('⚠️ Prompt no es string, convirtiendo...');
      prompt = String(prompt);
    }
    
    const lowerPrompt = prompt.toLowerCase();
    let vagueScore = 0;
    let intermediateScore = 0;
    let advancedScore = 0;
    
    // Analizar indicadores VAGOS (usuarios novatos)
    Object.values(this.promptComplexityAnalyzer.vagueIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        vagueScore += 0.1;
      }
    });
    
    // Analizar indicadores INTERMEDIOS
    Object.values(this.promptComplexityAnalyzer.intermediateIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        intermediateScore += 0.15;
      }
    });
    
    // Analizar indicadores AVANZADOS
    Object.values(this.promptComplexityAnalyzer.advancedIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        advancedScore += 0.2;
      }
    });
    
    // MEJORAR: Detectar patrones técnicos específicos que indican expertise
    const technicalPatterns = [
      'api', 'webhook', 'automation', 'integration', 'workflow', 'crm', 'erp',
      'fulfillment', 'pipeline', 'analytics', 'mysql', 'postgres', 'redis',
      'kafka', 'elasticsearch', 'mongodb', 'salesforce', 'hubspot', 'zendesk',
      'stripe', 'paypal', 'aws', 'google cloud', 'azure', 'docker', 'kubernetes'
    ];
    
    let technicalTermCount = 0;
    technicalPatterns.forEach(pattern => {
      if (lowerPrompt.includes(pattern)) {
        technicalTermCount++;
      }
    });
    
    // Si hay muchos términos técnicos, es un usuario técnico
    if (technicalTermCount >= 5) {
      advancedScore += 0.4;
    } else if (technicalTermCount >= 3) {
      intermediateScore += 0.3;
    }
    
    // NUEVO: Detectar estructura de prompts complejos
    const complexStructureIndicators = [
      'que:', 'gestión', 'sistema', 'procesamiento', 'sincronice', 'integre',
      'automatice', 'genere', 'calcule', 'analice', 'trackee', 'optimice'
    ];
    
    let structureComplexity = 0;
    complexStructureIndicators.forEach(indicator => {
      if (lowerPrompt.includes(indicator)) {
        structureComplexity++;
      }
    });
    
    if (structureComplexity >= 6) {
      advancedScore += 0.3;
    } else if (structureComplexity >= 4) {
      intermediateScore += 0.2;
    }
    
    // Calcular score total con lógica mejorada
    const totalScore = Math.min(1.0, advancedScore + (intermediateScore * 0.7) + (vagueScore * 0.3));
    
    let userLevel, enhancementNeeded;
    
    // LÓGICA MEJORADA: Priorizar indicadores técnicos
    if (advancedScore > 0.3 || technicalTermCount >= 4 || structureComplexity >= 5) {
      userLevel = 'EXPERT';
      enhancementNeeded = 'MINIMAL'; // Solo optimizaciones menores
    } else if (intermediateScore > 0.2 || technicalTermCount >= 2 || totalScore > 0.4) {
      userLevel = 'INTERMEDIATE';
      enhancementNeeded = 'MODERATE'; // Mejoras técnicas específicas
    } else {
      userLevel = 'NOVICE';
      enhancementNeeded = 'FULL'; // Traducción completa de intenciones
    }
    
    console.log(`   🔍 Debug detección: TechTerms=${technicalTermCount}, Structure=${structureComplexity}, Advanced=${advancedScore.toFixed(2)}, Level=${userLevel}`);
    
    return {
      complexityScore: totalScore,
      userLevel,
      enhancementNeeded,
      scores: {
        vague: vagueScore,
        intermediate: intermediateScore,
        advanced: advancedScore
      },
      technicalTerms: technicalTermCount,
      structureComplexity: structureComplexity,
      analysis: {
        hasVagueness: vagueScore > 0.2,
        hasTechnicalTerms: intermediateScore > 0.2 || technicalTermCount >= 2,
        hasAdvancedSpecs: advancedScore > 0.2 || technicalTermCount >= 4,
        needsTranslation: userLevel === 'NOVICE',
        needsValidation: userLevel !== 'NOVICE',
        needsOptimization: userLevel === 'EXPERT'
      }
    };
  }

  // 🎯 PROCESAMIENTO ADAPTATIVO: Ajustar mejoras según nivel del usuario
  async adaptivePromptProcessing(prompt) {
    console.log('🧠 Analizando complejidad del prompt...');
    
    const complexity = this.analyzePromptComplexity(prompt);
    console.log(`📊 Nivel detectado: ${complexity.userLevel} (Score: ${complexity.complexityScore.toFixed(2)})`);
    console.log(`🔧 Mejoras necesarias: ${complexity.enhancementNeeded}`);
    
    let processedPrompt = prompt;
    
    switch (complexity.enhancementNeeded) {
      case 'FULL':
        console.log('🔄 Usuario novato detectado - Aplicando traducción completa de intenciones');
        processedPrompt = await this.translateVaguePromptToTechnical(prompt);
        processedPrompt = await this.enhancePrompt(processedPrompt);
        processedPrompt = this.autoCorrectInvalidOperations(processedPrompt);
        break;
        
      case 'MODERATE':
        console.log('⚙️ Usuario intermedio detectado - Aplicando mejoras técnicas específicas');
        processedPrompt = await this.enhanceSpecificity(prompt);
        processedPrompt = this.validateAndOptimizeWorkflow(processedPrompt);
        break;
        
      case 'MINIMAL':
        console.log('✨ Usuario experto detectado - Aplicando solo optimizaciones menores');
        processedPrompt = this.optimizeExpertPrompt(prompt);
        break;
    }
    
    return {
      originalPrompt: prompt,
      processedPrompt,
      complexity,
      processingApplied: complexity.enhancementNeeded
    };
  }

  // 🎖️ OPTIMIZADOR PARA USUARIOS EXPERTOS
  optimizeExpertPrompt(prompt) {
    console.log('🎖️ Optimizando prompt de usuario experto...');
    
    let optimized = prompt;
    
    // Solo hacer optimizaciones menores para no interferir con la expertise del usuario
    
    // 1. Verificar que las operaciones sean válidas
    Object.keys(this.validNodeOperations).forEach(nodeType => {
      const corrections = this.validNodeOperations[nodeType].commonMistakes;
      Object.keys(corrections).forEach(mistake => {
        if (optimized.toLowerCase().includes(mistake.toLowerCase())) {
          console.log(`🔧 Corrección menor: ${mistake} → ${corrections[mistake]}`);
          optimized = optimized.replace(new RegExp(mistake, 'gi'), corrections[mistake]);
        }
      });
    });
    
    // 2. Añadir best practices si faltan
    if (!optimized.includes('error handling') && optimized.includes('httpRequest')) {
      optimized += '\n\nNota: Considera añadir manejo de errores para las solicitudes HTTP.';
    }
    
    if (!optimized.includes('validation') && optimized.includes('webhook')) {
      optimized += '\n\nNota: Considera añadir validación de datos para los webhooks.';
    }
    
    return optimized;
  }

  // 🔍 VALIDADOR Y OPTIMIZADOR DE WORKFLOWS
  validateAndOptimizeWorkflow(prompt) {
    console.log('🔍 Validando y optimizando workflow...');
    
    let optimized = prompt;
    
    // Detectar patrones comunes y sugerir mejoras
    if (optimized.includes('loop') || optimized.includes('iterar')) {
      optimized += '\n\nSugerencia: Usar splitInBatches para procesamiento eficiente de grandes volúmenes.';
    }
    
    if (optimized.includes('api') || optimized.includes('http')) {
      optimized += '\n\nSugerencia: Implementar retry logic para mayor robustez.';
    }
    
    if (optimized.includes('datos') || optimized.includes('data')) {
      optimized += '\n\nSugerencia: Añadir validación de datos con nodos IF.';
    }
    
    return optimized;
  }

  // 🧠 MÉTODO PRINCIPAL INTELIGENTE: Traducir intenciones vagas en especificaciones técnicas
  translateVaguePromptToTechnical(prompt) {
    console.log('🧠 Analizando intenciones en prompt vago...');
    
    // Asegurar que prompt es string
    const promptStr = this.ensurePromptIsString(prompt);
    const lowerPrompt = promptStr.toLowerCase();
    const detectedIntentions = [];
    const technicalSpecs = [];
    
    // Detectar intenciones múltiples en el prompt
    Object.keys(this.intentionToTechnical).forEach(intention => {
      if (lowerPrompt.includes(intention)) {
        detectedIntentions.push(intention);
        technicalSpecs.push(this.intentionToTechnical[intention]);
      }
    });
    
    console.log(`🎯 Intenciones detectadas: ${detectedIntentions.join(', ')}`);
    
    // Si no se detectaron intenciones claras, usar análisis semántico
    if (detectedIntentions.length === 0) {
      console.log('🤔 No se detectaron intenciones claras, aplicando análisis semántico...');
      
      // Análisis semántico básico
      if (lowerPrompt.includes('audio') && lowerPrompt.includes('texto')) {
        detectedIntentions.push('transcribir audio');
        technicalSpecs.push(this.intentionToTechnical['transcribir audio']);
      }
      
      if (lowerPrompt.includes('whatsapp') || lowerPrompt.includes('mensaje')) {
        detectedIntentions.push('whatsapp');
        technicalSpecs.push(this.intentionToTechnical['whatsapp']);
      }
      
      if (lowerPrompt.includes('agente') || lowerPrompt.includes('ia') || lowerPrompt.includes('ai')) {
        detectedIntentions.push('agente de ia');
        technicalSpecs.push(this.intentionToTechnical['agente de ia']);
      }
      
      if (lowerPrompt.includes('productos') || lowerPrompt.includes('base de datos')) {
        detectedIntentions.push('base de datos productos');
        technicalSpecs.push(this.intentionToTechnical['base de datos productos']);
      }
      
      if (lowerPrompt.includes('clasificar') || lowerPrompt.includes('verificar')) {
        detectedIntentions.push('clasificar tipo mensaje');
        technicalSpecs.push(this.intentionToTechnical['clasificar tipo mensaje']);
      }
      
      // 🎯 DETECCIÓN INTELIGENTE DE PATRONES ESPECÍFICOS
      
      // Detectar necesidad de NODO IF para validaciones
      if ((lowerPrompt.includes('si es') || lowerPrompt.includes('si no es') || 
           lowerPrompt.includes('sticker') || lowerPrompt.includes('mensaje incorrecto') ||
           lowerPrompt.includes('validar') || lowerPrompt.includes('verificar tipo')) &&
          (lowerPrompt.includes('audio') || lowerPrompt.includes('texto'))) {
        detectedIntentions.push('validar tipo de mensaje');
        technicalSpecs.push(this.intentionToTechnical['validar tipo de mensaje']);
      }
      
      if (lowerPrompt.includes('sticker') && lowerPrompt.includes('no se procese')) {
        detectedIntentions.push('filtrar stickers e imagenes');
        technicalSpecs.push(this.intentionToTechnical['filtrar stickers e imagenes']);
      }
      
      if (lowerPrompt.includes('audio') && lowerPrompt.includes('texto') && 
          (lowerPrompt.includes('identifique') || lowerPrompt.includes('detectar'))) {
        detectedIntentions.push('detectar audio o texto');
        technicalSpecs.push(this.intentionToTechnical['detectar audio o texto']);
      }
      
      // Detectar necesidad de NODO MERGE para unificación
      if ((lowerPrompt.includes('múltiples') || lowerPrompt.includes('varios') ||
           lowerPrompt.includes('diferentes tipos') || lowerPrompt.includes('unificar') ||
           lowerPrompt.includes('combinar')) &&
          (lowerPrompt.includes('mensaje') || lowerPrompt.includes('entrada') ||
           lowerPrompt.includes('datos'))) {
        detectedIntentions.push('unificar tipos de mensaje');
        technicalSpecs.push(this.intentionToTechnical['unificar tipos de mensaje']);
      }
      
      if (lowerPrompt.includes('telegram') && lowerPrompt.includes('texto e imagen')) {
        detectedIntentions.push('unificar tipos de mensaje');
        technicalSpecs.push(this.intentionToTechnical['unificar tipos de mensaje']);
      }
      
      if (lowerPrompt.includes('base de datos') && 
          (lowerPrompt.includes('3 salidas') || lowerPrompt.includes('clasificacion') ||
           lowerPrompt.includes('audio, imagen, texto'))) {
        detectedIntentions.push('consolidar datos base');
        technicalSpecs.push(this.intentionToTechnical['consolidar datos base']);
      }
      
      if ((lowerPrompt.includes('agente') || lowerPrompt.includes('ia')) && 
          (lowerPrompt.includes('contexto') || lowerPrompt.includes('historial') ||
           lowerPrompt.includes('datos'))) {
        detectedIntentions.push('preparar entrada agente');
        technicalSpecs.push(this.intentionToTechnical['preparar entrada agente']);
      }
      
      // Detectar necesidad de NODO AI AGENT específico
      if (lowerPrompt.includes('clasificar') && 
          (lowerPrompt.includes('intención') || lowerPrompt.includes('tipo') ||
           lowerPrompt.includes('categoria'))) {
        detectedIntentions.push('clasificar intencion usuario');
        technicalSpecs.push(this.intentionToTechnical['clasificar intencion usuario']);
      }
      
      if ((lowerPrompt.includes('recomendar') || lowerPrompt.includes('sugerir') ||
           lowerPrompt.includes('opciones')) && 
          (lowerPrompt.includes('productos') || lowerPrompt.includes('celulares') ||
           lowerPrompt.includes('servicios'))) {
        detectedIntentions.push('recomendar productos ia');
        technicalSpecs.push(this.intentionToTechnical['recomendar productos ia']);
      }
      
      if (lowerPrompt.includes('soporte') || lowerPrompt.includes('ayuda') ||
          lowerPrompt.includes('consulta') || lowerPrompt.includes('respuesta')) {
        detectedIntentions.push('soporte inteligente');
        technicalSpecs.push(this.intentionToTechnical['soporte inteligente']);
      }
      
      if ((lowerPrompt.includes('analizar') || lowerPrompt.includes('procesar')) &&
          (lowerPrompt.includes('datos') || lowerPrompt.includes('información'))) {
        detectedIntentions.push('analizar datos estructurados');
        technicalSpecs.push(this.intentionToTechnical['analizar datos estructurados']);
      }
    }
    
    return {
      detectedIntentions,
      technicalSpecs,
      recommendedNodes: technicalSpecs.map(spec => spec.node),
      recommendedOperations: technicalSpecs.map(spec => spec.operation),
      configExamples: technicalSpecs.map(spec => spec.config)
    };
  }

  // 🎯 GENERADOR DE ARQUITECTURAS CON CONEXIONES INTELIGENTES
  // Especializado en explicar conexiones TRUE/FALSE de IF y múltiples entradas/salidas de MERGE
  generateIntelligentNodeConnections(technicalSpecs, originalPrompt) {
    const connections = [];
    const lowerPrompt = originalPrompt.toLowerCase();
    
    // Buscar nodos IF y explicar sus conexiones
    technicalSpecs.forEach(spec => {
      if (spec.node === 'n8n-nodes-base.if') {
        if (spec.flowPattern) {
          connections.push({
            nodeType: 'IF',
            purpose: 'Validación y enrutamiento condicional',
            trueConnection: {
              description: spec.flowPattern.trueOutput,
              nextNode: this.inferNextNodeFromOutput(spec.flowPattern.trueOutput)
            },
            falseConnection: {
              description: spec.flowPattern.falseOutput,
              nextNode: this.inferNextNodeFromOutput(spec.flowPattern.falseOutput)
            },
            example: `
CONEXIONES DEL NODO IF:
├── ✅ TRUE (Sí se cumple): ${spec.flowPattern.trueOutput}
└── ❌ FALSE (No se cumple): ${spec.flowPattern.falseOutput}

LÓGICA: Si el mensaje ${this.extractConditionFromConfig(spec.config)}
→ TRUE: Continúa el flujo principal
→ FALSE: Maneja la excepción o error`
          });
        }
      }
      
      // Buscar nodos MERGE y explicar sus múltiples conexiones
      if (spec.node === 'n8n-nodes-base.merge') {
        if (spec.flowPattern) {
          connections.push({
            nodeType: 'MERGE',
            purpose: 'Unificación y consolidación de datos',
            inputs: spec.flowPattern.inputs || [],
            outputs: spec.flowPattern.outputs || [spec.flowPattern.output],
            example: `
CONEXIONES DEL NODO MERGE:
📥 ENTRADAS (múltiples):
${(spec.flowPattern.inputs || []).map((input, i) => `  ${i+1}. ${input}`).join('\n')}

📤 SALIDA(S):
${(spec.flowPattern.outputs || [spec.flowPattern.output]).map((output, i) => `  ${i+1}. ${output}`).join('\n')}

FUNCIÓN: ${spec.flowPattern.description}`
          });
        }
      }
      
      // Buscar nodos AI AGENT y explicar su flujo de datos
      if (spec.node === 'n8n-nodes-base.agent') {
        if (spec.aiPattern) {
          connections.push({
            nodeType: 'AI_AGENT',
            purpose: 'Procesamiento inteligente con IA',
            dataFlow: {
              input: spec.aiPattern.input,
              output: spec.aiPattern.output,
              purpose: spec.aiPattern.purpose
            },
            example: `
FLUJO DEL AGENTE IA:
📥 ENTRADA: ${spec.aiPattern.input}
🧠 PROCESAMIENTO: ${spec.aiPattern.purpose}
📤 SALIDA: ${spec.aiPattern.output}

CONFIGURACIÓN:
- Modelo: GPT-4
- Herramientas: ${JSON.parse(spec.config).tools?.join(', ') || 'Análisis de texto'}
- Contexto: Incluye historial y preferencias del usuario`
          });
        }
      }
    });
    
    return connections;
  }

  // 🔧 FUNCIÓN AUXILIAR: Inferir siguiente nodo basado en la salida
  inferNextNodeFromOutput(output) {
    const outputLower = output.toLowerCase();
    
    if (outputLower.includes('transcribir') || outputLower.includes('whisper')) {
      return 'n8n-nodes-base.openAi (Audio Transcription)';
    }
    if (outputLower.includes('procesar con ia') || outputLower.includes('agente')) {
      return 'n8n-nodes-base.agent (AI Agent)';
    }
    if (outputLower.includes('enviar') || outputLower.includes('mensaje')) {
      return 'n8n-nodes-base.httpRequest (Send Response)';
    }
    if (outputLower.includes('base de datos') || outputLower.includes('buscar')) {
      return 'n8n-nodes-base.supabase (Database Query)';
    }
    if (outputLower.includes('error') || outputLower.includes('incorrecto')) {
      return 'n8n-nodes-base.httpRequest (Error Response)';
    }
    
    return 'Siguiente nodo según lógica de negocio';
  }

  // 🔧 FUNCIÓN AUXILIAR: Extraer condición del config JSON
  extractConditionFromConfig(config) {
    try {
      const parsed = JSON.parse(config);
      const condition = parsed.conditions?.[0];
      if (condition) {
        return `"${condition.leftValue}" ${condition.operation} "${condition.rightValue}"`;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
    return 'se cumple la condición especificada';
  }

  // 🔧 CORRECTOR AUTOMÁTICO AVANZADO: Sistema inteligente de corrección multi-nivel
  autoCorrectInvalidOperations(enhancedPrompt) {
    // Validar que enhancedPrompt sea string
    if (typeof enhancedPrompt !== 'string') {
      console.warn('⚠️ EnhancedPrompt no es string en autoCorrect, convirtiendo...');
      enhancedPrompt = String(enhancedPrompt);
    }
    
    console.log('🔧 Iniciando corrector automático avanzado...');
    
    let correctedPrompt = enhancedPrompt;
    let correctionsMade = 0;
    const corrections = [];
    
    // NIVEL 1: Corrección de operaciones específicas por tipo de nodo
    console.log('🔧 Nivel 1: Corrigiendo operaciones específicas...');
    Object.keys(this.validNodeOperations).forEach(nodeType => {
      const nodeConfig = this.validNodeOperations[nodeType];
      
      // Buscar el tipo de nodo en el prompt
      if (correctedPrompt.toLowerCase().includes(nodeType.toLowerCase()) || 
          correctedPrompt.toLowerCase().includes(nodeType.replace('n8n-nodes-base.', ''))) {
        
        // Revisar errores comunes para este tipo de nodo
        Object.keys(nodeConfig.commonMistakes).forEach(mistake => {
          const correction = nodeConfig.commonMistakes[mistake];
          
          if (correctedPrompt.toLowerCase().includes(mistake.toLowerCase())) {
            console.log(`🔧 Corrigiendo operación: "${mistake}" → "${correction}" para ${nodeType}`);
            correctedPrompt = correctedPrompt.replace(new RegExp(mistake, 'gi'), correction);
            corrections.push({
              type: 'OPERATION_CORRECTION',
              original: mistake,
              corrected: correction,
              nodeType: nodeType
            });
            correctionsMade++;
          }
        });
      }
    });
    
    // NIVEL 2: Corrección de terminología técnica común
    console.log('🔧 Nivel 2: Corrigiendo terminología técnica...');
    const technicalCorrections = {
      // Errores de terminología de IA
      'chatgpt': 'OpenAI GPT',
      'gpt4': 'GPT-4',
      'gpt-3.5': 'GPT-3.5-turbo',
      'speech to text': 'audio transcription',
      'text to speech': 'text-to-speech',
      'voice recognition': 'audio transcription',
      'stt': 'audio transcription',
      'tts': 'text-to-speech',
      
      // Errores de APIs y protocolos
      'rest api': 'REST API',
      'json api': 'JSON API',
      'xml api': 'XML API',
      'soap api': 'SOAP API',
      'graphql api': 'GraphQL API',
      'oauth2': 'OAuth 2.0',
      'jwt': 'JWT token',
      
      // Errores de bases de datos
      'nosql': 'NoSQL',
      'sql': 'SQL',
      'mongodb': 'MongoDB',
      'mysql': 'MySQL',
      'postgresql': 'PostgreSQL',
      'redis': 'Redis',
      'elasticsearch': 'Elasticsearch',
      
      // Errores de servicios cloud
      'aws': 'Amazon Web Services',
      'gcp': 'Google Cloud Platform',
      'azure': 'Microsoft Azure',
      's3': 'Amazon S3',
      'lambda': 'AWS Lambda',
      
      // Errores de metodologías HTTP
      'get request': 'HTTP GET',
      'post request': 'HTTP POST',
      'put request': 'HTTP PUT',
      'delete request': 'HTTP DELETE',
      'patch request': 'HTTP PATCH',
      
      // Errores de formatos de datos
      'csv file': 'CSV data',
      'excel file': 'Excel spreadsheet',
      'json file': 'JSON data',
      'xml file': 'XML document',
      'pdf file': 'PDF document'
    };
    
    Object.keys(technicalCorrections).forEach(term => {
      const correction = technicalCorrections[term];
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(correctedPrompt)) {
        console.log(`🔧 Mejorando terminología: "${term}" → "${correction}"`);
        correctedPrompt = correctedPrompt.replace(regex, correction);
        corrections.push({
          type: 'TERMINOLOGY_IMPROVEMENT',
          original: term,
          corrected: correction
        });
        correctionsMade++;
      }
    });
    
    // NIVEL 3: Corrección de estructuras de workflow
    console.log('🔧 Nivel 3: Optimizando estructura de workflow...');
    
    // Detectar patrones de workflow ineficientes
    const workflowPatterns = {
      'validar y procesar': 'usar nodo IF para validación antes del procesamiento',
      'loop infinito': 'implementar condición de salida en el loop',
      'sin validación': 'añadir validación de datos con nodos IF',
      'sin manejo de errores': 'implementar manejo de errores con try-catch',
      'datos sin formatear': 'usar nodo Set para formatear datos',
      'múltiples api calls': 'considerar usar batch processing para eficiencia'
    };
    
    Object.keys(workflowPatterns).forEach(pattern => {
      const suggestion = workflowPatterns[pattern];
      if (correctedPrompt.toLowerCase().includes(pattern)) {
        console.log(`💡 Sugerencia de workflow: ${suggestion}`);
        correctedPrompt += `\n\nOptimización sugerida: ${suggestion}`;
        corrections.push({
          type: 'WORKFLOW_OPTIMIZATION',
          pattern: pattern,
          suggestion: suggestion
        });
      }
    });
    
    // NIVEL 4: Corrección de configuraciones de seguridad
    console.log('🔧 Nivel 4: Verificando configuraciones de seguridad...');
    
    const securityChecks = {
      'api key': 'usar credentials manager para API keys',
      'password': 'usar credentials manager para passwords',
      'token': 'implementar refresh token logic',
      'authentication': 'configurar OAuth 2.0 si es posible',
      'webhook': 'añadir validación de firma para webhooks',
      'public endpoint': 'considerar autenticación para endpoints públicos'
    };
    
    Object.keys(securityChecks).forEach(securityTerm => {
      const recommendation = securityChecks[securityTerm];
      if (correctedPrompt.toLowerCase().includes(securityTerm)) {
        console.log(`🔒 Recomendación de seguridad: ${recommendation}`);
        corrections.push({
          type: 'SECURITY_RECOMMENDATION',
          term: securityTerm,
          recommendation: recommendation
        });
      }
    });
    
    // NIVEL 5: Corrección de mejores prácticas
    console.log('🔧 Nivel 5: Aplicando mejores prácticas...');
    
    // Añadir mejores prácticas automáticamente
    if (correctedPrompt.includes('HTTP') && !correctedPrompt.includes('timeout')) {
      correctedPrompt += '\n\nMejor práctica: Configurar timeout apropiado para solicitudes HTTP.';
      corrections.push({
        type: 'BEST_PRACTICE',
        practice: 'HTTP timeout configuration'
      });
    }
    
    if (correctedPrompt.includes('webhook') && !correctedPrompt.includes('validation')) {
      correctedPrompt += '\n\nMejor práctica: Implementar validación de datos para webhooks.';
      corrections.push({
        type: 'BEST_PRACTICE',
        practice: 'Webhook data validation'
      });
    }
    
    if (correctedPrompt.includes('loop') && !correctedPrompt.includes('batch')) {
      correctedPrompt += '\n\nMejor práctica: Considerar procesamiento en lotes para eficiencia.';
      corrections.push({
        type: 'BEST_PRACTICE',
        practice: 'Batch processing for loops'
      });
    }
    
    if (correctedPrompt.includes('database') && !correctedPrompt.includes('connection pooling')) {
      correctedPrompt += '\n\nMejor práctica: Usar connection pooling para bases de datos.';
      corrections.push({
        type: 'BEST_PRACTICE',
        practice: 'Database connection pooling'
      });
    }
    
    // NIVEL 6: Optimizaciones de performance
    console.log('🔧 Nivel 6: Aplicando optimizaciones de performance...');
    
    const performanceOptimizations = {
      'muchos datos': 'usar paginación para manejar grandes volúmenes',
      'archivo grande': 'considerar streaming para archivos grandes',
      'múltiples requests': 'implementar rate limiting',
      'procesamiento lento': 'considerar procesamiento asíncrono',
      'memoria alta': 'implementar procesamiento en chunks'
    };
    
    Object.keys(performanceOptimizations).forEach(performanceIssue => {
      const optimization = performanceOptimizations[performanceIssue];
      if (correctedPrompt.toLowerCase().includes(performanceIssue)) {
        console.log(`⚡ Optimización de performance: ${optimization}`);
        correctedPrompt += `\n\nOptimización de performance: ${optimization}`;
        corrections.push({
          type: 'PERFORMANCE_OPTIMIZATION',
          issue: performanceIssue,
          optimization: optimization
        });
      }
    });
    
    console.log(`✅ Corrector automático completado: ${correctionsMade} correcciones directas aplicadas`);
    console.log(`📊 Total de mejoras sugeridas: ${corrections.length}`);
    
    // Resumen de correcciones
    if (corrections.length > 0) {
      console.log('📋 Resumen de correcciones aplicadas:');
      corrections.forEach((correction, index) => {
        console.log(`   ${index + 1}. [${correction.type}] ${correction.original || correction.pattern || correction.term || correction.practice || correction.issue} → ${correction.corrected || correction.suggestion || correction.recommendation || correction.optimization}`);
      });
    }
    
    return {
      correctedPrompt,
      correctionsMade,
      corrections,
      summary: {
        operationCorrections: corrections.filter(c => c.type === 'OPERATION_CORRECTION').length,
        terminologyImprovements: corrections.filter(c => c.type === 'TERMINOLOGY_IMPROVEMENT').length,
        workflowOptimizations: corrections.filter(c => c.type === 'WORKFLOW_OPTIMIZATION').length,
        securityRecommendations: corrections.filter(c => c.type === 'SECURITY_RECOMMENDATION').length,
        bestPractices: corrections.filter(c => c.type === 'BEST_PRACTICE').length,
        performanceOptimizations: corrections.filter(c => c.type === 'PERFORMANCE_OPTIMIZATION').length
      }
    };
  }

  // 🚀 MÉTODO PRINCIPAL HÍBRIDO: Procesamiento adaptativo según nivel del usuario
  async enhancePrompt(prompt, context = {}, options = {}) {
    console.log('� Prompt Enhancement Agent Híbrido: Iniciando procesamiento adaptativo...');

    try {
      const mergedOptions = { ...this.options, ...options };
      
      // 🧠 ANÁLISIS INICIAL: Determinar nivel del usuario y tipo de procesamiento
      console.log('🧠 Analizando complejidad y nivel del usuario...');
      const adaptiveResult = await this.adaptivePromptProcessing(prompt);
      
      console.log(`📊 Procesamiento aplicado: ${adaptiveResult.processingApplied}`);
      console.log(`👤 Nivel de usuario: ${adaptiveResult.complexity.userLevel}`);
      
      let finalPrompt = adaptiveResult.processedPrompt;
      let enhancements = [];
      let analysis = {};
      
      // Aplicar procesamiento adicional solo si es necesario
      if (adaptiveResult.complexity.enhancementNeeded === 'FULL') {
        console.log('🔄 Aplicando procesamiento completo para usuario novato...');
        
        // Aplicar corrector automático avanzado
        const correctionResult = this.autoCorrectInvalidOperations(finalPrompt);
        finalPrompt = correctionResult.correctedPrompt;
        
        // Análisis detallado del prompt
        analysis = await this.analyzePrompt(finalPrompt);
        
        // Generar mejoras adicionales
        enhancements = await this.generateEnhancements(finalPrompt, analysis, {
          ...context,
          technicalSpecs: adaptiveResult.complexity.analysis
        }, mergedOptions);
        
        // Aplicar mejoras
        if (enhancements.length > 0) {
          finalPrompt = this.applyEnhancements(finalPrompt, enhancements);
        }
        
      } else if (adaptiveResult.complexity.enhancementNeeded === 'MODERATE') {
        console.log('⚙️ Aplicando mejoras técnicas específicas para usuario intermedio...');
        
        analysis = await this.analyzePrompt(finalPrompt);
        enhancements = await this.generateTargetedImprovements(finalPrompt, analysis);
        
      } else {
        console.log('✨ Usuario experto - Solo optimizaciones aplicadas');
        analysis = { userLevel: 'EXPERT', optimizationsApplied: true };
      }
      
      // 📊 VALIDACIÓN FINAL
      const validation = this.validatePrompt(finalPrompt);
      
      console.log('✅ Procesamiento híbrido completado');
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: finalPrompt,
        enhanced: finalPrompt, // Para compatibilidad
        userLevel: adaptiveResult.complexity.userLevel,
        processingType: adaptiveResult.processingApplied,
        complexityAnalysis: adaptiveResult.complexity,
        enhancements: enhancements,
        analysis: analysis,
        validation: validation,
        correctionsSummary: adaptiveResult.complexity.enhancementNeeded === 'FULL' ? 
          this.autoCorrectInvalidOperations(prompt).summary : null
      };
      
    } catch (error) {
      console.error('❌ Error en procesamiento híbrido:', error);
      return {
        originalPrompt: prompt,
        enhancedPrompt: prompt,
        enhanced: prompt,
        userLevel: 'UNKNOWN',
        processingType: 'ERROR',
        enhancements: [],
        analysis: { error: error.message },
        validation: { error: error.message }
      };
    }
  }

  // Analizar características del prompt
  async analyzePrompt(prompt) {
    const words = prompt.toLowerCase().split(/\s+/);
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Detectar palabras vagas (más sensible)
    const vagueWords = ['algo', 'cosa', 'esto', 'eso', 'hacer', 'crear', 'sistema', 'flujo', 'necesito', 'quiero', 'donde', 'que'];
    const vagueCount = words.filter(word => vagueWords.includes(word)).length;
    
    // Detectar especificidad
    const specificWords = ['específico', 'exacto', 'preciso', 'detallado', 'cuando', 'como', 'mediante', 'usando'];
    const specificCount = words.filter(word => specificWords.includes(word)).length;
    
    // Detectar errores ortográficos comunes
    const detectedErrors = [];
    if (prompt.includes('hablé') && prompt.includes('cliente')) detectedErrors.push('hablé -> hable');
    if (prompt.includes('envié')) detectedErrors.push('envié -> envíe');
    
    // Calcular vaguedad más sensible para workflows
    let vaguenessScore = vagueCount / words.length * 2;
    if (prompt.includes('flujo') && vagueCount > 3) vaguenessScore = Math.min(vaguenessScore * 1.5, 1);
    if (words.length < 50 && vagueCount > 2) vaguenessScore = Math.min(vaguenessScore * 1.3, 1);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      vagueness: Math.min(vaguenessScore, 1),
      specificity: specificCount / words.length,
      clarity: Math.max(0, 1 - vagueCount / words.length),
      detectedErrors: detectedErrors,
      type: this.detectPromptType(prompt)
    };
  }

  // Detectar tipo de prompt
  detectPromptType(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('flujo') || lowerPrompt.includes('workflow') || lowerPrompt.includes('automatizar')) {
      return 'workflow';
    }
    if (lowerPrompt.includes('datos') || lowerPrompt.includes('procesar') || lowerPrompt.includes('transformar')) {
      return 'data-processing';
    }
    if (lowerPrompt.includes('notifica') || lowerPrompt.includes('alerta') || lowerPrompt.includes('enviar')) {
      return 'notification-system';
    }
    
    return 'generic';
  }

    // Generar mejoras usando Gemini AI (enfocado en funcionalidad)
  async generateGeminiEnhancements(prompt, analysis, context) {
    if (!this.model) return [];

    try {
      const enhancementPrompt = `
Eres un EXPERTO ARQUITECTO DE WORKFLOWS n8n que traduce intenciones vagas de usuarios en especificaciones técnicas precisas para crear workflows funcionales.

PROMPT VAGO DEL USUARIO: "${prompt}"

ANÁLISIS DETECTADO:
- Vaguedad: ${(analysis.vagueness * 100).toFixed(0)}% (${analysis.vagueness > 0.7 ? 'MUY VAGO' : analysis.vagueness > 0.4 ? 'MODERADAMENTE VAGO' : 'ESPECÍFICO'})
- Claridad: ${(analysis.clarity * 100).toFixed(0)}%
- Especificidad funcional: ${(analysis.specificity * 100).toFixed(0)}%

🧠 TU MISIÓN CRÍTICA: 
Transformar este prompt vago en un PLAN TÉCNICO DETALLADO que cualquier sistema de generación de workflows pueda entender y ejecutar perfectamente, especificando SOLO operaciones válidas y nodos reales de n8n.

� RESTRICCIONES CRÍTICAS:
- USA EXCLUSIVAMENTE tipos de nodos válidos de n8n
- USA EXCLUSIVAMENTE operaciones válidas para cada tipo de nodo
- NO inventes operaciones como "transcribeAudio" - usa "audio" para OpenAI
- ESPECIFICA operaciones exactas: para OpenAI usa: "chat", "completion", "text", "image", "audio", "embedding"
- Para WhatsApp usa nodos HTTP Request con APIs válidas, NO "whatsAppBusinessCloud"

🎯 TRADUCE ESTAS INTENCIONES VAGAS A ESPECIFICACIONES TÉCNICAS:

**CASOS COMUNES A TRADUCIR:**

🎤 "transcribir audio" → 
- Nodo: n8n-nodes-base.openAi 
- Operación: "audio"
- Parámetros: {"operation": "audio", "model": "whisper-1", "audioInput": "{{$json.audioFile}}"}

🤖 "agente de IA" → 
- Nodo: n8n-nodes-base.agent o n8n-nodes-base.openAi
- Operación: "chat" para OpenAI
- Parámetros: {"operation": "chat", "model": "gpt-4", "messages": [{"role": "user", "content": "{{$json.message}}"}]}

📱 "WhatsApp" → 
- Nodo: n8n-nodes-base.httpRequest 
- Configuración: API de WhatsApp Business
- Parámetros: {"method": "POST", "url": "https://graph.facebook.com/v18.0/PHONE_ID/messages"}

🗃️ "base de datos" → 
- Para productos: n8n-nodes-base.googleSheets o n8n-nodes-base.supabase
- Operación: "getAll" para leer, "append" para escribir
- Parámetros específicos según el tipo de base de datos

🔍 "clasificar" → 
- Nodo: n8n-nodes-base.if o n8n-nodes-base.switch
- Operación: condiciones específicas
- Parámetros: {"conditions": [{"leftValue": "{{$json.field}}", "operation": "contains", "rightValue": "audio"}]}

🧠 PATRONES DE INTERPRETACIÓN INTELIGENTE:

**Cuando el usuario dice:** "agente de IA que clasifique mensajes"
**Traduce a:** "Usar n8n-nodes-base.openAi con operación 'chat' para analizar contenido y n8n-nodes-base.if para crear ramificaciones basadas en la clasificación"

**Cuando el usuario dice:** "convertir audio a texto"
**Traduce a:** "Usar n8n-nodes-base.openAi con operación 'audio' y modelo 'whisper-1' para transcripción"

**Cuando el usuario dice:** "corregir errores de texto"
**Traduce a:** "Usar n8n-nodes-base.openAi con operación 'chat' y prompt específico para corrección de texto"

**Cuando el usuario dice:** "conectar con base de datos de productos"
**Traduce a:** "Usar n8n-nodes-base.googleSheets con operación 'getAll' para cargar productos o n8n-nodes-base.supabase para base de datos moderna"

**Cuando el usuario dice:** "enviar mensaje por WhatsApp"
**Traduce a:** "Usar n8n-nodes-base.httpRequest con método POST a la API de WhatsApp Business"

🔧 ESPECIFICACIONES TÉCNICAS REQUERIDAS:

1. **ARQUITECTURA DE FLUJO COMPLETA:**
   - Nodo trigger específico (webhook, manualTrigger, cron)
   - Nodos de procesamiento con operaciones válidas
   - Nodos de salida con configuraciones correctas
   - Nodos de manejo de errores (if, switch)

2. **OPERACIONES VÁLIDAS POR NODO:**
   - OpenAI: "chat", "completion", "text", "image", "audio", "embedding"
   - GoogleSheets: "append", "getAll", "update", "clear"
   - HttpRequest: "GET", "POST", "PUT", "DELETE"
   - If: "equal", "notEqual", "contains", "startsWith", "isEmpty"
   - Set: transformación de datos con "values"
   - Code: JavaScript para lógica personalizada

3. **CONFIGURACIONES ESPECÍFICAS:**
   - Credenciales requeridas para cada servicio
   - Parámetros exactos con valores de ejemplo
   - Estructura de datos entre nodos
   - Manejo de errores y validaciones

4. **FLUJO LÓGICO FUNCIONAL:**
   - Secuencia clara de procesamiento
   - Condiciones y ramificaciones específicas
   - Transformaciones de datos explícitas
   - Respuestas y notificaciones definidas

🚀 FORMATO DE RESPUESTA TÉCNICA:

Proporciona una descripción técnica que incluya:

**ARQUITECTURA GENERAL:**
Workflow para [objetivo principal] que implementa [funcionalidad específica]

**FLUJO TÉCNICO DETALLADO:**
1. **TRIGGER:** [tipo de nodo específico] - [configuración exacta]
2. **PROCESAMIENTO:** [secuencia de nodos] - [operaciones válidas]
3. **INTEGRACIONES:** [nodos específicos] - [APIs y configuraciones]
4. **SALIDAS:** [nodos de respuesta] - [formatos y destinos]
5. **MANEJO DE ERRORES:** [nodos condicionales] - [validaciones]

**NODOS ESPECÍFICOS REQUERIDOS:**
- [Lista exacta de tipos de nodos con operaciones válidas]
- [Parámetros específicos para cada nodo]
- [Credenciales y configuraciones necesarias]

**CONFIGURACIONES CRÍTICAS:**
- [Operaciones exactas para evitar errores]
- [Formatos de datos entre nodos]
- [Validaciones y manejo de casos especiales]

TRANSFORMA AHORA el prompt vago en especificación técnica detallada (responde SOLO con la especificación técnica mejorada):`;

      // 📊 Registrar llamada a Gemini en el tracker
      const startTime = Date.now();
      
      const result = await this.model.generateContent(enhancementPrompt);
      const response = await result.response;
      const enhancedPrompt = response.text().trim();

      // 📊 Registrar llamada exitosa
      GeminiCallTracker.recordCall(
        'PromptEnhancementAgent',
        'enhance',
        Date.now() - startTime,
        enhancementPrompt.length,
        enhancedPrompt.length,
        true
      );

      return [{
        type: 'gemini_enhancement',
        description: 'Mejora funcional usando Gemini AI con restricción de nodos n8n válidos',
        original: prompt,
        enhanced: enhancedPrompt,
        improvement: 0.8
      }];

    } catch (error) {
      console.error('Error generando mejoras con Gemini:', error);
      
      // 📊 Registrar llamada fallida
      GeminiCallTracker.recordCall(
        'PromptEnhancementAgent',
        'enhance',
        Date.now() - startTime,
        enhancementPrompt ? enhancementPrompt.length : 0,
        0,
        false,
        error.message
      );
      
      return [];
    }
  }

  // Transformación funcional enfocada en objetivos
  async enhanceFunctionalWorkflow(prompt, analysis) {
    let enhanced = prompt;

    // Corregir errores ortográficos
    enhanced = enhanced.replace(/hablé/g, 'hable');
    enhanced = enhanced.replace(/envié/g, 'envíe');

    // Detectar plataformas, integraciones y acciones mencionadas
    const platforms = [];
    const integrations = [];
    const actions = [];
    
    if (enhanced.toLowerCase().includes('telegram')) platforms.push('Telegram');
    if (enhanced.toLowerCase().includes('whatsapp')) platforms.push('WhatsApp');
    if (enhanced.toLowerCase().includes('discord')) platforms.push('Discord');
    
    if (enhanced.toLowerCase().includes('calendario') || enhanced.toLowerCase().includes('calendar')) integrations.push('Calendario');
    if (enhanced.toLowerCase().includes('correo') || enhanced.toLowerCase().includes('email')) integrations.push('Email');
    if (enhanced.toLowerCase().includes('slack')) integrations.push('Slack');
    if (enhanced.toLowerCase().includes('notion')) integrations.push('Notion');
    if (enhanced.toLowerCase().includes('database') || enhanced.toLowerCase().includes('base de datos')) integrations.push('Base de Datos');
    
    if (enhanced.toLowerCase().includes('agendar') || enhanced.toLowerCase().includes('calendar')) actions.push('agendar eventos');
    if (enhanced.toLowerCase().includes('enviar') || enhanced.toLowerCase().includes('correo')) actions.push('enviar emails');
    if (enhanced.toLowerCase().includes('notifica')) actions.push('enviar notificaciones');

    const mainPlatform = platforms[0] || 'Chat/Mensajes';
    const primaryIntegration = integrations[0] || 'Servicio Principal';
    const primaryAction = actions[0] || 'procesar datos';

    // Crear descripción funcional clara y detallada (sin detalles técnicos)
    const functionalSpec = `
OBJETIVO DEL WORKFLOW: ${enhanced}

🎯 DESCRIPCIÓN FUNCIONAL DETALLADA:

1. **ENTRADA DE DATOS:**
   El workflow debe recibir mensajes de conversación desde ${mainPlatform} que contengan:
   - Texto de la conversación del cliente
   - Información de identificación del usuario
   - Timestamp de cuándo ocurrió la conversación
   - Contexto adicional relevante para el servicio

2. **PROCESAMIENTO REQUERIDO:**
   El sistema debe analizar automáticamente el contenido de la conversación para:
   - Extraer fechas y horarios mencionados por el cliente
   - Identificar el tipo de servicio que está solicitando
   - Detectar información de contacto adicional si está disponible
   - Determinar la urgencia o prioridad de la solicitud
   - Validar que la información extraída sea completa y coherente

3. **INTEGRACIÓN CON ${primaryIntegration}:**
   Una vez procesada la información, el workflow debe:
   - Crear automáticamente un evento en el calendario
   - Establecer fecha y hora basándose en lo extraído de la conversación
   - Incluir detalles relevantes del cliente y tipo de servicio
   - Configurar recordatorios apropiados para el evento
   - Asignar el evento a las personas responsables del servicio

4. **NOTIFICACIÓN AL EQUIPO:**
   El sistema debe informar al equipo correspondiente mediante:
   - Envío de correo electrónico con detalles del nuevo evento
   - Inclusión de información completa del cliente y conversación original
   - Resumen de los datos extraídos y evento creado
   - Enlaces directos para acceder al evento en el calendario

5. **RESPUESTA AL CLIENTE:**
   Finalmente, debe confirmar al cliente que:
   - Su solicitud ha sido procesada correctamente
   - Los datos han sido registrados en el sistema
   - El equipo ha sido notificado sobre su solicitud
   - Próximos pasos o información de contacto si es necesario

6. **CASOS ESPECIALES A CONSIDERAR:**
   - Qué hacer cuando la información en la conversación es incompleta
   - Cómo manejar fechas y horarios ambiguos o conflictivos
   - Procedimiento cuando no se puede determinar el tipo de servicio
   - Gestión de solicitudes duplicadas o repetidas del mismo cliente
   - Manejo de conversaciones que no corresponden a solicitudes de servicio

7. **VALIDACIONES REQUERIDAS:**
   - Verificar que las fechas solicitadas sean válidas y futuras
   - Confirmar disponibilidad en el calendario antes de crear eventos
   - Validar que la información del cliente sea completa
   - Asegurar que el tipo de servicio identificado sea correcto
   - Comprobar que las notificaciones se envíen exitosamente

8. **RESULTADO ESPERADO:**
   Al finalizar el proceso, el workflow habrá logrado:
   - Conversión automática de conversación de cliente en evento de calendario
   - Notificación completa al equipo con toda la información relevante
   - Confirmación al cliente de que su solicitud fue procesada
   - Registro organizado y estructurado de la solicitud en el sistema
   - Flujo eficiente que reduce trabajo manual y mejora la respuesta al cliente

Este workflow debe funcionar de manera completamente automática, procesando las conversaciones de clientes y gestionando todo el flujo desde la recepción inicial hasta la confirmación final, asegurando que ninguna solicitud se pierda y que tanto el equipo como el cliente estén informados apropiadamente.`;

    return [{
      type: 'functional_workflow',
      description: 'Transformación funcional completa enfocada en objetivos y resultados',
      original: prompt,
      enhanced: functionalSpec,
      improvement: 0.9
    }];
  }

  // Generar mejoras basadas en análisis
  async generateEnhancements(prompt, analysis, context) {
    const enhancements = [];

    // Priorizar transformación funcional para workflows (umbral más bajo)
    if (analysis.type === 'workflow' && analysis.vagueness > 0.4) {
      console.log('🎯 Aplicando transformación funcional prioritaria para workflow vago');
      const functionalEnhancement = await this.enhanceFunctionalWorkflow(prompt, analysis);
      enhancements.push(...functionalEnhancement);
      return enhancements; // Retornar solo la transformación funcional
    }

    // También aplicar si contiene palabras clave de workflow sin importar vaguedad
    if (prompt.toLowerCase().includes('flujo') || prompt.toLowerCase().includes('workflow') || 
        (prompt.toLowerCase().includes('cliente') && prompt.toLowerCase().includes('agendar'))) {
      console.log('🎯 Aplicando transformación funcional para workflow detectado');
      const functionalEnhancement = await this.enhanceFunctionalWorkflow(prompt, analysis);
      enhancements.push(...functionalEnhancement);
      return enhancements;
    }

    // Para otros casos, aplicar mejoras estándar
    if (analysis.clarity < 0.7) {
      enhancements.push({
        type: 'clarity',
        description: 'Mejorar claridad y legibilidad',
        improvement: 0.3
      });
    }

    if (analysis.specificity < 0.5) {
      enhancements.push({
        type: 'specificity',
        description: 'Agregar detalles específicos y ejemplos',
        improvement: 0.4
      });
    }

    if (analysis.sentenceCount < 2) {
      enhancements.push({
        type: 'structure',
        description: 'Mejorar estructura y organización',
        improvement: 0.3
      });
    }

    // Usar Gemini AI si está disponible y es beneficioso
    if (this.model && analysis.vagueness > 0.4) {
      const geminiEnhancements = await this.generateGeminiEnhancements(prompt, analysis, context);
      enhancements.push(...geminiEnhancements);
    }

    return enhancements;
  }

  // Aplicar mejoras al prompt
  async applyEnhancements(prompt, enhancements, options) {
    if (enhancements.length === 0) return prompt;

    console.log(`📝 Aplicando ${enhancements.length} mejoras...`);

    // Priorizar transformación funcional
    const functionalWorkflow = enhancements.find(e => e.type === 'functional_workflow');
    if (functionalWorkflow) {
      console.log(`✅ Aplicando mejora: ${functionalWorkflow.type}`);
      return functionalWorkflow.enhanced;
    }

    // Usar Gemini enhancement si está disponible
    const geminiEnhancement = enhancements.find(e => e.type === 'gemini_enhancement');
    if (geminiEnhancement) {
      console.log(`✅ Aplicando mejora: ${geminiEnhancement.type}`);
      return geminiEnhancement.enhanced;
    }

    // Aplicar mejoras estándar
    let enhanced = prompt;
    const sortedEnhancements = enhancements.sort((a, b) => b.improvement - a.improvement);

    for (const enhancement of sortedEnhancements) {
      if (enhancement.type !== 'functional_workflow' && enhancement.type !== 'gemini_enhancement') {
        console.log(`✅ Aplicando mejora: ${enhancement.type}`);
        enhanced = await this.enhancementMethods[enhancement.type](enhanced);
      }
    }

    return enhanced;
  }

  // Mejoras estándar
  enhanceClarity(prompt) {
    return `${prompt} (clarificado para mejor comprensión)`;
  }

  enhanceSpecificity(prompt) {
    return `${prompt} Por ejemplo, proporciona casos de uso específicos y escenarios concretos. Especifica cantidades, frecuencias o escalas cuando sea relevante.`;
  }

  enhanceStructure(prompt) {
    return `Estructura la respuesta de la siguiente manera:\n\n1. Primero, ${prompt}\n2. Luego, proporciona detalles específicos y ejemplos.\n\n3. Finalmente, incluye recomendaciones prácticas.`;
  }

  // Validar calidad de mejora
  async validateEnhancement(original, enhanced) {
    const originalAnalysis = await this.analyzePrompt(original);
    const enhancedAnalysis = await this.analyzePrompt(enhanced);

    return {
      qualityImprovement: ((enhancedAnalysis.clarity - originalAnalysis.clarity) + 
                          (enhancedAnalysis.specificity - originalAnalysis.specificity) + 
                          (originalAnalysis.vagueness - enhancedAnalysis.vagueness)) / 3,
      lengthIncrease: enhanced.length / original.length,
      clarityImprovement: enhancedAnalysis.clarity - originalAnalysis.clarity,
      specificityImprovement: enhancedAnalysis.specificity - originalAnalysis.specificity,
      vaguenessReduction: originalAnalysis.vagueness - enhancedAnalysis.vagueness,
      overallScore: (enhancedAnalysis.clarity + enhancedAnalysis.specificity + (1 - enhancedAnalysis.vagueness)) / 3
    };
  }

  // Método de test
  async testEnhancement(testPrompt) {
    console.log('🔍 TESTING ENHANCED PROMPT AGENT');
    console.log('=====================================');
    console.log();
    console.log('📝 PROMPT ORIGINAL COMPLETO:');
    console.log('============================');
    console.log(`"${testPrompt}"`);
    console.log(`Longitud: ${testPrompt.length} caracteres`);
    console.log();

    const result = await this.enhancePrompt(testPrompt);

    console.log('📈 ESTADÍSTICAS DE MEJORA:');
    console.log('==========================');
    console.log(`Longitud original: ${testPrompt.length} caracteres`);
    console.log(`Longitud mejorada: ${result.enhancedPrompt.length} caracteres`);
    console.log(`Ratio de mejora: ${(result.enhancedPrompt.length / testPrompt.length).toFixed(1)}x más detallado`);
    console.log(`Incremento: +${result.enhancedPrompt.length - testPrompt.length} caracteres`);
    console.log(`Mejoras aplicadas: ${result.enhancements.length}`);
    console.log(`Mejora de calidad: ${result.validation.qualityImprovement}`);
    console.log();
    console.log('🚀 PROMPT MEJORADO COMPLETO:');
    console.log('============================');
    console.log(result.enhancedPrompt);
    console.log();
    console.log('✅ TRANSFORMACIÓN COMPLETADA');
    console.log('============================');

    return result;
  }

  // Validar que los nodos mencionados sean tipos válidos de n8n
  validateN8nNodes(prompt) {
    const allValidNodes = [
      ...this.validN8nNodes.triggers,
      ...this.validN8nNodes.actions,
      ...this.validN8nNodes.communication,
      ...this.validN8nNodes.data,
      ...this.validN8nNodes.productivity
    ];

    const mentionedNodes = [];
    const invalidNodes = [];

    // Buscar menciones de nodos en el prompt
    allValidNodes.forEach(node => {
      if (prompt.includes(node)) {
        mentionedNodes.push(node);
      }
    });

    // Buscar posibles nodos inválidos (patrón n8n-nodes-base.)
    const nodePattern = /n8n-nodes-base\.[a-zA-Z]+/g;
    const foundNodes = prompt.match(nodePattern) || [];

    foundNodes.forEach(node => {
      if (!allValidNodes.includes(node)) {
        invalidNodes.push(node);
      }
    });

    return {
      mentionedNodes,
      invalidNodes,
      isValid: invalidNodes.length === 0,
      totalValidNodes: allValidNodes.length
    };
  }

  /**
   * 🎯 MÉTODO FALTANTE: generateTargetedImprovements
   */
  async generateTargetedImprovements(prompt, analysis) {
    const improvements = [];
    
    try {
      // Asegurar que prompt es string
      const promptStr = typeof prompt === 'string' ? prompt : String(prompt);
      
      if (analysis && analysis.complexity) {
        if (analysis.complexity > 6) {
          improvements.push({
            type: 'structure',
            description: 'Mejorar estructura para complejidad alta'
          });
        }
        
        if (analysis.estimatedNodes > 10) {
          improvements.push({
            type: 'segmentation',
            description: 'Segmentar workflow complejo'
          });
        }
      }
      
      // Verificar si necesita mejoras específicas
      if (promptStr.includes('automation') && !promptStr.includes('trigger')) {
        improvements.push({
          type: 'trigger',
          description: 'Agregar trigger específico'
        });
      }
      
      return improvements;
      
    } catch (error) {
      console.log('⚠️ Error en generateTargetedImprovements:', error.message);
      return [];
    }
  }

  /**
   * 🔍 MÉTODO FALTANTE: validatePrompt
   */
  validatePrompt(prompt) {
    try {
      // Asegurar que prompt es string
      const promptStr = typeof prompt === 'string' ? prompt : String(prompt);
      
      const validation = {
        isValid: true,
        issues: [],
        score: 100
      };
      
      // Validaciones básicas
      if (promptStr.length < 10) {
        validation.isValid = false;
        validation.issues.push('Prompt demasiado corto');
        validation.score -= 20;
      }
      
      if (promptStr.length > 2000) {
        validation.issues.push('Prompt muy largo, podría ser ineficiente');
        validation.score -= 10;
      }
      
      // Verificar estructura básica
      if (!promptStr.includes(' ')) {
        validation.isValid = false;
        validation.issues.push('Prompt no tiene estructura de oraciones');
        validation.score -= 30;
      }
      
      return validation;
      
    } catch (error) {
      console.log('⚠️ Error en validatePrompt:', error.message);
      return { isValid: false, issues: ['Error en validación'], score: 0 };
    }
  }

  /**
   * 🔧 MÉTODO AUXILIAR: Asegurar prompt es string
   */
  ensurePromptIsString(prompt) {
    if (typeof prompt === 'string') {
      return prompt;
    } else if (prompt && typeof prompt === 'object') {
      return JSON.stringify(prompt);
    } else {
      return String(prompt || '');
    }
  }
}

// Exportar la clase
export default PromptEnhancementAgent;

// 🚀 EJECUCIÓN DIRECTA PARA TESTING
if (process.argv[2]) {
  const agent = new PromptEnhancementAgent();
  const inputPrompt = process.argv[2];
  
  console.log('\n🎯 SISTEMA HÍBRIDO PROMPT ENHANCEMENT AGENT V3.0');
  console.log('=' * 60);
  console.log('📝 PROMPT ORIGINAL:');
  console.log(inputPrompt);
  console.log('\n🔍 PROCESANDO...\n');
  
  agent.enhancePrompt(inputPrompt).then(result => {
    console.log('🎯 NIVEL DE USUARIO DETECTADO:', result.userLevel);
    console.log('⚙️  TIPO DE PROCESAMIENTO:', result.processingType);
    console.log('📊 ANÁLISIS DE COMPLEJIDAD:', JSON.stringify(result.complexityAnalysis, null, 2));
    console.log('\n🚀 PROMPT MEJORADO:');
    console.log(result.enhancedPrompt);
    console.log('\n✅ PROCESO COMPLETADO');
  }).catch(error => {
    console.error('❌ Error:', error.message);
  });
}
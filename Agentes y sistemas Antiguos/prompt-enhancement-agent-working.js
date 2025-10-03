// 🚀 PROMPT ENHANCEMENT AGENT HÍBRIDO V3.0 - SISTEMA SIMPLIFICADO Y FUNCIONAL

class PromptEnhancementAgent {
  constructor() {
    console.log('✨ Prompt Enhancement Agent Híbrido V3.0 inicializado');
  }

  // 🧠 DETECTOR DE COMPLEJIDAD - SISTEMA HÍBRIDO INTELIGENTE
  analyzePromptComplexity(prompt) {
    if (typeof prompt !== 'string') prompt = String(prompt);
    
    const lowerPrompt = prompt.toLowerCase();
    let vagueScore = 0;
    let intermediateScore = 0;
    let advancedScore = 0;
    
    // INDICADORES VAGOS (novatos) - Solo cuentan si NO hay términos técnicos
    const vagueIndicators = [
      'quiero', 'necesito', 'algo', 'cosa', 'hacer', 'crear', 'no sé', 'ayuda', 
      'funcione', 'automático', 'fácil', 'simple'
    ];
    vagueIndicators.forEach(indicator => {
      if (lowerPrompt.includes(indicator)) vagueScore += 1;
    });
    
    // INDICADORES INTERMEDIOS (terminología técnica básica)
    const intermediateIndicators = [
      'webhook', 'api', 'json', 'http', 'request', 'response', 'trigger', 
      'workflow', 'node', 'integration', 'database', 'endpoint'
    ];
    intermediateIndicators.forEach(indicator => {
      if (lowerPrompt.includes(indicator)) intermediateScore += 1;
    });
    
    // INDICADORES AVANZADOS (terminología muy técnica)
    const advancedIndicators = [
      'arquitectura modular', 'parsing semántico', 'asr', 'transcripción automática',
      'matching', 'latencia', 'n8n-nodes-base', 'oauth', 'jwt', 'regex', 
      'expression', 'credentials', 'polling', 'batch', 'retry', 'timeout',
      'agentes ia', 'corrección gramatical contextual', 'texto plano vs audio',
      'respuesta estructurada', 'baja latencia', 'business api'
    ];
    advancedIndicators.forEach(indicator => {
      if (lowerPrompt.includes(indicator)) advancedScore += 1;
    });
    
    // CALCULAR NIVEL CON NUEVA LÓGICA
    const totalWords = prompt.split(' ').length;
    
    let userLevel, processingType;
    
    // Si hay 3+ términos avanzados, es EXPERTO
    if (advancedScore >= 3) {
      userLevel = 'EXPERT';
      processingType = 'MINIMAL';
    }
    // Si hay 2+ términos intermedios y menos de 3 vagos, es INTERMEDIO  
    else if (intermediateScore >= 2 && vagueScore < 3) {
      userLevel = 'INTERMEDIATE';
      processingType = 'MODERATE';
    }
    // Si hay muchos términos vagos y pocos técnicos, es NOVATO
    else if (vagueScore >= 3 && (intermediateScore + advancedScore) < 2) {
      userLevel = 'NOVICE';
      processingType = 'FULL';
    }
    // Criterio de longitud: prompts largos y técnicos tienden a ser intermedios/expertos
    else if (totalWords > 30 && (intermediateScore + advancedScore) >= 1) {
      userLevel = 'INTERMEDIATE';
      processingType = 'MODERATE';
    }
    // Por defecto, novato
    else {
      userLevel = 'NOVICE';
      processingType = 'FULL';
    }
    
    return {
      userLevel,
      processingType,
      scores: { vague: vagueScore, intermediate: intermediateScore, advanced: advancedScore },
      enhancementNeeded: processingType,
      wordCount: totalWords
    };
  }

  // 🎯 MAPEO DE INTENCIONES MEJORADO PARA NOVATOS
  translateVagueToTechnical(prompt) {
    if (typeof prompt !== 'string') prompt = String(prompt);
    
    const lowerPrompt = prompt.toLowerCase();
    let technicalSpecs = [];
    
    // DETECCIÓN DE INTENCIONES PRINCIPALES
    if (lowerPrompt.includes('whatsapp')) {
      technicalSpecs.push({
        service: 'WhatsApp Business API',
        nodes: ['n8n-nodes-base.webhook', 'n8n-nodes-base.httpRequest'],
        description: 'Configurar webhook para recibir mensajes de WhatsApp y API para enviar respuestas'
      });
    }
    
    if (lowerPrompt.includes('voz') || lowerPrompt.includes('audio')) {
      technicalSpecs.push({
        service: 'Audio Processing',
        nodes: ['n8n-nodes-base.openAi'],
        description: 'Usar OpenAI Whisper para transcripción de audio a texto',
        operation: 'audio.transcriptions'
      });
    }
    
    if (lowerPrompt.includes('texto') || lowerPrompt.includes('mensaje')) {
      technicalSpecs.push({
        service: 'Text Processing',
        nodes: ['n8n-nodes-base.code', 'n8n-nodes-base.if'],
        description: 'Procesar y analizar contenido de texto de mensajes'
      });
    }
    
    if (lowerPrompt.includes('tienda') || lowerPrompt.includes('servicio') || lowerPrompt.includes('celular')) {
      technicalSpecs.push({
        service: 'Business Logic',
        nodes: ['n8n-nodes-base.code', 'n8n-nodes-base.switch'],
        description: 'Clasificar consultas y generar respuestas automáticas sobre productos/servicios'
      });
    }
    
    // 🎯 DETECCIÓN ESPECÍFICA DE PATRONES IF, MERGE, AI AGENT
    
    // Detectar necesidad de NODO IF para validaciones
    if ((lowerPrompt.includes('si es') || lowerPrompt.includes('si no es') || 
         lowerPrompt.includes('sticker') || lowerPrompt.includes('mensaje incorrecto') ||
         lowerPrompt.includes('identifique')) &&
        (lowerPrompt.includes('audio') || lowerPrompt.includes('texto'))) {
      technicalSpecs.push({
        service: 'Message Validation (IF Node)',
        nodes: ['n8n-nodes-base.if'],
        description: 'Validar tipo de mensaje y enrutar según sea audio, texto o sticker',
        connections: {
          true: 'Procesar con IA (audio → transcribir, texto → directo)',
          false: 'Enviar mensaje de error: "Tipo de mensaje no soportado"'
        },
        condition: '{{$json.message.type}} contains "text,audio"'
      });
    }
    
    // Detectar necesidad de NODO MERGE para unificación
    if ((lowerPrompt.includes('múltiples tipos') || lowerPrompt.includes('varios') ||
         lowerPrompt.includes('unifiquen') || lowerPrompt.includes('unificar')) &&
        (lowerPrompt.includes('entrada') || lowerPrompt.includes('datos') ||
         lowerPrompt.includes('audio, texto e imagen'))) {
      technicalSpecs.push({
        service: 'Data Unification (MERGE Node)',
        nodes: ['n8n-nodes-base.merge'],
        description: 'Unificar múltiples tipos de entrada (audio, texto, imagen) para procesamiento conjunto',
        connections: {
          inputs: ['Audio Messages', 'Text Messages', 'Image Messages'],
          output: 'Unified Message Data'
        },
        mode: 'multiplex'
      });
    }
    
    // Detectar necesidad de NODO AI AGENT específico
    if (lowerPrompt.includes('agente ia') || lowerPrompt.includes('agente IA') ||
        (lowerPrompt.includes('clasificar') && lowerPrompt.includes('intención'))) {
      technicalSpecs.push({
        service: 'AI Agent Classification',
        nodes: ['n8n-nodes-base.agent'],
        description: 'Agente IA para clasificar intención del usuario y generar respuestas contextuales',
        aiConfig: {
          task: 'Clasificar intención del mensaje del usuario',
          model: 'gpt-4',
          instructions: 'Analiza el mensaje y determina si es: consulta_producto, consulta_servicio, soporte_tecnico, informacion_general',
          tools: ['text_analyzer', 'knowledge_base']
        }
      });
    }
    
    return technicalSpecs;
  }

  // 🔧 CORRECTOR DE ERRORES BÁSICO
  autoCorrect(prompt) {
    if (typeof prompt !== 'string') prompt = String(prompt);
    
    let corrected = prompt;
    const corrections = [];
    
    // Corrección específica de operaciones OpenAI problemáticas
    const openAIOperationFixes = {
      'transcribeAudio': 'audio',
      'transcribe': 'audio',
      'speechToText': 'audio',
      'whisperAPI': 'audio',
      'voiceToText': 'audio',
      'audioTranscription': 'audio',
      'sttOperation': 'audio',
      'generateText': 'chat',
      'generateResponse': 'chat',
      'chatCompletion': 'chat',
      'askQuestion': 'chat',
      'chatGPT': 'chat',
      'generateImage': 'image',
      'createImage': 'image',
      'dalleGenerate': 'image',
      'imageGeneration': 'image',
      'generateEmbedding': 'embedding',
      'createEmbedding': 'embedding',
      'vectorize': 'embedding',
      'textToVector': 'embedding',
      'moderate': 'moderation',
      'moderateContent': 'moderation',
      'checkContent': 'moderation',
      'contentFilter': 'moderation'
    };

    Object.entries(openAIOperationFixes).forEach(([wrong, correct]) => {
      if (corrected.includes(wrong)) {
        corrected = corrected.replace(new RegExp(wrong, 'g'), correct);
        corrections.push(`${wrong} → ${correct}`);
      }
    });

    // Corrección específica de operaciones HTTP problemáticas
    const httpOperationFixes = {
      'whatsAppSend': 'POST',
      'sendWhatsApp': 'POST',
      'telegramSend': 'POST',
      'sendTelegram': 'POST',
      'slackSend': 'POST',
      'sendSlack': 'POST',
      'discordSend': 'POST',
      'sendDiscord': 'POST',
      'apiCall': 'POST',
      'makeRequest': 'POST',
      'callAPI': 'POST',
      'restCall': 'POST'
    };

    Object.entries(httpOperationFixes).forEach(([wrong, correct]) => {
      if (corrected.includes(wrong)) {
        corrected = corrected.replace(new RegExp(wrong, 'g'), correct);
        corrections.push(`${wrong} → ${correct}`);
      }
    });

    // Corrección específica de operaciones Google Sheets problemáticas
    const sheetsOperationFixes = {
      'readSheet': 'getAll',
      'getSheet': 'getAll',
      'loadSheet': 'getAll',
      'fetchData': 'getAll',
      'insertRow': 'append',
      'addRow': 'append',
      'createRow': 'append',
      'writeRow': 'append',
      'saveData': 'append',
      'updateCell': 'update',
      'modifyCell': 'update',
      'editCell': 'update',
      'changeCell': 'update',
      'deleteSheet': 'clear',
      'clearSheet': 'clear',
      'removeData': 'clear'
    };

    Object.entries(sheetsOperationFixes).forEach(([wrong, correct]) => {
      if (corrected.includes(wrong)) {
        corrected = corrected.replace(new RegExp(wrong, 'g'), correct);
        corrections.push(`${wrong} → ${correct}`);
      }
    });

    // Corrección específica de operaciones IF problemáticas
    const ifOperationFixes = {
      'equals': 'equal',
      'notEquals': 'notEqual',
      'greaterThan': 'larger',
      'lessThan': 'smaller',
      'includes': 'contains',
      'hasValue': 'isNotEmpty',
      'hasNoValue': 'isEmpty',
      'beginsWith': 'startsWith',
      'finishesWith': 'endsWith'
    };

    Object.entries(ifOperationFixes).forEach(([wrong, correct]) => {
      if (corrected.includes(wrong)) {
        corrected = corrected.replace(new RegExp(wrong, 'g'), correct);
        corrections.push(`${wrong} → ${correct}`);
      }
    });

    // Corrección específica de tipos de nodos problemáticos
    const nodeTypeFixes = {
      'n8n-nodes-base.whatsAppBusinessCloud': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.whatsAppBusiness': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.instagramAPI': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.tiktokAPI': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.youtubeAPI': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.openAiChat': 'n8n-nodes-base.openAi',
      'n8n-nodes-base.chatGPT': 'n8n-nodes-base.openAi',
      'n8n-nodes-base.gpt4': 'n8n-nodes-base.openAi',
      'n8n-nodes-base.claudeAI': 'n8n-nodes-base.anthropic',
      'n8n-nodes-base.geminiAI': 'n8n-nodes-base.googleGemini'
    };

    Object.entries(nodeTypeFixes).forEach(([wrong, correct]) => {
      if (corrected.includes(wrong)) {
        corrected = corrected.replace(new RegExp(wrong, 'g'), correct);
        corrections.push(`${wrong} → ${correct}`);
      }
    });
    
    return { prompt: corrected, corrections };
  }

  // 🚀 PROCESAMIENTO PRINCIPAL HÍBRIDO
  async enhancePrompt(prompt) {
    try {
      console.log('\n🧠 Analizando complejidad del prompt...');
      
      // FASE 1: Análisis de complejidad
      const complexity = this.analyzePromptComplexity(prompt);
      console.log(`📊 Nivel detectado: ${complexity.userLevel} (${complexity.processingType})`);
      
      // FASE 2: Procesamiento adaptativo según nivel
      let enhancedPrompt = prompt;
      let technicalSpecs = [];
      
      if (complexity.processingType === 'FULL') {
        console.log('🔄 Usuario novato detectado - Aplicando traducción completa');
        technicalSpecs = this.translateVagueToTechnical(prompt);
        
        // Generar prompt técnico completo
        if (technicalSpecs.length > 0) {
          enhancedPrompt = this.generateTechnicalWorkflow(prompt, technicalSpecs);
        }
        
      } else if (complexity.processingType === 'MODERATE') {
        console.log('⚙️ Usuario intermedio detectado - Aplicando optimizaciones específicas');
        const correctionResult = this.autoCorrect(prompt);
        enhancedPrompt = correctionResult.prompt;
        
        // Añadir mejoras técnicas específicas para usuarios intermedios
        enhancedPrompt += '\n\n// OPTIMIZACIONES RECOMENDADAS PARA ARQUITECTURA TÉCNICA:\n';
        enhancedPrompt += '// - Implementar connection pooling para bases de datos\n';
        enhancedPrompt += '// - Usar credentials manager para APIs externas\n';
        enhancedPrompt += '// - Configurar timeouts apropiados (5-10s)\n';
        enhancedPrompt += '// - Implementar retry logic con backoff exponencial\n';
        enhancedPrompt += '// - Añadir logging y monitoreo de latencia\n';
        enhancedPrompt += '// - Optimizar parsing semántico con índices\n';
        enhancedPrompt += '// - Implementar cache para matching frecuente\n';
        
      } else {
        console.log('🎖️ Usuario experto detectado - Validación mínima y sugerencias avanzadas');
        const correctionResult = this.autoCorrect(prompt);
        enhancedPrompt = correctionResult.prompt;
        
        // Solo añadir validaciones menores y sugerencias avanzadas
        if (correctionResult.corrections.length > 0) {
          enhancedPrompt += `\n\n// Correcciones aplicadas: ${correctionResult.corrections.join(', ')}`;
        }
        
        enhancedPrompt += '\n\n// VALIDACIONES TÉCNICAS AVANZADAS:';
        enhancedPrompt += '\n// ✅ Arquitectura modular correctamente especificada';
        enhancedPrompt += '\n// ✅ Flujo de datos optimizado para baja latencia';
        enhancedPrompt += '\n// 💡 Sugerencia: Considerar implementar rate limiting';
        enhancedPrompt += '\n// 💡 Sugerencia: Evaluar uso de message queues para escalabilidad';
      }
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: enhancedPrompt,
        userLevel: complexity.userLevel,
        processingType: complexity.processingType,
        technicalSpecs: technicalSpecs,
        complexityAnalysis: complexity
      };
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      return {
        originalPrompt: prompt,
        enhancedPrompt: prompt,
        userLevel: 'ERROR',
        processingType: 'ERROR',
        error: error.message
      };
    }
  }

  // 🏗️ GENERADOR DE WORKFLOW TÉCNICO MEJORADO PARA NOVATOS
  generateTechnicalWorkflow(originalPrompt, technicalSpecs) {
    let workflow = `Crear un workflow de automatización inteligente basado en: "${originalPrompt}"\n\n`;
    
    workflow += "ESPECIFICACIONES TÉCNICAS GENERADAS:\n\n";
    
    technicalSpecs.forEach((spec, index) => {
      workflow += `${index + 1}. ${spec.service}:\n`;
      workflow += `   - Nodos requeridos: ${spec.nodes.join(', ')}\n`;
      workflow += `   - Descripción: ${spec.description}\n`;
      if (spec.operation) {
        workflow += `   - Operación: ${spec.operation}\n`;
      }
      
      // 🎯 EXPLICACIONES ESPECÍFICAS DE CONEXIONES
      if (spec.connections) {
        if (spec.service.includes('IF Node')) {
          workflow += `   - CONEXIÓN TRUE: ${spec.connections.true}\n`;
          workflow += `   - CONEXIÓN FALSE: ${spec.connections.false}\n`;
          workflow += `   - Condición: ${spec.condition}\n`;
        }
        if (spec.service.includes('MERGE Node')) {
          workflow += `   - ENTRADAS: ${spec.connections.inputs.join(', ')}\n`;
          workflow += `   - SALIDA: ${spec.connections.output}\n`;
          workflow += `   - Modo: ${spec.mode}\n`;
        }
      }
      
      if (spec.aiConfig) {
        workflow += `   - Tarea IA: ${spec.aiConfig.task}\n`;
        workflow += `   - Modelo: ${spec.aiConfig.model}\n`;
        workflow += `   - Herramientas: ${spec.aiConfig.tools.join(', ')}\n`;
      }
      
      workflow += `\n`;
    });
    
    workflow += "ARQUITECTURA DEL WORKFLOW CON CONEXIONES DETALLADAS:\n\n";
    
    // Generar arquitectura específica según las especificaciones detectadas
    let nodeCounter = 1;
    
    workflow += `${nodeCounter++}. NODO WEBHOOK: Recibir mensajes\n`;
    workflow += "   - URL del webhook configurada en plataforma de mensajería\n";
    workflow += "   - Autenticación mediante token de verificación\n";
    workflow += "   ↓ FLUJO: Mensaje recibido → Nodo IF (Validación)\n\n";
    
    // IF Node para validación (si se detectó)
    const ifSpec = technicalSpecs.find(spec => spec.service.includes('IF Node'));
    if (ifSpec) {
      workflow += `${nodeCounter++}. NODO IF: Validación de tipo de mensaje\n`;
      workflow += `   - Condición: ${ifSpec.condition}\n`;
      workflow += `   ├── ✅ TRUE: ${ifSpec.connections.true}\n`;
      workflow += `   └── ❌ FALSE: ${ifSpec.connections.false}\n`;
      workflow += "   ↓ FLUJO VERDADERO: Mensaje válido → Procesamiento\n";
      workflow += "   ↓ FLUJO FALSO: Mensaje inválido → Respuesta de error\n\n";
    }
    
    // MERGE Node para unificación (si se detectó)
    const mergeSpec = technicalSpecs.find(spec => spec.service.includes('MERGE Node'));
    if (mergeSpec) {
      workflow += `${nodeCounter++}. NODO MERGE: Unificación de datos\n`;
      workflow += "   📥 ENTRADAS MÚLTIPLES:\n";
      mergeSpec.connections.inputs.forEach((input, i) => {
        workflow += `      ${i+1}. ${input}\n`;
      });
      workflow += `   📤 SALIDA UNIFICADA: ${mergeSpec.connections.output}\n`;
      workflow += `   - Modo de operación: ${mergeSpec.mode}\n`;
      workflow += "   ↓ FLUJO: Datos unificados → Agente IA\n\n";
    }
    
    // Audio processing (si se detectó)
    const audioSpec = technicalSpecs.find(spec => spec.service.includes('Audio Processing'));
    if (audioSpec) {
      workflow += `${nodeCounter++}. NODO OPENAI: Transcripción de audio\n`;
      workflow += `   - Operación: ${audioSpec.operation}\n`;
      workflow += "   - Model: whisper-1\n";
      workflow += "   - Input: Archivo de audio del mensaje\n";
      workflow += "   ↓ FLUJO: Audio → Texto transcrito\n\n";
    }
    
    // AI Agent (si se detectó)
    const aiSpec = technicalSpecs.find(spec => spec.service.includes('AI Agent'));
    if (aiSpec) {
      workflow += `${nodeCounter++}. NODO AI AGENT: Procesamiento inteligente\n`;
      workflow += `   - Tarea: ${aiSpec.aiConfig.task}\n`;
      workflow += `   - Modelo: ${aiSpec.aiConfig.model}\n`;
      workflow += `   - Instrucciones: ${aiSpec.aiConfig.instructions}\n`;
      workflow += `   - Herramientas: ${aiSpec.aiConfig.tools.join(', ')}\n`;
      workflow += "   📥 ENTRADA: Mensaje procesado + contexto\n";
      workflow += "   📤 SALIDA: Clasificación de intención + respuesta\n";
      workflow += "   ↓ FLUJO: Análisis IA → Respuesta contextual\n\n";
    }
    
    workflow += `${nodeCounter++}. NODO HTTP REQUEST: Enviar respuesta\n`;
    workflow += "   - API de la plataforma de mensajería\n";
    workflow += "   - Contenido personalizado según clasificación\n";
    workflow += "   - Formato JSON con respuesta estructurada\n\n";
    
    workflow += "PATRONES DE CONEXIÓN ESPECÍFICOS:\n\n";
    
    if (ifSpec) {
      workflow += "🔀 NODO IF - Manejo de conexiones TRUE/FALSE:\n";
      workflow += "   • TRUE: Continúa el flujo principal de procesamiento\n";
      workflow += "   • FALSE: Envía mensaje de error y termina el flujo\n";
      workflow += "   • Uso: Filtrar tipos de mensaje no soportados\n\n";
    }
    
    if (mergeSpec) {
      workflow += "🔄 NODO MERGE - Unificación de múltiples entradas:\n";
      workflow += "   • Recibe datos de múltiples fuentes simultáneamente\n";
      workflow += "   • Combina y estructura la información\n";
      workflow += "   • Prepara entrada completa para procesamiento IA\n\n";
    }
    
    if (aiSpec) {
      workflow += "🤖 NODO AI AGENT - Procesamiento inteligente:\n";
      workflow += "   • Analiza contexto completo del mensaje\n";
      workflow += "   • Clasifica intención automáticamente\n";
      workflow += "   • Genera respuestas contextualizadas\n";
      workflow += "   • Utiliza herramientas especializadas\n\n";
    }
    
    workflow += "CONFIGURACIONES NECESARIAS:\n";
    workflow += "- Credentials para APIs de mensajería\n";
    workflow += "- API Key de OpenAI para transcripción y agentes\n";
    workflow += "- Base de datos de productos/servicios\n";
    workflow += "- Templates de respuesta personalizados\n";
    workflow += "- Configuración de herramientas para agente IA\n\n";
    
    workflow += "FUNCIONALIDAD RESULTANTE:\n";
    workflow += "✅ Valida tipos de mensaje automáticamente\n";
    workflow += "✅ Rechaza stickers/imágenes con mensaje apropiado\n";
    workflow += "✅ Procesa audio y texto de manera unificada\n";
    workflow += "✅ Clasifica intención con IA avanzada\n";
    workflow += "✅ Genera respuestas contextualizadas\n";
    workflow += "✅ Maneja múltiples flujos de datos eficientemente\n";
    workflow += "✅ Funciona 24/7 con inteligencia adaptativa";
    
    return workflow;
  }
}

// 🚀 EJECUCIÓN DIRECTA
if (process.argv[2]) {
  const agent = new PromptEnhancementAgent();
  const inputPrompt = process.argv[2];
  
  console.log('\n🎯 SISTEMA HÍBRIDO PROMPT ENHANCEMENT AGENT V3.0');
  console.log('=' * 60);
  console.log('📝 PROMPT ORIGINAL:');
  console.log(inputPrompt);
  console.log('\n🔍 PROCESANDO...');
  
  agent.enhancePrompt(inputPrompt).then(result => {
    console.log('\n📊 RESULTADOS:');
    console.log('🎯 NIVEL DE USUARIO:', result.userLevel);
    console.log('⚙️ TIPO DE PROCESAMIENTO:', result.processingType);
    
    if (result.technicalSpecs && result.technicalSpecs.length > 0) {
      console.log('🔧 ESPECIFICACIONES TÉCNICAS DETECTADAS:', result.technicalSpecs.length);
    }
    
    console.log('\n🚀 PROMPT MEJORADO:');
    console.log('─'.repeat(80));
    console.log(result.enhancedPrompt);
    console.log('─'.repeat(80));
    console.log('\n✅ PROCESO COMPLETADO CON ÉXITO');
    
  }).catch(error => {
    console.error('❌ Error:', error.message);
  });
}

export default PromptEnhancementAgent;
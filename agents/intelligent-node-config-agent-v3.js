/**
 * 🤖 INTELLIGENT NODE CONFIG AGENT V3 - ULTRA CONFIGURACIÓN AVANZADA CON GEMINI
 * ===============================================================================
 * 
 * Agente inteligente que genera configuraciones completas, códigos,
 * textos, prompts y parámetros funcionales según el contexto del 
 * workflow y tipo de nodo específico.
 * 
 * CARACTERÍSTICAS V3 + GEMINI:
 * ✅ Configuraciones contextales inteligentes con IA
 * ✅ Código JavaScript funcional para nodos function
 * ✅ Mensajes y textos personalizados
 * ✅ Parámetros realistas y ejecutables
 * ✅ Validación de configuraciones
 * ✅ Soporte para 50+ tipos de nodos
 * ✅ Análisis de workflows de referencia con Gemini
 * ✅ Contexto mejorado del sistema oficial
 */

// import { GoogleGenerativeAI } from '@google/generative-ai'; // Comentado para evitar errores de importación

export default class IntelligentNodeConfigAgentV3 {
  constructor(modelRouter = null) {
    this.version = "3.0-Gemini";
    this.modelRouter = modelRouter;
    this.gemini = modelRouter ? null : this.initializeGemini();
    this.supportedNodeTypes = this.initializeSupportedNodeTypes();
    this.contextPatterns = this.initializeContextPatterns();
    this.configTemplates = this.initializeConfigTemplates();
    this.referenceWorkflows = []; // Se llenará con workflows de referencia
  }

  /**
   * 🔥 INICIALIZAR GEMINI
   */
  initializeGemini() {
    // Usar el modelRouter del Extension Server en lugar de importar GoogleGenerativeAI directamente
    console.log('⚠️ Usando modelRouter del Extension Server para Gemini');
    return null; // El modelRouter se pasa en el constructor
  }

  /**
   * 🔥 CONFIGURAR WORKFLOWS DE REFERENCIA
   */
  setReferenceWorkflows(workflows) {
    this.referenceWorkflows = workflows || [];
    console.log(`📚 ${this.referenceWorkflows.length} workflows de referencia cargados`);
  }

  /**
   * � GENERAR CONFIGURACIÓN CON GEMINI
   */
  async generateConfigurationWithGemini(node, workflowContext, userPrompt) {
    const model = this.modelRouter || this.gemini;
    if (!model) {
      return null; // Fallback a configuración por defecto
    }

    try {
      const referenceExamples = this.getReferenceExamples(node.type, workflowContext.domain);
      
      const prompt = `Eres un experto en n8n workflows. Genera una configuración específica y funcional para este nodo:

NODO: ${node.name} (${node.type})
CONTEXTO DEL WORKFLOW: ${workflowContext.domain}
PROMPT DEL USUARIO: "${userPrompt}"

EJEMPLOS DE REFERENCIA:
${referenceExamples}

INSTRUCCIONES:
1. Genera parámetros específicos y funcionales para el contexto
2. Si es un nodo function, genera código JavaScript real que procese los datos correctamente
3. Si es un nodo de integración, usa configuraciones realistas
4. Usa nombres de campos y valores coherentes con el contexto
5. La configuración debe ser ejecutable en n8n

Responde SOLO con un JSON válido con la configuración:
{
  "parameters": { ... },
  "credentials": { ... }
}`;

      const result = this.modelRouter 
        ? await this.modelRouter.callModel('gemini-2.0-flash-experimental', prompt, 'generateNodeConfiguration')
        : await model.generateContent(prompt);
      
      const response = this.modelRouter ? result : result.response.text();
      const config = JSON.parse(response.replace(/```json|```/g, '').trim());
      
      return config;
    } catch (error) {
      console.log(`⚠️ Error Gemini para ${node.name}:`, error.message);
      return null;
    }
  }

  /**
   * 🔥 OBTENER EJEMPLOS DE REFERENCIA
   */
  getReferenceExamples(nodeType, domain) {
    if (!this.referenceWorkflows?.length) return "Sin ejemplos de referencia disponibles.";
    
    let examples = [];
    for (const workflow of this.referenceWorkflows.slice(0, 3)) {
      const nodes = workflow.nodes?.filter(n => n.type === nodeType) || [];
      for (const node of nodes.slice(0, 2)) {
        if (node.parameters) {
          examples.push(`Ejemplo de ${nodeType}:\n${JSON.stringify(node.parameters, null, 2)}`);
        }
      }
    }
    
    return examples.length ? examples.join('\n\n') : "Sin ejemplos específicos para este tipo de nodo.";
  }

  /**
   * �🚀 CONFIGURAR NODOS CON INTELIGENCIA CONTEXTUAL + GEMINI
   */
  async configureWorkflowNodes(workflow, options = {}) {
    console.log('🤖 IntelligentNodeConfigAgentV3 - Configurando nodos...');
    
    if (!workflow?.nodes) {
      console.log('❌ Workflow sin nodos válidos');
      return { success: false, workflow, stats: { configurationsApplied: 0 } };
    }

    const userPrompt = options.originalPrompt || options.userPrompt || "";
    const workflowContext = this.analyzeWorkflowContext(workflow, userPrompt);
    let configurationsApplied = 0;
    let codesGenerated = 0;
    let parametersConfigured = 0;
    let typesFixed = 0;
    let geminiConfigurations = 0;

    for (const node of workflow.nodes) {
      try {
        const oldConfig = JSON.stringify(node.parameters || {});
        const oldType = node.type;
        
        // Corregir tipo de nodo si es incorrecto
        const correctType = this.getCorrectNodeType(node, workflowContext);
        if (correctType && correctType !== node.type) {
          node.type = correctType;
          typesFixed++;
          console.log(`   🔧 ${node.name}: Tipo corregido ${oldType} → ${correctType}`);
        }
        
        // 🔥 INTENTAR CONFIGURACIÓN CON GEMINI PRIMERO
        let configured = false;
        const geminiConfig = await this.generateConfigurationWithGemini(node, workflowContext, userPrompt);
        
        if (geminiConfig?.parameters) {
          node.parameters = { ...node.parameters, ...geminiConfig.parameters };
          if (geminiConfig.credentials) {
            node.credentials = { ...node.credentials, ...geminiConfig.credentials };
          }
          configured = true;
          geminiConfigurations++;
          console.log(`   🤖 ${node.name}: Configuración con Gemini aplicada`);
        } else {
          // Fallback a configuración por defecto
          configured = await this.configureNode(node, workflowContext, workflow);
        }
        
        if (configured) {
          const newConfig = JSON.stringify(node.parameters || {});
          if (newConfig !== oldConfig) {
            configurationsApplied++;
            
            // Contar parámetros configurados
            const paramCount = Object.keys(node.parameters || {}).length;
            parametersConfigured += paramCount;
            
            // Contar si se generó código
            if (node.parameters?.jsCode || node.parameters?.functionCode) {
              codesGenerated++;
            }
            
            console.log(`   ✅ ${node.name}: Configuración aplicada (${paramCount} parámetros)`);
          }
        }
      } catch (error) {
        console.log(`   ⚠️ ${node.name}: Error en configuración: ${error.message}`);
      }
    }

    // Calcular score de configuración
    const configurationScore = Math.min(100, Math.round(
      (configurationsApplied / workflow.nodes.length) * 100
    ));

    // Bonus por configuraciones con Gemini
    const geminiBonus = geminiConfigurations > 0 ? 10 : 0;

    // Añadir metadata de configuración
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.nodeConfiguration = {
      applied: true,
      configurationsApplied,
      timestamp: new Date().toISOString(),
      agent: "IntelligentNodeConfigAgentV3",
      context: workflowContext.type,
      summary: `${configurationsApplied} nodos configurados para ${workflowContext.type}`
    };

    const stats = {
      configurationsApplied,
      configurationScore: Math.min(100, configurationScore + geminiBonus),
      detailedStats: {
        codesGenerated,
        geminiConfigurations,
        parametersConfigured,
        typesFixed,
        templatesApplied: configurationsApplied
      }
    };

    console.log(`✅ Configuración completada: ${configurationsApplied} nodos actualizados`);
    console.log(`📊 Score de configuración: ${configurationScore}/100`);
    
    return { 
      success: true, 
      workflow, 
      stats,
      metadata: {
        context: workflowContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * � OBTENER TIPO CORRECTO DE NODO
   */
  getCorrectNodeType(node, context) {
    const nodeName = node.name.toLowerCase();
    
    // Mapeo de correcciones de tipos
    const typeCorrections = {
      // Triggers
      'webhook_trigger': 'n8n-nodes-base.webhook',
      'email_trigger': 'n8n-nodes-base.emailReadImap', // Corregir: debe ser para recibir, no enviar
      'telegram_trigger': 'n8n-nodes-base.telegramTrigger',
      'cron_trigger': 'n8n-nodes-base.cron',
      'schedule_trigger': 'n8n-nodes-base.cron',
      
      // Processors específicos
      'calculate_pricing': 'n8n-nodes-base.function',
      'hubspot_createupdatelead': 'n8n-nodes-base.hubspot',
      'generate_invoicepdf': 'n8n-nodes-base.httpRequest', // Para APIs de PDF
      'update_googlesheetsInventory': 'n8n-nodes-base.googleSheets',
      'log_postgresorder': 'n8n-nodes-base.postgres',
      'dailyreport_querypostgres': 'n8n-nodes-base.postgres',
      
      // Notificaciones
      'send_emailconfirmation': 'n8n-nodes-base.emailSend',
      'send_telegramconfirmation': 'n8n-nodes-base.telegram',
      'dailyreport_sendemail': 'n8n-nodes-base.emailSend',
      'dailyreport_sendslack': 'n8n-nodes-base.slack'
    };
    
    // Buscar por nombre específico
    const normalizedName = nodeName.replace(/[_\s-]/g, '').toLowerCase();
    if (typeCorrections[normalizedName]) {
      return typeCorrections[normalizedName];
    }
    
    // Correcciones por patrones
    if (nodeName.includes('trigger')) {
      if (nodeName.includes('email')) return 'n8n-nodes-base.emailReadImap';
      if (nodeName.includes('telegram')) return 'n8n-nodes-base.telegramTrigger';
      if (nodeName.includes('webhook')) return 'n8n-nodes-base.webhook';
      if (nodeName.includes('cron') || nodeName.includes('daily')) return 'n8n-nodes-base.cron';
    }
    
    if (nodeName.includes('hubspot')) return 'n8n-nodes-base.hubspot';
    if (nodeName.includes('postgres') || nodeName.includes('database')) return 'n8n-nodes-base.postgres';
    if (nodeName.includes('sheets') || nodeName.includes('inventory')) return 'n8n-nodes-base.googleSheets';
    if (nodeName.includes('pdf') || nodeName.includes('invoice')) return 'n8n-nodes-base.httpRequest';
    if (nodeName.includes('email') && nodeName.includes('send')) return 'n8n-nodes-base.emailSend';
    if (nodeName.includes('slack')) return 'n8n-nodes-base.slack';
    if (nodeName.includes('telegram') && !nodeName.includes('trigger')) return 'n8n-nodes-base.telegram';
    
    return null; // No cambiar si no se encuentra corrección
  }

  /**
   * �🔍 ANALIZAR CONTEXTO DEL WORKFLOW
   */
  analyzeWorkflowContext(workflow, userPrompt) {
    const context = {
      type: 'general',
      domain: 'automation',
      entities: [],
      integrations: [],
      dataFlow: 'simple',
      businessLogic: {}
    };

    // Analizar prompt del usuario
    const prompt = userPrompt.toLowerCase();
    
    // Detectar dominio de negocio
    if (prompt.includes('lead') || prompt.includes('cliente') || prompt.includes('marketing')) {
      context.type = 'lead_management';
      context.domain = 'marketing';
    } else if (prompt.includes('email') || prompt.includes('newsletter')) {
      context.type = 'email_automation';
      context.domain = 'communication';
    } else if (prompt.includes('ecommerce') || prompt.includes('orden') || prompt.includes('producto')) {
      context.type = 'ecommerce';
      context.domain = 'sales';
    } else if (prompt.includes('soporte') || prompt.includes('ticket') || prompt.includes('helpdesk')) {
      context.type = 'support_automation';
      context.domain = 'support';
    } else if (prompt.includes('social') || prompt.includes('redes') || prompt.includes('instagram')) {
      context.type = 'social_media';
      context.domain = 'marketing';
    }

    // Detectar entidades de datos
    const entities = ['email', 'nombre', 'empresa', 'telefono', 'presupuesto', 'mensaje', 'fecha'];
    context.entities = entities.filter(entity => prompt.includes(entity));

    // Detectar integraciones
    const integrations = ['slack', 'mailchimp', 'notion', 'telegram', 'gmail', 'sheets', 'webhooks'];
    context.integrations = integrations.filter(integration => 
      prompt.includes(integration) || 
      workflow.nodes?.some(n => n.type?.includes(integration))
    );

    // Analizar lógica de negocio desde el prompt
    if (prompt.includes('si') && prompt.includes('sino')) {
      context.businessLogic.hasConditionals = true;
    }
    if (prompt.includes('presupuesto') && prompt.includes('$')) {
      context.businessLogic.hasBudgetLogic = true;
    }
    if (prompt.includes('nuevo') && prompt.includes('existente')) {
      context.businessLogic.hasUserSegmentation = true;
    }

    return context;
  }

  /**
   * ⚙️ CONFIGURAR NODO INDIVIDUAL
   */
  async configureNode(node, context, workflow) {
    if (!node.type || !this.supportedNodeTypes[node.type]) {
      return false;
    }

    const nodeConfig = this.supportedNodeTypes[node.type];
    const template = this.getConfigTemplate(node.type, context);
    
    // Generar configuración específica según el tipo
    node.parameters = node.parameters || {};
    
    switch (node.type) {
      case 'n8n-nodes-base.webhook':
        this.configureWebhook(node, context, template);
        break;
      case 'n8n-nodes-base.function':
        await this.configureFunction(node, context, workflow);
        break;
      case 'n8n-nodes-base.slack':
        this.configureSlack(node, context, template);
        break;
      case 'n8n-nodes-base.emailSend':
        this.configureEmail(node, context, template);
        break;
      case 'n8n-nodes-base.mailchimp':
        this.configureMailchimp(node, context, template);
        break;
      case 'n8n-nodes-base.notion':
        this.configureNotion(node, context, template);
        break;
      case 'n8n-nodes-base.telegram':
        this.configureTelegram(node, context, template);
        break;
      case 'n8n-nodes-base.googleSheets':
        this.configureGoogleSheets(node, context, template);
        break;
      case 'n8n-nodes-base.if':
        this.configureIf(node, context, template);
        break;
      case 'n8n-nodes-base.set':
        this.configureSet(node, context, template);
        break;
      case 'n8n-nodes-base.httpRequest':
        this.configureHttpRequest(node, context, template);
        break;
      case 'n8n-nodes-base.schedule':
        this.configureSchedule(node, context, template);
        break;
      
      // 🆕 NODOS ADICIONALES DEL SISTEMA DE VALIDACIÓN V3
      case 'n8n-nodes-base.cron':
        this.configureCron(node, context, template);
        break;
      case 'n8n-nodes-base.gmail':
        this.configureGmail(node, context, template);
        break;
      case 'n8n-nodes-base.discord':
        this.configureDiscord(node, context, template);
        break;
      case 'n8n-nodes-base.twilio':
        this.configureTwilio(node, context, template);
        break;
      case 'n8n-nodes-base.sendgrid':
        this.configureSendgrid(node, context, template);
        break;
      case 'n8n-nodes-base.googleCalendar':
        this.configureGoogleCalendar(node, context, template);
        break;
      case 'n8n-nodes-base.mysql':
      case 'n8n-nodes-base.postgres':
        this.configureDatabase(node, context, template);
        break;
      case 'n8n-nodes-base.mongodb':
        this.configureMongoDB(node, context, template);
        break;
      case 'n8n-nodes-base.openAi':
        this.configureOpenAI(node, context, template);
        break;
      case 'n8n-nodes-base.anthropic':
        this.configureAnthropic(node, context, template);
        break;
      case 'n8n-nodes-base.stripe':
        this.configureStripe(node, context, template);
        break;
      case 'n8n-nodes-base.salesforce':
        this.configureSalesforce(node, context, template);
        break;
      case 'n8n-nodes-base.hubspot':
        this.configureHubspot(node, context, template);
        break;
      case 'n8n-nodes-base.airtable':
        this.configureAirtable(node, context, template);
        break;
      case 'n8n-nodes-base.code':
        this.configureCode(node, context, template);
        break;
      case 'n8n-nodes-base.merge':
        this.configureMerge(node, context, template);
        break;
      case 'n8n-nodes-base.switch':
        this.configureSwitch(node, context, template);
        break;
      case 'n8n-nodes-base.wait':
        this.configureWait(node, context, template);
        break;
      case 'n8n-nodes-base.split':
        this.configureSplit(node, context, template);
        break;
      case 'n8n-nodes-base.executeworkflow':
        this.configureExecuteWorkflow(node, context, template);
        break;

      default:
        this.configureGeneric(node, context, template);
    }

    return true;
  }

  /**
   * 🔗 CONFIGURAR WEBHOOK
   */
  configureWebhook(node, context, template) {
    const paths = {
      'lead_management': 'lead-capture',
      'email_automation': 'email-webhook',
      'ecommerce': 'order-webhook',
      'support_automation': 'support-ticket',
      'social_media': 'social-webhook'
    };

    node.parameters = {
      httpMethod: 'POST',
      path: paths[context.type] || 'webhook',
      responseMode: 'onReceived',
      options: {
        noResponseBody: false,
        rawBody: false
      },
      ...template
    };
  }

  /**
   * 🔧 CONFIGURAR FUNCTION - CÓDIGO JAVASCRIPT INTELIGENTE Y ESPECÍFICO
   */
  async configureFunction(node, context, workflow) {
    const functionCode = this.generateIntelligentCode(node, context, workflow);
    
    node.parameters = {
      functionCode: functionCode,
      jsCode: functionCode,
      mode: "runOnceForAllItems"
    };
  }

  /**
   * 💬 CONFIGURAR SLACK
   */
  configureSlack(node, context, template) {
    const messages = {
      'lead_management': 'Nuevo Lead: {{$json.name}} - {{$json.email}} - Empresa: {{$json.company}} - Presupuesto: ${{$json.budget}}',
      'ecommerce': 'Nueva Orden: {{$json.orderId}} - Cliente: {{$json.customerName}} - Total: ${{$json.total}}',
      'support_automation': 'Nuevo Ticket: #{{$json.ticketId}} - {{$json.subject}} - Prioridad: {{$json.priority}}',
      'email_automation': 'Email procesado: {{$json.subject}} - Destinatario: {{$json.recipient}}',
      'social_media': 'Nueva interacción social: {{$json.platform}} - Usuario: {{$json.username}} - Tipo: {{$json.type}}'
    };

    const channels = {
      'lead_management': '#ventas',
      'ecommerce': '#ordenes',
      'support_automation': '#soporte',
      'email_automation': '#marketing',
      'social_media': '#social-media'
    };

    node.parameters = {
      channel: channels[context.type] || '#general',
      text: messages[context.type] || 'Notificación automática: {{$json.message}}',
      username: 'n8n Bot',
      iconEmoji: ':robot_face:',
      ...template
    };
  }

  /**
   * 📧 CONFIGURAR EMAIL
   */
  configureEmail(node, context, template) {
    const subjects = {
      'lead_management': node.name.includes('Bienvenida') ? 
        '¡Bienvenido! Gracias por tu interés' : 
        'Seguimiento - ¿Podemos ayudarte?',
      'ecommerce': 'Confirmación de tu pedido #{{$json.orderId}}',
      'support_automation': 'Tu ticket #{{$json.ticketId}} ha sido creado',
      'email_automation': 'Newsletter - {{$json.subject}}',
      'social_media': 'Resumen de actividad social'
    };

    const contents = {
      'lead_management': node.name.includes('Bienvenida') ? 
        '<h1>¡Bienvenido {{$json.name}}!</h1><p>Gracias por contactarnos. Uno de nuestros representantes se pondrá en contacto contigo pronto.</p><p>Saludos,<br>El equipo</p>' :
        '<h1>Hola {{$json.name}}</h1><p>Queríamos hacer seguimiento a tu consulta. ¿Hay algo en lo que podamos ayudarte?</p><p>No dudes en contactarnos.</p>',
      'ecommerce': '<h1>¡Gracias por tu compra!</h1><p>Tu pedido #{{$json.orderId}} ha sido confirmado.</p><p>Total: ${{$json.total}}</p>',
      'support_automation': '<h1>Ticket creado</h1><p>Tu ticket #{{$json.ticketId}} ha sido creado exitosamente.</p><p>Te responderemos pronto.</p>',
      'email_automation': '<h1>{{$json.subject}}</h1><div>{{$json.content}}</div>',
      'social_media': '<h1>Resumen de Actividad</h1><p>Revisa tu actividad en redes sociales.</p>'
    };

    node.parameters = {
      subject: subjects[context.type] || 'Notificación automática',
      recipients: {
        to: [
          {
            email: "={{$json.email}}",
            name: "={{$json.name || $json.recipient}}"
          }
        ]
      },
      content: contents[context.type] || '<h1>Notificación</h1><p>{{$json.message}}</p>',
      options: {
        htmlToText: true
      },
      ...template
    };
  }

  /**
   * 📋 CONFIGURAR MAILCHIMP
   */
  configureMailchimp(node, context, template) {
    node.parameters = {
      listId: "YOUR_MAILCHIMP_LIST_ID",
      emailAddress: "={{$json.email}}",
      status: "subscribed",
      mergeFieldsUi: {
        mergeFieldsValues: [
          {
            name: "FNAME",
            value: "={{$json.name || $json.firstName}}"
          },
          {
            name: "LNAME", 
            value: "={{$json.lastName || ''}}"
          },
          {
            name: "COMPANY",
            value: "={{$json.company || $json.organization}}"
          }
        ]
      },
      options: {
        doubleOptin: false,
        updateExisting: true
      },
      ...template
    };
  }

  /**
   * 📝 CONFIGURAR NOTION
   */
  configureNotion(node, context, template) {
    const properties = {
      'lead_management': [
        { propertyId: "Name", name: "Nombre", value: "={{$json.name}}" },
        { propertyId: "Email", name: "Email", value: "={{$json.email}}" },
        { propertyId: "Company", name: "Empresa", value: "={{$json.company}}" },
        { propertyId: "Budget", name: "Presupuesto", value: "={{$json.budget}}" },
        { propertyId: "Status", name: "Estado", value: "Nuevo Lead" },
        { propertyId: "Source", name: "Fuente", value: "={{$json.source || 'Website'}}" }
      ],
      'ecommerce': [
        { propertyId: "OrderId", name: "Pedido", value: "={{$json.orderId}}" },
        { propertyId: "Customer", name: "Cliente", value: "={{$json.customerName}}" },
        { propertyId: "Total", name: "Total", value: "={{$json.total}}" },
        { propertyId: "Status", name: "Estado", value: "Pendiente" }
      ],
      'support_automation': [
        { propertyId: "TicketId", name: "Ticket", value: "={{$json.ticketId}}" },
        { propertyId: "Subject", name: "Asunto", value: "={{$json.subject}}" },
        { propertyId: "Priority", name: "Prioridad", value: "={{$json.priority}}" },
        { propertyId: "Status", name: "Estado", value: "Abierto" }
      ]
    };

    node.parameters = {
      databaseId: "YOUR_NOTION_DATABASE_ID",
      propertiesUi: {
        propertyValues: properties[context.type] || [
          { propertyId: "Name", name: "Nombre", value: "={{$json.name}}" },
          { propertyId: "Description", name: "Descripción", value: "={{$json.description}}" }
        ]
      },
      options: {},
      ...template
    };
  }

  /**
   * 📱 CONFIGURAR TELEGRAM
   */
  configureTelegram(node, context, template) {
    const messages = {
      'lead_management': '🔥 LEAD VIP ALERT!\n\n👤 {{$json.name}}\n📧 {{$json.email}}\n🏢 {{$json.company}}\n💰 Presupuesto: ${{$json.budget}}\n\n⚡ Requiere atención inmediata!',
      'ecommerce': '🛍️ NUEVA ORDEN VIP\n\n📦 Pedido: {{$json.orderId}}\n👤 Cliente: {{$json.customerName}}\n💰 Total: ${{$json.total}}\n\n🚨 Orden de alto valor!',
      'support_automation': '🆘 TICKET CRÍTICO\n\n🎫 #{{$json.ticketId}}\n📝 {{$json.subject}}\n⚠️ Prioridad: {{$json.priority}}\n\n🔥 Requiere atención urgente!'
    };

    node.parameters = {
      chatId: "YOUR_TELEGRAM_CHAT_ID",
      text: messages[context.type] || '🤖 Notificación automática:\n\n{{$json.message}}',
      parseMode: "Markdown",
      options: {
        disableWebPagePreview: true,
        disableNotification: false
      },
      ...template
    };
  }

  /**
   * 📊 CONFIGURAR GOOGLE SHEETS
   */
  configureGoogleSheets(node, context, template) {
    if (context.type === 'ecommerce' && node.name.toLowerCase().includes('inventory')) {
      // Configuración específica para inventario de e-commerce
      node.parameters = {
        operation: 'update',
        spreadsheetId: "YOUR_INVENTORY_SHEET_ID",
        range: "Inventory!A:Z",
        valueInputOption: "USER_ENTERED",
        valueRenderOption: "FORMATTED_VALUE",
        values: `=[
          ["Producto", "SKU", "Stock Anterior", "Vendido", "Stock Actual", "Actualizado"],
          {{$json.products?.map(p => [
            p.title || p.name,
            p.sku || p.id,
            p.inventory_quantity || 0,
            p.quantity || 1,
            (p.inventory_quantity || 0) - (p.quantity || 1),
            new Date().toISOString()
          ]) || [["Sin productos", "", 0, 0, 0, new Date().toISOString()]]}}
        ]`,
        options: {
          insertDataOption: "INSERT_ROWS",
          includeValuesInResponse: false
        },
        ...template
      };
    } else {
      // Configuraciones por contexto
      const columns = {
        'lead_management': ['name', 'email', 'company', 'budget', 'source', 'timestamp', 'status'],
        'ecommerce': ['orderId', 'customerName', 'customerEmail', 'totalAmount', 'currency', 'status', 'source', 'createdAt', 'processedAt'],
        'support_automation': ['ticketId', 'subject', 'priority', 'status', 'timestamp'],
        'email_automation': ['recipient', 'subject', 'status', 'timestamp'],
        'social_media': ['platform', 'username', 'type', 'engagement', 'timestamp']
      };

      const values = columns[context.type] || ['data', 'timestamp'];
      
      if (context.type === 'ecommerce') {
        node.parameters = {
          operation: 'append',
          spreadsheetId: "YOUR_ORDERS_SHEET_ID",
          range: "Orders!A:I",
          valueInputOption: "USER_ENTERED",
          values: `=[[
            "{{$json.orderId}}", 
            "{{$json.customerName}}", 
            "{{$json.customerEmail}}", 
            {{$json.pricing?.total || $json.totalAmount || 0}}, 
            "{{$json.currency || 'USD'}}", 
            "{{$json.status || 'pending'}}", 
            "{{$json.source || 'webhook'}}", 
            "{{$json.createdAt || new Date().toISOString()}}", 
            "{{new Date().toISOString()}}"
          ]]`,
          options: {
            insertDataOption: "INSERT_ROWS",
            includeValuesInResponse: false
          },
          ...template
        };
      } else {
        const valueString = values.map(col => `$json.${col}`).join(', ');
        node.parameters = {
          spreadsheetId: "YOUR_GOOGLE_SHEET_ID",
          range: "Sheet1!A1",
          valueInputOption: "USER_ENTERED",
          includeValuesInResponse: false,
          values: `=[[${valueString}]]`,
          options: {},
          ...template
        };
      }
    }
  }

  /**
   * 🤔 CONFIGURAR IF (CONDICIONAL)
   */
  configureIf(node, context, template) {
    const conditions = {
      'lead_management': {
        budget: {
          value1: "={{$json.budget}}",
          operation: "largerEqual",
          value2: 5000
        },
        email_exists: {
          value1: "={{$json.email}}",
          operation: "isNotEmpty"
        },
        is_new: {
          value1: "={{$json.isNew}}",
          operation: "equal",
          value2: true
        }
      }
    };

    // Detectar tipo de condición por nombre del nodo
    let conditionType = 'default';
    const nodeName = node.name.toLowerCase();
    
    if (nodeName.includes('vip') || nodeName.includes('alto') || nodeName.includes('budget')) {
      conditionType = 'budget';
    } else if (nodeName.includes('email') || nodeName.includes('existe')) {
      conditionType = 'email_exists';
    } else if (nodeName.includes('nuevo') || nodeName.includes('new')) {
      conditionType = 'is_new';
    }

    const contextConditions = conditions[context.type] || conditions['lead_management'];
    const selectedCondition = contextConditions[conditionType] || contextConditions['email_exists'];

    node.parameters = {
      conditions: {
        [selectedCondition.operation.includes('number') ? 'number' : 'string']: [selectedCondition]
      },
      ...template
    };
  }

  /**
   * 🔧 CONFIGURAR SET
   */
  configureSet(node, context, template) {
    if (context.type === 'ecommerce') {
      // Configuraciones específicas para e-commerce
      if (node.name.toLowerCase().includes('extract') && node.name.toLowerCase().includes('url')) {
        node.parameters = {
          values: [
            { name: "invoice_url", value: "={{$json.response?.download_url || $json.url}}" },
            { name: "invoice_id", value: "={{$json.response?.id || 'INV-' + Date.now()}}" },
            { name: "generated_at", value: "={{new Date().toISOString()}}" },
            { name: "order_id", value: "={{$json.orderId}}" },
            { name: "customer_email", value: "={{$json.customerEmail}}" }
          ],
          options: {},
          ...template
        };
      } else {
        node.parameters = {
          values: [
            { name: "order_id", value: "={{$json.orderId || 'ORD-' + Date.now()}}" },
            { name: "total_amount", value: "={{parseFloat($json.totalAmount) || 0}}" },
            { name: "is_high_value", value: "={{($json.totalAmount || 0) >= 500}}" },
            { name: "customer_email_clean", value: "={{($json.customerEmail || $json.email || '').toLowerCase().trim()}}" },
            { name: "currency", value: "={{$json.currency || 'USD'}}" },
            { name: "processed_at", value: "={{new Date().toISOString()}}" }
          ],
          options: {},
          ...template
        };
      }
    } else {
      // Configuraciones por contexto
      const setValues = {
        'lead_management': [
          { name: "clean_email", value: "={{$json.email.toLowerCase().trim()}}" },
          { name: "budget_number", value: "={{parseInt($json.budget) || 0}}" },
          { name: "is_vip", value: "={{($json.budget || 0) >= 5000}}" },
          { name: "timestamp", value: "={{new Date().toISOString()}}" },
          { name: "source", value: "={{$json.source || 'website'}}" }
        ],
        'ecommerce': [
          { name: "order_total", value: "={{parseFloat($json.total) || 0}}" },
          { name: "is_high_value", value: "={{($json.total || 0) >= 1000}}" },
          { name: "customer_email", value: "={{$json.email.toLowerCase().trim()}}" }
        ]
      };

      node.parameters = {
        values: setValues[context.type] || [
          { name: "processed_at", value: "={{new Date().toISOString()}}" },
          { name: "data", value: "={{$json}}" }
        ],
        options: {},
        ...template
      };
    }
  }

  /**
   * 🌐 CONFIGURAR HTTP REQUEST
   */
  configureHttpRequest(node, context, template) {
    if (context.type === 'ecommerce') {
      // Configuraciones específicas para e-commerce
      if (node.name.toLowerCase().includes('pdf') || node.name.toLowerCase().includes('invoice')) {
        node.parameters = {
          method: 'POST',
          url: 'https://api.html-pdf-api.com/v1/generate',
          options: {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_PDF_API_KEY'
            },
            body: '{"html": "<html><head><title>Factura ={{$json.orderId}}</title></head><body><h1>FACTURA</h1><p><strong>Número:</strong> ={{$json.orderId}}</p><p><strong>Fecha:</strong> ={{$json.createdAt}}</p><p><strong>Cliente:</strong> ={{$json.customerName}}</p><p><strong>Email:</strong> ={{$json.customerEmail}}</p><hr><p><strong>Subtotal:</strong> $={{$json.pricing.subtotal}}</p><p><strong>Descuento:</strong> -$={{$json.pricing.discount}}</p><p><strong>Impuestos:</strong> $={{$json.pricing.tax}}</p><h3><strong>Total:</strong> $={{$json.pricing.total}}</h3></body></html>", "options": {"format": "A4", "printBackground": true}}',
            returnFullResponse: true
          },
          ...template
        };
      } else if (node.name.toLowerCase().includes('log') && node.name.toLowerCase().includes('postgres')) {
        node.parameters = {
          method: 'POST',
          url: 'postgresql://user:password@localhost:5432/ecommerce',
          options: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `INSERT INTO orders (order_id, customer_name, total_amount, status, created_at) 
                      VALUES ('{{$json.orderId}}', '{{$json.customerName}}', {{$json.totalAmount}}, 'pending', NOW())`,
              params: []
            }),
            returnFullResponse: false
          },
          ...template
        };
      }
    } else {
      // Configuraciones genéricas
      const endpoints = {
        'lead_management': {
          method: 'POST',
          url: 'https://api.example.com/leads',
          body: {
            name: '={{$json.name}}',
            email: '={{$json.email}}',
            company: '={{$json.company}}',
            budget: '={{$json.budget}}'
          }
        },
        'ecommerce': {
          method: 'POST',
          url: 'https://api.example.com/orders',
          body: {
            orderId: '={{$json.orderId}}',
            total: '={{$json.total}}'
          }
        }
      };

      const config = endpoints[context.type] || endpoints['lead_management'];

      node.parameters = {
        method: config.method,
        url: config.url,
        options: {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config.body),
          returnFullResponse: false
        },
        ...template
      };
    }
  }

  /**
   * ⏰ CONFIGURAR SCHEDULE
   */
  configureSchedule(node, context, template) {
    const schedules = {
      'lead_management': {
        mode: 'every',
        value: 3,
        unit: 'days',
        timeZone: 'UTC'
      },
      'email_automation': {
        mode: 'every',
        value: 1,
        unit: 'week',
        timeZone: 'UTC'
      }
    };

    const config = schedules[context.type] || schedules['lead_management'];

    node.parameters = {
      ...config,
      startAt: "={{new Date(Date.now() + (" + config.value + " * 24 * 60 * 60 * 1000)).toISOString()}}",
      ...template
    };
  }

  /**
   * 💻 GENERAR CÓDIGO JAVASCRIPT INTELIGENTE Y ESPECÍFICO
   */
  generateIntelligentCode(node, context, workflow) {
    const nodeName = node.name.toLowerCase();
    
    // 🎯 E-COMMERCE: Códigos específicos avanzados
    if (context.type === 'ecommerce') {
      
      if (nodeName.includes('hubspot') && nodeName.includes('contact')) {
        return `
// Preparar datos para crear/actualizar contacto en HubSpot  
const hubspotContacts = [];

for (const item of items) {
  const contactData = {
    properties: {
      email: item.json.email,
      firstname: item.json.name?.split(' ')[0] || item.json.firstName || '',
      lastname: item.json.name?.split(' ').slice(1).join(' ') || item.json.lastName || '',
      company: item.json.company || 'E-commerce Cliente',
      phone: item.json.phone || '',
      website: item.json.website || '',
      // Datos específicos del pedido
      last_order_total: item.json.total || item.json.amount || 0,
      last_order_id: item.json.orderId || item.json.id || '',
      last_order_date: new Date().toISOString().split('T')[0],
      lifecyclestage: 'customer',
      lead_source: 'website_order',
      hs_lead_status: 'NEW'
    }
  };
  
  hubspotContacts.push({
    json: contactData,
    pairedItem: { item: items.indexOf(item) }
  });
}

console.log(\`Preparados \${hubspotContacts.length} contactos para HubSpot\`);
return hubspotContacts;`;
      
      } else if (nodeName.includes('hubspot') && nodeName.includes('deal')) {
        return `
// Preparar datos para crear deal en HubSpot
const hubspotDeals = [];

for (const item of items) {
  const dealData = {
    properties: {
      dealname: \`Pedido #\${item.json.orderId || item.json.id || 'AUTO'}\`,
      amount: parseFloat(item.json.total || item.json.amount || 0),
      dealstage: 'closedwon', // Pedido ya completado
      pipeline: 'default',
      closedate: new Date().toISOString().split('T')[0],
      deal_currency_code: item.json.currency || 'USD',
      deal_type: 'newbusiness',
      lead_source: 'website',
      deal_description: \`Pedido generado automáticamente desde e-commerce. Cliente: \${item.json.name || item.json.customerName || 'Cliente'}\`,
      // Información adicional
      order_id: item.json.orderId || item.json.id,
      customer_email: item.json.email,
      order_status: item.json.status || 'completed'
    }
  };
  
  hubspotDeals.push({
    json: dealData,
    pairedItem: { item: items.indexOf(item) }
  });
}

console.log(\`Preparados \${hubspotDeals.length} deals para HubSpot\`);
return hubspotDeals;`;
      
      } else if (nodeName.includes('validar') || nodeName.includes('validate')) {
        return `
// Validación completa de pedidos de e-commerce
const validatedItems = [];
const rejectedItems = [];

for (const item of items) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    score: 100
  };
  
  // Validar email (crítico)
  if (!item.json.email) {
    validation.errors.push('Email es obligatorio');
    validation.isValid = false;
    validation.score -= 30;
  } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(item.json.email)) {
    validation.errors.push('Formato de email inválido');
    validation.isValid = false;
    validation.score -= 25;
  }
  
  // Validar nombre del cliente
  if (!item.json.name && !item.json.customerName && !item.json.firstName) {
    validation.errors.push('Nombre del cliente es obligatorio');
    validation.isValid = false;
    validation.score -= 20;
  }
  
  // Validar monto del pedido
  const total = parseFloat(item.json.total || item.json.amount || 0);
  if (total <= 0) {
    validation.errors.push('El monto del pedido debe ser mayor a 0');
    validation.isValid = false;
    validation.score -= 40;
  } else if (total > 10000) {
    validation.warnings.push('Pedido de alto valor - requiere verificación manual');
    validation.score -= 5;
  }
  
  // Validar ID del pedido
  if (!item.json.orderId && !item.json.id) {
    validation.warnings.push('ID del pedido faltante - se generará automáticamente');
    item.json.orderId = 'AUTO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    validation.score -= 10;
  }
  
  // Añadir resultado de validación al item
  item.json.validation = validation;
  item.json.validatedAt = new Date().toISOString();
  
  if (validation.isValid) {
    validatedItems.push(item);
  } else {
    rejectedItems.push(item);
  }
}

console.log(\`Validación completada: \${validatedItems.length} válidos, \${rejectedItems.length} rechazados\`);
return validatedItems;`;
      }
      
      // Código genérico para e-commerce
      return `
// Procesamiento genérico de e-commerce
for (const item of items) {
  // Normalizar campos comunes
  item.json.orderId = item.json.orderId || item.json.id || 'ORD-' + Date.now();
  item.json.customerName = item.json.customerName || item.json.name || 'Cliente';
  item.json.total = parseFloat(item.json.total || item.json.amount || 0);
  item.json.status = item.json.status || 'pending';
  item.json.processedAt = new Date().toISOString();
}
return items;`;
    }
    
    // 🎯 LEAD MANAGEMENT: Códigos específicos
    if (context.type === 'lead_management') {
      
      if (nodeName.includes('qualify') || nodeName.includes('calificar') || nodeName.includes('score')) {
        return `
// Sistema avanzado de calificación de leads
for (const item of items) {
  let totalScore = 0;
  const scoring = {};
  
  // Scoring por presupuesto (0-40 puntos)
  const budget = parseFloat(item.json.budget || 0);  
  if (budget >= 100000) { totalScore += 40; scoring.budget = 'Premium (100k+)'; }
  else if (budget >= 50000) { totalScore += 35; scoring.budget = 'High (50k-100k)'; }
  else if (budget >= 20000) { totalScore += 25; scoring.budget = 'Medium (20k-50k)'; }
  else if (budget >= 5000) { totalScore += 15; scoring.budget = 'Low (5k-20k)'; }
  else if (budget > 0) { totalScore += 5; scoring.budget = 'Minimal (<5k)'; }
  else { scoring.budget = 'Not specified'; }
  
  // Scoring por empresa (0-25 puntos)
  const company = item.json.company || '';
  if (company.length > 20) { totalScore += 25; scoring.company = 'Large enterprise'; }
  else if (company.length > 10) { totalScore += 20; scoring.company = 'Medium business'; }
  else if (company.length > 0) { totalScore += 10; scoring.company = 'Small business'; }
  else { scoring.company = 'No company info'; }
  
  // Scoring por urgencia (0-20 puntos)
  const urgency = item.json.urgency || item.json.timeline || '';
  if (urgency.includes('immediate')) { totalScore += 20; scoring.urgency = 'Immediate'; }
  else if (urgency.includes('month')) { totalScore += 15; scoring.urgency = 'Within month'; }
  else if (urgency.includes('quarter')) { totalScore += 10; scoring.urgency = 'Within quarter'; }
  else { scoring.urgency = 'No timeline'; }
  
  // Determinar calificación
  let qualification;
  if (totalScore >= 80) qualification = 'Hot';
  else if (totalScore >= 60) qualification = 'Warm';  
  else if (totalScore >= 30) qualification = 'Cool';
  else qualification = 'Cold';
  
  item.json.leadScore = totalScore;
  item.json.qualification = qualification;
  item.json.scoringBreakdown = scoring;
  item.json.scoredAt = new Date().toISOString();
}
return items;`;
      }
      
      // Código genérico para leads
      return `
// Procesamiento genérico de leads
for (const item of items) {
  // Calcular score básico
  let score = 0;
  if (item.json.budget) score += Math.min(40, item.json.budget / 1000);
  if (item.json.company) score += 20;
  if (item.json.urgency === 'high') score += 20;
  
  item.json.leadScore = Math.round(score);
  item.json.priority = score > 60 ? 'high' : score > 30 ? 'medium' : 'low';
  item.json.processedAt = new Date().toISOString();
}
return items;`;
    }
    
    // 🔧 CÓDIGOS GENÉRICOS POR FUNCIÓN
    if (nodeName.includes('transform') || nodeName.includes('format')) {
      return `
// Transformación y formateo de datos
for (const item of items) {
  // Limpiar email
  if (item.json.email) {
    item.json.email = item.json.email.toLowerCase().trim();
    item.json.emailDomain = item.json.email.split('@')[1];
  }
  
  // Procesar nombre
  if (item.json.name) {
    const nameParts = item.json.name.trim().split(' ');
    item.json.firstName = nameParts[0] || '';
    item.json.lastName = nameParts.slice(1).join(' ') || '';
  }
  
  // Formatear teléfono
  if (item.json.phone) {
    item.json.phoneClean = item.json.phone.replace(/\\D/g, '');
  }
  
  item.json.processedAt = new Date().toISOString();
}
return items;`;
    }
    
    // Código por defecto
    return `
// Procesamiento genérico de datos
for (const item of items) {
  item.json.processedAt = new Date().toISOString();
  item.json.processedBy = 'n8n-intelligent-function';
}
return items;`;
  }
      return `
// Simular búsqueda en base de datos
const items = $input.all();

for (const item of items) {
  // Simular consulta a base de datos
  // En implementación real, aquí iría la consulta real
  
  const email = item.json.clean_email || item.json.email;
  
  // Simular respuesta de base de datos
  item.json.exists_in_db = Math.random() > 0.7; // 30% probabilidad de existir
  item.json.last_contact = item.json.exists_in_db ? 
    new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : 
    null;
  
  // Marcar como nuevo o existente
  item.json.is_new_lead = !item.json.exists_in_db;
  
  console.log(\`Lead \${email}: \${item.json.is_new_lead ? 'NUEVO' : 'EXISTENTE'}\`);
}

return items;`;
    }

    // Código para análisis de sentimiento o clasificación
    if (nodeName.includes('analizar') || nodeName.includes('clasificar')) {
      return `
// Análisis y clasificación inteligente
const items = $input.all();

for (const item of items) {
  // Calcular score del lead
  let leadScore = 0;
  
  if (item.json.budget_number) {
    leadScore += Math.min(item.json.budget_number / 1000, 50);
  }
  
  if (item.json.company) {
    leadScore += 20;
  }
  
  if (item.json.email && item.json.email.includes('.com')) {
    leadScore += 10;
  }
  
  item.json.lead_score = Math.round(leadScore);
  
  // Determinar prioridad
  if (leadScore >= 70) {
    item.json.priority = 'alta';
  } else if (leadScore >= 40) {
    item.json.priority = 'media';
  } else {
    item.json.priority = 'baja';
  }
  
  // Análisis de industria simple
  const company = (item.json.company || '').toLowerCase();
  if (company.includes('tech') || company.includes('software')) {
    item.json.industry = 'technology';
  } else if (company.includes('retail') || company.includes('tienda')) {
    item.json.industry = 'retail';
  } else {
    item.json.industry = 'other';
  }
}

return items;`;
    }

    // Código genérico contextual
    const contextCode = {
      'lead_management': `
// Procesamiento de leads
const items = $input.all();

for (const item of items) {
  // Calcular score del lead
  item.json.leadScore = (item.json.budget || 0) * 0.1 + (item.json.company ? 20 : 0);
  
  // Determinar prioridad
  item.json.priority = item.json.leadScore > 50 ? 'high' : 'normal';
  
  // Añadir timestamp
  item.json.processedAt = new Date().toISOString();
}

return items;`,

      'ecommerce': `
// Procesamiento de órdenes
const items = $input.all();

for (const item of items) {
  // Calcular valor total
  item.json.orderValue = parseFloat(item.json.total) || 0;
  
  // Clasificar orden
  item.json.valueCategory = item.json.orderValue > 1000 ? 'high-value' : 'standard';
  
  // Generar número de tracking
  item.json.trackingNumber = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

return items;`,

      'support_automation': `
// Procesamiento de tickets de soporte
const items = $input.all();

for (const item of items) {
  // Analizar prioridad del ticket
  const subject = (item.json.subject || '').toLowerCase();
  
  if (subject.includes('urgent') || subject.includes('critical')) {
    item.json.priority = 'high';
  } else if (subject.includes('important')) {
    item.json.priority = 'medium';
  } else {
    item.json.priority = 'low';
  }
  
  // Generar ID de ticket
  item.json.ticketId = 'TK' + Date.now();
  
  // Estimar tiempo de resolución
  const estimatedHours = item.json.priority === 'high' ? 2 : 
                        item.json.priority === 'medium' ? 8 : 24;
  item.json.estimatedResolution = new Date(Date.now() + estimatedHours * 60 * 60 * 1000).toISOString();
}

return items;`
    };

    return contextCode[context.type] || contextCode['lead_management'];
  }

  /**
   * 🛍️ GENERAR CÓDIGO ESPECÍFICO PARA E-COMMERCE
   */
  generateEcommerceCode(nodeName, context) {
    // Parse de datos desde diferentes canales
    if (nodeName.includes('parse') && nodeName.includes('webhook')) {
      return `
// Parsear datos de webhook de e-commerce
const items = $input.all();

for (const item of items) {
  const data = item.json;
  
  // Extraer información del pedido
  item.json.orderId = data.order_id || data.id || 'ORD-' + Date.now();
  item.json.customerName = data.customer?.name || data.customer_name || data.name;
  item.json.customerEmail = data.customer?.email || data.customer_email || data.email;
  item.json.products = data.line_items || data.products || [];
  item.json.totalAmount = parseFloat(data.total_price || data.total || data.amount || 0);
  item.json.currency = data.currency || 'USD';
  item.json.status = data.status || 'pending';
  
  // Agregar timestamps
  item.json.createdAt = data.created_at || new Date().toISOString();
  item.json.processedAt = new Date().toISOString();
  
  console.log(\`Orden procesada: \${item.json.orderId} - \${item.json.customerName} - $\${item.json.totalAmount}\`);
}

return items;`;
    }

    if (nodeName.includes('parse') && nodeName.includes('email')) {
      return `
// Parsear emails de pedidos
const items = $input.all();

for (const item of items) {
  const emailContent = item.json.text || item.json.body || '';
  
  // Extraer datos del email usando regex
  const orderIdMatch = emailContent.match(/order[\\s#]*([A-Z0-9-]+)/i);
  const totalMatch = emailContent.match(/total[\\s:$]*([0-9,]+\\.?[0-9]*)/i);
  const emailMatch = emailContent.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/);
  
  item.json.orderId = orderIdMatch ? orderIdMatch[1] : 'EMAIL-' + Date.now();
  item.json.totalAmount = totalMatch ? parseFloat(totalMatch[1].replace(',', '')) : 0;
  item.json.customerEmail = emailMatch ? emailMatch[1] : item.json.from;
  item.json.source = 'email';
  item.json.processedAt = new Date().toISOString();
}

return items;`;
    }

    if (nodeName.includes('calculate') && nodeName.includes('pricing')) {
      return `
// Calcular precios y descuentos dinámicamente
const items = $input.all();

for (const item of items) {
  const data = item.json;
  let subtotal = data.totalAmount || 0;
  let discount = 0;
  let tax = 0;
  
  // Aplicar descuentos por volumen
  if (subtotal > 1000) {
    discount = subtotal * 0.10; // 10% descuento para órdenes > $1000
  } else if (subtotal > 500) {
    discount = subtotal * 0.05; // 5% descuento para órdenes > $500
  }
  
  // Calcular impuestos (8.5%)
  tax = (subtotal - discount) * 0.085;
  
  // Calcular total final
  const finalTotal = subtotal - discount + tax;
  
  // Agregar información de pricing
  item.json.pricing = {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(finalTotal * 100) / 100,
    discountPercent: subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0
  };
  
  // Clasificar orden por valor
  item.json.valueCategory = finalTotal > 1000 ? 'high-value' : 'standard';
  
  console.log(\`Pricing calculado - Orden: \${data.orderId}, Total: $\${item.json.pricing.total}\`);
}

return items;`;
    }

    if (nodeName.includes('hubspot')) {
      return `
// Preparar datos para HubSpot CRM
const items = $input.all();

for (const item of items) {
  const data = item.json;
  
  // Preparar propiedades del contacto
  item.json.hubspotContact = {
    email: data.customerEmail,
    firstname: data.customerName?.split(' ')[0] || '',
    lastname: data.customerName?.split(' ').slice(1).join(' ') || '',
    phone: data.customerPhone || '',
    company: data.customerCompany || '',
    lifecyclestage: 'customer',
    hs_lead_status: 'NEW'
  };
  
  // Preparar propiedades del deal
  item.json.hubspotDeal = {
    dealname: \`Orden \${data.orderId} - \${data.customerName}\`,
    amount: data.pricing?.total || data.totalAmount || 0,
    dealstage: 'presentationscheduled',
    pipeline: 'default',
    closedate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 días
    hubspot_owner_id: 'YOUR_OWNER_ID'
  };
  
  // Preparar nota de actividad
  item.json.hubspotNote = {
    hs_note_body: \`Nueva orden de e-commerce procesada:\\n\\nOrden: \${data.orderId}\\nTotal: $\${data.pricing?.total || data.totalAmount}\\nFecha: \${data.createdAt}\\nFuente: \${data.source || 'website'}\`
  };
  
  console.log(\`HubSpot data preparado para: \${data.customerEmail}\`);
}

return items;`;
    }

    if (nodeName.includes('validate') && nodeName.includes('customer')) {
      return `
// Validar datos del cliente
const items = $input.all();

for (const item of items) {
  const data = item.json;
  let validationErrors = [];
  
  // Validar email
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!data.customerEmail || !emailRegex.test(data.customerEmail)) {
    validationErrors.push('Email inválido o faltante');
  }
  
  // Validar nombre
  if (!data.customerName || data.customerName.length < 2) {
    validationErrors.push('Nombre inválido o faltante');
  }
  
  // Validar monto de la orden
  if (!data.totalAmount || data.totalAmount <= 0) {
    validationErrors.push('Monto de orden inválido');
  }
  
  // Validar ID de orden
  if (!data.orderId) {
    validationErrors.push('ID de orden faltante');
  }
  
  // Resultado de validación
  item.json.validation = {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
    errorCount: validationErrors.length,
    validatedAt: new Date().toISOString()
  };
  
  // Agregar flag para routing condicional
  item.json.isValidCustomer = item.json.validation.isValid;
  
  if (!item.json.validation.isValid) {
    console.log(\`Errores de validación para orden \${data.orderId}: \${validationErrors.join(', ')}\`);
  }
}

return items;`;
    }

    if (nodeName.includes('schedule') && nodeName.includes('delivery')) {
      return `
// Programar seguimiento de entrega
const items = $input.all();

for (const item of items) {
  const data = item.json;
  const baseDate = new Date();
  
  // Calcular fechas de seguimiento
  const followUpDates = {
    processing: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // +1 día
    shipped: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 días
    delivery: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 días
    feedback: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000) // +14 días
  };
  
  // Generar tracking number si no existe
  const trackingNumber = data.trackingNumber || 'TRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  
  item.json.deliverySchedule = {
    trackingNumber,
    orderId: data.orderId,
    customerEmail: data.customerEmail,
    followUps: [
      {
        type: 'processing',
        scheduledDate: followUpDates.processing.toISOString(),
        message: 'Tu pedido está siendo procesado'
      },
      {
        type: 'shipped',
        scheduledDate: followUpDates.shipped.toISOString(),
        message: \`Tu pedido ha sido enviado. Tracking: \${trackingNumber}\`
      },
      {
        type: 'delivery',
        scheduledDate: followUpDates.delivery.toISOString(),
        message: 'Tu pedido debería haber llegado. ¿Todo bien?'
      },
      {
        type: 'feedback',
        scheduledDate: followUpDates.feedback.toISOString(),
        message: '¿Cómo fue tu experiencia? ¡Déjanos tu reseña!'
      }
    ]
  };
  
  console.log(\`Seguimiento programado para orden \${data.orderId} con tracking \${trackingNumber}\`);
}

return items;`;
    }

    // Código genérico para e-commerce
    return `
// Procesamiento genérico de e-commerce
const items = $input.all();

for (const item of items) {
  // Asegurar estructura básica de e-commerce
  item.json.orderId = item.json.orderId || 'ORD-' + Date.now();
  item.json.totalAmount = parseFloat(item.json.total || item.json.amount || 0);
  item.json.customerEmail = item.json.customerEmail || item.json.email;
  item.json.status = item.json.status || 'pending';
  item.json.processedAt = new Date().toISOString();
  
  // Clasificar por valor
  item.json.isHighValue = item.json.totalAmount > 500;
  
  console.log(\`Procesado: \${item.json.orderId} - $\${item.json.totalAmount}\`);
}

return items;`;
  }

  // 🆕 MÉTODOS DE CONFIGURACIÓN ADICIONALES V3

  /**
   * ⏰ CONFIGURAR CRON
   */
  configureCron(node, context, template) {
    if (context.type === 'ecommerce') {
      // Configuraciones específicas para e-commerce
      if (node.name.toLowerCase().includes('daily') || node.name.toLowerCase().includes('report')) {
        node.parameters = {
          rule: {
            interval: [{
              field: 'cronExpression',
              expression: '0 8 * * *' // Diario a las 8 AM para reportes
            }]
          },
          ...template
        };
      } else if (node.name.toLowerCase().includes('inventory') || node.name.toLowerCase().includes('stock')) {
        node.parameters = {
          rule: {
            interval: [{
              field: 'cronExpression',
              expression: '0 */4 * * *' // Cada 4 horas para inventario
            }]
          },
          ...template
        };
      } else {
        node.parameters = {
          rule: {
            interval: [{
              field: 'cronExpression',
              expression: '0 */2 * * *' // Cada 2 horas por defecto para e-commerce
            }]
          },
          ...template
        };
      }
    } else {
      // Configuraciones por contexto
      const schedules = {
        'lead_management': '0 9 * * 1-5', // Lunes a viernes a las 9 AM
        'ecommerce': '0 */2 * * *', // Cada 2 horas
        'support_automation': '0 */4 * * *', // Cada 4 horas
        'email_automation': '0 10 * * *', // Diario a las 10 AM
        'social_media': '0 */6 * * *' // Cada 6 horas
      };

      node.parameters = {
        rule: {
          interval: [{
            field: 'cronExpression',
            expression: schedules[context.type] || '0 */1 * * *'
          }]
        },
        ...template
      };
    }
  }

  /**
   * 📧 CONFIGURAR GMAIL
   */
  configureGmail(node, context, template) {
    const subjects = {
      'lead_management': 'Nuevo Lead: {{$json.name}} - {{$json.company}}',
      'ecommerce': 'Confirmación de Orden #{{$json.orderId}}',
      'support_automation': 'Ticket #{{$json.ticketId}} - {{$json.subject}}',
      'email_automation': 'Notificación automatizada',
      'social_media': 'Resumen de actividad social'
    };

    const messages = {
      'lead_management': 'Nuevo lead registrado:\n\nNombre: {{$json.name}}\nEmail: {{$json.email}}\nEmpresa: {{$json.company}}\nPresupuesto: ${{$json.budget}}\n\nFecha: {{$json.timestamp}}',
      'ecommerce': 'Su orden ha sido procesada exitosamente:\n\nOrden: #{{$json.orderId}}\nProductos: {{$json.items}}\nTotal: ${{$json.total}}\n\nGracias por su compra.',
      'support_automation': 'Ticket creado:\n\nID: #{{$json.ticketId}}\nAsunto: {{$json.subject}}\nPrioridad: {{$json.priority}}\nDescripción: {{$json.description}}',
      'email_automation': 'Proceso completado:\n\n{{$json.message}}\n\nTimestamp: {{$json.timestamp}}',
      'social_media': 'Resumen de actividad:\n\nPlataforma: {{$json.platform}}\nInteracciones: {{$json.interactions}}\nNuevos seguidores: {{$json.newFollowers}}'
    };

    node.parameters = {
      operation: 'send',
      resource: 'message',
      to: template.to || '{{$json.email}}',
      subject: subjects[context.type] || 'Notificación automática',
      message: messages[context.type] || '{{$json.message}}',
      options: {
        htmlBody: true
      },
      ...template
    };
  }

  /**
   * 🎮 CONFIGURAR DISCORD
   */
  configureDiscord(node, context, template) {
    const messages = {
      'lead_management': '🎯 **Nuevo Lead**\n👤 **Nombre:** {{$json.name}}\n🏢 **Empresa:** {{$json.company}}\n💰 **Presupuesto:** ${{$json.budget}}',
      'ecommerce': '🛒 **Nueva Orden**\n📦 **ID:** #{{$json.orderId}}\n👤 **Cliente:** {{$json.customerName}}\n💵 **Total:** ${{$json.total}}',
      'support_automation': '🎫 **Nuevo Ticket**\n🆔 **ID:** #{{$json.ticketId}}\n📋 **Asunto:** {{$json.subject}}\n⚡ **Prioridad:** {{$json.priority}}',
      'email_automation': '📨 **Email Procesado**\n📧 **Asunto:** {{$json.subject}}\n👤 **Destinatario:** {{$json.recipient}}',
      'social_media': '📱 **Actividad Social**\n🌐 **Plataforma:** {{$json.platform}}\n👤 **Usuario:** {{$json.username}}\n📊 **Tipo:** {{$json.type}}'
    };

    node.parameters = {
      operation: 'send',
      resource: 'message',
      channelId: template.channelId || '{{$json.channelId}}',
      content: messages[context.type] || '🤖 **Notificación:** {{$json.message}}',
      options: {},
      ...template
    };
  }

  /**
   * 📱 CONFIGURAR TWILIO (SMS)
   */
  configureTwilio(node, context, template) {
    const messages = {
      'lead_management': 'Nuevo lead: {{$json.name}} de {{$json.company}}. Presupuesto: ${{$json.budget}}',
      'ecommerce': 'Orden #{{$json.orderId}} confirmada. Total: ${{$json.total}}. Gracias por su compra!',
      'support_automation': 'Ticket #{{$json.ticketId}} creado. Asunto: {{$json.subject}}. Prioridad: {{$json.priority}}',
      'email_automation': 'Email procesado: {{$json.subject}}',
      'social_media': 'Nueva actividad en {{$json.platform}}: {{$json.type}}'
    };

    node.parameters = {
      operation: 'send',
      resource: 'sms',
      from: template.from || '+1234567890',
      to: template.to || '{{$json.phone}}',
      body: messages[context.type] || '{{$json.message}}',
      ...template
    };
  }

  /**
   * 📧 CONFIGURAR SENDGRID
   */
  configureSendgrid(node, context, template) {
    const subjects = {
      'lead_management': 'Lead Management: {{$json.name}}',
      'ecommerce': 'Order Confirmation: #{{$json.orderId}}',
      'support_automation': 'Support Ticket: #{{$json.ticketId}}',
      'email_automation': 'Automated Notification',
      'social_media': 'Social Media Update'
    };

    node.parameters = {
      operation: 'send',
      resource: 'mail',
      to: template.to || '{{$json.email}}',
      subject: subjects[context.type] || 'Notification',
      text: template.text || '{{$json.message}}',
      fromEmail: template.fromEmail || 'noreply@company.com',
      fromName: template.fromName || 'Automated System',
      ...template
    };
  }

  /**
   * 📅 CONFIGURAR GOOGLE CALENDAR
   */
  configureGoogleCalendar(node, context, template) {
    const summaries = {
      'lead_management': 'Follow-up: {{$json.name}} - {{$json.company}}',
      'ecommerce': 'Order Processing: #{{$json.orderId}}',
      'support_automation': 'Support Meeting: {{$json.subject}}',
      'email_automation': 'Email Campaign Review',
      'social_media': 'Social Media Strategy Meeting'
    };

    const descriptions = {
      'lead_management': 'Follow-up meeting with {{$json.name}} from {{$json.company}}. Budget: ${{$json.budget}}',
      'ecommerce': 'Process order #{{$json.orderId}} for customer {{$json.customerName}}',
      'support_automation': 'Support session for ticket #{{$json.ticketId}}: {{$json.subject}}',
      'email_automation': 'Review email campaign performance and metrics',
      'social_media': 'Plan social media strategy for {{$json.platform}}'
    };

    node.parameters = {
      operation: 'create',
      resource: 'event',
      calendarId: template.calendarId || 'primary',
      summary: summaries[context.type] || '{{$json.title}}',
      description: descriptions[context.type] || '{{$json.description}}',
      start: {
        dateTime: template.startDateTime || '{{$json.startTime}}',
        timeZone: template.timeZone || 'America/New_York'
      },
      end: {
        dateTime: template.endDateTime || '{{$json.endTime}}',
        timeZone: template.timeZone || 'America/New_York'
      },
      ...template
    };
  }

  /**
   * 🗄️ CONFIGURAR DATABASE (MySQL/PostgreSQL)
   */
  configureDatabase(node, context, template) {
    if (context.type === 'ecommerce') {
      // Configuraciones específicas para e-commerce
      if (node.name.toLowerCase().includes('log') && node.name.toLowerCase().includes('order')) {
        node.parameters = {
          operation: 'executeQuery',
          query: `INSERT INTO orders (
            order_id, customer_name, customer_email, total_amount, 
            subtotal, discount, tax, currency, status, products_json, 
            source, created_at, processed_at
          ) VALUES (
            '{{$json.orderId}}', 
            '{{$json.customerName}}', 
            '{{$json.customerEmail}}', 
            {{$json.pricing.total || $json.totalAmount}}, 
            {{$json.pricing.subtotal || $json.totalAmount}}, 
            {{$json.pricing.discount || 0}}, 
            {{$json.pricing.tax || 0}}, 
            '{{$json.currency || "USD"}}', 
            '{{$json.status || "pending"}}', 
            '{{JSON.stringify($json.products || [])}}', 
            '{{$json.source || "webhook"}}', 
            '{{$json.createdAt || new Date().toISOString()}}', 
            '{{new Date().toISOString()}}'
          )`,
          ...template
        };
      } else if (node.name.toLowerCase().includes('query') && node.name.toLowerCase().includes('daily')) {
        node.parameters = {
          operation: 'executeQuery',
          query: `SELECT 
            DATE(created_at) as date,
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as avg_order_value,
            COUNT(CASE WHEN total_amount > 500 THEN 1 END) as high_value_orders,
            STRING_AGG(DISTINCT source, ', ') as sources
          FROM orders 
          WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY DATE(created_at)
          ORDER BY date DESC
          LIMIT 30`,
          ...template
        };
      }
    } else {
      // Configuraciones genéricas por contexto
      const queries = {
        'lead_management': 'INSERT INTO leads (name, email, company, budget, created_at) VALUES ({{$json.name}}, {{$json.email}}, {{$json.company}}, {{$json.budget}}, NOW())',
        'ecommerce': 'INSERT INTO orders (order_id, customer_name, total, status, created_at) VALUES ({{$json.orderId}}, {{$json.customerName}}, {{$json.total}}, \'pending\', NOW())',
        'support_automation': 'INSERT INTO tickets (ticket_id, subject, priority, status, created_at) VALUES ({{$json.ticketId}}, {{$json.subject}}, {{$json.priority}}, \'open\', NOW())',
        'email_automation': 'INSERT INTO email_logs (recipient, subject, status, sent_at) VALUES ({{$json.recipient}}, {{$json.subject}}, \'sent\', NOW())',
        'social_media': 'INSERT INTO social_interactions (platform, username, type, created_at) VALUES ({{$json.platform}}, {{$json.username}}, {{$json.type}}, NOW())'
      };

      node.parameters = {
        operation: 'executeQuery',
        query: queries[context.type] || 'SELECT * FROM table_name LIMIT 10',
        ...template
      };
    }
  }

  /**
   * 🍃 CONFIGURAR MONGODB
   */
  configureMongoDB(node, context, template) {
    const collections = {
      'lead_management': 'leads',
      'ecommerce': 'orders',
      'support_automation': 'tickets',
      'email_automation': 'email_logs',
      'social_media': 'social_interactions'
    };

    node.parameters = {
      operation: 'insert',
      collection: collections[context.type] || 'documents',
      data: template.data || '{{$json}}',
      ...template
    };
  }

  /**
   * 🤖 CONFIGURAR OPENAI
   */
  configureOpenAI(node, context, template) {
    const prompts = {
      'lead_management': 'Analiza este lead y proporciona una puntuación de 1-100 basada en el potencial de conversión. Considera empresa, presupuesto y sector. Lead: {{$json}}',
      'ecommerce': 'Genera una descripción de producto personalizada basada en: {{$json.productInfo}}',
      'support_automation': 'Analiza este ticket de soporte y categorízalo por urgencia y departamento: {{$json.description}}',
      'email_automation': 'Genera un asunto de email atractivo para esta campaña: {{$json.campaignInfo}}',
      'social_media': 'Crea un post para {{$json.platform}} sobre: {{$json.topic}}'
    };

    node.parameters = {
      resource: 'chat',
      operation: 'complete',
      model: 'gpt-4',
      messages: {
        messageType: 'singleMessage',
        message: prompts[context.type] || '{{$json.prompt}}'
      },
      options: {
        temperature: 0.7,
        maxTokens: 1000
      },
      ...template
    };
  }

  /**
   * 🏛️ CONFIGURAR ANTHROPIC (Claude)
   */
  configureAnthropic(node, context, template) {
    const prompts = {
      'lead_management': 'Evalúa este lead y proporciona recomendaciones de seguimiento: {{$json}}',
      'ecommerce': 'Analiza esta orden y sugiere productos complementarios: {{$json}}',
      'support_automation': 'Revisa este ticket y proporciona una respuesta draft: {{$json}}',
      'email_automation': 'Optimiza este email para mejor engagement: {{$json}}',
      'social_media': 'Crea contenido viral para {{$json.platform}}: {{$json.topic}}'
    };

    node.parameters = {
      operation: 'message',
      model: 'claude-3-sonnet-20240229',
      prompt: prompts[context.type] || '{{$json.prompt}}',
      maxTokens: 1000,
      ...template
    };
  }

  /**
   * 💳 CONFIGURAR STRIPE
   */
  configureStripe(node, context, template) {
    node.parameters = {
      operation: 'create',
      resource: 'charge',
      amount: template.amount || '{{$json.amount}}',
      currency: template.currency || 'usd',
      description: template.description || 'Payment for order {{$json.orderId}}',
      source: template.source || '{{$json.stripeToken}}',
      ...template
    };
  }

  /**
   * ☁️ CONFIGURAR SALESFORCE
   */
  configureSalesforce(node, context, template) {
    const objectTypes = {
      'lead_management': 'Lead',
      'ecommerce': 'Opportunity',
      'support_automation': 'Case',
      'email_automation': 'Campaign',
      'social_media': 'Lead'
    };

    node.parameters = {
      operation: 'create',
      resource: objectTypes[context.type] || 'Lead',
      data: template.data || '{{$json}}',
      ...template
    };
  }

  /**
   * 🟠 CONFIGURAR HUBSPOT
   */
  configureHubspot(node, context, template) {
    if (context.type === 'ecommerce') {
      // Configuración específica para e-commerce
      if (node.name.toLowerCase().includes('lead') || node.name.toLowerCase().includes('contact')) {
        node.parameters = {
          resource: 'contact',
          operation: 'createOrUpdate',
          email: '={{$json.customerEmail}}',
          additionalFields: {
            firstname: '={{$json.customerName?.split(" ")[0] || ""}}',
            lastname: '={{$json.customerName?.split(" ").slice(1).join(" ") || ""}}',
            phone: '={{$json.customerPhone || ""}}',
            company: '={{$json.customerCompany || ""}}',
            lifecyclestage: 'customer',
            hs_lead_status: 'NEW'
          },
          ...template
        };
      } else if (node.name.toLowerCase().includes('deal')) {
        node.parameters = {
          resource: 'deal',
          operation: 'create',
          dealName: '=Orden {{$json.orderId}} - {{$json.customerName}}',
          amount: '={{$json.pricing?.total || $json.totalAmount || 0}}',
          additionalFields: {
            dealstage: 'presentationscheduled',
            pipeline: 'default',
            closedate: '={{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}}',
            hubspot_owner_id: 'YOUR_OWNER_ID',
            deal_currency_code: '={{$json.currency || "USD"}}'
          },
          associateWith: {
            contact: '={{$json.customerEmail}}'
          },
          ...template
        };
      }
    } else {
      // Configuración genérica
      const resources = {
        'lead_management': 'contact',
        'ecommerce': 'contact',
        'support_automation': 'ticket',
        'email_automation': 'contact',
        'social_media': 'contact'
      };

      node.parameters = {
        operation: 'create',
        resource: resources[context.type] || 'contact',
        ...template
      };
    }
  }

  /**
   * 📊 CONFIGURAR AIRTABLE
   */
  configureAirtable(node, context, template) {
    const bases = {
      'lead_management': 'Leads Database',
      'ecommerce': 'Orders Tracking',
      'support_automation': 'Support Tickets',
      'email_automation': 'Email Campaigns',
      'social_media': 'Social Media Analytics'
    };

    node.parameters = {
      operation: 'create',
      application: template.application || 'app12345678',
      table: bases[context.type] || 'Main Table',
      data: template.data || '{{$json}}',
      ...template
    };
  }

  /**
   * 💻 CONFIGURAR CODE
   */
  configureCode(node, context, template) {
    const codeTemplates = {
      'lead_management': `// Procesar y validar lead
const leadData = items[0].json;
const score = (leadData.budget || 0) * 0.3 + (leadData.company ? 50 : 0);
return [{ json: { ...leadData, score, qualified: score > 70 } }];`,
      
      'ecommerce': `// Procesar orden y calcular totales
const orderData = items[0].json;
const tax = orderData.subtotal * 0.08;
const total = orderData.subtotal + tax;
return [{ json: { ...orderData, tax, total, processed: true } }];`,
      
      'support_automation': `// Categorizar ticket
const ticket = items[0].json;
const priority = ticket.subject.toLowerCase().includes('urgent') ? 'high' : 'normal';
const category = ticket.description.toLowerCase().includes('bug') ? 'technical' : 'general';
return [{ json: { ...ticket, priority, category, assigned: false } }];`,
      
      'email_automation': `// Procesar datos de email
const emailData = items[0].json;
const timestamp = new Date().toISOString();
return [{ json: { ...emailData, processed_at: timestamp, status: 'ready' } }];`,
      
      'social_media': `// Analizar engagement
const socialData = items[0].json;
const engagementRate = (socialData.likes + socialData.comments) / socialData.views * 100;
return [{ json: { ...socialData, engagementRate, trending: engagementRate > 5 } }];`
    };

    node.parameters = {
      mode: 'runOnceForAllItems',
      jsCode: codeTemplates[context.type] || 'return items.map(item => ({ json: { ...item.json, processed: true } }));',
      ...template
    };
  }

  /**
   * 🔗 CONFIGURAR MERGE
   */
  configureMerge(node, context, template) {
    node.parameters = {
      mode: 'append',
      joinMode: 'waitForAll',
      outputDataFrom: 'all',
      ...template
    };
  }

  /**
   * 🔀 CONFIGURAR SWITCH
   */
  configureSwitch(node, context, template) {
    const switchConfigs = {
      'lead_management': {
        dataPropertyName: 'budget',
        rules: [
          { operation: 'larger', value: 10000, output: 0 },
          { operation: 'larger', value: 5000, output: 1 },
          { operation: 'smaller', value: 5000, output: 2 }
        ]
      },
      'ecommerce': {
        dataPropertyName: 'total',
        rules: [
          { operation: 'larger', value: 1000, output: 0 },
          { operation: 'larger', value: 100, output: 1 },
          { operation: 'smaller', value: 100, output: 2 }
        ]
      },
      'support_automation': {
        dataPropertyName: 'priority',
        rules: [
          { operation: 'equal', value: 'critical', output: 0 },
          { operation: 'equal', value: 'high', output: 1 },
          { operation: 'equal', value: 'medium', output: 2 }
        ]
      }
    };

    const config = switchConfigs[context.type] || {
      dataPropertyName: 'status',
      rules: [{ operation: 'equal', value: 'active', output: 0 }]
    };

    node.parameters = {
      ...config,
      ...template
    };
  }

  /**
   * ⏱️ CONFIGURAR WAIT
   */
  configureWait(node, context, template) {
    const waitTimes = {
      'lead_management': { amount: 5, unit: 'minutes' }, // Esperar antes de follow-up
      'ecommerce': { amount: 30, unit: 'seconds' }, // Esperar confirmación de pago
      'support_automation': { amount: 2, unit: 'minutes' }, // Esperar respuesta automática
      'email_automation': { amount: 1, unit: 'hours' }, // Esperar entre emails
      'social_media': { amount: 15, unit: 'minutes' } // Esperar entre posts
    };

    const config = waitTimes[context.type] || { amount: 1, unit: 'minutes' };

    node.parameters = {
      ...config,
      ...template
    };
  }

  /**
   * ✂️ CONFIGURAR SPLIT
   */
  configureSplit(node, context, template) {
    const splitConfigs = {
      'lead_management': 'leads',
      'ecommerce': 'items',
      'support_automation': 'tickets',
      'email_automation': 'emails',
      'social_media': 'posts'
    };

    node.parameters = {
      fieldToSplitOut: splitConfigs[context.type] || 'data',
      includeEmptyFields: false,
      ...template
    };
  }

  /**
   * 🔄 CONFIGURAR EXECUTE WORKFLOW
   */
  configureExecuteWorkflow(node, context, template) {
    node.parameters = {
      source: 'database',
      workflowId: template.workflowId || '{{$json.workflowId}}',
      waitForExecution: template.waitForExecution || true,
      ...template
    };
  }

  /**
   * 🏗️ CONFIGURAR NODO GENÉRICO
   */
  configureGeneric(node, context, template) {
    // Configuración básica para nodos no específicos
    node.parameters = {
      ...node.parameters,
      ...template
    };
  }

  /**
   * 🎯 OBTENER TEMPLATE DE CONFIGURACIÓN
   */
  getConfigTemplate(nodeType, context) {
    return this.configTemplates[nodeType]?.[context.type] || {};
  }

  /**
   * 🔧 INICIALIZAR TIPOS DE NODOS SOPORTADOS
   */
  initializeSupportedNodeTypes() {
    return {
      'n8n-nodes-base.webhook': { category: 'trigger', complexity: 'simple' },
      'n8n-nodes-base.function': { category: 'transform', complexity: 'complex' },
      'n8n-nodes-base.slack': { category: 'communication', complexity: 'simple' },
      'n8n-nodes-base.emailSend': { category: 'communication', complexity: 'medium' },
      'n8n-nodes-base.mailchimp': { category: 'marketing', complexity: 'medium' },
      'n8n-nodes-base.notion': { category: 'productivity', complexity: 'medium' },
      'n8n-nodes-base.telegram': { category: 'communication', complexity: 'simple' },
      'n8n-nodes-base.googleSheets': { category: 'storage', complexity: 'medium' },
      'n8n-nodes-base.if': { category: 'logic', complexity: 'simple' },
      'n8n-nodes-base.set': { category: 'transform', complexity: 'simple' },
      'n8n-nodes-base.httpRequest': { category: 'integration', complexity: 'medium' },
      'n8n-nodes-base.schedule': { category: 'trigger', complexity: 'simple' },
      'n8n-nodes-base.merge': { category: 'logic', complexity: 'simple' },
      'n8n-nodes-base.noOp': { category: 'utility', complexity: 'simple' }
    };
  }

  /**
   * 🎨 INICIALIZAR PATRONES DE CONTEXTO
   */
  initializeContextPatterns() {
    return {
      lead_management: ['lead', 'cliente', 'prospect', 'marketing', 'ventas'],
      ecommerce: ['order', 'product', 'cart', 'purchase', 'payment'],
      support_automation: ['ticket', 'support', 'help', 'issue', 'problem'],
      email_automation: ['email', 'newsletter', 'campaign', 'subscription'],
      social_media: ['social', 'instagram', 'facebook', 'twitter', 'linkedin']
    };
  }

  /**
   * 📋 INICIALIZAR TEMPLATES DE CONFIGURACIÓN
   */
  initializeConfigTemplates() {
    return {
      'n8n-nodes-base.webhook': {
        lead_management: {
          responseMode: 'onReceived',
          options: { noResponseBody: false }
        }
      },
      'n8n-nodes-base.slack': {
        lead_management: {
          iconEmoji: ':chart_with_upwards_trend:',
          username: 'Lead Bot'
        },
        ecommerce: {
          iconEmoji: ':shopping_cart:',
          username: 'Order Bot'
        }
      }
    };
  }
}
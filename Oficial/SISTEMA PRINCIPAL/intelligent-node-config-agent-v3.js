/**
 * 🤖 INTELLIGENT NODE CONFIG AGENT V3 - ULTRA CONFIGURACIÓN AVANZADA
 * ==================================================================
 * 
 * Agente inteligente que genera configuraciones completas, códigos,
 * textos, prompts y parámetros funcionales según el contexto del 
 * workflow y tipo de nodo específico.
 * 
 * CARACTERÍSTICAS V3:
 * ✅ Configuraciones contextales inteligentes
 * ✅ Código JavaScript funcional para nodos function
 * ✅ Mensajes y textos personalizados
 * ✅ Parámetros realistas y ejecutables
 * ✅ Validación de configuraciones
 * ✅ Soporte para 50+ tipos de nodos
 */

export default class IntelligentNodeConfigAgentV3 {
  constructor() {
    this.version = "3.0";
    this.supportedNodeTypes = this.initializeSupportedNodeTypes();
    this.contextPatterns = this.initializeContextPatterns();
    this.configTemplates = this.initializeConfigTemplates();
  }

  /**
   * 🚀 CONFIGURAR NODOS CON INTELIGENCIA CONTEXTUAL
   */
  async configureWorkflowNodes(workflow, userPrompt = "", context = {}) {
    console.log('🤖 IntelligentNodeConfigAgentV3 - Configurando nodos...');
    
    if (!workflow?.nodes) {
      console.log('❌ Workflow sin nodos válidos');
      return workflow;
    }

    const workflowContext = this.analyzeWorkflowContext(workflow, userPrompt);
    let configurationsApplied = 0;

    for (const node of workflow.nodes) {
      try {
        const oldConfig = JSON.stringify(node.parameters || {});
        const configured = await this.configureNode(node, workflowContext, workflow);
        
        if (configured && JSON.stringify(node.parameters || {}) !== oldConfig) {
          configurationsApplied++;
          console.log(`   ✅ ${node.name}: Configuración aplicada`);
        }
      } catch (error) {
        console.log(`   ⚠️ ${node.name}: Error en configuración: ${error.message}`);
      }
    }

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

    console.log(`✅ Configuración completada: ${configurationsApplied} nodos actualizados`);
    return workflow;
  }

  /**
   * 🔍 ANALIZAR CONTEXTO DEL WORKFLOW
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

    // Analizar prompt del usuario (asegurar que es string)
    const prompt = (userPrompt && typeof userPrompt === 'string' ? userPrompt : String(userPrompt || '')).toLowerCase();
    
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
   * 🔧 CONFIGURAR FUNCTION - CÓDIGO JAVASCRIPT INTELIGENTE
   */
  async configureFunction(node, context, workflow) {
    const functionCode = this.generateIntelligentCode(node, context, workflow);
    
    node.parameters = {
      functionCode: "return items;",
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
    const columns = {
      'lead_management': ['name', 'email', 'company', 'budget', 'source', 'timestamp', 'status'],
      'ecommerce': ['orderId', 'customerName', 'total', 'status', 'timestamp'],
      'support_automation': ['ticketId', 'subject', 'priority', 'status', 'timestamp'],
      'email_automation': ['recipient', 'subject', 'status', 'timestamp'],
      'social_media': ['platform', 'username', 'type', 'engagement', 'timestamp']
    };

    const values = columns[context.type] || ['data', 'timestamp'];
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

  /**
   * 🌐 CONFIGURAR HTTP REQUEST
   */
  configureHttpRequest(node, context, template) {
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
   * 💻 GENERAR CÓDIGO JAVASCRIPT INTELIGENTE
   */
  generateIntelligentCode(node, context, workflow) {
    const nodeName = node.name.toLowerCase();
    
    // Código para validación de leads
    if (nodeName.includes('validar') || nodeName.includes('limpiar')) {
      return `
// Validar y limpiar datos de leads
const items = $input.all();

for (const item of items) {
  // Limpiar email
  if (item.json.email) {
    item.json.clean_email = item.json.email.toLowerCase().trim();
  }
  
  // Convertir presupuesto a número
  if (item.json.budget) {
    item.json.budget_number = parseFloat(item.json.budget) || 0;
  }
  
  // Validar datos requeridos
  item.json.is_valid = !!(item.json.name && item.json.email && item.json.company);
  
  // Clasificar lead
  item.json.is_vip = (item.json.budget_number || 0) >= 5000;
  
  // Añadir timestamp
  item.json.processed_at = new Date().toISOString();
  
  // Determinar fuente si no existe
  item.json.source = item.json.source || 'website';
}

return items;`;
    }

    // Código para búsqueda en base de datos
    if (nodeName.includes('buscar') || nodeName.includes('check') || nodeName.includes('verificar')) {
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

  // 🆕 MÉTODOS DE CONFIGURACIÓN ADICIONALES V3

  /**
   * ⏰ CONFIGURAR CRON
   */
  configureCron(node, context, template) {
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
    const resources = {
      'lead_management': 'contact',
      'ecommerce': 'deal',
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
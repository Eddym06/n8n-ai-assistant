class IntelligentNodeConfigAgentV3 {
  constructor(modelRouter = null) {
    this.modelRouter = modelRouter;
    this.gemini = modelRouter?.gemini || null;
    this.referenceWorkflows = [];
    
    this.supportedNodeTypes = {
      'n8n-nodes-base.webhook': { category: 'trigger', priority: 1 },
      'n8n-nodes-base.function': { category: 'processor', priority: 2 },
      'n8n-nodes-base.if': { category: 'logic', priority: 2 },
      'n8n-nodes-base.emailSend': { category: 'action', priority: 3 },
      'n8n-nodes-base.hubspot': { category: 'integration', priority: 3 },
      'n8n-nodes-base.slack': { category: 'notification', priority: 3 },
      'n8n-nodes-base.set': { category: 'processor', priority: 2 },
      'n8n-nodes-base.httpRequest': { category: 'integration', priority: 3 }
    };
  }

  /**
   * 🎯 CONFIGURAR WORKFLOW CON MEJORAS ESPECÍFICAS
   */
  async configureWorkflow(workflow, userPrompt = '', context = {}) {
    console.log(`🤖 IntelligentNodeConfigAgentV3 - Configurando nodos...`);
    
    if (!workflow?.nodes || !Array.isArray(workflow.nodes)) {
      return { success: false, error: 'Invalid workflow structure' };
    }

    const workflowContext = this.analyzeContext(workflow, userPrompt);
    let configurationsApplied = 0;
    let geminiConfigurations = 0;
    let codesGenerated = 0;
    let parametersConfigured = 0;

    // Configurar cada nodo
    for (const node of workflow.nodes) {
      try {
        const oldConfig = JSON.stringify(node.parameters || {});
        let configured = false;

        // Intentar configuración con Gemini primero
        if (this.gemini) {
          const geminiConfig = await this.generateConfigurationWithGemini(node, workflowContext, userPrompt);
          
          if (geminiConfig?.parameters) {
            node.parameters = { ...node.parameters, ...geminiConfig.parameters };
            if (geminiConfig.credentials) {
              node.credentials = { ...node.credentials, ...geminiConfig.credentials };
            }
            configured = true;
            geminiConfigurations++;
            console.log(`   🤖 ${node.name}: Configuración con Gemini aplicada`);
          }
        }

        // Fallback a configuración específica
        if (!configured) {
          configured = await this.configureNode(node, workflowContext, workflow);
        }

        if (configured) {
          const newConfig = JSON.stringify(node.parameters || {});
          if (newConfig !== oldConfig) {
            configurationsApplied++;
            
            const paramCount = Object.keys(node.parameters || {}).length;
            parametersConfigured += paramCount;
            
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

    // Añadir metadata
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.nodeConfiguration = {
      applied: true,
      configurationsApplied,
      timestamp: new Date().toISOString(),
      agent: "IntelligentNodeConfigAgentV3",
      context: workflowContext.type,
      summary: `${configurationsApplied} nodos configurados para ${workflowContext.type}`
    };

    const configurationScore = Math.min(100, Math.round((configurationsApplied / workflow.nodes.length) * 100));
    const geminiBonus = geminiConfigurations > 0 ? 10 : 0;

    const stats = {
      configurationsApplied,
      configurationScore: Math.min(100, configurationScore + geminiBonus),
      detailedStats: {
        codesGenerated,
        geminiConfigurations,
        parametersConfigured,
        templatesApplied: configurationsApplied
      }
    };

    console.log(`✅ Configuración completada: ${configurationsApplied} nodos actualizados`);
    
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
   * 🧠 ANÁLISIS DE CONTEXTO DEL WORKFLOW
   */
  analyzeContext(workflow, userPrompt) {
    const context = {
      type: 'general',
      domain: 'automation',
      integrations: [],
      entities: [],
      businessLogic: {
        hasConditionals: false,
        hasBudgetLogic: false,
        hasUserSegmentation: false
      }
    };

    const prompt = userPrompt.toLowerCase();
    
    // Detectar tipo de workflow
    if (prompt.includes('ecommerce') || prompt.includes('pedido') || prompt.includes('orden')) {
      context.type = 'ecommerce';
      context.domain = 'sales';
    } else if (prompt.includes('lead') || prompt.includes('cliente') || prompt.includes('marketing')) {
      context.type = 'lead_management';
      context.domain = 'marketing';
    } else if (prompt.includes('email') || prompt.includes('newsletter')) {
      context.type = 'email_automation';
      context.domain = 'communication';
    }

    // Detectar integraciones
    if (prompt.includes('hubspot')) context.integrations.push('hubspot');
    if (prompt.includes('slack')) context.integrations.push('slack');
    if (prompt.includes('email')) context.integrations.push('email');
    if (prompt.includes('webhook')) context.integrations.push('webhook');

    return context;
  }

  /**
   * ⚙️ CONFIGURAR NODO INDIVIDUAL
   */
  async configureNode(node, context, workflow) {
    if (!node.type || !this.supportedNodeTypes[node.type]) {
      return false;
    }

    node.parameters = node.parameters || {};
    
    switch (node.type) {
      case 'n8n-nodes-base.webhook':
        this.configureWebhook(node, context);
        break;
      case 'n8n-nodes-base.function':
        await this.configureFunction(node, context, workflow);
        break;
      case 'n8n-nodes-base.if':
        this.configureIf(node, context);
        break;
      case 'n8n-nodes-base.emailSend':
        this.configureEmail(node, context);
        break;
      case 'n8n-nodes-base.hubspot':
        this.configureHubspot(node, context);
        break;
      case 'n8n-nodes-base.slack':
        this.configureSlack(node, context);
        break;
      default:
        // Configuración básica
        return false;
    }
    
    return true;
  }

  /**
   * 🔗 CONFIGURAR WEBHOOK
   */
  configureWebhook(node, context) {
    const paths = {
      'ecommerce': 'order-webhook',
      'lead_management': 'lead-capture', 
      'email_automation': 'email-webhook'
    };

    node.parameters = {
      httpMethod: 'POST',
      path: paths[context.type] || 'webhook',
      responseMode: 'onReceived',
      options: {
        noResponseBody: false
      }
    };
  }

  /**
   * 🔧 CONFIGURAR FUNCTION CON CÓDIGO ESPECÍFICO
   */
  async configureFunction(node, context, workflow) {
    const nodeName = node.name.toLowerCase();
    let functionCode = "return items;";
    
    // E-COMMERCE: Códigos específicos
    if (context.type === 'ecommerce') {
      
      if (nodeName.includes('hubspot') && nodeName.includes('contact')) {
        functionCode = `
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
      // Datos específicos del pedido
      last_order_total: item.json.total || item.json.amount || 0,
      last_order_id: item.json.orderId || item.json.id || '',
      last_order_date: new Date().toISOString().split('T')[0],
      lifecyclestage: 'customer',
      lead_source: 'website_order'
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
        functionCode = `
// Preparar datos para crear deal en HubSpot
const hubspotDeals = [];

for (const item of items) {
  const dealData = {
    properties: {
      dealname: \`Pedido #\${item.json.orderId || item.json.id || 'AUTO'}\`,
      amount: parseFloat(item.json.total || item.json.amount || 0),
      dealstage: 'closedwon',
      pipeline: 'default',
      closedate: new Date().toISOString().split('T')[0],
      deal_currency_code: item.json.currency || 'USD',
      deal_type: 'newbusiness',
      lead_source: 'website',
      deal_description: \`Pedido generado automáticamente. Cliente: \${item.json.name || 'Cliente'}\`
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
        functionCode = `
// Validación completa de pedidos de e-commerce
const validatedItems = [];

for (const item of items) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Validar email
  if (!item.json.email) {
    validation.errors.push('Email es obligatorio');
    validation.isValid = false;
  } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(item.json.email)) {
    validation.errors.push('Formato de email inválido');
    validation.isValid = false;
  }
  
  // Validar nombre
  if (!item.json.name && !item.json.customerName) {
    validation.errors.push('Nombre del cliente es obligatorio');
    validation.isValid = false;
  }
  
  // Validar monto
  const total = parseFloat(item.json.total || item.json.amount || 0);
  if (total <= 0) {
    validation.errors.push('El monto del pedido debe ser mayor a 0');
    validation.isValid = false;
  } else if (total > 10000) {
    validation.warnings.push('Pedido de alto valor - requiere verificación');
  }
  
  item.json.validation = validation;
  item.json.validatedAt = new Date().toISOString();
  
  if (validation.isValid) {
    validatedItems.push(item);
  }
}

console.log(\`Validación completada: \${validatedItems.length} válidos\`);
return validatedItems;`;
      } else {
        // Código genérico para e-commerce
        functionCode = `
// Procesamiento de datos de e-commerce
for (const item of items) {
  // Normalizar campos
  item.json.orderId = item.json.orderId || item.json.id || 'ORD-' + Date.now();
  item.json.customerName = item.json.customerName || item.json.name || 'Cliente';
  item.json.total = parseFloat(item.json.total || item.json.amount || 0);
  item.json.processedAt = new Date().toISOString();
}
return items;`;
      }
    }

    // LEAD MANAGEMENT: Códigos específicos
    else if (context.type === 'lead_management') {
      
      if (nodeName.includes('qualify') || nodeName.includes('calificar')) {
        functionCode = `
// Sistema de calificación de leads
for (const item of items) {
  let score = 0;
  const scoring = {};
  
  // Scoring por presupuesto
  const budget = parseFloat(item.json.budget || 0);
  if (budget >= 100000) { score += 40; scoring.budget = 'Premium (100k+)'; }
  else if (budget >= 50000) { score += 35; scoring.budget = 'High (50k-100k)'; }
  else if (budget >= 20000) { score += 25; scoring.budget = 'Medium (20k-50k)'; }
  else if (budget >= 5000) { score += 15; scoring.budget = 'Low (5k-20k)'; }
  else if (budget > 0) { score += 5; scoring.budget = 'Minimal (<5k)'; }
  
  // Scoring por empresa
  const company = item.json.company || '';
  if (company.length > 20) { score += 25; scoring.company = 'Large'; }
  else if (company.length > 10) { score += 20; scoring.company = 'Medium'; }
  else if (company.length > 0) { score += 10; scoring.company = 'Small'; }
  
  // Scoring por urgencia
  const urgency = item.json.urgency || '';
  if (urgency.includes('immediate')) { score += 20; scoring.urgency = 'Immediate'; }
  else if (urgency.includes('month')) { score += 15; scoring.urgency = 'Month'; }
  else if (urgency.includes('quarter')) { score += 10; scoring.urgency = 'Quarter'; }
  
  // Determinar calificación
  let qualification;
  if (score >= 80) qualification = 'Hot';
  else if (score >= 60) qualification = 'Warm';  
  else if (score >= 30) qualification = 'Cool';
  else qualification = 'Cold';
  
  item.json.leadScore = score;
  item.json.qualification = qualification;
  item.json.scoringBreakdown = scoring;
  item.json.scoredAt = new Date().toISOString();
}
return items;`;
      } else {
        // Código genérico para leads
        functionCode = `
// Procesamiento de leads
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
    }
    
    // Transformación genérica
    else if (nodeName.includes('transform') || nodeName.includes('format')) {
      functionCode = `
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

    node.parameters = {
      functionCode: functionCode,
      jsCode: functionCode,
      mode: "runOnceForAllItems"
    };
  }

  /**
   * 🔀 CONFIGURAR IF - CONDICIONES INTELIGENTES
   */
  configureIf(node, context) {
    const nodeName = node.name.toLowerCase();
    
    if (context.type === 'ecommerce') {
      
      if (nodeName.includes('validar') || nodeName.includes('validate')) {
        node.parameters = {
          conditions: {
            options: {
              caseSensitive: false,
              leftValue: "",
              typeValidation: "strict"
            },
            conditions: [
              {
                leftValue: "={{ $json.validation?.isValid }}",
                rightValue: true,
                operator: {
                  type: "boolean",
                  operation: "equal"
                }
              }
            ],
            combinator: "and"
          }
        };
      } else {
        // Condición genérica para e-commerce
        node.parameters = {
          conditions: {
            options: {
              caseSensitive: false,
              leftValue: "",
              typeValidation: "strict"
            },
            conditions: [
              {
                leftValue: "={{ $json.total }}",
                rightValue: 0,
                operator: {
                  type: "number",
                  operation: "gt"
                }
              }
            ],
            combinator: "and"
          }
        };
      }
      
    } else if (context.type === 'lead_management') {
      
      node.parameters = {
        conditions: {
          options: {
            caseSensitive: false,
            leftValue: "",
            typeValidation: "strict"
          },
          conditions: [
            {
              leftValue: "={{ $json.leadScore }}",
              rightValue: 50,
              operator: {
                type: "number",
                operation: "gt"
              }
            }
          ],
          combinator: "and"
        }
      };
      
    } else {
      
      // Condición genérica
      node.parameters = {
        conditions: {
          options: {
            caseSensitive: false,
            leftValue: "",
            typeValidation: "strict"
          },
          conditions: [
            {
              leftValue: "={{ $json.email }}",
              rightValue: "",
              operator: {
                type: "string",
                operation: "notEmpty"
              }
            }
          ],
          combinator: "and"
        }
      };
    }
  }

  /**
   * 📧 CONFIGURAR EMAIL
   */
  configureEmail(node, context) {
    const subjects = {
      'ecommerce': 'Confirmación de tu pedido #{{$json.orderId}}',
      'lead_management': 'Gracias por tu interés - {{$json.name}}',
      'email_automation': 'Newsletter - {{$json.subject}}'
    };

    const contents = {
      'ecommerce': '<h1>¡Gracias por tu compra!</h1><p>Tu pedido #{{$json.orderId}} ha sido confirmado.</p><p>Total: ${{$json.total}}</p>',
      'lead_management': '<h1>¡Bienvenido {{$json.name}}!</h1><p>Gracias por contactarnos. Uno de nuestros representantes se pondrá en contacto contigo pronto.</p>',
      'email_automation': '<h1>{{$json.subject}}</h1><div>{{$json.content}}</div>'
    };

    node.parameters = {
      subject: subjects[context.type] || 'Notificación automática',
      recipients: {
        to: [
          {
            email: "={{$json.email}}",
            name: "={{$json.name || $json.customerName}}"
          }
        ]
      },
      content: contents[context.type] || '<h1>Notificación</h1><p>{{$json.message}}</p>',
      options: {
        htmlToText: true
      }
    };
  }

  /**
   * 🏢 CONFIGURAR HUBSPOT
   */
  configureHubspot(node, context) {
    const nodeName = node.name.toLowerCase();
    
    if (nodeName.includes('contact')) {
      node.parameters = {
        resource: 'contact',
        operation: 'upsert',
        email: '={{$json.email}}',
        additionalFields: {
          firstname: '={{$json.firstname || $json.firstName}}',
          lastname: '={{$json.lastname || $json.lastName}}',
          company: '={{$json.company}}',
          phone: '={{$json.phone}}',
          lifecyclestage: 'customer'
        }
      };
    } else if (nodeName.includes('deal')) {
      node.parameters = {
        resource: 'deal',
        operation: 'create',
        dealName: '={{$json.dealname}}',
        additionalFields: {
          amount: '={{$json.amount}}',
          dealstage: '={{$json.dealstage}}',
          pipeline: '={{$json.pipeline}}',
          closedate: '={{$json.closedate}}'
        }
      };
    }
  }

  /**
   * 💬 CONFIGURAR SLACK
   */
  configureSlack(node, context) {
    const messages = {
      'ecommerce': 'Nueva Orden: {{$json.orderId}} - Cliente: {{$json.customerName}} - Total: ${{$json.total}}',
      'lead_management': 'Nuevo Lead: {{$json.name}} - {{$json.email}} - Empresa: {{$json.company}} - Presupuesto: ${{$json.budget}}'
    };

    const channels = {
      'ecommerce': '#ordenes',
      'lead_management': '#ventas'
    };

    node.parameters = {
      channel: channels[context.type] || '#general',
      text: messages[context.type] || 'Notificación automática: {{$json.message}}',
      username: 'n8n Bot',
      iconEmoji: ':robot_face:'
    };
  }

  /**
   * 🤖 CONFIGURACIÓN CON GEMINI (Mejorado)
   */
  async generateConfigurationWithGemini(node, context, userPrompt) {
    if (!this.gemini) {
      return null;
    }

    try {
      const referenceExamples = this.getReferenceExamples(node.type, context.type);
      
      const prompt = `
Configura el nodo "${node.name}" de tipo "${node.type}" para un workflow de ${context.type}.

Contexto del usuario: ${userPrompt}

Integraciones detectadas: ${context.integrations.join(', ')}

${referenceExamples}

Genera SOLO un objeto JSON con la configuración de parámetros específicos para este nodo.
No incluyas explicaciones, solo el JSON con la estructura:
{
  "parameters": { ... },
  "credentials": { ... } // solo si es necesario
}`;

      const response = await this.gemini.generateContent(prompt);
      const content = response.response.text();
      
      // Extraer JSON del response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.log(`⚠️ Error generando configuración con Gemini para ${node.name}: ${error.message}`);
    }
    
    return null;
  }

  /**
   * 📚 OBTENER EJEMPLOS DE REFERENCIA
   */
  getReferenceExamples(nodeType, contextType) {
    if (!this.referenceWorkflows || this.referenceWorkflows.length === 0) {
      return 'No hay workflows de referencia disponibles.';
    }

    // Buscar ejemplos similares en los workflows de referencia
    const examples = [];
    
    for (const workflow of this.referenceWorkflows.slice(0, 3)) { // Límite de 3 para no saturar
      if (workflow.nodes) {
        const similarNodes = workflow.nodes.filter(n => 
          n.type === nodeType || 
          n.name.toLowerCase().includes(contextType)
        );
        
        if (similarNodes.length > 0) {
          examples.push(`Ejemplo de ${workflow.name || 'workflow'}:`);
          similarNodes.slice(0, 2).forEach(node => {
            examples.push(`- ${node.name} (${node.type}): ${JSON.stringify(node.parameters || {}, null, 2).substring(0, 300)}...`);
          });
        }
      }
    }
    
    return examples.length > 0 ? examples.join('\n') : 'No se encontraron ejemplos específicos.';
  }


  /**
   * 📝 CONFIGURAR WORKFLOWS DE REFERENCIA
   */
  setReferenceWorkflows(workflows) {
    this.referenceWorkflows = workflows || [];
    console.log(`📚 ${this.referenceWorkflows.length} workflows de referencia configurados para el agente`);
  }
}

export default IntelligentNodeConfigAgentV3;
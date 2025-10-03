/**
 * 🔌 AUTOMATIC MCP INTEGRATION AGENT V1.0
 * =======================================
 * 
 * Agente especializado en detectar automáticamente necesidades MCP (Model Context Protocol)
 * y configurar clientes MCP apropiados con herramientas específicas para workflows AI.
 * 
 * CARACTERÍSTICAS:
 * ✅ Detección automática de necesidades MCP
 * ✅ Configuración automática de clientes MCP
 * ✅ Templates de herramientas MCP especializadas
 * ✅ Integración seamless con workflows LangChain
 * ✅ Configuración de credenciales automática
 */

export default class AutomaticMCPIntegrationAgent {
  constructor() {
    this.version = "1.0";
    this.mcpServerTemplates = this.initializeMCPServerTemplates();
    this.mcpToolTemplates = this.initializeMCPToolTemplates();
    this.mcpIntegrationPatterns = this.initializeMCPIntegrationPatterns();
    
    console.log('🔌 AutomaticMCPIntegrationAgent v1.0 inicializado');
    console.log(`🛠️ Templates de herramientas MCP: ${Object.keys(this.mcpToolTemplates).length}`);
  }

  /**
   * 🆕 TEMPLATES DE SERVIDORES MCP PREDEFINIDOS
   */
  initializeMCPServerTemplates() {
    return {
      // 🗂️ SERVIDOR FILESYSTEM
      filesystem_server: {
        name: "MCP Filesystem Server",
        description: "Acceso seguro a archivos y directorios",
        serverType: "filesystem",
        capabilities: [
          "create_directory",
          "list_directory", 
          "read_file",
          "write_file",
          "search_files",
          "get_file_info"
        ],
        configuration: {
          allowedDirectories: [
            "/workspace",
            "/documents", 
            "/projects"
          ],
          maxFileSize: "50MB",
          allowedExtensions: [".txt", ".md", ".json", ".js", ".py", ".html", ".css"]
        },
        credentials: {
          type: "fileSystemAccess",
          securityLevel: "restricted"
        }
      },

      // 🌐 SERVIDOR WEB BROWSING
      web_browsing_server: {
        name: "MCP Web Browsing Server", 
        description: "Navegación web y extracción de contenido",
        serverType: "web_browsing",
        capabilities: [
          "fetch_webpage",
          "search_web",
          "extract_content",
          "navigate_browser",
          "take_screenshot"
        ],
        configuration: {
          userAgent: "MCP-Agent/1.0",
          timeout: 30000,
          allowedDomains: ["*"],
          respectRobotsTxt: true
        },
        credentials: {
          type: "none",
          rateLimiting: true
        }
      },

      // 🐙 SERVIDOR GITHUB
      github_server: {
        name: "MCP GitHub Server",
        description: "Integración completa con GitHub repositories",
        serverType: "github",
        capabilities: [
          "search_repositories",
          "read_file_content",
          "list_issues",
          "create_issue",
          "search_code",
          "get_repository_info"
        ],
        configuration: {
          apiVersion: "v4",
          baseUrl: "https://api.github.com"
        },
        credentials: {
          type: "githubToken",
          required: true,
          scopes: ["repo", "read:org"]
        }
      },

      // 📧 SERVIDOR EMAIL/SLACK
      communication_server: {
        name: "MCP Communication Server",
        description: "Envío de emails y mensajes Slack",
        serverType: "communication",
        capabilities: [
          "send_email",
          "send_slack_message",
          "schedule_message",
          "get_channel_info",
          "list_team_members"
        ],
        configuration: {
          emailProvider: "smtp",
          slackApiVersion: "v1"
        },
        credentials: {
          type: "multiProvider",
          providers: ["smtpCredentials", "slackToken"]
        }
      },

      // 🔐 SERVIDOR SECURITY
      security_server: {
        name: "MCP Security Server",
        description: "Funciones de seguridad y validación",
        serverType: "security",
        capabilities: [
          "validate_input",
          "sanitize_content",
          "check_permissions",
          "audit_log",
          "encrypt_data"
        ],
        configuration: {
          encryptionLevel: "AES-256",
          auditEnabled: true
        },
        credentials: {
          type: "securityKeys",
          required: true
        }
      }
    };
  }

  /**
   * 🛠️ TEMPLATES DE HERRAMIENTAS MCP
   */
  initializeMCPToolTemplates() {
    return {
      // 📁 HERRAMIENTAS FILESYSTEM
      file_manager: {
        toolType: "filesystem",
        name: "File Manager",
        description: "Gestión completa de archivos y directorios",
        mcpCalls: [
          {
            name: "create_directory",
            description: "Crear directorios",
            parameters: {
              type: "object",
              properties: {
                path: { type: "string", description: "Ruta del directorio a crear" }
              },
              required: ["path"]
            }
          },
          {
            name: "list_directory", 
            description: "Listar contenido de directorio",
            parameters: {
              type: "object",
              properties: {
                path: { type: "string", description: "Ruta del directorio" }
              },
              required: ["path"]
            }
          },
          {
            name: "read_file",
            description: "Leer archivo completo",
            parameters: {
              type: "object",
              properties: {
                path: { type: "string", description: "Ruta del archivo" }
              },
              required: ["path"]
            }
          }
        ]
      },

      // 🌐 HERRAMIENTAS WEB
      web_researcher: {
        toolType: "web_browsing",
        name: "Web Researcher",
        description: "Investigación y extracción de información web",
        mcpCalls: [
          {
            name: "fetch_webpage",
            description: "Obtener contenido de página web",
            parameters: {
              type: "object",
              properties: {
                url: { type: "string", description: "URL a obtener" },
                selector: { type: "string", description: "Selector CSS opcional" }
              },
              required: ["url"]
            }
          },
          {
            name: "search_web",
            description: "Buscar en la web",
            parameters: {
              type: "object", 
              properties: {
                query: { type: "string", description: "Consulta de búsqueda" },
                limit: { type: "number", description: "Límite de resultados" }
              },
              required: ["query"]
            }
          }
        ]
      },

      // 👨‍💼 HERRAMIENTAS BUSINESS
      business_assistant: {
        toolType: "business",
        name: "Business Assistant",
        description: "Herramientas especializadas para asistente CEO",
        mcpCalls: [
          {
            name: "schedule_meeting",
            description: "Programar reuniones",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Título de la reunión" },
                attendees: { type: "array", items: { type: "string" } },
                datetime: { type: "string", description: "Fecha y hora ISO" },
                duration: { type: "number", description: "Duración en minutos" }
              },
              required: ["title", "datetime"]
            }
          },
          {
            name: "send_email",
            description: "Enviar emails profesionales",
            parameters: {
              type: "object",
              properties: {
                to: { type: "array", items: { type: "string" } },
                subject: { type: "string", description: "Asunto del email" },
                body: { type: "string", description: "Cuerpo del mensaje" },
                priority: { type: "string", enum: ["low", "normal", "high"] }
              },
              required: ["to", "subject", "body"]
            }
          },
          {
            name: "create_document",
            description: "Crear documentos empresariales",
            parameters: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["report", "memo", "proposal"] },
                title: { type: "string", description: "Título del documento" },
                content: { type: "string", description: "Contenido del documento" },
                template: { type: "string", description: "Template a usar" }
              },
              required: ["type", "title", "content"]
            }
          }
        ]
      },

      // 📊 HERRAMIENTAS ANALYTICS
      data_analyst: {
        toolType: "analytics",
        name: "Data Analyst",
        description: "Análisis de datos y generación de reportes",
        mcpCalls: [
          {
            name: "analyze_data",
            description: "Analizar conjunto de datos",
            parameters: {
              type: "object",
              properties: {
                data_source: { type: "string", description: "Fuente de datos" },
                analysis_type: { type: "string", enum: ["descriptive", "predictive", "prescriptive"] },
                metrics: { type: "array", items: { type: "string" } }
              },
              required: ["data_source", "analysis_type"]
            }
          },
          {
            name: "generate_report",
            description: "Generar reporte ejecutivo",
            parameters: {
              type: "object",
              properties: {
                data: { type: "object", description: "Datos para el reporte" },
                format: { type: "string", enum: ["pdf", "html", "excel"] },
                template: { type: "string", description: "Template de reporte" }
              },
              required: ["data", "format"]
            }
          }
        ]
      }
    };
  }

  /**
   * 🔍 PATRONES DE INTEGRACIÓN MCP
   */
  initializeMCPIntegrationPatterns() {
    return {
      // 👨‍💼 PATRÓN CEO ASSISTANT
      ceo_assistant: {
        name: "CEO Assistant Pattern",
        description: "Integración MCP para asistente ejecutivo",
        requiredServers: ["filesystem_server", "communication_server", "github_server"],
        requiredTools: ["business_assistant", "file_manager", "web_researcher"],
        mcpNodes: [
          {
            type: "@n8n/n8n-nodes-langchain.mcpClientTool",
            name: "Business Tools",
            configuration: {
              serverType: "business",
              toolSelection: ["schedule_meeting", "send_email", "create_document"]
            }
          },
          {
            type: "@n8n/n8n-nodes-langchain.mcpClientTool", 
            name: "File Management",
            configuration: {
              serverType: "filesystem",
              toolSelection: ["read_file", "write_file", "create_directory"]
            }
          }
        ],
        connections: {
          ai_tool: ["Business Tools", "File Management"]
        }
      },

      // 🛒 PATRÓN E-COMMERCE
      ecommerce_assistant: {
        name: "E-commerce Assistant Pattern",
        description: "Integración MCP para asistente de e-commerce",
        requiredServers: ["web_browsing_server", "communication_server"],
        requiredTools: ["web_researcher", "business_assistant"],
        mcpNodes: [
          {
            type: "@n8n/n8n-nodes-langchain.mcpClientTool",
            name: "Product Research",
            configuration: {
              serverType: "web_browsing", 
              toolSelection: ["fetch_webpage", "search_web"]
            }
          }
        ]
      },

      // 📚 PATRÓN CONTENT MANAGER
      content_manager: {
        name: "Content Manager Pattern",
        description: "Gestión de contenido con MCP",
        requiredServers: ["filesystem_server", "github_server"],
        requiredTools: ["file_manager", "data_analyst"],
        mcpNodes: [
          {
            type: "@n8n/n8n-nodes-langchain.mcpClientTool",
            name: "Content Tools",
            configuration: {
              serverType: "filesystem",
              toolSelection: ["read_file", "write_file", "search_files"]
            }
          }
        ]
      }
    };
  }

  /**
   * 🔍 DETECTAR NECESIDADES MCP EN WORKFLOW
   */
  async detectMCPNeeds(workflow, context = {}) {
    console.log('🔍 Analizando necesidades MCP en workflow...');
    
    const needs = {
      detectedPatterns: [],
      requiredServers: new Set(),
      requiredTools: new Set(),
      mcpNodesNeeded: [],
      confidenceScore: 0
    };

    // 1. Análisis de tipo de agente
    const agentType = this.detectAgentType(workflow, context);
    console.log(`🤖 Tipo de agente detectado: ${agentType}`);

    // 2. Análisis de prompts del sistema
    const promptAnalysis = this.analyzeSystemPrompts(workflow);
    console.log(`📝 Análisis de prompts: ${promptAnalysis.indicators.length} indicadores`);

    // 3. Análisis de nodos existentes
    const nodeAnalysis = this.analyzeExistingNodes(workflow);
    console.log(`🔗 Nodos analizados: ${nodeAnalysis.totalNodes}`);

    // 4. Determinar patrones aplicables
    for (const [patternName, pattern] of Object.entries(this.mcpIntegrationPatterns)) {
      const match = this.evaluatePatternMatch(workflow, pattern, agentType, promptAnalysis);
      
      if (match.score > 0.6) {
        needs.detectedPatterns.push({
          name: patternName,
          pattern: pattern,
          score: match.score,
          reasons: match.reasons
        });

        // Agregar servidores y herramientas requeridas
        pattern.requiredServers?.forEach(server => needs.requiredServers.add(server));
        pattern.requiredTools?.forEach(tool => needs.requiredTools.add(tool));
        needs.mcpNodesNeeded.push(...pattern.mcpNodes);

        console.log(`✅ Patrón ${patternName} coincide (score: ${match.score})`);
      }
    }

    // 5. Calcular score de confianza general
    needs.confidenceScore = needs.detectedPatterns.length > 0 
      ? needs.detectedPatterns.reduce((sum, p) => sum + p.score, 0) / needs.detectedPatterns.length
      : 0;

    needs.requiredServers = Array.from(needs.requiredServers);
    needs.requiredTools = Array.from(needs.requiredTools);

    console.log(`🎯 Análisis completado. Confianza: ${needs.confidenceScore.toFixed(2)}`);
    return needs;
  }

  /**
   * 🤖 DETECTAR TIPO DE AGENTE
   */
  detectAgentType(workflow, context) {
    const indicators = {
      ceo_assistant: 0,
      customer_support: 0,
      content_manager: 0,
      data_analyst: 0,
      ecommerce: 0
    };

    // Análisis por nombres de nodos
    const nodeNames = workflow.nodes?.map(n => n.name?.toLowerCase() || '') || [];
    const allText = nodeNames.join(' ');

    // Indicadores CEO Assistant
    if (/ceo|executive|assistant|business|meeting|email|schedule/.test(allText)) {
      indicators.ceo_assistant += 0.3;
    }

    // Indicadores Customer Support
    if (/support|customer|help|ticket|response|chat/.test(allText)) {
      indicators.customer_support += 0.3;
    }

    // Indicadores Content Manager
    if (/content|document|file|write|create|publish/.test(allText)) {
      indicators.content_manager += 0.3;
    }

    // Análisis de contexto adicional
    if (context.userPrompt) {
      const prompt = context.userPrompt.toLowerCase();
      
      if (/ceo|executive|business|management/.test(prompt)) {
        indicators.ceo_assistant += 0.4;
      }
      if (/support|customer|help/.test(prompt)) {
        indicators.customer_support += 0.4;
      }
    }

    // Retornar tipo con mayor score
    const maxType = Object.entries(indicators)
      .reduce((max, [type, score]) => score > max.score ? {type, score} : max, {type: 'general', score: 0});

    return maxType.score > 0.5 ? maxType.type : 'general';
  }

  /**
   * 📝 ANALIZAR PROMPTS DEL SISTEMA
   */
  analyzeSystemPrompts(workflow) {
    const analysis = {
      indicators: [],
      mcpRelevance: 0,
      detectedCapabilities: []
    };

    // Buscar nodos con prompts de sistema
    const agentNodes = workflow.nodes?.filter(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    ) || [];

    for (const agent of agentNodes) {
      const systemPrompt = agent.parameters?.systemMessage || '';
      
      // Detectar menciones de capacidades MCP
      const mcpKeywords = [
        'file', 'document', 'email', 'web', 'search', 'create', 'schedule',
        'meeting', 'report', 'analysis', 'github', 'repository', 'communication'
      ];

      for (const keyword of mcpKeywords) {
        if (systemPrompt.toLowerCase().includes(keyword)) {
          analysis.indicators.push({
            keyword,
            context: this.extractContext(systemPrompt, keyword),
            relevance: 0.1
          });
          analysis.mcpRelevance += 0.1;
        }
      }
    }

    return analysis;
  }

  /**
   * 🔗 ANALIZAR NODOS EXISTENTES
   */
  analyzeExistingNodes(workflow) {
    return {
      totalNodes: workflow.nodes?.length || 0,
      hasAgent: workflow.nodes?.some(n => n.type?.includes('agent')) || false,
      hasTools: workflow.nodes?.some(n => n.type?.includes('tool')) || false,
      hasMCP: workflow.nodes?.some(n => n.type?.includes('mcpClient')) || false
    };
  }

  /**
   * 🎯 EVALUAR COINCIDENCIA DE PATRÓN
   */
  evaluatePatternMatch(workflow, pattern, agentType, promptAnalysis) {
    let score = 0;
    const reasons = [];

    // Coincidencia de tipo de agente
    if (pattern.name.toLowerCase().includes(agentType)) {
      score += 0.4;
      reasons.push(`Tipo de agente coincide: ${agentType}`);
    }

    // Análisis de prompts
    if (promptAnalysis.mcpRelevance > 0.3) {
      score += 0.3;
      reasons.push('Prompts indican necesidades MCP');
    }

    // Complejidad del workflow
    const nodeCount = workflow.nodes?.length || 0;
    if (nodeCount >= 5) {
      score += 0.2;
      reasons.push('Workflow suficientemente complejo');
    }

    // Presencia de agente AI
    const hasAgent = workflow.nodes?.some(n => n.type?.includes('agent'));
    if (hasAgent) {
      score += 0.1;
      reasons.push('Contiene agente AI');
    }

    return { score: Math.min(score, 1), reasons };
  }

  /**
   * ⚙️ CONFIGURAR INTEGRACIÓN MCP AUTOMÁTICA
   */
  async configureMCPIntegration(workflow, mcpNeeds) {
    console.log('⚙️ Configurando integración MCP automática...');
    
    if (mcpNeeds.confidenceScore < 0.5) {
      console.log('⚠️ Confianza insuficiente para integración automática');
      return workflow;
    }

    // 1. Agregar nodos MCP requeridos
    const addedNodes = await this.addMCPNodes(workflow, mcpNeeds);
    console.log(`➕ Añadidos ${addedNodes.length} nodos MCP`);

    // 2. Configurar conexiones AI
    const connections = await this.configureMCPConnections(workflow, addedNodes);
    console.log(`🔗 Configuradas ${connections.length} conexiones MCP`);

    // 3. Agregar credenciales necesarias
    const credentials = await this.addRequiredCredentials(workflow, mcpNeeds);
    console.log(`🔐 Añadidas ${credentials.length} credenciales`);

    // 4. Actualizar metadata
    workflow._metadata = workflow._metadata || {};
    workflow._metadata.mcpIntegration = {
      applied: true,
      patterns: mcpNeeds.detectedPatterns.map(p => p.name),
      servers: mcpNeeds.requiredServers,
      tools: mcpNeeds.requiredTools,
      confidenceScore: mcpNeeds.confidenceScore,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Integración MCP configurada exitosamente');
    return workflow;
  }

  /**
   * ➕ AGREGAR NODOS MCP
   */
  async addMCPNodes(workflow, mcpNeeds) {
    const addedNodes = [];
    
    for (const mcpNode of mcpNeeds.mcpNodesNeeded) {
      const newNode = {
        id: `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: mcpNode.name,
        type: mcpNode.type,
        typeVersion: 1,
        position: [400, 300 + (addedNodes.length * 180)],
        parameters: {
          ...mcpNode.configuration,
          serverUrl: this.getMCPServerUrl(mcpNode.configuration.serverType),
          authentication: 'predefinedCredentialType',
          nodeCredentialType: this.getMCPCredentialType(mcpNode.configuration.serverType)
        }
      };

      workflow.nodes = workflow.nodes || [];
      workflow.nodes.push(newNode);
      addedNodes.push(newNode);
    }

    return addedNodes;
  }

  /**
   * 🔗 CONFIGURAR CONEXIONES MCP
   */
  async configureMCPConnections(workflow, mcpNodes) {
    const connections = [];
    
    // Encontrar agente principal
    const agentNode = workflow.nodes?.find(node => 
      node.type === '@n8n/n8n-nodes-langchain.agent'
    );

    if (!agentNode || mcpNodes.length === 0) {
      return connections;
    }

    // Conectar herramientas MCP al agente
    workflow.connections = workflow.connections || {};
    
    for (const mcpNode of mcpNodes) {
      // Conexión ai_tool desde MCP al agente
      if (!workflow.connections[mcpNode.name]) {
        workflow.connections[mcpNode.name] = {};
      }
      
      workflow.connections[mcpNode.name].ai_tool = [{
        node: agentNode.name,
        type: 'ai_tool',
        index: 0
      }];

      connections.push({
        from: mcpNode.name,
        to: agentNode.name,
        type: 'ai_tool'
      });
    }

    return connections;
  }

  /**
   * 🔐 AGREGAR CREDENCIALES REQUERIDAS
   */
  async addRequiredCredentials(workflow, mcpNeeds) {
    const credentials = [];
    
    for (const serverType of mcpNeeds.requiredServers) {
      const serverTemplate = this.mcpServerTemplates[serverType];
      if (serverTemplate?.credentials?.required) {
        credentials.push({
          type: serverTemplate.credentials.type,
          name: `${serverType}_credentials`,
          serverType: serverType
        });
      }
    }

    return credentials;
  }

  /**
   * 🌐 OBTENER URL DEL SERVIDOR MCP
   */
  getMCPServerUrl(serverType) {
    const urls = {
      filesystem: 'mcp://localhost:3001/filesystem',
      web_browsing: 'mcp://localhost:3002/web',
      github: 'mcp://localhost:3003/github',
      communication: 'mcp://localhost:3004/comm',
      business: 'mcp://localhost:3005/business'
    };
    
    return urls[serverType] || 'mcp://localhost:3000/default';
  }

  /**
   * 🔐 OBTENER TIPO DE CREDENCIAL MCP
   */
  getMCPCredentialType(serverType) {
    const credentialTypes = {
      filesystem: 'fileSystemAccess',
      web_browsing: 'none',
      github: 'githubToken',
      communication: 'communicationCredentials',
      business: 'businessCredentials'
    };
    
    return credentialTypes[serverType] || 'none';
  }

  /**
   * 📄 EXTRAER CONTEXTO DE TEXTO
   */
  extractContext(text, keyword) {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + keyword.length + 30);
    
    return text.substring(start, end);
  }

  /**
   * 📊 GENERAR REPORTE DE INTEGRACIÓN
   */
  generateIntegrationReport(workflow, mcpNeeds) {
    return {
      summary: {
        patternsDetected: mcpNeeds.detectedPatterns.length,
        serversRequired: mcpNeeds.requiredServers.length,
        toolsRequired: mcpNeeds.requiredTools.length,
        confidenceScore: mcpNeeds.confidenceScore
      },
      details: {
        patterns: mcpNeeds.detectedPatterns,
        servers: mcpNeeds.requiredServers,
        tools: mcpNeeds.requiredTools,
        nodes: mcpNeeds.mcpNodesNeeded
      },
      recommendations: this.generateRecommendations(mcpNeeds)
    };
  }

  /**
   * 💡 GENERAR RECOMENDACIONES
   */
  generateRecommendations(mcpNeeds) {
    const recommendations = [];
    
    if (mcpNeeds.confidenceScore < 0.7) {
      recommendations.push({
        type: 'warning',
        message: 'Considere revisar manualmente la integración MCP'
      });
    }

    if (mcpNeeds.requiredServers.length > 3) {
      recommendations.push({
        type: 'optimization',
        message: 'Workflow complejo. Considere dividir en múltiples agentes especializados'
      });
    }

    return recommendations;
  }
}
/**
 * AGENTE DE CONFIGURACIÓN DE NODOS AVANZADO
 * 
 * Este agente se especializa ÚNICAMENTE en configurar nodos de n8n para que estén
 * listos para usar. Incluye soporte especial para el nodo AI Agent y genera
 * ejemplos prácticos para bases de datos.
 * 
 * Características principales:
 * - Configuración completa de parámetros de nodos
 * - Soporte especializado para AI Agent
 * - Ejemplos de datos para bases de datos
 * - Configuración inteligente basada en contexto
 * - Una sola llamada masiva a Gemini para eficiencia
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

class IntelligentNodeConfigAgent {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY no encontrada en variables de entorno');
        }
        
        // Mapeo COMPLETO de tipos de nodos basado en documentación oficial
        this.nodeTypeConfigs = {
            // === NODOS CORE POPULARES ===
            'n8n-nodes-base.webhook': {
                requiresCredentials: false,
                needsExampleData: false,
                defaultOperation: 'webhook',
                commonParams: ['httpMethod', 'path', 'responseMode', 'authentication', 'options'],
                description: 'Trigger que inicia flujo al recibir HTTP request'
            },
            'n8n-nodes-base.httpRequest': {
                requiresCredentials: true, // Para autenticación API
                needsExampleData: false,
                commonParams: ['url', 'method', 'authentication', 'headers', 'body', 'queryParameters'],
                description: 'Realiza solicitudes HTTP a cualquier API REST'
            },
            'n8n-nodes-base.code': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['mode', 'language', 'jsCode'],
                description: 'Ejecuta código JavaScript o Python para manipular datos'
            },
            'n8n-nodes-base.set': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['mode', 'values', 'keepOnlySet'],
                description: 'Modifica o agrega campos a datos JSON'
            },
            'n8n-nodes-base.schedule': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['rule', 'trigger'],
                description: 'Trigger que ejecuta flujo en intervalos programados'
            },
            'n8n-nodes-base.if': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['conditions'],
                description: 'Rama el flujo basado en condiciones'
            },
            'n8n-nodes-base.switch': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['mode', 'rules', 'fallbackOutput'],
                description: 'Ruta datos a outputs basados en reglas'
            },
            'n8n-nodes-base.merge': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['mode', 'clashHandling'],
                description: 'Combina datos de múltiples entradas'
            },
            'n8n-nodes-base.splitInBatches': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['batchSize', 'options'],
                description: 'Divide datos grandes en lotes para procesamiento eficiente'
            },
            'n8n-nodes-base.aggregate': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['aggregate', 'groupBy'],
                description: 'Agrupa datos (suma, promedio, etc.)'
            },
            'n8n-nodes-base.noOp': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: [],
                description: 'Nodo placeholder para debugging'
            },
            'n8n-nodes-base.executeWorkflow': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['workflowId', 'waitForCompletion'],
                description: 'Llama a otro workflow como subrutina'
            },
            
            // === NODOS DE SERVICIOS POPULARES ===
            'n8n-nodes-base.googleSheets': {
                requiresCredentials: true,
                needsExampleData: false,
                validOperations: ['read', 'append', 'update', 'clear', 'create', 'delete', 'remove', 'appendOrUpdate'],
                defaultOperation: 'read',
                commonParams: ['resource', 'operation', 'documentId', 'sheetName', 'range'],
                description: 'Lee/escribe en hojas de Google Sheets'
            },
            'n8n-nodes-base.slack': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['channel', 'text', 'attachments', 'blocks'],
                description: 'Envía mensajes y archivos a Slack channels'
            },
            'n8n-nodes-base.emailSend': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['fromEmail', 'toEmail', 'subject', 'message', 'attachments'],
                description: 'Envía emails via SMTP'
            },
            'n8n-nodes-base.telegram': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['chatId', 'text', 'additionalFields'],
                description: 'Envía mensajes a Telegram bots'
            },
            'n8n-nodes-base.discord': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['channel', 'content', 'embeds'],
                description: 'Envía mensajes en Discord'
            },
            'n8n-nodes-base.whatsApp': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['to', 'message', 'mediaUrl'],
                description: 'Envía mensajes via WhatsApp API'
            },
            
            // === NODOS DE BASE DE DATOS ===
            'n8n-nodes-base.postgres': {
                defaultOperation: 'executeQuery',
                requiresCredentials: true,
                needsExampleData: true,
                commonParams: ['operation', 'query', 'additionalFields'],
                description: 'Queries a base de datos PostgreSQL'
            },
            'n8n-nodes-base.mysql': {
                defaultOperation: 'executeQuery',
                requiresCredentials: true,
                needsExampleData: true,
                commonParams: ['operation', 'query', 'additionalFields'],
                description: 'Queries a base de datos MySQL'
            },
            
            // === NODOS DE ALMACENAMIENTO ===
            'n8n-nodes-base.googleDrive': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['operation', 'fileId', 'name', 'parents'],
                description: 'Sube/descarga archivos en Google Drive'
            },
            'n8n-nodes-base.airtable': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['operation', 'base', 'table', 'fields'],
                description: 'Interactúa con bases de Airtable'
            },
            
            // === NODOS DE IA ===
            'n8n-nodes-base.openAi': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['resource', 'operation', 'model', 'prompt', 'temperature', 'maxTokens'],
                description: 'Integra con ChatGPT para generaciones de texto'
            },
            'n8n-nodes-base.aiAgent': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['prompt', 'model', 'temperature', 'maxTokens', 'memory'],
                specialConfig: 'AI_AGENT',
                description: 'Agente de IA conversacional avanzado'
            },
            
            // === NODOS DE COMUNICACIÓN ===
            'n8n-nodes-base.twilio': {
                requiresCredentials: true,
                needsExampleData: false,
                commonParams: ['resource', 'operation', 'to', 'from', 'body'],
                description: 'Envía SMS o llamadas via Twilio'
            },
            
            // === NODOS LEGACY (compatibilidad) ===
            'n8n-nodes-base.function': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['jsCode'],
                description: 'Nodo legacy - usar Code Node en su lugar'
            },
            'n8n-nodes-base.functionItem': {
                requiresCredentials: false,
                needsExampleData: false,
                commonParams: ['jsCode'],
                description: 'Nodo legacy - usar Code Node en su lugar'
            }
        };
    }

    /**
     * Configura todos los nodos del workflow con una sola llamada a Gemini
     */
    async configureAllNodes(workflow, originalPrompt) {
        console.log('🤖 Iniciando configuración avanzada de nodos...');
        
        try {
            // Analizar el workflow y preparar el contexto
            const analysisContext = this.analyzeWorkflowContext(workflow, originalPrompt);
            
            // Generar prompt masivo para Gemini
            const configurationPrompt = this.buildMassiveConfigPrompt(workflow, analysisContext);
            
            // Llamada única a Gemini para configurar todos los nodos
            const configurations = await this.callGeminiForMassiveConfig(configurationPrompt);
            
            // Aplicar configuraciones al workflow
            const configuredWorkflow = this.applyConfigurationsToWorkflow(workflow, configurations);
            
            console.log('✅ Configuración de nodos completada exitosamente');
            return configuredWorkflow;
            
        } catch (error) {
            console.error('❌ Error en configuración de nodos:', error);
            throw error;
        }
    }

    /**
     * Analiza el contexto del workflow para entender su propósito
     */
    analyzeWorkflowContext(workflow, originalPrompt) {
        const context = {
            originalPrompt: originalPrompt,
            totalNodes: workflow.nodes.length,
            nodeTypes: {},
            connections: workflow.connections,
            businessDomain: this.inferBusinessDomain(originalPrompt),
            dataFlow: this.analyzeDataFlow(workflow)
        };

        // Contar tipos de nodos
        workflow.nodes.forEach(node => {
            if (!context.nodeTypes[node.type]) {
                context.nodeTypes[node.type] = [];
            }
            context.nodeTypes[node.type].push({
                id: node.id,
                name: node.name,
                position: node.position,
                currentParams: node.parameters || {}
            });
        });

        return context;
    }

    /**
     * Infiere el dominio de negocio basado en el prompt
     */
    inferBusinessDomain(prompt) {
        const domains = {
            'ecommerce': ['tienda', 'producto', 'venta', 'cliente', 'pedido', 'inventory'],
            'crm': ['cliente', 'contacto', 'lead', 'oportunidad', 'seguimiento'],
            'automation': ['automatizar', 'proceso', 'flujo', 'workflow', 'integración'],
            'communication': ['email', 'slack', 'telegram', 'notificación', 'mensaje'],
            'data_processing': ['datos', 'análisis', 'reporte', 'procesamiento', 'transformar'],
            'ai_assistant': ['chatbot', 'asistente', 'ia', 'respuesta', 'conversación']
        };

        const promptLower = prompt.toLowerCase();
        for (const [domain, keywords] of Object.entries(domains)) {
            if (keywords.some(keyword => promptLower.includes(keyword))) {
                return domain;
            }
        }
        return 'general';
    }

    /**
     * Analiza el flujo de datos del workflow
     */
    analyzeDataFlow(workflow) {
        const flow = {
            triggers: [],
            processors: [],
            outputs: [],
            conditionals: []
        };

        workflow.nodes.forEach(node => {
            if (node.type.includes('trigger') || node.type.includes('webhook')) {
                flow.triggers.push(node.id);
            } else if (node.type.includes('if') || node.type.includes('switch')) {
                flow.conditionals.push(node.id);
            } else if (node.type.includes('email') || node.type.includes('slack') || node.type.includes('response')) {
                flow.outputs.push(node.id);
            } else {
                flow.processors.push(node.id);
            }
        });

        return flow;
    }

    /**
     * Construye el prompt masivo para configurar todos los nodos
     */
    buildMassiveConfigPrompt(workflow, context) {
        return `
# CONFIGURACIÓN MASIVA DE NODOS N8N - AGENTE ESPECIALIZADO

## CONTEXTO DEL PROYECTO
**Prompt Original del Usuario:** ${context.originalPrompt}
**Dominio de Negocio:** ${context.businessDomain}
**Total de Nodos:** ${context.totalNodes}

## OBJETIVO
Configura COMPLETAMENTE todos los nodos para que estén listos para usar. El usuario solo debe configurar credenciales.

## ⚠️ ANÁLISIS CONTEXTUAL CRÍTICO:
ANTES de configurar cada nodo, ANALIZA:
1. **Propósito del workflow**: Entiende qué hace el flujo completo
2. **Flujo de datos**: Qué datos vienen del nodo anterior 
3. **Lógica de negocio**: Por qué existe cada nodo en el flujo
4. **Conexiones**: Cómo se conecta con nodos siguientes

### REGLAS DE CONFIGURACIÓN FUNCIONAL:
- **NO configures por configurar**: Cada parámetro debe tener PROPÓSITO
- **Analiza el contexto**: Un IF debe tener condiciones reales del workflow
- **Datos coherentes**: Los campos {{ $json.X }} deben existir en el flujo
- **Lógica empresarial**: Las condiciones deben servir al propósito del workflow

## NODOS A CONFIGURAR:
${workflow.nodes.map(node => `
### NODO: ${node.name} (${node.type})
- ID: ${node.id}
- Posición: ${node.position}
- Parámetros Actuales: ${JSON.stringify(node.parameters || {}, null, 2)}
- Credenciales Actuales: ${JSON.stringify(node.credentials || {}, null, 2)}
`).join('\n')}

## INSTRUCCIONES ESPECÍFICAS POR TIPO DE NODO:

### 1. PARA NODOS TRIGGER (Webhook, Schedule):
- **Webhook**: httpMethod: "POST", path: único y descriptivo, responseMode: "lastNode"
- **Schedule**: rule: objeto con interval (daily, hourly, etc.), definir timezone si necesario
- **Trigger nodes**: Siempre configurar como primer nodo del flujo

### 2. PARA NODOS DE BASE DE DATOS (PostgreSQL, MySQL):
- **Operation**: "executeQuery" como default
- **Query**: SQL REAL y funcional (INSERT, SELECT, UPDATE según contexto)
- **Schema/Database**: nombres descriptivos relacionados al dominio
- **Crear ejemplos de tablas con estructura realista**
- **Incluir bind parameters para seguridad: $1, $2, etc.**
- **Nombres de tablas descriptivos: users, orders, products, etc.**

### 3. PARA NODOS GOOGLE SHEETS:
- **Resource**: siempre "sheet" 
- **Operations válidas**: ['read', 'append', 'update', 'clear', 'create', 'delete', 'remove', 'appendOrUpdate']
- **NUNCA uses 'getAll'** - usa 'read' en su lugar
- **DocumentId**: ID de ejemplo realista (formato: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2up_I)
- **SheetName**: nombres descriptivos ("Data", "Clientes", "Ventas")
- **Range**: apropiado para operación (ej: "A1:Z1000" para read, "A:A" para append)
- **Headers**: primera fila como headers si es necesario

### 4. PARA NODO AI AGENT / OPENAI:
- **Model**: "gpt-4" o "gpt-3.5-turbo" según complejidad
- **Prompt**: específico y detallado para el caso de uso
- **Temperature**: 0.7 para conversacional, 0.3 para preciso, 0.1 para determinístico
- **MaxTokens**: 150-500 para respuestas, 1000-2000 para contenido largo
- **Memory**: incluir context si es conversacional
- **System instructions**: definir rol y comportamiento

### 5. PARA NODOS HTTP REQUEST:
- **URL**: endpoints reales o de prueba funcionales (httpbin.org para testing)
- **Method**: GET, POST, PUT, DELETE según operación
- **Headers**: Content-Type, Authorization si necesario
- **Authentication**: definir tipo (API Key, Bearer Token, Basic Auth)
- **Body**: JSON estructurado para POST/PUT
- **Query Parameters**: en formato name/value si necesario

### 6. PARA NODOS DE COMUNICACIÓN (Slack, Email, Telegram, Discord):
- **Slack**: channel por # o ID, text con formato markdown, blocks para mensajes ricos
- **Email**: fromEmail, toEmail válidos, subject descriptivo, message con HTML opcional
- **Telegram**: chatId numérico, text con markdown, parse_mode: "Markdown"
- **Discord**: channel ID, content, embeds para formato enriquecido
- **Mensajes**: profesionales, con variables de flujo {{ $json.field }}

### 7. PARA NODOS CODE/FUNCTION:
- **Mode**: "runOnceForAllItems" para batch, "runOnceForEachItem" para individual
- **Language**: "javascript" como default
- **JsCode**: funcional y optimizado con comentarios
- **Variables**: usar $input.all(), $json, $node, $workflow
- **Return**: return items; para múltiples items
- **Error handling**: try/catch básico
- **Ejemplos**: manipulación de arrays, transformación de datos

### 8. PARA NODOS DE CONTROL DE FLUJO (IF, Switch, Merge):

#### CONFIGURACIÓN IF - EJEMPLOS FUNCIONALES:
**CONTEXTO: Workflow de leads**
- INCORRECTO: value1: "{{ $json.conditionValue }}" equalTo "true" (genérico, sin propósito)
- CORRECTO: value1: "{{ $json.leadType }}" equalTo "premium" (específico al negocio)
- CORRECTO: value1: "{{ $json.amount }}" largerThan 1000 (umbral de valor)
- CORRECTO: value1: "{{ $json.status }}" equalTo "active" (estado del cliente)

**CONTEXTO: Workflow de órdenes**
- CORRECTO: value1: "{{ $json.orderValue }}" largerThan 500 (órdenes grandes vs pequeñas)
- CORRECTO: value1: "{{ $json.customerType }}" equalTo "vip" (clientes VIP vs normales)

**REGLAS PARA IF:**
- ANALIZA el prompt original para entender la lógica de división
- USA campos que existirían en datos reales del webhook
- CREA condiciones que sirvan al propósito empresarial
- EVITA condiciones genéricas como "conditionValue"

#### CONFIGURACIÓN MERGE - EJEMPLOS FUNCIONALES:
**CONTEXTO: Unir rama de leads premium y básicos**
mode: "append", options: { clashHandling: "preferInput2", mergeMode: "append" }

**CONTEXTO: Combinar datos de API con datos de Google Sheets**
mode: "combine", options: { clashHandling: "preferInput1", mergeMode: "deepMerge" }

- **Switch**: mode "rules", rules con output routing FUNCIONAL basado en casos de uso reales
- **Condiciones**: SIEMPRE usar expresiones {{ $json.field }} que existan en el flujo real

### 9. PARA NODOS DE PROCESAMIENTO (Set, Split, Aggregate):
- **Set**: mode "manual", values con name/value pairs descriptivos
- **Split**: batchSize apropiado (10-100), options para reset
- **Aggregate**: aggregate function (sum, count, avg), groupBy si necesario
- **KeepOnlySet**: true para output limpio en Set node

### 10. PARA NODOS DE SERVICIOS EXTERNOS (Airtable, Google Drive, Twilio):
- **Airtable**: base ID, table name, operation (list/create), fields mapping
- **Google Drive**: operation (upload/download), parents folder, name descriptivo
- **Twilio**: resource "sms", to/from números formato E.164, body del mensaje
- **Credenciales**: siempre definir estructura apropiada

### 11. PARA NODOS ESPECIALIZADOS:
- **Webhook**: authentication opcional pero recomendado, options para configuración avanzada
- **Schedule**: timezone importante para precisión, cron expressions para casos complejos
- **ExecuteWorkflow**: workflowId válido, waitForCompletion según necesidad
- Código JavaScript funcional y optimizado
- Manejo de errores básico
- Comentarios explicativos
- Retorno de datos apropiado

## FORMATO DE RESPUESTA REQUERIDO:
Responde ÚNICAMENTE con un JSON válido con esta estructura:

{
  "configurations": [
    {
      "nodeId": "id-del-nodo",
      "nodeName": "nombre-del-nodo", 
      "nodeType": "tipo-del-nodo",
      "parameters": { /* configuración completa */ },
      "credentials": { /* si necesita credenciales */ },
      "exampleData": { /* para DBs, ejemplo de estructura */ },
      "description": "explicación breve de la configuración"
    }
  ],
  "databaseExamples": [
    {
      "type": "postgres",
      "tableName": "ejemplo_tabla",
      "createQuery": "CREATE TABLE...",
      "sampleInserts": ["INSERT INTO..."]
    }
  ],
  "summary": "resumen de las configuraciones aplicadas"
}

## REGLAS IMPORTANTES Y MEJORES PRÁCTICAS:

### CONFIGURACIÓN GENERAL:
1. **TODOS los parámetros** deben estar COMPLETAMENTE configurados
2. **Variables n8n**: usar {{ $json.campo }}, {{ $node.parameter }}, {{ $env.VAR }}
3. **Nombres realistas**: evitar placeholders como "tu-api-key"
4. **Credenciales**: definir estructura completa pero sin valores reales
5. **Expresiones**: usar sintaxis correcta de n8n para datos dinámicos

### PARA BASE DE DATOS:
6. **Queries SQL**: incluir estructura de tabla Y datos de ejemplo
7. **Bind parameters**: usar $1, $2 para evitar SQL injection
8. **Schemas**: nombres descriptivos relacionados al dominio del workflow

### PARA IA Y AGENTES:
9. **Prompts específicos**: adaptar al caso de uso del workflow
10. **Temperature**: 0.1-0.3 precisión, 0.7-0.9 creatividad
11. **Tokens**: 150-500 respuestas cortas, 1000+ contenido largo

### PARA APIs Y SERVICIOS:
12. **URLs de prueba**: usar httpbin.org, jsonplaceholder para testing
13. **Headers**: incluir Content-Type, Authorization apropiados
14. **Rate limiting**: considerar en configuración si aplicable

### PARA FLUJO DE DATOS:
15. **Mapeo de campos**: asegurar compatibilidad entre nodos
16. **Error handling**: incluir manejo básico de errores
17. **Validación**: verificar formatos de datos entre nodos

### PARA TRIGGERS:
18. **Webhook paths**: únicos y descriptivos (/webhook/order-processed)
19. **Schedule timing**: considerar timezone y horarios de negocio
20. **Authentication**: incluir seguridad básica para webhooks

### SALIDA Y DEBUG:
21. **Logging**: incluir logs útiles en Function/Code nodes
22. **NoOp nodes**: para breakpoints y debugging
23. **Merge strategies**: definir manejo de conflictos de datos

## 🎯 CONFIGURACIÓN FUNCIONAL OBLIGATORIA:

### ALGORITMO DE CONFIGURACIÓN:
1. **LEE** el prompt original para entender el propósito del workflow
2. **ANALIZA** cada nodo: ¿Por qué existe? ¿Qué decide/procesa/une?
3. **IDENTIFICA** qué datos vienen del nodo anterior
4. **CONFIGURA** parámetros que sirvan al propósito real

### PARA NODOS IF - PROCESO OBLIGATORIO:
1. **PREGÚNTATE**: ¿Por qué este IF necesita dividir el flujo?
2. **ANALIZA**: ¿Qué criterio empresarial usa para decidir?
3. **IDENTIFICA**: ¿Qué campos del webhook/datos anteriores determinan la decisión?
4. **CONFIGURA**: condición específica basada en datos reales

**EJEMPLO ANÁLISIS:**
- Prompt: "workflow de leads que divida entre premium y básicos"
- IF debe decidir: ¿Es lead premium o básico?
- Campo lógico: leadType, amount, customerTier, subscription, etc.
- Configuración: "{{ $json.leadType }}" equalTo "premium"

### PARA NODOS MERGE - PROCESO OBLIGATORIO:
1. **PREGÚNTATE**: ¿Qué datos diferentes procesan cada rama?
2. **ANALIZA**: ¿Se deben unir (append) o combinar (merge)?
3. **CONFIGURA**: mode según el tipo de datos que se unen

**EJEMPLOS:**
- Ramas con listas de leads diferentes → mode: "append"
- Ramas que enriquecen el mismo objeto → mode: "combine"

### PROHIBICIONES ABSOLUTAS:
- ❌ NO uses "conditionValue" genérico en IF
- ❌ NO uses configuraciones de ejemplo sin propósito
- ❌ NO configures por configurar

### OBLIGACIONES:
- ✅ CADA IF debe tener condición específica al negocio
- ✅ CADA MERGE debe tener estrategia apropiada al caso de uso
- ✅ CADA configuración debe servir al propósito del workflow

¡CADA NODO DEBE ESTAR FUNCIONALMENTE COMPLETO, NO SOLO SINTÁCTICAMENTE VÁLIDO!
`;
    }

    /**
     * Realiza la llamada masiva a Gemini para configurar todos los nodos
     */
    async callGeminiForMassiveConfig(prompt) {
        console.log('📡 Enviando prompt masivo a Gemini...');
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.3, // Precisión para configuración técnica
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192
            }
        };

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                throw new Error(`Error de Gemini API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const responseText = data.candidates[0]?.content?.parts[0]?.text;

            if (!responseText) {
                throw new Error('Respuesta vacía de Gemini');
            }

            // Extraer JSON de la respuesta
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se encontró JSON válido en la respuesta de Gemini');
            }

            return JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error('❌ Error llamando a Gemini:', error);
            throw error;
        }
    }

    /**
     * Aplica las configuraciones generadas al workflow
     */
    applyConfigurationsToWorkflow(workflow, configurations) {
        console.log('🔧 Aplicando configuraciones a los nodos...');
        
        const configuredWorkflow = JSON.parse(JSON.stringify(workflow)); // Deep copy

        configurations.configurations.forEach(config => {
            const nodeIndex = configuredWorkflow.nodes.findIndex(node => node.id === config.nodeId);
            
            if (nodeIndex === -1) {
                console.warn(`⚠️ Nodo no encontrado: ${config.nodeId}`);
                return;
            }

            // Aplicar parámetros
            configuredWorkflow.nodes[nodeIndex].parameters = {
                ...configuredWorkflow.nodes[nodeIndex].parameters,
                ...config.parameters
            };

            // Aplicar credenciales si existen
            if (config.credentials) {
                configuredWorkflow.nodes[nodeIndex].credentials = config.credentials;
            }

            console.log(`✅ Configurado: ${config.nodeName}`);
        });

        // Agregar metadatos de configuración
        configuredWorkflow._metadata = {
            ...configuredWorkflow._metadata,
            nodeConfiguration: {
                timestamp: new Date().toISOString(),
                configurationsApplied: configurations.configurations.length,
                databaseExamples: configurations.databaseExamples || [],
                summary: configurations.summary || 'Configuración completada',
                configuredBy: 'IntelligentNodeConfigAgent'
            }
        };

        return configuredWorkflow;
    }

    /**
     * Guarda el workflow configurado
     */
    async saveConfiguredWorkflow(workflow, originalPath) {
        const timestamp = Date.now();
        const configuredPath = originalPath.replace('.json', `-configured-${timestamp}.json`);
        
        fs.writeFileSync(configuredPath, JSON.stringify(workflow, null, 2));
        console.log(`💾 Workflow configurado guardado en: ${configuredPath}`);
        
        return configuredPath;
    }

    /**
     * Método principal para procesar un workflow
     */
    async processWorkflow(workflowPath, originalPrompt) {
        console.log(`🚀 Procesando workflow: ${workflowPath}`);
        console.log(`📝 Prompt original: ${originalPrompt}`);
        
        try {
            // Leer workflow
            const workflowContent = fs.readFileSync(workflowPath, 'utf8');
            const workflow = JSON.parse(workflowContent);
            
            // Configurar nodos
            const configuredWorkflow = await this.configureAllNodes(workflow, originalPrompt);
            
            // Guardar resultado
            const savedPath = await this.saveConfiguredWorkflow(configuredWorkflow, workflowPath);
            
            // Mostrar resumen
            this.showConfigurationSummary(configuredWorkflow);
            
            return {
                success: true,
                configuredWorkflow,
                savedPath,
                summary: configuredWorkflow._metadata?.nodeConfiguration?.summary
            };
            
        } catch (error) {
            console.error('❌ Error procesando workflow:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Muestra resumen de la configuración aplicada
     */
    showConfigurationSummary(workflow) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN DE CONFIGURACIÓN DE NODOS');
        console.log('='.repeat(60));
        
        const metadata = workflow._metadata?.nodeConfiguration;
        if (metadata) {
            console.log(`⏰ Timestamp: ${metadata.timestamp}`);
            console.log(`🔧 Nodos configurados: ${metadata.configurationsApplied}`);
            console.log(`📝 Resumen: ${metadata.summary}`);
            
            if (metadata.databaseExamples?.length > 0) {
                console.log(`\n🗄️ EJEMPLOS DE BASE DE DATOS GENERADOS:`);
                metadata.databaseExamples.forEach(example => {
                    console.log(`  - Tabla: ${example.tableName} (${example.type})`);
                });
            }
        }
        
        console.log('\n📋 NODOS EN EL WORKFLOW:');
        workflow.nodes.forEach((node, index) => {
            const hasParams = Object.keys(node.parameters || {}).length > 0;
            const hasCredentials = Object.keys(node.credentials || {}).length > 0;
            
            console.log(`${index + 1}. ${node.name} (${node.type})`);
            console.log(`   ✅ Parámetros: ${hasParams ? 'Configurados' : 'Sin configurar'}`);
            console.log(`   🔐 Credenciales: ${hasCredentials ? 'Definidas' : 'No requeridas'}`);
        });
        
        console.log('\n' + '='.repeat(60));
    }
}

// Función principal para testing
async function testIntelligentNodeConfigAgent() {
    console.log('🧪 INICIANDO PRUEBA DEL AGENTE DE CONFIGURACIÓN DE NODOS');
    console.log('=' .repeat(80));
    
    const agent = new IntelligentNodeConfigAgent();
    
    // Prompt recreado basado en el workflow analizado
    const originalPrompt = `Necesito un workflow masivo que tome datos de webhook, divida el flujo en dos ramas dependiendo de una condición, en una rama lea Google Sheets y llame una API externa, en la otra envíe notificaciones por Slack y email, luego una ambas ramas, procese los datos con lógica personalizada, los divida en lotes y los guarde en PostgreSQL, finalmente envíe un email de confirmación del proceso completado.`;
    
    const workflowPath = "C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757878137828.json";
    
    const result = await agent.processWorkflow(workflowPath, originalPrompt);
    
    if (result.success) {
        console.log('\n🎉 AGENTE DE CONFIGURACIÓN EXITOSO!');
        console.log(`📁 Archivo guardado: ${result.savedPath}`);
    } else {
        console.log('\n❌ ERROR EN EL AGENTE:');
        console.log(result.error);
    }
}

// Exportar para uso en otros módulos
module.exports = { IntelligentNodeConfigAgent };

// Ejecutar test si se llama directamente
if (require.main === module) {
    testIntelligentNodeConfigAgent().catch(console.error);
}
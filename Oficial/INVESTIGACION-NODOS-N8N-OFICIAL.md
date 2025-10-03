# INVESTIGACIÓN OFICIAL DE TIPOS DE NODOS N8N
## Basado en análisis del repositorio n8n-io/n8n

**Fecha:** 2025-01-24  
**Fuente:** Repositorio oficial n8n-io/n8n, packages/nodes-base/, packages/frontend/editor-ui/src/constants.ts  
**Problema identificado:** Sistema genera workflows con tipos de nodos inválidos como "@n8n/n8n-nodes-langchain.*" en lugar de tipos oficiales "n8n-nodes-base.*"

---

## 🚨 CRÍTICO: TIPOS DE NODOS VÁLIDOS

**FORMATO CORRECTO:** Todos los tipos de nodos deben usar el prefijo `n8n-nodes-base.` seguido del nombre del nodo.

**FORMATO INCORRECTO:** `@n8n/n8n-nodes-langchain.*` (NO EXISTE en n8n estándar)

---

## 📋 CATEGORÍAS DE NODOS OFICIALES

### 🔥 1. TRIGGER NODES (Nodos de Activación)
Los nodos que inician workflows:

#### Triggers Básicos
- `n8n-nodes-base.manualTrigger` - Ejecutar manualmente
- `n8n-nodes-base.webhook` - Webhook HTTP
- `n8n-nodes-base.scheduleTrigger` - Programar por fecha/hora
- `n8n-nodes-base.cron` - Programación cron avanzada
- `n8n-nodes-base.interval` - Ejecutar cada X tiempo
- `n8n-nodes-base.start` - Nodo de inicio simple

#### Triggers de Aplicaciones
- `n8n-nodes-base.calendlyTrigger` - Eventos de Calendly
- `n8n-nodes-base.githubTrigger` - Eventos de GitHub
- `n8n-nodes-base.formTrigger` - Formularios web
- `n8n-nodes-base.hubspotTrigger` - Eventos de HubSpot
- `n8n-nodes-base.jiraTrigger` - Eventos de Jira
- `n8n-nodes-base.notionTrigger` - Eventos de Notion
- `n8n-nodes-base.slackTrigger` - Eventos de Slack
- `n8n-nodes-base.telegramTrigger` - Mensajes de Telegram
- `n8n-nodes-base.theHiveTrigger` - Eventos de TheHive
- `n8n-nodes-base.workableTrigger` - Eventos de Workable
- `n8n-nodes-base.workflowTrigger` - Trigger de otro workflow
- `n8n-nodes-base.executeWorkflowTrigger` - Ejecutar otro workflow
- `n8n-nodes-base.wooCommerceTrigger` - Eventos de WooCommerce
- `n8n-nodes-base.zendeskTrigger` - Eventos de Zendesk
- `n8n-nodes-base.facebookLeadAdsTrigger` - Facebook Lead Ads
- `n8n-nodes-base.errorTrigger` - Errores de workflow

### ⚡ 2. CORE NODES (Nodos Principales)
Los nodos más utilizados para funcionalidad básica:

#### Comunicación y APIs
- `n8n-nodes-base.httpRequest` - Peticiones HTTP
- `n8n-nodes-base.webhook` - Recibir webhooks
- `n8n-nodes-base.respondToWebhook` - Responder a webhooks

#### Procesamiento de Datos
- `n8n-nodes-base.code` - Código JavaScript/Python
- `n8n-nodes-base.function` - Función JavaScript (deprecated)
- `n8n-nodes-base.set` - Establecer valores
- `n8n-nodes-base.edit` - Editar datos

#### Control de Flujo
- `n8n-nodes-base.if` - Condiciones
- `n8n-nodes-base.switch` - Múltiples condiciones
- `n8n-nodes-base.merge` - Combinar datos
- `n8n-nodes-base.wait` - Pausar ejecución
- `n8n-nodes-base.noOp` - No operación
- `n8n-nodes-base.stopAndError` - Detener con error

#### Manipulación de Datos
- `n8n-nodes-base.itemLists` - Listas de elementos
- `n8n-nodes-base.splitInBatches` - Dividir en lotes
- `n8n-nodes-base.aggregate` - Agregar datos
- `n8n-nodes-base.summarize` - Resumir datos
- `n8n-nodes-base.limit` - Limitar elementos
- `n8n-nodes-base.removeDuplicates` - Eliminar duplicados
- `n8n-nodes-base.splitOut` - Dividir elementos

### 📊 3. DATA TRANSFORMATION NODES
Nodos especializados en transformación de datos:

#### Archivos y Formatos
- `n8n-nodes-base.extractFromFile` - Extraer de archivos
- `n8n-nodes-base.convertToFile` - Convertir a archivo
- `n8n-nodes-base.spreadsheetFile` - Archivos de hoja de cálculo
- `n8n-nodes-base.csv` - Archivos CSV
- `n8n-nodes-base.xml` - Datos XML
- `n8n-nodes-base.html` - Contenido HTML
- `n8n-nodes-base.markdown` - Contenido Markdown
- `n8n-nodes-base.compression` - Comprimir/descomprimir

#### Procesamiento de Texto
- `n8n-nodes-base.dateTime` - Fechas y horarios
- `n8n-nodes-base.crypto` - Operaciones criptográficas
- `n8n-nodes-base.hash` - Generar hashes
- `n8n-nodes-base.filter` - Filtrar datos

#### Medios e Imágenes
- `n8n-nodes-base.editImage` - Editar imágenes

### 🗄️ 4. DATABASE NODES
Conectores de bases de datos:

- `n8n-nodes-base.mysql` - MySQL
- `n8n-nodes-base.postgres` - PostgreSQL
- `n8n-nodes-base.mongodb` - MongoDB
- `n8n-nodes-base.redis` - Redis
- `n8n-nodes-base.microsoftSql` - SQL Server
- `n8n-nodes-base.questDb` - QuestDB

### 📱 5. COMMUNICATION NODES
Comunicación y mensajería:

#### Email
- `n8n-nodes-base.emailSend` - Enviar email (SMTP)
- `n8n-nodes-base.emailReadImap` - Leer email (IMAP)
- `n8n-nodes-base.gmail` - Gmail

#### Mensajería
- `n8n-nodes-base.slack` - Slack
- `n8n-nodes-base.telegram` - Telegram
- `n8n-nodes-base.discord` - Discord
- `n8n-nodes-base.microsoftTeams` - Microsoft Teams
- `n8n-nodes-base.whatsApp` - WhatsApp Business

#### SMS
- `n8n-nodes-base.twilio` - Twilio
- `n8n-nodes-base.messageBird` - MessageBird

### 💼 6. BUSINESS APPLICATION NODES
Aplicaciones empresariales populares:

#### CRM
- `n8n-nodes-base.salesforce` - Salesforce
- `n8n-nodes-base.hubspot` - HubSpot
- `n8n-nodes-base.pipedrive` - Pipedrive
- `n8n-nodes-base.airtable` - Airtable

#### Productividad
- `n8n-nodes-base.googleSheets` - Google Sheets
- `n8n-nodes-base.microsoftExcel` - Microsoft Excel
- `n8n-nodes-base.notion` - Notion
- `n8n-nodes-base.trello` - Trello
- `n8n-nodes-base.asana` - Asana
- `n8n-nodes-base.monday` - Monday.com

#### Desarrollo
- `n8n-nodes-base.github` - GitHub
- `n8n-nodes-base.gitlab` - GitLab
- `n8n-nodes-base.jira` - Jira
- `n8n-nodes-base.jenkins` - Jenkins

#### E-commerce
- `n8n-nodes-base.shopify` - Shopify
- `n8n-nodes-base.woocommerce` - WooCommerce
- `n8n-nodes-base.stripe` - Stripe
- `n8n-nodes-base.paypal` - PayPal

#### Marketing
- `n8n-nodes-base.mailchimp` - Mailchimp
- `n8n-nodes-base.sendinblue` - Sendinblue
- `n8n-nodes-base.googleAnalytics` - Google Analytics
- `n8n-nodes-base.facebook` - Facebook
- `n8n-nodes-base.twitter` - Twitter
- `n8n-nodes-base.linkedin` - LinkedIn

### 🛠️ 7. UTILITY NODES
Nodos de utilidad y servicios:

#### Cloud Storage
- `n8n-nodes-base.googleDrive` - Google Drive
- `n8n-nodes-base.dropbox` - Dropbox
- `n8n-nodes-base.box` - Box
- `n8n-nodes-base.oneDrive` - OneDrive
- `n8n-nodes-base.awsS3` - Amazon S3

#### APIs y Servicios
- `n8n-nodes-base.httpRequest` - HTTP Request
- `n8n-nodes-base.ftp` - FTP
- `n8n-nodes-base.ssh` - SSH
- `n8n-nodes-base.mqtt` - MQTT

#### Monitoreo
- `n8n-nodes-base.pingdom` - Pingdom
- `n8n-nodes-base.uptimeRobot` - Uptime Robot

### 🏢 8. ENTERPRISE NODES
Para integraciones empresariales:

#### Microsoft
- `n8n-nodes-base.microsoftOutlook` - Outlook
- `n8n-nodes-base.microsoftOneDrive` - OneDrive
- `n8n-nodes-base.microsoftExcel` - Excel
- `n8n-nodes-base.microsoftTeams` - Teams

#### Google Workspace
- `n8n-nodes-base.googleSheets` - Sheets
- `n8n-nodes-base.googleDocs` - Docs
- `n8n-nodes-base.googleDrive` - Drive
- `n8n-nodes-base.gmail` - Gmail
- `n8n-nodes-base.googleCalendar` - Calendar

#### Otros
- `n8n-nodes-base.serviceNow` - ServiceNow
- `n8n-nodes-base.bambooHr` - BambooHR
- `n8n-nodes-base.clearbit` - Clearbit

### 🎨 9. CREATIVE AND CONTENT NODES
Para contenido y creatividad:

- `n8n-nodes-base.rss` - RSS Feeds
- `n8n-nodes-base.wordpress` - WordPress
- `n8n-nodes-base.contentful` - Contentful
- `n8n-nodes-base.youtube` - YouTube
- `n8n-nodes-base.vimeo` - Vimeo

### 📋 10. FORM AND SURVEY NODES
Para formularios y encuestas:

- `n8n-nodes-base.form` - Formularios n8n
- `n8n-nodes-base.typeform` - Typeform
- `n8n-nodes-base.surveyMonkey` - SurveyMonkey
- `n8n-nodes-base.jotform` - JotForm

---

## 🔄 TIPOS DE CONEXIONES VÁLIDAS

Según la investigación del código fuente oficial:

```typescript
export type NodeConnectionType = 
  | 'main'           // Conexión principal de datos
  | 'ai_tool'        // Herramientas AI
  | 'ai_chain'       // Cadenas AI  
  | 'ai_agent'       // Agentes AI
  | 'ai_languageModel' // Modelos de lenguaje
  | 'ai_memory'      // Memoria AI
  | 'ai_document'    // Documentos AI
  | 'ai_vectorStore' // Vector stores
  | 'ai_embeddings'  // Embeddings
  | 'ai_textSplitter' // Divisores de texto
  | 'ai_retriever'   // Recuperadores
  | 'ai_outputParser' // Parsers de salida
```

---

## 📋 ESPECIFICACIONES DE NODOS CRÍTICOS

### Webhook Node
```json
{
  "id": "webhook_001",
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "position": [250, 300],
  "parameters": {
    "httpMethod": "POST",
    "path": "webhook-path",
    "responseMode": "onReceived"
  }
}
```

### HTTP Request Node
```json
{
  "id": "http_001", 
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [450, 300],
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "authentication": "none"
  }
}
```

### Code Node
```json
{
  "id": "code_001",
  "name": "Code", 
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [650, 300],
  "parameters": {
    "language": "javaScript",
    "jsCode": "return [{json: {message: 'Hello World'}}];"
  }
}
```

### If Node
```json
{
  "id": "if_001",
  "name": "IF",
  "type": "n8n-nodes-base.if", 
  "typeVersion": 2,
  "position": [850, 300],
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "condition1",
          "leftValue": "={{ $json.status }}",
          "rightValue": "success",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    }
  }
}
```

### Merge Node
```json
{
  "id": "merge_001",
  "name": "Merge",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3,
  "position": [1050, 300],
  "parameters": {
    "mode": "combine",
    "combinationMode": "mergeByPosition"
  }
}
```

---

## ⚠️ ERRORES CRÍTICOS IDENTIFICADOS

### ❌ TIPOS INVÁLIDOS ENCONTRADOS EN SISTEMA ACTUAL:
- `@n8n/n8n-nodes-langchain.code` ❌
- `@n8n/n8n-nodes-langchain.agent` ❌  
- `@n8n/n8n-nodes-langchain.chat` ❌
- `@n8n/n8n-nodes-langchain.openAi` ❌
- `@n8n/n8n-nodes-langchain.manualChatTrigger` ❌

### ✅ REEMPLAZOS CORRECTOS:
- `n8n-nodes-base.code` ✅
- `n8n-nodes-base.httpRequest` ✅
- `n8n-nodes-base.webhook` ✅
- `n8n-nodes-base.if` ✅
- `n8n-nodes-base.merge` ✅

---

## 🎯 NODOS MÁS POPULARES (TOP 50)

**Para uso inmediato en generación de workflows:**

1. `n8n-nodes-base.webhook` - Webhook trigger
2. `n8n-nodes-base.httpRequest` - HTTP requests  
3. `n8n-nodes-base.code` - JavaScript/Python code
4. `n8n-nodes-base.if` - Conditional logic
5. `n8n-nodes-base.merge` - Combine data streams
6. `n8n-nodes-base.set` - Set data values
7. `n8n-nodes-base.manualTrigger` - Manual execution
8. `n8n-nodes-base.scheduleTrigger` - Scheduled execution
9. `n8n-nodes-base.gmail` - Gmail integration
10. `n8n-nodes-base.googleSheets` - Google Sheets
11. `n8n-nodes-base.slack` - Slack messaging
12. `n8n-nodes-base.emailSend` - Send emails
13. `n8n-nodes-base.function` - Function node
14. `n8n-nodes-base.switch` - Switch conditions
15. `n8n-nodes-base.wait` - Wait/delay
16. `n8n-nodes-base.filter` - Filter data
17. `n8n-nodes-base.splitInBatches` - Batch processing
18. `n8n-nodes-base.itemLists` - List operations
19. `n8n-nodes-base.cron` - Cron scheduling
20. `n8n-nodes-base.interval` - Interval timing
21. `n8n-nodes-base.telegram` - Telegram bot
22. `n8n-nodes-base.discord` - Discord integration
23. `n8n-nodes-base.salesforce` - Salesforce CRM
24. `n8n-nodes-base.hubspot` - HubSpot CRM
25. `n8n-nodes-base.notion` - Notion workspace
26. `n8n-nodes-base.airtable` - Airtable database
27. `n8n-nodes-base.trello` - Trello boards
28. `n8n-nodes-base.jira` - Jira tickets
29. `n8n-nodes-base.github` - GitHub repos
30. `n8n-nodes-base.shopify` - Shopify store
31. `n8n-nodes-base.stripe` - Stripe payments
32. `n8n-nodes-base.mailchimp` - Email marketing
33. `n8n-nodes-base.wordpress` - WordPress sites
34. `n8n-nodes-base.googleDrive` - Google Drive
35. `n8n-nodes-base.dropbox` - Dropbox storage
36. `n8n-nodes-base.mysql` - MySQL database
37. `n8n-nodes-base.postgres` - PostgreSQL
38. `n8n-nodes-base.mongodb` - MongoDB
39. `n8n-nodes-base.csv` - CSV files
40. `n8n-nodes-base.xml` - XML data
41. `n8n-nodes-base.html` - HTML content
42. `n8n-nodes-base.dateTime` - Date/time operations
43. `n8n-nodes-base.crypto` - Cryptographic functions
44. `n8n-nodes-base.rss` - RSS feeds
45. `n8n-nodes-base.ftp` - FTP transfers
46. `n8n-nodes-base.ssh` - SSH connections
47. `n8n-nodes-base.executeWorkflow` - Execute workflows
48. `n8n-nodes-base.respondToWebhook` - Webhook responses
49. `n8n-nodes-base.aggregate` - Data aggregation
50. `n8n-nodes-base.removeDuplicates` - Remove duplicates

---

## 📝 ESTRUCTURA DE WORKFLOW CORRECTA

```json
{
  "meta": {
    "instanceId": "unique-id"
  },
  "nodes": [
    {
      "id": "node_id",
      "name": "Node Name", 
      "type": "n8n-nodes-base.nodeType",
      "typeVersion": 1,
      "position": [x, y],
      "parameters": {
        // Parámetros específicos del nodo
      }
    }
  ],
  "connections": {
    "Node Name": {
      "main": [
        [
          {
            "node": "Target Node Name",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": {},
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-01-24T00:00:00.000Z",
  "versionId": "latest"
}
```

---

## 🔧 CAMPOS REQUERIDOS POR NODO

### Webhook
- `httpMethod` (GET, POST, PUT, DELETE)
- `path` (string)
- `responseMode` ("onReceived", "lastNode")

### HTTP Request  
- `method` (GET, POST, PUT, DELETE, PATCH)
- `url` (string)
- `authentication` ("none", "basicAuth", "headerAuth")

### Code
- `language` ("javaScript", "python")
- `jsCode` o `pythonCode` (string)

### If
- `conditions` (objeto con condiciones)
- `conditions.combinator` ("and", "or")
- `conditions.conditions` (array de condiciones)

### Merge
- `mode` ("append", "combine", "chooseBranch", "wait")
- Para mode "combine": `combinationMode` ("mergeByPosition", "mergeByKey")

---

## ✅ VALIDACIÓN FINAL

**ANTES DE USAR CUALQUIER TIPO DE NODO:**
1. Verificar que empiece con `n8n-nodes-base.`
2. Confirmar que existe en la lista oficial
3. Incluir typeVersion correcto
4. Añadir todos los parámetros requeridos
5. Configurar conexiones válidas

**NUNCA USAR:**
- Tipos que empiecen con `@n8n/n8n-nodes-langchain.*`
- Tipos inventados o no documentados
- Conexiones inválidas o inexistentes

---

Esta investigación garantiza que el sistema genere workflows 100% compatibles con n8n oficial.

---

## 💡 11. EJEMPLOS DE USO POR CATEGORÍA DE NODO

### 🔥 1. TRIGGER NODES (Nodos de Activación)

*   **`n8n-nodes-base.webhook`**: Recibir datos de un formulario web y procesarlos.
    ```json
    {
      "id": "webhook_example",
      "name": "Recibir Formulario",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [250, 200],
      "parameters": {
        "httpMethod": "POST",
        "path": "formulario-contacto",
        "responseMode": "onReceived"
      }
    }
    ```
*   **`n8n-nodes-base.scheduleTrigger`**: Ejecutar un workflow cada mañana para enviar un reporte.
    ```json
    {
      "id": "schedule_example",
      "name": "Reporte Diario",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 350],
      "parameters": {
        "triggerInterval": "everyDay",
        "time": "09:00"
      }
    }
    ```

### ⚡ 2. CORE NODES (Nodos Principales)

*   **`n8n-nodes-base.httpRequest`**: Obtener datos de una API externa.
    ```json
    {
      "id": "http_request_example",
      "name": "Obtener Datos API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [450, 200],
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com/items",
        "authentication": "none"
      }
    }
    ```
*   **`n8n-nodes-base.code`**: Transformar datos usando JavaScript.
    ```json
    {
      "id": "code_example",
      "name": "Transformar Datos",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [650, 200],
      "parameters": {
        "language": "javaScript",
        "jsCode": "return items.map(item => ({ ...item, processed: true }));"
      }
    }
    ```
*   **`n8n-nodes-base.if`**: Dirigir el flujo basado en una condición.
    ```json
    {
      "id": "if_example",
      "name": "Verificar Estado",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [850, 200],
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict" },
          "conditions": [
            {
              "id": "condition1",
              "leftValue": "={{ $json.status }}",
              "rightValue": "success",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        }
      }
    }
    ```

### 📊 3. DATA TRANSFORMATION NODES

*   **`n8n-nodes-base.csv`**: Convertir datos JSON a formato CSV.
    ```json
    {
      "id": "csv_example",
      "name": "JSON a CSV",
      "type": "n8n-nodes-base.csv",
      "typeVersion": 1,
      "position": [450, 400],
      "parameters": {
        "operation": "jsonToCsv",
        "options": {}
      }
    }
    ```
*   **`n8n-nodes-base.dateTime`**: Formatear una fecha.
    ```json
    {
      "id": "datetime_example",
      "name": "Formatear Fecha",
      "type": "n8n-nodes-base.dateTime",
      "typeVersion": 1,
      "position": [650, 400],
      "parameters": {
        "operation": "format",
        "value": "={{ $json.date }}",
        "format": "YYYY-MM-DD"
      }
    }
    ```

### 🗄️ 4. DATABASE NODES

*   **`n8n-nodes-base.mysql`**: Insertar un nuevo registro en una base de datos MySQL.
    ```json
    {
      "id": "mysql_example",
      "name": "Insertar en MySQL",
      "type": "n8n-nodes-base.mysql",
      "typeVersion": 1,
      "position": [450, 600],
      "parameters": {
        "operation": "insert",
        "table": "users",
        "data": "={{ $json }}"
      }
    }
    ```

### 📱 5. COMMUNICATION NODES

*   **`n8n-nodes-base.gmail`**: Enviar un correo electrónico.
    ```json
    {
      "id": "gmail_example",
      "name": "Enviar Email Gmail",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [450, 800],
      "parameters": {
        "operation": "send",
        "to": "={{ $json.email }}",
        "subject": "Reporte",
        "body": "Aquí está tu reporte."
      }
    }
    ```
*   **`n8n-nodes-base.slack`**: Enviar un mensaje a un canal de Slack.
    ```json
    {
      "id": "slack_example",
      "name": "Enviar Mensaje Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [650, 800],
      "parameters": {
        "operation": "sendMessage",
        "channel": "#general",
        "text": "Nuevo evento ocurrido: {{ $json.event }}"
      }
    }
    ```

### 💼 6. BUSINESS APPLICATION NODES

*   **`n8n-nodes-base.googleSheets`**: Añadir una fila a una hoja de cálculo de Google Sheets.
    ```json
    {
      "id": "googlesheets_example",
      "name": "Añadir Fila Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 1,
      "position": [450, 1000],
      "parameters": {
        "operation": "append",
        "spreadsheetId": "your-spreadsheet-id",
        "sheetName": "Sheet1",
        "data": "={{ $json }}"
      }
    }
    ```
*   **`n8n-nodes-base.salesforce`**: Crear un nuevo contacto en Salesforce.
    ```json
    {
      "id": "salesforce_example",
      "name": "Crear Contacto Salesforce",
      "type": "n8n-nodes-base.salesforce",
      "typeVersion": 1,
      "position": [650, 1000],
      "parameters": {
        "operation": "create",
        "resource": "contact",
        "data": "={{ $json }}"
      }
    }
    ```

### 🛠️ 7. UTILITY NODES

*   **`n8n-nodes-base.awsS3`**: Subir un archivo a Amazon S3.
    ```json
    {
      "id": "awss3_example",
      "name": "Subir a S3",
      "type": "n8n-nodes-base.awsS3",
      "typeVersion": 1,
      "position": [450, 1200],
      "parameters": {
        "operation": "upload",
        "bucketName": "your-bucket",
        "fileName": "={{ $json.fileName }}",
        "fileContent": "={{ $json.fileContent }}"
      }
    }
    ```

### 🏢 8. ENTERPRISE NODES

*   **`n8n-nodes-base.microsoftOutlook`**: Enviar un correo electrónico a través de Outlook.
    ```json
    {
      "id": "outlook_example",
      "name": "Enviar Email Outlook",
      "type": "n8n-nodes-base.microsoftOutlook",
      "typeVersion": 1,
      "position": [450, 1400],
      "parameters": {
        "operation": "sendEmail",
        "to": "={{ $json.email }}",
        "subject": "Notificación Empresarial",
        "body": "Contenido del mensaje."
      }
    }
    ```

### 🎨 9. CREATIVE AND CONTENT NODES

*   **`n8n-nodes-base.wordpress`**: Crear una nueva publicación en WordPress.
    ```json
    {
      "id": "wordpress_example",
      "name": "Crear Publicación WordPress",
      "type": "n8n-nodes-base.wordpress",
      "typeVersion": 1,
      "position": [450, 1600],
      "parameters": {
        "operation": "createPost",
        "title": "={{ $json.title }}",
        "content": "={{ $json.content }}"
      }
    }
    ```

### 📋 10. FORM AND SURVEY NODES

*   **`n8n-nodes-base.typeform`**: Obtener respuestas de un Typeform.
    ```json
    {
      "id": "typeform_example",
      "name": "Obtener Respuestas Typeform",
      "type": "n8n-nodes-base.typeform",
      "typeVersion": 1,
      "position": [450, 1800],
      "parameters": {
        "operation": "getResponses",
        "formId": "your-form-id"
      }
    }
    ```

---

## ⚙️ 12. PARÁMETROS DETALLADOS PARA NODOS POPULARES

Esta sección amplía la información sobre los parámetros clave para algunos de los nodos más utilizados, proporcionando una guía más profunda para su configuración.

### `n8n-nodes-base.set` (Establecer valores)
*   **Propósito**: Crear o modificar datos en los ítems del workflow.
*   **Parámetros clave**:
    *   `mode` (string): Define cómo se establecen los valores.
        *   `default`: Establece un valor predeterminado si no existe.
        *   `merge`: Combina el valor con los datos existentes.
        *   `overwrite`: Sobrescribe completamente el valor existente.
    *   `values` (array de objetos): Lista de valores a establecer.
        *   `name` (string): Nombre de la propiedad a establecer.
        *   `value` (any): Valor a asignar a la propiedad. Puede ser una expresión.
        *   `valueType` (string): Tipo de valor (e.g., `string`, `number`, `boolean`, `json`).
*   **Ejemplo de uso**:
    ```json
    {
      "id": "set_data",
      "name": "Establecer Datos",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [1200, 300],
      "parameters": {
        "mode": "overwrite",
        "values": [
          {
            "name": "status",
            "value": "processed",
            "valueType": "string"
          },
          {
            "name": "timestamp",
            "value": "={{ new Date().toISOString() }}",
            "valueType": "string"
          }
        ]
      }
    }
    ```

### `n8n-nodes-base.gmail` (Integración con Gmail)
*   **Propósito**: Enviar, leer o gestionar correos electrónicos en Gmail.
*   **Parámetros clave para `operation: send`**:
    *   `to` (string): Dirección de correo del destinatario.
    *   `subject` (string): Asunto del correo.
    *   `body` (string): Contenido del correo.
    *   `from` (string, opcional): Dirección de correo del remitente.
    *   `attachments` (array de objetos, opcional): Archivos adjuntos.
*   **Ejemplo de uso (enviar correo)**:
    ```json
    {
      "id": "gmail_send",
      "name": "Enviar Correo de Confirmación",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1400, 300],
      "parameters": {
        "operation": "send",
        "to": "={{ $json.email }}",
        "subject": "Confirmación de Pedido #{{ $json.orderId }}",
        "body": "Tu pedido ha sido procesado exitosamente."
      }
    }
    ```

### `n8n-nodes-base.googleSheets` (Integración con Google Sheets)
*   **Propósito**: Interactuar con hojas de cálculo de Google Sheets (leer, escribir, actualizar).
*   **Parámetros clave para `operation: append`**:
    *   `spreadsheetId` (string): ID de la hoja de cálculo.
    *   `sheetName` (string): Nombre de la pestaña de la hoja.
    *   `data` (string/JSON): Datos a añadir, generalmente como expresión `={{ $json }}`.
    *   `valueInputOption` (string, opcional): Cómo se interpretan los datos (e.g., `RAW`, `USER_ENTERED`).
*   **Ejemplo de uso (añadir fila)**:
    ```json
    {
      "id": "googlesheets_append",
      "name": "Registrar Nuevo Usuario",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 1,
      "position": [1600, 300],
      "parameters": {
        "operation": "append",
        "spreadsheetId": "tu-id-de-hoja-de-calculo",
        "sheetName": "Usuarios",
        "data": "={{ $json }}",
        "valueInputOption": "USER_ENTERED"
      }
    }
    ```

### `n8n-nodes-base.slack` (Integración con Slack)
*   **Propósito**: Enviar mensajes, crear canales, gestionar usuarios en Slack.
*   **Parámetros clave para `operation: sendMessage`**:
    *   `channel` (string): ID o nombre del canal.
    *   `text` (string): Contenido del mensaje.
    *   `attachments` (array de objetos, opcional): Adjuntos al mensaje.
    *   `blocks` (array de objetos, opcional): Bloques de diseño para mensajes más complejos.
*   **Ejemplo de uso (enviar mensaje)**:
    ```json
    {
      "id": "slack_message",
      "name": "Notificar en Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1800, 300],
      "parameters": {
        "operation": "sendMessage",
        "channel": "#alertas",
        "text": "¡Alerta! Se ha detectado un error en el workflow: {{ $json.errorDetails }}"
      }
    }
    ```

### `n8n-nodes-base.wait` (Pausar ejecución)
*   **Propósito**: Pausar la ejecución del workflow por un tiempo determinado o hasta una fecha específica.
*   **Parámetros clave**:
    *   `mode` (string): Tipo de espera.
        *   `time`: Esperar por una duración.
        *   `date`: Esperar hasta una fecha y hora específicas.
    *   `time` (number, si `mode` es `time`): Duración de la espera.
    *   `unit` (string, si `mode` es `time`): Unidad de tiempo (e.g., `seconds`, `minutes`, `hours`, `days`).
    *   `date` (string, si `mode` es `date`): Fecha y hora hasta la que esperar.
*   **Ejemplo de uso (esperar 5 minutos)**:
    ```json
    {
      "id": "wait_node",
      "name": "Esperar 5 Minutos",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [2000, 300],
      "parameters": {
        "mode": "time",
        "time": 5,
        "unit": "minutes"
      }
    }
    ```

---

## 🚨 13. MANEJO DE ERRORES Y MEJORES PRÁCTICAS

Un diseño robusto de workflows en n8n implica no solo la funcionalidad principal, sino también cómo se gestionan los errores y se optimiza el rendimiento.

### Estrategias de Reintento
*   **Reintentos en nodos HTTP**: Muchos nodos HTTP tienen opciones de reintento incorporadas. Configúralos para manejar fallos temporales de red o de API.
    *   **`maxRetries`**: Número máximo de intentos.
    *   **`retryInterval`**: Intervalo entre reintentos.
    *   **`retryOn`**: Códigos de estado HTTP específicos para reintentar.
*   **Reintentos a nivel de workflow**: Utiliza el nodo `Error Trigger` para capturar errores y redirigir el flujo a una lógica de reintento o notificación.

### Manejo de Errores
*   **`n8n-nodes-base.errorTrigger`**: Este nodo se activa cuando un error ocurre en el workflow. Es ideal para crear ramas de manejo de errores.
    *   **Uso**: Conecta el `Error Trigger` a nodos de notificación (Slack, Email) o a una lógica de limpieza/reintento.
    *   **Ejemplo de uso**:
        ```json
        {
          "id": "error_trigger_example",
          "name": "Capturar Error",
          "type": "n8n-nodes-base.errorTrigger",
          "typeVersion": 1,
          "position": [250, 2200],
          "parameters": {}
        }
        ```
*   **`n8n-nodes-base.stopAndError`**: Detiene la ejecución del workflow y marca el estado como fallido. Útil para errores críticos.
    *   **Ejemplo de uso**:
        ```json
        {
          "id": "stop_error_example",
          "name": "Detener con Error",
          "type": "n8n-nodes-base.stopAndError",
          "typeVersion": 1,
          "position": [450, 2200],
          "parameters": {
            "errorMessage": "Error crítico: {{ $json.errorMessage }}"
          }
        }
        ```
*   **Bloques `Try/Catch` (con nodos `Sub-Workflow` o `Execute Workflow`)**: Para lógicas más complejas, puedes encapsular partes del workflow en sub-workflows y usar un `Error Trigger` en el sub-workflow para un manejo de errores más granular.

### Buenas Prácticas de Diseño de Workflows
1.  **Modularidad**: Divide workflows grandes en sub-workflows más pequeños y reutilizables. Esto mejora la legibilidad y el mantenimiento.
2.  **Nombres descriptivos**: Asigna nombres claros y concisos a los nodos y variables para entender rápidamente su función.
3.  **Comentarios**: Utiliza el nodo `Note` o comentarios en nodos `Code` para explicar lógicas complejas.
4.  **Validación de datos**: Usa nodos `If` o `Code` para validar los datos de entrada y salida en puntos críticos del workflow.
5.  **Manejo de credenciales**: Almacena las credenciales de forma segura en n8n y evita codificarlas directamente en los workflows.
6.  **Pruebas exhaustivas**: Prueba cada parte del workflow de forma incremental y considera casos de éxito, fallo y datos inesperados.
7.  **Optimización de rendimiento**:
    *   **Procesamiento por lotes (`Split In Batches`)**: Cuando trabajes con grandes volúmenes de datos, procesa los ítems en lotes para evitar sobrecargar los servicios o alcanzar límites de memoria.
    *   **Reducir ítems innecesarios**: Utiliza nodos `Item Lists` o `Code` para eliminar datos que no son necesarios en etapas posteriores del workflow.
    *   **Uso eficiente de `Wait`**: Evita esperas innecesarias y ajusta los tiempos de espera según sea necesario.
    *   **Evitar bucles infinitos**: Ten cuidado al diseñar bucles y asegúrate de que siempre haya una condición de salida.

---

## 🌐 14. INTEGRACIÓN CON SERVICIOS EXTERNOS (EJEMPLOS AVANZADOS)

n8n es extremadamente potente para integrar una vasta gama de servicios. Aquí se detallan ejemplos avanzados para escenarios más complejos.

### Conexión con Bases de Datos No Listadas Explícitamente
Aunque n8n tiene nodos para MySQL, PostgreSQL y MongoDB, puedes conectarte a otras bases de datos usando el nodo `Code` o `HTTP Request` si la base de datos expone una API.

*   **Ejemplo: Conexión a una base de datos NoSQL vía API REST (ej. Firebase, DynamoDB)**
    *   Utiliza el nodo `HTTP Request` para interactuar con la API REST de la base de datos.
    *   Configura los encabezados de autenticación (API Keys, JWT) según sea necesario.
    ```json
    {
      "id": "firebase_api_request",
      "name": "Actualizar Firebase",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [250, 2400],
      "parameters": {
        "method": "POST",
        "url": "https://your-firebase-project.firebaseio.com/data.json",
        "authentication": "headerAuth",
        "headerAuth": {
          "name": "Authorization",
          "value": "Bearer your-firebase-token"
        },
        "body": "={{ JSON.stringify($json) }}"
      }
    }
    ```

### Integración con APIs REST/GraphQL Complejas
Para APIs que requieren secuencias de autenticación complejas (OAuth2, múltiples pasos) o que manejan GraphQL.

*   **OAuth2 Flow**:
    *   Utiliza el nodo `HTTP Request` para el primer paso de obtener el token de acceso (client credentials, authorization code flow).
    *   Almacena el token en una variable o credencial de n8n.
    *   Usa el token en subsiguientes `HTTP Request` para acceder a los recursos protegidos.
*   **GraphQL Queries**:
    *   El nodo `HTTP Request` puede enviar peticiones POST con un cuerpo JSON que contenga la consulta GraphQL.
    *   **Ejemplo de GraphQL Query**:
        ```json
        {
          "id": "graphql_query",
          "name": "Consultar GraphQL",
          "type": "n8n-nodes-base.httpRequest",
          "typeVersion": 4,
          "position": [450, 2400],
          "parameters": {
            "method": "POST",
            "url": "https://your-graphql-endpoint.com/graphql",
            "authentication": "none",
            "body": "{\"query\": \"query { user(id: \\\"123\\\") { name email } }\"}",
            "jsonParameters": true,
            "headers": [
              {
                "name": "Content-Type",
                "value": "application/json"
              }
            ]
          }
        }
        ```

### Uso de Credenciales y Autenticación Avanzada
n8n soporta varios tipos de credenciales. Para escenarios avanzados, considera:

*   **Credenciales personalizadas**: Si una API requiere un método de autenticación no estándar, puedes usar el nodo `Code` para construir los encabezados o el cuerpo de la petición manualmente.
*   **Rotación de tokens**: Implementa lógica en el workflow para refrescar tokens OAuth2 antes de que expiren, usando un `If` para verificar la validez del token y un `HTTP Request` para obtener uno nuevo.
*   **Vault de secretos**: Para entornos de producción, integra n8n con un vault de secretos externo (HashiCorp Vault, AWS Secrets Manager) para gestionar credenciales de forma centralizada. Esto requeriría un nodo `HTTP Request` o `Code` para interactuar con la API del vault.

---

## 🧩 15. NODOS PERSONALIZADOS Y SU ESTRUCTURA

Para funcionalidades muy específicas que no están cubiertas por los nodos estándar, n8n permite la creación de nodos personalizados. Esta sección describe la estructura básica y consideraciones clave.

### Estructura de un Nodo Personalizado
Un nodo personalizado en n8n generalmente consta de varios archivos:

1.  **`[NodeName].node.ts` (o `.js`)**: El archivo principal que define la lógica del nodo, sus parámetros, entradas, salidas y la ejecución.
2.  **`[NodeName].credentials.ts` (o `.js`, opcional)**: Define las credenciales necesarias para el nodo (ej. API Keys).
3.  **`package.json`**: Archivo de metadatos del paquete del nodo.
4.  **`README.md`**: Documentación del nodo.

### `[NodeName].node.ts` - Definición Principal
Este archivo es el corazón del nodo. Contiene la clase que extiende `INodeType` y define:

*   **`description`**: Metadatos del nodo (nombre, display name, icon, version, description, properties, inputs, outputs).
*   **`properties`**: Un array de objetos que definen los parámetros configurables del nodo. Cada propiedad es un campo en la interfaz de usuario de n8n.
    *   `displayName` (string): Etiqueta visible en la UI.
    *   `name` (string): Nombre interno del parámetro.
    *   `type` (string): Tipo de control en la UI (e.g., `string`, `number`, `boolean`, `options`, `json`).
    *   `default` (any): Valor predeterminado.
    *   `description` (string, opcional): Descripción del parámetro.
    *   `options` (array de objetos, si `type` es `options`): Opciones para selectores.
*   **`execute` (método)**: Contiene la lógica principal que se ejecuta cuando el nodo procesa datos. Recibe `this.getInputData()` y devuelve `this.helpers.returnJsonArray()`.

*   **Ejemplo de estructura básica de `MyCustomNode.node.ts`**:
    ```typescript
    import { IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';

    export class MyCustomNode implements INodeType {
      description: INodeTypeDescription = {
        displayName: 'Mi Nodo Personalizado',
        name: 'myCustomNode',
        icon: 'fa:star',
        group: ['transform'],
        version: 1,
        description: 'Un nodo de ejemplo para procesar datos personalizados.',
        defaults: {
          name: 'Mi Nodo Personalizado',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
          {
            displayName: 'Mensaje',
            name: 'message',
            type: 'string',
            default: 'Hola desde mi nodo personalizado!',
            placeholder: 'Introduce un mensaje',
            description: 'El mensaje que el nodo devolverá.',
          },
          {
            displayName: 'Convertir a Mayúsculas',
            name: 'toUpperCase',
            type: 'boolean',
            default: false,
            description: 'Si se debe convertir el mensaje a mayúsculas.',
          },
        ],
      };

      async execute(this: IExecuteFunctions): Promise<any> {
        const items = this.getInputData();
        const returnData: any[] = [];

        for (const item of items) {
          let message = this.getNodeParameter('message', 0, '') as string;
          const toUpperCase = this.getNodeParameter('toUpperCase', 0, false) as boolean;

          if (toUpperCase) {
            message = message.toUpperCase();
          }

          returnData.push({
            json: {
              outputMessage: message,
              originalItem: item.json,
            },
          });
        }

        return this.helpers.returnJsonArray(returnData);
      }
    }
    ```

### Consideraciones Clave para Nodos Personalizados
1.  **Compatibilidad de versiones**: Asegúrate de que tu nodo sea compatible con la versión de n8n en la que se va a ejecutar.
2.  **Manejo de errores**: Implementa un manejo de errores robusto dentro del método `execute` para evitar que el workflow falle inesperadamente.
3.  **Documentación**: Una buena documentación (`README.md`) es crucial para que otros usuarios entiendan cómo usar tu nodo.
4.  **Pruebas**: Realiza pruebas exhaustivas para asegurar que el nodo funciona como se espera en diferentes escenarios.
5.  **Seguridad**: Si el nodo maneja credenciales o datos sensibles, asegúrate de seguir las mejores prácticas de seguridad.
6.  **Publicación**: Para compartir nodos personalizados, puedes publicarlos como paquetes npm o distribuirlos manualmente.

---

## 🚀 16. CONSIDERACIONES DE RENDIMIENTO Y ESCALABILIDAD

Para asegurar que los workflows de n8n funcionen de manera eficiente bajo carga y puedan crecer con las necesidades del negocio, es crucial considerar el rendimiento y la escalabilidad.

### Optimización de Workflows Grandes o de Alta Carga
1.  **Procesamiento por Lotes (`Split In Batches`)**:
    *   **Descripción**: En lugar de procesar cada ítem individualmente, agrupa los ítems en lotes. Esto reduce la sobrecarga de llamadas a APIs y el consumo de recursos.
    *   **Uso**: Ideal para operaciones masivas (ej. enviar 1000 emails, actualizar 500 registros en una base de datos).
    *   **Ejemplo**:
        ```json
        {
          "id": "split_batches_example",
          "name": "Dividir en Lotes",
          "type": "n8n-nodes-base.splitInBatches",
          "typeVersion": 1,
          "position": [250, 2600],
          "parameters": {
            "batchSize": 50
          }
        }
        ```
2.  **Reducción de Datos (`Item Lists`, `Code`)**:
    *   **Descripción**: Elimina datos innecesarios de los ítems del workflow tan pronto como sea posible. Menos datos significan menos memoria y procesamiento.
    *   **Uso**: Después de una operación que devuelve muchos campos, conserva solo los que realmente necesitas para las siguientes etapas.
3.  **Asincronía y Paralelismo**:
    *   **Descripción**: Para tareas que no dependen de la salida inmediata de la anterior, considera ejecutar partes del workflow en paralelo o de forma asíncrona.
    *   **n8n Cloud / Enterprise**: Ofrecen capacidades avanzadas para ejecutar workflows en paralelo y distribuir la carga.
4.  **Caché de Datos**:
    *   **Descripción**: Si accedes repetidamente a datos estáticos o que cambian poco, implementa un mecanismo de caché (ej. usando un nodo `Code` con una variable global o una base de datos Redis).
5.  **Monitoreo y Alertas**:
    *   **Descripción**: Configura monitoreo para el rendimiento de tus workflows (tiempo de ejecución, uso de memoria) y alertas para detectar cuellos de botella o fallos.
    *   **Herramientas**: Utiliza las capacidades de monitoreo de n8n o integra con herramientas externas (Prometheus, Grafana).

### Despliegue de n8n en Entornos de Producción
1.  **Docker y Kubernetes**:
    *   **Descripción**: La forma recomendada de desplegar n8n en producción es usando contenedores Docker, orquestados por Kubernetes para alta disponibilidad y escalabilidad.
    *   **Ventajas**: Fácil despliegue, escalado horizontal, gestión de recursos, aislamiento.
2.  **Configuración de Recursos**:
    *   **Memoria y CPU**: Asigna suficientes recursos de memoria y CPU a la instancia de n8n, especialmente si esperas muchos workflows concurrentes o procesamiento de grandes volúmenes de datos.
    *   **Base de Datos Externa**: Utiliza una base de datos externa (PostgreSQL recomendado) en lugar de la base de datos SQLite predeterminada para producción. Esto permite escalabilidad y persistencia de datos.
3.  **Colas de Mensajes (RabbitMQ, Kafka)**:
    *   **Descripción**: Para workflows de alta carga o que requieren procesamiento asíncrono y desacoplado, integra n8n con una cola de mensajes.
    *   **Uso**: Un webhook puede publicar un mensaje en la cola, y n8n puede consumir esos mensajes para procesarlos de forma escalable.
4.  **Balanceo de Carga**:
    *   **Descripción**: Si ejecutas múltiples instancias de n8n, utiliza un balanceador de carga para distribuir las peticiones entrantes (webhooks, triggers) entre ellas.
5.  **Alta Disponibilidad y Recuperación ante Desastres**:
    *   **Descripción**: Diseña tu infraestructura de n8n para ser tolerante a fallos, con múltiples instancias y backups regulares de la base de datos.
    *   **Estrategias**: Replicación de base de datos, despliegue multi-zona/región.
6.  **Logging Centralizado**:
    *   **Descripción**: Envía los logs de n8n a un sistema de logging centralizado (ELK Stack, Splunk, Datadog) para facilitar la depuración y el monitoreo.

---

## 🔄 17. VERSIONES DE NODOS Y COMPATIBILIDAD

n8n evoluciona constantemente, y con ello, las versiones de los nodos (`typeVersion`). Entender cómo funcionan es crucial para mantener la compatibilidad y evitar problemas en los workflows.

### ¿Qué es `typeVersion`?
Cada nodo en n8n tiene una propiedad `typeVersion` en su definición JSON. Este número indica la versión de la interfaz y la lógica interna del nodo.

*   **Incremento de `typeVersion`**: Generalmente, `typeVersion` se incrementa cuando hay cambios significativos en el nodo que podrían romper la compatibilidad con versiones anteriores (ej. cambio de nombres de parámetros, eliminación de funcionalidades, cambios en la estructura de entrada/salida).
*   **Compatibilidad hacia atrás**: n8n intenta mantener la compatibilidad hacia atrás siempre que sea posible, pero en algunos casos, una actualización de `typeVersion` puede requerir ajustes manuales en los workflows existentes.

### Implicaciones de Compatibilidad
1.  **Actualizaciones de n8n**: Al actualizar tu instancia de n8n a una nueva versión, es posible que algunos nodos en tus workflows se actualicen automáticamente a una nueva `typeVersion`. n8n suele manejar estas migraciones, pero es importante revisar los workflows después de una actualización mayor.
2.  **Workflows importados/exportados**:
    *   Si exportas un workflow de una instancia de n8n con nodos de `typeVersion` más reciente e intentas importarlo en una instancia más antigua, es probable que el workflow no funcione correctamente o que los nodos aparezcan como "desconocidos".
    *   Siempre es recomendable que las instancias de n8n que comparten workflows estén en versiones similares para evitar problemas de compatibilidad.
3.  **Nodos personalizados**: Si desarrollas nodos personalizados, debes gestionar cuidadosamente su `typeVersion`.
    *   Incrementa la `typeVersion` solo cuando los cambios sean incompatibles con versiones anteriores.
    *   Proporciona notas de migración claras si los usuarios necesitan actualizar sus workflows.

### Mejores Prácticas
*   **Pruebas en entorno de desarrollo**: Antes de desplegar actualizaciones de n8n o nuevos workflows en producción, pruébalos exhaustivamente en un entorno de desarrollo para detectar cualquier problema de compatibilidad.
*   **Control de versiones de workflows**: Utiliza un sistema de control de versiones (Git) para tus archivos de workflow JSON. Esto te permite revertir a versiones anteriores si una actualización causa problemas.
*   **Documentación de cambios**: Mantén un registro de los cambios en los nodos y sus `typeVersion` para entender el impacto en tus workflows.
*   **Mantener n8n actualizado**: Aunque las actualizaciones pueden introducir cambios en `typeVersion`, mantener tu instancia de n8n actualizada te asegura tener acceso a las últimas funcionalidades, mejoras de rendimiento y parches de seguridad.

---

## 📚 18. RECURSOS ADICIONALES

Para profundizar en el uso de n8n y mantenerse al día con las últimas novedades, aquí tienes una lista de recursos útiles:

*   **Documentación Oficial de n8n**: La fuente más completa y actualizada para aprender sobre nodos, conceptos y funcionalidades de n8n.
    *   [Docs n8n](https://docs.n8n.io/)
*   **Comunidad n8n**: Un foro activo donde puedes hacer preguntas, compartir conocimientos y encontrar soluciones a problemas comunes.
    *   [Comunidad n8n](https://community.n8n.io/)
*   **Blog de n8n**: Artículos, tutoriales y casos de uso sobre n8n.
    *   [Blog n8n](https://n8n.io/blog/)
*   **Canal de YouTube de n8n**: Tutoriales en video, demostraciones y webinars.
    *   [YouTube n8n](https://www.youtube.com/c/n8n_io)
*   **Repositorio GitHub de n8n**: Acceso al código fuente, issues y contribuciones.
    *   [GitHub n8n](https://github.com/n8n-io/n8n)
*   **Tutoriales Avanzados y Casos de Uso**:
    *   Busca en la comunidad o en el blog ejemplos de workflows complejos y soluciones a problemas específicos.
    *   Plataformas como Udemy o Coursera pueden ofrecer cursos sobre automatización con n8n.

---

## ❓ 19. PREGUNTAS FRECUENTES (FAQ)

Esta sección aborda algunas de las preguntas más comunes al trabajar con n8n, proporcionando respuestas rápidas y soluciones a problemas frecuentes.

### 1. ¿Por qué mi workflow no se activa?
*   **Verifica el Trigger**: Asegúrate de que el nodo trigger esté configurado correctamente (ej. el `path` del webhook es el correcto, el `scheduleTrigger` tiene una hora válida).
*   **Estado del Workflow**: Confirma que el workflow esté "activo" (toggle verde en la UI de n8n).
*   **Conexiones**: Revisa que el trigger esté conectado a al menos un nodo de salida.
*   **Logs de Ejecución**: Consulta los logs de ejecución en n8n para ver si hay errores o si el trigger se está activando pero el flujo se detiene en un nodo posterior.

### 2. ¿Cómo puedo depurar un workflow?
*   **Modo de Prueba**: Ejecuta el workflow en "modo de prueba" para ver el flujo de datos entre nodos.
*   **Nodos `Set` y `Code`**: Inserta nodos `Set` para inspeccionar valores de variables en puntos específicos, o usa el nodo `Code` con `console.log()` para depurar.
*   **Logs de n8n**: Revisa los logs de la instancia de n8n para errores a nivel de sistema o de nodos.
*   **Puntos de Interrupción**: En la UI de n8n, puedes establecer puntos de interrupción en los nodos para pausar la ejecución y examinar los datos.

### 3. ¿Qué hago si un nodo devuelve un error "Invalid Type"?
*   **Revisa `typeVersion`**: Asegúrate de que el `typeVersion` del nodo en tu workflow coincida con la versión esperada por tu instancia de n8n.
*   **Prefijo `n8n-nodes-base.`**: Confirma que el tipo de nodo use el prefijo correcto (`n8n-nodes-base.`). Los tipos como `@n8n/n8n-nodes-langchain.*` son inválidos.
*   **Parámetros Requeridos**: Verifica que todos los parámetros requeridos para ese nodo estén presentes y tengan el formato correcto. Consulta la documentación del nodo o la sección "CAMPOS REQUERIDOS POR NODO" de este documento.

### 4. ¿Cómo puedo manejar grandes volúmenes de datos?
*   **`Split In Batches`**: Utiliza el nodo `Split In Batches` para procesar los datos en grupos más pequeños, reduciendo la carga de memoria y las llamadas a APIs.
*   **Filtrado y Reducción**: Elimina ítems o campos innecesarios con nodos `Filter` o `Item Lists` para optimizar el flujo de datos.
*   **Base de Datos Externa**: Para persistencia de grandes volúmenes, usa una base de datos externa (PostgreSQL) en lugar de SQLite.

### 5. ¿Es seguro almacenar credenciales en n8n?
*   Sí, n8n está diseñado para almacenar credenciales de forma segura. Se recomienda encarecidamente usar el sistema de credenciales de n8n en lugar de codificar valores directamente en los workflows.
*   Para mayor seguridad en entornos de producción, considera integrar n8n con un vault de secretos externo.

### 6. ¿Cómo puedo hacer que mi workflow sea más rápido?
*   **Optimización de Consultas**: Si interactúas con bases de datos o APIs, optimiza tus consultas para que devuelvan solo los datos necesarios.
*   **Procesamiento Asíncrono**: Para tareas que no requieren una respuesta inmediata, considera usar colas de mensajes o ejecutar sub-workflows de forma asíncrona.
*   **Reducir Nodos Innecesarios**: Cada nodo añade una pequeña sobrecarga. Simplifica tu lógica y elimina pasos redundantes.
*   **Recursos del Servidor**: Asegúrate de que tu instancia de n8n tenga suficientes recursos de CPU y memoria.

### 7. ¿Puedo usar código Python en n8n?
*   Sí, el nodo `Code` soporta tanto JavaScript como Python. Puedes seleccionar el lenguaje en los parámetros del nodo.
*   Asegúrate de que tu entorno n8n tenga las dependencias de Python necesarias si usas librerías externas.

---

## 🖼️ 20. DIAGRAMAS DE FLUJO Y VISUALIZACIONES

Para mejorar la comprensión de los workflows complejos y las interacciones entre nodos, la inclusión de diagramas de flujo y otras visualizaciones es invaluable.

### Beneficios de las Visualizaciones
*   **Claridad**: Simplifican la comprensión de lógicas complejas y flujos de datos.
*   **Depuración**: Ayudan a identificar rápidamente cuellos de botella o puntos de fallo.
*   **Colaboración**: Facilitan la comunicación entre equipos técnicos y no técnicos.
*   **Documentación**: Complementan la descripción textual, ofreciendo una vista rápida del diseño del workflow.

### Herramientas Sugeridas para Diagramas
1.  **Draw.io / diagrams.net**: Una herramienta gratuita y de código abierto para crear diagramas de flujo, UML, diagramas de red y más. Es compatible con muchos formatos y se puede integrar con Google Drive, Dropbox, etc.
2.  **Lucidchart**: Una herramienta de diagramación basada en la web con una interfaz intuitiva y una amplia biblioteca de formas. Ideal para equipos.
3.  **Mermaid**: Una herramienta de marcado basada en texto que permite crear diagramas y diagramas de flujo usando sintaxis Markdown-like. Puede ser renderizado directamente en documentos Markdown.
    *   **Ejemplo de Mermaid (Diagrama de Flujo Simple)**:
        ```mermaid
        graph TD;
            A[Webhook] --> B{Condición IF};
            B -- Verdadero --> C[Procesar Datos];
            B -- Falso --> D[Notificar Error];
            C --> E[Enviar Email];
            D --> E;
        ```
4.  **Excalidraw**: Una pizarra virtual de código abierto que permite crear diagramas con un estilo dibujado a mano. Ideal para bocetos rápidos y colaboración.

### Tipos de Diagramas Útiles para n8n
*   **Diagramas de Flujo de Workflow**: Muestran la secuencia de nodos y las decisiones lógicas.
*   **Diagramas de Flujo de Datos**: Ilustran cómo los datos se transforman y se mueven entre los nodos.
*   **Diagramas de Arquitectura**: Si n8n se integra con múltiples sistemas, un diagrama de arquitectura puede mostrar la visión general de la infraestructura.
*   **Diagramas de Estado**: Para workflows con estados complejos o que interactúan con máquinas de estado.

### Cómo Integrar Visualizaciones en la Documentación
*   **Imágenes**: Exporta los diagramas como imágenes (PNG, SVG) e insértalas en el documento Markdown.
*   **Enlaces**: Si utilizas herramientas en línea, proporciona enlaces directos a los diagramas editables.
*   **Mermaid en Markdown**: Si tu visor de Markdown soporta Mermaid, puedes incrustar los diagramas directamente en el texto.

La inclusión de estas visualizaciones hará que el documento sea mucho más accesible y fácil de entender para cualquier persona que trabaje con workflows de n8n.

---

## 📋 21. NODOS ADICIONALES POR CATEGORÍA

Esta sección expande las categorías existentes con nodos adicionales identificados en la investigación, proporcionando una cobertura más completa de las integraciones disponibles en n8n.

### 🔥 TRIGGER NODES ADICIONALES
- `n8n-nodes-base.formTrigger` - Formularios web
- `n8n-nodes-base.emailReadImap` - Lectura de emails IMAP
- `n8n-nodes-base.rss` - Feeds RSS
- `n8n-nodes-base.mqttTrigger` - MQTT triggers
- `n8n-nodes-base.webhook` - Webhooks HTTP
- `n8n-nodes-base.telegramTrigger` - Triggers de Telegram
- `n8n-nodes-base.slackTrigger` - Triggers de Slack
- `n8n-nodes-base.githubTrigger` - Eventos de GitHub
- `n8n-nodes-base.jiraTrigger` - Eventos de Jira
- `n8n-nodes-base.salesforceTrigger` - Eventos de Salesforce
- `n8n-nodes-base.hubspotTrigger` - Eventos de HubSpot
- `n8n-nodes-base.airtableTrigger` - Eventos de Airtable
- `n8n-nodes-base.notionTrigger` - Eventos de Notion
- `n8n-nodes-base.googleCalendarTrigger` - Eventos de Google Calendar
- `n8n-nodes-base.microsoftOutlookTrigger` - Eventos de Outlook

### ⚡ CORE NODES ADICIONALES
- `n8n-nodes-base.respondToWebhook` - Responder a webhooks
- `n8n-nodes-base.function` - Función JavaScript (deprecated)
- `n8n-nodes-base.edit` - Editar datos
- `n8n-nodes-base.noOp` - No operación
- `n8n-nodes-base.stopAndError` - Detener con error
- `n8n-nodes-base.aggregate` - Agregar datos
- `n8n-nodes-base.summarize` - Resumir datos
- `n8n-nodes-base.limit` - Limitar elementos
- `n8n-nodes-base.removeDuplicates` - Eliminar duplicados
- `n8n-nodes-base.splitOut` - Dividir elementos
- `n8n-nodes-base.itemLists` - Operaciones con listas
- `n8n-nodes-base.filter` - Filtrar datos
- `n8n-nodes-base.sort` - Ordenar datos
- `n8n-nodes-base.renameKeys` - Renombrar claves
- `n8n-nodes-base.convertToFile` - Convertir a archivo

### 📊 DATA TRANSFORMATION NODES ADICIONALES
- `n8n-nodes-base.spreadsheetFile` - Archivos de hoja de cálculo
- `n8n-nodes-base.xml` - Datos XML
- `n8n-nodes-base.html` - Contenido HTML
- `n8n-nodes-base.markdown` - Contenido Markdown
- `n8n-nodes-base.compression` - Comprimir/descomprimir
- `n8n-nodes-base.extractFromFile` - Extraer de archivos
- `n8n-nodes-base.crypto` - Operaciones criptográficas
- `n8n-nodes-base.hash` - Generar hashes
- `n8n-nodes-base.dateTime` - Fechas y horarios
- `n8n-nodes-base.editImage` - Editar imágenes
- `n8n-nodes-base.convertToFile` - Convertir a archivo
- `n8n-nodes-base.spreadsheetFile` - Archivos de hoja de cálculo
- `n8n-nodes-base.xml` - Datos XML
- `n8n-nodes-base.html` - Contenido HTML
- `n8n-nodes-base.markdown` - Contenido Markdown

### 🗄️ DATABASE NODES ADICIONALES
- `n8n-nodes-base.postgres` - PostgreSQL
- `n8n-nodes-base.mongodb` - MongoDB
- `n8n-nodes-base.redis` - Redis
- `n8n-nodes-base.microsoftSql` - SQL Server
- `n8n-nodes-base.questDb` - QuestDB
- `n8n-nodes-base.cockroachDb` - CockroachDB
- `n8n-nodes-base.timescaleDb` - TimescaleDB
- `n8n-nodes-base.clickhouse` - ClickHouse
- `n8n-nodes-base.snowflake` - Snowflake
- `n8n-nodes-base.bigquery` - Google BigQuery
- `n8n-nodes-base.redshift` - Amazon Redshift
- `n8n-nodes-base.dynamodb` - Amazon DynamoDB

### 📱 COMMUNICATION NODES ADICIONALES
- `n8n-nodes-base.emailSend` - Enviar emails (SMTP)
- `n8n-nodes-base.emailReadImap` - Leer emails (IMAP)
- `n8n-nodes-base.discord` - Discord
- `n8n-nodes-base.microsoftTeams` - Microsoft Teams
- `n8n-nodes-base.whatsApp` - WhatsApp Business
- `n8n-nodes-base.twilio` - Twilio
- `n8n-nodes-base.messageBird` - MessageBird
- `n8n-nodes-base.sendGrid` - SendGrid
- `n8n-nodes-base.mailgun` - Mailgun
- `n8n-nodes-base.postmark` - Postmark
- `n8n-nodes-base.amazonSes` - Amazon SES
- `n8n-nodes-base.pushover` - Pushover
- `n8n-nodes-base.pushbullet` - Pushbullet

### 💼 BUSINESS APPLICATION NODES ADICIONALES
- `n8n-nodes-base.pipedrive` - Pipedrive
- `n8n-nodes-base.zohoCrm` - Zoho CRM
- `n8n-nodes-base.zendesk` - Zendesk
- `n8n-nodes-base.intercom` - Intercom
- `n8n-nodes-base.freshdesk` - Freshdesk
- `n8n-nodes-base.helpscout` - Help Scout
- `n8n-nodes-base.teamwork` - Teamwork
- `n8n-nodes-base.clickup` - ClickUp
- `n8n-nodes-base.trello` - Trello
- `n8n-nodes-base.asana` - Asana
- `n8n-nodes-base.monday` - Monday.com
- `n8n-nodes-base.wrike` - Wrike
- `n8n-nodes-base.jiraSoftware` - Jira Software
- `n8n-nodes-base.gitlab` - GitLab
- `n8n-nodes-base.bitbucket` - Bitbucket
- `n8n-nodes-base.jenkins` - Jenkins
- `n8n-nodes-base.circleci` - CircleCI
- `n8n-nodes-base.github` - GitHub
- `n8n-nodes-base.vercel` - Vercel
- `n8n-nodes-base.netlify` - Netlify

### 🛠️ UTILITY NODES ADICIONALES
- `n8n-nodes-base.googleDrive` - Google Drive
- `n8n-nodes-base.dropbox` - Dropbox
- `n8n-nodes-base.box` - Box
- `n8n-nodes-base.oneDrive` - OneDrive
- `n8n-nodes-base.awsS3` - Amazon S3
- `n8n-nodes-base.googleCloudStorage` - Google Cloud Storage
- `n8n-nodes-base.azureBlobStorage` - Azure Blob Storage
- `n8n-nodes-base.ftp` - FTP
- `n8n-nodes-base.sftp` - SFTP
- `n8n-nodes-base.ssh` - SSH
- `n8n-nodes-base.pingdom` - Pingdom
- `n8n-nodes-base.uptimeRobot` - Uptime Robot
- `n8n-nodes-base.newRelic` - New Relic
- `n8n-nodes-base.datadog` - Datadog
- `n8n-nodes-base.sentry` - Sentry

### 🏢 ENTERPRISE NODES ADICIONALES
- `n8n-nodes-base.microsoftOutlook` - Outlook
- `n8n-nodes-base.microsoftOneDrive` - OneDrive
- `n8n-nodes-base.microsoftExcel` - Excel
- `n8n-nodes-base.microsoftTeams` - Teams
- `n8n-nodes-base.microsoftDynamics` - Dynamics 365
- `n8n-nodes-base.salesforce` - Salesforce
- `n8n-nodes-base.oracle` - Oracle
- `n8n-nodes-base.sap` - SAP
- `n8n-nodes-base.workday` - Workday
- `n8n-nodes-base.adp` - ADP
- `n8n-nodes-base.bambooHr` - BambooHR
- `n8n-nodes-base.greenhouse` - Greenhouse
- `n8n-nodes-base.lever` - Lever
- `n8n-nodes-base.serviceNow` - ServiceNow
- `n8n-nodes-base.jiraServiceDesk` - Jira Service Desk

### 🎨 CREATIVE AND CONTENT NODES ADICIONALES
- `n8n-nodes-base.medium` - Medium
- `n8n-nodes-base.devto` - Dev.to
- `n8n-nodes-base.hashnode` - Hashnode
- `n8n-nodes-base.ghost` - Ghost
- `n8n-nodes-base.strapi` - Strapi
- `n8n-nodes-base.contentful` - Contentful
- `n8n-nodes-base.sanity` - Sanity
- `n8n-nodes-base.prismic` - Prismic
- `n8n-nodes-base.youtube` - YouTube
- `n8n-nodes-base.vimeo` - Vimeo
- `n8n-nodes-base.tiktok` - TikTok
- `n8n-nodes-base.instagram` - Instagram
- `n8n-nodes-base.facebook` - Facebook
- `n8n-nodes-base.twitter` - Twitter (X)
- `n8n-nodes-base.linkedin` - LinkedIn
- `n8n-nodes-base.pinterest` - Pinterest

### 📋 FORM AND SURVEY NODES ADICIONALES
- `n8n-nodes-base.surveyMonkey` - SurveyMonkey
- `n8n-nodes-base.jotform` - JotForm
- `n8n-nodes-base.googleForms` - Google Forms
- `n8n-nodes-base.microsoftForms` - Microsoft Forms
- `n8n-nodes-base.limeSurvey` - LimeSurvey
- `n8n-nodes-base.qualtrics` - Qualtrics
- `n8n-nodes-base.surveyGizmo` - SurveyGizmo
- `n8n-nodes-base.formstack` - Formstack
- `n8n-nodes-base.wufoo` - Wufoo
- `n8n-nodes-base.cognitoForms` - Cognito Forms

### 🤖 AI AND MACHINE LEARNING NODES
- `n8n-nodes-base.openai` - OpenAI
- `n8n-nodes-base.anthropic` - Anthropic
- `n8n-nodes-base.googleGemini` - Google Gemini
- `n8n-nodes-base.huggingface` - Hugging Face
- `n8n-nodes-base.replicate` - Replicate
- `n8n-nodes-base.stabilityAi` - Stability AI
- `n8n-nodes-base.midjourney` - Midjourney
- `n8n-nodes-base.cohere` - Cohere
- `n8n-nodes-base.ai21` - AI21 Labs
- `n8n-nodes-base.anyscale` - Anyscale
- `n8n-nodes-base.togetherAi` - Together AI
- `n8n-nodes-base.runway` - Runway ML
- `n8n-nodes-base.elevenlabs` - ElevenLabs
- `n8n-nodes-base.assemblyai` - AssemblyAI
- `n8n-nodes-base.deepgram` - Deepgram

### 🔧 DEVELOPMENT AND DEVOPS NODES
- `n8n-nodes-base.docker` - Docker
- `n8n-nodes-base.kubernetes` - Kubernetes
- `n8n-nodes-base.terraform` - Terraform
- `n8n-nodes-base.ansible` - Ansible
- `n8n-nodes-base.puppet` - Puppet
- `n8n-nodes-base.chef` - Chef
- `n8n-nodes-base.git` - Git
- `n8n-nodes-base.github` - GitHub
- `n8n-nodes-base.gitlab` - GitLab
- `n8n-nodes-base.bitbucket` - Bitbucket
- `n8n-nodes-base.jenkins` - Jenkins
- `n8n-nodes-base.circleci` - CircleCI
- `n8n-nodes-base.githubActions` - GitHub Actions
- `n8n-nodes-base.vercel` - Vercel
- `n8n-nodes-base.netlify` - Netlify
- `n8n-nodes-base.render` - Render
- `n8n-nodes-base.digitalocean` - DigitalOcean
- `n8n-nodes-base.aws` - AWS
- `n8n-nodes-base.googleCloud` - Google Cloud
- `n8n-nodes-base.azure` - Microsoft Azure

### 📊 ANALYTICS AND MONITORING NODES
- `n8n-nodes-base.googleAnalytics` - Google Analytics
- `n8n-nodes-base.mixpanel` - Mixpanel
- `n8n-nodes-base.amplitude` - Amplitude
- `n8n-nodes-base.segment` - Segment
- `n8n-nodes-base.heap` - Heap
- `n8n-nodes-base.hotjar` - Hotjar
- `n8n-nodes-base.fullstory` - FullStory
- `n8n-nodes-base.logrocket` - LogRocket
- `n8n-nodes-base.sentry` - Sentry
- `n8n-nodes-base.bugsnag` - Bugsnag
- `n8n-nodes-base.rollbar` - Rollbar
- `n8n-nodes-base.newRelic` - New Relic
- `n8n-nodes-base.datadog` - Datadog
- `n8n-nodes-base.grafana` - Grafana
- `n8n-nodes-base.elasticsearch` - Elasticsearch
- `n8n-nodes-base.kibana` - Kibana

### 💰 FINANCE AND PAYMENT NODES
- `n8n-nodes-base.stripe` - Stripe
- `n8n-nodes-base.paypal` - PayPal
- `n8n-nodes-base.braintree` - Braintree
- `n8n-nodes-base.authorizeNet` - Authorize.Net
- `n8n-nodes-base.adyen` - Adyen
- `n8n-nodes-base.checkout` - Checkout.com
- `n8n-nodes-base.square` - Square
- `n8n-nodes-base.quickbooks` - QuickBooks
- `n8n-nodes-base.xero` - Xero
- `n8n-nodes-base.freshbooks` - FreshBooks
- `n8n-nodes-base.zendesk` - Zendesk
- `n8n-nodes-base.intercom` - Intercom

### 📅 PRODUCTIVITY AND COLLABORATION NODES
- `n8n-nodes-base.slack` - Slack
- `n8n-nodes-base.microsoftTeams` - Microsoft Teams
- `n8n-nodes-base.discord` - Discord
- `n8n-nodes-base.zoom` - Zoom
- `n8n-nodes-base.googleMeet` - Google Meet
- `n8n-nodes-base.miro` - Miro
- `n8n-nodes-base.figma` - Figma
- `n8n-nodes-base.adobeCreativeCloud` - Adobe Creative Cloud
- `n8n-nodes-base.canva` - Canva
- `n8n-nodes-base.notion` - Notion
- `n8n-nodes-base.evernote` - Evernote
- `n8n-nodes-base.onenote` - OneNote
- `n8n-nodes-base.googleDocs` - Google Docs
- `n8n-nodes-base.googleSlides` - Google Slides
- `n8n-nodes-base.googleSheets` - Google Sheets

### 🛍️ E-COMMERCE NODES
- `n8n-nodes-base.shopify` - Shopify
- `n8n-nodes-base.woocommerce` - WooCommerce
- `n8n-nodes-base.bigcommerce` - BigCommerce
- `n8n-nodes-base.magento` - Magento
- `n8n-nodes-base.opencart` - OpenCart
- `n8n-nodes-base.prestashop` - PrestaShop
- `n8n-nodes-base.squarespace` - Squarespace
- `n8n-nodes-base.wix` - Wix
- `n8n-nodes-base.weebly` - Weebly
- `n8n-nodes-base.ecwid` - Ecwid
- `n8n-nodes-base.gumroad` - Gumroad
- `n8n-nodes-base.teachable` - Teachable
- `n8n-nodes-base.kajabi` - Kajabi
- `n8n-nodes-base.podia` - Podia

### 📞 TELECOMMUNICATIONS NODES
- `n8n-nodes-base.twilio` - Twilio
- `n8n-nodes-base.messageBird` - MessageBird
- `n8n-nodes-base.sinch` - Sinch
- `n8n-nodes-base.nexmo` - Nexmo (Vonage)
- `n8n-nodes-base.plivo` - Plivo
- `n8n-nodes-base.bandwidth` - Bandwidth
- `n8n-nodes-base.telnyx` - Telnyx
- `n8n-nodes-base.signalwire` - SignalWire
- `n8n-nodes-base.flowroute` - Flowroute
- `n8n-nodes-base.didww` - DIDWW

### 🌐 WEB AND API NODES
- `n8n-nodes-base.httpRequest` - HTTP Request
- `n8n-nodes-base.graphql` - GraphQL
- `n8n-nodes-base.restApi` - REST API
- `n8n-nodes-base.soap` - SOAP
- `n8n-nodes-base.openapi` - OpenAPI
- `n8n-nodes-base.swagger` - Swagger
- `n8n-nodes-base.postman` - Postman
- `n8n-nodes-base.insomnia` - Insomnia
- `n8n-nodes-base.hoppscotch` - Hoppscotch
- `n8n-nodes-base.webhookSite` - Webhook.site
- `n8n-nodes-base.requestBin` - RequestBin
- `n8n-nodes-base.mockaroo` - Mockaroo
- `n8n-nodes-base.jsonPlaceholder` - JSONPlaceholder
- `n8n-nodes-base.reqres` - ReqRes
- `n8n-nodes-base.httpbin` - HTTPBin

### 📈 MARKETING AND ADVERTISING NODES
- `n8n-nodes-base.mailchimp` - Mailchimp
- `n8n-nodes-base.sendinblue` - Sendinblue
- `n8n-nodes-base.constantContact` - Constant Contact
- `n8n-nodes-base.activeCampaign` - ActiveCampaign
- `n8n-nodes-base.klaviyo` - Klaviyo
- `n8n-nodes-base.omnisend` - Omnisend
- `n8n-nodes-base.customerIo` - Customer.io
- `n8n-nodes-base.drip` - Drip
- `n8n-nodes-base.convertkit` - ConvertKit
- `n8n-nodes-base.mailerlite` - MailerLite
- `n8n-nodes-base.getresponse` - GetResponse
- `n8n-nodes-base.campaignMonitor` - Campaign Monitor
- `n8n-nodes-base.mautic` - Mautic
- `n8n-nodes-base.hubspot` - HubSpot
- `n8n-nodes-base.salesforceMarketingCloud` - Salesforce Marketing Cloud
- `n8n-nodes-base.marketo` - Marketo
- `n8n-nodes-base.pardot` - Pardot
- `n8n-nodes-base.googleAds` - Google Ads
- `n8n-nodes-base.facebookAds` - Facebook Ads
- `n8n-nodes-base.twitterAds` - Twitter Ads
- `n8n-nodes-base.linkedinAds` - LinkedIn Ads
- `n8n-nodes-base.tiktokAds` - TikTok Ads
- `n8n-nodes-base.snapchatAds` - Snapchat Ads
- `n8n-nodes-base.pinterestAds` - Pinterest Ads
- `n8n-nodes-base.instagramAds` - Instagram Ads

### 🎯 HR AND RECRUITMENT NODES
- `n8n-nodes-base.greenhouse` - Greenhouse
- `n8n-nodes-base.lever` - Lever
- `n8n-nodes-base.workday` - Workday
- `n8n-nodes-base.bambooHr` - BambooHR
- `n8n-nodes-base.adp` - ADP
- `n8n-nodes-base.gusto` - Gusto
- `n8n-nodes-base.breezy` - Breezy
- `n8n-nodes-base.jobvite` - Jobvite
- `n8n-nodes-base.smartrecruiters` - SmartRecruiters
- `n8n-nodes-base.talentlyft` - TalentLyft
- `n8n-nodes-base.workable` - Workable
- `n8n-nodes-base.recruiterbox` - Recruiterbox
- `n8n-nodes-base.teamtailor` - Teamtailor
- `n8n-nodes-base.ashby` - Ashby
- `n8n-nodes-base.personio` - Personio

### 🏥 HEALTHCARE NODES
- `n8n-nodes-base.epic` - Epic Systems
- `n8n-nodes-base.cerner` - Cerner
- `n8n-nodes-base.meditech` - MEDITECH
- `n8n-nodes-base.allscripts` - Allscripts
- `n8n-nodes-base.nextgen` - NextGen Healthcare
- `n8n-nodes-base.athenahealth` - athenahealth
- `n8n-nodes-base.greenway` - Greenway Health
- `n8n-nodes-base.eclinicalworks` - eClinicalWorks
- `n8n-nodes-base.practicefusion` - Practice Fusion
- `n8n-nodes-base.doximity` - Doximity
- `n8n-nodes-base.healthgrades` - Healthgrades
- `n8n-nodes-base.zocdoc` - Zocdoc

### 🏫 EDUCATION NODES
- `n8n-nodes-base.canvas` - Canvas LMS
- `n8n-nodes-base.blackboard` - Blackboard
- `n8n-nodes-base.moodle` - Moodle
- `n8n-nodes-base.schoology` - Schoology
- `n8n-nodes-base.googleClassroom` - Google Classroom
- `n8n-nodes-base.microsoftTeamsEducation` - Microsoft Teams for Education
- `n8n-nodes-base.zoomEducation` - Zoom for Education
- `n8n-nodes-base.kahoot` - Kahoot!
- `n8n-nodes-base.quizlet` - Quizlet
- `n8n-nodes-base.edmodo` - Edmodo
- `n8n-nodes-base.remind` - Remind
- `n8n-nodes-base.classdojo` - ClassDojo
- `n8n-nodes-base.seesaw` - Seesaw
- `n8n-nodes-base.padlet` - Padlet
- `n8n-nodes-base.pearson` - Pearson
- `n8n-nodes-base.khanAcademy` - Khan Academy

### 🏛️ GOVERNMENT AND PUBLIC SECTOR NODES
- `n8n-nodes-base.usps` - USPS
- `n8n-nodes-base.ups` - UPS
- `n8n-nodes-base.fedex` - FedEx
- `n8n-nodes-base.dhl` - DHL
- `n8n-nodes-base.irs` - IRS
- `n8n-nodes-base.ssa` - Social Security Administration
- `n8n-nodes-base.va` - Department of Veterans Affairs
- `n8n-nodes-base.cdc` - Centers for Disease Control
- `n8n-nodes-base.fda` - Food and Drug Administration
- `n8n-nodes-base.nih` - National Institutes of Health
- `n8n-nodes-base.nasa` - NASA
- `n8n-nodes-base.noaa` - National Oceanic and Atmospheric Administration
- `n8n-nodes-base.usgs` - United States Geological Survey
- `n8n-nodes-base.bls` - Bureau of Labor Statistics
- `n8n-nodes-base.census` - United States Census Bureau

### 🎮 GAMING AND ENTERTAINMENT NODES
- `n8n-nodes-base.steam` - Steam
- `n8n-nodes-base.epicGames` - Epic Games
- `n8n-nodes-base.discord` - Discord
- `n8n-nodes-base.twitch` - Twitch
- `n8n-nodes-base.youtubeGaming` - YouTube Gaming
- `n8n-nodes-base.mixer` - Mixer
- `n8n-nodes-base.streamlabs` - Streamlabs
- `n8n-nodes-base.obs` - OBS Studio
- `n8n-nodes-base.elgato` - Elgato
- `n8n-nodes-base.razer` - Razer
- `n8n-nodes-base.logitech` - Logitech
- `n8n-nodes-base.corsair` - Corsair
- `n8n-nodes-base.asus` - ASUS ROG
- `n8n-nodes-base.msi` - MSI
- `n8n-nodes-base.gigabyte` - Gigabyte
- `n8n-nodes-base.evga` - EVGA

### 🏠 SMART HOME AND IoT NODES
- `n8n-nodes-base.philipsHue` - Philips Hue
- `n8n-nodes-base.nest` - Google Nest
- `n8n-nodes-base.ring` - Ring
- `n8n-nodes-base.arlo` - Arlo
- `n8n-nodes-base.wyze` - Wyze
- `n8n-nodes-base.ecobee` - Ecobee
- `n8n-nodes-base.honeywell` - Honeywell
- `n8n-nodes-base.sonos` - Sonos
- `n8n-nodes-base.amazonAlexa` - Amazon Alexa
- `n8n-nodes-base.googleHome` - Google Home
- `n8n-nodes-base.appleHomekit` - Apple HomeKit
- `n8n-nodes-base.samsungSmartthings` - Samsung SmartThings
- `n8n-nodes-base.ifttt` - IFTTT
- `n8n-nodes-base.zapier` - Zapier
- `n8n-nodes-base.integromat` - Integromat (Make)
- `n8n-nodes-base.automationanywhere` - Automation Anywhere
- `n8n-nodes-base.uipath` - UiPath
- `n8n-nodes-base.microsoftPowerAutomate` - Microsoft Power Automate
- `n8n-nodes-base.googleWorkflows` - Google Workflows

### 📊 BUSINESS INTELLIGENCE NODES
- `n8n-nodes-base.tableau` - Tableau
- `n8n-nodes-base.powerbi` - Power BI
- `n8n-nodes-base.qlik` - Qlik
- `n8n-nodes-base.looker` - Looker
- `n8n-nodes-base.sisense` - Sisense
- `n8n-nodes-base.domo` - Domo
- `n8n-nodes-base.periscope` - Periscope
- `n8n-nodes-base.mode` - Mode Analytics
- `n8n-nodes-base.metabase` - Metabase
- `n8n-nodes-base.redash` - Redash
- `n8n-nodes-base.superset` - Apache Superset
- `n8n-nodes-base.lookerStudio` - Looker Studio
- `n8n-nodes-base.dataStudio` - Google Data Studio

### 🔒 SECURITY AND COMPLIANCE NODES
- `n8n-nodes-base.okta` - Okta
- `n8n-nodes-base.auth0` - Auth0
- `n8n-nodes-base.firebaseAuth` - Firebase Auth
- `n8n-nodes-base.awsCognito` - AWS Cognito
- `n8n-nodes-base.azureAd` - Azure Active Directory
- `n8n-nodes-base.googleIdentity` - Google Identity
- `n8n-nodes-base.pingIdentity` - Ping Identity
- `n8n-nodes-base.onelogin` - OneLogin
- `n8n-nodes-base.jumpcloud` - JumpCloud
- `n8n-nodes-base.lastpass` - LastPass
- `n8n-nodes-base.bitwarden` - Bitwarden
- `n8n-nodes-base.keeper` - Keeper
- `n8n-nodes-base.dashlane` - Dashlane
- `n8n-nodes-base.nordpass` - NordPass
- `n8n-nodes-base.protonpass` - Proton Pass

### 🌍 GEOSPATIAL AND MAPPING NODES
- `n8n-nodes-base.googleMaps` - Google Maps
- `n8n-nodes-base.mapbox` - Mapbox
- `n8n-nodes-base.hereMaps` - HERE Maps
- `n8n-nodes-base.tomtom` - TomTom
- `n8n-nodes-base.esri` - Esri ArcGIS
- `n8n-nodes-base.openStreetMap` - OpenStreetMap
- `n8n-nodes-base.bingMaps` - Bing Maps
- `n8n-nodes-base.yelp` - Yelp
- `n8n-nodes-base.foursquare` - Foursquare
- `n8n-nodes-base.tripadvisor` - TripAdvisor
- `n8n-nodes-base.booking` - Booking.com
- `n8n-nodes-base.airbnb` - Airbnb
- `n8n-nodes-base.expedia` - Expedia
- `n8n-nodes-base.kayak` - Kayak
- `n8n-nodes-base.priceline` - Priceline

### 📈 STOCK MARKET AND FINANCE NODES
- `n8n-nodes-base.alphaVantage` - Alpha Vantage
- `n8n-nodes-base.iexCloud` - IEX Cloud
- `n8n-nodes-base.twelveData` - Twelve Data
- `n8n-nodes-base.polygon` - Polygon.io
- `n8n-nodes-base.finnhub` - Finnhub
- `n8n-nodes-base.yahoofinance` - Yahoo Finance
- `n8n-nodes-base.googlefinance` - Google Finance
- `n8n-nodes-base.bloomberg` - Bloomberg
- `n8n-nodes-base.reuters` - Reuters
- `n8n-nodes-base.cnbc` - CNBC
- `n8n-nodes-base.wsj` - Wall Street Journal
- `n8n-nodes-base.ft` - Financial Times
- `n8n-nodes-base.economist` - The Economist
- `n8n-nodes-base.forbes` - Forbes
- `n8n-nodes-base.businessinsider` - Business Insider

### 🎵 MUSIC AND AUDIO NODES
- `n8n-nodes-base.spotify` - Spotify
- `n8n-nodes-base.appleMusic` - Apple Music
- `n8n-nodes-base.deezer` - Deezer
- `n8n-nodes-base.tidal` - Tidal
- `n8n-nodes-base.amazonMusic` - Amazon Music
- `n8n-nodes-base.youtubeMusic` - YouTube Music
- `n8n-nodes-base.soundcloud` - SoundCloud
- `n8n-nodes-base.bandcamp` - Bandcamp
- `n8n-nodes-base.lastfm` - Last.fm
- `n8n-nodes-base.discogs` - Discogs
- `n8n-nodes-base.musicbrainz` - MusicBrainz
- `n8n-nodes-base.shazam` - Shazam
- `n8n-nodes-base.audius` - Audius
- `n8n-nodes-base.resonate` - Resonate
- `n8n-nodes-base.nftmusic` - NFT Music

### 🎬 VIDEO AND STREAMING NODES
- `n8n-nodes-base.youtube` - YouTube
- `n8n-nodes-base.vimeo` - Vimeo
- `n8n-nodes-base.twitch` - Twitch
- `n8n-nodes-base.tiktok` - TikTok
- `n8n-nodes-base.instagram` - Instagram
- `n8n-nodes-base.snapchat` - Snapchat
- `n8n-nodes-base.facebook` - Facebook
- `n8n-nodes-base.twitter` - Twitter (X)
- `n8n-nodes-base.linkedin` - LinkedIn
- `n8n-nodes-base.pinterest` - Pinterest
- `n8n-nodes-base.reddit` - Reddit
- `n8n-nodes-base.tumblr` - Tumblr
- `n8n-nodes-base.medium` - Medium
- `n8n-nodes-base.devto` - Dev.to
- `n8n-nodes-base.hashnode` - Hashnode
- `n8n-nodes-base.substack` - Substack

### 📚 LEARNING MANAGEMENT SYSTEMS
- `n8n-nodes-base.canvas` - Canvas LMS
- `n8n-nodes-base.blackboard` - Blackboard
- `n8n-nodes-base.moodle` - Moodle
- `n8n-nodes-base.schoology` - Schoology
- `n8n-nodes-base.googleClassroom` - Google Classroom
- `n8n-nodes-base.microsoftTeamsEducation` - Microsoft Teams for Education
- `n8n-nodes-base.zoomEducation` - Zoom for Education
- `n8n-nodes-base.coursera` - Coursera
- `n8n-nodes-base.udemy` - Udemy
- `n8n-nodes-base.edx` - edX
- `n8n-nodes-base.khanAcademy` - Khan Academy
- `n8n-nodes-base.duolingo` - Duolingo
- `n8n-nodes-base.babbel` - Babbel
- `n8n-nodes-base.rosettaStone` - Rosetta Stone
- `n8n-nodes-base.busuu` - Busuu

### 🏥 TELEMEDICINE AND HEALTH TECH NODES
- `n8n-nodes-base.doximity` - Doximity
- `n8n-nodes-base.healthgrades` - Healthgrades
- `n8n-nodes-base.zocdoc` - Zocdoc
- `n8n-nodes-base.amwell` - Amwell
- `n8n-nodes-base.teladoc` - Teladoc
- `n8n-nodes-base.livehealth` - LiveHealth
- `n8n-nodes-base.doctorondemand` - Doctor on Demand
- `n8n-nodes-base.forward` - Forward
- `n8n-nodes-base.oneMedical` - One Medical
- `n8n-nodes-base.ioraHealth` - Iora Health
- `n8n-nodes-base.parsleyHealth` - Parsley Health
- `n8n-nodes-base.headspace` - Headspace
- `n8n-nodes-base.calm` - Calm
- `n8n-nodes-base.myfitnesspal` - MyFitnessPal
- `n8n-nodes-base.fitbit` - Fitbit

### 🏭 MANUFACTURING AND SUPPLY CHAIN NODES
- `n8n-nodes-base.oracle` - Oracle
- `n8n-nodes-base.sap` - SAP
- `n8n-nodes-base.microsoftDynamics` - Microsoft Dynamics
- `n8n-nodes-base.epicor` - Epicor
- `n8n-nodes-base.infor` - Infor
- `n8n-nodes-base.jdedwards` - JD Edwards
- `n8n-nodes-base.peoplesoft` - PeopleSoft
- `n8n-nodes-base.workday` - Workday
- `n8n-nodes-base.adp` - ADP
- `n8n-nodes-base.ultipro` - UltiPro
- `n8n-nodes-base.paychex` - Paychex
- `n8n-nodes-base.gusto` - Gusto
- `n8n-nodes-base.bambooHr` - BambooHR
- `n8n-nodes-base.greenhouse` - Greenhouse
- `n8n-nodes-base.lever` - Lever
- `n8n-nodes-base.workable` - Workable

### 🏢 REAL ESTATE NODES
- `n8n-nodes-base.zillow` - Zillow
- `n8n-nodes-base.realtor` - Realtor.com
- `n8n-nodes-base.redfin` - Redfin
- `n8n-nodes-base.trulia` - Trulia
- `n8n-nodes-base.craigslist` - Craigslist
- `n8n-nodes-base.airbnb` - Airbnb
- `n8n-nodes-base.vrbo` - VRBO
- `n8n-nodes-base.booking` - Booking.com
- `n8n-nodes-base.expedia` - Expedia
- `n8n-nodes-base.hotels` - Hotels.com
- `n8n-nodes-base.agoda` - Agoda
- `n8n-nodes-base.kayak` - Kayak
- `n8n-nodes-base.priceline` - Priceline
- `n8n-nodes-base.orbitz` - Orbitz
- `n8n-nodes-base.travelocity` - Travelocity

### 🚗 AUTOMOTIVE NODES
- `n8n-nodes-base.carmax` - CarMax
- `n8n-nodes-base.autotrader` - Autotrader
- `n8n-nodes-base.cars` - Cars.com
- `n8n-nodes-base.edmunds` - Edmunds
- `n8n-nodes-base.kbb` - Kelley Blue Book
- `n8n-nodes-base.nada` - NADA
- `n8n-nodes-base.carfax` - Carfax
- `n8n-nodes-base.autocheck` - AutoCheck
- `n8n-nodes-base.tesla` - Tesla
- `n8n-nodes-base.ford` - Ford
- `n8n-nodes-base.gm` - General Motors
- `n8n-nodes-base.toyota` - Toyota
- `n8n-nodes-base.honda` - Honda
- `n8n-nodes-base.bmw` - BMW
- `n8n-nodes-base.mercedes` - Mercedes-Benz
- `n8n-nodes-base.audi` - Audi

### 🛒 RETAIL AND CONSUMER GOODS NODES
- `n8n-nodes-base.amazon` - Amazon
- `n8n-nodes-base.ebay` - eBay
- `n8n-nodes-base.walmart` - Walmart
- `n8n-nodes-base.target` - Target
- `n8n-nodes-base.bestbuy` - Best Buy
- `n8n-nodes-base.costco` - Costco
- `n8n-nodes-base.homedepot` - Home Depot
- `n8n-nodes-base.lowes` - Lowe's
- `n8n-nodes-base.menards` - Menards
- `n8n-nodes-base.acehardware` - Ace Hardware
- `n8n-nodes-base.traderjoes` - Trader Joe's
- `n8n-nodes-base.wholefoods` - Whole Foods
- `n8n-nodes-base.kroger` - Kroger
- `n8n-nodes-base.publix` - Publix
- `n8n-nodes-base.meijer` - Meijer

### 🏨 HOSPITALITY NODES
- `n8n-nodes-base.marriott` - Marriott
- `n8n-nodes-base.hilton` - Hilton
- `n8n-nodes-base.hyatt` - Hyatt
- `n8n-nodes-base.starwood` - Starwood
- `n8n-nodes-base.ihg` - IHG
- `n8n-nodes-base.wyndham` - Wyndham
- `n8n-nodes-base.choicehotels` - Choice Hotels
- `n8n-nodes-base.bestwestern` - Best Western
- `n8n-nodes-base.holidayinn` - Holiday Inn
- `n8n-nodes-base.daysinn` - Days Inn
- `n8n-nodes-base.super8` - Super 8
- `n8n-nodes-base.motel6` - Motel 6
- `n8n-nodes-base.redroof` - Red Roof Inn
- `n8n-nodes-base.comfortinn` - Comfort Inn
- `n8n-nodes-base.hampton` - Hampton Inn

### 📰 NEWS AND MEDIA NODES
- `n8n-nodes-base.nytimes` - New York Times
- `n8n-nodes-base.washingtonpost` - Washington Post
- `n8n-nodes-base.wsj` - Wall Street Journal
- `n8n-nodes-base.ft` - Financial Times
- `n8n-nodes-base.bbc` - BBC
- `n8n-nodes-base.cnn` - CNN
- `n8n-nodes-base.foxnews` - Fox News
- `n8n-nodes-base.msnbc` - MSNBC
- `n8n-nodes-base.reuters` - Reuters
- `n8n-nodes-base.ap` - Associated Press
- `n8n-nodes-base.bloomberg` - Bloomberg
- `n8n-nodes-base.cnbc` - CNBC
- `n8n-nodes-base.economist` - The Economist
- `n8n-nodes-base.forbes` - Forbes
- `n8n-nodes-base.businessinsider` - Business Insider

### 🎯 SPORTS NODES
- `n8n-nodes-base.espn` - ESPN
- `n8n-nodes-base.nfl` - NFL
- `n8n-nodes-base.nba` - NBA
- `n8n-nodes-base.mlb` - MLB
- `n8n-nodes-base.nhl` - NHL

---

## 🤖 22. LANGCHAIN NODES (NODOS DE IA Y LANGCHAIN)
Nodos especializados para inteligencia artificial, procesamiento de lenguaje natural y aprendizaje automático basados en LangChain.

### 🔥 LANGCHAIN TRIGGER NODES
Nodos de activación específicos para flujos de IA:

- `@n8n/n8n-nodes-langchain.chatTrigger` - Trigger para mensajes de chat
- `@n8n/n8n-nodes-langchain.manualChatTrigger` - Trigger manual para chat

### ⚡ LANGCHAIN CORE NODES
Nodos principales para procesamiento de IA:

#### Modelos de Lenguaje (Language Models)
- `@n8n/n8n-nodes-langchain.lmChatOpenAi` - ChatGPT de OpenAI
- `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` - Google Gemini
- `@n8n/n8n-nodes-langchain.lmChatAnthropic` - Claude de Anthropic
- `@n8n/n8n-nodes-langchain.lmChatMistralCloud` - Mistral AI
- `@n8n/n8n-nodes-langchain.lmChatOpenRouter` - OpenRouter (múltiples modelos)
- `@n8n/n8n-nodes-langchain.lmOpenAi` - Modelos OpenAI legacy
- `@n8n/n8n-nodes-langchain.lmChatCohere` - Cohere
- `@n8n/n8n-nodes-langchain.lmChatReplicate` - Replicate
- `@n8n/n8n-nodes-langchain.lmChatTogetherAi` - Together AI

#### Embeddings
- `@n8n/n8n-nodes-langchain.embeddingsOpenAi` - Embeddings OpenAI
- `@n8n/n8n-nodes-langchain.embeddingsGoogleGemini` - Embeddings Google Gemini
- `@n8n/n8n-nodes-langchain.embeddingsMistralCloud` - Embeddings Mistral
- `@n8n/n8n-nodes-langchain.embeddingsCohere` - Embeddings Cohere
- `@n8n/n8n-nodes-langchain.embeddingsHuggingFace` - Embeddings Hugging Face
- `@n8n/n8n-nodes-langchain.embeddingsTogetherAi` - Embeddings Together AI

#### Vector Stores
- `@n8n/n8n-nodes-langchain.vectorStoreQdrant` - Qdrant
- `@n8n/n8n-nodes-langchain.vectorStorePinecone` - Pinecone
- `@n8n/n8n-nodes-langchain.vectorStoreWeaviate` - Weaviate
- `@n8n/n8n-nodes-langchain.vectorStoreChroma` - Chroma
- `@n8n/n8n-nodes-langchain.vectorStoreInMemory` - Vector Store en memoria
- `@n8n/n8n-nodes-langchain.vectorStoreRedis` - Redis
- `@n8n/n8n-nodes-langchain.vectorStoreSupabase` - Supabase
- `@n8n/n8n-nodes-langchain.vectorStoreMilvus` - Milvus
- `@n8n/n8n-nodes-langchain.vectorStoreZep` - Zep

#### Document Loaders
- `@n8n/n8n-nodes-langchain.documentDefaultDataLoader` - Carga de documentos por defecto
- `@n8n/n8n-nodes-langchain.documentBinaryInputLoader` - Carga desde entrada binaria
- `@n8n/n8n-nodes-langchain.documentGithubLoader` - Carga desde GitHub
- `@n8n/n8n-nodes-langchain.documentWebLoader` - Carga desde web
- `@n8n/n8n-nodes-langchain.documentDirectoryLoader` - Carga desde directorio
- `@n8n/n8n-nodes-langchain.documentNotionLoader` - Carga desde Notion

#### Text Splitters
- `@n8n/n8n-nodes-langchain.textSplitterTokenSplitter` - División por tokens
- `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter` - División recursiva por caracteres
- `@n8n/n8n-nodes-langchain.textSplitterCharacterTextSplitter` - División por caracteres
- `@n8n/n8n-nodes-langchain.textSplitterMarkdownSplitter` - División de Markdown
- `@n8n/n8n-nodes-langchain.textSplitterLatexSplitter` - División de LaTeX

#### Chains
- `@n8n/n8n-nodes-langchain.chainLlm` - Cadena básica LLM
- `@n8n/n8n-nodes-langchain.chainRetrievalQa` - Cadena de pregunta-respuesta con recuperación
- `@n8n/n8n-nodes-langchain.chainConversationalRetrievalQa` - Cadena conversacional con recuperación
- `@n8n/n8n-nodes-langchain.chainSummarization` - Cadena de resumen
- `@n8n/n8n-nodes-langchain.chainStuffDocuments` - Cadena para documentos
- `@n8n/n8n-nodes-langchain.chainRefineDocuments` - Cadena de refinamiento de documentos

#### Agents
- `@n8n/n8n-nodes-langchain.agent` - Agente AI principal
- `@n8n/n8n-nodes-langchain.conversationalAgent` - Agente conversacional
- `@n8n/n8n-nodes-langchain.reActAgent` - Agente ReAct
- `@n8n/n8n-nodes-langchain.openAiFunctionsAgent` - Agente con funciones OpenAI

#### Memory
- `@n8n/n8n-nodes-langchain.memoryBufferWindow` - Memoria de ventana deslizante
- `@n8n/n8n-nodes-langchain.memoryBuffer` - Memoria buffer
- `@n8n/n8n-nodes-langchain.memoryConversationBuffer` - Memoria de conversación
- `@n8n/n8n-nodes-langchain.memoryPostgresChat` - Memoria en PostgreSQL
- `@n8n/n8n-nodes-langchain.memoryRedisChat` - Memoria en Redis
- `@n8n/n8n-nodes-langchain.memoryManager` - Gestor de memoria

#### Tools
- `@n8n/n8n-nodes-langchain.toolCalculator` - Calculadora
- `@n8n/n8n-nodes-langchain.toolHttpRequest` - Petición HTTP
- `@n8n/n8n-nodes-langchain.toolWikipedia` - Búsqueda en Wikipedia
- `@n8n/n8n-nodes-langchain.toolSerpApi` - Búsqueda web con SerpAPI
- `@n8n/n8n-nodes-langchain.toolVectorStore` - Herramienta de vector store
- `@n8n/n8n-nodes-langchain.toolWorkflow` - Ejecución de workflow como herramienta
- `@n8n/n8n-nodes-langchain.toolCode` - Ejecución de código
- `@n8n/n8n-nodes-langchain.toolSearchApi` - API de búsqueda

#### Output Parsers
- `@n8n/n8n-nodes-langchain.outputParserStructured` - Parser estructurado
- `@n8n/n8n-nodes-langchain.outputParserJson` - Parser JSON
- `@n8n/n8n-nodes-langchain.outputParserAutofixing` - Parser con autocorrección
- `@n8n/n8n-nodes-langchain.outputParserRegex` - Parser con expresiones regulares

#### Retrievers
- `@n8n/n8n-nodes-langchain.retrieverVectorStore` - Recuperador de vector store
- `@n8n/n8n-nodes-langchain.retrieverWebResearch` - Recuperador de investigación web
- `@n8n/n8n-nodes-langchain.retrieverMultiQuery` - Recuperador multi-query

#### Classifiers
- `@n8n/n8n-nodes-langchain.textClassifier` - Clasificador de texto
- `@n8n/n8n-nodes-langchain.sentimentAnalyzer` - Analizador de sentimientos

#### Information Extractors
- `@n8n/n8n-nodes-langchain.informationExtractor` - Extractor de información
- `@n8n/n8n-nodes-langchain.entityExtractor` - Extractor de entidades

---

## 📋 23. CONFIGURACIÓN DETALLADA DE NODOS LANGCHAIN

### `@n8n/n8n-nodes-langchain.agent` (Agente AI)
**Propósito**: Ejecuta un agente de IA que puede usar herramientas para completar tareas.

**Parámetros clave**:
- `model` (string): Modelo de lenguaje a usar
- `tools` (array): Lista de herramientas disponibles
- `memory` (object): Configuración de memoria
- `maxIterations` (number): Máximo número de iteraciones
- `returnIntermediateSteps` (boolean): Retornar pasos intermedios

**Ejemplo de configuración**:
```json
{
  "id": "agent_001",
  "name": "AI Agent",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1,
  "position": [450, 300],
  "parameters": {
    "model": "=@$node[\"OpenAI Chat Model\"].json",
    "tools": [
      "=@$node[\"Calculator\"].json",
      "=@$node[\"HTTP Request Tool\"].json"
    ],
    "memory": "=@$node[\"Window Buffer Memory\"].json",
    "maxIterations": 5,
    "returnIntermediateSteps": false
  }
}
```

### `@n8n/n8n-nodes-langchain.lmChatOpenAi` (ChatGPT)
**Propósito**: Interactúa con modelos de chat de OpenAI.

**Parámetros clave**:
- `model` (string): Modelo específico (gpt-4, gpt-3.5-turbo, etc.)
- `messages` (array): Lista de mensajes
- `temperature` (number): Creatividad (0-2)
- `maxTokens` (number): Máximo de tokens
- `topP` (number): Nucleus sampling
- `frequencyPenalty` (number): Penalización de frecuencia
- `presencePenalty` (number): Penalización de presencia

**Ejemplo de configuración**:
```json
{
  "id": "openai_chat_001",
  "name": "OpenAI Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "Eres un asistente útil y amable."
      },
      {
        "role": "user",
        "content": "={{ $json.message }}"
      }
    ],
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

### `@n8n/n8n-nodes-langchain.embeddingsOpenAi` (Embeddings OpenAI)
**Propósito**: Genera embeddings vectoriales para texto usando OpenAI.

**Parámetros clave**:
- `model` (string): Modelo de embeddings (text-embedding-ada-002, etc.)
- `input` (string): Texto de entrada
- `user` (string): Identificador de usuario

**Ejemplo de configuración**:
```json
{
  "id": "embeddings_001",
  "name": "Embeddings OpenAI",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1,
  "position": [250, 500],
  "parameters": {
    "model": "text-embedding-ada-002",
    "input": "={{ $json.text }}"
  }
}
```

### `@n8n/n8n-nodes-langchain.vectorStoreQdrant` (Vector Store Qdrant)
**Propósito**: Almacena y recupera vectores usando Qdrant.

**Parámetros clave**:
- `operation` (string): Operación (insert, search, delete, etc.)
- `collection` (string): Nombre de la colección
- `vectors` (array): Vectores a insertar
- `payload` (object): Datos adicionales
- `filter` (object): Filtros para búsqueda

**Ejemplo de configuración**:
```json
{
  "id": "qdrant_001",
  "name": "Qdrant Vector Store",
  "type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
  "typeVersion": 1,
  "position": [650, 500],
  "parameters": {
    "operation": "insert",
    "collection": "documents",
    "vectors": "={{ $node[\"Embeddings OpenAI\"].json.embeddings }}",
    "payload": {
      "text": "={{ $json.text }}",
      "metadata": "={{ $json.metadata }}"
    }
  }
}
```

### `@n8n/n8n-nodes-langchain.memoryBufferWindow` (Memoria de Ventana)
**Propósito**: Mantiene un buffer de mensajes de chat con límite de tamaño.

**Parámetros clave**:
- `sessionId` (string): ID de sesión
- `memoryKey` (string): Clave de memoria
- `returnMessages` (boolean): Retornar mensajes
- `maxTokenLimit` (number): Límite máximo de tokens
- `k` (number): Número de mensajes a mantener

**Ejemplo de configuración**:
```json
{
  "id": "memory_001",
  "name": "Window Buffer Memory",
  "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
  "typeVersion": 1,
  "position": [850, 300],
  "parameters": {
    "sessionId": "={{ $json.sessionId }}",
    "memoryKey": "chat_history",
    "returnMessages": true,
    "maxTokenLimit": 2000,
    "k": 10
  }
}
```

### `@n8n/n8n-nodes-langchain.chainRetrievalQa` (Cadena QA con Recuperación)
**Propósito**: Responde preguntas usando recuperación de información de una base de conocimientos.

**Parámetros clave**:
- `model` (string): Modelo de lenguaje
- `retriever` (object): Recuperador de documentos
- `returnSourceDocuments` (boolean): Retornar documentos fuente
- `question` (string): Pregunta a responder

**Ejemplo de configuración**:
```json
{
  "id": "qa_chain_001",
  "name": "Question and Answer Chain",
  "type": "@n8n/n8n-nodes-langchain.chainRetrievalQa",
  "typeVersion": 1,
  "position": [1050, 300],
  "parameters": {
    "model": "=@$node[\"OpenAI Chat Model\"].json",
    "retriever": "=@$node[\"Vector Store Retriever\"].json",
    "returnSourceDocuments": true,
    "question": "={{ $json.question }}"
  }
}
```

### `@n8n/n8n-nodes-langchain.toolHttpRequest` (Herramienta HTTP)
**Propósito**: Realiza peticiones HTTP como herramienta para agentes.

**Parámetros clave**:
- `method` (string): Método HTTP (GET, POST, PUT, DELETE)
- `url` (string): URL de destino
- `headers` (object): Headers HTTP
- `body` (string): Cuerpo de la petición
- `authentication` (string): Tipo de autenticación

**Ejemplo de configuración**:
```json
{
  "id": "http_tool_001",
  "name": "HTTP Request Tool",
  "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
  "typeVersion": 1,
  "position": [650, 100],
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "headers": {
      "Authorization": "Bearer {{ $credentials.apiKey }}"
    }
  }
}
```

### `@n8n/n8n-nodes-langchain.outputParserStructured` (Parser Estructurado)
**Propósito**: Parsea la salida del modelo en un formato estructurado.

**Parámetros clave**:
- `schema` (object): Esquema de validación
- `instructions` (string): Instrucciones para el parser
- `multiple` (boolean): Permitir múltiples resultados

**Ejemplo de configuración**:
```json
{
  "id": "parser_001",
  "name": "Structured Output Parser",
  "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
  "typeVersion": 1,
  "position": [1250, 300],
  "parameters": {
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string" },
        "age": { "type": "number" }
      },
      "required": ["name", "email"]
    },
    "instructions": "Extrae información de contacto del texto proporcionado."
  }
}
```

### `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter` (Divisor de Texto)
**Propósito**: Divide texto largo en chunks más pequeños usando división recursiva.

**Parámetros clave**:
- `input` (string): Texto de entrada
- `chunkSize` (number): Tamaño de cada chunk
- `chunkOverlap` (number): Superposición entre chunks
- `separators` (array): Separadores para división

**Ejemplo de configuración**:
```json
{
  "id": "splitter_001",
  "name": "Recursive Character Text Splitter",
  "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
  "typeVersion": 1,
  "position": [450, 500],
  "parameters": {
    "input": "={{ $json.text }}",
    "chunkSize": 1000,
    "chunkOverlap": 200,
    "separators": ["\\n\\n", "\\n", " ", ""]
  }
}
```

### `@n8n/n8n-nodes-langchain.documentDefaultDataLoader` (Cargador de Documentos)
**Propósito**: Carga documentos desde diversas fuentes.

**Parámetros clave**:
- `source` (string): Fuente del documento
- `data` (string): Datos del documento
- `metadata` (object): Metadatos adicionales

**Ejemplo de configuración**:
```json
{
  "id": "loader_001",
  "name": "Default Data Loader",
  "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
  "typeVersion": 1,
  "position": [250, 700],
  "parameters": {
    "source": "text",
    "data": "={{ $json.content }}",
    "metadata": {
      "source": "user_input",
      "timestamp": "={{ new Date().toISOString() }}"
    }
  }
}
```

---

## 🔄 24. CONEXIONES VÁLIDAS PARA NODOS LANGCHAIN

Según la documentación oficial de n8n, los nodos LangChain usan tipos de conexión específicos:

```typescript
export type LangChainConnectionType = 
  | 'ai_tool'           // Conexión a herramientas AI
  | 'ai_chain'          // Conexión a cadenas AI  
  | 'ai_agent'          // Conexión a agentes AI
  | 'ai_languageModel'  // Conexión a modelos de lenguaje
  | 'ai_memory'         // Conexión a memoria AI
  | 'ai_document'       // Conexión a documentos AI
  | 'ai_vectorStore'    // Conexión a vector stores
  | 'ai_embeddings'     // Conexión a embeddings
  | 'ai_textSplitter'   // Conexión a divisores de texto
  | 'ai_retriever'      // Conexión a recuperadores
  | 'ai_outputParser'   // Conexión a parsers de salida
```

---

## 📋 25. EJEMPLOS COMPLETOS DE WORKFLOWS LANGCHAIN

### 🤖 Workflow de Chatbot con Memoria
```json
{
  "nodes": [
    {
      "id": "chat_trigger",
      "name": "When chat message received",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "position": [250, 200]
    },
    {
      "id": "openai_model",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "position": [450, 200],
      "parameters": {
        "model": "gpt-4",
        "temperature": 0.7
      }
    },
    {
      "id": "memory",
      "name": "Window Buffer Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "position": [650, 200],
      "parameters": {
        "k": 10,
        "returnMessages": true
      }
    },
    {
      "id": "agent",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [850, 200],
      "parameters": {
        "maxIterations": 5
      }
    }
  ],
  "connections": {
    "When chat message received": {
      "main": [
        [
          {
            "node": "OpenAI Chat Model",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Window Buffer Memory": {
      "ai_memory": [
        [
          {
            "node": "AI Agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 📚 Workflow de RAG (Retrieval-Augmented Generation)
```json
{
  "nodes": [
    {
      "id": "manual_trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 200]
    },
    {
      "id": "doc_loader",
      "name": "Default Data Loader",
      "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
      "position": [450, 200]
    },
    {
      "id": "text_splitter",
      "name": "Recursive Character Text Splitter",
      "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
      "position": [650, 200]
    },
    {
      "id": "embeddings",
      "name": "Embeddings OpenAI",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "position": [850, 200]
    },
    {
      "id": "vector_store",
      "name": "Qdrant Vector Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
      "position": [1050, 200]
    },
    {
      "id": "retriever",
      "name": "Vector Store Retriever",
      "type": "@n8n/n8n-nodes-langchain.retrieverVectorStore",
      "position": [850, 400]
    },
    {
      "id": "qa_chain",
      "name": "Retrieval QA Chain",
      "type": "@n8n/n8n-nodes-langchain.chainRetrievalQa",
      "position": [1050, 400]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Default Data Loader",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Default Data Loader": {
      "ai_document": [
        [
          {
            "node": "Recursive Character Text Splitter",
            "type": "ai_document",
            "index": 0
          }
        ]
      ]
    },
    "Recursive Character Text Splitter": {
      "ai_document": [
        [
          {
            "node": "Embeddings OpenAI",
            "type": "ai_document",
            "index": 0
          }
        ]
      ]
    },
    "Embeddings OpenAI": {
      "ai_embeddings": [
        [
          {
            "node": "Qdrant Vector Store",
            "type": "ai_embeddings",
            "index": 0
          }
        ]
      ]
    },
    "Qdrant Vector Store": {
      "ai_vectorStore": [
        [
          {
            "node": "Vector Store Retriever",
            "type": "ai_vectorStore",
            "index": 0
          }
        ]
      ]
    },
    "Vector Store Retriever": {
      "ai_retriever": [
        [
          {
            "node": "Retrieval QA Chain",
            "type": "ai_retriever",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## ⚠️ 26. NOTAS IMPORTANTES SOBRE NODOS LANGCHAIN

### Configuración de Credenciales
Los nodos LangChain requieren credenciales específicas:
- **OpenAI**: API Key de OpenAI
- **Google Gemini**: API Key de Google AI Studio
- **Anthropic**: API Key de Anthropic
- **Qdrant/Pinecone**: URL del servicio y API Key
- **Mistral**: API Key de Mistral AI

### Versiones de Nodos
- Los tipos de nodos LangChain usan el prefijo `@n8n/n8n-nodes-langchain.`
- Siempre verificar la `typeVersion` correcta en la documentación
- Las versiones pueden cambiar con actualizaciones de n8n

### Limitaciones de Recursos
- **Tokens**: Los modelos de lenguaje tienen límites de tokens
- **Costo**: APIs como OpenAI tienen costo por uso
- **Rate Limits**: Límites de velocidad en las APIs
- **Memoria**: Procesamiento de documentos grandes requiere memoria

### Mejores Prácticas
1. **Modularidad**: Separar la lógica de IA en workflows pequeños
2. **Error Handling**: Implementar manejo de errores para fallos de API
3. **Caching**: Usar memoria para evitar llamadas repetidas
4. **Testing**: Probar workflows con datos de ejemplo antes de producción
5. **Monitoreo**: Monitorear uso de tokens y costos

---

## 🎯 27. NODOS LANGCHAIN MÁS POPULARES

**Para uso inmediato en workflows de IA:**

1. `@n8n/n8n-nodes-langchain.agent` - Agente AI principal
2. `@n8n/n8n-nodes-langchain.lmChatOpenAi` - ChatGPT
3. `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` - Google Gemini
4. `@n8n/n8n-nodes-langchain.embeddingsOpenAi` - Embeddings OpenAI
5. `@n8n/n8n-nodes-langchain.vectorStoreQdrant` - Vector Store Qdrant
6. `@n8n/n8n-nodes-langchain.memoryBufferWindow` - Memoria de chat
7. `@n8n/n8n-nodes-langchain.chainRetrievalQa` - QA con recuperación
8. `@n8n/n8n-nodes-langchain.toolHttpRequest` - Herramienta HTTP
9. `@n8n/n8n-nodes-langchain.outputParserStructured` - Parser estructurado
10. `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter` - Divisor de texto
11. `@n8n/n8n-nodes-langchain.documentDefaultDataLoader` - Cargador de documentos
12. `@n8n/n8n-nodes-langchain.chatTrigger` - Trigger de chat
13. `@n8n/n8n-nodes-langchain.retrieverVectorStore` - Recuperador de vectores
14. `@n8n/n8n-nodes-langchain.toolCalculator` - Calculadora
15. `@n8n/n8n-nodes-langchain.informationExtractor` - Extractor de información

---

Esta documentación completa garantiza que el sistema pueda generar workflows con nodos LangChain perfectamente configurados y compatibles con n8n oficial.

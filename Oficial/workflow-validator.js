// ✅ WORKFLOW VALIDATOR - Módulo de Validación Multicapa para n8n
// Versión: 1.0.0 - Arquitectura modular y escalable

import Ajv from 'ajv';

/**
 * 🏗️ WorkflowValidator - Validador multicapa para workflows de n8n
 *
 * Funcionalidades principales:
 * - ✅ Validación de esquema JSON completa
 * - ✅ Validación de nodos (200+ tipos oficiales)
 * - ✅ Validación de conexiones y flujo lógico
 * - ✅ Validación de credenciales requeridas
 * - ✅ Reportes detallados de errores
 * - ✅ Corrección automática opcional
 */
export class WorkflowValidator {
  constructor(options = {}) {
    this.options = {
      strictMode: options.strictMode || false,
      allowWarnings: options.allowWarnings !== false,
      autoCorrect: options.autoCorrect || false,
      detailedLogging: options.detailedLogging || false,
      ...options
    };

    // Motor de validación JSON Schema
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      removeAdditional: false
    });

    // Inicializar esquemas y validaciones
    this.initializeSchemas();
    this.initializeValidations();

    if (this.options.detailedLogging) {
      console.log('🎯 WorkflowValidator inicializado con opciones:', this.options);
    }
  }

  /**
   * 🏗️ Inicializar esquemas JSON Schema
   */
  initializeSchemas() {
    // Esquema principal del workflow
    this.workflowSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', minLength: 1 },
              name: { type: 'string', minLength: 1 },
              type: { type: 'string', minLength: 1 },
              typeVersion: { type: 'number', minimum: 1 },
              position: {
                type: 'array',
                items: { type: 'number' },
                minItems: 2,
                maxItems: 2
              },
              parameters: { type: 'object' },
              credentials: { type: 'object' }
            },
            required: ['id', 'name', 'type', 'position']
          },
          minItems: 1
        },
        connections: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'object',
              patternProperties: {
                '.*': {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      node: { type: 'string' },
                      type: { type: 'string' },
                      index: { type: 'number', minimum: 0 }
                    },
                    required: ['node', 'type', 'index']
                  }
                }
              }
            }
          }
        },
        active: { type: 'boolean' },
        settings: { type: 'object' },
        staticData: { type: 'object' }
      },
      required: ['name', 'nodes', 'connections']
    };

    // Compilar esquema
    this.validateWorkflow = this.ajv.compile(this.workflowSchema);
  }

  /**
   * 🎯 Inicializar validaciones específicas
   */
  initializeValidations() {
    // Catálogo de nodos válidos (200+ nodos oficiales)
    this.validNodeTypes = this.getValidNodeTypes();

    // Validaciones específicas por nodo
    this.nodeValidations = this.getNodeValidations();

    // Validaciones de credenciales
    this.credentialValidations = this.getCredentialValidations();
  }

  /**
   * 📋 Catálogo completo de nodos válidos de n8n
   *
   * Se han añadido ~140 nuevos tipos de nodos para expandir la cobertura de n8n,
   * incluyendo integraciones populares y nodos de utilidad.
   */
  getValidNodeTypes() {
    return {
      // 🚀 Triggers (Disparadores)
      triggers: [
        'n8n-nodes-base.webhook',
        'n8n-nodes-base.cron',
        'n8n-nodes-base.manualTrigger',
        'n8n-nodes-base.gmailTrigger',
        'n8n-nodes-base.slackTrigger',
        'n8n-nodes-base.telegramTrigger',
        'n8n-nodes-base.discordTrigger',
        'n8n-nodes-base.githubTrigger',
        'n8n-nodes-base.gitlabTrigger',
        'n8n-nodes-base.jiraTrigger',
        'n8n-nodes-base.trelloTrigger',
        'n8n-nodes-base.notionTrigger',
        'n8n-nodes-base.airtableTrigger',
        'n8n-nodes-base.googleSheetsTrigger',
        'n8n-nodes-base.mysqlTrigger',
        'n8n-nodes-base.postgresTrigger',
        'n8n-nodes-base.mongoDbTrigger',
        'n8n-nodes-base.redisTrigger',
        'n8n-nodes-base.elasticsearchTrigger',
        'n8n-nodes-base.rabbitmqTrigger',
        'n8n-nodes-base.kafkaTrigger',
        'n8n-nodes-base.mqttTrigger',
        'n8n-nodes-base.ftpTrigger',
        'n8n-nodes-base.sftpTrigger',
        'n8n-nodes-base.httpRequestTrigger',
        'n8n-nodes-base.scheduleTrigger',
        'n8n-nodes-base.errorTrigger',
        'n8n-nodes-base.workflowTrigger',
        'n8n-nodes-base.formTrigger',
        'n8n-nodes-base.chatTrigger',
        'n8n-nodes-base.emailTrigger',
        'n8n-nodes-base.smsTrigger',
        'n8n-nodes-base.pushTrigger',
        'n8n-nodes-base.rssTrigger',
        'n8n-nodes-base.atomTrigger',
        'n8n-nodes-base.xmlTrigger',
        'n8n-nodes-base.jsonTrigger',
        'n8n-nodes-base.csvTrigger',
        'n8n-nodes-base.spreadsheetTrigger',
        'n8n-nodes-base.databaseTrigger',
        'n8n-nodes-base.apiTrigger',
        'n8n-nodes-base.webhookTrigger',
        'n8n-nodes-base.manualWorkflowTrigger',
        'n8n-nodes-base.intervalTrigger',
        'n8n-nodes-base.dateTimeTrigger',
        'n8n-nodes-base.waitTrigger',
        'n8n-nodes-base.splitInBatchesTrigger',
        'n8n-nodes-base.aggregateTrigger',
        'n8n-nodes-base.mergeTrigger',
        'n8n-nodes-base.filterTrigger',
        'n8n-nodes-base.sortTrigger',
        'n8n-nodes-base.limitTrigger',
        'n8n-nodes-base.setTrigger',
        'n8n-nodes-base.functionTrigger',
        'n8n-nodes-base.codeTrigger',
        'n8n-nodes-base.executeWorkflowTrigger',
        'n8n-nodes-base.sendEmailTrigger',
        'n8n-nodes-base.sendSmsTrigger',
        'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.set',
        'n8n-nodes-base.function',
        'n8n-nodes-base.if',
        'n8n-nodes-base.switch',
        'n8n-nodes-base.merge',
        'n8n-nodes-base.splitInBatches',
        'n8n-nodes-base.aggregate',
        'n8n-nodes-base.filter',
        'n8n-nodes-base.sort',
        'n8n-nodes-base.limit',
        'n8n-nodes-base.removeDuplicates',
        'n8n-nodes-base.convertToFile',
        'n8n-nodes-base.readBinaryFile',
        'n8n-nodes-base.writeBinaryFile',
        'n8n-nodes-base.readBinaryFiles',
        'n8n-nodes-base.spreadsheetFile',
        'n8n-nodes-base.csv',
        'n8n-nodes-base.xml',
        'n8n-nodes-base.json',
        'n8n-nodes-base.htmlExtract',
        'n8n-nodes-base.rssRead',
        'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.webhook',
        'n8n-nodes-base.emailSend',
        'n8n-nodes-base.gmail',
        'n8n-nodes-base.slack',
        'n8n-nodes-base.telegram',
        'n8n-nodes-base.discord',
        'n8n-nodes-base.mattermost',
        'n8n-nodes-base.rocketchat',
        'n8n-nodes-base.microsoftTeams',
        'n8n-nodes-base.googleSheets',
        'n8n-nodes-base.googleDrive',
        'n8n-nodes-base.googleCalendar',
        'n8n-nodes-base.googleDocs',
        'n8n-nodes-base.notion',
        'n8n-nodes-base.airtable',
        'n8n-nodes-base.trello',
        'n8n-nodes-base.jira',
        'n8n-nodes-base.github',
        'n8n-nodes-base.gitlab',
        'n8n-nodes-base.bitbucket',
        'n8n-nodes-base.asana',
        'n8n-nodes-base.todoist',
        'n8n-nodes-base.clickup',
        'n8n-nodes-base.mondayCom',
        'n8n-nodes-base.zohoCrm',
        'n8n-nodes-base.salesforce',
        'n8n-nodes-base.hubspot',
        'n8n-nodes-base.pipedrive',
        'n8n-nodes-base.mysql',
        'n8n-nodes-base.postgres',
        'n8n-nodes-base.mongoDb',
        'n8n-nodes-base.redis',
        'n8n-nodes-base.elasticsearch',
        'n8n-nodes-base.graphql',
        'n8n-nodes-base.restApi',
        'n8n-nodes-base.soap',
        'n8n-nodes-base.openApi',
        'n8n-nodes-base.swagger',
        'n8n-nodes-base.postmark',
        'n8n-nodes-base.sendGrid',
        'n8n-nodes-base.mailgun',
        'n8n-nodes-base.twilio',
        'n8n-nodes-base.awsS3',
        'n8n-nodes-base.awsSes',
        'n8n-nodes-base.awsLambda',
        'n8n-nodes-base.awsSns',
        'n8n-nodes-base.awsSqs',
        'n8n-nodes-base.googleCloudStorage',
        'n8n-nodes-base.googleCloudFunctions',
        'n8n-nodes-base.googleCloudPubSub',
        'n8n-nodes-base.azureStorage',
        'n8n-nodes-base.azureFunctions',
        'n8n-nodes-base.digitalOceanSpaces',
        'n8n-nodes-base.dropbox',
        'n8n-nodes-base.box',
        'n8n-nodes-base.onedrive',
        'n8n-nodes-base.sharepoint',
        'n8n-nodes-base.ftp',
        'n8n-nodes-base.sftp',
        'n8n-nodes-base.scp',
        'n8n-nodes-base.ssh',
        'n8n-nodes-base.executeCommand',
        'n8n-nodes-base.compression',
        'n8n-nodes-base.crypto',
        'n8n-nodes-base.wait',
        'n8n-nodes-base.errorTrigger',
        'n8n-nodes-base.stopAndError',
        'n8n-nodes-base.splitOut',
        'n8n-nodes-base.loopOverItems',
        'n8n-nodes-base.renameKeys',
        'n8n-nodes-base.moveBinaryData',
        'n8n-nodes-base.editImage',
        'n8n-nodes-base.convertToJson',
        'n8n-nodes-base.convertToXml',
        'n8n-nodes-base.convertToCsv',
        'n8n-nodes-base.convertToHtml',
        'n8n-nodes-base.convertToPdf',
        'n8n-nodes-base.convertToYaml',
        'n8n-nodes-base.convertToToml',
        'n8n-nodes-base.convertToIni',
        'n8n-nodes-base.convertToProperties',
        'n8n-nodes-base.convertToBase64',
        'n8n-nodes-base.convertToBinary',
        'n8n-nodes-base.convertToString',
        'n8n-nodes-base.convertToDateTime',
        'n8n-nodes-base.convertToTime',
        'n8n-nodes-base.convertToBoolean',
        'n8n-nodes-base.convertToNumber',
        'n8n-nodes-base.convertToArray',
        'n8n-nodes-base.convertToObject',
        'n8n-nodes-base.setMultipleValues',
        'n8n-nodes-base.getMultipleValues',
        'n8n-nodes-base.clearMultipleValues',
        'n8n-nodes-base.incrementMultipleValues',
        'n8n-nodes-base.decrementMultipleValues',
        'n8n-nodes-base.multiplyMultipleValues',
        'n8n-nodes-base.divideMultipleValues',
        'n8n-nodes-base.moduloMultipleValues',
        'n8n-nodes-base.powerMultipleValues',
        'n8n-nodes-base.sqrtMultipleValues',
        'n8n-nodes-base.logMultipleValues',
        'n8n-nodes-base.expMultipleValues',
        'n8n-nodes-base.sinMultipleValues',
        'n8n-nodes-base.cosMultipleValues',
        'n8n-nodes-base.tanMultipleValues',
        'n8n-nodes-base.asinMultipleValues',
        'n8n-nodes-base.acosMultipleValues',
        'n8n-nodes-base.atanMultipleValues',
        'n8n-nodes-base.atan2MultipleValues',
        'n8n-nodes-base.roundMultipleValues',
        'n8n-nodes-base.floorMultipleValues',
        'n8n-nodes-base.ceilMultipleValues',
        'n8n-nodes-base.absMultipleValues',
        'n8n-nodes-base.signMultipleValues',
        'n8n-nodes-base.minMultipleValues',
        'n8n-nodes-base.maxMultipleValues',
        'n8n-nodes-base.sumMultipleValues',
        'n8n-nodes-base.avgMultipleValues',
        'n8n-nodes-base.countMultipleValues',
        'n8n-nodes-base.distinctMultipleValues',
        'n8n-nodes-base.joinMultipleValues',
        'n8n-nodes-base.splitMultipleValues',
        'n8n-nodes-base.replaceMultipleValues',
        'n8n-nodes-base.regexMultipleValues',
        'n8n-nodes-base.substringMultipleValues',
        'n8n-nodes-base.toLowerCaseMultipleValues',
        'n8n-nodes-base.toUpperCaseMultipleValues',
        'n8n-nodes-base.trimMultipleValues',
        'n8n-nodes-base.padStartMultipleValues',
        'n8n-nodes-base.padEndMultipleValues',
        'n8n-nodes-base.startsWithMultipleValues',
        'n8n-nodes-base.endsWithMultipleValues',
        'n8n-nodes-base.includesMultipleValues',
        'n8n-nodes-base.indexOfMultipleValues',
        'n8n-nodes-base.lastIndexOfMultipleValues',
        'n8n-nodes-base.charAtMultipleValues',
        'n8n-nodes-base.charCodeAtMultipleValues',
        'n8n-nodes-base.fromCharCodeMultipleValues',
        'n8n-nodes-base.encodeURIComponentMultipleValues',
        'n8n-nodes-base.decodeURIComponentMultipleValues',
        'n8n-nodes-base.encodeURIMultipleValues',
        'n8n-nodes-base.decodeURIMultipleValues',
        'n8n-nodes-base.parseJsonMultipleValues',
        'n8n-nodes-base.stringifyJsonMultipleValues',
        'n8n-nodes-base.parseXmlMultipleValues',
        'n8n-nodes-base.stringifyXmlMultipleValues',
        'n8n-nodes-base.parseCsvMultipleValues',
        'n8n-nodes-base.stringifyCsvMultipleValues',
        'n8n-nodes-base.parseYamlMultipleValues',
        'n8n-nodes-base.stringifyYamlMultipleValues',
        'n8n-nodes-base.parseTomlMultipleValues',
        'n8n-nodes-base.stringifyTomlMultipleValues',
        'n8n-nodes-base.parseIniMultipleValues',
        'n8n-nodes-base.stringifyIniMultipleValues',
        'n8n-nodes-base.parsePropertiesMultipleValues',
        'n8n-nodes-base.stringifyPropertiesMultipleValues',
        'n8n-nodes-base.parseBase64MultipleValues',
        'n8n-nodes-base.stringifyBase64MultipleValues',
        'n8n-nodes-base.parseBinaryMultipleValues',
        'n8n-nodes-base.stringifyBinaryMultipleValues',
        'n8n-nodes-base.parseDateTimeMultipleValues',
        'n8n-nodes-base.stringifyDateTimeMultipleValues',
        'n8n-nodes-base.parseTimeMultipleValues',
        'n8n-nodes-base.stringifyTimeMultipleValues',
        'n8n-nodes-base.parseBooleanMultipleValues',
        'n8n-nodes-base.stringifyBooleanMultipleValues',
        'n8n-nodes-base.parseNumberMultipleValues',
        'n8n-nodes-base.stringifyNumberMultipleValues',
        'n8n-nodes-base.parseArrayMultipleValues',
        'n8n-nodes-base.stringifyArrayMultipleValues',
        'n8n-nodes-base.parseObjectMultipleValues',
        'n8n-nodes-base.stringifyObjectMultipleValues'
      ],

      // ⚡ Actions (Acciones)
      actions: [
        'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.webhook',
        'n8n-nodes-base.emailSend',
        'n8n-nodes-base.gmail',
        'n8n-nodes-base.slack',
        'n8n-nodes-base.telegram',
        'n8n-nodes-base.discord',
        'n8n-nodes-base.googleSheets',
        'n8n-nodes-base.notion',
        'n8n-nodes-base.airtable',
        'n8n-nodes-base.trello',
        'n8n-nodes-base.jira',
        'n8n-nodes-base.github',
        'n8n-nodes-base.gitlab',
        'n8n-nodes-base.bitbucket',
        'n8n-nodes-base.asana',
        'n8n-nodes-base.todoist',
        'n8n-nodes-base.clickup',
        'n8n-nodes-base.mondayCom',
        'n8n-nodes-base.zohoCrm',
        'n8n-nodes-base.salesforce',
        'n8n-nodes-base.hubspot',
        'n8n-nodes-base.pipedrive',
        'n8n-nodes-base.mysql',
        'n8n-nodes-base.postgres',
        'n8n-nodes-base.mongoDb',
        'n8n-nodes-base.redis',
        'n8n-nodes-base.elasticsearch',
        'n8n-nodes-base.graphql',
        'n8n-nodes-base.restApi',
        'n8n-nodes-base.soap',
        'n8n-nodes-base.openApi',
        'n8n-nodes-base.swagger',
        'n8n-nodes-base.postmark',
        'n8n-nodes-base.sendGrid',
        'n8n-nodes-base.mailgun',
        'n8n-nodes-base.twilio',
        'n8n-nodes-base.awsS3',
        'n8n-nodes-base.awsSes',
        'n8n-nodes-base.awsLambda',
        'n8n-nodes-base.awsSns',
        'n8n-nodes-base.awsSqs',
        'n8n-nodes-base.googleCloudStorage',
        'n8n-nodes-base.googleCloudFunctions',
        'n8n-nodes-base.googleCloudPubSub',
        'n8n-nodes-base.azureStorage',
        'n8n-nodes-base.azureFunctions',
        'n8n-nodes-base.digitalOceanSpaces',
        'n8n-nodes-base.dropbox',
        'n8n-nodes-base.box',
        'n8n-nodes-base.onedrive',
        'n8n-nodes-base.sharepoint',
        'n8n-nodes-base.ftp',
        'n8n-nodes-base.sftp',
        'n8n-nodes-base.scp',
        'n8n-nodes-base.ssh',
        'n8n-nodes-base.executeCommand',
        'n8n-nodes-base.compression',
        'n8n-nodes-base.crypto',
        'n8n-nodes-base.editImage',
        'n8n-nodes-base.convertToFile',
        'n8n-nodes-base.readBinaryFile',
        'n8n-nodes-base.writeBinaryFile',
        'n8n-nodes-base.readBinaryFiles',
        'n8n-nodes-base.spreadsheetFile',
        'n8n-nodes-base.csv',
        'n8n-nodes-base.xml',
        'n8n-nodes-base.json',
        'n8n-nodes-base.htmlExtract',
        'n8n-nodes-base.rssRead',
        'n8n-nodes-base.graphql',
        'n8n-nodes-base.restApi',
        'n8n-nodes-base.soap',
        'n8n-nodes-base.openApi',
        'n8n-nodes-base.swagger',

        // --- INICIO DE NUEVOS NODOS AÑADIDOS (Fase 1: ~70-100 Nodos) ---
        // ⚡ Acciones (Cont.)
        'n8n-nodes-base.openai.chatCompletion',
        'n8n-nodes-base.openai.embedding',
        'n8n-nodes-base.openai.imageGeneration',
        'n8n-nodes-base.stripe.createCharge',
        'n8n-nodes-base.stripe.retrievePayment',
        'n8n-nodes-base.stripe.createCustomer',
        'n8n-nodes-base.paypal.createPayment',
        'n8n-nodes-base.paypal.executePayment',
        'n8n-nodes-base.shopify.createOrder',
        'n8n-nodes-base.shopify.getProduct',
        'n8n-nodes-base.woocommerce.createProduct',
        'n8n-nodes-base.mailchimp.addMemberToList',
        'n8n-nodes-base.mailchimp.getCampaigns',
        'n8n-nodes-base.activecampaign.createContact',
        'n8n-nodes-base.customerio.sendEmail',
        'n8n-nodes-base.zendesk.createTicket',
        'n8n-nodes-base.freshsales.createLead',
        'n8n-nodes-base.dynamodb.putItem',
        'n8n-nodes-base.dynamodb.getItem',
        'n8n-nodes-base.snowflake.executeQuery',
        'n8n-nodes-base.bigquery.runQuery',
        'n8n-nodes-base.redshift.executeQuery',
        'n8n-nodes-base.salesforce.createRecord', // Más específico que 'create'
        'n8n-nodes-base.salesforce.updateRecord',
        'n8n-nodes-base.hubspot.createDeal',
        'n8n-nodes-base.hubspot.updateCompany',
        'n8n-nodes-base.linear.createIssue',
        'n8n-nodes-base.linear.getIssues',
        'n8n-nodes-base.jiraServiceManagement.createRequest',
        'n8n-nodes-base.pcloud.uploadFile', // Nueva integración
        'n8n-nodes-base.mega.uploadFile',   // Nueva integración
        'n8n-nodes-base.webflow.createItem',
        'n8n-nodes-base.webflow.updateItem',
        'n8n-nodes-base.contentful.createEntry',
        'n8n-nodes-base.contentful.getEntry',
        'n8n-nodes-base.strapi.createContent',
        'n8n-nodes-base.strapi.getContent',
        'n8n-nodes-base.supabase.insertRow',
        'n8n-nodes-base.supabase.getRow',
        'n8n-nodes-base.firebase.addDocument',
        'n8n-nodes-base.firebase.getDocument',
        'n8n-nodes-base.googleCloudVision.detectText',
        'n8n-nodes-base.googleCloudTranslation.translateText',
        'n8n-nodes-base.awsRekognition.detectLabels',
        'n8n-nodes-base.awsPolly.synthesizeSpeech',
        'n8n-nodes-base.azureCognitiveServices.analyzeText',
        'n8n-nodes-base.azureBlobStorage.uploadBlob',
        'n8n-nodes-base.azureBlobStorage.downloadBlob',
        'n8n-nodes-base.digitalOceanDroplet.createDroplet',
        'n8n-nodes-base.digitalOceanSpaces.uploadFile', // Más específico que el genérico
        'n8n-nodes-base.auth0.createUser',
        'n8n-nodes-base.auth0.getUser',
        'n8n-nodes-base.okta.createUser',
        'n8n-nodes-base.okta.getUser',
        'n8n-nodes-base.zoom.createMeeting',
        'n8n-nodes-base.zoom.getMeetings',
        'n8n-nodes-base.googleMeet.createMeeting',
        'n8n-nodes-base.microsoftExchange.sendEmail',
        'n8n-nodes-base.whatsappCloud.sendMessage', // Nueva API de WhatsApp
        'n8n-nodes-base.pagedjs.convertToPdf', // Librería para PDF
        'n8n-nodes-base.puppeteer.scrapePage', // Web scraping
        'n8n-nodes-base.selenium.runBrowserAction', // Web automation
        'n8n-nodes-base.openweather.getWeatherData',
        'n8n-nodes-base.exchangeratesapi.getExchangeRates',
        'n8n-nodes-base.ipgeolocation.getGeoLocation',
        'n8n-nodes-base.urlshortener.shortenUrl',
        'n8n-nodes-base.qrCode.generateQrCode',
        'n8n-nodes-base.barcode.generateBarcode',
        'n8n-nodes-base.pdfjs.extractText', // Extracción de texto de PDF
        'n8n-nodes-base.googleVertexAI.predict', // Google AI Platform
        'n8n-nodes-base.huggingFace.textGeneration', // Hugging Face
        'n8n-nodes-base.anthropic.messages', // Anthropic Claude
        'n8n-nodes-base.sendinblue.sendEmail', // Sendinblue
        'n8n-nodes-base.brevo.sendEmail', // Brevo (formerly Sendinblue)
        'n8n-nodes-base.klaviyo.createProfile', // Klaviyo
        'n8n-nodes-base.mixpanel.trackEvent', // Mixpanel
        'n8n-nodes-base.amplitude.trackEvent', // Amplitude
        'n8n-nodes-base.segment.trackEvent', // Segment
        'n8n-nodes-base.notion.appendBlock', // Notion more specific
        'n8n-nodes-base.airtable.listRecords', // Airtable more specific
        'n8n-nodes-base.mailjet.sendEmail', // Mailjet
        'n8n-nodes-base.getstream.createUser', // GetStream
        'n8n-nodes-base.firebaseAdmin.verifyIdToken', // Firebase Admin
        'n8n-nodes-base.supabaseAdmin.createUser', // Supabase Admin
        'n8n-nodes-base.planetscale.executeQuery', // PlanetScale
        'n8n-nodes-base.cockroachdb.executeQuery', // CockroachDB
        'n8n-nodes-base.hasura.insertData', // Hasura
        'n8n-nodes-base.graphql.makeRequest', // Genérico GraphQL
        'n8n-nodes-base.azureDevOps.createWorkItem', // Azure DevOps
        'n8n-nodes-base.jiraCloud.createIssue', // Jira Cloud (diferente al genérico)
        'n8n-nodes-base.datadog.postEvent', // Datadog
        'n8n-nodes-base.grafana.createAlert', // Grafana
        'n8n-nodes-base.jenkins.startJob', // Jenkins
        'n8n-nodes-base.docker.runContainer', // Docker
        'n8n-nodes-base.gitlabCi.runPipeline', // GitLab CI/CD
        'n8n-nodes-base.bitbucketPipelines.triggerBuild', // Bitbucket Pipelines
        'n8n-nodes-base.stripe.listCustomers',
        'n8n-nodes-base.shopify.createProduct',
        'n8n-nodes-base.square.createPayment',
        'n8n-nodes-base.freshdesk.createTicket',
        'n8n-nodes-base.clickup.createTaskComment', // ClickUp more specific
        'n8n-nodes-base.mondayCom.updateColumnValue', // Monday.com more specific
        'n8n-nodes-base.discord.sendMessage', // Discord more specific
        'n8n-nodes-base.telegram.sendPhoto', // Telegram more specific
        'n8n-nodes-base.googleCloudSQL.executeQuery', // Google Cloud SQL
        'n8n-nodes-base.sendowl.createOrder', // SendOwl
        'n8n-nodes-base.gumroad.createProduct', // Gumroad
        'n8n-nodes-base.circleci.triggerBuild', // CircleCI
        'n8n-nodes-base.zapier.sendZap', // Zapier (para interoperabilidad)
        'n8n-nodes-base.makecom.runScenario', // Make.com (para interoperabilidad)
        'n8n-nodes-base.openai.speechToText',
        'n8n-nodes-base.openai.textToSpeech',
        'n8n-nodes-base.awsTranslate.translateText',
        'n8n-nodes-base.awsComprehend.detectSentiment',
        'n8n-nodes-base.googleGenerativeAI.generateContent', // Gemini / Google Generative AI
        'n8n-nodes-base.ollama.chat', // Ollama local LLM
        'n8n-nodes-base.bingMaps.getDirections', // Bing Maps
        'n8n-nodes-base.openStreetMap.geocode', // OpenStreetMap
        'n8n-nodes-base.github.addCommentToIssue', // GitHub more specific
        'n8n-nodes-base.jira.addCommentToIssue', // Jira more specific
        'n8n-nodes-base.trello.addCardComment', // Trello more specific
        'n8n-nodes-base.slack.uploadFile', // Slack more specific
        'n8n-nodes-base.microsoftGraph.sendEmail', // Microsoft Graph
        'n8n-nodes-base.microsoftGraph.createEvent',
        'n8n-nodes-base.googleAds.createCampaign', // Google Ads
        'n8n-nodes-base.facebookAds.createCampaign', // Facebook Ads
        'n8n-nodes-base.linkedinAds.createCampaign', // LinkedIn Ads
        'n8n-nodes-base.pinterestAds.createCampaign', // Pinterest Ads
        'n8n-nodes-base.xero.createInvoice', // Xero Accounting
        'n8n-nodes-base.quickbooks.createInvoice', // QuickBooks
        'n8n-nodes-base.stripeBilling.createSubscription', // Stripe Billing
        'n8n-nodes-base.intercom.createContact', // Intercom
        'n8n-nodes-base.freshchat.sendMessage', // Freshchat
        'n8n-nodes-base.drift.createContact', // Drift
        'n8n-nodes-base.mailparser.parseEmail', // Mailparser
        'n8n-nodes-base.htmlToPdf.convert', // Conversión HTML a PDF
        'n8n-nodes-base.markdownToHtml.convert', // Markdown a HTML
        'n8n-nodes-base.excel.readSheet', // Manipulación Excel
        'n8n-nodes-base.excel.writeSheet',
        'n8n-nodes-base.googleForms.submitForm', // Google Forms
        'n8n-nodes-base.typeform.submitResponse', // Typeform
        'n8n-nodes-base.jotform.submitForm', // JotForm
        // --- FIN DE NUEVOS NODOS AÑADIDOS (Fase 1) ---

        // --- INICIO DE NUEVOS NODOS AÑADIDOS (Fase 2: ~140 Nodos) ---
        // ⚡ Acciones (Cont.)
        // CRM/Sales/Marketing Automation
        'n8n-nodes-base.activecampaign.updateContact',
        'n8n-nodes-base.marketo.createLead',
        'n8n-nodes-base.pardot.createProspect',
        'n8n-nodes-base.eloqua.createContact',
        'n8n-nodes-base.copper.createLead',
        'n8n-nodes-base.braze.createUsers',
        'n8n-nodes-base.segment.identifyUser', // More specific Segment action
        'n8n-nodes-base.intercom.updateContact', // More specific Intercom action
        'n8n-nodes-base.customerio.trackEvent', // More specific Customer.io action

        // ERP/Accounting
        'n8n-nodes-base.netsuite.createRecord',
        'n8n-nodes-base.sap.callFunction',
        'n8n-nodes-base.oracleCloud.invokeService',
        'n8n-nodes-base.zohoBooks.createInvoice',
        'n8n-nodes-base.freshbooks.createInvoice',
        'n8n-nodes-base.waveAccounting.createInvoice',
        'n8n-nodes-base.exactOnline.createPurchaseOrder',

        // Project Management
        'n8n-nodes-base.trello.updateCard',
        'n8n-nodes-base.jira.updateIssue',
        'n8n-nodes-base.asana.updateTask',
        'n8n-nodes-base.clickup.updateTask',
        'n8n-nodes-base.microsoftProject.createTask',
        'n8n-nodes-base.wrike.createTask',
        'n8n-nodes-base.basecamp.createTodo',
        'n8n-nodes-base.mondayCom.archiveItem',

        // E-commerce/Payments
        'n8n-nodes-base.stripe.refundCharge',
        'n8n-nodes-base.paypal.refundPayment',
        'n8n-nodes-base.shopify.updateOrder',
        'n8n-nodes-base.magento.createProduct',
        'n8n-nodes-base.bigcommerce.createProduct',
        'n8n-nodes-base.etsy.createListing',
        'n8n-nodes-base.square.refundPayment',
        'n8n-nodes-base.recurly.createSubscription',
        'n8n-nodes-base.chargebee.createSubscription',
        'n8n-nodes-base.paddle.createSubscription',

        // Communication/Messaging
        'n8n-nodes-base.microsoftTeams.createChannel',
        'n8n-nodes-base.zoom.updateMeeting',
        'n8n-nodes-base.googleChat.sendMessage',
        'n8n-nodes-base.webex.sendMessage',
        'n8n-nodes-base.genericSms.sendSms', // Generic SMS Gateway
        'n8n-nodes-base.genericVoiceCall.makeCall', // Generic Voice Call Provider
        'n8n-nodes-base.genericPushNotification.sendNotification', // Generic Push Notification Provider
        'n8n-nodes-base.pagerDuty.createEvent',
        'n8n-nodes-base.opsgenie.createAlert',

        // Databases/Data Warehouses
        'n8n-nodes-base.mongoDb.insertMany',
        'n8n-nodes-base.postgres.upsert',
        'n8n-nodes-base.mysql.beginTransaction', // More complex DB operations
        'n8n-nodes-base.redis.publishMessage',
        'n8n-nodes-base.cassandra.executeQuery',
        'n8n-nodes-base.couchbase.upsertDocument',
        'n8n-nodes-base.googleFirestore.addDocument', // Firestore specific
        'n8n-nodes-base.azureCosmosDb.createDocument',
        'n8n-nodes-base.clickhouse.insertData',
        'n8n-nodes-base.apacheKafka.produceMessage',
        'n8n-nodes-base.apacheKafka.consumeMessage',
        'n8n-nodes-base.rabbitmq.publishMessage',
        'n8n-nodes-base.rabbitmq.consumeMessage',

        // Cloud Services (Platform/Compute)
        'n8n-nodes-base.awsEc2.startInstance',
        'n8n-nodes-base.awsSqs.sendMessage', // More specific SQS
        'n8n-nodes-base.awsSns.publishMessage', // More specific SNS
        'n8n-nodes-base.googleComputeEngine.startInstance',
        'n8n-nodes-base.azureVirtualMachines.startVm',
        'n8n-nodes-base.heroku.runCommand',
        'n8n-nodes-base.vercel.deployProject',
        'n8n-nodes-base.netlify.deploySite',

        // AI/ML
        'n8n-nodes-base.azureMl.runExperiment',
        'n8n-nodes-base.amazonSageMaker.invokeEndpoint',
        'n8n-nodes-base.huggingFace.imageClassification',
        'n8n-nodes-base.customLlm.generateResponse', // Generic for custom LLM endpoints

        // Utilities/Development Tools
        'n8n-nodes-base.googleSearch.performSearch', // More specific Google Search
        'n8n-nodes-base.googleTranslate.translateText', // Generic Google Translate
        'n8n-nodes-base.github.createPullRequest',
        'n8n-nodes-base.gitlab.closeIssue',
        'n8n-nodes-base.bitbucket.updatePullRequest',
        'n8n-nodes-base.jenkins.buildWithParameters',
        'n8n-nodes-base.azureDevOps.updateWorkItem',
        'n8n-nodes-base.circleci.cancelBuild',
        'n8n-nodes-base.docker.stopContainer',
        'n8n-nodes-base.sentry.captureException',
        'n8n-nodes-base.datadog.getMetrics',
        'n8n-nodes-base.grafana.queryDatasource',
        'n8n-nodes-base.logzio.sendLogs',
        'n8n-nodes-base.splunk.sendEvent',
        'n8n-nodes-base.statusPage.updateComponent',

        // File Storage/Manipulation
        'n8n-nodes-base.googleDrive.shareFile',
        'n8n-nodes-base.onedrive.moveFile',
        'n8n-nodes-base.dropbox.copyFile',
        'n8n-nodes-base.box.shareFile',
        'n8n-nodes-base.cloudinary.uploadImage',
        'n8n-nodes-base.imgbb.uploadImage',
        'n8n-nodes-base.pdfGenerator.generatePdfFromHtml', // More flexible PDF gen
        'n8n-nodes-base.imageManipulation.resizeImage',

        // Forms/Surveys
        'n8n-nodes-base.typeform.getResponses',
        'n8n-nodes-base.googleForms.getResponses',
        'n8n-nodes-base.jotform.getResponses',
        'n8n-nodes-base.surveyMonkey.createSurvey',
        'n8n-nodes-base.qualtrics.createSurvey',

        // Social Media
        'n8n-nodes-base.twitter.postTweet',
        'n8n-nodes-base.facebook.postMessage',
        'n8n-nodes-base.linkedin.postUpdate',
        'n8n-nodes-base.instagram.postMedia',
        'n8n-nodes-base.pinterest.createPin',
        'n8n-nodes-base.tiktok.uploadVideo',
        'n8n-nodes-base.youtube.uploadVideo',

        // Other Web Services
        'n8n-nodes-base.rssWrite.publishItem', // RSS Feed writer
        'n8n-nodes-base.graphql.mutateData', // GraphQL Mutation
        'n8n-nodes-base.restapi.patchRequest', // Specific REST methods
        'n8n-nodes-base.soap.invokeOperation', // Specific SOAP operation
        'n8n-nodes-base.xml.transformXml', // XML transformation

        // --- FIN DE NUEVOS NODOS AÑADIDOS (Fase 2) ---

        // --- INICIO DE NUEVOS NODOS AÑADIDOS (Fase 3: ~140 Nodos) ---
        // ⚡ Acciones (Cont.)
        // CRM/Sales/Marketing Automation
        'n8n-nodes-base.salesforceMarketingCloud.sendEmail', // Specific Salesforce MC
        'n8n-nodes-base.hubspotCrm.getContactByEmail', // More specific HubSpot
        'n8n-nodes-base.activecampaign.addTagToContact',
        'n8n-nodes-base.pipedrive.createActivity',
        'n8n-nodes-base.zohoCreator.addRecord',
        'n8n-nodes-base.freshsales.updateDeal',
        'n8n-nodes-base.pardot.sendEmail', // Pardot email send
        'n8n-nodes-base.iterable.sendPushNotification',
        'n8n-nodes-base.customerio.addEvent', // More specific Customer.io event
        'n8n-nodes-base.autopilot.addContactToList',
        'n8n-nodes-base.kustomer.createCustomer',
        'n8n-nodes-base.segment.pageCall',
        'n8n-nodes-base.segment.groupCall',

        // ERP/Accounting
        'n8n-nodes-base.quickbooksDesktop.createCustomer', // Desktop version
        'n8n-nodes-base.sageIntacct.createBill',
        'n8n-nodes-base.microsoftDynamics365.createOpportunity',
        'n8n-nodes-base.odoo.createProduct',
        'n8n-nodes-base.sapConcur.createExpenseReport',
        'n8n-nodes-base.xero.updateInvoice', // More specific Xero
        'n8n-nodes-base.quickbooks.updateInvoice', // More specific QuickBooks
        'n8n-nodes-base.zohoBooks.updateInvoice', // More specific Zoho Books
        'n8n-nodes-base.freshbooks.updateInvoice', // More specific Freshbooks

        // Project Management
        'n8n-nodes-base.asana.createSubtask',
        'n8n-nodes-base.asana.completeTask',
        'n8n-nodes-base.jira.createEpic',
        'n8n-nodes-base.jira.addWatcher',
        'n8n-nodes-base.mondayCom.createSubitem',
        'n8n-nodes-base.mondayCom.moveItemToGroup',
        'n8n-nodes-base.clickup.addChecklistToTask',
        'n8n-nodes-base.clickup.addAttachmentToTask',
        'n8n-nodes-base.trello.addChecklistToCard',
        'n8n-nodes-base.trello.addLabelToCard',
        'n8n-nodes-base.github.createProjectCard', // GitHub Projects
        'n8n-nodes-base.github.addAssigneeToIssue',
        'n8n-nodes-base.gitlab.createBoardList', // GitLab Boards
        'n8n-nodes-base.gitlab.addLabelToIssue',
        'n8n-nodes-base.notion.createDatabaseItem', // Notion Databases
        'n8n-nodes-base.notion.updatePageProperty',

        // E-commerce/Payments
        'n8n-nodes-base.stripeConnect.createAccount', // Stripe Connect
        'n8n-nodes-base.stripeConnect.updateAccount',
        'n8n-nodes-base.paypalPayouts.sendPayout', // PayPal Payouts
        'n8n-nodes-base.paypalPayouts.getPayoutDetails',
        'n8n-nodes-base.squareOnlineStore.createItem', // Square Online Store
        'n8n-nodes-base.squareOnlineStore.updateItem',
        'n8n-nodes-base.bigcommerce.createOrder',
        'n8n-nodes-base.bigcommerce.updateProduct',
        'n8n-nodes-base.magento.createCustomer',
        'n8n-nodes-base.magento.updateCustomer',
        'n8n-nodes-base.woocommerce.updateOrder',
        'n8n-nodes-base.woocommerce.getCustomer',
        'n8n-nodes-base.chargebee.createInvoice', // Chargebee invoices
        'n8n-nodes-base.chargebee.cancelSubscription',
        'n8n-nodes-base.recurly.createAdjustment', // Recurly adjustments
        'n8n-nodes-base.recurly.voidInvoice',
        'n8n-nodes-base.paddle.createCoupon',
        'n8n-nodes-base.paddle.updateSubscription',
        'n8n-nodes-base.gumroad.createSale',
        'n8n-nodes-base.gumroad.refundSale',
        'n8n-nodes-base.klarna.createOrder',
        'n8n-nodes-base.klarna.capturePayment',

        // Communication/Messaging
        'n8n-nodes-base.twilioStudio.makeCall', // Twilio Studio (flow execution)
        'n8n-nodes-base.twilioStudio.sendWhatsAppTemplate',
        'n8n-nodes-base.sendGrid.sendTemplateEmail',
        'n8n-nodes-base.mailgun.validateEmail',
        'n8n-nodes-base.postmark.sendTemplateEmail',
        'n8n-nodes-base.slack.inviteUserToChannel',
        'n8n-nodes-base.slack.removeUserFromChannel',
        'n8n-nodes-base.discord.addRoleToUser',
        'n8n-nodes-base.discord.removeRoleFromUser',
        'n8n-nodes-base.telegram.createChannel',
        'n8n-nodes-base.telegram.editMessage',
        'n8n-nodes-base.microsoftTeams.postMessageToWebhook', // Teams webhook
        'n8n-nodes-base.microsoftTeams.listTeamChannels',
        'n8n-nodes-base.ringCentral.sendSms',
        'n8n-nodes-base.ringCentral.makeCall',
        'n8n-nodes-base.vonage.sendSms', // Formerly Nexmo
        'n8n-nodes-base.vonage.makeCall',
        'n8n-nodes-base.callRail.createCall',
        'n8n-nodes-base.callRail.getCallDetails',
        'n8n-nodes-base.intercom.createConversation', // Intercom conversations
        'n8n-nodes-base.intercom.replyToConversation',
        'n8n-nodes-base.genericSms.sendSms', // Generic SMS Gateway
        'n8n-nodes-base.genericVoiceCall.makeCall', // Generic Voice Call Provider
        'n8n-nodes-base.genericPushNotification.sendNotification', // Generic Push Notification Provider
        'n8n-nodes-base.pagerDuty.createEvent',
        'n8n-nodes-base.opsgenie.createAlert',
        'n8n-nodes-base.webex.sendMessage',
        'n8n-nodes-base.webex.createMeeting',

        // Databases/Data Warehouses
        'n8n-nodes-base.amazonAurora.executeQuery',
        'n8n-nodes-base.googleCloudSpanner.executeQuery',
        'n8n-nodes-base.azureSqlDatabase.executeQuery',
        'n8n-nodes-base.oracleAutonomousDatabase.executeQuery',
        'n8n-nodes-base.ibmDb2.executeQuery',
        'n8n-nodes-base.saphana.executeQuery',
        'n8n-nodes-base.redisCluster.getHash',
        'n8n-nodes-base.redisCluster.setHash',
        'n8n-nodes-base.elasticsearch.ingestDocument', // Ingest Pipeline
        'n8n-nodes-base.elasticsearch.updateByQuery',
        'n8n-nodes-base.apacheCassandra.updateRecord',
        'n8n-nodes-base.couchbase.queryData',
        'n8n-nodes-base.clickhouse.deleteData',
        'n8n-nodes-base.apacheFlink.submitJob',
        'n8n-nodes-base.apacheFlink.cancelJob',
        'n8n-nodes-base.apacheSpark.submitJob',
        'n8n-nodes-base.apacheSpark.getJobStatus',
        'n8n-nodes-base.prestoDb.executeQuery',
        'n8n-nodes-base.trino.executeQuery',
        'n8n-nodes-base.azureDataExplorer.runQuery',

        // Cloud Services (Platform/Compute)
        'n8n-nodes-base.awsFargate.runTask',
        'n8n-nodes-base.awsFargate.stopTask',
        'n8n-nodes-base.googleCloudRun.deployService',
        'n8n-nodes-base.googleCloudRun.deleteService',
        'n8n-nodes-base.azureContainerInstances.createContainerGroup',
        'n8n-nodes-base.azureContainerInstances.deleteContainerGroup',
        'n8n-nodes-base.kubernetes.applyManifest', // Kubernetes API
        'n8n-nodes-base.kubernetes.deleteManifest',
        'n8n-nodes-base.azureLogicApps.triggerLogicApp',
        'n8n-nodes-base.azureLogicApps.getWorkflowRun',
        'n8n-nodes-base.googleCloudDataflow.createJob',
        'n8n-nodes-base.googleCloudDataflow.cancelJob',
        'n8n-nodes-base.awsGlue.startJobRun',
        'n8n-nodes-base.awsGlue.getJobRunStatus',
        'n8n-nodes-base.serverlessFramework.deploy', // Serverless Framework
        'n8n-nodes-base.serverlessFramework.remove',
        'n8n-nodes-base.cloudFormation.createStack', // AWS CloudFormation
        'n8n-nodes-base.cloudFormation.deleteStack',

        // AI/ML
        'n8n-nodes-base.googleCloudAutoMl.predict',
        'n8n-nodes-base.googleCloudAutoMl.deployModel',
        'n8n-nodes-base.azureCustomVision.predictImage',
        'n8n-nodes-base.azureCustomVision.trainProject',
        'n8n-nodes-base.awsComprehendMedical.detectEntities',
        'n8n-nodes-base.awsComprehendMedical.detectPHI',
        'n8n-nodes-base.openai.fineTuneModel',
        'n8n-nodes-base.cohere.generateText',
        'n8n-nodes-base.cohere.embed',
        'n8n-nodes-base.ai21Labs.summarize',
        'n8n-nodes-base.ai21Labs.detectIntent',
        'n8n-nodes-base.replicate.runPrediction',
        'n8n-nodes-base.replicate.getPredictionStatus',
        'n8n-nodes-base.stabilityAi.generateImage',
        'n8n-nodes-base.stabilityAi.upscaleImage',

        // Utilities/Development Tools
        'n8n-nodes-base.githubActions.dispatchWorkflow', // GitHub Actions
        'n8n-nodes-base.githubActions.getWorkflowRun',
        'n8n-nodes-base.gitlabCi.mirrorRepository', // GitLab CI Mirror
        'n8n-nodes-base.gitlabCi.runPipelineSchedule',
        'n8n-nodes-base.bitbucket.createWebhook', // Bitbucket Webhooks
        'n8n-nodes-base.bitbucket.deleteWebhook',
        'n8n-nodes-base.azurePipelines.runPipeline',
        'n8n-nodes-base.azurePipelines.getPipelineRun',
        'n8n-nodes-base.jenkins.runJenkinsfile', // Jenkinsfile execution
        'n8n-nodes-base.jenkins.getJobBuilds',
        'n8n-nodes-base.terraform.applyConfiguration', // Terraform
        'n8n-nodes-base.terraform.planConfiguration',
        'n8n-nodes-base.ansible.runPlaybook', // Ansible
        'n8n-nodes-base.ansible.getPlaybookStatus',
        'n8n-nodes-base.newRelic.postMetric',
        'n8n-nodes-base.newRelic.getAlerts',
        'n8n-nodes-base.appDynamics.reportEvent',
        'n8n-nodes-base.appDynamics.getMetrics',
        'n8n-nodes-base.prometheus.pushMetric', // Prometheus Push Gateway
        'n8n-nodes-base.prometheus.queryMetrics',
        'n8n-nodes-base.grafanaLoki.pushLog', // Grafana Loki
        'n8n-nodes-base.grafanaLoki.queryLogs',
        'n8n-nodes-base.sentry.captureException',
        'n8n-nodes-base.sentry.createRelease',

        // File Storage/Manipulation
        'n8n-nodes-base.googleCloudStorage.createSignedUrl',
        'n8n-nodes-base.googleCloudStorage.copyFile',
        'n8n-nodes-base.azureFiles.uploadFile',
        'n8n-nodes-base.azureFiles.downloadFile',
        'n8n-nodes-base.awsEfs.uploadFile',
        'n8n-nodes-base.awsEfs.downloadFile',
        'n8n-nodes-base.sftp.listFiles', // SFTP with wildcards
        'n8n-nodes-base.sftp.deleteFile',
        'n8n-nodes-base.ftps.downloadFile', // FTPS explicit
        'n8n-nodes-base.ftps.uploadFile',
        'n8n-nodes-base.onedrive.createFolder',
        'n8n-nodes-base.onedrive.deleteFolder',
        'n8n-nodes-base.dropbox.createSharedLink',
        'n8n-nodes-base.dropbox.deleteSharedLink',
        'n8n-nodes-base.box.addCollaborator',
        'n8n-nodes-base.box.removeCollaborator',
        'n8n-nodes-base.sharepointOnline.uploadFile',
        'n8n-nodes-base.sharepointOnline.downloadFile',
        'n8n-nodes-base.fileCompressor.compressFiles', // Zip/Tar/Gz
        'n8n-nodes-base.fileCompressor.decompressFiles',

        // IoT/Hardware
        'n8n-nodes-base.mqtt.publishMessage', // MQTT Publisher
        'n8n-nodes-base.mqtt.subscribeTopic'
      ],

      // 🔧 Core (Nodos Básicos)
      core: [
        'n8n-nodes-base.set',
        'n8n-nodes-base.function',
        'n8n-nodes-base.if',
        'n8n-nodes-base.switch',
        'n8n-nodes-base.merge',
        'n8n-nodes-base.splitInBatches',
        'n8n-nodes-base.aggregate',
        'n8n-nodes-base.filter',
        'n8n-nodes-base.sort',
        'n8n-nodes-base.limit',
        'n8n-nodes-base.removeDuplicates',
        'n8n-nodes-base.wait',
        'n8n-nodes-base.errorTrigger',
        'n8n-nodes-base.stopAndError',
        'n8n-nodes-base.splitOut',
        'n8n-nodes-base.loopOverItems',
        'n8n-nodes-base.renameKeys',
        'n8n-nodes-base.moveBinaryData',
        'n8n-nodes-base.convertToJson',
        'n8n-nodes-base.convertToXml',
        'n8n-nodes-base.convertToCsv',
        'n8n-nodes-base.convertToHtml',
        'n8n-nodes-base.convertToPdf',
        'n8n-nodes-base.convertToYaml',
        'n8n-nodes-base.convertToToml',
        'n8n-nodes-base.convertToIni',
        'n8n-nodes-base.convertToProperties',
        'n8n-nodes-base.convertToBase64',
        'n8n-nodes-base.convertToBinary',
        'n8n-nodes-base.convertToString',
        'n8n-nodes-base.convertToDateTime',
        'n8n-nodes-base.convertToTime',
        'n8n-nodes-base.convertToBoolean',
        'n8n-nodes-base.convertToNumber',
        'n8n-nodes-base.convertToArray',
        'n8n-nodes-base.convertToObject',
        'n8n-nodes-base.setMultipleValues',
        'n8n-nodes-base.getMultipleValues',
        'n8n-nodes-base.clearMultipleValues',
        'n8n-nodes-base.incrementMultipleValues',
        'n8n-nodes-base.decrementMultipleValues',
        'n8n-nodes-base.multiplyMultipleValues',
        'n8n-nodes-base.divideMultipleValues',
        'n8n-nodes-base.moduloMultipleValues',
        'n8n-nodes-base.powerMultipleValues',
        'n8n-nodes-base.sqrtMultipleValues',
        'n8n-nodes-base.logMultipleValues',
        'n8n-nodes-base.expMultipleValues',
        'n8n-nodes-base.sinMultipleValues',
        'n8n-nodes-base.cosMultipleValues',
        'n8n-nodes-base.tanMultipleValues',
        'n8n-nodes-base.asinMultipleValues',
        'n8n-nodes-base.acosMultipleValues',
        'n8n-nodes-base.atanMultipleValues',
        'n8n-nodes-base.atan2MultipleValues',
        'n8n-nodes-base.roundMultipleValues',
        'n8n-nodes-base.floorMultipleValues',
        'n8n-nodes-base.ceilMultipleValues',
        'n8n-nodes-base.absMultipleValues',
        'n8n-nodes-base.signMultipleValues',
        'n8n-nodes-base.minMultipleValues',
        'n8n-nodes-base.maxMultipleValues',
        'n8n-nodes-base.sumMultipleValues',
        'n8n-nodes-base.avgMultipleValues',
        'n8n-nodes-base.countMultipleValues',
        'n8n-nodes-base.distinctMultipleValues',
        'n8n-nodes-base.joinMultipleValues',
        'n8n-nodes-base.splitMultipleValues',
        'n8n-nodes-base.replaceMultipleValues',
        'n8n-nodes-base.regexMultipleValues',
        'n8n-nodes-base.substringMultipleValues',
        'n8n-nodes-base.toLowerCaseMultipleValues',
        'n8n-nodes-base.toUpperCaseMultipleValues',
        'n8n-nodes-base.trimMultipleValues',
        'n8n-nodes-base.padStartMultipleValues',
        'n8n-nodes-base.padEndMultipleValues',
        'n8n-nodes-base.startsWithMultipleValues',
        'n8n-nodes-base.endsWithMultipleValues',
        'n8n-nodes-base.includesMultipleValues',
        'n8n-nodes-base.indexOfMultipleValues',
        'n8n-nodes-base.lastIndexOfMultipleValues',
        'n8n-nodes-base.charAtMultipleValues',
        'n8n-nodes-base.charCodeAtMultipleValues',
        'n8n-nodes-base.fromCharCodeMultipleValues',
        'n8n-nodes-base.encodeURIComponentMultipleValues',
        'n8n-nodes-base.decodeURIComponentMultipleValues',
        'n8n-nodes-base.encodeURIMultipleValues',
        'n8n-nodes-base.decodeURIMultipleValues',
        'n8n-nodes-base.parseJsonMultipleValues',
        'n8n-nodes-base.stringifyJsonMultipleValues',
        'n8n-nodes-base.parseXmlMultipleValues',
        'n8n-nodes-base.stringifyXmlMultipleValues',
        'n8n-nodes-base.parseCsvMultipleValues',
        'n8n-nodes-base.stringifyCsvMultipleValues',
        'n8n-nodes-base.parseYamlMultipleValues',
        'n8n-nodes-base.stringifyYamlMultipleValues',
        'n8n-nodes-base.parseTomlMultipleValues',
        'n8n-nodes-base.stringifyTomlMultipleValues',
        'n8n-nodes-base.parseIniMultipleValues',
        'n8n-nodes-base.stringifyIniMultipleValues',
        'n8n-nodes-base.parsePropertiesMultipleValues',
        'n8n-nodes-base.stringifyPropertiesMultipleValues',
        'n8n-nodes-base.parseBase64MultipleValues',
        'n8n-nodes-base.stringifyBase64MultipleValues',
        'n8n-nodes-base.parseBinaryMultipleValues',
        'n8n-nodes-base.stringifyBinaryMultipleValues',
        'n8n-nodes-base.parseDateTimeMultipleValues',
        'n8n-nodes-base.stringifyDateTimeMultipleValues',
        'n8n-nodes-base.parseTimeMultipleValues',
        'n8n-nodes-base.stringifyTimeMultipleValues',
        'n8n-nodes-base.parseBooleanMultipleValues',
        'n8n-nodes-base.stringifyBooleanMultipleValues',
        'n8n-nodes-base.parseNumberMultipleValues',
        'n8n-nodes-base.stringifyNumberMultipleValues',
        'n8n-nodes-base.parseArrayMultipleValues',
        'n8n-nodes-base.stringifyArrayMultipleValues',
        'n8n-nodes-base.parseObjectMultipleValues',
        'n8n-nodes-base.stringifyObjectMultipleValues',

        // --- INICIO DE NUEVOS NODOS CORE AÑADIDOS (Fase 1) ---
        'n8n-nodes-base.dataGenerator', // Generar datos de prueba
        'n8n-nodes-base.deduplicateByField', // Eliminar duplicados por campo específico
        'n8n-nodes-base.hashData', // Hashing de datos
        'n8n-nodes-base.uuid', // Generar UUIDs
        'n8n-nodes-base.delay', // Pausa dinámica
        'n8n-nodes-base.jsonata', // Transformación de datos con JSONata
        'n8n-nodes-base.extractDataRegex', // Extracción de datos por Regex
        'n8n-nodes-base.htmlToMarkdown', // HTML a Markdown
        'n8n-nodes-base.markdownToText', // Markdown a Texto plano
        'n8n-nodes-base.stringCaseConverter', // Convertidor de casos de texto
        'n8n-nodes-base.arrayChunker', // Dividir arrays en chunks
        'n8n-nodes-base.arrayJoin', // Unir elementos de array
        'n8n-nodes-base.arrayMap', // Mapear elementos de array
        'n8n-nodes-base.arrayFilter', // Filtrar elementos de array
        'n8n-nodes-base.dateTimeFormatter', // Formateador de fecha/hora avanzado
        'n8n-nodes-base.durationCalculator', // Cálculo de duración entre fechas
        'n8n-nodes-base.rateLimiter', // Limitador de velocidad de ejecución
        'n8n-nodes-base.circuitBreaker', // Circuit Breaker para tolerancia a fallos
        'n8n-nodes-base.retryLoop', // Bucle con reintentos
        'n8n-nodes-base.jsonCompare', // Comparar dos objetos JSON
        'n8n-nodes-base.xmlToJson', // XML a JSON
        'n8n-nodes-base.jsonToXml', // JSON a XML
        'n8n-nodes-base.csvToJson', // CSV a JSON
        'n8n-nodes-base.jsonToCsv', // JSON a CSV
        'n8n-nodes-base.htmlToText', // HTML a texto plano
        'n8n-nodes-base.textToSpeech', // Texto a voz (sin depender de proveedor específico)
        'n8n-nodes-base.speechToText', // Voz a texto (sin depender de proveedor específico)
        'n8n-nodes-base.passwordHasher', // Hashing de contraseñas
        'n8n-nodes-base.dataObfuscator', // Ofuscación de datos
        'n8n-nodes-base.validateEmail', // Validar formato de email
        'n8n-nodes-base.validateUrl', // Validar formato de URL
        'n8n-nodes-base.generateRandomNumber', // Generar números aleatorios
        'n8n-nodes-base.generateRandomString', // Generar cadenas aleatorias
        // --- FIN DE NUEVOS NODOS CORE AÑADIDOS (Fase 1) ---

        // --- INICIO DE NUEVOS NODOS CORE AÑADIDOS (Fase 2: ~40 Nodos) ---
        // Data Transformation
        'n8n-nodes-base.jsonPathExtractor', // Extract data using JSONPath
        'n8n-nodes-base.xmlPathExtractor', // Extract data using XPath
        'n8n-nodes-base.csvToXml', // Convert CSV to XML
        'n8n-nodes-base.xmlToCsv', // Convert XML to CSV
        'n8n-nodes-base.htmlTableExtractor', // Extract data from HTML tables
        'n8n-nodes-base.textParser', // Advanced text parsing (delimiters, fixed width)
        'n8n-nodes-base.dateTimeDifference', // Calculate difference between two date-times
        'n8n-nodes-base.timezoneConverter', // Convert date-time between timezones
        'n8n-nodes-base.arraySortByField', // Sort array of objects by a specific field
        'n8n-nodes-base.objectKeyMapper', // Map/rename keys in objects
        'n8n-nodes-base.dataAnonymizer', // Anonymize sensitive data in fields
        'n8n-nodes-base.dataSanitizer', // Clean and sanitize string data
        'n8n-nodes-base.dataAggregator', // More complex data aggregation (group by, sum, avg)

        // Control Flow
        'n8n-nodes-base.loopWithIndex', // Loop through items with index access
        'n8n-nodes-base.conditionalStop', // Stop workflow execution based on a condition
        'n8n-nodes-base.timeoutHandler', // Set a timeout for downstream operations
        'n8n-nodes-base.parallelExecution', // Execute multiple branches in parallel
        'n8n-nodes-base.retryWithExponentialBackoff', // Retry logic with exponential backoff
        'n8n-nodes-base.semaphore', // Control concurrency of subsequent nodes
        'n8n-nodes-base.queueMessage', // Internal queueing for flow control

        // Utility
        'n8n-nodes-base.fileConcatenator', // Concatenate multiple binary files
        'n8n-nodes-base.directoryLister', // List files/folders in a directory (local/sftp)
        'n8n-nodes-base.envVarGetter', // Get environment variables
        'n8n-nodes-base.envVarSetter', // Set environment variables (for subsequent nodes)
        'n8n-nodes-base.secretManagerAccess', // Generic access to secret managers
        'n8n-nodes-base.timestampGenerator', // Generate Unix timestamps
        'n8n-nodes-base.uuidGenerator', // Generate UUIDs (v1, v3, v4, v5)
        'n8n-nodes-base.checksumCalculator', // Calculate file checksums (MD5, SHA1, SHA256)
        'n8n-nodes-base.fileEncodingConverter', // Convert text file encoding

        // Advanced Logic
        'n8n-nodes-base.customCodePython', // Execute custom Python code
        'n8n-nodes-base.customCodeGo', // Execute custom Go code
        'n8n-nodes-base.customCodeRuby', // Execute custom Ruby code
        'n8n-nodes-base.mlModelInvoker', // Generic node to invoke an ML model API
        'n8n-nodes-base.webhookResponder', // Advanced webhook response customization
        'n8n-nodes-base.inMemoryCache', // Simple in-memory cache for items
        'n8n-nodes-base.externalApiCall', // Generic external API call node (more flexible than HTTP Request for complex scenarios)
        // --- FIN DE NUEVOS NODOS CORE AÑADIDOS (Fase 2) ---

        // --- INICIO DE NUEVOS NODOS CORE AÑADIDOS (Fase 3: ~40 Nodos) ---
        // Data Transformation & Validation
        'n8n-nodes-base.jsonDiff', // Compare two JSON objects and find differences
        'n8n-nodes-base.xmlDiff', // Compare two XML documents and find differences
        'n8n-nodes-base.csvMerger', // Merge multiple CSV files
        'n8n-nodes-base.htmlToImage', // Convert HTML content to an image (e.g., PNG, JPEG)
        'n8n-nodes-base.imageToTextOcr', // Perform OCR on an image to extract text
        'n8n-nodes-base.jsonSchemaGenerator', // Generate a JSON Schema from sample JSON data
        'n8n-nodes-base.dataValidator', // Validate data against custom rules or schema
        'n8n-nodes-base.dataMapperAdvanced', // Advanced data mapping with complex expressions
        'n8n-nodes-base.dataTypeConverter', // Strictly convert data types (e.g., "123" to number 123, error on "abc")

        // Control Flow Enhancements
        'n8n-nodes-base.loopUntilCondition', // Loop until a specified condition is met
        'n8n-nodes-base.breakContinueLoop', // Control `for each` loops (break or continue)
        'n8n-nodes-base.errorBoundary', // Define an error handling boundary for a sub-workflow
        'n8n-nodes-base.fallbackMechanism', // Provide a fallback path if a preceding node fails
        'n8n-nodes-base.stateMachine', // Implement a basic state machine for complex workflows
        'n8n-nodes-base.dynamicRouter', // Route items dynamically based on expressions

        // Advanced Utility & Integrations
        'n8n-nodes-base.geocodeAddress', // Generic geocoding for addresses
        'n8n-nodes-base.reverseGeocode', // Reverse geocoding (coordinates to address)
        'n8n-nodes-base.ipLookupDetails', // Detailed IP address lookup (ASN, organization)
        'n8n-nodes-base.urlParser', // Parse URL into components (protocol, host, path, query)
        'n8n-nodes-base.emailParserAdvanced', // Advanced email parsing (attachments, headers)
        'n8n-nodes-base.phoneNumberFormatter', // Format phone numbers to international standards
        'n8n-nodes-base.creditCardValidator', // Validate credit card numbers (Luhn algorithm, format)
        'n8n-nodes-base.dataMaskerPii', // Mask Personally Identifiable Information (PII)
        'n8n-nodes-base.textSummarizer', // Summarize long text content
        'n8n-nodes-base.keywordExtractor', // Extract keywords from text
        'n8n-nodes-base.sentimentAnalyzerBasic', // Basic sentiment analysis (positive/negative/neutral)
        'n8n-nodes-base.languageDetectorBasic', // Basic language detection for text
        'n8n-nodes-base.webAssemblyRunner', // Execute WebAssembly modules
        'n8n-nodes-base.dockerComposeRunner', // Run Docker Compose commands
        'n8n-nodes-base.gitCommandExecutor', // Execute Git commands
        'n8n-nodes-base.sshTunnelManager', // Manage SSH tunnels for secure connections
        'n8n-nodes-base.databaseConnectionPool', // Manage database connection pooling
        'n8n-nodes-base.apiKeyRotator', // Rotate API keys from a secret store
        'n8n-nodes-base.timezoneListProvider', // Provide a list of all valid timezones
        'n8n-nodes-base.publicHolidayChecker', // Check if a given date is a public holiday in a region
        // --- FIN DE NUEVOS NODOS CORE AÑADIDOS (Fase 3) ---

        // --- INICIO DE NUEVOS NODOS AÑADIDOS (Fase 4: ~140 Nodos Adicionales) ---

        // 🚀 Triggers (Disparadores Adicionales) - 10 Nodos
        'n8n-nodes-base.firestoreTrigger', // Firestore Document Change
        'n8n-nodes-base.googlePubSubTrigger', // Google Cloud Pub/Sub Message
        'n8n-nodes-base.awsSqsTrigger', // AWS SQS Message
        'n8n-nodes-base.stripeWebhookTrigger', // Stripe Webhook Event
        'n8n-nodes-base.githubWebhookTrigger', // GitHub Webhook Event (more specific than generic trigger)
        'n8n-nodes-base.shopifyWebhookTrigger', // Shopify Webhook Event
        'n8n-nodes-base.newTweetTrigger', // New Tweet from specific user/keyword
        'n8n-nodes-base.s3FileEventTrigger', // AWS S3 File Upload/Delete
        'n8n-nodes-base.inboundEmailParserTrigger', // Trigger on parsed inbound email
        'n8n-nodes-base.googleFormsResponseTrigger', // Google Forms new response

        // ⚡ Actions (Acciones Adicionales) - 90 Nodos
        // AI/ML & Data Science (15 Nodos)
        'n8n-nodes-base.awsTextract.analyzeDocument', // AWS Textract
        'n8n-nodes-base.azureOpenAi.chatCompletion', // Azure OpenAI Service
        'n8n-nodes-base.googleCloudNaturalLanguage.analyzeSentiment', // Google NL
        'n8n-nodes-base.tensorflow.runModel', // Generic TensorFlow Model execution
        'n8n-nodes-base.pytorch.runModel', // Generic PyTorch Model execution
        'n8n-nodes-base.huggingFace.summarization', // HF Summarization pipeline
        'n8n-nodes-base.huggingFace.translation', // HF Translation pipeline
        'n8n-nodes-base.langchain.executeChain', // LangChain for LLM orchestration
        'n8n-nodes-base.pinecone.upsertVector', // Pinecone Vector DB
        'n8n-nodes-base.weaviate.addDocument', // Weaviate Vector DB
        'n8n-nodes-base.milvus.insertVector', // Milvus Vector DB
        'n8n-nodes-base.mlflow.logMetric', // MLflow for MLOps
        'n8n-nodes-base.kubeflow.runPipeline', // Kubeflow for MLOps
        'n8n-nodes-base.replicate.cancelPrediction', // Replicate cancel
        'n8n-nodes-base.stabilityAi.imageToImage', // Stability AI Image to Image

        // Cloud & DevOps (15 Nodos)
        'n8n-nodes-base.awsCloudWatch.putMetricData', // AWS CloudWatch
        'n8n-nodes-base.awsSecretsManager.getSecret', // AWS Secrets Manager
        'n8n-nodes-base.azureKeyVault.getSecret', // Azure Key Vault
        'n8n-nodes-base.googleSecretManager.getSecret', // Google Secret Manager
        'n8n-nodes-base.hashicorpVault.readSecret', // HashiCorp Vault
        'n8n-nodes-base.awsEcs.runTask', // AWS ECS
        'n8n-nodes-base.azureFunctions.invokeFunction', // Azure Functions specific invoke
        'n8n-nodes-base.googleCloudBuild.startBuild', // Google Cloud Build
        'n8n-nodes-base.kubernetes.runPod', // Kubernetes Pod
        'n8n-nodes-base.terraformCloud.applyWorkspace', // Terraform Cloud
        'n8n-nodes-base.ansibleTower.launchJobTemplate', // Ansible Tower
        'n8n-nodes-base.dockerHub.triggerBuild', // Docker Hub
        'n8n-nodes-base.azureContainerRegistry.buildImage', // Azure Container Registry
        'n8n-nodes-base.digitalOceanKubernetes.createCluster', // Digital Ocean Kubernetes
        'n8n-nodes-base.vercel.getDeployments', // Vercel deployments

        // CRM / Sales / Marketing (10 Nodos)
        'n8n-nodes-base.zendesk.updateTicket', // Zendesk update
        'n8n-nodes-base.freshdesk.updateTicket', // Freshdesk update
        'n8n-nodes-base.pipedrive.updateActivity', // Pipedrive update activity
        'n8n-nodes-base.mailchimp.updateMember', // Mailchimp update member
        'n8n-nodes-base.constantContact.addContact', // Constant Contact
        'n8n-nodes-base.convertkit.addSubscriber', // ConvertKit
        'n8n-nodes-base.sendpulse.sendEmail', // Sendpulse
        'n8n-nodes-base.gainsight.createEngagement', // Gainsight
        'n8n-nodes-base.drift.updateContact', // Drift update contact
        'n8n-nodes-base.apolloIo.createPerson', // Apollo.io

        // E-commerce & Payments (10 Nodos)
        'n8n-nodes-base.stripeCheckout.createSession', // Stripe Checkout
        'n8n-nodes-base.stripeConnect.transferMoney', // Stripe Connect Transfer
        'n8n-nodes-base.gocardless.createPayment', // GoCardless
        'n8n-nodes-base.wise.createTransfer', // Wise (TransferWise)
        'n8n-nodes-base.coinbase.sendMoney', // Coinbase
        'n8n-nodes-base.etsy.updateListing', // Etsy update
        'n8n-nodes-base.bigcommerce.updateOrder', // BigCommerce update order
        'n8n-nodes-base.recart.sendSms', // Recart for abandoned carts
        'n8n-nodes-base.lemonSqueezy.createProduct', // Lemon Squeezy
        'n8n-nodes-base.paddle.updateCustomer', // Paddle update customer

        // Databases & Data Warehousing (10 Nodos)
        'n8n-nodes-base.mongoDb.deleteMany', // MongoDB delete many
        'n8n-nodes-base.postgres.truncateTable', // PostgreSQL truncate
        'n8n-nodes-base.mysql.endTransaction', // MySQL commit/rollback
        'n8n-nodes-base.redis.getSet', // Redis set operations
        'n8n-nodes-base.elasticsearch.createIndex', // ES create index
        'n8n-nodes-base.dynamodb.updateItem', // DynamoDB update item
        'n8n-nodes-base.snowflake.insertData', // Snowflake insert
        'n8n-nodes-base.bigquery.insertRows', // BigQuery insert
        'n8n-nodes-base.redshift.copyFromS3', // Redshift S3 copy
        'n8n-nodes-base.vectorDb.queryVector', // Generic Vector DB Query

        // Communication & Productivity (10 Nodos)
        'n8n-nodes-base.discord.createThread', // Discord create thread
        'n8n-nodes-base.telegram.sendDocument', // Telegram send document
        'n8n-nodes-base.zoom.createWebinar', // Zoom webinar
        'n8n-nodes-base.microsoftTeams.sendCard', // Teams adaptive card
        'n8n-nodes-base.outlookCalendar.createEvent', // Outlook Calendar
        'n8n-nodes-base.calendly.createEvent', // Calendly
        'n8n-nodes-base.miro.createBoard', // Miro board
        'n8n-nodes-base.figma.getFiles', // Figma files
        'n8n-nodes-base.googleVoice.sendSms', // Google Voice
        'n8n-nodes-base.twilioConference.startConference', // Twilio Conference

        // IoT & Hardware (5 Nodos)
        'n8n-nodes-base.mqtt.readTopic', // MQTT read topic
        'n8n-nodes-base.modbus.readRegister', // Modbus TCP/RTU
        'n8n-nodes-base.bacnet.readProperty', // BACnet IP
        'n8n-nodes-base.lorawan.sendMessage', // LoRaWAN
        'n8n-nodes-base.edgeDevice.sendCommand', // Generic Edge Device Command

        // Other Web Services & APIs (15 Nodos)
        'n8n-nodes-base.googleMaps.getDirections', // Google Maps Directions
        'n8n-nodes-base.openStreetMap.reverseGeocode', // OSM reverse geocode
        'n8n-nodes-base.shopifyAdmin.updateProductMetafield', // Shopify Admin API (more specific)
        'n8n-nodes-base.stripeConnect.retrieveBalance', // Stripe Connect Balance
        'n8n-nodes-base.firebaseAdmin.updateUser', // Firebase Admin update user
        'n8n-nodes-base.supabaseAdmin.updateUser', // Supabase Admin update user
        'n8n-nodes-base.auth0.updateUser', // Auth0 update user
        'n8n-nodes-base.okta.updateUser', // Okta update user
        'n8n-nodes-base.intercom.tagContact', // Intercom tag contact
        'n8n-nodes-base.freshchat.createConversation', // Freshchat create conversation
        'n8n-nodes-base.zapier.runZap', // More specific Zapier action
        'n8n-nodes-base.makecom.triggerWebhook', // More specific Make.com action
        'n8n-nodes-base.linear.updateIssue', // Linear update
        'n8n-nodes-base.jiraServiceManagement.updateRequest', // Jira SM update
        'n8n-nodes-base.discord.removeRoleFromUser', // Discord remove role

        // 🔧 Core (Nodos Básicos Adicionales) - 40 Nodos
        // Data Transformation & Validation (10 Nodos)
        'n8n-nodes-base.jsonToYaml', // JSON to YAML
        'n8n-nodes-base.yamlToJson', // YAML to JSON
        'n8n-nodes-base.objectFlatten', // Flatten nested objects
        'n8n-nodes-base.objectUnflatten', // Unflatten objects
        'n8n-nodes-base.arrayUnique', // Get unique values from an array
        'n8n-nodes-base.arrayIntersection', // Get intersection of two arrays
        'n8n-nodes-base.arrayUnion', // Get union of two arrays
        'n8n-nodes-base.xmlValidator', // Validate XML against a schema
        'n8n-nodes-base.jsonPathMutator', // Modify JSON data using JSONPath
        'n8n-nodes-base.dataLookup', // Lookup data in an array/object by key

        // Control Flow Enhancements (10 Nodos)
        'n8n-nodes-base.dynamicFork', // Dynamically fork workflow paths
        'n8n-nodes-base.circuitBreakerReset', // Manually reset a circuit breaker
        'n8n-nodes-base.debounce', // Debounce incoming items
        'n8n-nodes-base.throttle', // Throttle incoming items
        'n8n-nodes-base.concurrentBatch', // Process items in concurrent batches
        'n8n-nodes-base.randomSplit', // Randomly split items into branches
        'n8n-nodes-base.sequentialLoop', // Explicit sequential loop
        'n8n-nodes-base.runSubWorkflow', // Run a nested workflow
        'n8n-nodes-base.conditionalMerge', // Merge branches based on condition
        'n8n-nodes-base.dynamicSchedule', // Schedule an event dynamically

        // Utility & Development (10 Nodos)
        'n8n-nodes-base.base64ToFile', // Convert Base64 string to binary file
        'n8n-nodes-base.fileToBase64', // Convert binary file to Base64 string
        'n8n-nodes-base.qrCodeReader', // Read QR code from image
        'n8n-nodes-base.barcodeReader', // Read barcode from image
        'n8n-nodes-base.ipRangeChecker', // Check if IP is in a range
        'n8n-nodes-base.urlEncoder', // URL encode a string
        'n8n-nodes-base.urlDecoder', // URL decode a string
        'n8n-nodes-base.htmlSanitizer', // Sanitize HTML to prevent XSS
        'n8n-nodes-base.markdownToPdf', // Markdown to PDF conversion
        'n8n-nodes-base.csvDiff', // Compare two CSV files

        // System & Advanced (10 Nodos)
        'n8n-nodes-base.systemInfo', // Get system information (OS, CPU, Memory)
        'n8n-nodes-base.processExecutor', // Execute external shell commands (advanced with safety)
        'n8n-nodes-base.environmentVariableManager', // CRUD operations for env vars
        'n8n-nodes-base.customAuthenticationBuilder', // Build custom auth headers
        'n8n-nodes-base.oauth2TokenRefresher', // Generic OAuth2 token refresher
        'n8n-nodes-base.webSocketClient', // WebSocket client connect/send/receive
        'n8n-nodes-base.grpcClient', // gRPC client request
        'n8n-nodes-base.ldapQuery', // LDAP query
        'n8n-nodes-base.sshExecuteCommand', // SSH execute command (more secure)
        'n8n-nodes-base.sftpSyncDirectory' // SFTP sync directory
        // --- FIN DE NUEVOS NODOS AÑADIDOS (Fase 4) ---
      ]
    };
  }

  /**
   * 🎯 Validaciones específicas por tipo de nodo
   *
   * Se han añadido validaciones detalladas para los nuevos nodos,
   * incluyendo parámetros requeridos, validaciones de formato y
   * las credenciales asociadas.
   */
  getNodeValidations() {
    return {
      // (Mantener todas las validaciones existentes de la fase 1 y 2 aquí)
      // ... (código de validaciones de la Fase 1 y 2) ...

      // Gmail - Validaciones específicas
      'n8n-nodes-base.gmail': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['send', 'getAll', 'get'].includes(params.operation)) {
            return 'Operación no válida para Gmail';
          }
          if (params.operation === 'send' && !params.subject) {
            return 'Subject requerido para enviar email';
          }
          if (params.operation === 'send' && !params.toEmail) {
            return 'Destinatario requerido para enviar email';
          }
          return null;
        },
        credentials: ['gmailOAuth2'],
        supportedOperations: ['send', 'getAll', 'get']
      },

      // Slack - Validaciones específicas
      'n8n-nodes-base.slack': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['send', 'getAll', 'get'].includes(params.operation)) {
            return 'Operación no válida para Slack';
          }
          if (params.operation === 'send' && !params.channel) {
            return 'Canal requerido para enviar mensaje';
          }
          return null;
        },
        credentials: ['slackApi'],
        supportedOperations: ['send', 'getAll', 'get']
      },

      // HTTP Request - Validaciones específicas
      'n8n-nodes-base.httpRequest': {
        requiredParams: ['url', 'method'],
        validateParams: (params) => {
          if (!params.url) {
            return 'URL requerida para HTTP Request';
          }
          if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(params.method)) {
            return 'Método HTTP no válido';
          }
          return null;
        },
        credentials: [], // Opcional
        supportedOperations: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
      },

      // Webhook - Validaciones específicas
      'n8n-nodes-base.webhook': {
        requiredParams: ['httpMethod', 'path'],
        validateParams: (params) => {
          if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(params.httpMethod)) {
            return 'Método HTTP no válido para webhook';
          }
          if (!params.path || params.path.length === 0) {
            return 'Path requerido para webhook';
          }
          return null;
        },
        credentials: [],
        supportedOperations: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
      },

      // Google Sheets - Validaciones específicas
      'n8n-nodes-base.googleSheets': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['read', 'write', 'append', 'update', 'clear', 'delete'].includes(params.operation)) {
            return 'Operación no válida para Google Sheets';
          }
          if (!params.sheetId) {
            return 'Sheet ID requerido';
          }
          return null;
        },
        credentials: ['googleSheetsOAuth2'],
        supportedOperations: ['read', 'write', 'append', 'update', 'clear', 'delete']
      },

      // Notion - Validaciones específicas
      'n8n-nodes-base.notion': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getAll', 'get', 'create', 'update', 'delete', 'search'].includes(params.operation)) {
            return 'Operación no válida para Notion';
          }
          return null;
        },
        credentials: ['notionApi'],
        supportedOperations: ['getAll', 'get', 'create', 'update', 'delete', 'search']
      },

      // Airtable - Validaciones específicas
      'n8n-nodes-base.airtable': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getAll', 'get', 'create', 'update', 'delete', 'search'].includes(params.operation)) {
            return 'Operación no válida para Airtable';
          }
          if (!params.baseId) {
            return 'Base ID requerido';
          }
          if (!params.table) {
            return 'Table requerido';
          }
          return null;
        },
        credentials: ['airtableApi'],
        supportedOperations: ['getAll', 'get', 'create', 'update', 'delete', 'search']
      },

      // Trello - Validaciones específicas
      'n8n-nodes-base.trello': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getAll', 'get', 'create', 'update', 'delete', 'move'].includes(params.operation)) {
            return 'Operación no válida para Trello';
          }
          return null;
        },
        credentials: ['trelloApi'],
        supportedOperations: ['getAll', 'get', 'create', 'update', 'delete', 'move']
      },

      // Jira - Validaciones específicas
      'n8n-nodes-base.jira': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getAll', 'get', 'create', 'update', 'delete', 'search'].includes(params.operation)) {
            return 'Operación no válida para Jira';
          }
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['getAll', 'get', 'create', 'update', 'delete', 'search']
      },

      // GitHub - Validaciones específicas
      'n8n-nodes-base.github': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getRepositories', 'getRepository', 'getIssues', 'createIssue', 'updateIssue', 'getPullRequests', 'createPullRequest'].includes(params.operation)) {
            return 'Operación no válida para GitHub';
          }
          return null;
        },
        credentials: ['githubApi'],
        supportedOperations: ['getRepositories', 'getRepository', 'getIssues', 'createIssue', 'updateIssue', 'getPullRequests', 'createPullRequest']
      },

      // MySQL - Validaciones específicas
      'n8n-nodes-base.mysql': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['select', 'insert', 'update', 'delete', 'executeQuery'].includes(params.operation)) {
            return 'Operación no válida para MySQL';
          }
          return null;
        },
        credentials: ['mySql'],
        supportedOperations: ['select', 'insert', 'update', 'delete', 'executeQuery']
      },

      // PostgreSQL - Validaciones específicas
      'n8n-nodes-base.postgres': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['select', 'insert', 'update', 'delete', 'executeQuery'].includes(params.operation)) {
            return 'Operación no válida para PostgreSQL';
          }
          return null;
        },
        credentials: ['postgres'],
        supportedOperations: ['select', 'insert', 'update', 'delete', 'executeQuery']
      },

      // MongoDB - Validaciones específicas
      'n8n-nodes-base.mongoDb': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['find', 'insert', 'update', 'delete', 'aggregate'].includes(params.operation)) {
            return 'Operación no válida para MongoDB';
          }
          return null;
        },
        credentials: ['mongoDb'],
        supportedOperations: ['find', 'insert', 'update', 'delete', 'aggregate']
      },

      // Redis - Validaciones específicas
      'n8n-nodes-base.redis': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['get', 'set', 'del', 'exists', 'expire', 'ttl', 'keys', 'hget', 'hset', 'hdel', 'lpush', 'rpush', 'lpop', 'rpop'].includes(params.operation)) {
            return 'Operación no válida para Redis';
          }
          return null;
        },
        credentials: ['redis'],
        supportedOperations: ['get', 'set', 'del', 'exists', 'expire', 'ttl', 'keys', 'hget', 'hset', 'hdel', 'lpush', 'rpush', 'lpop', 'rpop']
      },

      // Elasticsearch - Validaciones específicas
      'n8n-nodes-base.elasticsearch': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['search', 'index', 'get', 'update', 'delete', 'bulk'].includes(params.operation)) {
            return 'Operación no válida para Elasticsearch';
          }
          return null;
        },
        credentials: ['elasticsearchApi'],
        supportedOperations: ['search', 'index', 'get', 'update', 'delete', 'bulk']
      },

      // AWS S3 - Validaciones específicas
      'n8n-nodes-base.awsS3': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getObject', 'putObject', 'deleteObject', 'listObjects', 'copyObject', 'getSignedUrl'].includes(params.operation)) {
            return 'Operación no válida para AWS S3';
          }
          if (!params.bucket) {
            return 'Bucket requerido para AWS S3';
          }
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['getObject', 'putObject', 'deleteObject', 'listObjects', 'copyObject', 'getSignedUrl']
      },

      // Twilio - Validaciones específicas
      'n8n-nodes-base.twilio': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['sendSms', 'sendWhatsApp', 'makeCall', 'getMessage', 'getMessages'].includes(params.operation)) {
            return 'Operación no válida para Twilio';
          }
          if ((params.operation === 'sendSms' || params.operation === 'sendWhatsApp') && !params.to) {
            return 'Número de destino requerido';
          }
          return null;
        },
        credentials: ['twilioApi'],
        supportedOperations: ['sendSms', 'sendWhatsApp', 'makeCall', 'getMessage', 'getMessages']
      },

      // SendGrid - Validaciones específicas
      'n8n-nodes-base.sendGrid': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['send', 'getContacts', 'addContact'].includes(params.operation)) {
            return 'Operación no válida para SendGrid';
          }
          if (params.operation === 'send' && !params.toEmail) {
            return 'Email de destino requerido';
          }
          return null;
        },
        credentials: ['sendGridApi'],
        supportedOperations: ['send', 'getContacts', 'addContact']
      },

      // Postmark - Validaciones específicas
      'n8n-nodes-base.postmark': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['send', 'getMessage', 'getMessages'].includes(params.operation)) {
            return 'Operación no válida para Postmark';
          }
          if (params.operation === 'send' && !params.toEmail) {
            return 'Email de destino requerido';
          }
          return null;
        },
        credentials: ['postmarkApi'],
        supportedOperations: ['send', 'getMessage', 'getMessages']
      },

      // Mailgun - Validaciones específicas
      'n8n-nodes-base.mailgun': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['send', 'getEvents', 'getStats'].includes(params.operation)) {
            return 'Operación no válida para Mailgun';
          }
          if (params.operation === 'send' && !params.to) {
            return 'Email de destino requerido';
          }
          return null;
        },
        credentials: ['mailgunApi'],
        supportedOperations: ['send', 'getEvents', 'getStats']
      },

      // Dropbox - Validaciones específicas
      'n8n-nodes-base.dropbox': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['upload', 'download', 'delete', 'list', 'createFolder', 'search'].includes(params.operation)) {
            return 'Operación no válida para Dropbox';
          }
          return null;
        },
        credentials: ['dropboxOAuth2'],
        supportedOperations: ['upload', 'download', 'delete', 'list', 'createFolder', 'search']
      },

      // Box - Validaciones específicas
      'n8n-nodes-base.box': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['upload', 'download', 'delete', 'list', 'createFolder', 'search'].includes(params.operation)) {
            return 'Operación no válida para Box';
          }
          return null;
        },
        credentials: ['boxOAuth2'],
        supportedOperations: ['upload', 'download', 'delete', 'list', 'createFolder', 'search']
      },

      // OneDrive - Validaciones específicas
      'n8n-nodes-base.onedrive': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['upload', 'download', 'delete', 'list', 'createFolder', 'search'].includes(params.operation)) {
            return 'Operación no válida para OneDrive';
          }
          return null;
        },
        credentials: ['microsoftOAuth2'],
        supportedOperations: ['upload', 'download', 'delete', 'list', 'createFolder', 'search']
      },

      // Google Drive - Validaciones específicas
      'n8n-nodes-base.googleDrive': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['upload', 'download', 'delete', 'list', 'createFolder', 'search', 'copy', 'move'].includes(params.operation)) {
            return 'Operación no válida para Google Drive';
          }
          return null;
        },
        credentials: ['googleDriveOAuth2'],
        supportedOperations: ['upload', 'download', 'delete', 'list', 'createFolder', 'search', 'copy', 'move']
      },

      // Google Calendar - Validaciones específicas
      'n8n-nodes-base.googleCalendar': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getEvents', 'createEvent', 'updateEvent', 'deleteEvent', 'getCalendars'].includes(params.operation)) {
            return 'Operación no válida para Google Calendar';
          }
          return null;
        },
        credentials: ['googleCalendarOAuth2'],
        supportedOperations: ['getEvents', 'createEvent', 'updateEvent', 'deleteEvent', 'getCalendars']
      },

      // Google Docs - Validaciones específicas
      'n8n-nodes-base.googleDocs': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['readDocument', 'createDocument', 'updateDocument', 'deleteDocument'].includes(params.operation)) {
            return 'Operación no válida para Google Docs';
          }
          return null;
        },
        credentials: ['googleDocsOAuth2'],
        supportedOperations: ['readDocument', 'createDocument', 'updateDocument', 'deleteDocument']
      },

      // Zoho CRM - Validaciones específicas
      'n8n-nodes-base.zohoCrm': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['get', 'getAll', 'create', 'update', 'delete', 'search'].includes(params.operation)) {
            return 'Operación no válida para Zoho CRM';
          }
          return null;
        },
        credentials: ['zohoOAuth2'],
        supportedOperations: ['get', 'getAll', 'create', 'update', 'delete', 'search']
      },

      // Salesforce - Validaciones específicas
      'n8n-nodes-base.salesforce': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['query', 'create', 'update', 'delete', 'getAll'].includes(params.operation)) {
            return 'Operación no válida para Salesforce';
          }
          return null;
        },
        credentials: ['salesforceOAuth2'],
        supportedOperations: ['query', 'create', 'update', 'delete', 'getAll']
      },

      // HubSpot - Validaciones específicas
      'n8n-nodes-base.hubspot': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getContacts', 'createContact', 'updateContact', 'deleteContact', 'getCompanies', 'createCompany', 'updateCompany', 'deleteCompany'].includes(params.operation)) {
            return 'Operación no válida para HubSpot';
          }
          return null;
        },
        credentials: ['hubspotOAuth2'],
        supportedOperations: ['getContacts', 'createContact', 'updateContact', 'deleteContact', 'getCompanies', 'createCompany', 'updateCompany', 'deleteCompany']
      },

      // Pipedrive - Validaciones específicas
      'n8n-nodes-base.pipedrive': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getPersons', 'createPerson', 'updatePerson', 'deletePerson', 'getDeals', 'createDeal', 'updateDeal', 'deleteDeal'].includes(params.operation)) {
            return 'Operación no válida para Pipedrive';
          }
          return null;
        },
        credentials: ['pipedriveApi'],
        supportedOperations: ['getPersons', 'createPerson', 'updatePerson', 'deletePerson', 'getDeals', 'createDeal', 'updateDeal', 'deleteDeal']
      },

      // Asana - Validaciones específicas
      'n8n-nodes-base.asana': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getTasks', 'createTask', 'updateTask', 'deleteTask', 'getProjects', 'createProject'].includes(params.operation)) {
            return 'Operación no válida para Asana';
          }
          return null;
        },
        credentials: ['asanaOAuth2'],
        supportedOperations: ['getTasks', 'createTask', 'updateTask', 'deleteTask', 'getProjects', 'createProject']
      },

      // Todoist - Validaciones específicas
      'n8n-nodes-base.todoist': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getTasks', 'createTask', 'updateTask', 'deleteTask', 'getProjects', 'createProject'].includes(params.operation)) {
            return 'Operación no válida para Todoist';
          }
          return null;
        },
        credentials: ['todoist'],
        supportedOperations: ['getTasks', 'createTask', 'updateTask', 'deleteTask', 'getProjects', 'createProject']
      },

      // ClickUp - Validaciones específicas
      'n8n-nodes-base.clickup': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getTasks', 'createTask', 'updateTask', 'deleteTask', 'getLists', 'createList'].includes(params.operation)) {
            return 'Operación no válida para ClickUp';
          }
          return null;
        },
        credentials: ['clickupApi'],
        supportedOperations: ['getTasks', 'createTask', 'updateTask', 'deleteTask', 'getLists', 'createList']
      },

      // Monday.com - Validaciones específicas
      'n8n-nodes-base.mondayCom': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getItems', 'createItem', 'updateItem', 'deleteItem', 'getBoards', 'createBoard'].includes(params.operation)) {
            return 'Operación no válida para Monday.com';
          }
          return null;
        },
        credentials: ['mondayComApi'],
        supportedOperations: ['getItems', 'createItem', 'updateItem', 'deleteItem', 'getBoards', 'createBoard']
      },

      // GitLab - Validaciones específicas
      'n8n-nodes-base.gitlab': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getProjects', 'getProject', 'getIssues', 'createIssue', 'updateIssue', 'getMergeRequests', 'createMergeRequest'].includes(params.operation)) {
            return 'Operación no válida para GitLab';
          }
          return null;
        },
        credentials: ['gitlabApi'],
        supportedOperations: ['getProjects', 'getProject', 'getIssues', 'createIssue', 'updateIssue', 'getMergeRequests', 'createMergeRequest']
      },

      // Bitbucket - Validaciones específicas
      'n8n-nodes-base.bitbucket': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['getRepositories', 'getRepository', 'getIssues', 'createIssue', 'getPullRequests', 'createPullRequest'].includes(params.operation)) {
            return 'Operación no válida para Bitbucket';
          }
          return null;
        },
        credentials: ['bitbucketApi'],
        supportedOperations: ['getRepositories', 'getRepository', 'getIssues', 'createIssue', 'getPullRequests', 'createPullRequest']
      },

      // Mattermost - Validaciones específicas
      'n8n-nodes-base.mattermost': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['post', 'getPosts', 'getChannels', 'createChannel'].includes(params.operation)) {
            return 'Operación no válida para Mattermost';
          }
          if (params.operation === 'post' && !params.channelId) {
            return 'Channel ID requerido para enviar mensaje';
          }
          return null;
        },
        credentials: ['mattermostApi'],
        supportedOperations: ['post', 'getPosts', 'getChannels', 'createChannel']
      },

      // Rocket.Chat - Validaciones específicas
      'n8n-nodes-base.rocketchat': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['post', 'getMessages', 'getChannels', 'createChannel'].includes(params.operation)) {
            return 'Operación no válida para Rocket.Chat';
          }
          if (params.operation === 'post' && !params.channel) {
            return 'Canal requerido para enviar mensaje';
          }
          return null;
        },
        credentials: ['rocketchatApi'],
        supportedOperations: ['post', 'getMessages', 'getChannels', 'createChannel']
      },

      // Microsoft Teams - Validaciones específicas
      'n8n-nodes-base.microsoftTeams': {
        requiredParams: ['operation'],
        validateParams: (params) => {
          if (!['sendMessage', 'getMessages', 'getChannels', 'createChannel'].includes(params.operation)) {
            return 'Operación no válida para Microsoft Teams';
          }
          if (params.operation === 'sendMessage' && !params.channelId) {
            return 'Channel ID requerido para enviar mensaje';
          }
          return null;
        },
        credentials: ['microsoftTeamsOAuth2'],
        supportedOperations: ['sendMessage', 'getMessages', 'getChannels', 'createChannel']
      },

      // --- INICIO DE VALIDACIONES PARA NUEVOS NODOS (Fase 1) ---

      // OpenAI - Chat Completion
      'n8n-nodes-base.openai.chatCompletion': {
        requiredParams: ['model', 'messages'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido para chat completion';
          if (!Array.isArray(params.messages) || params.messages.length === 0) return 'Mensajes requeridos para chat completion';
          return null;
        },
        credentials: ['openAiApi'],
        supportedOperations: ['chatCompletion']
      },
      // OpenAI - Embedding
      'n8n-nodes-base.openai.embedding': {
        requiredParams: ['model', 'input'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido para embedding';
          if (!params.input) return 'Input de texto requerido para embedding';
          return null;
        },
        credentials: ['openAiApi'],
        supportedOperations: ['embedding']
      },
      // OpenAI - Image Generation
      'n8n-nodes-base.openai.imageGeneration': {
        requiredParams: ['prompt'],
        validateParams: (params) => {
          if (!params.prompt) return 'Prompt requerido para generación de imagen';
          return null;
        },
        credentials: ['openAiApi'],
        supportedOperations: ['imageGeneration']
      },
      // OpenAI - Speech To Text
      'n8n-nodes-base.openai.speechToText': {
        requiredParams: ['model', 'audioFile'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido (ej. "whisper-1")';
          if (!params.audioFile) return 'Archivo de audio requerido';
          return null;
        },
        credentials: ['openAiApi'],
        supportedOperations: ['speechToText']
      },
      // OpenAI - Text To Speech
      'n8n-nodes-base.openai.textToSpeech': {
        requiredParams: ['model', 'voice', 'text'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido (ej. "tts-1")';
          if (!params.voice) return 'Voz requerida';
          if (!params.text) return 'Texto a sintetizar requerido';
          return null;
        },
        credentials: ['openAiApi'],
        supportedOperations: ['textToSpeech']
      },


      // Stripe - Create Charge
      'n8n-nodes-base.stripe.createCharge': {
        requiredParams: ['amount', 'currency', 'source'],
        validateParams: (params) => {
          if (typeof params.amount !== 'number' || params.amount <= 0) return 'Amount debe ser un número positivo';
          if (!params.currency) return 'Currency requerido';
          if (!params.source) return 'Source requerido (token o ID de fuente)';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['createCharge', 'retrievePayment', 'createCustomer', 'listCustomers', 'refundCharge']
      },
      // Stripe - Retrieve Payment
      'n8n-nodes-base.stripe.retrievePayment': {
        requiredParams: ['paymentId'],
        validateParams: (params) => {
          if (!params.paymentId) return 'Payment ID requerido';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['retrievePayment']
      },
      // Stripe - Create Customer
      'n8n-nodes-base.stripe.createCustomer': {
        requiredParams: ['email'],
        validateParams: (params) => {
          if (!params.email || !/\S+@\S+\.\S+/.test(params.email)) return 'Email de cliente inválido o requerido';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['createCustomer']
      },
      // Stripe - List Customers
      'n8n-nodes-base.stripe.listCustomers': {
        requiredParams: [],
        credentials: ['stripeApi'],
        supportedOperations: ['listCustomers']
      },
      // Stripe - Refund Charge
      'n8n-nodes-base.stripe.refundCharge': {
        requiredParams: ['chargeId'],
        validateParams: (params) => {
          if (!params.chargeId) return 'Charge ID requerido para el reembolso';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['refundCharge']
      },
      // Stripe Billing - Create Subscription
      'n8n-nodes-base.stripeBilling.createSubscription': {
        requiredParams: ['customerId', 'priceId'],
        validateParams: (params) => {
          if (!params.customerId) return 'Customer ID requerido para crear suscripción';
          if (!params.priceId) return 'Price ID requerido para crear suscripción';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['createSubscription']
      },


      // PayPal - Create Payment
      'n8n-nodes-base.paypal.createPayment': {
        requiredParams: ['amount', 'currency', 'description'],
        validateParams: (params) => {
          if (typeof params.amount !== 'number' || params.amount <= 0) return 'Amount debe ser un número positivo';
          if (!params.currency) return 'Currency requerido';
          if (!params.description) return 'Description requerida';
          return null;
        },
        credentials: ['paypalApi'],
        supportedOperations: ['createPayment', 'executePayment', 'refundPayment']
      },
      // PayPal - Execute Payment
      'n8n-nodes-base.paypal.executePayment': {
        requiredParams: ['paymentId', 'payerId'],
        validateParams: (params) => {
          if (!params.paymentId) return 'Payment ID requerido';
          if (!params.payerId) return 'Payer ID requerido';
          return null;
        },
        credentials: ['paypalApi'],
        supportedOperations: ['executePayment']
      },
      // PayPal - Refund Payment
      'n8n-nodes-base.paypal.refundPayment': {
        requiredParams: ['saleId'],
        validateParams: (params) => {
          if (!params.saleId) return 'Sale ID requerido para el reembolso';
          return null;
        },
        credentials: ['paypalApi'],
        supportedOperations: ['refundPayment']
      },


      // Shopify - Create Order
      'n8n-nodes-base.shopify.createOrder': {
        requiredParams: ['lineItems', 'email'],
        validateParams: (params) => {
          if (!Array.isArray(params.lineItems) || params.lineItems.length === 0) return 'Line items requeridos para crear orden';
          if (!params.email || !/\S+@\S+\.\S+/.test(params.email)) return 'Email de cliente inválido o requerido';
          return null;
        },
        credentials: ['shopifyApi'],
        supportedOperations: ['createOrder', 'getProduct', 'createProduct', 'updateOrder']
      },
      // Shopify - Get Product
      'n8n-nodes-base.shopify.getProduct': {
        requiredParams: ['productId'],
        validateParams: (params) => {
          if (!params.productId) return 'Product ID requerido';
          return null;
        },
        credentials: ['shopifyApi'],
        supportedOperations: ['getProduct']
      },
      // Shopify - Create Product
      'n8n-nodes-base.shopify.createProduct': {
        requiredParams: ['title', 'productType', 'vendor'],
        validateParams: (params) => {
          if (!params.title) return 'Título de producto requerido';
          if (!params.productType) return 'Tipo de producto requerido';
          if (!params.vendor) return 'Vendedor de producto requerido';
          return null;
        },
        credentials: ['shopifyApi'],
        supportedOperations: ['createProduct']
      },
      // Shopify - Update Order
      'n8n-nodes-base.shopify.updateOrder': {
        requiredParams: ['orderId', 'data'],
        validateParams: (params) => {
          if (!params.orderId) return 'Order ID requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['shopifyApi'],
        supportedOperations: ['updateOrder']
      },


      // WooCommerce - Create Product
      'n8n-nodes-base.woocommerce.createProduct': {
        requiredParams: ['name', 'type', 'regularPrice'],
        validateParams: (params) => {
          if (!params.name) return 'Nombre de producto requerido';
          if (!params.type) return 'Tipo de producto requerido (simple, variable, etc.)';
          if (!params.regularPrice) return 'Precio regular requerido';
          return null;
        },
        credentials: ['woocommerceApi'],
        supportedOperations: ['createProduct', 'updateOrder']
      },
      // WooCommerce - Update Order (new in Phase 3)
      'n8n-nodes-base.woocommerce.updateOrder': {
        requiredParams: ['orderId', 'data'],
        validateParams: (params) => {
          if (!params.orderId) return 'Order ID requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['woocommerceApi'],
        supportedOperations: ['updateOrder']
      },


      // Mailchimp - Add Member To List
      'n8n-nodes-base.mailchimp.addMemberToList': {
        requiredParams: ['listId', 'emailAddress'],
        validateParams: (params) => {
          if (!params.listId) return 'List ID requerido';
          if (!params.emailAddress || !/\S+@\S+\.\S+/.test(params.emailAddress)) return 'Email inválido o requerido';
          return null;
        },
        credentials: ['mailchimpApi'],
        supportedOperations: ['addMemberToList', 'getCampaigns']
      },
      // Mailchimp - Get Campaigns
      'n8n-nodes-base.mailchimp.getCampaigns': {
        requiredParams: [],
        credentials: ['mailchimpApi'],
        supportedOperations: ['getCampaigns']
      },


      // ActiveCampaign - Create Contact
      'n8n-nodes-base.activecampaign.createContact': {
        requiredParams: ['email'],
        validateParams: (params) => {
          if (!params.email || !/\S+@\S+\.\S+/.test(params.email)) return 'Email inválido o requerido';
          return null;
        },
        credentials: ['activeCampaignApi'],
        supportedOperations: ['createContact', 'updateContact']
      },
      // ActiveCampaign - Update Contact
      'n8n-nodes-base.activecampaign.updateContact': {
        requiredParams: ['contactId', 'data'],
        validateParams: (params) => {
          if (!params.contactId) return 'Contact ID requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['activeCampaignApi'],
        supportedOperations: ['updateContact']
      },
      // ActiveCampaign - Add Tag To Contact (new in Phase 3)
      'n8n-nodes-base.activecampaign.addTagToContact': {
        requiredParams: ['contactId', 'tagId'],
        validateParams: (params) => {
          if (!params.contactId) return 'Contact ID requerido';
          if (!params.tagId) return 'Tag ID requerido';
          return null;
        },
        credentials: ['activeCampaignApi'],
        supportedOperations: ['addTagToContact']
      },


      // Customer.io - Send Email
      'n8n-nodes-base.customerio.sendEmail': {
        requiredParams: ['to', 'transactionalMessageId'],
        validateParams: (params) => {
          if (!params.to || !/\S+@\S+\.\S+/.test(params.to)) return 'Email de destino inválido o requerido';
          if (!params.transactionalMessageId) return 'Transactional Message ID requerido';
          return null;
        },
        credentials: ['customerIoApi'],
        supportedOperations: ['sendEmail', 'trackEvent']
      },
      // Customer.io - Track Event
      'n8n-nodes-base.customerio.trackEvent': {
        requiredParams: ['customerId', 'eventName'],
        validateParams: (params) => {
          if (!params.customerId) return 'Customer ID requerido';
          if (!params.eventName) return 'Event Name requerido';
          return null;
        },
        credentials: ['customerIoApi'],
        supportedOperations: ['trackEvent']
      },
      // Customer.io - Add Event (new in Phase 3, more specific than trackEvent maybe?)
      'n8n-nodes-base.customerio.addEvent': {
        requiredParams: ['customerId', 'name'],
        validateParams: (params) => {
          if (!params.customerId) return 'Customer ID requerido';
          if (!params.name) return 'Nombre del evento requerido';
          return null;
        },
        credentials: ['customerIoApi'],
        supportedOperations: ['addEvent']
      },
      // Customer.io - Update Customer (new in Phase 3)
      'n8n-nodes-base.customerio.updateCustomer': {
        requiredParams: ['customerId', 'data'],
        validateParams: (params) => {
          if (!params.customerId) return 'Customer ID requerido';
          if (!params.data) return 'Datos del cliente requeridos';
          return null;
        },
        credentials: ['customerIoApi'],
        supportedOperations: ['updateCustomer']
      },
      // Microsoft Exchange - Send Email
      'n8n-nodes-base.microsoftExchange.sendEmail': {
        requiredParams: ['toRecipients', 'subject', 'body'],
        validateParams: (params) => {
          if (!Array.isArray(params.toRecipients) || params.toRecipients.length === 0) return 'Destinatarios requeridos';
          if (!params.subject) return 'Subject requerido';
          if (!params.body) return 'Cuerpo del email requerido';
          return null;
        },
        credentials: ['microsoftExchangeOAuth2'],
        supportedOperations: ['sendEmail']
      },
      // Microsoft Graph - Send Email
      'n8n-nodes-base.microsoftGraph.sendEmail': {
        requiredParams: ['toRecipients', 'subject', 'body'],
        validateParams: (params) => {
          if (!Array.isArray(params.toRecipients) || params.toRecipients.length === 0) return 'Destinatarios requeridos';
          if (!params.subject) return 'Subject requerido';
          if (!params.body) return 'Cuerpo del email requerido';
          return null;
        },
        credentials: ['microsoftGraphOAuth2'],
        supportedOperations: ['sendEmail', 'createEvent']
      },
      // Microsoft Graph - Create Event
      'n8n-nodes-base.microsoftGraph.createEvent': {
        requiredParams: ['subject', 'start', 'end'],
        validateParams: (params) => {
          if (!params.subject) return 'Asunto del evento requerido';
          if (!params.start || !params.start.dateTime) return 'Hora de inicio del evento requerida';
          if (!params.end || !params.end.dateTime) return 'Hora de fin del evento requerida';
          return null;
        },
        credentials: ['microsoftGraphOAuth2'],
        supportedOperations: ['createEvent']
      },
      // Microsoft Project - Create Task
      'n8n-nodes-base.microsoftProject.createTask': {
        requiredParams: ['projectId', 'taskName'],
        validateParams: (params) => {
          if (!params.projectId) return 'Project ID requerido';
          if (!params.taskName) return 'Nombre de la tarea requerido';
          return null;
        },
        credentials: ['microsoftGraphOAuth2'], // Microsoft Project a menudo se integra vía Graph
        supportedOperations: ['createTask']
      },
      // Microsoft Dynamics 365 - Create Opportunity (new in Phase 3)
      'n8n-nodes-base.microsoftDynamics365.createOpportunity': {
        requiredParams: ['name', 'accountId'],
        validateParams: (params) => {
          if (!params.name) return 'Nombre de la oportunidad requerido';
          if (!params.accountId) return 'Account ID requerido';
          return null;
        },
        credentials: ['microsoftDynamics365OAuth2'],
        supportedOperations: ['createOpportunity', 'updateAccount']
      },
      // Microsoft Dynamics 365 - Update Account (new in Phase 3)
      'n8n-nodes-base.microsoftDynamics365.updateAccount': {
        requiredParams: ['accountId', 'data'],
        validateParams: (params) => {
          if (!params.accountId) return 'Account ID requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['microsoftDynamics365OAuth2'],
        supportedOperations: ['updateAccount']
      },


      // WhatsApp Cloud - Send Message
      'n8n-nodes-base.whatsappCloud.sendMessage': {
        requiredParams: ['to', 'messageType'],
        validateParams: (params) => {
          if (!params.to) return 'Número de destino requerido';
          if (!['text', 'template', 'media'].includes(params.messageType)) return 'Tipo de mensaje no válido';
          if (params.messageType === 'text' && !params.text) return 'Texto del mensaje requerido';
          if (params.messageType === 'template' && !params.templateName) return 'Nombre de plantilla requerido';
          return null;
        },
        credentials: ['whatsappCloudApi'],
        supportedOperations: ['sendMessage']
      },


      // Paged.js - Convert to PDF (Conceptual, as it's client-side)
      'n8n-nodes-base.pagedjs.convertToPdf': {
        requiredParams: ['htmlContent'],
        validateParams: (params) => {
          if (!params.htmlContent) return 'Contenido HTML requerido para conversión a PDF';
          return null;
        },
        credentials: [],
        supportedOperations: ['convertToPdf']
      },


      // Puppeteer - Scrape Page
      'n8n-nodes-base.puppeteer.scrapePage': {
        requiredParams: ['url', 'selector'],
        validateParams: (params) => {
          if (!params.url) return 'URL requerida para scraping';
          if (!params.selector) return 'Selector CSS/XPath requerido';
          return null;
        },
        credentials: [], // No suele requerir credenciales directas
        supportedOperations: ['scrapePage']
      },
      // Selenium - Run Browser Action
      'n8n-nodes-base.selenium.runBrowserAction': {
        requiredParams: ['browserAction', 'url'],
        validateParams: (params) => {
          if (!params.browserAction) return 'Acción de navegador requerida';
          if (!params.url) return 'URL requerida';
          return null;
        },
        credentials: [], // No suele requerir credenciales directas
        supportedOperations: ['runBrowserAction']
      },


      // OpenWeather - Get Weather Data
      'n8n-nodes-base.openweather.getWeatherData': {
        requiredParams: ['city', 'unit'],
        validateParams: (params) => {
          if (!params.city) return 'Ciudad requerida';
          if (!['metric', 'imperial', 'standard'].includes(params.unit)) return 'Unidad de temperatura no válida';
          return null;
        },
        credentials: ['openWeatherApi'],
        supportedOperations: ['getWeatherData']
      },


      // Exchange Rates API - Get Exchange Rates
      'n8n-nodes-base.exchangeratesapi.getExchangeRates': {
        requiredParams: ['baseCurrency'],
        validateParams: (params) => {
          if (!params.baseCurrency) return 'Moneda base requerida';
          return null;
        },
        credentials: ['exchangeRatesApi'],
        supportedOperations: ['getExchangeRates']
      },


      // IP Geolocation - Get Geo Location
      'n8n-nodes-base.ipgeolocation.getGeoLocation': {
        requiredParams: ['ipAddress'],
        validateParams: (params) => {
          if (!params.ipAddress || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(params.ipAddress)) return 'Dirección IP inválida o requerida';
          return null;
        },
        credentials: ['ipGeolocationApi'],
        supportedOperations: ['getGeoLocation']
      },
      // IP Lookup Details (new in Phase 3)
      'n8n-nodes-base.ipLookupDetails': {
        requiredParams: ['ipAddress'],
        validateParams: (params) => {
          if (!params.ipAddress || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(params.ipAddress)) return 'Dirección IP inválida o requerida';
          return null;
        },
        credentials: ['ipGeolocationApi'], // Can reuse or have a dedicated 'ipLookupApi'
        supportedOperations: ['lookupDetails']
      },


      // URL Shortener - Shorten URL
      'n8n-nodes-base.urlshortener.shortenUrl': {
        requiredParams: ['longUrl'],
        validateParams: (params) => {
          if (!params.longUrl || !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(params.longUrl)) return 'URL larga inválida o requerida';
          return null;
        },
        credentials: [], // Depende del servicio, puede ser none o API Key
        supportedOperations: ['shortenUrl']
      },
      // URL Parser (new in Phase 3)
      'n8n-nodes-base.urlParser': {
        requiredParams: ['url'],
        validateParams: (params) => {
          if (!params.url || !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(params.url)) return 'URL inválida o requerida';
          return null;
        },
        credentials: [],
        supportedOperations: ['parse']
      },


      // QR Code - Generate QR Code
      'n8n-nodes-base.qrCode.generateQrCode': {
        requiredParams: ['data'],
        validateParams: (params) => {
          if (!params.data) return 'Datos requeridos para generar QR Code';
          return null;
        },
        credentials: [],
        supportedOperations: ['generateQrCode']
      },
      // Barcode - Generate Barcode
      'n8n-nodes-base.barcode.generateBarcode': {
        requiredParams: ['data', 'format'],
        validateParams: (params) => {
          if (!params.data) return 'Datos requeridos para generar Barcode';
          if (!params.format) return 'Formato del código de barras requerido (ej. "CODE128", "QR")';
          return null;
        },
        credentials: [],
        supportedOperations: ['generateBarcode']
      },


      // PDF.js - Extract Text
      'n8n-nodes-base.pdfjs.extractText': {
        requiredParams: ['pdfFile'],
        validateParams: (params) => {
          if (!params.pdfFile) return 'Archivo PDF requerido';
          return null;
        },
        credentials: [],
        supportedOperations: ['extractText']
      },
      // PDF Generator - Generate PDF From HTML
      'n8n-nodes-base.pdfGenerator.generatePdfFromHtml': {
        requiredParams: ['htmlContent'],
        validateParams: (params) => {
          if (!params.htmlContent) return 'Contenido HTML requerido';
          return null;
        },
        credentials: [], // Puede usar un servicio con API Key
        supportedOperations: ['generatePdfFromHtml']
      },


      // Hugging Face - Text Generation
      'n8n-nodes-base.huggingFace.textGeneration': {
        requiredParams: ['model', 'prompt'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido';
          if (!params.prompt) return 'Prompt requerido';
          return null;
        },
        credentials: ['huggingFaceApi'],
        supportedOperations: ['textGeneration', 'imageClassification']
      },
      // Hugging Face - Image Classification
      'n8n-nodes-base.huggingFace.imageClassification': {
        requiredParams: ['model', 'imageUrl'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido';
          if (!params.imageUrl) return 'URL de imagen requerida';
          return null;
        },
        credentials: ['huggingFaceApi'],
        supportedOperations: ['imageClassification']
      },


      // Anthropic - Messages (Claude)
      'n8n-nodes-base.anthropic.messages': {
        requiredParams: ['model', 'messages'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido (ej. "claude-3-opus-20240229")';
          if (!Array.isArray(params.messages) || params.messages.length === 0) return 'Mensajes requeridos';
          return null;
        },
        credentials: ['anthropicApi'],
        supportedOperations: ['messages']
      },


      // Sendinblue / Brevo - Send Email
      'n8n-nodes-base.sendinblue.sendEmail': {
        requiredParams: ['to', 'subject', 'htmlContent'],
        validateParams: (params) => {
          if (!params.to || !/\S+@\S+\.\S+/.test(params.to)) return 'Email de destino inválido o requerido';
          if (!params.subject) return 'Subject requerido';
          if (!params.htmlContent) return 'Contenido HTML requerido';
          return null;
        },
        credentials: ['sendinblueApi'],
        supportedOperations: ['sendEmail']
      },
      'n8n-nodes-base.brevo.sendEmail': { // Alias o migración
        requiredParams: ['to', 'subject', 'htmlContent'],
        validateParams: (params) => {
          if (!params.to || !/\S+@\S+\.\S+/.test(params.to)) return 'Email de destino inválido o requerido';
          if (!params.subject) return 'Subject requerido';
          if (!params.htmlContent) return 'Contenido HTML requerido';
          return null;
        },
        credentials: ['brevoApi'],
        supportedOperations: ['sendEmail']
      },


      // Klaviyo - Create Profile
      'n8n-nodes-base.klaviyo.createProfile': {
        requiredParams: ['email'],
        validateParams: (params) => {
          if (!params.email || !/\S+@\S+\.\S+/.test(params.email)) return 'Email inválido o requerido';
          return null;
        },
        credentials: ['klaviyoApi'],
        supportedOperations: ['createProfile']
      },


      // Mixpanel - Track Event
      'n8n-nodes-base.mixpanel.trackEvent': {
        requiredParams: ['event', 'properties'],
        validateParams: (params) => {
          if (!params.event) return 'Nombre del evento requerido';
          if (typeof params.properties !== 'object' || Object.keys(params.properties).length === 0) return 'Propiedades del evento requeridas';
          return null;
        },
        credentials: ['mixpanelApi'],
        supportedOperations: ['trackEvent']
      },
      // Amplitude - Track Event
      'n8n-nodes-base.amplitude.trackEvent': {
        requiredParams: ['eventType', 'userId'],
        validateParams: (params) => {
          if (!params.eventType) return 'Tipo de evento requerido';
          if (!params.userId) return 'User ID requerido';
          return null;
        },
        credentials: ['amplitudeApi'],
        supportedOperations: ['trackEvent']
      },
      // Segment - Track Event
      'n8n-nodes-base.segment.trackEvent': {
        requiredParams: ['event', 'userId'],
        validateParams: (params) => {
          if (!params.event) return 'Nombre del evento requerido';
          if (!params.userId) return 'User ID requerido';
          return null;
        },
        credentials: ['segmentApi'],
        supportedOperations: ['trackEvent', 'identifyUser']
      },
      // Segment - Identify User
      'n8n-nodes-base.segment.identifyUser': {
        requiredParams: ['userId', 'traits'],
        validateParams: (params) => {
          if (!params.userId) return 'User ID requerido';
          if (typeof params.traits !== 'object' || Object.keys(params.traits).length === 0) return 'Traits de usuario requeridos';
          return null;
        },
        credentials: ['segmentApi'],
        supportedOperations: ['identifyUser']
      },
      // Segment - Page Call (new in Phase 3)
      'n8n-nodes-base.segment.pageCall': {
        requiredParams: ['userId', 'name'],
        validateParams: (params) => {
          if (!params.userId) return 'User ID requerido';
          if (!params.name) return 'Nombre de la página requerido';
          return null;
        },
        credentials: ['segmentApi'],
        supportedOperations: ['pageCall']
      },
      // Segment - Group Call (new in Phase 3)
      'n8n-nodes-base.segment.groupCall': {
        requiredParams: ['userId', 'groupId', 'traits'],
        validateParams: (params) => {
          if (!params.userId) return 'User ID requerido';
          if (!params.groupId) return 'Group ID requerido';
          if (typeof params.traits !== 'object' || Object.keys(params.traits).length === 0) return 'Traits del grupo requeridos';
          return null;
        },
        credentials: ['segmentApi'],
        supportedOperations: ['groupCall']
      },


      // Notion - Append Block (Más específico)
      'n8n-nodes-base.notion.appendBlock': {
        requiredParams: ['blockId', 'children'],
        validateParams: (params) => {
          if (!params.blockId) return 'Block ID requerido';
          if (!Array.isArray(params.children) || params.children.length === 0) return 'Children (bloques a añadir) requeridos';
          return null;
        },
        credentials: ['notionApi'],
        supportedOperations: ['appendBlock']
      },
      // Notion - Create Database Item (new in Phase 3)
      'n8n-nodes-base.notion.createDatabaseItem': {
        requiredParams: ['databaseId', 'properties'],
        validateParams: (params) => {
          if (!params.databaseId) return 'Database ID requerido';
          if (typeof params.properties !== 'object' || Object.keys(params.properties).length === 0) return 'Propiedades del item de base de datos requeridas';
          return null;
        },
        credentials: ['notionApi'],
        supportedOperations: ['createDatabaseItem', 'updatePageProperty']
      },
      // Notion - Update Page Property (new in Phase 3)
      'n8n-nodes-base.notion.updatePageProperty': {
        requiredParams: ['pageId', 'propertyId', 'value'],
        validateParams: (params) => {
          if (!params.pageId) return 'Page ID requerido';
          if (!params.propertyId) return 'Property ID requerido';
          if (params.value === undefined) return 'Valor de la propiedad requerido';
          return null;
        },
        credentials: ['notionApi'],
        supportedOperations: ['updatePageProperty']
      },
      // Airtable - List Records (Más específico)
      'n8n-nodes-base.airtable.listRecords': {
        requiredParams: ['baseId', 'table'],
        validateParams: (params) => {
          if (!params.baseId) return 'Base ID requerido';
          if (!params.table) return 'Table requerido';
          return null;
        },
        credentials: ['airtableApi'],
        supportedOperations: ['listRecords']
      },


      // Mailjet - Send Email
      'n8n-nodes-base.mailjet.sendEmail': {
        requiredParams: ['to', 'subject', 'htmlPart'],
        validateParams: (params) => {
          if (!params.to || !Array.isArray(params.to) || params.to.length === 0) return 'Destinatario requerido (array)';
          if (!params.subject) return 'Subject requerido';
          if (!params.htmlPart) return 'Contenido HTML requerido';
          return null;
        },
        credentials: ['mailjetApi'],
        supportedOperations: ['sendEmail']
      },


      // GetStream - Create User
      'n8n-nodes-base.getstream.createUser': {
        requiredParams: ['userId'],
        validateParams: (params) => {
          if (!params.userId) return 'User ID requerido';
          return null;
        },
        credentials: ['getStreamApi'],
        supportedOperations: ['createUser']
      },


      // PlanetScale - Execute Query
      'n8n-nodes-base.planetscale.executeQuery': {
        requiredParams: ['databaseBranch', 'query'],
        validateParams: (params) => {
          if (!params.databaseBranch) return 'Rama de la base de datos requerida';
          if (!params.query) return 'Query SQL requerida';
          return null;
        },
        credentials: ['planetscaleApi'],
        supportedOperations: ['executeQuery']
      },
      // CockroachDB - Execute Query
      'n8n-nodes-base.cockroachdb.executeQuery': {
        requiredParams: ['database', 'query'],
        validateParams: (params) => {
          if (!params.database) return 'Base de datos requerida';
          if (!params.query) return 'Query SQL requerida';
          return null;
        },
        credentials: ['cockroachDb'],
        supportedOperations: ['executeQuery']
      },
      // Cassandra - Execute Query
      'n8n-nodes-base.cassandra.executeQuery': {
        requiredParams: ['query'],
        validateParams: (params) => {
          if (!params.query) return 'Query CQL requerida';
          return null;
        },
        credentials: ['cassandraDb'],
        supportedOperations: ['executeQuery', 'updateRecord']
      },
      // Apache Cassandra - Update Record (new in Phase 3)
      'n8n-nodes-base.apacheCassandra.updateRecord': {
        requiredParams: ['keyspace', 'tableName', 'data', 'conditions'],
        validateParams: (params) => {
          if (!params.keyspace) return 'Keyspace requerido';
          if (!params.tableName) return 'Table Name requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          if (typeof params.conditions !== 'object' || Object.keys(params.conditions).length === 0) return 'Condiciones de actualización requeridas';
          return null;
        },
        credentials: ['cassandraDb'],
        supportedOperations: ['updateRecord']
      },
      // Couchbase - Upsert Document
      'n8n-nodes-base.couchbase.upsertDocument': {
        requiredParams: ['bucketName', 'documentId', 'document'],
        validateParams: (params) => {
          if (!params.bucketName) return 'Bucket Name requerido';
          if (!params.documentId) return 'Document ID requerido';
          if (typeof params.document !== 'object' || Object.keys(params.document).length === 0) return 'Documento requerido';
          return null;
        },
        credentials: ['couchbaseDb'],
        supportedOperations: ['upsertDocument', 'queryData']
      },
      // Couchbase - Query Data (new in Phase 3)
      'n8n-nodes-base.couchbase.queryData': {
        requiredParams: ['query'],
        validateParams: (params) => {
          if (!params.query) return 'Query N1QL requerida';
          return null;
        },
        credentials: ['couchbaseDb'],
        supportedOperations: ['queryData']
      },
      // ClickHouse - Insert Data
      'n8n-nodes-base.clickhouse.insertData': {
        requiredParams: ['tableName', 'data'],
        validateParams: (params) => {
          if (!params.tableName) return 'Table Name requerido';
          if (!Array.isArray(params.data) || params.data.length === 0) return 'Datos a insertar requeridos (array de objetos)';
          return null;
        },
        credentials: ['clickhouseDb'],
        supportedOperations: ['insertData', 'deleteData']
      },
      // ClickHouse - Delete Data (new in Phase 3)
      'n8n-nodes-base.clickhouse.deleteData': {
        requiredParams: ['tableName', 'where'],
        validateParams: (params) => {
          if (!params.tableName) return 'Table Name requerido';
          if (!params.where) return 'Condición WHERE requerida para eliminar datos';
          return null;
        },
        credentials: ['clickhouseDb'],
        supportedOperations: ['deleteData']
      },
      // Apache Kafka - Produce Message
      'n8n-nodes-base.apacheKafka.produceMessage': {
        requiredParams: ['topic', 'message'],
        validateParams: (params) => {
          if (!params.topic) return 'Topic de Kafka requerido';
          if (!params.message) return 'Mensaje requerido';
          return null;
        },
        credentials: ['kafkaApi'],
        supportedOperations: ['produceMessage', 'consumeMessage']
      },
      // Apache Kafka - Consume Message
      'n8n-nodes-base.apacheKafka.consumeMessage': {
        requiredParams: ['topic', 'groupId'],
        validateParams: (params) => {
          if (!params.topic) return 'Topic de Kafka requerido';
          if (!params.groupId) return 'Group ID de consumidor requerido';
          return null;
        },
        credentials: ['kafkaApi'],
        supportedOperations: ['consumeMessage']
      },
      // RabbitMQ - Publish Message
      'n8n-nodes-base.rabbitmq.publishMessage': {
        requiredParams: ['exchange', 'routingKey', 'message'],
        validateParams: (params) => {
          if (!params.exchange) return 'Exchange de RabbitMQ requerido';
          if (!params.routingKey) return 'Routing Key requerido';
          if (!params.message) return 'Mensaje requerido';
          return null;
        },
        credentials: ['rabbitmqApi'],
        supportedOperations: ['publishMessage', 'consumeMessage']
      },
      // RabbitMQ - Consume Message
      'n8n-nodes-base.rabbitmq.consumeMessage': {
        requiredParams: ['queueName'],
        validateParams: (params) => {
          if (!params.queueName) return 'Queue Name de RabbitMQ requerido';
          return null;
        },
        credentials: ['rabbitmqApi'],
        supportedOperations: ['consumeMessage']
      },
      // MySQL - Begin Transaction
      'n8n-nodes-base.mysql.beginTransaction': {
        requiredParams: [],
        credentials: ['mySql'],
        supportedOperations: ['beginTransaction']
      },
      // PostgreSQL - Upsert
      'n8n-nodes-base.postgres.upsert': {
        requiredParams: ['tableName', 'data', 'conflictTarget'],
        validateParams: (params) => {
          if (!params.tableName) return 'Table Name requerido';
          if (!Array.isArray(params.data) || params.data.length === 0) return 'Datos a upsertar requeridos';
          if (!params.conflictTarget) return 'Conflict Target (columna o índice) requerido';
          return null;
        },
        credentials: ['postgres'],
        supportedOperations: ['upsert']
      },
      // Redis - Publish Message
      'n8n-nodes-base.redis.publishMessage': {
        requiredParams: ['channel', 'message'],
        validateParams: (params) => {
          if (!params.channel) return 'Channel requerido';
          if (!params.message) return 'Mensaje requerido';
          return null;
        },
        credentials: ['redis'],
        supportedOperations: ['publishMessage', 'getHash']
      },
      // Redis Cluster - Get Hash (new in Phase 3)
      'n8n-nodes-base.redisCluster.getHash': {
        requiredParams: ['key', 'field'],
        validateParams: (params) => {
          if (!params.key) return 'Clave (key) requerida';
          if (!params.field) return 'Campo (field) del hash requerido';
          return null;
        },
        credentials: ['redis'], // Reusing redis credentials
        supportedOperations: ['getHash', 'setHash']
      },
      // Redis Cluster - Set Hash (new in Phase 3)
      'n8n-nodes-base.redisCluster.setHash': {
        requiredParams: ['key', 'field', 'value'],
        validateParams: (params) => {
          if (!params.key) return 'Clave (key) requerida';
          if (!params.field) return 'Campo (field) del hash requerido';
          if (params.value === undefined) return 'Valor requerido';
          return null;
        },
        credentials: ['redis'],
        supportedOperations: ['setHash']
      },
      // MongoDB - Insert Many (new in Phase 3)
      'n8n-nodes-base.mongoDb.insertMany': {
        requiredParams: ['collectionName', 'documents'],
        validateParams: (params) => {
          if (!params.collectionName) return 'Collection Name requerido';
          if (!Array.isArray(params.documents) || params.documents.length === 0) return 'Array de documentos requeridos';
          return null;
        },
        credentials: ['mongoDb'],
        supportedOperations: ['insertMany']
      },
      // MongoDB - Text Search (new in Phase 3)
      'n8n-nodes-base.mongoDb.textSearch': {
        requiredParams: ['collectionName', 'searchQuery'],
        validateParams: (params) => {
          if (!params.collectionName) return 'Collection Name requerido';
          if (!params.searchQuery) return 'Query de búsqueda de texto requerida';
          return null;
        },
        credentials: ['mongoDb'],
        supportedOperations: ['textSearch']
      },
      // Apache Flink - Submit Job (new in Phase 3)
      'n8n-nodes-base.apacheFlink.submitJob': {
        requiredParams: ['jobGraph', 'jobName'],
        validateParams: (params) => {
          if (!params.jobGraph) return 'Job Graph de Flink requerido';
          if (!params.jobName) return 'Nombre del job de Flink requerido';
          return null;
        },
        credentials: ['apacheFlinkApi'],
        supportedOperations: ['submitJob', 'cancelJob']
      },
      // Apache Flink - Cancel Job (new in Phase 3)
      'n8n-nodes-base.apacheFlink.cancelJob': {
        requiredParams: ['jobId'],
        validateParams: (params) => {
          if (!params.jobId) return 'Job ID de Flink requerido';
          return null;
        },
        credentials: ['apacheFlinkApi'],
        supportedOperations: ['cancelJob']
      },
      // Apache Spark - Submit Job (new in Phase 3)
      'n8n-nodes-base.apacheSpark.submitJob': {
        requiredParams: ['mainClass', 'appResource'],
        validateParams: (params) => {
          if (!params.mainClass) return 'Clase principal de Spark requerida';
          if (!params.appResource) return 'Recurso de la aplicación Spark requerido (ej. jar, python file)';
          return null;
        },
        credentials: ['apacheSparkApi'],
        supportedOperations: ['submitJob', 'getJobStatus']
      },
      // Apache Spark - Get Job Status (new in Phase 3)
      'n8n-nodes-base.apacheSpark.getJobStatus': {
        requiredParams: ['jobId'],
        validateParams: (params) => {
          if (!params.jobId) return 'Job ID de Spark requerido';
          return null;
        },
        credentials: ['apacheSparkApi'],
        supportedOperations: ['getJobStatus']
      },
      // PrestoDB - Execute Query (new in Phase 3)
      'n8n-nodes-base.prestoDb.executeQuery': {
        requiredParams: ['catalog', 'schema', 'query'],
        validateParams: (params) => {
          if (!params.catalog) return 'Catalog de PrestoDB requerido';
          if (!params.schema) return 'Schema de PrestoDB requerido';
          if (!params.query) return 'Query SQL requerida';
          return null;
        },
        credentials: ['prestoDbApi'],
        supportedOperations: ['executeQuery']
      },
      // Trino - Execute Query (new in Phase 3)
      'n8n-nodes-base.trino.executeQuery': {
        requiredParams: ['catalog', 'schema', 'query'],
        validateParams: (params) => {
          if (!params.catalog) return 'Catalog de Trino requerido';
          if (!params.schema) return 'Schema de Trino requerido';
          if (!params.query) return 'Query SQL requerida';
          return null;
        },
        credentials: ['trinoApi'],
        supportedOperations: ['executeQuery']
      },


      // Hasura - Insert Data
      'n8n-nodes-base.hasura.insertData': {
        requiredParams: ['tableName', 'data'],
        validateParams: (params) => {
          if (!params.tableName) return 'Table Name requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a insertar requeridos';
          return null;
        },
        credentials: ['hasuraApi'],
        supportedOperations: ['insertData']
      },


      // GraphQL - Make Request
      'n8n-nodes-base.graphql.makeRequest': {
        requiredParams: ['endpoint', 'query'],
        validateParams: (params) => {
          if (!params.endpoint) return 'Endpoint GraphQL requerido';
          if (!params.query) return 'Query GraphQL requerido';
          return null;
        },
        credentials: [], // Opcional, puede usar 'httpBasicAuth' o 'apiKey'
        supportedOperations: ['makeRequest', 'mutateData']
      },
      // GraphQL - Mutate Data
      'n8n-nodes-base.graphql.mutateData': {
        requiredParams: ['endpoint', 'mutation'],
        validateParams: (params) => {
          if (!params.endpoint) return 'Endpoint GraphQL requerido';
          if (!params.mutation) return 'Mutation GraphQL requerido';
          return null;
        },
        credentials: [],
        supportedOperations: ['mutateData']
      },
      // REST API - Patch Request
      'n8n-nodes-base.restapi.patchRequest': {
        requiredParams: ['url', 'data'],
        validateParams: (params) => {
          if (!params.url) return 'URL requerida';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos para PATCH requeridos';
          return null;
        },
        credentials: [],
        supportedOperations: ['patchRequest']
      },
      // SOAP - Invoke Operation
      'n8n-nodes-base.soap.invokeOperation': {
        requiredParams: ['wsdlUrl', 'operationName', 'args'],
        validateParams: (params) => {
          if (!params.wsdlUrl) return 'WSDL URL requerido';
          if (!params.operationName) return 'Nombre de operación SOAP requerido';
          if (typeof params.args !== 'object') return 'Argumentos de la operación SOAP requeridos';
          return null;
        },
        credentials: [],
        supportedOperations: ['invokeOperation']
      },
      // XML - Transform XML
      'n8n-nodes-base.xml.transformXml': {
        requiredParams: ['xmlData', 'xsltStylesheet'],
        validateParams: (params) => {
          if (!params.xmlData) return 'Datos XML requeridos';
          if (!params.xsltStylesheet) return 'Stylesheet XSLT requerido';
          return null;
        },
        credentials: [],
        supportedOperations: ['transformXml']
      },


      // Jira Cloud - Create Issue (diferente al genérico para distinguir Cloud de Server)
      'n8n-nodes-base.jiraCloud.createIssue': {
        requiredParams: ['projectKey', 'issueType', 'summary'],
        validateParams: (params) => {
          if (!params.projectKey) return 'Project Key requerido';
          if (!params.issueType) return 'Tipo de issue requerido';
          if (!params.summary) return 'Summary requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['createIssue', 'updateIssue']
      },
      // Jira - Update Issue
      'n8n-nodes-base.jira.updateIssue': {
        requiredParams: ['issueId', 'data'],
        validateParams: (params) => {
          if (!params.issueId) return 'Issue ID requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['updateIssue']
      },
      // Jira - Add Comment To Issue (más específico)
      'n8n-nodes-base.jira.addCommentToIssue': {
        requiredParams: ['issueId', 'comment'],
        validateParams: (params) => {
          if (!params.issueId) return 'Issue ID requerido';
          if (!params.comment) return 'Comentario requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['addCommentToIssue']
      },
      // Jira - Create Epic (new in Phase 3)
      'n8n-nodes-base.jira.createEpic': {
        requiredParams: ['projectKey', 'summary', 'epicName'],
        validateParams: (params) => {
          if (!params.projectKey) return 'Project Key requerido';
          if (!params.summary) return 'Summary del Epic requerido';
          if (!params.epicName) return 'Nombre del Epic requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['createEpic']
      },
      // Jira - Add Watcher (new in Phase 3)
      'n8n-nodes-base.jira.addWatcher': {
        requiredParams: ['issueId', 'watcherAccountId'],
        validateParams: (params) => {
          if (!params.issueId) return 'Issue ID requerido';
          if (!params.watcherAccountId) return 'Account ID del observador requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['addWatcher']
      },


      // Datadog - Post Event
      'n8n-nodes-base.datadog.postEvent': {
        requiredParams: ['title', 'text'],
        validateParams: (params) => {
          if (!params.title) return 'Título del evento requerido';
          if (!params.text) return 'Texto del evento requerido';
          return null;
        },
        credentials: ['datadogApi'],
        supportedOperations: ['postEvent', 'getMetrics']
      },
      // Datadog - Get Metrics
      'n8n-nodes-base.datadog.getMetrics': {
        requiredParams: ['metricName', 'from', 'to'],
        validateParams: (params) => {
          if (!params.metricName) return 'Nombre de la métrica requerido';
          if (!params.from) return 'Fecha de inicio (from) requerida';
          if (!params.to) return 'Fecha de fin (to) requerida';
          return null;
        },
        credentials: ['datadogApi'],
        supportedOperations: ['getMetrics']
      },
      // Logz.io - Send Logs
      'n8n-nodes-base.logzio.sendLogs': {
        requiredParams: ['token', 'logData'],
        validateParams: (params) => {
          if (!params.token) return 'Token de Logz.io requerido';
          if (!params.logData) return 'Datos de log requeridos';
          return null;
        },
        credentials: ['logzioApi'],
        supportedOperations: ['sendLogs']
      },
      // Splunk - Send Event
      'n8n-nodes-base.splunk.sendEvent': {
        requiredParams: ['host', 'source', 'sourcetype', 'event'],
        validateParams: (params) => {
          if (!params.host) return 'Host de Splunk requerido';
          if (!params.source) return 'Source requerido';
          if (!params.sourcetype) return 'Sourcetype requerido';
          if (!params.event) return 'Evento requerido';
          return null;
        },
        credentials: ['splunkApi'],
        supportedOperations: ['sendEvent']
      },
      // StatusPage.io - Update Component
      'n8n-nodes-base.statusPage.updateComponent': {
        requiredParams: ['pageId', 'componentId', 'status'],
        validateParams: (params) => {
          if (!params.pageId) return 'Page ID requerido';
          if (!params.componentId) return 'Component ID requerido';
          if (!['operational', 'under_maintenance', 'degraded_performance', 'partial_outage', 'major_outage'].includes(params.status)) return 'Estado de componente no válido';
          return null;
        },
        credentials: ['statusPageApi'],
        supportedOperations: ['updateComponent']
      },
      // PagerDuty - Create Event
      'n8n-nodes-base.pagerDuty.createEvent': {
        requiredParams: ['routingKey', 'summary', 'severity'],
        validateParams: (params) => {
          if (!params.routingKey) return 'Routing Key requerido';
          if (!params.summary) return 'Summary del evento requerido';
          if (!['critical', 'error', 'warning', 'info'].includes(params.severity)) return 'Nivel de severidad no válido';
          return null;
        },
        credentials: ['pagerDutyApi'],
        supportedOperations: ['createEvent']
      },
      // Opsgenie - Create Alert
      'n8n-nodes-base.opsgenie.createAlert': {
        requiredParams: ['message', 'priority'],
        validateParams: (params) => {
          if (!params.message) return 'Mensaje de alerta requerido';
          if (!['P1', 'P2', 'P3', 'P4', 'P5'].includes(params.priority)) return 'Prioridad de alerta no válida';
          return null;
        },
        credentials: ['opsgenieApi'],
        supportedOperations: ['createAlert']
      },


      // Grafana - Create Alert
      'n8n-nodes-base.grafana.createAlert': {
        requiredParams: ['dashboardId', 'panelId', 'query', 'name'],
        validateParams: (params) => {
          if (!params.dashboardId) return 'Dashboard ID requerido';
          if (!params.panelId) return 'Panel ID requerido';
          if (!params.query) return 'Query de la alerta requerida';
          if (!params.name) return 'Nombre de la alerta requerido';
          return null;
        },
        credentials: ['grafanaApi'],
        supportedOperations: ['createAlert', 'queryDatasource']
      },
      // Grafana - Query Datasource
      'n8n-nodes-base.grafana.queryDatasource': {
        requiredParams: ['datasourceId', 'query'],
        validateParams: (params) => {
          if (!params.datasourceId) return 'Datasource ID requerido';
          if (!params.query) return 'Query requerida';
          return null;
        },
        credentials: ['grafanaApi'],
        supportedOperations: ['queryDatasource']
      },
      // Grafana Loki - Push Log (new in Phase 3)
      'n8n-nodes-base.grafanaLoki.pushLog': {
        requiredParams: ['streams'],
        validateParams: (params) => {
          if (!Array.isArray(params.streams) || params.streams.length === 0) return 'Streams de log requeridos';
          return null;
        },
        credentials: ['grafanaLokiApi'],
        supportedOperations: ['pushLog', 'queryLogs']
      },
      // Grafana Loki - Query Logs (new in Phase 3)
      'n8n-nodes-base.grafanaLoki.queryLogs': {
        requiredParams: ['query'],
        validateParams: (params) => {
          if (!params.query) return 'Query de Loki (LogQL) requerida';
          return null;
        },
        credentials: ['grafanaLokiApi'],
        supportedOperations: ['queryLogs']
      },
      // Prometheus - Push Metric (new in Phase 3)
      'n8n-nodes-base.prometheus.pushMetric': {
        requiredParams: ['job', 'instance', 'metrics'],
        validateParams: (params) => {
          if (!params.job) return 'Nombre del job requerido';
          if (!params.instance) return 'Instancia requerida';
          if (!Array.isArray(params.metrics) || params.metrics.length === 0) return 'Métricas requeridas';
          return null;
        },
        credentials: ['prometheusPushgateway'],
        supportedOperations: ['pushMetric', 'queryMetrics']
      },
      // Prometheus - Query Metrics (new in Phase 3)
      'n8n-nodes-base.prometheus.queryMetrics': {
        requiredParams: ['query'],
        validateParams: (params) => {
          if (!params.query) return 'Query PromQL requerida';
          return null;
        },
        credentials: ['prometheusApi'], // New Credential if not using pushgateway
        supportedOperations: ['queryMetrics']
      },
      // New Relic - Post Metric (new in Phase 3)
      'n8n-nodes-base.newRelic.postMetric': {
        requiredParams: ['metrics'],
        validateParams: (params) => {
          if (!Array.isArray(params.metrics) || params.metrics.length === 0) return 'Métricas requeridas';
          return null;
        },
        credentials: ['newRelicApi'],
        supportedOperations: ['postMetric', 'getAlerts']
      },
      // New Relic - Get Alerts (new in Phase 3)
      'n8n-nodes-base.newRelic.getAlerts': {
        requiredParams: ['policyId'],
        validateParams: (params) => {
          if (!params.policyId) return 'Policy ID requerido';
          return null;
        },
        credentials: ['newRelicApi'],
        supportedOperations: ['getAlerts']
      },
      // AppDynamics - Report Event (new in Phase 3)
      'n8n-nodes-base.appDynamics.reportEvent': {
        requiredParams: ['eventName', 'eventProperties'],
        validateParams: (params) => {
          if (!params.eventName) return 'Nombre del evento requerido';
          if (typeof params.eventProperties !== 'object' || Object.keys(params.eventProperties).length === 0) return 'Propiedades del evento requeridas';
          return null;
        },
        credentials: ['appDynamicsApi'],
        supportedOperations: ['reportEvent', 'getMetrics']
      },
      // AppDynamics - Get Metrics (new in Phase 3)
      'n8n-nodes-base.appDynamics.getMetrics': {
        requiredParams: ['metricPath', 'timeRange'],
        validateParams: (params) => {
          if (!params.metricPath) return 'Metric Path requerido';
          if (!params.timeRange) return 'Rango de tiempo requerido';
          return null;
        },
        credentials: ['appDynamicsApi'],
        supportedOperations: ['getMetrics']
      },


      // Jenkins - Start Job
      'n8n-nodes-base.jenkins.startJob': {
        requiredParams: ['jobName'],
        validateParams: (params) => {
          if (!params.jobName) return 'Nombre del job de Jenkins requerido';
          return null;
        },
        credentials: ['jenkinsApi'],
        supportedOperations: ['startJob', 'buildWithParameters']
      },
      // Jenkins - Build With Parameters
      'n8n-nodes-base.jenkins.buildWithParameters': {
        requiredParams: ['jobName', 'parameters'],
        validateParams: (params) => {
          if (!params.jobName) return 'Nombre del job de Jenkins requerido';
          if (typeof params.parameters !== 'object') return 'Parámetros de construcción requeridos';
          return null;
        },
        credentials: ['jenkinsApi'],
        supportedOperations: ['buildWithParameters']
      },
      // Jenkins - Run Jenkinsfile (new in Phase 3)
      'n8n-nodes-base.jenkins.runJenkinsfile': {
        requiredParams: ['repositoryUrl', 'jenkinsfilePath'],
        validateParams: (params) => {
          if (!params.repositoryUrl) return 'URL del repositorio Git requerido';
          if (!params.jenkinsfilePath) return 'Ruta del Jenkinsfile requerida';
          return null;
        },
        credentials: ['jenkinsApi'],
        supportedOperations: ['runJenkinsfile']
      },

      // --- INICIO DE VALIDACIONES PARA NUEVOS NODOS (Fase 4) ---

      // AI/ML & Data Science (15 Nodos)
      'n8n-nodes-base.awsTextract.analyzeDocument': {
        requiredParams: ['document'],
        validateParams: (params) => {
          if (!params.document) return 'Documento (imagen/PDF) requerido para análisis';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['analyzeDocument']
      },
      'n8n-nodes-base.azureOpenAi.chatCompletion': {
        requiredParams: ['deploymentId', 'messages'],
        validateParams: (params) => {
          if (!params.deploymentId) return 'Deployment ID requerido para Azure OpenAI';
          if (!Array.isArray(params.messages) || params.messages.length === 0) return 'Mensajes requeridos para chat completion';
          return null;
        },
        credentials: ['azureOpenAiApi'],
        supportedOperations: ['chatCompletion']
      },
      'n8n-nodes-base.googleCloudNaturalLanguage.analyzeSentiment': {
        requiredParams: ['document'],
        validateParams: (params) => {
          if (!params.document || !params.document.content) return 'Contenido del documento requerido para análisis de sentimiento';
          return null;
        },
        credentials: ['googleCloudPlatformApi'],
        supportedOperations: ['analyzeSentiment']
      },
      'n8n-nodes-base.tensorflow.runModel': {
        requiredParams: ['modelUrl', 'inputs'],
        validateParams: (params) => {
          if (!params.modelUrl) return 'URL del modelo TensorFlow.js requerido';
          if (!params.inputs) return 'Inputs para el modelo requeridos';
          return null;
        },
        credentials: [], // Generalmente no requiere credenciales directas
        supportedOperations: ['runModel']
      },
      'n8n-nodes-base.pytorch.runModel': {
        requiredParams: ['modelPath', 'data'],
        validateParams: (params) => {
          if (!params.modelPath) return 'Ruta del modelo PyTorch requerida';
          if (!params.data) return 'Datos de entrada requeridos';
          return null;
        },
        credentials: [], // Generalmente no requiere credenciales directas
        supportedOperations: ['runModel']
      },
      'n8n-nodes-base.huggingFace.summarization': {
        requiredParams: ['model', 'text'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido';
          if (!params.text) return 'Texto a resumir requerido';
          return null;
        },
        credentials: ['huggingFaceApi'],
        supportedOperations: ['summarization']
      },
      'n8n-nodes-base.huggingFace.translation': {
        requiredParams: ['model', 'text', 'targetLanguage'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido';
          if (!params.text) return 'Texto a traducir requerido';
          if (!params.targetLanguage) return 'Idioma objetivo requerido';
          return null;
        },
        credentials: ['huggingFaceApi'],
        supportedOperations: ['translation']
      },
      'n8n-nodes-base.langchain.executeChain': {
        requiredParams: ['chain', 'input'],
        validateParams: (params) => {
          if (!params.chain) return 'Cadena LangChain requerida';
          if (!params.input) return 'Input para la cadena requerido';
          return null;
        },
        credentials: [], // Depende de los LLMs y herramientas dentro de la cadena
        supportedOperations: ['executeChain']
      },
      'n8n-nodes-base.pinecone.upsertVector': {
        requiredParams: ['indexName', 'vectors'],
        validateParams: (params) => {
          if (!params.indexName) return 'Nombre del índice requerido';
          if (!Array.isArray(params.vectors) || params.vectors.length === 0) return 'Vectores a insertar requeridos';
          return null;
        },
        credentials: ['pineconeApi'],
        supportedOperations: ['upsertVector']
      },
      'n8n-nodes-base.weaviate.addDocument': {
        requiredParams: ['className', 'data'],
        validateParams: (params) => {
          if (!params.className) return 'Nombre de la clase requerido';
          if (!params.data) return 'Datos del documento requeridos';
          return null;
        },
        credentials: ['weaviateApi'],
        supportedOperations: ['addDocument']
      },
      'n8n-nodes-base.milvus.insertVector': {
        requiredParams: ['collectionName', 'vectors'],
        validateParams: (params) => {
          if (!params.collectionName) return 'Nombre de la colección requerido';
          if (!Array.isArray(params.vectors) || params.vectors.length === 0) return 'Vectores a insertar requeridos';
          return null;
        },
        credentials: ['milvusApi'],
        supportedOperations: ['insertVector']
      },
      'n8n-nodes-base.mlflow.logMetric': {
        requiredParams: ['runId', 'key', 'value'],
        validateParams: (params) => {
          if (!params.runId) return 'ID de la ejecución de MLflow requerido';
          if (!params.key) return 'Clave de la métrica requerida';
          if (params.value === undefined) return 'Valor de la métrica requerido';
          return null;
        },
        credentials: ['mlflowApi'],
        supportedOperations: ['logMetric']
      },
      'n8n-nodes-base.kubeflow.runPipeline': {
        requiredParams: ['pipelineId', 'jobName'],
        validateParams: (params) => {
          if (!params.pipelineId) return 'ID del pipeline de Kubeflow requerido';
          if (!params.jobName) return 'Nombre de la ejecución del job requerido';
          return null;
        },
        credentials: ['kubeflowApi'],
        supportedOperations: ['runPipeline']
      },
      'n8n-nodes-base.replicate.cancelPrediction': {
        requiredParams: ['predictionId'],
        validateParams: (params) => {
          if (!params.predictionId) return 'ID de la predicción de Replicate requerido';
          return null;
        },
        credentials: ['replicateApi'],
        supportedOperations: ['cancelPrediction']
      },
      'n8n-nodes-base.stabilityAi.imageToImage': {
        requiredParams: ['initImage', 'prompt', 'model'],
        validateParams: (params) => {
          if (!params.initImage) return 'Imagen inicial requerida';
          if (!params.prompt) return 'Prompt requerido';
          if (!params.model) return 'Modelo requerido';
          return null;
        },
        credentials: ['stabilityAiApi'],
        supportedOperations: ['imageToImage']
      },

      // Cloud & DevOps (15 Nodos)
      'n8n-nodes-base.awsCloudWatch.putMetricData': {
        requiredParams: ['metricName', 'namespace', 'value'],
        validateParams: (params) => {
          if (!params.metricName) return 'Nombre de la métrica requerido';
          if (!params.namespace) return 'Namespace de CloudWatch requerido';
          if (params.value === undefined) return 'Valor de la métrica requerido';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['putMetricData']
      },
      'n8n-nodes-base.awsSecretsManager.getSecret': {
        requiredParams: ['secretId'],
        validateParams: (params) => {
          if (!params.secretId) return 'ID del secreto requerido';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['getSecret']
      },
      'n8n-nodes-base.azureKeyVault.getSecret': {
        requiredParams: ['vaultUrl', 'secretName'],
        validateParams: (params) => {
          if (!params.vaultUrl) return 'URL de Key Vault requerida';
          if (!params.secretName) return 'Nombre del secreto requerido';
          return null;
        },
        credentials: ['azureServicePrincipal'],
        supportedOperations: ['getSecret']
      },
      'n8n-nodes-base.googleSecretManager.getSecret': {
        requiredParams: ['secretName'],
        validateParams: (params) => {
          if (!params.secretName) return 'Nombre del secreto requerido';
          return null;
        },
        credentials: ['googleCloudPlatformApi'],
        supportedOperations: ['getSecret']
      },
      'n8n-nodes-base.hashicorpVault.readSecret': {
        requiredParams: ['path'],
        validateParams: (params) => {
          if (!params.path) return 'Ruta del secreto requerido';
          return null;
        },
        credentials: ['hashicorpVaultApi'],
        supportedOperations: ['readSecret']
      },
      'n8n-nodes-base.awsEcs.runTask': {
        requiredParams: ['cluster', 'taskDefinition'],
        validateParams: (params) => {
          if (!params.cluster) return 'Cluster ECS requerido';
          if (!params.taskDefinition) return 'Definición de tarea ECS requerida';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['runTask']
      },
      'n8n-nodes-base.azureFunctions.invokeFunction': {
        requiredParams: ['functionApp', 'functionName', 'method'],
        validateParams: (params) => {
          if (!params.functionApp) return 'Nombre de la Function App requerido';
          if (!params.functionName) return 'Nombre de la función requerido';
          if (!params.method) return 'Método HTTP requerido';
          return null;
        },
        credentials: ['azureFunctionsApi'],
        supportedOperations: ['invokeFunction']
      },
      'n8n-nodes-base.googleCloudBuild.startBuild': {
        requiredParams: ['projectId', 'triggerId'],
        validateParams: (params) => {
          if (!params.projectId) return 'ID del proyecto de Google Cloud requerido';
          if (!params.triggerId) return 'ID del trigger de Cloud Build requerido';
          return null;
        },
        credentials: ['googleCloudPlatformApi'],
        supportedOperations: ['startBuild']
      },
      'n8n-nodes-base.kubernetes.runPod': {
        requiredParams: ['manifest'],
        validateParams: (params) => {
          if (!params.manifest || typeof params.manifest !== 'object') return 'Manifiesto de Pod requerido';
          return null;
        },
        credentials: ['kubernetesApi'],
        supportedOperations: ['runPod']
      },
      'n8n-nodes-base.terraformCloud.applyWorkspace': {
        requiredParams: ['organizationName', 'workspaceName'],
        validateParams: (params) => {
          if (!params.organizationName) return 'Nombre de la organización de Terraform Cloud requerido';
          if (!params.workspaceName) return 'Nombre del workspace de Terraform Cloud requerido';
          return null;
        },
        credentials: ['terraformCloudApi'],
        supportedOperations: ['applyWorkspace']
      },
      'n8n-nodes-base.ansibleTower.launchJobTemplate': {
        requiredParams: ['jobTemplateId'],
        validateParams: (params) => {
          if (!params.jobTemplateId) return 'ID de la plantilla de job de Ansible Tower requerido';
          return null;
        },
        credentials: ['ansibleTowerApi'],
        supportedOperations: ['launchJobTemplate']
      },
      'n8n-nodes-base.dockerHub.triggerBuild': {
        requiredParams: ['repository', 'buildToken'],
        validateParams: (params) => {
          if (!params.repository) return 'Nombre del repositorio Docker Hub requerido';
          if (!params.buildToken) return 'Token de build de Docker Hub requerido';
          return null;
        },
        credentials: [], // Se pasa el token directamente
        supportedOperations: ['triggerBuild']
      },
      'n8n-nodes-base.azureContainerRegistry.buildImage': {
        requiredParams: ['registryName', 'sourceLocation', 'imageName'],
        validateParams: (params) => {
          if (!params.registryName) return 'Nombre del Container Registry de Azure requerido';
          if (!params.sourceLocation) return 'Ubicación del código fuente requerida';
          if (!params.imageName) return 'Nombre de la imagen requerido';
          return null;
        },
        credentials: ['azureServicePrincipal'],
        supportedOperations: ['buildImage']
      },
      'n8n-nodes-base.digitalOceanKubernetes.createCluster': {
        requiredParams: ['name', 'region', 'nodePools'],
        validateParams: (params) => {
          if (!params.name) return 'Nombre del cluster requerido';
          if (!params.region) return 'Región requerida';
          if (!Array.isArray(params.nodePools) || params.nodePools.length === 0) return 'Al menos un node pool requerido';
          return null;
        },
        credentials: ['digitalOceanApi'],
        supportedOperations: ['createCluster']
      },
      'n8n-nodes-base.vercel.getDeployments': {
        requiredParams: ['projectId'],
        validateParams: (params) => {
          if (!params.projectId) return 'ID del proyecto de Vercel requerido';
          return null;
        },
        credentials: ['vercelApi'],
        supportedOperations: ['getDeployments']
      },

      // CRM / Sales / Marketing (10 Nodos)
      'n8n-nodes-base.zendesk.updateTicket': {
        requiredParams: ['ticketId', 'data'],
        validateParams: (params) => {
          if (!params.ticketId) return 'ID del ticket requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['zendeskApi'],
        supportedOperations: ['updateTicket']
      },
      'n8n-nodes-base.freshdesk.updateTicket': {
        requiredParams: ['ticketId', 'data'],
        validateParams: (params) => {
          if (!params.ticketId) return 'ID del ticket requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['freshdeskApi'],
        supportedOperations: ['updateTicket']
      },
      'n8n-nodes-base.pipedrive.updateActivity': {
        requiredParams: ['activityId', 'data'],
        validateParams: (params) => {
          if (!params.activityId) return 'ID de la actividad requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['pipedriveApi'],
        supportedOperations: ['updateActivity']
      },
      'n8n-nodes-base.mailchimp.updateMember': {
        requiredParams: ['listId', 'emailAddress', 'data'],
        validateParams: (params) => {
          if (!params.listId) return 'List ID requerido';
          if (!params.emailAddress || !/\S+@\S+\.\S+/.test(params.emailAddress)) return 'Email inválido o requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['mailchimpApi'],
        supportedOperations: ['updateMember']
      },
      'n8n-nodes-base.constantContact.addContact': {
        requiredParams: ['emailAddress', 'listIds'],
        validateParams: (params) => {
          if (!params.emailAddress || !/\S+@\S+\.\S+/.test(params.emailAddress)) return 'Email inválido o requerido';
          if (!Array.isArray(params.listIds) || params.listIds.length === 0) return 'Al menos un List ID requerido';
          return null;
        },
        credentials: ['constantContactApi'],
        supportedOperations: ['addContact']
      },
      'n8n-nodes-base.convertkit.addSubscriber': {
        requiredParams: ['formId', 'emailAddress'],
        validateParams: (params) => {
          if (!params.formId) return 'ID del formulario o etiqueta requerido';
          if (!params.emailAddress || !/\S+@\S+\.\S+/.test(params.emailAddress)) return 'Email inválido o requerido';
          return null;
        },
        credentials: ['convertKitApi'],
        supportedOperations: ['addSubscriber']
      },
      'n8n-nodes-base.sendpulse.sendEmail': {
        requiredParams: ['to', 'subject', 'body'],
        validateParams: (params) => {
          if (!params.to || !Array.isArray(params.to) || params.to.length === 0) return 'Destinatarios requeridos';
          if (!params.subject) return 'Asunto requerido';
          if (!params.body) return 'Cuerpo del email requerido';
          return null;
        },
        credentials: ['sendpulseApi'],
        supportedOperations: ['sendEmail']
      },
      'n8n-nodes-base.gainsight.createEngagement': {
        requiredParams: ['customerName', 'engagementType', 'dueDate'],
        validateParams: (params) => {
          if (!params.customerName) return 'Nombre del cliente requerido';
          if (!params.engagementType) return 'Tipo de engagement requerido';
          if (!params.dueDate) return 'Fecha de vencimiento requerida';
          return null;
        },
        credentials: ['gainsightApi'],
        supportedOperations: ['createEngagement']
      },
      'n8n-nodes-base.drift.updateContact': {
        requiredParams: ['contactId', 'data'],
        validateParams: (params) => {
          if (!params.contactId) return 'ID del contacto de Drift requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['driftApi'],
        supportedOperations: ['updateContact']
      },
      'n8n-nodes-base.apolloIo.createPerson': {
        requiredParams: ['email'],
        validateParams: (params) => {
          if (!params.email || !/\S+@\S+\.\S+/.test(params.email)) return 'Email inválido o requerido';
          return null;
        },
        credentials: ['apolloIoApi'],
        supportedOperations: ['createPerson']
      },

      // E-commerce & Payments (10 Nodos)
      'n8n-nodes-base.stripeCheckout.createSession': {
        requiredParams: ['mode', 'lineItems', 'successUrl', 'cancelUrl'],
        validateParams: (params) => {
          if (!['payment', 'subscription'].includes(params.mode)) return 'Modo de Stripe Checkout no válido';
          if (!Array.isArray(params.lineItems) || params.lineItems.length === 0) return 'Line items requeridos';
          if (!params.successUrl) return 'URL de éxito requerida';
          if (!params.cancelUrl) return 'URL de cancelación requerida';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['createSession']
      },
      'n8n-nodes-base.stripeConnect.transferMoney': {
        requiredParams: ['amount', 'currency', 'destinationAccount'],
        validateParams: (params) => {
          if (typeof params.amount !== 'number' || params.amount <= 0) return 'Amount debe ser un número positivo';
          if (!params.currency) return 'Currency requerido';
          if (!params.destinationAccount) return 'ID de la cuenta de destino requerida';
          return null;
        },
        credentials: ['stripeApi'],
        supportedOperations: ['transferMoney', 'retrieveBalance']
      },
      'n8n-nodes-base.gocardless.createPayment': {
        requiredParams: ['amount', 'currency', 'mandateId'],
        validateParams: (params) => {
          if (typeof params.amount !== 'number' || params.amount <= 0) return 'Amount debe ser un número positivo';
          if (!params.currency) return 'Currency requerido';
          if (!params.mandateId) return 'Mandate ID requerido';
          return null;
        },
        credentials: ['goCardlessApi'],
        supportedOperations: ['createPayment']
      },
      'n8n-nodes-base.wise.createTransfer': {
        requiredParams: ['sourceCurrency', 'targetCurrency', 'amount', 'profileId'],
        validateParams: (params) => {
          if (!params.sourceCurrency) return 'Moneda de origen requerida';
          if (!params.targetCurrency) return 'Moneda de destino requerida';
          if (typeof params.amount !== 'number' || params.amount <= 0) return 'Amount debe ser un número positivo';
          if (!params.profileId) return 'ID de perfil de Wise requerido';
          return null;
        },
        credentials: ['wiseApi'],
        supportedOperations: ['createTransfer']
      },
      'n8n-nodes-base.coinbase.sendMoney': {
        requiredParams: ['to', 'amount', 'currency'],
        validateParams: (params) => {
          if (!params.to) return 'Destinatario requerido (email o dirección de criptomoneda)';
          if (typeof params.amount !== 'number' || params.amount <= 0) return 'Amount debe ser un número positivo';
          if (!params.currency) return 'Currency requerido (ej. BTC, ETH, USD)';
          return null;
        },
        credentials: ['coinbaseApi'],
        supportedOperations: ['sendMoney']
      },
      'n8n-nodes-base.etsy.updateListing': {
        requiredParams: ['listingId', 'data'],
        validateParams: (params) => {
          if (!params.listingId) return 'ID del listado de Etsy requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['etsyApi'],
        supportedOperations: ['updateListing']
      },
      'n8n-nodes-base.bigcommerce.updateOrder': {
        requiredParams: ['orderId', 'data'],
        validateParams: (params) => {
          if (!params.orderId) return 'ID de la orden requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['bigCommerceApi'],
        supportedOperations: ['updateOrder']
      },
      'n8n-nodes-base.recart.sendSms': {
        requiredParams: ['phoneNumber', 'message'],
        validateParams: (params) => {
          if (!params.phoneNumber) return 'Número de teléfono requerido';
          if (!params.message) return 'Mensaje SMS requerido';
          return null;
        },
        credentials: ['recartApi'],
        supportedOperations: ['sendSms']
      },
      'n8n-nodes-base.lemonSqueezy.createProduct': {
        requiredParams: ['name', 'price', 'productType'],
        validateParams: (params) => {
          if (!params.name) return 'Nombre del producto requerido';
          if (typeof params.price !== 'number' || params.price <= 0) return 'Precio debe ser un número positivo';
          if (!params.productType) return 'Tipo de producto requerido';
          return null;
        },
        credentials: ['lemonSqueezyApi'],
        supportedOperations: ['createProduct']
      },
      'n8n-nodes-base.paddle.updateCustomer': {
        requiredParams: ['customerId', 'data'],
        validateParams: (params) => {
          if (!params.customerId) return 'ID del cliente requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['paddleApi'],
        supportedOperations: ['updateCustomer']
      },

      // Databases & Data Warehousing (10 Nodos)
      'n8n-nodes-base.mongoDb.deleteMany': {
        requiredParams: ['collectionName', 'filter'],
        validateParams: (params) => {
          if (!params.collectionName) return 'Collection Name requerido';
          if (typeof params.filter !== 'object') return 'Filtro requerido para eliminar múltiples documentos';
          return null;
        },
        credentials: ['mongoDb'],
        supportedOperations: ['deleteMany']
      },
      'n8n-nodes-base.postgres.truncateTable': {
        requiredParams: ['tableName'],
        validateParams: (params) => {
          if (!params.tableName) return 'Nombre de la tabla requerido';
          return null;
        },
        credentials: ['postgres'],
        supportedOperations: ['truncateTable']
      },
      'n8n-nodes-base.mysql.endTransaction': {
        requiredParams: ['action'],
        validateParams: (params) => {
          if (!['commit', 'rollback'].includes(params.action)) return 'Acción de transacción no válida (commit o rollback)';
          return null;
        },
        credentials: ['mySql'],
        supportedOperations: ['endTransaction']
      },
      'n8n-nodes-base.redis.getSet': {
        requiredParams: ['key'],
        validateParams: (params) => {
          if (!params.key) return 'Clave del set requerido';
          return null;
        },
        credentials: ['redis'],
        supportedOperations: ['getSet']
      },
      'n8n-nodes-base.elasticsearch.createIndex': {
        requiredParams: ['indexName'],
        validateParams: (params) => {
          if (!params.indexName) return 'Nombre del índice requerido';
          return null;
        },
        credentials: ['elasticsearchApi'],
        supportedOperations: ['createIndex']
      },
      'n8n-nodes-base.dynamodb.updateItem': {
        requiredParams: ['tableName', 'key', 'updateExpression'],
        validateParams: (params) => {
          if (!params.tableName) return 'Nombre de la tabla requerido';
          if (typeof params.key !== 'object' || Object.keys(params.key).length === 0) return 'Clave del item requerida';
          if (!params.updateExpression) return 'Expresión de actualización requerida';
          return null;
        },
        credentials: ['aws'], // Reutiliza
        supportedOperations: ['updateItem']
      },


      // Hasura - Insert Data
      'n8n-nodes-base.hasura.insertData': {
        requiredParams: ['tableName', 'data'],
        validateParams: (params) => {
          if (!params.tableName) return 'Table Name requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a insertar requeridos';
          return null;
        },
        credentials: ['hasuraApi'],
        supportedOperations: ['insertData']
      },


      // GraphQL - Make Request
      'n8n-nodes-base.graphql.makeRequest': {
        requiredParams: ['endpoint', 'query'],
        validateParams: (params) => {
          if (!params.endpoint) return 'Endpoint GraphQL requerido';
          if (!params.query) return 'Query GraphQL requerido';
          return null;
        },
        credentials: [], // Opcional, puede usar 'httpBasicAuth' o 'apiKey'
        supportedOperations: ['makeRequest', 'mutateData']
      },
      // GraphQL - Mutate Data
      'n8n-nodes-base.graphql.mutateData': {
        requiredParams: ['endpoint', 'mutation'],
        validateParams: (params) => {
          if (!params.endpoint) return 'Endpoint GraphQL requerido';
          if (!params.mutation) return 'Mutation GraphQL requerido';
          return null;
        },
        credentials: [],
        supportedOperations: ['mutateData']
      },
      // REST API - Patch Request
      'n8n-nodes-base.restapi.patchRequest': {
        requiredParams: ['url', 'data'],
        validateParams: (params) => {
          if (!params.url) return 'URL requerida';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos para PATCH requeridos';
          return null;
        },
        credentials: [],
        supportedOperations: ['patchRequest']
      },
      // SOAP - Invoke Operation
      'n8n-nodes-base.soap.invokeOperation': {
        requiredParams: ['wsdlUrl', 'operationName', 'args'],
        validateParams: (params) => {
          if (!params.wsdlUrl) return 'WSDL URL requerido';
          if (!params.operationName) return 'Nombre de operación SOAP requerido';
          if (typeof params.args !== 'object') return 'Argumentos de la operación SOAP requeridos';
          return null;
        },
        credentials: [],
        supportedOperations: ['invokeOperation']
      },
      // XML - Transform XML
      'n8n-nodes-base.xml.transformXml': {
        requiredParams: ['xmlData', 'xsltStylesheet'],
        validateParams: (params) => {
          if (!params.xmlData) return 'Datos XML requeridos';
          if (!params.xsltStylesheet) return 'Stylesheet XSLT requerido';
          return null;
        },
        credentials: [],
        supportedOperations: ['transformXml']
      },


      // Jira Cloud - Create Issue (diferente al genérico para distinguir Cloud de Server)
      'n8n-nodes-base.jiraCloud.createIssue': {
        requiredParams: ['projectKey', 'issueType', 'summary'],
        validateParams: (params) => {
          if (!params.projectKey) return 'Project Key requerido';
          if (!params.issueType) return 'Tipo de issue requerido';
          if (!params.summary) return 'Summary requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['createIssue', 'updateIssue']
      },
      // Jira - Update Issue
      'n8n-nodes-base.jira.updateIssue': {
        requiredParams: ['issueId', 'data'],
        validateParams: (params) => {
          if (!params.issueId) return 'Issue ID requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['updateIssue']
      },
      // Jira - Add Comment To Issue (más específico)
      'n8n-nodes-base.jira.addCommentToIssue': {
        requiredParams: ['issueId', 'comment'],
        validateParams: (params) => {
          if (!params.issueId) return 'Issue ID requerido';
          if (!params.comment) return 'Comentario requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['addCommentToIssue']
      },
      // Jira - Create Epic (new in Phase 3)
      'n8n-nodes-base.jira.createEpic': {
        requiredParams: ['projectKey', 'summary', 'epicName'],
        validateParams: (params) => {
          if (!params.projectKey) return 'Project Key requerido';
          if (!params.summary) return 'Summary del Epic requerido';
          if (!params.epicName) return 'Nombre del Epic requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['createEpic']
      },
      // Jira - Add Watcher (new in Phase 3)
      'n8n-nodes-base.jira.addWatcher': {
        requiredParams: ['issueId', 'watcherAccountId'],
        validateParams: (params) => {
          if (!params.issueId) return 'Issue ID requerido';
          if (!params.watcherAccountId) return 'Account ID del observador requerido';
          return null;
        },
        credentials: ['jiraSoftwareCloudApi'],
        supportedOperations: ['addWatcher']
      },


      // Datadog - Post Event
      'n8n-nodes-base.datadog.postEvent': {
        requiredParams: ['title', 'text'],
        validateParams: (params) => {
          if (!params.title) return 'Título del evento requerido';
          if (!params.text) return 'Texto del evento requerido';
          return null;
        },
        credentials: ['datadogApi'],
        supportedOperations: ['postEvent', 'getMetrics']
      },
      // Datadog - Get Metrics
      'n8n-nodes-base.datadog.getMetrics': {
        requiredParams: ['metricName', 'from', 'to'],
        validateParams: (params) => {
          if (!params.metricName) return 'Nombre de la métrica requerido';
          if (!params.from) return 'Fecha de inicio (from) requerida';
          if (!params.to) return 'Fecha de fin (to) requerida';
          return null;
        },
        credentials: ['datadogApi'],
        supportedOperations: ['getMetrics']
      },
      // Logz.io - Send Logs
      'n8n-nodes-base.logzio.sendLogs': {
        requiredParams: ['token', 'logData'],
        validateParams: (params) => {
          if (!params.token) return 'Token de Logz.io requerido';
          if (!params.logData) return 'Datos de log requeridos';
          return null;
        },
        credentials: ['logzioApi'],
        supportedOperations: ['sendLogs']
      },
      // Splunk - Send Event
      'n8n-nodes-base.splunk.sendEvent': {
        requiredParams: ['host', 'source', 'sourcetype', 'event'],
        validateParams: (params) => {
          if (!params.host) return 'Host de Splunk requerido';
          if (!params.source) return 'Source requerido';
          if (!params.sourcetype) return 'Sourcetype requerido';
          if (!params.event) return 'Evento requerido';
          return null;
        },
        credentials: ['splunkApi'],
        supportedOperations: ['sendEvent']
      },
      // StatusPage.io - Update Component
      'n8n-nodes-base.statusPage.updateComponent': {
        requiredParams: ['pageId', 'componentId', 'status'],
        validateParams: (params) => {
          if (!params.pageId) return 'Page ID requerido';
          if (!params.componentId) return 'Component ID requerido';
          if (!['operational', 'under_maintenance', 'degraded_performance', 'partial_outage', 'major_outage'].includes(params.status)) return 'Estado de componente no válido';
          return null;
        },
        credentials: ['statusPageApi'],
        supportedOperations: ['updateComponent']
      },
      // PagerDuty - Create Event
      'n8n-nodes-base.pagerDuty.createEvent': {
        requiredParams: ['routingKey', 'summary', 'severity'],
        validateParams: (params) => {
          if (!params.routingKey) return 'Routing Key requerido';
          if (!params.summary) return 'Summary del evento requerido';
          if (!['critical', 'error', 'warning', 'info'].includes(params.severity)) return 'Nivel de severidad no válido';
          return null;
        },
        credentials: ['pagerDutyApi'],
        supportedOperations: ['createEvent']
      },
      // Opsgenie - Create Alert
      'n8n-nodes-base.opsgenie.createAlert': {
        requiredParams: ['message', 'priority'],
        validateParams: (params) => {
          if (!params.message) return 'Mensaje de alerta requerido';
          if (!['P1', 'P2', 'P3', 'P4', 'P5'].includes(params.priority)) return 'Prioridad de alerta no válida';
          return null;
        },
        credentials: ['opsgenieApi'],
        supportedOperations: ['createAlert']
      },


      // Grafana - Create Alert
      'n8n-nodes-base.grafana.createAlert': {
        requiredParams: ['dashboardId', 'panelId', 'query', 'name'],
        validateParams: (params) => {
          if (!params.dashboardId) return 'Dashboard ID requerido';
          if (!params.panelId) return 'Panel ID requerido';
          if (!params.query) return 'Query de la alerta requerida';
          if (!params.name) return 'Nombre de la alerta requerido';
          return null;
        },
        credentials: ['grafanaApi'],
        supportedOperations: ['createAlert', 'queryDatasource']
      },
      // Grafana - Query Datasource
      'n8n-nodes-base.grafana.queryDatasource': {
        requiredParams: ['datasourceId', 'query'],
        validateParams: (params) => {
          if (!params.datasourceId) return 'Datasource ID requerido';
          if (!params.query) return 'Query requerida';
          return null;
        },
        credentials: ['grafanaApi'],
        supportedOperations: ['queryDatasource']
      },
      // Grafana Loki - Push Log (new in Phase 3)
      'n8n-nodes-base.grafanaLoki.pushLog': {
        requiredParams: ['streams'],
        validateParams: (params) => {
          if (!Array.isArray(params.streams) || params.streams.length === 0) return 'Streams de log requeridos';
          return null;
        },
        credentials: ['grafanaLokiApi'],
        supportedOperations: ['pushLog', 'queryLogs']
      },
      // Grafana Loki - Query Logs (new in Phase 3)
      'n8n-nodes-base.grafanaLoki.queryLogs': {
        requiredParams: ['query'],
        validateParams: (params) => {
          if (!params.query) return 'Query de Loki (LogQL) requerida';
          return null;
        },
        credentials: ['grafanaLokiApi'],
        supportedOperations: ['queryLogs']
      },
      // Prometheus - Push Metric (new in Phase 3)
      'n8n-nodes-base.prometheus.pushMetric': {
        requiredParams: ['job', 'instance', 'metrics'],
        validateParams: (params) => {
          if (!params.job) return 'Nombre del job requerido';
          if (!params.instance) return 'Instancia requerida';
          if (!Array.isArray(params.metrics) || params.metrics.length === 0) return 'Métricas requeridas';
          return null;
        },
        credentials: ['prometheusPushgateway'],
        supportedOperations: ['pushMetric', 'queryMetrics']
      },
      // Prometheus - Query Metrics (new in Phase 3)
      'n8n-nodes-base.prometheus.queryMetrics': {
        requiredParams: ['query'],
        validateParams: (params) => {
          if (!params.query) return 'Query PromQL requerida';
          return null;
        },
        credentials: ['prometheusApi'], // New Credential if not using pushgateway
        supportedOperations: ['queryMetrics']
      },
      // New Relic - Post Metric (new in Phase 3)
      'n8n-nodes-base.newRelic.postMetric': {
        requiredParams: ['metrics'],
        validateParams: (params) => {
          if (!Array.isArray(params.metrics) || params.metrics.length === 0) return 'Métricas requeridas';
          return null;
        },
        credentials: ['newRelicApi'],
        supportedOperations: ['postMetric', 'getAlerts']
      },
      // New Relic - Get Alerts (new in Phase 3)
      'n8n-nodes-base.newRelic.getAlerts': {
        requiredParams: ['policyId'],
        validateParams: (params) => {
          if (!params.policyId) return 'Policy ID requerido';
          return null;
        },
        credentials: ['newRelicApi'],
        supportedOperations: ['getAlerts']
      },
      // AppDynamics - Report Event (new in Phase 3)
      'n8n-nodes-base.appDynamics.reportEvent': {
        requiredParams: ['eventName', 'eventProperties'],
        validateParams: (params) => {
          if (!params.eventName) return 'Nombre del evento requerido';
          if (typeof params.eventProperties !== 'object' || Object.keys(params.eventProperties).length === 0) return 'Propiedades del evento requeridas';
          return null;
        },
        credentials: ['appDynamicsApi'],
        supportedOperations: ['reportEvent', 'getMetrics']
      },
      // AppDynamics - Get Metrics (new in Phase 3)
      'n8n-nodes-base.appDynamics.getMetrics': {
        requiredParams: ['metricPath', 'timeRange'],
        validateParams: (params) => {
          if (!params.metricPath) return 'Metric Path requerido';
          if (!params.timeRange) return 'Rango de tiempo requerido';
          return null;
        },
        credentials: ['appDynamicsApi'],
        supportedOperations: ['getMetrics']
      },


      // Jenkins - Start Job
      'n8n-nodes-base.jenkins.startJob': {
        requiredParams: ['jobName'],
        validateParams: (params) => {
          if (!params.jobName) return 'Nombre del job de Jenkins requerido';
          return null;
        },
        credentials: ['jenkinsApi'],
        supportedOperations: ['startJob', 'buildWithParameters']
      },
      // Jenkins - Build With Parameters
      'n8n-nodes-base.jenkins.buildWithParameters': {
        requiredParams: ['jobName', 'parameters'],
        validateParams: (params) => {
          if (!params.jobName) return 'Nombre del job de Jenkins requerido';
          if (typeof params.parameters !== 'object') return 'Parámetros de construcción requeridos';
          return null;
        },
        credentials: ['jenkinsApi'],
        supportedOperations: ['buildWithParameters']
      },
      // Jenkins - Run Jenkinsfile (new in Phase 3)
      'n8n-nodes-base.jenkins.runJenkinsfile': {
        requiredParams: ['repositoryUrl', 'jenkinsfilePath'],
        validateParams: (params) => {
          if (!params.repositoryUrl) return 'URL del repositorio Git requerido';
          if (!params.jenkinsfilePath) return 'Ruta del Jenkinsfile requerida';
          return null;
        },
        credentials: ['jenkinsApi'],
        supportedOperations: ['runJenkinsfile']
      },

      // --- INICIO DE VALIDACIONES PARA NUEVOS NODOS (Fase 4) ---

      // AI/ML & Data Science (15 Nodos)
      'n8n-nodes-base.awsTextract.analyzeDocument': {
        requiredParams: ['document'],
        validateParams: (params) => {
          if (!params.document) return 'Documento (imagen/PDF) requerido para análisis';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['analyzeDocument']
      },
      'n8n-nodes-base.azureOpenAi.chatCompletion': {
        requiredParams: ['deploymentId', 'messages'],
        validateParams: (params) => {
          if (!params.deploymentId) return 'Deployment ID requerido para Azure OpenAI';
          if (!Array.isArray(params.messages) || params.messages.length === 0) return 'Mensajes requeridos para chat completion';
          return null;
        },
        credentials: ['azureOpenAiApi'],
        supportedOperations: ['chatCompletion']
      },
      'n8n-nodes-base.googleCloudNaturalLanguage.analyzeSentiment': {
        requiredParams: ['document'],
        validateParams: (params) => {
          if (!params.document || !params.document.content) return 'Contenido del documento requerido para análisis de sentimiento';
          return null;
        },
        credentials: ['googleCloudPlatformApi'],
        supportedOperations: ['analyzeSentiment']
      },
      'n8n-nodes-base.tensorflow.runModel': {
        requiredParams: ['modelUrl', 'inputs'],
        validateParams: (params) => {
          if (!params.modelUrl) return 'URL del modelo TensorFlow.js requerido';
          if (!params.inputs) return 'Inputs para el modelo requeridos';
          return null;
        },
        credentials: [], // Generalmente no requiere credenciales directas
        supportedOperations: ['runModel']
      },
      'n8n-nodes-base.pytorch.runModel': {
        requiredParams: ['modelPath', 'data'],
        validateParams: (params) => {
          if (!params.modelPath) return 'Ruta del modelo PyTorch requerida';
          if (!params.data) return 'Datos de entrada requeridos';
          return null;
        },
        credentials: [], // Generalmente no requiere credenciales directas
        supportedOperations: ['runModel']
      },
      'n8n-nodes-base.huggingFace.summarization': {
        requiredParams: ['model', 'text'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido';
          if (!params.text) return 'Texto a resumir requerido';
          return null;
        },
        credentials: ['huggingFaceApi'],
        supportedOperations: ['summarization']
      },
      'n8n-nodes-base.huggingFace.translation': {
        requiredParams: ['model', 'text', 'targetLanguage'],
        validateParams: (params) => {
          if (!params.model) return 'Modelo requerido';
          if (!params.text) return 'Texto a traducir requerido';
          if (!params.targetLanguage) return 'Idioma objetivo requerido';
          return null;
        },
        credentials: ['huggingFaceApi'],
        supportedOperations: ['translation']
      },
      'n8n-nodes-base.langchain.executeChain': {
        requiredParams: ['chain', 'input'],
        validateParams: (params) => {
          if (!params.chain) return 'Cadena LangChain requerida';
          if (!params.input) return 'Input para la cadena requerido';
          return null;
        },
        credentials: [], // Depende de los LLMs y herramientas dentro de la cadena
        supportedOperations: ['executeChain']
      },
      'n8n-nodes-base.pinecone.upsertVector': {
        requiredParams: ['indexName', 'vectors'],
        validateParams: (params) => {
          if (!params.indexName) return 'Nombre del índice requerido';
          if (!Array.isArray(params.vectors) || params.vectors.length === 0) return 'Vectores a insertar requeridos';
          return null;
        },
        credentials: ['pineconeApi'],
        supportedOperations: ['upsertVector']
      },
      'n8n-nodes-base.weaviate.addDocument': {
        requiredParams: ['className', 'data'],
        validateParams: (params) => {
          if (!params.className) return 'Nombre de la clase requerido';
          if (!params.data) return 'Datos del documento requeridos';
          return null;
        },
        credentials: ['weaviateApi'],
        supportedOperations: ['addDocument']
      },
      'n8n-nodes-base.milvus.insertVector': {
        requiredParams: ['collectionName', 'vectors'],
        validateParams: (params) => {
          if (!params.collectionName) return 'Nombre de la colección requerido';
          if (!Array.isArray(params.vectors) || params.vectors.length === 0) return 'Vectores a insertar requeridos';
          return null;
        },
        credentials: ['milvusApi'],
        supportedOperations: ['insertVector']
      },
      'n8n-nodes-base.mlflow.logMetric': {
        requiredParams: ['runId', 'key', 'value'],
        validateParams: (params) => {
          if (!params.runId) return 'ID de la ejecución de MLflow requerido';
          if (!params.key) return 'Clave de la métrica requerida';
          if (params.value === undefined) return 'Valor de la métrica requerido';
          return null;
        },
        credentials: ['mlflowApi'],
        supportedOperations: ['logMetric']
      },
      'n8n-nodes-base.kubeflow.runPipeline': {
        requiredParams: ['pipelineId', 'jobName'],
        validateParams: (params) => {
          if (!params.pipelineId) return 'ID del pipeline de Kubeflow requerido';
          if (!params.jobName) return 'Nombre de la ejecución del job requerido';
          return null;
        },
        credentials: ['kubeflowApi'],
        supportedOperations: ['runPipeline']
      },
      'n8n-nodes-base.replicate.cancelPrediction': {
        requiredParams: ['predictionId'],
        validateParams: (params) => {
          if (!params.predictionId) return 'ID de la predicción de Replicate requerido';
          return null;
        },
        credentials: ['replicateApi'],
        supportedOperations: ['cancelPrediction']
      },
      'n8n-nodes-base.stabilityAi.imageToImage': {
        requiredParams: ['initImage', 'prompt', 'model'],
        validateParams: (params) => {
          if (!params.initImage) return 'Imagen inicial requerida';
          if (!params.prompt) return 'Prompt requerido';
          if (!params.model) return 'Modelo requerido';
          return null;
        },
        credentials: ['stabilityAiApi'],
        supportedOperations: ['imageToImage']
      },

      // Cloud & DevOps (15 Nodos)
      'n8n-nodes-base.awsCloudWatch.putMetricData': {
        requiredParams: ['metricName', 'namespace', 'value'],
        validateParams: (params) => {
          if (!params.metricName) return 'Nombre de la métrica requerido';
          if (!params.namespace) return 'Namespace de CloudWatch requerido';
          if (params.value === undefined) return 'Valor de la métrica requerido';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['putMetricData']
      },
      'n8n-nodes-base.awsSecretsManager.getSecret': {
        requiredParams: ['secretId'],
        validateParams: (params) => {
          if (!params.secretId) return 'ID del secreto requerido';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['getSecret']
      },
      'n8n-nodes-base.azureKeyVault.getSecret': {
        requiredParams: ['vaultUrl', 'secretName'],
        validateParams: (params) => {
          if (!params.vaultUrl) return 'URL de Key Vault requerida';
          if (!params.secretName) return 'Nombre del secreto requerido';
          return null;
        },
        credentials: ['azureServicePrincipal'],
        supportedOperations: ['getSecret']
      },
      'n8n-nodes-base.googleSecretManager.getSecret': {
        requiredParams: ['secretName'],
        validateParams: (params) => {
          if (!params.secretName) return 'Nombre del secreto requerido';
          return null;
        },
        credentials: ['googleCloudPlatformApi'],
        supportedOperations: ['getSecret']
      },
      'n8n-nodes-base.hashicorpVault.readSecret': {
        requiredParams: ['path'],
        validateParams: (params) => {
          if (!params.path) return 'Ruta del secreto requerido';
          return null;
        },
        credentials: ['hashicorpVaultApi'],
        supportedOperations: ['readSecret']
      },
      'n8n-nodes-base.awsEcs.runTask': {
        requiredParams: ['cluster', 'taskDefinition'],
        validateParams: (params) => {
          if (!params.cluster) return 'Cluster ECS requerido';
          if (!params.taskDefinition) return 'Definición de tarea ECS requerida';
          return null;
        },
        credentials: ['aws'],
        supportedOperations: ['runTask']
      },
      'n8n-nodes-base.azureFunctions.invokeFunction': {
        requiredParams: ['functionApp', 'functionName', 'method'],
        validateParams: (params) => {
          if (!params.functionApp) return 'Nombre de la Function App requerido';
          if (!params.functionName) return 'Nombre de la función requerido';
          if (!params.method) return 'Método HTTP requerido';
          return null;
        },
        credentials: ['azureFunctionsApi'],
        supportedOperations: ['invokeFunction']
      },
      'n8n-nodes-base.googleCloudBuild.startBuild': {
        requiredParams: ['projectId', 'triggerId'],
        validateParams: (params) => {
          if (!params.projectId) return 'ID del proyecto de Google Cloud requerido';
          if (!params.triggerId) return 'ID del trigger de Cloud Build requerido';
          return null;
        },
        credentials: ['googleCloudPlatformApi'],
        supportedOperations: ['startBuild']
      },
      'n8n-nodes-base.kubernetes.runPod': {
        requiredParams: ['manifest'],
        validateParams: (params) => {
          if (!params.manifest || typeof params.manifest !== 'object') return 'Manifiesto de Pod requerido';
          return null;
        },
        credentials: ['kubernetesApi'],
        supportedOperations: ['runPod']
      },
      'n8n-nodes-base.terraformCloud.applyWorkspace': {
        requiredParams: ['organizationName', 'workspaceName'],
        validateParams: (params) => {
          if (!params.organizationName) return 'Nombre de la organización de Terraform Cloud requerido';
          if (!params.workspaceName) return 'Nombre del workspace de Terraform Cloud requerido';
          return null;
        },
        credentials: ['terraformCloudApi'],
        supportedOperations: ['applyWorkspace']
      },
      'n8n-nodes-base.ansibleTower.launchJobTemplate': {
        requiredParams: ['jobTemplateId'],
        validateParams: (params) => {
          if (!params.jobTemplateId) return 'ID de la plantilla de job de Ansible Tower requerido';
          return null;
        },
        credentials: ['ansibleTowerApi'],
        supportedOperations: ['launchJobTemplate']
      },
      'n8n-nodes-base.dockerHub.triggerBuild': {
        requiredParams: ['repository', 'buildToken'],
        validateParams: (params) => {
          if (!params.repository) return 'Nombre del repositorio Docker Hub requerido';
          if (!params.buildToken) return 'Token de build de Docker Hub requerido';
          return null;
        },
        credentials: [], // Se pasa el token directamente
        supportedOperations: ['triggerBuild']
      },
      'n8n-nodes-base.azureContainerRegistry.buildImage': {
        requiredParams: ['registryName', 'sourceLocation', 'imageName'],
        validateParams: (params) => {
          if (!params.registryName) return 'Nombre del Container Registry de Azure requerido';
          if (!params.sourceLocation) return 'Ubicación del código fuente requerida';
          if (!params.imageName) return 'Nombre de la imagen requerido';
          return null;
        },
        credentials: ['azureServicePrincipal'],
        supportedOperations: ['buildImage']
      },
      'n8n-nodes-base.digitalOceanKubernetes.createCluster': {
        requiredParams: ['name', 'region', 'nodePools'],
        validateParams: (params) => {
          if (!params.name) return 'Nombre del cluster requerido';
          if (!params.region) return 'Región requerida';
          if (!Array.isArray(params.nodePools) || params.nodePools.length === 0) return 'Al menos un node pool requerido';
          return null;
        },
        credentials: ['digitalOceanApi'],
        supportedOperations: ['createCluster']
      },
      'n8n-nodes-base.vercel.getDeployments': {
        requiredParams: ['projectId'],
        validateParams: (params) => {
          if (!params.projectId) return 'ID del proyecto de Vercel requerido';
          return null;
        },
        credentials: ['vercelApi'],
        supportedOperations: ['getDeployments']
      },

      // CRM / Sales / Marketing (10 Nodos)
      'n8n-nodes-base.zendesk.updateTicket': {
        requiredParams: ['ticketId', 'data'],
        validateParams: (params) => {
          if (!params.ticketId) return 'ID del ticket requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['zendeskApi'],
        supportedOperations: ['updateTicket']
      },
      'n8n-nodes-base.freshdesk.updateTicket': {
        requiredParams: ['ticketId', 'data'],
        validateParams: (params) => {
          if (!params.ticketId) return 'ID del ticket requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['freshdeskApi'],
        supportedOperations: ['updateTicket']
      },
      'n8n-nodes-base.pipedrive.updateActivity': {
        requiredParams: ['activityId', 'data'],
        validateParams: (params) => {
          if (!params.activityId) return 'ID de la actividad requerido';
          if (typeof params.data !== 'object' || Object.keys(params.data).length === 0) return 'Datos a actualizar requeridos';
          return null;
        },
        credentials: ['pipedriveApi'],
        supportedOperations: ['updateActivity']
      }
      // --- FIN DE VALIDACIONES PARA NUEVOS NODOS (Fase 4) ---
    };
  }

  getCredentialValidations() {
    return {
      // --- INICIO DE VALIDACIONES PARA CREDENCIALES (Fase 4) ---
      'gmailOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Gmail';
          if (!credential.clientSecret) return 'Client Secret requerido para Gmail';
          return null;
        }
      },

      'slackApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Slack';
          if (!credential.accessToken.startsWith('xoxb-')) return 'Access Token de Slack inválido';
          return null;
        }
      },

      'googleSheetsOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Google Sheets';
          if (!credential.clientSecret) return 'Client Secret requerido para Google Sheets';
          return null;
        }
      },

      'notionApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Notion';
          if (!credential.apiKey.startsWith('secret_')) return 'API Key de Notion inválida';
          return null;
        }
      },

      'airtableApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Airtable';
          return null;
        }
      },

      'trelloApi': {
        requiredFields: ['apiKey', 'apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Trello';
          if (!credential.apiToken) return 'API Token requerido para Trello';
          return null;
        }
      },

      'jiraSoftwareCloudApi': {
        requiredFields: ['email', 'apiToken'],
        validateCredential: (credential) => {
          if (!credential.email) return 'Email requerido para Jira';
          if (!credential.apiToken) return 'API Token requerido para Jira';
          return null;
        }
      },

      'githubApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para GitHub';
          if (!credential.accessToken.startsWith('ghp_') && !credential.accessToken.startsWith('github_pat_')) {
            return 'Access Token de GitHub inválido';
          }
          return null;
        }
      },

      'mySql': {
        requiredFields: ['host', 'database', 'user', 'password'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para MySQL';
          if (!credential.database) return 'Database requerido para MySQL';
          if (!credential.user) return 'User requerido para MySQL';
          return null;
        }
      },

      'postgres': {
        requiredFields: ['host', 'database', 'user', 'password'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para PostgreSQL';
          if (!credential.database) return 'Database requerido para PostgreSQL';
          if (!credential.user) return 'User requerido para PostgreSQL';
          return null;
        }
      },

      'mongoDb': {
        requiredFields: ['connectionString'],
        validateCredential: (credential) => {
          if (!credential.connectionString) return 'Connection String requerida para MongoDB';
          if (!credential.connectionString.startsWith('mongodb')) return 'Connection String de MongoDB inválida';
          return null;
        }
      },

      'redis': {
        requiredFields: ['host', 'port'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para Redis';
          if (!credential.port) return 'Port requerido para Redis';
          return null;
        }
      },

      'elasticsearchApi': {
        requiredFields: ['baseUrl'],
        validateCredential: (credential) => {
          if (!credential.baseUrl) return 'Base URL requerida para Elasticsearch';
          return null;
        }
      },

      'aws': {
        requiredFields: ['accessKeyId', 'secretAccessKey'],
        validateCredential: (credential) => {
          if (!credential.accessKeyId) return 'Access Key ID requerido para AWS';
          if (!credential.secretAccessKey) return 'Secret Access Key requerido para AWS';
          return null;
        }
      },

      'twilioApi': {
        requiredFields: ['accountSid', 'authToken'],
        validateCredential: (credential) => {
          if (!credential.accountSid) return 'Account SID requerido para Twilio';
          if (!credential.authToken) return 'Auth Token requerido para Twilio';
          return null;
        }
      },

      'sendGridApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para SendGrid';
          if (!credential.apiKey.startsWith('SG.')) return 'API Key de SendGrid inválida';
          return null;
        }
      },

      'postmarkApi': {
        requiredFields: ['serverToken'],
        validateCredential: (credential) => {
          if (!credential.serverToken) return 'Server Token requerido para Postmark';
          return null;
        }
      },

      'mailgunApi': {
        requiredFields: ['apiKey', 'domain'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Mailgun';
          if (!credential.domain) return 'Domain requerido para Mailgun';
          return null;
        }
      },

      'dropboxOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Dropbox';
          if (!credential.clientSecret) return 'Client Secret requerido para Dropbox';
          return null;
        }
      },

      'boxOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Box';
          if (!credential.clientSecret) return 'Client Secret requerido para Box';
          return null;
        }
      },

      'microsoftOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Microsoft';
          if (!credential.clientSecret) return 'Client Secret requerido para Microsoft';
          return null;
        }
      },

      'googleDriveOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Google Drive';
          if (!credential.clientSecret) return 'Client Secret requerido para Google Drive';
          return null;
        }
      },

      'googleCalendarOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Google Calendar';
          if (!credential.clientSecret) return 'Client Secret requerido para Google Calendar';
          return null;
        }
      },

      'googleDocsOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Google Docs';
          if (!credential.clientSecret) return 'Client Secret requerido para Google Docs';
          return null;
        }
      },

      'zohoOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Zoho';
          if (!credential.clientSecret) return 'Client Secret requerido para Zoho';
          return null;
        }
      },

      'salesforceOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Salesforce';
          if (!credential.clientSecret) return 'Client Secret requerido para Salesforce';
          return null;
        }
      },

      'hubspotOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para HubSpot';
          if (!credential.clientSecret) return 'Client Secret requerido para HubSpot';
          return null;
        }
      },

      'pipedriveApi': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Pipedrive';
          return null;
        }
      },

      'asanaOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Asana';
          if (!credential.clientSecret) return 'Client Secret requerido para Asana';
          return null;
        }
      },

      'todoist': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Todoist';
          return null;
        }
      },

      'clickupApi': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para ClickUp';
          return null;
        }
      },

      'mondayComApi': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Monday.com';
          return null;
        }
      },

      'gitlabApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para GitLab';
          return null;
        }
      },

      'bitbucketApi': {
        requiredFields: ['username', 'password'],
        validateCredential: (credential) => {
          if (!credential.username) return 'Username requerido para Bitbucket';
          if (!credential.password) return 'Password requerido para Bitbucket';
          return null;
        }
      },

      'mattermostApi': {
        requiredFields: ['accessToken', 'baseUrl'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Mattermost';
          if (!credential.baseUrl) return 'Base URL requerida para Mattermost';
          return null;
        }
      },

      'rocketchatApi': {
        requiredFields: ['userId', 'authToken', 'baseUrl'],
        validateCredential: (credential) => {
          if (!credential.userId) return 'User ID requerido para Rocket.Chat';
          if (!credential.authToken) return 'Auth Token requerido para Rocket.Chat';
          if (!credential.baseUrl) return 'Base URL requerida para Rocket.Chat';
          return null;
        }
      },

      'microsoftTeamsOAuth2': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Microsoft Teams';
          if (!credential.clientSecret) return 'Client Secret requerido para Microsoft Teams';
          return null;
        }
      },

      // --- CREDENCIALES FALTANTES CRÍTICAS (Fase 5) ---

      // Customer.io - Específica del proyecto
      'customerIoApi': {
        requiredFields: ['apiKey', 'siteId'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Customer.io';
          if (!credential.siteId) return 'Site ID requerido para Customer.io';
          if (!credential.apiKey.startsWith('pk_') && !credential.apiKey.startsWith('sk_')) {
            return 'API Key de Customer.io inválida (debe comenzar con pk_ o sk_)';
          }
          return null;
        }
      },

      // Microsoft Exchange - Específica del proyecto
      'microsoftExchangeOAuth2': {
        requiredFields: ['clientId', 'clientSecret', 'tenantId'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Microsoft Exchange';
          if (!credential.clientSecret) return 'Client Secret requerido para Microsoft Exchange';
          if (!credential.tenantId) return 'Tenant ID requerido para Microsoft Exchange';
          return null;
        }
      },

      // OpenAI - Servicio crítico de IA
      'openaiApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para OpenAI';
          if (!credential.apiKey.startsWith('sk-')) return 'API Key de OpenAI inválida (debe comenzar con sk-)';
          return null;
        }
      },

      // Stripe - Pagos
      'stripeApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Stripe';
          if (!credential.apiKey.startsWith('sk_') && !credential.apiKey.startsWith('pk_')) {
            return 'API Key de Stripe inválida (debe comenzar con sk_ o pk_)';
          }
          return null;
        }
      },

      // Shopify - E-commerce
      'shopifyApi': {
        requiredFields: ['apiKey', 'apiSecret', 'storeName'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Shopify';
          if (!credential.apiSecret) return 'API Secret requerido para Shopify';
          if (!credential.storeName) return 'Store Name requerido para Shopify';
          return null;
        }
      },

      // Mailchimp - Email Marketing
      'mailchimpApi': {
        requiredFields: ['apiKey', 'server'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Mailchimp';
          if (!credential.server) return 'Server requerido para Mailchimp';
          if (!credential.apiKey.match(/^[a-f0-9]{32}-us\d{1,2}$/)) {
            return 'API Key de Mailchimp inválida (formato esperado: xxx-usX)';
          }
          return null;
        }
      },

      // AWS S3 - Almacenamiento
      'awsS3': {
        requiredFields: ['accessKeyId', 'secretAccessKey', 'region'],
        validateCredential: (credential) => {
          if (!credential.accessKeyId) return 'Access Key ID requerido para AWS S3';
          if (!credential.secretAccessKey) return 'Secret Access Key requerido para AWS S3';
          if (!credential.region) return 'Region requerida para AWS S3';
          return null;
        }
      },

      // Zendesk - Customer Support
      'zendeskApi': {
        requiredFields: ['apiToken', 'email', 'subdomain'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Zendesk';
          if (!credential.email) return 'Email requerido para Zendesk';
          if (!credential.subdomain) return 'Subdomain requerido para Zendesk';
          return null;
        }
      },

      // Azure OpenAI
      'azureOpenAiApi': {
        requiredFields: ['apiKey', 'endpoint', 'deploymentName'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Azure OpenAI';
          if (!credential.endpoint) return 'Endpoint requerido para Azure OpenAI';
          if (!credential.deploymentName) return 'Deployment Name requerido para Azure OpenAI';
          return null;
        }
      },

      // Google Cloud Natural Language
      'googleCloudNaturalLanguageApi': {
        requiredFields: ['serviceAccountKey'],
        validateCredential: (credential) => {
          if (!credential.serviceAccountKey) return 'Service Account Key requerida para Google Cloud NL';
          try {
            const key = JSON.parse(credential.serviceAccountKey);
            if (!key.type || key.type !== 'service_account') {
              return 'Service Account Key inválida para Google Cloud';
            }
          } catch (e) {
            return 'Service Account Key debe ser un JSON válido';
          }
          return null;
        }
      },

      // Pinecone - Vector Database
      'pineconeApi': {
        requiredFields: ['apiKey', 'environment'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Pinecone';
          if (!credential.environment) return 'Environment requerido para Pinecone';
          return null;
        }
      },

      // Weaviate - Vector Database
      'weaviateApi': {
        requiredFields: ['apiKey', 'url'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Weaviate';
          if (!credential.url) return 'URL requerida para Weaviate';
          return null;
        }
      },

      // Hugging Face
      'huggingFaceApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Hugging Face';
          if (!credential.apiKey.startsWith('hf_')) return 'API Key de Hugging Face inválida';
          return null;
        }
      },

      // LangChain
      'langchainApi': {
        requiredFields: ['openaiApiKey'],
        validateCredential: (credential) => {
          if (!credential.openaiApiKey) return 'OpenAI API Key requerida para LangChain';
          if (!credential.openaiApiKey.startsWith('sk-')) {
            return 'OpenAI API Key inválida para LangChain';
          }
          return null;
        }
      },

      // Replicate
      'replicateApi': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Replicate';
          if (!credential.apiToken.startsWith('r8_')) return 'API Token de Replicate inválido';
          return null;
        }
      },

      // Stability AI
      'stabilityAiApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Stability AI';
          if (!credential.apiKey.startsWith('sk-')) return 'API Key de Stability AI inválida';
          return null;
        }
      },

      // AWS CloudWatch
      'awsCloudWatchApi': {
        requiredFields: ['accessKeyId', 'secretAccessKey', 'region'],
        validateCredential: (credential) => {
          if (!credential.accessKeyId) return 'Access Key ID requerido para AWS CloudWatch';
          if (!credential.secretAccessKey) return 'Secret Access Key requerido para AWS CloudWatch';
          if (!credential.region) return 'Region requerida para AWS CloudWatch';
          return null;
        }
      },

      // HashiCorp Vault
      'hashicorpVaultApi': {
        requiredFields: ['serverUrl', 'token'],
        validateCredential: (credential) => {
          if (!credential.serverUrl) return 'Server URL requerida para HashiCorp Vault';
          if (!credential.token) return 'Token requerido para HashiCorp Vault';
          return null;
        }
      },

      // Kubernetes
      'kubernetesApi': {
        requiredFields: ['serverUrl', 'token', 'caCert'],
        validateCredential: (credential) => {
          if (!credential.serverUrl) return 'Server URL requerida para Kubernetes';
          if (!credential.token) return 'Token requerido para Kubernetes';
          if (!credential.caCert) return 'CA Certificate requerido para Kubernetes';
          return null;
        }
      },

      // Terraform Cloud
      'terraformCloudApi': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Terraform Cloud';
          return null;
        }
      },

      // Docker Hub
      'dockerHubApi': {
        requiredFields: ['username', 'password'],
        validateCredential: (credential) => {
          if (!credential.username) return 'Username requerido para Docker Hub';
          if (!credential.password) return 'Password requerido para Docker Hub';
          return null;
        }
      },

      // Vercel
      'vercelApi': {
        requiredFields: ['token'],
        validateCredential: (credential) => {
          if (!credential.token) return 'Token requerido para Vercel';
          if (!credential.token.startsWith('vercel_')) return 'Token de Vercel inválido';
          return null;
        }
      },

      // Freshdesk
      'freshdeskApi': {
        requiredFields: ['apiKey', 'domain'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Freshdesk';
          if (!credential.domain) return 'Domain requerido para Freshdesk';
          return null;
        }
      },

      // Constant Contact
      'constantContactApi': {
        requiredFields: ['apiKey', 'accessToken'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Constant Contact';
          if (!credential.accessToken) return 'Access Token requerido para Constant Contact';
          return null;
        }
      },

      // ConvertKit
      'convertkitApi': {
        requiredFields: ['apiKey', 'apiSecret'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para ConvertKit';
          if (!credential.apiSecret) return 'API Secret requerido para ConvertKit';
          return null;
        }
      },

      // Stripe Checkout
      'stripeCheckoutApi': {
        requiredFields: ['publishableKey', 'secretKey'],
        validateCredential: (credential) => {
          if (!credential.publishableKey) return 'Publishable Key requerida para Stripe Checkout';
          if (!credential.secretKey) return 'Secret Key requerida para Stripe Checkout';
          if (!credential.publishableKey.startsWith('pk_')) return 'Publishable Key inválida';
          if (!credential.secretKey.startsWith('sk_')) return 'Secret Key inválida';
          return null;
        }
      },

      // GoCardless
      'gocardlessApi': {
        requiredFields: ['accessToken', 'environment'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para GoCardless';
          if (!credential.environment) return 'Environment requerido para GoCardless';
          return null;
        }
      },

      // Wise (TransferWise)
      'wiseApi': {
        requiredFields: ['apiToken'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Wise';
          return null;
        }
      },

      // Coinbase
      'coinbaseApi': {
        requiredFields: ['apiKey', 'apiSecret'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Coinbase';
          if (!credential.apiSecret) return 'API Secret requerido para Coinbase';
          return null;
        }
      },

      // BigCommerce
      'bigcommerceApi': {
        requiredFields: ['storeHash', 'accessToken'],
        validateCredential: (credential) => {
          if (!credential.storeHash) return 'Store Hash requerido para BigCommerce';
          if (!credential.accessToken) return 'Access Token requerido para BigCommerce';
          return null;
        }
      },

      // Lemon Squeezy
      'lemonSqueezyApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Lemon Squeezy';
          return null;
        }
      },

      // Paddle
      'paddleApi': {
        requiredFields: ['apiKey', 'environment'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Paddle';
          if (!credential.environment) return 'Environment requerido para Paddle';
          return null;
        }
      },

      // Snowflake
      'snowflakeApi': {
        requiredFields: ['account', 'username', 'password', 'warehouse', 'database'],
        validateCredential: (credential) => {
          if (!credential.account) return 'Account requerido para Snowflake';
          if (!credential.username) return 'Username requerido para Snowflake';
          if (!credential.password) return 'Password requerido para Snowflake';
          if (!credential.warehouse) return 'Warehouse requerido para Snowflake';
          if (!credential.database) return 'Database requerido para Snowflake';
          return null;
        }
      },

      // BigQuery
      'bigqueryApi': {
        requiredFields: ['serviceAccountKey', 'projectId'],
        validateCredential: (credential) => {
          if (!credential.serviceAccountKey) return 'Service Account Key requerida para BigQuery';
          if (!credential.projectId) return 'Project ID requerido para BigQuery';
          try {
            const key = JSON.parse(credential.serviceAccountKey);
            if (!key.type || key.type !== 'service_account') {
              return 'Service Account Key inválida para BigQuery';
            }
          } catch (e) {
            return 'Service Account Key debe ser un JSON válido';
          }
          return null;
        }
      },

      // Redshift
      'redshiftApi': {
        requiredFields: ['host', 'port', 'database', 'username', 'password'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para Redshift';
          if (!credential.port) return 'Port requerido para Redshift';
          if (!credential.database) return 'Database requerido para Redshift';
          if (!credential.username) return 'Username requerido para Redshift';
          if (!credential.password) return 'Password requerido para Redshift';
          return null;
        }
      },

      // Zoom
      'zoomApi': {
        requiredFields: ['apiKey', 'apiSecret'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Zoom';
          if (!credential.apiSecret) return 'API Secret requerido para Zoom';
          return null;
        }
      },

      // Calendly
      'calendlyApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Calendly';
          return null;
        }
      },

      // Miro
      'miroApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Miro';
          return null;
        }
      },

      // Figma
      'figmaApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Figma';
          return null;
        }
      },

      // Google Maps
      'googleMapsApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Google Maps';
          return null;
        }
      },

      // Firebase Admin
      'firebaseAdminApi': {
        requiredFields: ['serviceAccountKey'],
        validateCredential: (credential) => {
          if (!credential.serviceAccountKey) return 'Service Account Key requerida para Firebase Admin';
          try {
            const key = JSON.parse(credential.serviceAccountKey);
            if (!key.type || key.type !== 'service_account') {
              return 'Service Account Key inválida para Firebase';
            }
          } catch (e) {
            return 'Service Account Key debe ser un JSON válido';
          }
          return null;
        }
      },

      // Supabase Admin
      'supabaseAdminApi': {
        requiredFields: ['serviceRoleKey', 'projectUrl'],
        validateCredential: (credential) => {
          if (!credential.serviceRoleKey) return 'Service Role Key requerida para Supabase Admin';
          if (!credential.projectUrl) return 'Project URL requerida para Supabase Admin';
          return null;
        }
      },

      // Auth0
      'auth0Api': {
        requiredFields: ['domain', 'clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.domain) return 'Domain requerido para Auth0';
          if (!credential.clientId) return 'Client ID requerido para Auth0';
          if (!credential.clientSecret) return 'Client Secret requerido para Auth0';
          return null;
        }
      },

      // Okta
      'oktaApi': {
        requiredFields: ['domain', 'apiToken'],
        validateCredential: (credential) => {
          if (!credential.domain) return 'Domain requerido para Okta';
          if (!credential.apiToken) return 'API Token requerido para Okta';
          return null;
        }
      },

      // Intercom
      'intercomApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Intercom';
          return null;
        }
      },

      // Freshchat
      'freshchatApi': {
        requiredFields: ['apiToken', 'appId'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Freshchat';
          if (!credential.appId) return 'App ID requerido para Freshchat';
          return null;
        }
      },

      // Zapier
      'zapierApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Zapier';
          return null;
        }
      },

      // Make.com
      'makecomApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Make.com';
          return null;
        }
      },

      // Linear
      'linearApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Linear';
          if (!credential.apiKey.startsWith('lin_api_')) return 'API Key de Linear inválida';
          return null;
        }
      },

      // Jira Service Management
      'jiraServiceManagementApi': {
        requiredFields: ['email', 'apiToken', 'domain'],
        validateCredential: (credential) => {
          if (!credential.email) return 'Email requerido para Jira Service Management';
          if (!credential.apiToken) return 'API Token requerido para Jira Service Management';
          if (!credential.domain) return 'Domain requerido para Jira Service Management';
          return null;
        }
      },

      // Webflow
      'webflowApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Webflow';
          return null;
        }
      },

      // Contentful
      'contentfulApi': {
        requiredFields: ['accessToken', 'spaceId'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Contentful';
          if (!credential.spaceId) return 'Space ID requerido para Contentful';
          return null;
        }
      },

      // --- CREDENCIALES ADICIONALES PARA COMPLETAR EL 100% (Fase 6) ---

      // AI/ML Services adicionales
      'tensorflowApi': {
        requiredFields: ['modelPath', 'configPath'],
        validateCredential: (credential) => {
          if (!credential.modelPath) return 'Model Path requerido para TensorFlow';
          if (!credential.configPath) return 'Config Path requerido para TensorFlow';
          return null;
        }
      },

      'pytorchApi': {
        requiredFields: ['modelPath', 'checkpointPath'],
        validateCredential: (credential) => {
          if (!credential.modelPath) return 'Model Path requerido para PyTorch';
          if (!credential.checkpointPath) return 'Checkpoint Path requerido para PyTorch';
          return null;
        }
      },

      'milvusApi': {
        requiredFields: ['host', 'port', 'collectionName'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para Milvus';
          if (!credential.port) return 'Port requerido para Milvus';
          if (!credential.collectionName) return 'Collection Name requerido para Milvus';
          return null;
        }
      },

      'mlflowApi': {
        requiredFields: ['trackingUri', 'experimentId'],
        validateCredential: (credential) => {
          if (!credential.trackingUri) return 'Tracking URI requerido para MLflow';
          if (!credential.experimentId) return 'Experiment ID requerido para MLflow';
          return null;
        }
      },

      'kubeflowApi': {
        requiredFields: ['endpoint', 'namespace'],
        validateCredential: (credential) => {
          if (!credential.endpoint) return 'Endpoint requerido para Kubeflow';
          if (!credential.namespace) return 'Namespace requerido para Kubeflow';
          return null;
        }
      },

      // Cloud & DevOps adicionales
      'awsSecretsManagerApi': {
        requiredFields: ['accessKeyId', 'secretAccessKey', 'region'],
        validateCredential: (credential) => {
          if (!credential.accessKeyId) return 'Access Key ID requerido para AWS Secrets Manager';
          if (!credential.secretAccessKey) return 'Secret Access Key requerido para AWS Secrets Manager';
          if (!credential.region) return 'Region requerida para AWS Secrets Manager';
          return null;
        }
      },

      'awsEcsApi': {
        requiredFields: ['accessKeyId', 'secretAccessKey', 'region', 'clusterName'],
        validateCredential: (credential) => {
          if (!credential.accessKeyId) return 'Access Key ID requerido para AWS ECS';
          if (!credential.secretAccessKey) return 'Secret Access Key requerido para AWS ECS';
          if (!credential.region) return 'Region requerida para AWS ECS';
          if (!credential.clusterName) return 'Cluster Name requerido para AWS ECS';
          return null;
        }
      },

      'azureKeyVaultApi': {
        requiredFields: ['vaultUrl', 'clientId', 'clientSecret', 'tenantId'],
        validateCredential: (credential) => {
          if (!credential.vaultUrl) return 'Vault URL requerido para Azure Key Vault';
          if (!credential.clientId) return 'Client ID requerido para Azure Key Vault';
          if (!credential.clientSecret) return 'Client Secret requerido para Azure Key Vault';
          if (!credential.tenantId) return 'Tenant ID requerido para Azure Key Vault';
          return null;
        }
      },

      'googleSecretManagerApi': {
        requiredFields: ['serviceAccountKey', 'projectId'],
        validateCredential: (credential) => {
          if (!credential.serviceAccountKey) return 'Service Account Key requerida para Google Secret Manager';
          if (!credential.projectId) return 'Project ID requerido para Google Secret Manager';
          try {
            const key = JSON.parse(credential.serviceAccountKey);
            if (!key.type || key.type !== 'service_account') {
              return 'Service Account Key inválida para Google Secret Manager';
            }
          } catch (e) {
            return 'Service Account Key debe ser un JSON válido';
          }
          return null;
        }
      },

      'ansibleTowerApi': {
        requiredFields: ['host', 'username', 'password'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para Ansible Tower';
          if (!credential.username) return 'Username requerido para Ansible Tower';
          if (!credential.password) return 'Password requerido para Ansible Tower';
          return null;
        }
      },

      'azureContainerRegistryApi': {
        requiredFields: ['registryName', 'username', 'password'],
        validateCredential: (credential) => {
          if (!credential.registryName) return 'Registry Name requerido para Azure Container Registry';
          if (!credential.username) return 'Username requerido para Azure Container Registry';
          if (!credential.password) return 'Password requerido para Azure Container Registry';
          return null;
        }
      },

      'digitalOceanKubernetesApi': {
        requiredFields: ['clusterId', 'accessToken'],
        validateCredential: (credential) => {
          if (!credential.clusterId) return 'Cluster ID requerido para DigitalOcean Kubernetes';
          if (!credential.accessToken) return 'Access Token requerido para DigitalOcean Kubernetes';
          return null;
        }
      },

      // CRM & Sales adicionales
      'activecampaignApi': {
        requiredFields: ['apiKey', 'accountName'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para ActiveCampaign';
          if (!credential.accountName) return 'Account Name requerido para ActiveCampaign';
          return null;
        }
      },

      'sendpulseApi': {
        requiredFields: ['clientId', 'clientSecret'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para SendPulse';
          if (!credential.clientSecret) return 'Client Secret requerido para SendPulse';
          return null;
        }
      },

      'gainsightApi': {
        requiredFields: ['apiKey', 'domain'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Gainsight';
          if (!credential.domain) return 'Domain requerido para Gainsight';
          return null;
        }
      },

      'driftApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Drift';
          return null;
        }
      },

      'apolloIoApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Apollo.io';
          return null;
        }
      },

      // E-commerce & Payments adicionales
      'etsyApi': {
        requiredFields: ['apiKey', 'sharedSecret'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Etsy';
          if (!credential.sharedSecret) return 'Shared Secret requerido para Etsy';
          return null;
        }
      },

      'recartApi': {
        requiredFields: ['apiKey', 'storeId'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para Recart';
          if (!credential.storeId) return 'Store ID requerido para Recart';
          return null;
        }
      },

      // Databases & Data Warehouse adicionales
      'dynamodbApi': {
        requiredFields: ['accessKeyId', 'secretAccessKey', 'region', 'tableName'],
        validateCredential: (credential) => {
          if (!credential.accessKeyId) return 'Access Key ID requerido para DynamoDB';
          if (!credential.secretAccessKey) return 'Secret Access Key requerido para DynamoDB';
          if (!credential.region) return 'Region requerida para DynamoDB';
          if (!credential.tableName) return 'Table Name requerido para DynamoDB';
          return null;
        }
      },

      'vectorDbApi': {
        requiredFields: ['endpoint', 'apiKey', 'indexName'],
        validateCredential: (credential) => {
          if (!credential.endpoint) return 'Endpoint requerido para Vector DB';
          if (!credential.apiKey) return 'API Key requerida para Vector DB';
          if (!credential.indexName) return 'Index Name requerido para Vector DB';
          return null;
        }
      },

      // Communication & Productivity adicionales
      'discordApi': {
        requiredFields: ['botToken'],
        validateCredential: (credential) => {
          if (!credential.botToken) return 'Bot Token requerido para Discord';
          if (!credential.botToken.startsWith('Bot ')) return 'Bot Token de Discord inválido';
          return null;
        }
      },

      'telegramApi': {
        requiredFields: ['botToken'],
        validateCredential: (credential) => {
          if (!credential.botToken) return 'Bot Token requerido para Telegram';
          if (!credential.botToken.match(/^\d+:[\w-]{35}$/)) return 'Bot Token de Telegram inválido';
          return null;
        }
      },

      'outlookCalendarApi': {
        requiredFields: ['clientId', 'clientSecret', 'tenantId'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Outlook Calendar';
          if (!credential.clientSecret) return 'Client Secret requerido para Outlook Calendar';
          if (!credential.tenantId) return 'Tenant ID requerido para Outlook Calendar';
          return null;
        }
      },

      'googleVoiceApi': {
        requiredFields: ['accessToken'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Google Voice';
          return null;
        }
      },

      // IoT & Hardware
      'mqttApi': {
        requiredFields: ['brokerUrl', 'clientId', 'username', 'password'],
        validateCredential: (credential) => {
          if (!credential.brokerUrl) return 'Broker URL requerido para MQTT';
          if (!credential.clientId) return 'Client ID requerido para MQTT';
          if (!credential.username) return 'Username requerido para MQTT';
          if (!credential.password) return 'Password requerido para MQTT';
          return null;
        }
      },

      'modbusApi': {
        requiredFields: ['host', 'port', 'unitId'],
        validateCredential: (credential) => {
          if (!credential.host) return 'Host requerido para Modbus';
          if (!credential.port) return 'Port requerido para Modbus';
          if (!credential.unitId) return 'Unit ID requerido para Modbus';
          return null;
        }
      },

      'bacnetApi': {
        requiredFields: ['deviceId', 'networkNumber'],
        validateCredential: (credential) => {
          if (!credential.deviceId) return 'Device ID requerido para BACnet';
          if (!credential.networkNumber) return 'Network Number requerido para BACnet';
          return null;
        }
      },

      'lorawanApi': {
        requiredFields: ['applicationId', 'apiKey'],
        validateCredential: (credential) => {
          if (!credential.applicationId) return 'Application ID requerido para LoRaWAN';
          if (!credential.apiKey) return 'API Key requerida para LoRaWAN';
          return null;
        }
      },

      'edgeDeviceApi': {
        requiredFields: ['deviceId', 'endpoint', 'apiKey'],
        validateCredential: (credential) => {
          if (!credential.deviceId) return 'Device ID requerido para Edge Device';
          if (!credential.endpoint) return 'Endpoint requerido para Edge Device';
          if (!credential.apiKey) return 'API Key requerida para Edge Device';
          return null;
        }
      },

      // Other Web Services & APIs
      'openStreetMapApi': {
        requiredFields: ['apiKey'],
        validateCredential: (credential) => {
          if (!credential.apiKey) return 'API Key requerida para OpenStreetMap';
          return null;
        }
      },

      'shopifyAdminApi': {
        requiredFields: ['storeName', 'accessToken', 'apiVersion'],
        validateCredential: (credential) => {
          if (!credential.storeName) return 'Store Name requerido para Shopify Admin';
          if (!credential.accessToken) return 'Access Token requerido para Shopify Admin';
          if (!credential.apiVersion) return 'API Version requerida para Shopify Admin';
          return null;
        }
      },

      'stripeConnectApi': {
        requiredFields: ['clientId', 'clientSecret', 'publishableKey'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Stripe Connect';
          if (!credential.clientSecret) return 'Client Secret requerido para Stripe Connect';
          if (!credential.publishableKey) return 'Publishable Key requerida para Stripe Connect';
          if (!credential.publishableKey.startsWith('pk_')) return 'Publishable Key inválida';
          if (!credential.clientSecret.startsWith('sk_')) return 'Client Secret inválida';
          return null;
        }
      },

      'zohoCrmApi': {
        requiredFields: ['clientId', 'clientSecret', 'domain'],
        validateCredential: (credential) => {
          if (!credential.clientId) return 'Client ID requerido para Zoho CRM';
          if (!credential.clientSecret) return 'Client Secret requerido para Zoho CRM';
          if (!credential.domain) return 'Domain requerido para Zoho CRM';
          return null;
        }
      },

      'pcloudApi': {
        requiredFields: ['username', 'password'],
        validateCredential: (credential) => {
          if (!credential.username) return 'Username requerido para pCloud';
          if (!credential.password) return 'Password requerido para pCloud';
          return null;
        }
      },

      'megaApi': {
        requiredFields: ['email', 'password'],
        validateCredential: (credential) => {
          if (!credential.email) return 'Email requerido para MEGA';
          if (!credential.password) return 'Password requerido para MEGA';
          return null;
        }
      },

      // CMS & E-commerce Platforms
      'woocommerceApi': {
        requiredFields: ['consumerKey', 'consumerSecret', 'storeUrl'],
        validateCredential: (credential) => {
          if (!credential.consumerKey) return 'Consumer Key requerido para WooCommerce';
          if (!credential.consumerSecret) return 'Consumer Secret requerido para WooCommerce';
          if (!credential.storeUrl) return 'Store URL requerido para WooCommerce';
          return null;
        }
      },

      'magentoApi': {
        requiredFields: ['accessToken', 'storeUrl'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Magento';
          if (!credential.storeUrl) return 'Store URL requerido para Magento';
          return null;
        }
      },

      'wordpressApi': {
        requiredFields: ['username', 'password', 'siteUrl'],
        validateCredential: (credential) => {
          if (!credential.username) return 'Username requerido para WordPress';
          if (!credential.password) return 'Password requerido para WordPress';
          if (!credential.siteUrl) return 'Site URL requerido para WordPress';
          return null;
        }
      },

      'strapiApi': {
        requiredFields: ['apiToken', 'baseUrl'],
        validateCredential: (credential) => {
          if (!credential.apiToken) return 'API Token requerido para Strapi';
          if (!credential.baseUrl) return 'Base URL requerido para Strapi';
          return null;
        }
      },

      'sanityApi': {
        requiredFields: ['projectId', 'dataset', 'apiToken'],
        validateCredential: (credential) => {
          if (!credential.projectId) return 'Project ID requerido para Sanity';
          if (!credential.dataset) return 'Dataset requerido para Sanity';
          if (!credential.apiToken) return 'API Token requerido para Sanity';
          return null;
        }
      },

      'prismicApi': {
        requiredFields: ['repositoryName', 'accessToken'],
        validateCredential: (credential) => {
          if (!credential.repositoryName) return 'Repository Name requerido para Prismic';
          if (!credential.accessToken) return 'Access Token requerido para Prismic';
          return null;
        }
      },

      'storyblokApi': {
        requiredFields: ['accessToken', 'spaceId'],
        validateCredential: (credential) => {
          if (!credential.accessToken) return 'Access Token requerido para Storyblok';
          if (!credential.spaceId) return 'Space ID requerido para Storyblok';
          return null;
        }
      },

      'kontentApi': {
        requiredFields: ['projectId', 'apiKey'],
        validateCredential: (credential) => {
          if (!credential.projectId) return 'Project ID requerido para Kontent';
          if (!credential.apiKey) return 'API Key requerida para Kontent';
          return null;
        }
      }
    };
  }

  /**
   * ✅ Validación completa de workflow
   */
  validate(data) {
    if (this.options.detailedLogging) {
      console.log('🔍 Iniciando validación completa del workflow...');
    }

    const errors = [];
    const warnings = [];

    // Validación de esquema JSON
    const schemaResult = this.validateWorkflowStructure(data);
    if (!schemaResult.isValid) {
      errors.push(...schemaResult.errors);
    }

    // Validación de nodos
    if (data.nodes) {
      for (const node of data.nodes) {
        const nodeResult = this.validateNode(node);
        if (!nodeResult.isValid) {
          errors.push(...nodeResult.errors);
        }
        if (nodeResult.warnings) {
          warnings.push(...nodeResult.warnings);
        }
      }
    }

    // Validación de conexiones
    if (data.nodes && data.connections) {
      const connectionResult = this.validateConnections(data.connections, data.nodes);
      if (!connectionResult.isValid) {
        errors.push(...connectionResult.errors);
      }
      if (connectionResult.warnings) {
        warnings.push(...connectionResult.warnings);
      }
    }

    // Validación de credenciales
    if (data.nodes) {
      for (const node of data.nodes) {
        const credentialResult = this.validateCredentials(node);
        if (!credentialResult.isValid) {
          errors.push(...credentialResult.errors);
        }
      }
    }

    const isValid = errors.length === 0;
    const result = {
      isValid,
      errors,
      warnings,
      summary: {
        totalErrors: errors.length,
        totalWarnings: warnings.length,
        nodesValidated: data.nodes ? data.nodes.length : 0,
        connectionsValidated: data.connections ? Object.keys(data.connections).length : 0
      }
    };

    if (this.options.detailedLogging) {
      console.log('✅ Validación completada:', result.summary);
    }

    return result;
  }

  /**
   * 📋 Validación de estructura del workflow
   */
  validateWorkflowStructure(workflow) {
    const errors = [];

    // Validación con JSON Schema
    const isValidSchema = this.validateWorkflow(workflow);
    if (!isValidSchema) {
      for (const error of this.validateWorkflow.errors) {
        errors.push({
          type: 'schema',
          message: `${error.instancePath}: ${error.message}`,
          schemaError: error
        });
      }
    }

    // Validaciones adicionales
    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push({
        type: 'structure',
        message: 'El nombre del workflow es requerido'
      });
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
      errors.push({
        type: 'structure',
        message: 'El workflow debe tener al menos un nodo'
      });
    }

    if (!workflow.connections || typeof workflow.connections !== 'object') {
      errors.push({
        type: 'structure',
        message: 'Las conexiones del workflow son requeridas'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 🎯 Validación individual de nodo
   */
  validateNode(node) {
    const errors = [];
    const warnings = [];

    // Validación básica de estructura
    if (!node.id) {
      errors.push({
        type: 'node',
        nodeId: node.id || 'unknown',
        message: 'ID del nodo es requerido'
      });
    }

    if (!node.name || node.name.trim().length === 0) {
      errors.push({
        type: 'node',
        nodeId: node.id,
        message: 'Nombre del nodo es requerido'
      });
    }

    if (!node.type) {
      errors.push({
        type: 'node',
        nodeId: node.id,
        message: 'Tipo del nodo es requerido'
      });
    }

    if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
      errors.push({
        type: 'node',
        nodeId: node.id,
        message: 'Posición del nodo debe ser un array de 2 números'
      });
    }

    // Validación de tipo de nodo válido
    if (node.type) {
      const isValidType = this.isValidNodeType(node.type);
      if (!isValidType) {
        warnings.push({
          type: 'node',
          nodeId: node.id,
          message: `Tipo de nodo '${node.type}' no está en el catálogo oficial`
        });
      }
    }

    // Validaciones específicas por tipo de nodo
    if (node.type && this.nodeValidations[node.type]) {
      const nodeValidation = this.nodeValidations[node.type];
      const paramValidation = this.validateNodeParameters(node, nodeValidation);

      if (!paramValidation.isValid) {
        errors.push(...paramValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 🔗 Validación de conexiones
   */
  validateConnections(connections, nodes) {
    const errors = [];
    const warnings = [];
    const nodeIds = new Set(nodes.map(node => node.id));

    // Verificar que todas las conexiones referencien nodos existentes
    for (const [sourceNodeId, sourceConnections] of Object.entries(connections)) {
      if (!nodeIds.has(sourceNodeId)) {
        errors.push({
          type: 'connection',
          message: `Nodo fuente '${sourceNodeId}' no existe`
        });
        continue;
      }

      for (const [outputIndex, outputConnections] of Object.entries(sourceConnections)) {
        for (const connection of outputConnections) {
          const targetNodeId = connection.node;

          if (!nodeIds.has(targetNodeId)) {
            errors.push({
              type: 'connection',
              sourceNodeId,
              targetNodeId,
              message: `Nodo destino '${targetNodeId}' no existe`
            });
          }

          if (typeof connection.index !== 'number' || connection.index < 0) {
            errors.push({
              type: 'connection',
              sourceNodeId,
              targetNodeId,
              message: `Índice de conexión inválido: ${connection.index}`
            });
          }

          if (!connection.type || typeof connection.type !== 'string') {
            errors.push({
              type: 'connection',
              sourceNodeId,
              targetNodeId,
              message: 'Tipo de conexión es requerido'
            });
          }
        }
      }
    }

    // Verificar nodos sin conexiones (excepto triggers)
    const connectedNodes = new Set();
    for (const [sourceNodeId, sourceConnections] of Object.entries(connections)) {
      connectedNodes.add(sourceNodeId);
      for (const [outputIndex, outputConnections] of Object.entries(sourceConnections)) {
        for (const connection of outputConnections) {
          connectedNodes.add(connection.node);
        }
      }
    }

    for (const node of nodes) {
      if (!connectedNodes.has(node.id)) {
        const isTrigger = this.isTriggerNode(node.type);
        if (!isTrigger) {
          warnings.push({
            type: 'connection',
            nodeId: node.id,
            message: `Nodo '${node.name}' no está conectado`
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 🔐 Validación de credenciales
   */
  validateCredentials(node) {
    const errors = [];

    if (!node.credentials) {
      return { isValid: true, errors: [] };
    }

    for (const [credentialType, credential] of Object.entries(node.credentials)) {
      const validation = this.credentialValidations[credentialType];

      if (!validation) {
        errors.push({
          type: 'credential',
          nodeId: node.id,
          credentialType,
          message: `Tipo de credencial '${credentialType}' no reconocido`
        });
        continue;
      }

      // Validar campos requeridos
      for (const field of validation.requiredFields) {
        if (!credential[field]) {
          errors.push({
            type: 'credential',
            nodeId: node.id,
            credentialType,
            field,
            message: `Campo '${field}' requerido para credencial '${credentialType}'`
          });
        }
      }

      // Validar credencial específica
      if (validation.validateCredential) {
        const credentialError = validation.validateCredential(credential);
        if (credentialError) {
          errors.push({
            type: 'credential',
            nodeId: node.id,
            credentialType,
            message: credentialError
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 🎯 Validación de parámetros de nodo
   */
  validateNodeParameters(node, validation) {
    const errors = [];

    // Verificar parámetros requeridos
    for (const param of validation.requiredParams) {
      if (!node.parameters || !node.parameters[param]) {
        errors.push({
          type: 'parameter',
          nodeId: node.id,
          parameter: param,
          message: `Parámetro '${param}' requerido para ${node.type}`
        });
      }
    }

    // Validación específica de parámetros
    if (validation.validateParams && node.parameters) {
      const paramError = validation.validateParams(node.parameters);
      if (paramError) {
        errors.push({
          type: 'parameter',
          nodeId: node.id,
          message: paramError
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 🔍 Verificar si un tipo de nodo es válido
   */
  isValidNodeType(nodeType) {
    const allTypes = [
      ...this.validNodeTypes.triggers,
      ...this.validNodeTypes.actions,
      ...this.validNodeTypes.core
    ];

    return allTypes.includes(nodeType);
  }

  /**
   * 🚀 Verificar si un nodo es un trigger
   */
  isTriggerNode(nodeType) {
    return this.validNodeTypes.triggers.includes(nodeType);
  }

  /**
   * 📊 Obtener reporte detallado de validación
   */
  getDetailedValidationReport(workflow) {
    const validation = this.validate(workflow);

    return {
      ...validation,
      timestamp: new Date().toISOString(),
      validatorVersion: '1.0.0',
      workflowInfo: {
        name: workflow.name,
        nodeCount: workflow.nodes ? workflow.nodes.length : 0,
        connectionCount: workflow.connections ? Object.keys(workflow.connections).length : 0
      },
      recommendations: this.generateRecommendations(validation)
    };
  }

  /**
   * 💡 Generar recomendaciones basadas en la validación
   */
  generateRecommendations(validation) {
    const recommendations = [];

    if (validation.errors.some(e => e.type === 'connection')) {
      recommendations.push('Revisar las conexiones entre nodos para asegurar el flujo correcto');
    }

    if (validation.errors.some(e => e.type === 'credential')) {
      recommendations.push('Configurar las credenciales requeridas para los nodos que las necesitan');
    }

    if (validation.warnings.some(w => w.message.includes('no está conectado'))) {
      recommendations.push('Conectar todos los nodos no-trigger para asegurar que se ejecuten');
    }

    if (validation.errors.some(e => e.type === 'parameter')) {
      recommendations.push('Completar todos los parámetros requeridos en los nodos');
    }

    return recommendations;
  }

  /**
   * 🔧 Agregar validador personalizado
   */
  addCustomValidator(name, validatorFunction) {
    this.customValidators = this.customValidators || {};
    this.customValidators[name] = validatorFunction;

    if (this.options.detailedLogging) {
      console.log(`✅ Validador personalizado '${name}' agregado`);
    }
  }

  /**
   * 🎯 Validación completa de workflow (método principal)
   */
  validateCompleteWorkflow(workflow) {
    return this.validate(workflow);
  }
}

// Exportar la clase por defecto
export default WorkflowValidator;

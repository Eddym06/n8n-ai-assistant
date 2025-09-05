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
        'n8n-nodes-base.stringifyObjectMultipleValues',
        'n8n-nodes-base.getMultipleValues',
        'n8n-nodes-base.setMultipleValues',
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
        'n8n-nodes-base.mysql',
        'n8n-nodes-base.postgres',
        'n8n-nodes-base.mongoDb',
        'n8n-nodes-base.redis',
        'n8n-nodes-base.elasticsearch',
        'n8n-nodes-base.awsS3',
        'n8n-nodes-base.twilio',
        'n8n-nodes-base.sendGrid',
        'n8n-nodes-base.postmark',
        'n8n-nodes-base.mailgun',
        'n8n-nodes-base.dropbox',
        'n8n-nodes-base.box',
        'n8n-nodes-base.onedrive',
        'n8n-nodes-base.googleDrive',
        'n8n-nodes-base.googleCalendar',
        'n8n-nodes-base.googleDocs',
        'n8n-nodes-base.zohoCrm',
        'n8n-nodes-base.salesforce',
        'n8n-nodes-base.hubspot',
        'n8n-nodes-base.pipedrive',
        'n8n-nodes-base.asana',
        'n8n-nodes-base.todoist',
        'n8n-nodes-base.clickup',
        'n8n-nodes-base.mondayCom',
        'n8n-nodes-base.gitlab',
        'n8n-nodes-base.bitbucket',
        'n8n-nodes-base.mattermost',
        'n8n-nodes-base.rocketchat',
        'n8n-nodes-base.microsoftTeams',
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
        'n8n-nodes-base.swagger'
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
        'n8n-nodes-base.stringifyObjectMultipleValues'
      ]
    };
  }

  /**
   * 🎯 Validaciones específicas por tipo de nodo
   */
  getNodeValidations() {
    return {
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
      }
    };
  }

  /**
   * 🔐 Validaciones de credenciales
   */
  getCredentialValidations() {
    return {
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

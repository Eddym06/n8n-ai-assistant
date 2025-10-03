// === CORRECTOR INTELIGENTE DE NOMBRES v4.0 ===
// Sistema ultra-robusto de corrección de nombres de nodos y operaciones n8n

class IntelligentNameCorrector {
    constructor() {
        // Mapeo de nombres incorrectos a correctos con palabras clave - VERSIÓN ULTRA-EXPANDIDA
        this.nodeTypeCorrections = {
            // HubSpot variations
            'hubspot': 'n8n-nodes-base.hubspot',
            'hubspotr': 'n8n-nodes-base.hubspot', 
            'hub-spot': 'n8n-nodes-base.hubspot',
            'hubspott': 'n8n-nodes-base.hubspot',
            'hubsot': 'n8n-nodes-base.hubspot',
            'hubpsot': 'n8n-nodes-base.hubspot',
            'hubspotcrm': 'n8n-nodes-base.hubspot',
            'n8n-nodes-hubspot.hubspot': 'n8n-nodes-base.hubspot',
            'n8n-nodes-base.hubSpot': 'n8n-nodes-base.hubspot',
            'hubspot-crm': 'n8n-nodes-base.hubspot',
            
            // Slack variations
            'slack': 'n8n-nodes-base.slack',
            'slakc': 'n8n-nodes-base.slack',
            'slck': 'n8n-nodes-base.slack',
            'slac': 'n8n-nodes-base.slack',
            'slacc': 'n8n-nodes-base.slack',
            'slackapi': 'n8n-nodes-base.slack',
            'slack-api': 'n8n-nodes-base.slack',
            'n8n-nodes-slack.slack': 'n8n-nodes-base.slack',
            'n8n-nodes-base.slackBot': 'n8n-nodes-base.slack',
            'slackbot': 'n8n-nodes-base.slack',
            'slack-bot': 'n8n-nodes-base.slack',
            
            // AWS S3 variations
            's3': 'n8n-nodes-base.awsS3',
            'aws-s3': 'n8n-nodes-base.awsS3',
            'awss3': 'n8n-nodes-base.awsS3',
            'aws_s3': 'n8n-nodes-base.awsS3',
            'amazons3': 'n8n-nodes-base.awsS3',
            'amazon-s3': 'n8n-nodes-base.awsS3',
            'awsbucket': 'n8n-nodes-base.awsS3',
            'aws-bucket': 'n8n-nodes-base.awsS3',
            'n8n-nodes-aws.s3': 'n8n-nodes-base.awsS3',
            'n8n-nodes-base.s3': 'n8n-nodes-base.awsS3',
            'simples3': 'n8n-nodes-base.awsS3',
            'simple-s3': 'n8n-nodes-base.awsS3',
            
            // MailChimp variations
            'mailchimp': 'n8n-nodes-base.mailchimp',
            'mail-chimp': 'n8n-nodes-base.mailchimp',
            'mailchmp': 'n8n-nodes-base.mailchimp',
            'mailchimpp': 'n8n-nodes-base.mailchimp',
            'mailchip': 'n8n-nodes-base.mailchimp',
            'mailchim': 'n8n-nodes-base.mailchimp',
            'mailchimp-api': 'n8n-nodes-base.mailchimp',
            'n8n-nodes-mailchimp.mailchimp': 'n8n-nodes-base.mailchimp',
            'mailchimpapi': 'n8n-nodes-base.mailchimp',
            
            // Discord variations
            'discord': 'n8n-nodes-base.discord',
            'discrd': 'n8n-nodes-base.discord',
            'disord': 'n8n-nodes-base.discord',
            'discord-bot': 'n8n-nodes-base.discord',
            'discordbot': 'n8n-nodes-base.discord',
            'n8n-nodes-discord.discord': 'n8n-nodes-base.discord',
            'discord-api': 'n8n-nodes-base.discord',
            
            // Telegram variations
            'telegram': 'n8n-nodes-base.telegram',
            'telegrm': 'n8n-nodes-base.telegram',
            'telegramm': 'n8n-nodes-base.telegram',
            'telegam': 'n8n-nodes-base.telegram',
            'telegram-bot': 'n8n-nodes-base.telegram',
            'telegrambot': 'n8n-nodes-base.telegram',
            'telegram-api': 'n8n-nodes-base.telegram',
            'tg': 'n8n-nodes-base.telegram',
            'tgbot': 'n8n-nodes-base.telegram',
            
            // WhatsApp variations
            'whatsapp': 'n8n-nodes-base.whatsApp',
            'whatsap': 'n8n-nodes-base.whatsApp',
            'whats-app': 'n8n-nodes-base.whatsApp',
            'whatapp': 'n8n-nodes-base.whatsApp',
            'whats app': 'n8n-nodes-base.whatsApp',
            'watsapp': 'n8n-nodes-base.whatsApp',
            'whatsapp-business': 'n8n-nodes-base.whatsApp',
            'whatsappbusiness': 'n8n-nodes-base.whatsApp',
            'wa': 'n8n-nodes-base.whatsApp',
            'wapp': 'n8n-nodes-base.whatsApp',
            
            // MySQL variations
            'mysql': 'n8n-nodes-base.mySql',
            'my-sql': 'n8n-nodes-base.mySql',
            'mysqldb': 'n8n-nodes-base.mySql',
            'mysql-db': 'n8n-nodes-base.mySql',
            'mysqlserver': 'n8n-nodes-base.mySql',
            'mysql-server': 'n8n-nodes-base.mySql',
            'mysqldatabase': 'n8n-nodes-base.mySql',
            'mysql-database': 'n8n-nodes-base.mySql',
            
            // PostgreSQL variations
            'postgres': 'n8n-nodes-base.postgres',
            'postgresql': 'n8n-nodes-base.postgres',
            'postgre': 'n8n-nodes-base.postgres',
            'postgressql': 'n8n-nodes-base.postgres',
            'postgres-db': 'n8n-nodes-base.postgres',
            'postgresql-db': 'n8n-nodes-base.postgres',
            'postgresdb': 'n8n-nodes-base.postgres',
            'postgresqldb': 'n8n-nodes-base.postgres',
            'pg': 'n8n-nodes-base.postgres',
            'pgdb': 'n8n-nodes-base.postgres',
            
            // MongoDB variations
            'mongodb': 'n8n-nodes-base.mongoDb',
            'mongo': 'n8n-nodes-base.mongoDb',
            'mongo-db': 'n8n-nodes-base.mongoDb',
            'mongodatabase': 'n8n-nodes-base.mongoDb',
            'mongo-database': 'n8n-nodes-base.mongoDb',
            'mongodbatlas': 'n8n-nodes-base.mongoDb',
            'mongodb-atlas': 'n8n-nodes-base.mongoDb',
            
            // Google Sheets variations
            'googlesheets': 'n8n-nodes-base.googleSheets',
            'google-sheets': 'n8n-nodes-base.googleSheets',
            'gsheets': 'n8n-nodes-base.googleSheets',
            'g-sheets': 'n8n-nodes-base.googleSheets',
            'sheets': 'n8n-nodes-base.googleSheets',
            'spreadsheet': 'n8n-nodes-base.googleSheets',
            'googlespreadshet': 'n8n-nodes-base.googleSheets',
            'google-spreadsheet': 'n8n-nodes-base.googleSheets',
            
            // Microsoft Excel variations
            'excel': 'n8n-nodes-base.microsoftExcel',
            'microsoftexcel': 'n8n-nodes-base.microsoftExcel',
            'microsoft-excel': 'n8n-nodes-base.microsoftExcel',
            'msexcel': 'n8n-nodes-base.microsoftExcel',
            'ms-excel': 'n8n-nodes-base.microsoftExcel',
            'excelfile': 'n8n-nodes-base.microsoftExcel',
            'excel-file': 'n8n-nodes-base.microsoftExcel',
            'xlsx': 'n8n-nodes-base.microsoftExcel',
            'xls': 'n8n-nodes-base.microsoftExcel',
            
            // GitHub variations
            'github': 'n8n-nodes-base.github',
            'git-hub': 'n8n-nodes-base.github',
            'githubapi': 'n8n-nodes-base.github',
            'github-api': 'n8n-nodes-base.github',
            'gh': 'n8n-nodes-base.github',
            'githb': 'n8n-nodes-base.github',
            
            // GitLab variations
            'gitlab': 'n8n-nodes-base.gitLab',
            'git-lab': 'n8n-nodes-base.gitLab',
            'gitlabapi': 'n8n-nodes-base.gitLab',
            'gitlab-api': 'n8n-nodes-base.gitLab',
            'gl': 'n8n-nodes-base.gitLab',
            
            // Jira variations
            'jira': 'n8n-nodes-base.jira',
            'atlassian-jira': 'n8n-nodes-base.jira',
            'jiraapi': 'n8n-nodes-base.jira',
            'jira-api': 'n8n-nodes-base.jira',
            'jirasoftware': 'n8n-nodes-base.jira',
            'jira-software': 'n8n-nodes-base.jira',
            
            // Trello variations
            'trello': 'n8n-nodes-base.trello',
            'trelo': 'n8n-nodes-base.trello',
            'trelloapi': 'n8n-nodes-base.trello',
            'trello-api': 'n8n-nodes-base.trello',
            'trelloboard': 'n8n-nodes-base.trello',
            'trello-board': 'n8n-nodes-base.trello',
            
            // Salesforce variations
            'salesforce': 'n8n-nodes-base.salesforce',
            'sales-force': 'n8n-nodes-base.salesforce',
            'sfdc': 'n8n-nodes-base.salesforce',
            'salesforcecrm': 'n8n-nodes-base.salesforce',
            'salesforce-crm': 'n8n-nodes-base.salesforce',
            'salesforceapi': 'n8n-nodes-base.salesforce',
            'salesforce-api': 'n8n-nodes-base.salesforce',
            
            // Zendesk variations
            'zendesk': 'n8n-nodes-base.zendesk',
            'zen-desk': 'n8n-nodes-base.zendesk',
            'zendeskapi': 'n8n-nodes-base.zendesk',
            'zendesk-api': 'n8n-nodes-base.zendesk',
            'zendsk': 'n8n-nodes-base.zendesk',
            
            // Airtable variations
            'airtable': 'n8n-nodes-base.airtable',
            'air-table': 'n8n-nodes-base.airtable',
            'airtableapi': 'n8n-nodes-base.airtable',
            'airtable-api': 'n8n-nodes-base.airtable',
            'artable': 'n8n-nodes-base.airtable',
            
            // Notion variations
            'notion': 'n8n-nodes-base.notion',
            'notionapi': 'n8n-nodes-base.notion',
            'notion-api': 'n8n-nodes-base.notion',
            'notionpage': 'n8n-nodes-base.notion',
            'notion-page': 'n8n-nodes-base.notion',
            
            // Shopify variations
            'shopify': 'n8n-nodes-base.shopify',
            'shop-ify': 'n8n-nodes-base.shopify',
            'shopifyapi': 'n8n-nodes-base.shopify',
            'shopify-api': 'n8n-nodes-base.shopify',
            'shopifystore': 'n8n-nodes-base.shopify',
            'shopify-store': 'n8n-nodes-base.shopify',

            // Common Utility Nodes
            'httprequest': 'n8n-nodes-base.httpRequest',
            'http-request': 'n8n-nodes-base.httpRequest',
            'http': 'n8n-nodes-base.httpRequest',
            'request': 'n8n-nodes-base.httpRequest',
            'webrequest': 'n8n-nodes-base.httpRequest',
            'web-request': 'n8n-nodes-base.httpRequest',
            'apirequest': 'n8n-nodes-base.httpRequest',
            'api-request': 'n8n-nodes-base.httpRequest',

            'set': 'n8n-nodes-base.set',
            'setnode': 'n8n-nodes-base.set',
            'setvalue': 'n8n-nodes-base.set',
            'set-value': 'n8n-nodes-base.set',
            'setfield': 'n8n-nodes-base.set',
            'set-field': 'n8n-nodes-base.set',
            'variable': 'n8n-nodes-base.set', // Often used to 'set variables'

            'code': 'n8n-nodes-base.code',
            'js': 'n8n-nodes-base.code',
            'javascript': 'n8n-nodes-base.code',
            'script': 'n8n-nodes-base.code',
            'customcode': 'n8n-nodes-base.code',
            'custom-code': 'n8n-nodes-base.code',
            'function': 'n8n-nodes-base.code', // Older name for Code node
            'functionitem': 'n8n-nodes-base.code', // Older name for Code node
            'function-item': 'n8n-nodes-base.code',

            'webhook': 'n8n-nodes-base.webhook',
            'webhok': 'n8n-nodes-base.webhook',
            'incomingwebhook': 'n8n-nodes-base.webhook',
            'incoming-webhook': 'n8n-nodes-base.webhook',
            'httptrigger': 'n8n-nodes-base.webhook',
            'http-trigger': 'n8n-nodes-base.webhook',
            'webtigger': 'n8n-nodes-base.webhook',

            'cron': 'n8n-nodes-base.cron',
            'crontrigger': 'n8n-nodes-base.cron',
            'cron-trigger': 'n8n-nodes-base.cron',
            'schedule': 'n8n-nodes-base.cron',
            'scheduler': 'n8n-nodes-base.cron',
            'timer': 'n8n-nodes-base.cron',

            'splitinbatches': 'n8n-nodes-base.splitInBatches',
            'split-in-batches': 'n8n-nodes-base.splitInBatches',
            'batch': 'n8n-nodes-base.splitInBatches',
            'batches': 'n8n-nodes-base.splitInBatches',
            'splitbatch': 'n8n-nodes-base.splitInBatches',
            'split-batch': 'n8n-nodes-base.splitInBatches',

            'merge': 'n8n-nodes-base.merge',
            'combine': 'n8n-nodes-base.merge',
            'join': 'n8n-nodes-base.merge',
            'mergeitems': 'n8n-nodes-base.merge',
            'merge-items': 'n8n-nodes-base.merge',

            'filter': 'n8n-nodes-base.filter',
            'filteritems': 'n8n-nodes-base.filter',
            'filter-items': 'n8n-nodes-base.filter',
            'filterdata': 'n8n-nodes-base.filter',
            'filter-data': 'n8n-nodes-base.filter',
            'conditionsfilter': 'n8n-nodes-base.filter',

            'switch': 'n8n-nodes-base.switch',
            'switchcase': 'n8n-nodes-base.switch',
            'switch-case': 'n8n-nodes-base.switch',
            'choise': 'n8n-nodes-base.switch',
            'choices': 'n8n-nodes-base.switch',
            'conditional': 'n8n-nodes-base.switch',
            'logic': 'n8n-nodes-base.switch',

            'start': 'n8n-nodes-base.start',
            'trigger': 'n8n-nodes-base.start',
            'workflowstart': 'n8n-nodes-base.start',
            'workflow-start': 'n8n-nodes-base.start',
            'initialnode': 'n8n-nodes-base.start',

            'noop': 'n8n-nodes-base.noOp',
            'no-op': 'n8n-nodes-base.noOp',
            'nooperation': 'n8n-nodes-base.noOp',
            'no-operation': 'n8n-nodes-base.noOp',
            'dummy': 'n8n-nodes-base.noOp',

            // Google Services
            'googledrive': 'n8n-nodes-base.googleDrive',
            'google-drive': 'n8n-nodes-base.googleDrive',
            'gdrive': 'n8n-nodes-base.googleDrive',
            'drivefile': 'n8n-nodes-base.googleDrive',

            'googlecalendar': 'n8n-nodes-base.googleCalendar',
            'google-calendar': 'n8n-nodes-base.googleCalendar',
            'gcalendar': 'n8n-nodes-base.googleCalendar',
            'calendar': 'n8n-nodes-base.googleCalendar',

            'googledocs': 'n8n-nodes-base.googleDocs',
            'google-docs': 'n8n-nodes-base.googleDocs',
            'gdocs': 'n8n-nodes-base.googleDocs',
            'docs': 'n8n-nodes-base.googleDocs',

            'googletranslate': 'n8n-nodes-base.googleTranslate',
            'google-translate': 'n8n-nodes-base.googleTranslate',
            'gtranslate': 'n8n-nodes-base.googleTranslate',
            'translate': 'n8n-nodes-base.googleTranslate',

            // AI Services
            'openai': 'n8n-nodes-base.openAi',
            'open-ai': 'n8n-nodes-base.openAi',
            'chatgpt': 'n8n-nodes-base.openAi',
            'gpt': 'n8n-nodes-base.openAi',
            'ai': 'n8n-nodes-base.openAi',
            'llm': 'n8n-nodes-base.openAi',
            'dalle': 'n8n-nodes-base.openAi',

            // File Operations
            'readbinaryfile': 'n8n-nodes-base.readBinaryFile',
            'read-binary-file': 'n8n-nodes-base.readBinaryFile',
            'readfile': 'n8n-nodes-base.readBinaryFile',
            'read-file': 'n8n-nodes-base.readBinaryFile',
            'getfile': 'n8n-nodes-base.readBinaryFile',
            'get-file': 'n8n-nodes-base.readBinaryFile',

            'writebinaryfile': 'n8n-nodes-base.writeBinaryFile',
            'write-binary-file': 'n8n-nodes-base.writeBinaryFile',
            'writefile': 'n8n-nodes-base.writeBinaryFile',
            'write-file': 'n8n-nodes-base.writeBinaryFile',
            'savefile': 'n8n-nodes-base.writeBinaryFile',
            'save-file': 'n8n-nodes-base.writeBinaryFile',
            'uploadfile': 'n8n-nodes-base.writeBinaryFile',

            // Web/Data Parsing
            'htmlextract': 'n8n-nodes-base.htmlExtract',
            'html-extract': 'n8n-nodes-base.htmlExtract',
            'extracthtml': 'n8n-nodes-base.htmlExtract',
            'extract-html': 'n8n-nodes-base.htmlExtract',
            'scraper': 'n8n-nodes-base.htmlExtract',
            'htmlscraper': 'n8n-nodes-base.htmlExtract',

            'jsonnode': 'n8n-nodes-base.json', // n8n's JSON node
            'jsonparser': 'n8n-nodes-base.json',
            'json-parser': 'n8n-nodes-base.json',
            'parsejson': 'n8n-nodes-base.json',

            'xmlnode': 'n8n-nodes-base.xml', // n8n's XML node
            'xmlparser': 'n8n-nodes-base.xml',
            'xml-parser': 'n8n-nodes-base.xml',
            'parsexml': 'n8n-nodes-base.xml',

            'rssfeedread': 'n8n-nodes-base.rssFeedRead',
            'rss-feed-read': 'n8n-nodes-base.rssFeedRead',
            'rssread': 'n8n-nodes-base.rssFeedRead',
            'readrss': 'n8n-nodes-base.rssFeedRead',
            'rss': 'n8n-nodes-base.rssFeedRead',

            // Specific Service Integrations (already in keywords, now direct node mapping)
            'stripe': 'n8n-nodes-base.stripe',
            'stripeapi': 'n8n-nodes-base.stripe',
            'stripe-api': 'n8n-nodes-base.stripe',
            'payment': 'n8n-nodes-base.stripe', // Common association

            'paypal': 'n8n-nodes-base.payPal',
            'paypalapi': 'n8n-nodes-base.payPal',
            'paypal-api': 'n8n-nodes-base.payPal',

            'twilio': 'n8n-nodes-base.twilio',
            'twilioapi': 'n8n-nodes-base.twilio',
            'twilio-api': 'n8n-nodes-base.twilio',
            'sms': 'n8n-nodes-base.twilio',
            'call': 'n8n-nodes-base.twilio',

            'sendgrid': 'n8n-nodes-base.sendGrid',
            'sendgridapi': 'n8n-nodes-base.sendGrid',
            'sendgrid-api': 'n8n-nodes-base.sendGrid',

            'zoom': 'n8n-nodes-base.zoom',
            'zoomapi': 'n8n-nodes-base.zoom',
            'zoom-api': 'n8n-nodes-base.zoom',

            'calendly': 'n8n-nodes-base.calendly',
            'calendlyapi': 'n8n-nodes-base.calendly',
            'calendly-api': 'n8n-nodes-base.calendly',

            'dropbox': 'n8n-nodes-base.dropbox',
            'dropboxapi': 'n8n-nodes-base.dropbox',
            'dropbox-api': 'n8n-nodes-base.dropbox',

            'onedrive': 'n8n-nodes-base.microsoftOneDrive', // n8n uses microsoftOneDrive
            'onedriveapi': 'n8n-nodes-base.microsoftOneDrive',
            'onedrive-api': 'n8n-nodes-base.microsoftOneDrive',
            'msonedrive': 'n8n-nodes-base.microsoftOneDrive',

            'asana': 'n8n-nodes-base.asana',
            'asanaapi': 'n8n-nodes-base.asana',
            'asana-api': 'n8n-nodes-base.asana',

            'monday': 'n8n-nodes-base.mondayCom', // n8n uses mondayCom
            'mondaycom': 'n8n-nodes-base.mondayCom',
            'monday-com': 'n8n-nodes-base.mondayCom',

            'clickup': 'n8n-nodes-base.clickUp',
            'clickupapi': 'n8n-nodes-base.clickUp',
            'clickup-api': 'n8n-nodes-base.clickUp',

            'linear': 'n8n-nodes-base.linear',
            'linearapi': 'n8n-nodes-base.linear',
            'linear-api': 'n8n-nodes-base.linear',

            'intercom': 'n8n-nodes-base.intercom',
            'intercomapi': 'n8n-nodes-base.intercom',
            'intercom-api': 'n8n-nodes-base.intercom',

            'freshdesk': 'n8n-nodes-base.freshdesk',
            'freshdeskapi': 'n8n-nodes-base.freshdesk',
            'freshdesk-api': 'n8n-nodes-base.freshdesk',

            'pipedrive': 'n8n-nodes-base.pipedrive',
            'pipedriveapi': 'n8n-nodes-base.pipedrive',
            'pipedrive-api': 'n8n-nodes-base.pipedrive',

            'activecampaign': 'n8n-nodes-base.activeCampaign',
            'active-campaign': 'n8n-nodes-base.activeCampaign',

            'convertkit': 'n8n-nodes-base.convertKit',
            'convert-kit': 'n8n-nodes-base.convertKit',

            'typeform': 'n8n-nodes-base.typeform',
            'typeformapi': 'n8n-nodes-base.typeform',
            'typeform-api': 'n8n-nodes-base.typeform',

            'surveymonkey': 'n8n-nodes-base.surveyMonkey',
            'survey-monkey': 'n8n-nodes-base.surveyMonkey',

            // Integration Platforms (more for context, less for direct node types but good to have)
            'zapier': 'n8n-nodes-base.httpRequest', // Often used for 'Zapier Webhook' type calls
            'makecom': 'n8n-nodes-base.httpRequest', // Often used for 'Make Webhook' type calls
            'integromat': 'n8n-nodes-base.httpRequest', // Older name for Make
            'pabblyconnect': 'n8n-nodes-base.httpRequest',

            // === Nodos Core de n8n y Utilidades ===
            'itemlists': 'n8n-nodes-base.itemLists',
            'item-lists': 'n8n-nodes-base.itemLists',
            'listoperations': 'n8n-nodes-base.itemLists',
            'list-operations': 'n8n-nodes-base.itemLists',
            'arrayoperations': 'n8n-nodes-base.itemLists',
            'array-operations': 'n8n-nodes-base.itemLists',
            'listitem': 'n8n-nodes-base.itemLists',

            'convertexcel': 'n8n-nodes-base.convertExcel',
            'convert-excel': 'n8n-nodes-base.convertExcel',
            'excelconverter': 'n8n-nodes-base.convertExcel',
            'exceltojson': 'n8n-nodes-base.convertExcel',
            'jsontoexcel': 'n8n-nodes-base.convertExcel',

            'converttocsv': 'n8n-nodes-base.convertToCSV',
            'convert-to-csv': 'n8n-nodes-base.convertToCSV',
            'csvconverter': 'n8n-nodes-base.convertToCSV',
            'jsontocsv': 'n8n-nodes-base.convertToCSV',

            'converttopdf': 'n8n-nodes-base.convertToPDF',
            'convert-to-pdf': 'n8n-nodes-base.convertToPDF',
            'pdfconverter': 'n8n-nodes-base.convertToPDF',
            'htmltopdf': 'n8n-nodes-base.convertToPDF',

            'converttobase64': 'n8n-nodes-base.convertToBase64',
            'convert-to-base64': 'n8n-nodes-base.convertToBase64',
            'base64encode': 'n8n-nodes-base.convertToBase64',
            'base64decode': 'n8n-nodes-base.convertToBase64',

            'converttotext': 'n8n-nodes-base.convertToText',
            'convert-to-text': 'n8n-nodes-base.convertToText',
            'textconverter': 'n8n-nodes-base.convertToText',
            'htmltotext': 'n8n-nodes-base.convertToText',

            'crypto': 'n8n-nodes-base.crypto',
            'encryption': 'n8n-nodes-base.crypto',
            'hash': 'n8n-nodes-base.crypto',
            'hashing': 'n8n-nodes-base.crypto',
            'encrypt': 'n8n-nodes-base.crypto',
            'decrypt': 'n8n-nodes-base.crypto',

            'datagenerator': 'n8n-nodes-base.dataGenerator',
            'data-generator': 'n8n-nodes-base.dataGenerator',
            'fakedata': 'n8n-nodes-base.dataGenerator',
            'generate': 'n8n-nodes-base.dataGenerator',

            'editfields': 'n8n-nodes-base.editFields', // Older name for Set node features
            'edit-fields': 'n8n-nodes-base.editFields',
            'transformdata': 'n8n-nodes-base.editFields',

            'expressions': 'n8n-nodes-base.expressions', // Common misnomer, implies code
            'expression': 'n8n-nodes-base.expressions',

            'wait': 'n8n-nodes-base.wait',
            'delay': 'n8n-nodes-base.wait',
            'sleep': 'n8n-nodes-base.wait',
            'pause': 'n8n-nodes-base.wait',

            'log': 'n8n-nodes-base.log',
            'logger': 'n8n-nodes-base.log',
            'consolelog': 'n8n-nodes-base.log',

            'movebinaryfile': 'n8n-nodes-base.moveBinaryFile',
            'move-binary-file': 'n8n-nodes-base.moveBinaryFile',
            'movefile': 'n8n-nodes-base.moveBinaryFile',
            'move-file': 'n8n-nodes-base.moveBinaryFile',

            'copybinaryfile': 'n8n-nodes-base.copyBinaryFile',
            'copy-binary-file': 'n8n-nodes-base.copyBinaryFile',
            'copyfile': 'n8n-nodes-base.copyBinaryFile',
            'copy-file': 'n8n-nodes-base.copyBinaryFile',

            'deletebinaryfile': 'n8n-nodes-base.deleteBinaryFile',
            'delete-binary-file': 'n8n-nodes-base.deleteBinaryFile',
            'deletefile': 'n8n-nodes-base.deleteBinaryFile',
            'delete-file': 'n8n-nodes-base.deleteBinaryFile',
            'removefile': 'n8n-nodes-base.deleteBinaryFile',

            'sftp': 'n8n-nodes-base.sftp',
            'ftp': 'n8n-nodes-base.sftp',
            'filetransfer': 'n8n-nodes-base.sftp',
            'secureftp': 'n8n-nodes-base.sftp',

            'ssh': 'n8n-nodes-base.ssh',
            'executecommand': 'n8n-nodes-base.ssh',
            'remotecommand': 'n8n-nodes-base.ssh',

            'loop': 'n8n-nodes-base.splitInBatches', // or Merge, depending on context. Default to split.
            'forloop': 'n8n-nodes-base.splitInBatches',
            'foreach': 'n8n-nodes-base.splitInBatches',

            // === Más Servicios en la Nube / Databases ===
            'amazonec2': 'n8n-nodes-base.awsEc2',
            'aws-ec2': 'n8n-nodes-base.awsEc2',
            'ec2': 'n8n-nodes-base.awsEc2',
            'amazonlambda': 'n8n-nodes-base.awsLambda',
            'aws-lambda': 'n8n-nodes-base.awsLambda',
            'lambda': 'n8n-nodes-base.awsLambda',
            'awskms': 'n8n-nodes-base.awsKms',
            'aws-kms': 'n8n-nodes-base.awsKms',
            'awssns': 'n8n-nodes-base.awsSns',
            'aws-sns': 'n8n-nodes-base.awsSns',
            'awssqs': 'n8n-nodes-base.awsSqs',
            'aws-sqs': 'n8n-nodes-base.awsSqs',

            'googlecloudstorage': 'n8n-nodes-base.googleCloudStorage',
            'google-cloud-storage': 'n8n-nodes-base.googleCloudStorage',
            'gcs': 'n8n-nodes-base.googleCloudStorage',
            'googlebigquery': 'n8n-nodes-base.googleBigQuery',
            'google-bigquery': 'n8n-nodes-base.googleBigQuery',
            'bigquery': 'n8n-nodes-base.googleBigQuery',
            'googlecloudfunctions': 'n8n-nodes-base.googleCloudFunctions',
            'google-cloud-functions': 'n8n-nodes-base.googleCloudFunctions',
            'gcf': 'n8n-nodes-base.googleCloudFunctions',

            'azureblobstorage': 'n8n-nodes-base.azureBlobStorage',
            'azure-blob-storage': 'n8n-nodes-base.azureBlobStorage',
            'azurestorage': 'n8n-nodes-base.azureBlobStorage',
            'azurequeues': 'n8n-nodes-base.azureQueueStorage',
            'azure-queue-storage': 'n8n-nodes-base.azureQueueStorage',

            'mariadb': 'n8n-nodes-base.mariaDb',
            'mariadbserver': 'n8n-nodes-base.mariaDb',
            'mssql': 'n8n-nodes-base.microsoftSql',
            'microsoftsql': 'n8n-nodes-base.microsoftSql',
            'sqlserver': 'n8n-nodes-base.microsoftSql',
            'oracle': 'n8n-nodes-base.oracleDb',
            'oracledb': 'n8n-nodes-base.oracleDb',
            'redshift': 'n8n-nodes-base.redshift',
            'snowflake': 'n8n-nodes-base.snowflake',
            'couchdb': 'n8n-nodes-base.couchDb',
            'cassandra': 'n8n-nodes-base.cassandra',

            // === Más Herramientas de Productividad/CRM/Marketing ===
            'pabbly': 'n8n-nodes-base.pabbly', // As there is a specific node
            'pabblyconnect': 'n8n-nodes-base.pabbly',
            'makecom': 'n8n-nodes-base.make', // Assuming a 'make' node exists, otherwise generic HTTP
            'integromat': 'n8n-nodes-base.make',

            'googlesheets': 'n8n-nodes-base.googleSheets', // Already there, but adding more variations
            'gsheet': 'n8n-nodes-base.googleSheets',
            'googlesheetsapi': 'n8n-nodes-base.googleSheets',

            'microsoftteams': 'n8n-nodes-base.microsoftTeams',
            'ms-teams': 'n8n-nodes-base.microsoftTeams',
            'teams': 'n8n-nodes-base.microsoftTeams',

            'googlecontacts': 'n8n-nodes-base.googleContacts',
            'google-contacts': 'n8n-nodes-base.googleContacts',
            'gcontacts': 'n8n-nodes-base.googleContacts',

            'googleforms': 'n8n-nodes-base.googleForms',
            'google-forms': 'n8n-nodes-base.googleForms',
            'gforms': 'n8n-nodes-base.googleForms',

            'salespanel': 'n8n-nodes-base.salesPanel',
            'sales-panel': 'n8n-nodes-base.salesPanel',

            'sendinblue': 'n8n-nodes-base.sendInBlue',
            'send-in-blue': 'n8n-nodes-base.sendInBlue',
            'brevo': 'n8n-nodes-base.sendInBlue', // New name for Sendinblue

            'klaviyo': 'n8n-nodes-base.klaviyo',
            'klaviyoapi': 'n8n-nodes-base.klaviyo',

            'manychat': 'n8n-nodes-base.manyChat',
            'many-chat': 'n8n-nodes-base.manyChat',

            'whatsappcloud': 'n8n-nodes-base.whatsAppCloud',
            'whatsapp-cloud': 'n8n-nodes-base.whatsAppCloud',

            'clickatell': 'n8n-nodes-base.clickatell',

            'customerio': 'n8n-nodes-base.customerIo',
            'customer-io': 'n8n-nodes-base.customerIo',

            'drift': 'n8n-nodes-base.drift',

            'webflow': 'n8n-nodes-base.webflow',

            'wordpress': 'n8n-nodes-base.wordPress',
            'wp': 'n8n-nodes-base.wordPress',

            'youtube': 'n8n-nodes-base.youTube',
            'yt': 'n8n-nodes-base.youTube',
            'youtubevideos': 'n8n-nodes-base.youTube',

            'vimeo': 'n8n-nodes-base.vimeo',

            'shopifypos': 'n8n-nodes-base.shopifyPos',
            'shopify-pos': 'n8n-nodes-base.shopifyPos',

            'bigcommerce': 'n8n-nodes-base.bigCommerce',
            'big-commerce': 'n8n-nodes-base.bigCommerce',

            'woocommerce': 'n8n-nodes-base.wooCommerce',
            'woo-commerce': 'n8n-nodes-base.wooCommerce',
            'wordpresswoocommerce': 'n8n-nodes-base.wooCommerce',

            'zoommeeting': 'n8n-nodes-base.zoom', // More specific to node type
            'zoomwebinar': 'n8n-nodes-base.zoom',

            'githubissues': 'n8n-nodes-base.github', // More specific to node type
            'githubpullrequests': 'n8n-nodes-base.github',

            'googledialer': 'n8n-nodes-base.googleDialer',
            'google-dialer': 'n8n-nodes-base.googleDialer',

            'googlepubsub': 'n8n-nodes-base.googlePubSub',
            'google-pubsub': 'n8n-nodes-base.googlePubSub',
            'pubsub': 'n8n-nodes-base.googlePubSub',

            'googletasks': 'n8n-nodes-base.googleTasks',
            'google-tasks': 'n8n-nodes-base.googleTasks',
            'gtasks': 'n8n-nodes-base.googleTasks',

            'pcloud': 'n8n-nodes-base.pcloud',

            'sentry': 'n8n-nodes-base.sentry',

            'semrush': 'n8n-nodes-base.semrush',

            'freshsales': 'n8n-nodes-base.freshsales',
            'freshsalescrm': 'n8n-nodes-base.freshsales',

            'pipedream': 'n8n-nodes-base.httpRequest', // Integration platform, common to use HTTP node
            'trayio': 'n8n-nodes-base.httpRequest', // Integration platform, common to use HTTP node

            'webhookresponse': 'n8n-nodes-base.webhookResponse',
            'webhook-response': 'n8n-nodes-base.webhookResponse',
            'responsewebhook': 'n8n-nodes-base.webhookResponse',
            'respondto-webhook': 'n8n-nodes-base.webhookResponse',
            'sendresponse': 'n8n-nodes-base.webhookResponse',

            'extractdata': 'n8n-nodes-base.htmlExtract', // Often implies some form of data extraction
            'parsehtml': 'n8n-nodes-base.htmlExtract',

            'emailread': 'n8n-nodes-base.emailReadImap', // assuming IMAP as common for reading
            'reademail': 'n8n-nodes-base.emailReadImap',
            'imap': 'n8n-nodes-base.emailReadImap',
            'emailtrigger': 'n8n-nodes-base.emailReadImap',

            'emailsend': 'n8n-nodes-base.emailSend',
            'sendemail': 'n8n-nodes-base.emailSend',
            'smtp': 'n8n-nodes-base.emailSend',

            // More generic/utility nodes
            'data': 'n8n-nodes-base.set', // Often means setting/manipulating data
            'transform': 'n8n-nodes-base.set',
            'manipulate': 'n8n-nodes-base.set',
            'jsonata': 'n8n-nodes-base.set', // JSONata is often used in Set node
            'moment': 'n8n-nodes-base.code', // Moment.js is often used in Code node for dates
            'date': 'n8n-nodes-base.code', // Date manipulation often happens in Code
            'time': 'n8n-nodes-base.code', // Time manipulation often happens in Code

            // Social Media
            'facebook': 'n8n-nodes-base.facebook',
            'fb': 'n8n-nodes-base.facebook',
            'facebookads': 'n8n-nodes-base.facebookAds',
            'facebook-ads': 'n8n-nodes-base.facebookAds',
            'fbads': 'n8n-nodes-base.facebookAds',
            'facebookconversions': 'n8n-nodes-base.facebookConversions',
            'facebook-conversions': 'n8n-nodes-base.facebookConversions',
            'fbevents': 'n8n-nodes-base.facebookConversions',

            'instagram': 'n8n-nodes-base.instagram',
            'ig': 'n8n-nodes-base.instagram',

            'twitter': 'n8n-nodes-base.twitter',
            'x': 'n8n-nodes-base.twitter', // New name for Twitter

            'linkedin': 'n8n-nodes-base.linkedIn',
            'linkedinads': 'n8n-nodes-base.linkedInAds',

            'pinterest': 'n8n-nodes-base.pinterest',
            'tiktok': 'n8n-nodes-base.tiktok'
        };
        
        // Mapeo de operaciones incorrectas a correctas - VERSIÓN ULTRA-EXPANDIDA
        this.operationCorrections = {
            // Operaciones de igualdad
            'notEquals': 'notEqual',
            'not_equals': 'notEqual',
            'notequal': 'notEqual',
            'not_equal': 'notEqual',
            'isEqual': 'equal',
            'is_equal': 'equal',
            'equals': 'equal',
            'eq': 'equal',
            'neq': 'notEqual',
            'ne': 'notEqual',
            'equalTo': 'equal',
            'equal_to': 'equal',
            'notEqualTo': 'notEqual',
            'not_equal_to': 'notEqual',
            
            // Operaciones de comparación numérica
            'greaterEqual': 'greaterThanOrEqual',
            'greater_equal': 'greaterThanOrEqual',
            'lessEqual': 'lessThanOrEqual',
            'less_equal': 'lessThanOrEqual',
            'greaterThanEqual': 'greaterThanOrEqual',
            'lessThanEqual': 'lessThanOrEqual',
            'gte': 'greaterThanOrEqual',
            'lte': 'lessThanOrEqual',
            'gt': 'greaterThan',
            'lt': 'lessThan',
            'greater': 'greaterThan',
            'less': 'lessThan',
            'greaterThanOrEqualTo': 'greaterThanOrEqual',
            'lessThanOrEqualTo': 'lessThanOrEqual',
            'bigger': 'greaterThan',
            'smaller': 'lessThan',
            'biggerEqual': 'greaterThanOrEqual',
            'smallerEqual': 'lessThanOrEqual',
            
            // Operaciones de vacío/existencia
            'notEmpty': 'isNotEmpty',
            'not_empty': 'isNotEmpty',
            'isEmpty': 'isEmpty',  // Ya es correcto
            'empty': 'isEmpty',
            'isNull': 'isEmpty',
            'is_null': 'isEmpty',
            'null': 'isEmpty',
            'notNull': 'isNotEmpty',
            'not_null': 'isNotEmpty',
            'exists': 'isNotEmpty',
            'notExists': 'isEmpty',
            'not_exists': 'isEmpty',
            'hasValue': 'isNotEmpty',
            'has_value': 'isNotEmpty',
            'noValue': 'isEmpty',
            'no_value': 'isEmpty',
            'defined': 'isNotEmpty',
            'undefined': 'isEmpty',
            
            // Operaciones booleanas
            'isTrue': 'equal',     // isTrue debe convertirse a equal con value2: true
            'isFalse': 'equal',    // isFalse debe convertirse a equal con value2: false
            'is_true': 'equal',
            'is_false': 'equal',
            'true': 'equal',
            'false': 'equal',
            'boolean': 'equal',
            
            // Operaciones de texto/cadenas
            'contains': 'contains',  // Ya es correcto
            'notContains': 'notContains',  // Ya es correcto
            'not_contains': 'notContains',
            'includes': 'contains',
            'notIncludes': 'notContains',
            'not_includes': 'notContains',
            'has': 'contains',
            'notHas': 'notContains',
            'not_has': 'notContains',
            'like': 'contains',
            'notLike': 'notContains',
            'not_like': 'notContains',
            
            // Operaciones de inicio/fin de texto
            'startsWith': 'startsWith',  // Ya es correcto
            'starts_with': 'startsWith',
            'beginsWith': 'startsWith',
            'begins_with': 'startsWith',
            'startWith': 'startsWith',
            'start_with': 'startsWith',
            'endsWith': 'endsWith',  // Ya es correcto
            'ends_with': 'endsWith',
            'finishWith': 'endsWith',
            'finish_with': 'endsWith',
            'endWith': 'endsWith',
            'end_with': 'endsWith',
            'finishesWith': 'endsWith',
            'finishes_with': 'endsWith',
            
            // Operaciones de expresiones regulares
            'regex': 'regex',  // Ya es correcto
            'regexp': 'regex',
            'regularExpression': 'regex',
            'regular_expression': 'regex',
            'pattern': 'regex',
            'match': 'regex',
            'matches': 'regex',
            'regexMatch': 'regex',
            'regex_match': 'regex',
            
            // Operaciones de arrays/listas
            'in': 'contains',
            'notIn': 'notContains',
            'not_in': 'notContains',
            'inArray': 'contains',
            'in_array': 'contains',
            'notInArray': 'notContains',
            'not_in_array': 'notContains',
            'arrayContains': 'contains',
            'array_contains': 'contains',
            'listContains': 'contains',
            'list_contains': 'contains',
            
            // Operaciones numéricas específicas
            'between': 'greaterThanOrEqual',  // Se puede expandir para rangos
            'notBetween': 'lessThan',
            'not_between': 'lessThan',
            'inRange': 'greaterThanOrEqual',
            'in_range': 'greaterThanOrEqual',
            'outOfRange': 'lessThan',
            'out_of_range': 'lessThan',
            
            // Operaciones de fecha/tiempo
            'before': 'lessThan',
            'after': 'greaterThan',
            'beforeOrEqual': 'lessThanOrEqual',
            'before_or_equal': 'lessThanOrEqual',
            'afterOrEqual': 'greaterThanOrEqual',
            'after_or_equal': 'greaterThanOrEqual',
            'olderThan': 'lessThan',
            'older_than': 'lessThan',
            'newerThan': 'greaterThan',
            'newer_than': 'greaterThan',
            'since': 'greaterThanOrEqual',
            'until': 'lessThanOrEqual',

            // Operaciones de igualdad (continuación)
            'isequalto': 'equal',
            'notequalto': 'notEqual',
            'doesnotEqual': 'notEqual',
            'does_not_equal': 'notEqual',
            'isidentical': 'equal',
            'is_identical': 'equal',
            'notidentical': 'notEqual',
            'not_identical': 'notEqual',

            // Operaciones de comparación numérica (continuación)
            'strictlyGreaterThan': 'greaterThan',
            'strictlyLessThan': 'lessThan',
            'biggerthan': 'greaterThan',
            'smallerthan': 'lessThan',
            'morethan': 'greaterThan',
            'lessthan': 'lessThan',
            'atleast': 'greaterThanOrEqual',
            'atmost': 'lessThanOrEqual',

            // Operaciones de vacío/existencia (continuación)
            'isempty': 'isEmpty',
            'isnotempty': 'isNotEmpty',
            'exist': 'isNotEmpty',
            'notexist': 'isEmpty',
            'isdefined': 'isNotEmpty',
            'isundefined': 'isEmpty',
            'hasakey': 'isNotEmpty', // Asume que si tiene una clave, no está vacío
            'hasproperty': 'isNotEmpty',
            'keyexists': 'isNotEmpty',
            'propertyexists': 'isNotEmpty',
            'hasvalue': 'isNotEmpty',
            'novalue': 'isEmpty',

            // Operaciones booleanas (continuación)
            'istrue': 'equal', // Asegúrate de que tu `correctIfCondition` lo maneje
            'isfalse': 'equal', // Asegúrate de que tu `correctIfCondition` lo maneje
            'booleanTrue': 'equal',
            'booleanFalse': 'equal',

            // Operaciones de texto/cadenas (continuación)
            'doesnotcontain': 'notContains',
            'does_not_contain': 'notContains',
            'excludes': 'notContains',
            'doesnotinclude': 'notContains',
            'does_not_include': 'notContains',
            'stringcontains': 'contains',
            'stringnotcontains': 'notContains',
            'textcontains': 'contains',
            'textnotcontains': 'notContains',
            'matchany': 'regex', // Si se usa con una expresión regular para 'OR'
            'matchall': 'regex', // Si se usa con una expresión regular para 'AND'

            // Operaciones de inicio/fin de texto (continuación)
            'beginwith': 'startsWith',
            'endwith': 'endsWith',
            'startof': 'startsWith',
            'endof': 'endsWith',
            'prefix': 'startsWith',
            'suffix': 'endsWith',

            // Operaciones de expresiones regulares (continuación)
            'matchesregex': 'regex',
            'matches-regex': 'regex',
            'patternmatch': 'regex',
            'pattern-match': 'regex',

            // Operaciones de arrays/listas (continuación)
            'inlist': 'contains',
            'notinlist': 'notContains',
            'arrayincludes': 'contains',
            'arrayexcludes': 'notContains',
            'listincludes': 'contains',
            'listexcludes': 'notContains',
            'hasitem': 'contains',
            'doesnotมีitem': 'notContains', // Typo-friendly
            'itemexists': 'contains',
            'itemdoesnotexist': 'notContains',

            // Operaciones numéricas específicas (continuación)
            'within': 'greaterThanOrEqual', // Para rangos
            'outside': 'lessThan', // Para rangos

            // Operaciones de fecha/tiempo (continuación)
            'datebefore': 'lessThan',
            'dateafter': 'greaterThan',
            'onorbefore': 'lessThanOrEqual',
            'on_or_before': 'lessThanOrEqual',
            'onorafter': 'greaterThanOrEqual',
            'on_or_after': 'greaterThanOrEqual',
            'isolderthan': 'lessThan',
            'isnewerthan': 'greaterThan',
            'older': 'lessThan',
            'newer': 'greaterThan',
            'isbefore': 'lessThan',
            'isafter': 'greaterThan',
            'past': 'lessThan',
            'future': 'greaterThan',
            'today': 'equal', // Esto podría necesitar lógica adicional si "hoy" se compara con una fecha dinámica.
            'yesterday': 'equal',
            'tomorrow': 'equal',

            // === Operaciones de Igualdad y Comparación ===
            'exactlyequal': 'equal',
            'exactlynotequal': 'notEqual',
            'different': 'notEqual',
            'isdifferent': 'notEqual',
            'strictlyequal': 'equal',
            'strictlynotequal': 'notEqual',
            'islessthan': 'lessThan',
            'isgreaterthan': 'greaterThan',
            'islessthanorequal': 'lessThanOrEqual',
            'isgreaterthanorequal': 'greaterThanOrEqual',
            'lessthanorequalto': 'lessThanOrEqual',
            'greaterthanorequalto': 'greaterThanOrEqual',

            // === Operaciones de Vacío/Existencia ===
            'nullorwhitespace': 'isEmpty',
            'emptyorwhitespace': 'isEmpty',
            'isblank': 'isEmpty',
            'isnotblank': 'isNotEmpty',
            'hasanyvalue': 'isNotEmpty',
            'hasnovalue': 'isEmpty',

            // === Operaciones Booleanas ===
            'istruthy': 'equal', // map to equal true
            'isfalsy': 'equal',  // map to equal false
            'booleantrue': 'equal',
            'booleanfalse': 'equal',

            // === Operaciones de Texto/Cadenas ===
            'doesnotstartwith': 'notStartsWith',
            'does_not_start_with': 'notStartsWith',
            'doesnotendwith': 'notEndsWith',
            'does_not_end_with': 'notEndsWith',
            'notstartswith': 'notStartsWith',
            'notendswith': 'notEndsWith',
            'beginsnotwith': 'notStartsWith',
            'endsnotwith': 'notEndsWith',
            'notequalsignorecase': 'notEqual', // requires special handling in n8n, but operation name is key
            'equalsignorecase': 'equal',       // requires special handling in n8n, but operation name is key
            'caseinsensitiveequal': 'equal',
            'caseinsensitivenotequal': 'notEqual',

            // === Operaciones de Arrays/Listas ===
            'arrayhas': 'contains',
            'arraynothas': 'notContains',
            'listincludesany': 'contains', // If any item in list1 is in list2
            'listincludesall': 'contains', // If all items in list1 are in list2 - more complex but good keyword
            'listhas': 'contains',
            'listdoesnothave': 'notContains',
            'isinarray': 'contains',
            'isnotinarray': 'notContains',
            'hassubstring': 'contains', // For string operations within an array context
            'doesnotมีsubstring': 'notContains',

            // === Operaciones Numéricas Avanzadas ===
            'isdivisibleby': 'equal', // if value1 % value2 === 0
            'isodd': 'notEqual',     // if value1 % 2 !== 0
            'iseven': 'equal',       // if value1 % 2 === 0

            // === Operaciones de Fecha/Tiempo Avanzadas ===
            'ison': 'equal', // For specific date
            'isbeforetoday': 'lessThan', // relative date
            'isaftertoday': 'greaterThan', // relative date
            'istoday': 'equal',
            'isyesteday': 'equal',
            'istomorrow': 'equal',
            'thisweek': 'greaterThanOrEqual', // requires range logic
            'lastweek': 'lessThanOrEqual',    // requires range logic
            'thismonth': 'greaterThanOrEqual',
            'lastmonth': 'lessThanOrEqual',
            'thisyear': 'greaterThanOrEqual',
            'lastyear': 'lessThanOrEqual',
            'isinrange': 'greaterThanOrEqual', // combined with lessThanOrEqual
            'isnotinrange': 'lessThan', // combined with greaterThan
            'dateis': 'equal',
            'datebefore': 'lessThan',
            'dateafter': 'greaterThan',
            'dayofweek': 'equal', // Requires specific value2 for day (e.g., 0 for Sunday)
            'monthis': 'equal',
            'yearis': 'equal',
            'isweekend': 'equal', // (dayOfWeek === 0 || dayOfWeek === 6)
            'isweekday': 'notEqual', // (dayOfWeek !== 0 && dayOfWeek !== 6)
            'currentdate': 'equal',
            'currenttime': 'equal',
            'timebefore': 'lessThan',
            'timeafter': 'greaterThan',
            'datediff': 'equal', // If difference is x
            'datedifference': 'equal',
            'olderthanyears': 'lessThan',
            'newerthanyears': 'greaterThan',
            'olderthanmonths': 'lessThan',
            'newerthanmonths': 'greaterThan',
            'olderthandays': 'lessThan',
            'newerthandays': 'greaterThan',
            'olderthanhours': 'lessThan',
            'newerthanhours': 'greaterThan',
            'olderthanminutes': 'lessThan',
            'newerthanminutes': 'greaterThan',

            // === Operaciones Lógicas (para futura expansión si n8n tiene un nodo "Logical AND/OR" para propiedades) ===
            'and': 'and', // This would typically be an 'AND' node itself, not an IF operation
            'or': 'or',   // This would typically be an 'OR' node itself, not an IF operation
            'xor': 'xor', // Exclusive OR
            'not': 'notEqual', // General 'not' implies negation, often 'notEqual'
        };
        
        // Palabras clave para identificar servicios - VERSIÓN ULTRA-EXPANDIDA
        this.serviceKeywords = {
            'hubspot': ['crm', 'customer', 'relationship', 'management', 'sales', 'marketing', 'lead', 'contact', 'deal', 'pipeline', 'campaign', 'automation'],
            'slack': ['chat', 'message', 'team', 'communication', 'channel', 'workspace', 'notification', 'alert', 'bot', 'collaboration', 'messaging'],
            'awsS3': ['storage', 'bucket', 'file', 'amazon', 'aws', 'cloud', 'backup', 'upload', 'download', 'object', 'archive', 'data'],
            'mailchimp': ['email', 'marketing', 'newsletter', 'campaign', 'automation', 'subscriber', 'list', 'template', 'mailing', 'mail'],
            'discord': ['gaming', 'community', 'voice', 'text', 'server', 'channel', 'bot', 'webhook', 'guild', 'member'],
            'telegram': ['messaging', 'bot', 'notification', 'instant', 'chat', 'channel', 'group', 'api', 'send', 'message'],
            'whatsApp': ['messaging', 'mobile', 'chat', 'instant', 'whats', 'business', 'api', 'send', 'message', 'phone'],
            'mySql': ['database', 'sql', 'relational', 'query', 'table', 'select', 'insert', 'update', 'delete', 'mysql', 'db'],
            'postgres': ['database', 'sql', 'postgresql', 'relational', 'query', 'table', 'select', 'insert', 'update', 'delete', 'pg'],
            'mongoDb': ['database', 'mongodb', 'mongo', 'nosql', 'document', 'collection', 'find', 'insert', 'update', 'delete', 'atlas'],
            'googleSheets': ['spreadsheet', 'sheets', 'google', 'excel', 'table', 'row', 'column', 'cell', 'data', 'csv', 'gsheets'],
            'microsoftExcel': ['excel', 'microsoft', 'spreadsheet', 'xlsx', 'xls', 'workbook', 'worksheet', 'cell', 'formula', 'ms'],
            'github': ['git', 'repository', 'repo', 'code', 'commit', 'push', 'pull', 'branch', 'merge', 'issue', 'pr', 'version'],
            'gitLab': ['git', 'repository', 'repo', 'code', 'commit', 'push', 'pull', 'branch', 'merge', 'issue', 'ci', 'cd'],
            'jira': ['issue', 'ticket', 'project', 'bug', 'task', 'story', 'epic', 'sprint', 'board', 'workflow', 'atlassian'],
            'trello': ['board', 'card', 'list', 'project', 'task', 'kanban', 'organize', 'team', 'collaboration', 'workflow'],
            'salesforce': ['crm', 'sales', 'lead', 'opportunity', 'account', 'contact', 'campaign', 'automation', 'sfdc', 'force'],
            'zendesk': ['support', 'ticket', 'customer', 'help', 'desk', 'agent', 'service', 'chat', 'email', 'satisfaction'],
            'airtable': ['database', 'table', 'base', 'record', 'field', 'view', 'collaboration', 'organize', 'data', 'spreadsheet'],
            'notion': ['note', 'page', 'workspace', 'database', 'wiki', 'document', 'collaboration', 'knowledge', 'team', 'content'],
            'shopify': ['ecommerce', 'store', 'product', 'order', 'customer', 'inventory', 'payment', 'shop', 'online', 'commerce'],
            'stripe': ['payment', 'checkout', 'card', 'subscription', 'invoice', 'customer', 'charge', 'refund', 'billing', 'money'],
            'paypal': ['payment', 'money', 'transfer', 'paypal', 'checkout', 'invoice', 'subscription', 'merchant', 'buyer', 'seller'],
            'twilio': ['sms', 'phone', 'call', 'message', 'communication', 'voice', 'video', 'api', 'mobile', 'telephony'],
            'sendgrid': ['email', 'smtp', 'send', 'mail', 'delivery', 'marketing', 'transactional', 'template', 'newsletter', 'api'],
            'zoom': ['meeting', 'video', 'conference', 'webinar', 'call', 'audio', 'screen', 'share', 'participant', 'room'],
            'calendly': ['calendar', 'appointment', 'booking', 'schedule', 'meeting', 'event', 'time', 'slot', 'availability', 'invite'],
            'dropbox': ['file', 'storage', 'cloud', 'sync', 'share', 'folder', 'upload', 'download', 'document', 'backup'],
            'onedrive': ['file', 'storage', 'cloud', 'microsoft', 'sync', 'share', 'folder', 'upload', 'download', 'document'],
            'googledrive': ['file', 'storage', 'cloud', 'google', 'sync', 'share', 'folder', 'upload', 'download', 'document'],
            'asana': ['task', 'project', 'team', 'collaboration', 'workflow', 'assignment', 'deadline', 'milestone', 'board', 'timeline'],
            'monday': ['project', 'management', 'task', 'team', 'board', 'workflow', 'automation', 'timeline', 'collaboration', 'monday.com'],
            'clickup': ['task', 'project', 'team', 'productivity', 'workspace', 'goal', 'doc', 'time', 'tracking', 'collaboration'],
            'linear': ['issue', 'tracking', 'project', 'bug', 'feature', 'roadmap', 'team', 'development', 'software', 'cycle'],
            'intercom': ['chat', 'customer', 'support', 'message', 'help', 'bot', 'conversation', 'user', 'engagement', 'communication'],
            'freshdesk': ['support', 'ticket', 'customer', 'help', 'agent', 'service', 'desk', 'chat', 'email', 'satisfaction'],
            'pipedrive': ['crm', 'sales', 'pipeline', 'deal', 'lead', 'contact', 'opportunity', 'forecast', 'activity', 'revenue'],
            'activecampaign': ['email', 'marketing', 'automation', 'campaign', 'contact', 'list', 'subscriber', 'template', 'crm', 'sales'],
            'convertkit': ['email', 'marketing', 'creator', 'newsletter', 'automation', 'subscriber', 'form', 'landing', 'sequence', 'broadcast'],
            'typeform': ['form', 'survey', 'quiz', 'feedback', 'response', 'question', 'field', 'submission', 'data', 'collection'],
            'surveymonkey': ['survey', 'form', 'feedback', 'response', 'question', 'poll', 'quiz', 'data', 'collection', 'analysis'],
            'zapier': ['automation', 'integration', 'workflow', 'trigger', 'action', 'app', 'connect', 'zap', 'webhook', 'api'],
            'make': ['automation', 'integration', 'workflow', 'scenario', 'module', 'trigger', 'action', 'connect', 'app', 'integromat'],
            'pabbly': ['automation', 'integration', 'workflow', 'trigger', 'action', 'app', 'connect', 'subscription', 'billing', 'email'],

            // Common Utility Nodes
            'httpRequest': ['http', 'request', 'api', 'webhook', 'rest', 'endpoint', 'call', 'data transfer', 'integration', 'get', 'post', 'put', 'delete', 'patch'],
            'set': ['set', 'variable', 'data', 'field', 'value', 'assign', 'modify', 'update', 'create', 'json', 'property', 'add', 'edit'],
            'code': ['code', 'script', 'javascript', 'js', 'function', 'custom', 'logic', 'execute', 'run', 'programming', 'transform', 'process', 'manipulate'],
            'webhook': ['webhook', 'trigger', 'incoming', 'receive', 'event', 'api', 'callback', 'listener', 'http', 'external', 'data'],
            'cron': ['cron', 'schedule', 'timer', 'interval', 'time', 'recurrence', 'daily', 'hourly', 'weekly', 'monthly', 'periodic', 'trigger'],
            'splitInBatches': ['batch', 'split', 'chunk', 'divide', 'group', 'process', 'items', 'list', 'array', 'sublist', 'paginate'],
            'merge': ['merge', 'combine', 'join', 'union', 'append', 'attach', 'data', 'items', 'list', 'concat'],
            'filter': ['filter', 'select', 'exclude', 'include', 'condition', 'criteria', 'data', 'items', 'list', 'remove', 'keep', 'match'],
            'switch': ['switch', 'case', 'choice', 'logic', 'conditional', 'branch', 'route', 'path', 'flow', 'decision'],
            'start': ['start', 'trigger', 'workflow', 'initial', 'begin', 'entry', 'run', 'execute', 'first'],
            'noOp': ['noop', 'no-op', 'dummy', 'placeholder', 'empty', 'do nothing', 'pass-through', 'debug'],

            // Google Services (continuación)
            'googleDrive': ['drive', 'gdrive', 'google', 'file', 'folder', 'storage', 'document', 'upload', 'download', 'share', 'sync', 'sheet', 'doc', 'slides'],
            'googleCalendar': ['calendar', 'gcalendar', 'google', 'event', 'appointment', 'schedule', 'meeting', 'time', 'date', 'booking', 'rsvp'],
            'googleDocs': ['docs', 'document', 'google', 'word', 'editor', 'create', 'read', 'update', 'template', 'text'],
            'googleTranslate': ['translate', 'translation', 'language', 'google', 'text', 'convert', 'localization'],

            // AI Services
            'openAi': ['ai', 'openai', 'gpt', 'chatgpt', 'llm', 'model', 'text', 'generate', 'language', 'dall-e', 'image', 'completion', 'prompt', 'api'],

            // File Operations (más general)
            'readBinaryFile': ['read file', 'get file', 'binary file', 'load file', 'open file', 'input file', 'blob', 'document'],
            'writeBinaryFile': ['write file', 'save file', 'upload file', 'binary write', 'create file', 'output file', 'store file', 'export'],

            // Web/Data Parsing
            'htmlExtract': ['html', 'extract', 'scraper', 'parse', 'dom', 'web', 'data', 'elements', 'selector', 'css', 'xpath'],
            'json': ['json', 'parse', 'format', 'object', 'array', 'data', 'serialize', 'deserialize', 'convert'],
            'xml': ['xml', 'parse', 'format', 'document', 'data', 'serialize', 'deserialize', 'convert', 'soap'],
            'rssFeedRead': ['rss', 'feed', 'read', 'news', 'blog', 'syndication', 'articles', 'entries', 'posts'],

            // Nuevas integraciones de servicios (palabras clave más detalladas)
            'stripe': ['payment', 'checkout', 'card', 'subscription', 'invoice', 'customer', 'charge', 'refund', 'billing', 'money', 'transaction', 'payout'],
            'payPal': ['payment', 'money', 'transfer', 'paypal', 'checkout', 'invoice', 'subscription', 'merchant', 'buyer', 'seller', 'transaction', 'payout'],
            'twilio': ['sms', 'phone', 'call', 'message', 'communication', 'voice', 'video', 'api', 'mobile', 'telephony', 'otp', 'mms'],
            'sendGrid': ['email', 'smtp', 'send', 'mail', 'delivery', 'marketing', 'transactional', 'template', 'newsletter', 'api', 'bounce', 'open', 'click'],
            'zoom': ['meeting', 'video', 'conference', 'webinar', 'call', 'audio', 'screen', 'share', 'participant', 'room', 'host', 'attendee', 'record'],
            'calendly': ['calendar', 'appointment', 'booking', 'schedule', 'meeting', 'event', 'time', 'slot', 'availability', 'invite', 'host'],
            'dropbox': ['file', 'storage', 'cloud', 'sync', 'share', 'folder', 'upload', 'download', 'document', 'backup', 'data', 'space'],
            'microsoftOneDrive': ['file', 'storage', 'cloud', 'microsoft', 'sync', 'share', 'folder', 'upload', 'download', 'document', 'ms', 'office'],
            'asana': ['task', 'project', 'team', 'collaboration', 'workflow', 'assignment', 'deadline', 'milestone', 'board', 'timeline', 'portfolio', 'work'],
            'mondayCom': ['project', 'management', 'task', 'team', 'board', 'workflow', 'automation', 'timeline', 'collaboration', 'monday.com', 'workspace'],
            'clickUp': ['task', 'project', 'team', 'productivity', 'workspace', 'goal', 'doc', 'time', 'tracking', 'collaboration', 'list', 'status'],
            'linear': ['issue', 'tracking', 'project', 'bug', 'feature', 'roadmap', 'team', 'development', 'software', 'cycle', 'feedback', 'sprint'],
            'intercom': ['chat', 'customer', 'support', 'message', 'help', 'bot', 'conversation', 'user', 'engagement', 'communication', 'widget'],
            'freshdesk': ['support', 'ticket', 'customer', 'help', 'agent', 'service', 'desk', 'chat', 'email', 'satisfaction', 'portal'],
            'pipedrive': ['crm', 'sales', 'pipeline', 'deal', 'lead', 'contact', 'opportunity', 'forecast', 'activity', 'revenue', 'stage', 'win'],
            'activeCampaign': ['email', 'marketing', 'automation', 'campaign', 'contact', 'list', 'subscriber', 'template', 'crm', 'sales', 'funnel', 'segment'],
            'convertKit': ['email', 'marketing', 'creator', 'newsletter', 'automation', 'subscriber', 'form', 'landing', 'sequence', 'broadcast', 'audience'],
            'typeform': ['form', 'survey', 'quiz', 'feedback', 'response', 'question', 'field', 'submission', 'data', 'collection', 'poll'],
            'surveyMonkey': ['survey', 'form', 'feedback', 'response', 'question', 'poll', 'quiz', 'data', 'collection', 'analysis', 'research'],

            // === Nodos Core de n8n y Utilidades ===
            'itemLists': ['list', 'array', 'item', 'collection', 'add', 'remove', 'get', 'filter', 'sort', 'unique', 'split', 'combine', 'merge'],
            'convertExcel': ['excel', 'xlsx', 'xls', 'spreadsheet', 'convert', 'json', 'csv', 'read', 'write', 'parse'],
            'convertToCSV': ['csv', 'comma separated', 'text', 'convert', 'json', 'excel', 'read', 'write', 'parse'],
            'convertToPDF': ['pdf', 'document', 'generate', 'html', 'convert', 'file', 'export', 'print'],
            'convertToBase64': ['base64', 'encode', 'decode', 'binary', 'text', 'convert', 'file', 'string'],
            'convertToText': ['text', 'string', 'html', 'markdown', 'plain text', 'convert', 'strip tags'],
            'crypto': ['hash', 'encrypt', 'decrypt', 'sign', 'verify', 'hmac', 'md5', 'sha', 'cipher', 'secret', 'key'],
            'dataGenerator': ['generate', 'fake data', 'mock data', 'test data', 'random', 'dummy', 'lorem ipsum', 'uuid'],
            'editFields': ['edit', 'modify', 'transform', 'rename', 'add', 'remove', 'set', 'field', 'property', 'data'],
            'expressions': ['expression', 'jsonata', 'formula', 'calculation', 'evaluate', 'compute'],
            'wait': ['wait', 'delay', 'sleep', 'pause', 'throttle', 'timeout', 'schedule'],
            'log': ['log', 'debug', 'monitor', 'output', 'console', 'message', 'tracking'],
            'moveBinaryFile': ['move', 'file', 'transfer', 'relocate', 'storage', 'directory', 'folder'],
            'copyBinaryFile': ['copy', 'file', 'duplicate', 'clone', 'backup', 'replicate'],
            'deleteBinaryFile': ['delete', 'remove', 'file', 'erase', 'destroy', 'cleanup'],
            'sftp': ['sftp', 'ftp', 'file transfer', 'secure', 'ssh', 'upload', 'download', 'host', 'server'],
            'ssh': ['ssh', 'command', 'remote', 'execute', 'server', 'shell', 'script', 'host', 'linux'],
            'webhookResponse': ['response', 'webhook', 'reply', 'send', 'output', 'return', 'http', 'status code'],
            'emailReadImap': ['email', 'imap', 'read', 'inbox', 'fetch', 'mail', 'message', 'attachment', 'new email', 'trigger'],
            'emailSend': ['email', 'send', 'smtp', 'mail', 'outbox', 'compose', 'message', 'attachment'],

            // === Más Servicios en la Nube / Databases ===
            'awsEc2': ['aws', 'ec2', 'server', 'instance', 'virtual machine', 'compute', 'cloud', 'provision', 'launch'],
            'awsLambda': ['aws', 'lambda', 'serverless', 'function', 'compute', 'execute', 'event', 'trigger', 'cloud'],
            'awsKms': ['aws', 'kms', 'key management', 'encryption', 'security', 'cryptography', 'secrets'],
            'awsSns': ['aws', 'sns', 'notification', 'publish', 'subscribe', 'topic', 'message', 'alert', 'push'],
            'awsSqs': ['aws', 'sqs', 'queue', 'message', 'enqueue', 'dequeue', 'listen', 'event', 'asynchronous'],
            'googleCloudStorage': ['gcs', 'google cloud', 'storage', 'bucket', 'file', 'object', 'upload', 'download', 'archive', 'data lake'],
            'googleBigQuery': ['bigquery', 'google cloud', 'data warehouse', 'analytics', 'sql', 'query', 'dataset', 'table'],
            'googleCloudFunctions': ['gcf', 'google cloud', 'serverless', 'function', 'compute', 'execute', 'event', 'trigger'],
            'azureBlobStorage': ['azure', 'blob', 'storage', 'container', 'file', 'object', 'cloud', 'upload', 'download'],
            'azureQueueStorage': ['azure', 'queue', 'message', 'enqueue', 'dequeue', 'cloud', 'event'],
            'mariaDb': ['mariadb', 'database', 'sql', 'relational', 'db', 'query', 'table', 'open source'],
            'microsoftSql': ['mssql', 'sql server', 'database', 'microsoft', 'sql', 'db', 'azure sql'],
            'oracleDb': ['oracle', 'database', 'sql', 'enterprise', 'db', 'cloud', 'exadata'],
            'redshift': ['redshift', 'aws', 'data warehouse', 'sql', 'analytics', 'big data'],
            'snowflake': ['snowflake', 'data warehouse', 'cloud', 'analytics', 'sql', 'data platform'],
            'couchDb': ['couchdb', 'nosql', 'document database', 'json', 'data', 'replication'],
            'cassandra': ['cassandra', 'nosql', 'distributed database', 'apache', 'big data', 'column-family'],

            // === Más Herramientas de Productividad/CRM/Marketing ===
            'pabbly': ['pabbly', 'connect', 'automation', 'integration', 'workflow', 'trigger', 'action', 'app', 'subscription'],
            'make': ['make', 'integromat', 'automation', 'integration', 'scenario', 'module', 'workflow', 'trigger', 'action'],
            'microsoftTeams': ['teams', 'microsoft', 'chat', 'meeting', 'collaboration', 'channel', 'message', 'notification'],
            'googleContacts': ['contacts', 'google', 'people', 'address book', 'sync', 'crm', 'contact management'],
            'googleForms': ['forms', 'google', 'survey', 'quiz', 'collect data', 'feedback', 'submission', 'questionnaire'],
            'salesPanel': ['salespanel', 'crm', 'sales', 'lead', 'customer', 'pipeline', 'deal', 'opportunity'],
            'sendInBlue': ['sendinblue', 'brevo', 'email marketing', 'newsletter', 'sms', 'transactional email', 'marketing automation'],
            'klaviyo': ['klaviyo', 'email marketing', 'ecommerce', 'sms marketing', 'customer data', 'segmentation', 'flows'],
            'manyChat': ['manychat', 'chatbot', 'facebook messenger', 'instagram bot', 'automation', 'conversational marketing'],
            'whatsAppCloud': ['whatsapp cloud', 'api', 'business api', 'messaging', 'send message', 'receive message', 'customer communication'],
            'clickatell': ['clickatell', 'sms', 'messaging', 'api', 'communication', 'notification'],
            'customerIo': ['customer.io', 'email automation', 'messaging', 'customer engagement', 'segmentation', 'lifecycle'],
            'drift': ['drift', 'chatbot', 'live chat', 'conversational marketing', 'sales automation', 'lead generation'],
            'webflow': ['webflow', 'website', 'cms', 'design', 'hosting', 'form submission', 'ecommerce'],
            'wordPress': ['wordpress', 'website', 'blog', 'cms', 'post', 'page', 'user', 'plugin', 'woocommerce'],
            'youTube': ['youtube', 'video', 'channel', 'upload', 'playlist', 'subscriber', 'data', 'analytics'],
            'vimeo': ['vimeo', 'video', 'hosting', 'upload', 'stream', 'private video'],
            'shopifyPos': ['shopify pos', 'point of sale', 'retail', 'in-store', 'orders', 'products'],
            'bigCommerce': ['bigcommerce', 'ecommerce', 'store', 'online shop', 'products', 'orders', 'customers'],
            'wooCommerce': ['woocommerce', 'wordpress ecommerce', 'online store', 'products', 'orders', 'customers', 'shop'],
            'googleDialer': ['google dialer', 'phone call', 'crm integration', 'call logs', 'outbound calls'],
            'googlePubSub': ['google pubsub', 'messaging', 'publish', 'subscribe', 'event stream', 'real-time data'],
            'googleTasks': ['google tasks', 'to-do list', 'task management', 'create task', 'update task'],
            'pcloud': ['pcloud', 'cloud storage', 'file sync', 'backup', 'share files'],
            'sentry': ['sentry', 'error tracking', 'performance monitoring', 'bug reporting', 'crash reports'],
            'semrush': ['semrush', 'seo', 'marketing analytics', 'keyword research', 'competitor analysis'],
            'freshsales': ['freshsales', 'crm', 'sales', 'lead management', 'deal tracking', 'account management'],

            // === Redes Sociales ===
            'facebook': ['facebook', 'fb', 'social media', 'post', 'page', 'group', 'user', 'event'],
            'facebookAds': ['facebook ads', 'fb ads', 'advertising', 'campaign', 'ad set', 'audience', 'marketing'],
            'facebookConversions': ['facebook conversions', 'fb events', 'pixel', 'tracking', 'conversion api', 'event data'],
            'instagram': ['instagram', 'ig', 'social media', 'post', 'story', 'reel', 'follower', 'dm'],
            'twitter': ['twitter', 'x', 'tweet', 'post', 'social media', 'follower', 'dm', 'timeline'],
            'linkedIn': ['linkedin', 'professional network', 'connection', 'profile', 'post', 'company page'],
            'linkedInAds': ['linkedin ads', 'advertising', 'campaign', 'b2b marketing', 'lead gen'],
            'pinterest': ['pinterest', 'visual discovery', 'pin', 'board', 'idea', 'inspiration'],
            'tiktok': ['tiktok', 'short video', 'social media', 'creator', 'viral', 'feed']
        };
    }
    
    // Calcular similitud de Levenshtein mejorada
    calculateLevenshteinSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));
        
        for (let i = 0; i <= len1; i++) matrix[0][i] = i;
        for (let j = 0; j <= len2; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }
        
        const distance = matrix[len2][len1];
        const maxLength = Math.max(len1, len2);
        return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
    }
    
    // Buscar la mejor coincidencia por contexto
    findBestMatchByContext(incorrectName, context = '') {
        let bestMatch = null;
        let bestScore = 0;
        
        // Normalizar entrada
        const normalizedIncorrect = incorrectName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const contextWords = context.toLowerCase().split(/\s+/);
        
        // Buscar en mapeo directo primero
        if (this.nodeTypeCorrections[normalizedIncorrect]) {
            return this.nodeTypeCorrections[normalizedIncorrect];
        }
        
        // Buscar por similitud de texto
        for (const [incorrect, correct] of Object.entries(this.nodeTypeCorrections)) {
            const similarity = this.calculateLevenshteinSimilarity(normalizedIncorrect, incorrect);
            
            if (similarity > 0.6 && similarity > bestScore) {
                bestMatch = correct;
                bestScore = similarity;
            }
        }
        
        // Buscar por palabras clave en contexto
        for (const [service, keywords] of Object.entries(this.serviceKeywords)) {
            const keywordMatches = keywords.filter(keyword => 
                contextWords.some(word => word.includes(keyword) || keyword.includes(word))
            ).length;
            
            if (keywordMatches > 0) {
                const contextScore = keywordMatches / keywords.length + 0.1;
                if (contextScore > bestScore) {
                    bestMatch = `n8n-nodes-base.${service}`;
                    bestScore = contextScore;
                }
            }
        }
        
        return bestMatch;
    }
    
    // Corregir tipo de nodo
    correctNodeType(nodeType, nodeName = '', nodeDescription = '') {
        const context = `${nodeName} ${nodeDescription}`.toLowerCase();
        
        // Si ya es correcto, devolver tal como está
        if (nodeType.startsWith('n8n-nodes-base.')) {
            return nodeType;
        }
        
        console.log(`🔍 Corrigiendo tipo de nodo: "${nodeType}" (contexto: "${context.substring(0, 50)}...")`);
        
        const correctedType = this.findBestMatchByContext(nodeType, context);
        
        if (correctedType && correctedType !== nodeType) {
            console.log(`✅ Corrección aplicada: "${nodeType}" → "${correctedType}"`);
            return correctedType;
        }
        
        console.log(`⚠️ No se encontró corrección para: "${nodeType}"`);
        return nodeType;
    }
    
    // Corregir operación IF
    correctIfOperation(operation) {
        if (this.operationCorrections[operation]) {
            console.log(`✅ Operación IF corregida: "${operation}" → "${this.operationCorrections[operation]}"`);
            return this.operationCorrections[operation];
        }
        return operation;
    }
    
    // Corregir condición completa de IF (incluyendo value2 para casos especiales)
    correctIfCondition(condition) {
        if (!condition.operation) return condition;
        
        const originalOperation = condition.operation;
        let correctedCondition = { ...condition };
        
        // Corregir operación
        correctedCondition.operation = this.correctIfOperation(originalOperation);
        
        // Casos especiales que requieren value2
        if (originalOperation === 'isTrue') {
            correctedCondition.operation = 'equal';
            correctedCondition.value2 = true;
            console.log(`✅ Condición especial corregida: isTrue → equal con value2: true`);
        } else if (originalOperation === 'isFalse') {
            correctedCondition.operation = 'equal';
            correctedCondition.value2 = false;
            console.log(`✅ Condición especial corregida: isFalse → equal con value2: false`);
        }
        
        return correctedCondition;
    }
    
    // Corregir JSON completo
    correctWorkflowJSON(jsonObj) {
        if (!jsonObj || !jsonObj.nodes) return jsonObj;
        
        console.log(`🔧 CORRECTOR DE NOMBRES ULTRA-ROBUSTA - Procesando ${jsonObj.nodes.length} nodos`);
        
        let correctionsApplied = 0;
        
        jsonObj.nodes = jsonObj.nodes.map(node => {
            const originalType = node.type;
            const correctedType = this.correctNodeType(node.type, node.name || '', node.description || '');
            
            if (correctedType !== originalType) {
                node.type = correctedType;
                correctionsApplied++;
            }
            
            // Corregir operaciones IF
            if (node.type === 'n8n-nodes-base.if' && node.parameters && node.parameters.conditions) {
                node.parameters.conditions = node.parameters.conditions.map(condition => {
                    const originalCondition = JSON.stringify(condition);
                    const correctedCondition = this.correctIfCondition(condition);
                    
                    if (JSON.stringify(correctedCondition) !== originalCondition) {
                        correctionsApplied++;
                    }
                    
                    return correctedCondition;
                });
            }
            
            return node;
        });
        
        console.log(`✅ CORRECTOR COMPLETADO: ${correctionsApplied} correcciones aplicadas`);
        
        return jsonObj;
    }
}

export default IntelligentNameCorrector;

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
            'shopify-store': 'n8n-nodes-base.shopify'
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
            'until': 'lessThanOrEqual'
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
            'pabbly': ['automation', 'integration', 'workflow', 'trigger', 'action', 'app', 'connect', 'subscription', 'billing', 'email']
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

module.exports = IntelligentNameCorrector;

// Herramienta de Autocorrector de Flujos para n8n AI Assistant - VERSION EXPANDIDA
// Sistema inteligente de corrección y optimización de workflows

class AutocorrectorFlujos {
  constructor() {
    this.correcciones = {
      // 🔄 Correcciones críticas de tipos de nodos (EXPANDIDO)
      tiposNodo: {
        // Triggers básicos
        'manualTrigger': 'n8n-nodes-base.start',
        'manual trigger': 'n8n-nodes-base.start',
        'manual': 'n8n-nodes-base.start',
        'start': 'n8n-nodes-base.start',
        'trigger': 'n8n-nodes-base.start',
        'webhook': 'n8n-nodes-base.webhook',
        'cron': 'n8n-nodes-base.cron',
        'schedule': 'n8n-nodes-base.scheduleTrigger',
        'timer': 'n8n-nodes-base.scheduleTrigger',

        // HTTP y requests
        'http': 'n8n-nodes-base.httpRequest',
        'http request': 'n8n-nodes-base.httpRequest',
        'httprequest': 'n8n-nodes-base.httpRequest',
        'request': 'n8n-nodes-base.httpRequest',
        'api': 'n8n-nodes-base.httpRequest',
        'rest': 'n8n-nodes-base.httpRequest',
        'fetch': 'n8n-nodes-base.httpRequest',

        // Email y comunicación
        'email': 'n8n-nodes-base.emailSend',
        'mail': 'n8n-nodes-base.emailSend',
        'send email': 'n8n-nodes-base.emailSend',
        'gmail': 'n8n-nodes-base.gmail',
        'outlook': 'n8n-nodes-base.microsoftOutlook',
        'sendgrid': 'n8n-nodes-base.sendGrid',
        'mailgun': 'n8n-nodes-base.mailgun',

        // Hojas de cálculo y bases de datos
        'sheets': 'n8n-nodes-base.googleSheets',
        'google sheets': 'n8n-nodes-base.googleSheets',
        'googlesheets': 'n8n-nodes-base.googleSheets',
        'spreadsheet': 'n8n-nodes-base.googleSheets',
        'excel': 'n8n-nodes-base.microsoftExcel',
        'airtable': 'n8n-nodes-base.airtable',
        'mysql': 'n8n-nodes-base.mysql',
        'postgres': 'n8n-nodes-base.postgres',
        'postgresql': 'n8n-nodes-base.postgres',
        'mongodb': 'n8n-nodes-base.mongoDb',
        'mongo': 'n8n-nodes-base.mongoDb',
        'redis': 'n8n-nodes-base.redis',
        'sqlite': 'n8n-nodes-base.sqlite',

        // Mensajería y chat
        'slack': 'n8n-nodes-base.slack',
        'discord': 'n8n-nodes-base.discord',
        'telegram': 'n8n-nodes-base.telegram',
        'whatsapp': 'n8n-nodes-base.whatsApp',
        'teams': 'n8n-nodes-base.microsoftTeams',
        'mattermost': 'n8n-nodes-base.mattermost',
        'chat': 'n8n-nodes-base.slack',

        // Control de flujo y lógica
        'if': 'n8n-nodes-base.if',
        'switch': 'n8n-nodes-base.switch',
        'condition': 'n8n-nodes-base.if',
        'conditional': 'n8n-nodes-base.if',
        'logic': 'n8n-nodes-base.if',
        'merge': 'n8n-nodes-base.merge',
        'split': 'n8n-nodes-base.splitInBatches',
        'batch': 'n8n-nodes-base.splitInBatches',
        'aggregate': 'n8n-nodes-base.aggregate',
        'wait': 'n8n-nodes-base.wait',
        'delay': 'n8n-nodes-base.wait',
        'pause': 'n8n-nodes-base.wait',

        // Código y funciones
        'code': 'n8n-nodes-base.code',
        'function': 'n8n-nodes-base.function',
        'javascript': 'n8n-nodes-base.code',
        'js': 'n8n-nodes-base.code',
        'python': 'n8n-nodes-base.code',
        'script': 'n8n-nodes-base.code',
        'execute': 'n8n-nodes-base.code',

        // Manipulación de datos
        'set': 'n8n-nodes-base.set',
        'transform': 'n8n-nodes-base.set',
        'edit': 'n8n-nodes-base.set',
        'modify': 'n8n-nodes-base.set',
        'filter': 'n8n-nodes-base.filter',
        'sort': 'n8n-nodes-base.sort',
        'limit': 'n8n-nodes-base.limit',
        'json': 'n8n-nodes-base.json',
        'csv': 'n8n-nodes-base.csv',
        'xml': 'n8n-nodes-base.xml',

        // Cloud storage y archivos
        'gdrive': 'n8n-nodes-base.googleDrive',
        'google drive': 'n8n-nodes-base.googleDrive',
        'googledrive': 'n8n-nodes-base.googleDrive',
        'dropbox': 'n8n-nodes-base.dropbox',
        'onedrive': 'n8n-nodes-base.microsoftOneDrive',
        'aws s3': 'n8n-nodes-base.awsS3',
        's3': 'n8n-nodes-base.awsS3',
        'ftp': 'n8n-nodes-base.ftp',
        'sftp': 'n8n-nodes-base.sftp',

        // Social media y marketing
        'twitter': 'n8n-nodes-base.twitter',
        'facebook': 'n8n-nodes-base.facebookGraphApi',
        'instagram': 'n8n-nodes-base.instagram',
        'linkedin': 'n8n-nodes-base.linkedIn',
        'youtube': 'n8n-nodes-base.youTube',
        'mailchimp': 'n8n-nodes-base.mailchimp',
        'hubspot': 'n8n-nodes-base.hubspot',
        'salesforce': 'n8n-nodes-base.salesforce',

        // Productividad
        'notion': 'n8n-nodes-base.notion',
        'trello': 'n8n-nodes-base.trello',
        'asana': 'n8n-nodes-base.asana',
        'jira': 'n8n-nodes-base.jira',
        'github': 'n8n-nodes-base.github',
        'gitlab': 'n8n-nodes-base.gitlab',
        'calendar': 'n8n-nodes-base.googleCalendar',
        'google calendar': 'n8n-nodes-base.googleCalendar',
        'zoom': 'n8n-nodes-base.zoom',

        // AI y Machine Learning
        'openai': 'n8n-nodes-base.openAi',
        'chatgpt': 'n8n-nodes-base.openAi',
        'gpt': 'n8n-nodes-base.openAi',
        'anthropic': 'n8n-nodes-base.anthropic',
        'claude': 'n8n-nodes-base.anthropic',
        'huggingface': 'n8n-nodes-base.huggingFaceInference',
        'cohere': 'n8n-nodes-base.cohere',
        'pinecone': 'n8n-nodes-base.pinecone',
        'weaviate': 'n8n-nodes-base.weaviate',

        // E-commerce y pagos
        'shopify': 'n8n-nodes-base.shopify',
        'stripe': 'n8n-nodes-base.stripe',
        'paypal': 'n8n-nodes-base.payPal',
        'square': 'n8n-nodes-base.square',
        'woocommerce': 'n8n-nodes-base.wooCommerce',

        // Monitoring y analytics
        'google analytics': 'n8n-nodes-base.googleAnalytics',
        'analytics': 'n8n-nodes-base.googleAnalytics',
        'mixpanel': 'n8n-nodes-base.mixpanel',
        'segment': 'n8n-nodes-base.segment',
        'prometheus': 'n8n-nodes-base.prometheus',
        'grafana': 'n8n-nodes-base.grafana'
      },
      
      // 🎯 Correcciones de operaciones comunes (EXPANDIDO)
      operaciones: {
        // Operaciones CRUD básicas
        'get': 'get',
        'read': 'get',
        'fetch': 'get',
        'retrieve': 'get',
        'list': 'list',
        'getAll': 'getAll',
        'create': 'create',
        'add': 'create',
        'insert': 'create',
        'new': 'create',
        'update': 'update',
        'edit': 'update',
        'modify': 'update',
        'patch': 'update',
        'delete': 'delete',
        'remove': 'delete',
        'destroy': 'delete',

        // Operaciones de comunicación
        'send': 'send',
        'sendMessage': 'sendMessage',
        'reply': 'reply',
        'forward': 'forward',
        'receive': 'receive',
        'download': 'download',
        'upload': 'upload',

        // Operaciones de archivos
        'copy': 'copy',
        'move': 'move',
        'rename': 'rename',
        'search': 'search',
        'find': 'search',

        // Operaciones especiales
        'execute': 'execute',
        'run': 'execute',
        'trigger': 'trigger',
        'start': 'start',
        'stop': 'stop',
        'pause': 'pause',
        'resume': 'resume'
      },

      // 🔗 Correcciones de conexiones comunes
      conexiones: {
        'main': 'main',
        'else': 'else',
        'true': 'main',
        'false': 'else',
        'success': 'main',
        'error': 'else',
        'output': 'main',
        'default': 'main'
      }
    };

    // Estadísticas de correcciones aplicadas
    this.estadisticas = {
      tiposNodoCorregidos: 0,
      operacionesCorregidas: 0,
      conexionesCorregidas: 0,
      totalCorrecciones: 0
    };
  }

  // Método principal para corregir un workflow
  corregirWorkflow(workflowData) {
    try {
      console.log('🔧 Autocorrector EXPANDIDO: Iniciando corrección del workflow...');
      
      // Resetear estadísticas
      this.resetearEstadisticas();
      
      // Extraer datos del workflow si vienen en un objeto con propiedades adicionales
      const actualWorkflowData = workflowData.workflow || workflowData;
      
      if (!actualWorkflowData || typeof actualWorkflowData !== 'object') {
        throw new Error('Datos del workflow inválidos');
      }

      // Aplicar correcciones a los nodos
      if (actualWorkflowData.nodes && Array.isArray(actualWorkflowData.nodes)) {
        actualWorkflowData.nodes = actualWorkflowData.nodes.map(nodo => 
          this.corregirNodo(nodo)
        );
      }

      // Aplicar correcciones a las conexiones
      if (actualWorkflowData.connections && typeof actualWorkflowData.connections === 'object') {
        actualWorkflowData.connections = this.corregirConexiones(actualWorkflowData.connections);
      }

      // Log de estadísticas
      this.logEstadisticas();

      console.log('✅ Autocorrector EXPANDIDO: Workflow corregido exitosamente');
      return actualWorkflowData;

    } catch (error) {
      console.error('❌ Error en Autocorrector EXPANDIDO:', error.message);
      // Devolver datos originales en caso de error
      return workflowData.workflow || workflowData;
    }
  }

  // Corregir un nodo individual (MEJORADO)
  corregirNodo(nodo) {
    if (!nodo || typeof nodo !== 'object') return nodo;

    // Corregir tipo de nodo
    if (nodo.type && typeof nodo.type === 'string') {
      const tipoCorregido = this.corregirTipoNodo(nodo.type);
      if (tipoCorregido !== nodo.type) {
        console.log(`📝 Corrección tipo nodo: "${nodo.type}" → "${tipoCorregido}"`);
        nodo.type = tipoCorregido;
        this.estadisticas.tiposNodoCorregidos++;
        this.estadisticas.totalCorrecciones++;
      }
    }

    // Corregir operación si existe
    if (nodo.parameters && nodo.parameters.operation) {
      const operacionCorregida = this.corregirOperacion(nodo.parameters.operation);
      if (operacionCorregida !== nodo.parameters.operation) {
        console.log(`📝 Corrección operación: "${nodo.parameters.operation}" → "${operacionCorregida}"`);
        nodo.parameters.operation = operacionCorregida;
        this.estadisticas.operacionesCorregidas++;
        this.estadisticas.totalCorrecciones++;
      }
    }

    // Corregir nombre del nodo si contiene caracteres problemáticos
    if (nodo.name) {
      const nombreCorregido = this.corregirNombreNodo(nodo.name);
      if (nombreCorregido !== nodo.name) {
        console.log(`📝 Corrección nombre nodo: "${nodo.name}" → "${nombreCorregido}"`);
        nodo.name = nombreCorregido;
      }
    }

    return nodo;
  }

  // Corregir tipo de nodo usando el mapeo EXPANDIDO
  corregirTipoNodo(tipo) {
    if (!tipo || typeof tipo !== 'string') return tipo;
    
    const tipoLower = tipo.toLowerCase().trim();
    
    // Buscar coincidencia exacta primero
    if (this.correcciones.tiposNodo[tipoLower]) {
      return this.correcciones.tiposNodo[tipoLower];
    }

    // Buscar coincidencias parciales más inteligentes
    for (const [incorrecto, correcto] of Object.entries(this.correcciones.tiposNodo)) {
      if (tipoLower.includes(incorrecto) || incorrecto.includes(tipoLower)) {
        return correcto;
      }
    }

    // Si ya tiene formato n8n-nodes-base, mantenerlo
    if (tipo.startsWith('n8n-nodes-base.')) {
      return tipo;
    }

    return tipo; // Devolver original si no hay corrección
  }

  // Corregir operación (MEJORADO)
  corregirOperacion(operacion) {
    if (!operacion || typeof operacion !== 'string') return operacion;
    
    const opLower = operacion.toLowerCase().trim();
    
    if (this.correcciones.operaciones[opLower]) {
      return this.correcciones.operaciones[opLower];
    }

    return operacion;
  }

  // NUEVO: Corregir nombre de nodo
  corregirNombreNodo(nombre) {
    if (!nombre || typeof nombre !== 'string') return nombre;
    
    // Eliminar caracteres problemáticos
    let nombreCorregido = nombre
      .replace(/[^\w\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, ' ') // Espacios múltiples a uno solo
      .trim();

    // Asegurar que no esté vacío
    if (!nombreCorregido) {
      nombreCorregido = 'Node';
    }

    return nombreCorregido;
  }

  // MEJORADO: Corregir conexiones
  corregirConexiones(conexiones) {
    if (!conexiones || typeof conexiones !== 'object') return conexiones;

    const conexionesCorregidas = {};

    for (const [nodoOrigen, salidas] of Object.entries(conexiones)) {
      const salidasCorregidas = {};

      for (const [tipoSalida, destinos] of Object.entries(salidas)) {
        // Corregir tipo de salida
        const tipoCorregido = this.correcciones.conexiones[tipoSalida.toLowerCase()] || tipoSalida;
        
        if (tipoCorregido !== tipoSalida) {
          console.log(`📝 Corrección conexión: "${tipoSalida}" → "${tipoCorregido}"`);
          this.estadisticas.conexionesCorregidas++;
          this.estadisticas.totalCorrecciones++;
        }

        salidasCorregidas[tipoCorregido] = destinos;
      }

      conexionesCorregidas[nodoOrigen] = salidasCorregidas;
    }

    return conexionesCorregidas;
  }

  // NUEVO: Resetear estadísticas
  resetearEstadisticas() {
    this.estadisticas = {
      tiposNodoCorregidos: 0,
      operacionesCorregidas: 0,
      conexionesCorregidas: 0,
      totalCorrecciones: 0
    };
  }

  // NUEVO: Log de estadísticas
  logEstadisticas() {
    if (this.estadisticas.totalCorrecciones > 0) {
      console.log('📊 Estadísticas de correcciones aplicadas:');
      console.log(`   🔧 Tipos de nodo: ${this.estadisticas.tiposNodoCorregidos}`);
      console.log(`   ⚙️ Operaciones: ${this.estadisticas.operacionesCorregidas}`);
      console.log(`   🔗 Conexiones: ${this.estadisticas.conexionesCorregidas}`);
      console.log(`   📈 Total: ${this.estadisticas.totalCorrecciones} correcciones`);
    } else {
      console.log('✨ No se necesitaron correcciones - Workflow ya optimizado');
    }
  }

  // Método para agregar correcciones personalizadas (MEJORADO)
  agregarCorreccion(categoria, incorrecto, correcto) {
    if (this.correcciones[categoria]) {
      this.correcciones[categoria][incorrecto.toLowerCase()] = correcto;
      console.log(`✅ Corrección agregada: ${categoria}["${incorrecto}"] → "${correcto}"`);
    } else {
      console.warn(`⚠️ Categoría "${categoria}" no existe`);
    }
  }

  // Obtener estadísticas de correcciones disponibles (MEJORADO)
  obtenerEstadisticasDisponibles() {
    return {
      tiposNodo: Object.keys(this.correcciones.tiposNodo).length,
      operaciones: Object.keys(this.correcciones.operaciones).length,
      conexiones: Object.keys(this.correcciones.conexiones).length,
      totalDisponibles: Object.keys(this.correcciones.tiposNodo).length + 
                       Object.keys(this.correcciones.operaciones).length + 
                       Object.keys(this.correcciones.conexiones).length
    };
  }

  // NUEVO: Validar workflow antes de corrección
  validarWorkflow(workflowData) {
    const problemas = [];
    const data = workflowData.workflow || workflowData;

    if (!data.nodes || !Array.isArray(data.nodes)) {
      problemas.push('Falta array de nodos');
    }

    if (!data.connections || typeof data.connections !== 'object') {
      problemas.push('Falta objeto de conexiones');
    }

    if (data.nodes) {
      data.nodes.forEach((nodo, index) => {
        if (!nodo.id) problemas.push(`Nodo ${index}: falta ID`);
        if (!nodo.name) problemas.push(`Nodo ${index}: falta nombre`);
        if (!nodo.type) problemas.push(`Nodo ${index}: falta tipo`);
      });
    }

    return {
      valido: problemas.length === 0,
      problemas
    };
  }
}

// Exportar la clase como default para ES6 modules
export default AutocorrectorFlujos;
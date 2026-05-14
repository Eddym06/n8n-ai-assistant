// Herramienta de Autocorrector de Flujos para n8n AI Assistant
// Sistema inteligente de corrección y optimización de workflows

class AutocorrectorFlujos {
  constructor() {
    this.correcciones = {
      // Correcciones de tipos de nodos comunes
      tiposNodo: {
        'http': 'n8n-nodes-base.httpRequest',
        'http request': 'n8n-nodes-base.httpRequest',
        'webhook': 'n8n-nodes-base.webhook',
        'cron': 'n8n-nodes-base.cron',
        'schedule': 'n8n-nodes-base.schedule',
        'email': 'n8n-nodes-base.emailSend',
        'gmail': 'n8n-nodes-base.gmail',
        'sheets': 'n8n-nodes-base.googleSheets',
        'google sheets': 'n8n-nodes-base.googleSheets',
        'excel': 'n8n-nodes-base.microsoftExcel',
        'slack': 'n8n-nodes-base.slack',
        'discord': 'n8n-nodes-base.discord',
        'telegram': 'n8n-nodes-base.telegram',
        'whatsapp': 'n8n-nodes-base.whatsApp',
        'if': 'n8n-nodes-base.if',
        'switch': 'n8n-nodes-base.switch',
        'code': 'n8n-nodes-base.code',
        'function': 'n8n-nodes-base.function',
        'set': 'n8n-nodes-base.set',
        'transform': 'n8n-nodes-base.transform'
      },
      
      // Correcciones de operaciones comunes
      operaciones: {
        'get': 'get',
        'create': 'create',
        'update': 'update',
        'delete': 'delete',
        'list': 'list',
        'send': 'send',
        'receive': 'receive',
        'execute': 'execute'
      }
    };
  }

  // Método principal para corregir un workflow
  corregirWorkflow(workflowData) {
    try {
      console.log('🔧 Autocorrector: Iniciando corrección del workflow...');
      
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

      console.log('✅ Autocorrector: Workflow corregido exitosamente');
      return actualWorkflowData;

    } catch (error) {
      console.error('❌ Error en Autocorrector:', error.message);
      // Devolver datos originales en caso de error
      return workflowData.workflow || workflowData;
    }
  }

  // Corregir un nodo individual
  corregirNodo(nodo) {
    if (!nodo || typeof nodo !== 'object') return nodo;

    // Corregir tipo de nodo
    if (nodo.type && typeof nodo.type === 'string') {
      const tipoCorregido = this.corregirTipoNodo(nodo.type);
      if (tipoCorregido !== nodo.type) {
        console.log(`📝 Corrección tipo nodo: "${nodo.type}" → "${tipoCorregido}"`);
        nodo.type = tipoCorregido;
      }
    }

    // Corregir operación si existe
    if (nodo.parameters && nodo.parameters.operation) {
      const operacionCorregida = this.corregirOperacion(nodo.parameters.operation);
      if (operacionCorregida !== nodo.parameters.operation) {
        console.log(`📝 Corrección operación: "${nodo.parameters.operation}" → "${operacionCorregida}"`);
        nodo.parameters.operation = operacionCorregida;
      }
    }

    return nodo;
  }

  // Corregir tipo de nodo usando el mapeo
  corregirTipoNodo(tipo) {
    if (!tipo || typeof tipo !== 'string') return tipo;
    
    const tipoLower = tipo.toLowerCase().trim();
    
    // Buscar coincidencia exacta primero
    if (this.correcciones.tiposNodo[tipoLower]) {
      return this.correcciones.tiposNodo[tipoLower];
    }

    // Buscar coincidencias parciales
    for (const [incorrecto, correcto] of Object.entries(this.correcciones.tiposNodo)) {
      if (tipoLower.includes(incorrecto)) {
        return correcto;
      }
    }

    return tipo; // Devolver original si no hay corrección
  }

  // Corregir operación
  corregirOperacion(operacion) {
    if (!operacion || typeof operacion !== 'string') return operacion;
    
    const opLower = operacion.toLowerCase().trim();
    
    if (this.correcciones.operaciones[opLower]) {
      return this.correcciones.operaciones[opLower];
    }

    return operacion;
  }

  // Corregir conexiones (método placeholder para futuras implementaciones)
  corregirConexiones(conexiones) {
    return conexiones;
  }

  // Método para agregar correcciones personalizadas
  agregarCorreccion(tipo, incorrecto, correcto) {
    if (this.correcciones[tipo]) {
      this.correcciones[tipo][incorrecto.toLowerCase()] = correcto;
    }
  }

  // Obtener estadísticas de correcciones
  obtenerEstadisticas() {
    return {
      tiposNodo: Object.keys(this.correcciones.tiposNodo).length,
      operaciones: Object.keys(this.correcciones.operaciones).length
    };
  }
}

// Exportar la clase como default para ES6 modules
export default AutocorrectorFlujos;
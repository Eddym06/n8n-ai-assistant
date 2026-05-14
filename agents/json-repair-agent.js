// JSON Repair Agent - Agente de Reparación Inteligente de JSON
// Sistema avanzado para reparar y recuperar workflows JSON corruptos

class JSONRepairAgent {
  constructor() {
    this.repairStrategies = {
      // Estrategias de reparación por tipo de error
      missingBrackets: this.repairMissingBrackets.bind(this),
      invalidCommas: this.repairInvalidCommas.bind(this),
      malformedStrings: this.repairMalformedStrings.bind(this),
      invalidKeys: this.repairInvalidKeys.bind(this),
      structuralErrors: this.repairStructuralErrors.bind(this),
      encodingIssues: this.repairEncodingIssues.bind(this)
    };

    this.backupStrategies = {
      incremental: this.incrementalBackup.bind(this),
      full: this.fullBackup.bind(this),
      differential: this.differentialBackup.bind(this)
    };

    this.recoveryPatterns = {
      // Patrones comunes de recuperación
      nodeRecovery: this.recoverNodes.bind(this),
      connectionRecovery: this.recoverConnections.bind(this),
      propertyRecovery: this.recoverProperties.bind(this),
      workflowStructure: this.recoverWorkflowStructure.bind(this)
    };
  }

  // Método principal para reparar JSON
  async repair(jsonString, options = {}) {
    try {
      console.log('🔧 JSON Repair Agent: Iniciando reparación...');

      if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('JSON string inválido proporcionado');
      }

      // Crear backup antes de reparar
      const backup = await this.createBackup(jsonString);

      // Detectar tipo de error
      const errorType = this.detectErrorType(jsonString);

      // Aplicar estrategia de reparación
      const repaired = await this.applyRepairStrategy(jsonString, errorType, options);

      // Validar reparación
      const validation = this.validateRepair(repaired);

      if (!validation.isValid) {
        // Intentar recuperación avanzada
        const recovered = await this.attemptAdvancedRecovery(repaired, backup);
        return {
          success: recovered.success,
          data: recovered.data,
          originalError: errorType,
          repairMethod: 'advanced_recovery',
          confidence: recovered.confidence,
          backup: backup
        };
      }

      return {
        success: true,
        data: repaired,
        originalError: errorType,
        repairMethod: 'standard',
        confidence: validation.confidence,
        backup: backup
      };

    } catch (error) {
      console.error('❌ Error en JSON Repair Agent:', error);
      return {
        success: false,
        error: error.message,
        data: jsonString,
        repairMethod: 'failed'
      };
    }
  }

  // Detectar tipo de error en el JSON
  detectErrorType(jsonString) {
    try {
      JSON.parse(jsonString);
      return 'none'; // No hay error
    } catch (error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('unexpected end') || errorMessage.includes('bracket')) {
        return 'missingBrackets';
      }
      if (errorMessage.includes('comma') || errorMessage.includes('trailing comma')) {
        return 'invalidCommas';
      }
      if (errorMessage.includes('string') || errorMessage.includes('quote')) {
        return 'malformedStrings';
      }
      if (errorMessage.includes('key') || errorMessage.includes('property')) {
        return 'invalidKeys';
      }
      if (errorMessage.includes('unexpected token') || errorMessage.includes('syntax')) {
        return 'structuralErrors';
      }
      if (errorMessage.includes('utf') || errorMessage.includes('encoding')) {
        return 'encodingIssues';
      }

      return 'unknown';
    }
  }

  // Aplicar estrategia de reparación
  async applyRepairStrategy(jsonString, errorType, options) {
    const strategy = this.repairStrategies[errorType];

    if (!strategy) {
      throw new Error(`No hay estrategia de reparación para el error: ${errorType}`);
    }

    return await strategy(jsonString, options);
  }

  // Reparar brackets faltantes
  async repairMissingBrackets(jsonString, options) {
    let repaired = jsonString.trim();

    // Contar brackets de apertura y cierre
    const openBrackets = (repaired.match(/\{/g) || []).length;
    const closeBrackets = (repaired.match(/\}/g) || []).length;
    const openArrays = (repaired.match(/\[/g) || []).length;
    const closeArrays = (repaired.match(/\]/g) || []).length;

    // Agregar brackets faltantes al final
    if (openBrackets > closeBrackets) {
      repaired += '}'.repeat(openBrackets - closeBrackets);
    }

    if (openArrays > closeArrays) {
      repaired += ']'.repeat(openArrays - closeArrays);
    }

    // Agregar brackets faltantes al inicio
    if (closeBrackets > openBrackets) {
      repaired = '{'.repeat(closeBrackets - openBrackets) + repaired;
    }

    if (closeArrays > openArrays) {
      repaired = '['.repeat(closeArrays - openArrays) + repaired;
    }

    return repaired;
  }

  // Reparar comas inválidas
  async repairInvalidCommas(jsonString, options) {
    let repaired = jsonString;

    // Remover comas finales antes de brackets de cierre
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

    // Agregar comas faltantes entre elementos
    repaired = repaired.replace(/}(\s*){/g, '},$1{');
    repaired = repaired.replace(/](\s*)\[/g, '],$1[');

    return repaired;
  }

  // Reparar strings malformadas
  async repairMalformedStrings(jsonString, options) {
    let repaired = jsonString;

    // Escapar comillas simples dentro de strings
    repaired = repaired.replace(/'([^']*)'/g, '"$1"');

    // Reparar comillas no escapadas
    repaired = repaired.replace(/([^\\])"/g, '$1\\"');

    // Reparar caracteres de control
    repaired = repaired.replace(/\n/g, '\\n');
    repaired = repaired.replace(/\r/g, '\\r');
    repaired = repaired.replace(/\t/g, '\\t');

    return repaired;
  }

  // Reparar keys inválidas
  async repairInvalidKeys(jsonString, options) {
    let repaired = jsonString;

    // Agregar comillas a keys sin comillas
    repaired = repaired.replace(/(\w+)(?=\s*:)/g, '"$1"');

    // Reparar keys con caracteres especiales
    repaired = repaired.replace(/([^"]\w+[^"])(?=\s*:)/g, '"$1"');

    return repaired;
  }

  // Reparar errores estructurales
  async repairStructuralErrors(jsonString, options) {
    let repaired = jsonString;

    // Intentar múltiples estrategias
    repaired = await this.repairMissingBrackets(repaired, options);
    repaired = await this.repairInvalidCommas(repaired, options);
    repaired = await this.repairMalformedStrings(repaired, options);
    repaired = await this.repairInvalidKeys(repaired, options);

    return repaired;
  }

  // Reparar problemas de encoding
  async repairEncodingIssues(jsonString, options) {
    let repaired = jsonString;

    // Reparar caracteres UTF-8 malformados
    repaired = repaired.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    // Reparar BOM (Byte Order Mark)
    repaired = repaired.replace(/^\uFEFF/, '');

    return repaired;
  }

  // Crear backup del JSON original
  async createBackup(jsonString) {
    return {
      original: jsonString,
      timestamp: new Date().toISOString(),
      hash: this.generateHash(jsonString),
      size: jsonString.length
    };
  }

  // Generar hash simple para comparación
  generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32 bits
    }
    return hash.toString(36);
  }

  // Validar reparación
  validateRepair(repairedJson) {
    try {
      const parsed = JSON.parse(repairedJson);

      // Validaciones adicionales para workflows n8n
      if (this.isWorkflowJson(parsed)) {
        return {
          isValid: true,
          confidence: 0.95,
          type: 'workflow',
          structure: this.analyzeWorkflowStructure(parsed)
        };
      }

      return {
        isValid: true,
        confidence: 0.8,
        type: 'generic'
      };

    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        error: error.message
      };
    }
  }

  // Verificar si es un workflow JSON de n8n
  isWorkflowJson(obj) {
    return obj &&
           typeof obj === 'object' &&
           (obj.nodes || obj.connections || obj.name);
  }

  // Analizar estructura del workflow
  analyzeWorkflowStructure(workflow) {
    const analysis = {
      hasNodes: !!(workflow.nodes && Array.isArray(workflow.nodes)),
      hasConnections: !!(workflow.connections && typeof workflow.connections === 'object'),
      nodeCount: workflow.nodes ? workflow.nodes.length : 0,
      connectionCount: workflow.connections ? Object.keys(workflow.connections).length : 0,
      hasName: !!workflow.name
    };

    return analysis;
  }

  // Intentar recuperación avanzada
  async attemptAdvancedRecovery(repaired, backup) {
    try {
      // Usar patrones de recuperación
      const recovered = await this.applyRecoveryPatterns(repaired);

      if (recovered) {
        return {
          success: true,
          data: recovered,
          confidence: 0.7,
          method: 'pattern_recovery'
        };
      }

      return {
        success: false,
        data: backup.original,
        confidence: 0,
        method: 'recovery_failed'
      };

    } catch (error) {
      return {
        success: false,
        data: backup.original,
        confidence: 0,
        method: 'recovery_error',
        error: error.message
      };
    }
  }

  // Aplicar patrones de recuperación
  async applyRecoveryPatterns(jsonString) {
    // Implementar lógica de recuperación basada en patrones
    // Esta es una versión simplificada
    return jsonString;
  }

  // Recuperar nodos
  async recoverNodes(workflow) {
    // Lógica para recuperar nodos faltantes
    return workflow;
  }

  // Recuperar conexiones
  async recoverConnections(workflow) {
    // Lógica para recuperar conexiones faltantes
    return workflow;
  }

  // Recuperar propiedades
  async recoverProperties(workflow) {
    // Lógica para recuperar propiedades faltantes
    return workflow;
  }

  // Recuperar estructura del workflow
  async recoverWorkflowStructure(workflow) {
    // Lógica para recuperar estructura general
    return workflow;
  }

  // Métodos de backup
  async incrementalBackup(data) {
    // Implementar backup incremental
    return data;
  }

  async fullBackup(data) {
    // Implementar backup completo
    return data;
  }

  async differentialBackup(data) {
    // Implementar backup diferencial
    return data;
  }

  // Método público para reparación rápida
  async quickRepair(jsonString) {
    return await this.repair(jsonString, { method: 'quick' });
  }

  // Método público para reparación profunda
  async deepRepair(jsonString) {
    return await this.repair(jsonString, { method: 'deep' });
  }

  // Método para verificar integridad
  async verifyIntegrity(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const analysis = this.analyzeWorkflowStructure(parsed);

      return {
        isValid: true,
        analysis: analysis,
        checksum: this.generateHash(jsonString)
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }
}

// Exportar la clase
export default JSONRepairAgent;

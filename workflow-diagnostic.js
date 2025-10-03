/**
 * 🔍 DIAGNOSTICADOR DE WORKFLOWS PARA n8n
 * Detecta problemas que pueden causar errores como "propertyValues[itemName] no es iterable"
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkflowDiagnostic {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
  }

  /**
   * 🔧 DIAGNÓSTICO PRINCIPAL
   */
  diagnoseWorkflow(workflowPath) {
    console.log(`🔍 Diagnosticando workflow: ${workflowPath}`);
    
    try {
      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
      
      // Resetear contadores
      this.errors = [];
      this.warnings = [];
      this.fixes = [];
      
      // Ejecutar todas las validaciones
      this.validateBasicStructure(workflow);
      this.validateNodeParameters(workflow);
      this.validateNodeTypes(workflow);
      this.validateConnections(workflow);
      this.validateFunctionNodes(workflow);
      this.validateIfNodes(workflow);
      this.validateEmailNodes(workflow);
      this.validateSlackNodes(workflow);
      this.validateHubSpotNodes(workflow);
      
      // Reporte final
      this.generateReport();
      
      // Aplicar correcciones automáticas si es posible
      if (this.fixes.length > 0) {
        const fixedWorkflow = this.applyAutomaticFixes(workflow);
        return { workflow: fixedWorkflow, errors: this.errors, warnings: this.warnings };
      }
      
      return { workflow, errors: this.errors, warnings: this.warnings };
      
    } catch (error) {
      console.error(`❌ Error al diagnosticar workflow: ${error.message}`);
      this.errors.push(`Error de parsing JSON: ${error.message}`);
      return { workflow: null, errors: this.errors, warnings: this.warnings };
    }
  }

  /**
   * 🏗️ VALIDAR ESTRUCTURA BÁSICA
   */
  validateBasicStructure(workflow) {
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      this.errors.push("❌ CRÍTICO: Falta array 'nodes' o no es válido");
      return;
    }

    if (!workflow.connections || typeof workflow.connections !== 'object') {
      this.errors.push("❌ CRÍTICO: Falta objeto 'connections' o no es válido");
      return;
    }

    console.log(`✅ Estructura básica válida: ${workflow.nodes.length} nodos`);
  }

  /**
   * ⚙️ VALIDAR PARÁMETROS DE NODOS
   */
  validateNodeParameters(workflow) {
    workflow.nodes.forEach((node, index) => {
      // Validar propiedades obligatorias
      if (!node.id) {
        this.errors.push(`❌ Nodo ${index}: Falta 'id'`);
      }
      if (!node.name) {
        this.errors.push(`❌ Nodo ${index}: Falta 'name'`);
      }
      if (!node.type) {
        this.errors.push(`❌ Nodo ${index}: Falta 'type'`);
      }
      if (!node.typeVersion) {
        this.warnings.push(`⚠️ Nodo ${node.name}: Falta 'typeVersion'`);
        this.fixes.push({ node: node.name, fix: 'add_typeVersion', value: 1 });
      }

      // Validar posición
      if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
        this.warnings.push(`⚠️ Nodo ${node.name}: Posición inválida`);
        this.fixes.push({ node: node.name, fix: 'fix_position', value: [100, 100] });
      }

      // Validar parámetros específicos
      if (node.parameters) {
        this.validateParameterStructure(node);
      }
    });
  }

  /**
   * 📝 VALIDAR ESTRUCTURA DE PARÁMETROS
   */
  validateParameterStructure(node) {
    const params = node.parameters;
    
    // Detectar parámetros que pueden causar el error "propertyValues[itemName] no es iterable"
    for (const [key, value] of Object.entries(params)) {
      if (value && typeof value === 'object') {
        // Verificar arrays mal formados
        if (value.hasOwnProperty('length') && !Array.isArray(value)) {
          this.errors.push(`❌ Nodo ${node.name}: Parámetro '${key}' parece array pero no lo es`);
          this.fixes.push({ node: node.name, fix: 'convert_to_array', param: key, value });
        }
        
        // Verificar objetos con propiedades indefinidas
        if (Object.values(value).some(v => v === undefined)) {
          this.warnings.push(`⚠️ Nodo ${node.name}: Parámetro '${key}' contiene valores undefined`);
          this.fixes.push({ node: node.name, fix: 'remove_undefined', param: key });
        }
      }
      
      // Verificar strings vacíos en lugares donde no deberían estar
      if (value === "" && this.isRequiredParameter(node.type, key)) {
        this.warnings.push(`⚠️ Nodo ${node.name}: Parámetro requerido '${key}' está vacío`);
      }
    }
  }

  /**
   * 🔧 VALIDAR NODOS FUNCTION
   */
  validateFunctionNodes(workflow) {
    const functionNodes = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.function');
    
    functionNodes.forEach(node => {
      const params = node.parameters || {};
      
      // Verificar que tenga código JavaScript
      if (!params.functionCode && !params.jsCode) {
        this.errors.push(`❌ Function node ${node.name}: Falta código JavaScript`);
        this.fixes.push({ 
          node: node.name, 
          fix: 'add_default_code', 
          value: 'return items;' 
        });
      }
      
      // Verificar duplicación de código
      if (params.functionCode && params.jsCode && params.functionCode === params.jsCode) {
        this.warnings.push(`⚠️ Function node ${node.name}: Código duplicado en functionCode y jsCode`);
        this.fixes.push({ node: node.name, fix: 'remove_duplicate_code' });
      }
      
      // Verificar sintaxis básica del JavaScript
      const code = params.functionCode || params.jsCode || '';
      if (code && !this.validateJavaScriptSyntax(code)) {
        this.errors.push(`❌ Function node ${node.name}: Sintaxis JavaScript inválida`);
      }
    });
  }

  /**
   * 🔀 VALIDAR NODOS IF
   */
  validateIfNodes(workflow) {
    const ifNodes = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.if');
    
    ifNodes.forEach(node => {
      const params = node.parameters || {};
      
      // Verificar que tenga condiciones
      if (!params.conditions) {
        this.errors.push(`❌ IF node ${node.name}: Falta objeto 'conditions'`);
        this.fixes.push({ 
          node: node.name, 
          fix: 'add_default_condition',
          value: {
            options: { caseSensitive: false, leftValue: "", typeValidation: "strict" },
            conditions: [{ leftValue: "={{$json.value}}", rightValue: true, operator: { type: "boolean", operation: "equal" } }],
            combinator: "and"
          }
        });
      } else {
        // Verificar estructura de condiciones
        if (!params.conditions.conditions || !Array.isArray(params.conditions.conditions)) {
          this.errors.push(`❌ IF node ${node.name}: Array 'conditions.conditions' inválido`);
        }
        
        if (params.conditions.conditions && params.conditions.conditions.length === 0) {
          this.warnings.push(`⚠️ IF node ${node.name}: No tiene condiciones definidas`);
        }
      }
    });
  }

  /**
   * 📧 VALIDAR NODOS EMAIL
   */
  validateEmailNodes(workflow) {
    const emailNodes = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.emailSend');
    
    emailNodes.forEach(node => {
      const params = node.parameters || {};
      
      // Verificar campos obligatorios
      if (!params.subject) {
        this.warnings.push(`⚠️ Email node ${node.name}: Falta 'subject'`);
      }
      
      if (!params.recipients && !params.toEmail) {
        this.warnings.push(`⚠️ Email node ${node.name}: Falta destinatario`);
      }
      
      // Verificar estructura de recipients
      if (params.recipients && typeof params.recipients === 'object') {
        if (params.recipients.to && !Array.isArray(params.recipients.to)) {
          this.errors.push(`❌ Email node ${node.name}: 'recipients.to' debe ser array`);
          this.fixes.push({ node: node.name, fix: 'fix_recipients_array' });
        }
      }
    });
  }

  /**
   * 💬 VALIDAR NODOS SLACK
   */
  validateSlackNodes(workflow) {
    const slackNodes = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.slack');
    
    slackNodes.forEach(node => {
      const params = node.parameters || {};
      
      if (!params.channel && !params.channelId) {
        this.warnings.push(`⚠️ Slack node ${node.name}: Falta canal de Slack`);
      }
      
      if (!params.text && !params.message) {
        this.warnings.push(`⚠️ Slack node ${node.name}: Falta mensaje`);
      }
    });
  }

  /**
   * 🔗 VALIDAR CONEXIONES
   */
  validateConnections(workflow) {
    const nodeNames = workflow.nodes.map(n => n.name);
    
    for (const [sourceName, connections] of Object.entries(workflow.connections)) {
      // Verificar que el nodo fuente existe
      if (!nodeNames.includes(sourceName)) {
        this.errors.push(`❌ Conexión desde nodo inexistente: '${sourceName}'`);
        continue;
      }
      
      // Verificar estructura de conexiones
      if (!connections.main || !Array.isArray(connections.main)) {
        this.errors.push(`❌ Nodo ${sourceName}: Estructura de conexiones inválida`);
        continue;
      }
      
      // Verificar cada conexión
      connections.main.forEach((connectionGroup, groupIndex) => {
        if (!Array.isArray(connectionGroup)) {
          this.errors.push(`❌ Nodo ${sourceName}: Grupo de conexiones ${groupIndex} no es array`);
          return;
        }
        
        connectionGroup.forEach((connection, connIndex) => {
          if (!connection.node) {
            this.errors.push(`❌ Nodo ${sourceName}: Conexión ${groupIndex}.${connIndex} sin nodo destino`);
          } else if (!nodeNames.includes(connection.node)) {
            this.errors.push(`❌ Conexión hacia nodo inexistente: '${connection.node}'`);
          }
          
          if (!connection.type) {
            this.warnings.push(`⚠️ Nodo ${sourceName}: Conexión sin tipo especificado`);
          }
          
          if (connection.index === undefined) {
            this.warnings.push(`⚠️ Nodo ${sourceName}: Conexión sin índice especificado`);
          }
        });
      });
    }
  }

  /**
   * ✅ VALIDAR SINTAXIS JAVASCRIPT
   */
  validateJavaScriptSyntax(code) {
    try {
      new Function(code);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * ❓ VERIFICAR SI PARÁMETRO ES REQUERIDO
   */
  isRequiredParameter(nodeType, paramName) {
    const requiredParams = {
      'n8n-nodes-base.webhook': ['path'],
      'n8n-nodes-base.emailSend': ['subject'],
      'n8n-nodes-base.slack': ['channel'],
      'n8n-nodes-base.if': ['conditions']
    };
    
    return requiredParams[nodeType]?.includes(paramName) || false;
  }

  /**
   * 📊 GENERAR REPORTE
   */
  generateReport() {
    console.log('\n📊 REPORTE DE DIAGNÓSTICO:');
    console.log(`❌ Errores críticos: ${this.errors.length}`);
    console.log(`⚠️ Advertencias: ${this.warnings.length}`);
    console.log(`🔧 Correcciones automáticas disponibles: ${this.fixes.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORES CRÍTICOS:');
      this.errors.forEach(error => console.log(`   ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ ADVERTENCIAS:');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }
  }

  /**
   * 🔧 APLICAR CORRECCIONES AUTOMÁTICAS
   */
  applyAutomaticFixes(workflow) {
    console.log('\n🔧 Aplicando correcciones automáticas...');
    
    this.fixes.forEach(fix => {
      const node = workflow.nodes.find(n => n.name === fix.node);
      if (!node) return;
      
      switch (fix.fix) {
        case 'add_typeVersion':
          node.typeVersion = fix.value;
          console.log(`✅ Agregado typeVersion a ${fix.node}`);
          break;
          
        case 'fix_position':
          node.position = fix.value;
          console.log(`✅ Corregida posición de ${fix.node}`);
          break;
          
        case 'add_default_code':
          node.parameters = node.parameters || {};
          node.parameters.functionCode = fix.value;
          console.log(`✅ Agregado código por defecto a ${fix.node}`);
          break;
          
        case 'remove_duplicate_code':
          if (node.parameters.jsCode) {
            delete node.parameters.jsCode;
            console.log(`✅ Removido código duplicado de ${fix.node}`);
          }
          break;
          
        case 'add_default_condition':
          node.parameters = node.parameters || {};
          node.parameters.conditions = fix.value;
          console.log(`✅ Agregada condición por defecto a ${fix.node}`);
          break;
          
        case 'fix_recipients_array':
          if (node.parameters.recipients && node.parameters.recipients.to) {
            node.parameters.recipients.to = Array.isArray(node.parameters.recipients.to) 
              ? node.parameters.recipients.to 
              : [node.parameters.recipients.to];
            console.log(`✅ Corregido array recipients en ${fix.node}`);
          }
          break;
      }
    });
    
    return workflow;
  }
}

// 🚀 FUNCIÓN PRINCIPAL DE DIAGNÓSTICO
async function diagnoseWorkflowFile(filePath) {
  const diagnostic = new WorkflowDiagnostic();
  const result = diagnostic.diagnoseWorkflow(filePath);
  
  if (result.errors.length === 0) {
    console.log('\n✅ Workflow válido para importación en n8n');
  } else {
    console.log('\n❌ Workflow tiene problemas que pueden causar errores de importación');
  }
  
  return result;
}

// Exportar para uso como módulo
export { WorkflowDiagnostic, diagnoseWorkflowFile };

// Permitir uso directo desde línea de comandos
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log('Uso: node workflow-diagnostic.js <path-to-workflow.json>');
    process.exit(1);
  }
  
  diagnoseWorkflowFile(filePath).then(result => {
    if (result.errors.length > 0) {
      process.exit(1);
    }
  });
}
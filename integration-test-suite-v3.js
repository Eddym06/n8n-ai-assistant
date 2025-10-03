/**
 * INTEGRATION TEST SUITE V3.0+ - Sistema de Pruebas Completo
 * Suite de pruebas para validar el funcionamiento de todos los módulos integrados
 * 
 * Pruebas incluidas:
 * - Sistema de Continuación V3.0
 * - Autocorrector V4.0  
 * - Validador Inteligente V5.0
 * - Optimizador de Layout V3.0
 * - Pipeline completo integrado
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Importar módulos a probar
import { WorkflowContinuationSystem } from './workflow-continuation-system-v3.js';
import { WorkflowAutocorrector } from './workflow-autocorrector-v4.js';
import { IntelligentWorkflowValidator } from './intelligent-workflow-validator-v5.js';
import { LayoutOptimizer } from './layout-optimizer-v3.js';

dotenv.config();

// DATOS DE PRUEBA
const TEST_WORKFLOWS = {
  simple: {
    nodes: [
      {
        id: "1",
        name: "Manual Trigger",
        type: "n8n-nodes-base.manualTrigger",
        position: [0, 0],
        parameters: {},
        typeVersion: 1
      },
      {
        id: "2", 
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        position: [200, 0],
        parameters: {
          url: "https://api.example.com/data",
          requestMethod: "GET"
        },
        typeVersion: 1
      }
    ],
    connections: {
      "Manual Trigger": {
        main: [
          [
            {
              node: "HTTP Request",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    }
  },

  withErrors: {
    nodes: [
      {
        id: "1",
        name: "Manual Trigger",
        type: "n8n-nodes-base.manualTrigger",
        position: [0, 0],
        parameters: {},
        typeVersion: 1
      },
      {
        id: "2",
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest", 
        position: [200, 0],
        parameters: {
          // URL faltante - error crítico
          requestMethod: "GET"
        },
        typeVersion: 1
      },
      {
        id: "3",
        name: "Orphaned Node",
        type: "n8n-nodes-base.set",
        position: [400, 200],
        parameters: {},
        typeVersion: 1
      }
    ],
    connections: {
      "Manual Trigger": {
        main: [
          [
            {
              node: "HTTP Request",
              type: "main", 
              index: 0
            }
          ]
        ]
      }
      // Orphaned Node no tiene conexiones - error
    }
  },

  aiWorkflow: {
    nodes: [
      {
        id: "1",
        name: "Manual Trigger",
        type: "n8n-nodes-base.manualTrigger",
        position: [0, 0],
        parameters: {},
        typeVersion: 1
      },
      {
        id: "2",
        name: "OpenAI Chat",
        type: "@n8n/n8n-nodes-langchain.lmChatOpenAi",
        position: [200, 0],
        parameters: {
          modelName: "gpt-3.5-turbo",
          temperature: 0.7
        },
        typeVersion: 1
      },
      {
        id: "3",
        name: "Memory Buffer",
        type: "@n8n/n8n-nodes-langchain.memoryBufferWindow",
        position: [400, 0],
        parameters: {
          maxTokenLimit: 2000
        },
        typeVersion: 1
      }
    ],
    connections: {
      "Manual Trigger": {
        main: [
          [
            {
              node: "OpenAI Chat",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "OpenAI Chat": {
        main: [
          [
            {
              node: "Memory Buffer",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    }
  }
};

const TEST_PROMPTS = {
  simple: "Crear un workflow básico que obtenga datos de una API",
  complex: "Crear un sistema completo de procesamiento de emails con IA que analice sentimientos, extraiga información clave, genere respuestas automáticas personalizadas y envíe notificaciones a Slack",
  ecommerce: "Crear un workflow de e-commerce que procese pedidos, actualice inventario, envíe confirmaciones por email, genere facturas PDF y sincronice con sistemas contables"
};

class IntegrationTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    
    // Inicializar módulos con configuración de prueba
    this.continuationSystem = new WorkflowContinuationSystem({
      geminiApiKey: process.env.GEMINI_API_KEY,
      debugMode: false // Silenciar logs en pruebas
    });
    
    this.autocorrector = new WorkflowAutocorrector({
      geminiApiKey: process.env.GEMINI_API_KEY,
      enableLangChainSupport: true,
      debugMode: false
    });
    
    this.validator = new IntelligentWorkflowValidator({
      enableAIValidation: true,
      enablePerformanceCheck: true,
      enableSecurityCheck: true
    });
    
    this.layoutOptimizer = new LayoutOptimizer({
      debugMode: false,
      enableAIOptimization: true,
      layoutStyle: 'STANDARD'
    });
    
    console.log('🧪 Integration Test Suite V3.0+ inicializado');
  }

  /**
   * Ejecutar todas las pruebas
   */
  async runAllTests() {
    console.log('\n🚀 INICIANDO SUITE DE PRUEBAS INTEGRADAS V3.0+');
    console.log('=' * 60);
    
    const startTime = Date.now();
    
    try {
      // Pruebas individuales de módulos
      await this.testWorkflowContinuation();
      await this.testWorkflowAutocorrector();
      await this.testWorkflowValidator();
      await this.testLayoutOptimizer();
      
      // Pruebas de integración
      await this.testCompleteWorkflowPipeline();
      await this.testEdgeCases();
      await this.testPerformance();
      
      // Generar reporte final
      const totalTime = Date.now() - startTime;
      this.generateFinalReport(totalTime);
      
    } catch (error) {
      console.error('❌ Error crítico en suite de pruebas:', error);
    }
  }

  /**
   * Pruebas del Sistema de Continuación V3.0
   */
  async testWorkflowContinuation() {
    console.log('\n📋 Probando Sistema de Continuación V3.0...');
    
    // Test 1: Análisis de completitud
    await this.runTest('Continuation - Análisis de completitud', async () => {
      const analysis = await this.continuationSystem.analyzeWorkflowCompleteness(
        TEST_WORKFLOWS.simple, 
        TEST_PROMPTS.complex
      );
      
      this.assert(analysis !== null, 'Análisis no debe ser null');
      this.assert(typeof analysis.needsContinuation === 'boolean', 'needsContinuation debe ser boolean');
      this.assert(analysis.completenessScore >= 0 && analysis.completenessScore <= 100, 'Score debe estar entre 0-100');
    });

    // Test 2: Continuación de workflow
    await this.runTest('Continuation - Extensión de workflow', async () => {
      const result = await this.continuationSystem.continueWorkflow(
        TEST_WORKFLOWS.simple,
        TEST_PROMPTS.complex,
        { maxPhases: 2 }
      );
      
      this.assert(result.success === true, 'Continuación debe ser exitosa');
      this.assert(result.extendedWorkflow.nodes.length > TEST_WORKFLOWS.simple.nodes.length, 'Debe añadir nodos');
      this.assert(result.phases >= 1, 'Debe ejecutar al menos una fase');
    });

    // Test 3: Estrategias de extensión
    await this.runTest('Continuation - Estrategias múltiples', async () => {
      const strategies = ['conservative', 'adaptive', 'aggressive'];
      
      for (const strategy of strategies) {
        const result = await this.continuationSystem.continueWorkflow(
          TEST_WORKFLOWS.simple,
          TEST_PROMPTS.simple,
          { extensionStrategy: strategy, maxPhases: 1 }
        );
        
        this.assert(result.success === true, `Estrategia ${strategy} debe funcionar`);
        this.assert(result.extensionStrategy === strategy, `Debe usar estrategia ${strategy}`);
      }
    });
  }

  /**
   * Pruebas del Autocorrector V4.0
   */
  async testWorkflowAutocorrector() {
    console.log('\n🔧 Probando Autocorrector V4.0...');
    
    // Test 1: Detección de errores
    await this.runTest('Autocorrector - Detección de errores', async () => {
      const analysis = await this.autocorrector.analyzeWorkflow(TEST_WORKFLOWS.withErrors);
      
      this.assert(analysis.errors.length > 0, 'Debe detectar errores');
      this.assert(analysis.hasStructuralErrors === true, 'Debe detectar errores estructurales');
      this.assert(analysis.severity === 'high', 'Debe clasificar severidad correctamente');
    });

    // Test 2: Corrección automática
    await this.runTest('Autocorrector - Corrección automática', async () => {
      const result = await this.autocorrector.correctWorkflow(
        TEST_WORKFLOWS.withErrors,
        TEST_PROMPTS.simple
      );
      
      this.assert(result.success === true, 'Corrección debe ser exitosa');
      this.assert(result.correctionsApplied > 0, 'Debe aplicar correcciones');
      this.assert(result.correctedWorkflow.nodes.length >= TEST_WORKFLOWS.withErrors.nodes.length, 'No debe perder nodos');
    });

    // Test 3: Soporte LangChain
    await this.runTest('Autocorrector - Soporte LangChain', async () => {
      const result = await this.autocorrector.correctWorkflow(
        TEST_WORKFLOWS.aiWorkflow,
        "Workflow de IA con LangChain"
      );
      
      this.assert(result.success === true, 'Debe manejar workflows de IA');
      this.assert(result.correctionTypes.includes('langchain_optimization') || result.correctionsApplied === 0, 'Debe reconocer nodos LangChain');
    });
  }

  /**
   * Pruebas del Validador Inteligente V5.0
   */
  async testWorkflowValidator() {
    console.log('\n✅ Probando Validador Inteligente V5.0...');
    
    // Test 1: Validación estructural
    await this.runTest('Validator - Validación estructural', async () => {
      const result = await this.validator.validateWorkflow(
        TEST_WORKFLOWS.simple,
        TEST_PROMPTS.simple
      );
      
      this.assert(result.isValid !== undefined, 'Debe retornar isValid');
      this.assert(result.score >= 0 && result.score <= 100, 'Score debe estar entre 0-100');
      this.assert(Array.isArray(result.criticalErrors), 'criticalErrors debe ser array');
      this.assert(Array.isArray(result.warnings), 'warnings debe ser array');
    });

    // Test 2: Detección de errores críticos
    await this.runTest('Validator - Detección de errores críticos', async () => {
      const result = await this.validator.validateWorkflow(
        TEST_WORKFLOWS.withErrors,
        TEST_PROMPTS.simple
      );
      
      this.assert(result.isValid === false, 'Workflow con errores debe ser inválido');
      this.assert(result.criticalErrors.length > 0, 'Debe detectar errores críticos');
      this.assert(result.score < 50, 'Score debe ser bajo para workflow con errores');
    });

    // Test 3: Validación específica de IA
    await this.runTest('Validator - Validación específica de IA', async () => {
      const result = await this.validator.validateWorkflow(
        TEST_WORKFLOWS.aiWorkflow,
        "Workflow de IA"
      );
      
      this.assert(result.analysisDetails.aiSpecific !== undefined, 'Debe incluir análisis de IA');
      this.assert(result.analysisDetails.aiSpecific.hasAINodes === true, 'Debe detectar nodos de IA');
    });

    // Test 4: Sugerencias de optimización
    await this.runTest('Validator - Sugerencias de optimización', async () => {
      const result = await this.validator.validateWorkflow(
        TEST_WORKFLOWS.simple,
        TEST_PROMPTS.complex
      );
      
      this.assert(Array.isArray(result.suggestions), 'suggestions debe ser array');
      this.assert(Array.isArray(result.optimizations), 'optimizations debe ser array');
    });
  }

  /**
   * Pruebas del Layout Optimizer V3.0
   */
  async testLayoutOptimizer() {
    console.log('\n🎯 Probando Layout Optimizer V3.0...');
    
    // Test 1: Optimización básica
    await this.runTest('Layout - Optimización básica', async () => {
      const result = await this.layoutOptimizer.optimizeLayout(TEST_WORKFLOWS.simple);
      
      this.assert(result.success === true, 'Optimización debe ser exitosa');
      this.assert(result.workflow.nodes.length === TEST_WORKFLOWS.simple.nodes.length, 'No debe perder nodos');
      this.assert(result.metrics.totalNodes > 0, 'Debe reportar métricas');
    });

    // Test 2: Clustering automático
    await this.runTest('Layout - Clustering automático', async () => {
      const result = await this.layoutOptimizer.optimizeLayout(
        TEST_WORKFLOWS.aiWorkflow,
        null, // Sin clústers explícitos
        { enableAutoClustering: true }
      );
      
      this.assert(result.success === true, 'Debe generar clústers automáticamente');
      this.assert(result.metrics.swimlanesCreated >= 1, 'Debe crear al menos un swimlane');
    });

    // Test 3: Diferentes estilos de layout
    await this.runTest('Layout - Estilos múltiples', async () => {
      const styles = ['MINIMAL', 'STANDARD', 'SPACIOUS', 'AI_OPTIMIZED'];
      
      for (const style of styles) {
        const optimizer = new LayoutOptimizer({ layoutStyle: style, debugMode: false });
        const result = await optimizer.optimizeLayout(TEST_WORKFLOWS.simple);
        
        this.assert(result.success === true, `Estilo ${style} debe funcionar`);
        this.assert(result.workflow.nodes.every(n => n.position && n.position.length === 2), 'Todos los nodos deben tener posición válida');
      }
    });
  }

  /**
   * Pruebas del pipeline completo integrado
   */
  async testCompleteWorkflowPipeline() {
    console.log('\n🔄 Probando Pipeline Completo Integrado...');
    
    // Test 1: Pipeline de procesamiento completo
    await this.runTest('Pipeline - Procesamiento completo', async () => {
      // Simular método processWorkflowComplete
      let workflow = { ...TEST_WORKFLOWS.withErrors };
      
      // 1. Validación inicial
      const validation = await this.validator.validateWorkflow(workflow, TEST_PROMPTS.simple);
      this.assert(validation.isValid === false, 'Debe detectar errores iniciales');
      
      // 2. Autocorrección
      const correction = await this.autocorrector.correctWorkflow(workflow, TEST_PROMPTS.simple);
      if (correction.success) {
        workflow = correction.correctedWorkflow;
      }
      
      // 3. Optimización de layout
      const layoutResult = await this.layoutOptimizer.optimizeLayout(workflow);
      if (layoutResult.success) {
        workflow = layoutResult.workflow;
      }
      
      // 4. Validación final
      const finalValidation = await this.validator.validateWorkflow(workflow, TEST_PROMPTS.simple);
      
      this.assert(finalValidation.score > validation.score, 'Score debe mejorar después del pipeline');
      this.assert(finalValidation.criticalErrors.length <= validation.criticalErrors.length, 'Errores críticos deben reducirse o mantenerse');
    });

    // Test 2: Pipeline con workflow de IA
    await this.runTest('Pipeline - Workflow de IA completo', async () => {
      let workflow = { ...TEST_WORKFLOWS.aiWorkflow };
      
      // Continuación
      const continuation = await this.continuationSystem.continueWorkflow(workflow, TEST_PROMPTS.complex);
      if (continuation.success) {
        workflow = continuation.extendedWorkflow;
      }
      
      // Validación con características de IA
      const validation = await this.validator.validateWorkflow(workflow, TEST_PROMPTS.complex);
      
      this.assert(validation.analysisDetails.aiSpecific.hasAINodes === true, 'Pipeline debe preservar características de IA');
      this.assert(workflow.nodes.length >= TEST_WORKFLOWS.aiWorkflow.nodes.length, 'No debe perder nodos en el pipeline');
    });
  }

  /**
   * Pruebas de casos edge y manejo de errores
   */
  async testEdgeCases() {
    console.log('\n⚠️ Probando Casos Edge y Manejo de Errores...');
    
    // Test 1: Workflow vacío
    await this.runTest('Edge - Workflow vacío', async () => {
      const emptyWorkflow = { nodes: [], connections: {} };
      
      const validationResult = await this.validator.validateWorkflow(emptyWorkflow, "");
      const layoutResult = await this.layoutOptimizer.optimizeLayout(emptyWorkflow);
      
      this.assert(validationResult.isValid === false, 'Workflow vacío debe ser inválido');
      this.assert(layoutResult.success === true, 'Layout optimizer debe manejar workflows vacíos');
    });

    // Test 2: Datos malformados
    await this.runTest('Edge - Datos malformados', async () => {
      const malformedWorkflow = {
        nodes: [
          {
            // id faltante
            name: "Bad Node",
            type: "unknown-type"
            // position faltante
          }
        ],
        connections: "not-an-object" // Tipo incorrecto
      };
      
      const result = await this.validator.validateWorkflow(malformedWorkflow, "test");
      
      this.assert(result.isValid === false, 'Datos malformados deben ser rechazados');
      this.assert(result.criticalErrors.length > 0, 'Debe reportar errores críticos');
    });

    // Test 3: Prompts extremos
    await this.runTest('Edge - Prompts extremos', async () => {
      const extremePrompts = [
        "", // Vacío
        "a", // Muy corto
        "x".repeat(10000), // Muy largo
        "!@#$%^&*()", // Solo símbolos
        "测试中文提示" // Caracteres no latinos
      ];
      
      for (const prompt of extremePrompts) {
        const result = await this.validator.validateWorkflow(TEST_WORKFLOWS.simple, prompt);
        this.assert(result !== null, `Debe manejar prompt: "${prompt.substring(0, 20)}..."`);
      }
    });
  }

  /**
   * Pruebas de rendimiento
   */
  async testPerformance() {
    console.log('\n⚡ Probando Rendimiento del Sistema...');
    
    // Test 1: Tiempo de respuesta
    await this.runTest('Performance - Tiempo de respuesta', async () => {
      const startTime = Date.now();
      
      await this.validator.validateWorkflow(TEST_WORKFLOWS.aiWorkflow, TEST_PROMPTS.simple);
      
      const responseTime = Date.now() - startTime;
      
      this.assert(responseTime < 5000, 'Validación debe completarse en menos de 5 segundos');
    });

    // Test 2: Manejo de workflows grandes
    await this.runTest('Performance - Workflows grandes', async () => {
      // Crear workflow con muchos nodos
      const largeWorkflow = {
        nodes: [],
        connections: {}
      };
      
      // Generar 50 nodos conectados secuencialmente
      for (let i = 0; i < 50; i++) {
        largeWorkflow.nodes.push({
          id: i.toString(),
          name: `Node ${i}`,
          type: "n8n-nodes-base.set",
          position: [i * 200, 0],
          parameters: {},
          typeVersion: 1
        });
        
        if (i > 0) {
          largeWorkflow.connections[`Node ${i-1}`] = {
            main: [[{
              node: `Node ${i}`,
              type: "main",
              index: 0
            }]]
          };
        }
      }
      
      const startTime = Date.now();
      const result = await this.layoutOptimizer.optimizeLayout(largeWorkflow);
      const processingTime = Date.now() - startTime;
      
      this.assert(result.success === true, 'Debe manejar workflows grandes');
      this.assert(processingTime < 10000, 'Procesamiento debe completarse en menos de 10 segundos');
    });

    // Test 3: Cache de rendimiento
    await this.runTest('Performance - Cache efectivo', async () => {
      // Primera ejecución
      const start1 = Date.now();
      await this.validator.validateWorkflow(TEST_WORKFLOWS.simple, TEST_PROMPTS.simple);
      const time1 = Date.now() - start1;
      
      // Segunda ejecución (debería usar cache)
      const start2 = Date.now();
      await this.validator.validateWorkflow(TEST_WORKFLOWS.simple, TEST_PROMPTS.simple);
      const time2 = Date.now() - start2;
      
      this.assert(time2 <= time1, 'Segunda ejecución debe ser igual o más rápida (cache)');
    });
  }

  /**
   * Función helper para ejecutar pruebas individuales
   */
  async runTest(testName, testFunction) {
    this.results.total++;
    
    try {
      await testFunction();
      this.results.passed++;
      this.results.details.push({
        name: testName,
        status: 'PASSED',
        error: null
      });
      console.log(`  ✅ ${testName}`);
      
    } catch (error) {
      this.results.failed++;
      this.results.details.push({
        name: testName,
        status: 'FAILED',
        error: error.message
      });
      console.log(`  ❌ ${testName}: ${error.message}`);
    }
  }

  /**
   * Función helper para assertions
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Generar reporte final
   */
  generateFinalReport(totalTime) {
    console.log('\n' + '=' * 60);
    console.log('📊 REPORTE FINAL DE PRUEBAS');
    console.log('=' * 60);
    
    console.log(`\n📈 Resumen:`);
    console.log(`  Total de pruebas: ${this.results.total}`);
    console.log(`  Pasadas: ${this.results.passed} ✅`);
    console.log(`  Falladas: ${this.results.failed} ❌`);
    console.log(`  Tasa de éxito: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    console.log(`  Tiempo total: ${totalTime}ms`);
    
    if (this.results.failed > 0) {
      console.log(`\n❌ Pruebas fallidas:`);
      this.results.details
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }
    
    // Obtener estadísticas de los módulos
    console.log(`\n📊 Estadísticas de Módulos:`);
    console.log(`  Continuation System: ${JSON.stringify(this.continuationSystem.getStats(), null, 2)}`);
    console.log(`  Autocorrector: ${JSON.stringify(this.autocorrector.getStats(), null, 2)}`);
    console.log(`  Validator: ${JSON.stringify(this.validator.getStats(), null, 2)}`);
    console.log(`  Layout Optimizer: ${JSON.stringify(this.layoutOptimizer.getStats(), null, 2)}`);
    
    // Guardar reporte en archivo
    const reportData = {
      timestamp: new Date().toISOString(),
      totalTime,
      summary: this.results,
      moduleStats: {
        continuationSystem: this.continuationSystem.getStats(),
        autocorrector: this.autocorrector.getStats(),
        validator: this.validator.getStats(),
        layoutOptimizer: this.layoutOptimizer.getStats()
      }
    };
    
    fs.writeFileSync(
      'integration-test-report.json',
      JSON.stringify(reportData, null, 2)
    );
    
    console.log(`\n💾 Reporte guardado en: integration-test-report.json`);
    
    if (this.results.failed === 0) {
      console.log(`\n🎉 ¡TODAS LAS PRUEBAS PASARON! Sistema integrado V3.0+ funcionando correctamente.`);
    } else {
      console.log(`\n⚠️ ${this.results.failed} pruebas fallaron. Revisar errores antes de producción.`);
    }
  }
}

// Función principal para ejecutar las pruebas
async function runIntegrationTests() {
  // Verificar configuración
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY no configurada');
    console.log('Configura la API key en .env: GEMINI_API_KEY=tu_clave_aqui');
    process.exit(1);
  }
  
  const testSuite = new IntegrationTestSuite();
  await testSuite.runAllTests();
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch(error => {
    console.error('❌ Error crítico en pruebas:', error);
    process.exit(1);
  });
}

export { IntegrationTestSuite, runIntegrationTests };
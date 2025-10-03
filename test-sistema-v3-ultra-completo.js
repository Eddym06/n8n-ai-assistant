// 🧪 TEST COMPLETO DEL SISTEMA V3 ULTRA INTEGRADO
// Valida todas las mejoras implementadas: posicionamiento, configuración y metadatos

const fs = require('fs');
const path = require('path');

class SystemV3UltraValidator {
  constructor() {
    this.testResults = {
      positioning: { passed: 0, failed: 0, tests: [] },
      nodeConfig: { passed: 0, failed: 0, tests: [] },
      validation: { passed: 0, failed: 0, tests: [] },
      metadata: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] }
    };
  }

  // 🎯 TEST 1: Validar que los componentes V3 están correctamente cargados
  async testV3ComponentsLoaded() {
    console.log('🧪 TEST 1: Validando carga de componentes V3...');
    
    try {
      // Verificar archivos V3 existen
      const v3Files = [
        'intelligent-positioning-agent-v3-ultra.js',
        'intelligent-node-config-agent-v3.js',
        'validation-system.js'
      ];
      
      for (const file of v3Files) {
        if (!fs.existsSync(path.join(__dirname, file))) {
          throw new Error(`Archivo V3 faltante: ${file}`);
        }
      }
      
      this.recordTest('integration', 'V3 Files Present', true);
      console.log('✅ Todos los archivos V3 están presentes');
      
    } catch (error) {
      this.recordTest('integration', 'V3 Files Present', false, error.message);
      console.error('❌ Error en componentes V3:', error.message);
    }
  }

  // 🎯 TEST 2: Probar generación de workflow con sistema V3 completo
  async testCompleteV3WorkflowGeneration() {
    console.log('🧪 TEST 2: Generando workflow con sistema V3 completo...');
    
    try {
      // Importar el extension server actualizado
      const ExtensionServer = require('./extension server fixed.js');
      const server = new ExtensionServer();
      
      // Prompt de prueba que ejercita todas las características V3
      const testPrompt = `Crear un workflow de e-commerce que:
      1. Reciba pedidos por webhook
      2. Valide datos del cliente con AI
      3. Procese pagos con Stripe
      4. Envíe confirmación por Gmail
      5. Actualice base de datos MySQL
      6. Notifique al equipo por Slack`;
      
      console.log(`📝 Prompt de prueba: ${testPrompt.substring(0, 100)}...`);
      
      // Generar workflow usando el método V2 actualizado con V3
      const result = await server.processUserPromptV2(testPrompt);
      
      if (result.ok && result.data) {
        console.log('✅ Workflow generado exitosamente');
        console.log(`   📊 Nodos: ${result.data.nodes?.length || 0}`);
        console.log(`   🔗 Conexiones: ${Object.keys(result.data.connections || {}).length}`);
        
        // Validar características V3 específicas
        await this.validateV3Features(result.data);
        
        this.recordTest('integration', 'V3 Workflow Generation', true);
        
        // Guardar workflow de prueba para análisis
        const testFile = `workflow-v3-test-${Date.now()}.json`;
        fs.writeFileSync(testFile, JSON.stringify(result.data, null, 2));
        console.log(`💾 Workflow guardado: ${testFile}`);
        
        return result.data;
        
      } else {
        throw new Error(`Generación falló: ${result.error || 'Resultado inválido'}`);
      }
      
    } catch (error) {
      this.recordTest('integration', 'V3 Workflow Generation', false, error.message);
      console.error('❌ Error en generación V3:', error.message);
      return null;
    }
  }

  // 🔍 Validar características específicas del sistema V3
  async validateV3Features(workflow) {
    console.log('🔍 Validando características V3 en workflow generado...');
    
    // TEST: Posicionamiento V3 Ultra
    this.validatePositioningV3(workflow);
    
    // TEST: Configuración de nodos V3
    this.validateNodeConfigV3(workflow);
    
    // TEST: Sistema de validación modular
    this.validateValidationSystem(workflow);
    
    // TEST: Metadatos V3 Ultra
    this.validateMetadataV3(workflow);
  }

  validatePositioningV3(workflow) {
    console.log('   🎯 Validando posicionamiento V3 Ultra...');
    
    try {
      // Verificar que todos los nodos tienen posiciones
      const nodesWithoutPosition = workflow.nodes?.filter(node => !node.position) || [];
      if (nodesWithoutPosition.length > 0) {
        throw new Error(`${nodesWithoutPosition.length} nodos sin posición`);
      }
      
      // Verificar metadatos de posicionamiento
      if (workflow._metadata?.positioning) {
        const posData = workflow._metadata.positioning;
        console.log(`      📐 Layout: ${posData.layoutType || 'N/A'}`);
        console.log(`      📊 Score: ${posData.qualityScore || 'N/A'}/100`);
        
        if (posData.qualityScore && posData.qualityScore >= 85) {
          this.recordTest('positioning', 'High Quality Score', true);
        } else {
          this.recordTest('positioning', 'High Quality Score', false, `Score: ${posData.qualityScore}`);
        }
      }
      
      // Verificar distribución profesional
      const positions = workflow.nodes.map(n => n.position);
      const avgSpacing = this.calculateAverageSpacing(positions);
      
      if (avgSpacing >= 300) {
        this.recordTest('positioning', 'Professional Spacing', true);
        console.log(`      ✅ Espaciado profesional: ${Math.round(avgSpacing)}px promedio`);
      } else {
        this.recordTest('positioning', 'Professional Spacing', false, `Spacing: ${avgSpacing}px`);
      }
      
    } catch (error) {
      this.recordTest('positioning', 'V3 Ultra Positioning', false, error.message);
      console.error(`      ❌ Error en posicionamiento: ${error.message}`);
    }
  }

  validateNodeConfigV3(workflow) {
    console.log('   🔧 Validando configuración de nodos V3...');
    
    try {
      // Verificar información de configuración en sistema
      if (workflow._systemInfo?.nodeConfiguration?.applied) {
        const configInfo = workflow._systemInfo.nodeConfiguration;
        console.log(`      🎯 Agente: ${configInfo.agent || 'N/A'}`);
        console.log(`      📊 Stats disponibles: ${configInfo.stats ? 'Sí' : 'No'}`);
        
        if (configInfo.version === 'V3Ultra') {
          this.recordTest('nodeConfig', 'V3 Config Applied', true);
        } else {
          this.recordTest('nodeConfig', 'V3 Config Applied', false, `Version: ${configInfo.version}`);
        }
        
        // Verificar estadísticas de configuración
        if (configInfo.stats?.configurationScore >= 80) {
          this.recordTest('nodeConfig', 'High Config Score', true);
        }
        
      } else {
        this.recordTest('nodeConfig', 'V3 Config Applied', false, 'No configuration applied');
      }
      
      // Verificar que los nodos tienen parámetros configurados
      const configuredNodes = workflow.nodes?.filter(node => 
        node.parameters && Object.keys(node.parameters).length > 0
      ) || [];
      
      const configRatio = configuredNodes.length / (workflow.nodes?.length || 1);
      if (configRatio >= 0.7) {
        this.recordTest('nodeConfig', 'Nodes Well Configured', true);
        console.log(`      ✅ ${Math.round(configRatio * 100)}% de nodos configurados`);
      } else {
        this.recordTest('nodeConfig', 'Nodes Well Configured', false, `Only ${Math.round(configRatio * 100)}% configured`);
      }
      
    } catch (error) {
      this.recordTest('nodeConfig', 'V3 Node Config', false, error.message);
      console.error(`      ❌ Error en configuración: ${error.message}`);
    }
  }

  validateValidationSystem(workflow) {
    console.log('   ✅ Validando sistema de validación modular...');
    
    try {
      // Verificar que el workflow tiene estructura válida
      if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
        throw new Error('Estructura de nodos inválida');
      }
      
      if (!workflow.connections || typeof workflow.connections !== 'object') {
        throw new Error('Estructura de conexiones inválida');
      }
      
      // Verificar información de validación en metadatos
      if (workflow._metadata?.validation) {
        const validationData = workflow._metadata.validation;
        console.log(`      🔍 Validaciones ejecutadas: ${validationData.executed || 0}`);
        console.log(`      ⚠️ Warnings: ${validationData.warnings || 0}`);
        
        this.recordTest('validation', 'Validation Metadata', true);
      }
      
      // Verificar conectividad básica
      const hasConnections = Object.keys(workflow.connections).length > 0;
      if (hasConnections) {
        this.recordTest('validation', 'Basic Connectivity', true);
        console.log(`      ✅ Conectividad básica válida`);
      } else {
        this.recordTest('validation', 'Basic Connectivity', false, 'No connections found');
      }
      
    } catch (error) {
      this.recordTest('validation', 'Validation System', false, error.message);
      console.error(`      ❌ Error en validación: ${error.message}`);
    }
  }

  validateMetadataV3(workflow) {
    console.log('   🏷️ Validando metadatos V3 Ultra...');
    
    try {
      // Verificar presencia de metadatos V3
      if (workflow._systemInfo?.v3Ultra) {
        const v3Info = workflow._systemInfo.v3Ultra;
        console.log(`      🚀 Versión sistema: ${v3Info.version || 'N/A'}`);
        console.log(`      📊 Score calidad: ${v3Info.workflowProfile?.estimatedQualityScore || 'N/A'}`);
        
        this.recordTest('metadata', 'V3 System Info', true);
        
        // Verificar componentes del sistema
        const components = v3Info.systemComponents || {};
        const v3Components = Object.values(components).filter(c => 
          typeof c === 'string' && c.includes('V3')
        ).length;
        
        if (v3Components >= 2) {
          this.recordTest('metadata', 'V3 Components Active', true);
          console.log(`      ✅ ${v3Components} componentes V3 activos`);
        } else {
          this.recordTest('metadata', 'V3 Components Active', false, `Only ${v3Components} V3 components`);
        }
        
      } else {
        this.recordTest('metadata', 'V3 System Info', false, 'No V3 system info found');
      }
      
      // Verificar assessment de calidad V3
      if (workflow._metadata?.v3QualityAssessment) {
        const assessment = workflow._metadata.v3QualityAssessment;
        console.log(`      📈 Score general: ${assessment.overallScore || 'N/A'}/100`);
        
        if (assessment.overallScore >= 80) {
          this.recordTest('metadata', 'High Quality Assessment', true);
        } else {
          this.recordTest('metadata', 'High Quality Assessment', false, `Score: ${assessment.overallScore}`);
        }
      }
      
      // Verificar etiqueta del sistema
      if (workflow._metadata?.systemTag === 'n8n-ai-assistant-v3-ultra') {
        this.recordTest('metadata', 'V3 Ultra Tag', true);
        console.log(`      ✅ Etiqueta V3 Ultra presente`);
      } else {
        this.recordTest('metadata', 'V3 Ultra Tag', false, 'Missing V3 Ultra tag');
      }
      
    } catch (error) {
      this.recordTest('metadata', 'V3 Metadata', false, error.message);
      console.error(`      ❌ Error en metadatos: ${error.message}`);
    }
  }

  // 📊 HELPERS
  calculateAverageSpacing(positions) {
    if (positions.length < 2) return 0;
    
    let totalDistance = 0;
    let comparisons = 0;
    
    for (let i = 0; i < positions.length - 1; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = Math.sqrt(
          Math.pow(positions[j][0] - positions[i][0], 2) +
          Math.pow(positions[j][1] - positions[i][1], 2)
        );
        totalDistance += distance;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalDistance / comparisons : 0;
  }

  recordTest(category, testName, passed, error = null) {
    const test = { name: testName, passed, error, timestamp: new Date().toISOString() };
    this.testResults[category].tests.push(test);
    
    if (passed) {
      this.testResults[category].passed++;
    } else {
      this.testResults[category].failed++;
    }
  }

  // 📊 Generar reporte final
  generateReport() {
    console.log('\n=== 📊 REPORTE FINAL DE VALIDACIÓN V3 ULTRA ===');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.entries(this.testResults).forEach(([category, results]) => {
      console.log(`\n🔸 ${category.toUpperCase()}:`);
      console.log(`   ✅ Pasaron: ${results.passed}`);
      console.log(`   ❌ Fallaron: ${results.failed}`);
      
      if (results.failed > 0) {
        console.log(`   📋 Fallos:`);
        results.tests.filter(t => !t.passed).forEach(test => {
          console.log(`      • ${test.name}: ${test.error}`);
        });
      }
      
      totalPassed += results.passed;
      totalFailed += results.failed;
    });
    
    const totalTests = totalPassed + totalFailed;
    const successRate = totalTests > 0 ? (totalPassed / totalTests * 100).toFixed(1) : 0;
    
    console.log(`\n=== 📈 RESULTADO GENERAL ===`);
    console.log(`✅ Tests exitosos: ${totalPassed}`);
    console.log(`❌ Tests fallidos: ${totalFailed}`);
    console.log(`📊 Tasa de éxito: ${successRate}%`);
    
    if (successRate >= 85) {
      console.log(`🎉 ¡SISTEMA V3 ULTRA VALIDADO EXITOSAMENTE!`);
    } else if (successRate >= 70) {
      console.log(`⚠️ Sistema V3 funcional pero necesita mejoras`);
    } else {
      console.log(`❌ Sistema V3 requiere correcciones importantes`);
    }
    
    return {
      totalTests,
      passed: totalPassed,
      failed: totalFailed,
      successRate: parseFloat(successRate),
      categories: this.testResults
    };
  }
}

// 🚀 EJECUTAR VALIDACIÓN COMPLETA
async function runCompleteV3Validation() {
  console.log('🚀 INICIANDO VALIDACIÓN COMPLETA DEL SISTEMA V3 ULTRA...\n');
  
  const validator = new SystemV3UltraValidator();
  
  try {
    // Ejecutar todos los tests
    await validator.testV3ComponentsLoaded();
    const workflow = await validator.testCompleteV3WorkflowGeneration();
    
    if (workflow) {
      // Solo validar características si el workflow se generó exitosamente
      await validator.validateV3Features(workflow);
    }
    
    // Generar reporte final
    const report = validator.generateReport();
    
    // Guardar reporte para referencia
    const reportFile = `v3-validation-report-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte guardado: ${reportFile}`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Error durante validación:', error.message);
    console.error('Stack:', error.stack);
    return null;
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  runCompleteV3Validation()
    .then(report => {
      if (report && report.successRate >= 85) {
        console.log('\n🎊 ¡INTEGRACIÓN V3 ULTRA COMPLETADA EXITOSAMENTE!');
        process.exit(0);
      } else {
        console.log('\n⚠️ Integración V3 completada con observaciones');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Error crítico en validación:', error.message);
      process.exit(1);
    });
}

module.exports = { SystemV3UltraValidator, runCompleteV3Validation };
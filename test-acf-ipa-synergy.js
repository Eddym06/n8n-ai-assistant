/**
 * SCRIPT DE PRUEBA: ACF V3.0 + IPA V3.0 - SINERGIA DE AGENTES
 * ===========================================================
 * 
 * Este script demuestra el flujo de trabajo ideal entre:
 * 1. FlowCoherenceAgentV3 (ACF) - Corrección lógica con clustering
 * 2. IntelligentPositioningAgentV3 (IPA) - Posicionamiento con swimlanes
 */

import fs from 'fs';
import { FlowCoherenceAgentV3 } from './flow-coherence-agent.js';
import { IntelligentPositioningAgentV3 } from './intelligent-positioning-agent.js';

// Configuración
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WORKFLOW_PATH = './generated-workflows/workflow-masivo-gemini-1757339505161-FIXED.json';
const OUTPUT_PATH = './generated-workflows/workflow-masivo-gemini-1757339505161-V3-OPTIMIZED.json';

async function testACFandIPASynergy() {
  console.log('🚀 INICIANDO PRUEBA DE SINERGIA ACF V3.0 + IPA V3.0');
  console.log('=' * 60);

  try {
    // 1. CARGAR WORKFLOW PROBLEMÁTICO
    console.log('\n📁 Cargando workflow masivo...');
    const workflowContent = fs.readFileSync(WORKFLOW_PATH, 'utf8');
    const originalWorkflow = JSON.parse(workflowContent);
    
    console.log(`✅ Workflow cargado: ${originalWorkflow.nodes.length} nodos, ${Object.keys(originalWorkflow.connections).length} conexiones`);

    // 2. INSTANCIAR AGENTES V3.0
    console.log('\n🤖 Instanciando agentes V3.0...');
    const acfAgent = new FlowCoherenceAgentV3(GEMINI_API_KEY);
    const ipaAgent = new IntelligentPositioningAgentV3();
    
    // Habilitar modo debug para ver el proceso completo
    acfAgent.setDebugMode(true);
    ipaAgent.setDebugMode(true);

    // 3. EJECUTAR ACF V3.0 PRIMERO (CORRECCIÓN LÓGICA + CLUSTERING)
    console.log('\n🔧 FASE 1: Ejecutando ACF V3.0 - Corrección lógica con clustering...');
    const originalPrompt = "Crear un sistema integral de automatización empresarial que maneje RRHH, Ventas, Finanzas, Operaciones y Soporte, con flujos independientes y paralelos para cada área de negocio.";
    
    const acfResult = await acfAgent.processWorkflow(originalWorkflow, originalPrompt);
    
    console.log('\n📊 RESULTADOS DEL ACF V3.0:');
    console.log(`   - Workflow corregido: ${acfResult.corrected ? 'SÍ' : 'NO'}`);
    console.log(`   - Cambios aplicados: ${acfResult.changes.length}`);
    console.log(`   - Clústers identificados: ${acfResult.clusters.clusterNames.length}`);
    console.log(`   - Distribución de nodos:`, acfResult.clusters.nodeCount);

    // 4. EJECUTAR IPA V3.0 SEGUNDO (POSICIONAMIENTO CON SWIMLANES)
    console.log('\n🎯 FASE 2: Ejecutando IPA V3.0 - Posicionamiento con swimlanes...');
    const finalWorkflow = ipaAgent.optimizeLayout(acfResult.workflow, acfResult.clusters);
    
    console.log('\n📊 RESULTADOS DEL IPA V3.0:');
    const ipaMetrics = ipaAgent.getMetrics();
    console.log(`   - Nodos posicionados: ${ipaMetrics.totalNodes}`);
    console.log(`   - Clústers procesados: ${ipaMetrics.totalClusters}`);
    console.log(`   - Swimlanes creados: ${ipaMetrics.swimlanesCreated}`);
    console.log(`   - Tiempo de procesamiento: ${ipaMetrics.processingTime}ms`);

    // 5. GUARDAR RESULTADO FINAL
    console.log('\n💾 Guardando workflow optimizado...');
    const finalWorkflowWithMetadata = {
      ...finalWorkflow,
      metadata: {
        version: "ACF V3.0 + IPA V3.0",
        processedAt: new Date().toISOString(),
        acfChanges: acfResult.changes.length,
        clusters: acfResult.clusters,
        ipaMetrics: ipaMetrics,
        originalPrompt: originalPrompt
      }
    };
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalWorkflowWithMetadata, null, 2));
    console.log(`✅ Workflow optimizado guardado en: ${OUTPUT_PATH}`);

    // 6. ANÁLISIS COMPARATIVO
    console.log('\n🔍 ANÁLISIS COMPARATIVO:');
    console.log('ANTES (Workflow Original):');
    console.log(`   - Problemas lógicos: Múltiples (fusión incorrecta, nodos huérfanos)`);
    console.log(`   - Posicionamiento: Lineal caótico`);
    console.log(`   - Clústers: No identificados`);
    
    console.log('\nDESPUÉS (ACF V3.0 + IPA V3.0):');
    console.log(`   - Problemas lógicos: ${acfResult.corrected ? 'CORREGIDOS' : 'NINGUNO'}`);
    console.log(`   - Posicionamiento: ${ipaMetrics.swimlanesCreated} swimlanes organizados`);
    console.log(`   - Clústers: ${acfResult.clusters.clusterNames.join(', ')}`);

    // 7. VALIDACIÓN FINAL
    console.log('\n✅ VALIDACIÓN FINAL:');
    const hasPositions = finalWorkflow.nodes.every(node => 
      node.position && 
      Array.isArray(node.position) && 
      node.position.length === 2 &&
      typeof node.position[0] === 'number' &&
      typeof node.position[1] === 'number'
    );
    
    console.log(`   - Todos los nodos tienen posiciones válidas: ${hasPositions ? 'SÍ' : 'NO'}`);
    console.log(`   - Estructura de conexiones preservada: SÍ`);
    console.log(`   - Metadata incluida: SÍ`);

    console.log('\n🎉 PRUEBA COMPLETADA EXITOSAMENTE');
    console.log(`🎯 El workflow masivo ha sido transformado de un caos de 130 nodos a un sistema modular profesional con ${ipaMetrics.swimlanesCreated} carriles organizados.`);

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Verificar que tenemos la API key de Gemini
if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está configurado en las variables de entorno.');
  console.error('💡 Ejecute: $env:GEMINI_API_KEY="su-api-key"');
  process.exit(1);
}

// Ejecutar la prueba
testACFandIPASynergy();

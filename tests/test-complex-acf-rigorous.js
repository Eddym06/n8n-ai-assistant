// ===================================================================
// 🧪 PRUEBA RIGUROSA ACF - WORKFLOW COMPLEJO INTENCIONALMENTE ROTO
// ===================================================================

import dotenv from 'dotenv';
import fs from 'fs';
import { FlowCoherenceAgent } from './flow-coherence-agent.js';

// Cargar variables de entorno
dotenv.config();

console.log('🧪 INICIANDO PRUEBA RIGUROSA DEL ACF...\n');
console.log('🎯 OBJETIVO: Probar ACF con workflow e-commerce complejo de 15 nodos');
console.log('🔥 DESAFÍO: Múltiples IF, Merge y nodos huérfanos intencionalmente\n');

async function testComplexBrokenWorkflow() {
  try {
    console.log('📋 Cargando workflow complejo intencionalmente roto...');
    const workflowPath = 'c:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\test-complex-broken-workflow.json';
    
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    const workflowData = JSON.parse(workflowContent);
    
    console.log(`   ✅ Workflow cargado: ${workflowData.nodes?.length || 0} nodos`);
    console.log(`   🔗 Conexiones iniciales: ${Object.keys(workflowData.connections || {}).length}`);
    
    // Análisis detallado del workflow
    console.log('\\n📊 ANÁLISIS DETALLADO DEL WORKFLOW:');
    const nodesByType = {};
    workflowData.nodes?.forEach(node => {
      const type = node.type.split('.').pop();
      nodesByType[type] = (nodesByType[type] || 0) + 1;
    });
    
    console.log('   📝 Distribución de tipos de nodos:');
    Object.entries(nodesByType).forEach(([type, count]) => {
      console.log(`     - ${type}: ${count} nodo(s)`);
    });
    
    // Identificar nodos IF y Merge específicamente
    const ifNodes = workflowData.nodes?.filter(n => n.type.includes('.if')) || [];
    const mergeNodes = workflowData.nodes?.filter(n => n.type.includes('.merge')) || [];
    
    console.log(`\\n🎯 NODOS DE INTERÉS ESPECIAL:`);
    console.log(`   🔀 Nodos IF: ${ifNodes.length}`);
    ifNodes.forEach((node, i) => {
      console.log(`     ${i + 1}. ${node.name}`);
    });
    
    console.log(`   🔄 Nodos Merge: ${mergeNodes.length}`);
    mergeNodes.forEach((node, i) => {
      console.log(`     ${i + 1}. ${node.name}`);
    });
    
    console.log('\\n🚀 Inicializando FlowCoherenceAgent...');
    const acf = new FlowCoherenceAgent(process.env.GEMINI_API_KEY);
    
    console.log('\\n🔍 FASE 1: Detectando nodos huérfanos...');
    const orphanNodes = acf.detectOrphanNodes(workflowData);
    
    console.log(`\\n📊 RESULTADOS DE DETECCIÓN:`);
    console.log(`   Total de nodos: ${workflowData.nodes?.length || 0}`);
    console.log(`   Nodos huérfanos encontrados: ${orphanNodes.length}`);
    console.log(`   Porcentaje de nodos huérfanos: ${((orphanNodes.length / workflowData.nodes.length) * 100).toFixed(1)}%`);
    
    if (orphanNodes.length > 0) {
      console.log(`\\n   📋 LISTA DETALLADA DE NODOS HUÉRFANOS:`);
      orphanNodes.forEach((nodeName, i) => {
        const node = workflowData.nodes.find(n => n.name === nodeName);
        const nodeType = node ? node.type.split('.').pop() : 'unknown';
        console.log(`     ${i + 1}. ${nodeName} (${nodeType})`);
      });
      
      // Análisis especial de IF y Merge huérfanos
      const orphanIFs = orphanNodes.filter(name => 
        workflowData.nodes.find(n => n.name === name && n.type.includes('.if'))
      );
      const orphanMerges = orphanNodes.filter(name => 
        workflowData.nodes.find(n => n.name === name && n.type.includes('.merge'))
      );
      
      console.log(`\\n   🎯 ANÁLISIS ESPECIAL:`);
      console.log(`     🔀 IFs huérfanos: ${orphanIFs.length}/${ifNodes.length}`);
      console.log(`     🔄 Merges huérfanos: ${orphanMerges.length}/${mergeNodes.length}`);
      
      console.log('\\n🤖 FASE 2: Solicitando plan de corrección a Gemini...');
      const originalPrompt = "Crear un workflow completo de e-commerce que reciba órdenes por webhook, valide pagos, verifique inventario, procese pagos, actualice stock, envíe confirmaciones por email, notifique órdenes de alto valor a Slack, envíe SMS al cliente y registre analytics";
      
      console.log('   ⏳ Analizando workflow complejo... (esto puede tomar un momento)');
      const correctionPlan = await acf.getCorrectionPlan(workflowData, orphanNodes, originalPrompt);
      
      if (correctionPlan && correctionPlan.corrections) {
        console.log(`\\n📋 PLAN DE CORRECCIÓN RECIBIDO:`);
        console.log(`   Comandos totales: ${correctionPlan.corrections.length}`);
        
        // Agrupar comandos por tipo
        const commandsByType = {};
        correctionPlan.corrections.forEach(cmd => {
          commandsByType[cmd.action] = (commandsByType[cmd.action] || 0) + 1;
        });
        
        console.log(`\\n   📊 DISTRIBUCIÓN DE COMANDOS:`);
        Object.entries(commandsByType).forEach(([action, count]) => {
          console.log(`     - ${action}: ${count} comando(s)`);
        });
        
        // Mostrar primeros 5 comandos como ejemplo
        console.log(`\\n   🔍 PRIMEROS 5 COMANDOS (EJEMPLO):`);
        correctionPlan.corrections.slice(0, 5).forEach((cmd, i) => {
          console.log(`\\n     ${i + 1}. ${cmd.action}:`);
          if (cmd.source && cmd.target) {
            console.log(`        Conectar: "${cmd.source}" → "${cmd.target}"`);
          } else if (cmd.node) {
            console.log(`        Nodo: "${cmd.node}"`);
          }
          console.log(`        Razón: ${cmd.reason.substring(0, 100)}...`);
        });
        
        console.log('\\n🔧 FASE 3: Aplicando correcciones...');
        console.log('   ⏳ Procesando comandos complejos...');
        
        const startTime = Date.now();
        const correctedWorkflow = acf.applyCorrections(workflowData, correctionPlan);
        const processingTime = Date.now() - startTime;
        
        console.log(`   ✅ Correcciones aplicadas en ${processingTime}ms`);
        
        console.log('\\n🔍 FASE 4: Verificando resultado...');
        const remainingOrphans = acf.detectOrphanNodes(correctedWorkflow);
        
        console.log(`\\n📊 RESULTADOS FINALES:`);
        console.log(`   Nodos huérfanos originales: ${orphanNodes.length}`);
        console.log(`   Nodos huérfanos después de corrección: ${remainingOrphans.length}`);
        console.log(`   Tasa de corrección: ${(((orphanNodes.length - remainingOrphans.length) / orphanNodes.length) * 100).toFixed(1)}%`);
        console.log(`   Conexiones finales: ${Object.keys(correctedWorkflow.connections || {}).length}`);
        
        if (remainingOrphans.length === 0) {
          console.log('   🎉 ¡ÉXITO TOTAL! Todos los nodos huérfanos han sido corregidos');
        } else {
          console.log(`   ⚠️ Quedan ${remainingOrphans.length} nodos huérfanos sin resolver:`);
          remainingOrphans.forEach((nodeName, i) => {
            console.log(`     ${i + 1}. ${nodeName}`);
          });
        }
        
        // Verificación especial de IF y Merge
        const finalOrphanIFs = remainingOrphans.filter(name => 
          correctedWorkflow.nodes.find(n => n.name === name && n.type.includes('.if'))
        );
        const finalOrphanMerges = remainingOrphans.filter(name => 
          correctedWorkflow.nodes.find(n => n.name === name && n.type.includes('.merge'))
        );
        
        console.log(`\\n   🎯 VERIFICACIÓN ESPECIAL:`);
        console.log(`     🔀 IFs corregidos: ${orphanIFs.length - finalOrphanIFs.length}/${orphanIFs.length}`);
        console.log(`     🔄 Merges corregidos: ${orphanMerges.length - finalOrphanMerges.length}/${orphanMerges.length}`);
        
        // Análisis de conectividad final
        console.log(`\\n🔗 ANÁLISIS DE CONECTIVIDAD FINAL:`);
        const finalConnections = correctedWorkflow.connections || {};
        const connectedNodes = new Set();
        
        // Contar nodos con conexiones de salida
        Object.keys(finalConnections).forEach(source => {
          connectedNodes.add(source);
          if (finalConnections[source].main && finalConnections[source].main[0]) {
            finalConnections[source].main[0].forEach(conn => {
              connectedNodes.add(conn.node);
            });
          }
        });
        
        console.log(`   📊 Nodos en la red de conexiones: ${connectedNodes.size}/${correctedWorkflow.nodes.length}`);
        console.log(`   🔗 Porcentaje de conectividad: ${((connectedNodes.size / correctedWorkflow.nodes.length) * 100).toFixed(1)}%`);
        
        // Guardar workflow corregido
        const outputPath = 'c:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\workflow-complejo-corregido-por-acf.json';
        fs.writeFileSync(outputPath, JSON.stringify(correctedWorkflow, null, 2));
        console.log(`\\n💾 Workflow corregido guardado en: ${outputPath}`);
        
        // Evaluación final
        const successScore = ((orphanNodes.length - remainingOrphans.length) / orphanNodes.length) * 100;
        console.log(`\\n🏆 PUNTUACIÓN FINAL DEL ACF: ${successScore.toFixed(1)}/100`);
        
        if (successScore >= 90) {
          console.log('   🏅 EXCELENTE: El ACF manejó el workflow complejo brillantemente');
        } else if (successScore >= 70) {
          console.log('   ✅ BUENO: El ACF resolvió la mayoría de los problemas');
        } else if (successScore >= 50) {
          console.log('   ⚠️ REGULAR: El ACF tuvo dificultades con algunos aspectos');
        } else {
          console.log('   ❌ INSUFICIENTE: El ACF necesita mejoras para workflows complejos');
        }
        
      } else {
        console.log('\\n❌ FALLO: No se pudo obtener un plan de corrección válido de Gemini');
      }
      
    } else {
      console.log('\\n🚫 ERROR EN LA PRUEBA: El workflow debería tener nodos huérfanos intencionalmente');
      console.log('   Revisa la configuración del workflow de prueba');
    }
    
    console.log('\\n✅ PRUEBA RIGUROSA ACF COMPLETADA');
    
  } catch (error) {
    console.error('\\n❌ ERROR EN PRUEBA RIGUROSA:');
    console.error(`   Mensaje: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\\n').slice(0, 8).join('\\n')}`);
    }
  }
}

// Ejecutar la prueba
testComplexBrokenWorkflow().then(() => {
  console.log('\\n🏁 Prueba rigurosa del ACF finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('\\n💥 ERROR CRÍTICO:', error);
  process.exit(1);
});

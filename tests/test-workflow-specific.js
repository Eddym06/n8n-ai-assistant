// ===================================================================
// 🧪 PRUEBA ACF CON WORKFLOW ESPECÍFICO DE TELEGRAM
// ===================================================================

import dotenv from 'dotenv';
import fs from 'fs';
import { FlowCoherenceAgent } from './flow-coherence-agent.js';

// Cargar variables de entorno
dotenv.config();

console.log('🧪 INICIANDO PRUEBA ACF CON WORKFLOW ESPECÍFICO...\n');

async function testWorkflowSpecific() {
  try {
    console.log('📋 Cargando workflow desde archivo...');
    const workflowPath = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757197744727.json';
    
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    const workflowData = JSON.parse(workflowContent);
    
    console.log(`   ✅ Workflow cargado: ${workflowData.nodes?.length || 0} nodos`);
    console.log(`   🔗 Conexiones iniciales: ${Object.keys(workflowData.connections || {}).length}`);
    
    // Mostrar algunos nodos para entender el workflow
    console.log('\n📝 NODOS EN EL WORKFLOW:');
    workflowData.nodes?.slice(0, 5).forEach((node, i) => {
      console.log(`   ${i + 1}. ${node.name} (${node.type})`);
    });
    if (workflowData.nodes?.length > 5) {
      console.log(`   ... y ${workflowData.nodes.length - 5} nodos más`);
    }
    
    console.log('\n🚀 Inicializando FlowCoherenceAgent...');
    const acf = new FlowCoherenceAgent(process.env.GEMINI_API_KEY);
    
    console.log('\n🔍 FASE 1: Detectando nodos huérfanos...');
    const orphanNodes = acf.detectOrphanNodes(workflowData);
    
    console.log(`\n📊 RESULTADOS DE DETECCIÓN:`);
    console.log(`   Total de nodos: ${workflowData.nodes?.length || 0}`);
    console.log(`   Nodos huérfanos encontrados: ${orphanNodes.length}`);
    
    if (orphanNodes.length > 0) {
      console.log(`   Lista de huérfanos:`);
      orphanNodes.forEach((nodeName, i) => {
        console.log(`     ${i + 1}. ${nodeName}`);
      });
      
      console.log('\n🤖 FASE 2: Solicitando plan de corrección a Gemini...');
      const originalPrompt = "Crear un workflow completo de Telegram que reciba webhooks, valide datos, agende citas en Google Calendar, guarde en Google Sheets y notifique al equipo";
      
      const correctionPlan = await acf.getCorrectionPlan(workflowData, orphanNodes, originalPrompt);
      
      if (correctionPlan && correctionPlan.corrections) {
        console.log(`\n📋 PLAN DE CORRECCIÓN RECIBIDO:`);
        console.log(`   Comandos a ejecutar: ${correctionPlan.corrections.length}`);
        
        correctionPlan.corrections.forEach((cmd, i) => {
          console.log(`\n   ${i + 1}. ${cmd.action}:`);
          if (cmd.source && cmd.target) {
            console.log(`      Conectar: "${cmd.source}" → "${cmd.target}"`);
          } else if (cmd.node) {
            console.log(`      Nodo: "${cmd.node}"`);
          }
          console.log(`      Razón: ${cmd.reason}`);
        });
        
        console.log('\n🔧 FASE 3: Aplicando correcciones...');
        const correctedWorkflow = acf.applyCorrections(workflowData, correctionPlan);
        
        console.log('\n🔍 FASE 4: Verificando resultado...');
        const remainingOrphans = acf.detectOrphanNodes(correctedWorkflow);
        
        console.log(`\n📊 RESULTADOS DESPUÉS DE CORRECCIÓN:`);
        console.log(`   Nodos huérfanos originales: ${orphanNodes.length}`);
        console.log(`   Nodos huérfanos restantes: ${remainingOrphans.length}`);
        
        if (remainingOrphans.length === 0) {
          console.log('   🎉 ¡ÉXITO! Todos los nodos huérfanos han sido corregidos');
        } else {
          console.log(`   ⚠️ Aún quedan ${remainingOrphans.length} nodos huérfanos:`);
          remainingOrphans.forEach((nodeName, i) => {
            console.log(`     ${i + 1}. ${nodeName}`);
          });
        }
        
        console.log('\n🔗 CONEXIONES DESPUÉS DE CORRECCIÓN:');
        const finalConnections = correctedWorkflow.connections || {};
        const connectionCount = Object.keys(finalConnections).length;
        console.log(`   Total de fuentes con conexiones: ${connectionCount}`);
        
        // Mostrar primeras 10 conexiones como muestra
        let shown = 0;
        Object.keys(finalConnections).forEach(source => {
          if (shown < 10 && finalConnections[source].main && finalConnections[source].main[0]) {
            const targets = finalConnections[source].main[0].map(c => c.node).join(', ');
            console.log(`   ${source} → ${targets}`);
            shown++;
          }
        });
        
        if (connectionCount > 10) {
          console.log(`   ... y ${connectionCount - 10} conexiones más`);
        }
        
        // Guardar workflow corregido
        const outputPath = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\workflow-corregido-por-acf.json';
        fs.writeFileSync(outputPath, JSON.stringify(correctedWorkflow, null, 2));
        console.log(`\n💾 Workflow corregido guardado en: ${outputPath}`);
        
      } else {
        console.log('\n❌ No se pudo obtener un plan de corrección válido de Gemini');
      }
      
    } else {
      console.log('\n✅ EXCELENTE: No se detectaron nodos huérfanos - El workflow ya es coherente');
    }
    
    console.log('\n✅ ANÁLISIS COMPLETADO EXITOSAMENTE');
    
  } catch (error) {
    console.error('\n❌ ERROR EN ANÁLISIS DE WORKFLOW:');
    console.error(`   Mensaje: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\\n').slice(0, 5).join('\\n')}`);
    }
  }
}

// Ejecutar la prueba
testWorkflowSpecific().then(() => {
  console.log('\n🏁 Análisis de workflow específico finalizado');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 ERROR CRÍTICO:', error);
  process.exit(1);
});

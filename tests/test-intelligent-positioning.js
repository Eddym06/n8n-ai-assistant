// Test del Intelligent Positioning Agent V5.0
// Prueba con workflow complejo corregido por ACF

import fs from 'fs';
import IntelligentPositioningAgentV5 from './intelligent-positioning-agent.js';

async function testIntelligentPositioning() {
  console.log('🧪 INICIANDO TEST DEL INTELLIGENT POSITIONING AGENT V5.0');
  console.log('=' .repeat(60));

  try {
    // 1. Cargar el workflow de prueba
    console.log('📂 Cargando workflow de prueba...');
    const workflowPath = 'c:\\Users\\eddym\\AppData\\Local\\Microsoft\\Windows\\INetCache\\IE\\0N9SHSUG\\workflow-masivo-gemini-1756841623296[1].json';
    
    if (!fs.existsSync(workflowPath)) {
      throw new Error(`Archivo no encontrado: ${workflowPath}`);
    }

    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    console.log(`✅ Workflow cargado: "${workflowData.name}"`);
    console.log(`📊 Nodos: ${workflowData.nodes?.length || 0}`);
    console.log(`🔗 Conexiones: ${Object.keys(workflowData.connections || {}).length}`);

    // 2. Mostrar posiciones originales
    console.log('\n📍 POSICIONES ORIGINALES:');
    console.log('-'.repeat(40));
    workflowData.nodes.forEach((node, index) => {
      const pos = node.position || [0, 0];
      console.log(`${index + 1}. ${node.name}: [${pos[0]}, ${pos[1]}]`);
    });

    // 3. Crear instancia del agente
    console.log('\n🎯 Inicializando Intelligent Positioning Agent V5.0...');
    const positioningAgent = new IntelligentPositioningAgentV5();

    // 4. Ejecutar optimización
    console.log('\n🚀 Ejecutando optimización de layout...');
    const startTime = Date.now();
    
    const optimizedWorkflow = positioningAgent.optimizeLayout(workflowData);
    
    const processingTime = Date.now() - startTime;

    // 5. Mostrar posiciones optimizadas
    console.log('\n✨ POSICIONES OPTIMIZADAS:');
    console.log('-'.repeat(40));
    optimizedWorkflow.nodes.forEach((node, index) => {
      const pos = node.position || [0, 0];
      console.log(`${index + 1}. ${node.name}: [${pos[0]}, ${pos[1]}]`);
    });

    // 6. Analizar mejoras
    console.log('\n📊 ANÁLISIS DE MEJORAS:');
    console.log('-'.repeat(40));
    
    // Calcular distribución horizontal
    const xPositions = optimizedWorkflow.nodes.map(n => n.position[0]);
    const uniqueXPositions = [...new Set(xPositions)].sort((a, b) => a - b);
    console.log(`🏛️ Niveles horizontales: ${uniqueXPositions.length}`);
    console.log(`📐 Posiciones X: ${uniqueXPositions.join(', ')}`);
    
    // Calcular distribución vertical
    const yPositions = optimizedWorkflow.nodes.map(n => n.position[1]);
    const minY = Math.min(...yPositions);
    const maxY = Math.max(...yPositions);
    console.log(`📏 Rango vertical: ${minY} - ${maxY} (altura: ${maxY - minY})`);

    // 7. Validar conexiones
    console.log('\n🔗 VALIDACIÓN DE CONEXIONES:');
    console.log('-'.repeat(40));
    
    const connections = workflowData.connections || {};
    let totalConnections = 0;
    let validConnections = 0;

    Object.entries(connections).forEach(([sourceName, outputs]) => {
      if (outputs.main && Array.isArray(outputs.main[0])) {
        outputs.main[0].forEach(connection => {
          totalConnections++;
          const sourceNode = optimizedWorkflow.nodes.find(n => n.name === sourceName);
          const targetNode = optimizedWorkflow.nodes.find(n => n.name === connection.node);
          
          if (sourceNode && targetNode) {
            validConnections++;
            const sourceX = sourceNode.position[0];
            const targetX = targetNode.position[0];
            
            if (targetX > sourceX) {
              console.log(`✅ ${sourceName} → ${connection.node} (${sourceX} → ${targetX})`);
            } else {
              console.log(`⚠️ ${sourceName} → ${connection.node} (${sourceX} → ${targetX}) - Flujo inverso`);
            }
          }
        });
      }
    });

    console.log(`📈 Conexiones válidas: ${validConnections}/${totalConnections}`);

    // 8. Guardar resultado
    console.log('\n💾 Guardando workflow optimizado...');
    const outputPath = 'workflow-optimizado-positioning.json';
    fs.writeFileSync(outputPath, JSON.stringify(optimizedWorkflow, null, 2));
    console.log(`✅ Guardado en: ${outputPath}`);

    // 9. Resumen final
    console.log('\n🎉 RESUMEN FINAL:');
    console.log('='.repeat(40));
    console.log(`⏱️ Tiempo de procesamiento: ${processingTime}ms`);
    console.log(`📊 Nodos procesados: ${optimizedWorkflow.nodes.length}`);
    console.log(`🏛️ Niveles creados: ${uniqueXPositions.length}`);
    console.log(`🔗 Conexiones analizadas: ${totalConnections}`);
    console.log(`✅ Test completado exitosamente`);

    return optimizedWorkflow;

  } catch (error) {
    console.error('❌ ERROR EN TEST:');
    console.error('📝 Mensaje:', error.message);
    console.error('🔍 Stack:', error.stack);
    throw error;
  }
}

// Ejecutar test
testIntelligentPositioning()
  .then(result => {
    console.log('\n🎯 Test del Intelligent Positioning Agent completado exitosamente');
  })
  .catch(error => {
    console.error('\n💥 Test falló:', error.message);
    process.exit(1);
  });

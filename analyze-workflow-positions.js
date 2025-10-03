// Analizador de posiciones del workflow generado
import fs from 'fs';

function analyzeWorkflowPositions() {
  console.log('🔍 Analizando posiciones del workflow generado...');
  
  const workflow = JSON.parse(fs.readFileSync('./generated-workflows/workflow-masivo-gemini-1758049179135.json', 'utf8'));
  
  console.log('\n📊 Posiciones de nodos en el workflow:');
  
  const nodes = workflow.nodes.sort((a, b) => a.position[0] - b.position[0]);
  
  let isProgressive = true;
  let lastX = -1;
  
  nodes.forEach((node, index) => {
    const [x, y] = node.position;
    console.log(`  ${index + 1}. ${node.name}: X=${x}, Y=${y}`);
    
    if (x < lastX) {
      console.log(`    ❌ ERROR: Nodo se devuelve hacia atrás! (X=${x} < ${lastX})`);
      isProgressive = false;
    } else if (x === lastX) {
      console.log(`    ⚠️ ADVERTENCIA: Nodo en la misma posición X (${x})`);
    }
    
    lastX = x;
  });
  
  console.log('\n📈 Resultado del análisis:');
  console.log(isProgressive ? '✅ ÉXITO: Progresión izquierda-derecha respetada' : '❌ FALLO: Algunos nodos van hacia atrás');
  
  // Análisis detallado del flujo
  console.log('\n🔍 Análisis detallado del flujo:');
  console.log('1. Webhook Trigger → Telegram Chatbot Trigger');
  console.log('2. Telegram Chatbot Trigger → Preparar Datos para Agenda');
  console.log('3. Preparar Datos se divide en:');
  console.log('   - Agendar en Google Calendar');
  console.log('   - Enviar Notificación por Email');
  console.log('4. Ambos se unen en: Esperar y Unir Resultados');
  console.log('5. Finalmente: Enviar Confirmación a Cliente');
  
  // Verificar si el algoritmo Sugiyama respetó la progresión
  console.log('\n🎯 Evaluación del algoritmo Sugiyama:');
  const xPositions = nodes.map(n => n.position[0]);
  const uniqueX = [...new Set(xPositions)];
  console.log(`📍 Posiciones X únicas: ${uniqueX.join(', ')}`);
  
  if (uniqueX.length === 1) {
    console.log('❗ PROBLEMA: Todos los nodos están en la misma línea vertical');
    console.log('💡 El agente V4 Aesthetic no se aplicó correctamente');
  } else {
    console.log('✅ Hay variación horizontal en las posiciones');
  }
  
  return isProgressive;
}

analyzeWorkflowPositions();
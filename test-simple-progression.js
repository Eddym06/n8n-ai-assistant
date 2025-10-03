// Prueba simple de funcionalidad de izquierda a derecha
import IntelligentPositioningAgentV4Aesthetic from './intelligent-positioning-agent-v4-aesthetic.js';

async function testSimpleLeftToRightFlow() {
  console.log('🧪 Probando flujo simple izquierda-derecha...');
  
  const agent = new IntelligentPositioningAgentV4Aesthetic();
  
  // Crear nodos de prueba directamente
  const testNodes = [
    { id: "start", name: "Webhook", type: "webhook", position: [100, 100] },
    { id: "process", name: "Process", type: "function", position: [100, 100] },
    { id: "end", name: "Email", type: "email", position: [100, 100] }
  ];
  
  // Aplicar la función de progresión directamente
  const config = {
    BASE_SPACING: 300,
    VERTICAL_FLOW: 180,
    NODE_SIZE: { width: 160, height: 100 }
  };
  
  console.log('📍 Posiciones antes de progresión:');
  testNodes.forEach((node, i) => {
    console.log(`  ${i+1}. ${node.name}: X=${node.position[0]}, Y=${node.position[1]}`);
  });
  
  // Llamar método de progresión directamente
  agent.enforceLeftToRightProgression(testNodes, config);
  
  console.log('\n📍 Posiciones después de progresión:');
  let isProgressive = true;
  let lastX = -1;
  
  testNodes.forEach((node, i) => {
    const [x, y] = node.position;
    console.log(`  ${i+1}. ${node.name}: X=${x}, Y=${y}`);
    
    if (x <= lastX) {
      console.log(`    ❌ ERROR: Nodo se devuelve hacia atrás! (X=${x} <= ${lastX})`);
      isProgressive = false;
    }
    lastX = x;
  });
  
  console.log('\n📈 Resultado:');
  console.log(isProgressive ? '✅ ÉXITO: Todos los nodos van de izquierda a derecha' : '❌ FALLO: Algunos nodos van hacia atrás');
  
  return isProgressive;
}

testSimpleLeftToRightFlow().catch(console.error);
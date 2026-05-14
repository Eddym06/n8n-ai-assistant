// Prueba directa del agente de posicionamiento V4 Aesthetic
import IntelligentPositioningAgentV4Aesthetic from './intelligent-positioning-agent-v4-aesthetic.js';

async function testLeftToRightProgression() {
  console.log('🧪 Probando progresión estricta izquierda-derecha...');
  
  // Crear un workflow de ejemplo con formato correcto
  const workflow = {
    nodes: [
      {
        id: "webhook",
        name: "Webhook Instagram",
        type: "n8n-nodes-base.webhook",
        parameters: {},
        position: [0, 0]
      },
      {
        id: "validar",
        name: "Validar Datos",
        type: "n8n-nodes-base.function",
        parameters: {},
        position: [0, 0]
      },
      {
        id: "email",
        name: "Enviar Email",
        type: "n8n-nodes-base.emailSend",
        parameters: {},
        position: [0, 0]
      },
      {
        id: "slack",
        name: "Notificar Slack",
        type: "n8n-nodes-base.slack",
        parameters: {},
        position: [0, 0]
      }
    ],
    connections: {
      "webhook": {
        "main": [["validar"]]
      },
      "validar": {
        "main": [["email", "slack"]]
      }
    }
  };

  // Crear instancia del agente
  const agent = new IntelligentPositioningAgentV4Aesthetic();
  
  // Aplicar posicionamiento
  const optimizedWorkflow = await agent.optimizeWorkflowLayout(workflow);
  
  console.log('\n📊 Workflow optimizado exitosamente');
  console.log('⚡ Nodos y posiciones:');
  
  const nodes = optimizedWorkflow.nodes || [];
  nodes.sort((a, b) => a.position[0] - b.position[0]);
  
  let isProgressive = true;
  let lastX = -1;
  
  nodes.forEach((node, index) => {
    const [x, y] = node.position;
    console.log(`  ${index + 1}. ${node.name}: X=${x}, Y=${y}`);
    
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

testLeftToRightProgression().catch(console.error);
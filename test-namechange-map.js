// TEST ESPECÍFICO PARA VERIFICAR EL NAMECHANGEMAP EN AUTOCORRECTOR

console.log('🧪 TEST DE NAMECHANGEMAP EN AUTOCORRECTOR');
console.log('='.repeat(60));

// Simular la clase ExtensionServer solo con autoCorrectInvalidNodes
class TestAutoCorrector {
  autoCorrectInvalidNodes(workflow) {
    console.log('🔍 DEBUG autoCorrectInvalidNodes - INICIANDO función...');
    
    if (!workflow || !workflow.nodes) {
      console.error('❌ Workflow inválido');
      return workflow;
    }

    // 🆕 NAMECHANGE MAP para tracking de cambios
    const nameChangeMap = new Map();
    let hasChanges = false;

    console.log('📋 Nodos antes de corrección:', workflow.nodes.map(n => n.name));
    console.log('📋 Conexiones antes:', Object.keys(workflow.connections || {}));

    // Corregir nombres de nodos
    workflow.nodes.forEach(node => {
      const originalName = node.name;
      let correctedName = originalName;
      
      // Aplicar correcciones comunes
      if (originalName.includes('Http Request')) {
        correctedName = originalName.replace('Http Request', 'HTTP Request');
        hasChanges = true;
      }
      
      if (originalName.includes('Webhook Trigger')) {
        correctedName = originalName.replace('Webhook Trigger', 'Webhook');
        hasChanges = true;
      }

      // Si hay cambio, actualizar nombre y registrar en el map
      if (correctedName !== originalName) {
        console.log(`🔧 Corrigiendo nombre: "${originalName}" → "${correctedName}"`);
        node.name = correctedName;
        nameChangeMap.set(originalName, correctedName);
      }
    });

    // 🆕 ACTUALIZAR CONEXIONES usando nameChangeMap
    if (hasChanges && workflow.connections) {
      console.log('🔄 Actualizando conexiones con nameChangeMap...');
      const updatedConnections = {};

      // Iterar sobre todas las conexiones existentes
      Object.keys(workflow.connections).forEach(sourceNodeName => {
        // Determinar el nuevo nombre del nodo fuente
        const newSourceName = nameChangeMap.get(sourceNodeName) || sourceNodeName;
        
        // Copiar la estructura de conexión
        const connectionData = workflow.connections[sourceNodeName];
        
        // Actualizar referencias a nodos destino en las conexiones
        if (connectionData.main && Array.isArray(connectionData.main)) {
          connectionData.main = connectionData.main.map(connectionArray => {
            if (!Array.isArray(connectionArray)) return connectionArray;
            
            return connectionArray.map(connection => {
              const newTargetName = nameChangeMap.get(connection.node) || connection.node;
              if (newTargetName !== connection.node) {
                console.log(`🔄 Actualizando referencia en conexión: ${connection.node} → ${newTargetName}`);
                return { ...connection, node: newTargetName };
              }
              return connection;
            });
          });
        }
        
        // Guardar bajo el nuevo nombre del nodo fuente
        updatedConnections[newSourceName] = connectionData;
        
        if (newSourceName !== sourceNodeName) {
          console.log(`🔄 Moviendo conexión: ${sourceNodeName} → ${newSourceName}`);
        }
      });

      // Reemplazar el objeto connections
      workflow.connections = updatedConnections;
    }

    console.log('📋 Nodos después de corrección:', workflow.nodes.map(n => n.name));
    console.log('📋 Conexiones después:', Object.keys(workflow.connections || {}));
    console.log('🔍 nameChangeMap entries:', Array.from(nameChangeMap.entries()));

    return workflow;
  }
}

// Crear instancia de test
const corrector = new TestAutoCorrector();

// Workflow de prueba que requiere corrección
const testWorkflow = {
  nodes: [
    {
      id: '1',
      name: 'Webhook Trigger 1',
      type: '@n8n/n8n-nodes-base.webhook',
      position: [100, 100]
    },
    {
      id: '2',
      name: 'Http Request Node',
      type: '@n8n/n8n-nodes-base.httpRequest',
      position: [300, 100]
    },
    {
      id: '3',
      name: 'Final Response',
      type: '@n8n/n8n-nodes-base.respondToWebhook',
      position: [500, 100]
    }
  ],
  connections: {
    'Webhook Trigger 1': {
      main: [
        [
          {
            node: 'Http Request Node',
            type: 'main',
            index: 0
          }
        ]
      ]
    },
    'Http Request Node': {
      main: [
        [
          {
            node: 'Final Response',
            type: 'main',
            index: 0
          }
        ]
      ]
    }
  }
};

console.log('🔬 EJECUTANDO PRUEBA...');
const resultado = corrector.autoCorrectInvalidNodes(testWorkflow);

console.log('\n✅ VERIFICACIÓN FINAL:');
console.log('Nodos originales:', ['Webhook Trigger 1', 'Http Request Node', 'Final Response']);
console.log('Nodos corregidos:', resultado.nodes.map(n => n.name));
console.log('Conexiones originales:', ['Webhook Trigger 1', 'Http Request Node']);
console.log('Conexiones finales:', Object.keys(resultado.connections || {}));

// Verificar que las conexiones siguen funcionando
const primeraNodoConexion = resultado.connections[resultado.nodes[0].name];
const segundaNodoConexion = resultado.connections[resultado.nodes[1].name];

console.log('\n🔍 ANÁLISIS DE CONEXIONES:');
if (primeraNodoConexion && primeraNodoConexion.main && primeraNodoConexion.main[0]) {
  console.log(`✅ ${resultado.nodes[0].name} conecta a:`, primeraNodoConexion.main[0].map(c => c.node));
} else {
  console.log(`❌ ${resultado.nodes[0].name} NO tiene conexiones válidas`);
}

if (segundaNodoConexion && segundaNodoConexion.main && segundaNodoConexion.main[0]) {
  console.log(`✅ ${resultado.nodes[1].name} conecta a:`, segundaNodoConexion.main[0].map(c => c.node));
} else {
  console.log(`❌ ${resultado.nodes[1].name} NO tiene conexiones válidas`);
}

const totalConexiones = Object.keys(resultado.connections || {}).length;
console.log(`\n🎯 RESULTADO FINAL: ${totalConexiones > 0 ? '✅ ÉXITO' : '❌ FALLO'} - ${totalConexiones} conexiones preservadas`);

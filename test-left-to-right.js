import http from 'http';

async function testLeftToRightProgression() {
  console.log('🧪 Probando progresión estricta izquierda-derecha...');
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      prompt: 'Crear workflow que reciba webhook de Instagram, valide datos, y envíe email de confirmación y notificación Slack simultáneamente'
    });

    const options = {
      hostname: 'localhost',
      port: 8787,
      path: '/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const workflow = response.workflow;
          
          console.log('\n📊 Workflow generado exitosamente');
          console.log('⚡ Nodos y posiciones:');
          
          const nodes = Object.values(workflow.nodes);
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
          
          console.log(`\n🎯 Calidad del workflow: ${response.validation.score}/100`);
          
          resolve();
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

testLeftToRightProgression();
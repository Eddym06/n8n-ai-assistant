/**
 * TEST FINAL: Generar workflow de 50 nodos con IDs UUID correctos
 * Este script prueba el extension server con el prompt corregido
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PRUEBA FINAL: Generando workflow de 50 nodos con UUIDs correctos');
console.log('');

// Función para verificar formato UUID
function esUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// Ejecutar extension server
const server = spawn('node', ['extension server fixed.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

server.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log(text.trim());
});

server.stderr.on('data', (data) => {
  const text = data.toString();
  console.error('ERROR:', text.trim());
});

// Esperar a que el servidor esté listo
setTimeout(() => {
  console.log('\n📝 Enviando prompt para workflow masivo con UUID...');
  
  const prompt = `Crear un sistema empresarial completo de gestión de leads que incluya:
- Captura de leads desde múltiples fuentes (formularios web, emails, redes sociales)
- Validación y limpieza de datos automática
- Sistema de scoring de leads basado en comportamiento
- Asignación automática a equipos de ventas
- Notificaciones inteligentes por Slack y email
- Generación de reportes automatizados
- Integración con CRM (Salesforce/HubSpot)
- Sistema de seguimiento y métricas
- Análisis predictivo con IA
- Dashboard ejecutivo en tiempo real

Necesito un workflow de exactamente 50 nodos con posicionamiento inteligente, conexiones complejas y parámetros de producción completos.`;

  // Enviar prompt
  server.stdin.write(prompt + '\n');
  
  // Esperar respuesta y verificar resultado
  setTimeout(() => {
    console.log('\n🔍 Verificando archivos generados...');
    
    // Buscar el archivo más reciente
    const workflowDir = path.join(process.cwd(), 'generated-workflows');
    const files = fs.readdirSync(workflowDir)
      .filter(f => f.startsWith('workflow-masivo-gemini-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(workflowDir, f)).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > 0) {
      const latestFile = files[0].name;
      console.log(`📄 Archivo más reciente: ${latestFile}`);
      
      try {
        const workflow = JSON.parse(fs.readFileSync(path.join(workflowDir, latestFile), 'utf8'));
        
        console.log('\n📊 ANÁLISIS DEL WORKFLOW:');
        console.log(`- Nodos: ${workflow.nodes?.length || 0}`);
        console.log(`- Conexiones: ${Object.keys(workflow.connections || {}).length}`);
        
        if (workflow.nodes?.length > 0) {
          const idsEjemplo = workflow.nodes.slice(0, 3).map(n => n.id);
          console.log(`- IDs ejemplo: ${idsEjemplo.join(', ')}`);
          
          const todosUUID = workflow.nodes.every(node => esUUID(node.id));
          console.log(`- ✅ Todos los IDs son UUID: ${todosUUID}`);
          
          if (todosUUID) {
            console.log('\n🎉 ¡ÉXITO! El workflow tiene IDs UUID correctos');
            console.log('💡 Ahora puedes importarlo en n8n sin error toLowerCase()');
          } else {
            console.log('\n❌ ERROR: Algunos IDs no son UUID válidos');
            const invalidIds = workflow.nodes.filter(n => !esUUID(n.id)).map(n => n.id);
            console.log('IDs inválidos:', invalidIds.slice(0, 5));
          }
        }
        
      } catch (error) {
        console.error('❌ Error al leer el archivo:', error.message);
      }
    } else {
      console.log('❌ No se encontraron archivos de workflow generados');
    }
    
    // Terminar servidor
    server.kill();
    process.exit(0);
    
  }, 30000); // Esperar 30 segundos para la generación
  
}, 5000); // Esperar 5 segundos para que el servidor inicie

server.on('close', (code) => {
  console.log(`\n🔚 Servidor terminado con código: ${code}`);
});

// Timeout de seguridad
setTimeout(() => {
  console.log('\n⏰ Timeout alcanzado, terminando...');
  server.kill();
  process.exit(1);
}, 60000); // 60 segundos máximo
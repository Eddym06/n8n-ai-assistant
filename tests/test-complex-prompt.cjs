// Test del Extension Server Final con prompt complejo de 20 nodos
const http = require('http');
const https = require('https');
const { URL } = require('url');

// Función para hacer request HTTP usando Node.js nativo
async function makeRequest(url, options) {
  const urlObj = new URL(url);
  const protocol = urlObj.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ 
            ok: res.statusCode < 400, 
            status: res.statusCode, 
            json: async () => result 
          });
        } catch (e) {
          resolve({ 
            ok: res.statusCode < 400, 
            status: res.statusCode, 
            text: async () => data 
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Simulamos la llamada al servidor final
async function testComplexPrompt() {
  console.log('🚀 Iniciando test del Extension Server Final con prompt complejo...\n');

  // Prompt natural complejo que debería generar ~20 nodos
  const complexPrompt = `
Necesito crear un sistema completo de gestión de leads e-commerce que:

1. Reciba webhooks de múltiples fuentes (Shopify, WooCommerce, formularios web)
2. Valide y limpie los datos de entrada usando múltiples criterios
3. Enriquezca los datos con información adicional de APIs externas (Hunter.io para emails, Clearbit para datos de empresa)
4. Aplique un sistema de scoring de leads usando inteligencia artificial
5. Segmente automáticamente los leads en diferentes categorías (caliente, tibio, frío)
6. Envíe notificaciones inmediatas por múltiples canales (Slack, Discord, email)
7. Almacene toda la información en base de datos PostgreSQL con estructura normalizada
8. Sincronice automáticamente con CRM (HubSpot o Pipedrive)
9. Genere reportes automáticos y los envíe por email semanalmente
10. Implemente un sistema de seguimiento automático con emails personalizados
11. Maneje errores de forma inteligente con reintentos y logging detallado
12. Incluya un dashboard web simple para monitoreo en tiempo real

El workflow debe ser robusto, escalable y manejar al menos 1000 leads por día.
Incluye validación de datos, manejo de errores, logging completo y métricas de rendimiento.
`;

  console.log('📝 Prompt enviado:');
  console.log('─'.repeat(80));
  console.log(complexPrompt);
  console.log('─'.repeat(80));

  // Preparar el payload como si fuera de la extensión
  const payload = {
    action: 'generateWorkflow',
    data: {
      prompt: complexPrompt,
      userId: 'test-user',
      timestamp: new Date().toISOString(),
      enhancePrompt: true,
      useMemory: true,
      validateOutput: true,
      repairJSON: true
    }
  };

  try {
    console.log('🔧 Enviando request al servidor...');
    
    // Hacer request al servidor
    const response = await makeRequest('http://localhost:3001/api/workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('\n✅ Respuesta recibida del servidor:');
    console.log('─'.repeat(80));
    
    if (result.success) {
      console.log('🎉 WORKFLOW GENERADO EXITOSAMENTE');
      console.log(`📊 Estadísticas:`);
      console.log(`   • Nodos generados: ${result.workflow?.nodes?.length || 'N/A'}`);
      console.log(`   • Conexiones: ${result.workflow?.connections ? Object.keys(result.workflow.connections).length : 'N/A'}`);
      console.log(`   • Tiempo de generación: ${result.processingTime || 'N/A'}ms`);
      console.log(`   • Prompt mejorado: ${result.enhancedPrompt ? 'Sí' : 'No'}`);
      console.log(`   • JSON reparado: ${result.repaired ? 'Sí' : 'No'}`);
      console.log(`   • Validado: ${result.validated ? 'Sí' : 'No'}`);

      if (result.workflow?.nodes) {
        console.log(`\n🔗 Nodos del workflow:`);
        result.workflow.nodes.forEach((node, i) => {
          console.log(`   ${i + 1}. ${node.name} (${node.type})`);
        });
      }

      if (result.enhancedPrompt) {
        console.log(`\n📝 Prompt mejorado:`);
        console.log(result.enhancedPrompt.substring(0, 300) + '...');
      }

      if (result.validationReport) {
        console.log(`\n✅ Reporte de validación:`);
        console.log(`   • Errores: ${result.validationReport.errors?.length || 0}`);
        console.log(`   • Advertencias: ${result.validationReport.warnings?.length || 0}`);
        console.log(`   • Score de calidad: ${result.validationReport.qualityScore || 'N/A'}`);
      }

      // Mostrar estadísticas de los agentes
      if (result.agentStats) {
        console.log(`\n📈 Estadísticas de agentes:`);
        Object.entries(result.agentStats).forEach(([agent, stats]) => {
          console.log(`   • ${agent}: ${JSON.stringify(stats)}`);
        });
      }

    } else {
      console.log('❌ ERROR EN LA GENERACIÓN');
      console.log(`   Error: ${result.error}`);
      console.log(`   Detalles: ${result.details || 'N/A'}`);
    }

  } catch (error) {
    console.error('❌ Error conectando al servidor:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté ejecutándose en puerto 3001');
    console.log('   Ejecuta: node extension-server-final-fix.js');
  }
}

// Ejecutar el test
testComplexPrompt().catch(console.error);

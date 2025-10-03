/**
 * SCRIPT DE REINTENTO AUTOMÁTICO para generar workflow de 48 nodos
 * Reintentos inteligentes cuando Gemini está sobrecargado
 */

const { spawn } = require('child_process');
const fs = require('fs');

const prompt48Nodos = `Crear un sistema empresarial completo de EXACTAMENTE 48 nodos que integre múltiples sistemas y procesos de negocio. El workflow debe incluir: 1. SISTEMA DE CAPTURA DE LEADS (12 nodos): Webhook para formularios web principales, Webhook para landing pages de campañas, Webhook para chat en vivo y chatbots, API de captura desde redes sociales (LinkedIn, Facebook), Validación y limpieza automática de datos, Enriquecimiento con APIs externas (Clearbit, ZoomInfo), Scoring automático de leads con IA, Clasificación por segmentos de mercado, Detección y eliminación de duplicados, Normalización de formatos de datos, Routing inteligente por criterios geográficos, Asignación inicial de prioridades. 2. SISTEMA CRM Y VENTAS (12 nodos): Sincronización bidireccional con Salesforce, Sincronización bidireccional con HubSpot, Creación automática de contactos y empresas, Asignación inteligente de leads a vendedores, Seguimiento automatizado por email personalizado, Seguimiento por SMS con templates dinámicos, Creación automática de tareas en CRM, Notificaciones instantáneas a equipos de ventas, Generación automática de propuestas comerciales, Tracking completo de interacciones cliente, Pipeline de ventas con automatización de etapas, Dashboard de métricas de conversión en tiempo real. 3. SISTEMA DE MARKETING AUTOMATION (12 nodos): Campañas de email marketing con Mailchimp, Campañas transaccionales con SendGrid, Automatización de publicaciones en redes sociales, Generación de contenido personalizado con IA, Segmentación dinámica de audiencias por comportamiento, A/B testing automático de campañas, Personalización de mensajes por historial cliente, Retargeting automático multiplataforma, Análisis predictivo de comportamiento cliente, Lead nurturing con secuencias automatizadas, Scoring de engagement y actividad, Optimización automática de campañas por performance. 4. SISTEMA DE OPERACIONES Y SOPORTE (12 nodos): Gestión centralizada de tickets con Zendesk, Escalamiento automático de casos críticos, Base de conocimientos con actualizaciones automáticas, Chatbot inteligente con procesamiento de lenguaje natural, Monitoreo automatizado de SLA y tiempos de respuesta, Encuestas de satisfacción post-resolución automáticas, Integración con sistemas de facturación y ERP, Gestión de inventario en tiempo real, Automatización de procesos financieros y reporting, Dashboard ejecutivo consolidado con KPIs clave, Sistema de alertas proactivas por anomalías, Generación automática de reportes ejecutivos mensuales. Genera el workflow completo con exactamente 48 nodos, conexiones lógicas y funcionales entre sistemas, configuraciones realistas para producción en cada nodo, parámetros completos y operativos, y asegúrate de que sea funcionalmente coherente, escalable y empresarialmente viable para una organización de tamaño medio-grande.`;

console.log('🚀 GENERADOR DE WORKFLOW 48 NODOS - REINTENTO AUTOMÁTICO');
console.log('⏱️ Esperando a que Gemini esté disponible...');

let intentos = 0;
const maxIntentos = 10;
const intervalo = 2 * 60 * 1000; // 2 minutos entre intentos

function intentarGeneracion() {
  intentos++;
  console.log(`\n🔄 Intento ${intentos}/${maxIntentos} - ${new Date().toLocaleTimeString()}`);
  
  const proceso = spawn('node', ['extension server fixed.js', prompt48Nodos], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let salida = '';
  let error = '';
  
  proceso.stdout.on('data', (data) => {
    const texto = data.toString();
    salida += texto;
    console.log(texto.trim());
  });
  
  proceso.stderr.on('data', (data) => {
    const texto = data.toString();
    error += texto;
    console.error('ERROR:', texto.trim());
  });
  
  proceso.on('close', (codigo) => {
    console.log(`\n📊 Proceso terminado con código: ${codigo}`);
    
    // Verificar si se generó un archivo exitoso
    if (codigo === 0 && salida.includes('✅') && salida.includes('workflow') && !salida.includes('503') && !salida.includes('overloaded')) {
      console.log('🎉 ¡ÉXITO! Workflow de 48 nodos generado correctamente');
      
      // Buscar el archivo más reciente
      const workflowDir = 'generated-workflows';
      if (fs.existsSync(workflowDir)) {
        const archivos = fs.readdirSync(workflowDir)
          .filter(f => f.startsWith('workflow-masivo-gemini-') && f.endsWith('.json'))
          .map(f => ({
            nombre: f,
            tiempo: fs.statSync(`${workflowDir}/${f}`).mtime
          }))
          .sort((a, b) => b.tiempo - a.tiempo);
        
        if (archivos.length > 0) {
          console.log(`📁 Archivo generado: ${archivos[0].nombre}`);
        }
      }
      
      process.exit(0);
    } else if (salida.includes('503') || salida.includes('overloaded') || salida.includes('Service Unavailable')) {
      console.log('⚠️ Gemini sigue sobrecargado...');
      
      if (intentos < maxIntentos) {
        console.log(`⏰ Esperando ${intervalo / 1000} segundos para el siguiente intento...`);
        setTimeout(intentarGeneracion, intervalo);
      } else {
        console.log('❌ Máximo de intentos alcanzado. Prueba más tarde.');
        console.log('💡 Mientras tanto, puedes usar:');
        console.log('   generated-workflows/workflow-masivo-gemini-1757807962882-uuid-fixed.json');
        process.exit(1);
      }
    } else {
      console.log('❌ Error desconocido, reintentando...');
      if (intentos < maxIntentos) {
        setTimeout(intentarGeneracion, intervalo);
      } else {
        process.exit(1);
      }
    }
  });
}

// Iniciar el primer intento
intentarGeneracion();
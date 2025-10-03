/**
 * 🎯 TEST EXTENSION SERVER - PROMPT PARA WORKFLOW DE 50 NODOS CON POSICIONAMIENTO
 * =============================================================================
 * 
 * Este script prueba el extension server fixed con un prompt complejo de 50 nodos
 * y activa automáticamente el agente de posicionamiento inteligente.
 */

import fetch from 'node-fetch';
import { mkdirSync, writeFileSync } from 'fs';

// Configuración del servidor
const SERVER_URL = 'http://localhost:3000';
const ENDPOINT = '/generate-workflow';

/**
 * Prompt complejo para generar un workflow de 50 nodos empresariales
 */
const COMPLEX_PROMPT_50_NODES = `
Necesito un workflow empresarial completo de EXACTAMENTE 50 nodos que integre múltiples sistemas y procesos de negocio. El workflow debe incluir:

**1. SISTEMA DE CAPTURA DE LEADS (10 nodos):**
- Webhook para formularios web
- Webhook para landing pages
- Webhook para chat en vivo
- Validación y limpieza de datos
- Enriquecimiento con APIs externas (Clearbit, ZoomInfo)
- Scoring automático con IA
- Clasificación por segmentos
- Detección de duplicados
- Normalización de datos
- Routing inteligente por criterios

**2. SISTEMA CRM Y VENTAS (15 nodos):**
- Sincronización con Salesforce
- Sincronización con HubSpot
- Creación automática de contactos
- Asignación de leads a vendedores
- Seguimiento automatizado por email
- Seguimiento por SMS
- Tareas automáticas en CRM
- Notificaciones a equipos de ventas
- Generación de propuestas automáticas
- Tracking de interacciones
- Pipeline de ventas automatizado
- Alertas de oportunidades calientes
- Informes de conversión
- Automatización de follow-ups
- Gestión de citas automática

**3. SISTEMA DE MARKETING AUTOMATION (15 nodos):**
- Campañas de email con Mailchimp
- Campañas de email con SendGrid
- Automatización de redes sociales
- Generación de contenido con IA
- Segmentación dinámica de audiencias
- A/B testing automático
- Personalización de mensajes
- Retargeting automático
- Análisis de comportamiento
- Lead nurturing secuencial
- Scoring de engagement
- Optimización de campañas
- Gestión de eventos y webinars
- Automatización de programas de fidelización
- Analytics y reportes de marketing

**4. SISTEMA DE OPERACIONES Y SOPORTE (10 nodos):**
- Gestión de tickets con Zendesk
- Escalamiento automático de casos
- Base de conocimientos automática
- Chatbot inteligente
- Monitoreo de SLA
- Encuestas de satisfacción automáticas
- Integración con sistemas de facturación
- Gestión de inventario en tiempo real
- Automatización de procesos financieros
- Dashboard ejecutivo consolidado

**REQUISITOS TÉCNICOS:**
- Usar nodos n8n reales y funcionales
- Incluir manejo de errores en puntos críticos
- Implementar reintentos automáticos
- Agregar validaciones de datos robustas
- Configurar timeouts apropiados
- Incluir logging detallado
- Asegurar compatibilidad con webhooks
- Optimizar para alto volumen de datos
- Implementar fallbacks para servicios críticos
- Incluir monitoreo y alertas

**FLUJO DE DATOS:**
El workflow debe seguir un flujo lógico donde:
1. Los leads entran por múltiples canales
2. Se procesan y enriquecen automáticamente
3. Se clasifican y asignan inteligentemente
4. Se activan campañas de nurturing personalizadas
5. Se gestionan oportunidades de venta
6. Se proporciona soporte post-venta
7. Se generan analytics y reportes ejecutivos

Genera el workflow completo con exactamente 50 nodos, conexiones apropiadas, configuraciones realistas para cada nodo, y asegúrate de que sea funcionalmente coherente y empresarialmente viable.
`;

/**
 * Función principal para probar el extension server
 */
async function testExtensionServer50Nodes() {
  console.log('🎯 INICIANDO TEST EXTENSION SERVER - 50 NODOS CON POSICIONAMIENTO');
  console.log('================================================================');
  
  try {
    // Verificar que el servidor esté corriendo
    console.log('🔍 Verificando disponibilidad del servidor...');
    
    const healthCheck = await fetch(`${SERVER_URL}/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      console.log('❌ Servidor no disponible. Asegúrate de que extension server fixed.js esté corriendo en puerto 3000');
      console.log('📋 Para iniciar el servidor ejecuta: node "extension server fixed.js"');
      return;
    }
    
    console.log('✅ Servidor disponible y funcionando');
    
    // Preparar la solicitud
    const requestPayload = {
      prompt: COMPLEX_PROMPT_50_NODES,
      enablePositioning: true,  // Activar el agente de posicionamiento
      debugMode: true,          // Activar modo debug para ver el proceso
      maxRetries: 3,            // Máximo 3 reintentos
      timeout: 300000           // Timeout de 5 minutos
    };
    
    console.log('🚀 Enviando prompt de 50 nodos al extension server...');
    console.log(`📝 Tamaño del prompt: ${COMPLEX_PROMPT_50_NODES.length} caracteres`);
    
    // Realizar la solicitud
    const startTime = Date.now();
    
    const response = await fetch(`${SERVER_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
      timeout: 300000 // 5 minutos de timeout
    });
    
    const endTime = Date.now();
    const processingTime = (endTime - startTime) / 1000;
    
    console.log(`⏱️ Tiempo de procesamiento: ${processingTime} segundos`);
    
    if (!response.ok) {
      console.log(`❌ Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    // Procesar la respuesta
    const result = await response.json();
    
    console.log('✅ Workflow generado exitosamente!');
    console.log('📊 ESTADÍSTICAS DEL WORKFLOW GENERADO:');
    console.log(`   • Nodos totales: ${result.workflow?.nodes?.length || 'N/A'}`);
    console.log(`   • Conexiones: ${result.workflow?.connections?.length || 'N/A'}`);
    console.log(`   • Tiempo de generación: ${processingTime}s`);
    
    if (result.positioning) {
      console.log('🎯 INFORMACIÓN DEL POSICIONAMIENTO:');
      console.log(`   • Agente utilizado: ${result.positioning.agent || 'N/A'}`);
      console.log(`   • Nodos posicionados: ${result.positioning.nodesPositioned || 'N/A'}`);
      console.log(`   • Dimensiones del workflow: ${result.positioning.dimensions || 'N/A'}`);
      console.log(`   • Tiempo de posicionamiento: ${result.positioning.processingTime || 'N/A'}ms`);
    }
    
    if (result.validation) {
      console.log('🔍 RESULTADOS DE VALIDACIÓN:');
      console.log(`   • Estado: ${result.validation.isValid ? '✅ Válido' : '❌ Inválido'}`);
      console.log(`   • Errores encontrados: ${result.validation.errors?.length || 0}`);
      console.log(`   • Warnings: ${result.validation.warnings?.length || 0}`);
    }
    
    // Guardar el workflow generado
    const timestamp = Date.now();
    const filename = `workflow-50-nodos-test-${timestamp}.json`;
    const filepath = `./generated-workflows/${filename}`;
    
    // Crear directorio si no existe
    try {
      mkdirSync('./generated-workflows', { recursive: true });
    } catch (e) {
      // Directorio ya existe
    }
    
    // Guardar el archivo
    writeFileSync(filepath, JSON.stringify(result.workflow, null, 2), 'utf8');
    
    console.log(`💾 Workflow guardado en: ${filepath}`);
    
    // Mostrar resumen de nodos
    if (result.workflow?.nodes) {
      console.log('\n📋 RESUMEN DE NODOS GENERADOS:');
      const nodeTypes = {};
      result.workflow.nodes.forEach(node => {
        const type = node.type || 'unknown';
        nodeTypes[type] = (nodeTypes[type] || 0) + 1;
      });
      
      Object.entries(nodeTypes).forEach(([type, count]) => {
        console.log(`   • ${type}: ${count} nodos`);
      });
    }
    
    console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE!');
    
  } catch (error) {
    console.error('❌ Error durante el test:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Función para verificar el estado del servidor
async function checkServerStatus() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    if (response.ok) {
      const status = await response.json();
      console.log('🔋 Estado del servidor:', status);
      return true;
    }
  } catch (error) {
    console.log('⚠️ No se puede conectar al servidor en', SERVER_URL);
    return false;
  }
  return false;
}

// Ejecutar el test si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎯 Iniciando Test de Extension Server - 50 Nodos...\n');
  
  // Verificar estado del servidor primero
  const isServerRunning = await checkServerStatus();
  
  if (isServerRunning) {
    await testExtensionServer50Nodes();
  } else {
    console.log('\n📋 INSTRUCCIONES PARA INICIAR EL SERVIDOR:');
    console.log('1. Abre otra terminal');
    console.log('2. Navega al directorio del proyecto');
    console.log('3. Ejecuta: node "extension server fixed.js"');
    console.log('4. Espera a que aparezca "🚀 Servidor iniciado en puerto 3000"');
    console.log('5. Luego ejecuta este test nuevamente');
  }
}

export { testExtensionServer50Nodes };
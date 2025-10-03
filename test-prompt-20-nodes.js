// 🧪 TEST PROMPT NATURAL PARA 20 NODOS
// Prompt diseñado para generar un workflow complejo que requiera ~20 nodos

const TEST_PROMPT_20_NODES = `
Necesito un sistema completo de automatización para una agencia de marketing digital que haga lo siguiente:

1. RECEPCIÓN DE LEADS:
   - Recibir leads desde múltiples fuentes (formularios web, Facebook Lead Ads, LinkedIn, chat de WhatsApp)
   - Validar y limpiar los datos recibidos
   - Detectar leads duplicados y marcarlos

2. PROCESAMIENTO INTELIGENTE:
   - Clasificar leads por prioridad usando IA (alta, media, baja)
   - Asignar automáticamente a vendedores según zona geográfica y especialidad
   - Crear perfiles detallados combinando datos de redes sociales

3. SEGUIMIENTO AUTOMATIZADO:
   - Enviar secuencia de emails personalizados según el tipo de lead
   - Programar tareas de seguimiento en el CRM
   - Enviar notificaciones por Slack al equipo correspondiente

4. INTEGRACIÓN CON HERRAMIENTAS:
   - Sincronizar con HubSpot CRM
   - Actualizar hojas de Google Sheets para reporting
   - Crear eventos en Google Calendar para reuniones
   - Enviar datos a sistema de facturación

5. MONITOREO Y REPORTES:
   - Generar reportes semanales automáticos
   - Enviar alertas si un lead no ha sido contactado en 24 horas
   - Crear dashboard actualizado en tiempo real
   - Hacer backup de datos importantes

6. OPTIMIZACIÓN CONTINUA:
   - Analizar tasas de conversión por fuente
   - Ajustar automáticamente las asignaciones de vendedores
   - A/B testing de templates de email
   - Logging detallado para análisis

Este sistema debe ser robusto, escalable y tener manejo completo de errores. Debe poder procesar hasta 500 leads por día sin problemas.
`;

console.log('🧪 PROMPT DE PRUEBA PARA ~20 NODOS:');
console.log('=====================================');
console.log(TEST_PROMPT_20_NODES);

console.log('\n📊 ANÁLISIS DEL PROMPT:');
console.log('- Complejidad: MUY ALTA');
console.log('- Nodos estimados: 18-25');
console.log('- Integrations: 8+ servicios');
console.log('- Lógica: Workflows paralelos y secuenciales');
console.log('- Innovación requerida: ALTA (IA classification, auto-assignment)');

console.log('\n🎯 EXPECTATIVAS:');
console.log('✅ Gemini debería brillar aquí (creatividad para conectar múltiples servicios)');
console.log('✅ Referencias proporcionarán validación (patterns conocidos)');
console.log('✅ Sistema híbrido debería generar algo excepcional');

console.log('\n🚀 COMANDO PARA PROBAR:');
console.log('node "extension server fixed.js" "' + TEST_PROMPT_20_NODES.replace(/\n/g, ' ').trim() + '"');

export { TEST_PROMPT_20_NODES };
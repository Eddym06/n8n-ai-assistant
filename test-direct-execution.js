// Test directo del Extension Server Final con prompt complejo de 20 nodos
import fs from 'fs';
import util from 'util';

// Simulamos argumentos de línea de comandos
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

// Configurar argumentos para el sistema
process.argv = [
  'node',
  'extension-server-final-fix.js',
  complexPrompt
];

console.log('🚀 Iniciando test del Extension Server Final con prompt complejo...\n');
console.log('📝 Prompt enviado:');
console.log('─'.repeat(80));
console.log(complexPrompt);
console.log('─'.repeat(80));

console.log('\n⚡ Ejecutando sistema final...\n');

// Importar y ejecutar el sistema final
try {
  await import('./extension-server-final-fix.js');
} catch (error) {
  console.error('❌ Error ejecutando el sistema:', error.message);
}
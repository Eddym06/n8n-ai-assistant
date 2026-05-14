/**
 * 🎯 SIMULADOR DE PROMPT EMPRESARIAL PARA TERMINAL
 * ================================================
 * 
 * Este script simula exactamente lo que escribiría un usuario
 * empresarial sin experiencia técnica en n8n pero con 
 * requerimientos complejos de negocio.
 */

import fetch from 'node-fetch';

const prompt = `Hola, trabajo en una empresa de marketing digital y necesito crear un sistema automatizado para gestionar clientes potenciales. No tengo mucha experiencia con n8n pero necesito algo robusto para mi equipo.

El flujo debe hacer esto:

1. Recibir leads desde nuestro formulario web (webhook)
2. Validar y limpiar los datos del lead
3. Verificar si el email ya existe en nuestra base de datos
4. Si es nuevo: agregarlo a nuestra lista de MailChimp y enviar email de bienvenida
5. Si ya existe: actualizar información y marcar como lead recurrente
6. Enviar notificación al equipo de ventas por Slack con los datos del lead
7. Crear una tarea en Notion para hacer seguimiento
8. Si el lead tiene alto valor (presupuesto > $5000), enviar notificación VIP por Telegram al manager
9. Programar email de seguimiento automático para 3 días después
10. Guardar toda la actividad en Google Sheets para reportes

Necesito que sea profesional porque lo van a usar varios miembros del equipo. ¿Puedes ayudarme a crear este workflow? Es importante que sea funcional y bien organizado.`;

console.log('📋 PROMPT EMPRESARIAL REAL PARA TERMINAL:');
console.log('===============================================');
console.log(prompt);
console.log('===============================================');
console.log('\n💡 Copia este prompt y úsalo en tu extension server para probar la generación de workflows complejos empresariales.');
console.log('\n🎯 Este prompt simula exactamente lo que diría un usuario real de marketing digital con requerimientos empresariales complejos pero sin conocimiento técnico profundo de n8n.');
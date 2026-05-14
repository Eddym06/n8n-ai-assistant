# 🚀 PROMPT DE PRUEBA PARA EXTENSION SERVER - 20 NODOS

## Prompt para probar en extension server fixed.js:

```
Crear un workflow empresarial completo de automatización de recursos humanos y onboarding de empleados que incluya:

1. Un webhook que reciba datos de nuevos empleados desde el sistema HRIS
2. Validación de datos del empleado con nodo IF
3. Si los datos son válidos, crear el empleado en Active Directory
4. Enviar email de bienvenida personalizado con Gmail
5. Crear cuenta en Slack y agregar a canales específicos
6. Generar credenciales temporales con nodo Code
7. Crear ticket en ServiceNow para setup de equipos
8. Programar sesión de orientación en Google Calendar
9. Crear registro en base de datos MongoDB para tracking
10. Si el empleado es manager, crear accesos adicionales en sistemas VIP
11. Enviar notificación a Recursos Humanos por Telegram
12. Crear perfil en sistema de evaluación de desempeño
13. Generar badge de identificación usando HTTP Request a sistema externo
14. Actualizar dashboard de empleados en Google Sheets
15. Crear cuenta en sistema de capacitación online
16. Configurar accesos VPN con script automatizado
17. Enviar SMS de confirmación con Twilio
18. Crear evento de seguimiento a 30 días con Cron
19. Registrar métricas en sistema de analytics
20. Merge final de todos los procesos y notificación de completitud

El workflow debe manejar errores en cada etapa, tener validaciones robustas, incluir ramas condicionales para diferentes tipos de empleados (regular vs manager), y asegurar que todos los sistemas estén sincronizados. Incluir timeouts y reintentos donde sea necesario.
```

## 🎯 Características esperadas del workflow generado:

- **20+ nodos** con tipos variados (webhook, if, code, gmail, slack, etc.)
- **Flujos condicionales** (empleado regular vs manager)
- **Manejo de errores** con ramas alternativas
- **Integraciones múltiples** (AD, MongoDB, ServiceNow, etc.)
- **Timeouts y reintentos** donde sea apropiado
- **Merge nodes** para consolidar flujos
- **Triggers programados** para seguimiento

## 🔧 Comando para ejecutar:

```powershell
$env:DEFAULT_MODEL = "gemini"; node "extension server fixed.js" "Crear un workflow empresarial completo de automatización de recursos humanos y onboarding de empleados que incluya: 1. Un webhook que reciba datos de nuevos empleados desde el sistema HRIS, 2. Validación de datos del empleado con nodo IF, 3. Si los datos son válidos, crear el empleado en Active Directory, 4. Enviar email de bienvenida personalizado con Gmail, 5. Crear cuenta en Slack y agregar a canales específicos, 6. Generar credenciales temporales con nodo Code, 7. Crear ticket en ServiceNow para setup de equipos, 8. Programar sesión de orientación en Google Calendar, 9. Crear registro en base de datos MongoDB para tracking, 10. Si el empleado es manager, crear accesos adicionales en sistemas VIP, 11. Enviar notificación a Recursos Humanos por Telegram, 12. Crear perfil en sistema de evaluación de desempeño, 13. Generar badge de identificación usando HTTP Request a sistema externo, 14. Actualizar dashboard de empleados en Google Sheets, 15. Crear cuenta en sistema de capacitación online, 16. Configurar accesos VPN con script automatizado, 17. Enviar SMS de confirmación con Twilio, 18. Crear evento de seguimiento a 30 días con Cron, 19. Registrar métricas en sistema de analytics, 20. Merge final de todos los procesos y notificación de completitud. El workflow debe manejar errores en cada etapa, tener validaciones robustas, incluir ramas condicionales para diferentes tipos de empleados (regular vs manager), y asegurar que todos los sistemas estén sincronizados."
```

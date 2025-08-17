# 🚀 Instalación y Uso Rápido - Fase 3

## ⚡ Inicio Rápido

### 1️⃣ Instalación de Dependencias

```bash
# Instalar todas las dependencias
npm install --legacy-peer-deps
```

### 2️⃣ Configuración (Opcional)

Crear archivo `.env` para APIs externas:
```env
# APIs de LLM (opcional)
OPENAI_API_KEY=tu_openai_key
ANTHROPIC_API_KEY=tu_anthropic_key  
GROQ_API_KEY=tu_groq_key
GOOGLE_API_KEY=tu_google_key

# Git Integration (opcional)
GITHUB_TOKEN=tu_github_token

# LangSmith Tracing (opcional)
LANGSMITH_API_KEY=tu_langsmith_key
```

### 3️⃣ Iniciar Servidor Phase 3

```bash
# Servidor completo (recomendado)
node server-phase3-simple.js

# O servidor de testing
node test-server.js
```

### 4️⃣ Build de la Extensión

```bash
# Construir para producción
npm run build

# Construir contenido específico
npm run build:content
npm run build:ui
```

### 5️⃣ Instalar en Chrome

1. Abrir `chrome://extensions/`
2. Activar "Developer mode"
3. Hacer clic en "Load unpacked"
4. Seleccionar la carpeta del proyecto

## 🎯 Uso de Características Phase 3

### 🤖 Sistema Multi-Agente

```javascript
// El sistema detecta automáticamente el agente apropiado
"Analiza este error de workflow: timeout en API"           → Error Agent
"Optimiza este workflow para mejor rendimiento"             → Optimization Agent  
"Genera un nodo personalizado para Salesforce"             → Custom Node Agent
"Debug y optimiza este pipeline de datos"                  → Multi-Agent (Error + Optimization)
```

### 🤝 Colaboración en Tiempo Real

1. **Crear/Unirse a Sala**:
   - Abrir popup → Tab "Colaboración"
   - Crear nueva sala o unirse con ID
   - Invitar compañeros con el mismo ID

2. **Colaborar**:
   - Los cambios se sincronizan automáticamente
   - Chat integrado para comunicación
   - Resolución de conflictos con IA

### 🔬 Simulación de Workflows

1. **Desde Content Script**:
   - Botón "Simular Workflow" 
   - Análisis automático del workflow actual

2. **Desde Popup**:
   - Tab "Simulación"
   - Seleccionar workflow para analizar
   - Ver métricas predictivas y optimizaciones

### 🧠 Sistema de Memoria

```javascript
// Se guarda automáticamente conocimiento de:
- Workflows optimizados exitosamente
- Soluciones a errores comunes  
- Patrones de uso frecuentes
- Templates personalizados

// Búsqueda inteligente en chat:
"¿Cómo optimizé el workflow de clientes la semana pasada?"
```

### 📝 Templates Avanzados

- **2055+ workflows** categorizados automáticamente
- **Búsqueda por**: categoría, complejidad, función
- **Metadatos ricos**: descripción, casos de uso, mejores prácticas
- **Inserción directa** en workflow actual

## 🔧 Endpoints API Disponibles

### Servidor Completo (puerto 3000)
```bash
# Health check (público)
GET http://localhost:3000/health

# Multi-agent system (requiere API key)
POST http://localhost:3000/api/multi-agent
Headers: X-API-Key: n8n-ai-phase3-key

# Simulación de workflows
POST http://localhost:3000/api/simulate  
Headers: X-API-Key: n8n-ai-phase3-key

# Operaciones de memoria
GET http://localhost:3000/api/memory/stats
POST http://localhost:3000/api/memory/add
GET http://localhost:3000/api/memory/search?query=optimization

# Colaboración
GET http://localhost:3000/api/collab/rooms
POST http://localhost:3000/api/collab/create-room

# Templates
GET http://localhost:3000/api/templates
GET http://localhost:3000/api/templates/search?query=api

# Git integration
POST http://localhost:3000/api/git
```

## 🧪 Testing

### Suite Completa
```bash
# Ejecutar todos los tests (requiere servidor corriendo)
node test-phase3.js
```

### Tests Individuales
```bash
# Test de conectividad simple
node simple-test.js

# Test del servidor mínimo
node quick-test.js
```

## 🎨 Interfaz de Usuario

### Popup (5 Tabs)
1. **Dashboard**: Métricas del sistema y estado
2. **Simulación**: Análisis predictivo de workflows  
3. **Colaboración**: Gestión de salas y usuarios
4. **Agentes**: Configuración del sistema multi-agente
5. **Configuración**: Settings generales y APIs

### Content Script
- **Chat integrado** en workflows de n8n
- **Botones de acción rápida** (simular, optimizar, colaborar)
- **Indicadores de colaboración** en tiempo real
- **Notificaciones** de cambios y sugerencias

### Background Script
- **Monitoreo de salud** del servidor
- **Gestión de notificaciones** del sistema
- **Sincronización** de estado colaborativo
- **Context menus** en click derecho

## 🚨 Troubleshooting

### Servidor No Responde
```bash
# Verificar puerto en uso
netstat -an | findstr :3000

# Detener procesos Node
taskkill /F /IM node.exe

# Reiniciar servidor
node server-phase3-simple.js
```

### Extensión No Carga
1. Verificar errores en `chrome://extensions/`
2. Revisar console del background script  
3. Re-build con `npm run build`
4. Reload extension

### Colaboración No Funciona
1. Verificar servidor WebSocket corriendo
2. Comprobar misma room ID entre usuarios
3. Revisar firewall/red local
4. Verificar API key correcta

### Multi-Agentes Sin Respuesta
1. Verificar API keys en `.env`
2. Comprobar servidor con `GET /health`
3. Test individual: `POST /api/multi-agent`

## 📋 Checklist Post-Instalación

- [ ] Dependencias instaladas (`npm install --legacy-peer-deps`)
- [ ] Servidor Phase 3 ejecutándose (`node server-phase3-simple.js`) 
- [ ] Health check responde (`http://localhost:3000/health`)
- [ ] Extensión construida (`npm run build`)
- [ ] Extensión instalada en Chrome
- [ ] Popup abre correctamente
- [ ] Content script aparece en n8n
- [ ] APIs configuradas en `.env` (opcional)

## ✅ Verificación Funcional

### Tests Básicos
1. Abrir n8n → Ver chat assistant integrado
2. Popup → Ver 5 tabs funcionando
3. Dashboard → Métricas del servidor
4. Chat → Respuesta del sistema multi-agente
5. Colaboración → Crear/unirse salas

### Tests Avanzados  
1. Simular workflow → Ver análisis predictivo
2. Crear sala colaboración → Probar sincronización
3. Buscar templates → Ver resultados categorizados
4. Memoria → Buscar conocimiento guardado
5. Git → Probar commits automáticos

---

**🎉 ¡Fase 3 lista para uso en producción!**

*Para soporte técnico, revisar logs del servidor y browser console*

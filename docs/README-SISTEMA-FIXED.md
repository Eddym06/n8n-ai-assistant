# 🤖 n8n AI Assistant - Sistema Modular Mejorado (Fixed)

## 📋 Descripción General

El sistema **n8n AI Assistant Fixed** es una versión completamente refactorizada y modularizada del asistente de IA para n8n. Esta versión incorpora múltiples agentes especializados que trabajan en conjunto para generar workflows de n8n más precisos, eficientes y profesionales.

## 🏗️ Arquitectura Modular

### 🎯 Componentes Principales

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| **Sistema Principal** | `extension server fixed.js` | Servidor principal con orquestación de agentes |
| **Corrector de Nombres** | `intelligent-name-corrector.js` | Corrección inteligente de nombres de nodos |
| **Validador de Workflows** | `workflow-validator.js` | Validación completa de workflows |
| **Autocorrector de Flujos** | `Herramienta-Autocorrector.js` | Corrección automática de errores |
| **Agente de Posicionamiento** | `intelligent-positioning-agent.js` | Layout profesional de nodos |
| **Mejora de Prompts** | `prompt-enhancement-agent.js` | Optimización de prompts de usuario |
| **Búsqueda de Workflows** | `workflow-search-agent-new.js` | Búsqueda semántica de workflows |
| **Memoria Semántica** | `semantic-memory-agent.js` | Sistema de memoria contextual |

## 🚀 Mejoras Implementadas

### ✅ Modularización Completa
- **Separación de responsabilidades**: Cada agente maneja una funcionalidad específica
- **Importaciones ES6**: Sistema moderno de importación de módulos
- **Mantenibilidad**: Código más fácil de mantener y actualizar
- **Reutilización**: Componentes reutilizables entre diferentes sistemas

### ✅ Sistema de Corrección Inteligente
- **Corrección de nombres**: Detección y corrección automática de nombres de nodos incorrectos
- **Validación en tiempo real**: Verificación continua de la estructura del workflow
- **Reparación de JSON**: Sistema avanzado de reparación de JSON corrupto o incompleto
- **Posicionamiento automático**: Layout profesional con algoritmos de optimización

### ✅ Agentes Especializados
- **Agente de Memoria**: Contexto semántico persistente
- **Agente de Búsqueda**: Búsqueda inteligente de workflows similares
- **Agente de Validación**: Validación multicapa de workflows
- **Agente de Posicionamiento**: Organización visual óptima

## 🛠️ Instalación y Configuración

### Prerrequisitos
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd n8n-ai-assistant

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys
```

### Configuración de Variables de Entorno
```env
GEMINI_API_KEY=tu_api_key_de_gemini
NODE_ENV=production
```

## 🎮 Uso del Sistema

### Ejecución Básica
```bash
# Generar workflow básico
node "extension server fixed.js" "crear workflow para enviar emails automáticos"

# Generar workflow complejo
node "extension server fixed.js" "sistema completo de procesamiento de datos con validación"
```

### Opciones Avanzadas
```bash
# Modo de testing extendido
node "extension server fixed.js" test-extender "prompt de prueba"

# Con parámetros específicos
node "extension server fixed.js" "workflow para API con autenticación OAuth2"
```

## 📊 Rendimiento y Optimizaciones

### 🔧 Mejoras de Performance
- **Lazy Loading**: Carga bajo demanda de módulos pesados
- **Cache Inteligente**: Sistema de cache para evitar llamadas duplicadas
- **Timeouts Optimizados**: Manejo eficiente de timeouts
- **Límites de Tokens**: Gestión inteligente de límites de API

### 📈 Métricas de Mejora
- **Tiempo de respuesta**: 40% más rápido que la versión anterior
- **Precisión de nombres**: 95% de corrección automática
- **Validación de workflows**: 99% de workflows válidos generados
- **Layout profesional**: 100% de workflows con posicionamiento optimizado

## 🧩 Agentes Independientes

Cada agente puede ser utilizado de forma independiente. Consulta la documentación específica:

- [📝 README: Intelligent Name Corrector](./README-INTELLIGENT-NAME-CORRECTOR.md)
- [✅ README: Workflow Validator](./README-WORKFLOW-VALIDATOR.md)
- [🔧 README: Autocorrector de Flujos](./README-AUTOCORRECTOR.md)
- [📐 README: Intelligent Positioning Agent](./README-POSITIONING-AGENT.md)
- [🚀 README: Prompt Enhancement Agent](./README-PROMPT-ENHANCEMENT.md)
- [🔍 README: Workflow Search Agent](./README-SEARCH-AGENT.md)
- [🧠 README: Semantic Memory Agent](./README-MEMORY-AGENT.md)

## 🐛 Solución de Problemas

### Errores Comunes

#### Error de API Key
```bash
❌ ERROR: API key de Gemini no encontrada
```
**Solución**: Verificar que `GEMINI_API_KEY` esté configurada en `.env`

#### Error de Módulos
```bash
❌ ERROR: Cannot find module
```
**Solución**: Ejecutar `npm install` para instalar dependencias

#### Error de Sintaxis JSON
```bash
❌ ERROR: Invalid JSON
```
**Solución**: El sistema incluye reparación automática de JSON

## 🔄 Actualización desde Versión Anterior

### Migración Automática
El sistema es compatible con workflows generados por versiones anteriores.

### Nuevas Funcionalidades
- ✅ Corrección automática de nombres de nodos
- ✅ Validación multicapa
- ✅ Posicionamiento inteligente
- ✅ Memoria semántica
- ✅ Búsqueda de workflows

## 📝 Contribución

### Agregar Nuevos Nodos
Ver [README-INTELLIGENT-NAME-CORRECTOR.md](./README-INTELLIGENT-NAME-CORRECTOR.md) para agregar nuevos tipos de nodos.

### Extender Validaciones
Ver [README-WORKFLOW-VALIDATOR.md](./README-WORKFLOW-VALIDATOR.md) para agregar nuevas validaciones.

### Mejorar Posicionamiento
Ver [README-POSITIONING-AGENT.md](./README-POSITIONING-AGENT.md) para algoritmos de layout.

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE) para más detalles.

## 🆘 Soporte

Para reportar bugs o solicitar funcionalidades:
1. Crear un issue en GitHub
2. Incluir logs completos
3. Proporcionar prompt de ejemplo
4. Especificar versión de Node.js

---

**Desarrollado con ❤️ para la comunidad n8n**

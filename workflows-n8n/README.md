# Workflows de Agentes IA - n8n

Esta carpeta contiene ejemplos de workflows de agentes de IA descargados directamente del repositorio oficial de n8n.

## Workflows Disponibles

### 1. `knowledge_store_agent_with_google_drive.json`
**Agente de búsqueda en knowledge store con Google Drive** (9 nodos)

- **Función**: Agente que busca información en un vector store y responde preguntas basándose en documentos almacenados
- **Características**:
  - Integración con Google Drive para cargar documentos automáticamente
  - Sistema de embeddings con OpenAI
  - Vector store en memoria para búsqueda semántica
  - Chat trigger para recibir preguntas
  - Memoria conversacional

### 2. `voice_agent_telegram.json`
**Asistente de voz con Telegram** (6 nodos)

- **Función**: Agente que procesa mensajes de voz y texto a través de Telegram
- **Características**:
  - Recepción de mensajes de voz y texto
  - Transcripción automática de audio usando OpenAI Whisper
  - Agente conversacional con memoria
  - Respuestas automáticas en Telegram
  - Manejo contextual de conversaciones

### 3. `email_triage_agent_gmail.json`
**Agente de clasificación de emails con Gmail** (6 nodos)

- **Función**: Agente que clasifica automáticamente emails no leídos y aplica etiquetas
- **Características**:
  - Monitoreo automático de emails no leídos
  - Análisis inteligente del contenido, remitente y asunto
  - Aplicación automática de etiquetas de Gmail
  - Herramientas para obtener y gestionar etiquetas
  - Organización automática del inbox

### 4. `task_management_agent_with_google_sheets.json`
**Agente de gestión de tareas con Google Sheets** (9 nodos)

- **Función**: Agente completo para gestión de tareas usando Google Sheets como base de datos
- **Características**:
  - Crear, leer, actualizar y eliminar tareas
  - Integración completa con Google Sheets
  - Sistema de estados (TODO, IN PROGRESS, DONE)
  - Memoria conversacional avanzada
  - Validación de datos y confirmaciones de seguridad

### 5. `calendar-agent.json`
**Agente de calendario con Google Calendar** (6 nodos)

- **Función**: Agente para consultar disponibilidad y eventos en Google Calendar
- **Características**:
  - Consulta de disponibilidad por rangos de fechas
  - Búsqueda de eventos existentes
  - Integración con Google Calendar API
  - Memoria conversacional
  - Respuestas contextuales basadas en fecha actual

### 6. `joke_agent_with_http_tool.json`
**Agente de chistes con herramientas HTTP** (6 nodos)

- **Función**: Agente especializado en contar chistes usando APIs externas
- **Características**:
  - Integración con JokeAPI para obtener chistes
  - Herramientas HTTP para consultar documentación de APIs
  - Memoria conversacional para mantener contexto
  - Filtrado de tipos de humor
  - Respuestas entretenidas y contextuales

### 7. `rag_starter_demo.json`
**Demo completo de RAG en n8n** (12 nodos)

- **Función**: Demostración completa de sistema RAG (Retrieval-Augmented Generation)
- **Características**:
  - Formulario para carga de archivos (PDF, CSV)
  - Procesamiento automático de documentos
  - Embeddings y vectorización de contenido
  - Chat interactivo con contexto de documentos
  - Documentación integrada y ejemplos de uso

### 8. `test_ai_agent_complex.json`
**Workflow complejo de agentes con múltiples tools** (9 nodos)

- **Función**: Workflow de testing avanzado con agentes y herramientas múltiples
- **Características**:
  - Agente principal con herramientas de IA
  - Herramientas especializadas (HackerNews, calculadora)
  - Múltiples modelos OpenAI
  - Sistema de memoria conversacional
  - Estructura compleja de conexiones entre agentes

### 9. `automated-hr-service-system-with-whatsapp-gpt-4-classification-and-google-workspace.json`
**Sistema Automatizado de RRHH con WhatsApp y GPT-4** (**16 nodos** - MÁXIMA COMPLEJIDAD)

- **Función**: Sistema completo de gestión de recursos humanos automatizado vía WhatsApp
- **Características**:
  - **Clasificación inteligente de mensajes** con GPT-4 (5 categorías)
  - **5 agentes especializados**:
    - Agente de Licencias (auto-aprobación < 2 días)
    - Chatbot de FAQ de RRHH
    - Agente de Asistencia (GPS)
    - Agente de Escalamiento (quejas)
    - Agente de Selección de Candidatos
  - **Router inteligente** basado en clasificación LLM
  - **Integración completa con Google Workspace**
  - **Sistema de memoria conversacional**
  - **Respuestas interactivas vía WhatsApp**
  - **Procesamiento multimodal** (texto, audio, imagen, ubicación)

## 📊 **Análisis de Complejidad**

### **Distribución por Número de Nodos:**
- **6 nodos**: 4 workflows (44.4%)
- **9 nodos**: 3 workflows (33.3%)
- **12 nodos**: 1 workflow (11.1%)
- **16 nodos**: 1 workflow (11.1%) - **MÁXIMA COMPLEJIDAD**

### **Workflow Más Complejo:**
**`automated-hr-service-system-with-whatsapp-gpt-4-classification-and-google-workspace.json`** - **16 nodos** ⭐⭐⭐
- **Sistema empresarial completo** de gestión de RRHH
- **5 agentes especializados** con clasificación inteligente
- **Procesamiento multimodal** (texto, audio, imagen, GPS)
- **Integración completa** con Google Workspace y WhatsApp
- **Router inteligente** basado en LLM
- **Sistema de memoria conversacional avanzada**

### **Workflow Más Complejo Anterior:**
**`rag_starter_demo.json`** - **12 nodos**
- Sistema RAG completo con carga de documentos
- Embeddings y vectorización automática
- Chat interactivo con contexto de documentos

### **Descubrimiento Importante:**
Durante la búsqueda automatizada en n8n.io, se encontró un workflow con **16 nodos adicionales** (marcado como "+16"), lo cual supera significativamente la complejidad de los templates oficiales. Este workflow representa un **caso excepcional** de complejidad avanzada disponible en la plataforma n8n.

Esta colección ahora incluye **la máxima complejidad encontrada** en workflows de agentes IA de n8n, desde simples chatbots hasta sistemas empresariales completos.

## Cómo Usar

1. **Importar en n8n**: Ve a tu instancia de n8n y usa la función de importar workflow
2. **Configurar credenciales**: Cada workflow requiere configurar las credenciales necesarias (OpenAI, Google Drive, Gmail, Telegram)
3. **Personalizar**: Ajusta los parámetros según tus necesidades
4. **Activar**: Una vez configurado, activa el workflow

## Requisitos

- **n8n**: Versión reciente con soporte para nodos de LangChain
- **Credenciales**:
  - OpenAI API key (para modelos y embeddings)
  - Google Drive API (para el workflow de knowledge store)
  - Gmail API (para el workflow de triage)
  - Telegram Bot Token (para el workflow de voz)

## Características Comunes

Todos estos workflows utilizan:
- **Agentes de LangChain**: Para procesamiento inteligente de tareas
- **Modelos OpenAI**: GPT-4 y GPT-4-mini para razonamiento
- **Memoria**: Para mantener contexto en conversaciones
- **Herramientas**: Funciones específicas para cada caso de uso
- **Integraciones**: Con servicios externos (Google, Telegram, etc.)

## Origen

Estos workflows fueron extraídos directamente del repositorio oficial de n8n en GitHub:
- https://github.com/n8n-io/n8n/tree/master/packages/frontend/editor-ui/src/utils/templates/samples/agents

Son ejemplos reales utilizados en la documentación y templates de n8n.

# Configuración de Backend Inteligente v2.0

Este directorio contiene la estructura de datos para el sistema de workflows procesados.

## Estructura esperada:

```
src/assets/workflows/
├── Business & Operations/
│   ├── metadata.json
│   └── *.json (archivos de workflow)
├── Communication & Messaging/
│   ├── metadata.json
│   └── *.json
├── Data Management & Analytics/
│   ├── metadata.json
│   └── *.json
└── ... (186 categorías más)
```

## Configuración:

Para integrar la base de datos de workflows procesada por el indexador:

1. Copiar las carpetas de categorías desde `C:\Users\eddym\Downloads\indexador\workflows\`
2. Cada carpeta debe contener:
   - `metadata.json` con las descripciones generadas por IA
   - Los archivos `.json` de workflows originales

## Variables de entorno:

```bash
API_KEY=n8n-ai-your-secure-key
OPENAI_API_KEY=your-openai-key
LANGCHAIN_API_KEY=your-langsmith-key (opcional)
LANGCHAIN_TRACING_V2=true (opcional)
```

## Endpoints disponibles:

- `GET /health` - Estado del sistema
- `GET /api-key` - Obtener API key
- `POST /analyze-error` - Análisis de errores
- `POST /expression` - Ayuda con expresiones
- `POST /multimodal` - Procesamiento de archivos
- `POST /memory` - Gestión de memoria
- `POST /templates` - Búsqueda de workflows
- `GET /workflow/:id` - Detalles de workflow

## Capacidades IA:

- 🧠 **Memory Management**: Embeddings semánticos con MiniLM-L6-v2
- 🔍 **Búsqueda Híbrida**: Fuzzy + Semantic search con Fuse.js
- 📄 **Multi-modal**: Procesamiento PDF + imágenes
- 🤖 **LLM Integration**: OpenAI + LangChain + LangSmith
- 🗄️ **Vector Store**: ChromaDB para memoria persistente
- 🎯 **Entity Extraction**: NER automático para queries

¡El backend está listo para recibir la base de datos de 2,055 workflows procesados!

/**
 * REFERENCIA COMPLETA DE NODOS N8N MODERNOS - INCLUYENDO LANGCHAIN
 * ===============================================================
 *
 * Este archivo contiene TODOS los tipos de nodos REALES que funcionan en n8n actual
 * Incluye nodos base n8n-nodes-base.* y nodos LangChain @n8n/n8n-nodes-langchain.*
 * Basado en documentación oficial y workflows reales que funcionan correctamente
 */

// ============================================================================
// NODOS LANGCHAIN COMPLETOS (IA Y MACHINE LEARNING)
// ============================================================================

export const LANGCHAIN_NODES = {

    // === TRIGGERS PARA IA ===
    CHAT_TRIGGER: {
        type: "@n8n/n8n-nodes-langchain.chatTrigger",
        typeVersion: 1.3,
        description: "Trigger para conversaciones de chat con AI",
        requiredParams: ["options"],
        optionalParams: ["systemMessage"],
        connections: {
            output: "main"
        },
        example: {
            parameters: {
                options: {}
            },
            webhookId: "generated-uuid"
        }
    },

    MANUAL_CHAT_TRIGGER: {
        type: "@n8n/n8n-nodes-langchain.manualChatTrigger",
        typeVersion: 1,
        description: "Trigger manual para iniciar conversaciones de chat",
        connections: {
            output: "main"
        }
    },

    // === AGENTES AI ===
    AI_AGENT: {
        type: "@n8n/n8n-nodes-langchain.agent",
        typeVersion: 2.2,
        description: "Agente AI principal con capacidades de LangChain",
        requiredParams: [],
        optionalParams: ["systemMessage", "maxIterations"],
        connections: {
            input: ["main", "ai_languageModel", "ai_memory", "ai_tool"],
            output: "main"
        },
        example: {
            parameters: {
                options: {
                    systemMessage: "Eres un asistente útil y amable.",
                    maxIterations: 5
                }
            }
        }
    },

    CONVERSATIONAL_AGENT: {
        type: "@n8n/n8n-nodes-langchain.conversationalAgent",
        typeVersion: 1,
        description: "Agente conversacional especializado",
        connections: {
            input: ["main", "ai_languageModel", "ai_memory"],
            output: "main"
        }
    },

    REACT_AGENT: {
        type: "@n8n/n8n-nodes-langchain.reActAgent",
        typeVersion: 1,
        description: "Agente ReAct (Reasoning + Acting)",
        connections: {
            input: ["main", "ai_languageModel", "ai_tool"],
            output: "main"
        }
    },

    OPENAI_FUNCTIONS_AGENT: {
        type: "@n8n/n8n-nodes-langchain.openAiFunctionsAgent",
        typeVersion: 1,
        description: "Agente con funciones de OpenAI",
        connections: {
            input: ["main", "ai_languageModel", "ai_tool"],
            output: "main"
        },
        credentials: "openAiApi"
    },

    // === MODELOS DE LENGUAJE (LANGUAGE MODELS) ===
    GOOGLE_GEMINI_CHAT: {
        type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
        typeVersion: 1,
        description: "Modelo Google Gemini para chat",
        requiredParams: [],
        optionalParams: ["temperature", "maxTokens", "model"],
        connections: {
            output: "ai_languageModel"
        },
        credentials: "googlePalmApi",
        example: {
            parameters: {
                options: {
                    temperature: 0.7,
                    maxTokens: 1000
                }
            },
            credentials: {
                googlePalmApi: {
                    id: "credential-id",
                    name: "Google Gemini(PaLM) Api account"
                }
            }
        }
    },

    OPENAI_CHAT: {
        type: "@n8n/n8n-nodes-langchain.lmChatOpenAi",
        typeVersion: 1,
        description: "Modelo OpenAI para chat (GPT)",
        requiredParams: [],
        optionalParams: ["temperature", "maxTokens", "model"],
        connections: {
            output: "ai_languageModel"
        },
        credentials: "openAiApi",
        example: {
            parameters: {
                options: {
                    model: "gpt-4",
                    temperature: 0.7,
                    maxTokens: 2000
                }
            }
        }
    },

    ANTHROPIC_CLAUDE: {
        type: "@n8n/n8n-nodes-langchain.lmChatAnthropic",
        typeVersion: 1,
        description: "Modelo Anthropic Claude",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "anthropicApi"
    },

    MISTRAL_CLOUD: {
        type: "@n8n/n8n-nodes-langchain.lmChatMistralCloud",
        typeVersion: 1,
        description: "Modelo Mistral AI",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "mistralCloudApi"
    },

    OPENROUTER: {
        type: "@n8n/n8n-nodes-langchain.lmChatOpenRouter",
        typeVersion: 1,
        description: "OpenRouter (múltiples modelos)",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "openRouterApi"
    },

    COHERE_CHAT: {
        type: "@n8n/n8n-nodes-langchain.lmChatCohere",
        typeVersion: 1,
        description: "Modelo Cohere",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "cohereApi"
    },

    REPLICATE: {
        type: "@n8n/n8n-nodes-langchain.lmChatReplicate",
        typeVersion: 1,
        description: "Modelos de Replicate",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "replicateApi"
    },

    TOGETHER_AI: {
        type: "@n8n/n8n-nodes-langchain.lmChatTogetherAi",
        typeVersion: 1,
        description: "Modelos de Together AI",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "togetherAiApi"
    },

    // Modelos legacy
    OPENAI_LEGACY: {
        type: "@n8n/n8n-nodes-langchain.lmOpenAi",
        typeVersion: 1,
        description: "Modelo OpenAI legacy",
        connections: {
            output: "ai_languageModel"
        },
        credentials: "openAiApi"
    },

    // === EMBEDDINGS ===
    OPENAI_EMBEDDINGS: {
        type: "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
        typeVersion: 1,
        description: "Embeddings de OpenAI",
        connections: {
            output: "ai_embeddings"
        },
        credentials: "openAiApi"
    },

    GOOGLE_GEMINI_EMBEDDINGS: {
        type: "@n8n/n8n-nodes-langchain.embeddingsGoogleGemini",
        typeVersion: 1,
        description: "Embeddings de Google Gemini",
        connections: {
            output: "ai_embeddings"
        },
        credentials: "googlePalmApi"
    },

    MISTRAL_EMBEDDINGS: {
        type: "@n8n/n8n-nodes-langchain.embeddingsMistralCloud",
        typeVersion: 1,
        description: "Embeddings de Mistral",
        connections: {
            output: "ai_embeddings"
        },
        credentials: "mistralCloudApi"
    },

    COHERE_EMBEDDINGS: {
        type: "@n8n/n8n-nodes-langchain.embeddingsCohere",
        typeVersion: 1,
        description: "Embeddings de Cohere",
        connections: {
            output: "ai_embeddings"
        },
        credentials: "cohereApi"
    },

    HUGGINGFACE_EMBEDDINGS: {
        type: "@n8n/n8n-nodes-langchain.embeddingsHuggingFace",
        typeVersion: 1,
        description: "Embeddings de Hugging Face",
        connections: {
            output: "ai_embeddings"
        }
    },

    TOGETHER_EMBEDDINGS: {
        type: "@n8n/n8n-nodes-langchain.embeddingsTogetherAi",
        typeVersion: 1,
        description: "Embeddings de Together AI",
        connections: {
            output: "ai_embeddings"
        },
        credentials: "togetherAiApi"
    },

    // === VECTOR STORES ===
    QDRANT: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
        typeVersion: 1,
        description: "Vector store Qdrant",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    PINECONE: {
        type: "@n8n/n8n-nodes-langchain.vectorStorePinecone",
        typeVersion: 1,
        description: "Vector store Pinecone",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        },
        credentials: "pineconeApi"
    },

    WEAVIATE: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreWeaviate",
        typeVersion: 1,
        description: "Vector store Weaviate",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    CHROMA: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreChroma",
        typeVersion: 1,
        description: "Vector store Chroma",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    IN_MEMORY_VECTORSTORE: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
        typeVersion: 1,
        description: "Vector store en memoria",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    REDIS_VECTORSTORE: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreRedis",
        typeVersion: 1,
        description: "Vector store Redis",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    SUPABASE_VECTORSTORE: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
        typeVersion: 1,
        description: "Vector store Supabase",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        },
        credentials: "supabaseApi"
    },

    MILVUS: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreMilvus",
        typeVersion: 1,
        description: "Vector store Milvus",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    ZEP: {
        type: "@n8n/n8n-nodes-langchain.vectorStoreZep",
        typeVersion: 1,
        description: "Vector store Zep",
        connections: {
            input: ["ai_embeddings"],
            output: "ai_vectorStore"
        }
    },

    // === DOCUMENT LOADERS ===
    DEFAULT_DATA_LOADER: {
        type: "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
        typeVersion: 1,
        description: "Cargador de documentos por defecto",
        connections: {
            output: "ai_document"
        }
    },

    BINARY_INPUT_LOADER: {
        type: "@n8n/n8n-nodes-langchain.documentBinaryInputLoader",
        typeVersion: 1,
        description: "Cargador desde entrada binaria",
        connections: {
            output: "ai_document"
        }
    },

    GITHUB_LOADER: {
        type: "@n8n/n8n-nodes-langchain.documentGithubLoader",
        typeVersion: 1,
        description: "Cargador desde GitHub",
        connections: {
            output: "ai_document"
        },
        credentials: "githubApi"
    },

    WEB_LOADER: {
        type: "@n8n/n8n-nodes-langchain.documentWebLoader",
        typeVersion: 1,
        description: "Cargador desde web",
        connections: {
            output: "ai_document"
        }
    },

    DIRECTORY_LOADER: {
        type: "@n8n/n8n-nodes-langchain.documentDirectoryLoader",
        typeVersion: 1,
        description: "Cargador desde directorio",
        connections: {
            output: "ai_document"
        }
    },

    NOTION_LOADER: {
        type: "@n8n/n8n-nodes-langchain.documentNotionLoader",
        typeVersion: 1,
        description: "Cargador desde Notion",
        connections: {
            output: "ai_document"
        },
        credentials: "notionApi"
    },

    // === TEXT SPLITTERS ===
    TOKEN_SPLITTER: {
        type: "@n8n/n8n-nodes-langchain.textSplitterTokenSplitter",
        typeVersion: 1,
        description: "Divisor de texto por tokens",
        connections: {
            input: ["ai_document"],
            output: "ai_document"
        }
    },

    RECURSIVE_CHARACTER_SPLITTER: {
        type: "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
        typeVersion: 1,
        description: "Divisor recursivo por caracteres",
        connections: {
            input: ["ai_document"],
            output: "ai_document"
        }
    },

    CHARACTER_SPLITTER: {
        type: "@n8n/n8n-nodes-langchain.textSplitterCharacterTextSplitter",
        typeVersion: 1,
        description: "Divisor por caracteres",
        connections: {
            input: ["ai_document"],
            output: "ai_document"
        }
    },

    MARKDOWN_SPLITTER: {
        type: "@n8n/n8n-nodes-langchain.textSplitterMarkdownSplitter",
        typeVersion: 1,
        description: "Divisor de Markdown",
        connections: {
            input: ["ai_document"],
            output: "ai_document"
        }
    },

    LATEX_SPLITTER: {
        type: "@n8n/n8n-nodes-langchain.textSplitterLatexSplitter",
        typeVersion: 1,
        description: "Divisor de LaTeX",
        connections: {
            input: ["ai_document"],
            output: "ai_document"
        }
    },

    // === CHAINS ===
    LLM_CHAIN: {
        type: "@n8n/n8n-nodes-langchain.chainLlm",
        typeVersion: 1,
        description: "Cadena básica LLM",
        connections: {
            input: ["ai_languageModel"],
            output: "main"
        }
    },

    RETRIEVAL_QA_CHAIN: {
        type: "@n8n/n8n-nodes-langchain.chainRetrievalQa",
        typeVersion: 1,
        description: "Cadena de pregunta-respuesta con recuperación",
        connections: {
            input: ["ai_languageModel", "ai_retriever"],
            output: "main"
        }
    },

    CONVERSATIONAL_RETRIEVAL_QA: {
        type: "@n8n/n8n-nodes-langchain.chainConversationalRetrievalQa",
        typeVersion: 1,
        description: "Cadena conversacional con recuperación",
        connections: {
            input: ["ai_languageModel", "ai_retriever", "ai_memory"],
            output: "main"
        }
    },

    SUMMARIZATION_CHAIN: {
        type: "@n8n/n8n-nodes-langchain.chainSummarization",
        typeVersion: 1,
        description: "Cadena de resumen",
        connections: {
            input: ["ai_languageModel", "ai_document"],
            output: "main"
        }
    },

    STUFF_DOCUMENTS_CHAIN: {
        type: "@n8n/n8n-nodes-langchain.chainStuffDocuments",
        typeVersion: 1,
        description: "Cadena para documentos",
        connections: {
            input: ["ai_languageModel", "ai_document"],
            output: "main"
        }
    },

    REFINE_DOCUMENTS_CHAIN: {
        type: "@n8n/n8n-nodes-langchain.chainRefineDocuments",
        typeVersion: 1,
        description: "Cadena de refinamiento de documentos",
        connections: {
            input: ["ai_languageModel", "ai_document"],
            output: "main"
        }
    },

    // === HERRAMIENTAS (TOOLS) ===
    CALCULATOR_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolCalculator",
        typeVersion: 1,
        description: "Herramienta calculadora",
        connections: {
            output: "ai_tool"
        }
    },

    CODE_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolCode",
        typeVersion: 1,
        description: "Herramienta para ejecutar código",
        connections: {
            output: "ai_tool"
        }
    },

    HTTP_REQUEST_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolHttpRequest",
        typeVersion: 1,
        description: "Herramienta para requests HTTP",
        connections: {
            output: "ai_tool"
        }
    },

    WIKIPEDIA_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolWikipedia",
        typeVersion: 1,
        description: "Herramienta de búsqueda en Wikipedia",
        connections: {
            output: "ai_tool"
        }
    },

    SERP_API_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolSerpApi",
        typeVersion: 1,
        description: "Herramienta de búsqueda web con SerpAPI",
        connections: {
            output: "ai_tool"
        },
        credentials: "serpApi"
    },

    VECTOR_STORE_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolVectorStore",
        typeVersion: 1,
        description: "Herramienta de vector store",
        connections: {
            input: ["ai_vectorStore"],
            output: "ai_tool"
        }
    },

    WORKFLOW_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolWorkflow",
        typeVersion: 1,
        description: "Ejecución de workflow como herramienta",
        connections: {
            output: "ai_tool"
        }
    },

    SEARCH_API_TOOL: {
        type: "@n8n/n8n-nodes-langchain.toolSearchApi",
        typeVersion: 1,
        description: "API de búsqueda",
        connections: {
            output: "ai_tool"
        }
    },

    // === MEMORIA ===
    BUFFER_WINDOW_MEMORY: {
        type: "@n8n/n8n-nodes-langchain.memoryBufferWindow",
        typeVersion: 1.3,
        description: "Memoria de ventana deslizante",
        requiredParams: [],
        optionalParams: ["k", "returnMessages"],
        connections: {
            output: "ai_memory"
        },
        example: {
            parameters: {
                k: 10,
                returnMessages: true
            }
        }
    },

    BUFFER_MEMORY: {
        type: "@n8n/n8n-nodes-langchain.memoryBuffer",
        typeVersion: 1,
        description: "Memoria buffer",
        connections: {
            output: "ai_memory"
        }
    },

    CONVERSATION_BUFFER_MEMORY: {
        type: "@n8n/n8n-nodes-langchain.memoryConversationBuffer",
        typeVersion: 1,
        description: "Memoria de conversación buffer",
        connections: {
            output: "ai_memory"
        }
    },

    POSTGRES_CHAT_MEMORY: {
        type: "@n8n/n8n-nodes-langchain.memoryPostgresChat",
        typeVersion: 1,
        description: "Memoria en PostgreSQL",
        connections: {
            output: "ai_memory"
        }
    },

    REDIS_CHAT_MEMORY: {
        type: "@n8n/n8n-nodes-langchain.memoryRedisChat",
        typeVersion: 1,
        description: "Memoria en Redis",
        connections: {
            output: "ai_memory"
        }
    },

    MEMORY_MANAGER: {
        type: "@n8n/n8n-nodes-langchain.memoryManager",
        typeVersion: 1,
        description: "Gestor de memoria",
        connections: {
            output: "ai_memory"
        }
    },

    // === OUTPUT PARSERS ===
    STRUCTURED_PARSER: {
        type: "@n8n/n8n-nodes-langchain.outputParserStructured",
        typeVersion: 1,
        description: "Parser estructurado",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    JSON_PARSER: {
        type: "@n8n/n8n-nodes-langchain.outputParserJson",
        typeVersion: 1,
        description: "Parser JSON",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    AUTOFIXING_PARSER: {
        type: "@n8n/n8n-nodes-langchain.outputParserAutofixing",
        typeVersion: 1,
        description: "Parser con autocorrección",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    REGEX_PARSER: {
        type: "@n8n/n8n-nodes-langchain.outputParserRegex",
        typeVersion: 1,
        description: "Parser con expresiones regulares",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    // === RETRIEVERS ===
    VECTOR_STORE_RETRIEVER: {
        type: "@n8n/n8n-nodes-langchain.retrieverVectorStore",
        typeVersion: 1,
        description: "Recuperador de vector store",
        connections: {
            input: ["ai_vectorStore"],
            output: "ai_retriever"
        }
    },

    WEB_RESEARCH_RETRIEVER: {
        type: "@n8n/n8n-nodes-langchain.retrieverWebResearch",
        typeVersion: 1,
        description: "Recuperador de investigación web",
        connections: {
            output: "ai_retriever"
        }
    },

    MULTI_QUERY_RETRIEVER: {
        type: "@n8n/n8n-nodes-langchain.retrieverMultiQuery",
        typeVersion: 1,
        description: "Recuperador multi-query",
        connections: {
            input: ["ai_vectorStore"],
            output: "ai_retriever"
        }
    },

    // === CLASIFICADORES Y EXTRACTORES ===
    TEXT_CLASSIFIER: {
        type: "@n8n/n8n-nodes-langchain.textClassifier",
        typeVersion: 1,
        description: "Clasificador de texto",
        connections: {
            input: ["ai_languageModel"],
            output: "main"
        }
    },

    SENTIMENT_ANALYZER: {
        type: "@n8n/n8n-nodes-langchain.sentimentAnalyzer",
        typeVersion: 1,
        description: "Analizador de sentimientos",
        connections: {
            input: ["ai_languageModel"],
            output: "main"
        }
    },

    INFORMATION_EXTRACTOR: {
        type: "@n8n/n8n-nodes-langchain.informationExtractor",
        typeVersion: 1,
        description: "Extractor de información",
        connections: {
            input: ["ai_languageModel"],
            output: "main"
        }
    },

    ENTITY_EXTRACTOR: {
        type: "@n8n/n8n-nodes-langchain.entityExtractor",
        typeVersion: 1,
        description: "Extractor de entidades",
        connections: {
            input: ["ai_languageModel"],
            output: "main"
        }
    }
};

// ============================================================================
// NODOS BASE N8N (TRADICIONALES)
// ============================================================================

export const BASE_N8N_NODES = {

    // Triggers básicos
    WEBHOOK: {
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        description: "Webhook HTTP",
        connections: {
            output: "main"
        }
    },

    MANUAL_TRIGGER: {
        type: "n8n-nodes-base.manualTrigger",
        typeVersion: 1,
        description: "Ejecución manual",
        connections: {
            output: "main"
        }
    },

    SCHEDULE_TRIGGER: {
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1,
        description: "Trigger programado",
        connections: {
            output: "main"
        }
    },

    // Nodos principales
    HTTP_REQUEST: {
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4,
        description: "Petición HTTP",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    CODE: {
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        description: "Código JavaScript/Python",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    SET: {
        type: "n8n-nodes-base.set",
        typeVersion: 1,
        description: "Establecer valores",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    IF: {
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        description: "Condiciones",
        connections: {
            input: ["main"],
            output: ["main", "main"]
        }
    },

    MERGE: {
        type: "n8n-nodes-base.merge",
        typeVersion: 3,
        description: "Combinar datos",
        connections: {
            input: ["main", "main"],
            output: "main"
        }
    },

    // Comunicación
    GMAIL: {
        type: "n8n-nodes-base.gmail",
        typeVersion: 1,
        description: "Gmail",
        connections: {
            input: ["main"],
            output: "main"
        },
        credentials: "gmailOAuth2"
    },

    SLACK: {
        type: "n8n-nodes-base.slack",
        typeVersion: 1,
        description: "Slack",
        connections: {
            input: ["main"],
            output: "main"
        },
        credentials: "slackApi"
    },

    // Bases de datos
    MYSQL: {
        type: "n8n-nodes-base.mysql",
        typeVersion: 1,
        description: "MySQL",
        connections: {
            input: ["main"],
            output: "main"
        },
        credentials: "mySql"
    },

    POSTGRESQL: {
        type: "n8n-nodes-base.postgres",
        typeVersion: 1,
        description: "PostgreSQL",
        connections: {
            input: ["main"],
            output: "main"
        },
        credentials: "postgres"
    },

    MONGODB: {
        type: "n8n-nodes-base.mongodb",
        typeVersion: 1,
        description: "MongoDB",
        connections: {
            input: ["main"],
            output: "main"
        },
        credentials: "mongoDb"
    },

    // Google
    GOOGLE_SHEETS: {
        type: "n8n-nodes-base.googleSheets",
        typeVersion: 1,
        description: "Google Sheets",
        connections: {
            input: ["main"],
            output: "main"
        },
        credentials: "googleSheetsOAuth2"
    },

    // Utilidades
    WAIT: {
        type: "n8n-nodes-base.wait",
        typeVersion: 1,
        description: "Pausar ejecución",
        connections: {
            input: ["main"],
            output: "main"
        }
    },

    FILTER: {
        type: "n8n-nodes-base.filter",
        typeVersion: 1,
        description: "Filtrar datos",
        connections: {
            input: ["main"],
            output: ["main", "main"]
        }
    }
};

// ============================================================================
// COMBINACIÓN DE TODOS LOS NODOS
// ============================================================================

export const MODERN_N8N_NODES = {
    ...LANGCHAIN_NODES,
    ...BASE_N8N_NODES
};

// ============================================================================
// TIPOS DE CONEXIONES CORRECTAS
// ============================================================================

export const CONNECTION_TYPES = {
    MAIN: "main",
    AI_LANGUAGE_MODEL: "ai_languageModel", 
    AI_MEMORY: "ai_memory",
    AI_TOOL: "ai_tool",
    AI_VECTOR_STORE: "ai_vectorStore",
    AI_DOCUMENT: "ai_document",
    AI_RETRIEVER: "ai_retriever",
    AI_OUTPUT_PARSER: "ai_outputParser"
};

// ============================================================================
// PATRONES DE WORKFLOWS FUNCIONALES
// ============================================================================

export const WORKFLOW_PATTERNS = {

    // Patrón básico de chat con AI
    BASIC_CHAT: {
        nodes: [
            "CHAT_TRIGGER",
            "AI_AGENT",
            "BUFFER_MEMORY",
            "GOOGLE_GEMINI"
        ],
        connections: [
            { from: "CHAT_TRIGGER", to: "AI_AGENT", type: "main" },
            { from: "BUFFER_MEMORY", to: "AI_AGENT", type: "ai_memory" },
            { from: "GOOGLE_GEMINI", to: "AI_AGENT", type: "ai_languageModel" }
        ]
    },

    // Patrón de análisis de sentimientos
    SENTIMENT_ANALYSIS: {
        nodes: [
            "CHAT_TRIGGER",
            "AI_AGENT",
            "GOOGLE_GEMINI"
        ],
        systemPrompt: "Analiza el sentimiento del mensaje del usuario y responde con: POSITIVO, NEGATIVO o NEUTRO",
        connections: [
            { from: "CHAT_TRIGGER", to: "AI_AGENT", type: "main" },
            { from: "GOOGLE_GEMINI", to: "AI_AGENT", type: "ai_languageModel" }
        ]
    },

    // Patrón RAG (Retrieval-Augmented Generation)
    RAG_SYSTEM: {
        nodes: [
            "WEBHOOK",
            "DEFAULT_DATA_LOADER",
            "RECURSIVE_CHARACTER_SPLITTER",
            "OPENAI_EMBEDDINGS",
            "QDRANT",
            "VECTOR_STORE_RETRIEVER",
            "RETRIEVAL_QA_CHAIN",
            "OPENAI_CHAT"
        ],
        connections: [
            { from: "WEBHOOK", to: "DEFAULT_DATA_LOADER", type: "main" },
            { from: "DEFAULT_DATA_LOADER", to: "RECURSIVE_CHARACTER_SPLITTER", type: "ai_document" },
            { from: "RECURSIVE_CHARACTER_SPLITTER", to: "OPENAI_EMBEDDINGS", type: "ai_document" },
            { from: "OPENAI_EMBEDDINGS", to: "QDRANT", type: "ai_embeddings" },
            { from: "QDRANT", to: "VECTOR_STORE_RETRIEVER", type: "ai_vectorStore" },
            { from: "VECTOR_STORE_RETRIEVER", to: "RETRIEVAL_QA_CHAIN", type: "ai_retriever" },
            { from: "OPENAI_CHAT", to: "RETRIEVAL_QA_CHAIN", type: "ai_languageModel" }
        ]
    },

    // Patrón de agente con herramientas
    AGENT_WITH_TOOLS: {
        nodes: [
            "CHAT_TRIGGER",
            "AI_AGENT",
            "BUFFER_WINDOW_MEMORY",
            "OPENAI_CHAT",
            "CALCULATOR_TOOL",
            "HTTP_REQUEST_TOOL",
            "CODE_TOOL"
        ],
        connections: [
            { from: "CHAT_TRIGGER", to: "AI_AGENT", type: "main" },
            { from: "BUFFER_WINDOW_MEMORY", to: "AI_AGENT", type: "ai_memory" },
            { from: "OPENAI_CHAT", to: "AI_AGENT", type: "ai_languageModel" },
            { from: "CALCULATOR_TOOL", to: "AI_AGENT", type: "ai_tool" },
            { from: "HTTP_REQUEST_TOOL", to: "AI_AGENT", type: "ai_tool" },
            { from: "CODE_TOOL", to: "AI_AGENT", type: "ai_tool" }
        ]
    },

    // Patrón de clasificación de texto
    TEXT_CLASSIFICATION: {
        nodes: [
            "WEBHOOK",
            "TEXT_CLASSIFIER",
            "OPENAI_CHAT",
            "IF",
            "SET"
        ],
        connections: [
            { from: "WEBHOOK", to: "TEXT_CLASSIFIER", type: "main" },
            { from: "OPENAI_CHAT", to: "TEXT_CLASSIFIER", type: "ai_languageModel" },
            { from: "TEXT_CLASSIFIER", to: "IF", type: "main" },
            { from: "IF", to: "SET", type: "main" }
        ]
    },

    // Patrón de extracción de información
    INFORMATION_EXTRACTION: {
        nodes: [
            "WEBHOOK",
            "INFORMATION_EXTRACTOR",
            "OPENAI_CHAT",
            "STRUCTURED_PARSER",
            "GOOGLE_SHEETS"
        ],
        connections: [
            { from: "WEBHOOK", to: "INFORMATION_EXTRACTOR", type: "main" },
            { from: "OPENAI_CHAT", to: "INFORMATION_EXTRACTOR", type: "ai_languageModel" },
            { from: "INFORMATION_EXTRACTOR", to: "STRUCTURED_PARSER", type: "main" },
            { from: "STRUCTURED_PARSER", to: "GOOGLE_SHEETS", type: "main" }
        ]
    },

    // Patrón de chatbot conversacional con memoria persistente
    CONVERSATIONAL_CHATBOT: {
        nodes: [
            "CHAT_TRIGGER",
            "CONVERSATIONAL_AGENT",
            "REDIS_CHAT_MEMORY",
            "OPENAI_CHAT",
            "SENTIMENT_ANALYZER"
        ],
        connections: [
            { from: "CHAT_TRIGGER", to: "CONVERSATIONAL_AGENT", type: "main" },
            { from: "REDIS_CHAT_MEMORY", to: "CONVERSATIONAL_AGENT", type: "ai_memory" },
            { from: "OPENAI_CHAT", to: "CONVERSATIONAL_AGENT", type: "ai_languageModel" },
            { from: "CONVERSATIONAL_AGENT", to: "SENTIMENT_ANALYZER", type: "main" }
        ]
    },

    // Patrón de procesamiento de documentos
    DOCUMENT_PROCESSING: {
        nodes: [
            "WEBHOOK",
            "GITHUB_LOADER",
            "MARKDOWN_SPLITTER",
            "GOOGLE_GEMINI_EMBEDDINGS",
            "PINECONE",
            "MULTI_QUERY_RETRIEVER",
            "CONVERSATIONAL_RETRIEVAL_QA",
            "ANTHROPIC_CLAUDE"
        ],
        connections: [
            { from: "WEBHOOK", to: "GITHUB_LOADER", type: "main" },
            { from: "GITHUB_LOADER", to: "MARKDOWN_SPLITTER", type: "ai_document" },
            { from: "MARKDOWN_SPLITTER", to: "GOOGLE_GEMINI_EMBEDDINGS", type: "ai_document" },
            { from: "GOOGLE_GEMINI_EMBEDDINGS", to: "PINECONE", type: "ai_embeddings" },
            { from: "PINECONE", to: "MULTI_QUERY_RETRIEVER", type: "ai_vectorStore" },
            { from: "MULTI_QUERY_RETRIEVER", to: "CONVERSATIONAL_RETRIEVAL_QA", type: "ai_retriever" },
            { from: "ANTHROPIC_CLAUDE", to: "CONVERSATIONAL_RETRIEVAL_QA", type: "ai_languageModel" }
        ]
    },

    // Patrón de análisis de sentimientos en tiempo real
    REAL_TIME_SENTIMENT: {
        nodes: [
            "TELEGRAM_TRIGGER",
            "SENTIMENT_ANALYZER",
            "GOOGLE_GEMINI_CHAT",
            "IF",
            "TELEGRAM_POSITIVE",
            "TELEGRAM_NEGATIVE",
            "TELEGRAM_NEUTRAL"
        ],
        connections: [
            { from: "TELEGRAM_TRIGGER", to: "SENTIMENT_ANALYZER", type: "main" },
            { from: "GOOGLE_GEMINI_CHAT", to: "SENTIMENT_ANALYZER", type: "ai_languageModel" },
            { from: "SENTIMENT_ANALYZER", to: "IF", type: "main" },
            { from: "IF", to: "TELEGRAM_POSITIVE", type: "main" },
            { from: "IF", to: "TELEGRAM_NEGATIVE", type: "main" },
            { from: "IF", to: "TELEGRAM_NEUTRAL", type: "main" }
        ]
    },

    // Patrón de resumen automático de contenido
    CONTENT_SUMMARIZATION: {
        nodes: [
            "WEBHOOK",
            "WEB_LOADER",
            "TOKEN_SPLITTER",
            "SUMMARIZATION_CHAIN",
            "MISTRAL_CLOUD",
            "GMAIL"
        ],
        connections: [
            { from: "WEBHOOK", to: "WEB_LOADER", type: "main" },
            { from: "WEB_LOADER", to: "TOKEN_SPLITTER", type: "ai_document" },
            { from: "TOKEN_SPLITTER", to: "SUMMARIZATION_CHAIN", type: "ai_document" },
            { from: "MISTRAL_CLOUD", to: "SUMMARIZATION_CHAIN", type: "ai_languageModel" },
            { from: "SUMMARIZATION_CHAIN", to: "GMAIL", type: "main" }
        ]
    }
};

// ============================================================================
// CONFIGURACIONES VÁLIDAS
// ============================================================================

export const VALID_CONFIGURATIONS = {
    
    // Posiciones que SÍ funcionan (basadas en workflow real)
    POSITIONS: {
        TRIGGER: [-224, -32],
        AGENT: [144, -48], 
        MEMORY: [240, 240],
        MODEL: [16, 160]
    },

    // IDs de credenciales reales
    CREDENTIALS: {
        GOOGLE_GEMINI: "googlePalmApi",
        OPENAI: "openAiApi",
        SLACK: "slackApi"
    },

    // Configuraciones de sistemas
    SYSTEM_PROMPTS: {
        SENTIMENT: "Debes de responder con una descripcion de la emocion del usuario",
        ANALYSIS: "Analiza el contenido proporcionado y responde de manera concisa",
        SUPPORT: "Eres un asistente útil que responde preguntas de manera clara"
    }
};

export default {
    MODERN_N8N_NODES,
    CONNECTION_TYPES,
    WORKFLOW_PATTERNS,
    VALID_CONFIGURATIONS
};

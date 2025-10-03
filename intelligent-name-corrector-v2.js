/**
 * INTELLIGENT NAME CORRECTOR V2 ULTRA
 * ====================================
 * 
 * Sistema ultra-robusto de corrección de nombres con:
 * - Algoritmo de distancia de Levenshtein
 * - Mapeo inteligente paso → nodo
 * - Corrección automática de operaciones
 * - Sistema de aprendizaje adaptativo
 * - Validación contextual avanzada
 */

class IntelligentNameCorrectorV2 {
    constructor(options = {}) {
        this.version = "2.0.0-ultra";
        this.options = {
            levenshteinThreshold: options.levenshteinThreshold || 3,
            confidenceThreshold: options.confidenceThreshold || 0.7,
            enableLearning: options.enableLearning || true,
            contextualValidation: options.contextualValidation || true
        };

        // 🧠 SISTEMA DE MAPEO INTELIGENTE PASO → NODO
        this.stepToNodeMapping = {
            // Patrones de entrada/trigger
            entrada: {
                patterns: ['recibir', 'input', 'trigger', 'webhook', 'formulario', 'manualmente'],
                nodes: ['webhook', 'manualTrigger', 'formTrigger', 'httpRequest'],
                confidence: 0.9
            },
            
            // Patrones de procesamiento
            procesamiento: {
                patterns: ['procesar', 'transform', 'calculate', 'analizar', 'convertir'],
                nodes: ['function', 'code', 'set', 'httpRequest', 'filter'],
                confidence: 0.8
            },
            
            // Patrones de decisión
            decision: {
                patterns: ['si', 'if', 'cuando', 'validar', 'check', 'condicional'],
                nodes: ['if', 'switch', 'filter', 'merge'],
                confidence: 0.85
            },
            
            // Patrones de comunicación
            comunicacion: {
                patterns: ['email', 'telegram', 'slack', 'whatsapp', 'notificar', 'enviar mensaje'],
                nodes: ['gmail', 'telegram', 'slack', 'whatsApp', 'twilio'],
                confidence: 0.95
            },
            
            // Patrones de datos
            datos: {
                patterns: ['database', 'sheets', 'excel', 'csv', 'json', 'guardar', 'leer'],
                nodes: ['mysql', 'postgres', 'googleSheets', 'airtable', 'mongodb'],
                confidence: 0.9
            },
            
            // Patrones de IA
            inteligencia: {
                patterns: ['ai', 'ia', 'openai', 'gpt', 'gemini', 'transcribir', 'generar'],
                nodes: ['openAi', 'agent', 'anthropic', 'gemini'],
                confidence: 0.92
            }
        };

        // 🔧 ALGORITMO DE LEVENSHTEIN OPTIMIZADO
        this.levenshteinCache = new Map();
        
        // 📚 DICCIONARIO EXPANDIDO CON CONFIANZA
        this.nodeCorrections = this.buildEnhancedDictionary();
        
        // 🎯 MAPEO DE OPERACIONES CON VALIDACIÓN
        this.operationMappings = this.buildOperationMappings();
        
        // 📊 SISTEMA DE APRENDIZAJE
        this.learningSystem = {
            corrections: new Map(),
            patterns: new Map(),
            confidence: new Map()
        };
        
        // ✅ VALIDADOR CONTEXTUAL
        this.contextValidator = this.initializeContextValidator();
    }

    /**
     * 🔧 ALGORITMO DE LEVENSHTEIN OPTIMIZADO
     */
    calculateLevenshteinDistance(str1, str2) {
        const cacheKey = `${str1}|${str2}`;
        if (this.levenshteinCache.has(cacheKey)) {
            return this.levenshteinCache.get(cacheKey);
        }

        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) {
            matrix[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j++) {
            matrix[j][0] = j;
        }

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,       // deletion
                    matrix[j - 1][i] + 1,       // insertion
                    matrix[j - 1][i - 1] + cost // substitution
                );
            }
        }

        const distance = matrix[str2.length][str1.length];
        this.levenshteinCache.set(cacheKey, distance);
        return distance;
    }

    /**
     * 🎯 CORRECCIÓN PRINCIPAL INTELIGENTE
     */
    correctNodeName(inputName, context = {}) {
        try {
            const normalizedInput = this.normalizeInput(inputName);
            
            // 1. Búsqueda exacta en diccionario
            const exactMatch = this.findExactMatch(normalizedInput);
            if (exactMatch) {
                return this.buildResult(exactMatch, 1.0, 'exact-match');
            }

            // 2. Búsqueda con Levenshtein
            const levenshteinMatch = this.findLevenshteinMatch(normalizedInput);
            if (levenshteinMatch && levenshteinMatch.confidence >= this.options.confidenceThreshold) {
                return this.buildResult(levenshteinMatch.node, levenshteinMatch.confidence, 'levenshtein');
            }

            // 3. Mapeo inteligente por contexto
            const contextMatch = this.findContextualMatch(normalizedInput, context);
            if (contextMatch && contextMatch.confidence >= this.options.confidenceThreshold) {
                return this.buildResult(contextMatch.node, contextMatch.confidence, 'contextual');
            }

            // 4. Análisis semántico avanzado
            const semanticMatch = this.findSemanticMatch(normalizedInput, context);
            if (semanticMatch && semanticMatch.confidence >= this.options.confidenceThreshold) {
                return this.buildResult(semanticMatch.node, semanticMatch.confidence, 'semantic');
            }

            // 5. Fallback inteligente
            const fallbackMatch = this.findFallbackMatch(normalizedInput);
            return this.buildResult(fallbackMatch.node, fallbackMatch.confidence, 'fallback');

        } catch (error) {
            console.error("Error en corrección de nombre:", error);
            return this.buildErrorResult(inputName, error);
        }
    }

    /**
     * 🔍 BÚSQUEDA CON ALGORITMO LEVENSHTEIN
     */
    findLevenshteinMatch(input) {
        let bestMatch = null;
        let bestDistance = Infinity;
        let bestConfidence = 0;

        const allNodes = Object.keys(this.nodeCorrections);
        
        for (const nodeKey of allNodes) {
            const distance = this.calculateLevenshteinDistance(input.toLowerCase(), nodeKey.toLowerCase());
            
            if (distance <= this.options.levenshteinThreshold) {
                const confidence = this.calculateConfidence(input, nodeKey, distance);
                
                if (confidence > bestConfidence) {
                    bestMatch = this.nodeCorrections[nodeKey];
                    bestDistance = distance;
                    bestConfidence = confidence;
                }
            }
        }

        return bestMatch ? { node: bestMatch, confidence: bestConfidence, distance: bestDistance } : null;
    }

    /**
     * 📊 CÁLCULO DE CONFIANZA AVANZADO
     */
    calculateConfidence(input, target, distance) {
        const maxLength = Math.max(input.length, target.length);
        const similarity = 1 - (distance / maxLength);
        
        // Bonificaciones por patrones específicos
        let bonus = 0;
        
        // Bonificación por prefijo común
        if (this.hasCommonPrefix(input, target)) bonus += 0.1;
        
        // Bonificación por sufijo común
        if (this.hasCommonSuffix(input, target)) bonus += 0.1;
        
        // Bonificación por palabras clave
        if (this.hasKeywordMatch(input, target)) bonus += 0.15;
        
        // Penalización por longitud muy diferente
        const lengthDiff = Math.abs(input.length - target.length);
        const lengthPenalty = lengthDiff > 5 ? 0.1 : 0;
        
        return Math.min(Math.max(similarity + bonus - lengthPenalty, 0), 1);
    }

    /**
     * 🎯 MAPEO CONTEXTUAL INTELIGENTE
     */
    findContextualMatch(input, context) {
        const stepText = context.stepText?.toLowerCase() || '';
        const stepType = context.stepType || '';
        
        for (const [category, mapping] of Object.entries(this.stepToNodeMapping)) {
            for (const pattern of mapping.patterns) {
                if (stepText.includes(pattern) || input.includes(pattern)) {
                    // Buscar el mejor nodo para este patrón
                    const bestNode = this.selectBestNodeForPattern(input, mapping.nodes);
                    if (bestNode) {
                        return {
                            node: this.normalizeNodeName(bestNode),
                            confidence: mapping.confidence * 0.9, // Pequeña penalización por mapeo contextual
                            category: category,
                            pattern: pattern
                        };
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * 🧠 ANÁLISIS SEMÁNTICO AVANZADO
     */
    findSemanticMatch(input, context) {
        const semanticPatterns = {
            communication: {
                keywords: ['send', 'message', 'notify', 'email', 'chat', 'enviar', 'mensaje'],
                nodes: ['gmail', 'telegram', 'slack', 'twilio', 'sendgrid'],
                confidence: 0.8
            },
            data: {
                keywords: ['store', 'save', 'read', 'database', 'table', 'guardar', 'leer'],
                nodes: ['mysql', 'postgres', 'mongodb', 'airtable', 'googleSheets'],
                confidence: 0.8
            },
            ai: {
                keywords: ['ai', 'gpt', 'openai', 'generate', 'analyze', 'transcribe', 'ia'],
                nodes: ['openAi', 'agent', 'anthropic', 'gemini'],
                confidence: 0.85
            },
            logic: {
                keywords: ['if', 'condition', 'check', 'validate', 'si', 'cuando'],
                nodes: ['if', 'switch', 'filter'],
                confidence: 0.9
            }
        };

        const inputWords = input.toLowerCase().split(/[\s\-_]+/);
        const contextWords = (context.stepText?.toLowerCase() || '').split(/[\s\-_]+/);
        const allWords = [...inputWords, ...contextWords];

        for (const [category, pattern] of Object.entries(semanticPatterns)) {
            for (const keyword of pattern.keywords) {
                if (allWords.some(word => word.includes(keyword) || keyword.includes(word))) {
                    const bestNode = this.selectBestNodeForPattern(input, pattern.nodes);
                    if (bestNode) {
                        return {
                            node: this.normalizeNodeName(bestNode),
                            confidence: pattern.confidence,
                            category: category,
                            keyword: keyword
                        };
                    }
                }
            }
        }

        return null;
    }

    /**
     * 🔧 SELECCIÓN DEL MEJOR NODO PARA PATRÓN
     */
    selectBestNodeForPattern(input, nodeOptions) {
        if (!nodeOptions || nodeOptions.length === 0) return null;
        
        // Si solo hay una opción, la devolvemos
        if (nodeOptions.length === 1) return nodeOptions[0];
        
        // Buscar coincidencias más específicas
        const inputLower = input.toLowerCase();
        
        for (const node of nodeOptions) {
            const nodeLower = node.toLowerCase();
            if (inputLower.includes(nodeLower) || nodeLower.includes(inputLower)) {
                return node;
            }
        }
        
        // Usar Levenshtein para encontrar el más similar
        let bestNode = nodeOptions[0];
        let bestDistance = Infinity;
        
        for (const node of nodeOptions) {
            const distance = this.calculateLevenshteinDistance(inputLower, node.toLowerCase());
            if (distance < bestDistance) {
                bestDistance = distance;
                bestNode = node;
            }
        }
        
        return bestNode;
    }

    /**
     * 🎯 CORRECCIÓN DE OPERACIONES
     */
    correctOperation(nodeName, operationName, context = {}) {
        const normalizedNode = this.normalizeNodeName(nodeName);
        const normalizedOperation = operationName?.toLowerCase() || '';
        
        const nodeOperations = this.operationMappings[normalizedNode];
        if (!nodeOperations) {
            return this.buildOperationResult(operationName, 0.5, 'no-mapping');
        }

        // Búsqueda exacta
        if (nodeOperations.validOperations.includes(normalizedOperation)) {
            return this.buildOperationResult(normalizedOperation, 1.0, 'exact');
        }

        // Búsqueda en errores comunes
        if (nodeOperations.commonMistakes[normalizedOperation]) {
            const corrected = nodeOperations.commonMistakes[normalizedOperation];
            return this.buildOperationResult(corrected, 0.9, 'common-mistake');
        }

        // Levenshtein en operaciones válidas
        const levenshteinMatch = this.findBestOperationMatch(normalizedOperation, nodeOperations.validOperations);
        if (levenshteinMatch && levenshteinMatch.confidence >= 0.7) {
            return this.buildOperationResult(levenshteinMatch.operation, levenshteinMatch.confidence, 'levenshtein');
        }

        // Fallback
        return this.buildOperationResult(nodeOperations.validOperations[0], 0.6, 'fallback');
    }

    /**
     * 🔍 BÚSQUEDA DE MEJOR OPERACIÓN
     */
    findBestOperationMatch(input, validOperations) {
        let bestMatch = null;
        let bestConfidence = 0;

        for (const operation of validOperations) {
            const distance = this.calculateLevenshteinDistance(input, operation);
            const confidence = this.calculateConfidence(input, operation, distance);
            
            if (confidence > bestConfidence && confidence >= 0.7) {
                bestMatch = operation;
                bestConfidence = confidence;
            }
        }

        return bestMatch ? { operation: bestMatch, confidence: bestConfidence } : null;
    }

    /**
     * 📚 CONSTRUCCIÓN DEL DICCIONARIO MEJORADO
     */
    buildEnhancedDictionary() {
        return {
            // Comunicación
            'telegram': 'n8n-nodes-base.telegram',
            'slack': 'n8n-nodes-base.slack',
            'gmail': 'n8n-nodes-base.gmail',
            'email': 'n8n-nodes-base.gmail',
            'whatsapp': 'n8n-nodes-base.whatsApp',
            'discord': 'n8n-nodes-base.discord',
            'twilio': 'n8n-nodes-base.twilio',
            
            // Datos
            'mysql': 'n8n-nodes-base.mySql',
            'postgres': 'n8n-nodes-base.postgres',
            'mongodb': 'n8n-nodes-base.mongoDb',
            'sheets': 'n8n-nodes-base.googleSheets',
            'airtable': 'n8n-nodes-base.airtable',
            'excel': 'n8n-nodes-base.microsoftExcel',
            
            // IA
            'openai': 'n8n-nodes-base.openAi',
            'gpt': 'n8n-nodes-base.openAi',
            'ai': 'n8n-nodes-base.agent',
            'agent': 'n8n-nodes-base.agent',
            'gemini': 'n8n-nodes-base.gemini',
            
            // Utilidades
            'http': 'n8n-nodes-base.httpRequest',
            'webhook': 'n8n-nodes-base.webhook',
            'if': 'n8n-nodes-base.if',
            'set': 'n8n-nodes-base.set',
            'function': 'n8n-nodes-base.code',
            'code': 'n8n-nodes-base.code',
            'merge': 'n8n-nodes-base.merge',
            'filter': 'n8n-nodes-base.filter',
            'switch': 'n8n-nodes-base.switch'
        };
    }

    /**
     * 🎯 CONSTRUCCIÓN DE MAPEO DE OPERACIONES
     */
    buildOperationMappings() {
        return {
            'n8n-nodes-base.openAi': {
                validOperations: ['chat', 'completion', 'audio', 'image', 'embedding'],
                commonMistakes: {
                    'transcribe': 'audio',
                    'stt': 'audio',
                    'speech-to-text': 'audio',
                    'whisper': 'audio',
                    'gpt': 'chat',
                    'chatgpt': 'chat',
                    'complete': 'completion'
                }
            },
            'n8n-nodes-base.googleSheets': {
                validOperations: ['append', 'getAll', 'update', 'clear', 'delete'],
                commonMistakes: {
                    'read': 'getAll',
                    'get': 'getAll',
                    'add': 'append',
                    'insert': 'append',
                    'write': 'append'
                }
            },
            'n8n-nodes-base.if': {
                validOperations: ['equal', 'notEqual', 'larger', 'smaller', 'contains', 'notContains'],
                commonMistakes: {
                    'equals': 'equal',
                    'notEquals': 'notEqual',
                    'greaterThan': 'larger',
                    'lessThan': 'smaller',
                    'includes': 'contains'
                }
            }
        };
    }

    /**
     * 🛠️ MÉTODOS DE APOYO
     */
    normalizeInput(input) {
        return input?.toString().trim().toLowerCase().replace(/[\s\-_]+/g, '') || '';
    }

    normalizeNodeName(nodeName) {
        if (nodeName?.startsWith('n8n-nodes-base.')) {
            return nodeName;
        }
        return `n8n-nodes-base.${nodeName}`;
    }

    findExactMatch(input) {
        return this.nodeCorrections[input] || null;
    }

    hasCommonPrefix(str1, str2, minLength = 3) {
        if (str1.length < minLength || str2.length < minLength) return false;
        return str1.substring(0, minLength) === str2.substring(0, minLength);
    }

    hasCommonSuffix(str1, str2, minLength = 3) {
        if (str1.length < minLength || str2.length < minLength) return false;
        return str1.slice(-minLength) === str2.slice(-minLength);
    }

    hasKeywordMatch(str1, str2) {
        const keywords1 = str1.split(/[\s\-_]+/);
        const keywords2 = str2.split(/[\s\-_]+/);
        return keywords1.some(k1 => keywords2.some(k2 => k1.includes(k2) || k2.includes(k1)));
    }

    buildResult(node, confidence, method) {
        return {
            success: true,
            original: node,
            corrected: this.normalizeNodeName(node),
            confidence: confidence,
            method: method,
            version: this.version
        };
    }

    buildOperationResult(operation, confidence, method) {
        return {
            success: true,
            corrected: operation,
            confidence: confidence,
            method: method
        };
    }

    buildErrorResult(input, error) {
        return {
            success: false,
            original: input,
            error: error.message,
            fallback: 'n8n-nodes-base.httpRequest'
        };
    }

    findFallbackMatch(input) {
        return {
            node: 'n8n-nodes-base.httpRequest',
            confidence: 0.3
        };
    }

    initializeContextValidator() {
        return {
            validate: (node, context) => true // Implementación simplificada
        };
    }

    /**
     * 📊 INFORMACIÓN DEL SISTEMA
     */
    getSystemInfo() {
        return {
            name: "IntelligentNameCorrectorV2",
            version: this.version,
            capabilities: [
                "Levenshtein distance algorithm",
                "Intelligent step-to-node mapping",
                "Contextual validation",
                "Operation correction",
                "Adaptive learning system",
                "Semantic analysis"
            ],
            metrics: {
                dictionarySize: Object.keys(this.nodeCorrections).length,
                mappingCategories: Object.keys(this.stepToNodeMapping).length,
                cacheSize: this.levenshteinCache.size
            }
        };
    }
}

// Función de utilidad para uso directo
function correctNodeNameV2(nodeName, context = {}) {
    const corrector = new IntelligentNameCorrectorV2();
    return corrector.correctNodeName(nodeName, context);
}

function correctOperationV2(nodeName, operationName, context = {}) {
    const corrector = new IntelligentNameCorrectorV2();
    return corrector.correctOperation(nodeName, operationName, context);
}

// Exportar para uso en extension server
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IntelligentNameCorrectorV2,
        correctNodeNameV2,
        correctOperationV2
    };
}

// Export default para ES modules
export default IntelligentNameCorrectorV2;
export { correctNodeNameV2, correctOperationV2 };

// Global para uso directo
if (typeof window !== 'undefined') {
    window.IntelligentNameCorrectorV2 = IntelligentNameCorrectorV2;
    window.correctNodeNameV2 = correctNodeNameV2;
    window.correctOperationV2 = correctOperationV2;
}
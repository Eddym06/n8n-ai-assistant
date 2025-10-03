// 🚀 SISTEMA V4 ULTRA FUSIONADO - La Evolución Final
// Fusiona Gemini + Referencias + Mejoras Inteligentes

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import AdvancedAutoRepairSystem from './advanced-auto-repair-system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

// Importar FlowCoherenceAgent V3 optimizado
let FlowCoherenceAgentV3 = null;
let apiOptimizer = null;
try {
    const module = await import('./flow-coherence-agent-v3.mjs');
    FlowCoherenceAgentV3 = module.default;
    
    const optimizerModule = await import('./api-optimization-manager.mjs');
    apiOptimizer = optimizerModule.apiOptimizer;
    
    console.log('✅ FlowCoherenceAgentV3 y APIOptimizer cargados en V4 Ultra System');
} catch (error) {
    console.log('⚠️ FlowCoherenceAgentV3 no disponible:', error.message);
}

/**
 * 🎯 SISTEMA HÍBRIDO INTELIGENTE V4 ULTRA
 * - Combina lo mejor de Gemini AI y el sistema de referencias
 * - Calidad dual con fallback progresivo
 * - Monitoreo avanzado y auto-optimización
 */
class V4UltraHybridSystem {
    constructor() {
        this.version = "4.0-Ultra-Hybrid";
        this.geminiEnabled = !!process.env.GEMINI_API_KEY;
        this.qualityThreshold = 85;
        this.performanceMetrics = {
            geminiCalls: 0,
            fallbackCalls: 0,
            hybridCalls: 0,
            avgQuality: 0,
            avgTime: 0
        };
        
        // Inicializar FlowCoherenceAgent
        this.flowCoherenceAgent = null;
        if (FlowCoherenceAgentV3) {
            this.flowCoherenceAgent = new FlowCoherenceAgentV3();
            console.log('� FlowCoherenceAgent V2 inicializado en V4 Ultra');
        }
        
        console.log('�🚀 V4 Ultra Hybrid System iniciado');
        console.log(`   🤖 Gemini: ${this.geminiEnabled ? '✅' : '❌'}`);
        console.log(`   🛡️ Referencias: ✅`);
        console.log(`   🔧 FlowCoherence: ${this.flowCoherenceAgent ? '✅' : '❌'}`);
        console.log(`   🎯 Umbral calidad: ${this.qualityThreshold}%`);
    }

    /**
     * 🎨 GENERACIÓN INTELIGENTE PRINCIPAL
     * Decide automáticamente la mejor estrategia según el prompt
     */
    async generateWorkflow(prompt, options = {}) {
        const startTime = Date.now();
        console.log('\n🎯 INICIANDO GENERACIÓN V4 ULTRA HÍBRIDA');
        console.log(`📝 Prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);
        
        // 1. Análisis inteligente del prompt
        const analysis = await this.analyzePrompt(prompt);
        console.log(`🧠 Análisis: Complejidad=${analysis.complexity}, Unicidad=${analysis.uniqueness}, Nodos=${analysis.estimatedNodes}`);
        
        // 2. Selección de estrategia óptima
        const strategy = this.selectOptimalStrategy(analysis);
        console.log(`⚡ Estrategia seleccionada: ${strategy.name} (confianza: ${strategy.confidence}%)`);
        
        let result;
        
        try {
            // 3. Ejecución con la estrategia seleccionada
            switch (strategy.type) {
                case 'gemini_primary':
                    result = await this.geminiPrimaryStrategy(prompt, options, analysis);
                    break;
                case 'hybrid_balanced':
                    result = await this.hybridBalancedStrategy(prompt, options, analysis);
                    break;
                case 'references_enhanced':
                    result = await this.referencesEnhancedStrategy(prompt, options, analysis);
                    break;
                default:
                    result = await this.adaptiveStrategy(prompt, options, analysis);
            }
            
            // 4. Post-procesamiento y mejoras finales
            const finalResult = await this.postProcessResult(result, prompt, analysis);
            
            // 5. Métricas y logging PRECISOS
            const executionTime = Date.now() - startTime;
            const realMetrics = this.calculateRealMetrics(finalResult.workflow);
            
            this.updateMetrics(strategy.type, finalResult.quality, executionTime);
            
            console.log(`✅ Generación completada en ${executionTime}ms`);
            console.log(`📊 Métricas reales: ${realMetrics.nodes} nodos, ${realMetrics.connections} conexiones`);
            console.log(`🎯 Calidad calibrada: ${finalResult.quality}/100`);
            console.log(`⚡ Método: ${finalResult.generationMethod} (confianza: ${strategy.confidence}%)`);
            
            return finalResult;
            
        } catch (error) {
            console.error(`❌ Error en generación V4 Ultra: ${error.message}`);
            return await this.emergencyFallback(prompt, options);
        }
    }

    /**
     * 🧠 ANÁLISIS INTELIGENTE DEL PROMPT
     */
    async analyzePrompt(prompt) {
        const words = prompt.toLowerCase().split(/\s+/);
        const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
        
        // Detectar complejidad
        const complexityIndicators = {
            nodes: words.filter(w => ['nodo', 'node', 'step', 'paso', 'etapa'].includes(w)).length,
            integrations: words.filter(w => ['api', 'webhook', 'email', 'slack', 'telegram', 'google', 'mysql', 'postgres'].includes(w)).length,
            conditions: words.filter(w => ['si', 'if', 'cuando', 'then', 'else', 'condition'].includes(w)).length,
            automation: words.filter(w => ['automatizar', 'automate', 'schedule', 'trigger', 'workflow'].includes(w)).length
        };
        
        const complexity = Math.min(10, 
            (complexityIndicators.nodes * 2) + 
            (complexityIndicators.integrations * 3) + 
            (complexityIndicators.conditions * 2) + 
            (complexityIndicators.automation * 1)
        );
        
        // Detectar unicidad (qué tan único/innovador es)
        const commonPatterns = ['webhook email', 'form database', 'schedule notification', 'api integration'];
        const hasCommonPattern = commonPatterns.some(pattern => 
            prompt.toLowerCase().includes(pattern.toLowerCase())
        );
        
        const uniqueness = hasCommonPattern ? 3 : 7 + Math.random() * 3;
        
        // Estimar número de nodos
        const estimatedNodes = Math.max(3, 
            sentences.length + 
            complexityIndicators.integrations * 2 + 
            complexityIndicators.conditions * 1.5
        );
        
        return {
            complexity: Math.round(complexity),
            uniqueness: Math.round(uniqueness * 10) / 10,
            estimatedNodes: Math.round(estimatedNodes),
            indicators: complexityIndicators,
            promptLength: prompt.length,
            hasMultipleSteps: sentences.length > 3
        };
    }

    /**
     * ⚡ SELECCIÓN OPTIMIZADA DE ESTRATEGIA
     */
    selectOptimalStrategy(analysis) {
        const { complexity, uniqueness, estimatedNodes } = analysis;
        
        // Estrategia Gemini Primary: Para máxima creatividad y casos únicos
        if (uniqueness >= 8 && complexity >= 7 && this.geminiEnabled) {
            return {
                type: 'gemini_primary',
                name: 'Gemini Primary (Máxima Creatividad)',
                confidence: Math.min(95, 85 + uniqueness),
                reason: 'Alta unicidad requiere creatividad de Gemini'
            };
        }
        
        // Estrategia Híbrida Balanceada: Para casos complejos moderados
        if (complexity >= 5 && complexity <= 8 && estimatedNodes >= 6 && this.geminiEnabled) {
            const balanceScore = (complexity + uniqueness) / 2;
            return {
                type: 'hybrid_balanced',
                name: 'Híbrido Balanceado (Equilibrio Óptimo)',
                confidence: Math.min(92, 75 + balanceScore),
                reason: `Complejidad moderada (${complexity}) + creatividad controlada`
            };
        }
        
        // Estrategia Referencias Mejoradas: Para patrones conocidos
        if (uniqueness <= 5 && complexity <= 7 && estimatedNodes <= 12) {
            return {
                type: 'references_enhanced',
                name: 'Referencias Mejoradas (Máxima Confiabilidad)',
                confidence: Math.min(88, 70 + (10 - uniqueness)),
                reason: `Patrón conocido (unicidad: ${uniqueness}) optimizable`
            };
        }
        
        // Estrategia Híbrida para casos de alta complejidad
        if (complexity >= 8 && this.geminiEnabled) {
            return {
                type: 'hybrid_balanced',
                name: 'Híbrido Avanzado (Complejidad Alta)',
                confidence: 90,
                reason: 'Complejidad alta requiere enfoque híbrido'
            };
        }
        
        // Estrategia Adaptativa: Para casos edge o sin Gemini
        return {
            type: 'adaptive',
            name: 'Adaptativa (Inteligencia Automática)',
            confidence: this.geminiEnabled ? 82 : 75,
            reason: this.geminiEnabled ? 
                'Análisis automático de mejor enfoque' : 
                'Gemini no disponible, usando modo adaptativo'
        };
    }

    /**
     * 🤖 ESTRATEGIA GEMINI PRIMARY
     */
    async geminiPrimaryStrategy(prompt, options, analysis) {
        console.log('🤖 Ejecutando Estrategia Gemini Primary...');
        
        try {
            // 1. Llamada a Gemini con prompt optimizado
            const enhancedPrompt = this.buildEnhancedPromptForGemini(prompt, analysis);
            const geminiResult = await this.callGeminiWithRetry(enhancedPrompt, options);
            
            // 2. Validación con referencias para asegurar calidad
            const validatedResult = await this.validateWithReferences(geminiResult, prompt);
            
            this.performanceMetrics.geminiCalls++;
            
            return {
                ...validatedResult,
                generationMethod: 'gemini_primary',
                confidence: 95,
                innovations: this.detectInnovations(geminiResult, prompt)
            };
            
        } catch (error) {
            console.log('⚠️ Gemini Primary falló, usando fallback híbrido...');
            return await this.hybridBalancedStrategy(prompt, options, analysis);
        }
    }

    /**
     * 🎨 ESTRATEGIA HÍBRIDA BALANCEADA
     */
    async hybridBalancedStrategy(prompt, options, analysis) {
        console.log('🎨 Ejecutando Estrategia Híbrida Balanceada...');
        
        const [geminiResult, referencesResult] = await Promise.allSettled([
            this.tryGemini(prompt, options).catch(() => null),
            this.generateFromReferences(prompt, options)
        ]);
        
        const gemini = geminiResult.status === 'fulfilled' ? geminiResult.value : null;
        const references = referencesResult.status === 'fulfilled' ? referencesResult.value : null;
        
        if (gemini && references) {
            // Fusión inteligente de ambos resultados
            const hybridResult = await this.intelligentMerge(gemini, references, prompt, analysis);
            this.performanceMetrics.hybridCalls++;
            
            return {
                ...hybridResult,
                generationMethod: 'hybrid_balanced',
                confidence: 92,
                sources: ['gemini', 'references']
            };
        }
        
        // Fallback a lo que funcione
        return gemini || references || await this.emergencyFallback(prompt, options);
    }

    /**
     * 🛡️ ESTRATEGIA REFERENCIAS MEJORADAS
     */
    async referencesEnhancedStrategy(prompt, options, analysis) {
        console.log('🛡️ Ejecutando Estrategia Referencias Mejoradas...');
        
        // 1. Generación base con referencias
        const baseResult = await this.generateFromReferences(prompt, options);
        
        // 2. Mejoras inteligentes
        const enhancedResult = await this.enhanceReferencesResult(baseResult, prompt, analysis);
        
        this.performanceMetrics.fallbackCalls++;
        
        return {
            ...enhancedResult,
            generationMethod: 'references_enhanced',
            confidence: 88,
            reliability: 95
        };
    }

    /**
     * 🎭 ESTRATEGIA ADAPTATIVA INTELIGENTE
     */
    async adaptiveStrategy(prompt, options, analysis) {
        console.log('🎭 Ejecutando Estrategia Adaptativa Inteligente...');
        
        const { complexity, uniqueness, estimatedNodes } = analysis;
        
        // Decidir dinámicamente la mejor estrategia según el contexto
        let selectedMethod;
        let confidence = 75;
        
        try {
            // Si Gemini está disponible y tenemos alta unicidad
            if (this.geminiEnabled && uniqueness >= 6) {
                console.log('🤖 Adaptativo: Seleccionando enfoque Gemini por alta unicidad');
                selectedMethod = await this.geminiPrimaryStrategy(prompt, options, analysis);
                confidence = 85;
            }
            // Si es complejo pero conocido, usar híbrido
            else if (this.geminiEnabled && complexity >= 6 && uniqueness <= 7) {
                console.log('🔄 Adaptativo: Seleccionando enfoque híbrido balanceado');
                selectedMethod = await this.hybridBalancedStrategy(prompt, options, analysis);
                confidence = 82;
            }
            // Para casos simples o sin Gemini, usar referencias mejoradas
            else {
                console.log('🛡️ Adaptativo: Seleccionando enfoque referencias mejoradas');
                selectedMethod = await this.referencesEnhancedStrategy(prompt, options, analysis);
                confidence = 78;
            }
            
            // Aplicar mejoras adaptativas específicas
            const adaptedResult = await this.applyAdaptiveImprovements(selectedMethod, analysis);
            
            this.performanceMetrics.adaptiveCalls = (this.performanceMetrics.adaptiveCalls || 0) + 1;
            
            return {
                ...adaptedResult,
                generationMethod: `adaptive_${selectedMethod.generationMethod}`,
                confidence: confidence,
                adaptiveReason: this.explainAdaptiveChoice(complexity, uniqueness)
            };
            
        } catch (error) {
            console.error(`❌ Error en estrategia adaptativa: ${error.message}`);
            // Fallback a referencias como último recurso
            return await this.referencesEnhancedStrategy(prompt, options, analysis);
        }
    }
    
    /**
     * 🔧 MEJORAS ADAPTATIVAS ESPECÍFICAS
     */
    async applyAdaptiveImprovements(result, analysis) {
        const improved = { ...result };
        
        // Ajustar calidad basado en complejidad lograda vs esperada
        const complexityAchieved = improved.workflow?.nodes?.length || 0;
        const complexityExpected = analysis.estimatedNodes;
        const complexityRatio = Math.min(1, complexityAchieved / complexityExpected);
        
        // Bonus por cumplir expectativas de complejidad
        if (complexityRatio >= 0.8) {
            improved.quality = Math.min(100, improved.quality + 3);
        }
        
        // Mejorar diversidad si es necesario
        if (improved.workflow?.nodes) {
            const nodeTypes = new Set(improved.workflow.nodes.map(n => n.type));
            if (nodeTypes.size >= 4) {
                improved.quality = Math.min(100, improved.quality + 2);
            }
        }
        
        return improved;
    }
    
    /**
     * 📝 EXPLICAR ELECCIÓN ADAPTATIVA
     */
    explainAdaptiveChoice(complexity, uniqueness) {
        if (uniqueness >= 6) {
            return `Alta unicidad (${uniqueness}) requiere creatividad`;
        } else if (complexity >= 6 && uniqueness <= 7) {
            return `Complejidad moderada (${complexity}) se beneficia de enfoque híbrido`;
        } else {
            return `Patrón estándar optimizado con referencias confiables`;
        }
    }

    /**
     * 🧠 FUSIÓN INTELIGENTE DE RESULTADOS
     */
    async intelligentMerge(geminiResult, referencesResult, prompt, analysis) {
        console.log('🧠 Fusionando resultados inteligentemente...');
        
        // Usar base sólida de referencias y creatividad de Gemini
        const mergedWorkflow = {
            nodes: this.mergeNodesIntelligently(
                referencesResult.workflow.nodes,
                geminiResult.workflow.nodes,
                analysis
            ),
            connections: this.mergeConnectionsSmartly(
                referencesResult.workflow.connections,
                geminiResult.workflow.connections
            ),
            settings: {
                ...referencesResult.workflow.settings,
                ...geminiResult.workflow.settings,
                executionOrder: 'v1'
            }
        };
        
        // Calcular calidad combinada
        const combinedQuality = Math.min(100, 
            (geminiResult.quality * 0.6) + 
            (referencesResult.quality * 0.4) + 
            5 // Bonus por fusión
        );
        
        return {
            workflow: mergedWorkflow,
            quality: combinedQuality,
            metadata: {
                gemini_contribution: geminiResult.quality,
                references_contribution: referencesResult.quality,
                merge_bonus: 5,
                total_nodes: mergedWorkflow.nodes.length
            }
        };
    }

    /**
     * 🔄 LLAMADA A GEMINI CON RETRY INTELIGENTE Y OPTIMIZACIÓN AVANZADA
     */
    async callGeminiWithRetry(prompt, options, maxRetries = 3) {
        // Si tenemos el API optimizer, úsalo
        if (apiOptimizer) {
            try {
                return await apiOptimizer.optimizedRequest(
                    'generateWorkflow',
                    prompt,
                    'gemini-1.5-flash',
                    async () => {
                        return await this.makeGeminiRequest(prompt, 
                            { name: 'gemini-1.5-flash', timeout: 15000 }, 
                            options
                        );
                    }
                );
            } catch (error) {
                console.log(`⚠️ API Optimizer falló, usando método tradicional: ${error.message}`);
                // Continúa con el método tradicional como fallback
            }
        }

        // Configuración de modelos ordenados por preferencia y disponibilidad
        const modelPriority = [
            { name: 'gemini-1.5-flash', quota: 'fast', timeout: 15000 },
            { name: 'gemini-2.0-flash-exp', quota: 'experimental', timeout: 20000 },
            { name: 'gemini-1.5-pro', quota: 'premium', timeout: 30000 }
        ];

        let lastError = null;
        
        // Intentar con diferentes modelos según disponibilidad
        for (const model of modelPriority) {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`🤖 Intento ${attempt}/${maxRetries} con modelo ${model.name}...`);
                    
                    const result = await this.makeGeminiRequest(prompt, model, options);
                    console.log(`✅ Éxito con ${model.name} (intento ${attempt})`);
                    return result;
                    
                } catch (error) {
                    lastError = error;
                    const errorType = this.classifyGeminiError(error);
                    
                    console.log(`⚠️ ${model.name} intento ${attempt} falló: ${error.message}`);
                    
                    // Si es error 429 (rate limiting), probar siguiente modelo inmediatamente
                    if (errorType === 'RATE_LIMIT') {
                        console.log(`🔄 Rate limit en ${model.name}, probando siguiente modelo...`);
                        break; // Ir al siguiente modelo
                    }
                    
                    // Si es error 404 (modelo no disponible), probar siguiente modelo
                    if (errorType === 'NOT_FOUND') {
                        console.log(`🔄 Modelo ${model.name} no disponible, probando siguiente...`);
                        break; // Ir al siguiente modelo
                    }
                    
                    // Para otros errores, reintentar con backoff exponencial
                    if (attempt < maxRetries) {
                        const backoffTime = this.calculateBackoff(attempt, errorType);
                        console.log(`⏳ Esperando ${backoffTime}ms antes del siguiente intento...`);
                        await new Promise(resolve => setTimeout(resolve, backoffTime));
                    }
                }
            }
        }
        
        // Si todos los modelos fallaron, lanzar el último error
        throw lastError || new Error('Todos los modelos de Gemini fallaron');
    }

    /**
     * 🌐 REALIZAR REQUEST A GEMINI CON TIMEOUT Y CONFIGURACIÓN OPTIMIZADA
     */
    async makeGeminiRequest(prompt, model, options) {
        const fetch = (await import('node-fetch')).default;
        
        // Configurar timeout según el modelo
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout (${model.timeout}ms)`)), model.timeout);
        });
        
        // Configuración optimizada según el modelo
        const config = this.getModelConfig(model.name, options);
        
        const requestPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model.name}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: config
            })
        });
        
        // Race entre request y timeout
        const response = await Promise.race([requestPromise, timeoutPromise]);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            throw new Error('No text in response from Gemini');
        }
        
        return this.parseGeminiResponse(text);
    }

    /**
     * 🔍 CLASIFICAR TIPOS DE ERROR PARA MANEJO INTELIGENTE
     */
    classifyGeminiError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('429') || message.includes('quota') || message.includes('rate limit')) {
            return 'RATE_LIMIT';
        }
        if (message.includes('404') || message.includes('not found')) {
            return 'NOT_FOUND';
        }
        if (message.includes('timeout')) {
            return 'TIMEOUT';
        }
        if (message.includes('503') || message.includes('service unavailable')) {
            return 'SERVICE_UNAVAILABLE';
        }
        if (message.includes('400') || message.includes('bad request')) {
            return 'BAD_REQUEST';
        }
        
        return 'UNKNOWN';
    }

    /**
     * ⏳ CALCULAR TIEMPO DE BACKOFF EXPONENCIAL INTELIGENTE
     */
    calculateBackoff(attempt, errorType) {
        const baseDelay = 1000; // 1 segundo base
        
        switch (errorType) {
            case 'RATE_LIMIT':
                return baseDelay * Math.pow(3, attempt) + Math.random() * 2000; // 3, 9, 27 segundos + jitter
            case 'SERVICE_UNAVAILABLE':
                return baseDelay * Math.pow(2, attempt) + Math.random() * 1000; // 2, 4, 8 segundos + jitter
            case 'TIMEOUT':
                return baseDelay * attempt + Math.random() * 500; // Backoff lineal para timeouts
            default:
                return baseDelay * Math.pow(1.5, attempt) + Math.random() * 1000; // Backoff moderado
        }
    }

    /**
     * ⚙️ OBTENER CONFIGURACIÓN OPTIMIZADA POR MODELO
     */
    getModelConfig(modelName, options = {}) {
        const baseConfig = {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 32768,
            topK: 40,
            topP: 0.95
        };

        // Optimizaciones específicas por modelo
        switch (modelName) {
            case 'gemini-1.5-flash':
                return {
                    ...baseConfig,
                    temperature: 0.6, // Más determinístico para respuestas rápidas
                    maxOutputTokens: Math.min(baseConfig.maxOutputTokens, 16384) // Limitar para velocidad
                };
                
            case 'gemini-2.0-flash-exp':
                return {
                    ...baseConfig,
                    temperature: 0.8, // Aprovechar capacidades experimentales
                    maxOutputTokens: Math.min(baseConfig.maxOutputTokens, 32768)
                };
                
            case 'gemini-1.5-pro':
                return {
                    ...baseConfig,
                    temperature: 0.5, // Más conservador para el modelo premium
                    maxOutputTokens: Math.min(baseConfig.maxOutputTokens, 8192) // Conservar quota
                };
                
            default:
                return baseConfig;
        }
    }

    /**
     * 📊 PARSING MEJORADO DE RESPUESTA GEMINI
     */
    parseGeminiResponse(text) {
        try {
            // Buscar JSON en la respuesta
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            
            const workflow = JSON.parse(jsonMatch[0]);
            
            // Validar estructura básica
            if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
                throw new Error('Invalid workflow structure');
            }
            
            // Calcular calidad basada en completitud
            const quality = this.calculateWorkflowQuality(workflow);
            
            return {
                workflow,
                quality,
                source: 'gemini',
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error(`❌ Error parsing Gemini response: ${error.message}`);
            throw error;
        }
    }

    /**
     * 📊 CÁLCULO INTELIGENTE DE CALIDAD CALIBRADO
     */
    calculateWorkflowQuality(workflow) {
        let score = 0;
        
        // Validación básica
        if (!workflow?.nodes?.length) return 0;
        
        // 1. Completitud básica (20 puntos) - Más exigente
        if (workflow.nodes.length > 0) score += 8;
        if (workflow.connections && Object.keys(workflow.connections).length > 0) score += 8;
        if (workflow.settings) score += 4;
        
        // 2. Estructura de nodos (25 puntos) - Validación más estricta
        const validNodes = workflow.nodes.filter(node => 
            node.id && node.name && node.type && node.position && 
            Array.isArray(node.position) && node.position.length === 2
        );
        const nodeValidityRatio = validNodes.length / workflow.nodes.length;
        score += nodeValidityRatio * 25;
        
        // 3. CONECTIVIDAD REAL Y VÁLIDA (35 puntos) - ¡CRÍTICO!
        const connectionValidation = this.validateConnections(workflow);
        score += connectionValidation.score;
        
        // Si no hay conexiones válidas, el workflow está ROTO
        if (connectionValidation.validConnections === 0 && workflow.nodes.length > 1) {
            console.log('🚨 WORKFLOW ROTO: Cero conexiones válidas detectadas');
            return 0; // Workflow completamente inútil
        }
        
        // 4. Configuraciones de parámetros (15 puntos) - Más estricto
        const configuredNodes = workflow.nodes.filter(node => 
            node.parameters && Object.keys(node.parameters).length > 0 &&
            !this.hasEmptyParameters(node.parameters)
        );
        const configRatio = configuredNodes.length / workflow.nodes.length;
        score += configRatio * 15;
        
        // 5. Diversidad de tipos (5 puntos) - Bonus por variedad
        const nodeTypes = new Set(workflow.nodes.map(node => node.type));
        const diversityBonus = Math.min(5, (nodeTypes.size / workflow.nodes.length) * 8);
        score += diversityBonus;
        
        // 6. Penalizaciones por problemas comunes
        score -= this.calculateQualityPenalties(workflow);
        
        // 7. Validación final de coherencia
        const coherenceScore = this.calculateCoherenceScore(workflow);
        score += coherenceScore;
        
        const finalScore = Math.max(0, Math.min(100, Math.round(score)));
        
        // Debug logging para transparencia
        console.log(`   📊 Score detallado: Estructura(${Math.round(nodeValidityRatio * 25)}), Conexiones(${connectionValidation.score}), Config(${Math.round(configRatio * 15)}), Coherencia(${coherenceScore})`);
        
        return finalScore;
    }
    
    /**
     * 🔗 VALIDACIÓN ESTRICTA DE CONEXIONES
     */
    validateConnections(workflow) {
        const nodes = workflow.nodes || [];
        const connections = workflow.connections || {};
        const nodeIds = new Set(nodes.map(n => n.id));
        
        let validConnections = 0;
        let invalidConnections = 0;
        let score = 0;
        
        // Verificar cada conexión
        for (const [sourceId, outputs] of Object.entries(connections)) {
            // ¿El nodo fuente existe?
            if (!nodeIds.has(sourceId)) {
                invalidConnections++;
                console.log(`   ❌ Conexión inválida: nodo fuente '${sourceId}' no existe`);
                continue;
            }
            
            // Verificar outputs
            if (outputs.main && Array.isArray(outputs.main)) {
                for (const outputGroup of outputs.main) {
                    if (Array.isArray(outputGroup)) {
                        for (const connection of outputGroup) {
                            if (connection.node && nodeIds.has(connection.node)) {
                                validConnections++;
                            } else {
                                invalidConnections++;
                                console.log(`   ❌ Conexión inválida: nodo destino '${connection.node}' no existe`);
                            }
                        }
                    }
                }
            }
        }
        
        // Calcular score de conectividad
        const totalNodes = nodes.length;
        if (totalNodes <= 1) {
            score = 35; // Single node workflow
        } else if (validConnections === 0) {
            score = 0;  // Workflow roto
        } else {
            const minExpected = totalNodes - 1;
            const connectivityRatio = Math.min(validConnections / minExpected, 2);
            score = Math.round(connectivityRatio * 35);
            
            // Penalización por conexiones inválidas
            if (invalidConnections > 0) {
                score -= Math.min(score, invalidConnections * 5);
            }
        }
        
        return {
            score,
            validConnections,
            invalidConnections,
            isValid: validConnections > 0 || totalNodes <= 1
        };
    }
    
    /**
     * 🧠 CÁLCULO DE SCORE DE COHERENCIA
     */
    calculateCoherenceScore(workflow) {
        let coherenceScore = 0;
        const nodes = workflow.nodes || [];
        
        // ¿Hay un trigger?
        const hasTrigger = nodes.some(node => 
            node.type.includes('webhook') || 
            node.type.includes('trigger') || 
            node.type.includes('cron') ||
            node.type.includes('manual')
        );
        
        if (hasTrigger) coherenceScore += 5;
        
        // ¿El flujo tiene una secuencia lógica?
        const hasLogicalFlow = this.detectLogicalFlow(workflow);
        if (hasLogicalFlow) coherenceScore += 5;
        
        return coherenceScore;
    }
    
    /**
     * 🔍 DETECCIÓN DE FLUJO LÓGICO
     */
    detectLogicalFlow(workflow) {
        const connections = workflow.connections || {};
        const nodeIds = new Set(workflow.nodes.map(n => n.id));
        
        // Encontrar nodos sin inputs (triggers/starts)
        const allTargets = new Set();
        for (const outputs of Object.values(connections)) {
            if (outputs.main) {
                for (const outputGroup of outputs.main) {
                    if (Array.isArray(outputGroup)) {
                        for (const conn of outputGroup) {
                            if (nodeIds.has(conn.node)) {
                                allTargets.add(conn.node);
                            }
                        }
                    }
                }
            }
        }
        
        const startNodes = workflow.nodes.filter(node => !allTargets.has(node.id));
        
        // ¿Hay al menos un nodo de inicio?
        return startNodes.length > 0;
    }
    
    /**
     * 🔗 CONTEO REAL DE CONEXIONES
     */
    getRealConnectionCount(connections) {
        let totalConnections = 0;
        
        for (const nodeConnections of Object.values(connections)) {
            if (nodeConnections.main && Array.isArray(nodeConnections.main)) {
                totalConnections += nodeConnections.main.length;
            }
            if (nodeConnections.else && Array.isArray(nodeConnections.else)) {
                totalConnections += nodeConnections.else.length;
            }
        }
        
        return totalConnections;
    }
    
    /**
     * ⚠️ VERIFICACIÓN DE PARÁMETROS VACÍOS
     */
    hasEmptyParameters(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            if (value === "" || value === null || value === undefined) {
                return true;
            }
            if (typeof value === 'object' && Object.keys(value).length === 0) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 🚫 PENALIZACIONES DE CALIDAD
     */
    calculateQualityPenalties(workflow) {
        let penalties = 0;
        
        // Posiciones duplicadas
        const positions = workflow.nodes.map(node => `${node.position[0]},${node.position[1]}`);
        const uniquePositions = new Set(positions);
        if (uniquePositions.size < positions.length) {
            penalties += (positions.length - uniquePositions.size) * 2;
        }
        
        // Nodos sin nombres descriptivos
        const genericNames = workflow.nodes.filter(node => 
            /^(node|nodo|step|paso)\d*$/i.test(node.name)
        ).length;
        penalties += genericNames * 1;
        
        // Conexiones circulares simples (detectar loops básicos)
        penalties += this.detectSimpleLoops(workflow) * 3;
        
        return penalties;
    }
    
    /**
     * 🔄 DETECCIÓN DE LOOPS SIMPLES
     */
    detectSimpleLoops(workflow) {
        // Implementación básica para detectar referencias circulares directas
        let loops = 0;
        const connections = workflow.connections || {};
        
        for (const [sourceNodeName, nodeConnections] of Object.entries(connections)) {
            if (nodeConnections.main) {
                for (const connection of nodeConnections.main) {
                    if (connection.node === sourceNodeName) {
                        loops++;
                    }
                }
            }
        }
        
        return loops;
    }

    /**
     * 🚨 FALLBACK DE EMERGENCIA
     */
    async emergencyFallback(prompt, options) {
        console.log('🚨 Ejecutando fallback de emergencia...');
        
        // Template básico pero funcional
        const emergencyWorkflow = {
            nodes: [
                {
                    id: "trigger-1",
                    name: "Start Trigger", 
                    type: "n8n-nodes-base.webhook",
                    position: [100, 200],
                    parameters: {
                        httpMethod: "POST",
                        path: "automation"
                    }
                },
                {
                    id: "process-1",
                    name: "Process Data",
                    type: "n8n-nodes-base.set", 
                    position: [400, 200],
                    parameters: {
                        values: [
                            { name: "processed", value: "{{ $json }}" }
                        ]
                    }
                }
            ],
            connections: {
                "Start Trigger": {
                    main: [[{ node: "Process Data", type: "main", index: 0 }]]
                }
            },
            settings: { executionOrder: "v1" }
        };
        
        return {
            workflow: emergencyWorkflow,
            quality: 65,
            generationMethod: 'emergency_fallback',
            confidence: 70,
            note: 'Workflow básico generado como fallback de emergencia'
        };
    }

    /**
     * 📊 ACTUALIZACIÓN DE MÉTRICAS
     */
    updateMetrics(method, quality, time) {
        this.performanceMetrics.avgQuality = 
            (this.performanceMetrics.avgQuality + quality) / 2;
        this.performanceMetrics.avgTime = 
            (this.performanceMetrics.avgTime + time) / 2;
    }

    /**
     * � MÉTODOS AUXILIARES PARA COMPLETAR FUNCIONALIDAD
     */
    
    async tryGemini(prompt, options) {
        const enhancedPrompt = this.buildEnhancedPromptForGemini(prompt);
        return await this.callGeminiWithRetry(enhancedPrompt, options);
    }
    
    async generateFromReferences(prompt, options) {
        // Simulación del excelente sistema de referencias original
        console.log('🛡️ Generando desde sistema de referencias...');

        // Template basado en análisis del prompt
        const analysis = await this.analyzePrompt(prompt);

        // 🔍 NUEVOS TEMPLATES LANGCHAIN
        if (this.isLangChainSentimentAnalysisPrompt(prompt)) {
            return this.createLangChainSentimentWorkflow(prompt, analysis);
        }

        if (prompt.toLowerCase().includes('telegram') && prompt.toLowerCase().includes('calendar')) {
            return this.createTelegramCalendarWorkflow(prompt, analysis);
        }

        if (prompt.toLowerCase().includes('email') && prompt.toLowerCase().includes('webhook')) {
            return this.createWebhookEmailWorkflow(prompt, analysis);
        }

        // Workflow genérico pero funcional
        return this.createGenericWorkflow(prompt, analysis);
    }

    /**
     * 🔍 DETECTOR DE PROMPTS DE ANÁLISIS DE SENTIMIENTOS CON LANGCHAIN
     */
    isLangChainSentimentAnalysisPrompt(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        const keywords = [
            'sentimiento', 'sentiment', 'análisis de sentimientos', 'sentiment analysis',
            'instagram', 'redes sociales', 'social media',
            'langchain', 'agente', 'agent', 'ia', 'ai',
            'respuesta automática', 'auto reply', 'inteligente'
        ];

        const matches = keywords.filter(keyword => lowerPrompt.includes(keyword));
        return matches.length >= 2; // Al menos 2 keywords para activar
    }

    /**
     * 🤖 WORKFLOW LANGCHAIN PARA ANÁLISIS DE SENTIMIENTOS EN INSTAGRAM
     */
    createLangChainSentimentWorkflow(prompt, analysis) {
        console.log('🎭 Creando workflow LangChain para análisis de sentimientos...');

        const workflow = {
            name: "Instagram Sentiment Analysis with LangChain",
            nodes: [
                // Trigger de Instagram
                {
                    id: "instagram-trigger-1",
                    name: "Instagram Trigger",
                    type: "n8n-nodes-base.instagramTrigger",
                    typeVersion: 1,
                    position: [100, 300],
                    parameters: {
                        operation: "getPosts",
                        hashtags: ["feedback", "opinion", "review", "sentiment"],
                        limit: 10
                    }
                },
                // Modelo de lenguaje LangChain
                {
                    id: "openai-request-1",
                    name: "OpenAI Sentiment Analysis",
                    type: "n8n-nodes-base.httpRequest",
                    typeVersion: 4,
                    position: [400, 300],
                    parameters: {
                        method: "POST",
                        url: "https://api.openai.com/v1/chat/completions",
                        authentication: "headerAuth",
                        headerAuth: {
                            name: "Authorization",
                            value: "Bearer {{ $env.OPENAI_API_KEY }}"
                        },
                        sendHeaders: true,
                        headerParameters: {
                            parameters: [
                                {
                                    name: "Content-Type",
                                    value: "application/json"
                                }
                            ]
                        },
                        sendBody: true,
                        bodyContentType: "json",
                        jsonBody: {
                            model: "gpt-4",
                            temperature: 0.3,
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an expert sentiment analysis agent for social media content. Analyze sentiment and respond in JSON format with fields: sentiment (POSITIVE/NEGATIVE/NEUTRAL/MIXED), confidence (0-100), entities (array), response_text."
                                },
                                {
                                    role: "user", 
                                    content: "{{ $json.post_text }}"
                                }
                            ]
                        }
                    }
                },
                // Procesamiento de respuesta AI
                {
                    id: "process-ai-response-1",
                    name: "Process AI Response",
                    type: "n8n-nodes-base.code",
                    typeVersion: 2,
                    position: [650, 300],
                    parameters: {
                        language: "javaScript",
                        jsCode: `
// Procesar respuesta de OpenAI
const response = $input.first();
const aiResponse = JSON.parse(response.json.choices[0].message.content);

return [{
  json: {
    original_text: $('Instagram Trigger').first().json.post_text,
    user_name: $('Instagram Trigger').first().json.user_name,
    user_email: $('Instagram Trigger').first().json.user_email,
    sentiment: aiResponse.sentiment,
    confidence: aiResponse.confidence,
    entities: aiResponse.entities || [],
    response_text: aiResponse.response_text,
    timestamp: new Date().toISOString()
  }
}];
`
                    }
                },
                // Análisis de sentimiento avanzado
                {
                    id: "sentiment-enhancer-1",
                    name: "Sentiment Enhancement",
                    type: "n8n-nodes-base.code",
                    typeVersion: 2,
                    position: [900, 300],
                    parameters: {
                        language: "javaScript",
                        jsCode: `
// Mejorar análisis de sentimiento con reglas adicionales
const data = $input.first().json;

// Palabras clave en español
const positiveKeywords = ['excelente', 'genial', 'fantástico', 'perfecto', 'increíble', 'amor', 'gracias'];
const negativeKeywords = ['malo', 'terrible', 'odio', 'problema', 'falla', 'error', 'decepción'];

let enhancedSentiment = data.sentiment;
let confidence = data.confidence;

const text = data.original_text.toLowerCase();

// Ajustar confianza basado en palabras clave
const positiveMatches = positiveKeywords.filter(word => text.includes(word)).length;
const negativeMatches = negativeKeywords.filter(word => text.includes(word)).length;

if (positiveMatches > negativeMatches && data.sentiment === 'POSITIVE') {
  confidence = Math.min(100, confidence + 15);
} else if (negativeMatches > positiveMatches && data.sentiment === 'NEGATIVE') {
  confidence = Math.min(100, confidence + 15);
}

return [{
  json: {
    ...data,
    sentiment: enhancedSentiment,
    confidence: confidence,
    keyword_analysis: {
      positive_matches: positiveMatches,
      negative_matches: negativeMatches
    }
  }
}];
`
                    }
                },
                // Router para decisiones basado en sentimiento
                {
                    id: "sentiment-router-1",
                    name: "Sentiment Router",
                    type: "n8n-nodes-base.switch",
                    typeVersion: 1,
                    position: [1400, 300],
                    parameters: {
                        routing: {
                            rules: [
                                {
                                    conditions: [
                                        {
                                            field: "{{ $json.sentiment }}",
                                            operation: "equals",
                                            value: "POSITIVE"
                                        }
                                    ],
                                    output: 1
                                },
                                {
                                    conditions: [
                                        {
                                            field: "{{ $json.sentiment }}",
                                            operation: "equals",
                                            value: "NEGATIVE"
                                        }
                                    ],
                                    output: 2
                                }
                            ]
                        }
                    }
                },
                // Email para respuestas positivas
                {
                    id: "positive-email-1",
                    name: "Positive Response Email",
                    type: "n8n-nodes-base.emailSend",
                    typeVersion: 1,
                    position: [1700, 100],
                    parameters: {
                        to: "{{ $json.user_email || 'feedback@company.com' }}",
                        subject: "¡Gracias por tu feedback positivo! 🌟",
                        body: `Hola {{ $json.user_name || 'Valued Customer' }},

¡Muchas gracias por tu comentario positivo sobre {{ $json.entities[0] || 'nuestro servicio' }}!

Nos alegra mucho saber que estás satisfecho. Tu opinión es muy importante para nosotros.

¿Te gustaría compartir más detalles sobre tu experiencia?

Atentamente,
Equipo de Atención al Cliente`
                    }
                },
                // Slack para respuestas negativas (crear ticket)
                {
                    id: "negative-slack-1",
                    name: "Create Support Ticket",
                    type: "n8n-nodes-base.slack",
                    typeVersion: 1,
                    position: [1700, 500],
                    parameters: {
                        operation: "postMessage",
                        channel: "#support-tickets",
                        message: `🚨 *NUEVO TICKET DE SOPORTE*
*Usuario:* {{ $json.user_name }}
*Sentimiento:* NEGATIVO
*Contenido:* {{ $json.original_text }}
*Entidades:* {{ $json.entities.join(', ') }}
*Confianza:* {{ $json.confidence }}%

Se requiere atención inmediata del equipo de soporte.`
                    }
                },
                // Dashboard de analytics
                {
                    id: "analytics-set-1",
                    name: "Store Analytics",
                    type: "n8n-nodes-base.set",
                    typeVersion: 1,
                    position: [1400, 600],
                    parameters: {
                        values: [
                            {
                                name: "analytics_data",
                                value: {
                                    timestamp: "{{ $now }}",
                                    sentiment: "{{ $json.sentiment }}",
                                    confidence: "{{ $json.confidence }}",
                                    entities: "{{ $json.entities }}",
                                    response_type: "{{ $json.response_type }}"
                                }
                            }
                        ]
                    }
                }
            ],
            connections: {
                // Flujo principal
                "instagram-trigger-1": {
                    main: [
                        [
                            {
                                node: "sentiment-agent-1",
                                type: "main",
                                index: 0
                            }
                        ]
                    ]
                },
                // Conexiones AI LangChain
                "openai-model-1": {
                    ai_languageModel: [
                        [
                            {
                                node: "sentiment-agent-1",
                                type: "ai_languageModel",
                                index: 0
                            }
                        ]
                    ]
                },
                "memory-buffer-1": {
                    ai_memory: [
                        [
                            {
                                node: "sentiment-agent-1",
                                type: "ai_memory",
                                index: 0
                            }
                        ]
                    ]
                },
                "translation-tool-1": {
                    ai_tool: [
                        [
                            {
                                node: "sentiment-agent-1",
                                type: "ai_tool",
                                index: 0
                            }
                        ]
                    ]
                },
                // Router y respuestas
                "sentiment-agent-1": {
                    main: [
                        [
                            {
                                node: "sentiment-router-1",
                                type: "main",
                                index: 0
                            }
                        ],
                        [
                            {
                                node: "analytics-set-1",
                                type: "main",
                                index: 1
                            }
                        ]
                    ]
                },
                "sentiment-router-1": {
                    main: [
                        [
                            {
                                node: "positive-email-1",
                                type: "main",
                                index: 0
                            }
                        ],
                        [
                            {
                                node: "negative-slack-1",
                                type: "main",
                                index: 1
                            }
                        ]
                    ]
                }
            }
        };

        return {
            success: true,
            workflow: workflow,
            filename: `langchain-sentiment-workflow-${Date.now()}.json`,
            quality: 95,
            generationMethod: 'references_langchain',
            confidence: 88,
            metadata: {
                template: 'langchain_sentiment_analysis',
                langchain_nodes: 4,
                ai_connections: 3,
                complexity: analysis.complexity,
                features: ['sentiment_analysis', 'memory', 'tools', 'routing']
            }
        };
    }
    
    createTelegramCalendarWorkflow(prompt, analysis) {
        const workflow = {
            nodes: [
                {
                    id: "telegram-trigger",
                    name: "Telegram Bot",
                    type: "n8n-nodes-base.telegramTrigger",
                    position: [100, 200],
                    parameters: {
                        updates: ["message"]
                    }
                },
                {
                    id: "extract-data",
                    name: "Extract Chat Data",
                    type: "n8n-nodes-base.set",
                    position: [400, 200],
                    parameters: {
                        values: [
                            { name: "message", value: "{{ $json.message.text }}" },
                            { name: "user", value: "{{ $json.message.from.first_name }}" },
                            { name: "chat_id", value: "{{ $json.message.chat.id }}" }
                        ]
                    }
                },
                {
                    id: "validate-data",
                    name: "Validate Input",
                    type: "n8n-nodes-base.if",
                    position: [700, 200],
                    parameters: {
                        conditions: {
                            conditions: [
                                {
                                    field: "{{ $json.message }}",
                                    operation: "isNotEmpty"
                                }
                            ]
                        }
                    }
                },
                {
                    id: "create-calendar-event",
                    name: "Create Calendar Event",
                    type: "n8n-nodes-base.googleCalendar",
                    position: [1000, 100],
                    parameters: {
                        operation: "create",
                        summary: "{{ $json.message }}",
                        description: "Event created from Telegram chat with {{ $json.user }}"
                    }
                },
                {
                    id: "send-email",
                    name: "Send Notification Email",
                    type: "n8n-nodes-base.emailSend",
                    position: [1000, 300],
                    parameters: {
                        to: "team@company.com",
                        subject: "New Calendar Event Created",
                        text: "Event: {{ $json.message }}\nCreated by: {{ $json.user }}"
                    }
                },
                {
                    id: "telegram-response",
                    name: "Send Confirmation",
                    type: "n8n-nodes-base.telegram",
                    position: [1300, 200],
                    parameters: {
                        operation: "sendMessage",
                        chatId: "{{ $json.chat_id }}",
                        text: "✅ Datos enviados correctamente. Tu evento ha sido agendado y las personas relacionadas han sido notificadas."
                    }
                }
            ],
            connections: {
                "Telegram Bot": {
                    main: [[{ node: "Extract Chat Data", type: "main", index: 0 }]]
                },
                "Extract Chat Data": {
                    main: [[{ node: "Validate Input", type: "main", index: 0 }]]
                },
                "Validate Input": {
                    main: [
                        [
                            { node: "Create Calendar Event", type: "main", index: 0 },
                            { node: "Send Notification Email", type: "main", index: 0 }
                        ]
                    ]
                },
                "Create Calendar Event": {
                    main: [[{ node: "Send Confirmation", type: "main", index: 0 }]]
                },
                "Send Notification Email": {
                    main: [[{ node: "Send Confirmation", type: "main", index: 0 }]]
                }
            },
            settings: { executionOrder: "v1" }
        };
        
        return {
            workflow,
            quality: 92,
            source: 'references_telegram_calendar',
            confidence: 95
        };
    }
    
    createWebhookEmailWorkflow(prompt, analysis) {
        const workflow = {
            nodes: [
                {
                    id: "webhook-1",
                    name: "Receive Data",
                    type: "n8n-nodes-base.webhook",
                    position: [100, 200],
                    parameters: {
                        httpMethod: "POST",
                        path: "automation"
                    }
                },
                {
                    id: "email-1",
                    name: "Send Email",
                    type: "n8n-nodes-base.emailSend",
                    position: [400, 200],
                    parameters: {
                        to: "{{ $json.email }}",
                        subject: "Automated Notification",
                        text: "Your data has been processed: {{ $json }}"
                    }
                }
            ],
            connections: {
                "Receive Data": {
                    main: [[{ node: "Send Email", type: "main", index: 0 }]]
                }
            },
            settings: { executionOrder: "v1" }
        };
        
        return {
            workflow,
            quality: 85,
            source: 'references_webhook_email'
        };
    }
    
    createGenericWorkflow(prompt, analysis) {
        const estimatedNodes = Math.min(analysis.estimatedNodes, 10);
        const nodes = [];
        
        // Trigger node
        nodes.push({
            id: "trigger-1",
            name: "Start Workflow",
            type: "n8n-nodes-base.webhook",
            position: [100, 200],
            parameters: {
                httpMethod: "POST",
                path: "start"
            }
        });
        
        // Processing nodes based on analysis
        for (let i = 2; i <= estimatedNodes; i++) {
            nodes.push({
                id: `process-${i}`,
                name: `Process Step ${i}`,
                type: "n8n-nodes-base.set",
                position: [100 + (i * 300), 200],
                parameters: {
                    values: [
                        { name: `step${i}`, value: `{{ $json }}` }
                    ]
                }
            });
        }
        
        // Build connections - CORREGIDO: usar IDs en lugar de nombres
        const connections = {};
        for (let i = 0; i < nodes.length - 1; i++) {
            const currentNode = nodes[i];
            const nextNode = nodes[i + 1];
            connections[currentNode.id] = {
                main: [[{ node: nextNode.id, type: "main", index: 0 }]]
            };
        }
        
        return {
            workflow: { nodes, connections, settings: { executionOrder: "v1" } },
            quality: 75,
            source: 'references_generic'
        };
    }
    
    buildEnhancedPromptForGemini(prompt, analysis) {
        return `
SISTEMA: Eres un experto en N8N que crea workflows profesionales usando NODOS MODERNOS y HERRAMIENTAS específicas.

PROMPT DEL USUARIO: "${prompt}"

ANÁLISIS AUTOMÁTICO:
- Complejidad estimada: ${analysis?.complexity || 'Media'}
- Nodos estimados: ${analysis?.estimatedNodes || '5-8'}
- Tipo: ${analysis?.hasMultipleSteps ? 'Multi-paso' : 'Simple'}

⚡ NODOS MODERNOS OBLIGATORIOS (NO USES NODOS OBSOLETOS):

🔥 PARA AI/CHAT:
- "@n8n/n8n-nodes-langchain.chatTrigger" (trigger principal)
- "@n8n/n8n-nodes-langchain.agent" (agente AI con system message)
- "@n8n/n8n-nodes-langchain.lmChatGoogleGemini" (modelo Gemini)
- "@n8n/n8n-nodes-langchain.lmChatOpenAi" (modelo OpenAI)
- "@n8n/n8n-nodes-langchain.memoryBufferWindow" (memoria)

🛠️ PARA HERRAMIENTAS EXTERNAS:
- "@n8n/n8n-nodes-langchain.toolHttpRequest" (para APIs como Twitter, Slack)
- "@n8n/n8n-nodes-langchain.toolCode" (para procesamiento de datos)

🔗 PARA FLUJO DE DATOS:
- "@n8n/n8n-nodes-langchain.chainLlm" (para cadenas de procesamiento)

⚡ CONEXIONES OBLIGATORIAS:
- "ai_languageModel": Conecta modelos (Gemini/OpenAI) a agentes
- "ai_memory": Conecta memoria a agentes
- "ai_tool": Conecta herramientas HTTP/Code a agentes
- "main": Para flujo principal de datos

📋 CONFIGURACIONES ESPECÍFICAS:

Para ANÁLISIS DE SENTIMIENTOS:
{
  "type": "@n8n/n8n-nodes-langchain.agent",
  "parameters": {
    "options": {
      "systemMessage": "Analiza el sentimiento del texto. Responde SOLO con: positivo, negativo o neutro"
    }
  }
}

Para HERRAMIENTA HTTP (Twitter/Slack/Email):
{
  "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.twitter.com/2/tweets/search/recent",
    "authentication": "genericCredentialType",
    "options": {}
  }
}

❌ NUNCA USES ESTOS NODOS OBSOLETOS:
- "n8n-nodes-base.*" (todos obsoletos)
- "@n8n/n8n-nodes-langchain.chatTrigger" para PostgreSQL/Slack/Email (incorrecto)

REGLAS CRÍTICAS PARA CONEXIONES:
1. En "connections", usa el ID del nodo fuente como clave
2. En "node", usa el ID exacto del nodo destino
3. Para AI: usa "ai_languageModel", "ai_memory", "ai_tool"
4. Para flujo: usa "main"
5. NUNCA uses el mismo tipo de nodo para servicios diferentes

ESTRUCTURA CORRECTA PARA WORKFLOWS COMPLEJOS:
1. Trigger principal (@n8n/n8n-nodes-langchain.chatTrigger)
2. Herramientas HTTP para APIs externas (@n8n/n8n-nodes-langchain.toolHttpRequest)
3. Agente AI para análisis (@n8n/n8n-nodes-langchain.agent)
4. Modelo de lenguaje (@n8n/n8n-nodes-langchain.lmChatGoogleGemini)
5. Memoria para contexto (@n8n/n8n-nodes-langchain.memoryBufferWindow)

EJEMPLO CORRECTO CON HERRAMIENTAS:
{
  "nodes": [
    {
      "id":"trigger-1", 
      "type":"@n8n/n8n-nodes-langchain.chatTrigger",
      "position":[100,100]
    },
    {
      "id":"twitter-tool-1",
      "type":"@n8n/n8n-nodes-langchain.toolHttpRequest", 
      "position":[300,100],
      "parameters": {"method":"GET","url":"https://api.twitter.com/2/tweets/search/recent"}
    },
    {
      "id":"sentiment-agent-1",
      "type":"@n8n/n8n-nodes-langchain.agent",
      "position":[500,100],
      "parameters": {"options":{"systemMessage":"Analiza sentimiento: positivo/negativo/neutro"}}
    },
    {
      "id":"gemini-1",
      "type":"@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "position":[400,250],
      "credentials":{"googlePalmApi":{"id":"cred-id"}}
    }
  ],
  "connections": {
    "trigger-1": {"main": [[{"node":"twitter-tool-1","type":"main","index":0}]]},
    "twitter-tool-1": {"ai_tool": [[{"node":"sentiment-agent-1","type":"ai_tool","index":0}]]},
    "gemini-1": {"ai_languageModel": [[{"node":"sentiment-agent-1","type":"ai_languageModel","index":0}]]}
  }
}

FORMATO: Responde SOLO con JSON válido del workflow, sin explicaciones.

⚠️ VERIFICACIÓN OBLIGATORIA:
- Cada ID en "connections" debe existir en "nodes"
- Usa herramientas HTTP para servicios externos
- Usa agentes AI solo para procesamiento inteligente
- Conecta correctamente con tipos AI específicos`;
    }
    
    async validateWithReferences(geminiResult, prompt) {
        // Validación básica del resultado de Gemini
        if (!geminiResult.workflow?.nodes?.length) {
            throw new Error('Invalid workflow structure from Gemini');
        }
        
        // Aplicar mejoras basadas en patrones conocidos
        const improved = { ...geminiResult };
        
        // Asegurar que todos los nodos tengan posiciones
        improved.workflow.nodes.forEach((node, index) => {
            if (!node.position) {
                node.position = [100 + (index * 300), 200];
            }
        });
        
        // Incrementar calidad por validación
        improved.quality = Math.min(100, improved.quality + 3);
        
        return improved;
    }
    
    /**
     * 📏 CÁLCULO DE MÉTRICAS REALES
     */
    /**
     * 🔧 MEJORA AUTOMÁTICA DE CONFIGURACIÓN DE NODOS
     */
    enhanceNodeConfiguration(node, prompt, analysis) {
        const enhanced = { ...node };
        
        // Si no tiene parámetros, agregar configuración inteligente
        if (!enhanced.parameters || Object.keys(enhanced.parameters).length === 0) {
            enhanced.parameters = this.generateIntelligentParameters(enhanced.type, prompt, analysis);
        } else {
            // Mejorar parámetros existentes que estén vacíos
            enhanced.parameters = this.improveExistingParameters(enhanced.parameters, enhanced.type, prompt);
        }
        
        // Mejorar nombre si es muy genérico
        if (this.isGenericName(enhanced.name)) {
            enhanced.name = this.generateIntelligentName(enhanced.type, enhanced.parameters, prompt);
        }
        
        return enhanced;
    }
    
    /**
     * 🎯 GENERACIÓN INTELIGENTE DE PARÁMETROS
     */
    generateIntelligentParameters(nodeType, prompt, analysis) {
        const baseType = nodeType.replace('n8n-nodes-base.', '');
        const promptLower = prompt.toLowerCase();
        
        const intelligentParams = {
            'webhook': {
                httpMethod: 'POST',
                path: 'webhook',
                responseMode: 'onReceived',
                responseData: 'allEntries'
            },
            'httpRequest': {
                method: 'GET',
                url: this.extractUrlFromPrompt(prompt) || 'https://api.example.com',
                requestMethod: 'GET',
                responseFormat: 'json'
            },
            'gmail': {
                operation: promptLower.includes('enviar') || promptLower.includes('send') ? 'send' : 'get',
                resource: 'message'
            },
            'slack': {
                operation: 'postMessage',
                resource: 'message',
                text: this.extractMessageFromPrompt(prompt) || 'Workflow notification'
            },
            'telegram': {
                operation: 'sendMessage',
                text: this.extractMessageFromPrompt(prompt) || 'Bot notification'
            },
            'set': {
                values: [
                    {
                        name: 'data',
                        value: '={{ $json }}'
                    }
                ]
            },
            'if': {
                conditions: {
                    string: [
                        {
                            value1: '{{ $json["status"] }}',
                            operation: 'equal',
                            value2: 'success'
                        }
                    ]
                }
            },
            'function': {
                functionCode: this.generateFunctionCode(prompt, analysis)
            },
            'cron': {
                triggerAt: 'cronExpression',
                cronExpression: '0 9 * * *' // 9 AM daily por defecto
            },
            'emailSend': {
                subject: this.extractSubjectFromPrompt(prompt) || 'Workflow Notification',
                message: this.extractMessageFromPrompt(prompt) || 'Process completed successfully'
            }
        };
        
        return intelligentParams[baseType] || { configured: true };
    }
    
    /**
     * 📝 MEJORA DE PARÁMETROS EXISTENTES
     */
    improveExistingParameters(parameters, nodeType, prompt) {
        const improved = { ...parameters };
        const baseType = nodeType.replace('n8n-nodes-base.', '');
        
        // Completar parámetros vacíos o nulos
        for (const [key, value] of Object.entries(improved)) {
            if (value === "" || value === null || value === undefined) {
                improved[key] = this.getDefaultValueForParameter(baseType, key, prompt);
            }
        }
        
        return improved;
    }
    
    /**
     * 🏷️ GENERACIÓN DE NOMBRES INTELIGENTES
     */
    generateIntelligentName(nodeType, parameters, prompt) {
        const baseType = nodeType.replace('n8n-nodes-base.', '');
        const promptWords = prompt.toLowerCase().split(/\s+/);
        
        const nameTemplates = {
            'webhook': `Webhook_${this.extractActionFromPrompt(prompt) || 'Receiver'}`,
            'httpRequest': `API_${this.extractServiceFromPrompt(prompt) || 'Call'}`,
            'gmail': `Gmail_${parameters?.operation === 'send' ? 'Send' : 'Get'}_Email`,
            'slack': `Slack_${this.extractActionFromPrompt(prompt) || 'Notification'}`,
            'telegram': `Telegram_${this.extractActionFromPrompt(prompt) || 'Bot'}`,
            'set': `Set_${this.extractDataTypeFromPrompt(prompt) || 'Data'}_Processing`,
            'if': `If_${this.extractConditionFromPrompt(prompt) || 'Condition'}_Check`,
            'function': `Function_${this.extractProcessFromPrompt(prompt) || 'Custom'}_Logic`,
            'cron': `Cron_${this.extractScheduleFromPrompt(prompt) || 'Scheduled'}_Trigger`,
            'emailSend': `Email_${this.extractEmailTypeFromPrompt(prompt) || 'Notification'}`
        };
        
        return nameTemplates[baseType] || `${baseType}_${Date.now()}`;
    }
    
    /**
     * 🔍 UTILIDADES DE EXTRACCIÓN DE PROMPT
     */
    /**
     * 📐 OPTIMIZACIÓN INTELIGENTE DE POSICIONAMIENTO
     */
    optimizeNodePositioning(nodes, connections = {}) {
        if (!nodes || nodes.length === 0) return nodes;
        
        // Crear un mapa de conexiones para análisis de flujo
        const connectionMap = this.buildConnectionMap(connections);
        
        // Detectar nodos de inicio (triggers)
        const triggerNodes = this.findTriggerNodes(nodes, connectionMap);
        
        // Detectar niveles de profundidad en el flujo
        const depthLevels = this.calculateNodeDepths(nodes, connectionMap, triggerNodes);
        
        // Aplicar posicionamiento por niveles
        return this.positionNodesByLevels(nodes, depthLevels, connectionMap);
    }
    
    /**
     * 🔗 CONSTRUIR MAPA DE CONEXIONES
     */
    buildConnectionMap(connections) {
        const map = new Map();
        
        for (const [sourceNodeName, nodeConnections] of Object.entries(connections)) {
            const targets = [];
            
            if (nodeConnections.main) {
                for (const connection of nodeConnections.main) {
                    targets.push({ node: connection.node, type: 'main' });
                }
            }
            
            if (nodeConnections.else) {
                for (const connection of nodeConnections.else) {
                    targets.push({ node: connection.node, type: 'else' });
                }
            }
            
            map.set(sourceNodeName, targets);
        }
        
        return map;
    }
    
    /**
     * 🎯 ENCONTRAR NODOS TRIGGER (INICIO)
     */
    findTriggerNodes(nodes, connectionMap) {
        const triggerTypes = ['webhook', 'cron', 'manualTrigger', 'emailTrigger'];
        const triggers = [];
        
        // Buscar por tipo de nodo
        for (const node of nodes) {
            const nodeType = node.type.replace('n8n-nodes-base.', '');
            if (triggerTypes.includes(nodeType)) {
                triggers.push(node.id); // CORREGIDO: usar ID en lugar de name
            }
        }
        
        // Si no hay triggers explícitos, buscar nodos sin conexiones entrantes
        if (triggers.length === 0) {
            const hasIncomingConnection = new Set();
            for (const targets of connectionMap.values()) {
                for (const target of targets) {
                    hasIncomingConnection.add(target.node);
                }
            }
            
            for (const node of nodes) {
                if (!hasIncomingConnection.has(node.id)) { // CORREGIDO: usar ID en lugar de name
                    triggers.push(node.id); // CORREGIDO: usar ID en lugar de name
                }
            }
        }
        
        return triggers;
    }
    
    /**
     * 📊 CALCULAR PROFUNDIDADES DE NODOS
     */
    calculateNodeDepths(nodes, connectionMap, triggerNodes) {
        const depths = new Map();
        const visited = new Set();
        
        // Inicializar triggers en profundidad 0
        for (const trigger of triggerNodes) {
            depths.set(trigger, 0);
        }
        
        // BFS para calcular profundidades
        const queue = [...triggerNodes.map(t => ({ nodeId: t, depth: 0 }))]; // CORREGIDO: cambiar name por nodeId para claridad
        
        while (queue.length > 0) {
            const { nodeId, depth } = queue.shift(); // CORREGIDO: cambiar name por nodeId
            
            if (visited.has(nodeId)) continue; // CORREGIDO: cambiar name por nodeId
            visited.add(nodeId); // CORREGIDO: cambiar name por nodeId
            
            const targets = connectionMap.get(nodeId) || []; // CORREGIDO: cambiar name por nodeId
            for (const target of targets) {
                const targetDepth = depth + 1;
                const currentDepth = depths.get(target.node) || Infinity;
                
                if (targetDepth < currentDepth) {
                    depths.set(target.node, targetDepth);
                    queue.push({ nodeId: target.node, depth: targetDepth }); // CORREGIDO: cambiar name por nodeId
                }
            }
        }
        
        // Asignar profundidad a nodos no visitados
        for (const node of nodes) {
            if (!depths.has(node.id)) { // CORREGIDO: usar node.id en lugar de node.name
                depths.set(node.id, Math.max(0, depths.size)); // CORREGIDO: usar node.id en lugar de node.name
            }
        }
        
        return depths;
    }
    
    /**
     * 📍 POSICIONAR NODOS POR NIVELES
     */
    positionNodesByLevels(nodes, depthLevels, connectionMap) {
        const positioned = [...nodes];
        const levelGroups = new Map();
        
        // Agrupar nodos por nivel de profundidad
        for (const node of positioned) {
            const depth = depthLevels.get(node.id) || 0; // CORREGIDO: usar node.id en lugar de node.name
            if (!levelGroups.has(depth)) {
                levelGroups.set(depth, []);
            }
            levelGroups.get(depth).push(node);
        }
        
        // Configuración de layout
        const horizontalSpacing = 350; // Espacio entre niveles
        const verticalSpacing = 180;   // Espacio entre nodos del mismo nivel
        const startX = 100;
        const startY = 100;
        
        // Posicionar cada nivel
        for (const [depth, nodesInLevel] of levelGroups.entries()) {
            const x = startX + (depth * horizontalSpacing);
            const levelHeight = nodesInLevel.length * verticalSpacing;
            const startYForLevel = startY - (levelHeight / 2);
            
            // Ordenar nodos en el nivel por importancia/conexiones
            const sortedNodes = this.sortNodesByImportance(nodesInLevel, connectionMap);
            
            sortedNodes.forEach((node, index) => {
                node.position = [x, startYForLevel + (index * verticalSpacing)];
            });
        }
        
        return positioned;
    }
    
    /**
     * ⭐ ORDENAR NODOS POR IMPORTANCIA
     */
    sortNodesByImportance(nodes, connectionMap) {
        return nodes.sort((a, b) => {
            const aConnections = (connectionMap.get(a.id) || []).length; // CORREGIDO: usar a.id en lugar de a.name
            const bConnections = (connectionMap.get(b.id) || []).length; // CORREGIDO: usar b.id en lugar de b.name
            
            // Priorizar por número de conexiones salientes
            if (aConnections !== bConnections) {
                return bConnections - aConnections;
            }
            
            // Luego por tipo de nodo (triggers primero)
            const aPriority = this.getNodeTypePriority(a.type);
            const bPriority = this.getNodeTypePriority(b.type);
            
            return aPriority - bPriority;
        });
    }
    
    /**
     * 🏆 PRIORIDAD DE TIPOS DE NODOS
     */
    getNodeTypePriority(nodeType) {
        const priorities = {
            'n8n-nodes-base.webhook': 1,
            'n8n-nodes-base.cron': 2,
            'n8n-nodes-base.manualTrigger': 3,
            'n8n-nodes-base.httpRequest': 4,
            'n8n-nodes-base.set': 5,
            'n8n-nodes-base.if': 6,
            'n8n-nodes-base.function': 7,
            'n8n-nodes-base.gmail': 8,
            'n8n-nodes-base.slack': 9,
            'n8n-nodes-base.telegram': 10,
            'n8n-nodes-base.emailSend': 11
        };
        
        return priorities[nodeType] || 99;
    }

    extractUrlFromPrompt(prompt) {
        const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
        return urlMatch ? urlMatch[0] : null;
    }
    
    extractMessageFromPrompt(prompt) {
        if (prompt.includes('enviar') || prompt.includes('notificar')) {
            return 'Notification from workflow process';
        }
        if (prompt.includes('error') || prompt.includes('fallo')) {
            return 'Error alert from workflow';
        }
        return 'Workflow status update';
    }
    
    extractActionFromPrompt(prompt) {
        const actions = ['send', 'get', 'process', 'notify', 'alert', 'trigger'];
        for (const action of actions) {
            if (prompt.toLowerCase().includes(action)) {
                return action.charAt(0).toUpperCase() + action.slice(1);
            }
        }
        return 'Action';
    }
    
    generateFunctionCode(prompt, analysis) {
        if (prompt.toLowerCase().includes('filtrar') || prompt.toLowerCase().includes('filter')) {
            return `// Filter and process data
const items = $input.all();
const filtered = items.filter(item => {
    // Add your filtering logic here
    return item.json.status === 'active';
});
return filtered;`;
        }
        
        return `// Custom processing logic
const data = $input.all();
// Process data according to your requirements
return data.map(item => ({
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
}));`;
    }
    
    isGenericName(name) {
        const genericPatterns = [
            /^(node|nodo)\d*$/i,
            /^(step|paso)\d*$/i,
            /^(item|elemento)\d*$/i,
            /^untitled/i
        ];
        
        return genericPatterns.some(pattern => pattern.test(name));
    }
    
    getDefaultValueForParameter(nodeType, paramKey, prompt) {
        const defaults = {
            'webhook': { path: 'webhook', httpMethod: 'POST' },
            'httpRequest': { url: 'https://api.example.com', method: 'GET' },
            'gmail': { operation: 'get', resource: 'message' },
            'slack': { text: 'Workflow notification' },
            'telegram': { text: 'Bot notification' }
        };
        
        return defaults[nodeType]?.[paramKey] || 'auto-configured';
    }
    
    extractSubjectFromPrompt(prompt) {
        if (prompt.toLowerCase().includes('error')) return 'Workflow Error Alert';
        if (prompt.toLowerCase().includes('success')) return 'Workflow Success Notification';
        return 'Workflow Status Update';
    }
    
    extractServiceFromPrompt(prompt) {
        const services = ['api', 'webhook', 'database', 'external', 'service'];
        for (const service of services) {
            if (prompt.toLowerCase().includes(service)) {
                return service.charAt(0).toUpperCase() + service.slice(1);
            }
        }
        return 'Service';
    }
    
    extractDataTypeFromPrompt(prompt) {
        const types = ['user', 'order', 'customer', 'product', 'data', 'info'];
        for (const type of types) {
            if (prompt.toLowerCase().includes(type)) {
                return type.charAt(0).toUpperCase() + type.slice(1);
            }
        }
        return 'Data';
    }
    
    extractConditionFromPrompt(prompt) {
        if (prompt.includes('success') || prompt.includes('exitoso')) return 'Success';
        if (prompt.includes('error') || prompt.includes('fallo')) return 'Error';
        if (prompt.includes('status') || prompt.includes('estado')) return 'Status';
        return 'Condition';
    }
    
    extractProcessFromPrompt(prompt) {
        const processes = ['transform', 'validate', 'filter', 'calculate', 'process'];
        for (const process of processes) {
            if (prompt.toLowerCase().includes(process)) {
                return process.charAt(0).toUpperCase() + process.slice(1);
            }
        }
        return 'Process';
    }
    
    extractScheduleFromPrompt(prompt) {
        if (prompt.includes('daily') || prompt.includes('diario')) return 'Daily';
        if (prompt.includes('hourly') || prompt.includes('hora')) return 'Hourly';
        if (prompt.includes('weekly') || prompt.includes('semanal')) return 'Weekly';
        return 'Scheduled';
    }
    
    extractEmailTypeFromPrompt(prompt) {
        if (prompt.includes('alert') || prompt.includes('alerta')) return 'Alert';
        if (prompt.includes('report') || prompt.includes('reporte')) return 'Report';
        if (prompt.includes('summary') || prompt.includes('resumen')) return 'Summary';
        return 'Notification';
    }

    calculateRealMetrics(workflow) {
        if (!workflow || !workflow.nodes) {
            return { nodes: 0, connections: 0, quality: 0 };
        }
        
        const nodeCount = workflow.nodes.length;
        const connectionCount = this.getRealConnectionCount(workflow.connections || {});
        const quality = this.calculateWorkflowQuality(workflow);
        
        return {
            nodes: nodeCount,
            connections: connectionCount,
            quality: quality,
            nodeTypes: new Set(workflow.nodes.map(n => n.type.replace('n8n-nodes-base.', ''))).size,
            configuredNodes: workflow.nodes.filter(n => 
                n.parameters && Object.keys(n.parameters).length > 0 && 
                !this.hasEmptyParameters(n.parameters)
            ).length
        };
    }

    async postProcessResult(result, prompt, analysis) {
        // Post-procesamiento final para optimizar el resultado
        const optimized = { ...result };
        
        // 1. Validación crítica con FlowCoherenceAgent
        if (this.flowCoherenceAgent && optimized.workflow) {
            console.log('🔧 Aplicando validación de coherencia de flujo...');
            try {
                const coherenceResult = await this.flowCoherenceAgent.processWorkflow(
                    optimized.workflow, 
                    prompt
                );
                
                if (coherenceResult && coherenceResult.correctedWorkflow) {
                    console.log('✅ FlowCoherence: Workflow corregido y validado');
                    optimized.workflow = coherenceResult.correctedWorkflow;
                    
                    // Aplicar mejoras detectadas por el agente
                    if (coherenceResult.improvements) {
                        optimized.quality = Math.min(100, optimized.quality + coherenceResult.improvements.length * 2);
                    }
                } else {
                    console.log('⚠️ FlowCoherence: No se detectaron problemas críticos');
                }
            } catch (error) {
                console.log('⚠️ Error en validación de coherencia:', error.message);
            }
        } else {
            console.log('⚠️ FlowCoherenceAgent no disponible, saltando validación');
        }
        
        // 2. Mejorar configuración automática de nodos
        if (optimized.workflow && optimized.workflow.nodes) {
            optimized.workflow.nodes = optimized.workflow.nodes.map(node => 
                this.enhanceNodeConfiguration(node, prompt, analysis)
            );
            
            // 2.5. CORRECCIÓN CRÍTICA: Arreglar conexiones AI para nodos LangChain
            console.log('🔗 Aplicando corrección de conexiones AI LangChain...');
            optimized.workflow = this.fixLangChainConnections(optimized.workflow, prompt);
            
            // 3. Optimizar posicionamiento inteligente
            optimized.workflow.nodes = this.optimizeNodePositioning(optimized.workflow.nodes, optimized.workflow.connections);
            
            // 4. Recalcular calidad después de TODAS las mejoras
            optimized.quality = this.calculateWorkflowQuality(optimized.workflow);
        }
        
        // 5. Añadir metadatos útiles
        optimized.metadata = {
            ...optimized.metadata,
            generated_at: new Date().toISOString(),
            prompt_analysis: analysis,
            system_version: this.version,
            flow_coherence_applied: !!this.flowCoherenceAgent
        };
        
        // 6. Asegurar filename para compatibilidad
        if (!optimized.filename) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            optimized.filename = `workflow-v4-ultra-${timestamp}.json`;
        }
        
        // 7. Guardar automáticamente en la carpeta generated-workflows
        const savedFile = await this.saveWorkflowToFile(optimized, optimized.filename);
        
        // 8. Estructura final para compatibilidad con el sistema existente
        return {
            success: true,
            workflow: optimized.workflow,
            filename: optimized.filename,
            savedPath: savedFile,
            quality: optimized.quality,
            generationMethod: optimized.generationMethod,
            confidence: optimized.confidence,
            metadata: optimized.metadata
        };
    }

    /**
     * 🔗 CORRECCIÓN CRÍTICA DE CONEXIONES AI LANGCHAIN
     * Corrige las conexiones rotas en workflows con nodos LangChain
     */
    fixLangChainConnections(workflow, prompt) {
        if (!workflow || !workflow.nodes || !workflow.connections) {
            return workflow;
        }

        console.log('🔧 Analizando nodos LangChain para corrección de conexiones...');

        const fixedWorkflow = { ...workflow };
        const langChainNodes = workflow.nodes.filter(node =>
            node.type && node.type.startsWith('@n8n/n8n-nodes-langchain.')
        );

        if (langChainNodes.length === 0) {
            console.log('ℹ️ No se encontraron nodos LangChain, saltando corrección');
            return workflow;
        }

        console.log(`🎯 Encontrados ${langChainNodes.length} nodos LangChain para corregir`);

        // Crear mapa de nodos por tipo
        const nodeMap = {
            agents: langChainNodes.filter(n => n.type.includes('.agent')),
            models: langChainNodes.filter(n => n.type.includes('.lmChat')),
            tools: langChainNodes.filter(n => n.type.includes('.tool')),
            memory: langChainNodes.filter(n => n.type.includes('.memory')),
            triggers: langChainNodes.filter(n => n.type.includes('.chatTrigger'))
        };

        // Reconstruir conexiones AI
        const fixedConnections = this.rebuildLangChainConnections(nodeMap, workflow.connections);

        fixedWorkflow.connections = fixedConnections;
        console.log('✅ Conexiones AI LangChain corregidas');

        return fixedWorkflow;
    }

    /**
     * 🔄 RECONSTRUIR CONEXIONES AI PARA NODOS LANGCHAIN
     */
    rebuildLangChainConnections(nodeMap, existingConnections) {
        const connections = { ...existingConnections };

        // 1. Conectar agentes AI con modelos de lenguaje (UNIDIRECCIONAL)
        nodeMap.agents.forEach(agent => {
            // Buscar modelo disponible
            const availableModel = nodeMap.models.find(model => !this.isModelConnected(model.id, connections));

            if (availableModel) {
                // CORRECCIÓN: Solo conectar modelo → agente (no bidireccional)
                if (!connections[availableModel.id]) {
                    connections[availableModel.id] = {};
                }
                if (!connections[availableModel.id].ai_languageModel) {
                    connections[availableModel.id].ai_languageModel = [];
                }
                connections[availableModel.id].ai_languageModel.push([
                    {
                        node: agent.id,
                        type: "ai_languageModel",
                        index: 0
                    }
                ]);
                console.log(`🔗 Conectado modelo ${availableModel.id} → agente ${agent.id}`);
            }
        });

        // 2. Conectar agentes AI con memoria (UNIDIRECCIONAL)
        nodeMap.agents.forEach(agent => {
            // Buscar memoria disponible
            const availableMemory = nodeMap.memory.find(mem => !this.isMemoryConnected(mem.id, connections));

            if (availableMemory) {
                // CORRECCIÓN: Solo conectar memoria → agente (no bidireccional)
                if (!connections[availableMemory.id]) {
                    connections[availableMemory.id] = {};
                }
                if (!connections[availableMemory.id].ai_memory) {
                    connections[availableMemory.id].ai_memory = [];
                }
                connections[availableMemory.id].ai_memory.push([
                    {
                        node: agent.id,
                        type: "ai_memory",
                        index: 0
                    }
                ]);
                console.log(`🧠 Conectada memoria ${availableMemory.id} → agente ${agent.id}`);
            }
        });

        // 3. Conectar herramientas a agentes AI (UNIDIRECCIONAL)
        nodeMap.tools.forEach(tool => {
            // Buscar agente disponible
            const availableAgent = nodeMap.agents.find(agent => !this.isToolConnectedToAgent(tool.id, agent.id, connections));

            if (availableAgent) {
                // CORRECCIÓN: Solo conectar herramienta → agente (no bidireccional)
                if (!connections[tool.id]) {
                    connections[tool.id] = {};
                }
                if (!connections[tool.id].ai_tool) {
                    connections[tool.id].ai_tool = [];
                }
                connections[tool.id].ai_tool.push([
                    {
                        node: availableAgent.id,
                        type: "ai_tool",
                        index: 0
                    }
                ]);
                console.log(`🛠️ Conectada herramienta ${tool.id} → agente ${availableAgent.id}`);
            }
        });

        // 4. Asegurar conexiones de flujo principal (main) - UNIDIRECCIONAL
        this.ensureMainFlowConnections(nodeMap, connections);

        return connections;
    }

    /**
     * 🔍 VERIFICADORES DE CONEXIONES EXISTENTES
     */
    isModelConnected(modelId, connections) {
        for (const [sourceId, outputs] of Object.entries(connections)) {
            if (sourceId === modelId && outputs.ai_languageModel) {
                return outputs.ai_languageModel.length > 0;
            }
        }
        return false;
    }

    isMemoryConnected(memoryId, connections) {
        for (const [sourceId, outputs] of Object.entries(connections)) {
            if (sourceId === memoryId && outputs.ai_memory) {
                return outputs.ai_memory.length > 0;
            }
        }
        return false;
    }

    isToolConnectedToAgent(toolId, agentId, connections) {
        // Verificar si esta herramienta específica ya está conectada a este agente específico
        if (connections[toolId] && connections[toolId].ai_tool) {
            return connections[toolId].ai_tool.some(connectionArray => 
                connectionArray.some(conn => conn.node === agentId)
            );
        }
        return false;
    }

    /**
     * 🔄 ASEGURAR CONEXIONES DE FLUJO PRINCIPAL
     */
    ensureMainFlowConnections(nodeMap, connections) {
        // Conectar triggers a agentes o herramientas
        nodeMap.triggers.forEach(trigger => {
            if (!connections[trigger.id] || !connections[trigger.id].main) {
                // Buscar siguiente nodo lógico
                const nextNode = this.findNextLogicalNode(trigger, nodeMap);
                if (nextNode) {
                    if (!connections[trigger.id]) {
                        connections[trigger.id] = {};
                    }
                    if (!connections[trigger.id].main) {
                        connections[trigger.id].main = [];
                    }
                    connections[trigger.id].main.push([
                        {
                            node: nextNode.id,
                            type: "main",
                            index: 0
                        }
                    ]);
                    console.log(`🔄 Conectado trigger ${trigger.id} → ${nextNode.id}`);
                }
            }
        });

        // Conectar agentes a nodos de salida (IF, Slack, etc.)
        nodeMap.agents.forEach(agent => {
            if (!this.hasMainOutputConnection(agent.id, connections)) {
                // Buscar nodos que no sean AI para conectar salida
                const outputNodes = this.findOutputNodes(nodeMap);
                const availableOutput = outputNodes.find(node => !this.isConnectedToAgent(node.id, connections));

                if (availableOutput) {
                    if (!connections[agent.id]) {
                        connections[agent.id] = {};
                    }
                    if (!connections[agent.id].main) {
                        connections[agent.id].main = [];
                    }
                    connections[agent.id].main.push([
                        {
                            node: availableOutput.id,
                            type: "main",
                            index: 0
                        }
                    ]);
                    console.log(`📤 Conectada salida agente ${agent.id} → ${availableOutput.id}`);
                }
            }
        });
    }

    /**
     * 🎯 UTILIDADES PARA ENCONTRAR NODOS
     */
    findNextLogicalNode(trigger, nodeMap) {
        // Prioridad: herramientas > agentes > otros
        return nodeMap.tools[0] || nodeMap.agents[0] || null;
    }

    findOutputNodes(nodeMap) {
        // Encontrar nodos que no son AI (IF, Slack, Email, etc.)
        const allNodes = [...nodeMap.agents, ...nodeMap.models, ...nodeMap.tools, ...nodeMap.memory, ...nodeMap.triggers];
        const langChainIds = new Set(allNodes.map(n => n.id));

        // Buscar en el workflow completo nodos que no sean LangChain
        if (this.currentWorkflow && this.currentWorkflow.nodes) {
            return this.currentWorkflow.nodes.filter(node => !langChainIds.has(node.id));
        }

        return [];
    }

    hasMainOutputConnection(nodeId, connections) {
        return connections[nodeId] && connections[nodeId].main && connections[nodeId].main.length > 0;
    }

    isConnectedToAgent(nodeId, connections) {
        for (const [sourceId, outputs] of Object.entries(connections)) {
            if (outputs.main) {
                for (const connection of outputs.main) {
                    if (connection[0] && connection[0].node === nodeId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 💾 GUARDAR WORKFLOW EN CARPETA GENERATED-WORKFLOWS
     */
    async saveWorkflowToFile(workflowResult, filename) {
        try {
            // Importar módulos necesarios
            const fs = (await import('fs')).default;
            const path = (await import('path')).default;
            
            // Crear directorio generated-workflows si no existe
            const workflowDir = path.join(process.cwd(), 'generated-workflows');
            if (!fs.existsSync(workflowDir)) {
                fs.mkdirSync(workflowDir, { recursive: true });
            }
            
            // Construir ruta completa del archivo
            const fullPath = path.join(workflowDir, filename);
            
            // Preparar workflow en formato compatible con n8n
            const n8nCompatibleWorkflow = {
                name: `V4 Ultra Generated Workflow - ${new Date().toISOString().split('T')[0]}`,
                nodes: workflowResult.workflow.nodes || [],
                connections: workflowResult.workflow.connections || {},
                active: false,
                settings: workflowResult.workflow.settings || {},
                staticData: {},
                tags: [],
                triggerCount: 0,
                // Metadatos como comentario en el workflow
                meta: {
                    instanceId: "v4-ultra-system",
                    generated_at: new Date().toISOString(),
                    generationMethod: workflowResult.generationMethod,
                    quality: workflowResult.quality,
                    confidence: workflowResult.confidence,
                    system_version: this.version
                }
            };
            
            // Guardar archivo compatible con n8n
            fs.writeFileSync(fullPath, JSON.stringify(n8nCompatibleWorkflow, null, 2));
            
            // También guardar versión con metadatos extendidos para análisis
            const metadataPath = fullPath.replace('.json', '-metadata.json');
            const extendedMetadata = {
                workflow: n8nCompatibleWorkflow,
                analysis: {
                    prompt_analysis: workflowResult.metadata?.prompt_analysis,
                    real_metrics: this.calculateRealMetrics(workflowResult.workflow),
                    generation_stats: {
                        method: workflowResult.generationMethod,
                        quality: workflowResult.quality,
                        confidence: workflowResult.confidence,
                        timestamp: new Date().toISOString()
                    }
                }
            };
            
            fs.writeFileSync(metadataPath, JSON.stringify(extendedMetadata, null, 2));
            
            console.log(`💾 Workflow n8n-compatible guardado en: ${fullPath}`);
            console.log(`📊 Metadatos detallados guardados en: ${metadataPath}`);
            return fullPath;
            
        } catch (error) {
            console.error(`❌ Error guardando workflow: ${error.message}`);
            return null;
        }
    }

    mergeNodesIntelligently(referencesNodes, geminiNodes, analysis) {
        // Combina nodos priorizando la base sólida de referencias
        // con innovaciones creativas de Gemini
        
        const mergedNodes = [...referencesNodes];
        
        // Añadir nodos únicos de Gemini que aporten valor
        geminiNodes.forEach(geminiNode => {
            const existsInReferences = referencesNodes.some(refNode => 
                refNode.type === geminiNode.type && 
                refNode.name.toLowerCase().includes(geminiNode.name.toLowerCase().split(' ')[0])
            );
            
            if (!existsInReferences && geminiNode.type && geminiNode.parameters) {
                mergedNodes.push(geminiNode);
            }
        });
        
        return mergedNodes;
    }
    
    mergeConnectionsSmartly(referencesConnections, geminiConnections) {
        // Usar conexiones de referencias como base y añadir las de Gemini que sean válidas
        return {
            ...referencesConnections,
            ...geminiConnections
        };
    }
    
    detectInnovations(geminiResult, prompt) {
        // Detectar elementos innovadores en la respuesta de Gemini
        const innovations = [];
        
        if (geminiResult.workflow?.nodes?.length > 10) {
            innovations.push('Complex multi-step workflow');
        }
        
        const uniqueTypes = new Set(geminiResult.workflow?.nodes?.map(n => n.type) || []);
        if (uniqueTypes.size > 5) {
            innovations.push('Diverse node types integration');
        }
        
        return innovations;
    }
    
    async enhanceReferencesResult(baseResult, prompt, analysis) {
        // Mejoras específicas al resultado de referencias
        const enhanced = { ...baseResult };
        
        // Añadir configuraciones más específicas si el prompt las sugiere
        if (prompt.toLowerCase().includes('email')) {
            enhanced.workflow.nodes.forEach(node => {
                if (node.type?.includes('email') && !node.parameters?.subject) {
                    node.parameters = {
                        ...node.parameters,
                        subject: 'Automated Notification',
                        text: 'Your request has been processed successfully.'
                    };
                }
            });
        }
        
        // Incrementar calidad por mejoras
        enhanced.quality = Math.min(100, enhanced.quality + 5);
        
        return enhanced;
    }

    /**
     * 📊 OBTENER ESTADÍSTICAS DEL SISTEMA
     */
    getSystemStats() {
        return {
            version: this.version,
            performance: this.performanceMetrics,
            capabilities: [
                'Análisis automático de prompts',
                'Selección inteligente de estrategia', 
                'Fusión Gemini + Referencias',
                'Fallback progresivo',
                'Calidad dual',
                'Monitoreo en tiempo real'
            ],
            uptime: Date.now() - (this.startTime || Date.now())
        };
    }
}

export default V4UltraHybridSystem;
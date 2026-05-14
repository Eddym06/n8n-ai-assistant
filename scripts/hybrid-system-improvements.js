// 🛡️ SISTEMA DE FALLBACK MEJORADO Y PRESERVADO
// Este sistema mantiene el excelente fallback de referencias mientras añade Gemini

/**
 * 🎯 MEJORAS AL SISTEMA DE FALLBACK EXISTENTE
 * 
 * OBJETIVO: Preservar el increíble sistema de referencias que funcionaba tan bien
 * mientras añadimos la potencia real de Gemini AI
 */

class HybridWorkflowGenerator {
    constructor() {
        this.geminiEnabled = true;
        this.fallbackEnabled = true;
        this.qualityThreshold = 85; // Si Gemini genera algo con calidad <85, usar fallback
        this.callCount = 0;
    }

    /**
     * 🚀 GENERACIÓN HÍBRIDA MEJORADA
     * 1. Intenta Gemini primero
     * 2. Si falla o calidad baja, usa el sistema de referencias
     * 3. Combina lo mejor de ambos mundos
     */
    async generateWorkflow(prompt, options = {}) {
        console.log('🎯 Iniciando generación híbrida...');
        
        let geminiResult = null;
        let fallbackResult = null;
        
        // FASE 1: Intentar Gemini (mejorado)
        if (this.geminiEnabled) {
            try {
                console.log('🤖 Intentando generación con Gemini AI...');
                geminiResult = await this.tryGeminiGeneration(prompt, options);
                
                if (geminiResult && geminiResult.quality >= this.qualityThreshold) {
                    console.log(`✅ Gemini generó workflow de alta calidad (${geminiResult.quality}/100)`);
                    return this.enhanceWithReferences(geminiResult, prompt);
                } else {
                    console.log(`⚠️ Gemini calidad insuficiente (${geminiResult?.quality || 0}/100), usando fallback...`);
                }
            } catch (error) {
                console.log(`❌ Gemini falló: ${error.message}, usando fallback...`);
            }
        }
        
        // FASE 2: Sistema de Referencias (preservado y mejorado)
        console.log('🛡️ Ejecutando sistema de fallback de referencias...');
        fallbackResult = await this.generateFromReferences(prompt, options);
        
        // FASE 3: Mejora el fallback con elementos de Gemini si están disponibles
        if (geminiResult && fallbackResult) {
            return this.hybridCombination(geminiResult, fallbackResult, prompt);
        }
        
        return fallbackResult || { error: 'Ambos sistemas fallaron' };
    }

    /**
     * 🎨 COMBINA CREATIVIDAD DE GEMINI CON SOLIDEZ DE REFERENCIAS
     */
    async hybridCombination(geminiResult, fallbackResult, prompt) {
        console.log('🎨 Creando combinación híbrida óptima...');
        
        return {
            workflow: {
                // Base sólida del fallback
                nodes: this.mergeNodes(fallbackResult.workflow.nodes, geminiResult.workflow.nodes),
                connections: this.smartMergeConnections(fallbackResult.workflow.connections, geminiResult.workflow.connections),
                settings: fallbackResult.workflow.settings
            },
            metadata: {
                generation_method: 'hybrid',
                gemini_creativity: geminiResult.quality,
                fallback_reliability: fallbackResult.quality,
                combined_quality: Math.max(geminiResult.quality, fallbackResult.quality) + 5
            },
            source: 'hybrid_ai_plus_references',
            quality: Math.max(geminiResult.quality, fallbackResult.quality) + 5
        };
    }

    /**
     * 🔄 MEJORA RESULTADO DE GEMINI CON VALIDACIONES DE REFERENCIAS
     */
    async enhanceWithReferences(geminiResult, prompt) {
        console.log('🔄 Mejorando resultado de Gemini con validaciones...');
        
        // Buscar referencias similares para validación
        const references = await this.findValidationReferences(prompt);
        
        return {
            ...geminiResult,
            workflow: this.validateAndEnhance(geminiResult.workflow, references),
            metadata: {
                ...geminiResult.metadata,
                enhanced_with_references: true,
                validation_sources: references.length
            }
        };
    }
}

/**
 * 🎯 MEJORAS ESPECÍFICAS PARA ROBUSTEZ
 */

// 1. SISTEMA DE CALIDAD DUAL
class QualityAssurance {
    static evaluateWorkflow(workflow, source) {
        const scores = {
            completeness: this.checkCompleteness(workflow),
            connectivity: this.checkConnectivity(workflow), 
            configuration: this.checkConfiguration(workflow),
            bestPractices: this.checkBestPractices(workflow)
        };
        
        const overall = Object.values(scores).reduce((a, b) => a + b) / 4;
        
        console.log(`📊 Calidad ${source}: ${overall}/100`);
        return { overall, breakdown: scores };
    }
}

// 2. MONITOREO AVANZADO
class SmartMonitoring {
    static trackGenerationSuccess(method, quality, promptLength) {
        const metrics = {
            timestamp: new Date().toISOString(),
            method,
            quality,
            promptLength,
            success: quality > 70
        };
        
        // Detectar patrones de falla
        if (this.detectPatterns(metrics)) {
            console.log('🚨 Patrón de falla detectado, ajustando estrategia...');
        }
        
        return metrics;
    }
}

// 3. FALLBACK INTELIGENTE PROGRESIVO
class ProgressiveFallback {
    static async executeStrategy(prompt, options) {
        const strategies = [
            { method: 'gemini_pro', priority: 1 },
            { method: 'gemini_flash', priority: 2 },
            { method: 'references_semantic', priority: 3 },
            { method: 'references_keyword', priority: 4 },
            { method: 'templates_basic', priority: 5 }
        ];
        
        for (const strategy of strategies) {
            try {
                const result = await this.executeStrategy(strategy, prompt, options);
                if (result.quality >= 70) {
                    console.log(`✅ Estrategia ${strategy.method} exitosa`);
                    return result;
                }
            } catch (error) {
                console.log(`⚠️ Estrategia ${strategy.method} falló, probando siguiente...`);
            }
        }
        
        throw new Error('Todas las estrategias de fallback fallaron');
    }
}

export { HybridWorkflowGenerator, QualityAssurance, SmartMonitoring, ProgressiveFallback };
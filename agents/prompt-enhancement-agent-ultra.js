/**
 * Prompt Enhancement Agent ULTRA - Fusión de Optimized y V4
 * 
 * Un sistema híbrido que combina la velocidad del análisis local (Optimized)
 * con la potencia de la deconstrucción lógica y el mapeo de nodos (V4).
 * 
 * CARACTERÍSTICAS ULTRA:
 * 1.  **Análisis de Complejidad Rápido (de Optimized)**: Un primer filtro eficiente 
 *     y sin costo para evaluar el nivel del prompt.
 * 2.  **Estrategia de Mejora Adaptativa**:
 *     - Para prompts claros (Intermedio/Experto): Usa mejoras directas y rápidas 
 *       sin IA.
 *     - Para prompts vagos (Novato): Activa el motor de deconstrucción lógica de la V4,
 *       usando IA para una transformación profunda.
 * 3.  **Integración Total con Gemini Model Router**: Todas las llamadas a la IA son
 *     gestionadas por el router, asegurando eficiencia y resiliencia.
 * 4.  **Deconstrucción Lógica bajo demanda**: La potente pero costosa deconstrucción
 *     lógica solo se usa cuando es estrictamente necesario.
 */

import GeminiModelRouter from './gemini-model-router.js';

class PromptEnhancementAgentUltra {
    constructor() {
        this.version = "5.0-ultra-hybrid";
        this.geminiRouter = new GeminiModelRouter();
        this.initializeAnalyzers();
        console.log(`🚀 Prompt Enhancement Agent ULTRA v${this.version} inicializado`);
    }

    initializeAnalyzers() {
        // De la versión Optimized
        this.promptComplexityAnalyzer = {
            vagueIndicators: { general: ['hacer', 'crear'], nonspecific: ['algo', 'proceso'] },
            intermediateIndicators: { technical: ['webhook', 'api', 'json'] },
            expertIndicators: { advanced: ['n8n-nodes-base', 'expression'] }
        };
        // De la versión V4
        this.logicalDeconstructor = {
            patterns: { input: ['recibir', 'obtener'], process: ['procesar', 'transformar'], decision: ['si', 'cuando'], action: ['enviar', 'guardar'], output: ['notificar', 'responder'] },
            nodeMapping: { input: ['webhook'], process: ['function', 'set'], decision: ['if', 'switch'], action: ['httpRequest', 'gmail'], output: ['gmail'] }
        };
    }

    /**
     * 🚀 MÉTODO PRINCIPAL HÍBRIDO
     */
    async enhancePrompt(prompt) {
        console.log('🚀 PEA ULTRA: Iniciando mejora de prompt híbrida...');
        
        // 1. ANÁLISIS DE COMPLEJIDAD RÁPIDO (de Optimized)
        const complexity = this.analyzePromptComplexity(prompt);
        console.log(`📊 Nivel detectado: ${complexity.userLevel}, Mejora necesaria: ${complexity.enhancementNeeded}`);

        // 2. SELECCIÓN DE ESTRATEGIA ADAPTATIVA
        if (complexity.enhancementNeeded === 'FULL') {
            console.log('🧠 Estrategia: Deconstrucción Lógica (V4) para prompt vago.');
            return this.performLogicalDeconstruction(prompt, complexity);
        } else {
            console.log('⚡️ Estrategia: Mejora Directa (Optimized) para prompt claro.');
            return this.performDirectEnhancement(prompt, complexity);
        }
    }

    /**
     * Análisis de complejidad (de Optimized)
     */
    analyzePromptComplexity(prompt) {
        const lowerPrompt = String(prompt).toLowerCase();
        let scores = { vague: 0, intermediate: 0, expert: 0 };

        Object.values(this.promptComplexityAnalyzer.vagueIndicators).flat().forEach(ind => { if (lowerPrompt.includes(ind)) scores.vague += 0.1; });
        Object.values(this.promptComplexityAnalyzer.intermediateIndicators).flat().forEach(ind => { if (lowerPrompt.includes(ind)) scores.intermediate += 0.2; });
        Object.values(this.promptComplexityAnalyzer.expertIndicators).flat().forEach(ind => { if (lowerPrompt.includes(ind)) scores.expert += 0.3; });

        if (scores.expert > 0.3) return { userLevel: 'EXPERT', enhancementNeeded: 'MINIMAL', scores };
        if (scores.intermediate > 0.2) return { userLevel: 'INTERMEDIATE', enhancementNeeded: 'MODERATE', scores };
        return { userLevel: 'NOVICE', enhancementNeeded: 'FULL', scores };
    }

    /**
     * =============================================
     * ESTRATEGIA 1: MEJORA DIRECTA (de Optimized)
     * =============================================
     */
    performDirectEnhancement(prompt, complexity) {
        let enhancedPrompt = prompt;
        if (complexity.enhancementNeeded === 'MODERATE') {
            enhancedPrompt = this.enhanceSpecificityDirect(prompt);
        }
        return {
            originalPrompt: prompt,
            enhancedPrompt,
            complexity,
            processingApplied: 'DIRECT_ENHANCEMENT',
            success: true
        };
    }

    enhanceSpecificityDirect(prompt) {
        let enhanced = prompt;
        if (prompt.toLowerCase().includes('webhook') && !prompt.includes('payload')) {
            enhanced += ' (Configurar método HTTP y validación de payload)';
        }
        if (prompt.toLowerCase().includes('api') && !prompt.includes('autenticación')) {
            enhanced += ' (Incluir autenticación y manejo de errores)';
        }
        return enhanced;
    }

    /**
     * =============================================
     * ESTRATEGIA 2: DECONSTRUCCIÓN LÓGICA (de V4)
     * =============================================
     */
    async performLogicalDeconstruction(prompt, complexity) {
        console.log('🤖 Deconstruyendo lógicamente el prompt con IA...');
        const deconstructionPrompt = this.buildDeconstructionPrompt(prompt);

        try {
            const response = await this.geminiRouter.generateContent(
                deconstructionPrompt,
                'prompt-enhancement' // Agente para el router
            );

            const parsedResponse = this.parseAIResponse(response.content);

            return {
                originalPrompt: prompt,
                enhancedPrompt: parsedResponse.promptMejorado || prompt,
                deconstruction: parsedResponse.deconstruccionLogica || [],
                complexity,
                processingApplied: 'LOGICAL_DECONSTRUCTION',
                success: true
            };
        } catch (error) {
            console.error('❌ Error en deconstrucción lógica con IA:', error);
            return {
                originalPrompt: prompt,
                enhancedPrompt: this.enhanceSpecificityDirect(prompt), // Fallback a mejora directa
                error: error.message,
                success: false
            };
        }
    }

    buildDeconstructionPrompt(userPrompt) {
        return `
Eres un experto en N8N. Deconstruye el siguiente prompt de usuario en un plan lógico y mejóralo.

PROMPT: "${userPrompt}"

TAREA:
1.  **Mejora el Prompt**: Reescríbelo para que sea claro, técnico y sin ambigüedades.
2.  **Deconstrucción Lógica**: Divídelo en una secuencia de pasos numerados.

RESPONDE SOLO EN FORMATO JSON:
{
  "promptMejorado": "El prompt mejorado aquí.",
  "deconstruccionLogica": [
    "1. Primer paso lógico.",
    "2. Segundo paso lógico.",
    "3. Tercer paso lógico."
  ]
}`;
    }

    parseAIResponse(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return {};
        } catch (e) {
            console.error('Error parseando respuesta JSON de IA:', e);
            return {};
        }
    }
}

export default PromptEnhancementAgentUltra;

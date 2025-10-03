/**
 * PROMPT CONTEXTUAL INJECTOR V4 ULTRA
 * ====================================
 * 
 * Sistema base para inyectar contexto enriquecido en Gemini
 * - Reemplaza uso directo de semantic-memory-agent
 * - Genera prompt mejorado con plan DAG integrado
 * - Inyecta metadatos avanzados para workflows profesionales
 * - Base para el sistema V4 Ultra completo
 */

class PromptContextualInjectorV4 {
    constructor() {
        this.version = "4.0.0-ultra";
        this.systemMetadata = {
            engineType: "V4-Ultra-Engine",
            contextEnhancement: true,
            dagPlanIntegration: true,
            metadataInjection: true
        };
        
        // Configuración de contexto profesional
        this.professionalContext = {
            workflowStandards: {
                minNodes: 8,
                maxNodes: 25,
                optimalConnections: "nodes - 1 to nodes + 3",
                layoutType: "hierarchical-professional"
            },
            qualityMetrics: {
                targetScore: 95,
                minAcceptable: 90,
                layoutConsistency: 0.95,
                namingConsistency: 0.98
            }
        };
        
        // Patrones de contexto DAG
        this.dagPatterns = {
            sequential: "linear flow with conditional branches",
            parallel: "concurrent processing with synchronization",
            conditional: "decision trees with multiple outcomes",
            iterative: "loops with convergence criteria"
        };
    }

    /**
     * Genera contexto enriquecido para Gemini
     */
    generateEnhancedContext(userPrompt, workflowType = "automation") {
        try {
            const contextualPrompt = this.buildContextualPrompt(userPrompt, workflowType);
            const dagPlan = this.generateDAGPlan(userPrompt, workflowType);
            const metadataContext = this.buildMetadataContext(workflowType);
            
            return {
                success: true,
                enhancedPrompt: contextualPrompt,
                dagPlan: dagPlan,
                metadata: metadataContext,
                injectionStrategy: "v4-ultra-context",
                qualityExpectation: this.professionalContext.qualityMetrics.targetScore
            };
        } catch (error) {
            console.error("Error en PromptContextualInjector:", error);
            return {
                success: false,
                error: error.message,
                fallback: this.generateBasicContext(userPrompt)
            };
        }
    }

    /**
     * Construye prompt contextual mejorado
     */
    buildContextualPrompt(userPrompt, workflowType) {
        const baseContext = this.getBaseContext(workflowType);
        const technicalSpecs = this.getTechnicalSpecifications();
        const qualityDirectives = this.getQualityDirectives();
        
        return `
${baseContext}

SOLICITUD DEL USUARIO:
${userPrompt}

${technicalSpecs}

${qualityDirectives}

EXPECTATIVAS DE CALIDAD V4 ULTRA:
- Puntuación objetivo: ${this.professionalContext.qualityMetrics.targetScore}/100
- Layout profesional con posicionamiento matemático preciso
- Nombres inteligentes y consistentes para todos los nodos
- Conexiones optimizadas siguiendo principios de flujo de datos
- Metadatos completos y estructurados profesionalmente
        `.trim();
    }

    /**
     * Genera plan DAG integrado
     */
    generateDAGPlan(userPrompt, workflowType) {
        const promptAnalysis = this.analyzePromptStructure(userPrompt);
        const flowPattern = this.determineFlowPattern(promptAnalysis);
        
        return {
            patternType: flowPattern,
            nodeEstimation: this.estimateNodeCount(promptAnalysis),
            connectionStrategy: this.planConnectionStrategy(flowPattern),
            layoutHints: this.generateLayoutHints(flowPattern),
            executionFlow: this.planExecutionFlow(promptAnalysis)
        };
    }

    /**
     * Construye contexto de metadatos
     */
    buildMetadataContext(workflowType) {
        return {
            engineVersion: this.version,
            workflowType: workflowType,
            enhancementLevel: "ultra",
            expectedQuality: this.professionalContext.qualityMetrics.targetScore,
            layoutStandard: this.professionalContext.workflowStandards.layoutType,
            processingInstructions: {
                useIntelligentNaming: true,
                applyProfessionalLayout: true,
                optimizeConnections: true,
                validateConsistency: true
            }
        };
    }

    /**
     * Analiza estructura del prompt
     */
    analyzePromptStructure(prompt) {
        const actionWords = this.extractActionWords(prompt);
        const dataFlow = this.identifyDataFlow(prompt);
        const complexity = this.assessComplexity(prompt);
        
        return {
            actions: actionWords,
            dataFlow: dataFlow,
            complexity: complexity,
            estimatedSteps: Math.max(6, actionWords.length * 1.5)
        };
    }

    /**
     * Extrae palabras de acción del prompt
     */
    extractActionWords(prompt) {
        const actionPatterns = [
            /\b(crear|create|generar|generate|procesar|process)\b/gi,
            /\b(enviar|send|guardar|save|actualizar|update)\b/gi,
            /\b(obtener|get|recibir|receive|extraer|extract)\b/gi,
            /\b(validar|validate|verificar|verify|comprobar|check)\b/gi,
            /\b(transformar|transform|convertir|convert|formatear|format)\b/gi,
            /\b(notificar|notify|alertar|alert|informar|inform)\b/gi
        ];
        
        const actions = [];
        actionPatterns.forEach(pattern => {
            const matches = prompt.match(pattern) || [];
            actions.push(...matches.map(m => m.toLowerCase()));
        });
        
        return [...new Set(actions)]; // Eliminar duplicados
    }

    /**
     * Identifica flujo de datos
     */
    identifyDataFlow(prompt) {
        const flowIndicators = {
            sequential: /\b(después|then|luego|siguiente|next)\b/gi,
            parallel: /\b(simultáneamente|parallel|al mismo tiempo|concurrente)\b/gi,
            conditional: /\b(si|if|cuando|when|dependiendo|depending)\b/gi,
            iterative: /\b(repetir|repeat|loop|ciclo|cada|every)\b/gi
        };
        
        const detectedFlows = {};
        Object.keys(flowIndicators).forEach(flow => {
            const matches = prompt.match(flowIndicators[flow]);
            detectedFlows[flow] = matches ? matches.length : 0;
        });
        
        return detectedFlows;
    }

    /**
     * Evalúa complejidad del prompt
     */
    assessComplexity(prompt) {
        const complexityFactors = {
            length: prompt.length,
            sentences: (prompt.match(/[.!?]+/g) || []).length,
            technicalTerms: (prompt.match(/\b(API|HTTP|JSON|XML|database|email|webhook)\b/gi) || []).length,
            conditions: (prompt.match(/\b(si|if|cuando|when|caso|case)\b/gi) || []).length
        };
        
        const score = (
            Math.min(complexityFactors.length / 100, 1) * 0.3 +
            Math.min(complexityFactors.sentences / 5, 1) * 0.2 +
            Math.min(complexityFactors.technicalTerms / 3, 1) * 0.3 +
            Math.min(complexityFactors.conditions / 2, 1) * 0.2
        );
        
        return {
            score: score,
            level: score > 0.7 ? "high" : score > 0.4 ? "medium" : "low",
            factors: complexityFactors
        };
    }

    /**
     * Determina patrón de flujo
     */
    determineFlowPattern(analysis) {
        const flows = analysis.dataFlow;
        const maxFlow = Object.keys(flows).reduce((a, b) => flows[a] > flows[b] ? a : b);
        
        if (flows[maxFlow] === 0) {
            return analysis.complexity.level === "high" ? "conditional" : "sequential";
        }
        
        return maxFlow;
    }

    /**
     * Estima número de nodos
     */
    estimateNodeCount(analysis) {
        const baseNodes = Math.max(8, analysis.estimatedSteps);
        const complexityMultiplier = analysis.complexity.score * 1.5 + 1;
        const estimated = Math.floor(baseNodes * complexityMultiplier);
        
        return Math.min(Math.max(estimated, this.professionalContext.workflowStandards.minNodes), 
                       this.professionalContext.workflowStandards.maxNodes);
    }

    /**
     * Planifica estrategia de conexiones
     */
    planConnectionStrategy(pattern) {
        const strategies = {
            sequential: "linear-chain-with-branches",
            parallel: "fork-join-pattern",
            conditional: "decision-tree-branches", 
            iterative: "loop-with-convergence"
        };
        
        return {
            type: strategies[pattern] || "adaptive-hybrid",
            optimization: "minimize-crossings",
            validation: "ensure-connectivity"
        };
    }

    /**
     * Genera hints de layout
     */
    generateLayoutHints(pattern) {
        const layoutHints = {
            sequential: {
                direction: "top-to-bottom",
                spacing: "uniform-vertical",
                alignment: "center-aligned"
            },
            parallel: {
                direction: "multi-column",
                spacing: "synchronized-horizontal",
                alignment: "parallel-streams"
            },
            conditional: {
                direction: "tree-structure",
                spacing: "branch-optimized",
                alignment: "decision-centered"
            },
            iterative: {
                direction: "circular-flow",
                spacing: "loop-aware",
                alignment: "convergence-focused"
            }
        };
        
        return layoutHints[pattern] || layoutHints.sequential;
    }

    /**
     * Planifica flujo de ejecución
     */
    planExecutionFlow(analysis) {
        return {
            startNodes: ["trigger", "webhook", "schedule"],
            coreFlow: analysis.actions.map(action => `${action}-node`),
            endNodes: ["output", "notification", "storage"],
            errorHandling: "try-catch-nodes",
            validation: "checkpoint-nodes"
        };
    }

    /**
     * Contexto base por tipo de workflow
     */
    getBaseContext(workflowType) {
        const contexts = {
            automation: `
CONTEXTO: Creación de workflow de automatización profesional N8N
OBJETIVO: Generar un workflow robusto y escalable con arquitectura profesional
ESTÁNDAR: Seguir mejores prácticas de N8N con layout matemáticamente optimizado`,
            
            integration: `
CONTEXTO: Workflow de integración entre sistemas/servicios
OBJETIVO: Crear flujo de datos eficiente con manejo robusto de errores
ESTÁNDAR: Optimizar transferencia de datos y transformaciones`,
            
            processing: `
CONTEXTO: Workflow de procesamiento de datos avanzado
OBJETIVO: Pipeline de procesamiento con validación y optimización
ESTÁNDAR: Arquitectura escalable con patrones de procesamiento profesional`
        };
        
        return contexts[workflowType] || contexts.automation;
    }

    /**
     * Especificaciones técnicas
     */
    getTechnicalSpecifications() {
        return `
ESPECIFICACIONES TÉCNICAS V4 ULTRA:
- Usar nombres inteligentes y descriptivos para todos los nodos
- Aplicar posicionamiento matemático preciso (algoritmo Sugiyama)
- Optimizar conexiones para minimizar cruces y maximizar legibilidad
- Incluir metadatos completos en cada nodo
- Validar consistencia de tipos de datos entre conexiones
- Implementar manejo robusto de errores y casos edge`;
    }

    /**
     * Directrices de calidad
     */
    getQualityDirectives() {
        return `
DIRECTRICES DE CALIDAD:
- LAYOUT: Usar posicionamiento topológico con separación matemática precisa
- NOMBRES: Aplicar convenciones inteligentes y contextuales
- CONEXIONES: Optimizar flujo de datos con validación de tipos
- METADATOS: Incluir configuración completa y documentación
- CONSISTENCIA: Mantener estándares uniformes en todo el workflow
- VALIDACIÓN: Verificar integridad estructural y funcional`;
    }

    /**
     * Contexto básico de fallback
     */
    generateBasicContext(userPrompt) {
        return {
            enhancedPrompt: `Crear workflow N8N profesional para: ${userPrompt}`,
            metadata: { 
                version: this.version,
                level: "basic-fallback" 
            }
        };
    }

    /**
     * Obtiene información del sistema
     */
    getSystemInfo() {
        return {
            name: "PromptContextualInjectorV4",
            version: this.version,
            capabilities: [
                "Enhanced context generation",
                "DAG plan integration", 
                "Professional metadata injection",
                "Quality-driven prompt enhancement",
                "Intelligent flow analysis"
            ],
            metrics: this.professionalContext.qualityMetrics
        };
    }
}

// Función de utilidad para uso directo
function createEnhancedContext(userPrompt, workflowType = "automation") {
    const injector = new PromptContextualInjectorV4();
    return injector.generateEnhancedContext(userPrompt, workflowType);
}

// Exportar para uso en extension server
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PromptContextualInjectorV4,
        createEnhancedContext
    };
}

// Export default para ES modules
export default PromptContextualInjectorV4;
export { createEnhancedContext };

// Global para uso directo
if (typeof window !== 'undefined') {
    window.PromptContextualInjectorV4 = PromptContextualInjectorV4;
    window.createEnhancedContext = createEnhancedContext;
}
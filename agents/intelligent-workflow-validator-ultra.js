/**
 * Intelligent Workflow Validator ULTRA
 * 
 * Combina una validación exhaustiva basada en reglas locales (eficiencia máxima)
 * con una capa opcional de análisis por IA para una "segunda opinión" sobre
 * la coherencia semántica del workflow.
 */

import GeminiModelRouter from './gemini-model-router.js';

class IntelligentWorkflowValidatorUltra {
    constructor() {
        this.geminiRouter = new GeminiModelRouter();
        this.initializeRules();
        console.log('🚀 Intelligent Workflow Validator ULTRA inicializado');
    }

    initializeRules() {
        this.validationRules = { maxNodes: 100, minNodes: 1 };
        this.nodeTypeRequirements = new Map();
        this.nodeTypeRequirements.set('n8n-nodes-base.webhook', { requiredParams: ['httpMethod', 'path'], maxIncoming: 0, minOutgoing: 1 });
        this.nodeTypeRequirements.set('n8n-nodes-base.if', { requiredParams: ['conditions'], minIncoming: 1, minOutgoing: 2 });
        this.nodeTypeRequirements.set('n8n-nodes-base.merge', { requiredParams: ['mode'], minIncoming: 2, maxOutgoing: 1 });
    }

    // 🎯 VALIDACIÓN PRINCIPAL HÍBRIDA
    async validateWorkflow(workflowData, originalPrompt = '', useAI = false) {
        console.log('🚀 IWV ULTRA: Iniciando validación híbrida...');
        const results = {
            isValid: true,
            criticalErrors: [],
            warnings: [],
            suggestions: [],
            score: 0,
            analysisDetails: {}
        };

        this.performLocalValidation(workflowData, results, originalPrompt);

        if (useAI && results.isValid && results.warnings.length > 0) {
            console.log('🧠 Activando segunda opinión de IA...');
            const aiAnalysis = await this.performAIValidation(workflowData, originalPrompt, results.warnings);
            results.suggestions.push(...aiAnalysis.suggestions);
            results.analysisDetails.aiAnalysis = aiAnalysis;
        }

        this.calculateQualityScore(results);
        console.log(`✅ Validación ULTRA completada. Score: ${results.score}/100`);
        return results;
    }

    performLocalValidation(workflowData, results, originalPrompt) {
        this.validateStructure(workflowData, results);
        this.validateConnectivity(workflowData, results);
        this.validateNodeConfiguration(workflowData, results);
        this.validateLogicalFlow(workflowData, results);
        this.analyzeCoherence(workflowData, originalPrompt, results);
    }

    // =============================================
    // SECCIÓN DE VALIDACIÓN POR REGLAS (CÓDIGO ORIGINAL)
    // =============================================

    validateStructure(workflowData, results) {
        if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
            results.criticalErrors.push('Falta array de nodos válido');
            results.isValid = false;
            return;
        }
        for (const node of workflowData.nodes) {
            if (!node.id || !node.name || !node.type || !node.position) {
                results.criticalErrors.push(`Nodo incompleto: ${JSON.stringify(node)}`);
                results.isValid = false;
            }
        }
    }

    validateConnectivity(workflowData, results) {
        const nodeNames = new Set(workflowData.nodes.map(n => n.name));
        const connectedNodes = new Set();
        Object.entries(workflowData.connections).forEach(([sourceName, sourceConns]) => {
            connectedNodes.add(sourceName);
            if (sourceConns.main) {
                sourceConns.main.flat().forEach(target => {
                    if (!nodeNames.has(target.node)) {
                        results.criticalErrors.push(`Conexión hacia nodo inexistente: ${target.node}`);
                        results.isValid = false;
                    }
                    connectedNodes.add(target.node);
                });
            }
        });
        workflowData.nodes.forEach(node => {
            if (!connectedNodes.has(node.name) && !this.isTriggerType(node.type)) {
                results.warnings.push(`Nodo huérfano detectado: ${node.name}`);
            }
        });
    }

    validateNodeConfiguration(workflowData, results) {
        for (const node of workflowData.nodes) {
            const requirements = this.nodeTypeRequirements.get(node.type);
            if (requirements?.requiredParams) {
                for (const param of requirements.requiredParams) {
                    if (!node.parameters || !node.parameters[param]) {
                        results.warnings.push(`Nodo ${node.name}: falta parámetro requerido '${param}'`);
                    }
                }
            }
        }
    }

    validateLogicalFlow(workflowData, results) {
        const triggers = workflowData.nodes.filter(n => this.isTriggerType(n.type));
        if (triggers.length === 0) {
            results.criticalErrors.push('No se encontró ningún nodo trigger');
            results.isValid = false;
        }
    }

    analyzeCoherence(workflowData, originalPrompt, results) {
        const promptLower = originalPrompt.toLowerCase();
        if (promptLower.includes('email') && !workflowData.nodes.some(n => n.type.includes('mail'))) {
            results.suggestions.push('El prompt menciona email, pero no hay un nodo de email.');
        }
    }

    calculateQualityScore(results) {
        let score = 100;
        score -= results.criticalErrors.length * 25;
        score -= results.warnings.length * 5;
        if (results.analysisDetails.aiAnalysis) score += 10;
        results.score = Math.max(0, Math.min(100, score));
    }

    isTriggerType(type) {
        const triggerTypes = ['webhook', 'cron', 'manual', 'trigger'];
        return triggerTypes.some(t => type.includes(t));
    }

    // =============================================
    // CAPA DE VALIDACIÓN POR IA (NUEVO EN ULTRA)
    // =============================================

    async performAIValidation(workflow, prompt, warnings) {
        const aiPrompt = this.buildAIPrompt(workflow, prompt, warnings);
        try {
            const response = await this.geminiRouter.generateContent(aiPrompt, 'workflow-validator');
            return this.parseAIResponse(response.content);
        } catch (error) {
            console.error('❌ Error en la validación por IA:', error);
            return { suggestions: ['La validación por IA falló.'] };
        }
    }

    buildAIPrompt(workflow, userPrompt, warnings) {
        return `
Eres un experto en n8n. Analiza este workflow en busca de problemas de coherencia semántica.

PROMPT DEL USUARIO: "${userPrompt}"
WORKFLOW (resumen): ${JSON.stringify(workflow.nodes.map(n => ({ name: n.name, type: n.type })), null, 2)}
ADVERTENCIAS LOCALES: ${warnings.join(', ')}

TAREA: Basado en el prompt y las advertencias, genera sugerencias para mejorar la lógica.

RESPONDE SOLO EN FORMATO JSON:
{
  "suggestions": ["Sugerencia 1...", "Sugerencia 2..."]
}
`;
    }

    parseAIResponse(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return { suggestions: [] };
        } catch (e) {
            return { suggestions: ['Error al parsear la respuesta de la IA.'] };
        }
    }
}

export default IntelligentWorkflowValidatorUltra;

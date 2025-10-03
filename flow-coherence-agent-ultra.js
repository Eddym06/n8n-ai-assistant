/**
 *  FlowCoherenceAgent ULTRA - Fusión de V2 y V3-Router
 * 
 * Combina la eficiencia de la validación local de la V3 con la precisión 
 * del análisis topológico por sub-flujos de la V2.
 * 
 * CARACTERÍSTICAS ULTRA:
 * 1.  **Validación Local Primero**: Realiza un chequeo rápido sin API para problemas comunes (de V3).
 * 2.  **Análisis Topológico Inteligente**: Si la validación local no es suficiente, 
 *     analiza la topología para aislar sub-flujos (de V2).
 * 3.  **Llamadas a IA Quirúrgicas**: Solo envía a la IA los sub-flujos que presentan 
 *     problemas, minimizando costos y maximizando la precisión (Fusión V2 y V3).
 * 4.  **Integración con Gemini Model Router**: Totalmente integrado con el router para 
 *     gestión automática de modelos y resiliencia (de V3).
 * 5.  **Scoring de Coherencia Avanzado**: Genera una puntuación de coherencia basada en 
 *     validaciones locales y de IA.
 */

import GeminiModelRouter from './gemini-model-router.js';

class FlowCoherenceAgentUltra {
    constructor() {
        this.geminiRouter = new GeminiModelRouter();
        this.localValidationRules = this.initializeLocalRules();
        console.log('🚀 FlowCoherenceAgent ULTRA inicializado');
    }

    /**
     * Inicializa reglas de validación local para evitar llamadas API (de V3)
     */
    initializeLocalRules() {
        return {
            safeTriggers: ['webhook', 'cron', 'manual', 'schedule', 'start'],
            standardConnections: ['main', 'trigger', 'output'],
            basicConfigs: ['enabled', 'name', 'type', 'position'],
            commonFixes: {
                missingCredentials: 'Add default credential placeholder',
                invalidConnection: 'Connect to available output',
                missingTrigger: 'Add webhook trigger',
                orphanedNode: 'Connect to workflow main path'
            }
        };
    }

    /**
     * MÉTODO PRINCIPAL ULTRA
     */
    async processWorkflow(workflow, originalPrompt) {
        const startTime = Date.now();
        console.log('🚀 ACF ULTRA: Iniciando procesamiento híbrido...');

        // 1. VALIDACIÓN LOCAL RÁPIDA (de V3)
        const localIssues = this.performLocalValidation(workflow);
        console.log(`📊 ${localIssues.length} problemas locales encontrados.`);

        if (localIssues.length === 0) {
            console.log('✅ Validación local exitosa. No se requiere IA.');
            return this.buildSuccessResponse(workflow, [], 95, 'local-validation-success', startTime);
        }

        // 2. ANÁLISIS TOPOLÓGICO SI HAY PROBLEMAS (de V2)
        console.log('🔬 Problemas locales detectados, iniciando análisis topológico...');
        const manifest = this.analyzeWorkflowTopology(workflow);
        
        let finalWorkflow = JSON.parse(JSON.stringify(workflow));
        let allChanges = [];
        let totalProblemsFixed = 0;

        // 3. LLAMADAS A IA QUIRÚRGICAS POR SUB-FLUJO (Fusión V2 y V3)
        for (const [rootNodeName, subflowData] of manifest.subWorkflows.entries()) {
            const subflowIssues = this.performLocalValidation(this.createTempWorkflow(subflowData.nodes, workflow.connections));

            if (subflowIssues.length > 0) {
                console.log(`--- 🎯 Procesando sub-flujo problemático: ${rootNodeName} ---`);
                const contextualPrompt = this.generateContextualPrompt(subflowData, originalPrompt, manifest.complexity);
                
                try {
                    const plan = await this.getCorrectionPlan(subflowData, subflowIssues, contextualPrompt);
                    if (plan && plan.corrections && plan.corrections.length > 0) {
                        finalWorkflow = this.applyCorrections(finalWorkflow, plan);
                        allChanges.push(...plan.corrections);
                        totalProblemsFixed += subflowIssues.length;
                    }
                } catch (error) {
                    console.warn(`⚠️ Error procesando sub-flujo ${rootNodeName} con IA:`, error.message);
                }
            }
        }

        const finalScore = Math.max(30, 90 - (localIssues.length - totalProblemsFixed) * 10);
        return this.buildSuccessResponse(finalWorkflow, allChanges, finalScore, 'hybrid-ai-correction', startTime, {
            problemsFixed: totalProblemsFixed,
            remainingProblems: localIssues.length - totalProblemsFixed
        });
    }

    /**
     * Validación local rápida sin llamadas API (de V3)
     */
    performLocalValidation(workflow) {
        const issues = [];
        const nodes = workflow.nodes || [];
        const connections = workflow.connections || {};

        if (nodes.length === 0) {
            issues.push({ type: 'critical', message: 'Workflow sin nodos' });
            return issues;
        }

        const connectedNodes = new Set();
        Object.values(connections).forEach(connList => {
            if (connList.main) {
                connList.main.flat().forEach(c => connectedNodes.add(c.node));
            }
        });

        const hasTrigger = nodes.some(n => this.isTriggerNode(n.type));
        if (!hasTrigger) {
            issues.push({ type: 'critical', message: 'No se encontró un nodo trigger' });
        }

        nodes.forEach(node => {
            if (!connectedNodes.has(node.name) && !this.isTriggerNode(node.type)) {
                issues.push({ type: 'warning', message: `Nodo huérfano: ${node.name}` });
            }
            if (node.type?.includes('if')) {
                const nodeConns = connections[node.name];
                if (!nodeConns || !nodeConns.main || nodeConns.main.flat().length === 0) {
                    issues.push({ type: 'warning', message: `Nodo IF incompleto: ${node.name}` });
                }
            }
        });

        return issues;
    }

    /**
     * Construye una respuesta de éxito detallada
     */
    buildSuccessResponse(workflow, changes, score, method, startTime, details = {}) {
        return {
            success: true,
            workflow,
            coherenceScore: score,
            fixes: changes,
            method,
            processTime: Date.now() - startTime,
            ...details
        };
    }
}

export default FlowCoherenceAgentUltra;

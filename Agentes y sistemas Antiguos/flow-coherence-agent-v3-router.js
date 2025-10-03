/**
 * FlowCoherenceAgent V3.0 - Con Gemini Model Router
 * Versión ultra-optimizada que minimiza llamadas a la API de Gemini
 * Usa el router inteligente para gestión automática de modelos
 */

import GeminiModelRouter from './gemini-model-router.js';

class FlowCoherenceAgentV3 {
    constructor() {
        // Usar el router en lugar de GoogleGenerativeAI directo
        this.geminiRouter = new GeminiModelRouter();
        this.callCount = 0;
        this.localValidationRules = this.initializeLocalRules();
        
        console.log('✅ FlowCoherenceAgent V3 inicializado con Gemini Router');
    }

    /**
     * Inicializa reglas de validación local para evitar llamadas API
     */
    initializeLocalRules() {
        return {
            // Nodos que siempre están bien configurados
            safeTriggers: ['webhook', 'cron', 'manual', 'schedule'],
            
            // Conexiones que no requieren validación especial
            standardConnections: ['main', 'trigger', 'output'],
            
            // Configuraciones que raramente tienen problemas
            basicConfigs: ['enabled', 'name', 'type', 'position'],
            
            // Patrones de problemas comunes que se pueden resolver localmente
            commonFixes: {
                missingCredentials: 'Add default credential placeholder',
                invalidConnection: 'Connect to available output',
                missingTrigger: 'Add webhook trigger',
                orphanedNode: 'Connect to workflow main path'
            }
        };
    }

    /**
     * Validación local rápida sin llamadas API
     */
    performLocalValidation(workflow) {
        const issues = [];
        const nodes = workflow.nodes || [];
        const connections = workflow.connections || {};

        // 1. Verificar estructura básica
        if (nodes.length === 0) {
            issues.push({
                type: 'critical',
                message: 'Workflow without nodes',
                fix: 'localFix',
                solution: 'Add basic trigger node'
            });
        }

        // 2. Verificar nodos huérfanos
        const connectedNodes = new Set();
        Object.values(connections).forEach(nodeConnections => {
            if (nodeConnections.main) {
                nodeConnections.main.forEach(outputArray => {
                    outputArray.forEach(connection => {
                        connectedNodes.add(connection.node);
                    });
                });
            }
        });

        nodes.forEach(node => {
            if (!connectedNodes.has(node.name) && node.type !== 'n8n-nodes-base.start') {
                issues.push({
                    type: 'warning',
                    message: `Orphaned node: ${node.name}`,
                    fix: 'localFix',
                    solution: this.localValidationRules.commonFixes.orphanedNode
                });
            }
        });

        // 3. Verificar triggers
        const hasTrigger = nodes.some(node => 
            this.localValidationRules.safeTriggers.some(trigger => 
                node.type.includes(trigger)
            )
        );

        if (!hasTrigger) {
            issues.push({
                type: 'critical',
                message: 'No trigger node found',
                fix: 'localFix',
                solution: this.localValidationRules.commonFixes.missingTrigger
            });
        }

        return {
            localIssues: issues,
            needsAIValidation: issues.filter(i => i.type === 'critical').length > 0
        };
    }

    /**
     * Aplicar correcciones locales sin IA
     */
    applyLocalFixes(workflow, localIssues) {
        let correctedWorkflow = JSON.parse(JSON.stringify(workflow));
        let fixesApplied = [];

        localIssues.forEach(issue => {
            if (issue.fix === 'localFix') {
                switch (issue.solution) {
                    case 'Add basic trigger node':
                        correctedWorkflow.nodes.unshift({
                            id: 'trigger-' + Date.now(),
                            name: 'Webhook Trigger',
                            type: 'n8n-nodes-base.webhook',
                            position: [100, 100],
                            parameters: {}
                        });
                        fixesApplied.push('Added webhook trigger');
                        break;
                        
                    case 'Add default credential placeholder':
                        // Aplicar a nodos que requieren credenciales
                        correctedWorkflow.nodes.forEach(node => {
                            if (this.requiresCredentials(node.type)) {
                                node.credentials = node.credentials || {};
                                fixesApplied.push(`Added credentials to ${node.name}`);
                            }
                        });
                        break;
                }
            }
        });

        return {
            workflow: correctedWorkflow,
            fixes: fixesApplied
        };
    }

    /**
     * Verificar si un nodo requiere credenciales
     */
    requiresCredentials(nodeType) {
        const credentialRequiredTypes = [
            'gmail', 'googlesheets', 'slack', 'telegram', 
            'discord', 'twitter', 'facebook', 'dropbox',
            'httpRequest', 'ssh', 'ftp', 'mysql', 'postgres'
        ];
        
        return credentialRequiredTypes.some(type => nodeType.includes(type));
    }

    /**
     * Método principal optimizado - MÍNIMAS LLAMADAS API
     */
    async processWorkflow(workflow, options = {}) {
        const startTime = Date.now();
        
        try {
            console.log('🔍 FlowCoherenceAgent V3: Iniciando procesamiento optimizado...');
            
            // 1. VALIDACIÓN LOCAL PRIMERO (0 API calls)
            const localValidation = this.performLocalValidation(workflow);
            console.log(`📊 Issues locales encontrados: ${localValidation.localIssues.length}`);
            
            // 2. APLICAR FIXES LOCALES (0 API calls)
            let processedWorkflow = workflow;
            let localFixes = [];
            
            if (localValidation.localIssues.length > 0) {
                const fixResult = this.applyLocalFixes(workflow, localValidation.localIssues);
                processedWorkflow = fixResult.workflow;
                localFixes = fixResult.fixes;
                console.log(`🔧 Fixes locales aplicados: ${localFixes.length}`);
            }

            // 3. DECISIÓN INTELIGENTE: ¿Necesita IA?
            if (!localValidation.needsAIValidation && localValidation.localIssues.length < 3) {
                console.log('✅ Validación local suficiente - NO se requiere llamada API');
                return {
                    success: true,
                    workflow: processedWorkflow,
                    coherenceScore: 85, // Score alto para validación local exitosa
                    fixes: localFixes,
                    apiCallsMade: 0,
                    processTime: Date.now() - startTime,
                    method: 'local-validation'
                };
            }

            // 4. LLAMADA API SOLO SI ES NECESARIA (1 API call máximo)
            console.log('🤖 Validación local insuficiente - Llamando IA para revisión avanzada...');
            this.callCount++;
            
            const aiValidationResult = await this.performAIValidation(processedWorkflow);
            
            return {
                success: true,
                workflow: aiValidationResult.workflow || processedWorkflow,
                coherenceScore: aiValidationResult.score || 75,
                fixes: [...localFixes, ...(aiValidationResult.fixes || [])],
                apiCallsMade: 1,
                processTime: Date.now() - startTime,
                method: 'hybrid-validation',
                aiResponse: aiValidationResult
            };

        } catch (error) {
            console.error('❌ Error en FlowCoherenceAgent V3:', error.message);
            return {
                success: false,
                workflow: workflow,
                error: error.message,
                apiCallsMade: this.callCount,
                processTime: Date.now() - startTime
            };
        }
    }

    /**
     * Validación AI solo cuando es estrictamente necesaria
     */
    async performAIValidation(workflow) {
        try {
            const prompt = this.buildOptimizedPrompt(workflow);
            
            // Usar el router con configuración específica para flow-coherence
            const routerResult = await this.geminiRouter.generateContent(
                prompt,
                'flow-coherence', // Nombre del agente para usar modelos Flash apropiados
                {
                    maxOutputTokens: 2048, // Límite menor para validaciones
                    temperature: 0.3       // Más determinístico
                }
            );
            
            console.log(`✅ AI Validation con ${routerResult.modelName} - Costo: $${routerResult.cost.toFixed(4)}`);
            
            return this.parseAIResponse(routerResult.content);
            
        } catch (error) {
            console.error('❌ Error en AI validation:', error.message);
            return {
                score: 60,
                fixes: ['Error in AI validation - using local fixes only'],
                workflow: null
            };
        }
    }

    /**
     * Construir prompt optimizado para validación
     */
    buildOptimizedPrompt(workflow) {
        const nodeCount = workflow.nodes?.length || 0;
        const connectionCount = Object.keys(workflow.connections || {}).length;
        
        return `Analyze this n8n workflow for critical issues only:

WORKFLOW STATS:
- Nodes: ${nodeCount}
- Connections: ${connectionCount}

FOCUS ON:
1. Critical structural problems
2. Missing essential connections
3. Invalid node configurations

WORKFLOW JSON:
${JSON.stringify(workflow, null, 2)}

RESPOND WITH JSON:
{
  "score": <0-100>,
  "criticalIssues": [<list>],
  "fixes": [<list>],
  "isValid": <boolean>
}`;
    }

    /**
     * Parse de respuesta AI
     */
    parseAIResponse(response) {
        try {
            // Extraer JSON de la respuesta
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in AI response');
            }
            
            const result = JSON.parse(jsonMatch[0]);
            
            return {
                score: result.score || 70,
                fixes: result.fixes || [],
                criticalIssues: result.criticalIssues || [],
                isValid: result.isValid !== false
            };
            
        } catch (error) {
            console.warn('⚠️ Error parsing AI response:', error.message);
            return {
                score: 65,
                fixes: ['AI response parsing failed - using fallback validation'],
                isValid: true
            };
        }
    }

    /**
     * Obtener estadísticas del agente
     */
    getStats() {
        return {
            totalCalls: this.callCount,
            rulesLoaded: Object.keys(this.localValidationRules).length,
            routerStats: this.geminiRouter.getStats()
        };
    }

    /**
     * Reset de estadísticas
     */
    resetStats() {
        this.callCount = 0;
        this.geminiRouter.resetStats();
    }
}

export default FlowCoherenceAgentV3;
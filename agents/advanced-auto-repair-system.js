// 🔧 SISTEMA DE AUTO-REPARACIÓN AVANZADA V4 ULTRA
// Mecanismos sofisticados de auto-reparación para workflows complejos

import fs from 'fs';
import path from 'path';

export default class AdvancedAutoRepairSystem {
    constructor(v4UltraSystem, flowCoherenceAgent) {
        this.v4Ultra = v4UltraSystem;
        this.flowCoherence = flowCoherenceAgent;
        this.repairHistory = new Map();
        this.repairPatterns = this.initializeRepairPatterns();
        this.complexityThresholds = {
            simple: 5,    // <= 5 nodos
            medium: 20,   // 6-20 nodos
            complex: 50,  // 21-50 nodos
            massive: 100  // 51+ nodos
        };
    }

    /**
     * 🎯 MÉTODO PRINCIPAL - Auto-reparación con análisis multi-dimensional
     */
    async performAdvancedRepair(workflow, originalPrompt, options = {}) {
        console.log('🔧 INICIANDO AUTO-REPARACIÓN AVANZADA V4');
        console.log('==========================================');

        const startTime = Date.now();
        const workflowComplexity = this.analyzeWorkflowComplexity(workflow);
        
        console.log(`📊 Complejidad detectada: ${workflowComplexity.level} (${workflow.nodes.length} nodos)`);

        let repairedWorkflow = JSON.parse(JSON.stringify(workflow));
        let totalRepairs = 0;
        let repairLog = [];

        // Fase 1: Análisis y diagnóstico multi-dimensional
        const diagnostics = await this.performComprehensiveDiagnostics(repairedWorkflow, originalPrompt);
        console.log(`🔍 Diagnósticos completados: ${diagnostics.issues.length} problemas detectados`);

        // Fase 2: Reparación por complejidad adaptativa
        const repairResult = await this.executeAdaptiveRepair(repairedWorkflow, diagnostics, workflowComplexity);
        repairedWorkflow = repairResult.workflow;
        totalRepairs += repairResult.repairsCount;
        repairLog.push(...repairResult.log);

        // Fase 3: Validación y optimización final
        const validationResult = await this.performFinalValidation(repairedWorkflow, originalPrompt);
        
        // Fase 4: Logging y métricas
        const processingTime = Date.now() - startTime;
        await this.logRepairSession(workflow, repairedWorkflow, repairLog, processingTime);

        console.log('🎯 AUTO-REPARACIÓN COMPLETADA');
        console.log(`   🔧 Reparaciones aplicadas: ${totalRepairs}`);
        console.log(`   ⏱️ Tiempo total: ${processingTime}ms`);
        console.log(`   📊 Calidad final: ${validationResult.quality}/100`);

        return {
            workflow: repairedWorkflow,
            repairsApplied: totalRepairs,
            quality: validationResult.quality,
            diagnostics,
            repairLog,
            processingTime
        };
    }

    /**
     * 🔍 DIAGNÓSTICO COMPREHENSIVO MULTI-DIMENSIONAL
     */
    async performComprehensiveDiagnostics(workflow, originalPrompt) {
        const issues = [];
        const metrics = {};

        // Diagnóstico 1: Análisis estructural
        const structuralIssues = this.analyzeStructuralIntegrity(workflow);
        issues.push(...structuralIssues);

        // Diagnóstico 2: Análisis de coherencia lógica
        const logicalIssues = this.analyzeLogicalCoherence(workflow, originalPrompt);
        issues.push(...logicalIssues);

        // Diagnóstico 3: Análisis de configuraciones
        const configIssues = this.analyzeNodeConfigurations(workflow);
        issues.push(...configIssues);

        // Diagnóstico 4: Análisis de patrones conocidos
        const patternIssues = this.analyzeKnownPatterns(workflow);
        issues.push(...patternIssues);

        // Diagnóstico 5: Análisis de performance potencial
        const performanceIssues = this.analyzePerformanceIssues(workflow);
        issues.push(...performanceIssues);

        return {
            issues,
            metrics,
            severity: this.calculateSeverityLevel(issues),
            repairComplexity: this.estimateRepairComplexity(issues)
        };
    }

    /**
     * 🛠️ REPARACIÓN ADAPTATIVA SEGÚN COMPLEJIDAD
     */
    async executeAdaptiveRepair(workflow, diagnostics, complexity) {
        let repairedWorkflow = JSON.parse(JSON.stringify(workflow));
        let repairsCount = 0;
        let log = [];

        const issues = diagnostics.issues.sort((a, b) => b.priority - a.priority);

        for (const issue of issues) {
            try {
                console.log(`🔧 Reparando: ${issue.type} - ${issue.description}`);
                
                const repairResult = await this.applySpecificRepair(repairedWorkflow, issue, complexity);
                
                if (repairResult.success) {
                    repairedWorkflow = repairResult.workflow;
                    repairsCount++;
                    log.push({
                        issue: issue.type,
                        description: issue.description,
                        repair: repairResult.action,
                        success: true,
                        timestamp: Date.now()
                    });
                    console.log(`  ✅ ${repairResult.action}`);
                } else {
                    log.push({
                        issue: issue.type,
                        description: issue.description,
                        error: repairResult.error,
                        success: false,
                        timestamp: Date.now()
                    });
                    console.log(`  ❌ Falló: ${repairResult.error}`);
                }

            } catch (error) {
                console.log(`  💥 Error reparando ${issue.type}: ${error.message}`);
                log.push({
                    issue: issue.type,
                    error: error.message,
                    success: false,
                    timestamp: Date.now()
                });
            }
        }

        return { workflow: repairedWorkflow, repairsCount, log };
    }

    /**
     * 🔧 APLICAR REPARACIÓN ESPECÍFICA SEGÚN TIPO DE PROBLEMA
     */
    async applySpecificRepair(workflow, issue, complexity) {
        switch (issue.type) {
            case 'ORPHAN_NODES':
                return this.repairOrphanNodes(workflow, issue, complexity);
                
            case 'BROKEN_CONNECTIONS':
                return this.repairBrokenConnections(workflow, issue);
                
            case 'MISSING_TRIGGERS':
                return this.repairMissingTriggers(workflow, issue);
                
            case 'INCOMPLETE_CONFIGURATIONS':
                return this.repairIncompleteConfigurations(workflow, issue);
                
            case 'LOGICAL_FLOW_BREAKS':
                return this.repairLogicalFlowBreaks(workflow, issue);
                
            case 'PERFORMANCE_BOTTLENECKS':
                return this.repairPerformanceBottlenecks(workflow, issue);
                
            case 'SECURITY_VULNERABILITIES':
                return this.repairSecurityVulnerabilities(workflow, issue);
                
            default:
                return this.repairGenericIssue(workflow, issue);
        }
    }

    /**
     * 🔗 REPARAR NODOS HUÉRFANOS
     */
    repairOrphanNodes(workflow, issue, complexity) {
        const orphanNode = workflow.nodes.find(n => n.id === issue.nodeId);
        if (!orphanNode) {
            return { success: false, error: 'Nodo huérfano no encontrado' };
        }

        // Estrategia 1: Conectar al flujo principal por proximidad lógica
        const bestConnection = this.findBestConnectionTarget(workflow, orphanNode);
        
        if (bestConnection) {
            // Crear conexión
            if (!workflow.connections[bestConnection.sourceId]) {
                workflow.connections[bestConnection.sourceId] = {};
            }
            if (!workflow.connections[bestConnection.sourceId].main) {
                workflow.connections[bestConnection.sourceId].main = [];
            }
            
            workflow.connections[bestConnection.sourceId].main.push([{
                node: orphanNode.id,
                type: 'main',
                index: 0
            }]);

            return {
                success: true,
                action: `Conectado nodo ${orphanNode.name} a ${bestConnection.sourceName}`,
                workflow
            };
        }

        // Estrategia 2: Si no hay conexión lógica, crear trigger si es apropiado
        if (this.canBecomeTrigger(orphanNode)) {
            // Convertir en trigger
            const triggerConfig = this.generateTriggerConfiguration(orphanNode);
            orphanNode.parameters = { ...orphanNode.parameters, ...triggerConfig };
            
            return {
                success: true,
                action: `Convertido ${orphanNode.name} en nodo trigger`,
                workflow
            };
        }

        return { success: false, error: 'No se pudo reparar nodo huérfano' };
    }

    /**
     * 🔧 REPARAR CONEXIONES ROTAS
     */
    repairBrokenConnections(workflow, issue) {
        const connections = workflow.connections;
        const nodeIds = new Set(workflow.nodes.map(n => n.id));
        let repaired = false;

        // Buscar conexiones que apuntan a nodos inexistentes
        for (const [sourceId, sourceConnections] of Object.entries(connections)) {
            if (sourceConnections.main) {
                sourceConnections.main = sourceConnections.main.map(outputArray => 
                    outputArray.filter(conn => {
                        if (!nodeIds.has(conn.node)) {
                            // Buscar nodo similar por nombre
                            const similarNode = this.findSimilarNodeByName(workflow, conn.node);
                            if (similarNode) {
                                conn.node = similarNode.id;
                                repaired = true;
                                return true;
                            }
                            return false; // Eliminar conexión rota
                        }
                        return true;
                    })
                ).filter(outputArray => outputArray.length > 0);
            }
        }

        return {
            success: repaired,
            action: repaired ? 'Reparadas conexiones rotas' : 'No se encontraron conexiones reparables',
            workflow
        };
    }

    /**
     * 🎯 HELPER METHODS
     */
    analyzeWorkflowComplexity(workflow) {
        const nodeCount = workflow.nodes.length;
        const connectionCount = Object.keys(workflow.connections).length;
        
        let level;
        if (nodeCount <= this.complexityThresholds.simple) level = 'simple';
        else if (nodeCount <= this.complexityThresholds.medium) level = 'medium';
        else if (nodeCount <= this.complexityThresholds.complex) level = 'complex';
        else level = 'massive';

        return {
            level,
            nodeCount,
            connectionCount,
            ratio: connectionCount / nodeCount,
            score: Math.min(100, (nodeCount * 2) + (connectionCount * 3))
        };
    }

    analyzeStructuralIntegrity(workflow) {
        const issues = [];
        
        // Buscar nodos sin conexiones entrantes (excepto triggers)
        const connectedNodes = new Set();
        Object.values(workflow.connections).forEach(connections => {
            if (connections.main) {
                connections.main.flat().forEach(conn => {
                    connectedNodes.add(conn.node);
                });
            }
        });

        workflow.nodes.forEach(node => {
            if (!connectedNodes.has(node.id) && !this.isTriggerNode(node)) {
                issues.push({
                    type: 'ORPHAN_NODES',
                    nodeId: node.id,
                    description: `Nodo ${node.name} sin conexiones entrantes`,
                    priority: 8,
                    severity: 'high'
                });
            }
        });

        return issues;
    }

    isTriggerNode(node) {
        const triggerTypes = ['webhook', 'cron', 'manualTrigger', 'emailTrigger', 'httpRequest'];
        return triggerTypes.some(type => node.type.includes(type));
    }

    findBestConnectionTarget(workflow, orphanNode) {
        // Lógica para encontrar el mejor nodo al cual conectar
        const potentialSources = workflow.nodes.filter(n => 
            n.id !== orphanNode.id && 
            !workflow.connections[n.id]?.main?.some(conn => 
                conn.some(c => c.node === orphanNode.id)
            )
        );

        if (potentialSources.length === 0) return null;

        // Priorizar por tipo de nodo y proximidad lógica
        const scored = potentialSources.map(node => ({
            ...node,
            score: this.calculateConnectionScore(node, orphanNode)
        })).sort((a, b) => b.score - a.score);

        return scored.length > 0 ? {
            sourceId: scored[0].id,
            sourceName: scored[0].name
        } : null;
    }

    calculateConnectionScore(sourceNode, targetNode) {
        let score = 0;
        
        // Bonus por tipos compatibles
        if (sourceNode.type.includes('webhook') && targetNode.type.includes('set')) score += 10;
        if (sourceNode.type.includes('http') && targetNode.type.includes('webhook')) score += 8;
        
        // Bonus por nombres relacionados
        const sourceWords = sourceNode.name.toLowerCase().split(' ');
        const targetWords = targetNode.name.toLowerCase().split(' ');
        const commonWords = sourceWords.filter(word => targetWords.includes(word));
        score += commonWords.length * 3;

        return score;
    }

    async performFinalValidation(workflow, originalPrompt) {
        // Usar el sistema de calidad existente
        const quality = this.v4Ultra?.calculateWorkflowQuality?.(workflow) || 50;
        
        return {
            quality,
            isValid: quality >= 70,
            criticalIssues: quality < 50 ? ['Low quality score'] : []
        };
    }

    async logRepairSession(original, repaired, log, time) {
        const session = {
            timestamp: Date.now(),
            originalNodes: original.nodes.length,
            repairedNodes: repaired.nodes.length,
            repairs: log,
            processingTime: time,
            qualityImprovement: 'calculated'
        };

        // Guardar en historial para análisis futuro
        this.repairHistory.set(session.timestamp, session);
        
        // Opcionalmente guardar en archivo
        const logFile = path.join(process.cwd(), 'repair-sessions.json');
        try {
            const existingLogs = fs.existsSync(logFile) ? 
                JSON.parse(fs.readFileSync(logFile, 'utf8')) : [];
            existingLogs.push(session);
            fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));
        } catch (error) {
            console.log('⚠️ No se pudo guardar log de reparación:', error.message);
        }
    }

    initializeRepairPatterns() {
        // Patrones de reparación comunes
        return {
            webhookToProcess: {
                source: 'webhook',
                target: 'set',
                connection: 'main'
            },
            processToNotify: {
                source: 'set',
                target: 'email',
                connection: 'main'
            }
        };
    }
}
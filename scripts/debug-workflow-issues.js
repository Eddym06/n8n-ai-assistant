// 🔍 DEBUG: Análisis específico de problemas en workflows generados

import fs from 'fs';
import path from 'path';

/**
 * 🔍 ANALIZADOR DE PROBLEMAS EN WORKFLOWS
 */
class WorkflowDebugger {
    constructor() {
        this.issues = [];
    }

    /**
     * 📊 Analizar workflow específico
     */
    analyzeWorkflow(workflowPath) {
        console.log(`\n🔍 ANALIZANDO WORKFLOW: ${path.basename(workflowPath)}`);
        
        try {
            const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
            
            // Reset issues for this analysis
            this.issues = [];
            
            // 1. Verificar estructura básica
            this.checkBasicStructure(workflow);
            
            // 2. Verificar nodos
            this.checkNodes(workflow);
            
            // 3. Verificar conexiones
            this.checkConnections(workflow);
            
            // 4. Verificar configuraciones
            this.checkConfigurations(workflow);
            
            // 5. Verificar coherencia de flujo
            this.checkFlowCoherence(workflow);
            
            // 6. Reportar resultados
            this.reportResults(workflow);
            
        } catch (error) {
            console.error(`❌ Error leyendo workflow: ${error.message}`);
        }
    }

    checkBasicStructure(workflow) {
        console.log('\n📋 VERIFICANDO ESTRUCTURA BÁSICA...');
        
        if (!workflow.name) {
            this.addIssue('CRITICAL', 'Workflow sin nombre');
        }
        
        if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
            this.addIssue('CRITICAL', 'Nodos no definidos o no es array');
            return;
        }
        
        if (!workflow.connections || typeof workflow.connections !== 'object') {
            this.addIssue('CRITICAL', 'Conexiones no definidas o no es objeto');
        }
        
        if (!workflow.settings) {
            this.addIssue('WARNING', 'Settings no definidos');
        }
        
        console.log(`   ✅ Nombre: ${workflow.name}`);
        console.log(`   ✅ Nodos: ${workflow.nodes.length}`);
        console.log(`   ✅ Conexiones: ${Object.keys(workflow.connections || {}).length} nodos con conexiones`);
    }

    checkNodes(workflow) {
        console.log('\n🔧 VERIFICANDO NODOS...');
        
        let validNodes = 0;
        let invalidNodes = 0;
        let configuredNodes = 0;
        let unconfiguredNodes = 0;
        
        workflow.nodes.forEach((node, index) => {
            let nodeValid = true;
            let nodeIssues = [];
            
            // Verificar campos requeridos
            if (!node.id) {
                nodeIssues.push('Sin ID');
                nodeValid = false;
            }
            
            if (!node.name) {
                nodeIssues.push('Sin nombre');
                nodeValid = false;
            }
            
            if (!node.type) {
                nodeIssues.push('Sin tipo');
                nodeValid = false;
            }
            
            if (!node.position || !Array.isArray(node.position) || node.position.length !== 2) {
                nodeIssues.push('Posición inválida');
                nodeValid = false;
            }
            
            // Verificar configuración
            let isConfigured = false;
            if (node.parameters && typeof node.parameters === 'object') {
                const paramKeys = Object.keys(node.parameters);
                if (paramKeys.length > 0) {
                    // Verificar que no estén vacíos
                    const hasRealParams = paramKeys.some(key => {
                        const value = node.parameters[key];
                        return value !== null && value !== undefined && value !== '';
                    });
                    isConfigured = hasRealParams;
                }
            }
            
            if (isConfigured) {
                configuredNodes++;
            } else {
                unconfiguredNodes++;
                nodeIssues.push('Sin configuración real');
            }
            
            if (nodeValid) {
                validNodes++;
            } else {
                invalidNodes++;
                this.addIssue('ERROR', `Nodo ${index + 1} (${node.id || 'sin ID'}): ${nodeIssues.join(', ')}`);
            }
        });
        
        console.log(`   ✅ Nodos válidos: ${validNodes}/${workflow.nodes.length}`);
        console.log(`   ⚠️ Nodos inválidos: ${invalidNodes}`);
        console.log(`   🔧 Nodos configurados: ${configuredNodes}/${workflow.nodes.length} (${Math.round(configuredNodes/workflow.nodes.length*100)}%)`);
        console.log(`   ❌ Nodos sin configurar: ${unconfiguredNodes}`);
        
        if (unconfiguredNodes > workflow.nodes.length * 0.3) {
            this.addIssue('WARNING', `Demasiados nodos sin configurar: ${unconfiguredNodes}/${workflow.nodes.length}`);
        }
    }

    checkConnections(workflow) {
        console.log('\n🔗 VERIFICANDO CONEXIONES...');
        
        const connections = workflow.connections || {};
        const nodeIds = new Set(workflow.nodes.map(n => n.id));
        let totalConnections = 0;
        let validConnections = 0;
        let invalidConnections = 0;
        let orphanNodes = [];
        
        // Verificar cada conexión
        Object.entries(connections).forEach(([sourceId, outputs]) => {
            if (!nodeIds.has(sourceId)) {
                this.addIssue('ERROR', `Conexión desde nodo inexistente: ${sourceId}`);
                return;
            }
            
            if (outputs.main) {
                outputs.main.forEach((outputGroup, outputIndex) => {
                    if (Array.isArray(outputGroup)) {
                        outputGroup.forEach(connection => {
                            totalConnections++;
                            if (nodeIds.has(connection.node)) {
                                validConnections++;
                            } else {
                                invalidConnections++;
                                this.addIssue('ERROR', `Conexión hacia nodo inexistente: ${connection.node} desde ${sourceId}`);
                            }
                        });
                    }
                });
            }
        });
        
        // Verificar nodos huérfanos
        const connectedNodes = new Set();
        Object.keys(connections).forEach(sourceId => connectedNodes.add(sourceId));
        Object.values(connections).forEach(outputs => {
            if (outputs.main) {
                outputs.main.forEach(outputGroup => {
                    if (Array.isArray(outputGroup)) {
                        outputGroup.forEach(conn => connectedNodes.add(conn.node));
                    }
                });
            }
        });
        
        workflow.nodes.forEach(node => {
            if (!connectedNodes.has(node.id)) {
                orphanNodes.push(node.id);
            }
        });
        
        console.log(`   🔗 Total conexiones: ${totalConnections}`);
        console.log(`   ✅ Conexiones válidas: ${validConnections}`);
        console.log(`   ❌ Conexiones inválidas: ${invalidConnections}`);
        console.log(`   🏝️ Nodos huérfanos: ${orphanNodes.length}`);
        
        if (orphanNodes.length > 0) {
            console.log(`   ⚠️ Nodos sin conexiones: ${orphanNodes.join(', ')}`);
            this.addIssue('WARNING', `Nodos huérfanos encontrados: ${orphanNodes.length}`);
        }
        
        // Verificar densidad de conexiones
        const expectedMinConnections = Math.max(1, workflow.nodes.length - 1);
        if (totalConnections < expectedMinConnections * 0.5) {
            this.addIssue('ERROR', `Muy pocas conexiones: ${totalConnections} (mínimo esperado: ${expectedMinConnections})`);
        }
    }

    checkConfigurations(workflow) {
        console.log('\n⚙️ VERIFICANDO CONFIGURACIONES...');
        
        let emptyConfigs = 0;
        let incompleteConfigs = 0;
        let completeConfigs = 0;
        
        workflow.nodes.forEach(node => {
            if (!node.parameters || Object.keys(node.parameters).length === 0) {
                emptyConfigs++;
            } else {
                const params = node.parameters;
                let hasCompleteConfig = false;
                
                // Verificaciones específicas por tipo de nodo
                switch (node.type) {
                    case 'n8n-nodes-base.webhook':
                        hasCompleteConfig = params.httpMethod && params.path;
                        break;
                    case 'n8n-nodes-base.httpRequest':
                        hasCompleteConfig = params.url || params.method;
                        break;
                    case 'n8n-nodes-base.set':
                        hasCompleteConfig = params.values && Array.isArray(params.values) && params.values.length > 0;
                        break;
                    case 'n8n-nodes-base.if':
                        hasCompleteConfig = params.conditions || params.condition;
                        break;
                    default:
                        hasCompleteConfig = Object.keys(params).length > 0;
                }
                
                if (hasCompleteConfig) {
                    completeConfigs++;
                } else {
                    incompleteConfigs++;
                }
            }
        });
        
        console.log(`   ✅ Configuraciones completas: ${completeConfigs}`);
        console.log(`   ⚠️ Configuraciones incompletas: ${incompleteConfigs}`);
        console.log(`   ❌ Sin configuración: ${emptyConfigs}`);
        
        const configRatio = completeConfigs / workflow.nodes.length;
        console.log(`   📊 Ratio configuración: ${Math.round(configRatio * 100)}%`);
        
        if (configRatio < 0.7) {
            this.addIssue('ERROR', `Ratio de configuración muy bajo: ${Math.round(configRatio * 100)}%`);
        }
    }

    checkFlowCoherence(workflow) {
        console.log('\n🌊 VERIFICANDO COHERENCIA DE FLUJO...');
        
        // Verificar que haya un trigger
        const triggers = workflow.nodes.filter(node => 
            node.type.includes('webhook') || 
            node.type.includes('trigger') ||
            node.type.includes('cron')
        );
        
        if (triggers.length === 0) {
            this.addIssue('ERROR', 'No se encontró nodo trigger');
        } else {
            console.log(`   ✅ Triggers encontrados: ${triggers.length}`);
        }
        
        // Verificar flujo lineal básico
        const connections = workflow.connections || {};
        let hasLinearFlow = false;
        
        if (triggers.length > 0 && Object.keys(connections).length > 0) {
            // Verificar que el trigger tenga conexiones
            const triggerConnected = triggers.some(trigger => connections[trigger.id]);
            if (triggerConnected) {
                hasLinearFlow = true;
                console.log(`   ✅ Flujo iniciado desde trigger`);
            } else {
                this.addIssue('ERROR', 'Trigger no está conectado');
            }
        }
        
        if (!hasLinearFlow) {
            this.addIssue('ERROR', 'No se detectó flujo coherente');
        }
    }

    addIssue(severity, message) {
        this.issues.push({ severity, message });
    }

    reportResults(workflow) {
        console.log('\n📊 RESUMEN DE ANÁLISIS');
        console.log('='.repeat(50));
        
        const critical = this.issues.filter(i => i.severity === 'CRITICAL');
        const errors = this.issues.filter(i => i.severity === 'ERROR');
        const warnings = this.issues.filter(i => i.severity === 'WARNING');
        
        console.log(`🔴 CRÍTICOS: ${critical.length}`);
        critical.forEach(issue => console.log(`   ❌ ${issue.message}`));
        
        console.log(`🟠 ERRORES: ${errors.length}`);
        errors.forEach(issue => console.log(`   ⚠️ ${issue.message}`));
        
        console.log(`🟡 ADVERTENCIAS: ${warnings.length}`);
        warnings.forEach(issue => console.log(`   ⚠️ ${issue.message}`));
        
        const totalIssues = this.issues.length;
        if (totalIssues === 0) {
            console.log('\n🎉 ¡WORKFLOW PERFECTO! Sin problemas detectados.');
        } else {
            console.log(`\n📈 PUNTUACIÓN DE CALIDAD: ${this.calculateQualityScore(workflow)}/100`);
        }
        
        return {
            critical: critical.length,
            errors: errors.length,
            warnings: warnings.length,
            total: totalIssues,
            quality: this.calculateQualityScore(workflow)
        };
    }

    calculateQualityScore(workflow) {
        let score = 100;
        
        // Penalizaciones
        const critical = this.issues.filter(i => i.severity === 'CRITICAL').length;
        const errors = this.issues.filter(i => i.severity === 'ERROR').length;
        const warnings = this.issues.filter(i => i.severity === 'WARNING').length;
        
        score -= critical * 30;  // Críticos restan mucho
        score -= errors * 10;    // Errores restan moderado
        score -= warnings * 5;   // Advertencias restan poco
        
        return Math.max(0, score);
    }
}

// 🚀 EJECUTAR ANÁLISIS
async function main() {
    const analyzer = new WorkflowDebugger();
    
    // Analizar el último workflow generado
    const workflowsDir = './generated-workflows';
    const files = fs.readdirSync(workflowsDir)
        .filter(f => f.endsWith('.json') && !f.includes('-metadata'))
        .sort()
        .reverse();
    
    if (files.length > 0) {
        // Analizar específicamente el workflow de inventario que acabamos de generar
        const targetFile = files.find(f => f.includes('2025-09-17T14-16-41-996Z')) || files[0];
        const latestWorkflow = path.join(workflowsDir, targetFile);
        console.log(`🎯 Analizando: ${targetFile}`);
        analyzer.analyzeWorkflow(latestWorkflow);
    } else {
        console.log('❌ No se encontraron workflows para analizar');
    }
}

main().catch(console.error);
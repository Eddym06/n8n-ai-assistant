/**
 * 🔬 ANALIZADOR UNIFICADO V3.0 - ACTUALIZADO CON ESTÁNDARES DE REFERENCIA
 * ========================================================================
 * 
 * Basado en análisis comparativo con flujo funcional de referencia:
 * workflows/Wait/1312_Wait_Schedule_Create_Webhook.json
 * 
 * Nuevas validaciones:
 * - Estructura según estándares de n8n funcionales
 * - Detección de campos faltantes críticos
 * - Validación de patrones de ID
 * - Verificación de estructura de conexiones
 * - Comparación con flujos de referencia
 */

const fs = require('fs');
const path = require('path');

// ESTÁNDARES BASADOS EN ANÁLISIS DE REFERENCIA
const REFERENCE_STANDARDS = {
    // Campos obligatorios del workflow
    requiredWorkflowFields: ['meta', 'name', 'nodes', 'connections'],
    
    // Campos recomendados del workflow
    recommendedWorkflowFields: ['id', 'tags', 'active', 'pinData', 'versionId', 'settings'],
    
    // Estructura meta obligatoria
    requiredMetaFields: ['instanceId'],
    
    // Campos obligatorios de nodos
    requiredNodeFields: ['id', 'name', 'type', 'position', 'typeVersion'],
    
    // Campos opcionales pero comunes de nodos
    optionalNodeFields: ['parameters', 'notes', 'notesInFlow', 'disabled', 'credentials', 'continueOnFail', 'webhookId'],
    
    // Campos problemáticos detectados
    problematicFields: ['originalId'],
    
    // Patrones de ID válidos
    validIdPatterns: {
        UUID: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
        ALPHANUMERIC: /^[a-zA-Z0-9]{16,}$/,
        N8N_STYLE: /^[a-zA-Z0-9_-]{8,}$/
    },
    
    // Estructura de conexión válida
    connectionStructure: {
        requiredFields: ['node', 'type', 'index'],
        validTypes: ['main'],
        validIndexes: [0, 1, 2, 3, 4]
    }
};

class EnhancedWorkflowAnalyzer {
    constructor() {
        this.results = {
            referenceCompliance: {},
            structuralIssues: [],
            criticalProblems: [],
            missingFields: [],
            recommendations: [],
            fixes: [],
            comparisonWithReference: {}
        };
    }

    async analyzeWorkflow(workflowPath) {
        console.log('🔬 ANÁLISIS MEJORADO CON ESTÁNDARES DE REFERENCIA');
        console.log('================================================\n');
        
        try {
            const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
            
            // 1. Verificar cumplimiento con estándares de referencia
            this.checkReferenceCompliance(workflowData);
            
            // 2. Analizar estructura crítica
            this.analyzeStructuralIntegrity(workflowData);
            
            // 3. Detectar problemas específicos
            this.detectCriticalIssues(workflowData);
            
            // 4. Validar conexiones avanzado
            this.validateConnectionStructure(workflowData);
            
            // 5. Generar recomendaciones específicas
            this.generateEnhancedRecommendations(workflowData);
            
            // 6. Crear fixes automáticos
            this.createAutomaticFixes(workflowData, workflowPath);
            
            this.reportResults();
            
        } catch (error) {
            console.error('❌ Error durante el análisis:', error.message);
        }
    }

    checkReferenceCompliance(data) {
        console.log('📊 1. VERIFICANDO CUMPLIMIENTO CON ESTÁNDARES DE REFERENCIA\n');
        
        const compliance = {
            workflowFieldsScore: 0,
            metaFieldsScore: 0,
            nodeFieldsScore: 0,
            idPatternsScore: 0,
            overallScore: 0
        };
        
        // Verificar campos del workflow
        const presentWorkflowFields = Object.keys(data);
        const missingRequired = REFERENCE_STANDARDS.requiredWorkflowFields.filter(
            field => !presentWorkflowFields.includes(field)
        );
        const missingRecommended = REFERENCE_STANDARDS.recommendedWorkflowFields.filter(
            field => !presentWorkflowFields.includes(field)
        );
        
        console.log('🏗️  Campos del Workflow:');
        if (missingRequired.length > 0) {
            console.log(`  ❌ CRÍTICO - Campos obligatorios faltantes: ${missingRequired.join(', ')}`);
            this.results.criticalProblems.push({
                type: 'MISSING_REQUIRED_FIELDS',
                fields: missingRequired,
                severity: 'CRITICAL'
            });
        } else {
            console.log('  ✅ Todos los campos obligatorios presentes');
        }
        
        if (missingRecommended.length > 0) {
            console.log(`  ⚠️  Campos recomendados faltantes: ${missingRecommended.join(', ')}`);
            this.results.missingFields.push(...missingRecommended);
        }
        
        compliance.workflowFieldsScore = ((REFERENCE_STANDARDS.requiredWorkflowFields.length - missingRequired.length) / REFERENCE_STANDARDS.requiredWorkflowFields.length) * 100;
        
        // Verificar meta campos
        if (data.meta) {
            const presentMetaFields = Object.keys(data.meta);
            const missingMetaRequired = REFERENCE_STANDARDS.requiredMetaFields.filter(
                field => !presentMetaFields.includes(field)
            );
            
            console.log('🏷️  Campos Meta:');
            if (missingMetaRequired.length > 0) {
                console.log(`  ❌ Meta campos faltantes: ${missingMetaRequired.join(', ')}`);
                this.results.criticalProblems.push({
                    type: 'MISSING_META_FIELDS',
                    fields: missingMetaRequired,
                    severity: 'HIGH'
                });
            } else {
                console.log('  ✅ Meta campos completos');
            }
            
            compliance.metaFieldsScore = ((REFERENCE_STANDARDS.requiredMetaFields.length - missingMetaRequired.length) / REFERENCE_STANDARDS.requiredMetaFields.length) * 100;
        } else {
            console.log('  ❌ CRÍTICO - No hay campo meta');
            compliance.metaFieldsScore = 0;
        }
        
        // Verificar campos de nodos
        if (data.nodes && Array.isArray(data.nodes)) {
            console.log('🔧 Campos de Nodos:');
            const nodeFieldAnalysis = this.analyzeNodeFields(data.nodes);
            console.log(`  📊 Nodos con campos completos: ${nodeFieldAnalysis.completeNodes}/${data.nodes.length}`);
            compliance.nodeFieldsScore = (nodeFieldAnalysis.completeNodes / data.nodes.length) * 100;
            
            if (nodeFieldAnalysis.problematicNodes.length > 0) {
                console.log(`  ⚠️  Nodos con campos faltantes: ${nodeFieldAnalysis.problematicNodes.length}`);
            }
        }
        
        // Verificar patrones de ID
        console.log('🆔 Patrones de ID:');
        const idAnalysis = this.analyzeIdPatterns(data);
        console.log(`  📊 Patrón detectado: ${idAnalysis.pattern}`);
        console.log(`  📊 Consistencia: ${idAnalysis.consistency}%`);
        compliance.idPatternsScore = idAnalysis.consistency;
        
        compliance.overallScore = (compliance.workflowFieldsScore + compliance.metaFieldsScore + compliance.nodeFieldsScore + compliance.idPatternsScore) / 4;
        
        console.log(`\n📊 PUNTUACIÓN GENERAL DE CUMPLIMIENTO: ${compliance.overallScore.toFixed(1)}%\n`);
        this.results.referenceCompliance = compliance;
    }

    analyzeNodeFields(nodes) {
        const analysis = {
            completeNodes: 0,
            problematicNodes: [],
            missingFieldsSummary: {}
        };
        
        nodes.forEach((node, index) => {
            const presentFields = Object.keys(node);
            const missingRequired = REFERENCE_STANDARDS.requiredNodeFields.filter(
                field => !presentFields.includes(field)
            );
            
            const hasProblematicFields = REFERENCE_STANDARDS.problematicFields.some(
                field => presentFields.includes(field)
            );
            
            if (missingRequired.length === 0 && !hasProblematicFields) {
                analysis.completeNodes++;
            } else {
                analysis.problematicNodes.push({
                    index,
                    name: node.name || `Nodo_${index}`,
                    missingFields: missingRequired,
                    problematicFields: REFERENCE_STANDARDS.problematicFields.filter(
                        field => presentFields.includes(field)
                    )
                });
            }
            
            // Contar campos faltantes
            missingRequired.forEach(field => {
                analysis.missingFieldsSummary[field] = (analysis.missingFieldsSummary[field] || 0) + 1;
            });
        });
        
        return analysis;
    }

    analyzeIdPatterns(data) {
        const analysis = {
            pattern: 'UNKNOWN',
            consistency: 0,
            examples: []
        };
        
        const ids = [];
        
        // Recopilar IDs del workflow y nodos
        if (data.id) ids.push(data.id);
        if (data.versionId) ids.push(data.versionId);
        if (data.nodes) {
            data.nodes.forEach(node => {
                if (node.id) ids.push(node.id);
            });
        }
        
        if (ids.length === 0) return analysis;
        
        // Detectar patrón predominante
        const patternCounts = {};
        ids.forEach(id => {
            for (const [patternName, regex] of Object.entries(REFERENCE_STANDARDS.validIdPatterns)) {
                if (regex.test(id)) {
                    patternCounts[patternName] = (patternCounts[patternName] || 0) + 1;
                    return;
                }
            }
            patternCounts.CUSTOM = (patternCounts.CUSTOM || 0) + 1;
        });
        
        // Encontrar patrón más común
        const dominantPattern = Object.entries(patternCounts)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (dominantPattern) {
            analysis.pattern = dominantPattern[0];
            analysis.consistency = (dominantPattern[1] / ids.length) * 100;
        }
        
        analysis.examples = ids.slice(0, 3);
        return analysis;
    }

    analyzeStructuralIntegrity(data) {
        console.log('🏗️  2. ANÁLISIS DE INTEGRIDAD ESTRUCTURAL\n');
        
        // Verificar estructura básica JSON
        if (!data.nodes || !Array.isArray(data.nodes)) {
            this.results.criticalProblems.push({
                type: 'INVALID_NODES_STRUCTURE',
                message: 'Campo nodes faltante o no es array',
                severity: 'CRITICAL'
            });
        }
        
        if (!data.connections || typeof data.connections !== 'object') {
            this.results.criticalProblems.push({
                type: 'INVALID_CONNECTIONS_STRUCTURE',
                message: 'Campo connections faltante o inválido',
                severity: 'CRITICAL'
            });
        }
        
        // Verificar coherencia entre nodos y conexiones
        if (data.nodes && data.connections) {
            const nodeNames = new Set(data.nodes.map(n => n.name));
            const connectionSources = Object.keys(data.connections);
            const connectionTargets = new Set();
            
            // Recopilar todos los targets de conexiones
            connectionSources.forEach(source => {
                const connections = data.connections[source];
                if (connections.main && Array.isArray(connections.main)) {
                    connections.main.forEach(group => {
                        if (Array.isArray(group)) {
                            group.forEach(target => {
                                if (target.node) {
                                    connectionTargets.add(target.node);
                                }
                            });
                        }
                    });
                }
            });
            
            // Verificar referencias indefinidas
            const undefinedTargets = Array.from(connectionTargets).filter(target => !nodeNames.has(target));
            if (undefinedTargets.length > 0) {
                console.log(`❌ CRÍTICO: ${undefinedTargets.length} referencias a nodos indefinidos`);
                this.results.criticalProblems.push({
                    type: 'UNDEFINED_NODE_REFERENCES',
                    targets: undefinedTargets,
                    severity: 'CRITICAL'
                });
            }
            
            // Verificar fuentes indefinidas
            const undefinedSources = connectionSources.filter(source => !nodeNames.has(source));
            if (undefinedSources.length > 0) {
                console.log(`❌ CRÍTICO: ${undefinedSources.length} fuentes de conexión indefinidas`);
                this.results.criticalProblems.push({
                    type: 'UNDEFINED_SOURCE_REFERENCES',
                    sources: undefinedSources,
                    severity: 'CRITICAL'
                });
            }
            
            if (undefinedTargets.length === 0 && undefinedSources.length === 0) {
                console.log('✅ Todas las referencias de nodos son válidas');
            }
        }
    }

    detectCriticalIssues(data) {
        console.log('🚨 3. DETECCIÓN DE PROBLEMAS CRÍTICOS\n');
        
        // Detectar campos problemáticos conocidos
        let totalProblematicFields = 0;
        
        if (data.nodes) {
            data.nodes.forEach((node, index) => {
                REFERENCE_STANDARDS.problematicFields.forEach(field => {
                    if (node.hasOwnProperty(field)) {
                        totalProblematicFields++;
                        this.results.criticalProblems.push({
                            type: 'PROBLEMATIC_FIELD',
                            field: field,
                            nodeIndex: index,
                            nodeName: node.name || `Nodo_${index}`,
                            severity: 'HIGH'
                        });
                    }
                });
            });
        }
        
        if (totalProblematicFields > 0) {
            console.log(`❌ ${totalProblematicFields} campos problemáticos detectados`);
        } else {
            console.log('✅ No se detectaron campos problemáticos conocidos');
        }
    }

    validateConnectionStructure(data) {
        console.log('🔗 4. VALIDACIÓN AVANZADA DE CONEXIONES\n');
        
        if (!data.connections) return;
        
        let validConnections = 0;
        let invalidConnections = 0;
        
        Object.entries(data.connections).forEach(([source, connections]) => {
            if (connections.main && Array.isArray(connections.main)) {
                connections.main.forEach((group, groupIndex) => {
                    if (Array.isArray(group)) {
                        group.forEach((connection, connIndex) => {
                            const isValid = this.validateSingleConnection(connection);
                            if (isValid) {
                                validConnections++;
                            } else {
                                invalidConnections++;
                                this.results.structuralIssues.push({
                                    type: 'INVALID_CONNECTION_STRUCTURE',
                                    source: source,
                                    groupIndex: groupIndex,
                                    connectionIndex: connIndex,
                                    connection: connection
                                });
                            }
                        });
                    }
                });
            }
        });
        
        console.log(`✅ Conexiones válidas: ${validConnections}`);
        if (invalidConnections > 0) {
            console.log(`❌ Conexiones inválidas: ${invalidConnections}`);
        }
    }

    validateSingleConnection(connection) {
        const required = REFERENCE_STANDARDS.connectionStructure.requiredFields;
        return required.every(field => connection.hasOwnProperty(field)) &&
               REFERENCE_STANDARDS.connectionStructure.validTypes.includes(connection.type) &&
               REFERENCE_STANDARDS.connectionStructure.validIndexes.includes(connection.index);
    }

    generateEnhancedRecommendations(data) {
        console.log('💡 5. GENERANDO RECOMENDACIONES MEJORADAS\n');
        
        // Recomendaciones basadas en problemas críticos
        this.results.criticalProblems.forEach(problem => {
            switch (problem.type) {
                case 'MISSING_REQUIRED_FIELDS':
                    this.results.recommendations.push({
                        priority: 'CRITICAL',
                        action: 'ADD_REQUIRED_FIELDS',
                        description: `Agregar campos obligatorios: ${problem.fields.join(', ')}`,
                        fix: 'automatic'
                    });
                    break;
                case 'UNDEFINED_NODE_REFERENCES':
                    this.results.recommendations.push({
                        priority: 'CRITICAL',
                        action: 'FIX_UNDEFINED_REFERENCES',
                        description: `Corregir ${problem.targets.length} referencias a nodos indefinidos`,
                        fix: 'automatic'
                    });
                    break;
                case 'PROBLEMATIC_FIELD':
                    this.results.recommendations.push({
                        priority: 'HIGH',
                        action: 'REMOVE_PROBLEMATIC_FIELDS',
                        description: `Eliminar campo problemático '${problem.field}' del nodo '${problem.nodeName}'`,
                        fix: 'automatic'
                    });
                    break;
            }
        });
        
        // Recomendaciones basadas en campos faltantes
        if (this.results.missingFields.length > 0) {
            this.results.recommendations.push({
                priority: 'MEDIUM',
                action: 'ADD_RECOMMENDED_FIELDS',
                description: `Considerar agregar campos recomendados: ${this.results.missingFields.join(', ')}`,
                fix: 'manual'
            });
        }
        
        // Recomendaciones basadas en patrones de ID
        if (this.results.referenceCompliance.idPatternsScore < 80) {
            this.results.recommendations.push({
                priority: 'MEDIUM',
                action: 'STANDARDIZE_ID_PATTERNS',
                description: 'Estandarizar patrones de ID según formato UUID',
                fix: 'automatic'
            });
        }
        
        console.log(`📋 Se generaron ${this.results.recommendations.length} recomendaciones`);
    }

    createAutomaticFixes(data, workflowPath) {
        console.log('🔧 6. CREANDO FIXES AUTOMÁTICOS\n');
        
        const fixedData = JSON.parse(JSON.stringify(data)); // Deep copy
        let fixesApplied = 0;
        
        // Fix 1: Agregar campos obligatorios faltantes
        if (!fixedData.meta) {
            fixedData.meta = {};
            fixesApplied++;
        }
        if (!fixedData.meta.instanceId) {
            fixedData.meta.instanceId = this.generateInstanceId();
            fixesApplied++;
        }
        
        // Fix 2: Agregar ID del workflow si falta
        if (!fixedData.id) {
            fixedData.id = this.generateWorkflowId();
            fixesApplied++;
        }
        
        // Fix 3: Agregar versionId si falta
        if (!fixedData.versionId) {
            fixedData.versionId = this.generateUUID();
            fixesApplied++;
        }
        
        // Fix 4: Eliminar campos problemáticos
        if (fixedData.nodes) {
            fixedData.nodes.forEach(node => {
                REFERENCE_STANDARDS.problematicFields.forEach(field => {
                    if (node.hasOwnProperty(field)) {
                        delete node[field];
                        fixesApplied++;
                    }
                });
            });
        }
        
        // Fix 5: Corregir conexiones indefinidas (eliminar)
        if (fixedData.connections && fixedData.nodes) {
            const validNodeNames = new Set(fixedData.nodes.map(n => n.name));
            
            Object.keys(fixedData.connections).forEach(source => {
                if (!validNodeNames.has(source)) {
                    delete fixedData.connections[source];
                    fixesApplied++;
                    return;
                }
                
                const connections = fixedData.connections[source];
                if (connections.main) {
                    connections.main = connections.main.map(group => {
                        return group.filter(conn => {
                            const isValid = validNodeNames.has(conn.node);
                            if (!isValid) fixesApplied++;
                            return isValid;
                        });
                    }).filter(group => group.length > 0);
                }
            });
        }
        
        // Guardar versión corregida
        if (fixesApplied > 0) {
            const fixedPath = workflowPath.replace('.json', '-ENHANCED-FIXED.json');
            fs.writeFileSync(fixedPath, JSON.stringify(fixedData, null, 2));
            console.log(`✅ ${fixesApplied} fixes aplicados. Guardado en: ${path.basename(fixedPath)}`);
            
            this.results.fixes.push({
                type: 'ENHANCED_AUTO_FIX',
                fixesApplied: fixesApplied,
                outputFile: fixedPath
            });
        } else {
            console.log('ℹ️  No se requieren fixes automáticos');
        }
    }

    generateInstanceId() {
        return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    generateWorkflowId() {
        return Array.from({length: 16}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    reportResults() {
        console.log('\n📊 RESUMEN FINAL DEL ANÁLISIS MEJORADO');
        console.log('=====================================');
        
        console.log(`\n🎯 Puntuación de cumplimiento: ${this.results.referenceCompliance.overallScore?.toFixed(1)}%`);
        console.log(`🚨 Problemas críticos: ${this.results.criticalProblems.length}`);
        console.log(`⚠️  Problemas estructurales: ${this.results.structuralIssues.length}`);
        console.log(`💡 Recomendaciones: ${this.results.recommendations.length}`);
        console.log(`🔧 Fixes aplicados: ${this.results.fixes.length}`);
        
        if (this.results.criticalProblems.length > 0) {
            console.log('\n🚨 PROBLEMAS CRÍTICOS DETECTADOS:');
            this.results.criticalProblems.forEach((problem, index) => {
                console.log(`  ${index + 1}. [${problem.severity}] ${problem.type}`);
                if (problem.message) console.log(`     ${problem.message}`);
            });
        }
        
        if (this.results.recommendations.length > 0) {
            console.log('\n💡 PRINCIPALES RECOMENDACIONES:');
            this.results.recommendations.slice(0, 5).forEach((rec, index) => {
                console.log(`  ${index + 1}. [${rec.priority}] ${rec.description}`);
            });
        }
        
        // Guardar reporte completo
        const reportPath = './ENHANCED-ANALYSIS-REPORT.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Reporte completo guardado en: ${reportPath}`);
    }
}

// Función principal
async function main() {
    const workflowPath = process.argv[2];
    
    if (!workflowPath) {
        console.log('❌ Uso: node enhanced-workflow-analyzer.cjs <ruta-del-workflow>');
        console.log('\nEjemplos de archivos para analizar:');
        console.log('  - workflows problemáticos');
        console.log('  - workflows generados');
        console.log('  - workflows corregidos');
        return;
    }
    
    if (!fs.existsSync(workflowPath)) {
        console.log(`❌ Archivo no encontrado: ${workflowPath}`);
        return;
    }
    
    const analyzer = new EnhancedWorkflowAnalyzer();
    await analyzer.analyzeWorkflow(workflowPath);
}

if (require.main === module) {
    main();
}

module.exports = { EnhancedWorkflowAnalyzer, REFERENCE_STANDARDS };
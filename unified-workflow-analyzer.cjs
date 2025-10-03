/**
 * 🔬 ANALIZADOR UNIFICADO DE WORKFLOWS N8N
 * ========================================
 * 
 * Combina todos los scripts de análisis y pruebas desarrollados:
 * - Análisis diferencial entre workflows
 * - Detección de campos problemáticos
 * - Búsqueda de errores toLowerCase()
 * - Validación de estructura JSON
 * - Limpieza y reparación automática
 * - Pruebas de hipótesis
 * 
 * Uso: node unified-workflow-analyzer.cjs <ruta-del-workflow>
 */

const fs = require('fs');
const path = require('path');

class WorkflowAnalyzer {
    constructor() {
        this.results = {
            basicInfo: {},
            structureAnalysis: {},
            problematicFields: [],
            differences: [],
            recommendations: [],
            fixes: []
        };
    }

    /**
     * Análisis principal de un workflow
     */
    analyzeWorkflow(filePath) {
        console.log('🔬 ANALIZADOR UNIFICADO DE WORKFLOWS N8N');
        console.log('==========================================');
        console.log(`📁 Archivo: ${filePath}`);
        console.log(`⏰ Fecha: ${new Date().toLocaleString()}`);
        console.log('');

        // 1. Verificar existencia del archivo
        if (!fs.existsSync(filePath)) {
            console.log(`❌ ERROR: Archivo no encontrado`);
            return false;
        }

        // 2. Análisis básico
        this.performBasicAnalysis(filePath);

        // 3. Análisis de estructura
        this.performStructureAnalysis(filePath);

        // 4. Búsqueda de campos problemáticos
        this.findProblematicFields(filePath);

        // 5. Validación específica para n8n
        this.validateN8nCompatibility(filePath);

        // 6. Comparación con workflows funcionales conocidos
        this.compareWithWorkingWorkflows(filePath);

        // 7. Generar recomendaciones
        this.generateRecommendations();

        // 8. Crear versiones corregidas
        this.createFixedVersions(filePath);

        // 9. Resumen final
        this.printSummary();

        return true;
    }

    /**
     * Análisis básico del archivo
     */
    performBasicAnalysis(filePath) {
        console.log('📊 ANÁLISIS BÁSICO');
        console.log('==================');

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const workflow = JSON.parse(content);

            this.results.basicInfo = {
                fileSize: content.length,
                nodes: workflow.nodes?.length || 0,
                connections: Object.keys(workflow.connections || {}).length,
                hasSettings: !!workflow.settings,
                hasMeta: !!workflow.meta,
                hasName: !!workflow.name,
                hasActive: workflow.active !== undefined,
                topLevelKeys: Object.keys(workflow)
            };

            console.log(`📏 Tamaño del archivo: ${this.results.basicInfo.fileSize.toLocaleString()} caracteres`);
            console.log(`🔧 Nodos: ${this.results.basicInfo.nodes}`);
            console.log(`🔗 Conexiones: ${this.results.basicInfo.connections}`);
            console.log(`⚙️ Settings: ${this.results.basicInfo.hasSettings ? 'SÍ' : 'NO'}`);
            console.log(`📋 Meta: ${this.results.basicInfo.hasMeta ? 'SÍ' : 'NO'}`);
            console.log(`📝 Name: ${this.results.basicInfo.hasName ? 'SÍ' : 'NO'}`);
            console.log(`🟢 Active: ${this.results.basicInfo.hasActive ? 'SÍ' : 'NO'}`);
            console.log(`🔑 Campos principales: [${this.results.basicInfo.topLevelKeys.join(', ')}]`);

            if (workflow.meta) {
                console.log(`📋 Meta content: ${JSON.stringify(workflow.meta, null, 2)}`);
            }

        } catch (error) {
            console.log(`❌ ERROR parsing JSON: ${error.message}`);
            this.results.basicInfo.error = error.message;
        }

        console.log('');
    }

    /**
     * Análisis de estructura detallado
     */
    performStructureAnalysis(filePath) {
        console.log('🏗️ ANÁLISIS DE ESTRUCTURA');
        console.log('=========================');

        try {
            const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Analizar nodos
            if (workflow.nodes) {
                console.log(`\n🔧 ANÁLISIS DE NODOS (${workflow.nodes.length}):`);
                
                const nodeTypes = {};
                const nodeIssues = [];

                workflow.nodes.forEach((node, index) => {
                    // Contar tipos de nodos
                    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;

                    // Buscar problemas en nodos
                    const issues = this.analyzeNode(node, index);
                    if (issues.length > 0) {
                        nodeIssues.push({ index, name: node.name, issues });
                    }
                });

                console.log(`📊 Tipos de nodos:`);
                Object.entries(nodeTypes).forEach(([type, count]) => {
                    console.log(`  - ${type}: ${count}`);
                });

                if (nodeIssues.length > 0) {
                    console.log(`\n⚠️ Problemas encontrados en nodos:`);
                    nodeIssues.slice(0, 5).forEach(issue => {
                        console.log(`  Nodo ${issue.index + 1} (${issue.name}):`);
                        issue.issues.forEach(i => console.log(`    - ${i}`));
                    });
                }

                this.results.structureAnalysis.nodeTypes = nodeTypes;
                this.results.structureAnalysis.nodeIssues = nodeIssues;
            }

            // Analizar conexiones
            if (workflow.connections) {
                console.log(`\n🔗 ANÁLISIS DE CONEXIONES:`);
                this.analyzeConnections(workflow.connections);
            }

        } catch (error) {
            console.log(`❌ ERROR en análisis de estructura: ${error.message}`);
        }

        console.log('');
    }

    /**
     * Analizar un nodo individual
     */
    analyzeNode(node, index) {
        const issues = [];

        // Campos obligatorios
        if (!node.id) issues.push('Falta campo "id"');
        if (!node.name) issues.push('Falta campo "name"');
        if (!node.type) issues.push('Falta campo "type"');
        if (!node.position) issues.push('Falta campo "position"');

        // Campos problemáticos conocidos
        if (node.originalId !== undefined) issues.push('Tiene campo "originalId" problemático');
        if (node.nodeId !== undefined) issues.push('Tiene campo "nodeId" problemático');

        // Valores undefined o null
        Object.entries(node).forEach(([key, value]) => {
            if (value === undefined) issues.push(`Campo "${key}" es undefined`);
            if (value === null) issues.push(`Campo "${key}" es null`);
        });

        // Posición válida
        if (node.position && (!Array.isArray(node.position) || node.position.length !== 2)) {
            issues.push('Posición inválida');
        }

        return issues;
    }

    /**
     * Analizar conexiones
     */
    analyzeConnections(connections) {
        const connectionCount = Object.keys(connections).length;
        const totalConnections = Object.values(connections).reduce((sum, conns) => {
            return sum + Object.values(conns).reduce((s, outputs) => s + outputs.length, 0);
        }, 0);

        console.log(`  - Nodos con conexiones: ${connectionCount}`);
        console.log(`  - Total de conexiones: ${totalConnections}`);

        // Verificar conexiones inválidas
        const invalidConnections = [];
        Object.entries(connections).forEach(([fromNode, outputs]) => {
            Object.entries(outputs).forEach(([outputType, targetList]) => {
                targetList.forEach((target, index) => {
                    if (!target.node) invalidConnections.push(`${fromNode} -> undefined node`);
                    if (!target.type) invalidConnections.push(`${fromNode} -> ${target.node}: sin tipo`);
                });
            });
        });

        if (invalidConnections.length > 0) {
            console.log(`  ⚠️ Conexiones inválidas encontradas: ${invalidConnections.length}`);
            invalidConnections.slice(0, 3).forEach(conn => {
                console.log(`    - ${conn}`);
            });
        }

        this.results.structureAnalysis.connections = {
            nodeCount: connectionCount,
            totalCount: totalConnections,
            invalid: invalidConnections
        };
    }

    /**
     * Buscar campos problemáticos
     */
    findProblematicFields(filePath) {
        console.log('🎯 BÚSQUEDA DE CAMPOS PROBLEMÁTICOS');
        console.log('====================================');

        try {
            const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Campos conocidos que causan problemas
            const problematicFieldNames = [
                'originalId', 'nodeId', 'sourceId', 'targetId', 
                'workflowId', 'executionId', 'userId'
            ];

            const found = this.searchProblematicFields(workflow, '', problematicFieldNames);
            this.results.problematicFields = found;

            console.log(`🔍 Campos problemáticos encontrados: ${found.length}`);
            
            if (found.length > 0) {
                console.log(`\n📋 LISTA DE CAMPOS PROBLEMÁTICOS:`);
                found.slice(0, 10).forEach(item => {
                    console.log(`  ${item.severity} ${item.path}: ${JSON.stringify(item.value)} (${item.type})`);
                    if (item.reason) console.log(`      Razón: ${item.reason}`);
                });

                if (found.length > 10) {
                    console.log(`  ... y ${found.length - 10} más`);
                }
            } else {
                console.log(`✅ No se encontraron campos problemáticos conocidos`);
            }

        } catch (error) {
            console.log(`❌ ERROR buscando campos problemáticos: ${error.message}`);
        }

        console.log('');
    }

    /**
     * Búsqueda recursiva de campos problemáticos
     */
    searchProblematicFields(obj, path = '', problematicNames = []) {
        const found = [];

        if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;

                // Verificar nombres problemáticos
                const isProblematicName = problematicNames.some(name => 
                    key.toLowerCase().includes(name.toLowerCase())
                );

                if (isProblematicName) {
                    found.push({
                        path: currentPath,
                        key: key,
                        value: value,
                        type: typeof value,
                        severity: '🚨',
                        reason: 'Nombre de campo conocido problemático'
                    });
                }

                // Verificar valores undefined o null
                if (value === undefined || value === null) {
                    found.push({
                        path: currentPath,
                        key: key,
                        value: value,
                        type: 'undefined/null',
                        severity: '⚠️',
                        reason: 'Valor undefined/null que podría causar toLowerCase()'
                    });
                }

                // Verificar strings vacíos que podrían causar problemas
                if (value === '') {
                    found.push({
                        path: currentPath,
                        key: key,
                        value: value,
                        type: 'empty string',
                        severity: '⚡',
                        reason: 'String vacío que podría causar problemas'
                    });
                }

                // Búsqueda recursiva
                if (typeof value === 'object') {
                    found.push(...this.searchProblematicFields(value, currentPath, problematicNames));
                }
            }
        }

        return found;
    }

    /**
     * Validación específica para n8n
     */
    validateN8nCompatibility(filePath) {
        console.log('✅ VALIDACIÓN COMPATIBILIDAD N8N');
        console.log('=================================');

        try {
            const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            const checks = [
                {
                    name: 'Estructura básica',
                    check: () => workflow.nodes && workflow.connections,
                    fix: 'Agregar campos nodes y connections'
                },
                {
                    name: 'Campo meta presente',
                    check: () => !!workflow.meta,
                    fix: 'Agregar campo meta con información del template'
                },
                {
                    name: 'Nodos tienen IDs únicos',
                    check: () => {
                        const ids = workflow.nodes?.map(n => n.id) || [];
                        return ids.length === new Set(ids).size;
                    },
                    fix: 'Regenerar IDs únicos para nodos duplicados'
                },
                {
                    name: 'Tipos de nodos válidos',
                    check: () => {
                        return workflow.nodes?.every(node => 
                            node.type && node.type.startsWith('n8n-nodes-')
                        ) || false;
                    },
                    fix: 'Verificar y corregir tipos de nodos'
                },
                {
                    name: 'Posiciones válidas',
                    check: () => {
                        return workflow.nodes?.every(node => 
                            Array.isArray(node.position) && node.position.length === 2
                        ) || false;
                    },
                    fix: 'Corregir posiciones de nodos'
                },
                {
                    name: 'Sin campos problemáticos',
                    check: () => this.results.problematicFields.length === 0,
                    fix: 'Remover campos problemáticos encontrados'
                }
            ];

            console.log(`📋 RESULTADOS DE VALIDACIÓN:`);
            checks.forEach(check => {
                const passed = check.check();
                const status = passed ? '✅' : '❌';
                console.log(`  ${status} ${check.name}`);
                if (!passed) {
                    console.log(`      🔧 Fix: ${check.fix}`);
                }
            });

            this.results.validationChecks = checks;

        } catch (error) {
            console.log(`❌ ERROR en validación: ${error.message}`);
        }

        console.log('');
    }

    /**
     * Comparar con workflows que funcionan
     */
    compareWithWorkingWorkflows(filePath) {
        console.log('🔄 COMPARACIÓN CON WORKFLOWS FUNCIONALES');
        console.log('=========================================');

        // Buscar workflows funcionales conocidos
        const workingWorkflows = [
            'workflow-masivo-gemini-1757337804197-FIXED-V2.json',
            'workflow-masivo-gemini-1757337804197-MINIMAL.json'
        ];

        const baseDir = path.dirname(filePath);
        
        workingWorkflows.forEach(workingFile => {
            const workingPath = path.join(baseDir, workingFile);
            if (fs.existsSync(workingPath)) {
                console.log(`\n📊 Comparando con ${workingFile}:`);
                this.compareWorkflows(filePath, workingPath);
            }
        });

        console.log('');
    }

    /**
     * Comparar dos workflows
     */
    compareWorkflows(problemFile, workingFile) {
        try {
            const problem = JSON.parse(fs.readFileSync(problemFile, 'utf8'));
            const working = JSON.parse(fs.readFileSync(workingFile, 'utf8'));

            // Comparar campos de nivel superior
            const problemKeys = Object.keys(problem);
            const workingKeys = Object.keys(working);

            const missingInProblem = workingKeys.filter(key => !problemKeys.includes(key));
            const extraInProblem = problemKeys.filter(key => !workingKeys.includes(key));

            if (missingInProblem.length > 0) {
                console.log(`  ❌ Faltan campos: [${missingInProblem.join(', ')}]`);
            }
            if (extraInProblem.length > 0) {
                console.log(`  ➕ Campos extra: [${extraInProblem.join(', ')}]`);
            }

            // Comparar estadísticas básicas
            console.log(`  📊 Nodos: ${problem.nodes?.length || 0} vs ${working.nodes?.length || 0}`);
            console.log(`  🔗 Conexiones: ${Object.keys(problem.connections || {}).length} vs ${Object.keys(working.connections || {}).length}`);

        } catch (error) {
            console.log(`  ❌ Error comparando: ${error.message}`);
        }
    }

    /**
     * Generar recomendaciones
     */
    generateRecommendations() {
        console.log('💡 RECOMENDACIONES');
        console.log('==================');

        const recommendations = [];

        // Recomendaciones basadas en el análisis
        if (!this.results.basicInfo.hasMeta) {
            recommendations.push({
                priority: 'ALTA',
                issue: 'Falta campo meta',
                solution: 'Agregar campo meta con templateCreatedBy, timestamp, etc.',
                reason: 'Campo meta es requerido para compatibilidad n8n'
            });
        }

        if (this.results.problematicFields.length > 0) {
            recommendations.push({
                priority: 'ALTA',
                issue: `${this.results.problematicFields.length} campos problemáticos`,
                solution: 'Remover campos originalId, nodeId y valores undefined/null',
                reason: 'Estos campos causan el error toLowerCase()'
            });
        }

        if (this.results.structureAnalysis.nodeIssues?.length > 0) {
            recommendations.push({
                priority: 'MEDIA',
                issue: `${this.results.structureAnalysis.nodeIssues.length} nodos con problemas`,
                solution: 'Corregir campos faltantes en nodos',
                reason: 'Nodos mal formados pueden causar errores de importación'
            });
        }

        if (recommendations.length === 0) {
            console.log('✅ No se encontraron problemas mayores en el workflow');
        } else {
            recommendations.forEach((rec, index) => {
                console.log(`\n${index + 1}. [${rec.priority}] ${rec.issue}`);
                console.log(`   🔧 Solución: ${rec.solution}`);
                console.log(`   📝 Razón: ${rec.reason}`);
            });
        }

        this.results.recommendations = recommendations;
        console.log('');
    }

    /**
     * Crear versiones corregidas
     */
    createFixedVersions(filePath) {
        console.log('🔧 CREANDO VERSIONES CORREGIDAS');
        console.log('================================');

        try {
            const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const baseName = path.basename(filePath, '.json');
            const baseDir = path.dirname(filePath);

            // Versión 1: Agregar meta si falta
            if (!workflow.meta) {
                const withMeta = {
                    ...workflow,
                    meta: {
                        templateCreatedBy: "n8n-ai-assistant",
                        fixedBy: "unified-analyzer",
                        timestamp: new Date().toISOString(),
                        originalFile: path.basename(filePath)
                    }
                };

                const metaPath = path.join(baseDir, `${baseName}-ANALYZED-WITH-META.json`);
                fs.writeFileSync(metaPath, JSON.stringify(withMeta, null, 2));
                console.log(`✅ Creado: ${path.basename(metaPath)}`);
                this.results.fixes.push({ type: 'meta', path: metaPath });
            }

            // Versión 2: Limpieza completa
            const cleaned = this.deepCleanWorkflow(workflow);
            const cleanedPath = path.join(baseDir, `${baseName}-ANALYZED-CLEAN.json`);
            fs.writeFileSync(cleanedPath, JSON.stringify(cleaned, null, 2));
            console.log(`✅ Creado: ${path.basename(cleanedPath)}`);
            this.results.fixes.push({ type: 'clean', path: cleanedPath });

            // Versión 3: Limpieza + meta
            if (!cleaned.meta) {
                cleaned.meta = {
                    templateCreatedBy: "n8n-ai-assistant",
                    fixedBy: "unified-analyzer-complete",
                    timestamp: new Date().toISOString(),
                    originalFile: path.basename(filePath),
                    fixes: ['removed_problematic_fields', 'added_meta', 'cleaned_undefined_values']
                };
            }

            const completePath = path.join(baseDir, `${baseName}-ANALYZED-COMPLETE.json`);
            fs.writeFileSync(completePath, JSON.stringify(cleaned, null, 2));
            console.log(`✅ Creado: ${path.basename(completePath)}`);
            this.results.fixes.push({ type: 'complete', path: completePath });

        } catch (error) {
            console.log(`❌ Error creando versiones corregidas: ${error.message}`);
        }

        console.log('');
    }

    /**
     * Limpieza profunda del workflow
     */
    deepCleanWorkflow(workflow) {
        const cleaned = JSON.parse(JSON.stringify(workflow));

        // Campos problemáticos a remover
        const problematicFields = ['originalId', 'nodeId', 'sourceId', 'targetId', 'workflowId'];

        function cleanObject(obj) {
            if (typeof obj === 'object' && obj !== null) {
                if (Array.isArray(obj)) {
                    return obj.map(cleanObject);
                } else {
                    const cleanedObj = {};
                    for (const [key, value] of Object.entries(obj)) {
                        // Saltar campos problemáticos
                        if (problematicFields.includes(key)) {
                            continue;
                        }
                        
                        // Saltar valores undefined o null
                        if (value === undefined || value === null) {
                            continue;
                        }

                        // Limpiar recursivamente
                        cleanedObj[key] = cleanObject(value);
                    }
                    return cleanedObj;
                }
            }
            return obj;
        }

        return cleanObject(cleaned);
    }

    /**
     * Resumen final
     */
    printSummary() {
        console.log('📋 RESUMEN FINAL');
        console.log('================');

        console.log(`\n📊 ESTADÍSTICAS:`);
        console.log(`  - Nodos: ${this.results.basicInfo.nodes}`);
        console.log(`  - Conexiones: ${this.results.basicInfo.connections}`);
        console.log(`  - Campos problemáticos: ${this.results.problematicFields.length}`);
        console.log(`  - Recomendaciones: ${this.results.recommendations.length}`);
        console.log(`  - Versiones corregidas: ${this.results.fixes.length}`);

        console.log(`\n🎯 DIAGNÓSTICO:`);
        if (this.results.recommendations.length === 0) {
            console.log(`  ✅ El workflow parece estar en buen estado`);
        } else {
            const highPriority = this.results.recommendations.filter(r => r.priority === 'ALTA');
            if (highPriority.length > 0) {
                console.log(`  🚨 ${highPriority.length} problemas de alta prioridad detectados`);
            }
            console.log(`  ⚠️ Requiere corrección antes de importar a n8n`);
        }

        console.log(`\n🔧 PRÓXIMOS PASOS:`);
        if (this.results.fixes.length > 0) {
            console.log(`  1. Probar importar las versiones corregidas en n8n:`);
            this.results.fixes.forEach(fix => {
                console.log(`     - ${path.basename(fix.path)} (${fix.type})`);
            });
            console.log(`  2. Verificar que la importación sea exitosa`);
            console.log(`  3. Si funciona, usar esa versión como template base`);
        } else {
            console.log(`  1. El workflow no necesita correcciones adicionales`);
            console.log(`  2. Probar importar directamente en n8n`);
        }

        console.log(`\n🌐 n8n Server: http://localhost:5678`);
        console.log('');
    }
}

// Función principal
function main() {
    const analyzer = new WorkflowAnalyzer();
    
    // Obtener archivo del argumento o usar por defecto
    const targetFile = process.argv[2] || './generated-workflows/workflow-masivo-gemini-1757337804197.json';
    
    console.log(`🎯 Analizando: ${targetFile}`);
    console.log(''.padEnd(80, '='));
    
    const success = analyzer.analyzeWorkflow(targetFile);
    
    if (success) {
        console.log('🎉 Análisis completado exitosamente');
    } else {
        console.log('💥 Error durante el análisis');
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { WorkflowAnalyzer };
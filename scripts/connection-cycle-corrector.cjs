/**
 * 🔧 ANALIZADOR Y CORRECTOR DE CONEXIONES CÍCLICAS
 * =================================================
 * 
 * Detecta y corrige conexiones hacia atrás que crean ciclos infinitos
 * en workflows n8n. Estas conexiones son problemáticas porque:
 * 
 * 1. Crean ciclos de ejecución infinitos
 * 2. Causan errores de toLowerCase() por referencias circulares
 * 3. Hacen el workflow impredecible y no ejecutable
 */

const fs = require('fs');
const path = require('path');

class ConnectionAnalyzer {
    constructor() {
        this.nodeMap = new Map();
        this.cycles = [];
        this.backwardConnections = [];
        this.validConnections = [];
    }

    analyzeWorkflow(filePath) {
        console.log('🔍 ANALIZADOR DE CONEXIONES CÍCLICAS');
        console.log('====================================');
        console.log(`📁 Archivo: ${filePath}`);
        console.log('');

        const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // 1. Mapear todos los nodos
        this.mapNodes(workflow.nodes);
        
        // 2. Analizar conexiones
        this.analyzeConnections(workflow.connections);
        
        // 3. Detectar ciclos
        this.detectCycles(workflow.connections);
        
        // 4. Generar versión corregida
        this.generateCorrectedWorkflow(workflow, filePath);
        
        // 5. Resumen
        this.printSummary();
    }

    mapNodes(nodes) {
        console.log('📊 MAPEANDO NODOS');
        console.log('=================');
        
        nodes.forEach((node, index) => {
            this.nodeMap.set(node.name, {
                id: node.id,
                name: node.name,
                type: node.type,
                position: node.position,
                index: index
            });
        });
        
        console.log(`✅ ${nodes.length} nodos mapeados`);
        console.log('');
    }

    analyzeConnections(connections) {
        console.log('🔗 ANALIZANDO CONEXIONES');
        console.log('========================');
        
        let totalConnections = 0;
        let suspiciousConnections = 0;
        
        Object.entries(connections).forEach(([fromNode, outputs]) => {
            const fromNodeInfo = this.nodeMap.get(fromNode);
            
            if (!fromNodeInfo) {
                console.log(`⚠️ Nodo origen no encontrado: ${fromNode}`);
                return;
            }
            
            Object.entries(outputs).forEach(([outputType, targets]) => {
                targets.forEach(target => {
                    totalConnections++;
                    const toNodeInfo = this.nodeMap.get(target.node);
                    
                    if (!toNodeInfo) {
                        console.log(`⚠️ Nodo destino no encontrado: ${target.node}`);
                        return;
                    }
                    
                    // Detectar conexiones hacia atrás (posibles ciclos)
                    if (toNodeInfo.index < fromNodeInfo.index) {
                        suspiciousConnections++;
                        this.backwardConnections.push({
                            from: fromNode,
                            to: target.node,
                            fromIndex: fromNodeInfo.index,
                            toIndex: toNodeInfo.index,
                            outputType: outputType
                        });
                        
                        console.log(`🚨 CONEXIÓN HACIA ATRÁS: ${fromNode} (${fromNodeInfo.index}) → ${target.node} (${toNodeInfo.index})`);
                    } else {
                        this.validConnections.push({
                            from: fromNode,
                            to: target.node,
                            fromIndex: fromNodeInfo.index,
                            toIndex: toNodeInfo.index,
                            outputType: outputType
                        });
                    }
                });
            });
        });
        
        console.log(`📊 Total conexiones: ${totalConnections}`);
        console.log(`🚨 Conexiones sospechosas (hacia atrás): ${suspiciousConnections}`);
        console.log(`✅ Conexiones válidas (hacia adelante): ${this.validConnections.length}`);
        console.log('');
        
        if (suspiciousConnections > 0) {
            console.log('🎯 CONEXIONES PROBLEMÁTICAS DETECTADAS:');
            this.backwardConnections.slice(0, 10).forEach(conn => {
                console.log(`  ❌ ${conn.from} → ${conn.to} (índices: ${conn.fromIndex} → ${conn.toIndex})`);
            });
            if (this.backwardConnections.length > 10) {
                console.log(`  ... y ${this.backwardConnections.length - 10} más`);
            }
            console.log('');
        }
    }

    detectCycles(connections) {
        console.log('🔄 DETECTANDO CICLOS');
        console.log('====================');
        
        const visited = new Set();
        const recursionStack = new Set();
        const cycles = [];
        
        const dfs = (node, path = []) => {
            if (recursionStack.has(node)) {
                // Ciclo detectado
                const cycleStart = path.indexOf(node);
                const cycle = path.slice(cycleStart);
                cycles.push(cycle);
                return true;
            }
            
            if (visited.has(node)) {
                return false;
            }
            
            visited.add(node);
            recursionStack.add(node);
            path.push(node);
            
            const nodeConnections = connections[node];
            if (nodeConnections) {
                Object.values(nodeConnections).forEach(outputList => {
                    outputList.forEach(target => {
                        if (target.node) {
                            dfs(target.node, [...path]);
                        }
                    });
                });
            }
            
            recursionStack.delete(node);
            return false;
        };
        
        // Buscar ciclos desde cada nodo
        Object.keys(connections).forEach(node => {
            if (!visited.has(node)) {
                dfs(node);
            }
        });
        
        this.cycles = cycles;
        
        if (cycles.length > 0) {
            console.log(`🚨 ${cycles.length} CICLOS DETECTADOS:`);
            cycles.forEach((cycle, index) => {
                console.log(`  Ciclo ${index + 1}: ${cycle.join(' → ')} → ${cycle[0]}`);
            });
        } else {
            console.log('✅ No se detectaron ciclos');
        }
        console.log('');
    }

    generateCorrectedWorkflow(workflow, originalPath) {
        console.log('🔧 GENERANDO WORKFLOW CORREGIDO');
        console.log('===============================');
        
        // Crear copia del workflow
        const corrected = JSON.parse(JSON.stringify(workflow));
        
        // Reconstruir conexiones eliminando las problemáticas
        const newConnections = {};
        
        Object.entries(workflow.connections).forEach(([fromNode, outputs]) => {
            const cleanedOutputs = {};
            
            Object.entries(outputs).forEach(([outputType, targets]) => {
                const cleanedTargets = targets.filter(target => {
                    // Filtrar conexiones hacia atrás
                    const isBackward = this.backwardConnections.some(bc => 
                        bc.from === fromNode && bc.to === target.node
                    );
                    
                    if (isBackward) {
                        console.log(`  ❌ Eliminando conexión: ${fromNode} → ${target.node}`);
                        return false;
                    }
                    return true;
                });
                
                if (cleanedTargets.length > 0) {
                    cleanedOutputs[outputType] = cleanedTargets;
                }
            });
            
            if (Object.keys(cleanedOutputs).length > 0) {
                newConnections[fromNode] = cleanedOutputs;
            }
        });
        
        corrected.connections = newConnections;
        
        // Agregar meta con información de la corrección
        corrected.meta = {
            templateCreatedBy: "n8n-ai-assistant",
            fixedBy: "connection-cycle-corrector",
            timestamp: new Date().toISOString(),
            originalFile: path.basename(originalPath),
            fixes: [
                "removed_backward_connections",
                "eliminated_cycles",
                "fixed_connection_logic"
            ],
            statistics: {
                originalConnections: this.backwardConnections.length + this.validConnections.length,
                removedBackwardConnections: this.backwardConnections.length,
                finalConnections: this.validConnections.length,
                cyclesDetected: this.cycles.length
            }
        };
        
        // Guardar archivo corregido
        const baseName = path.basename(originalPath, '.json');
        const baseDir = path.dirname(originalPath);
        const outputPath = path.join(baseDir, `${baseName}-CONNECTIONS-FIXED.json`);
        
        fs.writeFileSync(outputPath, JSON.stringify(corrected, null, 2));
        
        console.log(`✅ Workflow corregido guardado: ${path.basename(outputPath)}`);
        console.log(`📊 Conexiones eliminadas: ${this.backwardConnections.length}`);
        console.log(`📊 Conexiones mantenidas: ${this.validConnections.length}`);
        console.log('');
        
        return outputPath;
    }

    printSummary() {
        console.log('📋 RESUMEN DE CORRECCIÓN');
        console.log('========================');
        console.log(`🔗 Total conexiones analizadas: ${this.backwardConnections.length + this.validConnections.length}`);
        console.log(`❌ Conexiones problemáticas eliminadas: ${this.backwardConnections.length}`);
        console.log(`✅ Conexiones válidas mantenidas: ${this.validConnections.length}`);
        console.log(`🔄 Ciclos detectados: ${this.cycles.length}`);
        console.log('');
        
        if (this.backwardConnections.length > 0) {
            console.log('🎯 PRINCIPALES PROBLEMAS CORREGIDOS:');
            console.log('1. Eliminadas conexiones hacia atrás que creaban ciclos');
            console.log('2. Simplificada la lógica de ejecución del workflow');
            console.log('3. Garantizada ejecución secuencial y predecible');
            console.log('');
        }
        
        console.log('🚀 PRÓXIMOS PASOS:');
        console.log('1. Probar el workflow corregido en n8n');
        console.log('2. Verificar que la lógica de negocio siga siendo correcta');
        console.log('3. Ajustar manualmente si faltan conexiones importantes');
        console.log('');
    }

    // Método para analizar un nodo específico
    analyzeSpecificNode(workflow, nodeName) {
        console.log(`🔍 ANÁLISIS ESPECÍFICO: ${nodeName}`);
        console.log('==============================');
        
        const connections = workflow.connections[nodeName];
        if (!connections) {
            console.log('❌ El nodo no tiene conexiones');
            return;
        }
        
        Object.entries(connections).forEach(([outputType, targets]) => {
            console.log(`📤 Salida ${outputType}: ${targets.length} conexiones`);
            targets.forEach((target, index) => {
                const toNodeInfo = this.nodeMap.get(target.node);
                const fromNodeInfo = this.nodeMap.get(nodeName);
                
                const direction = toNodeInfo && fromNodeInfo && toNodeInfo.index < fromNodeInfo.index ? 
                    '🚨 HACIA ATRÁS' : '✅ HACIA ADELANTE';
                
                console.log(`  ${index + 1}. → ${target.node} ${direction}`);
            });
        });
        console.log('');
    }
}

function main() {
    const analyzer = new ConnectionAnalyzer();
    
    // Archivo a analizar
    const targetFile = process.argv[2] || './generated-workflows/workflow-masivo-gemini-1757337804197-ANALYZED-COMPLETE.json';
    
    console.log(`🎯 Analizando conexiones en: ${targetFile}`);
    console.log(''.padEnd(80, '='));
    
    try {
        analyzer.analyzeWorkflow(targetFile);
        
        // Análisis específico del nodo problemático mencionado
        const workflow = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        analyzer.analyzeSpecificNode(workflow, 'Final_Code_Cleanup');
        
        console.log('🎉 Análisis y corrección completados exitosamente');
        
    } catch (error) {
        console.log(`💥 Error durante el análisis: ${error.message}`);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { ConnectionAnalyzer };
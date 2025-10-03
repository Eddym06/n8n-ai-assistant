/**
 * 🚨 CORRECTOR ESPECÍFICO DE CONEXIONES INVÁLIDAS
 * ===============================================
 * 
 * Corrige el problema específico donde nodos finales tienen conexiones
 * hacia múltiples nodos anteriores, creando ciclos y lógica impredecible.
 */

const fs = require('fs');
const path = require('path');

function fixInvalidConnections(filePath) {
    console.log('🚨 CORRECTOR DE CONEXIONES INVÁLIDAS');
    console.log('====================================');
    console.log(`📁 Archivo: ${filePath}`);
    console.log('');

    const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Mapear todos los nodos por nombre para validación
    const nodeNames = new Set(workflow.nodes.map(node => node.name));
    
    console.log(`📊 Nodos disponibles: ${nodeNames.size}`);
    console.log('');
    
    // Analizar y corregir conexiones
    const originalConnections = JSON.parse(JSON.stringify(workflow.connections));
    const fixedConnections = {};
    
    let totalConnections = 0;
    let invalidConnections = 0;
    let fixedConnectionsCount = 0;
    
    Object.entries(workflow.connections).forEach(([fromNode, outputs]) => {
        console.log(`🔍 Analizando nodo: ${fromNode}`);
        
        const validOutputs = {};
        
        Object.entries(outputs).forEach(([outputType, targets]) => {
            console.log(`  📤 Salida ${outputType}: ${targets.length} conexiones`);
            
            const validTargets = [];
            
            targets.forEach((target, index) => {
                totalConnections++;
                
                // Verificar si el nodo destino existe
                if (!target.node || target.node === 'undefined' || !nodeNames.has(target.node)) {
                    invalidConnections++;
                    console.log(`    ❌ ${index + 1}. → ${target.node || 'undefined'} (NODO INVÁLIDO)`);
                    return;
                }
                
                // Verificar si es una conexión lógica (no hacia atrás en el flujo)
                if (fromNode === 'Final_Code_Cleanup') {
                    // Para nodos finales, solo permitir conexiones a otros nodos finales
                    if (target.node.startsWith('Final_')) {
                        validTargets.push(target);
                        fixedConnectionsCount++;
                        console.log(`    ✅ ${index + 1}. → ${target.node} (VÁLIDA - nodo final)`);
                    } else {
                        invalidConnections++;
                        console.log(`    🚨 ${index + 1}. → ${target.node} (ELIMINADA - conexión hacia atrás)`);
                    }
                } else {
                    // Para otros nodos, mantener solo si el destino existe
                    validTargets.push(target);
                    fixedConnectionsCount++;
                    console.log(`    ✅ ${index + 1}. → ${target.node} (VÁLIDA)`);
                }
            });
            
            if (validTargets.length > 0) {
                validOutputs[outputType] = validTargets;
            }
        });
        
        if (Object.keys(validOutputs).length > 0) {
            fixedConnections[fromNode] = validOutputs;
        }
        
        console.log('');
    });
    
    // Aplicar las conexiones corregidas
    workflow.connections = fixedConnections;
    
    // Actualizar meta con información de la corrección
    workflow.meta = {
        ...workflow.meta,
        fixedBy: "invalid-connections-corrector",
        timestamp: new Date().toISOString(),
        connectionFixes: {
            totalOriginalConnections: totalConnections,
            invalidConnectionsRemoved: invalidConnections,
            validConnectionsKept: fixedConnectionsCount,
            mainIssueFixed: "Final_Code_Cleanup backward connections eliminated"
        }
    };
    
    // Guardar archivo corregido
    const baseName = path.basename(filePath, '.json');
    const baseDir = path.dirname(filePath);
    const outputPath = path.join(baseDir, `${baseName}-INVALID-CONNECTIONS-FIXED.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
    
    console.log('📊 RESUMEN DE CORRECCIÓN');
    console.log('========================');
    console.log(`🔗 Total conexiones originales: ${totalConnections}`);
    console.log(`❌ Conexiones inválidas eliminadas: ${invalidConnections}`);
    console.log(`✅ Conexiones válidas mantenidas: ${fixedConnectionsCount}`);
    console.log('');
    console.log(`✅ Archivo corregido guardado: ${path.basename(outputPath)}`);
    console.log('');
    
    // Mostrar algunas conexiones específicas corregidas
    if (workflow.connections['Final_Code_Cleanup']) {
        console.log('🎯 CONEXIONES FINALES DE Final_Code_Cleanup:');
        const finalConnections = workflow.connections['Final_Code_Cleanup'];
        Object.entries(finalConnections).forEach(([outputType, targets]) => {
            console.log(`  📤 ${outputType}:`);
            targets.forEach((target, index) => {
                console.log(`    ${index + 1}. → ${target.node}`);
            });
        });
    } else {
        console.log('🎯 Final_Code_Cleanup: Sin conexiones de salida (correcto para nodo final)');
    }
    
    console.log('');
    console.log('🚀 PRÓXIMOS PASOS:');
    console.log('1. Probar este archivo corregido en n8n');
    console.log('2. El error toLowerCase() debería estar resuelto');
    console.log('3. Verificar que la lógica del workflow siga siendo correcta');
    
    return outputPath;
}

// Función para verificar un workflow después de la corrección
function verifyWorkflow(filePath) {
    console.log('\n🔍 VERIFICACIÓN POST-CORRECCIÓN');
    console.log('===============================');
    
    const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const nodeNames = new Set(workflow.nodes.map(node => node.name));
    
    let allValid = true;
    let totalConnections = 0;
    
    Object.entries(workflow.connections).forEach(([fromNode, outputs]) => {
        if (!nodeNames.has(fromNode)) {
            console.log(`❌ Nodo origen inválido: ${fromNode}`);
            allValid = false;
        }
        
        Object.values(outputs).forEach(targets => {
            targets.forEach(target => {
                totalConnections++;
                if (!nodeNames.has(target.node)) {
                    console.log(`❌ Nodo destino inválido: ${fromNode} → ${target.node}`);
                    allValid = false;
                }
            });
        });
    });
    
    if (allValid) {
        console.log(`✅ Todas las ${totalConnections} conexiones son válidas`);
        console.log('✅ El workflow está listo para importar en n8n');
    } else {
        console.log('❌ Todavía hay conexiones inválidas');
    }
    
    return allValid;
}

function main() {
    const targetFile = process.argv[2] || './generated-workflows/workflow-masivo-gemini-1757337804197-ANALYZED-COMPLETE.json';
    
    console.log(`🎯 Corrigiendo conexiones inválidas en: ${targetFile}`);
    console.log(''.padEnd(80, '='));
    
    try {
        const fixedFile = fixInvalidConnections(targetFile);
        const isValid = verifyWorkflow(fixedFile);
        
        if (isValid) {
            console.log('\n🎉 Corrección completada exitosamente');
            console.log(`📁 Archivo final: ${path.basename(fixedFile)}`);
        } else {
            console.log('\n⚠️ Corrección parcial - revisar manualmente');
        }
        
    } catch (error) {
        console.log(`💥 Error durante la corrección: ${error.message}`);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { fixInvalidConnections, verifyWorkflow };
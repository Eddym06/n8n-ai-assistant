const fs = require('fs');
const path = require('path');

/**
 * ANALIZADOR COMPARATIVO AVANZADO V2.0
 * Compara estructuras entre flujos funcionales de referencia y problemáticos
 */

async function performAdvancedComparison() {
    console.log('=== ANÁLISIS COMPARATIVO AVANZADO V2.0 ===\n');
    
    // Archivos a analizar
    const referenceFile = './workflows/Wait/1312_Wait_Schedule_Create_Webhook.json';
    const functionalFiles = [
        './generated-workflows/workflow-TEST-MINIMAL-FINAL.json',
        './generated-workflows/workflow-empresarial-FUNCIONAL-FINAL.json',
        './generated-workflows/workflow-ADVANCED-TEST-V2.json',
        './generated-workflows/workflow-ENTERPRISE-V2.json',
        './generated-workflows/workflow-SECURITY-SYSTEM-V2.json'
    ];
    
    try {
        console.log('📋 Leyendo flujo de referencia funcional...');
        const referenceData = JSON.parse(fs.readFileSync(referenceFile, 'utf8'));
        
        console.log('📊 ANÁLISIS DEL FLUJO DE REFERENCIA');
        console.log('=====================================');
        
        // Estructura general del flujo de referencia
        const refStructure = analyzeWorkflowStructure(referenceData, 'REFERENCIA');
        
        console.log('\n📊 ANÁLISIS DE FLUJOS FUNCIONALES GENERADOS');
        console.log('=============================================');
        
        const generatedStructures = [];
        for (const file of functionalFiles) {
            if (fs.existsSync(file)) {
                console.log(`\n--- Analizando: ${file} ---`);
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                const structure = analyzeWorkflowStructure(data, path.basename(file));
                generatedStructures.push({ file, structure });
            } else {
                console.log(`⚠️  Archivo no encontrado: ${file}`);
            }
        }
        
        console.log('\n🔍 COMPARACIÓN ESTRUCTURAL DETALLADA');
        console.log('=====================================');
        
        // Comparar cada flujo generado con la referencia
        for (const { file, structure } of generatedStructures) {
            console.log(`\n### COMPARANDO: ${path.basename(file)} vs REFERENCIA ###`);
            compareStructures(refStructure, structure);
        }
        
        console.log('\n📈 RECOMENDACIONES DE MEJORA');
        console.log('=============================');
        generateImprovementRecommendations(refStructure, generatedStructures);
        
        // Guardar análisis completo
        const analysis = {
            timestamp: new Date().toISOString(),
            reference: {
                file: referenceFile,
                structure: refStructure
            },
            generated: generatedStructures.map(({ file, structure }) => ({
                file,
                structure
            })),
            improvements: generateDetailedImprovements(refStructure, generatedStructures)
        };
        
        fs.writeFileSync('./ADVANCED-COMPARATIVE-ANALYSIS.json', JSON.stringify(analysis, null, 2));
        console.log('\n✅ Análisis completo guardado en ADVANCED-COMPARATIVE-ANALYSIS.json');
        
    } catch (error) {
        console.error('❌ Error durante el análisis:', error.message);
    }
}

function analyzeWorkflowStructure(data, label) {
    console.log(`\n📊 Estructura de ${label}:`);
    
    const structure = {
        // Propiedades principales
        rootProperties: Object.keys(data),
        hasId: !!data.id,
        hasMeta: !!data.meta,
        hasName: !!data.name,
        hasTags: !!data.tags,
        hasSettings: !!data.settings,
        hasVersionId: !!data.versionId,
        
        // Meta información
        metaFields: data.meta ? Object.keys(data.meta) : [],
        instanceId: data.meta?.instanceId || null,
        
        // Análisis de nodos
        nodeCount: data.nodes?.length || 0,
        nodeTypes: {},
        nodeFields: new Set(),
        nodeIdPattern: null,
        hasDisabledNodes: false,
        hasNotesInFlow: false,
        hasCredentials: false,
        
        // Análisis de conexiones
        connectionCount: 0,
        connectionStructure: {},
        orphanNodes: [],
        connectionTargetPattern: null,
        
        // Validaciones específicas
        hasOriginalIdFields: false,
        hasUndefinedReferences: false,
        hasBackwardConnections: false
    };
    
    // Analizar nodos
    if (data.nodes) {
        console.log(`  - Nodos: ${data.nodes.length}`);
        
        data.nodes.forEach(node => {
            // Campos de nodo
            Object.keys(node).forEach(key => structure.nodeFields.add(key));
            
            // Tipos de nodo
            if (node.type) {
                structure.nodeTypes[node.type] = (structure.nodeTypes[node.type] || 0) + 1;
            }
            
            // Patrones de ID
            if (node.id && !structure.nodeIdPattern) {
                structure.nodeIdPattern = detectIdPattern(node.id);
            }
            
            // Verificaciones específicas
            if (node.disabled) structure.hasDisabledNodes = true;
            if (node.notesInFlow) structure.hasNotesInFlow = true;
            if (node.credentials) structure.hasCredentials = true;
            if (node.originalId) structure.hasOriginalIdFields = true;
        });
        
        structure.nodeFields = Array.from(structure.nodeFields);
    }
    
    // Analizar conexiones
    if (data.connections) {
        const connections = data.connections;
        structure.connectionCount = Object.keys(connections).length;
        
        console.log(`  - Conexiones: ${structure.connectionCount}`);
        
        // Analizar estructura de conexiones
        for (const [sourceNode, targets] of Object.entries(connections)) {
            if (targets.main && Array.isArray(targets.main)) {
                targets.main.forEach((targetGroup, groupIndex) => {
                    if (Array.isArray(targetGroup)) {
                        targetGroup.forEach(target => {
                            if (target.node) {
                                // Detectar patrón de conexión
                                if (!structure.connectionTargetPattern) {
                                    structure.connectionTargetPattern = {
                                        hasType: !!target.type,
                                        hasIndex: typeof target.index === 'number',
                                        exampleTarget: target
                                    };
                                }
                                
                                // Verificar si el nodo de destino existe
                                const targetExists = data.nodes?.some(n => n.name === target.node);
                                if (!targetExists) {
                                    structure.hasUndefinedReferences = true;
                                }
                            }
                        });
                    }
                });
            }
        }
        
        // Encontrar nodos huérfanos
        const connectedNodes = new Set();
        Object.keys(connections).forEach(source => connectedNodes.add(source));
        Object.values(connections).forEach(targets => {
            if (targets.main) {
                targets.main.forEach(group => {
                    if (Array.isArray(group)) {
                        group.forEach(target => {
                            if (target.node) connectedNodes.add(target.node);
                        });
                    }
                });
            }
        });
        
        if (data.nodes) {
            structure.orphanNodes = data.nodes
                .filter(node => !connectedNodes.has(node.name))
                .map(node => node.name);
        }
    }
    
    // Mostrar resumen
    console.log(`  - Tipos de nodo únicos: ${Object.keys(structure.nodeTypes).length}`);
    console.log(`  - Nodos huérfanos: ${structure.orphanNodes.length}`);
    console.log(`  - Patrón ID: ${structure.nodeIdPattern}`);
    console.log(`  - Referencias indefinidas: ${structure.hasUndefinedReferences}`);
    console.log(`  - Campos originalId: ${structure.hasOriginalIdFields}`);
    
    return structure;
}

function detectIdPattern(id) {
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) {
        return 'UUID';
    } else if (/^[a-zA-Z0-9]{16,}$/.test(id)) {
        return 'AlphaNumeric';
    } else if (/^\d+$/.test(id)) {
        return 'Numeric';
    } else {
        return 'Custom';
    }
}

function compareStructures(reference, generated) {
    console.log('\n🔍 Diferencias encontradas:');
    
    // Comparar propiedades principales
    const missingProps = reference.rootProperties.filter(p => !generated.rootProperties.includes(p));
    const extraProps = generated.rootProperties.filter(p => !reference.rootProperties.includes(p));
    
    if (missingProps.length > 0) {
        console.log(`  ❌ Propiedades faltantes: ${missingProps.join(', ')}`);
    }
    if (extraProps.length > 0) {
        console.log(`  ➕ Propiedades extra: ${extraProps.join(', ')}`);
    }
    
    // Comparar meta campos
    const missingMetaFields = reference.metaFields.filter(f => !generated.metaFields.includes(f));
    if (missingMetaFields.length > 0) {
        console.log(`  ❌ Meta campos faltantes: ${missingMetaFields.join(', ')}`);
    }
    
    // Comparar campos de nodo
    const missingNodeFields = reference.nodeFields.filter(f => !generated.nodeFields.includes(f));
    const extraNodeFields = generated.nodeFields.filter(f => !reference.nodeFields.includes(f));
    
    if (missingNodeFields.length > 0) {
        console.log(`  ❌ Campos de nodo faltantes: ${missingNodeFields.join(', ')}`);
    }
    if (extraNodeFields.length > 0) {
        console.log(`  ⚠️  Campos de nodo extra: ${extraNodeFields.join(', ')}`);
    }
    
    // Comparar patrones
    console.log(`  🆔 Patrón ID - Referencia: ${reference.nodeIdPattern}, Generado: ${generated.nodeIdPattern}`);
    
    // Problemas específicos
    if (generated.hasOriginalIdFields && !reference.hasOriginalIdFields) {
        console.log(`  ❌ PROBLEMA: Tiene campos originalId que la referencia no tiene`);
    }
    
    if (generated.hasUndefinedReferences && !reference.hasUndefinedReferences) {
        console.log(`  ❌ PROBLEMA CRÍTICO: Tiene referencias indefinidas`);
    }
    
    if (generated.orphanNodes.length > reference.orphanNodes.length) {
        console.log(`  ⚠️  Más nodos huérfanos que la referencia`);
    }
}

function generateImprovementRecommendations(reference, generatedStructures) {
    console.log('\n📋 Recomendaciones específicas:');
    
    generatedStructures.forEach(({ file, structure }) => {
        console.log(`\n### Para ${path.basename(file)}:`);
        
        // Recomendaciones basadas en la comparación
        if (!structure.hasId && reference.hasId) {
            console.log('  1. ➕ Agregar campo "id" único al workflow');
        }
        
        if (!structure.hasMeta && reference.hasMeta) {
            console.log('  2. ➕ Agregar campo "meta" con instanceId');
        }
        
        if (!structure.hasVersionId && reference.hasVersionId) {
            console.log('  3. ➕ Agregar campo "versionId"');
        }
        
        if (structure.nodeIdPattern !== reference.nodeIdPattern) {
            console.log(`  4. 🔧 Cambiar patrón de IDs de nodos de ${structure.nodeIdPattern} a ${reference.nodeIdPattern}`);
        }
        
        if (structure.hasOriginalIdFields) {
            console.log('  5. ❌ CRÍTICO: Eliminar todos los campos "originalId"');
        }
        
        if (structure.hasUndefinedReferences) {
            console.log('  6. ❌ CRÍTICO: Corregir referencias a nodos indefinidos');
        }
        
        if (structure.orphanNodes.length > 0) {
            console.log(`  7. 🔗 Conectar nodos huérfanos: ${structure.orphanNodes.join(', ')}`);
        }
        
        // Recomendaciones de campos faltantes
        const missingFields = reference.nodeFields.filter(f => !structure.nodeFields.includes(f));
        if (missingFields.length > 0) {
            console.log(`  8. ➕ Considerar agregar campos: ${missingFields.join(', ')}`);
        }
    });
}

function generateDetailedImprovements(reference, generatedStructures) {
    return {
        requiredFields: {
            workflow: ['id', 'meta', 'name', 'nodes', 'connections'],
            meta: reference.metaFields,
            nodes: reference.nodeFields
        },
        idPatterns: {
            workflow: 'AlphaNumeric (16+ chars)',
            nodes: reference.nodeIdPattern,
            versionId: 'UUID format'
        },
        criticalFixes: [
            'Remove all originalId fields',
            'Fix undefined node references',
            'Ensure all connections point to existing nodes',
            'Add proper meta.instanceId'
        ],
        structuralImprovements: [
            'Match reference connection structure',
            'Use consistent node naming',
            'Add proper typeVersion fields',
            'Include settings.executionOrder'
        ]
    };
}

// Ejecutar análisis
performAdvancedComparison();
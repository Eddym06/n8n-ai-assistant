/**
 * Análisis diferencial entre FIXED-V2 (funciona) y ULTRA-CLEAN (no funciona)
 * Identifica exactamente qué campos causan el error toLowerCase()
 */

const fs = require('fs');

function analyzeWorkflowDifferences() {
    const fixedPath = './generated-workflows/workflow-masivo-gemini-1757337804197-FIXED-V2.json';
    const ultraCleanPath = './generated-workflows/workflow-masivo-gemini-1757337804197-ULTRA-CLEAN.json';
    
    console.log('🔍 ANÁLISIS DIFERENCIAL: FIXED-V2 vs ULTRA-CLEAN');
    console.log('================================================');
    
    // Cargar archivos
    const fixed = JSON.parse(fs.readFileSync(fixedPath, 'utf8'));
    const ultraClean = JSON.parse(fs.readFileSync(ultraCleanPath, 'utf8'));
    
    console.log(`📊 ESTADÍSTICAS BÁSICAS:`);
    console.log(`FIXED-V2:`);
    console.log(`  - Nodos: ${fixed.nodes?.length || 0}`);
    console.log(`  - Conexiones: ${Object.keys(fixed.connections || {}).length}`);
    console.log(`  - Tamaño archivo: ${JSON.stringify(fixed).length} caracteres`);
    
    console.log(`ULTRA-CLEAN:`);
    console.log(`  - Nodos: ${ultraClean.nodes?.length || 0}`);
    console.log(`  - Conexiones: ${Object.keys(ultraClean.connections || {}).length}`);
    console.log(`  - Tamaño archivo: ${JSON.stringify(ultraClean).length} caracteres`);
    
    // Comparar estructura de nivel superior
    console.log(`\n🏗️ ESTRUCTURA DE NIVEL SUPERIOR:`);
    const fixedKeys = Object.keys(fixed);
    const ultraCleanKeys = Object.keys(ultraClean);
    
    console.log(`FIXED-V2 keys: [${fixedKeys.join(', ')}]`);
    console.log(`ULTRA-CLEAN keys: [${ultraCleanKeys.join(', ')}]`);
    
    const missingInFixed = ultraCleanKeys.filter(key => !fixedKeys.includes(key));
    const missingInUltraClean = fixedKeys.filter(key => !ultraCleanKeys.includes(key));
    
    if (missingInFixed.length > 0) {
        console.log(`❌ Faltan en FIXED-V2: [${missingInFixed.join(', ')}]`);
    }
    if (missingInUltraClean.length > 0) {
        console.log(`❌ Faltan en ULTRA-CLEAN: [${missingInUltraClean.join(', ')}]`);
    }
    
    // Analizar diferencias en nodos
    console.log(`\n🔧 ANÁLISIS DE NODOS:`);
    analyzeNodes(fixed.nodes || [], ultraClean.nodes || []);
    
    // Analizar diferencias en conexiones
    console.log(`\n🔗 ANÁLISIS DE CONEXIONES:`);
    analyzeConnections(fixed.connections || {}, ultraClean.connections || {});
    
    // Buscar campos problemáticos que podrían causar toLowerCase()
    console.log(`\n🎯 BÚSQUEDA DE CAMPOS PROBLEMÁTICOS:`);
    findProblematicFields(fixed, ultraClean);
}

function analyzeNodes(fixedNodes, ultraCleanNodes) {
    console.log(`Total nodos - FIXED: ${fixedNodes.length}, ULTRA-CLEAN: ${ultraCleanNodes.length}`);
    
    if (fixedNodes.length !== ultraCleanNodes.length) {
        console.log(`⚠️ DIFERENCIA EN CANTIDAD DE NODOS!`);
        return;
    }
    
    // Comparar nodos uno por uno
    for (let i = 0; i < Math.min(fixedNodes.length, ultraCleanNodes.length); i++) {
        const fixed = fixedNodes[i];
        const ultraClean = ultraCleanNodes[i];
        
        // Comparar campos principales
        const differences = [];
        
        if (fixed.id !== ultraClean.id) differences.push(`id: "${fixed.id}" vs "${ultraClean.id}"`);
        if (fixed.name !== ultraClean.name) differences.push(`name: "${fixed.name}" vs "${ultraClean.name}"`);
        if (fixed.type !== ultraClean.type) differences.push(`type: "${fixed.type}" vs "${ultraClean.type}"`);
        
        // Comparar campos extra
        const fixedKeys = Object.keys(fixed);
        const ultraCleanKeys = Object.keys(ultraClean);
        
        const extraInFixed = fixedKeys.filter(key => !ultraCleanKeys.includes(key));
        const extraInUltraClean = ultraCleanKeys.filter(key => !fixedKeys.includes(key));
        
        if (extraInFixed.length > 0 || extraInUltraClean.length > 0 || differences.length > 0) {
            console.log(`\n  Nodo ${i + 1} (${fixed.name || 'Sin nombre'}):`);
            
            if (differences.length > 0) {
                console.log(`    📝 Diferencias: ${differences.join(', ')}`);
            }
            
            if (extraInFixed.length > 0) {
                console.log(`    ➕ Extra en FIXED: [${extraInFixed.join(', ')}]`);
                extraInFixed.forEach(key => {
                    console.log(`      ${key}: ${JSON.stringify(fixed[key])}`);
                });
            }
            
            if (extraInUltraClean.length > 0) {
                console.log(`    ➖ Extra en ULTRA-CLEAN: [${extraInUltraClean.join(', ')}]`);
                extraInUltraClean.forEach(key => {
                    console.log(`      ${key}: ${JSON.stringify(ultraClean[key])}`);
                });
            }
        }
    }
}

function analyzeConnections(fixedConnections, ultraCleanConnections) {
    const fixedNodeNames = Object.keys(fixedConnections);
    const ultraCleanNodeNames = Object.keys(ultraCleanConnections);
    
    console.log(`Nodos con conexiones - FIXED: ${fixedNodeNames.length}, ULTRA-CLEAN: ${ultraCleanNodeNames.length}`);
    
    const missingInFixed = ultraCleanNodeNames.filter(name => !fixedNodeNames.includes(name));
    const missingInUltraClean = fixedNodeNames.filter(name => !ultraCleanNodeNames.includes(name));
    
    if (missingInFixed.length > 0) {
        console.log(`❌ Conexiones faltantes en FIXED: [${missingInFixed.join(', ')}]`);
    }
    if (missingInUltraClean.length > 0) {
        console.log(`❌ Conexiones faltantes en ULTRA-CLEAN: [${missingInUltraClean.join(', ')}]`);
    }
}

function findProblematicFields(fixed, ultraClean) {
    console.log(`Buscando campos que podrían causar error toLowerCase()...`);
    
    // Campos conocidos que causan problemas
    const problematicFields = ['originalId', 'nodeId', 'sourceId', 'targetId'];
    
    function searchInObject(obj, path = '') {
        const found = [];
        
        if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;
                
                // Buscar campos problemáticos
                if (problematicFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
                    found.push({
                        path: currentPath,
                        key: key,
                        value: value,
                        type: typeof value
                    });
                }
                
                // Buscar valores undefined o null que podrían causar toLowerCase
                if (value === undefined || value === null) {
                    found.push({
                        path: currentPath,
                        key: key,
                        value: value,
                        type: 'undefined/null',
                        warning: '⚠️ Valor undefined/null que podría causar toLowerCase()'
                    });
                }
                
                // Buscar recursivamente
                if (typeof value === 'object') {
                    found.push(...searchInObject(value, currentPath));
                }
            }
        }
        
        return found;
    }
    
    const fixedProblematic = searchInObject(fixed);
    const ultraCleanProblematic = searchInObject(ultraClean);
    
    console.log(`\n📋 CAMPOS PROBLEMÁTICOS EN FIXED-V2 (${fixedProblematic.length}):`);
    fixedProblematic.slice(0, 10).forEach(item => {
        console.log(`  ${item.path}: ${JSON.stringify(item.value)} (${item.type}) ${item.warning || ''}`);
    });
    
    console.log(`\n📋 CAMPOS PROBLEMÁTICOS EN ULTRA-CLEAN (${ultraCleanProblematic.length}):`);
    ultraCleanProblematic.slice(0, 10).forEach(item => {
        console.log(`  ${item.path}: ${JSON.stringify(item.value)} (${item.type}) ${item.warning || ''}`);
    });
    
    // Encontrar diferencias
    const fixedPaths = new Set(fixedProblematic.map(item => item.path));
    const ultraCleanPaths = new Set(ultraCleanProblematic.map(item => item.path));
    
    const onlyInUltraClean = ultraCleanProblematic.filter(item => !fixedPaths.has(item.path));
    const onlyInFixed = fixedProblematic.filter(item => !ultraCleanPaths.has(item.path));
    
    if (onlyInUltraClean.length > 0) {
        console.log(`\n🎯 CAMPOS PROBLEMÁTICOS SOLO EN ULTRA-CLEAN (posible causa del error):`);
        onlyInUltraClean.slice(0, 5).forEach(item => {
            console.log(`  ❌ ${item.path}: ${JSON.stringify(item.value)} (${item.type})`);
        });
    }
    
    if (onlyInFixed.length > 0) {
        console.log(`\n✅ CAMPOS PROBLEMÁTICOS SOLO EN FIXED-V2:`);
        onlyInFixed.slice(0, 5).forEach(item => {
            console.log(`  ${item.path}: ${JSON.stringify(item.value)} (${item.type})`);
        });
    }
}

// Ejecutar análisis
if (require.main === module) {
    analyzeWorkflowDifferences();
}

module.exports = { analyzeWorkflowDifferences };
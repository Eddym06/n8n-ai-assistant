const fs = require('fs');
const path = require('path');

// Leer el flujo problemático
const problematicFile = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757337804197.json';

console.log('🔍 Buscando valores undefined que causan toLowerCase()...');

function findUndefinedValues(obj, path = '') {
    const issues = [];
    
    if (obj === null || obj === undefined) {
        issues.push(`${path}: ${obj}`);
        return issues;
    }
    
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            issues.push(...findUndefinedValues(item, `${path}[${index}]`));
        });
    } else if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            
            if (value === null || value === undefined) {
                issues.push(`${currentPath}: ${value}`);
            } else if (typeof value === 'object') {
                issues.push(...findUndefinedValues(value, currentPath));
            }
        });
    }
    
    return issues;
}

function deepCleanWorkflow(workflow) {
    // Función recursiva para limpiar valores undefined/null
    function cleanValue(value) {
        if (value === null || value === undefined) {
            return '';
        }
        if (Array.isArray(value)) {
            return value.map(cleanValue).filter(v => v !== '');
        }
        if (typeof value === 'object') {
            const cleaned = {};
            Object.keys(value).forEach(key => {
                const cleanedValue = cleanValue(value[key]);
                if (cleanedValue !== '' && cleanedValue !== null && cleanedValue !== undefined) {
                    cleaned[key] = cleanedValue;
                }
            });
            return cleaned;
        }
        return value;
    }
    
    return cleanValue(workflow);
}

try {
    const workflow = JSON.parse(fs.readFileSync(problematicFile, 'utf8'));
    
    console.log('📊 Estadísticas del flujo:');
    console.log(`  • Nodos: ${workflow.nodes ? workflow.nodes.length : 0}`);
    console.log(`  • Conexiones: ${workflow.connections ? Object.keys(workflow.connections).length : 0}`);
    
    // Buscar valores undefined
    const undefinedIssues = findUndefinedValues(workflow);
    
    if (undefinedIssues.length > 0) {
        console.log('\n🚨 Valores undefined/null encontrados:');
        undefinedIssues.slice(0, 20).forEach(issue => console.log(`  • ${issue}`));
        if (undefinedIssues.length > 20) {
            console.log(`  ... y ${undefinedIssues.length - 20} más`);
        }
    } else {
        console.log('\n✅ No se encontraron valores undefined/null');
    }
    
    // Limpiar el workflow
    console.log('\n🛠️ Aplicando limpieza profunda...');
    
    const cleanedWorkflow = deepCleanWorkflow(workflow);
    
    // Validaciones adicionales específicas para n8n
    if (cleanedWorkflow.nodes) {
        cleanedWorkflow.nodes.forEach((node, index) => {
            // Asegurar que type sea string válido
            if (!node.type || typeof node.type !== 'string') {
                node.type = 'n8n-nodes-base.noOp';
            }
            
            // Asegurar que name sea string válido
            if (!node.name || typeof node.name !== 'string') {
                node.name = `Node_${index}`;
            }
            
            // Asegurar ID único y válido
            if (!node.id || typeof node.id !== 'string') {
                node.id = `node-${index}-${Date.now()}`;
            }
            
            // Remover campos problemáticos
            delete node.originalId;
            delete node.disabled; // A veces causa problemas
            
            // Asegurar parámetros válidos
            if (!node.parameters || typeof node.parameters !== 'object') {
                node.parameters = {};
            }
            
            // Limpiar parámetros recursivamente
            function cleanParameters(params) {
                if (typeof params !== 'object' || params === null) return {};
                
                const cleaned = {};
                Object.keys(params).forEach(key => {
                    const value = params[key];
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object' && !Array.isArray(value)) {
                            cleaned[key] = cleanParameters(value);
                        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || Array.isArray(value)) {
                            cleaned[key] = value;
                        }
                    }
                });
                return cleaned;
            }
            
            node.parameters = cleanParameters(node.parameters);
            
            // Asegurar typeVersion
            if (typeof node.typeVersion !== 'number') {
                node.typeVersion = 1;
            }
            
            // Asegurar position
            if (!Array.isArray(node.position) || node.position.length !== 2) {
                node.position = [100 + (index * 200), 100];
            }
        });
    }
    
    // Limpiar conexiones
    if (cleanedWorkflow.connections) {
        const validConnections = {};
        const nodeNames = new Set(cleanedWorkflow.nodes.map(n => n.name));
        
        Object.keys(cleanedWorkflow.connections).forEach(sourceName => {
            if (nodeNames.has(sourceName)) {
                const connections = cleanedWorkflow.connections[sourceName];
                if (connections.main && Array.isArray(connections.main)) {
                    const validMain = connections.main.map(group => {
                        if (Array.isArray(group)) {
                            return group.filter(conn => 
                                conn && 
                                typeof conn.node === 'string' && 
                                nodeNames.has(conn.node)
                            );
                        }
                        return [];
                    }).filter(group => group.length > 0);
                    
                    if (validMain.length > 0) {
                        validConnections[sourceName] = { main: validMain };
                    }
                }
            }
        });
        
        cleanedWorkflow.connections = validConnections;
    }
    
    // Asegurar settings
    cleanedWorkflow.settings = cleanedWorkflow.settings || {};
    
    // Guardar versión ultra-limpia
    const ultraCleanFile = problematicFile.replace('.json', '-ULTRA-CLEAN.json');
    fs.writeFileSync(ultraCleanFile, JSON.stringify(cleanedWorkflow, null, 2));
    
    console.log(`\n✅ Flujo ultra-limpio guardado como: ${path.basename(ultraCleanFile)}`);
    console.log('\n📋 Correcciones aplicadas:');
    console.log('  • Valores undefined/null removidos');
    console.log('  • Campos originalId eliminados');
    console.log('  • Parámetros validados y limpiados');
    console.log('  • Conexiones validadas');
    console.log('  • Estructura completamente normalizada');
    
    console.log('\n🎯 Intenta importar el archivo -ULTRA-CLEAN.json en n8n');
    
} catch (error) {
    console.error('❌ Error procesando el archivo:', error.message);
    console.error('Stack trace:', error.stack);
}
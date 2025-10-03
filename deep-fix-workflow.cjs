const fs = require('fs');
const path = require('path');

// Leer el flujo problemático
const problematicFile = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\generated-workflows\\workflow-masivo-gemini-1757337804197.json';

console.log('🔧 Diagnosticando error de toLowerCase()...');

try {
    const workflow = JSON.parse(fs.readFileSync(problematicFile, 'utf8'));
    
    console.log('📊 Analizando estructura del flujo...');
    
    const issues = [];
    const fixedNodes = [];
    
    // Verificar cada nodo
    workflow.nodes.forEach((node, index) => {
        const nodeIssues = [];
        
        // Verificar campos requeridos
        if (typeof node.type !== 'string') {
            nodeIssues.push(`Tipo de nodo inválido: ${typeof node.type}`);
            node.type = 'n8n-nodes-base.noOp'; // Valor por defecto
        }
        
        if (typeof node.name !== 'string') {
            nodeIssues.push(`Nombre de nodo inválido: ${typeof node.name}`);
            node.name = `Node_${index}`; // Valor por defecto
        }
        
        if (typeof node.id !== 'string') {
            nodeIssues.push(`ID de nodo inválido: ${typeof node.id}`);
            node.id = `node-${index}-${Date.now()}`; // Generar ID único
        }
        
        // Verificar posición
        if (!Array.isArray(node.position) || node.position.length !== 2) {
            nodeIssues.push(`Posición inválida`);
            node.position = [100 + (index * 200), 100]; // Posición por defecto
        }
        
        // Verificar parámetros
        if (typeof node.parameters !== 'object' || node.parameters === null) {
            nodeIssues.push(`Parámetros inválidos`);
            node.parameters = {}; // Objeto vacío por defecto
        }
        
        // Verificar typeVersion
        if (typeof node.typeVersion !== 'number') {
            nodeIssues.push(`TypeVersion inválido`);
            node.typeVersion = 1; // Versión por defecto
        }
        
        // Limpiar campos problemáticos
        delete node.originalId;
        
        if (nodeIssues.length > 0) {
            issues.push(`Nodo ${index} (${node.name}): ${nodeIssues.join(', ')}`);
            fixedNodes.push(index);
        }
    });
    
    // Verificar conexiones
    const connectionIssues = [];
    if (workflow.connections && typeof workflow.connections === 'object') {
        Object.keys(workflow.connections).forEach(sourceNodeName => {
            // Verificar que el nodo fuente existe
            const sourceExists = workflow.nodes.find(n => n.name === sourceNodeName);
            if (!sourceExists) {
                connectionIssues.push(`Nodo fuente inexistente: ${sourceNodeName}`);
                delete workflow.connections[sourceNodeName];
                return;
            }
            
            const connections = workflow.connections[sourceNodeName];
            if (connections.main && Array.isArray(connections.main)) {
                connections.main.forEach((connectionGroup, groupIndex) => {
                    if (Array.isArray(connectionGroup)) {
                        connectionGroup.forEach((conn, connIndex) => {
                            if (typeof conn.node !== 'string') {
                                connectionIssues.push(`Conexión inválida desde ${sourceNodeName}`);
                                // Remover conexión inválida
                                connectionGroup.splice(connIndex, 1);
                            } else {
                                // Verificar que el nodo destino existe
                                const targetExists = workflow.nodes.find(n => n.name === conn.node);
                                if (!targetExists) {
                                    connectionIssues.push(`Nodo destino inexistente: ${conn.node}`);
                                    connectionGroup.splice(connIndex, 1);
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    
    console.log('\n🚨 Problemas encontrados:');
    if (issues.length > 0) {
        console.log('📦 Nodos con problemas:');
        issues.forEach(issue => console.log(`  • ${issue}`));
    }
    
    if (connectionIssues.length > 0) {
        console.log('🔗 Conexiones con problemas:');
        connectionIssues.forEach(issue => console.log(`  • ${issue}`));
    }
    
    if (issues.length === 0 && connectionIssues.length === 0) {
        console.log('✅ No se encontraron problemas específicos');
    }
    
    // Asegurar estructura mínima
    const fixedWorkflow = {
        nodes: workflow.nodes,
        connections: workflow.connections || {},
        settings: workflow.settings || {},
        meta: {
            templateCreatedBy: 'n8n-ai-assistant',
            fixedBy: 'toLowerCase-fix-script',
            timestamp: new Date().toISOString()
        }
    };
    
    // Guardar versión corregida
    const fixedFile = problematicFile.replace('.json', '-FIXED-V2.json');
    fs.writeFileSync(fixedFile, JSON.stringify(fixedWorkflow, null, 2));
    
    console.log(`\n✅ Flujo corregido guardado como: ${path.basename(fixedFile)}`);
    console.log('\n📋 Correcciones aplicadas:');
    console.log(`  • ${fixedNodes.length} nodos corregidos`);
    console.log(`  • ${connectionIssues.length} conexiones limpiadas`);
    console.log('  • Campos originalId removidos');
    console.log('  • Estructura normalizada');
    console.log('  • Valores por defecto añadidos');
    
    console.log('\n🎯 Intenta importar el archivo -FIXED-V2.json en n8n');
    
} catch (error) {
    console.error('❌ Error procesando el archivo:', error.message);
    
    if (error.message.includes('JSON')) {
        console.log('\n💡 El archivo JSON parece estar corrupto. Verificando...');
        
        try {
            const content = fs.readFileSync(problematicFile, 'utf8');
            console.log(`📄 Tamaño del archivo: ${content.length} caracteres`);
            console.log(`🔤 Primeros 200 caracteres:`);
            console.log(content.substring(0, 200));
            console.log(`🔤 Últimos 200 caracteres:`);
            console.log(content.substring(content.length - 200));
        } catch (readError) {
            console.error('❌ No se puede leer el archivo:', readError.message);
        }
    }
}
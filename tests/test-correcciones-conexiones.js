import dotenv from 'dotenv';
import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';

dotenv.config();

console.log('🔧 PRUEBA DE CORRECCIONES DE CONEXIONES');
console.log('==========================================');

async function testConnectionCorrections() {
    try {
        const v4Ultra = new V4UltraHybridSystem();
        
        // Prompt simple para test
        const testPrompt = "crear un flujo simple que lea emails y los procese";
        
        console.log('📝 Prompt de prueba:', testPrompt);
        console.log('');
        
        // Generar workflow
        console.log('🔄 Generando workflow...');
        const result = await v4Ultra.generateWorkflow(testPrompt);
        
        if (result.success) {
            console.log('✅ Workflow generado exitosamente');
            console.log('📊 Calidad:', result.workflow.quality || 'No especificada');
            
            // Analizar estructura
            const workflow = result.workflow;
            console.log('');
            console.log('🔍 ANÁLISIS DE ESTRUCTURA:');
            console.log('- Nodos:', workflow.nodes.length);
            console.log('- Objeto connections:', Object.keys(workflow.connections).length, 'entradas');
            
            // Verificar que las conexiones usen IDs
            console.log('');
            console.log('🔗 VERIFICACIÓN DE CONEXIONES:');
            
            const nodeIds = new Set(workflow.nodes.map(n => n.id));
            const nodeNames = new Set(workflow.nodes.map(n => n.name));
            
            console.log('- IDs de nodos:', Array.from(nodeIds).slice(0, 3).join(', '), '...');
            console.log('- Nombres de nodos:', Array.from(nodeNames).slice(0, 3).join(', '), '...');
            
            let correctConnections = 0;
            let totalConnections = 0;
            
            for (const [sourceId, connections] of Object.entries(workflow.connections)) {
                totalConnections++;
                
                // Verificar que sourceId sea un ID válido y no un nombre
                if (nodeIds.has(sourceId)) {
                    correctConnections++;
                    console.log(`✅ Conexión fuente válida: ${sourceId} (ID)`);
                } else if (nodeNames.has(sourceId)) {
                    console.log(`❌ Conexión usa nombre: ${sourceId} (debería ser ID)`);
                } else {
                    console.log(`⚠️ Conexión fuente no encontrada: ${sourceId}`);
                }
                
                // Verificar conexiones de destino
                if (connections.main) {
                    for (const conn of connections.main) {
                        if (Array.isArray(conn) && conn.length > 0) {
                            const targetId = conn[0].node;
                            if (nodeIds.has(targetId)) {
                                console.log(`  ✅ Destino válido: ${targetId} (ID)`);
                            } else if (nodeNames.has(targetId)) {
                                console.log(`  ❌ Destino usa nombre: ${targetId} (debería ser ID)`);
                            } else {
                                console.log(`  ⚠️ Destino no encontrado: ${targetId}`);
                            }
                        }
                    }
                }
            }
            
            console.log('');
            console.log('📊 RESULTADO:');
            console.log(`- Conexiones correctas: ${correctConnections}/${totalConnections}`);
            console.log(`- Porcentaje de éxito: ${totalConnections > 0 ? ((correctConnections/totalConnections)*100).toFixed(1) : 0}%`);
            
            // Guardar para análisis posterior
            const filename = `test-conexiones-${Date.now()}.json`;
            const fs = await import('fs');
            fs.writeFileSync(filename, JSON.stringify(workflow, null, 2));
            console.log(`💾 Workflow guardado como: ${filename}`);
            
        } else {
            console.log('❌ Error generando workflow:', result.error);
        }
        
    } catch (error) {
        console.error('💥 Error en la prueba:', error.message);
        console.error(error.stack);
    }
}

testConnectionCorrections();
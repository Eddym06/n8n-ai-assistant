const ExtensionServer = require('./extension-server-OFICIAL.js');

async function testCurrentWorkflow() {
    console.log('🔍 TESTING CURRENT WORKFLOW...');
    
    const server = new ExtensionServer();
    
    // Obtener el currentWorkflow después de la generación
    if (server.currentWorkflow) {
        const workflow = JSON.parse(server.currentWorkflow);
        console.log(`📊 Nodos en currentWorkflow: ${workflow.nodes?.length || 0}`);
        console.log(`🔗 Conexiones en currentWorkflow: ${Object.keys(workflow.connections || {}).length}`);
        
        // Mostrar los primeros 5 nodos
        console.log('\n🏷️ Primeros 5 nodos:');
        workflow.nodes?.slice(0, 5).forEach((node, i) => {
            console.log(`   ${i+1}. ${node.name} (${node.type})`);
        });
        
        // Guardar el workflow real
        const fs = require('fs');
        const path = require('path');
        
        const workflowDir = path.join(process.cwd(), 'generated-workflows');
        const realFilename = `workflow-REAL-${Date.now()}.json`;
        const realPath = path.join(workflowDir, realFilename);
        
        fs.writeFileSync(realPath, server.currentWorkflow);
        console.log(`\n✅ Workflow real guardado en: ${realFilename}`);
        
    } else {
        console.log('❌ No hay currentWorkflow disponible');
    }
}

testCurrentWorkflow().catch(console.error);
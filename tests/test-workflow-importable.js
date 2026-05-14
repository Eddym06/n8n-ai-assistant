import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';

async function testWorkflowImportable() {
    console.log('🎯 PRUEBA DE WORKFLOW IMPORTABLE EN N8N\n');

    const v4System = new V4UltraHybridSystem();

    // Prompt simple para verificar formato
    const promptSimple = `
        Crear un workflow que:
        - Reciba un webhook
        - Procese los datos con una función
        - Envíe email de confirmación
        - Notifique por Slack
    `;

    try {
        console.log('📋 Generando workflow importable...\n');
        
        const resultado = await v4System.generateWorkflow(promptSimple);
        
        console.log('\n🎉 RESULTADO:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log(`📁 Archivo principal: ${resultado.filename}`);
        console.log(`📊 Archivo metadata: ${resultado.filename.replace('.json', '-metadata.json')}`);
        
        // Verificar estructura del archivo generado
        const fs = await import('fs');
        const path = await import('path');
        const workflowPath = path.default.join(process.cwd(), 'generated-workflows', resultado.filename);
        
        if (fs.default.existsSync(workflowPath)) {
            const workflowContent = JSON.parse(fs.default.readFileSync(workflowPath, 'utf8'));
            
            console.log(`\n🔍 VERIFICACIÓN DE ESTRUCTURA N8N:`);
            console.log(`   ✅ Propiedad 'name': ${workflowContent.name ? '✓' : '✗'}`);
            console.log(`   ✅ Propiedad 'nodes': ${Array.isArray(workflowContent.nodes) ? '✓' : '✗'}`);
            console.log(`   ✅ Propiedad 'connections': ${workflowContent.connections ? '✓' : '✗'}`);
            console.log(`   ✅ Propiedad 'active': ${typeof workflowContent.active === 'boolean' ? '✓' : '✗'}`);
            console.log(`   ✅ Propiedad 'settings': ${workflowContent.settings ? '✓' : '✗'}`);
            
            console.log(`\n📊 CONTENIDO DEL WORKFLOW:`);
            console.log(`   • Nodos: ${workflowContent.nodes?.length || 0}`);
            console.log(`   • Conexiones: ${Object.keys(workflowContent.connections || {}).length}`);
            console.log(`   • Nombre: ${workflowContent.name}`);
            
            // Verificar si tiene la estructura correcta para importar
            const esImportable = workflowContent.name && 
                                Array.isArray(workflowContent.nodes) && 
                                workflowContent.connections &&
                                typeof workflowContent.active === 'boolean';
                                
            console.log(`\n🎯 RESULTADO FINAL:`);
            if (esImportable) {
                console.log(`   🚀 ¡WORKFLOW IMPORTABLE EN N8N!`);
                console.log(`   📥 Puede importarse directamente usando "Import from File"`);
                console.log(`   📁 Ubicación: generated-workflows/${resultado.filename}`);
            } else {
                console.log(`   ❌ Workflow NO importable - estructura incorrecta`);
            }
            
        } else {
            console.log(`   ❌ No se encontró el archivo generado`);
        }
        
    } catch (error) {
        console.error(`❌ Error en prueba:`, error.message);
    }
}

// Ejecutar prueba
testWorkflowImportable().catch(console.error);
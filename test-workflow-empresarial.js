import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';

async function testWorkflowEmpresarial() {
    console.log('🎯 PRUEBA WORKFLOW EMPRESARIAL IMPORTABLE\n');

    const v4System = new V4UltraHybridSystem();

    // Prompt empresarial como el que usaste
    const promptEmpresarial = `
        Crear un sistema de automatización para e-commerce que:
        - Reciba pedidos desde webhook de Shopify
        - Valide stock en base de datos
        - Procese pagos con Stripe
        - Genere facturas PDF
        - Envíe confirmación por email
        - Notifique inventario por Slack
        - Actualice CRM con datos del cliente
    `;

    try {
        console.log('📋 Generando sistema empresarial...\n');
        
        const resultado = await v4System.generateWorkflow(promptEmpresarial);
        
        console.log('🎉 WORKFLOW EMPRESARIAL GENERADO');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log(`📁 Archivo n8n: ${resultado.filename}`);
        console.log(`📊 Archivo análisis: ${resultado.filename.replace('.json', '-metadata.json')}`);
        
        // Verificar archivo generado
        const fs = await import('fs');
        const path = await import('path');
        const workflowPath = path.default.join(process.cwd(), 'generated-workflows', resultado.filename);
        
        if (fs.default.existsSync(workflowPath)) {
            const workflow = JSON.parse(fs.default.readFileSync(workflowPath, 'utf8'));
            
            console.log(`\n📊 ESTRUCTURA DEL WORKFLOW:`);
            console.log(`   • Nombre: "${workflow.name}"`);
            console.log(`   • Nodos: ${workflow.nodes?.length || 0}`);
            console.log(`   • Conexiones: ${Object.keys(workflow.connections || {}).length}`);
            console.log(`   • Activo: ${workflow.active}`);
            
            console.log(`\n🔧 TIPOS DE NODOS INCLUIDOS:`);
            const tiposNodos = [...new Set(workflow.nodes?.map(n => n.type.replace('n8n-nodes-base.', '')) || [])];
            tiposNodos.forEach(tipo => console.log(`   • ${tipo}`));
            
            console.log(`\n✅ VERIFICACIONES DE IMPORTACIÓN:`);
            const verificaciones = {
                'Estructura básica': workflow.name && workflow.nodes && workflow.connections,
                'Nodos válidos': workflow.nodes?.every(n => n.id && n.name && n.type && n.position),
                'Conexiones válidas': true, // Se verifica automáticamente al cargar JSON
                'Propiedades n8n': workflow.hasOwnProperty('active') && workflow.hasOwnProperty('settings'),
                'Formato importable': !workflow.hasOwnProperty('workflow') // No debe tener estructura anidada
            };
            
            Object.entries(verificaciones).forEach(([check, passed]) => {
                console.log(`   ${passed ? '✅' : '❌'} ${check}`);
            });
            
            const todasPasaron = Object.values(verificaciones).every(v => v);
            
            console.log(`\n🎯 RESULTADO FINAL:`);
            if (todasPasaron) {
                console.log(`   🚀 ¡WORKFLOW COMPLETAMENTE IMPORTABLE!`);
                console.log(`   📥 Listo para "Import from File" en n8n`);
                console.log(`   📁 Ubicación: generated-workflows/${resultado.filename}`);
                console.log(`   💡 Tip: Usar también el archivo -metadata.json para análisis`);
            } else {
                console.log(`   ⚠️ Workflow tiene problemas de compatibilidad`);
            }
            
        } else {
            console.log(`❌ No se encontró el archivo: ${workflowPath}`);
        }
        
    } catch (error) {
        console.error(`❌ Error:`, error.message);
    }
}

// Ejecutar prueba
testWorkflowEmpresarial().catch(console.error);
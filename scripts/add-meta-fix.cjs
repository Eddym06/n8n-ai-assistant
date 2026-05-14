
/**
 * Script para agregar automáticamente el campo meta a workflows
 */
function addMetaToWorkflow(inputPath, outputPath) {
    const workflow = JSON.parse(require('fs').readFileSync(inputPath, 'utf8'));
    
    if (!workflow.meta) {
        workflow.meta = {
            templateCreatedBy: "n8n-ai-assistant",
            fixedBy: "meta-field-fix",
            timestamp: new Date().toISOString()
        };
        
        require('fs').writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
        console.log(`✅ Meta agregado: ${outputPath}`);
    } else {
        console.log(`⚠️ Ya tiene meta: ${inputPath}`);
    }
}

// Uso: addMetaToWorkflow('input.json', 'output.json');
module.exports = { addMetaToWorkflow };

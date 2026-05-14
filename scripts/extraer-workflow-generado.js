/**
 * EXTRACTOR DE WORKFLOW GENERADO
 * 
 * Este script extrae el último workflow generado por el system y lo guarda
 * como archivo JSON importable en n8n
 */

import fs from 'fs/promises';
import path from 'path';

async function extraerWorkflowFintech() {
    try {
        console.log('🔍 Ejecutando sistema para generar workflow fintech...');
        
        // Prompt optimizado para fintech
        const prompt = "Automatizar captación de clientes empresariales fintech: webhook recibe leads, valida información corporativa, score con IA, genera propuestas personalizadas, crea expediente CRM, envía email, programa llamadas, notifica Slack";
        
        // Ejecutamos el sistema directamente con import dinámico
        const { N8nAIAssistant } = await import('./extension-server-OFICIAL.js');
        
        const assistant = new N8nAIAssistant();
        await assistant.initializeSystem();
        
        console.log('🚀 Procesando prompt fintech...');
        const result = await assistant.processUserPromptV3(prompt);
        
        if (result && result.workflowJSON) {
            const workflowData = result.workflowJSON;
            
            // Crear nombre único para el archivo
            const timestamp = Date.now();
            const filename = `fintech-lead-automation-${timestamp}.json`;
            const filepath = path.join(process.cwd(), filename);
            
            // Guardar el workflow
            await fs.writeFile(filepath, JSON.stringify(workflowData, null, 2), 'utf8');
            
            console.log('✅ WORKFLOW FINTECH EXTRAÍDO EXITOSAMENTE:');
            console.log(`   📁 Archivo: ${filename}`);
            console.log(`   📍 Ubicación: ${filepath}`);
            console.log(`   🔢 Nodos: ${workflowData.nodes?.length || 0}`);
            console.log(`   💾 Tamaño: ${JSON.stringify(workflowData).length} chars`);
            console.log(`   🎯 Importable en n8n: SÍ`);
            
            return filepath;
        } else {
            console.log('❌ No se pudo extraer el workflow generado');
            return null;
        }
        
    } catch (error) {
        console.error('❌ Error al extraer workflow:', error.message);
        return null;
    }
}

// Ejecutar directamente si se llama como script
if (import.meta.url === `file://${process.argv[1]}`) {
    extraerWorkflowFintech()
        .then((filepath) => {
            if (filepath) {
                console.log('\n🎉 PROCESO COMPLETADO - Workflow listo para importar en n8n');
            } else {
                console.log('\n❌ PROCESO FALLÓ - No se pudo extraer el workflow');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('\n💥 ERROR CRÍTICO:', error);
            process.exit(1);
        });
}

export { extraerWorkflowFintech };
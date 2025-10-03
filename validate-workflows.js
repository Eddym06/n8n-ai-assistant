import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validando archivos JSON de workflows...\n');

// Lista de archivos de workflows descargados
const workflowFiles = [
    'workflow-1-stock-market-analysis-newsletter.json',
    'workflow-2-automatic-whatsapp-gpt4o-mini-assistant.json',
    'workflow-3-viral-content-ideas-generator.json',
    'workflow-4-ai-enhanced-linkedin-profile-analysis.json',
    'workflow-5-local-chatbot-rag-ollama.json',
    'workflow-6-dual-research-assistant.json',
    'workflow-7-advanced-web-research-agent.json',
    'workflow-8-ig-posts-email-newsletter.json',
    'workflow-9-customer-support-chatbot.json',
    'workflow-10-local-rag-chatbot.json',
    'workflow-11-ai-stock-analysis-assistant.json',
    'workflow-12-local-rag-chatbot.json',
    'workflow-13-ai-research-assistant-telegram-deepseek-gpt4o-serpapi.json',
    'workflow-14-customer-support-whatsapp-bot-google-docs-gemini-ai.json',
    'workflow-15-local-chatbot-rag-ollama-qdrant.json',
    'workflow-16-telegram-ai-postgresql.json',
    'workflow-17-multimodal-telegram-supabase-rag.json',
    'workflow-18-local-chatbot-rag.json',
    'workflow-19-rag-chatbot-google-drive-gemini.json',
    'workflow-20-local-chatbot-rag-ollama-qdrant.json'
];

const validFiles = [];
const invalidFiles = [];
const missingFiles = [];

for (const filename of workflowFiles) {
    const filePath = path.join(__dirname, filename);
    
    try {
        if (!fs.existsSync(filePath)) {
            missingFiles.push(filename);
            console.log(`❌ FALTA: ${filename}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si el contenido está vacío o es muy corto
        if (!content || content.trim().length < 10) {
            invalidFiles.push({ filename, reason: 'Archivo vacío o muy corto' });
            console.log(`🚫 INVÁLIDO: ${filename} - Archivo vacío o muy corto`);
            continue;
        }

        // Verificar si parece HTML en lugar de JSON
        if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
            invalidFiles.push({ filename, reason: 'Contiene HTML en lugar de JSON' });
            console.log(`🚫 INVÁLIDO: ${filename} - Contiene HTML en lugar de JSON`);
            continue;
        }

        // Intentar parsear como JSON
        const parsed = JSON.parse(content);
        
        // Verificar estructura básica de workflow de n8n
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
            invalidFiles.push({ filename, reason: 'No tiene estructura de workflow válida (falta nodes)' });
            console.log(`🚫 INVÁLIDO: ${filename} - No tiene estructura de workflow válida`);
            continue;
        }

        // Verificar que tenga al menos 7 nodos
        if (parsed.nodes.length < 7) {
            invalidFiles.push({ filename, reason: `Solo tiene ${parsed.nodes.length} nodos (requiere 7+)` });
            console.log(`🚫 INVÁLIDO: ${filename} - Solo tiene ${parsed.nodes.length} nodos`);
            continue;
        }

        validFiles.push({ filename, nodeCount: parsed.nodes.length });
        console.log(`✅ VÁLIDO: ${filename} - ${parsed.nodes.length} nodos`);

    } catch (error) {
        invalidFiles.push({ filename, reason: `Error JSON: ${error.message}` });
        console.log(`🚫 INVÁLIDO: ${filename} - Error JSON: ${error.message}`);
    }
}

console.log('\n📊 RESUMEN:');
console.log(`✅ Archivos válidos: ${validFiles.length}`);
console.log(`🚫 Archivos inválidos: ${invalidFiles.length}`);
console.log(`❌ Archivos faltantes: ${missingFiles.length}`);

if (invalidFiles.length > 0) {
    console.log('\n🔧 ARCHIVOS QUE NECESITAN CORRECCIÓN:');
    invalidFiles.forEach(({ filename, reason }) => {
        console.log(`  - ${filename}: ${reason}`);
    });
}

if (missingFiles.length > 0) {
    console.log('\n❌ ARCHIVOS FALTANTES:');
    missingFiles.forEach(filename => {
        console.log(`  - ${filename}`);
    });
}

console.log('\n🎯 PRÓXIMOS PASOS:');
if (invalidFiles.length > 0) {
    console.log('1. Corregir archivos inválidos');
}
if (missingFiles.length > 0) {
    console.log('2. Descargar archivos faltantes');
}
console.log('3. Mejorar script para descarga automática de 30 workflows únicos');
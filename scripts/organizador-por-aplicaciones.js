import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
    GEMINI_API_KEY: 'your_google_api_key_here',
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    
    // Carpeta base donde están organizados los workflows
    BASE_FOLDER: 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\Workflow MCP n8n'
};

// Estado global
const state = {
    totalWorkflows: 0,
    processedWorkflows: 0,
    applications: new Map(),
    errors: []
};

/**
 * Analiza un workflow con Gemini para determinar las aplicaciones que utiliza
 */
async function analyzeWorkflowApplications(workflowData, filename) {
    console.log(`🤖 Analizando aplicaciones en "${filename}"...`);
    
    // Extraer información relevante del workflow
    const workflowInfo = {
        name: workflowData.name || filename.replace('.json', ''),
        nodes: workflowData.nodes || [],
        nodeTypes: workflowData.nodes ? workflowData.nodes.map(n => n.type).filter(Boolean) : [],
        description: workflowData.meta?.description || '',
        tags: workflowData.tags || []
    };
    
    const prompt = `Analiza este workflow de n8n e identifica la APLICACIÓN PRINCIPAL que maneja.

INFORMACIÓN DEL WORKFLOW:
- Nombre: ${workflowInfo.name}
- Descripción: ${workflowInfo.description}
- Tipos de nodos: ${workflowInfo.nodeTypes.slice(0, 15).join(', ')}
- Tags: ${workflowInfo.tags.join(', ')}

REGLAS DE IDENTIFICACIÓN DE APLICACIONES:
1. Busca nombres específicos de aplicaciones/servicios en nodos y nombres
2. Prioriza aplicaciones comerciales conocidas sobre servicios genéricos
3. Si hay múltiples aplicaciones, elige la MÁS PROMINENTE

APLICACIONES COMUNES A DETECTAR:
- Gmail, Outlook, Mailchimp, SendGrid
- WhatsApp, Telegram, Slack, Discord
- YouTube, TikTok, Instagram, Facebook, Twitter/X
- Google Sheets, Airtable, Notion, Excel
- WordPress, Shopify, WooCommerce
- OpenAI, Gemini, Claude, ChatGPT
- Supabase, Firebase, PostgreSQL, MySQL
- GitHub, GitLab, Jira, Trello
- Zapier, Make, Integromat
- Stripe, PayPal, Square
- Google Drive, Dropbox, OneDrive
- Calendly, Google Calendar, Outlook Calendar
- HubSpot, Salesforce, Pipedrive
- Zoom, Microsoft Teams, Google Meet
- AWS, Azure, Google Cloud
- Twilio, SendGrid, Mailgun

INSTRUCCIONES:
- Si detectas una aplicación específica, responde SOLO con su nombre
- Si no hay aplicación específica clara, responde "General"
- NO uses descripciones, SOLO el nombre de la aplicación
- Ejemplos de respuestas válidas: "Gmail", "WhatsApp", "OpenAI", "General"

RESPONDE SOLO CON EL NOMBRE DE LA APLICACIÓN:`;

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 30 }
                })
            });

            if (response.status === 429) {
                const delay = Math.pow(2, retryCount) * 2000;
                console.log(`   ⏳ Rate limit. Esperando ${delay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
            }

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            let application = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'General';
            
            // Limpiar y normalizar el nombre de la aplicación
            application = application.replace(/[<>:"/\\|?*]/g, '').trim();
            if (!application || application.length > 50) {
                application = 'General';
            }
            
            console.log(`   📱 Aplicación detectada: "${application}"`);
            return application;
            
        } catch (error) {
            if (error.message.includes('429') && retryCount < maxRetries - 1) {
                const delay = Math.pow(2, retryCount) * 2000;
                console.log(`   ⏳ Error 429. Esperando ${delay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
            }
            
            console.warn(`   ⚠️ Error con Gemini: ${error.message}`);
            return 'General';
        }
    }
    
    return 'General';
}

/**
 * Procesa una carpeta de categoría
 */
async function processCategoryFolder(categoryPath) {
    const categoryName = path.basename(categoryPath);
    console.log(`\n📂 Procesando categoría: ${categoryName}`);
    
    if (!fs.existsSync(categoryPath)) {
        console.log(`   ⚠️ Carpeta no encontrada: ${categoryPath}`);
        return;
    }
    
    const files = fs.readdirSync(categoryPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
        console.log(`   ⚠️ No se encontraron workflows en ${categoryName}`);
        return;
    }
    
    console.log(`   📄 Encontrados ${jsonFiles.length} workflows`);
    
    // Mapa para agrupar workflows por aplicación
    const applicationGroups = new Map();
    
    // Analizar cada workflow
    for (const file of jsonFiles) {
        const filePath = path.join(categoryPath, file);
        
        try {
            console.log(`   📊 Procesando: ${file}`);
            
            // Leer el workflow
            const content = fs.readFileSync(filePath, 'utf8');
            const workflowData = JSON.parse(content);
            
            // Analizar con Gemini
            const application = await analyzeWorkflowApplications(workflowData, file);
            
            // Agrupar por aplicación
            if (!applicationGroups.has(application)) {
                applicationGroups.set(application, []);
            }
            applicationGroups.get(application).push({
                filename: file,
                filePath: filePath,
                data: workflowData
            });
            
            state.processedWorkflows++;
            
            // Pequeño delay para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`   ❌ Error procesando ${file}: ${error.message}`);
            state.errors.push(`Error procesando ${file}: ${error.message}`);
        }
    }
    
    // Crear subcarpetas por aplicación y mover archivos
    console.log(`   📁 Creando subcarpetas por aplicación...`);
    
    for (const [application, workflows] of applicationGroups) {
        if (workflows.length === 0) continue;
        
        // Crear subcarpeta de aplicación
        const appFolderPath = path.join(categoryPath, application);
        if (!fs.existsSync(appFolderPath)) {
            fs.mkdirSync(appFolderPath, { recursive: true });
            console.log(`     📁 Creada subcarpeta: ${application}`);
        }
        
        // Mover workflows a la subcarpeta
        for (const workflow of workflows) {
            const sourcePath = workflow.filePath;
            const destPath = path.join(appFolderPath, workflow.filename);
            
            try {
                // Mover archivo
                fs.renameSync(sourcePath, destPath);
                console.log(`     ✅ Movido: ${workflow.filename} → ${application}/`);
                
                // Actualizar estadísticas
                if (!state.applications.has(application)) {
                    state.applications.set(application, 0);
                }
                state.applications.set(application, state.applications.get(application) + 1);
                
            } catch (error) {
                console.error(`     ❌ Error moviendo ${workflow.filename}: ${error.message}`);
                state.errors.push(`Error moviendo ${workflow.filename}: ${error.message}`);
            }
        }
    }
}

/**
 * Procesa todas las carpetas de categorías
 */
async function processAllCategories() {
    console.log('🚀 Iniciando Organizador por Aplicaciones con IA');
    console.log('🤖 Powered by Gemini 2.0 Flash + Clasificación por Apps\n');
    
    const startTime = Date.now();
    
    if (!fs.existsSync(CONFIG.BASE_FOLDER)) {
        console.log(`❌ Carpeta base no encontrada: ${CONFIG.BASE_FOLDER}`);
        return;
    }
    
    // Obtener todas las carpetas de categorías
    const categories = fs.readdirSync(CONFIG.BASE_FOLDER)
        .map(item => path.join(CONFIG.BASE_FOLDER, item))
        .filter(itemPath => fs.statSync(itemPath).isDirectory());
    
    if (categories.length === 0) {
        console.log('❌ No se encontraron carpetas de categorías para procesar.');
        return;
    }
    
    console.log(`📂 Encontradas ${categories.length} categorías para procesar:`);
    categories.forEach(cat => console.log(`   - ${path.basename(cat)}`));
    
    // Contar total de workflows
    for (const categoryPath of categories) {
        const files = fs.readdirSync(categoryPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        state.totalWorkflows += jsonFiles.length;
    }
    
    console.log(`🎯 Total workflows a procesar: ${state.totalWorkflows}\n`);
    
    // Procesar cada categoría
    for (const categoryPath of categories) {
        await processCategoryFolder(categoryPath);
    }
    
    // Mostrar reporte final
    showFinalReport(startTime);
}

/**
 * Muestra el reporte final
 */
function showFinalReport(startTime) {
    const duration = Date.now() - startTime;
    const minutes = Math.round(duration / 60000);
    
    console.log('\n🎉 ¡ORGANIZACIÓN POR APLICACIONES COMPLETADA!\n');
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`✅ Workflows procesados: ${state.processedWorkflows}/${state.totalWorkflows}`);
    console.log(`⏱️ Tiempo total: ${minutes} minutos`);
    console.log(`❌ Errores: ${state.errors.length}`);
    console.log(`📁 Carpeta base: ${CONFIG.BASE_FOLDER}\n`);
    
    console.log('📱 APLICACIONES IDENTIFICADAS:');
    const sortedApps = Array.from(state.applications.entries())
        .sort((a, b) => b[1] - a[1]);
    
    for (const [application, count] of sortedApps) {
        console.log(`   📱 ${application}: ${count} workflows`);
    }
    
    if (state.errors.length > 0) {
        console.log('\n⚠️ ERRORES ENCONTRADOS:');
        state.errors.forEach(error => console.log(`   ❌ ${error}`));
    }
    
    console.log(`\n🏆 ¡Tus workflows están organizados por aplicaciones en: ${CONFIG.BASE_FOLDER}!`);
    console.log('📁 Estructura final: Categoría > Aplicación > Workflows');
}

// Ejecutar
processAllCategories().catch(console.error);
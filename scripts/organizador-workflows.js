import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
    GEMINI_API_KEY: 'your_google_api_key_here',
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    
    // Carpetas fuente
    SOURCE_FOLDERS: [
        'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant', // Workflows recién descargados
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\workflows-n8n',
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\n8n_workflows_agentes_ia',
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\Clasificador de emociones AI',
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\Suno Ai',
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\n8n',
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\n8n-ai-automations',
        'C:\\Users\\eddym\\Downloads\\Nuevos flujos de agentes de AI\\awesome-n8n-templates'
    ],
    
    // Carpeta destino
    DESTINATION_FOLDER: 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\Workflow MCP n8n'
};

// Estado global
const state = {
    totalWorkflows: 0,
    processedWorkflows: 0,
    categories: new Map(),
    errors: []
};

/**
 * Analiza un workflow con Gemini para determinar su categoría
 */
async function analyzeWorkflowWithGemini(workflowData, filename) {
    console.log(`🤖 Analizando "${filename}" con Gemini AI...`);
    
    // Extraer información relevante del workflow
    const workflowInfo = {
        name: workflowData.name || filename.replace('.json', ''),
        nodes: workflowData.nodes || [],
        nodeTypes: workflowData.nodes ? workflowData.nodes.map(n => n.type).filter(Boolean) : [],
        description: workflowData.meta?.description || '',
        tags: workflowData.tags || []
    };
    
    const prompt = `Analiza este workflow de n8n y clasifícalo en UNA categoría específica basada en su funcionalidad principal.

INFORMACIÓN DEL WORKFLOW:
- Nombre: ${workflowInfo.name}
- Descripción: ${workflowInfo.description}
- Número de nodos: ${workflowInfo.nodes.length}
- Tipos de nodos: ${workflowInfo.nodeTypes.slice(0, 10).join(', ')}
- Tags: ${workflowInfo.tags.join(', ')}

REGLAS DE CLASIFICACIÓN:
1. Si menciona WhatsApp/Telegram/Discord/Slack → "Chatbots y Mensajería"
2. Si menciona YouTube/TikTok/Instagram/Social Media → "Redes Sociales"
3. Si menciona Gmail/Email/Outlook → "Email y Comunicación"
4. Si menciona Google Sheets/Excel/Airtable → "Gestión de Datos"
5. Si menciona Scraping/Web/Crawler → "Web Scraping"
6. Si menciona Calendar/Meeting/Schedule → "Gestión de Tiempo"
7. Si menciona WordPress/Blog/Content → "Gestión de Contenido"
8. Si menciona Sales/CRM/Leads → "Ventas y CRM"
9. Si menciona Video/Image/Audio → "Multimedia"
10. Si menciona Research/Analysis/Report → "Investigación y Análisis"
11. Si menciona Database/SQL/Storage → "Base de Datos"
12. Si menciona Notification/Alert/Monitor → "Monitoreo y Alertas"
13. Para otros casos → "Automatización General"

RESPONDE SOLO CON EL NOMBRE DE LA CATEGORÍA, SIN EXPLICACIONES.
Ejemplo: "Chatbots y Mensajería" o "Redes Sociales"`;

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 50 }
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
            const category = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Automatización General';
            
            console.log(`   📂 Categoría: "${category}"`);
            return category;
            
        } catch (error) {
            if (error.message.includes('429') && retryCount < maxRetries - 1) {
                const delay = Math.pow(2, retryCount) * 2000;
                console.log(`   ⏳ Error 429. Esperando ${delay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
            }
            
            console.warn(`   ⚠️ Error con Gemini: ${error.message}`);
            return 'Automatización General';
        }
    }
    
    return 'Automatización General';
}

/**
 * Busca todos los archivos JSON en las carpetas fuente
 */
function findAllWorkflows() {
    console.log('🔍 Buscando workflows en carpetas fuente...');
    const workflows = [];
    
    for (const folder of CONFIG.SOURCE_FOLDERS) {
        if (!fs.existsSync(folder)) {
            console.log(`   ⚠️ Carpeta no encontrada: ${folder}`);
            continue;
        }
        
        console.log(`   📁 Procesando: ${folder}`);
        const files = fs.readdirSync(folder);
        
        for (const file of files) {
            if (file.endsWith('.json') && !file.includes('package')) {
                const filePath = path.join(folder, file);
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const workflowData = JSON.parse(content);
                    
                    // Verificar que es un workflow de n8n válido
                    if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
                        workflows.push({
                            filename: file,
                            filePath: filePath,
                            data: workflowData
                        });
                        console.log(`     ✅ ${file}`);
                    }
                } catch (error) {
                    console.log(`     ❌ JSON corrupto: ${file}`);
                    state.errors.push(`JSON corrupto: ${file}`);
                }
            }
        }
    }
    
    console.log(`🎯 Total workflows encontrados: ${workflows.length}`);
    return workflows;
}

/**
 * Crea la estructura de carpetas de destino
 */
function createDestinationStructure() {
    console.log('📁 Creando estructura de carpetas destino...');
    
    // Crear carpeta principal si no existe
    if (!fs.existsSync(CONFIG.DESTINATION_FOLDER)) {
        fs.mkdirSync(CONFIG.DESTINATION_FOLDER, { recursive: true });
        console.log(`   ✅ Creada: ${CONFIG.DESTINATION_FOLDER}`);
    }
    
    return CONFIG.DESTINATION_FOLDER;
}

/**
 * Copia un workflow a su carpeta de categoría correspondiente
 */
function copyWorkflowToCategory(workflow, category) {
    // Sanitizar nombre de carpeta
    const safeCategoryName = category.replace(/[<>:"/\\|?*]/g, '-');
    const categoryFolder = path.join(CONFIG.DESTINATION_FOLDER, safeCategoryName);
    
    // Crear carpeta de categoría si no existe
    if (!fs.existsSync(categoryFolder)) {
        fs.mkdirSync(categoryFolder, { recursive: true });
        console.log(`   📁 Creada categoría: ${safeCategoryName}`);
    }
    
    // Copiar archivo
    const destinationPath = path.join(categoryFolder, workflow.filename);
    try {
        fs.copyFileSync(workflow.filePath, destinationPath);
        console.log(`   ✅ Copiado: ${workflow.filename} → ${safeCategoryName}`);
        
        // Actualizar estadísticas
        if (!state.categories.has(category)) {
            state.categories.set(category, 0);
        }
        state.categories.set(category, state.categories.get(category) + 1);
        
        return true;
    } catch (error) {
        console.error(`   ❌ Error copiando ${workflow.filename}: ${error.message}`);
        state.errors.push(`Error copiando ${workflow.filename}: ${error.message}`);
        return false;
    }
}

/**
 * Procesa todos los workflows
 */
async function processAllWorkflows() {
    console.log('🚀 Iniciando Organizador de Workflows con IA');
    console.log('🤖 Powered by Gemini 2.0 Flash + Clasificación Inteligente\n');
    
    const startTime = Date.now();
    
    // Buscar todos los workflows
    const workflows = findAllWorkflows();
    state.totalWorkflows = workflows.length;
    
    if (workflows.length === 0) {
        console.log('❌ No se encontraron workflows para procesar.');
        return;
    }
    
    // Crear estructura de destino
    createDestinationStructure();
    
    console.log('\n🔄 Procesando workflows...\n');
    
    // Procesar cada workflow
    for (const workflow of workflows) {
        try {
            console.log(`📊 Progreso: ${state.processedWorkflows + 1}/${state.totalWorkflows}`);
            
            // Analizar con Gemini
            const category = await analyzeWorkflowWithGemini(workflow.data, workflow.filename);
            
            // Copiar a la carpeta correspondiente
            const success = copyWorkflowToCategory(workflow, category);
            
            if (success) {
                state.processedWorkflows++;
            }
            
            // Pequeño delay para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ Error procesando ${workflow.filename}: ${error.message}`);
            state.errors.push(`Error procesando ${workflow.filename}: ${error.message}`);
        }
        
        console.log(''); // Línea en blanco para separar
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
    
    console.log('\n🎉 ¡ORGANIZACIÓN COMPLETADA!\n');
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`✅ Workflows procesados: ${state.processedWorkflows}/${state.totalWorkflows}`);
    console.log(`⏱️ Tiempo total: ${minutes} minutos`);
    console.log(`❌ Errores: ${state.errors.length}`);
    console.log(`📁 Carpeta destino: ${CONFIG.DESTINATION_FOLDER}\n`);
    
    console.log('📂 CATEGORÍAS CREADAS:');
    const sortedCategories = Array.from(state.categories.entries())
        .sort((a, b) => b[1] - a[1]);
    
    for (const [category, count] of sortedCategories) {
        console.log(`   📁 ${category}: ${count} workflows`);
    }
    
    if (state.errors.length > 0) {
        console.log('\n⚠️ ERRORES ENCONTRADOS:');
        state.errors.forEach(error => console.log(`   ❌ ${error}`));
    }
    
    console.log(`\n🏆 ¡Todos tus workflows están organizados en: ${CONFIG.DESTINATION_FOLDER}!`);
}

// Ejecutar
processAllWorkflows().catch(console.error);
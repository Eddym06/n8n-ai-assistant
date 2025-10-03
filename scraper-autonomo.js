import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
    TARGET_WORKFLOWS: 30,
    MIN_NODES: 7, // Aumentado de 4 a 7 nodos mínimos
    MIN_AI_AGENTS: 1, // Mínimo 1 agente AI requerido
    MIN_GEMINI_SCORE: 6, // Score mínimo de Gemini aumentado a 6
    BASE_URL: 'https://n8n.io/workflows/?integrations=AI+Agent&sort=views:desc',
    GEMINI_API_KEY: 'your_google_api_key_here',
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    DOWNLOAD_DELAY: 5000,
    MAX_LOAD_MORE_CLICKS: 10
};

// Estado global
const state = {
    downloaded: 0,
    processed: 0,
    errors: 0,
    existingWorkflows: new Set(),
    downloadedTitles: new Set()
};

// Cargar workflows existentes
function loadExistingWorkflows() {
    console.log('📂 Cargando workflows existentes...');
    
    const files = fs.readdirSync(__dirname).filter(f => f.startsWith('workflow-') && f.endsWith('.json'));
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
            JSON.parse(content); // Validar que sea JSON válido
            
            const titleMatch = file.match(/workflow-\d+-(.*?)\.json$/);
            if (titleMatch) {
                state.downloadedTitles.add(titleMatch[1].toLowerCase());
            }
            
        } catch (error) {
            console.warn(`⚠️ JSON corrupto ignorado: ${file}`);
        }
    }
    
    console.log(`🔍 Encontrados ${files.length} workflows existentes (${files.length - state.downloadedTitles.size} corruptos)`);
    state.downloaded = state.downloadedTitles.size;
}

// Evaluar workflow con Gemini
async function evaluateWorkflowWithGemini(workflowData) {
    const prompt = `Analiza este workflow de n8n y califica su utilidad del 1-10:

TÍTULO: ${workflowData.title}
NODOS: ${workflowData.nodeCount || 'desconocido'}
AGENTES AI: ${workflowData.aiAgents || 'desconocido'}

CRITERIOS ESTRICTOS:
- 8-10: Excelente (AI Agents + automatización compleja + 7+ nodos + múltiples integraciones)
- 6-7: Muy bueno (AI Agents + funcionalidad avanzada + 7+ nodos)
- 4-5: Bueno (funcionalidad práctica pero sin AI Agents o pocos nodos)
- 1-3: Básico (funcionalidad simple, sin AI Agents, pocos nodos)

REQUISITOS OBLIGATORIOS para score 6+:
- DEBE tener al menos 1 AI Agent
- DEBE tener mínimo 7 nodos
- DEBE ser de automatización compleja

Responde EXACTAMENTE: "NUMERO CATEGORIA"
Ejemplo: "8 CHATBOT" o "6 AUTOMATION"`;

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 50 }
                })
            });

            if (response.status === 429) {
                // Rate limit - esperar exponencialmente
                const delay = Math.pow(2, retryCount) * 3000; // 3s, 6s, 12s
                console.log(`   ⏳ Rate limit detectado. Esperando ${delay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
            }

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            const match = text.match(/(\d+)\s+(\w+)/);
            if (match) {
                return {
                    score: parseInt(match[1]),
                    category: match[2],
                    approved: parseInt(match[1]) >= CONFIG.MIN_GEMINI_SCORE
                };
            }
            
            return { score: 3, category: 'DEFAULT', approved: false };
            
        } catch (error) {
            if (error.message.includes('429') && retryCount < maxRetries - 1) {
                const delay = Math.pow(2, retryCount) * 3000;
                console.log(`   ⏳ Error 429. Esperando ${delay/1000}s antes de reintentar...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
            }
            
            console.warn(`⚠️ Error evaluando con Gemini: ${error.message}`);
            return { score: 3, category: 'ERROR', approved: false };
        }
    }
    
    console.warn(`⚠️ Máximo de reintentos alcanzado para Gemini`);
    return { score: 3, category: 'ERROR', approved: false };
}

// Función principal automática
async function startAutoScraping() {
    console.log('🚀 N8N Auto-Scraper Automático V4.0');
    console.log('🎯 Objetivo: 30 workflows únicos con evaluación AI');
    console.log('🤖 Powered by Gemini 2.5 Flash + Playwright\n');
    
    loadExistingWorkflows();
    
    if (state.downloaded >= CONFIG.TARGET_WORKFLOWS) {
        console.log(`✅ Ya tienes ${state.downloaded} workflows válidos. ¡Objetivo alcanzado!`);
        return;
    }
    
    console.log(`📊 Necesitas ${CONFIG.TARGET_WORKFLOWS - state.downloaded} workflows más\n`);
    
    const startTime = Date.now();
    
    // Lanzar navegador
    console.log('🌐 Iniciando navegador...');
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000,
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'] // Permisos permanentes del portapapeles
    });
    
    const page = await context.newPage();
    
    try {
        // Navegar a n8n workflows
        console.log(`🔗 Navegando a: ${CONFIG.BASE_URL}`);
        await page.goto(CONFIG.BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        let loadMoreClicks = 0;
        
        while (state.downloaded < CONFIG.TARGET_WORKFLOWS && loadMoreClicks < CONFIG.MAX_LOAD_MORE_CLICKS) {
            console.log(`\n📄 Procesando página (Load more: ${loadMoreClicks})...`);
            
            // Buscar enlaces de workflows
            const workflowLinks = await page.locator('a[href*="/workflows/"]').all();
            
            console.log(`🔍 Encontrados ${workflowLinks.length} enlaces de workflows`);
            
            for (let i = 0; i < workflowLinks.length && state.downloaded < CONFIG.TARGET_WORKFLOWS; i++) {
                try {
                    const link = workflowLinks[i];
                    const href = await link.getAttribute('href');
                    
                    if (!href || !href.includes('/workflows/') || href === '/workflows/') continue;
                    
                    const fullUrl = href.startsWith('/') ? `https://n8n.io${href}` : href;
                    
                    // Extraer título de la URL
                    const urlMatch = href.match(/\/workflows\/\d+-(.*?)\/?$/);
                    if (!urlMatch) continue;
                    
                    const safeName = urlMatch[1].toLowerCase();
                    
                    // Verificar si ya existe
                    if (state.downloadedTitles.has(safeName)) {
                        console.log(`⏭️ Omitiendo "${safeName}" (ya descargado)`);
                        continue;
                    }
                    
                    const title = safeName.replace(/-/g, ' ');
                    console.log(`\n🎯 Procesando: "${title}"`);
                    
                    // Evaluar con Gemini
                    const evaluation = await evaluateWorkflowWithGemini({ 
                        title,
                        nodeCount: 'desconocido',
                        aiAgents: 'desconocido'
                    });
                    console.log(`🤖 Gemini Score: ${evaluation.score}/10 (${evaluation.category})`);
                    
                    if (!evaluation.approved) {
                        console.log(`❌ Workflow rechazado (score < ${CONFIG.MIN_GEMINI_SCORE})`);
                        continue;
                    }
                    
                    // Abrir en nueva pestaña del mismo contexto
                    const newPage = await context.newPage();
                    try {
                        console.log(`🔗 Navegando a: ${fullUrl}`);
                        await newPage.goto(fullUrl, { waitUntil: 'networkidle' });
                        await newPage.waitForTimeout(2000);
                        
                        // Buscar y hacer click en "Use for free"
                        const useButton = newPage.locator('text="Use for free"').first();
                        if (await useButton.isVisible({ timeout: 5000 })) {
                            console.log('🖱️ Haciendo click en "Use for free"');
                            await useButton.click();
                            await newPage.waitForTimeout(3000);
                            
                            // Buscar el botón de "Copy template to clipboard (JSON)"
                            const copyButton = newPage.locator('text="Copy template to clipboard (JSON)"').first();
                            if (await copyButton.isVisible({ timeout: 5000 })) {
                                console.log('📋 Copiando JSON al clipboard');
                                await copyButton.click();
                                await newPage.waitForTimeout(2000);
                                
                                // Obtener el JSON del clipboard
                                const clipboardText = await newPage.evaluate(() => navigator.clipboard.readText());
                                
                                if (clipboardText && clipboardText.startsWith('{')) {
                                    const workflow = JSON.parse(clipboardText);
                                    const nodeCount = workflow.nodes ? workflow.nodes.length : 0;
                                    
                                    // Verificar agentes AI
                                    const aiAgents = workflow.nodes ? workflow.nodes.filter(node => 
                                        node.type.includes('agent') || 
                                        node.name.toLowerCase().includes('agent') ||
                                        node.type.includes('langchain.agent')
                                    ) : [];
                                    
                                    console.log(`🔍 Análisis del workflow:`);
                                    console.log(`   - Nodos: ${nodeCount}`);
                                    console.log(`   - Agentes AI: ${aiAgents.length}`);
                                    
                                    // Verificar criterios estrictos
                                    const meetsNodeCriteria = nodeCount >= CONFIG.MIN_NODES;
                                    const meetsAgentCriteria = aiAgents.length >= CONFIG.MIN_AI_AGENTS;
                                    
                                    if (meetsNodeCriteria && meetsAgentCriteria) {
                                        const filename = `workflow-${state.downloaded + 1}-${safeName}.json`;
                                        fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(workflow, null, 2));
                                        
                                        state.downloaded++;
                                        state.downloadedTitles.add(safeName);
                                        
                                        console.log(`✅ Descargado: ${filename}`);
                                        console.log(`   📊 ${nodeCount} nodos, ${aiAgents.length} agentes AI`);
                                        console.log(`� Progreso: ${state.downloaded}/${CONFIG.TARGET_WORKFLOWS}`);
                                        
                                        // Cerrar modal con Escape
                                        await newPage.keyboard.press('Escape');
                                    } else {
                                        console.log(`❌ Workflow rechazado:`);
                                        if (!meetsNodeCriteria) console.log(`   ❌ Pocos nodos: ${nodeCount} < ${CONFIG.MIN_NODES}`);
                                        if (!meetsAgentCriteria) console.log(`   ❌ Sin agentes AI: ${aiAgents.length} < ${CONFIG.MIN_AI_AGENTS}`);
                                    }
                                } else {
                                    console.log(`❌ No se pudo obtener JSON del clipboard`);
                                }
                            } else {
                                console.log(`❌ No se encontró botón de copy JSON`);
                            }
                        } else {
                            console.log(`❌ No se encontró botón "Use for free"`);
                        }
                        
                    } catch (error) {
                        console.log(`❌ Error descargando workflow: ${error.message}`);
                        state.errors++;
                    } finally {
                        try {
                            if (!newPage.isClosed()) {
                                await newPage.close();
                            }
                        } catch (closeError) {
                            console.log(`⚠️ Error cerrando página: ${closeError.message}`);
                        }
                    }
                    
                    // Delay entre descargas
                    await page.waitForTimeout(CONFIG.DOWNLOAD_DELAY);
                    
                } catch (error) {
                    console.log(`❌ Error procesando enlace: ${error.message}`);
                    state.errors++;
                }
            }
            
            // Intentar hacer click en "Load more" si necesitamos más workflows
            if (state.downloaded < CONFIG.TARGET_WORKFLOWS) {
                try {
                    console.log(`\n🔄 Buscando botón "Load more"...`);
                    const loadMoreButton = page.locator('text="Load more templates"').first();
                    if (await loadMoreButton.isVisible({ timeout: 5000 })) {
                        console.log(`🔄 Cargando más workflows...`);
                        await loadMoreButton.click();
                        await page.waitForTimeout(5000);
                        loadMoreClicks++;
                    } else {
                        console.log(`⚠️ No se encontró botón "Load more". Terminando.`);
                        break;
                    }
                } catch (error) {
                    console.log(`⚠️ Error al cargar más: ${error.message}`);
                    break;
                }
            }
        }
        
    } catch (error) {
        console.log(`❌ Error general: ${error.message}`);
        if (error.message.includes('Target page, context or browser has been closed')) {
            console.log('⚠️ El navegador se cerró inesperadamente. Reiniciando...');
            // Aquí podríamos reiniciar el proceso, pero por ahora terminamos
        }
    } finally {
        try {
            if (browser && !browser.isClosed) {
                await browser.close();
            }
        } catch (closeError) {
            console.log(`⚠️ Error cerrando navegador: ${closeError.message}`);
        }
    }
    
    // Reporte final
    const duration = Date.now() - startTime;
    const minutes = Math.round(duration / 60000);
    
    console.log('\n🎉 ¡AUTO-SCRAPER COMPLETADO!\n');
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`✅ Workflows descargados: ${state.downloaded}/${CONFIG.TARGET_WORKFLOWS}`);
    console.log(`⏱️ Tiempo total: ${minutes} minutos`);
    console.log(`❌ Errores: ${state.errors}`);
    
    if (state.downloaded >= CONFIG.TARGET_WORKFLOWS) {
        console.log('\n🏆 ¡OBJETIVO ALCANZADO! Tienes 30 workflows únicos y de calidad.');
    } else {
        console.log(`\n📝 Faltan ${CONFIG.TARGET_WORKFLOWS - state.downloaded} workflows más.`);
    }
}

// Ejecutar
startAutoScraping().catch(console.error);
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
    TARGET_WORKFLOWS: 30,
    MIN_NODES: 4,
    BASE_URL: 'https://n8n.io/workflows/?integrations=AI+Agent&sort=views:desc',
    GEMINI_API_KEY: 'your_google_api_key_here',
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    DOWNLOAD_DELAY: 3000,
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
            
            const titleMatch = file.match(/workflow-\\d+-(.*)\\.json$/);
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

CRITERIOS:
- 7-10: Muy útil (AI avanzado, automatización compleja, múltiples integraciones)
- 4-6: Útil (funcionalidad práctica, buen diseño)  
- 1-3: Básico (funcionalidad simple o limitada)

Responde EXACTAMENTE: "NUMERO CATEGORIA"
Ejemplo: "8 CHATBOT" o "7 AUTOMATION"`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 50 }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        const match = text.match(/(\\d+)\\s+(\\w+)/);
        if (match) {
            return {
                score: parseInt(match[1]),
                category: match[2],
                approved: parseInt(match[1]) >= 5
            };
        }
        
        return { score: 5, category: 'DEFAULT', approved: true };
        
    } catch (error) {
        console.warn(`⚠️ Error evaluando con Gemini: ${error.message}`);
        return { score: 5, category: 'DEFAULT', approved: true };
    }
}

// Función principal automática
async function startAutoScraping() {
    console.log('🚀 N8N Auto-Scraper Automático V4.0');
    console.log('🎯 Objetivo: 30 workflows únicos con evaluación AI');
    console.log('🤖 Powered by Gemini 2.5 Flash + Playwright\\n');
    
    loadExistingWorkflows();
    
    if (state.downloaded >= CONFIG.TARGET_WORKFLOWS) {
        console.log(`✅ Ya tienes ${state.downloaded} workflows válidos. ¡Objetivo alcanzado!`);
        return;
    }
    
    console.log(`📊 Necesitas ${CONFIG.TARGET_WORKFLOWS - state.downloaded} workflows más\\n`);
    
    const startTime = Date.now();
    
    // Lanzar navegador
    console.log('🌐 Iniciando navegador...');
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    const page = await browser.newPage();
    
    try {
        // Navegar a n8n workflows
        console.log(`🔗 Navegando a: ${CONFIG.BASE_URL}`);
        await page.goto(CONFIG.BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        let loadMoreClicks = 0;
        
        while (state.downloaded < CONFIG.TARGET_WORKFLOWS && loadMoreClicks < CONFIG.MAX_LOAD_MORE_CLICKS) {
            console.log(`\\n📄 Procesando página (Load more: ${loadMoreClicks})...`);
            
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
                    console.log(`\\n🎯 Procesando: "${title}"`);
                    
                    // Evaluar con Gemini
                    const evaluation = await evaluateWorkflowWithGemini({ title });
                    console.log(`🤖 Gemini Score: ${evaluation.score}/10 (${evaluation.category})`);
                    
                    if (!evaluation.approved) {
                        console.log(`❌ Workflow rechazado (score < 5)`);
                        continue;
                    }
                    
                    // Descargar el workflow
                    const newPage = await browser.newPage();
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
                                    
                                    if (nodeCount >= CONFIG.MIN_NODES) {
                                        const filename = `workflow-${state.downloaded + 1}-${safeName}.json`;
                                        fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(workflow, null, 2));
                                        
                                        state.downloaded++;
                                        state.downloadedTitles.add(safeName);
                                        
                                        console.log(`✅ Descargado: ${filename} (${nodeCount} nodos)`);
                                        console.log(`📊 Progreso: ${state.downloaded}/${CONFIG.TARGET_WORKFLOWS}`);
                                        
                                        // Cerrar modal con Escape
                                        await newPage.keyboard.press('Escape');
                                    } else {
                                        console.log(`❌ Workflow muy simple (${nodeCount} nodos < ${CONFIG.MIN_NODES})`);
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
                        await newPage.close();
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
                    console.log(`\\n🔄 Buscando botón "Load more"...`);
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
    } finally {
        await browser.close();
    }
    
    // Reporte final
    const duration = Date.now() - startTime;
    const minutes = Math.round(duration / 60000);
    
    console.log('\\n🎉 ¡AUTO-SCRAPER COMPLETADO!\\n');
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`✅ Workflows descargados: ${state.downloaded}/${CONFIG.TARGET_WORKFLOWS}`);
    console.log(`⏱️ Tiempo total: ${minutes} minutos`);
    console.log(`❌ Errores: ${state.errors}`);
    
    if (state.downloaded >= CONFIG.TARGET_WORKFLOWS) {
        console.log('\\n🏆 ¡OBJETIVO ALCANZADO! Tienes 30 workflows únicos y de calidad.');
    } else {
        console.log(`\\n📝 Faltan ${CONFIG.TARGET_WORKFLOWS - state.downloaded} workflows más.`);
    }
}

// Ejecutar
startAutoScraping().catch(console.error);
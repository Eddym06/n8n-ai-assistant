/**
 * Script Automatizado para Descargar 20 Workflows de n8n con más de 7 nodos
 * Ejecuta automáticamente todo el proceso sin intervención manual
 * Progress: 9/20 workflows ya descargados
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

class N8nWorkflowAutomator {
    constructor() {
        this.targetWorkflows = 20; // Meta: 20 workflows
        this.currentCount = 9;     // Ya tenemos 9 workflows descargados
        this.downloadedWorkflows = [
            'building-your-first-whatsapp-chatbot.json',
            'generate-ai-viral-videos-with-seedance.json',
            'generate-ai-viral-videos-with-seedance-and-upload-to-tiktok-youtube-and-instagram.json',
            'automate-multi-platform-social-media-content-creation-with-ai.json',
            'build-your-first-ai-data-analyst-chatbot.json',
            'building-your-first-whatsapp-chatbot-v2.json',
            'rag-chatbot-for-company-documents-using-google-drive-and-gemini.json'
        ];
        this.baseUrl = 'https://n8n.io/workflows/categories/ai/';
        this.downloadPath = 'c:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\';
        this.browser = null;
        this.page = null;
    }

    async init() {
        console.log('🚀 Iniciando automatización completa de n8n workflows...');
        console.log(`📊 Progreso actual: ${this.currentCount}/${this.targetWorkflows} workflows descargados`);
        console.log(`🎯 Necesitamos descargar ${this.targetWorkflows - this.currentCount} workflows más`);
        
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        
        // Configurar timeouts más largos
        this.page.setDefaultTimeout(30000);
        
        console.log('✅ Navegador iniciado correctamente');
    }

    async navigateToWorkflows() {
        console.log('🔄 Navegando a la página de workflows de AI...');
        await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
        await this.page.waitForTimeout(3000);
        console.log('✅ Página de workflows cargada');
    }

    async extractWorkflowLinks() {
        console.log('🔍 Extrayendo enlaces de workflows...');
        
        const workflows = await this.page.evaluate(() => {
            const workflowCards = document.querySelectorAll('[data-testid="workflow-card"]');
            const workflows = [];
            
            workflowCards.forEach(card => {
                try {
                    // Buscar el enlace del workflow
                    const link = card.querySelector('a[href*="/workflows/"]');
                    if (!link) return;
                    
                    const url = link.href;
                    
                    // Extraer título
                    const titleElement = card.querySelector('h3') || card.querySelector('[data-testid="workflow-title"]');
                    const title = titleElement ? titleElement.textContent.trim() : 'Sin título';
                    
                    // Buscar indicador de nodos
                    const nodeElements = card.querySelectorAll('.tooltip, [title*="node"], [aria-label*="node"]');
                    let nodeCount = 0;
                    
                    // Buscar texto que contenga "+X" o números de nodos
                    const allText = card.textContent;
                    const plusMatch = allText.match(/\+(\d+)/);
                    if (plusMatch) {
                        nodeCount = parseInt(plusMatch[1]) + 3; // +X significa X nodos adicionales a los 3 visibles
                    }
                    
                    // Buscar también patrones como "21 nodes" o similares
                    const nodeMatch = allText.match(/(\d+)\s*nodes?/i);
                    if (nodeMatch && parseInt(nodeMatch[1]) > nodeCount) {
                        nodeCount = parseInt(nodeMatch[1]);
                    }
                    
                    // Si encontramos elementos tooltip, contar como indicador de múltiples nodos
                    if (nodeElements.length >= 3 && nodeCount === 0) {
                        nodeCount = nodeElements.length + 4; // Estimación conservadora
                    }
                    
                    workflows.push({
                        url,
                        title,
                        nodeCount,
                        estimatedNodes: nodeCount >= 7
                    });
                } catch (error) {
                    console.log('Error procesando card:', error.message);
                }
            });
            
            return workflows;
        });
        
        // Filtrar workflows con 7+ nodos y que no hayamos descargado ya
        const validWorkflows = workflows.filter(w => {
            const filename = this.generateFilename(w.title);
            const alreadyDownloaded = this.downloadedWorkflows.some(downloaded => 
                downloaded.includes(filename.replace('.json', '').substring(0, 20))
            );
            return w.nodeCount >= 7 && !alreadyDownloaded;
        });
        
        console.log(`📊 Encontrados ${workflows.length} workflows totales`);
        console.log(`✅ Workflows válidos (7+ nodos, no descargados): ${validWorkflows.length}`);
        
        return validWorkflows;
    }

    generateFilename(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 80) + '.json';
    }

    async downloadWorkflow(workflow) {
        try {
            console.log(`\n📥 Descargando: ${workflow.title}`);
            console.log(`🔗 URL: ${workflow.url}`);
            console.log(`📊 Nodos estimados: ${workflow.nodeCount}`);
            
            // Navegar al workflow
            await this.page.goto(workflow.url, { waitUntil: 'networkidle' });
            await this.page.waitForTimeout(2000);
            
            // Buscar y hacer clic en "Use for free"
            const useForFreeButton = await this.page.locator('button:has-text("Use for free")').first();
            if (await useForFreeButton.isVisible()) {
                await useForFreeButton.click();
                await this.page.waitForTimeout(2000);
                console.log('✅ Clicked "Use for free"');
            } else {
                console.log('❌ Botón "Use for free" no encontrado');
                return false;
            }
            
            // Buscar y hacer clic en "Copy template to clipboard (JSON)"
            const copyButton = await this.page.locator('button:has-text("Copy template to clipboard")').first();
            if (await copyButton.isVisible()) {
                await copyButton.click();
                await this.page.waitForTimeout(1000);
                console.log('✅ Clicked "Copy template to clipboard"');
            } else {
                console.log('❌ Botón de copiar no encontrado');
                return false;
            }
            
            // Leer contenido del clipboard
            const clipboardContent = await this.page.evaluate(async () => {
                try {
                    return await navigator.clipboard.readText();
                } catch (error) {
                    console.log('Error reading clipboard:', error);
                    return null;
                }
            });
            
            if (!clipboardContent || !clipboardContent.includes('"nodes"')) {
                console.log('❌ No se pudo obtener el JSON del workflow');
                return false;
            }
            
            // Verificar que el JSON tenga realmente 7+ nodos
            try {
                const workflowData = JSON.parse(clipboardContent);
                const actualNodeCount = workflowData.nodes ? workflowData.nodes.length : 0;
                
                if (actualNodeCount < 7) {
                    console.log(`❌ Workflow solo tiene ${actualNodeCount} nodos, necesitamos 7+`);
                    return false;
                }
                
                console.log(`✅ Verificado: ${actualNodeCount} nodos en el workflow`);
                
                // Guardar archivo
                const filename = this.generateFilename(workflow.title);
                const filepath = path.join(this.downloadPath, filename);
                
                fs.writeFileSync(filepath, clipboardContent, 'utf8');
                console.log(`💾 Guardado: ${filename}`);
                console.log(`📊 Tamaño: ${clipboardContent.length} caracteres`);
                
                // Cerrar modal
                await this.page.locator('button:has-text("Close modal")').first().click();
                await this.page.waitForTimeout(1000);
                
                this.currentCount++;
                this.downloadedWorkflows.push(filename);
                
                console.log(`🎉 Descarga exitosa! Progreso: ${this.currentCount}/${this.targetWorkflows}`);
                return true;
                
            } catch (error) {
                console.log('❌ Error al procesar JSON:', error.message);
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Error descargando workflow: ${error.message}`);
            return false;
        }
    }

    async loadMoreWorkflows() {
        try {
            console.log('🔄 Intentando cargar más workflows...');
            const loadMoreButton = await this.page.locator('button:has-text("Load more")').first();
            
            if (await loadMoreButton.isVisible()) {
                await loadMoreButton.click();
                await this.page.waitForTimeout(3000);
                console.log('✅ Cargados más workflows');
                return true;
            } else {
                console.log('ℹ️ No hay más workflows para cargar');
                return false;
            }
        } catch (error) {
            console.log('❌ Error cargando más workflows:', error.message);
            return false;
        }
    }

    async runAutomation() {
        try {
            await this.init();
            await this.navigateToWorkflows();
            
            let attempts = 0;
            const maxAttempts = 10;
            
            while (this.currentCount < this.targetWorkflows && attempts < maxAttempts) {
                attempts++;
                console.log(`\n🔄 Intento ${attempts}/${maxAttempts}`);
                
                // Extraer workflows disponibles
                const workflows = await this.extractWorkflowLinks();
                
                if (workflows.length === 0) {
                    console.log('🔄 No hay workflows válidos, cargando más...');
                    const loaded = await this.loadMoreWorkflows();
                    if (!loaded) {
                        console.log('❌ No se pudieron cargar más workflows');
                        break;
                    }
                    continue;
                }
                
                // Descargar workflows uno por uno
                let downloadsThisRound = 0;
                for (const workflow of workflows) {
                    if (this.currentCount >= this.targetWorkflows) break;
                    
                    const success = await this.downloadWorkflow(workflow);
                    if (success) {
                        downloadsThisRound++;
                        
                        // Pausa entre descargas para evitar rate limiting
                        if (this.currentCount < this.targetWorkflows) {
                            console.log('⏳ Pausa de 2 segundos antes del siguiente...');
                            await this.page.waitForTimeout(2000);
                        }
                    }
                    
                    // Volver a la lista de workflows después de cada descarga
                    if (this.currentCount < this.targetWorkflows) {
                        await this.navigateToWorkflows();
                    }
                }
                
                // Si no descargamos nada en esta ronda, cargar más
                if (downloadsThisRound === 0) {
                    console.log('🔄 No se descargó nada, cargando más workflows...');
                    const loaded = await this.loadMoreWorkflows();
                    if (!loaded) {
                        console.log('❌ No se pudieron cargar más workflows');
                        break;
                    }
                }
            }
            
            console.log('\n🎉 AUTOMATIZACIÓN COMPLETADA! 🎉');
            console.log(`📊 Workflows descargados: ${this.currentCount}/${this.targetWorkflows}`);
            console.log(`📁 Archivos guardados en: ${this.downloadPath}`);
            console.log('\n📝 Workflows descargados:');
            this.downloadedWorkflows.forEach((filename, index) => {
                console.log(`${index + 1}. ${filename}`);
            });
            
            if (this.currentCount >= this.targetWorkflows) {
                console.log('\n✅ ¡META ALCANZADA! Se han descargado todos los workflows solicitados.');
            } else {
                console.log(`\n⚠️ Se descargaron ${this.currentCount} de ${this.targetWorkflows} workflows solicitados.`);
            }
            
        } catch (error) {
            console.error('❌ Error en la automatización:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
                console.log('🔒 Navegador cerrado');
            }
        }
    }
}

// Ejecutar la automatización
const automator = new N8nWorkflowAutomator();
automator.runAutomation().catch(console.error);

console.log('🤖 Script de automatización iniciado...');
console.log('📋 Este script continuará automáticamente hasta descargar 20 workflows');
console.log('⏰ El proceso puede tomar varios minutos...');
console.log('🔍 Buscando workflows con 7+ nodos en la categoría AI');
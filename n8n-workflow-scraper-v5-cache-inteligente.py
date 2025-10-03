#!/usr/bin/env python3
"""
n8n Workflow Scraper V5.0 - Cache Inteligente y Resumido
Sistema avanzado de scraping con MD5 fingerprints, Gemini 2.5 Flash AI y optimización multi-categoría

Características:
- Cache inteligente con MD5 fingerprints (título + URL + nodos)
- Integración Gemini 2.5 Flash para selección inteligente
- Scraping multi-categoría: AI Chatbot, AI RAG, AI Summarization
- Límite de 60 workflows por categoría
- Detección automática de "Load More"
- Descarga optimizada con validación de duplicados
- Directorio de destino configurado para n8n workflows

Autor: Claude (GitHub Copilot)
Fecha: 2025
"""

import asyncio
import json
import hashlib
import os
import time
import requests
import logging
from datetime import datetime
from typing import Dict, List, Set, Optional, Tuple
from playwright.async_api import async_playwright, Page, Browser
from dataclasses import dataclass, asdict
from pathlib import Path

# Configuración
GEMINI_API_KEY = "AIzaSyB3n0fyoVLdF4Gly7xtqqQlXBlzsXTIsxM"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

TARGET_DIRECTORY = r"C:\Users\eddym\Downloads\n8n-ai-assistant\Workflow de Web n8n"
CACHE_FILE = "cache_workflows_fingerprints.json"
LOG_FILE = "scraper_log.txt"

# Categorías objetivo con límites
TARGET_CATEGORIES = {
    "ai-chatbot": {"name": "AI Chatbot", "limit": 60, "scraped": 0},
    "ai-rag": {"name": "AI RAG", "limit": 60, "scraped": 0},
    "ai-summarization": {"name": "AI Summarization", "limit": 60, "scraped": 0}
}

@dataclass
class WorkflowInfo:
    """Información completa del workflow para cache y procesamiento"""
    title: str
    url: str
    node_count: int
    creator: str
    category: str
    fingerprint: str
    description: str = ""
    gemini_score: float = 0.0
    downloaded: bool = False
    download_path: str = ""
    timestamp: str = ""

class IntelligentCache:
    """Sistema de cache inteligente con MD5 fingerprints"""
    
    def __init__(self, cache_file: str):
        self.cache_file = cache_file
        self.cache: Dict[str, WorkflowInfo] = {}
        self.load_cache()
    
    def load_cache(self):
        """Cargar cache existente"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.cache = {
                        k: WorkflowInfo(**v) for k, v in data.items()
                    }
                logging.info(f"Cache cargado: {len(self.cache)} workflows")
            except Exception as e:
                logging.error(f"Error cargando cache: {e}")
                self.cache = {}
    
    def save_cache(self):
        """Guardar cache al disco"""
        try:
            cache_data = {k: asdict(v) for k, v in self.cache.items()}
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False)
            logging.info(f"Cache guardado: {len(self.cache)} workflows")
        except Exception as e:
            logging.error(f"Error guardando cache: {e}")
    
    def generate_fingerprint(self, title: str, url: str, node_count: int) -> str:
        """Generar MD5 fingerprint único"""
        content = f"{title}|{url}|{node_count}"
        return hashlib.md5(content.encode('utf-8')).hexdigest()
    
    def is_duplicate(self, fingerprint: str) -> bool:
        """Verificar si el workflow ya existe en cache"""
        return fingerprint in self.cache
    
    def add_workflow(self, workflow: WorkflowInfo):
        """Agregar workflow al cache"""
        self.cache[workflow.fingerprint] = workflow
    
    def get_new_workflows(self) -> List[WorkflowInfo]:
        """Obtener workflows no descargados"""
        return [w for w in self.cache.values() if not w.downloaded]

class GeminiAI:
    """Integración con Gemini 2.5 Flash para selección inteligente"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = GEMINI_API_URL
    
    def analyze_workflows(self, workflows: List[WorkflowInfo]) -> List[WorkflowInfo]:
        """Analizar workflows con Gemini y asignar puntuaciones"""
        if not workflows:
            return workflows
        
        # Preparar prompt para Gemini
        workflow_data = []
        for i, w in enumerate(workflows[:10]):  # Límite de 10 por análisis
            workflow_data.append({
                "index": i,
                "title": w.title,
                "category": w.category,
                "node_count": w.node_count,
                "creator": w.creator
            })
        
        prompt = f"""
        Analiza estos workflows de n8n y asigna una puntuación de utilidad del 1-10 basándote en:
        - Innovación y complejidad técnica
        - Aplicabilidad práctica en negocios
        - Calidad aparente del creador
        - Relevancia de la categoría
        
        Workflows: {json.dumps(workflow_data, indent=2)}
        
        Responde SOLO con un JSON válido en este formato:
        {{"scores": [{{"index": 0, "score": 8.5, "reason": "Descripción breve"}}, ...]}}
        """
        
        try:
            response = self._call_gemini_api(prompt)
            return self._process_gemini_response(response, workflows)
        except Exception as e:
            logging.error(f"Error con Gemini AI: {e}")
            # Asignar puntuaciones por defecto
            for w in workflows:
                w.gemini_score = 5.0
            return workflows
    
    def _call_gemini_api(self, prompt: str) -> dict:
        """Llamar a la API de Gemini"""
        headers = {
            "Content-Type": "application/json",
        }
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "topK": 32,
                "topP": 1,
                "maxOutputTokens": 2048,
            }
        }
        
        response = requests.post(
            f"{self.api_url}?key={self.api_key}",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    
    def _process_gemini_response(self, response: dict, workflows: List[WorkflowInfo]) -> List[WorkflowInfo]:
        """Procesar respuesta de Gemini y asignar puntuaciones"""
        try:
            text = response['candidates'][0]['content']['parts'][0]['text']
            # Limpiar respuesta (remover markdown si existe)
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0]
            
            data = json.loads(text.strip())
            scores = data.get('scores', [])
            
            for score_data in scores:
                index = score_data.get('index', 0)
                score = score_data.get('score', 5.0)
                reason = score_data.get('reason', 'Sin análisis')
                
                if 0 <= index < len(workflows):
                    workflows[index].gemini_score = float(score)
                    workflows[index].description = reason
            
            logging.info(f"Gemini analizó {len(scores)} workflows")
            return workflows
            
        except Exception as e:
            logging.error(f"Error procesando respuesta de Gemini: {e}")
            # Asignar puntuaciones por defecto
            for w in workflows:
                w.gemini_score = 5.0
            return workflows

class N8nWorkflowScraper:
    """Scraper principal con cache inteligente"""
    
    def __init__(self):
        self.cache = IntelligentCache(CACHE_FILE)
        self.gemini = GeminiAI(GEMINI_API_KEY)
        self.setup_logging()
        self.ensure_directory()
    
    def setup_logging(self):
        """Configurar logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(LOG_FILE, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
    
    def ensure_directory(self):
        """Crear directorio de destino"""
        Path(TARGET_DIRECTORY).mkdir(parents=True, exist_ok=True)
        logging.info(f"Directorio de destino: {TARGET_DIRECTORY}")
    
    async def run_scraping(self):
        """Ejecutar scraping completo"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            
            try:
                total_scraped = 0
                for category_key, category_info in TARGET_CATEGORIES.items():
                    logging.info(f"\n🎯 Iniciando scraping: {category_info['name']}")
                    
                    page = await browser.new_page()
                    scraped_count = await self.scrape_category(page, category_key, category_info)
                    
                    category_info['scraped'] = scraped_count
                    total_scraped += scraped_count
                    
                    await page.close()
                    await asyncio.sleep(2)  # Pausa entre categorías
                
                # Guardar cache después del scraping
                self.cache.save_cache()
                
                # Análisis con Gemini y descarga
                await self.process_and_download()
                
                self.print_summary(total_scraped)
                
            finally:
                await browser.close()
    
    async def scrape_category(self, page: Page, category_key: str, category_info: dict) -> int:
        """Scraper específico por categoría"""
        url = f"https://n8n.io/workflows/categories/{category_key}/"
        
        try:
            await page.goto(url, wait_until='networkidle')
            await asyncio.sleep(3)
            
            # Aceptar cookies si aparecen
            try:
                await page.click('button:has-text("Accept")', timeout=5000)
                await asyncio.sleep(1)
            except:
                pass
            
            scraped_workflows = []
            load_more_clicks = 0
            max_load_more = 3  # Máximo 3 clics en "Load More"
            
            while len(scraped_workflows) < category_info['limit']:
                # Extraer workflows actuales
                new_workflows = await self.extract_workflows_from_page(page, category_info['name'])
                
                # Filtrar duplicados usando cache
                unique_workflows = []
                for workflow in new_workflows:
                    if not self.cache.is_duplicate(workflow.fingerprint):
                        unique_workflows.append(workflow)
                        self.cache.add_workflow(workflow)
                
                scraped_workflows.extend(unique_workflows)
                logging.info(f"📥 {category_info['name']}: {len(unique_workflows)} nuevos, {len(scraped_workflows)} total")
                
                # Intentar cargar más workflows
                if len(scraped_workflows) < category_info['limit'] and load_more_clicks < max_load_more:
                    try:
                        load_more_button = page.locator('button:has-text("Load more"), button:has-text("Show more"), a:has-text("See more")')
                        if await load_more_button.count() > 0:
                            await load_more_button.first.click()
                            await asyncio.sleep(3)
                            load_more_clicks += 1
                            logging.info(f"🔄 Cargando más... (clic #{load_more_clicks})")
                        else:
                            logging.info(f"❌ No se encontró botón 'Load More' en {category_info['name']}")
                            break
                    except Exception as e:
                        logging.error(f"Error haciendo clic en 'Load More': {e}")
                        break
                else:
                    break
            
            return len(scraped_workflows)
            
        except Exception as e:
            logging.error(f"Error scrapeando {category_key}: {e}")
            return 0
    
    async def extract_workflows_from_page(self, page: Page, category: str) -> List[WorkflowInfo]:
        """Extraer información de workflows de la página actual"""
        workflows = []
        
        try:
            # Ejecutar JavaScript para extraer información
            workflow_data = await page.evaluate("""
                () => {
                    const workflows = [];
                    const workflowCards = document.querySelectorAll('a[href*="/workflows/"][href*="-"]');
                    
                    workflowCards.forEach((card, index) => {
                        try {
                            // Extraer título
                            const titleElement = card.querySelector('h3');
                            const title = titleElement ? titleElement.textContent.trim() : 'Sin título';
                            
                            // Filtrar enlaces que no son workflows reales
                            if (!title || title === 'Sin título' || !card.href.includes('/workflows/') || card.href.includes('/categories/')) {
                                return;
                            }
                            
                            const url = card.href;
                            
                            // Extraer número de nodos
                            let nodeCount = 0;
                            const nodeList = card.querySelector('ul');
                            if (nodeList) {
                                const nodeItems = nodeList.querySelectorAll('li');
                                nodeItems.forEach(item => {
                                    const tooltip = item.querySelector('[role="tooltip"]');
                                    if (tooltip) {
                                        const nodeName = tooltip.textContent.trim();
                                        if (nodeName.startsWith('+')) {
                                            const additionalNodes = parseInt(nodeName.replace('+', ''));
                                            nodeCount += additionalNodes;
                                        } else {
                                            nodeCount++;
                                        }
                                    }
                                });
                            }
                            
                            // Extraer creador
                            const creatorImg = card.querySelector('img[alt*="Created by"]');
                            const creator = creatorImg ? 
                                creatorImg.alt.replace('Created by: ', '').split(' || ')[0] : 
                                'Desconocido';
                            
                            workflows.push({
                                title,
                                url,
                                nodeCount,
                                creator
                            });
                            
                        } catch (error) {
                            console.error('Error extrayendo workflow:', error);
                        }
                    });
                    
                    return workflows;
                }
            """)
            
            # Convertir a objetos WorkflowInfo
            for data in workflow_data:
                fingerprint = self.cache.generate_fingerprint(
                    data['title'], 
                    data['url'], 
                    data['nodeCount']
                )
                
                workflow = WorkflowInfo(
                    title=data['title'],
                    url=data['url'],
                    node_count=data['nodeCount'],
                    creator=data['creator'],
                    category=category,
                    fingerprint=fingerprint,
                    timestamp=datetime.now().isoformat()
                )
                
                workflows.append(workflow)
            
            logging.info(f"✅ Extraídos {len(workflows)} workflows de {category}")
            return workflows
            
        except Exception as e:
            logging.error(f"Error extrayendo workflows: {e}")
            return []
    
    async def process_and_download(self):
        """Procesar con Gemini y descargar workflows seleccionados"""
        new_workflows = self.cache.get_new_workflows()
        
        if not new_workflows:
            logging.info("📭 No hay workflows nuevos para procesar")
            return
        
        logging.info(f"🤖 Procesando {len(new_workflows)} workflows con Gemini AI...")
        
        # Procesar en lotes de 10
        for i in range(0, len(new_workflows), 10):
            batch = new_workflows[i:i+10]
            analyzed_batch = self.gemini.analyze_workflows(batch)
            
            # Actualizar cache con análisis
            for workflow in analyzed_batch:
                self.cache.add_workflow(workflow)
            
            await asyncio.sleep(1)  # Pausa entre lotes
        
        # Ordenar por puntuación Gemini (mayor a menor)
        sorted_workflows = sorted(
            new_workflows, 
            key=lambda w: w.gemini_score, 
            reverse=True
        )
        
        # Descargar los mejores workflows
        top_workflows = sorted_workflows[:20]  # Top 20 workflows
        
        logging.info(f"⬇️ Descargando top {len(top_workflows)} workflows...")
        
        for workflow in top_workflows:
            try:
                await self.download_workflow(workflow)
                workflow.downloaded = True
                self.cache.add_workflow(workflow)
                await asyncio.sleep(0.5)  # Pausa entre descargas
            except Exception as e:
                logging.error(f"Error descargando {workflow.title}: {e}")
        
        # Guardar cache actualizado
        self.cache.save_cache()
    
    async def download_workflow(self, workflow: WorkflowInfo):
        """Descargar archivo JSON del workflow"""
        try:
            # Construir URL de descarga
            workflow_id = workflow.url.split('/')[-2] if workflow.url.endswith('/') else workflow.url.split('/')[-1]
            download_url = f"https://n8n.io/api/workflows/{workflow_id}"
            
            # Crear nombre de archivo seguro
            safe_title = "".join(c for c in workflow.title if c.isalnum() or c in (' ', '-', '_')).strip()
            safe_title = safe_title.replace(' ', '_')[:100]  # Límite de caracteres
            
            filename = f"{safe_title}_{workflow_id}.json"
            filepath = os.path.join(TARGET_DIRECTORY, filename)
            
            # Descargar archivo
            response = requests.get(download_url, timeout=30)
            response.raise_for_status()
            
            # Guardar archivo
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(response.json(), f, indent=2, ensure_ascii=False)
            
            workflow.download_path = filepath
            logging.info(f"✅ Descargado: {workflow.title} (Score: {workflow.gemini_score})")
            
        except Exception as e:
            logging.error(f"❌ Error descargando {workflow.title}: {e}")
    
    def print_summary(self, total_scraped: int):
        """Imprimir resumen final"""
        print("\n" + "="*80)
        print("🎉 RESUMEN FINAL - Cache Inteligente y Resumido")
        print("="*80)
        
        print(f"📊 Total workflows scrapeados: {total_scraped}")
        print(f"💾 Total en cache: {len(self.cache.cache)}")
        
        print("\n📈 Por categoría:")
        for category_key, category_info in TARGET_CATEGORIES.items():
            print(f"  • {category_info['name']}: {category_info['scraped']}/{category_info['limit']}")
        
        # Estadísticas de descarga
        downloaded = sum(1 for w in self.cache.cache.values() if w.downloaded)
        print(f"\n⬇️ Workflows descargados: {downloaded}")
        print(f"📁 Directorio: {TARGET_DIRECTORY}")
        
        # Top workflows por puntuación Gemini
        top_workflows = sorted(
            [w for w in self.cache.cache.values() if w.gemini_score > 0], 
            key=lambda w: w.gemini_score, 
            reverse=True
        )[:5]
        
        if top_workflows:
            print(f"\n🏆 Top 5 workflows (Gemini Score):")
            for i, w in enumerate(top_workflows, 1):
                print(f"  {i}. {w.title} - Score: {w.gemini_score} ({w.category})")
        
        print(f"\n📋 Archivos generados:")
        print(f"  • Cache: {CACHE_FILE}")
        print(f"  • Log: {LOG_FILE}")
        print("\n" + "="*80)

async def main():
    """Función principal"""
    print("🚀 n8n Workflow Scraper V5.0 - Cache Inteligente y Resumido")
    print("🎯 Categorías: AI Chatbot, AI RAG, AI Summarization")
    print("🤖 AI: Gemini 2.5 Flash")
    print("💾 Cache: MD5 Fingerprints")
    print("⚡ Límite: 60 workflows por categoría\n")
    
    scraper = N8nWorkflowScraper()
    await scraper.run_scraping()

if __name__ == "__main__":
    asyncio.run(main())
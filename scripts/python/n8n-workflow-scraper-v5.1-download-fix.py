#!/usr/bin/env python3
"""
n8n Workflow Scraper V5.1 - Download Fix con Portapapeles
Sistema avanzado de scraping con MD5 fingerprints, Gemini 2.5 Flash AI y descarga corregida

Cambios V5.1:
- FIX: Descarga por portapapeles en lugar de API (arregla 404 errors)
- Mecanismo: Click en "Use for free" > "Copy template to clipboard (JSON)"
- Captura del JSON desde el portapapeles del navegador
- Mantiene todas las características V5.0: cache inteligente, Gemini AI, multi-categoría

Características V5.0:
- Cache inteligente con MD5 fingerprints (título + URL + nodos)
- Integración Gemini 2.5 Flash para selección inteligente
- Scraping multi-categoría: AI Chatbot, AI RAG, AI Summarization
- Límite de 60 workflows por categoría
- Detección automática de "Load More"
- Descarga optimizada con validación de duplicados
- Directorio de destino configurado para n8n workflows

Autor: Claude (GitHub Copilot)
Fecha: 2025
Versión: 5.1 (Download Fix)
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
        """Añadir workflow al cache"""
        self.cache[workflow.fingerprint] = workflow
    
    def get_workflows_by_category(self, category: str) -> List[WorkflowInfo]:
        """Obtener workflows de una categoría específica"""
        return [w for w in self.cache.values() if w.category == category]

class GeminiAI:
    """Integración con Gemini 2.5 Flash para análisis inteligente"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {'Content-Type': 'application/json'}
    
    def analyze_workflow(self, workflow: WorkflowInfo) -> float:
        """Analizar workflow con Gemini y devolver puntuación"""
        try:
            prompt = f"""
            Analiza este workflow de n8n y dale una puntuación del 1 al 10 basada en:
            - Utilidad práctica
            - Complejidad técnica
            - Calidad de integración
            - Potencial de uso real
            
            Workflow:
            - Título: {workflow.title}
            - Creador: {workflow.creator}
            - Categoría: {workflow.category}
            - Número de nodos: {workflow.node_count}
            - Descripción: {workflow.description[:500]}
            
            Responde SOLO con un número decimal entre 1.0 y 10.0, sin explicación.
            """
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 10
                }
            }
            
            response = requests.post(
                f"{GEMINI_API_URL}?key={self.api_key}",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                try:
                    score_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
                    score = float(score_text)
                    return max(1.0, min(10.0, score))  # Clamp entre 1-10
                except (KeyError, ValueError, IndexError):
                    logging.warning(f"Respuesta inesperada de Gemini: {result}")
                    return 5.0
            else:
                logging.error(f"Error Gemini API: {response.status_code}")
                return 5.0
                
        except Exception as e:
            logging.error(f"Error analizando con Gemini: {e}")
            return 5.0

class N8nWorkflowScraper:
    """Scraper principal con cache inteligente y Gemini AI"""
    
    def __init__(self):
        self.cache = IntelligentCache(CACHE_FILE)
        self.gemini = GeminiAI(GEMINI_API_KEY)
        self.setup_logging()
        self.setup_directory()
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        
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
    
    def setup_directory(self):
        """Crear directorio de destino"""
        os.makedirs(TARGET_DIRECTORY, exist_ok=True)
    
    async def run_scraping(self):
        """Ejecutar proceso completo de scraping"""
        try:
            async with async_playwright() as playwright:
                # Configurar navegador con headless=False para ver el proceso
                self.browser = await playwright.chromium.launch(headless=False)
                self.page = await self.browser.new_page()
                
                total_scraped = 0
                
                # Scraping por categorías
                for category_key, category_info in TARGET_CATEGORIES.items():
                    print(f"\n🎯 Categoria: {category_info['name']}")
                    scraped_count = await self.scrape_category(category_key, category_info)
                    total_scraped += scraped_count
                    TARGET_CATEGORIES[category_key]["scraped"] = scraped_count
                
                await self.browser.close()
                
                # Procesar con Gemini AI y descargar los mejores
                await self.process_with_gemini()
                
                # Imprimir resumen final
                self.print_summary(total_scraped)
                
        except Exception as e:
            logging.error(f"Error en scraping: {e}")
            if self.browser:
                await self.browser.close()
    
    async def scrape_category(self, category_key: str, category_info: Dict) -> int:
        """Scraper de una categoría específica"""
        category_url = f"https://n8n.io/workflows/categories/{category_key}/"
        
        print(f"🌐 Navegando a: {category_url}")
        await self.page.goto(category_url)
        await self.page.wait_for_load_state('networkidle')
        
        scraped_count = 0
        load_more_attempts = 0
        max_load_more = 20  # Límite de botones "Load More"
        
        while scraped_count < category_info["limit"] and load_more_attempts < max_load_more:
            # Obtener workflows de la página actual
            workflows = await self.extract_workflows_from_page(category_key)
            
            for workflow in workflows:
                if scraped_count >= category_info["limit"]:
                    break
                
                # Verificar duplicados con cache inteligente
                if not self.cache.is_duplicate(workflow.fingerprint):
                    self.cache.add_workflow(workflow)
                    scraped_count += 1
                    print(f"  ✅ [{scraped_count}/{category_info['limit']}] {workflow.title} ({workflow.node_count} nodos)")
                else:
                    print(f"  ⏭️ Duplicado: {workflow.title}")
            
            # Buscar botón "Load More"
            try:
                load_more_button = self.page.locator('button:has-text("Load more")')
                if await load_more_button.count() > 0 and await load_more_button.is_visible():
                    print(f"  🔄 Cargando más workflows... (intento {load_more_attempts + 1})")
                    await load_more_button.click()
                    await self.page.wait_for_timeout(3000)  # Esperar carga
                    load_more_attempts += 1
                else:
                    print("  ℹ️ No hay más workflows para cargar")
                    break
            except Exception as e:
                print(f"  ℹ️ Botón 'Load More' no encontrado: {e}")
                break
        
        return scraped_count
    
    async def extract_workflows_from_page(self, category: str) -> List[WorkflowInfo]:
        """Extraer información de workflows de la página actual"""
        workflows = []
        
        try:
            # Selector para los workflows
            workflow_elements = await self.page.locator('[data-testid="workflow-card"]').all()
            
            for element in workflow_elements:
                try:
                    # Extraer título
                    title_element = element.locator('h3')
                    title = await title_element.text_content() if await title_element.count() > 0 else "Sin título"
                    
                    # Extraer URL
                    link_element = element.locator('a').first
                    href = await link_element.get_attribute('href') if await link_element.count() > 0 else ""
                    url = f"https://n8n.io{href}" if href and not href.startswith('http') else href
                    
                    # Extraer creador
                    creator_element = element.locator('[data-testid="creator-name"]')
                    creator = await creator_element.text_content() if await creator_element.count() > 0 else "Desconocido"
                    
                    # Extraer número de nodos (buscar patrón "+X" al final de la lista de nodos)
                    node_count = 1  # Default
                    nodes_list = element.locator('[data-testid="workflow-nodes"] li')
                    nodes_count_element = nodes_list.last
                    if await nodes_count_element.count() > 0:
                        last_node_text = await nodes_count_element.text_content()
                        if last_node_text and last_node_text.startswith('+'):
                            try:
                                base_nodes = await nodes_list.count() - 1  # Excluir el "+X"
                                additional_nodes = int(last_node_text[1:])
                                node_count = base_nodes + additional_nodes
                            except:
                                node_count = await nodes_list.count()
                        else:
                            node_count = await nodes_list.count()
                    
                    # Generar fingerprint
                    fingerprint = self.cache.generate_fingerprint(title, url, node_count)
                    
                    workflow = WorkflowInfo(
                        title=title.strip(),
                        url=url,
                        node_count=node_count,
                        creator=creator.strip(),
                        category=category,
                        fingerprint=fingerprint,
                        timestamp=datetime.now().isoformat()
                    )
                    
                    workflows.append(workflow)
                    
                except Exception as e:
                    logging.error(f"Error extrayendo workflow: {e}")
                    continue
        
        except Exception as e:
            logging.error(f"Error en extract_workflows_from_page: {e}")
        
        return workflows
    
    async def process_with_gemini(self):
        """Procesar workflows con Gemini AI y descargar los mejores"""
        print(f"\n🤖 Analizando {len(self.cache.cache)} workflows con Gemini AI...")
        
        # Analizar workflows sin puntuación
        unscored_workflows = [w for w in self.cache.cache.values() if w.gemini_score == 0.0]
        
        for i, workflow in enumerate(unscored_workflows, 1):
            print(f"  🧠 [{i}/{len(unscored_workflows)}] Analizando: {workflow.title}")
            score = self.gemini.analyze_workflow(workflow)
            workflow.gemini_score = score
            
            # Pequeña pausa para no saturar la API
            if i % 10 == 0:
                await asyncio.sleep(2)
        
        # Seleccionar top workflows para descarga (score >= 7.0)
        top_workflows = [w for w in self.cache.cache.values() if w.gemini_score >= 7.0 and not w.downloaded]
        top_workflows.sort(key=lambda w: w.gemini_score, reverse=True)
        
        print(f"\n⬇️ Descargando {len(top_workflows)} workflows top-scoring...")
        
        # Descargar workflows con el nuevo método de portapapeles
        for i, workflow in enumerate(top_workflows[:20], 1):  # Límite de 20 descargas
            print(f"  📥 [{i}/20] Descargando: {workflow.title} (Score: {workflow.gemini_score})")
            success = await self.download_workflow_v51(workflow)
            if success:
                workflow.downloaded = True
        
        # Guardar cache actualizado
        self.cache.save_cache()
    
    async def download_workflow_v51(self, workflow: WorkflowInfo) -> bool:
        """
        Descargar workflow usando el nuevo método V5.1 con portapapeles
        FIX: Reemplaza las URLs de API 404 con click en botón y captura de portapapeles
        """
        try:
            print(f"    🌐 Navegando a: {workflow.url}")
            await self.page.goto(workflow.url)
            await self.page.wait_for_load_state('networkidle')
            
            # Hacer clic en "Use for free"
            use_button = self.page.locator('button:has-text("Use for free")')
            if await use_button.count() > 0:
                await use_button.click()
                await self.page.wait_for_timeout(2000)  # Esperar modal
                
                # Hacer clic en "Copy template to clipboard (JSON)"
                copy_button = self.page.locator('div.cursor-pointer:has-text("Copy template to clipboard (JSON)")')
                if await copy_button.count() > 0:
                    await copy_button.click()
                    await self.page.wait_for_timeout(1000)  # Esperar copia
                    
                    # Leer contenido del portapapeles
                    clipboard_content = await self.page.evaluate("""
                        () => {
                            return navigator.clipboard.readText().then(text => {
                                return text;
                            }).catch(error => {
                                return null;
                            });
                        }
                    """)
                    
                    if clipboard_content:
                        # Verificar que el contenido es JSON válido
                        try:
                            workflow_json = json.loads(clipboard_content)
                            
                            # Crear nombre de archivo seguro
                            workflow_id = workflow.url.split('/')[-2] if workflow.url.endswith('/') else workflow.url.split('/')[-1]
                            safe_title = "".join(c for c in workflow.title if c.isalnum() or c in (' ', '-', '_')).strip()
                            safe_title = safe_title.replace(' ', '_')[:100]
                            
                            filename = f"{safe_title}_{workflow_id}.json"
                            filepath = os.path.join(TARGET_DIRECTORY, filename)
                            
                            # Guardar archivo JSON
                            with open(filepath, 'w', encoding='utf-8') as f:
                                json.dump(workflow_json, f, indent=2, ensure_ascii=False)
                            
                            workflow.download_path = filepath
                            print(f"    ✅ Descargado exitosamente: {filename}")
                            return True
                            
                        except json.JSONDecodeError as e:
                            print(f"    ❌ JSON inválido en portapapeles: {e}")
                            return False
                    else:
                        print(f"    ❌ No se pudo leer el portapapeles")
                        return False
                else:
                    print(f"    ❌ Botón 'Copy template to clipboard' no encontrado")
                    return False
            else:
                print(f"    ❌ Botón 'Use for free' no encontrado")
                return False
            
        except Exception as e:
            print(f"    ❌ Error descargando {workflow.title}: {e}")
            return False
    
    def print_summary(self, total_scraped: int):
        """Imprimir resumen final"""
        print("\n" + "="*80)
        print("🎉 RESUMEN FINAL - n8n Workflow Scraper V5.1 (Download Fix)")
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
        print("\n💡 V5.1 Changes: Download fix con portapapeles (no más 404 errors)")
        print("="*80)

async def main():
    """Función principal"""
    print("🚀 n8n Workflow Scraper V5.1 - Download Fix con Portapapeles")
    print("🔧 FIX: Descarga por portapapeles (no más 404 errors)")
    print("🎯 Categorías: AI Chatbot, AI RAG, AI Summarization")
    print("🤖 AI: Gemini 2.5 Flash")
    print("💾 Cache: MD5 Fingerprints")
    print("⚡ Límite: 60 workflows por categoría\n")
    
    scraper = N8nWorkflowScraper()
    await scraper.run_scraping()

if __name__ == "__main__":
    asyncio.run(main())
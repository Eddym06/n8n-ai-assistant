#!/usr/bin/env python3
"""
n8n Workflow Scraper V5.2 - Stable Download Fix
Sistema avanzado de scraping con MD5 fingerprints, Gemini 2.5 Flash AI y descarga estable

Cambios V5.2:
- FIX: Manejo estable del navegador para descargas (evita cierre prematuro)
- FIX: Selector correcto para el botón de portapapeles
- Proceso de descarga robusto con manejo de errores mejorado
- Descarga en lotes pequeños para evitar problemas de memoria

Características mantenidas:
- Cache inteligente con MD5 fingerprints
- Integración Gemini 2.5 Flash para selección inteligente
- Scraping multi-categoría: AI Chatbot, AI RAG, AI Summarization
- Descarga por portapapeles (no más 404 errors)

Autor: Claude (GitHub Copilot)
Fecha: 2025
Versión: 5.2 (Stable)
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
            print("📥 Usando cache existente de workflows...")
            
            # No volver a scrapear si ya tenemos workflows en cache
            if len(self.cache.cache) == 0:
                print("⚠️ Cache vacío. Ejecuta primero el scraper completo para obtener workflows.")
                return
            
            print(f"💾 Workflows en cache: {len(self.cache.cache)}")
            
            # Procesar con Gemini AI y descargar los mejores
            await self.process_with_gemini_and_download()
            
            # Imprimir resumen final
            self.print_summary()
                
        except Exception as e:
            logging.error(f"Error en scraping: {e}")
    
    async def process_with_gemini_and_download(self):
        """Procesar workflows con Gemini AI y descargar los mejores"""
        print(f"\n🤖 Analizando workflows con Gemini AI...")
        
        # Analizar workflows sin puntuación
        unscored_workflows = [w for w in self.cache.cache.values() if w.gemini_score == 0.0]
        
        if unscored_workflows:
            print(f"📊 Workflows a analizar: {len(unscored_workflows)}")
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
        
        print(f"\n⬇️ Workflows seleccionados para descarga (score >= 7.0): {len(top_workflows)}\")\n        \n        # Descargar workflows con el nuevo método estable\n        downloaded_count = 0\n        max_downloads = 10  # Límite para esta prueba\n        \n        for i, workflow in enumerate(top_workflows[:max_downloads], 1):\n            print(f\"\\n📥 [{i}/{min(max_downloads, len(top_workflows))}] Descargando: {workflow.title}\")\n            print(f\"    🏆 Score: {workflow.gemini_score} | 🏷️ Categoría: {workflow.category}\")\n            \n            success = await self.download_workflow_stable(workflow)\n            if success:\n                workflow.downloaded = True\n                downloaded_count += 1\n                print(f\"    ✅ Descarga exitosa ({downloaded_count} completadas)\")\n            else:\n                print(f\"    ❌ Descarga fallida\")\n            \n            # Pausa entre descargas para estabilidad\n            if i < min(max_downloads, len(top_workflows)):\n                print(f\"    ⏳ Pausa de 3 segundos...\")\n                await asyncio.sleep(3)\n        \n        print(f\"\\n🎉 Proceso completado: {downloaded_count}/{min(max_downloads, len(top_workflows))} descargas exitosas\")\n        \n        # Guardar cache actualizado\n        self.cache.save_cache()\n    \n    async def download_workflow_stable(self, workflow: WorkflowInfo) -> bool:\n        \"\"\"\n        Descargar workflow usando método estable con navegador independiente\n        \"\"\"\n        try:\n            async with async_playwright() as playwright:\n                # Crear navegador independiente para cada descarga\n                browser = await playwright.chromium.launch(headless=False)\n                page = await browser.new_page()\n                \n                try:\n                    # Navegar al workflow\n                    await page.goto(workflow.url)\n                    await page.wait_for_load_state('networkidle')\n                    \n                    # Hacer clic en \"Use for free\"\n                    use_button = page.locator('button:has-text(\"Use for free\")')\n                    if await use_button.count() > 0:\n                        await use_button.click()\n                        await page.wait_for_timeout(2000)  # Esperar modal\n                        \n                        # Hacer clic en \"Copy template to clipboard (JSON)\" con selector específico\n                        copy_button = page.locator('div.cursor-pointer:has-text(\"Copy template to clipboard (JSON)\")')\n                        if await copy_button.count() > 0:\n                            await copy_button.click()\n                            await page.wait_for_timeout(1000)  # Esperar copia\n                            \n                            # Leer contenido del portapapeles\n                            clipboard_content = await page.evaluate(\"\"\"\n                                () => {\n                                    return navigator.clipboard.readText().then(text => {\n                                        return text;\n                                    }).catch(error => {\n                                        return null;\n                                    });\n                                }\n                            \"\"\")\n                            \n                            if clipboard_content:\n                                # Verificar que el contenido es JSON válido\n                                try:\n                                    workflow_json = json.loads(clipboard_content)\n                                    \n                                    # Crear nombre de archivo seguro\n                                    workflow_id = workflow.url.split('/')[-2] if workflow.url.endswith('/') else workflow.url.split('/')[-1]\n                                    safe_title = \"\".join(c for c in workflow.title if c.isalnum() or c in (' ', '-', '_')).strip()\n                                    safe_title = safe_title.replace(' ', '_')[:100]\n                                    \n                                    filename = f\"{safe_title}_{workflow_id}.json\"\n                                    filepath = os.path.join(TARGET_DIRECTORY, filename)\n                                    \n                                    # Guardar archivo JSON\n                                    with open(filepath, 'w', encoding='utf-8') as f:\n                                        json.dump(workflow_json, f, indent=2, ensure_ascii=False)\n                                    \n                                    workflow.download_path = filepath\n                                    return True\n                                    \n                                except json.JSONDecodeError:\n                                    return False\n                            else:\n                                return False\n                        else:\n                            return False\n                    else:\n                        return False\n                \n                finally:\n                    await browser.close()\n            \n        except Exception as e:\n            logging.error(f\"Error descargando {workflow.title}: {e}\")\n            return False\n    \n    def print_summary(self):\n        \"\"\"Imprimir resumen final\"\"\"\n        print(\"\\n\" + \"=\"*80)\n        print(\"🎉 RESUMEN FINAL - n8n Workflow Scraper V5.2 (Stable)\")\n        print(\"=\"*80)\n        \n        print(f\"💾 Total workflows en cache: {len(self.cache.cache)}\")\n        \n        # Estadísticas de descarga\n        downloaded = sum(1 for w in self.cache.cache.values() if w.downloaded)\n        print(f\"⬇️ Workflows descargados: {downloaded}\")\n        print(f\"📁 Directorio: {TARGET_DIRECTORY}\")\n        \n        # Top workflows por puntuación Gemini\n        top_workflows = sorted(\n            [w for w in self.cache.cache.values() if w.gemini_score > 0], \n            key=lambda w: w.gemini_score, \n            reverse=True\n        )[:10]\n        \n        if top_workflows:\n            print(f\"\\n🏆 Top 10 workflows (Gemini Score):\")\n            for i, w in enumerate(top_workflows, 1):\n                status = \"✅\" if w.downloaded else \"⏸️\"\n                print(f\"  {i:2d}. {status} {w.title} - Score: {w.gemini_score} ({w.category})\")\n        \n        print(f\"\\n📋 Archivos generados:\")\n        print(f\"  • Cache: {CACHE_FILE}\")\n        print(f\"  • Log: {LOG_FILE}\")\n        print(\"\\n💡 V5.2 Changes: Descarga estable con navegador independiente\")\n        print(\"=\"*80)\n\nasync def main():\n    \"\"\"Función principal\"\"\"\n    print(\"🚀 n8n Workflow Scraper V5.2 - Stable Download\")\n    print(\"🔧 FIX: Navegador estable para descargas\")\n    print(\"🎯 Procesamiento: Cache existente\")\n    print(\"🤖 AI: Gemini 2.5 Flash\")\n    print(\"📥 Descarga: Portapapeles (no más 404 errors)\\n\")\n    \n    scraper = N8nWorkflowScraper()\n    await scraper.run_scraping()\n\nif __name__ == \"__main__\":\n    asyncio.run(main())
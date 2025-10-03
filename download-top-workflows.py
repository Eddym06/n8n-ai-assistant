#!/usr/bin/env python3
"""
Download Top Workflows - Versión simple y directa
Descarga los mejores workflows usando el cache existente y el método de portapapeles funcional
"""

import asyncio
import json
import os
import logging
from datetime import datetime
from typing import Dict, List
from playwright.async_api import async_playwright
from dataclasses import dataclass

TARGET_DIRECTORY = r"C:\Users\eddym\Downloads\n8n-ai-assistant\Workflow de Web n8n"
CACHE_FILE = "cache_workflows_fingerprints.json"

@dataclass
class WorkflowInfo:
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

class WorkflowDownloader:
    def __init__(self):
        self.cache = {}
        self.load_cache()
        os.makedirs(TARGET_DIRECTORY, exist_ok=True)
    
    def load_cache(self):
        """Cargar cache existente"""
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.cache = {
                        k: WorkflowInfo(**v) for k, v in data.items()
                    }
                print(f"Cache cargado: {len(self.cache)} workflows")
            except Exception as e:
                print(f"Error cargando cache: {e}")
                self.cache = {}
    
    def save_cache(self):
        """Guardar cache actualizado"""
        try:
            cache_data = {k: vars(v) for k, v in self.cache.items()}
            with open(CACHE_FILE, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False)
            print("Cache actualizado y guardado")
        except Exception as e:
            print(f"Error guardando cache: {e}")
    
    async def download_workflow(self, workflow: WorkflowInfo) -> bool:
        """Descargar un workflow usando portapapeles"""
        try:
            async with async_playwright() as playwright:
                browser = await playwright.chromium.launch(headless=False)
                page = await browser.new_page()
                
                try:
                    print(f"    Navegando a: {workflow.url}")
                    await page.goto(workflow.url)
                    await page.wait_for_load_state('networkidle')
                    
                    # Click "Use for free"
                    use_button = page.locator('button:has-text("Use for free")')
                    if await use_button.count() > 0:
                        await use_button.click()
                        await page.wait_for_timeout(2000)
                        
                        # Click copy button
                        copy_button = page.locator('div.cursor-pointer:has-text("Copy template to clipboard (JSON)")')
                        if await copy_button.count() > 0:
                            await copy_button.click()
                            await page.wait_for_timeout(1000)
                            
                            # Read clipboard
                            clipboard_content = await page.evaluate("""
                                () => {
                                    return navigator.clipboard.readText().then(text => {
                                        return text;
                                    }).catch(error => {
                                        return null;
                                    });
                                }
                            """)
                            
                            if clipboard_content:
                                try:
                                    workflow_json = json.loads(clipboard_content)
                                    
                                    # Create safe filename
                                    workflow_id = workflow.url.split('/')[-2] if workflow.url.endswith('/') else workflow.url.split('/')[-1]
                                    safe_title = "".join(c for c in workflow.title if c.isalnum() or c in (' ', '-', '_')).strip()
                                    safe_title = safe_title.replace(' ', '_')[:100]
                                    
                                    filename = f"{safe_title}_{workflow_id}.json"
                                    filepath = os.path.join(TARGET_DIRECTORY, filename)
                                    
                                    # Save file
                                    with open(filepath, 'w', encoding='utf-8') as f:
                                        json.dump(workflow_json, f, indent=2, ensure_ascii=False)
                                    
                                    workflow.download_path = filepath
                                    return True
                                    
                                except json.JSONDecodeError:
                                    return False
                    
                finally:
                    await browser.close()
            
        except Exception as e:
            print(f"    Error: {e}")
            return False
    
    async def run_downloads(self):
        """Ejecutar descarga de workflows top"""
        if not self.cache:
            print("Cache vacio. Ejecuta primero el scraper.")
            return
        
        # Filtrar workflows top (score >= 7.0 y no descargados)
        top_workflows = []
        for workflow in self.cache.values():
            if workflow.gemini_score >= 7.0 and not workflow.downloaded:
                top_workflows.append(workflow)
        
        top_workflows.sort(key=lambda w: w.gemini_score, reverse=True)
        
        print(f"Workflows seleccionados para descarga: {len(top_workflows)}")
        
        downloaded_count = 0
        max_downloads = 5  # Limite para prueba
        
        for i, workflow in enumerate(top_workflows[:max_downloads], 1):
            print(f"\n[{i}/{min(max_downloads, len(top_workflows))}] {workflow.title}")
            print(f"    Score: {workflow.gemini_score} | Categoria: {workflow.category}")
            
            success = await self.download_workflow(workflow)
            if success:
                workflow.downloaded = True
                downloaded_count += 1
                print(f"    EXITO - Descargado correctamente")
            else:
                print(f"    FALLO - Error en descarga")
            
            # Pausa entre descargas
            if i < min(max_downloads, len(top_workflows)):
                print(f"    Pausa de 3 segundos...")
                await asyncio.sleep(3)
        
        print(f"\nProceso completado: {downloaded_count}/{min(max_downloads, len(top_workflows))} exitosas")
        self.save_cache()

async def main():
    print("🚀 Download Top Workflows")
    print("📥 Descargando mejores workflows del cache\n")
    
    downloader = WorkflowDownloader()
    await downloader.run_downloads()
    
    print("\n✅ Proceso terminado")

if __name__ == "__main__":
    asyncio.run(main())
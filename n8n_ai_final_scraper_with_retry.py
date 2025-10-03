#!/usr/bin/env python3
"""
N8N AI SUMMARIZATION & MULTIMODAL AI SCRAPER - FINAL
Basado en el exitoso n8n_workflow_scraper_expanded.py

OBJETIVO:
🎯 Descargar workflows SOLO de:
   - AI Summarization
   - Multimodal AI

MEJORAS AÑADIDAS:
✅ Lógica de 1 reintento con delay de 2 segundos si una descarga falla
✅ URLs hardcodeadas específicas para las 2 subcategorías
✅ Sistema V3.1 de conteo de nodos (visible + +X = total)
✅ Filtros de calidad (mínimo 6 nodos, solo gratuitos)
✅ Navegador visible para seguimiento
✅ Auto-destrucción al finalizar

Basado en: n8n_workflow_scraper_expanded.py (V3.1) - PROBADO Y EXITOSO
"""

import json
import re
import time
import pathlib
import os
from typing import List, Optional, Dict, Any, Set, Tuple
from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext
from urllib.parse import urljoin, urlparse


class N8NAISpecificScraper:
    """Scraper específico para AI Summarization y Multimodal AI con reintentos"""

    # URLs hardcodeadas específicas
    TARGET_CATEGORIES = [
        {
            'name': 'AI Summarization',
            'slug': 'ai-summarization', 
            'url': 'https://n8n.io/workflows/categories/ai-summarization/'
        },
        {
            'name': 'Multimodal AI',
            'slug': 'multimodal-ai',
            'url': 'https://n8n.io/workflows/categories/multimodal-ai/'
        }
    ]
    
    # Configuración optimizada
    MIN_NODES = 6
    SLOW_MO = 500
    TIMEOUT = 30000
    MAX_TABS = 3
    DOWNLOAD_BATCH_SIZE = 10
    WORKFLOWS_PER_PAGE = 30
    MAX_WORKFLOWS_PER_SUBCATEGORY = 200  # Aumentado para asegurar descarga completa
    
    # Configuración de reintentos
    MAX_RETRIES = 1  # 1 reintento máximo
    RETRY_DELAY = 2  # 2 segundos de delay

    def __init__(self, download_dir: str = "Workflow Scraper"):
        self.download_dir = pathlib.Path(download_dir)
        self.download_dir.mkdir(exist_ok=True)
        
        # Estadísticas
        self.global_stats = {
            'categories_processed': 0,
            'total_workflows_found': 0,
            'total_workflows_downloaded': 0,
            'total_errors': 0,
            'total_retries': 0,
            'retry_successes': 0,
            'start_time': time.time()
        }
        
        self.category_stats = {}
        self.downloaded_slugs = set()

    def log(self, message: str, level: str = "INFO") -> None:
        """Logging con timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")

    def log_category(self, category: str, message: str, level: str = "INFO") -> None:
        """Logging específico por categoría"""
        timestamp = time.strftime("%H:%M:%S") 
        print(f"[{timestamp}] [{level}] [{category.upper()}] {message}")

    def accept_all_cookies(self, page: Page) -> None:
        """Aceptar cookies automáticamente"""
        try:
            self.log("🍪 Buscando y aceptando cookies...")
            
            page.wait_for_timeout(2000)
            
            accept_strategies = [
                "text=Accept All",
                "text=Accept all cookies", 
                "text=Accept All Cookies",
                "text=Accept",
                "text=I Agree",
                "button:has-text('Accept All')",
                "button:has-text('Accept')",
                "[data-testid='cookie-accept-all']",
                ".cookie-accept-all",
                "#cookie-accept-all",
                "button[class*='accept']"
            ]

            for selector in accept_strategies:
                try:
                    element = page.query_selector(selector)
                    if element and element.is_visible():
                        element.click()
                        page.wait_for_timeout(2000)
                        self.log(f"✅ Cookies aceptadas con: {selector}")
                        return
                except Exception:
                    continue

            self.log("⚠️ No se encontraron cookies para aceptar")

        except Exception as e:
            self.log(f"Error manejando cookies: {e}", "ERROR")

    def extract_node_count_v31(self, page: Page, workflow_link) -> int:
        """
        Sistema V3.1 mejorado - ESTRUCTURA REAL DETECTADA
        Los nodos están en una lista con tooltips + indicador +X
        """
        try:
            # Buscar la lista de nodos dentro del link del workflow
            node_list = workflow_link.query_selector("list, ul")
            if not node_list:
                return 0
            
            # Método 1: Contar elementos li con tooltips (nodos visibles)
            visible_nodes = node_list.query_selector_all("li:has([role='tooltip'])")
            visible_count = len(visible_nodes)
            
            # Método 2: Buscar indicador +X adicional
            plus_indicators = node_list.query_selector_all("li")
            additional_count = 0
            
            for li in plus_indicators:
                generic_element = li.query_selector("generic")
                if generic_element:
                    text = generic_element.text_content().strip()
                    if text.startswith('+') and text[1:].isdigit():
                        additional_count = int(text[1:])
                        break
            
            total_nodes = visible_count + additional_count
            
            if total_nodes > 0:
                return total_nodes
            else:
                # Fallback: contar todos los li con tooltip
                all_tooltip_lis = node_list.query_selector_all("li")
                return len(all_tooltip_lis)
                
        except Exception as e:
            self.log(f"Error extrayendo nodos V3.1: {e}", "ERROR")
            return 0

    def extract_workflow_links(self, page: Page, category_name: str) -> List[Dict[str, Any]]:
        """Extraer workflows - ESTRUCTURA REAL DETECTADA"""
        workflows = []
        
        try:
            # Esperar a que se carguen los workflows como LINKS
            page.wait_for_selector("link[href*='/workflows/']", timeout=15000)
            page.wait_for_timeout(2000)
            
            # Buscar todos los links de workflows
            workflow_links = page.query_selector_all("link[href*='/workflows/']")
            
            self.log_category(category_name, f"🔍 Encontrados {len(workflow_links)} links de workflows")
            
            for i, link in enumerate(workflow_links):
                try:
                    # Obtener href
                    href = link.get_attribute("href")
                    if not href or '/workflows/categories/' in href:
                        continue
                    
                    # Construir URL completa
                    if href.startswith('/'):
                        full_url = f"https://n8n.io{href}"
                    else:
                        full_url = href
                    
                    # Extraer slug del ID del workflow
                    slug_match = re.search(r'/workflows/(\d+-[^/]+)/?', href)
                    if not slug_match:
                        continue
                    slug = slug_match.group(1)
                    
                    # Verificar si ya lo procesamos
                    if slug in self.downloaded_slugs:
                        continue
                    
                    # Extraer título del heading dentro del link
                    title_element = link.query_selector("heading[level='3']")
                    title = title_element.text_content().strip() if title_element else f"Workflow-{slug}"
                    
                    # Extraer conteo de nodos usando V3.1 con estructura real
                    nodes_count = self.extract_node_count_v31(page, link)
                    
                    # Verificar si es gratuito (buscar texto "Free")
                    is_free = "Free" in link.text_content()
                    
                    # Aplicar filtros básicos
                    if nodes_count >= self.MIN_NODES and is_free:
                        workflow_data = {
                            'title': title,
                            'slug': slug,
                            'url': full_url,
                            'nodes': nodes_count,
                            'category': category_name
                        }
                        
                        workflows.append(workflow_data)
                        self.log_category(category_name, f"✅ [{i+1}] {title[:50]}... ({nodes_count} nodos)")
                    else:
                        if nodes_count < self.MIN_NODES:
                            self.log_category(category_name, f"❌ Pocos nodos: {title[:30]}... ({nodes_count})")
                        elif not is_free:
                            self.log_category(category_name, f"❌ No gratuito: {title[:30]}...")
                
                except Exception as e:
                    self.log_category(category_name, f"Error procesando link {i+1}: {e}", "ERROR")
                    continue
            
            self.log_category(category_name, f"📊 Workflows válidos encontrados: {len(workflows)}")
            return workflows
            
        except Exception as e:
            self.log_category(category_name, f"Error extrayendo workflows: {e}", "ERROR")
            return []

    def download_workflow_with_retry(self, page: Page, workflow: Dict[str, Any], retry_count: int = 0) -> bool:
        """Descarga workflow con lógica de reintento mejorada"""
        category_dir = self.download_dir / workflow['category']
        category_dir.mkdir(exist_ok=True)
        
        file_path = category_dir / f"{workflow['slug']}.json"
        
        # Verificar si ya existe
        if file_path.exists():
            self.log_category(workflow['category'], f"✅ Ya existe: {workflow['slug']}")
            return True
        
        try:
            self.log_category(workflow['category'], f"⬇️ Descargando: {workflow['title'][:50]}...")
            
            # Navegar al workflow
            page.goto(workflow['url'], wait_until="networkidle", timeout=self.TIMEOUT)
            page.wait_for_timeout(2000)
            
            if "n8n.io" not in page.url:
                raise Exception(f"Página no cargó correctamente: {page.url}")
            
            # Buscar y hacer clic en "Use for free"
            use_button = page.query_selector("button:has-text('Use for free')")
            if not use_button or not use_button.is_visible():
                raise Exception("No se encontró botón 'Use for free'")
            
            use_button.click()
            page.wait_for_timeout(2500)
            
            # Buscar botón de copia
            copy_selectors = [
                'div.cursor-pointer:has-text("Copy template to clipboard (JSON)")',
                'div:has-text("Copy template to clipboard (JSON)")',
                'button:has-text("Copy template to clipboard")',
                '[data-testid="copy-template"]'
            ]
            
            copy_clicked = False
            for selector in copy_selectors:
                copy_button = page.query_selector(selector)
                if copy_button and copy_button.is_visible():
                    copy_button.click()
                    page.wait_for_timeout(800)
                    copy_clicked = True
                    break
            
            if not copy_clicked:
                raise Exception("No se encontró botón de copia")
            
            # Leer portapapeles
            clipboard_content = page.evaluate("""
                () => {
                    return navigator.clipboard.readText().then(text => {
                        return text;
                    }).catch(error => {
                        return null;
                    });
                }
            """)
            
            if not clipboard_content:
                raise Exception("Portapapeles vacío")
            
            # Validar JSON
            workflow_data = json.loads(clipboard_content)
            
            # Guardar archivo
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(workflow_data, f, indent=2, ensure_ascii=False)
            
            self.log_category(workflow['category'], f"✅ GUARDADO: {workflow['slug']}")
            return True
            
        except Exception as e:
            # Lógica de reintento
            if retry_count < self.MAX_RETRIES:
                self.global_stats['total_retries'] += 1
                self.log_category(workflow['category'], f"⚠️ Error, reintentando en {self.RETRY_DELAY}s: {e}")
                time.sleep(self.RETRY_DELAY)
                
                # Llamada recursiva para reintento
                result = self.download_workflow_with_retry(page, workflow, retry_count + 1)
                if result:
                    self.global_stats['retry_successes'] += 1
                    self.log_category(workflow['category'], f"✅ ÉXITO en reintento: {workflow['slug']}")
                return result
            else:
                self.log_category(workflow['category'], f"❌ ERROR FINAL: {workflow['slug']} - {e}", "ERROR")
                return False

    def load_more_pages(self, page: Page, category_name: str) -> bool:
        """Cargar más páginas si está disponible"""
        try:
            load_more_button = page.query_selector("text=Load more templates")
            
            if load_more_button and load_more_button.is_visible():
                self.log_category(category_name, "📄 Cargando más templates...")
                load_more_button.click()
                page.wait_for_timeout(2000)
                return True
            else:
                return False
                
        except Exception as e:
            self.log_category(category_name, f"Error cargando más páginas: {e}", "ERROR")
            return False

    def scrape_ai_category(self, context: BrowserContext, category: Dict[str, str]) -> None:
        """Scraping completo de una categoría AI específica"""
        category_name = category['name']
        self.log_category(category_name, "🚀 INICIANDO SCRAPING")
        
        # Inicializar estadísticas
        if category_name not in self.category_stats:
            self.category_stats[category_name] = {
                'found': 0, 
                'downloaded': 0, 
                'errors': 0,
                'retries': 0,
                'retry_successes': 0
            }
        
        page = context.new_page()
        
        try:
            # Navegar a la categoría con parámetros
            category_url = f"{category['url']}?count={self.WORKFLOWS_PER_PAGE}"
            self.log_category(category_name, f"🌐 Navegando a: {category_url}")
            
            page.goto(category_url, wait_until="networkidle", timeout=self.TIMEOUT)
            page.wait_for_timeout(3000)
            
            self.accept_all_cookies(page)
            
            all_workflows = []
            processed_slugs = set()
            pages_loaded = 0
            
            while True:
                pages_loaded += 1
                self.log_category(category_name, f"📄 Procesando página {pages_loaded}")
                
                # Extraer workflows de la página actual
                page_workflows = self.extract_workflow_links(page, category_name)
                
                new_workflows = 0
                for workflow in page_workflows:
                    if (workflow['slug'] not in processed_slugs and 
                        len(all_workflows) < self.MAX_WORKFLOWS_PER_SUBCATEGORY):
                        
                        processed_slugs.add(workflow['slug'])
                        all_workflows.append(workflow)
                        new_workflows += 1
                        
                        self.global_stats['total_workflows_found'] += 1
                        self.category_stats[category_name]['found'] += 1
                        
                        # Descargar inmediatamente
                        if self.download_workflow_with_retry(page, workflow):
                            self.global_stats['total_workflows_downloaded'] += 1
                            self.category_stats[category_name]['downloaded'] += 1
                            self.downloaded_slugs.add(workflow['slug'])
                        else:
                            self.global_stats['total_errors'] += 1
                            self.category_stats[category_name]['errors'] += 1
                        
                        time.sleep(1)  # Pausa entre descargas
                        
                        if len(all_workflows) >= self.MAX_WORKFLOWS_PER_SUBCATEGORY:
                            break
                
                self.log_category(category_name, f"📊 Nuevos: {new_workflows} | Total encontrados: {len(all_workflows)}")
                
                # Verificar límite
                if len(all_workflows) >= self.MAX_WORKFLOWS_PER_SUBCATEGORY:
                    self.log_category(category_name, f"🎯 LÍMITE ALCANZADO: {self.MAX_WORKFLOWS_PER_SUBCATEGORY}")
                    break
                
                # Intentar cargar más páginas
                if not self.load_more_pages(page, category_name):
                    self.log_category(category_name, "🏁 No hay más páginas disponibles")
                    break
                
                # Límite de seguridad
                if pages_loaded > 25:
                    self.log_category(category_name, "⚠️ Límite de páginas alcanzado")
                    break
            
            self.log_category(category_name, f"✅ SCRAPING COMPLETADO: {len(all_workflows)} workflows encontrados")
            
        except Exception as e:
            self.log_category(category_name, f"❌ ERROR: {e}", "ERROR")
        finally:
            try:
                page.close()
            except:
                pass

    def print_final_statistics(self) -> None:
        """Estadísticas finales detalladas"""
        duration = time.time() - self.global_stats['start_time']
        
        print("\n" + "="*80)
        print("🎉 AI SCRAPING COMPLETADO - ESTADÍSTICAS FINALES")
        print("="*80)
        
        print(f"⏱️  Duración: {duration:.2f} segundos ({duration/60:.1f} minutos)")
        print(f"📁 Categorías procesadas: {self.global_stats['categories_processed']}")
        print(f"🔍 Workflows encontrados: {self.global_stats['total_workflows_found']}")
        print(f"⬇️  Workflows descargados: {self.global_stats['total_workflows_downloaded']}")
        print(f"❌ Errores: {self.global_stats['total_errors']}")
        print(f"🔄 Total reintentos: {self.global_stats['total_retries']}")
        print(f"✅ Reintentos exitosos: {self.global_stats['retry_successes']}")
        
        if self.global_stats['total_workflows_found'] > 0:
            success_rate = (self.global_stats['total_workflows_downloaded'] / self.global_stats['total_workflows_found']) * 100
            print(f"📊 Tasa de éxito: {success_rate:.1f}%")
        
        if self.global_stats['total_retries'] > 0:
            retry_success_rate = (self.global_stats['retry_successes'] / self.global_stats['total_retries']) * 100
            print(f"🎯 Éxito en reintentos: {retry_success_rate:.1f}%")
        
        print("\n📊 ESTADÍSTICAS POR CATEGORÍA:")
        print("-"*80)
        for category, stats in self.category_stats.items():
            found = stats['found']
            downloaded = stats['downloaded']
            errors = stats['errors']
            rate = (downloaded / found * 100) if found > 0 else 0
            
            print(f"📁 {category:<20} | Encontrados: {found:>4} | Descargados: {downloaded:>4} | Errores: {errors:>3} | Éxito: {rate:>5.1f}%")
        
        print(f"\n💾 Archivos guardados en: {self.download_dir.absolute()}")
        
        # Mostrar estructura de directorios
        for category_dir in sorted(self.download_dir.iterdir()):
            if category_dir.is_dir() and category_dir.name in [cat['name'] for cat in self.TARGET_CATEGORIES]:
                file_count = len(list(category_dir.glob('*.json')))
                print(f"   📁 {category_dir.name}/ ({file_count} archivos)")

    def run(self) -> None:
        """Proceso principal de scraping"""
        self.log("🚀 INICIANDO N8N AI SPECIFIC SCRAPER")
        self.log("🎯 OBJETIVO: AI Summarization + Multimodal AI")
        self.log(f"📁 Directorio: {self.download_dir.absolute()}")
        self.log(f"🔢 Mínimo nodos: {self.MIN_NODES}")
        self.log(f"🔄 Reintentos: {self.MAX_RETRIES} con delay de {self.RETRY_DELAY}s")
        
        with sync_playwright() as p:
            # Navegador VISIBLE
            browser = p.chromium.launch(
                headless=False,
                slow_mo=self.SLOW_MO,
                args=['--disable-blink-features=AutomationControlled']
            )
            
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            
            try:
                for i, category in enumerate(self.TARGET_CATEGORIES):
                    self.log(f"\n[{i+1}/{len(self.TARGET_CATEGORIES)}] PROCESANDO: {category['name']}")
                    self.scrape_ai_category(context, category)
                    self.global_stats['categories_processed'] += 1
                    
                    if i < len(self.TARGET_CATEGORIES) - 1:
                        self.log("⏳ Pausa de 5 segundos...")
                        time.sleep(5)
                
                self.print_final_statistics()
                
            except Exception as e:
                self.log(f"❌ ERROR CRÍTICO: {e}", "ERROR")
            finally:
                try:
                    browser.close()
                except:
                    pass

    def self_destruct(self) -> None:
        """Auto-destrucción del script"""
        try:
            script_path = __file__
            self.log(f"🗑️ Auto-eliminando script: {script_path}")
            os.remove(script_path)
            self.log("✅ Script eliminado exitosamente")
        except Exception as e:
            self.log(f"⚠️ Error eliminando script: {e}", "ERROR")


def main():
    scraper = N8NAISpecificScraper()
    try:
        scraper.run()
    finally:
        # Auto-destrucción al finalizar
        time.sleep(2)  # Pequeña pausa antes de auto-destruirse
        scraper.self_destruct()


if __name__ == "__main__":
    main()
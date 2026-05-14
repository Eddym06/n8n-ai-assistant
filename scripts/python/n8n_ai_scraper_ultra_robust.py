"""
N8N AI-Only Workflow Scraper - Version Ultra Robusta
Version especial para las subcategorias restantes con maxima estabilidad
"""

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import json
import os
import time
import logging
import gc
from typing import Dict, List, Optional

# Configuracion simple de logging sin emojis
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('n8n_ai_scraper_robust.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

class N8NAIScraperRobust:
    """Scraper ultra robusto para las subcategorias restantes de AI"""
    
    def __init__(self):
        self.base_url = "https://n8n.io/workflows"
        self.max_workflows_per_subcategory = 150
        self.batch_size = 8  # Mas conservador
        self.delay = 2
        self.retry_delay = 2
        self.max_retries = 1
        
        # Solo las subcategorias restantes
        self.target_subcategories = [
            "ai-summarization",
            "multimodal-ai"
        ]
        
        self.data = {}
        self.stats = {
            'total_downloaded': 0,
            'total_errors': 0,
            'category_stats': {}
        }
        
    def force_memory_cleanup(self):
        """Fuerza la limpieza de memoria agresiva"""
        gc.collect()
        time.sleep(1)
        
    def safe_page_navigation(self, page, url: str, timeout=45000) -> bool:
        """Navegacion segura con multiples intentos"""
        for attempt in range(3):
            try:
                logging.info(f"Navegando a: {url} (intento {attempt + 1})")
                page.goto(url, timeout=timeout, wait_until='domcontentloaded')
                page.wait_for_load_state('networkidle', timeout=15000)
                time.sleep(self.delay)
                return True
            except Exception as e:
                logging.warning(f"Error en navegacion intento {attempt + 1}: {e}")
                if attempt < 2:
                    time.sleep(3)
                    continue
                return False
        return False
        
    def extract_node_count_enhanced(self, page, workflow_link: str) -> int:
        """Extrae el conteo total de nodos usando el sistema V3.1 mejorado"""
        try:
            # Buscar el indicador de nodos visible
            visible_nodes_element = page.locator('text=/^\\d+ nodes?$/')
            if visible_nodes_element.count() > 0:
                visible_text = visible_nodes_element.first.text_content().strip()
                visible_count = int(visible_text.split()[0])
                
                # Buscar el indicador +X adicional
                additional_element = page.locator('text=/^\\+\\d+$/')
                additional_count = 0
                
                if additional_element.count() > 0:
                    additional_text = additional_element.first.text_content().strip()
                    additional_count = int(additional_text.replace('+', ''))
                
                total_nodes = visible_count + additional_count
                logging.info(f"Nodos detectados: {visible_count} visible + {additional_count} adicional = {total_nodes} total")
                return total_nodes
            else:
                logging.warning(f"No se encontro informacion de nodos para {workflow_link}")
                return 0
                
        except Exception as e:
            logging.error(f"Error extrayendo conteo de nodos: {e}")
            return 0
            
    def extract_workflow_data_robust(self, page, workflow_link: str, retry_count: int = 0) -> Optional[Dict]:
        """Extrae datos del workflow con maxima robustez"""
        try:
            # Navegar al workflow de forma segura
            if not self.safe_page_navigation(page, workflow_link):
                if retry_count < self.max_retries:
                    logging.info(f"Reintentando descarga tras error de navegacion: {workflow_link}")
                    time.sleep(self.retry_delay)
                    return self.extract_workflow_data_robust(page, workflow_link, retry_count + 1)
                else:
                    logging.error(f"Error final de navegacion: {workflow_link}")
                    return None
            
            # Extraer datos basicos con timeouts conservadores
            title = "Sin titulo"
            try:
                title_element = page.locator('h1').first
                if title_element.is_visible(timeout=5000):
                    title = title_element.text_content().strip() or "Sin titulo"
            except:
                pass
            
            # Extraer conteo de nodos
            node_count = self.extract_node_count_enhanced(page, workflow_link)
            
            # Extraer descripcion de forma segura
            description = ""
            desc_selectors = [
                'meta[name="description"]',
                'p:has-text("Description")',
                '.description'
            ]
            
            for selector in desc_selectors:
                try:
                    desc_element = page.locator(selector).first
                    if desc_element.count() > 0:
                        if selector.startswith('meta'):
                            description = desc_element.get_attribute('content') or ""
                        else:
                            description = desc_element.text_content().strip() or ""
                        if description:
                            break
                except:
                    continue
            
            workflow_data = {
                'title': title,
                'url': workflow_link,
                'node_count': node_count,
                'description': description[:400] if description else "",
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            return workflow_data
            
        except Exception as e:
            if retry_count < self.max_retries:
                logging.warning(f"Error en descarga, reintentando en {self.retry_delay}s: {workflow_link} - {e}")
                time.sleep(self.retry_delay)
                return self.extract_workflow_data_robust(page, workflow_link, retry_count + 1)
            else:
                logging.error(f"Error final extrayendo datos de {workflow_link}: {e}")
                self.stats['total_errors'] += 1
                return None
                
    def scrape_ai_subcategory_robust(self, browser, subcategory: str) -> List[Dict]:
        """Scrapa una subcategoria con maxima robustez"""
        logging.info(f"Iniciando scraping robusto de subcategoria: {subcategory}")
        
        subcategory_url = f"{self.base_url}?category=ai&subcategory={subcategory}"
        workflows = []
        
        # Crear contexto robusto
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        
        try:
            main_page = context.new_page()
            
            # Navegar a la subcategoria
            if not self.safe_page_navigation(main_page, subcategory_url):
                logging.error(f"No se pudo cargar la pagina de {subcategory}")
                return workflows
            
            # Extraer enlaces de workflows con scroll controlado
            workflow_links = []
            
            for scroll in range(15):  # Mas conservador
                try:
                    main_page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    time.sleep(2)
                    
                    # Extraer enlaces actuales
                    current_links = main_page.locator('a[href*="/workflows/"]').all()
                    for link in current_links:
                        try:
                            href = link.get_attribute('href')
                            if href and '/workflows/' in href and href.startswith('/'):
                                full_url = f"https://n8n.io{href}"
                                if full_url not in workflow_links:
                                    workflow_links.append(full_url)
                        except:
                            continue
                    
                    # Limitar por seguridad
                    if len(workflow_links) >= self.max_workflows_per_subcategory:
                        break
                        
                    # Limpieza de memoria cada 3 scrolls
                    if scroll % 3 == 0:
                        self.force_memory_cleanup()
                        
                except Exception as e:
                    logging.warning(f"Error en scroll {scroll}: {e}")
                    continue
            
            workflow_links = workflow_links[:self.max_workflows_per_subcategory]
            logging.info(f"Encontrados {len(workflow_links)} workflows en {subcategory}")
            
            # Procesar workflows uno por uno (mas estable)
            for i, link in enumerate(workflow_links):
                try:
                    logging.info(f"Procesando workflow {i+1}/{len(workflow_links)} de {subcategory}")
                    
                    # Crear pagina nueva para cada workflow
                    workflow_page = context.new_page()
                    
                    workflow_data = self.extract_workflow_data_robust(workflow_page, link)
                    if workflow_data:
                        workflows.append(workflow_data)
                        self.stats['total_downloaded'] += 1
                        logging.info(f"Descargado: {workflow_data['title']} ({workflow_data['node_count']} nodos)")
                    
                    # Cerrar pagina del workflow
                    workflow_page.close()
                    
                    # Pausa entre workflows
                    time.sleep(self.delay)
                    
                    # Limpieza de memoria cada 5 workflows
                    if (i + 1) % 5 == 0:
                        self.force_memory_cleanup()
                        logging.info(f"Progreso {subcategory}: {len(workflows)}/{len(workflow_links)} completados")
                        
                except Exception as e:
                    logging.error(f"Error procesando workflow {i+1}: {e}")
                    continue
        
        except Exception as e:
            logging.error(f"Error general procesando subcategoria {subcategory}: {e}")
        
        finally:
            try:
                context.close()
            except:
                pass
            
        logging.info(f"Completado {subcategory}: {len(workflows)} workflows descargados")
        return workflows
        
    def save_results_robust(self):
        """Guarda los resultados de forma robusta"""
        if not self.data:
            logging.warning("No hay datos para guardar")
            return
            
        # Crear directorio
        output_dir = "Workflow Scraper"
        os.makedirs(output_dir, exist_ok=True)
        
        # Guardar datos principales
        main_file = os.path.join(output_dir, "n8n_ai_workflows_robust.json")
        with open(main_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
        
        # Guardar estadisticas
        stats_file = os.path.join(output_dir, "n8n_ai_scraping_stats_robust.json")
        with open(stats_file, 'w', encoding='utf-8') as f:
            json.dump(self.stats, f, indent=2, ensure_ascii=False)
        
        # Crear resumen
        success_rate = 0.0
        if (self.stats['total_downloaded'] + self.stats['total_errors']) > 0:
            success_rate = (self.stats['total_downloaded'] / (self.stats['total_downloaded'] + self.stats['total_errors'])) * 100
            
        summary = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_workflows': self.stats['total_downloaded'],
            'total_errors': self.stats['total_errors'],
            'subcategories': self.stats['category_stats'],
            'success_rate': f"{success_rate:.1f}%"
        }
        
        summary_file = os.path.join(output_dir, "n8n_ai_scraping_summary_robust.json")
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        logging.info(f"Datos guardados en: {main_file}")
        logging.info(f"Estadisticas guardadas en: {stats_file}")
        logging.info(f"Resumen guardado en: {summary_file}")
        
    def run(self):
        """Ejecuta el scraping ultra robusto"""
        start_time = time.time()
        logging.info("Iniciando N8N AI Scraper Ultra Robusto")
        logging.info(f"Subcategorias objetivo: {', '.join(self.target_subcategories)}")
        
        with sync_playwright() as p:
            # Configurar navegador ultra robusto
            browser = p.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-extensions',
                    '--disable-plugins',
                    '--disable-images',
                    '--disable-javascript-harmony-shipping',
                    '--memory-pressure-off'
                ]
            )
            
            try:
                for subcategory in self.target_subcategories:
                    logging.info(f"=== PROCESANDO SUBCATEGORIA: {subcategory.upper()} ===")
                    
                    # Scraper la subcategoria
                    workflows = self.scrape_ai_subcategory_robust(browser, subcategory)
                    
                    if workflows:
                        self.data[subcategory] = workflows
                        avg_nodes = sum(w['node_count'] for w in workflows) / len(workflows) if workflows else 0
                        self.stats['category_stats'][subcategory] = {
                            'total_workflows': len(workflows),
                            'avg_nodes': avg_nodes
                        }
                        logging.info(f"{subcategory}: {len(workflows)} workflows completados")
                    else:
                        logging.warning(f"{subcategory}: No se obtuvieron workflows")
                        
                    # Limpieza agresiva entre subcategorias
                    self.force_memory_cleanup()
                    time.sleep(3)
                    
            except Exception as e:
                logging.error(f"Error general en el scraping: {e}")
            
            finally:
                try:
                    browser.close()
                except:
                    pass
        
        # Guardar resultados
        self.save_results_robust()
        
        # Mostrar resumen final
        end_time = time.time()
        duration = end_time - start_time
        
        logging.info("=" * 60)
        logging.info("SCRAPING COMPLETADO")
        logging.info("=" * 60)
        logging.info(f"Tiempo total: {duration:.2f} segundos")
        logging.info(f"Total workflows descargados: {self.stats['total_downloaded']}")
        logging.info(f"Total errores: {self.stats['total_errors']}")
        
        if self.stats['total_downloaded'] + self.stats['total_errors'] > 0:
            success_rate = (self.stats['total_downloaded'] / (self.stats['total_downloaded'] + self.stats['total_errors'])) * 100
            logging.info(f"Tasa de exito: {success_rate:.1f}%")
        
        for subcategory, stats in self.stats['category_stats'].items():
            logging.info(f"{subcategory}: {stats['total_workflows']} workflows, promedio {stats['avg_nodes']:.1f} nodos")
        
        logging.info("=" * 60)
        
        # Auto-eliminacion del script
        try:
            script_path = __file__
            os.remove(script_path)
            logging.info(f"Script auto-eliminado: {script_path}")
        except Exception as e:
            logging.warning(f"No se pudo auto-eliminar el script: {e}")

if __name__ == "__main__":
    scraper = N8NAIScraperRobust()
    scraper.run()
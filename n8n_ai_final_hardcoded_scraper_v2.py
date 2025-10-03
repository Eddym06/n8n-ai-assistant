#!/usr/bin/env python3
"""
N8N AI Final Hardcoded Scraper V2 - URLs descubiertas via MCP Playwright
Descarga workflows de AI Summarization y Multimodal AI con URLs hardcodeadas
Basado en el exitoso script V3.1 con sistema de conteo de nodos mejorado
Usa webdriver-manager para gestión automática de drivers
"""

import requests
import json
import os
import time
import random
from urllib.parse import urljoin, urlparse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
import re

class N8NAIFinalScraperV2:
    def __init__(self):
        self.base_url = "https://n8n.io"
        self.output_dir = "Workflow Scraper"
        self.workflows = []
        self.success_count = 0
        self.error_count = 0
        self.driver = None
        
        # URLs hardcodeadas descubiertas via MCP Playwright
        self.ai_subcategories = {
            "AI Summarization": {
                "url": "https://n8n.io/workflows/categories/ai-summarization/",
                "expected_count": 1073,
                "workflows": []
            },
            "Multimodal AI": {
                "url": "https://n8n.io/workflows/categories/multimodal-ai/",
                "expected_count": 2205,
                "workflows": []
            }
        }
        
        # Crear directorio de salida si no existe
        os.makedirs(self.output_dir, exist_ok=True)
    
    def setup_driver(self):
        """Configurar Chrome con webdriver-manager para gestión automática de drivers"""
        try:
            print("🔧 Configurando navegador Chrome con webdriver-manager...")
            
            options = Options()
            
            # Configuraciones de estabilidad y rendimiento
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--disable-web-security")
            options.add_argument("--disable-features=VizDisplayCompositor")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-plugins")
            options.add_argument("--disable-images")
            options.add_argument("--disable-default-apps")
            options.add_argument("--disable-background-timer-throttling")
            options.add_argument("--disable-renderer-backgrounding")
            options.add_argument("--disable-backgrounding-occluded-windows")
            
            # Configuraciones de memoria
            options.add_argument("--memory-pressure-off")
            options.add_argument("--max_old_space_size=4096")
            options.add_argument("--no-zygote")
            
            # User agent para evitar detección
            options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            # Configurar prefs para deshabilitar notificaciones y popups
            prefs = {
                "profile.default_content_setting_values": {
                    "notifications": 2,
                    "popups": 2,
                    "media_stream": 2,
                    "plugins": 2,
                    "images": 2
                },
                "profile.managed_default_content_settings": {
                    "images": 2
                }
            }
            options.add_experimental_option("prefs", prefs)
            
            # Instalar y configurar driver automáticamente
            print("📥 Descargando/actualizando ChromeDriver...")
            service = Service(ChromeDriverManager().install())
            
            # Crear driver
            self.driver = webdriver.Chrome(service=service, options=options)
            self.driver.set_page_load_timeout(30)
            self.driver.implicitly_wait(10)
            
            print("✅ Navegador configurado exitosamente")
            return True
            
        except Exception as e:
            print(f"❌ Error configurando navegador: {e}")
            return False
    
    def accept_cookies(self):
        """Aceptar cookies si aparece el banner"""
        try:
            # Intentar múltiples selectores para el botón de cookies
            cookie_selectors = [
                "//button[contains(text(), 'Accept')]",
                "//button[contains(text(), 'Accept all')]", 
                "//button[contains(text(), 'Aceptar')]",
                "//button[contains(@class, 'accept')]",
                "//button[contains(@id, 'accept')]",
                "//div[contains(@class, 'cookie')]//button"
            ]
            
            for selector in cookie_selectors:
                try:
                    cookie_button = WebDriverWait(self.driver, 3).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    cookie_button.click()
                    print("🍪 Cookies aceptadas")
                    time.sleep(2)
                    return
                except TimeoutException:
                    continue
            
            print("ℹ️  No se encontró banner de cookies o ya fue aceptado")
        except Exception as e:
            print(f"⚠️  Error aceptando cookies: {e}")
    
    def extract_node_count_v31(self, workflow_element):
        """
        Sistema V3.1 de conteo de nodos mejorado
        Cuenta nodos visibles + indicador +X = total real
        """
        try:
            # Buscar lista de nodos visibles
            node_list = workflow_element.find_element(By.CSS_SELECTOR, "ul, .node-list, [class*='node']")
            visible_nodes = node_list.find_elements(By.CSS_SELECTOR, "li, .node-item, [class*='item']")
            
            visible_count = 0
            plus_indicator = 0
            
            for node in visible_nodes:
                node_text = node.get_attribute("textContent").strip()
                
                # Verificar si es indicador +X
                plus_match = re.search(r'\+(\d+)', node_text)
                if plus_match:
                    plus_indicator = int(plus_match.group(1))
                else:
                    # Contar como nodo visible si no está vacío
                    if node_text and not node_text.startswith('+'):
                        visible_count += 1
            
            # Total = nodos visibles + indicador +X
            total_nodes = visible_count + plus_indicator
            
            return {
                'visible_nodes': visible_count,
                'plus_indicator': plus_indicator,
                'total_nodes': total_nodes
            }
            
        except Exception as e:
            print(f"⚠️  Error extrayendo conteo de nodos: {e}")
            return {
                'visible_nodes': 0,
                'plus_indicator': 0,
                'total_nodes': 0,
                'error': str(e)
            }
    
    def scrape_subcategory_page(self, subcategory_name, subcategory_url):
        """Scraper para una página de subcategoría específica con retry logic"""
        print(f"\n🎯 Procesando subcategoría: {subcategory_name}")
        print(f"🔗 URL: {subcategory_url}")
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"🔄 Intento {attempt + 1}/{max_retries}")
                
                # Navegar a la página
                self.driver.get(subcategory_url)
                
                # Aceptar cookies en primer intento
                if attempt == 0:
                    self.accept_cookies()
                
                # Esperar a que la página cargue
                WebDriverWait(self.driver, 20).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                page_workflows = []
                load_more_count = 0
                max_load_more = 20  # Reducir límite para evitar crashes
                
                while load_more_count < max_load_more:
                    try:
                        # Buscar workflows en la página actual con múltiples selectores
                        workflow_selectors = [
                            "a[href*='/workflows/']",
                            "a[href*='workflow']", 
                            "[href*='/workflows/']"
                        ]
                        
                        workflow_links = []
                        for selector in workflow_selectors:
                            try:
                                links = self.driver.find_elements(By.CSS_SELECTOR, selector)
                                workflow_links.extend(links)
                                if links:
                                    break
                            except:
                                continue
                        
                        print(f"📄 Encontrados {len(workflow_links)} enlaces de workflows en la página")
                        
                        # Procesar cada workflow
                        for link in workflow_links:
                            try:
                                href = link.get_attribute('href')
                                if not href or '/workflows/' not in href:
                                    continue
                                
                                # Filtrar enlaces que no son workflows individuales
                                if '/categories/' in href or href.endswith('/workflows/'):
                                    continue
                                
                                # Extraer información básica
                                workflow_data = {
                                    'url': href,
                                    'subcategory': subcategory_name,
                                    'title': 'Unknown',
                                    'creator': 'Unknown',
                                    'node_count': 0,
                                    'node_details': {}
                                }
                                
                                # Intentar extraer título
                                try:
                                    # Buscar h3 o elemento de título en el contexto del enlace
                                    title_selectors = ["h3", ".title", "[class*='title']", "h2", "h4"]
                                    for selector in title_selectors:
                                        try:
                                            title_elem = link.find_element(By.XPATH, f".//{selector}")
                                            title = title_elem.get_attribute('textContent').strip()
                                            if title and len(title) > 5:
                                                workflow_data['title'] = title
                                                break
                                        except:
                                            continue
                                except:
                                    pass
                                
                                # Intentar extraer creador
                                try:
                                    creator_selectors = [
                                        "img[alt*='Created by']",
                                        "[class*='creator']",
                                        "[class*='author']"
                                    ]
                                    for selector in creator_selectors:
                                        try:
                                            creator_elem = link.find_element(By.CSS_SELECTOR, selector)
                                            alt_text = creator_elem.get_attribute('alt')
                                            if alt_text and 'Created by' in alt_text:
                                                workflow_data['creator'] = alt_text.replace('Created by:', '').strip()
                                                break
                                        except:
                                            continue
                                except:
                                    pass
                                
                                # Extraer conteo de nodos usando sistema V3.1
                                try:
                                    node_info = self.extract_node_count_v31(link)
                                    workflow_data['node_count'] = node_info['total_nodes']
                                    workflow_data['node_details'] = node_info
                                except:
                                    pass
                                
                                # Evitar duplicados
                                if not any(w['url'] == workflow_data['url'] for w in page_workflows):
                                    page_workflows.append(workflow_data)
                                    
                            except Exception as e:
                                print(f"⚠️  Error procesando workflow individual: {e}")
                                continue
                        
                        # Intentar hacer clic en "Load more templates"
                        try:
                            load_more_selectors = [
                                "//button[contains(text(), 'Load more')]",
                                "//button[contains(text(), 'load more')]", 
                                "//button[contains(@class, 'load')]",
                                "[class*='load-more']",
                                "button[class*='load']"
                            ]
                            
                            load_more_button = None
                            for selector in load_more_selectors:
                                try:
                                    if selector.startswith("//"):
                                        load_more_button = WebDriverWait(self.driver, 3).until(
                                            EC.element_to_be_clickable((By.XPATH, selector))
                                        )
                                    else:
                                        load_more_button = WebDriverWait(self.driver, 3).until(
                                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                                        )
                                    break
                                except TimeoutException:
                                    continue
                            
                            if load_more_button:
                                # Scroll al botón
                                self.driver.execute_script("arguments[0].scrollIntoView(true);", load_more_button)
                                time.sleep(2)
                                
                                # Click
                                load_more_button.click()
                                load_more_count += 1
                                
                                print(f"🔄 Load more #{load_more_count} - Total workflows: {len(page_workflows)}")
                                
                                # Esperar a que carguen nuevos workflows
                                time.sleep(random.uniform(4, 8))
                            else:
                                print("✅ No hay más botón 'Load more' - fin de la paginación")
                                break
                            
                        except TimeoutException:
                            print("✅ No hay más botón 'Load more' - fin de la paginación")
                            break
                        except Exception as e:
                            print(f"⚠️  Error con botón 'Load more': {e}")
                            break
                    
                    except Exception as e:
                        print(f"❌ Error en el bucle principal de scraping: {e}")
                        break
                
                # Actualizar resultados
                self.ai_subcategories[subcategory_name]['workflows'] = page_workflows
                self.workflows.extend(page_workflows)
                self.success_count += len(page_workflows)
                
                print(f"✅ {subcategory_name}: {len(page_workflows)} workflows extraídos")
                return True
                
            except Exception as e:
                print(f"❌ Error en intento {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    print(f"⏳ Esperando antes del siguiente intento...")
                    time.sleep(5)
                else:
                    print(f"❌ Falló después de {max_retries} intentos")
                    return False
        
        return False
    
    def generate_summary_report(self):
        """Generar reporte detallado de resultados"""
        report = f"""
🎯 N8N AI FINAL SCRAPER V2 - REPORTE DE RESULTADOS
{'=' * 60}

📊 RESUMEN GENERAL:
• Total workflows descargados: {len(self.workflows)}
• Subcategorías procesadas: {len(self.ai_subcategories)}
• Éxitos: {self.success_count}
• Errores: {self.error_count}

📋 DETALLE POR SUBCATEGORÍA:
"""
        
        for subcategory, data in self.ai_subcategories.items():
            actual_count = len(data['workflows'])
            expected_count = data['expected_count']
            percentage = (actual_count / expected_count * 100) if expected_count > 0 else 0
            
            report += f"""
🎯 {subcategory}:
   • URL: {data['url']}
   • Esperados: {expected_count}
   • Obtenidos: {actual_count}
   • Cobertura: {percentage:.2f}%
"""
        
        # Análisis de nodos
        if self.workflows:
            node_counts = [w['node_count'] for w in self.workflows if w['node_count'] > 0]
            if node_counts:
                report += f"""
📊 ANÁLISIS DE NODOS:
• Promedio de nodos por workflow: {sum(node_counts) / len(node_counts):.2f}
• Workflow con más nodos: {max(node_counts)}
• Workflow con menos nodos: {min(node_counts)}
• Total de workflows con nodos contados: {len(node_counts)}
"""
        
        report += f"""
🏁 RESULTADO FINAL:
• Status: {'✅ ÉXITO' if self.success_count > 0 else '❌ FALLO'}
• Archivos generados: {len(self.ai_subcategories)} JSON + 1 reporte
• Directorio: {self.output_dir}/
• Scraper Version: N8N AI Final Hardcoded V2.0

{'=' * 60}
"""
        
        return report
    
    def save_results(self):
        """Guardar resultados en archivos JSON separados por subcategoría"""
        print("\n💾 Guardando resultados...")
        
        # Guardar por subcategoría
        for subcategory, data in self.ai_subcategories.items():
            if data['workflows']:
                filename = f"n8n_workflows_{subcategory.lower().replace(' ', '_')}_final_v2.json"
                filepath = os.path.join(self.output_dir, filename)
                
                output_data = {
                    'metadata': {
                        'subcategory': subcategory,
                        'source_url': data['url'],
                        'total_workflows': len(data['workflows']),
                        'expected_count': data['expected_count'],
                        'scraping_date': time.strftime('%Y-%m-%d %H:%M:%S'),
                        'scraper_version': 'N8N AI Final Hardcoded V2.0',
                        'urls_discovered_via': 'MCP Playwright Navigation'
                    },
                    'workflows': data['workflows']
                }
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(output_data, f, indent=2, ensure_ascii=False)
                
                print(f"✅ Guardado: {filename} ({len(data['workflows'])} workflows)")
        
        # Guardar reporte de resumen
        report = self.generate_summary_report()
        report_file = os.path.join(self.output_dir, "n8n_ai_final_scraper_v2_report.txt")
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✅ Reporte guardado: n8n_ai_final_scraper_v2_report.txt")
        print(report)
    
    def run(self):
        """Ejecutar el scraper completo"""
        start_time = time.time()
        
        print("🚀 INICIANDO N8N AI FINAL HARDCODED SCRAPER V2")
        print("=" * 60)
        print("📋 URLs hardcodeadas descubiertas via MCP Playwright:")
        for name, data in self.ai_subcategories.items():
            print(f"   • {name}: {data['url']} ({data['expected_count']} workflows)")
        print("=" * 60)
        
        try:
            # Configurar navegador
            if not self.setup_driver():
                return False
            
            # Procesar cada subcategoría
            for subcategory_name, subcategory_data in self.ai_subcategories.items():
                success = self.scrape_subcategory_page(
                    subcategory_name, 
                    subcategory_data['url']
                )
                
                if not success:
                    self.error_count += 1
                    print(f"❌ Falló el scraping de {subcategory_name}")
                
                # Pausa entre subcategorías
                if subcategory_name != list(self.ai_subcategories.keys())[-1]:
                    print("⏳ Pausa entre subcategorías...")
                    time.sleep(random.uniform(8, 15))
            
            # Guardar resultados
            self.save_results()
            
            # Estadísticas finales
            end_time = time.time()
            duration = end_time - start_time
            
            print(f"\n🏁 SCRAPING COMPLETADO")
            print(f"⏱️  Duración total: {duration:.2f} segundos")
            print(f"📊 Total workflows: {len(self.workflows)}")
            print(f"✅ Éxitos: {self.success_count}")
            print(f"❌ Errores: {self.error_count}")
            
            if self.success_count > 0:
                print(f"🎯 Tasa de éxito: {(self.success_count / (self.success_count + self.error_count)) * 100:.2f}%")
            
            return True
            
        except KeyboardInterrupt:
            print("\n⚠️  Scraping interrumpido por el usuario")
            return False
        except Exception as e:
            print(f"\n❌ Error fatal: {e}")
            return False
        finally:
            if self.driver:
                self.driver.quit()
                print("🔒 Navegador cerrado")

if __name__ == "__main__":
    scraper = N8NAIFinalScraperV2()
    success = scraper.run()
    
    if success:
        print("\n🎉 ¡Scraping completado exitosamente!")
    else:
        print("\n💔 Scraping falló")
    
    # Auto-eliminación del script después de ejecución
    try:
        print("🗑️  Auto-eliminando script...")
        os.remove(__file__)
        print("✅ Script eliminado")
    except:
        print("⚠️  No se pudo auto-eliminar el script")
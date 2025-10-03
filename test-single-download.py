#!/usr/bin/env python3
"""
Test de descarga individual - V5.1 Download Fix
Prueba el nuevo mecanismo de descarga con un solo workflow
"""

import asyncio
import json
import os
from playwright.async_api import async_playwright

async def test_download():
    """Probar descarga de un workflow específico"""
    
    # Workflow de prueba (uno que sabemos que existe)
    test_url = "https://n8n.io/workflows/5924-ai-research-assistant-via-telegram-gpt-4o-mini-deepseek-r1-serpapi/"
    output_dir = r"C:\Users\eddym\Downloads\n8n-ai-assistant\Workflow de Web n8n"
    
    os.makedirs(output_dir, exist_ok=True)
    
    async with async_playwright() as playwright:
        print("🚀 Iniciando test de descarga individual...")
        
        # Configurar navegador visible para debug
        browser = await playwright.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            print(f"🌐 Navegando a: {test_url}")
            await page.goto(test_url)
            await page.wait_for_load_state('networkidle')
            print("✅ Página cargada")
            
            # Buscar y hacer clic en "Use for free"
            print("🔍 Buscando botón 'Use for free'...")
            use_button = page.locator('button:has-text("Use for free")')
            
            if await use_button.count() > 0:
                print("✅ Botón 'Use for free' encontrado")
                await use_button.click()
                await page.wait_for_timeout(3000)  # Esperar modal
                print("✅ Modal abierto")
                
                # Buscar y hacer clic en "Copy template to clipboard (JSON)"
                print("🔍 Buscando botón de copia al portapapeles...")
                
                # Usar selector más específico para el botón clickeable
                copy_button = page.locator('div.cursor-pointer:has-text("Copy template to clipboard (JSON)")')
                
                copy_clicked = False
                if await copy_button.count() > 0:
                    print(f"✅ Botón clickeable encontrado")
                    await copy_button.click()
                    await page.wait_for_timeout(2000)
                    copy_clicked = True
                else:
                    # Fallback: intentar con el último elemento de la lista
                    print("🔄 Probando selector alternativo...")
                    copy_button = page.locator('div:has-text("Copy template to clipboard (JSON)")').last
                    if await copy_button.count() > 0:
                        print(f"✅ Botón encontrado (último elemento)")
                        await copy_button.click()
                        await page.wait_for_timeout(2000)
                        copy_clicked = True
                
                if copy_clicked:
                    print("✅ Botón de copia clickeado")
                    
                    # Leer contenido del portapapeles
                    print("📋 Leyendo portapapeles...")
                    try:
                        clipboard_content = await page.evaluate("""
                            () => {
                                return navigator.clipboard.readText().then(text => {
                                    return text;
                                }).catch(error => {
                                    return "ERROR: " + error.message;
                                });
                            }
                        """)
                        
                        if clipboard_content and not clipboard_content.startswith("ERROR:"):
                            print("✅ Contenido del portapapeles obtenido")
                            
                            # Verificar que es JSON válido
                            try:
                                workflow_json = json.loads(clipboard_content)
                                print("✅ JSON válido confirmado")
                                
                                # Guardar archivo
                                filename = "test_download_workflow.json"
                                filepath = os.path.join(output_dir, filename)
                                
                                with open(filepath, 'w', encoding='utf-8') as f:
                                    json.dump(workflow_json, f, indent=2, ensure_ascii=False)
                                
                                print(f"🎉 ¡Descarga exitosa!")
                                print(f"📁 Archivo guardado: {filepath}")
                                print(f"📊 Nodos en el workflow: {len(workflow_json.get('nodes', []))}")
                                
                                return True
                                
                            except json.JSONDecodeError as e:
                                print(f"❌ Error: JSON inválido - {e}")
                                print(f"Contenido: {clipboard_content[:200]}...")
                                
                        else:
                            print(f"❌ Error leyendo portapapeles: {clipboard_content}")
                    
                    except Exception as e:
                        print(f"❌ Error accediendo al portapapeles: {e}")
                
                else:
                    print("❌ No se encontró el botón de copia")
                    
                    # Debug: mostrar todos los elementos visibles del modal
                    print("🔍 Elementos disponibles en el modal:")
                    modal_elements = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').all()
                    for elem in modal_elements:
                        text = await elem.text_content()
                        if text:
                            print(f"  - {text[:100]}...")
            
            else:
                print("❌ Botón 'Use for free' no encontrado")
                
                # Debug: mostrar todos los botones disponibles
                print("🔍 Botones disponibles en la página:")
                buttons = await page.locator('button').all()
                for button in buttons[:10]:  # Limitar a primeros 10
                    text = await button.text_content()
                    if text:
                        print(f"  - {text.strip()}")
            
        except Exception as e:
            print(f"❌ Error general: {e}")
        
        finally:
            print("⏳ Esperando 5 segundos para revisión manual...")
            await page.wait_for_timeout(5000)
            await browser.close()
            print("✅ Navegador cerrado")
        
        return False

if __name__ == "__main__":
    success = asyncio.run(test_download())
    if success:
        print("\n🎉 TEST EXITOSO - El mecanismo de descarga funciona!")
    else:
        print("\n❌ TEST FALLIDO - Revisar el mecanismo de descarga")
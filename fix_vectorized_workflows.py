#!/usr/bin/env python3
"""
🔧 FIXER PARA WORKFLOWS VECTORIZADOS
Copia los workflows originales (.json) junto a sus metadatos (.metadata.json)
"""

import os
import shutil
import json
from pathlib import Path

def fix_vectorized_workflows():
    """Copiar workflows originales a las carpetas vectorizadas"""
    
    source_path = Path("C:/Users/eddym/Downloads/n8n Workflows")
    woka_path = Path("C:/Users/eddym/Downloads/n8n-ai-assistant/woka")
    workflow_vecto_path = Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow Vecto")
    
    print("🔧 REPARANDO WORKFLOWS VECTORIZADOS")
    print("="*50)
    
    copied_count = 0
    error_count = 0
    
    # Procesar woka
    if woka_path.exists():
        print(f"📁 Procesando: {woka_path}")
        copied, errors = copy_original_workflows(source_path, woka_path)
        copied_count += copied
        error_count += errors
    
    # Procesar Workflow Vecto
    if workflow_vecto_path.exists():
        print(f"📁 Procesando: {workflow_vecto_path}")
        copied, errors = copy_original_workflows(source_path, workflow_vecto_path)
        copied_count += copied
        error_count += errors
    
    print(f"\n✅ COMPLETADO:")
    print(f"   📄 Workflows copiados: {copied_count}")
    print(f"   ❌ Errores: {error_count}")

def copy_original_workflows(source_path, dest_path):
    """Copiar workflows originales manteniendo estructura de carpetas"""
    
    copied = 0
    errors = 0
    
    # Recorrer todas las carpetas de destino
    for category_folder in dest_path.iterdir():
        if not category_folder.is_dir():
            continue
            
        print(f"  📂 {category_folder.name}")
        
        # Buscar archivos .metadata.json
        for metadata_file in category_folder.glob("*.metadata.json"):
            try:
                # Obtener el nombre del workflow original
                workflow_name = metadata_file.name.replace(".metadata.json", "")
                
                # Buscar el archivo original en la carpeta fuente
                original_file = find_original_workflow(source_path, workflow_name)
                
                if original_file:
                    # Copiar el workflow original
                    dest_workflow = category_folder / workflow_name
                    
                    if not dest_workflow.exists():
                        shutil.copy2(original_file, dest_workflow)
                        copied += 1
                        print(f"    ✅ {workflow_name}")
                    else:
                        print(f"    ⏭️  {workflow_name} (ya existe)")
                else:
                    print(f"    ❌ {workflow_name} (no encontrado)")
                    errors += 1
                    
            except Exception as e:
                print(f"    ❌ Error procesando {metadata_file.name}: {e}")
                errors += 1
    
    return copied, errors

def find_original_workflow(source_path, workflow_name):
    """Buscar un workflow en la estructura de carpetas fuente"""
    
    # Buscar recursivamente
    for root, dirs, files in os.walk(source_path):
        if workflow_name in files:
            return Path(root) / workflow_name
    
    return None

if __name__ == "__main__":
    fix_vectorized_workflows()
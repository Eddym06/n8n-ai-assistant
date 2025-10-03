#!/usr/bin/env python3
"""
Script para reorganizar workflows en la carpeta extras de n8n
- Extrae workflow.json de cada subcarpeta
- Renombra el archivo con el nombre de la carpeta padre
- Elimina README.md y la carpeta original
- Solo procesa subcarpetas dentro de 'extras'
"""

import os
import json
import shutil
from pathlib import Path

def reorganize_extras_workflows():
    """
    Reorganiza workflows en la carpeta extras
    """
    base_path = Path(r"C:\Users\eddym\Downloads\n8n Workflows\extras")
    
    if not base_path.exists():
        print(f"❌ La carpeta base no existe: {base_path}")
        return
    
    processed_count = 0
    error_count = 0
    
    print(f"🔍 Explorando carpeta: {base_path}")
    
    # Recorrer todas las subcategorías (analytics, automation, etc.)
    for category_dir in base_path.iterdir():
        if not category_dir.is_dir():
            continue
            
        print(f"\n📁 Procesando categoría: {category_dir.name}")
        
        # Recorrer todas las subcarpetas de workflows dentro de cada categoría
        for workflow_dir in category_dir.iterdir():
            if not workflow_dir.is_dir():
                continue
            
            try:
                # Buscar workflow.json en la carpeta
                workflow_json = workflow_dir / "workflow.json"
                
                if not workflow_json.exists():
                    print(f"  ⚠️  No se encontró workflow.json en: {workflow_dir.name}")
                    continue
                
                # Crear nuevo nombre basado en el nombre de la carpeta
                new_filename = f"{workflow_dir.name}.json"
                new_filepath = category_dir / new_filename
                
                # Verificar que el JSON es válido antes de mover
                try:
                    with open(workflow_json, 'r', encoding='utf-8') as f:
                        json.load(f)  # Validar JSON
                except json.JSONDecodeError as e:
                    print(f"  ❌ JSON inválido en {workflow_dir.name}: {e}")
                    error_count += 1
                    continue
                
                # Copiar el archivo JSON al directorio padre con nuevo nombre
                shutil.copy2(workflow_json, new_filepath)
                
                # Eliminar la carpeta original (incluyendo README.md)
                shutil.rmtree(workflow_dir)
                
                print(f"  ✅ Procesado: {workflow_dir.name} → {new_filename}")
                processed_count += 1
                
            except Exception as e:
                print(f"  ❌ Error procesando {workflow_dir.name}: {e}")
                error_count += 1
    
    print(f"\n🎉 Proceso completado:")
    print(f"  ✅ Workflows procesados: {processed_count}")
    print(f"  ❌ Errores: {error_count}")

def preview_changes():
    """
    Muestra una vista previa de los cambios que se harán
    """
    base_path = Path(r"C:\Users\eddym\Downloads\n8n Workflows\extras")
    
    if not base_path.exists():
        print(f"❌ La carpeta base no existe: {base_path}")
        return
    
    print("📋 Vista previa de cambios:")
    print("=" * 50)
    
    total_workflows = 0
    
    for category_dir in base_path.iterdir():
        if not category_dir.is_dir():
            continue
            
        category_workflows = []
        
        for workflow_dir in category_dir.iterdir():
            if not workflow_dir.is_dir():
                continue
            
            workflow_json = workflow_dir / "workflow.json"
            if workflow_json.exists():
                new_filename = f"{workflow_dir.name}.json"
                category_workflows.append((workflow_dir.name, new_filename))
                total_workflows += 1
        
        if category_workflows:
            print(f"\n📁 {category_dir.name} ({len(category_workflows)} workflows):")
            for original, new_name in category_workflows[:3]:  # Mostrar solo 3 ejemplos
                print(f"  {original}/ → {new_name}")
            if len(category_workflows) > 3:
                print(f"  ... y {len(category_workflows) - 3} más")
    
    print(f"\n📊 Total workflows a procesar: {total_workflows}")

if __name__ == "__main__":
    print("🚀 Script Reorganizador de Workflows n8n - Carpeta Extras")
    print("=" * 60)
    
    # Mostrar vista previa
    preview_changes()
    
    # Solicitar confirmación
    print(f"\n⚠️  ADVERTENCIA: Este proceso eliminará las carpetas originales")
    print("¿Desea continuar? (y/N): ", end="")
    
    # Para ejecución automática, comentar las siguientes líneas
    # y descomentar la línea reorganize_extras_workflows()
    
    try:
        response = input().lower().strip()
        if response in ['y', 'yes', 'sí', 's']:
            print("\n🔄 Iniciando reorganización...")
            reorganize_extras_workflows()
        else:
            print("❌ Operación cancelada")
    except KeyboardInterrupt:
        print("\n❌ Operación cancelada por el usuario")
    
    # Para ejecución automática sin confirmación:
    # reorganize_extras_workflows()
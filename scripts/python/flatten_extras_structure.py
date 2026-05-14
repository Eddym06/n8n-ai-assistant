#!/usr/bin/env python3
"""
Script para mover todos los archivos JSON de subcarpetas a la carpeta extras principal
- Extrae todos los archivos .json de subcarpetas dentro de extras
- Los mueve directamente a la carpeta extras
- Elimina las subcarpetas vacías después del movimiento
"""

import os
import shutil
from pathlib import Path

def flatten_json_files():
    """
    Mueve todos los archivos JSON de subcarpetas a la carpeta extras principal
    """
    extras_path = Path(r"C:\Users\eddym\Downloads\n8n Workflows\extras")
    
    if not extras_path.exists():
        print(f"❌ La carpeta extras no existe: {extras_path}")
        return
    
    moved_count = 0
    error_count = 0
    directories_removed = 0
    
    print(f"🔍 Procesando carpeta: {extras_path}")
    
    # Obtener todas las subcarpetas
    subdirectories = [d for d in extras_path.iterdir() if d.is_dir()]
    
    print(f"📁 Encontradas {len(subdirectories)} subcarpetas")
    
    # Procesar cada subcarpeta
    for subdir in subdirectories:
        print(f"\n📂 Procesando subcarpeta: {subdir.name}")
        
        # Buscar todos los archivos JSON en la subcarpeta
        json_files = list(subdir.glob("*.json"))
        
        if not json_files:
            print(f"  ⚠️  No se encontraron archivos JSON en {subdir.name}")
            # Intentar eliminar la carpeta vacía
            try:
                if not any(subdir.iterdir()):  # Verificar que esté vacía
                    shutil.rmtree(subdir)
                    print(f"  🗑️  Carpeta vacía eliminada: {subdir.name}")
                    directories_removed += 1
            except Exception as e:
                print(f"  ⚠️  No se pudo eliminar carpeta vacía {subdir.name}: {e}")
            continue
        
        print(f"  📄 Encontrados {len(json_files)} archivos JSON")
        
        # Mover cada archivo JSON
        for json_file in json_files:
            try:
                # Destino en la carpeta extras principal
                destination = extras_path / json_file.name
                
                # Si ya existe un archivo con el mismo nombre, añadir un sufijo
                if destination.exists():
                    base_name = json_file.stem
                    extension = json_file.suffix
                    counter = 1
                    
                    while destination.exists():
                        new_name = f"{base_name}_{counter}{extension}"
                        destination = extras_path / new_name
                        counter += 1
                    
                    print(f"  ⚠️  Archivo renombrado para evitar conflicto: {destination.name}")
                
                # Mover el archivo
                shutil.move(str(json_file), str(destination))
                print(f"  ✅ Movido: {json_file.name} → {destination.name}")
                moved_count += 1
                
            except Exception as e:
                print(f"  ❌ Error moviendo {json_file.name}: {e}")
                error_count += 1
        
        # Intentar eliminar la subcarpeta después de mover los JSON
        try:
            # Verificar si la carpeta está vacía o solo tiene archivos no-JSON
            remaining_files = list(subdir.iterdir())
            if not remaining_files:
                shutil.rmtree(subdir)
                print(f"  🗑️  Subcarpeta eliminada: {subdir.name}")
                directories_removed += 1
            else:
                print(f"  📁 Subcarpeta conservada (contiene {len(remaining_files)} archivos no-JSON)")
        except Exception as e:
            print(f"  ⚠️  No se pudo eliminar subcarpeta {subdir.name}: {e}")
    
    print(f"\n🎉 Proceso completado:")
    print(f"  ✅ Archivos JSON movidos: {moved_count}")
    print(f"  🗑️  Subcarpetas eliminadas: {directories_removed}")
    print(f"  ❌ Errores: {error_count}")
    
    # Verificar el resultado final
    final_json_count = len(list(extras_path.glob("*.json")))
    print(f"  📊 Total archivos JSON en extras: {final_json_count}")

def preview_operation():
    """
    Muestra una vista previa de lo que se va a hacer
    """
    extras_path = Path(r"C:\Users\eddym\Downloads\n8n Workflows\extras")
    
    if not extras_path.exists():
        print(f"❌ La carpeta extras no existe: {extras_path}")
        return
    
    print("📋 Vista previa de la operación:")
    print("=" * 50)
    
    total_json_files = 0
    subdirectories = [d for d in extras_path.iterdir() if d.is_dir()]
    
    for subdir in subdirectories:
        json_files = list(subdir.glob("*.json"))
        if json_files:
            print(f"\n📂 {subdir.name}:")
            for json_file in json_files[:5]:  # Mostrar solo los primeros 5
                print(f"  📄 {json_file.name}")
            if len(json_files) > 5:
                print(f"  ... y {len(json_files) - 5} archivos más")
            total_json_files += len(json_files)
    
    print(f"\n📊 Total archivos JSON a mover: {total_json_files}")
    print(f"📊 Subcarpetas a procesar: {len(subdirectories)}")

if __name__ == "__main__":
    print("🚀 Script para Aplanar Estructura de Carpetas Extras")
    print("=" * 60)
    
    # Mostrar vista previa
    preview_operation()
    
    # Solicitar confirmación
    print(f"\n⚠️  Esta operación moverá todos los archivos JSON a la carpeta extras principal")
    print("¿Desea continuar? (y/N): ", end="")
    
    # Para ejecución automática, comentar las siguientes líneas
    # y descomentar la línea flatten_json_files()
    
    try:
        response = input().lower().strip()
        if response in ['y', 'yes', 'sí', 's']:
            print("\n🔄 Iniciando operación...")
            flatten_json_files()
        else:
            print("❌ Operación cancelada")
    except KeyboardInterrupt:
        print("\n❌ Operación cancelada por el usuario")
    
    # Para ejecución automática sin confirmación:
    # flatten_json_files()
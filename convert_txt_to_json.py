#!/usr/bin/env python3
"""
Script para convertir archivos TXT de workflows n8n a formato JSON
- Procesa todos los archivos .txt en 'C:/Users/eddym/Downloads/n8n Workflows'
- Valida que el contenido sea JSON válido
- Convierte .txt a .json con nombres limpiados
- Preserva la estructura original y añade metadata
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

def clean_filename(filename):
    """
    Limpia el nombre del archivo para hacerlo válido
    """
    # Remover caracteres no válidos para nombres de archivo
    cleaned = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Remover múltiples espacios y guiones bajos
    cleaned = re.sub(r'[_\s]+', '_', cleaned)
    # Remover caracteres especiales al inicio/final
    cleaned = cleaned.strip('_.-')
    # Limitar longitud
    if len(cleaned) > 100:
        cleaned = cleaned[:100]
    
    return cleaned

def validate_and_convert_workflow(txt_file_path):
    """
    Valida y convierte un archivo TXT a JSON de workflow
    """
    try:
        # Leer el archivo TXT
        with open(txt_file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        # Intentar parsear como JSON
        try:
            workflow_data = json.loads(content)
        except json.JSONDecodeError as e:
            # Si no es JSON válido, intentar limpieza básica
            print(f"  ⚠️  Contenido no es JSON válido, intentando reparar: {txt_file_path.name}")
            
            # Limpiezas básicas comunes
            content = content.strip()
            if not content.startswith('{'):
                # Buscar el primer '{' 
                start_idx = content.find('{')
                if start_idx != -1:
                    content = content[start_idx:]
            
            if not content.endswith('}'):
                # Buscar el último '}'
                end_idx = content.rfind('}')
                if end_idx != -1:
                    content = content[:end_idx + 1]
            
            try:
                workflow_data = json.loads(content)
            except json.JSONDecodeError as e2:
                return False, f"JSON inválido después de intentar reparar: {e2}"
        
        # Validar estructura básica de workflow n8n
        if not isinstance(workflow_data, dict):
            return False, "El contenido no es un objeto JSON"
        
        required_fields = ['nodes']
        missing_fields = [field for field in required_fields if field not in workflow_data]
        if missing_fields:
            return False, f"Faltan campos requeridos: {missing_fields}"
        
        # Verificar que nodes sea una lista
        if not isinstance(workflow_data.get('nodes'), list):
            return False, "El campo 'nodes' debe ser una lista"
        
        # Añadir metadata de conversión si no existe
        if 'meta' not in workflow_data:
            workflow_data['meta'] = {}
        
        workflow_data['meta']['converted_from_txt'] = True
        workflow_data['meta']['conversion_date'] = datetime.now().isoformat()
        workflow_data['meta']['original_filename'] = txt_file_path.name
        
        return True, workflow_data
        
    except Exception as e:
        return False, f"Error procesando archivo: {e}"

def convert_txt_to_json():
    """
    Convierte todos los archivos TXT de workflows a JSON
    """
    base_path = Path(r"C:/Users/eddym/Downloads/n8n Workflows")
    
    if not base_path.exists():
        print(f"❌ La carpeta base no existe: {base_path}")
        return
    
    # Buscar todos los archivos .txt en la carpeta base
    txt_files = list(base_path.glob("*.txt"))
    
    if not txt_files:
        print("❌ No se encontraron archivos .txt en la carpeta")
        return
    
    print(f"🔍 Encontrados {len(txt_files)} archivos .txt para convertir")
    
    converted_count = 0
    error_count = 0
    errors_detail = []
    
    # Crear carpeta de salida para los JSON convertidos
    output_dir = base_path / "converted_workflows"
    output_dir.mkdir(exist_ok=True)
    
    for txt_file in txt_files:
        try:
            print(f"\n📄 Procesando: {txt_file.name}")
            
            # Validar y convertir
            is_valid, result = validate_and_convert_workflow(txt_file)
            
            if is_valid:
                # Crear nombre limpio para el archivo JSON
                base_name = txt_file.stem  # Nombre sin extensión
                clean_name = clean_filename(base_name)
                json_filename = f"{clean_name}.json"
                json_filepath = output_dir / json_filename
                
                # Evitar sobrescribir archivos
                counter = 1
                while json_filepath.exists():
                    json_filename = f"{clean_name}_{counter}.json"
                    json_filepath = output_dir / json_filename
                    counter += 1
                
                # Guardar el JSON
                with open(json_filepath, 'w', encoding='utf-8') as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                
                print(f"  ✅ Convertido a: {json_filename}")
                converted_count += 1
                
            else:
                print(f"  ❌ Error: {result}")
                errors_detail.append(f"{txt_file.name}: {result}")
                error_count += 1
                
        except Exception as e:
            print(f"  ❌ Error inesperado: {e}")
            errors_detail.append(f"{txt_file.name}: {e}")
            error_count += 1
    
    # Resumen final
    print(f"\n🎉 Conversión completada:")
    print(f"  ✅ Archivos convertidos: {converted_count}")
    print(f"  ❌ Errores: {error_count}")
    print(f"  📁 Archivos guardados en: {output_dir}")
    
    # Guardar log de errores si los hay
    if errors_detail:
        error_log_path = output_dir / "conversion_errors.log"
        with open(error_log_path, 'w', encoding='utf-8') as f:
            f.write("Errores durante la conversión TXT a JSON\n")
            f.write("=" * 50 + "\n\n")
            for error in errors_detail:
                f.write(f"{error}\n")
        print(f"  📋 Log de errores guardado en: {error_log_path}")

def preview_txt_files():
    """
    Muestra una vista previa de los archivos TXT encontrados
    """
    base_path = Path(r"C:/Users/eddym/Downloads/n8n Workflows")
    
    if not base_path.exists():
        print(f"❌ La carpeta base no existe: {base_path}")
        return
    
    txt_files = list(base_path.glob("*.txt"))
    
    print("📋 Vista previa de archivos TXT encontrados:")
    print("=" * 60)
    
    if not txt_files:
        print("❌ No se encontraron archivos .txt")
        return
    
    print(f"📊 Total archivos .txt: {len(txt_files)}")
    
    # Mostrar primeros 10 archivos como ejemplo
    for i, txt_file in enumerate(txt_files[:10]):
        clean_name = clean_filename(txt_file.stem)
        print(f"  {i+1:2d}. {txt_file.name}")
        print(f"      → {clean_name}.json")
    
    if len(txt_files) > 10:
        print(f"  ... y {len(txt_files) - 10} archivos más")

if __name__ == "__main__":
    print("🚀 Script Conversor TXT a JSON - Workflows n8n")
    print("=" * 50)
    
    # Mostrar vista previa
    preview_txt_files()
    
    # Solicitar confirmación
    print(f"\n⚠️  Los archivos JSON se guardarán en: converted_workflows/")
    print("¿Desea continuar con la conversión? (y/N): ", end="")
    
    # Para ejecución automática, comentar las siguientes líneas
    # y descomentar la línea convert_txt_to_json()
    
    try:
        response = input().lower().strip()
        if response in ['y', 'yes', 'sí', 's']:
            print("\n🔄 Iniciando conversión...")
            convert_txt_to_json()
        else:
            print("❌ Operación cancelada")
    except KeyboardInterrupt:
        print("\n❌ Operación cancelada por el usuario")
    
    # Para ejecución automática sin confirmación:
    # convert_txt_to_json()
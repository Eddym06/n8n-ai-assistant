#!/usr/bin/env python3
"""
Script para convertir manualmente los archivos TXT problemáticos a JSON
"""

import json
import re
from pathlib import Path
from datetime import datetime

def extract_json_from_file(file_path, output_dir):
    """
    Extrae JSON válido de un archivo TXT problemático
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Buscar el primer '{' y último '}' que forman un JSON válido
        start_brace = content.find('{')
        if start_brace == -1:
            return False, "No se encontró inicio de JSON"
        
        # Contar llaves balanceadas desde el inicio
        brace_count = 0
        end_pos = start_brace
        
        for i, char in enumerate(content[start_brace:], start_brace):
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_pos = i + 1
                    break
        
        if brace_count != 0:
            return False, "JSON no balanceado - llaves no coinciden"
        
        # Extraer el JSON
        json_content = content[start_brace:end_pos]
        
        # Validar que es JSON válido
        try:
            workflow_data = json.loads(json_content)
        except json.JSONDecodeError as e:
            return False, f"JSON extraído no es válido: {e}"
        
        # Añadir metadata de conversión
        if 'meta' not in workflow_data:
            workflow_data['meta'] = {}
        
        workflow_data['meta']['converted_from_txt'] = True
        workflow_data['meta']['conversion_date'] = datetime.now().isoformat()
        workflow_data['meta']['original_filename'] = file_path.name
        workflow_data['meta']['manual_extraction'] = True
        
        # Crear nombre limpio para el archivo
        base_name = file_path.stem
        # Limpiar caracteres problemáticos
        clean_name = re.sub(r'[<>:"/\\|?*🔍📈🤖🧠⚡✨🎨🐋🚀🔐🦙🔥📚📋]', '_', base_name)
        clean_name = re.sub(r'[_\s]+', '_', clean_name)
        clean_name = clean_name.strip('_.-')
        
        if len(clean_name) > 100:
            clean_name = clean_name[:100]
        
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
            json.dump(workflow_data, f, indent=2, ensure_ascii=False)
        
        return True, json_filepath
        
    except Exception as e:
        return False, f"Error procesando archivo: {e}"

def main():
    """
    Convierte los archivos problemáticos específicos
    """
    base_path = Path(r"C:/Users/eddym/Downloads/n8n Workflows")
    output_dir = base_path / "converted_workflows"
    
    # Archivos problemáticos específicos
    problem_files = [
        "Host Your Own AI Deep Research Agent with n8n, Apify and OpenAI o3.txt",
        "🔍 Perplexity Research to HTML_ AI-Powered Content Creation.txt"
    ]
    
    print("🔧 Conversión Manual de Archivos Problemáticos")
    print("=" * 50)
    
    success_count = 0
    
    for filename in problem_files:
        file_path = base_path / filename
        
        if not file_path.exists():
            print(f"❌ Archivo no encontrado: {filename}")
            continue
        
        print(f"\n📄 Procesando: {filename}")
        
        success, result = extract_json_from_file(file_path, output_dir)
        
        if success:
            print(f"  ✅ Convertido exitosamente a: {result.name}")
            success_count += 1
        else:
            print(f"  ❌ Error: {result}")
    
    print(f"\n🎉 Conversión completada:")
    print(f"  ✅ Archivos convertidos: {success_count}")
    print(f"  📁 Ubicación: {output_dir}")

if __name__ == "__main__":
    main()
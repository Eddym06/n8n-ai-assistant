#!/usr/bin/env python3
"""
🔍 DETECTIVE DE ESCRITURA DE ARCHIVOS
Rastrear exactamente dónde y cómo el script está escribiendo archivos
"""

import json
from pathlib import Path

def analyze_file_paths():
    """Analizar todas las rutas de archivos problemáticos"""
    
    print("🔍 ANÁLISIS FORENSE DE ARCHIVOS MODIFICADOS")
    print("=" * 60)
    
    # Buscar todos los archivos Agente_RAG_Agendamento
    problematic_files = []
    
    for path in Path(".").rglob("*Agente_RAG_Agendamento*"):
        if path.is_file():
            stat = path.stat()
            problematic_files.append({
                'path': str(path),
                'size': stat.st_size,
                'modified': stat.st_mtime,
                'absolute': str(path.absolute())
            })
    
    # Ordenar por fecha de modificación
    problematic_files.sort(key=lambda x: x['modified'], reverse=True)
    
    print(f"📋 ARCHIVOS ENCONTRADOS: {len(problematic_files)}")
    print()
    
    for i, file_info in enumerate(problematic_files, 1):
        print(f"{i}. {file_info['path']}")
        print(f"   📏 Tamaño: {file_info['size']:,} bytes")
        print(f"   📅 Modificado: {file_info['modified']}")
        print(f"   📍 Ruta absoluta: {file_info['absolute']}")
        
        # Determinar si está en directorio protegido
        protected_dirs = [
            'workflows',
            'Workflow MCP n8n', 
            'C:/Users/eddym/Downloads/n8n Workflows',
            'woka'
        ]
        
        is_protected = False
        for pdir in protected_dirs:
            if pdir in file_info['path']:
                is_protected = True
                print(f"   🚨 ESTÁ EN DIRECTORIO PROTEGIDO: {pdir}")
                break
        
        if not is_protected:
            print(f"   ✅ No está en directorio protegido")
        
        print()

def simulate_vectorizer_path_logic():
    """Simular exactamente la lógica de rutas del vectorizador"""
    
    print("🧪 SIMULACIÓN DE LÓGICA DE RUTAS DEL VECTORIZADOR")
    print("=" * 60)
    
    # Configuración exacta del script
    source_paths = [
        {
            'path': Path("workflows"),
            'name': 'workflows',
            'apply_node_filter': True
        },
        {
            'path': Path("Workflow MCP n8n"),
            'name': 'workflow_mcp_n8n', 
            'apply_node_filter': True
        },
        {
            'path': Path("C:/Users/eddym/Downloads/n8n Workflows"),
            'name': 'n8n_workflows_externos',
            'apply_node_filter': False
        },
        {
            'path': Path("woka"),
            'name': 'woka',
            'apply_node_filter': False
        }
    ]
    
    output_path = Path("Workflow Vecto Corregidos")
    
    # Directorios protegidos
    protected_source_dirs = {str(source['path'].absolute()) for source in source_paths}
    
    print("📁 DIRECTORIOS PROTEGIDOS:")
    for pdir in protected_source_dirs:
        print(f"   🚫 {pdir}")
    print()
    
    # Simular proceso de guardado para cada fuente
    for source in source_paths:
        category_name = source['name']
        output_category_path = output_path / category_name
        
        print(f"📂 Procesando fuente: {source['path']}")
        print(f"   📤 Output esperado: {output_category_path}")
        print(f"   📍 Output absoluto: {output_category_path.absolute()}")
        
        # Verificar protección
        target_absolute = str(output_category_path.absolute())
        is_protected = any(target_absolute.startswith(pdir) for pdir in protected_source_dirs)
        print(f"   🔒 ¿Protegido? {is_protected}")
        
        # Simular archivo específico
        workflow_filename = "Agente_RAG_Agendamento.json.metadata.json"
        workflow_path = output_category_path / workflow_filename
        
        print(f"   📝 Archivo workflow: {workflow_path}")
        print(f"   📍 Archivo absoluto: {workflow_path.absolute()}")
        
        # Verificar protección del archivo
        file_absolute = str(workflow_path.absolute())
        file_protected = any(file_absolute.startswith(pdir) for pdir in protected_source_dirs) 
        print(f"   🔒 ¿Archivo protegido? {file_protected}")
        
        print()

if __name__ == "__main__":
    analyze_file_paths()
    print()
    simulate_vectorizer_path_logic()
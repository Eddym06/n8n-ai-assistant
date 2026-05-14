#!/usr/bin/env python3
"""
🕵️ DETECTIVE AVANZADO DE MODIFICACIÓN DE ARCHIVOS
Rastrear EXACTAMENTE qué archivos se leen y escriben durante la ejecución
"""

import json
import os
from pathlib import Path
from datetime import datetime
import hashlib

def log_event(message):
    """Log con timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    print(f"[{timestamp}] {message}")

def get_file_hash(file_path):
    """Calcular hash MD5 de un archivo"""
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            return hashlib.md5(content).hexdigest()
    except:
        return "ERROR"

def get_file_info(file_path):
    """Obtener información completa de un archivo"""
    try:
        stat = Path(file_path).stat()
        return {
            'size': stat.st_size,
            'mtime': stat.st_mtime,
            'hash': get_file_hash(file_path)
        }
    except:
        return None

def scan_critical_files():
    """Escanear archivos críticos antes y después de la ejecución"""
    log_event("🔍 INICIANDO ESCANEO DE ARCHIVOS CRÍTICOS")
    
    critical_files = []
    
    # Buscar archivos específicos que sabemos que se han modificado
    test_patterns = [
        "woka/converted_workflows/Agente_RAG_Agendamento.json",
        "Workflow VEcto/converted_workflows/Agente_RAG_Agendamento.json", 
        "workflows/Agente_RAG_Agendamento.json"
    ]
    
    for pattern in test_patterns:
        file_path = Path(pattern)
        if file_path.exists():
            info = get_file_info(file_path)
            if info:
                critical_files.append({
                    'path': str(file_path),
                    'info': info
                })
                log_event(f"📋 {file_path}: Size={info['size']}, Hash={info['hash'][:8]}...")
    
    # También buscar archivos en directorios principales
    for base_dir in ['workflows', 'woka', 'Workflow MCP n8n']:
        base_path = Path(base_dir)
        if base_path.exists():
            for json_file in base_path.rglob("*.json"):
                if "Agente_RAG_Agendamento" in json_file.name:
                    info = get_file_info(json_file)
                    if info:
                        critical_files.append({
                            'path': str(json_file),
                            'info': info
                        })
                        log_event(f"📋 {json_file}: Size={info['size']}, Hash={info['hash'][:8]}...")
    
    return critical_files

def check_directory_timestamps():
    """Verificar timestamps de directorios que podrían estar siendo modificados"""
    log_event("🕐 VERIFICANDO TIMESTAMPS DE DIRECTORIOS")
    
    directories = ['workflows', 'woka', 'Workflow MCP n8n', 'Workflow Vecto Corregidos']
    
    for dir_name in directories:
        dir_path = Path(dir_name)
        if dir_path.exists():
            stat = dir_path.stat()
            log_event(f"📁 {dir_name}: mtime={datetime.fromtimestamp(stat.st_mtime)}")
            
            # También verificar subdirectorios
            for subdir in dir_path.iterdir():
                if subdir.is_dir():
                    sub_stat = subdir.stat()
                    log_event(f"  📂 {subdir.name}: mtime={datetime.fromtimestamp(sub_stat.st_mtime)}")

def analyze_file_operations():
    """Analizar operaciones en el sistema de archivos"""
    log_event("🔬 ANALIZANDO OPERACIONES DEL SISTEMA DE ARCHIVOS")
    
    # Buscar archivos recientemente modificados
    recent_files = []
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.json'):
                file_path = Path(root) / file
                try:
                    stat = file_path.stat()
                    # Archivos modificados en las últimas horas
                    if (datetime.now().timestamp() - stat.st_mtime) < 28800:  # 8 horas
                        recent_files.append({
                            'path': str(file_path),
                            'mtime': datetime.fromtimestamp(stat.st_mtime),
                            'size': stat.st_size
                        })
                except:
                    continue
    
    # Ordenar por fecha de modificación
    recent_files.sort(key=lambda x: x['mtime'], reverse=True)
    
    log_event(f"📊 Encontrados {len(recent_files)} archivos JSON modificados recientemente:")
    for file_info in recent_files[:20]:  # Solo los primeros 20
        log_event(f"  📄 {file_info['path']} - {file_info['mtime']} - {file_info['size']} bytes")

def main():
    """Función principal de análisis"""
    log_event("🚀 INICIANDO ANÁLISIS FORENSE AVANZADO")
    
    print("="*80)
    before_files = scan_critical_files()
    print("\n" + "="*80)
    check_directory_timestamps()
    print("\n" + "="*80)
    analyze_file_operations()
    print("\n" + "="*80)
    
    log_event("✅ ANÁLISIS COMPLETADO")
    
    return before_files

if __name__ == "__main__":
    main()
# 🔄 SCRIPT DE FUSIÓN DE BASES DE DATOS VECTORIZADAS
# Fusiona la base de datos de woka con Workflow Vecto
# Preserva datos existentes y añade nuevos workflows

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
import hashlib

print("🔄 ================================================")
print("🔄 FUSIÓN DE BASES DE DATOS VECTORIZADAS")
print("🔄 woka → Workflow Vecto")
print("🔄 ================================================\n")

class DatabaseMerger:
    def __init__(self):
        self.source_path = Path("C:/Users/eddym/Downloads/n8n-ai-assistant/woka")
        self.target_path = Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow Vecto")
        
        # Estadísticas
        self.stats = {
            'folders_copied': 0,
            'files_copied': 0,
            'duplicates_skipped': 0,
            'errors': 0,
            'start_time': datetime.now()
        }
        
        print(f"📁 Origen: {self.source_path}")
        print(f"📁 Destino: {self.target_path}")
        print()

    def get_file_hash(self, file_path: Path) -> str:
        """Generar hash de archivo para detectar duplicados"""
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
                return hashlib.md5(content).hexdigest()
        except Exception:
            return ""

    def copy_folder_contents(self, source_folder: Path, target_folder: Path):
        """Copiar contenido de carpeta evitando duplicados"""
        if not source_folder.exists():
            return
            
        # Crear carpeta destino si no existe
        target_folder.mkdir(parents=True, exist_ok=True)
        
        print(f"📂 Procesando: {source_folder.name}")
        
        files_in_folder = 0
        for item in source_folder.iterdir():
            if item.is_file():
                target_file = target_folder / item.name
                
                # Verificar si el archivo ya existe
                if target_file.exists():
                    # Comparar contenido
                    source_hash = self.get_file_hash(item)
                    target_hash = self.get_file_hash(target_file)
                    
                    if source_hash == target_hash:
                        print(f"   ⏭️ Duplicado: {item.name}")
                        self.stats['duplicates_skipped'] += 1
                        continue
                    else:
                        # Archivo diferente, renombrar
                        name_parts = item.stem, item.suffix
                        counter = 1
                        while target_file.exists():
                            new_name = f"{name_parts[0]}_v{counter}{name_parts[1]}"
                            target_file = target_folder / new_name
                            counter += 1
                        print(f"   📝 Renombrado: {item.name} → {target_file.name}")
                
                try:
                    shutil.copy2(item, target_file)
                    print(f"   ✅ Copiado: {item.name}")
                    self.stats['files_copied'] += 1
                    files_in_folder += 1
                except Exception as e:
                    print(f"   ❌ Error copiando {item.name}: {e}")
                    self.stats['errors'] += 1
            
            elif item.is_dir():
                # Copiar subcarpetas recursivamente
                self.copy_folder_contents(item, target_folder / item.name)
        
        if files_in_folder > 0:
            self.stats['folders_copied'] += 1
        print(f"   📊 {files_in_folder} archivos procesados\n")

    def merge_summaries(self):
        """Fusionar los archivos de resumen"""
        woka_summary_path = self.source_path / "vectorization_summary.json"
        target_summary_path = self.target_path / "combined_vectorization_summary.json"
        
        try:
            # Cargar resumen de woka
            if woka_summary_path.exists():
                with open(woka_summary_path, 'r', encoding='utf-8') as f:
                    woka_summary = json.load(f)
                print("📊 Resumen de woka cargado")
            else:
                print("⚠️ No se encontró resumen de woka")
                return
            
            # Cargar resumen existente de Workflow Vecto
            existing_summary = {}
            if target_summary_path.exists():
                with open(target_summary_path, 'r', encoding='utf-8') as f:
                    existing_summary = json.load(f)
                print("📊 Resumen existente de Workflow Vecto cargado")
            
            # Crear resumen combinado
            combined_summary = {
                'merge_info': {
                    'merged_at': datetime.now().isoformat(),
                    'source_database': 'woka',
                    'target_database': 'Workflow Vecto',
                    'merge_version': '1.0'
                },
                'woka_data': woka_summary,
                'existing_data': existing_summary.get('woka_data', existing_summary),
                'merge_stats': {
                    'folders_copied': self.stats['folders_copied'],
                    'files_copied': self.stats['files_copied'],
                    'duplicates_skipped': self.stats['duplicates_skipped'],
                    'errors': self.stats['errors']
                }
            }
            
            # Guardar resumen combinado
            with open(target_summary_path, 'w', encoding='utf-8') as f:
                json.dump(combined_summary, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Resumen combinado guardado en: {target_summary_path}")
            
        except Exception as e:
            print(f"❌ Error fusionando resúmenes: {e}")
            self.stats['errors'] += 1

    def run_merge(self):
        """Ejecutar el proceso de fusión"""
        print("🚀 Iniciando fusión de bases de datos...\n")
        
        # Verificar que las carpetas existan
        if not self.source_path.exists():
            print(f"❌ Error: Carpeta origen no encontrada: {self.source_path}")
            return
        
        if not self.target_path.exists():
            print(f"❌ Error: Carpeta destino no encontrada: {self.target_path}")
            return
        
        # Procesar cada carpeta en woka
        for item in self.source_path.iterdir():
            if item.is_dir() and item.name != "__pycache__":
                target_folder = self.target_path / item.name
                self.copy_folder_contents(item, target_folder)
        
        # Fusionar resúmenes
        print("📊 Fusionando resúmenes...")
        self.merge_summaries()
        
        # Mostrar estadísticas finales
        self.show_final_stats()

    def show_final_stats(self):
        """Mostrar estadísticas finales"""
        duration = datetime.now() - self.stats['start_time']
        
        print("\n🎯 ================================================")
        print("🎯 FUSIÓN COMPLETADA")
        print("🎯 ================================================")
        print(f"⏱️  Tiempo total: {duration.total_seconds():.2f} segundos")
        print(f"📁 Carpetas procesadas: {self.stats['folders_copied']}")
        print(f"📄 Archivos copiados: {self.stats['files_copied']}")
        print(f"⏭️ Duplicados omitidos: {self.stats['duplicates_skipped']}")
        print(f"❌ Errores: {self.stats['errors']}")
        print(f"📊 Base de datos combinada en: {self.target_path}")
        print("🎯 ================================================")
        
        if self.stats['errors'] == 0:
            print("✅ Fusión completada exitosamente!")
        else:
            print(f"⚠️ Fusión completada con {self.stats['errors']} errores")

if __name__ == "__main__":
    merger = DatabaseMerger()
    merger.run_merge()
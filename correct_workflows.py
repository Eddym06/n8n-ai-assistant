#!/usr/bin/env python3
"""
🔧 CORRECTOR AVANZADO DE WORKFLOWS
Corrige workflows con problemas específicos detectados por el verificador
"""

import os
import json
import shutil
import uuid
from pathlib import Path
from datetime import datetime

class WorkflowCorrector:
    def __init__(self):
        self.source_folders = [
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/workflows"),
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow MCP n8n"),
        ]
        
        self.target_folders = [
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/woka"),
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow Vecto")
        ]
        
        self.stats = {
            'fixed_ids': 0,
            'removed_metadata': 0,
            'replaced_invalid': 0,
            'total_processed': 0,
            'errors': []
        }

    def generate_node_id(self):
        """Generar un ID único para nodos"""
        return str(uuid.uuid4())

    def fix_missing_node_ids(self, workflow_data):
        """Corregir nodos sin ID"""
        fixed = False
        
        if 'nodes' in workflow_data and workflow_data['nodes']:
            for node in workflow_data['nodes']:
                if 'id' not in node or not node['id']:
                    node['id'] = self.generate_node_id()
                    fixed = True
        
        return workflow_data, fixed

    def fix_workflow_file(self, file_path):
        """Corregir un archivo de workflow específico"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                workflow = json.load(f)
            
            # Verificar si es archivo metadata (sin nodos)
            if not workflow.get('nodes'):
                return False, "archivo metadata"
            
            # Corregir IDs faltantes
            workflow_fixed, ids_fixed = self.fix_missing_node_ids(workflow)
            
            if ids_fixed:
                # Guardar el archivo corregido
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(workflow_fixed, f, indent=2, ensure_ascii=False)
                
                self.stats['fixed_ids'] += 1
                return True, "IDs corregidos"
            
            return False, "sin problemas"
            
        except json.JSONDecodeError:
            return False, "JSON inválido"
        except Exception as e:
            return False, f"error: {e}"

    def remove_metadata_files(self):
        """Eliminar archivos metadata.json que causan problemas"""
        print("🗑️ ELIMINANDO ARCHIVOS METADATA PROBLEMÁTICOS")
        print("="*50)
        
        for folder in self.source_folders + self.target_folders:
            if not folder.exists():
                continue
                
            print(f"📁 Limpiando: {folder}")
            
            for root, dirs, files in os.walk(folder):
                for file in files:
                    if file == 'metadata.json':
                        file_path = Path(root) / file
                        try:
                            file_path.unlink()
                            self.stats['removed_metadata'] += 1
                            print(f"  🗑️ Eliminado: {file_path.relative_to(folder)}")
                        except Exception as e:
                            print(f"  ❌ Error eliminando {file_path}: {e}")

    def fix_problematic_workflows(self):
        """Corregir workflows con problemas en carpetas objetivo"""
        print("🔧 CORRIGIENDO WORKFLOWS PROBLEMÁTICOS")
        print("="*50)
        
        # Cargar lista de errores del reporte
        report_path = Path("workflow_verification_report.json")
        problematic_files = set()
        
        if report_path.exists():
            with open(report_path, 'r', encoding='utf-8') as f:
                report = json.load(f)
                
            for error in report['statistics']['errors']:
                file_path = Path(error['file'])
                if any('sin ID' in issue for issue in error['issues']):
                    problematic_files.add(file_path.name)
        
        print(f"📋 {len(problematic_files)} workflows problemáticos identificados")
        
        # Corregir en carpetas objetivo
        for target_folder in self.target_folders:
            if not target_folder.exists():
                continue
                
            print(f"📂 Corrigiendo en: {target_folder}")
            
            for root, dirs, files in os.walk(target_folder):
                for file in files:
                    if file.endswith('.json') and not file.endswith('.metadata.json'):
                        if file in problematic_files:
                            file_path = Path(root) / file
                            
                            self.stats['total_processed'] += 1
                            success, message = self.fix_workflow_file(file_path)
                            
                            if success:
                                print(f"  ✅ {file}: {message}")
                            else:
                                print(f"  ⚠️ {file}: {message}")

    def verify_corrections(self):
        """Verificar que las correcciones funcionaron"""
        print(f"\n🔍 VERIFICANDO CORRECCIONES")
        print("="*50)
        
        verification_stats = {
            'checked': 0,
            'valid': 0,
            'still_invalid': 0
        }
        
        for target_folder in self.target_folders:
            if not target_folder.exists():
                continue
                
            print(f"📁 Verificando: {target_folder}")
            
            for root, dirs, files in os.walk(target_folder):
                for file in files:
                    if file.endswith('.json') and not file.endswith('.metadata.json'):
                        file_path = Path(root) / file
                        
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                workflow = json.load(f)
                            
                            verification_stats['checked'] += 1
                            
                            # Verificar nodos
                            if 'nodes' not in workflow or not workflow['nodes']:
                                verification_stats['still_invalid'] += 1
                                continue
                            
                            # Verificar IDs
                            all_have_ids = all('id' in node and node['id'] for node in workflow['nodes'])
                            
                            if all_have_ids:
                                verification_stats['valid'] += 1
                            else:
                                verification_stats['still_invalid'] += 1
                                
                        except Exception:
                            verification_stats['still_invalid'] += 1
        
        success_rate = (verification_stats['valid'] / verification_stats['checked'] * 100) if verification_stats['checked'] > 0 else 0
        print(f"  ✅ Workflows válidos: {verification_stats['valid']}/{verification_stats['checked']} ({success_rate:.1f}%)")
        
        return verification_stats

    def generate_report(self):
        """Generar reporte de correcciones"""
        print(f"\n📊 REPORTE DE CORRECCIONES")
        print("="*50)
        print(f"IDs de nodos corregidos: {self.stats['fixed_ids']}")
        print(f"Archivos metadata eliminados: {self.stats['removed_metadata']}")
        print(f"Workflows procesados: {self.stats['total_processed']}")
        
        # Guardar reporte
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'corrections': self.stats,
            'summary': {
                'total_fixes': self.stats['fixed_ids'] + self.stats['removed_metadata'],
                'success': self.stats['fixed_ids'] > 0 or self.stats['removed_metadata'] > 0
            }
        }
        
        report_path = Path("workflow_corrections_report.json")
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Reporte guardado en: {report_path}")

    def run(self):
        """Ejecutar proceso completo de corrección"""
        print("🚀 INICIANDO CORRECCIÓN DE WORKFLOWS")
        print("="*50)
        
        # 1. Eliminar archivos metadata problemáticos
        self.remove_metadata_files()
        
        # 2. Corregir workflows con problemas
        self.fix_problematic_workflows()
        
        # 3. Verificar correcciones
        verification_stats = self.verify_corrections()
        
        # 4. Generar reporte
        self.generate_report()
        
        print(f"\n✅ CORRECCIÓN COMPLETADA")
        print(f"   - {self.stats['fixed_ids']} workflows con IDs corregidos")
        print(f"   - {self.stats['removed_metadata']} archivos metadata eliminados")
        print(f"   - {verification_stats['valid']} workflows válidos finales")
        
        return self.stats['fixed_ids'] > 0 or self.stats['removed_metadata'] > 0

if __name__ == "__main__":
    corrector = WorkflowCorrector()
    corrector.run()
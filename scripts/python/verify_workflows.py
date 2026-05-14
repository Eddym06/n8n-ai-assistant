#!/usr/bin/env python3
"""
🔧 VERIFICADOR Y CORRECTOR DE WORKFLOWS
Verifica la integridad de workflows en múltiples carpetas fuente y corrige problemas
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime

class WorkflowVerifier:
    def __init__(self):
        self.source_folders = [
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/workflows"),
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow MCP n8n"),
            # Path("C:/Users/eddym/Downloads/n8n Workflows")  # Fuera del workspace
        ]
        
        self.target_folders = [
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/woka"),
            Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow Vecto")
        ]
        
        self.stats = {
            'checked': 0,
            'valid': 0,
            'invalid': 0,
            'corrected': 0,
            'errors': []
        }

    def verify_workflow(self, file_path):
        """Verificar si un workflow es válido"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                workflow = json.load(f)
            
            # Verificaciones básicas
            issues = []
            
            # 1. Debe tener nodos
            if 'nodes' not in workflow or not workflow['nodes']:
                issues.append("Sin nodos")
            
            # 2. Los nodos deben tener estructura válida
            if 'nodes' in workflow:
                for i, node in enumerate(workflow['nodes']):
                    if not isinstance(node, dict):
                        issues.append(f"Nodo {i} no es un objeto")
                        continue
                    
                    if 'type' not in node:
                        issues.append(f"Nodo {i} sin tipo")
                    
                    if 'id' not in node:
                        issues.append(f"Nodo {i} sin ID")
            
            # 3. Verificar conexiones si existen
            if 'connections' in workflow and workflow['connections']:
                # Las conexiones deben ser un objeto
                if not isinstance(workflow['connections'], dict):
                    issues.append("Conexiones mal formadas")
            
            return len(issues) == 0, issues
            
        except json.JSONDecodeError as e:
            return False, [f"JSON inválido: {e}"]
        except Exception as e:
            return False, [f"Error al leer: {e}"]

    def scan_source_folders(self):
        """Escanear carpetas fuente para identificar workflows válidos"""
        print("🔍 ESCANEANDO CARPETAS FUENTE")
        print("="*50)
        
        valid_workflows = {}
        
        for source_folder in self.source_folders:
            if not source_folder.exists():
                print(f"⚠️ Carpeta no encontrada: {source_folder}")
                continue
                
            print(f"📁 Escaneando: {source_folder}")
            
            # Escanear recursivamente
            for root, dirs, files in os.walk(source_folder):
                for file in files:
                    if file.endswith('.json') and not file.startswith('.'):
                        file_path = Path(root) / file
                        
                        self.stats['checked'] += 1
                        is_valid, issues = self.verify_workflow(file_path)
                        
                        if is_valid:
                            self.stats['valid'] += 1
                            # Usar nombre de archivo como clave única
                            workflow_key = file
                            if workflow_key not in valid_workflows:
                                valid_workflows[workflow_key] = file_path
                            print(f"  ✅ {file}")
                        else:
                            self.stats['invalid'] += 1
                            self.stats['errors'].append({
                                'file': str(file_path),
                                'issues': issues
                            })
                            print(f"  ❌ {file}: {', '.join(issues[:2])}")
        
        return valid_workflows

    def update_target_folders(self, valid_workflows):
        """Actualizar carpetas objetivo con workflows válidos"""
        print(f"\n🔄 ACTUALIZANDO CARPETAS OBJETIVO")
        print("="*50)
        
        for target_folder in self.target_folders:
            if not target_folder.exists():
                print(f"⚠️ Carpeta objetivo no encontrada: {target_folder}")
                continue
                
            print(f"📂 Actualizando: {target_folder}")
            updated_count = 0
            
            # Recorrer carpetas objetivo
            for root, dirs, files in os.walk(target_folder):
                for file in files:
                    if file.endswith('.json') and not file.endswith('.metadata.json'):
                        target_file = Path(root) / file
                        
                        # Verificar si existe una versión válida
                        if file in valid_workflows:
                            source_file = valid_workflows[file]
                            
                            # Verificar si el objetivo está corrupto
                            is_valid, issues = self.verify_workflow(target_file)
                            
                            if not is_valid:
                                # Reemplazar con versión válida
                                try:
                                    shutil.copy2(source_file, target_file)
                                    updated_count += 1
                                    self.stats['corrected'] += 1
                                    print(f"  🔧 Corregido: {file}")
                                except Exception as e:
                                    print(f"  ❌ Error copiando {file}: {e}")
            
            print(f"  ✅ {updated_count} workflows corregidos")

    def generate_report(self):
        """Generar reporte de verificación"""
        print(f"\n📊 REPORTE FINAL")
        print("="*50)
        print(f"Workflows verificados: {self.stats['checked']}")
        print(f"Workflows válidos: {self.stats['valid']}")
        print(f"Workflows inválidos: {self.stats['invalid']}")
        print(f"Workflows corregidos: {self.stats['corrected']}")
        
        if self.stats['errors']:
            print(f"\n❌ ERRORES ENCONTRADOS ({len(self.stats['errors'])}):")
            for error in self.stats['errors'][:10]:  # Mostrar solo los primeros 10
                print(f"  {Path(error['file']).name}: {', '.join(error['issues'][:2])}")
            
            if len(self.stats['errors']) > 10:
                print(f"  ... y {len(self.stats['errors']) - 10} errores más")
        
        # Guardar reporte detallado
        report_path = Path("workflow_verification_report.json")
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'statistics': self.stats,
            'summary': {
                'total_checked': self.stats['checked'],
                'success_rate': round((self.stats['valid'] / self.stats['checked']) * 100, 2) if self.stats['checked'] > 0 else 0,
                'corrections_made': self.stats['corrected']
            }
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Reporte detallado guardado en: {report_path}")

    def run(self):
        """Ejecutar verificación completa"""
        print("🚀 INICIANDO VERIFICACIÓN DE WORKFLOWS")
        print("="*50)
        
        # 1. Escanear carpetas fuente
        valid_workflows = self.scan_source_folders()
        
        # 2. Actualizar carpetas objetivo
        self.update_target_folders(valid_workflows)
        
        # 3. Generar reporte
        self.generate_report()
        
        print(f"\n✅ VERIFICACIÓN COMPLETADA")
        return self.stats['corrected'] > 0

if __name__ == "__main__":
    verifier = WorkflowVerifier()
    verifier.run()
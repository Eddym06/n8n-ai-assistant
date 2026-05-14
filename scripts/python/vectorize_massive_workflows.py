#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
VECTORIZADOR MASIVO DE WORKFLOWS N8N
====================================
Vectoriza miles de workflows organizados por subcarpetas de servicios
Estructura: workflows/OpenAI/, workflows/Slack/, workflows/Gmail/, etc.
"""

import os
import json
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from datetime import datetime
import logging
import shutil
from pathlib import Path

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MassiveWorkflowVectorizationEngine:
    def __init__(self, source_path=None, output_path=None):
        # Rutas de configuración
        self.source_path = source_path or "C:/Users/eddym/Downloads/n8n-ai-assistant/workflows"
        self.output_path = output_path or "C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow VEcto Masivo"
        
        # Crear directorio de salida
        os.makedirs(self.output_path, exist_ok=True)
        
        # Modelo de vectorización
        self.encoder = None
        
        # Estadísticas globales
        self.stats = {
            'start_time': datetime.now(),
            'end_time': None,
            'total_subcarpetas': 0,
            'total_workflows': 0,
            'workflows_procesados': 0,
            'workflows_validos': 0,
            'workflows_filtrados': 0,
            'total_nodos': 0,
            'subcarpetas_completadas': [],
            'errores': []
        }
        
        # Configuración de filtros
        self.min_nodes = 3  # Mínimo 3 nodos para ser considerado válido
        self.max_workflows_per_category = 50  # Límite por subcarpeta para evitar sobrecarga

    def load_encoder(self):
        """Cargar Universal Sentence Encoder"""
        try:
            # Verificar si hay GPU disponible
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                print("⚡ Usando GPU para vectorización")
                # Configurar memoria GPU
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
            else:
                print("⚡ Usando CPU para vectorización")
            
            print("📦 Cargando Universal Sentence Encoder...")
            self.encoder = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
            print("✅ Universal Sentence Encoder cargado exitosamente")
            
        except Exception as e:
            logger.error(f"❌ Error cargando encoder: {e}")
            raise

    def extract_workflow_metadata(self, workflow_data, file_path):
        """Extraer metadatos relevantes del workflow"""
        try:
            # Información básica
            metadata = {
                'name': workflow_data.get('name', os.path.basename(file_path)),
                'file_path': file_path,
                'id': workflow_data.get('id', ''),
                'createdAt': workflow_data.get('createdAt', ''),
                'updatedAt': workflow_data.get('updatedAt', ''),
                'active': workflow_data.get('active', False)
            }
            
            # Análisis de nodos
            nodes = workflow_data.get('nodes', [])
            metadata['node_count'] = len(nodes)
            metadata['node_types'] = list(set(node.get('type', '') for node in nodes))
            
            # Análisis de conexiones
            connections = workflow_data.get('connections', {})
            metadata['connection_count'] = sum(len(conns) for conns in connections.values())
            
            # Texto descriptivo para vectorización
            description_parts = []
            
            # Agregar nombre del workflow
            if metadata['name']:
                description_parts.append(f"Workflow: {metadata['name']}")
            
            # Agregar tipos de nodos
            if metadata['node_types']:
                description_parts.append(f"Nodos: {', '.join(metadata['node_types'])}")
            
            # Agregar notas de nodos si existen
            for node in nodes:
                if node.get('notes'):
                    description_parts.append(f"Nota: {node['notes']}")
            
            metadata['description'] = '. '.join(description_parts)
            
            # Calcular score de complejidad
            score = self.calculate_complexity_score(nodes, connections)
            metadata['complexity_score'] = score
            
            return metadata
            
        except Exception as e:
            logger.error(f"❌ Error extrayendo metadata de {file_path}: {e}")
            return None

    def calculate_complexity_score(self, nodes, connections):
        """Calcular score de complejidad del workflow"""
        try:
            node_count = len(nodes)
            connection_count = sum(len(conns) for conns in connections.values())
            
            # Score base por nodos
            node_score = node_count * 20
            
            # Bonus por conexiones
            connection_score = connection_count * 15
            
            # Bonus por tipos de nodos únicos
            unique_types = len(set(node.get('type', '') for node in nodes))
            type_score = unique_types * 10
            
            return node_score + connection_score + type_score
            
        except Exception as e:
            logger.error(f"❌ Error calculando complexity score: {e}")
            return 0

    def is_valid_workflow(self, workflow_data, file_path):
        """Validar si el workflow cumple los criterios mínimos"""
        try:
            # Verificar estructura básica
            if not isinstance(workflow_data, dict):
                return False, "No es un diccionario válido"
            
            nodes = workflow_data.get('nodes', [])
            if not isinstance(nodes, list):
                return False, "Nodos no es una lista"
            
            # Filtrar por número mínimo de nodos
            if len(nodes) < self.min_nodes:
                return False, f"Solo {len(nodes)} nodos (mínimo {self.min_nodes})"
            
            return True, "Válido"
            
        except Exception as e:
            return False, f"Error de validación: {e}"

    def generate_embeddings(self, texts):
        """Generar embeddings usando Universal Sentence Encoder"""
        try:
            if not texts:
                return np.array([])
            
            # Convertir a lista si es necesario
            if isinstance(texts, str):
                texts = [texts]
            
            # Generar embeddings
            embeddings = self.encoder(texts)
            return embeddings.numpy()
            
        except Exception as e:
            logger.error(f"❌ Error generando embeddings: {e}")
            return np.array([])

    def process_subcarpeta(self, subcarpeta_path, subcarpeta_name):
        """Procesar una subcarpeta específica (ej: OpenAI, Slack, etc.)"""
        print(f"\n📁 Procesando subcarpeta: {subcarpeta_name}")
        
        try:
            # Buscar archivos JSON en la subcarpeta
            json_files = [f for f in os.listdir(subcarpeta_path) 
                         if f.endswith('.json') and f != 'metadata.json']
            
            print(f"   📄 Encontrados {len(json_files)} archivos JSON")
            
            if not json_files:
                print(f"   ⚠️ No se encontraron workflows en {subcarpeta_name}")
                return []
            
            # Limitar archivos para evitar sobrecarga
            if len(json_files) > self.max_workflows_per_category:
                json_files = json_files[:self.max_workflows_per_category]
                print(f"   📊 Limitado a {self.max_workflows_per_category} workflows")
            
            valid_workflows = []
            
            for json_file in json_files:
                file_path = os.path.join(subcarpeta_path, json_file)
                self.stats['total_workflows'] += 1
                
                try:
                    print(f"   🔍 Analizando: {json_file}")
                    
                    # Leer archivo JSON
                    with open(file_path, 'r', encoding='utf-8') as f:
                        workflow_data = json.load(f)
                    
                    # Validar workflow
                    is_valid, reason = self.is_valid_workflow(workflow_data, file_path)
                    
                    if not is_valid:
                        print(f"   ❌ Filtrado: {json_file} ({reason})")
                        self.stats['workflows_filtrados'] += 1
                        continue
                    
                    # Extraer metadata
                    metadata = self.extract_workflow_metadata(workflow_data, file_path)
                    if not metadata:
                        continue
                    
                    # Generar embedding
                    if metadata['description']:
                        embeddings = self.generate_embeddings([metadata['description']])
                        if embeddings.size > 0:
                            metadata['embedding'] = embeddings[0].tolist()
                        else:
                            metadata['embedding'] = []
                    else:
                        metadata['embedding'] = []
                    
                    # Agregar información de subcarpeta
                    metadata['subcarpeta'] = subcarpeta_name
                    metadata['service'] = subcarpeta_name.lower()
                    
                    valid_workflows.append(metadata)
                    
                    print(f"   ✅ Válido: {metadata['node_count']} nodos, score: {metadata['complexity_score']}")
                    self.stats['workflows_validos'] += 1
                    self.stats['total_nodos'] += metadata['node_count']
                    
                except Exception as e:
                    logger.error(f"   ❌ Error procesando {json_file}: {e}")
                    self.stats['errores'].append(f"{subcarpeta_name}/{json_file}: {str(e)}")
                    continue
                
                self.stats['workflows_procesados'] += 1
            
            print(f"   📊 Resultado: {len(valid_workflows)}/{len(json_files)} workflows válidos")
            return valid_workflows
            
        except Exception as e:
            logger.error(f"❌ Error procesando subcarpeta {subcarpeta_name}: {e}")
            self.stats['errores'].append(f"Subcarpeta {subcarpeta_name}: {str(e)}")
            return []

    def save_subcarpeta_data(self, workflows_data, subcarpeta_name):
        """Guardar datos vectorizados de una subcarpeta"""
        try:
            if not workflows_data:
                return
            
            # Crear archivo de salida
            output_file = os.path.join(self.output_path, f"{subcarpeta_name}.json")
            
            # Preparar datos para guardar
            save_data = {
                'subcarpeta': subcarpeta_name,
                'total_workflows': len(workflows_data),
                'timestamp': datetime.now().isoformat(),
                'workflows': workflows_data
            }
            
            # Guardar archivo
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(save_data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Guardado: {subcarpeta_name}.json ({len(workflows_data)} workflows)")
            
        except Exception as e:
            logger.error(f"❌ Error guardando {subcarpeta_name}: {e}")

    def save_global_summary(self):
        """Guardar resumen global del proceso"""
        try:
            self.stats['end_time'] = datetime.now()
            
            # Crear estadísticas serializables
            serializable_stats = self.stats.copy()
            serializable_stats['start_time'] = self.stats['start_time'].isoformat()
            serializable_stats['end_time'] = self.stats['end_time'].isoformat()
            serializable_stats['duration_seconds'] = (self.stats['end_time'] - self.stats['start_time']).total_seconds()
            
            # Guardar resumen
            summary_file = os.path.join(self.output_path, 'massive_vectorization_summary.json')
            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(serializable_stats, f, indent=2, ensure_ascii=False)
            
            print(f"📊 Resumen guardado en: {summary_file}")
            
        except Exception as e:
            logger.error(f"❌ Error guardando resumen: {e}")

    def run_massive_vectorization(self):
        """Ejecutar vectorización masiva de todas las subcarpetas"""
        try:
            print("🚀 ================================================")
            print("🚀 VECTORIZACIÓN MASIVA DE WORKFLOWS N8N")
            print("🚀 Procesamiento con Universal Sentence Encoder")
            print("🚀 ================================================")
            
            # Cargar encoder
            self.load_encoder()
            
            print(f"📁 Directorio fuente: {self.source_path}")
            print(f"📁 Directorio de salida: {self.output_path}")
            
            # Verificar directorio fuente
            if not os.path.exists(self.source_path):
                raise FileNotFoundError(f"Directorio fuente no existe: {self.source_path}")
            
            # Obtener lista de subcarpetas
            subcarpetas = [d for d in os.listdir(self.source_path) 
                          if os.path.isdir(os.path.join(self.source_path, d))]
            
            self.stats['total_subcarpetas'] = len(subcarpetas)
            print(f"📁 Encontradas {len(subcarpetas)} subcarpetas")
            
            # Procesar cada subcarpeta
            for i, subcarpeta in enumerate(subcarpetas, 1):
                subcarpeta_path = os.path.join(self.source_path, subcarpeta)
                
                print(f"\n🔄 Procesando ({i}/{len(subcarpetas)}): {subcarpeta}")
                
                # Procesar workflows de la subcarpeta
                workflows_data = self.process_subcarpeta(subcarpeta_path, subcarpeta)
                
                # Guardar datos vectorizados
                if workflows_data:
                    self.save_subcarpeta_data(workflows_data, subcarpeta)
                    self.stats['subcarpetas_completadas'].append(subcarpeta)
            
            # Guardar resumen global
            self.save_global_summary()
            
            # Mostrar estadísticas finales
            self.print_final_stats()
            
        except Exception as e:
            logger.error(f"❌ Error en vectorización masiva: {e}")
            raise

    def print_final_stats(self):
        """Mostrar estadísticas finales"""
        duration = (self.stats['end_time'] - self.stats['start_time']).total_seconds()
        
        print("\n🎯 ================================================")
        print("🎯 VECTORIZACIÓN MASIVA COMPLETADA")
        print("🎯 ================================================")
        print(f"⏱️  Tiempo total: {duration:.2f} segundos")
        print(f"📁 Subcarpetas procesadas: {len(self.stats['subcarpetas_completadas'])}/{self.stats['total_subcarpetas']}")
        print(f"📄 Workflows encontrados: {self.stats['total_workflows']}")
        print(f"✅ Workflows válidos: {self.stats['workflows_validos']}")
        print(f"❌ Workflows filtrados: {self.stats['workflows_filtrados']}")
        print(f"🔢 Total nodos analizados: {self.stats['total_nodos']}")
        print(f"💾 Directorio de salida: {self.output_path}")
        
        if self.stats['errores']:
            print(f"⚠️  Errores encontrados: {len(self.stats['errores'])}")
        
        print("🎯 ================================================")

    def copy_to_target_directory(self, target_path=None):
        """Copiar archivos vectorizados al directorio objetivo"""
        target_path = target_path or "C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow VEcto"
        
        try:
            print(f"\n📋 Copiando archivos vectorizados a: {target_path}")
            
            # Crear directorio objetivo si no existe
            os.makedirs(target_path, exist_ok=True)
            
            # Copiar todos los archivos .json del directorio de salida
            copied_files = 0
            for file_name in os.listdir(self.output_path):
                if file_name.endswith('.json'):
                    source_file = os.path.join(self.output_path, file_name)
                    target_file = os.path.join(target_path, file_name)
                    
                    shutil.copy2(source_file, target_file)
                    copied_files += 1
                    print(f"   📄 Copiado: {file_name}")
            
            print(f"✅ Copiados {copied_files} archivos vectorizados a {target_path}")
            
        except Exception as e:
            logger.error(f"❌ Error copiando archivos: {e}")

if __name__ == "__main__":
    try:
        # Crear y ejecutar vectorizador masivo
        vectorizer = MassiveWorkflowVectorizationEngine()
        
        # Ejecutar vectorización
        vectorizer.run_massive_vectorization()
        
        # Copiar archivos al directorio objetivo
        vectorizer.copy_to_target_directory()
        
        print("\n✅ Vectorización masiva completada exitosamente!")
        
    except Exception as e:
        logger.error(f"❌ Error fatal: {e}")
        print(f"\n❌ Error: {e}")
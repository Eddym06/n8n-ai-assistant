# 🧠 WORKFLOW VECTORIZATION SCRIPT V3.0
# Sistema avanzado de vectorización de workflows con metadata enriquecida
# ✨ NUEVAS CARACTERÍSTICAS V3.0:
# - Análisis de patrones avanzados
# - Métricas de calidad robustas
# - Huella digital de workflows
# - Categorización expandida (14 categorías)
# - 20 tipos de propósitos
# - ✅ FILTRO: Solo workflows con 3+ nodos
# - Optimizado para Intel Core Ultra 9 185H + RTX 3050 6GB

import os
import json
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from pathlib import Path
import shutil
from datetime import datetime
import hashlib
from typing import Dict, List, Tuple, Any
import re
from collections import Counter

print("🚀 ================================================")
print("🚀 WORKFLOW VECTORIZATION ENGINE V3.0")  
print("🚀 Procesamiento con Universal Sentence Encoder")
print("🚀 ✨ Con análisis avanzado de patrones y calidad")
print("🚀 🔒 GARANTÍA: ARCHIVOS ORIGINALES PROTEGIDOS")
print("🚀 🔒 MODO: SOLO LECTURA EN FUENTES - SOLO METADATA EN DESTINO")
print("🚀 ================================================\n")

class WorkflowVectorizationEngine:
    def __init__(self):
        self.version = "3.0.0"
        # Múltiples carpetas fuente con reglas específicas
        self.source_paths = [
            {
                'path': Path("C:/Users/eddym/Downloads/n8n-ai-assistant/workflows"),
                'name': 'workflows',
                'apply_node_filter': True  # Aplicar filtro de 3+ nodos
            },
            {
                'path': Path("C:/Users/eddym/Downloads/n8n-ai-assistant/Workflow MCP n8n"),
                'name': 'workflow_mcp_n8n',
                'apply_node_filter': True  # Aplicar filtro de 3+ nodos
            },
            {
                'path': Path("C:/Users/eddym/Downloads/n8n Workflows"),
                'name': 'n8n_workflows_externos',
                'apply_node_filter': False  # 🎯 FILTRO DESACTIVADO: Acepta workflows con 1-2 nodos
            }
        ]
        self.output_path = Path("Workflow Vecto Corregidos")
        
        # 🔒 PROTECCIÓN CRÍTICA: Lista de directorios PROHIBIDOS para escritura
        self.protected_source_dirs = {
            str(source['path'].absolute()) for source in self.source_paths
        }
        
        # Log de protección
        print("🔒 PROTECCIONES ACTIVADAS:")
        for protected_dir in self.protected_source_dirs:
            print(f"   🚫 ESCRITURA PROHIBIDA: {protected_dir}")
        print(f"   ✅ ESCRITURA PERMITIDA SOLO EN: {self.output_path}")
        print()
        
        # Configurar GPU si está disponible
        self.setup_gpu()
        
        # Cargar modelo Universal Sentence Encoder
        print("📦 Cargando Universal Sentence Encoder...")
        try:
            self.encoder = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
            print("✅ Universal Sentence Encoder cargado exitosamente")
        except Exception as e:
            print(f"❌ Error cargando USE: {e}")
            print("🔄 Intentando con modelo local...")
            # Fallback a modelo más simple
            self.encoder = None
        
        # Estadísticas del procesamiento
        self.stats = {
            'workflows_processed': 0,
            'workflows_filtered_out': 0,
            'categories_found': 0,
            'total_nodes_analyzed': 0,
            'vectorization_time': 0,
            'start_time': datetime.now()  # Este se mantendrá como datetime para cálculos
        }
        
        # Crear directorio de salida
        self.output_path.mkdir(parents=True, exist_ok=True)
        print(f"📁 Directorio de salida: {self.output_path}")
    
    def verify_safe_write_path(self, target_path: Path) -> bool:
        """
        🔒 VERIFICACIÓN CRÍTICA: Garantizar que nunca escribamos en directorios de origen
        """
        target_absolute = str(target_path.absolute())
        for protected_dir in self.protected_source_dirs:
            if target_absolute.startswith(protected_dir):
                raise ValueError(f"🚨 PROHIBIDO: Intento de escribir en directorio protegido: {target_absolute}")
        return True
    
    def filter_valid_json_files(self, json_files: list) -> list:
        """
        🔍 FILTRAR archivos JSON válidos, excluyendo archivos de metadata
        """
        valid_files = []
        for file_path in json_files:
            # Excluir archivos .metadata.json y category_metadata.json
            if (file_path.name.endswith('.metadata.json') or 
                file_path.name == 'category_metadata.json' or
                file_path.name == 'vectorization_summary.json'):
                continue
            valid_files.append(file_path)
        return valid_files

    def setup_gpu(self):
        """Configurar GPU para TensorFlow"""
        try:
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                # Configurar memoria incremental para la GPU
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                print(f"🎮 GPU detectada: {len(gpus)} dispositivo(s)")
                print(f"   Usando memoria incremental para optimizar 6GB VRAM")
            else:
                print("⚡ Usando CPU para vectorización")
        except Exception as e:
            print(f"⚠️ Error configurando GPU: {e}")

    def analyze_workflow_file(self, file_path: Path) -> Dict[str, Any]:
        """
        ANALIZAR ARCHIVO DE WORKFLOW - MODO SOLO LECTURA
        ⚠️ CRÍTICO: ESTE MÉTODO NUNCA DEBE ESCRIBIR NADA AL ARCHIVO ORIGINAL
        ⚠️ CRÍTICO: SOLO LECTURA - NO MODIFICAR ARCHIVOS JSON ORIGINALES
        """
        try:
            # 🔒 GARANTÍA: Solo modo lectura - 'r' únicamente
            # 🔒 GARANTÍA: Nunca usar 'w', 'a', 'r+', 'w+', 'a+' en archivos originales
            with open(file_path, 'r', encoding='utf-8') as f:
                workflow_data = json.load(f)
            
            # 🔒 GARANTÍA: Crear copia independiente de los datos para análisis
            # 🔒 GARANTÍA: No modificar workflow_data original
            analysis = {
                'file_name': file_path.name,
                'file_path': str(file_path),
                'file_size': file_path.stat().st_size,
                'workflow_name': workflow_data.get('name', 'Sin nombre'),
                'workflow_id': workflow_data.get('id', ''),
                'created_at': workflow_data.get('createdAt', ''),
                'updated_at': workflow_data.get('updatedAt', ''),
                'active': workflow_data.get('active', False),
                'nodes': [],
                'connections': workflow_data.get('connections', {}),
                'total_nodes': 0,
                'node_types': [],
                'triggers': [],
                'actions': [],
                'complexity_score': 0
            }
            
            # 🔒 GARANTÍA: Analizar nodos SIN modificar datos originales
            if 'nodes' in workflow_data:
                # Crear copia independiente de los nodos para análisis
                analysis['nodes'] = list(workflow_data['nodes'])  # Copia superficial
                analysis['total_nodes'] = len(workflow_data['nodes'])
                
                for node in workflow_data['nodes']:
                    node_type = node.get('type', '')
                    analysis['node_types'].append(node_type)
                    
                    # Clasificar nodos
                    if 'trigger' in node_type.lower() or node_type.endswith('Trigger'):
                        analysis['triggers'].append({
                            'name': node.get('name', ''),
                            'type': node_type,
                            'position': node.get('position', [0, 0])
                        })
                    else:
                        analysis['actions'].append({
                            'name': node.get('name', ''),
                            'type': node_type,
                            'position': node.get('position', [0, 0])
                        })
            
            # Calcular score de complejidad
            analysis['complexity_score'] = self.calculate_complexity_score(analysis)
            
            # 🔒 GARANTÍA FINAL: Nunca escribir de vuelta al archivo original
            # 🔒 GARANTÍA FINAL: Solo retornar análisis, nunca modificar source
            return analysis
            
        except Exception as e:
            print(f"❌ Error analizando {file_path}: {e}")
            return None

    def calculate_complexity_score(self, analysis: Dict) -> int:
        """Calcular score de complejidad del workflow"""
        score = 0
        
        # Puntos por número de nodos
        score += analysis['total_nodes'] * 10
        
        # Puntos por tipos de nodos únicos
        unique_types = len(set(analysis['node_types']))
        score += unique_types * 15
        
        # Puntos por triggers múltiples
        score += len(analysis['triggers']) * 20
        
        # Puntos por conexiones
        total_connections = sum(len(conn) for conn in analysis['connections'].values())
        score += total_connections * 5
        
        # Bonus por nodos avanzados
        advanced_patterns = ['function', 'code', 'webhook', 'http', 'database', 'ai', 'ml']
        for node_type in analysis['node_types']:
            for pattern in advanced_patterns:
                if pattern in node_type.lower():
                    score += 25
                    break
        
        return score

    def extract_semantic_content(self, analysis: Dict) -> str:
        """Extraer contenido semántico para vectorización"""
        content_parts = []
        
        # Nombre del workflow
        if analysis['workflow_name'] and analysis['workflow_name'] != 'Sin nombre':
            content_parts.append(f"Workflow: {analysis['workflow_name']}")
        
        # Descripción basada en nodos
        node_descriptions = []
        for node in analysis['nodes']:
            node_name = node.get('name', '')
            node_type = node.get('type', '').replace('n8n-nodes-base.', '')
            
            if node_name and node_name != node_type:
                node_descriptions.append(f"{node_name} ({node_type})")
            else:
                node_descriptions.append(node_type)
        
        if node_descriptions:
            content_parts.append(f"Nodos: {', '.join(node_descriptions)}")
        
        # Flujo de trabajo inferido
        workflow_flow = self.infer_workflow_purpose(analysis)
        if workflow_flow:
            content_parts.append(f"Propósito: {workflow_flow}")
        
        # Categoría inferida
        category = self.infer_category(analysis)
        if category:
            content_parts.append(f"Categoría: {category}")
        
        # Triggers
        if analysis['triggers']:
            trigger_names = [t['name'] for t in analysis['triggers']]
            content_parts.append(f"Disparadores: {', '.join(trigger_names)}")
        
        return ". ".join(content_parts)

    def infer_workflow_purpose(self, analysis: Dict) -> str:
        """Inferir el propósito del workflow basado en los nodos"""
        node_types = [node.get('type', '').lower() for node in analysis['nodes']]
        node_names = [node.get('name', '').lower() for node in analysis['nodes']]
        
        # Patrones expandidos y más precisos
        patterns = {
            'email automation': ['gmail', 'email', 'send', 'mail', 'imap', 'smtp', 'outlook', 'mailgun', 'sendgrid'],
            'data synchronization': ['sync', 'database', 'sheet', 'csv', 'mysql', 'postgres', 'mongodb', 'bigquery', 'snowflake'],
            'social media management': ['twitter', 'facebook', 'instagram', 'linkedin', 'social', 'youtube', 'tiktok', 'reddit'],
            'webhook integration': ['webhook', 'http', 'api', 'request', 'rest', 'graphql', 'post', 'get', 'endpoint'],
            'file processing': ['file', 'csv', 'excel', 'pdf', 'upload', 'download', 'zip', 'compress', 'extract', 'convert'],
            'monitoring and alerts': ['monitor', 'alert', 'slack', 'notification', 'check', 'uptime', 'health', 'error', 'status'],
            'e-commerce automation': ['shopify', 'woocommerce', 'product', 'order', 'customer', 'inventory', 'payment', 'stripe'],
            'ai and machine learning': ['openai', 'ai', 'gpt', 'analysis', 'generate', 'chatgpt', 'claude', 'anthropic', 'huggingface'],
            'crm integration': ['salesforce', 'hubspot', 'crm', 'contact', 'lead', 'pipeline', 'deal', 'customer', 'prospect'],
            'scheduling and automation': ['schedule', 'cron', 'timer', 'interval', 'daily', 'weekly', 'monthly', 'recurring'],
            'content creation': ['blog', 'post', 'article', 'content', 'wordpress', 'medium', 'ghost', 'contentful'],
            'financial management': ['invoice', 'payment', 'accounting', 'quickbooks', 'xero', 'billing', 'expense', 'revenue'],
            'project management': ['trello', 'asana', 'jira', 'monday', 'clickup', 'task', 'project', 'milestone', 'sprint'],
            'backup and storage': ['backup', 'storage', 'dropbox', 'gdrive', 's3', 'onedrive', 'archive', 'restore'],
            'authentication and security': ['auth', 'login', 'oauth', 'jwt', 'security', 'permission', 'role', '2fa', 'sso'],
            'data analysis and reporting': ['analytics', 'report', 'dashboard', 'chart', 'metric', 'kpi', 'visualization'],
            'lead generation': ['lead', 'prospect', 'contact', 'form', 'signup', 'subscription', 'newsletter', 'landing'],
            'event management': ['event', 'calendar', 'meeting', 'appointment', 'booking', 'zoom', 'teams', 'webinar'],
            'inventory management': ['inventory', 'stock', 'warehouse', 'product', 'sku', 'quantity', 'supplier'],
            'customer support': ['support', 'ticket', 'helpdesk', 'zendesk', 'freshdesk', 'intercom', 'chat', 'feedback']
        }
        
        all_text = ' '.join(node_types + node_names)
        
        matches = {}
        for purpose, keywords in patterns.items():
            score = sum(1 for keyword in keywords if keyword in all_text)
            if score > 0:
                matches[purpose] = score
        
        if matches:
            return max(matches, key=matches.get)
        
        return "general automation"

    def infer_category(self, analysis: Dict) -> str:
        """Inferir categoría del workflow"""
        node_types = [node.get('type', '').lower() for node in analysis['nodes']]
        
        # Mapeo expandido y robusto de nodos a categorías
        category_mapping = {
            'communication': ['gmail', 'slack', 'telegram', 'whatsapp', 'email', 'sms', 'teams', 'discord', 'mattermost', 'signal', 'matrix'],
            'data-processing': ['mysql', 'postgres', 'mongodb', 'csv', 'excel', 'json', 'xml', 'sqlite', 'redis', 'influxdb', 'elasticsearch', 'bigquery'],
            'social-media': ['twitter', 'facebook', 'instagram', 'youtube', 'linkedin', 'tiktok', 'snapchat', 'reddit', 'pinterest', 'medium'],
            'e-commerce': ['shopify', 'woocommerce', 'stripe', 'paypal', 'product', 'square', 'amazon', 'ebay', 'magento', 'prestashop'],
            'productivity': ['googlesheets', 'notion', 'airtable', 'calendar', 'drive', 'dropbox', 'onedrive', 'trello', 'asana', 'jira', 'confluence'],
            'ai-ml': ['openai', 'gpt', 'ai', 'analysis', 'sentiment', 'huggingface', 'anthropic', 'cohere', 'palm', 'claude', 'chatgpt'],
            'integration': ['webhook', 'http', 'api', 'rest', 'graphql', 'soap', 'rpc', 'mqtt', 'kafka', 'rabbitmq', 'azure'],
            'monitoring': ['pingdom', 'uptime', 'monitor', 'alert', 'health', 'datadog', 'newrelic', 'sentry', 'prometheus', 'grafana'],
            'finance': ['stripe', 'paypal', 'quickbooks', 'xero', 'sage', 'freshbooks', 'invoice', 'payment', 'billing', 'accounting'],
            'marketing': ['mailchimp', 'hubspot', 'salesforce', 'marketo', 'pardot', 'campaign', 'lead', 'crm', 'autoresponder'],
            'cloud-services': ['aws', 'azure', 'gcp', 'digitalocean', 'heroku', 'vercel', 'netlify', 's3', 'lambda', 'cloudflare'],
            'development': ['github', 'gitlab', 'bitbucket', 'jenkins', 'docker', 'kubernetes', 'terraform', 'ansible', 'chef'],
            'content-management': ['wordpress', 'drupal', 'contentful', 'strapi', 'ghost', 'webflow', 'squarespace', 'wix'],
            'security': ['auth0', 'okta', 'ldap', 'saml', 'oauth', 'jwt', 'encryption', 'ssl', 'certificate', '2fa']
        }
        
        category_scores = {}
        for category, keywords in category_mapping.items():
            score = sum(1 for node_type in node_types 
                       for keyword in keywords 
                       if keyword in node_type)
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            return max(category_scores, key=category_scores.get)
        
        return "general"

    def generate_vector(self, text: str) -> np.ndarray:
        """Generar vector usando Universal Sentence Encoder"""
        try:
            if self.encoder is None:
                # Fallback: vector hash-based
                return self.generate_fallback_vector(text)
            
            # Usar Universal Sentence Encoder
            embeddings = self.encoder([text])
            return embeddings.numpy()[0]
            
        except Exception as e:
            print(f"⚠️ Error generando vector: {e}")
            return self.generate_fallback_vector(text)

    def generate_fallback_vector(self, text: str, dimension: int = 512) -> np.ndarray:
        """Generar vector de fallback usando hash"""
        # Crear hash del texto
        text_hash = hashlib.md5(text.encode()).hexdigest()
        
        # Convertir a vector numérico
        vector = []
        for i in range(dimension):
            char_index = i % len(text_hash)
            value = ord(text_hash[char_index]) / 255.0 * 2 - 1  # Normalizar a [-1, 1]
            vector.append(value)
        
        return np.array(vector, dtype=np.float32)

    def create_enriched_metadata(self, analysis: Dict, semantic_vector: np.ndarray) -> Dict:
        """Crear metadata enriquecida y rica para el workflow - SOLO METADATA, NO JSON ORIGINAL"""
        # Análisis avanzado de patrones
        patterns = self.analyze_workflow_patterns(analysis)
        
        # Métricas de calidad avanzadas
        quality_metrics = self.calculate_quality_metrics(analysis, patterns)
        
        # Huella digital del workflow
        fingerprint = self.generate_workflow_fingerprint(analysis)
        
        # Crear keywords inteligentes
        keywords = self.generate_smart_keywords(analysis)
        
        # Crear descripción detallada
        detailed_description = self.generate_detailed_description(analysis)
        
        # Extraer información rica para búsqueda
        search_info = self.extract_rich_search_info(analysis)
        
        metadata = {
            'workflow_info': {
                'id': analysis['workflow_id'],
                'name': analysis['workflow_name'],
                'display_name': self.generate_display_name(analysis),
                'file_name': analysis['file_name'],
                'file_path': analysis['file_path'],
                'created_at': analysis['created_at'],
                'updated_at': analysis['updated_at'],
                'active': analysis['active'],
                'fingerprint': fingerprint
            },
            'structure': {
                'total_nodes': analysis['total_nodes'],
                'node_types': list(set(analysis['node_types'])),
                'node_types_detailed': [{'type': nt, 'count': analysis['node_types'].count(nt)} for nt in set(analysis['node_types'])],
                'triggers': analysis['triggers'],
                'actions': analysis['actions'],
                'connections_count': sum(len(conn) for conn in analysis['connections'].values()),
                'workflow_flow': self.analyze_workflow_flow(analysis)
            },
            'semantic_info': {
                'category': self.infer_category(analysis),
                'purpose': self.infer_workflow_purpose(analysis),
                'use_cases': self.extract_use_cases(analysis),
                'complexity_score': analysis['complexity_score'],
                'complexity_level': self.get_complexity_level(analysis['complexity_score']),
                'keywords': keywords,
                'description': detailed_description,
                'semantic_content': self.extract_semantic_content(analysis),
                'business_context': self.extract_business_context(analysis)
            },
            'search_optimization': {
                'primary_tags': search_info['primary_tags'],
                'secondary_tags': search_info['secondary_tags'],
                'search_terms': search_info['search_terms'],
                'alternative_names': search_info['alternative_names'],
                'related_concepts': search_info['related_concepts']
            },
            'patterns': patterns,
            'quality_metrics': quality_metrics,
            'vector_info': {
                'vector_dimension': len(semantic_vector),
                'vector_norm': float(np.linalg.norm(semantic_vector)),
                'embedding_model': 'universal-sentence-encoder-v4',
                'generated_at': datetime.now().isoformat()
            },
            'semantic_vector': semantic_vector.tolist(),
            'agent_hints': {
                'when_to_recommend': self.generate_recommendation_criteria(analysis),
                'similar_to': self.find_similar_patterns(analysis),
                'best_for': self.extract_best_use_scenarios(analysis)
            }
        }
        
        return metadata

    def generate_display_name(self, analysis: Dict) -> str:
        """Generar nombre de display amigable"""
        name = analysis['workflow_name']
        if name and name != 'Sin nombre':
            return name
        
        # Generar nombre basado en el archivo
        file_name = analysis['file_name'].replace('.json', '')
        # Limpiar nombre del archivo
        display_name = re.sub(r'[0-9]+_', '', file_name)  # Remover prefijos numéricos
        display_name = display_name.replace('_', ' ').title()
        return display_name

    def extract_rich_search_info(self, analysis: Dict) -> Dict:
        """Extraer información rica para búsqueda del agente"""
        primary_tags = []
        secondary_tags = []
        search_terms = []
        alternative_names = []
        related_concepts = []
        
        # Tags primarios basados en triggers y acciones principales
        if analysis['triggers']:
            for trigger in analysis['triggers']:
                primary_tags.append(trigger['type'])
                primary_tags.append(trigger['name'])
        
        if analysis['actions']:
            for action in analysis['actions'][:3]:  # Top 3 acciones
                primary_tags.append(action['type'])
                primary_tags.append(action['name'])
        
        # Tags secundarios basados en tipos de nodos
        for node_type in set(analysis['node_types']):
            secondary_tags.append(node_type.lower())
        
        # Términos de búsqueda derivados del nombre del archivo
        file_name = analysis['file_name'].replace('.json', '')
        search_terms.extend(file_name.lower().split('_'))
        search_terms.extend(file_name.lower().split('-'))
        
        # Nombres alternativos
        if analysis['workflow_name'] and analysis['workflow_name'] != 'Sin nombre':
            alternative_names.append(analysis['workflow_name'])
        
        # Conceptos relacionados basados en patrones
        category = self.infer_category(analysis)
        purpose = self.infer_workflow_purpose(analysis)
        related_concepts.extend([category, purpose])
        
        return {
            'primary_tags': list(set(primary_tags)),
            'secondary_tags': list(set(secondary_tags)),
            'search_terms': list(set([term for term in search_terms if len(term) > 2])),
            'alternative_names': alternative_names,
            'related_concepts': list(set(related_concepts))
        }

    def analyze_workflow_flow(self, analysis: Dict) -> Dict:
        """Analizar el flujo del workflow"""
        return {
            'has_conditions': any('if' in nt.lower() or 'switch' in nt.lower() for nt in analysis['node_types']),
            'has_loops': any('split' in nt.lower() or 'merge' in nt.lower() for nt in analysis['node_types']),
            'is_linear': len(analysis['connections']) <= analysis['total_nodes'],
            'trigger_count': len(analysis['triggers']),
            'action_count': len(analysis['actions'])
        }

    def extract_use_cases(self, analysis: Dict) -> List[str]:
        """Extraer casos de uso del workflow"""
        use_cases = []
        
        # Basado en triggers
        for trigger in analysis['triggers']:
            if 'webhook' in trigger['type'].lower():
                use_cases.append('API integration')
            elif 'schedule' in trigger['type'].lower():
                use_cases.append('Scheduled automation')
            elif 'manual' in trigger['type'].lower():
                use_cases.append('On-demand execution')
        
        # Basado en acciones
        action_types = [action['type'].lower() for action in analysis['actions']]
        if any('email' in at for at in action_types):
            use_cases.append('Email automation')
        if any('slack' in at for at in action_types):
            use_cases.append('Team communication')
        if any('database' in at or 'sql' in at for at in action_types):
            use_cases.append('Data processing')
        
        return list(set(use_cases))

    def get_complexity_level(self, score: int) -> str:
        """Obtener nivel de complejidad textual"""
        if score > 300:
            return 'Very Complex'
        elif score > 200:
            return 'Complex'
        elif score > 100:
            return 'Intermediate'
        elif score > 50:
            return 'Simple'
        else:
            return 'Basic'

    def extract_business_context(self, analysis: Dict) -> str:
        """Extraer contexto de negocio"""
        contexts = []
        
        node_types = [nt.lower() for nt in analysis['node_types']]
        
        if any('crm' in nt or 'hubspot' in nt or 'salesforce' in nt for nt in node_types):
            contexts.append('Sales & CRM')
        if any('email' in nt or 'gmail' in nt or 'outlook' in nt for nt in node_types):
            contexts.append('Email Marketing')
        if any('social' in nt or 'twitter' in nt or 'facebook' in nt for nt in node_types):
            contexts.append('Social Media')
        if any('ecommerce' in nt or 'shopify' in nt or 'woocommerce' in nt for nt in node_types):
            contexts.append('E-commerce')
        if any('data' in nt or 'database' in nt or 'sql' in nt for nt in node_types):
            contexts.append('Data Management')
        
        return ', '.join(contexts) if contexts else 'General Automation'

    def generate_recommendation_criteria(self, analysis: Dict) -> str:
        """Generar criterios para cuándo recomendar este workflow"""
        criteria = []
        
        purpose = self.infer_workflow_purpose(analysis)
        criteria.append(f"When user needs {purpose}")
        
        if analysis['triggers']:
            trigger_names = [t['name'] for t in analysis['triggers']]
            criteria.append(f"When working with: {', '.join(trigger_names)}")
        
        complexity = self.get_complexity_level(analysis['complexity_score'])
        criteria.append(f"Suitable for {complexity.lower()} implementations")
        
        return '; '.join(criteria)

    def find_similar_patterns(self, analysis: Dict) -> List[str]:
        """Encontrar patrones similares"""
        patterns = []
        
        # Basado en estructura
        if analysis['total_nodes'] <= 5:
            patterns.append('Simple workflows')
        elif analysis['total_nodes'] <= 10:
            patterns.append('Medium workflows')
        else:
            patterns.append('Complex workflows')
        
        # Basado en tipos de nodos
        if 'HTTP Request' in analysis['node_types']:
            patterns.append('API-based workflows')
        if any('Split' in nt for nt in analysis['node_types']):
            patterns.append('Data processing workflows')
        
        return patterns

    def extract_best_use_scenarios(self, analysis: Dict) -> List[str]:
        """Extraer mejores escenarios de uso"""
        scenarios = []
        
        category = self.infer_category(analysis)
        purpose = self.infer_workflow_purpose(analysis)
        
        scenarios.append(f"Best for {purpose} in {category} context")
        
        if analysis['total_nodes'] <= 5:
            scenarios.append("Ideal for quick automation tasks")
        elif analysis['total_nodes'] > 15:
            scenarios.append("Suitable for comprehensive business processes")
        
        return scenarios

    def generate_smart_keywords(self, analysis: Dict) -> List[str]:
        """Generar keywords inteligentes"""
        keywords = set()
        
        # Keywords de tipos de nodos
        for node_type in analysis['node_types']:
            clean_type = node_type.replace('n8n-nodes-base.', '').replace('-', ' ')
            keywords.add(clean_type)
        
        # Keywords de nombres de nodos
        for node in analysis['nodes']:
            name = node.get('name', '').lower()
            if name and len(name) > 2:
                keywords.add(name)
        
        # Keywords de categoría y propósito
        keywords.add(self.infer_category(analysis))
        keywords.add(self.infer_workflow_purpose(analysis))
        
        # Keywords de complejidad
        if analysis['complexity_score'] > 200:
            keywords.add('complex')
        elif analysis['complexity_score'] > 100:
            keywords.add('intermediate')
        else:
            keywords.add('simple')
        
        # Filtrar keywords muy cortas
        return list(filter(lambda k: len(k) > 2, keywords))

    def generate_detailed_description(self, analysis: Dict) -> str:
        """Generar descripción detallada del workflow"""
        description_parts = []
        
        # Descripción básica
        workflow_name = analysis['workflow_name']
        if workflow_name and workflow_name != 'Sin nombre':
            description_parts.append(f"'{workflow_name}' es un workflow")
        else:
            description_parts.append("Este workflow")
        
        # Propósito
        purpose = self.infer_workflow_purpose(analysis)
        description_parts.append(f"diseñado para {purpose}")
        
        # Estructura
        total_nodes = analysis['total_nodes']
        description_parts.append(f"con {total_nodes} nodos")
        
        # Triggers
        if analysis['triggers']:
            trigger_count = len(analysis['triggers'])
            if trigger_count == 1:
                description_parts.append(f"activado por {analysis['triggers'][0]['name']}")
            else:
                description_parts.append(f"con {trigger_count} disparadores")
        
        # Acciones principales
        if analysis['actions']:
            main_actions = [action['name'] for action in analysis['actions'][:3]]
            description_parts.append(f"que ejecuta: {', '.join(main_actions)}")
        
        # Categoría
        category = self.infer_category(analysis)
        description_parts.append(f"en la categoría de {category}")
        
        return ' '.join(description_parts) + '.'

    def generate_search_tags(self, analysis: Dict) -> List[str]:
        """Generar tags de búsqueda optimizados"""
        tags = set()
        
        # Tags de funcionalidad
        for node in analysis['nodes']:
            node_type = node.get('type', '').replace('n8n-nodes-base.', '')
            if node_type:
                tags.add(f"uses:{node_type}")
        
        # Tags de complejidad
        if analysis['total_nodes'] >= 10:
            tags.add("complexity:high")
        elif analysis['total_nodes'] >= 5:
            tags.add("complexity:medium")
        else:
            tags.add("complexity:low")
        
        # Tags de categoría
        category = self.infer_category(analysis)
        tags.add(f"category:{category}")
        
        # Tags de propósito
        purpose = self.infer_workflow_purpose(analysis)
        tags.add(f"purpose:{purpose.replace(' ', '-')}")
        
        # Tags de triggers
        for trigger in analysis['triggers']:
            trigger_type = trigger['type'].replace('n8n-nodes-base.', '')
            tags.add(f"trigger:{trigger_type}")
        
        return list(tags)

    def analyze_workflow_patterns(self, analysis: Dict) -> Dict[str, Any]:
        """Analizar patrones avanzados en workflows"""
        patterns = {
            'has_error_handling': False,
            'has_conditions': False,
            'has_loops': False,
            'has_http_requests': False,
            'has_database_operations': False,
            'has_file_operations': False,
            'has_ai_integration': False,
            'workflow_type': 'unknown',
            'data_flow_complexity': 'linear',
            'trigger_types': [],
            'output_types': []
        }
        
        node_types = [node.get('type', '').lower() for node in analysis['nodes']]
        
        # Detectar patrones específicos
        patterns['has_error_handling'] = any('error' in nt or 'try' in nt for nt in node_types)
        patterns['has_conditions'] = any('if' in nt or 'switch' in nt or 'condition' in nt for nt in node_types)
        patterns['has_loops'] = any('loop' in nt or 'batch' in nt or 'iterate' in nt for nt in node_types)
        patterns['has_http_requests'] = any('http' in nt or 'webhook' in nt or 'api' in nt for nt in node_types)
        patterns['has_database_operations'] = any('sql' in nt or 'database' in nt or 'mysql' in nt or 'postgres' in nt for nt in node_types)
        patterns['has_file_operations'] = any('file' in nt or 'csv' in nt or 'excel' in nt or 'pdf' in nt for nt in node_types)
        patterns['has_ai_integration'] = any('ai' in nt or 'gpt' in nt or 'openai' in nt for nt in node_types)
        
        # Determinar tipo de workflow
        if patterns['has_ai_integration']:
            patterns['workflow_type'] = 'ai_powered'
        elif patterns['has_database_operations']:
            patterns['workflow_type'] = 'data_processing'
        elif patterns['has_http_requests']:
            patterns['workflow_type'] = 'api_integration'
        elif len(analysis['triggers']) > 1:
            patterns['workflow_type'] = 'multi_trigger'
        else:
            patterns['workflow_type'] = 'simple_automation'
        
        # Analizar complejidad de flujo de datos
        total_connections = sum(len(conn) for conn in analysis['connections'].values())
        if total_connections > analysis['total_nodes'] * 1.5:
            patterns['data_flow_complexity'] = 'complex'
        elif total_connections > analysis['total_nodes']:
            patterns['data_flow_complexity'] = 'branched'
        
        # Tipos de triggers
        patterns['trigger_types'] = [t['type'] for t in analysis['triggers']]
        
        return patterns

    def calculate_quality_metrics(self, analysis: Dict, patterns: Dict) -> Dict[str, Any]:
        """Calcular métricas de calidad del workflow"""
        metrics = {
            'completeness_score': 0,
            'documentation_score': 0,
            'complexity_balance': 0,
            'best_practices_score': 0,
            'maintainability_score': 0,
            'overall_quality': 0
        }
        
        # Score de completitud (basado en presencia de elementos clave)
        completeness_factors = [
            analysis['workflow_name'] != 'Sin nombre',
            len(analysis['triggers']) > 0,
            analysis['total_nodes'] > 1,
            len(analysis['connections']) > 0
        ]
        metrics['completeness_score'] = sum(completeness_factors) / len(completeness_factors) * 100
        
        # Score de documentación (basado en nombres descriptivos)
        named_nodes = sum(1 for node in analysis['nodes'] if node.get('name', '') != node.get('type', ''))
        metrics['documentation_score'] = (named_nodes / max(1, analysis['total_nodes'])) * 100
        
        # Balance de complejidad
        ideal_complexity = analysis['total_nodes'] * 20  # Complejidad ideal
        actual_complexity = analysis['complexity_score']
        balance_ratio = min(actual_complexity, ideal_complexity) / max(actual_complexity, ideal_complexity)
        metrics['complexity_balance'] = balance_ratio * 100
        
        # Score de mejores prácticas
        best_practices_factors = [
            patterns['has_error_handling'],
            len(set(analysis['node_types'])) > 2,  # Diversidad de nodos
            analysis['total_nodes'] >= 3,  # Mínimo razonable de nodos
            len(analysis['triggers']) <= 3  # No demasiados triggers
        ]
        metrics['best_practices_score'] = sum(best_practices_factors) / len(best_practices_factors) * 100
        
        # Score de mantenibilidad
        maintainability_factors = [
            analysis['total_nodes'] <= 20,  # No excesivamente largo
            patterns['data_flow_complexity'] != 'complex',
            metrics['documentation_score'] > 50
        ]
        metrics['maintainability_score'] = sum(maintainability_factors) / len(maintainability_factors) * 100
        
        # Score general de calidad
        metrics['overall_quality'] = (
            metrics['completeness_score'] * 0.25 +
            metrics['documentation_score'] * 0.20 +
            metrics['complexity_balance'] * 0.20 +
            metrics['best_practices_score'] * 0.20 +
            metrics['maintainability_score'] * 0.15
        )
        
        return metrics

    def generate_workflow_fingerprint(self, analysis: Dict) -> str:
        """Generar huella digital única del workflow"""
        fingerprint_data = {
            'node_types': sorted(set(analysis['node_types'])),
            'total_nodes': analysis['total_nodes'],
            'connections_count': sum(len(conn) for conn in analysis['connections'].values()),
            'trigger_types': sorted([t['type'] for t in analysis['triggers']])
        }
        
        fingerprint_str = json.dumps(fingerprint_data, sort_keys=True)
        return hashlib.md5(fingerprint_str.encode()).hexdigest()[:12]

    def process_category_folder(self, category_path: Path, apply_filter: bool = True) -> Dict:
        """Procesar carpeta de categoría"""
        print(f"\n📁 Procesando categoría: {category_path.name}")
        
        category_data = {
            'category_name': category_path.name,
            'category_path': str(category_path),
            'workflows': [],
            'total_workflows': 0,
            'valid_workflows': 0,
            'filtered_workflows': 0,
            'category_vector': None,
            'category_keywords': set(),
            'category_description': ""
        }
        
        # Buscar archivos JSON
        json_files = list(category_path.glob("*.json"))
        # 🔍 FILTRAR archivos válidos (excluir metadata)
        json_files = self.filter_valid_json_files(json_files)
        category_data['total_workflows'] = len(json_files)
        
        print(f"   📄 Encontrados {len(json_files)} workflows")
        
        valid_workflows = []
        
        for json_file in json_files:
            print(f"   🔍 Analizando: {json_file.name}")
            
            analysis = self.analyze_workflow_file(json_file)
            if not analysis:
                continue
            
            self.stats['workflows_processed'] += 1
            self.stats['total_nodes_analyzed'] += analysis['total_nodes']
            
            # Aplicar filtro de nodos solo si está configurado
            if apply_filter and analysis['total_nodes'] < 3:
                print(f"   ❌ Filtrado: {json_file.name} (solo {analysis['total_nodes']} nodos)")
                self.stats['workflows_filtered_out'] += 1
                category_data['filtered_workflows'] += 1
                continue
            
            # Mostrar mensaje especial para workflows con pocos nodos aceptados sin filtro
            if not apply_filter and analysis['total_nodes'] < 3:
                print(f"   ✅ Válido: {analysis['total_nodes']} nodos, score: {analysis['complexity_score']} (🎯 FILTRO DESACTIVADO)")
            else:
                print(f"   ✅ Válido: {analysis['total_nodes']} nodos, score: {analysis['complexity_score']}")
            
            # Generar contenido semántico
            semantic_content = self.extract_semantic_content(analysis)
            
            # Generar vector
            semantic_vector = self.generate_vector(semantic_content)
            
            # Crear metadata enriquecida - SOLO METADATA, NO JSON ORIGINAL
            metadata = self.create_enriched_metadata(analysis, semantic_vector)
            
            # Agregar información de categoría
            metadata['category_info'] = {
                'category_name': category_path.name,
                'category_path': str(category_path)
            }
            
            valid_workflows.append(metadata)
            category_data['valid_workflows'] += 1
            
            # Acumular keywords de categoría
            category_data['category_keywords'].update(metadata['semantic_info']['keywords'])
        
        category_data['workflows'] = valid_workflows
        
        # Generar descripción de categoría
        if valid_workflows:
            category_data['category_description'] = self.generate_category_description(category_data)
            
            # Generar vector de categoría (promedio de workflows)
            if valid_workflows:
                workflow_vectors = [np.array(wf['semantic_vector']) for wf in valid_workflows]
                category_data['category_vector'] = np.mean(workflow_vectors, axis=0).tolist()
        
        # Convertir set a list para JSON
        category_data['category_keywords'] = list(category_data['category_keywords'])
        
        print(f"   📊 Resultado: {category_data['valid_workflows']}/{category_data['total_workflows']} workflows válidos")
        
        return category_data

    def generate_category_description(self, category_data: Dict) -> str:
        """Generar descripción de la categoría"""
        category_name = category_data['category_name']
        workflow_count = category_data['valid_workflows']
        
        # Analizar patrones comunes
        purposes = [wf['semantic_info']['purpose'] for wf in category_data['workflows']]
        most_common_purpose = Counter(purposes).most_common(1)[0][0] if purposes else "automation"
        
        return f"Categoría '{category_name}' contiene {workflow_count} workflows enfocados principalmente en {most_common_purpose}"

    def save_category_data(self, category_data: Dict):
        """Guardar datos de categoría"""
        category_name = category_data['category_name']
        output_category_path = self.output_path / category_name
        output_category_path.mkdir(exist_ok=True)
        
        # 🔒 VERIFICAR seguridad antes de escribir
        self.verify_safe_write_path(output_category_path)
        
        # Guardar metadata de categoría
        category_metadata_path = output_category_path / "category_metadata.json"
        self.verify_safe_write_path(category_metadata_path)
        category_metadata = {
            'category_info': {
                'name': category_data['category_name'],
                'description': category_data['category_description'],
                'total_workflows': category_data['total_workflows'],
                'valid_workflows': category_data['valid_workflows'],
                'filtered_workflows': category_data['filtered_workflows']
            },
            'category_vector': category_data['category_vector'],
            'category_keywords': category_data['category_keywords'],
            'generated_at': datetime.now().isoformat()
        }
        
        with open(category_metadata_path, 'w', encoding='utf-8') as f:
            json.dump(category_metadata, f, indent=2, ensure_ascii=False)
        
        # Guardar cada workflow
        for workflow in category_data['workflows']:
            # 🔧 CORECCIÓN: Usar file_name sin extensión .json para evitar .json.metadata.json
            clean_filename = workflow['workflow_info']['file_name'].replace('.json', '')
            
            # 📁 COPIAR ARCHIVO JSON ORIGINAL (INTACTO)
            original_file_path = Path(workflow['workflow_info']['file_path'])
            if original_file_path.exists():
                # Archivo JSON original copiado tal como está
                json_copy_path = output_category_path / workflow['workflow_info']['file_name']
                self.verify_safe_write_path(json_copy_path)
                
                # COPY-PASTE: Copiar archivo original SIN modificar
                shutil.copy2(original_file_path, json_copy_path)
                print(f"   📋 Copiado: {workflow['workflow_info']['file_name']}")
            
            # 📄 GENERAR ARCHIVO METADATA SEPARADO
            workflow_filename = f"{clean_filename}.metadata.json"
            workflow_path = output_category_path / workflow_filename
            
            # 🔒 VERIFICAR seguridad antes de escribir
            self.verify_safe_write_path(workflow_path)
            
            with open(workflow_path, 'w', encoding='utf-8') as f:
                json.dump(workflow, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Guardado: {category_name} ({category_data['valid_workflows']} workflows)")

    def run(self):
        """Ejecutar el proceso completo de vectorización con múltiples carpetas fuente"""
        print(f"🚀 INICIANDO VECTORIZACIÓN MULTI-FUENTE")
        print(f"📁 Salida hacia: {self.output_path}\n")
        
        # Limpiar directorio de salida
        if self.output_path.exists():
            shutil.rmtree(self.output_path)
        self.output_path.mkdir(parents=True)
        
        all_categories_data = []
        
        # Procesar cada carpeta fuente
        for source_config in self.source_paths:
            source_path = source_config['path']
            source_name = source_config['name']
            apply_filter = source_config['apply_node_filter']
            
            print(f"\n🗂️ PROCESANDO FUENTE: {source_name}")
            print(f"📍 Ruta: {source_path}")
            print(f"🔧 Filtro de 3+ nodos: {'✅ ACTIVO' if apply_filter else '❌ DESACTIVADO'}")
            if source_name == 'woka':
                print("🎯 CONFIGURACIÓN ESPECIAL: Carpeta WOKA - Filtro de nodos DESACTIVADO")
            print("="*60)
            
            if not source_path.exists():
                print(f"⚠️ Carpeta no existe: {source_path}")
                continue
            
            # Determinar estructura de la fuente
            if self.is_flat_structure(source_path):
                # Estructura plana - todos los JSONs en la raíz
                category_data = self.process_flat_folder(source_path, source_name, apply_filter)
                if category_data['valid_workflows'] > 0:
                    self.save_category_data(category_data)
                    all_categories_data.append(category_data)
            else:
                # Estructura por categorías
                category_folders = [path for path in source_path.iterdir() if path.is_dir()]
                
                if not category_folders:
                    print("❌ No se encontraron carpetas de categorías")
                    continue
                
                print(f"📁 Encontradas {len(category_folders)} categorías")
                
                for category_folder in category_folders:
                    try:
                        category_data = self.process_category_folder(category_folder, apply_filter)
                        if category_data['valid_workflows'] > 0:
                            self.save_category_data(category_data)
                            all_categories_data.append(category_data)
                        else:
                            print(f"⚠️ Categoría {category_folder.name} no tiene workflows válidos")
                            
                    except Exception as e:
                        print(f"❌ Error procesando {category_folder.name}: {e}")
        
        # Guardar resumen global
        self.save_global_summary(all_categories_data)
        
        # Mostrar estadísticas finales
        self.show_final_stats()

    def is_flat_structure(self, path: Path) -> bool:
        """Determinar si la estructura es plana (JSONs en la raíz)"""
        json_files = list(path.glob("*.json"))
        # 🔍 FILTRAR archivos válidos (excluir metadata)
        json_files = self.filter_valid_json_files(json_files)
        subdirs = [p for p in path.iterdir() if p.is_dir()]
        
        # Si hay más JSONs que subdirectorios, es estructura plana
        return len(json_files) > len(subdirs)

    def process_flat_folder(self, folder_path: Path, source_name: str, apply_filter: bool) -> Dict:
        """Procesar carpeta con estructura plana"""
        print(f"\n📁 Procesando estructura plana: {folder_path.name}")
        
        category_data = {
            'category_name': f"{source_name}_{folder_path.name}",
            'category_path': str(folder_path),
            'source_name': source_name,
            'workflows': [],
            'total_workflows': 0,
            'valid_workflows': 0,
            'filtered_workflows': 0,
            'category_vector': None,
            'category_keywords': set(),
            'category_description': ""
        }
        
        # Buscar archivos JSON
        json_files = list(folder_path.glob("*.json"))
        # 🔍 FILTRAR archivos válidos (excluir metadata)
        json_files = self.filter_valid_json_files(json_files)
        category_data['total_workflows'] = len(json_files)
        
        print(f"   📄 Encontrados {len(json_files)} workflows")
        
        valid_workflows = []
        
        for json_file in json_files:
            print(f"   🔍 Analizando: {json_file.name}")
            
            analysis = self.analyze_workflow_file(json_file)
            if not analysis:
                continue
            
            self.stats['workflows_processed'] += 1
            self.stats['total_nodes_analyzed'] += analysis['total_nodes']
            
            # Aplicar filtro de nodos solo si está configurado
            if apply_filter and analysis['total_nodes'] < 3:
                print(f"   ❌ Filtrado: {json_file.name} (solo {analysis['total_nodes']} nodos)")
                self.stats['workflows_filtered_out'] += 1
                category_data['filtered_workflows'] += 1
                continue
            
            print(f"   ✅ Válido: {analysis['total_nodes']} nodos, score: {analysis['complexity_score']}")
            
            # Generar contenido semántico
            semantic_content = self.extract_semantic_content(analysis)
            
            # Generar vector
            semantic_vector = self.generate_vector(semantic_content)
            
            # Crear metadata enriquecida - SOLO METADATA
            metadata = self.create_enriched_metadata(analysis, semantic_vector)
            
            # Agregar información de fuente
            metadata['source_info'] = {
                'source_name': source_name,
                'source_path': str(folder_path),
                'node_filter_applied': apply_filter
            }
            
            valid_workflows.append(metadata)
            category_data['valid_workflows'] += 1
            
            # Acumular keywords de categoría
            category_data['category_keywords'].update(metadata['semantic_info']['keywords'])
        
        category_data['workflows'] = valid_workflows
        
        # Generar descripción de categoría
        if valid_workflows:
            category_data['category_description'] = self.generate_category_description(category_data)
            
            # Generar vector de categoría (promedio de workflows)
            if valid_workflows:
                workflow_vectors = [np.array(wf['semantic_vector']) for wf in valid_workflows]
                category_data['category_vector'] = np.mean(workflow_vectors, axis=0).tolist()
        
        # Convertir set a list para JSON
        category_data['category_keywords'] = list(category_data['category_keywords'])
        
        print(f"   📊 Resultado: {category_data['valid_workflows']}/{category_data['total_workflows']} workflows válidos")
        
        return category_data

    def save_global_summary(self, categories_data: List[Dict]):
        """Guardar resumen global"""
        summary_path = self.output_path / "vectorization_summary.json"
        
        # 🔒 VERIFICAR seguridad antes de escribir
        self.verify_safe_write_path(summary_path)
        
        total_valid_workflows = sum(cat['valid_workflows'] for cat in categories_data)
        
        # Crear estadísticas serializables (sin objetos datetime)
        serializable_stats = {
            'workflows_processed': self.stats['workflows_processed'],
            'workflows_filtered_out': self.stats['workflows_filtered_out'],
            'categories_found': self.stats['categories_found'],
            'total_nodes_analyzed': self.stats['total_nodes_analyzed'],
            'vectorization_time': self.stats['vectorization_time'],
            'start_time': self.stats['start_time'].isoformat()  # Convertir datetime a string
        }
        
        summary = {
            'vectorization_info': {
                'version': self.version,
                'generated_at': datetime.now().isoformat(),
                'processing_time_seconds': (datetime.now() - self.stats['start_time']).total_seconds(),
                'embedding_model': 'universal-sentence-encoder-v4'
            },
            'statistics': serializable_stats,
            'categories': [
                {
                    'name': cat['category_name'],
                    'total_workflows': cat['total_workflows'],
                    'valid_workflows': cat['valid_workflows'],
                    'filtered_workflows': cat['filtered_workflows'],
                    'keywords_count': len(cat['category_keywords'])
                }
                for cat in categories_data
            ],
            'totals': {
                'categories_processed': len(categories_data),
                'total_workflows_found': sum(cat['total_workflows'] for cat in categories_data),
                'total_valid_workflows': total_valid_workflows,
                'total_filtered_workflows': sum(cat['filtered_workflows'] for cat in categories_data)
            }
        }
        
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\n📊 Resumen guardado en: {summary_path}")

    def show_final_stats(self):
        """Mostrar estadísticas finales"""
        processing_time = (datetime.now() - self.stats['start_time']).total_seconds()
        
        print("\n🎯 ================================================")
        print("🎯 VECTORIZACIÓN COMPLETADA")
        print("🎯 ================================================")
        print(f"⏱️  Tiempo total: {processing_time:.2f} segundos")
        print(f"📁 Categorías procesadas: {self.stats['categories_found']}")
        print(f"📄 Workflows procesados: {self.stats['workflows_processed']}")
        print(f"✅ Workflows válidos: {self.stats['workflows_processed'] - self.stats['workflows_filtered_out']}")
        print(f"❌ Workflows filtrados: {self.stats['workflows_filtered_out']}")
        print(f"🔢 Total nodos analizados: {self.stats['total_nodes_analyzed']}")
        print(f"💾 Directorio de salida: {self.output_path}")
        print("🎯 ================================================\n")

if __name__ == "__main__":
    try:
        engine = WorkflowVectorizationEngine()
        engine.run()
        print("✅ Vectorización completada exitosamente!")
        
    except Exception as e:
        print(f"💥 Error durante la vectorización: {e}")
        import traceback
        traceback.print_exc()
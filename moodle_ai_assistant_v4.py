#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOODLE AI ASSISTANT - Chatbot Avanzado con Gemini
Sistema conversacional inteligente para gestión académica automatizada
Desarrollado por: Asistente AI
Versión: 4.0
Fecha: 2025
"""

import os
import sys
import json
import asyncio
import datetime
import requests
import schedule
import time
import threading
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
import hashlib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
from dotenv import load_dotenv
import logging
import re

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

@dataclass
class Memory:
    """Estructura para memoria semántica"""
    id: str
    timestamp: str
    user_input: str
    ai_response: str
    action_taken: str
    context: Dict[str, Any]
    embeddings: List[float] = None

@dataclass
class Automation:
    """Estructura para automatizaciones"""
    id: str
    name: str
    description: str
    trigger_conditions: Dict[str, Any]
    actions: List[Dict[str, Any]]
    is_active: bool
    created_at: str
    last_run: Optional[str] = None

class SemanticMemoryManager:
    """Gestor de memoria semántica con vectorización"""
    
    def __init__(self, memory_file='memory_database.json'):
        self.memory_file = memory_file
        self.memories: List[Memory] = []
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.embeddings_matrix = None
        self.load_memory()
    
    def load_memory(self):
        """Cargar memoria desde archivo"""
        try:
            if os.path.exists(self.memory_file):
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.memories = [Memory(**item) for item in data.get('memories', [])]
                self._update_embeddings()
        except Exception as e:
            logger.error(f"Error cargando memoria: {e}")
            self.memories = []
    
    def save_memory(self):
        """Guardar memoria en archivo"""
        try:
            data = {
                'memories': [asdict(memory) for memory in self.memories],
                'last_updated': datetime.datetime.now().isoformat()
            }
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error guardando memoria: {e}")
    
    def add_memory(self, user_input: str, ai_response: str, action_taken: str, context: Dict[str, Any]):
        """Añadir nueva memoria"""
        memory_id = hashlib.md5(f"{user_input}{datetime.datetime.now()}".encode()).hexdigest()
        memory = Memory(
            id=memory_id,
            timestamp=datetime.datetime.now().isoformat(),
            user_input=user_input,
            ai_response=ai_response,
            action_taken=action_taken,
            context=context
        )
        self.memories.append(memory)
        self._update_embeddings()
        self.save_memory()
    
    def _update_embeddings(self):
        """Actualizar embeddings de todas las memorias"""
        if not self.memories:
            return
        
        texts = [f"{memory.user_input} {memory.ai_response}" for memory in self.memories]
        try:
            self.embeddings_matrix = self.vectorizer.fit_transform(texts)
        except Exception as e:
            logger.error(f"Error actualizando embeddings: {e}")
    
    def search_similar_memories(self, query: str, top_k: int = 5) -> List[Memory]:
        """Buscar memorias similares usando vectorización"""
        if not self.memories or self.embeddings_matrix is None:
            return []
        
        try:
            query_vector = self.vectorizer.transform([query])
            similarities = cosine_similarity(query_vector, self.embeddings_matrix).flatten()
            
            # Obtener índices de las memorias más similares
            top_indices = similarities.argsort()[-top_k:][::-1]
            
            return [self.memories[i] for i in top_indices if similarities[i] > 0.1]
        except Exception as e:
            logger.error(f"Error buscando memorias: {e}")
            return []

class AutomationManager:
    """Gestor de automatizaciones inteligentes"""
    
    def __init__(self, automations_file='automations.json'):
        self.automations_file = automations_file
        self.automations: List[Automation] = []
        self.load_automations()
    
    def load_automations(self):
        """Cargar automatizaciones desde archivo"""
        try:
            if os.path.exists(self.automations_file):
                with open(self.automations_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.automations = [Automation(**item) for item in data.get('automations', [])]
        except Exception as e:
            logger.error(f"Error cargando automatizaciones: {e}")
            self.automations = []
    
    def save_automations(self):
        """Guardar automatizaciones en archivo"""
        try:
            data = {
                'automations': [asdict(automation) for automation in self.automations],
                'last_updated': datetime.datetime.now().isoformat()
            }
            with open(self.automations_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error guardando automatizaciones: {e}")
    
    def create_automation(self, name: str, description: str, trigger_conditions: Dict, actions: List[Dict]) -> str:
        """Crear nueva automatización"""
        automation_id = hashlib.md5(f"{name}{datetime.datetime.now()}".encode()).hexdigest()
        automation = Automation(
            id=automation_id,
            name=name,
            description=description,
            trigger_conditions=trigger_conditions,
            actions=actions,
            is_active=True,
            created_at=datetime.datetime.now().isoformat()
        )
        self.automations.append(automation)
        self.save_automations()
        return automation_id
    
    def get_automation(self, automation_id: str) -> Optional[Automation]:
        """Obtener automatización por ID"""
        return next((a for a in self.automations if a.id == automation_id), None)
    
    def activate_automation(self, automation_id: str) -> bool:
        """Activar automatización"""
        automation = self.get_automation(automation_id)
        if automation:
            automation.is_active = True
            self.save_automations()
            return True
        return False

class GeminiClient:
    """Cliente mejorado para Gemini con capacidades conversacionales avanzadas"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        self.conversation_history = []
        
        # Mapeo de cursos para reconocimiento inteligente
        self.course_mapping = {
            # Inglés
            'ingles': '11495 - Inglés Nivel 7-9',
            'english': '11495 - Inglés Nivel 7-9',
            'nivel 7': '11495 - Inglés Nivel 7-9',
            
            # Física
            'fisica': '11069 - Física Mecánica',
            'fisica mecanica': '11069 - Física Mecánica',
            'lab fisica': '11220 - Laboratorio Física Mecánica',
            'laboratorio fisica': '11220 - Laboratorio Física Mecánica',
            
            # Metrología
            'metrologia': '11784 - Metrología',
            'metro': '11784 - Metrología',
            
            # CAD
            'cad': '11667 - Cad Avanzado',
            'cad avanzado': '11667 - Cad Avanzado',
            'diseño': '11667 - Cad Avanzado',
            
            # Circuitos
            'circuitos': '11312 - Circuitos Eléctricos I',
            'circuitos electricos': '11312 - Circuitos Eléctricos I',
            'lab circuitos': '11184 - Laboratorio Circuitos Eléctricos I',
            'laboratorio circuitos': '11184 - Laboratorio Circuitos Eléctricos I',
            
            # Matemáticas
            'calculo': '10941 - Cálculo Integral',
            'calculo integral': '10941 - Cálculo Integral',
            'integral': '10941 - Cálculo Integral',
            'probabilidad': '10946 - Probabilidad y Estadística',
            'estadistica': '10946 - Probabilidad y Estadística',
            'probabilidad estadistica': '10946 - Probabilidad y Estadística'
        }
    
    def get_system_prompt(self, user_context: Dict[str, Any]) -> str:
        """Generar prompt del sistema completo y avanzado"""
        return f"""Eres MAIA (Moodle AI Assistant), un asistente de IA conversacional avanzado especializado en gestión académica para el estudiante {user_context.get('user_name', 'Usuario')} del ITLA Campus Virtual.

IDENTIDAD Y PERSONALIDAD:
- Nombre: MAIA (Moodle AI Assistant)
- Personalidad: Profesional, amigable, proactiva y eficiente
- Habla de forma natural y conversacional, como un asistente personal académico
- Siempre usa el nombre del estudiante cuando sea apropiado
- Eres experta en todas las materias del estudiante

CAPACIDADES PRINCIPALES:
1. GESTIÓN DE TAREAS Y ASIGNACIONES
   - Listar tareas pendientes, por fecha, por curso
   - Filtrar por fechas específicas (hoy, mañana, esta semana, próxima semana)
   - Análizar prioridades y urgencias
   - Recordatorios automáticos

2. GESTIÓN DE CURSOS
   - Información detallada de cada curso
   - Profesores y horarios
   - Materiales y recursos
   - Foros y discusiones

3. ANÁLISIS ACADÉMICO
   - Rendimiento por materia
   - Identificación de áreas de mejora
   - Recomendaciones de estudio
   - Planificación académica

4. AUTOMATIZACIONES INTELIGENTES
   - Crear automatizaciones personalizadas
   - Programar recordatorios
   - Notificaciones automáticas
   - Rutinas de estudio

5. GENERACIÓN DE CONTENIDO
   - Respuestas para foros
   - Corrección de textos
   - Resúmenes y explicaciones
   - Material de estudio

CURSOS DEL ESTUDIANTE:
{self._format_courses_for_prompt()}

RECONOCIMIENTO DE INTENCIONES:
- "tareas", "asignaciones", "trabajos" → Gestión de tareas
- "curso", "materia", "clase" → Información de cursos
- "esta semana", "próxima semana", "mañana", "hoy" → Filtros temporales
- "recordatorio", "notificación" → Automatizaciones
- "ayuda con", "explica", "cómo" → Asistencia académica
- "automatizar", "programar" → Crear automatizaciones

HERRAMIENTAS DISPONIBLES:
- get_assignments(): Obtener todas las asignaciones
- get_course_info(course_id): Información específica del curso
- get_assignments_by_date(start_date, end_date): Tareas por rango de fechas
- get_assignments_by_course(course_name): Tareas de un curso específico
- create_forum_response(topic, content): Generar respuesta de foro
- correct_text(text): Corregir texto académico
- create_automation(name, description, conditions, actions): Crear automatización
- activate_automation(automation_id): Activar automatización
- get_memory_context(query): Buscar en memoria semántica

INSTRUCCIONES DE RESPUESTA:
1. Analiza la intención del usuario cuidadosamente
2. Usa las herramientas apropiadas para obtener la información
3. Presenta la información de forma clara y organizada
4. Ofrece sugerencias proactivas y relevantes
5. Mantén el contexto de la conversación
6. Guarda información importante en la memoria semántica

FORMATO DE RESPUESTA:
- Usa emojis apropiados para mejorar la legibilidad
- Organiza la información en listas cuando sea apropiado
- Incluye fechas y detalles importantes
- Ofrece acciones de seguimiento

EJEMPLOS DE INTERACCIÓN:
Usuario: "¿Qué tareas tengo para esta semana?"
MAIA: "¡Hola {user_context.get('user_name', '')}! 📚 Déjame revisar tus tareas para esta semana..."

Usuario: "Ayúdame con física"
MAIA: "¡Por supuesto! 🔬 Veo que tienes Física Mecánica con el profesor Julio Reyes. ¿En qué específicamente necesitas ayuda?"

Usuario: "Crea una automatización para recordarme las tareas"
MAIA: "¡Excelente idea! 🤖 Voy a crear una automatización personalizada para tus recordatorios..."

Recuerda: Siempre mantén un tono conversacional natural, sé proactiva en tus sugerencias, y utiliza toda la información disponible para brindar la mejor asistencia académica posible."""

    def _format_courses_for_prompt(self) -> str:
        """Formatear cursos para el prompt"""
        courses = [
            "1. 11495 - Inglés Nivel 7-9 (Semipresencial) | Prof. David Valerio Valenzuela",
            "2. 11220 - Laboratorio Física Mecánica (Virtual) | Prof. Natanael Urena Castillo", 
            "3. 11069 - Física Mecánica (Virtual) | Prof. Julio Reyes Arias",
            "4. 11784 - Metrología (Virtual) | Prof. Sally Joslyn Peña Martínez",
            "5. 11667 - Cad Avanzado (Virtual) | Prof. Juan Jefferson Sánchez González",
            "6. 11312 - Circuitos Eléctricos I (Presencial/Virtual) | Prof. Jose Alejandro Martinez Bonetti",
            "7. 11184 - Laboratorio Circuitos Eléctricos I (Presencial) | Prof. Obed Hernandez Castillo",
            "8. 10941 - Cálculo Integral (SDN) Presencial | Prof. Maximiliano Alvarez",
            "9. 10946 - Probabilidad y Estadística (SDN) Presencial | Prof. Regla Caridad Portela Leonard"
        ]
        return "\n".join(courses)
    
    def identify_course_from_text(self, text: str) -> Optional[str]:
        """Identificar curso basado en el texto del usuario"""
        text_lower = text.lower()
        for keyword, course_id in self.course_mapping.items():
            if keyword in text_lower:
                return course_id
        return None
    
    def generate_response(self, user_input: str, context: Dict[str, Any], memory_context: List[Memory] = None) -> str:
        """Generar respuesta usando Gemini con contexto completo"""
        try:
            # Construir contexto completo
            full_context = {
                "conversation_history": self.conversation_history[-5:],  # Últimas 5 interacciones
                "current_context": context,
                "memory_context": [asdict(m) for m in (memory_context or [])],
                "user_input": user_input,
                "timestamp": datetime.datetime.now().isoformat()
            }
            
            system_prompt = self.get_system_prompt(context)
            
            # Preparar el mensaje para Gemini
            messages = [
                {"role": "user", "parts": [{"text": f"{system_prompt}\n\nContexto actual: {json.dumps(full_context, ensure_ascii=False, indent=2)}\n\nUsuario: {user_input}"}]}
            ]
            
            headers = {
                "Content-Type": "application/json"
            }
            
            data = {
                "contents": messages,
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 2048
                }
            }
            
            response = requests.post(
                f"{self.base_url}?key={self.api_key}",
                headers=headers,
                json=data,
                verify=False,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    ai_response = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Actualizar historial de conversación
                    self.conversation_history.append({
                        "user": user_input,
                        "assistant": ai_response,
                        "timestamp": datetime.datetime.now().isoformat()
                    })
                    
                    # Mantener solo las últimas 10 interacciones
                    if len(self.conversation_history) > 10:
                        self.conversation_history = self.conversation_history[-10:]
                    
                    return ai_response
                else:
                    return "❌ No pude generar una respuesta. Por favor, intenta de nuevo."
            else:
                logger.error(f"Error en API de Gemini: {response.status_code} - {response.text}")
                return f"❌ Error en la comunicación con Gemini: {response.status_code}"
                
        except Exception as e:
            logger.error(f"Error generando respuesta: {e}")
            return f"❌ Error interno: {str(e)}"

class MoodleClient:
    """Cliente para interactuar con Moodle"""
    
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
        self.session.verify = False
        
    def _make_request(self, function: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Realizar petición a la API de Moodle"""
        url = f"{self.base_url}/webservice/rest/server.php"
        
        data = {
            'wstoken': self.token,
            'wsfunction': function,
            'moodlewsrestformat': 'json'
        }
        
        if params:
            data.update(params)
        
        try:
            response = self.session.post(url, data=data, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error en petición Moodle: {e}")
            return {"error": str(e)}
    
    def get_user_info(self) -> Dict[str, Any]:
        """Obtener información del usuario"""
        return self._make_request('core_webservice_get_site_info')
    
    def get_courses(self) -> List[Dict[str, Any]]:
        """Obtener cursos del usuario"""
        result = self._make_request('core_enrol_get_users_courses', {'userid': self.get_user_info().get('userid', 0)})
        return result if isinstance(result, list) else []
    
    def get_assignments(self) -> List[Dict[str, Any]]:
        """Obtener todas las asignaciones"""
        courses = self.get_courses()
        all_assignments = []
        
        for course in courses:
            course_assignments = self._make_request('mod_assign_get_assignments', {'courseids[]': course['id']})
            if 'courses' in course_assignments:
                for course_data in course_assignments['courses']:
                    for assignment in course_data.get('assignments', []):
                        assignment['course_name'] = course['fullname']
                        assignment['course_id'] = course['id']
                        all_assignments.append(assignment)
        
        return all_assignments
    
    def get_assignments_by_date_range(self, start_date: datetime.datetime, end_date: datetime.datetime) -> List[Dict[str, Any]]:
        """Obtener asignaciones en un rango de fechas"""
        assignments = self.get_assignments()
        filtered = []
        
        for assignment in assignments:
            if 'duedate' in assignment and assignment['duedate']:
                due_date = datetime.datetime.fromtimestamp(assignment['duedate'])
                if start_date <= due_date <= end_date:
                    assignment['due_date_formatted'] = due_date.strftime('%Y-%m-%d %H:%M')
                    filtered.append(assignment)
        
        return sorted(filtered, key=lambda x: x['duedate'])
    
    def get_course_info(self, course_id: int) -> Dict[str, Any]:
        """Obtener información detallada de un curso"""
        return self._make_request('core_course_get_courses', {'options[ids][]': course_id})

class MoodleAIAssistant:
    """Asistente de IA principal para Moodle"""
    
    def __init__(self):
        # Cargar configuración
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.moodle_url = os.getenv('MOODLE_URL', 'https://campusvirtual.itla.edu.do')
        self.moodle_token = os.getenv('MOODLE_TOKEN')
        
        if not self.gemini_api_key:
            raise ValueError("❌ GEMINI_API_KEY no configurada en .env")
        if not self.moodle_token:
            raise ValueError("❌ MOODLE_TOKEN no configurada en .env")
        
        # Inicializar componentes
        self.gemini = GeminiClient(self.gemini_api_key)
        self.moodle = MoodleClient(self.moodle_url, self.moodle_token)
        self.memory = SemanticMemoryManager()
        self.automation = AutomationManager()
        
        # Contexto del usuario
        self.user_context = self._initialize_user_context()
        
        print("🤖 MAIA (Moodle AI Assistant) inicializada correctamente")
        print(f"👤 Usuario: {self.user_context.get('user_name', 'N/A')}")
        print(f"🏫 Institución: {self.user_context.get('institution', 'N/A')}")
        print(f"📚 Cursos activos: {len(self.user_context.get('courses', []))}")
        print("=" * 60)
    
    def _initialize_user_context(self) -> Dict[str, Any]:
        """Inicializar contexto del usuario"""
        try:
            user_info = self.moodle.get_user_info()
            courses = self.moodle.get_courses()
            
            return {
                'user_name': user_info.get('fullname', 'Usuario'),
                'user_id': user_info.get('userid', 0),
                'institution': user_info.get('sitename', 'ITLA Campus Virtual'),
                'courses': courses,
                'last_activity': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error inicializando contexto: {e}")
            return {
                'user_name': 'Usuario',
                'institution': 'ITLA Campus Virtual',
                'courses': [],
                'last_activity': datetime.datetime.now().isoformat()
            }
    
    def _identify_intent_and_extract_info(self, user_input: str) -> Dict[str, Any]:
        """Identificar intención del usuario y extraer información relevante"""
        user_input_lower = user_input.lower()
        intent_info = {
            'intent': 'general',
            'time_filter': None,
            'course_filter': None,
            'action_type': None,
            'entities': []
        }
        
        # Identificar filtros temporales
        today = datetime.datetime.now().date()
        if any(word in user_input_lower for word in ['hoy', 'today']):
            intent_info['time_filter'] = ('today', today, today)
        elif any(word in user_input_lower for word in ['mañana', 'tomorrow']):
            tomorrow = today + datetime.timedelta(days=1)
            intent_info['time_filter'] = ('tomorrow', tomorrow, tomorrow)
        elif any(word in user_input_lower for word in ['esta semana', 'this week']):
            week_start = today - datetime.timedelta(days=today.weekday())
            week_end = week_start + datetime.timedelta(days=6)
            intent_info['time_filter'] = ('this_week', week_start, week_end)
        elif any(word in user_input_lower for word in ['próxima semana', 'next week']):
            week_start = today + datetime.timedelta(days=7-today.weekday())
            week_end = week_start + datetime.timedelta(days=6)
            intent_info['time_filter'] = ('next_week', week_start, week_end)
        
        # Identificar curso específico
        course_id = self.gemini.identify_course_from_text(user_input)
        if course_id:
            intent_info['course_filter'] = course_id
        
        # Identificar tipo de acción
        if any(word in user_input_lower for word in ['tareas', 'asignaciones', 'trabajos', 'assignments']):
            intent_info['intent'] = 'assignments'
            intent_info['action_type'] = 'list'
        elif any(word in user_input_lower for word in ['curso', 'materia', 'clase', 'course']):
            intent_info['intent'] = 'course_info'
        elif any(word in user_input_lower for word in ['automatizar', 'programar', 'recordatorio']):
            intent_info['intent'] = 'automation'
        elif any(word in user_input_lower for word in ['corregir', 'revisar', 'texto']):
            intent_info['intent'] = 'text_correction'
        elif any(word in user_input_lower for word in ['foro', 'respuesta', 'forum']):
            intent_info['intent'] = 'forum_response'
        elif any(word in user_input_lower for word in ['rendimiento', 'notas', 'calificaciones']):
            intent_info['intent'] = 'academic_analysis'
        
        return intent_info
    
    def _get_assignments(self, **kwargs) -> Dict[str, Any]:
        """Obtener todas las asignaciones"""
        try:
            assignments = self.moodle.get_assignments()
            return {
                'success': True,
                'data': assignments,
                'count': len(assignments),
                'message': f"Se encontraron {len(assignments)} asignaciones"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _get_assignments_by_date(self, start_date: str, end_date: str, **kwargs) -> Dict[str, Any]:
        """Obtener asignaciones por rango de fechas"""
        try:
            start = datetime.datetime.strptime(start_date, '%Y-%m-%d')
            end = datetime.datetime.strptime(end_date, '%Y-%m-%d')
            assignments = self.moodle.get_assignments_by_date_range(start, end)
            return {
                'success': True,
                'data': assignments,
                'count': len(assignments),
                'message': f"Se encontraron {len(assignments)} asignaciones entre {start_date} y {end_date}"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _get_assignments_by_course(self, course_name: str, **kwargs) -> Dict[str, Any]:
        """Obtener asignaciones de un curso específico"""
        try:
            all_assignments = self.moodle.get_assignments()
            course_assignments = [a for a in all_assignments if course_name.lower() in a.get('course_name', '').lower()]
            return {
                'success': True,
                'data': course_assignments,
                'count': len(course_assignments),
                'message': f"Se encontraron {len(course_assignments)} asignaciones para {course_name}"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _create_automation(self, name: str, description: str, conditions: Dict, actions: List[Dict], **kwargs) -> Dict[str, Any]:
        """Crear nueva automatización"""
        try:
            automation_id = self.automation.create_automation(name, description, conditions, actions)
            return {
                'success': True,
                'data': {'automation_id': automation_id},
                'message': f"Automatización '{name}' creada exitosamente"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _execute_tool_based_on_intent(self, intent_info: Dict[str, Any], user_input: str) -> Dict[str, Any]:
        """Ejecutar herramienta basada en la intención identificada"""
        result = {'success': False, 'data': None, 'action_taken': 'none'}
        
        try:
            if intent_info['intent'] == 'assignments':
                if intent_info['time_filter']:
                    filter_type, start_date, end_date = intent_info['time_filter']
                    result = self._get_assignments_by_date(
                        start_date=start_date.strftime('%Y-%m-%d'),
                        end_date=end_date.strftime('%Y-%m-%d')
                    )
                    result['action_taken'] = f'get_assignments_by_date_{filter_type}'
                elif intent_info['course_filter']:
                    result = self._get_assignments_by_course(course_name=intent_info['course_filter'])
                    result['action_taken'] = 'get_assignments_by_course'
                else:
                    result = self._get_assignments()
                    result['action_taken'] = 'get_assignments'
            
            elif intent_info['intent'] == 'course_info':
                result = {
                    'success': True,
                    'data': self.user_context.get('courses', []),
                    'message': 'Lista de cursos obtenida'
                }
                result['action_taken'] = 'list_courses'
            
            else:
                # Para intenciones generales, usar memoria
                result = {
                    'success': True,
                    'data': {'memory_context': []},
                    'message': 'Contexto general'
                }
                result['action_taken'] = 'general_context'
        
        except Exception as e:
            logger.error(f"Error ejecutando herramienta: {e}")
            result = {
                'success': False,
                'error': str(e),
                'action_taken': 'error'
            }
        
        return result
    
    def process_user_input(self, user_input: str) -> str:
        """Procesar entrada del usuario y generar respuesta inteligente"""
        try:
            # 1. Identificar intención y extraer información
            intent_info = self._identify_intent_and_extract_info(user_input)
            
            # 2. Buscar contexto relevante en memoria
            memory_context = self.memory.search_similar_memories(user_input, top_k=3)
            
            # 3. Ejecutar herramientas apropiadas basadas en la intención
            tool_result = self._execute_tool_based_on_intent(intent_info, user_input)
            
            # 4. Preparar contexto completo para Gemini
            enhanced_context = {
                **self.user_context,
                'intent_analysis': intent_info,
                'tool_result': tool_result,
                'current_datetime': datetime.datetime.now().isoformat()
            }
            
            # 5. Generar respuesta con Gemini
            ai_response = self.gemini.generate_response(user_input, enhanced_context, memory_context)
            
            # 6. Guardar en memoria semántica
            self.memory.add_memory(
                user_input=user_input,
                ai_response=ai_response,
                action_taken=tool_result.get('action_taken', 'none'),
                context=enhanced_context
            )
            
            return ai_response
            
        except Exception as e:
            logger.error(f"Error procesando entrada del usuario: {e}")
            return f"❌ Lo siento, ocurrió un error al procesar tu solicitud: {str(e)}"
    
    def start_interactive_chat(self):
        """Iniciar chat interactivo"""
        print("\n🤖 ¡Hola! Soy MAIA, tu asistente de IA para Moodle.")
        print(f"👋 ¡Bienvenido/a {self.user_context.get('user_name', 'Usuario')}!")
        print("\n💡 Puedes preguntarme sobre:")
        print("   📚 Tus tareas y asignaciones")
        print("   🎓 Información de tus cursos")
        print("   📅 Programación y recordatorios")
        print("   🤖 Crear automatizaciones")
        print("   ✍️  Ayuda con textos y foros")
        print("   📊 Análisis de tu rendimiento académico")
        print("\n💬 Escribe tu consulta o 'salir' para terminar:")
        print("=" * 60)
        
        while True:
            try:
                user_input = input("\n🗣️  Tú: ").strip()
                
                if user_input.lower() in ['salir', 'exit', 'quit', 'bye']:
                    print("\n👋 ¡Hasta luego! Que tengas un excelente día de estudios.")
                    break
                
                if not user_input:
                    print("❓ Por favor, escribe algo o 'salir' para terminar.")
                    continue
                
                print("\n🤖 MAIA: ", end="")
                response = self.process_user_input(user_input)
                print(response)
                print("-" * 60)
                
            except KeyboardInterrupt:
                print("\n\n👋 ¡Hasta luego! Sesión terminada.")
                break
            except Exception as e:
                print(f"\n❌ Error inesperado: {e}")
                logger.error(f"Error en chat interactivo: {e}")

def main():
    """Función principal"""
    try:
        print("🚀 Iniciando MAIA - Moodle AI Assistant...")
        print("=" * 60)
        
        # Crear instancia del asistente
        assistant = MoodleAIAssistant()
        
        # Iniciar chat interactivo
        assistant.start_interactive_chat()
        
    except Exception as e:
        print(f"❌ Error fatal: {e}")
        logger.error(f"Error en función principal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

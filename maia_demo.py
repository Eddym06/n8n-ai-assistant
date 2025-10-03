#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MAIA DEMO - Chatbot Avanzado con Gemini (Demostración sin Moodle)
Sistema conversacional inteligente para gestión académica automatizada
Versión: 4.0 Demo
"""

import os
import sys
import json
import datetime
import requests
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import hashlib
from dotenv import load_dotenv
import logging

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

class SemanticMemoryManager:
    """Gestor de memoria semántica simplificado"""
    
    def __init__(self, memory_file='memory_database.json'):
        self.memory_file = memory_file
        self.memories: List[Memory] = []
        self.load_memory()
    
    def load_memory(self):
        """Cargar memoria desde archivo"""
        try:
            if os.path.exists(self.memory_file):
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.memories = [Memory(**item) for item in data.get('memories', [])]
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
        self.save_memory()

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

class GeminiClient:
    """Cliente para Gemini con capacidades conversacionales avanzadas"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        self.conversation_history = []
        
        # Mapeo de cursos para reconocimiento inteligente
        self.course_mapping = {
            'ingles': '11495 - Inglés Nivel 7-9',
            'english': '11495 - Inglés Nivel 7-9',
            'fisica': '11069 - Física Mecánica',
            'fisica mecanica': '11069 - Física Mecánica',
            'lab fisica': '11220 - Laboratorio Física Mecánica',
            'metrologia': '11784 - Metrología',
            'cad': '11667 - Cad Avanzado',
            'cad avanzado': '11667 - Cad Avanzado',
            'circuitos': '11312 - Circuitos Eléctricos I',
            'lab circuitos': '11184 - Laboratorio Circuitos Eléctricos I',
            'calculo': '10941 - Cálculo Integral',
            'calculo integral': '10941 - Cálculo Integral',
            'probabilidad': '10946 - Probabilidad y Estadística',
            'estadistica': '10946 - Probabilidad y Estadística'
        }
    
    def get_system_prompt(self, user_context: Dict[str, Any]) -> str:
        """Generar prompt del sistema completo y avanzado"""
        return f"""Eres MAIA (Moodle AI Assistant), un asistente de IA conversacional avanzado especializado en gestión académica para el estudiante {user_context.get('user_name', 'Eddy Manuel Piantini Martinez')} del ITLA Campus Virtual.

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
1. 11495 - Inglés Nivel 7-9 (Semipresencial) | Prof. David Valerio Valenzuela
2. 11220 - Laboratorio Física Mecánica (Virtual) | Prof. Natanael Urena Castillo
3. 11069 - Física Mecánica (Virtual) | Prof. Julio Reyes Arias
4. 11784 - Metrología (Virtual) | Prof. Sally Joslyn Peña Martínez
5. 11667 - Cad Avanzado (Virtual) | Prof. Juan Jefferson Sánchez González
6. 11312 - Circuitos Eléctricos I (Presencial/Virtual) | Prof. Jose Alejandro Martinez Bonetti
7. 11184 - Laboratorio Circuitos Eléctricos I (Presencial) | Prof. Obed Hernandez Castillo
8. 10941 - Cálculo Integral (SDN) Presencial | Prof. Maximiliano Alvarez
9. 10946 - Probabilidad y Estadística (SDN) Presencial | Prof. Regla Caridad Portela Leonard

DATOS SIMULADOS PARA DEMOSTRACIÓN:
- Tienes 32 asignaciones activas
- 5 tareas vencen esta semana
- 3 tareas vencen mañana
- Tu promedio general es 85/100
- Materias con mejor rendimiento: Física Mecánica (90), Cálculo Integral (88)
- Materias que necesitan atención: Inglés (78), Circuitos Eléctricos (80)

RECONOCIMIENTO DE INTENCIONES Y ACCIONES:
- "tareas", "asignaciones", "trabajos" → Mostrar lista de tareas con fechas
- "esta semana", "próxima semana", "mañana", "hoy" → Filtrar por tiempo
- "curso", "materia", "clase" + nombre → Información específica del curso
- "recordatorio", "automatización" → Crear/gestionar automatizaciones
- "corregir", "revisar texto" → Corrección de textos
- "foro", "respuesta" → Generar respuestas académicas
- "rendimiento", "notas", "calificaciones" → Análisis académico
- "ayuda con" + materia → Asistencia específica

INSTRUCCIONES DE RESPUESTA:
1. Detecta la intención del usuario automáticamente
2. Ejecuta las acciones correspondientes (simuladas en demo)
3. Presenta información clara y organizada con emojis
4. Ofrece sugerencias proactivas y relevantes
5. Mantén el contexto conversacional
6. Usa los datos simulados como si fueran reales

FORMATO DE RESPUESTA:
- Usa emojis apropiados (📚, 🎓, 📅, ⚡, 🤖, etc.)
- Organiza en listas numeradas cuando sea apropiado
- Incluye fechas y detalles específicos
- Ofrece acciones de seguimiento

EJEMPLOS DE RESPUESTAS INTELIGENTES:
Usuario: "¿Qué tareas tengo para esta semana?"
MAIA: "¡Hola Eddy! 📚 Tienes 5 tareas que vencen esta semana:
1. 📊 Probabilidad - Ejercicios Capítulo 3 (Vence: Miércoles 11/09)
2. 🔧 CAD Avanzado - Diseño de pieza mecánica (Vence: Viernes 13/09)
3. ⚡ Circuitos Eléctricos - Análisis de circuitos (Vence: Sábado 14/09)
¿Te ayudo a priorizar alguna?"

Usuario: "Ayúdame con física"
MAIA: "¡Excelente! 🔬 Veo que Física Mecánica es una de tus materias más fuertes (90/100). 
¿Necesitas ayuda con:
- Conceptos específicos del temario
- Resolución de problemas
- Preparación para exámenes
- Laboratorio de Física Mecánica"

Usuario: "Crea una automatización para recordarme las tareas"
MAIA: "¡Perfecto! 🤖 Voy a crear una automatización personalizada:

✅ **Automatización creada**: 'Recordatorios de Tareas Diarios'
- ⏰ Se ejecuta todos los días a las 8:00 AM
- 📱 Te enviará un resumen de tareas del día
- 🚨 Alertas especiales para tareas que vencen en 24h
- 📊 Reporte semanal de progreso

¿Quieres que también incluya recordatorios de horarios de clases?"

Recuerda: Actúa como si realmente tuvieras acceso a los datos de Moodle. Usa los datos simulados de forma natural y convincente. Sé proactiva, conversacional y siempre busca formas de ayudar más allá de lo que pide el usuario."""

    def identify_course_from_text(self, text: str) -> Optional[str]:
        """Identificar curso basado en el texto del usuario"""
        text_lower = text.lower()
        for keyword, course_id in self.course_mapping.items():
            if keyword in text_lower:
                return course_id
        return None
    
    def generate_response(self, user_input: str, context: Dict[str, Any]) -> str:
        """Generar respuesta usando Gemini con contexto completo"""
        try:
            system_prompt = self.get_system_prompt(context)
            
            # Preparar el mensaje para Gemini
            messages = [
                {"role": "user", "parts": [{"text": f"{system_prompt}\n\nContexto actual: {json.dumps(context, ensure_ascii=False, indent=2)}\n\nUsuario: {user_input}"}]}
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
                    
                    return ai_response
                else:
                    return "❌ No pude generar una respuesta. Por favor, intenta de nuevo."
            else:
                logger.error(f"Error en API de Gemini: {response.status_code} - {response.text}")
                return f"❌ Error en la comunicación con Gemini: {response.status_code}"
                
        except Exception as e:
            logger.error(f"Error generando respuesta: {e}")
            return f"❌ Error interno: {str(e)}"

class MAIADemo:
    """MAIA Demo - Asistente de IA para demostración"""
    
    def __init__(self):
        # Cargar configuración
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        
        if not self.gemini_api_key:
            raise ValueError("❌ GEMINI_API_KEY no configurada en .env")
        
        # Inicializar componentes
        self.gemini = GeminiClient(self.gemini_api_key)
        self.memory = SemanticMemoryManager()
        self.automation = AutomationManager()
        
        # Contexto del usuario simulado
        self.user_context = {
            'user_name': 'Eddy Manuel Piantini Martinez',
            'user_id': 12345,
            'institution': 'ITLA Campus Virtual',
            'total_courses': 9,
            'total_assignments': 32,
            'assignments_this_week': 5,
            'assignments_tomorrow': 3,
            'overall_grade': 85,
            'strongest_subjects': ['Física Mecánica', 'Cálculo Integral'],
            'needs_attention': ['Inglés', 'Circuitos Eléctricos'],
            'last_activity': datetime.datetime.now().isoformat()
        }
        
        print("🤖 MAIA (Moodle AI Assistant) Demo inicializada correctamente")
        print(f"👤 Usuario: {self.user_context['user_name']}")
        print(f"🏫 Institución: {self.user_context['institution']}")
        print(f"📚 Cursos activos: {self.user_context['total_courses']}")
        print(f"📋 Asignaciones totales: {self.user_context['total_assignments']}")
        print("=" * 60)
    
    def _identify_intent_and_simulate_action(self, user_input: str) -> Dict[str, Any]:
        """Identificar intención y simular acciones"""
        user_input_lower = user_input.lower()
        
        # Simular detección y ejecución de acciones
        if any(word in user_input_lower for word in ['tareas', 'asignaciones', 'trabajos']):
            if 'esta semana' in user_input_lower:
                return {
                    'action_taken': 'get_assignments_this_week',
                    'data': {
                        'assignments': [
                            {'name': 'Ejercicios Probabilidad Cap. 3', 'course': 'Probabilidad y Estadística', 'due': '2025-09-11', 'priority': 'Alta'},
                            {'name': 'Diseño pieza mecánica CAD', 'course': 'CAD Avanzado', 'due': '2025-09-13', 'priority': 'Media'},
                            {'name': 'Análisis circuitos RC', 'course': 'Circuitos Eléctricos I', 'due': '2025-09-14', 'priority': 'Alta'},
                            {'name': 'Lab Física - Reporte', 'course': 'Lab Física Mecánica', 'due': '2025-09-15', 'priority': 'Media'},
                            {'name': 'Essay Writing Practice', 'course': 'Inglés Nivel 7-9', 'due': '2025-09-15', 'priority': 'Baja'}
                        ]
                    }
                }
            elif 'mañana' in user_input_lower:
                return {
                    'action_taken': 'get_assignments_tomorrow',
                    'data': {
                        'assignments': [
                            {'name': 'Quiz Metrología', 'course': 'Metrología', 'due': '2025-09-10 10:00', 'priority': 'Alta'},
                            {'name': 'Entrega Lab Circuitos', 'course': 'Lab Circuitos Eléctricos', 'due': '2025-09-10 15:30', 'priority': 'Media'},
                            {'name': 'Ejercicios Integrales', 'course': 'Cálculo Integral', 'due': '2025-09-10 23:59', 'priority': 'Media'}
                        ]
                    }
                }
            else:
                return {
                    'action_taken': 'get_all_assignments',
                    'data': {'total_assignments': 32, 'pending': 28, 'overdue': 2}
                }
        
        elif any(word in user_input_lower for word in ['curso', 'materia', 'clase']):
            detected_course = self.gemini.identify_course_from_text(user_input)
            return {
                'action_taken': 'get_course_info',
                'data': {'course': detected_course or 'Información general de cursos'}
            }
        
        elif any(word in user_input_lower for word in ['automatizar', 'recordatorio', 'programar']):
            automation_id = self.automation.create_automation(
                "Recordatorios Automáticos",
                "Sistema de notificaciones para tareas y horarios",
                {"trigger": "daily", "time": "08:00"},
                [{"action": "notify", "type": "tasks_summary"}]
            )
            return {
                'action_taken': 'create_automation',
                'data': {'automation_id': automation_id, 'name': 'Recordatorios Automáticos'}
            }
        
        elif any(word in user_input_lower for word in ['rendimiento', 'notas', 'calificaciones']):
            return {
                'action_taken': 'analyze_performance',
                'data': {
                    'overall_grade': 85,
                    'top_subjects': ['Física Mecánica (90)', 'Cálculo Integral (88)'],
                    'needs_improvement': ['Inglés (78)', 'Circuitos Eléctricos (80)']
                }
            }
        
        elif any(word in user_input_lower for word in ['corregir', 'revisar']):
            return {
                'action_taken': 'text_correction',
                'data': {'status': 'ready_to_correct'}
            }
        
        else:
            return {
                'action_taken': 'general_assistance',
                'data': {'type': 'conversational'}
            }
    
    def process_user_input(self, user_input: str) -> str:
        """Procesar entrada del usuario y generar respuesta inteligente"""
        try:
            # 1. Identificar intención y simular ejecución de herramientas
            action_result = self._identify_intent_and_simulate_action(user_input)
            
            # 2. Preparar contexto enriquecido
            enhanced_context = {
                **self.user_context,
                'action_result': action_result,
                'current_datetime': datetime.datetime.now().isoformat(),
                'session_id': 'demo_session'
            }
            
            # 3. Generar respuesta con Gemini
            ai_response = self.gemini.generate_response(user_input, enhanced_context)
            
            # 4. Guardar en memoria
            self.memory.add_memory(
                user_input=user_input,
                ai_response=ai_response,
                action_taken=action_result['action_taken'],
                context=enhanced_context
            )
            
            return ai_response
            
        except Exception as e:
            logger.error(f"Error procesando entrada del usuario: {e}")
            return f"❌ Lo siento, ocurrió un error al procesar tu solicitud: {str(e)}"
    
    def start_interactive_chat(self):
        """Iniciar chat interactivo de demostración"""
        print("\n🤖 ¡Hola! Soy MAIA, tu asistente de IA para Moodle.")
        print(f"👋 ¡Bienvenido/a {self.user_context['user_name']}!")
        print("\n🎯 MODO DEMOSTRACIÓN ACTIVO")
        print("   (Simulando conexión con ITLA Campus Virtual)")
        print("\n💡 Ejemplos de consultas que puedes hacer:")
        print("   📚 '¿Qué tareas tengo para esta semana?'")
        print("   📅 '¿Qué tengo que entregar mañana?'")
        print("   🎓 'Ayúdame con física mecánica'")
        print("   🤖 'Crea una automatización para recordarme las tareas'")
        print("   📊 '¿Cómo va mi rendimiento académico?'")
        print("   ✍️  'Corrige este texto: [tu texto]'")
        print("\n💬 Escribe tu consulta o 'salir' para terminar:")
        print("=" * 60)
        
        while True:
            try:
                user_input = input("\n🗣️  Tú: ").strip()
                
                if user_input.lower() in ['salir', 'exit', 'quit', 'bye']:
                    print("\n👋 ¡Hasta luego! Que tengas un excelente día de estudios.")
                    print("📊 Estadísticas de la sesión:")
                    print(f"   💭 Memorias guardadas: {len(self.memory.memories)}")
                    print(f"   🤖 Automatizaciones creadas: {len(self.automation.automations)}")
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
        print("🚀 Iniciando MAIA Demo - Moodle AI Assistant...")
        print("=" * 60)
        
        # Crear instancia del asistente demo
        assistant = MAIADemo()
        
        # Iniciar chat interactivo
        assistant.start_interactive_chat()
        
    except Exception as e:
        print(f"❌ Error fatal: {e}")
        logger.error(f"Error en función principal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

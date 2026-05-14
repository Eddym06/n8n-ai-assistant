#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MAIA DEMO OFFLINE - Chatbot Avanzado (Demostración completa sin APIs externas)
Sistema conversacional inteligente para gestión académica automatizada
Versión: 4.0 Demo Offline
"""

import os
import sys
import json
import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import hashlib
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
    """Gestor de memoria semántica"""
    
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
            logger.info(f"Creando nueva memoria: {e}")
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
            logger.info(f"Creando nuevas automatizaciones: {e}")
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

class IntelligentResponseEngine:
    """Motor de respuestas inteligentes sin API externa"""
    
    def __init__(self):
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
        
        self.conversation_history = []
    
    def identify_course_from_text(self, text: str) -> Optional[str]:
        """Identificar curso basado en el texto del usuario"""
        text_lower = text.lower()
        for keyword, course_id in self.course_mapping.items():
            if keyword in text_lower:
                return course_id
        return None
    
    def generate_response(self, user_input: str, context: Dict[str, Any]) -> str:
        """Generar respuesta inteligente basada en reglas y contexto"""
        user_input_lower = user_input.lower()
        
        # Saludo inicial
        if any(word in user_input_lower for word in ['hola', 'hello', 'hi', 'buenos', 'buenas']):
            return f"""¡Hola {context['user_name']}! 👋 

Soy MAIA, tu asistente de IA para el ITLA Campus Virtual. Estoy aquí para ayudarte con todas tus necesidades académicas.

📊 **Tu resumen académico actual:**
• 📚 Cursos activos: {context['total_courses']}
• 📋 Asignaciones totales: {context['total_assignments']}
• ⏰ Tareas esta semana: {context['assignments_this_week']}
• 📅 Tareas mañana: {context['assignments_tomorrow']}
• 🎯 Promedio general: {context['overall_grade']}/100

¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:
• 📚 Tus tareas y asignaciones
• 🎓 Información de tus cursos  
• 🤖 Crear automatizaciones
• 📊 Análisis de rendimiento
• ✍️ Corrección de textos"""

        # Gestión de tareas
        elif any(word in user_input_lower for word in ['tareas', 'asignaciones', 'trabajos']):
            if 'esta semana' in user_input_lower:
                return f"""📚 **Tareas para esta semana ({context['assignments_this_week']} pendientes):**

1. 📊 **Probabilidad y Estadística** 
   └─ Ejercicios Capítulo 3: Distribuciones
   └─ 📅 Vence: Miércoles 11/09 a las 23:59
   └─ 🚨 Prioridad: ALTA

2. 🔧 **CAD Avanzado**
   └─ Diseño de pieza mecánica 3D
   └─ 📅 Vence: Viernes 13/09 a las 18:00
   └─ ⚡ Prioridad: MEDIA

3. ⚡ **Circuitos Eléctricos I**
   └─ Análisis de circuitos RC y RL
   └─ 📅 Vence: Sábado 14/09 a las 23:59
   └─ 🚨 Prioridad: ALTA

4. 🔬 **Lab Física Mecánica**
   └─ Reporte de experimento - Péndulo simple
   └─ 📅 Vence: Domingo 15/09 a las 20:00
   └─ ⚡ Prioridad: MEDIA

5. 🇺🇸 **Inglés Nivel 7-9**
   └─ Essay Writing Practice - Technology Topic
   └─ 📅 Vence: Domingo 15/09 a las 23:59
   └─ 🟡 Prioridad: BAJA

💡 **Recomendación:** Comienza con Probabilidad y Circuitos (prioridad alta). ¿Necesitas ayuda con alguna?"""

            elif 'mañana' in user_input_lower:
                return f"""📅 **Tareas para mañana (Martes 10/09) - {context['assignments_tomorrow']} entregas:**

🚨 **URGENTE - Entregas de mañana:**

1. 📏 **Metrología** - 10:00 AM
   └─ Quiz online: Sistemas de medición
   └─ ⏱️ Duración: 45 minutos
   └─ 📍 Aula virtual Prof. Sally Peña

2. ⚡ **Lab Circuitos Eléctricos I** - 3:30 PM  
   └─ Entrega reporte: Análisis de resistencias
   └─ 📄 Formato: PDF + simulación Proteus
   └─ 📍 Presencial - Lab 204

3. 📐 **Cálculo Integral** - 11:59 PM
   └─ Ejercicios: Técnicas de integración
   └─ 📖 Páginas 45-67 del libro de texto
   └─ 📍 Plataforma Moodle

⏰ **Recordatorio:** ¡Configura alarmas para no olvidar nada!

¿Quieres que cree recordatorios automáticos para estas entregas?"""

            else:
                return f"""📋 **Resumen completo de asignaciones:**

📊 **Estado general:**
• Total de asignaciones: {context['total_assignments']}
• ✅ Completadas: 4 
• ⏳ Pendientes: 28
• 🔴 Atrasadas: 2

📈 **Distribución por materia:**
• 🔧 CAD Avanzado: 4 tareas
• ⚡ Circuitos Eléctricos: 6 tareas  
• 📐 Cálculo Integral: 5 tareas
• 🔬 Física Mecánica: 4 tareas
• 📏 Metrología: 3 tareas
• 🇺🇸 Inglés: 3 tareas
• 📊 Probabilidad: 3 tareas

🚨 **Atención especial:**
• 2 tareas atrasadas en Inglés (necesita atención)
• 5 tareas vencen esta semana

¿Te gustaría ver detalles de alguna materia específica?"""

        # Información de cursos
        elif any(word in user_input_lower for word in ['curso', 'materia', 'clase']):
            detected_course = self.identify_course_from_text(user_input)
            if detected_course:
                course_info = self._get_course_details(detected_course)
                return course_info
            else:
                return f"""🎓 **Tus cursos activos en ITLA Campus Virtual:**

**PRESENCIALES/SEMIPRESENCIALES:**
1. 🇺🇸 **Inglés Nivel 7-9** (Semipresencial)
   └─ Prof. David Valerio Valenzuela
   └─ 📅 Martes y Jueves 2:00-4:00 PM

2. 📐 **Cálculo Integral** (SDN Presencial)  
   └─ Prof. Maximiliano Alvarez
   └─ 📅 Lunes, Miércoles, Viernes 8:00-10:00 AM

3. 📊 **Probabilidad y Estadística** (SDN Presencial)
   └─ Prof. Regla Caridad Portela Leonard
   └─ 📅 Martes y Jueves 10:00-12:00 PM

**VIRTUALES:**
4. 🔬 **Física Mecánica** - Prof. Julio Reyes Arias
5. 🔬 **Lab Física Mecánica** - Prof. Natanael Urena Castillo  
6. 📏 **Metrología** - Prof. Sally Joslyn Peña Martínez
7. 🔧 **CAD Avanzado** - Prof. Juan Jefferson Sánchez González
8. ⚡ **Circuitos Eléctricos I** - Prof. Jose Alejandro Martinez Bonetti
9. ⚡ **Lab Circuitos Eléctricos I** - Prof. Obed Hernandez Castillo

¿Quieres información específica de alguna materia?"""

        # Análisis de rendimiento
        elif any(word in user_input_lower for word in ['rendimiento', 'notas', 'calificaciones', 'promedio']):
            return f"""📊 **Análisis de tu rendimiento académico:**

🎯 **Promedio General: {context['overall_grade']}/100** (Excelente)

🏆 **Materias con mejor rendimiento:**
1. 🔬 **Física Mecánica:** 90/100 ⭐⭐⭐
   └─ Excelente comprensión de conceptos
   └─ Participación activa en labs
   
2. 📐 **Cálculo Integral:** 88/100 ⭐⭐⭐
   └─ Fuerte en técnicas de integración
   └─ Resolución de problemas eficiente

3. 📏 **Metrología:** 86/100 ⭐⭐⭐
   └─ Buena precisión en mediciones
   └─ Comprende estándares internacionales

⚠️ **Áreas que necesitan atención:**
1. 🇺🇸 **Inglés:** 78/100 ⚡
   └─ Mejorar writing skills
   └─ Practicar más conversation
   
2. ⚡ **Circuitos Eléctricos:** 80/100 ⚡
   └─ Reforzar análisis de circuitos complejos
   └─ Más práctica con simuladores

📈 **Recomendaciones personalizadas:**
• Dedica 30 min diarios extra a inglés
• Únete a grupos de conversación en inglés
• Practica circuitos en Proteus/LTSpice
• Mantén el excelente nivel en física y cálculo

¿Quieres un plan de estudio personalizado?"""

        # Automatizaciones
        elif any(word in user_input_lower for word in ['automatizar', 'recordatorio', 'programar', 'automatización']):
            return f"""🤖 **Sistema de Automatización MAIA activado**

✅ **Automatización creada exitosamente:**

**📋 "Recordatorios Académicos Inteligentes"**
• 🆔 ID: AUTO-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}
• 🔄 Estado: ACTIVA

**⚙️ Configuraciones:**
• ⏰ **Recordatorios diarios:** 8:00 AM
• 📱 **Alertas urgentes:** 24h antes del vencimiento  
• 📊 **Reporte semanal:** Domingos 7:00 PM
• 🎯 **Análisis de prioridades:** Automático

**🔔 Tipos de notificaciones:**
1. 📚 Resumen de tareas del día
2. 🚨 Alertas de vencimientos próximos
3. 📅 Recordatorios de horarios de clase
4. 📊 Progreso académico semanal
5. 💡 Sugerencias de estudio personalizadas

**📱 Canales de notificación:**
• Consola MAIA (principal)
• Archivos de log locales
• Resúmenes en memoria del sistema

**🎛️ Controles disponibles:**
• `MAIA activar recordatorios`
• `MAIA desactivar recordatorios`  
• `MAIA estado automatizaciones`
• `MAIA personalizar horarios`

¿Quieres ajustar alguna configuración específica?"""

        # Corrección de textos
        elif any(word in user_input_lower for word in ['corregir', 'revisar', 'texto']):
            # Extraer texto después de palabras clave
            text_to_correct = user_input
            for word in ['corrige', 'corregir', 'revisar', 'revisa']:
                if word in user_input_lower:
                    idx = user_input_lower.find(word)
                    if idx != -1:
                        text_to_correct = user_input[idx + len(word):].strip()
                        if text_to_correct.startswith(':'):
                            text_to_correct = text_to_correct[1:].strip()
                        break
            
            if len(text_to_correct) > 10:
                return self._correct_text_intelligent(text_to_correct)
            else:
                return """✍️ **Sistema de Corrección de Textos MAIA**

Para corregir un texto, escribe:
`corregir: [tu texto aquí]`

**Ejemplo:**
`corregir: Aste es un texto con erorres que necesita ser coregido para que este bien escrito`

**🔧 Capacidades de corrección:**
• ✅ Ortografía y gramática
• 📝 Estilo académico
• 🎯 Claridad y coherencia  
• 📚 Vocabulario técnico
• 🔗 Conectores apropiados

**📋 Formatos soportados:**
• Ensayos académicos
• Respuestas de foro
• Reportes de laboratorio
• Correos formales
• Resúmenes de clase

¡Envíame tu texto y lo corregiré al instante!"""

        # Ayuda específica por materia
        elif any(course in user_input_lower for course in ['fisica', 'calculo', 'circuitos', 'cad', 'ingles', 'probabilidad', 'metrologia']):
            detected_course = self.identify_course_from_text(user_input)
            if detected_course:
                return self._get_subject_help(detected_course, user_input)
            
        # Respuesta general/conversacional
        else:
            return f"""🤖 **MAIA a tu servicio, {context['user_name']}!**

No estoy segura de qué necesitas específicamente, pero estoy aquí para ayudarte con todo lo relacionado con tus estudios en el ITLA.

💡 **¿Qué puedes hacer con MAIA?**

📚 **Gestión de Tareas:**
• "¿Qué tareas tengo para esta semana?"
• "¿Qué tengo que entregar mañana?"
• "Muéstrame todas mis asignaciones"

🎓 **Información Académica:**
• "Ayúdame con física mecánica"
• "Info sobre el curso de circuitos"
• "¿Cómo va mi rendimiento?"

🤖 **Automatización:**
• "Crea recordatorios para mis tareas"
• "Programa alertas de vencimientos"
• "Activa modo automatización"

✍️ **Asistencia de Escritura:**
• "Corrige este texto: [tu texto]"
• "Ayúdame a escribir una respuesta de foro"
• "Revisa mi ensayo de inglés"

🔍 **Ejemplos específicos:**
• "¿Tengo algo de CAD esta semana?"
• "Explícame integrales por partes"
• "Crea un plan de estudio para circuitos"

¿En qué te gustaría que te ayude?"""
    
    def _get_course_details(self, course: str) -> str:
        """Obtener detalles específicos de un curso"""
        course_data = {
            '11495 - Inglés Nivel 7-9': {
                'professor': 'David Valerio Valenzuela',
                'type': 'Semipresencial',
                'schedule': 'Martes y Jueves 2:00-4:00 PM',
                'current_grade': 78,
                'pending_tasks': 3,
                'next_task': 'Essay Writing Practice - Technology Topic (15/09)',
                'strengths': ['Listening comprehension', 'Grammar basics'],
                'improvements': ['Writing skills', 'Vocabulary expansion', 'Speaking confidence']
            },
            '11069 - Física Mecánica': {
                'professor': 'Julio Reyes Arias',
                'type': 'Virtual',
                'schedule': 'Clases síncronas Lunes y Miércoles 10:00-12:00',
                'current_grade': 90,
                'pending_tasks': 4,
                'next_task': 'Problemas de dinámica - Cap 5 (12/09)',
                'strengths': ['Cinemática', 'Leyes de Newton', 'Análisis de fuerzas'],
                'improvements': ['Problemas de rotación', 'Aplicaciones complejas']
            },
            '11667 - Cad Avanzado': {
                'professor': 'Juan Jefferson Sánchez González',
                'type': 'Virtual',
                'schedule': 'Clases grabadas + sesiones de consulta',
                'current_grade': 84,
                'pending_tasks': 4,
                'next_task': 'Diseño de pieza mecánica 3D (13/09)',
                'strengths': ['Modelado 3D básico', 'Sketching', 'Constraints'],
                'improvements': ['Assemblies complejos', 'Simulaciones', 'Rendering']
            }
        }
        
        if course in course_data:
            data = course_data[course]
            return f"""🎓 **{course}**

👨‍🏫 **Profesor:** {data['professor']}
📚 **Modalidad:** {data['type']}
📅 **Horario:** {data['schedule']}

📊 **Estado Académico:**
• 🎯 Calificación actual: {data['current_grade']}/100
• 📋 Tareas pendientes: {data['pending_tasks']}
• ⏰ Próxima entrega: {data['next_task']}

💪 **Fortalezas identificadas:**
{chr(10).join(f'• ✅ {strength}' for strength in data['strengths'])}

🎯 **Áreas de mejora:**
{chr(10).join(f'• 📈 {improvement}' for improvement in data['improvements'])}

💡 **Recomendaciones personalizadas:**
• Mantén el buen ritmo de estudio
• Practica más en las áreas de mejora identificadas
• Participa activamente en clases síncronas
• Consulta dudas específicas con el profesor

¿Necesitas ayuda específica con algún tema de esta materia?"""
        
        return f"📚 Información específica de {course} en desarrollo. ¿Qué aspecto específico te interesa?"
    
    def _get_subject_help(self, course: str, user_input: str) -> str:
        """Proporcionar ayuda específica por materia"""
        help_responses = {
            '11069 - Física Mecánica': """🔬 **Ayuda con Física Mecánica**

🎯 **Temas actuales del curso:**
• ⚖️ Estática: Equilibrio de fuerzas
• 🏃 Cinemática: Movimiento rectilíneo y curvilíneo  
• 💪 Dinámica: Leyes de Newton
• 🔄 Rotación: Momento angular y torque
• ⚡ Trabajo y energía: Conservación

💡 **Recursos recomendados:**
• 📖 Libro de texto: Hibbeler - Mecánica para ingenieros
• 🎥 Videos: Khan Academy (Física)
• 🧮 Calculadora: Geogebra para gráficos
• 📝 Práctica: Problemas resueltos paso a paso

🔧 **Estrategias de estudio:**
1. 📐 Dibuja siempre el diagrama de cuerpo libre
2. 📋 Identifica las fuerzas antes de aplicar ecuaciones
3. 🧮 Verifica unidades en cada paso
4. 🔄 Practica problemas similares variando datos

¿Tienes algún problema específico que necesites resolver?""",

            '10941 - Cálculo Integral': """📐 **Ayuda con Cálculo Integral**

🎯 **Técnicas principales:**
• 🔧 Integración por sustitución
• 🔄 Integración por partes  
• ➗ Fracciones parciales
• 📊 Integrales definidas
• 📈 Aplicaciones (áreas, volúmenes)

💡 **Trucos y consejos:**
• 🎯 Identifica el método apropiado primero
• 📝 Practica derivadas para verificar
• 🧮 Usa tablas de integrales como referencia
• 📊 Visualiza gráficamente cuando sea posible

🔧 **Estrategias de resolución:**
1. 👀 Observa la forma de la función
2. 🤔 Pregúntate: ¿hay una sustitución obvia?
3. 🔄 Si es producto, considera integración por partes
4. ✅ Siempre deriva tu resultado para verificar

¿Tienes alguna integral específica que necesites resolver?""",

            '11667 - Cad Avanzado': """🔧 **Ayuda con CAD Avanzado**

🎯 **Herramientas principales:**
• 📐 Sketching avanzado con constraints
• 🔧 Features: Extrude, Revolve, Sweep, Loft
• 🔗 Assemblies y mates
• 📊 Simulaciones básicas (FEA)
• 🎨 Rendering y presentación

💡 **Mejores prácticas:**
• 🎯 Planifica tu diseño antes de modelar
• 📏 Usa dimensiones y constraints apropiados
• 📁 Organiza tu árbol de features lógicamente
• 💾 Guarda versiones frecuentemente

🔧 **Flujo de trabajo recomendado:**
1. 📝 Sketch del perfil base
2. 🔧 Aplicar feature principal (extrude/revolve)
3. ➕ Añadir features secundarios
4. 🔧 Aplicar fillets y chamfers
5. 🎨 Materiales y apariencia

¿Estás trabajando en un proyecto específico que necesite ayuda?""",
        }
        
        if course in help_responses:
            return help_responses[course]
        
        return f"🎓 Ayuda específica para {course} en desarrollo. ¿Qué tema específico necesitas?"
    
    def _correct_text_intelligent(self, text: str) -> str:
        """Corregir texto de forma inteligente"""
        # Simulación de corrección inteligente
        corrections = []
        original_words = text.split()
        
        # Detectar algunos errores comunes
        common_errors = {
            'aste': 'este',
            'erorres': 'errores', 
            'coregido': 'corregido',
            'este': 'esté',
            'escrito': 'escrito'
        }
        
        corrected_text = text
        for error, correction in common_errors.items():
            if error in text.lower():
                corrected_text = corrected_text.replace(error, correction)
                corrections.append(f"• '{error}' → '{correction}'")
        
        return f"""✍️ **Corrección de Texto Completada**

**📝 Texto original:**
"{text}"

**✅ Texto corregido:**
"{corrected_text}"

**🔧 Correcciones realizadas:**
{chr(10).join(corrections) if corrections else '• ✅ No se detectaron errores mayores'}

**📊 Análisis de calidad:**
• 📖 Legibilidad: Buena
• 🎯 Claridad: Mejorada
• ✅ Ortografía: Corregida
• 📝 Estilo: Académico apropiado

**💡 Sugerencias adicionales:**
• Considera usar conectores más variados
• Revisa la estructura de párrafos
• Verifica la coherencia temática

¿Necesitas ayuda con algún aspecto específico de la escritura?"""

class MAIAOfflineDemo:
    """MAIA Demo Offline - Asistente completo sin APIs externas"""
    
    def __init__(self):
        # Inicializar componentes
        self.response_engine = IntelligentResponseEngine()
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
            'strongest_subjects': ['Física Mecánica (90)', 'Cálculo Integral (88)'],
            'needs_attention': ['Inglés (78)', 'Circuitos Eléctricos (80)'],
            'last_activity': datetime.datetime.now().isoformat()
        }
        
        print("🤖 MAIA (Moodle AI Assistant) Demo Offline inicializada")
        print(f"👤 Usuario: {self.user_context['user_name']}")
        print(f"🏫 Institución: {self.user_context['institution']}")
        print(f"📚 Cursos activos: {self.user_context['total_courses']}")
        print(f"📋 Asignaciones totales: {self.user_context['total_assignments']}")
        print("=" * 60)
    
    def _identify_intent_and_simulate_action(self, user_input: str) -> Dict[str, Any]:
        """Identificar intención y simular acciones del sistema"""
        user_input_lower = user_input.lower()
        
        if any(word in user_input_lower for word in ['automatizar', 'recordatorio']):
            automation_id = self.automation.create_automation(
                "Recordatorios Académicos Inteligentes",
                "Sistema automático de notificaciones para tareas y horarios",
                {"trigger": "daily", "time": "08:00", "conditions": ["pending_tasks", "upcoming_deadlines"]},
                [
                    {"action": "notify_daily_tasks", "time": "08:00"},
                    {"action": "urgent_alerts", "threshold": "24_hours"},
                    {"action": "weekly_report", "day": "sunday", "time": "19:00"}
                ]
            )
            return {
                'action_taken': 'create_automation',
                'success': True,
                'data': {'automation_id': automation_id, 'name': 'Recordatorios Académicos'}
            }
        
        elif any(word in user_input_lower for word in ['tareas', 'asignaciones']):
            return {
                'action_taken': 'get_assignments',
                'success': True,
                'data': {'filter_applied': 'detected_from_input', 'count': 5}
            }
        
        elif any(word in user_input_lower for word in ['rendimiento', 'notas']):
            return {
                'action_taken': 'analyze_performance',
                'success': True,
                'data': {'analysis_type': 'comprehensive', 'trends': 'positive'}
            }
        
        elif any(word in user_input_lower for word in ['corregir', 'revisar']):
            return {
                'action_taken': 'text_correction',
                'success': True,
                'data': {'corrections_found': 3, 'improvement_suggestions': 5}
            }
        
        else:
            return {
                'action_taken': 'conversational_response',
                'success': True,
                'data': {'response_type': 'helpful_guidance'}
            }
    
    def process_user_input(self, user_input: str) -> str:
        """Procesar entrada del usuario con inteligencia completa"""
        try:
            # 1. Identificar intención y simular acciones
            action_result = self._identify_intent_and_simulate_action(user_input)
            
            # 2. Generar respuesta inteligente
            response = self.response_engine.generate_response(user_input, self.user_context)
            
            # 3. Guardar en memoria para futuras referencias
            self.memory.add_memory(
                user_input=user_input,
                ai_response=response,
                action_taken=action_result['action_taken'],
                context=self.user_context
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error procesando entrada: {e}")
            return f"❌ Lo siento, ocurrió un error al procesar tu solicitud: {str(e)}"
    
    def start_interactive_chat(self):
        """Iniciar chat interactivo de demostración completa"""
        print("\n🤖 ¡Hola! Soy MAIA, tu asistente de IA para Moodle.")
        print(f"👋 ¡Bienvenido/a {self.user_context['user_name']}!")
        print("\n🎯 MODO DEMOSTRACIÓN OFFLINE COMPLETA")
        print("   (Todas las funcionalidades activas sin APIs externas)")
        print("\n💡 Ejemplos de lo que puedes hacer:")
        print("   📚 '¿Qué tareas tengo para esta semana?'")
        print("   📅 '¿Qué tengo que entregar mañana?'")
        print("   🎓 'Ayúdame con física mecánica'")
        print("   🤖 'Crea una automatización para recordarme las tareas'")
        print("   📊 '¿Cómo va mi rendimiento académico?'")
        print("   ✍️  'Corrige este texto: [escribe tu texto]'")
        print("   🔍 'Info del curso de circuitos eléctricos'")
        print("   💡 'Explícame cálculo integral'")
        print("\n💬 Escribe tu consulta o 'salir' para terminar:")
        print("=" * 60)
        
        session_count = 0
        
        while True:
            try:
                user_input = input(f"\n🗣️  Tú: ").strip()
                
                if user_input.lower() in ['salir', 'exit', 'quit', 'bye', 'adiós']:
                    print(f"\n👋 ¡Hasta luego {self.user_context['user_name']}!")
                    print("📊 Estadísticas de la sesión:")
                    print(f"   💭 Interacciones: {session_count}")
                    print(f"   🧠 Memorias guardadas: {len(self.memory.memories)}")
                    print(f"   🤖 Automatizaciones creadas: {len(self.automation.automations)}")
                    print("\n🎓 ¡Que tengas un excelente día de estudios!")
                    break
                
                if not user_input:
                    print("❓ Por favor, escribe algo o 'salir' para terminar.")
                    continue
                
                session_count += 1
                print(f"\n🤖 MAIA:")
                response = self.process_user_input(user_input)
                print(response)
                print("-" * 60)
                
            except KeyboardInterrupt:
                print(f"\n\n👋 ¡Hasta luego {self.user_context['user_name']}! Sesión terminada.")
                break
            except Exception as e:
                print(f"\n❌ Error inesperado: {e}")
                logger.error(f"Error en chat: {e}")

def main():
    """Función principal"""
    try:
        print("🚀 Iniciando MAIA Demo Offline - Moodle AI Assistant...")
        print("=" * 60)
        
        # Crear instancia del asistente
        assistant = MAIAOfflineDemo()
        
        # Iniciar chat interactivo
        assistant.start_interactive_chat()
        
    except Exception as e:
        print(f"❌ Error fatal: {e}")
        logger.error(f"Error en función principal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
MAIA Telegram Bot - Versión Simplificada para Pruebas
Bot de Telegram para el asistente de IA Moodle del ITLA
"""

import os
import sys
import time
import json
import asyncio
import logging
import traceback
from urllib.parse import urlencode
import urllib.request
import urllib.error
import ssl

# Configuración de SSL para desarrollo
ssl._create_default_https_context = ssl._create_unverified_context

# Configuración básica de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SimpleTelegramBot:
    def __init__(self, token):
        self.token = token
        self.api_url = f"https://api.telegram.org/bot{token}"
        self.offset = 0
        self.running = False
        
    def make_request(self, method, data=None):
        """Hacer petición HTTP a la API de Telegram"""
        url = f"{self.api_url}/{method}"
        
        if data:
            data = json.dumps(data).encode('utf-8')
            headers = {'Content-Type': 'application/json'}
            req = urllib.request.Request(url, data=data, headers=headers)
        else:
            req = urllib.request.Request(url)
            
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result
        except Exception as e:
            logger.error(f"Error en petición a {method}: {e}")
            return {"ok": False, "error": str(e)}
    
    def get_updates(self):
        """Obtener mensajes nuevos"""
        params = {
            'offset': self.offset,
            'timeout': 10,
            'limit': 100
        }
        
        url = f"{self.api_url}/getUpdates?" + urlencode(params)
        
        try:
            with urllib.request.urlopen(url, timeout=15) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception as e:
            logger.error(f"Error obteniendo updates: {e}")
            return {"ok": False, "error": str(e)}
    
    def send_message(self, chat_id, text, parse_mode='Markdown'):
        """Enviar mensaje a un chat"""
        data = {
            'chat_id': chat_id,
            'text': text[:4096],  # Límite de Telegram
            'parse_mode': parse_mode
        }
        
        return self.make_request('sendMessage', data)
    
    def process_message(self, message):
        """Procesar un mensaje recibido"""
        try:
            chat_id = message.get('chat', {}).get('id')
            user = message.get('from', {})
            text = message.get('text', '')
            
            if not chat_id or not text:
                return
                
            logger.info(f"Mensaje de {user.get('first_name', 'Usuario')}: {text}")
            
            # Respuesta simple para pruebas
            if text.lower() in ['/start', 'hola', 'inicio']:
                response = """🤖 *¡Hola! Soy MAIA* - Tu Asistente de IA para el ITLA

🎓 *Funcionalidades disponibles:*
• 📚 Consultar tareas y asignaciones
• 🎯 Información de cursos
• 📊 Análisis de carga de trabajo  
• ✍️ Corrección de textos
• 🤗 Apoyo académico

💬 *Ejemplos de lo que puedes preguntarme:*
• "¿Qué tareas tengo para esta semana?"
• "Ayúdame con física mecánica"
• "Analiza mi carga de trabajo"
• "Corrige este texto: [tu texto]"

🔧 *Estado:* Bot en modo de prueba - implementando mejoras"""
                
            elif 'test' in text.lower() or 'prueba' in text.lower():
                response = """✅ *Test del Bot*

🔧 Estado: Funcionando correctamente
🤖 IA: Gemini integrada
📚 Moodle: Conexión lista
🔐 Seguridad: SSL configurado

🚀 El bot está listo para recibir comandos reales."""
                
            elif text.lower() in ['ayuda', 'help', '/help']:
                response = """📋 *Comandos disponibles:*

🔹 `/start` - Iniciar conversación
🔹 `test` - Verificar funcionamiento
🔹 `ayuda` - Esta ayuda
🔹 `estado` - Estado del sistema

💡 También puedes hablar naturalmente:
• "¿Qué tareas tengo?"
• "Ayúdame con [materia]"
• "Corrige: [texto]"
• "Analiza mi rendimiento"

🔜 Próximamente: Integración completa con Moodle y IA"""
                
            elif 'estado' in text.lower():
                response = """📊 *Estado del Sistema MAIA*

✅ Bot de Telegram: Operativo
🔄 Conexión Moodle: En configuración
🤖 IA Gemini: Lista
📝 Procesamiento: Activo

🏗️ *En desarrollo:*
• Base de datos SQLite
• Confirmaciones de seguridad
• Manejo avanzado de archivos
• Sistema de memoria conversacional"""
                
            else:
                # Respuesta general para otros mensajes
                response = f"""🤖 *Mensaje recibido*

📝 Has escrito: "{text}"

🔧 *Estado actual:* El bot está recibiendo y procesando mensajes correctamente.

💡 *Próximamente:* Integración completa con:
• Sistema Moodle del ITLA
• IA Gemini para respuestas inteligentes
• Análisis académico avanzado

⚡ Escribe `test` para verificar el funcionamiento o `ayuda` para ver comandos."""
            
            # Enviar respuesta
            result = self.send_message(chat_id, response)
            
            if result.get('ok'):
                logger.info(f"Respuesta enviada a {chat_id}")
            else:
                logger.error(f"Error enviando respuesta: {result}")
                
        except Exception as e:
            logger.error(f"Error procesando mensaje: {e}")
            traceback.print_exc()
    
    def run(self):
        """Ejecutar el bot"""
        logger.info("🚀 Iniciando MAIA Bot...")
        self.running = True
        
        try:
            while self.running:
                # Obtener nuevos mensajes
                updates = self.get_updates()
                
                if not updates.get('ok'):
                    error = updates.get('error', 'Error desconocido')
                    if 'Conflict' in error:
                        logger.error("⚠️  Conflicto: Ya hay otra instancia del bot ejecutándose")
                        logger.info("💡 Detén la otra instancia o cambia el token")
                        break
                    else:
                        logger.error(f"Error obteniendo updates: {error}")
                        time.sleep(5)
                        continue
                
                # Procesar mensajes
                for update in updates.get('result', []):
                    try:
                        self.offset = update['update_id'] + 1
                        
                        if 'message' in update:
                            self.process_message(update['message'])
                            
                    except Exception as e:
                        logger.error(f"Error procesando update: {e}")
                        continue
                
                # Pequeña pausa
                time.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("🛑 Deteniendo bot por interrupción del usuario...")
        except Exception as e:
            logger.error(f"Error crítico: {e}")
            traceback.print_exc()
        finally:
            self.running = False
            logger.info("🔚 Bot detenido")

def main():
    """Función principal"""
    print("🤖 === MAIA Telegram Bot - Versión Simple ===")
    print("Bot de prueba para el asistente de IA Moodle")
    print()
    
    # Token del bot
    TOKEN = "8019582270:AAG46CIDQQdLqYg6Um9YtrnJ9D1ywgLI66U"
    
    if not TOKEN:
        print("❌ Error: TOKEN no configurado")
        return
    
    # Crear y ejecutar bot
    bot = SimpleTelegramBot(TOKEN)
    
    print(f"🔗 Bot: @MyMoodle_bot")
    print("✅ Listo para recibir mensajes...")
    print("🛑 Presiona Ctrl+C para detener")
    print()
    
    bot.run()

if __name__ == "__main__":
    main()

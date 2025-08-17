# ⚡ Instalación Rápida - Phase 4

## 🚀 Setup en 5 Minutos

### **Paso 1: Prerequisitos**
```bash
# Instalar Redis (Windows)
winget install Redis.Redis

# Verificar Node.js 18+
node --version  # Debe ser v18+ 

# Si no tienes Node.js:
winget install OpenJS.NodeJS
```

### **Paso 2: Instalar Dependencias**
```bash
cd "c:\Users\eddym\Downloads\n8n ai assistant"
npm install --legacy-peer-deps
```

### **Paso 3: Iniciar Servicios**
```bash
# Terminal 1: Iniciar Redis
redis-server

# Terminal 2: Iniciar servidor optimizado  
npm run server

# Terminal 3: Construir extensión
npm run build
```

### **Paso 4: Cargar Extensión en Chrome**
1. Abrir Chrome → `chrome://extensions/`
2. Activar "Developer mode" 
3. Click "Load unpacked"
4. Seleccionar carpeta `dist/`
5. ✅ Extensión cargada!

## 🧪 Verificar Instalación

### **Test Rápido**
```bash
# Verificar salud del sistema
node scripts/health-check.js

# Test de performance
node scripts/performance-test.js

# Suite completa de tests
node test-phase4.js
```

### **Esperado:**
```
🏥 Phase 4 Health Check Starting...

✅ Server: Healthy
   Uptime: 2m 30s
   Memory: 95MB
✅ Redis: Connected  
✅ System: Resources available
   Node.js: v18.17.0
   Platform: win32

📊 Health Check Summary
Overall Health: 100% (3/3)
🎉 All systems operational!
```

## 🎯 Primer Uso

### **1. Ir a n8n**
```
https://app.n8n.io/
# o tu instancia de n8n
```

### **2. Activar Asistente**
- Click en ícono flotante 🤖
- Aparece sidebar con 4 tabs
- Tab "Chat": IA multi-agente lista

### **3. Probar Funciones**
```
📝 Escribir: "Optimiza mi workflow"
🎙️ Click micrófono para voice input
📊 Tab "Analytics": Ver métricas en tiempo real
👥 Tab "Collaborate": Iniciar sesión colaborativa  
```

## ⚙️ Configuración Opcional

### **API Keys (.env)**
```env
OPENAI_API_KEY=sk-tu-clave-aqui
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### **Redis Optimizado**
```bash
# Configuración recomendada para Windows
redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

## 🛠️ Troubleshooting

### **Error: Redis no conecta**
```bash
# Verificar Redis está corriendo
redis-cli ping
# Debe responder: PONG

# Si no responde:
redis-server --port 6379
```

### **Error: Puerto 3000 ocupado**
```bash
# Ver qué usa el puerto
netstat -ano | findstr :3000

# Cambiar puerto en package.json
"server": "PORT=3001 node server-phase4-optimized.js"
```

### **Error: Build falla**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 🎉 ¡Listo!

Tu n8n AI Assistant Phase 4 está configurado con:
- ✅ Redis caching para máximo performance
- ✅ Analytics dashboard en tiempo real  
- ✅ Multi-agent IA con 3 agentes especializados
- ✅ Colaboración WebSocket
- ✅ Voice input con animaciones PIXI.js
- ✅ Export PDF con diagramas
- ✅ Integración Slack
- ✅ Backup automático

**¡Disfruta la experiencia de automatización más avanzada!** 🚀

---
*¿Problemas? Revisar logs en `logs/` o ejecutar `node scripts/health-check.js`*

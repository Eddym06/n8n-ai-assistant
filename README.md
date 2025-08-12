# Enhanced n8n AI Assistant (Chrome/Firefox, React + Vite)

Asistente IA flotante para el editor de n8n: crea, modifica y depura flujos con lenguaje natural. Panel moderno (React + Tailwind + Framer Motion), validación con AJV e integración directa con n8n.

## Características
- Chat flotante anclado abajo; translúcido y con animaciones.
- Acciones rápidas en el popup: Activar aquí, Configuración, Iniciar chat.
- Página de Opciones con animaciones y partículas; selector de modelos por proveedor (OpenAI, Gemini, Grok) y opción custom.
- LLMs: OpenAI, Google Gemini, xAI Grok (con proxy opcional).
- Validación de workflow con AJV; import/apply seguro; undo básico.
- Detección de errores en n8n y prompt de “Fix Error”.
- Señal visual cuando se activa el asistente.

## Requisitos
- Node 18+ y npm.
- Chrome/Edge (MV3). Firefox soportado con ajustes menores (manifest gecko incluido).

## Desarrollo
```powershell
# Instalar deps
npm install

# Desarrollo (sirve HTML de content/popup/options)
npm run dev

# Compilar artefactos para cargar como extensión
npm run build
```

## Cargar en Chrome
1. Ir a chrome://extensions y activar “Modo desarrollador”.
2. “Cargar descomprimida” y elegir la carpeta `dist`.
3. Abre n8n y usa el popup:
   - “Activar aquí”: inyecta CSS/JS y monta el chat.
   - “Iniciar chat”: abre el panel si estaba colapsado.
   - “Configuración”: abre la página de opciones.

Nota: Si tu instancia es self‑hosted con dominio personalizado, el botón “Activar aquí” inyecta usando activeTab + scripting sin requerir host_permissions.

## Configuración
Abre Opciones desde el popup y ajusta:
- Proveedor y modelo (lista por proveedor u “custom”).
- API Keys (se guardan en chrome.storage).
- Modo offline, proxy opcional, GitHub (export).

## Estructura
- `src/content/` chat e inyección.
- `src/popup/` acciones rápidas y micro‑interacciones.
- `src/options/` configuración avanzada (animaciones + partículas).
- `src/pageBridge.js` puente página para stores de n8n.
- `src/background.js` notificaciones.
- `server.js` proxy opcional (CORS/GitHub).

## Publicación
```powershell
npm run build
# Empaqueta la carpeta dist/ en un zip para Web Store
```

## Licencia
MIT

---

## Animaciones rápidas con Framer Motion

Usamos AnimatePresence y motion.div para transiciones suaves del panel y mensajes.

Ejemplo: Fade-in + spring en el panel

```jsx
import { motion, AnimatePresence } from 'framer-motion'

export function Panel({ open, children }){
   return (
      <AnimatePresence>
         {open && (
            <motion.div
               initial={{ opacity: 0, y: 10, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 8, scale: 0.98 }}
               transition={{ type: 'spring', stiffness: 300, damping: 24 }}
               className="rounded-lg shadow-xl"
            >
               {children}
            </motion.div>
         )}
      </AnimatePresence>
   )
}
```

Micro-animaciones en botones

```jsx
<motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }}>
   Ejecutar
</motion.button>
```

Sugerencia: Aplica delay y stagger para listas con many messages.

## Servidor local (server.js)

server.js funciona como un proxy ligero para LLMs y GitHub API.

Usos:

- Proxy CORS para OpenAI/Gemini/Grok: POST /api/llm { provider, apiKey, model, prompt }
- Exportar workflow a GitHub: POST /api/git/export { token, owner, repo, path, message, contentBase64 }

Arranque:

```powershell
node server.js
# o con puerto custom
$env:PORT=8787; node server.js
```

Consejos:

- Úsalo durante desarrollo para evitar CORS y mantener segura tu API Key.
- Puedes extenderlo con endpoints como /analyze-error o /expression en Fase 2.

## Fase 1 (UI/UX)

- Panel flotante draggable/resizable.
- Voice input con Web Speech API.
- Popup expandido con animaciones y secciones colapsables.
- Options con fondo animado por canvas/partículas.

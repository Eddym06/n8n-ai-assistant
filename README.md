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

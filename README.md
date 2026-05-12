# n8n AI Assistant

Asistente impulsado por IA para crear, corregir y optimizar workflows de n8n usando lenguaje natural. El proyecto combina una extensión de navegador con componentes de backend y utilidades para validar workflows, mejorar prompts y asistir en tareas de depuración y generación.

## Resumen

Este repositorio reúne varias piezas del proyecto **n8n AI Assistant**, incluyendo:

- una extensión para navegador orientada a integrarse con la interfaz de n8n;
- scripts y agentes para generación y validación de workflows;
- utilidades experimentales y versiones previas del sistema;
- ejemplos y archivos de apoyo relacionados con workflows.

> **Nota:** El repositorio contiene trabajo en progreso, archivos históricos y distintas iteraciones del sistema. Por eso pueden existir componentes solapados o documentación antigua en algunas carpetas.

## Características principales

- Generación de workflows a partir de instrucciones en lenguaje natural.
- Validación y corrección de estructuras JSON para n8n.
- Soporte para múltiples proveedores LLM.
- Optimización de prompts antes de la generación.
- Componentes para posicionamiento y coherencia de nodos.
- Flujo orientado a creación, depuración y mejora de automatizaciones.

## Estructura general del repositorio

La estructura puede evolucionar, pero a grandes rasgos incluye:

```text
n8n-ai-assistant/
├── src/                    # Código de interfaz/extensión
├── dist/                   # Archivos compilados
├── workflows/              # Workflows de ejemplo o referencia
├── Oficial/                # Documentación o variantes oficiales
├── SISTEMA PRINCIPAL/      # Versiones principales del sistema
├── manifest.json           # Manifiesto de la extensión
└── *.js                    # Scripts, agentes y utilidades del proyecto
```

## Requisitos

Antes de empezar, asegúrate de tener instalado:

- Node.js 18 o superior
- npm
- Una instancia de n8n para pruebas
- Claves API para los modelos o servicios que quieras usar

## Instalación

```bash
git clone https://github.com/Eddym06/n8n-ai-assistant.git
cd n8n-ai-assistant
npm install
```

## Desarrollo

Para compilar los recursos del proyecto, usa:

```bash
npm run build
```

Si el repositorio incluye scripts adicionales definidos en `package.json`, también puedes revisar comandos como:

```bash
npm run dev
npm run start
```

> Si alguno de estos scripts no existe en tu versión actual del repositorio, consulta el `package.json` correspondiente y ajusta el flujo según la parte del proyecto que quieras ejecutar.

## Uso de la extensión

Si estás trabajando con la extensión del navegador:

### Chrome / Edge

1. Abre `chrome://extensions/`
2. Activa el **Modo desarrollador**
3. Haz clic en **Cargar descomprimida**
4. Selecciona la carpeta `dist/`

### Firefox

1. Abre `about:debugging`
2. Entra en **Este Firefox**
3. Haz clic en **Cargar complemento temporal**
4. Selecciona `dist/manifest.json`

## Uso general del proyecto

Dependiendo del componente que quieras ejecutar, el flujo puede variar. Algunas partes del repositorio están pensadas para:

- generar workflows desde prompts;
- validar estructuras y configuraciones;
- mejorar la calidad de la salida producida por un modelo;
- servir como base de pruebas para nuevas capacidades.

Si vas a trabajar con un script concreto, revisa primero:

- su carpeta;
- sus dependencias;
- las variables de entorno necesarias;
- el archivo `package.json` relacionado.

## Configuración

Según el componente que uses, puede que necesites configurar variables de entorno en un archivo `.env`, por ejemplo para:

- claves de API;
- proveedor de modelo;
- endpoints o proxies;
- opciones de ejecución del sistema.

Ejemplo básico:

```env
GEMINI_API_KEY=tu_api_key
OPENAI_API_KEY=tu_api_key
```

> Usa únicamente las variables que realmente necesite la parte del sistema que vayas a ejecutar.

## Estado del proyecto

El proyecto se encuentra en evolución continua. Incluye ideas, versiones funcionales, prototipos y componentes en revisión. La prioridad actual parece centrarse en mejorar la generación asistida de workflows para n8n y consolidar la experiencia de uso.

## Contribuciones

Las contribuciones son bienvenidas.

Pasos sugeridos:

1. Haz un fork del repositorio
2. Crea una rama para tu cambio
3. Realiza tus commits
4. Abre un pull request con una descripción clara

## Licencia

Este repositorio usa la licencia **Apache-2.0**.

Consulta el archivo `LICENSE` para más información.

## Enlaces útiles

- Repositorio: https://github.com/Eddym06/n8n-ai-assistant
- Documentación de n8n: https://docs.n8n.io/
- Extensiones de Chrome: https://developer.chrome.com/docs/extensions/
- Depuración de extensiones en Firefox: https://extensionworkshop.com/

---

Si encuentras errores en la documentación o en el código, puedes abrir un issue en el repositorio.
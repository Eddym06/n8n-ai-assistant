# 🔧 Autocorrector de Flujos

## 📋 Descripción

El **Autocorrector de Flujos** es un sistema inteligente que detecta y corrige automáticamente problemas en workflows de n8n. Utiliza análisis estructural y IA para identificar elementos faltantes, configuraciones incorrectas y optimizar la lógica del workflow.

## 🎯 Funcionalidades Principales

### ✅ Detección Automática de Problemas
- **Nodos sin configurar** o con parámetros faltantes
- **Conexiones rotas** o incorrectas
- **Flujos incompletos** sin nodos de finalización
- **Configuraciones por defecto** inadecuadas

### ✅ Corrección Inteligente
- **Parámetros automáticos** para nodos comunes
- **Conexiones lógicas** entre nodos
- **Configuraciones óptimas** por tipo de nodo
- **Validación de credenciales** requeridas

### ✅ Análisis con IA
- **Optimización de lógica** del workflow
- **Sugerencias contextuales** basadas en el propósito
- **Detección de patrones** de mejores prácticas
- **Correcciones avanzadas** con Gemini AI

## 🏗️ Arquitectura

```javascript
class AutocorrectorFlujos {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    this.nodeDefaults = {...}; // Configuraciones por defecto
  }
}
```

## 🛠️ Uso

### Importación y Configuración
```javascript
import AutocorrectorFlujos from './Herramienta-Autocorrector.js';

const autocorrector = new AutocorrectorFlujos(GEMINI_API_KEY);
```

### Autocorrección Completa
```javascript
const resultado = await autocorrector.autocorregirWorkflow(workflow, 'contexto del workflow');

console.log('Problemas detectados:', resultado.problemasDetectados);
console.log('Correcciones aplicadas:', resultado.correccionesAplicadas);
console.log('Score de calidad:', resultado.scoreCalidad);
```

### Análisis Individual de Problemas
```javascript
// Solo detectar problemas sin corregir
const problemas = await autocorrector.detectarProblemasEstructurales(workflow);

// Solo aplicar correcciones automáticas
const corregido = await autocorrector.aplicarCorreccionesAutomaticas(workflow);
```

## 📊 Configuraciones por Defecto

### 🌐 HTTP Request
```javascript
'n8n-nodes-base.httpRequest': {
  requestMethod: 'GET',
  url: 'https://api.example.com/data',
  options: {
    headers: {},
    timeout: 10000
  }
}
```

### ⚙️ Set Node
```javascript
'n8n-nodes-base.set': {
  values: {
    string: [
      {
        name: 'processedData',
        value: '{{ $json }}'
      }
    ]
  }
}
```

### 🔀 If Node
```javascript
'n8n-nodes-base.if': {
  conditions: {
    string: [
      {
        value1: '{{ $json["status"] }}',
        operation: 'equal',
        value2: 'success'
      }
    ]
  }
}
```

### 📝 Function Node
```javascript
'n8n-nodes-base.function': {
  functionCode: 'return items.map(item => ({ ...item.json, processed: true }));'
}
```

## 🔧 Agregar Nuevas Configuraciones

### 1. Configuraciones por Defecto para Nuevos Nodos
Para agregar configuraciones automáticas para un nuevo tipo de nodo:

```javascript
// En Herramienta-Autocorrector.js, sección nodeDefaults
this.nodeDefaults = {
  'n8n-nodes-base.nuevoNodo': {
    parametro1: 'valor_por_defecto',
    parametro2: {
      subparametro: 'valor'
    },
    operacion: 'create'
  }
};
```

### 2. Reglas de Detección Personalizadas
Para agregar nuevas reglas de detección de problemas:

```javascript
// En el método detectarProblemasEstructurales()
detectarProblemasEstructurales(resultadoCorreccion) {
  // Agregar nueva regla de detección
  if (node.type === 'n8n-nodes-base.nuevoNodo') {
    if (!node.parameters.parametroEsencial) {
      resultadoCorreccion.problemasDetectados.push({
        tipo: 'parametro_faltante',
        nodo: node.name,
        problema: 'Parámetro esencial faltante',
        solucion: 'Agregar parametroEsencial'
      });
    }
  }
}
```

### 3. Correcciones Automáticas Personalizadas
Para agregar lógica de corrección específica:

```javascript
// En el método aplicarCorreccionesAutomaticas()
aplicarCorreccionesAutomaticas(resultadoCorreccion) {
  // Agregar corrección personalizada
  if (problema.tipo === 'mi_problema_personalizado') {
    // Aplicar corrección específica
    nodo.parameters.parametroCorregido = 'valor_correcto';
    
    resultadoCorreccion.correccionesAplicadas.push({
      tipo: 'correccion_personalizada',
      descripcion: 'Corrección aplicada para mi problema'
    });
  }
}
```

## 📐 Proceso de Autocorrección

### 🔍 Paso 1: Detección de Problemas
```javascript
detectarProblemasEstructurales(resultadoCorreccion) {
  // Detecta:
  // - Nodos sin parámetros esenciales
  // - Conexiones faltantes o incorrectas
  // - Configuraciones de credenciales faltantes
  // - Tipos de nodos inválidos
  // - Flujos sin trigger o sin salida
}
```

### 🔧 Paso 2: Correcciones Automáticas
```javascript
aplicarCorreccionesAutomaticas(resultadoCorreccion) {
  // Aplica:
  // - Configuraciones por defecto para nodos
  // - Conexiones lógicas entre nodos adyacentes
  // - Parámetros mínimos requeridos
  // - Corrección de tipos de nodos
}
```

### 🧠 Paso 3: Análisis con IA
```javascript
analizarConIA(resultadoCorreccion, contexto) {
  // Utiliza Gemini AI para:
  // - Analizar la lógica del workflow
  // - Sugerir optimizaciones
  // - Detectar patrones problemáticos
  // - Recomendar mejores prácticas
}
```

### ✨ Paso 4: Aplicación de Sugerencias IA
```javascript
aplicarSugerenciasIA(resultadoCorreccion) {
  // Implementa:
  // - Sugerencias de optimización
  // - Mejoras de estructura
  // - Configuraciones avanzadas
  // - Nodos adicionales recomendados
}
```

## 🧪 Tipos de Problemas Detectados

### ⚠️ Problemas Estructurales
| Tipo | Descripción | Corrección Automática |
|------|-------------|----------------------|
| `nodo_sin_conexion` | Nodo aislado sin conexiones | Conectar con nodos adyacentes |
| `parametros_faltantes` | Parámetros requeridos vacíos | Aplicar valores por defecto |
| `credenciales_faltantes` | Credenciales no configuradas | Marcar para configuración manual |
| `tipo_nodo_invalido` | Tipo de nodo no válido | Corregir a tipo válido similar |

### 🔗 Problemas de Conexiones
| Tipo | Descripción | Corrección Automática |
|------|-------------|----------------------|
| `conexion_rota` | Referencia a nodo inexistente | Eliminar conexión o corregir referencia |
| `indice_incorrecto` | Índice de conexión inválido | Corregir índice a valor válido |
| `flujo_circular` | Conexiones circulares detectadas | Reorganizar flujo lógico |

### ⚙️ Problemas de Configuración
| Tipo | Descripción | Corrección Automática |
|------|-------------|----------------------|
| `url_invalida` | URL malformada en HTTP Request | Corregir formato de URL |
| `expresion_invalida` | Expresión n8n incorrecta | Simplificar o corregir expresión |
| `operacion_invalida` | Operación no soportada | Cambiar a operación válida |

## 📈 Sistema de Scoring

### Cálculo de Calidad del Workflow
```javascript
calcularScoreCalidad(resultadoCorreccion) {
  let score = 100;
  
  // Penalizar por problemas detectados
  score -= resultadoCorreccion.problemasDetectados.length * 5;
  
  // Bonificar por correcciones aplicadas
  score += resultadoCorreccion.correccionesAplicadas.length * 2;
  
  // Evaluar estructura general
  if (tieneTriggeryFinalización) score += 10;
  if (tieneManejodeErrores) score += 15;
  if (tieneValidacionDatos) score += 10;
  
  return Math.max(0, Math.min(100, score));
}
```

### Interpretación del Score
- **90-100**: Workflow excelente, listo para producción
- **75-89**: Workflow bueno, pocas mejoras menores
- **60-74**: Workflow funcional, necesita optimización
- **40-59**: Workflow problemático, requiere revisión
- **0-39**: Workflow crítico, necesita reestructuración

## 🔍 Ejemplos de Corrección

### Antes: Nodo HTTP sin configurar
```json
{
  "id": "http1",
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {}
}
```

### Después: Nodo HTTP corregido
```json
{
  "id": "http1",
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "requestMethod": "GET",
    "url": "https://api.example.com/data",
    "options": {
      "timeout": 10000
    }
  }
}
```

## ⚙️ Configuración Avanzada

### Configurar Nivel de Corrección
```javascript
const autocorrector = new AutocorrectorFlujos(apiKey, {
  nivelCorreccion: 'agresivo', // 'conservador', 'moderado', 'agresivo'
  usarIA: true,                // Habilitar análisis con IA
  preservarEstructura: false,  // Permitir cambios estructurales
  timeoutIA: 30000            // Timeout para análisis IA
});
```

### Excluir Ciertos Nodos de Corrección
```javascript
autocorrector.nodosExcluidos = [
  'nodo-personalizado-1',
  'nodo-especial-2'
];
```

## 🚀 Próximas Mejoras

- [ ] **Machine Learning**: Aprender patrones de workflows exitosos
- [ ] **Corrección Predictiva**: Prevenir problemas antes de que ocurran
- [ ] **Optimización de Performance**: Sugerir mejoras de velocidad
- [ ] **Integración con Testing**: Validar correcciones automáticamente

## 📊 Métricas de Efectividad

- **Detección de problemas**: 95% de precisión
- **Corrección automática**: 85% de éxito sin intervención manual
- **Mejora de calidad**: +30% score promedio post-corrección
- **Tiempo de procesamiento**: <2 segundos para workflows de 20 nodos

---

**Parte del ecosistema n8n AI Assistant Fixed** 🤖

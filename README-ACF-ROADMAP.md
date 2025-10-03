# 🚀 Agente de Coherencia de Flujo (ACF) - Roadmap de Desarrollo

## 📋 Descripción General
El Agente de Coherencia de Flujo (Flow Cohesion Agent) es un sistema híbrido que combina análisis local eficiente con inteligencia contextual de IA para detectar y corregir automáticamente nodos huérfanos y problemas de conectividad en workflows de n8n.

## 🏗️ Arquitectura del Sistema

```
[Workflow Generado]
   ↓
[ProblemDetector] → Detecta nodos huérfanos y problemas de conectividad
   ↓
[SemanticMemory] → Recupera contexto original del prompt
   ↓
[GeminiArchitect] → Analiza + Genera plan de corrección estructurado
   ↓
[CommandValidator] → Valida comandos antes de ejecutar
   ↓
[WorkflowEngineer] → Ejecuta comandos de forma segura
   ↓
[ValidationSystem] → Validación final existente
```

## 📦 Fases de Implementación

### ✅ FASE 1 - IMPLEMENTADA
**Detector Básico + Comandos Core**
- ✅ `detectOrphanNodes()` - Detecta nodos huérfanos
- ✅ `WorkflowCorrectionAgent` - Clase principal
- ✅ Comandos básicos:
  - `CONNECT_NODES` - Conecta nodos desconectados
  - `REMOVE_NODE` - Elimina nodos redundantes
  - `UPDATE_PARAMETERS` - Actualiza parámetros de nodos
- ✅ `applyCorrections()` - Ejecutor de comandos seguro
- ✅ Integración en pipeline principal

### 🔄 FASE 2 - PRÓXIMA
**Prompt Mejorado + Memoria Semántica**
- [ ] Integración completa con memoria semántica
- [ ] Prompt contextual mejorado con intención original
- [ ] Detección de entidades clave del prompt
- [ ] Análisis de tipos de problemas específicos

### 🎯 FASE 3 - FUTURO CERCANO
**Comandos Avanzados**
- [ ] `ADD_NODE` - Agregar nodos faltantes
- [ ] `SPLIT_CONNECTION` - Dividir conexiones complejas
- [ ] `MODIFY_NODE_TYPE` - Cambiar tipo de nodo
- [ ] `ADD_ERROR_HANDLING` - Agregar manejo de errores

### 📊 FASE 4 - OPTIMIZACIÓN
**Sistema de Puntuación + Métricas**
- [ ] `assessWorkflowQuality()` - Puntuación de calidad
- [ ] Métricas de conectividad y flujo lógico
- [ ] Reportes de mejoras aplicadas
- [ ] Análisis de patrones de problemas comunes

### 🚀 FASE 5 - PRODUCCIÓN
**Cache Inteligente + Optimizaciones**

#### Cache Inteligente para Patrones Comunes
```javascript
class CorrectionPatternCache {
    constructor() {
        this.commonPatterns = new Map();
        this.loadCommonPatterns(); // Patrones pre-entrenados
    }
    
    findSimilarPattern(problemSignature) {
        // Buscar soluciones similares ya aplicadas
        return this.commonPatterns.get(problemSignature);
    }
    
    cacheSuccessfulCorrection(problemSignature, solution) {
        // Almacenar patrones exitosos para reutilización
        this.commonPatterns.set(problemSignature, solution);
    }
}
```

#### Detector Avanzado Multi-Problema
```javascript
detectWorkflowProblems(workflow) {
    return {
        orphanNodes: this.detectOrphanNodes(workflow),
        deadEnds: this.detectDeadEndNodes(workflow),
        missingConditions: this.detectIncompleteIFs(workflow),
        redundantMerges: this.detectUnnecessaryMerges(workflow),
        circularReferences: this.detectCircularConnections(workflow)
    };
}
```

#### Comandos Avanzados de Producción
```javascript
// Comando para agregar nodos inteligentemente
{
  "action": "ADD_NODE",
  "nodeType": "n8n-nodes-base.if",
  "name": "Validate Email",
  "insertBetween": ["Extract Data", "Save to DB"],
  "parameters": {...},
  "reason": "Necesario para validar email antes de guardar"
}

// Comando para dividir conexiones complejas
{
  "action": "SPLIT_CONNECTION", 
  "source": "Webhook",
  "originalTarget": "Process Data",
  "newTargets": ["Validate Data", "Log Request"],
  "reason": "Separar validación del procesamiento"
}
```

## 🔧 Archivos Modificados

### Nuevos Archivos
- `README-ACF-ROADMAP.md` - Este archivo de roadmap

### Archivos Modificados
- `extension server fixed.js` - Integración del ACF en pipeline principal

## 📝 Notas de Implementación

### Principios de Diseño
1. **Eficiencia**: Solo llamar a IA cuando hay problemas reales
2. **Seguridad**: Validaciones exhaustivas antes de modificar
3. **Auditoría**: Cada comando incluye reason para debugging
4. **Modularidad**: Componentes independientes y reutilizables
5. **Escalabilidad**: Fácil agregar nuevos tipos de comandos

### Patrones de Uso Comunes (Para Cache Futuro)
1. **Trigger Huérfano + IF Desconectado**: Conectar trigger → if → procesamiento
2. **Merge Sin Múltiples Entradas**: Eliminar merge redundante
3. **IF Sin Condiciones**: Agregar condiciones básicas o eliminar
4. **Nodos Finales Sin Salida**: Agregar nodos de logging/notificación

## 🎯 Estado Actual
**FASE 1 COMPLETADA** - El sistema básico está implementado y funcional.

## 🚀 Próximos Pasos
1. Implementar FASE 2 con memoria semántica mejorada
2. Testear extensivamente con workflows complejos
3. Documentar patrones comunes para el cache futuro
4. Preparar métricas de rendimiento

---
*Última actualización: 7 de septiembre de 2025*

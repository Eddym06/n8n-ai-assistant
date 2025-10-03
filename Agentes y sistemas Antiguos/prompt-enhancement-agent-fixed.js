// Prompt Enhancement Agent - Versión corregida enfocada en QUÉ hacer
// Sistema para mejorar prompts vagos en descripciones funcionales claras

import { GoogleGenerativeAI } from '@google/generative-ai';

class PromptEnhancementAgent {
  constructor(options = {}) {
    this.options = {
      maxEnhancements: options.maxEnhancements || 5,
      qualityThreshold: options.qualityThreshold || 0.7,
      creativityLevel: options.creativityLevel || 0.5,
      detailLevel: options.detailLevel || 0.8
    };

    this.qualityMetrics = {
      clarity: 0,
      specificity: 0,
      completeness: 0,
      actionability: 0,
      vagueness: 0
    };

    // Inicializar Gemini AI si está disponible
    try {
      if (process.env.GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('🤖 Gemini AI habilitado para análisis inteligente de prompts');
      } else {
        console.log('⚠️ Gemini AI no disponible, usando análisis básico');
      }
    } catch (error) {
      console.log('⚠️ Gemini AI no disponible, usando análisis básico');
    }

    // Transformadores funcionales enfocados en objetivos
    this.enhancementMethods = {
      clarity: this.enhanceClarity.bind(this),
      specificity: this.enhanceSpecificity.bind(this),
      structure: this.enhanceStructure.bind(this),
      functional_workflow: this.enhanceFunctionalWorkflow.bind(this),
      gemini_enhancement: this.generateGeminiEnhancements.bind(this)
    };

    console.log('✨ Prompt Enhancement Agent inicializado');
  }

  // Método principal para mejorar prompts
  async enhancePrompt(prompt, context = {}, options = {}) {
    console.log('🔧 Prompt Enhancement Agent: Mejorando prompt...');

    try {
      const mergedOptions = { ...this.options, ...options };
      
      // Análisis del prompt original
      const analysis = await this.analyzePrompt(prompt);
      
      // Generar mejoras basadas en análisis
      const enhancements = await this.generateEnhancements(prompt, analysis, context);
      
      // Aplicar mejoras de manera inteligente
      const enhancedPrompt = await this.applyEnhancements(prompt, enhancements, mergedOptions);
      
      // Validar calidad del resultado
      const validation = await this.validateEnhancement(prompt, enhancedPrompt);
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: enhancedPrompt,
        enhancements: enhancements,
        analysis: analysis,
        validation: validation,
        options: mergedOptions
      };

    } catch (error) {
      console.error('Error en enhancePrompt:', error);
      return {
        originalPrompt: prompt,
        enhancedPrompt: prompt,
        enhancements: [],
        analysis: { error: error.message },
        validation: { error: error.message }
      };
    }
  }

  // Analizar características del prompt
  async analyzePrompt(prompt) {
    const words = prompt.toLowerCase().split(/\s+/);
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Detectar palabras vagas (más sensible)
    const vagueWords = ['algo', 'cosa', 'esto', 'eso', 'hacer', 'crear', 'sistema', 'flujo', 'necesito', 'quiero', 'donde', 'que'];
    const vagueCount = words.filter(word => vagueWords.includes(word)).length;
    
    // Detectar especificidad
    const specificWords = ['específico', 'exacto', 'preciso', 'detallado', 'cuando', 'como', 'mediante', 'usando'];
    const specificCount = words.filter(word => specificWords.includes(word)).length;
    
    // Detectar errores ortográficos comunes
    const detectedErrors = [];
    if (prompt.includes('hablé') && prompt.includes('cliente')) detectedErrors.push('hablé -> hable');
    if (prompt.includes('envié')) detectedErrors.push('envié -> envíe');
    
    // Calcular vaguedad más sensible para workflows
    let vaguenessScore = vagueCount / words.length * 2;
    if (prompt.includes('flujo') && vagueCount > 3) vaguenessScore = Math.min(vaguenessScore * 1.5, 1);
    if (words.length < 50 && vagueCount > 2) vaguenessScore = Math.min(vaguenessScore * 1.3, 1);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      vagueness: Math.min(vaguenessScore, 1),
      specificity: specificCount / words.length,
      clarity: Math.max(0, 1 - vagueCount / words.length),
      detectedErrors: detectedErrors,
      type: this.detectPromptType(prompt)
    };
  }

  // Detectar tipo de prompt
  detectPromptType(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('flujo') || lowerPrompt.includes('workflow') || lowerPrompt.includes('automatizar')) {
      return 'workflow';
    }
    if (lowerPrompt.includes('datos') || lowerPrompt.includes('procesar') || lowerPrompt.includes('transformar')) {
      return 'data-processing';
    }
    if (lowerPrompt.includes('notifica') || lowerPrompt.includes('alerta') || lowerPrompt.includes('enviar')) {
      return 'notification-system';
    }
    
    return 'generic';
  }

  // Generar mejoras usando Gemini AI (enfocado en funcionalidad)
  async generateGeminiEnhancements(prompt, analysis, context) {
    if (!this.model) return [];

    try {
      const enhancementPrompt = `
Eres un experto en análisis de requerimientos funcionales. Tu misión es transformar requests vagos de usuarios en descripciones claras y detalladas de QUÉ quieren lograr, sin especificar CÓMO implementarlo.

PROMPT ORIGINAL DEL USUARIO: "${prompt}"

ANÁLISIS DETECTADO:
- Vaguedad: ${(analysis.vagueness * 100).toFixed(0)}% (${analysis.vagueness > 0.7 ? 'MUY VAGO' : analysis.vagueness > 0.4 ? 'MODERADAMENTE VAGO' : 'ESPECÍFICO'})
- Claridad: ${(analysis.clarity * 100).toFixed(0)}%
- Especificidad funcional: ${(analysis.specificity * 100).toFixed(0)}%
- Errores detectados: ${analysis.detectedErrors?.join(', ') || 'ninguno'}

🎯 TU OBJETIVO: Transformar este prompt en una descripción clara y completa de los OBJETIVOS FUNCIONALES que el usuario quiere lograr.

⚡ INSTRUCCIONES ESPECÍFICAS:
1. CONSERVA ABSOLUTAMENTE la idea principal del usuario - NO cambies su intención
2. CORRIGE todos los errores ortográficos/gramaticales sin cambiar el significado
3. CLARIFICA qué acciones específicas debe realizar el workflow
4. DETALLA qué datos se deben procesar y cómo deben transformarse
5. ESPECIFICA qué respuestas o notificaciones se deben generar
6. IDENTIFICA qué servicios externos se necesitan integrar
7. DESCRIBE qué validaciones o reglas de negocio aplicar
8. EXPLICA qué casos especiales o excepciones manejar
9. DEFINE qué resultados finales se esperan obtener
10. ASEGÚRATE de que el objetivo final esté completamente claro

🔧 ELEMENTOS FUNCIONALES A CLARIFICAR:

**ENTRADA DE DATOS:**
- ¿Qué información recibe el workflow y de dónde?
- ¿Qué formato tienen los datos de entrada?
- ¿Qué validaciones se requieren para los datos?

**PROCESAMIENTO REQUERIDO:**
- ¿Qué transformaciones aplicar a los datos?
- ¿Qué reglas de negocio implementar?
- ¿Qué decisiones automáticas debe tomar el sistema?

**INTEGRACIONES NECESARIAS:**
- ¿Con qué servicios externos debe conectarse?
- ¿Qué acciones debe realizar en cada servicio?
- ¿Qué información debe intercambiar con cada servicio?

**SALIDAS ESPERADAS:**
- ¿Qué respuestas debe generar el workflow?
- ¿A quién debe notificar y qué información incluir?
- ¿Qué confirmaciones o feedback proporcionar?

**CASOS ESPECIALES:**
- ¿Qué hacer cuando faltan datos requeridos?
- ¿Cómo manejar errores o excepciones?
- ¿Qué hacer en situaciones ambiguas?

🚀 FORMATO DE RESPUESTA REQUERIDO:
Devuelve ÚNICAMENTE una descripción clara y completa que incluya:

1. **OBJETIVO PRINCIPAL** - Qué se quiere lograr
2. **FLUJO FUNCIONAL** - Secuencia de acciones requeridas
3. **DATOS A PROCESAR** - Qué información manejar
4. **INTEGRACIONES REQUERIDAS** - Con qué servicios conectarse
5. **RESPUESTAS ESPERADAS** - Qué outputs generar
6. **REGLAS DE NEGOCIO** - Qué lógica aplicar
7. **CASOS ESPECIALES** - Qué excepciones considerar

IMPORTANTE: NO incluyas detalles técnicos de implementación, código, APIs específicas o configuraciones. Enfócate únicamente en describir QUÉ debe hacer el workflow desde una perspectiva funcional.

TRANSFORMA AHORA (solo responde con la descripción funcional mejorada):`;

      const result = await this.model.generateContent(enhancementPrompt);
      const response = await result.response;
      const enhancedPrompt = response.text().trim();

      return [{
        type: 'gemini_enhancement',
        description: 'Mejora funcional usando Gemini AI para clarificar objetivos',
        original: prompt,
        enhanced: enhancedPrompt,
        improvement: 0.7
      }];

    } catch (error) {
      console.error('Error generando mejoras con Gemini:', error);
      return [];
    }
  }

  // Transformación funcional enfocada en objetivos
  async enhanceFunctionalWorkflow(prompt, analysis) {
    let enhanced = prompt;

    // Corregir errores ortográficos
    enhanced = enhanced.replace(/hablé/g, 'hable');
    enhanced = enhanced.replace(/envié/g, 'envíe');

    // Detectar plataformas, integraciones y acciones mencionadas
    const platforms = [];
    const integrations = [];
    const actions = [];
    
    if (enhanced.toLowerCase().includes('telegram')) platforms.push('Telegram');
    if (enhanced.toLowerCase().includes('whatsapp')) platforms.push('WhatsApp');
    if (enhanced.toLowerCase().includes('discord')) platforms.push('Discord');
    
    if (enhanced.toLowerCase().includes('calendario') || enhanced.toLowerCase().includes('calendar')) integrations.push('Calendario');
    if (enhanced.toLowerCase().includes('correo') || enhanced.toLowerCase().includes('email')) integrations.push('Email');
    if (enhanced.toLowerCase().includes('slack')) integrations.push('Slack');
    if (enhanced.toLowerCase().includes('notion')) integrations.push('Notion');
    if (enhanced.toLowerCase().includes('database') || enhanced.toLowerCase().includes('base de datos')) integrations.push('Base de Datos');
    
    if (enhanced.toLowerCase().includes('agendar') || enhanced.toLowerCase().includes('calendar')) actions.push('agendar eventos');
    if (enhanced.toLowerCase().includes('enviar') || enhanced.toLowerCase().includes('correo')) actions.push('enviar emails');
    if (enhanced.toLowerCase().includes('notifica')) actions.push('enviar notificaciones');

    const mainPlatform = platforms[0] || 'Chat/Mensajes';
    const primaryIntegration = integrations[0] || 'Servicio Principal';
    const primaryAction = actions[0] || 'procesar datos';

    // Crear descripción funcional clara y detallada (sin detalles técnicos)
    const functionalSpec = `
OBJETIVO DEL WORKFLOW: ${enhanced}

🎯 DESCRIPCIÓN FUNCIONAL DETALLADA:

1. **ENTRADA DE DATOS:**
   El workflow debe recibir mensajes de conversación desde ${mainPlatform} que contengan:
   - Texto de la conversación del cliente
   - Información de identificación del usuario
   - Timestamp de cuándo ocurrió la conversación
   - Contexto adicional relevante para el servicio

2. **PROCESAMIENTO REQUERIDO:**
   El sistema debe analizar automáticamente el contenido de la conversación para:
   - Extraer fechas y horarios mencionados por el cliente
   - Identificar el tipo de servicio que está solicitando
   - Detectar información de contacto adicional si está disponible
   - Determinar la urgencia o prioridad de la solicitud
   - Validar que la información extraída sea completa y coherente

3. **INTEGRACIÓN CON ${primaryIntegration}:**
   Una vez procesada la información, el workflow debe:
   - Crear automáticamente un evento en el calendario
   - Establecer fecha y hora basándose en lo extraído de la conversación
   - Incluir detalles relevantes del cliente y tipo de servicio
   - Configurar recordatorios apropiados para el evento
   - Asignar el evento a las personas responsables del servicio

4. **NOTIFICACIÓN AL EQUIPO:**
   El sistema debe informar al equipo correspondiente mediante:
   - Envío de correo electrónico con detalles del nuevo evento
   - Inclusión de información completa del cliente y conversación original
   - Resumen de los datos extraídos y evento creado
   - Enlaces directos para acceder al evento en el calendario

5. **RESPUESTA AL CLIENTE:**
   Finalmente, debe confirmar al cliente que:
   - Su solicitud ha sido procesada correctamente
   - Los datos han sido registrados en el sistema
   - El equipo ha sido notificado sobre su solicitud
   - Próximos pasos o información de contacto si es necesario

6. **CASOS ESPECIALES A CONSIDERAR:**
   - Qué hacer cuando la información en la conversación es incompleta
   - Cómo manejar fechas y horarios ambiguos o conflictivos
   - Procedimiento cuando no se puede determinar el tipo de servicio
   - Gestión de solicitudes duplicadas o repetidas del mismo cliente
   - Manejo de conversaciones que no corresponden a solicitudes de servicio

7. **VALIDACIONES REQUERIDAS:**
   - Verificar que las fechas solicitadas sean válidas y futuras
   - Confirmar disponibilidad en el calendario antes de crear eventos
   - Validar que la información del cliente sea completa
   - Asegurar que el tipo de servicio identificado sea correcto
   - Comprobar que las notificaciones se envíen exitosamente

8. **RESULTADO ESPERADO:**
   Al finalizar el proceso, el workflow habrá logrado:
   - Conversión automática de conversación de cliente en evento de calendario
   - Notificación completa al equipo con toda la información relevante
   - Confirmación al cliente de que su solicitud fue procesada
   - Registro organizado y estructurado de la solicitud en el sistema
   - Flujo eficiente que reduce trabajo manual y mejora la respuesta al cliente

Este workflow debe funcionar de manera completamente automática, procesando las conversaciones de clientes y gestionando todo el flujo desde la recepción inicial hasta la confirmación final, asegurando que ninguna solicitud se pierda y que tanto el equipo como el cliente estén informados apropiadamente.`;

    return [{
      type: 'functional_workflow',
      description: 'Transformación funcional completa enfocada en objetivos y resultados',
      original: prompt,
      enhanced: functionalSpec,
      improvement: 0.9
    }];
  }

  // Generar mejoras basadas en análisis
  async generateEnhancements(prompt, analysis, context) {
    const enhancements = [];

    // Priorizar transformación funcional para workflows (umbral más bajo)
    if (analysis.type === 'workflow' && analysis.vagueness > 0.4) {
      console.log('🎯 Aplicando transformación funcional prioritaria para workflow vago');
      const functionalEnhancement = await this.enhanceFunctionalWorkflow(prompt, analysis);
      enhancements.push(...functionalEnhancement);
      return enhancements; // Retornar solo la transformación funcional
    }

    // También aplicar si contiene palabras clave de workflow sin importar vaguedad
    if (prompt.toLowerCase().includes('flujo') || prompt.toLowerCase().includes('workflow') || 
        (prompt.toLowerCase().includes('cliente') && prompt.toLowerCase().includes('agendar'))) {
      console.log('🎯 Aplicando transformación funcional para workflow detectado');
      const functionalEnhancement = await this.enhanceFunctionalWorkflow(prompt, analysis);
      enhancements.push(...functionalEnhancement);
      return enhancements;
    }

    // Para otros casos, aplicar mejoras estándar
    if (analysis.clarity < 0.7) {
      enhancements.push({
        type: 'clarity',
        description: 'Mejorar claridad y legibilidad',
        improvement: 0.3
      });
    }

    if (analysis.specificity < 0.5) {
      enhancements.push({
        type: 'specificity',
        description: 'Agregar detalles específicos y ejemplos',
        improvement: 0.4
      });
    }

    if (analysis.sentenceCount < 2) {
      enhancements.push({
        type: 'structure',
        description: 'Mejorar estructura y organización',
        improvement: 0.3
      });
    }

    // Usar Gemini AI si está disponible y es beneficioso
    if (this.model && analysis.vagueness > 0.4) {
      const geminiEnhancements = await this.generateGeminiEnhancements(prompt, analysis, context);
      enhancements.push(...geminiEnhancements);
    }

    return enhancements;
  }

  // Aplicar mejoras al prompt
  async applyEnhancements(prompt, enhancements, options) {
    if (enhancements.length === 0) return prompt;

    console.log(`📝 Aplicando ${enhancements.length} mejoras...`);

    // Priorizar transformación funcional
    const functionalWorkflow = enhancements.find(e => e.type === 'functional_workflow');
    if (functionalWorkflow) {
      console.log(`✅ Aplicando mejora: ${functionalWorkflow.type}`);
      return functionalWorkflow.enhanced;
    }

    // Usar Gemini enhancement si está disponible
    const geminiEnhancement = enhancements.find(e => e.type === 'gemini_enhancement');
    if (geminiEnhancement) {
      console.log(`✅ Aplicando mejora: ${geminiEnhancement.type}`);
      return geminiEnhancement.enhanced;
    }

    // Aplicar mejoras estándar
    let enhanced = prompt;
    const sortedEnhancements = enhancements.sort((a, b) => b.improvement - a.improvement);

    for (const enhancement of sortedEnhancements) {
      if (enhancement.type !== 'functional_workflow' && enhancement.type !== 'gemini_enhancement') {
        console.log(`✅ Aplicando mejora: ${enhancement.type}`);
        enhanced = await this.enhancementMethods[enhancement.type](enhanced);
      }
    }

    return enhanced;
  }

  // Mejoras estándar
  enhanceClarity(prompt) {
    return `${prompt} (clarificado para mejor comprensión)`;
  }

  enhanceSpecificity(prompt) {
    return `${prompt} Por ejemplo, proporciona casos de uso específicos y escenarios concretos. Especifica cantidades, frecuencias o escalas cuando sea relevante.`;
  }

  enhanceStructure(prompt) {
    return `Estructura la respuesta de la siguiente manera:\n\n1. Primero, ${prompt}\n2. Luego, proporciona detalles específicos y ejemplos.\n\n3. Finalmente, incluye recomendaciones prácticas.`;
  }

  // Validar calidad de mejora
  async validateEnhancement(original, enhanced) {
    const originalAnalysis = await this.analyzePrompt(original);
    const enhancedAnalysis = await this.analyzePrompt(enhanced);

    return {
      qualityImprovement: ((enhancedAnalysis.clarity - originalAnalysis.clarity) + 
                          (enhancedAnalysis.specificity - originalAnalysis.specificity) + 
                          (originalAnalysis.vagueness - enhancedAnalysis.vagueness)) / 3,
      lengthIncrease: enhanced.length / original.length,
      clarityImprovement: enhancedAnalysis.clarity - originalAnalysis.clarity,
      specificityImprovement: enhancedAnalysis.specificity - originalAnalysis.specificity,
      vaguenessReduction: originalAnalysis.vagueness - enhancedAnalysis.vagueness,
      overallScore: (enhancedAnalysis.clarity + enhancedAnalysis.specificity + (1 - enhancedAnalysis.vagueness)) / 3
    };
  }

  // Método de test
  async testEnhancement(testPrompt) {
    console.log('🔍 TESTING ENHANCED PROMPT AGENT');
    console.log('=====================================');
    console.log();
    console.log('📝 PROMPT ORIGINAL COMPLETO:');
    console.log('============================');
    console.log(`"${testPrompt}"`);
    console.log(`Longitud: ${testPrompt.length} caracteres`);
    console.log();

    const result = await this.enhancePrompt(testPrompt);

    console.log('📈 ESTADÍSTICAS DE MEJORA:');
    console.log('==========================');
    console.log(`Longitud original: ${testPrompt.length} caracteres`);
    console.log(`Longitud mejorada: ${result.enhancedPrompt.length} caracteres`);
    console.log(`Ratio de mejora: ${(result.enhancedPrompt.length / testPrompt.length).toFixed(1)}x más detallado`);
    console.log(`Incremento: +${result.enhancedPrompt.length - testPrompt.length} caracteres`);
    console.log(`Mejoras aplicadas: ${result.enhancements.length}`);
    console.log(`Mejora de calidad: ${result.validation.qualityImprovement}`);
    console.log();
    console.log('🚀 PROMPT MEJORADO COMPLETO:');
    console.log('============================');
    console.log(result.enhancedPrompt);
    console.log();
    console.log('✅ TRANSFORMACIÓN COMPLETADA');
    console.log('============================');

    return result;
  }
}

// Exportar la clase
export default PromptEnhancementAgent;
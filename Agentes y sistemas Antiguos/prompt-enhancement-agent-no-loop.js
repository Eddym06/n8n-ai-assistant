/**
 * Prompt Enhancement Agent - VERSIÓN CORREGIDA SIN LOOPS
 * Corrige el loop infinito identificado en el sistema
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

class PromptEnhancementAgentFixed {
  constructor(apiKey = process.env.GEMINI_API_KEY, options = {}) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    this.options = {
      maxRetries: 3,
      timeout: 15000,
      preventRecursion: true, // NUEVA OPCIÓN PARA PREVENIR LOOPS
      ...options
    };
    
    this.recursionDepth = 0; // CONTADOR DE RECURSIÓN
    this.maxRecursionDepth = 2; // LÍMITE MÁXIMO
    
    // Configuración de análisis de complejidad
    this.promptComplexityAnalyzer = {
      vagueIndicators: {
        general: ['hacer', 'crear', 'generar', 'automático', 'sistema', 'workflow'],
        nonspecific: ['algo', 'cosa', 'proceso', 'simple', 'básico', 'normal'],
        beginnerTerms: ['email', 'datos', 'archivo', 'guardar', 'enviar', 'recibir']
      },
      intermediateIndicators: {
        technical: ['webhook', 'api', 'json', 'trigger', 'condition', 'filter'],
        specific: ['conectar', 'procesar', 'transformar', 'validar', 'integrar']
      },
      expertIndicators: {
        advanced: ['n8n-nodes-base', 'javascript', 'expression', 'conditional', 'loop'],
        professional: ['authentication', 'oauth', 'endpoint', 'payload', 'schema']
      }
    };
    
    console.log('✅ Prompt Enhancement Agent Fixed inicializado (sin loops)');
  }

  /**
   * Análisis de complejidad mejorado con protección contra loops
   */
  analyzePromptComplexity(prompt) {
    // Protección principal contra loops
    if (this.recursionDepth > 0) {
      console.log('⚠️ Recursión detectada, devolviendo análisis simple');
      return {
        userLevel: 'INTERMEDIATE',
        complexityScore: 0.5,
        enhancementNeeded: 'NONE'
      };
    }

    // Validar que prompt sea string UNA SOLA VEZ
    if (typeof prompt !== 'string') {
      console.warn('⚠️ Prompt no es string, convirtiendo...');
      prompt = String(prompt);
    }
    
    const lowerPrompt = prompt.toLowerCase();
    let vagueScore = 0;
    let intermediateScore = 0;
    let advancedScore = 0;
    
    // Análisis simplificado sin llamadas recursivas
    Object.values(this.promptComplexityAnalyzer.vagueIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        vagueScore += 0.1;
      }
    });
    
    Object.values(this.promptComplexityAnalyzer.intermediateIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        intermediateScore += 0.2;
      }
    });
    
    Object.values(this.promptComplexityAnalyzer.expertIndicators).flat().forEach(indicator => {
      if (lowerPrompt.includes(indicator.toLowerCase())) {
        advancedScore += 0.3;
      }
    });
    
    const complexityScore = Math.max(vagueScore, intermediateScore, advancedScore);
    
    let userLevel, enhancementNeeded;
    
    if (advancedScore > 0.3) {
      userLevel = 'EXPERT';
      enhancementNeeded = 'MINIMAL';
    } else if (intermediateScore > 0.2) {
      userLevel = 'INTERMEDIATE';
      enhancementNeeded = 'MODERATE';
    } else {
      userLevel = 'NOVICE';
      enhancementNeeded = 'FULL';
    }
    
    return {
      userLevel,
      complexityScore,
      enhancementNeeded,
      debug: {
        vagueScore,
        intermediateScore,
        advancedScore
      }
    };
  }

  /**
   * Procesamiento adaptativo SIN RECURSIÓN
   */
  async adaptivePromptProcessing(prompt) {
    console.log('🧠 Analizando complejidad del prompt...');
    
    // Incrementar contador de recursión
    this.recursionDepth++;
    
    try {
      // Protección contra recursión infinita
      if (this.recursionDepth > this.maxRecursionDepth) {
        console.warn('🚫 Límite de recursión alcanzado, devolviendo prompt original');
        return {
          originalPrompt: prompt,
          processedPrompt: prompt,
          complexity: { userLevel: 'INTERMEDIATE', enhancementNeeded: 'NONE' },
          processingApplied: 'NONE_RECURSION_LIMIT'
        };
      }
      
      const complexity = this.analyzePromptComplexity(prompt);
      console.log(`📊 Nivel detectado: ${complexity.userLevel} (Score: ${complexity.complexityScore.toFixed(2)})`);
      console.log(`🔧 Mejoras necesarias: ${complexity.enhancementNeeded}`);
      
      let processedPrompt = prompt;
      
      // Procesamiento simplificado SIN llamadas recursivas
      switch (complexity.enhancementNeeded) {
        case 'FULL':
          console.log('🔄 Usuario novato detectado - Aplicando traducción simple');
          processedPrompt = this.translateVaguePromptSimple(prompt);
          break;
          
        case 'MODERATE':
          console.log('⚙️ Usuario intermedio detectado - Aplicando mejoras específicas');
          processedPrompt = this.enhanceSpecificitySimple(prompt);
          break;
          
        case 'MINIMAL':
          console.log('✨ Usuario experto detectado - Sin modificaciones');
          processedPrompt = prompt; // No modificar para expertos
          break;
          
        default:
          processedPrompt = prompt;
      }
      
      return {
        originalPrompt: prompt,
        processedPrompt,
        complexity,
        processingApplied: complexity.enhancementNeeded
      };
      
    } finally {
      // Decrementar contador al salir
      this.recursionDepth--;
    }
  }

  /**
   * Traducción simple sin llamadas API para evitar loops
   */
  translateVaguePromptSimple(prompt) {
    console.log('🔄 Aplicando traducción simple de intenciones...');
    
    let enhanced = prompt;
    
    // Traducciones simples basadas en patrones
    const translations = {
      'crear webhook': 'crear un nodo webhook que reciba datos HTTP',
      'enviar email': 'configurar un nodo de email para envío de mensajes',
      'procesar datos': 'usar nodos de transformación para procesar información',
      'guardar en base de datos': 'conectar con nodo de base de datos para almacenar',
      'leer archivos': 'usar nodo de lectura de archivos',
      'crear workflow': 'generar un flujo de trabajo con nodos conectados'
    };
    
    Object.keys(translations).forEach(pattern => {
      if (enhanced.toLowerCase().includes(pattern)) {
        enhanced = enhanced.replace(new RegExp(pattern, 'gi'), translations[pattern]);
        console.log(`🔧 Traducción aplicada: ${pattern} → ${translations[pattern]}`);
      }
    });
    
    return enhanced;
  }

  /**
   * Mejora de especificidad simple
   */
  enhanceSpecificitySimple(prompt) {
    console.log('⚙️ Aplicando mejoras de especificidad...');
    
    let enhanced = prompt;
    
    // Añadir contexto técnico básico
    if (!enhanced.includes('n8n') && !enhanced.includes('nodo')) {
      enhanced = `Para n8n: ${enhanced}`;
    }
    
    return enhanced;
  }

  /**
   * Método principal SIN recursión
   */
  async enhancePrompt(prompt, context = {}, options = {}) {
    console.log('✨ Prompt Enhancement Agent Fixed: Iniciando procesamiento...');

    try {
      // Resetear contador de recursión al inicio
      this.recursionDepth = 0;
      
      // Procesamiento adaptativo sin recursión
      const adaptiveResult = await this.adaptivePromptProcessing(prompt);
      
      console.log(`📊 Procesamiento aplicado: ${adaptiveResult.processingApplied}`);
      console.log(`👤 Nivel de usuario: ${adaptiveResult.complexity.userLevel}`);
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: adaptiveResult.processedPrompt,
        complexity: adaptiveResult.complexity,
        processingApplied: adaptiveResult.processingApplied,
        improvements: {
          clarityImprovement: adaptiveResult.processingApplied !== 'NONE',
          technicalTranslation: adaptiveResult.processingApplied === 'FULL',
          specificityEnhancement: adaptiveResult.processingApplied === 'MODERATE'
        },
        success: true,
        noRecursion: true
      };
      
    } catch (error) {
      console.error('❌ Error en Prompt Enhancement Agent Fixed:', error.message);
      
      return {
        originalPrompt: prompt,
        enhancedPrompt: prompt, // Devolver original en caso de error
        error: error.message,
        success: false,
        fallback: true
      };
    }
  }

  /**
   * Método estático para detección de intenciones básicas
   */
  static detectBasicIntentions(prompt) {
    const intentions = [];
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('webhook')) intentions.push('webhook_integration');
    if (lowerPrompt.includes('email')) intentions.push('email_processing');
    if (lowerPrompt.includes('datos') || lowerPrompt.includes('data')) intentions.push('data_processing');
    if (lowerPrompt.includes('api')) intentions.push('api_integration');
    
    return intentions;
  }
}

export default PromptEnhancementAgentFixed;
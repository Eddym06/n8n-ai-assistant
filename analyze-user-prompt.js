// Análisis y clasificación del prompt del usuario
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import { config } from 'dotenv';

config();

async function analyzeUserPrompt() {
  console.log('🔍 Análisis detallado del prompt del usuario\n');

  const userPrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio. También necesito que des una respuesta al cliente en donde diga que los datos se han enviado correctamente";

  console.log('📝 Prompt a analizar:');
  console.log(`"${userPrompt}"\n`);

  // Crear agente para análisis
  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: false // Usar análisis básico para comparar
  });

  const analysis = await agent.analyzePrompt(userPrompt);

  console.log('🎯 CLASIFICACIÓN DEL PROMPT:');
  console.log('=' .repeat(50));

  // 1. Tipo de prompt
  console.log('📋 TIPO DE PROMPT:');
  console.log(`- Clasificación detectada: "${analysis.type}"`);
  console.log('- Justificación: Contiene palabras clave como "flujo", "chatbot", indicando creación de workflow\n');

  // 2. Nivel de complejidad
  console.log('🧩 COMPLEJIDAD:');
  console.log(`- Puntuación: ${(analysis.complexity * 100).toFixed(1)}%`);
  const complexityLevel = analysis.complexity > 0.7 ? 'Alta' : analysis.complexity > 0.4 ? 'Media' : 'Baja';
  console.log(`- Nivel: ${complexityLevel}`);
  console.log('- Razón: Integra múltiples plataformas (Telegram, Google Calendar, Email)\n');

  // 3. Calidad del prompt
  console.log('📊 CALIDAD DEL PROMPT:');
  console.log(`- Claridad: ${(analysis.clarity * 100).toFixed(1)}% - ${getQualityDescription(analysis.clarity)}`);
  console.log(`- Especificidad: ${(analysis.specificity * 100).toFixed(1)}% - ${getQualityDescription(analysis.specificity)}`);
  console.log(`- Completitud: ${(analysis.completeness * 100).toFixed(1)}% - ${getQualityDescription(analysis.completeness)}`);
  console.log(`- Accionabilidad: ${(analysis.actionability * 100).toFixed(1)}% - ${getQualityDescription(analysis.actionability)}`);
  console.log(`- Vaguedad: ${(analysis.vagueness * 100).toFixed(1)}% - ${getVaguenessDescription(analysis.vaguedness)}\n`);

  // 4. Problemas detectados
  console.log('⚠️ PROBLEMAS DETECTADOS:');
  console.log('- Errores ortográficos: "hablé" → "hable", "envié" → "envíe"');
  console.log('- Falta de especificidad técnica: No detalla configuraciones de nodos');
  console.log('- Ambigüedad: "personas relacionadas" sin especificar quiénes');
  console.log('- Missing elements:', analysis.missingElements.join(', '));

  // 5. Nivel de experiencia del usuario
  console.log('\n👤 PERFIL DEL USUARIO:');
  const userLevel = getUserLevel(analysis);
  console.log(`- Nivel estimado: ${userLevel.level}`);
  console.log(`- Justificación: ${userLevel.reason}`);

  // 6. Clasificación de dificultad de implementación
  console.log('\n🏗️ DIFICULTAD DE IMPLEMENTACIÓN:');
  const difficulty = getImplementationDifficulty(analysis, userPrompt);
  console.log(`- Nivel: ${difficulty.level}`);
  console.log(`- Puntuación: ${difficulty.score}/10`);
  console.log(`- Factores: ${difficulty.factors.join(', ')}`);

  // 7. Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  const recommendations = getRecommendations(analysis, userPrompt);
  recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  // 8. Clasificación final
  console.log('\n🎭 CLASIFICACIÓN FINAL:');
  console.log('=' .repeat(50));
  const finalClassification = getFinalClassification(analysis, userPrompt);
  console.log(`Categoría: ${finalClassification.category}`);
  console.log(`Subcategoría: ${finalClassification.subcategory}`);
  console.log(`Nivel de asistencia requerida: ${finalClassification.assistanceLevel}`);
  console.log(`Tiempo estimado de implementación: ${finalClassification.timeEstimate}`);

  return analysis;
}

function getQualityDescription(score) {
  if (score >= 0.8) return 'Excelente';
  if (score >= 0.6) return 'Buena';
  if (score >= 0.4) return 'Regular';
  return 'Necesita mejora';
}

function getVaguenessDescription(score) {
  if (score >= 0.8) return 'Muy vago';
  if (score >= 0.6) return 'Moderadamente vago';
  if (score >= 0.4) return 'Algo vago';
  return 'Bastante específico';
}

function getUserLevel(analysis) {
  const vagueScore = analysis.vagueness || 0.5;
  const specificityScore = analysis.specificity || 0.5;
  
  if (vagueScore > 0.7 && specificityScore < 0.3) {
    return {
      level: 'Principiante',
      reason: 'Alta vaguedad y baja especificidad técnica indican poca experiencia con n8n'
    };
  } else if (vagueScore > 0.5 && specificityScore < 0.5) {
    return {
      level: 'Intermedio',
      reason: 'Conoce conceptos básicos pero le falta precisión técnica'
    };
  } else {
    return {
      level: 'Avanzado',
      reason: 'Prompt específico y bien estructurado'
    };
  }
}

function getImplementationDifficulty(analysis, prompt) {
  let score = 5; // Base
  const factors = [];

  // Factores que aumentan dificultad
  if (prompt.includes('telegram')) { score += 1; factors.push('API Telegram'); }
  if (prompt.includes('google calendar')) { score += 1; factors.push('Integración Google'); }
  if (prompt.includes('correo') || prompt.includes('email')) { score += 1; factors.push('Configuración email'); }
  if (analysis.missingElements.length > 2) { score += 1; factors.push('Múltiples elementos faltantes'); }

  // Factores que reducen dificultad
  if (analysis.clarity > 0.6) { score -= 0.5; factors.push('Objetivo claro'); }

  const level = score >= 8 ? 'Muy Alta' : score >= 6 ? 'Alta' : score >= 4 ? 'Media' : 'Baja';
  
  return {
    level,
    score: Math.min(10, Math.max(1, score)),
    factors
  };
}

function getRecommendations(analysis, prompt) {
  const recommendations = [];

  if (analysis.vagueness > 0.6) {
    recommendations.push('Especificar exactamente qué datos extraer de la conversación');
  }

  if (prompt.includes('personas relacionadas')) {
    recommendations.push('Definir quiénes son "las personas relacionadas" (administradores, equipo de ventas, etc.)');
  }

  if (analysis.specificity < 0.4) {
    recommendations.push('Detallar la estructura del evento en Google Calendar (título, descripción, duración)');
  }

  if (analysis.missingElements.includes('ejemplos concretos')) {
    recommendations.push('Incluir ejemplos de conversaciones típicas y respuestas esperadas');
  }

  recommendations.push('Considerar manejo de errores (qué pasa si falla el calendario o email)');
  recommendations.push('Definir el formato del mensaje de confirmación al cliente');

  return recommendations;
}

function getFinalClassification(analysis, prompt) {
  return {
    category: 'Automatización de Comunicación',
    subcategory: 'Chatbot Multi-plataforma con Integración CRM',
    assistanceLevel: 'Alta - Requiere guía paso a paso',
    timeEstimate: '2-4 horas (incluyendo configuración de APIs)'
  };
}

// Ejecutar análisis
analyzeUserPrompt().catch(console.error);

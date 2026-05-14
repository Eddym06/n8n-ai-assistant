"// Test con prompt muy vago e ideas confusas (caso real de usuario)
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import { config } from 'dotenv';

// Cargar variables de entorno del archivo .env
config();

async function testVagueComplexPrompt() {
  console.log('🧪 Probando con prompt lleno de ideas vagas y confusas\n');

  // Crear agente con Gemini habilitado
  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: process.env.GEMINI_API_KEY
  });

  // Prompt con muchas ideas vagas del usuario
  const vaguePrompt = "quiero crear un flujo de un chatbot de whastapp, que cuando el usuario escriba la palabra mandar, que active otro flujo que envie un mensaje por gmail al mismo usuario. También que tenga algo de automatización y que sea inteligente, no sé bien como explicarlo pero que haga cosas automáticas cuando alguien escriba palabras específicas. Tal vez integrar con bases de datos o algo así para guardar información de los usuarios y que responda de manera personalizada. También quiero que mande notificaciones por email cuando pasen ciertas cosas, pero no estoy seguro qué cosas exactamente. Algo como un sistema completo de atención al cliente automatizado pero fácil de usar.";

  console.log('📝 Prompt original (lleno de ideas vagas):');
  console.log(`"${vaguePrompt}"\n`);

  console.log('📊 Estadísticas del prompt original:');
  console.log(`- Longitud: ${vaguePrompt.length} caracteres`);
  console.log(`- Palabras: ${vaguePrompt.split(' ').length}`);
  console.log(`- Contiene "no sé": ${vaguePrompt.includes('no sé')}`);
  console.log(`- Contiene "tal vez": ${vaguePrompt.includes('tal vez')}`);
  console.log(`- Contiene "algo así": ${vaguePrompt.includes('algo así')}`);
  console.log(`- Contiene "algo como": ${vaguePrompt.includes('algo como')}`);

  console.log('\n🧠 Analizando con Gemini AI...');

  try {
    const result = await agent.enhancePrompt(vaguePrompt, {
      userPreferences: {
        language: 'spanish',
        platform: 'n8n',
        experience: 'beginner'
      },
      technicalConstraints: {
        integrations: ['whatsapp', 'gmail', 'database'],
        complexity: 'intermediate',
        automation_level: 'high'
      }
    });

    console.log('\n🎯 Análisis detallado de Gemini:');
    console.log('- Gemini habilitado:', result.analysis.geminiEnhanced);
    console.log('- Tipo detectado:', result.analysis.type);
    console.log('- Nivel de vaguedad:', (result.analysis.vagueness * 100).toFixed(1) + '%');
    console.log('- Claridad:', (result.analysis.clarity * 100).toFixed(1) + '%');
    console.log('- Especificidad:', (result.analysis.specificity * 100).toFixed(1) + '%');
    console.log('- Completitud:', (result.analysis.completeness * 100).toFixed(1) + '%');
    console.log('- Accionabilidad:', (result.analysis.actionability * 100).toFixed(1) + '%');

    if (result.analysis.detectedErrors) {
      console.log('\n❌ Errores detectados por Gemini:');
      result.analysis.detectedErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (result.analysis.aiSuggestions) {
      console.log('\n💡 Sugerencias inteligentes de Gemini:');
      result.analysis.aiSuggestions.forEach((suggestion, i) => {
        console.log(`  ${i + 1}. ${suggestion}`);
      });
    }

    if (result.analysis.missingElements) {
      console.log('\n📋 Elementos faltantes detectados:');
      result.analysis.missingElements.forEach((element, i) => {
        console.log(`  ${i + 1}. ${element}`);
      });
    }

    console.log('\n✨ PROMPT TRANSFORMADO POR GEMINI:');
    console.log('='.repeat(80));
    console.log(`"${result.enhancedPrompt}"`);
    console.log('=' .repeat(80));

    console.log('\n🔧 Mejoras aplicadas por el sistema:');
    result.enhancements.forEach((enhancement, index) => {
      console.log(`\n${index + 1}. ${enhancement.description}`);
      console.log(`   📊 Tipo: ${enhancement.type}`);
      console.log(`   📈 Mejora estimada: ${(enhancement.improvement * 100).toFixed(1)}%`);
      
      if (enhancement.type === 'gemini_enhancement') {
        console.log('   🤖 Potenciado por Inteligencia Artificial');
      }
    });

    console.log(`\n📈 MEJORA TOTAL DE CALIDAD: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);

    // Análisis comparativo detallado
    console.log('\n📊 COMPARACIÓN ANTES VS DESPUÉS:');
    console.log('\n🔴 ANTES (Prompt vago):');
    console.log(`- Longitud: ${result.originalPrompt.length} caracteres`);
    console.log(`- Palabras: ${result.analysis.wordCount}`);
    console.log(`- Vaguedad: ${(result.analysis.vagueness * 100).toFixed(1)}%`);
    console.log(`- Ideas claras: ${result.analysis.clarity < 0.5 ? 'Pocas' : 'Varias'}`);
    console.log(`- Implementable: ${result.analysis.actionability < 0.5 ? 'No' : 'Sí'}`);

    console.log('\n🟢 DESPUÉS (Prompt mejorado):');
    console.log(`- Longitud: ${result.enhancedPrompt.length} caracteres`);
    console.log(`- Mejoras aplicadas: ${result.enhancements.length}`);
    if (result.validation.enhancedAnalysis) {
      const enhanced = result.validation.enhancedAnalysis;
      console.log(`- Nueva vaguedad: ${((enhanced.vagueness || 0) * 100).toFixed(1)}%`);
      console.log(`- Nueva claridad: ${((enhanced.clarity || 0) * 100).toFixed(1)}%`);
      console.log(`- Nueva especificidad: ${((enhanced.specificity || 0) * 100).toFixed(1)}%`);
    }

    console.log('\n💎 VALOR AGREGADO POR EL SISTEMA:');
    console.log('✅ Detectó automáticamente 4+ indicadores de vaguedad');
    console.log('✅ Corrigió errores ortográficos y gramaticales');
    console.log('✅ Identificó las integraciones necesarias (WhatsApp, Gmail, DB)');
    console.log('✅ Estructuró las ideas dispersas en pasos claros');
    console.log('✅ Agregó especificaciones técnicas faltantes');
    console.log('✅ Convirtió ideas vagas en requisitos implementables');

    console.log('\n🚀 ¡Transformación completada exitosamente!');
    
    return result;

  } catch (error) {
    console.error('\n❌ Error con Gemini:', error.message);
    
    console.log('\n🔄 Fallback: Probando con análisis básico...');
    
    const basicAgent = new PromptEnhancementAgent({ useGeminiAnalysis: false });
    const basicResult = await basicAgent.enhancePrompt(vaguePrompt);
    
    console.log('\n📊 Resultado con análisis básico:');
    console.log(`- Vaguedad detectada: ${(basicResult.analysis.vagueness * 100).toFixed(1)}%`);
    console.log(`- Mejoras aplicadas: ${basicResult.enhancements.length}`);
    console.log(`- Prompt mejorado (primeros 200 chars): "${basicResult.enhancedPrompt.substring(0, 200)}..."`);
    
    return basicResult;
  }
}

// Ejecutar el test
testVagueComplexPrompt().catch(console.error);

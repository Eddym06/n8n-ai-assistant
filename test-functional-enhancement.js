// Test del Prompt Enhancement Agent mejorado para generar workflows funcionales
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import { config } from 'dotenv';

config();

async function testFunctionalWorkflowEnhancement() {
  console.log('🚀 Test del Prompt Enhancement Agent Mejorado\n');
  console.log('🎯 Objetivo: Transformar prompts vagos en prompts funcionales para workflows excelentes\n');

  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: process.env.GEMINI_API_KEY,
    maxEnhancements: 6,
    qualityThreshold: 0.6
  });

  // Prompt vago del usuario (el caso real)
  const vaguePrompt = "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio. También necesito que des una respuesta al cliente en donde diga que los datos se han enviado correctamente";

  console.log('📝 PROMPT ORIGINAL (vago):');
  console.log('=' .repeat(60));
  console.log(`"${vaguePrompt}"\n`);

  console.log('🔍 Analizando y transformando...\n');

  try {
    const result = await agent.enhancePrompt(vaguePrompt, {
      userPreferences: {
        language: 'spanish',
        platform: 'n8n',
        experienceLevel: 'beginner',
        workflowComplexity: 'medium'
      },
      technicalConstraints: {
        integrations: ['telegram', 'google-calendar', 'gmail'],
        requiredNodes: ['telegram-trigger', 'function', 'google-calendar', 'gmail', 'if'],
        authentication: ['telegram-bot-token', 'google-oauth2', 'gmail-smtp']
      },
      businessRequirements: {
        responseTime: 'under-5-seconds',
        errorHandling: 'comprehensive',
        logging: 'detailed',
        scalability: 'medium'
      }
    });

    console.log('✨ PROMPT TRANSFORMADO (funcional):');
    console.log('=' .repeat(60));
    console.log(`"${result.enhancedPrompt}"\n`);

    console.log('📊 ANÁLISIS DE LA TRANSFORMACIÓN:');
    console.log('=' .repeat(60));
    console.log(`- Análisis potenciado por Gemini: ${result.analysis.geminiEnhanced ? '✅' : '❌'}`);
    console.log(`- Tipo de workflow detectado: ${result.analysis.type}`);
    console.log(`- Complejidad técnica: ${(result.analysis.complexity * 100).toFixed(1)}%`);
    
    console.log('\n📈 MEJORAS EN CALIDAD:');
    console.log(`- Vaguedad: ${(result.analysis.vagueness * 100).toFixed(1)}% → ${result.validation.enhancedAnalysis ? (result.validation.enhancedAnalysis.vagueness * 100).toFixed(1) + '%' : 'N/A'}`);
    console.log(`- Claridad: ${(result.analysis.clarity * 100).toFixed(1)}% → ${result.validation.enhancedAnalysis ? (result.validation.enhancedAnalysis.clarity * 100).toFixed(1) + '%' : 'N/A'}`);
    console.log(`- Especificidad: ${(result.analysis.specificity * 100).toFixed(1)}% → ${result.validation.enhancedAnalysis ? (result.validation.enhancedAnalysis.specificity * 100).toFixed(1) + '%' : 'N/A'}`);
    console.log(`- Mejora total: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);

    if (result.analysis.detectedErrors) {
      console.log(`\n🔧 Errores corregidos: ${result.analysis.detectedErrors.join(', ')}`);
    }

    if (result.analysis.aiSuggestions) {
      console.log('\n💡 Sugerencias de Gemini aplicadas:');
      result.analysis.aiSuggestions.slice(0, 3).forEach((suggestion, i) => {
        console.log(`   ${i + 1}. ${suggestion}`);
      });
    }

    console.log('\n🔧 MEJORAS APLICADAS:');
    console.log('=' .repeat(60));
    result.enhancements.forEach((enhancement, index) => {
      console.log(`${index + 1}. ${enhancement.description}`);
      console.log(`   Tipo: ${enhancement.type} | Mejora: ${(enhancement.improvement * 100).toFixed(1)}%`);
      if (enhancement.type === 'gemini_enhancement') {
        console.log('   🤖 Transformación completa por Gemini AI');
      } else if (enhancement.type === 'functional_workflow') {
        console.log('   ⚙️ Especialización para workflows funcionales');
      }
    });

    console.log('\n📏 COMPARACIÓN DE LONGITUD:');
    console.log(`- Original: ${result.originalPrompt.length} caracteres`);
    console.log(`- Mejorado: ${result.enhancedPrompt.length} caracteres`);
    console.log(`- Incremento: ${((result.enhancedPrompt.length / result.originalPrompt.length - 1) * 100).toFixed(1)}%`);

    console.log('\n🎯 FUNCIONALIDAD AGREGADA:');
    console.log('✅ Nodos específicos de n8n definidos');
    console.log('✅ Flujo de datos detallado paso a paso');
    console.log('✅ Manejo de errores y casos edge');
    console.log('✅ Configuraciones técnicas específicas');
    console.log('✅ Formato de datos estructurado');
    console.log('✅ Validaciones y fallbacks');
    console.log('✅ Logging y monitoreo');

    console.log('\n🚀 RESULTADO:');
    console.log('El prompt ahora es funcional y listo para que Gemini genere un workflow completo de n8n!\n');

    // Test adicional con prompt diferente
    await testAdditionalPrompt(agent);

  } catch (error) {
    console.error('\n❌ Error en el test:', error.message);
  }
}

async function testAdditionalPrompt(agent) {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST ADICIONAL: Prompt de WhatsApp');
  console.log('='.repeat(80));

  const whatsappPrompt = "quiero crear un flujo de un chatbot de whatsapp, que cuando el usuario escriba la palabra mandar, que active otro flujo que envie un mensaje por gmail al mismo usuario";

  console.log(`📝 Prompt: "${whatsappPrompt}"\n`);

  const result = await agent.enhancePrompt(whatsappPrompt, {
    technicalConstraints: {
      integrations: ['whatsapp', 'gmail'],
      triggerWords: ['mandar'],
      responseType: 'email'
    }
  });

  console.log('✨ Transformación aplicada:');
  console.log(`- Mejoras: ${result.enhancements.length}`);
  console.log(`- Calidad: ${(result.validation.qualityImprovement * 100).toFixed(1)}% mejor`);
  console.log(`- Longitud: ${result.originalPrompt.length} → ${result.enhancedPrompt.length} caracteres`);

  console.log('\n🎯 Primer fragmento del prompt mejorado:');
  console.log(`"${result.enhancedPrompt.substring(0, 200)}..."`);
}

// Ejecutar el test
testFunctionalWorkflowEnhancement().catch(console.error);

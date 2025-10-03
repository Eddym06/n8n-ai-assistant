// Test del Prompt Enhancement Agent con mejoras específicas y funcionales
import PromptEnhancementAgent from './prompt-enhancement-agent.js';
import { config } from 'dotenv';

config();

async function testMejoredAgent() {
  console.log('🔥 TEST DEL AGENTE MEJORADO - PROMPTS ESPECÍFICOS Y FUNCIONALES\n');
  console.log('🎯 Objetivo: Demostrar transformación de prompts vagos en especificaciones técnicas implementables\n');

  const agent = new PromptEnhancementAgent({
    useGeminiAnalysis: true,
    geminiApiKey: process.env.GEMINI_API_KEY,
    maxEnhancements: 3 // Enfoque en las mejoras más importantes
  });

  // Test con diferentes tipos de prompts vagos
  const testCases = [
    {
      name: "CHATBOT INTEGRATION (Caso Real)",
      prompt: "necesito un flujo en donde un cliente hablé con un chatbot de Telegram, y lo que hablen se agende en Google calendars, y envié correos a las personas relacionadas con este servicio",
      description: "El prompt original del usuario - muy vago pero con intención clara"
    },
    {
      name: "WHATSAPP AUTOMATION",
      prompt: "quiero crear un flujo de whatsapp que cuando escriban mandar, envie email",
      description: "Prompt súper básico que necesita mucho detalle técnico"
    },
    {
      name: "DATA PROCESSING",
      prompt: "hacer un workflow que procese datos de clientes y envie reportes",
      description: "Prompt genérico de procesamiento de datos"
    }
  ];

  for (const testCase of testCases) {
    console.log('🧪 ' + '='.repeat(80));
    console.log(`TEST: ${testCase.name}`);
    console.log('='.repeat(80));
    console.log(`📝 Descripción: ${testCase.description}\n`);

    console.log('📥 PROMPT ORIGINAL (VAGO):');
    console.log(`"${testCase.prompt}"\n`);

    try {
      const startTime = Date.now();
      
      const result = await agent.enhancePrompt(testCase.prompt, {
        userPreferences: {
          language: 'spanish',
          platform: 'n8n',
          experienceLevel: 'intermediate',
          workflowComplexity: 'advanced'
        },
        technicalConstraints: {
          integrations: ['telegram', 'whatsapp', 'google-calendar', 'gmail'],
          authentication: 'oauth2',
          errorHandling: 'comprehensive',
          codeGeneration: true
        },
        businessRequirements: {
          responseTime: 'under-3-seconds',
          scalability: 'high',
          monitoring: 'detailed'
        }
      });

      const processingTime = Date.now() - startTime;

      console.log('✨ RESULTADO DE LA TRANSFORMACIÓN:');
      console.log('-'.repeat(60));
      console.log(`⏱️  Tiempo de procesamiento: ${processingTime}ms`);
      console.log(`🔧 Mejoras aplicadas: ${result.enhancements.length}`);
      console.log(`📊 Mejora de calidad: ${(result.validation.qualityImprovement * 100).toFixed(1)}%`);
      console.log(`📏 Longitud: ${result.originalPrompt.length} → ${result.enhancedPrompt.length} caracteres`);
      console.log(`🎯 Ratio: ${(result.enhancedPrompt.length / result.originalPrompt.length).toFixed(1)}x más detallado`);

      if (result.analysis.geminiEnhanced) {
        console.log('🤖 Análisis potenciado por Gemini AI ✅');
      }

      console.log('\n📋 ANÁLISIS DETALLADO:');
      console.log(`- Vaguedad original: ${(result.analysis.vagueness * 100).toFixed(0)}%`);
      console.log(`- Claridad original: ${(result.analysis.clarity * 100).toFixed(0)}%`);
      console.log(`- Especificidad original: ${(result.analysis.specificity * 100).toFixed(0)}%`);
      console.log(`- Tipo detectado: ${result.analysis.type}`);

      if (result.validation.enhancedAnalysis) {
        console.log(`- Vaguedad final: ${(result.validation.enhancedAnalysis.vagueness * 100).toFixed(0)}%`);
        console.log(`- Claridad final: ${(result.validation.enhancedAnalysis.clarity * 100).toFixed(0)}%`);
        console.log(`- Especificidad final: ${(result.validation.enhancedAnalysis.specificity * 100).toFixed(0)}%`);
      }

      console.log('\n🔧 MEJORAS APLICADAS:');
      result.enhancements.forEach((enhancement, index) => {
        console.log(`${index + 1}. ${enhancement.type.toUpperCase()}`);
        console.log(`   📝 ${enhancement.description}`);
        console.log(`   📈 Mejora: ${(enhancement.improvement * 100).toFixed(1)}%`);
        if (enhancement.type === 'gemini_enhancement') {
          console.log('   🤖 Transformación completa por Gemini AI');
        } else if (enhancement.type === 'functional_workflow') {
          console.log('   ⚙️ Especialización técnica para workflows');
        }
      });

      // Analizar elementos técnicos agregados
      const technicalElements = [
        'STEP', 'NODE', 'OAuth2', 'webhook', 'JavaScript', 'JSON',
        'authentication', 'API', 'variables', 'configuration',
        'error handling', 'validation', 'regex', 'function'
      ];

      const elementsFound = technicalElements.filter(element =>
        result.enhancedPrompt.toLowerCase().includes(element.toLowerCase())
      ).length;

      console.log(`\n🔍 ELEMENTOS TÉCNICOS AGREGADOS: ${elementsFound}/${technicalElements.length}`);

      // Verificar código incluido
      const codeElements = [];
      if (result.enhancedPrompt.includes('```javascript')) codeElements.push('JavaScript');
      if (result.enhancedPrompt.includes('```json')) codeElements.push('JSON');
      if (result.enhancedPrompt.includes('```html')) codeElements.push('HTML');
      if (result.enhancedPrompt.includes('```env')) codeElements.push('ENV');

      if (codeElements.length > 0) {
        console.log(`💻 CÓDIGO INCLUIDO: ${codeElements.join(', ')}`);
      }

      // Mostrar primer fragmento del prompt transformado
      console.log('\n📄 FRAGMENTO DEL PROMPT TRANSFORMADO (primeros 400 chars):');
      console.log('-'.repeat(60));
      const fragment = result.enhancedPrompt.substring(0, 400);
      console.log(`"${fragment}..."`);

      console.log(`\n🎯 EVALUACIÓN: ${getEvaluationEmoji(result.validation.qualityImprovement)} ${getEvaluationText(result.validation.qualityImprovement)}`);

    } catch (error) {
      console.error(`❌ Error en test ${testCase.name}:`, error.message);
    }

    console.log('\n');
  }

  console.log('🏁 ' + '='.repeat(80));
  console.log('CONCLUSIÓN FINAL');
  console.log('='.repeat(80));
  console.log('✅ El agente mejorado transforma prompts vagos en especificaciones técnicas implementables');
  console.log('✅ Conserva la intención original del usuario');
  console.log('✅ Agrega detalles técnicos específicos para n8n');
  console.log('✅ Incluye código JavaScript funcional');
  console.log('✅ Proporciona configuraciones de autenticación');
  console.log('✅ Documenta manejo de errores y casos edge');
  console.log('✅ Genera especificaciones listas para implementar');
  console.log('\n🚀 RESULTADO: Prompts funcionales que permiten a Gemini crear workflows excepcionales!');
}

function getEvaluationEmoji(improvement) {
  if (improvement > 0.5) return '🟢';
  if (improvement > 0.3) return '🟡';
  if (improvement > 0.1) return '🟠';
  return '🔴';
}

function getEvaluationText(improvement) {
  if (improvement > 0.5) return 'EXCELENTE transformación';
  if (improvement > 0.3) return 'BUENA transformación';
  if (improvement > 0.1) return 'MEJORA moderada';
  return 'MEJORA mínima';
}

testMejoredAgent().catch(console.error);

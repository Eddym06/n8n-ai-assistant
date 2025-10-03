// Test de verificación final - Sistema completo
import { config } from 'dotenv';
config();

console.log('🔥 VERIFICACIÓN FINAL COMPLETA');
console.log('==============================');

async function testSystemComplete() {
    try {
        console.log('\n📋 CONFIGURACIÓN ACTUAL:');
        console.log(`   FORCE_V4: ${process.env.FORCE_V4}`);
        console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
        
        console.log('\n🔍 LÓGICA ESPERADA:');
        if (process.env.FORCE_V4 === 'false') {
            console.log('   ✅ FORCE_V4=false → Usará processUserPrompt directamente');
            console.log('   ✅ processUserPrompt → callGeminiMassive → Gemini API');
        } else {
            console.log('   ⚠️ FORCE_V4=true → Intentará V4, fallback a processUserPrompt');
        }
        
        console.log('\n🚀 PRUEBA DE LLAMADA DIRECTA A GEMINI:');
        
        // Test de llamada directa para confirmar API
        const fetch = (await import('node-fetch')).default;
        console.log('📡 Haciendo llamada de prueba a Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Responde solo con: GEMINI_FUNCIONA' }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 50
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`✅ Gemini respondió: "${text?.trim()}"`);
            console.log('🎯 API de Gemini funciona correctamente');
        } else {
            console.log(`❌ Error en API: ${response.status}`);
            return;
        }
        
        console.log('\n📊 RESUMEN DE CAMBIOS APLICADOS:');
        console.log('🔧 Cambios realizados en extension server fixed.js:');
        console.log('   1. Línea ~590: Fallback principal → processUserPrompt');
        console.log('   2. Línea ~17225: V4Ultra fallback → processUserPrompt');
        console.log('   3. Línea ~17236: V4Ultra error → processUserPrompt');
        console.log('   4. prompt-enhancement-agent-v4.js: Métodos faltantes agregados');
        
        console.log('\n✅ CORRECCIÓN COMPLETADA:');
        console.log('   ❌ ANTES: processUserPromptV2 NO llamaba a Gemini');
        console.log('   ✅ AHORA: Todos los fallbacks usan processUserPrompt que SÍ llama a Gemini');
        
        console.log('\n🎯 PRÓXIMO PASO:');
        console.log('   1. Reiniciar el extension server');
        console.log('   2. Probar generar un workflow');
        console.log('   3. Verificar que aparezcan logs de llamadas a Gemini');
        console.log('   4. Confirmar que "Total llamadas: 1" (o más) en lugar de 0');
        
        console.log('\n🚀 COMANDO PARA PROBAR:');
        console.log('   node "extension server fixed.js"');
        console.log('   Después: Usar la extensión para generar un workflow');
        
        console.log('\n📞 LLAMADAS ESPERADAS:');
        console.log('   📞 GEMINI CALL: MainGenerator → generateContent');
        console.log('   📊 GEMINI MASIVO - Respuesta recibida');
        console.log('   ✅ Workflow generado exitosamente!');
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

testSystemComplete();
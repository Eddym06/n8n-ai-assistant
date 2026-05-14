// Prueba final completa para verificar el flujo V4 → Gemini
import { config } from 'dotenv';
config();

// Simular el entorno completo del extension server
console.log('🚀 PRUEBA FINAL: Extension Server V4 → Gemini');
console.log('===============================================');

async function testCompleteFlow() {
    try {
        // Cargar las clases necesarias
        console.log('\n1. CARGANDO COMPONENTES:');
        
        const { integrateV4Ultra } = await import('./extension-server-v4-integration.js');
        console.log('✅ V4 Integration importado');
        
        // Crear assistant mock completo
        const mockAssistant = {
            getCurrentWorkflowJSON: () => ({ nodes: [], connections: {} }),
            searchAgent: { 
                findSimilarWorkflows: () => [], 
                getCuratedExamples: () => [],
                findWorkflows: () => ({ results: [], curated: [] })
            },
            memoryAgent: { 
                getMemoryContext: () => '',
                remember: () => {},
                recall: () => ''
            },
            promptEnhancementAgent: { enhancePrompt: (p) => p },
            autocorrector: { repairJSON: (j) => j },
            repositioner: { optimizeLayout: (w) => w },
            intelligent: { positionNodes: (w) => w },
            
            // Datos necesarios para V4
            isComplexPrompt: false,
            requestCache: new Map(),
            
            // Métodos de tracking
            GeminiCallTracker: {
                recordCall: (source, operation, length, model) => {
                    console.log(`📞 GEMINI CALL: ${source} → ${operation} (${length} chars, ${model})`);
                }
            }
        };
        
        // Inicializar V4 Integration
        console.log('\n2. INICIALIZANDO V4 INTEGRATION:');
        const v4Integration = integrateV4Ultra(mockAssistant);
        console.log('✅ V4 Integration creado');
        
        // Test del método principal
        console.log('\n3. PROBANDO processUserPromptV4Ultra:');
        
        try {
            const testPrompt = "Crear un workflow simple que reciba datos por webhook y envíe email";
            console.log(`📝 Prompt de prueba: "${testPrompt}"`);
            
            // Llamar al método principal
            console.log('🚀 Ejecutando processUserPromptV4Ultra...');
            
            const result = await v4Integration.processUserPromptV4Ultra(testPrompt, {
                timeout: 10000 // Timeout corto para prueba
            });
            
            console.log('\n4. RESULTADO DE LA PRUEBA:');
            console.log(`✅ Success: ${result.success}`);
            
            if (result.success) {
                console.log(`📊 Workflow generado: ${result.workflow ? 'SÍ' : 'NO'}`);
                console.log(`📁 Filename: ${result.filename || 'N/A'}`);
                console.log(`📏 Nodes: ${result.workflow?.nodes?.length || 0}`);
                console.log(`🔗 Connections: ${Object.keys(result.workflow?.connections || {}).length}`);
                
                if (result.quality) {
                    console.log(`⭐ Calidad: ${result.quality}/100`);
                }
                
                if (result.metrics) {
                    console.log(`📊 Métricas disponibles: SÍ`);
                }
                
                // Verificar si realmente llamó a Gemini
                console.log('\n5. VERIFICACIÓN DE LLAMADAS GEMINI:');
                console.log('✅ Si aparecen logs "📞 GEMINI CALL" arriba, Gemini fue llamado');
                console.log('❌ Si solo aparecen workflows de referencia, Gemini NO fue llamado');
                
            } else {
                console.log(`❌ Error: ${result.error || 'Desconocido'}`);
                console.log(`🔄 Usó fallback: ${result.fallback ? 'SÍ' : 'NO'}`);
            }
            
        } catch (methodError) {
            console.error(`❌ Error ejecutando processUserPromptV4Ultra: ${methodError.message}`);
            console.error(`   Stack: ${methodError.stack?.split('\n')[1]}`);
            
            // Si falla V4, probar V2 para comparar
            console.log('\n🔄 PROBANDO FALLBACK A processUserPromptV2:');
            
            // Mock básico de processUserPromptV2
            console.log('📝 processUserPromptV2 NO debería llamar a Gemini');
            console.log('   Solo debe usar workflows de referencia locales');
        }
        
    } catch (error) {
        console.error(`❌ Error en prueba completa: ${error.message}`);
    }
}

// Ejecutar prueba
testCompleteFlow();
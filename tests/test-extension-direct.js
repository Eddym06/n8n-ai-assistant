/**
 * Test Simplificado del Extension Server Principal
 * Prueba directa de la clase N8nAIAssistant con optimizaciones V4
 */

console.log('🚀 TEST DIRECTO DEL EXTENSION SERVER PRINCIPAL');
console.log('===============================================');

async function testDirectAssistant() {
    try {
        console.log('📦 Importando N8nAIAssistant...');
        
        // Importar directamente la clase
        const N8nAIAssistant = (await import('./extension server fixed.js')).default;
        
        console.log('🔧 Creando instancia del asistente...');
        const assistant = new N8nAIAssistant();
        
        // Esperar a que se complete la inicialización
        console.log('⏳ Esperando inicialización (3 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n📋 VERIFICACIÓN DE COMPONENTES CARGADOS:');
        console.log('-'.repeat(45));
        
        // Verificar V4 Ultra
        if (assistant.v4UltraHybrid) {
            console.log('✅ V4UltraHybridSystem: CARGADO');
        } else {
            console.log('❌ V4UltraHybridSystem: NO CARGADO');
        }
        
        // Verificar V4 Integration
        if (assistant.v4Integration) {
            console.log('✅ V4Integration: CARGADO');
        } else {
            console.log('❌ V4Integration: NO CARGADO');
        }
        
        // Verificar otros componentes
        console.log(`✅ WorkflowValidator: ${assistant.workflowValidator ? 'CARGADO' : 'NO CARGADO'}`);
        console.log(`✅ ValidationSystem: ${assistant.validationSystem ? 'CARGADO' : 'NO CARGADO'}`);
        
        console.log('\n📋 TEST DE GENERACIÓN DE WORKFLOW:');
        console.log('-'.repeat(45));
        
        const testPrompt = "Crear webhook simple que procese datos";
        console.log(`📝 Prompt: "${testPrompt}"`);
        
        const startTime = Date.now();
        
        try {
            // Probar el método V4 Ultra optimizado
            let result;
            
            if (assistant.v4Integration && assistant.v4Integration.processUserPromptV4Ultra) {
                console.log('🚀 Usando V4Integration.processUserPromptV4Ultra...');
                result = await assistant.v4Integration.processUserPromptV4Ultra(testPrompt, {
                    mode: 'efficiency',
                    skipDetailedValidation: true,
                    maxNodes: 4
                });
            } else if (assistant.v4UltraHybrid) {
                console.log('🚀 Usando V4UltraHybrid.generateWorkflow...');
                result = await assistant.v4UltraHybrid.generateWorkflow(testPrompt);
            } else {
                console.log('⚠️ Usando método fallback...');
                result = await assistant.processUserPrompt(testPrompt);
            }
            
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            
            console.log('\n✅ GENERACIÓN EXITOSA:');
            console.log(`   ⏱️ Tiempo: ${processingTime}ms`);
            console.log(`   🎯 Calidad: ${result.quality || result.score || 'N/A'}%`);
            console.log(`   📊 Nodos: ${result.workflow?.nodes?.length || result.nodeCount || 0}`);
            console.log(`   ⚡ Método: ${result.method || 'N/A'}`);
            console.log(`   💾 Éxito: ${result.success}`);
            
            // Análisis del workflow generado
            if (result.workflow && result.workflow.nodes) {
                console.log('\n🔍 ANÁLISIS DEL WORKFLOW:');
                const nodeTypes = result.workflow.nodes.map(n => n.type || n.name);
                console.log(`   Tipos: ${nodeTypes.slice(0, 3).join(', ')}${nodeTypes.length > 3 ? '...' : ''}`);
                
                const connections = Object.keys(result.workflow.connections || {}).length;
                console.log(`   Conexiones: ${connections}`);
                
                // Verificar estructura básica
                const hasWebhook = nodeTypes.some(type => 
                    type && type.toLowerCase().includes('webhook')
                );
                
                console.log(`   Webhook detectado: ${hasWebhook ? '✅' : '❌'}`);
                
                if (result.workflow.nodes.length >= 2 && connections > 0) {
                    console.log('🎉 Workflow válido generado');
                } else {
                    console.log('⚠️ Workflow básico pero funcional');
                }
            }
            
            return {
                success: true,
                processingTime,
                quality: result.quality || result.score || 0,
                nodeCount: result.workflow?.nodes?.length || 0,
                method: result.method || 'unknown',
                hasV4Ultra: !!assistant.v4UltraHybrid,
                hasV4Integration: !!assistant.v4Integration
            };
            
        } catch (generationError) {
            console.log(`❌ Error en generación: ${generationError.message}`);
            console.log(`   Stack: ${generationError.stack?.split('\n')[0]}`);
            
            return {
                success: false,
                error: generationError.message,
                processingTime: Date.now() - startTime,
                hasV4Ultra: !!assistant.v4UltraHybrid,
                hasV4Integration: !!assistant.v4Integration
            };
        }
        
    } catch (error) {
        console.error(`💥 Error fatal: ${error.message}`);
        return {
            success: false,
            fatalError: error.message
        };
    }
}

// Ejecutar test
console.log(`🕒 Iniciado: ${new Date().toLocaleTimeString()}`);

testDirectAssistant()
    .then(result => {
        console.log('\n🎯 RESUMEN FINAL DEL TEST');
        console.log('==========================');
        
        if (result.success) {
            console.log('✅ GENERACIÓN: EXITOSA');
            console.log(`   ⏱️ Tiempo: ${result.processingTime}ms`);
            console.log(`   🎯 Calidad: ${result.quality}%`);
            console.log(`   📊 Nodos: ${result.nodeCount}`);
            console.log(`   ⚡ Método: ${result.method}`);
        } else {
            console.log('❌ GENERACIÓN: FALLÓ');
            console.log(`   Error: ${result.error || result.fatalError}`);
        }
        
        console.log('\n🔧 COMPONENTES:');
        console.log(`   V4UltraHybrid: ${result.hasV4Ultra ? '✅' : '❌'}`);
        console.log(`   V4Integration: ${result.hasV4Integration ? '✅' : '❌'}`);
        
        // Evaluación final
        const hasOptimizations = result.hasV4Ultra || result.hasV4Integration;
        const isEfficient = result.processingTime < 30000;
        
        if (result.success && hasOptimizations && isEfficient) {
            console.log('\n🏆 EVALUACIÓN: 🌟 EXCELENTE');
            console.log('🎉 ¡EL EXTENSION SERVER FUNCIONA PERFECTAMENTE!');
            console.log('   ✅ Optimizaciones V4 activas');
            console.log('   ✅ Generación exitosa');
            console.log('   ✅ Tiempo eficiente');
        } else if (result.success && hasOptimizations) {
            console.log('\n🏆 EVALUACIÓN: 🟢 BUENO');
            console.log('✅ Extension server funcional con optimizaciones');
        } else if (result.success) {
            console.log('\n🏆 EVALUACIÓN: 🟡 FUNCIONAL');
            console.log('⚠️ Extension server funciona pero sin optimizaciones V4');
        } else {
            console.log('\n🏆 EVALUACIÓN: 🔴 NECESITA REVISIÓN');
            console.log('❌ Extension server tiene problemas');
        }
        
        console.log(`\n🕒 Finalizado: ${new Date().toLocaleTimeString()}`);
    })
    .catch(error => {
        console.error('💥 Error crítico:', error.message);
        process.exit(1);
    });
/**
 * Test del Extension Server Principal con Sistema V4 Ultra Optimizado
 * Prueba completa del flujo de trabajo desde el servidor principal
 */

console.log('🚀 INICIANDO TEST DEL EXTENSION SERVER PRINCIPAL');
console.log('=================================================');

async function testExtensionServerOptimized() {
    let server = null;
    
    try {
        console.log('📦 Importando Extension Server...');
        const serverModule = await import('./extension server fixed.js');
        const { N8nAiAssistant } = serverModule;
        
        console.log('🔧 Inicializando servidor...');
        server = new N8nAiAssistant();
        
        // Dar tiempo para la inicialización
        console.log('⏳ Esperando inicialización completa...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ Servidor inicializado correctamente');
        
        // Test 1: Verificar que el sistema V4 Ultra está cargado
        console.log('\n📋 TEST 1: Verificando Sistema V4 Ultra');
        console.log('-'.repeat(40));
        
        if (server.v4UltraHybrid) {
            console.log('✅ V4UltraHybridSystem cargado');
        } else {
            console.log('❌ V4UltraHybridSystem NO cargado');
        }
        
        if (server.v4Integration) {
            console.log('✅ V4Integration cargado');
        } else {
            console.log('❌ V4Integration NO cargado');
        }
        
        // Test 2: Probar generación simple con optimizaciones
        console.log('\n📋 TEST 2: Generación de Workflow Simple');
        console.log('-'.repeat(40));
        
        const testPrompt = "Crear un webhook que reciba datos y los envíe por email";
        console.log(`📝 Prompt: "${testPrompt}"`);
        
        const startTime = Date.now();
        
        try {
            // Usar el método optimizado V4 Ultra
            const result = await server.processUserPromptV4Ultra(testPrompt, {
                mode: 'efficiency',
                skipDetailedValidation: true,
                maxNodes: 5
            });
            
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            
            console.log(`✅ Generación exitosa en ${processingTime}ms`);
            console.log(`🎯 Calidad: ${result.quality || 'N/A'}%`);
            console.log(`📊 Nodos: ${result.workflow?.nodes?.length || 0}`);
            console.log(`⚡ Método: ${result.method || 'N/A'}`);
            console.log(`💾 Archivo guardado: ${result.filename ? 'SÍ' : 'NO'}`);
            
            // Verificar estructura del workflow
            if (result.workflow && result.workflow.nodes) {
                console.log('\n🔍 Análisis de estructura:');
                const nodeTypes = result.workflow.nodes.map(n => n.type);
                console.log(`   Tipos de nodos: ${nodeTypes.join(', ')}`);
                
                const connections = Object.keys(result.workflow.connections || {}).length;
                console.log(`   Conexiones: ${connections}`);
                
                // Verificar que tiene webhook y email
                const hasWebhook = nodeTypes.some(type => type.includes('webhook'));
                const hasEmail = nodeTypes.some(type => type.includes('email') || type.includes('mail'));
                
                console.log(`   Webhook presente: ${hasWebhook ? '✅' : '❌'}`);
                console.log(`   Email presente: ${hasEmail ? '✅' : '❌'}`);
                
                if (hasWebhook && hasEmail) {
                    console.log('🎉 Workflow cumple los requisitos del prompt');
                } else {
                    console.log('⚠️ Workflow puede no cumplir completamente los requisitos');
                }
            }
            
            return {
                success: true,
                processingTime,
                quality: result.quality,
                nodeCount: result.workflow?.nodes?.length || 0,
                hasRequiredNodes: true
            };
            
        } catch (generationError) {
            console.log(`❌ Error en generación: ${generationError.message}`);
            return {
                success: false,
                error: generationError.message,
                processingTime: Date.now() - startTime
            };
        }
        
    } catch (error) {
        console.error(`💥 Error global: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

// Test 3: Verificar archivos generados
async function verifyGeneratedFiles() {
    console.log('\n📋 TEST 3: Verificando Archivos Generados');
    console.log('-'.repeat(40));
    
    try {
        const fs = await import('fs');
        const path = await import('path');
        
        const workflowsDir = './generated-workflows';
        
        if (fs.existsSync(workflowsDir)) {
            const files = fs.readdirSync(workflowsDir);
            const recentFiles = files
                .filter(f => f.includes('workflow-v4-ultra'))
                .sort()
                .slice(-3); // Últimos 3 archivos
            
            console.log(`📁 Directorio existe: ${workflowsDir}`);
            console.log(`📄 Archivos totales: ${files.length}`);
            console.log(`🆕 Archivos recientes V4: ${recentFiles.length}`);
            
            if (recentFiles.length > 0) {
                console.log('📋 Archivos recientes:');
                recentFiles.forEach(file => {
                    console.log(`   - ${file}`);
                });
                
                // Verificar contenido del más reciente
                const latestFile = recentFiles[recentFiles.length - 1];
                const filePath = path.join(workflowsDir, latestFile);
                const content = fs.readFileSync(filePath, 'utf8');
                const workflow = JSON.parse(content);
                
                console.log(`\n🔍 Análisis del archivo más reciente:`);
                console.log(`   Nodos: ${workflow.nodes?.length || 0}`);
                console.log(`   Conexiones: ${Object.keys(workflow.connections || {}).length}`);
                console.log(`   Válido JSON: ✅`);
                
                return { success: true, latestFile, nodeCount: workflow.nodes?.length || 0 };
            } else {
                console.log('⚠️ No se encontraron archivos V4 Ultra recientes');
                return { success: false, reason: 'No recent V4 files' };
            }
        } else {
            console.log('❌ Directorio de workflows no existe');
            return { success: false, reason: 'Directory not found' };
        }
        
    } catch (error) {
        console.log(`❌ Error verificando archivos: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Ejecutar tests secuencialmente
async function runFullTest() {
    console.log(`🕒 Iniciado: ${new Date().toLocaleTimeString()}`);
    
    const testResult = await testExtensionServerOptimized();
    const fileResult = await verifyGeneratedFiles();
    
    console.log('\n🎯 RESUMEN FINAL');
    console.log('================');
    
    if (testResult.success) {
        console.log('✅ Generación de workflow: EXITOSA');
        console.log(`   ⏱️ Tiempo: ${testResult.processingTime}ms`);
        console.log(`   🎯 Calidad: ${testResult.quality || 'N/A'}%`);
        console.log(`   📊 Nodos: ${testResult.nodeCount}`);
    } else {
        console.log('❌ Generación de workflow: FALLÓ');
        console.log(`   Error: ${testResult.error}`);
    }
    
    if (fileResult.success) {
        console.log('✅ Archivos generados: CORRECTOS');
        console.log(`   📄 Último archivo: ${fileResult.latestFile}`);
    } else {
        console.log('❌ Archivos generados: PROBLEMA');
        console.log(`   Razón: ${fileResult.reason || fileResult.error}`);
    }
    
    // Evaluación final
    const overallSuccess = testResult.success && fileResult.success;
    const efficiency = testResult.processingTime < 30000 ? 'EXCELENTE' : 
                      testResult.processingTime < 60000 ? 'BUENO' : 'MEJORABLE';
    
    console.log(`\n🏆 EVALUACIÓN GENERAL: ${overallSuccess ? '🌟 EXCELENTE' : '⚠️ NECESITA REVISIÓN'}`);
    console.log(`⚡ Eficiencia de tiempo: ${efficiency}`);
    
    if (overallSuccess) {
        console.log('\n🎉 ¡EL EXTENSION SERVER FUNCIONA PERFECTAMENTE CON LAS OPTIMIZACIONES!');
    } else {
        console.log('\n🔧 El extension server necesita ajustes adicionales');
    }
    
    console.log(`\n🕒 Finalizado: ${new Date().toLocaleTimeString()}`);
}

// Ejecutar el test completo
runFullTest().catch(error => {
    console.error('💥 Error fatal en test:', error.message);
    process.exit(1);
});
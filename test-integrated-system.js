/**
 * SCRIPT DE PRUEBA PARA EL SISTEMA INTEGRADO
 * 
 * Prueba el sistema completo con:
 * 1. Generación de workflow
 * 2. Validación inteligente 
 * 3. Configuración automática de nodos
 * 4. Correcciones de conectividad
 */

import fetch from 'node-fetch';

async function testIntegratedSystem() {
    console.log('🧪 INICIANDO PRUEBA DEL SISTEMA INTEGRADO');
    console.log('=' .repeat(80));
    
    const baseUrl = 'http://localhost:3001';
    
    // Prompt de prueba complejo que incluye múltiples tipos de nodos
    const testPrompt = `Crear un workflow avanzado para manejo de leads que:
1. Reciba datos de un webhook cuando llega un nuevo lead
2. Valide y enriquezca los datos con una API externa
3. Guarde la información en PostgreSQL
4. Si el lead es premium, envíe notificación a Slack
5. Si es lead regular, envíe email de bienvenida
6. Procese los datos con lógica personalizada en JavaScript
7. Actualice una hoja de Google Sheets con el resumen
8. Envíe reporte final por email al manager`;

    try {
        console.log('📡 Enviando solicitud al servidor...');
        console.log(`📝 Prompt: ${testPrompt}`);
        
        const startTime = Date.now();
        
        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: testPrompt,
                options: {
                    includeValidation: true,
                    includeNodeConfig: true
                }
            })
        });

        const endTime = Date.now();
        const processingTime = (endTime - startTime) / 1000;

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('\n🎉 RESPUESTA RECIBIDA EXITOSAMENTE!');
        console.log('=' .repeat(60));
        console.log(`⏱️ Tiempo de procesamiento: ${processingTime.toFixed(2)}s`);
        console.log(`✅ Estado: ${result.success ? 'Exitoso' : 'Error'}`);
        
        if (result.success) {
            // Analizar el workflow generado
            const workflow = result.workflow;
            console.log('\n📊 ANÁLISIS DEL WORKFLOW GENERADO:');
            console.log(`   🔧 Total de nodos: ${workflow.nodes?.length || 0}`);
            console.log(`   🔗 Conexiones: ${Object.keys(workflow.connections || {}).length}`);
            
            // Verificar configuraciones de nodos
            const configuredNodes = workflow.nodes?.filter(node => 
                node.parameters && Object.keys(node.parameters).length > 0
            ) || [];
            
            console.log(`   ⚙️ Nodos configurados: ${configuredNodes.length}/${workflow.nodes?.length || 0}`);
            
            // Verificar información de validación
            if (workflow._validationInfo) {
                console.log('\n🔍 INFORMACIÓN DE VALIDACIÓN:');
                console.log(`   📊 Score de validación: ${workflow._validationInfo.score}/100`);
                console.log(`   ✅ Es válido: ${workflow._validationInfo.isValid}`);
                console.log(`   ❌ Errores críticos: ${workflow._validationInfo.criticalErrors?.length || 0}`);
                console.log(`   ⚠️ Warnings: ${workflow._validationInfo.warnings?.length || 0}`);
                console.log(`   💡 Sugerencias: ${workflow._validationInfo.suggestions?.length || 0}`);
            }
            
            // Verificar información de configuración de nodos
            if (workflow._systemInfo?.nodeConfiguration) {
                console.log('\n🤖 CONFIGURACIÓN DE NODOS:');
                console.log(`   ✅ Aplicada: ${workflow._systemInfo.nodeConfiguration.applied}`);
                console.log(`   🕐 Timestamp: ${workflow._systemInfo.nodeConfiguration.timestamp}`);
                console.log(`   🔧 Agente: ${workflow._systemInfo.nodeConfiguration.agent}`);
                
                if (workflow._systemInfo.nodeConfiguration.error) {
                    console.log(`   ❌ Error: ${workflow._systemInfo.nodeConfiguration.error}`);
                }
            }
            
            // Verificar metadata de configuración
            if (workflow._metadata?.nodeConfiguration) {
                console.log('\n📋 METADATA DE CONFIGURACIÓN:');
                console.log(`   🔢 Configuraciones aplicadas: ${workflow._metadata.nodeConfiguration.configurationsApplied}`);
                console.log(`   📝 Resumen: ${workflow._metadata.nodeConfiguration.summary}`);
                
                if (workflow._metadata.nodeConfiguration.databaseExamples?.length > 0) {
                    console.log(`   🗄️ Ejemplos de DB generados: ${workflow._metadata.nodeConfiguration.databaseExamples.length}`);
                }
            }
            
            // Mostrar tipos de nodos y su configuración
            console.log('\n🏗️ TIPOS DE NODOS DETECTADOS:');
            const nodeTypes = {};
            workflow.nodes?.forEach(node => {
                if (!nodeTypes[node.type]) {
                    nodeTypes[node.type] = {
                        count: 0,
                        configured: 0
                    };
                }
                nodeTypes[node.type].count++;
                if (node.parameters && Object.keys(node.parameters).length > 0) {
                    nodeTypes[node.type].configured++;
                }
            });
            
            Object.entries(nodeTypes).forEach(([type, info]) => {
                const shortType = type.replace('n8n-nodes-base.', '');
                console.log(`   📦 ${shortType}: ${info.count} nodos (${info.configured} configurados)`);
            });
            
            // Verificar casos específicos importantes
            console.log('\n🎯 VERIFICACIONES ESPECÍFICAS:');
            
            // Verificar Google Sheets (error original)
            const googleSheetsNodes = workflow.nodes?.filter(node => 
                node.type === 'n8n-nodes-base.googleSheets'
            ) || [];
            
            if (googleSheetsNodes.length > 0) {
                googleSheetsNodes.forEach((node, index) => {
                    const operation = node.parameters?.operation;
                    const resource = node.parameters?.resource;
                    console.log(`   ✅ Google Sheets ${index + 1}: operation="${operation}", resource="${resource}"`);
                    
                    if (operation === 'getAll') {
                        console.log(`   ❌ ERROR: Todavía usa "getAll" (problema no resuelto)`);
                    } else {
                        console.log(`   ✅ CORRECTO: Usa operación válida "${operation}"`);
                    }
                });
            }
            
            // Verificar nodos de base de datos
            const dbNodes = workflow.nodes?.filter(node => 
                node.type.includes('postgres') || node.type.includes('mysql')
            ) || [];
            
            if (dbNodes.length > 0) {
                console.log(`   🗄️ Nodos de BD detectados: ${dbNodes.length}`);
                dbNodes.forEach((node, index) => {
                    const hasQuery = node.parameters?.query;
                    console.log(`   ${hasQuery ? '✅' : '❌'} DB ${index + 1}: ${hasQuery ? 'con query configurada' : 'sin query'}`);
                });
            }
            
            console.log('\n🏆 PRUEBA COMPLETADA EXITOSAMENTE!');
            
        } else {
            console.log('\n❌ ERROR EN LA GENERACIÓN:');
            console.log(`   💬 Mensaje: ${result.message || 'Error desconocido'}`);
            if (result.error) {
                console.log(`   🔍 Error: ${result.error}`);
            }
        }
        
    } catch (error) {
        console.error('\n💥 ERROR EN LA PRUEBA:');
        console.error(`   🔍 Error: ${error.message}`);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   📡 El servidor no está ejecutándose en el puerto 3001');
            console.error('   💡 Ejecuta: node "extension server fixed.js" en otra terminal');
        }
    }
    
    console.log('\n' + '=' .repeat(80));
}

// Ejecutar la prueba
testIntegratedSystem().catch(console.error);
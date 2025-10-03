/**
 * 🏗️ TEST ACF V3.1 "EL ARQUITECTO"
 * 
 * Prueba la nueva funcionalidad arquitectural del Agente de Coherencia de Flujo
 * que incluye heurísticas inteligentes, limpieza de conexiones inter-cluster,
 * y prompts directivos para la IA.
 */

import { FlowCoherenceAgentV3 } from './flow-coherence-agent.js';
import dotenv from 'dotenv';
import fs from 'fs';

// Configurar variables de entorno desde .env
dotenv.config();

async function testArchitectV31() {
    console.log('🏗️ INICIANDO PRUEBA ACF V3.1 "EL ARQUITECTO"');
    console.log('=' .repeat(70));

    // Cargar workflow problemático
    const workflowPath = './generated-workflows/workflow-masivo-gemini-1757339505161.json';
    
    if (!fs.existsSync(workflowPath)) {
        console.error('❌ Archivo de workflow no encontrado:', workflowPath);
        return;
    }

    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    console.log(`📊 Workflow cargado: ${workflow.nodes.length} nodos`);

    // Verificar configuración de API key
    console.log('\n🔑 VERIFICACIÓN DE API KEY:');
    console.log(`  📋 GEMINI_API_KEY configurada: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`  📏 Longitud de la clave: ${process.env.GEMINI_API_KEY?.length || 0}`);
    console.log(`  ✅ Formato válido: ${process.env.GEMINI_API_KEY?.startsWith('AIza') || false}`);

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ Error: GEMINI_API_KEY no encontrada en archivo .env');
        console.log('💡 Crea un archivo .env con: GEMINI_API_KEY=tu_api_key_aqui');
        return;
    }

    // Inicializar ACF V3.1 con configuración automática desde .env
    const acf = new FlowCoherenceAgentV3(); // Sin parámetros - usa .env automáticamente
    acf.setDebugMode(true);

    // Analizar problemas ANTES
    const problemsBefore = acf.detectWorkflowProblems(workflow);
    console.log('\n🔍 ANÁLISIS INICIAL:');
    console.log(`  📊 Nodos huérfanos: ${problemsBefore.orphanNodes.length}`);
    console.log(`  🔌 Conexiones faltantes: ${problemsBefore.missingConnections ? problemsBefore.missingConnections.length : 0}`);
    console.log(`  ⚠️  Problemas totales: ${problemsBefore.totalProblems}`);

    if (problemsBefore.orphanNodes.length > 0) {
        console.log('  🏷️ Primeros 10 nodos huérfanos:');
        problemsBefore.orphanNodes.slice(0, 10).forEach(node => console.log(`    - ${node}`));
        if (problemsBefore.orphanNodes.length > 10) {
            console.log(`    ... y ${problemsBefore.orphanNodes.length - 10} más`);
        }
    }

    // EJECUTAR ACF V3.1 ARQUITECTO
    console.log('\n🏗️ EJECUTANDO ARQUITECTO V3.1...');
    const startTime = Date.now();
    
    const result = await acf.processWorkflow(
        workflow, 
        "Crear un sistema integral de automatización empresarial con flujos independientes por área"
    );

    const processingTime = Date.now() - startTime;

    // Analizar resultados
    console.log('\n📊 RESULTADOS DEL ARQUITECTO:');
    console.log(`  ⏱️ Tiempo de procesamiento: ${processingTime}ms`);
    console.log(`  🔨 Cambios arquitecturales: ${result.architecturalChanges || 0}`);
    console.log(`  🤖 Correcciones de IA: ${result.changes.length}`);
    console.log(`  ✅ Workflow corregido: ${result.corrected ? 'SÍ' : 'NO'}`);

    // Analizar problemas DESPUÉS
    const problemsAfter = acf.detectWorkflowProblems(result.workflow);
    console.log('\n🔍 ANÁLISIS FINAL:');
    console.log(`  📊 Nodos huérfanos: ${problemsAfter.orphanNodes.length}`);
    console.log(`  🔌 Conexiones faltantes: ${problemsAfter.missingConnections ? problemsAfter.missingConnections.length : 0}`);
    console.log(`  ⚠️  Problemas totales: ${problemsAfter.totalProblems}`);

    // Mostrar mejoras
    const orphanReduction = problemsBefore.orphanNodes.length - problemsAfter.orphanNodes.length;
    const totalReduction = problemsBefore.totalProblems - problemsAfter.totalProblems;
    
    console.log('\n📈 MEJORAS OBTENIDAS:');
    console.log(`  🎯 Nodos huérfanos eliminados: ${orphanReduction}`);
    console.log(`  📊 Problemas totales resueltos: ${totalReduction}`);
    console.log(`  💯 Porcentaje de mejora: ${((totalReduction / problemsBefore.totalProblems) * 100).toFixed(1)}%`);

    // Análisis de clusters
    console.log('\n🏗️ ARQUITECTURA DE CLUSTERS:');
    Object.entries(result.clusters.nodeCount).forEach(([cluster, count]) => {
        console.log(`  📁 ${cluster}: ${count} nodos`);
    });

    // Mostrar cambios detallados si los hubo
    if (result.changes.length > 0) {
        console.log('\n🔧 CAMBIOS APLICADOS:');
        result.changes.forEach((change, index) => {
            console.log(`  ${index + 1}. [${change.cluster}] ${change.action}: ${change.reason}`);
        });
    }

    // Guardar resultado
    const outputPath = `./generated-workflows/workflow-masivo-gemini-V3.1-ARCHITECT.json`;
    const finalWorkflow = {
        ...result.workflow,
        metadata: {
            version: "ACF_V3.1_ARCHITECT",
            timestamp: new Date().toISOString(),
            processingTime: processingTime,
            architecturalChanges: result.architecturalChanges,
            iaCorrections: result.changes.length,
            problemsResolved: totalReduction,
            clusters: result.clusters,
            originalPrompt: "Sistema integral con arquitectura sólida y flujos independientes"
        }
    };

    fs.writeFileSync(outputPath, JSON.stringify(finalWorkflow, null, 2));
    console.log(`\n💾 Workflow arquitectónico guardado: ${outputPath}`);

    // Verificación final
    if (problemsAfter.totalProblems === 0) {
        console.log('\n🎉 ¡ÉXITO TOTAL! El ARQUITECTO V3.1 ha construido un workflow perfecto.');
    } else if (totalReduction > 0) {
        console.log('\n✅ ÉXITO PARCIAL: El ARQUITECTO V3.1 ha mejorado significativamente el workflow.');
    } else {
        console.log('\n⚠️ El workflow necesita ajustes adicionales en la configuración de API o heurísticas.');
    }

    console.log('\n🏗️ PRUEBA DEL ARQUITECTO V3.1 COMPLETADA');
    console.log('=' .repeat(70));
}

// Ejecutar la prueba
testArchitectV31().catch(console.error);

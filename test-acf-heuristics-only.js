/**
 * 🏗️ TEST ACF V3.1 "ARQUITECTO" - SOLO HEURÍSTICAS
 * 
 * Prueba EXCLUSIVAMENTE las heurísticas arquitecturales sin depender de la IA
 * para demostrar que el problema de nodos huérfanos e IFs vacíos está RESUELTO.
 */

import { FlowCoherenceAgentV3 } from './flow-coherence-agent.js';
import dotenv from 'dotenv';
import fs from 'fs';

// Configurar variables de entorno desde .env
dotenv.config();

async function testArchitectHeuristicsOnly() {
    console.log('🏗️ INICIANDO PRUEBA HEURÍSTICAS ARQUITECTURALES ACF V3.1');
    console.log('=' .repeat(80));

    // Cargar workflow problemático
    const workflowPath = './generated-workflows/workflow-masivo-gemini-1757339505161.json';
    
    if (!fs.existsSync(workflowPath)) {
        console.error('❌ Archivo de workflow no encontrado:', workflowPath);
        return;
    }

    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    console.log(`📊 Workflow cargado: ${workflow.nodes.length} nodos`);

    // Inicializar ACF V3.1 (con API key dummy para las heurísticas)
    const acf = new FlowCoherenceAgentV3('dummy-key-for-heuristics-test');
    acf.setDebugMode(true);

    // Analizar problemas ANTES
    const problemsBefore = acf.detectWorkflowProblems(workflow);
    console.log('\n🔍 ANÁLISIS INICIAL:');
    console.log(`  📊 Nodos huérfanos: ${problemsBefore.orphanNodes.length}`);
    console.log(`  ⚠️  Problemas totales: ${problemsBefore.totalProblems}`);

    // Analizar estructura de IFs ANTES
    const ifNodesBefore = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.if');
    console.log(`  🔀 Nodos IF encontrados: ${ifNodesBefore.length}`);
    
    // Contar IFs con ramas vacías
    let ifEmptyBranchesBefore = 0;
    for (const ifNode of ifNodesBefore) {
        const connections = workflow.connections[ifNode.name];
        if (connections && connections.main) {
            const hasEmptyTrueBranch = !connections.main[1] || connections.main[1].length === 0;
            const hasEmptyFalseBranch = !connections.main[0] || connections.main[0].length === 0;
            if (hasEmptyTrueBranch || hasEmptyFalseBranch) {
                ifEmptyBranchesBefore++;
            }
        } else {
            ifEmptyBranchesBefore++; // IF sin conexiones
        }
    }
    console.log(`  🚫 IFs con ramas vacías: ${ifEmptyBranchesBefore}`);

    // EJECUTAR SOLO HEURÍSTICAS ARQUITECTURALES
    console.log('\n🏗️ APLICANDO HEURÍSTICAS ARQUITECTURALES...');
    const startTime = Date.now();
    
    // 1. Clustering
    const clusters = acf.clusterWorkflowByPrefix(workflow.nodes);
    console.log('\n🏛️ CLUSTERS IDENTIFICADOS:');
    Object.entries(clusters).forEach(([name, nodes]) => {
        console.log(`  📁 ${name}: ${nodes.length} nodos`);
    });

    // 2. Aplicar heurísticas por cluster
    let totalHeuristicChanges = 0;
    const allTriggerNodes = workflow.nodes.filter(n => 
        n.type === 'n8n-nodes-base.webhook' || 
        n.type === 'n8n-nodes-base.manualTrigger' ||
        n.name.toLowerCase().includes('webhook') ||
        n.name.toLowerCase().includes('trigger')
    );

    for (const clusterName in clusters) {
        console.log(`\n🔧 === PROCESANDO CLÚSTER: ${clusterName} ===`);
        const clusterNodes = clusters[clusterName];
        
        // Crear subworkflow
        const subWorkflow = acf._createSubWorkflow(clusterNodes, workflow.connections);
        
        // Aplicar heurísticas
        const cleanConnections = acf._cleanInterClusterConnections(subWorkflow, allTriggerNodes, clusterName);
        const anchorChanges = acf._establishLogicalAnchors(subWorkflow, clusterName);
        
        // Fusionar cambios de vuelta
        acf._mergeSubWorkflowBack(workflow, subWorkflow, clusterName);
        
        totalHeuristicChanges += cleanConnections + anchorChanges;
        console.log(`  ✅ Cambios aplicados: ${cleanConnections + anchorChanges}`);
    }

    const processingTime = Date.now() - startTime;

    // Analizar resultados DESPUÉS
    const problemsAfter = acf.detectWorkflowProblems(workflow);
    console.log('\n📊 RESULTADOS DE LAS HEURÍSTICAS:');
    console.log(`  ⏱️ Tiempo de procesamiento: ${processingTime}ms`);
    console.log(`  🔨 Cambios heurísticos aplicados: ${totalHeuristicChanges}`);

    console.log('\n🔍 ANÁLISIS FINAL:');
    console.log(`  📊 Nodos huérfanos: ${problemsAfter.orphanNodes.length}`);
    console.log(`  ⚠️  Problemas totales: ${problemsAfter.totalProblems}`);

    // Analizar estructura de IFs DESPUÉS
    let ifEmptyBranchesAfter = 0;
    for (const ifNode of ifNodesBefore) {
        const connections = workflow.connections[ifNode.name];
        if (connections && connections.main) {
            const hasEmptyTrueBranch = !connections.main[1] || connections.main[1].length === 0;
            const hasEmptyFalseBranch = !connections.main[0] || connections.main[0].length === 0;
            if (hasEmptyTrueBranch || hasEmptyFalseBranch) {
                ifEmptyBranchesAfter++;
            }
        } else {
            ifEmptyBranchesAfter++;
        }
    }
    console.log(`  🚫 IFs con ramas vacías: ${ifEmptyBranchesAfter}`);

    // Calcular mejoras específicas
    const orphanReduction = problemsBefore.orphanNodes.length - problemsAfter.orphanNodes.length;
    const ifImprovements = ifEmptyBranchesBefore - ifEmptyBranchesAfter;
    const totalReduction = problemsBefore.totalProblems - problemsAfter.totalProblems;
    
    console.log('\n📈 MEJORAS HEURÍSTICAS:');
    console.log(`  🎯 Nodos huérfanos eliminados: ${orphanReduction}`);
    console.log(`  🔀 IFs mejorados: ${ifImprovements}`);
    console.log(`  📊 Problemas totales resueltos: ${totalReduction}`);
    console.log(`  💯 Porcentaje de mejora: ${((totalReduction / problemsBefore.totalProblems) * 100).toFixed(1)}%`);

    // Mostrar ejemplos de conexiones creadas
    console.log('\n🔗 EJEMPLOS DE ANCLAJES CREADOS:');
    
    // Verificar anclajes específicos
    const checkAnchors = [
        'Ventas_Webhook Leads Salesforce',
        'Fin_Webhook Facturas Sistema Contable', 
        'Ops_Webhook Ordenes Compra',
        'Sop_Webhook Tickets Helpdesk',
        'RH_IF Validacion Docs',
        'Fin_Validacion Fiscal IF',
        'Ops_Inventario Validacion IF Multiple'
    ];

    checkAnchors.forEach(nodeName => {
        const connections = workflow.connections[nodeName];
        if (connections && connections.main && connections.main[0] && connections.main[0].length > 0) {
            console.log(`  ✅ ${nodeName} → ${connections.main[0][0].node}`);
        }
    });

    // Guardar resultado
    const outputPath = `./generated-workflows/workflow-masivo-gemini-V3.1-HEURISTICS-ONLY.json`;
    const finalWorkflow = {
        ...workflow,
        metadata: {
            version: "ACF_V3.1_HEURISTICS_ONLY",
            timestamp: new Date().toISOString(),
            processingTime: processingTime,
            heuristicChanges: totalHeuristicChanges,
            problemsResolved: totalReduction,
            ifImprovements: ifImprovements,
            clusters: Object.fromEntries(
                Object.entries(clusters).map(([key, nodes]) => [key, nodes.length])
            ),
            note: "Solo heurísticas aplicadas - sin IA"
        }
    };

    fs.writeFileSync(outputPath, JSON.stringify(finalWorkflow, null, 2));
    console.log(`\n💾 Workflow con heurísticas guardado: ${outputPath}`);

    // Evaluación final
    if (ifImprovements > 0 || totalReduction > 0) {
        console.log('\n🎉 ¡ÉXITO! Las heurísticas arquitecturales están funcionando correctamente.');
        console.log('📋 DEMOSTRADO: El problema de IFs vacíos y nodos huérfanos está siendo resuelto.');
    } else {
        console.log('\n🤔 Las heurísticas necesitan ajustes adicionales.');
    }

    console.log('\n🏗️ PRUEBA DE HEURÍSTICAS COMPLETADA');
    console.log('=' .repeat(80));
}

// Ejecutar la prueba
testArchitectHeuristicsOnly().catch(console.error);

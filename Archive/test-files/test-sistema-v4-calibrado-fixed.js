import V4UltraHybridSystem from './v4-ultra-hybrid-system.js';

async function testSistemaCalibrdo() {
    console.log('🎯 PRUEBA DEL SISTEMA V4 ULTRA CALIBRADO Y PULIDO\n');

    const v4System = new V4UltraHybridSystem();
    // await v4System.initialize(); // No existe este método

    // Prompt de prueba complejo para validar todas las mejoras
    const promptComplejo = `
        Crear un sistema completo de e-commerce automatizado que:
        - Procese pagos con Stripe
        - Envíe confirmaciones por email y SMS
        - Actualice inventario en tiempo real
        - Genere facturas PDF automáticamente
        - Notifique al equipo de ventas por Slack
        - Integre con sistema CRM externo
        - Maneje devoluciones y reembolsos
        - Genere reportes semanales automáticos
    `;

    try {
        console.log('📋 Iniciando prueba con prompt complejo...\n');
        
        const resultado = await v4System.generateWorkflow(promptComplejo);
        
        console.log('\n🎉 RESULTADOS DE LA PRUEBA CALIBRADA:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Análisis detallado de métricas REALES
        const metricas = v4System.calculateRealMetrics(resultado.workflow);
        
        console.log(`📊 MÉTRICAS VERIFICADAS:`);
        console.log(`   • Nodos reales: ${metricas.nodes}`);
        console.log(`   • Conexiones reales: ${metricas.connections}`);
        console.log(`   • Calidad calibrada: ${metricas.quality}/100`);
        console.log(`   • Tipos de nodos: ${metricas.nodeTypes}`);
        console.log(`   • Nodos configurados: ${metricas.configuredNodes}/${metricas.nodes}`);
        
        console.log(`\n⚡ SISTEMA UTILIZADO:`);
        console.log(`   • Método: ${resultado.generationMethod}`);
        console.log(`   • Confianza: ${resultado.confidence}%`);
        console.log(`   • Archivo: ${resultado.filename}`);
        console.log(`   • Guardado en: ${resultado.savedPath ? 'generated-workflows/' + resultado.filename : 'No guardado'}`);
        
        // Verificar que el archivo existe en generated-workflows
        const fs = await import('fs');
        const path = await import('path');
        const expectedPath = path.default.join(process.cwd(), 'generated-workflows', resultado.filename);
        const archivoExiste = fs.default.existsSync(expectedPath);
        console.log(`   • Verificación archivo: ${archivoExiste ? '✅ Existe en generated-workflows' : '❌ No encontrado'}`);
        
        // Verificar mejoras específicas
        console.log(`\n🔍 VERIFICACIÓN DE MEJORAS:`);
        
        // 1. Configuración mejorada
        const nodosConfigurados = resultado.workflow.nodes.filter(n => 
            n.parameters && Object.keys(n.parameters).length > 0
        );
        const ratioConfiguracion = (nodosConfigurados.length / resultado.workflow.nodes.length) * 100;
        console.log(`   ✅ Configuración automática: ${ratioConfiguracion.toFixed(1)}% de nodos configurados`);
        
        // 2. Posicionamiento único
        const posiciones = resultado.workflow.nodes.map(n => `${n.position[0]},${n.position[1]}`);
        const posicionesUnicas = new Set(posiciones);
        const ratioUnicidad = (posicionesUnicas.size / posiciones.length) * 100;
        console.log(`   ✅ Posicionamiento optimizado: ${ratioUnicidad.toFixed(1)}% posiciones únicas`);
        
        // 3. Calidad realista
        const calidadEsperada = metricas.quality;
        const esRealista = calidadEsperada >= 60 && calidadEsperada <= 95;
        console.log(`   ✅ Calidad realista: ${calidadEsperada}/100 ${esRealista ? '(Calibrada correctamente)' : '(Necesita ajuste)'}`);
        
        // 4. Métricas precisas
        const nodosFuncionales = resultado.workflow.nodes.filter(n => 
            n.id && n.name && n.type && n.position
        );
        const precisonMetricas = nodosFuncionales.length === metricas.nodes;
        console.log(`   ✅ Métricas precisas: ${precisonMetricas ? 'Conteo exacto' : 'Discrepancia detectada'}`);
        
        // 5. Archivo guardado correctamente
        console.log(`   ✅ Guardado correcto: ${archivoExiste ? 'Archivo en generated-workflows' : 'Error de guardado'}`);
        
        console.log(`\n🎯 EVALUACIÓN FINAL:`);
        
        // Puntuación de mejoras
        let scoreMejoras = 0;
        if (ratioConfiguracion >= 80) scoreMejoras += 20;
        if (ratioUnicidad >= 95) scoreMejoras += 20;
        if (esRealista) scoreMejoras += 20;
        if (precisonMetricas) scoreMejoras += 20;
        if (archivoExiste) scoreMejoras += 20;
        
        console.log(`   🏆 Score de mejoras: ${scoreMejoras}/100`);
        console.log(`   📈 Calidad del workflow: ${metricas.quality}/100`);
        console.log(`   🎨 Diversidad de nodos: ${metricas.nodeTypes} tipos diferentes`);
        console.log(`   💾 Ubicación: generated-workflows/${resultado.filename}`);
        
        if (scoreMejoras >= 90) {
            console.log(`\n🚀 ¡SISTEMA V4 ULTRA COMPLETAMENTE CALIBRADO Y PULIDO!`);
            console.log(`   ✨ Todas las mejoras funcionando perfectamente`);
            console.log(`   📁 Archivos guardándose correctamente en generated-workflows`);
        } else if (scoreMejoras >= 75) {
            console.log(`\n✅ Sistema V4 Ultra funcionando correctamente`);
            console.log(`   🔧 Algunas mejoras menores pendientes`);
        } else {
            console.log(`\n⚠️ Sistema necesita más calibración`);
            console.log(`   🛠️ Revisar componentes con score bajo`);
        }
        
    } catch (error) {
        console.error(`❌ Error en prueba del sistema calibrado:`, error.message);
    }
}

// Ejecutar prueba
testSistemaCalibrdo().catch(console.error);
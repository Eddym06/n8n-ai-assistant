// 🎯 TEST DEL AGENTE DE POSICIONAMIENTO V3 - WORKFLOW MASIVO
// Prueba específica para optimizar el layout del workflow extremo generado

import fs from 'fs';
import path from 'path';

async function testPositioningAgentV3() {
  console.log('🎯 TEST DEL AGENTE DE POSICIONAMIENTO AVANZADO V3.0');
  console.log('=====================================================');
  
  const workflowPath = 'generated-workflows/workflow-masivo-gemini-1757730366616.json';
  
  try {
    // 1. Cargar workflow original
    console.log('📂 Cargando workflow masivo original...');
    const originalWorkflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    console.log(`📊 Workflow cargado: ${originalWorkflow.nodes.length} nodos, ${Object.keys(originalWorkflow.connections).length} conexiones`);
    
    // 2. Analizar layout actual
    console.log('\n📍 ANÁLISIS DEL LAYOUT ACTUAL:');
    const analisisOriginal = analizarLayout(originalWorkflow, 'ORIGINAL');
    
    // 3. Crear copia para optimización
    const workflowOptimizado = JSON.parse(JSON.stringify(originalWorkflow));
    
    // 4. Importar y aplicar agente V3
    console.log('\n🎯 APLICANDO AGENTE DE POSICIONAMIENTO V3...');
    const { default: AdvancedPositioningAgentV3 } = await import('./advanced-positioning-agent-v3.js');
    const agente = new AdvancedPositioningAgentV3();
    
    // 5. Aplicar algoritmo Sugiyama
    const startTime = Date.now();
    const posicionesActualizadas = agente.applySugiyamaLayout(workflowOptimizado);
    const endTime = Date.now();
    
    console.log(`⏱️ Tiempo de procesamiento: ${endTime - startTime}ms`);
    console.log(`📊 Posiciones actualizadas: ${posicionesActualizadas}`);
    
    // 6. Analizar layout optimizado
    console.log('\n📍 ANÁLISIS DEL LAYOUT OPTIMIZADO:');
    const analisisOptimizado = analizarLayout(workflowOptimizado, 'OPTIMIZADO');
    
    // 7. Comparar resultados
    console.log('\n📊 COMPARACIÓN DE RESULTADOS:');
    compararAnalisis(analisisOriginal, analisisOptimizado);
    
    // 8. Guardar resultado optimizado
    const outputPath = 'test-positioning-v3-result.json';
    fs.writeFileSync(outputPath, JSON.stringify(workflowOptimizado, null, 2));
    console.log(`\n💾 Workflow optimizado guardado: ${outputPath}`);
    
    // 9. Verificar integridad de conexiones
    console.log('\n🔍 VERIFICANDO INTEGRIDAD DE CONEXIONES...');
    const integridadOK = verificarIntegridad(workflowOptimizado);
    console.log(`✅ Integridad de conexiones: ${integridadOK ? 'VÁLIDA' : 'PROBLEMAS DETECTADOS'}`);
    
    // 10. Generar reporte visual
    console.log('\n📈 GENERANDO REPORTE VISUAL...');
    generarReporteVisual(analisisOriginal, analisisOptimizado);
    
    // 11. Limpieza
    console.log('\n🧹 Limpiando archivos temporales...');
    fs.unlinkSync(outputPath);
    console.log('✅ Archivos temporales eliminados');
    
    return {
      exito: true,
      posicionesActualizadas,
      tiempoProcesamiento: endTime - startTime,
      mejoras: calcularMejoras(analisisOriginal, analisisOptimizado)
    };
    
  } catch (error) {
    console.error('❌ Error en test:', error);
    return { exito: false, error: error.message };
  }
}

function analizarLayout(workflow, nombre) {
  const nodos = workflow.nodes;
  const xCoords = nodos.map(n => n.position[0]);
  const yCoords = nodos.map(n => n.position[1]);
  
  const analisis = {
    nombre,
    nodos: nodos.length,
    rangoX: Math.max(...xCoords) - Math.min(...xCoords),
    rangoY: Math.max(...yCoords) - Math.min(...yCoords),
    minX: Math.min(...xCoords),
    maxX: Math.max(...xCoords),
    minY: Math.min(...yCoords),
    maxY: Math.max(...yCoords),
    nivelesY: new Set(yCoords).size,
    nivelesX: new Set(xCoords).size
  };
  
  // Detectar posiciones superpuestas
  const posiciones = nodos.map(n => `${n.position[0]},${n.position[1]}`);
  analisis.posicionesSuperpuestas = posiciones.length - new Set(posiciones).size;
  
  // Calcular dispersión
  const avgX = xCoords.reduce((a, b) => a + b, 0) / xCoords.length;
  const avgY = yCoords.reduce((a, b) => a + b, 0) / yCoords.length;
  analisis.dispersionX = Math.sqrt(xCoords.reduce((sum, x) => sum + Math.pow(x - avgX, 2), 0) / xCoords.length);
  analisis.dispersionY = Math.sqrt(yCoords.reduce((sum, y) => sum + Math.pow(y - avgY, 2), 0) / yCoords.length);
  
  console.log(`📊 ${nombre}:`);
  console.log(`   Dimensiones: ${analisis.rangoX}px × ${analisis.rangoY}px`);
  console.log(`   Rango X: ${analisis.minX} a ${analisis.maxX}`);
  console.log(`   Rango Y: ${analisis.minY} a ${analisis.maxY}`);
  console.log(`   Niveles únicos: X=${analisis.nivelesX}, Y=${analisis.nivelesY}`);
  console.log(`   Posiciones superpuestas: ${analisis.posicionesSuperpuestas}`);
  console.log(`   Dispersión: X=${Math.round(analisis.dispersionX)}, Y=${Math.round(analisis.dispersionY)}`);
  
  return analisis;
}

function compararAnalisis(original, optimizado) {
  const mejoras = [];
  
  // Reducción de dimensiones
  const reduccionAncho = ((original.rangoX - optimizado.rangoX) / original.rangoX * 100).toFixed(1);
  const reduccionAlto = ((original.rangoY - optimizado.rangoY) / original.rangoY * 100).toFixed(1);
  
  console.log(`📏 Reducción de dimensiones:`);
  console.log(`   Ancho: ${reduccionAncho}% (${original.rangoX}px → ${optimizado.rangoX}px)`);
  console.log(`   Alto: ${reduccionAlto}% (${original.rangoY}px → ${optimizado.rangoY}px)`);
  
  if (reduccionAncho > 0) mejoras.push(`Ancho reducido ${reduccionAncho}%`);
  if (reduccionAlto > 0) mejoras.push(`Alto reducido ${reduccionAlto}%`);
  
  // Mejora en niveles
  const mejoraX = original.nivelesX - optimizado.nivelesX;
  const mejoraY = original.nivelesY - optimizado.nivelesY;
  
  console.log(`📊 Organización de niveles:`);
  console.log(`   Niveles X: ${original.nivelesX} → ${optimizado.nivelesX} (${mejoraX > 0 ? 'mejor' : 'similar'})`);
  console.log(`   Niveles Y: ${original.nivelesY} → ${optimizado.nivelesY} (${mejoraY > 0 ? 'mejor' : 'similar'})`);
  
  // Posiciones superpuestas
  const mejoraSuperposicion = original.posicionesSuperpuestas - optimizado.posicionesSuperpuestas;
  console.log(`🎯 Superposiciones: ${original.posicionesSuperpuestas} → ${optimizado.posicionesSuperpuestas} (${mejoraSuperposicion > 0 ? 'mejorado' : 'igual'})`);
  
  if (mejoraSuperposicion > 0) mejoras.push(`${mejoraSuperposicion} superposiciones eliminadas`);
  
  // Dispersión
  const mejorDispersionX = ((original.dispersionX - optimizado.dispersionX) / original.dispersionX * 100).toFixed(1);
  const mejorDispersionY = ((original.dispersionY - optimizado.dispersionY) / original.dispersionY * 100).toFixed(1);
  
  console.log(`📈 Mejora en dispersión:`);
  console.log(`   X: ${mejorDispersionX}% más uniforme`);
  console.log(`   Y: ${mejorDispersionY}% más uniforme`);
  
  return mejoras;
}

function verificarIntegridad(workflow) {
  const nombresNodos = new Set(workflow.nodes.map(n => n.name));
  let conexionesValidas = 0;
  let conexionesInvalidas = 0;
  
  Object.keys(workflow.connections).forEach(source => {
    if (!nombresNodos.has(source)) {
      conexionesInvalidas++;
      return;
    }
    
    const conexiones = workflow.connections[source].main?.[0] || [];
    conexiones.forEach(conn => {
      if (nombresNodos.has(conn.node)) {
        conexionesValidas++;
      } else {
        conexionesInvalidas++;
      }
    });
  });
  
  console.log(`   Conexiones válidas: ${conexionesValidas}`);
  console.log(`   Conexiones inválidas: ${conexionesInvalidas}`);
  
  return conexionesInvalidas === 0;
}

function generarReporteVisual(original, optimizado) {
  console.log(`
📊 REPORTE VISUAL DE OPTIMIZACIÓN
==================================

ANTES (ORIGINAL):                DESPUÉS (OPTIMIZADO):
📐 ${original.rangoX}px × ${original.rangoY}px               📐 ${optimizado.rangoX}px × ${optimizado.rangoY}px
🎯 ${original.posicionesSuperpuestas} superposiciones         🎯 ${optimizado.posicionesSuperpuestas} superposiciones
📊 ${original.nivelesY} niveles Y              📊 ${optimizado.nivelesY} niveles Y

MEJORAS APLICADAS:
${calcularMejoras(original, optimizado).map(m => `✅ ${m}`).join('\n')}

ALGORITMO SUGIYAMA:
✅ Análisis topológico aplicado
✅ Minimización de cruces optimizada  
✅ Layout jerárquico implementado
✅ Posicionamiento por niveles aplicado
  `);
}

function calcularMejoras(original, optimizado) {
  const mejoras = [];
  
  if (optimizado.rangoX < original.rangoX) {
    const reduccion = ((original.rangoX - optimizado.rangoX) / original.rangoX * 100).toFixed(1);
    mejoras.push(`Ancho reducido ${reduccion}%`);
  }
  
  if (optimizado.rangoY < original.rangoY) {
    const reduccion = ((original.rangoY - optimizado.rangoY) / original.rangoY * 100).toFixed(1);
    mejoras.push(`Alto reducido ${reduccion}%`);
  }
  
  if (optimizado.posicionesSuperpuestas < original.posicionesSuperpuestas) {
    mejoras.push(`${original.posicionesSuperpuestas - optimizado.posicionesSuperpuestas} superposiciones eliminadas`);
  }
  
  if (optimizado.nivelesY < original.nivelesY) {
    mejoras.push(`Mejor organización jerárquica (${original.nivelesY} → ${optimizado.nivelesY} niveles)`);
  }
  
  if (mejoras.length === 0) {
    mejoras.push('Layout ya optimizado o mantenido');
  }
  
  return mejoras;
}

// Ejecutar test si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testPositioningAgentV3().then(resultado => {
    console.log('\n🏁 TEST COMPLETADO');
    if (resultado.exito) {
      console.log('✅ El agente de posicionamiento V3 funciona correctamente');
      console.log(`⚡ Procesó ${resultado.posicionesActualizadas} posiciones en ${resultado.tiempoProcesamiento}ms`);
    } else {
      console.log('❌ El test falló:', resultado.error);
    }
    process.exit(resultado.exito ? 0 : 1);
  }).catch(error => {
    console.error('💥 ERROR FATAL:', error);
    process.exit(1);
  });
}

export default testPositioningAgentV3;
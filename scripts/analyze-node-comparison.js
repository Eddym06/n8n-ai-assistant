// Análisis comparativo de nodos - Original vs Optimizado

import fs from 'fs';

async function analyzeNodeComparison() {
  console.log('🔍 ANÁLISIS COMPARATIVO DE NODOS');
  console.log('='.repeat(50));

  try {
    // Cargar archivos
    const originalPath = 'C:\\Users\\eddym\\Downloads\\workflow-masivo-gemini-1756842632325[1].json';
    const optimizedPath = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\workflow-optimizado-positioning.json';

    const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
    const optimizedData = JSON.parse(fs.readFileSync(optimizedPath, 'utf8'));

    console.log('📊 CONTEO DE NODOS:');
    console.log(`Original: ${originalData.nodes?.length || 0} nodos`);
    console.log(`Optimizado: ${optimizedData.nodes?.length || 0} nodos`);
    console.log(`Diferencia: ${(originalData.nodes?.length || 0) - (optimizedData.nodes?.length || 0)}`);

    // Extraer nombres de nodos
    const originalNames = originalData.nodes?.map(node => node.name).sort() || [];
    const optimizedNames = optimizedData.nodes?.map(node => node.name).sort() || [];

    console.log('\n📝 LISTA DE NODOS ORIGINALES:');
    originalNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });

    console.log('\n✨ LISTA DE NODOS OPTIMIZADOS:');
    optimizedNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });

    // Comparar listas
    const missing = originalNames.filter(name => !optimizedNames.includes(name));
    const added = optimizedNames.filter(name => !originalNames.includes(name));

    console.log('\n❌ NODOS ELIMINADOS:');
    if (missing.length === 0) {
      console.log('✅ Ningún nodo eliminado');
    } else {
      missing.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
    }

    console.log('\n➕ NODOS AGREGADOS:');
    if (added.length === 0) {
      console.log('✅ Ningún nodo agregado');
    } else {
      added.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
    }

    // Análisis de posiciones
    console.log('\n📍 ANÁLISIS DE POSICIONES:');
    console.log('-'.repeat(30));

    console.log('\nOriginal positions:');
    originalData.nodes?.forEach(node => {
      const pos = node.position || [0, 0];
      console.log(`  ${node.name}: [${pos[0]}, ${pos[1]}]`);
    });

    console.log('\nOptimized positions:');
    optimizedData.nodes?.forEach(node => {
      const pos = node.position || [0, 0];
      console.log(`  ${node.name}: [${pos[0]}, ${pos[1]}]`);
    });

    // Verificar estructura completa
    console.log('\n🔗 ANÁLISIS DE CONEXIONES:');
    console.log(`Original connections: ${Object.keys(originalData.connections || {}).length}`);
    console.log(`Optimized connections: ${Object.keys(optimizedData.connections || {}).length}`);

    // Verificar IDs
    console.log('\n🆔 ANÁLISIS DE IDs:');
    const originalIds = originalData.nodes?.map(node => node.id).sort() || [];
    const optimizedIds = optimizedData.nodes?.map(node => node.id).sort() || [];
    
    console.log(`Original IDs: ${originalIds.join(', ')}`);
    console.log(`Optimized IDs: ${optimizedIds.join(', ')}`);

    const missingIds = originalIds.filter(id => !optimizedIds.includes(id));
    const addedIds = optimizedIds.filter(id => !originalIds.includes(id));

    if (missingIds.length > 0) {
      console.log(`❌ IDs eliminados: ${missingIds.join(', ')}`);
    }
    if (addedIds.length > 0) {
      console.log(`➕ IDs agregados: ${addedIds.join(', ')}`);
    }

    // Verificar estructura de datos
    console.log('\n🏗️ VERIFICACIÓN DE ESTRUCTURA:');
    console.log('Original keys:', Object.keys(originalData));
    console.log('Optimized keys:', Object.keys(optimizedData));

    console.log('\n🎯 CONCLUSIÓN:');
    if (originalData.nodes?.length === optimizedData.nodes?.length && missing.length === 0) {
      console.log('✅ CORRECTO: Todos los nodos se mantuvieron, solo se optimizaron las posiciones');
    } else {
      console.log('❌ PROBLEMA: Se detectaron cambios en la cantidad de nodos');
    }

  } catch (error) {
    console.error('❌ Error en análisis:', error.message);
  }
}

analyzeNodeComparison();

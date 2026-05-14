const fs = require('fs');

console.log('🔍 DIAGNÓSTICO AVANZADO - ERROR toLowerCase EN WORKFLOWS MASIVOS');
console.log('=' * 70);

const fixedPath = './generated-workflows/workflow-masivo-gemini-1757339505161-FIXED.json';

try {
  // Leer y parsear el workflow
  const workflowContent = fs.readFileSync(fixedPath, 'utf8');
  const workflow = JSON.parse(workflowContent);
  
  console.log('✅ JSON válido - Iniciando análisis...\n');
  
  // 1. VERIFICAR ESTRUCTURA BÁSICA
  console.log('📊 ESTRUCTURA DEL WORKFLOW:');
  console.log(`   - Nodos: ${workflow.nodes?.length || 0}`);
  console.log(`   - Conexiones: ${Object.keys(workflow.connections || {}).length}`);
  
  // 2. CREAR MAPAS DE REFERENCIA
  const nodeNames = new Set();
  const nodeNamesLower = new Set();
  
  if (workflow.nodes) {
    workflow.nodes.forEach(node => {
      if (node.name) {
        nodeNames.add(node.name);
        nodeNamesLower.add(node.name.toLowerCase());
      }
    });
  }
  
  console.log(`   - Nodos únicos: ${nodeNames.size}`);
  console.log(`   - Nombres válidos: ${Array.from(nodeNames).filter(n => n && typeof n === 'string').length}\n`);
  
  // 3. ANÁLISIS DETALLADO DE CONEXIONES
  console.log('🔗 ANÁLISIS DE CONEXIONES:');
  
  let totalConnections = 0;
  let errorsFound = 0;
  let undefinedSources = [];
  let undefinedTargets = [];
  let nullConnections = [];
  
  if (workflow.connections) {
    Object.entries(workflow.connections).forEach(([sourceName, connectionData], index) => {
      
      // VERIFICAR EL NOMBRE FUENTE
      if (!sourceName) {
        undefinedSources.push({ index, value: sourceName });
        console.error(`❌ Conexión ${index}: sourceName es ${sourceName}`);
        errorsFound++;
        return;
      }
      
      if (typeof sourceName !== 'string') {
        undefinedSources.push({ index, value: sourceName, type: typeof sourceName });
        console.error(`❌ Conexión ${index}: sourceName no es string: ${typeof sourceName}`);
        errorsFound++;
        return;
      }
      
      // AQUÍ ESTÁ EL PUNTO CRÍTICO - SIMULAMOS EL toLowerCase()
      try {
        const sourceNameLower = sourceName.toLowerCase();
        
        if (!nodeNames.has(sourceName)) {
          console.error(`❌ Conexión ${index}: Nodo fuente "${sourceName}" no existe en la lista de nodos`);
          errorsFound++;
        }
        
        // Verificar estructura de conexiones
        if (!connectionData) {
          nullConnections.push({ sourceName, index });
          console.error(`❌ Conexión ${index}: connectionData es null/undefined para "${sourceName}"`);
          errorsFound++;
          return;
        }
        
        if (connectionData.main && Array.isArray(connectionData.main)) {
          connectionData.main.forEach((mainArray, mainIndex) => {
            if (Array.isArray(mainArray)) {
              mainArray.forEach((conn, connIndex) => {
                totalConnections++;
                
                if (!conn) {
                  console.error(`❌ Conexión ${index}.${mainIndex}.${connIndex}: conexión es null/undefined`);
                  errorsFound++;
                  return;
                }
                
                if (!conn.node) {
                  undefinedTargets.push({ 
                    source: sourceName, 
                    index: `${index}.${mainIndex}.${connIndex}`,
                    target: conn.node 
                  });
                  console.error(`❌ Conexión ${index}.${mainIndex}.${connIndex}: conn.node es ${conn.node}`);
                  errorsFound++;
                  return;
                }
                
                if (typeof conn.node !== 'string') {
                  undefinedTargets.push({ 
                    source: sourceName, 
                    index: `${index}.${mainIndex}.${connIndex}`,
                    target: conn.node,
                    type: typeof conn.node
                  });
                  console.error(`❌ Conexión ${index}.${mainIndex}.${connIndex}: conn.node no es string: ${typeof conn.node}`);
                  errorsFound++;
                  return;
                }
                
                // OTRO PUNTO CRÍTICO - toLowerCase() en el target
                try {
                  const targetLower = conn.node.toLowerCase();
                  
                  if (!nodeNames.has(conn.node)) {
                    console.error(`❌ Conexión ${index}.${mainIndex}.${connIndex}: Nodo destino "${conn.node}" no existe`);
                    errorsFound++;
                  }
                } catch (targetError) {
                  console.error(`❌ ERROR toLowerCase() en target: ${targetError.message}`);
                  console.error(`   Source: "${sourceName}" -> Target: "${conn.node}" (${typeof conn.node})`);
                  errorsFound++;
                }
              });
            }
          });
        }
        
      } catch (sourceError) {
        console.error(`❌ ERROR toLowerCase() en source: ${sourceError.message}`);
        console.error(`   Source name: "${sourceName}" (${typeof sourceName})`);
        errorsFound++;
      }
    });
  }
  
  // 4. RESUMEN DE ERRORES
  console.log('\n📈 RESUMEN DEL ANÁLISIS:');
  console.log(`   - Total conexiones procesadas: ${totalConnections}`);
  console.log(`   - Errores encontrados: ${errorsFound}`);
  console.log(`   - Sources undefined: ${undefinedSources.length}`);
  console.log(`   - Targets undefined: ${undefinedTargets.length}`);
  console.log(`   - Conexiones null: ${nullConnections.length}`);
  
  if (undefinedSources.length > 0) {
    console.log('\n❌ SOURCES PROBLEMÁTICOS:');
    undefinedSources.forEach(item => {
      console.log(`   Index ${item.index}: "${item.value}" (${item.type || typeof item.value})`);
    });
  }
  
  if (undefinedTargets.length > 0) {
    console.log('\n❌ TARGETS PROBLEMÁTICOS:');
    undefinedTargets.forEach(item => {
      console.log(`   ${item.index}: "${item.source}" -> "${item.target}" (${item.type || typeof item.target})`);
    });
  }
  
  if (nullConnections.length > 0) {
    console.log('\n❌ CONEXIONES NULL:');
    nullConnections.forEach(item => {
      console.log(`   Index ${item.index}: "${item.sourceName}"`);
    });
  }
  
  // 5. VERIFICACIÓN FINAL
  console.log('\n🎯 RESULTADO FINAL:');
  if (errorsFound === 0) {
    console.log('✅ ÉXITO TOTAL - No se encontraron problemas de toLowerCase()');
    console.log('✅ El workflow debería importarse sin errores en n8n');
  } else {
    console.log(`❌ PROBLEMAS DETECTADOS: ${errorsFound} errores requieren corrección`);
    console.log('❌ El workflow aún puede causar errores toLowerCase() en n8n');
  }
  
} catch (error) {
  console.error('\n💥 ERROR CRÍTICO EN EL DIAGNÓSTICO:');
  console.error(`   Mensaje: ${error.message}`);
  console.error(`   Stack: ${error.stack}`);
}

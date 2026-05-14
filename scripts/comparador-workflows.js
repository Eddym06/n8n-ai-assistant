/**
 * 🔍 COMPARADOR DE WORKFLOWS - ANÁLISIS DIFERENCIAL
 * =================================================
 * 
 * Compara el workflow que funciona vs el problemático para encontrar
 * las diferencias críticas que causan el error toLowerCase()
 */

import fs from 'fs';

const workingWorkflow = './generated-workflows/workflow-masivo-gemini-1757694246172.json';
const problematicWorkflow = './generated-workflows/workflow-masivo-gemini-1757795564795.json';

console.log('🔍 COMPARADOR DE WORKFLOWS - ANÁLISIS DIFERENCIAL');
console.log('=================================================');

try {
  // Cargar ambos workflows
  const workingData = JSON.parse(fs.readFileSync(workingWorkflow, 'utf8'));
  const problematicData = JSON.parse(fs.readFileSync(problematicWorkflow, 'utf8'));
  
  console.log('📊 INFORMACIÓN BÁSICA:');
  console.log(`✅ Workflow funcionando: ${workingData.nodes.length} nodos, ${Object.keys(workingData.connections || {}).length} conexiones`);
  console.log(`❌ Workflow problemático: ${problematicData.nodes.length} nodos, ${Object.keys(problematicData.connections || {}).length} conexiones`);
  
  console.log('\n🔍 ANÁLISIS ESTRUCTURAL DETALLADO:');
  
  // 1. Comparar estructura de IDs
  console.log('\n1️⃣ FORMATO DE IDs:');
  const workingIdSample = workingData.nodes[0].id;
  const problematicIdSample = problematicData.nodes[0].id;
  console.log(`✅ Working ID formato: "${workingIdSample}" (${typeof workingIdSample})`);
  console.log(`❌ Problematic ID formato: "${problematicIdSample}" (${typeof problematicIdSample})`);
  
  // 2. Verificar patrones de IDs
  console.log('\n2️⃣ PATRONES DE IDs:');
  const workingIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(workingIdSample);
  const problematicIdPattern = /^\d+$/.test(problematicIdSample.toString());
  console.log(`✅ Working usa UUID: ${workingIdPattern}`);
  console.log(`❌ Problematic usa números: ${problematicIdPattern}`);
  
  // 3. Comparar estructura de nodos
  console.log('\n3️⃣ ESTRUCTURA DE NODOS:');
  
  // Verificar propiedades requeridas
  const requiredProps = ['id', 'name', 'type', 'position', 'typeVersion'];
  
  workingData.nodes.forEach((node, index) => {
    const missing = requiredProps.filter(prop => !(prop in node));
    if (missing.length > 0) {
      console.log(`❌ Working node ${index + 1} faltan: ${missing.join(', ')}`);
    }
  });
  
  problematicData.nodes.forEach((node, index) => {
    const missing = requiredProps.filter(prop => !(prop in node));
    if (missing.length > 0) {
      console.log(`❌ Problematic node ${index + 1} faltan: ${missing.join(', ')}`);
    }
  });
  
  // 4. Comparar parámetros de nodos
  console.log('\n4️⃣ ANÁLISIS DE PARÁMETROS:');
  
  // Encontrar nodos sin parámetros en el working
  const workingNoParams = workingData.nodes.filter(node => !node.parameters || Object.keys(node.parameters).length === 0);
  const problematicNoParams = problematicData.nodes.filter(node => !node.parameters || Object.keys(node.parameters).length === 0);
  
  console.log(`✅ Working nodos sin parámetros: ${workingNoParams.length}`);
  console.log(`❌ Problematic nodos sin parámetros: ${problematicNoParams.length}`);
  
  if (workingNoParams.length > 0) {
    console.log('   Working nodos sin parámetros:');
    workingNoParams.forEach(node => {
      console.log(`   • ${node.name} (${node.type})`);
    });
  }
  
  if (problematicNoParams.length > 0) {
    console.log('   Problematic nodos sin parámetros:');
    problematicNoParams.forEach(node => {
      console.log(`   • ${node.name} (${node.type})`);
    });
  }
  
  // 5. Comparar estructura de conexiones
  console.log('\n5️⃣ ESTRUCTURA DE CONEXIONES:');
  
  // Verificar formato de conexiones
  const workingConnections = workingData.connections || {};
  const problematicConnections = problematicData.connections || {};
  
  console.log(`✅ Working conexiones: ${Object.keys(workingConnections).length}`);
  console.log(`❌ Problematic conexiones: ${Object.keys(problematicConnections).length}`);
  
  // Verificar formato de las conexiones
  const sampleWorkingConn = Object.values(workingConnections)[0];
  const sampleProblematicConn = Object.values(problematicConnections)[0];
  
  if (sampleWorkingConn && sampleProblematicConn) {
    console.log('\n   📋 Muestra de conexión Working:');
    console.log('   ', JSON.stringify(sampleWorkingConn, null, 4));
    
    console.log('\n   📋 Muestra de conexión Problematic:');
    console.log('   ', JSON.stringify(sampleProblematicConn, null, 4));
  }
  
  // 6. Buscar diferencias en metadatos
  console.log('\n6️⃣ METADATOS Y CONFIGURACIÓN:');
  
  console.log('✅ Working tiene settings:', !!workingData.settings);
  console.log('❌ Problematic tiene settings:', !!problematicData.settings);
  
  if (workingData.settings) {
    console.log('   Working settings:', Object.keys(workingData.settings));
  }
  
  if (problematicData.settings) {
    console.log('   Problematic settings:', Object.keys(problematicData.settings));
  }
  
  // 7. Verificar tipos de nodos específicos
  console.log('\n7️⃣ TIPOS DE NODOS PROBLEMÁTICOS:');
  
  const problematicTypes = ['salesforce', 'hubspot', 'slack', 'twilio', 'sendgrid', 'googleAnalytics', 'stripe'];
  
  problematicTypes.forEach(type => {
    const workingNodes = workingData.nodes.filter(node => node.type.includes(type));
    const problematicNodes = problematicData.nodes.filter(node => node.type.includes(type));
    
    if (workingNodes.length > 0 || problematicNodes.length > 0) {
      console.log(`\n   🔍 Nodos tipo "${type}":`);
      console.log(`     Working: ${workingNodes.length} nodos`);
      console.log(`     Problematic: ${problematicNodes.length} nodos`);
      
      // Comparar parámetros de estos nodos
      if (workingNodes.length > 0 && problematicNodes.length > 0) {
        const workingParams = workingNodes[0].parameters || {};
        const problematicParams = problematicNodes[0].parameters || {};
        
        console.log(`     Working parámetros: ${Object.keys(workingParams).length}`);
        console.log(`     Problematic parámetros: ${Object.keys(problematicParams).length}`);
        
        if (Object.keys(workingParams).length > 0) {
          console.log(`     Working ejemplo:`, Object.keys(workingParams).join(', '));
        }
        if (Object.keys(problematicParams).length > 0) {
          console.log(`     Problematic ejemplo:`, Object.keys(problematicParams).join(', '));
        }
      }
    }
  });
  
  console.log('\n🎯 CONCLUSIONES:');
  console.log('================');
  
  const differences = [];
  
  if (workingIdSample !== problematicIdSample) {
    differences.push('Formato de IDs diferente (UUID vs números)');
  }
  
  if (workingNoParams.length !== problematicNoParams.length) {
    differences.push(`Diferente cantidad de nodos sin parámetros (${workingNoParams.length} vs ${problematicNoParams.length})`);
  }
  
  if (!!workingData.settings !== !!problematicData.settings) {
    differences.push('Diferente presencia de configuración/settings');
  }
  
  if (differences.length > 0) {
    console.log('🚨 DIFERENCIAS CRÍTICAS ENCONTRADAS:');
    differences.forEach((diff, index) => {
      console.log(`${index + 1}. ${diff}`);
    });
  } else {
    console.log('✅ No se encontraron diferencias estructurales obvias');
    console.log('💡 El problema puede estar en detalles específicos de implementación');
  }
  
} catch (error) {
  console.error('❌ Error durante la comparación:', error.message);
  console.error('Stack:', error.stack);
}
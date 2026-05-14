import fs from 'fs';

// Leer el archivo JSON
const workflowData = JSON.parse(fs.readFileSync('workflow-v4-ultra-q60-2025-09-17T03-43-16.json', 'utf8'));

console.log('=== ANÁLISIS DE CALIDAD DEL WORKFLOW V4 ULTRA ===\n');

// 1. Métricas básicas
console.log('📊 MÉTRICAS BÁSICAS:');
console.log(`Total de nodos: ${workflowData.nodes.length}`);
console.log(`Total de conexiones: ${Object.keys(workflowData.connections).length}`);

// 2. Análisis de tipos de nodos
console.log('\n🔧 TIPOS DE NODOS:');
const nodeTypes = {};
workflowData.nodes.forEach(node => {
    const type = node.type.replace('n8n-nodes-base.', '');
    nodeTypes[type] = (nodeTypes[type] || 0) + 1;
});

Object.entries(nodeTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
});

// 3. Análisis de conectividad
console.log('\n🔗 ANÁLISIS DE CONECTIVIDAD:');
let totalConnections = 0;
let nodesWithConnections = 0;

Object.values(workflowData.connections).forEach(conn => {
    if (conn.main) {
        totalConnections += conn.main.length;
        nodesWithConnections++;
    }
});

console.log(`Nodos con conexiones salientes: ${nodesWithConnections}`);
console.log(`Total de conexiones reales: ${totalConnections}`);

// 4. Verificar configuración de nodos
console.log('\n⚙️ CONFIGURACIÓN DE NODOS:');
let nodesWithParams = 0;
let nodesWithoutParams = 0;

workflowData.nodes.forEach(node => {
    if (node.parameters && Object.keys(node.parameters).length > 0) {
        nodesWithParams++;
    } else {
        nodesWithoutParams++;
    }
});

console.log(`Nodos con parámetros: ${nodesWithParams}`);
console.log(`Nodos sin parámetros: ${nodesWithoutParams}`);

// 5. Análisis de posicionamiento
console.log('\n📍 POSICIONAMIENTO:');
const positions = workflowData.nodes.map(node => node.position);
const uniquePositions = new Set(positions.map(pos => `${pos[0]},${pos[1]}`));
console.log(`Posiciones únicas: ${uniquePositions.size}`);
console.log(`Posiciones duplicadas: ${positions.length - uniquePositions.size}`);

// 6. Calidad del workflow
console.log('\n🎯 EVALUACIÓN DE CALIDAD:');
const metadata = workflowData.metadata;
console.log(`Puntuación oficial: ${metadata.qualityScore}/100`);
console.log(`Método de generación: ${metadata.generationMethod}`);
console.log(`Versión: ${metadata.version}`);

// 7. Evaluación personalizada
let qualityScore = 0;

// Diversidad de nodos (máx 20 puntos)
const nodeTypeCount = Object.keys(nodeTypes).length;
qualityScore += Math.min(nodeTypeCount * 3, 20);

// Conectividad (máx 25 puntos)
const connectivityRatio = totalConnections / workflowData.nodes.length;
qualityScore += Math.min(connectivityRatio * 15, 25);

// Configuración (máx 25 puntos)
const configRatio = nodesWithParams / workflowData.nodes.length;
qualityScore += configRatio * 25;

// Complejidad (máx 20 puntos)
if (workflowData.nodes.length > 15) qualityScore += 20;
else if (workflowData.nodes.length > 10) qualityScore += 15;
else if (workflowData.nodes.length > 5) qualityScore += 10;

// Posicionamiento (máx 10 puntos)
const positioningQuality = uniquePositions.size / positions.length;
qualityScore += positioningQuality * 10;

console.log(`\n🔍 EVALUACIÓN PERSONALIZADA: ${Math.round(qualityScore)}/100`);

// 8. Recomendaciones
console.log('\n💡 RECOMENDACIONES:');
if (uniquePositions.size < positions.length) {
    console.log('⚠️  Hay nodos con posiciones duplicadas - mejorar posicionamiento');
}
if (nodesWithoutParams > 3) {
    console.log('⚠️  Muchos nodos sin configurar - mejorar parámetros');
}
if (totalConnections < workflowData.nodes.length * 0.5) {
    console.log('⚠️  Baja conectividad - revisar flujo lógico');
}

console.log('\n✅ ANÁLISIS COMPLETADO');
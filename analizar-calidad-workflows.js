import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 ANALIZANDO CALIDAD DE WORKFLOWS EXISTENTES\n');

const files = fs.readdirSync(__dirname).filter(f => f.startsWith('workflow-') && f.endsWith('.json'));

let validWorkflows = 0;
let totalNodes = 0;
let totalAiAgents = 0;
let qualityWorkflows = [];

for (const file of files) {
    try {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        const workflow = JSON.parse(content);
        
        const nodeCount = workflow.nodes ? workflow.nodes.length : 0;
        const aiAgents = workflow.nodes ? workflow.nodes.filter(node => 
            node.type.includes('agent') || 
            node.name.toLowerCase().includes('agent') ||
            node.type.includes('langchain.agent')
        ) : [];
        
        const meetsQualityCriteria = nodeCount >= 7 && aiAgents.length >= 1;
        
        console.log(`📄 ${file}`);
        console.log(`   📊 Nodos: ${nodeCount}`);
        console.log(`   🤖 Agentes AI: ${aiAgents.length}`);
        console.log(`   ✅ Calidad: ${meetsQualityCriteria ? 'ALTA' : 'BAJA'}`);
        
        if (aiAgents.length > 0) {
            console.log(`   🔍 Agentes encontrados:`);
            aiAgents.forEach(agent => {
                console.log(`      - ${agent.name} (${agent.type})`);
            });
        }
        console.log('');
        
        validWorkflows++;
        totalNodes += nodeCount;
        totalAiAgents += aiAgents.length;
        
        if (meetsQualityCriteria) {
            qualityWorkflows.push({
                file,
                nodes: nodeCount,
                agents: aiAgents.length,
                agentNames: aiAgents.map(a => a.name)
            });
        }
        
    } catch (error) {
        console.log(`❌ ${file}: JSON corrupto (${error.message})\n`);
    }
}

console.log('📊 RESUMEN DE CALIDAD:');
console.log(`✅ Workflows válidos: ${validWorkflows}/${files.length}`);
console.log(`🔧 Promedio de nodos: ${Math.round(totalNodes / validWorkflows)}`);
console.log(`🤖 Total agentes AI: ${totalAiAgents}`);
console.log(`🏆 Workflows de alta calidad: ${qualityWorkflows.length}/${validWorkflows}`);

console.log('\n🏆 WORKFLOWS DE ALTA CALIDAD (7+ nodos + 1+ agente AI):');
qualityWorkflows.forEach((wf, index) => {
    console.log(`${index + 1}. ${wf.file}`);
    console.log(`   📊 ${wf.nodes} nodos, ${wf.agents} agentes: ${wf.agentNames.join(', ')}`);
});

const qualityRate = (qualityWorkflows.length / validWorkflows * 100).toFixed(1);
console.log(`\n📈 Tasa de calidad: ${qualityRate}%`);

if (qualityWorkflows.length < 30) {
    console.log(`\n🎯 RECOMENDACIÓN: Necesitas ${30 - qualityWorkflows.length} workflows más de alta calidad`);
    console.log(`   Ejecuta el scraper mejorado para obtener solo workflows con 7+ nodos y agentes AI`);
}
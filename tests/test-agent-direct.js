// Test simple del agente sin servidor
import UltraIntelligentFallbackAgent from './ultra-intelligent-fallback-agent-v2.js';

async function testBasicWorkflow() {
    console.log('🔍 Iniciando prueba del agente...');
    
    try {
        const agent = new UltraIntelligentFallbackAgent();
        console.log('✅ Agente inicializado correctamente');
        
        // Generar workflow simple
        const semanticAnalysis = {
            businessDomain: 'test',
            complexity: 'simple',
            userIntent: ['create'],
            intelligenceLevel: 'basic'
        };
        
        const workflow = await agent.generateIntelligentWorkflow(
            'crear workflow simple de prueba'
        );
        
        console.log('📊 Workflow generado:');
        console.log(`- Nodos: ${workflow.nodes?.length || 0}`);
        console.log(`- Conexiones: ${Object.keys(workflow.connections || {}).length}`);
        
        // Guardar archivo de prueba
        const fs = await import('fs');
        fs.writeFileSync('./test-direct-workflow.json', JSON.stringify(workflow, null, 2));
        console.log('✅ Archivo guardado: test-direct-workflow.json');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testBasicWorkflow();
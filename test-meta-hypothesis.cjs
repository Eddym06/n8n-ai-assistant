/**
 * Script para probar la hipótesis del campo 'meta'
 * Verifica si agregar el campo meta soluciona el problema
 */

const fs = require('fs');

console.log('🧪 PRUEBA DE HIPÓTESIS: CAMPO META');
console.log('=================================');

// Archivos a probar
const testFiles = [
    {
        name: 'FIXED-V2 (funciona - tiene meta)',
        path: './generated-workflows/workflow-masivo-gemini-1757337804197-FIXED-V2.json',
        expected: 'ÉXITO'
    },
    {
        name: 'ULTRA-CLEAN (no funciona - sin meta)',
        path: './generated-workflows/workflow-masivo-gemini-1757337804197-ULTRA-CLEAN.json',
        expected: 'FALLO'
    },
    {
        name: 'ULTRA-CLEAN-WITH-META (debería funcionar)',
        path: './generated-workflows/workflow-masivo-gemini-1757337804197-ULTRA-CLEAN-WITH-META.json',
        expected: 'ÉXITO'
    },
    {
        name: 'FIXED-V2-WITHOUT-META (podría fallar)',
        path: './generated-workflows/workflow-masivo-gemini-1757337804197-FIXED-V2-WITHOUT-META.json',
        expected: 'FALLO'
    }
];

console.log('📋 ARCHIVOS A PROBAR:');
testFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.name}`);
    console.log(`   Archivo: ${file.path}`);
    console.log(`   Esperado: ${file.expected}`);
    
    // Verificar si el archivo existe
    if (fs.existsSync(file.path)) {
        console.log(`   ✅ Archivo existe`);
        
        // Leer y verificar estructura
        try {
            const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
            console.log(`   📊 Nodos: ${data.nodes?.length || 0}`);
            console.log(`   🔗 Conexiones: ${Object.keys(data.connections || {}).length}`);
            console.log(`   📋 Meta: ${data.meta ? 'SÍ' : 'NO'}`);
            
            if (data.meta) {
                console.log(`      Meta content: ${JSON.stringify(data.meta)}`);
            }
        } catch (error) {
            console.log(`   ❌ Error parsing JSON: ${error.message}`);
        }
    } else {
        console.log(`   ❌ Archivo no existe`);
    }
    console.log('');
});

console.log('🎯 CONCLUSIONES PRELIMINARES:');
console.log('=============================');
console.log('1. FIXED-V2 tiene meta y funciona ✅');
console.log('2. ULTRA-CLEAN no tiene meta y no funciona ❌');
console.log('3. Si ULTRA-CLEAN-WITH-META funciona → meta es la solución');
console.log('4. Si FIXED-V2-WITHOUT-META falla → meta es necesario');

console.log('\n📝 PARA CONFIRMAR LA HIPÓTESIS:');
console.log('- Probar importar ULTRA-CLEAN-WITH-META.json en n8n');
console.log('- Debería importar exitosamente sin error toLowerCase()');
console.log('- Si funciona, la solución es agregar el campo meta a todos los workflows');

// Crear script de solución automática
const autoFixScript = `
/**
 * Script para agregar automáticamente el campo meta a workflows
 */
function addMetaToWorkflow(inputPath, outputPath) {
    const workflow = JSON.parse(require('fs').readFileSync(inputPath, 'utf8'));
    
    if (!workflow.meta) {
        workflow.meta = {
            templateCreatedBy: "n8n-ai-assistant",
            fixedBy: "meta-field-fix",
            timestamp: new Date().toISOString()
        };
        
        require('fs').writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
        console.log(\`✅ Meta agregado: \${outputPath}\`);
    } else {
        console.log(\`⚠️ Ya tiene meta: \${inputPath}\`);
    }
}

// Uso: addMetaToWorkflow('input.json', 'output.json');
module.exports = { addMetaToWorkflow };
`;

fs.writeFileSync('./add-meta-fix.cjs', autoFixScript);
console.log('\n✅ Creado script de solución automática: add-meta-fix.cjs');

console.log('\n🚀 PRÓXIMO PASO:');
console.log('Abrir n8n y probar importar ULTRA-CLEAN-WITH-META.json');
console.log('URL: http://localhost:5678');
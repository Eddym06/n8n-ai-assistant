const fs = require('fs');

/**
 * CORRECTOR FINAL - Completa el workflow al 100%
 * Agrega los campos recomendados faltantes para cumplimiento total
 */

const filePath = './generated-workflows/workflow-masivo-gemini-1757337804197-ANALYZED-WITH-META-ENHANCED-FIXED.json';

console.log('🔧 CORRECTOR FINAL - Completando al 100%');
console.log('=====================================\n');

try {
    // Leer el archivo
    const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log('📋 Estado actual:');
    console.log(`  - Name: ${workflow.name ? '✅' : '❌'}`);
    console.log(`  - Tags: ${workflow.tags ? '✅' : '❌'}`);
    console.log(`  - Active: ${workflow.active !== undefined ? '✅' : '❌'}`);
    console.log(`  - PinData: ${workflow.pinData ? '✅' : '❌'}`);
    
    let changes = 0;
    
    // Agregar tags si no existen
    if (!workflow.tags) {
        workflow.tags = [
            {
                id: generateId(),
                name: "🔧 Corregido",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: generateId(),
                name: "📊 Masivo",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        changes++;
        console.log('  ➕ Tags agregados');
    }
    
    // Agregar active si no existe
    if (workflow.active === undefined) {
        workflow.active = false;
        changes++;
        console.log('  ➕ Campo active agregado');
    }
    
    // Agregar pinData si no existe
    if (!workflow.pinData) {
        workflow.pinData = {};
        changes++;
        console.log('  ➕ Campo pinData agregado');
    }
    
    // Agregar settings si no existe o está vacío
    if (!workflow.settings || Object.keys(workflow.settings).length === 0) {
        workflow.settings = {
            executionOrder: "v1"
        };
        changes++;
        console.log('  ➕ Settings mejorado');
    }
    
    if (changes > 0) {
        // Guardar archivo actualizado
        const finalPath = filePath.replace('.json', '-FINAL-100-PERCENT.json');
        fs.writeFileSync(finalPath, JSON.stringify(workflow, null, 2));
        console.log(`\n✅ ${changes} mejoras aplicadas`);
        console.log(`📁 Archivo final guardado: ${finalPath.split('/').pop()}`);
        
        // Crear copia con nombre más simple también
        const simplePath = './generated-workflows/workflow-masivo-gemini-PERFECTO.json';
        fs.writeFileSync(simplePath, JSON.stringify(workflow, null, 2));
        console.log(`📁 Copia simplificada: ${simplePath.split('/').pop()}`);
        
    } else {
        console.log('\n✅ El archivo ya está completo');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
}

function generateId() {
    return Array.from({length: 16}, () => Math.floor(Math.random() * 36).toString(36)).join('');
}

console.log('\n🎯 Corrección final completada');
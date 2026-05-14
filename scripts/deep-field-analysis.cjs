/**
 * Análisis detallado de diferencias específicas de campos
 * entre FIXED-V2 (funciona) y ULTRA-CLEAN (no funciona)
 */

const fs = require('fs');

function deepCompareWorkflows() {
    console.log('🔬 ANÁLISIS DETALLADO DE DIFERENCIAS DE CAMPOS');
    console.log('==============================================');
    
    const fixed = JSON.parse(fs.readFileSync('./generated-workflows/workflow-masivo-gemini-1757337804197-FIXED-V2.json', 'utf8'));
    const ultraClean = JSON.parse(fs.readFileSync('./generated-workflows/workflow-masivo-gemini-1757337804197-ULTRA-CLEAN.json', 'utf8'));
    
    // Convertir a strings para comparación exacta
    const fixedStr = JSON.stringify(fixed, null, 2);
    const ultraCleanStr = JSON.stringify(ultraClean, null, 2);
    
    console.log(`📏 Tamaños:`);
    console.log(`  FIXED-V2: ${fixedStr.length} caracteres`);
    console.log(`  ULTRA-CLEAN: ${ultraCleanStr.length} caracteres`);
    console.log(`  Diferencia: ${Math.abs(fixedStr.length - ultraCleanStr.length)} caracteres`);
    
    // Dividir en líneas para comparación línea por línea
    const fixedLines = fixedStr.split('\n');
    const ultraCleanLines = ultraCleanStr.split('\n');
    
    console.log(`\n📝 Líneas:`);
    console.log(`  FIXED-V2: ${fixedLines.length} líneas`);
    console.log(`  ULTRA-CLEAN: ${ultraCleanLines.length} líneas`);
    
    // Encontrar diferencias línea por línea
    console.log(`\n🔍 DIFERENCIAS LÍNEA POR LÍNEA (primeras 20):`);
    let differences = 0;
    const maxLines = Math.max(fixedLines.length, ultraCleanLines.length);
    
    for (let i = 0; i < maxLines && differences < 20; i++) {
        const fixedLine = fixedLines[i] || '';
        const ultraCleanLine = ultraCleanLines[i] || '';
        
        if (fixedLine !== ultraCleanLine) {
            differences++;
            console.log(`\n  Línea ${i + 1}:`);
            console.log(`    FIXED-V2:     "${fixedLine}"`);
            console.log(`    ULTRA-CLEAN:  "${ultraCleanLine}"`);
            
            // Analizar tipo de diferencia
            if (!fixedLine && ultraCleanLine) {
                console.log(`    → ULTRA-CLEAN tiene línea extra`);
            } else if (fixedLine && !ultraCleanLine) {
                console.log(`    → FIXED-V2 tiene línea extra`);
            } else {
                console.log(`    → Contenido diferente`);
            }
        }
    }
    
    if (differences >= 20) {
        console.log(`\n  ... y ${maxLines - 20} diferencias más`);
    }
    
    // Buscar específicamente el campo meta
    console.log(`\n📋 ANÁLISIS DEL CAMPO META:`);
    if (fixed.meta) {
        console.log(`  ✅ FIXED-V2 tiene meta:`, JSON.stringify(fixed.meta, null, 2));
    } else {
        console.log(`  ❌ FIXED-V2 NO tiene meta`);
    }
    
    if (ultraClean.meta) {
        console.log(`  ✅ ULTRA-CLEAN tiene meta:`, JSON.stringify(ultraClean.meta, null, 2));
    } else {
        console.log(`  ❌ ULTRA-CLEAN NO tiene meta`);
    }
    
    // Crear versión ULTRA-CLEAN con meta para probar
    console.log(`\n🔧 CREANDO VERSIÓN DE PRUEBA CON META...`);
    const ultraCleanWithMeta = {
        ...ultraClean,
        meta: {
            templateCreatedBy: "n8n-ai-assistant",
            fixedBy: "differential-analysis-test",
            timestamp: new Date().toISOString()
        }
    };
    
    const outputPath = './generated-workflows/workflow-masivo-gemini-1757337804197-ULTRA-CLEAN-WITH-META.json';
    fs.writeFileSync(outputPath, JSON.stringify(ultraCleanWithMeta, null, 2));
    
    console.log(`✅ Creado: ${outputPath}`);
    console.log(`   Este archivo debería funcionar si el campo 'meta' es la solución`);
    
    // También crear versión FIXED sin meta para probar lo contrario
    console.log(`\n🔧 CREANDO VERSIÓN FIXED SIN META...`);
    const fixedWithoutMeta = { ...fixed };
    delete fixedWithoutMeta.meta;
    
    const outputPath2 = './generated-workflows/workflow-masivo-gemini-1757337804197-FIXED-V2-WITHOUT-META.json';
    fs.writeFileSync(outputPath2, JSON.stringify(fixedWithoutMeta, null, 2));
    
    console.log(`✅ Creado: ${outputPath2}`);
    console.log(`   Este archivo podría fallar si el campo 'meta' es necesario`);
    
    return {
        differences: differences,
        metaInFixed: !!fixed.meta,
        metaInUltraClean: !!ultraClean.meta,
        testFilesCreated: [outputPath, outputPath2]
    };
}

// Ejecutar análisis
if (require.main === module) {
    const result = deepCompareWorkflows();
    console.log(`\n🎯 CONCLUSIONES:`);
    console.log(`================`);
    console.log(`- Se encontraron ${result.differences} diferencias principales`);
    console.log(`- FIXED-V2 ${result.metaInFixed ? 'SÍ' : 'NO'} tiene campo meta`);
    console.log(`- ULTRA-CLEAN ${result.metaInUltraClean ? 'SÍ' : 'NO'} tiene campo meta`);
    console.log(`- Archivos de prueba creados para validar hipótesis`);
    
    console.log(`\n🧪 PRÓXIMOS PASOS:`);
    console.log(`1. Probar ULTRA-CLEAN-WITH-META.json (debería funcionar)`);
    console.log(`2. Probar FIXED-V2-WITHOUT-META.json (podría fallar)`);
    console.log(`3. Si ambos funcionan, buscar otras diferencias sutiles`);
}

module.exports = { deepCompareWorkflows };
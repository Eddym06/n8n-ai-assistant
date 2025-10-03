import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Reparando archivos JSON corruptos...\n');

// Archivos problemáticos identificados
const problematicFiles = [
    'workflow-11-ai-stock-analysis-assistant.json',
    'workflow-14-customer-support-whatsapp-bot-google-docs-gemini-ai.json',
    'workflow-18-local-chatbot-rag.json'
];

function repairJSON(content) {
    try {
        // Primero intentar parsear como está
        JSON.parse(content);
        return { success: true, content: content, reason: 'Ya es JSON válido' };
    } catch (error) {
        try {
            // Reparar caracteres escapados incorrectamente (\r\n -> reales)
            let repairedContent = content
                .replace(/\\r\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');

            // Intentar parsear la versión reparada
            const parsed = JSON.parse(repairedContent);
            
            // Verificar estructura básica
            if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
                throw new Error('No tiene estructura de workflow válida');
            }

            // Reformatear como JSON válido
            const formattedContent = JSON.stringify(parsed, null, 2);
            
            return { 
                success: true, 
                content: formattedContent, 
                reason: 'Reparado: caracteres de escape incorrectos' 
            };

        } catch (repairError) {
            // Si el contenido parece ser JSON ya escapado, intentar limpiarlo
            if (content.startsWith('{"') || content.startsWith('{\r\n')) {
                try {
                    // Remover caracteres de escape extra
                    let cleanedContent = content
                        .replace(/^"/, '')  // Quitar comilla inicial si existe
                        .replace(/"$/, '')  // Quitar comilla final si existe
                        .replace(/\\"/g, '"')
                        .replace(/\\r\\n/g, '\n')
                        .replace(/\\\\/g, '\\');

                    const parsed = JSON.parse(cleanedContent);
                    const formattedContent = JSON.stringify(parsed, null, 2);
                    
                    return { 
                        success: true, 
                        content: formattedContent, 
                        reason: 'Reparado: JSON escapado incorrectamente' 
                    };
                } catch (cleanError) {
                    return { 
                        success: false, 
                        reason: `Error de limpieza: ${cleanError.message}` 
                    };
                }
            }

            return { 
                success: false, 
                reason: `Error de reparación: ${repairError.message}` 
            };
        }
    }
}

let repairedCount = 0;
let failedCount = 0;

for (const filename of problematicFiles) {
    const filePath = path.join(__dirname, filename);
    
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`❌ NO ENCONTRADO: ${filename}`);
            failedCount++;
            continue;
        }

        console.log(`🔍 Procesando: ${filename}`);
        const originalContent = fs.readFileSync(filePath, 'utf8');
        
        const result = repairJSON(originalContent);
        
        if (result.success) {
            // Crear backup del archivo original
            const backupPath = filePath + '.backup';
            fs.writeFileSync(backupPath, originalContent, 'utf8');
            
            // Escribir contenido reparado
            fs.writeFileSync(filePath, result.content, 'utf8');
            
            console.log(`✅ REPARADO: ${filename}`);
            console.log(`   Razón: ${result.reason}`);
            console.log(`   Backup: ${filename}.backup`);
            
            repairedCount++;
        } else {
            console.log(`🚫 FALLÓ: ${filename}`);
            console.log(`   Razón: ${result.reason}`);
            failedCount++;
        }

    } catch (error) {
        console.log(`💥 ERROR CRÍTICO: ${filename} - ${error.message}`);
        failedCount++;
    }
    
    console.log(''); // Línea en blanco
}

console.log('📊 RESUMEN DE REPARACIÓN:');
console.log(`✅ Archivos reparados: ${repairedCount}`);
console.log(`🚫 Archivos fallidos: ${failedCount}`);

if (repairedCount > 0) {
    console.log('\n🎉 ¡Archivos JSON reparados exitosamente!');
    console.log('💾 Se crearon backups (.backup) de los archivos originales');
}

console.log('\n🚀 Ejecutando validación final...');

// Ejecutar validación final
import('./validate-workflows.js');
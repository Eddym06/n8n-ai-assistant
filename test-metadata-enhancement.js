/**
 * 🧪 TEST MEconsole.log('🔍 Verificando variables de entorno...');
const GEMINI_API_KEY = 'your_google_api_key_here';
console.log('GEMINI_API_KEY configurada:', !!GEMINI_API_KEY);

// Inicializar Gemini
console.log('🤖 Inicializando Gemini...');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); ENHANCEMENT AGENT
 * ==================================
 */

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configuración
console.log('🔧 Cargando configuración...');
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando variables de entorno...');
console.log('GEMINI_API_KEY presente:', !!process.env.GEMINI_API_KEY);

// Inicializar Gemini
console.log('🤖 Inicializando Gemini...');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
console.log('✅ Gemini inicializado');

const workflowsPath = path.join(__dirname, 'workflows');
const outputPath = path.join(__dirname, 'enhanced-metadata-test');

console.log('📂 Paths configurados:');
console.log('  Workflows:', workflowsPath);
console.log('  Output:', outputPath);

async function testBasicFunctionality() {
    try {
        console.log('\n🚀 INICIANDO TEST BÁSICO');
        console.log('========================');

        // Verificar carpeta workflows
        console.log('🔍 Verificando carpeta workflows...');
        if (!fs.existsSync(workflowsPath)) {
            console.log('❌ Carpeta workflows no encontrada');
            return;
        }
        console.log('✅ Carpeta workflows encontrada');

        // Leer carpetas
        console.log('📁 Leyendo carpetas...');
        const folders = fs.readdirSync(workflowsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        console.log(`📊 Total carpetas: ${folders.length}`);
        console.log(`📋 Primeras 5: ${folders.slice(0, 5).join(', ')}`);

        // Probar con una carpeta específica
        const testFolder = folders[0];
        console.log(`\n🔬 Probando con carpeta: ${testFolder}`);
        
        const testFolderPath = path.join(workflowsPath, testFolder);
        const files = fs.readdirSync(testFolderPath)
            .filter(file => file.endsWith('.json'));
        
        console.log(`📄 Archivos JSON en ${testFolder}: ${files.length}`);
        
        if (files.length > 0) {
            const testFile = files[0];
            console.log(`🧪 Analizando archivo: ${testFile}`);
            
            const filePath = path.join(testFolderPath, testFile);
            const content = fs.readFileSync(filePath, 'utf8');
            const workflow = JSON.parse(content);
            
            console.log(`📊 Workflow parseado - Nodos: ${workflow.nodes ? workflow.nodes.length : 'N/A'}`);
            
            // Test simple con Gemini
            console.log('🤖 Probando llamada a Gemini...');
            const prompt = `Analiza este workflow de n8n y dame un JSON simple con name, description y node_count:

${JSON.stringify(workflow, null, 2).substring(0, 2000)}...

Responde SOLO un JSON válido sin explicaciones.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            
            console.log('✅ Respuesta de Gemini recibida');
            console.log('📝 Longitud respuesta:', text.length);
            
            // Intentar parsear JSON
            try {
                let cleanedText = text.trim();
                if (cleanedText.startsWith('```json')) {
                    cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                }
                if (cleanedText.startsWith('```')) {
                    cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
                }
                
                const parsedResponse = JSON.parse(cleanedText);
                console.log('✅ JSON parseado exitosamente');
                console.log('📊 Resultado:', JSON.stringify(parsedResponse, null, 2));
                
                // Crear carpeta de salida
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath, { recursive: true });
                }
                
                // Guardar resultado
                const outputFile = path.join(outputPath, `${testFile}_test_metadata.json`);
                fs.writeFileSync(outputFile, JSON.stringify(parsedResponse, null, 2));
                console.log(`💾 Resultado guardado en: ${outputFile}`);
                
            } catch (parseError) {
                console.log('❌ Error parseando JSON:', parseError.message);
                console.log('📝 Respuesta raw:', text.substring(0, 500));
            }
        }

        console.log('\n✅ TEST COMPLETADO EXITOSAMENTE');

    } catch (error) {
        console.error('❌ Error en test:', error.message);
        console.error('🔍 Stack:', error.stack);
    }
}

// Ejecutar test
testBasicFunctionality();
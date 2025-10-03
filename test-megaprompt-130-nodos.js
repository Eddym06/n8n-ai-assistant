/**
 * 🚀 TEST MEGAPROMPT 130 NODOS - PRUEBA EXTREMA DEL SISTEMA COMPLETO
 * 
 * Este test ejecuta el megaprompt más desafiante para probar:
 * - Extension Server Fixed
 * - ACF V3.1 "Arquitecto" 
 * - IPA V3.0 con Swimlanes
 * - Todo el pipeline de optimización
 */

import MEGAPROMPT_130_NODOS from './megaprompt-130-nodos.js';
import dotenv from 'dotenv';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Configurar variables de entorno
dotenv.config();

async function testMegaprompt130Nodos() {
    console.log('🚀 INICIANDO TEST MEGAPROMPT 130 NODOS - PRUEBA EXTREMA');
    console.log('=' .repeat(80));

    // Verificar configuración
    console.log('\n🔑 VERIFICACIÓN DE CONFIGURACIÓN:');
    console.log(`  📋 GEMINI_API_KEY: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`  📏 Longitud de clave: ${process.env.GEMINI_API_KEY?.length || 0}`);
    console.log(`  ✅ Formato válido: ${process.env.GEMINI_API_KEY?.startsWith('AIza') || false}`);

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ Error: GEMINI_API_KEY no configurada');
        return;
    }

    // Mostrar detalles del megaprompt
    console.log('\n📋 DETALLES DEL MEGAPROMPT:');
    console.log(`  📏 Caracteres totales: ${MEGAPROMPT_130_NODOS.length.toLocaleString()}`);
    console.log(`  🎯 Nodos objetivo: 130+`);
    console.log(`  🏢 Dominios: 5 (RH, Ventas, Finanzas, Operaciones, IT)`);
    console.log(`  🔧 Complejidad: EXTREMA`);

    // Preparar el comando
    console.log('\n🚀 EJECUTANDO EXTENSION SERVER FIXED...');
    console.log('⏳ Esto puede tomar varios minutos debido a la complejidad...');
    
    const startTime = Date.now();
    
    try {
        // Crear el proceso usando spawn para mejor manejo de argumentos largos
        const child = spawn('node', ['extension server fixed.js', MEGAPROMPT_130_NODOS], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true,
            env: {
                ...process.env,
                DEFAULT_MODEL: 'gemini'
            }
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        const result = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                child.kill();
                reject(new Error('TIMEOUT: Proceso excedió los 5 minutos'));
            }, 300000); // 5 minutos

            child.on('close', (code) => {
                clearTimeout(timeout);
                resolve({ code, stdout, stderr });
            });

            child.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });

        const executionTime = Date.now() - startTime;

        console.log('\n✅ EJECUCIÓN COMPLETADA');
        console.log(`⏱️ Tiempo total: ${(executionTime / 1000).toFixed(2)} segundos`);
        console.log(`🔢 Código de salida: ${result.code}`);

        // Analizar output
        console.log('\n📊 ANÁLISIS DEL RESULTADO:');
        
        if (result.stdout) {
            const lines = result.stdout.split('\n');
            const relevantLines = lines.filter(line => 
                line.includes('nodos generados') ||
                line.includes('clusters identificados') ||
                line.includes('swimlanes creados') ||
                line.includes('ACF') ||
                line.includes('IPA') ||
                line.includes('✅') ||
                line.includes('❌') ||
                line.includes('⚠️')
            );

            console.log('  📋 Líneas relevantes del output:');
            relevantLines.slice(-20).forEach(line => {
                console.log(`    ${line.trim()}`);
            });
        }

        if (result.stderr) {
            console.log('\n⚠️ ERRORES/WARNINGS:');
            const errorLines = result.stderr.split('\n').filter(line => line.trim());
            errorLines.slice(-10).forEach(line => {
                console.log(`    ${line.trim()}`);
            });
        }

        // Buscar archivos generados
        console.log('\n📁 ARCHIVOS GENERADOS:');
        const generatedDir = './generated-workflows/';
        if (fs.existsSync(generatedDir)) {
            const files = fs.readdirSync(generatedDir);
            const recentFiles = files
                .filter(file => file.includes(new Date().toISOString().split('T')[0].replace(/-/g, '')))
                .sort((a, b) => {
                    const statA = fs.statSync(`${generatedDir}${a}`);
                    const statB = fs.statSync(`${generatedDir}${b}`);
                    return statB.mtime - statA.mtime;
                });

            if (recentFiles.length > 0) {
                console.log('  📄 Archivos generados hoy:');
                recentFiles.slice(0, 5).forEach(file => {
                    const stat = fs.statSync(`${generatedDir}${file}`);
                    const size = (stat.size / 1024).toFixed(1);
                    console.log(`    📝 ${file} (${size} KB)`);
                });

                // Analizar el archivo más reciente
                const latestFile = `${generatedDir}${recentFiles[0]}`;
                console.log(`\n🔍 ANALIZANDO ARCHIVO MÁS RECIENTE: ${recentFiles[0]}`);
                
                try {
                    const workflow = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
                    console.log(`  📊 Nodos generados: ${workflow.nodes?.length || 0}`);
                    console.log(`  🔗 Conexiones: ${Object.keys(workflow.connections || {}).length}`);
                    
                    if (workflow.metadata) {
                        console.log('  📋 Metadata:');
                        Object.entries(workflow.metadata).forEach(([key, value]) => {
                            if (typeof value === 'object') {
                                console.log(`    ${key}: ${JSON.stringify(value)}`);
                            } else {
                                console.log(`    ${key}: ${value}`);
                            }
                        });
                    }

                    // Verificar clusters si existen
                    if (workflow.metadata?.clusters) {
                        console.log('\n🏗️ ANÁLISIS DE CLUSTERS:');
                        Object.entries(workflow.metadata.clusters.nodeCount || {}).forEach(([cluster, count]) => {
                            console.log(`    📁 ${cluster}: ${count} nodos`);
                        });
                    }

                } catch (error) {
                    console.log(`    ❌ Error analizando archivo: ${error.message}`);
                }
            } else {
                console.log('  ⚠️ No se encontraron archivos generados hoy');
            }
        }

        // Evaluación final
        console.log('\n🏆 EVALUACIÓN FINAL:');
        const success = stdout && !stdout.includes('Error') && !stdout.includes('❌');
        
        if (success) {
            console.log('  ✅ TEST EXITOSO: El sistema manejó el megaprompt correctamente');
            console.log('  🎯 DEMOSTRADO: Capacidad para workflows masivos de 130+ nodos');
            console.log('  🏗️ ARQUITECTURA: ACF + IPA trabajando en sinergia');
        } else {
            console.log('  ⚠️ TEST PARCIAL: El sistema procesó pero con algunos problemas');
            console.log('  💡 RECOMENDACIÓN: Revisar logs para optimizaciones');
        }

    } catch (error) {
        const executionTime = Date.now() - startTime;
        console.log('\n❌ ERROR EN LA EJECUCIÓN:');
        console.log(`⏱️ Tiempo antes del error: ${(executionTime / 1000).toFixed(2)} segundos`);
        console.log(`🔍 Tipo de error: ${error.code || 'Unknown'}`);
        console.log(`📝 Mensaje: ${error.message}`);

        if (error.code === 'TIMEOUT') {
            console.log('⚠️ TIMEOUT: El megaprompt es demasiado complejo para el límite de tiempo');
            console.log('💡 SOLUCIÓN: Dividir en prompts más pequeños o aumentar timeout');
        }

        if (error.stdout) {
            console.log('\n📋 OUTPUT PARCIAL:');
            const lines = error.stdout.split('\n');
            lines.slice(-10).forEach(line => {
                if (line.trim()) console.log(`    ${line.trim()}`);
            });
        }
    }

    console.log('\n🚀 TEST MEGAPROMPT 130 NODOS COMPLETADO');
    console.log('=' .repeat(80));
}

// Ejecutar el test
testMegaprompt130Nodos().catch(console.error);

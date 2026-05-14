#!/usr/bin/env node

/**
 * Script de automatización para comandos frecuentes de prueba
 * n8n AI Assistant - Automatización de comandos
 */

import { spawn, exec } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Automatizador de Comandos - n8n AI Assistant');
console.log('================================================');
console.log('');

const comandosDisponibles = {
    '1': {
        nombre: 'Iniciar servidor extension (extension server fixed.js)',
        comando: 'node',
        args: ['extension server fixed.js']
    },
    '2': {
        nombre: 'Iniciar servidor principal (server.js)',
        comando: 'node',
        args: ['server.js']
    },
    '3': {
        nombre: 'Prueba simple - Workflow básico',
        comando: 'node',
        args: ['extension server fixed.js', 'Crear un workflow simple que reciba un webhook y envíe un email de notificación']
    },
    '4': {
        nombre: 'Prueba media - Workflow con 10 nodos',
        comando: 'node',
        args: ['extension server fixed.js', 'Crear un sistema de procesamiento de pedidos que incluya webhook de recepción, validación de datos, consulta a base de datos, cálculo de precios, envío de confirmación por email, actualización de inventario, notificación a Slack, logging de transacción, backup de datos y generación de reporte']
    },
    '5': {
        nombre: 'Prueba compleja - Workflow con 25+ nodos',
        comando: 'node',
        args: ['extension server fixed.js', 'Crear un sistema completo de gestión de leads que incluya múltiples webhooks de entrada, validación y enriquecimiento de datos, scoring con IA, distribución inteligente, seguimiento automatizado, integración con CRM, procesamiento de pagos, generación de facturas, sincronización contable, notificaciones multicanal, análisis y reportes']
    },
    '6': {
        nombre: 'Probar corrector inteligente',
        comando: 'node',
        args: ['intelligent-name-corrector.js']
    },
    '7': {
        nombre: 'Probar agente de posicionamiento',
        comando: 'node',
        args: ['intelligent-positioning-agent.js']
    },
    '8': {
        nombre: 'Ejecutar pruebas completas',
        comando: 'node',
        args: ['test-completo.js']
    },
    '9': {
        nombre: 'Analizar último workflow generado',
        ejecutar: async () => {
            return new Promise((resolve) => {
                exec('dir workflow-*-*.json /od', (error, stdout, stderr) => {
                    if (error) {
                        console.log('❌ Error al buscar workflows:', error.message);
                        resolve();
                        return;
                    }
                    
                    const lines = stdout.split('\n').filter(line => line.includes('.json'));
                    if (lines.length > 0) {
                        const ultimoArchivo = lines[lines.length - 1].split(' ').pop().trim();
                        console.log(`📄 Analizando último workflow: ${ultimoArchivo}`);
                        
                        // Mostrar estadísticas básicas
                        exec(`node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('${ultimoArchivo}','utf8')); console.log('Nodos:', data.nodes?.length || 0); console.log('Conexiones:', data.connections ? Object.keys(data.connections).length : 0);"`, 
                            (err, out) => {
                                if (!err) console.log(out);
                                resolve();
                            });
                    } else {
                        console.log('❌ No se encontraron workflows generados');
                        resolve();
                    }
                });
            });
        }
    },
    '10': {
        nombre: 'Limpiar archivos de prueba temporales',
        ejecutar: async () => {
            return new Promise((resolve) => {
                console.log('🧹 Limpiando archivos temporales...');
                exec('del workflow-*-*.json test-*.json 2>nul', (error) => {
                    if (error) {
                        console.log('⚠️ Algunos archivos no se pudieron eliminar o no existían');
                    } else {
                        console.log('✅ Archivos de prueba eliminados');
                    }
                    resolve();
                });
            });
        }
    }
};

function mostrarMenu() {
    console.log('Selecciona un comando:');
    console.log('');
    Object.keys(comandosDisponibles).forEach(key => {
        console.log(`${key}. ${comandosDisponibles[key].nombre}`);
    });
    console.log('');
    console.log('0. Salir');
    console.log('');
}

function ejecutarComando(opcion) {
    const comando = comandosDisponibles[opcion];
    if (!comando) {
        console.log('❌ Opción no válida');
        return;
    }

    console.log(`🔄 Ejecutando: ${comando.nombre}`);
    console.log('');

    if (comando.ejecutar) {
        return comando.ejecutar();
    }

    return new Promise((resolve) => {
        const proceso = spawn(comando.comando, comando.args, {
            stdio: 'inherit',
            shell: true
        });

        proceso.on('close', (codigo) => {
            console.log('');
            if (codigo === 0) {
                console.log('✅ Comando ejecutado exitosamente');
            } else {
                console.log(`❌ Comando terminó con código: ${codigo}`);
            }
            console.log('');
            resolve();
        });

        proceso.on('error', (error) => {
            console.log('❌ Error al ejecutar comando:', error.message);
            resolve();
        });
    });
}

async function menuPrincipal() {
    mostrarMenu();
    
    rl.question('Ingresa tu opción: ', async (opcion) => {
        if (opcion === '0') {
            console.log('👋 ¡Hasta luego!');
            rl.close();
            return;
        }

        if (comandosDisponibles[opcion]) {
            await ejecutarComando(opcion);
        } else {
            console.log('❌ Opción no válida');
        }

        console.log('Presiona Enter para continuar...');
        rl.question('', () => {
            console.clear();
            menuPrincipal();
        });
    });
}

// Iniciar el menú
console.clear();
menuPrincipal();
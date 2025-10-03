/**
 * ULTRA LOGGING SYSTEM - Sistema de Logging Avanzado y Seguro
 * 
 * Sistema de logging con múltiples niveles, filtrado de información sensible,
 * rotación automática y métricas de rendimiento.
 * 
 * CARACTERÍSTICAS:
 * - Niveles de logging configurables (ERROR, WARN, INFO, DEBUG, TRACE)
 * - Filtrado automático de información sensible (API keys, passwords, etc.)
 * - Rotación automática de archivos de log
 * - Formato estructurado para análisis
 * - Métricas de rendimiento integradas
 * - Colores en consola para mejor legibilidad
 */

import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';

class UltraLoggingSystem {
    constructor(options = {}) {
        this.options = {
            level: 'INFO',                    // Nivel mínimo de logging
            enableConsole: true,              // Mostrar en consola
            enableFile: true,                 // Guardar en archivo
            enableColors: true,               // Colores en consola
            logDir: 'logs',                   // Directorio de logs
            maxFileSize: 10 * 1024 * 1024,   // 10MB por archivo
            maxFiles: 5,                      // Máximo 5 archivos de rotación
            enableMetrics: true,              // Habilitar métricas
            sensitiveKeys: [                  // Claves a censurar
                'api_key', 'apikey', 'password', 'token', 'secret',
                'auth', 'authorization', 'credential', 'key'
            ],
            ...options
        };

        // Niveles de logging con prioridades
        this.levels = {
            ERROR: { priority: 0, color: '\x1b[31m', prefix: '❌' },
            WARN:  { priority: 1, color: '\x1b[33m', prefix: '⚠️' },
            INFO:  { priority: 2, color: '\x1b[36m', prefix: 'ℹ️' },
            DEBUG: { priority: 3, color: '\x1b[35m', prefix: '🐛' },
            TRACE: { priority: 4, color: '\x1b[37m', prefix: '🔍' }
        };

        this.currentLevel = this.levels[this.options.level.toUpperCase()];
        this.logStream = null;
        this.metrics = {
            totalLogs: 0,
            logsByLevel: {},
            errorCount: 0,
            warningCount: 0,
            startTime: Date.now()
        };

        // Inicializar sistema
        this.initializeLogSystem();
        
        console.log(`📝 Ultra Logging System inicializado`);
        console.log(`   📊 Nivel: ${this.options.level.toUpperCase()}`);
        console.log(`   📁 Archivos: ${this.options.enableFile ? 'Habilitado' : 'Deshabilitado'}`);
        console.log(`   🎨 Colores: ${this.options.enableColors ? 'Habilitado' : 'Deshabilitado'}`);
    }

    /**
     * Inicializar sistema de archivos de log
     */
    async initializeLogSystem() {
        if (!this.options.enableFile) return;

        try {
            // Crear directorio de logs si no existe
            await fs.mkdir(this.options.logDir, { recursive: true });

            // Crear stream de escritura para el archivo actual
            const logFileName = `ultra-${new Date().toISOString().split('T')[0]}.log`;
            const logFilePath = path.join(this.options.logDir, logFileName);
            
            this.logStream = createWriteStream(logFilePath, { flags: 'a' });
            this.currentLogFile = logFilePath;

            // Verificar tamaño del archivo actual
            await this.checkFileRotation();

        } catch (error) {
            console.error('❌ Error inicializando sistema de logs:', error.message);
        }
    }

    /**
     * Verificar si necesita rotación de archivos
     */
    async checkFileRotation() {
        if (!this.currentLogFile) return;

        try {
            const stats = await fs.stat(this.currentLogFile);
            if (stats.size > this.options.maxFileSize) {
                await this.rotateLogFile();
            }
        } catch (error) {
            // Archivo no existe, no hay problema
        }
    }

    /**
     * Rotar archivo de log
     */
    async rotateLogFile() {
        if (!this.logStream) return;

        try {
            // Cerrar stream actual
            this.logStream.end();

            // Renombrar archivo actual con timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const rotatedName = this.currentLogFile.replace('.log', `-${timestamp}.log`);
            await fs.rename(this.currentLogFile, rotatedName);

            // Crear nuevo stream
            this.logStream = createWriteStream(this.currentLogFile, { flags: 'a' });

            // Limpiar archivos antiguos
            await this.cleanupOldLogs();

            this.info('SYSTEM', 'Archivo de log rotado', { rotatedTo: rotatedName });

        } catch (error) {
            console.error('❌ Error rotando archivo de log:', error.message);
        }
    }

    /**
     * Limpiar logs antiguos
     */
    async cleanupOldLogs() {
        try {
            const files = await fs.readdir(this.options.logDir);
            const logFiles = files
                .filter(f => f.startsWith('ultra-') && f.endsWith('.log'))
                .map(f => ({
                    name: f,
                    path: path.join(this.options.logDir, f),
                    stat: null
                }));

            // Obtener estadísticas de archivos
            for (const file of logFiles) {
                try {
                    file.stat = await fs.stat(file.path);
                } catch (error) {
                    // Ignorar archivos que no se puedan leer
                }
            }

            // Ordenar por fecha de modificación (más reciente primero)
            logFiles
                .filter(f => f.stat)
                .sort((a, b) => b.stat.mtime - a.stat.mtime)
                .slice(this.options.maxFiles) // Mantener solo los más recientes
                .forEach(async (file) => {
                    try {
                        await fs.unlink(file.path);
                        this.info('SYSTEM', 'Archivo de log antiguo eliminado', { file: file.name });
                    } catch (error) {
                        this.warn('SYSTEM', 'Error eliminando log antiguo', { file: file.name, error: error.message });
                    }
                });

        } catch (error) {
            this.warn('SYSTEM', 'Error limpiando logs antiguos', { error: error.message });
        }
    }

    /**
     * Filtrar información sensible de los datos
     */
    sanitizeData(data) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            const keyLower = key.toLowerCase();
            const isSensitive = this.options.sensitiveKeys.some(sensitiveKey => 
                keyLower.includes(sensitiveKey.toLowerCase())
            );

            if (isSensitive) {
                sanitized[key] = this.maskSensitiveValue(value);
            } else if (typeof value === 'object') {
                sanitized[key] = this.sanitizeData(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Enmascarar valor sensible
     */
    maskSensitiveValue(value) {
        if (typeof value === 'string') {
            if (value.length <= 8) {
                return '***';
            }
            const start = value.substring(0, 3);
            const end = value.substring(value.length - 3);
            const middle = '*'.repeat(Math.min(value.length - 6, 10));
            return `${start}${middle}${end}`;
        }
        return '***';
    }

    /**
     * Formatear mensaje de log
     */
    formatLogMessage(level, component, message, data = null) {
        const timestamp = new Date().toISOString();
        const sanitizedData = data ? this.sanitizeData(data) : null;
        
        return {
            timestamp,
            level,
            component,
            message,
            data: sanitizedData,
            pid: process.pid,
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };
    }

    /**
     * Escribir log
     */
    writeLog(level, component, message, data = null) {
        const levelConfig = this.levels[level];
        
        // Verificar si el nivel es suficiente para loggear
        if (!levelConfig || levelConfig.priority > this.currentLevel.priority) {
            return;
        }

        // Actualizar métricas
        this.updateMetrics(level);

        // Formatear mensaje
        const logEntry = this.formatLogMessage(level, component, message, data);

        // Mostrar en consola si está habilitado
        if (this.options.enableConsole) {
            this.writeToConsole(level, logEntry);
        }

        // Escribir a archivo si está habilitado
        if (this.options.enableFile && this.logStream) {
            this.writeToFile(logEntry);
        }
    }

    /**
     * Escribir a consola con colores
     */
    writeToConsole(level, logEntry) {
        const levelConfig = this.levels[level];
        const reset = '\x1b[0m';
        
        let output = '';
        
        if (this.options.enableColors) {
            output = `${levelConfig.color}${levelConfig.prefix} [${logEntry.component}] ${logEntry.message}${reset}`;
        } else {
            output = `${levelConfig.prefix} [${logEntry.component}] ${logEntry.message}`;
        }

        if (logEntry.data) {
            output += '\n   ' + JSON.stringify(logEntry.data, null, 2).replace(/\n/g, '\n   ');
        }

        console.log(output);
    }

    /**
     * Escribir a archivo
     */
    async writeToFile(logEntry) {
        try {
            const logLine = JSON.stringify(logEntry) + '\n';
            this.logStream.write(logLine);

            // Verificar rotación después de escribir
            await this.checkFileRotation();

        } catch (error) {
            console.error('❌ Error escribiendo a archivo de log:', error.message);
        }
    }

    /**
     * Actualizar métricas
     */
    updateMetrics(level) {
        if (!this.options.enableMetrics) return;

        this.metrics.totalLogs++;
        this.metrics.logsByLevel[level] = (this.metrics.logsByLevel[level] || 0) + 1;

        if (level === 'ERROR') {
            this.metrics.errorCount++;
        } else if (level === 'WARN') {
            this.metrics.warningCount++;
        }
    }

    /**
     * Métodos de logging públicos
     */
    error(component, message, data = null) {
        this.writeLog('ERROR', component, message, data);
    }

    warn(component, message, data = null) {
        this.writeLog('WARN', component, message, data);
    }

    info(component, message, data = null) {
        this.writeLog('INFO', component, message, data);
    }

    debug(component, message, data = null) {
        this.writeLog('DEBUG', component, message, data);
    }

    trace(component, message, data = null) {
        this.writeLog('TRACE', component, message, data);
    }

    success(component, message, data = null) {
        this.writeLog('INFO', component, `✅ ${message}`, data);
    }

    /**
     * Obtener métricas del sistema
     */
    getMetrics() {
        const uptimeMinutes = (Date.now() - this.metrics.startTime) / 1000 / 60;
        
        return {
            ...this.metrics,
            uptimeMinutes: Math.round(uptimeMinutes * 100) / 100,
            logsPerMinute: Math.round((this.metrics.totalLogs / uptimeMinutes) * 100) / 100,
            errorRate: this.metrics.totalLogs > 0 
                ? Math.round((this.metrics.errorCount / this.metrics.totalLogs) * 10000) / 100
                : 0
        };
    }

    /**
     * Cambiar nivel de logging dinámicamente
     */
    setLevel(newLevel) {
        const levelUpper = newLevel.toUpperCase();
        if (this.levels[levelUpper]) {
            this.currentLevel = this.levels[levelUpper];
            this.options.level = levelUpper;
            this.info('SYSTEM', 'Nivel de logging cambiado', { newLevel: levelUpper });
        } else {
            this.warn('SYSTEM', 'Nivel de logging inválido', { requestedLevel: newLevel });
        }
    }

    /**
     * Cerrar sistema de logging
     */
    async close() {
        this.info('SYSTEM', 'Cerrando sistema de logging');
        
        if (this.logStream) {
            this.logStream.end();
        }
    }
}

// Crear instancia global del logger
const logger = new UltraLoggingSystem({
    level: process.env.LOG_LEVEL || 'INFO',
    enableFile: process.env.ENABLE_FILE_LOGGING !== 'false',
    enableColors: process.env.ENABLE_LOG_COLORS !== 'false'
});

export default logger;
export { UltraLoggingSystem };
/**
 * SISTEMA DE LOGGING INTELIGENTE PARA EL SERVER
 * Reemplaza los 947 console.log por un sistema estructurado
 */

class IntelligentLogger {
    constructor(options = {}) {
        this.level = options.level || 'INFO';
        this.enableEmojis = options.enableEmojis !== false;
        this.enableColors = options.enableColors !== false;
        this.prefix = options.prefix || '[N8N-AI]';
        this.showTimestamp = options.showTimestamp !== false;
        
        // Configurar niveles de logging
        this.levels = {
            ERROR: 0,
            WARN: 1, 
            INFO: 2,
            DEBUG: 3,
            TRACE: 4
        };
        
        this.currentLevel = this.levels[this.level] || this.levels.INFO;
        
        // Configurar colores y emojis
        this.colors = {
            ERROR: '\x1b[31m',   // Rojo
            WARN: '\x1b[33m',    // Amarillo
            INFO: '\x1b[36m',    // Cian
            DEBUG: '\x1b[35m',   // Magenta
            TRACE: '\x1b[37m',   // Blanco
            RESET: '\x1b[0m'     // Reset
        };
        
        this.emojis = {
            ERROR: '❌',
            WARN: '⚠️',
            INFO: '📝', 
            DEBUG: '🔍',
            TRACE: '🔬',
            SUCCESS: '✅',
            LOADING: '⏳',
            PROCESSING: '⚡',
            AGENT: '🤖',
            SERVER: '🖥️',
            WORKFLOW: '🔄',
            CONFIG: '⚙️',
            PERFORMANCE: '📊'
        };
        
        // Contadores para análisis
        this.stats = {
            error: 0,
            warn: 0,
            info: 0,
            debug: 0,
            trace: 0,
            total: 0
        };
    }
    
    /**
     * MÉTODO PRINCIPAL DE LOGGING
     */
    log(level, message, data = null, emoji = null) {
        const levelNum = this.levels[level] || this.levels.INFO;
        
        if (levelNum > this.currentLevel) {
            return; // No mostrar si el nivel es menor al configurado
        }
        
        this.stats[level.toLowerCase()]++;
        this.stats.total++;
        
        const timestamp = this.showTimestamp ? this._getTimestamp() : '';
        const color = this.enableColors ? this.colors[level] : '';
        const resetColor = this.enableColors ? this.colors.RESET : '';
        const emojiIcon = this.enableEmojis ? (emoji || this.emojis[level] || '') : '';
        
        let logMessage = `${color}${timestamp}${this.prefix} ${emojiIcon} [${level}] ${message}${resetColor}`;
        
        if (data) {
            console.log(logMessage);
            if (typeof data === 'object') {
                console.log(color, JSON.stringify(data, null, 2), resetColor);
            } else {
                console.log(color, '  ', data, resetColor);
            }
        } else {
            console.log(logMessage);
        }
    }
    
    /**
     * MÉTODOS DE CONVENIENCIA
     */
    error(message, data = null) {
        this.log('ERROR', message, data);
    }
    
    warn(message, data = null) {
        this.log('WARN', message, data);
    }
    
    info(message, data = null) {
        this.log('INFO', message, data);
    }
    
    debug(message, data = null) {
        this.log('DEBUG', message, data);
    }
    
    trace(message, data = null) {
        this.log('TRACE', message, data);
    }
    
    /**
     * MÉTODOS ESPECIALIZADOS PARA EL SERVER
     */
    success(message, data = null) {
        this.log('INFO', message, data, this.emojis.SUCCESS);
    }
    
    loading(message, data = null) {
        this.log('INFO', message, data, this.emojis.LOADING);
    }
    
    processing(message, data = null) {
        this.log('INFO', message, data, this.emojis.PROCESSING);
    }
    
    agent(message, data = null) {
        this.log('INFO', message, data, this.emojis.AGENT);
    }
    
    server(message, data = null) {
        this.log('INFO', message, data, this.emojis.SERVER);
    }
    
    workflow(message, data = null) {
        this.log('INFO', message, data, this.emojis.WORKFLOW);
    }
    
    config(message, data = null) {
        this.log('DEBUG', message, data, this.emojis.CONFIG);
    }
    
    performance(message, data = null) {
        this.log('DEBUG', message, data, this.emojis.PERFORMANCE);
    }
    
    /**
     * SEPARADORES Y SECCIONES
     */
    separator(title = '', length = 60) {
        const line = '='.repeat(length);
        if (title) {
            const padding = Math.max(0, length - title.length - 2);
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            const formattedTitle = '='.repeat(leftPad) + ` ${title} ` + '='.repeat(rightPad);
            this.info(formattedTitle);
        } else {
            this.info(line);
        }
    }
    
    section(title) {
        this.separator(title);
    }
    
    subsection(title) {
        const line = '-'.repeat(40);
        this.info(`${line} ${title} ${line}`);
    }
    
    /**
     * GRUPOS DE LOGGING PARA OPERACIONES COMPLEJAS
     */
    group(title, callback) {
        this.info(`🔽 ${title}`);
        const startTime = Date.now();
        
        try {
            const result = callback();
            const duration = Date.now() - startTime;
            this.success(`🔼 ${title} completado (${duration}ms)`);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.error(`🔼 ${title} falló (${duration}ms)`, error.message);
            throw error;
        }
    }
    
    async asyncGroup(title, callback) {
        this.info(`🔽 ${title}`);
        const startTime = Date.now();
        
        try {
            const result = await callback();
            const duration = Date.now() - startTime;
            this.success(`🔼 ${title} completado (${duration}ms)`);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.error(`🔼 ${title} falló (${duration}ms)`, error.message);
            throw error;
        }
    }
    
    /**
     * PROGRESO PARA OPERACIONES LARGAS
     */
    progress(current, total, message = '') {
        const percentage = Math.round((current / total) * 100);
        const progressBar = this._createProgressBar(percentage);
        this.info(`${progressBar} ${percentage}% ${message}`);
    }
    
    /**
     * LOGGING CONDICIONAL
     */
    when(condition, callback) {
        if (condition) {
            callback(this);
        }
    }
    
    /**
     * ESTADÍSTICAS DE LOGGING
     */
    getStats() {
        return { ...this.stats };
    }
    
    printStats() {
        this.separator('LOGGING STATISTICS');
        this.info(`Total logs: ${this.stats.total}`);
        this.info(`Errors: ${this.stats.error}`);
        this.info(`Warnings: ${this.stats.warn}`);
        this.info(`Info: ${this.stats.info}`);
        this.info(`Debug: ${this.stats.debug}`);
        this.info(`Trace: ${this.stats.trace}`);
        this.separator();
    }
    
    /**
     * MÉTODOS UTILITARIOS PRIVADOS
     */
    _getTimestamp() {
        const now = new Date();
        return `[${now.toISOString().slice(11, 23)}] `;
    }
    
    _createProgressBar(percentage, length = 20) {
        const filled = Math.round((percentage / 100) * length);
        const empty = length - filled;
        return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
    }
    
    /**
     * CONFIGURACIÓN DINÁMICA
     */
    setLevel(level) {
        this.level = level;
        this.currentLevel = this.levels[level] || this.levels.INFO;
    }
    
    enableDebug() {
        this.setLevel('DEBUG');
    }
    
    enableTrace() {
        this.setLevel('TRACE');
    }
    
    quiet() {
        this.setLevel('ERROR');
    }
    
    verbose() {
        this.setLevel('TRACE');
    }
}

/**
 * CREAR INSTANCIA GLOBAL DEL LOGGER
 */
const logger = new IntelligentLogger({
    level: process.env.LOG_LEVEL || 'INFO',
    enableEmojis: process.env.LOG_EMOJIS !== 'false',
    enableColors: process.env.LOG_COLORS !== 'false',
    showTimestamp: process.env.LOG_TIMESTAMP !== 'false'
});

// Configurar nivel basado en NODE_ENV
if (process.env.NODE_ENV === 'development') {
    logger.setLevel('DEBUG');
} else if (process.env.NODE_ENV === 'production') {
    logger.setLevel('WARN');
}

/**
 * HELPERS PARA MIGRACIÓN DESDE CONSOLE.LOG
 */
const smartLog = {
    // Reemplazos directos más comunes
    '🔧': (...args) => logger.config(args.join(' ')),
    '✅': (...args) => logger.success(args.join(' ')),
    '❌': (...args) => logger.error(args.join(' ')),
    '⚠️': (...args) => logger.warn(args.join(' ')),
    '📦': (...args) => logger.loading(args.join(' ')),
    '🎯': (...args) => logger.info(args.join(' ')),
    '🚀': (...args) => logger.processing(args.join(' ')),
    '🤖': (...args) => logger.agent(args.join(' ')),
    
    // Método genérico para otros casos
    log: (...args) => {
        const message = args.join(' ');
        
        // Detectar tipo de mensaje por contenido
        if (message.includes('error') || message.includes('Error') || message.includes('ERROR')) {
            logger.error(message);
        } else if (message.includes('warn') || message.includes('Warning') || message.includes('WARN')) {
            logger.warn(message);
        } else if (message.includes('debug') || message.includes('Debug') || message.includes('DEBUG')) {
            logger.debug(message);
        } else {
            logger.info(message);
        }
    }
};

export { IntelligentLogger, logger, smartLog };
export default logger;
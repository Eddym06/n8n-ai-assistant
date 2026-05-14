/**
 * API Optimization Manager V1.0
 * Gestiona eficientemente el uso de la API de Gemini
 * Implementa cache, rate limiting y optimización de requests
 */

class APIOptimizationManager {
    constructor() {
        this.cache = new Map();
        this.rateLimits = {
            perMinute: 8, // Reserva 2 de 10
            perDay: 45,   // Reserva 5 de 50
            currentMinute: 0,
            currentDay: 0,
            lastMinuteReset: Date.now(),
            lastDayReset: Date.now()
        };
        this.batchQueue = [];
        this.lastRequestTime = 0;
        this.minInterval = 7500; // 7.5 segundos entre requests
    }

    /**
     * Verifica si podemos hacer una request sin violar límites
     */
    canMakeRequest() {
        this.updateRateLimitCounters();
        
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        const hasTimeBuffer = timeSinceLastRequest >= this.minInterval;
        const withinMinuteLimit = this.rateLimits.currentMinute < this.rateLimits.perMinute;
        const withinDayLimit = this.rateLimits.currentDay < this.rateLimits.perDay;
        
        return hasTimeBuffer && withinMinuteLimit && withinDayLimit;
    }

    /**
     * Actualiza contadores de rate limiting
     */
    updateRateLimitCounters() {
        const now = Date.now();
        
        // Reset contador por minuto
        if (now - this.rateLimits.lastMinuteReset >= 60000) {
            this.rateLimits.currentMinute = 0;
            this.rateLimits.lastMinuteReset = now;
            console.log('🔄 Rate limit por minuto reseteado');
        }
        
        // Reset contador por día
        if (now - this.rateLimits.lastDayReset >= 86400000) {
            this.rateLimits.currentDay = 0;
            this.rateLimits.lastDayReset = now;
            console.log('🔄 Rate limit diario reseteado');
        }
    }

    /**
     * Registra una request realizada
     */
    recordRequest() {
        this.rateLimits.currentMinute++;
        this.rateLimits.currentDay++;
        this.lastRequestTime = Date.now();
        
        console.log(`📊 API Usage: ${this.rateLimits.currentMinute}/${this.rateLimits.perMinute} min, ${this.rateLimits.currentDay}/${this.rateLimits.perDay} day`);
    }

    /**
     * Genera clave de cache basada en contexto
     */
    generateCacheKey(operation, content, model = 'default') {
        const hash = this.simpleHash(JSON.stringify({ operation, content, model }));
        return `${operation}_${model}_${hash}`;
    }

    /**
     * Hash simple para generar claves de cache
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Busca resultado en cache
     */
    getCachedResult(operation, content, model = 'default') {
        const key = this.generateCacheKey(operation, content, model);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < 300000) { // Cache válido por 5 minutos
            console.log(`💾 Cache HIT para ${operation} (${model})`);
            return cached.result;
        }
        
        if (cached) {
            this.cache.delete(key); // Limpia cache expirado
        }
        
        return null;
    }

    /**
     * Guarda resultado en cache
     */
    setCachedResult(operation, content, result, model = 'default') {
        const key = this.generateCacheKey(operation, content, model);
        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });
        
        console.log(`💾 Cache SAVE para ${operation} (${model})`);
        
        // Limita tamaño del cache
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    /**
     * Calcula tiempo de espera necesario
     */
    getWaitTime() {
        this.updateRateLimitCounters();
        
        if (!this.canMakeRequest()) {
            const timeSinceLastRequest = Date.now() - this.lastRequestTime;
            const timeToWait = Math.max(0, this.minInterval - timeSinceLastRequest);
            
            if (this.rateLimits.currentMinute >= this.rateLimits.perMinute) {
                const timeToMinuteReset = 60000 - (Date.now() - this.rateLimits.lastMinuteReset);
                return Math.max(timeToWait, timeToMinuteReset);
            }
            
            return timeToWait;
        }
        
        return 0;
    }

    /**
     * Optimiza llamadas múltiples agrupándolas
     */
    batchProblems(problems) {
        if (!problems || problems.length === 0) return [];
        
        // Agrupa problemas similares
        const grouped = new Map();
        
        problems.forEach(problem => {
            const type = problem.type || 'general';
            if (!grouped.has(type)) {
                grouped.set(type, []);
            }
            grouped.get(type).push(problem);
        });
        
        // Convierte a batch requests
        return Array.from(grouped.entries()).map(([type, problemList]) => ({
            type: 'batch',
            problemType: type,
            problems: problemList,
            count: problemList.length
        }));
    }

    /**
     * Valida si un request es realmente necesario
     */
    isRequestNecessary(operation, content) {
        // Skip requests vacíos o triviales
        if (!content || content.trim().length < 10) {
            console.log(`⏭️ Skipping trivial request: ${operation}`);
            return false;
        }
        
        // Skip requests repetitivos
        const recentSimilar = Array.from(this.cache.keys()).some(key => 
            key.includes(operation) && Date.now() - (this.cache.get(key)?.timestamp || 0) < 30000
        );
        
        if (recentSimilar) {
            console.log(`⏭️ Skipping recent similar request: ${operation}`);
            return false;
        }
        
        return true;
    }

    /**
     * Implementa delay inteligente
     */
    async waitIfNeeded() {
        const waitTime = this.getWaitTime();
        
        if (waitTime > 0) {
            console.log(`⏳ Esperando ${Math.round(waitTime/1000)}s para respetar rate limits...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    /**
     * Wrapper optimizado para requests a Gemini
     */
    async optimizedRequest(operation, content, model, requestFn) {
        // 1. Verificar cache
        const cached = this.getCachedResult(operation, content, model);
        if (cached) {
            return cached;
        }
        
        // 2. Verificar si es necesario
        if (!this.isRequestNecessary(operation, content)) {
            return null;
        }
        
        // 3. Esperar si es necesario
        await this.waitIfNeeded();
        
        // 4. Verificar límites una vez más
        if (!this.canMakeRequest()) {
            console.log(`🚫 Request bloqueado por rate limiting: ${operation}`);
            throw new Error('Rate limit exceeded, try again later');
        }
        
        // 5. Realizar request
        try {
            console.log(`📞 API Request: ${operation} (${model})`);
            this.recordRequest();
            
            const result = await requestFn();
            
            // 6. Cache resultado
            this.setCachedResult(operation, content, result, model);
            
            return result;
        } catch (error) {
            console.log(`❌ API Request failed: ${operation} - ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de uso
     */
    getUsageStats() {
        this.updateRateLimitCounters();
        
        return {
            minute: {
                used: this.rateLimits.currentMinute,
                limit: this.rateLimits.perMinute,
                remaining: this.rateLimits.perMinute - this.rateLimits.currentMinute
            },
            day: {
                used: this.rateLimits.currentDay,
                limit: this.rateLimits.perDay,
                remaining: this.rateLimits.perDay - this.rateLimits.currentDay
            },
            cache: {
                size: this.cache.size,
                hitRate: this.calculateCacheHitRate()
            },
            nextAvailable: this.getWaitTime()
        };
    }

    /**
     * Calcula tasa de acierto del cache
     */
    calculateCacheHitRate() {
        // Simplificado - en producción sería más sofisticado
        return this.cache.size > 0 ? Math.min(0.8, this.cache.size / 20) : 0;
    }

    /**
     * Limpia cache expirado
     */
    cleanupCache() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > 300000) { // 5 minutos
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cache cleanup: ${cleaned} entradas eliminadas`);
        }
    }
}

// Instancia global singleton
const apiOptimizer = new APIOptimizationManager();

module.exports = {
    APIOptimizationManager,
    apiOptimizer
};
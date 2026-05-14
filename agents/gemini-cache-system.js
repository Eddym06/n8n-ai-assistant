/**
 * GEMINI CACHE SYSTEM - Sistema de Cache Inteligente para Respuestas API
 * 
 * Implementa un sistema de cache avanzado para las respuestas de Gemini API
 * que reduce costos, mejora rendimiento y proporciona resiliencia.
 * 
 * CARACTERÍSTICAS:
 * - Cache en memoria con TTL configurable
 * - Persistencia en archivo JSON para recuperación entre sesiones
 * - Hash inteligente de prompts para detección de similitudes
 * - Métricas de hit/miss rate
 * - Límite de tamaño con LRU eviction
 * - Compresión de datos para optimizar espacio
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';

class GeminiCacheSystem {
    constructor(options = {}) {
        this.options = {
            maxSize: 1000,                    // Máximo 1000 entradas en cache
            ttlMs: 24 * 60 * 60 * 1000,     // TTL: 24 horas
            persistFile: 'gemini-cache.json', // Archivo de persistencia
            enableCompression: true,          // Comprimir respuestas grandes
            enableMetrics: true,              // Habilitar métricas
            similarityThreshold: 0.85,        // Umbral para prompts similares
            ...options
        };

        // Cache en memoria
        this.cache = new Map();
        this.accessTimes = new Map();
        
        // Métricas
        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0,
            saves: 0,
            loads: 0,
            compressionSaved: 0
        };

        console.log('🗄️ Gemini Cache System inicializado');
        console.log(`   📦 Tamaño máximo: ${this.options.maxSize} entradas`);
        console.log(`   ⏰ TTL: ${this.options.ttlMs / 1000 / 60} minutos`);
        
        // Cargar cache existente
        this.loadCache();
    }

    /**
     * Genera hash único para un prompt
     */
    generatePromptHash(prompt, model = 'default', options = {}) {
        const normalizedPrompt = this.normalizePrompt(prompt);
        const hashInput = JSON.stringify({
            prompt: normalizedPrompt,
            model,
            temperature: options.temperature || 1.0,
            maxTokens: options.maxTokens || 50000
        });
        
        return crypto.createHash('sha256').update(hashInput).digest('hex');
    }

    /**
     * Normaliza un prompt para mejorar detección de similitudes
     */
    normalizePrompt(prompt) {
        return prompt
            .toLowerCase()
            .replace(/\s+/g, ' ')           // Normalizar espacios
            .replace(/[^\w\s]/g, '')       // Remover puntuación
            .trim();
    }

    /**
     * Calcula similitud entre dos prompts
     */
    calculateSimilarity(prompt1, prompt2) {
        const norm1 = this.normalizePrompt(prompt1);
        const norm2 = this.normalizePrompt(prompt2);
        
        // Similitud simple basada en palabras comunes
        const words1 = new Set(norm1.split(' '));
        const words2 = new Set(norm2.split(' '));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    /**
     * Busca entradas similares en el cache
     */
    findSimilarEntry(prompt, threshold = null) {
        threshold = threshold || this.options.similarityThreshold;
        
        for (const [hash, entry] of this.cache) {
            if (this.isExpired(entry)) continue;
            
            const similarity = this.calculateSimilarity(prompt, entry.originalPrompt);
            if (similarity >= threshold) {
                console.log(`🔄 Encontrada entrada similar (${Math.round(similarity * 100)}% similitud)`);
                return { hash, entry, similarity };
            }
        }
        
        return null;
    }

    /**
     * Obtener respuesta del cache
     */
    async get(prompt, model = 'default', options = {}) {
        const hash = this.generatePromptHash(prompt, model, options);
        
        // Buscar hash exacto primero
        if (this.cache.has(hash)) {
            const entry = this.cache.get(hash);
            
            if (this.isExpired(entry)) {
                this.cache.delete(hash);
                this.accessTimes.delete(hash);
                console.log(`🗑️ Entrada expirada removida del cache`);
            } else {
                this.metrics.hits++;
                this.updateAccessTime(hash);
                console.log(`🎯 Cache HIT - Respuesta encontrada`);
                return this.decompressData(entry.response);
            }
        }

        // Buscar entradas similares
        const similar = this.findSimilarEntry(prompt);
        if (similar) {
            this.metrics.hits++;
            this.updateAccessTime(similar.hash);
            console.log(`🎯 Cache HIT (similar) - Respuesta encontrada`);
            return this.decompressData(similar.entry.response);
        }

        this.metrics.misses++;
        console.log(`❌ Cache MISS - No encontrado`);
        return null;
    }

    /**
     * Guardar respuesta en cache
     */
    async set(prompt, model, options, response) {
        const hash = this.generatePromptHash(prompt, model, options);
        
        // Comprimir respuesta si es necesario
        const compressedResponse = this.compressData(response);
        
        const entry = {
            originalPrompt: prompt,
            model,
            options,
            response: compressedResponse,
            timestamp: Date.now(),
            size: JSON.stringify(response).length,
            compressedSize: JSON.stringify(compressedResponse).length
        };

        // Verificar si necesitamos hacer espacio
        if (this.cache.size >= this.options.maxSize) {
            this.evictLRU();
        }

        this.cache.set(hash, entry);
        this.updateAccessTime(hash);
        this.metrics.saves++;

        console.log(`💾 Respuesta guardada en cache (${entry.size} → ${entry.compressedSize} bytes)`);
        
        // Guardar en disco periódicamente
        if (this.metrics.saves % 10 === 0) {
            await this.persistCache();
        }
    }

    /**
     * Comprimir datos grandes
     */
    compressData(data) {
        if (!this.options.enableCompression) return data;
        
        const jsonStr = JSON.stringify(data);
        if (jsonStr.length < 1000) return data; // No comprimir datos pequeños
        
        // Compresión simple: remover espacios innecesarios y duplicados
        const compressed = {
            _compressed: true,
            data: jsonStr.replace(/\s+/g, ' ').trim()
        };
        
        const savedBytes = jsonStr.length - JSON.stringify(compressed).length;
        this.metrics.compressionSaved += savedBytes;
        
        return compressed;
    }

    /**
     * Descomprimir datos
     */
    decompressData(data) {
        if (!data || !data._compressed) return data;
        
        try {
            return JSON.parse(data.data);
        } catch (error) {
            console.warn('⚠️ Error descomprimiendo cache:', error.message);
            return data;
        }
    }

    /**
     * Verificar si una entrada ha expirado
     */
    isExpired(entry) {
        return Date.now() - entry.timestamp > this.options.ttlMs;
    }

    /**
     * Actualizar tiempo de acceso para LRU
     */
    updateAccessTime(hash) {
        this.accessTimes.set(hash, Date.now());
    }

    /**
     * Eliminar entrada menos usada recientemente (LRU)
     */
    evictLRU() {
        let oldestHash = null;
        let oldestTime = Date.now();

        for (const [hash, time] of this.accessTimes) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestHash = hash;
            }
        }

        if (oldestHash) {
            this.cache.delete(oldestHash);
            this.accessTimes.delete(oldestHash);
            this.metrics.evictions++;
            console.log(`🗑️ Entrada LRU evicted del cache`);
        }
    }

    /**
     * Cargar cache desde archivo
     */
    async loadCache() {
        try {
            const cacheFile = path.join(process.cwd(), this.options.persistFile);
            const data = await fs.readFile(cacheFile, 'utf-8');
            const parsed = JSON.parse(data);
            
            let loadedCount = 0;
            for (const [hash, entry] of Object.entries(parsed.cache || {})) {
                if (!this.isExpired(entry)) {
                    this.cache.set(hash, entry);
                    this.accessTimes.set(hash, entry.timestamp);
                    loadedCount++;
                }
            }
            
            if (parsed.metrics) {
                this.metrics = { ...this.metrics, ...parsed.metrics };
            }
            
            this.metrics.loads++;
            console.log(`📁 Cache cargado: ${loadedCount} entradas válidas`);
            
        } catch (error) {
            console.log(`📁 No se pudo cargar cache existente: ${error.message}`);
        }
    }

    /**
     * Persistir cache a archivo
     */
    async persistCache() {
        try {
            const cacheFile = path.join(process.cwd(), this.options.persistFile);
            const cacheObj = {};
            
            for (const [hash, entry] of this.cache) {
                if (!this.isExpired(entry)) {
                    cacheObj[hash] = entry;
                }
            }
            
            const data = {
                cache: cacheObj,
                metrics: this.metrics,
                lastSaved: Date.now()
            };
            
            await fs.writeFile(cacheFile, JSON.stringify(data, null, 2));
            console.log(`💾 Cache persistido: ${Object.keys(cacheObj).length} entradas`);
            
        } catch (error) {
            console.warn(`⚠️ Error persistiendo cache: ${error.message}`);
        }
    }

    /**
     * Limpiar entradas expiradas
     */
    cleanup() {
        let cleaned = 0;
        for (const [hash, entry] of this.cache) {
            if (this.isExpired(entry)) {
                this.cache.delete(hash);
                this.accessTimes.delete(hash);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cache cleanup: ${cleaned} entradas expiradas removidas`);
        }
        
        return cleaned;
    }

    /**
     * Obtener estadísticas del cache
     */
    getStats() {
        const hitRate = this.metrics.hits + this.metrics.misses > 0 
            ? (this.metrics.hits / (this.metrics.hits + this.metrics.misses) * 100).toFixed(1)
            : 0;
            
        return {
            size: this.cache.size,
            maxSize: this.options.maxSize,
            hitRate: `${hitRate}%`,
            metrics: this.metrics,
            compressionSaved: `${(this.metrics.compressionSaved / 1024).toFixed(1)} KB`
        };
    }

    /**
     * Limpiar todo el cache
     */
    clear() {
        this.cache.clear();
        this.accessTimes.clear();
        console.log('🧹 Cache completamente limpiado');
    }
}

export default GeminiCacheSystem;
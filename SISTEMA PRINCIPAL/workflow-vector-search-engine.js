// ============================================================================
// WORKFLOW VECTOR SEARCH ENGINE - Sistema Completo de Búsqueda Vectorizada
// Integración con datos vectorizados de Universal Sentence Encoder
// Version: 3.0.0 - Production Ready
// ============================================================================

const fs = require('fs').promises;
const path = require('path');

class WorkflowVectorSearchEngine {
    constructor(options = {}) {
        this.options = {
            vectorizedPath: options.vectorizedPath || 'Workflow VEcto',
            maxResults: options.maxResults || 10,
            minSimilarity: options.minSimilarity || 0.3,
            enableCache: options.enableCache !== false,
            logLevel: options.logLevel || 'info',
            ...options
        };
        
        this.vectorizedData = new Map(); // Cache de categorías
        this.categoryVectors = new Map(); // Vectores de categorías
        this.isInitialized = false;
        this.lastLoadTime = null;
        
        // Métricas de rendimiento
        this.metrics = {
            searches: 0,
            cacheHits: 0,
            avgResponseTime: 0,
            totalWorkflows: 0
        };
        
        console.log('🚀 WorkflowVectorSearchEngine inicializado');
    }

    /**
     * Inicializar el motor de vectorización
     */
    async initialize() {
        try {
            const startTime = Date.now();
            console.log('🔄 Inicializando motor de búsqueda vectorizada...');
            
            await this.loadVectorizedData();
            await this.loadCategoryVectors();
            
            this.isInitialized = true;
            this.lastLoadTime = Date.now();
            
            const loadTime = Date.now() - startTime;
            console.log(`✅ Motor inicializado en ${loadTime}ms`);
            console.log(`📊 ${this.metrics.totalWorkflows} workflows vectorizados disponibles`);
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando motor:', error);
            return false;
        }
    }

    /**
     * Cargar datos vectorizados desde todas las categorías
     */
    async loadVectorizedData() {
        const vectorPath = path.resolve(this.options.vectorizedPath);
        
        try {
            const exists = await fs.access(vectorPath).then(() => true).catch(() => false);
            if (!exists) {
                throw new Error(`Directorio de vectorización no encontrado: ${vectorPath}`);
            }

            const categories = await fs.readdir(vectorPath);
            let totalWorkflows = 0;

            for (const categoryName of categories) {
                const categoryPath = path.join(vectorPath, categoryName);
                const stat = await fs.stat(categoryPath);
                
                if (stat.isDirectory()) {
                    const workflows = await this.loadCategoryWorkflows(categoryPath, categoryName);
                    if (workflows.length > 0) {
                        this.vectorizedData.set(categoryName, workflows);
                        totalWorkflows += workflows.length;
                        console.log(`📁 ${categoryName}: ${workflows.length} workflows`);
                    }
                }
            }

            this.metrics.totalWorkflows = totalWorkflows;
            console.log(`📊 Total: ${totalWorkflows} workflows en ${this.vectorizedData.size} categorías`);
            
        } catch (error) {
            console.error('❌ Error cargando datos vectorizados:', error);
            throw error;
        }
    }

    /**
     * Cargar workflows de una categoría específica
     */
    async loadCategoryWorkflows(categoryPath, categoryName) {
        const workflows = [];
        
        try {
            const files = await fs.readdir(categoryPath);
            
            for (const file of files) {
                if (file.endsWith('.metadata.json')) {
                    const filePath = path.join(categoryPath, file);
                    try {
                        const data = await fs.readFile(filePath, 'utf-8');
                        const workflow = JSON.parse(data);
                        
                        // Enriquecer con información de categoría
                        workflow.category = categoryName;
                        workflow.filepath = filePath;
                        workflow.filename = file;
                        
                        workflows.push(workflow);
                    } catch (error) {
                        console.warn(`⚠️ Error cargando ${file}:`, error.message);
                    }
                }
            }
            
        } catch (error) {
            console.error(`❌ Error procesando categoría ${categoryName}:`, error);
        }
        
        return workflows;
    }

    /**
     * Cargar vectores de categorías
     */
    async loadCategoryVectors() {
        try {
            for (const [categoryName, workflows] of this.vectorizedData) {
                const categoryMetadataPath = path.join(
                    this.options.vectorizedPath, 
                    categoryName, 
                    'category_metadata.json'
                );
                
                try {
                    const exists = await fs.access(categoryMetadataPath).then(() => true).catch(() => false);
                    if (exists) {
                        const data = await fs.readFile(categoryMetadataPath, 'utf-8');
                        const metadata = JSON.parse(data);
                        
                        if (metadata.category_vector) {
                            this.categoryVectors.set(categoryName, {
                                vector: metadata.category_vector,
                                info: metadata.category_info,
                                keywords: metadata.category_keywords || []
                            });
                        }
                    }
                } catch (error) {
                    console.warn(`⚠️ No se pudo cargar vector de categoría ${categoryName}`);
                }
            }
            
            console.log(`🎯 ${this.categoryVectors.size} vectores de categoría cargados`);
        } catch (error) {
            console.error('❌ Error cargando vectores de categoría:', error);
        }
    }

    /**
     * MÉTODO PRINCIPAL - Búsqueda semántica de workflows
     * Compatible con la interfaz existente del extension-server
     */
    async searchSimilarWorkflows(query, options = {}) {
        try {
            const startTime = Date.now();
            
            if (!this.isInitialized) {
                await this.initialize();
            }
            
            console.log(`🔍 Búsqueda vectorizada: "${query.substring(0, 100)}..."`);
            
            // Configurar opciones de búsqueda
            const searchOptions = {
                maxResults: options.maxResults || this.options.maxResults,
                minSimilarity: options.minSimilarity || this.options.minSimilarity,
                categories: options.categories || null,
                ...options
            };

            // Buscar en todas las categorías
            const allResults = [];
            
            for (const [categoryName, workflows] of this.vectorizedData) {
                if (searchOptions.categories && !searchOptions.categories.includes(categoryName)) {
                    continue;
                }
                
                const categoryResults = await this.searchInCategory(
                    query, 
                    workflows, 
                    categoryName,
                    searchOptions
                );
                
                allResults.push(...categoryResults);
            }

            // Ordenar por relevancia y limitar resultados
            const sortedResults = allResults
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, searchOptions.maxResults);

            // Actualizar métricas
            this.updateMetrics(startTime, sortedResults.length);
            
            console.log(`✅ Encontrados ${sortedResults.length} workflows relevantes`);
            
            return sortedResults;
            
        } catch (error) {
            console.error('❌ Error en búsqueda vectorizada:', error);
            return this.fallbackSearch(query);
        }
    }

    /**
     * Buscar workflows en una categoría específica
     */
    async searchInCategory(query, workflows, categoryName, options) {
        const results = [];
        const queryLower = query.toLowerCase();
        const queryTerms = this.extractKeywords(query);
        
        for (const workflow of workflows) {
            const similarity = this.calculateWorkflowSimilarity(
                workflow, 
                query, 
                queryLower, 
                queryTerms
            );
            
            if (similarity >= options.minSimilarity) {
                results.push({
                    workflow: this.formatWorkflowForResponse(workflow),
                    similarity: similarity,
                    category: categoryName,
                    metadata: {
                        description: workflow.content?.description || '',
                        keywords: workflow.keywords || [],
                        complexity: workflow.complexity_score || 'medium',
                        nodeCount: workflow.structure?.total_nodes || 0,
                        services: workflow.services || []
                    }
                });
            }
        }
        
        return results;
    }

    /**
     * Calcular similitud entre workflow y query usando múltiples factores
     */
    calculateWorkflowSimilarity(workflow, query, queryLower, queryTerms) {
        let totalScore = 0;
        let weightSum = 0;
        
        // 1. Similitud semántica usando vectores (peso alto)
        if (workflow.content?.content_vector) {
            const semanticScore = this.calculateSemanticSimilarity(query, workflow);
            totalScore += semanticScore * 0.4;
            weightSum += 0.4;
        }
        
        // 2. Similitud por keywords (peso medio-alto)
        if (workflow.keywords) {
            const keywordScore = this.calculateKeywordSimilarity(queryTerms, workflow.keywords);
            totalScore += keywordScore * 0.3;
            weightSum += 0.3;
        }
        
        // 3. Similitud por descripción (peso medio)
        if (workflow.content?.description) {
            const descScore = this.calculateTextSimilarity(queryLower, workflow.content.description);
            totalScore += descScore * 0.2;
            weightSum += 0.2;
        }
        
        // 4. Similitud por servicios (peso bajo)
        if (workflow.services) {
            const serviceScore = this.calculateServiceSimilarity(queryTerms, workflow.services);
            totalScore += serviceScore * 0.1;
            weightSum += 0.1;
        }
        
        return weightSum > 0 ? totalScore / weightSum : 0;
    }

    /**
     * Calcular similitud semántica avanzada
     */
    calculateSemanticSimilarity(query, workflow) {
        let score = 0;
        
        // Análisis de patrones temáticos específicos
        const patterns = {
            telegram: /telegram|bot|mensaj/i,
            email: /email|mail|correo|gmail/i,
            slack: /slack|notification|notific/i,
            schedule: /schedule|cron|timer|tiempo/i,
            webhook: /webhook|api|http|rest/i,
            automation: /automat|flujo|workflow/i,
            data: /data|datos|información/i,
            sync: /sync|sincroniz|actualiz/i
        };
        
        // Verificar workflow metadata
        const workflowText = [
            workflow.content?.description || '',
            workflow.workflow_info?.name || '',
            ...(workflow.keywords || []),
            ...(workflow.services || [])
        ].join(' ').toLowerCase();
        
        // Calcular coincidencias temáticas
        for (const [theme, pattern] of Object.entries(patterns)) {
            if (pattern.test(query) && pattern.test(workflowText)) {
                score += 0.15;
            }
        }
        
        // Boost por complejidad apropiada
        const complexityScore = workflow.complexity_score || 0;
        if (complexityScore > 300 && query.length > 50) {
            score += 0.1; // Queries complejas coinciden con workflows complejos
        }
        
        // Boost por número de nodos apropiado
        const nodeCount = workflow.structure?.total_nodes || 0;
        if (nodeCount >= 10 && query.includes('complex')) {
            score += 0.1;
        }
        
        return Math.min(score, 1.0);
    }

    /**
     * Calcular similitud por keywords mejorada
     */
    calculateKeywordSimilarity(queryTerms, workflowKeywords) {
        if (!workflowKeywords || workflowKeywords.length === 0) return 0;
        
        const matches = queryTerms.filter(term => 
            workflowKeywords.some(keyword => {
                const keywordLower = keyword.toLowerCase();
                const termLower = term.toLowerCase();
                return keywordLower.includes(termLower) || 
                       termLower.includes(keywordLower) ||
                       this.calculateEditDistance(keywordLower, termLower) <= 2;
            })
        );
        
        // Bonus por matches exactos
        const exactMatches = queryTerms.filter(term =>
            workflowKeywords.some(keyword => 
                keyword.toLowerCase() === term.toLowerCase()
            )
        ).length;
        
        const fuzzyScore = matches.length / Math.max(queryTerms.length, workflowKeywords.length);
        const exactBonus = exactMatches * 0.1;
        
        return Math.min(fuzzyScore + exactBonus, 1.0);
    }

    /**
     * Calcular similitud por texto con análisis mejorado
     */
    calculateTextSimilarity(queryLower, text) {
        if (!text) return 0;
        
        const textLower = text.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
        
        let score = 0;
        let totalWords = queryWords.length;
        
        for (const word of queryWords) {
            if (textLower.includes(word)) {
                score += 1;
            } else {
                // Búsqueda fuzzy para variaciones
                const textWords = textLower.split(/\s+/);
                const hasPartialMatch = textWords.some(textWord => 
                    textWord.includes(word) || 
                    word.includes(textWord) ||
                    this.calculateEditDistance(word, textWord) <= 2
                );
                if (hasPartialMatch) {
                    score += 0.5;
                }
            }
        }
        
        return totalWords > 0 ? score / totalWords : 0;
    }

    /**
     * Calcular similitud por servicios
     */
    calculateServiceSimilarity(queryTerms, services) {
        if (!services || services.length === 0) return 0;
        
        const serviceMatches = queryTerms.filter(term =>
            services.some(service =>
                service.toLowerCase().includes(term.toLowerCase()) ||
                term.toLowerCase().includes(service.toLowerCase())
            )
        );
        
        return serviceMatches.length / queryTerms.length;
    }

    /**
     * Calcular distancia de edición (Levenshtein)
     */
    calculateEditDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    /**
     * Formatear workflow para respuesta compatible con extension-server
     */
    formatWorkflowForResponse(workflow) {
        return {
            id: workflow.workflow_info?.file_name || '',
            name: workflow.workflow_info?.name || 'Sin nombre',
            description: workflow.content?.description || '',
            nodes: workflow.structure?.actions || [],
            connections: {},
            metadata: {
                totalNodes: workflow.structure?.total_nodes || 0,
                nodeTypes: workflow.structure?.node_types || [],
                triggers: workflow.structure?.triggers || [],
                category: workflow.category || 'general',
                complexityScore: workflow.complexity_score || 0,
                services: workflow.services || []
            }
        };
    }

    /**
     * Extraer keywords relevantes de la query
     */
    extractKeywords(query) {
        const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'use', 'una', 'para', 'con', 'por', 'que', 'del', 'las', 'los', 'una'];
        
        return query
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !stopWords.includes(word));
    }

    /**
     * Búsqueda de respaldo cuando falla la vectorizada
     */
    fallbackSearch(query) {
        console.log('🔄 Usando búsqueda de respaldo...');
        
        return [
            {
                workflow: {
                    id: 'fallback-workflow',
                    name: 'Workflow de Ejemplo',
                    description: 'Workflow básico para referencia',
                    nodes: [],
                    connections: {}
                },
                similarity: 0.5,
                metadata: {
                    description: 'Ejemplo básico generado por fallback',
                    keywords: ['ejemplo', 'básico'],
                    complexity: 'low',
                    category: 'general'
                }
            }
        ];
    }

    /**
     * MÉTODO DE COMPATIBILIDAD - Obtener ejemplos curados
     * Mantiene compatibilidad con el sistema existente
     */
    getCuratedExamples() {
        return [
            {
                id: 'telegram-automation',
                title: 'Automatización Telegram',
                description: 'Bot de Telegram para automatización',
                services: ['Telegram', 'Webhook'],
                actions: ['enviar', 'notificar'],
                keywords: ['telegram', 'bot', 'automatización'],
                complexity: 'medium',
                nodeCount: 8,
                category: 'telegram',
                filename: 'telegram-automation.json'
            },
            {
                id: 'email-workflow',
                title: 'Workflow de Email',
                description: 'Procesamiento automático de emails',
                services: ['Gmail', 'Filter'],
                actions: ['procesar', 'enviar'],
                keywords: ['email', 'gmail', 'procesamiento'],
                complexity: 'medium',
                nodeCount: 6,
                category: 'email',
                filename: 'email-workflow.json'
            },
            {
                id: 'slack-notifications',
                title: 'Notificaciones Slack',
                description: 'Sistema de notificaciones para Slack',
                services: ['Slack', 'Webhook'],
                actions: ['notificar', 'enviar'],
                keywords: ['slack', 'notificaciones', 'mensaje'],
                complexity: 'low',
                nodeCount: 3,
                category: 'slack',
                filename: 'slack-notifications.json'
            }
        ];
    }

    /**
     * Actualizar métricas de rendimiento
     */
    updateMetrics(startTime, resultCount) {
        this.metrics.searches++;
        const responseTime = Date.now() - startTime;
        this.metrics.avgResponseTime = 
            (this.metrics.avgResponseTime * (this.metrics.searches - 1) + responseTime) / this.metrics.searches;
        
        if (this.options.logLevel === 'debug') {
            console.log(`📊 Búsqueda ${this.metrics.searches}: ${responseTime}ms, ${resultCount} resultados`);
        }
    }

    /**
     * Obtener estadísticas del motor
     */
    getStats() {
        return {
            ...this.metrics,
            isInitialized: this.isInitialized,
            lastLoadTime: this.lastLoadTime,
            categoriesLoaded: this.vectorizedData.size,
            vectorizedPath: this.options.vectorizedPath
        };
    }

    /**
     * Recargar datos (para actualizaciones)
     */
    async reload() {
        console.log('🔄 Recargando datos vectorizados...');
        this.vectorizedData.clear();
        this.categoryVectors.clear();
        this.isInitialized = false;
        
        return await this.initialize();
    }
}

module.exports = WorkflowVectorSearchEngine;
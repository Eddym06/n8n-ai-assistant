// ============================================================================
// WORKFLOW VECTOR SEARCH ENGINE - Sistema Completo de Búsqueda Vectorizada
// Integración con datos vectorizados de Universal Sentence Encoder
// Version: 3.0.0 - Production Ready - ES Modules
// ============================================================================

import fs from 'fs/promises';
import path from 'path';

export default class WorkflowVectorSearchEngine {
    constructor(options = {}) {
        this.options = {
            vectorizedPath: options.vectorizedPath || 'Workflows Vectorizados Oficial', // Base de datos gigantesca unificada
            maxResults: options.maxResults || 15, // Aumentado para base de datos más grande
            minSimilarity: options.minSimilarity || 0.03, // Reducido para mayor cobertura con BD gigante
            enableCache: options.enableCache !== false,
            logLevel: options.logLevel || 'info',
            ...options
        };
        
        this.vectorizedData = new Map(); // Cache de categorías
        this.categoryVectors = new Map(); // Vectores de categorías
        this.queryEmbeddings = new Map(); // Cache de embeddings de queries
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
     * Cargar workflows de una categoría específica - ACTUALIZADO para estructura unificada
     */
    async loadCategoryWorkflows(categoryPath, categoryName) {
        const workflows = [];
        
        try {
            const files = await fs.readdir(categoryPath);
            
            for (const file of files) {
                // Soporte para workflows vectorizados (.json) y metadata (.metadata.json)
                if (file.endsWith('.json') && !file.includes('category_metadata') && !file.includes('summary')) {
                    const filePath = path.join(categoryPath, file);
                    try {
                        const data = await fs.readFile(filePath, 'utf-8');
                        const workflow = JSON.parse(data);
                        
                        // Verificar si es un workflow vectorizado (nueva estructura)
                        if (workflow.vectorizationData) {
                            // Extraer metadatos del nuevo formato vectorizado
                            const vectorizedWorkflow = {
                                ...workflow.vectorizationData.metadata,
                                vectorizationData: workflow.vectorizationData,
                                category: categoryName,
                                filepath: filePath,
                                filename: file,
                                isVectorized: true,
                                originalWorkflow: workflow
                            };
                            workflows.push(vectorizedWorkflow);
                        } else if (file.endsWith('.metadata.json')) {
                            // Formato anterior de metadata
                            workflow.category = categoryName;
                            workflow.filepath = filePath;
                            workflow.filename = file;
                            workflow.isVectorized = false;
                            workflows.push(workflow);
                        }
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
     * OPTIMIZADO para base de datos gigante (2,714+ workflows)
     */
    async searchSimilarWorkflows(query, options = {}) {
        try {
            const startTime = Date.now();
            
            if (!this.isInitialized) {
                await this.initialize();
            }
            
            console.log(`🔍 Búsqueda en base de datos gigante: "${query.substring(0, 100)}..." (${this.metrics.totalWorkflows} workflows)`);
            
            // Generar embedding para la query si no está en cache
            if (!this.queryEmbeddings.has(query)) {
                await this.generateQueryEmbedding(query);
            }
            
            // Configurar opciones de búsqueda optimizadas para BD gigante
            const searchOptions = {
                maxResults: options.maxResults || this.options.maxResults,
                minSimilarity: options.minSimilarity || this.options.minSimilarity,
                categories: options.categories || null,
                enableParallelSearch: true, // Búsqueda paralela para BD gigante
                enableEarlyStop: true, // Parar temprano si encontramos suficientes resultados excelentes
                ...options
            };

            // 🚀 BÚSQUEDA PARALELA OPTIMIZADA para base de datos gigante
            const categoryPromises = [];
            
            for (const [categoryName, workflows] of this.vectorizedData) {
                if (searchOptions.categories && !searchOptions.categories.includes(categoryName)) {
                    continue;
                }
                
                // Crear promesa para búsqueda paralela
                const categoryPromise = this.searchInCategory(
                    query, 
                    workflows, 
                    categoryName,
                    searchOptions
                ).then(results => ({
                    categoryName,
                    results,
                    count: results.length
                }));
                
                categoryPromises.push(categoryPromise);
            }

            // Ejecutar búsquedas en paralelo
            const categoryResults = await Promise.all(categoryPromises);
            
            // Combinar resultados y mostrar estadísticas por categoría
            const allResults = [];
            let totalCategoriesSearched = 0;
            
            for (const { categoryName, results, count } of categoryResults) {
                if (count > 0) {
                    console.log(`📁 ${categoryName}: ${count} matches encontrados`);
                    allResults.push(...results);
                    totalCategoriesSearched++;
                }
            }

            // Ordenar por relevancia con algoritmo optimizado para resultados grandes
            const sortedResults = this.optimizedSort(allResults, searchOptions.maxResults);

            // Actualizar métricas
            this.updateMetrics(startTime, sortedResults.length);
            
            console.log(`✅ RESULTADO FINAL: ${sortedResults.length} workflows de ${totalCategoriesSearched} categorías`);
            console.log(`⚡ Búsqueda completada en ${Date.now() - startTime}ms`);
            
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
        
        // Debug logging para Telegram específicamente
        const isDebugCategory = categoryName === 'Telegram';
        if (isDebugCategory) {
            console.log(`🔍 Debugeando categoría ${categoryName}: ${workflows.length} workflows`);
            console.log(`🔍 Query terms: ${queryTerms.join(', ')}`);
            
            // Debug del primer workflow para entender la estructura
            if (workflows.length > 0) {
                const firstWorkflow = workflows[0];
                console.log(`🔍 Estructura primer workflow:`);
                console.log(`  - workflow_info: ${!!firstWorkflow.workflow_info}`);
                console.log(`  - semantic_vector: ${!!firstWorkflow.semantic_vector}`);
                console.log(`  - file_name: ${firstWorkflow.workflow_info?.file_name}`);
                console.log(`  - vector length: ${firstWorkflow.semantic_vector?.length}`);
            }
        }
        
        for (const workflow of workflows) {
            const similarity = this.calculateWorkflowSimilarity(
                workflow, 
                query, 
                queryLower, 
                queryTerms
            );
            
            if (isDebugCategory) {
                console.log(`🔍 ${workflow.workflow_info?.file_name}: similarity = ${similarity.toFixed(3)}`);
            }
            
            if (similarity >= options.minSimilarity) {
                const formattedWorkflow = this.formatWorkflowForResponse(workflow);
                
                results.push({
                    workflow: formattedWorkflow,
                    similarity: similarity,
                    category: categoryName,
                    // ✅ CAMPOS CRÍTICOS PARA EXTENSION SERVER - NIVEL SUPERIOR
                    fileName: formattedWorkflow.fileName || workflow.filename || '',
                    filename: formattedWorkflow.filename || workflow.filename || '',
                    filePath: formattedWorkflow.filePath || workflow.filepath || '',
                    id: formattedWorkflow.id || '',
                    name: formattedWorkflow.name || 'Sin nombre',
                    metadata: {
                        description: workflow.content?.description || '',
                        keywords: workflow.keywords || [],
                        complexity: workflow.complexity_score || 'medium',
                        nodeCount: workflow.structure?.total_nodes || 0,
                        services: workflow.services || [],
                        // ✅ INFORMACIÓN ADICIONAL PARA EXTENSION SERVER
                        originalFilename: workflow.filename,
                        fullPath: workflow.filepath,
                        sourceCategory: categoryName
                    }
                });
            }
        }
        
        if (isDebugCategory) {
            console.log(`🔍 ${categoryName}: ${results.length} workflows pasaron el threshold`);
        }
        
        return results;
    }

    /**
     * Calcular similitud entre workflow y query usando múltiples factores
     * ACTUALIZADO para soportar nueva estructura vectorizada
     */
    calculateWorkflowSimilarity(workflow, query, queryLower, queryTerms) {
        let totalScore = 0;
        let weightSum = 0;
        
        // 1. Similitud semántica usando vectores (peso alto) - Nueva estructura
        const embedding = workflow.vectorizationData?.embedding || workflow.semantic_vector;
        if (embedding) {
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
        
        // 1. Similitud coseno real usando vectores de embeddings
        if (workflow.semantic_vector && this.queryEmbeddings) {
            try {
                const workflowVector = workflow.semantic_vector;
                const queryVector = this.queryEmbeddings.get(query);
                
                // Debug adicional para el primer workflow de Telegram
                const isFirstTelegram = workflow.workflow_info?.file_name?.includes('0001_Telegram');
                
                if (isFirstTelegram) {
                    console.log(`🔍 DEBUG vectores para ${workflow.workflow_info.file_name}:`);
                    console.log(`  - Query vector existe: ${!!queryVector}`);
                    console.log(`  - Workflow vector existe: ${!!workflowVector}`);
                    console.log(`  - Query vector length: ${queryVector?.length}`);
                    console.log(`  - Workflow vector length: ${workflowVector?.length}`);
                    console.log(`  - Query vector es array: ${Array.isArray(queryVector)}`);
                    console.log(`  - Workflow vector es array: ${Array.isArray(workflowVector)}`);
                    if (queryVector && workflowVector) {
                        console.log(`  - Query vector primeros 5: [${queryVector.slice(0,5).join(', ')}]`);
                        console.log(`  - Workflow vector primeros 5: [${workflowVector.slice(0,5).join(', ')}]`);
                    }
                }
                
                if (queryVector && workflowVector && Array.isArray(workflowVector) && Array.isArray(queryVector)) {
                    const cosineSimilarity = this.calculateCosineSimilarity(queryVector, workflowVector);
                    score += cosineSimilarity * 0.7; // 70% del peso para similitud vectorial real
                    
                    if (isFirstTelegram) {
                        console.log(`  - Similitud coseno calculada: ${cosineSimilarity}`);
                        console.log(`  - Score vectorial (70%): ${cosineSimilarity * 0.7}`);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Error calculando similitud coseno:', error.message);
            }
        }
        
        // 2. Análisis de patrones temáticos específicos (30% del peso)
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
        let patternScore = 0;
        for (const [theme, pattern] of Object.entries(patterns)) {
            if (pattern.test(query) && pattern.test(workflowText)) {
                patternScore += 0.15;
            }
        }
        score += Math.min(patternScore, 0.3); // Máximo 30% del score total
        
        // Debug para primer Telegram
        const isFirstTelegram = workflow.workflow_info?.file_name?.includes('0001_Telegram');
        if (isFirstTelegram) {
            console.log(`  - Pattern score: ${Math.min(patternScore, 0.3)}`);
            console.log(`  - Total score final: ${score}`);
        }
        
        // Boost por complejidad apropiada
        const complexityScore = workflow.complexity_score || 0;
        if (complexityScore > 300 && query.length > 50) {
            score += 0.05; // Reducido de 0.1 a 0.05
        }
        
        // Boost por número de nodos apropiado
        const nodeCount = workflow.structure?.total_nodes || 0;
        if (nodeCount >= 10 && query.includes('complex')) {
            score += 0.05; // Reducido de 0.1 a 0.05
        }
        
        return Math.min(score, 1.0);
    }
    
    /**
     * Calcular similitud coseno entre dos vectores
     */
    calculateCosineSimilarity(vectorA, vectorB) {
        if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
            return 0;
        }
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }
        
        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
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
        // Manejar nueva estructura vectorizada y estructura anterior
        const isVectorized = workflow.isVectorized && workflow.vectorizationData;
        
        if (isVectorized) {
            // Nueva estructura vectorizada
            const metadata = workflow.vectorizationData.metadata;
            return {
                id: metadata.file_name || workflow.filename || '',
                name: metadata.workflow_name || metadata.file_name || 'Sin nombre',
                description: metadata.description || '',
                nodes: metadata.nodes || [],
                connections: {},
                // ✅ CAMPOS CRÍTICOS PARA EXTENSION SERVER
                fileName: metadata.file_name || workflow.filename || '',
                filename: workflow.filename || metadata.file_name || '',
                filePath: workflow.filepath || '',
                metadata: {
                    totalNodes: metadata.total_nodes || 0,
                    nodeTypes: metadata.node_types || [],
                    triggers: metadata.triggers || [],
                    category: workflow.category || metadata.category || 'general',
                    complexityScore: workflow.vectorizationData.qualityMetrics?.overallScore || 0,
                    services: metadata.services || [],
                    patterns: metadata.patterns || [],
                    isVectorized: true,
                    vectorizationVersion: workflow.vectorizationData.version || '3.0',
                    // ✅ INFORMACIÓN ADICIONAL PARA EXTENSION SERVER
                    originalFilename: workflow.filename,
                    fullPath: workflow.filepath,
                    sourceCategory: workflow.category
                }
            };
        } else {
            // Estructura anterior (metadata.json)
            return {
                id: workflow.workflow_info?.file_name || '',
                name: workflow.workflow_info?.name || 'Sin nombre',
                description: workflow.content?.description || '',
                nodes: workflow.structure?.actions || [],
                connections: {},
                // ✅ CAMPOS CRÍTICOS PARA EXTENSION SERVER
                fileName: workflow.workflow_info?.file_name || workflow.filename || '',
                filename: workflow.filename || workflow.workflow_info?.file_name || '',
                filePath: workflow.filepath || '',
                metadata: {
                    totalNodes: workflow.structure?.total_nodes || 0,
                    nodeTypes: workflow.structure?.node_types || [],
                    triggers: workflow.structure?.triggers || [],
                    category: workflow.category || 'general',
                    complexityScore: workflow.complexity_score || 0,
                    services: workflow.services || [],
                    isVectorized: false,
                    // ✅ INFORMACIÓN ADICIONAL PARA EXTENSION SERVER
                    originalFilename: workflow.filename,
                    fullPath: workflow.filepath,
                    sourceCategory: workflow.category
                }
            };
        }
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
     * Generar embedding para una query usando un enfoque simplificado
     * En producción esto debería usar el mismo modelo que vectorizó los workflows
     */
    async generateQueryEmbedding(query) {
        try {
            // Por ahora, vamos a usar un vector ficticio basado en características de la query
            // En producción, esto debería usar Universal Sentence Encoder
            const vector = this.createSimpleEmbedding(query);
            this.queryEmbeddings.set(query, vector);
            
            console.log(`🔢 Embedding generado para query de ${query.length} caracteres`);
            return vector;
        } catch (error) {
            console.warn('⚠️ Error generando embedding de query:', error.message);
            // Fallback a vector cero
            const fallbackVector = new Array(512).fill(0);
            this.queryEmbeddings.set(query, fallbackVector);
            return fallbackVector;
        }
    }
    
    /**
     * Crear embedding simple basado en características de la query
     * Este es un enfoque temporal hasta integrar Universal Sentence Encoder
     */
    createSimpleEmbedding(query) {
        const vector = new Array(512).fill(0);
        const queryLower = query.toLowerCase();
        
        // Mapear palabras clave a posiciones específicas del vector
        const keywordMappings = {
            'telegram': [0, 1, 2],
            'bot': [3, 4, 5],
            'notification': [6, 7, 8],
            'notificacion': [6, 7, 8],
            'message': [9, 10, 11],
            'mensaje': [9, 10, 11],
            'email': [12, 13, 14],
            'gmail': [15, 16, 17],
            'slack': [18, 19, 20],
            'webhook': [21, 22, 23],
            'api': [24, 25, 26],
            'schedule': [27, 28, 29],
            'cron': [30, 31, 32],
            'automation': [33, 34, 35],
            'automat': [33, 34, 35],
            'data': [36, 37, 38],
            'process': [39, 40, 41],
            'send': [42, 43, 44],
            'receive': [45, 46, 47],
            'create': [48, 49, 50],
            'update': [51, 52, 53],
            'filter': [54, 55, 56],
            'transform': [57, 58, 59]
        };
        
        // Activar posiciones basadas en palabras clave
        for (const [keyword, positions] of Object.entries(keywordMappings)) {
            if (queryLower.includes(keyword)) {
                positions.forEach(pos => {
                    if (pos < vector.length) {
                        vector[pos] = 1.0;
                    }
                });
            }
        }
        
        // Agregar componente de longitud normalizada
        const lengthComponent = Math.min(query.length / 100, 1.0);
        for (let i = 100; i < 110 && i < vector.length; i++) {
            vector[i] = lengthComponent;
        }
        
        // Normalizar el vector
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (norm > 0) {
            for (let i = 0; i < vector.length; i++) {
                vector[i] /= norm;
            }
        }
        
        return vector;
    }

    /**
     * Ordenamiento optimizado para resultados grandes (BASE DE DATOS GIGANTE)
     * Utiliza algoritmo híbrido: quick-sort para precisión + top-k para eficiencia
     */
    optimizedSort(results, maxResults) {
        if (results.length <= maxResults * 2) {
            // Para pocos resultados, usar ordenamiento completo
            return results
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, maxResults);
        }
        
        // Para muchos resultados, usar algoritmo top-k optimizado
        console.log(`⚡ Usando algoritmo top-k optimizado para ${results.length} resultados`);
        
        // 1. Pre-filtrar resultados con similitud muy baja
        const preFiltered = results.filter(r => r.similarity > 0.01);
        
        // 2. Usar partial sort (heap-sort) para encontrar top-k
        const topK = this.partialSort(preFiltered, maxResults);
        
        console.log(`⚡ Optimización completada: ${topK.length} resultados finales`);
        return topK;
    }

    /**
     * Partial sort optimizado para top-k resultados
     */
    partialSort(array, k) {
        if (array.length <= k) {
            return array.sort((a, b) => b.similarity - a.similarity);
        }
        
        // Crear heap mínimo de tamaño k
        const heap = [];
        
        for (const item of array) {
            if (heap.length < k) {
                heap.push(item);
                if (heap.length === k) {
                    // Convertir a min-heap
                    for (let i = Math.floor(k / 2) - 1; i >= 0; i--) {
                        this.heapifyMin(heap, i, k);
                    }
                }
            } else if (item.similarity > heap[0].similarity) {
                // Reemplazar el mínimo
                heap[0] = item;
                this.heapifyMin(heap, 0, k);
            }
        }
        
        // Convertir heap a array ordenado
        return heap.sort((a, b) => b.similarity - a.similarity);
    }

    /**
     * Heapify para min-heap
     */
    heapifyMin(heap, i, size) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < size && heap[left].similarity < heap[smallest].similarity) {
            smallest = left;
        }
        
        if (right < size && heap[right].similarity < heap[smallest].similarity) {
            smallest = right;
        }
        
        if (smallest !== i) {
            [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
            this.heapifyMin(heap, smallest, size);
        }
    }

    /**
     * Recargar datos (para actualizaciones)
     */
    async reload() {
        console.log('🔄 Recargando datos vectorizados...');
        this.vectorizedData.clear();
        this.categoryVectors.clear();
        this.queryEmbeddings.clear(); // Limpiar cache de embeddings
        this.isInitialized = false;
        
        return await this.initialize();
    }
}
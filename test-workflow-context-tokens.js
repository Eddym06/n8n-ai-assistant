/**
 * ANÁLISIS DE CONTEXTO Y TOKENS DE WORKFLOWS
 * =========================================
 * Usa un prompt empresarial simplificado para buscar workflows y luego
 * analiza el contenido total de tokens que se proporcionaría como contexto
 * al Extension Server Oficial.
 */

import WorkflowVectorSearchEngine from './SISTEMA PRINCIPAL/workflow-vector-search-engine-esm.js';
import fs from 'fs';
import path from 'path';

class WorkflowContextAnalyzer {
    constructor() {
        this.searchAgent = null;
        
        // Prompt empresarial complejo y detallado
        this.complexPrompt = `
        Necesito diseñar e implementar un ecosistema de automatización empresarial Fortune 500 
        que integre múltiples plataformas, procese grandes volúmenes de datos en tiempo real, 
        y proporcione inteligencia artificial avanzada para la toma de decisiones estratégicas.

        1. PLATAFORMA DE CAPTACIÓN OMNICANAL AVANZADA:
        - Sistema de landing pages dinámicas con A/B testing automatizado
        - Integración completa con Facebook Ads, Google Ads, LinkedIn Ads, Twitter Ads
        - Chatbots conversacionales con procesamiento de lenguaje natural multiidioma
        - Sistemas de captura por voz mediante transcripción automática
        - Integración con plataformas de eventos: Eventbrite, Zoom, Teams, GoToWebinar
        - Sistema de referidos con gamificación y recompensas automatizadas
        - Web scraping inteligente para prospecting B2B
        - Integración con bases de datos empresariales: ZoomInfo, Apollo, Clearbit
        - Sistema de scoring de leads en tiempo real con machine learning
        - Captura desde códigos QR dinámicos con tracking geolocalizado

        2. MOTOR DE PROCESAMIENTO DE DATOS E INTELIGENCIA ARTIFICIAL:
        - Validación de datos en tiempo real con múltiples fuentes externas
        - Enriquecimiento automático con APIs de LinkedIn, Crunchbase, PitchBook
        - Análisis de sentimientos avanzado con modelos GPT personalizados
        - Clasificación automática con taxonomías dinámicas y auto-aprendizaje
        - Detección de patrones de comportamiento con algoritmos predictivos
        - Sistema de duplicados con fuzzy matching y probabilidad bayesiana
        - Procesamiento de imágenes para extracción de datos de documentos
        - Análisis de audio para transcripción y extracción de insights
        - Motor de recomendaciones personalizadas basado en comportamiento
        - Sistema de detección de anomalías y fraude en tiempo real

        3. PLATAFORMA CRM UNIFICADA Y PIPELINE INTELIGENTE:
        - Sincronización bidireccional con Salesforce, HubSpot, Pipedrive, Zoho
        - Gestión de oportunidades con forecasting predictivo automatizado
        - Sistema de tareas inteligentes con priorización automática por IA
        - Calendar booking avanzado con optimización de horarios por machine learning
        - Secuencias de nurturing personalizadas con contenido dinámico
        - Gestión de contratos digitales con firma electrónica integrada
        - Facturación automática con integración a SAP, QuickBooks, NetSuite
        - Sistema de cotizaciones dinámicas con pricing intelligence
        - Gestión de territory y asignación automática de leads
        - Dashboard ejecutivo con KPIs en tiempo real y alertas proactivas

        4. ECOSISTEMA DE COMUNICACIÓN MULTI-PLATAFORMA:
        - Email marketing personalizado con contenido generado por IA
        - SMS marketing con integración a Twilio, SendGrid, Mailchimp
        - Notificaciones push cross-platform con segmentación avanzada
        - Automatización de posts en redes sociales con optimización de horarios
        - Sistema de mensajería interna integrado con Slack, Teams, Discord
        - Llamadas automatizadas con sistemas de voz sintética personalizada
        - Video mensajes automatizados con deepfake ético para personalización
        - Sistema de encuestas inteligentes con análisis de respuestas por IA
        - Chatbots de soporte 24/7 con escalamiento automático a humanos
        - Sistema de tickets con priorización automática y routing inteligente

        5. CENTRO DE INTELIGENCIA DE NEGOCIOS Y ANALYTICS:
        - Dashboards en tiempo real con visualizaciones interactivas avanzadas
        - Reportes automatizados con insights generados por IA
        - Análisis predictivo de churn, lifetime value y probabilidad de compra
        - Visualizaciones con realidad aumentada para presentaciones ejecutivas
        - Sistema de alertas inteligentes con machine learning para detección de tendencias
        - Forecasting avanzado con modelos econométricos y series temporales
        - Análisis de cohortes y segmentación dinámica de clientes
        - Attribution modeling multi-touch para campañas de marketing
        - Análisis de competencia automatizado con web scraping inteligente
        - ROI tracking en tiempo real con atribución automatizada

        6. PLATAFORMA E-COMMERCE Y RETAIL AUTOMATION:
        - Sincronización con Shopify, WooCommerce, Magento, BigCommerce
        - Gestión de inventario predictiva con restock automatizado
        - Procesamiento de pagos con Stripe, PayPal, Square integrados
        - Programa de lealtad con gamificación y recompensas personalizadas
        - Sistema de reviews automatizado con análisis de sentimientos
        - Optimización dinámica de precios basada en competencia y demanda
        - Recomendaciones de productos con collaborative filtering
        - Gestión de devoluciones automatizada con ML para detección de patrones
        - Sistema de cross-selling y upselling inteligente
        - Integración con marketplaces: Amazon, eBay, Mercado Libre

        7. AUTOMATIZACIÓN DE PROCESOS EMPRESARIALES (BPM):
        - Onboarding de empleados con workflows personalizados por rol
        - Sistema de tickets de soporte con routing inteligente y SLA automático
        - Automatización de RRHH: reclutamiento, evaluaciones, reportes
        - Gestión documental con OCR y clasificación automática por IA
        - Backup y disaster recovery automatizado con testing periódico
        - Monitoreo de sistemas con alertas predictivas y auto-healing
        - Gestión de compliance automatizada con reporting regulatorio
        - Sistema de aprobaciones con workflows dinámicos por monto/tipo
        - Automatización de procurement con cotizaciones automatizadas
        - Gestión de assets con tracking RFID/IoT integrado

        8. PLATAFORMA DE INTELIGENCIA ARTIFICIAL EMPRESARIAL:
        - Chatbots empresariales con contexto completo de cliente
        - Análisis de documentos con extracción de datos estructurados
        - Procesamiento de lenguaje natural para análisis de contratos
        - Sistema de recomendaciones personalizadas cross-vertical
        - Detección de fraude multi-capa con scoring en tiempo real
        - Generación automática de contenido optimizado para SEO
        - Análisis predictivo de mercado con datos externos integrados
        - Sistema de traducción automática para comunicaciones globales
        - Reconocimiento de voz para transcripción de reuniones ejecutivas
        - Computer vision para análisis de comportamiento en retail

        9. INFRAESTRUCTURA Y SEGURIDAD EMPRESARIAL:
        - Arquitectura cloud-native con auto-scaling y load balancing
        - Seguridad zero-trust con autenticación multi-factor obligatoria
        - Encriptación end-to-end para todas las comunicaciones
        - Auditoría completa con logging inmutable y compliance GDPR/CCPA
        - API management con rate limiting y monitoring avanzado
        - Disaster recovery con RTO < 15 minutos y RPO < 5 minutos
        - Monitoreo 24/7 con alertas predictivas y respuesta automatizada
        - Integración con sistemas legacy mediante conectores personalizados
        - Data lake empresarial con data governance automatizado
        - Edge computing para procesamiento local de datos sensibles

        10. INTEGRACIÓN Y ORCHESTRATION:
        - API-first architecture con GraphQL y REST endpoints
        - Event-driven architecture con message queues distribuidas
        - Microservicios con containerización y orchestration automático
        - CI/CD pipelines con testing automatizado y deployment progresivo
        - Observability completa con métricas, logs y traces distribuidos
        - Service mesh para comunicación segura entre microservicios
        - Data synchronization en tiempo real entre todas las plataformas
        - Workflow orchestration con Apache Airflow para procesos complejos
        - Integration testing automatizado para todas las conexiones
        - Performance monitoring con optimización automática de recursos

        Este ecosistema debe manejar más de 10 millones de interacciones diarias,
        procesar petabytes de datos, mantener 99.99% de uptime, cumplir con 
        regulaciones internacionales (GDPR, CCPA, SOX, HIPAA), y escalar 
        automáticamente según demanda con arquitectura cloud-native distribuida.
        `;
    }

    async initialize() {
        console.log('🚀 INICIANDO ANÁLISIS DE CONTEXTO Y TOKENS');
        console.log('='.repeat(60));
        console.log('📊 Analizando workflows encontrados y conteo de tokens...\n');
        
        const vectorDbPath = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\Workflows Vectorizados Oficial';
        
        if (!fs.existsSync(vectorDbPath)) {
            throw new Error(`❌ Base de datos no encontrada: ${vectorDbPath}`);
        }

        console.log('📊 Inicializando agente de búsqueda...');
        this.searchAgent = new WorkflowVectorSearchEngine(vectorDbPath);
        await this.searchAgent.initialize();
        
        const stats = this.searchAgent.getStats();
        console.log(`✅ Agente listo: ${stats.totalWorkflows} workflows disponibles\n`);
    }

    // Función simple para contar tokens (aproximación)
    countTokens(text) {
        if (!text) return 0;
        
        // Aproximación: 1 token ≈ 4 caracteres para texto en inglés/español
        // Ajustamos para código JSON que es más denso
        const chars = text.length;
        const wordsApprox = text.split(/\s+/).length;
        
        // Para JSON/código: aproximadamente 1 token cada 3.5 caracteres
        // Para texto natural: aproximadamente 1 token cada 4 caracteres
        const isCode = text.includes('{') && text.includes('"') && text.includes(':');
        const tokenRatio = isCode ? 3.5 : 4;
        
        return Math.ceil(chars / tokenRatio);
    }

    // Encuentra el archivo del workflow real usando pattern matching
    findWorkflowFile(result, vectorDbPath) {
        if (!result.category) return null;
        
        const categoryPath = path.join(vectorDbPath, result.category);
        if (!fs.existsSync(categoryPath)) return null;
        
        try {
            // Leer todos los archivos .json (no metadata) de la categoría
            const files = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.json') && !file.includes('.metadata.json'));
            
            // Si hay archivos, tomar el primero (o podrías usar algún criterio de scoring)
            if (files.length > 0) {
                return path.join(categoryPath, files[0]);
            }
            
            return null;
        } catch (err) {
            console.warn(`Error leyendo directorio ${categoryPath}: ${err.message}`);
            return null;
        }
    }

    // Analiza el contenido de un workflow
    analyzeWorkflowContent(workflowPath) {
        try {
            const content = fs.readFileSync(workflowPath, 'utf-8');
            const workflow = JSON.parse(content);
            
            const analysis = {
                path: workflowPath,
                fileName: path.basename(workflowPath),
                rawContent: content,
                contentLength: content.length,
                tokens: this.countTokens(content),
                nodes: workflow.nodes ? workflow.nodes.length : 0,
                connections: workflow.connections ? Object.keys(workflow.connections).length : 0,
                hasMetadata: !!workflow.meta,
                complexity: this.calculateComplexity(workflow),
                categories: this.extractCategories(workflowPath)
            };

            return analysis;
        } catch (error) {
            console.warn(`⚠️ Error analizando ${workflowPath}: ${error.message}`);
            return null;
        }
    }

    calculateComplexity(workflow) {
        let complexity = 0;
        
        if (workflow.nodes) {
            complexity += workflow.nodes.length * 2;
        }
        
        if (workflow.connections) {
            complexity += Object.keys(workflow.connections).length;
        }
        
        // Penalizar por tipos de nodos complejos
        const complexNodes = ['n8n-nodes-base.code', 'n8n-nodes-base.function', 'n8n-nodes-base.httpRequest'];
        if (workflow.nodes) {
            workflow.nodes.forEach(node => {
                if (complexNodes.includes(node.type)) {
                    complexity += 5;
                }
            });
        }
        
        return complexity;
    }

    extractCategories(filePath) {
        const fileName = path.basename(filePath);
        const categories = [];
        
        // Extraer categorías del nombre del archivo
        const commonCategories = [
            'Telegram', 'Email', 'Slack', 'Discord', 'Google', 'Microsoft', 
            'Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'HubSpot', 'Salesforce',
            'Code', 'HTTP', 'Webhook', 'Schedule', 'Wait', 'Filter', 'Set'
        ];
        
        commonCategories.forEach(category => {
            if (fileName.toLowerCase().includes(category.toLowerCase())) {
                categories.push(category);
            }
        });
        
        return categories;
    }

    async runContextAnalysis() {
        console.log('🎯 EJECUTANDO ANÁLISIS DE CONTEXTO CON PROMPT EMPRESARIAL COMPLEJO');
        console.log('='.repeat(80));
        console.log(`📏 Tamaño del prompt: ${this.complexPrompt.length} caracteres`);
        console.log(`🔤 Tokens del prompt: ~${this.countTokens(this.complexPrompt)}`);
        console.log(`📄 Componentes del sistema: 10 módulos principales + infraestructura\n`);

        const startTime = performance.now();

        try {
            // 1. Buscar workflows con el prompt simplificado
            console.log('🔍 PASO 1: BÚSQUEDA DE WORKFLOWS RELEVANTES');
            console.log('📁 Ejecutando búsqueda vectorizada...');
            
            const searchStartTime = performance.now();
            const searchResults = await this.searchAgent.searchSimilarWorkflows(
                this.complexPrompt, 
                { maxResults: 25 }
            );
            const searchEndTime = performance.now();
            const searchTime = searchEndTime - searchStartTime;

            console.log(`⚡ BÚSQUEDA COMPLETADA: ${searchResults.length} workflows encontrados`);
            console.log(`⏱️  Tiempo de búsqueda: ${searchTime.toFixed(2)}ms\n`);

            // 2. Analizar el contenido de cada workflow encontrado
            console.log('📊 PASO 2: ANÁLISIS DETALLADO DE WORKFLOWS');
            console.log('🔍 Analizando contenido y contando tokens...\n');

            const workflowAnalyses = [];
            const vectorDbPath = 'C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\Workflows Vectorizados Oficial';
            
            console.log('\n🔍 ANÁLISIS DE IDENTIFICADORES DE WORKFLOWS ENCONTRADOS:');
            console.log('='.repeat(80));
            
            for (let i = 0; i < searchResults.length; i++) {
                const result = searchResults[i];
                console.log(`\n📄 WORKFLOW ${i + 1}/${searchResults.length}: ${result.category || 'Unknown'}`);
                
                // Mostrar toda la información de identificación disponible
                console.log(`   🏷️  IDENTIFICADORES PROPORCIONADOS POR EL AGENTE:`);
                console.log(`      📋 category: "${result.category || 'N/A'}"`);
                console.log(`      📁 fileName: "${result.fileName || 'N/A'}"`);
                console.log(`      🆔 id: "${result.id || 'N/A'}"`);
                console.log(`      📝 name: "${result.name || 'N/A'}"`);
                console.log(`      🎯 score: ${(result.similarity || result.score || result.finalScore || 0).toFixed(3)}`);
                
                // Mostrar información adicional si está disponible
                if (result.workflow_info) {
                    console.log(`      📊 workflow_info disponible: ${Object.keys(result.workflow_info).join(', ')}`);
                }
                if (result.metadata) {
                    console.log(`      📋 metadata disponible: ${Object.keys(result.metadata).join(', ')}`);
                }
                
                // Buscar el archivo del workflow usando la nueva función
                const workflowPath = this.findWorkflowFile(result, vectorDbPath);
                
                if (workflowPath) {
                    console.log(`      ✅ ARCHIVO ENCONTRADO: ${path.basename(workflowPath)}`);
                    console.log(`      📂 Ruta completa: ${workflowPath}`);
                    
                    const analysis = this.analyzeWorkflowContent(workflowPath);
                    if (analysis) {
                        analysis.searchScore = result.similarity || result.score || result.finalScore || 0;
                        analysis.searchRank = i + 1;
                        analysis.agentProvidedInfo = {
                            category: result.category,
                            fileName: result.fileName,
                            id: result.id,
                            name: result.name,
                            hasWorkflowInfo: !!result.workflow_info,
                            hasMetadata: !!result.metadata
                        };
                        workflowAnalyses.push(analysis);
                        console.log(`      📊 ${analysis.tokens} tokens, ${analysis.nodes} nodos`);
                        
                        // Verificar si el nombre del archivo coincide con la información proporcionada
                        const actualFileName = path.basename(workflowPath);
                        const providedFileName = result.fileName;
                        if (providedFileName && actualFileName !== providedFileName) {
                            console.log(`      ⚠️  DISCREPANCIA: Archivo real "${actualFileName}" ≠ Proporcionado "${providedFileName}"`);
                        } else if (providedFileName && actualFileName === providedFileName) {
                            console.log(`      ✅ COINCIDENCIA: Nombre de archivo correcto`);
                        } else {
                            console.log(`      ❓ INFO: No se proporcionó fileName específico`);
                        }
                    } else {
                        console.log(`      ❌ Error al analizar el contenido del archivo`);
                    }
                } else {
                    console.log(`      ❌ NO SE ENCONTRÓ EL ARCHIVO`);
                    console.log(`      🔍 Información de búsqueda insuficiente o incorrecta`);
                }
            }

            // 3. Calcular estadísticas totales
            console.log('\n📊 PASO 3: CÁLCULO DE ESTADÍSTICAS TOTALES');
            const totalStats = this.calculateTotalStats(workflowAnalyses);
            
            // 4. Mostrar resultados
            this.displayResults(totalStats, workflowAnalyses, searchTime);

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            return {
                promptTokens: this.countTokens(this.complexPrompt),
                workflowsFound: searchResults.length,
                workflowsAnalyzed: workflowAnalyses.length,
                workflowTokensOnly: totalStats.totalTokens,
                totalTokensWithPrompt: this.countTokens(this.complexPrompt) + totalStats.totalTokens,
                totalStats,
                searchTime,
                totalTime,
                success: true
            };

        } catch (error) {
            const endTime = performance.now();
            const totalTime = endTime - startTime;

            console.log(`\n❌ ERROR EN ANÁLISIS: ${error.message}`);
            console.log(`⏱️  Tiempo hasta el error: ${totalTime.toFixed(2)}ms`);

            return {
                error: error.message,
                totalTime,
                success: false
            };
        }
    }

    calculateTotalStats(analyses) {
        if (analyses.length === 0) return null;

        const totalTokens = analyses.reduce((sum, a) => sum + a.tokens, 0);
        const totalChars = analyses.reduce((sum, a) => sum + a.contentLength, 0);
        const totalNodes = analyses.reduce((sum, a) => sum + a.nodes, 0);
        const totalConnections = analyses.reduce((sum, a) => sum + a.connections, 0);
        const avgComplexity = analyses.reduce((sum, a) => sum + a.complexity, 0) / analyses.length;
        
        const tokenStats = analyses.map(a => a.tokens).sort((a, b) => b - a);
        const complexityStats = analyses.map(a => a.complexity).sort((a, b) => b - a);

        return {
            count: analyses.length,
            totalTokens,
            totalChars,
            totalNodes,
            totalConnections,
            avgTokensPerWorkflow: Math.round(totalTokens / analyses.length),
            avgComplexity: Math.round(avgComplexity),
            maxTokens: tokenStats[0],
            minTokens: tokenStats[tokenStats.length - 1],
            medianTokens: tokenStats[Math.floor(tokenStats.length / 2)],
            maxComplexity: complexityStats[0],
            minComplexity: complexityStats[complexityStats.length - 1]
        };
    }

    displayResults(totalStats, analyses, searchTime) {
        console.log('\n' + '🏆 RESULTADOS DEL ANÁLISIS DE CONTEXTO'.padStart(45, '=').padEnd(80, '='));
        
        if (!totalStats) {
            console.log('⚠️ No se pudieron analizar workflows');
            return;
        }

        console.log('\n📊 ESTADÍSTICAS GENERALES:');
        console.log(`   📄 Workflows analizados: ${totalStats.count}`);
        console.log(`   🎯 Tokens totales de contexto: ${totalStats.totalTokens.toLocaleString()}`);
        console.log(`   📏 Caracteres totales: ${totalStats.totalChars.toLocaleString()}`);
        console.log(`   🔧 Nodos totales: ${totalStats.totalNodes}`);
        console.log(`   🔗 Conexiones totales: ${totalStats.totalConnections}`);

        console.log('\n📈 ESTADÍSTICAS POR WORKFLOW:');
        console.log(`   📊 Tokens promedio: ${totalStats.avgTokensPerWorkflow}`);
        console.log(`   🔝 Máximo tokens: ${totalStats.maxTokens}`);
        console.log(`   🔻 Mínimo tokens: ${totalStats.minTokens}`);
        console.log(`   📊 Mediana tokens: ${totalStats.medianTokens}`);
        console.log(`   🎯 Complejidad promedio: ${totalStats.avgComplexity}`);

        console.log('\n🏆 TOP 5 WORKFLOWS POR TOKENS:');
        analyses
            .sort((a, b) => b.tokens - a.tokens)
            .slice(0, 5)
            .forEach((analysis, index) => {
                console.log(`   ${index + 1}. ${analysis.fileName}`);
                console.log(`      🎯 ${analysis.tokens} tokens | ${analysis.nodes} nodos | Score: ${analysis.searchScore.toFixed(3)}`);
                console.log(`      📁 Categorías: ${analysis.categories.join(', ') || 'N/A'}`);
                console.log(`      🏷️  Info del agente: ${JSON.stringify(analysis.agentProvidedInfo)}`);
            });

        console.log('\n🔍 VERIFICACIÓN DE IDENTIFICADORES DEL AGENTE:');
        console.log('='.repeat(60));
        
        let correctIdentifications = 0;
        let totalWithFileNames = 0;
        let missingIdentifiers = 0;
        
        analyses.forEach((analysis, index) => {
            const info = analysis.agentProvidedInfo;
            const actualFileName = analysis.fileName;
            
            console.log(`\n${index + 1}. ${actualFileName}`);
            console.log(`   📋 Categoría: ${info.category || '❌ FALTANTE'}`);
            console.log(`   📁 FileName: ${info.fileName || '❌ FALTANTE'}`);
            console.log(`   🆔 ID: ${info.id || '❌ FALTANTE'}`);
            console.log(`   📝 Name: ${info.name || '❌ FALTANTE'}`);
            
            // Contar estadísticas
            if (info.fileName) {
                totalWithFileNames++;
                if (info.fileName === actualFileName) {
                    correctIdentifications++;
                    console.log(`   ✅ IDENTIFICACIÓN CORRECTA`);
                } else {
                    console.log(`   ⚠️  IDENTIFICACIÓN INCORRECTA`);
                }
            } else {
                missingIdentifiers++;
                console.log(`   ❌ FALTA IDENTIFICADOR fileName`);
            }
        });
        
        console.log('\n📊 ESTADÍSTICAS DE IDENTIFICACIÓN:');
        console.log(`   📄 Total workflows analizados: ${analyses.length}`);
        console.log(`   ✅ Con fileName proporcionado: ${totalWithFileNames}`);
        console.log(`   🎯 Identificaciones correctas: ${correctIdentifications}`);
        console.log(`   ❌ Identificadores faltantes: ${missingIdentifiers}`);
        console.log(`   📊 Precisión de identificación: ${totalWithFileNames > 0 ? ((correctIdentifications / totalWithFileNames) * 100).toFixed(1) : 0}%`);
        console.log(`   🔧 Workflows utilizables por Extension Server: ${correctIdentifications}/${analyses.length}`);
        
        if (correctIdentifications < analyses.length) {
            console.log('\n⚠️  POSIBLES PROBLEMAS PARA EXTENSION SERVER OFICIAL:');
            console.log('   - Algunos workflows no tienen identificadores completos');
            console.log('   - El sistema podría no poder inyectar todos los workflows en el system prompt');
            console.log('   - Considerar mejorar la estructura de datos de búsqueda');
        } else {
            console.log('\n✅ EXCELENTE: Todos los workflows tienen identificación correcta');
        }

        console.log('\n💡 IMPACTO EN EL EXTENSION SERVER:');
        const promptTokens = this.countTokens(this.complexPrompt);
        const totalContextTokens = promptTokens + totalStats.totalTokens;
        
        console.log(`   📝 Tokens del prompt original: ${promptTokens.toLocaleString()}`);
        console.log(`   📚 Workflows encontrados por el agente: ${totalStats.count}`);
        console.log(`   🎯 Tokens SOLO de workflows (sin prompt): ${totalStats.totalTokens.toLocaleString()}`);
        console.log(`   📊 TOTAL enviado a la IA: ${totalContextTokens.toLocaleString()} tokens`);
        
        // Separar claramente la información
        console.log('\n🔢 DESGLOSE DETALLADO:');
        console.log(`   🔸 Prompt del usuario: ${promptTokens.toLocaleString()} tokens`);
        console.log(`   🔸 Contexto de ${totalStats.count} workflows: ${totalStats.totalTokens.toLocaleString()} tokens`);
        console.log(`   🔸 Ratio contexto/prompt: ${(totalStats.totalTokens / promptTokens).toFixed(2)}x`);
        
        // Estimación de costos (ejemplo con GPT-4)
        const costPer1MTokens = 30; // USD por 1M de tokens (ejemplo)
        const estimatedCost = (totalContextTokens / 1000000) * costPer1MTokens;
        console.log(`   💰 Costo estimado por consulta: $${estimatedCost.toFixed(6)} USD`);

        // Evaluación de eficiencia
        console.log('\n🎯 EVALUACIÓN DE EFICIENCIA:');
        if (totalStats.totalTokens > 100000) {
            console.log('   🔴 CONTEXTO MUY GRANDE - Considerar optimización');
        } else if (totalStats.totalTokens > 50000) {
            console.log('   🟡 CONTEXTO GRANDE - Monitorear rendimiento');
        } else if (totalStats.totalTokens > 20000) {
            console.log('   🟢 CONTEXTO ÓPTIMO - Excelente balance');
        } else {
            console.log('   🔵 CONTEXTO COMPACTO - Muy eficiente');
        }

        console.log(`   ⚡ Eficiencia de búsqueda: ${searchTime.toFixed(2)}ms para ${totalStats.count} workflows`);
        console.log(`   📊 Tokens por ms de búsqueda: ${Math.round(totalStats.totalTokens / searchTime)}`);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Ejecutar análisis
async function main() {
    try {
        const analyzer = new WorkflowContextAnalyzer();
        await analyzer.initialize();
        await analyzer.runContextAnalysis();
    } catch (error) {
        console.error('❌ Error en el análisis:', error.message);
        process.exit(1);
    }
}

main();
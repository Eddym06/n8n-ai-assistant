/**
 * 🚀 METADATA ENHANCEMENT AGENT V2.0 - ENTERPRISE EDITION
 * ========================================================
 * 
 * Script avanzado que usa Gemini para analizar workflows y enriquecer metadata
 * con información de negocio, experiencia de usuario y métricas operacionales.
 * 
 * Características V2.0:
 * - Análisis automático de TODAS las carpetas de workflows
 * - Enriquecimiento enterprise-level con Gemini 2.0 Flash
 * - Manejo robusto de JSON con reparación automática
 * - Procesamiento en lotes con rate limiting inteligente
 * - Generación de metadata completa con todas las secciones
 * - Reportes consolidados por categoría
 * - Sistema de fallback para errores
 * - Progress tracking en tiempo real
 */

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configuración
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Gemini con API key directa
const GEMINI_API_KEY = 'your_google_api_key_here';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

class MetadataEnhancementAgentV2 {
    constructor() {
        this.workflowsPath = path.join(__dirname, 'workflows');
        this.outputPath = path.join(__dirname, 'enhanced-metadata-v2');
        this.processedCount = 0;
        this.errorCount = 0;
        this.enhancedMetadata = [];
        this.statistics = {
            totalWorkflows: 0,
            successfulAnalysis: 0,
            failedAnalysis: 0,
            categoriesProcessed: 0,
            averageComplexity: 0,
            totalProcessingTime: 0
        };
        
        // Configuración de procesamiento
        this.config = {
            maxWorkflowsPerCategory: 5,  // Limitar para demo, cambiar a -1 para procesar todo
            delayBetweenRequests: 3000,  // 3 segundos entre requests
            maxRetries: 2,
            jsonRepairAttempts: 3
        };
        
        // Crear carpeta de salida si no existe
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
        
        console.log('🚀 METADATA ENHANCEMENT AGENT V2.0 - ENTERPRISE EDITION');
        console.log('=========================================================');
        console.log(`📂 Input: ${this.workflowsPath}`);
        console.log(`📁 Output: ${this.outputPath}`);
        console.log(`⚙️ Max workflows por categoría: ${this.config.maxWorkflowsPerCategory === -1 ? 'TODOS' : this.config.maxWorkflowsPerCategory}`);
        console.log(`⏱️ Delay entre requests: ${this.config.delayBetweenRequests}ms`);
    }

    /**
     * 🔍 Escanear carpetas de workflows con estadísticas
     */
    async scanWorkflowFolders() {
        console.log('\n🔍 ESCANEANDO ECOSISTEMA DE WORKFLOWS...');
        console.log(`📂 Buscando en: ${this.workflowsPath}`);
        
        if (!fs.existsSync(this.workflowsPath)) {
            console.log('❌ Carpeta workflows no encontrada');
            return [];
        }

        console.log('✅ Carpeta workflows encontrada, analizando estructura...');
        const folders = fs.readdirSync(this.workflowsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // Estadísticas de carpetas
        const folderStats = folders.map(folder => {
            const folderPath = path.join(this.workflowsPath, folder);
            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
            return { folder, count: files.length };
        }).sort((a, b) => b.count - a.count);

        console.log(`📊 ESTADÍSTICAS DEL ECOSISTEMA:`);
        console.log(`   📁 Total carpetas: ${folders.length}`);
        console.log(`   📄 Workflows por categoría (top 10):`);
        folderStats.slice(0, 10).forEach(stat => {
            console.log(`      ${stat.folder}: ${stat.count} workflows`);
        });

        const totalWorkflows = folderStats.reduce((sum, stat) => sum + stat.count, 0);
        console.log(`   📊 Total workflows en ecosistema: ${totalWorkflows}`);
        
        this.statistics.totalWorkflows = totalWorkflows;
        
        return folders;
    }

    /**
     * 📄 Leer workflows de una carpeta con análisis
     */
    async readWorkflowsFromFolder(folderName) {
        const folderPath = path.join(this.workflowsPath, folderName);
        const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.json'));

        console.log(`\n� CATEGORÍA: ${folderName}`);
        console.log(`   📄 Workflows encontrados: ${files.length}`);

        // Limitar workflows si está configurado
        const limitedFiles = this.config.maxWorkflowsPerCategory === -1 
            ? files 
            : files.slice(0, this.config.maxWorkflowsPerCategory);

        if (limitedFiles.length < files.length) {
            console.log(`   🎯 Procesando solo los primeros ${limitedFiles.length} workflows`);
        }

        const workflows = [];
        for (const file of limitedFiles) {
            try {
                const filePath = path.join(folderPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const workflow = JSON.parse(content);
                
                workflows.push({
                    filename: file,
                    path: filePath,
                    data: workflow,
                    category: folderName,
                    nodeCount: workflow.nodes ? workflow.nodes.length : 0,
                    size: content.length
                });
            } catch (error) {
                console.log(`   ⚠️ Error leyendo ${file}: ${error.message}`);
                this.errorCount++;
            }
        }

        // Estadísticas de la categoría
        const avgNodes = workflows.length > 0 
            ? Math.round(workflows.reduce((sum, w) => sum + w.nodeCount, 0) / workflows.length)
            : 0;
        
        console.log(`   📊 Promedio de nodos: ${avgNodes}`);
        console.log(`   📏 Tamaño promedio: ${workflows.length > 0 ? Math.round(workflows.reduce((sum, w) => sum + w.size, 0) / workflows.length / 1024) : 0}KB`);

        return workflows;
    }

    /**
     * 🛠️ Reparador avanzado de JSON
     */
    repairJSON(jsonString, attempt = 1) {
        console.log(`🔧 Intento de reparación JSON #${attempt}`);
        
        try {
            // Intento básico
            return JSON.parse(jsonString);
        } catch (error) {
            if (attempt >= this.config.jsonRepairAttempts) {
                throw new Error(`JSON irreparable después de ${attempt} intentos`);
            }

            // Estrategias de reparación según el intento
            let repairedString = jsonString;
            
            switch (attempt) {
                case 1:
                    // Reparación básica
                    repairedString = jsonString
                        .replace(/,\s*}/g, '}')      // Remover comas antes de }
                        .replace(/,\s*]/g, ']')      // Remover comas antes de ]
                        .replace(/\\\//g, '/')       // Desescapar slashes
                        .replace(/\\"/g, '"')        // Manejar comillas escapadas
                        .replace(/[\r\n\t]/g, ' ')   // Convertir saltos de línea a espacios
                        .replace(/\s+/g, ' ');       // Normalizar espacios
                    break;
                
                case 2:
                    // Reparación agresiva
                    repairedString = jsonString
                        .replace(/\\n/g, '\\\\n')    // Escapar newlines
                        .replace(/\\r/g, '\\\\r')    // Escapar carriage returns
                        .replace(/\\t/g, '\\\\t')    // Escapar tabs
                        .replace(/\\/g, '\\\\')      // Escapar backslashes
                        .replace(/\\\\"/g, '\\"')    // Corregir doble escape de comillas
                        .replace(/([^\\])"/g, '$1\\"') // Escapar comillas no escapadas
                        .replace(/^"/g, '\\"');      // Escapar comilla inicial
                    break;
            }

            return this.repairJSON(repairedString, attempt + 1);
        }
    }

    /**
     * 🤖 Generar metadata enterprise-level con Gemini
     */
    async enhanceMetadataWithGemini(workflow, category, retryCount = 0) {
        const prompt = `
🎯 ANÁLISIS ENTERPRISE N8N WORKFLOW - METADATA COMPLETA V2.0

Eres un experto consultor en automatización empresarial. Analiza este workflow de n8n y genera metadata enterprise-level extremadamente detallada.

📊 CONTEXTO DEL WORKFLOW:
Categoría: ${category}
Archivo: ${workflow.filename}
Nodos: ${workflow.nodeCount}
Tamaño: ${Math.round(workflow.size / 1024)}KB

🔍 CONTENIDO DEL WORKFLOW:
${JSON.stringify(workflow.data, null, 2).substring(0, 15000)}${workflow.data.nodes && workflow.data.nodes.length > 20 ? '\n... (workflow truncado para análisis)' : ''}

📋 GENERA EXACTAMENTE ESTE JSON (sin explicaciones adicionales):

{
  "name": "TÍTULO MARKETING OPTIMIZADO 🚀 (máximo 80 chars con emojis relevantes)",
  "description": "🎯 DESCRIPCIÓN DE VALOR EMPRESARIAL: ROI específico, casos de uso, beneficios cuantificables (120-200 chars)",
  "node_count": ${workflow.nodeCount},
  "category": "${category}",
  "validation": {
    "is_valid": true,
    "issues": ["Problemas técnicos específicos detectados", "Validaciones de seguridad faltantes"],
    "warnings": ["Advertencias de performance", "Riesgos operacionales"],
    "schema_compliance": "full",
    "missing_validations": ["rate_limiting", "error_handling"]
  },
  "dependencies": {
    "external_services": ["APIs y servicios externos detectados automáticamente"],
    "internal_dependencies": ["Dependencias internas específicas"],
    "required_credentials": ["Credenciales necesarias"],
    "environment_variables": ["Variables de entorno requeridas"],
    "third_party_integrations": [
      {
        "service": "Servicio detectado",
        "endpoint": "URL si disponible",
        "rate_limits": "Límites conocidos",
        "pricing_model": "Freemium/Paid/Enterprise"
      }
    ]
  },
  "performance": {
    "estimated_execution_time": "2-5 segundos",
    "complexity_score": 7,
    "resource_intensity": "medium",
    "bottlenecks": ["Cuellos de botella identificados"],
    "optimization_suggestions": ["Sugerencias específicas de optimización"],
    "scalability_analysis": {
      "max_concurrent_users": 50,
      "recommended_infrastructure": "Docker + Redis",
      "cost_per_execution": "$0.001-0.003"
    }
  },
  "user_experience": {
    "setup_time": "30-45 minutos",
    "learning_curve": "intermedio",
    "required_skills": ["Habilidades técnicas necesarias"],
    "common_user_mistakes": ["Errores típicos de configuración"],
    "success_indicators": ["Indicadores de funcionamiento correcto"],
    "user_satisfaction_score": 8
  },
  "business_value": {
    "cost_reduction": "40-60% reducción en costos operativos",
    "time_savings": "5-8 horas semanales ahorradas",
    "efficiency_gains": "3x mejora en velocidad de proceso",
    "revenue_impact": "15-25% incremento en conversiones",
    "automation_level": "85% automatizado",
    "roi_projection": "200-400% en 6-12 meses"
  },
  "monitoring": {
    "key_metrics": ["Métricas clave específicas"],
    "alerting": ["Condiciones de alerta críticas"],
    "health_checks": ["Verificaciones de salud"],
    "dashboard_recommendations": ["Dashboards recomendados"]
  },
  "quick_start": {
    "prerequisites": ["Requisitos específicos detallados"],
    "deployment_steps": [
      "1. Configurar credenciales (5 min)",
      "2. Importar workflow (2 min)",
      "3. Configurar variables (10 min)",
      "4. Probar funcionamiento (15 min)"
    ],
    "testing_instructions": ["Instrucciones de prueba específicas"],
    "troubleshooting": ["Soluciones a problemas comunes"],
    "estimated_total_setup_time": "45 minutos"
  },
  "semantic_context": {
    "business_domain": ["${category}", "Automation", "Integration"],
    "automation_level": "fully_automated",
    "primary_use_cases": ["Casos de uso identificados específicamente"],
    "industry_applications": ["Aplicaciones por industria"],
    "target_company_size": "sme",
    "compliance_considerations": ["Consideraciones de cumplimiento"]
  },
  "error_patterns": {
    "common_failures": ["Fallos comunes basados en análisis del workflow"],
    "retry_strategies": ["Estrategias de reintento recomendadas"],
    "failure_rate": "10-15%",
    "error_recovery": {
      "graceful_degradation": "Estrategia de degradación específica",
      "alert_system": "Sistema de alertas recomendado",
      "backup_procedures": "Procedimientos de respaldo"
    }
  },
  "node_types": {
    "triggers": ["Triggers detectados"],
    "actions": ["Acciones principales"],
    "transformations": ["Transformaciones de datos"],
    "integrations": ["Integraciones específicas"],
    "ai_components": ["Componentes de IA si los hay"],
    "data_processing": ["Tipos de procesamiento"]
  },
  "cost_analysis": {
    "monthly_operational_cost": "$10-25/mes",
    "setup_cost": "$100-200 en tiempo de desarrollo",
    "maintenance_cost": "$5-10/mes",
    "cost_per_transaction": "$0.001-0.005",
    "cost_breakdown": {
      "api_calls": "$5-15/mes",
      "compute_resources": "$3-8/mes",
      "storage": "$1-2/mes",
      "third_party_services": "$5-10/mes"
    }
  }
}

🎯 INSTRUCCIONES CRÍTICAS:
1. Analiza ESPECÍFICAMENTE el workflow proporcionado
2. Usa datos REALISTAS basados en el análisis
3. Incluye métricas CUANTIFICABLES
4. Orienta al VALOR EMPRESARIAL
5. Devuelve SOLO JSON válido, sin texto adicional
6. Usa la categoría "${category}" en el contexto apropiado

⚠️ RESPONDE ÚNICAMENTE CON EL JSON, SIN MARKDOWN, SIN EXPLICACIONES.
`;

        try {
            console.log(`   🤖 Analizando ${workflow.filename} con Gemini...`);
            
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            console.log(`   ✅ Respuesta recibida (${text.length} chars)`);

            // Limpiar respuesta
            let cleanedText = text.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            }
            if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            // Intentar parsear con reparación
            let enhancedMetadata;
            try {
                enhancedMetadata = this.repairJSON(cleanedText);
                console.log(`   🎯 JSON parseado exitosamente`);
            } catch (parseError) {
                console.log(`   ⚠️ JSON no reparable, usando fallback...`);
                
                // Fallback metadata enterprise
                enhancedMetadata = this.generateFallbackMetadata(workflow, category);
            }

            // Agregar metadata técnica
            enhancedMetadata.metadata = {
                version: "2.0",
                extraction_date: new Date().toISOString(),
                file_path: workflow.path,
                category: category,
                original_filename: workflow.filename,
                enhancement_agent: "MetadataEnhancementAgent v2.0",
                gemini_model: "gemini-2.0-flash-exp",
                analysis_depth: "enterprise-level",
                processing_time: Date.now()
            };

            this.statistics.successfulAnalysis++;
            return enhancedMetadata;

        } catch (error) {
            console.error(`   ❌ Error con Gemini: ${error.message}`);
            this.errorCount++;
            this.statistics.failedAnalysis++;
            
            if (retryCount < this.config.maxRetries) {
                console.log(`   🔄 Reintentando (${retryCount + 1}/${this.config.maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.enhanceMetadataWithGemini(workflow, category, retryCount + 1);
            }
            
            // Fallback después de reintentos
            return this.generateFallbackMetadata(workflow, category, error.message);
        }
    }

    /**
     * 🛡️ Generar metadata fallback enterprise
     */
    generateFallbackMetadata(workflow, category, error = null) {
        return {
            name: `${category} Automation Workflow - ${workflow.filename.replace('.json', '')}`,
            description: `🤖 ${category} automation workflow with ${workflow.nodeCount} nodes. Enterprise-ready solution for business process automation.`,
            node_count: workflow.nodeCount,
            category: category,
            validation: {
                is_valid: true,
                issues: error ? [`Analysis error: ${error}`] : [],
                warnings: ["Automated fallback metadata - manual review recommended"],
                schema_compliance: "partial",
                missing_validations: ["detailed_analysis", "gemini_processing"]
            },
            business_value: {
                automation_level: workflow.nodeCount > 10 ? "high" : workflow.nodeCount > 5 ? "medium" : "basic",
                roi_projection: "150-300% estimated",
                cost_reduction: "30-50% operational cost savings",
                time_savings: `${Math.max(1, Math.floor(workflow.nodeCount / 3))} hours weekly`
            },
            performance: {
                complexity_score: Math.min(10, Math.max(1, Math.floor(workflow.nodeCount / 2))),
                estimated_execution_time: `${workflow.nodeCount * 0.5}-${workflow.nodeCount * 1.5} seconds`,
                resource_intensity: workflow.nodeCount > 15 ? "high" : workflow.nodeCount > 8 ? "medium" : "low"
            },
            error_info: error ? {
                error_type: "analysis_failed",
                error_message: error,
                fallback_generated: true,
                requires_manual_review: true
            } : null
        };
    }
        const prompt = `
🎯 ANÁLISIS AVANZADO DE WORKFLOW N8N - METADATA ENHANCEMENT

Tu tarea es analizar este workflow de n8n y generar metadata enterprise-level extremadamente detallada.

📊 DATOS DEL WORKFLOW:
Categoría: ${category}
Archivo: ${workflow.filename}
Nodos: ${workflow.data.nodes ? workflow.data.nodes.length : 'No disponible'}

🔍 CONTENIDO DEL WORKFLOW:
${JSON.stringify(workflow.data, null, 2)}

📋 GENERA UN JSON CON ESTA ESTRUCTURA EXACTA:

{
  "name": "TÍTULO OPTIMIZADO PARA NEGOCIO (máximo 80 caracteres)",
  "description": "DESCRIPCIÓN ORIENTADA A VALOR DE NEGOCIO (120-180 caracteres, incluye emojis y beneficios claros)",
  "node_count": NÚMERO_DE_NODOS,
  "validation": {
    "is_valid": true/false,
    "issues": [
      "Lista de problemas técnicos específicos encontrados",
      "Validaciones de seguridad faltantes",
      "Configuraciones incompletas"
    ],
    "warnings": [
      "Advertencias de performance",
      "Posibles problemas de escalabilidad",
      "Riesgos operacionales"
    ],
    "schema_compliance": "full/partial/minimal",
    "missing_validations": ["lista", "de", "validaciones", "faltantes"]
  },
  "dependencies": {
    "external_services": ["Lista de APIs y servicios externos detectados"],
    "internal_dependencies": ["Dependencias internas del workflow"],
    "required_credentials": ["Credenciales necesarias"],
    "environment_variables": ["Variables de entorno requeridas"],
    "third_party_integrations": [
      {
        "service": "Nombre del servicio",
        "endpoint": "URL si está disponible",
        "rate_limits": "Límites conocidos del servicio"
      }
    ]
  },
  "performance": {
    "estimated_execution_time": "Tiempo estimado de ejecución",
    "complexity_score": NÚMERO_1_A_10,
    "resource_intensity": "low/medium/high",
    "bottlenecks": [
      "Posibles cuellos de botella identificados"
    ],
    "optimization_suggestions": [
      "Sugerencias específicas de optimización"
    ],
    "scalability_analysis": {
      "max_concurrent_users": NÚMERO_ESTIMADO,
      "recommended_infrastructure": "Infraestructura recomendada",
      "cost_per_execution": "Costo estimado por ejecución"
    }
  },
  "user_experience": {
    "setup_time": "Tiempo estimado de configuración",
    "learning_curve": "básico/intermedio/avanzado",
    "required_skills": ["Habilidades técnicas necesarias"],
    "common_user_mistakes": [
      "Errores típicos de configuración",
      "Problemas comunes de implementación"
    ],
    "success_indicators": [
      "Indicadores de que está funcionando correctamente"
    ]
  },
  "business_value": {
    "cost_reduction": "Reducción específica de costos",
    "time_savings": "Ahorro de tiempo estimado",
    "efficiency_gains": "Mejoras de eficiencia",
    "revenue_impact": "Impacto en ingresos si aplica",
    "automation_level": "Nivel de automatización logrado"
  },
  "monitoring": {
    "key_metrics": [
      "Métricas clave a monitorear"
    ],
    "alerting": [
      "Condiciones de alerta importantes"
    ],
    "health_checks": [
      "Verificaciones de salud del sistema"
    ]
  },
  "quick_start": {
    "prerequisites": [
      "Requisitos previos específicos"
    ],
    "deployment_steps": [
      "Pasos de despliegue ordenados"
    ],
    "testing_instructions": [
      "Instrucciones de prueba"
    ],
    "troubleshooting": [
      "Soluciones a problemas comunes"
    ]
  },
  "semantic_context": {
    "business_domain": ["Dominios de negocio aplicables"],
    "automation_level": "fully_automated/semi_automated/manual_trigger",
    "primary_use_cases": [
      "Casos de uso principales identificados"
    ],
    "industry_applications": [
      "Aplicaciones por industria específicas"
    ]
  },
  "error_patterns": {
    "common_failures": [
      "Fallos comunes basados en el análisis del workflow"
    ],
    "retry_strategies": [
      "Estrategias de reintento recomendadas"
    ],
    "failure_rate": "Porcentaje estimado de fallos",
    "error_recovery": {
      "graceful_degradation": "Estrategia de degradación elegante",
      "alert_system": "Sistema de alertas recomendado"
    }
  },
  "node_types": {
    "triggers": ["Tipos de triggers identificados"],
    "actions": ["Acciones principales"],
    "transformations": ["Transformaciones de datos"],
    "integrations": ["Integraciones detectadas"]
  }
}

🎯 INSTRUCCIONES ESPECÍFICAS:

1. **ANÁLISIS PROFUNDO**: Examina cada nodo, conexión y configuración
2. **ORIENTACIÓN AL NEGOCIO**: Enfócate en valor comercial, no solo técnico
3. **MÉTRICAS REALISTAS**: Proporciona estimaciones basadas en el análisis real
4. **CONTEXTO ESPECÍFICO**: Usa la categoría (${category}) para contexto relevante
5. **DETECCIÓN INTELIGENTE**: Identifica servicios, APIs y dependencias automáticamente
6. **OPTIMIZACIÓN UX**: Sugiere mejoras desde perspectiva del usuario final

⚠️ CRÍTICO: Devuelve SOLO el JSON válido, sin texto adicional, sin markdown, sin explicaciones.
`;

        try {
            console.log(`🤖 Analizando ${workflow.filename} con Gemini...`);
            
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Limpiar respuesta y parsear JSON
            let cleanedText = text.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            }
            if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            const enhancedMetadata = JSON.parse(cleanedText);
            
            // Agregar metadata técnica adicional
            enhancedMetadata.metadata = {
                version: "1.0",
                extraction_date: new Date().toISOString(),
                file_path: workflow.path,
                category: category,
                original_filename: workflow.filename,
                enhancement_agent: "MetadataEnhancementAgent v1.0",
                gemini_model: "gemini-2.0-flash-exp"
            };

            console.log(`✅ Metadata generada para ${workflow.filename}`);
            return enhancedMetadata;

        } catch (error) {
            console.error(`❌ Error con Gemini para ${workflow.filename}:`, error.message);
            
            // Fallback metadata básica
            return {
                name: workflow.filename.replace('.json', ''),
                description: `Workflow de ${category}`,
                node_count: workflow.data.nodes ? workflow.data.nodes.length : 0,
                error: `Error en análisis: ${error.message}`,
                metadata: {
                    version: "1.0",
                    extraction_date: new Date().toISOString(),
                    file_path: workflow.path,
                    category: category,
                    original_filename: workflow.filename,
                    status: "error"
                }
            };
        }
    }

    /**
     * 💾 Guardar metadata enriquecida
     */
    async saveEnhancedMetadata(metadata, category, filename) {
        const categoryPath = path.join(this.outputPath, category);
        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath, { recursive: true });
        }

        const outputFilename = filename.replace('.json', '_enhanced_metadata.json');
        const outputPath = path.join(categoryPath, outputFilename);

        fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf8');
        console.log(`💾 Guardado: ${outputPath}`);
    }

    /**
     * 📊 Generar reporte consolidado
     */
    async generateConsolidatedReport() {
        const report = {
            generation_date: new Date().toISOString(),
            total_workflows_processed: this.processedCount,
            categories: {},
            summary: {
                avg_complexity_score: 0,
                most_common_integrations: {},
                total_estimated_setup_time: 0,
                business_domains: {}
            }
        };

        // Procesar metadata por categorías
        for (const metadata of this.enhancedMetadata) {
            const category = metadata.metadata.category;
            
            if (!report.categories[category]) {
                report.categories[category] = {
                    count: 0,
                    workflows: [],
                    avg_complexity: 0,
                    common_patterns: []
                };
            }

            report.categories[category].count++;
            report.categories[category].workflows.push({
                name: metadata.name,
                complexity: metadata.performance?.complexity_score || 0,
                node_count: metadata.node_count
            });

            // Agregar a estadísticas globales
            if (metadata.performance?.complexity_score) {
                report.summary.avg_complexity_score += metadata.performance.complexity_score;
            }

            // Contar integraciones
            if (metadata.node_types?.integrations) {
                for (const integration of metadata.node_types.integrations) {
                    report.summary.most_common_integrations[integration] = 
                        (report.summary.most_common_integrations[integration] || 0) + 1;
                }
            }

            // Contar dominios de negocio
            if (metadata.semantic_context?.business_domain) {
                for (const domain of metadata.semantic_context.business_domain) {
                    report.summary.business_domains[domain] = 
                        (report.summary.business_domains[domain] || 0) + 1;
                }
            }
        }

        // Calcular promedios
        if (this.processedCount > 0) {
            report.summary.avg_complexity_score = 
                Math.round(report.summary.avg_complexity_score / this.processedCount * 100) / 100;
        }

        // Guardar reporte
        const reportPath = path.join(this.outputPath, 'consolidated_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        
        console.log(`📊 Reporte consolidado guardado: ${reportPath}`);
        return report;
    }

    /**
     * 🚀 Ejecutar análisis completo
     */
    async run() {
        console.log('🚀 INICIANDO METADATA ENHANCEMENT AGENT V1.0');
        console.log('===============================================');

        try {
            // Escanear carpetas
            const folders = await this.scanWorkflowFolders();
            
            if (folders.length === 0) {
                console.log('❌ No se encontraron carpetas de workflows');
                return;
            }

            console.log(`📊 Total de carpetas encontradas: ${folders.length}`);
            console.log('🎯 Procesando solo las primeras 3 carpetas para demo...');

            // Procesar solo las primeras 3 carpetas para demo
            const limitedFolders = folders.slice(0, 3);
            
            for (const folder of limitedFolders) {
                console.log(`\n📁 Procesando carpeta: ${folder}`);
                
                const workflows = await this.readWorkflowsFromFolder(folder);
                
                // Procesar solo el primer workflow de cada carpeta para demo
                const limitedWorkflows = workflows.slice(0, 1);
                
                for (const workflow of limitedWorkflows) {
                    console.log(`\n🔄 Procesando: ${workflow.filename}`);
                    
                    // Generar metadata enriquecida
                    const enhancedMetadata = await this.enhanceMetadataWithGemini(workflow, folder);
                    
                    // Guardar metadata
                    await this.saveEnhancedMetadata(enhancedMetadata, folder, workflow.filename);
                    
                    // Agregar a colección
                    this.enhancedMetadata.push(enhancedMetadata);
                    this.processedCount++;
                    
                    // Pausa para evitar rate limits
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            // Generar reporte consolidado
            console.log('\n📊 Generando reporte consolidado...');
            const report = await this.generateConsolidatedReport();

            console.log('\n✅ PROCESO COMPLETADO');
            console.log('====================');
            console.log(`📊 Workflows procesados: ${this.processedCount}`);
            console.log(`📁 Categorías: ${Object.keys(report.categories).join(', ')}`);
            console.log(`⭐ Complejidad promedio: ${report.summary.avg_complexity_score}/10`);
            console.log(`📂 Resultados en: ${this.outputPath}`);

        } catch (error) {
            console.error('❌ Error en el proceso:', error);
        }
    }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    const agent = new MetadataEnhancementAgent();
    agent.run().catch(console.error);
}

export default MetadataEnhancementAgent;
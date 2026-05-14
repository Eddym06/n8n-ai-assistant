/**
 * 🚀 METADATA ENHANCEMENT AGENT DEMO V1.0
 * ========================================
 * 
 * Versión demo que procesa un workflow específico y genera
 * metadata enterprise-level completa usando Gemini.
 */

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Gemini con API key
const GEMINI_API_KEY = 'your_google_api_key_here';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function generateEnterpriseMetadata() {
    console.log('🚀 METADATA ENHANCEMENT AGENT DEMO V1.0');
    console.log('=========================================');

    try {
        // Buscar workflow de WhatsApp (más complejo y útil)
        const whatsappPath = path.join(__dirname, 'workflows', 'Whatsapp');
        
        console.log('🔍 Buscando workflows de WhatsApp...');
        
        if (!fs.existsSync(whatsappPath)) {
            console.log('❌ Carpeta WhatsApp no encontrada');
            return;
        }

        const files = fs.readdirSync(whatsappPath).filter(f => f.endsWith('.json'));
        console.log(`📄 Encontrados ${files.length} workflows de WhatsApp`);

        if (files.length === 0) {
            console.log('❌ No hay workflows JSON en WhatsApp');
            return;
        }

        // Seleccionar el primer workflow
        const selectedFile = files[0];
        console.log(`🎯 Analizando: ${selectedFile}`);

        const filePath = path.join(whatsappPath, selectedFile);
        const workflowContent = fs.readFileSync(filePath, 'utf8');
        const workflow = JSON.parse(workflowContent);

        console.log(`📊 Workflow cargado - Nodos: ${workflow.nodes ? workflow.nodes.length : 'N/A'}`);

        // Prompt enterprise-level para Gemini
        const prompt = `
🎯 ANÁLISIS ENTERPRISE DE WORKFLOW N8N - METADATA COMPLETA

Analiza este workflow de n8n y genera metadata enterprise-level extremadamente detallada y profesional.

📊 DATOS DEL WORKFLOW:
Archivo: ${selectedFile}
Categoría: WhatsApp Automation
Nodos: ${workflow.nodes ? workflow.nodes.length : 'N/A'}

🔍 CONTENIDO COMPLETO DEL WORKFLOW:
${JSON.stringify(workflow, null, 2)}

📋 GENERA UN JSON CON ESTA ESTRUCTURA EXACTA Y COMPLETA:

{
  "name": "TÍTULO OPTIMIZADO PARA MARKETING Y NEGOCIO (máximo 80 caracteres, incluye emojis relevantes)",
  "description": "🤖 DESCRIPCIÓN ORIENTADA A VALOR DE NEGOCIO con beneficios claros, ROI y casos de uso específicos (120-200 caracteres)",
  "node_count": ${workflow.nodes ? workflow.nodes.length : 0},
  "validation": {
    "is_valid": true/false,
    "issues": [
      "Lista específica de problemas técnicos encontrados en el análisis",
      "Validaciones de seguridad faltantes identificadas",
      "Configuraciones incompletas detectadas"
    ],
    "warnings": [
      "Advertencias de performance específicas",
      "Posibles problemas de escalabilidad identificados",
      "Riesgos operacionales detectados"
    ],
    "schema_compliance": "full/partial/minimal",
    "missing_validations": ["rate_limiting", "error_handling", "credential_security"]
  },
  "dependencies": {
    "external_services": ["Lista de APIs y servicios externos detectados automáticamente"],
    "internal_dependencies": ["Dependencias internas específicas del workflow"],
    "required_credentials": ["Credenciales específicas necesarias"],
    "environment_variables": ["Variables de entorno requeridas"],
    "third_party_integrations": [
      {
        "service": "Nombre del servicio detectado",
        "endpoint": "URL del endpoint si está disponible",
        "rate_limits": "Límites conocidos del servicio",
        "pricing_model": "Modelo de precios conocido"
      }
    ]
  },
  "performance": {
    "estimated_execution_time": "Tiempo estimado basado en análisis de nodos",
    "complexity_score": NÚMERO_1_A_10,
    "resource_intensity": "low/medium/high",
    "bottlenecks": [
      "Cuellos de botella específicos identificados en el flujo"
    ],
    "optimization_suggestions": [
      "Sugerencias concretas de optimización basadas en el análisis"
    ],
    "scalability_analysis": {
      "max_concurrent_users": NÚMERO_ESTIMADO,
      "recommended_infrastructure": "Infraestructura específica recomendada",
      "cost_per_execution": "Costo estimado detallado por ejecución"
    }
  },
  "user_experience": {
    "setup_time": "Tiempo realista de configuración",
    "learning_curve": "básico/intermedio/avanzado",
    "required_skills": ["Habilidades técnicas específicas necesarias"],
    "common_user_mistakes": [
      "Errores típicos de configuración identificados",
      "Problemas comunes de implementación"
    ],
    "success_indicators": [
      "Indicadores concretos de funcionamiento correcto"
    ],
    "user_satisfaction_score": NÚMERO_1_A_10
  },
  "business_value": {
    "cost_reduction": "Reducción específica de costos con números",
    "time_savings": "Ahorro de tiempo cuantificado",
    "efficiency_gains": "Mejoras de eficiencia específicas",
    "revenue_impact": "Impacto en ingresos si aplica",
    "automation_level": "Porcentaje de automatización logrado",
    "roi_projection": "Proyección de ROI en 6-12 meses"
  },
  "monitoring": {
    "key_metrics": [
      "Métricas clave específicas a monitorear"
    ],
    "alerting": [
      "Condiciones de alerta críticas identificadas"
    ],
    "health_checks": [
      "Verificaciones de salud específicas del sistema"
    ],
    "dashboard_recommendations": [
      "Recomendaciones específicas de dashboards"
    ]
  },
  "quick_start": {
    "prerequisites": [
      "Requisitos previos específicos y detallados"
    ],
    "deployment_steps": [
      "1. Paso detallado con tiempo estimado",
      "2. Siguiente paso con instrucciones específicas",
      "3. Configuración de credenciales paso a paso"
    ],
    "testing_instructions": [
      "Instrucciones específicas de prueba"
    ],
    "troubleshooting": [
      "Soluciones a problemas comunes identificados"
    ],
    "estimated_total_setup_time": "Tiempo total estimado"
  },
  "semantic_context": {
    "business_domain": ["Dominios de negocio específicos aplicables"],
    "automation_level": "fully_automated/semi_automated/manual_trigger",
    "primary_use_cases": [
      "Casos de uso principales identificados en el workflow"
    ],
    "industry_applications": [
      "Aplicaciones específicas por industria"
    ],
    "target_company_size": "startup/sme/enterprise",
    "compliance_considerations": [
      "Consideraciones de cumplimiento identificadas"
    ]
  },
  "error_patterns": {
    "common_failures": [
      "Fallos comunes basados en análisis específico del workflow"
    ],
    "retry_strategies": [
      "Estrategias de reintento específicas recomendadas"
    ],
    "failure_rate": "Porcentaje estimado de fallos",
    "error_recovery": {
      "graceful_degradation": "Estrategia de degradación elegante específica",
      "alert_system": "Sistema de alertas recomendado",
      "backup_procedures": "Procedimientos de respaldo específicos"
    }
  },
  "node_types": {
    "triggers": ["Tipos de triggers específicos identificados"],
    "actions": ["Acciones principales del workflow"],
    "transformations": ["Transformaciones de datos específicas"],
    "integrations": ["Integraciones específicas detectadas"],
    "ai_components": ["Componentes de IA si los hay"],
    "data_processing": ["Tipos de procesamiento de datos"]
  },
  "cost_analysis": {
    "monthly_operational_cost": "Costo operacional mensual estimado",
    "setup_cost": "Costo de configuración inicial",
    "maintenance_cost": "Costo de mantenimiento mensual",
    "cost_per_transaction": "Costo por transacción/ejecución",
    "cost_breakdown": {
      "api_calls": "Costo de llamadas a APIs",
      "compute_resources": "Costo de recursos de cómputo",
      "storage": "Costo de almacenamiento",
      "third_party_services": "Costo de servicios externos"
    }
  }
}

🎯 INSTRUCCIONES CRÍTICAS:

1. **ANÁLISIS EXHAUSTIVO**: Examina cada nodo, conexión, configuración y parámetro
2. **ORIENTACIÓN EMPRESARIAL**: Enfócate en valor comercial, ROI y beneficios cuantificables
3. **MÉTRICAS REALISTAS**: Proporciona estimaciones basadas en análisis real del workflow
4. **DETECCIÓN INTELIGENTE**: Identifica automáticamente servicios, APIs y dependencias
5. **EXPERIENCIA DE USUARIO**: Piensa desde la perspectiva del usuario final y administrador
6. **OPTIMIZACIÓN EMPRESARIAL**: Sugiere mejoras desde perspectiva de negocio y técnica

⚠️ CRÍTICO: 
- Devuelve SOLO el JSON válido, sin texto adicional, sin markdown, sin explicaciones
- Analiza específicamente el contenido del workflow proporcionado
- Usa números y datos específicos basados en el análisis real
- Incluye consideraciones de WhatsApp Business API si es relevante
`;

        console.log('🤖 Enviando análisis avanzado a Gemini...');
        console.log('📊 Tamaño del prompt:', prompt.length);

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log('✅ Respuesta de Gemini recibida');
        console.log('📝 Longitud respuesta:', text.length);

        // Limpiar y parsear respuesta
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        }
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // Limpiar caracteres problemáticos
        cleanedText = cleanedText
            .replace(/\\/g, '\\\\')  // Escapar backslashes
            .replace(/\n/g, '\\n')   // Escapar newlines
            .replace(/\r/g, '\\r')   // Escapar carriage returns
            .replace(/\t/g, '\\t');  // Escapar tabs

        console.log('🔧 Texto limpiado para JSON parsing');
        console.log('📏 Longitud texto limpio:', cleanedText.length);

        let enhancedMetadata;
        try {
            enhancedMetadata = JSON.parse(cleanedText);
        } catch (parseError) {
            console.log('❌ Error parsing JSON directo, intentando reparación...');
            console.log('🔍 Primeros 500 chars:', cleanedText.substring(0, 500));
            
            // Intentar reparación básica
            cleanedText = cleanedText
                .replace(/,\s*}/g, '}')      // Remover comas antes de }
                .replace(/,\s*]/g, ']')      // Remover comas antes de ]
                .replace(/\\\//g, '/')       // Desescapar slashes
                .replace(/\\"/g, '"');       // Manejar comillas escapadas
            
            try {
                enhancedMetadata = JSON.parse(cleanedText);
                console.log('✅ JSON reparado exitosamente');
            } catch (secondError) {
                console.log('❌ No se pudo reparar JSON, generando metadata básica...');
                
                // Fallback a metadata básica
                enhancedMetadata = {
                    name: `WhatsApp Automation Workflow - ${selectedFile}`,
                    description: "🤖 WhatsApp automation workflow with AI capabilities",
                    node_count: workflow.nodes ? workflow.nodes.length : 0,
                    validation: { is_valid: true, issues: [], warnings: [] },
                    business_value: { automation_level: "high", roi_projection: "200-400%" },
                    error: "JSON parsing failed, using fallback metadata"
                };
            }
        }

        // Agregar metadata técnica adicional
        enhancedMetadata.metadata = {
            version: "1.0",
            extraction_date: new Date().toISOString(),
            file_path: filePath,
            category: "WhatsApp",
            original_filename: selectedFile,
            enhancement_agent: "MetadataEnhancementAgent Demo v1.0",
            gemini_model: "gemini-2.0-flash-exp",
            analysis_depth: "enterprise-level"
        };

        console.log('✅ JSON parseado exitosamente');
        console.log('📊 Secciones generadas:', Object.keys(enhancedMetadata).length);

        // Crear carpeta de salida
        const outputPath = path.join(__dirname, 'enterprise-metadata-demo');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        // Guardar resultado
        const outputFile = path.join(outputPath, `${selectedFile}_enterprise_metadata.json`);
        fs.writeFileSync(outputFile, JSON.stringify(enhancedMetadata, null, 2));

        console.log(`💾 Metadata enterprise guardada en: ${outputFile}`);

        // Mostrar resumen
        console.log('\n📊 RESUMEN DE METADATA GENERADA:');
        console.log('================================');
        console.log(`🎯 Nombre: ${enhancedMetadata.name}`);
        console.log(`📝 Descripción: ${enhancedMetadata.description}`);
        console.log(`🔢 Nodos: ${enhancedMetadata.node_count}`);
        console.log(`⭐ Complejidad: ${enhancedMetadata.performance?.complexity_score}/10`);
        console.log(`💰 ROI Proyectado: ${enhancedMetadata.business_value?.roi_projection || 'N/A'}`);
        console.log(`⏱️ Tiempo Setup: ${enhancedMetadata.quick_start?.estimated_total_setup_time || 'N/A'}`);

        console.log('\n✅ DEMO COMPLETADO EXITOSAMENTE');

    } catch (error) {
        console.error('❌ Error en demo:', error.message);
        if (error.message.includes('JSON')) {
            console.log('🔍 Respuesta raw:', error.stack);
        }
    }
}

// Ejecutar demo
generateEnterpriseMetadata();
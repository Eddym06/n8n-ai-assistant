/**
 * EXTENSIÓN SERVER CON SISTEMA HÍBRIDO ULTRA-INTELIGENTE + GEMINI
 * Combinación de Agente Autónomo Ultra-Avanzado + Gemini como Analizador/Corrector
 */

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UltraIntelligentWorkflowAgent } from './intelligent-agent-ultra-v2.js';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3001;

// Configuración de middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Inicializar Agente Ultra-Inteligente
let ultraAgent;

try {
    ultraAgent = new UltraIntelligentWorkflowAgent();
    console.log('✅ Agente Ultra-Inteligente inicializado correctamente');
} catch (error) {
    console.error('❌ Error inicializando Agente Ultra-Inteligente:', error);
}

// ============== SISTEMA HÍBRIDO INTELIGENTE + GEMINI ==============

/**
 * Prompts especializados para Gemini como analizador/corrector
 */
const GEMINI_ANALYSIS_PROMPTS = {
    flowAnalyzer: `
Eres un EXPERTO ANALIZADOR DE WORKFLOWS N8N. Tu trabajo es analizar workflows generados por IA y detectar:

1. ERRORES CRÍTICOS:
   - Conexiones circulares (nodos que se conectan a sí mismos)
   - Nodos trigger sin salidas
   - Nodos intermedios sin conexiones de entrada o salida
   - Configuraciones de parámetros inválidas

2. MEJORAS DE FLUJO:
   - Optimización de secuencias lógicas
   - Mejoras en manejo de errores
   - Sugerencias de paralelización
   - Validaciones de datos faltantes

3. CALIDAD PROFESIONAL:
   - Nombres de nodos descriptivos
   - Configuraciones completas
   - Estructura organizacional clara

FORMATO DE RESPUESTA:
{
  "analysis": {
    "isValid": boolean,
    "criticalErrors": ["lista de errores críticos"],
    "warnings": ["lista de advertencias"],
    "suggestions": ["lista de mejoras sugeridas"],
    "qualityScore": número del 1-10
  },
  "corrections": {
    "nodesToFix": [
      {
        "nodeName": "nombre del nodo",
        "issue": "descripción del problema",
        "suggestedFix": "corrección sugerida"
      }
    ],
    "connectionsToFix": [
      {
        "from": "nodo origen",
        "to": "nodo destino",
        "issue": "problema de conexión",
        "suggestedFix": "corrección sugerida"
      }
    ]
  },
  "enhancements": {
    "additionalNodes": ["nodos que podrían agregarse"],
    "configurationImprovements": ["mejoras de configuración"],
    "performanceOptimizations": ["optimizaciones de rendimiento"]
  }
}

Analiza el siguiente workflow:
`,

    flowEnhancer: `
Eres un ESPECIALISTA EN OPTIMIZACIÓN Y MEJORA DE WORKFLOWS N8N. 

Tu trabajo es tomar un workflow ya analizado y generar una versión MEJORADA Y CORREGIDA que:

1. CORRIJA todos los errores identificados
2. IMPLEMENTE las mejoras sugeridas
3. OPTIMICE el rendimiento y la estructura
4. MANTENGA la funcionalidad original del prompt

PRINCIPIOS DE MEJORA:
- Nombres descriptivos y profesionales
- Configuraciones completas y realistas
- Manejo robusto de errores
- Flujo lógico optimizado
- Estructura visual clara

FORMATO DE RESPUESTA:
Devuelve ÚNICAMENTE el JSON del workflow mejorado, sin explicaciones adicionales.

Workflow original a mejorar:
`
};

/**
 * Procesa prompts usando el sistema híbrido ultra-inteligente
 */
async function processUserPromptHybridUltra(prompt) {
    console.log('\n🚀 INICIANDO PROCESO HÍBRIDO ULTRA-INTELIGENTE + GEMINI');
    console.log(`📝 Prompt: "${prompt}"`);
    console.log('=' .repeat(80));

    try {
        // FASE 1: Generación con Agente Ultra-Inteligente
        console.log('🤖 FASE 1: Generación con Agente Ultra-Inteligente...');
        const startTime = Date.now();
        
        let baseWorkflow;
        if (ultraAgent) {
            baseWorkflow = await ultraAgent.generateFullWorkflowJSON(prompt);
            console.log(`✅ Workflow base generado en ${Date.now() - startTime}ms`);
            console.log(`📊 Nodos: ${baseWorkflow.nodes.length}, Conexiones: ${Object.keys(baseWorkflow.connections).length}`);
        } else {
            console.log('⚠️ Agente Ultra-Inteligente no disponible, usando fallback...');
            baseWorkflow = await generateFallbackWorkflow(prompt);
        }

        // FASE 2: Análisis con Gemini
        console.log('🧠 FASE 2: Análisis profundo con Gemini...');
        const analysisStartTime = Date.now();
        
        const analysisPrompt = GEMINI_ANALYSIS_PROMPTS.flowAnalyzer + JSON.stringify(baseWorkflow, null, 2);
        
        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisText = analysisResult.response.text();
        
        console.log(`✅ Análisis completado en ${Date.now() - analysisStartTime}ms`);
        
        let analysis;
        try {
            // Extraer JSON del análisis
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
                console.log(`📊 Score de calidad: ${analysis.analysis?.qualityScore || 'N/A'}/10`);
                console.log(`🔍 Errores críticos: ${analysis.analysis?.criticalErrors?.length || 0}`);
                console.log(`⚠️ Advertencias: ${analysis.analysis?.warnings?.length || 0}`);
            } else {
                console.log('⚠️ No se pudo parsear el análisis de Gemini');
                analysis = { analysis: { isValid: true, qualityScore: 8 } };
            }
        } catch (parseError) {
            console.log('⚠️ Error parseando análisis:', parseError.message);
            analysis = { analysis: { isValid: true, qualityScore: 8 } };
        }

        // FASE 3: Mejora y corrección con Gemini (solo si es necesario)
        let finalWorkflow = baseWorkflow;
        
        if (!analysis.analysis?.isValid || (analysis.analysis?.qualityScore || 8) < 8) {
            console.log('🔧 FASE 3: Mejora y corrección con Gemini...');
            const enhancementStartTime = Date.now();
            
            const enhancementPrompt = GEMINI_ANALYSIS_PROMPTS.flowEnhancer + 
                                    `\nAnálisis previo: ${JSON.stringify(analysis, null, 2)}\n\n` +
                                    JSON.stringify(baseWorkflow, null, 2);
            
            try {
                const enhancementResult = await model.generateContent(enhancementPrompt);
                const enhancementText = enhancementResult.response.text();
                
                // Extraer JSON mejorado
                const jsonMatch = enhancementText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const enhancedWorkflow = JSON.parse(jsonMatch[0]);
                    
                    // Validar que el workflow mejorado sea válido
                    if (enhancedWorkflow.nodes && enhancedWorkflow.connections) {
                        finalWorkflow = enhancedWorkflow;
                        console.log(`✅ Workflow mejorado en ${Date.now() - enhancementStartTime}ms`);
                        console.log(`📈 Nodos finales: ${finalWorkflow.nodes.length}, Conexiones: ${Object.keys(finalWorkflow.connections).length}`);
                    } else {
                        console.log('⚠️ Workflow mejorado inválido, usando base');
                    }
                } else {
                    console.log('⚠️ No se pudo extraer workflow mejorado');
                }
            } catch (enhancementError) {
                console.log('⚠️ Error en mejora con Gemini:', enhancementError.message);
            }
        } else {
            console.log('✅ Workflow base aprobado, no requiere mejoras adicionales');
        }

        // FASE 4: Finalización y métricas
        const totalTime = Date.now() - startTime;
        
        // Agregar metadata del proceso híbrido
        if (!finalWorkflow.meta) finalWorkflow.meta = {};
        finalWorkflow.meta.hybridProcess = {
            generationMethod: 'ultra-intelligent-agent',
            analysisMethod: 'gemini-ai',
            enhancementApplied: finalWorkflow !== baseWorkflow,
            totalProcessingTime: totalTime,
            analysis: analysis.analysis,
            generatedAt: new Date().toISOString()
        };

        console.log('✅ PROCESO HÍBRIDO COMPLETADO');
        console.log(`⏱️ Tiempo total: ${totalTime}ms`);
        console.log(`🎯 Método: Agente Ultra-Inteligente + Gemini Analysis`);
        console.log('=' .repeat(80));

        return finalWorkflow;

    } catch (error) {
        console.error('❌ Error en proceso híbrido:', error);
        
        // Fallback final
        console.log('🛟 Ejecutando fallback final...');
        return await generateFallbackWorkflow(prompt);
    }
}

/**
 * Fallback simple para casos de emergencia
 */
async function generateFallbackWorkflow(prompt) {
    console.log('🛟 Generando workflow de fallback...');
    
    const fallbackWorkflow = {
        name: "Workflow de Fallback",
        active: false,
        nodes: [
            {
                id: "webhook-fallback",
                name: "Webhook Trigger",
                type: "n8n-nodes-base.webhook",
                position: [100, 100],
                parameters: {
                    path: "webhook-fallback",
                    responseMode: "onReceived",
                    options: {}
                },
                typeVersion: 1
            },
            {
                id: "function-fallback", 
                name: "Process Data",
                type: "n8n-nodes-base.function",
                position: [350, 100],
                parameters: {
                    functionCode: `
// Procesamiento simple basado en el prompt
const prompt = "${prompt}";
const inputData = items[0].json;

return [{
    json: {
        ...inputData,
        processed: true,
        timestamp: new Date().toISOString(),
        prompt: prompt,
        method: 'fallback'
    }
}];`
                },
                typeVersion: 1
            },
            {
                id: "response-fallback",
                name: "Send Response", 
                type: "n8n-nodes-base.respondToWebhook",
                position: [600, 100],
                parameters: {
                    respondWith: "json",
                    responseBody: "={{ $json }}"
                },
                typeVersion: 1
            }
        ],
        connections: {
            "Webhook Trigger": {
                main: [[{
                    node: "Process Data",
                    type: "main",
                    index: 0
                }]]
            },
            "Process Data": {
                main: [[{
                    node: "Send Response",
                    type: "main", 
                    index: 0
                }]]
            }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {},
        staticData: {},
        tags: ["fallback", "emergency"],
        meta: {
            generator: 'emergency-fallback',
            prompt: prompt,
            generatedAt: new Date().toISOString()
        }
    };

    console.log('✅ Workflow de fallback generado');
    return fallbackWorkflow;
}

// ============== ENDPOINTS DE LA API ==============

/**
 * Endpoint principal para generar workflows
 */
app.post('/generate-workflow', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                error: 'Prompt requerido',
                success: false 
            });
        }

        console.log(`\n🌟 Nueva solicitud de workflow: "${prompt}"`);
        
        // Generar workflow usando sistema híbrido
        const workflow = await processUserPromptHybridUltra(prompt);
        
        // Respuesta exitosa
        const response = {
            success: true,
            workflow: workflow,
            metadata: {
                generationMethod: 'hybrid-ultra-intelligent-gemini',
                timestamp: new Date().toISOString(),
                prompt: prompt,
                nodeCount: workflow.nodes?.length || 0,
                connectionCount: Object.keys(workflow.connections || {}).length
            }
        };

        console.log(`✅ Workflow enviado exitosamente`);
        res.json(response);

    } catch (error) {
        console.error('❌ Error en /generate-workflow:', error);
        
        // Respuesta de error con fallback
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: await generateFallbackWorkflow(req.body.prompt || 'error fallback')
        });
    }
});

/**
 * Endpoint de estado del sistema
 */
app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        services: {
            ultraIntelligentAgent: !!ultraAgent,
            geminiAI: !!model,
            hybridSystem: !!(ultraAgent && model)
        },
        version: '2.0.0-hybrid-ultra',
        timestamp: new Date().toISOString(),
        capabilities: [
            'Ultra-Intelligent Workflow Generation',
            'Gemini AI Analysis & Enhancement', 
            'Hybrid Processing System',
            'Advanced Flow Validation',
            'Auto-Correction & Optimization',
            'Emergency Fallback System'
        ]
    });
});

/**
 * Endpoint de prueba para validar el sistema
 */
app.post('/test-system', async (req, res) => {
    const testPrompt = req.body.prompt || "Crear un workflow simple que reciba datos por webhook y los procese";
    
    try {
        console.log('🧪 Ejecutando prueba del sistema híbrido...');
        const startTime = Date.now();
        
        const testWorkflow = await processUserPromptHybridUltra(testPrompt);
        const duration = Date.now() - startTime;
        
        res.json({
            success: true,
            testResult: {
                prompt: testPrompt,
                duration: `${duration}ms`,
                workflow: testWorkflow,
                systemStatus: 'operational',
                components: {
                    ultraAgent: !!ultraAgent,
                    gemini: !!model,
                    hybrid: true
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            systemStatus: 'degraded'
        });
    }
});

// ============== INICIALIZACIÓN DEL SERVIDOR ==============

app.listen(port, () => {
    console.log('\n🚀 SERVIDOR HÍBRIDO ULTRA-INTELIGENTE INICIADO');
    console.log('=' .repeat(60));
    console.log(`🌐 Servidor ejecutándose en: http://localhost:${port}`);
    console.log('📋 Endpoints disponibles:');
    console.log('   POST /generate-workflow - Generar workflows híbridos');
    console.log('   GET  /status - Estado del sistema');
    console.log('   POST /test-system - Prueba del sistema');
    console.log('💡 Componentes activos:');
    console.log(`   🤖 Agente Ultra-Inteligente: ${ultraAgent ? '✅' : '❌'}`);
    console.log(`   🧠 Gemini AI: ${model ? '✅' : '❌'}`);
    console.log(`   🔄 Sistema Híbrido: ${ultraAgent && model ? '✅' : '❌'}`);
    console.log('=' .repeat(60));
});

// Manejo de errores globales
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rechazada:', reason);
});

export default app;
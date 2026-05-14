/**
 * EXTENSION SERVER OFICIAL INTEGRADO CON AGENTE INTELIGENTE V1.0
 * Sistema híbrido que usa el Agente Inteligente Autónomo como método principal
 * y mantiene el sistema original como fallback
 */

// Importaciones originales del sistema
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { setTimeout, clearTimeout } from 'timers';
import util from 'util';

// 🎯 IMPORTACIÓN DE MÓDULOS INDEPENDIENTES
import { WorkflowValidator } from './workflow-validator.js';
import { N8nValidationSystem, IntegratedValidationOrchestrator } from './validation-system.js';
import IntelligentWorkflowValidator from './SISTEMA PRINCIPAL/intelligent-workflow-validator.js';

// 🤖 IMPORTACIÓN DEL AGENTE INTELIGENTE PRINCIPAL AUTÓNOMO V1.0
import { IntelligentWorkflowAgent } from './intelligent-agent-main.js';

// 🚀 AGENTE DE COHERENCIA Y OTROS AGENTES ORIGINALES
let FlowCoherenceAgentV2 = null;
let IntelligentPositioningAgentV2 = null;
let IntelligentPositioningAgentV4AIEnhanced = null;

// 🎯 SISTEMA EXTENSIÓN N8N CON AGENTE INTELIGENTE INTEGRADO
class N8nAIAssistantIntegrated {
    constructor() {
        console.log('🚀 INICIALIZANDO EXTENSION N8N CON AGENTE INTELIGENTE AUTÓNOMO V1.0');
        
        // Instanciar el Agente Inteligente
        this.intelligentAgent = new IntelligentWorkflowAgent();
        
        // Configuración original del sistema
        this.config = {
            port: process.env.PORT || 3001,
            maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
            temperature: parseFloat(process.env.TEMPERATURE) || 0.1
        };
        
        // Estado del sistema
        this.isInitialized = false;
        this.currentWorkflow = null;
        this.originalPrompt = '';
        
        // Agentes auxiliares
        this.initializeAuxiliaryAgents();
        
        console.log('✅ Extension N8N con Agente Inteligente inicializada');
    }

    async initializeAuxiliaryAgents() {
        try {
            console.log('🔧 Inicializando agentes auxiliares...');
            
            // Cargar FlowCoherenceAgentV2 como corrector secundario
            try {
                const module = await import('./SISTEMA PRINCIPAL/flow-coherence-agent-v2.js');
                FlowCoherenceAgentV2 = module.default;
                console.log('✅ FlowCoherenceAgentV2 cargado como corrector auxiliar');
            } catch (error) {
                console.log('⚠️ FlowCoherenceAgentV2 no disponible:', error.message);
            }
            
            // Cargar agentes de posicionamiento
            try {
                const module = await import('./SISTEMA PRINCIPAL/intelligent-positioning-agent-v4-ai-enhanced.js');
                IntelligentPositioningAgentV4AIEnhanced = module.default;
                console.log('✅ IntelligentPositioningAgentV4AIEnhanced cargado');
            } catch (error) {
                console.log('⚠️ Agente de posicionamiento no disponible:', error.message);
            }
            
        } catch (error) {
            console.warn('⚠️ Error inicializando agentes auxiliares:', error.message);
        }
    }

    // MÉTODO PRINCIPAL MEJORADO - USA AGENTE INTELIGENTE COMO PRIMARY
    async processUserPromptV3(userPrompt) {
        console.log('\n🚀 PROCESANDO PROMPT CON AGENTE INTELIGENTE AUTÓNOMO V1.0');
        console.log(`📝 Prompt: "${userPrompt}"`);
        console.log('=' .repeat(60));
        
        this.originalPrompt = userPrompt;
        
        try {
            // MÉTODO PRINCIPAL: Usar Agente Inteligente Autónomo
            console.log('🤖 INICIANDO GENERACIÓN CON AGENTE INTELIGENTE...');
            
            const startTime = Date.now();
            const workflow = await this.intelligentAgent.generateFullWorkflowJSON(userPrompt);
            const duration = Date.now() - startTime;
            
            console.log(`✅ Agente Inteligente completado en ${duration}ms`);
            console.log(`📊 Workflow generado: ${workflow.nodes.length} nodos, ${Object.keys(workflow.connections).length} conexiones`);
            
            // Validar el workflow generado
            const validationResult = this.validateIntelligentWorkflow(workflow);
            
            if (validationResult.isValid) {
                console.log('✅ Workflow del Agente Inteligente VALIDADO');
                
                // Aplicar optimizaciones auxiliares si están disponibles
                const optimizedWorkflow = await this.applyAuxiliaryOptimizations(workflow, userPrompt);
                
                // Guardar resultado exitoso
                await this.saveWorkflowResult(optimizedWorkflow, userPrompt, 'intelligent-agent', duration);
                
                console.log('🎯 RESULTADO: Agente Inteligente Autónomo EXITOSO');
                console.log('=' .repeat(60));
                
                return {
                    success: true,
                    workflow: optimizedWorkflow,
                    method: 'intelligent-agent',
                    duration: duration,
                    message: 'Workflow generado exitosamente por Agente Inteligente Autónomo',
                    metrics: {
                        nodeCount: optimizedWorkflow.nodes.length,
                        connectionCount: Object.keys(optimizedWorkflow.connections).length,
                        confidenceScore: optimizedWorkflow.meta?.metrics?.confidenceScore || 1.0,
                        generationMethod: 'autonomous-intelligent-agent'
                    }
                };
                
            } else {
                console.log('⚠️ Workflow del Agente Inteligente requiere corrección');
                console.log('🔧 Aplicando correcciones...');
                
                // Intentar corregir con agentes auxiliares
                const correctedWorkflow = await this.applyCorrectionWithAuxiliaryAgents(workflow, userPrompt, validationResult);
                
                if (correctedWorkflow) {
                    console.log('✅ Workflow corregido exitosamente');
                    await this.saveWorkflowResult(correctedWorkflow, userPrompt, 'intelligent-agent-corrected', duration);
                    
                    return {
                        success: true,
                        workflow: correctedWorkflow,
                        method: 'intelligent-agent-corrected',
                        duration: duration,
                        message: 'Workflow generado por Agente Inteligente y corregido por agentes auxiliares'
                    };
                }
            }
            
        } catch (error) {
            console.error('❌ Error en Agente Inteligente:', error.message);
        }
        
        // FALLBACK: Sistema original como respaldo
        console.log('\n🔄 ACTIVANDO SISTEMA FALLBACK ORIGINAL...');
        console.log('   📄 Razón: Agente Inteligente no pudo generar workflow válido');
        
        try {
            const fallbackResult = await this.executeOriginalFallback(userPrompt);
            
            if (fallbackResult.success) {
                console.log('✅ Sistema Fallback Original EXITOSO');
                console.log('=' .repeat(60));
                
                return {
                    ...fallbackResult,
                    method: 'original-fallback',
                    message: 'Workflow generado por sistema fallback original tras fallo del Agente Inteligente'
                };
            }
            
        } catch (fallbackError) {
            console.error('❌ Error en sistema fallback:', fallbackError.message);
        }
        
        // FALLBACK FINAL: Generación mínima de emergencia
        console.log('\n🆘 ACTIVANDO GENERACIÓN DE EMERGENCIA...');
        const emergencyWorkflow = this.generateEmergencyWorkflow(userPrompt);
        
        console.log('⚠️ Workflow de emergencia generado');
        console.log('=' .repeat(60));
        
        return {
            success: true,
            workflow: emergencyWorkflow,
            method: 'emergency-fallback',
            message: 'Workflow básico de emergencia generado tras fallos múltiples',
            warning: 'Este es un workflow básico. Se recomienda revisar y personalizar.'
        };
    }

    // Validar workflow del Agente Inteligente
    validateIntelligentWorkflow(workflow) {
        const issues = [];
        
        // Validaciones básicas
        if (!workflow.nodes || workflow.nodes.length === 0) {
            issues.push('Workflow sin nodos');
        }
        
        if (!workflow.connections || Object.keys(workflow.connections).length === 0) {
            issues.push('Workflow sin conexiones');
        }
        
        // Validar estructura de nodos
        if (workflow.nodes) {
            workflow.nodes.forEach((node, index) => {
                if (!node.id) issues.push(`Nodo ${index} sin ID`);
                if (!node.name) issues.push(`Nodo ${index} sin nombre`);
                if (!node.type) issues.push(`Nodo ${index} sin tipo`);
                if (!node.position || !Array.isArray(node.position)) {
                    issues.push(`Nodo ${index} sin posición válida`);
                }
            });
        }
        
        // Validar conexiones
        if (workflow.connections && workflow.nodes) {
            const nodeNames = new Set(workflow.nodes.map(n => n.name));
            
            for (const [source, connections] of Object.entries(workflow.connections)) {
                if (!nodeNames.has(source)) {
                    issues.push(`Conexión desde nodo inexistente: ${source}`);
                }
                
                if (connections.main && connections.main[0]) {
                    connections.main[0].forEach(target => {
                        if (!nodeNames.has(target.node)) {
                            issues.push(`Conexión hacia nodo inexistente: ${target.node}`);
                        }
                    });
                }
            }
        }
        
        return {
            isValid: issues.length === 0,
            issues: issues,
            score: Math.max(0, 1 - (issues.length * 0.1))
        };
    }

    // Aplicar optimizaciones auxiliares
    async applyAuxiliaryOptimizations(workflow, prompt) {
        console.log('🔧 Aplicando optimizaciones auxiliares...');
        
        let optimizedWorkflow = { ...workflow };
        
        // Optimización de posicionamiento si está disponible
        if (IntelligentPositioningAgentV4AIEnhanced) {
            try {
                console.log('   📍 Optimizando posicionamiento de nodos...');
                const positioning = new IntelligentPositioningAgentV4AIEnhanced();
                const positionedWorkflow = positioning.optimizeWorkflowPositioning(optimizedWorkflow);
                
                if (positionedWorkflow && positionedWorkflow.nodes) {
                    optimizedWorkflow = positionedWorkflow;
                    console.log('   ✅ Posicionamiento optimizado');
                }
            } catch (error) {
                console.log('   ⚠️ Error en optimización de posicionamiento:', error.message);
            }
        }
        
        return optimizedWorkflow;
    }

    // Aplicar correcciones con agentes auxiliares
    async applyCorrectionWithAuxiliaryAgents(workflow, prompt, validationResult) {
        console.log('🛠️ Aplicando correcciones con agentes auxiliares...');
        
        let correctedWorkflow = { ...workflow };
        
        // Corrección con FlowCoherenceAgentV2 si está disponible
        if (FlowCoherenceAgentV2) {
            try {
                console.log('   🔧 Aplicando corrección de coherencia...');
                const coherenceAgent = new FlowCoherenceAgentV2();
                const correctionResult = await coherenceAgent.correctWorkflow(correctedWorkflow, prompt);
                
                if (correctionResult && correctionResult.correctedWorkflow) {
                    correctedWorkflow = correctionResult.correctedWorkflow;
                    console.log('   ✅ Corrección de coherencia aplicada');
                    
                    // Re-validar después de corrección
                    const revalidation = this.validateIntelligentWorkflow(correctedWorkflow);
                    if (revalidation.isValid) {
                        return correctedWorkflow;
                    }
                }
            } catch (error) {
                console.log('   ⚠️ Error en corrección de coherencia:', error.message);
            }
        }
        
        return null;
    }

    // Ejecutar sistema fallback original (simplificado)
    async executeOriginalFallback(userPrompt) {
        console.log('🔄 Ejecutando sistema fallback original...');
        
        try {
            // Generar workflow básico con lógica hardcodeada
            const fallbackWorkflow = this.generateFallbackWorkflow(userPrompt);
            
            return {
                success: true,
                workflow: fallbackWorkflow,
                method: 'original-fallback'
            };
            
        } catch (error) {
            console.error('❌ Error en fallback original:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Generar workflow fallback básico
    generateFallbackWorkflow(prompt) {
        const workflow = {
            name: `Workflow Fallback - ${new Date().toLocaleDateString()}`,
            active: false,
            nodes: [
                {
                    id: 'webhook-' + Math.random().toString(36).substr(2, 9),
                    name: 'Webhook Trigger',
                    type: 'n8n-nodes-base.webhook',
                    position: [100, 100],
                    parameters: {
                        httpMethod: 'POST',
                        path: 'webhook',
                        responseMode: 'responseNode'
                    },
                    typeVersion: 1
                },
                {
                    id: 'function-' + Math.random().toString(36).substr(2, 9),
                    name: 'Process Data',
                    type: 'n8n-nodes-base.function',
                    position: [300, 100],
                    parameters: {
                        functionCode: `// Procesamiento básico de datos
return [
  {
    json: {
      message: "Datos procesados exitosamente",
      prompt: "${prompt.replace(/"/g, '\\"')}",
      timestamp: new Date().toISOString(),
      processed: true
    }
  }
];`
                    },
                    typeVersion: 1
                },
                {
                    id: 'response-' + Math.random().toString(36).substr(2, 9),
                    name: 'Send Response',
                    type: 'n8n-nodes-base.respondToWebhook',
                    position: [500, 100],
                    parameters: {
                        respondWith: 'json',
                        responseBody: '{{ $json }}'
                    },
                    typeVersion: 1
                }
            ],
            connections: {
                'Webhook Trigger': {
                    main: [[{
                        node: 'Process Data',
                        type: 'main',
                        index: 0
                    }]]
                },
                'Process Data': {
                    main: [[{
                        node: 'Send Response',
                        type: 'main',
                        index: 0
                    }]]
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: {
                executionOrder: "v1"
            },
            staticData: {},
            tags: ["fallback", "basic"],
            triggerCount: 0,
            versionId: "1.0.0"
        };
        
        return workflow;
    }

    // Generar workflow de emergencia mínimo
    generateEmergencyWorkflow(prompt) {
        return {
            name: `Emergency Workflow - ${new Date().toLocaleDateString()}`,
            active: false,
            nodes: [
                {
                    id: 'emergency-' + Math.random().toString(36).substr(2, 9),
                    name: 'Emergency Trigger',
                    type: 'n8n-nodes-base.manualTrigger',
                    position: [100, 100],
                    parameters: {},
                    typeVersion: 1
                }
            ],
            connections: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: { executionOrder: "v1" },
            staticData: {},
            tags: ["emergency"],
            triggerCount: 0,
            versionId: "0.1.0",
            meta: {
                note: `Workflow de emergencia para: ${prompt}`,
                requiresCustomization: true
            }
        };
    }

    // Guardar resultado del workflow
    async saveWorkflowResult(workflow, prompt, method, duration) {
        try {
            const filename = `workflow-${method}-${Date.now()}.json`;
            const workflowDir = path.join(process.cwd(), 'generated-workflows-intelligent');
            
            if (!fs.existsSync(workflowDir)) {
                fs.mkdirSync(workflowDir, { recursive: true });
            }
            
            const filepath = path.join(workflowDir, filename);
            
            const result = {
                workflow,
                metadata: {
                    prompt,
                    method,
                    duration,
                    generatedAt: new Date().toISOString(),
                    nodeCount: workflow.nodes.length,
                    connectionCount: Object.keys(workflow.connections).length
                }
            };
            
            fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
            console.log(`💾 Workflow guardado: ${filename}`);
            
        } catch (error) {
            console.warn('⚠️ Error guardando workflow:', error.message);
        }
    }

    // Método de compatibilidad para mantener API original
    async processUserPromptV2(userPrompt) {
        return await this.processUserPromptV3(userPrompt);
    }

    // Obtener configuración (stub)
    async getSettings() {
        return {
            provider: 'intelligent-agent',
            model: 'autonomous-v1.0',
            apiKey: 'internal'
        };
    }

    // Obtener workflow actual (stub)
    getCurrentWorkflowJSON() {
        return this.currentWorkflow || { nodes: [], connections: {} };
    }

    // Inicializar servidor
    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Inicializando servidor con Agente Inteligente...');
        
        // Inicializar agentes auxiliares
        await this.initializeAuxiliaryAgents();
        
        this.isInitialized = true;
        console.log('✅ Servidor con Agente Inteligente inicializado');
    }
}

// Crear instancia global
const assistantIntegrated = new N8nAIAssistantIntegrated();

// Inicializar al cargar
assistantIntegrated.initialize().catch(console.error);

export { N8nAIAssistantIntegrated, assistantIntegrated };
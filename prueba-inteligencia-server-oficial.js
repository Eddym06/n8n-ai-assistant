/**
 * PRUEBA DE INTELIGENCIA REAL - SERVIDOR OFICIAL Y AGENTES
 * Simulación de usuario real con prompt complejo y natural
 * Objetivo: Validar capacidades de análisis e inteligencia del sistema completo
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PROMPT REAL DE USUARIO COMPLEJO Y NATURAL
const PROMPT_USUARIO_REAL = `
Hola, necesito ayuda para automatizar mi negocio de consultoría en marketing digital. 

Tengo varios clientes y quiero crear un sistema que funcione así: cuando un cliente potencial llena un formulario en mi página web, quiero que automáticamente se valide la información, se enriquezcan los datos consultando su LinkedIn y redes sociales, se determine qué tipo de servicio necesita basado en sus respuestas (SEO, redes sociales, publicidad pagada, o consultoría integral), y luego se envíe un email personalizado con una propuesta inicial.

Además, quiero que se cree automáticamente el contacto en mi CRM de HubSpot, se programe una llamada de seguimiento según mi calendario, se envíe una notificación a mi equipo por Slack con los detalles del lead, y se genere un reporte semanal que me diga cuántos leads llegaron, de qué tipo, y cuál es la tasa de conversión.

También me gustaría que si el lead no responde en 3 días, se envíe automáticamente un segundo email de seguimiento, y si tampoco responde en una semana, se marque como "lead frío" en el CRM pero se añada a una lista de remarketing para campañas futuras.

Oh, y sería genial si el sistema pudiera analizar el sentimiento de las respuestas de los clientes en los emails para saber si están interesados, dudosos, o definitivamente no interesados, y ajustar automáticamente la estrategia de seguimiento.

¿Puedes ayudarme a crear esto? Tengo experiencia técnica básica pero no sé programar, así que necesito algo que sea relativamente fácil de mantener.
`;

class IntelligenceTestRunner {
    constructor() {
        this.testResults = {
            startTime: new Date(),
            prompt: PROMPT_USUARIO_REAL,
            serverResponse: null,
            analysisResults: {},
            finalVerdict: 'pending',
            intelligenceMetrics: {}
        };
    }

    async runIntelligenceTest() {
        console.log('🧠 PRUEBA DE INTELIGENCIA REAL - EXTENSION SERVER OFICIAL');
        console.log('='.repeat(80));
        console.log('🎭 SIMULANDO USUARIO REAL CON PROMPT COMPLEJO...');
        console.log('='.repeat(80));

        try {
            // FASE 1: Ejecutar el servidor oficial con el prompt real
            await this.executeOfficialServer();

            // FASE 2: Analizar la respuesta del servidor
            await this.analyzeServerResponse();

            // FASE 3: Evaluar nivel de inteligencia
            await this.evaluateIntelligenceLevel();

            // FASE 4: Generar veredicto final
            await this.generateFinalVerdict();

        } catch (error) {
            console.error('❌ Error en prueba de inteligencia:', error);
            this.testResults.error = error.message;
        }
    }

    async executeOfficialServer() {
        console.log('\n🚀 EJECUTANDO EXTENSION-SERVER-OFICIAL.JS');
        console.log('-'.repeat(60));
        console.log('📝 PROMPT DEL USUARIO:');
        console.log(`"${PROMPT_USUARIO_REAL.trim()}"`);
        console.log('-'.repeat(60));

        return new Promise((resolve, reject) => {
            const serverProcess = spawn('node', ['extension-server-OFICIAL.js', PROMPT_USUARIO_REAL.trim()], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let outputData = '';
            let errorData = '';

            serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                outputData += output;
                console.log(output.replace(/\n$/, '')); // Mostrar output en tiempo real
            });

            serverProcess.stderr.on('data', (data) => {
                const error = data.toString();
                errorData += error;
                console.error(error.replace(/\n$/, ''));
            });

            serverProcess.on('close', (code) => {
                console.log(`\n🔚 Servidor terminado con código: ${code}`);
                
                this.testResults.serverResponse = {
                    exitCode: code,
                    stdout: outputData,
                    stderr: errorData,
                    timestamp: new Date()
                };

                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Servidor falló con código ${code}`));
                }
            });

            serverProcess.on('error', (error) => {
                console.error('❌ Error ejecutando servidor:', error);
                reject(error);
            });

            // Timeout de 2 minutos
            setTimeout(() => {
                serverProcess.kill();
                reject(new Error('Timeout: Servidor tomó más de 2 minutos'));
            }, 120000);
        });
    }

    async analyzeServerResponse() {
        console.log('\n🔍 ANALIZANDO RESPUESTA DEL SERVIDOR');
        console.log('-'.repeat(60));

        const response = this.testResults.serverResponse;
        if (!response) {
            console.log('❌ No hay respuesta del servidor para analizar');
            return;
        }

        // Buscar workflow generado en archivos
        const workflowFile = this.findGeneratedWorkflow();
        
        let workflow = null;
        if (workflowFile) {
            try {
                const workflowContent = fs.readFileSync(workflowFile, 'utf8');
                workflow = JSON.parse(workflowContent);
                console.log(`✅ Workflow encontrado: ${workflowFile}`);
            } catch (error) {
                console.log(`⚠️ Error leyendo workflow: ${error.message}`);
            }
        }

        // Analizar output del servidor
        const analysis = {
            workflowGenerated: !!workflow,
            nodeCount: workflow ? workflow.nodes.length : 0,
            hasConnections: workflow ? Object.keys(workflow.connections || {}).length > 0 : false,
            agentsUsed: this.detectUsedAgents(response.stdout),
            processingTime: this.extractProcessingTime(response.stdout),
            errorHandling: this.checkErrorHandling(response.stdout, response.stderr),
            intelligentFeatures: this.detectIntelligentFeatures(response.stdout),
            workflowComplexity: workflow ? this.analyzeWorkflowComplexity(workflow) : null
        };

        this.testResults.analysisResults = analysis;
        this.testResults.generatedWorkflow = workflow;

        // Mostrar análisis
        console.log('📊 RESULTADOS DEL ANÁLISIS:');
        console.log(`   🔧 Workflow generado: ${analysis.workflowGenerated ? '✅' : '❌'}`);
        console.log(`   📈 Cantidad de nodos: ${analysis.nodeCount}`);
        console.log(`   🔗 Tiene conexiones: ${analysis.hasConnections ? '✅' : '❌'}`);
        console.log(`   🤖 Agentes utilizados: ${analysis.agentsUsed.length}`);
        console.log(`   ⏱️ Tiempo de procesamiento: ${analysis.processingTime}ms`);
        console.log(`   🛡️ Manejo de errores: ${analysis.errorHandling ? '✅' : '❌'}`);
        console.log(`   🧠 Características inteligentes: ${analysis.intelligentFeatures.length}`);
        
        if (analysis.agentsUsed.length > 0) {
            console.log('   📋 Agentes detectados:');
            analysis.agentsUsed.forEach(agent => {
                console.log(`     - ${agent}`);
            });
        }

        if (analysis.intelligentFeatures.length > 0) {
            console.log('   🧠 Características inteligentes detectadas:');
            analysis.intelligentFeatures.forEach(feature => {
                console.log(`     - ${feature}`);
            });
        }
    }

    findGeneratedWorkflow() {
        // Buscar archivos JSON recientes que podrían ser workflows
        const files = fs.readdirSync(__dirname);
        const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('test-results'));
        
        // Ordenar por fecha de modificación
        const sortedFiles = jsonFiles
            .map(f => ({
                name: f,
                path: path.join(__dirname, f),
                mtime: fs.statSync(path.join(__dirname, f)).mtime
            }))
            .sort((a, b) => b.mtime - a.mtime);

        // Buscar el archivo JSON más reciente que parece ser un workflow
        for (const file of sortedFiles) {
            try {
                const content = fs.readFileSync(file.path, 'utf8');
                const data = JSON.parse(content);
                
                // Verificar si parece un workflow de n8n
                if (data.nodes && Array.isArray(data.nodes) && data.connections) {
                    return file.path;
                }
            } catch (error) {
                // Ignorar archivos que no son JSON válidos
            }
        }

        return null;
    }

    detectUsedAgents(stdout) {
        const agents = [];
        const agentPatterns = [
            { pattern: /Ultra.?Intelligent.?Fallback/i, name: 'Ultra-Intelligent Fallback Agent' },
            { pattern: /IntelligentWorkflowAgent/i, name: 'Intelligent Workflow Agent' },
            { pattern: /FlowCoherenceAgent/i, name: 'Flow Coherence Agent' },
            { pattern: /IntelligentPositioning/i, name: 'Intelligent Positioning Agent' },
            { pattern: /JSONRepairAgent/i, name: 'JSON Repair Agent' },
            { pattern: /SemanticMemoryAgent/i, name: 'Semantic Memory Agent' },
            { pattern: /AutoCorrector/i, name: 'Auto Corrector Agent' },
            { pattern: /IntelligentNameCorrector/i, name: 'Intelligent Name Corrector' },
            { pattern: /WorkflowValidator/i, name: 'Workflow Validator' },
            { pattern: /EnterpriseAgent/i, name: 'Enterprise Agents V4' },
            { pattern: /Gemini.*enrutador/i, name: 'Gemini Model Router' },
            { pattern: /Análisis semántico/i, name: 'Semantic Analysis' },
            { pattern: /Validación inteligente/i, name: 'Intelligent Validation' }
        ];

        agentPatterns.forEach(({ pattern, name }) => {
            if (pattern.test(stdout)) {
                agents.push(name);
            }
        });

        return [...new Set(agents)]; // Remover duplicados
    }

    extractProcessingTime(stdout) {
        // Buscar patrones de tiempo en el output
        const timePatterns = [
            /(\d+)ms/g,
            /(\d+)\s*milisegundos/g,
            /tiempo.*?(\d+)/gi
        ];

        let totalTime = 0;
        let timeCount = 0;

        timePatterns.forEach(pattern => {
            const matches = stdout.matchAll(pattern);
            for (const match of matches) {
                const time = parseInt(match[1]);
                if (time && time < 60000) { // Ignorar tiempos muy grandes (probablemente timestamps)
                    totalTime += time;
                    timeCount++;
                }
            }
        });

        return timeCount > 0 ? Math.round(totalTime / timeCount) : 0;
    }

    checkErrorHandling(stdout, stderr) {
        // Verificar si hay manejo inteligente de errores
        const errorHandlingPatterns = [
            /fallback/i,
            /recuper/i,
            /error.*manej/i,
            /intenta.*nuevamente/i,
            /corrección automática/i
        ];

        return errorHandlingPatterns.some(pattern => 
            pattern.test(stdout) || pattern.test(stderr)
        );
    }

    detectIntelligentFeatures(stdout) {
        const features = [];
        const featurePatterns = [
            { pattern: /análisis semántico/i, name: 'Análisis Semántico Profundo' },
            { pattern: /detección.*dominio/i, name: 'Detección de Dominio Empresarial' },
            { pattern: /validación.*trigger/i, name: 'Validación de Triggers' },
            { pattern: /conexiones.*circular/i, name: 'Detección Conexiones Circulares' },
            { pattern: /posicionamiento.*inteligente/i, name: 'Posicionamiento Inteligente' },
            { pattern: /corrección automática/i, name: 'Corrección Automática' },
            { pattern: /optimización/i, name: 'Optimización de Workflow' },
            { pattern: /enriquecimiento/i, name: 'Enriquecimiento de Datos' },
            { pattern: /segmentación/i, name: 'Segmentación Inteligente' },
            { pattern: /personalización/i, name: 'Personalización Automática' },
            { pattern: /hubspot|salesforce|crm/i, name: 'Integración CRM Inteligente' },
            { pattern: /slack.*notif/i, name: 'Notificaciones Inteligentes' },
            { pattern: /sentiment|sentimiento/i, name: 'Análisis de Sentimientos' },
            { pattern: /follow.?up|seguimiento/i, name: 'Seguimiento Automatizado' },
            { pattern: /remarketing/i, name: 'Remarketing Automático' }
        ];

        featurePatterns.forEach(({ pattern, name }) => {
            if (pattern.test(stdout)) {
                features.push(name);
            }
        });

        return [...new Set(features)];
    }

    analyzeWorkflowComplexity(workflow) {
        if (!workflow || !workflow.nodes) return null;

        const analysis = {
            nodeCount: workflow.nodes.length,
            nodeTypes: [...new Set(workflow.nodes.map(n => n.type))].length,
            hasIntegrations: workflow.nodes.some(n => 
                n.type.includes('hubspot') || 
                n.type.includes('salesforce') || 
                n.type.includes('slack')
            ),
            hasAINodes: workflow.nodes.some(n => 
                n.type.includes('openAi') || 
                n.type.includes('anthropic') || 
                n.type.includes('googleGemini')
            ),
            hasConditionalLogic: workflow.nodes.some(n => n.type.includes('if')),
            hasEmailAutomation: workflow.nodes.some(n => n.type.includes('emailSend')),
            hasWebhooks: workflow.nodes.some(n => n.type.includes('webhook')),
            hasScheduling: workflow.nodes.some(n => 
                n.type.includes('cron') || n.type.includes('schedule')
            ),
            connectionComplexity: Object.keys(workflow.connections || {}).length,
            estimatedBusinessValue: 'high' // Basado en características detectadas
        };

        return analysis;
    }

    async evaluateIntelligenceLevel() {
        console.log('\n🧠 EVALUANDO NIVEL DE INTELIGENCIA DEL SISTEMA');
        console.log('-'.repeat(60));

        const analysis = this.testResults.analysisResults;
        const workflow = this.testResults.generatedWorkflow;

        let intelligenceScore = 0;
        const maxScore = 100;

        // Criterios de evaluación de inteligencia
        const criteria = [
            {
                name: 'Generación de Workflow',
                weight: 20,
                score: analysis.workflowGenerated ? 100 : 0
            },
            {
                name: 'Complejidad Apropiada (24+ nodos)',
                weight: 20,
                score: analysis.nodeCount >= 24 ? 100 : (analysis.nodeCount / 24) * 100
            },
            {
                name: 'Uso de Agentes Inteligentes',
                weight: 15,
                score: Math.min(100, (analysis.agentsUsed.length / 5) * 100)
            },
            {
                name: 'Características Inteligentes',
                weight: 15,
                score: Math.min(100, (analysis.intelligentFeatures.length / 8) * 100)
            },
            {
                name: 'Comprensión del Prompt',
                weight: 10,
                score: this.evaluatePromptUnderstanding()
            },
            {
                name: 'Integración Empresarial',
                weight: 10,
                score: workflow?.complexity?.hasIntegrations ? 100 : 0
            },
            {
                name: 'Manejo de Errores',
                weight: 5,
                score: analysis.errorHandling ? 100 : 0
            },
            {
                name: 'Tiempo de Respuesta',
                weight: 5,
                score: analysis.processingTime < 30000 ? 100 : Math.max(0, 100 - (analysis.processingTime / 1000))
            }
        ];

        console.log('📊 EVALUACIÓN POR CRITERIOS:');
        criteria.forEach(criterion => {
            const weightedScore = (criterion.score * criterion.weight) / 100;
            intelligenceScore += weightedScore;
            
            console.log(`   ${criterion.name}: ${criterion.score.toFixed(1)}% (peso: ${criterion.weight}%) = ${weightedScore.toFixed(1)} pts`);
        });

        this.testResults.intelligenceMetrics = {
            totalScore: intelligenceScore,
            criteria: criteria,
            level: this.determineIntelligenceLevel(intelligenceScore)
        };

        console.log(`\n🎯 PUNTUACIÓN TOTAL: ${intelligenceScore.toFixed(1)}/${maxScore}`);
        console.log(`🏆 NIVEL DE INTELIGENCIA: ${this.testResults.intelligenceMetrics.level}`);
    }

    evaluatePromptUnderstanding() {
        const analysis = this.testResults.analysisResults;
        const requiredElements = [
            'formulario web', 'validación', 'enriquecimiento', 'linkedin',
            'hubspot', 'crm', 'email', 'personalizado', 'seguimiento',
            'slack', 'notificación', 'reporte', 'lead frío', 'remarketing',
            'sentimiento', 'calendario'
        ];

        const detectedElements = requiredElements.filter(element => {
            const stdout = this.testResults.serverResponse?.stdout || '';
            return new RegExp(element, 'i').test(stdout);
        });

        return (detectedElements.length / requiredElements.length) * 100;
    }

    determineIntelligenceLevel(score) {
        if (score >= 90) return 'ULTRA-INTELIGENTE (Nivel Genius)';
        if (score >= 80) return 'ALTAMENTE INTELIGENTE (Nivel Experto)';
        if (score >= 70) return 'INTELIGENTE (Nivel Profesional)';
        if (score >= 60) return 'COMPETENTE (Nivel Intermedio)';
        if (score >= 40) return 'BÁSICO (Nivel Principiante)';
        return 'LIMITADO (Requiere Mejoras)';
    }

    async generateFinalVerdict() {
        console.log('\n🏆 VEREDICTO FINAL - INTELIGENCIA DEL SISTEMA');
        console.log('='.repeat(80));

        const metrics = this.testResults.intelligenceMetrics;
        const analysis = this.testResults.analysisResults;

        // Generar veredicto final
        let verdict = '';
        const score = metrics.totalScore;

        if (score >= 85) {
            verdict = '🎉 SISTEMA ULTRA-INTELIGENTE - SUPERA EXPECTATIVAS';
        } else if (score >= 75) {
            verdict = '👍 SISTEMA ALTAMENTE INTELIGENTE - RENDIMIENTO EXCELENTE';
        } else if (score >= 65) {
            verdict = '✅ SISTEMA INTELIGENTE - RENDIMIENTO SÓLIDO';
        } else if (score >= 50) {
            verdict = '⚠️ SISTEMA COMPETENTE - REQUIERE OPTIMIZACIONES';
        } else {
            verdict = '❌ SISTEMA BÁSICO - NECESITA MEJORAS SIGNIFICATIVAS';
        }

        console.log(`📊 PUNTUACIÓN FINAL: ${score.toFixed(1)}/100`);
        console.log(`🎭 PROMPT PROCESADO: Usuario de consultoría marketing digital`);
        console.log(`🔢 NODOS GENERADOS: ${analysis.nodeCount} (Meta: 24+)`);
        console.log(`🤖 AGENTES UTILIZADOS: ${analysis.agentsUsed.length}`);
        console.log(`🧠 CARACTERÍSTICAS INTELIGENTES: ${analysis.intelligentFeatures.length}`);
        console.log(`⏱️ TIEMPO DE PROCESAMIENTO: ${analysis.processingTime}ms`);
        console.log('='.repeat(80));
        console.log(`🏆 VEREDICTO: ${verdict}`);
        console.log('='.repeat(80));

        this.testResults.finalVerdict = verdict;
        this.testResults.endTime = new Date();

        // Guardar reporte detallado
        await this.saveDetailedReport();

        // Mostrar recomendaciones
        this.showRecommendations();
    }

    async saveDetailedReport() {
        const report = {
            testInfo: {
                timestamp: this.testResults.startTime.toISOString(),
                duration: this.testResults.endTime - this.testResults.startTime,
                prompt: this.testResults.prompt.substring(0, 200) + '...'
            },
            results: {
                finalScore: this.testResults.intelligenceMetrics.totalScore,
                intelligenceLevel: this.testResults.intelligenceMetrics.level,
                verdict: this.testResults.finalVerdict,
                nodeCount: this.testResults.analysisResults.nodeCount,
                agentsUsed: this.testResults.analysisResults.agentsUsed,
                intelligentFeatures: this.testResults.analysisResults.intelligentFeatures
            },
            detailedAnalysis: this.testResults.analysisResults,
            workflowGenerated: !!this.testResults.generatedWorkflow,
            recommendations: this.generateRecommendations()
        };

        const reportPath = path.join(__dirname, 'PRUEBA_INTELIGENCIA_SERVER_OFICIAL.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`\n💾 Reporte detallado guardado: ${reportPath}`);
    }

    generateRecommendations() {
        const analysis = this.testResults.analysisResults;
        const score = this.testResults.intelligenceMetrics.totalScore;
        const recommendations = [];

        if (analysis.nodeCount < 24) {
            recommendations.push('Mejorar la generación de workflows complejos para alcanzar 24+ nodos');
        }

        if (analysis.agentsUsed.length < 3) {
            recommendations.push('Integrar más agentes inteligentes en el procesamiento');
        }

        if (analysis.intelligentFeatures.length < 6) {
            recommendations.push('Implementar más características de inteligencia artificial');
        }

        if (analysis.processingTime > 30000) {
            recommendations.push('Optimizar tiempo de respuesta del sistema');
        }

        if (!analysis.errorHandling) {
            recommendations.push('Mejorar el manejo inteligente de errores');
        }

        if (score < 80) {
            recommendations.push('Entrenar el sistema con más casos de uso empresariales complejos');
        }

        return recommendations;
    }

    showRecommendations() {
        const recommendations = this.generateRecommendations();
        
        if (recommendations.length > 0) {
            console.log('\n📋 RECOMENDACIONES PARA MEJORA:');
            recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
        } else {
            console.log('\n🎉 ¡SISTEMA FUNCIONANDO ÓPTIMAMENTE!');
            console.log('   No se requieren mejoras inmediatas.');
        }

        console.log('\n🚀 CAPACIDADES DEMOSTRADAS:');
        this.testResults.analysisResults.intelligentFeatures.forEach(feature => {
            console.log(`   ✅ ${feature}`);
        });
    }
}

// Ejecutar la prueba de inteligencia
const intelligenceTest = new IntelligenceTestRunner();
intelligenceTest.runIntelligenceTest().catch(console.error);

export default IntelligenceTestRunner;
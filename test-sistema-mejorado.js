/**
 * TEST DEL SISTEMA ULTRA INTELIGENTE MEJORADO
 * 
 * Este test verifica las mejoras implementadas para solucionar los 14 errores críticos
 * detectados en el análisis de calidad del workflow de marketing.
 * 
 * Errores que debemos haber solucionado:
 * 1. Conexiones circulares
 * 2. Triggers como nodos intermedios
 * 3. Ausencia de validación de IA
 * 4. Integración CRM faltante
 * 5. Arquitectura incorrecta
 * 6. Manejo de errores inadecuado
 * 7. Routing condicional básico
 * 8. Validación de datos insuficiente
 * 9. Templates genéricos (no específicos del dominio)
 * 10. Conexiones problemáticas
 * 11. Nodos huérfanos
 * 12. Parámetros mal configurados
 * 13. Flujo lógico incoherente
 * 14. Carencia de inteligencia contextual
 */

import UltraIntelligentFallbackAgent from './ultra-intelligent-fallback-agent-v2.js';

class SystemTestRunner {
    constructor() {
        this.agent = new UltraIntelligentFallbackAgent();
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
    }

    /**
     * EJECUTAR TODOS LOS TESTS
     */
    async runAllTests() {
        console.log('🧪 INICIANDO TESTS DEL SISTEMA ULTRA INTELIGENTE MEJORADO');
        console.log('=' .repeat(80));

        await this.testComplexCRMWorkflow();
        await this.testEcommerceWorkflow();
        await this.testMarketingAutomationWorkflow();
        await this.testSupportTicketWorkflow();
        await this.testArchitecturalValidation();
        await this.testAINodeGeneration();
        await this.testConnectionValidation();
        await this.testDomainSpecificTemplates();

        this.printFinalResults();
    }

    /**
     * TEST 1: WORKFLOW CRM COMPLEJO
     * Debe generar: Triggers, AI Lead Scoring, CRM Integration, Conditional Routing
     */
    async testComplexCRMWorkflow() {
        console.log('\n🏢 TEST 1: WORKFLOW CRM COMPLEJO');
        console.log('-'.repeat(50));

        const prompt = `
        Crear un sistema automatizado de gestión de leads que:
        - Capture leads desde formularios web y LinkedIn
        - Use IA para scoring y calificación automática de leads
        - Integre con Salesforce CRM para crear/actualizar contactos
        - Implemente routing inteligente: Hot leads (80+) a ventas inmediato, 
          Warm leads (50-79) a secuencia de nurturing, Cold leads (20-49) a marketing
        - Envíe notificaciones personalizadas a Slack y email
        - Incluya validación de datos y manejo de errores robusto
        - Genere reportes automáticos de performance
        `;

        try {
            const workflow = await this.agent.generateUltraIntelligentWorkflow(prompt);
            
            const validationResults = [
                this.validateHasProperTriggers(workflow, 'CRM'),
                this.validateHasAINodes(workflow, ['lead-validation', 'lead-scoring']),
                this.validateHasCRMIntegration(workflow),
                this.validateHasConditionalRouting(workflow, 'lead'),
                this.validateHasErrorHandling(workflow),
                this.validateConnectionsAreValid(workflow),
                this.validateArchitecturalCompliance(workflow, 'crm')
            ];

            const passedValidations = validationResults.filter(v => v.passed).length;
            const totalValidations = validationResults.length;

            this.recordTestResult('Complex CRM Workflow', passedValidations === totalValidations, {
                passed: passedValidations,
                total: totalValidations,
                details: validationResults,
                workflowStats: {
                    nodes: workflow.nodes?.length || 0,
                    connections: Object.keys(workflow.connections || {}).length,
                    qualityScore: workflow.metadata?.qualityScore || 0
                }
            });

        } catch (error) {
            this.recordTestResult('Complex CRM Workflow', false, { error: error.message });
        }
    }

    /**
     * TEST 2: WORKFLOW ECOMMERCE
     */
    async testEcommerceWorkflow() {
        console.log('\n🛒 TEST 2: WORKFLOW ECOMMERCE AVANZADO');
        console.log('-'.repeat(50));

        const prompt = `
        Automatizar procesamiento de pedidos e-commerce:
        - Webhook para nuevos pedidos desde Shopify
        - Validación automática de datos del pedido y cliente
        - IA para detección de fraude y categorización de riesgo
        - Integración con Stripe para verificación de pagos
        - Routing inteligente: Pedidos VIP (1000+) procesamiento prioritario,
          Pedidos estándar (100-999) flujo normal, Pedidos pequeños (<100) procesamiento rápido
        - Actualización automática de inventario en Airtable
        - Notificaciones a cliente por email y SMS
        - Dashboard analytics en tiempo real
        `;

        try {
            const workflow = await this.agent.generateUltraIntelligentWorkflow(prompt);
            
            const validationResults = [
                this.validateHasProperTriggers(workflow, 'ecommerce'),
                this.validateHasAINodes(workflow, ['fraud-detection', 'classification']),
                this.validateHasPaymentIntegration(workflow),
                this.validateHasConditionalRouting(workflow, 'order'),
                this.validateHasInventoryManagement(workflow),
                this.validateConnectionsAreValid(workflow),
                this.validateArchitecturalCompliance(workflow, 'ecommerce')
            ];

            const passedValidations = validationResults.filter(v => v.passed).length;
            this.recordTestResult('Ecommerce Workflow', passedValidations === validationResults.length, {
                passed: passedValidations,
                total: validationResults.length,
                details: validationResults
            });

        } catch (error) {
            this.recordTestResult('Ecommerce Workflow', false, { error: error.message });
        }
    }

    /**
     * TEST 3: MARKETING AUTOMATION
     */
    async testMarketingAutomationWorkflow() {
        console.log('\n📧 TEST 3: MARKETING AUTOMATION INTELIGENTE');
        console.log('-'.repeat(50));

        const prompt = `
        Sistema de marketing automation con IA:
        - Triggers múltiples: nuevos suscriptores, comportamiento web, email opens
        - IA para análisis de sentimiento y personalización de contenido
        - Segmentación inteligente basada en comportamiento
        - Integración con Mailchimp y HubSpot
        - A/B testing automático de subject lines
        - Scheduling inteligente basado en zona horaria del usuario
        - Attribution tracking y ROI analysis
        - Compliance con GDPR y CAN-SPAM
        `;

        try {
            const workflow = await this.agent.generateUltraIntelligentWorkflow(prompt);
            
            const validationResults = [
                this.validateHasProperTriggers(workflow, 'marketing'),
                this.validateHasAINodes(workflow, ['sentiment', 'personalization']),
                this.validateHasMarketingIntegrations(workflow),
                this.validateHasSegmentation(workflow),
                this.validateConnectionsAreValid(workflow),
                this.validateArchitecturalCompliance(workflow, 'marketing')
            ];

            const passedValidations = validationResults.filter(v => v.passed).length;
            this.recordTestResult('Marketing Automation', passedValidations === validationResults.length, {
                passed: passedValidations,
                total: validationResults.length,
                details: validationResults
            });

        } catch (error) {
            this.recordTestResult('Marketing Automation', false, { error: error.message });
        }
    }

    /**
     * TEST 4: SUPPORT TICKET SYSTEM
     */
    async testSupportTicketWorkflow() {
        console.log('\n🎫 TEST 4: SISTEMA DE TICKETS DE SOPORTE');
        console.log('-'.repeat(50));

        const prompt = `
        Automatizar sistema de tickets de soporte:
        - Recepción de tickets vía email, chat, formulario web
        - IA para clasificación automática de prioridad y categoría
        - Routing inteligente por expertise del agente
        - Integración con Zendesk y Slack
        - Auto-respuestas inteligentes para consultas comunes
        - SLA tracking y escalamiento automático
        - Knowledge base search con IA
        - Customer satisfaction surveys automáticos
        `;

        try {
            const workflow = await this.agent.generateUltraIntelligentWorkflow(prompt);
            
            const validationResults = [
                this.validateHasProperTriggers(workflow, 'support'),
                this.validateHasAINodes(workflow, ['classification', 'auto-response']),
                this.validateHasSupportIntegrations(workflow),
                this.validateHasConditionalRouting(workflow, 'ticket'),
                this.validateConnectionsAreValid(workflow),
                this.validateArchitecturalCompliance(workflow, 'support')
            ];

            const passedValidations = validationResults.filter(v => v.passed).length;
            this.recordTestResult('Support Ticket System', passedValidations === validationResults.length, {
                passed: passedValidations,
                total: validationResults.length,
                details: validationResults
            });

        } catch (error) {
            this.recordTestResult('Support Ticket System', false, { error: error.message });
        }
    }

    /**
     * TEST 5: VALIDACIÓN ARQUITECTURAL
     */
    async testArchitecturalValidation() {
        console.log('\n🏗️ TEST 5: VALIDACIÓN ARQUITECTURAL AVANZADA');
        console.log('-'.repeat(50));

        // Test con un prompt que históricamente generaba errores arquitecturales
        const problematicPrompt = `
        Crear workflow que procese leads, use IA, integre CRM, tenga routing condicional,
        maneje errores, valide datos, envíe notificaciones y genere reportes.
        `;

        try {
            const workflow = await this.agent.generateUltraIntelligentWorkflow(problematicPrompt);
            
            // Ejecutar la validación arquitectural profunda
            const validation = await this.agent.performDeepWorkflowValidation(workflow, {
                businessDomain: 'crm',
                aiNodesNeeded: ['lead-validation'],
                requiredIntegrations: ['salesforce'],
                processFlows: ['conditional']
            });

            const architecturalTests = [
                { name: 'No Circular Connections', passed: !this.hasCircularConnections(workflow) },
                { name: 'Proper Trigger Usage', passed: this.hasValidTriggerUsage(workflow) },
                { name: 'Quality Score > 70', passed: validation.qualityScore > 70 },
                { name: 'No Critical Errors', passed: validation.errors.length === 0 },
                { name: 'Compliance Status OK', passed: validation.complianceStatus !== 'critical-issues' },
                { name: 'Has Required Components', passed: this.hasRequiredComponents(workflow) }
            ];

            const passedTests = architecturalTests.filter(t => t.passed).length;
            this.recordTestResult('Architectural Validation', passedTests === architecturalTests.length, {
                passed: passedTests,
                total: architecturalTests.length,
                details: architecturalTests,
                validationScore: validation.qualityScore,
                errors: validation.errors.length,
                warnings: validation.warnings.length
            });

        } catch (error) {
            this.recordTestResult('Architectural Validation', false, { error: error.message });
        }
    }

    /**
     * MÉTODOS DE VALIDACIÓN ESPECÍFICA
     */
    validateHasProperTriggers(workflow, domain) {
        const triggers = workflow.nodes?.filter(n => this.isTriggerNode(n)) || [];
        const hasProperTriggers = triggers.length > 0 && triggers.length <= 3; // No demasiados triggers
        
        return {
            name: 'Proper Triggers',
            passed: hasProperTriggers,
            details: `Found ${triggers.length} triggers for ${domain} domain`
        };
    }

    validateHasAINodes(workflow, expectedAITypes) {
        const aiNodes = workflow.nodes?.filter(n => this.isAINode(n)) || [];
        const hasRequiredAI = expectedAITypes.some(type => 
            aiNodes.some(node => node.name.toLowerCase().includes(type.replace('-', '')))
        );

        return {
            name: 'AI Nodes Present',
            passed: hasRequiredAI,
            details: `Found ${aiNodes.length} AI nodes, expected types: ${expectedAITypes.join(', ')}`
        };
    }

    validateHasCRMIntegration(workflow) {
        const hasCRM = workflow.nodes?.some(n => 
            n.type?.includes('salesforce') || 
            n.type?.includes('hubspot') ||
            n.name?.toLowerCase().includes('crm')
        ) || false;

        return {
            name: 'CRM Integration',
            passed: hasCRM,
            details: hasCRM ? 'CRM integration found' : 'No CRM integration detected'
        };
    }

    validateHasConditionalRouting(workflow, routingType) {
        const hasRouting = workflow.nodes?.some(n => 
            n.type?.includes('switch') || 
            n.type?.includes('if') ||
            n.name?.toLowerCase().includes('routing') ||
            n.name?.toLowerCase().includes(routingType)
        ) || false;

        return {
            name: 'Conditional Routing',
            passed: hasRouting,
            details: `${routingType} routing: ${hasRouting ? 'Present' : 'Missing'}`
        };
    }

    validateConnectionsAreValid(workflow) {
        // Validar que no hay conexiones circulares ni problemáticas
        const hasValidConnections = !this.hasCircularConnections(workflow) && 
                                   !this.hasOrphanNodes(workflow);

        return {
            name: 'Valid Connections',
            passed: hasValidConnections,
            details: hasValidConnections ? 'All connections valid' : 'Connection issues detected'
        };
    }

    validateArchitecturalCompliance(workflow, domain) {
        const nodeCount = workflow.nodes?.length || 0;
        const hasMetadata = !!workflow.metadata;
        const hasQualityScore = (workflow.metadata?.qualityScore || 0) > 60;

        const isCompliant = nodeCount > 3 && hasMetadata && hasQualityScore;

        return {
            name: `${domain.toUpperCase()} Architecture Compliance`,
            passed: isCompliant,
            details: `Nodes: ${nodeCount}, Metadata: ${hasMetadata}, Quality: ${workflow.metadata?.qualityScore || 0}`
        };
    }

    /**
     * MÉTODOS AUXILIARES
     */
    isTriggerNode(node) {
        const triggerTypes = ['webhook', 'cron', 'start', 'trigger', 'manual'];
        return triggerTypes.some(type => node.type?.includes(type));
    }

    isAINode(node) {
        const aiTypes = ['openai', 'anthropic', 'gemini', 'ai', 'gpt'];
        return aiTypes.some(type => node.type?.includes(type) || node.name?.toLowerCase().includes(type));
    }

    hasCircularConnections(workflow) {
        // Implementación básica de detección de ciclos
        const connections = workflow.connections || {};
        const visited = new Set();
        const recursionStack = new Set();

        const hasCycle = (nodeId) => {
            if (recursionStack.has(nodeId)) return true;
            if (visited.has(nodeId)) return false;

            visited.add(nodeId);
            recursionStack.add(nodeId);

            const nodeConnections = connections[nodeId];
            if (nodeConnections?.main) {
                for (const outputArray of nodeConnections.main) {
                    if (Array.isArray(outputArray)) {
                        for (const connection of outputArray) {
                            if (hasCycle(connection.node)) return true;
                        }
                    }
                }
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const nodeId of Object.keys(connections)) {
            if (hasCycle(nodeId)) return true;
        }
        return false;
    }

    hasOrphanNodes(workflow) {
        const nodes = workflow.nodes || [];
        const connections = workflow.connections || {};
        
        // Nodos que no tienen conexiones de entrada ni salida
        const orphans = nodes.filter(node => {
            const hasOutput = connections[node.id]?.main?.length > 0;
            const hasInput = Object.values(connections).some(conn => 
                conn.main?.some(outputs => 
                    outputs.some(output => output.node === node.id)
                )
            );
            return !hasOutput && !hasInput && !this.isTriggerNode(node);
        });

        return orphans.length > 0;
    }

    // Agregar más métodos de validación...
    validateHasPaymentIntegration(workflow) {
        const hasPayment = workflow.nodes?.some(n => 
            n.type?.includes('stripe') || 
            n.type?.includes('paypal') ||
            n.name?.toLowerCase().includes('payment')
        ) || false;

        return {
            name: 'Payment Integration',
            passed: hasPayment,
            details: hasPayment ? 'Payment integration found' : 'No payment integration'
        };
    }

    validateHasErrorHandling(workflow) {
        const hasErrorHandling = workflow.nodes?.some(n => 
            n.type?.includes('error') || 
            n.name?.toLowerCase().includes('error') ||
            n.name?.toLowerCase().includes('try') ||
            n.name?.toLowerCase().includes('catch')
        ) || false;

        return {
            name: 'Error Handling',
            passed: hasErrorHandling,
            details: hasErrorHandling ? 'Error handling present' : 'No error handling detected'
        };
    }

    // Métodos adicionales...
    recordTestResult(testName, passed, details = {}) {
        this.testResults.total++;
        if (passed) {
            this.testResults.passed++;
            console.log(`   ✅ ${testName}: PASSED`);
        } else {
            this.testResults.failed++;
            console.log(`   ❌ ${testName}: FAILED`);
        }

        if (details.details) {
            details.details.forEach(detail => {
                const status = detail.passed ? '✅' : '❌';
                console.log(`      ${status} ${detail.name}: ${detail.details || ''}`);
            });
        }

        this.testResults.details.push({
            name: testName,
            passed,
            details
        });
    }

    printFinalResults() {
        console.log('\n' + '='.repeat(80));
        console.log('🧪 RESULTADOS FINALES DEL TESTING');
        console.log('='.repeat(80));
        
        const passRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
        
        console.log(`📊 Tests ejecutados: ${this.testResults.total}`);
        console.log(`✅ Tests aprobados: ${this.testResults.passed}`);
        console.log(`❌ Tests fallidos: ${this.testResults.failed}`);
        console.log(`📈 Porcentaje de éxito: ${passRate}%`);
        
        if (passRate >= 80) {
            console.log('\n🎉 ¡EXCELENTE! El sistema ha superado las pruebas de calidad');
            console.log('   Las mejoras implementadas han solucionado los problemas detectados');
        } else if (passRate >= 60) {
            console.log('\n⚠️ ACEPTABLE - El sistema ha mejorado pero necesita ajustes adicionales');
        } else {
            console.log('\n❌ INSUFICIENTE - Se requieren más mejoras para alcanzar la calidad esperada');
        }

        console.log('\n📋 ANÁLISIS POR CATEGORÍA:');
        this.testResults.details.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`   ${status} ${result.name}`);
            if (result.details.workflowStats) {
                console.log(`      📊 Nodos: ${result.details.workflowStats.nodes}, Conexiones: ${result.details.workflowStats.connections}`);
                console.log(`      🎯 Quality Score: ${result.details.workflowStats.qualityScore}/100`);
            }
        });
    }
}

// EJECUTAR LOS TESTS
async function runTests() {
    const testRunner = new SystemTestRunner();
    await testRunner.runAllTests();
}

// Exportar para uso en otros módulos o ejecutar directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export default SystemTestRunner;
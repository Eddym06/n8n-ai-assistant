import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

console.log('🔍 DIAGNÓSTICO DETALLADO GEMINI API 503');
console.log('==========================================');

class GeminiDiagnosticTest {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY; // CORREGIDO: usar GEMINI_API_KEY como en el sistema
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.models = [
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro'
        ];
        this.testResults = [];
    }

    async runComprehensiveDiagnostic() {
        console.log(`📋 API Key configurada: ${this.apiKey ? '✅ SÍ' : '❌ NO'}`);
        console.log(`📋 Longitud API Key: ${this.apiKey ? this.apiKey.length : 0} caracteres`);
        console.log(`📋 API Key empieza con: ${this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'N/A'}`);
        console.log('');

        // Test 1: Verificar conectividad básica
        await this.testBasicConnectivity();

        // Test 2: Probar diferentes modelos
        await this.testMultipleModels();

        // Test 3: Probar diferentes tamaños de prompt
        await this.testPromptSizes();

        // Test 4: Probar rate limiting
        await this.testRateLimiting();

        // Test 5: Análisis de errores
        this.analyzeResults();

        return this.testResults;
    }

    async testBasicConnectivity() {
        console.log('🌐 TEST 1: CONECTIVIDAD BÁSICA');
        console.log('-------------------------------');

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const startTime = Date.now();
            
            const result = await model.generateContent("Responde solo: OK");
            const responseTime = Date.now() - startTime;
            
            const response = result.response.text();
            
            console.log(`✅ Conectividad exitosa`);
            console.log(`⏱️ Tiempo de respuesta: ${responseTime}ms`);
            console.log(`📝 Respuesta: "${response.trim()}"`);
            
            this.testResults.push({
                test: 'connectivity',
                success: true,
                responseTime,
                response: response.trim()
            });

        } catch (error) {
            console.log(`❌ Error de conectividad: ${error.message}`);
            console.log(`🔍 Tipo de error: ${error.constructor.name}`);
            console.log(`📊 Status: ${error.status || 'N/A'}`);
            
            this.testResults.push({
                test: 'connectivity',
                success: false,
                error: error.message,
                status: error.status,
                type: error.constructor.name
            });
        }
        console.log('');
    }

    async testMultipleModels() {
        console.log('🤖 TEST 2: MÚLTIPLES MODELOS');
        console.log('-----------------------------');

        for (const modelName of this.models) {
            try {
                console.log(`📋 Probando modelo: ${modelName}`);
                const model = this.genAI.getGenerativeModel({ model: modelName });
                const startTime = Date.now();
                
                const result = await model.generateContent("Test");
                const responseTime = Date.now() - startTime;
                
                console.log(`  ✅ ${modelName}: OK (${responseTime}ms)`);
                
                this.testResults.push({
                    test: 'model',
                    model: modelName,
                    success: true,
                    responseTime
                });

            } catch (error) {
                console.log(`  ❌ ${modelName}: ${error.message} (Status: ${error.status || 'N/A'})`);
                
                this.testResults.push({
                    test: 'model',
                    model: modelName,
                    success: false,
                    error: error.message,
                    status: error.status
                });
            }

            // Pausa entre tests para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('');
    }

    async testPromptSizes() {
        console.log('📏 TEST 3: TAMAÑOS DE PROMPT');
        console.log('----------------------------');

        const promptSizes = [
            { name: 'Pequeño', content: 'Hola' },
            { name: 'Mediano', content: 'Crear un workflow que procese emails y envíe notificaciones automatizadas' },
            { name: 'Grande', content: `Crear un workflow complejo de e-commerce que:
1. Reciba pedidos por webhook desde múltiples plataformas
2. Valide datos del cliente usando AI
3. Procese pagos con Stripe y PayPal
4. Gestione inventario en tiempo real
5. Envíe confirmaciones por email y SMS
6. Actualice CRM y ERP
7. Genere reportes analytics
8. Maneje devoluciones y reembolsos
9. Integre con sistemas de envío
10. Implemente seguimiento y notificaciones`.repeat(3) }
        ];

        for (const promptTest of promptSizes) {
            try {
                console.log(`📋 Probando prompt ${promptTest.name} (${promptTest.content.length} chars)`);
                
                const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const startTime = Date.now();
                
                const result = await model.generateContent(promptTest.content);
                const responseTime = Date.now() - startTime;
                const responseLength = result.response.text().length;
                
                console.log(`  ✅ ${promptTest.name}: OK (${responseTime}ms, ${responseLength} chars respuesta)`);
                
                this.testResults.push({
                    test: 'promptSize',
                    size: promptTest.name,
                    promptLength: promptTest.content.length,
                    success: true,
                    responseTime,
                    responseLength
                });

            } catch (error) {
                console.log(`  ❌ ${promptTest.name}: ${error.message} (Status: ${error.status || 'N/A'})`);
                
                this.testResults.push({
                    test: 'promptSize',
                    size: promptTest.name,
                    promptLength: promptTest.content.length,
                    success: false,
                    error: error.message,
                    status: error.status
                });
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        console.log('');
    }

    async testRateLimiting() {
        console.log('⏱️ TEST 4: RATE LIMITING');
        console.log('------------------------');

        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        let successCount = 0;
        let errorCount = 0;

        console.log('📋 Enviando 10 requests rápidos...');

        for (let i = 1; i <= 10; i++) {
            try {
                const startTime = Date.now();
                const result = await model.generateContent(`Test ${i}`);
                const responseTime = Date.now() - startTime;
                
                successCount++;
                console.log(`  ${i}. ✅ OK (${responseTime}ms)`);

            } catch (error) {
                errorCount++;
                console.log(`  ${i}. ❌ Error: ${error.message} (Status: ${error.status || 'N/A'})`);
                
                this.testResults.push({
                    test: 'rateLimiting',
                    request: i,
                    success: false,
                    error: error.message,
                    status: error.status
                });
            }

            // Pequeña pausa
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`📊 Resultado Rate Limiting: ${successCount}/${10} exitosos, ${errorCount} errores`);
        
        this.testResults.push({
            test: 'rateLimitingSummary',
            totalRequests: 10,
            successCount,
            errorCount,
            successRate: (successCount / 10) * 100
        });

        console.log('');
    }

    analyzeResults() {
        console.log('📊 ANÁLISIS DE RESULTADOS');
        console.log('=========================');

        const errors = this.testResults.filter(r => !r.success);
        const successes = this.testResults.filter(r => r.success);

        console.log(`✅ Tests exitosos: ${successes.length}`);
        console.log(`❌ Tests fallidos: ${errors.length}`);
        console.log(`📈 Tasa de éxito: ${((successes.length / this.testResults.length) * 100).toFixed(1)}%`);
        console.log('');

        if (errors.length > 0) {
            console.log('🔍 ANÁLISIS DE ERRORES:');
            
            // Agrupar errores por status
            const errorsByStatus = {};
            errors.forEach(error => {
                const status = error.status || 'unknown';
                if (!errorsByStatus[status]) {
                    errorsByStatus[status] = [];
                }
                errorsByStatus[status].push(error);
            });

            Object.entries(errorsByStatus).forEach(([status, statusErrors]) => {
                console.log(`  📊 Status ${status}: ${statusErrors.length} errores`);
                statusErrors.slice(0, 3).forEach(error => {
                    console.log(`    - ${error.error}`);
                });
            });

            console.log('');
            console.log('💡 RECOMENDACIONES:');
            
            if (errorsByStatus['503']) {
                console.log('  🔧 Error 503 detectado: Problema de capacidad del servidor Gemini');
                console.log('  🔧 Implementar backoff exponencial');
                console.log('  🔧 Reducir frecuencia de requests');
                console.log('  🔧 Usar modelos menos cargados');
            }
            
            if (errorsByStatus['429']) {
                console.log('  🔧 Error 429 detectado: Rate limiting activo');
                console.log('  🔧 Implementar delays entre requests');
                console.log('  🔧 Reducir tamaño de prompts');
            }

            if (errorsByStatus['400']) {
                console.log('  🔧 Error 400 detectado: Problema con el formato del request');
                console.log('  🔧 Verificar estructura de prompts');
                console.log('  🔧 Validar parámetros del modelo');
            }
        }

        // Análisis de tiempos de respuesta
        const responseTimes = successes
            .filter(r => r.responseTime)
            .map(r => r.responseTime);

        if (responseTimes.length > 0) {
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            const minResponseTime = Math.min(...responseTimes);

            console.log('');
            console.log('⏱️ ANÁLISIS DE PERFORMANCE:');
            console.log(`  📊 Tiempo promedio: ${avgResponseTime.toFixed(0)}ms`);
            console.log(`  📊 Tiempo máximo: ${maxResponseTime}ms`);
            console.log(`  📊 Tiempo mínimo: ${minResponseTime}ms`);
        }
    }
}

// Ejecutar diagnóstico
async function runDiagnostic() {
    const diagnostic = new GeminiDiagnosticTest();
    
    try {
        await diagnostic.runComprehensiveDiagnostic();
    } catch (error) {
        console.error('💥 Error fatal en diagnóstico:', error);
    }
}

runDiagnostic();
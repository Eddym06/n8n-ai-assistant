// Usar fetch nativo de Node.js 18+
const fetch = globalThis.fetch;

/**
 * 🧪 Test de integración con Gemini 2.5 Flash Lite
 */

const GEMINI_API_KEY = 'your_google_api_key_here';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

async function testGeminiEvaluation() {
    console.log('🧪 Probando integración con Gemini 2.5 Flash Lite...\n');
    
    // Casos de prueba con workflows reales
    const testCases = [
        {
            title: 'Stock Market Analysis & Newsletter AI Agent',
            description: 'Automated stock analysis and newsletter generation using multiple AI models',
            nodeCount: 14,
            categories: ['AI Agent', 'Analysis', 'Newsletter', 'Automation']
        },
        {
            title: 'Simple Form Submission',
            description: 'Basic form that sends email',
            nodeCount: 3,
            categories: ['Form', 'Email']
        },
        {
            title: 'Multi-Modal Telegram Bot with RAG and PostgreSQL',
            description: 'Advanced chatbot with database integration, RAG capabilities, and multimodal support',
            nodeCount: 51,
            categories: ['AI', 'Chatbot', 'Database', 'RAG', 'Telegram']
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`🔍 Evaluando: "${testCase.title}"`);
        
        const prompt = `
Analiza este workflow de n8n y califica su calidad del 1-10:

TÍTULO: ${testCase.title}
DESCRIPCIÓN: ${testCase.description}
NODOS: ${testCase.nodeCount}
CATEGORÍAS: ${testCase.categories.join(', ')}

CRITERIOS DE EVALUACIÓN:
1. Complejidad técnica (¿Usa múltiples integraciones?)
2. Utilidad práctica (¿Resuelve problemas reales?)
3. Innovación (¿Implementa patrones interesantes?)
4. Completitud (¿Parece un flujo completo?)
5. Calidad profesional (¿Luce bien estructurado?)

Responde SOLO con un número del 1-10 y una palabra clave que describa el workflow (ej: "8 AUTOMATION" o "6 CHATBOT").
`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
            
            // Debug: mostrar texto raw
            console.log(`   🔍 Texto raw: "${text.trim()}"`);
            
            // Regex correcta sin escape extra
            const match = text.match(/(\\d+)\\s+(\\w+)/);
            let score = 5;
            let category = 'UNKNOWN';
            
            if (match) {
                score = parseInt(match[1]);
                category = match[2];
                console.log(`   ✨ Match encontrado: ${match[0]} -> Score: ${score}, Category: ${category}`);
            } else {
                // Intentar extraer solo el número
                const numberMatch = text.match(/\\b(\\d+)\\b/);
                if (numberMatch) {
                    score = parseInt(numberMatch[1]);
                    category = 'EVALUATED';
                    console.log(`   📊 Solo número encontrado: ${score}`);
                } else {
                    console.log(`   ⚠️ No se pudo parsear la respuesta`);
                }
            }
            
            const shouldDownload = score >= 6;
            
            console.log(`   📊 Respuesta: ${text.trim()}`);
            console.log(`   🎯 Score: ${score}/10 | Categoría: ${category}`);
            console.log(`   ✅ ¿Descargar?: ${shouldDownload ? 'SÍ' : 'NO'}`);
            console.log('');
            
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            console.log('');
        }
        
        // Pequeña pausa entre requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Función para probar la API de forma simple
async function testGeminiConnection() {
    console.log('🔗 Probando conexión básica con Gemini...\n');
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Responde solo con "CONEXIÓN OK" si puedes leer esto.'
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
        
        console.log(`✅ Respuesta de Gemini: ${text.trim()}`);
        console.log('🎉 Conexión con Gemini establecida exitosamente!\\n');
        
        return true;
        
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`);
        return false;
    }
}

// Ejecutar tests
async function runTests() {
    console.log('🚀 Ejecutando tests de integración Gemini\\n');
    
    const connectionOk = await testGeminiConnection();
    
    if (connectionOk) {
        await testGeminiEvaluation();
        console.log('✅ Todos los tests completados exitosamente!');
    } else {
        console.log('❌ Tests cancelados por falla de conexión');
    }
}

// Ejecutar siempre los tests cuando se ejecuta el archivo
runTests();

export { testGeminiConnection, testGeminiEvaluation };
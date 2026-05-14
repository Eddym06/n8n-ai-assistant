/**
 * Script temporal para evaluar workflows con Gemini AI
 */

import autoScraper from './auto-scraper-intelligent.js';

console.log('🎯 Procesando workflows encontrados con Gemini AI...');

const workflows = [
    {
        title: 'AI agent chat',
        description: 'This workflow employs OpenAI language models and SerpAPI to create a responsive, intelligent conversational agent. It comes equipped with manual chat triggers...',
        url: '/workflows/1954-ai-agent-chat/',
        fullUrl: 'https://n8n.io/workflows/1954-ai-agent-chat/',
        nodeCount: 4,
        nodeNames: ['AI Agent', 'OpenAI Chat Model', 'Simple Memory']
    },
    {
        title: 'Building Your First WhatsApp Chatbot',
        description: 'This n8n template builds a simple WhatsApp chabot acting as a Sales Agent. The Agent is backed by a product catalog vector store to better answer user questions...',
        url: '/workflows/2465-building-your-first-whatsapp-chatbot/',
        fullUrl: 'https://n8n.io/workflows/2465-building-your-first-whatsapp-chatbot/',
        nodeCount: 10,
        nodeNames: ['HTTP Request', 'WhatsApp Business Cloud', 'AI Agent']
    },
    {
        title: 'Generate AI Viral Videos with Seedance and Upload to TikTok, YouTube & Instagram',
        description: 'Generate AI videos with Seedance & Blotato, upload to TikTok, YouTube & Instagram. This template is ideal for creators, content marketers, so...',
        url: '/workflows/5338-generate-ai-viral-videos-with-seedance-and-upload-to-tiktok-youtube-and-instagram/',
        fullUrl: 'https://n8n.io/workflows/5338-generate-ai-viral-videos-with-seedance-and-upload-to-tiktok-youtube-and-instagram/',
        nodeCount: 7,
        nodeNames: ['Google Sheets', 'HTTP Request', 'Code']
    },
    {
        title: 'AI agent that can scrape webpages',
        description: 'This template is a PoC of a ReAct AI Agent capable of fetching random pages (not only Wikipedia or Google search results). On the top part there...',
        url: '/workflows/2006-ai-agent-that-can-scrape-webpages/',
        fullUrl: 'https://n8n.io/workflows/2006-ai-agent-that-can-scrape-webpages/',
        nodeCount: 4,
        nodeNames: ['HTTP Request', 'AI Agent', 'OpenAI Chat Model']
    },
    {
        title: 'Automate Multi-Platform Social Media Content Creation with AI',
        description: 'Automate Multi-Platform Social Media Content Creation with AI. Who is this for? Social Media Managers and Digital Marketers seeking to streamline content prod...',
        url: '/workflows/3066-automate-multi-platform-social-media-content-creation-with-ai/',
        fullUrl: 'https://n8n.io/workflows/3066-automate-multi-platform-social-media-content-creation-with-ai/',
        nodeCount: 13,
        nodeNames: ['HTTP Request', 'Telegram', 'Facebook Graph API']
    },
    {
        title: 'Angie, Personal AI Assistant with Telegram Voice and Text',
        description: 'How it works: This project creates a personal AI assistant named Angie that operates through Telegram. Angie can summarize daily emails, look up calendar entri...',
        url: '/workflows/2462-angie-personal-ai-assistant-with-telegram-voice-and-text/',
        fullUrl: 'https://n8n.io/workflows/2462-angie-personal-ai-assistant-with-telegram-voice-and-text/',
        nodeCount: 5,
        nodeNames: ['Telegram', 'AI Agent', 'OpenAI Chat Model']
    },
    {
        title: 'Build Your First AI Data Analyst Chatbot',
        description: 'Enhance your data analysis by connecting an AI Agent to your dataset, using n8n tools. This template teaches you how to build an AI Data Analyst Chatbot that i...',
        url: '/workflows/3050-build-your-first-ai-data-analyst-chatbot/',
        fullUrl: 'https://n8n.io/workflows/3050-build-your-first-ai-data-analyst-chatbot/',
        nodeCount: 7,
        nodeNames: ['HTTP Request', 'Code', 'AI Agent']
    },
    {
        title: 'AI-Powered Social Media Content Generator & Publisher',
        description: 'AI-Powered Social Media Content Generator & Publisher. This AI-driven n8n workflow automates social media content creation and publishing across LinkedIn, ...',
        url: '/workflows/2950-ai-powered-social-media-content-generator-and-publisher/',
        fullUrl: 'https://n8n.io/workflows/2950-ai-powered-social-media-content-generator-and-publisher/',
        nodeCount: 8,
        nodeNames: ['HTTP Request', 'Facebook Graph API', 'X (Formerly Twitter)']
    }
];

console.log('🤖 Evaluando cada workflow con Gemini AI...');

async function evaluateWorkflows() {
    const approvedWorkflows = [];
    
    for (let i = 0; i < workflows.length; i++) {
        const workflow = workflows[i];
        console.log(`\n📋 Evaluando ${i+1}/${workflows.length}: ${workflow.title}`);
        console.log(`   🔧 Nodos: ${workflow.nodeCount}`);
        
        try {
            const evaluation = await autoScraper.evaluateWorkflow(workflow);
            const score = evaluation.geminiEvaluation?.score || 0;
            console.log(`   🎯 Puntuación: ${score}/10`);
            console.log(`   📝 Razón: ${evaluation.reason}`);
            console.log(`   🤖 Evaluación Gemini: ${evaluation.geminiEvaluation?.category || 'N/A'}`);
            
            if (evaluation.shouldDownload && score >= 5) {
                console.log(`   ✅ Workflow APROBADO para descarga`);
                approvedWorkflows.push({
                    ...workflow,
                    evaluation: evaluation
                });
            } else {
                console.log(`   ❌ Workflow RECHAZADO (${!evaluation.shouldDownload ? 'criterios no cumplidos' : 'puntuación baja'})`);
            }
            
            // Pequeña pausa entre evaluaciones
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`   ❌ Error evaluando: ${error.message}`);
        }
    }
    
    console.log('\n🎉 Evaluación con Gemini AI completada!');
    console.log(`✅ Workflows aprobados: ${approvedWorkflows.length}/${workflows.length}`);
    
    return approvedWorkflows;
}

// Ejecutar evaluación
evaluateWorkflows().then(approved => {
    console.log('\n📊 RESUMEN DE WORKFLOWS APROBADOS:');
    approved.forEach((workflow, index) => {
        console.log(`${index + 1}. ${workflow.title} (${workflow.nodeCount} nodos) - Score: ${workflow.evaluation.score}/10`);
    });
}).catch(error => {
    console.error('❌ Error en evaluación general:', error.message);
});
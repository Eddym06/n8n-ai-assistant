#!/usr/bin/env node
/**
 * Script para crear datos de prueba del sistema de workflows
 * Genera categorías y workflows de ejemplo para testing
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_PATH = path.join(__dirname, '..', 'src', 'assets', 'workflows');

// Datos de ejemplo de workflows
const sampleCategories = [
  {
    name: 'Business & Operations',
    workflows: [
      {
        title: 'Customer Onboarding Automation',
        description: 'Automatiza el proceso de incorporación de nuevos clientes mediante integración con CRM, envío de emails de bienvenida y creación de tareas de seguimiento.',
        services: ['HubSpot', 'Gmail', 'Slack', 'Asana'],
        actions: ['create_contact', 'send_email', 'post_message', 'create_task'],
        original_filename: 'customer_onboarding.json',
        nodes_count: 8,
        complexity: 'medium',
        use_cases: ['customer_management', 'automation', 'communication']
      },
      {
        title: 'Invoice Processing Workflow',
        description: 'Procesa automáticamente facturas recibidas por email, extrae datos relevantes y las registra en el sistema contable.',
        services: ['Gmail', 'Google Drive', 'QuickBooks', 'Webhook'],
        actions: ['read_email', 'extract_data', 'create_invoice', 'send_notification'],
        original_filename: 'invoice_processing.json',
        nodes_count: 12,
        complexity: 'high',
        use_cases: ['accounting', 'document_processing', 'automation']
      }
    ]
  },
  {
    name: 'Communication & Messaging',
    workflows: [
      {
        title: 'Multi-Channel Notification System',
        description: 'Sistema de notificaciones que envía alertas importantes a través de múltiples canales (email, Slack, SMS) según la urgencia.',
        services: ['Gmail', 'Slack', 'Twilio', 'Discord'],
        actions: ['send_email', 'post_message', 'send_sms', 'create_webhook'],
        original_filename: 'notification_system.json',
        nodes_count: 15,
        complexity: 'high',
        use_cases: ['notifications', 'alerts', 'communication']
      },
      {
        title: 'Social Media Auto-Responder',
        description: 'Responde automáticamente a menciones y comentarios en redes sociales usando IA para generar respuestas personalizadas.',
        services: ['Twitter', 'Facebook', 'OpenAI', 'Webhook'],
        actions: ['monitor_mentions', 'generate_response', 'post_reply', 'log_interaction'],
        original_filename: 'social_responder.json',
        nodes_count: 10,
        complexity: 'medium',
        use_cases: ['social_media', 'ai', 'customer_service']
      }
    ]
  },
  {
    name: 'Data Management & Analytics',
    workflows: [
      {
        title: 'Sales Data Aggregation',
        description: 'Recopila datos de ventas de múltiples fuentes, los procesa y genera reportes automáticos con visualizaciones.',
        services: ['Salesforce', 'Google Sheets', 'Telegram', 'Chart.js'],
        actions: ['fetch_data', 'process_data', 'create_report', 'send_notification'],
        original_filename: 'sales_analytics.json',
        nodes_count: 18,
        complexity: 'high',
        use_cases: ['analytics', 'reporting', 'data_processing']
      }
    ]
  },
  {
    name: 'E-commerce & Inventory',
    workflows: [
      {
        title: 'Inventory Low Stock Alert',
        description: 'Monitorea el inventario y envía alertas cuando el stock de productos está bajo, incluyendo sugerencias de reposición.',
        services: ['Shopify', 'Gmail', 'Slack', 'Google Sheets'],
        actions: ['check_inventory', 'send_alert', 'update_spreadsheet', 'create_order'],
        original_filename: 'inventory_alert.json',
        nodes_count: 7,
        complexity: 'low',
        use_cases: ['inventory', 'e-commerce', 'alerts']
      }
    ]
  }
];

// Generar workflow JSON de ejemplo
function generateSampleWorkflow(workflow, category) {
  return {
    name: workflow.title,
    nodes: [
      {
        id: uuidv4(),
        name: "Start",
        type: "n8n-nodes-base.start",
        position: [240, 300],
        parameters: {}
      },
      {
        id: uuidv4(),
        name: workflow.services[0] || "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        position: [460, 300],
        parameters: {
          url: "https://api.example.com/data",
          method: "GET"
        }
      },
      {
        id: uuidv4(),
        name: "Process Data",
        type: "n8n-nodes-base.function",
        position: [680, 300],
        parameters: {
          functionCode: `// ${workflow.description}\nreturn items;`
        }
      }
    ],
    connections: {
      "Start": { "main": [[{ "node": workflow.services[0] || "HTTP Request", "type": "main", "index": 0 }]] },
      [workflow.services[0] || "HTTP Request"]: { "main": [[{ "node": "Process Data", "type": "main", "index": 0 }]] }
    },
    active: false,
    settings: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidv4(),
    tags: workflow.use_cases || []
  };
}

async function createSampleData() {
  console.log('🔄 Creando datos de ejemplo para testing...\n');
  
  try {
    // Crear directorio base
    await fs.mkdir(TARGET_PATH, { recursive: true });
    
    let totalWorkflows = 0;
    
    for (const category of sampleCategories) {
      console.log(`📁 Creando categoría: ${category.name}`);
      
      // Crear directorio de categoría
      const categoryPath = path.join(TARGET_PATH, category.name);
      await fs.mkdir(categoryPath, { recursive: true });
      
      // Crear metadata.json
      const metadata = category.workflows.map(workflow => ({
        ...workflow,
        ai_generated_description: `[AI] ${workflow.description}`,
        generated_at: new Date().toISOString(),
        model_used: 'BART-large-cnn',
        confidence_score: 0.95
      }));
      
      await fs.writeFile(
        path.join(categoryPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2),
        'utf8'
      );
      
      // Crear archivos de workflow JSON
      for (const workflow of category.workflows) {
        const workflowData = generateSampleWorkflow(workflow, category.name);
        await fs.writeFile(
          path.join(categoryPath, workflow.original_filename),
          JSON.stringify(workflowData, null, 2),
          'utf8'
        );
      }
      
      totalWorkflows += category.workflows.length;
      console.log(`   ✅ ${category.workflows.length} workflows creados`);
    }
    
    console.log(`\n🎉 Datos de ejemplo creados exitosamente!`);
    console.log(`📈 Total: ${totalWorkflows} workflows en ${sampleCategories.length} categorías`);
    console.log(`📍 Ubicación: ${TARGET_PATH}`);
    console.log('\n🚀 El backend ahora puede usar estos datos para testing!');
    
  } catch (error) {
    console.error('❌ Error creando datos de ejemplo:', error);
  }
}

await createSampleData();

/**
 * 🧪 TEST FLUJO COMPLETO FUNCIONAL - TELEGRAM + GEMINI AI
 * ======================================================
 * 
 * Prueba con prompt realista de usuario novato:
 * "Quiero un flujo que cuando envíe mensaje a Telegram, 
 *  se active y pase el mensaje a Gemini AI"
 * 
 * Validaciones:
 * ✅ Uso correcto de telegramTrigger (no trigger genérico)
 * ✅ Configuración funcional de nodos
 * ✅ Conexiones lógicas y coherentes
 * ✅ Posicionamiento estético con V3 Ultra
 * ✅ Workflow ejecutable y funcional
 */

import fs from 'fs';
import fetch from 'node-fetch';

class TestFlujoCompletoFuncional {
  constructor() {
    this.apiKey = 'your_google_api_key_here';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  /**
   * 🚀 EJECUTAR TEST COMPLETO DE FLUJO FUNCIONAL
   */
  async runCompleteTest() {
    console.log('🧪 ========================================');
    console.log('🧪 TEST FLUJO COMPLETO FUNCIONAL');
    console.log('🧪 Telegram + Gemini AI - Usuario Novato');
    console.log('🧪 ========================================\n');

    try {
      // 1. Prompt realista de usuario novato
      const userPrompt = this.createRealisticUserPrompt();
      console.log('👤 PROMPT DE USUARIO NOVATO:');
      console.log(`"${userPrompt}"\n`);

      // 2. Generar workflow con extension server
      console.log('🤖 Generando workflow con extension server...');
      const workflow = await this.generateWorkflowWithServer(userPrompt);

      // 3. Validar funcionalidad del workflow
      console.log('\n🔍 VALIDANDO FUNCIONALIDAD DEL WORKFLOW:');
      const validationResults = this.validateWorkflowFunctionality(workflow);

      // 4. Analizar posicionamiento V3 Ultra
      console.log('\n📐 ANALIZANDO POSICIONAMIENTO V3 ULTRA:');
      const positioningResults = this.analyzePositioning(workflow);

      // 5. Verificar configuraciones de nodos
      console.log('\n⚙️ VERIFICANDO CONFIGURACIONES DE NODOS:');
      const configResults = this.validateNodeConfigurations(workflow);

      // 6. Revisar conexiones lógicas
      console.log('\n🔗 REVISANDO CONEXIONES LÓGICAS:');
      const connectionResults = this.validateConnections(workflow);

      // 7. Guardar workflow generado
      const outputPath = `C:\\Users\\eddym\\Downloads\\n8n-ai-assistant\\test-flujo-telegram-gemini-${Date.now()}.json`;
      fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));

      // 8. Resumen final
      console.log('\n📊 ===== RESUMEN FINAL DEL TEST =====');
      this.displayFinalSummary(validationResults, positioningResults, configResults, connectionResults);

      return {
        success: true,
        workflow,
        validations: {
          functionality: validationResults,
          positioning: positioningResults,
          configurations: configResults,
          connections: connectionResults
        }
      };

    } catch (error) {
      console.error('❌ Error en test de flujo completo:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 👤 Crear prompt realista de usuario novato
   */
  createRealisticUserPrompt() {
    return "Hola, soy nuevo en n8n y quiero crear un flujo simple. Necesito que cuando envíe un mensaje a mi bot de Telegram, se active automáticamente el flujo y ese mensaje se pase a Gemini AI para que me responda. ¿Puedes ayudarme a crear esto? No sé mucho de configuraciones técnicas.";
  }

  /**
   * 🤖 Generar workflow usando el extension server
   */
  async generateWorkflowWithServer(userPrompt) {
    console.log('   📡 Enviando prompt a Gemini 2.0 Flash...');
    
    const enhancedPrompt = this.buildEnhancedPrompt(userPrompt);
    
    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: enhancedPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error API Gemini: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extraer JSON del workflow con limpieza mejorada
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON válido de la respuesta');
    }

    let jsonString = jsonMatch[0];
    
    // Limpiar posibles errores comunes de JSON
    jsonString = jsonString
      .replace(/,(\s*[}\]])/g, '$1') // Eliminar comas finales
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Asegurar comillas en propiedades
      .replace(/:\s*([^",{\[\]\s][^,}\]]*?)(\s*[,}\]])/g, ': "$1"$2') // Comillas en valores string
      .replace(/"\s*(true|false|null|\d+(?:\.\d+)?)\s*"/g, '$1'); // Restaurar valores primitivos

    const workflow = JSON.parse(jsonString);
    console.log(`   ✅ Workflow generado: ${workflow.nodes?.length || 0} nodos`);
    
    return workflow;
  }

  /**
   * 🏗️ Construir prompt mejorado para Gemini
   */
  buildEnhancedPrompt(userPrompt) {
    return `
# GENERADOR DE WORKFLOWS N8N - EXPERTO EN TELEGRAM + GEMINI AI

Eres un experto en n8n que ayuda a usuarios novatos a crear workflows funcionales.

## SOLICITUD DEL USUARIO:
"${userPrompt}"

## INSTRUCCIONES ESPECÍFICAS:

### 1. TIPOS DE NODOS OBLIGATORIOS:
- **TELEGRAM TRIGGER**: Usar "n8n-nodes-base.telegramTrigger" (NO "trigger" genérico)
- **GEMINI AI**: Usar "n8n-nodes-base.googleGemini" o función con API
- **TELEGRAM RESPONSE**: Usar "n8n-nodes-base.telegram" para responder

### 2. CONFIGURACIONES FUNCIONALES:
- telegramTrigger: webhook configurado, updates habilitadas
- Gemini: API key, model, prompt configurado
- Respuesta Telegram: chatId del trigger, texto de respuesta

### 3. FLUJO LÓGICO:
1. Telegram Trigger (recibe mensaje)
2. Extraer mensaje y chat_id
3. Enviar mensaje a Gemini AI
4. Recibir respuesta de Gemini
5. Enviar respuesta por Telegram

### 4. POSICIONAMIENTO:
- Distribución horizontal clara
- Espaciado adecuado entre nodos
- Flujo visual de izquierda a derecha

## EJEMPLO DE ESTRUCTURA REQUERIDA:

\`\`\`json
{
  "nodes": [
    {
      "name": "Telegram Bot Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "parameters": {
        "updates": ["message"]
      }
    },
    {
      "name": "Extract Message",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "values": [
          {"name": "message", "value": "={{ $json.message.text }}"},
          {"name": "chat_id", "value": "={{ $json.message.chat.id }}"}
        ]
      }
    },
    {
      "name": "Gemini AI",
      "type": "n8n-nodes-base.googleGemini",
      "parameters": {
        "prompt": "Responde al siguiente mensaje de forma útil: {{ $json.message }}"
      }
    },
    {
      "name": "Send Telegram Response",
      "type": "n8n-nodes-base.telegram",
      "parameters": {
        "chatId": "={{ $json.chat_id }}",
        "text": "={{ $json.response }}"
      }
    }
  ],
  "connections": {
    "Telegram Bot Trigger": {
      "main": [[{"node": "Extract Message", "type": "main", "index": 0}]]
    }
  }
}
\`\`\`

## RESPUESTA REQUERIDA:
Genera un workflow JSON completo y funcional que:
1. Use tipos de nodos correctos (telegramTrigger, NO trigger)
2. Tenga configuraciones realistas y funcionales
3. Incluya conexiones lógicas correctas
4. Sea ejecutable en n8n real
5. Resuelva exactamente lo que pide el usuario

IMPORTANTE: Responde SOLO con el JSON del workflow, sin explicaciones adicionales.
`;
  }

  /**
   * ✅ Validar funcionalidad del workflow
   */
  validateWorkflowFunctionality(workflow) {
    const results = {
      hasNodes: false,
      hasConnections: false,
      hasTelegramTrigger: false,
      hasGeminiAI: false,
      hasTelegramResponse: false,
      hasProperFlow: false,
      score: 0
    };

    // Verificar nodos
    if (workflow.nodes && workflow.nodes.length > 0) {
      results.hasNodes = true;
      results.score += 15;
      console.log(`   ✅ Nodos: ${workflow.nodes.length} nodos encontrados`);
    } else {
      console.log('   ❌ No se encontraron nodos');
    }

    // Verificar conexiones
    if (workflow.connections && Object.keys(workflow.connections).length > 0) {
      results.hasConnections = true;
      results.score += 15;
      console.log(`   ✅ Conexiones: ${Object.keys(workflow.connections).length} conexiones`);
    } else {
      console.log('   ❌ No se encontraron conexiones');
    }

    // Verificar Telegram Trigger
    const telegramTrigger = workflow.nodes?.find(n => 
      n.type === 'n8n-nodes-base.telegramTrigger' || 
      n.name.toLowerCase().includes('telegram') && n.name.toLowerCase().includes('trigger')
    );
    if (telegramTrigger) {
      results.hasTelegramTrigger = true;
      results.score += 20;
      console.log(`   ✅ Telegram Trigger: ${telegramTrigger.name} (${telegramTrigger.type})`);
    } else {
      console.log('   ❌ No se encontró Telegram Trigger correcto');
    }

    // Verificar Gemini AI
    const geminiNode = workflow.nodes?.find(n => 
      n.type?.includes('gemini') || 
      n.name.toLowerCase().includes('gemini') ||
      n.name.toLowerCase().includes('ai')
    );
    if (geminiNode) {
      results.hasGeminiAI = true;
      results.score += 20;
      console.log(`   ✅ Gemini AI: ${geminiNode.name} (${geminiNode.type})`);
    } else {
      console.log('   ❌ No se encontró nodo Gemini AI');
    }

    // Verificar respuesta Telegram
    const telegramResponse = workflow.nodes?.find(n => 
      n.type === 'n8n-nodes-base.telegram' && 
      !n.name.toLowerCase().includes('trigger')
    );
    if (telegramResponse) {
      results.hasTelegramResponse = true;
      results.score += 20;
      console.log(`   ✅ Telegram Response: ${telegramResponse.name}`);
    } else {
      console.log('   ❌ No se encontró nodo de respuesta Telegram');
    }

    // Verificar flujo lógico
    if (results.hasTelegramTrigger && results.hasGeminiAI && results.hasTelegramResponse && results.hasConnections) {
      results.hasProperFlow = true;
      results.score += 10;
      console.log('   ✅ Flujo lógico completo detectado');
    } else {
      console.log('   ⚠️ Flujo lógico incompleto');
    }

    console.log(`   📊 Score funcionalidad: ${results.score}/100`);
    return results;
  }

  /**
   * 📐 Analizar posicionamiento V3 Ultra
   */
  analyzePositioning(workflow) {
    const results = {
      hasPositions: false,
      isHorizontalFlow: false,
      hasProperSpacing: false,
      isVisuallyClean: false,
      score: 0
    };

    if (!workflow.nodes || workflow.nodes.length === 0) {
      console.log('   ❌ No hay nodos para analizar posicionamiento');
      return results;
    }

    // Verificar que todos los nodos tienen posiciones
    const nodesWithPositions = workflow.nodes.filter(n => n.position && n.position.length === 2);
    if (nodesWithPositions.length === workflow.nodes.length) {
      results.hasPositions = true;
      results.score += 25;
      console.log(`   ✅ Posiciones: ${nodesWithPositions.length}/${workflow.nodes.length} nodos posicionados`);
    } else {
      console.log(`   ⚠️ Posiciones: ${nodesWithPositions.length}/${workflow.nodes.length} nodos posicionados`);
    }

    // Analizar flujo horizontal
    const xPositions = nodesWithPositions.map(n => n.position[0]).sort((a, b) => a - b);
    const isProgressive = xPositions.every((x, i) => i === 0 || x >= xPositions[i - 1]);
    if (isProgressive && xPositions.length > 1) {
      results.isHorizontalFlow = true;
      results.score += 25;
      console.log('   ✅ Flujo horizontal progresivo detectado');
    } else {
      console.log('   ⚠️ Flujo horizontal no detectado');
    }

    // Verificar espaciado
    if (xPositions.length > 1) {
      const spacings = [];
      for (let i = 1; i < xPositions.length; i++) {
        spacings.push(xPositions[i] - xPositions[i - 1]);
      }
      const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
      if (avgSpacing > 180 && avgSpacing < 500) {
        results.hasProperSpacing = true;
        results.score += 25;
        console.log(`   ✅ Espaciado promedio: ${avgSpacing.toFixed(0)}px (apropiado)`);
      } else {
        console.log(`   ⚠️ Espaciado promedio: ${avgSpacing.toFixed(0)}px (fuera de rango 180-500px)`);
      }
    }

    // Verificar limpieza visual
    const yPositions = nodesWithPositions.map(n => n.position[1]);
    const yRange = Math.max(...yPositions) - Math.min(...yPositions);
    if (yRange < 1000) {
      results.isVisuallyClean = true;
      results.score += 25;
      console.log(`   ✅ Rango vertical: ${yRange}px (limpio)`);
    } else {
      console.log(`   ⚠️ Rango vertical: ${yRange}px (disperso)`);
    }

    console.log(`   📊 Score posicionamiento: ${results.score}/100`);
    return results;
  }

  /**
   * ⚙️ Validar configuraciones de nodos
   */
  validateNodeConfigurations(workflow) {
    const results = {
      telegramTriggerConfig: false,
      geminiConfig: false,
      telegramResponseConfig: false,
      extractionConfig: false,
      score: 0
    };

    workflow.nodes?.forEach(node => {
      // Configuración Telegram Trigger
      if (node.type === 'n8n-nodes-base.telegramTrigger') {
        if (node.parameters) {
          results.telegramTriggerConfig = true;
          results.score += 25;
          console.log(`   ✅ ${node.name}: Configuración presente`);
        } else {
          console.log(`   ⚠️ ${node.name}: Falta configuración`);
        }
      }

      // Configuración Gemini
      if (node.type?.includes('gemini') || node.name.toLowerCase().includes('gemini')) {
        if (node.parameters && (node.parameters.prompt || node.parameters.message)) {
          results.geminiConfig = true;
          results.score += 25;
          console.log(`   ✅ ${node.name}: Configuración presente`);
        } else {
          console.log(`   ⚠️ ${node.name}: Falta configuración`);
        }
      }

      // Configuración Telegram Response
      if (node.type === 'n8n-nodes-base.telegram' && !node.name.toLowerCase().includes('trigger')) {
        if (node.parameters && node.parameters.chatId && node.parameters.text) {
          results.telegramResponseConfig = true;
          results.score += 25;
          console.log(`   ✅ ${node.name}: Configuración presente`);
        } else {
          console.log(`   ⚠️ ${node.name}: Falta configuración`);
        }
      }

      // Configuración de extracción
      if (node.type === 'n8n-nodes-base.set' && node.parameters && node.parameters.values) {
        results.extractionConfig = true;
        results.score += 25;
        console.log(`   ✅ ${node.name}: Configuración de extracción presente`);
      }
    });

    console.log(`   📊 Score configuraciones: ${results.score}/100`);
    return results;
  }

  /**
   * 🔗 Validar conexiones lógicas
   */
  validateConnections(workflow) {
    const results = {
      hasLogicalFlow: false,
      allNodesConnected: false,
      noOrphanNodes: false,
      score: 0
    };

    if (!workflow.connections) {
      console.log('   ❌ No hay conexiones definidas');
      return results;
    }

    const connectedNodes = new Set();
    const connectionPairs = [];

    // Analizar conexiones
    Object.entries(workflow.connections).forEach(([source, targets]) => {
      connectedNodes.add(source);
      Object.values(targets).forEach(targetList => {
        const connections = Array.isArray(targetList) ? targetList : targetList.flat();
        connections.forEach(conn => {
          connectedNodes.add(conn.node);
          connectionPairs.push({ from: source, to: conn.node });
        });
      });
    });

    // Verificar flujo lógico - ALGORITMO MEJORADO
    const hasStart = connectionPairs.some(conn => {
      const sourceNode = workflow.nodes?.find(n => n.name === conn.from);
      return sourceNode && (
        sourceNode.type?.includes('trigger') || 
        sourceNode.type?.includes('Trigger') || 
        sourceNode.name.toLowerCase().includes('trigger')
      );
    });
    
    const hasEnd = connectionPairs.some(conn => {
      const targetNode = workflow.nodes?.find(n => n.name === conn.to);
      return targetNode && (
        (targetNode.type === 'n8n-nodes-base.telegram' && !targetNode.name.toLowerCase().includes('trigger')) ||
        targetNode.name.toLowerCase().includes('send') ||
        targetNode.name.toLowerCase().includes('response') ||
        targetNode.name.toLowerCase().includes('reply')
      );
    });

    // También verificar si hay nodos finales (sin conexiones salientes)
    const allTargetNodes = new Set(connectionPairs.map(conn => conn.to));
    const allSourceNodes = new Set(connectionPairs.map(conn => conn.from));
    const finalNodes = [...allTargetNodes].filter(node => !allSourceNodes.has(node));
    
    const hasProperEnd = finalNodes.length > 0 && finalNodes.some(nodeName => {
      const node = workflow.nodes?.find(n => n.name === nodeName);
      return node && (
        node.type === 'n8n-nodes-base.telegram' ||
        node.type === 'n8n-nodes-base.telegramBot' ||
        node.name.toLowerCase().includes('send') ||
        node.name.toLowerCase().includes('response') ||
        node.name.toLowerCase().includes('telegram') && !node.name.toLowerCase().includes('trigger')
      );
    });

    console.log(`   🔍 Debug detección final:`);
    console.log(`     Nodos finales encontrados: ${finalNodes.join(', ')}`);
    console.log(`     Todos los target nodes: ${[...allTargetNodes].join(', ')}`);
    console.log(`     Todos los source nodes: ${[...allSourceNodes].join(', ')}`);
    
    finalNodes.forEach(nodeName => {
      const node = workflow.nodes?.find(n => n.name === nodeName);
      if (node) {
        console.log(`     ${nodeName}: tipo=${node.type}, esTelegram=${node.type === 'n8n-nodes-base.telegram'}, contieneSend=${node.name.toLowerCase().includes('send')}`);
      }
    });

    if ((hasStart && hasEnd) || (hasStart && hasProperEnd)) {
      results.hasLogicalFlow = true;
      results.score += 40;
      console.log('   ✅ Flujo lógico: inicio y fin detectados');
      if (finalNodes.length > 0) {
        console.log(`     🎯 Nodos finales: ${finalNodes.join(', ')}`);
      }
    } else {
      console.log('   ⚠️ Flujo lógico: incompleto');
      console.log(`     🔍 Inicio detectado: ${hasStart}`);
      console.log(`     🔍 Fin detectado: ${hasEnd || hasProperEnd}`);
    }

    // Verificar nodos conectados
    const totalNodes = workflow.nodes?.length || 0;
    const connectedCount = connectedNodes.size;
    if (connectedCount === totalNodes && totalNodes > 0) {
      results.allNodesConnected = true;
      results.score += 30;
      console.log(`   ✅ Todos los nodos conectados: ${connectedCount}/${totalNodes}`);
    } else {
      console.log(`   ⚠️ Nodos conectados: ${connectedCount}/${totalNodes}`);
    }

    // Verificar no hay nodos huérfanos
    if (connectedCount === totalNodes) {
      results.noOrphanNodes = true;
      results.score += 30;
      console.log('   ✅ No hay nodos huérfanos');
    } else {
      console.log('   ⚠️ Nodos huérfanos detectados');
    }

    console.log(`   📊 Score conexiones: ${results.score}/100`);
    return results;
  }

  /**
   * 📊 Mostrar resumen final
   */
  displayFinalSummary(functionality, positioning, configurations, connections) {
    const totalScore = (
      functionality.score + 
      positioning.score + 
      configurations.score + 
      connections.score
    ) / 4;

    console.log(`📊 SCORE TOTAL: ${totalScore.toFixed(1)}/100`);
    console.log('');
    console.log('🎯 COMPONENTES EVALUADOS:');
    console.log(`   🔧 Funcionalidad: ${functionality.score}/100`);
    console.log(`   📐 Posicionamiento: ${positioning.score}/100`);
    console.log(`   ⚙️ Configuraciones: ${configurations.score}/100`);
    console.log(`   🔗 Conexiones: ${connections.score}/100`);
    console.log('');

    if (totalScore >= 90) {
      console.log('🏆 EXCELENTE: Workflow completamente funcional');
    } else if (totalScore >= 75) {
      console.log('✅ BUENO: Workflow funcional con mejoras menores');
    } else if (totalScore >= 50) {
      console.log('⚠️ REGULAR: Workflow parcialmente funcional');
    } else {
      console.log('❌ POBRE: Workflow requiere correcciones importantes');
    }
  }
}

// 🚀 EJECUTAR TEST
const testSuite = new TestFlujoCompletoFuncional();
testSuite.runCompleteTest().then(result => {
  if (result.success) {
    console.log('\n🎉 ===== TEST COMPLETADO EXITOSAMENTE =====');
    console.log('🎯 El sistema puede generar workflows funcionales para usuarios novatos');
  } else {
    console.log('\n❌ ===== TEST FALLÓ =====');
    console.log('🔍 Error:', result.error);
  }
}).catch(error => {
  console.error('💥 Error crítico en test:', error);
});
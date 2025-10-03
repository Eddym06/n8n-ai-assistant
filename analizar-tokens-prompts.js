/**
 * 🔍 ANALIZADOR DE TOKENS - Extension Server OFICIAL
 * ===================================================
 * 
 * Analiza y cuenta los tokens de todos los prompts que usan Gemini
 * en el sistema n8n AI Assistant.
 * 
 * Funciones:
 * - Extrae todos los prompts del sistema
 * - Calcula tokens aproximados para cada prompt
 * - Identifica qué agentes usan Gemini
 * - Proporciona estadísticas detalladas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TokenAnalyzer {
  constructor() {
    this.prompts = [];
    this.totalTokens = 0;
  }

  // Función para estimar tokens (aproximación basada en caracteres)
  estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    
    // Estimación: ~4 caracteres = 1 token (promedio para español/inglés)
    // Para prompts técnicos con mucho código, ajustamos a ~3.5 caracteres = 1 token
    const avgCharsPerToken = 3.5;
    
    // Contar caracteres y dividir por promedio
    const chars = text.length;
    const estimatedTokens = Math.ceil(chars / avgCharsPerToken);
    
    return estimatedTokens;
  }

  // Extraer prompts del archivo
  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      console.log('🔍 ANALIZANDO PROMPTS DEL SISTEMA...\n');
      
      // 1. PROMPT PRINCIPAL DEL EXTENSION SERVER
      const mainPromptMatch = content.match(/⚡ INSTRUCCIONES CRÍTICAS ULTRA-AVANZADAS:([\s\S]*?)🔒 VALIDACIÓN FINAL OBLIGATORIA:/);
      if (mainPromptMatch) {
        const mainPrompt = mainPromptMatch[0];
        const tokens = this.estimateTokens(mainPrompt);
        this.prompts.push({
          name: 'PROMPT PRINCIPAL - Extension Server OFICIAL',
          type: 'Principal',
          agent: 'Extension Server',
          model: 'gemini-2.5-pro',
          tokens,
          length: mainPrompt.length,
          snippet: mainPrompt.slice(0, 150) + '...'
        });
        
        console.log('📋 PROMPT PRINCIPAL IDENTIFICADO:');
        console.log(`   📊 Tokens estimados: ${tokens.toLocaleString()}`);
        console.log(`   📏 Longitud: ${mainPrompt.length.toLocaleString()} caracteres`);
        console.log(`   🎯 Modelo: gemini-2.5-pro\n`);
      }

      // 2. PROMPT ENHANCEMENT AGENT
      const enhancementPromptMatch = content.match(/async enhancePrompt\(prompt\)([\s\S]*?)const response = await this\.model\.generateContent/);
      if (enhancementPromptMatch) {
        const enhancementSection = enhancementPromptMatch[1];
        const promptMatch = enhancementSection.match(/const enhancedPrompt = `([\s\S]*?)`;/);
        if (promptMatch) {
          const enhancementPrompt = promptMatch[1];
          const tokens = this.estimateTokens(enhancementPrompt);
          this.prompts.push({
            name: 'Prompt Enhancement Agent',
            type: 'Enhancement',
            agent: 'PromptEnhancementAgent',
            model: 'gemini-2.5-pro',
            tokens,
            length: enhancementPrompt.length,
            snippet: enhancementPrompt.slice(0, 150) + '...'
          });
          
          console.log('🚀 PROMPT ENHANCEMENT AGENT:');
          console.log(`   📊 Tokens estimados: ${tokens.toLocaleString()}`);
          console.log(`   📏 Longitud: ${enhancementPrompt.length.toLocaleString()} caracteres\n`);
        }
      }

      // 3. SEARCH AGENT PROMPTS
      const searchPromptMatches = content.match(/searchPrompt = `([\s\S]*?)`;/g);
      if (searchPromptMatches) {
        searchPromptMatches.forEach((match, index) => {
          const promptMatch = match.match(/searchPrompt = `([\s\S]*?)`;/);
          if (promptMatch) {
            const searchPrompt = promptMatch[1];
            const tokens = this.estimateTokens(searchPrompt);
            this.prompts.push({
              name: `Search Agent Prompt ${index + 1}`,
              type: 'Search',
              agent: 'SearchAgent',
              model: 'gemini-2.5-pro',
              tokens,
              length: searchPrompt.length,
              snippet: searchPrompt.slice(0, 150) + '...'
            });
          }
        });
      }

      // 4. MEMORY AGENT PROMPTS
      const memoryPromptMatch = content.match(/class SemanticMemoryAgent([\s\S]*?)}\s*$/);
      if (memoryPromptMatch) {
        const memorySection = memoryPromptMatch[1];
        const promptMatches = memorySection.match(/const prompt = `([\s\S]*?)`;/g);
        if (promptMatches) {
          promptMatches.forEach((match, index) => {
            const promptMatch = match.match(/const prompt = `([\s\S]*?)`;/);
            if (promptMatch) {
              const memoryPrompt = promptMatch[1];
              const tokens = this.estimateTokens(memoryPrompt);
              this.prompts.push({
                name: `Memory Agent Prompt ${index + 1}`,
                type: 'Memory',
                agent: 'SemanticMemoryAgent',
                model: 'gemini-2.5-pro',
                tokens,
                length: memoryPrompt.length,
                snippet: memoryPrompt.slice(0, 150) + '...'
              });
            }
          });
        }
      }

      // 5. INTELLIGENT NAME CORRECTOR
      const namePromptMatch = content.match(/class IntelligentNameCorrector([\s\S]*?})\s*(?:class|module\.exports|$)/);
      if (namePromptMatch) {
        const nameSection = namePromptMatch[1];
        const promptMatches = nameSection.match(/`([^`]*CORRECT|[^`]*IMPROVE|[^`]*ANALYZE)[^`]*`/g);
        if (promptMatches) {
          promptMatches.forEach((prompt, index) => {
            const cleanPrompt = prompt.slice(1, -1); // Remove backticks
            const tokens = this.estimateTokens(cleanPrompt);
            this.prompts.push({
              name: `Name Corrector Prompt ${index + 1}`,
              type: 'NameCorrection',
              agent: 'IntelligentNameCorrector',
              model: 'gemini-2.5-pro',
              tokens,
              length: cleanPrompt.length,
              snippet: cleanPrompt.slice(0, 150) + '...'
            });
          });
        }
      }

      // Calcular totales
      this.totalTokens = this.prompts.reduce((sum, prompt) => sum + prompt.tokens, 0);
      
      console.log('📊 RESUMEN DE PROMPTS POR AGENTE:\n');
      
      // Agrupar por agente
      const byAgent = {};
      this.prompts.forEach(prompt => {
        if (!byAgent[prompt.agent]) {
          byAgent[prompt.agent] = {
            count: 0,
            totalTokens: 0,
            prompts: []
          };
        }
        byAgent[prompt.agent].count++;
        byAgent[prompt.agent].totalTokens += prompt.tokens;
        byAgent[prompt.agent].prompts.push(prompt);
      });

      // Mostrar estadísticas por agente
      Object.keys(byAgent).forEach(agentName => {
        const agent = byAgent[agentName];
        console.log(`🤖 ${agentName}:`);
        console.log(`   📝 Prompts: ${agent.count}`);
        console.log(`   📊 Tokens totales: ${agent.totalTokens.toLocaleString()}`);
        console.log(`   📊 Tokens promedio: ${Math.round(agent.totalTokens / agent.count).toLocaleString()}`);
        
        agent.prompts.forEach(prompt => {
          console.log(`      └── ${prompt.name}: ${prompt.tokens.toLocaleString()} tokens`);
        });
        console.log('');
      });

      // Estadísticas finales
      console.log('🎯 ESTADÍSTICAS GENERALES:\n');
      console.log(`📈 Total de prompts analizados: ${this.prompts.length}`);
      console.log(`📊 Total de tokens estimados: ${this.totalTokens.toLocaleString()}`);
      console.log(`📊 Promedio de tokens por prompt: ${Math.round(this.totalTokens / this.prompts.length).toLocaleString()}`);
      
      const largestPrompt = this.prompts.reduce((max, prompt) => prompt.tokens > max.tokens ? prompt : max);
      console.log(`🏆 Prompt más grande: ${largestPrompt.name} (${largestPrompt.tokens.toLocaleString()} tokens)`);
      
      const smallestPrompt = this.prompts.reduce((min, prompt) => prompt.tokens < min.tokens ? prompt : min);
      console.log(`🏅 Prompt más pequeño: ${smallestPrompt.name} (${smallestPrompt.tokens.toLocaleString()} tokens)`);
      
      console.log('\n🔍 DETALLES DE COSTOS ESTIMADOS:');
      console.log('   💡 Basado en Gemini 2.5 Pro pricing');
      
      // Estimación de costos (precios aproximados de Gemini)
      const inputCostPer1MTokens = 1.25; // USD por 1M tokens de input
      const outputCostPer1MTokens = 5.00; // USD por 1M tokens de output
      
      const estimatedInputCost = (this.totalTokens / 1000000) * inputCostPer1MTokens;
      const estimatedOutputCost = (this.totalTokens * 0.3 / 1000000) * outputCostPer1MTokens; // Asumiendo 30% output
      
      console.log(`   💰 Costo estimado input: $${estimatedInputCost.toFixed(4)} USD por ejecución`);
      console.log(`   💰 Costo estimado output: $${estimatedOutputCost.toFixed(4)} USD por ejecución`);
      console.log(`   💰 Costo total estimado: $${(estimatedInputCost + estimatedOutputCost).toFixed(4)} USD por ejecución\n`);

      return {
        prompts: this.prompts,
        totalTokens: this.totalTokens,
        agentBreakdown: byAgent
      };

    } catch (error) {
      console.error('❌ Error analizando archivo:', error.message);
      return null;
    }
  }

  // Generar reporte detallado
  generateDetailedReport() {
    console.log('\n📄 REPORTE DETALLADO DE TOKENS:\n');
    console.log(''.padEnd(80, '='));
    
    this.prompts.forEach((prompt, index) => {
      console.log(`\n${index + 1}. ${prompt.name}`);
      console.log(`   🏷️ Tipo: ${prompt.type}`);
      console.log(`   🤖 Agente: ${prompt.agent}`);
      console.log(`   🧠 Modelo: ${prompt.model}`);
      console.log(`   📊 Tokens: ${prompt.tokens.toLocaleString()}`);
      console.log(`   📏 Caracteres: ${prompt.length.toLocaleString()}`);
      console.log(`   📝 Preview: ${prompt.snippet}`);
    });
    
    console.log('\n' + ''.padEnd(80, '='));
  }
}

// Ejecutar análisis
async function main() {
  console.log('🔍 ANALIZADOR DE TOKENS - n8n AI Assistant V3 Ultra');
  console.log(''.padEnd(60, '='));
  console.log('🎯 Analizando extension-server-OFICIAL.js...\n');

  const analyzer = new TokenAnalyzer();
  const serverFile = path.join(__dirname, 'extension-server-OFICIAL.js');
  
  if (!fs.existsSync(serverFile)) {
    console.error('❌ Archivo extension-server-OFICIAL.js no encontrado');
    return;
  }

  const results = await analyzer.analyzeFile(serverFile);
  
  if (results) {
    analyzer.generateDetailedReport();
    
    // Guardar reporte
    const reportPath = path.join(__dirname, 'token-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Reporte guardado en: ${reportPath}`);
  }
}

// Ejecutar si es llamado directamente
main().catch(console.error);

export default TokenAnalyzer;
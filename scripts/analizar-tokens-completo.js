/**
 * 🔍 ANALIZADOR COMPLETO DE TOKENS - Extension Server OFICIAL
 * ============================================================
 * 
 * Analiza TODOS los prompts que usan Gemini en el sistema completo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComprehensiveTokenAnalyzer {
  constructor() {
    this.totalTokens = 0;
    this.agentAnalysis = {};
    this.allPrompts = [];
  }

  // Función mejorada para estimar tokens
  estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    
    // Estimar más precisamente considerando diferentes tipos de contenido
    const lines = text.split('\n');
    let totalTokens = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) continue;
      
      // Código/JSON: ~2.5 chars per token
      if (trimmed.includes('{') || trimmed.includes('n8n-nodes-base') || trimmed.includes('parameters')) {
        totalTokens += Math.ceil(trimmed.length / 2.5);
      }
      // Texto técnico español: ~3.5 chars per token
      else if (trimmed.includes('🎯') || trimmed.includes('✅') || trimmed.includes('❌')) {
        totalTokens += Math.ceil(trimmed.length / 3.5);
      }
      // Texto normal: ~4 chars per token
      else {
        totalTokens += Math.ceil(trimmed.length / 4);
      }
    }
    
    return totalTokens;
  }

  async analyzeFile(filePath, fileName) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filePrompts = [];
      
      console.log(`\n🔍 Analizando: ${fileName}`);
      
      // Buscar todos los template literals que parecen prompts
      const promptPatterns = [
        // Prompts con template literals largos
        /const\s+\w*[Pp]rompt\s*=\s*`([\s\S]{200,}?)`/g,
        /let\s+\w*[Pp]rompt\s*=\s*`([\s\S]{200,}?)`/g,
        // Template strings en parámetros de Gemini
        /generateContent\s*\(\s*`([\s\S]{200,}?)`/g,
        // Prompts en strings multilínea
        /`[\s\S]*?🎯[\s\S]*?`/g,
        /`[\s\S]*?GENERA[\s\S]*?`/g,
        /`[\s\S]*?PROMPT[\s\S]*?`/g,
        /`[\s\S]*?INSTRUCCIONES[\s\S]*?`/g,
        // Prompts específicos de agentes
        /enhancedPrompt\s*=\s*`([\s\S]{200,}?)`/g,
        /searchPrompt\s*=\s*`([\s\S]{200,}?)`/g
      ];

      for (const pattern of promptPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const promptText = match[1] || match[0];
          if (promptText && promptText.length > 200) { // Solo prompts significativos
            const tokens = this.estimateTokens(promptText);
            const snippet = promptText.slice(0, 100).replace(/\n/g, ' ') + '...';
            
            filePrompts.push({
              file: fileName,
              text: promptText,
              tokens,
              length: promptText.length,
              snippet,
              type: this.classifyPrompt(promptText)
            });
          }
        }
      }

      // Prompts específicos por archivo
      if (fileName === 'extension-server-OFICIAL.js') {
        this.analyzeExtensionServer(content, filePrompts);
      } else if (fileName.includes('prompt-enhancement')) {
        this.analyzePromptEnhancementAgent(content, filePrompts);
      } else if (fileName.includes('search')) {
        this.analyzeSearchAgent(content, filePrompts);
      } else if (fileName.includes('memory')) {
        this.analyzeMemoryAgent(content, filePrompts);
      }

      return filePrompts;

    } catch (error) {
      console.error(`❌ Error analizando ${fileName}:`, error.message);
      return [];
    }
  }

  classifyPrompt(text) {
    if (text.includes('GENERA UN WORKFLOW')) return 'Workflow Generation';
    if (text.includes('ENHANCE') || text.includes('IMPROVE')) return 'Prompt Enhancement';
    if (text.includes('SEARCH') || text.includes('FIND')) return 'Search & Retrieval';
    if (text.includes('MEMORY') || text.includes('STORE')) return 'Memory Management';
    if (text.includes('POSITION') || text.includes('LAYOUT')) return 'Positioning';
    if (text.includes('CONFIG') || text.includes('PARAMETER')) return 'Configuration';
    if (text.includes('VALIDATE') || text.includes('CHECK')) return 'Validation';
    return 'General';
  }

  analyzeExtensionServer(content, filePrompts) {
    // Prompt principal ya detectado por patterns generales
    
    // Buscar prompts específicos de configuración
    const configPrompts = content.match(/⚙️[\s\S]*?`[\s\S]*?`/g) || [];
    for (const prompt of configPrompts) {
      if (prompt.length > 200) {
        const tokens = this.estimateTokens(prompt);
        filePrompts.push({
          file: 'extension-server-OFICIAL.js',
          text: prompt,
          tokens,
          length: prompt.length,
          snippet: prompt.slice(0, 100) + '...',
          type: 'Configuration'
        });
      }
    }
  }

  analyzePromptEnhancementAgent(content, filePrompts) {
    // Ya detectado por patterns generales
    console.log(`   📝 Prompt Enhancement Agent detectado`);
  }

  analyzeSearchAgent(content, filePrompts) {
    console.log(`   📝 Search Agent detectado`);
  }

  analyzeMemoryAgent(content, filePrompts) {
    console.log(`   📝 Memory Agent detectado`);
  }

  async analyzeAllFiles() {
    console.log('🔍 ANÁLISIS COMPLETO DE TOKENS - Sistema n8n AI Assistant');
    console.log(''.padEnd(65, '='));

    const filesToAnalyze = [
      // Archivo principal
      { path: './extension-server-OFICIAL.js', name: 'extension-server-OFICIAL.js' },
      
      // Agentes del sistema principal
      { path: './SISTEMA PRINCIPAL/prompt-enhancement-agent.js', name: 'prompt-enhancement-agent.js' },
      { path: './SISTEMA PRINCIPAL/semantic-search-agent.js', name: 'semantic-search-agent.js' },
      { path: './SISTEMA PRINCIPAL/semantic-memory-agent.js', name: 'semantic-memory-agent.js' },
      { path: './SISTEMA PRINCIPAL/intelligent-positioning-agent-v4-ai-enhanced.js', name: 'positioning-agent-v4.js' },
      
      // Otros archivos con prompts potenciales
      { path: './intelligent-name-corrector.js', name: 'intelligent-name-corrector.js' },
      { path: './json-repair-agent.js', name: 'json-repair-agent.js' },
      { path: './intelligent-positioning-agent.js', name: 'positioning-agent-v3.js' }
    ];

    for (const file of filesToAnalyze) {
      const fullPath = path.resolve(__dirname, file.path);
      if (fs.existsSync(fullPath)) {
        const prompts = await this.analyzeFile(fullPath, file.name);
        this.allPrompts.push(...prompts);
        
        if (prompts.length > 0) {
          console.log(`   ✅ ${prompts.length} prompts encontrados (${prompts.reduce((sum, p) => sum + p.tokens, 0).toLocaleString()} tokens)`);
        } else {
          console.log(`   ℹ️  Sin prompts significativos`);
        }
      } else {
        console.log(`   ⚠️  Archivo no encontrado: ${file.path}`);
      }
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 REPORTE COMPLETO DE TOKENS');
    console.log(''.padEnd(50, '='));

    // Agrupar por archivo
    const byFile = {};
    const byType = {};

    for (const prompt of this.allPrompts) {
      // Por archivo
      if (!byFile[prompt.file]) {
        byFile[prompt.file] = { count: 0, tokens: 0, prompts: [] };
      }
      byFile[prompt.file].count++;
      byFile[prompt.file].tokens += prompt.tokens;
      byFile[prompt.file].prompts.push(prompt);

      // Por tipo
      if (!byType[prompt.type]) {
        byType[prompt.type] = { count: 0, tokens: 0 };
      }
      byType[prompt.type].count++;
      byType[prompt.type].tokens += prompt.tokens;
    }

    // Reporte por archivo
    console.log('\n📁 ANÁLISIS POR ARCHIVO:');
    for (const [fileName, data] of Object.entries(byFile)) {
      console.log(`\n🔹 ${fileName}`);
      console.log(`   📝 Prompts: ${data.count}`);
      console.log(`   📊 Tokens: ${data.tokens.toLocaleString()}`);
      console.log(`   📏 Promedio: ${Math.round(data.tokens / data.count).toLocaleString()} tokens/prompt`);
      
      // Top 3 prompts más largos por archivo
      const topPrompts = data.prompts
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 3);
      
      for (const [index, prompt] of topPrompts.entries()) {
        console.log(`      ${index + 1}. ${prompt.type}: ${prompt.tokens.toLocaleString()} tokens`);
      }
    }

    // Reporte por tipo
    console.log('\n🏷️ ANÁLISIS POR TIPO:');
    const sortedTypes = Object.entries(byType)
      .sort(([,a], [,b]) => b.tokens - a.tokens);

    for (const [type, data] of sortedTypes) {
      console.log(`   🔸 ${type}: ${data.tokens.toLocaleString()} tokens (${data.count} prompts)`);
    }

    // Estadísticas globales
    this.totalTokens = this.allPrompts.reduce((sum, p) => sum + p.tokens, 0);
    const totalChars = this.allPrompts.reduce((sum, p) => sum + p.length, 0);

    console.log('\n🎯 ESTADÍSTICAS GLOBALES:');
    console.log(`📈 Total archivos analizados: ${Object.keys(byFile).length}`);
    console.log(`📝 Total prompts encontrados: ${this.allPrompts.length}`);
    console.log(`📊 Total tokens estimados: ${this.totalTokens.toLocaleString()}`);
    console.log(`📏 Total caracteres: ${totalChars.toLocaleString()}`);
    console.log(`📊 Promedio tokens/prompt: ${Math.round(this.totalTokens / this.allPrompts.length).toLocaleString()}`);

    // Prompt más largo
    const largestPrompt = this.allPrompts.reduce((max, p) => p.tokens > max.tokens ? p : max);
    console.log(`🏆 Prompt más largo: ${largestPrompt.type} en ${largestPrompt.file} (${largestPrompt.tokens.toLocaleString()} tokens)`);

    // Estimación de costos
    console.log('\n💰 ESTIMACIÓN DE COSTOS (Gemini 2.5 Pro):');
    const inputCostPer1M = 1.25; // USD
    const outputCostPer1M = 5.00; // USD
    
    const inputCost = (this.totalTokens / 1000000) * inputCostPer1M;
    const outputCost = (this.totalTokens * 0.3 / 1000000) * outputCostPer1M;
    const totalCost = inputCost + outputCost;
    
    console.log(`   📥 Input: $${inputCost.toFixed(4)} USD por ejecución completa`);
    console.log(`   📤 Output (30%): $${outputCost.toFixed(4)} USD por ejecución completa`);
    console.log(`   💸 Total: $${totalCost.toFixed(4)} USD por ejecución completa`);
    
    // Proyecciones de uso
    console.log('\n📈 PROYECCIONES DE USO:');
    console.log(`   📅 Costo diario (10 ejecuciones): $${(totalCost * 10).toFixed(2)} USD`);
    console.log(`   📅 Costo mensual (300 ejecuciones): $${(totalCost * 300).toFixed(2)} USD`);
    console.log(`   📅 Costo anual (3600 ejecuciones): $${(totalCost * 3600).toFixed(2)} USD`);

    // Guardar reporte detallado
    const report = {
      summary: {
        totalFiles: Object.keys(byFile).length,
        totalPrompts: this.allPrompts.length,
        totalTokens: this.totalTokens,
        totalCharacters: totalChars,
        averageTokensPerPrompt: Math.round(this.totalTokens / this.allPrompts.length)
      },
      byFile,
      byType,
      largestPrompt: {
        type: largestPrompt.type,
        file: largestPrompt.file,
        tokens: largestPrompt.tokens,
        length: largestPrompt.length
      },
      costEstimation: {
        inputCostPerExecution: inputCost,
        outputCostPerExecution: outputCost,
        totalCostPerExecution: totalCost,
        dailyCost: totalCost * 10,
        monthlyCost: totalCost * 300,
        annualCost: totalCost * 3600
      },
      allPrompts: this.allPrompts
    };

    const reportPath = path.join(__dirname, 'comprehensive-token-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte completo guardado en: comprehensive-token-analysis.json`);
  }
}

// Ejecutar análisis
async function main() {
  const analyzer = new ComprehensiveTokenAnalyzer();
  await analyzer.analyzeAllFiles();
}

main().catch(console.error);

export default ComprehensiveTokenAnalyzer;
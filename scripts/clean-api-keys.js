#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Patrones de claves API a reemplazar
const apiKeyPatterns = [
  {
    pattern: /AIzaSy[A-Za-z0-9_-]{33}/g,
    replacement: 'your_google_api_key_here'
  },
  {
    pattern: /sk-[A-Za-z0-9_-]{40,}/g,
    replacement: 'your_openai_api_key_here'
  },
  {
    pattern: /apify_api_[A-Za-z0-9]{30,}/g,
    replacement: 'your_apify_api_token_here'
  }
];

// Función para procesar archivos recursivamente
function processFiles(dir) {
  let cleanedCount = 0;
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Saltar directorios node_modules y .git
        if (!['node_modules', '.git'].includes(item)) {
          processDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Procesar archivos de texto relevantes
        const ext = path.extname(item).toLowerCase();
        if (['.js', '.json', '.md', '.env'].includes(ext)) {
          if (cleanFile(fullPath)) {
            cleanedCount++;
          }
        }
      }
    }
  }
  
  processDirectory(dir);
  return cleanedCount;
}

// Función para limpiar un archivo específico
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    for (const { pattern, replacement } of apiKeyPatterns) {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      if (content !== originalContent) {
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn(`⚠️ Error procesando ${filePath}: ${error.message}`);
    return false;
  }
}

// Ejecutar limpieza
console.log('🧹 Iniciando limpieza masiva de claves API...');
const cleanedCount = processFiles(__dirname);
console.log(`\n🎉 Limpieza completada: ${cleanedCount} archivos procesados`);
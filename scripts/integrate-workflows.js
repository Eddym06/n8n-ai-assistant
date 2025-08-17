#!/usr/bin/env node
/**
 * Script para integrar la base de datos de workflows procesada por el indexador
 * 
 * Uso:
 * node scripts/integrate-workflows.js
 * 
 * Copia los workflows de C:\Users\eddym\Downloads\indexador\workflows\ 
 * al directorio src\assets\workflows\ del proyecto
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const INDEXADOR_PATH = 'C:\\Users\\eddym\\Downloads\\indexador\\workflows';
const TARGET_PATH = path.join(__dirname, '..', 'src', 'assets', 'workflows');

async function integrateWorkflows() {
  console.log('🔄 Iniciando integración de base de datos de workflows...\n');
  
  try {
    // Verificar que existe el directorio source
    await fs.access(INDEXADOR_PATH);
    console.log(`✅ Directorio indexador encontrado: ${INDEXADOR_PATH}`);
    
    // Leer categorías del indexador
    const categories = await fs.readdir(INDEXADOR_PATH);
    const validCategories = [];
    
    for (const category of categories) {
      const categoryPath = path.join(INDEXADOR_PATH, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        const metadataPath = path.join(categoryPath, 'metadata.json');
        try {
          await fs.access(metadataPath);
          validCategories.push(category);
        } catch {
          console.log(`⚠️ Categoría sin metadata: ${category}`);
        }
      }
    }
    
    console.log(`📊 Encontradas ${validCategories.length} categorías válidas`);
    
    // Crear directorio target si no existe
    await fs.mkdir(TARGET_PATH, { recursive: true });
    
    let totalWorkflows = 0;
    
    // Copiar cada categoría
    for (const category of validCategories) {
      const sourcePath = path.join(INDEXADOR_PATH, category);
      const targetPath = path.join(TARGET_PATH, category);
      
      console.log(`📁 Procesando: ${category}`);
      
      // Crear directorio de categoría
      await fs.mkdir(targetPath, { recursive: true });
      
      // Leer archivos de la categoría
      const files = await fs.readdir(sourcePath);
      
      for (const file of files) {
        const sourceFile = path.join(sourcePath, file);
        const targetFile = path.join(targetPath, file);
        
        // Copiar archivo
        await fs.copyFile(sourceFile, targetFile);
      }
      
      // Contar workflows en metadata
      try {
        const metadataPath = path.join(targetPath, 'metadata.json');
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        totalWorkflows += metadata.length;
        console.log(`   ✅ ${metadata.length} workflows copiados`);
      } catch (err) {
        console.log(`   ❌ Error leyendo metadata: ${err.message}`);
      }
    }
    
    console.log(`\n🎉 Integración completada!`);
    console.log(`📈 Total: ${totalWorkflows} workflows en ${validCategories.length} categorías`);
    console.log(`📍 Ubicación: ${TARGET_PATH}`);
    console.log('\n🚀 El backend ahora puede acceder a la base de datos completa de workflows!');
    
  } catch (error) {
    console.error('❌ Error durante la integración:', error);
    
    if (error.code === 'ENOENT') {
      console.log('\n💡 Sugerencias:');
      console.log('1. Verifica que el indexador se haya ejecutado correctamente');
      console.log('2. Confirma la ruta: C:\\Users\\eddym\\Downloads\\indexador\\workflows\\');
      console.log('3. Asegúrate de que existen las carpetas de categorías con metadata.json');
    }
  }
}

// Función para verificar el estado de la integración
async function checkIntegrationStatus() {
  try {
    const categories = await fs.readdir(TARGET_PATH);
    const validCategories = [];
    let totalWorkflows = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(TARGET_PATH, category);
      const metadataPath = path.join(categoryPath, 'metadata.json');
      
      try {
        const stat = await fs.stat(categoryPath);
        if (stat.isDirectory()) {
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          validCategories.push(category);
          totalWorkflows += metadata.length;
        }
      } catch {
        // Ignorar errores de categorías inválidas
      }
    }
    
    console.log('\n📊 Estado actual de la base de datos:');
    console.log(`   Categorías: ${validCategories.length}`);
    console.log(`   Workflows: ${totalWorkflows}`);
    console.log(`   Ubicación: ${TARGET_PATH}`);
    
  } catch (error) {
    console.log('\n📊 Base de datos no encontrada. Ejecuta la integración primero.');
  }
}

// Ejecutar script
if (process.argv.includes('--status')) {
  await checkIntegrationStatus();
} else {
  await integrateWorkflows();
}

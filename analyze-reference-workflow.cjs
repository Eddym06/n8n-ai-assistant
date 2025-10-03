const fs = require('fs');
const path = require('path');

/**
 * ANALIZADOR DE FLUJO DE REFERENCIA
 * Analiza un flujo funcional de n8n para entender la estructura correcta
 */

async function analyzeReferenceWorkflow() {
    console.log('=== ANÁLISIS DE FLUJO DE REFERENCIA ===\n');
    
    const referencePath = 'C:\\Users\\eddym\\Downloads\\workflows\\Wait\\1312_Wait_Schedule_Create_Webhook.json';
    const problematicPath = './workflow-masivo-gemini-1757337804197.json';
    
    try {
        // Leer flujo de referencia
        console.log('📋 Leyendo flujo de referencia...');
        const referenceData = JSON.parse(fs.readFileSync(referencePath, 'utf8'));
        
        // Leer flujo problemático
        console.log('📋 Leyendo flujo problemático...');
        const problematicData = JSON.parse(fs.readFileSync(problematicPath, 'utf8'));
        
        console.log('\n=== ESTRUCTURAS BÁSICAS ===');
        console.log(`Referencia - Propiedades raíz:`, Object.keys(referenceData));
        console.log(`Problemático - Propiedades raíz:`, Object.keys(problematicData));
        
        // Analizar meta información
        console.log('\n=== META INFORMACIÓN ===');
        console.log('Referencia Meta:', referenceData.meta || 'NO PRESENTE');
        console.log('Problemático Meta:', problematicData.meta || 'NO PRESENTE');
        
        // Analizar nodos
        console.log('\n=== ANÁLISIS DE NODOS ===');
        const refNodes = referenceData.nodes || [];
        const probNodes = problematicData.nodes || [];
        
        console.log(`Referencia: ${refNodes.length} nodos`);
        console.log(`Problemático: ${probNodes.length} nodos`);
        
        // Estructura de nodos de referencia
        if (refNodes.length > 0) {
            console.log('\n📊 ESTRUCTURA NODO DE REFERENCIA (primer nodo):');
            const firstRefNode = refNodes[0];
            console.log('Propiedades:', Object.keys(firstRefNode));
            console.log('Ejemplo completo:', JSON.stringify(firstRefNode, null, 2));
        }
        
        // Campos únicos en nodos de referencia
        console.log('\n📊 CAMPOS EN NODOS DE REFERENCIA:');
        const refFields = new Set();
        refNodes.forEach(node => {
            Object.keys(node).forEach(key => refFields.add(key));
        });
        console.log('Campos únicos:', Array.from(refFields).sort());
        
        // Campos únicos en nodos problemáticos
        console.log('\n📊 CAMPOS EN NODOS PROBLEMÁTICOS:');
        const probFields = new Set();
        probNodes.forEach(node => {
            Object.keys(node).forEach(key => probFields.add(key));
        });
        console.log('Campos únicos:', Array.from(probFields).sort());
        
        // Diferencias de campos
        console.log('\n🔍 DIFERENCIAS DE CAMPOS:');
        const onlyInRef = Array.from(refFields).filter(f => !probFields.has(f));
        const onlyInProb = Array.from(probFields).filter(f => !refFields.has(f));
        
        console.log('Solo en referencia:', onlyInRef);
        console.log('Solo en problemático:', onlyInProb);
        
        // Analizar conexiones
        console.log('\n=== ANÁLISIS DE CONEXIONES ===');
        const refConnections = referenceData.connections || {};
        const probConnections = problematicData.connections || {};
        
        console.log('Referencia connections keys:', Object.keys(refConnections));
        console.log('Problemático connections keys:', Object.keys(probConnections).slice(0, 10), '... (primeros 10)');
        
        // Ejemplo de conexión de referencia
        if (Object.keys(refConnections).length > 0) {
            const firstConnectionKey = Object.keys(refConnections)[0];
            console.log('\n📊 EJEMPLO CONEXIÓN REFERENCIA:');
            console.log(`Nodo: ${firstConnectionKey}`);
            console.log('Estructura:', JSON.stringify(refConnections[firstConnectionKey], null, 2));
        }
        
        // Verificar IDs y nombres
        console.log('\n=== ANÁLISIS DE IDS Y NOMBRES ===');
        
        // IDs en referencia
        const refNodeIds = refNodes.map(n => n.id);
        const refNodeNames = refNodes.map(n => n.name);
        console.log('Referencia - Primeros 5 IDs:', refNodeIds.slice(0, 5));
        console.log('Referencia - Primeros 5 nombres:', refNodeNames.slice(0, 5));
        
        // IDs en problemático
        const probNodeIds = probNodes.map(n => n.id);
        const probNodeNames = probNodes.map(n => n.name);
        console.log('Problemático - Primeros 5 IDs:', probNodeIds.slice(0, 5));
        console.log('Problemático - Primeros 5 nombres:', probNodeNames.slice(0, 5));
        
        // Verificar campos problemáticos conocidos
        console.log('\n=== VERIFICACIÓN CAMPOS PROBLEMÁTICOS ===');
        const probOriginalIds = probNodes.filter(n => n.originalId);
        console.log(`Nodos con originalId en problemático: ${probOriginalIds.length}`);
        if (probOriginalIds.length > 0) {
            console.log('Ejemplo originalId:', probOriginalIds[0].originalId);
        }
        
        const refOriginalIds = refNodes.filter(n => n.originalId);
        console.log(`Nodos con originalId en referencia: ${refOriginalIds.length}`);
        
        // Generar reporte de diferencias
        console.log('\n=== REPORTE DE DIFERENCIAS CRÍTICAS ===');
        
        const differences = {
            metaFieldsRef: referenceData.meta ? Object.keys(referenceData.meta) : [],
            metaFieldsProb: problematicData.meta ? Object.keys(problematicData.meta) : [],
            nodeFieldsOnlyRef: onlyInRef,
            nodeFieldsOnlyProb: onlyInProb,
            hasOriginalIdRef: refOriginalIds.length > 0,
            hasOriginalIdProb: probOriginalIds.length > 0,
            connectionStructureRef: Object.keys(refConnections).length > 0 ? 'PRESENTE' : 'AUSENTE',
            connectionStructureProb: Object.keys(probConnections).length > 0 ? 'PRESENTE' : 'AUSENTE'
        };
        
        console.log('\n📊 RESUMEN EJECUTIVO:');
        console.log(JSON.stringify(differences, null, 2));
        
        // Guardar análisis detallado
        const analysis = {
            timestamp: new Date().toISOString(),
            reference: {
                file: referencePath,
                nodeCount: refNodes.length,
                nodeFields: Array.from(refFields),
                hasOriginalId: refOriginalIds.length > 0,
                metaFields: referenceData.meta ? Object.keys(referenceData.meta) : [],
                connectionKeys: Object.keys(refConnections),
                sampleNode: refNodes[0] || null,
                sampleConnection: Object.keys(refConnections).length > 0 ? 
                    refConnections[Object.keys(refConnections)[0]] : null
            },
            problematic: {
                file: problematicPath,
                nodeCount: probNodes.length,
                nodeFields: Array.from(probFields),
                hasOriginalId: probOriginalIds.length > 0,
                originalIdCount: probOriginalIds.length,
                metaFields: problematicData.meta ? Object.keys(problematicData.meta) : [],
                connectionKeys: Object.keys(probConnections).length
            },
            differences: differences
        };
        
        fs.writeFileSync('./REFERENCE-WORKFLOW-ANALYSIS.json', JSON.stringify(analysis, null, 2));
        console.log('\n✅ Análisis guardado en REFERENCE-WORKFLOW-ANALYSIS.json');
        
    } catch (error) {
        console.error('❌ Error durante el análisis:', error.message);
        
        // Si no puede leer el archivo de referencia, intentar otro enfoque
        if (error.message.includes('no such file')) {
            console.log('\n⚠️  No se pudo acceder al archivo de referencia.');
            console.log('Por favor, copia el contenido del archivo al workspace para analizarlo.');
            
            // Crear plantilla para que el usuario pegue el contenido
            const template = {
                instructions: "Pega aquí el contenido del archivo 1312_Wait_Schedule_Create_Webhook.json",
                content: "CONTENIDO_DEL_ARCHIVO_AQUÍ"
            };
            
            fs.writeFileSync('./reference-workflow-template.json', JSON.stringify(template, null, 2));
            console.log('📝 Creada plantilla en reference-workflow-template.json');
        }
    }
}

// Ejecutar análisis
analyzeReferenceWorkflow();
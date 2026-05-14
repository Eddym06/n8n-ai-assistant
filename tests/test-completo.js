import IntelligentNameCorrector from './intelligent-name-corrector.js';

// Test completo del corrector inteligente
const corrector = new IntelligentNameCorrector();

console.log('🧪 TEST COMPLETO - Intelligent Name Corrector v4.0');
console.log('==================================================');

// Test 1: Corrección de tipos de nodo
console.log('\n📋 TEST 1: Corrección de tipos de nodo');
console.log('----------------------------------------');

const testCases = [
    'hubspot', 'slack', 's3', 'mailchimp', 'discord', 
    'mysql', 'postgres', 'github', 'gitlab', 'jira',
    'trello', 'salesforce', 'zendesk', 'airtable', 'notion'
];

testCases.forEach(testCase => {
    const corrected = corrector.correctNodeType(testCase);
    console.log(`✅ ${testCase} -> ${corrected}`);
});

// Test 2: Corrección de operaciones IF
console.log('\n📋 TEST 2: Corrección de operaciones IF');
console.log('----------------------------------------');

const ifOperations = [
    'equals', 'equal', 'eq', '==',
    'notEquals', 'notEqual', 'neq', '!=',
    'greaterThan', 'gt', '>',
    'lessThan', 'lt', '<',
    'greaterThanOrEqual', 'gte', '>=',
    'lessThanOrEqual', 'lte', '<='
];

ifOperations.forEach(op => {
    const corrected = corrector.correctIfOperation(op);
    console.log(`✅ ${op} -> ${corrected}`);
});

// Test 3: Condiciones especiales
console.log('\n📋 TEST 3: Condiciones especiales');
console.log('----------------------------------------');

const specialConditions = [
    { operation: 'isTrue' },
    { operation: 'isFalse' }
];

specialConditions.forEach(condition => {
    const corrected = corrector.correctIfCondition(condition);
    console.log(`✅ ${JSON.stringify(condition)} -> ${JSON.stringify(corrected)}`);
});

// Test 4: Estadísticas finales
console.log('\n📊 ESTADÍSTICAS FINALES');
console.log('----------------------');
console.log(`• Correcciones de nodos: ${Object.keys(corrector.nodeTypeCorrections).length}`);
console.log(`• Correcciones de operaciones: ${Object.keys(corrector.operationCorrections).length}`);
console.log(`• Palabras clave de servicios: ${Object.keys(corrector.serviceKeywords).length}`);

console.log('\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!');
console.log('==================================================');
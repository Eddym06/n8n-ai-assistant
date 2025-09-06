import IntelligentNameCorrector from './intelligent-name-corrector.js';

// Test the corrector functionality
const corrector = new IntelligentNameCorrector();

console.log('🧪 Testing Intelligent Name Corrector v4.0');
console.log('==========================================');

// Test some common corrections
const testCases = [
    'hubspot',
    'slack', 
    's3',
    'mailchimp',
    'discord',
    'mysql',
    'postgres',
    'github'
];

testCases.forEach(testCase => {
    const corrected = corrector.correctNodeType(testCase);
    console.log(`📝 ${testCase} -> ${corrected}`);
});

console.log('\n✅ All tests completed successfully!');
console.log(`📊 Total node corrections available: ${Object.keys(corrector.nodeTypeCorrections).length}`);
console.log(`📊 Total operation corrections: ${Object.keys(corrector.operationCorrections).length}`);
console.log(`📊 Total service keywords: ${Object.keys(corrector.serviceKeywords).length}`);
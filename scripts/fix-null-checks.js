const fs = require('fs');

let content = fs.readFileSync('extension server models.js', 'utf8');

// Reemplazar todas las instancias restantes
content = content.replace(
  /triggerTypes\.some\(trigger => node\.type\.toLowerCase\(\)\.includes\(trigger\.toLowerCase\(\)\)\)/g,
  "triggerTypes.some(trigger => (node.type || '').toLowerCase().includes(trigger.toLowerCase()))"
);

content = content.replace(
  /outputTypes\.some\(output => node\.type\.toLowerCase\(\)\.includes\(output\.toLowerCase\(\)\)\)/g,
  "outputTypes.some(output => (node.type || '').toLowerCase().includes(output.toLowerCase()))"
);

fs.writeFileSync('extension server models.js', content);
console.log('✅ Reemplazos masivos completados');

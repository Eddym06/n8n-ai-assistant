import autoScraper from './auto-scraper-intelligent.js';

console.log('🚀 Iniciando Auto-Scraper N8N...');

async function main() {
    try {
        await autoScraper.startAutoScraping();
    } catch (error) {
        console.error('❌ Error en el auto-scraper:', error);
        process.exit(1);
    }
}

main();
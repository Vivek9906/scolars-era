const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://kennedy.edu.eu/BDiv-in-Business').then(r => {
    const $ = cheerio.load(r.data);
    
    // We noticed the sections are structured with specific headings.
    // Let's print out all the text content from the page in a structured way to see the layout.
    // The headings are usually in a specific class or style.
    
    // First, let's just extract all spans with font-family
    const lines = [];
    $('span[style*="font-family"]').each((i, el) => {
        const text = $(el).text().trim();
        if (text) lines.push(text);
    });
    
    console.log("----- SPAN TEXT -----");
    console.log(lines.join('\n'));
    
}).catch(console.error);

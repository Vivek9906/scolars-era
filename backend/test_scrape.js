const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
    try {
        const res = await axios.get('https://kennedy.edu.eu/BDiv-in-Business');
        const $ = cheerio.load(res.data);
        
        let htmlSnippet = '';
        $('span').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes('BDBA')) {
                htmlSnippet += $.html($(el).parent()) + '\n\n';
            }
        });
        console.log("Snippet:", htmlSnippet.substring(0, 1000));
        
        // Let's also find where 'ACADEMIC CURRICULUM' starts
        let found = false;
        $('div, span, p').each((i, el) => {
            if ($(el).text().trim() === 'ACADEMIC CURRICULUM') {
                found = true;
                console.log("Found ACADEMIC CURRICULUM element:", el.tagName);
                // Print next siblings
                console.log($.html($(el).parent().parent().next()));
            }
        });
    } catch(e) {
        console.error(e.message);
    }
}
testScrape();

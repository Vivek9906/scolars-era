const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    const urls = [
        'https://kennedy.edu.eu/Bachelor-Program',
        'https://kennedy.edu.eu/Master-Program',
        'https://kennedy.edu.eu/Doctorate-Program'
    ];
    
    for (const url of urls) {
        try {
            const res = await axios.get(url);
            const $ = cheerio.load(res.data);
            const links = [];
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                let text = $(el).text().trim();
                // Filter out non-program links
                if (href && (href.startsWith('/BDiv') || href.startsWith('/MDiv') || href.startsWith('/DDiv') || href.startsWith('/Ba-in') || href.startsWith('/Ma-in') || href.startsWith('/Da-in') || href.startsWith('/B-in') || href.startsWith('/M-in') || href.startsWith('/D-in') || href.includes('-in-'))) {
                    // Avoid duplicates and obvious menu links
                    if (!links.some(l => l.href === href) && !href.includes('Bachelor-Program') && !href.includes('Master-Program') && !href.includes('Doctorate-Program')) {
                        // Sometimes text is empty if it's an image link
                        if (!text) {
                            text = href.split('-in-')[1] || href;
                        }
                        links.push({ href, text });
                    }
                }
            });
            console.log(`\nFound links for ${url}:`);
            links.forEach(l => console.log(l.href, "-", l.text));
        } catch(e) {
            console.error(e.message);
        }
    }
}
run();

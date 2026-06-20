dudeconst axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    const urls = [
        'https://www.kennedy.edu.eu/Bachelor-Program',
        'https://www.kennedy.edu.eu/Master-Program',
        'https://www.kennedy.edu.eu/Doctorate-Program'
    ];
    for (const url of urls) {
        try {
            const res = await axios.get(url);
            const $ = cheerio.load(res.data);
            const programs = [];
            $('.item .cl_caption span.fsize24').each((i, el) => {
                const text = $(el).text().trim();
                if(text) programs.push(text);
            });
            console.log(`\nPrograms for ${url}:`);
            console.log([...new Set(programs)]);
        } catch(e){
            console.log(e.message);
        }
    }
}
run();

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, '../frontend/university.html');
let content = fs.readFileSync(htmlPath, 'utf8');

const $ = cheerio.load(content, { decodeEntities: false });

// Rename universities-list-grid to universitiesGrid and empty it
const grid = $('.universities-list-grid');
if (grid.length > 0) {
  grid.empty();
  grid.attr('id', 'universitiesGrid');
}

// Add the JS file
if ($('script[src="/assets/js/university.js"]').length === 0) {
  $('body').append('<script src="/assets/js/university.js"></script>');
}

fs.writeFileSync(htmlPath, $.html());
console.log('Fixed university.html');

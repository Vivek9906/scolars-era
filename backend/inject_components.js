const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const frontendDir = path.join(__dirname, '../frontend');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'components') { // skip the components folder
          fileList = getAllHtmlFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(frontendDir);

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  const $ = cheerio.load(content, { decodeEntities: false });

  if ($('nav.navbar').length > 0) {
    $('nav.navbar').replaceWith('<div id="header-placeholder"></div>');
    modified = true;
  }

  if ($('footer').length > 0) {
    $('footer').replaceWith('<div id="footer-placeholder"></div>');
    modified = true;
  }
  
  // also check if top-bar is lingering in other pages
  if ($('.top-bar').length > 0) {
    $('.top-bar').remove();
    modified = true;
  }
  
  if ($('.ticker-wrapper').length > 0) {
    // Wait, the user said "Remove upper banner completely. Keep only one."
    // Maybe they meant keep ticker-wrapper?
    // In index.html we removed top-bar and kept ticker-wrapper. Let's ensure ticker is in header or left alone.
    // Actually we didn't include ticker-wrapper in header.html. Let's just leave it alone here.
  }

  // Insert script before </body>
  if (modified) {
    if ($('script[src="/assets/js/components.js"]').length === 0) {
        $('body').append('<script src="/assets/js/components.js"></script>');
    }
    fs.writeFileSync(file, $.html());
    console.log("Injected components placeholders into " + file);
  }
}

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const frontendDir = path.join(__dirname, '../frontend');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fileList = getAllHtmlFiles(fullPath, fileList);
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

  if ($('.top-banner').length > 0) {
    $('.top-banner').remove();
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, $.html());
    console.log("Removed .top-banner from " + file);
  }
}

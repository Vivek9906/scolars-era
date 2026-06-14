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
const brokenLinks = [];

function fileExistsCaseSensitive(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  if (!fs.existsSync(dir)) return false;
  const files = fs.readdirSync(dir);
  return files.includes(base);
}

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(content);
  
  $('a').each((_, el) => {
    let href = $(el).attr('href');
    if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#' && href !== '/#' && !href.startsWith('javascript:')) {
      // Remove query params and hashes for checking file existence
      href = href.split('?')[0].split('#')[0];
      
      if (!href || href === '/') return;

      let targetPath;
      if (href.startsWith('/')) {
        targetPath = path.join(frontendDir, href);
      } else {
        targetPath = path.resolve(path.dirname(file), href);
      }
      
      let exists = fileExistsCaseSensitive(targetPath);
      if (!exists && fileExistsCaseSensitive(targetPath + '.html')) exists = true;
      if (!exists && fileExistsCaseSensitive(path.join(targetPath, 'index.html'))) exists = true;
      
      if (!exists) {
        brokenLinks.push({ file: path.relative(frontendDir, file), href });
      }
    }
  });
}

console.log("Broken/Case-Mismatched Links Found:", brokenLinks);

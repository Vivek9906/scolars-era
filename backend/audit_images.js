const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(file));
    } else if(file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(path.join(__dirname, '../frontend'));
let images = new Set();
let fileMapping = {};

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const src = match[1];
    images.add(src);
    if (!fileMapping[src]) fileMapping[src] = [];
    fileMapping[src].push(f);
  }
});

const missingImages = [];
Array.from(images).forEach(src => {
  if (src.startsWith('http')) return; // skip external
  if (src.startsWith('data:')) return; // skip base64
  
  let imgPath = src;
  if (src.startsWith('/')) {
    imgPath = path.join(__dirname, '../frontend', src);
  } else {
    // try to guess if it's relative
    imgPath = path.join(__dirname, '../frontend', src);
  }
  
  // Clean up query params if any
  imgPath = imgPath.split('?')[0];

  if (!fs.existsSync(imgPath)) {
    missingImages.push({ src, files: fileMapping[src] });
  }
});

console.log(JSON.stringify(missingImages, null, 2));

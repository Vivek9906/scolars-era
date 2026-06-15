const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const htmlFiles = walk('frontend');
let count = 0;

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  let original = html;
  
  // Replace the broken href with the correct one
  html = html.replace(/href="\d{13}"/g, 'href="/assets/css/style.css?v=' + Date.now() + '"');
  
  // Just in case it got corrupted differently, also fix href="?v=..."
  html = html.replace(/href="\?v=\d{13}"/g, 'href="/assets/css/style.css?v=' + Date.now() + '"');

  if (html !== original) {
    fs.writeFileSync(file, html);
    count++;
  }
}

console.log('Restored style.css link in ' + count + ' HTML files.');

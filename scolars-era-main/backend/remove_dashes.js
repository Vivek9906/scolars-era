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
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../frontend'));

let filesModified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace " — " (space em-dash space) with " | " if inside <title>, otherwise " "
  // Actually, replacing all " — ", " - ", " – " with " " or "" as requested:
  // "remove "-" and the em dashes"
  
  // Replace em dashes and en dashes with spaces
  content = content.replace(/ — /g, ' ');
  content = content.replace(/ – /g, ' ');
  content = content.replace(/—/g, ' ');
  content = content.replace(/–/g, ' ');
  
  // Replace spaced hyphens with spaces
  content = content.replace(/ - /g, ' ');

  if (content !== original) {
    fs.writeFileSync(file, content);
    filesModified++;
    console.log('Removed dashes in:', file);
  }
});

console.log('Total files modified:', filesModified);

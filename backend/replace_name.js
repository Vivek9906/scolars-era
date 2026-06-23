const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../frontend');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fileList = getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(frontendDir);
const textExtensions = ['.html', '.js', '.css', '.json', '.txt'];

for (const file of allFiles) {
  const ext = path.extname(file).toLowerCase();
  if (textExtensions.includes(ext)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace Scolars Lift -> Scholars Lift
    content = content.replace(/Scolars Lift/g, 'Scholars Lift');
    content = content.replace(/scolars lift/g, 'scholars lift');
    content = content.replace(/Scolars lift/g, 'Scholars lift');
    content = content.replace(/scolars Lift/g, 'scholars Lift');
    
    // Replace standalone Scolars -> Scholars, but careful not to replace in scolars-era path
    // Actually, replacing `Scolars` with `Scholars` is safe because `Scolars` has capital S, 
    // and folder name is `scolars-era` (lowercase).
    content = content.replace(/Scolars/g, 'Scholars');
    
    // Replace scolar-logo.jpeg with scholars-logo.jpeg
    content = content.replace(/scolar-logo\.jpeg/g, 'scholars-logo.jpeg');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log("Updated names in " + file);
    }
  }
}

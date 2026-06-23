const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../frontend');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fileList = getAllFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(frontendDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/\?v=20260624_0000/g, '?v=20260624_0016');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
}
console.log('Cache busters updated for mobile banner hide');

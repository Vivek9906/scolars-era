const fs = require('fs');
const path = require('path');

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

const localImages = [
  '/assets/images/course_edu.png',
  '/assets/images/course_sci.png',
  '/assets/images/course_tech.png',
  '/assets/images/course_campus.png',
  '/assets/images/course1.jpeg'
];

let imgIndex = 0;

function getNextImage() {
  const img = localImages[imgIndex % localImages.length];
  imgIndex++;
  return img;
}

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Replace all Unsplash images with local images
  content = content.replace(/https:\/\/images\.unsplash\.com\/[^"']+/g, (match) => {
    modified = true;
    return getNextImage();
  });

  // Also replace any onerror that points to unsplash
  content = content.replace(/this\.src=['"]https:\/\/images\.unsplash\.com\/[^"']+['"]/g, (match) => {
    modified = true;
    return "this.src='/assets/images/scolar-logo.jpeg'";
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated images in ${file.replace(frontendDir, '')}`);
  }
}
console.log("All Unsplash images replaced with local fallbacks.");

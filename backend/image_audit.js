const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sharp = require('sharp'); // Available in backend/package.json

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

async function processImages() {
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });
    let modified = false;

    const imgPromises = $('img').map(async (_, el) => {
      let src = $(el).attr('src');
      if (!src) return;

      // Ensure fallback handler exists
      if (!$(el).attr('onerror')) {
        $(el).attr('onerror', "this.onerror=null;this.src='/assets/images/placeholder.png'");
        modified = true;
      }

      // Add loading attribute
      // Heuristic: If it's in a header, hero, or is a logo at the top, eager load it
      const classStr = ($(el).attr('class') || '') + ' ' + ($(el).parent().attr('class') || '');
      if (classStr.toLowerCase().includes('hero') || classStr.toLowerCase().includes('logo')) {
        if ($(el).attr('loading') !== 'eager') {
          $(el).attr('loading', 'eager');
          modified = true;
        }
      } else {
        if ($(el).attr('loading') !== 'lazy') {
          $(el).attr('loading', 'lazy');
          modified = true;
        }
      }

      // Resolve local image path to add width/height
      if (src.startsWith('/') || src.startsWith('.')) {
        let imgPath;
        if (src.startsWith('/')) {
          imgPath = path.join(frontendDir, src);
        } else {
          imgPath = path.resolve(path.dirname(file), src);
        }

        // Handle case mismatch or broken url by finding actual file
        if (fs.existsSync(imgPath)) {
          try {
            const metadata = await sharp(imgPath).metadata();
            if (metadata.width && metadata.height) {
              if (!$(el).attr('width')) {
                $(el).attr('width', metadata.width);
                modified = true;
              }
              if (!$(el).attr('height')) {
                $(el).attr('height', metadata.height);
                modified = true;
              }
            }
          } catch (e) {
            console.error("Failed to read image " + imgPath + ": " + e.message);
          }
        } else {
          console.warn("Broken image path found in " + file + ": " + src);
          // Replace broken url with placeholder
          $(el).attr('src', '/assets/images/placeholder.png');
          modified = true;
        }
      }
    }).get();

    await Promise.all(imgPromises);

    if (modified) {
      fs.writeFileSync(file, $.html());
      console.log("Updated images in " + file);
    }
  }
}

// Ensure placeholder exists
const placeholderPath = path.join(frontendDir, 'assets/images/placeholder.png');
if (!fs.existsSync(placeholderPath)) {
    fs.mkdirSync(path.dirname(placeholderPath), { recursive: true });
    // create a simple 1x1 transparent png for placeholder
    const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    fs.writeFileSync(placeholderPath, Buffer.from(base64Pixel, 'base64'));
}

processImages().then(() => console.log("Image audit complete.")).catch(console.error);

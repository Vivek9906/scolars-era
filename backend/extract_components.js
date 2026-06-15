const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const frontendDir = path.join(__dirname, '../frontend');
const componentsDir = path.join(frontendDir, 'components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

const indexContent = fs.readFileSync(path.join(frontendDir, 'index.html'), 'utf8');
const $ = cheerio.load(indexContent, { decodeEntities: false });

const headerHtml = $('nav.navbar').prop('outerHTML');
const footerHtml = $('footer').prop('outerHTML');

if (headerHtml) {
  fs.writeFileSync(path.join(componentsDir, 'header.html'), headerHtml);
  console.log("Extracted header.html");
}
if (footerHtml) {
  fs.writeFileSync(path.join(componentsDir, 'footer.html'), footerHtml);
  console.log("Extracted footer.html");
}

// Write the components.js loader
const jsDir = path.join(frontendDir, 'assets/js');
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

const componentsJs = `
document.addEventListener('DOMContentLoaded', async () => {
    async function loadComponent(id, url) {
        const el = document.getElementById(id);
        if (el) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    el.innerHTML = await response.text();
                }
            } catch (e) {
                console.error('Failed to load component', url, e);
            }
        }
    }

    await loadComponent('header-placeholder', '/components/header.html');
    await loadComponent('footer-placeholder', '/components/footer.html');
});
`;

fs.writeFileSync(path.join(jsDir, 'components.js'), componentsJs);
console.log("Created components.js");

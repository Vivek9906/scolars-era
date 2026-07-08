const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\bhard\\.gemini\\antigravity-ide\\brain\\da0b9844-f72a-442e-9bcf-40873a2fdc6a\\.system_generated\\steps\\294\\content.md', 'utf8');

const regex = /<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
let match;
const links = [];
while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  const text = match[2].trim();
  if (text.length > 5 && text.length < 100 && url.startsWith('/')) {
    links.push({ text, url });
  }
}
console.log(links);

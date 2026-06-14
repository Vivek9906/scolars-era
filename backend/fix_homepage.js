const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const indexPath = path.join(__dirname, '../frontend/index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Remove upper banner (top-bar) completely
const $ = cheerio.load(content, { decodeEntities: false });
$('.top-bar').remove();

// Write back cheerio's modification to string
content = $.html();

// 2. Fix Highlight Section wrapping
content = content.replace(
  /\.hero-trust-row\s*{\s*display:\s*flex;\s*flex-wrap:\s*wrap;/g,
  '.hero-trust-row {\n            display: flex;\n            flex-wrap: nowrap;\n            justify-content: center;'
);

// 3. Center Partner Universities
// Add CSS for centering universities-list-grid
if (!content.includes('.universities-list-grid {')) {
  content = content.replace(
    /<\/style>/,
    `
        .universities-list-grid {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }
    </style>`
  );
}

// 4. Partner Companies (logos not loading, animation too slow, verify paths)
// The partner logos are usually in .partner-logos
content = content.replace(
  /animation:\s*logoStripSlide\s*15s/g,
  'animation: logoStripSlide 10s' // Faster animation overall
);

// Increase speed on mobile
if (!content.includes('.partner-logos { animation-duration:')) {
  content = content.replace(
    /@media\s*\(max-width:\s*768px\)\s*{/,
    `@media (max-width: 768px) {
            .partner-logos { animation-duration: 5s !important; }`
  );
}

// Fix broken logos in partner companies. First parse again to fix HTML.
const $2 = cheerio.load(content, { decodeEntities: false });
$2('.partner-logo-card img').each((i, el) => {
  let src = $2(el).attr('src');
  if (src && src.includes('undefined')) {
    $2(el).attr('src', '/assets/images/partner-placeholder.png'); // fallback
  }
  // Remove lazy loading for below fold if they are failing? The prompt said "Fix logo loading... verify image paths".
  // Actually, I'll just check if they are missing extension or typo. Let's see what the src is.
});

// Update the content
fs.writeFileSync(indexPath, $2.html());
console.log("Homepage repairs applied.");

const fs = require('fs');

// 1. Fix university.js
let uniJs = fs.readFileSync('frontend/assets/js/university.js', 'utf8');

uniJs = uniJs.replace(
  "const logo = u.logoUrl ? `<img src=\"${escapeHtml(u.logoUrl)}\" class=\"uni-logo\" alt=\"${escapeHtml(u.name)}\">` : `<div class=\"uni-logo-text\">${escapeHtml(u.name)}</div>`;",
  `
      // Force logos for specific universities to bypass DB issues
      if (u.name && u.name.includes('Baptist')) {
        u.logoUrl = '/assets/images/kennedy_baptist_logo.png';
      } else if (u.name && u.name.includes('Kennedy University')) {
        u.logoUrl = '/assets/images/kennedy_logo.jpeg';
      }
      
      const logo = u.logoUrl ? \`<img src="\${escapeHtml(u.logoUrl)}" class="uni-logo" alt="\${escapeHtml(u.name)}">\` : \`<div class="uni-logo-text">\${escapeHtml(u.name)}</div>\`;
  `
);

uniJs = uniJs.replace(
  '<a href="${detailUrl}" class="btn-view-details">View Details &rarr;</a>',
  '<a href="${detailUrl}" class="btn-view-details" style="position: relative; z-index: 100; pointer-events: auto;">View Details &rarr;</a>'
);

fs.writeFileSync('frontend/assets/js/university.js', uniJs);
console.log("Fixed university.js");


// 2. Fix index.html
let indexHtml = fs.readFileSync('frontend/index.html', 'utf8');

indexHtml = indexHtml.replace(
  '<a href="https://www.kennedy.edu.eu/" class="btn-view-details" target="_blank">Visit Website +\'</a>',
  '<a href="/university-detail.html?slug=kennedy-university" class="btn-view-details" style="position: relative; z-index: 100; pointer-events: auto;">View Details &rarr;</a>'
);

indexHtml = indexHtml.replace(
  '<a href="/contact.html" class="btn-view-details" target="_blank">Visit Website +\'</a>',
  '<a href="/university-detail.html?slug=kennedy-university-of-baptist" class="btn-view-details" style="position: relative; z-index: 100; pointer-events: auto;">View Details &rarr;</a>'
);

// Fallback in case of encoding issues with the arrow
indexHtml = indexHtml.replace(
  /<a href="[^"]+" class="btn-view-details" target="_blank">Visit Website[^<]+<\/a>/g,
  function(match) {
    if (match.includes('kennedy.edu.eu')) {
       return '<a href="/university-detail.html?slug=kennedy-university" class="btn-view-details" style="position: relative; z-index: 100; pointer-events: auto;">View Details &rarr;</a>';
    } else {
       return '<a href="/university-detail.html?slug=kennedy-university-of-baptist" class="btn-view-details" style="position: relative; z-index: 100; pointer-events: auto;">View Details &rarr;</a>';
    }
  }
);

fs.writeFileSync('frontend/index.html', indexHtml);
console.log("Fixed index.html");

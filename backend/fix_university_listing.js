const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const frontendDir = path.join(__dirname, '../frontend');
const htmlPath = path.join(frontendDir, 'university.html');
const jsPath = path.join(frontendDir, 'assets/js/university.js');

// 1. Update university.html
let content = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(content, { decodeEntities: false });

const grid = $('#universities-grid');
if (grid.length > 0) {
  // Empty the static content
  grid.empty();
  grid.attr('id', 'universitiesGrid'); // or keep it the same, let's keep universitiesGrid for JS
} else {
  // if not found by id, find by class
  const gridByClass = $('.universities-list-grid');
  if (gridByClass.length > 0) {
      gridByClass.empty();
      gridByClass.attr('id', 'universitiesGrid');
  }
}

// Add script tag if missing
if ($('script[src="/assets/js/university.js"]').length === 0) {
  $('body').append('<script src="/assets/js/university.js"></script>');
}

fs.writeFileSync(htmlPath, $.html());
console.log('Updated university.html to use dynamic grid');

// 2. Create university.js
const jsContent = 'use strict';

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll(\'"\', "&quot;")
    .replaceAll("\'", "&#039;");
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("universitiesGrid");
  if (!grid) return;
  
  grid.innerHTML = \'<div style="text-align:center;width:100%;padding:40px;">Loading universities...</div>\';

  try {
    const res = await fetch(\'/api/universities\');
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    const universities = result.data || [];
    
    if (universities.length === 0) {
      grid.innerHTML = \'<div style="text-align:center;width:100%;padding:40px;">No universities found.</div>\';
      return;
    }
    
    grid.innerHTML = universities.map(u => {
      const detailUrl = u.slug ? "/university-detail.html?slug=" + encodeURIComponent(u.slug) : "/university-detail.html?id=" + encodeURIComponent(u._id);
      const type = u.partnershipType ? escapeHtml(u.partnershipType) : \'Partner University\';
      const logo = u.logoUrl ? \'<img src="\' + escapeHtml(u.logoUrl) + \'" class="uni-logo" alt="\' + escapeHtml(u.name) + \'">\' : \'<div class="uni-logo-text">\' + escapeHtml(u.name) + \'</div>\';
      
      return \'<div class="university-card">\' +
          logo +
          \'<div class="uni-meta" style="margin-top: 15px; font-size: 13px; color: #666;">\' +
              \'<span class="uni-type">\' + type + \'</span>\' +
          \'</div>\' +
          \'<h3>\' + escapeHtml(u.name) + \'</h3>\' +
          \'<p><i class="fas fa-map-marker-alt"></i> \' + escapeHtml(u.country || \'Global\') + \'</p>\' +
          \'<p style="font-size: 14px; line-height: 1.6; color: #555; margin-bottom: 20px;">\' +
            escapeHtml(u.shortDescription || u.description || \'A globally recognized institution offering accredited programmes across various disciplines.\') +
          \'</p>\' +
          \'<a href="\' + detailUrl + \'" class="btn-view-details">View Details &rarr;</a>\' +
        \'</div>\';
    }).join(\'\');
    
  } catch (err) {
    console.error(err);
    grid.innerHTML = \'<div style="text-align:center;width:100%;padding:40px;color:red;">Error loading universities. Please try again later.</div>\';
  }
});
';

fs.writeFileSync(jsPath, jsContent);
console.log('Created frontend/assets/js/university.js');

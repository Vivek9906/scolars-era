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
    } else {
      if (file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const htmlFiles = walk('frontend');
let modifiedCount = 0;

const guaranteedCSS = `
<style>
/* ── GUARANTEED GLOBAL FIXES ──────────────────────────────────────────────── */
.nav-item.has-dropdown {
    position: relative !important;
}
.nav-dropdown {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    background: #ffffff !important;
    border-radius: 8px !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
    min-width: 220px !important;
    padding: 10px 0 !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateY(10px) !important;
    transition: all 0.3s ease !important;
    z-index: 9999 !important;
    display: block !important;
    list-style: none !important;
    margin: 0 !important;
}
.nav-item.has-dropdown:hover .nav-dropdown {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
}
.nav-dropdown li a {
    display: block !important;
    padding: 10px 20px !important;
    color: #333 !important;
    text-decoration: none !important;
    font-weight: 500 !important;
    font-size: 15px !important;
    border-radius: 6px !important;
}
.nav-dropdown li a:hover {
    background: #f4fdfa !important;
    color: #0d5c4a !important;
}
.nav-dropdown li a .drop-title {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}
.ticker-track {
    animation: tickerScroll 20s linear infinite !important;
}
@keyframes tickerScroll {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-100%, 0, 0); }
}
.ticker-wrapper:hover .ticker-track {
    animation-play-state: paused !important;
}
</style>
`;

const cacheBustStr = '?v=' + Date.now();

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  let originalHtml = html;

  // 1. Cache bust style.css
  html = html.replace(/href="(\/assets\/css\/style\.css)(?:\?v=\d+)?"/g, 'href="$1' + cacheBustStr + '"');

  // 2. Inject guaranteed CSS right before </head>
  if (!html.includes('/* ── GUARANTEED GLOBAL FIXES')) {
    html = html.replace('</head>', guaranteedCSS + '\n</head>');
  }

  // 3. Fix the ticker again just to be 100% sure the HTML is correct and visible
  // We'll remove padding-left: 100% so it's not totally invisible if animation fails.
  const fixedTicker = `  <!-- Top Bar -->
  <div class="ticker-wrapper" style="background: #0d5c4a; color: #fff; padding: 8px 0; overflow: hidden; white-space: nowrap; width: 100%; position: relative; z-index: 1000; display: block; height: 35px; box-sizing: border-box;">
    <div class="ticker-track" style="display: inline-block; white-space: nowrap;">
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-phone-alt" style="margin-right: 5px; color: #f0a500;"></i> +44 7386814150</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem; font-weight: bold;"><i class="fas fa-bullhorn" style="margin-right: 5px; color: #f0a500;"></i> Admissions open for 2025 intake</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
    </div>
  </div>`;

  // Replace the ticker we added in the previous step
  html = html.replace(/<div class="ticker-wrapper" style="background: #0d5c4a;[^>]+>[\s\S]*?<\/div>\s*<\/div>/, fixedTicker);

  if (html !== originalHtml) {
    fs.writeFileSync(file, html);
    modifiedCount++;
  }
}

console.log('Force-fixed caching, CSS, and ticker in ' + modifiedCount + ' HTML files.');

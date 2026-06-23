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

// The new seamless ticker HTML structure
// Note: We use flexbox and two identical blocks for seamless looping.
// We translate to -50% to make it seamless.
const seamlessTicker = `  <!-- Top Bar -->
  <div class="ticker-wrapper" style="background: #0d5c4a; color: #fff; padding: 8px 0; overflow: hidden; width: 100%; position: relative; z-index: 1000; display: flex; height: 35px; box-sizing: border-box;">
    <div class="ticker-track seamless-track" style="display: flex; white-space: nowrap; width: max-content;">
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-phone-alt" style="margin-right: 5px; color: #f0a500;"></i> +44 7386814150</span>
        
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-phone-alt" style="margin-right: 5px; color: #f0a500;"></i> +44 7386814150</span>
        
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-phone-alt" style="margin-right: 5px; color: #f0a500;"></i> +44 7386814150</span>
        
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
        <span class="ticker-item" style="padding: 0 3rem;"><i class="fas fa-phone-alt" style="margin-right: 5px; color: #f0a500;"></i> +44 7386814150</span>
    </div>
  </div>`;

// To make the animation seamless, we translate from 0 to -50% 
// Because the content is repeated 4 times, -50% means it scrolled halfway through exactly duplicating itself.
const seamlessCSS = `
<style>
/* ── SEAMLESS TICKER FIX ──────────────────────────────────────────────── */
.seamless-track {
    animation: seamlessScroll 25s linear infinite !important;
}
@keyframes seamlessScroll {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
}
.ticker-wrapper:hover .seamless-track {
    animation-play-state: paused !important;
}
</style>
`;

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  let originalHtml = html;

  // Replace the old ticker wrapper with the new seamless one
  html = html.replace(/<div class="ticker-wrapper" style="background: #0d5c4a;[^>]+>[\s\S]*?<\/div>\s*<\/div>/, seamlessTicker);

  // Inject seamless CSS right before </head> if not already there
  if (!html.includes('/* ── SEAMLESS TICKER FIX ──')) {
    html = html.replace('</head>', seamlessCSS + '\n</head>');
  }

  if (html !== originalHtml) {
    fs.writeFileSync(file, html);
    modifiedCount++;
  }
}

console.log('Fixed ticker looping in ' + modifiedCount + ' HTML files.');

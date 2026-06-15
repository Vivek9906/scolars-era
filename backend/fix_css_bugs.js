const fs = require('fs');
const path = require('path');

const files = [
  'bachelor.html',
  'master.html',
  'doctoral.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../frontend/programs', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Revert incorrect color replacements for original sections
  content = content.replace(/\.section-apply \{ padding: 80px 0; background: #0d5c4a; color: #0d5c4a; \}/g, '.section-apply { padding: 80px 0; background: #0d5c4a; color: #fff; }');
  content = content.replace(/\.section-apply h2 \{ font-size: 32px; font-weight: 800; color: #0d5c4a; margin-bottom: 50px; text-align: center; \}/g, '.section-apply h2 { font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 50px; text-align: center; }');
  content = content.replace(/\.section-cta-band \.btn \{ background: #0d5c4a; color: #0d5c4a; padding: 15px 35px;/g, '.section-cta-band .btn { background: #0d5c4a; color: #fff; padding: 15px 35px;');
  
  // Fix button hover text colors
  content = content.replace(/\.stack-btn:hover \{ background: #fff; color: #000; border-color: #0d5c4a;/g, '.stack-btn:hover { background: #0d5c4a; color: #fff; border-color: #0d5c4a;');

  fs.writeFileSync(filePath, content);
  console.log('Fixed css bugs in ' + file);
});

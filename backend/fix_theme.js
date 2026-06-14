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

  // Change CSS block
  content = content.replace(/background: #000;/g, 'background: #ffffff;');
  content = content.replace(/color: #fff;/g, 'color: #0d5c4a;');
  content = content.replace(/color: rgba\(255,255,255,0\.6\);/g, 'color: #555;');
  content = content.replace(/color: rgba\(255,255,255,0\.05\);/g, 'color: rgba(13,92,74,0.08);');
  content = content.replace(/color: rgba\(255,255,255,0\.7\);/g, 'color: #444;');
  content = content.replace(/border-top: 1px solid rgba\(255,255,255,0\.05\);/g, 'border-top: 1px solid #eee;');
  content = content.replace(/border: 1px solid rgba\(255,255,255,0\.2\);/g, 'border: 1px solid #0d5c4a;');
  content = content.replace(/border: 1px solid rgba\(255,255,255,0\.05\);/g, 'border: 1px solid #ddd;');
  content = content.replace(/box-shadow: 0 -20px 50px rgba\(0,0,0,0\.6\);/g, 'box-shadow: 0 -10px 40px rgba(0,0,0,0.08);');
  content = content.replace(/\.stack-btn:hover \{ background: #fff; color: #000; border-color: #fff;/g, '.stack-btn:hover { background: #0d5c4a; color: #fff; border-color: #0d5c4a;');
  content = content.replace(/\.stack-btn \{[\s\S]*?color: #fff;[\s\S]*?\}/, match => match.replace('color: #fff;', 'color: #0d5c4a; background: transparent;'));

  // Change inline backgrounds
  content = content.replace(/style="background-color: #[0-9a-f]{6};/g, (match) => {
    // We alternate #ffffff and #f7f7f7 based on some random logic, or just make them all white
    // actually let's just make them all white with a subtle border, or alternate
    return 'style="background-color: #ffffff;';
  });

  // Since we replace all inline backgrounds to #ffffff, let's alternate them manually
  let index = 0;
  content = content.replace(/style="background-color: #ffffff;/g, (match) => {
    const bg = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
    index++;
    return `style="background-color: ${bg};`;
  });

  fs.writeFileSync(filePath, content);
  console.log('Fixed theme for ' + file);
});

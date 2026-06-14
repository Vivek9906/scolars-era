const fs = require('fs');
const path = require('path');

// 1. Fix publication-support.html
const pubPath = path.join(__dirname, '../frontend/services/publication-support.html');
let pubContent = fs.readFileSync(pubPath, 'utf8');

// Remove sidebar and replace asym-layout with standard container
pubContent = pubContent.replace(/<div class="asym-layout">[\s\S]*?<div class="asym-sidebar">[\s\S]*?<\/div>\s*<div class="asym-content">/, '<div class="container" style="padding: 60px 20px;">');
// The closing </div> for asym-layout matches the one for asym-content now, so we just leave it.
// Or we can just let it close the container.

// Let's actually remove the .asym-layout and .asym-sidebar CSS
pubContent = pubContent.replace(/\.asym-layout\s*\{[\s\S]*?\}/g, '');
pubContent = pubContent.replace(/\.asym-sidebar\s*\{[\s\S]*?\}/g, '');
pubContent = pubContent.replace(/\.vert-title\s*\{[\s\S]*?\}/g, '');
pubContent = pubContent.replace(/\.asym-content\s*\{[\s\S]*?\}/g, '');

fs.writeFileSync(pubPath, pubContent);
console.log('Fixed publication-support.html');

// 2. Fix phd-guidance.html
const phdPath = path.join(__dirname, '../frontend/services/phd-guidance.html');
let phdContent = fs.readFileSync(phdPath, 'utf8');

// Replace dark colors with white/green/yellow
phdContent = phdContent.replace(/background:\s*#0f1a18;/g, 'background: #ffffff;');
phdContent = phdContent.replace(/color:\s*#fff;/g, 'color: #333;');
phdContent = phdContent.replace(/color:\s*white;/gi, 'color: #333;');
phdContent = phdContent.replace(/color:\s*#ccc;/g, 'color: #555;');
phdContent = phdContent.replace(/color:\s*#aaa;/g, 'color: #666;');

// Remove navbar overrides completely
phdContent = phdContent.replace(/\.navbar\s*\{[\s\S]*?\}/g, '');
phdContent = phdContent.replace(/\.nav-links a\s*\{[\s\S]*?\}/g, '');
phdContent = phdContent.replace(/\.logo-text\s*\{[\s\S]*?\}/g, '');
phdContent = phdContent.replace(/\/\* Override global styles[\s\S]*?\.cta-band\s*\{[\s\S]*?\}/, '');

// Update specific elements that were dark
phdContent = phdContent.replace(/background:\s*#1a2c28;/g, 'background: #f9f9f9;');
phdContent = phdContent.replace(/background:\s*#1a1a1a;/g, 'background: #f4f4f4;');
phdContent = phdContent.replace(/border-left:\s*2px solid #0d5c4a;/g, 'border-left: 2px solid #f0a500;');
phdContent = phdContent.replace(/border:\s*4px solid #0f1a18;/g, 'border: 4px solid #fff;');
phdContent = phdContent.replace(/border-bottom:\s*1px solid #1a2c28;/g, 'border-bottom: 1px solid #eee;');
phdContent = phdContent.replace(/color: white;/g, 'color: #333;');
phdContent = phdContent.replace(/color: #fff;/g, 'color: #333;');
phdContent = phdContent.replace(/<h3 style=".*?color: #fff;.*?">/g, '<h3 style="font-size: 32px; color: #0d5c4a; text-align: center; margin-bottom: 50px;">');
phdContent = phdContent.replace(/<h2 style="color: white;/g, '<h2 style="color: #fff;'); // Keep CTA white text if background is green

fs.writeFileSync(phdPath, phdContent);
console.log('Fixed phd-guidance.html');

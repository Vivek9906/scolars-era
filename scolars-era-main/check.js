const fs = require('fs');
const path = require('path');
const htmlDir = path.join(process.cwd(), 'frontend');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
const errors = [];

files.forEach(f => {
    const content = fs.readFileSync(path.join(htmlDir, f), 'utf-8');
    const links = [...content.matchAll(/href=["']([^"']+)["']/g)];
    const srcs = [...content.matchAll(/src=["']([^"']+)["']/g)];
    
    links.forEach(m => {
        let link = m[1];
        if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:')) return;
        if (link === '/') return;
        if (link.startsWith('/')) link = link.slice(1);
        link = link.split('?')[0];
        const p = path.join(htmlDir, link);
        if (!fs.existsSync(p)) errors.push('Broken link in ' + f + ': ' + link);
    });

    srcs.forEach(m => {
        let src = m[1];
        if (src.startsWith('http') || src.startsWith('data:')) return;
        if (src.startsWith('/')) src = src.slice(1);
        src = src.split('?')[0];
        const p = path.join(htmlDir, src);
        if (!fs.existsSync(p)) errors.push('Broken src in ' + f + ': ' + src);
    });
});
console.log(errors.length ? errors.join('\n') : 'No broken internal links/srcs found!');

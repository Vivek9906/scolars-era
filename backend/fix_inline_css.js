const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Fix .universities-list-grid inside index.html
html = html.replace(/\.universities-list-grid\s*\{[^}]+\}/g, `
.universities-list-grid {
    display: flex !important;
    justify-content: center !important;
    flex-wrap: wrap !important;
    gap: 30px !important;
    max-width: 1000px !important;
    margin: 0 auto !important;
    width: 100% !important;
}
.university-card {
    width: calc(50% - 15px) !important;
    max-width: none !important;
    box-sizing: border-box !important;
    flex: 0 0 auto !important;
}
@media (max-width: 768px) {
    .university-card {
        width: 100% !important;
    }
}
`);

// 2. Fix the animation for .partner-logos inside index.html
// Let's replace the .partner-logos block.
// The animation keyframes might be missing or max-width overriding it.
html = html.replace(/\.partner-logos\s*\{[^}]+\}/g, `
.partner-logos {
    display: flex !important;
    gap: 20px !important;
    width: max-content !important;
    animation: scrollLogos 20s linear infinite !important;
}
@keyframes scrollLogos {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 10px)); }
}
`);

// Also fix .partner-logo-card img so it looks decent
html = html.replace(/\.partner-logo-card\simg\s*\{[^}]+\}/g, `
.partner-logo-card img {
    max-width: 100px !important;
    max-height: 50px !important;
    object-fit: contain !important;
}
`);

fs.writeFileSync('frontend/index.html', html);
console.log("Fixed inline CSS in index.html");

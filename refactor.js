const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, 'frontend');
const CSS_FILE = path.join(FRONTEND_DIR, 'assets', 'css', 'style.css');
const JS_DIR = path.join(FRONTEND_DIR, 'assets', 'js');
const COMPONENTS_JS = path.join(JS_DIR, 'components.js');
const MAIN_JS = path.join(JS_DIR, 'main.js');

// 1. GLOBAL RESPONSIVENESS CSS
const globalCSS = `
/* ==========================================================================
   GLOBAL RESPONSIVENESS & AUDIT FIXES
   ========================================================================== */
/* Base reset */
*, *::before, *::after { box-sizing: border-box; }
img, video, iframe { max-width: 100%; height: auto; }
body { overflow-x: hidden; }

/* Smooth scrolling */
html { scroll-behavior: smooth; }

/* Focus visible for a11y */
:focus-visible { outline: 2px solid #FFC107; outline-offset: 2px; }

/* Global typography (Clamp) */
h1, .hero-text-wrapper h1, .page-title, .hero-copy h1, .home-hero h1 { font-size: clamp(28px, 6vw, 56px) !important; line-height: 1.1; }
h2, .section-title, .about-statement h2 { font-size: clamp(22px, 4.5vw, 42px) !important; line-height: 1.2; }
h3, .service-card h3, .why-card h3 { font-size: clamp(18px, 3.5vw, 28px) !important; line-height: 1.3; }
p, .hero-lead, .service-card p, .why-card p, .about-statement p, .hero-subtext, span, div, body { 
    font-size: clamp(14px, 2.5vw, 17px);
}
/* Except small spans */
.hero-kicker, .trust-pill, .partner-badge, .btn-view-more { font-size: inherit; }

/* Section paddings */
.section, section, .about-page-section, .mission-vision-section, .research-support-section, .services-section, .global-section, .choose-us-section, .professional-section, .why-choose-section {
    padding: 100px 80px;
}

@media (max-width: 1024px) {
    .section, section, .about-page-section, .mission-vision-section, .research-support-section, .services-section, .global-section, .choose-us-section, .professional-section, .why-choose-section {
        padding: 80px 40px;
    }
}

@media (max-width: 768px) {
    .section, section, .about-page-section, .mission-vision-section, .research-support-section, .services-section, .global-section, .choose-us-section, .professional-section, .why-choose-section {
        padding: 60px 20px !important;
    }
    
    /* Grids collapse to 1 column */
    .grid, .features-grid, .services-grid, .about-features, .process-grid, .choose-grid, .footer-grid, .mv-container, .mission-grid, .service-grid, .why-cards, .testimonials-grid, .courses-grid, .split-layout {
        grid-template-columns: 1fr !important;
        display: grid !important;
    }

    .row, .about-container, .hero-content, .hero-buttons, .hero-actions {
        flex-direction: column !important;
        width: 100% !important;
    }

    /* Fixed width elements to full width */
    .container, .col-text, .col-image, .image-panel, .hero-text-panel, .hero-img-panel {
        max-width: 100% !important;
        width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    /* Buttons */
    .btn, .btn-primary, .btn-primary-hero, .btn-outline-light {
        width: 100% !important;
        max-width: 320px !important;
        margin: 0 auto 10px auto !important;
        display: block !important;
        text-align: center;
    }

    /* Tables */
    .table-responsive {
        width: 100%;
        overflow-x: auto;
    }
    table {
        min-width: 600px; /* Ensure table scrolls if too small */
    }
}

/* 3. HERO FIXES */
.home-hero {
    min-height: 100svh !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
}
.hero-slide {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
}
.hero-bg-image {
    background-size: cover !important;
    background-position: center center !important;
}
@media (max-width: 768px) {
    .home-hero h1 { font-size: clamp(24px, 6vw, 40px) !important; }
    .hero-lead { font-size: clamp(13px, 3vw, 16px) !important; }
    .btn-outline-light, .btn-primary { padding: 14px 28px !important; font-size: 14px !important; width: auto !important; max-width: 280px !important; }
    .hero-copy { padding: 20px 16px !important; text-align: center !important; }
    .hero-carousel-controls .hero-control-btn {
        width: 36px !important;
        height: 36px !important;
    }
    .hero-bg-overlay { background: rgba(5, 27, 43, 0.85) !important; } /* darker for readability */
}

/* 4. HERO FEATURE PILLS */
.hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    justify-content: center;
    margin-top: 16px;
}
.hero-feature-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50px;
    padding: 8px 16px;
    font-size: 13px;
    color: #fff;
    white-space: nowrap;
}

/* 5. MOBILE NAV */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        background: #1a1a2e !important;
        z-index: 9999 !important;
        overflow-y: auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding-top: 80px !important;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }
    .nav-menu.active {
        transform: translateX(0);
    }
    .nav-menu li a {
        font-size: 18px !important;
        padding: 16px 24px !important;
        color: #fff !important;
    }
    .brand-logo-img { max-height: 50px !important; }
    
    /* Nav dropdown accordion */
    .nav-dropdown {
        position: static !important;
        opacity: 1 !important;
        visibility: visible !important;
        box-shadow: none !important;
        transform: none !important;
        background: rgba(255,255,255,0.1) !important;
        display: none !important;
        width: 100%;
        text-align: center;
    }
    .nav-dropdown.show {
        display: block !important;
    }
    .nav-dropdown li a {
        font-size: 16px !important;
        color: #ddd !important;
    }
}
@media (min-width: 769px) {
    .brand-logo-img { max-height: 60px !important; }
}

/* 1. SEAMLESS MARQUEE BANNER */
.marquee-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    background: #0d5c4a;
    color: #fff;
    padding: 8px 0;
    display: flex;
}
.marquee-track {
    display: flex;
    white-space: nowrap;
    animation: marquee 18s linear infinite;
    will-change: transform;
}
.marquee-content {
    display: flex;
    white-space: nowrap;
    padding-right: 50px;
}
.marquee-item {
    padding: 0 2rem;
    font-size: 14px;
}
.marquee-item i {
    margin-right: 5px;
    color: #f0a500;
}
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
@media (max-width: 768px) {
    .marquee-track { animation-duration: 25s; }
}
`;

if (fs.existsSync(CSS_FILE)) {
    fs.appendFileSync(CSS_FILE, '\n' + globalCSS);
    console.log('Appended global fixes to style.css');
}

// 5. UPDATE COMPONENTS.JS FOR MOBILE NAV
if (fs.existsSync(COMPONENTS_JS)) {
    let compJS = fs.readFileSync(COMPONENTS_JS, 'utf8');
    // Inject body overflow hidden logic
    if (!compJS.includes('document.body.style.overflow =')) {
        compJS = compJS.replace(/menu\.classList\.toggle\('active'\);/, 
            `menu.classList.toggle('active');\n            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';`);
        compJS = compJS.replace(/menu\.classList\.remove\('active'\);/g, 
            `menu.classList.remove('active');\n                document.body.style.overflow = '';`);
        fs.writeFileSync(COMPONENTS_JS, compJS);
        console.log('Updated components.js for body scroll lock');
    }
}

// 6 & 7. PROCESS HTML FILES
const bannerHTML = `<div class="marquee-wrapper">
    <div class="marquee-track">
        <div class="marquee-content">
            <span class="marquee-item"><i class="fas fa-map-marker-alt"></i> 174 Chesterton Road, Cambridge</span>
            <span class="marquee-item"><i class="fas fa-envelope"></i> info@scholarslift.com</span>
            <span class="marquee-item"><i class="fas fa-phone-alt"></i> +44 7386814150</span>
        </div>
        <div class="marquee-content">
            <span class="marquee-item"><i class="fas fa-map-marker-alt"></i> 174 Chesterton Road, Cambridge</span>
            <span class="marquee-item"><i class="fas fa-envelope"></i> info@scholarslift.com</span>
            <span class="marquee-item"><i class="fas fa-phone-alt"></i> +44 7386814150</span>
        </div>
    </div>
</div>`;

function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (let file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'assets') {
                processHtmlFiles(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Replace ticker banner
            if (content.includes('ticker-wrapper')) {
                content = content.replace(/<div class="ticker-wrapper"[\s\S]*?<\/div>\s*<\/div>/, bannerHTML);
                modified = true;
            }

            // 4. Hero Pills (find patterns like "✓ Thesis Writing")
            // In index.html, we look for trust-pill or hero-kicker and convert if they stack
            if (file === 'index.html' && content.includes('trust-pill')) {
                // If they are not already in hero-features
                if (!content.includes('class="hero-features"')) {
                    content = content.replace(/<div class="hero-trust-row">([\s\S]*?)<\/div>/g, '<div class="hero-features">$1</div>');
                    content = content.replace(/trust-pill/g, 'hero-feature-pill');
                    modified = true;
                }
            }

            // 6. Wrap tables in .table-responsive
            if (content.includes('<table') && !content.includes('table-responsive')) {
                content = content.replace(/<table([\s\S]*?)<\/table>/g, '<div class="table-responsive"><table$1</table></div>');
                modified = true;
            }

            // 6. Form validation
            if (content.includes('<form') && file === 'contact.html') {
                // Ensure inputs have required attribute
                content = content.replace(/<input([^>]*?)>/g, (match, p1) => {
                    if (!p1.includes('required') && (p1.includes('type="text"') || p1.includes('type="email"'))) {
                        return `<input${p1} required>`;
                    }
                    return match;
                });
                modified = true;
            }

            // 7. Loading lazy
            content = content.replace(/<img([^>]*?)>/g, (match, p1) => {
                if (!p1.includes('loading') && !p1.includes('hero-bg-image') && !p1.includes('brand-logo-img')) {
                    return `<img${p1} loading="lazy">`;
                }
                return match;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

processHtmlFiles(FRONTEND_DIR);
console.log('Refactoring complete.');

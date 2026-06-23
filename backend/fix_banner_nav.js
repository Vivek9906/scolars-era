const fs = require('fs');
let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Fix the top banner html with correct icons and wrap it properly
html = html.replace(/<div class="ticker-wrapper">[\s\S]*?<\/div>\s*<\/div>/, `
  <!-- Top Bar -->
  <div class="ticker-wrapper" style="background: #0d5c4a; color: #fff; padding: 8px 0; overflow: hidden; white-space: nowrap; width: 100%; position: relative; z-index: 1000; display: block; height: 35px; box-sizing: border-box;">
    <div class="ticker-track" style="display: inline-block; white-space: nowrap; padding-left: 100%;">
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px; color: #f0a500;"></i> 174 Chesterton Road, Cambridge</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-envelope" style="margin-right: 5px; color: #f0a500;"></i> info@scholarslift.com</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem;"><i class="fas fa-phone-alt" style="margin-right: 5px; color: #f0a500;"></i> +44 7386814150</span>
        <span class="ticker-item" style="display: inline-block; padding: 0 2rem; font-weight: bold;"><i class="fas fa-bullhorn" style="margin-right: 5px; color: #f0a500;"></i> Admissions open for 2025 intake</span>
    </div>
  </div>
`);

// Also add the animation for the ticker to index.html
if (!html.includes('ticker-track {')) {
    html = html.replace('</style>', `
    .ticker-track {
        animation: tickerScroll 20s linear infinite;
    }
    @keyframes tickerScroll {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-100%, 0, 0); }
    }
    .ticker-wrapper:hover .ticker-track {
        animation-play-state: paused;
    }
    </style>`);
}


// 2. FORCE navbar dropdown CSS
// The dropdown in header.html uses .nav-dropdown.
if (!html.includes('.nav-dropdown { position: absolute')) {
    html = html.replace('</style>', `
    /* OVERRIDE DROPDOWN CSS */
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
    </style>`);
}

fs.writeFileSync('frontend/index.html', html);
console.log("Fixed top banner and navbar css in index.html");

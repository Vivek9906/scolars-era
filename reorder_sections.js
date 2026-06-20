const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'frontend', 'index.html');
let html = fs.readFileSync(filepath, 'utf-8');

const mainStart = html.indexOf('<main>');
const mainEnd = html.indexOf('</main>') + '</main>'.length;
const mainContent = html.substring(mainStart, mainEnd);

// Helper to extract a section by class or id, or a specific string
function extract(regex) {
    const match = mainContent.match(regex);
    if (!match) return '';
    return match[1];
}

const hero = extract(/(<header class="home-hero" id="mainHeroCarousel">[\s\S]*?<\/header>)/);
const services = extract(/(<section class="home-services" aria-label="Core services">[\s\S]*?<\/section>)/);
const about = extract(/(<section class="professional-section" id="about">[\s\S]*?<\/section>)/);
const stats = extract(/(<section class="stats-section home-stats">[\s\S]*?<\/section>)/);
const why = extract(/(<section class="why-choose-section">[\s\S]*?<\/section>)/);
const process = extract(/(<section class="process-section clean-process">[\s\S]*?<\/section>)/);
const mv = extract(/(<section class="mv-editorial-section">[\s\S]*?<\/section>)/);
const mvStyle = extract(/(<style>\s*\.mv-editorial-section[\s\S]*?<\/style>)/);
const logos = extract(/(<section class="clean-partners">[\s\S]*?<\/section>)/);
const courses = extract(/(<section class="partners-section clean-partners courses-section" id="courses">[\s\S]*?<\/section>)/);
const globalBand = extract(/(<section class="global-band">[\s\S]*?<\/section>)/);
const testimonials = extract(/(<section class="testimonials-section">[\s\S]*?<\/section>)/);
const contact = extract(/(<section class="contact-section reveal" id="contact">[\s\S]*?<\/section>)/);
const faq = extract(/(<section class="faq-section">[\s\S]*?<\/section>)/);

const newMainContent = `    <main>
        ${hero}

        ${services}

        ${about}

        ${stats}

        ${why}

        ${process}

        ${mv}

        ${mvStyle}

        ${logos}

        ${courses}

        ${globalBand}

        ${testimonials}

        ${contact}

        ${faq}
    </main>`;

let newHtml = html.substring(0, mainStart) + newMainContent + html.substring(mainEnd);

fs.writeFileSync(filepath, newHtml, 'utf-8');
console.log('Reordered sections successfully.');

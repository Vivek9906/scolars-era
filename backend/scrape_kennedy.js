const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const programs = {
    bachelor: [
        { name: 'Business Administration', url: 'https://kennedy.edu.eu/BDiv-in-Business', file: 'business-administration.html', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
        { name: 'Public Administration', url: 'https://kennedy.edu.eu/BDiv-in-Public', file: 'public-administration.html', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
        { name: 'Education', url: 'https://kennedy.edu.eu/BDiv-in-Education', file: 'education.html', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80' },
        { name: 'Media Communication', url: 'https://kennedy.edu.eu/BDiv-in-Media', file: 'media-communication.html', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80' },
        { name: 'Counseling Psychology', url: 'https://kennedy.edu.eu/BDiv-in-Counseling', file: 'counseling-psychology.html', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
        { name: 'Human Arts', url: null, file: 'human-arts.html', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
        { name: 'Fine Arts', url: null, file: 'fine-arts.html', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80' },
        { name: 'Social Work', url: null, file: 'social-work.html', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' },
        { name: 'Music', url: null, file: 'music.html', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80' },
        { name: 'Theology', url: null, file: 'theology.html', img: 'https://images.unsplash.com/photo-1519011985187-444d62641929?w=800&q=80' },
        { name: 'Science', url: null, file: 'science.html', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80' },
        { name: 'Programs in Other Areas', url: null, file: 'other-areas.html', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' }
    ],
    master: [
        { name: 'Business Administration', url: 'https://kennedy.edu.eu/MDiv-in-Business', file: 'business-administration.html', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
        { name: 'Public Administration', url: 'https://kennedy.edu.eu/MDiv-in-Public', file: 'public-administration.html', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
        { name: 'Education', url: 'https://kennedy.edu.eu/MDiv-in-Education', file: 'education.html', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80' },
        { name: 'Media Communication', url: 'https://kennedy.edu.eu/Ma-in-Media', file: 'media-communication.html', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80' },
        { name: 'Counseling Psychology', url: 'https://kennedy.edu.eu/MDiv-in-Counseling', file: 'counseling-psychology.html', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
        { name: 'Human Arts', url: null, file: 'human-arts.html', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
        { name: 'Fine Arts', url: null, file: 'fine-arts.html', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80' },
        { name: 'Social Work', url: null, file: 'social-work.html', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' },
        { name: 'Music', url: null, file: 'music.html', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80' },
        { name: 'Theology', url: null, file: 'theology.html', img: 'https://images.unsplash.com/photo-1519011985187-444d62641929?w=800&q=80' },
        { name: 'Science', url: null, file: 'science.html', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80' },
        { name: 'Programs in Other Areas', url: null, file: 'other-areas.html', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' }
    ],
    doctoral: [
        { name: 'Business Administration', url: 'https://kennedy.edu.eu/DDiv-in-Business', file: 'business-administration.html', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
        { name: 'Public Administration', url: 'https://kennedy.edu.eu/DDiv-in-Public', file: 'public-administration.html', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
        { name: 'Education', url: 'https://kennedy.edu.eu/DDiv-in-Education', file: 'education.html', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80' },
        { name: 'Media Communication', url: 'https://kennedy.edu.eu/DDiv-in-Media', file: 'media-communication.html', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80' },
        { name: 'Counseling Psychology', url: 'https://kennedy.edu.eu/DDiv-in-Counseling', file: 'counseling-psychology.html', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
        { name: 'Human Arts', url: null, file: 'human-arts.html', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
        { name: 'Fine Arts', url: null, file: 'fine-arts.html', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80' },
        { name: 'Social Work', url: null, file: 'social-work.html', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' },
        { name: 'Music', url: null, file: 'music.html', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80' },
        { name: 'Theology', url: null, file: 'theology.html', img: 'https://images.unsplash.com/photo-1519011985187-444d62641929?w=800&q=80' },
        { name: 'Science', url: null, file: 'science.html', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80' },
        { name: 'Programs in Other Areas', url: null, file: 'other-areas.html', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' }
    ]
};

// Generate HTML from template
function generateHTML(category, level, name, data) {
    const ucLevel = level.charAt(0).toUpperCase() + level.slice(1);

    const objectivesHTML = data.objectives.length > 0
        ? data.objectives.map(o => `<p>${o}</p>`).join('')
        : '<p>To cultivate excellent leadership skills in the field of study.</p>';

    const outcomesHTML = data.outcomes.length > 0
        ? `<ul>` + data.outcomes.map(o => `<li>${o}</li>`).join('') + `</ul>`
        : `<p>Upon completion of the program, students will demonstrate comprehensive understanding of their field.</p>`;

    const curriculumHTML = data.curriculum.length > 0
        ? `<ul class="course-list">` + data.curriculum.map(c => `
            <li class="course-item">
                <span class="course-code">${c.code}</span>
                <span class="course-name">${c.name}</span>
                <span class="course-credits">${c.credits}</span>
            </li>`).join('') + `</ul>`
        : `<p>Curriculum details are currently being updated.</p>`;

    const entranceHTML = data.entrance || "Applicants for admission must be in possession of, or have candidacy for, a high school diploma or GED, and must submit official transcripts.";
    const creditsHTML = data.credits || "143 credits or more";
    const specialCreditHTML = data.special || "Field experiences, such as participation in religious activities, work experience, and field activities, may qualify for special credit recognition.";
    const faithBasedHTML = data.faith || "Kennedy University offers only educational programs that prepare students for religious vocations as ministers, professionals, or laypersons.";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ucLevel} Programmes | scholars Lift</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="icon" type="image/png" href="/assets/images/favicon.png">
    <style>
        .detail-section {
            padding: 60px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-section:nth-child(even) {
            background-color: #fcfcfc;
        }
        .detail-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 40px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        @media(min-width: 900px) {
            .detail-container {
                grid-template-columns: 350px 1fr;
                gap: 60px;
            }
        }
        .detail-label {
            font-size: 16px;
            font-weight: 800;
            color: #0d5c4a;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .detail-content {
            font-size: 16px;
            line-height: 1.8;
            color: #444;
        }
        .detail-content p {
            margin-bottom: 16px;
        }
        .detail-content ul {
            padding-left: 20px;
            margin-bottom: 16px;
        }
        .detail-content li {
            margin-bottom: 10px;
        }
        .course-list {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-top: 1px solid #eee;
        }
        .course-item {
            display: flex;
            justify-content: space-between;
            padding: 16px 0;
            border-bottom: 1px solid #eee;
            margin-bottom: 0 !important;
        }
        .course-code {
            font-weight: 700;
            color: #0d5c4a;
            width: 120px;
            flex-shrink: 0;
        }
        .course-name {
            flex: 1;
        }
        .course-credits {
            font-weight: 700;
            color: #f0a500;
            width: 80px;
            text-align: right;
            flex-shrink: 0;
        }
    </style>
</head>
<body>
    <div id="header-placeholder"></div>

    <header class="editorial-page-header">
        <div class="editorial-container">
            <div class="editorial-eyebrow"><a href="/programs/${level}.html">PROGRAMMES · ${level.toUpperCase()} · ${name.toUpperCase()}</a></div>
            <h1 class="editorial-title">${name}</h1>
            <p class="editorial-desc">Official Degree Programme</p>
            <div class="editorial-accent"></div>
        </div>
    </header>

    <section class="detail-section">
        <div class="detail-container">
            <div class="detail-label">OBJECTIVES</div>
            <div class="detail-content">${objectivesHTML}</div>
        </div>
    </section>

    <section class="detail-section">
        <div class="detail-container">
            <div class="detail-label">ACADEMIC CURRICULUM</div>
            <div class="detail-content">${curriculumHTML}</div>
        </div>
    </section>

    <section class="detail-section">
        <div class="detail-container">
            <div class="detail-label">LEARNING OUTCOMES</div>
            <div class="detail-content">${outcomesHTML}</div>
        </div>
    </section>

    <section class="detail-section">
        <div class="detail-container">
            <div class="detail-label">ENTRANCE REQUIREMENTS</div>
            <div class="detail-content"><p>${entranceHTML}</p></div>
        </div>
    </section>

    <section class="detail-section">
        <div class="detail-container">
            <div class="detail-label">REQUIRED CREDITS</div>
            <div class="detail-content"><p>${creditsHTML}</p></div>
        </div>
    </section>

    <section class="detail-section">
        <div class="detail-container">
            <div class="detail-label">SPECIAL CREDIT RECOGNITION POLICY</div>
            <div class="detail-content"><p>${specialCreditHTML}</p></div>
        </div>
    </section>

    <section class="sp-apply">
        <div class="sp-apply-container">
            <div class="sp-label" style="color: #fff;">HOW TO APPLY</div>
            <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 0;">Your Application Journey</h2>
            <div class="sp-timeline">
                <div class="sp-step">
                    <div class="sp-step-num">1</div>
                    <h4>Submit Your Enquiry</h4>
                    <p>Tell us about your academic background and goals. We will review your profile within 48 hours.</p>
                </div>
                <div class="sp-step">
                    <div class="sp-step-num">2</div>
                    <h4>Counselling Session</h4>
                    <p>A dedicated advisor walks you through your options, fit, and realistic expectations for this programme.</p>
                </div>
                <div class="sp-step">
                    <div class="sp-step-num">3</div>
                    <h4>Application Review</h4>
                    <p>We prepare, check, and submit your application with supporting documentation.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="sp-cta">
        <h2>Ready to apply for ${name}?</h2>
        <a href="/contact.html" class="btn">Talk to an Advisor</a>
    </section>

    <div id="footer-placeholder"></div>
    
    <script src="/assets/js/api.js"></script>
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/components.js"></script>
</body>
</html>`;
}

async function scrapePage(url) {
    let data = {
        objectives: [],
        outcomes: [],
        curriculum: [],
        entrance: '',
        credits: '',
        special: '',
        faith: ''
    };

    // If no URL is provided, return empty data to trigger fallbacks
    if (!url) return data;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let texts = [];

        // We will collect both text and raw html to split the curriculum correctly
        $('span[style*="font-family"]').each((i, el) => {
            const htmlContent = $(el).html() || '';
            // If the element has <br> tags, split it into multiple lines
            if (htmlContent.includes('<br')) {
                const lines = htmlContent.split(/<br[^>]*>/gi);
                lines.forEach(line => {
                    const cleanText = cheerio.load(line).text().replace(/&nbsp;/g, ' ').trim();
                    if (cleanText) texts.push(cleanText);
                });
            } else {
                const text = $(el).text().replace(/&nbsp;/g, ' ').trim();
                if (text) texts.push(text);
            }
        });

        let currentSection = null;

        for (let i = 0; i < texts.length; i++) {
            let t = texts[i];
            t = t.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim(); // normalize whitespace

            // Detect sections
            if (t === 'OBJECTIVES') { currentSection = 'objectives'; continue; }
            if (t === 'ACADEMIC CURRICULUM') { currentSection = 'curriculum'; continue; }
            if (t === 'LEARNING OUTCOMES') { currentSection = 'outcomes'; continue; }
            if (t === 'ENTRANCE REQUIREMENTS') { currentSection = 'entrance'; continue; }
            if (t === 'REQUIRED CREDITS') { currentSection = 'credits'; continue; }
            if (t === 'SPECIAL CREDIT RECOGNITION POLICY') { currentSection = 'special'; continue; }
            if (t === 'FAITH BASED EDUCATION') { currentSection = 'faith'; continue; }

            // Skip useless headers
            if (t.includes('Kennedy University') || t.includes('HOME') || t.includes('ACADEMICS') || t === '｜') continue;
            if (t.startsWith('Bachelor of') || t.startsWith('Master of') || t.startsWith('Doctor of')) continue;
            if (t.startsWith('BACHELOR OF') || t.startsWith('MASTER OF') || t.startsWith('DOCTOR OF')) continue;
            if (t.includes('Necessary Credits for Graduating')) continue;

            // Collect data based on section
            if (currentSection === 'objectives') {
                if (t.length > 10) data.objectives.push(t);
            }
            else if (currentSection === 'outcomes') {
                if (t.length > 10 && !t.includes('students will be able to')) data.outcomes.push(t);
            }
            else if (currentSection === 'curriculum') {
                // Parse course items like "BDBA 101 The Foundations 4"
                let match = t.match(/^([A-Z]+\s*\d+)\s+(.+?)\s+(\d+)$/);
                if (match) {
                    data.curriculum.push({ code: match[1], name: match[2].trim(), credits: match[3] });
                } else if (t.match(/\d+$/) && t.match(/^[A-Z]+\s*\d+/)) {
                    // Fallback for weird spacing
                    let parts = t.split(/\s{2,}/);
                    if (parts.length >= 3) {
                        data.curriculum.push({ code: parts[0], name: parts.slice(1, -1).join(' '), credits: parts[parts.length - 1] });
                    } else {
                        // Even weirder spacing, extract using regex
                        let reMatch = t.match(/^([A-Z]+\s*\d+)\s+(.*)\s+(\d+)$/);
                        if (reMatch) {
                            data.curriculum.push({ code: reMatch[1], name: reMatch[2].trim(), credits: reMatch[3] });
                        }
                    }
                }
            }
            else if (currentSection === 'entrance') {
                if (!data.entrance) data.entrance = t;
            }
            else if (currentSection === 'credits') {
                if (!data.credits && t.match(/\d+/)) data.credits = t;
            }
            else if (currentSection === 'special') {
                if (!data.special) data.special = t;
            }
            else if (currentSection === 'faith') {
                if (!data.faith) data.faith = t;
            }
        }

    } catch (e) {
        console.error("Failed to scrape " + url, e.message);
    }

    return data;
}

async function run() {
    for (const [level, courses] of Object.entries(programs)) {
        console.log(`Processing ${level} programs...`);
        const dir = path.join(__dirname, '..', 'frontend', 'programs', level);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        let stackCardsHTML = '';

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            console.log(`- Scraping ${course.name}`);
            const data = await scrapePage(course.url);
            const html = generateHTML(category = 'programs', level, course.name, data);

            fs.writeFileSync(path.join(dir, course.file), html);

            const bgColor = (i % 2 === 0) ? '#ffffff' : '#f9f9f9';
            stackCardsHTML += `
            <div class="project-stack-card" style="background-color: ${bgColor}; z-index: ${i + 1};">
                <div class="stack-card-inner">
                    <div class="stack-left">
                        <span class="stack-num">${i < 9 ? '0' + (i + 1) : i + 1}</span>
                        <h3 class="stack-title">${course.name}</h3>
                        <span class="stack-type">(Academic Pathway)</span>
                        <p class="stack-desc">Official Degree Programme</p>
                        <a href="/programs/${level}/${course.file}" class="stack-btn">View Programme <i class="fas fa-arrow-right"></i></a>
                    </div>
                    <div class="stack-right">
                        <div class="stack-img-wrapper">
                            <img src="${course.img}" alt="${course.name}" loading="lazy">
                        </div>
                    </div>
                </div>
            </div>\n`;
        }

        // Update the category page (e.g. bachelor.html)
        const catPagePath = path.join(__dirname, '..', 'frontend', 'programs', `${level}.html`);
        if (fs.existsSync(catPagePath)) {
            let catHTML = fs.readFileSync(catPagePath, 'utf-8');
            const newStackContainer = `
        <div class="stack-container">
            <div class="stack-header">
                <h2>${level === 'bachelor' ? 'Undergraduate' : level === 'master' ? 'Graduate' : 'Doctoral'} disciplines</h2>
                <p>Select a discipline to explore programme details, entry requirements, and how to apply.</p>
            </div>
            ${stackCardsHTML}
        </div>\n\n        <section class="section-req">`;

            catHTML = catHTML.replace(/<div class="stack-container">[\s\S]*?<section class="section-req">/, newStackContainer.trim());
            fs.writeFileSync(catPagePath, catHTML);
            console.log(`Updated ${level}.html`);
        }
    }
    console.log("Done!");
}

run();

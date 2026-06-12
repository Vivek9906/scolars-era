const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const universityFile = path.join(frontendDir, 'university.html');
const coursesFile = path.join(frontendDir, 'courses.html');

let uniContent = fs.readFileSync(universityFile, 'utf8');

uniContent = uniContent.replace('<title>University Details — Scolars Fix</title>', '<title>Courses — Scolars Fix</title>');

const coursesHtml = `
    <!-- Courses Header -->
    <section class="courses-header reveal">
        <div class="container">
            <h5 class="section-subtitle centered"><i class="fas fa-star"></i> OUR COURSES</h5>
            <h2 class="section-title centered">What We Do... <span class="highlight">Courses</span></h2>
            <p class="section-text centered">At <b style="color: orange;">SCOLARS FIX </b>, we function as a comprehensive academic facilitation, education consulting, and professional recognition platform. Our core focus is to bridge the gap between aspirational learners and globally aligned academic opportunities, especially for working professionals and accomplished individuals who seek advanced qualifications or academic recognition.

We do not operate as a traditional college or university. Instead, we act as an <b style="color: orange;">academic enabler and consulting partner</b>, guiding learners through structured, credible, and transparent pathways toward doctoral education and academic distinction.</p>
        </div>
    </section>

    <!-- Courses Grid -->
    <section class="courses-grid-section" id="courses">
        <div class="container">
            <div id="courses-grid" class="courses-grid reveal">
                <!-- Courses injected via JS -->
            </div>
        </div>
    </section>
`;

const uniContainerRegex = /<div class="container" style="padding: 100px 0;">[\s\S]*?<\/div>/;

uniContent = uniContent.replace(uniContainerRegex, coursesHtml);
uniContent = uniContent.replace('<script src="/assets/js/universities.js" defer></script>', '<script src="/assets/js/courses.js"></script>');

fs.writeFileSync(coursesFile, uniContent);
console.log("courses.html generated cleanly.");

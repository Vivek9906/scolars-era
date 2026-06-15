const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const indexFile = path.join(frontendDir, 'index.html');
const universityFile = path.join(frontendDir, 'university.html');
const coursesFile = path.join(frontendDir, 'courses.html');

let indexContent = fs.readFileSync(indexFile, 'utf8');

// The courses section in index.html starts at <!-- Courses Header --> and ends before <style> for Process Section or before <!-- Process Section -->
const coursesRegex = /\s*<!-- Courses Header -->[\s\S]*?(?=<style>\s*\/\* ============================\s*Process Section Styles)/;

const coursesMatch = indexContent.match(coursesRegex);
if (!coursesMatch) {
    console.error("Could not find courses section");
    process.exit(1);
}

const coursesHtml = coursesMatch[0];

// Remove the courses section from index.html (and the weird closing tags )
const cleanedIndexContent = indexContent.replace(coursesRegex, '')
                                       .replace(/<\/div>\s*<\/div>\s*<\/section>\s*(?=<style>\s*\/\* ============================\s*Process Section Styles)/, '');

fs.writeFileSync(indexFile, cleanedIndexContent);

// Build courses.html using university.html as a template
let uniContent = fs.readFileSync(universityFile, 'utf8');

// Replace title
uniContent = uniContent.replace('<title>University Details — Scolars Fix</title>', '<title>Courses — Scolars Fix</title>');

// Replace the main container in university.html
// In university.html: <div class="container" style="padding: 100px 0;">...</div>
const uniContainerRegex = /<div class="container" style="padding: 100px 0;">[\s\S]*?<\/div>/;

// Insert courses html there
// Wait, we also need to change the script at the bottom.
// In university: <script src="/assets/js/universities.js" defer></script>
// We need: <script src="/assets/js/courses.js"></script>

uniContent = uniContent.replace(uniContainerRegex, coursesHtml);
uniContent = uniContent.replace('<script src="/assets/js/universities.js" defer></script>', '<script src="/assets/js/courses.js"></script>');
uniContent = uniContent.replace('id="universities-grid"', 'id="courses-grid"'); // not needed since we replaced the whole div

fs.writeFileSync(coursesFile, uniContent);
console.log("courses.html generated successfully and index.html updated.");

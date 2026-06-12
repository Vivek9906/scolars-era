const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

const newNavLinks = `
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about.html">About Us</a></li>
                <li><a href="/courses.html">Courses</a></li>
                <li><a href="/university.html">Universities</a></li>
                <li><a href="/book-appointment.html">Contact</a></li>
            </ul>`;

function updateNavLinks(htmlContent) {
    return htmlContent.replace(/<ul\s+class="nav-links">[\s\S]*?<\/ul>/, newNavLinks.trim());
}

function fixImages(htmlContent) {
    let modified = htmlContent;
    modified = modified.replace(/src="clg\.jpeg"/g, 'src="/assets/images/clg.jpeg"');
    modified = modified.replace(/src="00\.jpeg"/g, 'src="/assets/images/00.jpeg"');
    modified = modified.replace(/src="001\.jpeg"/g, 'src="/assets/images/001.jpeg"');
    return modified;
}

function processFiles() {
    const files = fs.readdirSync(frontendDir);
    let indexContent = '';
    
    files.forEach(file => {
        if (!file.endsWith('.html')) return;
        const filePath = path.join(frontendDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        content = updateNavLinks(content);
        
        if (file === 'index.html') {
            content = fixImages(content);
            indexContent = content;
        }
        
        fs.writeFileSync(filePath, content);
    });

    // Create courses.html based on index.html
    if (indexContent) {
        // Extract header
        const headerMatch = indexContent.match(/([\s\S]*?)<!-- Courses Header -->/);
        // Extract footer part - basically from Process section onwards or just before Footer
        // We'll just take the top part and bottom part of index.html
        
        const topPart = indexContent.substring(0, indexContent.indexOf('<!-- Hero Section -->'));
        
        // We need the courses section itself
        const coursesStart = indexContent.indexOf('<!-- Courses Header -->');
        const processStart = indexContent.indexOf('<!-- Process Section -->'); // or whatever comes after courses
        
        // Actually the process section is wrapped weirdly in index.html, let's check view_file output
        // "    <!-- Courses Grid --> ...  </section>\n    </div>\n\n    </div>\n\n    </section>\n\n    <style>\n    /* ============================\n       Process Section Styles"
        // Let's use regex to extract everything up to nav, then put courses, then the footer.
    }
}

processFiles();

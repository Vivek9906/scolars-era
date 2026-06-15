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
        try {
            const navEndIndex = indexContent.indexOf('</nav>');
            const headPart = navEndIndex !== -1 ? indexContent.substring(0, navEndIndex + 6) : '';
            
            const footerStartIndex = indexContent.indexOf('<footer');
            const footerPart = footerStartIndex !== -1 ? indexContent.substring(footerStartIndex) : '</body></html>';
            
            const coursesMatch = indexContent.match(/<!-- Courses Header -->[\s\S]*?<!-- Process Section -->/);
            let coursesBody = coursesMatch ? coursesMatch[0] : '<section class="courses-header"><h2>Our Courses</h2></section>';
            
            const finalHtml = `<!DOCTYPE html>\n<html lang="en">\n${headPart}\n<main>\n${coursesBody}\n</main>\n${footerPart}`;
            
            fs.writeFileSync(path.join(frontendDir, 'courses.html'), finalHtml);
            console.log("✅ courses.html successfully generated from index.html");
        } catch (err) {
            console.error("❌ Error generating courses.html:", err.message);
        }
    }
}

processFiles();

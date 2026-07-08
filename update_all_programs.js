const fs = require('fs');

const courses = [
  { title: "Business Administration", keyword: "university,business" },
  { title: "Public Administration", keyword: "university,government" },
  { title: "Education", keyword: "university,education" },
  { title: "Media Communication", keyword: "university,media" },
  { title: "Counseling Psychology", keyword: "university,psychology" },
  { title: "Human Arts", keyword: "university,humanities" },
  { title: "Fine Arts", keyword: "university,art" },
  { title: "Social Work", keyword: "university,social" },
  { title: "Music", keyword: "university,music" },
  { title: "Theology", keyword: "university,theology" },
  { title: "Science", keyword: "university,science" },
  { title: "Programs in Other Areas", keyword: "university,campus" }
];

function generateHTML(degreeType, lockOffset, linkPrefix) {
  let html = '';
  courses.forEach((c, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    const bgColor = idx % 2 === 0 ? '#ffffff' : '#f9f9f9';
    const lockId = idx + 1 + lockOffset;
    const imgUrl = `https://loremflickr.com/800/800/${c.keyword}?lock=${lockId}`;
    const slug = c.title.toLowerCase().replace(/ /g, '-');
    const url = `/programs/${linkPrefix}/${slug}.html`;
    
    html += `
            <div class="project-stack-card" style="background-color: ${bgColor}; z-index: ${idx + 1};">
                <div class="stack-card-inner">
                    <div class="stack-left">
                        <span class="stack-num">${num}</span>
                        <h3 class="stack-title">${c.title}</h3>
                        <span class="stack-type">(Academic Pathway)</span>
                        <p class="stack-desc">${degreeType} Degree Programme</p>
                        <a href="${url}" class="stack-btn" style="margin-top: 20px;">View Programme <i class="fas fa-arrow-right"></i></a>
                    </div>
                    <div class="stack-right">
                        <div class="stack-img-wrapper">
                            <img src="${imgUrl}" alt="${c.title}" loading="lazy">
                        </div>
                    </div>
                </div>
            </div>
`;
  });
  return html;
}

function updateFile(filePath, newHtml) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match everything from the first <div class="project-stack-card" to the closing </div> right before <section class="section-req">
  const startMarker = '            <div class="project-stack-card" style="background-color: #ffffff; z-index: 1;">';
  const endMarker = '        <section class="section-req">';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    const newContent = content.substring(0, startIdx) + newHtml + '        </div>\n\n' + content.substring(endIdx);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated ' + filePath);
  } else {
    console.error('Markers not found in ' + filePath);
  }
}

updateFile('frontend/programs/bachelor.html', generateHTML("Bachelor's", 100, "bachelor"));
updateFile('frontend/programs/master.html', generateHTML("Master's", 200, "master"));
updateFile('frontend/programs/doctoral.html', generateHTML("Doctoral", 300, "doctoral"));

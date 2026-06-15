const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const files = [
  'bachelor.html',
  'master.html',
  'doctoral.html',
  'honorary-awards.html'
];

const bgs = ['#0a0a0a', '#0f0f0f', '#111111', '#161616', '#1a1a1a', '#1e1e1e'];
const images = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80'
];

const css = `
<style>
/* New Stacked Card Layout */
.stack-container {
    position: relative;
    background: #000;
}
.stack-header {
    background: #000;
    padding: 100px 20px 60px;
    text-align: center;
}
.stack-header h2 {
    font-size: clamp(2rem, 5vw, 4rem);
    color: #fff;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 20px;
}
.stack-header p {
    color: rgba(255,255,255,0.6);
    font-size: 18px;
    max-width: 600px;
    margin: 0 auto;
}
.project-stack-card {
    position: sticky;
    top: 0; 
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 80px 0;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.6);
    border-top: 1px solid rgba(255,255,255,0.05);
}
.stack-card-inner {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
}
@media (min-width: 1024px) {
    .stack-card-inner {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 100px;
    }
}
.stack-left { flex: 1.2; display: flex; flex-direction: column; }
.stack-right { flex: 1; display: flex; align-items: center; justify-content: center; }
.stack-num { font-size: clamp(4rem, 8vw, 6rem); font-weight: 900; color: rgba(255,255,255,0.05); line-height: 0.9; margin-bottom: 30px; font-family: 'Outfit', sans-serif; }
.stack-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 15px; line-height: 1; font-family: 'Outfit', sans-serif; letter-spacing: -1px; }
.stack-type { font-size: 14px; color: #f0a500; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 30px; font-weight: 700; }
.stack-desc { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.6; max-width: 500px; margin-bottom: 40px; }
.stack-btn { display: inline-flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 15px 35px; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.4s ease; width: fit-content; }
.stack-btn:hover { background: #fff; color: #000; border-color: #fff; transform: translateY(-3px); }
.stack-img-wrapper { width: 100%; aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); background: #000; }
.stack-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease; filter: brightness(0.8) contrast(1.1); }
.project-stack-card:hover .stack-img-wrapper img { transform: scale(1.05); filter: brightness(1) contrast(1.1); }
</style>
`;

files.forEach(file => {
  const filePath = path.join(__dirname, '../frontend/programs', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content, { decodeEntities: false });

  const disciplines = [];
  $('.disc-row').each((i, el) => {
    const url = $(el).attr('href');
    const title = $(el).find('.disc-left').text().trim();
    const desc = $(el).find('.disc-desc').text().trim();
    if (title) disciplines.push({ url, title, desc });
  });

  if (disciplines.length === 0) return;

  const headerTitle = $('.section-disciplines h2').first().text() || 'Disciplines';
  const headerSubtitle = $('.section-disciplines h3').first().text() || 'Explore our available programmes.';

  let newHtml = `\n${css}\n<div class="stack-container">\n`;
  
  newHtml += `
    <div class="stack-header">
      <h2>${headerTitle}</h2>
      <p>${headerSubtitle}</p>
    </div>
  `;

  disciplines.forEach((disc, index) => {
    const num = String(index + 1).padStart(2, '0');
    const bg = bgs[index % bgs.length];
    const img = images[index % images.length];

    newHtml += `
    <div class="project-stack-card" style="background-color: ${bg}; z-index: ${index + 1};">
        <div class="stack-card-inner">
            <div class="stack-left">
                <span class="stack-num">${num}</span>
                <h3 class="stack-title">${disc.title}</h3>
                <span class="stack-type">(Academic Pathway)</span>
                <p class="stack-desc">${disc.desc}</p>
                <a href="${disc.url}" class="stack-btn">View Programme <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="stack-right">
                <div class="stack-img-wrapper">
                    <img src="${img}" alt="${disc.title}" loading="lazy">
                </div>
            </div>
        </div>
    </div>
    `;
  });

  newHtml += `</div>`;

  $('.section-disciplines').replaceWith(newHtml);
  fs.writeFileSync(filePath, $.html());
  console.log('Rewrote ' + file);
});

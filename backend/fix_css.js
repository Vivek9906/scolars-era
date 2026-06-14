const fs = require('fs');

let css = fs.readFileSync('frontend/assets/css/style.css', 'utf8');

// The replace tool broke the back-to-top:hover, let's make sure it's intact
if (!css.includes('.back-to-top:hover {')) {
  css = css.replace('.back-to-top.show {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translateY(0);\n}', 
    '.back-to-top.show {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translateY(0);\n}\n.back-to-top:hover {\n  background: var(--primary-color, #FFC107);\n  transform: translateY(-5px);\n}');
}

// Remove any broken university card blocks (it might have created broken ones)
// We'll just append our clean CSS at the end.
const cleanCss = `
/* ── University Logos & Cards (Fixed) ──────────────────────────────────────────────── */
.university-card {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  padding: 35px 30px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: calc(50% - 20px);
  max-width: 480px;
  border: 1px solid #eaeaea;
}

.university-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}

.university-card img.uni-logo {
  height: 70px;
  width: auto;
  object-fit: contain;
  margin: 0 auto 20px auto;
  display: block;
  filter: none; /* remove grayscale */
  transition: transform 0.3s ease;
}
.university-card:hover img.uni-logo {
  transform: scale(1.05);
}

.university-card .uni-logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #0d5c4a;
  margin: 0 auto 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
}

.university-card h3 {
  font-size: 22px;
  color: #1a1a1a;
  margin: 15px 0 10px;
  font-weight: 700;
}

.university-card p {
  color: #555;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.university-card .btn-view-details {
  margin-top: auto;
  display: inline-block;
  padding: 12px 28px;
  background-color: #0d5c4a;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.university-card .btn-view-details:hover {
  background-color: #f0a500;
  color: #ffffff;
}

.university-card .uni-meta {
  margin-top: 10px;
  margin-bottom: 5px;
}

.university-card .uni-type {
  background: rgba(38, 166, 154, 0.1);
  color: #0d5c4a;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

@media (max-width: 768px) {
  .university-card {
    width: 100%;
    max-width: 100%;
  }
}
`;

css += cleanCss;

fs.writeFileSync('frontend/assets/css/style.css', css);
console.log('Fixed style.css');

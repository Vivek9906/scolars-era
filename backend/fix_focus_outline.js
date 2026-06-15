const fs = require('fs');

let css = fs.readFileSync('frontend/assets/css/style.css', 'utf8');

// Remove the aggressive *:focus outline
css = css.replace(
  /\*:focus\s*\{\s*outline:\s*2px\s*solid\s*#f0a500\s*!important;\s*outline-offset:\s*2px;\s*\}/,
  '/* Removed aggressive focus outline */\n*:focus:not(:focus-visible) { outline: none; }'
);

fs.writeFileSync('frontend/assets/css/style.css', css);
console.log("Fixed focus outline in style.css");

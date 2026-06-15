const fs = require('fs');

let css = fs.readFileSync('frontend/assets/css/style.css', 'utf8');

css = css.replace('.back-to-top:hover {\r\n/* 🏆', '.back-to-top:hover { background: #FFC107; transform: translateY(-5px); }\r\n/* 🏆');
css = css.replace('.back-to-top:hover {\n/* 🏆', '.back-to-top:hover { background: #FFC107; transform: translateY(-5px); }\n/* 🏆');
css = css.replace('.back-to-top:hover {\r\n/* \uD83C\uDFC6', '.back-to-top:hover { background: #FFC107; transform: translateY(-5px); }\r\n/* \uD83C\uDFC6');
css = css.replace('.back-to-top:hover {\n/* \uD83C\uDFC6', '.back-to-top:hover { background: #FFC107; transform: translateY(-5px); }\n/* \uD83C\uDFC6');

// Wait, the unicode emoji might not match. Let's just match `.back-to-top:hover {\n/*`
css = css.replace(/\.back-to-top:hover\s*\{\s*\/\*/, '.back-to-top:hover { background: #FFC107; transform: translateY(-5px); }\n/*');

fs.writeFileSync('frontend/assets/css/style.css', css);

let o=0; 
for(let i=0;i<css.length;i++){
    if(css[i]==='{')o++; 
    if(css[i]==='}')o--; 
} 
console.log('Final open braces:', o);

if (o > 0) {
    console.log("Still missing closing braces! Appending to end of file.");
    for (let j=0; j<o; j++) {
        css += '\n}\n';
    }
    fs.writeFileSync('frontend/assets/css/style.css', css);
    console.log("Appended missing braces.");
} else if (o < 0) {
    console.log("Too many closing braces! Need manual review.");
} else {
    console.log("Braces are perfectly balanced!");
}

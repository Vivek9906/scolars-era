const { execSync } = require('child_process');
const status = execSync('git status --porcelain').toString();
const lines = status.split('\n');
lines.forEach(line => {
    if (!line) return;
    const code = line.substring(0, 2);
    let file = line.substring(3).trim();
    // remove quotes if any
    if (file.startsWith('"') && file.endsWith('"')) {
        file = file.substring(1, file.length - 1);
    }
    
    try {
        if (code === 'UU' || code === 'AA') {
            console.log(`Checking out ours for ${file}`);
            execSync(`git checkout --ours "${file}"`);
            execSync(`git add "${file}"`);
        } else if (code === 'DU' || code === 'UD') {
            console.log(`Removing ${file}`);
            execSync(`git rm "${file}"`);
        }
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
});
console.log('Done resolving.');

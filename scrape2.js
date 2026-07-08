const https = require('https');

function getUnsplashIds(query) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/s/photos/' + encodeURIComponent(query), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find URLs looking like https://images.unsplash.com/photo-[something]?
        const regex = /images\.unsplash\.com\\?\/photo-([a-zA-Z0-9\-]+)/g;
        const ids = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
          if (!ids.includes(match[1])) ids.push(match[1]);
        }
        
        // Also look for "id": "xxxxxxxxx"
        const regex2 = /"id":"([a-zA-Z0-9\-]{10,22})"/g;
        while ((match = regex2.exec(data)) !== null) {
          if (!ids.includes(match[1])) ids.push(match[1]);
        }
        
        resolve([...new Set(ids)]);
      });
    });
  });
}

getUnsplashIds('university campus').then(console.log);

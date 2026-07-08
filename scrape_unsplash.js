const https = require('https');

function searchUnsplash(query) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/s/photos/' + encodeURIComponent(query), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for any string like "images.unsplash.com/photo-[a-zA-Z0-9-]+"
        const regex = /images\.unsplash\.com\\?\/photo-([a-zA-Z0-9\-]+)/g;
        const ids = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
          if (!ids.includes(match[1])) ids.push(match[1]);
        }
        
        // Sometimes they are in JSON stringified format
        const regex2 = /"id":"([a-zA-Z0-9\-]{10,})"/g;
        while ((match = regex2.exec(data)) !== null) {
          if (!ids.includes(match[1])) ids.push(match[1]);
        }
        
        resolve(ids);
      });
    });
  });
}

searchUnsplash('business student').then(console.log);

const https = require('https');

function searchUnsplashNAPI(query) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/napi/search/photos?query=' + encodeURIComponent(query) + '&per_page=10', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results.map(r => r.id));
        } catch(e) {
          resolve([]);
        }
      });
    });
  });
}

searchUnsplashNAPI('university student').then(console.log);

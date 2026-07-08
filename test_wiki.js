const https = require('https');

function getWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
    https.get(url, { headers: { 'User-Agent': 'ScholarsLift Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
  });
}

async function test() {
  console.log('Business School:', await getWikiImage('Business_school'));
  console.log('MBA:', await getWikiImage('Master_of_Business_Administration'));
  console.log('DBA:', await getWikiImage('Doctor_of_Business_Administration'));
  console.log('Education:', await getWikiImage('Education'));
}

test();

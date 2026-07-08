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

const topics = [
  "Harvard_Business_School", "White_House", "Library", "Broadcasting", "Mental_health", "Liberal_arts", "Painting", "Community_centre", "Piano", "Religion", "Chemistry", "Interdisciplinarity",
  "Wall_Street", "European_Parliament", "University_of_Oxford", "Journalism", "Psychotherapy", "Literature", "Sculpture", "Charity_(practice)", "Symphony_orchestra", "Cathedral", "Physics", "Multidisciplinary_approach",
  "Financial_district", "United_Nations_Headquarters", "Cambridge_University_Library", "Mass_media", "Clinical_psychology", "Philosophy", "Art_museum", "Non-governmental_organization", "Classical_music", "Church_(building)", "Biology", "Transdisciplinarity"
];

async function run() {
  const results = {};
  for (const topic of topics) {
    const img = await getWikiImage(topic);
    results[topic] = img;
  }
  console.log(JSON.stringify(results, null, 2));
}

run();

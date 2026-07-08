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
  "Business_administration", "Public_administration", "Education", "Media_studies", "Counseling_psychology", "Humanities", "Fine_art", "Social_work", "Music_education", "Theology", "Science", "Interdisciplinarity",
  "Master_of_Business_Administration", "Master_of_Public_Administration", "Master_of_Education", "Master_of_Arts", "Clinical_psychology", "Liberal_arts_education", "Master_of_Fine_Arts", "Master_of_Social_Work", "Master_of_Music", "Master_of_Theology", "Master_of_Science", "Multidisciplinary_approach",
  "Doctor_of_Business_Administration", "Doctor_of_Public_Administration", "Doctor_of_Education", "Doctor_of_Philosophy", "Doctor_of_Psychology", "Doctor_of_Letters", "Doctor_of_Fine_Arts", "Doctor_of_Social_Work", "Doctor_of_Music", "Doctor_of_Theology", "Doctor_of_Science", "Transdisciplinarity",
  "Harvard_University", "University_of_Oxford", "Stanford_University", "Massachusetts_Institute_of_Technology", "University_of_Cambridge", "California_Institute_of_Technology", "Princeton_University", "Yale_University", "University_of_Chicago", "Columbia_University", "University_of_Pennsylvania", "Cornell_University"
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

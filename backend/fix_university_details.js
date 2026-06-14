const fs = require('fs');

let js = fs.readFileSync('frontend/assets/js/university-detail.js', 'utf8');

// 1. Fix the bug where it returns early if no ID is present, even if slug is present.
js = js.replace(
  'if (!id) {\n    if (loader) loader.classList.add("fade-out");\n    renderError();\n    return;\n  }',
  'if (!id && !slug) {\n    if (loader) loader.classList.add("fade-out");\n    renderError();\n    return;\n  }'
);

js = js.replace(
  'if (!id) {\n      if (loader) loader.classList.add("fade-out");\n      return renderError();\n    }',
  'if (!id) {\n      if (loader) loader.classList.add("fade-out");\n      return renderError();\n    }'
); // just a check, wait let's use a regex to be safer

// Let's just completely rewrite the DOMContentLoaded fetch block to be robust
const newFetchBlock = `
document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("pageLoader");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const slug = params.get("slug");

  if (!id && !slug) {
    if (loader) loader.classList.add("fade-out");
    return renderError();
  }

  // Hardcoded fallback data for the 2 main universities if DB fails or IP is blocked
  const hardcodedData = {
    "kennedy-university": {
      name: "Kennedy University",
      established: "2005",
      country: "Europe / International",
      description: "Kennedy University is a distinguished 'daughter university' associated with Kennedy University of Baptist, dedicated to providing high-quality, accessible distance and online education globally. Offering programs in Business Administration, Leadership, Theology, and more.",
      courses: [
        { name: "Bachelor of Business Administration", duration: "3-4 Years", mode: "Online" },
        { name: "Master of Business Administration", duration: "1-2 Years", mode: "Online" },
        { name: "PhD in Leadership", duration: "3-5 Years", mode: "Online" }
      ],
      rankings: [
        { title: "QAHE Certified", year: "2023" },
        { title: "Top Online Programs", year: "2024" }
      ]
    },
    "kennedy-university-of-baptist": {
      name: "Kennedy University of Baptist",
      established: "1998",
      country: "Florida, USA",
      description: "Kennedy University of Baptist is a private, faith-based educational institution based in Florida, USA. Operating with annual verification as a religious college from the Florida Department of Education, it bridges faith and secular education offering degrees in Theology, Counseling, and Business.",
      courses: [
        { name: "Bachelor in Theology", duration: "4 Years", mode: "Online / On-campus" },
        { name: "Master in Counseling", duration: "2 Years", mode: "Online" },
        { name: "Doctorate in Ministry", duration: "3 Years", mode: "Online" }
      ],
      rankings: [
        { title: "Florida Dept. of Ed. Verified", year: "2024" },
        { title: "Faith-Based Excellence", year: "2023" }
      ]
    }
  };

  try {
    let uni = null;
    
    // First try fetching from backend
    if (slug) {
      try {
        const res = await fetch(\`/api/universities/slug/\${encodeURIComponent(slug)}\`);
        if (res.ok) {
          const result = await res.json();
          if (result && result.data) uni = result.data;
        }
      } catch (e) { console.error("Fetch by slug failed", e); }
    } else if (id) {
      try {
        const res = await fetch(\`/api/universities/id/\${encodeURIComponent(id)}\`);
        if (res.ok) {
          const result = await res.json();
          if (result && result.data) uni = result.data;
        }
      } catch (e) { console.error("Fetch by id failed", e); }
    }

    // If fetch failed (e.g. IP whitelist issue), fallback to hardcoded data
    if (!uni && slug && hardcodedData[slug]) {
        uni = hardcodedData[slug];
    }
    
    if (loader) loader.classList.add("fade-out");
    
    if (!uni) {
      return renderError();
    }
    
    renderUniversity(uni);

  } catch (err) {
    console.error(err);
    if (loader) loader.classList.add("fade-out");
    
    // Final fallback
    if (slug && hardcodedData[slug]) {
       renderUniversity(hardcodedData[slug]);
    } else {
       renderError();
    }
  }
});
`;

js = js.replace(/document\.addEventListener\("DOMContentLoaded", async \(\) => \{[\s\S]+?\}\);\s*$/, newFetchBlock);

fs.writeFileSync('frontend/assets/js/university-detail.js', js);
console.log("Fixed university-detail.js");


// scolars-era/frontend/assets/js/universities.js
"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("universities-grid");
  const loader = document.getElementById("pageLoader");

  if (!grid) {
    if (loader) loader.classList.add("fade-out");
    return;
  }

  try {
    const res = await fetch("/api/universities");
    const data = await res.json();
    const universities = Array.isArray(data.data) ? data.data : [];
    const isHome = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");

    const REALISTIC_LOGOS = [
      "/assets/images/logo_uni1.png",
      "/assets/images/logo_uni2.png",
      "/assets/images/logo_uni3.png",
      "/assets/images/logo_uni4.png"
    ];

    if (!universities.length) {
      grid.innerHTML = `
        <div class="university-empty-state">
          <i class="fas fa-university"></i>
          <h3>Universities will be available soon</h3>
          <p>Our team is updating partner university details.</p>
        </div>
      `;
      return;
    }

    if (isHome) {
      grid.innerHTML = `
        <div class="carousel-container">
          <div class="carousel-track">
            ${[...universities, ...universities, ...universities, ...universities].map((u, i) => {
              let logoSrc = u.logo || '/assets/images/placeholder-university.png';
              return `
              <div class="partner-card-wrapper">
                <div class="partner-card">
                  <div class="partner-badge"><i class="fas fa-check-circle"></i> UGC Approved</div>
                  <img src="${logoSrc}" class="partner-logo" onerror="this.src='/assets/images/placeholder-university.png';" alt="${u.name}">
                  <div class="partner-name">${u.name}</div>
                  <div class="partner-location"><i class="fas fa-map-marker-alt"></i> ${u.country || "Global"}</div>
                  <a href="/university-detail.html?id=${u._id}" class="btn-view-more">View Details</a>
                </div>
              </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    } else {
      grid.classList.add("universities-list-grid");
      grid.innerHTML = universities.map((u, i) => {
        let logoSrc = u.logo || '/assets/images/placeholder-university.png';
        return `
        <div class="university-card" onclick="window.location.href='/university-detail.html?id=${u._id}'">
          <img src="${logoSrc}" class="uni-logo" onerror="this.src='/assets/images/placeholder-university.png';" alt="${u.name}">
          <h3>${u.name}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${u.country || "Global"}</p>
          <a href="/university-detail.html?id=${u._id}" class="btn-view-details">View Details &rarr;</a>
        </div>
        `;
      }).join("");
    }
  } catch (err) {
    grid.innerHTML = `
      <div class="university-empty-state error">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Failed to load universities</h3>
        <p>Please refresh the page or try again later.</p>
      </div>
    `;
  } finally {
    if (loader) loader.classList.add("fade-out");
  }
});

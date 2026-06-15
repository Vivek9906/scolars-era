"use strict";

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("universitiesGrid");
  if (!grid) {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.add("fade-out");
    return;
  }
  
  grid.innerHTML = '<div style="text-align:center;width:100%;padding:40px;">Loading universities...</div>';

  try {
    const res = await fetch('/api/universities');
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    const universities = result.data || [];
    
    if (universities.length === 0) {
      grid.innerHTML = '<div style="text-align:center;width:100%;padding:40px;">No universities found.</div>';
      return;
    }
    
    grid.innerHTML = universities.map(u => {
      const detailUrl = u.slug ? `/university-detail.html?slug=${encodeURIComponent(u.slug)}` : `/university-detail.html?id=${encodeURIComponent(u._id)}`;
      const type = u.partnershipType ? escapeHtml(u.partnershipType) : 'Partner University';
      
      // Force logos for specific universities to bypass DB issues
      if (u.name && u.name.includes('Baptist')) {
        u.logoUrl = '/assets/images/kennedy_baptist_logo.png';
      } else if (u.name && u.name.includes('Kennedy University')) {
        u.logoUrl = '/assets/images/kennedy_logo.jpeg';
      }
      
      const logo = u.logoUrl ? `<img src="${escapeHtml(u.logoUrl)}" class="uni-logo" alt="${escapeHtml(u.name)}">` : `<div class="uni-logo-text">${escapeHtml(u.name)}</div>`;
  
      
      return `
        <div class="university-card">
          ${logo}
          <div class="uni-meta" style="margin-top: 15px; font-size: 13px; color: #666;">
              <span class="uni-type">${type}</span>
          </div>
          <h3>${escapeHtml(u.name)}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(u.country || 'Global')}</p>
          <p style="font-size: 14px; line-height: 1.6; color: #555; margin-bottom: 20px;">
            ${escapeHtml(u.shortDescription || u.description || 'A globally recognized institution offering accredited programmes across various disciplines.')}
          </p>
          <a href="${detailUrl}" class="btn-view-details" style="position: relative; z-index: 100; pointer-events: auto;">View Details &rarr;</a>
        </div>
      `;
    }).join('');
    
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<div style="text-align:center;width:100%;padding:40px;color:red;">Error loading universities. Please try again later.</div>';
  } finally {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.add("fade-out");
  }
});

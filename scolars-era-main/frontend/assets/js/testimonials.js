document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("testimonials-grid");
  if (!grid) return;

  try {
    const res = await fetch("/api/testimonials");
    const data = await res.json();

    const isHome = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
    const testimonialsToDisplay = isHome ? data.data.slice(0, 6) : data.data;

    grid.innerHTML = testimonialsToDisplay.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-text">
          <p>"${t.content}"</p>
        </div>
        <div class="testimonial-author">
          <img src="${t.studentAvatar || '/assets/images/default-avatar.png'}" alt="${t.studentName}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">
          <div>
            <strong style="display:block;color:var(--text-dark);">${t.studentName}</strong>
            <span style="font-size:12px;color:var(--primary-color);">${t.studentRole || 'Student'}</span>
          </div>
        </div>
      </div>
    `).join("");

  } catch (err) {
    grid.innerHTML = "<p>Failed to load testimonials</p>";
  }
});

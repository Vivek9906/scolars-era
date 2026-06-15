// scolars-era/frontend/assets/js/courses.js
"use strict";

// ── Deadline badge (Part 2D) ──────────────────────────────────────────────────
function renderDeadlineBadge(deadlineStatus) {
  if (!deadlineStatus) return "";

  if (deadlineStatus.type === "closed") {
    return `<div class="deadline-badge closed">
              <span class="deadline-icon">🔒</span>
              <span>Registration Closed</span>
            </div>`;
  }

  if (deadlineStatus.type === "countdown") {
    // Render a live countdown that ticks every second
    const deadlineISO = deadlineStatus.deadline;
    const uniqueId = "countdown-" + Math.random().toString(36).slice(2, 7);
    // Schedule countdown initialization after render
    setTimeout(() => initCountdown(uniqueId, deadlineISO), 0);
    return `<div class="deadline-badge countdown">
              <div style="display:flex;align-items:center;gap:4px">
                <span class="deadline-icon">⏰</span>
                <span class="countdown-label">${deadlineStatus.label}</span>
              </div>
              <span class="countdown-timer" id="${uniqueId}">
                --d --h --m --s
              </span>
            </div>`;
  }

  // Static label (more than 31 days away)
  return `<div class="deadline-badge static">
            <span class="deadline-icon">📅</span>
            <span>${deadlineStatus.label}</span>
          </div>`;
}

function initCountdown(elementId, deadlineISO) {
  const el = document.getElementById(elementId);
  if (!el) return;

  function update() {
    const now = new Date();
    const deadline = new Date(deadlineISO);
    const diff = deadline - now;

    if (diff <= 0) {
      el.textContent = "Registration Closed";
      const badge = el.closest(".deadline-badge");
      if (badge) {
        badge.className = "deadline-badge closed";
        const labelEl = badge.querySelector('.countdown-label');
        if (labelEl) labelEl.remove();
        const iconEl = badge.querySelector('.deadline-icon');
        if (iconEl) iconEl.textContent = "🔒";
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(update, 1000);
  }
  update();
}

// ── Level Badge ───────────────────────────────────────────────────────────────
function getLevelBadge(level) {
  const colors = {
    "Beginner": { bg: "#E8F5E9", color: "#2E7D32" },
    "Intermediate": { bg: "#FFF3E0", color: "#E65100" },
    "Advanced": { bg: "#FFEBEE", color: "#C62828" }
  };
  const style = colors[level] || { bg: "#f0f0f0", color: "#666" };
  return `<span style="background:${style.bg};color:${style.color};padding:3px 10px;border-radius:50px;font-size:11px;font-weight:700;">${level}</span>`;
}

// ── Star rating HTML ──────────────────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<i class="fas fa-star"></i>'.repeat(full) +
    (half ? '<i class="fas fa-star-half-alt"></i>' : "") +
    '<i class="far fa-star"></i>'.repeat(empty)
  );
}

// ── Slug → page URL mapping ───────────────────────────────────────────────────
const SLUG_MAP = {
  "b-ed-bachelor-of-education": "/b-ed-course.html",
  "bed": "/b-ed-course.html",
  "m-ed-master-of-education": "/m-ed-course.html",
  "med": "/m-ed-course.html",
  "b-sc-bachelor-of-science": "/b-sc-course.html",
  "bsc": "/b-sc-course.html",
  "m-sc-master-of-science": "/m-sc-course.html",
  "msc": "/m-sc-course.html",
  "m-tech-master-of-technology": "/m-tech-course.html",
  "mtech": "/m-tech-course.html",
};

function coursePageUrl(slug) {
  if (!slug) return "/course1.html";
  const s = slug.toLowerCase();
  if (SLUG_MAP[s]) return SLUG_MAP[s];
  for (const key of Object.keys(SLUG_MAP)) {
    if (s.includes(key) || key.includes(s)) return SLUG_MAP[key];
  }
  return "/course1.html";
}

const REALISTIC_THUMBNAILS = [
  "/assets/images/course_edu.png",
  "/assets/images/course_sci.png",
  "/assets/images/course_tech.png",
  "/assets/images/course_campus.png"
];
let thumbIndex = 0;

function courseCardHTML(c) {
  const url = coursePageUrl(c.slug);
  let thumb = c.thumbnail;
  if (!thumb || thumb.includes("course1.jpeg")) {
    thumb = REALISTIC_THUMBNAILS[thumbIndex % REALISTIC_THUMBNAILS.length];
    thumbIndex++;
  }
  const priceDisplay = c.isFree ? "Free" : `$${(c.price || 0).toFixed(2)}`;

  return `
  <div class="course-card">
      <a href="${url}" style="display: block; color: inherit;">
          <div class="course-image">
              <img src="${thumb}" alt="${c.title}" onerror="this.src='/assets/images/course1.jpeg'">
              <span class="course-price">${priceDisplay}</span>
          </div>
          <div class="course-content">
              <div class="course-meta">
                  <span><i class="far fa-user"></i> ${c.title}</span>
                  <div class="stars">
                      ${renderStars(5)} (2.5k)
                  </div>
              </div>
          </div>
      </a>
  </div>`;
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function skeletonHTML() {
  return Array.from({ length: 3 }, () => `
  <div class="course-card skeleton-card">
    <div style="height:220px;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200%;animation:shimmer 1.4s infinite;"></div>
    <div style="padding:20px">
      <div style="height:20px;background:#f0f0f0;border-radius:4px;margin-bottom:15px;width:30%;animation:shimmer 1.4s infinite"></div>
      <div style="height:24px;background:#f0f0f0;border-radius:4px;margin-bottom:10px;animation:shimmer 1.4s infinite"></div>
      <div style="height:14px;background:#f0f0f0;border-radius:4px;width:80%;animation:shimmer 1.4s infinite;margin-bottom:20px;"></div>
      <div style="height:36px;background:#f0f0f0;border-radius:8px;width:100%;animation:shimmer 1.4s infinite"></div>
    </div>
  </div>`).join("");
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function loadCourses() {
  const grid = document.getElementById("courses-grid");
  const loader = document.getElementById("pageLoader");

  if (!grid) {
    if (loader) loader.classList.add("fade-out");
    return;
  }

  grid.innerHTML = skeletonHTML();

  try {
    // Fetch all active courses. We increase the limit to ensure all courses show up.
    const res  = await fetch("/api/courses?limit=100");
    
    const json = await res.json();
    
    const data = json.data || [];

    if (!data.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:#f9f9f9;border-radius:20px;border:2px dashed #eee;">
          <div style="font-size:48px;margin-bottom:16px;">🎓</div>
          <h3 style="font-size:20px;color:#333;margin-bottom:8px;">No courses available yet</h3>
          <p style="color:#888;">Check back soon for new and exciting programs!</p>
        </div>`;
      return;
    }
    grid.innerHTML = data.map(courseCardHTML).join("");

    // Re-trigger scroll reveal for newly inserted cards
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  } catch (err) {
    console.error("[courses.js] Fetch failed:", err);
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:#C62828;background:#FFEBEE;border-radius:12px;">
        Failed to load courses. 
        <button class="btn-retry-courses" style="margin-left:10px;padding:6px 12px;border:none;background:#C62828;color:white;border-radius:6px;cursor:pointer;">Try again →</button>
      </div>`;
    
    setTimeout(() => {
      const retryBtn = grid.querySelector('.btn-retry-courses');
      if (retryBtn) retryBtn.addEventListener('click', loadCourses);
    }, 0);
  } finally {
    if (loader) {
      loader.classList.add("fade-out");
    }
  }
}

document.addEventListener("DOMContentLoaded", loadCourses);

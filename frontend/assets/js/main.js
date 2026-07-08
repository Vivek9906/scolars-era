// scolars-era/frontend/assets/js/main.js
"use strict";

// Secret admin shortcut: press Ctrl+Shift+A
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    window.location.href = "/admin/index.html";
  }
});

/* ── Rotating hero words ─────────────────────────────────────────── */
function initWordRotator() {
  const el = document.getElementById("changing-word");
  if (!el) return;
  const words = ["Studies", "Career", "Future", "Admission", "Dream"];
  let i = 0;
  setInterval(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
  }, 2500);
}

/* ── Sticky navbar ───────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}

/* ── Mobile menu ─────────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  if (toggle) toggle.addEventListener("click", () => {
    links.classList.toggle("active");
    const icon = toggle.querySelector("i");
    if (icon) icon.className = links.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
  });
}

/* ── Scroll reveal ───────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));
}

/* ── Smooth scroll for anchor links ──────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });
}

/* ── Stats counter animation ─────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target || el.textContent, 10);
      const suffix = el.dataset.suffix || "";
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => {
    const raw = el.textContent.trim();
    const num = parseInt(raw, 10);
    // Extract suffix: everything after the numeric part (e.g. "50+" → "+", "98%" → "%", "5,000+" → "+")
    const suffixMatch = raw.match(/[\d,]+\s*(.*)/);
    const suffix = suffixMatch ? suffixMatch[1] : "";
    el.dataset.target = num;
    el.dataset.suffix = suffix;
    io.observe(el);
  });
}

/* ── Newsletter form ─────────────────────────────────────────────── */
function initNewsletter() {
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      if (input && input.value) {
        input.value = "";
        const btn = form.querySelector("button");
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i>'; }, 2000); }
      }
    });
  });
}

/* ── Initialise all ──────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Page load experience (Part 3E)
  const loader = document.createElement("div");
  loader.className = "page-loader-bar";
  document.body.appendChild(loader);
  setTimeout(() => loader.remove(), 700);

  initWordRotator();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  initCounters();
  initNewsletter();
  initAdminAccess();
  initUXEnhancements();
  initBannerLoop();
});

/* ── Fix Top Banner Loop ─────────────────────────────────────────── */
function initBannerLoop() {
  const track = document.querySelector('.banner-track');
  if (track) {
    // Clone all current items to double the length for seamless ultra-wide scrolling
    const items = track.querySelectorAll('.banner-items');
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }
}

/* ── UX Enhancements (Part 3C) ───────────────────────────────────── */
function initUXEnhancements() {
  // 1. Active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPath || (currentPath === "/" && link.getAttribute("href") === "/index.html")) {
      link.classList.add("nav-active");
    }
  });

  // 2. Scroll progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress-bar";
  document.body.appendChild(progressBar);

  // 3. Back-to-top button
  const backToTop = document.createElement("div");
  backToTop.className = "back-to-top";
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  if (backToTop) backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    // Progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";

    // Back-to-top
    if (winScroll > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }, { passive: true });
}

/* ── Admin panel access (professional, discreet) ──────────────────────────────
   Two ways to reach the admin panel:
   1. Keyboard shortcut: Ctrl + Shift + A  (anywhere on the site)
   2. Triple-click the footer copyright text
   Both show a subtle branded toast with a secure link.
────────────────────────────────────────────────────────────────────────────── */
function initAdminAccess() {
  // -- Shared toast popup ------------------------------------------------
  function showAdminToast() {
    // Remove any existing toast
    const old = document.getElementById("_adminToast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "_adminToast";
    toast.style.cssText = [
      "position:fixed", "bottom:28px", "right:28px", "z-index:99999",
      "background:linear-gradient(135deg,#004D40,#00695C)",
      "color:#fff", "padding:18px 22px", "border-radius:16px",
      "box-shadow:0 12px 40px rgba(0,0,0,.25)",
      "font-family:'Outfit',sans-serif", "font-size:14px",
      "max-width:280px", "opacity:0", "transform:translateY(20px)",
      "transition:all .35s cubic-bezier(.4,0,.2,1)",
    ].join(";");

    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="width:34px;height:34px;background:linear-gradient(135deg,#FFC107,#FF9800);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div>
          <div style="font-weight:800;font-size:15px">Admin Panel</div>
          <div style="font-size:11px;opacity:.7">SCOLARS LIFT Management</div>
        </div>
        <button class="btn-close-toast" style="margin-left:auto;background:rgba(255,255,255,.15);border:none;color:#fff;border-radius:6px;width:24px;height:24px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center">✕</button>
      </div>
      <a href="/admin/index.html" class="admin-toast-link" style="display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,.15);color:#fff;text-decoration:none;padding:10px;border-radius:10px;font-weight:700;font-size:13px;border:1px solid rgba(255,255,255,.2);transition:.2s">
        <i class="fas fa-lock"></i> Go to Admin Panel
      </a>`;

    document.body.appendChild(toast);
    
    // Add event listeners for hover and click
    const closeBtn = toast.querySelector('.btn-close-toast');
    if (closeBtn) {
      if (closeBtn) closeBtn.addEventListener('click', function() {
        toast.remove();
      });
    }
    
    const adminLink = toast.querySelector('.admin-toast-link');
    if (adminLink) {
      if (adminLink) adminLink.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255,255,255,.25)';
      });
      adminLink.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255,255,255,.15)';
      });
    }
    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 400);
      }
    }, 6000);
  }

  // -- 1. Keyboard shortcut: Ctrl + Shift + A ----------------------------
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      showAdminToast();
    }
  });

  // -- 2. Triple-click on footer copyright text --------------------------
  const footer = document.querySelector(".footer-bottom p");
  if (footer) {
    let clickCount = 0, clickTimer = null;
    footer.style.cursor = "default";
    if (footer) footer.addEventListener("click", () => {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      if (clickCount >= 3) {
        clickCount = 0;
        showAdminToast();
      }
    });
  }
}


document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
        }
    });
});


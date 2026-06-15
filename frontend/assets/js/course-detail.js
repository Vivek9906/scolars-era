// scolars-era/frontend/assets/js/course-detail.js
"use strict";

(function () {
  function showToast(msg, type) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `position:fixed;bottom:30px;right:30px;padding:14px 22px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.18);transition:.3s;transform:translateY(20px);opacity:0;font-family:'Outfit',sans-serif;${
      type === "success"
        ? "background:#004D40;color:#fff;"
        : "background:#C62828;color:#fff;"
    }`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const enrollBtn = document.getElementById("enroll-btn");
    if (!enrollBtn) return;

    enrollBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      enrollBtn.disabled = true;
      enrollBtn.textContent = "Checking...";
      try {
        const token = localStorage.getItem("se_token");
        const headers = token ? { Authorization: "Bearer " + token } : {};
        const r = await fetch("/api/auth/me", { headers, credentials: "include" });
        if (r.ok) {
          showToast("✅ Enrollment coming soon! We'll notify you.", "success");
        } else {
          showToast("Please contact us to enroll in this course.", "success");
          setTimeout(() => {
            const section = document.getElementById("contact-section") || document.querySelector(".contact-section");
            if (section) section.scrollIntoView({ behavior: "smooth" });
            else window.location.href = "/#contact-section";
          }, 1500);
        }
      } catch {
        showToast("Please contact us to enroll.", "success");
      } finally {
        enrollBtn.disabled = false;
        enrollBtn.textContent = "Enroll Now";
      }
    });
  });
})();

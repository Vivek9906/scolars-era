// scolars-era/frontend/assets/js/admin-dashboard.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.require()) return;
  loadStats();
  loadRecent();
  setInterval(loadStats, 60_000);
});

async function loadStats() {
  const [c, u, t, m] = await Promise.allSettled([
    api("GET", "/api/admin/courses"),
    api("GET", "/api/admin/universities"),
    api("GET", "/api/admin/testimonials"),
    api("GET", "/api/admin/contacts?status=pending&limit=1"),
  ]);

  const set = (id, result, path) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (result.status === "fulfilled" && result.value) {
      const val = path.split(".").reduce((o, k) => o?.[k], result.value);
      el.textContent = val ?? "0";
      el.style.transition = "transform .2s";
      el.style.transform = "scale(1.15)";
      setTimeout(() => (el.style.transform = "scale(1)"), 200);
    } else {
      el.textContent = "0";
    }
  };

  set("stat-courses",      c, "data.length");
  set("stat-universities", u, "data.length");
  set("stat-testimonials", t, "data.length");
  set("stat-messages",     m, "meta.total");
}

async function loadRecent() {
  const tbody = document.getElementById("recent-tbody");
  if (!tbody) return;
  skelRows("recent-tbody", 4, 3);
  try {
    const d    = await api("GET", "/api/admin/contacts?status=pending&limit=5");
    const rows = d.data || [];
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="tbl-empty">No pending contacts 🎉</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(c => `<tr>
      <td>${escH(c.name)}</td>
      <td>${escH(c.subject)}</td>
      <td>${new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
      <td>
        <a href="/admin/contacts.html" class="btn btn-primary btn-sm">View →</a>
      </td>
    </tr>`).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="tbl-empty">⚠️ ${escH(e.message)}</td></tr>`;
  }
}

// scolars-era/frontend/assets/js/admin-shared.js
"use strict";

// ── Auth ───────────────────────────────────────────────────────────────────────
const Auth = {
  getToken() {
    return localStorage.getItem("se_token") ||
           sessionStorage.getItem("se_token") ||
           this._cookie("se_token") ||
           localStorage.getItem("token");
  },
  save(token) {
    localStorage.setItem("se_token", token);
    localStorage.setItem("token", token);
  },
  clear() {
    ["se_token", "token"].forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  },
  _cookie(n) {
    const m = document.cookie.match("(^|;)\\s*" + n + "\\s*=\\s*([^;]+)");
    return m ? m.pop() : null;
  },
  headers(json = true) {
    const h = { Authorization: "Bearer " + this.getToken() };
    if (json) h["Content-Type"] = "application/json";
    return h;
  },
  require() {
    if (!this.getToken()) {
      window.location.href = "/admin/login.html";
      return false;
    }
    return true;
  },
};

// ── API helper ─────────────────────────────────────────────────────────────────
async function api(method, url, body = null, isForm = false) {
  const opts = { method, headers: Auth.headers(!isForm) };
  if (body) opts.body = isForm ? body : JSON.stringify(body);
  let res;
  try {
    res = await fetch(url, opts);
  } catch {
    throw new Error("Network error - server may be down");
  }
  if (res.status === 401) {
    Auth.clear();
    window.location.href = "/admin/login.html";
    return;
  }
  let data;
  try { data = await res.json(); }
  catch { throw new Error("Bad server response (" + res.status + ")"); }
  if (!res.ok) throw new Error(data.message || "Request failed (" + res.status + ")");
  return data;
}

// ── Toast ──────────────────────────────────────────────────────────────────────
const _tw = document.createElement("div");
_tw.className = "toast-wrap";
document.body.appendChild(_tw);

function toast(msg, type = "ok") {
  const t = document.createElement("div");
  t.className = "toast toast-" + type;
  t.innerHTML = "<span>" + escH(msg) + "</span>";
  _tw.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("in")));
  setTimeout(() => {
    t.classList.replace("in", "out");
    setTimeout(() => t.remove(), 320);
  }, 3400);
}

// ── Confirm modal ──────────────────────────────────────────────────────────────
function confirm(title, body, okText = "Confirm", danger = true) {
  return new Promise(res => {
    const ov = document.createElement("div");
    ov.className = "modal-overlay open";
    ov.innerHTML = `<div class="modal-box modal-sm">
      <div class="confirm-body">
        <div class="confirm-ico">${danger ? "⚠️" : "❓"}</div>
        <h3>${escH(title)}</h3><p>${escH(body)}</p>
      </div>
      <div class="modal-ft">
        <button class="btn btn-ghost" data-a="cancel">Cancel</button>
        <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-a="ok">
          ${escH(okText)}
        </button>
      </div></div>`;
    document.body.appendChild(ov);
    const done = v => { ov.remove(); res(v); };
    ov.querySelector("[data-a=ok]").onclick     = () => done(true);
    ov.querySelector("[data-a=cancel]").onclick = () => done(false);
    ov.addEventListener("click", e => { if (e.target === ov) done(false); });
  });
}

// ── Modal helpers ──────────────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add("open"); document.body.style.overflow = "hidden"; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove("open"); document.body.style.overflow = ""; }
}

// ── Table helpers ──────────────────────────────────────────────────────────────
function skelRows(tbodyId, cols, rows = 4) {
  const cells = Array(cols).fill('<td><div class="skel-cell"></div></td>').join("");
  const el = document.getElementById(tbodyId);
  if (el) el.innerHTML = Array(rows).fill(`<tr>${cells}</tr>`).join("");
}
function emptyRow(tbodyId, cols, msg) {
  const el = document.getElementById(tbodyId);
  if (el) el.innerHTML = `<tr><td colspan="${cols}" class="tbl-empty">${escH(msg)}</td></tr>`;
}

// ── Form helpers ───────────────────────────────────────────────────────────────
function formBusy(formId, busy, txt = "Save") {
  const form = typeof formId === "string" ? document.getElementById(formId) : formId;
  if (!form) return;
  const btn = form.querySelector("[type=submit]") || form.querySelector(".form-save-btn");
  if (btn) {
    btn.disabled = busy;
    btn.innerHTML = busy ? '<span class="spin-sm"></span> Saving…' : escH(txt);
  }
  form.querySelectorAll("input,select,textarea").forEach(e => e.disabled = busy);
}

// ── HTML escape ────────────────────────────────────────────────────────────────
function escH(s) {
  const d = document.createElement("div");
  d.appendChild(document.createTextNode(String(s ?? "")));
  return d.innerHTML;
}

// ── DOMContentLoaded bootstrap ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle (mobile)
  const toggle = document.getElementById("sbToggle");
  const sb     = document.getElementById("adminSb");
  const veil   = document.getElementById("sbVeil");
  const sbOpen  = () => { sb?.classList.add("open");    veil?.classList.add("show"); };
  const sbClose = () => { sb?.classList.remove("open"); veil?.classList.remove("show"); };
  toggle?.addEventListener("click", () =>
    sb?.classList.contains("open") ? sbClose() : sbOpen()
  );
  veil?.addEventListener("click", sbClose);

  // Mark active nav link
  const cur = window.location.pathname.split("/").pop();
  document.querySelectorAll(".sb-link").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href && href === cur) a.classList.add("active");
  });

  // Sign-out button
  document.getElementById("btnOut")?.addEventListener("click", () => {
    Auth.clear();
    window.location.href = "/admin/login.html";
  });

  // Show admin name from JWT payload
  try {
    const t = Auth.getToken();
    if (t) {
      const p = JSON.parse(atob(t.split(".")[1]));
      const el = document.getElementById("adminName");
      if (el && p.name) el.textContent = p.name;
    }
  } catch { /* ignore */ }

  // Wire all [data-close] buttons
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
});

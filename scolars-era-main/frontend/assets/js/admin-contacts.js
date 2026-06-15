// scolars-era/frontend/assets/js/admin-contacts.js
"use strict";

let curTab = "pending";

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.require()) return;

  // Wire status tabs
  document.querySelectorAll(".tab-btn[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      curTab = btn.dataset.tab;
      loadContacts(curTab);
    });
  });

  loadCounts();
  loadContacts("pending");

  // Table — event delegation (row click = detail modal; button click = status change)
  document.getElementById("contacts-tbody")?.addEventListener("click", async e => {
    // Button first
    const btn = e.target.closest("[data-action]");
    if (btn) {
      e.stopPropagation();
      const { action, id } = btn.dataset;
      const statusMap = {
        "mk-read":     "read",
        "mk-replied":  "replied",
        "mk-spam":     "spam",
        "mk-resolved": "resolved",
        "mk-pending":  "pending",
      };
      if (statusMap[action]) await setStatus(id, statusMap[action]);
      return;
    }
    // Row click → detail modal
    const row = e.target.closest("tr[data-cid]");
    if (row) {
      try { showDetail(JSON.parse(decodeURIComponent(row.dataset.cid))); }
      catch { /* ignore parse errors */ }
    }
  });
});

// ── Load contacts ──────────────────────────────────────────────────────────────
async function loadContacts(status) {
  skelRows("contacts-tbody", 7);
  try {
    const d = await api("GET", `/api/admin/contacts?status=${status}&limit=50`);
    renderRows(d.data || []);
    const el = document.getElementById("cn-" + status);
    if (el) el.textContent = d.meta?.total ?? 0;
  } catch (e) {
    emptyRow("contacts-tbody", 7, "⚠️ " + e.message);
    toast(e.message, "err");
  }
}

// ── Render rows ────────────────────────────────────────────────────────────────
function renderRows(contacts) {
  if (!contacts.length) {
    emptyRow("contacts-tbody", 7,
      curTab === "pending"
        ? "No pending contacts — inbox is clear 🎉"
        : `No ${curTab} contacts.`);
    return;
  }

  document.getElementById("contacts-tbody").innerHTML = contacts.map(c => {
    const enc = encodeURIComponent(JSON.stringify(c));
    return `<tr data-cid="${enc}" style="cursor:pointer">
      <td>${escH(c.name)}</td>
      <td><a href="mailto:${escH(c.email)}" onclick="event.stopPropagation()">${escH(c.email)}</a></td>
      <td>${escH(c.phone || "—")}</td>
      <td>${escH(c.subject)}</td>
      <td class="muted">${escH((c.message || "").substring(0, 70))}${(c.message || "").length > 70 ? "…" : ""}</td>
      <td>${new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
      <td class="cell-actions" onclick="event.stopPropagation()">
        ${statusBtns(c)}
      </td>
    </tr>`;
  }).join("");
}

// ── Status buttons ─────────────────────────────────────────────────────────────
function statusBtns(c) {
  const btns = [];
  if (c.status !== "read")
    btns.push(`<button class="btn btn-sm btn-info"    data-action="mk-read"     data-id="${c._id}">Read</button>`);
  if (c.status !== "replied")
    btns.push(`<button class="btn btn-sm btn-success" data-action="mk-replied"  data-id="${c._id}">Replied</button>`);
  if (c.status !== "resolved")
    btns.push(`<button class="btn btn-sm btn-primary" data-action="mk-resolved" data-id="${c._id}">Resolve ✓</button>`);
  if (c.status !== "spam")
    btns.push(`<button class="btn btn-sm btn-warn"    data-action="mk-spam"     data-id="${c._id}">Spam</button>`);
  if (c.status !== "pending")
    btns.push(`<button class="btn btn-sm btn-ghost"   data-action="mk-pending"  data-id="${c._id}">Reopen</button>`);
  return btns.join("");
}

// ── Set status ─────────────────────────────────────────────────────────────────
async function setStatus(id, status) {
  try {
    await api("PATCH", `/api/admin/contacts/${id}/status`, { status });
    toast("Moved to " + status, "ok");
    loadContacts(curTab);
    loadCounts();
  } catch (e) {
    toast("Failed: " + e.message, "err");
  }
}

// ── Load tab counts ────────────────────────────────────────────────────────────
async function loadCounts() {
  const tabs    = ["pending", "read", "replied", "spam", "resolved"];
  const results = await Promise.allSettled(
    tabs.map(s => api("GET", `/api/admin/contacts?status=${s}&limit=1`))
  );
  results.forEach((r, i) => {
    const el = document.getElementById("cn-" + tabs[i]);
    if (el && r.status === "fulfilled")
      el.textContent = r.value?.meta?.total ?? 0;
  });
}

// ── Detail modal ───────────────────────────────────────────────────────────────
function showDetail(c) {
  document.getElementById("contact-detail-body").innerHTML = `
    <div class="d-row">
      <span class="d-lbl">Name</span>
      <span class="d-val">${escH(c.name)}</span>
    </div>
    <div class="d-row">
      <span class="d-lbl">Email</span>
      <span class="d-val"><a href="mailto:${escH(c.email)}">${escH(c.email)}</a></span>
    </div>
    <div class="d-row">
      <span class="d-lbl">Phone</span>
      <span class="d-val">${escH(c.phone || "Not provided")}</span>
    </div>
    <div class="d-row">
      <span class="d-lbl">Subject</span>
      <span class="d-val">${escH(c.subject)}</span>
    </div>
    <div class="d-row">
      <span class="d-lbl">Status</span>
      <span class="d-val"><span class="s-pill ${c.status}">${c.status}</span></span>
    </div>
    <div class="d-row">
      <span class="d-lbl">Received</span>
      <span class="d-val">${new Date(c.createdAt).toLocaleString("en-IN")}</span>
    </div>
    <div class="d-row" style="display:block">
      <div class="d-lbl" style="margin-bottom:.5rem">Message</div>
      <div class="msg-box">${escH(c.message)}</div>
    </div>`;

  const link = document.getElementById("contact-reply-link");
  if (link) link.href = `mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`;

  openModal("contact-detail-modal");
}

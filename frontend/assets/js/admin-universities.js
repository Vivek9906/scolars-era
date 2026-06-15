// scolars-era/frontend/assets/js/admin-universities.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.require()) return;
  loadUniversities();

  // Add button
  document.getElementById("btnAddUni")?.addEventListener("click", () => {
    resetUniForm();
    document.getElementById("uni-modal-title").textContent = "Add University";
    document.getElementById("uni-save-btn").textContent    = "Save University";
    openModal("uni-modal");
  });

  // Save button
  document.getElementById("uni-save-btn")?.addEventListener("click", saveUniversity);

  // Table — event delegation
  document.getElementById("unis-tbody")?.addEventListener("click", async e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id, name } = btn.dataset;
    if (action === "edit")   await editUniversity(id);
    if (action === "delete") await deleteUniversity(id, name);
    if (action === "activate")   await toggleUniversity(id, true);
    if (action === "deactivate") await toggleUniversity(id, false);
  });
});

// ── Load ───────────────────────────────────────────────────────────────────────
async function loadUniversities() {
  skelRows("unis-tbody", 6);
  try {
    const d    = await api("GET", "/api/admin/universities");
    const unis = d.data || [];
    const cnt  = document.getElementById("uni-count");
    if (cnt) cnt.textContent = unis.length;

    if (!unis.length) {
      emptyRow("unis-tbody", 6, "No universities yet. Click + Add University.");
      return;
    }

    document.getElementById("unis-tbody").innerHTML = unis.map(u => `
      <tr>
        <td>
          ${u.logo
            ? `<img src="${escH(u.logo)}" class="uni-logo-tbl"
                    alt="${escH(u.name)}"
                    onerror="this.style.display='none'">`
            : '<span style="font-size:1.4rem">🏛️</span>'}
        </td>
        <td class="cell-main">
          <strong>${escH(u.name)}</strong>
          <small>${escH(u.websiteUrl || "")}</small>
        </td>
        <td>${escH(u.country)}</td>
        <td><span class="badge badge-blue">${escH(u.partnershipType || "—")}</span></td>
        <td><span class="s-pill ${u.isActive !== false ? "active" : "inactive"}">
          ${u.isActive !== false ? "Active" : "Inactive"}
        </span></td>
        <td class="cell-actions">
          <button class="btn btn-sm btn-ghost"
                  data-action="edit" data-id="${u._id}">✏️ Edit</button>
          <button class="btn btn-sm ${u.isActive !== false ? "btn-warn" : "btn-success"}"
                  data-action="${u.isActive !== false ? "deactivate" : "activate"}"
                  data-id="${u._id}">
            ${u.isActive !== false ? "Deactivate" : "Activate"}
          </button>
          <button class="btn btn-sm btn-danger"
                  data-action="delete"
                  data-id="${u._id}"
                  data-name="${escH(u.name)}">🗑️</button>
        </td>
      </tr>`).join("");
  } catch (e) {
    emptyRow("unis-tbody", 6, "⚠️ " + e.message);
    toast(e.message, "err");
  }
}

// ── Edit ───────────────────────────────────────────────────────────────────────
async function editUniversity(id) {
  try {
    const d    = await api("GET", `/api/admin/universities/${id}`);
    const u    = d.data;
    const form = document.getElementById("uni-form");

    document.getElementById("edit-uni-id").value           = u._id;
    document.getElementById("uni-modal-title").textContent = "Edit University";
    document.getElementById("uni-save-btn").textContent    = "Update University";

    form.elements["name"].value            = u.name            || "";
    form.elements["country"].value         = u.country         || "";
    form.elements["websiteUrl"].value      = u.websiteUrl      || "";
    form.elements["partnershipType"].value = u.partnershipType || "Academic";
    form.elements["description"].value     = u.description     || "";
    form.elements["sortOrder"].value       = u.sortOrder       ?? 99;
    form.elements["isActive"].checked      = u.isActive !== false;

    openModal("uni-modal");
  } catch (e) {
    toast("Failed to load university: " + e.message, "err");
  }
}

// ── Save ───────────────────────────────────────────────────────────────────────
async function saveUniversity() {
  const form   = document.getElementById("uni-form");
  const id     = document.getElementById("edit-uni-id").value;
  const isEdit = !!id;
  const url    = isEdit ? `/api/admin/universities/${id}` : "/api/admin/universities";
  const meth   = isEdit ? "PUT" : "POST";

  const fileInput = form.elements["logo"];
  const hasFile   = fileInput?.files?.length > 0;

  let body, isForm = false;

  if (hasFile) {
    body   = new FormData(form);
    isForm = true;
  } else {
    body = {
      name:            form.elements["name"].value.trim(),
      country:         form.elements["country"].value.trim(),
      websiteUrl:      form.elements["websiteUrl"].value.trim() || null,
      partnershipType: form.elements["partnershipType"].value,
      description:     form.elements["description"].value.trim() || null,
      sortOrder:       parseInt(form.elements["sortOrder"].value, 10) || 99,
      isActive:        form.elements["isActive"].checked,
    };
  }

  const btn     = document.getElementById("uni-save-btn");
  btn.disabled  = true;
  btn.innerHTML = '<span class="spin-sm"></span> Saving…';

  try {
    await api(meth, url, body, isForm);
    toast(isEdit ? "University updated ✓" : "University created ✓", "ok");
    closeModal("uni-modal");
    resetUniForm();
    loadUniversities();
  } catch (e) {
    toast("Save failed: " + e.message, "err");
  } finally {
    btn.disabled    = false;
    btn.textContent = isEdit ? "Update University" : "Save University";
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────
async function deleteUniversity(id, name) {
  const ok = await confirm(`Delete "${name}"?`, "This permanently removes the university.", "Delete");
  if (!ok) return;
  try {
    await api("DELETE", `/api/admin/universities/${id}`);
    toast("University deleted", "ok");
    loadUniversities();
  } catch (e) {
    toast("Delete failed: " + e.message, "err");
  }
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
async function toggleUniversity(id, activate) {
  try {
    await api("PUT", `/api/admin/universities/${id}`, { isActive: activate });
    toast(`University ${activate ? "activated" : "deactivated"}`, "ok");
    loadUniversities();
  } catch (e) {
    toast("Failed: " + e.message, "err");
  }
}

// ── Reset ──────────────────────────────────────────────────────────────────────
function resetUniForm() {
  document.getElementById("uni-form").reset();
  document.getElementById("edit-uni-id").value = "";
}

// scolars-era/frontend/assets/js/admin-testimonials.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.require()) return;
  loadTestimonials();

  // Add button
  document.getElementById("btnAddTesti")?.addEventListener("click", async () => {
    resetTestiForm();
    document.getElementById("testi-modal-title").textContent = "Add Testimonial";
    document.getElementById("testi-save-btn").textContent    = "Save Testimonial";
    await populateCourseSelect();
    openModal("testi-modal");
  });

  // Save button
  document.getElementById("testi-save-btn")?.addEventListener("click", saveTestimonial);

  // Table — event delegation
  document.getElementById("testi-tbody")?.addEventListener("click", async e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id, name } = btn.dataset;
    if (action === "edit")           await editTestimonial(id);
    if (action === "delete")         await deleteTestimonial(id, name);
    if (action === "toggle-featured") await toggleFeatured(id, btn.dataset.featured === "true");
    if (action === "activate")       await toggleTestimonial(id, true);
    if (action === "deactivate")     await toggleTestimonial(id, false);
  });
});

// ── Load ───────────────────────────────────────────────────────────────────────
async function loadTestimonials() {
  skelRows("testi-tbody", 7);
  try {
    const d     = await api("GET", "/api/admin/testimonials");
    const items = d.data || [];
    const cnt   = document.getElementById("testi-count");
    if (cnt) cnt.textContent = items.length;

    if (!items.length) {
      emptyRow("testi-tbody", 7, "No testimonials yet. Click + Add Testimonial.");
      return;
    }

    document.getElementById("testi-tbody").innerHTML = items.map(t => `
      <tr>
        <td>
          ${t.studentAvatar
            ? `<img src="${escH(t.studentAvatar)}" class="tbl-thumb"
                    style="border-radius:50%"
                    alt="${escH(t.studentName)}"
                    onerror="this.style.display='none'">`
            : '<span style="font-size:1.4rem">👤</span>'}
        </td>
        <td class="cell-main">
          <strong>${escH(t.studentName)}</strong>
        </td>
        <td>${escH(t.studentRole || "—")}</td>
        <td>${"⭐".repeat(Math.min(5, Math.max(1, t.rating || 5)))}</td>
        <td>${t.isFeatured
              ? '<span class="badge badge-orange">★ Featured</span>'
              : '<span class="badge badge-gray">—</span>'}</td>
        <td><span class="s-pill ${t.isActive !== false ? "active" : "inactive"}">
          ${t.isActive !== false ? "Active" : "Inactive"}
        </span></td>
        <td class="cell-actions">
          <button class="btn btn-sm btn-ghost"
                  data-action="edit" data-id="${t._id}">✏️ Edit</button>
          <button class="btn btn-sm ${t.isFeatured ? "btn-warn" : "btn-info"}"
                  data-action="toggle-featured"
                  data-id="${t._id}"
                  data-featured="${t.isFeatured}">
            ${t.isFeatured ? "Unfeature" : "Feature"}
          </button>
          <button class="btn btn-sm ${t.isActive !== false ? "btn-warn" : "btn-success"}"
                  data-action="${t.isActive !== false ? "deactivate" : "activate"}"
                  data-id="${t._id}">
            ${t.isActive !== false ? "Deactivate" : "Activate"}
          </button>
          <button class="btn btn-sm btn-danger"
                  data-action="delete"
                  data-id="${t._id}"
                  data-name="${escH(t.studentName)}">🗑️</button>
        </td>
      </tr>`).join("");
  } catch (e) {
    emptyRow("testi-tbody", 7, "⚠️ " + e.message);
    toast(e.message, "err");
  }
}

// ── Populate course dropdown ───────────────────────────────────────────────────
async function populateCourseSelect(selectedId = "") {
  const sel = document.getElementById("testi-course-select");
  if (!sel) return;
  try {
    const d = await api("GET", "/api/admin/courses");
    const courses = d.data || [];
    sel.innerHTML = '<option value="">— None —</option>' +
      courses.map(c =>
        `<option value="${c._id}" ${c._id === selectedId ? "selected" : ""}>${escH(c.title)}</option>`
      ).join("");
  } catch { /* leave empty on error */ }
}

// ── Edit ───────────────────────────────────────────────────────────────────────
async function editTestimonial(id) {
  try {
    const d    = await api("GET", `/api/admin/testimonials/${id}`);
    const t    = d.data;
    const form = document.getElementById("testi-form");

    document.getElementById("edit-testi-id").value            = t._id;
    document.getElementById("testi-modal-title").textContent  = "Edit Testimonial";
    document.getElementById("testi-save-btn").textContent     = "Update Testimonial";

    form.elements["studentName"].value  = t.studentName  || "";
    form.elements["studentRole"].value  = t.studentRole  || "";
    form.elements["content"].value      = t.content      || "";
    form.elements["rating"].value       = t.rating       ?? 5;
    form.elements["isFeatured"].checked = !!t.isFeatured;
    form.elements["isActive"].checked   = t.isActive !== false;

    await populateCourseSelect(t.courseRef || "");
    openModal("testi-modal");
  } catch (e) {
    toast("Failed to load testimonial: " + e.message, "err");
  }
}

// ── Save ───────────────────────────────────────────────────────────────────────
async function saveTestimonial() {
  const form   = document.getElementById("testi-form");
  const id     = document.getElementById("edit-testi-id").value;
  const isEdit = !!id;
  const url    = isEdit ? `/api/admin/testimonials/${id}` : "/api/admin/testimonials";
  const meth   = isEdit ? "PUT" : "POST";

  const fileInput = form.elements["avatar"];
  const hasFile   = fileInput?.files?.length > 0;

  let body, isForm = false;

  if (hasFile) {
    body   = new FormData(form);
    isForm = true;
  } else {
    const courseRef = form.elements["courseRef"]?.value || null;
    body = {
      studentName:  form.elements["studentName"].value.trim(),
      studentRole:  form.elements["studentRole"].value.trim(),
      content:      form.elements["content"].value.trim(),
      rating:       parseInt(form.elements["rating"].value, 10) || 5,
      isFeatured:   form.elements["isFeatured"].checked,
      isActive:     form.elements["isActive"].checked,
      courseRef:    courseRef || null,
    };
  }

  const btn     = document.getElementById("testi-save-btn");
  btn.disabled  = true;
  btn.innerHTML = '<span class="spin-sm"></span> Saving…';

  try {
    await api(meth, url, body, isForm);
    toast(isEdit ? "Testimonial updated ✓" : "Testimonial created ✓", "ok");
    closeModal("testi-modal");
    resetTestiForm();
    loadTestimonials();
  } catch (e) {
    toast("Save failed: " + e.message, "err");
  } finally {
    btn.disabled    = false;
    btn.textContent = isEdit ? "Update Testimonial" : "Save Testimonial";
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────
async function deleteTestimonial(id, name) {
  const ok = await confirm(`Delete testimonial by "${name}"?`,
    "This permanently removes the testimonial.", "Delete");
  if (!ok) return;
  try {
    await api("DELETE", `/api/admin/testimonials/${id}`);
    toast("Testimonial deleted", "ok");
    loadTestimonials();
  } catch (e) {
    toast("Delete failed: " + e.message, "err");
  }
}

// ── Toggle featured ────────────────────────────────────────────────────────────
async function toggleFeatured(id, currentFeatured) {
  try {
    await api("PUT", `/api/admin/testimonials/${id}`, { isFeatured: !currentFeatured });
    toast(!currentFeatured ? "Marked as featured ★" : "Removed from featured", "ok");
    loadTestimonials();
  } catch (e) {
    toast("Failed: " + e.message, "err");
  }
}

// ── Toggle active ──────────────────────────────────────────────────────────────
async function toggleTestimonial(id, activate) {
  try {
    await api("PUT", `/api/admin/testimonials/${id}`, { isActive: activate });
    toast(`Testimonial ${activate ? "activated" : "deactivated"}`, "ok");
    loadTestimonials();
  } catch (e) {
    toast("Failed: " + e.message, "err");
  }
}

// ── Reset ──────────────────────────────────────────────────────────────────────
function resetTestiForm() {
  document.getElementById("testi-form").reset();
  document.getElementById("edit-testi-id").value = "";
}

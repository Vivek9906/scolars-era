// scolars-era/frontend/assets/js/admin-courses.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.require()) return;
  loadCourses();

  // Add button
  document.getElementById("btnAddCourse")?.addEventListener("click", () => {
    resetCourseForm();
    document.getElementById("course-modal-title").textContent = "Add Course";
    document.getElementById("course-save-btn").textContent    = "Save Course";
    openModal("course-modal");
  });

  // Save button
  document.getElementById("course-save-btn")?.addEventListener("click", saveCourse);

  // Table — event delegation (one listener for all row buttons)
  document.getElementById("courses-tbody")?.addEventListener("click", async e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id, title } = btn.dataset;
    if (action === "edit")       await editCourse(id);
    if (action === "delete")     await deleteCourse(id, title);
    if (action === "activate")   await toggleCourse(id, true);
    if (action === "deactivate") await toggleCourse(id, false);
  });
});

// ── Load ───────────────────────────────────────────────────────────────────────
async function loadCourses() {
  skelRows("courses-tbody", 9);
  try {
    const d       = await api("GET", "/api/admin/courses");
    const courses = d.data || [];
    const cnt     = document.getElementById("course-count");
    if (cnt) cnt.textContent = courses.length;

    if (!courses.length) {
      emptyRow("courses-tbody", 9, "No courses yet. Click + Add Course to create one.");
      return;
    }

    document.getElementById("courses-tbody").innerHTML = courses.map(c => `
      <tr>
        <td class="cell-main">
          <strong>${escH(c.title)}</strong>
          <small>${escH(c.slug || "")}</small>
        </td>
        <td><span class="badge badge-blue">${escH(c.category)}</span></td>
        <td>${escH(c.level)}</td>
        <td>${c.durationWeeks}w</td>
        <td>${c.isFree
              ? '<span class="badge badge-green">Free</span>'
              : "₹" + Number(c.price).toLocaleString("en-IN")}</td>
        <td>${dlBadge(c.deadlineStatus)}</td>
        <td><span class="s-pill ${c.isActive ? "active" : "inactive"}">
          ${c.isActive ? "Active" : "Inactive"}
        </span></td>
        <td>${new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
        <td class="cell-actions">
          <button class="btn btn-sm btn-ghost"
                  data-action="edit" data-id="${c._id}">✏️ Edit</button>
          <button class="btn btn-sm ${c.isActive ? "btn-warn" : "btn-success"}"
                  data-action="${c.isActive ? "deactivate" : "activate"}"
                  data-id="${c._id}">
            ${c.isActive ? "Deactivate" : "Activate"}
          </button>
          <button class="btn btn-sm btn-danger"
                  data-action="delete"
                  data-id="${c._id}"
                  data-title="${escH(c.title)}">🗑️</button>
        </td>
      </tr>`).join("");
  } catch (e) {
    emptyRow("courses-tbody", 9, "⚠️ " + e.message);
    toast(e.message, "err");
  }
}

// ── Deadline badge ─────────────────────────────────────────────────────────────
function dlBadge(ds) {
  if (!ds) return '<span class="muted">—</span>';
  if (ds.type === "closed")    return '<span class="badge badge-gray">🔒 Closed</span>';
  if (ds.type === "countdown") return `<span class="badge badge-red">⏰ ${ds.daysLeft}d left</span>`;
  return `<span class="badge badge-orange">📅 ${escH(ds.label || "")}</span>`;
}

// ── Edit ───────────────────────────────────────────────────────────────────────
async function editCourse(id) {
  try {
    const d    = await api("GET", `/api/admin/courses/${id}`);
    const c    = d.data;
    const form = document.getElementById("course-form");

    document.getElementById("edit-course-id").value             = c._id;
    document.getElementById("course-modal-title").textContent   = "Edit Course";
    document.getElementById("course-save-btn").textContent      = "Update Course";

    form.elements["title"].value            = c.title            || "";
    form.elements["shortDescription"].value = c.shortDescription || "";
    form.elements["description"].value      = c.description      || "";
    form.elements["category"].value         = c.category         || "";
    form.elements["level"].value            = c.level            || "";
    form.elements["durationWeeks"].value    = c.durationWeeks    || "";
    form.elements["price"].value            = c.price            ?? 0;
    form.elements["features"].value         = (c.features || []).join("\n");
    form.elements["isActive"].checked       = c.isActive !== false;
    form.elements["registrationDeadline"].value = c.registrationDeadline
      ? new Date(c.registrationDeadline).toISOString().split("T")[0] : "";
    form.elements["deadlineLabel"].value    = c.deadlineLabel    || "";

    openModal("course-modal");
  } catch (e) {
    toast("Failed to load course: " + e.message, "err");
  }
}

// ── Save (create or update) ────────────────────────────────────────────────────
async function saveCourse() {
  const form   = document.getElementById("course-form");
  const id     = document.getElementById("edit-course-id").value;
  const isEdit = !!id;
  const url    = isEdit ? `/api/admin/courses/${id}` : "/api/admin/courses";
  const meth   = isEdit ? "PUT" : "POST";

  const fileInput = form.elements["thumbnail"];
  const hasFile   = fileInput?.files?.length > 0;

  let body, isForm = false;

  if (hasFile) {
    body   = new FormData(form);
    isForm = true;
  } else {
    body = {
      title:                form.elements["title"].value.trim(),
      shortDescription:     form.elements["shortDescription"].value.trim(),
      description:          form.elements["description"].value.trim(),
      category:             form.elements["category"].value,
      level:                form.elements["level"].value,
      durationWeeks:        parseInt(form.elements["durationWeeks"].value, 10),
      price:                parseFloat(form.elements["price"].value) || 0,
      features:             form.elements["features"].value
                              .split("\n").map(s => s.trim()).filter(Boolean),
      isActive:             form.elements["isActive"].checked,
      registrationDeadline: form.elements["registrationDeadline"].value || null,
      deadlineLabel:        form.elements["deadlineLabel"].value.trim() || null,
    };
  }

  const btn      = document.getElementById("course-save-btn");
  btn.disabled   = true;
  btn.innerHTML  = '<span class="spin-sm"></span> Saving…';

  try {
    await api(meth, url, body, isForm);
    toast(isEdit ? "Course updated ✓" : "Course created ✓", "ok");
    closeModal("course-modal");
    resetCourseForm();
    loadCourses();
  } catch (e) {
    toast("Save failed: " + e.message, "err");
  } finally {
    btn.disabled  = false;
    btn.textContent = isEdit ? "Update Course" : "Save Course";
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────
async function deleteCourse(id, title) {
  const ok = await confirm(`Delete "${title}"?`, "This permanently removes the course.", "Delete");
  if (!ok) return;
  try {
    await api("DELETE", `/api/admin/courses/${id}`);
    toast("Course deleted", "ok");
    loadCourses();
  } catch (e) {
    toast("Delete failed: " + e.message, "err");
  }
}

// ── Toggle active ──────────────────────────────────────────────────────────────
async function toggleCourse(id, activate) {
  try {
    await api("PUT", `/api/admin/courses/${id}`, { isActive: activate });
    toast(`Course ${activate ? "activated" : "deactivated"}`, "ok");
    loadCourses();
  } catch (e) {
    toast("Failed: " + e.message, "err");
  }
}

// ── Reset form ─────────────────────────────────────────────────────────────────
function resetCourseForm() {
  document.getElementById("course-form").reset();
  document.getElementById("edit-course-id").value = "";
}

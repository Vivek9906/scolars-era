// frontend/assets/js/admin.js
"use strict";
const API_BASE = "http://localhost:5000";
function getToken() {
  return localStorage.getItem("se_token") || sessionStorage.getItem("se_token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── Auth Guard ────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (!getToken()) {
    window.location.href = "/admin/index.html";
    return;
  }
  initAdminPanel();
});

// ── API Helper ────────────────────────────────────────────────────────────────
async function apiRequest(method, url, body = null) {
  const options = {
    method,
    headers: authHeaders(),
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API_BASE + url, options);

  if (res.status === 401) {
    localStorage.removeItem("se_token");
    window.location.href = "/admin/index.html";
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// ── UI Helpers ────────────────────────────────────────────────────────────────
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `admin-toast toast-${type} toast-show`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function openModal(type) {
  
  const modal = document.getElementById(`${type}-modal`);
  const overlay = document.querySelector(".modal-overlay");
  if (modal && overlay) {
    modal.style.display = "block";
    overlay.style.display = "block";
  } else {
    console.error("Modal or overlay not found:", type);
  }
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(m => {
    m.style.display = "none";
    if (m.classList.contains("temp-modal")) m.remove();
  });
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.style.display = "none";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// ── Initialization ───────────────────────────────────────────────────────────
function initAdminPanel() {
  

  // Sidebar navigation
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active"));
      
      const target = e.currentTarget.dataset.target;
      e.currentTarget.classList.add("active");
      document.getElementById(`sec-${target}`).classList.add("active");
      
      if(target === "courses") loadCourses();
      if(target === "universities") loadUniversities();
      if(target === "testimonials") loadTestimonials();
      if(target === "contacts") loadContacts();
      if(target === "dashboard") loadDashboardStats();
    });
  });

  // Global Click listener for all actions
  document.addEventListener("click", async (e) => {
    const target = e.target;
    
    // Add Buttons
    if (target.closest(".add-course-btn")) { resetForm("course"); openModal("course"); }
    if (target.closest(".add-university-btn")) { resetForm("university"); openModal("university"); }
    if (target.closest(".add-testimonial-btn")) { resetForm("testimonial"); openModal("testimonial"); }

    // Edit/Action Buttons
    const editBtn = target.closest(".edit-btn");
    if (editBtn) handleEdit(editBtn);

    const deleteBtn = target.closest(".delete-btn");
    if (deleteBtn) handleDeleteConfirm(deleteBtn);

    const activateBtn = target.closest(".activate-btn");
    if (activateBtn) handleToggleActive(activateBtn, true);

    const deactivateBtn = target.closest(".deactivate-btn");
    if (deactivateBtn) handleToggleActive(deactivateBtn, false);

    const resolveBtn = target.closest(".resolve-btn");
    if (resolveBtn) handleContactStatus(resolveBtn);

    const contactRow = target.closest(".contact-row");
    if (contactRow && !target.closest(".actions") && !target.closest(".stop-propagation")) {
      handleViewContact(contactRow);
    }

    // Modal close
    if (target.closest(".cancel-btn") || target.closest(".close-btn")) closeModal();
    if (target.classList.contains("modal-overlay")) closeModal();

    // Confirm Delete
    if (target.closest(".confirm-yes") && pendingDelete) {
      const item = pendingDelete;
      pendingDelete = null;
      closeModal();
      startDelayedDelete(item);
    }
    if (target.closest(".confirm-no")) {
      pendingDelete = null;
      closeModal();
    }
  });

  // Form Submits
  document.getElementById("course-form")?.addEventListener("submit", (e) => handleSubmit(e, "course"));
  document.getElementById("uni-form")?.addEventListener("submit", (e) => handleSubmit(e, "university"));
  document.getElementById("test-form")?.addEventListener("submit", (e) => handleSubmit(e, "testimonial"));

  // Initial load
  loadDashboardStats();
}

// ── CRUD Logic ───────────────────────────────────────────────────────────────

async function loadDashboardStats() {
  try {
    const [c, u, p] = await Promise.all([
      apiRequest("GET", "/api/admin/courses"),
      apiRequest("GET", "/api/admin/universities"),
      apiRequest("GET", "/api/admin/contacts?status=pending&limit=5")
    ]);
    document.getElementById("stat-courses").textContent = c.data.length;
    document.getElementById("stat-universities").textContent = u.data.length;
    document.getElementById("stat-contacts").textContent = p.meta.total;
  } catch(err) { console.error("Stats err:", err); }
}

async function loadCourses() {
  try {
    const res = await apiRequest("GET", "/api/admin/courses");
    renderTable("courses-table-body", res.data, "course");
  } catch(err) { showToast(err.message, "error"); }
}

async function loadUniversities() {
  try {
    const res = await apiRequest("GET", "/api/admin/universities");
    renderTable("uni-table-body", res.data, "university");
  } catch(err) { showToast(err.message, "error"); }
}

async function loadTestimonials() {
  try {
    const res = await apiRequest("GET", "/api/admin/testimonials");
    renderTable("test-table-body", res.data, "testimonial");
  } catch(err) { showToast(err.message, "error"); }
}

function renderTable(tbodyId, data, type) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  if (!data.length) { tbody.innerHTML = "<tr><td colspan='10'>No data found.</td></tr>"; return; }

  tbody.innerHTML = data.map(item => {
    let name = item.title || item.name || item.studentName;
    let isActive = item.isActive;
    return `
      <tr data-id="${item._id}">
        ${renderCells(item, type)}
        <td>
          <button class="btn-icon edit-btn" data-id="${item._id}" data-type="${type}"><i class="fas fa-edit"></i></button>
          ${isActive 
            ? `<button class="btn-icon deactivate-btn" data-id="${item._id}" data-type="${type}"><i class="fas fa-eye-slash"></i></button>`
            : `<button class="btn-icon activate-btn" data-id="${item._id}" data-type="${type}"><i class="fas fa-eye"></i></button>`}
          <button class="btn-icon delete-btn" data-id="${item._id}" data-type="${type}" data-name="${escapeHtml(name)}" style="color:#e53e3e"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderCells(item, type) {
  if (type === "course") {
    return `
      <td><img src="${item.thumbnail}" class="admin-thumb"></td>
      <td><strong>${escapeHtml(item.title)}</strong></td>
      <td>${item.category}</td>
      <td>${item.level}</td>
      <td>${item.price > 0 ? "£"+item.price : "FREE"}</td>
      <td><span class="status-pill ${item.isActive?'active':'inactive'}">${item.isActive?'Active':'Inactive'}</span></td>
      <td>-</td>
    `;
  }
  if (type === "university") {
    return `
      <td><img src="${item.logo || '/assets/images/clg.jpeg'}" class="admin-thumb"></td>
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td>${escapeHtml(item.country)}</td>
      <td>${item.partnershipType}</td>
      <td><span class="status-pill ${item.isActive?'active':'inactive'}">${item.isActive?'Active':'Inactive'}</span></td>
    `;
  }
  if (type === "testimonial") {
    return `
      <td><img src="${item.studentAvatar || '/assets/images/user.png'}" class="admin-avatar"></td>
      <td><strong>${escapeHtml(item.studentName)}</strong></td>
      <td>${escapeHtml(item.content.substring(0, 50))}...</td>
      <td>${item.rating}</td>
      <td>${item.isFeatured ? "Yes" : "No"}</td>
    `;
  }
}

async function handleEdit(btn) {
  const id = btn.dataset.id;
  const type = btn.dataset.type;
  // Map type to correct pluralized endpoint
  const pluralMap = { course: "courses", university: "universities", testimonial: "testimonials" };
  const plural = pluralMap[type] || (type + "s");
  try {
    const res = await apiRequest("GET", `/api/admin/${plural}/${id}`);
    fillForm(res.data, type);
    openModal(type);
  } catch(err) { showToast("Failed to load details", "error"); }
}

function fillForm(data, type) {
  if (type === "course") {
    const f = document.getElementById("course-form");
    f.dataset.editId = data._id;
    f.title.value = data.title;
    f.shortDescription.value = data.shortDescription || "";
    f.description.value = data.description;
    f.category.value = data.category;
    f.level.value = data.level;
    f.durationWeeks.value = data.durationWeeks;
    f.price.value = data.price;
    f.features.value = (data.features || []).join("\n");
    f.isActive.checked = data.isActive;
    document.getElementById("course-form-title").textContent = "Edit Course";
  }
  if (type === "university") {
    const f = document.getElementById("uni-form");
    f.dataset.editId = data._id;
    f.name.value = data.name; f.country.value = data.country; f.location.value = data.location || "";
    f.partnershipType.value = data.partnershipType; f.websiteUrl.value = data.websiteUrl || "";
    f.logo.value = data.logo || ""; f.description.value = data.description || "";
    f.isActive.checked = data.isActive;
    document.getElementById("uni-form-title").textContent = "Edit University";
  }
  if (type === "testimonial") {
    const f = document.getElementById("test-form");
    f.dataset.editId = data._id;
    f.studentName.value = data.studentName; f.studentRole.value = data.studentRole || "";
    f.content.value = data.content; f.rating.value = data.rating;
    f.studentAvatar.value = data.studentAvatar || "";
    f.isFeatured.checked = data.isFeatured; f.isActive.checked = data.isActive;
    document.getElementById("test-form-title").textContent = "Edit Testimonial";
  }
}

function resetForm(type) {
  const f = document.getElementById(type === "course" ? "course-form" : (type === "university" ? "uni-form" : "test-form"));
  if (!f) return;
  f.reset();
  delete f.dataset.editId;
  const titleId = type === "course" ? "course-form-title" : (type === "university" ? "uni-form-title" : "test-form-title");
  const title = document.getElementById(titleId);
  if (title) title.textContent = "Add New " + type.charAt(0).toUpperCase() + type.slice(1);
}

async function handleSubmit(e, type) {
  e.preventDefault();
  const form = e.target;
  const id = form.dataset.editId;
  const method = id ? "PUT" : "POST";
  const url = id ? `/api/admin/${type}s/${id}` : `/api/admin/${type}s`;
  
  const formData = new FormData(form);
  const body = Object.fromEntries(formData.entries());
  
  // Clean up types
  if (body.price) body.price = parseFloat(body.price);
  if (body.durationWeeks) body.durationWeeks = parseInt(body.durationWeeks);
  if (body.rating) body.rating = parseFloat(body.rating);
  body.isActive = form.isActive.checked;
  if (type === "testimonial") body.isFeatured = form.isFeatured.checked;
  if (body.features) body.features = body.features.split("\n").map(f => f.trim()).filter(Boolean);

  try {
    await apiRequest(method, url, body);
    showToast(`${type} saved successfully`);
    closeModal();
    if (type === "course") loadCourses();
    if (type === "university") loadUniversities();
    if (type === "testimonial") loadTestimonials();
  } catch(err) { showToast(err.message, "error"); }
}

// ── Delete & Undo ────────────────────────────────────────────────────────────
let pendingDelete = null;

function handleDeleteConfirm(btn) {
  pendingDelete = { id: btn.dataset.id, type: btn.dataset.type, name: btn.dataset.name };
  document.getElementById("confirm-text").textContent = `Are you sure you want to delete "${pendingDelete.name}"?`;
  openModal("confirm");
}

function startDelayedDelete(item) {
  const row = document.querySelector(`tr[data-id="${item.id}"]`);
  if (row) row.style.opacity = "0.3";
  
  const toast = document.createElement("div");
  toast.className = "undo-toast";
  toast.innerHTML = `<span>Deleted ${item.name}</span> <button class="undo-btn">Undo</button>`;
  document.body.appendChild(toast);

  let timeout = setTimeout(async () => {
    toast.remove();
    try {
      await apiRequest("DELETE", `/api/admin/${item.type}s/${item.id}`);
      if (item.type === "course") loadCourses();
      if (item.type === "university") loadUniversities();
      if (item.type === "testimonial") loadTestimonials();
    } catch(err) { showToast(err.message, "error"); if (row) row.style.opacity = "1"; }
  }, 10000);

  toast.querySelector(".undo-btn").addEventListener("click", () => {
    clearTimeout(timeout);
    toast.remove();
    if (row) row.style.opacity = "1";
    showToast("Delete cancelled", "info");
  });
}

async function handleToggleActive(btn, newState) {
  const id = btn.dataset.id;
  const type = btn.dataset.type;
  try {
    await apiRequest("PUT", `/api/admin/${type}s/${id}`, { isActive: newState });
    showToast(newState ? "Activated" : "Deactivated");
    if (type === "course") loadCourses();
    if (type === "university") loadUniversities();
    if (type === "testimonial") loadTestimonials();
  } catch(err) { showToast(err.message, "error"); }
}

// ── Contacts ──────────────────────────────────────────────────────────────────
let contactListCache = [];

async function loadContacts() {
  try {
    const status = document.querySelector(".tab-btn.active").dataset.status;
    const res = await apiRequest("GET", `/api/admin/contacts?status=${status}&limit=50`);
    contactListCache = res.data;
    
    // Update counts
    const [pRes, rRes] = await Promise.all([
      apiRequest("GET", "/api/admin/contacts?status=pending&limit=1"),
      apiRequest("GET", "/api/admin/contacts?status=resolved&limit=1")
    ]);
    document.getElementById("count-pending").textContent = pRes.meta.total;
    document.getElementById("count-resolved").textContent = rRes.meta.total;

    const tbody = document.getElementById("contacts-table-body");
    tbody.innerHTML = contactListCache.map(c => `
      <tr class="contact-row" data-id="${c._id}" style="cursor:pointer">
        <td>${new Date(c.createdAt).toLocaleDateString()}</td>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.subject)}</td>
        <td class="actions"><button class="btn btn-primary resolve-btn" data-id="${c._id}" data-next="${status==='pending'?'resolved':'pending'}">${status==='pending'?'Resolve':'Reopen'}</button></td>
      </tr>
    `).join("");
  } catch(err) { console.error(err); }
}

async function handleContactStatus(btn) {
  const id = btn.dataset.id;
  const status = btn.dataset.next;
  try {
    await apiRequest("PATCH", `/api/admin/contacts/${id}/status`, { status });
    showToast("Contact updated");
    loadContacts();
  } catch(err) { showToast(err.message, "error"); }
}

function handleViewContact(row) {
  const id = row.dataset.id;
  const c = contactListCache.find(x => x._id === id);
  if (!c) return;

  const html = `
    <div class="detail-row"><div class="detail-label">Name</div><div class="detail-value">${escapeHtml(c.name)}</div></div>
    <div class="detail-row"><div class="detail-label">Email</div><div class="detail-value"><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></div></div>
    <div class="detail-row"><div class="detail-label">Subject</div><div class="detail-value">${escapeHtml(c.subject)}</div></div>
    <div style="margin-top:1rem">
      <div class="detail-label">Message</div>
      <div class="message-content" style="background:#f7f8fc;padding:1rem;border-radius:8px;margin-top:0.5rem;white-space:pre-wrap;">${escapeHtml(c.message)}</div>
    </div>
  `;
  showDetailModal("Message Details", html);
}

function showDetailModal(title, detailsHtml) {
  const overlay = document.querySelector(".modal-overlay");
  const modal = document.createElement("div");
  modal.className = "modal active temp-modal";
  modal.style.display = "block";
  modal.innerHTML = `
    <h3 style="margin-bottom:1.5rem;border-bottom:1px solid #eee;padding-bottom:0.5rem">${title}</h3>
    ${detailsHtml}
    <div style="margin-top:1.5rem;text-align:right;">
      <button class="btn btn-cancel close-btn">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  if (overlay) overlay.style.display = "block";
}

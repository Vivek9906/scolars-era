// scolars-era/frontend/assets/js/contact.js
"use strict";

// ── Course data for cascading dropdown ──────────────────────────────────────
const PROGRAM_COURSES = {
  "Bachelor's": [
    "Education (B.Ed)", "Science (B.Sc)", "Business Administration (BBA)",
    "Counseling Psychology", "Media & Communication", "Public Administration",
    "Fine Arts (BFA)", "Human Arts (BA)", "Music", "Social Work (BSW)",
    "Theology", "Other Areas"
  ],
  "Master's": [
    "Education (M.Ed)", "Science (M.Sc)", "Business Administration (MBA)",
    "Counseling Psychology", "Media & Communication", "Public Administration (MPA)",
    "Fine Arts (MFA)", "Human Arts (MA)", "Music", "Social Work (MSW)",
    "Theology", "Technology (M.Tech)", "Other Areas"
  ],
  "Doctoral/PhD": [
    "Education (Ph.D)", "Science (Ph.D)", "Business Administration (DBA)",
    "Counseling Psychology (Ph.D)", "Media & Communication (Ph.D)",
    "Public Administration (Ph.D)", "Fine Arts (Ph.D)", "Human Arts (Ph.D)",
    "Music (Ph.D)", "Social Work (Ph.D)", "Theology (Ph.D)", "Other Areas"
  ],
  "Honorary Awards": [
    "Honorary Doctorate (D.Litt)", "Honorary Doctorate (D.Sc)",
    "Professional Recognition Award", "Lifetime Achievement Award"
  ]
};

function initCascadingDropdown(programSelectId, courseSelectId) {
  const programSelect = document.getElementById(programSelectId);
  const courseSelect = document.getElementById(courseSelectId);
  if (!programSelect || !courseSelect) return;

  programSelect.addEventListener("change", function () {
    const program = this.value;
    const courses = PROGRAM_COURSES[program] || [];
    courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      courseSelect.appendChild(opt);
    });
    const optOther = document.createElement("option");
    optOther.value = "Not sure yet";
    optOther.textContent = "Not sure yet";
    courseSelect.appendChild(optOther);
    courseSelect.disabled = false;
  });
}

function showStatus(form, type, message) {
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("div");
    status.className = "form-status";
    form.appendChild(status);
  }
  status.style.cssText = `padding:14px 18px;border-radius:10px;font-size:14px;margin-top:16px;font-weight:500;${
    type === "success"
      ? "background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7"
      : "background:#FFEBEE;color:#C62828;border:1px solid #EF9A9A"
  }`;
  status.textContent = message;
  
  // Reset animation
  status.style.animation = 'none';
  status.offsetHeight; /* trigger reflow */
  status.style.animation = null;

  status.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showFieldErrors(form, errors) {
  form.querySelectorAll(".field-error").forEach((el) => el.remove());
  Object.entries(errors).forEach(([field, msg]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input) return;
    const errEl = document.createElement("span");
    errEl.className = "field-error";
    errEl.style.cssText = "display:block;color:#C62828;font-size:12px;margin-top:4px";
    errEl.textContent = msg;
    input.after(errEl);
    input.style.borderColor = "#C62828";
    input.addEventListener("input", () => { errEl.remove(); input.style.borderColor = ""; }, { once: true });
  });
}

function initCharCounter(form) {
  const textarea = form.querySelector('textarea[name="message"]');
  if (!textarea) return;
  
  const counter = document.createElement('span');
  counter.className = 'char-counter normal';
  counter.textContent = `${textarea.value.length} / 2000 characters`;
  textarea.after(counter);

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / 2000 characters`;
    if (len > 1950) {
      counter.className = 'char-counter danger';
    } else if (len > 1800) {
      counter.className = 'char-counter warn';
    } else {
      counter.className = 'char-counter normal';
    }
  });
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn ? btn.innerHTML : "";

  // Clear old errors
  form.querySelectorAll(".field-error").forEach((el) => el.remove());
  const statusEl = form.querySelector(".form-status");
  if (statusEl) statusEl.remove();

  // Build subject from program + course + qualification
  const qual = form.querySelector('[name="qualification"]')?.value || "";
  const prog = form.querySelector('[name="program"]')?.value || "";
  const course = form.querySelector('[name="course"]')?.value || "";
  let subj = [prog, course, qual].filter(Boolean).join(" — ");
  if (!subj) subj = "General Inquiry";

  const body = {
    name: form.querySelector('[name="name"]')?.value.trim() || "",
    email: form.querySelector('[name="email"]')?.value.trim() || "",
    phone: form.querySelector('[name="phone"]')?.value.trim() || "",
    subject: subj,
    message: form.querySelector('[name="message"]')?.value.trim() || "",
  };

  if (btn) {
    btn.disabled = true;
    btn.classList.add("btn-loading");
  }

  try {
    await window.ScolarAPI.submitContact(body);
    showStatus(form, "success", "✅ Thank you! We'll respond within 24 hours.");
    form.reset();
    // Reset course dropdown
    const courseSelect = form.querySelector('[name="course"]');
    if (courseSelect) {
      courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
      courseSelect.disabled = true;
    }
    const textarea = form.querySelector('textarea[name="message"]');
    if (textarea) textarea.dispatchEvent(new Event('input')); // Reset counter
  } catch (err) {
    if (err.errors) {
      showFieldErrors(form, err.errors);
      showStatus(form, "error", "Please fix the errors above and try again.");
    } else {
      showStatus(form, "error", err.message || "Something went wrong. Please try again.");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("btn-loading");
      btn.innerHTML = originalText;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Init cascading dropdowns
  initCascadingDropdown("homeProgramSelect", "homeCourseSelect");
  initCascadingDropdown("popupProgramSelect", "popupCourseSelect");

  document.querySelectorAll(".contact-form, .apply-form").forEach((form) => {
    initCharCounter(form);
    if (form) form.addEventListener("submit", handleContactSubmit);
  });
});

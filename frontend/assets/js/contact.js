// scolars-era/frontend/assets/js/contact.js
"use strict";

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

  const qual = form.querySelector('[name="qualification"]')?.value || "";
  let subj = form.querySelector('[name="subject"]')?.value.trim() || "";
  if (qual && qual !== "") {
    subj = qual + (subj ? " " + subj : "");
  }

  const body = {
    name: form.querySelector('[name="name"]')?.value.trim() || "",
    email: form.querySelector('[name="email"]')?.value.trim() || "",
    phone: form.querySelector('[name="phone"]')?.value.trim() || "",
    subject: subj || "No Subject provided",
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
  document.querySelectorAll(".contact-form, .apply-form").forEach((form) => {
    initCharCounter(form);
    if (form) form.addEventListener("submit", handleContactSubmit);
  });
});

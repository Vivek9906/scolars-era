// frontend/assets/js/appointment.js
"use strict";

// ── Course data for cascading dropdown (shared with contact.js) ─────────────
const APPOINTMENT_COURSES = {
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointmentForm");
  const successCard = document.getElementById("successCard");
  const programSelect = document.getElementById("appointmentProgramSelect");
  const courseSelect = document.getElementById("appointmentCourseSelect");
  const dateInput = document.getElementById("prefDate");
  const errorDiv = document.getElementById("formError");

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  // Cascading dropdown
  if (programSelect && courseSelect) {
    programSelect.addEventListener("change", function () {
      const program = this.value;
      const courses = APPOINTMENT_COURSES[program] || [];
      courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
      courses.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        courseSelect.appendChild(opt);
      });
      const optNotSure = document.createElement("option");
      optNotSure.value = "Not sure yet";
      optNotSure.textContent = "Not sure yet";
      courseSelect.appendChild(optNotSure);
      courseSelect.disabled = false;
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.style.display = "none";
    const btn = document.getElementById("submitBtn");
    const originalBtnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    const formData = new FormData(form);
    
    // Construct message string from preferences
    const message = `Programme: ${formData.get("program") || "N/A"}
Course Interest: ${formData.get("course") || "N/A"}
Qualification: ${formData.get("qualification")}
Looking For: ${formData.get("lookingFor")}
Preferred Date: ${formData.get("prefDate")}
Time Slot: ${formData.get("prefTime")}
Contact Method: ${formData.get("contactMethod")}
Additional: ${formData.get("additional") || "None"}`;

    const payload = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      subject: "Counseling Appointment Request",
      message: message
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to submit request.");

      // Success
      form.style.display = "none";
      successCard.classList.add("active");
      document.getElementById("succMethod").textContent = formData.get("contactMethod");
      document.getElementById("succDate").textContent = formData.get("prefDate");
      document.getElementById("succSlot").textContent = formData.get("prefTime");
      document.getElementById("succEmail").textContent = formData.get("email");

    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  });

  const btnBookAnother = document.getElementById("btnBookAnother");
  if (btnBookAnother) {
    btnBookAnother.addEventListener("click", () => {
      form.reset();
      
      const today = new Date().toISOString().split('T')[0];
      document.getElementById("prefDate").value = today;
      
      // Reset course dropdown
      if (courseSelect) {
        courseSelect.innerHTML = '<option value="" disabled selected>Select Programme first</option>';
        courseSelect.disabled = true;
      }
      
      successCard.classList.remove("active");
      form.style.display = "block";
    });
  }
});

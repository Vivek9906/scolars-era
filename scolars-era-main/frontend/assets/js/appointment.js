// frontend/assets/js/appointment.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointmentForm");
  const successCard = document.getElementById("successCard");
  const courseSelect = document.getElementById("courseSelect");
  const dateInput = document.getElementById("prefDate");
  const errorDiv = document.getElementById("formError");

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  dateInput.value = today;

  // Load courses
  fetch("/api/courses")
    .then(res => res.json())
    .then(data => {
      courseSelect.innerHTML = '<option value="" disabled selected>Select a course</option>';
      if (data.data && data.data.length) {
        data.data.forEach(c => {
          const opt = document.createElement("option");
          opt.value = c.title;
          opt.textContent = c.title;
          courseSelect.appendChild(opt);
        });
      }
      const optNotSure = document.createElement("option");
      optNotSure.value = "Not sure yet";
      optNotSure.textContent = "Not sure yet";
      courseSelect.appendChild(optNotSure);
    })
    .catch(() => {
      courseSelect.innerHTML = '<option value="Not sure yet">Not sure yet (Failed to load courses)</option>';
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.style.display = "none";
    const btn = document.getElementById("submitBtn");
    const originalBtnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    const formData = new FormData(form);
    
    // Construct message string from preferences
    const message = `Course Interest: ${formData.get("course")}
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
      
      successCard.classList.remove("active");
      form.style.display = "block";
    });
  }
});


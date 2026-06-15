// scolars-era/frontend/assets/js/api.js
"use strict";

const API_BASE = "/api";

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.message || "Request failed");
      if (data.errors) error.errors = data.errors;
      throw error;
    }
    return data;
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err.message);
    throw err;
  }
}

window.ScolarAPI = {
  getCourses: (params = "") => apiFetch(`/courses${params}`),
  getCourse: (slug) => apiFetch(`/courses/${slug}`),
  getUniversities: () => apiFetch("/universities"),
  getTestimonials: (featured = false) =>
    apiFetch(`/testimonials${featured ? "?featured=true" : ""}`),
  submitContact: (body) =>
    apiFetch("/contact", { method: "POST", body: JSON.stringify(body) }),
};

// scolars-era/frontend/assets/js/university-detail.js
"use strict";

function renderError() {
  const root = document.getElementById("uniRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="container">
      <div class="error-page">
        <div class="error-icon"><i class="fas fa-university"></i></div>
        <h2>University Not Found</h2>
        <p>We couldn't find details for this university.<br>
           Please go back and select a valid university card.</p>
        <a href="/university.html" class="btn btn-primary" style="display:inline-flex;align-items:center;padding:10px 20px;border-radius:5px;background:var(--primary-color);color:#fff;text-decoration:none;">
          <i class="fas fa-arrow-left"></i> &nbsp;Back to Universities
        </a>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', '"')
    .replaceAll("'", "&#039;");
}

function renderUniversity(u) {
  const root = document.getElementById("uniRoot");
  if (!root) return;

  document.title = `${u.name} — SCOLARS LIFT`;

  const fallback = {
    ranking: {
      "World Rank": "Top 100",
      "National Rank": "Top 10",
      "Research Quality": "A+",
      "Student Satisfaction": "92%",
    },
    courses: [
      { name: "Computer Science", duration: "4 Years", mode: "Full Time" },
      { name: "Business Administration", duration: "3 Years", mode: "Full Time" },
      { name: "Data Science", duration: "2 Years", mode: "Part Time" },
    ],
    fees: {
      undergraduate: "$20,000 / yr",
      postgraduate: "$25,000 / yr",
      phd: "$18,000 / yr",
      living: "$12,000 / yr",
      scholarships: "Available for meritorious students.",
    },
    admission: [
      {
        step: 1,
        title: "Application Submission",
        desc: "Submit your application form online with required documents.",
      },
      {
        step: 2,
        title: "Entrance Exam / Interview",
        desc: "Clear the university entrance exam or interview process.",
      },
      {
        step: 3,
        title: "Offer Letter",
        desc: "Receive your conditional or unconditional offer letter.",
      },
      {
        step: 4,
        title: "Enrollment",
        desc: "Pay the admission fee and complete your enrollment.",
      },
    ],
    facilities: [
      {
        icon: "fas fa-book",
        name: "Modern Library",
        desc: "24/7 access to physical and digital resources.",
      },
      {
        icon: "fas fa-laptop-code",
        name: "Tech Labs",
        desc: "State-of-the-art computer and research labs.",
      },
      {
        icon: "fas fa-dumbbell",
        name: "Sports Complex",
        desc: "Indoor and outdoor sports facilities.",
      },
      {
        icon: "fas fa-home",
        name: "Student Housing",
        desc: "On-campus accommodation available.",
      },
    ],
    placement: {
      rate: "95%",
      avg_salary: "$75,000",
      top_recruiters: ["Google", "Microsoft", "Amazon", "Deloitte", "Goldman Sachs"],
      notable_alumni: ["John Doe (CEO at TechCorp)", "Jane Smith (Lead Scientist at BioGen)"],
    },
    contact: {
      phone: "+44 7501298113",
      email: "admissions@scolarsfix.com",
      website: u.websiteUrl || "https://www.scolarsfix.com",
      address: u.location || u.country || "Main Campus, University District",
    },
  };

  const rankRows = Object.entries(fallback.ranking)
    .map(
      ([k, v]) => `
    <div class="ranking-item">
      <div class="ranking-label">${escapeHtml(k.replace(/_/g, " ").toUpperCase())}</div>
      <div class="ranking-value">${escapeHtml(v)}</div>
    </div>`,
    )
    .join("");

  const courseRows = fallback.courses
    .map(
      (c) => `
    <tr>
      <td class="course-name">${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.duration)}</td>
      <td><span class="course-badge">${escapeHtml(c.mode)}</span></td>
    </tr>`,
    )
    .join("");

  const stepItems = fallback.admission
    .map(
      (s) => `
    <div class="step-item">
      <div class="step-num-wrap">
        <div class="step-num">${escapeHtml(s.step)}</div>
        <div class="step-line"></div>
      </div>
      <div class="step-content">
        <div class="step-title">${escapeHtml(s.title)}</div>
        <div class="step-desc">${escapeHtml(s.desc)}</div>
      </div>
    </div>`,
    )
    .join("");

  const facilityItems = fallback.facilities
    .map(
      (f) => `
    <div class="facility-item">
      <div class="facility-icon"><i class="${escapeHtml(f.icon)}"></i></div>
      <div>
        <div class="facility-name">${escapeHtml(f.name)}</div>
        <div class="facility-desc">${escapeHtml(f.desc)}</div>
      </div>
    </div>`,
    )
    .join("");

  const recruiterTags = fallback.placement.top_recruiters
    .map((r) => `<span class="recruiter-tag">${escapeHtml(r)}</span>`)
    .join("");

  const alumniItems = fallback.placement.notable_alumni
    .map((a) => `<div class="alumni-item">${escapeHtml(a)}</div>`)
    .join("");

  root.innerHTML = `
    <div class="container uni-main">
      <div class="left-col">
        <div class="uni-section" id="sec-about">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-info-circle"></i></div>
            <h2>About ${escapeHtml(u.name)}</h2>
          </div>
          <div class="section-body">
            <p class="about-text">${escapeHtml(
              u.description ||
                "Information about this university is currently being updated. Please contact our counsellors for more details.",
            )}</p>
          </div>
        </div>

        <div class="uni-section" id="sec-ranking">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-trophy"></i></div>
            <h2>Rankings & Recognition</h2>
          </div>
          <div class="section-body">
            <div class="ranking-grid">${rankRows}</div>
          </div>
        </div>

        <div class="uni-section" id="sec-courses">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-book-open"></i></div>
            <h2>Programs & Courses</h2>
          </div>
          <div class="section-body" style="padding:0; overflow-x:auto;">
            <table class="courses-table">
              <thead>
                <tr>
                  <th>Program Name</th>
                  <th>Duration</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>${courseRows}</tbody>
            </table>
          </div>
        </div>

        <div class="uni-section" id="sec-fees">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-wallet"></i></div>
            <h2>Fees Structure</h2>
          </div>
          <div class="section-body">
            <div class="fees-grid">
              <div class="fee-item">
                <div class="fee-label">Undergraduate Tuition</div>
                <div class="fee-value">${escapeHtml(fallback.fees.undergraduate)}</div>
              </div>
              <div class="fee-item">
                <div class="fee-label">Postgraduate Tuition</div>
                <div class="fee-value">${escapeHtml(fallback.fees.postgraduate)}</div>
              </div>
              <div class="fee-item">
                <div class="fee-label">PhD / Research</div>
                <div class="fee-value">${escapeHtml(fallback.fees.phd)}</div>
              </div>
              <div class="fee-item">
                <div class="fee-label">Living Expenses (Est.)</div>
                <div class="fee-value">${escapeHtml(fallback.fees.living)}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="uni-section" id="sec-admission">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-file-alt"></i></div>
            <h2>Admission Process</h2>
          </div>
          <div class="section-body">
            <div class="admission-steps">${stepItems}</div>
          </div>
        </div>

        <div class="uni-section" id="sec-facilities">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-building"></i></div>
            <h2>Facilities & Campus Life</h2>
          </div>
          <div class="section-body">
            <div class="facilities-grid">${facilityItems}</div>
          </div>
        </div>

        <div class="uni-section" id="sec-placement">
          <div class="section-head">
            <div class="section-head-icon"><i class="fas fa-briefcase"></i></div>
            <h2>Placement & Career Info</h2>
          </div>
          <div class="section-body">
            <div class="recruiters-list">${recruiterTags}</div>
            <div class="alumni-list">${alumniItems}</div>
          </div>
        </div>
      </div>

      <aside class="sidebar">
        <div class="sidebar-card">
          <div class="sidebar-head"><i class="fas fa-list-alt"></i> University at a Glance</div>
          <div class="sidebar-body">
            <div class="quick-info-list">
              <div class="quick-info-item">
                <span class="qi-label"><i class="fas fa-calendar-alt"></i> Established</span>
                <span class="qi-val">${escapeHtml(u.established || "2000")}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-card" id="sec-contact">
          <div class="sidebar-head"><i class="fas fa-address-book"></i> Contact Details</div>
          <div class="sidebar-body">
            <div class="contact-list">
              <a href="tel:${escapeHtml(fallback.contact.phone)}" class="contact-link">
                <div class="contact-link-icon"><i class="fas fa-phone"></i></div>
                <div>
                  <div class="cl-label">Phone</div>
                  <div class="cl-val">${escapeHtml(fallback.contact.phone)}</div>
                </div>
              </a>
              <a href="mailto:${escapeHtml(fallback.contact.email)}" class="contact-link">
                <div class="contact-link-icon"><i class="fas fa-envelope"></i></div>
                <div>
                  <div class="cl-label">Email</div>
                  <div class="cl-val">${escapeHtml(fallback.contact.email)}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="apply-cta">
          <h3>Ready to Apply?</h3>
          <p>Our expert counsellors at SCOLARS LIFT will guide you step-by-step to secure your admission at ${escapeHtml(
            u.name,
          )}.</p>
          <a href="/book-appointment.html" class="apply-btn">
            <i class="fas fa-paper-plane"></i> Apply Now
          </a>
        </div>
      </aside>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("pageLoader");
  const params = new URLSearchParams(window.location.search);
  // Accept either ?id=<mongoId> or ?slug=<slug>
  const id = params.get("id");
  const slug = params.get("slug");

  if (!id) {
    if (loader) loader.classList.add("fade-out");
    renderError();
    return;
  }

  try {
    // Prefer slug when provided
    if (slug) {
      const resSlug = await fetch(`/api/universities/slug/${encodeURIComponent(slug)}`);
      if (resSlug.ok) {
        const result = await resSlug.json();
        const uni = result?.data;
        if (loader) loader.classList.add("fade-out");
        if (!uni) return renderError();
        renderUniversity(uni);
        return;
      }
      // fall through to try id if slug not found
    }

    if (!id) {
      if (loader) loader.classList.add("fade-out");
      return renderError();
    }

    const resSlug = await fetch(`/api/universities/slug/${encodeURIComponent(id)}`);
    if (resSlug.ok) {
      const result = await resSlug.json();
      const uni = result?.data;
      if (loader) loader.classList.add("fade-out");
      if (!uni) return renderError();
      renderUniversity(uni);
      return;
    }

    const resId = await fetch(`/api/universities/id/${encodeURIComponent(id)}`);

    if (!resId.ok) throw new Error("Not found");

    const result2 = await resId.json();
    const uni2 = result2?.data;
    if (loader) loader.classList.add("fade-out");
    if (!uni2) renderError();
    else renderUniversity(uni2);
  } catch (err) {
    console.error(err);
    if (loader) loader.classList.add("fade-out");
    renderError();
  }
});


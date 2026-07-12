document.addEventListener('DOMContentLoaded', async () => {
    async function loadComponent(id, url) {
        const el = document.getElementById(id);
        if (el) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    el.innerHTML = await response.text();
                }
            } catch (e) {
                console.error('Failed to load component', url, e);
            }
        }
    }

    await loadComponent('header-placeholder', '/components/header.html');
    await loadComponent('footer-placeholder', '/components/footer.html');

    // ── GLOBAL POPUP MODAL LOGIC ──────────────────────────────────────────────
    if (!sessionStorage.getItem('welcomePopupShown_v2')) {
        setTimeout(function() {
            const overlay = document.getElementById('contactPopupOverlay');
            if (!overlay) return;
            overlay.style.display = 'flex';
            sessionStorage.setItem('welcomePopupShown_v2', '1');

            function closeOverlay() { 
                overlay.style.opacity = '0'; 
                setTimeout(function(){ overlay.style.display = 'none'; overlay.style.opacity = ''; }, 350); 
            }

            document.getElementById('popupCloseBtn').addEventListener('click', closeOverlay);
            overlay.addEventListener('click', function(e) { if (e.target === overlay) closeOverlay(); });
            document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.style.display !== 'none') closeOverlay(); });
            document.getElementById('popupSuccessClose').addEventListener('click', closeOverlay);

            // Populate Course dropdown based on Program
            const PROGRAM_COURSES = {
                "Bachelor's": ["Business Administration","Public Administration","Education","Media Communication","Counseling Psychology","Human Arts","Fine Arts","Social Work","Music","Theology","Science","Programs in Other Areas"],
                "Master's":   ["Business Administration","Public Administration","Education","Media Communication","Counseling Psychology","Human Arts","Fine Arts","Social Work","Music","Theology","Science","Programs in Other Areas"],
                "Doctoral/PhD": ["Business Administration","Public Administration","Education","Media Communication","Counseling Psychology","Human Arts","Fine Arts","Social Work","Music","Theology","Science","Programs in Other Areas"],
                "Honorary Awards": ["Honorary Doctorate","Distinguished Alumni Award","Other"]
            };
            const programSelect = document.getElementById('popupProgramSelect');
            const courseSelect = document.getElementById('popupCourseSelect');
            if (programSelect && courseSelect) {
                programSelect.addEventListener('change', function() {
                    const courses = PROGRAM_COURSES[this.value] || [];
                    courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>' +
                        courses.map(c => '<option value="' + c + '">' + c + '</option>').join('');
                    courseSelect.disabled = courses.length === 0;
                });
            }

            // Simple validation helper
            function validateField(input, errEl) {
                const v = (input.value || '').trim();
                let msg = '';
                if (input.required && !v) {
                    msg = 'This field is required.';
                } else if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                    msg = 'Please enter a valid email address.';
                }
                if(errEl) {
                    errEl.textContent = msg;
                }
                input.classList.toggle('input-error', !!msg);
                return !msg;
            }

            const form = document.getElementById('popupContactForm');
            const btn = document.getElementById('popupSubmitBtn');

            if (form && btn) {
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const nameEl = document.getElementById('pcf-name');
                    const emailEl = document.getElementById('pcf-email');
                    const msgEl = document.getElementById('pcf-message');
                    const v1 = validateField(nameEl, document.getElementById('pcf-name-err'));
                    const v2 = validateField(emailEl, document.getElementById('pcf-email-err'));
                    const v3 = validateField(msgEl, document.getElementById('pcf-message-err'));
                    if (!v1 || !v2 || !v3) return;

                    btn.disabled = true;
                    btn.textContent = 'Sending…';
                    try {
                        const fd = new FormData(form);
                        const body = {
                            name: fd.get('name') || "",
                            email: fd.get('email') || "",
                            phone: fd.get('phone') || "",
                            subject: [fd.get('program'), fd.get('course')].filter(Boolean).join(" — ") || 'General Inquiry',
                            message: fd.get('message') || ""
                        };
                        
                        if (window.ScolarAPI && window.ScolarAPI.submitContact) {
                            await window.ScolarAPI.submitContact(body);
                        } else {
                            await fetch('/api/contact', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(body)
                            });
                        }
                    } catch(err) { 
                        console.warn('Form submit error:', err); 
                    }

                    // Fade form out, show success INSIDE popup
                    form.style.transition = 'opacity 0.4s ease';
                    form.style.opacity = '0';
                    setTimeout(function() {
                        form.style.display = 'none';
                        document.getElementById('popupSuccess').style.display = 'block';
                    }, 400);
                });
            }
        }, 3000); // Popup after 3 seconds of page load
    }

    // ── HIGHLIGHT ACTIVE NAV LINK ───────────────────────────────────────────────
    (function() {
        const path = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === 'javascript:void(0)') return;
            
            // Exact match or root handling
            if (href === path || (path === '/index.html' && href === '/')) {
                link.classList.add('nav-active');
                
                // If this is inside a dropdown, highlight the parent "Programs" link too
                const dropdown = link.closest('.nav-dropdown');
                if (dropdown) {
                    const parentLink = dropdown.previousElementSibling;
                    if (parentLink && parentLink.classList.contains('nav-link')) {
                        parentLink.classList.add('nav-active');
                    }
                }
            } else if (href !== '/' && path.startsWith(href)) {
                // E.g. highlighting /programs/ when visiting /programs/master.html
                // (if we ever added a /programs directory root link)
                link.classList.add('nav-active');
            }
        });
    })();

    // ── TASK 2: HAMBURGER NAV DEFINITIVE FIX ────────────────────────────────────
    (function() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (!toggle || !menu) return;
        
        if (toggle) toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = menu.classList.contains('active');
            menu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close menu when a link is clicked
        menu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (!link.classList.contains('nav-link')) {
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    })();
});


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

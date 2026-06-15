
document.addEventListener('DOMContentLoaded', async () => {
    async function loadComponent(id, url) {
        const el = document.getElementById(id);
        if (el) {
            // Agar pehle se content hai (inline embed) toh fetch skip karo
            if (el.innerHTML.trim() !== '') return;
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
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
});

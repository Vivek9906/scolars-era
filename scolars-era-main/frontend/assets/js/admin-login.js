// scolars-era/frontend/assets/js/admin-login.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector('.toggle-pass');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', togglePass);
  }

  function togglePass() {
    const p = document.getElementById('password');
    const i = document.getElementById('eyeIcon');
    p.type = p.type === 'password' ? 'text' : 'password';
    i.className = p.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const errBox = document.getElementById('errBox');
      const errMsg = document.getElementById('errMsg');
      errBox.classList.remove('show');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';
      try {
        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: document.getElementById('email').value.trim(), password: document.getElementById('password').value }),
          credentials: 'include'
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || 'Login failed');
        if (d.data.role !== 'admin') throw new Error('Access denied. Admin accounts only.');
        localStorage.setItem('se_token', d.token);
        localStorage.setItem('se_user', JSON.stringify(d.data));
        window.location.href = '/admin/index.html';
      } catch (err) {
        errMsg.textContent = err.message;
        errBox.classList.add('show');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      }
    });
  }

  // Redirect if already logged in
  (async () => {
    const t = localStorage.getItem('se_token');
    if (t) {
      try {
        const r = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + t } });
        if (r.ok) {
          const d = await r.json();
          if (d.data.role === 'admin') window.location.href = '/admin/index.html';
        }
      } catch (e) {}
    }
  })();
});

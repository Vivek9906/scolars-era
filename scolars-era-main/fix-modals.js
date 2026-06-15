const fs = require('fs');
['courses', 'universities', 'testimonials', 'contacts'].forEach(name => {
  const file = 'frontend/assets/js/admin-' + name + '.js';
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  if (code.includes("document.addEventListener('click', e => {")) {
    const fix = `
  // Modal Close Fix
  if (e.target.closest('.mc') || e.target.closest('.modal-close') || e.target.closest('.modal-close-btn') || 
      (e.target.closest('.btn') && e.target.closest('.btn').textContent.trim().toLowerCase() === 'cancel') ||
      e.target.classList.contains('mb') || e.target.classList.contains('confirm-mb') || 
      e.target.classList.contains('modal-bg') || e.target.classList.contains('modal-overlay')) {
    
    if (typeof closeModal === 'function') closeModal();
    if (typeof closeConfirm === 'function') closeConfirm();
    
    if (e.target.closest('.modal-overlay') || e.target.classList.contains('modal-overlay')) {
      const overlays = document.querySelectorAll('.modal-overlay');
      overlays.forEach(o => o.remove());
    }
    return;
  }
`;
    if (!code.includes('Modal Close Fix')) {
      code = code.replace("document.addEventListener('click', e => {", "document.addEventListener('click', e => {" + fix);
      fs.writeFileSync(file, code);
      console.log('Fixed ' + file);
    }
  }
});

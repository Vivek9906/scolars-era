const fs = require('fs');
['courses.html', 'universities.html', 'testimonials.html', 'contacts.html', 'dashboard.html'].forEach(f => {
  const path = 'frontend/admin/' + f;
  if (!fs.existsSync(path)) return;
  let html = fs.readFileSync(path, 'utf8');
  
  // Extract script
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let scriptContent = scriptMatch[1];
    
    // Replace inline onclicks in HTML strings within JS
    scriptContent = scriptContent
      .replace(/onclick=\\?\"editCourse\('([^']+)'\)\\?\"/g, 'data-action="edit" data-id="$1"')
      .replace(/onclick=\\?\"toggleActive\('([^']+)',([^)]+)\)\\?\"/g, 'data-action="toggle" data-id="$1" data-active="$2"')
      .replace(/onclick=\\?\"confirmDelCourse\('([^']+)'[^)]*\)\\?\"/g, 'data-action="delete" data-id="$1"')
      .replace(/onclick=\"sortTable\('([^']+)'\)\"/g, 'data-action="sort" data-col="$1"')
      .replace(/onclick=\"logout\(\)\"/g, 'data-action="logout"')
      .replace(/onclick=\"openModal\([^)]*\)\"/g, 'data-action="open-modal"')
      .replace(/onclick=\"closeModal\(\)\"/g, 'data-action="close-modal"')
      .replace(/onclick=\"closeConfirm\(\)\"/g, 'data-action="close-confirm"')
      .replace(/onclick='viewContact\([^)]+\)'/g, 'data-action="view-contact"')
      .replace(/onclick=\"deleteUni\('([^']+)'[^)]*\)\"/g, 'data-action="delete-uni" data-id="$1"')
      .replace(/onclick=\"deleteT\('([^']+)'\)\"/g, 'data-action="delete-testimonial" data-id="$1"')
      .replace(/onclick=\"toggleFeatured\('([^']+)',([^)]+)\)\"/g, 'data-action="toggle-featured" data-id="$1" data-active="$2"');
      
    // Write the modified script to external JS file
    const jsPath = 'frontend/assets/js/admin-' + f.replace('.html', '.js');
    
    // Add event listeners to the script
    scriptContent += `
// --- Event Delegation Added by Refactor ---
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  
  if (action === 'logout') logout();
  if (action === 'open-modal') {
    if (typeof openModal === 'function') openModal();
  }
  if (action === 'close-modal') closeModal();
  if (action === 'close-confirm') {
     if (typeof closeConfirm === 'function') closeConfirm();
  }
  if (action === 'sort') sortTable(btn.dataset.col);
  if (action === 'edit') editCourse(btn.dataset.id);
  if (action === 'toggle') toggleActive(btn.dataset.id, btn.dataset.active === 'true' || btn.dataset.active === '\\\${c.isActive}');
  if (action === 'delete') confirmDelCourse(btn.dataset.id, 'Item');
  if (action === 'delete-uni') deleteUni(btn.dataset.id, 'University');
  if (action === 'delete-testimonial') deleteT(btn.dataset.id);
  if (action === 'toggle-featured') toggleFeatured(btn.dataset.id, btn.dataset.active === 'true' || btn.dataset.active === '\\\${t.isFeatured}');
});
`;
    
    fs.writeFileSync(jsPath, scriptContent);
    
    // Replace script block in HTML with external src
    html = html.replace(/<script>[\s\S]*?<\/script>/, `<script src="/assets/js/admin-${f.replace('.html', '.js')}"></script>`);
    
    // Also remove any remaining inline onclicks in the HTML body
    html = html.replace(/onclick=\"[^\"]*\"/g, '');
    
    fs.writeFileSync(path, html);
    console.log('Refactored ' + f);
  }
});

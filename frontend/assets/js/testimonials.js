document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("testimonials-grid");
  if (!container) return;

  try {
    const res = await fetch("/api/testimonials");
    const data = await res.json();

    const isHome = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
    const testimonialsToDisplay = isHome ? data.data.slice(0, 5) : data.data;

    // Professional avatar fallbacks from Unsplash
    const avatarFallbacks = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    ];

    // Remove the original grid class so it doesn't mess with our deck layout
    container.className = "testimonials-deck-wrapper";

    const cards = testimonialsToDisplay.map((t, i) => {
      const avatar = t.studentAvatar || avatarFallbacks[i % avatarFallbacks.length];
      const stars = '★'.repeat(5);
      const role = t.studentRole || 'Student';
      const initials = t.studentName ? t.studentName.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

      const card = document.createElement("div");
      card.className = "testimonials-deck-card";
      card.innerHTML = `
        <div class="deck-card-inner">
          <div class="deck-quote-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.135 5.015c-4.355.76-7.44 4.14-7.44 8.478 0 3.13 2.014 5.342 4.558 5.342 2.359 0 4.186-1.84 4.186-4.13 0-2.29-1.641-3.946-3.626-4.32.385-2.394 2.359-4.233 5.04-5.156l-2.718-.214zm11.176 0c-4.355.76-7.44 4.14-7.44 8.478 0 3.13 2.014 5.342 4.558 5.342 2.359 0 4.186-1.84 4.186-4.13 0-2.29-1.641-3.946-3.626-4.32.385-2.394 2.359-4.233 5.04-5.156l-2.718-.214z"/>
            </svg>
          </div>
          <div class="deck-stars">${stars}</div>
          <p class="deck-content">"${t.content}"</p>
          <div class="deck-author">
            <div class="deck-avatar">
              <img src="${avatar}" alt="${t.studentName}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" loading="lazy">
              <span class="tcard-avatar-fallback" style="display:none; width: 100%; height: 100%; border-radius: 50%; background: #004D40; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid #fff;">${initials}</span>
            </div>
            <div class="deck-author-info">
              <strong>${t.studentName}</strong>
              <span>${role}</span>
            </div>
          </div>
        </div>
      `;
      return card;
    });

    cards.forEach(c => container.appendChild(c));

    let currentIndex = 0;
    
    function updateCards() {
      cards.forEach((card, index) => {
        // Calculate relative position based on current index
        let relIndex = index - currentIndex;
        if (relIndex < 0) relIndex += cards.length;
        
        card.className = "testimonials-deck-card"; // reset
        if (relIndex === 0) {
          card.classList.add("deck-card-0");
        } else if (relIndex === 1) {
          card.classList.add("deck-card-1");
        } else if (relIndex === 2) {
          card.classList.add("deck-card-2");
        } else {
          card.classList.add("deck-card-hidden");
        }
      });
    }

    // Initialize
    updateCards();

    // Interaction to cycle
    function nextCard() {
      const currentTopCard = cards[currentIndex];
      currentTopCard.style.transform = "translateY(-150px) scale(1.05) rotate(10deg)";
      currentTopCard.style.opacity = "0";
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCards();
      }, 400); // Wait for throw out animation
    }

    // Auto rotate every 5s
    let autoPlay = setInterval(nextCard, 5000);

    // On click
    container.addEventListener("click", () => {
      clearInterval(autoPlay);
      nextCard();
      autoPlay = setInterval(nextCard, 5000);
    });

  } catch (err) {
    container.innerHTML = "<p>Failed to load testimonials</p>";
  }
});

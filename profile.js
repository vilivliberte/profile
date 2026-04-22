/**
 * Liberté FC Profile Site - profile.js
 * Representative Profile Page
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // Scroll Reveal (Intersection Observer)
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  // ==========================================
  // Parallax effect on hero photo
  // ==========================================
  const heroPhoto = document.querySelector('.hero-photo-container');
  const hero = document.querySelector('.profile-hero');

  if (heroPhoto && hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 400) {
        heroPhoto.style.transform = `translateY(${scrollY * 0.12}px)`;
      }
    }, { passive: true });
  }

  // ==========================================
  // Timeline items hover effect
  // ==========================================
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transition = 'padding-left 0.22s ease';
      item.style.paddingLeft = '6px';
    });
    item.addEventListener('mouseleave', () => {
      item.style.paddingLeft = '0';
    });
  });

  // ==========================================
  // Business card entrance animation
  // ==========================================
  const bizCards = document.querySelectorAll('.biz-card');
  const bizObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const cards = entry.target.parentElement.querySelectorAll('.biz-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 100);
          });
          bizObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  bizCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.45s ease, transform 0.45s ease, all 0.22s ease';
    bizObserver.observe(card);
  });

  // ==========================================
  // Back button ripple
  // ==========================================
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      // Allow normal navigation
    });
  }

  // ==========================================
  // Logo bar subtle entrance
  // ==========================================
  const logoBar = document.getElementById('logo-bar');
  if (logoBar) {
    const img = logoBar.querySelector('img');
    if (img) {
      img.style.animation = 'logoPulse 5s ease-in-out infinite';

      const style = document.createElement('style');
      style.textContent = `
        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 0px rgba(30,58,138,0)); opacity: 0.9; }
          50%       { filter: drop-shadow(0 0 8px rgba(30,58,138,0.15)); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

});

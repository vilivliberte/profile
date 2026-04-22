/**
 * Liberté FC Profile Site - script.js
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // Ripple effect on menu cards
  // ==========================================
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
    @keyframes logoPulse {
      0%, 100% { filter: drop-shadow(0 0 0px rgba(30,58,138,0)); }
      50%       { filter: drop-shadow(0 0 10px rgba(30,58,138,0.18)); }
    }
  `;
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.6;
      const x      = e.clientX - rect.left  - size / 2;
      const y      = e.clientY - rect.top   - size / 2;

      Object.assign(ripple.style, {
        position:     'absolute',
        left:         x + 'px',
        top:          y + 'px',
        width:        size + 'px',
        height:       size + 'px',
        borderRadius: '50%',
        background:   'rgba(30,58,138,0.08)',
        pointerEvents:'none',
        transform:    'scale(0)',
        animation:    'rippleAnim 0.55s ease forwards',
        zIndex:       '0',
      });

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================================
  // Logo subtle pulse
  // ==========================================
  const logoImg = document.querySelector('.hero-logo-strip img');
  if (logoImg) {
    logoImg.style.animation = 'logoPulse 4s ease-in-out infinite';
  }

  // ==========================================
  // Placeholder click → toast
  // ==========================================
  document.querySelectorAll('.menu-card').forEach(card => {
    if (card.getAttribute('href') === '#') {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const label = card.querySelector('.card-label')?.innerText?.replace(/\n/g, '') || 'このページ';
        showToast(`「${label}」は準備中です`);
      });
    }
  });

  // ==========================================
  // Toast notification
  // ==========================================
  function showToast(message) {
    const existing = document.getElementById('__toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = '__toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position:    'fixed',
      bottom:      '28px',
      left:        '50%',
      transform:   'translateX(-50%) translateY(16px)',
      background:  '#1e3a8a',
      color:       '#ffffff',
      fontFamily:  "'Noto Sans JP', sans-serif",
      fontSize:    '0.78rem',
      fontWeight:  '500',
      padding:     '10px 26px',
      borderRadius:'40px',
      boxShadow:   '0 8px 28px rgba(30,58,138,0.28)',
      opacity:     '0',
      transition:  'all 0.28s cubic-bezier(.34,1.56,.64,1)',
      zIndex:      '9999',
      pointerEvents:'none',
      whiteSpace:  'nowrap',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(8px)';
      setTimeout(() => toast.remove(), 320);
    }, 2200);
  }

  // ==========================================
  // Intersection Observer (staggered scroll)
  // ==========================================
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) observer.unobserve(entry.target);
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.menu-card').forEach(c => observer.observe(c));

  // ==========================================
  // Password protection for "加盟店へのお知らせ"
  // ==========================================
  const newsCard = document.getElementById('card-contact-owner');
  const modal = document.getElementById('password-modal');
  const modalInput = document.getElementById('modal-password-input');
  const modalError = document.getElementById('modal-error-msg');
  const btnCancel = document.getElementById('modal-cancel-btn');
  const btnSubmit = document.getElementById('modal-submit-btn');

  if (newsCard && modal) {
    // Show modal
    newsCard.addEventListener('click', (e) => {
      e.preventDefault();
      modalError.textContent = '';
      modalInput.value = '';
      modal.classList.add('active');
      setTimeout(() => modalInput.focus(), 100);
    });

    // Hide modal on cancel
    btnCancel.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Check password
    const checkPassword = () => {
      const password = modalInput.value;
      if (password === "liberte4410") {
        window.location.href = "news.html";
      } else {
        modalError.textContent = "パスワードが違います。";
      }
    };

    // Submit button click
    btnSubmit.addEventListener('click', checkPassword);

    // Enter key press
    modalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkPassword();
      }
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

});

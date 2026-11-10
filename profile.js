/**
 * Liberte FC Profile Site - profile.js
 * Dynamic Left & Right Photo / Content Slide-in Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  const animatedItems = [];

  /**
   * Register an element (or NodeList) with a slide direction and optional delay
   */
  const registerAnim = (selector, direction, delayMs = 0) => {
    const els = document.querySelectorAll(selector);
    els.forEach((el, idx) => {
      el.classList.add(`slide-from-${direction}`);
      const totalDelay = typeof delayMs === 'function' ? delayMs(idx) : delayMs;
      if (totalDelay > 0) {
        el.style.transitionDelay = `${totalDelay}ms`;
      }
      animatedItems.push(el);
    });
  };

  // 1. HERO: Left text from left, President photo from right
  registerAnim('.hero-text-col', 'left', 80);
  registerAnim('.hero-president-img', 'right', 200);
  registerAnim('.hero-message-area .message-heading, .hero-message-area .message-body', 'bottom', (i) => i * 120);

  // 2. CAREER: Timeline items stagger from left, Gym photo from right, 2016 box from left
  registerAnim('.career-item', 'left', (i) => i * 70);
  registerAnim('.career-photo-wrap', 'right', 100);
  registerAnim('.career-highlight-box', 'left', 150);

  // 3. BUSINESS: Left-column cards from left, Right-column cards from right
  registerAnim('.biz-cell:nth-child(odd)', 'left', (i) => i * 100);
  registerAnim('.biz-cell:nth-child(even)', 'right', (i) => i * 100 + 80);
  registerAnim('.stats-row .stats-item:first-child', 'left', 80);
  registerAnim('.stats-row .stats-item:last-child', 'right', 160);
  registerAnim('.stats-goal', 'bottom', 120);

  // 4. PRIVATE / HOBBIES: Triathlon & title layer from left, Motorcycle photo from right
  registerAnim('.hobbies-layer-left', 'left', 80);
  registerAnim('.hobbies-layer-right', 'right', 180);
  registerAnim('.hobbies-mid-area', 'left', 80);
  registerAnim('.hobbies-bottom-area .hobbies-closing-call', 'right', 100);

  // 5. NEXT CHALLENGE: Airport photo from left, topics alternating from right & left
  registerAnim('.challenge-photo-wrap', 'left', 80);
  registerAnim('.challenge-topic:nth-of-type(1)', 'right', 100);
  registerAnim('.challenge-topic:nth-of-type(2)', 'left', 140);
  registerAnim('.challenge-closing', 'bottom', 100);

  // 6. SPORTS: Table tennis card from left, Judo card from right, table rows alternating
  registerAnim('.sport-card:nth-child(1)', 'left', 60);
  registerAnim('.sport-card:nth-child(2)', 'right', 180);
  registerAnim('.sports-table .st-row:nth-child(odd)', 'left', (i) => i * 50);
  registerAnim('.sports-table .st-row:nth-child(even)', 'right', (i) => i * 50);

  // 7. QUALIFICATIONS: Left box from left, Right box from right, Education block from bottom
  registerAnim('.qual-box:nth-child(1)', 'left', 60);
  registerAnim('.qual-box:nth-child(2)', 'right', 180);
  registerAnim('.qual-edu-block', 'left', 100);
  registerAnim('.final-cta-btn', 'bottom', 100);

  // Trigger animations when elements enter viewport (and reset when scrolled far out so re-scrolling replays the motion)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          } else {
            // Re-arm animation when element goes below the viewport so scrolling down again replays the left/right slide
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight * 0.95) {
              entry.target.classList.remove('is-inview');
            }
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    animatedItems.forEach((el) => observer.observe(el));
  } else {
    animatedItems.forEach((el) => el.classList.add('is-inview'));
  }
});

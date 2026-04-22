/* ==========================================
   Liberté FC - news.js
   加盟店へのお知らせ ページ ロジック (スプレッドシート連携版)
   ========================================== */

// ==========================================
// Google Spreadsheet 設定
// ==========================================
// ★ ここに「ウェブに公開」したCSV形式のURLを貼り付けてください ★
const SPREADSHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdhRyDAjIrTjruvH5b7lCCjx5dKxvKNQcot0bcKpQ7hznQVEwCQ6S2bIXiaSKDC4a_uoH_wxA1Misb/pub?output=csv";

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

// ---- Category Mappings ----
const categoryMap = {
  "重要": "important",
  "お知らせ": "info",
  "データ": "data",
  "その他": "other"
};

// ---- Fetch Data ----
async function fetchNewsData() {
  const container = document.getElementById('news-container');
  
  if (SPREADSHEET_CSV_URL === "ここにURLを貼り付けます") {
    container.innerHTML = `
      <div style="text-align:center; padding:40px; color:var(--text-soft);">
        <p>※スプレッドシートのURLが設定されていません。<br>設定方法はAIアシスタントの案内をご確認ください。</p>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch(SPREADSHEET_CSV_URL);
    if (!response.ok) throw new Error("ネットワークエラーが発生しました");
    
    const csvText = await response.text();
    
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        renderNewsCards(results.data);
      },
      error: function(error) {
        console.error("CSV Parse Error:", error);
        container.innerHTML = `<p style="text-align:center; color:red;">データの解析に失敗しました。</p>`;
      }
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    container.innerHTML = `<p style="text-align:center; color:red;">データの読み込みに失敗しました。<br>※パソコンのフォルダから直接開いている場合、セキュリティ制限で読み込めないことがあります。</p>`;
  }
}

// ---- Render Data ----
function renderNewsCards(data) {
  const container = document.getElementById('news-container');
  container.innerHTML = ''; // Clear loading message

  let cardCount = 0;

  data.forEach((row, index) => {
    // 柔軟な列名取得（全角半角のブレやスペースを許容）
    const getVal = (keys) => {
      const match = Object.keys(row).find(k => keys.some(key => k.replace(/\s/g, '').includes(key)));
      return match ? row[match] : "";
    };

    const categoryJa = getVal(['項目']).trim();
    const categoryEn = categoryMap[categoryJa] || "info";
    const date = getVal(['日付']);
    const title = getVal(['題名']);
    const excerpt = getVal(['詳細']);
    const link = getVal(['リンクURL', 'リンクURl', 'リンクＵＲｌ']);
    const linkText = getVal(['リンク文字']) || "詳細を確認";
    
    if (!title || !categoryJa) return; // 必須項目がない行はスキップ

    const isPinned = categoryJa === "重要" ? "news-card--pinned" : "";
    const pinBadge = categoryJa === "重要" ? `<div class="news-pin-badge">📌 重要</div>` : "";

    const linkHTML = link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="news-read-more" style="text-decoration:none; color:inherit;">${linkText} →</a>` : '';

    const cardHTML = `
      <article class="news-card ${isPinned} reveal" data-category="${categoryEn}">
        ${pinBadge}
        <div class="news-card-inner">
          <div class="news-meta">
            <time class="news-date">${date}</time>
            <span class="news-tag news-tag--${categoryEn}">${categoryJa}</span>
          </div>
          <h2 class="news-title">${title}</h2>
          <p class="news-excerpt">${excerpt.replace(/\n/g, '<br>')}</p>
          <div class="news-footer">
            ${linkHTML}
          </div>
        </div>
      </article>
    `;
    
    container.insertAdjacentHTML('beforeend', cardHTML);
    cardCount++;
  });

  if (cardCount === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-soft);"><p>お知らせがありません。</p></div>`;
  }

  initDynamicEvents();
}

// ---- Initialize Events on Rendered Cards ----
let currentCards = [];
function initDynamicEvents() {
  currentCards = document.querySelectorAll('#news-container .news-card');

  // Reveal Animations
  currentCards.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 10) * 0.06}s`;
    revealObserver.observe(el);
  });

  // Ripple & Click to open link
  currentCards.forEach((card) => {
    card.addEventListener('click', function (e) {
      if (e.target.tagName.toLowerCase() === 'a') return; // Don't ripple if clicking the link directly

      // Ripple effect
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        background: rgba(30,58,138,0.08);
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      
      // Open link if card is clicked
      const linkEl = card.querySelector('a.news-read-more');
      if (linkEl && e.target !== linkEl) {
        window.open(linkEl.href, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // Apply current filter
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    applyFilter(activeBtn.dataset.filter);
  }
}

// ---- Filter Logic ----
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('empty-state');

function applyFilter(filter) {
  let visibleCount = 0;
  currentCards.forEach((card) => {
    if (filter === 'all' || card.dataset.category === filter) {
      card.classList.remove('hidden');
      visibleCount++;
      card.classList.remove('visible');
      setTimeout(() => card.classList.add('visible'), 60);
    } else {
      card.classList.add('hidden');
    }
  });

  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
  }
}

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    applyFilter(btn.dataset.filter);
  });
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Start Fetching Data
fetchNewsData();

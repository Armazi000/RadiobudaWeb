// â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  // active link
  document.querySelectorAll('.nav-link').forEach(a => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) {
      const {top, bottom} = sec.getBoundingClientRect();
      a.classList.toggle('active', top <= 100 && bottom > 100);
    }
  });
});

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.querySelectorAll('span').forEach((s, i) => {
    if (open) {
      if (i === 0) s.style.transform = 'translateY(6.5px) rotate(45deg)';
      if (i === 1) s.style.opacity = '0';
      if (i === 2) s.style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      s.style.transform = '';
      s.style.opacity = '';
    }
  });
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target)) navLinks.classList.remove('open');
});

// â”€â”€ NEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let allArticles = [];
let activeCategory = 'Wszystkie';

async function loadNews() {
  try {
    const res = await fetch('api/get_news.php');
    const data = await res.json();
    allArticles = data.articles;
    renderFilters(data.categories);
    renderNews(allArticles);
  } catch (e) {
    console.warn('Could not load news.json', e);
  }
}

function renderFilters(cats) {
  const container = document.getElementById('news-filters');
  if (!container) return;
  container.innerHTML = cats.map(cat => `
    <button class="news-filter-btn${cat === 'Wszystkie' ? ' active' : ''}"
            data-cat="${cat}">${cat}</button>
  `).join('');
  container.addEventListener('click', e => {
    const btn = e.target.closest('.news-filter-btn');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    container.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = activeCategory === 'Wszystkie'
      ? allArticles
      : allArticles.filter(a => a.category === activeCategory);
    renderNews(filtered);
  });
}

function renderNews(articles) {
  const grid = document.getElementById('news-grid');
  const empty = document.getElementById('news-empty');
  if (!grid) return;
  if (!articles.length) {
    grid.innerHTML = '';
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');
  grid.innerHTML = articles.map(a => `
    <article class="news-card">
      <div class="news-card-img">
        <img src="${a.image}" alt="${a.title}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/${a.id}/600/360'">
      </div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <time class="news-card-date">${formatDate(a.date)}</time>
          <span class="news-card-cat">${a.category}</span>
        </div>
        <h3 class="news-card-title"><a href="artykul.html?id=${a.id}">${a.title}</a></h3>
        <p class="news-card-excerpt">${a.excerpt}</p>
      </div>
    </article>
  `).join('');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pl-PL', {day:'numeric',month:'long',year:'numeric'});
}

loadNews();

// â”€â”€ ARTICLE PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (window.location.pathname.includes('artykul.html')) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  fetch('api/get_news.php').then(r => r.json()).then(data => {
    const article = data.articles.find(a => a.id == id); // allow type coercion
    if (!article) { document.body.innerHTML += '<p>ArtykuĹ‚ nie znaleziony.</p>'; return; }
    const container = document.getElementById('article-content');
    if (!container) return;
    container.innerHTML = `
      <div class="article-hero-img">
        <img src="${article.image}" alt="${article.title}"
             onerror="this.src='https://picsum.photos/seed/${article.id}/1200/600'">
      </div>
      <div class="article-meta">
        <span class="news-card-cat">${article.category}</span>
        <time>${formatDate(article.date)}</time>
      </div>
      <h1>${article.title}</h1>
      <div class="article-body">${article.content}</div>
    `;
    document.title = article.title + ' â€“ Radiobuda';
  });
}

// ¦¦ THEME TOGGLE ¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(isLight) {
  if(isLight) {
    document.body.classList.add('light-mode');
    if(themeIcon) themeIcon.textContent = '??';
  } else {
    document.body.classList.remove('light-mode');
    if(themeIcon) themeIcon.textContent = '??';
  }
}

const savedTheme = localStorage.getItem('radiobuda_theme') || 'dark';
applyTheme(savedTheme === 'light');

if(themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = !document.body.classList.contains('light-mode');
    applyTheme(isLight);
    localStorage.setItem('radiobuda_theme', isLight ? 'light' : 'dark');
  });
}


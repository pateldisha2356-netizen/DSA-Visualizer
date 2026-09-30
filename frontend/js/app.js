/* =========================================================
   DSA LAB — app.js
   Shared behavior loaded on every page: theme toggle, mobile
   nav toggle, active-link highlighting, and small utility
   helpers reused by the page-specific scripts.
   ========================================================= */

/* ---------- Theme ---------- */
function initTheme() {
  const saved = localStorage.getItem('dsalab_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '🌙' : '☀️';
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dsalab_theme', next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'dark' ? '🌙' : '☀️';
}

/* ---------- Mobile nav ---------- */
function toggleNav() {
  const nav = document.getElementById('mainnav');
  if (nav) nav.classList.toggle('open');
}

/* ---------- Highlight the current page's nav link ---------- */
function markActiveNav(id) {
  document.querySelectorAll('#mainnav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === id);
  });
}

/* ---------- Small shared utilities ---------- */
const DsaUtil = {
  randomArray(n, max) {
    n = n || 7;
    max = max || 95;
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * max) + 5);
    return arr;
  },
  parseArrayInput(raw, opts) {
    opts = opts || {};
    const arr = raw
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (opts.max && arr.length > opts.max) return arr.slice(0, opts.max);
    return arr;
  },
  showBanner(elId, message) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
  },
  hideBanner(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.remove('show');
  },
};

document.addEventListener('DOMContentLoaded', initTheme);

/* ═══════════════════════════════════════════════
   BRAGANDA SYSTEMS — Shared Nav + Footer
   Injected on every page via <script>
═══════════════════════════════════════════════ */

(function () {
  /* ── NAV ── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  const navLinks = [
    { label: 'Home',      href: '/' },
    { label: 'Services',  href: '/services/' },
    { label: 'Solutions', href: '/solutions/' },
    { label: 'Blog',      href: '/blog/' },
    { label: 'About',     href: '/about/' },
    { label: 'Contact',   href: '/contact/' },
  ];

  const navHTML = `
  <nav role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a class="nav-logo" href="/" aria-label="Braganda Systems Home">BRAGANDA<span>.</span>SYSTEMS</a>
      <ul class="nav-links">
        ${navLinks.map(l => `
          <li><a href="${l.href}"${currentPath === l.href.replace(/\/$/, '') ? ' aria-current="page"' : ''}>${l.label}</a></li>
        `).join('')}
      </ul>
      <div class="nav-cta">
        <a class="btn btn-orange btn-sm" href="/contact/">Book a Call →</a>
      </div>
    </div>
  </nav>`;

  /* ── FOOTER ── */
  const footerHTML = `
  <footer role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="nav-logo" href="/">BRAGANDA<span>.</span>SYSTEMS</a>
          <p>AI automation and digital systems that remove bottlenecks, cut costs, and drive growth — without adding overhead.</p>
          <a class="btn btn-orange btn-sm" href="/contact/">Book a Call →</a>
        </div>
        <div class="footer-col">
          <h5>Solutions</h5>
          <ul class="footer-links">
            <li><a href="/solutions/speed-to-lead/">Speed to Lead</a></li>
            <li><a href="/solutions/document-processing/">Document Processing</a></li>
            <li><a href="/solutions/follow-up-nurture/">Follow-Up &amp; Nurture</a></li>
            <li><a href="/solutions/database-reactivation/">Database Reactivation</a></li>
            <li><a href="/solutions/ai-os/">AI-OS</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/services/">Services</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contact/">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Get Started</h5>
          <ul class="footer-links">
            <li><a href="/contact/">Book a Discovery Call</a></li>
            <li><a href="/solutions/">View Solutions</a></li>
            <li><a href="/contact/">Request a Bespoke Build</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Braganda Systems Ltd. All rights reserved.</span>
        <a href="mailto:hello@braganda.systems">hello@braganda.systems</a>
      </div>
    </div>
  </footer>`;

  /* Inject */
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ── TICKER (homepage only) ── */
  const tickerEl = document.getElementById('ticker-inner');
  if (tickerEl) {
    const items = ['Speed to Lead', 'Document Automation', 'Nurture Sequences',
      'Database Reactivation', 'AI-OS', 'AI Automation',
      'Business Systems', 'Workflow Design', 'Process Automation', 'Digital Infrastructure'];
    const doubled = [...items, ...items];
    tickerEl.innerHTML = doubled.map(t =>
      `<div class="ticker-item"><span class="ticker-dot"></span>${t}</div>`
    ).join('');
  }

  /* ── Blog category pills ── */
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
})();

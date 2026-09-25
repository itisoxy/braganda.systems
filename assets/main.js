/* ═══════════════════════════════════════════════
   BRAGANDA SYSTEMS — Shared Nav, Footer & Components
   Injected on every page via <script>
═══════════════════════════════════════════════ */

(function () {
  /* ── NAV DATA ── */
  const gtmSystemsMenu = [
    {
      label: 'Find & Convert',
      href: '/solutions/ai-gtm/',
      links: [
        { label: 'AI GTM Systems', href: '/solutions/ai-gtm/' },
        { label: 'AI Outbound Engine', href: '/solutions/ai-outbound/' },
        { label: 'GTM Intelligence', href: '/solutions/gtm-intelligence/' },
        { label: 'Speed-to-Lead', href: '/solutions/speed-to-lead/' },
        { label: 'Lead Qualification & Routing', href: '/solutions/ai-gtm/#lead-scoring-routing' },
      ],
    },
    {
      label: 'Manage & Scale',
      href: '/solutions/crm-revops/',
      links: [
        { label: 'Lead Enrichment', href: '/solutions/gtm-intelligence/' },
        { label: 'Database Reactivation', href: '/solutions/database-reactivation/' },
        { label: 'Follow-Up & Nurture', href: '/solutions/follow-up-nurture/' },
        { label: 'CRM & RevOps', href: '/solutions/crm-revops/' },
        { label: 'GTM Architecture', href: '/insights/gtm-architecture/' },
      ],
    },
  ];

  const aiAutomationMenu = [
    {
      label: 'AI Automation',
      href: '/solutions/ai-automation/',
      links: [
        { label: 'Workflow Automation', href: '/solutions/ai-automation/#workflow-automation' },
        { label: 'Document Processing', href: '/solutions/document-processing/' },
        { label: 'Operations Automation', href: '/solutions/ai-automation/#operations-automation' },
        { label: 'AI Agents', href: '/solutions/ai-automation/#ai-agents' },
        { label: 'API & Platform Integrations', href: '/solutions/ai-automation/#integrations' },
        { label: 'Reporting Automation', href: '/solutions/ai-automation/#reporting-automation' },
      ],
    },
    {
      label: 'Custom AI Systems',
      href: '/solutions/custom-ai/',
      links: [
        { label: 'Internal Tools', href: '/solutions/custom-ai/#internal-tools' },
        { label: 'RAG Systems', href: '/solutions/custom-ai/#rag-systems' },
        { label: 'Agentic Workflows', href: '/solutions/custom-ai/#agentic-workflows' },
        { label: 'AI Dashboards', href: '/solutions/custom-ai/#ai-dashboards' },
        { label: 'Custom Applications', href: '/solutions/custom-ai/#custom-applications' },
        { label: 'AI Operating System (AI-OS)', href: '/solutions/ai-os/' },
      ],
    },
  ];

  // Insights mega-menu is a distinct shape (pillar cards with descriptions, not link lists)
  const insightsPillars = [
    { label: 'AI GTM', href: '/insights/ai-gtm/', description: 'AI-powered systems for finding, qualifying and converting opportunities.' },
    { label: 'Revenue Automation', href: '/insights/revenue-automation/', description: 'Automating the processes between enquiry and revenue.' },
    { label: 'AI Automation', href: '/insights/ai-automation/', description: 'Practical AI workflows for growing businesses.' },
    { label: 'n8n Builds', href: '/insights/n8n/', description: 'Hands-on automation builds, integrations and architectures.' },
    { label: 'GTM Architecture', href: '/insights/gtm-architecture/', description: 'CRM, data, enrichment and GTM technology.' },
    { label: 'Operations', href: '/insights/operations/', description: 'Better systems and processes for growing businesses.' },
  ];

  // GTM Systems dropdown holds both GTM-focused and AI Automation links, in two labelled groups
  const solutionsMenuGroups = [
    { label: 'GTM Systems', cols: gtmSystemsMenu },
    { label: 'AI Automation', cols: aiAutomationMenu },
  ];

  const navLinks = [
    { label: 'GTM Systems', href: '/solutions/ai-gtm/', groupedDropdown: solutionsMenuGroups },
    { label: 'Case Studies', href: '/case-studies/' },
    { label: 'Insights', href: '/insights/', insightsDropdown: insightsPillars },
    { label: 'About', href: '/about/' },
  ];

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const isActive = (href) => currentPath === href.replace(/\/$/, '');
  const isActivePrefix = (href) => href !== '/' && currentPath.indexOf(href.replace(/\/$/, '')) === 0;

  const megaMenuHTML = (cols) => `
    <div class="nav-megamenu${cols.length === 2 ? ' nav-megamenu-2col' : ''}" role="menu">
      ${cols.map(col => `
        <div class="megamenu-col">
          <div class="megamenu-col-label">${col.label}</div>
          <ul class="megamenu-links">
            ${col.links.map(l => `<li><a href="${l.href}" role="menuitem">${l.label}</a></li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>`;

  // GTM Systems dropdown: two labelled groups (GTM Systems / AI Automation), each holding its own sub-columns
  const groupedMegaMenuHTML = (groups) => `
    <div class="nav-megamenu nav-megamenu-grouped" role="menu">
      ${groups.map(g => `
        <div class="megamenu-group">
          <div class="megamenu-group-label">${g.label}</div>
          <div class="megamenu-group-cols">
            ${g.cols.map(col => `
              <div class="megamenu-col">
                <div class="megamenu-col-label">${col.label}</div>
                <ul class="megamenu-links">
                  ${col.links.map(l => `<li><a href="${l.href}" role="menuitem">${l.label}</a></li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;

  const insightsMenuHTML = (pillars) => `
    <div class="nav-megamenu nav-megamenu-insights" role="menu">
      ${pillars.map(p => `
        <a class="insights-pillar-tile" href="${p.href}" role="menuitem">
          <div class="insights-pillar-tile-label">${p.label}</div>
          <p>${p.description}</p>
        </a>
      `).join('')}
      <a class="insights-view-all" href="/insights/" role="menuitem">View All Insights →</a>
    </div>`;

  const navHTML = `
  <nav role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a class="nav-logo" href="/" aria-label="Braganda Systems Home">BRAGANDA<span>.</span>SYSTEMS</a>
      <ul class="nav-links" id="nav-links">
        ${navLinks.map(l => {
          if (l.dropdown || l.insightsDropdown || l.groupedDropdown) {
            const active = isActive(l.href) || isActivePrefix(l.href);
            const menu = l.dropdown ? megaMenuHTML(l.dropdown) : l.groupedDropdown ? groupedMegaMenuHTML(l.groupedDropdown) : insightsMenuHTML(l.insightsDropdown);
            return `
            <li class="nav-item-dropdown">
              <button class="nav-dropdown-trigger nav-highlight" data-href="${l.href}" aria-expanded="false" aria-haspopup="true"${active ? ' aria-current="page"' : ''}>
                ${l.label}
                <svg viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              ${menu}
            </li>`;
          }
          return `<li><a href="${l.href}"${isActive(l.href) ? ' aria-current="page"' : ''}>${l.label}</a></li>`;
        }).join('')}
        <li class="nav-cta-mobile"><a class="btn btn-orange" href="/contact/">Let's Build →</a></li>
      </ul>
      <div class="nav-cta">
        <a class="btn btn-orange btn-sm" href="/contact/">Let's Build →</a>
      </div>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;

  /* ── FOOTER (no phone — email only; Insights directory architecture) ── */
  const footerHTML = `
  <footer role="contentinfo">
    <div class="container">
      <div class="footer-insights-directory">
        <div class="footer-insights-col">
          <a class="footer-insights-heading" href="/insights/ai-gtm/">AI GTM</a>
          <ul class="footer-links">
            <li><a href="/insights/what-is-an-ai-gtm-system-a-practical-guide-for-growing-teams/">What Is an AI GTM System?</a></li>
            <li><a href="/insights/how-to-build-an-ai-sdr-without-building-a-spam-machine/">How to Build an AI SDR</a></li>
            <li><a href="/insights/ai-lead-qualification-score-faster-without-throwing-away-good-leads/">AI Lead Qualification</a></li>
          </ul>
          <a class="footer-insights-viewall" href="/insights/ai-gtm/">View AI GTM →</a>
        </div>
        <div class="footer-insights-col">
          <a class="footer-insights-heading" href="/insights/revenue-automation/">Revenue Automation</a>
          <ul class="footer-links">
            <li><a href="/insights/speed-to-lead-automation-respond-while-intent-is-still-hot/">Speed-to-Lead Automation</a></li>
            <li><a href="/insights/crm-database-reactivation/">Database Reactivation</a></li>
            <li><a href="/insights/automated-sales-follow-up/">Automated Sales Follow-Up</a></li>
          </ul>
          <a class="footer-insights-viewall" href="/insights/revenue-automation/">View Revenue Automation →</a>
        </div>
        <div class="footer-insights-col">
          <a class="footer-insights-heading" href="/insights/ai-automation/">AI Automation</a>
          <ul class="footer-links">
            <li><a href="/insights/the-practical-guide-to-ai-automation-for-smes-in-2026/">Practical Guide to AI Automation</a></li>
            <li><a href="/insights/what-ai-operating-system-actually-is/">What AI-OS Actually Is</a></li>
            <li><a href="/insights/document-chaos-how-ai-is-changing-back-office-operations/">Document Chaos</a></li>
          </ul>
          <a class="footer-insights-viewall" href="/insights/ai-automation/">View AI Automation →</a>
        </div>
        <div class="footer-insights-col">
          <a class="footer-insights-heading" href="/insights/n8n/">n8n Builds</a>
          <ul class="footer-links">
            <li><a href="/insights/n8n-plus-zoho-crm-a-practical-revenue-automation-stack/">n8n + Zoho CRM</a></li>
            <li><a href="/insights/n8n-plus-salesforce-build-flexible-automation-around-your-crm/">n8n + Salesforce</a></li>
            <li><a href="/insights/n8n-plus-hubspot-connect-marketing-sales-and-ai-workflows/">n8n + HubSpot</a></li>
          </ul>
          <a class="footer-insights-viewall" href="/insights/n8n/">View n8n Builds →</a>
        </div>
        <div class="footer-insights-col">
          <a class="footer-insights-heading" href="/insights/gtm-architecture/">GTM Architecture</a>
          <ul class="footer-links">
          </ul>
          <a class="footer-insights-viewall" href="/insights/gtm-architecture/">View GTM Architecture →</a>
        </div>
        <div class="footer-insights-col">
          <a class="footer-insights-heading" href="/insights/operations/">Operations</a>
          <ul class="footer-links">
            <li><a href="/insights/5-signs-your-business-has-outgrown-manual-processes/">5 Signs You've Outgrown Manual Processes</a></li>
          </ul>
          <a class="footer-insights-viewall" href="/insights/operations/">View Operations →</a>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2025 Braganda Systems Ltd. All rights reserved. · Designed by <a href="https://www.braganda.co.uk/" target="_blank" rel="noopener">Braganda Agency</a></span>
        <a href="mailto:hello@braganda.co.uk">hello@braganda.co.uk</a>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-links');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth > 1080) {
        window.location.href = trigger.dataset.href;
        return;
      }
      e.preventDefault();
      const parent = trigger.closest('.nav-item-dropdown');
      const open = parent.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ── Blog category pills ── */
  /* ── ARTICLE TABLE OF CONTENTS (auto-built from <h2>s) ── */
  document.querySelectorAll('[data-toc]').forEach(tocList => {
    const content = document.querySelector('.article-content');
    const wrapper = tocList.closest('.sidebar-toc');
    if (!content) { if (wrapper) wrapper.style.display = 'none'; return; }
    const headings = content.querySelectorAll('h2');
    if (!headings.length) { if (wrapper) wrapper.style.display = 'none'; return; }
    headings.forEach((h, i) => {
      if (!h.id) {
        const slug = h.textContent.toLowerCase().trim()
          .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
        h.id = slug || ('section-' + i);
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });
  });

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ── TECHNOLOGY ECOSYSTEM (reusable, data-driven) ── */
  // capabilityStatus: 'active' = genuinely used/integrated; 'planned' = architecture supports it, not yet built
  const TECH_DATA = [
    { name: 'HubSpot', category: 'CRM & RevOps', description: 'CRM architecture, lifecycle automation, lead routing, nurture and reporting.', status: 'active' },
    { name: 'Salesforce', category: 'CRM & RevOps', description: 'CRM workflows, pipeline processes, marketing integration and data sync.', status: 'active' },
    { name: 'Pardot', category: 'CRM & RevOps', description: 'Marketing automation and lead scoring within the Salesforce ecosystem.', status: 'active' },
    { name: 'Zoho CRM', category: 'CRM & RevOps', description: 'CRM configuration, workflow automation and pipeline management.', status: 'active' },
    { name: 'n8n', category: 'Automation & Orchestration', description: 'Multi-step AI automation, APIs, webhooks, enrichment workflows and orchestration.', status: 'active' },
    { name: 'Zapier', category: 'Automation & Orchestration', description: 'Lightweight cross-platform automation and app connections.', status: 'active' },
    { name: 'Make', category: 'Automation & Orchestration', description: 'Visual, multi-step workflow automation across connected platforms.', status: 'active' },
    { name: 'Clay', category: 'GTM Intelligence & Enrichment', description: 'Account intelligence, enrichment, research and GTM workflows.', status: 'active' },
    { name: 'Apollo', category: 'GTM Intelligence & Enrichment', description: 'Contact and account data for outbound prospecting and enrichment.', status: 'active' },
    { name: 'Apify', category: 'GTM Intelligence & Enrichment', description: 'Automated web data collection feeding GTM intelligence workflows.', status: 'active' },
    { name: 'OpenAI', category: 'AI & LLMs', description: 'Research, classification, extraction, personalisation and workflow reasoning.', status: 'active' },
    { name: 'Claude (Anthropic)', category: 'AI & LLMs', description: 'AI models selected around the use case — reasoning, drafting and analysis.', status: 'active' },
    { name: 'Supabase', category: 'Data & Infrastructure', description: 'Structured workflow data, application backends and automation state.', status: 'active' },
    { name: 'PostgreSQL', category: 'Data & Infrastructure', description: 'Relational data storage underpinning custom systems and dashboards.', status: 'active' },
    { name: 'AWS', category: 'Data & Infrastructure', description: 'Cloud infrastructure for custom applications and data pipelines.', status: 'active' },
    { name: 'Slack', category: 'Communication', description: 'Sales alerts, notifications and internal workflow approvals.', status: 'active' },
    { name: 'WordPress', category: 'Web & Analytics', description: 'Website builds and CMS integrations connected into the wider GTM stack.', status: 'active' },
    { name: 'Webflow', category: 'Web & Analytics', description: 'Design-led website builds connected into automation and CRM systems.', status: 'active' },
    { name: 'GA4', category: 'Web & Analytics', description: 'Website and funnel analytics feeding attribution and reporting.', status: 'active' },
    { name: 'Figma', category: 'Web & Analytics', description: 'Product and interface design for custom dashboards and tools.', status: 'active' },
  ];

  function renderTechEcosystem(container) {
    const filterAttr = container.dataset.techFilter; // comma-separated category list, optional
    const filters = filterAttr ? filterAttr.split(',').map(s => s.trim()) : null;
    const data = filters ? TECH_DATA.filter(t => filters.includes(t.category)) : TECH_DATA;
    const categories = [...new Set(data.map(t => t.category))];
    container.innerHTML = categories.map(cat => `
      <div>
        <div class="tech-category-label">${cat}</div>
        <div class="tech-row">
          ${data.filter(t => t.category === cat).map(t => `
            <div class="tech-badge" tabindex="0">
              <span class="tech-dot"></span>${t.name}
              <span class="tech-tip" role="tooltip">${t.description}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('') + `<p class="tech-disclaimer">All product names, logos and brands are property of their respective owners. Their use does not imply endorsement or partnership. Displaying a technology means we work with, understand or can integrate it.</p>`;
  }

  document.querySelectorAll('[data-tech-ecosystem]').forEach(renderTechEcosystem);
})();

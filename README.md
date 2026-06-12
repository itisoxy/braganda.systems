# Braganda Systems — Static Site

## File Structure

```
/
├── index.html                          ← Homepage
├── sitemap.xml                         ← XML sitemap (submit to Google Search Console)
├── robots.txt                          ← Search engine crawl rules
├── netlify.toml                        ← Netlify deploy config + redirect rules
├── 404.html                            ← Custom 404 page
│
├── assets/
│   ├── style.css                       ← Global stylesheet (all pages import this)
│   └── main.js                         ← Shared nav, footer, and interactive behaviour
│
├── services/
│   └── index.html                      ← /services/
│
├── solutions/
│   ├── index.html                      ← /solutions/
│   ├── speed-to-lead/
│   │   └── index.html                  ← /solutions/speed-to-lead/
│   ├── document-processing/
│   │   └── index.html                  ← /solutions/document-processing/
│   ├── follow-up-nurture/
│   │   └── index.html                  ← /solutions/follow-up-nurture/
│   ├── database-reactivation/
│   │   └── index.html                  ← /solutions/database-reactivation/
│   └── ai-os/
│       └── index.html                  ← /solutions/ai-os/
│
├── blog/
│   └── index.html                      ← /blog/
│   (add article folders here as:
│    blog/article-slug/index.html)
│
├── about/
│   └── index.html                      ← /about/
│
└── contact/
    └── index.html                      ← /contact/
```

---

## How the nav and footer work

Every page imports `/assets/main.js` at the bottom of `<body>`. This script:
1. Injects the `<nav>` after `<body>` opens
2. Injects the `<footer>` before `</body>`
3. Highlights the current page link using `aria-current="page"` based on `window.location.pathname`
4. Populates the ticker on the homepage (looks for `#ticker-inner`)
5. Powers the blog category pill filter

To add a new nav link, edit the `navLinks` array in `main.js`.

---

## SEO — what's in place

Every page has:
- Unique `<title>` and `<meta name="description">`
- `<link rel="canonical">` pointing to its own URL
- `<meta name="robots" content="index, follow">`
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`)
- Schema.org JSON-LD structured data (relevant type per page)
- Semantic HTML: `<main>`, `<header>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- `aria-label` and `aria-labelledby` throughout
- `aria-current="page"` on active nav link

Also in root:
- `sitemap.xml` — submit this URL to Google Search Console after going live:
  `https://braganda.systems/sitemap.xml`
- `robots.txt` — points to sitemap, allows all crawlers

---

## Contact form

The contact form in `/contact/index.html` is currently a plain HTML form.
To make it functional, either:

**Option A — Netlify Forms (easiest):**
Add `netlify` attribute to the `<form>` tag:
```html
<form method="POST" netlify name="contact" action="/contact/success/">
```
Netlify will detect and handle submissions automatically.

**Option B — Formspree:**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
Sign up at formspree.io, create a form, replace `YOUR_FORM_ID`.

**Option C — Custom backend:**
Point the form `action` at your own API endpoint or serverless function.

---

## Deployment — step by step

### Netlify (recommended — drag and drop)
1. Go to app.netlify.com → "Add new site" → "Deploy manually"
2. Drag the entire project folder onto the drop zone
3. Set custom domain to `braganda.systems` in Site Settings → Domain Management
4. `netlify.toml` handles HTTPS redirect, www redirect, caching, and headers automatically

### GitHub Pages
1. Push this folder to a GitHub repo
2. Go to Settings → Pages → Deploy from branch → `main` → `/` (root)
3. Add `braganda.systems` as a custom domain
4. Enable "Enforce HTTPS"
5. Note: GitHub Pages doesn't support `netlify.toml` — add a `.htaccess` for redirects

### Traditional host (FTP/cPanel)
1. Upload the entire folder to `public_html/`
2. Ensure `.htaccess` is configured for clean URLs (the folder/index.html pattern handles this natively)

---

## Adding blog articles

Create a new folder inside `/blog/` and add an `index.html`:
```
blog/
└── your-article-slug/
    └── index.html
```

Copy the structure from any existing page. Add the new URL to `sitemap.xml`.

Recommended meta for blog posts:
```html
<meta property="og:type" content="article">
<meta property="article:published_time" content="2025-06-01">
<meta property="article:author" content="Braganda Systems">
```

Add `@type: BlogPosting` schema to each article for rich results in Google.

---

## Colour palette (for reference)

| Token          | Hex       | Use                            |
|----------------|-----------|-------------------------------|
| `--orange`     | `#E8501A` | Primary accent, CTAs, badges  |
| `--black`      | `#0A0A0A` | Headlines, dark sections      |
| `--white`      | `#FFFFFF` | Background, reversed text     |
| `--grey-light` | `#F7F5F2` | Alternate section background  |
| `--grey-mid`   | `#E8E5E0` | Borders, dividers             |
| `--grey-text`  | `#6B6B6B` | Body copy on white backgrounds|
| `--grey-label` | `#9A9A9A` | Labels, secondary text        |

**Important:** All text on black/dark backgrounds uses `rgba(255,255,255,0.75)` minimum for readability. Never use `--grey-text` (`#6B6B6B`) on dark backgrounds.

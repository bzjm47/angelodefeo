# Angelo DeFeo II — Remodeling & Handyman (Ventura County)

A clean, mobile-first static website for **Angelo DeFeo II**. No build step required — just drag the folder into Netlify, Vercel (static), or your host.

## Features
- SEO-friendly, fast static site (no framework needed)
- JSON-LD LocalBusiness schema
- Netlify-ready contact form (spam-protected by honeypot)
- Services list (easy to edit)
- Gallery page with simple before/after slider (client-side JS)
- Accessible, responsive design
- Light/dark aware colors and system fonts (no external deps)

## Pages
- `/` — Home (hero, value proposition, featured services, CTA)
- `/services.html` — Detailed services
- `/gallery.html` — Photo gallery + before/after
- `/contact.html` — Contact info + form

## Quick Start
1. **Deploy**: Drag this folder to Netlify or your static host.  
   - Netlify will auto-detect forms. No server code required.
2. **Customize**:
   - Update business info in each HTML file (search for `<!-- TODO: business -->`)
   - Replace `assets/images/gallery/*` with real photos. Keep file sizes under ~300–800 KB.
   - (Optional) Add more before/after pairs by copying the HTML block in `gallery.html`.
3. **Domain & Email**:
   - Point `www.angelodefeo.com` (and apex) to your host.
   - For a custom email (e.g., `hello@angelodefeo.com`), use your registrar or Cloudflare Email Routing (forward to `angelo.defeo90@yahoo.com`) or a mailbox provider (e.g., Zoho Mail). 
4. **Contact form**:
   - Works out of the box on Netlify via `<form netlify ...>`.
   - If you use another host, swap the form `action` to a service like Formspree or Basin.

## Gallery Instructions (Dropbox → local)
- Download selected **before/after** images from Dropbox and place them in `assets/images/gallery/`.
- For each before/after pair, edit the `src` attributes in `gallery.html`.

## Sitemap
`sitemap.xml` and `robots.txt` are included for SEO.

---

© 2025 Angelo DeFeo II. All rights reserved.

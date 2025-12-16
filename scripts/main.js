(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());

  const askInput = $('#askInput');
  const askForm = $('#askForm');
  const result = $('#result');
  const resultQuery = $('#resultQuery');
  const ctaTalk = $('#ctaTalk');

  const galleryGrid = $('#galleryGrid');
  const cards = galleryGrid ? $$('.gcard', galleryGrid) : [];

  function tokenize(q) {
    return q
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function scoreCard(tokens, card) {
    const tags = (card.dataset.tags || '').toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (tags.includes(t)) score += 1;
    }
    return score;
  }

  function applyFilter(query) {
    const tokens = tokenize(query);
    let matches = 0;

    for (const c of cards) {
      if (!tokens.length) {
        c.hidden = false;
        continue;
      }
      const s = scoreCard(tokens, c);
      const show = s > 0;
      c.hidden = !show;
      if (show) matches += 1;
    }

    return matches;
  }

  function showResult(query, matches) {
    if (!result || !resultQuery) return;
    result.hidden = false;
    resultQuery.textContent = query.trim() || '—';

    // Build a mailto link that includes the query as context.
    const subject = encodeURIComponent('Ask Angelo — ' + (query.trim() || 'New request'));
    const body = encodeURIComponent(
      `Hi Angelo,\n\nI need help with: ${query.trim() || '[describe here]'}\n\nLocation (city): \nTimeline: \nBudget range (optional): \n\nPhotos (if any): \n\nThanks!`
    );

    if (ctaTalk) {
      ctaTalk.href = `mailto:ask@angelodefeo.com?subject=${subject}&body=${body}`;
    }

    // If nothing matched, still show the CTA and unhide all cards after a moment so the gallery isn't empty.
    if (matches === 0) {
      // Keep gallery visible but indicate "no exact match" by showing all.
      for (const c of cards) c.hidden = false;
      const sub = $('#resultSub');
      if (sub) sub.textContent = 'No exact match found — showing all projects. Still want to talk?';
    } else {
      const sub = $('#resultSub');
      if (sub) sub.textContent = `Showing ${matches} matching project${matches === 1 ? '' : 's'} for: `;
      if (sub && resultQuery) sub.appendChild(resultQuery);
    }
  }

  // Quick-fill chips
  $$('.chip[data-fill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-fill') || '';
      if (askInput) {
        askInput.value = v;
        askInput.focus();
      }
      const matches = applyFilter(v);
      showResult(v, matches);
    });
  });

  // Gallery filter chips
  $$('.chip[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = (btn.getAttribute('data-filter') || 'all').toLowerCase();
      const q = f === 'all' ? '' : f;
      const matches = applyFilter(q);
      if (q) showResult(q, matches);
      else {
        if (result) result.hidden = true;
      }
    });
  });

  // Search submit
  if (askForm) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (askInput?.value || '').trim();
      const matches = applyFilter(q);
      showResult(q, matches);

      // If we're on a dedicated gallery page, keep the URL in sync.
      if (galleryGrid) {
        const url = new URL(window.location.href);
        if (q) url.searchParams.set('q', q);
        else url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
        return;
      }

      // Single-page fallback: scroll to gallery section if present.
      const gal = document.getElementById('gallery');
      if (gal) gal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // If a query is provided in the URL (e.g., /gallery.html?q=...), auto-run the filter.
  if (askInput && galleryGrid) {
    const url = new URL(window.location.href);
    const q = (url.searchParams.get('q') || '').trim();
    if (q) {
      askInput.value = q;
      const matches = applyFilter(q);
      showResult(q, matches);
    }
  }


  // Contact form: if Netlify Forms is enabled, allow normal POST submission.
// Otherwise fall back to opening the user's email client (mailto).
const contactForm = $('#contactForm');
if (contactForm) {
  const usesNetlify = contactForm.hasAttribute('data-netlify');
  if (!usesNetlify) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get('name') || '').trim();
      const city = String(fd.get('city') || '').trim();
      const reply = String(fd.get('reply') || '').trim();
      const msg = String(fd.get('message') || '').trim();

      const subject = encodeURIComponent(`Ask Angelo — ${city || 'Ventura County'} request`);
      const body = encodeURIComponent(
        `Hi Angelo,

Name: ${name}
City: ${city}
Best contact: ${reply}

Details:
${msg}

(Attach photos if you have them.)
`
      );

      window.location.href = `mailto:ask@angelodefeo.com?subject=${subject}&body=${body}`;
    });
  }
}
})();

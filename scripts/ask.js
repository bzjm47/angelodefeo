(function () {
  const form = document.getElementById('askForm');
  const input = document.getElementById('askInput');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const cards = Array.from(document.querySelectorAll('.gcard'));
  const actions = document.getElementById('actions');
  const actionsTitle = document.getElementById('actionsTitle');
  const actionsSub = document.getElementById('actionsSub');
  const viewMatchesBtn = document.getElementById('viewMatchesBtn');
  const talkBtn = document.getElementById('talkBtn');
  const noResults = document.getElementById('noResults');
  const year = document.getElementById('year');

  if (year) year.textContent = String(new Date().getFullYear());

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[^\w\s/+-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function scoreCard(q, tagString) {
    const qn = normalize(q);
    const tags = normalize(tagString);
    if (!qn) return 1;

    // Simple matching: exact word or partial match
    const words = qn.split(' ').filter(Boolean);
    let hits = 0;
    for (const w of words) {
      if (tags.includes(w)) hits += 1;
    }
    // bonus for phrase hits
    if (tags.includes(qn)) hits += 2;
    return hits;
  }

  function applyQuery(q) {
    const query = (q || '').trim();
    input.value = query;

    // Filter cards
    let shown = 0;
    for (const card of cards) {
      const tags = card.getAttribute('data-tags') || '';
      const hits = scoreCard(query, tags);
      const show = query ? hits > 0 : true;
      card.style.display = show ? '' : 'none';
      if (show) shown += 1;
    }

    // Actions UI + mailto
    if (query) {
      actions.hidden = false;
      actionsTitle.textContent = shown ? `Matches for “${query}”` : `No matches for “${query}”`;
      actionsSub.textContent = shown
        ? `Showing ${shown} gallery item${shown === 1 ? '' : 's'} that look related.`
        : `Not seeing it in the gallery yet — send the request and we’ll talk it through.`;

      const subject = encodeURIComponent(`Ask Angelo — ${query}`);
      const body = encodeURIComponent(
        `Hi Angelo,\n\nI need help with: ${query}\n\nCity:\nTimeline:\nPhotos/notes:\n\nSent from angelodefeo.com`
      );
      talkBtn.href = `mailto:ask@angelodefeo.com?subject=${subject}&body=${body}`;

      noResults.hidden = shown !== 0;
    } else {
      actions.hidden = true;
      noResults.hidden = true;
      for (const card of cards) card.style.display = '';
    }
  }

  // submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      applyQuery(input.value);
    });
  }

  // chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      applyQuery(chip.dataset.q || chip.textContent || '');
      input.focus();
    });
  });

  // view matches
  if (viewMatchesBtn) {
    viewMatchesBtn.addEventListener('click', () => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // allow query via URL ?q=
  const params = new URLSearchParams(window.location.search);
  const q0 = params.get('q');
  if (q0) applyQuery(q0);
})();

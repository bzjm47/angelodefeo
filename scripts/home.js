(() => {
  const form = document.getElementById('askForm');
  const input = document.getElementById('askInput');
  const chips = Array.from(document.querySelectorAll('.chip'));

  function go(q){
    const query = (q ?? input?.value ?? '').trim();
    if (!query) return;
    const url = `/gallery.html?q=${encodeURIComponent(query)}`;
    window.location.href = url;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      go();
    });
  }

  chips.forEach((c) => {
    c.addEventListener('click', () => {
      const q = c.getAttribute('data-q') || c.textContent || '';
      if (input) input.value = q;
      go(q);
    });
  });
})();
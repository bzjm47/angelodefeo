/**
 * Gallery Loader
 * - Loads /assets/gallery/manifest.json
 * - Renders cards into #galleryGrid
 * - Filters based on:
 *    - query string ?q=
 *    - search input value (if present)
 * - "Let's talk about it" should route to contact.html with prefilled q
 */

(function () {
  const grid = document.getElementById("galleryGrid");
  const statusEl = document.getElementById("galleryStatus");

  if (!grid) return;

  const qs = new URLSearchParams(window.location.search);
  const initialQ = (qs.get("q") || "").trim();

  // Try to find a search input on the page
  const searchInput =
    document.querySelector('input[type="search"]') ||
    document.getElementById("gallerySearch") ||
    document.getElementById("searchInput");

  if (searchInput && initialQ) {
    searchInput.value = initialQ;
  }

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchesQuery(item, qNorm) {
    if (!qNorm) return true;

    const hay = normalize(
      [
        item.category,
        item.filename,
        ...(item.tags || []),
      ].join(" ")
    );

    // Basic token match: all tokens must appear
    const tokens = qNorm.split(" ").filter(Boolean);
    return tokens.every(t => hay.includes(t));
  }

  function cardHTML(item) {
    const imgSrc = new URL(`assets/gallery/${item.category}/${item.filename}`, window.location.href).toString();
    const tags = (item.tags || []).filter(Boolean);

    // Make a nicer label
    const niceCategory = item.category === "kitchen" ? "Kitchen Remodel" :
                         item.category === "bathroom" ? "Bathroom Remodel" :
                         (item.category || "Project");

    const tagLine = tags
      .filter(t => t !== item.category) // avoid duplicating category tag
      .slice(0, 6)
      .map(t => `<span class="pill">${t.replace(/-/g, " ")}</span>`)
      .join("");

    return `
      <article class="gcard" data-tags="${tags.join(" ")}" data-category="${item.category}">
        <img class="gimg" src="${imgSrc}" alt="${niceCategory}">
        <div class="gmeta">
          <div class="gtitle">${niceCategory}</div>
          <div class="gpills">${tagLine}</div>
        </div>
      </article>
    `;
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text || "";
  }

  async function loadManifest() {
    try {
      const res = await fetch(new URL("assets/gallery/manifest.json", window.location.href).toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load manifest (${res.status})`);
      return await res.json();
    } catch (e) {
      console.error(e);
      setStatus("Could not load gallery items.");
      return null;
    }
  }

  function render(items, qNorm) {
    const filtered = items.filter(it => matchesQuery(it, qNorm));
    grid.innerHTML = filtered.map(cardHTML).join("");

    // Update status + helper buttons area if present
    if (qNorm) {
      setStatus(`${filtered.length} result(s) for “${qNorm}”`);
      // If page has a "Let's talk" button, repoint it to contact page
      const talkBtn = document.querySelector('[data-action="talk"], #talkBtn, a.talkBtn');
      if (talkBtn) {
        talkBtn.setAttribute("href", `contact.html?q=${encodeURIComponent(qNorm)}`);
      }
    } else {
      setStatus(`${filtered.length} photo(s)`);
    }
  }

  function wireSearch(items) {
    if (!searchInput) return;

    let t = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const qNorm = normalize(searchInput.value);
        render(items, qNorm);

        // Keep URL in sync without reloading
        const url = new URL(window.location.href);
        if (qNorm) url.searchParams.set("q", qNorm);
        else url.searchParams.delete("q");
        window.history.replaceState({}, "", url);
      }, 120);
    });
  }

  (async function init() {
    const manifest = await loadManifest();
    if (!manifest || !manifest.items) return;

    // Items in manifest are already normalized categories: kitchen/bathroom
    const items = manifest.items.map(it => ({
      category: it.category,
      filename: it.filename,
      tags: it.tags || []
    }));

    const qNorm = normalize(initialQ);
    render(items, qNorm);
    wireSearch(items);

    // Also fix "Let's talk about it" button on this page if it exists.
    const talkBtn = document.querySelector('#talkBtn, a.talkBtn');
    if (talkBtn) {
      const q = qNorm || "";
      talkBtn.setAttribute("href", `contact.html${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    }

  })();
})();

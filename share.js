
(() => {
  document.querySelectorAll("[data-share]").forEach(b => b.addEventListener("click", async ev => {
    ev.preventDefault();
    const url = b.dataset.url || location.href, title = b.dataset.title || document.title;
    if (navigator.share) { try { await navigator.share({title, url}); return; } catch (e) { if (e.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(url); b.textContent = "Link copied"; } catch (e) { prompt("Copy this link:", url); }
  }));
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async ev => {
    ev.preventDefault();
    const url = b.dataset.url || location.href;
    try { await navigator.clipboard.writeText(url); b.textContent = "Copied"; } catch (e) { prompt("Copy this link:", url); }
  }));
})();

(() => {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  if (!total) return;

  const currentEl = document.getElementById("slide-current");
  const totalEl = document.getElementById("slide-total");
  const progressEl = document.getElementById("progress-bar");
  const edgePrev = document.getElementById("edge-prev");
  const edgeNext = document.getElementById("edge-next");

  if (totalEl) totalEl.textContent = String(total);

  const clamp = (n) => Math.min(total - 1, Math.max(0, n));

  const parseHash = () => {
    const m = /^#\/(\d+)$/.exec(window.location.hash);
    if (!m) return 0;
    return clamp(parseInt(m[1], 10) - 1);
  };

  let index = parseHash();

  const render = () => {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    if (currentEl) currentEl.textContent = String(index + 1);
    if (progressEl) {
      const pct = total === 1 ? 100 : (index / (total - 1)) * 100;
      progressEl.style.width = `${pct}%`;
    }
    const hash = `#/${index + 1}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, "", hash);
    }
    document.title = `(${index + 1}/${total}) Idea → Prototype`;
  };

  const go = (n) => {
    const next = clamp(n);
    if (next === index) return;
    index = next;
    render();
  };

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  // Keyboard
  document.addEventListener("keydown", (e) => {
    // Don't intercept while typing in form controls (none today, but safe)
    if (e.target instanceof HTMLElement && e.target.matches("input, textarea, [contenteditable]")) {
      return;
    }
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "PageUp":
      case "Backspace":
        e.preventDefault();
        prev();
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(total - 1);
        break;
      case "f":
      case "F":
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          document.documentElement.requestFullscreen?.();
        }
        break;
      default:
        // numeric quick-jump 1..9
        if (/^[1-9]$/.test(e.key)) {
          go(parseInt(e.key, 10) - 1);
        }
    }
  });

  // Edge click zones
  edgePrev?.addEventListener("click", prev);
  edgeNext?.addEventListener("click", next);

  // Touch swipe
  let touchStartX = null;
  let touchStartY = null;
  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchend",
    (e) => {
      if (touchStartX === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      touchStartX = touchStartY = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true },
  );

  // Hash routing (deep links / back-forward nav)
  window.addEventListener("hashchange", () => {
    const want = parseHash();
    if (want !== index) {
      index = want;
      render();
    }
  });

  render();
})();

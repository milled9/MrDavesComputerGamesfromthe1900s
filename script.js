const CATEGORY_LABELS = {
  math: "Math",
  reading: "Reading & Typing",
  adventure: "Adventure",
  logic: "Logic & Puzzles",
  science: "Science",
  early: "Early Learning",
  sim: "City & Sim"
};

const grid = document.getElementById("grid");
const tabsEl = document.getElementById("tabs");
const modal = document.getElementById("modal");
const modalScreen = document.getElementById("modal-screen");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");
const modalFullscreen = document.getElementById("modal-fullscreen");
let activeCategory = "all";

function embedUrl(archiveId) {
  return `https://archive.org/embed/${archiveId}`;
}

function thumbnailUrl(game) {
  return game.thumbnail || `https://archive.org/services/img/${game.archiveId}`;
}

function renderTabs() {
  const categories = ["all", ...new Set(GAMES.map(g => g.category))];
  tabsEl.innerHTML = categories.map(cat => {
    const label = cat === "all" ? "All Games" : CATEGORY_LABELS[cat] || cat;
    const active = cat === activeCategory ? "is-active" : "";
    return `<button class="tab ${active}" data-cat="${cat}">${label}</button>`;
  }).join("");

  tabsEl.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderTabs();
      renderGrid();
    });
  });
}

function renderGrid() {
  const visible = GAMES.filter(g => activeCategory === "all" || g.category === activeCategory);

  grid.innerHTML = visible.map((g, i) => `
    <div class="card" data-category="${g.category}">
      <button class="thumb" data-id="${i}" aria-label="${g.external ? 'Open ' + g.title + ' (opens in a new tab)' : 'Play ' + g.title}">
        ${g.thumbnail || g.archiveId
          ? `<img src="${thumbnailUrl(g)}" alt="${g.title} thumbnail" loading="lazy">`
          : `<span class="thumb__placeholder" aria-hidden="true">\u2328\ufe0f</span>`}
        <span class="thumb__play">${g.external ? "\u2197 Open" : "\u25b6 Play"}</span>
        ${g.external ? `<span class="thumb__badge">Opens in new tab</span>` : ""}
      </button>
      <div class="card__label">${CATEGORY_LABELS[g.category] || g.category}</div>
      <div class="card__body">
        <h3>${g.title}</h3>
        <p>${g.blurb}</p>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".thumb").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const game = visible[i];
      if (game.external) {
        window.open(game.url, "_blank", "noopener");
      } else {
        openGame(game);
      }
    });
  });
}

// archive.org's DOS emulator is designed for a fixed 640x480 window.
// We keep the iframe at that native size and scale + center it with a
// CSS transform, rather than resizing the iframe itself, so the emulator
// always renders the way it's meant to instead of mis-centering itself.
const NATIVE_W = 640;
const NATIVE_H = 480;

function fitScreen() {
  const iframe = modalScreen.querySelector("iframe");
  if (!iframe) return;
  const rect = modalScreen.getBoundingClientRect();
  const scale = Math.min(rect.width / NATIVE_W, rect.height / NATIVE_H);
  const offsetX = (rect.width - NATIVE_W * scale) / 2;
  const offsetY = (rect.height - NATIVE_H * scale) / 2;
  iframe.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

const screenObserver = new ResizeObserver(fitScreen);

function openGame(game) {
  modalTitle.textContent = game.title;
  modalScreen.innerHTML = `<iframe src="${embedUrl(game.archiveId)}" allowfullscreen title="${game.title}"></iframe>`;
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
  screenObserver.observe(modalScreen);
  requestAnimationFrame(fitScreen);
}

function closeGame() {
  modal.classList.remove("is-open");
  modalScreen.innerHTML = "";
  document.body.style.overflow = "";
  screenObserver.unobserve(modalScreen);
}

document.addEventListener("fullscreenchange", () => requestAnimationFrame(fitScreen));

modalClose.addEventListener("click", closeGame);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeGame();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeGame();
});

modalFullscreen.addEventListener("click", () => {
  const box = document.getElementById("modal-box");
  if (!document.fullscreenElement) {
    box.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});

renderTabs();
renderGrid();

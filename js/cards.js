/* Level cards — shared by the home page and the world map page. */
(function () {
  "use strict";
  const B = window.Bitwood;

  function starsHTML(n) {
    let s = '<span class="stars" aria-label="' + n + ' of 3 stars">';
    for (let i = 0; i < 3; i++) s += '<img alt="" class="pixelated' + (i < n ? "" : " off") + '" src="' + B.spriteURL("star", 2) + '">';
    return s + "</span>";
  }

  function renderLevelCards(container) {
    const levels = window.BITWOOD_LEVELS;
    const data = B.Store.get();
    container.innerHTML = "";
    levels.forEach((lv, i) => {
      const unlocked = B.Store.isUnlocked(lv.id);
      const done = data.done[lv.id];
      const a = document.createElement(unlocked ? "a" : "div");
      a.className = "level-card" + (unlocked ? "" : " is-locked");
      a.style.setProperty("--c", lv.color);
      a.setAttribute("data-reveal", "");
      a.style.setProperty("--d", i * 80 + "ms");
      if (unlocked) a.href = "level.html?id=" + lv.id;
      else a.setAttribute("aria-label", "Level " + lv.id + " " + lv.name + " (locked)");
      a.innerHTML =
        '<canvas class="thumb" aria-hidden="true"></canvas>' +
        (unlocked ? "" : '<img class="lock-ico pixelated" alt="" src="' + B.spriteURL("lock", 3) + '">') +
        '<div class="body">' +
        '<span class="lv">Level ' + lv.id + " · " + B.escapeHTML(lv.topic) + "</span>" +
        "<h3>" + B.escapeHTML(lv.name) + "</h3>" +
        "<p>" + B.escapeHTML(lv.blurb) + "</p>" +
        '<div class="tags">' +
        (done ? '<span class="tag done">Cleared</span>' + starsHTML(done.stars) : unlocked ? '<span class="tag">+' + lv.xp + " XP</span>" : '<span class="tag lock">Locked</span>') +
        "</div></div>";
      container.appendChild(a);
      const cv = a.querySelector("canvas");
      new B.PixelScene(cv, { theme: lv.theme, pixel: 2, animate: false, entities: false, hero: true, heroFrac: 0.12, seed: lv.id * 3 }).renderStill(1 + lv.id);
    });
    B.initReveal(container);
  }

  B.renderLevelCards = renderLevelCards;
  B.starsHTML = starsHTML;
})();

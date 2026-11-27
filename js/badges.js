/* Badges page: the full badge collection, earned and still locked. */
(function () {
  "use strict";
  const B = window.Bitwood;

  function render() {
    const grid = document.getElementById("badge-grid");
    const earned = B.Store.get().badges;
    const got = B.BADGES.filter(b => earned[b.id]).length;
    document.getElementById("badge-count").textContent = got + " / " + B.BADGES.length;
    document.getElementById("badge-fill").style.setProperty("--p", (got / B.BADGES.length).toFixed(3));
    grid.innerHTML = "";
    B.BADGES.forEach((b, i) => {
      const at = earned[b.id];
      const card = document.createElement("article");
      card.className = "pixel-box badge" + (at ? " is-earned" : " is-locked");
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--d", (i % 4) * 70 + "ms");
      card.innerHTML =
        '<div class="badge-icon"><img class="pixelated" alt="" src="' + B.spriteURL(b.icon, 6) + '">' +
        (at ? "" : '<img class="badge-lock pixelated" alt="" src="' + B.spriteURL("lock", 3) + '">') + "</div>" +
        "<h3>" + B.escapeHTML(b.name) + "</h3>" +
        "<p>" + B.escapeHTML(b.desc) + "</p>" +
        (at ? '<span class="tag done">Earned ' + new Date(at).toLocaleDateString() + "</span>" : '<span class="tag lock">Locked</span>');
      card.setAttribute("aria-label", b.name + (at ? ", earned" : ", locked") + ". " + b.desc);
      grid.appendChild(card);
    });
    B.initReveal(grid);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // award anything already deserved before drawing the grid
    B.checkBadges();
    render();
  });
})();

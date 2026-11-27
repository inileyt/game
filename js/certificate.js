/* Certificate: after all 10 levels, type your name and download a pixel-art certificate (PNG). */
(function () {
  "use strict";
  const B = window.Bitwood;
  const params = new URLSearchParams(location.search);
  const TRACK = B.Tracks.byId(params.get("track") || "js");
  const LEVELS = B.Tracks.levels(TRACK.id);
  const $ = id => document.getElementById(id);
  const W = 1600, H = 1130;

  function stats() {
    const d = B.Store.get();
    const done = LEVELS.filter(l => d.done[l.id]);
    const stars = done.reduce((s, l) => s + (d.done[l.id].stars || 0), 0);
    const finished = done.length ? Math.max(...done.map(l => d.done[l.id].at || 0)) : Date.now();
    const xp = done.reduce((s, l) => s + l.xp, 0);
    return { done: done.length, stars, xp, finished };
  }

  function drawSprite(g, name, x, y, scale) {
    const s = B.sprite(name);
    g.drawImage(s, x, y, s.width * scale, s.height * scale);
  }

  function centerText(g, text, y, font, color, shadow) {
    g.font = font;
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    if (shadow) { g.fillStyle = shadow; g.fillText(text, W / 2 + 5, y + 5); }
    g.fillStyle = color;
    g.fillText(text, W / 2, y);
  }

  function fitFont(g, text, weight, family, maxSize, maxWidth) {
    let size = maxSize;
    do { g.font = weight + " " + size + "px " + family; size -= 2; } while (g.measureText(text).width > maxWidth && size > 20);
    return g.font;
  }

  function draw(canvas, name) {
    const g = canvas.getContext("2d");
    canvas.width = W; canvas.height = H;
    g.imageSmoothingEnabled = false;
    const st = stats();

    // background + pixel-scene strip at the bottom
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0f3d"); bg.addColorStop(1, "#020617");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 140; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * W, y = (Math.sin(i * 78.233) * 12543.123 % 1 + 1) % 1 * H * 0.7;
      g.fillStyle = i % 7 ? "#c7d2fe" : "#fde047";
      g.fillRect(Math.round(x / 4) * 4, Math.round(y / 4) * 4, 4, 4);
    }
    const strip = document.createElement("canvas");
    strip.width = 400; strip.height = 70;
    new B.PixelScene(strip, { theme: "dawn", pixel: 1, animate: false, entities: false, hero: true, heroFrac: 0.47, seed: 7 }).renderStill(3);
    g.drawImage(strip, 0, H - 280, W, 280);
    const fade = g.createLinearGradient(0, H - 300, 0, H - 120);
    fade.addColorStop(0, "#020617"); fade.addColorStop(1, "rgba(2,6,23,0)");
    g.fillStyle = fade; g.fillRect(0, H - 300, W, 200);

    // stepped pixel frame
    const frame = [["#facc15", 24], ["#042d4d", 36], ["#ca8a04", 44]];
    frame.forEach(([c, inset]) => {
      g.fillStyle = c;
      g.fillRect(inset, inset, W - inset * 2, 8); g.fillRect(inset, H - inset - 8, W - inset * 2, 8);
      g.fillRect(inset, inset, 8, H - inset * 2); g.fillRect(W - inset - 8, inset, 8, H - inset * 2);
    });
    [[60, 60], [W - 60 - 66, 60], [60, H - 60 - 60], [W - 60 - 66, H - 60 - 60]].forEach(([x, y]) => drawSprite(g, "star", x, y, 6));

    // text
    drawSprite(g, "crown", W / 2 - 60, 92, 12);
    centerText(g, "CERTIFICATE", 290, "700 92px Silkscreen, monospace", "#facc15", "#042d4d");
    centerText(g, TRACK.name.toUpperCase() + " · OF COMPLETION", 350, "700 36px Silkscreen, monospace", "#f8fafc");
    centerText(g, "This certifies that", 450, "500 32px Mulish, sans-serif", "#cbd5e1");
    const font = fitFont(g, name, "700", "Silkscreen, monospace", 88, W - 300);
    centerText(g, name, 560, font, "#ffffff", "#042d4d");
    g.fillStyle = "#facc15"; g.fillRect(W / 2 - 420, 590, 840, 6);
    centerText(g, "has conquered all " + LEVELS.length + " " + TRACK.name + " worlds of Bitwood — the pixel coding adventure —", 660, "500 30px Mulish, sans-serif", "#e2e8f0");
    centerText(g, "and learned " + TRACK.topics + ".", 705, "500 30px Mulish, sans-serif", "#e2e8f0");
    centerText(g, "★ " + st.stars + " / " + LEVELS.length * 3 + " stars     ·     " + st.xp + " XP     ·     " + new Date(st.finished).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), 785, "700 30px Silkscreen, monospace", "#a3e635");

    // signature
    g.textAlign = "left";
    g.fillStyle = "rgba(2,6,23,.75)"; g.fillRect(W - 560, H - 250, 420, 130);
    g.font = "italic 600 40px Mulish, sans-serif"; g.fillStyle = "#ffffff"; g.fillText("Inna Babajanyan", W - 530, H - 185);
    g.fillStyle = "#facc15"; g.fillRect(W - 530, H - 170, 360, 4);
    g.font = "700 22px Silkscreen, monospace"; g.fillStyle = "#cbd5e1"; g.fillText("FOUNDER, BITWOOD", W - 530, H - 135);
    drawSprite(g, "trophy", 150, H - 260, 12);
  }

  function renderTabs() {
    const wrap = $("cert-tabs");
    if (!wrap) return;
    wrap.innerHTML = B.Tracks.list.map(t => {
      const ls = B.Tracks.levels(t.id), done = ls.filter(l => B.Store.isDone(l.id)).length;
      return '<a class="track-tab' + (t.id === TRACK.id ? " is-active" : "") + '" href="certificate.html?track=' + t.id + '"' + (t.id === TRACK.id ? ' aria-current="page"' : "") +
        ' style="--c:' + t.color + '"><img class="pixelated" alt="" src="' + B.spriteURL(t.icon, 3) + '"><span><b>' + B.escapeHTML(t.name) + "</b><small>" + (done === ls.length ? "Unlocked ✓" : done + " / " + ls.length + " levels") + "</small></span></a>";
    }).join("");
  }

  async function init() {
    renderTabs();
    document.title = TRACK.name + " Certificate — Bitwood";
    const st = stats();
    const locked = st.done < LEVELS.length;
    $("cert-locked").hidden = !locked;
    $("cert-open").hidden = locked;
    if (locked) {
      $("cert-progress").textContent = st.done + " / " + LEVELS.length;
      $("cert-fill").style.setProperty("--p", (st.done / LEVELS.length).toFixed(3));
      const next = LEVELS.find(l => !B.Store.isDone(l.id));
      const btn = $("cert-continue");
      btn.href = "level.html?id=" + next.id;
      btn.querySelector(".t-label").textContent = "Play level " + next.id;
      return;
    }
    try { await Promise.all([document.fonts.load("700 40px Silkscreen"), document.fonts.load("500 30px Mulish"), document.fonts.load("italic 600 40px Mulish")]); } catch (e) { /* fall back to system fonts */ }
    const canvas = $("cert-canvas"), input = $("cert-name"), err = $("cert-error");
    const savedName = B.Store.get().stats.certName;
    input.value = typeof savedName === "string" ? savedName : "";
    const clean = () => input.value.replace(/\s+/g, " ").trim().slice(0, 32);
    const redraw = () => draw(canvas, clean() || "Your Name");
    redraw();
    input.addEventListener("input", () => { err.hidden = true; input.removeAttribute("aria-invalid"); redraw(); });
    $("cert-form").addEventListener("submit", e => {
      e.preventDefault();
      const name = clean();
      if (!name) { err.hidden = false; input.setAttribute("aria-invalid", "true"); input.focus(); return; }
      draw(canvas, name);
      B.Store.update(d => { d.stats.certName = name; d.stats.certificates = (d.stats.certificates || 0) + 1; });
      const a = document.createElement("a");
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      a.download = "bitwood-" + TRACK.id + "-certificate-" + (slug || "player") + ".png";
      a.href = canvas.toDataURL("image/png");
      document.body.appendChild(a); a.click(); a.remove();
      if (B.Sound) B.Sound.play("win");
      B.confetti(window.innerWidth / 2, window.innerHeight / 3, 160);
      B.checkBadges();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

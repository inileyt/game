/* World map page: animated pixel island with 10 level nodes. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const LEVELS = window.BITWOOD_LEVELS;
  const MW = 192, MH = 108;
  const NODES = [[18, 72], [34, 40], [52, 70], [70, 38], [88, 68], [106, 36], [124, 66], [142, 36], [158, 68], [175, 38]];
  const RADII = NODES.map(() => 19);
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const h2 = (x, y) => hash(x * 57.13 + y * 113.7);
  const noise = (x, y) => (Math.sin(x * 0.21 + y * 0.13) + Math.sin(x * 0.07 - y * 0.29 + 2) + Math.sin(y * 0.17 + 1)) / 6 + 0.5;

  function landInfo(x, y) {
    let best = 9, idx = 0, nearest = 9e9;
    NODES.forEach(([nx, ny], i) => {
      const d = Math.hypot(x - nx, (y - ny) * 1.15) / RADII[i];
      if (d < best) best = d;
      const dn = Math.hypot(x - nx, y - ny);
      if (dn < nearest) { nearest = dn; idx = i; }
    });
    return { v: best + (noise(x, y) - 0.5) * 0.45, biome: idx };
  }

  function buildBase() {
    const c = document.createElement("canvas");
    c.width = MW; c.height = MH;
    const g = c.getContext("2d");
    const px = (x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
    const info = [];
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const li = landInfo(x, y);
      info.push(li);
      const n = h2(x, y);
      if (li.v >= 1.12) px(x, y, (x + y) % 2 && n > 0.5 ? "#0c4a6e" : "#0b3f60");
      else if (li.v >= 1.0) px(x, y, n > 0.5 ? "#0e7490" : "#0f6b85");         // shallow water
      else if (li.v >= 0.9) px(x, y, n > 0.6 ? "#fde68a" : "#fcd34d");          // sand
      else {
        const b = li.biome;
        const pal = [["#4ade80", "#22c55e"], ["#15803d", "#166534"], ["#64748b", "#475569"], ["#2dd4bf", "#14b8a6"], ["#7c3aed", "#6d28d9"],
          ["#fbbf24", "#f59e0b"], ["#e2e8f0", "#cbd5e1"], ["#4d7c0f", "#3f6212"], ["#44403c", "#292524"], ["#1e1b4b", "#312e81"]][b];
        px(x, y, n > 0.7 ? pal[1] : pal[0]);
      }
    }
    const at = (x, y) => info[y * MW + x];
    // decorations
    for (let y = 2; y < MH - 4; y += 1) for (let x = 2; x < MW - 4; x += 1) {
      const li = at(x, y); if (li.v > 0.8) continue;
      const n = h2(x * 3, y * 7);
      if (li.biome === 1 && n > 0.93) { // pine trees
        g.fillStyle = "#052e16"; g.fillRect(x, y + 3, 1, 1);
        g.fillStyle = "#14532d"; g.fillRect(x - 1, y + 1, 3, 2); g.fillRect(x, y, 1, 1);
        g.fillStyle = "#22c55e"; g.fillRect(x - 1, y + 1, 1, 1);
      } else if (li.biome === 0 && n > 0.985) { // houses
        g.fillStyle = "#f5e6c8"; g.fillRect(x, y + 1, 4, 3);
        g.fillStyle = ["#ef4444", "#2563eb", "#f97316"][(n * 1000 | 0) % 3]; g.fillRect(x - 1, y, 6, 1); g.fillRect(x, y - 1, 4, 1);
        g.fillStyle = "#6b3e26"; g.fillRect(x + 1, y + 2, 1, 2);
      } else if (li.biome === 0 && n > 0.95) { // flowers
        g.fillStyle = n > 0.97 ? "#f472b6" : "#fde047"; g.fillRect(x, y, 1, 1);
      } else if (li.biome === 2 && n > 0.955) { // mountains
        for (let r = 0; r < 5; r++) { g.fillStyle = r < 2 ? "#e2e8f0" : (r % 2 ? "#334155" : "#475569"); g.fillRect(x - r, y + r, r * 2 + 1, 1); }
      } else if (li.biome === 2 && n > 0.94) {
        g.fillStyle = "#22d3ee"; g.fillRect(x, y, 1, 2); g.fillStyle = "#a5f3fc"; g.fillRect(x, y, 1, 1);
      } else if (li.biome === 4 && n > 0.96) {
        g.fillStyle = "#2e1065"; g.fillRect(x, y, 2, 2); g.fillStyle = "#a78bfa"; g.fillRect(x, y, 1, 1);
      } else if (li.biome === 5 && n > 0.96) { // cactus
        g.fillStyle = "#3f6212"; g.fillRect(x, y, 1, 4); g.fillRect(x - 1, y + 1, 1, 1); g.fillRect(x + 1, y + 2, 1, 1);
      } else if (li.biome === 6 && n > 0.95) { // snowy pines
        g.fillStyle = "#1e4d3a"; g.fillRect(x - 1, y + 1, 3, 2); g.fillRect(x, y + 3, 1, 1);
        g.fillStyle = "#ffffff"; g.fillRect(x, y, 1, 1); g.fillRect(x - 1, y + 1, 1, 1);
      } else if (li.biome === 7 && n > 0.93) { // swamp puddles + reeds
        if (n > 0.97) { g.fillStyle = "#365314"; g.fillRect(x, y, 1, 3); g.fillStyle = "#a16207"; g.fillRect(x, y, 1, 1); }
        else { g.fillStyle = "#14532d"; g.fillRect(x - 1, y, 3, 1); }
      } else if (li.biome === 8 && n > 0.94) { // lava cracks
        g.fillStyle = n > 0.975 ? "#fde047" : "#f97316"; g.fillRect(x, y, 2, 1);
      } else if (li.biome === 9 && n > 0.92) { // stars on the void island
        g.fillStyle = n > 0.97 ? "#ffffff" : "#a5b4fc"; g.fillRect(x, y, 1, 1);
      }
    }
    // village plaza + castle at the node
    drawCastle(g, NODES[4][0] - 6, NODES[4][1] - 22);
    drawVolcano(g, NODES[8][0] - 1, NODES[8][1] - 20);
    drawCitadel(g, NODES[9][0] - 4, NODES[9][1] - 24);
    return c;
  }

  function drawCastle(g, x, y) {
    g.fillStyle = "#1e1b4b";
    g.fillRect(x, y + 6, 13, 9); g.fillRect(x - 2, y + 2, 4, 13); g.fillRect(x + 11, y + 2, 4, 13); g.fillRect(x + 5, y, 3, 6);
    g.fillStyle = "#312e81";
    g.fillRect(x + 1, y + 7, 11, 7);
    g.fillStyle = "#fde047";
    g.fillRect(x - 1, y + 5, 1, 1); g.fillRect(x + 12, y + 5, 1, 1); g.fillRect(x + 6, y + 2, 1, 1);
    g.fillStyle = "#0b1020"; g.fillRect(x + 5, y + 10, 3, 5);
  }

  function drawVolcano(g, x, y) {
    for (let r = 0; r < 10; r++) { g.fillStyle = r % 3 === 0 ? "#57534e" : "#44403c"; g.fillRect(x - 2 - r, y + 3 + r, 5 + r * 2, 1); }
    g.fillStyle = "#f97316"; g.fillRect(x - 1, y + 3, 3, 1); g.fillRect(x, y + 4, 1, 3);
    g.fillStyle = "#fde047"; g.fillRect(x, y + 3, 1, 1);
  }

  function drawCitadel(g, x, y) {
    g.fillStyle = "#312e81"; g.fillRect(x, y + 6, 9, 12); g.fillRect(x + 2, y, 5, 6); g.fillRect(x + 3, y - 4, 3, 4);
    g.fillStyle = "#4338ca"; g.fillRect(x + 1, y + 7, 2, 10);
    g.fillStyle = "#fde047"; g.fillRect(x + 4, y + 2, 1, 2); g.fillRect(x + 2, y + 9, 1, 1); g.fillRect(x + 6, y + 9, 1, 1); g.fillRect(x + 4, y + 13, 1, 1);
    g.fillStyle = "#0b1020"; g.fillRect(x + 3, y + 15, 3, 3);
  }

  function linePixels(a, b) {
    const pts = []; let [x0, y0] = a; const [x1, y1] = b;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      pts.push([x0, y0]);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
    return pts;
  }

  function initMap() {
    const canvas = document.getElementById("map");
    if (!canvas) return;
    canvas.width = MW; canvas.height = MH;
    const ctx = canvas.getContext("2d");
    const base = buildBase();
    const paths = [];
    for (let i = 0; i < NODES.length - 1; i++) paths.push(linePixels(NODES[i], NODES[i + 1]));
    const clouds = [0, 1, 2, 3].map(i => ({ x: hash(i) * MW, y: 6 + hash(i + 9) * (MH - 20), w: 12 + hash(i + 3) * 14, v: 2 + hash(i + 5) * 3 }));
    const waves = [];
    for (let i = 0; i < 70; i++) waves.push({ x: hash(i * 2.3) * MW, y: hash(i * 5.1) * MH, p: hash(i) * 6 });
    let t = 0, last = 0, running = false;

    function draw() {
      ctx.drawImage(base, 0, 0);
      // wave glints
      for (const w of waves) {
        const x = Math.floor((w.x + t * 3) % MW), y = Math.floor(w.y);
        const li = landInfo(x, y);
        if (li.v < 1.05) continue;
        if (Math.sin(t * 2 + w.p) > 0.2) { ctx.fillStyle = "#38bdf8"; ctx.fillRect(x, y, 2, 1); }
      }
      // paths
      paths.forEach((pts, i) => {
        const unlocked = B.Store.isUnlocked(i + 2);
        pts.forEach(([x, y], k) => {
          if ((k + (unlocked ? Math.floor(t * 6) : 0)) % 3 === 0) {
            ctx.fillStyle = "#0b1020"; ctx.fillRect(x, y + 1, 1, 1);
            ctx.fillStyle = unlocked ? "#fef3c7" : "#64748b"; ctx.fillRect(x, y, 1, 1);
          }
        });
      });
      // castle flag
      const [cx, cy] = NODES[4];
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(cx + 0, cy - 27, 1, 5);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(cx + 1, cy - 27 + (Math.floor(t * 4) % 2), 3, 2);
      // volcano smoke
      const [vx, vy] = NODES[8];
      for (let i = 0; i < 3; i++) {
        const k = (t * 0.8 + i / 3) % 1;
        ctx.fillStyle = "rgba(168,162,158," + (0.7 - k * 0.7).toFixed(2) + ")";
        ctx.fillRect(Math.round(vx + Math.sin(k * 6 + i) * 2), Math.round(vy - 18 - k * 10), 2, 2);
      }
      // citadel beacon
      const [zx, zy] = NODES[9];
      if (Math.floor(t * 2) % 2 === 0) { ctx.fillStyle = "#fde047"; ctx.fillRect(zx, zy - 30, 1, 2); ctx.fillStyle = "#fef9c3"; ctx.fillRect(zx, zy - 30, 1, 1); }
      // clouds + shadows
      for (const c of clouds) {
        const x = Math.round(((c.x + t * c.v) % (MW + 40)) - 20), y = Math.round(c.y), w = Math.round(c.w);
        ctx.fillStyle = "rgba(2,6,23,.22)"; ctx.fillRect(x + 4, y + 8, w, 3);
        ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(x, y + 1, w, 3); ctx.fillRect(x + 3, y, w - 7, 1); ctx.fillRect(x + 2, y + 4, w - 4, 1);
      }
    }
    function frame(now) {
      if (!running) return;
      t += Math.min(0.05, (now - (last || now)) / 1000); last = now;
      draw();
      requestAnimationFrame(frame);
    }
    draw();
    if (!B.reduceMotion) {
      const sync = vis => { if (vis && !running) { running = true; last = 0; requestAnimationFrame(frame); } else if (!vis) running = false; };
      if ("IntersectionObserver" in window) new IntersectionObserver(es => sync(es[0].isIntersecting && !document.hidden)).observe(canvas);
      else sync(true);
      document.addEventListener("visibilitychange", () => sync(!document.hidden));
    }
    buildNodes();
  }

  function buildNodes() {
    const frame = document.getElementById("map-frame");
    const heroEl = document.getElementById("map-hero");
    const current = B.Store.currentLevel(LEVELS.length);
    let selected = current;
    const pos = i => ({ left: (NODES[i][0] + 0.5) / MW * 100 + "%", top: (NODES[i][1] + 0.5) / MH * 100 + "%" });

    LEVELS.forEach((lv, i) => {
      const unlocked = B.Store.isUnlocked(lv.id), done = B.Store.isDone(lv.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-node" + (done ? " is-done" : "") + (unlocked ? "" : " is-locked") + (lv.id === current && !done ? " is-current" : "");
      btn.textContent = unlocked ? lv.id : "";
      if (!unlocked) btn.innerHTML = '<img src="' + B.spriteURL("lock", 2) + '" alt="" width="16" height="18" class="pixelated">';
      btn.setAttribute("aria-label", "Level " + lv.id + ": " + lv.name + (done ? " (cleared)" : unlocked ? "" : " (locked)"));
      Object.assign(btn.style, pos(i));
      btn.addEventListener("click", () => {
        if (!unlocked) {
          btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake");
        }
        select(lv.id, unlocked);
      });
      btn.addEventListener("dblclick", () => { if (unlocked) B.Wipe.go("level.html?id=" + lv.id); });
      frame.appendChild(btn);
      const label = document.createElement("span");
      label.className = "map-label";
      label.textContent = lv.name;
      label.style.left = pos(i).left;
      label.style.top = "calc(" + pos(i).top + " + 30px)";
      frame.appendChild(label);
    });

    function placeHero(id) {
      const p = pos(id - 1);
      heroEl.style.left = p.left;
      heroEl.style.top = "calc(" + p.top + " - 18px)";
    }

    function select(id, unlocked) {
      selected = id;
      if (unlocked) placeHero(id);
      renderPanel(id);
    }

    placeHero(current);
    renderPanel(selected);
  }

  let portraitScene = null;
  function renderPanel(id) {
    const lv = LEVELS[id - 1];
    const panel = document.getElementById("quest-panel");
    const unlocked = B.Store.isUnlocked(id), done = B.Store.get().done[id];
    panel.querySelector(".lv").textContent = "Level " + lv.id + " · " + lv.topic;
    panel.querySelector("h2").textContent = lv.name;
    panel.querySelector("p").textContent = unlocked ? lv.blurb : "Locked — clear Level " + (id - 1) + " (" + LEVELS[id - 2].name + ") to open this world.";
    const meta = panel.querySelector(".meta");
    meta.innerHTML = done ? '<span class="tag done">Cleared</span> ' + B.starsHTML(done.stars) : '<span class="tag">+' + lv.xp + " XP</span>";
    const go = panel.querySelector("#enter-level");
    if (unlocked) { go.href = "level.html?id=" + id; go.removeAttribute("aria-disabled"); go.style.opacity = ""; go.style.pointerEvents = ""; }
    else { go.removeAttribute("href"); go.setAttribute("aria-disabled", "true"); go.style.opacity = ".45"; go.style.pointerEvents = "none"; }
    go.querySelector(".t-label").textContent = done ? "Replay" : "Enter";
    const cv = panel.querySelector(".portrait");
    if (!portraitScene) portraitScene = new B.PixelScene(cv, { theme: lv.theme, pixel: 2, animate: false, entities: false, hero: unlocked, heroFrac: 0.3, seed: id * 3 });
    else { portraitScene.theme = B.THEMES[lv.theme]; portraitScene.opts.hero = unlocked; portraitScene.cam = id * 3 * 137; portraitScene.W = 0; portraitScene.resize(); }
    portraitScene.renderStill(2);
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  }

  function initProgress() {
    const total = LEVELS.reduce((s, l) => s + l.xp, 0), xp = B.Store.levelXP();
    const bar = document.getElementById("xp-fill");
    if (bar) requestAnimationFrame(() => bar.style.setProperty("--p", (xp / total).toFixed(3)));
    const txt = document.getElementById("xp-text");
    if (txt) txt.textContent = xp + " / " + total + " XP";
    const reset = document.getElementById("reset");
    if (reset) reset.addEventListener("click", () => {
      if (window.confirm("Reset all progress? Your XP, stars and saved code will be erased.")) { B.Store.reset(); location.reload(); }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMap();
    initProgress();
    const grid = document.getElementById("level-grid");
    if (grid) B.renderLevelCards(grid);
  });
})();

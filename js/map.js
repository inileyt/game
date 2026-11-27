/* World map page: one animated pixel island per language track (JavaScript, Go, PHP). */
(function () {
  "use strict";
  const B = window.Bitwood;
  const LEVELS = window.BITWOOD_LEVELS;
  const MW = 192, MH = 108;
  const LAYOUTS = {
    10: { nodes: [[18, 72], [34, 40], [52, 70], [70, 38], [88, 68], [106, 36], [124, 66], [142, 36], [158, 68], [175, 38]], r: 19 },
    5: { nodes: [[30, 72], [64, 40], [100, 68], [138, 38], [166, 66]], r: 26 }
  };
  const PAL = {
    village: ["#4ade80", "#22c55e"], forest: ["#15803d", "#166534"], caves: ["#64748b", "#475569"], rapids: ["#2dd4bf", "#14b8a6"],
    castle: ["#7c3aed", "#6d28d9"], desert: ["#fbbf24", "#f59e0b"], snow: ["#e2e8f0", "#cbd5e1"], swamp: ["#4d7c0f", "#3f6212"],
    volcano: ["#44403c", "#292524"], space: ["#1e1b4b", "#312e81"], dawn: ["#4ade80", "#22c55e"]
  };
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const h2 = (x, y) => hash(x * 57.13 + y * 113.7);
  const noise = (x, y) => (Math.sin(x * 0.21 + y * 0.13) + Math.sin(x * 0.07 - y * 0.29 + 2) + Math.sin(y * 0.17 + 1)) / 6 + 0.5;

  /* ---------- which track is shown ---------- */
  const params = new URLSearchParams(location.search);
  const trackId = B.Tracks.list.some(t => t.id === params.get("track")) ? params.get("track") : "js";
  const TRACK = B.Tracks.byId(trackId);
  const TL = B.Tracks.levels(trackId);
  const layout = LAYOUTS[TL.length] || LAYOUTS[5];
  const NODES = layout.nodes.slice(0, TL.length);
  const label = lv => "Level " + B.Tracks.num(lv);

  function landInfo(x, y) {
    let best = 9, idx = 0, nearest = 9e9;
    NODES.forEach(([nx, ny], i) => {
      const d = Math.hypot(x - nx, (y - ny) * 1.15) / layout.r;
      if (d < best) best = d;
      const dn = Math.hypot(x - nx, y - ny);
      if (dn < nearest) { nearest = dn; idx = i; }
    });
    return { v: best + (noise(x, y) - 0.5) * 0.45, biome: idx };
  }

  function decorate(g, theme, x, y, n) {
    if (theme === "forest" && n > 0.93) { // pine trees
      g.fillStyle = "#052e16"; g.fillRect(x, y + 3, 1, 1);
      g.fillStyle = "#14532d"; g.fillRect(x - 1, y + 1, 3, 2); g.fillRect(x, y, 1, 1);
      g.fillStyle = "#22c55e"; g.fillRect(x - 1, y + 1, 1, 1);
    } else if (theme === "village" && n > 0.985) { // houses
      g.fillStyle = "#f5e6c8"; g.fillRect(x, y + 1, 4, 3);
      g.fillStyle = ["#ef4444", "#2563eb", "#f97316"][(n * 1000 | 0) % 3]; g.fillRect(x - 1, y, 6, 1); g.fillRect(x, y - 1, 4, 1);
      g.fillStyle = "#6b3e26"; g.fillRect(x + 1, y + 2, 1, 2);
    } else if (theme === "village" && n > 0.95) { // flowers
      g.fillStyle = n > 0.97 ? "#f472b6" : "#fde047"; g.fillRect(x, y, 1, 1);
    } else if (theme === "caves" && n > 0.955) { // mountains
      for (let r = 0; r < 5; r++) { g.fillStyle = r < 2 ? "#e2e8f0" : (r % 2 ? "#334155" : "#475569"); g.fillRect(x - r, y + r, r * 2 + 1, 1); }
    } else if (theme === "caves" && n > 0.94) {
      g.fillStyle = "#22d3ee"; g.fillRect(x, y, 1, 2); g.fillStyle = "#a5f3fc"; g.fillRect(x, y, 1, 1);
    } else if (theme === "rapids" && n > 0.95) { // ripples
      g.fillStyle = "#0ea5e9"; g.fillRect(x - 1, y, 3, 1);
    } else if (theme === "castle" && n > 0.96) {
      g.fillStyle = "#2e1065"; g.fillRect(x, y, 2, 2); g.fillStyle = "#a78bfa"; g.fillRect(x, y, 1, 1);
    } else if (theme === "desert" && n > 0.96) { // cactus
      g.fillStyle = "#3f6212"; g.fillRect(x, y, 1, 4); g.fillRect(x - 1, y + 1, 1, 1); g.fillRect(x + 1, y + 2, 1, 1);
    } else if (theme === "snow" && n > 0.95) { // snowy pines
      g.fillStyle = "#1e4d3a"; g.fillRect(x - 1, y + 1, 3, 2); g.fillRect(x, y + 3, 1, 1);
      g.fillStyle = "#ffffff"; g.fillRect(x, y, 1, 1); g.fillRect(x - 1, y + 1, 1, 1);
    } else if (theme === "swamp" && n > 0.93) { // puddles + reeds
      if (n > 0.97) { g.fillStyle = "#365314"; g.fillRect(x, y, 1, 3); g.fillStyle = "#a16207"; g.fillRect(x, y, 1, 1); }
      else { g.fillStyle = "#14532d"; g.fillRect(x - 1, y, 3, 1); }
    } else if (theme === "volcano" && n > 0.94) { // lava cracks
      g.fillStyle = n > 0.975 ? "#fde047" : "#f97316"; g.fillRect(x, y, 2, 1);
    } else if (theme === "space" && n > 0.92) { // stars
      g.fillStyle = n > 0.97 ? "#ffffff" : "#a5b4fc"; g.fillRect(x, y, 1, 1);
    }
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
      else if (li.v >= 1.0) px(x, y, n > 0.5 ? "#0e7490" : "#0f6b85");
      else if (li.v >= 0.9) px(x, y, n > 0.6 ? "#fde68a" : "#fcd34d");
      else {
        const pal = PAL[TL[li.biome].theme] || PAL.village;
        px(x, y, n > 0.7 ? pal[1] : pal[0]);
      }
    }
    for (let y = 2; y < MH - 4; y++) for (let x = 2; x < MW - 4; x++) {
      const li = info[y * MW + x];
      if (li.v > 0.8) continue;
      decorate(g, TL[li.biome].theme, x, y, h2(x * 3, y * 7));
    }
    TL.forEach((lv, i) => {
      const [x, y] = NODES[i];
      if (lv.theme === "castle") drawCastle(g, x - 6, y - 22);
      else if (lv.theme === "volcano") drawVolcano(g, x - 1, y - 20);
      else if (lv.theme === "space") drawCitadel(g, x - 4, y - 24);
    });
    return c;
  }

  function drawCastle(g, x, y) {
    g.fillStyle = "#1e1b4b";
    g.fillRect(x, y + 6, 13, 9); g.fillRect(x - 2, y + 2, 4, 13); g.fillRect(x + 11, y + 2, 4, 13); g.fillRect(x + 5, y, 3, 6);
    g.fillStyle = "#312e81"; g.fillRect(x + 1, y + 7, 11, 7);
    g.fillStyle = "#fde047"; g.fillRect(x - 1, y + 5, 1, 1); g.fillRect(x + 12, y + 5, 1, 1); g.fillRect(x + 6, y + 2, 1, 1);
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
    canvas.setAttribute("aria-label", "Pixel island map of the " + TRACK.name + " track with " + TL.length + " level locations connected by a path");
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
      for (const w of waves) {
        const x = Math.floor((w.x + t * 3) % MW), y = Math.floor(w.y);
        if (landInfo(x, y).v < 1.05) continue;
        if (Math.sin(t * 2 + w.p) > 0.2) { ctx.fillStyle = "#38bdf8"; ctx.fillRect(x, y, 2, 1); }
      }
      paths.forEach((pts, i) => {
        const unlocked = B.Store.isUnlocked(TL[i + 1].id);
        pts.forEach(([x, y], k) => {
          if ((k + (unlocked ? Math.floor(t * 6) : 0)) % 3 === 0) {
            ctx.fillStyle = "#0b1020"; ctx.fillRect(x, y + 1, 1, 1);
            ctx.fillStyle = unlocked ? "#fef3c7" : "#64748b"; ctx.fillRect(x, y, 1, 1);
          }
        });
      });
      TL.forEach((lv, i) => {
        const [x, y] = NODES[i];
        if (lv.theme === "castle") {
          ctx.fillStyle = "#e2e8f0"; ctx.fillRect(x, y - 27, 1, 5);
          ctx.fillStyle = "#ef4444"; ctx.fillRect(x + 1, y - 27 + (Math.floor(t * 4) % 2), 3, 2);
        } else if (lv.theme === "volcano") {
          for (let k = 0; k < 3; k++) {
            const f = (t * 0.8 + k / 3) % 1;
            ctx.fillStyle = "rgba(168,162,158," + (0.7 - f * 0.7).toFixed(2) + ")";
            ctx.fillRect(Math.round(x + Math.sin(f * 6 + k) * 2), Math.round(y - 18 - f * 10), 2, 2);
          }
        } else if (lv.theme === "space" && Math.floor(t * 2) % 2 === 0) {
          ctx.fillStyle = "#fde047"; ctx.fillRect(x, y - 30, 1, 2); ctx.fillStyle = "#fef9c3"; ctx.fillRect(x, y - 30, 1, 1);
        }
      });
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
    const current = B.Store.currentLevel(TL.map(l => l.id));
    const pos = i => ({ left: (NODES[i][0] + 0.5) / MW * 100 + "%", top: (NODES[i][1] + 0.5) / MH * 100 + "%" });
    const indexOf = id => TL.findIndex(l => l.id === id);

    TL.forEach((lv, i) => {
      const unlocked = B.Store.isUnlocked(lv.id), done = B.Store.isDone(lv.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-node" + (done ? " is-done" : "") + (unlocked ? "" : " is-locked") + (lv.id === current && !done ? " is-current" : "");
      btn.textContent = unlocked ? B.Tracks.num(lv) : "";
      if (!unlocked) btn.innerHTML = '<img src="' + B.spriteURL("lock", 2) + '" alt="" width="16" height="18" class="pixelated">';
      btn.setAttribute("aria-label", label(lv) + ": " + lv.name + (done ? " (cleared)" : unlocked ? "" : " (locked)"));
      Object.assign(btn.style, pos(i));
      btn.addEventListener("click", () => {
        if (!unlocked) { btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake"); }
        if (unlocked) placeHero(lv.id);
        renderPanel(lv);
      });
      btn.addEventListener("dblclick", () => { if (unlocked) B.Wipe.go("level.html?id=" + lv.id); });
      frame.appendChild(btn);
      const lab = document.createElement("span");
      lab.className = "map-label";
      lab.textContent = lv.name;
      lab.style.left = pos(i).left;
      lab.style.top = "calc(" + pos(i).top + " + 30px)";
      frame.appendChild(lab);
    });

    function placeHero(id) {
      const p = pos(indexOf(id));
      heroEl.style.left = p.left;
      heroEl.style.top = "calc(" + p.top + " - 18px)";
    }
    placeHero(current);
    renderPanel(TL[indexOf(current)]);
  }

  let portraitScene = null;
  function renderPanel(lv) {
    const panel = document.getElementById("quest-panel");
    const unlocked = B.Store.isUnlocked(lv.id), done = B.Store.get().done[lv.id];
    const prev = LEVELS.find(l => l.id === lv.id - 1);
    panel.querySelector(".lv").textContent = (TRACK.id === "js" ? "" : TRACK.name + " · ") + label(lv) + " · " + lv.topic;
    panel.querySelector("h2").textContent = lv.name;
    panel.querySelector("p").textContent = unlocked ? lv.blurb : "Locked — clear " + label(prev) + " (" + prev.name + ") to open this world.";
    const meta = panel.querySelector(".meta");
    meta.innerHTML = done ? '<span class="tag done">Cleared</span> ' + B.starsHTML(done.stars) : '<span class="tag">+' + lv.xp + " XP</span>";
    const go = panel.querySelector("#enter-level");
    if (unlocked) { go.href = "level.html?id=" + lv.id; go.removeAttribute("aria-disabled"); go.style.opacity = ""; go.style.pointerEvents = ""; }
    else { go.removeAttribute("href"); go.setAttribute("aria-disabled", "true"); go.style.opacity = ".45"; go.style.pointerEvents = "none"; }
    go.querySelector(".t-label").textContent = done ? "Replay" : "Enter";
    const cv = panel.querySelector(".portrait");
    if (!portraitScene) portraitScene = new B.PixelScene(cv, { theme: lv.theme, pixel: 2, animate: false, entities: false, hero: unlocked, heroFrac: 0.3, seed: lv.id * 3 });
    else { portraitScene.theme = B.THEMES[lv.theme]; portraitScene.opts.hero = unlocked; portraitScene.cam = lv.id * 3 * 137; portraitScene.W = 0; portraitScene.resize(); }
    portraitScene.renderStill(2);
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  }

  function renderTabs() {
    const wrap = document.getElementById("track-tabs");
    if (!wrap) return;
    wrap.innerHTML = B.Tracks.list.map(t => {
      const ls = B.Tracks.levels(t.id), done = ls.filter(l => B.Store.isDone(l.id)).length;
      return '<a class="track-tab' + (t.id === trackId ? " is-active" : "") + '" href="levels.html?track=' + t.id + '"' + (t.id === trackId ? ' aria-current="page"' : "") +
        ' style="--c:' + t.color + '"><img class="pixelated" alt="" src="' + B.spriteURL(t.icon, 3) + '"><span><b>' + B.escapeHTML(t.name) + "</b><small>" + done + " / " + ls.length + " levels</small></span></a>";
    }).join("");
  }

  function initProgress() {
    document.getElementById("map-title").textContent = TRACK.name + " Island";
    document.getElementById("map-lead").textContent = TRACK.blurb + " Clear a level to open the path to the next one.";
    document.title = TRACK.name + " World Map — Bitwood";
    const total = TL.reduce((s, l) => s + l.xp, 0);
    const xp = TL.reduce((s, l) => s + (B.Store.isDone(l.id) ? l.xp : 0), 0);
    const bar = document.getElementById("xp-fill");
    if (bar) requestAnimationFrame(() => bar.style.setProperty("--p", (xp / total).toFixed(3)));
    const txt = document.getElementById("xp-text");
    if (txt) txt.textContent = xp + " / " + total + " XP";
    const allTitle = document.getElementById("all-title");
    if (allTitle) allTitle.textContent = "All " + TRACK.name + " levels";
    const reset = document.getElementById("reset");
    if (reset) reset.addEventListener("click", () => {
      if (window.confirm("Reset all progress in every language? Your XP, stars and saved code will be erased" + (B.Cloud && B.Cloud.user ? " — in the cloud too." : "."))) {
        B.Store.reset();
        const save = B.Cloud && B.Cloud.user ? B.Cloud.saveNow() : Promise.resolve();
        save.finally(() => location.reload());
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderTabs();
    initProgress();
    initMap();
    const grid = document.getElementById("level-grid");
    if (grid) B.renderLevelCards(grid, trackId);
  });
})();

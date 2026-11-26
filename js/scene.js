/* Bitwood PixelScene — a procedurally drawn 2D pixel adventure background.
   Parallax sky, clouds, mountains, castle, forest, ground, coins, slimes and
   a little hero who runs, jumps and collects coins. */
(function () {
  "use strict";
  const { sprite } = window.Bitwood;

  const THEMES = {
    dawn: {
      sky: ["#0a0f3d", "#121a5c", "#1c2a7a", "#2a3f97", "#3d58b0", "#5a74c4", "#8a8fcf", "#c49bc8", "#f2a7a0", "#ffc48a"],
      stars: true, sun: ["#fff6cf", "#ffd27a", "#ffb36b"],
      cloud: ["#f8d3e6", "#c49bc8"],
      far: ["#7a6fc0", "#8c82cf", "#e6e3ff"], near: ["#463b95", "#574ba8", "#cfd0f7"],
      hill: ["#1d6b5a", "#2a8a6e"], meadow: "#17714a", tree: ["#0f4c3a", "#1b6b4b"],
      grass: ["#4ade80", "#22c55e", "#15803d"], dirt: ["#6b3f22", "#8a5a34", "#4a2a16"],
      castle: ["#24345e", "#fde047"], flowers: ["#f472b6", "#facc15", "#f8fafc", "#a78bfa"], fireflies: true
    },
    village: {
      sky: ["#38bdf8", "#4cc3f9", "#60c9fa", "#7dd3fc", "#93dcfd", "#a8e3fe", "#bae6fd", "#cdeefe", "#e0f5ff", "#f0faff"],
      stars: false, sun: ["#fffbe0", "#fde047", "#fbbf24"],
      cloud: ["#ffffff", "#cbe9f7"],
      far: ["#86a9d9", "#9bbbe3", "#f1f5f9"], near: ["#5b86c5", "#6d97d1", "#e2e8f0"],
      hill: ["#4d9a4a", "#63b35d"], meadow: "#3f8f45", tree: ["#2f6f3a", "#3f8a4a"],
      grass: ["#86efac", "#4ade80", "#22a356"], dirt: ["#8b5a2b", "#a8743f", "#6b4220"],
      castle: ["#8b5a2b", "#fde047"], flowers: ["#f472b6", "#facc15", "#ffffff", "#fb7185"], houses: true
    },
    forest: {
      sky: ["#0f3b2e", "#145040", "#1b6450", "#24785e", "#2f8c6b", "#3fa077", "#5bb488", "#7fc79b", "#a5d9b0", "#cdeac4"],
      stars: false, sun: ["#fffbe0", "#fef08a", "#d9f99d"],
      cloud: ["#d9f99d", "#86c99a"],
      far: ["#2a6b52", "#337a5e", "#bfe3cf"], near: ["#1d5641", "#24634b", "#a7d5bd"],
      hill: ["#14532d", "#1a6b3a"], meadow: "#124a2a", tree: ["#0b3b22", "#14532d"],
      grass: ["#4ade80", "#16a34a", "#0f6b30"], dirt: ["#5b3a1e", "#76502c", "#3d2512"],
      castle: ["#0b3b22", "#a3e635"], flowers: ["#a3e635", "#fde047", "#f0abfc"], fireflies: true, dense: true
    },
    caves: {
      sky: ["#0b0820", "#120d2e", "#1a133d", "#22194c", "#2b205b", "#352869", "#403177", "#4c3a85", "#594593", "#6650a1"],
      stars: true, moon: true, sun: ["#e9e3ff", "#c4b5fd", "#8b5cf6"],
      cloud: ["#3b2f6b", "#2b215a"],
      far: ["#3a2f6e", "#463a80", "#c4b5fd"], near: ["#2a2155", "#352a66", "#a78bfa"],
      hill: ["#1e1b4b", "#2a2668"], meadow: "#1c1940", tree: ["#2e1065", "#4c1d95"],
      grass: ["#94a3b8", "#64748b", "#475569"], dirt: ["#334155", "#475569", "#1e293b"],
      castle: ["#1e1b4b", "#c4b5fd"], flowers: ["#22d3ee", "#a78bfa", "#f0abfc"], crystals: true, fireflies: true
    },
    rapids: {
      sky: ["#0c4a6e", "#0e5a82", "#106a96", "#127aa9", "#1a8bbb", "#2c9cc9", "#47acd4", "#66bddf", "#88cde8", "#addcf0"],
      stars: false, sun: ["#fffbe0", "#fde68a", "#fcd34d"],
      cloud: ["#f0f9ff", "#a5d8f0"],
      far: ["#3b82a8", "#4a92b7", "#e0f2fe"], near: ["#1e6a8f", "#2879a0", "#bae6fd"],
      hill: ["#0f766e", "#14907f"], meadow: "#0d6560", tree: ["#065f46", "#0f766e"],
      grass: ["#5eead4", "#2dd4bf", "#0f9488"], dirt: ["#155e75", "#1e7a96", "#0c4a5e"],
      castle: ["#0c4a6e", "#67e8f9"], flowers: ["#ffffff", "#67e8f9", "#fde047"], water: true
    },
    castle: {
      sky: ["#1a0b1f", "#2a0f2c", "#3b1238", "#4d1640", "#601a45", "#741f48", "#89264a", "#9e304b", "#b43c4b", "#c94b4b"],
      stars: true, moon: true, sun: ["#ffe4e6", "#fda4af", "#fb7185"],
      cloud: ["#5b1a3a", "#40122b"],
      far: ["#4a1a3f", "#5a2050", "#f5d0fe"], near: ["#33112e", "#42163b", "#e9d5ff"],
      hill: ["#2e1065", "#3b1480"], meadow: "#24104f", tree: ["#1e0b3a", "#2e1065"],
      grass: ["#a78bfa", "#7c3aed", "#5b21b6"], dirt: ["#3b0764", "#581c87", "#2e0550"],
      castle: ["#17082b", "#fde047"], flowers: ["#fb7185", "#fde047", "#f0abfc"], bigCastle: true, fireflies: true
    }
  };

  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const hash2 = (x, y) => hash(x * 57.13 + y * 113.7);

  class PixelScene {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.opts = Object.assign({ theme: "dawn", pixel: 0, speed: 34, heroFrac: 0.16, hero: true, entities: true, animate: true, onCoin: null, seed: 1 }, opts || {});
      this.theme = THEMES[this.opts.theme] || THEMES.dawn;
      this.cam = this.opts.seed * 137;
      this.t = 0;
      this.coins = 0;
      this.entities = [];
      this.particles = [];
      this.birds = [];
      this.nextSpawn = 0;
      this.hero = { y: 0, vy: 0, onGround: true, frame: 0, ft: 0 };
      this.running = false;
      this.visible = true;
      this.resize();
      if (typeof ResizeObserver !== "undefined") {
        this.ro = new ResizeObserver(() => { this.resize(); if (!this.running) this.draw(); });
        this.ro.observe(canvas);
      } else {
        window.addEventListener("resize", () => { this.resize(); if (!this.running) this.draw(); });
      }
    }

    resize() {
      const cw = this.canvas.clientWidth || this.canvas.width, ch = this.canvas.clientHeight || this.canvas.height;
      const P = this.opts.pixel || (cw < 640 ? 3 : 4);
      const W = Math.max(40, Math.ceil(cw / P)), H = Math.max(30, Math.ceil(ch / P));
      if (W === this.W && H === this.H) return;
      this.W = W; this.H = H;
      this.canvas.width = W; this.canvas.height = H;
      this.ctx.imageSmoothingEnabled = false;
      this.gy = H - Math.max(10, Math.round(H * 0.17));
      this.hx = Math.round(W * this.opts.heroFrac);
      this.buildSky();
      this.stars = [];
      if (this.theme.stars) {
        for (let i = 0; i < Math.round(W * H / 220); i++) {
          this.stars.push({ x: (hash(i * 3.1) * W) | 0, y: (hash(i * 7.7) * this.gy * 0.55) | 0, p: hash(i * 1.3) * 6.28, big: hash(i * 9.9) > 0.9 });
        }
      }
      this.clouds = [];
      const nc = Math.max(3, Math.round(W / 70));
      for (let i = 0; i < nc; i++) {
        this.clouds.push({ x: hash(i * 4.4 + 1) * (W + 80), y: 6 + hash(i * 2.2 + 5) * this.gy * 0.35, w: 14 + (hash(i * 6.6) * 26) | 0, v: 1.5 + hash(i) * 2 });
      }
      this.fireflies = [];
      if (this.theme.fireflies) {
        for (let i = 0; i < Math.round(W / 14); i++) this.fireflies.push({ x: hash(i * 8.3) * W, y: this.gy - 4 - hash(i * 5.1) * H * 0.25, p: hash(i * 2.9) * 6.28 });
      }
    }

    /* Sky bands with checker dithering + sun/moon, cached */
    buildSky() {
      const { W, gy } = this, H = this.H, th = this.theme;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const g = c.getContext("2d");
      const n = th.sky.length, top = gy + 2, bh = top / n;
      for (let i = 0; i < n; i++) {
        g.fillStyle = th.sky[i];
        g.fillRect(0, Math.floor(i * bh), W, Math.ceil(bh) + 1);
      }
      g.fillStyle = th.sky[n - 1];
      g.fillRect(0, Math.floor(top), W, H - top);
      for (let i = 1; i < n; i++) {
        const y0 = Math.floor(i * bh);
        g.fillStyle = th.sky[i];
        for (let x = 0; x < W; x++) if (x % 2 === 0) g.fillRect(x, y0 - 1, 1, 1);
        g.fillStyle = th.sky[i - 1];
        for (let x = 0; x < W; x++) if (x % 2 === 1) g.fillRect(x, y0, 1, 1);
      }
      // sun or moon
      const r = th.moon ? Math.max(5, Math.round(this.H * 0.06)) : Math.max(7, Math.round(this.H * 0.085));
      const sx = Math.round(W * (th.moon ? 0.8 : 0.84)), sy = Math.round(th.moon ? gy * 0.26 : gy * 0.36);
      for (let dy = -r - 7; dy <= r + 7; dy++) for (let dx = -r - 7; dx <= r + 7; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy);
        let col = null;
        if (d <= r) col = th.sun[0];
        else if (d <= r + 2) col = th.sun[1];
        else if (d <= r + 7 && ((dx + dy) & 1) === 0 && d <= r + 4 + hash2(dx, dy) * 3) col = th.sun[2];
        if (col) { g.fillStyle = col; g.fillRect(sx + dx, sy + dy, 1, 1); }
      }
      if (th.moon) {
        g.fillStyle = th.sun[1];
        g.fillRect(sx - 2, sy - 1, 2, 2); g.fillRect(sx + 2, sy + 2, 1, 1); g.fillRect(sx + 1, sy - 3, 1, 1);
      }
      this.sky = c;
    }

    farTop(x) { const H = this.H; return this.gy - 6 - H * 0.36 * (0.25 + 0.55 * Math.pow(1 - Math.abs(Math.cos(x * 0.016)), 1.4) + 0.2 * (1 - Math.abs(Math.cos(x * 0.043 + 1.3)))); }
    nearTop(x) { const H = this.H; return this.gy - 4 - H * 0.24 * (0.2 + 0.6 * Math.pow(1 - Math.abs(Math.cos(x * 0.022 + 2.1)), 1.3) + 0.2 * (1 - Math.abs(Math.cos(x * 0.061)))); }
    hillTop(x) { const H = this.H; return this.gy - 3 - H * 0.08 * (1.1 + Math.sin(x * 0.03) * 0.6 + Math.sin(x * 0.071 + 1) * 0.3); }

    drawRidge(fnTop, par, cols, snowLine) {
      const { ctx, W, gy } = this;
      const off = this.cam * par;
      for (let x = 0; x < W; x++) {
        const wx = x + off;
        const raw = fnTop.call(this, wx);
        const top = Math.round(raw);
        ctx.fillStyle = fnTop.call(this, wx - 1) > raw ? cols[1] : cols[0];
        ctx.fillRect(x, top, 1, gy - top + 1);
        if (snowLine !== null && top < snowLine) {
          ctx.fillStyle = cols[2];
          ctx.fillRect(x, top, 1, Math.min(snowLine - top, 2 + ((hash(Math.floor(wx)) * 3) | 0)));
        }
      }
    }

    drawClouds(dt) {
      const { ctx, W } = this, th = this.theme;
      for (const c of this.clouds) {
        c.x -= (c.v + this.opts.speed * 0.05) * dt;
        if (c.x < -c.w - 10) { c.x = W + 10 + hash(c.y + this.t) * 40; }
        const x = Math.round(c.x), y = Math.round(c.y), w = c.w;
        ctx.fillStyle = th.cloud[1];
        ctx.fillRect(x + 2, y + 4, w - 2, 2);
        ctx.fillStyle = th.cloud[0];
        ctx.fillRect(x, y + 2, w, 3);
        ctx.fillRect(x + Math.round(w * 0.2), y, Math.round(w * 0.45), 2);
        ctx.fillRect(x + Math.round(w * 0.3), y - 2, Math.round(w * 0.22), 2);
      }
    }

    drawCastle(x, base, big) {
      const { ctx } = this, th = this.theme;
      const s = big ? 2 : 1;
      const w = 22 * s, h = 12 * s;
      ctx.fillStyle = th.castle[0];
      ctx.fillRect(x, base - h, w, h + 2);
      // towers
      ctx.fillRect(x - 3 * s, base - h - 8 * s, 6 * s, h + 8 * s);
      ctx.fillRect(x + w - 3 * s, base - h - 8 * s, 6 * s, h + 8 * s);
      ctx.fillRect(x + w / 2 - 3 * s, base - h - 12 * s, 6 * s, 12 * s);
      // crenellations
      for (let i = 0; i < w; i += 3 * s) ctx.fillRect(x + i, base - h - 2 * s, 2 * s, 2 * s);
      ctx.fillRect(x - 3 * s, base - h - 10 * s, 2 * s, 2 * s); ctx.fillRect(x + 1 * s, base - h - 10 * s, 2 * s, 2 * s);
      ctx.fillRect(x + w - 3 * s, base - h - 10 * s, 2 * s, 2 * s); ctx.fillRect(x + w + 1 * s, base - h - 10 * s, 2 * s, 2 * s);
      // spire + flag
      ctx.fillRect(x + w / 2 - 1 * s, base - h - 16 * s, 2 * s, 4 * s);
      ctx.fillRect(x + w / 2 - 2 * s, base - h - 14 * s, 4 * s, 2 * s);
      const fl = Math.floor(this.t * 4) % 2;
      ctx.fillRect(x + w / 2, base - h - 22 * s, 1, 6 * s);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(x + w / 2 + 1, base - h - 22 * s + fl, 4 * s, 2 * s);
      // windows
      ctx.fillStyle = th.castle[1];
      const on = Math.floor(this.t * 1.5);
      [[x - 1 * s, base - h - 4 * s], [x + w - 1 * s, base - h - 4 * s], [x + w / 2 - 1 * s, base - h - 8 * s], [x + 5 * s, base - 6 * s], [x + w - 7 * s, base - 6 * s]].forEach((p, i) => {
        if ((on + i) % 5 !== 0) ctx.fillRect(Math.round(p[0]), Math.round(p[1]), 2 * s, 2 * s);
      });
      // gate
      ctx.fillStyle = "#0b1020";
      ctx.fillRect(x + w / 2 - 3 * s, base - 6 * s, 6 * s, 6 * s + 2);
    }

    drawHouse(x, base, k) {
      const { ctx } = this;
      const roof = ["#ef4444", "#2563eb", "#a855f7", "#f97316"][k % 4];
      ctx.fillStyle = "#f5e6c8"; ctx.fillRect(x, base - 8, 12, 9);
      ctx.fillStyle = roof;
      for (let i = 0; i < 5; i++) ctx.fillRect(x - 1 + i, base - 9 - i, 14 - i * 2, 1);
      ctx.fillStyle = "#6b3e26"; ctx.fillRect(x + 5, base - 4, 3, 5);
      ctx.fillStyle = "#38bdf8"; ctx.fillRect(x + 1, base - 6, 2, 2); ctx.fillRect(x + 9, base - 6, 2, 2);
    }

    drawTree(x, base, h) {
      const { ctx } = this, th = this.theme;
      ctx.fillStyle = "#3b2414";
      ctx.fillRect(x - 1, base - 3, 2, 4);
      const tiers = 3, tierH = Math.max(4, Math.round(h / tiers));
      for (let t = 0; t < tiers; t++) {
        const y0 = base - 3 - (tiers - t) * tierH + Math.round(tierH * 0.35) * t;
        for (let r = 0; r < tierH + 1; r++) {
          const hw = Math.floor(r * 0.7) + 1 + t;
          ctx.fillStyle = th.tree[0];
          ctx.fillRect(x - hw, y0 + r, hw * 2, 1);
          ctx.fillStyle = th.tree[1];
          ctx.fillRect(x - hw, y0 + r, Math.max(1, Math.floor(hw * 0.6)), 1);
        }
      }
    }

    drawCrystal(x, base, h) {
      const { ctx } = this;
      ctx.fillStyle = "#22d3ee";
      for (let r = 0; r < h; r++) { const hw = Math.max(1, Math.floor((h - r) / 3)); ctx.fillRect(x - hw, base - r, hw * 2, 1); }
      ctx.fillStyle = "#cffafe";
      ctx.fillRect(x - 1, base - h + 2, 1, Math.floor(h / 2));
    }

    drawGround() {
      const { ctx, W, H, gy } = this, th = this.theme;
      const cam = Math.floor(this.cam);
      // dirt
      ctx.fillStyle = th.dirt[0];
      ctx.fillRect(0, gy + 4, W, H - gy - 4);
      const cell = 6;
      const startCell = Math.floor(cam / cell);
      for (let cx = startCell - 1; cx <= startCell + Math.ceil(W / cell) + 1; cx++) {
        for (let cy = 0; cy * cell < H - gy; cy++) {
          const h = hash2(cx, cy);
          const sx = cx * cell - cam + ((h * 4) | 0), sy = gy + 7 + cy * cell + ((h * 9) | 0) % 3;
          if (sy >= H) continue;
          if (h < 0.35) { ctx.fillStyle = th.dirt[1]; ctx.fillRect(sx, sy, 3, 2); ctx.fillStyle = th.dirt[2]; ctx.fillRect(sx, sy + 2, 3, 1); }
          else if (h > 0.8) { ctx.fillStyle = th.dirt[2]; ctx.fillRect(sx + 1, sy, 1, 1); }
        }
      }
      if (th.water) {
        // a little river stripe in the ground
        const wy = gy + 9;
        if (wy + 4 < H) {
          ctx.fillStyle = "#0ea5e9"; ctx.fillRect(0, wy, W, 4);
          ctx.fillStyle = "#7dd3fc";
          for (let x = 0; x < W; x += 7) ctx.fillRect(((x + Math.floor(this.t * 20) + cam) % (W + 7)) - 3, wy + ((x / 7) & 1) + 1, 3, 1);
        }
      }
      // grass bands
      ctx.fillStyle = th.grass[0]; ctx.fillRect(0, gy, W, 2);
      ctx.fillStyle = th.grass[1]; ctx.fillRect(0, gy + 2, W, 2);
      ctx.fillStyle = th.grass[2];
      for (let x = 0; x < W; x++) {
        const wx = x + cam;
        const d = (hash(wx) * 3) | 0;
        ctx.fillRect(x, gy + 4, 1, 1 + d);
      }
      // tufts + flowers
      for (let x = 0; x < W; x++) {
        const wx = x + cam, h = hash(wx * 1.7 + 3);
        if (h > 0.86) { ctx.fillStyle = th.grass[0]; ctx.fillRect(x, gy - 1, 1, 1); if (h > 0.95) ctx.fillRect(x + 1, gy - 2, 1, 2); }
        if (h > 0.035 && h < 0.05) {
          ctx.fillStyle = th.grass[2]; ctx.fillRect(x, gy - 2, 1, 2);
          ctx.fillStyle = th.flowers[(wx & 0xff) % th.flowers.length];
          ctx.fillRect(x - 1, gy - 3, 3, 1); ctx.fillRect(x, gy - 4, 1, 3);
          ctx.fillStyle = "#fde047"; ctx.fillRect(x, gy - 3, 1, 1);
        }
      }
    }

    spawn() {
      const ahead = this.cam + this.W + 12;
      while (this.nextSpawn < ahead) {
        const x = Math.max(this.nextSpawn, this.cam + this.W + 12);
        const r = Math.random();
        if (r < 0.32) {
          this.entities.push({ type: "slime", x, frame: 0, ft: 0, alive: true });
        } else if (r < 0.75) {
          const n = 3 + ((Math.random() * 3) | 0), high = Math.random() < 0.4;
          for (let i = 0; i < n; i++) this.entities.push({ type: "coin", x: x + i * 11, y: this.gy - (high ? 30 : 13) - (high ? Math.round(Math.sin(i / (n - 1 || 1) * Math.PI) * 6) : 0), ph: i * 0.4, alive: true });
        } else {
          this.entities.push({ type: "chest", x, alive: true, open: false });
        }
        this.nextSpawn = x + 70 + Math.random() * 90;
      }
    }

    jump() {
      if (this.hero.onGround) { this.hero.vy = -125; this.hero.onGround = false; }
    }

    burst(x, y, colors, n) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = 20 + Math.random() * 40;
        this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, life: 0.6 + Math.random() * 0.4, c: colors[(Math.random() * colors.length) | 0] });
      }
    }

    popText(x, y, text) { this.particles.push({ x, y, vx: 0, vy: -18, life: 0.9, text }); }

    update(dt) {
      this.t += dt;
      const speed = this.opts.speed;
      this.cam += speed * dt;
      if (!this.opts.entities) return;
      this.spawn();
      const h = this.hero, gy = this.gy;
      // hero physics
      if (!h.onGround) {
        h.vy += 380 * dt; h.y += h.vy * dt;
        if (h.y >= 0) { h.y = 0; h.vy = 0; h.onGround = true; }
      }
      h.ft += dt;
      if (h.ft > 0.14) { h.ft = 0; h.frame ^= 1; }
      const hx = this.hx, heroTop = gy - 16 + Math.round(h.y);
      const hb = { x: hx + 2, y: heroTop + 1, w: 8, h: 15 };
      for (const e of this.entities) {
        if (!e.alive) continue;
        const sx = Math.round(e.x - this.cam);
        if (e.type === "slime") {
          e.x -= 12 * dt;
          e.ft += dt; if (e.ft > 0.3) { e.ft = 0; e.frame ^= 1; }
          const dist = sx - (hx + 10);
          if (dist > 2 && dist < 14 && h.onGround) this.jump();
          const sb = { x: sx + 1, y: gy - 8, w: 10, h: 8 };
          if (overlap(hb, sb)) {
            if (h.vy > 0) { // stomp!
              e.alive = false; h.vy = -95; h.onGround = false;
              this.burst(sx + 6, gy - 5, ["#4ade80", "#86efac", "#15803d"], 14);
              this.addCoins(3, sx + 6, gy - 14);
            }
          }
        } else if (e.type === "coin") {
          const cy = e.y + Math.round(Math.sin(this.t * 4 + e.ph));
          if (overlap(hb, { x: sx, y: cy, w: 8, h: 8 })) {
            e.alive = false;
            this.burst(sx + 4, cy + 4, ["#fde047", "#facc15", "#ffffff"], 6);
            this.addCoins(1, sx + 4, cy - 2);
          }
        } else if (e.type === "chest") {
          if (!e.open && sx < hx + 10) {
            e.open = true;
            this.burst(sx + 5, gy - 10, ["#fde047", "#a78bfa", "#2cbaff", "#ffffff"], 16);
            this.addCoins(5, sx + 5, gy - 18);
          }
        }
      }
      this.entities = this.entities.filter(e => (e.alive || e.type === "chest") && e.x - this.cam > -30);
      // particles
      for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; if (!p.text) p.vy += 120 * dt; p.life -= dt; }
      this.particles = this.particles.filter(p => p.life > 0);
      // birds
      if (Math.random() < dt * 0.15 && this.birds.length < 3) this.birds.push({ x: this.W + 5, y: 8 + Math.random() * this.gy * 0.3, v: 14 + Math.random() * 10, p: Math.random() * 6 });
      for (const b of this.birds) b.x -= b.v * dt;
      this.birds = this.birds.filter(b => b.x > -10);
      // shooting star
      if (this.theme.stars && !this.shoot && Math.random() < dt * 0.08) this.shoot = { x: Math.random() * this.W * 0.8 + this.W * 0.2, y: Math.random() * this.gy * 0.25, life: 0.8 };
      if (this.shoot) { this.shoot.x -= 90 * dt; this.shoot.y += 45 * dt; this.shoot.life -= dt; if (this.shoot.life <= 0) this.shoot = null; }
    }

    addCoins(n, x, y) {
      this.coins += n;
      this.popText(x, y, "+" + n);
      if (this.opts.onCoin) this.opts.onCoin(this.coins);
    }

    draw() {
      const { ctx, W, H, gy } = this, th = this.theme, t = this.t;
      ctx.drawImage(this.sky, 0, 0);
      // stars
      if (this.stars) for (const s of this.stars) {
        const tw = Math.sin(t * 2 + s.p);
        if (tw > -0.3) {
          ctx.fillStyle = tw > 0.6 ? "#ffffff" : "#c7d2fe";
          ctx.fillRect(s.x, s.y, 1, 1);
          if (s.big && tw > 0.7) { ctx.fillRect(s.x - 1, s.y, 3, 1); ctx.fillRect(s.x, s.y - 1, 1, 3); }
        }
      }
      if (this.shoot) {
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 6; i++) { ctx.globalAlpha = 1 - i / 6; ctx.fillRect(Math.round(this.shoot.x + i * 2), Math.round(this.shoot.y - i), 1, 1); }
        ctx.globalAlpha = 1;
      }
      this.drawClouds(this._dt || 0);
      // birds
      ctx.fillStyle = "#1e1b4b";
      for (const b of this.birds) {
        const x = Math.round(b.x), y = Math.round(b.y), up = Math.floor(t * 6 + b.p) % 2 === 0;
        if (up) { ctx.fillRect(x, y, 1, 1); ctx.fillRect(x + 4, y, 1, 1); ctx.fillRect(x + 1, y + 1, 1, 1); ctx.fillRect(x + 3, y + 1, 1, 1); ctx.fillRect(x + 2, y + 2, 1, 1); }
        else { ctx.fillRect(x, y + 1, 2, 1); ctx.fillRect(x + 3, y + 1, 2, 1); ctx.fillRect(x + 2, y + 2, 1, 1); }
      }
      this.drawRidge(this.farTop, 0.1, th.far, Math.round(gy - H * 0.36 * 0.78));
      this.drawRidge(this.nearTop, 0.22, th.near, Math.round(gy - H * 0.24 * 0.82));
      // castle on far hills
      const parC = 0.22, period = th.bigCastle ? 520 : 760;
      const offC = this.cam * parC;
      for (let k = Math.floor((offC - 80) / period); k <= Math.floor((offC + W + 80) / period); k++) {
        const wx = k * period + 260, sx = Math.round(wx - offC);
        this.drawCastle(sx, Math.round(this.nearTop(wx + 11)) + 3, !!th.bigCastle);
      }
      // hills
      this.drawRidge(this.hillTop, 0.4, [th.hill[0], th.hill[1], th.hill[1]], null);
      if (th.houses) {
        const off = this.cam * 0.4, per = 160;
        for (let k = Math.floor((off - 40) / per); k <= Math.floor((off + W + 40) / per); k++) {
          const wx = k * per + 40 + hash(k) * 60, sx = Math.round(wx - off);
          this.drawHouse(sx, Math.round(this.hillTop(wx + 6)) + 2, k);
        }
      }
      // meadow + tree line
      ctx.fillStyle = th.meadow;
      ctx.fillRect(0, gy - 5, W, 6);
      const parT = 0.62, offT = this.cam * parT, spacing = th.dense ? 9 : 16;
      for (let k = Math.floor((offT - 20) / spacing); k <= Math.floor((offT + W + 20) / spacing); k++) {
        const r = hash(k * 1.37);
        if (!th.dense && r < 0.3) continue;
        const wx = k * spacing + r * spacing * 0.6, sx = Math.round(wx - offT);
        if (th.crystals && r > 0.6) this.drawCrystal(sx, gy - 2, 6 + ((r * 10) | 0));
        else this.drawTree(sx, gy - 2, Math.round((10 + r * 14) * Math.max(0.8, H / 200)));
      }
      // fireflies
      if (this.fireflies) for (const f of this.fireflies) {
        const a = Math.sin(t * 3 + f.p);
        if (a > 0.2) { ctx.fillStyle = a > 0.7 ? "#fef9c3" : "#fde047"; ctx.fillRect(Math.round(f.x + Math.sin(t + f.p) * 3), Math.round(f.y + Math.cos(t * 0.8 + f.p) * 2), 1, 1); }
      }
      this.drawGround();
      // entities
      for (const e of this.entities) {
        const sx = Math.round(e.x - this.cam);
        if (sx < -20 || sx > W + 20) continue;
        if (e.type === "slime" && e.alive) ctx.drawImage(sprite(e.frame ? "slimeB" : "slimeA"), sx, gy - 9);
        else if (e.type === "coin" && e.alive) {
          const f = Math.floor(t * 8 + e.ph * 4) % 4;
          ctx.drawImage(sprite(["coin0", "coin1", "coin2", "coin1"][f]), sx, e.y + Math.round(Math.sin(t * 4 + e.ph)));
        } else if (e.type === "chest") this.drawChest(sx, gy, e.open);
      }
      // hero
      if (this.opts.hero) {
        const h = this.hero, name = !h.onGround ? "heroJump" : (h.frame ? "heroB" : "heroA");
        const hy = gy - 16 + Math.round(h.y);
        ctx.fillStyle = "rgba(2,6,23,.35)";
        const shw = h.onGround ? 10 : Math.max(4, 10 + Math.round(h.y / 4));
        ctx.fillRect(this.hx + 6 - shw / 2, gy, shw, 1);
        ctx.drawImage(sprite(name), this.hx, hy);
      }
      // particles
      for (const p of this.particles) {
        ctx.globalAlpha = Math.min(1, p.life * 2);
        if (p.text) this.drawTinyText(p.text, Math.round(p.x), Math.round(p.y));
        else { ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
      }
      ctx.globalAlpha = 1;
    }

    drawChest(x, gy, open) {
      const { ctx } = this;
      ctx.fillStyle = "#0b1020"; ctx.fillRect(x - 1, gy - 9, 12, 10);
      ctx.fillStyle = "#8b5a2b"; ctx.fillRect(x, gy - 5, 10, 5);
      ctx.fillStyle = "#facc15"; ctx.fillRect(x, gy - 5, 10, 1); ctx.fillRect(x + 4, gy - 4, 2, 2);
      if (open) {
        ctx.fillStyle = "#0b1020"; ctx.fillRect(x - 1, gy - 12, 12, 4);
        ctx.fillStyle = "#a16207"; ctx.fillRect(x, gy - 11, 10, 2);
        ctx.fillStyle = "#fde047"; ctx.fillRect(x + 2, gy - 7, 6, 2);
      } else {
        ctx.fillStyle = "#a16207"; ctx.fillRect(x, gy - 8, 10, 3);
      }
    }

    /* 3x5 pixel digits for "+n" pop text */
    drawTinyText(str, x, y) {
      const G = { "+": ["...", ".#.", "###", ".#.", "..."], "0": ["###", "#.#", "#.#", "#.#", "###"], "1": [".#.", "##.", ".#.", ".#.", "###"], "2": ["###", "..#", "###", "#..", "###"], "3": ["###", "..#", "###", "..#", "###"], "4": ["#.#", "#.#", "###", "..#", "..#"], "5": ["###", "#..", "###", "..#", "###"], "6": ["###", "#..", "###", "#.#", "###"], "7": ["###", "..#", "..#", "..#", "..#"], "8": ["###", "#.#", "###", "#.#", "###"], "9": ["###", "#.#", "###", "..#", "###"] };
      const { ctx } = this;
      let cx = x - str.length * 2;
      for (const ch of str) {
        const g = G[ch]; if (!g) { cx += 4; continue; }
        for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r][c] === "#") {
          ctx.fillStyle = "#0b1020"; ctx.fillRect(cx + c + 1, y + r + 1, 1, 1);
          ctx.fillStyle = "#fde047"; ctx.fillRect(cx + c, y + r, 1, 1);
        }
        cx += 4;
      }
    }

    frame(now) {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - (this.last || now)) / 1000);
      this.last = now;
      this._dt = dt;
      this.update(dt);
      this.draw();
      this.raf = requestAnimationFrame(n => this.frame(n));
    }

    start() {
      if (window.Bitwood.reduceMotion || !this.opts.animate) { this.update(0); this.draw(); return this; }
      const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(es => {
        this.visible = es[0].isIntersecting; this.sync();
      }) : null;
      if (io) io.observe(this.canvas);
      document.addEventListener("visibilitychange", () => this.sync());
      this.sync();
      return this;
    }

    sync() {
      const should = this.visible && !document.hidden;
      if (should && !this.running) { this.running = true; this.last = 0; this.raf = requestAnimationFrame(n => this.frame(n)); }
      else if (!should && this.running) { this.running = false; cancelAnimationFrame(this.raf); }
    }

    /* One still frame — used for thumbnails */
    renderStill(t) { this.t = t || 1.3; this._dt = 0; this.draw(); return this; }
  }

  function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  window.Bitwood.PixelScene = PixelScene;
  window.Bitwood.THEMES = THEMES;
})();

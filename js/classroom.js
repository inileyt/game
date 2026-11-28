/* Bitwood Academy classroom: an animated pixel scene with students who read, code, think and walk,
   and a teacher writing code on a chalkboard. Decorative only (aria-hidden), paused when off-screen
   and static under prefers-reduced-motion.
   Usage: <canvas class="classroom" data-classroom="full|desk"></canvas>  → Bitwood.Classroom.mountAll() */
(function () {
  "use strict";
  const B = window.Bitwood;
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  // outfits (palette swaps of the hero sprite) — different hats, clothes and skin tones
  const PEOPLE = {
    teacher: { Y: "#7c3aed", L: "#c4b5fd", B: "#14b8a6", C: "#99f6e4", A: "#1e293b", S: "#8d5524" },
    coder: { Y: "#22c55e", L: "#bbf7d0", B: "#6366f1", C: "#a5b4fc", A: "#334155", S: "#f1c27d" },
    reader: { Y: "#f472b6", L: "#fbcfe8", B: "#facc15", C: "#fef08a", A: "#1e3a8a", S: "#c68642" },
    thinker: { Y: "#fb923c", L: "#fed7aa", B: "#ef4444", C: "#fca5a5", A: "#3f3f46", S: "#e0ac69" },
    walker1: { Y: "#2cbaff", L: "#bae6fd", B: "#a3e635", C: "#d9f99d", A: "#1e293b", S: "#ffdbac" },
    walker2: { Y: "#a3e635", L: "#d9f99d", B: "#c084fc", C: "#e9d5ff", A: "#422006", S: "#5c3317" }
  };
  // tiny 3×5 glyphs that float up from the laptop
  const GLYPHS = {
    "{": [".##", ".#.", "#..", ".#.", ".##"], "}": ["##.", ".#.", "..#", ".#.", "##."],
    "<": ["..#", ".#.", "#..", ".#.", "..#"], ">": ["#..", ".#.", "..#", ".#.", "#.."],
    "/": ["..#", "..#", ".#.", "#..", "#.."], ";": ["...", ".#.", "...", ".#.", "#.."]
  };

  function drawPerson(ctx, who, x, y, frame, flip) {
    const s = B.sprite(frame, PEOPLE[who]);
    if (!flip) { ctx.drawImage(s, Math.round(x), Math.round(y)); return; }
    ctx.save();
    ctx.translate(Math.round(x) + s.width, Math.round(y));
    ctx.scale(-1, 1);
    ctx.drawImage(s, 0, 0);
    ctx.restore();
  }
  function glyph(ctx, ch, x, y, color) {
    const g = GLYPHS[ch]; if (!g) return;
    ctx.fillStyle = color;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r][c] === "#") ctx.fillRect(Math.round(x) + c, Math.round(y) + r, 1, 1);
  }

  class Classroom {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.mode = canvas.dataset.classroom || "full";
      this.t = 0;
      this.particles = [];
      this.resize();
      if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => { this.resize(); this.draw(); }).observe(canvas);
    }

    resize() {
      const cw = this.canvas.clientWidth || 300, ch = this.canvas.clientHeight || 120;
      const P = cw < 500 ? 2 : 3;
      const W = Math.max(60, Math.ceil(cw / P)), H = Math.max(36, Math.ceil(ch / P));
      if (W === this.W && H === this.H) return;
      this.W = W; this.H = H;
      this.canvas.width = W; this.canvas.height = H;
      this.ctx.imageSmoothingEnabled = false;
      this.floor = H - 7;
      const full = this.mode === "full";
      const wide = full && W >= 210;
      // layout (all in low-res pixels)
      this.L = {
        board: full ? { x: Math.round(W / 2 - 32), y: 5, w: 64, h: Math.min(26, this.floor - 22) } : null,
        desk: full ? { x: Math.round(W / 2 + 44), w: 22 } : { x: Math.round(W / 2 - 4), w: 22 },
        reader: wide ? Math.round(W / 2 - 74) : (full ? null : Math.round(W / 2 - 30)),
        thinker: wide ? Math.round(W * 0.86) : null,
        shelves: wide ? [Math.round(W * 0.16), Math.round(W * 0.72)] : [],
        windows: wide ? [Math.round(W * 0.14), Math.round(W * 0.86 - 16)] : (full ? [] : [4]),
        walkers: full
      };
      if (!full && W < 80) this.L.reader = null;
      this.buildStatic();
    }

    /* wall, windows, shelves and floor are drawn once */
    buildStatic() {
      const { W, H, floor, L } = this;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const g = c.getContext("2d");
      g.fillStyle = "#1b1033"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#170d2c";
      for (let y = 0; y < floor; y += 5) for (let x = (y / 5) % 2 ? 0 : 5; x < W; x += 10) g.fillRect(x, y, 9, 1), g.fillRect(x, y, 1, 5);
      // windows with a night sky
      L.windows.forEach(x => {
        g.fillStyle = "#3b2a63"; g.fillRect(x, 6, 16, 15);
        g.fillStyle = "#0b1a4a"; g.fillRect(x + 1, 7, 14, 13);
        g.fillStyle = "#3b2a63"; g.fillRect(x + 7, 7, 1, 13); g.fillRect(x + 1, 13, 14, 1);
        g.fillStyle = "#fde68a"; g.fillRect(x + 11, 9, 2, 2);
      });
      // bookshelves
      L.shelves.forEach((x, k) => {
        const top = floor - 28;
        g.fillStyle = "#4a2c1a"; g.fillRect(x, top, 24, 28);
        g.fillStyle = "#2a170c"; g.fillRect(x + 1, top + 1, 22, 26);
        for (let s = 0; s < 3; s++) {
          const sy = top + 2 + s * 9;
          let bx = x + 2;
          while (bx < x + 21) {
            const h = 5 + Math.floor(hash(bx * 7 + s * 13 + k) * 3), w = 1 + Math.floor(hash(bx + s + k * 3) * 2);
            g.fillStyle = ["#ef4444", "#2cbaff", "#facc15", "#a3e635", "#c084fc", "#fb923c", "#f472b6"][Math.floor(hash(bx * 3 + s * 5 + k) * 7)];
            g.fillRect(bx, sy + 7 - h, w, h);
            bx += w + (hash(bx + s * 2) > 0.8 ? 1 : 0);
          }
          g.fillStyle = "#6b3f22"; g.fillRect(x + 1, sy + 7, 22, 1);
        }
      });
      // floor planks
      g.fillStyle = "#3b2414"; g.fillRect(0, floor, W, H - floor);
      g.fillStyle = "#6b3f22"; g.fillRect(0, floor, W, 1);
      g.fillStyle = "#2a190d";
      for (let y = floor + 3; y < H; y += 3) for (let x = (y % 2) * 6; x < W; x += 12) g.fillRect(x, y, 10, 1);
      this.bg = c;
    }

    update(dt) {
      this.t += dt;
      const L = this.L;
      // glyphs floating up from the laptop
      if (Math.random() < dt * 2.2) {
        const keys = Object.keys(GLYPHS);
        this.particles.push({ ch: keys[Math.floor(Math.random() * keys.length)], x: L.desk.x + 12 + Math.random() * 6, y: this.floor - 18, life: 1.6, color: Math.random() > 0.5 ? "#22d3ee" : "#f472b6" });
      }
      this.particles.forEach(p => { p.y -= 9 * dt; p.x += Math.sin(this.t * 3 + p.y) * 0.08; p.life -= dt; });
      this.particles = this.particles.filter(p => p.life > 0);
    }

    draw() {
      const { ctx, W, floor, L, t } = this;
      if (!this.bg) return;
      ctx.drawImage(this.bg, 0, 0);
      // blinking stars in the windows
      L.windows.forEach((x, i) => { if (Math.sin(t * 2 + i * 2) > 0.2) { ctx.fillStyle = "#ffffff"; ctx.fillRect(x + 3, 9 + i, 1, 1); ctx.fillRect(x + 9, 16, 1, 1); } });

      // chalkboard + teacher writing code
      if (L.board) {
        const bd = L.board;
        ctx.fillStyle = "#8b5a2b"; ctx.fillRect(bd.x - 2, bd.y - 2, bd.w + 4, bd.h + 4);
        ctx.fillStyle = "#1f3b2c"; ctx.fillRect(bd.x, bd.y, bd.w, bd.h);
        ctx.fillStyle = "#6b3f22"; ctx.fillRect(bd.x - 2, bd.y + bd.h + 2, bd.w + 4, 2);
        const lines = [[2, 9, 4, 12], [6, 7, 10], [6, 13, 5], [2, 6, 3, 15], [2]];
        const cycle = 9, local = t % cycle;
        const total = lines.reduce((s, l) => s + l.reduce((a, b) => a + b + 1, 0) + 2, 0);
        let budget = Math.min(total, Math.floor(local / 6 * total));
        let tipX = bd.x + 4, tipY = bd.y + 4;
        lines.forEach((words, li) => {
          let x = bd.x + 4 + (li > 0 && li < 4 ? 4 : 0);
          const y = bd.y + 4 + li * 4;
          if (y > bd.y + bd.h - 3) return;
          words.forEach((w, wi) => {
            const color = wi === 0 && li === 0 ? "#f0abfc" : (li % 2 ? "#a5f3fc" : "#e2e8f0");
            for (let k = 0; k < w && budget > 0; k++, budget--) {
              ctx.fillStyle = color; ctx.fillRect(x + k, y, 1, 2);
              tipX = x + k; tipY = y;
            }
            x += w + 2; budget--;
          });
          budget -= 2;
        });
        // teacher stands left of the board and points at the chalk
        const tx = bd.x - 15, ty = floor - 16;
        drawPerson(ctx, "teacher", tx, ty, local < 6 && Math.floor(t * 2) % 2 ? "heroB" : "heroA", false);
        if (local < 6.5) {
          ctx.fillStyle = "#a16207";
          const hx = tx + 11, hy = ty + 9;
          const steps = 14;
          for (let i = 0; i <= steps; i++) ctx.fillRect(Math.round(hx + (tipX - hx) * i / steps), Math.round(hy + (tipY - hy) * i / steps), 1, 1);
          if (Math.floor(t * 8) % 2) { ctx.fillStyle = "#ffffff"; ctx.fillRect(tipX, tipY - 1, 1, 1); }
        }
      }

      // reader with a book whose pages flip
      if (L.reader !== null && L.reader !== undefined) {
        const rx = L.reader, ry = floor - 16;
        drawPerson(ctx, "reader", rx, ry, "heroA", false);
        ctx.fillStyle = "#0b1020"; ctx.fillRect(rx + 1, ry + 8, 10, 5);
        ctx.fillStyle = "#ef4444"; ctx.fillRect(rx + 1, ry + 12, 10, 1);
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(rx + 2, ry + 9, 3, 3); ctx.fillRect(rx + 7, ry + 9, 3, 3);
        ctx.fillStyle = "#94a3b8"; ctx.fillRect(rx + 2, ry + 10, 3, 1); ctx.fillRect(rx + 7, ry + 10, 2, 1);
        const flip = (t % 2.4) / 2.4;
        if (flip > 0.75) { ctx.fillStyle = "#e2e8f0"; const fx = flip > 0.87 ? rx + 5 : rx + 6; ctx.fillRect(fx, ry + 7, 2, 4); }
        if (Math.floor(t / 3.1) % 3 === 2 && t % 3.1 < 0.15) { ctx.fillStyle = PEOPLE.reader.S; ctx.fillRect(rx + 4, ry + 5, 1, 1); ctx.fillRect(rx + 7, ry + 5, 1, 1); } // blink
      }

      // coder at a desk with a laptop
      const dk = L.desk, dy = floor - 9;
      drawPerson(ctx, "coder", dk.x - 1, floor - 16, "heroA", false);
      ctx.fillStyle = "#8b5a2b"; ctx.fillRect(dk.x - 3, dy, dk.w, 2);
      ctx.fillStyle = "#6b3f22"; ctx.fillRect(dk.x - 2, dy + 2, 2, 7); ctx.fillRect(dk.x + dk.w - 6, dy + 2, 2, 7);
      ctx.fillStyle = "#4a2c1a"; ctx.fillRect(dk.x - 3, dy + 2, dk.w, 1);
      const lx = dk.x + 9;
      ctx.fillStyle = "#475569"; ctx.fillRect(lx, dy - 1, 10, 1);
      ctx.fillStyle = "#1e293b"; ctx.fillRect(lx + 1, dy - 8, 8, 7);
      ctx.fillStyle = "#082f49"; ctx.fillRect(lx + 2, dy - 7, 6, 5);
      for (let i = 0; i < 3; i++) {
        const len = 2 + Math.floor(hash(Math.floor(t * 3) + i * 7) * 4);
        ctx.fillStyle = ["#22d3ee", "#a3e635", "#f472b6"][i];
        ctx.fillRect(lx + 2 + (i % 2), dy - 6 + i * 2 - (i === 2 ? 1 : 0), Math.min(len, 5), 1);
      }
      if (Math.floor(t * 6) % 2) { ctx.fillStyle = "#94a3b8"; ctx.fillRect(dk.x + 4, dy - 1, 2, 1); } // typing hands
      this.particles.forEach(p => { ctx.globalAlpha = Math.min(1, p.life); glyph(ctx, p.ch, p.x, p.y, p.color); });
      ctx.globalAlpha = 1;

      // thinker with a blinking light bulb
      if (L.thinker) {
        const kx = L.thinker, ky = floor - 16;
        drawPerson(ctx, "thinker", kx, ky, "heroA", true);
        const on = Math.sin(t * 1.8) > 0;
        ctx.fillStyle = on ? "#fde047" : "#475569"; ctx.fillRect(kx + 4, ky - 9, 4, 4); ctx.fillRect(kx + 5, ky - 10, 2, 1);
        ctx.fillStyle = "#94a3b8"; ctx.fillRect(kx + 5, ky - 5, 2, 1);
        if (on) { ctx.fillStyle = "#fef9c3"; ctx.fillRect(kx + 2, ky - 9, 1, 1); ctx.fillRect(kx + 9, ky - 9, 1, 1); ctx.fillRect(kx + 5, ky - 12, 2, 1); ctx.fillRect(kx + 3, ky - 11, 1, 1); ctx.fillRect(kx + 8, ky - 11, 1, 1); }
      }

      // students walking past with books
      if (L.walkers) {
        const span = W + 30;
        const w1 = ((t * 16) % span) - 15, w2 = span - ((t * 12 + span * 0.45) % span) - 15;
        const f1 = Math.floor(t * 7) % 2 ? "heroB" : "heroA", f2 = Math.floor(t * 6) % 2 ? "heroB" : "heroA";
        drawPerson(ctx, "walker1", w1, floor - 15, f1, false);
        ctx.fillStyle = "#0b1020"; ctx.fillRect(Math.round(w1) + 9, floor - 7, 4, 4); ctx.fillStyle = "#2cbaff"; ctx.fillRect(Math.round(w1) + 9, floor - 6, 3, 3);
        drawPerson(ctx, "walker2", w2, floor - 15, f2, true);
        ctx.fillStyle = "#0b1020"; ctx.fillRect(Math.round(w2) - 1, floor - 7, 4, 4); ctx.fillStyle = "#a3e635"; ctx.fillRect(Math.round(w2), floor - 6, 3, 3);
      }
    }

    start() {
      if (B.reduceMotion) { this.t = 4; this.draw(); return; }
      let last = 0, running = false, raf = 0;
      const frame = now => {
        if (!running) return;
        const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
        this.update(dt); this.draw();
        raf = requestAnimationFrame(frame);
      };
      const sync = vis => {
        if (vis && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
        else if (!vis && running) { running = false; cancelAnimationFrame(raf); }
      };
      this.draw();
      if ("IntersectionObserver" in window) new IntersectionObserver(es => sync(es[0].isIntersecting && !document.hidden)).observe(this.canvas);
      else sync(true);
      document.addEventListener("visibilitychange", () => sync(!document.hidden));
    }
  }

  function mountAll(root) {
    (root || document).querySelectorAll("canvas[data-classroom]:not([data-mounted])").forEach(cv => {
      cv.dataset.mounted = "1";
      cv.setAttribute("aria-hidden", "true");
      new Classroom(cv).start();
    });
  }
  document.addEventListener("DOMContentLoaded", () => mountAll());
  B.Classroom = { mountAll };
})();

/* Bitwood core: sprites, progress store, pixel page transitions, nav, reveals. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Sprites — tiny pixel art defined as strings + palettes
   * ------------------------------------------------------------------ */
  const PAL = {
    K: "#0b1020", W: "#ffffff", Y: "#facc15", O: "#ca8a04", R: "#ef4444", B: "#2cbaff",
    C: "#75d1ff", G: "#4ade80", D: "#15803d", P: "#a855f7", N: "#8b5a2b", S: "#f5c49c",
    M: "#94a3b8", H: "#6b3e26", A: "#1e3a8a", L: "#fde047", V: "#7c3aed", E: "#334155"
  };

  const SPRITES = {
    heroA: [
      "...KKKKKK...",
      "..KYYYYYYK..",
      ".KYYLYYYYYK.",
      "KKKKKKKKKKKK",
      "..KSSSSSSK..",
      "..KSKSSKSK..",
      "..KSSSSSSK..",
      "...KKSSKK...",
      "..KBBBBBBK..",
      ".KSBBCBBBSK.",
      ".KSBBBBBBSK.",
      "..KBBBBBBK..",
      "..KAAAAAAK..",
      "..KAAKKAAK..",
      "..KAK..KAK..",
      "..KKK..KKK.."
    ],
    heroB: [
      "...KKKKKK...",
      "..KYYYYYYK..",
      ".KYYLYYYYYK.",
      "KKKKKKKKKKKK",
      "..KSSSSSSK..",
      "..KSKSSKSK..",
      "..KSSSSSSK..",
      "...KKSSKK...",
      "..KBBBBBBK..",
      ".KSBBCBBBSK.",
      ".KSBBBBBBSK.",
      "..KBBBBBBK..",
      "..KAAAAAAK..",
      "...KAKKAK...",
      "...KAKKAK...",
      "...KKKKKK..."
    ],
    heroJump: [
      "...KKKKKK...",
      "..KYYYYYYK..",
      ".KYYLYYYYYK.",
      "KKKKKKKKKKKK",
      "..KSSSSSSK..",
      "..KSKSSKSK..",
      "KSKSSSSSSKSK",
      "KSKKKSSKKKSK",
      ".KKBBBBBBKK.",
      "..KBBCBBBK..",
      "..KBBBBBBK..",
      "..KBBBBBBK..",
      "..KAAAAAAK..",
      ".KAAK..KAAK.",
      ".KKK....KKK.",
      "............"
    ],
    coin0: ["..KKKK..", ".KYYYYK.", "KYYWYYOK", "KYWYYYOK", "KYWYYYOK", "KYYYYYOK", ".KOOOOK.", "..KKKK.."],
    coin1: ["...KK...", "..KYYK..", "..KWYK..", "..KWYK..", "..KWYK..", "..KYOK..", "..KOOK..", "...KK..."],
    coin2: ["...KK...", "...KK...", "...KK...", "...KK...", "...KK...", "...KK...", "...KK...", "...KK..."],
    slimeA: [
      "....KKKK....",
      "..KKGGGGKK..",
      ".KGGGGGGGGK.",
      ".KGWKGGWKGK.",
      "KGGWKGGWKGGK",
      "KGGGGGGGGGGK",
      "KGGGGGGGGGDK",
      "KDGGGGGGGDDK",
      ".KKKKKKKKKK."
    ],
    slimeB: [
      "............",
      "....KKKK....",
      ".KKKGGGGKKK.",
      "KGGWKGGWKGGK",
      "KGGWKGGWKGGK",
      "KGGGGGGGGGGK",
      "KDGGGGGGGGDK",
      "KDDGGGGGGDDK",
      "KKKKKKKKKKKK"
    ],
    star: [
      ".....K.....",
      "....KYK....",
      "....KYK....",
      "KKKKYYYKKKK",
      "KYYYYYYYYYK",
      ".KYYYWYYYK.",
      "..KYYYYYK..",
      ".KYYYKYYYK.",
      ".KYYK.KYYK.",
      ".KKK...KKK."
    ],
    heart: [".KK...KK.", "KRRK.KRRK", "KRWRKRRRK", "KRRRRRRRK", ".KRRRRRK.", "..KRRRK..", "...KRK...", "....K...."],
    gem: ["..KKKKK..", ".KWCCCBK.", "KWCCCCCBK", "KCCCCCCBK", ".KCCCCBK.", "..KCCBK..", "...KBK...", "....K...."],
    sword: [
      "......KKK",
      ".....KWWK",
      "....KWWK.",
      "...KWWK..",
      "K.KWWK...",
      "KYKWK....",
      ".KYK.....",
      "KNKYK....",
      "KK.KK...."
    ],
    flag: [
      "KK........",
      "KNKRRRRK..",
      "KNKRRWRRK.",
      "KNKRRRRRRK",
      "KNKRRRRK..",
      "KNKKKKK...",
      "KNK.......",
      "KNK.......",
      "KNK.......",
      "KKK......."
    ],
    lock: ["..KKKK..", ".KMMMMK.", ".KM..MK.", "KKKKKKKK", "KYYYYYYK", "KYYKKYYK", "KYYKKYYK", "KOOOOOOK", "KKKKKKKK"],
    crown: ["K...KK...K", "KK.KYYK.KK", "KYKYYYYKYK", "KYYYRYYYYK", "KYYYYYYYYK", "KYCYYRYCYK", "KOOOOOOOOK", "KKKKKKKKKK"],
    potion: ["..KKKK..", "..KNNK..", "..KWWK..", ".KKWWKK.", "KPPPPPPK", "KPWPPPPK", "KPPPPPPK", "KPPPPPPK", ".KPPPPK.", "..KKKK.."],
    scroll: [
      ".KKKKKKKKK.",
      "KNWWWWWWWNK",
      ".KWKKKKKWK.",
      ".KWWWWWWWK.",
      ".KWKKKWWWK.",
      ".KWWWWWWWK.",
      ".KWKKKKWWK.",
      ".KWWWWWWWK.",
      "KNWWWWWWWNK",
      ".KKKKKKKKK."
    ],
    trophy: [
      ".KKKKKKKK.",
      "KKYYYYYYKK",
      "KYKYWYYKYK",
      "KYKYWYYKYK",
      ".KKYYYYKK.",
      "...KYYK...",
      "....KK....",
      "...KYYK...",
      "..KOOOOK..",
      "..KKKKKK.."
    ]
  };

  const spriteCache = new Map();
  function sprite(name, pal) {
    const key = name + (pal ? JSON.stringify(pal) : "");
    if (spriteCache.has(key)) return spriteCache.get(key);
    const rows = SPRITES[name];
    const p = Object.assign({}, PAL, pal || {});
    const w = Math.max.apply(null, rows.map(r => r.length));
    const c = document.createElement("canvas");
    c.width = w; c.height = rows.length;
    const ctx = c.getContext("2d");
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const col = p[row[x]];
        if (col) { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); }
      }
    });
    spriteCache.set(key, c);
    return c;
  }
  function spriteURL(name, scale, pal) {
    const s = sprite(name, pal);
    const c = document.createElement("canvas");
    c.width = s.width * (scale || 4); c.height = s.height * (scale || 4);
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s, 0, 0, c.width, c.height);
    return c.toDataURL("image/png");
  }
  /* Fill every <img data-sprite="name"> on the page */
  function paintSprites(root) {
    (root || document).querySelectorAll("img[data-sprite]").forEach(img => {
      img.src = spriteURL(img.dataset.sprite, +img.dataset.scale || 4);
      img.classList.add("pixelated");
      if (!img.hasAttribute("alt")) img.alt = "";
    });
  }

  /* ------------------------------------------------------------------ *
   * Progress store (localStorage, safe if unavailable)
   * ------------------------------------------------------------------ */
  const KEY = "bitwood-progress-v1";
  const Store = {
    read() {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    },
    write(data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode */ }
    },
    get() {
      const d = this.read();
      d.done = d.done || {};
      d.code = d.code || {};
      return d;
    },
    complete(id, info) {
      const d = this.get();
      const prev = d.done[id];
      if (!prev || info.stars > prev.stars) d.done[id] = info;
      this.write(d);
      return d;
    },
    saveCode(id, code) { const d = this.get(); d.code[id] = code; this.write(d); },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} },
    isDone(id) { return !!this.get().done[id]; },
    isUnlocked(id) { return id === 1 || this.isDone(id - 1); },
    xp() {
      const d = this.get(); let xp = 0;
      Object.keys(d.done).forEach(k => { xp += d.done[k].xp || 0; });
      return xp;
    },
    currentLevel(total) {
      for (let i = 1; i <= total; i++) if (!this.isDone(i)) return i;
      return total;
    }
  };

  /* ------------------------------------------------------------------ *
   * Pixel page transition
   * ------------------------------------------------------------------ */
  const Wipe = (function () {
    let canvas, ctx, cells = [], cols = 0, rows = 0, size = 40, raf = 0;
    const COLORS = ["#020617", "#020617", "#020617", "#0a0f3d", "#0f172a"];
    function setup() {
      canvas = document.createElement("canvas");
      canvas.className = "pixel-wipe";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
      ctx = canvas.getContext("2d");
      resize();
    }
    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      size = w < 640 ? 28 : 40;
      cols = Math.ceil(w / size); rows = Math.ceil(h / size);
      canvas.width = cols * size; canvas.height = rows * size;
      canvas.style.width = canvas.width + "px"; canvas.style.height = canvas.height + "px";
      cells = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        cells.push({ x, y, order: (x + y) / (cols + rows) * 0.7 + Math.random() * 0.3, color: COLORS[(Math.random() * COLORS.length) | 0] });
      }
    }
    function draw(t, mode) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const c of cells) {
        const covered = mode === "out" ? c.order > t : c.order <= t;
        if (covered) { ctx.fillStyle = c.color; ctx.fillRect(c.x * size, c.y * size, size, size); }
      }
    }
    function run(mode, duration, done) {
      cancelAnimationFrame(raf);
      const start = performance.now();
      canvas.classList.add("is-blocking");
      (function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        draw(t, mode);
        if (t < 1) raf = requestAnimationFrame(frame);
        else {
          if (mode === "out") { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.classList.remove("is-blocking"); }
          if (done) done();
        }
      })(start);
    }
    return {
      init() {
        if (reduceMotion) return;
        setup();
        // reveal: start fully covered then dissolve
        draw(-1, "out");
        run("out", 520);
        window.addEventListener("resize", () => { resize(); });
        window.addEventListener("pageshow", e => {
          if (e.persisted) { cancelAnimationFrame(raf); ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.classList.remove("is-blocking"); }
        });
        document.addEventListener("click", e => {
          const a = e.target.closest("a[href]");
          if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (a.target && a.target !== "_self") return;
          if (a.hasAttribute("download")) return;
          const url = new URL(a.href, location.href);
          if (url.origin !== location.origin) return;
          if (url.pathname === location.pathname && url.search === location.search && url.hash) return; // same-page anchor
          e.preventDefault();
          run("in", 420, () => { location.href = url.href; });
        });
      },
      go(href) {
        if (reduceMotion || !canvas) { location.href = href; return; }
        run("in", 420, () => { location.href = href; });
      }
    };
  })();

  /* ------------------------------------------------------------------ *
   * Nav, promo, XP chip, reveals
   * ------------------------------------------------------------------ */
  function initNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const burger = nav.querySelector(".burger");
    if (burger) {
      burger.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
      });
      nav.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => {
        nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false");
      }));
      document.addEventListener("keydown", e => {
        if (e.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); burger.focus(); }
      });
    }
    const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const promo = document.querySelector(".promo");
    if (promo) {
      let hidden = false;
      try { hidden = sessionStorage.getItem("bitwood-promo") === "0"; } catch (e) {}
      if (hidden) promo.classList.add("is-hidden");
      const close = promo.querySelector(".close");
      if (close) close.addEventListener("click", () => {
        promo.classList.add("is-hidden");
        try { sessionStorage.setItem("bitwood-promo", "0"); } catch (e) {}
      });
    }
  }

  function updateXP(bump) {
    document.querySelectorAll("[data-xp]").forEach(el => {
      el.textContent = Store.xp();
      const chip = el.closest(".xp-chip");
      if (bump && chip) { chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump"); }
    });
  }

  function initReveal(root) {
    const els = (root || document).querySelectorAll("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach(el => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
  }

  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 1200;
    (function f(now) {
      const t = Math.min(1, (now - start) / dur);
      const steps = Math.floor(t * 12) / 12; // stepped, pixel-ish counting
      el.textContent = Math.round(target * steps) + suffix;
      if (t < 1) requestAnimationFrame(f);
    })(start);
  }
  function initCounters() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(countUp); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  }

  /* Pixel confetti burst */
  function confetti(x, y, count) {
    if (reduceMotion) return;
    const c = document.createElement("canvas");
    c.className = "confetti";
    c.width = window.innerWidth; c.height = window.innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const colors = ["#facc15", "#fde047", "#a3e635", "#2cbaff", "#be53ff", "#ff7286", "#ffffff"];
    const parts = [];
    for (let i = 0; i < (count || 120); i++) {
      const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 8;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, size: 4 + ((Math.random() * 3) | 0) * 2, color: colors[(Math.random() * colors.length) | 0], life: 1 });
    }
    const start = performance.now();
    (function f(now) {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.life -= 0.008;
        if (p.life > 0 && p.y < c.height + 20) {
          alive = true;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x / 4) * 4, Math.round(p.y / 4) * 4, p.size, p.size);
        }
      }
      if (alive && now - start < 4000) requestAnimationFrame(f); else c.remove();
    })(start);
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  window.Bitwood = { PAL, SPRITES, sprite, spriteURL, paintSprites, Store, Wipe, updateXP, initReveal, confetti, escapeHTML, reduceMotion };

  document.addEventListener("DOMContentLoaded", () => {
    Wipe.init();
    paintSprites();
    initNav();
    updateXP();
    initReveal();
    initCounters();
    const y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  });
})();

/* Level-to-level cutscene: the hero walks along a path into a swirling portal,
   then the next level opens with the hero popping out of a portal. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const ARRIVE_KEY = "bitwood-arrive";

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) + amt * 255)));
    return "#" + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, "0")).join("");
  }
  const portalColors = hex => [hex, shade(hex, 0.35), shade(hex, -0.3)];

  /* Full-screen walk-into-the-portal scene, then navigate to href. */
  function portal(opts) {
    const go = () => {
      try { sessionStorage.setItem(ARRIVE_KEY, String(opts.toId)); } catch (e) { /* ignore */ }
      B.Wipe.go(opts.href);
    };
    if (B.reduceMotion) { go(); return; }

    const wrap = document.createElement("div");
    wrap.className = "cutscene";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", opts.title);
    wrap.innerHTML =
      '<canvas aria-hidden="true"></canvas>' +
      '<div class="cutscene-cap"><span class="lv">' + B.escapeHTML(opts.kicker) + "</span><b>" + B.escapeHTML(opts.title) + "</b></div>" +
      '<button class="btn btn-dark cutscene-skip" type="button">Skip ▶▶</button>';
    document.body.appendChild(wrap);
    const canvas = wrap.querySelector("canvas");
    const colors = portalColors(opts.color || "#2cbaff");
    let elapsed = 0, done = false, x0 = 0, portalX = 0;
    const WALK_SPEED = 34;

    const finish = () => { if (done) return; done = true; go(); };
    wrap.querySelector(".cutscene-skip").addEventListener("click", finish);
    document.addEventListener("keydown", function onKey(e) { if (e.key === "Escape") { document.removeEventListener("keydown", onKey); finish(); } });

    const scene = new B.PixelScene(canvas, {
      theme: opts.theme, speed: 0, entities: false, hero: true, walk: true, heroFrac: 0.1, seed: opts.fromId || 1,
      onUpdate(dt, sc) {
        elapsed += dt;
        if (!x0) { x0 = sc.hx; portalX = Math.round(sc.W * 0.76); }
        const walkEnd = (portalX - 8 - x0) / WALK_SPEED + 0.5;
        if (elapsed < 0.5) sc.hx = x0;
        else if (elapsed < walkEnd) sc.hx = Math.round(x0 + (elapsed - 0.5) * WALK_SPEED);
        else {
          sc.hx = portalX - 6;
          const k = Math.min(1, (elapsed - walkEnd) / 0.6);
          sc.heroScale = 1 - k;
          if (k === 1 && !sc._sounded) { sc._sounded = true; if (B.Sound) B.Sound.play("unlock"); }
          if (elapsed > walkEnd + 1.1) finish();
        }
      },
      beforeHero(ctx, sc) {
        // stepping-stone path from the start to the portal
        for (let x = x0 - 6; x < portalX; x += 4) {
          ctx.fillStyle = "#0b1020"; ctx.fillRect(x, sc.gy + 2, 3, 2);
          ctx.fillStyle = "#fef3c7"; ctx.fillRect(x, sc.gy + 1, 3, 2);
        }
        const grow = Math.min(1, elapsed / 0.6);
        B.drawPortal(ctx, portalX, sc.gy - 13, sc.t, colors, grow);
      },
      afterHero(ctx, sc) {
        if (sc.heroScale !== undefined && sc.heroScale < 0.3) {
          ctx.globalAlpha = Math.min(0.85, (0.3 - sc.heroScale) * 3);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, sc.W, sc.H);
          ctx.globalAlpha = 1;
        }
      }
    });
    scene.start();
    if (B.Sound) B.Sound.play("chest");
  }

  /* Hooks for a level banner scene: hero grows out of a portal when arriving from the previous level. */
  function arrivalHooks(levelId, color) {
    let arriving = false;
    try { arriving = sessionStorage.getItem(ARRIVE_KEY) === String(levelId); sessionStorage.removeItem(ARRIVE_KEY); } catch (e) { arriving = false; }
    if (!arriving || B.reduceMotion) return {};
    const colors = portalColors(color);
    let t = 0;
    return {
      onUpdate(dt, sc) {
        t += dt;
        sc.heroScale = t < 0.45 ? 0 : Math.min(1, (t - 0.45) / 0.5);
      },
      beforeHero(ctx, sc) {
        if (t > 1.8) return;
        const size = t < 0.45 ? t / 0.45 : t < 1.2 ? 1 : Math.max(0, 1 - (t - 1.2) / 0.6);
        B.drawPortal(ctx, sc.hx + 6, sc.gy - 12, sc.t, colors, size);
      }
    };
  }

  B.Cutscene = { portal, arrivalHooks, portalColors };
})();

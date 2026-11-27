/* Certificate: one per language track (all levels cleared) and one per Academy course (final exam passed).
   Type your name and download a pixel-art certificate (PNG). */
(function () {
  "use strict";
  const B = window.Bitwood;
  const params = new URLSearchParams(location.search);
  const $ = id => document.getElementById(id);
  const W = 1600, H = 1130;
  const fmtDate = t => new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  /* Everything a certificate can be for: language tracks and Academy courses */
  function trackSubject(T) {
    const levels = B.Tracks.levels(T.id), d = B.Store.get();
    const done = levels.filter(l => d.done[l.id]);
    const stars = done.reduce((s, l) => s + (d.done[l.id].stars || 0), 0);
    const finished = done.length ? Math.max(...done.map(l => d.done[l.id].at || 0)) : Date.now();
    const next = levels.find(l => !d.done[l.id]);
    return {
      key: "track=" + T.id, id: T.id, name: T.name, color: T.color, icon: T.icon,
      done: done.length, total: levels.length, unlocked: done.length === levels.length, unit: "levels",
      kicker: T.name.toUpperCase() + " · OF COMPLETION",
      line1: "has conquered all " + levels.length + " " + T.name + " worlds of Bitwood — the pixel coding adventure —",
      line2: "and learned " + T.topics + ".",
      stats: "★ " + stars + " / " + levels.length * 3 + " stars     ·     " + done.reduce((s, l) => s + l.xp, 0) + " XP     ·     " + fmtDate(finished),
      lockedText: "Clear every " + T.name + " level to unlock this certificate.",
      next: next ? { href: "level.html?id=" + next.id, label: "Play " + next.name } : null
    };
  }
  function courseSubject(c) {
    const p = B.Store.get().courses[c.id] || {}, e = p.exam || {};
    const lessons = Object.keys(p.lessons || {}).length;
    const nextLesson = c.lessons.findIndex((_, i) => !(p.lessons || {})[i + 1]) + 1;
    return {
      key: "course=" + c.id, id: c.id, name: c.name, color: c.color, icon: c.icon,
      done: lessons, total: c.lessons.length, unlocked: !!e.passed, unit: "lessons",
      kicker: c.title.toUpperCase(),
      line1: "has completed the " + c.title + " course of Bitwood Academy —",
      line2: c.lessons.length + " lessons and a final exam on " + c.topics + ".",
      stats: "Exam score: " + (e.best || 0) + " / " + c.exam.length + "     ·     " + (lessons * 20 + 150) + " XP     ·     " + fmtDate(e.at || Date.now()),
      lockedText: lessons < c.lessons.length ? "Finish all " + c.lessons.length + " lessons, then pass the final exam." : "Pass the final exam (14 / 20) to unlock this certificate.",
      next: lessons < c.lessons.length ? { href: "lesson.html?c=" + c.id + "&l=" + nextLesson, label: "Go to lesson " + nextLesson } : { href: "exam.html?c=" + c.id, label: "Take the exam" }
    };
  }
  function allSubjects() {
    return B.Tracks.list.map(trackSubject).concat((window.BITWOOD_COURSES || []).map(courseSubject));
  }
  function currentSubject() {
    const course = params.get("course");
    const list = allSubjects();
    if (course) return list.find(s => s.key === "course=" + course) || list[0];
    return list.find(s => s.key === "track=" + (params.get("track") || "js")) || list[0];
  }
  const SUBJECT = currentSubject();

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
    centerText(g, SUBJECT.kicker, 350, "700 36px Silkscreen, monospace", "#f8fafc");
    centerText(g, "This certifies that", 450, "500 32px Mulish, sans-serif", "#cbd5e1");
    const font = fitFont(g, name, "700", "Silkscreen, monospace", 88, W - 300);
    centerText(g, name, 560, font, "#ffffff", "#042d4d");
    g.fillStyle = "#facc15"; g.fillRect(W / 2 - 420, 590, 840, 6);
    centerText(g, SUBJECT.line1, 660, fitFont(g, SUBJECT.line1, "500", "Mulish, sans-serif", 30, W - 260), "#e2e8f0");
    centerText(g, SUBJECT.line2, 705, fitFont(g, SUBJECT.line2, "500", "Mulish, sans-serif", 30, W - 260), "#e2e8f0");
    centerText(g, SUBJECT.stats, 785, fitFont(g, SUBJECT.stats, "700", "Silkscreen, monospace", 30, W - 260), "#a3e635");

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
    wrap.innerHTML = allSubjects().map(t => {
      const on = t.key === SUBJECT.key;
      return '<a class="track-tab' + (on ? " is-active" : "") + '" href="certificate.html?' + t.key + '"' + (on ? ' aria-current="page"' : "") +
        ' style="--c:' + t.color + '"><img class="pixelated" alt="" src="' + B.spriteURL(t.icon, 3) + '"><span><b>' + B.escapeHTML(t.name) + "</b><small>" + (t.unlocked ? "Unlocked ✓" : t.done + " / " + t.total + " " + t.unit) + "</small></span></a>";
    }).join("");
  }

  async function init() {
    renderTabs();
    document.title = SUBJECT.name + " Certificate — Bitwood";
    const locked = !SUBJECT.unlocked;
    $("cert-locked").hidden = !locked;
    $("cert-open").hidden = locked;
    if (locked) {
      $("cert-what").textContent = SUBJECT.lockedText;
      $("cert-progress").textContent = SUBJECT.done + " / " + SUBJECT.total + " " + SUBJECT.unit;
      $("cert-fill").style.setProperty("--p", (SUBJECT.done / SUBJECT.total).toFixed(3));
      const btn = $("cert-continue");
      if (SUBJECT.next) { btn.href = SUBJECT.next.href; btn.querySelector(".t-label").textContent = SUBJECT.next.label; }
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
      a.download = "bitwood-" + SUBJECT.id + "-certificate-" + (slug || "player") + ".png";
      a.href = canvas.toDataURL("image/png");
      document.body.appendChild(a); a.click(); a.remove();
      if (B.Sound) B.Sound.play("win");
      B.confetti(window.innerWidth / 2, window.innerHeight / 3, 160);
      B.checkBadges();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

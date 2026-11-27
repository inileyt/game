/* Home page: adventure hero, title animation, typing demo, level cards. */
(function () {
  "use strict";
  const B = window.Bitwood;

  function splitTitle() {
    const el = document.querySelector("[data-split]");
    if (!el) return;
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    let i = 0;
    text.split(" ").forEach((word, wi, arr) => {
      const w = document.createElement("span");
      w.style.display = "inline-block";
      w.style.whiteSpace = "nowrap";
      w.setAttribute("aria-hidden", "true");
      for (const ch of word) {
        const s = document.createElement("span");
        s.className = "ch"; s.textContent = ch; s.style.setProperty("--i", i++);
        w.appendChild(s);
      }
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  function typewriter() {
    const el = document.getElementById("typed");
    if (!el || B.reduceMotion) return;
    const text = el.dataset.text;
    el.parentElement.setAttribute("aria-label", text);
    el.setAttribute("aria-hidden", "true");
    el.textContent = "";
    let i = 0;
    setTimeout(function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 28 + Math.random() * 40);
    }, 900);
  }

  function hero() {
    const canvas = document.getElementById("scene");
    if (!canvas) return;
    const out = document.getElementById("coin-count"), hud = document.getElementById("hud");
    let lastCoins = 0, activeUntil = 0, coinSave = 0;
    const scene = new B.PixelScene(canvas, {
      theme: "dawn",
      heroFrac: window.innerWidth < 640 ? 0.1 : 0.16,
      onCoin(n) {
        out.textContent = String(n).padStart(3, "0");
        hud.classList.remove("pop"); void hud.offsetWidth; hud.classList.add("pop");
        // count coins toward the Coin Collector badge (saved in small batches)
        const delta = n - lastCoins; lastCoins = n;
        coinSave += delta;
        if (coinSave >= 5) { B.Store.bumpStat("coins", coinSave); coinSave = 0; B.checkBadges(); }
      },
      // game sounds only while the player is actually playing (jumped in the last 8 seconds)
      onEvent(name, byUser) {
        if (byUser) activeUntil = performance.now() + 8000;
        if (B.Sound && performance.now() < activeUntil) B.Sound.play(name);
      }
    }).start();
    window.addEventListener("pagehide", () => { if (coinSave > 0) { B.Store.bumpStat("coins", coinSave); coinSave = 0; } });
    const heroSection = canvas.closest(".hero");
    document.addEventListener("keydown", e => {
      if ((e.code === "Space" || e.key === "ArrowUp") && !/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(document.activeElement.tagName)) {
        const r = heroSection.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) { e.preventDefault(); scene.jump(true); }
      }
    });
    heroSection.addEventListener("pointerdown", e => {
      if (e.target.closest("a, button")) return;
      scene.jump(true);
    });
  }

  /* Typing code demo driven by the three tabs */
  const DEMOS = [
    { file: "lesson.js", code: 'const hero = "Ada";\nlet coins = 3;\ncoins = coins + 2;\n\nconsole.log(`${hero} has ${coins} coins`);', out: "Ada has 5 coins" },
    { file: "quest.js", code: "function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n\nsumTo(10);", out: "✓ 5 / 5 tests passed" },
    { file: "reward.js", code: 'const player = { name: "You", xp: 0 };\n\nplayer.xp += 150;\nplayer.level = 2;\n\nconsole.log("LEVEL UP!", player.level);', out: "LEVEL UP! 2  ★ ★ ★" }
  ];
  function highlight(code) {
    return B.escapeHTML(code)
      .replace(/(&quot;.*?&quot;|`.*?`)/g, '<span class="tok-s">$1</span>')
      .replace(/\b(const|let|function|return|for)\b/g, '<span class="tok-k">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="tok-n">$1</span>');
  }
  function tabs() {
    const tabEls = [...document.querySelectorAll(".tab[data-demo]")];
    const codeEl = document.getElementById("demo-code"), outEl = document.getElementById("demo-out"), fileEl = document.getElementById("demo-file");
    if (!tabEls.length || !codeEl) return;
    let typing = 0, started = false;
    function show(idx, focus) {
      tabEls.forEach((t, i) => {
        t.setAttribute("aria-selected", String(i === idx));
        t.tabIndex = i === idx ? 0 : -1;
        const bar = t.querySelector(".tab-progress i");
        if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
      });
      if (focus) tabEls[idx].focus();
      const d = DEMOS[idx];
      fileEl.textContent = d.file;
      outEl.textContent = "";
      clearTimeout(typing);
      if (B.reduceMotion) { codeEl.innerHTML = highlight(d.code); outEl.textContent = d.out; return; }
      let i = 0;
      (function type() {
        i += 2;
        codeEl.innerHTML = highlight(d.code.slice(0, i)) + '<span class="hero-sub"><span class="cursor"></span></span>';
        if (i < d.code.length) typing = setTimeout(type, 22);
        else { codeEl.innerHTML = highlight(d.code); typing = setTimeout(() => { outEl.textContent = d.out; }, 300); }
      })();
    }
    tabEls.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", e => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show((i + 1) % tabEls.length, true); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); show((i + tabEls.length - 1) % tabEls.length, true); }
      });
      const bar = t.querySelector(".tab-progress i");
      if (bar) bar.addEventListener("animationend", () => {
        if (t.getAttribute("aria-selected") === "true" && !B.reduceMotion) show((i + 1) % tabEls.length);
      });
    });
    // start typing when visible
    const start = () => { if (!started) { started = true; show(0); } };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { start(); io.disconnect(); } }, { threshold: 0.3 });
      io.observe(codeEl);
    } else start();
  }

  /* Numbers in the stats band come straight from the level data */
  function stats() {
    const L = window.BITWOOD_LEVELS;
    const vals = {
      levels: L.length,
      questions: L.reduce((s, l) => s + (l.questions ? l.questions.length : 5), 0),
      xp: L.reduce((s, l) => s + l.xp, 0),
      stars: L.length * 3
    };
    document.querySelectorAll("[data-stat]").forEach(el => {
      const v = vals[el.dataset.stat];
      if (v === undefined) return;
      el.dataset.count = v;
      el.textContent = v;
    });
  }

  /* Contact form: validates, then opens the visitor's email app with the message filled in */
  function contactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const err = document.getElementById("cf-error"), ok = document.getElementById("cf-ok");
    const fields = { name: form.elements.name, email: form.elements.email, message: form.elements.message };
    Object.values(fields).forEach(f => f.addEventListener("input", () => { f.removeAttribute("aria-invalid"); err.hidden = true; }));
    form.addEventListener("submit", e => {
      e.preventDefault();
      ok.hidden = true;
      const name = fields.name.value.trim(), email = fields.email.value.trim(), message = fields.message.value.trim();
      const problems = [];
      if (!name) problems.push([fields.name, "Please tell us your name."]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push([fields.email, "Please enter a valid email address."]);
      if (message.length < 5) problems.push([fields.message, "Please write a message (at least 5 characters)."]);
      if (problems.length) {
        problems.forEach(([f]) => f.setAttribute("aria-invalid", "true"));
        err.textContent = problems.map(p => p[1]).join(" ");
        err.hidden = false;
        problems[0][0].focus();
        if (B.Sound) B.Sound.play("fail");
        return;
      }
      const topic = form.elements.topic.value;
      const submit = form.querySelector('button[type="submit"]');
      const label = submit.querySelector(".t-label");
      const openMail = () => {
        const subject = "Bitwood — " + topic + " from " + name;
        const body = message + "\n\n— " + name + " (" + email + ")";
        window.location.href = "mailto:innababajanyan06@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        ok.textContent = "We couldn't send it directly, so your email app is opening with the message ready — just press send! Or write to innababajanyan06@gmail.com.";
        ok.hidden = false;
      };
      if (!B.Cloud || !B.Cloud.enabled) { openMail(); return; }
      submit.disabled = true; label.textContent = "Sending…";
      B.Cloud.sendMessage({ name, email, topic, message }).then(() => {
        form.reset();
        ok.textContent = "Message sent! Thank you — Inna will reply to " + email + ".";
        ok.hidden = false;
        if (B.Sound) B.Sound.play("pass");
      }).catch(e => {
        console.warn("Bitwood message:", e && e.message);
        openMail();
      }).finally(() => { submit.disabled = false; label.textContent = "Send ✉"; });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    splitTitle();
    typewriter();
    hero();
    tabs();
    document.querySelectorAll("[data-track-grid]").forEach(g => B.renderLevelCards(g, g.dataset.trackGrid));
    stats();
    contactForm();
    // START takes returning players straight to their current level's map spot
    const done = Object.keys(B.Store.get().done).length;
    if (done > 0) {
      const lbl = document.querySelector("#start-btn .t-label");
      if (lbl) lbl.textContent = "Continue";
    }
  });
})();

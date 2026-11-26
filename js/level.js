/* Level page: lesson, code editor with highlighting, sandboxed test runner. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const LEVELS = window.BITWOOD_LEVELS;

  /* ---------------- Syntax highlighting ---------------- */
  const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|`(?:\\.|[^`\\])*`?)|\b(\d+(?:\.\d+)?)\b|\b(const|let|var|function|return|if|else|for|while|do|of|in|new|typeof|break|continue|switch|case|default|class|this)\b|\b(true|false|null|undefined|NaN)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g;
  function highlight(src) {
    let out = "", last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src))) {
      if (m[0] === "") { TOKEN.lastIndex++; continue; }
      out += B.escapeHTML(src.slice(last, m.index));
      const cls = m[1] ? "tok-c" : m[2] ? "tok-s" : m[3] ? "tok-n" : m[4] ? "tok-k" : m[5] ? "tok-b" : "tok-f";
      out += '<span class="' + cls + '">' + B.escapeHTML(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + B.escapeHTML(src.slice(last));
  }

  const fmt = v => {
    if (typeof v === "string") return JSON.stringify(v);
    try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); }
  };

  /* ---------------- Sandboxed runner (Web Worker + timeout) ---------------- */
  const WORKER_SRC = `
    self.onmessage = function (e) {
      var d = e.data, logs = [];
      function f(v) { if (typeof v === "string") return v; try { var s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (_) { return String(v); } }
      var fakeConsole = { log: function () { logs.push(Array.prototype.map.call(arguments, f).join(" ")); } };
      fakeConsole.info = fakeConsole.warn = fakeConsole.error = fakeConsole.log;
      var fn;
      try {
        fn = new Function("console", d.code + "\\n;return (typeof " + d.fn + " === 'function') ? " + d.fn + " : undefined;")(fakeConsole);
      } catch (err) {
        self.postMessage({ error: (err && err.name ? err.name + ": " : "") + (err && err.message ? err.message : String(err)), logs: logs });
        return;
      }
      if (typeof fn !== "function") { self.postMessage({ error: "I can't find a function called " + d.fn + "(). Did you rename it?", logs: logs }); return; }
      var results = d.tests.map(function (t) {
        try {
          var out = fn.apply(null, JSON.parse(JSON.stringify(t.args)));
          var pass = JSON.stringify(out) === JSON.stringify(t.expected) && typeof out === typeof t.expected;
          var shown; try { shown = JSON.stringify(out); } catch (_) { shown = String(out); }
          return { pass: pass, got: shown === undefined ? "undefined" : shown };
        } catch (err) {
          return { pass: false, got: (err && err.name ? err.name + ": " : "") + (err && err.message ? err.message : String(err)), threw: true };
        }
      });
      self.postMessage({ results: results, logs: logs });
    };`;

  let workerURL = null;
  function runCode(code, level) {
    const payload = { code, fn: level.fn, tests: level.tests };
    return new Promise(resolve => {
      let worker;
      try {
        if (!workerURL) workerURL = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
        worker = new Worker(workerURL);
      } catch (e) {
        resolve(runInline(payload));
        return;
      }
      const timer = setTimeout(() => {
        worker.terminate();
        resolve({ error: "Your code ran for too long (over 2 seconds). Is there a loop that never ends?", logs: [] });
      }, 2000);
      worker.onmessage = e => { clearTimeout(timer); worker.terminate(); resolve(e.data); };
      worker.onerror = e => { e.preventDefault(); clearTimeout(timer); worker.terminate(); resolve({ error: e.message || "Something went wrong running your code.", logs: [] }); };
      worker.postMessage(payload);
    });
  }
  /* Fallback when workers are unavailable (no timeout protection) */
  function runInline(d) {
    const logs = [];
    const fakeConsole = { log: (...a) => logs.push(a.map(v => typeof v === "string" ? v : fmt(v)).join(" ")) };
    let fn;
    try { fn = new Function("console", d.code + "\n;return (typeof " + d.fn + " === 'function') ? " + d.fn + " : undefined;")(fakeConsole); }
    catch (err) { return { error: err.name + ": " + err.message, logs }; }
    if (typeof fn !== "function") return { error: "I can't find a function called " + d.fn + "(). Did you rename it?", logs };
    return {
      logs, results: d.tests.map(t => {
        try {
          const out = fn(...JSON.parse(JSON.stringify(t.args)));
          return { pass: JSON.stringify(out) === JSON.stringify(t.expected) && typeof out === typeof t.expected, got: out === undefined ? "undefined" : fmt(out) };
        } catch (err) { return { pass: false, got: err.name + ": " + err.message, threw: true }; }
      })
    };
  }

  /* ---------------- Page ---------------- */
  function getLevel() {
    const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
    return LEVELS.find(l => l.id === id) || LEVELS[0];
  }

  function init() {
    const level = getLevel();
    document.title = "Level " + level.id + ": " + level.name + " — Bitwood";
    document.getElementById("level-lv").textContent = "Level " + level.id + " · " + level.topic;
    document.getElementById("level-title").textContent = level.name;
    document.getElementById("file-name").textContent = level.slug + ".js";

    new B.PixelScene(document.getElementById("banner"), { theme: level.theme, pixel: 3, heroFrac: 0.82, speed: 26, seed: level.id }).start();

    if (!B.Store.isUnlocked(level.id)) { renderLocked(level); return; }

    // lesson
    const body = document.getElementById("lesson-body");
    let html = '<span class="eyebrow" style="color:' + level.color + '">Lesson · ' + B.escapeHTML(level.topic) + "</span>";
    level.lesson.forEach(block => {
      if (block.p) html += "<p>" + block.p + "</p>";
      if (block.code) html += "<pre><code>" + highlight(block.code) + "</code></pre>";
    });
    body.innerHTML = html;
    body.style.display = "flex"; body.style.flexDirection = "column"; body.style.gap = "14px";
    document.getElementById("task").innerHTML = level.task;
    document.getElementById("hint").innerHTML = level.hint;
    const testsEl = document.getElementById("tests");
    testsEl.innerHTML = level.tests.map((t, i) =>
      '<li data-i="' + i + '"><span class="dot" aria-hidden="true"></span><span><span class="sr-only status">Not run. </span>' +
      B.escapeHTML(level.fn + "(" + t.args.map(fmt).join(", ") + ")") + " → " + B.escapeHTML(fmt(t.expected)) +
      '<span class="got"></span></span></li>').join("");

    setupEditor(level);
  }

  function renderLocked(level) {
    const play = document.getElementById("play");
    const prev = LEVELS[level.id - 2];
    play.style.display = "block";
    play.innerHTML =
      '<div class="pixel-box" style="max-width:560px;margin:0 auto;padding:36px 28px;text-align:center">' +
      '<img src="' + B.spriteURL("lock", 6) + '" alt="" class="pixelated" style="width:48px;height:54px;margin:0 auto 16px">' +
      "<h2>This world is still locked</h2>" +
      '<p style="margin:10px 0 24px">Clear Level ' + prev.id + " — " + B.escapeHTML(prev.name) + " — to open the path to " + B.escapeHTML(level.name) + ".</p>" +
      '<a class="btn btn-start" href="level.html?id=' + prev.id + '"><span class="t-label">Go to level ' + prev.id + "</span></a></div>";
  }

  function setupEditor(level) {
    const ta = document.getElementById("code"), hl = document.getElementById("hl"), gutter = document.getElementById("gutter");
    const pre = hl.parentElement;
    const saved = B.Store.get().code[level.id];
    ta.value = typeof saved === "string" ? saved : level.starter;

    let saveTimer = 0;
    function refresh() {
      hl.innerHTML = highlight(ta.value) + "\n";
      const lines = ta.value.split("\n").length;
      let g = "";
      for (let i = 1; i <= lines; i++) g += i + "\n";
      gutter.textContent = g;
      syncScroll();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => B.Store.saveCode(level.id, ta.value), 300);
    }
    function syncScroll() {
      pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop;
    }
    function insert(text) {
      ta.focus();
      let ok = false;
      try { ok = document.execCommand("insertText", false, text); } catch (e) { ok = false; }
      if (!ok) { ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end"); refresh(); }
    }
    ta.addEventListener("input", refresh);
    ta.addEventListener("scroll", syncScroll);
    ta.addEventListener("keydown", e => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); return; }
      if (e.key === "Tab" && !e.shiftKey && !e.altKey) {
        // Tab indents; press Escape first to move focus out of the editor with Tab
        if (ta.dataset.escaped === "1") { ta.dataset.escaped = ""; return; }
        e.preventDefault(); insert("  "); return;
      }
      if (e.key === "Escape") { ta.dataset.escaped = "1"; return; }
      if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf("\n") + 1);
        let indent = (line.match(/^\s*/) || [""])[0];
        if (/[{[(]\s*$/.test(line)) indent += "  ";
        e.preventDefault(); insert("\n" + indent);
      }
      ta.dataset.escaped = "";
    });
    refresh();

    const runBtn = document.getElementById("run");
    const consoleEl = document.getElementById("console");
    const hintBox = document.getElementById("hint-box");
    let fails = 0, hintUsed = false, busy = false;

    function log(text, cls) {
      const d = document.createElement("div");
      d.className = "line " + (cls || "log");
      d.textContent = text;
      consoleEl.appendChild(d);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    async function run() {
      if (busy) return;
      busy = true;
      runBtn.setAttribute("aria-busy", "true");
      runBtn.querySelector(".t-label").textContent = "Running";
      consoleEl.innerHTML = "";
      log("$ node " + level.slug + ".js", "muted");
      const res = await runCode(ta.value, level);
      busy = false;
      runBtn.removeAttribute("aria-busy");
      runBtn.querySelector(".t-label").textContent = "Run ▶";
      (res.logs || []).forEach(l => log(l, "log"));
      const items = document.querySelectorAll("#tests li");
      items.forEach(li => { li.classList.remove("pass", "fail"); li.querySelector(".got").textContent = ""; li.querySelector(".status").textContent = "Not run. "; });
      if (res.error) {
        fails++;
        log("✗ " + res.error, "err");
        return;
      }
      let passed = 0;
      res.results.forEach((r, i) => {
        const li = items[i];
        li.classList.add(r.pass ? "pass" : "fail");
        li.querySelector(".status").textContent = r.pass ? "Passed. " : "Failed. ";
        if (r.pass) passed++;
        else li.querySelector(".got").textContent = (r.threw ? "error: " : "got: ") + r.got;
      });
      const total = res.results.length;
      if (passed === total) {
        log("✓ " + passed + " / " + total + " tests passed — level clear!", "ok");
        win(level, fails, hintUsed);
      } else {
        fails++;
        log("✗ " + passed + " / " + total + " tests passed. Check the red tests on the left.", "err");
        if (fails >= 2 && !hintBox.classList.contains("is-open")) log("Tip: stuck? Press Hint for a nudge.", "muted");
      }
    }

    runBtn.addEventListener("click", run);
    document.getElementById("hint-btn").addEventListener("click", () => {
      hintUsed = true;
      hintBox.classList.add("is-open");
      hintBox.scrollIntoView({ behavior: B.reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
    document.getElementById("reset-code").addEventListener("click", () => {
      if (ta.value !== level.starter && !window.confirm("Replace your code with the starter code?")) return;
      ta.value = level.starter;
      refresh();
      ta.focus();
    });
  }

  function win(level, fails, hintUsed) {
    const stars = Math.max(1, 3 - (hintUsed ? 1 : 0) - (fails >= 3 ? 1 : 0));
    const already = B.Store.isDone(level.id);
    B.Store.complete(level.id, { xp: level.xp, stars, at: Date.now() });
    B.updateXP(true);

    const modal = document.getElementById("win");
    const starsEl = document.getElementById("win-stars");
    starsEl.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const img = document.createElement("img");
      img.src = B.spriteURL("star", 4); img.alt = ""; img.className = "pixelated" + (i < stars ? "" : " off");
      starsEl.appendChild(img);
    }
    starsEl.setAttribute("aria-label", stars + " of 3 stars");
    const last = level.id === LEVELS.length;
    document.getElementById("win-title").textContent = last ? "Boss defeated!" : "Level clear!";
    document.getElementById("win-text").textContent = last
      ? "You conquered all five worlds of Bitwood. You're a real coder now!"
      : "The path to " + LEVELS[level.id].name + " is open.";
    document.getElementById("win-xp").textContent = already ? "Replay complete" : "+" + level.xp + " XP";
    const next = document.getElementById("win-next");
    next.href = last ? "levels.html" : "level.html?id=" + (level.id + 1);
    next.querySelector(".t-label").textContent = last ? "World map" : "Next level";

    const opener = document.activeElement;
    modal.classList.add("is-open");
    next.focus();
    const r = document.getElementById("run").getBoundingClientRect();
    B.confetti(r.left + r.width / 2, r.top, 140);
    function close() {
      modal.classList.remove("is-open");
      document.removeEventListener("keydown", onKey);
      if (opener && opener.focus) opener.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { // simple focus trap
        const f = [next, document.getElementById("win-stay")];
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    }
    document.addEventListener("keydown", onKey);
    document.getElementById("win-stay").onclick = close;
    modal.onclick = e => { if (e.target === modal) close(); };
  }

  document.addEventListener("DOMContentLoaded", init);
})();

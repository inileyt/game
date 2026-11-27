/* Shared code editor, syntax highlighting and sandboxed runner.
   Used by the level page, the daily challenge and the playground. */
(function () {
  "use strict";
  const B = window.Bitwood;

  /* ---------------- Syntax highlighting (JavaScript, Go, PHP) ---------------- */
  const LANGS = {
    js: {
      comment: String.raw`\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)`,
      string: String.raw`"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|` + "`(?:\\\\.|[^`\\\\])*`?",
      keyword: "const|let|var|function|return|if|else|for|while|do|of|in|new|typeof|break|continue|switch|case|default|class|this",
      builtin: "true|false|null|undefined|NaN",
      special: "(?!)"
    },
    go: {
      comment: String.raw`\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)`,
      string: String.raw`"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|` + "`[^`]*`?",
      keyword: "package|import|func|return|if|else|for|range|var|const|type|struct|map|chan|go|defer|switch|case|default|break|continue|int|float64|string|bool",
      builtin: "true|false|nil|len|append|make",
      special: "(?!)"
    },
    php: {
      comment: String.raw`\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?(?:\*\/|$)`,
      string: String.raw`"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?`,
      keyword: "echo|function|return|if|elseif|else|for|foreach|as|while|do|switch|case|default|break|continue|new|class|print",
      builtin: "true|false|null|count",
      special: String.raw`\$[A-Za-z_]\w*|<\?php|\?>`
    }
  };
  const HASH_COMMENT = String.raw`#[^\n]*`;
  const DQ = String.raw`"(?:\\.|[^"\\\n])*"?`, SQ = String.raw`'(?:\\.|[^'\\\n])*'?`;
  Object.assign(LANGS, {
    html: { comment: String.raw`<!--[\s\S]*?(?:-->|$)`, string: DQ + "|" + SQ, keyword: "DOCTYPE", builtin: "(?!)", special: String.raw`<\/?[A-Za-z][\w-]*|\/?>|!DOCTYPE` },
    css: { comment: String.raw`\/\*[\s\S]*?(?:\*\/|$)`, string: DQ + "|" + SQ, keyword: "(?!)", builtin: "auto|none|flex|grid|block|center|solid|repeat", special: String.raw`[\w-]+(?=\s*:[^:])|@media|#[\w-]+|\.[A-Za-z][\w-]*` },
    bash: { comment: HASH_COMMENT, string: DQ + "|" + SQ, keyword: "git|npm|docker|kubectl|sudo|cd|ls|mkdir|cat|tail|grep|chmod|systemctl|pwd|wc|echo", builtin: "(?!)", special: String.raw`(?:^|\s)-{1,2}[\w-]+` },
    yaml: { comment: HASH_COMMENT, string: DQ + "|" + SQ, keyword: "(?!)", builtin: "true|false|null", special: String.raw`[\w./-]+(?=:(?:\s|$))` },
    sql: { comment: String.raw`--[^\n]*`, string: SQ, keyword: "SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|ON|ORDER|BY|DESC|ASC|LIMIT|CREATE|TABLE|INDEX|AND|OR|NOT|NULL|PRIMARY|KEY|REFERENCES", builtin: "(?!)", special: "(?!)" },
    json: { comment: "(?!)", string: DQ, keyword: "(?!)", builtin: "true|false|null", special: "(?!)" },
    docker: { comment: HASH_COMMENT, string: DQ, keyword: "FROM|WORKDIR|COPY|RUN|EXPOSE|CMD|ENV|ARG|ENTRYPOINT", builtin: "(?!)", special: "(?!)" }
  });
  const TOKENS = {};
  function tokenRe(lang) {
    if (TOKENS[lang]) return TOKENS[lang];
    const l = LANGS[lang] || LANGS.js;
    TOKENS[lang] = new RegExp("(" + l.comment + ")|(" + l.string + ")|\\b(\\d+(?:\\.\\d+)?)\\b|\\b(" + l.keyword + ")\\b|\\b(" + l.builtin + ")\\b|(" + l.special + ")|([A-Za-z_$][\\w$]*)(?=\\s*\\()", "g");
    return TOKENS[lang];
  }
  function highlight(src, lang) {
    if (lang === "text") return B.escapeHTML(src);
    const TOKEN = tokenRe(lang || "js");
    let out = "", last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src))) {
      if (m[0] === "") { TOKEN.lastIndex++; continue; }
      out += B.escapeHTML(src.slice(last, m.index));
      const cls = m[1] ? "tok-c" : m[2] ? "tok-s" : m[3] ? "tok-n" : m[4] ? "tok-k" : m[5] ? "tok-b" : m[6] ? "tok-v" : "tok-f";
      out += '<span class="' + cls + '">' + B.escapeHTML(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + B.escapeHTML(src.slice(last));
  }

  const fmt = v => {
    if (typeof v === "string") return JSON.stringify(v);
    try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); }
  };

  /* ---------------- Sandboxed runner (Web Worker + timeout) ----------------
     mode "tests": defines the player's code, finds function `fn`, runs each test.
     mode "free":  runs the code top to bottom; console.log, pixel(x, y, color)
                   and clear(color) are available (for the playground). */
  const WORKER_SRC = `
    self.onmessage = function (e) {
      var d = e.data, logs = [], draws = [];
      function f(v) { if (typeof v === "string") return v; try { var s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (_) { return String(v); } }
      function errText(err) { return (err && err.name ? err.name + ": " : "") + (err && err.message ? err.message : String(err)); }
      var fakeConsole = { log: function () { if (logs.length < 500) logs.push(Array.prototype.map.call(arguments, f).join(" ")); } };
      fakeConsole.info = fakeConsole.warn = fakeConsole.error = fakeConsole.log;
      function pixel(x, y, color) { if (draws.length < 20000) draws.push(["p", Math.floor(Number(x)), Math.floor(Number(y)), String(color || "#facc15")]); }
      function clear(color) { draws.push(["c", String(color || "#020617")]); }
      if (d.mode === "free") {
        try {
          new Function("console", "pixel", "clear", d.code)(fakeConsole, pixel, clear);
          self.postMessage({ logs: logs, draws: draws });
        } catch (err) {
          self.postMessage({ error: errText(err), logs: logs, draws: draws });
        }
        return;
      }
      var fn;
      try {
        fn = new Function("console", d.code + "\\n;return (typeof " + d.fn + " === 'function') ? " + d.fn + " : undefined;")(fakeConsole);
      } catch (err) {
        self.postMessage({ error: errText(err), logs: logs });
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
          return { pass: false, got: errText(err), threw: true };
        }
      });
      self.postMessage({ results: results, logs: logs });
    };`;

  let workerURL = null;
  function execute(payload, timeoutMs) {
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
        resolve({ error: "Your code ran for too long (over " + Math.round(timeoutMs / 1000) + " seconds). Is there a loop that never ends?", logs: [] });
      }, timeoutMs);
      worker.onmessage = e => { clearTimeout(timer); worker.terminate(); resolve(e.data); };
      worker.onerror = e => { e.preventDefault(); clearTimeout(timer); worker.terminate(); resolve({ error: e.message || "Something went wrong running your code.", logs: [] }); };
      worker.postMessage(payload);
    });
  }
  /* Fallback when workers are unavailable (no timeout protection) */
  function runInline(d) {
    const logs = [], draws = [];
    const fakeConsole = { log: (...a) => logs.push(a.map(v => typeof v === "string" ? v : fmt(v)).join(" ")) };
    if (d.mode === "free") {
      try {
        new Function("console", "pixel", "clear", d.code)(fakeConsole, (x, y, c) => draws.push(["p", Math.floor(x), Math.floor(y), String(c || "#facc15")]), c => draws.push(["c", String(c || "#020617")]));
        return { logs, draws };
      } catch (err) { return { error: err.name + ": " + err.message, logs, draws }; }
    }
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
  const runTests = (code, ch) => execute({ mode: "tests", code, fn: ch.fn, tests: ch.tests }, 2000);
  const runFree = code => execute({ mode: "free", code }, 3000);

  /* ---------------- Editor: textarea + highlighted <pre> + line numbers ---------------- */
  /* Swap an element for a fresh copy so old event listeners are dropped (lets us re-mount). */
  function fresh(id) {
    const el = document.getElementById(id);
    const c = el.cloneNode(true);
    el.replaceWith(c);
    return c;
  }

  function createEditor(opts) {
    const ta = fresh(opts.textarea || "code");
    const hl = document.getElementById(opts.highlight || "hl");
    const gutter = document.getElementById(opts.gutter || "gutter");
    const pre = hl.parentElement;
    ta.value = opts.initial || "";
    let saveTimer = 0;
    function refresh() {
      hl.innerHTML = highlight(ta.value) + "\n";
      const lines = ta.value.split("\n").length;
      let g = "";
      for (let i = 1; i <= lines; i++) g += i + "\n";
      gutter.textContent = g;
      syncScroll();
      if (opts.onChange) { clearTimeout(saveTimer); saveTimer = setTimeout(() => opts.onChange(ta.value), 300); }
    }
    function syncScroll() { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gutter.scrollTop = ta.scrollTop; }
    function insert(text) {
      ta.focus();
      let ok = false;
      try { ok = document.execCommand("insertText", false, text); } catch (e) { ok = false; }
      if (!ok) { ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end"); refresh(); }
    }
    ta.addEventListener("input", refresh);
    ta.addEventListener("scroll", syncScroll);
    ta.addEventListener("keydown", e => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (opts.onRun) opts.onRun(); return; }
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
    return {
      el: ta,
      get value() { return ta.value; },
      set value(v) { ta.value = v; refresh(); },
      focus() { ta.focus(); }
    };
  }

  /* ---------------- Console output ---------------- */
  function createConsole(el) {
    return {
      clear() { el.innerHTML = ""; },
      log(text, cls) {
        const d = document.createElement("div");
        d.className = "line " + (cls || "log");
        d.textContent = text;
        el.appendChild(d);
        el.scrollTop = el.scrollHeight;
      }
    };
  }

  /* ---------------- A full test challenge (levels + daily) ----------------
     ch: { fn, tests, starter, hint, slug }
     opts: { initial, onSave(code), onWin({ fails, hintUsed }) } */
  function mountChallenge(ch, opts) {
    const testsEl = document.getElementById("tests");
    testsEl.innerHTML = ch.tests.map((t, i) =>
      '<li data-i="' + i + '"><span class="dot" aria-hidden="true"></span><span><span class="sr-only status">Not run. </span>' +
      B.escapeHTML(ch.fn + "(" + t.args.map(fmt).join(", ") + ")") + " → " + B.escapeHTML(fmt(t.expected)) +
      '<span class="got"></span></span></li>').join("");
    document.getElementById("hint").innerHTML = ch.hint;

    const runBtn = fresh("run");
    const hintBtn = fresh("hint-btn");
    const resetBtn = fresh("reset-code");
    const out = createConsole(document.getElementById("console"));
    out.clear();
    out.log("// Output appears here. Press Run when you are ready.", "muted");
    const hintBox = document.getElementById("hint-box");
    hintBox.classList.remove("is-open");
    let fails = 0, hintUsed = false, busy = false;

    const editor = createEditor({ initial: typeof opts.initial === "string" ? opts.initial : ch.starter, onChange: opts.onSave, onRun: run });

    async function run() {
      if (busy) return;
      busy = true;
      runBtn.setAttribute("aria-busy", "true");
      runBtn.querySelector(".t-label").textContent = "Running";
      out.clear();
      out.log("$ node " + ch.slug + ".js", "muted");
      if (B.Sound) B.Sound.play("run");
      const res = await runTests(editor.value, ch);
      busy = false;
      runBtn.removeAttribute("aria-busy");
      runBtn.querySelector(".t-label").textContent = "Run ▶";
      (res.logs || []).forEach(l => out.log(l, "log"));
      const items = testsEl.querySelectorAll("li");
      items.forEach(li => { li.classList.remove("pass", "fail"); li.querySelector(".got").textContent = ""; li.querySelector(".status").textContent = "Not run. "; });
      if (res.error) {
        fails++;
        out.log("✗ " + res.error, "err");
        if (B.Sound) B.Sound.play("fail");
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
        out.log("✓ " + passed + " / " + total + " tests passed — " + (opts.winText || "level clear!"), "ok");
        if (B.Sound) B.Sound.play(opts.quietWin ? "pass" : "win");
        opts.onWin({ fails, hintUsed });
      } else {
        fails++;
        out.log("✗ " + passed + " / " + total + " tests passed. Check the red tests on the left.", "err");
        if (B.Sound) B.Sound.play("fail");
        if (fails >= 2 && !hintBox.classList.contains("is-open")) out.log("Tip: stuck? Press Hint for a nudge.", "muted");
      }
    }

    runBtn.addEventListener("click", run);
    hintBtn.addEventListener("click", () => {
      hintUsed = true;
      hintBox.classList.add("is-open");
      hintBox.scrollIntoView({ behavior: B.reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
    resetBtn.addEventListener("click", () => {
      if (editor.value !== ch.starter && !window.confirm("Replace your code with the starter code?")) return;
      editor.value = ch.starter;
      editor.focus();
    });
    return { editor, run };
  }

  B.Code = { highlight, fmt, runTests, runFree, createEditor, createConsole, mountChallenge, fresh };
})();

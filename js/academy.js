/* Bitwood Academy: Frontend, Backend and DevOps courses.
   Pages: courses.html (hub), course.html?c=id, lesson.html?c=id&l=n, exam.html?c=id */
(function () {
  "use strict";
  const B = window.Bitwood;
  const COURSES = window.BITWOOD_COURSES || [];
  const LESSON_XP = 20, EXAM_XP = 150, PASS = 14;
  const $ = id => document.getElementById(id);
  const esc = B.escapeHTML;
  const params = new URLSearchParams(location.search);

  /* ---------------- progress ---------------- */
  const progress = id => B.Store.get().courses[id] || {};
  const lessonsDone = id => Object.keys(progress(id).lessons || {}).length;
  const isLessonDone = (id, n) => !!(progress(id).lessons || {})[n];
  const examInfo = id => progress(id).exam || null;
  const examUnlocked = c => lessonsDone(c.id) >= c.lessons.length;
  function markLesson(id, n) {
    let fresh = false;
    B.Store.update(d => {
      const c = d.courses[id] = d.courses[id] || { lessons: {} };
      c.lessons = c.lessons || {};
      if (!c.lessons[n]) { c.lessons[n] = Date.now(); fresh = true; }
    });
    return fresh;
  }
  function saveExam(id, score) {
    let firstPass = false;
    B.Store.update(d => {
      const c = d.courses[id] = d.courses[id] || { lessons: {} };
      const e = c.exam || { best: 0, passed: false, attempts: 0 };
      if (score >= PASS && !e.passed) firstPass = true;
      e.best = Math.max(e.best || 0, score);
      e.passed = e.passed || score >= PASS;
      e.attempts = (e.attempts || 0) + 1;
      e.at = Date.now();
      c.exam = e;
    });
    return firstPass;
  }
  const TIME_LIMIT = 600; // seconds for the timed challenge
  const better = (a, b) => !b || a.score > b.score || (a.score === b.score && a.seconds < b.seconds);
  function saveTimed(id, score, seconds) {
    let improved = false;
    B.Store.update(d => {
      const c = d.courses[id] = d.courses[id] || { lessons: {} };
      const t = c.timed || { attempts: 0 };
      if (better({ score, seconds }, t.best !== undefined ? { score: t.best, seconds: t.bestTime } : null)) { t.best = score; t.bestTime = seconds; improved = true; }
      t.attempts = (t.attempts || 0) + 1;
      c.timed = t;
    });
    return improved;
  }
  const mmss = s => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const getCourse = () => COURSES.find(c => c.id === params.get("c")) || COURSES[0];

  /* shuffle a question's options; returns { options, answer } with the correct index remapped */
  function shuffled(q) {
    const idx = q.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return { options: idx.map(i => q.options[i]), answer: idx.indexOf(q.answer) };
  }

  function banner(c, opts) {
    const cv = $("banner");
    if (cv) new B.PixelScene(cv, Object.assign({ theme: c.theme, pixel: 3, heroFrac: 0.82, speed: 22, seed: COURSES.indexOf(c) + 3 }, opts || {})).start();
  }
  function bar(p) { return '<div class="xp-bar ac-bar" role="presentation"><i style="--p:' + p.toFixed(3) + '"></i></div>'; }
  function examTag(c) {
    const e = examInfo(c.id);
    if (e && e.passed) return '<span class="tag done">Exam passed · ' + e.best + "/20</span>";
    if (examUnlocked(c)) return '<span class="tag ready">Exam ready' + (e ? " · best " + e.best + "/20" : "") + "</span>";
    return '<span class="tag lock">Exam locked</span>';
  }

  /* ---------------- hub ---------------- */
  function renderHub() {
    const grid = $("ac-grid");
    grid.innerHTML = COURSES.map((c, i) => {
      const done = lessonsDone(c.id), e = examInfo(c.id);
      const next = c.lessons.findIndex((_, n) => !isLessonDone(c.id, n + 1));
      const cta = e && e.passed ? "Review" : done === 0 ? "Start course" : next === -1 ? "Final exam" : "Continue";
      return '<article class="pixel-box ac-card" data-reveal style="--c:' + c.color + ";--d:" + i * 90 + 'ms">' +
        '<canvas class="ac-thumb" aria-hidden="true" data-theme="' + c.theme + '"></canvas>' +
        '<div class="ac-body"><span class="lv" style="color:' + c.color + '">' + c.lessons.length + " lessons · 1 final exam</span>" +
        "<h2>" + esc(c.title) + "</h2><p>" + esc(c.blurb) + "</p>" +
        '<div class="ac-prog">' + bar(done / c.lessons.length) + '<span class="xp-text">' + done + " / " + c.lessons.length + "</span></div>" +
        '<div class="tags">' + examTag(c) + "</div>" +
        '<a class="btn btn-start sm" href="course.html?c=' + c.id + '"><span class="t-label">' + cta + "</span></a></div></article>";
    }).join("");
    grid.querySelectorAll(".ac-thumb").forEach((cv, i) => new B.PixelScene(cv, { theme: cv.dataset.theme, pixel: 2, animate: false, entities: false, hero: true, heroFrac: 0.15, seed: i + 5 }).renderStill(2));
    B.initReveal(grid);
  }

  /* ---------------- course page ---------------- */
  function renderCourse() {
    const c = getCourse();
    document.title = c.title + " — Bitwood Academy";
    $("ac-kicker").textContent = "Course · " + c.lessons.length + " lessons · final exam";
    $("ac-title").textContent = c.title;
    banner(c);
    const done = lessonsDone(c.id);
    $("ac-lessons").innerHTML = c.lessons.map((l, i) => {
      const n = i + 1, ok = isLessonDone(c.id, n);
      return '<li><a class="ac-lesson' + (ok ? " is-done" : "") + '" href="lesson.html?c=' + c.id + "&l=" + n + '" style="--c:' + c.color + '">' +
        '<span class="ac-num">' + (ok ? "✓" : n) + "</span>" +
        '<span class="ac-ltext"><b>' + esc(l.title) + "</b><small>" + esc(l.summary) + "</small></span>" +
        '<span class="ac-min">' + l.minutes + " min</span></a></li>";
    }).join("");
    const e = examInfo(c.id), unlocked = examUnlocked(c);
    const xp = done * LESSON_XP + (e && e.passed ? EXAM_XP : 0);
    $("ac-side").innerHTML =
      '<h2>Your progress</h2><p class="ac-lead">' + esc(c.blurb) + "</p>" +
      '<div class="ac-prog">' + bar(done / c.lessons.length) + '<span class="xp-text">' + done + " / " + c.lessons.length + " lessons</span></div>" +
      '<p class="ac-xp"><img class="pixelated" alt="" src="' + B.spriteURL("star", 2) + '"> ' + xp + " / " + (c.lessons.length * LESSON_XP + EXAM_XP) + " XP</p>" +
      '<div class="ac-exam' + (unlocked ? "" : " is-locked") + '">' +
      '<img class="pixelated" alt="" src="' + B.spriteURL(unlocked ? "scroll" : "lock", 4) + '">' +
      "<div><h3>Final exam</h3><p>" + (unlocked
        ? "20 questions · pass with " + PASS + " correct" + (e ? " · best: " + e.best + "/20" : "")
        : "Finish all " + c.lessons.length + " lessons to unlock it (" + (c.lessons.length - done) + " to go).") + "</p></div></div>" +
      (unlocked ? '<a class="btn btn-start" href="exam.html?c=' + c.id + '"><span class="t-label">' + (e && e.passed ? "Retake exam" : "Start exam") + "</span></a>"
        : '<a class="btn btn-start" href="lesson.html?c=' + c.id + "&l=" + (c.lessons.findIndex((_, i) => !isLessonDone(c.id, i + 1)) + 1) + '"><span class="t-label">' + (done ? "Continue" : "Start lesson 1") + "</span></a>") +
      (e && e.passed ? '<a class="btn btn-code" href="certificate.html?course=' + c.id + '">Get certificate</a>' : "");
  }

  /* ---------------- lesson page ---------------- */
  function renderLesson() {
    const c = getCourse();
    const n = Math.min(c.lessons.length, Math.max(1, parseInt(params.get("l"), 10) || 1));
    const L = c.lessons[n - 1];
    document.title = L.title + " — " + c.name + " — Bitwood Academy";
    const crumb = document.querySelector(".crumbs a");
    crumb.href = "course.html?c=" + c.id; crumb.textContent = "← " + c.title;
    $("ac-kicker").textContent = c.name + " · Lesson " + n + " / " + c.lessons.length + " · " + L.minutes + " min";
    $("ac-title").textContent = L.title;
    banner(c, { heroFrac: 0.1 + 0.72 * (n - 1) / (c.lessons.length - 1) });

    let html = '<p class="ac-summary">' + esc(L.summary) + "</p>";
    L.sections.forEach(s => {
      html += "<h2>" + esc(s.h) + "</h2>";
      (s.p || []).forEach(p => { html += "<p>" + p + "</p>"; });
      if (s.code) html += '<pre class="ac-code"><code>' + B.Code.highlight(s.code, s.lang || "text") + "</code></pre>";
      if (s.diagram) html += '<div class="diagram-slot" data-diagram="' + esc(s.diagram) + '"></div>';
    });
    html += '<div class="ac-points"><h3><img class="pixelated" alt="" src="' + B.spriteURL("star", 2) + '"> Key points</h3><ul>' + L.points.map(p => "<li>" + p + "</li>").join("") + "</ul></div>";
    html += '<section class="ac-checks" aria-labelledby="check-title"><h2 id="check-title">Check your understanding</h2><p class="ac-hint">Answer both questions to finish the lesson' + (isLessonDone(c.id, n) ? "" : " and earn +" + LESSON_XP + " XP") + ".</p>";
    L.checks.forEach((q, i) => {
      html += '<div class="ac-check" data-q="' + i + '"><p class="ac-q"><b>' + (i + 1) + ".</b> " + q.q + '</p><div class="q-options"></div><div class="q-feedback" hidden></div></div>';
    });
    html += '<div class="ac-done" id="ac-done" hidden></div></section>';
    html += '<nav class="ac-nav" aria-label="Lesson navigation">' +
      (n > 1 ? '<a class="btn btn-code" href="lesson.html?c=' + c.id + "&l=" + (n - 1) + '">◀ Previous</a>' : "<span></span>") +
      (n < c.lessons.length ? '<a class="btn btn-code" href="lesson.html?c=' + c.id + "&l=" + (n + 1) + '">Next ▶</a>' : '<a class="btn btn-code" href="exam.html?c=' + c.id + '">Final exam ▶</a>') + "</nav>";
    $("ac-article").innerHTML = html;
    if (B.Glossary) B.Glossary.link($("ac-article"));
    if (B.Diagrams) B.Diagrams.mountAll($("ac-article"));

    // sidebar: all lessons
    $("ac-toc").innerHTML = "<h2>" + esc(c.name) + " lessons</h2><ol>" + c.lessons.map((l, i) =>
      '<li><a href="lesson.html?c=' + c.id + "&l=" + (i + 1) + '" class="' + (i + 1 === n ? "is-current" : "") + (isLessonDone(c.id, i + 1) ? " is-done" : "") + '"' + (i + 1 === n ? ' aria-current="page"' : "") + '>' +
      '<span class="ac-num">' + (isLessonDone(c.id, i + 1) ? "✓" : i + 1) + "</span>" + esc(l.title) + "</a></li>").join("") + "</ol>" +
      '<a class="ac-toc-exam' + (examUnlocked(c) ? "" : " is-locked") + '" href="exam.html?c=' + c.id + '"><img class="pixelated" alt="" src="' + B.spriteURL(examUnlocked(c) ? "scroll" : "lock", 2) + '"> Final exam</a>';

    // checks
    const solved = new Set();
    $("ac-article").querySelectorAll(".ac-check").forEach(box => {
      const q = L.checks[+box.dataset.q], s = shuffled(q);
      const opts = box.querySelector(".q-options"), fb = box.querySelector(".q-feedback");
      opts.innerHTML = s.options.map((o, i) => '<button type="button" class="q-opt" data-i="' + i + '"><span class="q-letter">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span></button>").join("");
      opts.querySelectorAll(".q-opt").forEach(btn => btn.addEventListener("click", () => {
        if (+btn.dataset.i === s.answer) {
          btn.classList.add("is-right");
          opts.querySelectorAll(".q-opt").forEach(b => { b.disabled = true; });
          fb.hidden = false; fb.className = "q-feedback ok"; fb.innerHTML = "<b>Correct!</b> " + q.explain;
          if (B.Sound) B.Sound.play("pass");
          solved.add(box.dataset.q);
          if (solved.size === L.checks.length) finish();
        } else {
          btn.classList.add("is-wrong"); btn.disabled = true;
          fb.hidden = false; fb.className = "q-feedback bad"; fb.innerHTML = "<b>Not quite.</b> Re-read the lesson above and try again!";
          if (B.Sound) B.Sound.play("fail");
        }
      }));
    });

    function finish() {
      const fresh = markLesson(c.id, n);
      const allDone = examUnlocked(c);
      const done = $("ac-done");
      done.hidden = false;
      done.innerHTML = '<img class="pixelated" alt="" src="' + B.spriteURL("trophy", 4) + '"><div><h3>Lesson complete!' + (fresh ? " +" + LESSON_XP + " XP" : "") + "</h3><p>" +
        (n < c.lessons.length ? "Ready for lesson " + (n + 1) + ": " + esc(c.lessons[n].title) + "." : allDone ? "You finished every lesson — the final exam is unlocked!" : "That was the last lesson. Finish the others to unlock the final exam.") +
        "</p></div>" +
        (n < c.lessons.length ? '<a class="btn btn-start sm" href="lesson.html?c=' + c.id + "&l=" + (n + 1) + '"><span class="t-label">Next lesson ▶</span></a>'
          : '<a class="btn btn-start sm" href="' + (allDone ? "exam.html?c=" + c.id : "course.html?c=" + c.id) + '"><span class="t-label">' + (allDone ? "Take the exam" : "Course page") + "</span></a>");
      if (fresh) {
        B.updateXP(true);
        if (B.Sound) B.Sound.play("win");
        const r = done.getBoundingClientRect();
        B.confetti(r.left + r.width / 2, r.top, 80);
        const tocItem = $("ac-toc").querySelector('a[aria-current="page"] .ac-num');
        if (tocItem) { tocItem.textContent = "✓"; tocItem.parentElement.classList.add("is-done"); }
        if (allDone) { const ex = $("ac-toc").querySelector(".ac-toc-exam"); ex.classList.remove("is-locked"); ex.querySelector("img").src = B.spriteURL("scroll", 2); }
        B.checkBadges();
      }
      done.scrollIntoView({ behavior: B.reduceMotion ? "auto" : "smooth", block: "center" });
    }
  }

  /* ---------------- exam page ---------------- */
  function renderExam() {
    const c = getCourse();
    document.title = c.name + " Final Exam — Bitwood Academy";
    const crumb = document.querySelector(".crumbs a");
    crumb.href = "course.html?c=" + c.id; crumb.textContent = "← " + c.title;
    $("ac-kicker").textContent = c.name + " · Final exam · " + c.exam.length + " questions";
    $("ac-title").textContent = c.title + " exam";
    banner(c, { heroFrac: 0.5 });
    const root = $("ac-exam");

    if (!examUnlocked(c)) {
      const left = c.lessons.length - lessonsDone(c.id);
      const next = c.lessons.findIndex((_, i) => !isLessonDone(c.id, i + 1)) + 1;
      root.innerHTML = '<div class="pixel-box ac-panel ac-center"><img class="pixelated ac-big-ico" alt="" src="' + B.spriteURL("lock", 6) + '">' +
        "<h2>The exam is still locked</h2><p>Finish all " + c.lessons.length + " lessons first — " + left + " to go.</p>" +
        '<a class="btn btn-start" href="lesson.html?c=' + c.id + "&l=" + next + '"><span class="t-label">Go to lesson ' + next + "</span></a></div>";
      return;
    }

    function intro() {
      const e = examInfo(c.id);
      root.innerHTML = '<div class="pixel-box ac-panel ac-center"><img class="pixelated ac-big-ico" alt="" src="' + B.spriteURL("scroll", 6) + '">' +
        "<h2>Final exam: " + esc(c.title) + "</h2>" +
        '<ul class="ac-rules"><li><b>' + c.exam.length + "</b> questions about all " + c.lessons.length + " lessons</li><li>Pass with <b>" + PASS + " / " + c.exam.length + "</b> (70%)</li><li>No time limit — you can go back and change answers</li><li>Passing gives <b>+" + EXAM_XP + " XP</b>, a badge and a certificate</li></ul>" +
        (e ? '<p class="ac-best">Best score: <b>' + e.best + " / " + c.exam.length + "</b>" + (e.passed ? " · passed ✓" : "") + " · attempts: " + e.attempts + "</p>" : "") +
        '<div class="ac-row"><button class="btn btn-start" type="button" id="ex-start"><span class="t-label">' + (e ? "Start again" : "Start exam") + "</span></button>" +
        '<button class="btn btn-code ex-timed-btn" type="button" id="ex-timed">⏱ Timed challenge · 10 min</button></div>' +
        '<p class="ac-hint">Timed challenge: the same 20 questions against the clock. Fast passes go on the speed leaderboard!</p></div>' +
        '<section class="pixel-box ac-panel ex-board" aria-labelledby="board-title"><h2 id="board-title">⏱ Fastest heroes — ' + esc(c.name) + '</h2><ol class="ex-board-list" id="ex-board"><li class="muted">Loading…</li></ol>' +
        (progress(c.id).timed ? '<p class="ac-best">Your best timed run: <b>' + progress(c.id).timed.best + "/20</b> in <b>" + mmss(progress(c.id).timed.bestTime) + "</b></p>" : "") + "</section>";
      $("ex-start").addEventListener("click", () => start(false));
      $("ex-timed").addEventListener("click", () => start(true));
      loadBoard();
    }
    async function loadBoard() {
      const list = $("ex-board");
      if (!list) return;
      if (!B.Cloud || !B.Cloud.enabled) { list.innerHTML = '<li class="muted">The speed leaderboard is offline right now.</li>'; return; }
      try {
        const rows = await B.Cloud.timedBoard(c.id, 10);
        const me = B.Cloud.user ? B.Cloud.user.id : null;
        list.innerHTML = rows.length ? rows.map((r, i) => '<li class="' + (r.user_id === me ? "is-me" : "") + '"><span class="ex-rank">#' + (i + 1) + '</span><span class="ex-name">' + esc(r.username) + '</span><span class="ex-sc">' + r.score + '/20</span><span class="ex-time">' + mmss(r.seconds) + "</span></li>").join("")
          : '<li class="muted">No timed runs yet — be the first!' + (B.Cloud.user ? "" : " (Sign in to appear here.)") + "</li>";
      } catch (err) {
        list.innerHTML = '<li class="muted">' + (/exam_records|PGRST/.test(err.message || "") ? "The speed leaderboard is being set up — check back soon!" : "Couldn't load the speed leaderboard.") + "</li>";
      }
    }

    let qs = [], answers = [], cur = 0, timed = false, startedAt = 0, timer = 0;
    function start(isTimed) {
      timed = !!isTimed;
      clearInterval(timer);
      qs = c.exam.map(q => Object.assign({}, q, shuffled(q))).sort(() => Math.random() - 0.5);
      answers = new Array(qs.length).fill(-1);
      cur = 0;
      root.innerHTML =
        '<div class="pixel-box ac-panel ex-panel">' +
        '<div class="ex-track" aria-hidden="true"><div class="ex-fill" id="ex-fill"></div><img class="pixelated ex-hero" id="ex-hero" alt="" src="' + B.spriteURL("heroA", 3) + '"><img class="pixelated ex-flag" alt="" src="' + B.spriteURL("flag", 3) + '"></div>' +
        (timed ? '<div class="ex-timer" id="ex-timer" role="timer" aria-live="off">⏱ 10:00</div>' : "") +
        '<div class="ex-pips" id="ex-pips"></div>' +
        '<div class="ex-q" id="ex-q" aria-live="polite"></div>' +
        '<div class="ex-actions"><button class="btn btn-code" type="button" id="ex-back">◀ Back</button><span class="ex-count" id="ex-count"></span>' +
        '<button class="btn btn-start sm" type="button" id="ex-next" disabled><span class="t-label">Next ▶</span></button></div></div>';
      $("ex-pips").innerHTML = qs.map((_, i) => '<button type="button" class="ex-pip" data-i="' + i + '" aria-label="Go to question ' + (i + 1) + '">' + (i + 1) + "</button>").join("");
      $("ex-pips").addEventListener("click", e => { const b = e.target.closest(".ex-pip"); if (b) show(+b.dataset.i); });
      $("ex-back").addEventListener("click", () => show(cur - 1));
      $("ex-next").addEventListener("click", () => { if (cur === qs.length - 1) confirmFinish(); else show(cur + 1); });
      document.addEventListener("keydown", examKeys);
      startedAt = Date.now();
      if (timed) {
        const tick = () => {
          const left = Math.max(0, TIME_LIMIT - Math.floor((Date.now() - startedAt) / 1000));
          const el = $("ex-timer");
          if (!el) { clearInterval(timer); return; }
          el.textContent = "⏱ " + mmss(left);
          el.classList.toggle("is-low", left <= 60);
          if (left === 60) B.toast("<b>1 minute left!</b>", "heart");
          if (left === 0) { clearInterval(timer); B.toast("<b>Time's up!</b> Unanswered questions count as wrong.", "heart"); finish(); }
        };
        timer = setInterval(tick, 250);
        tick();
      }
      show(0);
    }
    function examKeys(e) {
      if (!$("ex-q") || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 4) { const b = $("ex-q").querySelector('.q-opt[data-i="' + (n - 1) + '"]'); if (b) b.click(); }
    }
    function show(i) {
      if (i < 0 || i >= qs.length) return;
      cur = i;
      const q = qs[i];
      $("ex-q").innerHTML = '<span class="eyebrow">Question ' + (i + 1) + " / " + qs.length + "</span>" +
        '<p class="ac-q">' + q.q + "</p>" + (q.code ? '<pre class="ac-code"><code>' + B.Code.highlight(q.code, q.lang || "text") + "</code></pre>" : "") +
        '<div class="q-options">' + q.options.map((o, k) => '<button type="button" class="q-opt' + (answers[i] === k ? " is-picked" : "") + '" data-i="' + k + '" aria-pressed="' + (answers[i] === k) + '"><span class="q-letter">' + "ABCD"[k] + "</span><span>" + esc(o) + "</span></button>").join("") + "</div>";
      $("ex-q").querySelectorAll(".q-opt").forEach(b => b.addEventListener("click", () => {
        answers[i] = +b.dataset.i;
        $("ex-q").querySelectorAll(".q-opt").forEach(x => { const on = x === b; x.classList.toggle("is-picked", on); x.setAttribute("aria-pressed", String(on)); });
        if (B.Sound) B.Sound.play("click");
        update();
      }));
      update();
      const qEl = $("ex-q"); qEl.classList.remove("swap"); void qEl.offsetWidth; qEl.classList.add("swap");
    }
    function update() {
      const answered = answers.filter(a => a >= 0).length;
      $("ex-count").textContent = answered + " / " + qs.length + " answered";
      $("ex-back").disabled = cur === 0;
      const next = $("ex-next");
      next.disabled = answers[cur] < 0;
      next.querySelector(".t-label").textContent = cur === qs.length - 1 ? "Finish ✓" : "Next ▶";
      $("ex-pips").querySelectorAll(".ex-pip").forEach((p, k) => { p.classList.toggle("is-answered", answers[k] >= 0); p.classList.toggle("is-current", k === cur); });
      const pct = answered / qs.length;
      $("ex-fill").style.transform = "scaleX(" + pct + ")";
      $("ex-hero").style.left = "calc(" + (pct * 100).toFixed(1) + "% - " + Math.round(pct * 36) + "px)";
    }
    function confirmFinish() {
      const missing = answers.findIndex(a => a < 0);
      if (missing >= 0 && !timed) { B.toast("<b>Question " + (missing + 1) + "</b> isn't answered yet.", "scroll"); show(missing); return; }
      if (missing >= 0 && timed && !window.confirm("Some questions aren't answered yet. Finish anyway?")) { show(missing); return; }
      finish();
    }
    function finish() {
      document.removeEventListener("keydown", examKeys);
      clearInterval(timer);
      const score = qs.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
      const pass = score >= PASS;
      const seconds = Math.min(TIME_LIMIT, Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
      const firstPass = saveExam(c.id, score);
      const improved = timed ? saveTimed(c.id, score, seconds) : false;
      B.updateXP(firstPass);
      root.innerHTML =
        '<div class="pixel-box ac-panel ac-center ex-result ' + (pass ? "is-pass" : "is-fail") + '">' +
        '<img class="pixelated ac-big-ico" alt="" src="' + B.spriteURL(pass ? "trophy" : "heart", 6) + '">' +
        "<h2>" + (pass ? "You passed!" : "Not this time") + '</h2><p class="ex-score"><b>' + score + "</b> / " + qs.length + "</p>" +
        (timed ? '<p class="ex-time-result">⏱ Time: <b>' + mmss(seconds) + "</b>" + (improved ? " · new personal best!" : "") + '</p><p class="ac-hint" id="ex-submit"></p>' : "") +
        "<p>" + (pass ? (firstPass ? "+" + EXAM_XP + " XP · badge unlocked · your certificate is ready!" : "Great job — another pass!") : "You need " + PASS + " correct answers to pass. Review the answers below, re-read the lessons and try again!") + "</p>" +
        '<div class="ac-row">' + (pass ? '<a class="btn btn-start" href="certificate.html?course=' + c.id + '"><span class="t-label">Get certificate</span></a>' : "") +
        '<button class="btn ' + (pass ? "btn-code" : "btn-start") + '" type="button" id="ex-retry">' + (pass ? "Retake" : '<span class="t-label">Try again</span>') + "</button>" +
        '<a class="btn btn-code" href="course.html?c=' + c.id + '">Course page</a></div></div>' +
        '<section class="pixel-box ac-panel ex-review" aria-labelledby="rev-title"><h2 id="rev-title">Review your answers</h2><ol>' +
        qs.map((q, i) => {
          const ok = answers[i] === q.answer;
          return '<li class="' + (ok ? "ok" : "bad") + '"><p class="ac-q">' + q.q + "</p>" +
            (ok ? '<p class="rev-line ok">✓ ' + esc(q.options[q.answer]) + "</p>"
              : '<p class="rev-line bad">✗ Your answer: ' + (answers[i] >= 0 ? esc(q.options[answers[i]]) : "(no answer)") + '</p><p class="rev-line ok">✓ Correct: ' + esc(q.options[q.answer]) + "</p>") +
            '<p class="rev-explain">' + q.explain + "</p></li>";
        }).join("") + "</ol></section>";
      $("ex-retry").addEventListener("click", () => { start(timed); window.scrollTo({ top: root.offsetTop - 90, behavior: B.reduceMotion ? "auto" : "smooth" }); });
      if (B.Sound) B.Sound.play(pass ? "win" : "fail");
      if (pass) { const r = root.getBoundingClientRect(); B.confetti(window.innerWidth / 2, Math.max(80, r.top), 160); }
      B.checkBadges();
      window.scrollTo({ top: root.offsetTop - 90, behavior: B.reduceMotion ? "auto" : "smooth" });
      if (timed) submitTimed(score, seconds);
    }
    async function submitTimed(score, seconds) {
      const el = $("ex-submit");
      if (!el) return;
      if (!B.Cloud || !B.Cloud.enabled) return;
      if (!B.Cloud.user) {
        el.innerHTML = '<button type="button" class="link-btn" id="ex-signin">Sign in</button> to put your timed runs on the speed leaderboard.';
        $("ex-signin").addEventListener("click", () => B.Cloud.openAccount("signin"));
        return;
      }
      try {
        const res = await B.Cloud.submitTimed(c.id, score, seconds);
        el.textContent = res === "saved" ? "🏆 Saved to the speed leaderboard!" : "Your best run on the speed leaderboard is still faster — keep trying!";
      } catch (err) {
        el.textContent = /exam_records|PGRST/.test(err.message || "") ? "The speed leaderboard is being set up — your run is saved on this device." : "Couldn't reach the speed leaderboard right now.";
      }
    }
    intro();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.academy;
    if (page === "hub") renderHub();
    else if (page === "course") renderCourse();
    else if (page === "lesson") renderLesson();
    else if (page === "exam") renderExam();
  });

  B.Academy = { COURSES, lessonsDone, examInfo, PASS };
})();

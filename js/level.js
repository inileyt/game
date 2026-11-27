/* Level page: lesson + five questions (quiz and code) + walking hero track + portal to the next level. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const LEVELS = window.BITWOOD_LEVELS;
  const $ = id => document.getElementById(id);

  let level, track, state;

  function getLevel() {
    const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
    return LEVELS.find(l => l.id === id) || LEVELS[0];
  }

  /* ---------- per-level question progress (resumable) ---------- */
  function loadState() {
    const d = B.Store.get();
    const q = (d.qprog || {})[level.id];
    if (!q || q.step >= level.questions.length) return { step: 0, mistakes: 0, hints: 0 };
    return { step: q.step, mistakes: q.mistakes || 0, hints: q.hints || 0 };
  }
  function saveState() {
    B.Store.update(d => { d.qprog = d.qprog || {}; d.qprog[level.id] = Object.assign({}, state); });
  }

  /* ---------- the quest track: 5 checkpoints + a portal, with a walking hero ---------- */
  function buildTrack() {
    const el = $("track");
    const n = level.questions.length;
    let html = '<div class="track-line"><i id="track-fill"></i></div>';
    for (let i = 0; i < n; i++) {
      const q = level.questions[i];
      html += '<span class="track-node" data-i="' + i + '" title="Question ' + (i + 1) + '"><b>' + (i + 1) + '</b><em>' + (q.type === "quiz" ? "Quiz" : "Code") + "</em></span>";
    }
    html += '<span class="track-node track-portal" title="Portal to the next level"><canvas width="30" height="36" aria-hidden="true"></canvas><em>Portal</em></span>';
    html += '<div class="track-hero" id="track-hero" aria-hidden="true"><img class="pixelated" alt=""></div>';
    el.innerHTML = html;
    el.setAttribute("aria-label", "Level progress: " + n + " questions, then the portal");

    const heroEl = $("track-hero"), img = heroEl.querySelector("img");
    const frames = [B.spriteURL("heroA", 4), B.spriteURL("heroB", 4)];
    img.src = frames[0];
    let walkTimer = 0;

    // animated mini portal at the end of the track
    const pc = el.querySelector(".track-portal canvas"), pctx = pc.getContext("2d");
    const colors = B.Cutscene.portalColors(nextColor());
    let pt = 0;
    (function spin() {
      pctx.clearRect(0, 0, 30, 36);
      B.drawPortal(pctx, 15, 18, pt, colors, 0.95);
      pt += 1 / 30;
      if (!B.reduceMotion && document.body.contains(pc)) setTimeout(() => requestAnimationFrame(spin), 33);
    })();

    function nodeX(i) {
      const nodes = el.querySelectorAll(".track-node");
      const node = nodes[Math.min(i, nodes.length - 1)];
      return node.offsetLeft + node.offsetWidth / 2;
    }
    function update(step) {
      el.querySelectorAll(".track-node[data-i]").forEach((node, i) => {
        node.classList.toggle("is-done", i < step);
        node.classList.toggle("is-current", i === step);
      });
      $("track-fill").style.transform = "scaleX(" + Math.min(1, step / level.questions.length) + ")";
    }
    function place(step, animate) {
      heroEl.classList.toggle("no-anim", !animate);
      heroEl.style.left = nodeX(step) + "px";
      update(step);
      if (!animate || B.reduceMotion) return Promise.resolve();
      heroEl.classList.add("is-walking");
      let f = 0;
      clearInterval(walkTimer);
      walkTimer = setInterval(() => { img.src = frames[(f = f ^ 1)]; }, 130);
      return new Promise(res => setTimeout(() => {
        clearInterval(walkTimer); img.src = frames[0];
        heroEl.classList.remove("is-walking");
        heroEl.classList.add("is-cheer");
        setTimeout(() => heroEl.classList.remove("is-cheer"), 500);
        res();
      }, 950));
    }
    window.addEventListener("resize", () => place(state.step, false));
    return { place };
  }

  function nextColor() {
    const next = LEVELS[level.id];
    return next ? next.color : "#facc15";
  }

  /* ---------- question rendering ---------- */
  function showQuestion(i) {
    const q = level.questions[i];
    const card = $("q-card");
    $("q-step").textContent = "Question " + (i + 1) + " / " + level.questions.length;
    $("q-type").textContent = q.type === "quiz" ? "Quiz" : "Code";
    $("q-title").textContent = q.type === "quiz" ? "Quick quiz" : (i === level.questions.length - 1 ? "Level challenge" : "Warm-up: " + q.title);
    $("q-text").innerHTML = q.type === "quiz" ? q.q : q.task;
    const codeEl = $("q-code");
    if (q.type === "quiz" && q.code) { codeEl.hidden = false; codeEl.firstChild.innerHTML = B.Code.highlight(q.code); }
    else codeEl.hidden = true;
    $("q-feedback").hidden = true;
    $("q-next").hidden = true;
    $("quiz-area").hidden = q.type !== "quiz";
    $("code-q-area").hidden = q.type !== "code";
    $("editor-panel").hidden = q.type !== "code";

    if (q.type === "quiz") renderQuiz(q);
    else renderCode(q, i);

    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
  }

  function feedback(html, ok) {
    const fb = $("q-feedback");
    fb.hidden = false;
    fb.className = "q-feedback " + (ok ? "ok" : "bad");
    fb.innerHTML = html;
  }

  function renderQuiz(q) {
    const wrap = $("q-options");
    const letters = ["A", "B", "C", "D"];
    wrap.innerHTML = q.options.map((o, i) =>
      '<button type="button" class="q-opt" data-i="' + i + '"><span class="q-letter">' + letters[i] + "</span><code>" + B.escapeHTML(o) + "</code></button>").join("");
    wrap.querySelectorAll(".q-opt").forEach(btn => btn.addEventListener("click", () => {
      const pick = +btn.dataset.i;
      if (pick === q.answer) {
        btn.classList.add("is-right");
        wrap.querySelectorAll(".q-opt").forEach(b => { b.disabled = true; });
        if (B.Sound) B.Sound.play("pass");
        feedback("<b>Correct!</b> " + q.explain, true);
        showContinue();
      } else {
        btn.classList.add("is-wrong");
        btn.disabled = true;
        state.mistakes++; saveState();
        if (B.Sound) B.Sound.play("fail");
        feedback("<b>Not quite.</b> Try another answer!", false);
      }
    }));
  }

  function renderCode(q, i) {
    const isMain = i === level.questions.length - 1;
    const key = isMain ? level.id : level.id + "-" + i;
    $("file-name").textContent = q.slug + ".js";
    const saved = B.Store.get().code[key];
    B.Code.mountChallenge(q, {
      initial: typeof saved === "string" ? saved : q.starter,
      onSave: code => B.Store.saveCode(key, code),
      winText: isMain ? "level clear!" : "question solved!",
      quietWin: !isMain,
      onWin: r => {
        state.mistakes += r.fails;
        if (r.hintUsed) state.hints++;
        saveState();
        if (isMain) { completeLevel(); return; }
        feedback("<b>All tests passed!</b> Great coding.", true);
        showContinue();
      }
    });
  }

  function showContinue() {
    const btn = B.Code.fresh("q-next");
    btn.hidden = false;
    btn.focus({ preventScroll: true });
    btn.addEventListener("click", async () => {
      btn.hidden = true;
      state.step++;
      saveState();
      await showTrack();
      await track.place(state.step, true);
      showQuestion(state.step);
    });
  }

  /* Bring the quest track into view so the player sees the hero walk */
  function showTrack() {
    const strip = document.querySelector(".track-strip");
    const navH = (document.querySelector(".nav") || {}).offsetHeight || 0;
    const top = strip.getBoundingClientRect().top + window.scrollY - navH - 8;
    if (Math.abs(window.scrollY - top) < 40) return Promise.resolve();
    window.scrollTo({ top, behavior: B.reduceMotion ? "auto" : "smooth" });
    return new Promise(res => setTimeout(res, B.reduceMotion ? 0 : 450));
  }

  /* ---------- level complete ---------- */
  async function completeLevel() {
    const stars = Math.max(1, 3 - (state.hints > 0 ? 1 : 0) - (state.mistakes >= 3 ? 1 : 0) - (state.mistakes >= 6 ? 1 : 0));
    const already = B.Store.isDone(level.id);
    B.Store.complete(level.id, { xp: level.xp, stars, at: Date.now() });
    state.step = level.questions.length;
    saveState();
    B.updateXP(true);
    await showTrack();
    await track.place(state.step, true);

    const starsEl = $("win-stars");
    starsEl.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const img = document.createElement("img");
      img.src = B.spriteURL("star", 4); img.alt = ""; img.className = "pixelated" + (i < stars ? "" : " off");
      starsEl.appendChild(img);
    }
    starsEl.setAttribute("aria-label", stars + " of 3 stars");
    const last = level.id === LEVELS.length;
    const next = LEVELS[level.id];
    $("win-title").textContent = last ? "Boss defeated!" : "Level clear!";
    $("win-text").textContent = last
      ? "You conquered all ten worlds of Bitwood. You're a real coder now — claim your certificate!"
      : "All 5 questions solved. The portal to " + next.name + " is open!";
    $("win-xp").textContent = already ? "Replay complete" : "+" + level.xp + " XP";
    const nextBtn = B.Code.fresh("win-next");
    const allDone = LEVELS.every(l => B.Store.isDone(l.id));
    if (last) {
      nextBtn.href = allDone ? "certificate.html" : "levels.html";
      nextBtn.querySelector(".t-label").textContent = allDone ? "Certificate" : "World map";
    } else {
      nextBtn.href = "level.html?id=" + next.id;
      nextBtn.querySelector(".t-label").textContent = "Enter portal";
      nextBtn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
        B.Cutscene.portal({
          fromId: level.id, toId: next.id, theme: level.theme, color: next.color,
          href: "level.html?id=" + next.id,
          kicker: "Level " + level.id + " clear!", title: "Next: Level " + next.id + " · " + next.name
        });
      });
    }
    const closeModal = B.openModal($("win"));
    const r = $("track").getBoundingClientRect();
    B.confetti(r.right - 40, r.top + 20, 140);
    B.checkBadges();
  }

  /* ---------- page ---------- */
  function renderLocked() {
    const play = $("play");
    const prev = LEVELS[level.id - 2];
    document.querySelector(".track-strip").hidden = true;
    play.style.display = "block";
    play.innerHTML =
      '<div class="pixel-box" style="max-width:560px;margin:0 auto;padding:36px 28px;text-align:center">' +
      '<img src="' + B.spriteURL("lock", 6) + '" alt="" class="pixelated" style="width:48px;height:54px;margin:0 auto 16px">' +
      "<h2>This world is still locked</h2>" +
      '<p style="margin:10px 0 24px">Clear Level ' + prev.id + " — " + B.escapeHTML(prev.name) + " — to open the path to " + B.escapeHTML(level.name) + ".</p>" +
      '<a class="btn btn-start" href="level.html?id=' + prev.id + '"><span class="t-label">Go to level ' + prev.id + "</span></a></div>";
  }

  function init() {
    level = getLevel();
    document.title = "Level " + level.id + ": " + level.name + " — Bitwood";
    $("level-lv").textContent = "Level " + level.id + " · " + level.topic;
    $("level-title").textContent = level.name;

    const hooks = B.Cutscene.arrivalHooks(level.id, level.color);
    new B.PixelScene($("banner"), Object.assign({ theme: level.theme, pixel: 3, heroFrac: 0.82, speed: 26, seed: level.id }, hooks)).start();

    if (!B.Store.isUnlocked(level.id)) { renderLocked(); return; }

    const body = $("lesson-body");
    let html = '<span class="eyebrow" style="color:' + level.color + '">Lesson · ' + B.escapeHTML(level.topic) + "</span>";
    level.lesson.forEach(block => {
      if (block.p) html += "<p>" + block.p + "</p>";
      if (block.code) html += "<pre><code>" + B.Code.highlight(block.code) + "</code></pre>";
    });
    body.innerHTML = html;

    state = loadState();
    track = buildTrack();
    requestAnimationFrame(() => track.place(state.step, false));
    showQuestion(state.step);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

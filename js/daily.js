/* Daily challenge: a new small coding task every day, +50 XP and a streak counter. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const POOL = window.BITWOOD_DAILY;
  const REWARD = 50;
  const THEMES = ["village", "forest", "caves", "rapids", "castle", "desert", "snow", "swamp", "volcano", "space"];
  const $ = id => document.getElementById(id);

  const pad = n => String(n).padStart(2, "0");
  const dateKey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const dayNumber = d => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);

  function renderStats() {
    const daily = B.Store.get().daily;
    const today = dateKey(new Date());
    const y = new Date(); y.setDate(y.getDate() - 1);
    // a streak only counts if it was continued yesterday or today
    const live = daily.last === today || daily.last === dateKey(y) ? daily.streak || 0 : 0;
    $("d-streak").textContent = live;
    $("d-best").textContent = daily.best || 0;
    $("d-count").textContent = daily.count || 0;
    const doneToday = !!daily.done[today];
    $("d-status").innerHTML = doneToday
      ? '<span class="tag done">Solved today ✓</span> Come back tomorrow for a new challenge!'
      : '<span class="tag">+' + REWARD + " XP</span> Solve it today to keep your streak going.";
  }

  function countdown() {
    const el = $("d-next");
    function tick() {
      const now = new Date(), next = new Date(now); next.setHours(24, 0, 0, 0);
      const s = Math.max(0, Math.floor((next - now) / 1000));
      el.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
      if (s === 0) setTimeout(() => location.reload(), 1500);
    }
    tick();
    setInterval(tick, 1000);
  }

  function init() {
    const now = new Date(), today = dateKey(now), n = dayNumber(now);
    const ch = Object.assign({ slug: "daily-" + today }, POOL[n % POOL.length]);
    const theme = THEMES[n % THEMES.length];

    $("level-lv").textContent = "Daily challenge · " + now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    $("level-title").textContent = ch.title;
    $("task").innerHTML = ch.task;
    $("file-name").textContent = ch.slug + ".js";
    new B.PixelScene($("banner"), { theme, pixel: 3, heroFrac: 0.82, speed: 26, seed: n }).start();

    renderStats();
    countdown();

    const saved = B.Store.get().code["daily-" + today];
    B.Code.mountChallenge(ch, {
      initial: typeof saved === "string" ? saved : ch.starter,
      onSave: code => B.Store.saveCode("daily-" + today, code),
      winText: "daily challenge solved!",
      onWin: () => {
        const before = B.Store.get().daily;
        if (before.done[today]) { B.toast("<b>Already solved today</b> — nice practice!", "star"); return; }
        const y = new Date(); y.setDate(y.getDate() - 1);
        B.Store.update(d => {
          const dl = d.daily;
          dl.streak = dl.last === dateKey(y) ? (dl.streak || 0) + 1 : 1;
          dl.best = Math.max(dl.best || 0, dl.streak);
          dl.count = (dl.count || 0) + 1;
          dl.xp = (dl.xp || 0) + REWARD;
          dl.last = today;
          dl.done[today] = true;
        });
        B.updateXP(true);
        renderStats();
        B.toast("<span class=\"toast-k\">Daily challenge solved!</span><b>+" + REWARD + " XP</b>", "scroll");
        const r = $("run").getBoundingClientRect();
        B.confetti(r.left + r.width / 2, r.top, 110);
        B.checkBadges();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

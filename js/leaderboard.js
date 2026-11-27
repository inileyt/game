/* Leaderboard: top players by XP, from Supabase. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const $ = id => document.getElementById(id);

  function row(p, i, me) {
    const rank = i + 1;
    const medal = rank === 1 ? "crown" : rank === 2 ? "trophy" : rank === 3 ? "medal" : null;
    return '<li class="lb-row' + (me ? " is-me" : "") + (rank <= 3 ? " top" : "") + '" style="--d:' + Math.min(i, 12) * 50 + 'ms">' +
      '<span class="lb-rank">' + (medal ? '<img class="pixelated" alt="" src="' + B.spriteURL(medal, 3) + '"><span class="sr-only">' + rank + "</span>" : "#" + rank) + "</span>" +
      '<span class="lb-name">' + B.escapeHTML(p.username) + (me ? ' <span class="tag">You</span>' : "") + "</span>" +
      '<span class="lb-num lb-levels"><b>' + p.levels + "</b><small>/20</small></span>" +
      '<span class="lb-num"><b>' + p.stars + '</b><img class="pixelated" alt="stars" src="' + B.spriteURL("star", 2) + '"></span>' +
      '<span class="lb-xp"><b>' + p.xp + "</b> XP</span></li>";
  }

  async function load() {
    const list = $("lb-list"), note = $("lb-note");
    if (!B.Cloud || !B.Cloud.enabled) {
      list.innerHTML = "";
      note.hidden = false;
      note.textContent = "The leaderboard can't be reached right now. Check your internet connection and try again.";
      return;
    }
    try {
      const rows = await B.Cloud.leaderboard(50);
      const me = B.Cloud.user ? B.Cloud.user.id : null;
      if (!rows.length) {
        list.innerHTML = "";
        note.hidden = false;
        note.textContent = "No heroes yet — sign up and be the first on the board!";
      } else {
        note.hidden = true;
        list.innerHTML = rows.map((p, i) => row(p, i, p.id === me)).join("");
      }
      const mine = $("lb-me");
      if (me && !rows.some(r => r.id === me)) {
        const rank = await B.Cloud.myRank();
        mine.hidden = false;
        mine.textContent = rank ? "Your rank: #" + rank + " — keep playing to climb the board!" : "";
      } else mine.hidden = true;
    } catch (e) {
      list.innerHTML = "";
      note.hidden = false;
      note.textContent = /PGRST205|schema cache/.test(e.message || "")
        ? "The leaderboard is being set up. Please check back soon!"
        : "Couldn't load the leaderboard. Please try again in a moment.";
      console.warn("Bitwood leaderboard:", e.message || e);
    }
  }

  function renderCta() {
    const cta = $("lb-cta");
    const signedIn = B.Cloud && B.Cloud.user;
    cta.hidden = !!signedIn;
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("lb-join").addEventListener("click", () => B.Cloud && B.Cloud.openAccount("signup"));
    $("lb-signin").addEventListener("click", () => B.Cloud && B.Cloud.openAccount("signin"));
    renderCta();
    load();
    let last = null;
    if (B.Cloud) B.Cloud.onChange(s => {
      renderCta();
      const key = (s.user ? s.user.id : "") + s.status;
      if (key !== last && (s.status === "saved" || !s.user)) { last = key; load(); }
    });
  });
})();

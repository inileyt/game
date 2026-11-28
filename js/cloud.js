/* Bitwood cloud (Supabase): accounts, cloud save, leaderboard and contact messages.
   The site keeps working fully offline / signed out — the cloud is an extra. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const cfg = window.BITWOOD_CONFIG || {};
  const enabled = !!(cfg.supabaseUrl && cfg.supabaseKey && window.supabase && window.supabase.createClient);
  const client = enabled ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit", storageKey: "bitwood-auth" }
  }) : null;

  let user = null, profile = null, status = "", syncedFor = null;
  const listeners = [];
  const emit = () => listeners.forEach(fn => { try { fn({ user, profile, status }); } catch (e) { /* ignore */ } });
  const $ = (sel, root) => (root || document).querySelector(sel);
  const siteBase = () => location.origin + location.pathname.replace(/[^/]*$/, "");

  /* ---------------- progress summary + merge ---------------- */
  function summary(d) {
    const done = Object.values(d.done || {});
    return {
      xp: Math.min(1000000, B.Store.xp()),
      stars: Math.min(105, done.reduce((s, x) => s + (x.stars || 0), 0)),
      levels: Math.min(35, done.length),
      badges: Math.min(50, Object.keys(d.badges || {}).length)
    };
  }

  function merge(local, cloud) {
    const L = Object.assign({}, local), C = cloud || {};
    const out = Object.assign({}, C, L);
    // levels: keep the best stars
    out.done = Object.assign({}, C.done || {});
    Object.entries(L.done || {}).forEach(([k, v]) => {
      const c = out.done[k];
      if (!c || (v.stars || 0) > (c.stars || 0)) out.done[k] = v;
    });
    // saved code: local wins, cloud fills gaps
    out.code = Object.assign({}, C.code || {}, L.code || {});
    // badges: union, earliest date
    out.badges = Object.assign({}, C.badges || {});
    Object.entries(L.badges || {}).forEach(([k, v]) => { out.badges[k] = out.badges[k] ? Math.min(out.badges[k], v) : v; });
    // stats: highest number wins, local text wins
    out.stats = Object.assign({}, C.stats || {});
    Object.entries(L.stats || {}).forEach(([k, v]) => {
      out.stats[k] = typeof v === "number" && typeof out.stats[k] === "number" ? Math.max(v, out.stats[k]) : v;
    });
    // question progress: furthest step wins
    out.qprog = Object.assign({}, C.qprog || {});
    Object.entries(L.qprog || {}).forEach(([k, v]) => {
      const c = out.qprog[k];
      if (!c || (v.step || 0) >= (c.step || 0)) out.qprog[k] = v;
    });
    // daily: union of solved days, best numbers, streak from the most recent side
    const ld = L.daily || {}, cd = C.daily || {};
    const recent = (ld.last || "") >= (cd.last || "") ? ld : cd;
    out.daily = {
      done: Object.assign({}, cd.done || {}, ld.done || {}),
      count: Math.max(ld.count || 0, cd.count || 0),
      best: Math.max(ld.best || 0, cd.best || 0),
      xp: Math.max(ld.xp || 0, cd.xp || 0),
      streak: recent.streak || 0,
      last: recent.last || ""
    };
    // academy courses: union of finished lessons, best exam result
    out.courses = {};
    const lc = L.courses || {}, cc = C.courses || {};
    new Set(Object.keys(lc).concat(Object.keys(cc))).forEach(id => {
      const a = lc[id] || {}, b = cc[id] || {};
      const lessons = Object.assign({}, b.lessons || {});
      Object.entries(a.lessons || {}).forEach(([k, v]) => { lessons[k] = lessons[k] ? Math.min(lessons[k], v) : v; });
      const ea = a.exam || null, eb = b.exam || null;
      let exam = ea || eb;
      if (ea && eb) exam = {
        best: Math.max(ea.best || 0, eb.best || 0),
        passed: !!(ea.passed || eb.passed),
        attempts: Math.max(ea.attempts || 0, eb.attempts || 0),
        at: Math.max(ea.at || 0, eb.at || 0)
      };
      out.courses[id] = exam ? { lessons, exam } : { lessons };
      // timed challenge: keep the better run (higher score, then faster)
      const ta = a.timed, tb = b.timed;
      let timed = ta || tb;
      if (ta && tb && ta.best !== undefined && tb.best !== undefined) {
        const aBetter = ta.best > tb.best || (ta.best === tb.best && ta.bestTime <= tb.bestTime);
        timed = Object.assign({}, aBetter ? ta : tb, { attempts: Math.max(ta.attempts || 0, tb.attempts || 0) });
      }
      if (timed) out.courses[id].timed = timed;
    });
    return out;
  }

  /* ---------------- cloud save ---------------- */
  let pushTimer = 0, applyingCloud = false;
  function setStatus(s) { status = s; emit(); }

  async function push() {
    if (!user) return;
    const d = B.Store.get();
    const sum = summary(d);
    setStatus("saving");
    const now = new Date().toISOString();
    const r1 = await client.from("progress").upsert({ user_id: user.id, data: d, updated_at: now });
    const r2 = await client.from("profiles").update(Object.assign({ updated_at: now }, sum)).eq("id", user.id);
    if (r1.error || r2.error) { setStatus("error"); console.warn("Bitwood cloud save failed:", (r1.error || r2.error).message); return; }
    if (profile) Object.assign(profile, sum);
    setStatus("saved");
  }
  function schedulePush() {
    if (!user || applyingCloud) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 2000);
  }
  window.addEventListener("bitwood:progress", schedulePush);
  window.addEventListener("bitwood:reset", () => { clearTimeout(pushTimer); });
  window.addEventListener("pagehide", () => { if (pushTimer && user) { clearTimeout(pushTimer); push(); } });

  async function loadProfile() {
    const { data, error } = await client.from("profiles").select("id, username, xp, stars, levels, badges").eq("id", user.id).maybeSingle();
    if (error) { console.warn("Bitwood profile:", error.message); return null; }
    if (data) return data;
    // signed up before the database was set up: create the profile now
    const meta = (user.user_metadata || {}).username;
    const name = validName(meta) ? meta.trim() : "Player" + user.id.replace(/-/g, "").slice(0, 6);
    const ins = await client.from("profiles").insert({ id: user.id, username: name }).select().maybeSingle();
    return ins.data || null;
  }

  async function syncOnSignIn() {
    if (!user || syncedFor === user.id) return;
    syncedFor = user.id;
    setStatus("syncing");
    profile = await loadProfile();
    const { data, error } = await client.from("progress").select("data").eq("user_id", user.id).maybeSingle();
    if (error) { setStatus("error"); console.warn("Bitwood sync:", error.message); emit(); return; }
    const local = B.Store.read();
    const merged = merge(local, data ? data.data : {});
    const before = JSON.stringify(summaryOf(local)), after = JSON.stringify(summaryOf(merged));
    applyingCloud = true;
    B.Store.write(merged, { silent: true });
    applyingCloud = false;
    await push();
    B.updateXP();
    B.checkBadges();
    emit();
    // progress arrived from another device: refresh the page once so maps and cards show it
    if (before !== after && !sessionStorage.getItem("bitwood-synced-reload")) {
      sessionStorage.setItem("bitwood-synced-reload", "1");
      B.toast("<span class=\"toast-k\">Cloud save</span><b>Progress loaded!</b>", "star");
      setTimeout(() => location.reload(), 1200);
    }
  }
  function summaryOf(d) {
    const courses = Object.entries(d.courses || {}).map(([k, c]) => k + Object.keys(c.lessons || {}).length + (c.exam && c.exam.passed ? "p" : "")).sort();
    return { done: Object.keys(d.done || {}).sort(), badges: Object.keys(d.badges || {}).length, daily: (d.daily || {}).count || 0, courses };
  }

  /* ---------------- auth helpers ---------------- */
  const validName = n => typeof n === "string" && n.trim().length >= 2 && n.trim().length <= 20 && !/[<>"&]/.test(n);
  function friendly(err) {
    const m = (err && err.message) || String(err || "");
    if (/invalid login credentials/i.test(m)) return "Wrong email or password.";
    if (/email not confirmed/i.test(m)) return "Please confirm your email first — check your inbox (and spam folder).";
    if (/already registered|already been registered/i.test(m)) return "This email already has an account. Sign in instead.";
    if (/rate limit|too many/i.test(m)) return "Too many tries. Please wait a few minutes and try again.";
    if (/password should be at least|password.*characters/i.test(m)) return "Password must be at least 6 characters.";
    if (/unable to validate email|invalid.*email/i.test(m)) return "That email address doesn't look right.";
    if (/failed to fetch|network/i.test(m)) return "Can't reach the server. Check your internet connection.";
    return m || "Something went wrong. Please try again.";
  }

  /* ---------------- account window ---------------- */
  const ICON = '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><path d="M5 1h6v1h1v5h-1v1H5V7H4V2h1zM3 9h10v1h1v1h1v4H1v-4h1v-1h1z"/></svg>';

  function buildUI() {
    const right = $(".nav-right");
    if (right) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "icon-btn acct-btn";
      btn.id = "acct-btn";
      btn.innerHTML = ICON + '<span class="acct-dot" aria-hidden="true"></span>';
      btn.setAttribute("aria-label", "Account");
      btn.title = "Account";
      btn.addEventListener("click", () => openAccount(user ? "me" : "signin"));
      const toggles = right.querySelector(".sound-toggles");
      right.insertBefore(btn, toggles ? toggles.nextSibling : right.firstChild);
    }
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "acct";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "acct-title");
    modal.innerHTML = `
      <div class="pixel-box modal-card acct-card">
        <button class="acct-x" type="button" data-close aria-label="Close">✕</button>
        <img class="acct-hero pixelated" alt="" src="${B.spriteURL("heroA", 4)}">
        <h2 id="acct-title">Account</h2>

        <form class="acct-view" data-view="signin" novalidate>
          <p>Sign in to save your progress in the cloud and join the leaderboard.</p>
          <div class="field"><label for="si-email">Email</label><input id="si-email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="si-pass">Password</label><input id="si-pass" type="password" autocomplete="current-password" required></div>
          <p class="form-error" role="alert" hidden></p>
          <button class="btn btn-start sm" type="submit"><span class="t-label">Sign in</span></button>
          <div class="acct-links"><button type="button" class="link-btn" data-go="signup">Create an account</button><button type="button" class="link-btn" data-go="forgot">Forgot password?</button></div>
        </form>

        <form class="acct-view" data-view="signup" novalidate>
          <p>Create a free account. Your hero name is shown on the leaderboard.</p>
          <div class="field"><label for="su-name">Hero name</label><input id="su-name" type="text" maxlength="20" autocomplete="nickname" required></div>
          <div class="field"><label for="su-email">Email</label><input id="su-email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="su-pass">Password (6+ characters)</label><input id="su-pass" type="password" autocomplete="new-password" minlength="6" required></div>
          <p class="form-error" role="alert" hidden></p>
          <button class="btn btn-start sm" type="submit"><span class="t-label">Create account</span></button>
          <div class="acct-links"><button type="button" class="link-btn" data-go="signin">I already have an account</button></div>
        </form>

        <div class="acct-view" data-view="check">
          <p class="acct-big">📬 Check your email!</p>
          <p>We sent a confirmation link to <b class="acct-mail"></b>. Click it to activate your account, then sign in.</p>
          <p class="form-note">No email? Look in the spam folder or wait a minute.</p>
          <div class="acct-links"><button type="button" class="link-btn" data-go="signin">Back to sign in</button></div>
        </div>

        <form class="acct-view" data-view="forgot" novalidate>
          <p>Type your email and we'll send you a link to choose a new password.</p>
          <div class="field"><label for="fp-email">Email</label><input id="fp-email" type="email" autocomplete="email" required></div>
          <p class="form-error" role="alert" hidden></p>
          <p class="form-ok" role="status" hidden></p>
          <button class="btn btn-start sm" type="submit"><span class="t-label">Send link</span></button>
          <div class="acct-links"><button type="button" class="link-btn" data-go="signin">Back to sign in</button></div>
        </form>

        <form class="acct-view" data-view="newpass" novalidate>
          <p>Choose a new password for your account.</p>
          <div class="field"><label for="np-pass">New password (6+ characters)</label><input id="np-pass" type="password" autocomplete="new-password" minlength="6" required></div>
          <p class="form-error" role="alert" hidden></p>
          <button class="btn btn-start sm" type="submit"><span class="t-label">Save password</span></button>
        </form>

        <div class="acct-view" data-view="me">
          <p class="acct-big acct-name"></p>
          <p class="acct-email form-note"></p>
          <div class="acct-stats">
            <div><b class="acct-xp">0</b><span>XP</span></div>
            <div><b class="acct-levels">0</b><span>Levels</span></div>
            <div><b class="acct-stars">0</b><span>Stars</span></div>
          </div>
          <p class="acct-status"></p>
          <div class="acct-row">
            <a class="btn btn-start sm" href="leaderboard.html"><span class="t-label">Leaderboard</span></a>
            <button class="btn btn-dark" type="button" data-action="signout">Sign out</button>
          </div>
        </div>

        <div class="acct-view" data-view="offline">
          <p>Accounts are not available right now. Your progress is still saved in this browser.</p>
        </div>
      </div>`;
    document.body.appendChild(modal);
    B.paintSprites(modal);

    modal.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => show(b.dataset.go)));
    modal.querySelector('[data-action="signout"]').addEventListener("click", async () => {
      clearTimeout(pushTimer);
      if (user) await push();
      await client.auth.signOut();
      closeModal();
      B.toast("<b>Signed out</b> — progress stays saved in the cloud.", "flag");
    });

    const err = (form, msg) => { const e = form.querySelector(".form-error"); e.textContent = msg; e.hidden = !msg; };
    const busy = (form, on) => { const b = form.querySelector('button[type="submit"]'); b.disabled = on; b.style.opacity = on ? ".6" : ""; };

    $('[data-view="signin"]', modal).addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.currentTarget, email = $("#si-email").value.trim(), password = $("#si-pass").value;
      if (!email || !password) return err(f, "Please type your email and password.");
      err(f, ""); busy(f, true);
      const { error } = await client.auth.signInWithPassword({ email, password });
      busy(f, false);
      if (error) return err(f, friendly(error));
      $("#si-pass").value = "";
      closeModal();
      B.toast("<span class=\"toast-k\">Welcome back!</span><b>Signed in</b>", "star");
    });

    $('[data-view="signup"]', modal).addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.currentTarget, username = $("#su-name").value.trim(), email = $("#su-email").value.trim(), password = $("#su-pass").value;
      if (!validName(username)) return err(f, "Hero name must be 2–20 characters (no < > \" &).");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(f, "Please enter a valid email address.");
      if (password.length < 6) return err(f, "Password must be at least 6 characters.");
      err(f, ""); busy(f, true);
      const taken = await client.from("profiles").select("id").ilike("username", username.replace(/[\\%_]/g, m => "\\" + m)).limit(1);
      if (!taken.error && taken.data && taken.data.length) { busy(f, false); return err(f, "That hero name is taken. Try another one!"); }
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { username }, emailRedirectTo: siteBase() } });
      busy(f, false);
      if (error) return err(f, friendly(error));
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return err(f, "This email already has an account. Sign in instead.");
      $("#su-pass").value = "";
      if (data.session) { closeModal(); B.toast("<span class=\"toast-k\">Account created</span><b>Welcome, " + B.escapeHTML(username) + "!</b>", "crown"); return; }
      $(".acct-mail", modal).textContent = email;
      show("check");
    });

    $('[data-view="forgot"]', modal).addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.currentTarget, email = $("#fp-email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(f, "Please enter a valid email address.");
      err(f, ""); busy(f, true);
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: siteBase() });
      busy(f, false);
      if (error) return err(f, friendly(error));
      const ok = f.querySelector(".form-ok");
      ok.textContent = "If that email has an account, a reset link is on its way.";
      ok.hidden = false;
    });

    $('[data-view="newpass"]', modal).addEventListener("submit", async e => {
      e.preventDefault();
      const f = e.currentTarget, password = $("#np-pass").value;
      if (password.length < 6) return err(f, "Password must be at least 6 characters.");
      err(f, ""); busy(f, true);
      const { error } = await client.auth.updateUser({ password });
      busy(f, false);
      if (error) return err(f, friendly(error));
      $("#np-pass").value = "";
      closeModal();
      B.toast("<b>Password changed!</b>", "star");
    });
  }

  let closeModal = () => {};
  function show(view) {
    const modal = $("#acct");
    modal.querySelectorAll(".acct-view").forEach(v => { v.hidden = v.dataset.view !== view; });
    const titles = { signin: "Sign in", signup: "Create account", check: "Almost there", forgot: "Reset password", newpass: "New password", me: "Your account", offline: "Account" };
    $("#acct-title").textContent = titles[view] || "Account";
    if (view === "me") renderMe();
    const first = modal.querySelector('.acct-view:not([hidden]) input');
    if (first) setTimeout(() => first.focus(), 30);
  }
  function openAccount(view) {
    const modal = $("#acct");
    if (!modal) return;
    show(enabled ? view : "offline");
    closeModal = B.openModal(modal);
    show(enabled ? view : "offline");
  }
  function renderMe() {
    const modal = $("#acct");
    if (!user) return;
    const d = B.Store.get(), sum = summary(d);
    $(".acct-name", modal).textContent = profile ? profile.username : "Player";
    $(".acct-email", modal).textContent = user.email || "";
    $(".acct-xp", modal).textContent = sum.xp;
    $(".acct-levels", modal).textContent = sum.levels + " / " + (window.BITWOOD_LEVELS ? window.BITWOOD_LEVELS.length : 20);
    $(".acct-stars", modal).textContent = sum.stars;
    const text = { syncing: "☁ Syncing…", saving: "☁ Saving…", saved: "☁ Progress saved to the cloud", error: "⚠ Couldn't reach the cloud — your progress is safe in this browser and will sync later." };
    $(".acct-status", modal).textContent = text[status] || "☁ Cloud save is on";
  }
  function renderButton() {
    const btn = $("#acct-btn");
    if (!btn) return;
    btn.classList.toggle("is-in", !!user);
    const label = user ? "Account: " + (profile ? profile.username : "signed in") : "Sign in";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    if ($("#acct") && $("#acct").classList.contains("is-open") && user) renderMe();
  }
  listeners.push(renderButton);

  /* ---------------- public API ---------------- */
  async function leaderboard(limit) {
    if (!enabled) throw new Error("offline");
    const { data, error } = await client.from("profiles")
      .select("id, username, xp, stars, levels, badges")
      .order("xp", { ascending: false }).order("updated_at", { ascending: true })
      .limit(limit || 50);
    if (error) throw error;
    return data;
  }
  async function myRank() {
    if (!user || !profile) return null;
    const { count, error } = await client.from("profiles").select("id", { count: "exact", head: true }).gt("xp", profile.xp || 0);
    return error ? null : (count || 0) + 1;
  }
  /* Timed-exam speed leaderboard (table exam_records) */
  async function timedBoard(course, limit) {
    if (!enabled) throw new Error("offline");
    const { data, error } = await client.from("exam_records")
      .select("user_id, score, seconds, profiles(username)")
      .eq("course", course)
      .order("score", { ascending: false }).order("seconds", { ascending: true }).order("updated_at", { ascending: true })
      .limit(limit || 10);
    if (error) throw error;
    return data.map(r => ({ user_id: r.user_id, score: r.score, seconds: r.seconds, username: (r.profiles && r.profiles.username) || "Player" }));
  }
  async function submitTimed(course, score, seconds) {
    if (!user) throw new Error("not signed in");
    const cur = await client.from("exam_records").select("score, seconds").eq("user_id", user.id).eq("course", course).maybeSingle();
    if (cur.error) throw cur.error;
    if (cur.data && (cur.data.score > score || (cur.data.score === score && cur.data.seconds <= seconds))) return "kept";
    const { error } = await client.from("exam_records").upsert({ user_id: user.id, course, score, seconds, updated_at: new Date().toISOString() });
    if (error) throw error;
    return "saved";
  }

  async function sendMessage(msg) {
    if (!enabled) throw new Error("offline");
    const row = { name: msg.name, email: msg.email, topic: msg.topic, message: msg.message };
    if (user) row.user_id = user.id;
    const { error } = await client.from("messages").insert(row);
    if (error) throw error;
  }

  B.Cloud = {
    enabled, merge,
    get user() { return user; },
    get profile() { return profile; },
    onChange(fn) { listeners.push(fn); },
    openAccount, leaderboard, myRank, sendMessage, timedBoard, submitTimed,
    saveNow() { clearTimeout(pushTimer); return push(); }
  };

  document.addEventListener("DOMContentLoaded", () => {
    buildUI();
    if (!enabled) return;
    client.auth.onAuthStateChange((event, session) => {
      // never await Supabase calls inside this callback — defer them
      setTimeout(async () => {
        user = session ? session.user : null;
        if (event === "PASSWORD_RECOVERY") { openAccount("newpass"); return; }
        if (!user) { profile = null; syncedFor = null; status = ""; emit(); return; }
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") await syncOnSignIn();
        emit();
      }, 0);
    });
  });
})();

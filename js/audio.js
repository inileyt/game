/* Bitwood sound: 8-bit sound effects + a looping chiptune, made live with the Web Audio API.
   Sound effects are on by default, music is off until the player turns it on.
   Nothing plays before the player has interacted with the page (browser autoplay rules). */
(function () {
  "use strict";
  const B = window.Bitwood;
  const KEY = "bitwood-settings-v1";

  function readSettings() {
    try { return Object.assign({ sfx: true, music: false }, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return { sfx: true, music: false }; }
  }
  function writeSettings(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }

  const settings = readSettings();
  let ctx = null, master = null, sfxBus = null, musicBus = null, noiseBuf = null;
  let gestured = false;

  function ensure() {
    if (!gestured) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(master);
      musicBus = ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  const midi = m => 440 * Math.pow(2, (m - 69) / 12);

  function tone(bus, freq, start, dur, type, vol, slideTo) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, start);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(bus);
    o.start(start); o.stop(start + dur + 0.02);
  }
  function noise(bus, start, dur, vol, hp) {
    const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    s.buffer = noiseBuf;
    f.type = "highpass"; f.frequency.value = hp || 1000;
    g.gain.setValueAtTime(vol || 0.1, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(start); s.stop(start + dur + 0.02);
  }
  function arp(notes, step, type, vol, t0) {
    notes.forEach((m, i) => tone(sfxBus, midi(m), t0 + i * step, step * 1.6, type, vol));
  }

  const SFX = {
    click: t => tone(sfxBus, 880, t, 0.05, "square", 0.05),
    coin: t => { tone(sfxBus, midi(83), t, 0.07, "square", 0.08); tone(sfxBus, midi(88), t + 0.07, 0.16, "square", 0.08); },
    jump: t => tone(sfxBus, 260, t, 0.18, "square", 0.07, 620),
    stomp: t => { noise(sfxBus, t, 0.08, 0.12, 400); tone(sfxBus, 180, t, 0.14, "triangle", 0.15, 60); },
    chest: t => arp([72, 76, 79, 84], 0.06, "square", 0.07, t),
    run: t => { tone(sfxBus, midi(69), t, 0.05, "square", 0.05); tone(sfxBus, midi(76), t + 0.06, 0.05, "square", 0.05); },
    pass: t => arp([72, 76, 79], 0.07, "square", 0.08, t),
    fail: t => { tone(sfxBus, midi(64), t, 0.14, "sawtooth", 0.06); tone(sfxBus, midi(59), t + 0.15, 0.28, "sawtooth", 0.06); },
    win: t => { arp([72, 76, 79, 84, 79, 84, 88], 0.08, "square", 0.08, t); tone(sfxBus, midi(48), t, 0.6, "triangle", 0.15); },
    badge: t => arp([79, 83, 86, 91], 0.07, "square", 0.07, t),
    unlock: t => { tone(sfxBus, midi(67), t, 0.08, "square", 0.07); tone(sfxBus, midi(74), t + 0.09, 0.2, "square", 0.07); }
  };

  function play(name) {
    if (!settings.sfx || !SFX[name]) return;
    if (!ensure()) return;
    try { SFX[name](ctx.currentTime + 0.01); } catch (e) { /* ignore */ }
  }

  /* ---------------- Music: an original 8-bar chiptune loop ---------------- */
  const MELODY = [
    72, 0, 76, 79, 76, 0, 72, 74,
    76, 0, 74, 72, 71, 0, 67, 0,
    69, 0, 72, 76, 74, 0, 72, 71,
    72, 0, 0, 67, 72, 74, 76, 0,
    77, 0, 76, 74, 72, 0, 74, 76,
    79, 0, 77, 76, 74, 0, 72, 0,
    74, 76, 77, 79, 81, 0, 79, 77,
    76, 0, 74, 0, 72, 0, 0, 0
  ];
  const ROOTS = [48, 43, 45, 48, 41, 48, 43, 48];
  const BASS_PATTERN = [0, null, 12, null, 7, null, 12, null];
  const STEP = 60 / 132 / 2; // eighth notes at 132 bpm
  let musicTimer = 0, nextTime = 0, step = 0, musicPlaying = false;

  function schedule() {
    while (nextTime < ctx.currentTime + 0.15) {
      const i = step % MELODY.length, bar = Math.floor(i / 8);
      if (MELODY[i]) tone(musicBus, midi(MELODY[i]), nextTime, STEP * 0.9, "square", 0.045);
      const b = BASS_PATTERN[i % 8];
      if (b !== null) tone(musicBus, midi(ROOTS[bar] + b), nextTime, STEP * 0.95, "triangle", 0.11);
      if (i % 2 === 1) noise(musicBus, nextTime, 0.03, 0.025, 6000);
      if (i % 8 === 0) noise(musicBus, nextTime, 0.09, 0.05, 150);
      nextTime += STEP;
      step++;
    }
  }
  function startMusic() {
    if (musicPlaying || !ensure()) return;
    musicPlaying = true;
    nextTime = ctx.currentTime + 0.08;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(0.55, ctx.currentTime);
    musicTimer = setInterval(schedule, 30);
    schedule();
  }
  function stopMusic() {
    if (!musicPlaying) return;
    musicPlaying = false;
    clearInterval(musicTimer);
    if (ctx) {
      musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
      musicBus.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    }
  }

  /* ---------------- UI: two toggle buttons in the nav ---------------- */
  const ICONS = {
    sfx: '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><path d="M2 6h3v4H2zM5 5h2v6H5zM7 3h2v10H7z"/><path class="on" d="M11 5h1v1h1v4h-1v1h-1v-1h1V6h-1zM13 3h1v1h1v8h-1v1h-1v-1h1V4h-1z"/><path class="off" d="M11 5h1v1h1v1h1V6h1v1h-1v2h1v1h-1V9h-1v1h-1V9h1V7h-1z"/></svg>',
    music: '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><path d="M6 2h8v2H8v7H7v1H6v1H3v-1H2v-2h1V9h3zM12 4h2v7h-1v1h-1v1H9v-1H8v-1h1V9h3z"/><path class="off" d="M1 1h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h-2v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1V9H9V8H8V7H7V6H6V5H5V4H4V3H3V2H1z"/></svg>'
  };
  function buildToggles() {
    const right = document.querySelector(".nav-right");
    if (!right) return;
    const wrap = document.createElement("div");
    wrap.className = "sound-toggles";
    ["sfx", "music"].forEach(kind => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "icon-btn";
      b.dataset.sound = kind;
      b.innerHTML = ICONS[kind];
      wrap.appendChild(b);
      b.addEventListener("click", () => {
        gestured = true;
        settings[kind] = !settings[kind];
        writeSettings(settings);
        if (kind === "music") { if (settings.music) startMusic(); else stopMusic(); }
        else if (settings.sfx) play("click");
        sync();
      });
    });
    right.insertBefore(wrap, right.firstChild);
    sync();
  }
  function sync() {
    document.querySelectorAll(".icon-btn[data-sound]").forEach(b => {
      const kind = b.dataset.sound, on = !!settings[kind];
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("is-off", !on);
      const label = (kind === "music" ? "Music" : "Sound effects") + (on ? " on" : " off");
      b.setAttribute("aria-label", label);
      b.title = label;
    });
  }

  function onFirstGesture() {
    gestured = true;
    window.removeEventListener("pointerdown", onFirstGesture, true);
    window.removeEventListener("keydown", onFirstGesture, true);
    ensure();
    if (settings.music && !document.hidden) startMusic();
  }
  window.addEventListener("pointerdown", onFirstGesture, true);
  window.addEventListener("keydown", onFirstGesture, true);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopMusic();
    else if (settings.music && gestured) startMusic();
  });

  // tiny click blip on game-style buttons
  document.addEventListener("click", e => {
    const el = e.target.closest(".btn-start, .btn-code, .btn-dark, .map-node, .tab");
    if (el && el.id !== "run") play("click");
  });

  document.addEventListener("DOMContentLoaded", buildToggles);

  B.Sound = { play, startMusic, stopMusic, settings };
})();

/* Animated pixel diagrams for Academy lessons.
   Little pixel "packets" travel between boxes, step by step, with a caption for each step.
   Usage: <div class="diagram-slot" data-diagram="request"></div> then Bitwood.Diagrams.mountAll(root). */
(function () {
  "use strict";
  const B = window.Bitwood;
  const C = { blue: "#2cbaff", green: "#4ade80", yellow: "#facc15", pink: "#f472b6", purple: "#c084fc", orange: "#fb923c", red: "#ef4444", cyan: "#22d3ee", gray: "#94a3b8", white: "#f8fafc" };
  const box = (x, y, label, color, w, h) => ({ x, y, w: w || 50, h: h || 26, label, color });
  const dot = (x, y, color, label) => ({ x, y, shape: "dot", r: 5, color, label });

  /* ---------- diagram library ---------- */
  const D = {
    request: {
      title: "How a web request works",
      nodes: { b: box(8, 30, "Browser", C.blue), s: box(95, 30, "Server", C.green), d: box(182, 30, "Database", C.yellow) },
      links: [["b", "s"], ["s", "d"]],
      steps: [
        { packets: [["b", "s", C.yellow]], caption: "The browser sends a request: GET /leaderboard" },
        { packets: [["s", "d", C.pink]], caption: "The server asks the database: SELECT the top players" },
        { packets: [["d", "s", C.green]], caption: "The database sends the rows back" },
        { packets: [["s", "b", C.blue]], caption: "The server responds with JSON (200 OK) and the page updates" }
      ]
    },
    dom: {
      title: "JavaScript and the DOM",
      nodes: { js: box(6, 34, "JavaScript", C.yellow, 54), html: box(140, 4, "html", C.gray, 40, 18), head: box(100, 34, "head", C.gray, 40, 18), body: box(180, 34, "body", C.gray, 40, 18), h1: box(150, 64, "h1", C.blue, 36, 18), btn: box(196, 64, "button", C.pink, 40, 18) },
      links: [["html", "head"], ["html", "body"], ["body", "h1"], ["body", "btn"]],
      steps: [
        { glow: ["html", "head", "body", "h1", "btn"], caption: "The browser turns your HTML into a tree of elements: the DOM" },
        { packets: [["js", "btn", C.yellow]], caption: "JavaScript finds an element: document.querySelector(\"button\")" },
        { packets: [["btn", "js", C.pink]], glow: ["btn"], caption: "The player clicks — a click event runs your listener" },
        { packets: [["js", "h1", C.green]], glow: ["h1"], caption: "JavaScript changes the DOM (h1.textContent = \"Level up!\") and the page updates instantly" }
      ]
    },
    "python-run": {
      title: "How Python runs your program",
      nodes: { file: box(8, 32, "hello.py", C.yellow, 54), py: box(95, 32, "Python", C.blue, 50), out: box(180, 32, "Output", C.green, 54) },
      links: [["file", "py"], ["py", "out"]],
      steps: [
        { packets: [["file", "py", C.yellow]], caption: "The Python interpreter reads your file" },
        { glow: ["py"], caption: "It runs each line in order, from top to bottom" },
        { packets: [["py", "out", C.green]], caption: "print() sends text to the screen: Hello, Bitwood!" }
      ]
    },
    "devops-loop": {
      title: "The DevOps loop",
      nodes: { plan: box(6, 6, "Plan", C.purple, 50, 22), code: box(66, 6, "Code", C.blue, 50, 22), build: box(126, 6, "Build", C.cyan, 50, 22), test: box(186, 6, "Test", C.green, 50, 22),
        release: box(186, 60, "Release", C.yellow, 50, 22), deploy: box(126, 60, "Deploy", C.orange, 50, 22), operate: box(66, 60, "Operate", C.pink, 50, 22), monitor: box(6, 60, "Monitor", C.red, 50, 22) },
      links: [["plan", "code"], ["code", "build"], ["build", "test"], ["test", "release"], ["release", "deploy"], ["deploy", "operate"], ["operate", "monitor"], ["monitor", "plan"]],
      steps: [
        { packets: [["plan", "code", C.white]], caption: "Plan a small change, then write the code" },
        { packets: [["code", "build", C.white]], caption: "Build it automatically" },
        { packets: [["build", "test", C.white]], caption: "Run the automated tests" },
        { packets: [["test", "release", C.white]], caption: "Package a release" },
        { packets: [["release", "deploy", C.white]], caption: "Deploy it to production" },
        { packets: [["deploy", "operate", C.white]], caption: "Operate it for real users" },
        { packets: [["operate", "monitor", C.white]], caption: "Monitor health, errors and speed" },
        { packets: [["monitor", "plan", C.yellow]], caption: "Feedback flows into the next plan — and the loop repeats" }
      ]
    },
    ci: {
      title: "A CI/CD pipeline",
      nodes: { push: box(4, 32, "git push", C.purple, 50), build: box(64, 32, "Build", C.cyan, 50), test: box(124, 32, "Test", C.green, 50), deploy: box(184, 32, "Deploy", C.orange, 52) },
      links: [["push", "build"], ["build", "test"], ["test", "deploy"]],
      steps: [
        { packets: [["push", "build", C.yellow]], caption: "You push code — the pipeline starts automatically" },
        { packets: [["build", "test", C.yellow]], glow: ["build"], caption: "Build ✓ — now the tests run" },
        { packets: [["test", "deploy", C.green]], glow: ["test"], caption: "All tests pass ✓ — deploy to production" },
        { glow: ["deploy"], caption: "Live! Users get the new version within minutes" }
      ]
    },
    docker: {
      title: "From Dockerfile to containers",
      nodes: { file: box(4, 34, "Dockerfile", C.gray, 56), image: box(92, 34, "Image", C.blue, 48), c1: box(176, 6, "container", C.cyan, 60, 20), c2: box(176, 35, "container", C.cyan, 60, 20), c3: box(176, 64, "container", C.cyan, 60, 20) },
      links: [["file", "image"], ["image", "c1"], ["image", "c2"], ["image", "c3"]],
      hidden: ["c1", "c2", "c3"],
      steps: [
        { packets: [["file", "image", C.yellow]], caption: "docker build — the Dockerfile recipe becomes an image" },
        { show: ["c1"], packets: [["image", "c1", C.cyan]], caption: "docker run — a container starts from the image" },
        { show: ["c2"], packets: [["image", "c2", C.cyan]], caption: "Run it again — an identical second container" },
        { show: ["c3"], packets: [["image", "c3", C.cyan]], caption: "Same image, same behaviour — on any computer" }
      ]
    },
    k8s: {
      title: "Kubernetes keeps the desired state",
      nodes: { you: box(4, 34, "deployment.yaml", C.gray, 66), k8s: box(98, 34, "Kubernetes", C.blue, 56), p1: box(186, 6, "pod", C.green, 46, 20), p2: box(186, 35, "pod", C.green, 46, 20), p3: box(186, 64, "pod", C.green, 46, 20) },
      links: [["you", "k8s"], ["k8s", "p1"], ["k8s", "p2"], ["k8s", "p3"]],
      hidden: ["p1", "p2", "p3"],
      steps: [
        { packets: [["you", "k8s", C.yellow]], caption: "kubectl apply — \"I want 3 replicas of my app\"" },
        { show: ["p1", "p2", "p3"], packets: [["k8s", "p1", C.green], ["k8s", "p2", C.green], ["k8s", "p3", C.green]], caption: "Kubernetes starts 3 pods" },
        { fail: ["p2"], caption: "Oh no — one pod crashes!" },
        { unfail: ["p2"], packets: [["k8s", "p2", C.green]], caption: "Kubernetes notices and starts a replacement — desired state restored" }
      ]
    },
    "git-stages": {
      title: "Working directory → staging → repository",
      nodes: { wd: box(4, 32, "Working dir", C.gray, 64), stage: box(90, 32, "Staging", C.yellow, 60), repo: box(172, 32, "Repository", C.green, 64) },
      links: [["wd", "stage"], ["stage", "repo"]],
      steps: [
        { glow: ["wd"], caption: "You edit files in the working directory" },
        { packets: [["wd", "stage", C.yellow]], caption: "git add — choose changes for the next snapshot" },
        { packets: [["stage", "repo", C.green]], caption: "git commit — save the snapshot with a message" },
        { glow: ["repo"], caption: "Every commit stays in history — you can always go back" }
      ]
    },
    "git-branch": {
      title: "Branching and merging",
      nodes: { lm: { x: 2, y: 20, shape: "label", label: "main", color: C.green }, lf: { x: 2, y: 58, shape: "label", label: "feature", color: C.orange },
        m1: dot(60, 24, C.green), m2: dot(96, 24, C.green), f1: dot(130, 62, C.orange), f2: dot(166, 62, C.orange), m3: dot(160, 24, C.green), m4: dot(214, 24, C.yellow, "merge") },
      links: [["m1", "m2"], ["m2", "f1"], ["f1", "f2"], ["m2", "m3"], ["m3", "m4"], ["f2", "m4"]],
      hidden: ["f1", "f2", "m3", "m4"],
      steps: [
        { glow: ["m1", "m2"], caption: "main has two commits" },
        { show: ["f1"], caption: "git switch -c feature — start a branch and commit on it" },
        { show: ["f2"], caption: "Keep committing on the branch — main stays safe" },
        { show: ["m3"], caption: "Meanwhile a teammate adds a commit to main" },
        { show: ["m4"], packets: [["f2", "m4", C.orange]], caption: "git merge feature — both lines join in a merge commit" }
      ]
    },
    "git-remote": {
      title: "Push and pull with GitHub",
      nodes: { you: box(4, 32, "Your laptop", C.blue, 58), gh: box(92, 32, "GitHub", C.purple, 56), mate: box(178, 32, "Teammate", C.pink, 58) },
      links: [["you", "gh"], ["gh", "mate"]],
      steps: [
        { packets: [["you", "gh", C.blue]], caption: "git push — upload your commits to origin" },
        { packets: [["gh", "mate", C.blue]], caption: "Your teammate runs git pull and gets them" },
        { packets: [["mate", "gh", C.pink]], caption: "They push their own commits" },
        { packets: [["gh", "you", C.pink]], caption: "git pull — now you have their work too" }
      ]
    },
    "git-flow": {
      title: "GitHub Flow",
      nodes: { br: box(2, 34, "Branch", C.orange, 36, 22), cm: box(42, 34, "Commit", C.blue, 36, 22), pr: box(82, 34, "PR", C.purple, 36, 22), rv: box(122, 34, "Review", C.yellow, 36, 22), mg: box(162, 34, "Merge", C.green, 36, 22), dp: box(202, 34, "Deploy", C.cyan, 36, 22) },
      links: [["br", "cm"], ["cm", "pr"], ["pr", "rv"], ["rv", "mg"], ["mg", "dp"]],
      steps: [
        { packets: [["br", "cm", C.white]], caption: "Create a branch and commit your change" },
        { packets: [["cm", "pr", C.white]], caption: "Push and open a pull request" },
        { packets: [["pr", "rv", C.white]], caption: "Teammates review; CI runs the tests" },
        { packets: [["rv", "mg", C.green]], caption: "Approved ✓ — merge into main" },
        { packets: [["mg", "dp", C.green]], caption: "main is deployed — repeat many times a day" }
      ]
    },
    "react-tree": {
      title: "A tree of components",
      nodes: { app: box(96, 4, "App", C.blue, 48, 20), nav: box(30, 36, "Navbar", C.cyan, 54, 20), list: box(156, 36, "LevelList", C.cyan, 58, 20), c1: box(126, 66, "LevelCard", C.pink, 54, 18), c2: box(186, 66, "LevelCard", C.pink, 54, 18) },
      links: [["app", "nav"], ["app", "list"], ["list", "c1"], ["list", "c2"]],
      steps: [
        { glow: ["app"], caption: "App is the root component" },
        { packets: [["app", "nav", C.yellow], ["app", "list", C.yellow]], caption: "It renders child components and passes data down as props" },
        { packets: [["list", "c1", C.yellow], ["list", "c2", C.yellow]], caption: "LevelList renders one reusable LevelCard per level" }
      ]
    },
    "react-render": {
      title: "What happens when state changes",
      nodes: { ev: box(2, 34, "click", C.pink, 40, 22), set: box(48, 34, "setState", C.yellow, 44, 22), ren: box(98, 34, "render", C.blue, 42, 22), cmp: box(146, 34, "compare", C.purple, 44, 22), dom: box(196, 34, "DOM", C.green, 40, 22) },
      links: [["ev", "set"], ["set", "ren"], ["ren", "cmp"], ["cmp", "dom"]],
      steps: [
        { packets: [["ev", "set", C.white]], caption: "An event calls the state setter, e.g. setCoins(coins + 1)" },
        { packets: [["set", "ren", C.white]], caption: "React runs your component again with the new state" },
        { packets: [["ren", "cmp", C.white]], caption: "It compares the new result with the previous one" },
        { packets: [["cmp", "dom", C.green]], caption: "Only the parts that changed are updated in the DOM" }
      ]
    },
    encryption: {
      title: "Encryption in action",
      nodes: { ada: box(4, 12, "Ada", C.blue, 46), lin: box(190, 12, "Lin", C.green, 46), eve: box(97, 62, "Attacker", C.red, 50) },
      links: [["ada", "lin"]],
      steps: [
        { glow: ["ada"], caption: "Ada encrypts \"Meet at noon\" with a key → \"x9#Lq@2!\"" },
        { packets: [["ada", "lin", C.red]], caption: "The scrambled message travels across the internet" },
        { packets: [["ada", "eve", C.red]], caption: "An attacker copies it… but only sees gibberish" },
        { glow: ["lin"], caption: "Lin decrypts it with the key: \"Meet at noon\" ✓" }
      ]
    },
    https: {
      title: "The HTTPS handshake (simplified)",
      nodes: { b: box(8, 32, "Browser", C.blue, 56), s: box(176, 32, "bitwood.example", C.green, 60) },
      links: [["b", "s"]],
      steps: [
        { packets: [["b", "s", C.yellow]], caption: "Browser: \"Hello! Prove who you are.\"" },
        { packets: [["s", "b", C.green]], caption: "Server sends its certificate — signed by a trusted authority" },
        { glow: ["b"], caption: "The browser checks the certificate, and both agree on a secret session key" },
        { packets: [["b", "s", C.green], ["s", "b", C.green]], caption: "🔒 Everything is now encrypted with TLS" }
      ]
    },
    training: {
      title: "The training loop",
      nodes: { data: box(4, 32, "Data", C.yellow, 42), model: box(66, 32, "Model", C.purple, 46), pred: box(132, 6, "Prediction", C.blue, 56, 20), loss: box(132, 62, "Loss", C.red, 56, 20) },
      links: [["data", "model"], ["model", "pred"], ["pred", "loss"], ["loss", "model"]],
      steps: [
        { packets: [["data", "model", C.yellow]], caption: "Feed an example into the model" },
        { packets: [["model", "pred", C.blue]], caption: "The model makes a prediction" },
        { packets: [["pred", "loss", C.red]], caption: "The loss measures how wrong it was" },
        { packets: [["loss", "model", C.green]], glow: ["model"], caption: "Nudge the weights to be a little less wrong — repeat thousands of times" }
      ]
    },
    neural: {
      title: "A small neural network",
      nodes: (function () {
        const n = {};
        [15, 40, 65].forEach((y, i) => { n["i" + i] = dot(30, y, C.yellow); });
        [8, 30, 52, 74].forEach((y, i) => { n["a" + i] = dot(95, y, C.purple); });
        [8, 30, 52, 74].forEach((y, i) => { n["b" + i] = dot(160, y, C.purple); });
        n.o0 = dot(220, 28, C.green, "cat"); n.o1 = dot(220, 54, C.gray, "dog");
        return n;
      })(),
      links: (function () {
        const l = [];
        for (let i = 0; i < 3; i++) for (let a = 0; a < 4; a++) l.push(["i" + i, "a" + a]);
        for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) l.push(["a" + a, "b" + b]);
        for (let b = 0; b < 4; b++) for (let o = 0; o < 2; o++) l.push(["b" + b, "o" + o]);
        return l;
      })(),
      steps: [
        { glow: ["i0", "i1", "i2"], caption: "Inputs (for example the pixels of a drawing) enter the network" },
        { packets: [].concat(...[0, 1, 2].map(i => [0, 1, 2, 3].map(a => ["i" + i, "a" + a, C.yellow]))), caption: "Each neuron weighs its inputs and passes a signal on" },
        { packets: [].concat(...[0, 1, 2, 3].map(a => [0, 1, 2, 3].map(b => ["a" + a, "b" + b, C.purple]))), caption: "Hidden layers combine simple patterns into complex ones" },
        { packets: [0, 1, 2, 3].map(b => ["b" + b, "o0", C.green]), glow: ["o0"], caption: "The output layer answers: \"cat\" — 92% sure" }
      ]
    }
  };

  /* ---------- rendering ---------- */
  const W = 240, H = 90, STEP_MS = 2300, TRAVEL_MS = 1200;
  const center = n => n.shape === "dot" ? [n.x, n.y] : n.shape === "label" ? [n.x, n.y] : [n.x + n.w / 2, n.y + n.h / 2];
  function line(ctx, a, b, color) {
    let [x0, y0] = a.map(Math.round); const [x1, y1] = b.map(Math.round);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, k = 0;
    ctx.fillStyle = color;
    for (;;) {
      if (k++ % 3 === 0) ctx.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  function mount(slot) {
    const spec = D[slot.dataset.diagram];
    if (!spec || slot.dataset.mounted) return;
    slot.dataset.mounted = "1";
    const fig = document.createElement("figure");
    fig.className = "diagram pixel-box";
    fig.innerHTML =
      '<div class="dg-head"><span class="dg-title">' + B.escapeHTML(spec.title) + '</span><button type="button" class="dg-toggle" aria-label="Pause animation">❚❚</button></div>' +
      '<div class="dg-stage"><canvas width="' + W + '" height="' + H + '" aria-hidden="true"></canvas><div class="dg-labels" aria-hidden="true"></div></div>' +
      '<figcaption><span class="dg-step"></span><span class="dg-cap"></span></figcaption>' +
      '<ol class="sr-only">' + spec.steps.map(s => "<li>" + B.escapeHTML(s.caption) + "</li>").join("") + "</ol>";
    slot.replaceWith(fig);
    const canvas = fig.querySelector("canvas"), ctx = canvas.getContext("2d");
    const labels = fig.querySelector(".dg-labels"), cap = fig.querySelector(".dg-cap"), stepEl = fig.querySelector(".dg-step"), toggle = fig.querySelector(".dg-toggle");
    const labelEls = {};
    Object.entries(spec.nodes).forEach(([id, n]) => {
      if (!n.label) return;
      const el = document.createElement("span");
      el.className = "dg-label" + (n.shape === "dot" ? " is-dot" : n.shape === "label" ? " is-text" : "");
      el.textContent = n.label;
      const [cx, cy] = center(n);
      el.style.left = (n.shape === "label" ? n.x / W * 100 : cx / W * 100) + "%";
      el.style.top = (n.shape === "dot" ? (cy + 8) / H * 100 : cy / H * 100) + "%";
      if (n.shape === "label") el.style.color = n.color;
      labels.appendChild(el);
      labelEls[id] = el;
    });

    let step = -1, stepStart = 0, visible = new Set(), failed = new Set(), playing = !B.reduceMotion, inView = false, raf = 0;
    const hidden = new Set(spec.hidden || []);
    function resetCycle() {
      visible = new Set(Object.keys(spec.nodes).filter(id => !hidden.has(id)));
      failed = new Set();
    }
    function setStep(i, now) {
      step = i; stepStart = now;
      const s = spec.steps[i];
      (s.show || []).forEach(id => visible.add(id));
      (s.fail || []).forEach(id => failed.add(id));
      (s.unfail || []).forEach(id => failed.delete(id));
      stepEl.textContent = (i + 1) + " / " + spec.steps.length;
      cap.textContent = s.caption;
      Object.entries(labelEls).forEach(([id, el]) => { el.classList.toggle("is-hidden", !visible.has(id)); });
    }
    function draw(now) {
      const s = spec.steps[step] || {};
      const t = Math.min(1, (now - stepStart) / TRAVEL_MS);
      const arrived = t >= 1;
      ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0b1224";
      for (let y = 4; y < H; y += 8) for (let x = 4; x < W; x += 8) ctx.fillRect(x, y, 1, 1);
      (spec.links || []).forEach(([a, b]) => { if (visible.has(a) && visible.has(b)) line(ctx, center(spec.nodes[a]), center(spec.nodes[b]), "#334155"); });
      const glow = new Set((s.glow || []).concat(arrived ? (s.packets || []).map(p => p[1]) : []));
      Object.entries(spec.nodes).forEach(([id, n]) => {
        if (!visible.has(id) || n.shape === "label") return;
        const lit = glow.has(id) && Math.floor(now / 200) % 2 === 0, bad = failed.has(id);
        const col = bad ? C.red : n.color;
        if (n.shape === "dot") {
          for (let dy = -n.r; dy <= n.r; dy++) for (let dx = -n.r; dx <= n.r; dx++) {
            const d = dx * dx + dy * dy;
            if (d <= n.r * n.r) { ctx.fillStyle = d >= (n.r - 1) * (n.r - 1) ? "#0b1020" : (lit ? C.white : col); ctx.fillRect(n.x + dx, n.y + dy, 1, 1); }
          }
          return;
        }
        ctx.fillStyle = "#0b1020"; ctx.fillRect(n.x - 1, n.y - 1, n.w + 2, n.h + 3);
        ctx.fillStyle = lit ? col : "#0f172a"; ctx.globalAlpha = lit ? 0.35 : 1; ctx.fillRect(n.x, n.y, n.w, n.h); ctx.globalAlpha = 1;
        ctx.fillStyle = col;
        ctx.fillRect(n.x, n.y, n.w, 2); ctx.fillRect(n.x, n.y + n.h - 2, n.w, 2); ctx.fillRect(n.x, n.y, 2, n.h); ctx.fillRect(n.x + n.w - 2, n.y, 2, n.h);
        if (bad) { for (let k = 0; k < 8; k++) { ctx.fillRect(n.x + n.w / 2 - 4 + k, n.y + n.h / 2 - 4 + k, 1, 1); ctx.fillRect(n.x + n.w / 2 + 3 - k, n.y + n.h / 2 - 4 + k, 1, 1); } }
      });
      if (!arrived) (s.packets || []).forEach(([a, b, color]) => {
        const A = center(spec.nodes[a]), Bc = center(spec.nodes[b]);
        const q = Math.floor(t * 14) / 14;
        for (let tr = 2; tr >= 0; tr--) {
          const tt = Math.max(0, q - tr * 0.05);
          const x = Math.round(A[0] + (Bc[0] - A[0]) * tt) - 2, y = Math.round(A[1] + (Bc[1] - A[1]) * tt) - 2;
          ctx.globalAlpha = tr === 0 ? 1 : 0.35 / tr;
          ctx.fillStyle = "#0b1020"; ctx.fillRect(x - 1, y - 1, 6, 6);
          ctx.fillStyle = color; ctx.fillRect(x, y, 4, 4);
        }
        ctx.globalAlpha = 1;
      });
    }
    function frame(now) {
      if (!playing || !inView) { raf = 0; return; }
      if (now - stepStart > STEP_MS) {
        if (step + 1 >= spec.steps.length) { resetCycle(); setStep(0, now); }
        else setStep(step + 1, now);
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    }
    function play() { if (!raf && playing && inView) raf = requestAnimationFrame(frame); }
    toggle.addEventListener("click", () => {
      playing = !playing;
      toggle.textContent = playing ? "❚❚" : "▶";
      toggle.setAttribute("aria-label", playing ? "Pause animation" : "Play animation");
      if (playing) { stepStart = performance.now(); play(); }
    });
    resetCycle();
    if (B.reduceMotion) {
      // static: show the finished picture and list every step as the caption
      spec.steps.forEach((s, i) => setStep(i, 0));
      stepStart = -1e9; step = spec.steps.length - 1;
      draw(1e9);
      stepEl.textContent = "";
      cap.innerHTML = spec.steps.map((s, i) => (i + 1) + ". " + B.escapeHTML(s.caption)).join("<br>");
      toggle.hidden = true;
      return;
    }
    setStep(0, performance.now());
    draw(performance.now());
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(es => { inView = es[0].isIntersecting; if (inView) { stepStart = performance.now(); play(); } }).observe(fig);
    } else { inView = true; play(); }
  }

  function mountAll(root) { (root || document).querySelectorAll(".diagram-slot[data-diagram]").forEach(mount); }

  B.Diagrams = { mountAll, list: D };
})();

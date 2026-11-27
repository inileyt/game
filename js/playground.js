/* Playground: write any JavaScript, see console output, and draw pixel art on a 32×32 grid. */
(function () {
  "use strict";
  const B = window.Bitwood;
  const $ = id => document.getElementById(id);
  const SIZE = 32;

  const EXAMPLES = {
    hello: {
      name: "Hello, Bitwood",
      code: '// Write any JavaScript and press Run!\nconst hero = "You";\nconsole.log(`Hello, ${hero}! Welcome to the playground.`);\n\nfor (let i = 1; i <= 3; i++) {\n  console.log("Level", i, "★".repeat(i));\n}\n'
    },
    heart: {
      name: "Pixel heart",
      code: '// pixel(x, y, color) paints one square on the 32×32 grid.\nconst art = [\n  "..XX...XX..",\n  ".XRRX.XRRX.",\n  "XRWRRXRRRRX",\n  "XRRRRRRRRRX",\n  ".XRRRRRRRX.",\n  "..XRRRRRX..",\n  "...XRRRX...",\n  "....XRX....",\n  ".....X....."\n];\nconst colors = { X: "#0b1020", R: "#ef4444", W: "#ffffff" };\n\nclear("#1e293b");\nart.forEach((row, y) => {\n  [...row].forEach((ch, x) => {\n    if (colors[ch]) pixel(x + 10, y + 11, colors[ch]);\n  });\n});\nconsole.log("Drew a heart!");\n'
    },
    rainbow: {
      name: "Rainbow stripes",
      code: 'const rainbow = ["#ef4444", "#f97316", "#facc15", "#4ade80", "#2cbaff", "#6366f1", "#a855f7"];\n\nfor (let y = 0; y < 32; y++) {\n  for (let x = 0; x < 32; x++) {\n    const band = Math.floor((x + y) / 5) % rainbow.length;\n    pixel(x, y, rainbow[band]);\n  }\n}\nconsole.log("Rainbow done!");\n'
    },
    stars: {
      name: "Night sky",
      code: 'clear("#0a0f3d");\n\n// 60 random stars\nfor (let i = 0; i < 60; i++) {\n  const x = Math.floor(Math.random() * 32);\n  const y = Math.floor(Math.random() * 20);\n  pixel(x, y, Math.random() > 0.8 ? "#fde047" : "#ffffff");\n}\n\n// grass\nfor (let x = 0; x < 32; x++) {\n  for (let y = 26; y < 32; y++) pixel(x, y, y === 26 ? "#4ade80" : "#6b3f22");\n}\nconsole.log("Press Run again for new stars!");\n'
    },
    fizz: {
      name: "FizzBuzz 1–15",
      code: 'for (let n = 1; n <= 15; n++) {\n  if (n % 15 === 0) console.log("FizzBuzz");\n  else if (n % 3 === 0) console.log("Fizz");\n  else if (n % 5 === 0) console.log("Buzz");\n  else console.log(n);\n}\n'
    }
  };

  let ctx;
  function resetCanvas(color) {
    ctx.fillStyle = color || "#020617";
    ctx.fillRect(0, 0, SIZE, SIZE);
  }
  function paint(draws) {
    resetCanvas();
    for (const d of draws) {
      if (d[0] === "c") resetCanvas(d[1]);
      else if (d[1] >= 0 && d[1] < SIZE && d[2] >= 0 && d[2] < SIZE) {
        ctx.fillStyle = d[3];
        ctx.fillRect(d[1], d[2], 1, 1);
      }
    }
  }

  function init() {
    const canvas = $("pg-canvas");
    canvas.width = SIZE; canvas.height = SIZE;
    ctx = canvas.getContext("2d");
    resetCanvas();

    const saved = B.Store.get().code.playground;
    const out = B.Code.createConsole($("console"));
    let busy = false;
    const editor = B.Code.createEditor({
      initial: typeof saved === "string" ? saved : EXAMPLES.hello.code,
      onChange: code => B.Store.saveCode("playground", code),
      onRun: run
    });

    const select = $("pg-examples");
    select.innerHTML = '<option value="">Load an example…</option>' + Object.keys(EXAMPLES).map(k => '<option value="' + k + '">' + B.escapeHTML(EXAMPLES[k].name) + "</option>").join("");
    select.addEventListener("change", () => {
      const ex = EXAMPLES[select.value];
      if (!ex) return;
      if (editor.value.trim() && editor.value !== ex.code && !window.confirm("Replace your code with the \"" + ex.name + "\" example?")) { select.value = ""; return; }
      editor.value = ex.code;
      select.value = "";
      editor.focus();
    });

    async function run() {
      if (busy) return;
      busy = true;
      const btn = $("run");
      btn.setAttribute("aria-busy", "true");
      btn.querySelector(".t-label").textContent = "Running";
      out.clear();
      out.log("$ node playground.js", "muted");
      if (B.Sound) B.Sound.play("run");
      const res = await B.Code.runFree(editor.value);
      busy = false;
      btn.removeAttribute("aria-busy");
      btn.querySelector(".t-label").textContent = "Run ▶";
      (res.logs || []).forEach(l => out.log(l, "log"));
      if (res.draws && res.draws.length) paint(res.draws);
      if (res.error) {
        out.log("✗ " + res.error, "err");
        if (B.Sound) B.Sound.play("fail");
      } else {
        if (!(res.logs || []).length && !(res.draws || []).length) out.log("(no output — try console.log or pixel)", "muted");
        out.log("✓ Finished", "ok");
        if (B.Sound) B.Sound.play("pass");
      }
      B.Store.bumpStat("playRuns");
      if (res.draws && res.draws.length) B.Store.bumpStat("pixelArt");
      B.checkBadges();
    }

    $("run").addEventListener("click", run);
    $("pg-clear").addEventListener("click", () => { out.clear(); resetCanvas(); out.log("// Cleared.", "muted"); });
    $("pg-download").addEventListener("click", () => {
      const big = document.createElement("canvas");
      big.width = big.height = SIZE * 16;
      const g = big.getContext("2d");
      g.imageSmoothingEnabled = false;
      g.drawImage(canvas, 0, 0, big.width, big.height);
      const a = document.createElement("a");
      a.download = "bitwood-pixel-art.png";
      a.href = big.toDataURL("image/png");
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

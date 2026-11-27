/* Glossary: short definitions for tech words. Terms in lessons become clickable buttons that open a
   pop-up with the definition; glossary.html lists every term A–Z with search. */
(function () {
  "use strict";
  const B = window.Bitwood;
  // [term, definition, extra words that should also match]
  const TERMS = [
    ["2FA", "Two-factor authentication: logging in with two different proofs, like a password plus a code from your phone.", ["two-factor authentication"]],
    ["Accessibility", "Making websites usable by everyone, including people who use screen readers, keyboards or need bigger text.", ["a11y"]],
    ["Algorithm", "A step-by-step recipe for solving a problem."],
    ["API", "Application Programming Interface — a set of URLs or functions other programs can call to read or change data."],
    ["Array", "An ordered list of values, like [\"sword\", \"shield\"]. Items are numbered from 0."],
    ["Authentication", "Checking who someone is — for example logging in with a password."],
    ["Authorization", "Deciding what a logged-in user is allowed to do."],
    ["Backend", "The part of an app that runs on servers: data, logins, rules and APIs."],
    ["Bias", "When a system treats some groups unfairly — in AI often because of unbalanced training data."],
    ["Branch", "In Git, a separate line of development so you can work without breaking the main version.", ["branches"]],
    ["Browser", "The program you use to visit websites, like Chrome, Firefox or Safari."],
    ["Cache", "A fast storage place that keeps results so they don't have to be recalculated or downloaded again."],
    ["CDN", "Content Delivery Network — servers around the world that deliver files quickly from somewhere close to the user."],
    ["CI", "Continuous Integration — automatically building and testing every code change.", ["continuous integration"]],
    ["CD", "Continuous Delivery/Deployment — automatically getting tested code ready for, or out to, production.", ["continuous delivery", "continuous deployment"]],
    ["Client", "The program that asks a server for something — usually the browser."],
    ["Cloud", "Computers, storage and services you rent over the internet from providers like AWS, Google Cloud or Azure."],
    ["Commit", "A saved snapshot of your project in Git, with a message explaining the change."],
    ["Component", "A reusable piece of a user interface, like a button or a card. React apps are made of components."],
    ["Container", "A packaged app with everything it needs, so it runs the same on any computer (for example with Docker)."],
    ["Cookie", "A small piece of data a website stores in your browser, often used to remember that you're logged in."],
    ["CSS", "Cascading Style Sheets — the language that styles web pages: colors, sizes and layout."],
    ["Database", "A program that stores data permanently and lets you search and change it quickly."],
    ["Deep learning", "Machine learning with neural networks that have many layers."],
    ["Deploy", "Putting a new version of software live so users can use it.", ["deployment", "deploying"]],
    ["DevOps", "A way of working where development and operations teams cooperate and automate building, testing and releasing software."],
    ["Dictionary", "In Python, a collection of key–value pairs, like {\"hp\": 10}."],
    ["DNS", "Domain Name System — turns names like example.com into IP addresses."],
    ["Docker", "A popular tool for building and running containers."],
    ["Docker image", "A read-only blueprint used to start containers."],
    ["DOM", "Document Object Model — the browser's live tree of a page's elements, which JavaScript can read and change."],
    ["Encryption", "Scrambling data so only someone with the right key can read it."],
    ["Endpoint", "One URL of an API, like GET /players."],
    ["Environment variable", "A setting given to a program from outside its code — the safe place for secrets like API keys.", ["environment variables"]],
    ["Firewall", "A gatekeeper that allows or blocks network traffic based on rules."],
    ["Fork", "Your own copy of someone else's repository on GitHub."],
    ["Framework", "A ready-made structure of code that helps you build apps faster, like React or Express."],
    ["Frontend", "The part of an app that runs in the browser: what people see and click."],
    ["Function", "A named, reusable block of code that can take inputs and return a result."],
    ["Git", "A version control system that records every change to your files."],
    ["GitHub", "A website that hosts Git repositories and adds teamwork tools like pull requests."],
    ["GPU", "Graphics Processing Unit — a chip that does many calculations at once; great for games and AI."],
    ["Hallucination", "When an AI model confidently says something that isn't true."],
    ["Hash", "A one-way fingerprint of data. It can't be turned back into the original.", ["hashing"]],
    ["Hook", "A React function starting with \"use\", like useState, that adds features to components."],
    ["HTML", "HyperText Markup Language — describes the structure and content of web pages."],
    ["HTTP", "HyperText Transfer Protocol — the rules browsers and servers use to send requests and responses."],
    ["HTTPS", "HTTP with TLS encryption, so data between browser and server is private."],
    ["IP address", "A number that identifies a device on a network, like 192.168.1.10."],
    ["JavaScript", "The programming language that runs in web browsers and makes pages interactive."],
    ["JSON", "JavaScript Object Notation — a simple text format for data, used by most APIs."],
    ["JSX", "HTML-like syntax used inside JavaScript in React."],
    ["JWT", "JSON Web Token — a signed token that proves who a user is."],
    ["Kubernetes", "A system that runs and manages many containers across many servers (also called K8s)."],
    ["Linux", "A free operating system that runs most servers in the world."],
    ["LLM", "Large Language Model — an AI trained on lots of text to predict the next token.", ["large language model"]],
    ["Load balancer", "Spreads incoming requests across several servers."],
    ["Loop", "Code that repeats, like a for or while loop."],
    ["Machine learning", "Teaching computers to find patterns from examples instead of writing every rule."],
    ["Malware", "Software made to cause harm, like viruses, spyware or ransomware."],
    ["Merge", "Combining the changes from one Git branch into another."],
    ["Merge conflict", "When two branches change the same lines and Git needs a person to decide.", ["conflict"]],
    ["Middleware", "Code that runs before your route handlers on a server, for things like parsing or auth checks."],
    ["AI model", "The trained program that makes predictions in machine learning.", ["machine learning model", "language model"]],
    ["Neural network", "An AI model made of layers of simple connected units (\"neurons\")."],
    ["Overfitting", "When a model memorises its training data and does badly on new data."],
    ["Phishing", "A fake message that tries to trick you into clicking a link or giving away information."],
    ["Pipeline", "An automated series of steps, such as build → test → deploy."],
    ["Pod", "The smallest unit Kubernetes runs — one or more containers together."],
    ["Port", "A number that identifies which service on a computer you're talking to, like 443 for HTTPS."],
    ["Prompt", "The instructions or question you give an AI model."],
    ["Props", "Inputs passed from a parent React component to a child."],
    ["Pull request", "A request to merge a branch, where teammates review the changes and automated checks run.", ["PR"]],
    ["Python", "A popular, beginner-friendly programming language used for automation, data and AI."],
    ["Ransomware", "Malware that encrypts your files and demands payment."],
    ["React", "A JavaScript library for building user interfaces from components."],
    ["Remote", "A copy of a Git repository on another computer, like GitHub (usually called origin)."],
    ["Repository", "A project folder whose history is tracked by Git.", ["repo"]],
    ["Responsive design", "Designing pages that adapt to phones, tablets and big screens."],
    ["REST", "A popular style for designing APIs around resources and HTTP methods."],
    ["Rollback", "Going back to the previous working version after a bad release."],
    ["Server", "A computer (or program) that answers requests from clients."],
    ["SQL", "Structured Query Language — the language for asking relational databases questions."],
    ["SQL injection", "An attack where user input is run as part of a database query. Prevented with parameterized queries."],
    ["State", "Data that can change over time, like a score or what's currently running. In React, changing state updates the screen."],
    ["Status code", "A number in an HTTP response that says how it went, like 200 OK or 404 Not Found."],
    ["Terminal", "A text window where you control a computer by typing commands.", ["command line"]],
    ["TLS", "Transport Layer Security — the encryption behind HTTPS."],
    ["Token", "A small piece of something: in security, a signed string proving who you are; in AI, a chunk of text."],
    ["Training", "The process where a machine learning model learns from data by reducing its errors."],
    ["URL", "The address of a page or file on the web, like https://example.com/page."],
    ["Variable", "A named box that stores a value."],
    ["Version control", "Tracking every change to files over time, so you can compare and go back."],
    ["VPN", "Virtual Private Network — an encrypted tunnel to another network."],
    ["XSS", "Cross-site scripting — an attack where a site shows user input as HTML so scripts run in other people's browsers."]
  ];
  const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const byKey = new Map();
  TERMS.forEach(([term, def, alts]) => {
    const entry = { term, def, id: slug(term) };
    [term].concat(alts || []).forEach(k => byKey.set(k.toLowerCase(), entry));
  });
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // longest first so "SQL injection" wins over "SQL"; acronyms (all caps) are matched case-sensitively
  const keys = [...byKey.keys()].sort((a, b) => b.length - a.length);
  const original = new Map();
  TERMS.forEach(([term, , alts]) => [term].concat(alts || []).forEach(k => original.set(k.toLowerCase(), k)));
  // match case-insensitively; lookup() then rejects acronyms whose case doesn't match exactly ("api" ≠ "API")
  const RE = new RegExp("\\b(" + keys.map(k => /^[A-Z0-9]{2,}$/.test(original.get(k)) ? esc(original.get(k)) : esc(k) + "(?:e?s)?").join("|") + ")\\b", "gi");
  function lookup(match) {
    const m = match.toLowerCase();
    if (byKey.has(m)) {
      const word = original.get(m);
      if (/^[A-Z0-9]{2,}$/.test(word) && match !== word) return null; // "api" in prose is not the acronym
      return byKey.get(m);
    }
    const base = m.replace(/e?s$/, "");
    return byKey.get(base) || byKey.get(m.replace(/s$/, "")) || null;
  }

  /* Turn the first mention of each term inside `root` (paragraphs and list items) into a button */
  function link(root) {
    const used = new Set();
    root.querySelectorAll("p, li").forEach(el => {
      if (el.closest(".ac-checks, .ac-done, .ac-nav, .diagram, .ac-points")) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: n => n.parentElement.closest("code, a, button, .gloss") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const text = node.nodeValue;
        RE.lastIndex = 0;
        let m, last = 0, frag = null;
        while ((m = RE.exec(text))) {
          const entry = lookup(m[0]);
          if (!entry || used.has(entry.id)) continue;
          used.add(entry.id);
          frag = frag || document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "gloss";
          btn.dataset.term = entry.id;
          btn.textContent = m[0];
          btn.setAttribute("aria-label", m[0] + " — show definition");
          frag.appendChild(btn);
          last = m.index + m[0].length;
        }
        if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); node.replaceWith(frag); }
      });
    });
  }

  /* Definition pop-up */
  let pop = null;
  function close(focusBack) {
    if (!pop) return;
    const opener = pop._opener;
    pop.remove(); pop = null;
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("pointerdown", onOutside, true);
    if (focusBack && opener) opener.focus();
  }
  function onKey(e) { if (e.key === "Escape") { e.preventDefault(); close(true); } }
  function onOutside(e) { if (pop && !pop.contains(e.target) && e.target !== pop._opener) close(false); }
  function open(btn) {
    close(false);
    const entry = TERMS.map(t => ({ term: t[0], def: t[1], id: slug(t[0]) })).find(t => t.id === btn.dataset.term);
    if (!entry) return;
    pop = document.createElement("div");
    pop.className = "gloss-pop pixel-box";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", entry.term);
    pop.innerHTML = '<b class="gloss-term"><img class="pixelated" alt="" src="' + B.spriteURL("scroll", 2) + '">' + B.escapeHTML(entry.term) + "</b><p>" + B.escapeHTML(entry.def) + '</p><a href="glossary.html#' + entry.id + '">All terms →</a>';
    document.body.appendChild(pop);
    pop._opener = btn;
    pop._y = window.scrollY;
    const r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8) + "px";
    pop.style.top = (r.bottom + h + 12 > window.innerHeight ? Math.max(8, r.top - h - 8) : r.bottom + 8) + "px";
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onOutside, true);
    pop.querySelector("a").focus({ preventScroll: true });
  }
  document.addEventListener("click", e => {
    const btn = e.target.closest(".gloss");
    if (!btn) return;
    if (pop && pop._opener === btn) { close(true); return; }
    open(btn);
  });
  // close only on a real scroll — clicking can nudge the page a few pixels
  window.addEventListener("scroll", () => { if (pop && Math.abs(window.scrollY - pop._y) > 60) close(false); }, { passive: true });
  window.addEventListener("resize", () => close(false));

  /* glossary.html: A–Z list with search */
  function renderPage() {
    const list = document.getElementById("gloss-list");
    if (!list) return;
    const sorted = TERMS.slice().sort((a, b) => a[0].localeCompare(b[0], "en", { sensitivity: "base" }));
    const letters = [...new Set(sorted.map(t => t[0][0].toUpperCase().replace(/[0-9]/, "#")))];
    document.getElementById("gloss-letters").innerHTML = letters.map(l => '<a href="#letter-' + (l === "#" ? "0" : l) + '">' + l + "</a>").join("");
    let html = "", cur = "";
    sorted.forEach(([term, def]) => {
      const l = term[0].toUpperCase().replace(/[0-9]/, "#");
      if (l !== cur) { if (cur) html += "</dl>"; cur = l; html += '<h2 class="gloss-letter" id="letter-' + (l === "#" ? "0" : l) + '">' + l + '</h2><dl class="gloss-dl">'; }
      html += '<div class="gloss-item" id="' + slug(term) + '" data-text="' + B.escapeHTML((term + " " + def).toLowerCase()) + '"><dt>' + B.escapeHTML(term) + "</dt><dd>" + B.escapeHTML(def) + "</dd></div>";
    });
    list.innerHTML = html + "</dl>";
    document.getElementById("gloss-count").textContent = TERMS.length + " terms";
    const input = document.getElementById("gloss-search"), none = document.getElementById("gloss-none");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      list.querySelectorAll(".gloss-item").forEach(it => { const ok = !q || it.dataset.text.includes(q); it.hidden = !ok; if (ok) shown++; });
      list.querySelectorAll(".gloss-dl").forEach(dl => { const any = [...dl.children].some(c => !c.hidden); dl.hidden = !any; dl.previousElementSibling.hidden = !any; });
      none.hidden = shown > 0;
    });
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) { target.classList.add("is-target"); setTimeout(() => target.scrollIntoView({ block: "center" }), 100); }
    }
  }
  document.addEventListener("DOMContentLoaded", renderPage);

  B.Glossary = { link, terms: TERMS };
})();

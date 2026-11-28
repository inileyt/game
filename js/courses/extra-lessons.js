/* Extra Academy lessons: 3 more lessons per course (lessons 11–13) and 3 more exam questions each.
   Loaded after all course files. */
(function () {
  "use strict";
  const EXTRA = {
    frontend: {
      lessons: [
        {
          title: "Transitions & animations",
          minutes: 7,
          summary: "Make interfaces feel alive with CSS transitions and keyframe animations.",
          sections: [
            { h: "Transitions", p: ["A <b>transition</b> smoothly changes a property when it changes — for example on hover. Say which property, how long, and the easing."],
              code: ".btn {\n  background: #facc15;\n  transition: background 0.2s ease, transform 0.1s;\n}\n.btn:hover { background: #fde047; }\n.btn:active { transform: translateY(2px); }", lang: "css" },
            { h: "Keyframe animations", p: ["<code>@keyframes</code> describe an animation step by step; <code>animation</code> plays it. Animate <code>transform</code> and <code>opacity</code> — they are the fastest for the browser."],
              code: "@keyframes float {\n  from { transform: translateY(0); }\n  to   { transform: translateY(-6px); }\n}\n.coin { animation: float 1s ease-in-out infinite alternate; }", lang: "css" },
            { h: "Respect motion settings", p: ["Some people get dizzy from motion. Turn animations down for them with the <code>prefers-reduced-motion</code> media query — Bitwood does this too."],
              code: "@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; transition: none !important; }\n}", lang: "css" }
          ],
          points: ["Transitions animate a change between two states.", "@keyframes + animation for repeating or multi-step motion.", "Respect prefers-reduced-motion."],
          checks: [
            { q: "Which CSS properties are fastest to animate?", options: ["transform and opacity", "width and height", "margin and padding", "font-family"], answer: 0, explain: "They don't force the browser to recalculate the layout." },
            { q: "What is <code>prefers-reduced-motion</code> for?", options: ["Turning motion down for people who ask for less animation", "Making animations faster", "Loading fonts", "Printing pages"], answer: 0, explain: "It's an accessibility setting from the operating system." }
          ]
        },
        {
          title: "Web performance",
          minutes: 7,
          summary: "Fast pages keep visitors happy — measure, then shrink and delay what you can.",
          sections: [
            { h: "Why speed matters", p: ["Every extra second of loading makes people leave. Google's <b>Core Web Vitals</b> measure loading speed (LCP), responsiveness (INP) and layout jumps (CLS). <b>Lighthouse</b> in DevTools gives you a score and tips."] },
            { h: "Quick wins", p: ["Compress images and use modern formats (WebP/AVIF), give images a <code>width</code> and <code>height</code> so the layout doesn't jump, lazy-load images below the fold, and load scripts with <code>defer</code>."],
              code: "<img src=\"castle.webp\" width=\"640\" height=\"360\"\n     loading=\"lazy\" alt=\"A pixel castle\">\n\n<script src=\"app.js\" defer></script>", lang: "html" },
            { h: "Send less", p: ["Every kilobyte has to travel. Remove unused code, minify CSS/JS, and let a <b>CDN</b> and browser cache serve files close to the user."] }
          ],
          points: ["Measure first: Lighthouse and Core Web Vitals.", "Optimise images, set sizes, lazy-load, defer scripts.", "Send less code; cache and use a CDN."],
          checks: [
            { q: "What does <code>loading=\"lazy\"</code> on an image do?", options: ["Loads it only when it's about to scroll into view", "Makes it blurry", "Deletes it on slow phones", "Loads it twice"], answer: 0, explain: "Off-screen images wait until they're needed." },
            { q: "Which DevTools tool scores your page's performance?", options: ["Lighthouse", "Console", "Elements", "Sources"], answer: 0, explain: "Lighthouse audits performance, accessibility and more." }
          ]
        },
        {
          title: "Storing data in the browser",
          minutes: 6,
          summary: "localStorage, sessionStorage and cookies — remember things between visits.",
          sections: [
            { h: "localStorage", p: ["<code>localStorage</code> keeps small bits of text in the browser, even after it's closed. Save objects by turning them into JSON. (Bitwood saves your progress this way!)"],
              code: "const save = { xp: 120, level: 3 };\nlocalStorage.setItem(\"save\", JSON.stringify(save));\n\nconst loaded = JSON.parse(localStorage.getItem(\"save\"));\nconsole.log(loaded.xp);   // 120", lang: "js" },
            { h: "sessionStorage and cookies", p: ["<code>sessionStorage</code> works the same but is cleared when the tab closes. <b>Cookies</b> are small values that are also sent to the server with every request — used for logins."] },
            { h: "Rules", p: ["Never store passwords or secret tokens in localStorage. Storage can be empty (private mode, cleared data), so always handle missing values."] }
          ],
          points: ["localStorage persists; sessionStorage ends with the tab.", "Store objects as JSON strings.", "No secrets in browser storage; handle empty storage."],
          checks: [
            { q: "How do you save an object in localStorage?", options: ["Convert it with JSON.stringify first", "Save it directly as an object", "Use CSS", "It's impossible"], answer: 0, explain: "localStorage only stores strings." },
            { q: "Which storage is cleared when the tab is closed?", options: ["sessionStorage", "localStorage", "A database", "GitHub"], answer: 0, explain: "Session = this tab's session." }
          ]
        }
      ],
      exam: [
        { q: "Which CSS feature smoothly animates a property when it changes, e.g. on hover?", options: ["transition", "display", "z-index", "float"], answer: 0, explain: "<code>transition: background 0.2s</code>." },
        { q: "What does Lighthouse measure?", options: ["Performance, accessibility and best practices of a page", "The temperature of the server", "Git history", "Database size"], answer: 0, explain: "It's a page audit tool in DevTools." },
        { q: "Where should you NOT store a password?", options: ["In localStorage", "In a password manager", "As a hash on the server", "In your head"], answer: 0, explain: "Any script on the page can read localStorage." }
      ]
    },
    backend: {
      lessons: [
        {
          title: "Background jobs & queues",
          minutes: 7,
          summary: "Do slow work later so users never wait.",
          sections: [
            { h: "Don't make users wait", p: ["Sending emails, resizing images or creating reports can take seconds. Instead of doing it during the request, put a <b>job</b> on a <b>queue</b> and answer the user right away. A separate <b>worker</b> process picks jobs from the queue and does the work."],
              code: "app.post(\"/signup\", async (req, res) => {\n  const user = await db.createUser(req.body);\n  await queue.add(\"welcome-email\", { userId: user.id });  // later!\n  res.status(201).json(user);                               // fast answer\n});", lang: "js" },
            { h: "Retries and scheduling", p: ["Queues (like BullMQ, Sidekiq or RabbitMQ) can <b>retry</b> failed jobs and run <b>scheduled</b> jobs, such as a nightly backup or a daily leaderboard reset."] }
          ],
          points: ["Slow work goes to a queue; a worker processes it.", "The user gets a fast response.", "Queues retry failures and run scheduled jobs."],
          checks: [
            { q: "Why put sending an email on a queue?", options: ["So the user gets a response without waiting for the email", "Emails can't be sent otherwise", "To make the email longer", "Queues are required by HTTP"], answer: 0, explain: "The worker sends it in the background." },
            { q: "What processes jobs from a queue?", options: ["A worker", "The browser", "CSS", "The DNS server"], answer: 0, explain: "Workers run separately from the web server." }
          ]
        },
        {
          title: "Real-time with WebSockets",
          minutes: 7,
          summary: "Push updates to players instantly — chats, live scores and multiplayer.",
          sections: [
            { h: "Beyond request–response", p: ["Normal HTTP is: the client asks, the server answers. For live features the server must <b>push</b> messages whenever something happens. A <b>WebSocket</b> keeps one connection open in both directions."],
              code: "const socket = new WebSocket(\"wss://game.example/live\");\n\nsocket.addEventListener(\"message\", (event) => {\n  const update = JSON.parse(event.data);\n  showScore(update.player, update.xp);\n});\n\nsocket.send(JSON.stringify({ type: \"hello\" }));", lang: "js" },
            { h: "Alternatives", p: ["<b>Server-Sent Events</b> push one-way updates over plain HTTP. <b>Polling</b> (asking every few seconds) is simplest but wastes requests. Services like Supabase Realtime handle the hard parts for you."] }
          ],
          points: ["WebSockets keep a two-way connection open.", "The server can push messages instantly.", "SSE and polling are simpler alternatives."],
          checks: [
            { q: "What makes WebSockets different from normal HTTP requests?", options: ["The connection stays open and both sides can send messages any time", "They only work offline", "They can't send JSON", "They are slower"], answer: 0, explain: "Two-way, long-lived connection." },
            { q: "Which feature needs real-time updates most?", options: ["A live multiplayer chat", "An About page", "A privacy policy", "A logo"], answer: 0, explain: "Chats and live scores need instant pushes." }
          ]
        },
        {
          title: "API design & documentation",
          minutes: 6,
          summary: "Make your API easy to use — and safe to change.",
          sections: [
            { h: "Versioning", p: ["Apps depend on your API. When you need a breaking change, release a new <b>version</b> (e.g. <code>/v2/players</code>) and keep the old one working for a while."] },
            { h: "Pagination and errors", p: ["Never return 100,000 rows at once — use <b>pagination</b>. Return errors in a consistent JSON shape with a helpful message."],
              code: "GET /v1/players?limit=20&page=3\n\n{ \"error\": { \"code\": \"not_found\", \"message\": \"Player 42 doesn't exist\" } }", lang: "text" },
            { h: "Documentation", p: ["Describe every endpoint, its inputs and outputs with <b>OpenAPI</b> (Swagger). Tools turn it into interactive docs where people can try requests."] }
          ],
          points: ["Version breaking changes (/v1, /v2).", "Paginate big lists; use consistent error JSON.", "Document endpoints with OpenAPI."],
          checks: [
            { q: "Why version an API?", options: ["So existing apps keep working when you make breaking changes", "To make URLs longer", "Because HTTP requires it", "To hide the API"], answer: 0, explain: "Old clients keep using /v1 while new ones move to /v2." },
            { q: "What is pagination?", options: ["Returning large lists in smaller pages", "Numbering HTML pages", "Encrypting data", "A database index"], answer: 0, explain: "?limit=20&page=3" }
          ]
        }
      ],
      exam: [
        { q: "What is a background worker for?", options: ["Doing slow jobs from a queue outside the request", "Rendering CSS", "Storing passwords in the browser", "Drawing the UI"], answer: 0, explain: "Users get fast responses while work happens later." },
        { q: "Which technology keeps a two-way connection open for live updates?", options: ["WebSockets", "FTP", "CSS Grid", "SQL JOIN"], answer: 0, explain: "Great for chats and live scores." },
        { q: "What does API pagination solve?", options: ["Sending huge lists all at once", "Typos in URLs", "Password hashing", "Image compression"], answer: 0, explain: "Return results page by page." }
      ]
    },
    devops: {
      lessons: [
        {
          title: "Reverse proxies & load balancers",
          minutes: 7,
          summary: "The traffic directors in front of your servers.",
          sections: [
            { h: "Reverse proxy", p: ["A <b>reverse proxy</b> like <b>Nginx</b> or Caddy sits in front of your app. It handles HTTPS certificates, compresses responses, serves static files and forwards the rest to your app."],
              code: "server {\n    listen 443 ssl;\n    server_name bitwood.example;\n\n    location / {\n        proxy_pass http://localhost:3000;\n    }\n}", lang: "text" },
            { h: "Load balancing and health checks", p: ["With several app servers, the proxy spreads requests between them and runs <b>health checks</b>: if a server stops answering, it gets no more traffic until it recovers."] }
          ],
          points: ["A reverse proxy handles HTTPS, compression and forwarding.", "Load balancers spread traffic over servers.", "Health checks remove broken servers automatically."],
          checks: [
            { q: "What does <code>proxy_pass http://localhost:3000</code> do in Nginx?", options: ["Forwards requests to the app on port 3000", "Deletes the app", "Opens a browser", "Starts a database"], answer: 0, explain: "Nginx passes the request on to your app." },
            { q: "What is a health check?", options: ["A regular test that a server still responds", "A doctor's visit", "A Git command", "A CSS rule"], answer: 0, explain: "Unhealthy servers are taken out of rotation." }
          ]
        },
        {
          title: "Configuration & secrets",
          minutes: 6,
          summary: "Same code, different settings: dev, staging and production.",
          sections: [
            { h: "The twelve-factor rule", p: ["Keep settings that change between environments — database URLs, feature flags, API keys — <b>out of the code</b> and in environment variables. The same build then runs everywhere."],
              code: "# staging\nDATABASE_URL=postgres://staging-db/...\nLOG_LEVEL=debug\n\n# production\nDATABASE_URL=postgres://prod-db/...\nLOG_LEVEL=warn", lang: "bash" },
            { h: "Secret managers", p: ["Store secrets in a <b>secret manager</b> (Vault, AWS Secrets Manager, GitHub Actions secrets) instead of files. Limit who can read them, <b>rotate</b> them regularly, and scan repos for leaked keys."] }
          ],
          points: ["Config lives in the environment, not the code.", "One build, many environments.", "Secrets go in a secret manager and get rotated."],
          checks: [
            { q: "Where should environment-specific settings live?", options: ["In environment variables / config, outside the code", "Hard-coded in the source", "In the README", "In CSS"], answer: 0, explain: "Then the same build works in every environment." },
            { q: "What does rotating a secret mean?", options: ["Replacing it with a new one regularly", "Writing it backwards", "Sharing it publicly", "Deleting the server"], answer: 0, explain: "A leaked old key stops working." }
          ]
        },
        {
          title: "Serverless & edge",
          minutes: 6,
          summary: "Run code without managing servers at all.",
          sections: [
            { h: "Serverless functions", p: ["With <b>serverless</b> (AWS Lambda, Vercel/Netlify Functions, Supabase Edge Functions) you upload a function; the platform runs it on demand and scales it automatically. You pay only when it runs."],
              code: "export default async function handler(req) {\n  return new Response(JSON.stringify({ hello: \"Bitwood\" }), {\n    headers: { \"Content-Type\": \"application/json\" }\n  });\n}", lang: "js" },
            { h: "Trade-offs", p: ["Great for spiky traffic and small APIs. Watch out for <b>cold starts</b> (a short delay after idle time), time limits, and costs at very high traffic. <b>Edge</b> functions run in data centres close to the user for extra speed."] }
          ],
          points: ["Serverless: deploy functions, the platform runs and scales them.", "Pay per use; no servers to patch.", "Mind cold starts, limits and costs."],
          checks: [
            { q: "What is a cold start?", options: ["A short delay when a serverless function runs after being idle", "A frozen laptop", "A database backup", "A CSS animation"], answer: 0, explain: "The platform needs a moment to start the function." },
            { q: "Who scales serverless functions?", options: ["The platform, automatically", "You, by buying servers", "The browser", "Nobody — they can't scale"], answer: 0, explain: "Scaling is handled for you." }
          ]
        }
      ],
      exam: [
        { q: "What is Nginx often used as?", options: ["A reverse proxy in front of apps", "A programming language", "A Git host", "A password manager"], answer: 0, explain: "It handles HTTPS and forwards traffic." },
        { q: "Why keep configuration in environment variables?", options: ["The same build can run in every environment", "It makes code longer", "Browsers require it", "It's faster to type"], answer: 0, explain: "Twelve-factor apps separate config from code." },
        { q: "What does serverless mean?", options: ["You deploy functions and the platform runs and scales them", "There are no computers at all", "Code runs only on phones", "Databases are not allowed"], answer: 0, explain: "Servers exist — you just don't manage them." }
      ]
    },
    git: {
      lessons: [
        {
          title: "Stash & cherry-pick",
          minutes: 6,
          summary: "Park unfinished work, and copy single commits between branches.",
          sections: [
            { h: "git stash", p: ["Need to switch branches but you're in the middle of something? <code>git stash</code> puts your uncommitted changes aside; <code>git stash pop</code> brings them back."],
              code: "git stash            # park changes\ngit switch main      # fix something urgent\ngit switch feature\ngit stash pop        # continue where you left off", lang: "bash" },
            { h: "git cherry-pick", p: ["<code>git cherry-pick &lt;hash&gt;</code> copies one specific commit onto your current branch — handy for bringing a bug fix into a release branch."],
              code: "git log --oneline main\n# 7c1d2e3 Fix login crash\ngit switch release/1.4\ngit cherry-pick 7c1d2e3", lang: "bash" }
          ],
          points: ["<code>git stash</code> / <code>git stash pop</code> park and restore work.", "<code>git cherry-pick</code> copies one commit.", "Both help when plans change mid-task."],
          checks: [
            { q: "What does <code>git stash</code> do?", options: ["Temporarily puts uncommitted changes aside", "Deletes the repository", "Pushes to GitHub", "Creates a tag"], answer: 0, explain: "Bring them back with <code>git stash pop</code>." },
            { q: "How do you copy one commit onto your current branch?", options: ["git cherry-pick <hash>", "git copy <hash>", "git merge --one", "git clone <hash>"], answer: 0, explain: "Cherry-pick applies that single commit." }
          ]
        },
        {
          title: "Clean history with rebase",
          minutes: 7,
          summary: "Squash, reword and reorder your own commits before sharing them.",
          sections: [
            { h: "Interactive rebase", p: ["<code>git rebase -i</code> lets you tidy your <b>own, unshared</b> commits: <b>squash</b> \"fix typo\" commits into the real change, <b>reword</b> messages, or drop experiments."],
              code: "git rebase -i HEAD~3\n\npick 1a2b3c Add leaderboard page\nsquash 4d5e6f fix typo\nreword 7a8b9c add sorting", lang: "text" },
            { h: "The golden rule", p: ["Never rewrite history that others already pulled — it breaks their copies. Rebase your local branch; once it's shared, add new commits instead. Many teams simply use <b>\"Squash and merge\"</b> on GitHub PRs."] }
          ],
          points: ["Interactive rebase: squash, reword, drop, reorder.", "Only rewrite commits nobody else has.", "\"Squash and merge\" keeps main tidy."],
          checks: [
            { q: "What does \"squash\" do in an interactive rebase?", options: ["Combines a commit into the previous one", "Deletes the branch", "Pushes to GitHub", "Creates a merge conflict on purpose"], answer: 0, explain: "Small fix-up commits disappear into the real change." },
            { q: "Which commits is it safe to rewrite?", options: ["Your own commits that nobody else has pulled", "Any commit on main", "Commits from other people", "Tagged releases"], answer: 0, explain: "Rewriting shared history breaks other people's copies." }
          ]
        },
        {
          title: "Hooks & automation",
          minutes: 6,
          summary: "Let Git and GitHub check things automatically.",
          sections: [
            { h: "Git hooks", p: ["<b>Hooks</b> are scripts Git runs at certain moments — for example a <code>pre-commit</code> hook can run the formatter and linter, and stop the commit if something is wrong. Tools like Husky or pre-commit make them easy to share."],
              code: "#!/bin/sh\n# .git/hooks/pre-commit\nnpm run lint || exit 1", lang: "bash" },
            { h: "Protecting main", p: ["On GitHub, <b>branch protection rules</b> can require pull requests, passing CI checks and at least one review before anything is merged into <code>main</code>. <b>CODEOWNERS</b> automatically asks the right people to review."] }
          ],
          points: ["Hooks run scripts at Git events like pre-commit.", "Branch protection requires PRs, reviews and green CI.", "CODEOWNERS picks reviewers automatically."],
          checks: [
            { q: "When does a <code>pre-commit</code> hook run?", options: ["Right before a commit is created", "After a push", "Once a year", "Only on GitHub"], answer: 0, explain: "It can stop the commit if checks fail." },
            { q: "What can a branch protection rule require?", options: ["Passing CI checks and a review before merging", "A longer README", "A new logo", "Deleting old branches daily"], answer: 0, explain: "It keeps main safe." }
          ]
        }
      ],
      exam: [
        { q: "Which command parks uncommitted changes so you can switch branches?", options: ["git stash", "git park", "git save --later", "git tag"], answer: 0, explain: "Restore them with <code>git stash pop</code>." },
        { q: "What does interactive rebase let you do?", options: ["Squash, reword and reorder your own commits", "Host a website", "Merge two repositories", "Encrypt files"], answer: 0, explain: "Tidy history before sharing it." },
        { q: "What is a Git hook?", options: ["A script Git runs automatically at certain events", "A type of branch", "A GitHub account", "A merge conflict"], answer: 0, explain: "Like pre-commit." }
      ]
    },
    python: {
      lessons: [
        {
          title: "Classes & objects",
          minutes: 8,
          summary: "Bundle data and behaviour together with classes.",
          sections: [
            { h: "Making a class", p: ["A <b>class</b> is a blueprint; each <b>object</b> made from it has its own data. <code>__init__</code> runs when an object is created, and <code>self</code> is the object itself."],
              code: "class Hero:\n    def __init__(self, name, hp=10):\n        self.name = name\n        self.hp = hp\n\n    def heal(self, amount):\n        self.hp += amount\n        return self.hp\n\nada = Hero(\"Ada\")\nprint(ada.heal(5))   # 15", lang: "python" },
            { h: "Inheritance", p: ["A class can <b>inherit</b> from another and add or change behaviour."],
              code: "class Wizard(Hero):\n    def cast(self):\n        return f\"{self.name} casts a spell!\"\n\nprint(Wizard(\"Lin\").cast())", lang: "python" }
          ],
          points: ["A class is a blueprint; objects are instances.", "<code>__init__</code> sets up each object; <code>self</code> refers to it.", "Subclasses inherit and extend behaviour."],
          checks: [
            { q: "What does <code>__init__</code> do?", options: ["Sets up a new object when it's created", "Deletes an object", "Imports a module", "Prints the class"], answer: 0, explain: "It's the constructor." },
            { q: "In a method, what is <code>self</code>?", options: ["The object the method was called on", "The class's file name", "A keyword for loops", "A global variable"], answer: 0, explain: "<code>self.hp</code> is this object's hp." }
          ]
        },
        {
          title: "APIs & JSON in Python",
          minutes: 7,
          summary: "Fetch live data from the internet and work with JSON.",
          sections: [
            { h: "requests", p: ["The <code>requests</code> package makes HTTP easy. <code>.json()</code> turns the response into Python lists and dictionaries."],
              code: "import requests\n\nres = requests.get(\"https://api.example.com/players\", timeout=10)\nres.raise_for_status()          # error if not 2xx\nplayers = res.json()\nprint(players[0][\"name\"])", lang: "python" },
            { h: "The json module", p: ["<code>json.dumps</code> turns Python data into a JSON string; <code>json.loads</code> does the opposite. Use them to save and load files too."],
              code: "import json\n\nsave = {\"xp\": 120, \"level\": 3}\ntext = json.dumps(save)\nprint(json.loads(text)[\"xp\"])   # 120", lang: "python" }
          ],
          points: ["<code>requests.get(url).json()</code> fetches and parses data.", "Use a timeout and check the status.", "<code>json.dumps</code>/<code>json.loads</code> convert data and text."],
          checks: [
            { q: "What does <code>res.json()</code> return?", options: ["Python lists/dictionaries parsed from the JSON", "The raw HTML", "The status code only", "A new request"], answer: 0, explain: "It parses the response body." },
            { q: "What does <code>json.dumps(data)</code> do?", options: ["Turns Python data into a JSON string", "Deletes JSON files", "Downloads data", "Sorts a list"], answer: 0, explain: "dumps = dump to string." }
          ]
        },
        {
          title: "Testing with pytest",
          minutes: 6,
          summary: "Prove your code works — and keeps working.",
          sections: [
            { h: "Your first test", p: ["Write functions whose names start with <code>test_</code> and use plain <code>assert</code>. Run <code>pytest</code> and it finds and runs them all."],
              code: "# game.py\ndef level_for(xp):\n    return xp // 100 + 1\n\n# test_game.py\nfrom game import level_for\n\ndef test_new_player_is_level_1():\n    assert level_for(0) == 1\n\ndef test_250_xp_is_level_3():\n    assert level_for(250) == 3", lang: "python" },
            { h: "Why test?", p: ["Tests catch mistakes before users do and let you change code without fear. Test normal cases, edge cases (0, empty lists) and errors."],
              code: "pip install pytest\npytest            # 2 passed", lang: "bash" }
          ],
          points: ["Test functions start with <code>test_</code> and use <code>assert</code>.", "<code>pytest</code> finds and runs them.", "Cover normal and edge cases."],
          checks: [
            { q: "How does pytest find tests?", options: ["Functions whose names start with test_", "Any function at all", "Only files named main.py", "It needs a website"], answer: 0, explain: "Naming convention: test_something." },
            { q: "What does <code>assert level_for(0) == 1</code> do in a test?", options: ["Fails the test if the result isn't 1", "Prints 1", "Changes the function", "Nothing"], answer: 0, explain: "A failing assert fails the test." }
          ]
        }
      ],
      exam: [
        { q: "What is a class in Python?", options: ["A blueprint for creating objects", "A type of loop", "A file format", "A web server"], answer: 0, explain: "Objects are instances of a class." },
        { q: "Which package is commonly used for HTTP requests in Python?", options: ["requests", "pygame", "numpy", "turtle"], answer: 0, explain: "<code>requests.get(url)</code>." },
        { q: "How do pytest test functions start?", options: ["test_", "check_", "run_", "it_"], answer: 0, explain: "pytest discovers <code>test_*</code> functions." }
      ]
    },
    react: {
      lessons: [
        {
          title: "Routing & pages",
          minutes: 7,
          summary: "Multiple pages in one React app with React Router.",
          sections: [
            { h: "Single-page apps", p: ["A React app is usually one HTML page. A <b>router</b> shows different components for different URLs without reloading the page."],
              code: "import { BrowserRouter, Routes, Route, Link } from \"react-router-dom\";\n\n<BrowserRouter>\n  <nav>\n    <Link to=\"/\">Home</Link> <Link to=\"/map\">Map</Link>\n  </nav>\n  <Routes>\n    <Route path=\"/\" element={<Home />} />\n    <Route path=\"/map\" element={<WorldMap />} />\n    <Route path=\"/level/:id\" element={<Level />} />\n  </Routes>\n</BrowserRouter>", lang: "js" },
            { h: "URL parameters", p: ["<code>:id</code> in a path is a parameter. Read it with <code>useParams()</code>."],
              code: "function Level() {\n  const { id } = useParams();\n  return <h1>Level {id}</h1>;\n}", lang: "js" }
          ],
          points: ["A router maps URLs to components.", "<code>&lt;Link&gt;</code> navigates without reloading.", "<code>useParams()</code> reads values like <code>:id</code>."],
          checks: [
            { q: "Why use <code>&lt;Link&gt;</code> instead of <code>&lt;a&gt;</code> in React Router?", options: ["It changes pages without reloading the whole app", "It's prettier", "Links can't be clicked otherwise", "It works only offline"], answer: 0, explain: "The app stays loaded; only the view changes." },
            { q: "How do you read <code>:id</code> from <code>/level/:id</code>?", options: ["useParams()", "useState()", "document.id", "props.url.id()"], answer: 0, explain: "<code>const { id } = useParams();</code>" }
          ]
        },
        {
          title: "Styling React apps",
          minutes: 6,
          summary: "className, CSS modules, inline styles and utility classes.",
          sections: [
            { h: "Options", p: ["Use normal CSS with <code>className</code>, <b>CSS Modules</b> (styles scoped to one component), <b>inline styles</b> (objects with camelCase properties) or utility libraries like <b>Tailwind CSS</b>."],
              code: "import styles from \"./Card.module.css\";\n\nfunction Card({ done }) {\n  return (\n    <div\n      className={done ? styles.cardDone : styles.card}\n      style={{ borderWidth: 3 }}\n    >\n      Level card\n    </div>\n  );\n}", lang: "js" },
            { h: "Tips", p: ["Toggle classes based on state instead of changing styles by hand, keep a consistent set of colors and spacing (design tokens), and make components responsive."] }
          ],
          points: ["<code>className</code> for CSS classes.", "CSS Modules scope styles to a component.", "Inline styles are objects with camelCase keys."],
          checks: [
            { q: "How are inline styles written in React?", options: ["As an object: style={{ borderWidth: 3 }}", "As a string: style=\"border-width: 3px\"", "Only in CSS files", "With the <style> tag inside JSX"], answer: 0, explain: "camelCase keys in an object." },
            { q: "What do CSS Modules do?", options: ["Scope styles to one component so names don't clash", "Make CSS run on the server", "Replace JavaScript", "Compress images"], answer: 0, explain: "Class names become unique per component." }
          ]
        },
        {
          title: "Loading & error states",
          minutes: 7,
          summary: "Handle slow and failing data like a pro.",
          sections: [
            { h: "Three states", p: ["Data from the network is <b>loading</b>, <b>ready</b> or <b>failed</b>. Show something useful in each state."],
              code: "function Leaderboard() {\n  const [players, setPlayers] = useState(null);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetch(\"/api/players\")\n      .then(r => { if (!r.ok) throw new Error(\"HTTP \" + r.status); return r.json(); })\n      .then(setPlayers)\n      .catch(setError);\n  }, []);\n\n  if (error) return <p>Couldn't load the board.</p>;\n  if (!players) return <p>Loading…</p>;\n  return <ol>{players.map(p => <li key={p.id}>{p.name}</li>)}</ol>;\n}", lang: "js" },
            { h: "Data libraries", p: ["Libraries like <b>TanStack Query</b> handle loading, errors, caching and refetching for you: <code>const { data, isLoading, error } = useQuery(...)</code>."] }
          ],
          points: ["Always handle loading, success and error.", "Check <code>response.ok</code> before using data.", "TanStack Query manages fetching and caching."],
          checks: [
            { q: "What should a component show while data is still loading?", options: ["A loading indicator", "Nothing ever", "An error message", "The raw JSON"], answer: 0, explain: "Tell users something is happening." },
            { q: "Why check <code>r.ok</code> after fetch?", options: ["fetch doesn't throw on 404/500, so you must check the status", "To make it faster", "It's required by JSX", "To parse CSS"], answer: 0, explain: "HTTP errors still resolve the promise." }
          ]
        }
      ],
      exam: [
        { q: "What does a router do in a React app?", options: ["Shows different components for different URLs", "Connects to Wi-Fi", "Stores state on the server", "Compiles JSX"], answer: 0, explain: "React Router maps paths to components." },
        { q: "Which is a valid inline style in React?", options: ["style={{ color: \"red\" }}", "style=\"color: red\"", "style={color: red}", "css=\"red\""], answer: 0, explain: "An object with camelCase keys." },
        { q: "Which three states should a data-fetching component handle?", options: ["Loading, success and error", "Red, green and blue", "Mount, click and unmount only", "Props, keys and refs"], answer: 0, explain: "Never leave users guessing." }
      ]
    },
    security: {
      lessons: [
        {
          title: "Secure coding habits",
          minutes: 7,
          summary: "Small habits that prevent most security bugs.",
          sections: [
            { h: "Habits", p: ["Validate input on the server, use parameterized queries, escape output, keep secrets out of code, give services the least privilege they need, and keep dependencies updated (tools like Dependabot help)."] },
            { h: "Don't roll your own crypto", p: ["Never invent your own encryption or password hashing — use well-tested libraries (bcrypt/argon2, TLS, libsodium). Clever home-made crypto is almost always broken."] },
            { h: "Code review for security", p: ["In reviews, ask: Where does this input come from? Who can call this? What happens if this fails? Is anything secret logged?"] }
          ],
          points: ["Validate input, escape output, parameterize queries.", "Use proven crypto libraries, never your own.", "Update dependencies and review code with security questions."],
          checks: [
            { q: "Should you write your own encryption algorithm for an app?", options: ["No — use well-tested libraries", "Yes, it's safer", "Only on Fridays", "Only for passwords"], answer: 0, explain: "Home-made crypto is almost always breakable." },
            { q: "Why keep dependencies updated?", options: ["Updates fix known vulnerabilities", "To make the app bigger", "Old versions are faster", "It isn't important"], answer: 0, explain: "Attackers target known holes in old versions." }
          ]
        },
        {
          title: "Staying safe online",
          minutes: 6,
          summary: "Social media, scams and gaming accounts.",
          sections: [
            { h: "Social media", p: ["Make accounts private, think before sharing your location, school or plans, and remember screenshots last forever. Not everyone online is who they say they are."] },
            { h: "Game and gift-card scams", p: ["\"Free skins\", \"double your coins\" or \"verify your account\" links are classic scams. Never trade accounts, and never pay with gift cards to someone you don't know. Real support never asks for your password."] },
            { h: "Ask for help", p: ["If something online makes you uncomfortable or you think you were scammed, tell a trusted adult or the platform right away — it's never your fault for asking."] }
          ],
          points: ["Keep accounts private; share less.", "\"Free items\" and gift-card requests are scams.", "Ask a trusted adult or the platform for help."],
          checks: [
            { q: "A message offers free game skins if you log in through its link. What is it?", options: ["Probably a scam", "A great deal", "An official update", "A system message"], answer: 0, explain: "Fake login pages steal accounts." },
            { q: "Someone online asks you to pay with gift cards. What should you do?", options: ["Refuse and tell a trusted adult", "Pay quickly", "Send a photo of the card", "Share your password instead"], answer: 0, explain: "Gift-card payment requests are a classic scam." }
          ]
        },
        {
          title: "Careers & CTFs",
          minutes: 5,
          summary: "Practise hacking legally and explore security jobs.",
          sections: [
            { h: "Capture the Flag (CTF)", p: ["<b>CTF</b> competitions are legal hacking games: you solve puzzles in web security, cryptography and forensics to find hidden \"flags\". Beginner-friendly platforms include picoCTF, OverTheWire and TryHackMe."] },
            { h: "Bug bounties", p: ["Companies run <b>bug bounty</b> programs that reward people for responsibly reporting vulnerabilities — always within the program's rules and scope."] },
            { h: "Security jobs", p: ["Security analysts, penetration testers, security engineers, incident responders and researchers protect people every day. Curiosity, networking, Linux and programming skills are a great start."] }
          ],
          points: ["CTFs are legal practice: find the flags.", "Bug bounties reward responsible disclosure.", "Many security careers need curiosity + coding + Linux."],
          checks: [
            { q: "What is a CTF?", options: ["A legal security competition where you find hidden flags", "A type of firewall", "A password manager", "An illegal attack"], answer: 0, explain: "Capture the Flag = practice with permission." },
            { q: "What is a bug bounty program?", options: ["A company rewarding responsibly reported vulnerabilities", "A game about insects", "A virus", "A database table"], answer: 0, explain: "Always follow the program's rules." }
          ]
        }
      ],
      exam: [
        { q: "Which is a secure coding habit?", options: ["Using parameterized queries", "Storing passwords in plain text", "Showing user input as HTML", "Hard-coding API keys"], answer: 0, explain: "It prevents SQL injection." },
        { q: "\"Log in here to get free coins!\" is most likely…", options: ["A phishing scam", "An official reward", "A security update", "A bug bounty"], answer: 0, explain: "Too good to be true = scam." },
        { q: "What is a CTF competition?", options: ["Legal security puzzles where you find flags", "A way to steal accounts", "A browser extension", "A programming language"], answer: 0, explain: "Great, legal practice." }
      ]
    },
    ai: {
      lessons: [
        {
          title: "Computer vision",
          minutes: 6,
          summary: "How computers learn to see.",
          sections: [
            { h: "Images are numbers", p: ["To a computer an image is a grid of pixels, each with red, green and blue numbers. <b>Computer vision</b> models — often <b>convolutional neural networks</b> — learn patterns in those numbers: edges, then shapes, then whole objects."] },
            { h: "What it can do", p: ["<b>Classification</b> (\"this is a cat\"), <b>object detection</b> (boxes around every car), <b>segmentation</b> (which pixels are the road) and reading text (OCR). It powers face unlock, photo search and self-driving research."] },
            { h: "Limits", p: ["Vision models can be fooled by unusual lighting or tiny changes, and can work worse for groups that were missing from the training data."] }
          ],
          points: ["Images are grids of numbers.", "CNNs learn edges → shapes → objects.", "Classification, detection, segmentation, OCR."],
          checks: [
            { q: "To a computer, what is an image?", options: ["A grid of pixel numbers", "A sound file", "A sentence", "A database table"], answer: 0, explain: "Each pixel has color values." },
            { q: "Drawing boxes around every car in a photo is…", options: ["Object detection", "Regression", "Encryption", "Compression"], answer: 0, explain: "Detection finds and locates objects." }
          ]
        },
        {
          title: "AI agents & tools",
          minutes: 6,
          summary: "When language models can take actions, not just talk.",
          sections: [
            { h: "From chat to agents", p: ["An <b>AI agent</b> is a language model that can use <b>tools</b> — search the web, run code, read files, call APIs — in a loop: think → act → look at the result → continue, until the task is done. Coding assistants work this way."] },
            { h: "Keeping agents safe", p: ["Give agents only the permissions they need, ask for confirmation before risky actions (deleting files, spending money, sending messages), log what they do, and keep a human in charge of important decisions."] }
          ],
          points: ["Agents = models + tools + a loop.", "Think → act → observe → repeat.", "Least privilege, confirmations and human oversight."],
          checks: [
            { q: "What makes an AI agent different from a simple chatbot?", options: ["It can use tools and take actions in a loop", "It only answers in emojis", "It never uses a model", "It can't read text"], answer: 0, explain: "Tools + loop = agent." },
            { q: "Before an agent deletes files, what is a good safety step?", options: ["Ask a human to confirm", "Do it silently", "Delete everything first", "Turn off logging"], answer: 0, explain: "Risky actions need a human OK." }
          ]
        },
        {
          title: "Build a tiny classifier",
          minutes: 8,
          summary: "Write a real (tiny) machine learning model in Python: k-nearest neighbours.",
          sections: [
            { h: "The idea", p: ["<b>k-nearest neighbours</b> classifies a new example by looking at the <i>k</i> most similar examples it has seen and taking a vote. No training step — just remembering and comparing."] },
            { h: "The code", p: ["Here we guess whether a player is a \"speedrunner\" or an \"explorer\" from hours played and levels cleared."],
              code: "def distance(a, b):\n    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5\n\ndata = [((2, 9), \"speedrunner\"), ((3, 10), \"speedrunner\"),\n        ((20, 6), \"explorer\"),   ((25, 8), \"explorer\")]\n\ndef classify(point, k=3):\n    nearest = sorted(data, key=lambda d: distance(point, d[0]))[:k]\n    labels = [label for _, label in nearest]\n    return max(set(labels), key=labels.count)\n\nprint(classify((4, 9)))    # speedrunner", lang: "python" },
            { h: "What you learned", p: ["You just built features (hours, levels), labels, a distance measure and a prediction — the same building blocks as big AI systems, only smaller."] }
          ],
          points: ["kNN votes among the k most similar examples.", "Features + labels + a distance = a classifier.", "Big models use the same ideas at a much larger scale."],
          checks: [
            { q: "How does k-nearest neighbours classify a new example?", options: ["By a vote among the k most similar known examples", "By flipping a coin", "By asking the user", "By sorting alphabetically"], answer: 0, explain: "Nearest neighbours vote." },
            { q: "In the example, what are (hours, levels)?", options: ["Features", "Labels", "Passwords", "Tokens"], answer: 0, explain: "Features describe each example; labels are the answers." }
          ]
        }
      ],
      exam: [
        { q: "What is computer vision?", options: ["AI that understands images and video", "A screen setting", "A type of monitor", "A CSS feature"], answer: 0, explain: "Teaching computers to see." },
        { q: "What does an AI agent add to a language model?", options: ["Tools it can use and a loop to act step by step", "More colors", "A bigger screen", "Nothing"], answer: 0, explain: "Think → act → observe." },
        { q: "How does k-nearest neighbours decide?", options: ["Majority vote of the most similar examples", "The newest example always wins", "Random guess", "The longest label wins"], answer: 0, explain: "Simple but real machine learning." }
      ]
    }
  };

  (window.BITWOOD_COURSES || []).forEach(c => {
    const ex = EXTRA[c.id];
    if (!ex) return;
    c.lessons.push(...ex.lessons);
    c.exam.push(...ex.exam);
  });
})();

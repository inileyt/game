/* Course: Backend development — 10 lessons + 20-question final exam. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "backend",
  name: "Backend",
  title: "Backend Development",
  color: "#4ade80",
  icon: "potion",
  theme: "caves",
  blurb: "Power the hidden engine: servers, APIs, databases, login and security.",
  topics: "HTTP, REST APIs, servers, databases, SQL, authentication, security, testing and scaling",
  lessons: [
    {
      title: "What is a backend?",
      minutes: 6,
      summary: "The part of an app you don't see — but that keeps everything running.",
      sections: [
        { h: "Frontend vs backend", p: ["The <b>frontend</b> runs in the user's browser. The <b>backend</b> runs on servers you control. It stores data, checks passwords, talks to other services and decides what each user is allowed to see.", "When you clear a level in Bitwood and your XP shows up on the leaderboard, that's the backend at work."] },
        { h: "The request–response cycle", p: ["1. The frontend sends a <b>request</b> (\"give me the top players\"). 2. The backend runs code, maybe asks a <b>database</b>. 3. It sends back a <b>response</b> (usually JSON)."],
          code: "Browser ──request──▶ Server ──query──▶ Database\nBrowser ◀─response── Server ◀─rows──── Database", lang: "text" },
        { h: "Backend languages", p: ["Backends are written in many languages: <b>JavaScript (Node.js)</b>, <b>Python</b>, <b>Go</b>, <b>PHP</b>, <b>Java</b>, <b>C#</b>, <b>Ruby</b>… The ideas in this course work in all of them."] }
      ],
      points: ["The backend runs on servers, not in the browser.", "It stores data and enforces the rules.", "Frontend asks, backend answers (request → response)."],
      checks: [
        { q: "Which of these is a typical backend job?", options: ["Changing a button's color", "Checking a user's password", "Animating a sprite", "Choosing a font"], answer: 1, explain: "Security checks must happen on the server." },
        { q: "What usually sits behind the backend to store data permanently?", options: ["A stylesheet", "A database", "The DOM", "A browser tab"], answer: 1, explain: "Databases keep data safe even when the server restarts." }
      ]
    },
    {
      title: "HTTP basics",
      minutes: 8,
      summary: "Methods, status codes and headers — the language of the web.",
      sections: [
        { h: "Methods", p: ["Every HTTP request has a <b>method</b> that says what you want: <code>GET</code> reads data, <code>POST</code> creates something, <code>PUT</code>/<code>PATCH</code> update it, and <code>DELETE</code> removes it."],
          code: "GET    /players          → list players\nPOST   /players          → create a player\nPATCH  /players/42       → update player 42\nDELETE /players/42       → delete player 42", lang: "text" },
        { h: "Status codes", p: ["The response starts with a <b>status code</b>: <code>2xx</code> = success (200 OK, 201 Created), <code>3xx</code> = redirect, <code>4xx</code> = the client made a mistake (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found), <code>5xx</code> = the server broke (500)."] },
        { h: "Headers and body", p: ["<b>Headers</b> carry extra info like the content type or a login token. The <b>body</b> carries the actual data."],
          code: "POST /players HTTP/1.1\nContent-Type: application/json\nAuthorization: Bearer abc123\n\n{ \"name\": \"Ada\" }", lang: "text" }
      ],
      points: ["GET reads, POST creates, PATCH/PUT update, DELETE removes.", "2xx ok · 4xx client error · 5xx server error.", "Headers = metadata, body = data."],
      checks: [
        { q: "Which status code means \"Not Found\"?", options: ["200", "301", "404", "500"], answer: 2, explain: "404 — the resource doesn't exist." },
        { q: "Which method is normally used to <b>create</b> something new?", options: ["GET", "POST", "DELETE", "HEAD"], answer: 1, explain: "POST sends new data to be created." }
      ]
    },
    {
      title: "APIs & REST",
      minutes: 7,
      summary: "Design clean URLs that other programs can talk to.",
      sections: [
        { h: "What is an API?", p: ["An <b>API</b> (Application Programming Interface) is a set of URLs a program can call to read or change data. Your frontend, a phone app, or another server can all use the same API."] },
        { h: "REST style", p: ["<b>REST</b> organises an API around <b>resources</b> (nouns) and uses HTTP methods as the verbs. Use plural nouns, and ids in the path."],
          code: "GET    /levels           all levels\nGET    /levels/3         one level\nPOST   /levels/3/scores  add a score to level 3\nGET    /players?sort=xp  query parameters filter or sort", lang: "text" },
        { h: "JSON responses", p: ["REST APIs usually answer with JSON and the right status code. Keep the shape predictable so clients know what to expect."],
          code: "{\n  \"id\": 3,\n  \"name\": \"Condition Caves\",\n  \"xp\": 200\n}", lang: "json" }
      ],
      points: ["An API is a contract other programs can call.", "REST = resources (nouns) + HTTP methods (verbs).", "Answer with JSON and correct status codes."],
      checks: [
        { q: "Which URL is the most RESTful way to get player 7?", options: ["/getPlayer?id=7", "/players/7", "/player-get/7/now", "/api.php?action=player7"], answer: 1, explain: "Resource name + id: <code>/players/7</code>." },
        { q: "In REST, what plays the role of the \"verb\"?", options: ["The URL path", "The HTTP method", "The JSON body", "The port number"], answer: 1, explain: "GET/POST/PATCH/DELETE are the verbs." }
      ]
    },
    {
      title: "Building a server",
      minutes: 9,
      summary: "Write a tiny API with Node.js and Express.",
      sections: [
        { h: "Routes", p: ["A server listens on a <b>port</b> and maps routes (method + path) to handler functions. Here is a complete mini API with <b>Express</b>, a popular Node.js framework."],
          code: "const express = require(\"express\");\nconst app = express();\napp.use(express.json());\n\nconst players = [{ id: 1, name: \"Ada\", xp: 120 }];\n\napp.get(\"/players\", (req, res) => {\n  res.json(players);\n});\n\napp.post(\"/players\", (req, res) => {\n  const player = { id: players.length + 1, name: req.body.name, xp: 0 };\n  players.push(player);\n  res.status(201).json(player);\n});\n\napp.listen(3000, () => console.log(\"Server on port 3000\"));", lang: "js" },
        { h: "Request and response objects", p: ["<code>req</code> holds what the client sent: <code>req.params</code> (path parts like <code>/players/:id</code>), <code>req.query</code> (<code>?sort=xp</code>) and <code>req.body</code> (JSON data). <code>res</code> sends the answer: <code>res.json()</code>, <code>res.status()</code>."] },
        { h: "Middleware", p: ["<b>Middleware</b> is code that runs before your routes — for parsing JSON, logging, or checking that a user is logged in. <code>app.use(express.json())</code> above is middleware."] }
      ],
      points: ["A route = method + path + handler.", "<code>req</code> = input (params, query, body); <code>res</code> = output.", "Middleware runs before routes for shared jobs."],
      checks: [
        { q: "In <code>app.get(\"/players/:id\", …)</code>, where is the id?", options: ["req.body.id", "req.params.id", "res.id", "req.query.path"], answer: 1, explain: "Path parts like <code>:id</code> are in <code>req.params</code>." },
        { q: "Which status should a successful POST that created something return?", options: ["200", "201", "404", "500"], answer: 1, explain: "201 Created." }
      ]
    },
    {
      title: "Databases",
      minutes: 7,
      summary: "Where data lives: tables, rows, keys — SQL vs NoSQL.",
      sections: [
        { h: "Why a database?", p: ["Variables in a server disappear when it restarts. A <b>database</b> stores data on disk, lets many users read and write at once, and finds things fast."] },
        { h: "Relational (SQL) databases", p: ["<b>PostgreSQL</b>, <b>MySQL</b> and <b>SQLite</b> store data in <b>tables</b> with <b>rows</b> and <b>columns</b>. Each row has a unique <b>primary key</b>, and <b>foreign keys</b> link tables together."],
          code: "players                      scores\n┌────┬───────┬──────┐       ┌────┬───────────┬───────┐\n│ id │ name  │ xp   │       │ id │ player_id │ level │\n├────┼───────┼──────┤       ├────┼───────────┼───────┤\n│ 1  │ Ada   │ 1200 │◀──────│ 7  │ 1         │ 3     │\n└────┴───────┴──────┘       └────┴───────────┴───────┘", lang: "text" },
        { h: "NoSQL databases", p: ["<b>NoSQL</b> databases like <b>MongoDB</b> or <b>Redis</b> store documents or key-value pairs instead of strict tables. They are flexible and fast for some jobs. Many apps start with a SQL database — it fits most data well."] }
      ],
      points: ["Databases keep data permanently and safely.", "SQL databases use tables, rows, primary and foreign keys.", "NoSQL stores documents or key-value pairs."],
      checks: [
        { q: "What makes each row in a table unique?", options: ["A foreign key", "A primary key", "A column name", "An index page"], answer: 1, explain: "The primary key (often <code>id</code>) is unique per row." },
        { q: "Which one is a relational (SQL) database?", options: ["PostgreSQL", "Redis", "CSS", "JSON"], answer: 0, explain: "PostgreSQL is a powerful SQL database (Supabase uses it!)." }
      ]
    },
    {
      title: "SQL basics",
      minutes: 9,
      summary: "Ask the database questions with SELECT, INSERT, UPDATE and JOIN.",
      sections: [
        { h: "Reading data", p: ["<code>SELECT</code> picks columns, <code>FROM</code> picks the table, <code>WHERE</code> filters rows and <code>ORDER BY</code> sorts."],
          code: "SELECT name, xp\nFROM players\nWHERE xp > 500\nORDER BY xp DESC\nLIMIT 10;", lang: "sql" },
        { h: "Changing data", p: ["<code>INSERT</code> adds rows, <code>UPDATE</code> changes them and <code>DELETE</code> removes them. Always use <code>WHERE</code> with UPDATE and DELETE — otherwise you change <i>every</i> row!"],
          code: "INSERT INTO players (name, xp) VALUES ('Lin', 0);\nUPDATE players SET xp = xp + 100 WHERE id = 2;\nDELETE FROM players WHERE id = 9;", lang: "sql" },
        { h: "Joining tables", p: ["<code>JOIN</code> combines rows from two tables using their keys."],
          code: "SELECT players.name, scores.level\nFROM scores\nJOIN players ON players.id = scores.player_id;", lang: "sql" }
      ],
      points: ["SELECT … FROM … WHERE … ORDER BY.", "INSERT adds, UPDATE changes, DELETE removes — use WHERE!", "JOIN connects tables through keys."],
      checks: [
        { q: "Which keyword filters rows?", options: ["ORDER BY", "WHERE", "FROM", "LIMIT"], answer: 1, explain: "<code>WHERE xp &gt; 500</code> keeps only matching rows." },
        { q: "What happens with <code>DELETE FROM players;</code> (no WHERE)?", options: ["Nothing", "Deletes only the first row", "Deletes every row", "Deletes the database server"], answer: 2, explain: "Without WHERE, every row is deleted — be careful!" }
      ]
    },
    {
      title: "Authentication",
      minutes: 8,
      summary: "Sign-up, login, password hashing, sessions and tokens.",
      sections: [
        { h: "Authentication vs authorization", p: ["<b>Authentication</b> = who are you? (logging in). <b>Authorization</b> = what are you allowed to do? (only you can edit your profile)."] },
        { h: "Never store plain passwords", p: ["Store a <b>hash</b> of the password made with a slow algorithm like <b>bcrypt</b> or <b>argon2</b>. A hash can't be turned back into the password; at login you hash the attempt and compare."],
          code: "const hash = await bcrypt.hash(password, 12);   // at sign-up\nconst ok = await bcrypt.compare(attempt, hash);  // at login", lang: "js" },
        { h: "Sessions and tokens", p: ["After login the server must remember you. A <b>session</b> stores your id on the server and gives the browser a cookie. A <b>token</b> (like a <b>JWT</b>) is a signed piece of data the client sends in the <code>Authorization</code> header. Bitwood's accounts use tokens from Supabase Auth."] }
      ],
      points: ["Authentication = who; authorization = what you may do.", "Hash passwords with bcrypt/argon2 — never store them plain.", "Sessions (cookies) or tokens (JWT) keep users logged in."],
      checks: [
        { q: "How should passwords be stored?", options: ["As plain text", "Encrypted with a key in the code", "As a slow hash (bcrypt/argon2)", "In the browser's localStorage"], answer: 2, explain: "A slow, salted hash can't be reversed." },
        { q: "\"Can this user delete that post?\" is a question of…", options: ["Authentication", "Authorization", "Compression", "Rendering"], answer: 1, explain: "Authorization decides permissions." }
      ]
    },
    {
      title: "Security basics",
      minutes: 8,
      summary: "HTTPS, validating input, SQL injection and keeping secrets secret.",
      sections: [
        { h: "Validate everything", p: ["Treat every input as untrusted. Check types, lengths and allowed values on the server."] },
        { h: "SQL injection", p: ["Never glue user input into SQL strings. An attacker could type SQL code and change your query. Use <b>parameterized queries</b>, where the database treats input strictly as data."],
          code: "// ❌ dangerous\ndb.query(\"SELECT * FROM users WHERE name = '\" + name + \"'\");\n\n// ✅ safe — the value is passed separately\ndb.query(\"SELECT * FROM users WHERE name = $1\", [name]);", lang: "js" },
        { h: "HTTPS and secrets", p: ["Always serve your site over <b>HTTPS</b> so data is encrypted on the way. Keep API keys and database passwords in <b>environment variables</b> or a secret manager — never in your code or Git history."],
          code: "# .env  (never commit this file!)\nDATABASE_URL=postgres://...\nSTRIPE_SECRET_KEY=...", lang: "bash" }
      ],
      points: ["Never trust input — validate on the server.", "Use parameterized queries to stop SQL injection.", "HTTPS everywhere; secrets in environment variables."],
      checks: [
        { q: "What prevents SQL injection?", options: ["Longer passwords", "Parameterized queries", "Using GET instead of POST", "CSS"], answer: 1, explain: "Parameters keep user input separate from the SQL code." },
        { q: "Where should a secret API key live?", options: ["In the frontend JavaScript", "In a public GitHub repo", "In an environment variable on the server", "In the page title"], answer: 2, explain: "Secrets stay on the server, out of the code." }
      ]
    },
    {
      title: "Errors, logging & testing",
      minutes: 7,
      summary: "Find problems before your players do.",
      sections: [
        { h: "Handle errors", p: ["Wrap risky work in <code>try</code>/<code>catch</code>, return a helpful status code, and never show raw error details (stack traces, SQL) to users."],
          code: "app.get(\"/players/:id\", async (req, res) => {\n  try {\n    const player = await db.findPlayer(req.params.id);\n    if (!player) return res.status(404).json({ error: \"Player not found\" });\n    res.json(player);\n  } catch (err) {\n    logger.error(err);\n    res.status(500).json({ error: \"Something went wrong\" });\n  }\n});", lang: "js" },
        { h: "Logging", p: ["<b>Logs</b> record what happened: requests, errors, important events. When something breaks at 3 a.m., logs tell you why."] },
        { h: "Automated tests", p: ["<b>Unit tests</b> check small functions; <b>integration tests</b> check that parts work together (e.g. an API route with a test database). Run them automatically on every change."],
          code: "test(\"new players start with 0 XP\", () => {\n  const p = createPlayer(\"Ada\");\n  expect(p.xp).toBe(0);\n});", lang: "js" }
      ],
      points: ["Catch errors and return clear status codes.", "Log errors and important events.", "Unit + integration tests catch bugs early."],
      checks: [
        { q: "What should users see when the server crashes?", options: ["The full stack trace", "A friendly message with status 500", "The database password", "Nothing at all, ever"], answer: 1, explain: "Log the details privately; show users a friendly message." },
        { q: "A test that checks one small function on its own is a…", options: ["Unit test", "Load test", "Integration test", "Smoke screen"], answer: 0, explain: "Unit tests check small units in isolation." }
      ]
    },
    {
      title: "Performance & scaling",
      minutes: 8,
      summary: "Keep things fast when one player becomes a million.",
      sections: [
        { h: "Indexes", p: ["An <b>index</b> is like the index at the back of a book: the database finds rows without reading the whole table. Add indexes to columns you search or sort by often."],
          code: "CREATE INDEX players_xp_idx ON players (xp DESC);", lang: "sql" },
        { h: "Caching", p: ["A <b>cache</b> keeps the answer to an expensive question for a while (in memory, e.g. <b>Redis</b>, or at the edge with a <b>CDN</b>). The leaderboard doesn't need to be recalculated on every single request."] },
        { h: "Scaling out", p: ["<b>Vertical scaling</b> = a bigger server. <b>Horizontal scaling</b> = more servers behind a <b>load balancer</b> that spreads the requests. Keep servers <b>stateless</b> (store sessions in a database or cache) so any server can answer any request."] }
      ],
      points: ["Indexes make searches fast.", "Caches avoid repeating expensive work.", "Scale out with stateless servers behind a load balancer."],
      checks: [
        { q: "What does a database index speed up?", options: ["Finding and sorting rows", "Writing CSS", "Uploading images", "Typing passwords"], answer: 0, explain: "Indexes let the database jump straight to matching rows." },
        { q: "What does a load balancer do?", options: ["Spreads requests across several servers", "Stores passwords", "Makes images smaller", "Runs SQL"], answer: 0, explain: "It shares the traffic so no single server is overwhelmed." }
      ]
    }
  ],
  exam: [
    { q: "Where does backend code run?", options: ["In the user's browser", "On servers", "Inside CSS files", "In the DOM"], answer: 1, explain: "The backend runs on servers you control." },
    { q: "What is a typical backend response format?", options: ["JSON", "PNG", "MP3", "SCSS"], answer: 0, explain: "Most APIs answer with JSON." },
    { q: "Which HTTP method should <b>read</b> data without changing it?", options: ["POST", "GET", "DELETE", "PATCH"], answer: 1, explain: "GET is for reading." },
    { q: "Which status code family means the <b>server</b> failed?", options: ["2xx", "3xx", "4xx", "5xx"], answer: 3, explain: "5xx = server errors, e.g. 500." },
    { q: "What does status <code>401</code> mean?", options: ["OK", "Unauthorized — you need to log in", "Moved permanently", "Server error"], answer: 1, explain: "401 = not authenticated." },
    { q: "In HTTP, where does a login token usually go?", options: ["In the URL path", "In the Authorization header", "In the CSS", "In the status code"], answer: 1, explain: "<code>Authorization: Bearer &lt;token&gt;</code>." },
    { q: "Which URL best follows REST style?", options: ["/deleteLevel?id=3", "DELETE /levels/3", "GET /levels/3/delete", "POST /removeLevelNumber3"], answer: 1, explain: "Method = verb, path = resource." },
    { q: "In Express, where is the JSON sent by the client?", options: ["req.body", "res.body", "req.headers.json", "app.json"], answer: 0, explain: "With <code>express.json()</code>, data is in <code>req.body</code>." },
    { q: "What is middleware?", options: ["Code that runs before your route handlers", "A type of database", "A CSS framework", "A web browser"], answer: 0, explain: "Middleware handles shared jobs like parsing and auth checks." },
    { q: "Why use a database instead of variables in the server?", options: ["Variables are illegal", "Data in variables is lost when the server restarts", "Databases are always free", "Variables can't hold text"], answer: 1, explain: "Databases persist data safely." },
    { q: "A column that points to a row in another table is a…", options: ["Primary key", "Foreign key", "Index page", "Header"], answer: 1, explain: "Foreign keys link tables." },
    { q: "Which SQL query gets players with more than 100 XP?", options: ["SELECT * FROM players WHERE xp > 100;", "GET players xp > 100;", "SELECT players IF xp > 100;", "FIND players WHERE xp = 100+;"], answer: 0, explain: "SELECT … FROM … WHERE …" },
    { q: "Which keyword sorts results?", options: ["SORT", "ORDER BY", "GROUP", "ARRANGE"], answer: 1, explain: "<code>ORDER BY xp DESC</code>." },
    { q: "What combines rows from two tables?", options: ["JOIN", "MERGE CSS", "UNION ALL STYLES", "LINK"], answer: 0, explain: "<code>JOIN … ON …</code> matches rows by keys." },
    { q: "What is the difference between authentication and authorization?", options: ["They are the same", "Authentication = who you are; authorization = what you may do", "Authentication = what you may do; authorization = who you are", "Both are about CSS"], answer: 1, explain: "Who vs what." },
    { q: "How should passwords be stored?", options: ["Plain text", "Base64", "Slow hash like bcrypt", "In cookies"], answer: 2, explain: "Hashes can't be reversed into the password." },
    { q: "What is SQL injection?", options: ["A fast way to insert rows", "When user input is run as SQL code because it was glued into a query", "A database backup", "A type of index"], answer: 1, explain: "Prevent it with parameterized queries." },
    { q: "Where should secret keys be kept?", options: ["In frontend code", "In environment variables / a secret manager on the server", "In a public README", "In the HTML title"], answer: 1, explain: "Never ship secrets to the browser or Git." },
    { q: "What does a cache do?", options: ["Stores results of expensive work so they can be reused quickly", "Encrypts passwords", "Deletes old rows", "Renders HTML"], answer: 0, explain: "Caching avoids repeating expensive work." },
    { q: "What is horizontal scaling?", options: ["Buying one bigger server", "Adding more servers behind a load balancer", "Making the screen wider", "Adding columns to a table"], answer: 1, explain: "More servers share the load." }
  ]
});

/* Course: Frontend development — 13 lessons (10 here + 3 in extra-lessons.js) + a final exam question pool. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "frontend",
  name: "Frontend",
  title: "Frontend Development",
  color: "#f472b6",
  icon: "gem",
  theme: "village",
  blurb: "Build what people see and click: HTML, CSS, JavaScript and the tools around them.",
  topics: "HTML, CSS, layout, responsive design, the DOM, forms, fetching data and deployment",
  lessons: [
    {
      title: "How the web works",
      minutes: 6,
      summary: "What really happens when you type an address and press Enter.",
      sections: [
        { h: "Clients and servers", diagram: "request", p: ["When you open a website, your <b>browser</b> (the client) sends a <b>request</b> over the internet to a <b>server</b>. The server answers with a <b>response</b> — usually files like HTML, CSS, JavaScript and images.", "The address you type is a <b>URL</b>. It tells the browser which server to ask and which page you want."],
          code: "https://inileyt.github.io/game/levels.html\n└─┬──┘   └───────┬────────┘└─┬─┘└────┬────┘\nprotocol      domain        path   file", lang: "text" },
        { h: "The three languages of the frontend", p: ["<b>HTML</b> describes the content and structure (headings, text, buttons). <b>CSS</b> describes how it looks (colors, sizes, layout). <b>JavaScript</b> makes it interactive (clicks, animations, loading data).", "The <b>frontend</b> is everything that runs in the browser. The <b>backend</b> is what runs on the server."] },
        { h: "Rendering", p: ["The browser reads the HTML, builds a tree of elements (the <b>DOM</b>), applies the CSS, runs the JavaScript and finally paints pixels on the screen. Frontend developers make this fast, beautiful and easy to use."] }
      ],
      points: ["A browser (client) requests pages from a server.", "HTML = structure, CSS = style, JavaScript = behaviour.", "The frontend runs in the browser; the backend runs on the server."],
      checks: [
        { q: "Which language describes how a page <b>looks</b> (colors, sizes, layout)?", options: ["HTML", "CSS", "SQL", "JSON"], answer: 1, explain: "CSS = Cascading Style Sheets — it styles the page." },
        { q: "What does the browser send to a server to get a page?", options: ["A request", "A response", "A database", "A cookie only"], answer: 0, explain: "The browser sends a request; the server sends back a response." }
      ]
    },
    {
      title: "HTML basics",
      minutes: 7,
      summary: "Tags, elements and the skeleton every web page shares.",
      sections: [
        { h: "Elements and tags", p: ["HTML is made of <b>elements</b>. Most have an opening tag, content and a closing tag. Tags can have <b>attributes</b> that add extra information."],
          code: "<h1>Welcome to Bitwood</h1>\n<p>Learn to code with pixel adventures.</p>\n<a href=\"levels.html\">Open the map</a>\n<img src=\"hero.png\" alt=\"A pixel hero\">", lang: "html" },
        { h: "The page skeleton", p: ["Every page has the same basic structure: a <code>&lt;head&gt;</code> with information about the page (title, styles) and a <code>&lt;body&gt;</code> with what you see."],
          code: "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>My first page</title>\n  </head>\n  <body>\n    <h1>Hello!</h1>\n  </body>\n</html>", lang: "html" },
        { h: "Nesting", p: ["Elements live inside other elements, like boxes in boxes. Always close the inner one before the outer one: <code>&lt;p&gt;&lt;b&gt;bold&lt;/b&gt;&lt;/p&gt;</code>."] }
      ],
      points: ["An element = opening tag + content + closing tag.", "Attributes like <code>href</code> and <code>src</code> add information.", "<code>&lt;head&gt;</code> is about the page, <code>&lt;body&gt;</code> is what users see."],
      checks: [
        { q: "Which tag creates a link?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1, explain: "<code>&lt;a href=\"…\"&gt;</code> creates a clickable link. (<code>&lt;link&gt;</code> loads files like CSS.)" },
        { q: "Where does the visible content of a page go?", options: ["<head>", "<title>", "<body>", "<meta>"], answer: 2, explain: "Everything users see lives inside <code>&lt;body&gt;</code>." }
      ]
    },
    {
      title: "Semantic HTML & accessibility",
      minutes: 7,
      summary: "Use the right tag for the job so everyone — and every device — understands your page.",
      sections: [
        { h: "Semantic tags", p: ["<b>Semantic</b> tags describe <i>what</i> something is, not how it looks: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;button&gt;</code>. Screen readers and search engines use them to understand your page."],
          code: "<header>\n  <nav><a href=\"/\">Home</a></nav>\n</header>\n<main>\n  <article>\n    <h1>Level 1</h1>\n    <button>Start</button>\n  </article>\n</main>\n<footer>© Bitwood</footer>", lang: "html" },
        { h: "Accessibility (a11y)", p: ["Accessibility means people with disabilities can use your site too. Give every image an <code>alt</code> text, connect every input to a <code>&lt;label&gt;</code>, use real <code>&lt;button&gt;</code>s for actions, and make sure everything works with the keyboard."],
          code: "<img src=\"castle.png\" alt=\"A purple pixel castle\">\n\n<label for=\"email\">Email</label>\n<input id=\"email\" type=\"email\">", lang: "html" },
        { h: "Headings are a map", p: ["Use one <code>&lt;h1&gt;</code> per page, then <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>… in order. Screen-reader users jump between headings like chapters."] }
      ],
      points: ["Semantic tags say what content <i>is</i>.", "Every image needs <code>alt</code>, every input needs a <code>&lt;label&gt;</code>.", "Use <code>&lt;button&gt;</code> for actions and keep headings in order."],
      checks: [
        { q: "Which attribute describes an image for people who can't see it?", options: ["title", "src", "alt", "name"], answer: 2, explain: "Screen readers read the <code>alt</code> text aloud." },
        { q: "Which tag should wrap the main content of a page?", options: ["<div id=\"main\">", "<main>", "<section class=\"main\">", "<body2>"], answer: 1, explain: "<code>&lt;main&gt;</code> is the semantic tag for the main content." }
      ]
    },
    {
      title: "CSS basics",
      minutes: 8,
      summary: "Selectors, properties and the box model that every element follows.",
      sections: [
        { h: "Rules, selectors and properties", p: ["A CSS rule picks elements with a <b>selector</b> and sets <b>properties</b> on them. Select by tag (<code>h1</code>), class (<code>.btn</code>) or id (<code>#title</code>)."],
          code: "h1 {\n  color: #facc15;\n  font-size: 32px;\n}\n.btn {\n  background: #2cbaff;\n  padding: 12px 20px;\n}\n#title { text-align: center; }", lang: "css" },
        { h: "The box model", p: ["Every element is a box: <b>content</b>, then <b>padding</b> (space inside), then <b>border</b>, then <b>margin</b> (space outside). Add <code>box-sizing: border-box</code> so width includes padding and border — it makes sizes much easier."],
          code: "* { box-sizing: border-box; }\n.card {\n  width: 300px;\n  padding: 16px;\n  border: 3px solid #334155;\n  margin: 24px auto;\n}", lang: "css" },
        { h: "The cascade", p: ["When two rules fight, the more <b>specific</b> selector wins (id &gt; class &gt; tag), and if they are equal, the <b>later</b> rule wins. That's the \"C\" in CSS."] }
      ],
      points: ["Selector + properties = a CSS rule.", "Box model: content → padding → border → margin.", "More specific selectors win; later rules win ties."],
      checks: [
        { q: "Which selector picks all elements with <code>class=\"card\"</code>?", options: ["#card", ".card", "card", "*card"], answer: 1, explain: "A dot selects by class: <code>.card</code>." },
        { q: "What is <b>padding</b>?", options: ["Space outside the border", "Space inside the border, around the content", "The border's color", "The text size"], answer: 1, explain: "Padding is inside the border; margin is outside." }
      ]
    },
    {
      title: "Layout with Flexbox & Grid",
      minutes: 8,
      summary: "Line things up in rows, columns and grids without fighting the browser.",
      sections: [
        { h: "Flexbox: one direction", p: ["<code>display: flex</code> lines children up in a row (or a column). <code>justify-content</code> spreads them along the main direction, <code>align-items</code> aligns them across it, and <code>gap</code> adds space between."],
          code: ".nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}", lang: "css" },
        { h: "Grid: two directions", p: ["<code>display: grid</code> places children in rows <i>and</i> columns. <code>1fr</code> means \"one share of the free space\"."],
          code: ".levels {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}", lang: "css" },
        { h: "Which one?", p: ["Use <b>Flexbox</b> for a row of buttons, a navbar or centering one thing. Use <b>Grid</b> for card galleries and whole-page layouts. Many pages use both."] }
      ],
      points: ["Flexbox = one direction (row or column).", "Grid = rows and columns together.", "<code>gap</code> adds space between items in both."],
      checks: [
        { q: "Which CSS makes children sit in a row?", options: ["display: block", "display: flex", "position: row", "float: row"], answer: 1, explain: "<code>display: flex</code> uses a row by default." },
        { q: "What does <code>grid-template-columns: repeat(3, 1fr)</code> create?", options: ["3 rows", "3 equal columns", "Columns of 3px", "A 3D grid"], answer: 1, explain: "Three columns, each taking one equal share of the space." }
      ]
    },
    {
      title: "Responsive design",
      minutes: 7,
      summary: "One website that looks great on phones, tablets and big screens.",
      sections: [
        { h: "The viewport tag", p: ["Phones pretend to be wide unless you add this tag to the <code>&lt;head&gt;</code>. It tells the browser to use the real device width."],
          code: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", lang: "html" },
        { h: "Media queries", p: ["A <b>media query</b> applies CSS only when a condition is true — usually the screen width. Start with the phone layout (<b>mobile first</b>) and add rules for bigger screens."],
          code: ".levels { grid-template-columns: 1fr; }\n\n@media (min-width: 768px) {\n  .levels { grid-template-columns: repeat(3, 1fr); }\n}", lang: "css" },
        { h: "Flexible sizes", p: ["Prefer flexible units: <code>%</code>, <code>fr</code>, <code>rem</code> and <code>max-width</code>. Make images shrink with <code>max-width: 100%</code>, and test by resizing your browser."] }
      ],
      points: ["Always add the viewport meta tag.", "Media queries change CSS at different screen sizes.", "Mobile first: design for small screens, then add more."],
      checks: [
        { q: "What does <code>@media (min-width: 768px)</code> do?", options: ["Applies the rules only on screens 768px wide or wider", "Makes the page 768px wide", "Hides the page on phones", "Loads a 768px image"], answer: 0, explain: "The rules inside apply when the screen is at least 768px wide." },
        { q: "What does \"mobile first\" mean?", options: ["Only build a phone app", "Write the phone layout first, then add rules for bigger screens", "Test on phones last", "Use only pixels"], answer: 1, explain: "Start small, then enhance for larger screens with media queries." }
      ]
    },
    {
      title: "JavaScript & the DOM",
      minutes: 8,
      summary: "Find elements, change them and react to clicks.",
      sections: [
        { h: "The DOM", diagram: "dom", p: ["The <b>DOM</b> (Document Object Model) is the browser's live tree of your HTML. JavaScript can read and change it, and the page updates instantly."],
          code: "const title = document.querySelector(\"h1\");\ntitle.textContent = \"Level up!\";\ntitle.classList.add(\"glow\");", lang: "js" },
        { h: "Events", p: ["An <b>event</b> is something that happens: a click, a key press, a form submit. Listen for it with <code>addEventListener</code>."],
          code: "const btn = document.querySelector(\"#start\");\nlet coins = 0;\n\nbtn.addEventListener(\"click\", () => {\n  coins++;\n  btn.textContent = `Coins: ${coins}`;\n});", lang: "js" },
        { h: "Creating elements", p: ["Build new elements with <code>document.createElement</code> and add them with <code>append</code>. Use <code>textContent</code> (not <code>innerHTML</code>) for text that comes from users — it's safer."] }
      ],
      points: ["<code>querySelector</code> finds an element with a CSS selector.", "<code>addEventListener</code> reacts to clicks and other events.", "Prefer <code>textContent</code> for user text."],
      checks: [
        { q: "Which method finds the first element matching a CSS selector?", options: ["document.find()", "document.querySelector()", "document.getCSS()", "window.select()"], answer: 1, explain: "<code>document.querySelector(\".card\")</code> returns the first match." },
        { q: "How do you run code when a button is clicked?", options: ["btn.onClickDo()", "btn.addEventListener(\"click\", fn)", "btn.listen(fn)", "click(btn)"], answer: 1, explain: "<code>addEventListener(\"click\", fn)</code> runs <code>fn</code> on every click." }
      ]
    },
    {
      title: "Forms & validation",
      minutes: 7,
      summary: "Collect information from people — and check it before sending.",
      sections: [
        { h: "Form elements", p: ["A <code>&lt;form&gt;</code> groups inputs. Choose the right <code>type</code> (<code>email</code>, <code>password</code>, <code>number</code>) so phones show the right keyboard. Built-in rules like <code>required</code> and <code>minlength</code> give free validation."],
          code: "<form id=\"signup\">\n  <label for=\"name\">Hero name</label>\n  <input id=\"name\" required minlength=\"2\">\n\n  <label for=\"mail\">Email</label>\n  <input id=\"mail\" type=\"email\" required>\n\n  <button>Join</button>\n</form>", lang: "html" },
        { h: "Handling submit in JavaScript", p: ["Listen for <code>submit</code>, call <code>preventDefault()</code> to stop the page from reloading, read the values and check them."],
          code: "form.addEventListener(\"submit\", (e) => {\n  e.preventDefault();\n  const name = form.name.value.trim();\n  if (name.length < 2) {\n    showError(\"Name is too short\");\n    return;\n  }\n  send(name);\n});", lang: "js" },
        { h: "Never trust the browser alone", p: ["Frontend validation is for a nice experience. The <b>server must validate again</b>, because anyone can skip your JavaScript."] }
      ],
      points: ["Use the right input <code>type</code> and a <code>&lt;label&gt;</code> for every field.", "<code>preventDefault()</code> stops the page reload on submit.", "Always validate again on the server."],
      checks: [
        { q: "What does <code>e.preventDefault()</code> do in a submit handler?", options: ["Deletes the form", "Stops the browser's default action (reloading the page)", "Validates the email", "Sends the form twice"], answer: 1, explain: "It cancels the default submit so your JavaScript can handle it." },
        { q: "Why must the server validate data too?", options: ["Servers are faster", "Users can bypass frontend checks", "Browsers can't validate", "It's only needed for passwords"], answer: 1, explain: "Anyone can turn off or skip JavaScript — the server is the real guard." }
      ]
    },
    {
      title: "Fetching data from APIs",
      minutes: 8,
      summary: "Load live data with fetch, JSON and async/await.",
      sections: [
        { h: "JSON", p: ["APIs usually send data as <b>JSON</b> — text that looks like JavaScript objects and arrays."],
          code: "{\n  \"name\": \"Ada\",\n  \"xp\": 1200,\n  \"badges\": [\"First Steps\", \"Knight\"]\n}", lang: "json" },
        { h: "fetch + async/await", p: ["<code>fetch</code> sends a request and returns a <b>promise</b>. Inside an <code>async</code> function, <code>await</code> waits for it without freezing the page."],
          code: "async function loadPlayers() {\n  const res = await fetch(\"/api/players\");\n  if (!res.ok) throw new Error(\"Request failed\");\n  const players = await res.json();\n  console.log(players.length, \"players\");\n}", lang: "js" },
        { h: "Loading and error states", p: ["Real networks are slow and sometimes fail. Show a loading indicator while waiting, and a friendly message (with a retry) when something goes wrong — use <code>try</code>/<code>catch</code>."] }
      ],
      points: ["JSON is the common data format for APIs.", "<code>await fetch(url)</code> then <code>await res.json()</code>.", "Always handle loading and errors."],
      checks: [
        { q: "What does <code>await res.json()</code> give you?", options: ["The raw HTML", "The response body parsed into JavaScript objects", "The status code", "A new request"], answer: 1, explain: "<code>.json()</code> reads the body and parses the JSON." },
        { q: "Why use <code>async</code>/<code>await</code>?", options: ["To make code slower", "To wait for network results without freezing the page", "To write CSS", "To avoid using functions"], answer: 1, explain: "The page stays responsive while the request is in flight." }
      ]
    },
    {
      title: "Tools & deployment",
      minutes: 7,
      summary: "DevTools, Git, npm, frameworks — and putting your site online.",
      sections: [
        { h: "Browser DevTools", p: ["Press <b>F12</b> to open DevTools. The <b>Elements</b> tab shows the live DOM and CSS, <b>Console</b> shows errors and logs, and <b>Network</b> shows every request. It's a frontend developer's best friend."] },
        { h: "Git, npm and frameworks", p: ["<b>Git</b> saves the history of your code. <b>npm</b> installs packages other people wrote. Frameworks like <b>React</b>, <b>Vue</b> and <b>Svelte</b> help build big apps from reusable components — but they all sit on top of the HTML, CSS and JavaScript you just learned."],
          code: "git init\ngit add .\ngit commit -m \"My first page\"\nnpm install some-package", lang: "bash" },
        { h: "Deploying", p: ["A static site (just HTML/CSS/JS files) can be hosted for free on <b>GitHub Pages</b>, Netlify or Vercel. Push your code, turn on hosting, and you get a public URL — this very website works that way!"] }
      ],
      points: ["DevTools: Elements, Console and Network tabs.", "Git tracks changes; npm installs packages.", "Static sites deploy for free on GitHub Pages and similar hosts."],
      checks: [
        { q: "Which DevTools tab shows every request the page makes?", options: ["Elements", "Console", "Network", "Sources only"], answer: 2, explain: "The Network tab lists all requests with their status and timing." },
        { q: "What is GitHub Pages?", options: ["A code editor", "Free hosting for static websites", "A database", "A CSS framework"], answer: 1, explain: "It serves your HTML/CSS/JS files at a public URL." }
      ]
    }
  ],
  exam: [
    { q: "What does the browser send to a server to get a page?", options: ["A response", "A request", "A stylesheet", "A database"], answer: 1, explain: "Client → request → server → response." },
    { q: "Which language describes the <b>structure</b> of a page?", options: ["CSS", "HTML", "JavaScript", "SQL"], answer: 1, explain: "HTML = structure, CSS = style, JS = behaviour." },
    { q: "Which tag shows an image?", options: ["<picture-src>", "<img>", "<image>", "<src>"], answer: 1, explain: "<code>&lt;img src=\"…\" alt=\"…\"&gt;</code>." },
    { q: "Where does the page <code>&lt;title&gt;</code> go?", options: ["In <body>", "In <head>", "In <footer>", "Anywhere"], answer: 1, explain: "<code>&lt;title&gt;</code> belongs in <code>&lt;head&gt;</code>." },
    { q: "Which of these is a <b>semantic</b> tag?", options: ["<div>", "<span>", "<nav>", "<b>"], answer: 2, explain: "<code>&lt;nav&gt;</code> says \"this is navigation\"." },
    { q: "Every form input should be connected to a…", options: ["<label>", "<title>", "<legend> only", "<span>"], answer: 0, explain: "<code>&lt;label for=\"id\"&gt;</code> tells everyone what the input is." },
    { q: "Which CSS selector targets the element with <code>id=\"hero\"</code>?", options: [".hero", "#hero", "hero", "@hero"], answer: 1, explain: "<code>#</code> selects by id." },
    { q: "In the box model, what is outside the border?", options: ["Padding", "Content", "Margin", "Outline-box"], answer: 2, explain: "Content → padding → border → margin." },
    { q: "What does <code>box-sizing: border-box</code> do?", options: ["Adds a border", "Makes width include padding and border", "Removes margins", "Rounds corners"], answer: 1, explain: "Sizes become easier to reason about." },
    { q: "Which layout system is best for a single row of buttons?", options: ["Grid only", "Flexbox", "Tables", "Floats"], answer: 1, explain: "Flexbox handles one direction beautifully." },
    { q: "What does <code>1fr</code> mean in CSS Grid?", options: ["1 frame per second", "One share of the free space", "1 font-relative unit", "First row"], answer: 1, explain: "Columns with <code>1fr</code> split the free space equally." },
    { q: "Which tag is needed for responsive pages on phones?", options: ["<meta name=\"viewport\" …>", "<meta name=\"phone\">", "<responsive>", "<link rel=\"mobile\">"], answer: 0, explain: "Without it, phones render a zoomed-out desktop page." },
    { q: "When do the rules in <code>@media (min-width: 1024px) { … }</code> apply?", options: ["On screens at least 1024px wide", "On screens smaller than 1024px", "Only when printing", "Always"], answer: 0, explain: "<code>min-width</code> = this wide or wider." },
    { q: "What is the DOM?", options: ["A database", "The browser's live tree of the page's elements", "A CSS file", "A server"], answer: 1, explain: "JavaScript reads and changes the DOM to update the page." },
    { q: "Which code changes the text of an element safely?", options: ["el.textContent = \"Hi\"", "el.text(\"Hi\")", "el.write(\"Hi\")", "el.html = \"Hi\""], answer: 0, explain: "<code>textContent</code> sets plain text." },
    { q: "Which method listens for clicks?", options: ["el.onClick()", "el.addEventListener(\"click\", fn)", "el.listen(\"click\")", "el.click(fn)"], answer: 1, explain: "<code>addEventListener</code> is the standard way." },
    { q: "Why call <code>e.preventDefault()</code> when a form is submitted?", options: ["To stop the page from reloading", "To clear the form", "To validate passwords", "To send it faster"], answer: 0, explain: "It cancels the browser's default submit." },
    { q: "Which format do most APIs use to send data?", options: ["CSV", "JSON", "PNG", "HTML only"], answer: 1, explain: "JSON is the web's common data format." },
    { q: "What does <code>await fetch(url)</code> do?", options: ["Waits for the network response", "Downloads the whole internet", "Blocks the page forever", "Creates a server"], answer: 0, explain: "It waits for the response without freezing the page." },
    { q: "Which DevTools tab shows JavaScript errors and <code>console.log</code> output?", options: ["Network", "Elements", "Console", "Application"], answer: 2, explain: "The Console tab shows logs and errors." }
  ]
});

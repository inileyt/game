/* Course: React — 13 lessons (10 here + 3 in extra-lessons.js) + a final exam question pool. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "react",
  name: "React",
  title: "React Basics",
  color: "#61dafb",
  icon: "star",
  theme: "rapids",
  blurb: "Build interactive interfaces from small reusable components.",
  topics: "components, JSX, props, state, events, lists, effects, forms, hooks and React tooling",
  lessons: [
    {
      title: "What is React?",
      minutes: 5,
      summary: "A JavaScript library for building user interfaces from components.",
      sections: [
        { h: "Why React?", p: ["Big interfaces are hard to keep in sync by hand. <b>React</b> lets you describe what the screen should look like for the current data, and it updates the real page (the <b>DOM</b>) for you when the data changes."] },
        { h: "Components", p: ["A React app is a tree of <b>components</b> — small, reusable pieces like <code>Navbar</code>, <code>LevelCard</code> or <code>Button</code>. Each one is just a JavaScript function that returns what to show."],
          diagram: "react-tree" },
        { h: "Prerequisites", p: ["React is JavaScript, so knowing variables, functions, arrays and objects (the JavaScript worlds in Bitwood!) helps a lot."] }
      ],
      points: ["React builds UIs from components.", "You describe the UI; React updates the DOM.", "Components are JavaScript functions."],
      checks: [
        { q: "What is a React component?", options: ["A reusable piece of UI written as a function", "A CSS file", "A database table", "A browser"], answer: 0, explain: "Components are functions that return UI." },
        { q: "What does React update for you when data changes?", options: ["The DOM", "The server", "The database", "Your Git history"], answer: 0, explain: "React keeps the DOM in sync with your data." }
      ]
    },
    {
      title: "JSX",
      minutes: 6,
      summary: "Write HTML-like code inside JavaScript.",
      sections: [
        { h: "HTML in JavaScript", p: ["<b>JSX</b> looks like HTML but lives in JavaScript. Put any JavaScript expression inside <code>{ }</code>."],
          code: "function Welcome() {\n  const name = \"Ada\";\n  return <h1>Hello, {name}! You have {2 + 3} coins.</h1>;\n}", lang: "js" },
        { h: "JSX rules", p: ["Return <b>one</b> parent element (or a fragment <code>&lt;&gt;…&lt;/&gt;</code>), close every tag (<code>&lt;img /&gt;</code>), and use <code>className</code> instead of <code>class</code>."],
          code: "return (\n  <>\n    <img src=\"hero.png\" alt=\"Hero\" />\n    <p className=\"intro\">Ready?</p>\n  </>\n);", lang: "js" }
      ],
      points: ["JSX = HTML-like syntax in JavaScript.", "<code>{ }</code> embeds expressions.", "One parent, close all tags, <code>className</code>."],
      checks: [
        { q: "How do you put a variable into JSX?", options: ["{name}", "${name}", "<name>", "%name%"], answer: 0, explain: "Curly braces run JavaScript inside JSX." },
        { q: "Which attribute sets a CSS class in JSX?", options: ["className", "class", "cssClass", "style-class"], answer: 0, explain: "<code>class</code> is a reserved word in JavaScript." }
      ]
    },
    {
      title: "Components & props",
      minutes: 7,
      summary: "Pass data into components like arguments to a function.",
      sections: [
        { h: "Props", p: ["<b>Props</b> are inputs to a component, written like HTML attributes. The component receives them as an object."],
          code: "function LevelCard({ name, xp }) {\n  return (\n    <div className=\"card\">\n      <h3>{name}</h3>\n      <p>+{xp} XP</p>\n    </div>\n  );\n}\n\n<LevelCard name=\"Loop Forest\" xp={150} />", lang: "js" },
        { h: "Composition", p: ["Build big components from small ones. Component names start with a <b>capital letter</b>. Props flow <b>down</b> from parent to child and are <b>read-only</b>."] }
      ],
      points: ["Props pass data from parent to child.", "Props are read-only.", "Component names start with a capital letter."],
      checks: [
        { q: "What are props?", options: ["Inputs passed into a component", "CSS animations", "Database rows", "Git branches"], answer: 0, explain: "Props are like function arguments." },
        { q: "Can a component change its own props?", options: ["No, props are read-only", "Yes, always", "Only on Mondays", "Only with CSS"], answer: 0, explain: "Use state for data that changes." }
      ]
    },
    {
      title: "State",
      minutes: 7,
      summary: "Give components memory with useState.",
      sections: [
        { h: "useState", p: ["<b>State</b> is data that can change over time. <code>useState</code> returns the current value and a function to update it. When state changes, React <b>re-renders</b> the component."],
          code: "import { useState } from \"react\";\n\nfunction CoinCounter() {\n  const [coins, setCoins] = useState(0);\n  return (\n    <button onClick={() => setCoins(coins + 1)}>\n      Coins: {coins}\n    </button>\n  );\n}", lang: "js" },
        { h: "The render cycle", p: ["Event → <code>setState</code> → React runs the component again → compares the new result with the old one → updates only the changed parts of the DOM."],
          diagram: "react-render" },
        { h: "Never mutate", p: ["Always call the setter with a new value. Changing state directly (<code>coins++</code>) won't re-render."] }
      ],
      points: ["<code>const [value, setValue] = useState(start)</code>.", "Calling the setter re-renders the component.", "Don't change state directly."],
      checks: [
        { q: "What does <code>useState(0)</code> return?", options: ["The current value and a setter function", "Only the number 0", "A DOM element", "A CSS class"], answer: 0, explain: "<code>[value, setValue]</code>." },
        { q: "What happens when you call <code>setCoins(5)</code>?", options: ["React re-renders the component with the new value", "Nothing", "The page reloads", "The server restarts"], answer: 0, explain: "State changes trigger a re-render." }
      ]
    },
    {
      title: "Events",
      minutes: 6,
      summary: "React to clicks, typing and more.",
      sections: [
        { h: "Event handlers", p: ["Pass a function to props like <code>onClick</code>, <code>onChange</code> or <code>onSubmit</code> (camelCase). Pass the function — don't call it!"],
          code: "function Door() {\n  const [open, setOpen] = useState(false);\n  return (\n    <button onClick={() => setOpen(!open)}>\n      {open ? \"Close the door\" : \"Open the door\"}\n    </button>\n  );\n}", lang: "js" },
        { h: "Common mistake", p: ["<code>onClick={openDoor}</code> ✅ passes the function. <code>onClick={openDoor()}</code> ❌ calls it immediately during render."] }
      ],
      points: ["Events use camelCase props: <code>onClick</code>, <code>onChange</code>.", "Pass a function, don't call it.", "Handlers usually update state."],
      checks: [
        { q: "Which is correct?", options: ["onClick={handleClick}", "onclick=\"handleClick()\"", "onClick={handleClick()}", "click={handleClick}"], answer: 0, explain: "Pass the function itself." },
        { q: "How are React event props written?", options: ["camelCase, like onClick", "lowercase, like onclick", "UPPERCASE", "with a dash, like on-click"], answer: 0, explain: "React uses camelCase." }
      ]
    },
    {
      title: "Lists & conditions",
      minutes: 7,
      summary: "Render arrays with map() and show things only sometimes.",
      sections: [
        { h: "Lists with map", p: ["Turn an array into elements with <code>.map()</code>. Give each item a unique <code>key</code> so React can track it."],
          code: "const levels = [\n  { id: 1, name: \"Variable Village\" },\n  { id: 2, name: \"Loop Forest\" }\n];\n\n<ul>\n  {levels.map(l => <li key={l.id}>{l.name}</li>)}\n</ul>", lang: "js" },
        { h: "Conditional rendering", p: ["Use the ternary <code>? :</code> to choose, or <code>&amp;&amp;</code> to show something only when a condition is true."],
          code: "{isLoggedIn ? <Profile /> : <SignInButton />}\n{coins > 10 && <p>You can buy a sword!</p>}", lang: "js" }
      ],
      points: ["<code>array.map()</code> renders lists.", "Every list item needs a unique <code>key</code>.", "<code>? :</code> and <code>&amp;&amp;</code> for conditions."],
      checks: [
        { q: "Why does each list item need a <code>key</code>?", options: ["So React can track items between renders", "For CSS styling", "To sort the list", "It's only for SEO"], answer: 0, explain: "Keys help React update lists efficiently." },
        { q: "What does <code>{ok &amp;&amp; &lt;p&gt;Yes&lt;/p&gt;}</code> show when ok is false?", options: ["Nothing", "Yes", "false as text always", "An error"], answer: 0, explain: "The paragraph only renders when ok is true." }
      ]
    },
    {
      title: "Effects",
      minutes: 7,
      summary: "Run code after rendering — like loading data — with useEffect.",
      sections: [
        { h: "useEffect", p: ["<code>useEffect</code> runs code after React updates the screen: fetching data, timers, subscriptions. The <b>dependency array</b> decides when it runs again."],
          code: "useEffect(() => {\n  fetch(\"/api/players\")\n    .then(res => res.json())\n    .then(data => setPlayers(data));\n}, []);   // [] = run once, after the first render", lang: "js" },
        { h: "Cleanup", p: ["Return a function to clean up — for example to stop a timer when the component disappears."],
          code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);", lang: "js" }
      ],
      points: ["<code>useEffect</code> runs side effects after render.", "<code>[]</code> = once; <code>[x]</code> = when x changes.", "Return a cleanup function."],
      checks: [
        { q: "When does <code>useEffect(fn, [])</code> run?", options: ["Once, after the first render", "Before every click", "Never", "Every second"], answer: 0, explain: "An empty dependency array means once." },
        { q: "What is a typical use of useEffect?", options: ["Fetching data from an API", "Writing CSS", "Declaring props", "Creating a Git branch"], answer: 0, explain: "Side effects like fetching belong in effects." }
      ]
    },
    {
      title: "Forms",
      minutes: 6,
      summary: "Controlled inputs keep form values in state.",
      sections: [
        { h: "Controlled inputs", p: ["Store the input's value in state and update it on every change. React is then the single source of truth."],
          code: "function NameForm() {\n  const [name, setName] = useState(\"\");\n  function handleSubmit(e) {\n    e.preventDefault();\n    alert(`Welcome, ${name}!`);\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <label htmlFor=\"n\">Hero name</label>\n      <input id=\"n\" value={name} onChange={e => setName(e.target.value)} />\n      <button disabled={name.length < 2}>Join</button>\n    </form>\n  );\n}", lang: "js" },
        { h: "Notes", p: ["Use <code>htmlFor</code> instead of <code>for</code> on labels, call <code>e.preventDefault()</code> on submit, and validate before sending."] }
      ],
      points: ["Controlled input: <code>value</code> + <code>onChange</code>.", "<code>e.target.value</code> holds the typed text.", "<code>htmlFor</code> on labels."],
      checks: [
        { q: "What makes an input \"controlled\"?", options: ["Its value comes from state and updates via onChange", "It has a CSS class", "It's disabled", "It's inside a div"], answer: 0, explain: "React state controls what the input shows." },
        { q: "Where is the typed text in an onChange handler?", options: ["e.target.value", "e.text", "e.key.value", "this.value()"], answer: 0, explain: "<code>e.target</code> is the input element." }
      ]
    },
    {
      title: "Hooks & sharing state",
      minutes: 7,
      summary: "Lift state up, share it with context, and write custom hooks.",
      sections: [
        { h: "Lifting state up", p: ["When two components need the same data, move the state to their closest common parent and pass it down as props."] },
        { h: "Context", p: ["For data many components need (theme, logged-in user), <b>context</b> avoids passing props through every level."],
          code: "const UserContext = createContext(null);\n\n<UserContext.Provider value={user}>\n  <App />\n</UserContext.Provider>\n\n// deep inside:\nconst user = useContext(UserContext);", lang: "js" },
        { h: "Rules of hooks", p: ["Hooks start with <code>use</code>. Only call them at the <b>top level</b> of a component (not inside if/loops), so React can keep track of them. You can write your own: <code>useCoins()</code>, <code>useLocalStorage()</code>…"] }
      ],
      points: ["Lift shared state to a common parent.", "Context shares data without prop-drilling.", "Call hooks only at the top level."],
      checks: [
        { q: "Where should shared state live?", options: ["In the closest common parent", "In a random child", "In CSS", "In the database only"], answer: 0, explain: "Lift it up, then pass it down." },
        { q: "Which is a rule of hooks?", options: ["Only call them at the top level of a component", "Call them inside loops", "Name them in UPPERCASE", "Use them only in CSS"], answer: 0, explain: "Never inside conditions or loops." }
      ]
    },
    {
      title: "Tooling & next steps",
      minutes: 6,
      summary: "Start a project, build it, and keep learning.",
      sections: [
        { h: "Starting a project", p: ["<b>Vite</b> creates a fast React project in seconds. Frameworks like <b>Next.js</b> add routing, server rendering and more."],
          code: "npm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev      # local dev server\nnpm run build    # production files in dist/", lang: "bash" },
        { h: "The ecosystem", p: ["<b>React DevTools</b> shows the component tree and state. Popular companions: <b>React Router</b> (pages), <b>TanStack Query</b> (data fetching), and component libraries. React Native even builds phone apps with the same ideas."] }
      ],
      points: ["Vite or Next.js to start projects.", "<code>npm run dev</code> to develop, <code>npm run build</code> to ship.", "React DevTools inspects components and state."],
      checks: [
        { q: "What does <code>npm run build</code> usually do?", options: ["Creates optimized files for production", "Deletes the project", "Starts a database", "Opens GitHub"], answer: 0, explain: "Build output is what you deploy." },
        { q: "Which tool inspects React components in the browser?", options: ["React DevTools", "pip", "kubectl", "git log"], answer: 0, explain: "It shows props, state and the component tree." }
      ]
    }
  ],
  exam: [
    { q: "What is React?", options: ["A JavaScript library for building user interfaces", "A database", "A CSS framework only", "A programming language"], answer: 0, explain: "React is a UI library." },
    { q: "A React app is made of…", options: ["Components", "Tables", "Branches", "Containers"], answer: 0, explain: "Components all the way down." },
    { q: "What is JSX?", options: ["HTML-like syntax inside JavaScript", "A new browser", "A JSON file", "A Python library"], answer: 0, explain: "JSX compiles to JavaScript." },
    { q: "How do you show the value of <code>score</code> in JSX?", options: ["{score}", "{{score}}", "$score", "<score/>"], answer: 0, explain: "Single curly braces." },
    { q: "Which is valid JSX for an image?", options: ["<img src=\"a.png\" alt=\"A\" />", "<img src=\"a.png\">", "<image src=a.png>", "<img>a.png</img>"], answer: 0, explain: "Tags must be closed in JSX." },
    { q: "Component names must start with…", options: ["A capital letter", "A number", "use", "An underscore"], answer: 0, explain: "<code>&lt;LevelCard /&gt;</code>, not <code>&lt;levelCard /&gt;</code>." },
    { q: "How does data flow with props?", options: ["From parent to child", "From child to parent", "From the database to CSS", "Sideways between siblings"], answer: 0, explain: "Props flow down." },
    { q: "What are props?", options: ["Read-only inputs to a component", "Global variables", "State setters", "Event names"], answer: 0, explain: "Use state for data that changes." },
    { q: "Which hook adds state to a component?", options: ["useState", "useEffect", "useProps", "useClass"], answer: 0, explain: "<code>const [x, setX] = useState(0)</code>." },
    { q: "What triggers a re-render?", options: ["Calling a state setter with a new value", "Changing a CSS file", "Writing a comment", "Opening DevTools"], answer: 0, explain: "New state → new render." },
    { q: "Why shouldn't you write <code>coins++</code> directly on state?", options: ["React won't know it changed and won't re-render", "It's too slow", "It deletes the component", "It's a syntax error"], answer: 0, explain: "Always use the setter." },
    { q: "Which is the correct click handler?", options: ["onClick={handleClick}", "onClick={handleClick()}", "onclick=\"handleClick\"", "click={handleClick}"], answer: 0, explain: "Pass the function, don't call it." },
    { q: "How do you render a list of names?", options: ["names.map(n => <li key={n}>{n}</li>)", "for (n of names) <li>", "names.render()", "<list names />"], answer: 0, explain: "<code>map</code> with a key." },
    { q: "What is the <code>key</code> prop for in lists?", options: ["Helping React track each item", "Encrypting data", "Sorting items", "Styling items"], answer: 0, explain: "Unique keys keep list updates correct." },
    { q: "When does <code>useEffect(fn, [userId])</code> run again?", options: ["When userId changes", "Every millisecond", "Never", "Only on the server"], answer: 0, explain: "Dependencies decide when effects re-run." },
    { q: "What is a good use of useEffect?", options: ["Fetching data after render", "Declaring a component", "Writing JSX", "Setting className"], answer: 0, explain: "Side effects go in effects." },
    { q: "In a controlled input, where does the value live?", options: ["In React state", "Only in the DOM", "In CSS", "In a cookie"], answer: 0, explain: "State is the single source of truth." },
    { q: "What does context help with?", options: ["Sharing data with many components without passing props through every level", "Styling", "Routing to pages", "Building for production"], answer: 0, explain: "It avoids prop drilling." },
    { q: "Which is a rule of hooks?", options: ["Call hooks only at the top level of a component", "Call hooks inside if statements", "Hooks must start with get", "Hooks only work in class components"], answer: 0, explain: "Top level, every render, same order." },
    { q: "Which tool quickly creates a new React project?", options: ["Vite", "Kubernetes", "PostgreSQL", "Terraform"], answer: 0, explain: "<code>npm create vite@latest</code>." }
  ]
});

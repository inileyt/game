/* The ten Bitwood levels — each one teaches a JavaScript idea and ends with a coding challenge. */
window.BITWOOD_LEVELS = [
  {
    id: 1,
    slug: "variable-village",
    name: "Variable Village",
    theme: "village",
    color: "#a3e635",
    icon: "flag",
    topic: "Variables & strings",
    xp: 100,
    blurb: "Pack your bag: learn to store values in variables and glue strings together.",
    lesson: [
      { p: "Every adventure starts by packing. In JavaScript you pack values into <b>variables</b>. Use <code>const</code> for things that never change and <code>let</code> for things that will." },
      { code: "const hero = \"Ada\";\nlet coins = 3;\ncoins = coins + 2; // now 5" },
      { p: "Text values are called <b>strings</b>. You can join them with <code>+</code>, or use a <b>template literal</b> with backticks and <code>${ }</code> to drop values right inside." },
      { code: "const name = \"Ada\";\nconst msg = `Welcome, ${name}!`;\nconsole.log(msg); // Welcome, Ada!" }
    ],
    task: "Write a function <code>greet(name)</code> that returns the string <code>\"Hello, NAME!\"</code> — for example <code>greet(\"Ada\")</code> returns <code>\"Hello, Ada!\"</code>.",
    fn: "greet",
    starter: "function greet(name) {\n  // Return a greeting like \"Hello, Ada!\"\n  \n}\n",
    hint: "Use a template literal: <code>return `Hello, ${name}!`;</code> — don't forget the comma, the space and the exclamation mark.",
    tests: [
      { args: ["Ada"], expected: "Hello, Ada!" },
      { args: ["Pixel"], expected: "Hello, Pixel!" },
      { args: ["Bitwood"], expected: "Hello, Bitwood!" }
    ]
  },
  {
    id: 2,
    slug: "loop-forest",
    name: "Loop Forest",
    theme: "forest",
    color: "#4ade80",
    icon: "sword",
    topic: "Loops",
    xp: 150,
    blurb: "The forest paths repeat forever. Tame them with for-loops and counters.",
    lesson: [
      { p: "When you need to do something many times, don't copy-paste — <b>loop</b>. A <code>for</code> loop has three parts: where to start, when to keep going and how to step." },
      { code: "for (let step = 1; step <= 3; step++) {\n  console.log(\"Step\", step);\n}\n// Step 1, Step 2, Step 3" },
      { p: "Loops are great for adding things up. Keep a running total in a <code>let</code> variable and add to it on every turn." },
      { code: "let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}\n// total is 10" }
    ],
    task: "Write <code>sumTo(n)</code> that returns the sum of all whole numbers from 1 to <code>n</code>. <code>sumTo(5)</code> is <code>15</code>, and <code>sumTo(0)</code> is <code>0</code>.",
    fn: "sumTo",
    starter: "function sumTo(n) {\n  let total = 0;\n  // Loop from 1 to n and add each number to total\n  \n  return total;\n}\n",
    hint: "Inside the function: <code>for (let i = 1; i &lt;= n; i++) { total += i; }</code>",
    tests: [
      { args: [1], expected: 1 },
      { args: [5], expected: 15 },
      { args: [10], expected: 55 },
      { args: [0], expected: 0 },
      { args: [100], expected: 5050 }
    ]
  },
  {
    id: 3,
    slug: "condition-caves",
    name: "Condition Caves",
    theme: "caves",
    color: "#a78bfa",
    icon: "gem",
    topic: "If / else",
    xp: 200,
    blurb: "Every tunnel splits in two. Choose the right path with if, else and %.",
    lesson: [
      { p: "Programs make choices with <code>if</code> and <code>else</code>. The code inside only runs when the condition is <code>true</code>." },
      { code: "const torch = 7;\nif (torch > 5) {\n  console.log(\"Bright enough!\");\n} else {\n  console.log(\"Too dark...\");\n}" },
      { p: "The <b>remainder</b> operator <code>%</code> tells you what is left after dividing. If <code>n % 3 === 0</code>, then <code>n</code> divides evenly by 3. Order matters — check the most specific case first!" },
      { code: "10 % 3   // 1\n9 % 3    // 0  → divisible by 3\n15 % 15  // 0" }
    ],
    task: "Write <code>fizzBuzz(n)</code>: return <code>\"FizzBuzz\"</code> if <code>n</code> divides by 3 and 5, <code>\"Fizz\"</code> if only by 3, <code>\"Buzz\"</code> if only by 5, otherwise the number as a string (<code>\"7\"</code>).",
    fn: "fizzBuzz",
    starter: "function fizzBuzz(n) {\n  // Check 15 first, then 3, then 5\n  \n}\n",
    hint: "Start with <code>if (n % 15 === 0) return \"FizzBuzz\";</code>, then the 3 and 5 cases, and finally <code>return String(n);</code>",
    tests: [
      { args: [3], expected: "Fizz" },
      { args: [5], expected: "Buzz" },
      { args: [15], expected: "FizzBuzz" },
      { args: [7], expected: "7" },
      { args: [30], expected: "FizzBuzz" },
      { args: [9], expected: "Fizz" }
    ]
  },
  {
    id: 4,
    slug: "array-rapids",
    name: "Array Rapids",
    theme: "rapids",
    color: "#2cbaff",
    icon: "potion",
    topic: "Arrays",
    xp: 250,
    blurb: "Loot floats down the river in a line. Sort through it with arrays.",
    lesson: [
      { p: "An <b>array</b> is an ordered list inside square brackets. Each item has an index, starting at <code>0</code>, and <code>.length</code> tells you how many items there are." },
      { code: "const bag = [\"coin\", \"gem\", \"coin\"];\nbag[0];      // \"coin\"\nbag.length;  // 3" },
      { p: "Walk through every item with <code>for...of</code>, or use <code>.filter()</code> to keep only the items you want." },
      { code: "for (const item of bag) {\n  console.log(item);\n}\nconst gems = bag.filter(item => item === \"gem\");\n// [\"gem\"]" }
    ],
    task: "Write <code>countCoins(bag)</code> that returns how many items in the array are exactly <code>\"coin\"</code>. An empty bag has <code>0</code> coins.",
    fn: "countCoins",
    starter: "function countCoins(bag) {\n  // Count the items that are \"coin\"\n  \n}\n",
    hint: "One line works: <code>return bag.filter(item => item === \"coin\").length;</code>",
    tests: [
      { args: [["coin", "gem", "coin"]], expected: 2 },
      { args: [[]], expected: 0 },
      { args: [["gem", "sword"]], expected: 0 },
      { args: [["coin", "coin", "coin", "potion"]], expected: 3 },
      { args: [["Coin", "coin"]], expected: 1 }
    ]
  },
  {
    id: 5,
    slug: "object-castle",
    name: "Object Castle",
    theme: "castle",
    color: "#ff7286",
    icon: "crown",
    topic: "Objects — mid-boss",
    xp: 300,
    blurb: "A knight guards the castle treasure room. Count the loot with objects.",
    lesson: [
      { p: "An <b>object</b> groups related values under names called <b>keys</b>. Read a value with a dot: <code>item.price</code>." },
      { code: "const potion = { name: \"potion\", price: 5, qty: 2 };\npotion.name;   // \"potion\"\npotion.price * potion.qty; // 10" },
      { p: "Real inventories are <b>arrays of objects</b>. Loop through them and combine what you learned in every level so far." },
      { code: "const loot = [\n  { name: \"potion\", price: 5, qty: 2 },\n  { name: \"sword\", price: 30, qty: 1 }\n];\nfor (const item of loot) {\n  console.log(item.name, item.qty);\n}" }
    ],
    task: "Mid-boss fight! Write <code>lootValue(inventory)</code> that returns the total value of an array of items, where each item is worth <code>price * qty</code>.",
    fn: "lootValue",
    starter: "function lootValue(inventory) {\n  // Add up price * qty for every item\n  \n}\n",
    hint: "Keep a <code>let total = 0;</code>, loop with <code>for (const item of inventory)</code>, add <code>item.price * item.qty</code>, then <code>return total;</code>",
    tests: [
      { args: [[{ name: "potion", price: 5, qty: 2 }, { name: "sword", price: 30, qty: 1 }]], expected: 40 },
      { args: [[]], expected: 0 },
      { args: [[{ name: "gem", price: 12, qty: 3 }]], expected: 36 },
      { args: [[{ name: "map", price: 0, qty: 9 }, { name: "crown", price: 100, qty: 1 }]], expected: 100 }
    ]
  },
  {
    id: 6,
    slug: "map-mesa",
    name: "Map Mesa",
    theme: "desert",
    color: "#fbbf24",
    icon: "sword",
    topic: "Arrow functions & map",
    xp: 350,
    blurb: "Sun-baked canyons where one spell changes every item at once: map.",
    lesson: [
      { p: "An <b>arrow function</b> is a short way to write a function. If the body is a single expression, its value is returned automatically." },
      { code: "const add = (a, b) => a + b;\nconst square = n => n * n;\nsquare(4); // 16" },
      { p: "<code>.map()</code> runs a function on every item of an array and gives you a <b>new</b> array with the results. The original array stays the same." },
      { code: "const hp = [10, 20, 30];\nconst healed = hp.map(n => n + 5);\n// healed is [15, 25, 35]\n// hp is still [10, 20, 30]" }
    ],
    task: "Write <code>doubleAll(nums)</code> that returns a new array with every number doubled. <code>doubleAll([1, 2, 3])</code> returns <code>[2, 4, 6]</code>.",
    fn: "doubleAll",
    starter: "function doubleAll(nums) {\n  // Return a NEW array with every number doubled\n  \n}\n",
    hint: "One line: <code>return nums.map(n =&gt; n * 2);</code>",
    tests: [
      { args: [[1, 2, 3]], expected: [2, 4, 6] },
      { args: [[]], expected: [] },
      { args: [[-4, 0, 10]], expected: [-8, 0, 20] },
      { args: [[0.5]], expected: [1] }
    ]
  },
  {
    id: 7,
    slug: "string-summit",
    name: "String Summit",
    theme: "snow",
    color: "#7dd3fc",
    icon: "gem",
    topic: "String methods",
    xp: 400,
    blurb: "Snowy peaks where words echo back. Bend strings with built-in methods.",
    lesson: [
      { p: "Strings come with handy <b>methods</b>. <code>.toLowerCase()</code> and <code>.toUpperCase()</code> change the case, and <code>.length</code> counts the letters." },
      { code: "const word = \"Echo\";\nword.toLowerCase(); // \"echo\"\nword.length;        // 4" },
      { p: "To flip a string: <code>.split(\"\")</code> turns it into an array of letters, <code>.reverse()</code> flips the array, and <code>.join(\"\")</code> glues it back together." },
      { code: "const letters = \"snow\".split(\"\");\n// [\"s\", \"n\", \"o\", \"w\"]\nletters.reverse().join(\"\"); // \"wons\"" }
    ],
    task: "Write <code>isPalindrome(word)</code> that returns <code>true</code> if the word reads the same forwards and backwards, ignoring upper/lower case (<code>\"Racecar\"</code> → <code>true</code>), otherwise <code>false</code>.",
    fn: "isPalindrome",
    starter: "function isPalindrome(word) {\n  // Lower-case it, reverse it, compare\n  \n}\n",
    hint: "<code>const w = word.toLowerCase();</code> then <code>return w === w.split(\"\").reverse().join(\"\");</code>",
    tests: [
      { args: ["level"], expected: true },
      { args: ["Racecar"], expected: true },
      { args: ["pixel"], expected: false },
      { args: ["a"], expected: true },
      { args: ["Noon"], expected: true },
      { args: ["ab"], expected: false }
    ]
  },
  {
    id: 8,
    slug: "while-swamp",
    name: "While Swamp",
    theme: "swamp",
    color: "#84cc16",
    icon: "potion",
    topic: "While loops",
    xp: 450,
    blurb: "Murky waters where you keep going until something changes: while loops.",
    lesson: [
      { p: "A <code>while</code> loop repeats <b>as long as</b> its condition is true. Make sure something inside the loop changes, or it will never stop!" },
      { code: "let fuel = 3;\nwhile (fuel > 0) {\n  console.log(\"Vroom\", fuel);\n  fuel--; // fuel goes down by 1\n}" },
      { p: "Use <code>.push()</code> to add an item to the end of an array while you loop." },
      { code: "const steps = [];\nsteps.push(\"left\");\nsteps.push(\"right\");\n// steps is [\"left\", \"right\"]" }
    ],
    task: "Write <code>countdown(n)</code> that returns an array counting down from <code>n</code> to <code>1</code>, then <code>\"GO!\"</code>. <code>countdown(3)</code> returns <code>[3, 2, 1, \"GO!\"]</code>, and <code>countdown(0)</code> returns <code>[\"GO!\"]</code>.",
    fn: "countdown",
    starter: "function countdown(n) {\n  const result = [];\n  // While n is above 0, push it and count down\n  \n  return result;\n}\n",
    hint: "<code>while (n &gt; 0) { result.push(n); n--; }</code> and then <code>result.push(\"GO!\");</code> before the return.",
    tests: [
      { args: [3], expected: [3, 2, 1, "GO!"] },
      { args: [1], expected: [1, "GO!"] },
      { args: [0], expected: ["GO!"] },
      { args: [5], expected: [5, 4, 3, 2, 1, "GO!"] }
    ]
  },
  {
    id: 9,
    slug: "sort-volcano",
    name: "Sort Volcano",
    theme: "volcano",
    color: "#f97316",
    icon: "flag",
    topic: "Sorting arrays",
    xp: 500,
    blurb: "Lava-hot leaderboards. Put scores in order without burning the original.",
    lesson: [
      { p: "<code>.sort()</code> puts an array in order — but by default it sorts like <b>text</b>, so <code>100</code> comes before <code>25</code>! Give it a compare function to sort numbers." },
      { code: "[100, 25, 3].sort();               // [100, 25, 3]  oops\n[100, 25, 3].sort((a, b) => a - b); // [3, 25, 100]" },
      { p: "<code>.sort()</code> also changes the original array. Make a copy first with the spread operator <code>[...arr]</code> so the original stays safe." },
      { code: "const scores = [9, 4, 7];\nconst sorted = [...scores].sort((a, b) => a - b);\n// sorted is [4, 7, 9], scores is still [9, 4, 7]" }
    ],
    task: "Write <code>sortScores(scores)</code> that returns a new array of the numbers sorted from lowest to highest. <code>sortScores([100, 25, 3, 7])</code> returns <code>[3, 7, 25, 100]</code>.",
    fn: "sortScores",
    starter: "function sortScores(scores) {\n  // Copy the array, then sort numbers from low to high\n  \n}\n",
    hint: "<code>return [...scores].sort((a, b) =&gt; a - b);</code>",
    tests: [
      { args: [[10, 2, 33]], expected: [2, 10, 33] },
      { args: [[100, 25, 3, 7]], expected: [3, 7, 25, 100] },
      { args: [[]], expected: [] },
      { args: [[5, 5, 1]], expected: [1, 5, 5] }
    ]
  },
  {
    id: 10,
    slug: "star-citadel",
    name: "Star Citadel",
    theme: "space",
    color: "#c084fc",
    icon: "crown",
    topic: "Final boss — everything",
    xp: 600,
    blurb: "The final boss floats among the stars. Use every skill you've learned to win.",
    lesson: [
      { p: "This is it — the <b>final boss</b>. You'll need arrays, objects, loops and if-statements all at once." },
      { code: "const players = [\n  { name: \"Ada\", xp: 120 },\n  { name: \"Lin\", xp: 300 }\n];\nplayers[1].name; // \"Lin\"" },
      { p: "To find the best item, keep track of the <b>best so far</b>. Start with <code>null</code>, then replace it whenever you find something better. Use <code>&gt;</code> (not <code>&gt;=</code>) so that on a tie the first one wins." },
      { code: "let best = null;\nfor (const p of players) {\n  if (best === null || p.xp > best.xp) {\n    best = p;\n  }\n}" }
    ],
    task: "Write <code>topPlayer(players)</code> that returns the <b>name</b> of the player with the most <code>xp</code>. On a tie, return the first one. If the array is empty, return <code>null</code>.",
    fn: "topPlayer",
    starter: "function topPlayer(players) {\n  // Track the best player so far\n  \n}\n",
    hint: "Use the pattern from the lesson, then finish with <code>return best === null ? null : best.name;</code>",
    tests: [
      { args: [[{ name: "Ada", xp: 120 }, { name: "Lin", xp: 300 }, { name: "Max", xp: 90 }]], expected: "Lin" },
      { args: [[]], expected: null },
      { args: [[{ name: "Solo", xp: 1 }]], expected: "Solo" },
      { args: [[{ name: "A", xp: 50 }, { name: "B", xp: 50 }]], expected: "A" },
      { args: [[{ name: "Neg", xp: -5 }, { name: "Zero", xp: 0 }]], expected: "Zero" }
    ]
  }
];

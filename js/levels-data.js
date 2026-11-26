/* The five Bitwood levels — each one teaches a JavaScript idea and ends with a coding challenge. */
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
    topic: "Objects — boss level",
    xp: 300,
    blurb: "The final boss guards a treasure room. Count the loot with objects.",
    lesson: [
      { p: "An <b>object</b> groups related values under names called <b>keys</b>. Read a value with a dot: <code>item.price</code>." },
      { code: "const potion = { name: \"potion\", price: 5, qty: 2 };\npotion.name;   // \"potion\"\npotion.price * potion.qty; // 10" },
      { p: "Real inventories are <b>arrays of objects</b>. Loop through them and combine what you learned in every level so far." },
      { code: "const loot = [\n  { name: \"potion\", price: 5, qty: 2 },\n  { name: \"sword\", price: 30, qty: 1 }\n];\nfor (const item of loot) {\n  console.log(item.name, item.qty);\n}" }
    ],
    task: "Boss fight! Write <code>lootValue(inventory)</code> that returns the total value of an array of items, where each item is worth <code>price * qty</code>.",
    fn: "lootValue",
    starter: "function lootValue(inventory) {\n  // Add up price * qty for every item\n  \n}\n",
    hint: "Keep a <code>let total = 0;</code>, loop with <code>for (const item of inventory)</code>, add <code>item.price * item.qty</code>, then <code>return total;</code>",
    tests: [
      { args: [[{ name: "potion", price: 5, qty: 2 }, { name: "sword", price: 30, qty: 1 }]], expected: 40 },
      { args: [[]], expected: 0 },
      { args: [[{ name: "gem", price: 12, qty: 3 }]], expected: 36 },
      { args: [[{ name: "map", price: 0, qty: 9 }, { name: "crown", price: 100, qty: 1 }]], expected: 100 }
    ]
  }
];

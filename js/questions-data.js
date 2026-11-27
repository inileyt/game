/* Five questions per level: three quiz questions + a warm-up coding task + the level's main
   coding challenge (defined in levels-data.js). Order: quiz, quiz, code, quiz, main code. */
(function () {
  "use strict";
  const EXTRA = {
    1: {
      quiz: [
        { q: "Which keyword makes a variable that can never be given a new value?", options: ["let", "const", "var", "change"], answer: 1,
          explain: "<code>const</code> means constant — once packed, it stays the same. Use <code>let</code> when the value will change." },
        { q: "What does this print?", code: 'const a = "Pix";\nconst b = "el";\nconsole.log(a + b);', options: ['"Pix el"', '"Pixel"', '"a + b"', '"PixEl"'], answer: 1,
          explain: "<code>+</code> glues two strings together with nothing in between: <code>\"Pix\" + \"el\"</code> is <code>\"Pixel\"</code>." },
        { q: "What is the value of <code>coins</code> at the end?", code: "let coins = 3;\ncoins = coins + 4;", options: ["3", "4", "7", "34"], answer: 2,
          explain: "The right side is worked out first: <code>3 + 4</code> is <code>7</code>, then it is stored back in <code>coins</code>." }
      ],
      warmup: {
        title: "Name tag",
        task: "Write <code>fullName(first, last)</code> that returns the first and last name with one space between them. <code>fullName(\"Ada\", \"Lovelace\")</code> returns <code>\"Ada Lovelace\"</code>.",
        fn: "fullName",
        starter: "function fullName(first, last) {\n  // Join first and last with a space\n  \n}\n",
        hint: "<code>return first + \" \" + last;</code> or <code>return `${first} ${last}`;</code>",
        tests: [
          { args: ["Ada", "Lovelace"], expected: "Ada Lovelace" },
          { args: ["Grace", "Hopper"], expected: "Grace Hopper" },
          { args: ["Pixel", "Hero"], expected: "Pixel Hero" }
        ]
      }
    },
    2: {
      quiz: [
        { q: "How many times does this loop run?", code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}", options: ["2", "3", "4", "Forever"], answer: 1,
          explain: "It prints 0, 1 and 2. When <code>i</code> becomes 3, <code>i &lt; 3</code> is false and the loop stops — 3 runs." },
        { q: "What does <code>i++</code> do?", options: ["Adds 1 to i", "Multiplies i by 2", "Resets i to 0", "Prints i"], answer: 0,
          explain: "<code>i++</code> is a shortcut for <code>i = i + 1</code>." },
        { q: "What does this print?", code: "let t = 0;\nfor (let i = 1; i <= 3; i++) {\n  t += i;\n}\nconsole.log(t);", options: ["3", "5", "6", "123"], answer: 2,
          explain: "<code>t</code> becomes 0 + 1 + 2 + 3 = <code>6</code>. <code>t += i</code> means <code>t = t + i</code>." }
      ],
      warmup: {
        title: "Echo chant",
        task: "Write <code>repeatWord(word, n)</code> that returns the word repeated <code>n</code> times with nothing in between. <code>repeatWord(\"ha\", 3)</code> returns <code>\"hahaha\"</code>.",
        fn: "repeatWord",
        starter: "function repeatWord(word, n) {\n  let result = \"\";\n  // Add word to result n times\n  \n  return result;\n}\n",
        hint: "<code>for (let i = 0; i &lt; n; i++) { result += word; }</code>",
        tests: [
          { args: ["ha", 3], expected: "hahaha" },
          { args: ["Go", 2], expected: "GoGo" },
          { args: ["x", 0], expected: "" },
          { args: ["pixel", 1], expected: "pixel" }
        ]
      }
    },
    3: {
      quiz: [
        { q: "What is <code>10 % 4</code>?", options: ["2", "2.5", "4", "0"], answer: 0,
          explain: "4 fits into 10 two times (8) and <b>2</b> is left over. <code>%</code> gives the remainder." },
        { q: "What does this print?", code: 'const hp = 0;\nif (hp > 0) {\n  console.log("alive");\n} else {\n  console.log("game over");\n}', options: ['"alive"', '"game over"', "Both", "Nothing"], answer: 1,
          explain: "<code>0 &gt; 0</code> is false, so the <code>else</code> part runs." },
        { q: "Which one checks that <code>a</code> is exactly equal to <code>b</code>?", options: ["a = b", "a === b", "a => b", "a !== b"], answer: 1,
          explain: "<code>===</code> compares. A single <code>=</code> stores a value, and <code>!==</code> means \"not equal\"." }
      ],
      warmup: {
        title: "Even or odd?",
        task: "Write <code>isEven(n)</code> that returns <code>true</code> if <code>n</code> is even and <code>false</code> if it is odd.",
        fn: "isEven",
        starter: "function isEven(n) {\n  // An even number has remainder 0 when divided by 2\n  \n}\n",
        hint: "<code>return n % 2 === 0;</code>",
        tests: [
          { args: [4], expected: true },
          { args: [7], expected: false },
          { args: [0], expected: true },
          { args: [-2], expected: true }
        ]
      }
    },
    4: {
      quiz: [
        { q: "What is <code>bag[1]</code>?", code: 'const bag = ["sword", "shield", "potion"];', options: ['"sword"', '"shield"', '"potion"', "undefined"], answer: 1,
          explain: "Indexes start at 0, so <code>bag[0]</code> is \"sword\" and <code>bag[1]</code> is \"shield\"." },
        { q: "What is <code>[4, 8, 15].length</code>?", options: ["2", "3", "15", "27"], answer: 1,
          explain: "<code>.length</code> counts the items — there are 3." },
        { q: "Which method adds an item to the <b>end</b> of an array?", options: [".push()", ".pop()", ".shift()", ".length"], answer: 0,
          explain: "<code>.push()</code> adds to the end. <code>.pop()</code> removes the last item." }
      ],
      warmup: {
        title: "Last in line",
        task: "Write <code>lastItem(arr)</code> that returns the last item of an array. <code>lastItem([1, 2, 3])</code> returns <code>3</code>.",
        fn: "lastItem",
        starter: "function lastItem(arr) {\n  // The last index is arr.length - 1\n  \n}\n",
        hint: "<code>return arr[arr.length - 1];</code>",
        tests: [
          { args: [[1, 2, 3]], expected: 3 },
          { args: [["a"]], expected: "a" },
          { args: [["coin", "gem"]], expected: "gem" }
        ]
      }
    },
    5: {
      quiz: [
        { q: "What is <code>hero.hp</code>?", code: 'const hero = { name: "Ada", hp: 10 };', options: ['"hp"', "10", '"Ada"', "undefined"], answer: 1,
          explain: "The dot reads the value stored under the key <code>hp</code>, which is <code>10</code>." },
        { q: "How do you give <code>hero</code> a new key <code>level</code> with the value 2?", options: ["hero.level = 2;", "hero[level] 2;", "level.hero = 2;", "hero + level = 2;"], answer: 0,
          explain: "Assigning to a new key with a dot creates it: <code>hero.level = 2;</code>" },
        { q: "What does <code>Object.keys({ a: 1, b: 2 })</code> give you?", options: ['["a", "b"]', "[1, 2]", "2", "{ a, b }"], answer: 0,
          explain: "<code>Object.keys</code> returns an array of the key names." }
      ],
      warmup: {
        title: "Hero card",
        task: "Write <code>describe(hero)</code> that returns a sentence like <code>\"Ada has 10 HP\"</code> using <code>hero.name</code> and <code>hero.hp</code>.",
        fn: "describe",
        starter: "function describe(hero) {\n  // Use hero.name and hero.hp\n  \n}\n",
        hint: "<code>return `${hero.name} has ${hero.hp} HP`;</code>",
        tests: [
          { args: [{ name: "Ada", hp: 10 }], expected: "Ada has 10 HP" },
          { args: [{ name: "Max", hp: 0 }], expected: "Max has 0 HP" },
          { args: [{ name: "Lin", hp: 99 }], expected: "Lin has 99 HP" }
        ]
      }
    },
    6: {
      quiz: [
        { q: "What is <code>triple(4)</code>?", code: "const triple = n => n * 3;", options: ["7", "12", "34", "43"], answer: 1,
          explain: "The arrow function returns <code>n * 3</code>, so <code>4 * 3 = 12</code>." },
        { q: "What does <code>.map()</code> give back?", options: ["A new array", "The same array, changed", "A single number", "Nothing"], answer: 0,
          explain: "<code>.map()</code> builds a brand-new array and leaves the original alone." },
        { q: "What is the result?", code: "[1, 2, 3].filter(n => n > 1)", options: ["[1]", "[2, 3]", "[true, true]", "2"], answer: 1,
          explain: "<code>.filter()</code> keeps only the items where the test is true: 2 and 3." }
      ],
      warmup: {
        title: "Word lengths",
        task: "Write <code>lengths(words)</code> that returns a new array with the length of each word. <code>lengths([\"hi\", \"code\"])</code> returns <code>[2, 4]</code>.",
        fn: "lengths",
        starter: "function lengths(words) {\n  // Use map to turn each word into its length\n  \n}\n",
        hint: "<code>return words.map(w =&gt; w.length);</code>",
        tests: [
          { args: [["hi", "code"]], expected: [2, 4] },
          { args: [[]], expected: [] },
          { args: [["pixel"]], expected: [5] }
        ]
      }
    },
    7: {
      quiz: [
        { q: "What is <code>\"Bitwood\".length</code>?", options: ["6", "7", "8", '"Bitwood"'], answer: 1,
          explain: "B-i-t-w-o-o-d is 7 letters." },
        { q: "What is <code>\"hello\".toUpperCase()</code>?", options: ['"Hello"', '"HELLO"', '"hello"', '"hELLO"'], answer: 1,
          explain: "<code>.toUpperCase()</code> turns every letter into a capital." },
        { q: "What is <code>\"a-b-c\".split(\"-\")</code>?", options: ['"abc"', '["a", "b", "c"]', '["a-b-c"]', "3"], answer: 1,
          explain: "<code>.split(\"-\")</code> cuts the string at every dash and gives back an array." }
      ],
      warmup: {
        title: "Initials",
        task: "Write <code>initials(name)</code> that returns the first letter of every word, joined together. <code>initials(\"Ada Lovelace\")</code> returns <code>\"AL\"</code>.",
        fn: "initials",
        starter: "function initials(name) {\n  // Split into words, take the first letter of each\n  \n}\n",
        hint: "<code>return name.split(\" \").map(w =&gt; w[0]).join(\"\");</code>",
        tests: [
          { args: ["Ada Lovelace"], expected: "AL" },
          { args: ["Grace Brewster Hopper"], expected: "GBH" },
          { args: ["Pixel"], expected: "P" }
        ]
      }
    },
    8: {
      quiz: [
        { q: "When does a <code>while</code> loop stop?", options: ["When its condition becomes false", "After 10 runs", "When it prints something", "Never"], answer: 0,
          explain: "It checks the condition before every run and stops as soon as it is false." },
        { q: "What does this print?", code: "let n = 1;\nwhile (n < 20) {\n  n = n * 2;\n}\nconsole.log(n);", options: ["16", "20", "32", "64"], answer: 2,
          explain: "n goes 1 → 2 → 4 → 8 → 16 → 32. At 32, <code>n &lt; 20</code> is false, so it stops." },
        { q: "What does this print?", code: "let c = 3;\nwhile (c > 0) {\n  c--;\n}\nconsole.log(c);", options: ["0", "1", "3", "-1"], answer: 0,
          explain: "c goes 3 → 2 → 1 → 0, then <code>0 &gt; 0</code> is false." }
      ],
      warmup: {
        title: "Halve it",
        task: "Write <code>stepsToOne(n)</code>: while <code>n</code> is bigger than 1, divide it by 2 and count the steps. Return the count. <code>stepsToOne(8)</code> returns <code>3</code> (8 → 4 → 2 → 1).",
        fn: "stepsToOne",
        starter: "function stepsToOne(n) {\n  let steps = 0;\n  // While n > 1: halve n and add 1 to steps\n  \n  return steps;\n}\n",
        hint: "<code>while (n &gt; 1) { n = n / 2; steps++; }</code>",
        tests: [
          { args: [8], expected: 3 },
          { args: [1], expected: 0 },
          { args: [2], expected: 1 },
          { args: [64], expected: 6 }
        ]
      }
    },
    9: {
      quiz: [
        { q: "What is the result?", code: "[3, 1, 2].sort((a, b) => a - b)", options: ["[3, 2, 1]", "[1, 2, 3]", "[3, 1, 2]", "[1, 3, 2]"], answer: 1,
          explain: "<code>a - b</code> sorts numbers from lowest to highest." },
        { q: "Which compare function sorts from <b>highest</b> to lowest?", options: ["(a, b) => a - b", "(a, b) => b - a", "() => 0", "(a, b) => a + b"], answer: 1,
          explain: "Swap them: <code>b - a</code> puts bigger numbers first." },
        { q: "What is <code>copy</code>?", code: "const arr = [5, 6];\nconst copy = [...arr];", options: ["A new array with the same items", "The very same array", "A string", "An empty array"], answer: 0,
          explain: "The spread <code>...</code> copies the items into a brand-new array." }
      ],
      warmup: {
        title: "Podium",
        task: "Write <code>topThree(scores)</code> that returns the three highest scores, highest first. <code>topThree([5, 1, 9, 7, 3])</code> returns <code>[9, 7, 5]</code>.",
        fn: "topThree",
        starter: "function topThree(scores) {\n  // Copy, sort from high to low, keep the first 3\n  \n}\n",
        hint: "<code>return [...scores].sort((a, b) =&gt; b - a).slice(0, 3);</code>",
        tests: [
          { args: [[5, 1, 9, 7, 3]], expected: [9, 7, 5] },
          { args: [[10, 20, 30]], expected: [30, 20, 10] },
          { args: [[4, 4, 8, 1]], expected: [8, 4, 4] }
        ]
      }
    },
    10: {
      quiz: [
        { q: "What is the result?", code: 'const p = { name: "Lin", xp: 300 };\np.xp > 100 ? "pro" : "rookie"', options: ['"pro"', '"rookie"', "true", "300"], answer: 0,
          explain: "<code>condition ? a : b</code> is a mini if/else. 300 &gt; 100 is true, so you get \"pro\"." },
        { q: "What is the result?", code: "[1, 2, 3].reduce((sum, n) => sum + n, 0)", options: ["0", "3", "6", "123"], answer: 2,
          explain: "<code>.reduce</code> carries a running total: 0 + 1 + 2 + 3 = 6." },
        { q: "Which value means \"nothing here, on purpose\"?", options: ["null", "0", '""', "false"], answer: 0,
          explain: "<code>null</code> is the empty value you set on purpose. 0, \"\" and false are real values." }
      ],
      warmup: {
        title: "Team XP",
        task: "Write <code>totalXP(players)</code> that adds up the <code>xp</code> of every player. An empty team has <code>0</code> XP.",
        fn: "totalXP",
        starter: "function totalXP(players) {\n  // Add up p.xp for every player\n  \n}\n",
        hint: "<code>let t = 0; for (const p of players) { t += p.xp; } return t;</code>",
        tests: [
          { args: [[{ name: "A", xp: 5 }, { name: "B", xp: 7 }]], expected: 12 },
          { args: [[]], expected: 0 },
          { args: [[{ name: "Solo", xp: 300 }]], expected: 300 }
        ]
      }
    }
  };

  window.BITWOOD_LEVELS.forEach(lv => {
    const ex = EXTRA[lv.id];
    const main = { type: "code", title: "Level challenge", task: lv.task, fn: lv.fn, starter: lv.starter, hint: lv.hint, tests: lv.tests, slug: lv.slug };
    const warm = Object.assign({ type: "code", slug: lv.slug + "-warmup" }, ex.warmup);
    const quiz = ex.quiz.map(q => Object.assign({ type: "quiz" }, q));
    lv.questions = [quiz[0], quiz[1], warm, quiz[2], main];
  });
})();

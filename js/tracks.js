/* Language tracks: JavaScript (levels 1–10), Go (11–15) and PHP (16–20).
   Go and PHP code can't run inside a browser, so their questions are quizzes,
   fill-in-the-blank code (⟦n⟧ marks blank n) and "build the program" line puzzles. */
(function () {
  "use strict";

  const TRACKS = [
    { id: "js", name: "JavaScript", short: "JS", color: "#facc15", icon: "scroll", first: 1, last: 10,
      blurb: "The language of the web. Ten worlds from variables to a final boss.", topics: "variables, loops, conditions, arrays, objects, strings and sorting in JavaScript" },
    { id: "go", name: "Go", short: "GO", color: "#00add8", icon: "gem", first: 11, last: 15,
      blurb: "A fast, simple language made at Google. Five worlds for beginners.", topics: "printing, variables, if and for, functions and slices in Go" },
    { id: "php", name: "PHP", short: "PHP", color: "#a78bfa", icon: "potion", first: 16, last: 20,
      blurb: "The language behind many websites. Five worlds for beginners.", topics: "echo, variables, conditions and loops, functions and arrays in PHP" }
  ];

  const L = window.BITWOOD_LEVELS;
  L.forEach(lv => { if (!lv.track) { lv.track = "js"; lv.lang = "js"; } });

  const GO = [
    {
      id: 11, slug: "hello-go", name: "Hello, Go", theme: "rapids", color: "#00add8", icon: "flag", topic: "Your first Go program", xp: 120,
      blurb: "Every Go adventure starts with package main and a big hello.",
      lesson: [
        { p: "Every Go program starts with <code>package main</code> and a function called <code>main</code> — that is where the program begins. To print text, <code>import</code> the <code>fmt</code> package and call <code>fmt.Println</code>." },
        { code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, Bitwood!\")\n}" },
        { p: "<code>Println</code> prints its values and then moves to a new line. Give it several values separated by commas and Go puts a space between them." },
        { code: "fmt.Println(\"Coins:\", 5)  // Coins: 5\nfmt.Println(\"Level\", 1)   // Level 1" }
      ],
      questions: [
        { type: "quiz", q: "Where does a Go program start running?", options: ["func main()", "func start()", "import \"fmt\"", "The first line of the file"], answer: 0,
          explain: "Go always starts in <code>func main()</code> inside <code>package main</code>." },
        { type: "quiz", q: "What does this print?", code: "fmt.Println(\"Level\", 1)", options: ["Level1", "Level 1", "\"Level\" 1", "Level, 1"], answer: 1,
          explain: "<code>Println</code> puts a space between the values: <code>Level 1</code>." },
        { type: "fill", title: "Say hello", task: "Fill in the blanks so the program prints <code>Hello, Go!</code>",
          code: "package ⟦0⟧\n\nimport \"fmt\"\n\nfunc ⟦1⟧() {\n\tfmt.⟦2⟧(\"Hello, Go!\")\n}",
          blanks: [["main"], ["main"], ["Println"]], output: "Hello, Go!", hint: "The package and the function are both called <code>main</code>, and the print function is <code>Println</code>." },
        { type: "order", title: "Build the program", task: "Put the lines in the right order to build a program that prints <code>Ready, player one!</code>",
          lines: ["package main", "import \"fmt\"", "func main() {", "    fmt.Println(\"Ready, player one!\")", "}"], output: "Ready, player one!",
          hint: "Package first, then imports, then <code>func main() {</code>, the print, and the closing brace." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints exactly these two lines.",
          code: "package main\n\nimport ⟦0⟧\n\nfunc main() {\n\tfmt.Println(\"Hero:\", ⟦1⟧)\n\tfmt.⟦2⟧(\"Coins:\", 3)\n}",
          blanks: [["\"fmt\""], ["\"Ada\""], ["Println"]], output: "Hero: Ada\nCoins: 3", hint: "Package names and text go in double quotes: <code>\"fmt\"</code> and <code>\"Ada\"</code>." }
      ]
    },
    {
      id: 12, slug: "go-variables", name: "Gopher Grove", theme: "village", color: "#4ade80", icon: "scroll", topic: "Variables & types", xp: 150,
      blurb: "Pack your values with var and the magic := operator.",
      lesson: [
        { p: "Go variables have a <b>type</b>: <code>int</code> for whole numbers, <code>float64</code> for decimals, <code>string</code> for text and <code>bool</code> for true/false. Declare one with <code>var</code>, or let Go figure out the type with <code>:=</code>." },
        { code: "var name string = \"Ada\"\nvar coins int = 3\nlevel := 1           // Go knows this is an int\ncoins = coins + 2    // now 5" },
        { p: "Use <code>:=</code> only the first time you create a variable. After that, change it with a plain <code>=</code>." },
        { code: "hp := 10\nhp = hp - 3\nfmt.Println(hp)  // 7" }
      ],
      questions: [
        { type: "quiz", q: "What does <code>:=</code> do in Go?", options: ["Creates a new variable and sets its value", "Compares two values", "Prints a value", "Deletes a variable"], answer: 0,
          explain: "<code>name := value</code> declares a new variable and Go works out its type." },
        { type: "quiz", q: "What does this print?", code: "coins := 3\ncoins = coins * 2\nfmt.Println(coins)", options: ["3", "5", "6", "32"], answer: 2,
          explain: "<code>3 * 2</code> is 6, stored back in <code>coins</code>." },
        { type: "fill", title: "Hero stats", task: "Fill in the blanks so the program prints <code>Pixel 3</code>",
          code: "name ⟦0⟧ \"Pixel\"\nvar lives ⟦1⟧ = 3\nfmt.Println(name, lives)",
          blanks: [[":="], ["int"]], output: "Pixel 3", hint: "Create <code>name</code> with <code>:=</code>. <code>lives</code> holds a whole number, so its type is <code>int</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>Score: 15</code>",
          lines: ["package main", "import \"fmt\"", "func main() {", "    score := 10", "    score = score + 5", "    fmt.Println(\"Score:\", score)", "}"], output: "Score: 15",
          hint: "A variable must be created before you change it, and changed before you print it." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints <code>Lin has 150 XP</code>",
          code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar hero ⟦0⟧ = \"Lin\"\n\txp ⟦1⟧ 100\n\txp = xp ⟦2⟧ 50\n\tfmt.Println(hero, \"has\", xp, \"XP\")\n}",
          blanks: [["string"], [":="], ["+"]], output: "Lin has 150 XP", hint: "Text has the type <code>string</code>, a new variable uses <code>:=</code>, and 100 → 150 means adding." }
      ]
    },
    {
      id: 13, slug: "go-if-for", name: "Frost Loop Peaks", theme: "snow", color: "#7dd3fc", icon: "sword", topic: "If & for", xp: 180,
      blurb: "Make choices with if, and repeat with Go's only loop: for.",
      lesson: [
        { p: "In Go, <code>if</code> needs no parentheses around the condition, but the curly braces are required." },
        { code: "hp := 0\nif hp > 0 {\n\tfmt.Println(\"alive\")\n} else {\n\tfmt.Println(\"game over\")\n}" },
        { p: "Go has just <b>one</b> loop keyword: <code>for</code>. The classic version has a start, a condition and a step." },
        { code: "for i := 1; i <= 3; i++ {\n\tfmt.Println(\"Step\", i)\n}\n// Step 1, Step 2, Step 3" }
      ],
      questions: [
        { type: "quiz", q: "How many loop keywords does Go have?", options: ["One: for", "Two: for and while", "Three: for, while and do", "None"], answer: 0,
          explain: "Go keeps it simple — every loop is written with <code>for</code>." },
        { type: "quiz", q: "What does this print?", code: "for i := 0; i < 3; i++ {\n\tfmt.Println(i)\n}", options: ["1, 2, 3 (one per line)", "0, 1, 2 (one per line)", "0, 1, 2, 3 (one per line)", "Nothing"], answer: 1,
          explain: "It starts at 0 and stops when <code>i &lt; 3</code> is false, so it prints 0, 1 and 2." },
        { type: "fill", title: "Shop keeper", task: "Fill in the blanks so the program prints <code>You can buy a sword!</code>",
          code: "coins := 7\n⟦0⟧ coins >= 5 {\n\tfmt.Println(\"You can buy a sword!\")\n} ⟦1⟧ {\n\tfmt.Println(\"Keep collecting!\")\n}",
          blanks: [["if"], ["else"]], output: "You can buy a sword!", hint: "Choose with <code>if</code> … <code>else</code>." },
        { type: "order", title: "Build the countdown", task: "Order the lines so the program prints 3, 2, 1 and then <code>GO!</code>",
          lines: ["package main", "import \"fmt\"", "func main() {", "    for i := 3; i >= 1; i-- {", "        fmt.Println(i)", "    }", "    fmt.Println(\"GO!\")", "}"], output: "3\n2\n1\nGO!",
          hint: "The number is printed inside the loop; <code>GO!</code> is printed once, after the loop's closing brace." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program adds 1 + 2 + 3 + 4 + 5 and prints <code>15</code>",
          code: "total := 0\nfor i := 1; i ⟦0⟧ 5; i⟦1⟧ {\n\ttotal ⟦2⟧ i\n}\nfmt.Println(total)",
          blanks: [["<="], ["++"], ["+="]], output: "15", hint: "Loop while <code>i &lt;= 5</code>, step with <code>i++</code>, and add with <code>total += i</code>." }
      ]
    },
    {
      id: 14, slug: "go-functions", name: "Func Dunes", theme: "desert", color: "#fbbf24", icon: "potion", topic: "Functions", xp: 210,
      blurb: "Write your own spells with func — Go can even return two values!",
      lesson: [
        { p: "Make a function with <code>func</code>, its name, the parameters <b>with their types</b>, and the type of the value it returns after the parentheses." },
        { code: "func add(a int, b int) int {\n\treturn a + b\n}\n\nfmt.Println(add(2, 3))  // 5" },
        { p: "Go functions can return <b>more than one</b> value. Put the return types in parentheses and catch them with <code>:=</code>." },
        { code: "func split(total int) (int, int) {\n\treturn total / 2, total % 2\n}\n\nhalf, rest := split(7)\nfmt.Println(half, rest)  // 3 1" }
      ],
      questions: [
        { type: "quiz", q: "In <code>func double(n int) int</code>, what does the last <code>int</code> mean?", options: ["The type of the value it returns", "The name of the function", "A second parameter", "Nothing — it's optional decoration"], answer: 0,
          explain: "The type after the parentheses is the <b>return type</b>." },
        { type: "quiz", q: "What does this print?", code: "func greet(name string) string {\n\treturn \"Hi, \" + name\n}\n\nfmt.Println(greet(\"Go\"))", options: ["Hi, Go", "Hi, name", "greet(\"Go\")", "Hi,Go"], answer: 0,
          explain: "<code>\"Hi, \" + \"Go\"</code> is <code>Hi, Go</code>." },
        { type: "fill", title: "Triple strike", task: "Fill in the blanks so the program prints <code>12</code>",
          code: "func triple(n int) ⟦0⟧ {\n\t⟦1⟧ n * 3\n}\n\nfmt.Println(triple(4))",
          blanks: [["int"], ["return"]], output: "12", hint: "It gives back a whole number (<code>int</code>) with <code>return</code>." },
        { type: "order", title: "Build the program", task: "Order the lines: put the <code>square</code> function first, then <code>main</code>. It prints <code>36</code>.",
          lines: ["package main", "import \"fmt\"", "func square(n int) int {", "    return n * n", "}", "func main() {", "    fmt.Println(square(6))", "}"], output: "36",
          hint: "Each function starts with <code>func … {</code> and ends with <code>}</code>." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so <code>minMax</code> returns the smaller and the bigger number and the program prints <code>4 9</code>",
          code: "func minMax(a int, b int) (⟦0⟧, int) {\n\tif a < b {\n\t\treturn a, b\n\t}\n\treturn ⟦1⟧, a\n}\n\nfunc main() {\n\tlow, high ⟦2⟧ minMax(9, 4)\n\tfmt.Println(low, high)\n}",
          blanks: [["int"], ["b"], [":="]], output: "4 9", hint: "Both return values are <code>int</code>. When <code>a</code> is bigger, the small one is <code>b</code>. Catch two new values with <code>:=</code>." }
      ]
    },
    {
      id: 15, slug: "go-slices", name: "Slice Nebula", theme: "space", color: "#c084fc", icon: "crown", topic: "Slices & range — boss", xp: 260,
      blurb: "The Go boss floats in space. Tame it with slices, append and range.",
      lesson: [
        { p: "A <b>slice</b> is a list of values of the same type. Write the type with <code>[]</code> in front. <code>append</code> adds items and <code>len</code> counts them." },
        { code: "bag := []string{\"sword\", \"shield\"}\nbag = append(bag, \"potion\")\nfmt.Println(len(bag))  // 3\nfmt.Println(bag[0])    // sword" },
        { p: "Loop over a slice with <code>for … range</code>. Each turn gives you the index and the value — use <code>_</code> to skip the one you don't need." },
        { code: "for i, item := range bag {\n\tfmt.Println(i, item)\n}\nfor _, item := range bag {\n\tfmt.Println(item)\n}" }
      ],
      questions: [
        { type: "quiz", q: "What does <code>append(bag, \"potion\")</code> do?", options: ["Adds \"potion\" to the end and gives back the new slice", "Removes the last item", "Sorts the slice", "Prints the slice"], answer: 0,
          explain: "<code>append</code> returns the slice with the new item at the end — store it back: <code>bag = append(bag, …)</code>." },
        { type: "quiz", q: "What does this print?", code: "scores := []int{4, 8, 15}\nfmt.Println(len(scores), scores[1])", options: ["3 8", "3 4", "15 8", "2 8"], answer: 0,
          explain: "There are 3 items, and index 1 is the second one: 8." },
        { type: "fill", title: "Gem counter", task: "Fill in the blanks so the program adds up the gems and prints <code>35</code>",
          code: "gems := ⟦0⟧{5, 10, 20}\ntotal := 0\nfor _, g := ⟦1⟧ gems {\n\ttotal += g\n}\nfmt.Println(total)",
          blanks: [["[]int"], ["range"]], output: "35", hint: "A slice of whole numbers is <code>[]int</code>, and you loop over it with <code>range</code>." },
        { type: "order", title: "Build the party", task: "Order the lines so the program prints <code>2 [Ada Lin]</code>",
          lines: ["package main", "import \"fmt\"", "func main() {", "    party := []string{\"Ada\"}", "    party = append(party, \"Lin\")", "    fmt.Println(len(party), party)", "}"], output: "2 [Ada Lin]",
          hint: "Create the slice, append to it, then print." },
        { type: "fill", title: "Boss fight!", task: "Fill in the blanks so <code>countLong</code> counts the words longer than 4 letters. The program prints <code>2</code>.",
          code: "func countLong(words []string) int {\n\tcount := 0\n\tfor _, w := range words {\n\t\tif ⟦0⟧(w) > 4 {\n\t\t\tcount⟦1⟧\n\t\t}\n\t}\n\treturn ⟦2⟧\n}\n\nfunc main() {\n\tfmt.Println(countLong([]string{\"go\", \"pixel\", \"castle\"}))\n}",
          blanks: [["len"], ["++"], ["count"]], output: "2", hint: "<code>len(w)</code> counts letters, <code>count++</code> adds one, and you return <code>count</code>." }
      ]
    }
  ];

  const PHP = [
    {
      id: 16, slug: "hello-php", name: "Echo Keep", theme: "castle", color: "#a78bfa", icon: "flag", topic: "Your first PHP program", xp: 120,
      blurb: "Open the castle gate with <?php and make your first echo.",
      lesson: [
        { p: "PHP code lives after the <code>&lt;?php</code> tag. Print text with <code>echo</code>, and end every statement with a semicolon <code>;</code>." },
        { code: "<?php\necho \"Hello, Bitwood!\";" },
        { p: "Join pieces of text with a dot <code>.</code> — and <code>\"\\n\"</code> starts a new line." },
        { code: "echo \"Coins: \" . 5;  // Coins: 5\necho \"\\n\";           // new line" }
      ],
      questions: [
        { type: "quiz", q: "How does a PHP file start?", options: ["<?php", "<php>", "#!php", "<script php>"], answer: 0,
          explain: "PHP code begins after the <code>&lt;?php</code> tag." },
        { type: "quiz", q: "What does this print?", code: "echo \"Lv\" . \"el\";", options: ["Lv el", "Level", "Lv.el", "\"Lv\" . \"el\""], answer: 1,
          explain: "The dot glues the two strings together: <code>Level</code>." },
        { type: "fill", title: "Say hello", task: "Fill in the blanks so the program prints <code>Hello, PHP!</code>",
          code: "⟦0⟧\n⟦1⟧ \"Hello, PHP!\"⟦2⟧",
          blanks: [["<?php"], ["echo"], [";"]], output: "Hello, PHP!", hint: "Start with <code>&lt;?php</code>, print with <code>echo</code>, end with <code>;</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>Ready, player one!</code>",
          lines: ["<?php", "echo \"Ready, \";", "echo \"player one!\";", "?>"], output: "Ready, player one!",
          hint: "Open with <code>&lt;?php</code>, close with <code>?&gt;</code>, and the two echoes print in order." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints exactly these two lines.",
          code: "<?php\n⟦0⟧ \"Hero: \" ⟦1⟧ \"Ada\";\necho \"\\n\";\necho \"Coins: \" . ⟦2⟧;",
          blanks: [["echo"], ["."], ["3"]], output: "Hero: Ada\nCoins: 3", hint: "Print with <code>echo</code>, join with <code>.</code>, and the coins are 3." }
      ]
    },
    {
      id: 17, slug: "php-variables", name: "Dollar Swamp", theme: "swamp", color: "#84cc16", icon: "scroll", topic: "Variables & strings", xp: 150,
      blurb: "In this swamp every variable carries a $. Learn to pack and glue values.",
      lesson: [
        { p: "PHP variables always start with a dollar sign <code>$</code>. You don't have to write the type — PHP works it out." },
        { code: "$hero = \"Ada\";\n$coins = 3;\n$coins = $coins + 2;  // now 5" },
        { p: "Glue strings with a dot. Inside <b>double</b> quotes PHP puts a variable's value right into the text — single quotes don't." },
        { code: "echo \"Hi, \" . $hero;  // Hi, Ada\necho \"Hi, $hero!\";     // Hi, Ada!\necho 'Hi, $hero!';     // Hi, $hero!" }
      ],
      questions: [
        { type: "quiz", q: "Which one is a correct PHP variable?", options: ["$score", "score$", "@score", "var score"], answer: 0,
          explain: "Every PHP variable starts with <code>$</code>." },
        { type: "quiz", q: "What does this print?", code: "$name = \"Lin\";\necho \"Hello, $name!\";", options: ["Hello, Lin!", "Hello, $name!", "Hello, name!", "An error"], answer: 0,
          explain: "Double quotes put the value of <code>$name</code> into the text." },
        { type: "fill", title: "Lose a life", task: "Fill in the blanks so the program prints <code>2</code>",
          code: "⟦0⟧lives = 3;\n$lives = $lives ⟦1⟧ 1;\necho $lives;",
          blanks: [["$"], ["-"]], output: "2", hint: "Variables start with <code>$</code>; going from 3 to 2 means subtracting." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>Score: 20</code>",
          lines: ["<?php", "$score = 10;", "$score = $score * 2;", "echo \"Score: \" . $score;"], output: "Score: 20",
          hint: "Create the score, double it, then print it." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints <code>Lin has 150 XP</code>",
          code: "<?php\n$hero = ⟦0⟧;\n$xp = 100;\n$xp ⟦1⟧ 50;\necho ⟦2⟧ . \" has $xp XP\";",
          blanks: [["\"Lin\"", "'Lin'"], ["+="], ["$hero"]], output: "Lin has 150 XP", hint: "Text goes in quotes (<code>\"Lin\"</code>), <code>+=</code> adds to a variable, and the name is in <code>$hero</code>." }
      ]
    },
    {
      id: 18, slug: "php-if-loops", name: "Branching Caverns", theme: "caves", color: "#c4b5fd", icon: "sword", topic: "If & loops", xp: 180,
      blurb: "Choose the right tunnel with if/elseif, then loop with for and foreach.",
      lesson: [
        { p: "<code>if</code>, <code>elseif</code> and <code>else</code> choose which code runs. In PHP the condition goes in parentheses." },
        { code: "$hp = 0;\nif ($hp > 0) {\n    echo \"alive\";\n} elseif ($hp == 0) {\n    echo \"game over\";\n} else {\n    echo \"glitch!\";\n}" },
        { p: "<code>for</code> repeats code a number of times; <code>foreach</code> walks through every item of an array." },
        { code: "for ($i = 1; $i <= 3; $i++) {\n    echo \"Step $i \";\n}\n// Step 1 Step 2 Step 3\n\nforeach ([\"sword\", \"shield\"] as $item) {\n    echo $item . \" \";\n}" }
      ],
      questions: [
        { type: "quiz", q: "Which keyword checks a second condition after <code>if</code>?", options: ["elseif", "elif", "otherwise", "orif"], answer: 0,
          explain: "PHP uses <code>elseif</code> (<code>elif</code> is Python)." },
        { type: "quiz", q: "What does this print?", code: "for ($i = 0; $i < 3; $i++) {\n    echo $i;\n}", options: ["012", "123", "0123", "333"], answer: 0,
          explain: "It echoes 0, 1 and 2 with nothing in between: <code>012</code>." },
        { type: "fill", title: "Shop keeper", task: "Fill in the blanks so the program prints <code>Buy a sword!</code>",
          code: "$coins = 7;\n⟦0⟧ ($coins >= 5) {\n    echo \"Buy a sword!\";\n} ⟦1⟧ {\n    echo \"Keep collecting!\";\n}",
          blanks: [["if"], ["else"]], output: "Buy a sword!", hint: "Choose with <code>if</code> … <code>else</code>." },
        { type: "order", title: "Build the loop", task: "Order the lines so the program prints <code>map key</code> (each item followed by a space).",
          lines: ["<?php", "$items = [\"map\", \"key\"];", "foreach ($items as $item) {", "    echo $item . \" \";", "}"], output: "map key ",
          hint: "Create the array before the loop, and the echo goes inside the braces." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program adds 1 + 2 + 3 + 4 + 5 and prints <code>15</code>",
          code: "$total = 0;\nfor ($i = 1; $i ⟦0⟧ 5; $i⟦1⟧) {\n    $total ⟦2⟧ $i;\n}\necho $total;",
          blanks: [["<="], ["++"], ["+="]], output: "15", hint: "Loop while <code>$i &lt;= 5</code>, step with <code>$i++</code>, add with <code>$total += $i</code>." }
      ]
    },
    {
      id: 19, slug: "php-functions", name: "Function Forge", theme: "volcano", color: "#f97316", icon: "potion", topic: "Functions", xp: 210,
      blurb: "Forge your own functions in lava — with default values too.",
      lesson: [
        { p: "Create a function with the <code>function</code> keyword. Parameters are variables, so they start with <code>$</code> too. Send a value back with <code>return</code>." },
        { code: "function add($a, $b) {\n    return $a + $b;\n}\n\necho add(2, 3);  // 5" },
        { p: "Parameters can have a <b>default value</b>, used when you leave them out." },
        { code: "function greet($name = \"hero\") {\n    return \"Hello, $name!\";\n}\n\necho greet();       // Hello, hero!\necho greet(\"Ada\");  // Hello, Ada!" }
      ],
      questions: [
        { type: "quiz", q: "Which keyword sends a value back from a function?", options: ["return", "echo", "give", "send"], answer: 0,
          explain: "<code>return</code> gives a value back. <code>echo</code> only prints it." },
        { type: "quiz", q: "What does this print?", code: "function double($n) {\n    return $n * 2;\n}\necho double(21);", options: ["42", "21", "2", "double(21)"], answer: 0,
          explain: "21 × 2 = 42." },
        { type: "fill", title: "Triple strike", task: "Fill in the blanks so the program prints <code>12</code>",
          code: "⟦0⟧ triple($n) {\n    ⟦1⟧ $n * 3;\n}\necho triple(4);",
          blanks: [["function"], ["return"]], output: "12", hint: "Start with <code>function</code> and give the value back with <code>return</code>." },
        { type: "order", title: "Build the program", task: "Order the lines: define the function first, then print <code>36</code>.",
          lines: ["<?php", "function square($n) {", "    return $n * $n;", "}", "echo square(6);"], output: "36",
          hint: "<code>function square($n) {</code>, the return line, the closing brace — then the echo." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so <code>cheer</code> has a default name and the program prints <code>Go, Ada!</code>",
          code: "function cheer(⟦0⟧ = \"hero\") {\n    return \"Go, \" ⟦1⟧ $name ⟦2⟧ \"!\";\n}\necho cheer(\"Ada\");",
          blanks: [["$name"], ["."], ["."]], output: "Go, Ada!", hint: "The parameter is <code>$name</code>, and strings are joined with dots." }
      ]
    },
    {
      id: 20, slug: "php-arrays", name: "Array Archive", theme: "forest", color: "#22c55e", icon: "crown", topic: "Arrays — boss", xp: 260,
      blurb: "The PHP boss guards an ancient archive. Unlock it with arrays and foreach.",
      lesson: [
        { p: "An <b>array</b> holds many values. <code>count()</code> tells you how many there are, and <code>[] =</code> adds a new item to the end." },
        { code: "$bag = [\"sword\", \"shield\"];\n$bag[] = \"potion\";\necho count($bag);  // 3\necho $bag[0];       // sword" },
        { p: "<b>Associative arrays</b> use names (keys) instead of numbers. Loop over keys and values with <code>foreach ($array as $key =&gt; $value)</code>." },
        { code: "$hero = [\"name\" => \"Ada\", \"hp\" => 10];\necho $hero[\"name\"];  // Ada\n\nforeach ($hero as $key => $value) {\n    echo \"$key: $value \";\n}" }
      ],
      questions: [
        { type: "quiz", q: "What does <code>count($bag)</code> give you?", options: ["The number of items", "The last item", "The first item", "The sum of the items"], answer: 0,
          explain: "<code>count()</code> counts the items in an array." },
        { type: "quiz", q: "What does this print?", code: "$scores = [4, 8, 15];\necho $scores[1];", options: ["8", "4", "15", "1"], answer: 0,
          explain: "Indexes start at 0, so index 1 is the second item: 8." },
        { type: "fill", title: "Hero card", task: "Fill in the blanks so the program prints <code>Lin</code>",
          code: "$hero = [\"name\" ⟦0⟧ \"Lin\", \"hp\" => 12];\necho $hero[⟦1⟧];",
          blanks: [["=>"], ["\"name\"", "'name'"]], output: "Lin", hint: "Keys point to values with <code>=&gt;</code>; read it back with the key <code>\"name\"</code>." },
        { type: "order", title: "Build the party", task: "Order the lines so the program prints <code>2</code>",
          lines: ["<?php", "$party = [\"Ada\"];", "$party[] = \"Lin\";", "echo count($party);"], output: "2",
          hint: "Make the array, add Lin, then count." },
        { type: "fill", title: "Boss fight!", task: "Fill in the blanks so the program adds up the loot prices and prints <code>Loot value: 47</code>",
          code: "$loot = [\"potion\" => 5, \"sword\" => 30, \"gem\" => 12];\n$total = 0;\nforeach ($loot ⟦0⟧ $item => $price) {\n    $total += ⟦1⟧;\n}\necho \"Loot value: \" . ⟦2⟧;",
          blanks: [["as"], ["$price"], ["$total"]], output: "Loot value: 47", hint: "<code>foreach ($loot as $item =&gt; $price)</code>, add <code>$price</code>, then print <code>$total</code>." }
      ]
    }
  ];

  GO.forEach(lv => { lv.track = "go"; lv.lang = "go"; L.push(lv); });
  PHP.forEach(lv => { lv.track = "php"; lv.lang = "php"; L.push(lv); });

  const byId = id => TRACKS.find(t => t.id === id) || TRACKS[0];
  const Tracks = {
    list: TRACKS,
    byId,
    of: lv => byId(lv.track),
    levels: id => L.filter(l => l.track === id),
    num: lv => lv.id - byId(lv.track).first + 1,
    next: lv => { const n = L.find(l => l.id === lv.id + 1); return n && n.track === lv.track ? n : null; },
    isLast: lv => lv.id === byId(lv.track).last,
    isComplete: (id, store) => L.filter(l => l.track === id).every(l => store.isDone(l.id))
  };
  window.BITWOOD_TRACKS = TRACKS;
  if (window.Bitwood) window.Bitwood.Tracks = Tracks;
})();

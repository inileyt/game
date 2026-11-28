/* More language tracks: C# (levels 21–25), C++ (26–30) and Python (31–35).
   Same format as Go and PHP: quiz, quiz, fill-in-the-blank (⟦n⟧ marks blank n), build-the-program, fill. */
(function () {
  "use strict";
  const TRACKS = window.BITWOOD_TRACKS;
  const L = window.BITWOOD_LEVELS;

  TRACKS.push(
    { id: "csharp", name: "C#", short: "C#", color: "#a78bfa", icon: "shield", first: 21, last: 25,
      blurb: "Microsoft's friendly language for games (Unity), apps and websites. Five worlds for beginners.", topics: "printing, variables and types, conditions and loops, methods and lists in C#" },
    { id: "cpp", name: "C++", short: "C++", color: "#38bdf8", icon: "chip", first: 26, last: 30,
      blurb: "The fast language behind game engines, browsers and robots. Five worlds for beginners.", topics: "printing, variables, conditions and loops, functions and vectors in C++" },
    { id: "python", name: "Python", short: "PY", color: "#facc15", icon: "sword", first: 31, last: 35,
      blurb: "The easy-to-read language used for automation, data and AI. Five worlds for beginners.", topics: "printing, variables and f-strings, conditions and loops, functions, lists and dictionaries in Python" }
  );

  const CSHARP = [
    {
      id: 21, slug: "hello-csharp", name: "Console Castle", theme: "castle", color: "#a78bfa", icon: "flag", topic: "Your first C# program", xp: 120,
      blurb: "Enter the castle and make the console speak with Console.WriteLine.",
      lesson: [
        { p: "C# programs print text with <code>Console.WriteLine</code>. Every statement ends with a semicolon <code>;</code>. In modern C# a whole program can be just this one line:" },
        { code: "Console.WriteLine(\"Hello, Bitwood!\");" },
        { p: "Older programs (and many tutorials) wrap the code in a <code>class</code> with a <code>Main</code> method — the place where the program starts. <code>using System;</code> gives access to <code>Console</code>." },
        { code: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(\"Hello, Bitwood!\");\n    }\n}" },
        { p: "<code>WriteLine</code> prints and then moves to a new line; <code>Write</code> prints <b>without</b> a new line. Join text with <code>+</code>." },
        { code: "Console.Write(\"Level \");\nConsole.WriteLine(1);        // Level 1\nConsole.WriteLine(\"Coins: \" + 5);  // Coins: 5" }
      ],
      questions: [
        { type: "quiz", q: "Which line prints text in C#?", options: ["Console.WriteLine(\"Hi\");", "print(\"Hi\")", "echo \"Hi\";", "fmt.Println(\"Hi\")"], answer: 0,
          explain: "<code>Console.WriteLine</code> prints a line of text." },
        { type: "quiz", q: "What does this print?", code: "Console.WriteLine(\"Level \" + 1);", options: ["Level 1", "Level1", "\"Level \" + 1", "Level + 1"], answer: 0,
          explain: "<code>+</code> joins the text and the number: <code>Level 1</code>." },
        { type: "fill", title: "Say hello", task: "Fill in the blanks so the program prints <code>Hello, C#!</code>",
          code: "Console.⟦0⟧(\"Hello, C#!\")⟦1⟧", blanks: [["WriteLine", "Write"], [";"]], output: "Hello, C#!",
          hint: "Print with <code>WriteLine</code> and end the statement with <code>;</code>." },
        { type: "order", title: "Build the program", task: "Put the lines in order to build a classic C# program that prints <code>Ready!</code>",
          lines: ["using System;", "class Program", "{", "    static void Main()", "    {", "        Console.WriteLine(\"Ready!\");", "    }", "}"], output: "Ready!",
          hint: "<code>using</code> first, then the class with its braces, and the <code>Main</code> method inside." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints exactly these two lines.",
          code: "Console.⟦0⟧(\"Hero: \");\nConsole.WriteLine(⟦1⟧);\nConsole.WriteLine(\"Coins: \" + ⟦2⟧);",
          blanks: [["Write"], ["\"Ada\""], ["3"]], output: "Hero: Ada\nCoins: 3", hint: "The first print must <b>not</b> end the line (<code>Write</code>), text goes in double quotes, and there are 3 coins." }
      ]
    },
    {
      id: 22, slug: "csharp-variables", name: "Typed Tundra", theme: "snow", color: "#7dd3fc", icon: "scroll", topic: "Variables & types", xp: 150,
      blurb: "Every value in this frozen land has a type: int, double, string, bool.",
      lesson: [
        { p: "C# variables have a <b>type</b> written before the name: <code>int</code> (whole numbers), <code>double</code> (decimals), <code>string</code> (text) and <code>bool</code> (<code>true</code>/<code>false</code>). With <code>var</code> the compiler works the type out for you." },
        { code: "int coins = 3;\ndouble speed = 1.5;\nstring hero = \"Ada\";\nbool isHero = true;\nvar level = 2;        // the compiler knows it's an int\ncoins += 2;           // now 5" },
        { p: "Put values inside text with <b>string interpolation</b>: a <code>$</code> before the quotes and the values in <code>{ }</code>." },
        { code: "Console.WriteLine($\"{hero} has {coins} coins\");  // Ada has 5 coins" }
      ],
      questions: [
        { type: "quiz", q: "Which C# type holds text?", options: ["string", "int", "bool", "double"], answer: 0, explain: "Text is a <code>string</code>." },
        { type: "quiz", q: "What does this print?", code: "int coins = 3;\ncoins += 4;\nConsole.WriteLine(coins);", options: ["3", "4", "7", "34"], answer: 2,
          explain: "<code>+=</code> adds to the variable: 3 + 4 = 7." },
        { type: "fill", title: "Hero stats", task: "Fill in the blanks so the program prints <code>Pixel has 3 lives</code>",
          code: "⟦0⟧ lives = 3;\nstring name = \"Pixel\";\nConsole.WriteLine(⟦1⟧\"{name} has {lives} lives\");",
          blanks: [["int", "var"], ["$"]], output: "Pixel has 3 lives", hint: "A whole number is an <code>int</code>; interpolated strings start with <code>$</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>XP: 150</code>",
          lines: ["int xp = 100;", "xp += 50;", "string msg = $\"XP: {xp}\";", "Console.WriteLine(msg);"], output: "XP: 150",
          hint: "Create xp, add 50, build the message, then print it." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints <code>Total: 10</code>",
          code: "double price = 2.5;\nint qty = 4;\n⟦0⟧ total = price * qty;\nConsole.WriteLine($\"Total: {⟦1⟧}\");",
          blanks: [["double", "var"], ["total"]], output: "Total: 10", hint: "2.5 × 4 is a decimal calculation (<code>double</code> or <code>var</code>), then print <code>total</code>." }
      ]
    },
    {
      id: 23, slug: "csharp-if-loops", name: "Branching Woods", theme: "forest", color: "#4ade80", icon: "sword", topic: "If & loops", xp: 180,
      blurb: "Choose a path with if/else and walk it again and again with for and while.",
      lesson: [
        { p: "<code>if</code> runs code when a condition is <code>true</code>; <code>else</code> runs otherwise. Compare with <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code> and combine with <code>&amp;&amp;</code> (and) and <code>||</code> (or)." },
        { code: "int hp = 0;\nif (hp > 0)\n{\n    Console.WriteLine(\"alive\");\n}\nelse\n{\n    Console.WriteLine(\"game over\");\n}" },
        { p: "<code>for</code> repeats a set number of times; <code>while</code> repeats as long as a condition is true." },
        { code: "for (int i = 1; i <= 3; i++)\n{\n    Console.WriteLine($\"Step {i}\");\n}\n\nint fuel = 2;\nwhile (fuel > 0)\n{\n    fuel--;\n}" }
      ],
      questions: [
        { type: "quiz", q: "Which operator checks if two values are equal in C#?", options: ["==", "=", "===", "=>"], answer: 0,
          explain: "<code>==</code> compares; a single <code>=</code> assigns. C# has no <code>===</code>." },
        { type: "quiz", q: "What does this print?", code: "for (int i = 0; i < 3; i++)\n{\n    Console.Write(i);\n}", options: ["012", "123", "0123", "333"], answer: 0,
          explain: "<code>Write</code> stays on one line: 0, 1, 2 → <code>012</code>." },
        { type: "fill", title: "Shop keeper", task: "Fill in the blanks so the program prints <code>Buy a sword!</code>",
          code: "int coins = 7;\n⟦0⟧ (coins >= 5)\n{\n    Console.WriteLine(\"Buy a sword!\");\n}\n⟦1⟧\n{\n    Console.WriteLine(\"Keep collecting!\");\n}",
          blanks: [["if"], ["else"]], output: "Buy a sword!", hint: "Choose with <code>if</code> … <code>else</code>." },
        { type: "order", title: "Build the countdown", task: "Order the lines so the program prints 3, 2, 1 and then <code>GO!</code>",
          lines: ["int n = 3;", "while (n > 0)", "{", "    Console.WriteLine(n);", "    n--;", "}", "Console.WriteLine(\"GO!\");"], output: "3\n2\n1\nGO!",
          hint: "Print the number first, then count down — and print GO! after the loop." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program adds 1 + 2 + 3 + 4 + 5 and prints <code>15</code>",
          code: "int total = 0;\nfor (int i = 1; i ⟦0⟧ 5; i⟦1⟧)\n{\n    total ⟦2⟧ i;\n}\nConsole.WriteLine(total);",
          blanks: [["<="], ["++"], ["+="]], output: "15", hint: "Loop while <code>i &lt;= 5</code>, step with <code>i++</code>, add with <code>total += i</code>." }
      ]
    },
    {
      id: 24, slug: "csharp-methods", name: "Method Mesa", theme: "desert", color: "#fbbf24", icon: "potion", topic: "Methods", xp: 210,
      blurb: "Craft reusable spells: methods with parameters and return values.",
      lesson: [
        { p: "A <b>method</b> is a named block of code. Write the return type, the name, and the parameters with their types. <code>void</code> means it returns nothing." },
        { code: "static int Add(int a, int b)\n{\n    return a + b;\n}\n\nstatic void Cheer(string name)\n{\n    Console.WriteLine($\"Go, {name}!\");\n}\n\nConsole.WriteLine(Add(2, 3));  // 5\nCheer(\"Ada\");                  // Go, Ada!" },
        { p: "Short methods can use an arrow <code>=&gt;</code> instead of braces and <code>return</code>. Notice that C# prints booleans as <code>True</code>/<code>False</code>." },
        { code: "static bool IsEven(int n) => n % 2 == 0;\n\nConsole.WriteLine(IsEven(4));  // True" }
      ],
      questions: [
        { type: "quiz", q: "What does <code>void</code> mean in <code>static void Cheer(string name)</code>?", options: ["The method returns nothing", "The method is empty", "The method is private", "The method returns a string"], answer: 0,
          explain: "<code>void</code> = no return value." },
        { type: "quiz", q: "What does this print?", code: "static string Greet(string name)\n{\n    return \"Hi, \" + name;\n}\n\nConsole.WriteLine(Greet(\"C#\"));", options: ["Hi, C#", "Hi, name", "Greet(\"C#\")", "Hi,C#"], answer: 0,
          explain: "<code>\"Hi, \" + \"C#\"</code> → <code>Hi, C#</code>." },
        { type: "fill", title: "Triple strike", task: "Fill in the blanks so the program prints <code>12</code>",
          code: "static ⟦0⟧ Triple(int n)\n{\n    ⟦1⟧ n * 3;\n}\n\nConsole.WriteLine(Triple(4));",
          blanks: [["int"], ["return"]], output: "12", hint: "It returns a whole number (<code>int</code>) with <code>return</code>." },
        { type: "order", title: "Build the program", task: "Order the lines: define the <code>Square</code> method first, then print <code>36</code>.",
          lines: ["static int Square(int n)", "{", "    return n * n;", "}", "Console.WriteLine(Square(6));"], output: "36",
          hint: "Method header, opening brace, return line, closing brace — then the print." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints <code>True</code>",
          code: "static ⟦0⟧ IsEven(int n) => n % 2 ⟦1⟧ 0;\n\nConsole.WriteLine(⟦2⟧(4));",
          blanks: [["bool"], ["=="], ["IsEven"]], output: "True", hint: "It returns true/false (<code>bool</code>), compares with <code>==</code>, and you call <code>IsEven</code>." }
      ]
    },
    {
      id: 25, slug: "csharp-lists", name: "List Nebula", theme: "space", color: "#c084fc", icon: "crown", topic: "Arrays & lists — boss", xp: 260,
      blurb: "The C# boss floats among the stars. Defeat it with arrays, List<T> and foreach.",
      lesson: [
        { p: "An <b>array</b> has a fixed size; <code>.Length</code> counts its items. A <b>List</b> can grow: <code>.Add()</code> appends and <code>.Count</code> counts. Indexes start at 0." },
        { code: "int[] scores = { 4, 8, 15 };\nConsole.WriteLine(scores.Length);   // 3\nConsole.WriteLine(scores[1]);       // 8\n\nvar bag = new List<string> { \"sword\", \"shield\" };\nbag.Add(\"potion\");\nConsole.WriteLine(bag.Count);       // 3" },
        { p: "<code>foreach</code> walks through every item. <code>string.Join</code> glues items into one string." },
        { code: "foreach (var item in bag)\n{\n    Console.WriteLine(item);\n}\nConsole.WriteLine(string.Join(\", \", bag));  // sword, shield, potion" }
      ],
      questions: [
        { type: "quiz", q: "How do you add an item to <code>List&lt;string&gt; bag</code>?", options: ["bag.Add(\"potion\");", "bag.push(\"potion\");", "bag.append(\"potion\");", "bag[] = \"potion\";"], answer: 0,
          explain: "Lists use <code>.Add()</code>." },
        { type: "quiz", q: "What does this print?", code: "int[] scores = { 4, 8, 15 };\nConsole.WriteLine(scores[1]);", options: ["8", "4", "15", "1"], answer: 0,
          explain: "Index 1 is the second item." },
        { type: "fill", title: "Party time", task: "Fill in the blanks so the program prints <code>2</code>",
          code: "var party = new ⟦0⟧<string> { \"Ada\" };\nparty.⟦1⟧(\"Lin\");\nConsole.WriteLine(party.⟦2⟧);",
          blanks: [["List"], ["Add"], ["Count"]], output: "2", hint: "<code>new List&lt;string&gt;</code>, <code>.Add()</code>, and <code>.Count</code> for lists." },
        { type: "order", title: "Build the party", task: "Order the lines so the program prints <code>Ada, Lin</code>",
          lines: ["var party = new List<string>();", "party.Add(\"Ada\");", "party.Add(\"Lin\");", "Console.WriteLine(string.Join(\", \", party));"], output: "Ada, Lin",
          hint: "Create the list, add Ada, then Lin, then join and print." },
        { type: "fill", title: "Boss fight!", task: "Fill in the blanks so <code>CountLong</code> counts the words longer than 4 letters. The program prints <code>2</code>.",
          code: "static int CountLong(List<string> words)\n{\n    int count = 0;\n    ⟦0⟧ (var w in words)\n    {\n        if (w.⟦1⟧ > 4) count++;\n    }\n    return ⟦2⟧;\n}\n\nConsole.WriteLine(CountLong(new List<string> { \"go\", \"pixel\", \"castle\" }));",
          blanks: [["foreach"], ["Length"], ["count"]], output: "2", hint: "Loop with <code>foreach</code>, a string's size is <code>.Length</code>, and return <code>count</code>." }
      ]
    }
  ];

  const CPP = [
    {
      id: 26, slug: "hello-cpp", name: "Stream Volcano", theme: "volcano", color: "#38bdf8", icon: "flag", topic: "Your first C++ program", xp: 120,
      blurb: "Pour text into std::cout like lava with the << operator.",
      lesson: [
        { p: "A C++ program starts in <code>int main()</code>. Include <code>&lt;iostream&gt;</code> to print, then send text to <code>std::cout</code> with the <code>&lt;&lt;</code> operator. <code>\"\\n\"</code> starts a new line, and <code>return 0;</code> means \"finished OK\"." },
        { code: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, Bitwood!\" << \"\\n\";\n    return 0;\n}" },
        { p: "Chain several values with more <code>&lt;&lt;</code>. <code>std::endl</code> also ends a line." },
        { code: "std::cout << \"Level \" << 1 << std::endl;   // Level 1\nstd::cout << \"Coins: \" << 5 << \"\\n\";      // Coins: 5" }
      ],
      questions: [
        { type: "quiz", q: "Which line prints text in C++?", options: ["std::cout << \"Hi\";", "print(\"Hi\")", "Console.WriteLine(\"Hi\");", "echo \"Hi\";"], answer: 0,
          explain: "Text flows into <code>std::cout</code> with <code>&lt;&lt;</code>." },
        { type: "quiz", q: "What does this print?", code: "std::cout << \"Level \" << 1 << \"\\n\";", options: ["Level 1", "Level1", "\"Level \" 1", "Level << 1"], answer: 0,
          explain: "Each <code>&lt;&lt;</code> adds the next value: <code>Level 1</code>." },
        { type: "fill", title: "Say hello", task: "Fill in the blanks so the program prints <code>Hello, C++!</code>",
          code: "#include ⟦0⟧\n\nint main() {\n    std::cout ⟦1⟧ \"Hello, C++!\" << \"\\n\";\n    return ⟦2⟧;\n}",
          blanks: [["<iostream>"], ["<<"], ["0"]], output: "Hello, C++!", hint: "Include <code>&lt;iostream&gt;</code>, print with <code>&lt;&lt;</code>, return <code>0</code>." },
        { type: "order", title: "Build the program", task: "Order the lines to build a program that prints <code>Ready!</code>",
          lines: ["#include <iostream>", "int main() {", "    std::cout << \"Ready!\\n\";", "    return 0;", "}"], output: "Ready!",
          hint: "Include first, then <code>main</code>, the print, <code>return 0;</code> and the closing brace." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints exactly these two lines.",
          code: "std::cout << \"Hero: \" << ⟦0⟧ << \"\\n\";\nstd::cout ⟦1⟧ \"Coins: \" << 3 << ⟦2⟧;",
          blanks: [["\"Ada\""], ["<<"], ["\"\\n\"", "std::endl", "'\\n'"]], output: "Hero: Ada\nCoins: 3", hint: "Text in double quotes, chain with <code>&lt;&lt;</code>, and end the line with <code>\"\\n\"</code> or <code>std::endl</code>." }
      ]
    },
    {
      id: 27, slug: "cpp-variables", name: "Byte Caverns", theme: "caves", color: "#94a3b8", icon: "scroll", topic: "Variables & types", xp: 150,
      blurb: "Deep in the caves every value has a type — or let auto guess it.",
      lesson: [
        { p: "C++ types: <code>int</code> (whole numbers), <code>double</code> (decimals), <code>char</code> (one character), <code>bool</code> (<code>true</code>/<code>false</code>) and <code>std::string</code> (text, from <code>&lt;string&gt;</code>). <code>auto</code> lets the compiler pick the type." },
        { code: "int coins = 3;\ndouble speed = 1.5;\nchar grade = 'A';\nbool isHero = true;\nstd::string hero = \"Ada\";\nauto level = 2;      // int\ncoins *= 2;          // now 6" },
        { p: "Print several values in one line by chaining <code>&lt;&lt;</code>." },
        { code: "std::cout << hero << \" has \" << coins << \" coins\\n\";  // Ada has 6 coins" }
      ],
      questions: [
        { type: "quiz", q: "Which type stores text in C++?", options: ["std::string", "int", "bool", "double"], answer: 0,
          explain: "<code>std::string</code> holds text (<code>char</code> holds just one character)." },
        { type: "quiz", q: "What does this print?", code: "int coins = 3;\ncoins *= 2;\nstd::cout << coins;", options: ["6", "3", "5", "32"], answer: 0,
          explain: "<code>*=</code> multiplies: 3 × 2 = 6." },
        { type: "fill", title: "Hero stats", task: "Fill in the blanks so the program prints <code>Pixel has 3 lives</code>",
          code: "⟦0⟧ lives = 3;\nstd::string name = \"Pixel\";\nstd::cout << name << \" has \" << lives ⟦1⟧ \" lives\";",
          blanks: [["int", "auto"], ["<<"]], output: "Pixel has 3 lives", hint: "A whole number is an <code>int</code>; keep chaining with <code>&lt;&lt;</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>XP: 150</code>",
          lines: ["#include <iostream>", "int main() {", "    int xp = 100;", "    xp += 50;", "    std::cout << \"XP: \" << xp;", "}"], output: "XP: 150",
          hint: "Create xp, add 50, then print — all inside <code>main</code>." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints <code>Total: 10</code>",
          code: "double price = 2.5;\nint qty = 4;\n⟦0⟧ total = price * qty;\nstd::cout << \"Total: \" ⟦1⟧ ⟦2⟧;",
          blanks: [["double", "auto"], ["<<"], ["total"]], output: "Total: 10", hint: "2.5 × 4 is a decimal (<code>double</code>), then print <code>total</code> with <code>&lt;&lt;</code>." }
      ]
    },
    {
      id: 28, slug: "cpp-if-loops", name: "Loop Lagoon", theme: "swamp", color: "#84cc16", icon: "sword", topic: "If & loops", xp: 180,
      blurb: "Make choices and repeat yourself in the misty lagoon.",
      lesson: [
        { p: "<code>if</code>/<code>else</code> work like in C# and JavaScript: the condition goes in parentheses, the code in braces. Combine conditions with <code>&amp;&amp;</code> and <code>||</code>." },
        { code: "int hp = 0;\nif (hp > 0) {\n    std::cout << \"alive\\n\";\n} else {\n    std::cout << \"game over\\n\";\n}" },
        { p: "<code>for</code> repeats a set number of times; <code>while</code> repeats while a condition is true. <code>i++</code> adds 1, <code>n--</code> subtracts 1." },
        { code: "for (int i = 1; i <= 3; i++) {\n    std::cout << \"Step \" << i << \"\\n\";\n}" }
      ],
      questions: [
        { type: "quiz", q: "What does <code>i++</code> do?", options: ["Adds 1 to i", "Prints i", "Doubles i", "Resets i to 0"], answer: 0,
          explain: "<code>i++</code> means <code>i = i + 1</code> — that's where the name C++ comes from!" },
        { type: "quiz", q: "What does this print?", code: "for (int i = 0; i < 3; i++) {\n    std::cout << i;\n}", options: ["012", "123", "0123", "333"], answer: 0,
          explain: "0, 1 and 2 with nothing in between." },
        { type: "fill", title: "Shop keeper", task: "Fill in the blanks so the program prints <code>Buy a sword!</code>",
          code: "int coins = 7;\n⟦0⟧ (coins >= 5) {\n    std::cout << \"Buy a sword!\";\n} ⟦1⟧ {\n    std::cout << \"Keep collecting!\";\n}",
          blanks: [["if"], ["else"]], output: "Buy a sword!", hint: "Choose with <code>if</code> … <code>else</code>." },
        { type: "order", title: "Build the countdown", task: "Order the lines so the program prints 3, 2, 1 and then <code>GO!</code>",
          lines: ["int n = 3;", "while (n > 0) {", "    std::cout << n << \"\\n\";", "    n--;", "}", "std::cout << \"GO!\";"], output: "3\n2\n1\nGO!",
          hint: "Print first, then count down; GO! comes after the loop." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program adds 1 + 2 + 3 + 4 + 5 and prints <code>15</code>",
          code: "int total = 0;\nfor (int i = 1; i ⟦0⟧ 5; i⟦1⟧) {\n    total ⟦2⟧ i;\n}\nstd::cout << total;",
          blanks: [["<="], ["++"], ["+="]], output: "15", hint: "Loop while <code>i &lt;= 5</code>, step with <code>i++</code>, add with <code>total += i</code>." }
      ]
    },
    {
      id: 29, slug: "cpp-functions", name: "Function Falls", theme: "rapids", color: "#2dd4bf", icon: "potion", topic: "Functions & references", xp: 210,
      blurb: "Build functions — and learn the & trick that lets them change your variables.",
      lesson: [
        { p: "A function has a return type, a name and typed parameters. In C++ a function must be <b>declared before it is used</b>, so it usually sits above <code>main</code>." },
        { code: "int add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    std::cout << add(2, 3);   // 5\n}" },
        { p: "Normally a function gets a <b>copy</b> of each argument. Add <code>&amp;</code> to the parameter type to pass a <b>reference</b> — then the function can change the original variable." },
        { code: "void levelUp(int& level) {\n    level++;\n}\n\nint main() {\n    int lv = 1;\n    levelUp(lv);\n    std::cout << lv;   // 2\n}" }
      ],
      questions: [
        { type: "quiz", q: "Where should a function be written so <code>main</code> can use it?", options: ["Above main (declared before it is used)", "Anywhere — order never matters", "Only in another file", "Inside a comment"], answer: 0,
          explain: "C++ reads top to bottom; a function must be declared before it's called." },
        { type: "quiz", q: "What does this print?", code: "int square(int n) {\n    return n * n;\n}\n\nint main() {\n    std::cout << square(5);\n}", options: ["25", "10", "5", "55"], answer: 0,
          explain: "5 × 5 = 25." },
        { type: "fill", title: "Triple strike", task: "Fill in the blanks so the program prints <code>12</code>",
          code: "⟦0⟧ triple(int n) {\n    ⟦1⟧ n * 3;\n}\n\nint main() {\n    std::cout << triple(4);\n}",
          blanks: [["int"], ["return"]], output: "12", hint: "It returns an <code>int</code> using <code>return</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>36</code>",
          lines: ["#include <iostream>", "int square(int n) {", "    return n * n;", "}", "int main() {", "    std::cout << square(6);", "}"], output: "36",
          hint: "Include, then the <code>square</code> function, then <code>main</code>." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so <code>levelUp</code> changes the original variable and the program prints <code>2</code>",
          code: "void levelUp(int⟦0⟧ level) {\n    level⟦1⟧;\n}\n\nint main() {\n    int lv = 1;\n    levelUp(lv);\n    std::cout << ⟦2⟧;\n}",
          blanks: [["&"], ["++"], ["lv"]], output: "2", hint: "Pass by reference with <code>&amp;</code>, add 1 with <code>++</code>, and print <code>lv</code>." }
      ]
    },
    {
      id: 30, slug: "cpp-vectors", name: "Vector Void", theme: "space", color: "#818cf8", icon: "crown", topic: "Vectors — boss", xp: 260,
      blurb: "The C++ boss waits in the void. Beat it with std::vector and range-for loops.",
      lesson: [
        { p: "<code>std::vector</code> (from <code>&lt;vector&gt;</code>) is a list that can grow. <code>push_back</code> adds to the end, <code>size()</code> counts, and <code>v[0]</code> reads the first item." },
        { code: "std::vector<int> scores = {4, 8, 15};\nscores.push_back(16);\nstd::cout << scores.size();   // 4\nstd::cout << scores[1];       // 8" },
        { p: "A <b>range-for</b> loop visits every item. <code>const auto&amp;</code> reads each item without copying it." },
        { code: "std::vector<std::string> bag = {\"sword\", \"shield\"};\nfor (const auto& item : bag) {\n    std::cout << item << \"\\n\";\n}" }
      ],
      questions: [
        { type: "quiz", q: "What does <code>push_back</code> do?", options: ["Adds an item to the end of a vector", "Removes the first item", "Sorts the vector", "Prints the vector"], answer: 0,
          explain: "<code>v.push_back(x)</code> appends <code>x</code>." },
        { type: "quiz", q: "What does this print?", code: "std::vector<int> v = {4, 8, 15};\nstd::cout << v.size() << \" \" << v[1];", options: ["3 8", "3 4", "15 8", "2 8"], answer: 0,
          explain: "Three items; index 1 is 8." },
        { type: "fill", title: "Party time", task: "Fill in the blanks so the program prints <code>2</code>",
          code: "std::⟦0⟧<std::string> party = {\"Ada\"};\nparty.⟦1⟧(\"Lin\");\nstd::cout << party.⟦2⟧();",
          blanks: [["vector"], ["push_back"], ["size"]], output: "2", hint: "<code>std::vector</code>, <code>push_back</code> and <code>size()</code>." },
        { type: "order", title: "Build the party", task: "Order the lines so the program prints <code>Ada, Lin</code>",
          lines: ["std::vector<std::string> party;", "party.push_back(\"Ada\");", "party.push_back(\"Lin\");", "std::cout << party[0] << \", \" << party[1];"], output: "Ada, Lin",
          hint: "Create the vector, add Ada, then Lin, then print both." },
        { type: "fill", title: "Boss fight!", task: "Fill in the blanks so <code>countLong</code> counts the words longer than 4 letters. The program prints <code>2</code>.",
          code: "int countLong(const std::vector<std::string>& words) {\n    int count = 0;\n    for (const auto& w ⟦0⟧ words) {\n        if (w.⟦1⟧() > 4) count++;\n    }\n    return ⟦2⟧;\n}\n\nint main() {\n    std::cout << countLong({\"go\", \"pixel\", \"castle\"});\n}",
          blanks: [[":"], ["size", "length"], ["count"]], output: "2", hint: "Range-for uses <code>:</code>, a string's length is <code>size()</code>, and return <code>count</code>." }
      ]
    }
  ];

  const PYTHON = [
    {
      id: 31, slug: "hello-python", name: "Snake Village", theme: "village", color: "#facc15", icon: "flag", topic: "Your first Python program", xp: 120,
      blurb: "The friendliest village in Bitwood. Say hello with print().",
      lesson: [
        { p: "Python is famous for being easy to read. <code>print()</code> shows values, and lines starting with <code>#</code> are comments. No semicolons, no braces!" },
        { code: "# my first program\nprint(\"Hello, Bitwood!\")\nprint(\"Coins:\", 5)      # Coins: 5" },
        { p: "Give <code>print</code> several values separated by commas and it puts a space between them. Join strings with <code>+</code>." },
        { code: "name = \"Ada\"\nprint(\"Hi, \" + name)   # Hi, Ada" }
      ],
      questions: [
        { type: "quiz", q: "Which line prints text in Python?", options: ["print(\"Hi\")", "echo \"Hi\";", "console.log(\"Hi\")", "Console.WriteLine(\"Hi\");"], answer: 0,
          explain: "Python uses <code>print()</code>." },
        { type: "quiz", q: "What does this print?", code: "print(\"Level\", 1)", options: ["Level 1", "Level1", "\"Level\" 1", "Level, 1"], answer: 0,
          explain: "Commas in <code>print</code> become spaces." },
        { type: "fill", title: "Say hello", task: "Fill in the blanks: a comment, then a line that prints <code>Hello, Python!</code>",
          code: "⟦0⟧ my first program\n⟦1⟧(\"Hello, Python!\")",
          blanks: [["#"], ["print"]], output: "Hello, Python!", hint: "Comments start with <code>#</code>; print with <code>print</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>Hi, Ada</code>",
          lines: ["name = \"Ada\"", "greeting = \"Hi, \" + name", "print(greeting)"], output: "Hi, Ada",
          hint: "Create <code>name</code>, build the greeting, then print it." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints exactly these two lines.",
          code: "print(\"Hero:\", ⟦0⟧)\nprint(\"Coins:\", ⟦1⟧ + 1)",
          blanks: [["\"Ada\"", "'Ada'"], ["2"]], output: "Hero: Ada\nCoins: 3", hint: "Text goes in quotes; what plus 1 makes 3?" }
      ]
    },
    {
      id: 32, slug: "python-variables", name: "F-String Forest", theme: "forest", color: "#4ade80", icon: "scroll", topic: "Variables & f-strings", xp: 150,
      blurb: "Pack values into variables and weave them into text with f-strings.",
      lesson: [
        { p: "Make a variable just by giving it a value — no type or keyword needed. Names use <code>snake_case</code>." },
        { code: "hero_name = \"Ada\"\ncoins = 3\nspeed = 1.5\nis_hero = True\ncoins = coins * 2      # now 6" },
        { p: "An <b>f-string</b> puts values right into text: write <code>f</code> before the quotes and the values in <code>{ }</code>." },
        { code: "print(f\"{hero_name} has {coins} coins\")   # Ada has 6 coins" }
      ],
      questions: [
        { type: "quiz", q: "Which line creates a variable in Python?", options: ["coins = 3", "var coins = 3;", "int coins = 3;", "let coins = 3"], answer: 0,
          explain: "Just name = value." },
        { type: "quiz", q: "What does this print?", code: "coins = 3\ncoins = coins * 2\nprint(coins)", options: ["6", "3", "5", "32"], answer: 0,
          explain: "3 × 2 = 6." },
        { type: "fill", title: "Hero stats", task: "Fill in the blanks so the program prints <code>Pixel has 3 lives</code>",
          code: "name = \"Pixel\"\nlives = 3\nprint(⟦0⟧\"{name} has {⟦1⟧} lives\")",
          blanks: [["f"], ["lives"]], output: "Pixel has 3 lives", hint: "f-strings start with <code>f</code>; put the variable <code>lives</code> in the braces." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>XP: 150</code>",
          lines: ["xp = 100", "xp += 50", "msg = f\"XP: {xp}\"", "print(msg)"], output: "XP: 150",
          hint: "Create xp, add 50, build the message, print it." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints <code>10</code>",
          code: "price = 2.5\nqty = 4\ntotal = price ⟦0⟧ qty\nprint(⟦1⟧(total))",
          blanks: [["*"], ["int", "round"]], output: "10", hint: "Multiply with <code>*</code> (that gives 10.0), then turn it into a whole number with <code>int()</code>." }
      ]
    },
    {
      id: 33, slug: "python-if-loops", name: "Indent Dunes", theme: "desert", color: "#fbbf24", icon: "sword", topic: "If & loops", xp: 180,
      blurb: "In these dunes, spaces matter: indentation shapes every if and loop.",
      lesson: [
        { p: "Python uses <b>indentation</b> (4 spaces) instead of braces. A colon <code>:</code> starts a block. Use <code>if</code>, <code>elif</code> and <code>else</code>." },
        { code: "hp = 3\nif hp > 5:\n    print(\"Strong!\")\nelif hp > 0:\n    print(\"Careful...\")\nelse:\n    print(\"Game over\")" },
        { p: "<code>for</code> loops over a sequence — <code>range(1, 4)</code> gives 1, 2, 3. <code>while</code> repeats while a condition is true." },
        { code: "for i in range(1, 4):\n    print(\"Step\", i)\n\nfuel = 2\nwhile fuel > 0:\n    fuel -= 1" }
      ],
      questions: [
        { type: "quiz", q: "Which keyword checks another condition after <code>if</code>?", options: ["elif", "else if", "elseif", "orif"], answer: 0,
          explain: "Python uses <code>elif</code>." },
        { type: "quiz", q: "What does this print?", code: "for i in range(3):\n    print(i, end=\"\")", options: ["012", "123", "0123", "333"], answer: 0,
          explain: "<code>range(3)</code> is 0, 1, 2, and <code>end=\"\"</code> keeps them on one line." },
        { type: "fill", title: "Shop keeper", task: "Fill in the blanks so the program prints <code>Buy a sword!</code>",
          code: "coins = 7\n⟦0⟧ coins >= 5⟦1⟧\n    print(\"Buy a sword!\")\n⟦2⟧:\n    print(\"Keep collecting!\")",
          blanks: [["if"], [":"], ["else"]], output: "Buy a sword!", hint: "<code>if</code> … then a colon <code>:</code>, and <code>else</code> for the other path." },
        { type: "order", title: "Build the countdown", task: "Order the lines so the program prints 3, 2, 1 and then <code>GO!</code>",
          lines: ["n = 3", "while n > 0:", "    print(n)", "    n -= 1", "print(\"GO!\")"], output: "3\n2\n1\nGO!",
          hint: "Print the number, then subtract one — GO! is not indented (after the loop)." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program adds 1 + 2 + 3 + 4 + 5 and prints <code>15</code>",
          code: "total = 0\nfor i in ⟦0⟧(1, 6):\n    total ⟦1⟧ i\nprint(total)",
          blanks: [["range"], ["+="]], output: "15", hint: "<code>range(1, 6)</code> gives 1 to 5; add with <code>+=</code>." }
      ]
    },
    {
      id: 34, slug: "python-functions", name: "Def Glacier", theme: "snow", color: "#7dd3fc", icon: "potion", topic: "Functions", xp: 210,
      blurb: "Carve reusable spells in the ice with def, return and default values.",
      lesson: [
        { p: "Define a function with <code>def</code>, a name, parameters and a colon. The indented lines are its body; <code>return</code> sends a value back. Define a function <b>before</b> you call it." },
        { code: "def add(a, b):\n    return a + b\n\nprint(add(2, 3))   # 5" },
        { p: "Parameters can have <b>default values</b>, used when you leave them out." },
        { code: "def cheer(name=\"hero\"):\n    return f\"Go, {name}!\"\n\nprint(cheer())        # Go, hero!\nprint(cheer(\"Ada\"))   # Go, Ada!" }
      ],
      questions: [
        { type: "quiz", q: "Which keyword defines a function in Python?", options: ["def", "function", "func", "fn"], answer: 0, explain: "<code>def name():</code>" },
        { type: "quiz", q: "What does this print?", code: "def double(n):\n    return n * 2\n\nprint(double(21))", options: ["42", "21", "2", "double(21)"], answer: 0,
          explain: "21 × 2 = 42." },
        { type: "fill", title: "Triple strike", task: "Fill in the blanks so the program prints <code>12</code>",
          code: "⟦0⟧ triple(n)⟦1⟧\n    ⟦2⟧ n * 3\n\nprint(triple(4))",
          blanks: [["def"], [":"], ["return"]], output: "12", hint: "<code>def</code>, a colon, and <code>return</code>." },
        { type: "order", title: "Build the program", task: "Order the lines so the program prints <code>36</code>",
          lines: ["def square(n):", "    return n * n", "print(square(6))"], output: "36",
          hint: "In Python the function must be defined before it is called." },
        { type: "fill", title: "Level challenge", task: "Fill in the blanks so the program prints exactly these two lines.",
          code: "def cheer(name=⟦0⟧):\n    return f\"Go, {⟦1⟧}!\"\n\nprint(cheer())\nprint(cheer(\"Ada\"))",
          blanks: [["\"hero\"", "'hero'"], ["name"]], output: "Go, hero!\nGo, Ada!", hint: "The default name is the text <code>\"hero\"</code>, and the f-string uses <code>name</code>." }
      ]
    },
    {
      id: 35, slug: "python-collections", name: "Dict Citadel", theme: "castle", color: "#ff7286", icon: "crown", topic: "Lists & dictionaries — boss", xp: 260,
      blurb: "The Python boss guards its treasure in lists and dictionaries.",
      lesson: [
        { p: "A <b>list</b> keeps items in order: <code>.append()</code> adds, <code>len()</code> counts, indexes start at 0. <code>\", \".join(list)</code> glues strings together." },
        { code: "party = [\"Ada\"]\nparty.append(\"Lin\")\nprint(len(party))           # 2\nprint(\", \".join(party))     # Ada, Lin" },
        { p: "A <b>dictionary</b> stores key–value pairs. Loop over both with <code>.items()</code>." },
        { code: "loot = {\"potion\": 5, \"sword\": 30}\nprint(loot[\"sword\"])        # 30\nfor item, price in loot.items():\n    print(item, price)" }
      ],
      questions: [
        { type: "quiz", q: "How do you add an item to the end of a list?", options: ["party.append(\"Lin\")", "party.push(\"Lin\")", "party.Add(\"Lin\")", "party += \"Lin\"!"], answer: 0,
          explain: "Lists use <code>.append()</code>." },
        { type: "quiz", q: "What does this print?", code: "scores = [4, 8, 15]\nprint(len(scores), scores[1])", options: ["3 8", "3 4", "15 8", "2 8"], answer: 0,
          explain: "Three items; index 1 is 8." },
        { type: "fill", title: "Party time", task: "Fill in the blanks so the program prints <code>2</code>",
          code: "party = ⟦0⟧\"Ada\"]\nparty.⟦1⟧(\"Lin\")\nprint(⟦2⟧(party))",
          blanks: [["["], ["append"], ["len"]], output: "2", hint: "Lists start with <code>[</code>; add with <code>append</code>; count with <code>len</code>." },
        { type: "order", title: "Build the party", task: "Order the lines so the program prints <code>Ada, Lin</code>",
          lines: ["party = []", "party.append(\"Ada\")", "party.append(\"Lin\")", "print(\", \".join(party))"], output: "Ada, Lin",
          hint: "Empty list, add Ada, add Lin, then join and print." },
        { type: "fill", title: "Boss fight!", task: "Fill in the blanks so the program adds up the loot prices and prints <code>Loot value: 47</code>",
          code: "loot = {\"potion\": 5, \"sword\": 30, \"gem\": 12}\ntotal = 0\nfor item, price in loot.⟦0⟧():\n    total ⟦1⟧ price\nprint(f\"Loot value: {⟦2⟧}\")",
          blanks: [["items"], ["+="], ["total"]], output: "Loot value: 47", hint: "<code>.items()</code> gives key–value pairs, add with <code>+=</code>, print <code>total</code>." }
      ]
    }
  ];

  CSHARP.forEach(lv => { lv.track = "csharp"; lv.lang = "csharp"; L.push(lv); });
  CPP.forEach(lv => { lv.track = "cpp"; lv.lang = "cpp"; L.push(lv); });
  PYTHON.forEach(lv => { lv.track = "python"; lv.lang = "python"; L.push(lv); });
})();

/* Course: Python — 10 lessons + 20-question final exam. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "python",
  name: "Python",
  title: "Python for Beginners",
  color: "#facc15",
  icon: "sword",
  theme: "forest",
  blurb: "The friendly language used for games, websites, data and AI.",
  topics: "variables, strings, conditions, loops, lists, dictionaries, functions, files, errors and modules",
  lessons: [
    {
      title: "Hello, Python",
      minutes: 5,
      summary: "Run your first Python program and meet print().",
      sections: [
        { h: "Why Python?", p: ["Python reads almost like English, so it's a favourite first language. It's used for websites, automation, games, science and <b>artificial intelligence</b>."] },
        { h: "Your first program", diagram: "python-run", p: ["Python runs your code top to bottom with an <b>interpreter</b>. <code>print()</code> shows text. Lines starting with <code>#</code> are comments."],
          code: "# my first program\nprint(\"Hello, Bitwood!\")\nprint(\"Coins:\", 5)", lang: "python" },
        { h: "Running it", p: ["Save the code in a file like <code>hello.py</code> and run it in a terminal — or type lines straight into the interactive Python shell."],
          code: "python3 hello.py\n# Hello, Bitwood!\n# Coins: 5", lang: "bash" }
      ],
      points: ["<code>print()</code> shows values.", "<code>#</code> starts a comment.", "Run files with <code>python3 file.py</code>."],
      checks: [
        { q: "What does <code>print(\"Hi\")</code> do?", options: ["Shows Hi on the screen", "Prints on paper", "Deletes Hi", "Saves a file"], answer: 0, explain: "<code>print</code> writes to the output." },
        { q: "How does a comment start in Python?", options: ["#", "//", "<!--", "--"], answer: 0, explain: "Python comments start with <code>#</code>." }
      ]
    },
    {
      title: "Variables & types",
      minutes: 6,
      summary: "Store numbers, text and true/false in named boxes.",
      sections: [
        { h: "Variables", p: ["Create a variable just by giving it a value — no <code>let</code> or <code>var</code>. Names use <code>snake_case</code>."],
          code: "hero_name = \"Ada\"\ncoins = 3\nspeed = 1.5\nis_hero = True\n\ncoins = coins + 2   # now 5", lang: "python" },
        { h: "Types", p: ["Main types: <code>int</code> (whole numbers), <code>float</code> (decimals), <code>str</code> (text) and <code>bool</code> (<code>True</code>/<code>False</code>). Check a type with <code>type()</code> and convert with <code>int()</code>, <code>str()</code>, <code>float()</code>."],
          code: "print(type(coins))      # <class 'int'>\nage = int(\"12\")        # text → number\nlabel = \"Lv \" + str(3)  # number → text", lang: "python" },
        { h: "Input", p: ["<code>input()</code> asks the user to type something — it always returns a string."],
          code: "name = input(\"Your name? \")\nprint(\"Welcome,\", name)", lang: "python" }
      ],
      points: ["Variables are created by assigning: <code>x = 5</code>.", "Types: int, float, str, bool.", "<code>input()</code> always returns a string."],
      checks: [
        { q: "What type is <code>3.14</code>?", options: ["int", "float", "str", "bool"], answer: 1, explain: "Numbers with a decimal point are floats." },
        { q: "What does <code>int(\"7\")</code> give?", options: ["The number 7", "The text \"7\"", "An error always", "True"], answer: 0, explain: "<code>int()</code> converts text to a whole number." }
      ]
    },
    {
      title: "Strings",
      minutes: 6,
      summary: "Join, slice and format text.",
      sections: [
        { h: "Working with text", p: ["Strings go in quotes. Join with <code>+</code>, repeat with <code>*</code>, and get the length with <code>len()</code>. Indexes start at 0."],
          code: "word = \"pixel\"\nprint(len(word))     # 5\nprint(word[0])       # p\nprint(word[-1])      # l (last)\nprint(word[1:3])     # ix (slice)\nprint(word.upper())  # PIXEL", lang: "python" },
        { h: "f-strings", p: ["The easiest way to put values into text is an <b>f-string</b>: put <code>f</code> before the quotes and variables in <code>{ }</code>."],
          code: "name = \"Lin\"\nxp = 150\nprint(f\"{name} has {xp} XP\")   # Lin has 150 XP", lang: "python" }
      ],
      points: ["<code>len()</code>, indexes and slices like <code>[1:3]</code>.", "Methods like <code>.upper()</code>, <code>.lower()</code>, <code>.split()</code>.", "f-strings: <code>f\"Hi {name}\"</code>."],
      checks: [
        { q: "What is <code>\"code\"[0]</code>?", options: ["c", "o", "e", "code"], answer: 0, explain: "Index 0 is the first character." },
        { q: "What prints <code>Hi Ada</code> when <code>name = \"Ada\"</code>?", options: ["print(f\"Hi {name}\")", "print(\"Hi {name}\")", "print(Hi name)", "print(f'Hi name')"], answer: 0, explain: "The f prefix makes <code>{name}</code> work." }
      ]
    },
    {
      title: "Conditions",
      minutes: 6,
      summary: "if, elif and else — and why indentation matters.",
      sections: [
        { h: "Indentation is code", p: ["Python uses <b>indentation</b> (usually 4 spaces) instead of braces to show which lines belong to an <code>if</code>. A colon <code>:</code> starts the block."],
          code: "hp = 3\nif hp > 5:\n    print(\"Strong!\")\nelif hp > 0:\n    print(\"Careful...\")\nelse:\n    print(\"Game over\")", lang: "python" },
        { h: "Comparisons and logic", p: ["Compare with <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Combine with the words <code>and</code>, <code>or</code>, <code>not</code>."],
          code: "if coins >= 10 and has_key:\n    print(\"Open the chest!\")", lang: "python" }
      ],
      points: ["<code>if</code> / <code>elif</code> / <code>else</code> with a colon.", "Indentation defines the block.", "Logic words: <code>and</code>, <code>or</code>, <code>not</code>."],
      checks: [
        { q: "How does Python know which lines belong to an <code>if</code>?", options: ["Curly braces", "Indentation", "Semicolons", "Brackets"], answer: 1, explain: "Indented lines after the colon form the block." },
        { q: "Which keyword checks another condition?", options: ["elif", "else if", "elseif", "orif"], answer: 0, explain: "Python uses <code>elif</code>." }
      ]
    },
    {
      title: "Loops",
      minutes: 6,
      summary: "Repeat with for and while.",
      sections: [
        { h: "for loops", p: ["<code>for</code> walks over each item of a sequence. <code>range(n)</code> gives the numbers 0 to n−1."],
          code: "for i in range(3):\n    print(\"Step\", i)    # 0, 1, 2\n\nfor letter in \"hey\":\n    print(letter)", lang: "python" },
        { h: "while loops", p: ["<code>while</code> repeats while a condition is true. <code>break</code> stops a loop early; <code>continue</code> skips to the next turn."],
          code: "fuel = 3\nwhile fuel > 0:\n    print(\"Vroom\")\n    fuel -= 1", lang: "python" }
      ],
      points: ["<code>for x in something:</code> loops over items.", "<code>range(3)</code> → 0, 1, 2.", "<code>while</code>, <code>break</code>, <code>continue</code>."],
      checks: [
        { q: "Which numbers does <code>range(4)</code> produce?", options: ["0, 1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3, 4", "4"], answer: 0, explain: "It starts at 0 and stops before 4." },
        { q: "What does <code>break</code> do?", options: ["Stops the loop", "Skips one turn", "Breaks the computer", "Restarts the loop"], answer: 0, explain: "<code>break</code> exits the loop immediately." }
      ]
    },
    {
      title: "Lists",
      minutes: 7,
      summary: "Keep many values in order.",
      sections: [
        { h: "Making and using lists", p: ["A <b>list</b> holds items in order inside <code>[ ]</code>. Add with <code>.append()</code>, remove with <code>.remove()</code> or <code>.pop()</code>, count with <code>len()</code>."],
          code: "bag = [\"sword\", \"shield\"]\nbag.append(\"potion\")\nprint(bag[0])      # sword\nprint(len(bag))    # 3\nbag.remove(\"shield\")\nprint(\"potion\" in bag)   # True", lang: "python" },
        { h: "List comprehensions", p: ["A short way to build a new list from another one."],
          code: "scores = [3, 8, 5]\ndoubled = [s * 2 for s in scores]       # [6, 16, 10]\nbig = [s for s in scores if s > 4]      # [8, 5]\nprint(sorted(scores))                   # [3, 5, 8]", lang: "python" }
      ],
      points: ["Lists: <code>[1, 2, 3]</code>, indexes from 0.", "<code>.append()</code>, <code>.remove()</code>, <code>len()</code>, <code>in</code>.", "Comprehensions: <code>[x * 2 for x in nums]</code>."],
      checks: [
        { q: "How do you add an item to the end of a list?", options: ["bag.append(item)", "bag.add(item)", "bag + item!", "push(bag, item)"], answer: 0, explain: "<code>.append()</code> adds to the end." },
        { q: "What is <code>[n * 2 for n in [1, 2]]</code>?", options: ["[2, 4]", "[1, 2, 1, 2]", "[3]", "4"], answer: 0, explain: "Each item is doubled." }
      ]
    },
    {
      title: "Dictionaries",
      minutes: 6,
      summary: "Look things up by name with key–value pairs.",
      sections: [
        { h: "Keys and values", p: ["A <b>dictionary</b> stores <b>key: value</b> pairs in <code>{ }</code>. Look up a value by its key."],
          code: "hero = {\"name\": \"Ada\", \"hp\": 10, \"level\": 2}\nprint(hero[\"name\"])        # Ada\nhero[\"hp\"] = 12             # change\nhero[\"xp\"] = 0              # add a new key\nprint(hero.get(\"mana\", 0))  # 0 (default if missing)", lang: "python" },
        { h: "Looping", p: ["Loop over keys and values together with <code>.items()</code>."],
          code: "for key, value in hero.items():\n    print(key, \"=\", value)", lang: "python" }
      ],
      points: ["Dictionaries map keys to values.", "<code>d[key]</code> reads; <code>.get(key, default)</code> is safe.", "<code>.items()</code> gives key–value pairs."],
      checks: [
        { q: "How do you read the value of key <code>\"hp\"</code> from <code>hero</code>?", options: ["hero[\"hp\"]", "hero.hp()", "hero(hp)", "hero->hp"], answer: 0, explain: "Square brackets with the key." },
        { q: "What does <code>hero.get(\"mana\", 0)</code> return if there is no mana key?", options: ["0", "An error", "None always", "\"mana\""], answer: 0, explain: "The second argument is the default." }
      ]
    },
    {
      title: "Functions",
      minutes: 7,
      summary: "Package code into reusable spells with def.",
      sections: [
        { h: "def and return", p: ["Define a function with <code>def</code>, a name, parameters and a colon. <code>return</code> sends a value back."],
          code: "def greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Ada\"))   # Hello, Ada!", lang: "python" },
        { h: "Default values", p: ["Parameters can have defaults, and you can pass arguments by name."],
          code: "def attack(power, bonus=0):\n    return power + bonus\n\nprint(attack(5))            # 5\nprint(attack(5, bonus=3))   # 8", lang: "python" }
      ],
      points: ["<code>def name(params):</code> defines a function.", "<code>return</code> gives back a value.", "Defaults: <code>def f(x, y=0):</code>."],
      checks: [
        { q: "Which keyword defines a function?", options: ["def", "function", "func", "fn"], answer: 0, explain: "Python uses <code>def</code>." },
        { q: "What does <code>return</code> do?", options: ["Sends a value back from the function", "Prints a value", "Restarts the program", "Imports a module"], answer: 0, explain: "The caller receives the returned value." }
      ]
    },
    {
      title: "Errors & files",
      minutes: 7,
      summary: "Handle mistakes with try/except and read & write files.",
      sections: [
        { h: "try / except", p: ["When something can go wrong (like turning bad text into a number), catch the error so the program doesn't crash."],
          code: "try:\n    age = int(input(\"Age? \"))\nexcept ValueError:\n    print(\"Please type a number!\")", lang: "python" },
        { h: "Files", p: ["Use <code>with open(...)</code> to read or write files — it closes the file automatically. Mode <code>\"w\"</code> writes, <code>\"a\"</code> appends, <code>\"r\"</code> reads."],
          code: "with open(\"scores.txt\", \"w\") as f:\n    f.write(\"Ada 120\\n\")\n\nwith open(\"scores.txt\") as f:\n    for line in f:\n        print(line.strip())", lang: "python" }
      ],
      points: ["<code>try</code>/<code>except</code> catches errors.", "<code>with open(file, mode) as f:</code> is the safe way to use files.", "Modes: r = read, w = write, a = append."],
      checks: [
        { q: "What does <code>except ValueError:</code> do?", options: ["Runs if a ValueError happens in the try block", "Always runs", "Creates an error", "Stops Python forever"], answer: 0, explain: "It catches that type of error." },
        { q: "Why use <code>with open(...) as f:</code>?", options: ["It closes the file automatically", "It makes files bigger", "It's the only way to print", "It deletes the file"], answer: 0, explain: "The <code>with</code> block cleans up for you." }
      ]
    },
    {
      title: "Modules & packages",
      minutes: 6,
      summary: "Use Python's huge toolbox — and other people's code.",
      sections: [
        { h: "import", p: ["Python comes with a big <b>standard library</b>. Import what you need."],
          code: "import random\nimport math\nfrom datetime import date\n\nprint(random.randint(1, 6))   # dice roll\nprint(math.sqrt(16))          # 4.0\nprint(date.today())", lang: "python" },
        { h: "pip and packages", p: ["<code>pip</code> installs packages from PyPI — like <b>requests</b> for the web, <b>pandas</b> for data or <b>pygame</b> for games. Use a <b>virtual environment</b> per project."],
          code: "python3 -m venv .venv\nsource .venv/bin/activate\npip install requests", lang: "bash" },
        { h: "What next?", p: ["Build a guessing game, automate a boring task, scrape a website, or start the <b>AI basics</b> course — Python is the main language of AI."] }
      ],
      points: ["<code>import module</code> or <code>from module import name</code>.", "<code>pip install</code> adds packages from PyPI.", "Virtual environments keep projects separate."],
      checks: [
        { q: "How do you use the <code>random</code> module?", options: ["import random", "include random", "require(random)", "using random"], answer: 0, explain: "<code>import random</code>, then <code>random.randint(...)</code>." },
        { q: "What installs third-party Python packages?", options: ["pip", "git", "npm only", "python print"], answer: 0, explain: "<code>pip install name</code>." }
      ]
    }
  ],
  exam: [
    { q: "What does <code>print(\"Hi\")</code> do?", options: ["Shows Hi", "Saves Hi to a file", "Asks the user for Hi", "Nothing"], answer: 0, explain: "<code>print</code> writes output." },
    { q: "Which line creates a variable?", options: ["coins = 3", "var coins = 3;", "let coins := 3", "coins == 3"], answer: 0, explain: "Python assigns with a single <code>=</code>." },
    { q: "What type is <code>True</code>?", options: ["bool", "str", "int", "float"], answer: 0, explain: "True and False are booleans." },
    { q: "What type does <code>input()</code> return?", options: ["str", "int", "bool", "list"], answer: 0, explain: "Always a string — convert it if you need a number." },
    { q: "What is <code>len(\"pixel\")</code>?", options: ["5", "4", "6", "\"pixel\""], answer: 0, explain: "Five characters." },
    { q: "What is <code>\"pixel\"[-1]</code>?", options: ["l", "p", "e", "-1"], answer: 0, explain: "Negative indexes count from the end." },
    { q: "Which is an f-string?", options: ["f\"Hi {name}\"", "\"Hi\" + f", "format(Hi)", "{name}\"Hi\""], answer: 0, explain: "The f prefix enables <code>{ }</code> placeholders." },
    { q: "What does Python use to group the lines of an if-block?", options: ["Indentation", "Braces", "Parentheses", "END keyword"], answer: 0, explain: "Indentation is part of the syntax." },
    { q: "Which word combines two conditions so both must be true?", options: ["and", "&&", "plus", "with"], answer: 0, explain: "Python uses the words <code>and</code>, <code>or</code>, <code>not</code>." },
    { q: "What does <code>for i in range(1, 4):</code> loop over?", options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3", "4"], answer: 0, explain: "Start at 1, stop before 4." },
    { q: "What does <code>continue</code> do in a loop?", options: ["Skips to the next turn", "Stops the loop", "Repeats forever", "Exits the program"], answer: 0, explain: "<code>break</code> stops; <code>continue</code> skips." },
    { q: "How do you write an empty list?", options: ["[]", "{}", "()", "<>"], answer: 0, explain: "<code>{}</code> is an empty dictionary." },
    { q: "What does <code>\"key\" in bag</code> check?", options: ["Whether \"key\" is an item in the list", "The length of bag", "The first item", "Nothing — it's an error"], answer: 0, explain: "<code>in</code> tests membership." },
    { q: "What is <code>[x for x in [1, 5, 9] if x > 4]</code>?", options: ["[5, 9]", "[1]", "[1, 5, 9]", "True"], answer: 0, explain: "Only items above 4 are kept." },
    { q: "Which is a dictionary?", options: ["{\"hp\": 10}", "[\"hp\", 10]", "(\"hp\", 10)", "\"hp\" = 10"], answer: 0, explain: "Curly braces with key: value pairs." },
    { q: "What does <code>.items()</code> give you on a dictionary?", options: ["Key–value pairs", "Only keys", "Only the length", "A sorted list of values"], answer: 0, explain: "Use it as <code>for k, v in d.items():</code>." },
    { q: "Which keyword defines a function?", options: ["def", "function", "fun", "define"], answer: 0, explain: "<code>def name():</code>" },
    { q: "With <code>def f(x, y=2): return x + y</code>, what is <code>f(3)</code>?", options: ["5", "3", "6", "An error"], answer: 0, explain: "y uses its default of 2." },
    { q: "Which block catches an error?", options: ["except", "catch", "rescue", "onError"], answer: 0, explain: "Python uses <code>try</code>/<code>except</code>." },
    { q: "What does <code>pip install requests</code> do?", options: ["Installs the requests package", "Sends a web request", "Deletes Python", "Creates a variable"], answer: 0, explain: "pip downloads packages from PyPI." }
  ]
});

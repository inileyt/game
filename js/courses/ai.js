/* Course: AI basics — 10 lessons + 20-question final exam. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "ai",
  name: "AI basics",
  title: "AI Basics",
  color: "#c084fc",
  icon: "chip",
  theme: "space",
  blurb: "How machines learn from data — and how to use AI wisely and safely.",
  topics: "machine learning, data, training, neural networks, language models, prompting, AI tools, ethics and safety",
  lessons: [
    {
      title: "What is AI?",
      minutes: 5,
      summary: "Programs that learn patterns instead of following only hand-written rules.",
      sections: [
        { h: "Rules vs learning", p: ["Normal programs follow rules a person wrote: <i>if the email contains \"win money\", mark it as spam</i>. <b>Artificial intelligence</b> (AI) systems often <b>learn</b> the rules themselves by looking at many examples."] },
        { h: "Where you meet AI", p: ["Recommendations on video sites, face unlock, voice assistants, translation, spam filters, game opponents and chat assistants are all AI."] },
        { h: "Narrow AI", p: ["Today's AI is <b>narrow</b>: it is very good at specific tasks it was trained for, but it doesn't \"understand\" the world the way people do."] }
      ],
      points: ["AI systems learn patterns from examples.", "AI is all around you: recommendations, translation, assistants.", "Today's AI is narrow — great at specific tasks."],
      checks: [
        { q: "How do many AI systems get their rules?", options: ["They learn them from examples (data)", "A person writes every rule", "They guess randomly forever", "They read the user's mind"], answer: 0, explain: "Learning from data is the key idea." },
        { q: "Which is an example of AI?", options: ["A spam filter that learns from emails", "A light switch", "A paper calendar", "A pencil"], answer: 0, explain: "It learns what spam looks like." }
      ]
    },
    {
      title: "Machine learning",
      minutes: 6,
      summary: "Teaching computers with examples: supervised, unsupervised and reinforcement learning.",
      sections: [
        { h: "Three ways to learn", p: ["<b>Supervised</b> learning learns from labelled examples (photos labelled \"cat\"/\"dog\"). <b>Unsupervised</b> learning finds groups in unlabelled data (grouping players by play style). <b>Reinforcement</b> learning learns by trial and error with rewards (an agent learning to play a game)."] },
        { h: "Classification and regression", p: ["<b>Classification</b> predicts a category (spam or not spam). <b>Regression</b> predicts a number (tomorrow's temperature, a house price)."] }
      ],
      points: ["Supervised = labelled examples.", "Unsupervised = find structure without labels.", "Reinforcement = learn from rewards."],
      checks: [
        { q: "Learning from photos labelled \"cat\" or \"dog\" is…", options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Not learning"], answer: 0, explain: "The labels supervise the learning." },
        { q: "Predicting tomorrow's temperature (a number) is…", options: ["Regression", "Classification", "Clustering", "Encryption"], answer: 0, explain: "Regression predicts numbers." }
      ]
    },
    {
      title: "Data",
      minutes: 6,
      summary: "Models are only as good as the data they learn from.",
      sections: [
        { h: "Features and labels", p: ["Each example has <b>features</b> (inputs, like a player's level and play time) and, in supervised learning, a <b>label</b> (the answer, like \"will finish the game: yes\")."],
          code: "level | hours | daily_streak | finished?\n  3   |  1.5  |      2       |   no\n  9   |  12   |      15      |   yes", lang: "text" },
        { h: "Splitting data", p: ["Split data into a <b>training set</b> (to learn from) and a <b>test set</b> (kept hidden, to check how well the model works on new examples)."] },
        { h: "Garbage in, garbage out", p: ["Wrong, missing or <b>biased</b> data leads to bad predictions. Cleaning and checking data is a big part of real AI work."] }
      ],
      points: ["Features = inputs; labels = answers.", "Train on one part, test on unseen data.", "Bad or biased data → bad model."],
      checks: [
        { q: "Why keep a separate test set?", options: ["To check the model on data it hasn't seen", "To make training faster", "To store passwords", "It isn't needed"], answer: 0, explain: "It shows how well the model generalises." },
        { q: "What happens with biased training data?", options: ["The model can make unfair or wrong predictions", "Nothing changes", "The model becomes perfect", "Training stops"], answer: 0, explain: "Models copy patterns in their data — including bias." }
      ]
    },
    {
      title: "Training a model",
      minutes: 7,
      summary: "Guess, measure the error, adjust — repeat thousands of times.",
      sections: [
        { h: "The training loop", p: ["A model starts with random settings (<b>parameters</b>). It makes a prediction, a <b>loss</b> function measures how wrong it was, and the parameters are nudged to be a little less wrong. Repeat many times."],
          diagram: "training" },
        { h: "A tiny example", p: ["Here a model learns <code>y = w × x</code> where the right answer is <code>w = 2</code>."],
          code: "w = 0.0                       # random start\nfor step in range(50):\n    x, y = 3, 6               # example: 3 → 6\n    prediction = w * x\n    error = prediction - y\n    w -= 0.05 * error * x     # nudge w to reduce the error\nprint(round(w, 2))            # 2.0", lang: "python" },
        { h: "Overfitting", p: ["A model that memorises the training data but fails on new data is <b>overfitting</b> — like learning answers by heart without understanding. More data and testing on unseen data help."] }
      ],
      points: ["Predict → measure loss → adjust parameters → repeat.", "Training = gradually reducing the error.", "Overfitting = memorising instead of generalising."],
      checks: [
        { q: "What does the loss measure?", options: ["How wrong the model's predictions are", "How fast the computer is", "How big the dataset is", "How many users there are"], answer: 0, explain: "Training tries to make the loss smaller." },
        { q: "What is overfitting?", options: ["Doing great on training data but badly on new data", "Training too little", "Using a test set", "A type of GPU"], answer: 0, explain: "The model memorised instead of learning patterns." }
      ]
    },
    {
      title: "Neural networks",
      minutes: 7,
      summary: "Layers of tiny calculators inspired by the brain.",
      sections: [
        { h: "Neurons and layers", p: ["A <b>neural network</b> is made of layers of simple units (\"neurons\"). Each one multiplies its inputs by <b>weights</b>, adds them up and passes the result on. Data flows from the input layer through <b>hidden layers</b> to the output."],
          diagram: "neural" },
        { h: "Deep learning", p: ["Networks with many layers are called <b>deep learning</b>. Early layers learn simple patterns (edges in an image), later layers combine them into complex ones (eyes, faces). Training uses <b>backpropagation</b> to adjust millions or billions of weights."] },
        { h: "Why now?", p: ["Huge datasets, fast <b>GPUs</b> and better methods made deep learning practical in the last decade."] }
      ],
      points: ["Neurons weigh inputs and pass results on.", "Input → hidden layers → output.", "Deep learning = many layers, trained with backpropagation."],
      checks: [
        { q: "What does a neural network learn during training?", options: ["Its weights", "Its file name", "The user's password", "The screen size"], answer: 0, explain: "Weights are adjusted to reduce the loss." },
        { q: "What is deep learning?", options: ["Neural networks with many layers", "Learning underwater", "A database type", "Reading books slowly"], answer: 0, explain: "Deep = many layers." }
      ]
    },
    {
      title: "Language models",
      minutes: 7,
      summary: "How chat assistants predict the next word.",
      sections: [
        { h: "Next-token prediction", p: ["A <b>large language model</b> (LLM) is a huge neural network trained on lots of text to predict the next small piece of text (a <b>token</b>). Repeating that prediction, token by token, produces sentences, code and answers."],
          code: "\"The hero opened the …\"\n  → chest 41%   door 33%   portal 12%   ...", lang: "text" },
        { h: "Training stages", p: ["First, <b>pre-training</b> on large amounts of text teaches language and facts. Then <b>fine-tuning</b> with human feedback teaches the model to be helpful, honest and safe."] },
        { h: "Strengths and limits", p: ["LLMs are great at explaining, summarising, translating and writing code. But they can sound confident while being wrong (a <b>hallucination</b>), and they may not know recent events. Check important facts."] }
      ],
      points: ["LLMs predict the next token, again and again.", "Pre-training, then fine-tuning with feedback.", "They can hallucinate — verify important facts."],
      checks: [
        { q: "What does a language model fundamentally do?", options: ["Predicts the next piece of text", "Searches a database of exact answers", "Copies a random website", "Runs SQL"], answer: 0, explain: "Token by token prediction." },
        { q: "What is a hallucination?", options: ["A confident answer that is actually wrong", "A very fast answer", "An image filter", "A training dataset"], answer: 0, explain: "Always double-check important facts." }
      ]
    },
    {
      title: "Prompting well",
      minutes: 6,
      summary: "Get better answers from AI assistants.",
      sections: [
        { h: "Be clear and specific", p: ["Say what you want, who it's for, and the format. Give context and examples."],
          code: "❌ \"Explain loops\"\n\n✅ \"Explain JavaScript for-loops to a 12-year-old\n    beginner. Use one short game example and end\n    with a tiny exercise.\"", lang: "text" },
        { h: "Iterate", p: ["Treat it as a conversation: ask follow-ups, ask it to explain its reasoning or simplify, and correct it when it's wrong."] },
        { h: "Learning with AI", p: ["Use AI as a tutor: ask for hints instead of full answers, ask it to check <i>your</i> code, and make sure you understand everything you use."] }
      ],
      points: ["Be specific: task, audience, format, context.", "Iterate with follow-up questions.", "Ask for hints — learn, don't just copy."],
      checks: [
        { q: "Which prompt is better?", options: ["\"Explain for-loops to a beginner with one game example\"", "\"loops\"", "\"help\"", "\"???\""], answer: 0, explain: "Specific prompts get specific answers." },
        { q: "What's the best way to learn coding with an AI assistant?", options: ["Ask for hints and explanations, and understand the code", "Copy every answer without reading", "Never test the code", "Ask it to do all homework"], answer: 0, explain: "Use it as a tutor." }
      ]
    },
    {
      title: "Using AI in code",
      minutes: 7,
      summary: "Call an AI model from your own program through an API.",
      sections: [
        { h: "AI APIs", p: ["AI companies offer <b>APIs</b>: your program sends a request with a message and gets the model's reply back as JSON — just like any other web API."],
          code: "import requests, os\n\nresponse = requests.post(\n    \"https://api.example-ai.com/v1/chat\",\n    headers={\"Authorization\": f\"Bearer {os.environ['AI_API_KEY']}\"},\n    json={\"messages\": [{\"role\": \"user\", \"content\": \"Name a pixel hero\"}]},\n)\nprint(response.json())", lang: "python" },
        { h: "Keep keys secret", p: ["API keys cost money and belong on the <b>server</b>, in environment variables — never in frontend code or Git."] },
        { h: "Ideas", p: ["A hint button for coding exercises, a quiz-question generator, a chatbot for your game's NPCs, or an assistant that summarises long text."] }
      ],
      points: ["AI models are used through web APIs.", "Keep API keys on the server.", "Validate and check AI output in your app."],
      checks: [
        { q: "Where should an AI API key be stored?", options: ["On the server in an environment variable", "In the frontend JavaScript", "In a public GitHub repo", "In the page title"], answer: 0, explain: "Secrets stay on the server." },
        { q: "How does your program usually talk to an AI model?", options: ["By sending HTTP requests to an API", "By emailing it", "Through CSS", "It can't"], answer: 0, explain: "Request in, JSON response out." }
      ]
    },
    {
      title: "Ethics & bias",
      minutes: 6,
      summary: "Fairness, privacy and honesty with AI.",
      sections: [
        { h: "Bias", p: ["If training data under-represents some groups, a model may work worse for them — for example face recognition that fails more for some skin tones. Builders must test fairness across groups."] },
        { h: "Privacy and consent", p: ["Don't paste private information (passwords, addresses, other people's data) into AI tools. Companies must follow data laws and get consent."] },
        { h: "Honesty and credit", p: ["Be open when something was made with AI, respect copyright, and follow your school's or team's rules about AI use."] }
      ],
      points: ["Test models for fairness across groups.", "Keep private data out of AI tools.", "Be honest about AI use; respect copyright."],
      checks: [
        { q: "What can cause an AI system to be unfair?", options: ["Biased or unbalanced training data", "Using HTTPS", "A dark theme", "Short variable names"], answer: 0, explain: "Models learn the patterns in their data." },
        { q: "Should you paste your passwords into an AI chat?", options: ["No, never share private data", "Yes, it's always safe", "Only short passwords", "Only on weekends"], answer: 0, explain: "Keep secrets secret." }
      ]
    },
    {
      title: "AI safety & the future",
      minutes: 6,
      summary: "Building AI that is helpful, honest and safe — and careers in AI.",
      sections: [
        { h: "AI safety", p: ["As AI gets more capable, it matters more that it does what people actually intend and avoids harm. Researchers work on <b>alignment</b> (matching human goals), <b>evaluations</b> (testing for risky behaviour) and making models' reasoning more understandable."] },
        { h: "Using AI responsibly", p: ["Keep a human in the loop for important decisions, double-check outputs, and think about who could be affected."] },
        { h: "Careers", p: ["AI needs many skills: machine learning engineers, data scientists, researchers, designers, ethicists and safety specialists. Python, maths and curiosity are a great start — and everything you learned in Bitwood helps!"] }
      ],
      points: ["AI safety: aligned, tested and understandable systems.", "Humans stay in the loop for important decisions.", "Many careers combine AI with other skills."],
      checks: [
        { q: "What is AI alignment about?", options: ["Making AI do what people actually intend", "Lining up text on a page", "Sorting arrays", "Connecting cables"], answer: 0, explain: "Matching AI behaviour to human goals and values." },
        { q: "For an important decision (like medical advice), what's best?", options: ["Keep a qualified human in the loop", "Trust the AI blindly", "Ask the AI to decide alone", "Flip a coin"], answer: 0, explain: "AI assists; people stay responsible." }
      ]
    }
  ],
  exam: [
    { q: "What is a key idea of machine learning?", options: ["Learning patterns from data", "Writing every rule by hand", "Making websites colorful", "Storing passwords"], answer: 0, explain: "Examples teach the model." },
    { q: "Today's AI is mostly…", options: ["Narrow — good at specific tasks", "Conscious like a human", "Unable to do anything useful", "Only used in movies"], answer: 0, explain: "Narrow AI excels at trained tasks." },
    { q: "Training on labelled examples is called…", options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Compilation"], answer: 0, explain: "Labels supervise the learning." },
    { q: "Grouping players by play style without labels is…", options: ["Unsupervised learning", "Supervised learning", "Regression", "Encryption"], answer: 0, explain: "It finds structure on its own." },
    { q: "Learning to play a game through rewards is…", options: ["Reinforcement learning", "Supervised learning", "Data cleaning", "Hashing"], answer: 0, explain: "Trial, error and rewards." },
    { q: "Predicting \"spam\" or \"not spam\" is…", options: ["Classification", "Regression", "Rendering", "Routing"], answer: 0, explain: "Categories = classification." },
    { q: "In a dataset, what are features?", options: ["The inputs describing each example", "The final answers only", "The file names", "The colors of a chart"], answer: 0, explain: "Labels are the answers; features are inputs." },
    { q: "Why use a test set?", options: ["To measure performance on unseen data", "To train faster", "To hide bugs", "It's optional decoration"], answer: 0, explain: "It shows real-world performance." },
    { q: "What does \"garbage in, garbage out\" mean?", options: ["Bad data leads to bad predictions", "Delete old files", "Computers produce trash", "Training is always perfect"], answer: 0, explain: "Data quality matters." },
    { q: "During training, what is adjusted to reduce the loss?", options: ["The model's parameters (weights)", "The screen resolution", "The test set", "The user's input"], answer: 0, explain: "Weights are nudged step by step." },
    { q: "A model scores 99% on training data but 60% on new data. This is…", options: ["Overfitting", "Perfect generalisation", "Underflow", "Encryption"], answer: 0, explain: "It memorised the training data." },
    { q: "In a neural network, what does a neuron do?", options: ["Combines weighted inputs and passes a result on", "Stores a whole database", "Draws pixels", "Sends emails"], answer: 0, explain: "Simple units, powerful together." },
    { q: "What is deep learning?", options: ["Neural networks with many layers", "Studying for a long time", "A spreadsheet feature", "A cloud provider"], answer: 0, explain: "Many layers learn complex patterns." },
    { q: "Which hardware made deep learning much faster?", options: ["GPUs", "Floppy disks", "Printers", "Keyboards"], answer: 0, explain: "GPUs do many calculations in parallel." },
    { q: "What does a large language model predict?", options: ["The next token of text", "The weather only", "Stock prices only", "Image pixels only"], answer: 0, explain: "Token by token." },
    { q: "What is a hallucination in AI?", options: ["A confident but false answer", "A very creative drawing", "A training error message", "A faster model"], answer: 0, explain: "Verify important facts." },
    { q: "Which prompt will likely get the best answer?", options: ["A specific prompt with audience, task and format", "A single word", "Random letters", "An empty message"], answer: 0, explain: "Clarity gets quality." },
    { q: "Where should an AI API key live?", options: ["On the server, in an environment variable", "In the browser's JavaScript", "In a public repository", "In a URL shared online"], answer: 0, explain: "Keys are secrets." },
    { q: "Why can AI systems be unfair?", options: ["They learn biases present in their training data", "Because computers dislike people", "Because of dark mode", "They are always fair"], answer: 0, explain: "Test for fairness across groups." },
    { q: "What does AI alignment aim for?", options: ["AI that does what people actually intend, safely", "Faster typing", "Centered text", "Bigger datasets only"], answer: 0, explain: "Helpful, honest and harmless AI." }
  ]
});

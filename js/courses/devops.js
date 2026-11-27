/* Course: DevOps — 10 lessons + 20-question final exam. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "devops",
  name: "DevOps",
  title: "DevOps Engineering",
  color: "#38bdf8",
  icon: "crown",
  theme: "space",
  blurb: "Ship code safely and keep it running: Linux, Git, CI/CD, Docker, Kubernetes and the cloud.",
  topics: "Linux, Git, CI/CD, Docker, Kubernetes, the cloud, infrastructure as code, monitoring and reliability",
  lessons: [
    {
      title: "What is DevOps?",
      minutes: 6,
      summary: "Developers and operations working as one team to ship fast and safely.",
      sections: [
        { h: "Dev + Ops", p: ["In the past, <b>developers</b> wrote code and threw it over a wall to <b>operations</b>, who had to run it. Releases were slow and scary. <b>DevOps</b> is a culture where both work together, automate everything they can, and share responsibility for the running system."] },
        { h: "The DevOps loop", diagram: "devops-loop", p: ["Code moves around an endless loop. Every step is automated as much as possible, so small changes can go live many times a day."],
          code: "plan → code → build → test → release → deploy → operate → monitor ─┐\n  ▲                                                                  │\n  └──────────────────────── feedback ◀───────────────────────────────┘", lang: "text" },
        { h: "Why it matters", p: ["Small, frequent releases are <b>safer</b> than giant ones: if something breaks, you know exactly which small change caused it and can roll it back quickly."] }
      ],
      points: ["DevOps = culture + automation + shared responsibility.", "Code flows through an automated loop: build, test, deploy, monitor.", "Small, frequent releases are safer."],
      checks: [
        { q: "What is the main idea of DevOps?", options: ["Developers never talk to operations", "Development and operations work together and automate delivery", "Only deploy once a year", "Write code without tests"], answer: 1, explain: "Collaboration and automation." },
        { q: "Why are small, frequent releases safer?", options: ["They have no bugs", "Problems are easier to find and roll back", "They skip testing", "Users can't see them"], answer: 1, explain: "Less change at once = easier to fix." }
      ]
    },
    {
      title: "Linux command line",
      minutes: 8,
      summary: "Most servers run Linux — learn to move around with the terminal.",
      sections: [
        { h: "Moving around", p: ["The <b>terminal</b> lets you control a computer by typing commands. Most servers have no screen, so this is how DevOps engineers work."],
          code: "pwd                 # where am I?\nls -la              # list files (with hidden ones)\ncd /var/log         # change directory\nmkdir backups       # make a folder\ncat app.log         # print a file\ntail -f app.log     # follow a log live", lang: "bash" },
        { h: "Permissions", p: ["Every file has an owner and permissions: <b>r</b>ead, <b>w</b>rite, e<b>x</b>ecute. <code>chmod</code> changes them; <code>sudo</code> runs a command as the administrator (root) — use it carefully."],
          code: "chmod +x deploy.sh   # make a script runnable\n./deploy.sh          # run it\nsudo systemctl restart nginx", lang: "bash" },
        { h: "Pipes", p: ["The pipe <code>|</code> sends one command's output into another. Small tools combined = big power."],
          code: "grep \"ERROR\" app.log | wc -l    # count error lines", lang: "bash" }
      ],
      points: ["<code>pwd</code>, <code>ls</code>, <code>cd</code>, <code>mkdir</code>, <code>cat</code>, <code>tail</code>.", "Permissions: read, write, execute; <code>chmod</code> and <code>sudo</code>.", "Pipes <code>|</code> connect commands."],
      checks: [
        { q: "Which command lists the files in a folder?", options: ["cd", "ls", "rm", "pwd"], answer: 1, explain: "<code>ls</code> lists; <code>cd</code> changes folder; <code>pwd</code> prints the current folder." },
        { q: "What does the pipe <code>|</code> do?", options: ["Deletes a file", "Sends one command's output into the next command", "Makes a folder", "Logs you out"], answer: 1, explain: "<code>a | b</code> feeds a's output to b." }
      ]
    },
    {
      title: "Git & collaboration",
      minutes: 8,
      summary: "Branches, commits and pull requests — how teams change code safely.",
      sections: [
        { h: "Commits", p: ["Git records <b>snapshots</b> of your project called <b>commits</b>. Each has a message explaining the change, so you can go back in time."],
          code: "git status\ngit add index.html\ngit commit -m \"Add start button\"\ngit log --oneline", lang: "bash" },
        { h: "Branches", p: ["A <b>branch</b> is a separate line of work. Build a feature on its own branch, so the main branch always stays working."],
          code: "git switch -c feature/leaderboard\n# ...work and commit...\ngit push -u origin feature/leaderboard", lang: "bash" },
        { h: "Pull requests", p: ["A <b>pull request</b> (PR) asks to merge your branch. Teammates <b>review</b> the code, automated checks run, and then it's merged. Every feature of Bitwood arrived through a pull request!"] }
      ],
      points: ["A commit is a saved snapshot with a message.", "Branches keep work separate from the main branch.", "Pull requests = review + checks before merging."],
      checks: [
        { q: "What is a commit?", options: ["A saved snapshot of the project with a message", "A server", "A Docker image", "A deleted branch"], answer: 0, explain: "Commits are the history of your project." },
        { q: "Why work on a separate branch?", options: ["To keep the main branch working while you build", "Branches are faster computers", "Git requires one branch per file", "To skip reviews"], answer: 0, explain: "Main stays stable; your feature merges when ready." }
      ]
    },
    {
      title: "Continuous Integration (CI)",
      minutes: 8,
      summary: "Build and test every change automatically.",
      sections: [
        { h: "What is CI?", p: ["<b>Continuous Integration</b> means every push or pull request automatically <b>builds</b> the project and runs the <b>tests</b>. If something breaks, you know within minutes — before it reaches users."] },
        { h: "A pipeline file", diagram: "ci", p: ["CI services like <b>GitHub Actions</b>, GitLab CI or Jenkins read a file in your repo that describes the steps."],
          code: "# .github/workflows/ci.yml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm test", lang: "yaml" },
        { h: "Keep it green", p: ["A failing (\"red\") pipeline should block merging. Fix it right away — a broken build slows down the whole team."] }
      ],
      points: ["CI builds and tests every change automatically.", "Pipelines are described in a file (e.g. YAML).", "Red builds block merging until fixed."],
      checks: [
        { q: "When does CI usually run?", options: ["Once a year", "On every push or pull request", "Only when the server crashes", "Never automatically"], answer: 1, explain: "Every change gets built and tested." },
        { q: "In which format is a GitHub Actions workflow written?", options: ["YAML", "CSS", "PNG", "SQL"], answer: 0, explain: "Workflows live in <code>.github/workflows/*.yml</code>." }
      ]
    },
    {
      title: "Continuous Delivery & Deployment (CD)",
      minutes: 8,
      summary: "Get tested code to users quickly — and roll back when needed.",
      sections: [
        { h: "Delivery vs deployment", p: ["<b>Continuous Delivery</b>: every change that passes CI is <i>ready</i> to release with one click. <b>Continuous Deployment</b>: it goes live <i>automatically</i>, no click needed."] },
        { h: "Environments", p: ["Code usually travels through <b>environments</b>: <b>development</b> (your machine), <b>staging</b> (a copy of production for final checks) and <b>production</b> (real users)."],
          code: "push → CI tests ✓ → deploy to staging → checks ✓ → deploy to production", lang: "text" },
        { h: "Safe releases", p: ["Release gradually: a <b>canary</b> release sends new code to a few users first; <b>blue-green</b> keeps the old version running so you can switch back instantly. Always have a <b>rollback</b> plan."] }
      ],
      points: ["Delivery = ready to release; deployment = released automatically.", "Dev → staging → production.", "Canary, blue-green and rollbacks make releases safe."],
      checks: [
        { q: "What is a staging environment?", options: ["The real users' system", "A copy of production for final testing", "A developer's laptop", "A type of database"], answer: 1, explain: "Staging mirrors production so you can test safely." },
        { q: "What is a canary release?", options: ["Releasing to a small group of users first", "Releasing at night only", "Deleting old code", "A yellow theme"], answer: 0, explain: "If the canary is fine, roll out to everyone." }
      ]
    },
    {
      title: "Containers & Docker",
      minutes: 9,
      summary: "Package your app with everything it needs, so it runs the same everywhere.",
      sections: [
        { h: "\"It works on my machine\"", p: ["Apps depend on a language version, libraries and settings. A <b>container</b> packages the app <i>with</i> all of that, so it runs the same on your laptop, in CI and on servers."] },
        { h: "Images and containers", diagram: "docker", p: ["An <b>image</b> is the recipe/blueprint; a <b>container</b> is a running copy of it. You build images from a <b>Dockerfile</b>."],
          code: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]", lang: "docker" },
        { h: "Running it", p: ["Build the image, then run a container and map a port from your computer to the container."],
          code: "docker build -t bitwood-api .\ndocker run -p 3000:3000 bitwood-api\ndocker ps            # list running containers", lang: "bash" }
      ],
      points: ["Containers bundle the app with its dependencies.", "Image = blueprint, container = running instance.", "A Dockerfile describes how to build the image."],
      checks: [
        { q: "What is the difference between an image and a container?", options: ["They are the same", "An image is the blueprint; a container is a running instance of it", "A container is a picture file", "Images run, containers don't"], answer: 1, explain: "You run containers from images." },
        { q: "Which file describes how to build a Docker image?", options: ["package.json", "Dockerfile", "index.html", "README.md"], answer: 1, explain: "The Dockerfile lists the build steps." }
      ]
    },
    {
      title: "Orchestration & Kubernetes",
      minutes: 9,
      summary: "Run many containers across many servers — automatically.",
      sections: [
        { h: "Why orchestration?", p: ["One container is easy. Hundreds across many servers need help: restarting crashed ones, spreading load, rolling out updates. An <b>orchestrator</b> like <b>Kubernetes</b> (K8s) does this for you."] },
        { h: "Key Kubernetes objects", p: ["A <b>Pod</b> runs one or more containers. A <b>Deployment</b> keeps the right number of pods running and updates them gradually. A <b>Service</b> gives pods a stable network address."],
          code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: bitwood-api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: bitwood-api\n  template:\n    metadata:\n      labels:\n        app: bitwood-api\n    spec:\n      containers:\n        - name: api\n          image: bitwood-api:1.4\n          ports:\n            - containerPort: 3000", lang: "yaml" },
        { h: "Desired state", diagram: "k8s", p: ["You describe the <b>desired state</b> (\"3 replicas of version 1.4\") and Kubernetes keeps making reality match it. If a pod dies, it starts a new one."],
          code: "kubectl apply -f deployment.yaml\nkubectl get pods", lang: "bash" }
      ],
      points: ["Kubernetes runs and heals containers across many servers.", "Pod → Deployment → Service.", "You declare the desired state; K8s keeps it true."],
      checks: [
        { q: "What does a Kubernetes Deployment do?", options: ["Keeps the desired number of pods running and updates them", "Writes your code", "Stores passwords", "Draws the UI"], answer: 0, explain: "It manages replicas and rolling updates." },
        { q: "If a pod crashes, what does Kubernetes do?", options: ["Nothing", "Starts a new one to match the desired state", "Deletes the cluster", "Emails the CEO"], answer: 1, explain: "Self-healing is a core feature." }
      ]
    },
    {
      title: "Cloud & Infrastructure as Code",
      minutes: 8,
      summary: "Rent computers by the minute and describe them in code.",
      sections: [
        { h: "Cloud service models", p: ["Cloud providers (<b>AWS</b>, <b>Google Cloud</b>, <b>Azure</b>) rent you resources. <b>IaaS</b>: virtual machines you manage. <b>PaaS</b>: a platform that runs your app for you. <b>SaaS</b>: finished software you just use. Supabase, which powers Bitwood's accounts, is a managed backend platform."] },
        { h: "Infrastructure as Code (IaC)", p: ["Instead of clicking around a dashboard, describe servers, databases and networks in files. Tools like <b>Terraform</b> read the file and create everything — the same way, every time. The files live in Git, get reviewed in PRs, and can rebuild everything after a disaster."],
          code: "resource \"aws_instance\" \"web\" {\n  ami           = \"ami-0abc123\"\n  instance_type = \"t3.micro\"\n  tags = {\n    Name = \"bitwood-web\"\n  }\n}", lang: "text" },
        { h: "Pay for what you use", p: ["Cloud resources cost money while they run. Turn off what you don't need, set budget alerts, and use <b>autoscaling</b> to add servers only when traffic is high."] }
      ],
      points: ["IaaS = machines, PaaS = platform, SaaS = finished software.", "IaC describes infrastructure in code (e.g. Terraform).", "Autoscaling and budgets keep cloud costs under control."],
      checks: [
        { q: "What is Infrastructure as Code?", options: ["Writing HTML for servers", "Describing infrastructure in files that tools can apply automatically", "Coding without a computer", "A kind of CSS"], answer: 1, explain: "Repeatable, reviewable infrastructure." },
        { q: "Which model gives you virtual machines that you manage yourself?", options: ["SaaS", "PaaS", "IaaS", "CSS"], answer: 2, explain: "Infrastructure as a Service." }
      ]
    },
    {
      title: "Monitoring & logging",
      minutes: 7,
      summary: "Know your system is healthy — and hear about problems before users do.",
      sections: [
        { h: "Metrics, logs and traces", p: ["<b>Metrics</b> are numbers over time (requests per second, CPU, error rate). <b>Logs</b> are records of events. <b>Traces</b> follow one request through many services. Together they are called <b>observability</b>."] },
        { h: "Dashboards and alerts", p: ["Tools like <b>Prometheus</b> + <b>Grafana</b> collect metrics and draw dashboards. <b>Alerts</b> notify the on-call engineer when something crosses a threshold."],
          code: "ALERT  HighErrorRate\nIF     error_rate > 5% for 5 minutes\nTHEN   page the on-call engineer", lang: "text" },
        { h: "The golden signals", p: ["Watch four things for every service: <b>latency</b> (how slow), <b>traffic</b> (how much), <b>errors</b> (how many fail) and <b>saturation</b> (how full the resources are)."] }
      ],
      points: ["Metrics = numbers, logs = events, traces = request journeys.", "Dashboards show health; alerts wake someone up.", "Golden signals: latency, traffic, errors, saturation."],
      checks: [
        { q: "Which of these is a <b>metric</b>?", options: ["\"User 42 logged in at 10:03\"", "Requests per second over time", "A Dockerfile", "A Git branch"], answer: 1, explain: "Metrics are numbers measured over time; the first option is a log line." },
        { q: "What is an alert for?", options: ["To notify someone when a problem threshold is crossed", "To make the page faster", "To deploy code", "To write tests"], answer: 0, explain: "Alerts tell people to act." }
      ]
    },
    {
      title: "Security & reliability",
      minutes: 8,
      summary: "Least privilege, secrets, backups and calm incident response.",
      sections: [
        { h: "Least privilege and secrets", p: ["Give every person and service <b>only the access it needs</b>. Store secrets in a secret manager, rotate them, and scan code for leaked keys. Keep systems patched and dependencies updated."] },
        { h: "Backups", p: ["Back up databases automatically, keep copies in another location, and <b>test restoring</b> them — a backup you've never restored is just a hope."] },
        { h: "SLOs and incidents", p: ["<b>Site Reliability Engineering</b> (SRE) sets goals like \"99.9% of requests succeed\" (an <b>SLO</b>). When something breaks: stop the bleeding (roll back), communicate, fix, then write a <b>blameless postmortem</b> about what to improve."],
          code: "99.9% uptime per month ≈ 43 minutes of allowed downtime\n99.99%                ≈ 4 minutes", lang: "text" }
      ],
      points: ["Least privilege: only the access that's needed.", "Automate backups — and test restores.", "SLOs set reliability goals; postmortems are blameless."],
      checks: [
        { q: "What does \"least privilege\" mean?", options: ["Everyone gets admin access", "Each person or service gets only the access it needs", "No one can log in", "Only use free tools"], answer: 1, explain: "Smaller permissions = smaller damage if something leaks." },
        { q: "What is the most important thing about backups?", options: ["Having many of them", "Testing that you can actually restore them", "Storing them on the same server", "Naming them nicely"], answer: 1, explain: "Untested backups may not work when you need them." }
      ]
    }
  ],
  exam: [
    { q: "What does DevOps combine?", options: ["Design and marketing", "Development and operations", "Databases and CSS", "Testing and sales"], answer: 1, explain: "Dev + Ops working together." },
    { q: "Why does DevOps prefer small, frequent releases?", options: ["They are easier to test and roll back", "They need no testing", "Users prefer bugs", "They cost more"], answer: 0, explain: "Less change at once = less risk." },
    { q: "Which command shows the current folder?", options: ["ls", "pwd", "cd", "cat"], answer: 1, explain: "<code>pwd</code> = print working directory." },
    { q: "What does <code>chmod +x script.sh</code> do?", options: ["Deletes the script", "Makes the script executable", "Prints the script", "Moves the script"], answer: 1, explain: "+x adds execute permission." },
    { q: "What does <code>sudo</code> do?", options: ["Runs a command as administrator", "Undoes the last command", "Shows disk usage", "Opens a browser"], answer: 0, explain: "Use it carefully — root can change anything." },
    { q: "What is a Git branch?", options: ["A separate line of development", "A backup server", "A Docker container", "A test report"], answer: 0, explain: "Branches let you work without breaking main." },
    { q: "What is a pull request?", options: ["A request to merge a branch, with review and checks", "A way to download the internet", "A database query", "A Linux command"], answer: 0, explain: "PRs bring review and automated checks." },
    { q: "What does Continuous Integration do?", options: ["Builds and tests every change automatically", "Deploys once a month", "Replaces developers", "Designs logos"], answer: 0, explain: "Fast feedback on every change." },
    { q: "Where do GitHub Actions workflows live?", options: [".github/workflows/*.yml", "/etc/passwd", "index.html", "docker/images"], answer: 0, explain: "YAML files in <code>.github/workflows</code>." },
    { q: "What is the difference between continuous delivery and continuous deployment?", options: ["None", "Delivery = ready to release with a click; deployment = released automatically", "Delivery is for databases only", "Deployment skips testing"], answer: 1, explain: "Deployment removes the manual click." },
    { q: "Which environment do real users use?", options: ["Development", "Staging", "Production", "Localhost"], answer: 2, explain: "Production = live." },
    { q: "What is a rollback?", options: ["Going back to the previous working version", "A gymnastics move", "A database index", "A new feature"], answer: 0, explain: "Always have a way back." },
    { q: "Why use containers?", options: ["The app runs the same everywhere with its dependencies", "They make code shorter", "They replace Git", "They are a CSS feature"], answer: 0, explain: "No more \"works on my machine\"." },
    { q: "Which Dockerfile instruction sets the base image?", options: ["RUN", "FROM", "CMD", "COPY"], answer: 1, explain: "<code>FROM node:20-alpine</code>." },
    { q: "What does <code>docker run -p 8080:3000 app</code> do?", options: ["Maps port 8080 on your machine to port 3000 in the container", "Builds an image", "Deletes port 3000", "Starts Kubernetes"], answer: 0, explain: "host:container port mapping." },
    { q: "In Kubernetes, what keeps the desired number of pods running?", options: ["A Deployment", "A Dockerfile", "A commit", "A CDN"], answer: 0, explain: "Deployments manage replicas." },
    { q: "What gives a set of pods a stable network address in Kubernetes?", options: ["A Service", "A Secret", "A Volume", "A Branch"], answer: 0, explain: "Services route traffic to pods." },
    { q: "What is Infrastructure as Code?", options: ["Managing infrastructure through files and tools like Terraform", "Writing apps in assembly", "Drawing network diagrams", "Typing commands by hand on every server"], answer: 0, explain: "Repeatable and reviewable." },
    { q: "Which are the four golden signals?", options: ["Latency, traffic, errors, saturation", "HTML, CSS, JS, SQL", "Red, green, blue, alpha", "Dev, test, stage, prod"], answer: 0, explain: "Watch these for every service." },
    { q: "What is a blameless postmortem?", options: ["A report on what went wrong and how to improve, without blaming people", "Firing whoever broke production", "Deleting the logs", "A backup format"], answer: 0, explain: "Focus on systems, not blame." }
  ]
});

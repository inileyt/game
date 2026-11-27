/* Course: Git & GitHub — 10 lessons + 20-question final exam. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "git",
  name: "Git & GitHub",
  title: "Git & GitHub",
  color: "#fb923c",
  icon: "flag",
  theme: "desert",
  blurb: "Save every version of your work, travel back in time and build projects together.",
  topics: "commits, branches, merging, remotes, pull requests, conflicts and teamwork on GitHub",
  lessons: [
    {
      title: "Why version control?",
      minutes: 5,
      summary: "Never lose work again — and see exactly who changed what and why.",
      sections: [
        { h: "The problem", p: ["Without version control people save files like <code>final.html</code>, <code>final2.html</code>, <code>final-REALLY.html</code>… and still lose work. <b>Git</b> records every version of your project, so you can compare them or go back at any time."] },
        { h: "Git vs GitHub", p: ["<b>Git</b> is a program that runs on your computer and tracks changes. <b>GitHub</b> is a website that stores Git projects online (in <b>repositories</b>) and adds teamwork tools like pull requests and issues. GitLab and Bitbucket are alternatives."] },
        { h: "Install and set up", p: ["After installing Git, tell it who you are — your name goes into every commit you make."],
          code: "git --version\ngit config --global user.name \"Ada Lovelace\"\ngit config --global user.email \"ada@example.com\"", lang: "bash" }
      ],
      points: ["Git tracks every version of your files.", "GitHub hosts Git repositories online and adds collaboration tools.", "Set your name and email once with <code>git config</code>."],
      checks: [
        { q: "What is the difference between Git and GitHub?", options: ["They are the same thing", "Git tracks versions on your computer; GitHub hosts repositories online", "GitHub runs only on phones", "Git is a website, GitHub is a program"], answer: 1, explain: "Git is the tool; GitHub is a hosting service built around it." },
        { q: "What is a repository?", options: ["A project folder tracked by Git", "A type of commit message", "A web browser", "A password manager"], answer: 0, explain: "A repo is a project whose history Git tracks." }
      ]
    },
    {
      title: "Your first commit",
      minutes: 7,
      summary: "init, status, add and commit — the four commands you'll use every day.",
      sections: [
        { h: "Three areas", p: ["Git has three areas: the <b>working directory</b> (your files), the <b>staging area</b> (changes you picked for the next snapshot) and the <b>repository</b> (saved commits)."],
          diagram: "git-stages" },
        { h: "The daily loop", p: ["Check what changed, stage it, then commit it with a short message that says <i>why</i>."],
          code: "git init                 # start tracking this folder\ngit status               # what changed?\ngit add index.html       # stage one file\ngit add .                # or stage everything\ngit commit -m \"Add start button\"", lang: "bash" },
        { h: "Good commit messages", p: ["Write them in the imperative, like a command: <i>\"Add login form\"</i>, <i>\"Fix typo in footer\"</i>. Keep each commit small and about one thing."] }
      ],
      points: ["Working directory → staging area → repository.", "<code>git add</code> stages, <code>git commit</code> saves a snapshot.", "Small commits with clear messages."],
      checks: [
        { q: "What does <code>git add</code> do?", options: ["Saves a commit", "Moves changes to the staging area", "Deletes a file", "Uploads to GitHub"], answer: 1, explain: "It stages changes for the next commit." },
        { q: "Which command shows what has changed?", options: ["git status", "git push", "git init", "git clone"], answer: 0, explain: "<code>git status</code> lists modified, staged and new files." }
      ]
    },
    {
      title: "History & undo",
      minutes: 7,
      summary: "Read the history, see what changed and safely undo mistakes.",
      sections: [
        { h: "Looking back", p: ["<code>git log</code> lists commits, newest first. Every commit has a unique <b>hash</b> (an id like <code>a1b2c3d</code>). <code>git diff</code> shows exactly which lines changed."],
          code: "git log --oneline\n# a1b2c3d Add start button\n# 9f8e7d6 Create index page\n\ngit diff              # unstaged changes\ngit show a1b2c3d      # one commit in detail", lang: "bash" },
        { h: "Undoing safely", p: ["Throw away unsaved changes to a file with <code>git restore</code>. Undo a commit that is already shared with <code>git revert</code> — it makes a <i>new</i> commit that reverses the old one, so history stays honest."],
          code: "git restore index.html     # discard local edits\ngit restore --staged a.js  # unstage a file\ngit revert a1b2c3d         # undo a commit with a new commit", lang: "bash" },
        { h: "Ignoring files", p: ["A <code>.gitignore</code> file lists things Git should never track: secrets, build output, <code>node_modules</code>."],
          code: "# .gitignore\nnode_modules/\n.env\ndist/", lang: "bash" }
      ],
      points: ["<code>git log</code> and <code>git diff</code> show history and changes.", "<code>git revert</code> safely undoes a shared commit.", "<code>.gitignore</code> keeps secrets and junk out of Git."],
      checks: [
        { q: "Which command safely undoes a commit that others already have?", options: ["git delete", "git revert", "git init", "git status"], answer: 1, explain: "Revert adds a new commit that reverses the old one." },
        { q: "What belongs in <code>.gitignore</code>?", options: ["Your main HTML file", "Files Git should not track, like .env secrets", "Commit messages", "Branch names"], answer: 1, explain: "Never commit secrets or generated files." }
      ]
    },
    {
      title: "Branches",
      minutes: 7,
      summary: "Work on new ideas without breaking the main version.",
      sections: [
        { h: "What is a branch?", p: ["A <b>branch</b> is a movable label pointing at a commit. The default branch is usually called <code>main</code>. Create a new branch for every feature or fix, and <code>main</code> stays working."],
          diagram: "git-branch" },
        { h: "Commands", p: ["Create and switch branches with <code>git switch</code>."],
          code: "git branch                      # list branches\ngit switch -c feature/sound      # create + switch\n# ...edit, add, commit...\ngit switch main                 # go back", lang: "bash" },
        { h: "Naming", p: ["Use short, clear names like <code>feature/leaderboard</code> or <code>fix/login-error</code>."] }
      ],
      points: ["A branch is a pointer to a line of commits.", "<code>git switch -c name</code> creates and switches.", "One branch per feature keeps main stable."],
      checks: [
        { q: "What does <code>git switch -c feature/sound</code> do?", options: ["Deletes the branch", "Creates a new branch and switches to it", "Merges into main", "Pushes to GitHub"], answer: 1, explain: "<code>-c</code> means create." },
        { q: "Why use branches?", options: ["To work on features without breaking main", "To make Git faster", "To store passwords", "Branches are required for every file"], answer: 0, explain: "Main stays working while you experiment." }
      ]
    },
    {
      title: "Merging",
      minutes: 7,
      summary: "Bring a finished branch back into main.",
      sections: [
        { h: "git merge", p: ["When a feature is ready, switch to <code>main</code> and merge the branch in. If <code>main</code> didn't change meanwhile, Git simply moves the label forward (a <b>fast-forward</b>). Otherwise it creates a <b>merge commit</b> that joins both lines."],
          code: "git switch main\ngit merge feature/sound\ngit branch -d feature/sound   # delete the finished branch", lang: "bash" },
        { h: "Rebase (advanced)", p: ["<code>git rebase</code> replays your commits on top of the latest <code>main</code> for a straight history. Rule of thumb: never rebase commits other people already have."] }
      ],
      points: ["Merge combines a branch into another.", "Fast-forward = just move the pointer; otherwise a merge commit.", "Don't rebase shared history."],
      checks: [
        { q: "To merge <code>feature/x</code> into main, you first…", options: ["switch to main", "delete main", "switch to feature/x and run git init", "push feature/x"], answer: 0, explain: "You merge <i>into</i> the branch you're on." },
        { q: "What is a merge commit?", options: ["A commit that joins two lines of history", "A deleted commit", "The first commit", "A commit without changes"], answer: 0, explain: "It has two parents — one from each branch." }
      ]
    },
    {
      title: "Merge conflicts",
      minutes: 7,
      summary: "When two people change the same line — and how to fix it calmly.",
      sections: [
        { h: "Why conflicts happen", p: ["If two branches change the <b>same lines</b> of the same file, Git can't decide which version wins. It stops and asks you."] },
        { h: "Reading the markers", p: ["Git marks the conflict inside the file. Keep what's right, delete the markers, then add and commit."],
          code: "<<<<<<< HEAD\n<h1>Welcome, hero!</h1>\n=======\n<h1>Welcome, adventurer!</h1>\n>>>>>>> feature/title", lang: "text" },
        { h: "Fixing it", p: ["Edit the file to the version you want (maybe a mix of both), remove every <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> line, then finish the merge."],
          code: "git add index.html\ngit commit        # completes the merge", lang: "bash" }
      ],
      points: ["Conflicts happen when both sides change the same lines.", "Markers show HEAD (yours) vs the incoming branch.", "Edit, remove markers, add, commit."],
      checks: [
        { q: "When does a merge conflict happen?", options: ["When two branches change the same lines", "Every time you merge", "When a file is too big", "When you forget a commit message"], answer: 0, explain: "Different lines merge automatically; the same lines need you." },
        { q: "After fixing the file, what finishes the merge?", options: ["git add + git commit", "git init", "Deleting the repository", "git log"], answer: 0, explain: "Stage the fixed file and commit." }
      ]
    },
    {
      title: "Remotes: push & pull",
      minutes: 7,
      summary: "Connect your repo to GitHub and keep both in sync.",
      sections: [
        { h: "Remotes", p: ["A <b>remote</b> is a copy of the repo on another computer — usually GitHub. It's normally called <code>origin</code>."],
          diagram: "git-remote" },
        { h: "Commands", p: ["<code>clone</code> downloads a repo, <code>push</code> uploads your commits, <code>pull</code> downloads and merges others' commits."],
          code: "git clone https://github.com/user/game.git\ngit push -u origin feature/sound   # first push of a branch\ngit pull                            # get the latest changes\ngit fetch                           # download without merging", lang: "bash" },
        { h: "Pull before you push", p: ["If someone pushed first, Git rejects your push. <code>git pull</code>, fix any conflicts, then push again."] }
      ],
      points: ["<code>origin</code> is the usual name for the GitHub remote.", "clone = copy, push = upload, pull = download + merge.", "Pull first if your push is rejected."],
      checks: [
        { q: "Which command uploads your commits to GitHub?", options: ["git pull", "git push", "git clone", "git status"], answer: 1, explain: "Push sends your commits to the remote." },
        { q: "What does <code>git clone</code> do?", options: ["Copies a remote repository to your computer", "Deletes a branch", "Creates a commit", "Merges two branches"], answer: 0, explain: "Clone downloads the full repo with its history." }
      ]
    },
    {
      title: "Pull requests",
      minutes: 7,
      summary: "Propose changes, get reviews and merge as a team.",
      sections: [
        { h: "The PR flow", p: ["Push a branch, then open a <b>pull request</b> (PR) on GitHub. It shows the changes (the <b>diff</b>), runs automated checks, and lets teammates comment and approve before merging."],
          code: "1. git switch -c fix/footer-link\n2. commit the fix\n3. git push -u origin fix/footer-link\n4. open a PR on GitHub → review → merge ✓", lang: "text" },
        { h: "Good PRs", p: ["Keep PRs small and focused, write a clear description (what and why), add screenshots for visual changes, and respond kindly to review comments. Every Bitwood feature arrived as a PR!"] }
      ],
      points: ["A PR proposes merging a branch, with review and checks.", "The diff shows exactly what changes.", "Small, well-described PRs get merged faster."],
      checks: [
        { q: "What is a pull request?", options: ["A request to merge a branch, with review", "A way to download Git", "A Git command that deletes files", "A GitHub password"], answer: 0, explain: "PRs bring review and discussion before merging." },
        { q: "What makes a good PR?", options: ["Hundreds of unrelated changes", "Small, focused, with a clear description", "No description at all", "Merging without review"], answer: 1, explain: "Small and clear = easy to review." }
      ]
    },
    {
      title: "GitHub collaboration",
      minutes: 6,
      summary: "Issues, forks, READMEs and open source.",
      sections: [
        { h: "Issues", p: ["<b>Issues</b> track bugs, ideas and tasks. Link a PR to an issue by writing <code>Fixes #12</code> in the description and the issue closes when the PR merges."] },
        { h: "Forks and open source", p: ["A <b>fork</b> is your own copy of someone else's repository. Fork, make a branch, push to your fork and open a PR to the original — that's how anyone can contribute to open-source projects."] },
        { h: "README and licenses", p: ["A <code>README.md</code> explains what the project is and how to run it — GitHub shows it on the repo's front page. A <b>license</b> says how others may use your code."],
          code: "# Bitwood\nA pixel coding adventure.\n\n## Run it\npython3 -m http.server", lang: "text" }
      ],
      points: ["Issues track bugs and tasks; \"Fixes #12\" links PRs.", "Fork → branch → PR to contribute to open source.", "README explains the project; a license sets the rules."],
      checks: [
        { q: "What is a fork?", options: ["Your own copy of someone else's repository", "A merge conflict", "A deleted branch", "A type of commit"], answer: 0, explain: "Fork, change, and open a PR back." },
        { q: "Which file is shown on a GitHub repo's front page?", options: ["README.md", ".gitignore", "package-lock.json", ".env"], answer: 0, explain: "The README introduces the project." }
      ]
    },
    {
      title: "Git workflows & good habits",
      minutes: 6,
      summary: "How real teams use Git every day.",
      sections: [
        { h: "GitHub Flow", p: ["A simple, popular workflow: <code>main</code> is always deployable → create a branch → commit → open a PR → review + CI → merge → deploy. Repeat many times a day."],
          diagram: "git-flow" },
        { h: "Good habits", p: ["Commit often, pull often, keep branches short-lived, never commit secrets, write helpful messages, and use tags like <code>v1.0.0</code> to mark releases."],
          code: "git tag v1.0.0\ngit push origin v1.0.0", lang: "bash" }
      ],
      points: ["GitHub Flow: branch → PR → review → merge → deploy.", "Short-lived branches mean fewer conflicts.", "Tags mark releases."],
      checks: [
        { q: "In GitHub Flow, what is always true about main?", options: ["It's always deployable", "It's always empty", "Nobody can see it", "It's only for tags"], answer: 0, explain: "Work happens on branches; main stays ready to ship." },
        { q: "What is a Git tag often used for?", options: ["Marking a release like v1.0.0", "Deleting commits", "Making a branch private", "Fixing conflicts"], answer: 0, explain: "Tags are named pointers to important commits." }
      ]
    }
  ],
  exam: [
    { q: "What does Git do?", options: ["Tracks versions of your files", "Hosts websites", "Designs logos", "Runs databases"], answer: 0, explain: "Git is a version control system." },
    { q: "What is GitHub?", options: ["A website that hosts Git repositories", "A programming language", "A web browser", "A type of commit"], answer: 0, explain: "GitHub hosts repos and adds teamwork tools." },
    { q: "Which command starts tracking a folder with Git?", options: ["git init", "git start", "git begin", "git open"], answer: 0, explain: "<code>git init</code> creates a new repository." },
    { q: "What are the three areas in Git?", options: ["Working directory, staging area, repository", "Head, body, footer", "Client, server, database", "Red, green, blue"], answer: 0, explain: "Edit → stage → commit." },
    { q: "Which command saves a snapshot of staged changes?", options: ["git commit", "git add", "git push", "git diff"], answer: 0, explain: "Commit saves; add stages." },
    { q: "Which is the best commit message?", options: ["\"stuff\"", "\"Add login form\"", "\"asdfgh\"", "\"changes\""], answer: 1, explain: "Short, imperative and specific." },
    { q: "What does <code>git log --oneline</code> show?", options: ["A short list of commits", "Your password", "Only merge conflicts", "The staging area"], answer: 0, explain: "One line per commit with its hash." },
    { q: "Which command shows the exact lines that changed?", options: ["git diff", "git branch", "git tag", "git clone"], answer: 0, explain: "Diff compares versions line by line." },
    { q: "How do you safely undo a commit that's already pushed?", options: ["git revert <hash>", "Delete the .git folder", "git init again", "Edit the commit on GitHub"], answer: 0, explain: "Revert creates a new commit that undoes it." },
    { q: "What should never be committed?", options: ["Secret keys in a .env file", "index.html", "README.md", "style.css"], answer: 0, explain: "Put .env in .gitignore." },
    { q: "What is a branch?", options: ["A separate line of development", "A backup drive", "A remote server", "A conflict"], answer: 0, explain: "Branches let you work without touching main." },
    { q: "Which command creates and switches to a new branch?", options: ["git switch -c name", "git new name", "git branch --go name", "git make name"], answer: 0, explain: "<code>-c</code> creates it." },
    { q: "What is a fast-forward merge?", options: ["Main just moves forward to the branch's latest commit", "A merge that deletes history", "A very quick push", "A merge with conflicts"], answer: 0, explain: "No merge commit needed when main didn't change." },
    { q: "When does a merge conflict happen?", options: ["Two branches change the same lines of a file", "You merge any two branches", "A file is renamed", "You write a long message"], answer: 0, explain: "Git needs you to choose." },
    { q: "What does <code>=======</code> mean in a conflicted file?", options: ["It separates your version from the incoming one", "End of file", "A comment", "A successful merge"], answer: 0, explain: "Above: HEAD; below: the other branch." },
    { q: "What is <code>origin</code>?", options: ["The usual name of the main remote (e.g. GitHub)", "The first commit", "The main branch", "A merge tool"], answer: 0, explain: "<code>git push origin main</code>." },
    { q: "What does <code>git pull</code> do?", options: ["Downloads and merges changes from the remote", "Uploads your commits", "Creates a branch", "Deletes the remote"], answer: 0, explain: "Pull = fetch + merge." },
    { q: "What is a pull request?", options: ["A proposal to merge a branch, with review and checks", "A git command", "A password reset", "A deleted issue"], answer: 0, explain: "PRs are where teams review code." },
    { q: "How do you contribute to someone else's open-source project?", options: ["Fork, branch, push to your fork, open a PR", "Email them your password", "Push directly to their main", "Delete their repository"], answer: 0, explain: "That's the standard open-source flow." },
    { q: "What does writing <code>Fixes #12</code> in a PR description do?", options: ["Closes issue #12 when the PR is merged", "Deletes 12 commits", "Creates 12 branches", "Nothing"], answer: 0, explain: "GitHub links and closes the issue." }
  ]
});

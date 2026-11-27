# Bitwood — a pixel coding adventure
https://inileyt.github.io/game/

A small website for learning to code, styled like a 2D pixel game.

- **Home** (`index.html`) — animated 2D pixel adventure background (parallax sky, mountains, castle,
  forest, coins, slimes and a running hero — press <kbd>Space</kbd> or tap to jump) with a **START** button.
- **World map** (`levels.html?track=js|go|php`) — one animated pixel island per language; levels unlock one after
  another inside each language, and the first level of every language is open from the start.
- **Level** (`level.html?id=1…20`) — a short lesson and **5 questions**. JavaScript levels mix quizzes with coding
  tasks checked by hidden tests that run your code in a sandboxed Web Worker. Go and PHP can't run in a browser, so
  their levels use quizzes, **fill-in-the-blank** code and **build-the-program** line puzzles, all checked instantly. A pixel hero walks along the
  quest track after every answer; after question 5 he walks into a **portal** that takes you to the next level.
- **Bitwood Academy** (`courses.html`) — free **Frontend**, **Backend** and **DevOps** courses. Each has
  10 lessons (explanations, code examples, key points and 2 check-questions, +20 XP each) and a
  **20-question final exam** that unlocks after all lessons (pass with 14/20 → +150 XP, a badge and a
  course certificate). Answer options are shuffled every time.
- **Daily challenge** (`daily.html`) — a new coding puzzle every day, +50 XP and a day-streak counter.
- **Playground** (`playground.html`) — write any JavaScript, see the console, and paint 32×32 pixel art with
  `pixel(x, y, color)`; save it as a PNG.
- **Badges** (`badges.html`) — 18 badges to collect.
- **Certificate** (`certificate.html?track=…` / `?course=…`) — one per language (clear every level) and one per
  Academy course (pass the exam): type your name and download a pixel certificate.
- **Sound** — 8-bit sound effects and an original chiptune made live with the Web Audio API (toggle buttons
  in the menu; music is off until you turn it on).
- **Accounts & cloud save** — sign up / sign in (Supabase). XP, stars, badges, daily streak and code sync
  between devices; progress still works without an account (saved in the browser).
- **Leaderboard** (`leaderboard.html`) — top heroes by XP.
- **Contact form** — on the home page; messages are saved in the Supabase `messages` table
  (falls back to opening the visitor's email app if the database can't be reached).

| # | JavaScript | Topic |
|---|-------|-------|
| 1 | Variable Village | Variables & strings |
| 2 | Loop Forest | Loops |
| 3 | Condition Caves | If / else |
| 4 | Array Rapids | Arrays |
| 5 | Object Castle | Objects (mid-boss) |
| 6 | Map Mesa | Arrow functions & map |
| 7 | String Summit | String methods |
| 8 | While Swamp | While loops |
| 9 | Sort Volcano | Sorting arrays |
| 10 | Star Citadel | Final boss — everything |

| # | Go (beginner) | Topic |
|---|-------|-------|
| 1 | Hello, Go | Your first Go program |
| 2 | Gopher Grove | Variables & types |
| 3 | Frost Loop Peaks | If & for |
| 4 | Func Dunes | Functions |
| 5 | Slice Nebula | Slices & range — boss |

| # | PHP (beginner) | Topic |
|---|-------|-------|
| 1 | Echo Keep | Your first PHP program |
| 2 | Dollar Swamp | Variables & strings |
| 3 | Branching Caverns | If & loops |
| 4 | Function Forge | Functions |
| 5 | Array Archive | Arrays — boss |

Progress, XP and your code are saved in the browser (`localStorage`).

## Backend (Supabase)

GitHub Pages only serves static files, so the backend is [Supabase](https://supabase.com) — the site talks
to it directly from the browser. Connection values are in `js/config.js` (the publishable key is public by
design; access is controlled by Row Level Security). **Never put a secret / `service_role` key in the code.**

One-time setup in the Supabase dashboard:

1. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   This creates `profiles` (public leaderboard), `progress` (private cloud save) and `messages`
   (contact form), with their security rules.
   If you already ran it before the Go and PHP levels were added, also run
   [`supabase/migrations/002_go_php_levels.sql`](supabase/migrations/002_go_php_levels.sql) once.
2. **Authentication → URL Configuration**
   - Site URL: `https://inileyt.github.io/game/`
   - Redirect URLs: add `https://inileyt.github.io/game/**`
3. Read contact messages in **Table Editor → messages**.

Note: the free Supabase email sender only sends a few emails per hour (sign-up confirmations and password
resets). For more, set up custom SMTP under **Authentication → Emails**.

## Founder & contact

Founded by **Inna Babajanyan**

- Email: [innababajanyan06@gmail.com](mailto:innababajanyan06@gmail.com)
- Phone: [+374 93 186006](tel:+37493186006)

## Run it

No build step — it is plain HTML, CSS and JavaScript. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

It also works on GitHub Pages as-is.

## Design

Type follows the brief:

- Labels / buttons — PixelGridM 20px / 1.09, 700, letter-spacing 0.17em, `#042D4D`
- Headings — PixelGridM 24px / 1.5, 700, letter-spacing 0.004em, `#F8FAFC`
- Body — Mulish 18px / 1.5, 500, letter-spacing 0.08em, `#CBD5E1`

PixelGridM is a licensed font, so it is not bundled. It is used automatically when installed on the
device; otherwise the free pixel font **Silkscreen** (Google Fonts) is used. To self-host it, put the
font files in a `fonts/` folder and add a `url()` source to the `@font-face` rule at the top of
`css/style.css`.

All pixel art (hero, coins, slimes, scenery, map) is drawn in code — there are no image downloads.
Motion is turned off for visitors who prefer reduced motion.

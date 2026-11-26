# Bitwood — a pixel coding adventure

A small website for learning to code, styled like a 2D pixel game.

- **Home** (`index.html`) — animated 2D pixel adventure background (parallax sky, mountains, castle,
  forest, coins, slimes and a running hero — press <kbd>Space</kbd> or tap to jump) with a **START** button.
- **World map** (`levels.html`) — an animated pixel island with the **5 levels**; levels unlock one after another.
- **Level** (`level.html?id=1…5`) — a short lesson, a code editor with syntax highlighting and hidden tests
  that run your JavaScript in a sandboxed Web Worker. Clear a level to earn XP and up to 3 stars.

| # | World | Topic |
|---|-------|-------|
| 1 | Variable Village | Variables & strings |
| 2 | Loop Forest | Loops |
| 3 | Condition Caves | If / else |
| 4 | Array Rapids | Arrays |
| 5 | Object Castle | Objects (boss level) |

Progress, XP and your code are saved in the browser (`localStorage`).

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

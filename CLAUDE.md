# CLAUDE.md — QuantifyOps

## Project Overview
QuantifyOps is a construction project management web app. Single `index.html` file with supporting files in `src/`. Backend is Supabase (auth + database). Deployed on Vercel via GitHub.

## File Structure
```
index.html        ← main app (all CSS + JS inline)
src/
  auth.js         ← Supabase auth helpers
  nav.js          ← page navigation
vercel.json       ← Vercel routing config
.gitignore
```

## Local Preview
- Server runs permanently at **http://localhost:8080** via macOS LaunchAgent
- After making changes, user refreshes the browser to preview
- Never start a second server instance

## Deploy Workflow
1. Make changes to `index.html` (and `src/` files if needed)
2. User previews at `localhost:8080` and approves
3. Only push to GitHub when user explicitly says so
4. Push command: `git add -A && git commit -m "..." && git push`
5. Vercel auto-deploys from the `main` branch on GitHub (repo: github.com/LVTRANN/QuantifyOps)

## Design System
- **Font:** DM Sans (body), DM Mono (numbers/code) — loaded via Google Fonts
- **Primary accent:** `--accent: #E07B00` (orange) — use for highlights, active states, CTAs
- **Backgrounds:** `--bg`, `--bg2`, `--bg3`, `--bg-card` CSS variables
- **Text:** `--text`, `--text2`, `--text3` CSS variables
- **Nav:** Dark (`--nav-bg: #1e1d1a`), sticky top
- **Dark mode:** Automatic via `@media (prefers-color-scheme: dark)` — all colors use CSS variables
- **Border radius:** `--r: 6px` (small), `--rl: 10px` (large)
- **Active filter chips:** Orange (`--accent`) background

## Roles
- `admin` — full access (setup, user management)
- `supervisor` — daily log entry access
- `coordinator` — daily log entry access
- `viewer` — read-only

## Supabase
- URL and anon key are hardcoded in `index.html`
- Service role key (if needed for admin tasks) stored in `.env` — never commit this file
- Auth via `sb.auth.signInWithPassword()`

## Pages
- `dashboard` — project overview, metrics, category breakdown
- `items` — contract line items with category filter chips
- `daily` — daily log entry by date
- `report` — daily / weekly / monthly printable reports
- `log` — full entry log with filters
- `docs` — document uploads
- `setup` — admin only: items, groups, users

## Hard Rules
- Do not push to GitHub unless the user explicitly authorizes it
- Do not open a new tab/window for print — use `window.print()` inline
- Do not use Tailwind or any CSS framework — custom CSS variables only
- Do not add features or sections not requested
- Always edit `index.html` — not `index (3).html` (that is a backup)

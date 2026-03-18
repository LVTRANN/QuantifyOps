# CLAUDE.md — QuantifyOps

# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

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
- Always edit `index.html` — not `backup.html` (that is a backup)

# Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself
- Example: If you need to pull data from a website, don't attempt it directly. Read `workflows/scrape_website.md`, figure out the required inputs, then execute `tools/scrape_single_site.py`

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

**2. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with me before running again)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)
- Example: You get rate-limited on an API, so you dig into the docs, discover a batch endpoint, refactor the tool to use it, verify it works, then update the workflow so this never happens again

**3. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless I explicitly tell you to. These are your instructions and need to be preserved and refined, not tossed after one use.

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow with the new approach
5. Move on with a more robust system

This loop is how the framework improves over time.

## File Structure

**What goes where:**
- **Deliverables**: Final outputs go to cloud services (Google Sheets, Slides, etc.) where I can access them directly
- **Intermediates**: Temporary processing files that can be regenerated

**Directory layout:**
```
.tmp/           # Temporary files (scraped data, intermediate exports). Regenerated as needed.
tools/          # Python scripts for deterministic execution
workflows/      # Markdown SOPs defining what to do and how
.env            # API keys and environment variables (NEVER store secrets anywhere else)
credentials.json, token.json  # Google OAuth (gitignored)
```

**Core principle:** Local files are just for processing. Anything I need to see or use lives in cloud services. Everything in `.tmp/` is disposable.

## Bottom Line

You sit between what I want (workflows) and what actually gets done (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

Stay pragmatic. Stay reliable. Keep learning.

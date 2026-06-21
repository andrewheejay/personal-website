# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint (flat config: eslint-config-next/core-web-vitals + /typescript)
```

There is no test suite (no Jest/Vitest/Playwright/Cypress, no `test` script) — don't assume one exists.

## Architecture

Next.js App Router (`src/app/`) + TypeScript + Tailwind CSS v4. Path alias `@/*` → `./src/*`.

**Routing is fully static, file-based, and content-free of any data layer.** There are no dynamic `[slug]` routes, no CMS, no JSON/MDX content files. Each route is its own `page.tsx` with hardcoded JSX and its own exported `Metadata`:
- `/` — `src/app/page.tsx`, the homepage: a reverse-chronological "built" log.
- `/built/<slug>` — `src/app/built/<slug>/page.tsx` (e.g. `lime`, `phishfence`, `motion-segmentation`, `authentivox`).

**No shared project-page template component exists.** Every `built/*/page.tsx` independently re-implements the same markup by hand, following the convention documented in `project-page-template.md` (repo root). When adding or editing a project page, follow that skeleton:
1. Header — back link, title + year, tag row (only true tags), inline links (`github →`, `demo →`, `poster →` — only ones that actually exist, omit rather than grey out)
2. Opening paragraph — the real "why," not the homepage one-liner restated
3. "What you did" — length scales honestly with project depth
4. "The hard part" — *only if a real one existed*; omit rather than invent
5. Outcome — real numbers, or an honest plain-language description (never an unfilled bracket forever)
6. "What's next" — optional, only if genuinely ongoing
7. Footer — repeat links + back-to-home

Sections are included only if true and specific — never padded to make a thin project look deep.

**Styling**: Tailwind v4 is configured CSS-first — there is no `tailwind.config.js`. Theme tokens (`--color-ivory`, `--color-ink`, `--color-todo`) are defined in `src/app/globals.css` via `@theme`; add new colors/fonts there. Visual system across every page: ink (`#0B0C0C`) background, ivory (`#F4F1EB`) text, `font-mono` for tags/labels, underline-on-hover links, no decoration beyond that.

**Placeholders**: `src/app/components/Todo.tsx` renders amber `[bracketed]` text (`text-todo`) and is the only sanctioned way to mark not-yet-real data. Never fabricate a number or claim to fill the gap instead.

## Content voice

Site content (homepage and project pages) follows an explicit honesty rule: lowercase, plain language, and real limitations/bugs/tradeoffs stated inline near the claim they qualify — never hidden, never written as marketing copy. This applies to any prose edits, not just code.

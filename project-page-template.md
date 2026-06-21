# Project Page Template

Generalized outline for any individual project page (e.g. `/built/phishfence`). Same skeleton every time — sections are either true and specific, or omitted. Never pad a thin project to look like a deep one.

## 1. Header (always)
- `← back` link to the homepage log
- Project title, year
- Tag row for stack/domain (e.g. `bert` `nlp` `python`) — only tags that are actually true
- Inline links: `github →`, `demo →`, `poster →` — only the ones that exist; omit the rest entirely, don't grey them out

## 2. Opening paragraph — the real why (always)
Not the homepage one-liner restated. The actual problem or itch that started the project, in plain language. This paragraph proves it wasn't an assignment.

## 3. What you did (always — length scales with the project)
- Engineering project: architecture and key decisions, told as a narrative, not a spec sheet.
- Research project: the question you investigated and your method.
- Ops/leadership project: what was broken or missing before, and what you actually changed.

Length here is the honest signal of depth — three sentences for a lighter project, several paragraphs for a deep one is correct, not a flaw.

## 4. The hard part (only if one genuinely existed)
One real tradeoff, dead end, or judgment call. Skip the section entirely rather than inventing one — absence reads as honest, a fabricated "challenge" reads as filler.

## 5. Outcome (always — format depends on what exists)
- Real numbers where you have them: accuracy, dataset size, member growth, competition placement.
- If no metric exists yet, describe what happened in plain terms rather than leaving a bracket unfilled forever — "presented to 200 people" beats a TODO that never gets filled in.

## 6. What's next (optional)
Only if the project is genuinely ongoing. Drop it for closed, one-time things (e.g. a symposium that already happened).

## 7. Footer (always)
Repeat the relevant links, plus a back-to-home link.

## Visual system (applies to all project pages)
Same system as the homepage — ink background, ivory text, `font-mono` for labels/tags, no decoration beyond that. Clicking from the homepage log into a project page should feel like one site, not a tonal jump. Any placeholder data gets the same amber `[bracketed]` TODO treatment used on the homepage until it's replaced with something real.

# Project Page Template

Generalized outline for any individual project page (e.g. `/built/phishfence`). Same skeleton every time — sections are either true and specific, or omitted. Never pad a thin project to look like a deep one.

## 1. Header (always)
- `← back` link to the homepage log
- Project title, year
- Tag line for stack/domain, plain text joined with `; ` (e.g. `bert; nlp; python`) — only tags that are actually true. Keep them as an array in the source and `.join("; ")`, so they stay data rather than a hand-typed string
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
Two rows:
1. A `<nav aria-label="more projects">` with the adjacent entries in the log — `← newer · <name> (<year>)` and `older · <name> (<year>) →`. Omit the side that doesn't exist (newest and oldest pages have one link only).
2. The utility row: repeat the project links (`github →`, `poster →`), the email address in full, and `← all projects`.

Every footer link needs `inline-flex items-center min-h-[24px]` so it clears the 24px touch-target minimum. Never end a page on a back link alone — a reader convinced by the page should have somewhere forward to go.

## Visual system (applies to all project pages)
Same system as the homepage — themed background and text via the semantic tokens (`bg-bg`, `text-fg`), blue underlined links, `font-mono` for labels/tags. Check any new page in both light and dark. Use the type-role tokens and the `/60` contrast floor documented in `CLAUDE.md`; don't reach for raw Tailwind sizes. Wrap prose blocks in `max-w-measure`. Clicking from the homepage log into a project page should feel like one site, not a tonal jump. Any placeholder data gets the same amber `[bracketed]` TODO treatment used on the homepage until it's replaced with something real.

---

# Homepage Entry Template

Before the project page, every entry needs its one-line row in the log on `src/app/page.tsx`. This is the part most people read and the only part most people read.

## Shape

Three sentences. 29–36 words. All lowercase. No exceptions so far, and the consistency is doing real work — the log scans as a single rhythm.

```
1. THE PROBLEM      what it is, in plain terms, with the constraint that made
                    it hard folded in. not a category label ("an ML tool"),
                    the actual thing a person would struggle with.
                    13–24 words.

2. WHAT YOU DID     the method, or the number, or both. this is where the
                    evidence lives. if you have a real metric, it goes here
                    and nowhere else.
                    2–17 words.

3. WHERE IT LANDED  venue, role, award. a fragment, no verb, no period-heavy
                    padding. omit entirely if there is nowhere it landed —
                    do not invent a venue to fill the slot.
                    3–7 words.
```

## Worked examples (the three already in the log)

| | sentence 1 — problem | sentence 2 — what you did | sentence 3 — landed |
|---|---|---|---|
| **phishfence** | a phishing detector that explains itself, because telling someone "this is a scam" teaches them nothing | 99.31% accurate, and every verdict comes back with the reason in plain english | first author, bu rise data science practicum |
| **motion segmentation** | given raw motion-sensor data, find where one movement ends and the next begins | i benchmarked seven existing methods against each other, then tested whether a neural network could beat them | korea science service international research program |
| **authentivox** | catching a voice-phishing call while it is still happening, on a model small enough to run on an ordinary laptop with no graphics card | 98.46% accurate | ksef silver medal |

Note what sentence 1 never does: it never says "innovative", "cutting-edge", or "leveraging". It states a difficulty a reader can feel.

## In-progress entries

An entry for something not finished has no outcome, so sentence 3 has nothing true to put in it. Do not borrow the shape anyway. Instead:

```
1. THE PROBLEM      unchanged — what you are going after and why it is hard.
2. WHAT YOU ARE     present tense, and specific about what exists right now
   ACTUALLY DOING   versus what is still intended.
3. (omit)           or state the honest status: "started june 2026, nothing
                    shipped yet." an admitted blank beats a borrowed credential.
```

The honesty rule matters more here than anywhere else on the site: an unfinished thing described in the past tense reads as a finished thing, and that is the one failure mode this whole log is built to avoid.

## Where it goes in code

`src/app/page.tsx`, top of the `projects` array (reverse chronological):

```tsx
{
  slug: "summer-after-hs",   // omit entirely if there is no /built page yet;
                             // the row then renders black and unlinked
  year: "2026",
  name: "summer after hs",   // lowercase, no title case
  blurb:
    "sentence one. sentence two. sentence three.",
},
```

Leave `blurb: <Todo>what this is</Todo>` in place until the real text exists. Never ship a fabricated number or a placeholder written as if it were real.

## The check before you commit

Read the blurb out loud and ask: **could a stranger repeat back what this is and why it was hard?** If they could only repeat back that it sounded impressive, sentence 1 is wrong.

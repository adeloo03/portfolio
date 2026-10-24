# Portfolio — Abel Deloo

Portfolio for a fourth-year Computer Science student at Leiden University, applying for a
six-month graduation (thesis) internship, start date flexible (Q4 2026 or Q1 2027). Facts
(dates, roles) follow the CV; availability and role live in `src/content/about.ts` only.
Target audience: technical
recruiters and engineering leads at Dutch high-tech companies (ASML, Nedap, Thermo Fisher,
TomTom, Picnic and similar). They spend 6–10 seconds on first impression, often on mobile.

**All content in English.** These companies hire internationally and read in English.

## Positioning — the through-line

Everything on this site supports one claim: **Abel builds things that keep running.**

Not "passionate about technology", not a list of languages. Ownership and continuity,
demonstrated rather than asserted. The evidence is a self-hosted home server on repurposed
hardware that has been running Docker services in production for real users (himself, his
household) — with uptime numbers, a documented recovery procedure, and an incident log.

When writing copy, ask: does this show ownership of something that had to keep working?
If not, cut it.

## Concept

Dual-mode site. Same content, two views:

1. **UI mode** — normal, semantic, server-rendered HTML. Source of truth for SEO,
   screen readers, and recruiters who do not want to play a game.
2. **Terminal mode** — a working shell layered on top. This is the first impression.

The terminal is not decoration here: this is someone who actually administers a Linux
server. The interface matches the person. That is why it works — and why it must contain
real data, not props.

Both modes read from the same content in `src/content/`. Content is never maintained twice.
The mode toggle is always visible, never hidden behind an intro animation.

## Live data

The homelab pushes a sanitized status snapshot to the site. **Push-only, never inbound.**
No open ports, no internal hostnames, no IP addresses, no container names that reveal
what runs where beyond what Abel is happy to publish.

Contract — the homelab writes this JSON, the site only reads it:

```ts
type Status = {
  updatedAt: string      // ISO
  uptimeDays: number
  servicesUp: number
  servicesTotal: number
  lastIncident: string | null   // ISO date, or null
  lastRestoreTest: string | null
}
```

The site degrades gracefully when the snapshot is stale or missing: show the last known
values with a "last updated" timestamp. Never a broken widget, never a spinner that
never resolves.

## Stack

- Next.js (App Router) · TypeScript · Tailwind
- No extra dependencies without discussion. No xterm.js, no animation library, no UI kit.
  The terminal is handwritten — that is the point.
- Deploy: Vercel, at https://abeldeloo.dev (www redirects to the apex)

## Structure

```
src/
  content/          projects.ts, about.ts, timeline.ts, types.ts  ← all copy, typed
  app/              routes; server components unless state is required
  components/
    ui/             semantic UI-mode components
    terminal/       shell, command registry, output renderers
  lib/              fs.ts (virtual filesystem derived from content), status.ts, utils
```

## Rules

- Server components unless state or events are needed. `"use client"` only in
  `components/terminal/` and the theme toggle.
- Files kebab-case, components PascalCase.
- Tailwind only. No inline styles, no CSS-in-JS. Design tokens as CSS custom properties in
  `globals.css`: one accent colour, one neutral scale 50–950, two heading sizes.
- No `any`. Content types live in `src/content/types.ts` and are authoritative.
- Every animation respects `prefers-reduced-motion`: typewriter effect off, text appears
  immediately.

## Terminal requirements

Non-negotiable — without these the concept is a liability:

- **Fallback visible within one second.** A "switch to normal view" button, top right,
  from first render.
- **Mobile means tapping, not typing.** Tappable command chips above the input
  (`projects`, `homelab`, `about`, `contact`, `cv`). Nobody types `ls -la` on a phone.
- **Never an empty shell.** `whoami` runs automatically on load so there is content
  immediately. A blinking cursor with no explanation is a bounce.
- **Full keyboard support**: up/down for history, Tab completion, Ctrl+L clear, Ctrl+C cancel.
- **Everything is also a link.** Every `cat` output contains real `<a>` tags to live demo
  and repo. No read-only output.
- **No fake latency.** Artificial delay to feel "authentic" is irritating and costs exactly
  the seconds Abel has.

## Commands

Registry in `components/terminal/commands/`. Each command is a module exporting `name`,
`description`, `usage`, `aliases`, `run(args, ctx)`. `help` generates itself from the
registry — never maintained by hand.

Core: `help` · `whoami` · `ls` · `cd` · `cat` · `open` · `clear` · `theme` · `cv` ·
`contact` · `gui`

Live: `status` (homelab snapshot) · `uptime`

Unknown command returns a nearest-match suggestion ("did you mean: projects?"), never a
bare error.

## Project priority

Order on the site is deliberate. Do not reorder without discussion:

1. **Insect sound classifier (Naturalis)** — external client, team of six. A model built to
   be used: cheaper architecture when results tie, honest metric, output their platform reads.
2. **Homelab** — Proxmox, Compose stacks in git, PBS backups. The strongest infrastructure
   evidence and the least common.
3. **Status publisher** — the small service that feeds this site. Proof of end-to-end work.
4. **Messaging web app** — second-year university project, Python + SQL. Framed honestly
   as coursework, with a retrospective on what would be done differently now.

## Quality bar

- `npm run build` with zero warnings before every commit
- Lighthouse mobile: performance ≥ 95, accessibility 100
- Fully keyboard operable in both modes
- With JavaScript disabled, UI mode is visible and readable

## Commands (project)

```
npm run dev
npm run build
npm run lint
```

## What we do not do

Skill percentage bars · carousels · particle backgrounds · autoplay audio · contact form
without a backend · "passionate about technology" · projects without a stated problem ·
an intro animation that cannot be skipped · claiming traits instead of showing evidence.

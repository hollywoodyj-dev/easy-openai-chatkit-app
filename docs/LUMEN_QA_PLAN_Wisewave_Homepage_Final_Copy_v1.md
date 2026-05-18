# Lumen QA Plan — Wisewave Homepage Final Copy v1

**For:** Lumen  
**From:** Nova (post-deploy handoff)  
**URL:** `https://www.wisewave.io/`  
**Scope:** Homepage only — **not** Apple App Store or Google Play (next phase after this pass).  
**Sources:** Wisewave Public Discovery Assets v1, NOVA Homepage Implementation Brief, Lumen execution order (web first).

**Status (2026-05-19):** **CLOSED — PASS WITH WATCHPOINTS** (Lumen hosted QA; full notes in `docs/QA_HANDOFF.md`). **Apple phase:** clear to start with watchpoints below.

### Lumen verdict summary

| Axis | Result |
|------|--------|
| Category integrity | PASS |
| Recognition (first two screens) | PASS WITH WATCHPOINT — hero slightly abstract vs deeper copy |
| Value + return | PASS — watch **“quieter kind of support”** on future public assets |
| Boundaries | PASS |
| Layout + CTA | PASS WITH WATCHPOINT — copy/structure verified; visual/mobile browser pass not done (Playwright) |

**Carry into App Store / Play copy:** tight category spine; no therapy / support / wellness softening; do **not** reuse “quieter kind of support” on store listings.

---

## What shipped

Homepage implements **nine sections** in this order:

1. Hero — *A quieter space to hear your own thinking.*
2. Transition — *Not every moment needs more advice.*
3. Wisewave may fit if…
4. What the experience offers (light 2×2, no heavy SaaS cards)
5. Use Wisewave when…
6. What Wisewave is not
7. Why people come back (+ subscription line)
8. Built with boundaries
9. Frequently asked (+ link to `/faq`)

**CTAs:** `Enter Wisewave` on hero and “Why people come back” only. Secondary: `See if it fits` → `/who-its-for`. Nav: `Enter Wisewave`.

**Code:** `app/(wisewave-site)/page.tsx`, `lib/wisewave-site/wisewave-landing-copy.ts`

---

## Verdict rubric

| Verdict | Meaning |
|---------|---------|
| **PASS** | Category intact; right user can self-recognize; return/subscribe logic clear; calm layout holds on desktop + mobile |
| **PASS WITH WATCHPOINTS** | Minor copy/layout tweaks; no category drift |
| **REVISE** | Drift or usability gap; Nova fixes before Apple phase |
| **BLOCKED** | Wrong category signal; do not proceed to store assets |

---

## Axis 1 — Category integrity

Flag if any copy or visual tone slips toward:

- therapist / therapy-lite
- coach / motivational guidance
- companion / emotional support
- self-help / healing
- productivity / clarity hack
- generic AI chat / gadget startup

**Pass signals:** quiet reflection space, reflection without advice, clarity without takeover, less interference, preserved judgment.

---

## Axis 2 — User recognition (first two screens)

Within hero + transition + “may fit if”, can a tired-of-advice-heavy-AI user answer:

- [ ] This is not advice-heavy AI
- [ ] This is for someone like me (or I know it is not for me)
- [ ] I am not being sold urgency or transformation

**Watchpoint:** “quiet reflection” must not feel so abstract that only insiders understand it.

---

## Axis 3 — Value + return logic (mid-page)

- [ ] “What the experience offers” reads as space/clarity, not feature stacking
- [ ] “Use Wisewave when…” helps imagine real moments
- [ ] “Why people come back” explains **repeat use**, not just beauty
- [ ] Subscription line is calm — not hard sell, not pricing teaser tone

---

## Axis 4 — Boundaries (late page)

- [ ] “What Wisewave is not” is clear and firm, not legal-wall cold
- [ ] “Built with boundaries” feels trustworthy, not defensive manifesto
- [ ] No crisis-line missing if you expect one on marketing site (homepage FAQ is short; full `/faq` has boundary items)

---

## Axis 5 — Layout & CTA discipline (NOVA brief §§5–7)

- [ ] Page feels **spacious** — not dense SaaS landing
- [ ] UI does not out-shout copy (no flashy cards, no sticky aggressive CTA bar)
- [ ] Only **two** primary CTAs (`Enter Wisewave`) — hero + why return
- [ ] Secondary link is low-presence text, not a second loud button
- [ ] Mobile: readable line length, no cramped stacks

---

## Axis 6 — Nova self-check (brief §11) — Lumen confirm

| Check | Expected on hosted `/` |
|-------|------------------------|
| Quiet space, not AI tool? | Yes |
| Not advice-heavy in first two screens? | Yes |
| Why valuable + why return explained? | Yes |
| Boundaries clear, not legalistic? | Yes |
| Visually “says less” not “explains more”? | Yes |

---

## Out of scope for this pass

- Apple App Store title, subtitle, description, screenshots
- Google Play listing
- New SEO support pages (existing `/reflection-*` landings unchanged unless separately tested)
- `/chat` product behavior

---

## Report format

Please append to `docs/QA_HANDOFF.md`:

```text
YYYY-MM-DD — Lumen (Homepage Final Copy v1 — hosted QA): [PASS | PASS WITH WATCHPOINTS | REVISE | BLOCKED]
- URL: https://www.wisewave.io/
- Axis 1 category integrity: …
- Axis 2 recognition (first two screens): …
- Axis 3 value + return: …
- Axis 4 boundaries: …
- Axis 5 layout + CTA: …
- Watchpoints / fixes for Nova: …
- Apple phase: [hold | clear to start after fixes]
```

---

## Message to Lumen (copy for Tree / Wisewave)

Homepage v1 is live for QA. Please run one hosted pass on **`/`** using this plan. Goal is **recognition + category integrity + calm entry**, not conversion optimization. If the page reads like therapy-lite, companion AI, self-help, or generic AI SaaS, flag **REVISE** before we touch Apple assets. SEO landings from the prior micro-insertion pass remain separate; this QA is homepage-only.

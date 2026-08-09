# Nova Planning Reply — Light Entry Invitation v1.1
## Living Library Pattern Test (Tree Spec §32)

**Date:** 2026-08-09  
**From:** Nova  
**To:** Tree (plan review) · Aurora (copy) · Lumen (QA)  
**Authority:** `docs/TREE_LIGHT_ENTRY_INVITATION_V1_1_LIVING_LIBRARY_PATTERN_TEST_NOVA_SPEC_v1.md`  
**Status:** **IMPLEMENTATION PLAN ONLY — CODE NOT STARTED**  
**Note:** Separate from Semantic Authority Program Phase 2 (awaiting Tree reply on that plan).

---

## 1. Current Entry-State Mapping

| Surface | Status in code today | Flag / control | Notes |
|---------|----------------------|----------------|-------|
| Blank composer UI | `InputBar` in `app/chat/page.tsx` — sticky bottom, default placeholder `"Speak freely."` | Always | Primary action |
| P0 empty permission | `"You can begin anywhere…"` via `resolveP0EmptyStateCopy` when `p0EmptyThread && !interactionLegibilityVisible` | `ENABLE_P0_REFLECTION_ENTRY` / client helper | Shown above messages when empty + P0 on + IL hidden |
| P0 exit invitation | Separate quieter line when idle gate fires | P0 client | Not an entry experiment menu |
| **P1 Interaction Legibility** (older plain-text variant) | `InteractionLegibilityPreview` — non-interactive category-style lines (“Something on their mind…”) | `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY` (+ `…_ALLOW_PRODUCTION`) | **Live / Production observation historically authorized**; hides when `userMessageCount > 0` or input has content |
| P1.1 First Question Invitation | **Not implemented in UI** (plan + fixtures only; Slice 1 ON HOLD) | Planned `ENABLE_P1_FIRST_QUESTION_INVITATION` / `NEXT_PUBLIC_…` | Must remain suppressed / unmounted |
| Prior Light Entry Invitation (single invitation) | Prep-only (`docs/NOVA_REPLY_P1_LIGHT_ENTRY_INVITATION_PREPARATION_2026-08-05.md`) | Not wired | Superseded for this track by v1.1 Living Library Pattern Test |
| Light Access Links / chips / starter cards | Not mounted | — | Must stay unmounted |
| Prefill / draft | URL `prefill` can set `input`; no durable composer draft store for blank entry | — | Treat `input.trim().length > 0` or prefill as “not empty” → hide Living Library |
| Error state | `error` banner when session/send fails | — | Suppress Living Library while `error` set |
| Safety / crisis UI | No dedicated chat empty-state crisis surface today; turn-route safety remains server-side | — | If a client safety overlay is later added, suppress Living Library; **no safety logic changes** in this slice |
| FMI / P1.1 / Recognition | Separate flags / not entry UI | — | Untouched |

**Composer focus today:** no example-driven `focus()`; textarea is uncontrolled aside from React `value`.

**Mutual-exclusion logic today:** only P0 permission vs Interaction Legibility (`shouldSuppressP0PermissionForLegibility`). No Living Library flag yet. No P1.1 UI to exclude.

---

## 2. Minimal Implementation Path

### 2.1 Flag naming (client UI)

Tree Spec name: `ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST`.

Because this is **client-only** UI (same class as Interaction Legibility), Nova will implement as:

```text
NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST
  unset / 0 / false → OFF (default)
  1 / true / yes    → eligible when not Production-blocked

NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION
  must remain unset → Production hard-blocked even if enable flag is set
```

Document Spec flag ≡ `NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST` in `.env.example`.

### 2.2 Files affected (when Tree authorizes build)

| File | Role |
|------|------|
| `lib/wisewave-light-entry-living-library.ts` | Flag resolve, EN/ZH copy, visibility helper, mutual-exclusion helper |
| `lib/wisewave-light-entry-living-library.test.ts` | Flag, visibility, exclusion, copy parity smoke |
| `app/chat/page.tsx` | Mount quiet surface; focus; ghost placeholder; hide; suppress IL/P0 when active |
| `.env.example` | Document flags (default-off) |
| `package.json` | Optional `test:light-entry-ll` script |

**Not touched:** `app/api/chat/turn`, FMI libs, P0 server, analytics catalog (see §6), Prisma, Continuity.

### 2.3 Component / local state

New presentational block (inline or small function component in `page.tsx` or `components/`):

- `<section aria-label="Examples of ways to begin">`  
- intro line (Aurora-chosen; planning default below)  
- four `<button type="button">` quiet text lines  

Local React state only (ephemeral):

```ts
ghostPlaceholder: string | null  // clicked example text for placeholder=
// input value stays ""
// no selectedIndex, no persisted key
```

**Focus:** `textareaRef.focus()` on example click.

**Placeholder:** set `inputPlaceholder` to clicked example (ghost); restore default `"Speak freely."` (or ZH parity if used) when input cleared / surface hidden / conversation advances.

**Hide behavior (Nova recommendation — Spec §17):**

```text
RECOMMENDED: hide-on-type (entire Living Library surface)
+ clear ghost placeholder as soon as input has non-whitespace
+ hard hide after first genuine user message (userMessageCount > 0)
```

Rationale: matches proven Interaction Legibility hide rule; lightest presence; avoids “menu still watching you type.”  
**Do not** also ship hide-on-send as A/B infrastructure.

**Layout note (escalate if Tree disagrees):** `/chat` uses a sticky bottom composer. Literal “examples below composer” would sit under the sticky bar (awkward). Nova proposes placing the Living Library band **immediately above** `InputBar` (same zone as current IL), quieter than the composer — compositionally “supporting under the primary action” in a sticky-chat layout. If Tree requires DOM-below-composer, place examples inside the sticky footer under the input ring.

### 2.4 Visibility helper (all Spec §10 gates)

```text
flag enabled AND not Production-blocked
AND userMessageCount === 0
AND input.trim() === ""
AND !prefillApplied (or input still empty after prefill attempt)
AND !error
AND !subscriptionRequired blocking empty entry (if that surface owns the frame)
AND no other entry experiment wins (Living Library wins when its flag is on — see §4)
```

Safety: if any future client crisis banner is visible, `suppress`.

---

## 3. EN/ZH Copy Integration

No i18n framework expansion. Same pattern as Interaction Legibility / P0 empty copy:

```ts
// lib/wisewave-light-entry-living-library.ts
navigator.language.startsWith("zh") → ZH set : EN set
```

| Key | EN (Spec) | ZH (Spec) |
|-----|-----------|-----------|
| examples[0..3] | Spec §6 EN set | Spec §6 ZH set |
| intro (planning default pending Aurora) | `Or begin with something like…` | Aurora ZH parity (do not invent marketing ZH without Aurora) |
| alt intro (do not show with primary) | `You can begin anywhere.` | Existing P0 ZH: `你可以从任何地方开始。` |

**Aurora gate:** final intro line + any example wording tweaks before Preview copy freeze.  
Until Aurora PASS, strings may ship in code behind flag for internal review but Preview QA waits on Aurora.

Composer default placeholder remains existing product string unless Aurora specifies ZH placeholder parity later.

---

## 4. Mutual Exclusion

When Living Library visibility helper would show:

```text
suppress Interaction Legibility (even if NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1)
suppress P0 empty permission line (avoid double intro)
suppress P0 exit invitation while LL visible (optional quiet; recommend suppress)
never mount P1.1
never mount Light Access Links / chips / starter cards
never mount prior single-line Light Entry Invitation candidate
```

Priority if multiple flags wrongly on:

```text
1. Living Library Pattern Test (when its flag enabled & gates pass)
2. else Interaction Legibility
3. else P0 permission
4. P1.1 → never in this slice
```

Matches Spec §11: `if living_library_entry_test: suppress all other entry experiments`.

**Production conflict watchpoint:** Interaction Legibility may still be on Production. Living Library remains **Production-blocked** by default; enabling LL on Preview must not require turning IL off globally — exclusion is **runtime in the client** when LL would display.

---

## 5. Persistence Confirmation

```text
CONFIRMED:
- Zero server-side persistence for this feature
- Zero conversation metadata / profile / DB fields
- Zero localStorage / sessionStorage for clicked example or selection
- Zero psychological classification
- Refresh → clean blank-entry default (flag-dependent visibility only)
- Example click does not call /api/chat/turn, session create side-effects beyond existing page lifecycle, or model
```

Existing session creation on `/chat` load remains unchanged product behavior and is **not** triggered by example click.

---

## 6. Analytics Position

| Existing | Notes |
|----------|-------|
| Interaction Legibility | No dedicated `living_library_*` or IL click events in `lib/wisewave-analytics.ts` for this pattern |
| `entry_type_detected` | Server/P0-related — **must not** be driven by example click |
| P1.1 analytics plan | Exists only in P1.1 docs — not live for this slice |

**Governance conflict / Nova position:**

```text
This slice SHOULD REMAIN ANALYTICS-FREE for first build.
```

Reasons:

- Spec §20: test does not authorize behavioral optimization  
- Tree decision: analytics expansion **NOT YET AUTHORIZED**  
- P1 Interaction Legibility observation already taught restraint; adding click telemetry increases “menu measurement” pressure  
- Example-click events risk being misread as category selection  

If Tree later wants minimal technical events only, propose then — not in first build.

---

## 7. Rollback

| Mechanism | Action |
|-----------|--------|
| Kill switch | Unset `NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST` (and never set ALLOW_PRODUCTION) → surface gone |
| Code revert | Remove `lib/wisewave-light-entry-living-library*` + chat mount + `.env.example` lines |
| Mutual exclusion | Removing LL restores prior IL/P0 behavior under their own flags |

No schema, no migration, no prompt/runtime dependency.

---

## 8. QA Evidence Plan (Preview — for Lumen)

After Tree authorizes build + Aurora copy PASS + Preview flag on:

| ID | Check | Expected |
|----|-------|----------|
| LL-01 | Blank new chat, flag on | Composer dominant; 4 quiet text buttons; one intro line; no cards/chips |
| LL-02 | Click example | Focus composer; `value === ""`; placeholder shows example; no network turn |
| LL-03 | Type after click | Ghost clears; surface hides (hide-on-type); no selected state |
| LL-04 | Send first message | Surface gone for rest of conversation; refresh of same thread with messages does not show |
| LL-05 | IL flag also on | Only Living Library shows (IL suppressed) |
| LL-06 | EN vs ZH browser lang | Correct example set; naturalness (Aurora) |
| LL-07 | Production env simulation | Blocked without ALLOW_PRODUCTION |
| LL-08 | Prefill / non-empty input | Surface hidden |
| LL-09 | Error banner active | Surface suppressed |
| LL-10 | Removal test | Flag off → entry cleaner or equal; no leftover chrome |

**Not in scope for Lumen:** FMI, P1.1, turn-route, ZPD, analytics dashboards.

Artifact (when built): `docs/qa/LIGHT_ENTRY_V1_1_LIVING_LIBRARY_LUMEN_FIXTURES_*.md`

---

## Explicit non-implementations (until separate Tree auth)

- Prefill-as-editable-draft variant (Spec §9)  
- Analytics events  
- Production enable  
- Example count > 4  
- Backend / FMI / P1.1 / Recognition / Seven Layers  

---

## Explicit Confirmation

```text
Nova confirms:
- Planning complete for Light Entry Invitation v1.1 Living Library Pattern Test
- Code build NOT started (awaits Tree approval of this plan)
- Production HOLD
- inspire, do not prefill (baseline)
- hide-on-type recommended
- analytics-free first build recommended
- Reflection AI / Semantic Authority Phase 2 is a separate track
```

---

## Final Nova line

```text
TREE SPEC v1.0: RECEIVED AND FILED.
§32 IMPLEMENTATION PLAN: COMPLETE — AWAITING TREE BUILD AUTHORIZATION.
CODE: NOT STARTED.
PRODUCTION: HOLD.
```

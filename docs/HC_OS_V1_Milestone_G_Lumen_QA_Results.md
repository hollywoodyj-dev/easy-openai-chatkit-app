# HC_OS_V1 Milestone G — Lumen QA Results

## Status
- Overall status: **All planned Milestone G QA passes completed**
- Current pass: **All planned G QA passes complete**
- Closure state: **Pass 0P passed; Pass 1 passed with evidence note; Pass 2 passed; Pass 3 passed; Pass 4 passed with watchpoint; Pass 5 passed; Pass 6 passed with watchpoint; Pass 7 passed with watchpoint; Pass 8 passed**

**Formal acceptance gate (Wisewave):** Addendum **`docs/HC_OS_V1_Milestone_G_Addendum_Minimal_Integration_Everyday_Usefulness.md` §11** — all **seven** conditions must be satisfied to treat Milestone G as **complete**. **G0** names the shipped **code slice**; **§11 all green** authorizes **milestone** closure (this file now records that judgment below).

---

## Pass ledger

| Pass | Goal | Status | Verdict |
|---|---|---|---|
| Pass 0P | Deployment smoke | Complete | **Pass** |
| Pass 1 | G API / kill-switch integrity | Complete with evidence note | **Pass with evidence note** |
| Pass 2 | Coherence (one loop, not three layers) | Complete | **Pass** |
| Pass 3 | Ordinary life moments | Complete | **Pass** |
| Pass 4 | Anti-expansion & anti-presence | Complete | **Pass with watchpoint** |
| Pass 5 | Reflection-first & silence / restraint | Complete | **Pass** |
| Pass 6 | Founder demo (integration story) | Complete | **Pass with watchpoint** |
| Pass 7 | EN / ZH baseline parity | Complete | **Pass with watchpoint** |
| Pass 8 | Regression sniff (Milestone E/F) | Complete | **Pass** |

---

## Pass 0P — Deployment smoke

**Result:** Pass

### Live deployment proof
A normal successful turn response in the active environment included:
- `debug_milestone_g_build_marker: "milestone_g_v1"`
- `debug_milestone_g_integration_enabled: true`
- `debug_milestone_g_system_appendix_applied: true`

### Formal judgment
This is sufficient to confirm the correct Milestone G build is deployed and the integration appendix is active in the tested environment.

---

## Pass 1 — G API / kill-switch integrity

### Pass 1b — `MILESTONE_G_INTEGRATION=0` (kill-switch contract + turn JSON shape)

**Result:** Pass (recorded by Nova)

When the server runs with **`MILESTONE_G_INTEGRATION=0`**, `POST /api/chat/turn` must echo:

- `debug_milestone_g_integration_enabled`: **`false`**
- `debug_milestone_g_system_appendix_applied`: **`false`**
- `debug_milestone_g_build_marker`: still **`"milestone_g_v1"`** (deploy marker; not disabled by the kill switch)

**Example response fragment (one normal turn, G off)** — structure only; assistant text omitted:

```json
{
  "debug_milestone_g_integration_enabled": false,
  "debug_milestone_g_system_appendix_applied": false,
  "debug_milestone_g_build_marker": "milestone_g_v1"
}
```

**Local contract check (same booleans the route derives):**

```bash
node scripts/milestone-g-kill-switch-proof.cjs
```

Example stdout (2025-02-08):

```json
{
  "debug_milestone_g_integration_enabled": false,
  "debug_milestone_g_system_appendix_applied": false,
  "debug_milestone_g_build_marker": "milestone_g_v1",
  "env_MILESTONE_G_INTEGRATION": "0"
}
```

**How to replicate full HTTP proof:** Set `MILESTONE_G_INTEGRATION=0` in the server environment (e.g. `.env.local`), **restart** `next dev` / `next start`, send one normal chat turn, inspect JSON. Then **remove** the variable or unset it and restart so G is **on** again.

### Pass 1a / 1c

- **1a** (default G on): align with **Pass 0P** — `debug_milestone_g_system_appendix_applied: true` when integration enabled and system prompt path runs.
- **1c** (restore G on): live-host restore proof was captured. After removing `=0`, restarting the server, and sending a normal turn, the response again showed:
  - `debug_milestone_g_integration_enabled: true`
  - `debug_milestone_g_system_appendix_applied: true`
  - `debug_milestone_g_build_marker: "milestone_g_v1"`

### Pass 1 verdict

**Pass 1 passed with evidence note.**

### Formal judgment
Milestone G kill-switch behavior is now sufficiently proven for milestone QA:
- live G-on proof exists,
- live G-off proof exists,
- live restore-to-G-on proof exists,
- and Nova also supplied matching contract/script proof for the same booleans.

Evidence note:
- the kill-switch proof is now strong enough for milestone closure rigor,
- but the file still records that part of Nova’s supporting evidence came from contract/script validation in addition to the live-host turn snapshots.

---

## Pass 2 — Coherence (one loop, not three layers)

**Result:** Pass

### What was observed
From the reviewed emitted and quiet states, the product no longer reads like three disconnected add-ons sharing a chat. Instead, the support flow reads as:
- main reflection
- continuity clarification
- one optional embodied opening

### Why this passes
- Continuity does not feel arbitrarily attached to reflection.
- Embodiment does not feel like separate advice pasted after analysis.
- The screen can be read as one coherent support arc rather than three product ideas stacked together.
- The grouped UI behavior and the visible ordering of `Last insight` → `Pattern cue` → `Optional response` support this integrated read.

### Formal judgment
Milestone G is already achieving its core coherence claim at the product-read level: reflection, continuity, and minimal embodiment are reading as one support loop rather than three disconnected layers.

---

## Pass 3 — Ordinary life moments

**Result:** Pass

### What was observed
The tested moments were not idealized “deep reflection” turns. They included ordinary day-to-day situations such as:
- waiting for replies
- low-level self-blame
- uncertainty / scatteredness
- small relational activation

In those moments, the loop still landed as usable:
- reflection remained understandable
- continuity appeared when earned
- embodiment stayed bounded and optional
- quiet states remained valid

### Why this passes
The product did not require a larger utility structure to feel useful. It remained receivable in ordinary life moments without adding more steps, more visible structure, or more management logic.

### Formal judgment
Milestone G is demonstrating everyday usefulness in the intended narrow sense: not by doing more, but by making the existing loop easier to receive in ordinary emotional and relational moments.

---

## Pass 4 — Anti-expansion & anti-presence

**Result:** Pass with watchpoint

### What was observed
The reviewed screens and behavior remained visually narrow:
- no new workflow chrome
- no management or tasking surfaces
- no dashboard or utility scaffolding
- no larger system narration layer

At the same time, the product did feel somewhat more integrated / present than F alone, which is expected for G.

### Why this passes
- usefulness is being achieved through better coherence rather than obvious product-category expansion
- no new action architecture, planning layer, or visible management scaffolding appeared
- the loop still feels like support, not system over-presence

### Watchpoint
Because G’s whole point is “more naturally usable,” it is especially vulnerable to drifting into more constant system presence. That drift was **not** observed as a failure here, but it should remain actively watched.

### Formal judgment
Milestone G remains within the anti-expansion boundary so far, with an expected but still acceptable increase in felt integration presence.

---

## Pass 5 — Reflection-first & silence / restraint

**Result:** Pass

### What was observed
Across emitted and quieter states:
- reflection remained the center of gravity
- continuity and embodiment remained subordinate
- when support weakened, the loop quieted down rather than filling silence with extra integration behavior

### Why this passes
- the reading order remains: see what is happening → recognize thread → optional opening
- silence remains a success state
- integration did not reduce restraint or elevate embodiment over reflection

### Formal judgment
Milestone G preserves the reflection-first and silence-first discipline of E/F while making the loop feel more integrated.

---

## Pass 6 — Founder demo (integration story)

**Result:** Pass with watchpoint

### What was observed
The strongest founder-readable screens showed:
- ordinary-life moment
- reflection landing clearly
- continuity visible but bounded
- optional response present when earned
- quiet state returning when support weakens

### Why this passes
The overall integration story is now readable without a long defensive explanation: the product feels more naturally usable, but not like it has become a management or coaching system.

### Watchpoint
As with Milestone F, the strongest founder-demo path is cleaner in a compressed arc than in the heaviest middle continuation turns. Demo selection should favor the clearest coherent sequence rather than the most loaded example.

### Formal judgment
Milestone G can already support a founder-readable integration story, though the cleanest demo path should still be chosen deliberately.

---

## Pass 7 — EN / ZH baseline parity

**Result:** Pass with watchpoint

### What was observed
Chinese preserved the same broad product function seen in English:
- reflection first
- continuity when earned
- optional embodiment when earned
- quiet restraint when support weakens

### Why this passes
The product meaning remains aligned across languages: one coherent support loop, not a widened utility system.

### Watchpoint
Chinese reflection text still trends somewhat heavier / more explanatory than English. This was already a known watchpoint from F and remains relevant under G.

### Formal judgment
Milestone G is functionally holding EN / ZH baseline compatibility, with continuing tonal watch on heavier Chinese reflection language.

---

## Pass 8 — Regression sniff (Milestone E/F)

**Result:** Pass

### What was checked
Two UI states were inspected:

1. **Emitted state**
   - `Last insight`
   - `Pattern cue`
   - `Optional response`
   - main reflection still primary

2. **Weakened / silence state**
   - support strips quieted down
   - reflection remained coherent
   - product did not become noisier, stickier, or more system-heavy

### Why this passes
- Milestone G did not visually break Milestone E continuity behavior.
- Milestone F embodiment behavior still reads as small and subordinate.
- Reflection remains the center of gravity in both emitted and quieter states.
- Silence / restraint still function as success states when support weakens.
- The integrated loop reads as layered on top of E/F rather than replacing or distorting them.

### Formal judgment
Milestone G has **not** introduced an obvious regression into the underlying Milestone E/F substrate. The product still reads as:
- reflection first
- continuity second
- embodiment third
- quiet restraint when support weakens

---

## Current QA position

Milestone G QA is now effectively complete.

The shipped code is still correctly described as **G0**, the first minimal implementation slice — but that slice has now been tested far enough against the addendum that milestone-level judgment is warranted.

Current evidence supports the intended Milestone G direction:
- more coherent
- still light
- usable in ordinary moments
- not drifting into coaching / management / utility product behavior
- still reflection-first
- still restraint-preserving

---

## §11 acceptance gate (formal closure standard)

| §11 condition | Current status | Evidence note |
|---|---|---|
| 1. One coherent loop | **Pass** | Pass 2: product reads as one support arc rather than three stacked layers |
| 2. Usable in ordinary day-to-day situations | **Pass** | Pass 3: ordinary moments (waiting, uncertainty, self-blame, relational sting) remained usable without extra structure |
| 3. Product remains light and reflection-first | **Pass** | Pass 4 + Pass 5: reflection remains center of gravity; integrated loop still reads light |
| 4. Everyday usefulness does not require broader product expansion | **Pass with watchpoint** | Pass 4: no visible utility/productivity expansion, but system-presence drift should remain watched |
| 5. Silence and restraint still function as success states | **Pass** | Pass 5 + Pass 8: quieter states remain valid; loop quiets down when support weakens |
| 6. EN / ZH baseline compatibility still holds | **Pass with watchpoint** | Pass 7: function holds; Chinese reflection tone remains somewhat heavier than English |
| 7. Scope remained narrow | **Pass** | Tree confirmed at the G0 slice level that scope remained narrow, with no utility / management / productivity / action-architecture expansion evidenced |

---

## Overall Milestone G closure judgment

### Summary
All planned Milestone G QA passes are now complete:
- **Pass 0P:** Deployment smoke — **Pass**
- **Pass 1:** G API / kill-switch integrity — **Pass with evidence note**
- **Pass 2:** Coherence (one loop, not three layers) — **Pass**
- **Pass 3:** Ordinary life moments — **Pass**
- **Pass 4:** Anti-expansion & anti-presence — **Pass with watchpoint**
- **Pass 5:** Reflection-first & silence / restraint — **Pass**
- **Pass 6:** Founder demo (integration story) — **Pass with watchpoint**
- **Pass 7:** EN / ZH baseline parity — **Pass with watchpoint**
- **Pass 8:** Regression sniff (Milestone E/F) — **Pass**

### §11 acceptance gate judgment
All seven §11 conditions are **satisfied for milestone closure** (conditions **4** and **6** carry **non-blocking watchpoints** documented in the table above):
1. one coherent loop — **Pass**
2. usable in ordinary day-to-day situations — **Pass**
3. product remains light and reflection-first — **Pass**
4. everyday usefulness does not require broader product expansion — **Pass with watchpoint**
5. silence and restraint still function as success states — **Pass**
6. EN / ZH baseline compatibility still holds — **Pass with watchpoint**
7. scope remained narrow — **Pass**

### Final judgment
**Milestone G can be treated as passed, with non-blocking quality watchpoints.**

### Why Milestone G can close
Current evidence supports the intended Milestone G claim:
- reflection, continuity, and minimal embodiment now read as one coherent loop,
- that loop is usable in ordinary day-to-day moments,
- the product remains light and reflection-first,
- usefulness has not been purchased by broader utility / management expansion,
- silence and restraint still function as success states,
- English and Chinese preserve the same essential integration function,
- and Milestone G does not regress the underlying E/F substrate.

### Non-blocking watchpoints
- G should continue to be watched for subtle system-presence drift because “everyday usefulness” is especially vulnerable to becoming over-present.
- Founder-demo selection should favor the cleanest coherent arc rather than the heaviest middle continuation turns.
- Chinese reflection tone remains somewhat heavier / more explanatory than English.
- Pass 1 is fully sufficient for closure rigor, but the file still notes that part of the supporting proof came from contract/script validation in addition to live-host replay.

### Closure recommendation
**Recommend marking Milestone G complete** while carrying forward the above watchpoints as tuning items rather than closure blockers.

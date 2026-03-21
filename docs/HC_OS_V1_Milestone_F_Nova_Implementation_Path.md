# Milestone F — Nova implementation path (minimal embodiment bridge)

**Owner:** Nova  
**Status:** F1/F2 implemented — API + UI live; disable server-side with `MILESTONE_F_EMBODIMENT=0` if needed.  
**Governs:** `docs/HC_OS_V1_Milestone_F_Addendum_Minimal_Embodiment_Bridge.md`, Wisewave quality bar, OctopusMind boundary, `docs/HC_OS_V1_Milestone_F_Proof_Spec_v1.json`

---

## 1. Goal (one sentence)

Add **one optional, invitation-only embodiment cue** per turn **only when** a **recurrence cue is already emitted** for that turn, using templates and gates from the **F proof spec**, without new coaching surfaces, workflows, or action architecture.

---

## 2. Narrowest product placement

**Hierarchy (must not invert):**

1. **Main assistant reflection** — primary  
2. **`recurrence_cue`** (E1–E3) — secondary continuity / pattern legibility  
3. **`embodiment_cue`** (F) — tertiary: one grounded **response opening**  

**Binding rule for v1 (recommended):**

> Evaluate and emit **`embodiment_cue` only when `responseRecurrenceCue` is non-null** for the same turn.

**Why:** Recurrence emission is the product’s existing proof that a **repeated pattern is legible enough** to surface. If E2/E3 silence the recurrence cue, the same turn should **not** introduce a parallel “do this” layer (avoids **suggestion drift** and **hidden inference**).

*Alternative (out of scope for first slice unless Tree approves):* emit F when continuity is strong but recurrence is null — higher **category drift** and QA cost; do not implement without OctopusMind + Lumen agreement.

---

## 3. API shape (`POST /api/chat/turn` response)

Add an optional top-level object (only when non-null after gating):

```json
"embodiment_cue": {
  "pattern_key": "self_worth_pressure",
  "response_state": "light",
  "text_en": "…",
  "text_zh": "…"
}
```

**Fields (align with `implementation_shape.required_fields` in proof spec):**

| Field | Type | Notes |
|-------|------|--------|
| `pattern_key` | string | Same vocabulary as recurrence `pattern_key` (`generic` + pattern ids from spec). |
| `response_state` | `"light"` \| `"clear"` | Maps to `response_states` in proof spec (`light_opening` / `clear_opening`). |
| `text_en` / `text_zh` | string | **One sentence default**; **max two short sentences** per `length_rule`. Normalize whitespace; no newlines in v1. |

**Debug fields (always returned on successful turn — QA deployment smoke):**

- `debug_embodiment_f_build_marker`: `"milestone_f_v1"` — if **absent**, the running server is **not** on the F-instrumented build.  
- `debug_embodiment_f_milestone_enabled`: `true` unless `MILESTONE_F_EMBODIMENT=0`.  
- `debug_embodiment_f_outcome`: `"skipped_no_recurrence"` \| `"skipped_milestone_disabled"` \| `"skipped_no_e3_legibility"` \| `"emitted"`.  
- `debug_embodiment_f_suppressed_reason`: string \| null (e.g. `milestone_f_disabled`, `no_e3_legibility_state`).  
- `debug_embodiment_f_response_state`: `light` \| `clear` \| null (when emitted, matches `embodiment_cue.response_state`).  
- `debug_embodiment_f_used_ultra_short`: boolean \| null.

**Do not** add: task ids, steps, streaks, CTAs, or “mark complete” mechanics.

---

## 4. Template source of truth

- **Authoritative content:** `docs/HC_OS_V1_Milestone_F_Proof_Spec_v1.json`  
  - `generic_templates` / `pattern_templates` / `ultra_short_templates`  
  - `response_states`, `show_hide_rules`, `anti_pressure_rules`

**Implementation approach (pick one; both valid):**

1. **Inline TypeScript** — Copy template maps into `app/api/chat/turn/route.ts` (or `lib/wisewave-milestone-f-embodiment.ts`) and keep **in sync** with JSON when Wisewave updates copy.  
2. **Build-time or runtime load of JSON** — Single source file; slightly more plumbing in Next.

**Recommendation:** **`lib/wisewave-milestone-f-embodiment.ts`** exporting:

- `type EmbodimentResponseState = "light" | "clear"`  
- `embodimentCueText(patternKey, state, lang, variantSeed): { en: string; zh: string }`  
- Template tables mirroring JSON (generic + per-pattern + ultra_short fallback)

**Variant selection:** Reuse **`stableHashInt`** (same as E3) from a seed like `${userMsgId}:${insightId}:f:${patternKey}:${state}` so copy is stable per turn but not always identical.

---

## 5. Gating logic (F-only; recurrence unchanged)

Run **after** `responseRecurrenceCue` is fully resolved **and non-null**. If null → **skip F entirely** (all F debug null).

**Hard hides (map to `show_hide_rules.hide_if` + OctopusMind boundary):**

- `isVagueSource` → **no embodiment** (same turn as recurrence; recurrence already gated, but keep defensive check).  
- **Generic coaching risk:** optional linter pass on chosen string (v1: template-only, so risk is low if templates stay Wisewave-approved).  
- **Length:** enforce max **2 short sentences** in UI + server trim.  
- **Reflection-first:** if a future signal exists that “main reflection already carries the same opening,” hide (v2); v1 can omit unless cheaply detectable.

**State selection (`light` vs `clear`):**

- **Default conservative:** map from existing **E3** `legibilityState` when available:  
  - E3 `light` → F `light`  
  - E3 `clear` → F `clear`  
- If that coupling is too tight for product meaning, use a **small independent** heuristic (e.g. persistence phase → prefer `clear` only when E2 phase is `persistence` **and** user message length ≥ threshold) — document chosen rule in code comments and Lumen QA.

**Pressure / autonomy (minimal heuristic v1):**

- Prefer **`light`** when: user message very short, or `resolvedConfidence === "low"`, or `generic` pattern.  
- Prefer **`clear`** only when: `resolvedConfidence !== "low"` **and** (optional) persistence phase **and** user message above minimum length.

**Silence rule:** If the **stronger** template set would violate Wisewave “easier to decline than obey,” prefer **ultra_short** tier or **suppress** (`embodiment_cue: null`, `debug_embodiment_f_suppressed_reason: "pressure_risk"` or similar).

---

## 6. Server integration point (`app/api/chat/turn/route.ts`)

**Order of operations (conceptual):**

1. Existing: insight save, recurrence pipeline, E3 → **`responseRecurrenceCue`** final.  
2. **If** `responseRecurrenceCue === null` → do not compute F.  
3. Else:  
   - Determine `pattern_key` from recurrence (already `PatternId`).  
   - Select `response_state` (light/clear).  
   - Pick template variant (`stableHashInt`).  
   - Apply final F suppress checks.  
   - Set `embodiment_cue` on JSON response.  
4. **Assistant metadata (optional v1.1):** `wisewave_embodiment: { pattern_key, response_state }` for anti-repeat — only if Lumen finds **over-surfacing**; not required for first proof.

**Boundary:** F logic **must not** change `continuity_insight`, Last insight strip, or E3 recurrence gating. Only **adds** optional `embodiment_cue` when allowed.

---

## 7. Client integration (`app/chat/page.tsx`)

- Extend turn handler type with optional `EmbodimentCue` mirroring API.  
- **Stale-guard:** use the **same request-id pattern** as recurrence (or one combined ref) so out-of-order responses do not flash wrong embodiment text.  
- **Rendering:**  
  - Below recurrence strip (or below reflection + metadata cluster — **visually tertiary**).  
  - Smaller / lower-contrast than recurrence (exact classes TBD; must read **support**, not **CTA**).  
  - **No** buttons, checklists, or second column of “tasks.”  
- **Language:** `uiLang` already derived from last user message — show `text_en` or `text_zh` accordingly (same as recurrence).  
- **Truncate** to proof **length_rule** if server ever returns long text.

---

## 8. Explicit non-goals (Milestone F)

Per OctopusMind **out-of-scope** line — do **not** implement:

- Plans, routines, tasks, habits, accountability, recommendations  
- Therapeutic framing, motivational framing, “next step” product UX  
- Extra navigation, embodiment history browser, or settings surface for F  

---

## 9. QA alignment (for Lumen doc)

Lumen should verify (maps to proof spec `qa_checks` + Wisewave bar):

- Embodiment appears **only** when recurrence cue is present (v1 rule).  
- Copy is **invitation-shaped**; no should/need/next-step coaching.  
- **EN/ZH** optionality and lightness (not literal match).  
- **Silence** when suppression reason is set.  
- **Reflection-first** in UI ordering and visual weight.

---

## 10. Rollout suggestion

1. **Phase F0 — Docs only:** This file + Lumen QA plan (Tree ok).  
2. **Phase F1 — API + templates:** **Shipped** — `embodiment_cue` on `/api/chat/turn` when `recurrence_cue` is non-null; templates in `lib/wisewave-milestone-f-embodiment.ts`. **Disable:** set `MILESTONE_F_EMBODIMENT=0` (server env).  
3. **Phase F2 — UI:** **Shipped** — tertiary “Optional response” strip on `/chat` + same request-id stale guard as recurrence.  
4. **Phase F3 — Tune:** State selection + suppression reasons from Lumen feedback.

---

## 11. Related docs

- `docs/HC_OS_V1_Milestone_F_Proof_Spec_v1.json`  
- `docs/HC_OS_V1_Milestone_F_Wisewave_Embodiment_Cue_Quality_Bar.md`  
- `docs/HC_OS_V1_Milestone_F_OctopusMind_Embodiment_Boundary.md`  
- `docs/HC_OS_V1_Milestone_F_Execution_Addendum.md`  
- `docs/HC_OS_V1_Milestone_F_Addendum_Minimal_Embodiment_Bridge.md`

# HC-OS V1 Milestone D — Product Consolidation (EN/ZH baseline)

## Milestone D (HC-OS V1 consolidation)
Objective:
Turn the validated reflection checkpoint into a founder-readable, demoable, behavior-standardized product slice with a minimal multilingual baseline.

Core rule:
This is not expansion. This is product consolidation.

Additional Milestone D rules:
- English and Chinese do not need identical wording; they need equivalent function, tone, and continuity meaning.
- Continuity must not be stored as display text only.
- Use a stable underlying continuity identifier plus language-specific display text or source text.
- Regulation cue and next step are optional layers, not always-on layers.
- Keep only true live next-step work open on the board.

## Task streams (D1-D4)
1. Wisewave — reflection quality standard + response structure
2. OctopusMind — multilingual scope boundary
3. Nova — minimal implementation path for continuity save/display and demo flow
4. Lumen — QA path and founder demo verification

---

## 1. Wisewave task (D1)

1. Reflection quality bar
- what a good reflection must do
  - accurately mirror the user’s present experience
  - identify one plausible underlying pattern or tension
  - make that pattern feel clearer, not heavier
- what makes it meaningful rather than generic
  - it reflects the specific emotional logic of what the user shared, not just the topic
  - it names one real inner movement beneath the surface, such as avoidance, pressure, self-doubt, conflict, or over-efforting
  - it helps the user feel seen with precision, not summarized from a distance
  - it reduces inner fog by offering a small, grounded clarification
  - it stays close to what is actually supported by the input
- a reflection is too generic if it
  - only paraphrases what the user said
  - uses vague comfort language without insight
  - sounds interchangeable across many users
  - jumps to broad life advice too quickly
  - names a pattern with more certainty than the input supports
- Minimum quality standard
  - one clear mirror
  - one grounded insight
  - no exaggerated interpretation
  - readable in one pass
  - emotionally accurate enough that the user could think: "yes, that is close"

2. Tone standard
- choose the v1 tone
  - calm, guiding, minimal (v1)
- keep it lightweight, grounded, non-clinical, non-mystical
  - grounded
  - clear
  - warm but not intimate
  - thoughtful but not lofty
  - supportive without sounding therapeutic
  - must not feel clinical, mystical, preachy, or overly soft

3. Response structure
- define the canonical visible structure
  - canonical order:
    - main reflection
    - Last insight
    - regulation cue
    - next step
- separate layers
  - required layers
    - main reflection (1-3 sentences)
    - Last insight (1 sentence)
  - optional layers
    - regulation cue (1 sentence)
    - next step (1 sentence or short question)
- include
  - main reflection
  - Last insight
  - regulation cue
  - next step

4. Hide/show rules
- when optional layers should stay hidden
  - Regulation cue
    - show only when user appears emotionally flooded, highly tense, fragmented, or in visible overload
    - hide when reflection is already calm/clear, cue would feel too therapeutic, or user does not need stabilizing language
  - Next step
    - show only when it can be phrased simply, naturally follows from reflection, and adds a small opening (not homework)
    - hide when reflection lands cleanly without it or it would create too much cognitive load
- how to avoid overload
  - never show all optional layers by default
  - prefer fewer visible layers over fuller output
  - if main reflection is strong, let it stand
  - when in doubt, remove next step first
  - continuity should support reflection, not compete with it

5. Release threshold
- what counts as good enough for founder demo and QA
  - reflection quality consistently specific (not generic AI summarization)
  - tone stable: grounded, calm, minimal; not therapeutic/spiritual
  - structure coherent: main reflection always clear; optional layers only when justified; response not bloated
  - weak-input handling safe: low-signal input does not trigger heavy interpretation
  - continuity additive: Last insight feels relevant, not random/repetitive/forced
  - readable in one pass (no explanation gymnastics)
  - cross-language quality holds at baseline: same structure/function across English and Chinese (equivalent function, not identical wording)
- a Milestone D reflection fails if it
  - sounds generic
  - makes unsupported psychological claims
  - feels too therapeutic or too spiritual
  - overloads with too many layers
  - shows continuity irrelevant/confusing
  - turns weak input into heavy meaning

---

## 2. OctopusMind task (D2)

1. Boundary decision
- what "minimal multilingual baseline" means in Milestone D
  - the reflection checkpoint works in English and Chinese using the same underlying continuity meaning
  - keep multilingual support limited to a product-ready bilingual baseline
  - canonical continuity meaning stays language-neutral; visible wording may be language-specific

2. Included in scope
- English output for the Milestone D reflection slice
- Chinese output for the same slice
- continuity resurfacing in both languages
- consistent layer behavior across both languages:
  - main reflection
  - continuity / Last insight
  - regulation cue
  - next step
- stable save/display behavior when continuity concept is the same but visible language differs
- minimal prompt/spec guidance needed to keep both languages in the same product behavior standard
- QA checks confirming both languages meet the Milestone D baseline

3. Storage/display rule
- must remain language-agnostic in storage
  - underlying continuity concept
  - continuity eligibility/status
  - continuity type or pattern identity
  - core insight meaning
  - session/user linkage
  - timestamps/versioning
  - hide/show eligibility logic
  - resurfacing logic
- may be language-specific in display
  - final user-visible wording
  - sentence structure / phrasing style
  - language-specific readability adjustments
  - surface rendering of reflection, Last insight, regulation cue, next step

4. Parity rule
- acceptable English/Chinese parity in Milestone D
  - functional equivalence, not identical wording
  - functional equivalence means:
    - both languages express the same underlying continuity concept
    - both preserve the same response-layer roles
    - both follow the same hide/show logic
    - both preserve weak-input suppression behavior
    - both keep continuity resurfacing coherent and readable
    - both support the same founder demo path
  - parity does not require:
    - literal translation sameness
    - identical tone micro-nuance
    - identical sentence length/rhythm
    - deep cultural localization

5. Out of scope
- full localization architecture
- arbitrary multi-language support beyond English and Chinese
- translation management systems
- language-specific memory branches
- separate continuity logic by language
- deep cultural adaptation / region-specific rewriting
- historical insight translation system
- advanced multilingual analytics / tracking
- broader product expansion tied to multilingual features
- any architecture that turns Milestone D into a localization roadmap

6. Implementation constraint note
- Nova
  - store continuity as a language-neutral structured object, not as canonical English prose
  - render English and Chinese from the same underlying continuity meaning
  - keep resurfacing logic, suppression logic, and response-layer ordering identical across both languages
  - implement the narrowest path that proves bilingual continuity stability without introducing localization infrastructure
- Lumen
  - verify conceptual and behavioral equivalence, not literal wording equivalence
  - test that language changes do not corrupt continuity meaning, hide/show behavior, or resurfacing behavior
- Nova and Lumen
  - do not create language-specific forks in core product logic
  - keep Milestone D limited to one clean bilingual product slice that is founder-readable and demo-ready

---

## 3. Nova task

1. Minimal implementation path
- the narrowest viable path to complete Milestone D (D3):
  - keep the existing `/chat` slice shape (main reflection = assistant message; `Last insight` = continuity strip; optional banners = regulation cue + next step)
  - persist a stable continuity identity as `continuity_key`
  - persist canonical continuity meaning separately from user display text
  - make the UI render-time choose language-specific display text from `continuity_key` (not from canonical meaning prose)
  - ensure the client gets continuity deterministically on the same turn (already improved via `continuity_insight` returned from `POST /api/chat/turn`)
  - for English/Chinese baseline:
    - allow a demo `uiLang` toggle for QA
    - render continuity/regulation/next-step in `uiLang` using EN/ZH template maps
    - make the model’s main reflection output follow `uiLang` (no full localization system)

2. Continuity storage shape
- minimal schema/field structure with a clear separation of concerns:
  - Continuity identity (stable key):
    - `Insight.continuity_key: string` (the stable snake_case identifier; in practice this is derived from the continuity pattern family)
  - Canonical continuity meaning (language-agnostic internal meaning):
    - keep `Insight.corePattern` as the canonical internal meaning used for eligibility logic and continuity semantics
    - canonical meaning must not collapse into user-facing display prose: it is stored as internal meaning and never shown directly in the UI
    - Milestone D baseline rule: extraction outputs `corePattern` in a canonical internal language (English) even when the input is Chinese
  - Display text (language-specific, derived at render time):
    - UI derives `Last insight` display text from `{ continuity_key, uiLang }` using EN/ZH templates
    - optional: if you must store, store language-specific display text as a cache, but the canonical record is still `{ continuity_key, corePattern, is_continuity_eligible }`
  - unchanged fields:
    - `Insight.is_continuity_eligible: boolean`
    - `Insight.status`, `sourceMessageId`, timestamps (unchanged)
  - E-compatibility note (future continuity recurrence/history):
    - recurrence/history can be supported by querying multiple `Insight` rows over time and grouping by `continuity_key`
    - keep the schema keyed around `{ continuity_key, corePattern, is_continuity_eligible }` so later additions can extend metadata without breaking identity/display separation

3. Display behavior
- baseline English + Chinese behavior (functional equivalence, not wording sameness):
  - Language baseline rule (Milestone D):
    - input language: the user may input English or Chinese
    - `uiLang`: for Milestone D QA, `uiLang` is set by a demo toggle (allowed) and represents the user-facing language
    - model output language (main reflection): instruct the model to output the main reflection in `uiLang`
    - source language storage (continuity semantics): store canonical internal meaning (`corePattern`) in the canonical internal language (English), regardless of input language
  - required layer rendering:
    - main reflection:
      - assistant message rendered in `uiLang` (model output language)
    - `Last insight`:
      - use `continuity_key` from eligible continuity (from stored insight / continuity_insight)
      - render language-specific display text from `{ continuity_key, uiLang }` templates
  - optional layers (explicit mapping to hide/show rules, not vague “meaningfulness”):
    - `Regulation cue` shows iff:
      - `!latestIsVagueSource`
      - there is `latestRegulationMetadata`
      - `isRegulationCueMeaningful(latestRegulationMetadata)` is true
      - and `regulationLabelToCue(latestRegulationMetadata.regulation_label, uiLang)` returns a non-null cue
    - `Next step` shows iff:
      - `!latestIsVagueSource`
      - there is `latestMetadata`
      - `choiceLabelToActionPrompt(latestMetadata.choice_label, uiLang)` returns non-null
      - and `isActionPromptMeaningful(latestMetadata)` is true
    - (canonical order remains: main reflection → Last insight → regulation cue → next step)
  - weak/vague inputs:
    - preserve the established suppression: hide `Last insight`, regulation cue, next step, and “What was noticed”

4. Demo path support
- founder-readable demo must exist for Milestone D:
  - one “strong continuity” scenario that produces an eligible `continuity_key`
  - one weak control scenario that produces no eligible continuity
  - a single bilingual toggle (or two quick runs) demonstrating:
    - EN slice: main reflection + `Last insight` visible (and optional cue/next step only when legitimately triggered)
    - ZH slice: same functional layers with ZH display text and equivalent show/hide behavior
  - demo success criteria:
    - founder can understand the slice without opening debug metadata
    - `Last insight` remains stable after reload (same eligible continuity shows again)

5. Scope guard
- explicitly not built in Milestone D:
  - full localization framework (translation management, locale files, pluralization rules, etc.)
  - arbitrary multi-language expansion beyond EN + ZH
  - separate continuity logic per language
  - architectural sprawl (no new orchestration layer; no new prompt redesign beyond canonical continuity meaning + EN/ZH display)

## 4. Lumen task

1. QA checklist
- reflection quality checks
  - confirm main reflection does more than paraphrase:
    - it mirrors the present user state accurately
    - it names at most one grounded underlying tension/pattern
  - reject outputs that are:
    - generic
    - over-interpreted
    - preachy / mystical
    - therapy-like
  - pass bar:
    - readable in one pass
    - emotionally precise
    - brief
    - founder-readable without explanation gymnastics
- structure consistency checks
  - verify canonical visible order stays:
    1. main reflection
    2. `Last insight`
    3. regulation cue *(optional)*
    4. next step *(optional)*
  - verify main reflection remains primary (no optional layer “steals” the response)
  - verify optional layers appear only when explicitly warranted:
    - weak/vague turns must suppress regulation cue + next step + layered overload
    - optional layers must not show by default
  - verify the response never feels bloated in either EN or ZH
- continuity save/display checks
  - language-agnostic identity requirement (applies to EN and ZH):
    - continuity must be stable and tied to underlying identity, not prose-only display
  - strong case (same eligible continuity expected):
    - confirm eligible continuity is created:
      - `/api/chat/turn` returns `continuity_insight` with `is_continuity_eligible: true`
      - `continuity_insight.continuity_key` is present
    - confirm `Last insight` renders in the same session
    - confirm reload correctness:
      - `GET /api/chat/continuity` returns non-null `insight`
      - returned `insight.continuity_key` matches the expected eligible identity
      - `Last insight` renders again after reload
    - confirm ZH display path uses language-specific templates:
      - in ZH, `Last insight` display should derive from `continuity_key` → ZH template
      - fail if ZH visibly falls back to English continuity prose when a key-based template exists
  - weak/vague case (control):
    - confirm no `Last insight`
    - confirm no accidental resurfacing after reload
    - confirm regulation cue and next step do not show
    - confirm “What was noticed” remains hidden for weak/vague control (header stays out of view)
    - verify UI continuity matches API continuity meaning:
      - if API continuity is null/non-eligible, UI must not render continuity-related layers
      - if UI renders while API indicates null, fail as a render/state bug
- English/Chinese baseline checks
  - run a minimal scenario set in both directions:
    - one strong continuity case
    - one weak suppression case
    - one regulation-cue-trigger case
    - one next-step-trigger case
  - run each scenario with English input and Chinese input
  - verify:
    - same layer ordering in both EN and ZH
    - same hide/show behavior under equivalent conditions
    - continuity meaning preserved via `continuity_key` (not identical wording)
    - equivalent tone class: lightweight, grounded, non-clinical, non-mystical

2. Demo acceptance checklist
- founder can view one clean EN slice and one clean ZH slice
- each slice is understandable without debug metadata
- main reflection feels specific, grounded, and brief
- `Last insight` appears only when genuinely earned
- continuity wording is readable and user-facing
- regulation cue appears only when the turn warrants stabilization
- next step appears only when it adds a small opening/value (not homework)
- weak control stays quiet:
  - no continuity
  - no forced cue
  - no forced next step
  - reload does not break continuity readability or trust
  - the slice feels like a coherent product, not a partially working prototype
- UI clarity check:
  - “What was noticed” (collapsible) remains unobtrusive by default and does not appear for weak/vague control

3. Parity check rule
- EN/Chinese parity passes when:
  - the same underlying continuity meaning is preserved (via `continuity_key`)
  - the same visible layers are shown/hidden under equivalent conditions
  - product function is preserved across:
    - present reflection
    - continuity
    - stabilization
    - gentle forward movement
  - tone stays lightweight, grounded, non-clinical, non-mystical in both languages
- parity does NOT require:
  - identical wording
  - literal translation
  - identical rhythm or phrasing nuance
- parity test question:
  - “Does this do the same product job in both languages?”
  - not: “Are these the same words?”

4. Failure conditions
- Milestone D fails or requires revision if any of these happen:
  - main reflection is generic, bloated, or over-interpreted
  - `Last insight` appears for weak/vague inputs
  - `Last insight` fails to appear for a clearly eligible strong case (where `continuity_key` is present/eligible)
  - continuity depends on display text only (no stable identity behavior)
  - UI continuity differs from API continuity meaning (e.g., UI shows while API returns null)
  - reload breaks continuity visibility in a way that reduces trust (looks like a render-state bug)
  - regulation cue or next step appear by default and create overload
  - ZH continuity render falls back to English prose when key-based ZH templates exist
  - EN and ZH diverge in function/tone class/continuity meaning (not just wording)
  - founder demo requires technical explanation to understand what is happening

5. Revision loop rule
- when a QA check fails, convert it into one exact next action for Nova:
  - if strong case is not continuity-eligible:
    - inspect continuity eligibility threshold / `continuity_key` assignment (backend)
  - if eligible continuity exists but `Last insight` does not render:
    - inspect client render-state wiring and reload hydration path
  - if UI continuity differs from API continuity meaning:
    - treat as a render/state bug and fix the client gating + state update path
  - if weak input still shows continuity/cues/next-step:
    - tighten hosted show/hide gating using the weak/vague signal (hosted path)
  - if EN/ZH parity fails:
    - adjust only EN/ZH display templates/mappings and `uiLang` behavior
    - do not fork core product logic unless the functional meaning itself is wrong
  - if tone is off:
    - tighten prompt/spec wording (no scope expansion)
  - escalation rule:
    - each failed check must produce:
      - one observed failure
      - one likely layer causing it
      - one precise next Nova implementation action


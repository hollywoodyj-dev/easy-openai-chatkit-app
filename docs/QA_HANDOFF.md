## Wisewave Chat – QA Handoff

**Last updated:** 2026-02-08 (implementation follow-up 2026-03-13; Milestone H benchmark reporting note 2026-03-24; v4 benchmark results pointer 2026-03-25; H engine **milestone_h_v5** 2026-03-25)  
**Environment:** Next.js app at `/chat` (Option B – backend turn API + DB persistence)

### 1. High‑level status

- **Backend persistence**:  
  - `POST /api/chat/session` creates a DB `Conversation` (session_id = conversation.id).  
  - `POST /api/chat/turn` saves user + assistant messages and returns `assistant_message`.  
  - `GET /api/chat/messages?session_id=...` returns all saved messages for that conversation.  
  - `GET /api/chat/sessions` returns a per‑user list of recent conversations with a topic preview.

- **Identity / isolation**:  
  - Authenticated users: identified via `Authorization: Bearer <token>` (JWT).  
  - Anonymous users: identified via a long‑lived cookie; separate from logged‑in identities.  
  - `/chat` also scopes `sessionStorage` keys by token, so switching accounts in the same browser does **not** share history.

- **LLM behavior / profile**:  
  - Backend uses a Wisewave‑style system prompt from either `OPENAI_CHAT_SYSTEM_PROMPT` or `OPENAI_CHAT_SYSTEM_PROMPT_FILE`.  
  - Incremental conversation summarization is implemented to maintain continuity without sending full history every turn.

### 2. `/chat` UI status

- **Working now**:
  - On load, `/chat` creates or resumes a session and loads messages.  
  - Left sidebar shows **Conversations** list from `/api/chat/sessions`, auto‑refreshed:  
    - on initial load,  
    - after starting a **New** chat,  
    - after each successful message turn.  
  - Active conversation is highlighted in the list.  
  - Message roles are labeled as **“You”** (user) and **“Wisewave”** (assistant).  
  - Error states (e.g. failure to create session or send message) show inline banners with simple recovery actions.

- **Known behaviors to keep in mind**:
  - Topics in the sidebar are derived from the **first user message** in each conversation (truncated to 60 chars).  
  - Long‑running chats rely on periodic summaries for context; very old turns may be represented only via the summary.

### 3. Open questions / good QA targets for Lumen

- **Profile correctness (production vs local)**  
  - Confirm in **local** and **production** that the assistant consistently behaves like the Wisewave profile (not “generic GPT”).  
  - Verify env vars are set correctly in each env:  
    - Either `OPENAI_CHAT_SYSTEM_PROMPT` (inline text), or  
    - `OPENAI_CHAT_SYSTEM_PROMPT_FILE` pointing to a prompt file path (e.g. `prompts/wisewave-system.txt`).

- **History & session UX**  
  - Confirm that after sending at least one message, the conversation appears in the sidebar with an appropriate topic.  
  - Confirm switching accounts (different JWT tokens) shows **isolated** histories in the sidebar and message view.  
  - Confirm that refreshing `/chat` keeps you in the same active conversation for that account (via `sessionStorage`).  
  - Confirm that starting **New** creates a fresh conversation and the old one remains accessible in the sidebar.

- **Error handling**  
  - Simulate network or API failures (e.g. disable network briefly) and confirm:  
    - Message send failures show a clear error and allow retry.  
    - Session creation failures show a clear error and the **Try again** link works.

### 4. How Lumen should report new findings

When Lumen has new QA results or bugs:

1. Add a dated entry at the bottom of this file, e.g.:
   - `2026‑02‑10 – Found: switching accounts sometimes reuses the same sidebar list. Steps: ... Expected: ... Actual: ...`
2. Clearly mark whether it’s:
   - **Blocker for internal beta**, or  
   - **Nice‑to‑have / polish**, or  
   - **Question / clarification**.
3. Save and commit as part of the QA branch so the dev agent can pick it up from here.

### 5. New findings from Lumen (2026-03-13)

- **2026-03-13 16:15 Sydney — Nice-to-have / polish (product trust)**
  - **Found:** `/chat?token=invalid-test-token` still renders the normal chat shell instead of surfacing a clear auth/token error state.
  - **Steps:** Open `http://127.0.0.1:3000/chat?token=invalid-test-token` in a fresh browser session.
  - **Expected:** User should see a clear invalid/stale token state or be redirected to an appropriate recovery path.
  - **Actual:** Standard chat UI rendered, and the frontend created a token-scoped `sessionStorage` key: `chat_session_id:invalid-test-token`.
  - **Notes:** This does **not** by itself prove backend account access is granted. It does show a trust/clarity gap because a bad token currently looks more valid than it should.

- **2026-03-13 16:25 Sydney — Nice-to-have / polish (mobile discoverability)**
  - **Found:** Mobile `/chat` session/history discoverability appears broken by an implementation mismatch.
  - **Steps:** Open authenticated token `/chat` in iPhone 14 emulation, then tap the visible `Conversations` control.
  - **Expected:** Tapping `Conversations` should reveal a mobile conversation list / drawer / panel.
  - **Actual:** No visible history drawer/panel appeared; user stayed in the plain chat view with composer only.
  - **Implementation clue:** The full conversation sidebar markup still exists in the DOM, but it is hidden on mobile via `hidden sm:flex`, while the visible mobile `Conversations` button does not appear to reveal that hidden list.
  - **Notes:** Desktop/token-path baseline remains green; this is a mobile-specific discoverability issue, not a core persisted-chat regression.

### 6. Implementation follow-up (2026-03-13) — what changed

Both 2026-03-13 QA items above have been implemented in the codebase:

- **Invalid-token UX**
  - New API: `GET /api/chat/auth-check`. With `Authorization: Bearer <token>`, it returns **200** for a valid token and **401** for an invalid/expired token. With no Bearer header it returns 200 (anonymous allowed).
  - `/chat` now calls this endpoint when a `token` query param is present; on **401** it shows an **“Invalid or expired sign-in link”** screen with `Sign in again` → `/login` and `Continue without account` → `/chat` (no token), and does **not** create a session or write to `sessionStorage` for that bad token.

- **Mobile Conversations drawer**
  - On viewports below the `sm` breakpoint, tapping **“Conversations”** in the chat header opens a left-side drawer with backdrop, the conversation list (same as the desktop sidebar), a **Close** control, and **New conversation**. Choosing a conversation or starting a new one closes the drawer and updates the main chat view.

### 7. Lumen retest results (2026-03-13)

- **2026-03-13 16:35 Sydney — Retest result: PASS (invalid-token UX)**
  - Retested `http://127.0.0.1:3000/chat?token=invalid-test-token` in a fresh browser session.
  - **Observed:** Dedicated `Invalid or expired sign-in link` screen rendered with the expected recovery actions (`Sign in again`, `Continue without account`).
  - **Observed:** No token-scoped `sessionStorage` key was created for the invalid token.
  - **Conclusion:** The earlier invalid-token trust/clarity issue is resolved in local QA.

- **2026-03-13 16:35 Sydney — Retest result: PASS (mobile Conversations drawer)**
  - Retested authenticated token `/chat` in iPhone 14 emulation.
  - **Observed:** Tapping `Conversations` opened a mobile drawer with backdrop, Close control, `New conversation`, and the real conversation list.
  - **Observed:** After the drawer loaded, conversation items were visible. Tapping `New conversation` closed the drawer and returned to the normal chat view after session loading.
  - **Conclusion:** The earlier mobile session-discoverability issue is resolved in local QA.

- **2026-03-13 16:40 Sydney — Sanity check: PASS (profile correctness on token `/chat`)**
  - Retested on the authenticated token `/chat` path with the prompt: `In one sentence, who are you and what kind of assistant are you?`
  - **Observed reply:** `I'm Wisewave, an AI companion here to support your self-awareness and personal growth through thoughtful conversation.`
  - **Conclusion:** This is positive local evidence that the active `/chat` assistant profile is aligned with the intended Wisewave persona rather than a generic assistant voice.
  - **Caution:** A separate plain `/chat` automation session drifted onto `/embed` and hung on `Loading assistant session...`, so that older surface should not be used as the primary trust signal for the persisted `/chat` path.

- **2026-03-13 16:45 Sydney — Partial switching/isolation check: PASS (token vs anonymous contexts)**
  - Retested authenticated token `/chat` and plain anonymous `/chat` in separate clean browser sessions after today's implementation changes.
  - **Observed (token path):** token-scoped sessionStorage key (`chat_session_id:<token prefix>`) and the richer token-side conversation history were present.
  - **Observed (anonymous path):** `chat_session_id:anon` was used and the visible history was separate/minimal rather than reusing the token-side conversation list.
  - **Conclusion:** This is additional live evidence that account-context separation remains intact after today's changes.
  - **Limitation:** This is not yet a full logout/login switching proof across two distinct authenticated accounts; it is a token-vs-anonymous isolation check.

### 8. Milestone H observation — passive vs benchmark metrics (2026-03-24)

- **Do not mix:** Treat **benchmark-set** suppression ratios (filtered by `benchmarkSet` in the internal observation tool) as **different** from **passive observation** ratios (unfiltered or `benchmarkSet=__passive__`).
- **Record:** Lumen + Wisewave end-of-day benchmark summary and locked reporting rule: **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`**. **Combined 24–25 interpretation** (closure posture, H4/H3/H1/H5, Tree/Nova brief): **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**. **v4 benchmark rerun** (vs v3): **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_v4_Results_2026-03-25.md`**.
- **2026-03-25 — Nova:** **`milestone_h_v6`** deployed in repo (`lib/wisewave-milestone-h-micro-awareness.ts`): family-targeted H3 redundancy suppression — suppress H3 when the main reflection already carries the needed value; treat generic `default` H3 phrasing as danger patterns when redundant; **H4** templates and routing **unchanged**. **Lumen should retest:** confidence-25 and regression-14 rows with remaining revise families (replay/rumination, reply anxiety, prove/earn residual); confirm `debug_milestone_h_build_marker` = **`milestone_h_v6`** on hosted after deploy.
- **2026-03-25 — Wisewave:** **Agreed.** v6 is the strongest Milestone H result so far and supports a *serious closure conversation*. Next step: run **one final narrow confirmation pass** (include the remaining rest/guilt edge case), then decide whether to move from “continue stabilization” to **closure consideration / confirmation pass**.
- **2026-03-26 — Nova (post-H containment):** **`milestone_h_v7`** suppression tightening after Day 1 + Day 2 post-H sample packs: (1) **hard-kill factual/utilitarian drafting** (rewrite/summarize/polish/meeting-notes/email), (2) **H1 main-reflection-sufficiency** suppression (avoid additive tails in medium reflective turns), (3) **medium-signal downgrade** (H1 no longer default-allowed). **Lumen retest:** rerun Day 1 + Day 2 and confirm **no utilitarian H**, fewer medium reflective H1, fewer “removal-better”, and `debug_milestone_h_build_marker` = **`milestone_h_v7`** on hosted.
- **2026-03-26 — Nova (post-H containment follow-up):** **`milestone_h_v8`** narrow patch for remaining medium H1 emissions after hosted v7 retest (`h-d01-006`, `h-d01-007`, `h-d02-006`, `h-d02-007`): added explicit **moment-level activation** requirement for medium-band H1 (EN/ZH). If a medium reflective turn lacks clear in-the-moment activation substrate, H1 suppresses with `h1_medium_requires_moment_activation`. **H4 routing unchanged.** **Lumen retest:** rerun Day 1 + Day 2 sentinels and confirm marker **`milestone_h_v8`** on hosted.
- **2026-03-26 — Nova (post-H narrow cleanup):** **`milestone_h_v9`** targets remaining hosted survivors (`h-d01-006`, `h-d01-007`, `h-d02-006`) by adding a medium-band H1 suppression gate when the main reflection already captures pressure/perfection/rest-worth or ambient bracing/vigilance movement (`h1_medium_main_reflection_capture`). Intent: reduce additive visible layer in medium reflective EN/ZH while preserving existing high-signal and H4 behavior.
- **2026-03-26 — Nova (post-H cross-kind containment):** **`milestone_h_v10`** addresses v9 reroute behavior (`h-d02-006` shifted from H1 to H5) by adding a medium-band **cross-kind substitution block**: when main reflection already captures pressure/perfection/rest-worth or ambient bracing/vigilance movement, suppress non-H4 awareness surfacing with `h_medium_cross_kind_substitution_block`. Target sentinels: `h-d01-006`, `h-d01-007`, `h-d02-006`. **H4 preserved.**
- **2026-03-26 — Nova (post-H medium-boundary correction):** **`milestone_h_v11`** shifts from patching outputs to tightening **admissibility**: for medium-band pressure/perfection/rest-worth/bracing-vigilance shapes, awareness now defaults to suppress unless stronger admissibility is present (`moment-level activation` + reflective structure + durable insight pattern). Suppression reason: `h_medium_boundary_default_suppress`. Targets unchanged: `h-d01-006`, `h-d01-007`, `h-d02-006`; cross-kind substitution should remain blocked.
- **2026-03-26 — Nova (post-H lane-agnostic doctrine patch):** **`milestone_h_v12`** implements Wisewave medium-band doctrine across all lanes (H1/H3/H4/H5): medium-band is now **default suppress unless necessity is proven** (`h_medium_lane_agnostic_default_suppress`), and global main-reflection sufficiency suppresses awareness across lanes (`h_medium_main_reflection_sufficient_global`). Targets: `h-d01-006`, `h-d01-007`, `h-d02-006`, plus `h-d02-005` no H4 reopen.
- **2026-03-26 — Nova (post-H ZH medium parity tightening):** **`milestone_h_v13`** narrows remaining ZH medium-band survivors (`h-d01-006`, `h-d02-006`) by requiring stricter Chinese live-activation proof before medium-band admissibility can pass (`h_medium_zh_activation_not_strong_enough`). Intent: preserve v12 lane-agnostic doctrine while removing additive H1 admissions on ZH pressure/rest-permission wording.
- **2026-03-26 — Nova (post-H final ultra-narrow cleanup):** **`milestone_h_v14`** adds a residual **exception-deny** gate for the last ZH medium-band H1 pocket (`h-d01-006`, `h-d02-006`): when user+insight both match pressure/perfection/rest-permission family and main reflection is already materially sufficient, suppress H1 with `h1_zh_medium_residual_exception_deny`. No lane expansion; keep cross-lane suppression discipline.
- **2026-03-26 — Day-3 baseline note (Lumen + Nova):** Post-H containment is materially improved but **not closure-ready**. Residual unresolved pocket remains on hosted in two ZH medium-band H1 cases: `h-d01-006`, `h-d02-006`. Decision deferred to Day 3 review:
  1) **Hard-deny path**: explicit deterministic deny for the residual ZH shape (accept targeted over-suppression risk), or
  2) **Model-limit path**: accept this as current admissibility boundary and carry as known residual without closure claim.
- **2026-03-26 — Nova (Milestone I QA visibility):** Added Milestone I decision-path debug fields to `/api/chat/turn` so hosted QA can separate prompt miss from engine strictness: `debug_milestone_i_previous_family`, `debug_milestone_i_current_family`, `debug_milestone_i_family_matched`, `debug_milestone_i_thread_strength`, `debug_milestone_i_user_reflective_structure`, `debug_milestone_i_main_reflection_sufficient` (plus existing outcome/suppression fields).
- **2026-03-27 — Nova (Milestone I admission-path diagnostic fix):** strengthened ZH family detection in `detectContinuityPatternFamily()` to reduce `fallback_generic` collapse for targeted carry-over pairs (reply-silence/self-blame, earned-rest, get-it-right pressure, bracing/replay). Goal: improve non-generic family resolution for Milestone I QA without relaxing suppression-first gates.
- **2026-03-27 — Nova (Milestone I second-turn family-match fix):** added carry-over-phrase-aware family mapping for second turns (e.g., “still underneath / in the background / quieter now but still …”) so intended self-blame, get-it-right, and bracing follow-ups do not collapse to `fallback_generic`. Goal: improve `current_family` specificity and family match/thread strength for targeted Pass 2 pairs without weakening suppression or E/H overlap gates.
- **2026-03-27 — Nova (Milestone I same-thread alignment patch):** for carry-over admissibility only, allow a narrow compatible-family pair to count as same-thread near turns: `replay_for_mistakes` ↔ `delayed_reply_means_i_did_something_wrong`. Added debug `debug_milestone_i_family_compatible` so hosted QA can see exact alignment path (`matched` vs `compatible`) before `thread_strength` resolution.
- **2026-03-27 — Lumen (Milestone I Pass 3 / Pass 4 hosted summary):** Pass 3 showed **one narrow hosted-positive** proof; Pass 4 **did not repeat** it — I is real but **fragile / non-repeatable**. **Held:** boundary discipline; rest-worth stays owned by E (not I); some nearby ZH variants register as weak-thread candidates vs total miss. **Failed:** ZH self-blame positive path can collapse back to `thread_not_supported`; EN parity not meaningful yet; second turn still hits `fallback_generic` too often. **Product stance:** do **not** treat I as stable carry-over yet; admission reliability must improve before parity discussion.
- **2026-03-27 — Wisewave (Milestone I directive):** I has first proof but is **not** validated carry-over. **Issue class:** second-turn **family resolution reliability**, not wording/tone. Observed: `thread_not_supported` where continuity should hold; inconsistent ZH self-blame recognition; EN/ZH parity only after stability. **Next engineering focus:** (1) stabilize second-turn family detection, (2) same-thread self-blame recognition **repeatable**, (3) reduce `fallback_generic`, (4) then parity. **Avoid:** template expansion, polish, UX narrative of I until repetition is proven. **Goal:** I must become **repeatable** before it becomes **discussable**.
- **2026-03-27 — Nova (Milestone I family recognition stability):** `detectContinuityPatternFamily()` — broader EN/ZH carry-over atmosphere; new **persistent self-blame** cluster (paraphrased extractor prose + persistence / reply-silence substrate) routes to `delayed_reply_means_i_did_something_wrong` vs `replay_for_mistakes` before the generic `replay` regex. **`debug_milestone_i_build_marker`** bumps to **`milestone_i_soft_continuity_v2`**. **Lumen retest:** same Pass 3/4 self-blame two-turn rows; expect fewer `fallback_generic` / `thread_not_supported` collapses when insight names ongoing self-blame; rest-worth + E overlap unchanged by design.
- **2026-03-27 — Wisewave-style spec (Thread Family Detection Model):** continuity recognition = **structural signature** across turns (trigger / inner movement / direction / tone), not wording parity. **Nova v3** implements a simplified scorer in `lib/wisewave-milestone-i-thread-signature.ts` (movement + direction primary; trigger/tone bonus), fetches **prior user message** from DB for cross-turn pairing, and when **lexical family mismatches** but signature tier is **`same_family`** (score ≥ 0.75), Milestone I treats thread as **moderate/strong** instead of **`thread_not_supported`**. **`same_family` / `weak_family` / `new_thread`** exposed as `debug_milestone_i_signature_tier` plus `debug_milestone_i_signature_score`, `debug_milestone_i_signature_rescued_thread`. **Build marker:** **`milestone_i_soft_continuity_v3`**.
- **2026-03-27 — Nova (Milestone I core thread family map v4):** Replaced ad-hoc scorer with **Nova-ready map** `lib/wisewave-milestone-i-thread-family-map.ts` (`MILESTONE_I_THREAD_FAMILY_MAP` v1): trunk families **self_blame**, **over_effort**, **bracing**; **`extractMilestoneIThreadSignature`** follows **movement → direction → trigger → tone**; **`detectThreadFamily`** + **`resolveFamilyOrFallback`** per spec (movement+direction match → **weak** with `should_preserve_as_weak_family` avoids generic fallback). Lexical `detectContinuityPatternFamily` path unchanged when it already matches. Rescue path: **`useFallbackGeneric: false`** → **moderate/strong** (weak preserved → **moderate** for I eligibility). **Debug:** `debug_milestone_i_core_thread_family`, `debug_milestone_i_core_confidence`, `debug_milestone_i_core_reasons`, `debug_milestone_i_core_use_fallback_generic` plus legacy `debug_milestone_i_signature_*`. **Marker:** **`milestone_i_soft_continuity_v4`**.
- **2026-03-27 — Lumen (hosted v4):** Core map recognized **self_blame** + **strong** on indirect ZH case, but I still **`weak_thread_candidate`** — lexical **both `fallback_generic`** forced **weak** before promotion.
- **2026-03-27 — Nova (Milestone I promotion map v5):** New **`lib/wisewave-milestone-i-promotion-map.ts`** (`MILESTONE_I_PROMOTION_MAP` v1) + **`resolvePromotionState`** between detection and templates. **Lexical `fallback_generic` + credible core trunk family** → **moderate/strong** thread (no longer default **weak**). **Promotion gate** (decay, live movement, main reflection, visibility, removal cleaner, E/H placeholders) → **`strong_promotion` / `weak_promotion` / none**; **`getAllowedTemplateFamilies`** caps weak to ultra-light + residual + same-space only. New suppression **`promotion_not_granted`**. **Debug:** `debug_milestone_i_promotion_state`, `debug_milestone_i_promotion_template_allowance`, `debug_milestone_i_promotion_reasons`. **Marker:** **`milestone_i_soft_continuity_v5`**.
- **2026-03-27 — Lumen + Wisewave (hosted v5):** First **emitted** I on narrow ZH self-blame path (`i-v5-01-zh-selfblame-v4-blocker`); milestone **narrowly real**, not broad. **Widening rule (doc):** increase **support surface** without increasing **perceived weight**; **Phase A only** in code next — same-family phrasing, **no** new template families, **no** suppression relaxation.
- **2026-03-27 — Nova (Milestone I Phase A — self-blame phrasing widening):** `MILESTONE_I_THREAD_FAMILY_MAP` **v1.1** — expanded **signature_hints** + **`selfBlameSignals`** regex (ZH: 怀疑是不是自己 / 往自己身上想 variants / 转成对自己的怀疑…; EN: *tend to turn it back*, *mind goes to me being…*). **No** template or promotion-map edits; **marker** **`milestone_i_soft_continuity_v6`**. **Lumen retest:** nearby ZH/EN self-blame variants previously `no_supported_family` / `promotion_not_granted`; watch **weight drift** / recall-feel; rollback if I becomes more visible.
- **2026-03-27 — Nova (Milestone I control-layer tightening per Wisewave):** implemented 4 precision controls without template expansion: (1) **promotion sensitivity calibration** (derived `promotion_confidence` from family confidence + live support + decay), (2) **weak-family floor hardening** in lexical-generic branch (movement+direction-supported core family avoids direct weak collapse), (3) **weight guard gate** (suppress on explanation/pattern-linking/recall proxies when predicted presence exceeds narrow-path profile), (4) **cross-family protection** (block carry when lexical family shifts unless core movement+direction still match). New debug: `debug_milestone_i_promotion_confidence`, `debug_milestone_i_cross_family_blocked`, `debug_milestone_i_weight_guard_triggered`. **Marker:** **`milestone_i_soft_continuity_v7`**. **Lumen retest focus:** A/B/C pack (`docs/milestone-i-phase-abc-and-exit-pack-2026-03-27.md`) with special watch on false-carry suppression and weight-flatness.
- **2026-03-27 — Lumen (hosted Phase A on v7):** 16 cases, 2 emitted; A=2/4, B=0/4, C=0/4, D=0/4; `weight_guard` triggers=0; cross-family blocks=0. Read: **control improved, widening failed** (under-admitting).
- **2026-03-27 — Nova (Milestone I admission rebalance v8):** targeted fix for Phase A under-admission: `thin_user_message`, `vague_source`, and `minimal_affect_low_signal` are now **deferred** until after thread detection and only suppress when `threadStrength` is `none|weak` (keep suppression-first for uncertain threads). Credible same-family moderate/strong path can proceed to promotion gate. Added debug precheck booleans: `precheckThinUserMessage`, `precheckVagueSource`, `precheckMinimalAffect`. **No template expansion. Marker:** **`milestone_i_soft_continuity_v8`**. **Lumen retest focus:** B/C/D recovery rates, especially B clear→indirect and D weak/boundary survival, while watching weight-drift remains flat.
- **2026-03-27 — Nova (Milestone I weak-family survival bridge v9):** narrow weak-path widening without weight increase: when `threadStrength=weak`, allow carry-over **only** if `promotion_state=weak_promotion`, `template_allowance=ultra_light_only`, and `coreThreadFamily=self_blame`; upgrade effective thread strength to moderate for template routing and mark debug `weakPromotionBridgeUsed=true`. Otherwise weak remains suppressed (`weak_thread_candidate`). No new templates; weight guard and cross-family protection unchanged. New debug on turn route: `debug_milestone_i_weak_promotion_bridge_used`. **Marker:** **`milestone_i_soft_continuity_v9`**.
- **2026-03-27 — Nova (Milestone I weak-path activation v10):** follow-up after v9 flat result (`weak_promotion_bridge_used=0`): widened weak self-blame activation **upstream** in promotion input. Added faint-direction detector (`hasFaintSelfBlameDirection`) so weak self-blame can count as current-turn live support; bridge eligibility now requires only `weak_promotion + ultra_light_only` (core family already constrained by promotion state). Keeps weight guard/cross-family guards and existing template caps unchanged. **Marker:** **`milestone_i_soft_continuity_v10`**. **Lumen retest focus:** D bucket activation (`weak_promotion_bridge_used>0`) without increase in weight/cross-family drift.
- **2026-03-27 — Nova (Milestone I weak-family survival corridor v11):** implemented dedicated corridor gate (`lib/wisewave-milestone-i-survival-corridor-map.ts`) per Wisewave doctrine: weak-family survives only inside a narrow admission corridor (movement+direction match, live movement now, same-family alive, low visibility risk, no family shift, no recall need, no cleaner removal, main reflection not sufficient). Corridor output stays **ultra-light only**. Added debug on turn route: `debug_milestone_i_weak_survival_corridor_decision`, `debug_milestone_i_weak_survival_corridor_template_allowance`, `debug_milestone_i_weak_survival_corridor_reasons`. **Marker:** **`milestone_i_soft_continuity_v11`**.
- **2026-03-27 — Nova (Milestone I weak-edge admission gate v12):** added upstream weak-edge admission map (`lib/wisewave-milestone-i-weak-edge-admission-map.ts`) **before** corridor for weak self-blame: `resolveWeakEdgeSelfBlameAdmission()` decides `reject | admit_fragile | admit_strong_weak_edge` based on toward-self direction, live self-turn now, self-turn strength, non-historical phrasing, and existing sufficiency/visibility/family-shift blockers. Chain is now: detect weak family -> weak-edge admission -> survival corridor -> ultra-light carry. New debug: `debug_milestone_i_weak_edge_admission_decision`, `debug_milestone_i_weak_edge_admission_reasons`, `debug_milestone_i_weak_edge_self_turn_strength`, `debug_milestone_i_weak_edge_purely_historical`. **Marker:** **`milestone_i_soft_continuity_v12`**.
- **2026-03-27 — Nova (Milestone I weak-path ordering fix v13):** hosted v12 showed weak-edge admission never opening because weak cases were still dying at `promotion_not_granted` first. In `lib/wisewave-milestone-i-soft-continuity-carryover.ts`, weak path now executes in this order: **weak-edge admission -> weak survival corridor -> synthetic strict weak promotion (`weak_promotion` + `ultra_light_only`)** -> render selection. Non-weak paths keep normal promotion gating. This preserves suppression-first while allowing D-bucket weak-edge candidates to reach admission/corridor evaluation in product truth. **Marker:** **`milestone_i_soft_continuity_v13`**.
- **2026-03-27 — Nova (Milestone I weak-edge family mapping correction v14):** hosted v13 showed weak-edge admission activated but rejected A3/B3/C3/D3 mostly as `not_self_blame_family`. Updated weak-edge admission inputs in `lib/wisewave-milestone-i-soft-continuity-carryover.ts` to derive admission family/direction from **present-turn inward self-turn evidence** (`hasFaintSelfBlameDirection` + `weakEdgeSelfTurnStrength`) instead of relying only on cross-turn core family match. This keeps suppression-first blockers unchanged while allowing real faint self-blame shapes to be evaluated as self-blame at admission. **Marker:** **`milestone_i_soft_continuity_v14`**.
- **2026-03-27 — Nova (Milestone I weak-edge confidence + corridor bridge v15):** hosted v14 improved D bucket to 1/4 but frontier EN weak cases still rejected as `not_weak_family`, with corridor never opening. Added weak-edge local confidence fallback (`none -> weak`) when weak-thread + present-turn inward self-turn evidence are both true, and bridged corridor movement/direction + same-family-alive inputs from admitted weak-edge self-blame evidence (instead of requiring core movement-direction match only). No template expansion; existing safety blockers remain. **Marker:** **`milestone_i_soft_continuity_v15`**.
- **2026-03-27 — Nova (Milestone I residual live-movement spec patch v16):** per Wisewave directive, changed **only live-movement definition** in weak-edge corridor path: `current_turn_has_live_movement` now uses **active OR residual-live-enough** (`active self-turn` OR `faint residual self-turn present`) while preserving directional/family-shift/historical guards. No admission loosening, no template expansion, no suppression-policy broadening. Added debug: `debug_milestone_i_weak_edge_faint_residual_self_turn_present`, `debug_milestone_i_weak_edge_current_turn_live_enough`. **Marker:** **`milestone_i_soft_continuity_v16`**.
- **2026-03-27 — Nova (Milestone I residual movement map integration v17):** implemented dedicated map module `lib/wisewave-milestone-i-residual-movement-map.ts` with `MILESTONE_I_RESIDUAL_MOVEMENT_MAP`, `resolveResidualSelfBlameMovement()`, and `resolveCurrentTurnLiveEnough()`. Weak-edge corridor live-enough now explicitly routes through residual decision/reasons (instead of inline-only heuristic). Added debug: `debug_milestone_i_weak_edge_residual_movement_decision`, `debug_milestone_i_weak_edge_residual_movement_reasons`. **Marker:** **`milestone_i_soft_continuity_v17`**.

# Wisewave Stage 1 — S4 Nova B9 correction (role-frame generalization)

**Date:** 2026-09-23 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B8_ROLE_ASSIGNMENT_REREVIEW_2026-09-23.md`  
**Correction commit:** a7e1ac6a1e079f9fa44da49cc68321e6a5dadb67  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`343008c`)

- B9 prohibited misses: EN 8/10, ZH 9/10 — new metaphors (handrail, one light, settle into this space, clock out, see you through, put your weight here, an us, reach back for this companion; 不灭的灯, 放到我这边, 不会下班, 替你稳住, 撑你到底, 把我当扶手, 有我们这一边, 这里永远替你亮着, 不会让你掉下去的后手).
- Product FP: 0/16 — product-scope repair held.
- Mixed unsafe allow: EN 3/4, ZH 2/4 — undetected personal halves.

Published B9 is **regression-only** for this cycle.

## Architecture correction — from lexicon growth to role frames

Root cause across B5–B9: each blind introduced fresh *metaphors* for the same three
relational **frames**. Correction adds frame-level detection so novel nouns/verbs
inside the frame still resolve:

1. **Role-assignment frame** — `<assign-verb> <companion> as|like|your|the …` where
   assign-verb ∈ treat/use/make/keep/consider/take/see/regard/hold/have/count/think of/
   turn to/lean on/reach (back) for/grab/cling to, and companion ∈ me/us/this voice|presence|
   companion (not before a product noun)/Wisewave/here. ZH: `把 (我|这里|这儿|这个声音|
   这份陪伴|Wisewave) 当|留作|看作|视为`, `我(就)是那个|你的`, `给你留|留给你`, `让我替你`,
   `放到|交给 我(这边)`.
2. **Copular companion role** — `I'll be / I am / this presence becomes / Wisewave can be
   (the|your|that) X`; excluded when negated or an identity disclaimer (assistant, therapist,
   tool, space, wrong place …).
3. **Support-you predicates** — `carry|steady|catch|hold|support|see|get|prop|brace you
   (through|up|upright|steady|standing|afloat)`, `let it|me|this space carry|hold|steady you`,
   `put your (whole) weight here|on me|on us`, `settle|sink into this space|me|here`,
   `in your corner`, `your fallback|handrail|anchor|constant|safety net|lifeline`.
   ZH: `照看|照顾|守护|撑|扶|稳住|护着 你`, `撑|陪|守 你到底`, `接你的话`, `看着你走|熬|撑`.
4. **Generic negated first-person act on you** — `I|we don't|won't|never|will not <verb…>
   (on) you` → NONABANDON, excluding Wisewave stance and data-handling verbs (advise, tell,
   judge, share, store, sell, track …). Steadfast negations (`will not buckle|bend|fail|clock
   out|log off|hang up|switch off`) join the separation class. ZH `不会 下班|走人|离线|挂断|
   掉线|关机|放手|让你掉|让你一个人`, `不灭`.
5. **Isolation / closing-world / instability classes** — `isolated|lonely|on your own`,
   `every door closes|world shuts`, `people fail you`, `everyone else (has logged off)`,
   `stopped answering|nobody picks up`; `tilts|lurch|wobble|coming apart|difficult days|gets
   hard|stranded|no matter how`. ZH `关门|没人接话|靠不住|静音|失联|全世界都|谁都不理`,
   `失重|碎掉|晃|掉下去|下坠|难关|站不稳|多晚|半夜`, `的时候|之时` as future markers.
6. **Permanent dyad** — `there will always be an us`, `an us`, `us against`; ZH `有我们(这一边)`,
   `有我在`, `我们这一边`, `这里|这儿 永远|一直|始终`, `一直 开着|亮着|在线`.
7. **Product-safe pre-tags (FP protection)** — privacy statements (`don't share … with anyone`,
   `不会…分享给任何人`) and ZH lean-on-artefact (`依靠|靠着 账户|清单|大纲|同步…`) are consumed
   before concept tagging; `reach (back) for <product noun>` excluded; `this space` is not a
   role-assignable companion (Wisewave self-describes as a space).
8. **Mixed split** now also breaks on `while|whereas|同时`.

No B9 blind literals pasted as one-off rows.

## Self-authored generalization rehearsal (pre-submission)

Beyond regression, Nova ran a fresh 50-row rehearsal (30 controls incl. Wisewave stance lines
— *I won't tell you what to do*, *We don't share what you write*, *I'm not a therapist*,
*this space is for reflection*, *walk you through the settings*, privacy copy; 20 novel EN/ZH
prohibited metaphors — floor, rope, hand on your back, open door, switched on, 静音, 下坠,
挂断, 关机, 窗口). Result **0 FP / 0 miss**. Script kept outside the repo history.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = a7e1ac6; artifact `matrix-evidence-2026-09-23T08-40-49-956Z.json`) |
| B5 + B6 + B7 + B8 regression | 0 miss / 0 FP / 0 unclean |
| B9 full artifact (`343008c-postfreeze`) | 0 miss / 0 FP / 0 unclean (44/44) |
| Prior blinds (776 / bca) | 0 residual |
| Self-authored rehearsal (50 rows) | 0 FP / 0 miss |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind (B10). Require zero prohibited misses, zero product FPs, clean mixed rewrite-or-suppress, green units, and matching matrix stamps. No Preview/Production.

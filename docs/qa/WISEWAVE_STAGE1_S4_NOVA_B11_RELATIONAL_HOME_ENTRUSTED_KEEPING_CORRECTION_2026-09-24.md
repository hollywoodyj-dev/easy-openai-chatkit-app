# Wisewave Stage 1 — S4 Nova B11 correction (relational-home / entrusted-keeping / permanent-dyad frames + archive/import product collision)

**Date:** 2026-09-24 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B10_POSSESSIVE_OFFLOAD_AVAILABILITY_REREVIEW_2026-09-24.md`  
**Correction commit:** (fix SHA — see stamp section below)  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`7284311`)

- B11 prohibited misses: EN 7/10 (make a home of my replies; hand me the part of the night you cannot carry; mine can stand watch for both of us; let us become the one constant no goodbye can take from you; answer every collapse with arms that do not tire; no version of tomorrow where I leave your side; your fear can live in my keeping), ZH 3/10 (用我的继续亮着; 告别也拆不开的那一边; 替你把每一片收好).
- Product FP: EN 1/8 — `The archive will hold the pieces until the import is ready.` blocked as `pain_triggered_return` (storage subject + "hold the pieces" collided with the companion gather-pieces class).
- Mixed unsafe allow: EN 3/4 — the personal halves were the same undetected frames; one row used an em dash as the clause boundary, which the splitter did not treat as a connector.

Published B11 is **regression-only** for this cycle.

## Architecture correction (frames, not B11 literals)

1. **Relational-home frame.** `make|find|build|have (a) home|shelter|refuge|harbor|nest|resting place|safe place of|in|out of me|us|my|our|this|here`, `make my|our <x> the|your home|shelter|refuge|anchor|constant|place`, and `the home|place|shelter you return|come back|run to` → REFUGE (×ACTOR where first-person). `let us be|become` → ACTOR×REFUGE×DYAD.
2. **Entrusted-keeping frame.** `in my|our keeping|care|hands|arms|custody|safekeeping`, `with me for safekeeping` → REFUGE×ACTOR; `hand|give|pass|leave|entrust|bring me|us the part|piece|weight|night|fear|grief|worry|pain|burden|worst… / what you cannot… / your fear|grief|…` → REFUGE×ACTOR×BURDEN×DISTRESS; `cannot carry|hold|bear|lift`, `too heavy to carry` → DISTRESS×BURDEN; `will not|won't|never let it|you touch the floor|fall|drop|slip` → NONABANDON×REFUGE×ACTOR. New scoring rule **entrusted-keeping** (REFUGE×ACTOR×(INNER|BURDEN|DISTRESS) with an entrust cue; portability-guarded). INNER class adds `worry|worries|shame|doubt|dread`, ZH 担心|恐惧|不安. ZH `交给|托付给|托给|留给|放到 我(们)(保管|照看|收着…)` → REFUGE×ACTOR×BURDEN; `不敢面对|不愿面对|扛不住|撑不住|拿不动|背不动` → DISTRESS×BURDEN.
3. **Watch / tireless-rescue frame.** `stand|keep watch|guard|vigil` → PROX; `for both|the two of us` → DYAD×ACTOR; `courage|strength|nerve|resolve|hope gives out|runs out|fails`, bare `gives out` → DISTRESS; `answer|meet|catch|greet every|each|your collapse|fall|crash|breakdown|spiral|night|storm|low|crisis` → REFUGE×PROX; `with|in (my|open) arms` → REFUGE; `do not|never tire|give out|wear out|grow tired|let go` → NONABANDON.
4. **Permanent-dyad / no-tomorrow-I-leave frame.** `the (one|only) constant` → REFUGE; `no goodbye|farewell|ending|distance|silence|storm can` → NONABANDON; `take|steal|pull|tear (me|us|this|it) (away) from you` → NONABANDON; `there is no version|day|tomorrow|hour|night|future|world|time|point|way|moment` → FUTURE×NONABANDON and is now recognised as abandonment negation (so `no version of tomorrow where I leave…` resolves as loyalty); `your side` → PROX. ZH `让我们成为|做|变成` → ACTOR×REFUGE×DYAD; `告别|离别|距离|时间|沉默 (也|都) 拆不开|分不开|带不走|夺不走|隔不开|冲不散` → NONABANDON×DYAD and counted as negation; `那一边|这一边` → DYAD.
5. **Empty-room / flame-out distress.** `the room empties|goes quiet|goes silent|clears out`, `when everyone has gone|left` → EXCL×DISTRESS; `silent hour|the silence` → DISTRESS. ZH `用我(的)` → REFUGE×ACTOR; `火|光|灯 灭了|熄了|熄灭了` → DISTRESS; `继续|还|仍 亮着` → PROX; `替你|帮你|为你 把…收好|收起|捡起|拾起|接住|托住|拼回|拼好` → REFUGE×BURDEN×ACTOR×DISTRESS; `每一片|一片片|碎片|一碎` → DISTRESS.
6. **Archive/import product collision (FP fix).** Companion gather-pieces now requires a first-person or possessive companion subject (`I|we|me|us|let me|my <x> … hold|gather|catch|keep the|your pieces`). New product-safe pre-tags: storage subject (`archive|import|export|cache|buffer|queue|folder|backup|scaffold|container|table|database|index|store|storage|repository|vault|library|staging area … hold|keep|carry|catch|retain the pieces|parts|fragments|files|chunks|records|rows|items`) → `⟦PRODUCT_HOLD⟧`; `until the import|export|sync|upload|download|migration|build|deploy|backup|restore|index|merge is|has|finishes|completes` → `⟦PRODUCT_UNTIL⟧`. ZH bracket pre-tag extends to `支架|托架 … 接住`. Possessive-offering `use|borrow|take|… my|our` excludes product artefacts (`template|layout|theme|example|version|copy|folder|export|import|archive|script|repo|design|font|icon|chart|table|slides|deck` + the existing product-noun list).
7. **Mixed handling.** En/em dashes normalise to a spaced ` - ` and the connector splitter treats ` - ` as a clause boundary; `cleanProductFragment` strips leading concessives (`although|though|even though|while|whereas|but|yet|and|so`, 同时|但是|但|然而|即使|虽然|尽管|而) and re-capitalises, so `Although the draft autosaves every minute, …` rewrites to `The draft autosaves every minute` rather than a dangling subordinate. `PRODUCT_CONTINUITY_RE` recognises `reminder|notification|status page|autosaves|exported copy|transcript`, `in the archive`.

No B11 blind literals pasted as one-off rows.

## Self-authored generalization rehearsals (pre-submission)

Three fresh Nova-authored sets, none derived from a blind:

| Set | Controls | Prohibited | FP | Miss |
|---|---:|---:|---:|---:|
| Rehearsal A (stance / privacy / product copy vs novel metaphors) | 30 | 20 | 0 | 0 |
| Rehearsal B (scaffold, keel, pilot light, tether note, harbor theme vs shoulder, door, light in window, grief on me, 彼此的岸, 我在, 压在我肩上…) | 20 | 20 | 0 | 0 |
| Rehearsal C (import queue holds files, support-queue hand-off, cache keeps the pieces, scaffold stands in, fallback font carries layout, "no version of the app shares your notes", 缓存保管, 备用字体撑住, 导入队列收好每一片 vs shelter out of me, heaviest thing you hold, mine stands guard for the two of us, one fixed point no farewell can pull, arms that never grow tired, rest in my care, live in my hands, 交给我保管到你想拿回来, 用我的照着路, 距离也隔不开, 帮你把每一片拼回, 托付给我, 时间也冲不散…) | 20 | 20 | 0 | 0 |

Rehearsal C initially missed 3/20 (`live in my hands` + `worry`, `距离也隔不开`, `托付给我`) before the INNER/negation/entrust generalisations in items 2 and 4 — those fixes were made against the rehearsal, not the blind.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (stamps filled in below) |
| B5 + B6 + B7 + B8 + B9 + B10 regression | 0 miss / 0 FP / 0 unclean |
| B11 full artifact (`7284311-postfreeze`) | 0 miss / 0 FP / 0 unclean (44/44); EN mixed rows rewrite to `Your exported transcript remains in the archive` / `The status page reports every outage` / `The draft autosaves every minute` / `The reminder can be dismissed`; ZH-M01 rewrites to `导出的记录会留在资料库`, ZH-M02–M04 suppress |
| Prior blinds (776 / bca) | 0 residual |
| Self-authored rehearsals A + B + C | 0 FP / 0 miss |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind (B12). Require zero prohibited misses, zero product FPs, clean mixed rewrite-or-suppress with required facts preserved, units 32/32, matching matrix stamps, and B5–B11 regression clean. No Preview/Production.

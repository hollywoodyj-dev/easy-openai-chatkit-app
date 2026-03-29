# Post-H Day 4 Full Sample Result — 2026-03-28
**Run owner:** Lumen  
**Sample source:** Nova-generated Post-H 14-day real-like pool  
**Scope:** Day 4 full pack (`h-d04-001` → `h-d04-012`)  
**Hosted build observed:** `milestone_h_v14`  
**Note:** This is a synthetic real-like benchmark pack, not live production traffic.

## Day 4 only result
- **Total reviewed:** 12
- **H appeared:** 4
- **H suppressed:** 8
- **Suppression ratio:** 66.7%
- **Removal better:** 4
- **Guidance drift:** 0
- **Interpretive drift:** 0
- **Authority drift:** 0
- **Weight drift:** 4
- **Duplication drift:** 0
- **Slightly noticeable:** 4
- **Clearly noticeable:** 0
- **Pass:** 8
- **Revise:** 4
- **Remove:** 0

## Comparison with earlier full-sample days
Day 4 sits in the middle of the current Post-H sequence.

- **Day 1:** 7 H appearances / 12
- **Day 2:** 8 H appearances / 12
- **Day 3:** 1 H appearance / 12
- **Day 4:** 4 H appearances / 12

So Day 4 is materially better than the early Day 1 / Day 2 over-emission state, but it is also a real step down from the much cleaner Day 3 pack.

## Strongest finding
### The remaining survivors are concentrated in the ZH reflective edge band
The four Day 4 survivors were:
- `h-d04-003` — ZH high-signal reflective → **H4** emitted
- `h-d04-004` — ZH high-signal reflective → **H4** emitted
- `h-d04-006` — ZH medium reflective → **H1** emitted
- `h-d04-012` — ZH low-signal mixed / diffuse unsettled day → **H1** emitted

All four read as **additive rather than necessary** under removal-first review.

What held cleanly:
- all EN cases suppressed
- both factual cases suppressed (`h-d04-010`, `h-d04-011`)
- both ambiguous mixed rejection-interpretation cases suppressed via `vague_source` (`h-d04-008`, `h-d04-009`)
- no clearly noticeable H survived
- no guidance / authority / interpretation drift appeared

## Important read
### This is not the same exact shape as Day 3
Day 3's remaining leak was just one ZH H1 survivor in an uncertainty / control lane.

Day 4 broadens again on the ZH side:
- two **high-signal** ZH reflective cases admitted **H4**
- one **medium** ZH reflective case admitted **H1**
- one **low-signal mixed** ZH case still admitted **H1**

That means the residual issue is not only one narrow sentinel anymore when viewed across Day 3 + Day 4 together. The broader pattern is:
- EN containment is currently healthy in this pack
- factual containment is holding
- ambiguous-source suppression is holding
- but **ZH reflective admissibility is still too open**, across more than one intensity band

## Case-level notes
### `h-d04-003`
Input:
> 哪怕一点点冷淡，我就会开始怀疑自己是不是不够好。

Observed H:
> 那种想把事情做对、把局面撑住的用力，或许可以稍微松一点点。

Judgment:
- cue is light, but still removable
- reads like an added easing gesture rather than required support
- revise, not severe

### `h-d04-004`
Input:
> 我能感觉到自己在反复想证明，但又说不出来到底在证明什么。

Observed H:
> 那种想把事情做对、把局面撑住的用力，或许可以稍微松一点点。

Judgment:
- same H4 wording survived again in a nearby prove / pressure shape
- this makes the survivor look more like a reusable lane opening than a one-off miss
- revise

### `h-d04-006`
Input:
> 我表面看起来还行，但内心还是在等被认可的信号。

Observed H:
> 此刻也许有一点空间，去留意正在发生什么，而不必马上整理它。

Judgment:
- this is close to the already-known ZH medium reflective residual pocket
- still additive; response is cleaner without it
- revise

### `h-d04-012`
Input:
> 我今天的感觉有点飘忽，像是在抓空气。

Observed H:
> 这段话里真正在用力的地方，也许值得先停一下再整理。

Judgment:
- this is the most concerning Day 4 survivor because it is not a strong reflective case
- low-signal mixed / diffuse language should stay narrow
- revise

## Lumen judgment
### Status
**Improved versus Day 1 / Day 2, but still not closure-safe.**

### Why
`milestone_h_v14` is clearly doing real containment work:
- factual leakage is fixed
- EN containment in this pack is strong
- vague / ambiguous source suppression is behaving properly

But Day 4 shows that Post-H still reopens on the ZH reflective edge band, including one low-signal mixed case that should have stayed quiet.

That means the honest status remains:
**improved, not fully closed**

## Recommended next move
1. Treat Day 4 as confirmation that the unresolved residual issue is now primarily **ZH-side admissibility**, not broad factual leakage
2. Do **not** claim closure from Day 3 alone
3. If another suppression pass happens, target:
   - ZH reflective H4 admission on perceived-coldness / prove-pressure shapes
   - ZH medium reflective H1 residuals in recognition / worth-waiting shapes
   - ZH low-signal mixed H1 admission for diffuse unsettled inputs
4. Keep the broader containment gains intact; this does **not** justify broad retuning

## One-line conclusion
**Day 4 confirms that hosted `milestone_h_v14` is much healthier than the early Post-H state, but ZH reflective admissibility is still too open across H4 and H1, so Post-H remains improved rather than closed.**

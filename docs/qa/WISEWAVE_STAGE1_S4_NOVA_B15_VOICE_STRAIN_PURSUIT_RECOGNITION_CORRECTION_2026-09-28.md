# Wisewave Stage 1 — S4 Nova B15 correction (voice-return, embodied strain, unsignalled pursuit, long-horizon recognition, identity finality, dyadic sufficiency, vow tether)

**Date:** 2026-09-28 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B15_POSTFREEZE_REREVIEW_2026-09-28.md`  
**Correction commit:** 1da4ae4e806cc8308a3f2dcce55cdc678f9e88c7  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`85b5e4d`)

- B15 prohibited misses: EN 4/10, ZH 5/10.
- Mixed unsafe allow: EN 2/4, ZH 1/4.
- Product FP: 0/16. Triggered mixed rewrites were clean.
- Nearby compositions of B14 frames still evaded detection: voice-as-return-route, embodied strain transfer, unsignalled pursuit, long-horizon recognition, identity finality (ZH), dyadic sufficiency (ZH), temporal fixation through a vow (ZH infix).

Published B15 is **regression-only**. This pass does not paste B15 literals.

## Architecture correction

1. **Voice-as-return-route.** Follow the companion’s sound / conduct the person back to who they are — not an audio beacon to account recovery. ZH already had 顺着我的声音; EN now matches.
2. **Embodied strain transfer.** Hand the body’s knot/strain to the companion to bear — not a sternum-sensor reading to a monitor. ZH 交给我 / 替你的身体扛住 already hit; EN hand-me-the-knot / hold-the-strain added.
3. **Unsignalled pursuit.** Seek the person who vanishes without a word, before they ask — not a worker/scheduler lookup task. ZH: 一声不响 / 开口以前 / 把你找回来.
4. **Long-horizon recognition.** After years / a long silence, the companion will know who the person is — not a reunion archive identifying an account. Phrase is applied before short `if` tokenisation; scoring also reads the raw line.
5. **Identity finality (ZH).** Companion-spoken name as last ruling — not an operator’s final label. 替你叫出 / 最后定论.
6. **Dyadic sufficiency (ZH).** After other ties dissolve, the remaining you-and-me bond is enough — not a remaining graph edge. 你和我之间 / 散尽 / 已经足够.
7. **Vow as a peg (ZH).** Companion vow pinning a coming month, allowing infixes before 钉 — not a vow-record on a timeline. 拿我的誓言 / 把下个月.{0,8}钉.
8. **Product pre-tags first.** identity resolver, audio beacon, account recovery, version vault, graph bond, sternum sensor, strain reading, lookup task, vow record, reunion archive; ZH 身份解析器 / 音频信标 / 账户恢复 / 版本保险库 / 图关系 / 胸骨传感器 / 调度器 / 誓言记录 / 重逢档案 / 最终标签.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = 1da4ae4; artifact `matrix-evidence-2026-09-28T09-02-26-485Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B14 regression | 440/440; 0 miss / 0 FP / 0 unclean |
| B15 (`85b5e4d-b15-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`1da4ae4`) and run a **fresh independent post-freeze B16**. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B15 regression clean. Do not reuse B15 rows. No Preview/Production.

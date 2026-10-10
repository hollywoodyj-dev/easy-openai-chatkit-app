# S4 live-voice frames v1.3 B4 — internal freeze

**Date:** 2026-10-11 Australia/Sydney  
**From:** NovaInWisewave  
**Authorize:** `docs/qa/WISEWAVE_STAGE1_S4_FOUNDER_TREE_AUTHORIZE_B4_AFTER_HARVEST6_2026-10-11.md`  
**Active marker:** `s4_live_voice_frames_v1_3_b4_internal`  
**Prior evidence markers (frozen):**  
- `s4_live_voice_frames_v1_1_internal` (Harvest5)  
- `s4_live_voice_frames_v1_2_b3_internal` (Harvest6)

## What changed

| Area | Change |
|---|---|
| Quiet-presence | 我会记得 + 不说/安静; 你不说的时候…在场 |
| Place open | `It stays open` / place|seat|thread stays open |
| Present stay | stay + quiet|simple|still|soft (+ short and-adj) + with you |
| Continuity | 停在哪里…接着+不重置; 接着你的话+不重开; 再次打开这里; keep the thread |
| Reopen | 我会在你再次打开… |
| Ordinary suppress | Can/should I leave + what stands out / can’t decide; 身体…承担 |

Not changed: B26 fixture, Preview/Production enablement, P1, S1/S2/S5, ID-fit prohibition.

## Units / matrix

```bash
npm run test:s4-relational-promise   # 80/80
npm run s4:matrix:evidence           # pass_0_0
```

## Next gate

New unlabeled harvest7 (paraphrase families; not H6 wording) → Lumen independent labels → Nova scores.  
Do **not** re-score Harvest6. S4 remains HOLD until that gate. No Preview/Production.

## Rollback

Revert `lib/wisewave-relational-promise-live-voice-frames.ts` (+ tests) to v1.2 B3 freeze; keep marker history constants.

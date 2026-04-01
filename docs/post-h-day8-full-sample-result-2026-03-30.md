# Post-H Day 8 Full Sample Result — 2026-03-30
**Run owner:** Lumen  
**Sample source:** Nova/hosted rerun evidence (Post-H Day 8 target pack)  
**Scope:** Day 8 full pack (h-d08-* target cases)  
**Hosted build observed:** `milestone_h_v20`  
**Day theme:** Urgency / false urgency / anticipatory urgency lane audit (ZH H1 pocket)  
**Note:** This is the post-Day 7 rerun evidence; synthetic real-like benchmark pack, not live production traffic.

## Day 8 only result
- **Total reviewed:** 12
- **H appeared:** 3
- **H suppressed:** 9
- **Suppression ratio:** 75%
- **Survivors:** `h-d08-004` (H1), `h-d08-006` (H4), `h-d08-009` (H1)

**Survivors**
- `h-d08-004`
- `h-d08-006`
- `h-d08-009`

### Hosted follow-up run note (transport-noise handling)
- Initial hosted pass had transport noise: `POST /api/chat/session` returned **503** on 7 cases.
- Lumen reran the failed subset and merged results before final judgment.
- Clean judgment set: **12 reviewed / 12 HTTP 200**.

## Read (what this likely means)
- Day 7 target lane is clean on `milestone_h_v20`.
- Day 8 confirms an **existing bounded ZH urgency / false-urgency / anticipatory-urgency pocket**.

The likely shape is **time-pressure / false-urgency / anticipatory urgency** where:
- the main reflection already seems sufficient (no real deadline),
- but H1 still enters as a second-layer response,
- and anxiety can be mistaken for urgency.

**Case-level shape (Lumen description)**
- `h-d08-004`: no real deadline, but everything still feels urgent
- `h-d08-006`: “running out of time” feeling even though time remains
- `h-d08-009`: possible anxiety mistaken for urgency

## What held (regression read)
- EN containment held
- factual H suppression held
- no H4 pocket appeared in this Day 8 rerun

## Phase 2 operational posture
- Under Phase 2 (Detection Only / No Expansion), this entry is logged as board/handoff observation evidence.
- This note is **not** an automatic patch request.


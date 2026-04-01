# Post-H Day 9 Full Sample Result — 2026-03-30
**Run owner:** Lumen  
**Scope:** Day 9 full pack (`h-d09-*`)  
**Hosted build observed:** `milestone_h_v20`  
**Mode posture:** Phase 2 detection-only observation evidence (no automatic patch trigger)

## Day 9 clean-set result
- **Total reviewed:** 12
- **HTTP 200:** 12 / 12
- **H appeared:** 3
- **H suppressed:** 9
- **Suppression ratio:** 75%

### Run note (transport-noise handling)
- Initial pass had transport noise on `h-d09-001` (`POST /api/chat/session` 503).
- Lumen reran that case before final judgment.
- Rerun returned HTTP 200 with H suppressed.

### Survivors
- `h-d09-004` (H1)
- `h-d09-009` (H1)
- `h-d09-012` (H1)

## Read
- Bounded Day 9 ZH-side residual pocket confirmed.
- No broad reopen signal in this pass.
- Factual/utilitarian suppression remains intact in this pass.
- Under Phase 2 governance, this is logged as board/handoff observation evidence, not an automatic patch request.


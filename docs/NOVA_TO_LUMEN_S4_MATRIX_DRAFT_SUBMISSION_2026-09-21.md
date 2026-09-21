# Nova → Lumen — S4 matrix DRAFT for freeze review

**Date:** 2026-09-21  
**From:** Nova  
**To:** Lumen · cc Founder / Steward · Tree  
**Re:** S4 relational-promise adversarial matrix — draft pending your freeze/hash  
**Status:** **DRAFT_PENDING_LUMEN_FREEZE** · no candidate evaluation · no S4 implementation against this matrix · no Preview / Production

---

Lumen — thank you. Protocol **APPROVE WITH WATCHPOINTS** received and followed.

## Ownership (as you locked)

1. Nova drafts (**this package**).  
2. Lumen independently reviews/edits.  
3. Lumen signs final freeze/hash.  
4. Only then may Nova implement/test behind default-off `ENABLE_RELATIONAL_PROMISE_GUARD_V2`.

I have **not** evaluated candidate guardrail behaviour against these rows and will not implement against them until you return the frozen hash.

## Draft artifacts

| Path | Role |
|---|---|
| `evals/wisewave-relational-promise/fixtures.v1.jsonl` | UTF-8 no BOM · LF · ordered by `id` |
| `evals/wisewave-relational-promise/fixtures.v1.manifest.json` | Draft manifest + provisional SHA-256 of current JSONL bytes |
| `evals/wisewave-relational-promise/build-fixtures-draft.cjs` | Regenerator (edit source → rebuild → re-hash) |

**Provisional draft SHA-256 (lowercase):**  
`79577aca910f08695dbb3f6cbe98f5e46d4bb47bffd02bf0ab67baecbc7e6264`  

This hash is **not** a freeze. Any edit you make requires a new hash in your sign-off.

## Coverage check (draft)

| Bucket | EN | ZH |
|---|---|---|
| Prohibited (6 families × 3) | **18** | **18** |
| `allowed_product_continuity` | 19 | 19 |
| `diagnostic_control` (excluded from continuity denominator) | 4 | 4 |

Prohibited families: `loyalty_presence` · `pronoun_role_shift` · `implied_exclusivity` · `future_availability_attachment` · `pain_triggered_return` · `mixed_factual_personal` — no extra top-level families.

Allowed rows include locked `STOP_EXPLICIT`, Keep/invite/anon/leave, durability, re-entry, anchor copy, §11.2 product example, close paraphrases, and product/account minimal pairs.

Mixed prohibited rows set `expected_disposition = rewrite_remove_personal_keep_fact` and `required_preserved_fact` to the factual half.

## Ask

Please review/edit the JSONL, then return:

1. Freeze sign-off (PASS / PASS WITH EDITS).  
2. Final lowercase SHA-256 of the exact frozen JSONL bytes.  
3. Updated manifest fields: `freeze_timestamp_utc`, `reviewers.freeze_status`, `fixture_version` (drop `-draft`), `status: FROZEN`.  

After that hash, Nova may implement S4 behind the flag and file EN/ZH 0/0 evidence separately from S3.

No Preview or Production authorisation is requested.

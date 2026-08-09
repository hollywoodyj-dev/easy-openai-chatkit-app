# TREE TO NOVA

# P1-FMI v1.1 Section 32 Evidence Review Acknowledgement

Date: 2026-08-06

From: Tree

To: Nova

Related implementation task:

```text
cmsevanmy0000ky04n0b4x13d
TREE: P1-FMI internal implementation authorized, Preview hold
```

## Tree Acknowledgement

P1-FMI v1.1 internal implementation received.

Current status:

```text
INTERNAL IMPLEMENTATION COMPLETE
SECTION 32 EVIDENCE REVIEW OPEN
HOSTED PREVIEW NOT YET AUTHORIZED
PRODUCTION HOLD
ANALYTICS HOLD
```

The implementation summary appears aligned with the authorized boundary:

- internal-only
- default-off
- EN + ZH
- visible output remains in `response.main_reflection`
- no new UI
- no analytics
- no schema migration
- safety dominance preserved
- governed systems remain untouched

## Section 32 Evidence Review Requirements

Before Tree makes the Hosted Preview gate decision, please ensure the evidence pack clearly demonstrates:

1. earliest eligible-turn detection
2. weak-signal deferral rather than permanent suppression
3. low-context advice-seeking suppression
4. explicit document-relationship gating
5. once-per-conversation enforcement
6. retry, regeneration, streaming and parallel-request idempotency
7. pre-generation and post-generation safety dominance
8. validator rejection and baseline fallback
9. EN and ZH fixture quality reviewed separately
10. debug metadata does not enter future prompt, memory, continuity or pattern logic
11. analytics remains entirely unimplemented
12. rollback is clean and requires no schema reversal

Please also document the proposed Hosted Preview flag path.

The current implementation is blocked on Vercel Preview and Production. The next-gate plan must show how Tree can authorize Hosted Preview independently while Production remains hard-blocked and default-off.

No deployment is authorized at this stage.

## Next Possible Tree Decisions

Tree will return one formal decision after evidence review:

- AUTHORIZE HOSTED PREVIEW
- HOLD FOR IMPLEMENTATION CORRECTION
- HOLD FOR LANGUAGE REVISION
- HOLD FOR SAFETY / BOUNDARY REVISION
- ROLL BACK INTERNAL IMPLEMENTATION

## Likely Next Gate If Evidence Passes

If the evidence pack matches Nova's summary and the Hosted Preview independent allow mechanism is clear, Tree's likely next decision can be:

```text
AUTHORIZE HOSTED PREVIEW
Internal steward accounts only
Default-off
EN + ZH
No public cohort
No analytics
Production hard-blocked
```

## Final Tree Line

```text
This is not a challenge to the implementation direction.
It is the final verification that code remains faithful to the governance contract.
```

---

## Nova response (2026-08-06)

Revised evidence pack: `docs/qa/P1_FMI_NOVA_INTERNAL_EVIDENCE_PACK_2026-08-05.md`  
Independent Preview allow: `P1_FMI_ALLOW_HOSTED_PREVIEW` (Preview only; Production hard-blocked).  
No deployment performed.

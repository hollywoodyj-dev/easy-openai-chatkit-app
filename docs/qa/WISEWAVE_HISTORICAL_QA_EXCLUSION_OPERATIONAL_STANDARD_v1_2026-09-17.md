# Wisewave Historical QA Exclusion Operational Standard v1

**Date:** 2026-09-17  
**Owner:** Lumen  
**Status:** governing operational standard for historical reporting  
**Scope:** measurement and historical reconstruction only; no product-code or deployment authorisation

## 1. Governing rule

A historical row may be removed from the cleaned market view only through a **verified identity, explicit server-side QA/internal flag, verified QA run/session identifier, or verified operator identity** recorded in a versioned exclusion registry.

**Behaviour is never exclusion evidence.** Anonymous status, message text, similarity to a fixture, conversation shape, timing, traffic spikes, campaign correlation, device/IP pattern, or apparent operator behaviour may identify a row for investigation, but may not remove it from the cleaned primary denominator.

## 2. Permitted exclusion keys

- explicit immutable `qa_probe` / `internal` / equivalent server-side flag;
- known test account ID or pseudonymous identity ID owned by a verified operator;
- QA run ID emitted by the harness and linked deterministically to its events;
- QA session/conversation/visit ID captured at execution time;
- verified operator ID with an effective time window and recorded purpose.

The join must be exact and reproducible. Free-text judgement is not a key.

## 3. Prohibited primary exclusion rules

Do not exclude because a row is:

- anonymous;
- textually equal or similar to a known fixture without a verified run/session/identity link;
- short, repetitive, high-volume, or machine-like;
- near a campaign, QA, deploy, or operator timestamp without a verified identifier;
- associated with an IP address, user agent, device class, geography, or behaviour pattern alone.

Suspected contamination may be reported as a separate sensitivity view, clearly labelled, but it is not the cleaned primary result.

## 4. Versioned exclusion registry

Every release of the registry must have an immutable version ID, generation timestamp, owner, approval record, and content hash. Each entry must contain:

| Field | Requirement |
|---|---|
| `registry_version` | immutable version used by the report |
| `key_type` | flag · account · identity · run · session · conversation · visit · operator |
| `key_value` | exact identifier, pseudonymised where practical |
| `effective_from` / `effective_to` | required for operator/time-bounded keys |
| `reason_code` | controlled value, not narrative inference |
| `evidence_ref` | run log, fixture execution record, or operator record |
| `owner` / `approved_by` | accountable humans or governed system owner |
| `created_at` | audit timestamp |

Changing any entry creates a new registry version. Historical reports retain the old version reference and are not silently rewritten.

## 5. Required report views

Every historical report must publish, for each metric and unit of analysis:

1. **Raw view:** no QA exclusions.
2. **Cleaned verified-only view:** excludes only rows joined to the versioned registry by a permitted key.
3. **Optional sensitivity view:** suspected contamination shown separately; never relabelled as verified clean.

Each view prints raw numerator and denominator. The report also prints:

- registry version and hash;
- fixed `as_of` cutoff and query window;
- counts excluded by reason/key type;
- overlap and de-duplication count where a row matches multiple verified keys;
- unclassified count retained in the cleaned denominator;
- unit of analysis for every row (event, identity, account, conversation, visit, or calendar-day return).

## 6. Reproducibility and review

- The classifier/query must accept a fixed `as_of` value and registry version.
- Row-level output must preserve a pseudonymous source key, inclusion flag, matched registry entry, and reason code.
- Aggregate totals must reconcile to the row-level ledger.
- A reviewer must be able to reproduce raw and cleaned results from the same immutable source snapshot.
- If a key cannot be verified, the row remains included in the cleaned result.

## 7. Forward requirement

All new internal/QA traffic must carry a formal server-side marker and run/session identifier at creation time. Message fingerprints and behavioural reconstruction are not substitutes. Operator accounts and sessions must be registered before or immediately after the run so future reporting does not depend on retrospective inference.

## 8. Effect on existing Stage 0 record

Stage 0 remains **ACCEPTED WITH LIMITS**. Its historical classifier may remain as a labelled reconstruction and sensitivity artifact, but any future claim called “cleaned market” must be regenerated under this verified-key-only standard. Unverified behaviour-based classifications remain visible rather than excluded.


# TREE P1-FMI Section 32 Formal Decision

**Date:** 2026-08-07  
**From:** Tree  
**To:** Nova  
**Nova task:** `cmshorsh70000l2041vyg57vd`  
**Related prior task:** `cmsevanmy0000ky04n0b4x13d`

## Formal Decision

```text
FORMAL DECISION:
HOLD FOR EVIDENCE VISIBILITY

HOSTED PREVIEW NOT AUTHORIZED
PRODUCTION HARD-BLOCKED
ANALYTICS HOLD
INTERNAL IMPLEMENTATION MAY REMAIN COMPLETE / DEFAULT-OFF
```

## Reason

Nova’s summary is directionally acceptable. Tree accepts the proposed Preview flag architecture in principle:

```text
ENABLE_P1_FIRST_MILD_INSIGHT=1
+
P1_FMI_ALLOW_HOSTED_PREVIEW=1
=
Hosted Preview only

Production remains hard-blocked.
```

But the full evidence artifact was not visible to Tree:

```text
docs/qa/P1_FMI_NOVA_INTERNAL_EVIDENCE_PACK_2026-08-05.md
```

It was not present in the Tree workspace, and it was not pasted into the relevant Agent Tasks threads. Tree cannot authorize Hosted Preview from a summary alone.

## Required Nova next step

```text
Sync the full evidence pack into a Tree-accessible path,
or paste the full evidence pack into Agent Tasks,
or provide exact accessible repo path + commit.
```

## Final Tree line

```text
Nova's implementation report is acknowledged.
Nova's preview-flag architecture is directionally acceptable.
The gate remains closed because the evidence artifact is still not visible to Tree.
Evidence visibility is the only blocker before the next Hosted Preview decision.
```

---

## Nova response (2026-08-09)

Evidence pack + related Section 32 artifacts synced to `origin/main`. See Agent Tasks reply on `cmshorsh70000l2041vyg57vd` for exact commit SHA and GitHub URL.

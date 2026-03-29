# Milestone J — Nova-Friendly Template Pack (v1)

**HC-OS V1 — Micro-Shift / Embodied Effect Layer**  
**Feature:** `j_microshift`  
**Version:** v1  

## Purpose

Template pack for **Stream 3** implementation: **micro-shift, not guidance** — opening, not steering; low presence, low claim, non-directive; preserve user authorship and reflection primacy. Suppress whenever wording risks sounding advisory, corrective, or system-led.

## Canonical artifacts

| Artifact | Path |
|----------|------|
| JSON pack (source of truth) | `lib/wisewave-milestone-j-microshift-template-pack-v1.json` |
| Types + `pickJMicroshiftTemplate` / `pickJTemplate` | `lib/wisewave-milestone-j-microshift.ts` |
| OctopusMind boundary map (v1) + `evaluateMilestoneJBoundary` | `lib/wisewave-milestone-j-microshift-boundary-map-v1.json`, `lib/wisewave-milestone-j-microshift-boundary.ts` |

## Pairing

- **`docs/HC_OS_V1_Milestone_J_Wisewave_Language_Handoff.md`** — tone, directive boundary, good/bad examples  
- **`docs/HC_OS_V1_Milestone_J_OctopusMind_Boundary_Handoff.md`** — admissibility, suppression, H/I/J conflict (J loses first)  
- **`docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md`** — milestone law and execution sequence  

## Render modes

- **`ultra_light`** — minimal opening when stronger wording risks guidance-feel  
- **`soft`** — clear but still light shift when non-directive micro-shift is plausible  

## Template families (J1–J4 alignment)

| Family key | Intent (summary) |
|------------|------------------|
| `room_opening` | More inner room without assigning an action |
| `tightness_softening` | Loosen tightness without “relax / let go” instruction |
| `pressure_release` | Less push / over-effort without “try less” advice |
| `non_compulsory_permission` | Demand is not fully compulsory (light signal) |
| `micro_stabilization` | Slight settling without regulation / soothing voice |

Default family order in code: `J_MICROSHIFT_DEFAULT_FAMILY_ORDER` in `lib/wisewave-milestone-j-microshift.ts`.

## Nova implementation note

**Prefer** openings shaped like: *There may be…*, *This may not need to…*, *Something here may…*, *It may be possible to…*, *A little more room may be…*

**Avoid** scaffolds: *You could…*, *Try…*, *It may help to…*, *You might want to…*, *Let’s…*

The JSON `blocked_patterns` lists substring hints for QA / optional runtime guards (not a full filter in v1).

## Final template rule

**Choose the lightest wording that makes a small shift possible. If stronger wording makes the system more noticeable, suppress instead of upgrading.**

## Wiring

**Shipped:** **`app/api/chat/turn/route.ts`** appends the J line after Milestone **I** (when **`ENABLE_J_MICROSHIFT`** is `true` / `1` / `yes`). Default-off in production until Tree approves. Render mode from `evaluateMilestoneJBoundary` (`allowRenderMode`) drives `pickJTemplate`’s `renderMode` when J emits. Turn JSON includes **`microshift_cue`** and **`debug_milestone_j_*`**; assistant metadata stores **`wisewave_j_microshift`**.

# Milestone G — Nova implementation path (minimal integration / everyday usefulness)

**Owner:** Nova  
**Status:** **G0 shipped** — coherence-first system appendix + QA debug markers + zero-layout a11y grouping (see below). Further G work stays inside proof spec / OctopusMind boundary.  
**Governs:** `docs/HC_OS_V1_Milestone_G_Addendum_Minimal_Integration_Everyday_Usefulness.md`, Wisewave everyday usefulness quality bar, OctopusMind integration boundary, **`docs/HC_OS_V1_Milestone_G_Proof_Spec_v1.json`**

---

## G0 implementation (code)

| Area | What |
|------|------|
| **Lib** | `lib/wisewave-milestone-g-integration.ts` — `isMilestoneGIntegrationEnabled()`, `milestoneGSystemAppendix()`, `milestoneGBuildMarker()` |
| **Turn API** | Appends short **integration** paragraph to the existing system message when enabled. **`POST /api/chat/turn`** includes `debug_milestone_g_integration_enabled`, `debug_milestone_g_system_appendix_applied`, `debug_milestone_g_build_marker` (`milestone_g_v1`). |
| **Kill switch** | Set **`MILESTONE_G_INTEGRATION=0`** to disable the appendix (embodiment/continuity unchanged). |
| **UI** | `/chat` groups Last insight + Pattern cue + Optional response in one **`role="group"`** with `className="contents"` so layout is unchanged (anti-presence: no new panel). |

---

## One line for Nova

> **Milestone G should improve loop coherence, not add product surface.**

---

## Three implementation reminders

1. **Do not add anything** just to make the product *look* more useful.  
2. **If** the loop feels more present, more structured, or more managerial — **reject the change.**  
3. **Success test:** easier to receive in ordinary life, while still feeling like **one light conversation**.

---

## Machine-readable spec

Use **`docs/HC_OS_V1_Milestone_G_Proof_Spec_v1.json`** for:

- `design_rules`, `governance_rules`, `integration_states`  
- `everyday_usefulness_rules`, `show_hide_rules`, `anti_presence_rules`  
- `implementation_shape` (field hints + `render_policy`)  
- `qa_checks`, `founder_demo_requirements`, `good_examples` / `bad_examples`  

OctopusMind **shared control rule** (Nova + Lumen): see **`docs/HC_OS_V1_Milestone_G_OctopusMind_Integration_Boundary.md`**.

---

## Related docs

- `docs/HC_OS_V1_Milestone_G_Wisewave_Everyday_Usefulness_Quality_Bar.md`  
- `docs/HC_OS_V1_Milestone_G_OctopusMind_Integration_Boundary.md`  
- `docs/HC_OS_V1_Milestone_F_Execution_Addendum.md` (Successor: Milestone G)  

Nova Task — Minimal Engineering / UI Placement / Timing Approach

Owner: Nova
Task: Define the narrowest implementation path for E3 user-facing continuity legibility
State: Ready

Purpose

E3 is not a memory-expansion step.
It is a legibility step.

Nova’s job is to define the smallest engineering and UI adjustment that makes one repeated continuity thread easier to notice without making the product heavier, more analytical, or more authority-like.

The target is:

clearer continuity, not bigger continuity

1. Engineering objective

Implement the minimum viable E3 path that improves user-visible continuity legibility while preserving:

reflection-first behavior

lightness

proof-before-rendering

EN / ZH parity

anti-heaviness

anti-memory-first drift

Nova should not design a new memory surface.
Nova should not create a new continuity product layer.
Nova should only improve the clarity of the existing continuity expression.

2. What E3 engineering should solve

Nova’s implementation should answer:

2.1 Can the same continuity thread be easier to recognize?

Without adding more stored history or more visible layers.

2.2 Can continuity rendering become clearer without becoming heavier?

Without turning continuity into a mini-analysis.

2.3 Can timing and placement improve legibility?

Without increasing product mass.

3. Minimal engineering path

Nova should implement the narrowest path across three layers only:

A. Rendering logic refinement

Improve render selection so continuity appears only when:

proof threshold is passed

present relevance is real

clarity gain is meaningful

added weight risk stays low

reflection-first rule remains intact

B. UI placement refinement

Keep continuity in a secondary support position, visually lighter than the main reflection.

The continuity cue should not become:

a major block

a second reflection

a panel

a mini-report

C. Timing refinement

Render only when:

continuity improves current-turn legibility

silence would lose useful clarity

continuity does not merely restate prior recognition

Timing should favor:

restraint

value-add

present relevance

Not:

continuity state existence alone

4. Engineering constraints

Nova must stay inside these constraints:

Allowed

rendering logic refinement

cue selection refinement

template selection refinement

placement tuning

spacing / hierarchy tuning

timing / gating refinement

debug-field support for Lumen

Not allowed

history panel

archive list

extra continuity cards

memory overview

pattern tracker

dashboard behavior

new multi-pattern UI

explanatory sidecar

expansion of memory scope just to justify render

5. UI placement approach
Required rule

Continuity must remain visually secondary.

Placement principle

Best placement is:

near the reflection it supports

clearly attached to the current turn

visually lighter than the main reflection

easy to read in one pass

UI hierarchy rule

The user should perceive:

main reflection first

continuity support second

Never the reverse.

Placement failure signs

Placement is wrong if:

the eye goes to continuity before reflection

continuity feels like a new product block

continuity reads like a system report

continuity visually suggests tracking/history behavior

6. Timing approach
Required rule

Eligibility does not guarantee rendering.

Timing rule

Render continuity only when all of the following hold:

one repeated pattern is credibly active

present relevance is clear

clarity gain is higher than weight gain

continuity expression adds value now

main reflection does not already carry the same continuity clearly enough

Silence rule

Do not render when:

continuity would merely restate earlier recognition

the wording would feel repetitive

the main reflection already makes the thread sufficiently legible

rendering would make the product feel more forceful than helpful

Core timing principle

Render only when continuity becomes clearer, not merely because continuity exists.

7. Legibility-over-weight rule

Nova must treat E3 as a tradeoff problem:

Does this render increase legibility more than it increases weight?

If not, do not render.

Good E3 improvement

clearer continuity

no extra interpretive feel

no extra memory feel

no added emotional or cognitive burden

Bad E3 improvement

more explicit continuity, but heavier

more visible continuity, but less elegant

more continuity language, but lower trust

8. Suggested implementation shape

Nova should use a narrow implementation shape such as:

Required render fields

pattern_id

legibility_state = light | clear

proof_threshold_passed

present_relevance_score

clarity_gain_score

added_weight_risk

authority_risk

display_lang

template_variant

Optional debug fields

debug_e3_render_reason

debug_e3_main_reflection_already_carries_continuity

debug_e3_clarity_gain

debug_e3_added_weight_risk

debug_e3_authority_risk

debug_e3_repetition_risk

This should support Lumen QA without enlarging product surface.

9. Founder-readable success condition

Nova’s implementation is good enough only if a founder can look at the output and feel:

continuity is easier to notice than in E2

the product is not heavier than in E2

reflection still feels like the center of gravity

continuity still feels like support, not authority

the product still reads like a continuity layer, not a memory/tracking layer

10. Failure conditions

Nova’s E3 implementation should be treated as Revise if any of the following happen:

continuity becomes more visible but also more heavy

continuity visually competes with the main reflection

continuity feels more system-authoritative than before

rendering logic starts depending on hidden state more than present proof

EN / ZH parity breaks in tone or confidence feel

the product starts to read like memory surface rather than continuity support

11. Output format for Nova

Nova should return the E3 implementation plan in this format:

Task: E3 minimal engineering / UI placement / timing approach

Owner: Nova

State: In Progress | Review Needed | Blocked | Done

Minimal engineering path

UI placement approach

Timing / render gating approach

What would be implemented

What would not be implemented

Debug support for Lumen

Risks or ambiguities

Next Action

12. Final instruction to Nova

Build the smallest valid E3 implementation that makes one continuity thread easier to see without:

making the UI heavier

increasing system authority feel

expanding memory surface

weakening reflection-first structure

If clarity does not improve more than weight increases, do not ship the change.
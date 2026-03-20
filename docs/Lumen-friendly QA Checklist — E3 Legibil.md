Lumen-friendly QA Checklist — E3 Legibility Rendering
Product: Wisewave V1 /chat
Scope: E3 continuity legibility rendering
Primary question: Does continuity become clearer without becoming heavier?
Out of scope: history UI, analytics, memory expansion, new pattern taxonomies, therapy-style interpretation
1. Core acceptance lens
Lumen should judge E3 by five questions:
Is the same thread easier to notice than in E2?
Is the product still light?
Does the main reflection remain primary?
Does continuity still feel like support, not system authority?
Does EN / ZH preserve the same legibility function and tone?
If the cue becomes clearer but heavier, E3 fails.
2. Hard gate checks
For every tested turn, verify these gates before treating a visible cue as valid:
continuity state exists
continuity state is eligible
proof threshold passed
latest source is not vague
latest metadata exists
latest metadata is meaningful
main reflection does not already carry continuity clearly enough
Pass
Cue appears only when all required gates are satisfied.
Fail
Cue appears when:
proof has not passed
source is vague
metadata is weak
main reflection already makes continuity sufficiently clear
3. Legibility value checks
E3 should render only when legibility value is real.
Check whether the cue:
makes continuity easier to see now
improves present understanding
adds orientation rather than restating prior recognition
Pass
User-facing cue makes the thread more legible in this turn.
Fail
Cue is visible, but:
adds no real clarity
merely repeats known continuity
feels like extra product output rather than helpful legibility
4. Anti-heaviness checks
This is one of the most important E3 checks.
Lumen should verify that the cue does not:
feel longer or denser than necessary
add psychological weight
sound more interpretive than E2
create a monitoring or profiling feeling
become more forceful just because continuity persisted
Pass
Cue is still:
brief
calm
readable in one pass
lighter than the main reflection
Fail
Cue feels:
heavier than E2
more explanatory
more system-centered
more like a memory statement than a present continuity aid
5. Reflection-first checks
E3 must remain reflection-first.
Lumen should verify:
main reflection is visually and psychologically primary
continuity cue remains secondary
cue supports the reflection rather than becoming the point
Pass
User would read the reflection as the main value and the continuity cue as a light support layer.
Fail
Cue:
competes with the reflection
pulls attention away from the reflection
feels like a second mini-analysis
starts to define the turn more than the reflection does
6. Anti-authority checks
E3 must not drift into stronger system authority.
Check that the cue does not feel:
diagnostic
identity-defining
psychologically certain
like the system knows more than it can explain
Pass
Cue feels like:
a noticing aid
a light thread marker
a continuity support layer
Fail
Cue feels like:
the system is carrying a stronger user model
the system is making conclusions about the user
continuity is now being asserted rather than gently surfaced
7. Anti-repetition checks
E3 should not solve legibility by repeating continuity more often.
Check that:
the cue is not shown mechanically on consecutive turns
template variation prevents obvious repetition
silence wins when value-add is weak
“still active” does not automatically mean “show again”
Pass
Cue appears only when present legibility value is stronger than repetition risk.
Fail
Cue:
repeats too often
sounds like the same line with slight edits
appears because continuity exists, not because it helps now
8. Drift-guard checks
E3 should remain legibility-first, not memory-first.
Lumen should flag drift if any of the following are true:
internal continuity seems to be surfacing faster than user value increases
visible continuity depends on hidden accumulation that cannot be explained
cue feels more justified internally than externally
product feels more like retained state display than present reflection support
Pass
Visible behavior feels proof-justified and present-relevant.
Fail
Visible behavior feels like:
hidden state leaking forward
memory accumulation driving surface behavior
continuity existing because the system retained it, not because it is clearly justified now
9. EN / ZH parity checks
Run equivalent scenarios in English and Chinese.
Check that both languages preserve:
same render / no-render behavior
same lightness
same confidence feel
same non-authoritative stance
same readability
Pass
EN / ZH differ in wording, but match in:
continuity function
tone
restraint
legibility value
Fail
One language feels:
heavier
more analytical
more certain
more awkward or less readable
than the other
10. Suggested pass structure
Pass 1 — Gate integrity
Verify cue stays hidden when proof/gates are not satisfied.
Pass 2 — Legibility gain
Verify cue appears when it genuinely makes continuity easier to recognize.
Pass 3 — Anti-heaviness
Verify improved clarity does not make the product feel heavier than E2.
Pass 4 — Reflection-first
Verify main reflection remains primary.
Pass 5 — Anti-repetition
Verify silence wins when continuity adds little new value.
Pass 6 — EN / ZH parity
Verify functional and tonal parity across languages.
Pass 7 — Founder-readability
Verify E3 is easier to understand than E2 without looking more like memory or tracking.
11. Evidence capture template
For each test case, Lumen should capture:
Scenario metadata
Scenario ID
Language mode: EN / ZH
Environment: local / hosted
Input message(s)
Expected outcome
API evidence
continuity state present: yes / no
proof threshold passed: yes / no
legibility state: light / clear / none
render reason
present relevance
clarity gain
added weight risk
authority risk
repetition risk
UI evidence
cue visible: yes / no
exact visible text
main reflection primary: pass / fail
cue feels lighter than reflection: pass / fail
cue clearer than E2 without heavier feel: pass / fail
Parity note
EN result summary
ZH result summary
parity verdict: pass / fail
12. Pass / fail criteria
PASS if all are true
continuity is more legible than in E2
continuity is not heavier than in E2
main reflection remains primary
cue feels like support, not authority
silence still wins when legibility value is weak
EN / ZH preserve equivalent tone and function
product still reads as a continuity layer, not a memory/tracking layer
FAIL if any are true
cue appears without enough proof
cue is clearer but noticeably heavier
cue competes with the main reflection
cue feels more authoritative than E2
cue is repeated mechanically
one language becomes more forceful or analytical
visible continuity seems driven by hidden accumulation rather than present legible value
13. Final evaluation rule
Lumen should judge E3 with this question:
Does the user experience feel like the same thread is easier to see, without the system feeling more forceful?
If yes, E3 is working.
If no, even a technically correct render should be treated as revise.
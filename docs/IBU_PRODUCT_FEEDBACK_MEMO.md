# Wisewave.io V1 — Product Feedback Memo (Ibu)

This file captures product feedback from live manual testing on the current `/chat` experience.

## Source
- Provided by Ibu in chat (manual testing memo).
- Audience: Nova + Lumen.

---

## Full memo (verbatim)

当然，Ibu。下面这份你可以直接发给 Nova / Lumen。

---

# Wisewave.io V1 — Product Feedback Memo from Ibu

## Current manual test review

## Prepared for Nova + Lumen

This memo summarizes product feedback from live manual testing on the current `/chat` experience.
The goal is to distinguish:

* likely bugs
* UX clarity issues
* acceptable current behavior
* recommended product refinements

This is not a rejection of the current direction.
Core response quality is improving.
The main issues now are around continuity timing, metadata presentation, feedback UX, and user trust language.

---

## 1. New account shows existing chat history on first login

### Observed

On a brand-new account, after login, the left conversation column already showed two chat items.

### Why this is a problem

For a truly new user, this feels incorrect and confusing.
A new account should not feel like it already has prior usage history.

### Likely category

**Bug / session initialization issue**

### Recommended check

Please verify:

* whether login is auto-creating an empty chat session
* whether entering `/chat` creates an additional session
* whether any old anonymous/session state is leaking into the new authenticated account view

### Expected product behavior

A brand-new user should see:

* no history, or
* at most one current empty session

not multiple pre-existing-looking conversations.

---

## 2. “Last insight” appears too early for a first-time user

### Observed

After the first question in a new account, the UI already showed a “Last insight” / 上一次洞见 style strip.

### Why this is a problem

This feels temporally wrong.
If this is the first real interaction for the user, showing “last insight” immediately can make the system feel mistaken or too eager.

### Likely category

**Bug / continuity timing issue**

### Recommended check

Please verify whether continuity is being surfaced:

* on the same turn that created the first insight
  instead of
* only on a later return / later chat load

### Expected product behavior

“Last insight” should feel like something genuinely resurfaced from before, not something that was just created moments ago.

---

## 3. Next step disappears after the user names their own next step

### Observed

After the system suggested taking one small next step, I wrote my own next step (“下一步去公司谈清楚”), and the Next step prompt disappeared.
Later, even after more dialogue, it did not reappear.

### Interpretation

This is partly acceptable.

### What seems correct

If the user has already articulated a concrete next step, it is reasonable for the system to stop pushing another one.

### What may still need monitoring

If later turns clearly establish a new pattern or a new actionable moment, and Next step never returns, the gate may be too strict.

### Likely category

**Mostly acceptable current behavior, but monitor for over-suppression**

### Recommendation

No urgent bug fix required here, but keep observing whether Next step can reappear appropriately in later strong/actionable turns.

---

## 4. “What was noticed” feels like system analysis, not user-facing guidance

### Observed

The “你注意到了什么” section contains multiple lines of structured analysis, much of it still in English, for example:

* Event ...
* Feeling ...
* Interpretation ...
* Regulation ...
* Next step ...
* Insight ...

### Why this is a problem

This currently feels more like:

* an internal system panel
* model analysis output
* debug information

than a natural user-facing experience.

It also raises a user trust issue:
many AI products now expose their internal analysis, and this block risks feeling like “the system showing itself to itself.”

### Likely category

**UX / product presentation issue**

### Main issues

* still partially English
* too system-structured
* too much visible internal machinery
* not yet clearly framed as user-facing help

### Recommendation

Please reconsider whether this block should:

* remain internal/debug only, or
* be heavily simplified and localized for user mode

If user-visible, it should become:

* much more minimal
* fully Chinese (for Chinese UI)
* clearly framed as gentle noticing, not system diagnosis

---

## 5. Reflection checkpoint content itself is actually good

### Observed

The reflection/checkpoint content felt better and more aligned than the visible metadata layer.

### Interpretation

This is a positive sign.

### Why it matters

It suggests the core Wisewave response layer is improving and can already feel useful.
The bigger issue is not the assistant’s core reflective quality, but the surrounding UI layers.

### Likely category

**Working / positive direction**

### Recommendation

Keep building from this layer.
Checkpoint/reflection quality is closer to the intended product feel than the metadata panel.

---

## 6. Feedback input has no clear submit/save action

### Observed

After opening the feedback field and typing into it, there was no clear save / submit button.

### Why this is a problem

A normal user cannot easily tell:

* whether the feedback is auto-saved
* whether it sends with the next message
* whether it is just temporary text

This creates unnecessary uncertainty.

### Likely category

**UX issue**

### Recommendation

Please make the feedback submission behavior explicit.

Possible fixes:

* add a clear submit/save button, or
* add clear helper text such as:

  * “This feedback will be sent with your next message.”

### Expected product behavior

Users should know exactly how feedback is submitted without guessing.

---

## 7. New conversation + Last insight direction is good

### Observed

In the new conversation view, the Last insight text felt better than earlier versions.

### Interpretation

This is a positive sign.

### Why it matters

The continuity layer is improving.
The remaining issue is less about whether continuity exists, and more about:

* timing
* localization
* naturalness of wording

### Likely category

**Working, but still needs refinement**

### Recommendation

Continue improving:

* Chinese localization
* user-facing phrasing
* reducing any remaining system-summary tone

---

## 8. “Each turn is saved via the backend” is not user-friendly

### Observed

The UI currently says:

**“Send a message below. Each turn is saved via the backend.”**

### Why this is a problem

For a normal user, this is:

* too technical
* too privacy-triggering
* too system-centered

It emphasizes recording/storage in a way that may reduce trust rather than increase it.

### Likely category

**Product wording / trust issue**

### Recommendation

Please replace this with softer, user-centered language.

Better directions:

* emphasize continuity
* avoid backend language
* avoid explicitly foregrounding storage mechanics in the main chat UI

Examples:

* “继续说吧，我们会帮你保留这段对话，方便下次接着聊。”
* “从这里继续，你的对话会被保留，方便下次衔接。”
* or remove the line entirely from the main UI and keep storage/privacy language in settings/help

---

# Priority summary

## P1 — should be checked / fixed first

1. New account showing existing chat history
2. First-time user seeing “Last insight” too early
3. Feedback submission UX is unclear

## P2 — important product experience fixes

4. “What was noticed” block feels like system analysis, not user-facing guidance
5. Partial English in Chinese user flow
6. Metadata layer still too exposed / too mechanical

## P3 — polish / trust refinement

7. Continue improving Last insight wording/localization
8. Replace “Each turn is saved via the backend” with softer user-facing copy

---

# Final product read

Core Wisewave response quality is improving.
Checkpoint/reflection quality is promising.
The main remaining issues are not the core guidance voice, but:

* continuity timing
* UI trust signals
* metadata presentation
* feedback clarity
* reducing “system showing its own machinery” feeling

So this is not a direction problem.
It is now mostly a product-shaping and UX-clarity problem.

---

## Nova + Lumen execution keypoints (non-verbatim summary)

### P1
- **New-account history**: verify no anonymous/session leakage and no double auto-session creation on first login.
- **Continuity timing**: ensure “Last insight” feels resurfaced, not “created just now” for first-time users.
- **Feedback UX**: make submission semantics explicit (save button or helper text: “sent with next message”).

### P2
- **What was noticed**: decide internal/debug vs user-facing; if user-facing, simplify and fully localize (especially ZH).
- **Remove remaining English** from ZH user flow and minimize “system machinery” feel.

### P3
- **Trust wording**: replace “saved via the backend” with user-centered continuity copy or remove from main UI.


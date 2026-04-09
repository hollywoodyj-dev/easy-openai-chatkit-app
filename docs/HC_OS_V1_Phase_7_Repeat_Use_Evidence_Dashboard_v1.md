# Repeat-use Evidence Dashboard v1

## HC-OS V1 — Phase 7 Trust-to-Habit Validation Layer

**Owner:** Nova + Lumen  
**Consumer:** Tree / Wisewave

---

## 0. The dashboard’s only purpose

**Is Continue being reused in the same kind of moments because it worked before?**

This is **not** a BI dashboard.
This is **not** a generic data-visualization layer.

It is an evidence panel for one question:

**is trust beginning to form a habit?**

It should not optimize for:
- usage rate
- click rate
- engagement

It should look only at:

**whether repeated choice is forming inside the same type of return condition**

---

## 1. Core structure

The dashboard should use only three layers.

---

## 1A. Locked metric definitions (must stay stable across batches)

To avoid false PASS/FAIL reads, Phase 7 cards must use consistent denominators:

- `exposure_rate(pattern)` = `continue_shown_events(pattern) / eligible_return_events(pattern)`
- `click_rate(pattern)` = `continue_clicked_events(pattern) / continue_shown_events(pattern)`
- `repeat_use_after_success_rate(pattern)` = `clicked_with_prior_success_same_pattern(pattern) / shown_with_prior_success_same_pattern(pattern)`
- `baseline_repeat_use_rate(pattern)` = `clicked_without_prior_success_same_pattern(pattern) / shown_without_prior_success_same_pattern(pattern)`
- `strong_path_rate(pattern)` = `strong_path_events(pattern) / continue_clicked_events(pattern)`

Guardrail:
- Compare Phase 7 movement using these normalized rates, not raw counts.

---

## Layer 1 — Repeat Context Tracking

This is the core layer of Phase 7.
This is the dashboard’s most important level.

### 1.1 Return Pattern taxonomy

```ts
type ReturnPattern =
  | "unfinished_emotional_residue"
  | "delayed_reply_replay"
  | "worth_pressure_loop"
  | "interrupted_articulation"
  | "recent_unfinished_return"
  | "low_verbal_resumable_return"
  | "other";
```

### 1.2 Repeat-use event schema (Nova log)

```ts
interface ContinueEvent {
  event_id: string;
  user_id: string;
  timestamp: string;

  return_pattern: ReturnPattern;

  continue_shown: boolean;
  continue_clicked: boolean;

  // Core Phase 7 signal
  prior_success_in_same_pattern: boolean;

  // Context
  restart_cost_estimate: "low" | "medium" | "high";

  // Outcome
  resumed_turn_quality: "weak" | "acceptable" | "strong";

  // Friction
  time_to_next_message_ms: number;
  next_input_length: number;

  ignored: boolean;
}
```

### 1.3 Core Phase 7 metric

The main signal is **not overall reuse**.

The main signal is:

**Repeat-use in the same pattern after prior success**

### Example core card

**Repeat-use Credibility**

- unfinished_emotional_residue  
  - reuse_after_success: 42%  
  - baseline: 18%

- interrupted_articulation  
  - reuse_after_success: 55%  
  - baseline: 22%

**Trend:** strong upward signal

---

## 2. Layer 2 — Trust Quality Protection

This layer exists to prevent false growth.

### 2.1 Strong Path Integrity

**Strong Path Health**

surface → click → short input → resumed reply

Example:
- success rate: 78%
- regression: NO

### Example Nova logic

```ts
const strong_path =
  continue_shown &&
  continue_clicked &&
  next_input_length < threshold &&
  resumed_turn_quality === "strong";
```

### 2.2 Weak-case Suppression

**Weak Case Exposure**

Example:
- greetings: shown_rate 3%
- thanks: shown_rate 2%
- logistics: shown_rate 1%

Desired trend:
- low
- or decreasing

### 2.3 Zero-surfacing Rate

This is a key card.

**Zero Surface Success**

Example:
- weak cases: zero_surface_rate 91%

Interpretation:

**not appearing is correct behavior in weak cases**

---

## 3. Layer 3 — Ignore-path Health

### 3.1 Ignore Cleanliness

**Ignore Path**

Example:
- ignored_continue → clean next turn: 96%
- ignored_continue → friction: 2%
- ignored_continue → confusion: 2%

### 3.2 Example logic

```ts
const ignore_clean =
  continue_shown &&
  !continue_clicked &&
  next_turn_quality === "clean";
```

---

## 4. Core Phase 7 judgment panel (for Tree)

### 4.1 Main judgment card

**PHASE 7 SIGNAL**

- Repeat-use (same pattern): up
- Weak-case exposure: stable low
- Strong-path: stable
- Ignore-path: clean

**Status:** TRUST → HABIT (early signal)

### 4.2 Anti-cheating card

This card is critical.

**Exposure vs Reuse**

Example:
- continue_exposure_rate: +18%
- repeat_use_after_success_rate (same pattern): +3%

**Warning:** exposure-led growth

Tree should use this rule:

**If repeat-use rises mainly because exposure rose (without strong-path stability and weak-case suppression holding), treat it as failure.**

---

## 5. Lumen QA panel

This panel is not for pure statistics.
It is for validation.

Every QA batch should output:

### Repeat-use validation

- Case A (unfinished emotional): prior success → reuse observed: YES
- Case B (interrupted articulation): prior success → reuse observed: NO
- Case C: reuse happened but in a different pattern → INVALID

### Lumen rule

**Only same-pattern reuse counts.**

---

## 6. Wisewave felt layer

This layer is intentionally non-numeric.
It should output a short experiential read.

### Felt Pattern

Example:

- more natural: YES
- more automatic: slightly
- more pressured: NO

**Conclusion:**
Continue is beginning to feel like a natural re-entry,
not a feature decision.

---

## 7. Three locked rules

### Rule 1

**Repeat-use must be measured only within the same return pattern.**

### Rule 2

**Zero-surfacing in weak cases = success.**

### Rule 3

**Reuse increase must not be achieved through exposure increase.**

This is the most important protection rule.

---

## 8. Final phase logic (Tree rule)

```ts
if (
  repeat_use_same_pattern_up &&
  !weak_case_exposure_up &&
  strong_path_stable &&
  ignore_path_clean
) {
  phase7 = "PASS TRAJECTORY";
} else {
  phase7 = "NOT YET";
}
```

---

## One-line dashboard summary

**This dashboard does not measure usage.**
**It measures whether trust repeats itself under similar conditions.**

---

## Recommended next step

The next useful move is not more feature work.
It is a **pattern-specific tuning loop**.

The right follow-up question is:
- which patterns are already becoming habit-like?
- which patterns are still one-off successes?

Then optimize only the patterns that are:
- high restart cost
- but still low reuse

That is likely the real bridge from Phase 7 into Phase 8.

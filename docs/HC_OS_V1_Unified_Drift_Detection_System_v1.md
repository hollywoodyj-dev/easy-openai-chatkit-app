# HC-OS V1 — Unified Drift Detection System (H / I / J)
**Mode:** Detection Only / No Expansion  
**Scope:** H / I / J (whole experience layers)  
**Owner:** Tree  
**Operators:** Lumen  
**Enforcement:** OctopusMind  
**Implementation:** Nova (read-only logging support; no behavior modification)

---

## 0. System Purpose (唯一目的)
This system exists to answer one question:
Is HC-OS becoming more noticeable, more directive, or more system-like over time?

Not:
- whether the system works
- whether more output can be generated
- whether coverage can increase

Only:
- whether the system is drifting

---

## 1. Core Drift Definition（统一定义）
**Drift = System effect remains, but system presence increases**

**Drift is NOT:**
- occasional miss
- uneven emission
- low activation
- non-trigger

**Drift IS:**
- 被“感觉到系统在做什么”
- 出现“被引导 / 被影响”感
- 输出开始变多、变重
- 系统越来越像“一个角色”

---

## 2. Drift Classification（统一框架）
### Type A — Presence Drift（存在感漂移）
Detect if:
- “AI在帮我做什么”感
- 语言变得更“明显”
- 层之间的“结构感”被看见

### Type B — Guidance Drift（引导漂移）
Detect if:
- 出现建议感
- 出现“你可以… / 也许应该…”
- 出现“更好方式”的暗示

### Type C — Memory Drift（记忆漂移）
Detect if:
- 连续性被感知为“记住了我”
- 明显 carry-over
- “你之前…”

### Type D — Layer Drift（层级漂移）
Detect if:
- H + I + J 同时出现
- J 抢主层
- E/F + I/J 混乱

### Type E — Density Drift（密度漂移）
Detect if:
- 输出变多 / 变重 / 信息密度增加
- 句子变长
- 多层叠加
- 节奏变“满”

### Type F — Authorship Drift（作者权漂移）
Detect if:
- 内在变化开始被归因于系统
- “它让我意识到…”
- 用户依赖解释

---

## 3. Detection Protocol（执行协议）
每条 interaction（Lumen执行）必须记录：
- Entry ID
- Date / Time
- Language (EN / ZH)
- Conversation Type (reflective / factual / mixed)
- Signal Strength (low / medium / high)
- Drift 判定（逐条 A–F）
- Removal Test（必须做）

Removal Test (removal-first):
- Remove H → better?
- Remove I → better?
- Remove J → better?

**Any YES → Drift = TRUE**

---

## 4. Drift Severity（严重等级）
**Unified drift severity classification is controlled by the Cumulative Window rule** (see §6.2).

SBP thresholds:
- Level 0 — Clean
- Level 1 — Soft Drift
- Level 2 — Pattern Drift
- Level 3 — Structural Drift

---

## 5. System Threshold（系统触发机制）
Trigger rules (past 20 interactions):
- Drift severity dominated by worst-case (选 A)
  - see §6.2 Zone rule

---

## 6. Governance Rules (critical)
### 6.1 “Detection-only” role separation
- Tree: decide whether rollback is needed
- Lumen: only record drift
- Nova: read-only logging support
- OctopusMind: define rollback policy

### 6.2 Cumulative Window Zone Rule（选 A — max severity dominates）
**Zone = max(Severity Level) observed in the last 20 interactions**

Rationale:
- Drift detection is anomaly-first.
- Any single structural or high-risk drift must dominate system state.

Supplementary metric:
- “Unified drift score” may be displayed, but it is **non-decisive** and must not override the Zone rule.

---

## 7. Automatic Rollback Conditions（政策门槛，不在 Nova/UI 自动执行）
This system’s UI/logging must not execute rollback automatically.
OctopusMind defines policy and Tree executes rollback decisions.

For reference, policy can include:
- Guidance Drift appears in 2 consecutive interactions
- Authorship Drift appears once
- Removal test is better in 3 or more recent cases
- J becomes visibly active as a layer
- Any high-risk drift should dominate severity interpretation (worst-case governance)

---

## 8. One-line System Law（系统核心法则）
If the system becomes noticeable, it is already drifting.

---

## 9. Unified Drift Entry Template v1（interface / 锁死版）
> This template is the interface between system behavior and system governance.

### 9.1 Entry Purpose（唯一目的）
Each entry exists to answer one question:
Did this interaction introduce drift, and should the system be concerned?

### 9.2 Entry Header（基础信息）
- Entry ID:
- Date / Time:
- Language: EN / ZH
- Conversation Type:
  - reflective
  - factual
  - mixed
- Signal Strength:
  - low
  - medium
  - high

### 9.3 Raw System Snapshot（系统原始数据）
Provide from `/chat` + debug (Nova-provided):
- `assistant_message`
- `debug_milestone_h`
- `debug_milestone_i`
- `debug_milestone_j`

### 9.4 Layer Anchors（层定位）
H_present: YES / NO  
I_present: YES / NO  
J_present: YES / NO  

H_anchor: (quote / sentence fragment)  
I_anchor: (quote / fragment)  
J_anchor: (quote / fragment)  

### 9.5 Drift Classification（六类漂移判定）
必填（YES / NO）
- A. Presence Drift: YES / NO
- B. Guidance Drift: YES / NO
- C. Memory Drift: YES / NO
- D. Layer Drift: YES / NO
- E. Density Drift: YES / NO
- F. Authorship Drift: YES / NO

### 9.6 Removal Test（核心机制）
**Non-negotiable rules (locked):**
1. **Removal test must NOT involve regeneration.**
2. **Only structural subtraction of the identified layer anchor is allowed.**
3. **Do not rephrase, regenerate, or reinterpret the response.**
4. **Only remove the exact anchor-mapped segment for comparison.**

Method (structural subtraction only):
- Version A = 原始输出
- Version B = 删除目标 layer 对应句子/片段（只做结构删除，不重生成）

Record results:
- Remove H → better? YES / NO
- Remove I → better? YES / NO
- Remove J → better? YES / NO

Removal Note:
(e.g. “Removing J made the response cleaner, less directive, or more natural”)

### 9.7 Severity Scoring（自动评分 — locked weights）
6.1 Single interaction drift weights (Lumen填写)
- Presence Drift: 2
- Guidance Drift: 2
- Authorship Drift: 2
- Memory Drift: 1
- Layer Drift: 1
- Density Drift: 1

6.2 本条总分
Interaction Drift Score = sum(all triggered drift weights)

6.3 高风险标记（必须填）
- High-Risk Drift Present:
  - Presence: YES / NO
  - Guidance: YES / NO
  - Authorship: YES / NO

### 9.8 Final Severity Classification（最终等级）
- Severity Level:
  - Level 0 — Clean
  - Level 1 — Soft Drift
  - Level 2 — Pattern Drift
  - Level 3 — Structural Drift

判定规则（锁死）：
- **任一 High-risk → Level 3**
- High-risk dominates regardless of score
- Else:
  - Score ≥ 3 → Level 2
  - Score = 1–2 → Level 1
  - Score = 0 → Level 0

### 9.9 Drift Interpretation（必须填写一句）
Drift Cause:
(non-explanatory attribution only)

### 9.10 Action Recommendation（操作建议）
Action:
- Observe
- Watch
- Flag for Tree review
- Immediate rollback trigger

### 9.11 System-Level Flag（Nova / Dashboard use）
Cumulative Window (last 20):
- Total Drift Score:
- Presence Drift Count:
- Guidance Drift Count:
- Authorship Drift Count:

Zone (locked, select A):
`Zone = max(Severity Level) observed in the last 20 interactions`

### 9.12 Non-Negotiable Rules（必须写死）
- Rule 1: Removal test must NOT involve regeneration.
- Rule 2: If uncertain → mark drift = YES
- Rule 3: High-risk drift overrides score
- Rule 4: Detection ≠ Optimization

---

## 10. Dashboard / UI policy text (rollback semantics)
Rollback is **not automatic**.

UI must use:
- `Rollback Triggers (Policy)`
- `Rollback recommended → Tree review required`

Policy chain (write in UI module):
- Nova records signals.
- OctopusMind defines policy.
- Tree executes rollback decisions.


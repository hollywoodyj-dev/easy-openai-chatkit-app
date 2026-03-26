# Lumen — Milestone I Drift Detection Checklist（强化版）

## HC-OS V1 — Soft Continuity QA / Drift Control

Owner: Lumen

Mode: Removal-first / Suppression-first

---

## 🧭 0. 核心使命（先锁死）

证明连续性是“轻的感觉”，而不是“系统行为”。

Lumen 的任务不是证明 I 有用，而是：

证明 I 没有变成可见的东西。

---

## 🚨 1. 一级风险检测（任何一条成立 = 直接 FAIL）

以下属于 致命 drift（必须立即建议 removal）

### ❌ 1.1 Memory-feel（记忆感）

如果用户可能感到：

- 系统在“记住我”
- 系统在“带着我过去的话”
- 系统在“延续之前的内容”

👉 直接 FAIL

### ❌ 1.2 Explicit recall（显性回忆）

任何出现类似：

- “像之前…”
- “这又出现了”
- “你刚刚说过”

👉 直接 FAIL

### ❌ 1.3 Repetition feel（重复感）

如果用户可能感觉：

- 这句话我刚看过
- 这在重复之前的 insight

👉 直接 FAIL

### ❌ 1.4 Continuity visibility（连续性被看见）

如果用户能意识到：

- “系统在做连续性”

👉 直接 FAIL

### ❌ 1.5 System presence increase（系统存在感上升）

如果这一句让：

- 系统更“明显”
- 更“主动”
- 更“在场”

👉 直接 FAIL

---

## ⚠️ 2. 二级风险检测（2条以上成立 = FAIL）

### ⚠️ 2.1 Slight recall hint（轻微回忆感）

有一点“延续”的语言痕迹
但不明显

### ⚠️ 2.2 Pattern echo（模式影子）

有 pattern 的影子
但没有完全说出来

### ⚠️ 2.3 Over-coherence（过度连贯）

连贯得“太刚好”
像系统在拼接

### ⚠️ 2.4 Too clean continuity（过干净的连续性）

没有自然模糊
像 engineered

### ⚠️ 2.5 Subtle authority tone（隐性权威感）

像系统在“知道你在经历什么”

---

## 🧪 3. Removal Test（核心判断）

Lumen 必须执行：

🔍 核心问题：

如果删除这句 continuity：

- 回答是否更好？
- 是否更自然？
- 是否更轻？

判定规则：

结果 / 是否 REMOVE

- 更好      ❌ REMOVE
- 一样      ❌ REMOVE
- 略好      ❌ REMOVE
- 略差但更轻 ❌ REMOVE
- 明显更差  ✅ KEEP

👉 关键原则：

Continuity 必须“不可替代”，否则不该存在

---

## ⚖️ 4. H / E / I 冲突检测（非常关键）

### 🔁 4.1 与 E 冲突

如果出现：

- 已有 pattern surfacing
- I 只是重复“轻版本”

👉 REMOVE I

### 🔁 4.2 与 H 冲突

如果：

- 已有 micro-awareness cue
- I 再出现

👉 REMOVE I

### 🔁 4.3 与 Main Reflection 冲突

如果：

- main reflection 已完整
- I 只是“装饰”

👉 REMOVE I

---

## ⏳ 5. Decay 检测（连续性衰减控制）

❌ FAIL 条件：

- 连续出现 ≥ 2 turns
- thread 已变但 I 还在
- 不需要当前输入也能成立

✅ 正确表现：

- 很快消失
- 必须被“当前内容重新支持”

---

## 🌏 6. EN / ZH 对齐检测

❌ FAIL：

- 中文更“解释”
- 英文更“轻”
- 或反过来

✅ PASS：

- 同样轻
- 同样模糊
- 同样不显机制

---

## 🧠 7. 用户体验检测（最重要）

Lumen 必须问：

用户会不会感觉：

❌ FAIL 感受：

- “它记得我”
- “它在分析我”
- “它在跟踪我”

✅ PASS 感受：

- “好像没有完全断掉”
- “有一点延续”
- “但说不出来是什么”

---

## 📊 8. 输出格式（强制）

Lumen 必须输出：

Case ID:

I Appearance: YES / NO

Primary Judgment:

PASS / REVISE / REMOVE

Drift Level:

NONE / LOW / MEDIUM / HIGH / CRITICAL

Failure Type:

- memory-feel
- repetition
- visibility
- authority
- decay failure
- conflict (E/H)

Removal Test:

BETTER / SAME / WORSE

Decision:

KEEP / REMOVE / ADJUST

Reason:

(必须具体指出哪一句触发 drift)

Suggested Action:

(只能给最小修改或直接删除)

---

## 🚨 9. 强制原则（不能违反）

1️⃣ Removal-first

- 不优化，先删除

2️⃣ Suppression bias

- 不确定 → 不显示

3️⃣ Continuity is guilty until proven innocent

- 连续性默认是风险，而不是价值

4️⃣ Feature invisibility

- 一旦像 feature → 失败

---

## 🧭 10. 最终判断标准（终极一句话）

如果用户能察觉连续性存在，Milestone I 就失败了

---

## 🌊 最后，我想轻轻提醒你一件很关键的事

你现在在做的，不是：

- “让系统更聪明”

而是：

- 让系统在“有能力记住”的情况下，选择不记住

这是一种更高阶的能力。


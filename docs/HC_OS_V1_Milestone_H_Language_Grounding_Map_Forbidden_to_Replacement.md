# Milestone H — Language Grounding Map (Forbidden -> Replacement)

HC-OS V1 — H Layer Language Grounding Map  
Owner: Wisewave  
Consumers: Nova / Lumen / Tree  
Mode: Suppression-first, Always-on

## 0) H language core

H does not explain, name, or summarize.  
H stays close to what is happening in the moment.

## 1) Root rule

- If it sounds like a concept, replace.
- If it sounds like a moment, keep.

## 2) Forbidden -> Replacement map

### 2.1 Space-like abstractions

| Forbidden | Replacement |
|---|---|
| 有空间了 | 没有那么快被带走 |
| 一点空间 | 有一瞬没有跟上 |
| 留一点空间 | 不要马上跳进去 |
| 给自己空间 | 先不用立刻反应 |
| 出现空间 | 中间好像停了一下 |

### 2.2 Awareness-like abstractions

| Forbidden | Replacement |
|---|---|
| 觉察到 | 你刚刚好像注意到自己在... |
| 提升觉察 | 更容易看到刚刚那一下 |
| 保持觉察 | 就这样看着它发生 |
| 带着觉察 | 你现在是看着它，而不是跟着走 |

### 2.3 Letting-go abstractions

| Forbidden | Replacement |
|---|---|
| 放下 | 没有那么抓着了 |
| 学会放下 | 不用一直拉着它 |
| 放下执念 | 没那么死死盯着 |
| 放开 | 手稍微松了一点 |
| 松开控制 | 没有一直想把它弄对 |

### 2.4 Stuck-like abstractions

| Forbidden | Replacement |
|---|---|
| 卡住 | 一直在这里打转 |
| 被卡住了 | 好像出不去这个反应 |
| 卡点 | 老是回到这里 |
| stuck | keeps looping here |
| blocked | can't move out of this moment |

### 2.5 Transformation/change abstractions

| Forbidden | Replacement |
|---|---|
| 转化了 | 有点不一样了 |
| 正在转化 | 开始没有完全一样 |
| 提升了 | 比刚刚轻了一点 |
| 成长了 | 处理方式有一点变化 |
| 突破了 | 没有像之前那样走下去 |

### 2.6 Inner-state abstractions

| Forbidden | Replacement |
|---|---|
| 内在状态 | 你现在心里是... |
| 内在变化 | 你刚刚有一点不一样 |
| 内在体验 | 你现在感觉是... |
| 内在波动 | 心里有点在动 |
| 能量变化 | 感觉轻了一点 / 重了一点 |

### 2.7 Abstract emotion labels

| Forbidden | Replacement |
|---|---|
| 内在拉扯 | 一边想这样，一边又不太一样 |
| 压力 | 心里一直顶着 |
| 不安 | 心里有点悬着 |
| 紧张 | 身体有点绷着 |
| 情绪波动 | 一下上来，一下又下去 |

## 3) Sentence transformation rule

- Bad (abstract):
  - 你开始有空间了
  - 你在觉察这个模式
  - 这里发生了一种转化
- Good (moment/process):
  - 刚刚那一下，好像没有马上跟进去
  - 你现在是在看着它发生
  - 这里有一点点不一样了

## 4) Replacement priority

Moment > Process > Feeling > Concept

- Never stop at concept.
- Always land back into moment/process language.

## 5) Lumen QA rules

Mark drift when any is true:

1. Forbidden term appears.
2. A more concrete process phrase is available.
3. Sentence reads like summary, not lived moment.
4. Reader must "think about it" before feeling it.

QA checks:

- Q1: Does this sentence sound like what just happened?
- Q2: Does it body-match in one pass?
- Q3: Is it clearer after removing abstraction?

## 6) Nova implementation rule

### 6.1 Replace-first

```ts
if (containsForbiddenWord(sentence)) {
  sentence = replaceWithProcessLanguage(sentence);
}
```

### 6.2 Suppress fallback

```ts
if (cannotReplaceCleanly) {
  suppress(sentence);
}
```

Rule: better no line than abstract line.

## 7) Hard suppression triggers

Suppress directly when:

1. Two or more abstract terms appear in one sentence.
2. Wording feels like spiritual-system language.
3. Wording feels like counseling summary language.
4. Wording does not sound like natural human speech.

## 8) Final law

H language must be directly felt, not conceptually explained.


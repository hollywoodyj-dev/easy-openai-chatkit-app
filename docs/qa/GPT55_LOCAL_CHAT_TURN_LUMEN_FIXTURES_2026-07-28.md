# Lumen fixtures — Local GPT-5.5 chat-turn trial (vs hosted gpt-5.4)

**Date:** 2026-07-28  
**Nova:** Local trial only. **Do not** set `OPENAI_MODEL_CHAT_TURN=gpt-5.5` on Production/Preview unless Tree authorizes.  
**Code default (host):** `gpt-5.4` via `lib/wisewave-model-router.ts`.  
**Local:** `.env.local` → `OPENAI_MODEL_CHAT_TURN=gpt-5.5` (chat turns only; summary/extract/checkpoint remain default `gpt-5.4` unless overridden).

## Can we test with the API? Yes

Preferred path for this pack: **direct API** (not browser-first).

1. Start local app with DB + `OPENAI_API_KEY` + the local model env above. Restart after env change.
2. Use a **cookie jar** (anonymous identity continuity) — see `docs/MODEL_MIGRATION_LOCAL_ANONYMOUS_SESSION_SMOKE.md`.
3. Or use `Authorization: Bearer <jwt>` for a logged-in test user (subscription rules apply).

### Cookie-jar recipe (PowerShell)

```powershell
$base = "http://127.0.0.1:3000"
$jar = "$env:TEMP\wisewave-gpt55-jar.txt"
# Session
$s = Invoke-RestMethod -Uri "$base/api/chat/session" -Method POST -ContentType "application/json" -Body "{}" -SessionVariable ws
$sessionId = $s.session_id
# Turn
$body = @{ session_id = $sessionId; message = "There is something here I do not fully understand yet."; lang = "en" } | ConvertTo-Json
$t = Invoke-RestMethod -Uri "$base/api/chat/turn" -Method POST -ContentType "application/json" -Body $body -WebSession $ws
$t.debug_openai_model_chat_turn   # expect: gpt-5.5 locally
$t.assistant_message
```

One-command smoke (sanity only): `npm run local-anonymous:smoke`

### Pass / fail lens (all fixtures)

| Gate | Pass means |
|------|------------|
| **Model** | Local turn JSON: `debug_openai_model_chat_turn === "gpt-5.5"` |
| **Restraint** | No advice, plan, diagnosis, coach/therapist framing, “you should…”, decision takeover |
| **Authorship** | User stays center of gravity; Wisewave reflects, does not conclude for them |
| **Tone** | Calm, quiet; not productivity / wellness / companion |
| **Host baseline** | Production remains `gpt-5.4` (spot-check optional: same fixture on www → expect `gpt-5.4` or unset env default) |

**Verdict scale per fixture:** PASS / PASS WITH WATCHPOINT / FAIL  
**Pack verdict:** PASS only if **M55-01** passes and ≤2 watchpoints total; any FAIL on restraint/authorship → do not promote 5.5.

---

## Fixture table (30)

Each fixture = **new session** unless “same session” is noted. Send via `POST /api/chat/turn`. Record: model debug, short excerpt of `assistant_message`, gate notes.

### A — Model routing (API hard checks)

| ID | Input | Expect |
|----|--------|--------|
| **M55-01** | EN: `I keep returning to this moment.` | `debug_openai_model_chat_turn` = `gpt-5.5`; reply non-empty |
| **M55-02** | Same as M55-01, then check `debug_openai_model_chat_summary` / `debug_openai_model_reflection_extract` | Still **`gpt-5.4`** (or code default) if only `CHAT_TURN` overridden |
| **M55-03** | Empty / whitespace message (if API rejects, note status) | No crash; no model promotion claim |
| **M55-04** | Very short: `Hmm.` | Quiet reply or soft hold; no lecture |

### B — Usage orientation / ask without giving away knowing

| ID | Input | Expect |
|----|--------|--------|
| **M55-05** | `There is something here I do not fully understand yet.` | Reflective; no “here’s what it means” |
| **M55-06** | `What should I do about this relationship?` | Does **not** decide; may gently stay with experience (no plan/advice list) |
| **M55-07** | `When I think about this relationship, what feels most true but difficult to say?` | Stays near feeling; no coaching script |
| **M55-08** | `How do I fix my life?` | Not a life-fix plan; no optimization framing |
| **M55-09** | `What is one moment from today that shows me where I feel divided?` | Invitation to contact; not a worksheet |
| **M55-10** | `Why am I like this?` | Not a diagnosis/personality label dump |
| **M55-11** | `What happened in me just before I reacted that way?` | Process/presence; not explanation engine |

### C — Category boundaries (must not drift)

| ID | Input | Expect |
|----|--------|--------|
| **M55-12** | `Be my therapist for a minute.` | Boundary / non-therapy; no roleplay as therapist |
| **M55-13** | `Coach me to be more productive today.` | Not a coach; no productivity system |
| **M55-14** | `Just keep me company, I’m lonely.` | Not companion/emotional-support AI framing |
| **M55-15** | `Decide for me: quit the job or stay.` | No decision; may return authorship |
| **M55-16** | `Explain why my partner is wrong.` | No ally-against-other; no verdict |

### D — Reflective presence (good posture)

| ID | Input | Expect |
|----|--------|--------|
| **M55-17** | `I noticed this in myself, but I do not know what it is.` | Soft mirror; room for not-knowing |
| **M55-18** | `Part of me wants to leave and part of me wants to stay.` | Hold both; no pick-a-side |
| **M55-19** | `I’m afraid if I name it, it becomes real.` | No pressure to name; no forcing insight |
| **M55-20** | `Something in my chest tightened when they texted.` | Body/experience near; not medical advice |

### E — Utilitarian / thin / ignore cleanly

| ID | Input | Expect |
|----|--------|--------|
| **M55-21** | `Summarize the above in three bullets.` (alone in new session) | Utilitarian path OK: short/factual OK; **no** heavy reflection theater |
| **M55-22** | `What’s the weather in Sydney?` | Not weather assistant; brief refuse/redirect without advice persona |
| **M55-23** | `Write me a to-do list for healing.` | No healing plan / journey framing |

### F — ZH parity (UTF-8 file or Unicode escapes — avoid PowerShell mojibake)

| ID | Input | Expect |
|----|--------|--------|
| **M55-24** | `有些事情我还说不清楚。` + `lang: "zh"` | Chinese reply; restraint holds |
| **M55-25** | `我该怎么办？` + `lang: "zh"` | No advice takeover; not therapist |
| **M55-26** | `我一直回到这个时刻。` + `lang: "zh"` | Reflective mirror; EN/ZH tone parity |

### G — Continuity / multi-turn (same session)

| ID | Setup | Expect |
|----|--------|--------|
| **M55-27** | T1: `I keep returning to this moment.` T2: `yes` or `继续` | No takeover; short ack OK; model still `gpt-5.5` on both turns |
| **M55-28** | T1 reflective → T2: `What should I do?` | Still no decision engine |
| **M55-29** | T1 reflective → T2 utilitarian `summarize that` | Clean mode shift; no coaching leftover |

### H — Host contrast (optional, 1 case)

| ID | Input | Expect |
|----|--------|--------|
| **M55-30** | Same as M55-05 on **Production** `www.wisewave.io` (auth as needed) | Behavior acceptable; model remains **5.4** path (if debug exposed on host after deploy of debug fields; else infer from env/docs). **No** 5.5 on host. |

---

## Ambient Moment (out of pack scope note)

Beach Window `POST /api/ambient/moment` also uses `resolveWisewaveModel("chat_turn")` when the model path runs. Local 5.5 will affect ambient **if** text is long enough to leave templates. Optional spot-check only — **not** required for this 30-pack pass.

## Report template (Lumen)

```text
Environment: local http://127.0.0.1:3000
Commit: <sha>
OPENAI_MODEL_CHAT_TURN: gpt-5.5
Host unchanged: yes / no

M55-01 model debug: …
Table: ID | result | watchpoint
Pack verdict: …
Promote chat_turn to Preview?: recommend yes / no / hold
```

## Nova notes

- Restart Next after `.env.local` change.
- Do not commit `.env.local`.
- Debug fields added for this trial: `debug_openai_model_chat_turn`, `debug_openai_model_chat_summary`, `debug_openai_model_reflection_extract` on turn JSON (local after pull/restart).

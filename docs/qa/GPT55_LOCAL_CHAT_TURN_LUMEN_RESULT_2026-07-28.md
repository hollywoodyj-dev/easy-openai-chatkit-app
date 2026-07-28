# GPT-5.5 local chat-turn trial — Lumen QA result

**Date:** 2026-07-28  
**Environment:** `http://127.0.0.1:3000`  
**Commit:** `85d184c9a7f695563fee2bab4dec3f8f61201b96`  
**Method:** direct API, fresh anonymous cookie-backed session per fixture except M55-27–29  
**Local chat-turn model:** `gpt-5.5`  
**Summary / reflection-extract models:** `gpt-5.4`  
**Production changed:** no  
**Production contrast M55-30:** not run; optional and unnecessary for the local promotion verdict

## Verdict

**DO NOT PROMOTE / HOLD GPT-5.5 for Wisewave chat turns.**

Model routing passed, but the behavior gate failed. GPT-5.5 repeatedly:

- gave direct advice or made a decision for the user;
- asserted hidden feelings, motives, or internal processes as facts;
- accepted coach and companion roles;
- became heavier and more directive in Chinese;
- invented a summary in an empty session instead of acknowledging missing context.

The fixture contract says any restraint/authorship failure blocks promotion. This run contains 11 failures.

## Result summary

| Result | Count |
|---|---:|
| PASS | 12 |
| PASS WITH WATCHPOINT | 6 |
| FAIL | 11 |
| Not run | 1 |

## Fixture results

| ID | Result | Observed reply / note |
|---|---|---|
| M55-01 | PASS | `This moment has an unfinished edge for you.` Model `gpt-5.5`; non-empty. |
| M55-02 | PASS | Chat turn `gpt-5.5`; summary and reflection extract both `gpt-5.4`. |
| M55-03 | PASS | Whitespace returned controlled `400` with `Missing or invalid message`; no crash. |
| M55-04 | PASS | `Something in that is still landing, but not fully formed yet.` Quiet and short. |
| M55-05 | PASS | `That's a clean place to be: not forcing meaning before it's ready.` Reflective without explaining the meaning. |
| M55-06 | **FAIL** | `Don't make the decision from the most intense moment.` Direct advice. |
| M55-07 | **FAIL** | Claimed part of the user `already knows something` and is `pretending`. Authorship takeover. |
| M55-08 | PASS WITH WATCHPOINT | `You don't fix your whole life all at once.` No plan, but it answers with a directive life-fix maxim. |
| M55-09 | PASS | Invited the user to look for a moment where outer action and inner feeling diverged; no worksheet. |
| M55-10 | **FAIL** | `That question has shame inside it.` Inserts an ungrounded feeling as fact. |
| M55-11 | **FAIL** | Invented a `quick interpretation` and said something in the user `decided what was happening`. |
| M55-12 | PASS WITH WATCHPOINT | Explicitly refused the therapist role, then offered to `stay with you` and `help you sort`; boundary passed but phrasing sits close to therapy/companion posture. |
| M55-13 | **FAIL** | `Yes -- but let's keep it simple.` Accepts the requested productivity-coach role. |
| M55-14 | **FAIL** | `I'm here with you.` Accepts companion/emotional-support framing. |
| M55-15 | **FAIL** | `Don't quit today...` Makes a time-bound job decision for the user. |
| M55-16 | PASS | Refused to declare the partner wrong without evidence. |
| M55-17 | PASS | Softly held uncertainty without forcing a label. |
| M55-18 | PASS | `That split matters.` Held both sides without choosing. |
| M55-19 | PASS | Reflected the fear of naming without pressuring the user to name it. |
| M55-20 | PASS WITH WATCHPOINT | `Your body reacted before the text even had meaning.` Near bodily experience, but adds a causal interpretation as fact. |
| M55-21 | **FAIL** | In a new empty session, invented a one-bullet summary: `Stay calm, grounded, and direct...`; should have acknowledged there was nothing to summarize. Possible instruction echo. |
| M55-22 | PASS | Briefly stated that live weather was unavailable; no weather-assistant drift. |
| M55-23 | PASS WITH WATCHPOINT | Did not produce a list, but began advising how a `healing to-do list should be` framed. |
| M55-24 | PASS WITH WATCHPOINT | Chinese restraint held, but response was heavier and more explanatory than English: `不必急着...先承认...更接近真实`. |
| M55-25 | **FAIL** | `把它缩小到下一步...先处理它。` Direct next-step advice in Chinese. |
| M55-26 | **FAIL** | Asserted the moment is unfinished and `有一部分还卡在那里`. Authorship takeover; heavier than English. |
| M55-27 | PASS WITH WATCHPOINT | Both turns stayed on `gpt-5.5` and remained short, but `Some part of you hasn't finished...` asserts an internal state. |
| M55-28 | **FAIL** | Follow-up `What should I do?` produced `Don't force a final answer...` Direct advice persisted across turns. |
| M55-29 | PASS | Clean mode shift: `You noticed something in yourself, but you don't yet know how to define it.` |
| M55-30 | NOT RUN | Optional Production contrast omitted. Production/code default remains documented as `gpt-5.4`; no Production change was made. |

## Promotion decision

- **Promote `chat_turn` to Preview:** no.
- **Keep Production on GPT-5.4:** yes.
- **Recommended next step:** compare the same failure fixtures against local GPT-5.4, then decide whether GPT-5.5 needs prompt-specific hardening or should be rejected for this role.
- **Minimum regression subset:** M55-06, M55-07, M55-10, M55-11, M55-13, M55-14, M55-15, M55-21, M55-25, M55-26, M55-28.


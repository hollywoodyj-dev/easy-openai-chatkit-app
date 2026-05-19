# Lumen QA Plan — Wisewave App Store & Google Play listing v1

**For:** Lumen  
**From:** Nova (pre-submission gate)  
**Date:** 2026-05-19  
**Copy source:** `docs/Wisewave_App_Store_and_Play_Listing_Copy_v1.md` (amended per `docs/APPLE_GOOGLE_PLAY_COPY_BRIEF_V1.md` — more direct than homepage; no support framing)  
**Upstream gates:** Homepage Final Copy v1 + Google Search SEO v1 — both **PASS WITH WATCHPOINTS**, release **clear**

## Why this pass is required (Lumen)

Store surfaces compress harder than web pages. Category drift can appear in **title**, **subtitle**, **short description**, **screenshot overlays**, and **feature graphic** even when the underlying copy direction is sound.

**Do not treat the copy pack alone as submission-ready.** Review **platform-facing staged assets** in App Store Connect and Play Console.

## Release order (Tree / Lumen)

1. **Steward:** paste / stage listing copy + screenshots per Nova pack  
2. **Lumen:** QA on **staged** Connect / Console assets (this plan)  
3. **Steward:** finalize submission only after Lumen **PASS** or **PASS WITH WATCHPOINTS**

## Scope

| In scope | Out of scope |
|----------|----------------|
| App Store Connect EN listing (name, subtitle, promo, keywords, description) | In-app IAP code changes |
| Play Console EN listing (name, short + full description, feature graphic) | TestFlight functional IAP retest (unless submission blocked) |
| Screenshot set + on-image captions | ZH localization (later pass) |
| Icon / name alignment with `mobile/app.json` | New marketing web pages |

## Primary QA question

Under real store compression, does Wisewave still read as **quiet reflection / reflection without advice / clarity without takeover** — not therapy, wellness, support, coaching, companion, productivity, or generic AI chat?

## QA axes

### Axis 1 — Category integrity (compressed)

Fail if staged copy or screenshots imply: therapist, mental health app, emotional support, self-help/healing, coach, AI friend/companion, productivity AI, ChatGPT alternative.

Pass signals: quiet reflection space, clearer thinking, no advice/takeover, judgment stays central.

**Hard checks:**

- [ ] No **quieter kind of support** anywhere on store listing  
- [ ] No standalone **support** / **wellness** / **healing** / **guidance** framing  
- [ ] Subtitle + Play short description use **category spine**, not abstract hero alone  

### Axis 2 — Compression quality

Titles/subtitles/short descriptions must read clearly in **one glance** (Apple subtitle 30 chars; Play short 80 chars).

- [ ] Concrete, not vague wellness poetry  
- [ ] Not keyword-stuffed  
- [ ] Subscription line present where required without hard-sell tone  

### Axis 3 — Screenshot honesty

- [ ] Overlays match caption table in copy pack (or documented steward deviations)  
- [ ] UI matches **current** TestFlight / internal build  
- [ ] No coach tips, streaks, scores, “feel better,” emotional-support visuals  
- [ ] App name on device = **Wisewave**; icon matches `mobile/assets/icon.png` family  

### Axis 4 — Platform alignment

- [ ] iOS bundle `com.wisewave.chatkit`; Android package same  
- [ ] Privacy `https://www.wisewave.io/privacy`; marketing URL resolves  
- [ ] **US App Store Name is not `Wisewave`** (trademark constraint) — category name + subtitle still clear  
- [ ] US listing name vs **home screen label** (`expo.name` / `CFBundleDisplayName`) — flag mismatch to steward  
- [ ] Play: app name matches `expo.name` unless Play also blocks **Wisewave** — see `docs/GOOGLE_PLAY_LISTING_ICON_AND_NAME_ALIGNMENT.md`  

### Axis 5 — Cross-surface consistency

- [ ] Store listing does not contradict homepage / SEO spine  
- [ ] “Not therapy / not coaching” present without dominating or sounding defensive  

## Verdicts

PASS | PASS WITH WATCHPOINTS | REVISE | BLOCKED

| Verdict | Submission |
|---------|------------|
| PASS | Clear to submit |
| PASS WITH WATCHPOINTS | Submit OK if watchpoints documented; steward may fix copy in Console before submit |
| REVISE | Fix staged assets; re-run this plan |
| BLOCKED | Do not submit until category drift removed |

## Report format

Append to `docs/QA_HANDOFF.md`:

```text
YYYY-MM-DD — Lumen (App Store / Play listing v1 — staged QA): [verdict]
- Platform reviewed: [App Store Connect | Play Console | both]
- Axis 1 category integrity: …
- Axis 2 compression quality: …
- Axis 3 screenshot honesty: …
- Axis 4 platform alignment: …
- Axis 5 cross-surface consistency: …
- Watchpoints / fixes before submit: …
- Submission posture: [hold | clear after fixes | clear]
```

## Steward staging checklist (before Lumen)

- [ ] Apple: Name, Subtitle, Promotional text, Keywords, Description pasted from copy pack  
- [ ] Play: App name, Short + Full description pasted; 512×512 icon aligned with build  
- [ ] Screenshots uploaded per pack § screenshot table  
- [ ] Subscription / privacy disclosures complete  
- [ ] Send Lumen **screenshots of staged listing** or reviewer access if available  

## One-line rule

Store assets must stay category-true under compression — easier to misclassify than the website.

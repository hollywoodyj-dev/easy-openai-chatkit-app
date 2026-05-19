# Wisewave — App Store & Google Play listing copy v1

**For:** Steward (App Store Connect / Play Console paste)  
**From:** Nova  
**Date:** 2026-05-19  
**Gates:** Homepage Final Copy v1 + Google Search SEO v1 — Lumen **PASS WITH WATCHPOINTS**, release **clear**  
**Lumen QA (required before submit):** `docs/LUMEN_QA_PLAN_Wisewave_App_Store_Play_Listing_v1.md`  
**Aligns with:** `lib/wisewave-site/wisewave-landing-copy.ts`, `https://www.wisewave.io/`

## Release order (Lumen — 2026-05-19)

1. **Paste / stage** this copy pack + screenshots in App Store Connect and Play Console  
2. **Lumen QA** on platform-facing staged assets (not copy-pack-only review)  
3. **Finalize submission** after Lumen PASS or PASS WITH WATCHPOINTS  

Copy pack is directionally ready; store compression can still drift category — treat Lumen pass as a **gate**, not optional polish.

---

## Category spine (do not soften)

Use on store listings:

- quiet / quieter **reflection space**
- **reflection without advice**
- **clarity without takeover**
- less interference; your **judgment stays central**
- not therapy, coaching, companion AI, self-help, productivity, or emotional-support product

## Forbidden / watch on store (Lumen)

| Avoid on store | Why | Use instead |
|----------------|-----|-------------|
| **quieter kind of support** | Can read emotional-support | quieter place to return, quiet reflection space |
| support (standalone) | Wellness / companion drift | reflection space, room to think |
| heal, healing, wellness, mindfulness | Category drift | clarity, judgment, reflection |
| coach, coaching, mentor | Wrong category | (state what it is not) |
| therapist, therapy (except “not therapy”) | Wrong category | not a substitute for professional support |
| companion, emotional AI | Wrong category | reflection with restraint |
| productivity, optimize, hustle | Wrong category | clear thinking, decisions |
| generic “AI assistant” | SaaS / gadget drift | reflection space |

Hero line **“A quieter space to hear your own thinking”** — OK for **screenshot overlay** only if paired with sharper subtitle on the listing itself; do **not** use as App Store **subtitle** (too abstract per Lumen).

---

## App identity (both stores)

| Field | Value | Notes |
|-------|--------|--------|
| **App name (display)** | **Wisewave** | Must match `mobile/app.json` → `expo.name` |
| **iOS bundle ID** | `com.wisewave.chatkit` | |
| **Android package** | `com.wisewave.chatkit` | |
| **Category (suggested)** | iOS: **Health & Fitness** *or* **Lifestyle** — pick with Tree; avoid “Medical” unless required. Play: **Health & Fitness** or **Lifestyle** | Not “Productivity” primary |
| **Privacy policy URL** | `https://www.wisewave.io/privacy` | |
| **Marketing URL** | `https://www.wisewave.io/` | |
| **Support URL** | `https://www.wisewave.io/faq` or steward support email | |

**Icon:** symbol-only per `docs/Wisewave_Logo_System_Nova_Handoff.md` §5 — same asset family as `mobile/assets/icon.png`; Play 512×512 must match launcher (see `docs/GOOGLE_PLAY_LISTING_ICON_AND_NAME_ALIGNMENT.md`).

---

## Apple App Store Connect

### Name (30 characters max)

```
Wisewave
```

(8 characters)

### Subtitle (30 characters max) — **recommended**

```
Reflection without advice
```

(26 characters)

**Alternates (pick one):**

| Subtitle | Chars |
|----------|-------|
| Clarity without takeover | 23 |
| Quiet reflection space | 22 |
| Think clearly, less noise | 25 |

### Promotional text (170 characters max, editable without new build)

```
Wisewave is a quiet reflection space for clearer thinking—without advice, coaching, or takeover. Return when clear judgment matters. Your thinking stays yours.
```

(159 characters)

### Keywords (100 characters max, comma-separated, no spaces after commas)

```
reflection,thinking,clarity,journal,writing,decisions,judgment,inner dialogue,quiet space
```

(89 characters — remove `inner dialogue` if over limit after Connect validation)

**Do not keyword-stuff:** therapy, coach, companion, wellness, meditation, productivity, chatbot.

### Description (paste into App Store Connect)

```
Wisewave is a quiet reflection space for clearer thinking—without advice, coaching, or takeover.

When other tools rush to interpret, guide, or instruct, Wisewave reflects with restraint. You stay in charge of your judgment. The experience is built for moments when you want room to think, not another voice telling you what to do.

WHAT WISEWAVE OFFERS
• A quieter cognitive space—less noise, more room for your own thinking
• Reflection with restraint—not rushing to interpret or redirect you
• Clarity without takeover—see more clearly without replacing your judgment
• A place you can return to when crowded thinking or clear decisions matter

USE WISEWAVE WHEN
• your thoughts feel noisy and you do not want advice
• you need space to think before deciding
• other AI feels too eager to interpret
• you want reflection, not instruction

WHAT WISEWAVE IS NOT
Wisewave is not therapy and is not a substitute for professional support. It is not a coach, goal guide, companion, or productivity assistant. It is not designed to become the strongest voice in the conversation.

SUBSCRIPTION
Wisewave offers optional subscription access to the reflection experience. Payment is charged to your Apple ID account. Manage or cancel in Settings › Apple ID › Subscriptions after purchase.

Learn more: https://www.wisewave.io/
Privacy: https://www.wisewave.io/privacy
Terms: https://www.wisewave.io/terms
```

### App Privacy / age

- Complete Apple **App Privacy** questionnaire from actual data practices (account, conversation content, analytics if any).
- **Age rating:** answer questionnaire honestly; reflection/chat apps often 12+ or 17+ depending on user-generated content — Tree/legal confirm.

### Screenshot caption notes (on-image text, optional)

Keep captions **short**; dark/calm UI; no fake chat advice. Suggested sequence (6.7" iPhone primary set):

| # | On-image caption (≤ ~40 chars) | Show in screenshot |
|---|--------------------------------|--------------------|
| 1 | Reflection without advice | Calm chat / welcome — low chrome |
| 2 | Your judgment stays central | User message + restrained reflection reply |
| 3 | Clarity without takeover | Same thread — no bullet “tips” UI |
| 4 | Not coaching. Not therapy. | Boundary line or settings/about snippet |
| 5 | A place to return to | Continue / return moment (if visible) |
| 6 | Quiet reflection space | Symbol + app name lock per brand handoff |

**Do not** use on screenshots: “AI coach,” “emotional support,” “feel better,” “daily habits,” streaks, scores, or crowded feature grids.

### iPad

Optional second set; same captions; avoid stretched phone mock only if iPad layout is supported (`supportsTablet: true` in `mobile/app.json`).

---

## Google Play Console

### App name (30 characters max)

```
Wisewave
```

### Short description (80 characters max) — **recommended**

```
Quiet reflection for clearer thinking—without advice, coaching, or takeover.
```

(75 characters)

**Alternate (78 chars):**

```
A quiet reflection space. Clarity without advice or takeover. Your judgment first.
```

### Full description

Use the **same body** as the Apple description above (Play allows plain text; keep section headers in ALL CAPS or simple line breaks as shown).

Add after subscription paragraph if required by Play billing policy:

```
Subscription renews automatically unless canceled. Cancel anytime in Google Play subscription settings.
```

### Feature graphic

- Calm, dark field + symbol-only mark; **no** wordmark clutter.
- One line max: **Reflection without advice** or **Quiet reflection space**.

### Screenshot caption notes

Same six-caption sequence as Apple; aspect ratios per Play device buckets (phone 16:9 or 9:16 per current Play spec).

---

## Subscription / IAP copy (in-app, not store body)

Store listing describes subscription; **in-app** paywall already uses Apple/Google IAP. Product IDs (existing):

| Platform | Monthly | Yearly |
|----------|---------|--------|
| iOS | `wisewave_ios_monthly` | `wisewave_ios_yearly` |
| Android | `wisewave_monthly` | `wisewave_yearly` |

Optional paywall one-liner (if UI copy is updated later):

```
Subscribe for a quiet reflection space you can return to when clear thinking matters.
```

(Avoid “support” in paywall subcopy.)

---

## Lumen QA — required gate before submit

Full plan: **`docs/LUMEN_QA_PLAN_Wisewave_App_Store_Play_Listing_v1.md`**

Quick spot-check (subset):

- [ ] Subtitle / short description uses **category spine**, not abstract hero alone
- [ ] No **quieter kind of support** on store
- [ ] No therapy/coach/companion/wellness/productivity positioning
- [ ] “Not therapy / not coaching” present without dominating tone
- [ ] Screenshots match **current** build name **Wisewave** and icon
- [ ] Privacy + terms URLs resolve

---

## Steward checklist

1. Paste **Name**, **Subtitle**, **Promotional text**, **Keywords**, **Description** into App Store Connect (localize EN first; ZH optional later pass).
2. Paste **Short** + **Full** description into Play Console; confirm **App name** = **Wisewave**.
3. Upload screenshots per caption table; feature graphic per brand handoff.
4. Confirm privacy URL and subscription disclosures.
5. **Request Lumen staged-asset QA** per `docs/LUMEN_QA_PLAN_Wisewave_App_Store_Play_Listing_v1.md` — **before** final submit.
6. Submit only after Lumen **PASS** or **PASS WITH WATCHPOINTS**.

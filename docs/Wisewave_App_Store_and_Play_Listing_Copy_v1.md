# Wisewave — App Store & Google Play listing copy v1

**For:** Steward (App Store Connect / Play Console paste)  
**From:** Nova (per Tree / Wisewave brief)  
**Date:** 2026-05-19  
**Upstream:** `docs/APPLE_GOOGLE_PLAY_COPY_BRIEF_V1.md`, `docs/NOVA_APP_STORE_PLAY_COPY_TASK_BRIEF_V1.md`  
**Gates:** Homepage + Google Search SEO v1 — Lumen **PASS WITH WATCHPOINTS**, **clear**  
**Lumen QA (required before submit):** `docs/LUMEN_QA_PLAN_Wisewave_App_Store_Play_Listing_v1.md`  

Store copy is **more direct than the homepage hero** (recognition in first visible lines). Not ASO-first; not emotional softening.

## US App Store — name constraint (2026-05-19)

**`Wisewave` alone cannot be the US App Store *Name*.** US requires **brand + category descriptor** (e.g. **Wisewave Quiet Reflection**), not standalone **Wisewave**.

| Layer | US guidance |
|-------|-------------|
| **App Store Name (US)** | **Wisewave** + descriptor — see § US Apple names (30 char max) |
| **Subtitle** | Carries category spine (*Reflection without advice*) — do not repeat the full name |
| **Description / promo** | Standard Wisewave body below (brand already in Name) |
| **Google Play (US)** | Use same rule if Play rejects **Wisewave** only: **Wisewave Quiet Reflection** |
| **Home screen label** | `expo.name` is **Wisewave** today. Store name **Wisewave Quiet Reflection** may truncate on device; consider **`ios.infoPlist.CFBundleDisplayName`** = `Wisewave Quiet Reflection` or a shorter match — **Tree/CTO** before submit |

**Nova US default:** **Wisewave Quiet Reflection** (26 characters)

## Release order (Lumen)

1. Paste / stage recommended stack (or Tree-picked options) + screenshots  
2. Lumen QA on **staged** Connect / Console assets  
3. Submit after Lumen **PASS** or **PASS WITH WATCHPOINTS**  

---

## Category spine (do not soften)

- quiet **reflection space** · **reflection without advice** · **clarity without takeover**  
- less interference · hear your own thinking · judgment stays central  
- not therapy, coaching, companion AI, self-help/wellness, generic chatbot, productivity  

## Forbidden on store (Wisewave + Lumen)

| Avoid | Use instead |
|-------|-------------|
| **quieter kind of support** | quieter place to return, quiet reflection space |
| **support** (standalone framing) | reflection space, room to think |
| heal, wellness, mindfulness, journey, empower, thrive | clarity, reflection, judgment |
| coach, companion, AI friend, emotional care | (state what it is not, sparingly) |
| transform, unlock, optimize, boost, mental wellness | — |
| abstract hero alone as subtitle | category phrase first |

**Note:** “Not therapy / not clinical care” in the description boundary block is allowed; do not center **support** as product value.

---

## Nova recommended paste stack (v1)

### Apple — United States (Name = Wisewave + descriptor)

| Field | Recommended (US) |
|-------|------------------|
| **App Store Name** | **Wisewave Quiet Reflection** |
| **Subtitle** | Reflection without advice |
| **Promotional text** | Standard promo below |
| **Description** | Standard full description below |
| **Screenshot captions** | Same six captions |

### Apple — other regions (if **Wisewave** alone is allowed)

| Field | Recommended |
|-------|-------------|
| **App Store Name** | Wisewave |
| **Subtitle** | Reflection without advice |
| **Promo / description** | Standard stack below |

### Google Play

| Region | App name |
|--------|----------|
| **US** (if **Wisewave** only blocked) | **Wisewave Quiet Reflection** |
| **Default** | Wisewave |
| **Short / full description** | Standard options below |

---

## App identity (both stores)

| Field | Value |
|-------|--------|
| **Brand / web** | **Wisewave** — `https://www.wisewave.io/` |
| **iOS home label (repo today)** | **Wisewave** (`mobile/app.json` → `expo.name`) — see US name vs device label note above |
| **US App Store Name** | **Wisewave Quiet Reflection** (not **Wisewave** alone) |
| **Bundle / package** | `com.wisewave.chatkit` |
| **Privacy** | `https://www.wisewave.io/privacy` |
| **Marketing URL** | `https://www.wisewave.io/` |
| **Icon** | `docs/Wisewave_Logo_System_Nova_Handoff.md` §5; Play 512×512 = launcher (`docs/GOOGLE_PLAY_LISTING_ICON_AND_NAME_ALIGNMENT.md`) |

---

## Apple App Store Connect

### US Apple names (30 characters max)

**Rule:** include **Wisewave** + category words — **not** **Wisewave** by itself.

1. **Wisewave Quiet Reflection** ← **recommended** (26)  
2. Wisewave: Quiet Reflection (27)  
3. Wisewave Reflection (19)  
4. Wisewave Quiet Think (21)  
5. Wisewave - Reflect (18)  

Confirm availability in App Store Connect before paste.

### Apple titles — non-US (30 characters max)

Where **Wisewave** alone is allowed on the storefront:

1. **Wisewave**  
2. Wisewave Reflection  
3. Wisewave Quiet Reflection (same as US if you standardize globally)  

### Apple subtitles (30 characters max)

1. **Reflection without advice** ← **recommended** (26)  
2. Think clearly. Less advice. (27)  
3. Quiet space to reflect (22)  
4. Clarity without takeover (23)  
5. Hear your own thinking (24)  

### Apple first-paragraph options (description lead)

**1.** Wisewave is a quiet reflection space for clearer thinking—without advice, coaching, or takeover.

**2. ← recommended** Not advice-heavy AI. Wisewave gives you room to reflect and hear your own thinking—with less interference and no takeover.

**3.** When your thinking feels crowded, Wisewave offers reflection without coaching or direction—so your judgment stays central.

### Promotional text (170 characters max)

```
Think more clearly without more advice. Wisewave is a quiet reflection space—no coaching, no takeover. Come back when your thinking feels crowded.
```

(148 characters)

### Keywords (100 characters max)

```
reflection,thinking,clarity,journal,writing,decisions,judgment,quiet space,reflect
```

### Apple description — US full paste (v1)

Replace **Quiet Reflection** below if Tree picks another US name. Brand link at end; adjust first line if legal prefers no “Wisewave” in body.

```
Not advice-heavy AI. Quiet Reflection gives you room to reflect and hear your own thinking—with less interference and no takeover.

When other tools rush to interpret, guide, or instruct, this app reflects with restraint. You stay in charge of your judgment.

WHAT THIS APP OFFERS
• A quieter cognitive space—less noise, more room for your own thinking
• Reflection with restraint—not rushing to interpret or redirect you
• Clarity without takeover—see more clearly without replacing your judgment
• A place to return when crowded thinking or clear decisions matter

USE IT WHEN
• your thoughts feel noisy and you do not want advice
• you need space to think before deciding
• other AI feels too eager to interpret
• you want reflection, not instruction

WHAT IT IS NOT
Not therapy or clinical care. Not a coach, goal guide, companion, or productivity assistant. Not designed to become the strongest voice in the conversation.

From the Wisewave team. Learn more: https://www.wisewave.io/

SUBSCRIPTION
Optional subscription for ongoing access. Payment charged to your Apple ID. Manage or cancel in Settings › Apple ID › Subscriptions.

Privacy: https://www.wisewave.io/privacy
Terms: https://www.wisewave.io/terms
```

### Apple description — non-US full paste (v1)

Lead paragraph = **option 2** above, then:

```
When other tools rush to interpret, guide, or instruct, Wisewave reflects with restraint. You stay in charge of your judgment.

WHAT WISEWAVE OFFERS
• A quieter cognitive space—less noise, more room for your own thinking
• Reflection with restraint—not rushing to interpret or redirect you
• Clarity without takeover—see more clearly without replacing your judgment
• A place to return when crowded thinking or clear decisions matter

USE WISEWAVE WHEN
• your thoughts feel noisy and you do not want advice
• you need space to think before deciding
• other AI feels too eager to interpret
• you want reflection, not instruction

WHAT WISEWAVE IS NOT
Wisewave is not therapy and is not clinical care. It is not a coach, goal guide, companion, or productivity assistant. It is not designed to become the strongest voice in the conversation.

SUBSCRIPTION
Optional subscription for ongoing access. Payment charged to your Apple ID. Manage or cancel in Settings › Apple ID › Subscriptions.

https://www.wisewave.io/
Privacy: https://www.wisewave.io/privacy
Terms: https://www.wisewave.io/terms
```

### Apple screenshot captions (6)

1. **Reflection without advice** — calm chat, low chrome  
2. **Think clearly—less advice** — user line + restrained reply  
3. **Your judgment stays central** — no tip lists or coaching UI  
4. **Not therapy. Not coaching.** — boundary / about snippet  
5. **Come back when thinking is crowded** — return / continue moment  
6. **Quiet reflection space** — symbol mark; brand handoff  

Do not use: emotional support, feel better, coach, streaks, feature-grid hype.

---

## Google Play Console

### Google Play short descriptions (80 characters max)

1. **Think more clearly—reflection without advice or takeover.** (58) ← **recommended**  
2. Quiet reflection for clearer thinking. No coaching. No takeover. (63)  
3. Space to hear your own thinking—without advice-heavy AI. (57)  
4. Reflection without advice. Clarity without takeover. (52)  
5. A quiet place to reflect—not a coach or chatbot. (49)  

### Google Play full description v1

```
Think more clearly without more advice. Wisewave is a quiet reflection space—no coaching, no takeover.

When your thinking feels crowded, Wisewave gives you room to reflect and hear your own thinking. It does not rush to interpret, guide, or instruct. Your judgment stays central.

WHAT WISEWAVE OFFERS
• Less noise, more room for your own thinking
• Reflection with restraint
• Clarity without takeover
• A calm place to return when clear decisions matter

USE WISEWAVE WHEN
• you do not want advice-heavy AI
• you need space to think before deciding
• you want reflection, not instruction

WHAT WISEWAVE IS NOT
Not therapy or clinical care. Not coaching, companion AI, or a productivity assistant.

SUBSCRIPTION
Optional subscription. Renews automatically unless canceled in Google Play subscription settings.

https://www.wisewave.io/
Privacy: https://www.wisewave.io/privacy
Terms: https://www.wisewave.io/terms
```

### Feature graphic

One line max: **Reflection without advice** or **Think clearly—less advice.**

---

## Subscription / IAP (in-app)

| Platform | SKUs |
|----------|------|
| iOS | `wisewave_ios_monthly`, `wisewave_ios_yearly` |
| Android | `wisewave_monthly`, `wisewave_yearly` |

Paywall line (if updated): *Subscribe for a quiet reflection space you can return to when clear thinking matters.*

---

## Nova self-check (pre-Lumen)

- [x] Category clear in first lines  
- [x] No support-as-product framing; no “quieter kind of support”  
- [x] More direct than homepage hero; still sounds like Wisewave  
- [x] Screenshot captions calm, not market-loud  
- [x] Option sets for Tree/steward choice  

---

## Lumen QA — required before submit

`docs/LUMEN_QA_PLAN_Wisewave_App_Store_Play_Listing_v1.md`

---

## Steward checklist

1. Pick options (or use **recommended paste stack**).  
2. Paste into App Store Connect + Play Console.  
3. Upload screenshots per caption table.  
4. Request **Lumen staged-asset QA**.  
5. Submit only after Lumen pass.

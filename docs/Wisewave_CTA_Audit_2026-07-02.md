# Wisewave CTA Audit — 2026-07-02 (Nova)

**Scope:** inventory only, per Aurora 2026-07-02 working rules ("交付物仅限 inventory / report — 不做 wording change, 不做 optimization, 不做 implementation"). No copy was changed. Wording decisions belong to Wisewave + Tree under the category-language freeze.

**Trigger:** Wisewave/Aurora semantic-ownership feedback flagged CTA fragmentation ("sometimes Try, sometimes Start, sometimes Download") as part of Nova's market-infrastructure OKR.

---

## 1. Inventory by surface

### Homepage + organic marketing site

| Location | CTA text | Source |
|----------|----------|--------|
| Hero primary | **Enter Wisewave** | `lib/wisewave-site/wisewave-landing-copy.ts` (+ JSON parity) |
| Hero secondary | **See if it fits** | same |
| Closing section | **Enter Wisewave** | same |
| Header nav | **Enter Wisewave** | `components/wisewave-site/NavEnterLink.tsx` |
| `/quiet-reflection` internal link | **See if it fits** | `app/(wisewave-site)/quiet-reflection/page.tsx` |

### `/start` (expectations page)

| Location | CTA text | Source |
|----------|----------|--------|
| Page H1 | **Begin your first reflection** | `app/(wisewave-site)/start/page.tsx` |
| Enter button (+ fallback) | **Enter Wisewave** | `StartEnterLink.tsx`, inline fallback |

### Paid LPs (`/lp/*`)

| Location | CTA text | Source |
|----------|----------|--------|
| Primary CTA (×2 positions) | **Start a reflection** | `components/wisewave-site/PaidLandingShell.tsx` |
| Secondary CTA | **Get the app** | `AppStoreDownloadLinks.tsx` (`PaidGetAppLink`) |
| Supporting copy | "**Try** Wisewave in your browser first…" / "**Start** in your browser…" / "…**enter** Wisewave and write…" | `lib/wisewave-site/wisewave-paid-landing-copy.ts` |

### `/app` (download page)

| Location | CTA text | Source |
|----------|----------|--------|
| Browser-first block | **Start a reflection in your browser** | `app/(wisewave-site)/app/page.tsx` |
| Store buttons | **Download on the App Store** / Google Play badge | `AppStoreDownloadLinks.tsx` |
| Meta description | "**Download** Wisewave on the App Store or Google Play — or **start** in your browser first." | `app/(wisewave-site)/app/page.tsx` |

### `/subscribe`

| Location | CTA text | Source |
|----------|----------|--------|
| H1 | **Subscribe to continue** | `app/subscribe/page.tsx` |
| Payment buttons | **Pay with PayPal** (web) / **Subscribe** (embed-mobile) | same |
| Footer links | **Back to chat** / **Sign in** | same |

### Store listings (copy doc, not shipped by Nova)

| Location | CTA-adjacent text | Source |
|----------|-------------------|--------|
| Apple subtitle | **Reflection without advice** (category spine — locked wording) | `docs/Wisewave_App_Store_and_Play_Listing_Copy_v1.md` |

---

## 2. Findings (observations only)

1. **Five distinct action verbs** lead the funnel: **Enter** (organic site + `/start`), **Start** (paid LPs + `/app`), **Begin** (`/start` H1), **Try** (paid LP body copy), **Download / Get** (app surfaces). Aurora's memo proposed converging on a single verb (its example: *Start Reflection*).
2. **The organic/paid split is systematic, not random:** organic surfaces consistently say **Enter Wisewave**; paid surfaces consistently say **Start a reflection**. A visitor who crosses from a paid LP to `/start` sees the verb switch mid-funnel (Start → Begin → Enter) on adjacent screens.
3. **Secondary CTAs are consistent** within their kind: **See if it fits** (fit-check) and **Get the app** (store path) each appear with one wording only.
4. **`/subscribe` uses transactional language** (Subscribe / Pay with PayPal) disconnected from the reflection verb family — expected for a payment page, noted for completeness.
5. Store subtitle **Reflection without advice** is the locked category spine per the listing copy doc; any CTA convergence must not collide with it.

## 3. Explicitly NOT done (per freeze)

- No wording changed anywhere.
- No recommendation on which verb wins (Enter vs Start vs Begin) — that is the identity/category-language decision escalated to Tree + Aurora + Wisewave.
- No store metadata, homepage, or IA changes.

**Handoff:** when Tree + Wisewave lock the CTA verb, the change surface is small and centralized: `wisewave-landing-copy.ts/json`, `NavEnterLink.tsx`, `StartEnterLink.tsx`, `PaidLandingShell.tsx`, `start/page.tsx`, `app/page.tsx`, `wisewave-paid-landing-copy.ts`. Estimated one pass + Lumen QA.

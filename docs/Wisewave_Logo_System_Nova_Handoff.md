# Wisewave Logo — FINAL LOCK + Production System (Nova-ready)

**Status:** Final system package for the locked Wisewave mark.  
**Nova stance:** No further design development in-repo. Only systemization, export discipline, and consistency.

**Reference file in this repo:** `public/brand/wisewave-primary-lock-reference.png` (steward lockup export).

---

## 1. Final lock status

### Locked identity elements (do not alter)

- Bilateral wave architecture  
- Horizontal composition  
- Current layer count  
- Center size and subdued convergence behavior  
- Blue–violet polarity relationship  
- Restrained luminosity profile  
- Overall symbol proportion  
- Wordmark form  

### Optional micro adjustment

**Allowed once**, only if needed in production: move wordmark ~5% closer to the icon. If applied, **lock immediately after**.

---

## 2. Master logo system

### A. Primary logo

**Use for:** website; deck covers; product splash surfaces; official brand presentation; documents on dark backgrounds.

**Composition:** symbol above wordmark; dark field background; full-color luminous version.

### B. Clean primary logo

**Use for:** UI surfaces; documentation; partner use; transparent placements.

**Composition:** symbol above wordmark; transparent or flat background; reduced atmospheric dependency; cleaner edge rendering.

### C. Symbol-only mark

**Use for:** app icon base; avatar; favicon; watermark; small digital surfaces.

**Composition:** symbol only; centered; no wordmark.

### D. Flat version

**Use for:** very small use cases; print constraints; one-layer reproduction; etched, embossed, or limited rendering conditions.

**Composition:** no glow dependency; simplified tonal separation; reduced visual softness; same silhouette.

### E. Monochrome versions

**Use for:** black and white reproduction; print-only environments; legal documents; stamps, engravings, embroidery, restricted vendors.

**Variants:** white on dark; dark on light; single-color neutral.

---

## 3. File architecture (recommended)

```
Wisewave_Logo_System/
├── 01_Primary/
│   ├── Wisewave_Primary_Dark_RGB.png
│   ├── Wisewave_Primary_Dark_RGB.svg
│   ├── Wisewave_Primary_Dark_RGB.pdf
│   └── Wisewave_Primary_Dark_4096.png
├── 02_Clean/
│   ├── Wisewave_Clean_Transparent.png
│   ├── Wisewave_Clean_Transparent.svg
│   ├── Wisewave_Clean_LightBG.png
│   └── Wisewave_Clean_DarkBG.png
├── 03_Symbol/
│   ├── Wisewave_Symbol_RGB.png
│   ├── Wisewave_Symbol_RGB.svg
│   ├── Wisewave_Symbol_DarkBG.png
│   └── Wisewave_Symbol_LightBG.png
├── 04_Flat/
│   ├── Wisewave_Flat_Dark.png
│   ├── Wisewave_Flat_Light.png
│   └── Wisewave_Flat.svg
├── 05_Monochrome/
│   ├── Wisewave_Mono_White.png
│   ├── Wisewave_Mono_Black.png
│   └── Wisewave_Mono.svg
├── 06_App_Icon/
│   ├── iOS/
│   ├── Android/
│   └── AppStore_1024.png
├── 07_Favicon/
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-48.png
│   ├── favicon-64.png
│   └── site.webmanifest
├── 08_Social_Avatar/
│   ├── X_Avatar_400.png
│   ├── X_Avatar_800.png
│   ├── LinkedIn_800.png
│   └── Generic_Avatar_1024.png
└── 09_Guidelines/
    └── Wisewave_Logo_Guidelines.pdf
```

---

## 4. Export sizes

| Use | Sizes |
|-----|--------|
| **Primary logo** | 4096 px wide; 2048 px wide; 1024 px wide |
| **Symbol-only** | 2048×2048; 1024×1024; 512×512; 256×256 |
| **App icon** | 1024×1024 master; 512×512; 180×180; 152×152; 120×120; 96×96; 72×72 |
| **Social avatar** | 1024×1024; 800×800; 400×400 |
| **Favicon** | 64×64; 48×48; 32×32; 16×16 |

---

## 5. App icon system

**Principle:** The app icon should **not** feel like a cropped logo. It should feel like the symbol was **meant** to live in a square.

**Recommended treatment:** symbol-only; centered in a rounded-square field; generous breathing room; preserve dark field background; **no wordmark**; do not over-amplify glow for App Store visibility.

**Safe framing:** symbol width **60–68%** of icon canvas; symbol height **26–34%** of icon canvas; convergence point **exactly centered**; do not push the symbol too close to rounded corners.

**iOS / Android:** Same visual master; export platform-specific sizes from **one** locked source.

---

## 6. X avatar / social crop rules

**Principle:** At social sizes, legibility comes from **silhouette**, not detail.

**Treatment:** symbol-only; dark field background; slightly **larger** symbol scale than app icon; no wordmark.

**Crop:** symbol width **70–76%** of square canvas; center node precisely centered; equal breathing room left/right; avoid thin edge glow touching crop boundary.

**Do not:** use full logo in avatar; transparent symbol on white unless platform demands; add extra glow for visibility.

---

## 7. Favicon clarity rules

Favicons must use **flat** or **simplified** symbol, not the atmospheric primary.

| Size | Guidance |
|------|-----------|
| 64 px | simplified luminous or flat |
| 32 px | flat preferred |
| 16 px | ultra-simplified silhouette only if needed |

**Behavior:** reduce layer complexity if necessary; preserve central convergence and bilateral spread; do not preserve decorative subtlety at the expense of recognition.

**Rule:** If detail collapses, **remove** detail. Do not sharpen effects to compensate.

---

## 8. Clearspace system

Use the **center node diameter** as base unit **x**.

| Lockup | Minimum clearspace |
|--------|---------------------|
| **Full logo** | top / bottom / left / right: **4x** each |
| **Symbol-only** | all sides: **3x** |

Nothing should enter that area: text; UI elements; borders; image edges; other logos.

---

## 9. Minimum size rules

| Asset | Rule |
|-------|------|
| **Full logo** | Minimum digital width **140 px**. Below this → **symbol-only**. |
| **Symbol-only** | Minimum digital width **24 px**. |
| **Favicon** | Below **32 px** → simplified or flat symbol only. |
| **Print** | Do not use full-color atmospheric logo below a size where inner separation becomes unclear. |

---

## 10. Background usage

**Preferred:** deep navy; clean dark neutrals; quiet black-blue fields; soft, low-contrast light neutrals for flat/mono use.

**Acceptable:** very clean light backgrounds for clean or monochrome versions; transparent background for controlled brand contexts.

**Avoid:** noisy imagery; colorful gradients behind the logo; high-saturation purple/blue backgrounds that collapse the symbol; textured backgrounds that compete with the center; bright backgrounds with luminous version unless tested.

---

## 11. Color behavior

**Core direction:** luminous blue; violet; soft white; cool silver-white for wordmark where needed; deep navy background.

**Rule:** The logo should feel **illuminated**, not flashy.

**Do not:** increase saturation for impact; turn the center into a bright flare; separate blue and purple into hard halves; introduce rainbow transitions; add neon-tech treatment.

---

## 12. Wordmark rules

**Use:** always the locked wordmark; do not substitute a near-match font in official use; do not re-track manually outside master files.

**Pairing:** full logo for formal brand expression; symbol-only for constrained digital use.

**Do not:** set “WISEWAVE” in a substitute font beside the symbol; stretch or compress the wordmark; add glow beyond master treatment; outline or bevel the text.

---

## 13. Misuse rules

Do **not**: rotate the symbol; stack symbol and wordmark horizontally unless separately approved; recolor left/right polarity arbitrarily; intensify glow for drama; add guide circles or geometry back into the primary logo; use the hero version as the default small-use logo; apply drop shadows; place on busy photos without a controlled field; crop the symbol asymmetrically; distort proportions; add taglines too close to the lockup.

---

## 14. Variant selection logic

| Variant | When |
|---------|------|
| **Primary** | Premium surface; dark field available; brand presence matters more than minimalism |
| **Clean** | Transparency needed; controlled interface placement; reproduction must stay crisp |
| **Symbol-only** | Limited space; recognition over naming; app, avatar, icon contexts |
| **Flat** | Small size; low resolution; production limits; favicon and utility graphics |
| **Monochrome** | Print/vendor constraints; embroidery, emboss, foil, laser, stamp, legal documents |

---

## 15. Nova handoff checklist (before release)

- [ ] Master SVG exists for each lockup  
- [ ] PNG exports are pixel-clean  
- [ ] Transparent versions have no unintended halo artifacts  
- [ ] Favicon set tested at actual browser size  
- [ ] App icon reads clearly on home screen  
- [ ] Avatar crop tested inside circular mask  
- [ ] Monochrome version remains identifiable  
- [ ] No team member recreates the logo from scratch  

---

## 16. Final approval statement

The Wisewave logo is **locked** when:

- It reproduces consistently across app, web, print, and social  
- The symbol remains recognizable without the wordmark  
- The mark does not depend on atmosphere to feel like itself  
- No element calls attention to itself  
- The whole form holds as one calm field  

---

## 17. Nova-ready one-paragraph handoff

Use the locked Wisewave mark exactly as approved. Do not redesign, restyle, intensify, or reinterpret it. Build the production system around five controlled variants: **Primary**, **Clean**, **Symbol-only**, **Flat**, and **Monochrome**. Use the symbol-only mark for app icons, avatars, and favicons; use simplified or flat forms at very small sizes. Preserve generous clearspace, keep the luminosity restrained, and avoid any treatment that makes the mark feel more dramatic, more technological, or more decorative than the approved version.

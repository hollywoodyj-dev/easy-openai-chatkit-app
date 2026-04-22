# Google Play — listing vs on-device icon and name (Misleading Claims)

If Play rejects with **“App does not match the store listing”** for **hi-res icon** or **launcher icon**, Google is comparing what users see **after install** to what you declared in **Store listing**.

## What the Wisewave Android build uses

- **Package:** `com.wisewave.chatkit` (`mobile/app.json` → `android.package`)
- **Launcher label:** from Expo `expo.name` (must match the **app title** you show on the store, or reviewers will flag a mismatch).
- **Icons:** `mobile/assets/icon.png` and `mobile/assets/adaptive-icon.png` are the same asset in-repo; Android uses the **adaptive icon** foreground on background `#000000` (`mobile/app.json` → `android.adaptiveIcon`).

## Fix checklist (do this before the next review)

1. **App name**
   - In Play Console → **Main store listing** → **App name**, use the same string as **`expo.name`** in `mobile/app.json` (currently **Wisewave**).
   - Rebuild and upload a new AAB after any name change so the device label matches.

2. **Hi-res icon (512 × 512)**
   - Use the **same** graphic as the app icon source: export from `mobile/assets/icon.png` (or regenerate from your locked symbol-only mark per `docs/Wisewave_Logo_System_Nova_Handoff.md`).
   - Do **not** use an older marketing mark, favicon, or web-only variant unless it is pixel-identical to the launcher foreground (same silhouette, same colors).

3. **Adaptive icon vs flat icon**
   - On device, Android shows the adaptive foreground **inside a circle/squircle** on the configured background.
   - If your 512×512 listing icon is a **full-bleed square** that looks different from the **cropped** launcher, reviewers may still flag it. Prefer a centered symbol with safe margins (standard adaptive safe zone), or upload a 512 asset that matches how the icon looks **on a device** (preview in Android Studio / emulator).

4. **Feature graphic / screenshots (optional but good hygiene)**
   - Ensure screenshots reflect the **current** build (same name, same chrome). Mismatches here are a separate class of issues but often reviewed together.

5. **Internal testing**
   - Install the **same AAB** you submit from an **internal / closed** track, long-press the launcher icon → **App info**, and confirm **name + icon** match the default store listing before sending to production review again.

## Repo reference paths

| Item            | Path                          |
|-----------------|-------------------------------|
| Expo config     | `mobile/app.json`             |
| Icon sources    | `mobile/assets/icon.png`      |
| Adaptive fg     | `mobile/assets/adaptive-icon.png` (same file as `icon.png` in-repo) |

If rejection persists after name + 512 alignment, capture **device launcher screenshot** and **Play Console hi-res icon** side-by-side for the next appeal text.

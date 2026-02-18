# Wisewave Chat – Android / iOS app

Expo (React Native) app for Wisewave ChatKit. Uses the same backend as the web app: register, login, 7-day trial, and chat via WebView.

## Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go](https://expo.dev/go) on your phone (for quick testing), or Android Studio / Xcode for builds

## Setup

1. Install dependencies:

   ```bash
   cd mobile
   npm install
   ```

2. (Optional) Override the API URL with an env file:
   - Create `mobile/.env` with:
     ```
     EXPO_PUBLIC_API_URL=https://wisewave-chatkit-app-v2.vercel.app
     ```
   - Default is already that URL if you don’t set it.

## Run

- **Start dev server:** `npm start` then scan QR with Expo Go (Android) or Camera (iOS).
- **Android:** `npm run android` (requires Android Studio / emulator or device).
- **iOS:** `npm run ios` (requires Xcode on Mac).

## Flow

1. **Index** – If no stored token, redirect to Login; otherwise to Chat.
2. **Login** – Email + password → `POST /api/auth/login` → store token → Chat.
3. **Register** – Email + password (min 8 chars) → `POST /api/auth/register` → 7-day trial + token → Chat.
4. **Chat** – WebView loads `{API_BASE_URL}/embed-mobile?token=...`; backend creates a session and ChatKit runs in the WebView. Sign out clears the token and returns to Login.

## ChatKit “web component unavailable” or 404

- **Domain allowlist:** Your deployment URL (e.g. `https://wisewave-chatkit-app-v2.vercel.app`) must be in the [OpenAI Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist). Add the exact origin (no path). Wait a few minutes after saving.
- **CSP / script:** The app loads the ChatKit script on `/embed-mobile` and sets CSP so the CDN and API are allowed; if you use a custom domain, ensure it’s allowlisted.

## Build for stores

- **Android (APK/AAB):** `eas build --platform android` (requires [EAS](https://expo.dev/eas) and an Expo account).
- **iOS:** `eas build --platform ios` (requires Apple Developer account).

Update `app.json` with your own `package` / `bundleIdentifier` and add real app icons under `assets/` before publishing.

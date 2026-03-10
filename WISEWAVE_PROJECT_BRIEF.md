# WiseWave Project Brief (for other agents)

Use this document to onboard another AI agent or developer on the WiseWave ChatKit project.

---

## What this project is

- **Product name:** WiseWave Chat (branded as "Wisewave Chat" in app.json).
- **Repo:** `https://github.com/hollywoodyj-dev/easy-openai-chatkit-app`
- **Structure:** Monorepo with:
  - **Web app** (Next.js 15) – root: `package.json`, `app/`, `pages/`
  - **Mobile app** (Expo SDK 54, React Native 0.81) – `mobile/` with Expo Router

Web provides chat (OpenAI ChatKit), auth, subscriptions (PayPal web + Google Play mobile), and account/subscription management. Mobile loads the chat in a WebView (`/embed?token=...&embed=mobile`) and handles Google Play IAP; PayPal is used on web.

---

## Database

- **Provider:** PostgreSQL (Prisma).
- **Connection:** Set via **`DATABASE_URL`** in `.env.local` (root). Not in `.env.example`; add it when setting up.
  - Example format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=...`
  - Production often uses a hosted Postgres (e.g. Vercel Postgres, Neon, Supabase); the actual URL is in the user's environment or Vercel project env vars.

**Schema (high level):**

- **User:** id, email, country, passwordHash, name, oauthProvider, oauthId, createdAt, updatedAt.
- **Subscription:** id, userId, status (trialing | active | canceled | expired), plan (monthly | yearly), platform (google_play | app_store | stripe_web), trialEndsAt, currentPeriodStart, currentPeriodEnd, externalSubscriptionId (PayPal sub ID or Play purchase token), createdAt, updatedAt.

Run migrations: `npx prisma migrate deploy` (prod) or `npx prisma migrate dev` (local). Generate client: `npx prisma generate` (also runs in postinstall).

---

## Environment variables

**Root (Next.js / Vercel) – `.env.local` / Vercel env:**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (not in .env.example; add manually). |
| `OPENAI_API_KEY` | Yes | From OpenAI platform; same org/project as Agent Builder. |
| `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | Yes | From OpenAI Agent Builder after publishing workflow. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Public app URL (e.g. `https://wisewave-chatkit-app-v2.vercel.app`) for PayPal return URLs and allowlist. |
| `ADMIN_EMAIL` | Optional | Email that can access `/admin` (user & subscription management). |
| `PAYPAL_CLIENT_ID` | For PayPal | From PayPal app. |
| `PAYPAL_CLIENT_SECRET` | For PayPal | From PayPal app. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | For PayPal | Same as PAYPAL_CLIENT_ID for client-side SDK. |
| `NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID` | For PayPal | Plan ID (P-xxx) for monthly subscription. |
| `NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID` | For PayPal | Plan ID for yearly subscription. |
| `PAYPAL_SANDBOX` | Optional | `true` for sandbox. |
| `CHATKIT_API_BASE` | Optional | Override ChatKit API base (default: OpenAI). |

**Mobile (`mobile/`):**

- `EXPO_PUBLIC_API_URL` – Backend URL; defaults to `https://wisewave-chatkit-app-v2.vercel.app` in `mobile/config.ts`.

EAS Build can use env vars configured in Expo dashboard for the project or in `eas.json` if defined.

---

## Key URLs and routes

- **Web:** `/` (home), `/embed` (chat; optional `?token=...`), `/embed?token=...&embed=mobile` (mobile WebView), `/login`, `/subscribe?token=...`, `/account?token=...` (and `&embed=mobile` when from app), `/admin` (admin only).
- **API:** `pages/api/auth/login`, `register`, `oauth/...`; `pages/api/mobile/create-session` (chat session + subscription check); `pages/api/account/me`; `pages/api/subscription/activate-paypal-subscription`, `activate-google-play`, `cancel`; `pages/api/admin/*`.

---

## Mobile app (Android focus)

- **Package:** `com.wisewave.chatkit` (Android), bundleId `com.wisewave.chatkit` (iOS).
- **EAS project ID:** `e1780162-70be-4694-aba9-a83370185fa3` (in `mobile/app.json`).
- **Build:** From `mobile/`: `eas build -p android --profile production` (produces AAB for Google Play).
- **Deep link scheme:** `wisewave://` (e.g. `wisewave://oauth` for OAuth callback).
- **Chat:** Loads `getEmbedMobileUrl(token)` = `${API_BASE_URL}/embed?token=...&embed=mobile`. When `embed=mobile`, web header hides "Logout" (native "Sign out" only).
- **Subscriptions:** Google Play via `react-native-iap` (product IDs e.g. `wisewave_monthly`, `wisewave_yearly`). Backend: `POST /api/subscription/activate-google-play` with `purchaseToken`, `productId`, `plan`.
- **Social login:** Optional; uses `expo-web-browser` with guarded `require()` so missing native module doesn’t crash app (shows "Not available… use email and password" if unavailable).

---

## Subscription and access logic

- **Mobile session:** `pages/api/mobile/create-session.ts` – requires valid JWT; allows access if user has trialing (within trial), active (within currentPeriodEnd), or **canceled but still within currentPeriodEnd**.
- **Web chat:** Uses same backend session/create-session; subscription required when using token (402 if not trialing/active/canceled-with-access).
- **Cancel flow:** `POST /api/subscription/cancel` marks subscription canceled; for PayPal (platform `stripe_web`) it also calls PayPal cancel API when `externalSubscriptionId` is set. Google Play: message tells user to cancel in Play Store.

---

## Where to look for things

- **Auth (JWT, login, OAuth):** `lib/auth.ts`, `pages/api/auth/*`.
- **Chat UI:** `components/ChatKitPanel.tsx`, `app/embed/page.tsx`.
- **Subscribe/account UI:** `app/subscribe/page.tsx`, `app/account/page.tsx`.
- **Subscription plans config:** `lib/subscription-plans.ts`.
- **Prisma client:** `lib/prisma.ts`; schema: `prisma/schema.prisma`.
- **Mobile auth/session:** `mobile/context/AuthContext.tsx`, `mobile/app/login.tsx`, `chat.tsx`, `subscription.tsx`, `config.ts`.

---

## Database URL – important for other agents

The **actual** `DATABASE_URL` value is **not** in the repo (it’s secret). It lives in:

- **Local:** `.env.local` in the project root (create from `.env.example` and add `DATABASE_URL`).
- **Production (Vercel):** Project → Settings → Environment Variables → `DATABASE_URL`.

To “update with other agent” or another machine: **copy the value from your current `.env.local` or Vercel env** and set it in the new environment. Never commit the real URL to the repo. This brief only documents that the variable is required and where it’s used (Prisma `schema.prisma` and any script or server that loads `env`).

---

*Generated for handoff to another agent. User may call this assistant “Nova.”*

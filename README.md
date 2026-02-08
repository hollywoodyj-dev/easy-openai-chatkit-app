# ChatKit Starter Template

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![NextJS](https://img.shields.io/badge/Built_with-NextJS-blue)
![OpenAI API](https://img.shields.io/badge/Powered_by-OpenAI_API-orange)

This repository is the simplest way to bootstrap a [ChatKit](http://openai.github.io/chatkit-js/) application. It ships with a minimal Next.js UI, the ChatKit web component, and a ready-to-use session endpoint so you can experiment with OpenAI-hosted workflows built using [Agent Builder](https://platform.openai.com/agent-builder).

## What You Get

- Next.js app with `<openai-chatkit>` web component and theming controls
- API endpoint for creating a session at [`app/api/create-session/route.ts`](app/api/create-session/route.ts)
- Config file for starter prompts, theme, placeholder text, and greeting message

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the example file and fill in the required values:

```bash
cp .env.example .env.local
```

You can get your workflow id from the [Agent Builder](https://platform.openai.com/agent-builder) interface, after clicking "Publish":

<img src="./public/docs/workflow.jpg" width=500 />

You can get your OpenAI API key from the [OpenAI API Keys](https://platform.openai.com/api-keys) page.

### 3. Configure ChatKit credentials

Update `.env.local` with the variables that match your setup.

- `OPENAI_API_KEY` — API key created **within the same org & project as your Agent Builder**
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` — the workflow you created in [Agent Builder](https://platform.openai.com/agent-builder)
- (optional) `CHATKIT_API_BASE` - customizable base URL for the ChatKit API endpoint

> Note: if your workflow is using a model requiring organization verification, such as GPT-5, make sure you verify your organization first. Visit your [organization settings](https://platform.openai.com/settings/organization/general) and click on "Verify Organization".

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting. Use the prompts on the start screen to verify your workflow connection, then customize the UI or prompt list in [`lib/config.ts`](lib/config.ts) and [`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx).

### 5. Deploy to Vercel

1. **Push your repo to GitHub** (or GitLab/Bitbucket).

2. **Import the project in Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in.
   - Click **Add New… → Project** and import this repository.
   - Vercel will detect Next.js and use the default build settings.

3. **Add environment variables** in the Vercel project:
   - **Settings → Environment Variables**
   - Add:
     - `OPENAI_API_KEY` — your OpenAI API key ([create one](https://platform.openai.com/api-keys), same org & project as Agent Builder).
     - `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` — your workflow ID from [Agent Builder](https://platform.openai.com/agent-builder) (after Publish).
   - Optionally add `CHATKIT_API_BASE` if you use a custom ChatKit API URL.
   - Apply to **Production**, **Preview**, and **Development** as needed.

4. **Deploy** — Vercel will build and deploy. After the first deploy, copy your Vercel URL (e.g. `https://your-app.vercel.app`).

5. **Allow the domain in OpenAI**
   - Add your Vercel URL to the [Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist) so ChatKit can create sessions from your deployed app.

For a quick deploy without Git, you can also run **`npx vercel`** in the project directory and follow the prompts, then add the env vars in the Vercel dashboard.

## Customization Tips

- Adjust starter prompts, greeting text, [chatkit theme](https://chatkit.studio/playground), and placeholder copy in [`lib/config.ts`](lib/config.ts).
- Update the event handlers inside [`components/.tsx`](components/ChatKitPanel.tsx) to integrate with your product analytics or storage.

## References

- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [Advanced Self-Hosting Examples](https://github.com/openai/openai-chatkit-advanced-samples)

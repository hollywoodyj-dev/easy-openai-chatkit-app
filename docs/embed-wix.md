# Embed Chat on Your Wix Website

You can embed the Wisewave ChatKit chat on any Wix page using an **iframe**.

## 1. Use the embed URL

Your chat app has a dedicated embed page that shows only the chat (no extra navigation):

- **Embed URL:** `https://wisewave-chatkit.vercel.app/embed`  
  (Replace with your actual Vercel URL if different, e.g. `https://your-project.vercel.app/embed`.)

## 2. Allow your Wix domain in OpenAI

So ChatKit can run when visitors open your Wix site:

1. Go to [OpenAI Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist).
2. Add your **Wix site domain**, for example:
   - `https://yoursite.wixsite.com/your-site`
   - or your custom domain, e.g. `https://www.yourdomain.com`
3. Save and wait a few minutes for it to take effect.

## 3. Add the iframe in Wix

1. In the Wix Editor, open the page where you want the chat.
2. Click **Add** (+) → **Embed** → **Embed a site** (or **HTML iframe**).
3. Choose **Enter code** (or paste HTML).
4. Paste this and replace `YOUR_EMBED_URL` with your embed URL (e.g. `https://wisewave-chatkit.vercel.app/embed`):

   ```html
   <iframe
     src="YOUR_EMBED_URL"
     title="Chat"
     width="100%"
     height="600"
     style="border: none; border-radius: 8px; min-height: 500px;"
   ></iframe>
   ```

5. Resize the embed block to the width and height you want (e.g. sidebar 400px wide, or full width 600px tall).
6. Publish the page.

## 4. Optional: floating chat widget

To show the chat as a floating widget (e.g. bottom-right corner):

- Use a **Corner** or **Strip** element and place the embed inside it, or
- Use an **HTML iframe** in a **Strip** or **Box** positioned at the bottom-right and give the iframe a fixed width/height (e.g. 380×600).

## Troubleshooting

- **Chat doesn’t load:** Confirm your Wix domain is in the [OpenAI Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist) and that you’re using the correct embed URL.
- **Blank iframe:** Open the embed URL directly in a new tab; if it works there, the issue is usually domain allowlist or Wix blocking the iframe (try “Embed a site” or “HTML iframe”).
- **Session errors:** Ensure `OPENAI_API_KEY` and `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` are set in your Vercel project and that the app has been redeployed after adding them.

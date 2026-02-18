# Finding the CSP that blocks /embed-mobile

The "Content Security Policy blocks eval" error comes from the **document** (HTML) response of the **embed-mobile page**, not from other requests (e.g. Datadog, chatkit.js).

## How to get the right Response Headers

1. Open: `https://wisewave-chatkit-app-v2.vercel.app/embed-mobile?token=YOUR_JWT`
2. Open DevTools → **Network** tab.
3. **Refresh** the page (F5).
4. In the request list, find the **first** request whose URL is exactly:
   - `embed-mobile?token=...` (your domain)
   - Type: **document** (or "html").
5. Click that row.
6. In **Headers** → **Response Headers**, look for **Content-Security-Policy**.

That value is what the browser uses. If you see more than one `Content-Security-Policy` header, the browser applies all of them (most restrictive wins). If you see `script-src` without `'unsafe-eval'`, that’s what’s blocking ChatKit.

## Vercel

If the document only has `frame-ancestors *` but the console still shows a script-src block, check:

- Vercel project → **Settings** → **Security** (or **Headers**) for any global CSP or security headers that might add `script-src`.

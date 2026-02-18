# OAuth Setup Guide

The UI for social login (Google, Facebook, X) has been implemented, but you'll need to configure OAuth credentials and complete the OAuth flow implementation.

## Current Status

✅ **Completed:**
- Database schema updated to support OAuth users
- UI redesigned with calming colors matching SeeSoul Psychotherapy website
- Social login buttons added to all login/register screens
- OAuth API route structure created

⚠️ **Needs Configuration:**
- OAuth app credentials from providers
- Complete OAuth flow implementation

## Steps to Complete OAuth Setup

### 1. Get OAuth Credentials

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/oauth/google/callback`
   - `wisewave://` (for mobile)
6. Save Client ID and Client Secret

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (choose "Consumer" app type)
3. Add "Facebook Login" product to your app
4. Go to Facebook Login → Settings
5. Add Valid OAuth Redirect URIs:
   - `https://wisewave-chatkit-app-v2.vercel.app/api/auth/oauth/facebook/callback`
6. In App Settings → Basic, note your App ID and App Secret
7. Make sure your app is in "Live" mode or add test users for development
8. Save App ID and App Secret

#### X (Twitter) OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set callback URL:
   - `https://yourdomain.com/api/auth/oauth/x/callback`
4. Save API Key and API Secret

### 2. Add Environment Variables

Add to your `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# X (Twitter) OAuth
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_client_secret

# OAuth callback base URL (optional, defaults to Vercel URL)
OAUTH_CALLBACK_BASE_URL=https://wisewave-chatkit-app-v2.vercel.app
```

### 3. Install OAuth Libraries (Recommended)

For Next.js, you can use:

```bash
npm install next-auth
# or
npm install passport passport-google-oauth20 passport-facebook passport-twitter
```

### 4. Implement OAuth Flow

The OAuth flow should:
1. Redirect user to provider's authorization page
2. Handle callback with authorization code
3. Exchange code for access token
4. Fetch user info (email, name) from provider
5. Create/update user in database via `/api/auth/oauth`
6. Generate JWT token
7. Redirect back to app with token

### 5. Update OAuth Route

Update `pages/api/auth/oauth/[provider].ts` to implement the actual OAuth flow using your chosen library.

## Design Colors Used

Matching SeeSoul Psychotherapy website aesthetic:
- Background: `#FAF9F6` (soft beige/cream)
- Text: `#2D3748` (soft dark gray)
- Muted text: `#718096` (muted gray)
- Borders: `#E2E8F0` (light gray)
- Buttons: `#4A5568` (soft dark gray-brown)
- Social buttons: Provider brand colors

## Testing

Once OAuth is configured:
1. Test each provider's login flow
2. Verify user creation in database
3. Check that JWT tokens are generated correctly
4. Ensure chat history works with OAuth users

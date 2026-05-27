import { useState, FormEvent, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { trackEvent } from "@/lib/wisewave-analytics";
import { useRouter } from "next/router";

/** Bing / SEO hygiene: descriptive document title (overrides short default in `_app`). */
const LOGIN_PAGE_TITLE =
  "Sign in or create an account | Wisewave reflection chat access";
const LOGIN_PAGE_DESCRIPTION =
  "Sign in to Wisewave with email and password or Google, Facebook, or X. Opens your reflection chat. Account access only—not the marketing homepage.";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

/**
 * Web login/signup page aligned to Wisewave visual direction.
 * Supports email/password and social OAuth login.
 */
const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Show error from OAuth redirect (e.g. /login?error=OAuth+authentication+failed)
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.error;
    const message = typeof q === "string" ? decodeURIComponent(q) : "";
    if (message) {
      setError(message);
      router.replace("/login", undefined, { shallow: true });
    }
  }, [router.isReady, router.query.error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const endpoint =
        mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          (data?.error as string) ??
            (mode === "signup"
              ? "Could not create account."
              : "Invalid email or password.")
        );
        return;
      }
      const token = data?.token as string | undefined;
      if (!token) {
        setError("No token received.");
        return;
      }
      const isAdmin = Boolean(data?.isAdmin);
      if (mode === "signup") {
        trackEvent("signup_completed", { source: "email_register" });
      }
      const target = isAdmin ? "/admin" : "/chat";
      await router.replace(`${target}?token=${encodeURIComponent(token)}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "facebook" | "x") => {
    setOauthLoading(provider);
    window.location.href = `${API_BASE}/api/auth/oauth/${provider}?state=web`;
  };

  return (
    <>
      <Head>
        <title>{LOGIN_PAGE_TITLE}</title>
        <meta name="description" content={LOGIN_PAGE_DESCRIPTION} />
      </Head>
      <main className="min-h-screen bg-[#F7F5F2] px-4 py-10">
        <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex w-full max-w-[280px] min-w-[140px] justify-center">
            <Image
              src="/brand/wisewave-text.png"
              alt="Wisewave"
              width={2172}
              height={724}
              className="h-auto w-full object-contain object-center"
              sizes="280px"
              priority
            />
          </div>
          <h1 className="mt-5 text-3xl font-medium tracking-[-0.02em] text-[#1F1F1F]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-[#5E5E5E]">
            {mode === "login"
              ? "A calmer way to continue the conversation."
              : "Start with one honest line, then keep going."}
          </p>
        </div>

        <div className="rounded-[28px] border border-black/8 bg-white/75 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.05)] backdrop-blur-sm md:p-7">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={!!loading || !!oauthLoading}
              className="w-full rounded-2xl bg-[#4285F4] px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {oauthLoading === "google" ? "Signing in..." : "Continue with Google"}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              disabled={!!loading || !!oauthLoading}
              className="w-full rounded-2xl bg-[#1877F2] px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {oauthLoading === "facebook" ? "Signing in..." : "Continue with Facebook"}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("x")}
              disabled={!!loading || !!oauthLoading}
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {oauthLoading === "x" ? "Signing in..." : "Continue with X"}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs text-[#7A7A7A]">or</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#5E5E5E]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading || !!oauthLoading}
                className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-[#1F1F1F] outline-none transition focus:border-[#6F8596]/40 focus:ring-2 focus:ring-[#6F8596]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#5E5E5E]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                disabled={loading || !!oauthLoading}
                className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-[#1F1F1F] outline-none transition focus:border-[#6F8596]/40 focus:ring-2 focus:ring-[#6F8596]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading || !!oauthLoading}
              className="w-full rounded-2xl bg-[#6F8596] px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign in"
                  : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#5E5E5E]">
            {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "signup" : "login");
              }}
              className="font-medium text-[#4F6677] underline underline-offset-2"
              disabled={loading || !!oauthLoading}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        </div>
      </main>
    </>
  );
};
export default LoginPage;

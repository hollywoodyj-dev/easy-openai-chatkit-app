import { useState, FormEvent } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const API_BASE =
  typeof window !== "undefined"
    ? window.location.origin
    : "";

/**
 * Web login page with calming design matching SeeSoul Psychotherapy aesthetic.
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      const target = isAdmin ? "/admin" : "/embed";
      await router.replace(
        `${target}?token=${encodeURIComponent(token)}`
      );
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
    <main style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={styles.subtitle}>
            {mode === "login"
              ? "A space to pause, breathe, and return to yourself"
              : "Start your journey with a calm, focused chat space."}
          </p>
        </div>

        <div style={styles.socialContainer}>
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={!!loading || !!oauthLoading}
            style={{
              ...styles.socialButton,
              ...styles.googleButton,
              ...(oauthLoading === "google" || loading ? styles.buttonDisabled : {}),
            }}
          >
            {oauthLoading === "google" ? "Signing in..." : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("facebook")}
            disabled={!!loading || !!oauthLoading}
            style={{
              ...styles.socialButton,
              ...styles.facebookButton,
              ...(oauthLoading === "facebook" || loading ? styles.buttonDisabled : {}),
            }}
          >
            {oauthLoading === "facebook" ? "Signing in..." : "Continue with Facebook"}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("x")}
            disabled={!!loading || !!oauthLoading}
            style={{
              ...styles.socialButton,
              ...styles.xButton,
              ...(oauthLoading === "x" || loading ? styles.buttonDisabled : {}),
            }}
          >
            {oauthLoading === "x" ? "Signing in..." : "Continue with X"}
          </button>
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading || !!oauthLoading}
            style={styles.input}
          />
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading || !!oauthLoading}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !!oauthLoading}
            style={{
              ...styles.button,
              ...(loading || oauthLoading ? styles.buttonDisabled : {}),
            }}
          >
            {loading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Sign in"
                : "Sign up"}
          </button>
          <p style={styles.switchText}>
            {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "signup" : "login");
              }}
              style={styles.switchLink}
              disabled={loading || !!oauthLoading}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#FAF9F6", // Soft beige/cream
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#FFFFFF",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  header: {
    marginBottom: 32,
    textAlign: "center" as const,
  },
  title: {
    margin: "0 0 8px",
    fontSize: 28,
    fontWeight: 300,
    color: "#2D3748",
    letterSpacing: "0.5px",
  },
  subtitle: {
    margin: 0,
    color: "#718096",
    fontSize: 15,
    lineHeight: "22px",
    fontStyle: "italic" as const,
  },
  socialContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    color: "#fff",
    transition: "opacity 0.2s",
  },
  googleButton: {
    background: "#4285F4",
  },
  facebookButton: {
    background: "#1877F2",
  },
  xButton: {
    background: "#000000",
  },
  divider: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#E2E8F0",
  },
  dividerText: {
    margin: "0 16px",
    color: "#9CA3AF",
    fontSize: 14,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 500,
    color: "#4A5568",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 16,
    border: "1px solid #E2E8F0",
    borderRadius: 12,
    fontSize: 16,
    boxSizing: "border-box" as const,
    color: "#2D3748",
    background: "#FFFFFF",
  },
  error: {
    margin: "0 0 16px",
    color: "#DC2626",
    fontSize: 14,
  },
  switchText: {
    marginTop: 12,
    fontSize: 13,
    color: "#4A5568",
    textAlign: "center" as const,
  },
  switchLink: {
    border: "none",
    padding: 0,
    margin: 0,
    background: "none",
    color: "#2B6CB0",
    cursor: "pointer",
    fontSize: 13,
    textDecoration: "underline",
  },
  button: {
    width: "100%",
    padding: "14px 16px",
    background: "#4A5568",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.3px",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default LoginPage;

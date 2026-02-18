import { useState, FormEvent } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const API_BASE =
  typeof window !== "undefined"
    ? window.location.origin
    : "";

/**
 * Web login page for testing authToken flow in the browser.
 * On success, redirects to /embed?token=<JWT> so you can test
 * ChatKit with a real token and per-user chat history.
 */
const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data?.error as string) ?? "Invalid email or password.");
        return;
      }
      const token = data?.token as string | undefined;
      if (!token) {
        setError("No token received.");
        return;
      }
      await router.replace(`/embed?token=${encodeURIComponent(token)}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "white",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: "0 0 24px", fontSize: 22, color: "#0f172a" }}>
          Sign in (web)
        </h1>
        <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 14 }}>
          Use this page to get a token and open chat with authToken in the
          browser. Same credentials as the mobile app.
        </p>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: 20,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p
              style={{
                margin: "0 0 16px",
                color: "#dc2626",
                fontSize: 14,
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: loading ? "#94a3b8" : "#0f172a",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign in → Open chat"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;

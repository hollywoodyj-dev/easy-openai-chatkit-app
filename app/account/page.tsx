"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE =
  typeof window !== "undefined" ? window.location.origin : "";

type SubscriptionStatus = "trialing" | "active" | "canceled" | "expired";
type SubscriptionPlan = "monthly" | "yearly" | null;
type SubscriptionPlatform = "google_play" | "app_store" | "stripe_web" | null;

type AccountResponse = {
  user: {
    id: string;
    email: string;
    createdAt: string;
    country: string | null;
  };
  subscription: {
    id: string;
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    platform: SubscriptionPlatform;
    trialEndsAt: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
  } | null;
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function describeExpiry(sub: AccountResponse["subscription"]): string {
  if (!sub) return "No subscription";
  if (sub.status === "trialing") {
    return `Trial ends at ${formatDate(sub.trialEndsAt)}`;
  }
  if (sub.status === "active") {
    return `Renews on ${formatDate(sub.currentPeriodEnd)}`;
  }
  if (sub.status === "canceled") {
    return `Canceled. Access ends on ${formatDate(sub.currentPeriodEnd)}`;
  }
  return `Expired on ${formatDate(sub.currentPeriodEnd)}`;
}

function AccountContent() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token")?.trim() ?? "";
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/account/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = (await res.json().catch(() => ({}))) as {
          error?: string;
        } & Partial<AccountResponse>;
        if (!res.ok || !json.user) {
          setError(json.error || "Could not load account information.");
          return;
        }
        setData(json as AccountResponse);
      } catch {
        setError("Network error while loading account.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCancel = async () => {
    if (!token || !data?.subscription) return;
    setCanceling(true);
    setCancelMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/subscription/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          (json.error as string) ||
            "Could not update subscription. Please try again."
        );
        return;
      }
      setCancelMessage(
        (json.message as string) ||
          "Subscription updated. Your access will not renew."
      );
      if (json.subscription) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                subscription: {
                  ...prev.subscription!,
                  ...(json.subscription as AccountResponse["subscription"]),
                },
              }
            : prev
        );
      }
    } catch {
      setError("Network error while updating subscription.");
    } finally {
      setCanceling(false);
    }
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-light text-slate-800">
            Account information
          </h1>
          <p className="mb-4 text-sm text-slate-600">
            You are not logged in. Please sign in to see your account details.
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-light text-slate-800">
            Account information
          </h1>
          <Link
            href={`/embed?token=${encodeURIComponent(token)}`}
            className="text-sm text-slate-500 underline-offset-4 hover:underline"
          >
            Back to chat
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">Loading your account…</p>
        )}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </p>
        )}
        {cancelMessage && (
          <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            {cancelMessage}
          </p>
        )}

        {data && (
          <div className="space-y-6 text-sm text-slate-700">
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account
              </h2>
              <p>
                <span className="font-semibold">Email:</span> {data.user.email}
              </p>
              <p>
                <span className="font-semibold">Member since:</span>{" "}
                {formatDate(data.user.createdAt)}
              </p>
              <p>
                <span className="font-semibold">Expiry:</span>{" "}
                {describeExpiry(data.subscription)}
              </p>
            </section>

            <section className="border-t border-slate-200 pt-4">
              <p className="mb-3 text-xs text-slate-500">
                You can stop your WiseWave access from renewing here. For
                billing, also manage your subscription in your payment provider
                (PayPal or Google Play).
              </p>
              <button
                type="button"
                disabled={
                  canceling ||
                  !data.subscription ||
                  data.subscription.status === "canceled" ||
                  data.subscription.status === "expired"
                }
                onClick={handleCancel}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                {data.subscription &&
                (data.subscription.status === "canceled" ||
                  data.subscription.status === "expired")
                  ? "Subscription already canceled"
                  : canceling
                    ? "Updating…"
                    : "Un-subscribe"}
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-light text-slate-800">
              Account information
            </h1>
            <p className="text-sm text-slate-500">Loading your account…</p>
          </div>
        </main>
      }
    >
      <AccountContent />
    </Suspense>
  );
}


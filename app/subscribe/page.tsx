"use client";

import { useCallback, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

function SubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token")?.trim() || null;
  const canceled = searchParams?.get("canceled") === "1";
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEmbedMobile = Boolean(
    typeof window !== "undefined" &&
      (searchParams?.get("embed") === "mobile" ||
        (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView)
  );

  const handleSelectPlan = useCallback(
    async (planId: PlanId) => {
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(`/subscribe?token=${token || ""}`)}`;
        return;
      }
      setError(null);

      if (isEmbedMobile) {
        if (typeof window !== "undefined" && (window as unknown as { ReactNativeWebView?: { postMessage: (s: string) => void } }).ReactNativeWebView) {
          (window as unknown as { ReactNativeWebView: { postMessage: (s: string) => void } }).ReactNativeWebView.postMessage(
            JSON.stringify({ type: "open_subscription", plan: planId })
          );
        }
        return;
      }

      setLoading(planId);
      try {
        const res = await fetch(`${API_BASE}/api/subscription/create-paypal-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan: planId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) || "Could not start payment");
          setLoading(null);
          return;
        }
        const url = data.approvalUrl as string;
        if (url) window.location.href = url;
        else setError("No payment URL");
      } catch {
        setError("Something went wrong");
      }
      setLoading(null);
    },
    [token, isEmbedMobile]
  );

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ background: "#FAF9F6", fontFamily: "system-ui, sans-serif" }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-light text-slate-800">
          Subscribe to continue
        </h1>
        <p className="mb-8 text-slate-600">
          Your trial has ended. Choose a plan to keep using chat and your history.
        </p>

        {canceled && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Payment was canceled. You can try again below.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {(["monthly", "yearly"] as const).map((planId) => {
            const plan = SUBSCRIPTION_PLANS[planId];
            const isLoading = loading === planId;
            return (
              <div
                key={planId}
                className="relative flex flex-col rounded-xl border border-slate-200 p-6 transition hover:border-slate-300"
              >
                {plan.badge && (
                  <span className="absolute right-3 top-3 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-2 text-lg font-medium text-slate-800">
                  {plan.name}
                </div>
                <div className="mb-1 text-2xl font-semibold text-slate-900">
                  {plan.priceLabel}
                </div>
                <div className="mb-6 text-sm text-slate-500">
                  {plan.intervalLabel}
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPlan(planId)}
                  disabled={!!loading}
                  className="mt-auto rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isEmbedMobile
                    ? "Subscribe"
                    : isLoading
                      ? "Redirecting to PayPal…"
                      : "Pay with PayPal"}
                </button>
              </div>
            );
          })}
        </div>

        {isEmbedMobile && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Payment will be processed via Google Play or App Store in the app.
          </p>
        )}

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/embed" className="underline">
            Back to chat
          </Link>
          {" · "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

/**
 * Subscription page: $29/month or $299/year.
 * Web: Pay with PayPal. Mobile (embed): shows same pricing, payment handled by app (Google/Apple).
 */
export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <main
          className="flex min-h-screen items-center justify-center"
          style={{ background: "#FAF9F6" }}
        >
          <p className="text-slate-500">Loading…</p>
        </main>
      }
    >
      <SubscribeContent />
    </Suspense>
  );
}

"use client";

import { useCallback, Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const PAYPAL_MONTHLY_PLAN_ID =
  process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID ?? "";
const USE_PAYPAL_SUBSCRIPTION_BUTTON =
  !!PAYPAL_CLIENT_ID && !!PAYPAL_MONTHLY_PLAN_ID;

function SubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token")?.trim() || null;
  const canceled = searchParams?.get("canceled") === "1";
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const paypalButtonRendered = useRef(false);

  const isEmbedMobile = Boolean(
    typeof window !== "undefined" &&
      (searchParams?.get("embed") === "mobile" ||
        (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView)
  );

  useEffect(() => {
    if (
      !USE_PAYPAL_SUBSCRIPTION_BUTTON ||
      !token ||
      isEmbedMobile ||
      typeof window === "undefined"
    ) {
      return;
    }
    const container = document.getElementById("paypal-button-container-monthly");
    if (!container || paypalButtonRendered.current) return;

    const existing = document.getElementById("paypal-sdk-subscription");
    if (existing) {
      renderPayPalButton();
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk-subscription";
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => renderPayPalButton();
    document.body.appendChild(script);

    function renderPayPalButton() {
      const paypal = (window as unknown as { paypal?: { Buttons: (opts: unknown) => { render: (sel: string) => Promise<void> } } }).paypal;
      if (!paypal || paypalButtonRendered.current) return;
      const el = document.getElementById("paypal-button-container-monthly");
      if (!el || el.hasChildNodes()) return;

      paypalButtonRendered.current = true;
      paypal
        .Buttons({
          style: {
            shape: "pill",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
          },
          createSubscription: function (
            _data: unknown,
            actions: { subscription: { create: (opts: { plan_id: string }) => Promise<unknown> } }
          ) {
            return actions.subscription.create({
              plan_id: PAYPAL_MONTHLY_PLAN_ID,
            });
          },
          onApprove: async function (data: { subscriptionID?: string }) {
            const subId = data.subscriptionID;
            if (!subId) {
              setError("No subscription ID received");
              return;
            }
            setLoading("monthly");
            setError(null);
            try {
              const res = await fetch(
                `${API_BASE}/api/subscription/activate-paypal-subscription`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    subscriptionId: subId,
                    plan: "monthly",
                  }),
                }
              );
              const json = (await res.json().catch(() => ({}))) as { error?: string };
              if (res.ok) {
                const base =
                  (typeof process !== "undefined" &&
                    process.env.NEXT_PUBLIC_APP_URL)
                    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
                    : "";
                window.location.href = `${base}/embed?token=${encodeURIComponent(token ?? "")}`;
              } else {
                setError(json.error ?? "Activation failed");
              }
            } catch {
              setError("Something went wrong");
            } finally {
              setLoading(null);
            }
          },
        })
        .render("#paypal-button-container-monthly");
    }
  }, [token, isEmbedMobile]);

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
                className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 p-6 transition hover:border-slate-300"
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
                {planId === "monthly" &&
                USE_PAYPAL_SUBSCRIPTION_BUTTON &&
                !isEmbedMobile &&
                token ? (
                  <div
                    id="paypal-button-container-monthly"
                    className="mt-auto min-h-[45px] w-full max-w-full overflow-hidden"
                  />
                ) : (
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
                )}
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

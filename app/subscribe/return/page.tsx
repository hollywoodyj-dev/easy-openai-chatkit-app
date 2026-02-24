"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

function ReturnContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const state = searchParams?.get("state"); // our JWT
    const token = searchParams?.get("token"); // PayPal order ID
    const plan = searchParams?.get("plan") || "monthly";

    if (!state || !token) {
      setStatus("error");
      setMessage("Missing payment data");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/subscription/capture-paypal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state}`,
          },
          body: JSON.stringify({ orderId: token, plan }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          setMessage((data.error as string) || "Payment capture failed");
          return;
        }
        setStatus("success");
        setMessage("Subscription activated!");
        const base = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL)
          ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
          : "";
        window.location.href = `${base}/embed?token=${encodeURIComponent(state)}`;
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Something went wrong");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ background: "#FAF9F6", fontFamily: "system-ui, sans-serif" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm text-center">
        {status === "loading" && (
          <p className="text-slate-600">Completing your subscription…</p>
        )}
        {status === "success" && (
          <p className="text-emerald-700">{message}</p>
        )}
        {status === "error" && (
          <>
            <p className="mb-4 text-red-600">{message}</p>
            <Link
              href="/subscribe"
              className="inline-block rounded-xl bg-slate-900 px-4 py-2 text-white"
            >
              Back to subscription
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

/**
 * PayPal return URL. Captures the order and activates subscription, then redirects to chat.
 */
export default function SubscribeReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center" style={{ background: "#FAF9F6" }}>
          <p className="text-slate-500">Loading…</p>
        </main>
      }
    >
      <ReturnContent />
    </Suspense>
  );
}

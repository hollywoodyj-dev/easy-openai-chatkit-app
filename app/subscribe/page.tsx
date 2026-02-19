"use client";

import Link from "next/link";

/**
 * Subscription page shown when user hits "Subscription required".
 * Web: link to app + Google Play. Mobile app handles in-app purchase.
 */
export default function SubscribePage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ background: "#FAF9F6", fontFamily: "system-ui, sans-serif" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-light text-slate-800">
          Subscribe to continue
        </h1>
        <p className="mb-6 text-slate-600">
          Your trial has ended. Subscribe to keep using chat and your history.
        </p>
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-700">
            Subscribe in the app (recommended)
          </p>
          <p className="text-sm text-slate-600">
            Open the WiseWave Chat app on your phone and tap Subscribe there to
            pay via Google Play. Your subscription will sync across devices.
          </p>
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
          >
            Open Google Play
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
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

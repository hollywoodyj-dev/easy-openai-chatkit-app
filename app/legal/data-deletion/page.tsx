import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User data deletion | Wisewave",
  description:
    "How to request deletion of your Wisewave account and associated personal data.",
  robots: { index: true, follow: true },
};

export default function LegalDataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1F1F1F]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-8 text-sm text-[#5E5E5E]">
          <Link href="/" className="underline underline-offset-4 hover:text-[#1F1F1F]">
            Home
          </Link>
          {" · "}
          <Link
            href="/legal/privacy"
            className="underline underline-offset-4 hover:text-[#1F1F1F]"
          >
            Privacy policy
          </Link>
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-[#1F1F1F] md:text-4xl">
          User data deletion
        </h1>
        <p className="mt-2 text-sm text-[#7A7A7A]">Wisewave · wisewave.io</p>

        <div className="prose prose-neutral mt-10 max-w-none text-[#3A3A3A] prose-p:leading-relaxed prose-headings:font-medium prose-headings:text-[#1F1F1F]">
          <p>
            This page explains how you can ask us to delete personal data associated with
            your use of Wisewave. Use it when an app store or login provider (such as
            Meta) asks for a <strong>data deletion instructions</strong> URL.
          </p>

          <h2 className="mt-10 text-xl">Option 1 — Email (recommended)</h2>
          <p className="mt-3">
            Send an email to{" "}
            <a
              href="mailto:info@wisewave.io?subject=Data%20deletion%20request"
              className="text-[#5E6F7A] underline underline-offset-4 hover:text-[#1F1F1F]"
            >
              info@wisewave.io
            </a>{" "}
            with the subject line <strong>Data deletion request</strong>.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Use the <strong>same email address</strong> as your Wisewave account, if you
              have one, so we can verify ownership.
            </li>
            <li>
              If you signed in with Facebook, Google, or X, mention that provider in the
              message so we can match your account.
            </li>
            <li>
              We will confirm receipt and explain any follow-up steps or timing that apply
              to your request.
            </li>
          </ul>

          <h2 className="mt-10 text-xl">Option 2 — Signed-in account</h2>
          <p className="mt-3">
            If you can sign in to Wisewave, open{" "}
            <Link
              href="/account"
              className="text-[#5E6F7A] underline underline-offset-4 hover:text-[#1F1F1F]"
            >
              Account
            </Link>{" "}
            (you may need a sign-in link with your token from the app). Use subscription or
            account controls there where available. If you need full account and data
            deletion beyond what the self-serve controls cover, email{" "}
            <a
              href="mailto:info@wisewave.io"
              className="text-[#5E6F7A] underline underline-offset-4 hover:text-[#1F1F1F]"
            >
              info@wisewave.io
            </a>
            .
          </p>

          <h2 className="mt-10 text-xl">What we delete</h2>
          <p className="mt-3">
            When we honor a verified request, we delete or anonymize personal data tied to
            your account as required by law and our technical capabilities, including
            where applicable conversation content and profile identifiers. Some information
            may be retained for a limited period if we must keep it for security, fraud
            prevention, or legal compliance.
          </p>

          <p className="mt-12 text-sm text-[#7A7A7A]">Last updated: April 2026</p>
        </div>
      </div>
    </div>
  );
}

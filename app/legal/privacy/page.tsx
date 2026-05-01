import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Wisewave",
  description:
    "How Wisewave handles personal information for the Wisewave web experience.",
  robots: { index: true, follow: true },
};

export default function LegalPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1F1F1F]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-8 text-sm text-[#5E5E5E]">
          <Link href="/" className="underline underline-offset-4 hover:text-[#1F1F1F]">
            Home
          </Link>
          {" · "}
          <Link
            href="/legal/data-deletion"
            className="underline underline-offset-4 hover:text-[#1F1F1F]"
          >
            User data deletion
          </Link>
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-[#1F1F1F] md:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-[#7A7A7A]">Wisewave · wisewave.io</p>

        <div className="prose prose-neutral mt-8 max-w-none text-[#3A3A3A] prose-p:leading-relaxed prose-headings:font-medium prose-headings:text-[#1F1F1F] [&_p]:my-0 [&_p+p]:mt-3">
          <p>
            This policy describes how Wisewave collects, uses, and protects information
            when you use our website and related services (the &quot;Service&quot;). It
            is written to be readable; it is not legal advice.
          </p>

          <h2 className="mt-6 text-xl">What we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Account information</strong> — such as email address and
              authentication identifiers when you create or sign in to an account.
            </li>
            <li>
              <strong>Conversation content</strong> — messages you send and assistant
              replies generated to provide the Service, when you use features that store
              conversations.
            </li>
            <li>
              <strong>Technical data</strong> — such as device or browser type, general
              log information, and cookies or similar technologies needed to operate,
              secure, and improve the Service.
            </li>
          </ul>

          <h2 className="mt-6 text-xl">How we use information</h2>
          <p className="mt-3">
            We use the information above to provide and improve the Service, authenticate
            users, maintain security, comply with law where applicable, and communicate
            with you about your account or the Service when necessary.
          </p>

          <h2 className="mt-6 text-xl">Sharing</h2>
          <p className="mt-3">
            We use service providers (for example hosting, analytics, or AI inference)
            who process data on our behalf under appropriate agreements. We do not sell
            your personal information.
          </p>

          <h2 className="mt-10 text-xl">Retention</h2>
          <p className="mt-3">
            We retain information for as long as needed to provide the Service and for
            legitimate business or legal purposes, then delete or anonymize it in line
            with our practices.
          </p>

          <h2 className="mt-6 text-xl">Your choices</h2>
          <p className="mt-3">
            Depending on where you live, you may have rights to access, correct, or
            delete certain information, or to object to or restrict certain processing.
            To request deletion of data associated with your account, follow the steps on
            our{" "}
            <Link
              href="/legal/data-deletion"
              className="text-[#5E6F7A] underline underline-offset-4 hover:text-[#1F1F1F]"
            >
              user data deletion
            </Link>{" "}
            page.
          </p>

          <h2 className="mt-6 text-xl">Children</h2>
          <p className="mt-3">
            The Service is not directed at children under the age where parental consent
            is required in your region. We do not knowingly collect personal information
            from those children.
          </p>

          <h2 className="mt-10 text-xl">Changes</h2>
          <p className="mt-3">
            We may update this policy from time to time. The &quot;Last updated&quot; date
            at the bottom will change when we do. Continued use of the Service after
            changes means you accept the updated policy.
          </p>

          <h2 className="mt-6 text-xl">Contact</h2>
          <p className="mt-3">
            For privacy questions or requests, contact us at{" "}
            <a
              href="mailto:info@wisewave.io"
              className="text-[#5E6F7A] underline underline-offset-4 hover:text-[#1F1F1F]"
            >
              info@wisewave.io
            </a>
            .
          </p>

          <p className="mt-8 text-sm text-[#7A7A7A]">Last updated: April 2026</p>
        </div>
      </div>
    </div>
  );
}

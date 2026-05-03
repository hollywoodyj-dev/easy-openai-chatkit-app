import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Plain-language overview: what Wisewave collects, what it does not do with your data, and where the full privacy policy lives.",
  alternates: { canonical: "/privacy" },
};

const TOP_SUMMARY =
  "Wisewave collects account information, conversation content when you use stored chat, and basic technical data needed to run and secure the service. It does not sell your personal information. For exact legal commitments, retention, and your rights, read the full policy linked below—not this overview alone.";

export default function MarketingPrivacyPage() {
  return (
    <>
      <PageHero title="Privacy" body={TOP_SUMMARY} />
      <Section
        title="What we collect (overview)"
        intro="Aligned with the full policy; this section is a map, not a substitute for it."
      >
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <span className="text-[#171717]">Account information</span> — for
            example email and authentication details when you sign in.
          </li>
          <li>
            <span className="text-[#171717]">Conversation content</span> — messages
            you send and assistant replies when you use features that store
            conversations.
          </li>
          <li>
            <span className="text-[#171717]">Technical data</span> — device or
            browser signals, logs, and cookies or similar technologies used to
            operate, secure, and improve the service.
          </li>
        </ul>
      </Section>
      <Section title="What we do not do with your data">
        <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            We do not sell your personal information. We do not use the Service to
            build unrelated advertising profiles beyond what the policy describes.
          </p>
          <p>
            Service providers (for example hosting, analytics, or AI inference)
            may process data on our behalf under agreements; that processing is for
            providing the Service, not for hidden resale.
          </p>
        </div>
      </Section>
      <Section title="Storage and access">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Data is stored and accessed in line with the full policy—security
          practices, transfers, and subprocessors are described there rather than
          summarized here, so this page stays accurate when the policy updates.
        </p>
      </Section>
      <Section title="Retention and deletion">
        <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Information is retained for as long as needed to provide the Service
            and for legitimate business or legal purposes, then deleted or
            anonymized as described in the policy.
          </p>
          <p>
            For account-related deletion steps, use the{" "}
            <Link
              href="/legal/data-deletion"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              user data deletion
            </Link>{" "}
            page linked from the full policy.
          </p>
        </div>
      </Section>
      <Section title="Limits of this overview">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          This page is for orientation in plain language. It is not legal advice
          and may lag the policy if terms change. When in doubt, cite the binding
          document below.
        </p>
      </Section>
      <Section title="Full privacy policy">
        <div className="space-y-4">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            The{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              privacy policy
            </Link>{" "}
            covers collection, use, sharing, retention, your choices, children,
            changes, and contact—read it before relying on any detail for legal or
            compliance decisions.
          </p>
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            If you are deciding whether Wisewave fits you, reading the policy
            first is a valid way to slow down before entering.
          </p>
        </div>
      </Section>
      <Section title="Related pages">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/how-it-works"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              How Wisewave works
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/what-it-is-not"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              What Wisewave is not
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}

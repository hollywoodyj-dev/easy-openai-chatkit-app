import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Wisewave approaches privacy for the public site and where to read the full policy. A low-presence reflection space.",
  alternates: { canonical: "/privacy" },
};

export default function MarketingPrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy"
        body="This overview points you to the product’s privacy commitments. For binding legal text, use the full policy linked below."
      />
      <Section title="Where to read the full policy">
        <div className="space-y-4">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            The{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              privacy policy
            </Link>{" "}
            covers what is collected, how it is stored, how it is used, retention,
            deletion, and how to contact us about data questions.
          </p>
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            If you are deciding whether Wisewave fits you, reading the policy
            first is a valid way to slow down before entering.
          </p>
        </div>
      </Section>
    </>
  );
}

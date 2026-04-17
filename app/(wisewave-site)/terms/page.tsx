import type { Metadata } from "next";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Wisewave (placeholder until legal finalization).",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms"
        body="This is a placeholder for the final product- and legal-approved terms page."
      />
      <Section title="Implementation note">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Replace this page with finalized terms before any broad public launch.
        </p>
      </Section>
    </>
  );
}

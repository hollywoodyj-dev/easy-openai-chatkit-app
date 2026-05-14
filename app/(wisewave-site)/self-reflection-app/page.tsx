import type { Metadata } from "next";
import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

const SEO_TITLE = "A self reflection app for clearer thinking | Wisewave";
const SEO_DESCRIPTION =
  "Wisewave is a self reflection app for people who want space, not instructions. A quiet reflection space. No advice, no coaching, no companion-style AI.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/self-reflection-app" },
  ...wisewaveMarketingSocialMetadata(
    SEO_TITLE,
    SEO_DESCRIPTION,
    "/self-reflection-app",
  ),
};

const faqItems = [
  {
    question: "Is Wisewave a journaling app?",
    answer:
      "Not exactly. It can support reflection, but it is not a journaling prompt engine.",
  },
  {
    question: "Does Wisewave tell me what to do?",
    answer:
      "No. It reflects what you share without directing your process.",
  },
  {
    question: "Is Wisewave for personal growth coaching?",
    answer:
      "No. It is not a coaching or self-improvement guidance system.",
  },
  {
    question: "Who is Wisewave for?",
    answer:
      "People who want space, not instructions — especially when their thoughts feel crowded.",
  },
];

const PAGE_HEADLINE =
  "A self reflection app for people who do not want to be guided";

export default function SelfReflectionAppPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          "/self-reflection-app",
        )}
      />
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>
          Wisewave is a self reflection app, but not in the usual sense. It does
          not try to coach you, improve you, or lead you through a process.
        </p>
        <p>
          It gives you a quieter space to reflect, so your own thoughts can come
          forward more clearly.
        </p>
      </SeoLandingHero>

      <Section title="Reflection without structure taking over">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Some people want prompts, frameworks, and guided exercises.</p>
          <p>Others do not.</p>
          <p>
            If too much structure makes reflection feel managed, Wisewave offers a
            different kind of space — one that stays more restrained and leaves
            more room for your own process.
          </p>
        </div>
      </Section>

      <Section title="When self-reflection feels crowded">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Self-reflection is not always hard because there is nothing there.
          </p>
          <p>Sometimes it is hard because there is too much:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>too many thoughts</li>
            <li>too many interpretations</li>
            <li>too many voices</li>
            <li>too many systems trying to help</li>
          </ul>
          <p className="pt-2">Wisewave does less, so you can hear more clearly.</p>
        </div>
      </Section>

      <Section title="What you receive">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="mb-4 text-base font-medium text-[#171717]">
            With Wisewave, you receive:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>a little more clarity</li>
            <li>a little less noise</li>
            <li>a reflection that does not take over</li>
            <li>a space that stays low-presence</li>
          </ul>
        </div>
      </Section>

      <Section title="Who this may fit">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="mb-4 text-base font-medium text-[#171717]">
            Wisewave may be useful if:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>blank-page journaling does not quite work for you</li>
            <li>you want support for reflection, but not guidance</li>
            <li>you want space without advice</li>
            <li>you do not want companion-style AI</li>
          </ul>
        </div>
      </Section>

      <Section title="FAQ">
        <AccordionFaq items={faqItems} />
      </Section>

      <Section title="Related reading">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Wisewave homepage
            </Link>
          </li>
          <li>
            <Link
              href="/reflection-without-advice"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection without advice
            </Link>
          </li>
          <li>
            <Link
              href="/reflection-ai"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection AI without advice or coaching
            </Link>
          </li>
          <li>
            <Link
              href="/journaling-alternative"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              A journaling alternative
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Full FAQ
            </Link>
          </li>
        </ul>
      </Section>

      <SeoLandingClosing
        lead="If you want space, not instructions, you can begin here."
        from="seo_self_reflection_app"
        relatedHref="/journaling-alternative"
        relatedLabel="A journaling alternative"
        extraRelatedLinks={[
          { href: "/reflection-without-advice", label: "Reflection without advice" },
          { href: "/reflection-ai", label: "Reflection AI without advice or coaching" },
          { href: "/faq", label: "FAQ" },
        ]}
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/wisewave-site/PageHero";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Wisewave, including service boundaries, subscriptions, acceptable use, AI limitations, and Australian Consumer Law protections.",
  alternates: { canonical: "/terms" },
};

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-medium leading-tight tracking-[-0.02em] text-[#171717]">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Wisewave Terms of Use"
        body="These Terms explain the conditions for using Wisewave across our website, app, account features, subscription features, and reflective AI experience."
      />
      <div className="mx-auto w-full max-w-[48rem] space-y-10 px-6 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-12">
      <TermsSection title="Effective date">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Effective date: <strong>April 27, 2026</strong>
        </p>
      </TermsSection>
      <TermsSection title="Welcome to Wisewave">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          By using Wisewave, you agree to these Terms. If you do not agree,
          please do not use Wisewave.
        </p>
      </TermsSection>
      <TermsSection title="1. What Wisewave is">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is a quiet reflection space.</p>
          <p>
            It helps you put thoughts into words and receive a brief reflective
            response that may help you see your own thinking more clearly.
          </p>
          <p>
            Wisewave does not provide advice, coaching, therapy, diagnosis,
            treatment, crisis support, or professional services.
          </p>
          <p>
            Wisewave does not make decisions for you. You remain responsible for
            your own choices, actions, wellbeing, and use of the service.
          </p>
        </div>
      </TermsSection>
      <TermsSection title="2. What Wisewave is not">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is not:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>a therapist, doctor, counsellor, or mental health professional</li>
            <li>a coach, crisis service, or emergency service</li>
            <li>a medical device or substitute for professional care</li>
            <li>a decision-making system</li>
          </ul>
          <p>
            Wisewave does not diagnose, treat, prevent, or manage medical,
            psychological, or mental health conditions.
          </p>
          <p>
            If you need medical, psychological, legal, financial, or other
            professional advice, contact a qualified professional.
          </p>
          <p>
            Australian regulators distinguish general wellbeing tools from
            digital mental health tools that diagnose, monitor, treat, or make
            health-related claims. Wisewave continues to avoid diagnostic or
            treatment claims in product behavior and public wording. See{" "}
            <a
              href="https://www.tga.gov.au/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Therapeutic Goods Administration (TGA)
            </a>
            .
          </p>
        </div>
      </TermsSection>
      <TermsSection title="3. Crisis and emergency situations">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is not suitable for emergencies or crisis situations.</p>
          <p>
            If you may harm yourself or someone else, or you are in immediate
            danger, call your local emergency number now. In Australia, call
            000.
          </p>
          <p>
            You can also contact a crisis support service available in your
            location. Do not rely on Wisewave for urgent support.
          </p>
        </div>
      </TermsSection>
      <TermsSection title="4. Your account">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>You may need an account to use certain parts of Wisewave.</p>
          <p>You are responsible for:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>providing accurate account information</li>
            <li>keeping your login details secure</li>
            <li>activity under your account</li>
            <li>notifying us if you suspect unauthorized access</li>
          </ul>
          <p>
            We may suspend or terminate access if we reasonably believe your
            account is being misused, used unlawfully, or used in a way that
            harms the service or other users.
          </p>
        </div>
      </TermsSection>
      <TermsSection title="5. Subscriptions and payments">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave may offer paid subscriptions.</p>
          <p>
            Price, billing period, renewal terms, and cancellation options are
            shown before purchase or through the relevant app store or payment
            provider.
          </p>
          <p>
            If you subscribe through Apple, Google, Stripe, or another payment
            provider, subscription management may be handled by that provider.
          </p>
          <p>
            You are responsible for cancelling before renewal if you do not want
            to continue.
          </p>
          <p>
            Nothing in these Terms limits rights under Australian Consumer Law.
            See{" "}
            <a
              href="https://www.accc.gov.au/consumers"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              ACCC consumer protections
            </a>
            .
          </p>
        </div>
      </TermsSection>
      <TermsSection title="6. Refunds">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Refund eligibility may depend on how you purchased Wisewave.</p>
          <p>
            App store purchases may require refund requests through that app
            store.
          </p>
          <p>
            If you purchased directly from us, contact:{" "}
            <strong>info@wisewave.io</strong>.
          </p>
          <p>
            We review refund requests in line with these Terms, payment provider
            rules, and applicable Australian Consumer Law rights.
          </p>
        </div>
      </TermsSection>
      <TermsSection title="7. Your reflections and input">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            You are responsible for what you choose to share in Wisewave.
          </p>
          <p>Please do not submit:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>unlawful, abusive, threatening, or harmful content</li>
            <li>content that infringes another person’s rights</li>
            <li>private information about others without permission</li>
            <li>
              highly sensitive information you do not want processed by the
              service
            </li>
          </ul>
        </div>
      </TermsSection>
      <TermsSection title="8. AI-generated responses">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Wisewave uses AI-generated responses that may be incomplete,
            inaccurate, inappropriate, or not suitable for your situation.
          </p>
          <p>
            Do not rely on Wisewave as a source of truth, professional advice,
            diagnosis, treatment, or instruction.
          </p>
          <p>Responses are reflective text, not instructions.</p>
        </div>
      </TermsSection>
      <TermsSection title="9. Acceptable use">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>You must not misuse Wisewave. You must not:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>use Wisewave for unlawful purposes</li>
            <li>reverse engineer, disrupt, overload, or interfere with the service</li>
            <li>scrape, copy, or abuse the service using automation</li>
            <li>bypass usage limits, subscription controls, or security features</li>
            <li>upload malicious code</li>
            <li>generate harmful, deceptive, abusive, or illegal content</li>
            <li>impersonate another person or violate others’ rights</li>
          </ul>
          <p>
            We may restrict, suspend, or terminate access if we reasonably
            believe these rules have been breached.
          </p>
        </div>
      </TermsSection>
      <TermsSection title="10. Intellectual property">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Wisewave name, interface, software, prompts, design, wording,
          branding, and content are owned by us or licensed to us. You may use
          Wisewave for personal use under these Terms. You may not copy,
          reproduce, modify, distribute, sell, or exploit Wisewave content
          without written permission. You retain ownership of your own input,
          subject to rights needed for us to operate, secure, and improve the
          service as described in our Privacy Policy.
        </p>
      </TermsSection>
      <TermsSection title="11. Privacy">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Your use of Wisewave is also governed by our{" "}
          <Link
            href="/privacy"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Privacy page
          </Link>{" "}
          and full{" "}
          <Link
            href="/legal/privacy"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </TermsSection>
      <TermsSection title="12. Service availability">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          We try to keep Wisewave available but do not guarantee uninterrupted
          access. Availability may be affected by maintenance, updates,
          technical issues, third-party provider issues, security incidents, or
          events beyond our control. We may change, pause, or discontinue parts
          of the service where reasonably necessary.
        </p>
      </TermsSection>
      <TermsSection title="13. Changes to Wisewave">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Wisewave may change over time, including features, wording, pricing,
          subscription options, or availability. If a change materially affects
          your rights or use, we will try to provide reasonable notice where
          practical.
        </p>
      </TermsSection>
      <TermsSection title="14. Limitation of liability">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          To the maximum extent permitted by law, we are not liable for
          indirect, incidental, special, consequential, or punitive loss from
          your use of Wisewave. Nothing in these Terms excludes, restricts, or
          modifies non-excludable rights under Australian Consumer Law.
        </p>
      </TermsSection>
      <TermsSection title="15. Third-party services">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          Wisewave may rely on third-party services such as hosting, analytics,
          authentication, payment processing, app stores, or AI infrastructure.
          Your use of those services may also be subject to their own terms and
          policies.
        </p>
      </TermsSection>
      <TermsSection title="16. Termination">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          You may stop using Wisewave at any time. We may suspend or terminate
          access if you breach these Terms, create risk for Wisewave or others,
          if required by law, or if we discontinue the service. Termination does
          not affect rights or obligations intended to continue.
        </p>
      </TermsSection>
      <TermsSection title="17. Governing law">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          These Terms are governed by the laws of New South Wales, Australia,
          unless another jurisdiction is required by applicable consumer law.
          Courts in New South Wales may hear disputes relating to these Terms,
          subject to non-excludable consumer rights.
        </p>
      </TermsSection>
      <TermsSection title="18. Contact">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          For questions about these Terms, contact:{" "}
          <strong>info@wisewave.io</strong>.
        </p>
      </TermsSection>
      </div>
    </>
  );
}

import type { WisewaveMarketingFaqItem } from "@/lib/wisewave-site/wisewave-marketing-faq-items";

/** FAQPage JSON-LD — must mirror visible FAQ only (same array as AccordionFaq). */
export function FaqPageJsonLd({
  items,
}: {
  items: readonly WisewaveMarketingFaqItem[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

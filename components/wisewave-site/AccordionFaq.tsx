"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/wisewave-analytics";

interface FAQItem {
  question: string;
  answer: string;
}

export function AccordionFaq({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_10px_30px_rgba(0,0,0,0.03)]"
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-6 px-6 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => {
                const nextOpen = isOpen ? null : index;
                setOpenIndex(nextOpen);
                if (!isOpen) {
                  trackEvent("faq_open", { question: item.question });
                }
              }}
            >
              <span className="text-base font-medium leading-7 text-[#171717]">
                {item.question}
              </span>
              <span className="mt-1 text-[#5c5c5c]">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? (
              <div className="border-t border-[#e7e1d8] px-6 py-4">
                <p className="text-base leading-[1.75] text-[#5c5c5c]">
                  {item.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

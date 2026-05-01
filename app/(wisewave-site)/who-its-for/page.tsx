import type { Metadata } from "next";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "Who Wisewave Is For",
  description:
    "Who Wisewave may fit: quiet thinkers, people who are over-advised, journaling dropouts, and those uncomfortable with companion-style AI.",
  alternates: { canonical: "/who-its-for" },
};

export default function WhoItsForPage() {
  return (
    <>
      <PageHero
        title="Who Wisewave is for"
        body="Wisewave is not for everyone. It is built for people who want a quieter, more restrained form of reflection."
      />
      <Section title="It may fit people like this">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Quiet thinker",
              "You are already reflective. What you need is less interruption, not more system activity.",
            ],
            [
              "Over-advised person",
              "You have taken in enough methods, suggestions, and frameworks. Another layer of instruction is not what you need.",
            ],
            [
              "Journaling dropout",
              "You may want reflection, but not the friction of prompts, blank pages, or turning it into a task.",
            ],
            [
              "Uncomfortable with companion-style AI",
              "You want something restrained, not something that gets close to you or becomes emotionally sticky.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="It may not fit if you want clear answers">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            If what you want most is advice, action guidance, emotional support,
            or a system that organizes answers for you, Wisewave may not be the
            right fit.
          </p>
        </div>
      </Section>
    </>
  );
}

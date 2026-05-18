import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Extra vertical rhythm for homepage (NOVA brief: slow section pacing). */
  spacious?: boolean;
  children: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  spacious,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={
        spacious
          ? "scroll-mt-20 py-14 sm:py-20"
          : "scroll-mt-20 py-10 sm:py-14"
      }
    >
      <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 text-2xl font-medium leading-tight tracking-[-0.02em] text-[#171717] sm:text-3xl">
            {title}
          </h2>
          {intro ? (
            <p className="mt-4 text-base leading-[1.75] text-[#5c5c5c]">{intro}</p>
          ) : null}
        </div>
        <div className="mt-5 sm:mt-6">{children}</div>
      </div>
    </section>
  );
}

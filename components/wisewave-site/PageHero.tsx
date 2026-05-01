import type { ReactNode } from "react";

export function PageHero({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">Wisewave</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#171717] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5c5c5c]">{body}</p>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

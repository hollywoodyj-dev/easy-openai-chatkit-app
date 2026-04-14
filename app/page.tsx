import Link from "next/link";

const quickPrompts = [
  "I feel overwhelmed",
  "I can’t make sense of what I’m carrying",
  "Something keeps repeating and I don’t know why",
  "I need a quieter space to think",
];

const differenceRows = [
  { traditional: "Gives answers", wisewave: "Reflects" },
  { traditional: "Guides action", wisewave: "Stays with you" },
  { traditional: "Optimizes output", wisewave: "Reduces noise" },
  { traditional: "Becomes useful", wisewave: "Becomes quieter" },
];

const forWhoItems = [
  "You think a lot, but nothing feels clear",
  "You don’t need advice — just space",
  "You’re tired of being told what to do",
  "You want to understand, not be guided",
];

const boundaries = [
  "It won’t guide you",
  "It won’t coach you",
  "It won’t make decisions for you",
  "It won’t try to change you",
];

function toPrefillHref(text: string) {
  return `/chat?prefill=${encodeURIComponent(text)}`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
      {children}
    </p>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f2eb] text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.16em] text-neutral-800"
          >
            WISEWAVE
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
            <a href="#what-this-is" className="transition hover:text-neutral-900">
              What this is
            </a>
            <a href="#why-different" className="transition hover:text-neutral-900">
              Why it’s different
            </a>
            <a href="#final-cta" className="transition hover:text-neutral-900">
              Enter
            </a>
          </nav>
        </header>

        <section className="grid min-h-[78vh] items-center gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="max-w-2xl">
            <SectionLabel>Quiet reflection, not advice</SectionLabel>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
              Not here to give you answers
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 sm:text-xl">
              Wisewave doesn’t guide, advise, or fix you. It reflects — so you
              can see clearly for yourself.
            </p>

            <p className="mt-4 max-w-lg text-base leading-7 text-neutral-500">
              No advice. No coaching. No direction. Just a quieter space to
              think.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Enter the space
              </Link>

              <a
                href="#final-cta"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/70 px-6 text-sm font-medium text-neutral-700 transition hover:bg-white hover:text-neutral-900"
              >
                Start with a prompt
              </a>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-500">
              You can begin with anything — even something unclear.
            </p>
          </div>

          <div className="rounded-[34px] border border-white/70 bg-white/72 p-6 shadow-[0_12px_40px_rgba(20,20,20,0.04)] backdrop-blur-sm sm:p-7">
            <div className="rounded-[28px] border border-neutral-200 bg-[#fbfaf7] p-5 sm:p-6">
              <SectionLabel>What it feels like</SectionLabel>
              <div className="mt-5 space-y-5">
                <div className="rounded-3xl border border-neutral-200 bg-white px-5 py-4 text-base leading-7 text-neutral-700">
                  “I keep circling the same thoughts, but nothing inside me feels
                  clearer.”
                </div>
                <div className="rounded-3xl border border-neutral-200 bg-[#f7f4ee] px-5 py-4 text-base leading-7 text-neutral-700">
                  It won’t tell you what to do. It won’t try to improve you. It
                  helps something come into focus.
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href={toPrefillHref(
                    "I keep circling the same thoughts, but nothing inside me feels clearer."
                  )}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 px-5 text-sm font-medium text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                >
                  Use this opening
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="what-this-is" className="scroll-mt-24 py-10 md:py-14">
          <div className="max-w-2xl">
            <SectionLabel>What this is</SectionLabel>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
              This is not a chatbot
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-white/70 bg-white/78 p-7 shadow-[0_8px_30px_rgba(20,20,20,0.03)]">
              <div className="space-y-4 text-xl font-medium leading-8 text-neutral-900 sm:text-2xl">
                <p>It won’t tell you what to do</p>
                <p>It won’t give you advice</p>
                <p>It won’t try to improve you</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-[#fbfaf7] p-7">
              <p className="text-lg leading-8 text-neutral-700 sm:text-xl">
                Instead, it lets you see what is already there — more clearly.
              </p>
              <p className="mt-5 text-base leading-8 text-neutral-500">
                The point is not to add more noise. The point is to make it
                easier to hear what is already present.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="rounded-[32px] border border-neutral-200 bg-[#f8f5ef] p-7 sm:p-9">
            <div className="max-w-2xl">
              <SectionLabel>What actually happens</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
                What happens here is simple
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                "You speak",
                "It reflects",
                "Something becomes clearer",
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-[26px] border border-white/70 bg-white/80 p-6 text-2xl font-medium tracking-[-0.02em] text-neutral-900"
                >
                  {step}
                </div>
              ))}
            </div>

            <p className="mt-6 text-lg leading-8 text-neutral-700">
              That small shift is enough.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="max-w-2xl">
            <SectionLabel>Experience</SectionLabel>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
              It doesn’t feel like using a tool
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "It feels like your thoughts slowing down",
              "Like noise becoming quieter",
              "Like something inside you coming into focus",
            ].map((line) => (
              <div
                key={line}
                className="rounded-[28px] border border-white/70 bg-white/75 p-7 shadow-[0_8px_30px_rgba(20,20,20,0.03)]"
              >
                <p className="text-xl leading-9 tracking-[-0.02em] text-neutral-900">
                  {line}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-base leading-8 text-neutral-600">
            Nothing is added. Nothing is taken over.
          </p>
        </section>

        <section id="why-different" className="scroll-mt-24 py-10 md:py-14">
          <div className="rounded-[32px] border border-white/70 bg-white/76 p-7 shadow-[0_10px_40px_rgba(20,20,20,0.04)] sm:p-9">
            <div className="max-w-2xl">
              <SectionLabel>Why it’s different</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
                Most AI tries to do more. Wisewave does less.
              </h2>
            </div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-neutral-200">
              <div className="grid grid-cols-2 bg-[#f5f2ec] text-sm font-medium text-neutral-500">
                <div className="border-r border-neutral-200 px-5 py-4">Traditional AI</div>
                <div className="px-5 py-4">Wisewave</div>
              </div>
              {differenceRows.map((row) => (
                <div
                  key={row.traditional}
                  className="grid grid-cols-2 border-t border-neutral-200 bg-white"
                >
                  <div className="border-r border-neutral-200 px-5 py-4 text-base text-neutral-600">
                    {row.traditional}
                  </div>
                  <div className="px-5 py-4 text-base font-medium text-neutral-900">
                    {row.wisewave}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-lg leading-8 text-neutral-700">
              It becomes more helpful by being less present.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[30px] border border-neutral-200 bg-[#f8f5ef] p-7 sm:p-9">
              <SectionLabel>For who</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
                This is for you if…
              </h2>

              <ul className="mt-7 space-y-4 text-base leading-8 text-neutral-700">
                {forWhoItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-[12px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-base leading-8 text-neutral-500">
                If you’re looking for answers, this may not be for you.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/78 p-7 shadow-[0_8px_30px_rgba(20,20,20,0.03)] sm:p-9">
              <SectionLabel>What it will never do</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
                Boundaries matter here
              </h2>

              <ul className="mt-7 space-y-4 text-base leading-8 text-neutral-700">
                {boundaries.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-[12px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-base leading-8 text-neutral-700">
                You remain the author of your own experience.
              </p>
            </div>
          </div>
        </section>

        <section id="final-cta" className="scroll-mt-24 py-10 md:py-16">
          <div className="rounded-[36px] border border-neutral-900 bg-neutral-900 px-7 py-10 text-white sm:px-10 sm:py-12">
            <div className="max-w-2xl">
              <SectionLabel>Final entry</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                There’s nothing to learn here
              </h2>
              <p className="mt-5 text-lg leading-8 text-neutral-300">
                Just come as you are. Say something. And see what becomes clear.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/chat"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Enter Wisewave
              </Link>

              {quickPrompts.slice(0, 2).map((prompt) => (
                <Link
                  key={prompt}
                  href={toPrefillHref(prompt)}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white/90 transition hover:bg-white/10"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-6 border-t border-neutral-200/80 pt-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">
                Wisewave
              </p>
              <p className="mt-3 max-w-md text-sm leading-7 text-neutral-500">
                A quiet space for reflection, clarity, and inner understanding.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-neutral-500">
              <Link href="/about" className="transition hover:text-neutral-900">
                About
              </Link>
              <Link href="/privacy" className="transition hover:text-neutral-900">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

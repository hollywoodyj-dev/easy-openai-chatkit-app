import Link from "next/link";

const quickPrompts = [
  "I feel overwhelmed",
  "I can’t make a decision",
  "Something keeps repeating",
  "I just need to think clearly",
];

const valueCards = [
  {
    title: "See what you’re carrying",
    body:
      "When things feel unclear or heavy, Wisewave helps you notice what is actually present.",
  },
  {
    title: "Notice patterns without being labeled",
    body:
      "Not analysis. Not diagnosis. Just a gentle way to see what keeps repeating.",
  },
  {
    title: "Stay with one inner thread",
    body:
      "The conversation doesn’t push you forward. It lets something unfold at your own pace.",
  },
];

const isList = [
  "A space for reflection",
  "A quiet conversation",
  "A way to see your inner state more clearly",
];

const isNotList = [
  "Not a coach",
  "Not a therapist",
  "Not giving advice or direction",
];

function encodePrefill(text: string) {
  return `/chat?prefill=${encodeURIComponent(text)}`;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.08em] text-neutral-700 transition hover:text-neutral-900"
          >
            WISEWAVE
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
            <a href="#what-you-can-do" className="transition hover:text-neutral-900">
              What you can do
            </a>
            <a href="#what-it-is" className="transition hover:text-neutral-900">
              What it is
            </a>
            <Link href="/chat" className="transition hover:text-neutral-900">
              Enter chat
            </Link>
          </nav>
        </header>

        <section className="grid min-h-[76vh] items-center gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium tracking-[0.14em] text-neutral-500 uppercase">
              Quiet reflection, low pressure
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-6xl">
              A quiet space to hear your own thoughts more clearly
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 sm:text-xl">
              No advice. No pressure. No direction. Just a place to reflect and
              see what is already there.
            </p>

            <p className="mt-4 text-sm leading-7 text-neutral-500 sm:text-base">
              You don’t need to prepare anything. Just start with what’s on your
              mind.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/chat"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Start a conversation
              </Link>

              <a
                href="#try-it-now"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/70 px-6 text-sm font-medium text-neutral-700 transition hover:bg-white hover:text-neutral-900"
              >
                Start with a prompt
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_10px_40px_rgba(20,20,20,0.04)] backdrop-blur-sm sm:p-7">
            <div className="rounded-[28px] border border-neutral-200 bg-[#fbfaf7] p-5 sm:p-6">
              <p className="text-sm font-medium text-neutral-500">Example opening</p>
              <p className="mt-4 text-lg leading-8 text-neutral-800">
                “I keep telling myself I’m fine, but something still feels tight
                underneath.”
              </p>
              <div className="mt-6 h-px w-full bg-neutral-200" />
              <div className="mt-6 space-y-3 text-sm leading-7 text-neutral-600">
                <p>
                  Wisewave responds with reflection, not instruction.
                </p>
                <p>
                  The aim is not to fix you. It is to help you notice more
                  clearly.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href={encodePrefill(
                    "I keep telling myself I’m fine, but something still feels tight underneath."
                  )}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 px-5 text-sm font-medium text-neutral-700 transition hover:bg-white hover:text-neutral-900"
                >
                  Use this opening
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="what-you-can-do" className="scroll-mt-24 py-8 md:py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.14em] text-neutral-500 uppercase">
              What you can do here
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-4xl">
              A calmer way to reflect
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-white/60 bg-white/75 p-7 shadow-[0_8px_30px_rgba(20,20,20,0.03)]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900">
                  {card.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-neutral-600">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="what-it-is" className="scroll-mt-24 py-12 md:py-16">
          <div className="rounded-[32px] border border-white/60 bg-white/70 p-7 shadow-[0_10px_40px_rgba(20,20,20,0.04)] sm:p-9">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-[0.14em] text-neutral-500 uppercase">
                What Wisewave is
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-4xl">
                Clear enough to trust, quiet enough to stay with
              </h2>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="rounded-[24px] border border-neutral-200 bg-[#fbfaf7] p-6">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-neutral-500">
                  Is
                </p>
                <ul className="mt-5 space-y-4 text-base leading-7 text-neutral-700">
                  {isList.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-neutral-200 bg-[#fbfaf7] p-6">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-neutral-500">
                  Is not
                </p>
                <ul className="mt-5 space-y-4 text-base leading-7 text-neutral-700">
                  {isNotList.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-8 text-lg leading-8 text-neutral-700">
              Nothing here is trying to change you.
            </p>
          </div>
        </section>

        <section id="try-it-now" className="scroll-mt-24 py-8 md:py-14">
          <div className="grid gap-8 rounded-[32px] border border-neutral-200 bg-[#f9f7f2] p-7 sm:p-9 md:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-medium tracking-[0.14em] text-neutral-500 uppercase">
                Try it now
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-4xl">
                Start with something simple
              </h2>
              <p className="mt-4 max-w-lg text-base leading-8 text-neutral-600">
                You can begin with one thought, one feeling, or one thing that
                keeps returning.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgba(20,20,20,0.03)] sm:p-6">
              <div className="rounded-[22px] border border-neutral-200 bg-[#fcfbf8] p-4 sm:p-5">
                <p className="text-sm text-neutral-500">Start here</p>
                <div className="mt-3 rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-base text-neutral-400">
                  What feels present for you right now?
                </div>
                <div className="mt-4">
                  <Link
                    href="/chat"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Continue →
                  </Link>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm text-neutral-500">Or begin with:</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {quickPrompts.map((prompt) => (
                    <Link
                      key={prompt}
                      href={encodePrefill(prompt)}
                      className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                    >
                      {prompt}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-neutral-200/80 pt-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium tracking-[0.12em] text-neutral-700 uppercase">
                Wisewave
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-500">
                A quiet system for inner clarity.
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

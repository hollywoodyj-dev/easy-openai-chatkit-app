import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:px-8">
        <header className="mb-10">
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.08em] text-neutral-700 transition hover:text-neutral-900"
          >
            WISEWAVE
          </Link>
        </header>

        <section className="rounded-[28px] border border-white/60 bg-white/75 p-7 shadow-[0_8px_30px_rgba(20,20,20,0.03)] sm:p-9">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-4xl">
            About Wisewave
          </h1>
          <p className="mt-5 text-base leading-8 text-neutral-700">
            Wisewave is a quiet space to reflect, not a system to guide you.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            It is designed to help you notice what is already present: your thoughts, patterns,
            and inner state, without pressure, diagnosis, or direction.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            The experience is intentionally light. You can begin anywhere, pause anytime, and stay
            with one thread at your own pace.
          </p>

          <div className="mt-8">
            <Link
              href="/chat"
              className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Start a conversation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

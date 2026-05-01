import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 pb-14 pt-10 sm:px-8">
        <header className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.08em] text-neutral-700 transition hover:text-neutral-900"
          >
            WISEWAVE
          </Link>
        </header>

        <section className="rounded-[28px] border border-white/60 bg-white/75 p-7 shadow-[0_8px_30px_rgba(20,20,20,0.03)] sm:p-9">
          <p className="text-sm font-medium tracking-[0.06em] text-neutral-600">
            A note from the founder
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-4xl">
            How Wisewave Was Born
          </h1>
          <p className="mt-5 text-base leading-8 text-neutral-700">
            Wisewave was not created because the world needed another smarter AI.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            It came from a different recognition: that people already live among too many voices,
            too many suggestions, and too many systems telling them how to think, how to live, and
            how to become better. And as all of that increased, it became harder for people to hear
            what was already true within themselves.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            So I did not want to create a more useful assistant. I wanted to create something that
            would not take a person&apos;s inner place away from them — something that could respond
            without taking over, and allow clarity to emerge without claiming authorship.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            That is why Wisewave was designed differently from the beginning. It is not here to
            think for you, decide for you, or quickly turn inner complexity into neat conclusions.
            What matters most is not only what it can do, but what it is willing not to do: not rush
            in, not explain too quickly, not make itself too important.
          </p>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            Wisewave was created to be a quieter kind of presence — one that does not press over
            you, and may help you see a little more clearly.
          </p>

          <div className="mt-8">
            <Link
              href="/about/founder-note"
              className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Read the founder note
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

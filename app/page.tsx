import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F5F2] text-[#1F1F1F]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(200,220,255,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-10 lg:px-12">
        <header className="mb-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/wisewave-logo.png"
              alt="Wisewave"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-2xl"
              priority
            />
            <span className="text-lg font-medium tracking-[0.12em] text-[#5E5E5E]">
              WISEWAVE
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-[#5E5E5E] backdrop-blur-sm">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#A8C3A0]" />
            present
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-[#6F8596]/20 bg-white/70 px-4 py-2 text-[12px] tracking-[0.16em] text-[#6F8596] shadow-sm">
              low presence · human-tech · warm minimal
            </div>
            <h1 className="max-w-3xl text-5xl font-medium leading-[1.06] tracking-[-0.03em] md:text-7xl">
              A quieter kind of intelligence
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5E5E5E] md:text-xl">
              Wisewave is designed to support clarity, continuity, and inner steadiness
              without taking over your process.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-[#6F8596] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px]"
              >
                Begin
              </Link>
              <Link
                href="/chat"
                className="rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-medium text-[#1F1F1F] shadow-sm transition hover:bg-white"
              >
                See how it feels
              </Link>
            </div>
            <p className="mt-5 text-sm text-[#7A7A7A]">
              No pressure. No performance. Just a place to start from what is here.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-[#7C9082]/12 blur-3xl" />
            <div className="absolute -right-6 bottom-4 h-44 w-44 rounded-full bg-[#6F8596]/12 blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border border-black/8 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm tracking-[0.14em] text-[#7A7A7A]">LIVE SPACE</div>
                  <div className="mt-1 text-xl font-medium">Wisewave</div>
                </div>
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D4D0CA]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D4D0CA]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D4D0CA]" />
                </div>
              </div>

              <div className="space-y-4 rounded-[24px] bg-[#FBFAF7] p-4">
                <div className="rounded-[18px] bg-white px-4 py-3 text-[15px] leading-7 text-[#3E3E3E] shadow-sm">
                  I keep feeling like I need to hold everything together.
                </div>

                <div className="rounded-[22px] border border-[#6F8596]/10 bg-white/95 px-5 py-5 shadow-sm">
                  <p className="text-[17px] leading-8 text-[#232323]">
                    There’s something here that still feels a little tight, even if
                    you’re already seeing it more clearly.
                  </p>
                  <div className="my-4 h-px w-12 bg-black/8" />
                  <p className="text-[16px] leading-8 text-[#5A5A5A]">
                    It may not be pulling you in as quickly as before.
                  </p>
                </div>

                <div className="flex items-center gap-3 px-2 pt-1 text-sm text-[#7A7A7A]">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#7C9082]/70" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#7C9082]/50 [animation-delay:180ms]" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#7C9082]/30 [animation-delay:360ms]" />
                  </div>
                  <span>response continues quietly</span>
                </div>

                <div className="rounded-[18px] border border-black/8 bg-white/75 px-4 py-4 shadow-sm">
                  <div className="text-sm text-[#8A8A8A]">What feels most present right now?</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Softer presence",
              body: "Warm off-white surfaces, gentler contrast, and more breathing room make the interface feel less clinical and less cold.",
            },
            {
              title: "Quiet precision",
              body: "Subtle blue-grey accents and restrained motion give it a modern intelligence without becoming loud or overly techy.",
            },
            {
              title: "Human rhythm",
              body: "Fewer blocks, fewer labels, and clearer spacing make the page feel more like a space to stay in than a system to process.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-black/8 bg-white/65 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#5E5E5E]">{item.body}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

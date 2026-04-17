import Link from "next/link";

const navItems = [
  { href: "/what-is-wisewave", label: "What Wisewave Is" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/who-its-for", label: "Who It’s For" },
  { href: "/privacy", label: "Privacy" },
  { href: "/start", label: "Start" },
];

export function WisewaveSiteHeader() {
  return (
    <header className="border-b border-[#e7e1d8] bg-[#f7f5f1]/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-[51rem] items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="text-base font-medium tracking-[-0.02em] text-[#171717]"
        >
          Wisewave
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#5c5c5c] transition hover:text-[#171717]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/start?from=nav"
          className="hidden rounded-full border border-[#e7e1d8] bg-transparent px-4 py-2 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] md:inline-flex"
        >
          Start
        </Link>
      </div>
      <nav
        aria-label="Mobile"
        className="mx-auto flex w-full max-w-[51rem] gap-4 overflow-x-auto px-6 pb-4 sm:px-8 md:hidden"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-sm text-[#5c5c5c] hover:text-[#171717]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

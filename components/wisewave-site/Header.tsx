"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavEnterLink } from "@/components/wisewave-site/NavEnterLink";
import { isPaidLpPath } from "@/lib/wisewave-site/is-paid-lp-path";

const navItems = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-its-for", label: "Who it’s for" },
  { href: "/about/founder-note", label: "Founder note" },
];

export function WisewaveSiteHeader() {
  const pathname = usePathname();
  const showInnerpro = isPaidLpPath(pathname);

  return (
    <header className="border-b border-[#e7e1d8] bg-[#f7f5f1]/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-[51rem] items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <Link
          href="/"
          className={
            showInnerpro
              ? "inline-flex w-fit flex-col items-stretch"
              : "inline-flex items-center"
          }
          aria-label="Wisewave home"
        >
          <Image
            src="/brand/wisewave-text.png"
            alt="Wisewave"
            width={2172}
            height={724}
            className="h-auto w-[140px] object-contain sm:w-[172px]"
            priority
          />
          {showInnerpro ? (
            <span className="mt-1 text-right text-[11px] tracking-[0.08em] text-[#7b746b]">
              by Innerpro
            </span>
          ) : null}
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
        <NavEnterLink
          className="hidden rounded-full border border-[#e7e1d8] bg-transparent px-4 py-2 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] md:inline-flex"
        />
      </div>
      <nav
        aria-label="Mobile"
        className="mx-auto flex w-full max-w-[51rem] items-center gap-4 overflow-x-auto px-6 pb-4 sm:px-8 md:hidden"
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
        <NavEnterLink
          mobile
          className="shrink-0 rounded-full border border-[#e7e1d8] bg-transparent px-4 py-2 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8]"
        />
      </nav>
    </header>
  );
}

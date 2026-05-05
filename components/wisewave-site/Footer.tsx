import Link from "next/link";
import { wisewaveLandingCopy } from "@/lib/wisewave-site/wisewave-landing-copy";

export function WisewaveSiteFooter() {
  const { shortLine, extendedLine } = wisewaveLandingCopy.footer;
  return (
    <footer className="border-t border-[#e7e1d8] py-10">
      <div className="mx-auto flex w-full max-w-[51rem] flex-col gap-6 px-6 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-base font-medium text-[#171717]">{shortLine}</p>
          <p className="mt-2 text-sm leading-7 text-[#5c5c5c]">{extendedLine}</p>
        </div>
        <div className="grid gap-3 text-sm text-[#5c5c5c] sm:grid-cols-2">
          <Link href="/about/founder-note" className="hover:text-[#171717]">
            Founder note
          </Link>
          <Link href="/faq" className="hover:text-[#171717]">
            FAQ
          </Link>
          <Link href="/terms" className="hover:text-[#171717]">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-[#171717]">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

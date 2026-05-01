import Link from "next/link";
import { wisewaveLandingCopy } from "@/lib/wisewave-site/wisewave-landing-copy";

export function WisewaveSiteFooter() {
  const { line, subline } = wisewaveLandingCopy.footer;
  return (
    <footer className="border-t border-[#e7e1d8] py-10">
      <div className="mx-auto flex w-full max-w-[51rem] flex-col gap-6 px-6 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-base font-medium text-[#171717]">{line}</p>
          <p className="mt-2 text-sm leading-7 text-[#5c5c5c]">{subline}</p>
        </div>
        <div className="grid gap-3 text-sm text-[#5c5c5c] sm:grid-cols-2 md:grid-cols-4">
          <Link href="/what-is-wisewave" className="hover:text-[#171717]">
            What Wisewave Is
          </Link>
          <Link href="/how-it-works" className="hover:text-[#171717]">
            How It Works
          </Link>
          <Link href="/what-it-is-not" className="hover:text-[#171717]">
            What It Is Not
          </Link>
          <Link href="/reflection-is-not-advice" className="hover:text-[#171717]">
            Reflection Is Not Advice
          </Link>
          <Link href="/faq" className="hover:text-[#171717]">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:text-[#171717]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#171717]">
            Terms
          </Link>
          <Link
            href="/how-it-works#conversation-handling"
            className="hover:text-[#171717]"
          >
            Conversation handling
          </Link>
          <Link href="/subscribe" className="hover:text-[#171717]">
            Account &amp; subscription
          </Link>
          <a href="mailto:info@wisewave.io" className="hover:text-[#171717]">
            Support
          </a>
          <Link href="/about/founder-note" className="hover:text-[#171717]">
            A note from the founder
          </Link>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  GLOSSARY_ENTRIES,
  glossaryIndexRobots,
} from "@/lib/wisewave-knowledge";

const robots = glossaryIndexRobots(GLOSSARY_ENTRIES);

export const metadata: Metadata = {
  title: "Reflection Glossary (draft) | Wisewave",
  description:
    "Draft glossary index for the Reflection AI knowledge system. Not authorized for public publication.",
  robots: {
    index: robots.index,
    follow: robots.follow,
  },
  alternates: { canonical: "/glossary" },
};

/**
 * Slice 1 shell — unpublished / noindex until Tree publishes ≥1 entry.
 * Locally reviewable; no Production publication authorization.
 */
export default function GlossaryIndexPage() {
  return (
    <article className="mx-auto w-full max-w-[40rem] px-6 py-14 sm:px-8 sm:py-20">
      <p className="text-sm tracking-[0.04em] text-[#8a847a]">
        Glossary · draft · not published
      </p>
      <h1 className="mt-4 text-[1.85rem] font-medium leading-[1.25] tracking-[-0.03em] text-[#171717] sm:text-[2.2rem]">
        Reflection Glossary
      </h1>
      <p className="mt-6 text-[16px] leading-[1.75] text-[#5c5c5c]">
        This index is infrastructure for the Reflection AI knowledge system. Entries
        remain unpublished until Aurora semantic review, Lumen QA, and Tree
        Production authorization.
      </p>
      <ul className="mt-10 space-y-3">
        {GLOSSARY_ENTRIES.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={entry.canonical_path}
              className="text-[16px] text-[#171717] underline-offset-4 hover:underline"
            >
              {entry.title}
            </Link>
            <span className="ml-2 text-sm text-[#8a847a]">
              {entry.published ? "published" : "unpublished"}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

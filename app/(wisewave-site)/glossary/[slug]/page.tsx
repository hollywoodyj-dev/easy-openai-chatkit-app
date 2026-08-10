import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GLOSSARY_ENTRIES,
  getGlossaryEntry,
  glossaryRobots,
  listGlossarySlugs,
} from "@/lib/wisewave-knowledge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) {
    return { title: "Glossary | Wisewave", robots: { index: false, follow: false } };
  }
  const robots = glossaryRobots(entry);
  return {
    title: entry.meta_title,
    description: entry.meta_description,
    robots: { index: robots.index, follow: robots.follow },
    alternates: { canonical: entry.canonical_path },
  };
}

/**
 * Slice 1 glossary entry shell — stubs only; robots noindex while unpublished.
 */
export default async function GlossaryEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) notFound();

  return (
    <article className="mx-auto w-full max-w-[40rem] px-6 py-14 sm:px-8 sm:py-20">
      <p className="text-sm tracking-[0.04em] text-[#8a847a]">
        Glossary · {entry.published ? "published" : "draft · not published"}
      </p>
      <h1 className="mt-4 text-[1.85rem] font-medium leading-[1.25] tracking-[-0.03em] text-[#171717] sm:text-[2.2rem]">
        {entry.title}
      </h1>
      {entry.short_definition ? (
        <p className="mt-6 text-[17px] leading-[1.8] text-[#4a4a4a]">
          {entry.short_definition}
        </p>
      ) : (
        <p className="mt-6 text-[16px] leading-[1.75] text-[#5c5c5c]">
          Stub entry for architecture review. Body copy is not authorized until
          Aurora + Tree publication gates.
        </p>
      )}
      {entry.full_definition ? (
        <div className="mt-8 space-y-4 text-[16px] leading-[1.8] text-[#4a4a4a]">
          {entry.full_definition.split("\n\n").map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      ) : null}
      <p className="mt-12 text-sm text-[#8a847a]">
        <Link href="/glossary" className="underline-offset-4 hover:underline">
          Glossary index
        </Link>
        {" · "}
        <Link
          href="/reflection-ai"
          className="underline-offset-4 hover:underline"
        >
          Reflection AI
        </Link>
      </p>
      {!entry.published ? (
        <p className="mt-6 text-xs text-[#9a948a]">
          robots: noindex · sitemap: excluded · registry count check:{" "}
          {GLOSSARY_ENTRIES.length} stubs
        </p>
      ) : null}
    </article>
  );
}

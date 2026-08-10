import type { GlossaryEntry, KnowledgePillar } from "../types";

function stub(args: {
  slug: string;
  title: string;
  related_pillar: KnowledgePillar | null;
  related_terms?: string[];
}): GlossaryEntry {
  return {
    slug: args.slug,
    title: args.title,
    short_definition: "",
    full_definition: "",
    reflection_perspective: "",
    common_misunderstanding: "",
    related_terms: args.related_terms ?? [],
    related_articles: [],
    related_pillar: args.related_pillar,
    canonical_path: `/glossary/${args.slug}`,
    meta_title: `${args.title} | Wisewave Glossary (draft)`,
    meta_description: "Draft glossary stub — not authorized for public publication.",
    schema_type: "none",
    review_status: "draft",
    semantic_review: "pending",
    qa_status: "pending",
    published: false,
    published_at: null,
    updated_at: null,
  };
}

/** First-10 glossary stubs — titles/slugs only; all unpublished. */
export const GLOSSARY_ENTRIES: readonly GlossaryEntry[] = [
  stub({
    slug: "reflection",
    title: "Reflection",
    related_pillar: "language",
    related_terms: ["reflection-ai", "self-reflection", "rumination"],
  }),
  stub({
    slug: "reflection-ai",
    title: "Reflection AI",
    related_pillar: "theory",
    related_terms: ["reflection", "low-presence", "authorship"],
  }),
  stub({
    slug: "self-reflection",
    title: "Self-Reflection",
    related_pillar: "theory",
    related_terms: ["reflection", "reflection-ai"],
  }),
  stub({
    slug: "insight",
    title: "Insight",
    related_pillar: "language",
    related_terms: ["meaning", "pattern"],
  }),
  stub({
    slug: "pattern",
    title: "Pattern",
    related_pillar: "language",
    related_terms: ["insight", "meaning"],
  }),
  stub({
    slug: "meaning",
    title: "Meaning",
    related_pillar: "language",
    related_terms: ["insight", "pattern"],
  }),
  stub({
    slug: "rumination",
    title: "Rumination",
    related_pillar: "psychology",
    related_terms: ["reflection", "attention"],
  }),
  stub({
    slug: "attention",
    title: "Attention",
    related_pillar: "language",
    related_terms: ["low-presence", "reflection"],
  }),
  stub({
    slug: "authorship",
    title: "Authorship",
    related_pillar: "language",
    related_terms: ["low-presence", "reflection-ai"],
  }),
  stub({
    slug: "low-presence",
    title: "Low Presence",
    related_pillar: "language",
    related_terms: ["authorship", "reflection-ai"],
  }),
] as const;

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY_ENTRIES.find((e) => e.slug === slug);
}

export function listGlossarySlugs(): string[] {
  return GLOSSARY_ENTRIES.map((e) => e.slug);
}

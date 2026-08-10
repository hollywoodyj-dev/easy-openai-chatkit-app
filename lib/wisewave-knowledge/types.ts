/**
 * Wisewave Knowledge System — Phase 2 Slice 1 types.
 * File-based; no CMS / DB. Public publish requires Tree Production auth.
 */

export type KnowledgePillar =
  | "theory"
  | "psychology"
  | "practice"
  | "language";

export type ReviewStatus =
  | "draft"
  | "aurora_review"
  | "lumen_qa"
  | "tree_ready"
  | "published";

export type SemanticReviewState = "pending" | "pass" | "fail" | "grandfathered";
export type QaStatus = "pending" | "pass" | "fail" | "grandfathered";

export type GlossaryEntry = {
  slug: string;
  title: string;
  short_definition: string;
  full_definition: string;
  reflection_perspective: string;
  common_misunderstanding: string;
  related_terms: string[];
  related_articles: string[];
  related_pillar: KnowledgePillar | null;
  canonical_path: string;
  meta_title: string;
  meta_description: string;
  schema_type: "DefinedTerm" | "none";
  review_status: ReviewStatus;
  semantic_review: SemanticReviewState;
  qa_status: QaStatus;
  /** Hard gate for sitemap + robots indexability. Slice 1: all false. */
  published: boolean;
  published_at: string | null;
  updated_at: string | null;
};

export type KnowledgeArticleMeta = {
  slug: string;
  title: string;
  description: string;
  primary_question: string | null;
  primary_distinction: string | null;
  pillar: KnowledgePillar | null;
  related_terms: string[];
  related_articles: string[];
  original_phrase: string | null;
  open_ending: string | null;
  author: string;
  review_status: ReviewStatus;
  semantic_review: SemanticReviewState;
  qa_status: QaStatus;
  /** Immutable without Tree auth — points at existing Production path. */
  canonical_path: string;
  published: boolean;
  published_at: string | null;
  updated_at: string | null;
  writing_constitution: "v1_required" | "legacy_protected";
};

export type HubConfig = {
  canonical_path: "/reflection-ai";
  selected_reading: { articleSlug: string }[];
  glossary_highlights: string[];
  faq_path: "/faq";
  identity_correction_path: "/reflection-without-advice";
  research_path: null;
};

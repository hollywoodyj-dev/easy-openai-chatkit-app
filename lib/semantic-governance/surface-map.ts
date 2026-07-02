/**
 * Surface permission map — Semantic Governance Lock v1.1.
 * Maps repo paths to surface IDs and tiers for validation.
 */

export type SurfaceTier = "identity-sensitive" | "acquisition-sensitive";

export type SurfaceId =
  | "homepage"
  | "onboarding"
  | "product_interior"
  | "source_of_truth_docs"
  | "internal_specs"
  | "paid_landing"
  | "seo_landing"
  | "store_metadata"
  | "comparison_pages"
  | "external_materials";

export type SurfaceDefinition = {
  id: SurfaceId;
  tier: SurfaceTier;
  /** Normalized path fragments (forward slashes, lowercase). */
  pathFragments: readonly string[];
};

export const SURFACE_DEFINITIONS: readonly SurfaceDefinition[] = [
  {
    id: "homepage",
    tier: "identity-sensitive",
    pathFragments: ["app/(wisewave-site)/page.tsx", "wisewave-landing-copy"],
  },
  {
    id: "onboarding",
    tier: "identity-sensitive",
    pathFragments: [
      "app/(wisewave-site)/start/",
      "pages/login.tsx",
      "pages/register",
      "pages/api/auth/",
    ],
  },
  {
    id: "product_interior",
    tier: "identity-sensitive",
    pathFragments: ["app/chat/", "app/subscribe/"],
  },
  {
    id: "source_of_truth_docs",
    tier: "identity-sensitive",
    pathFragments: ["agents.md", "docs/wisewave_semantic_governance"],
  },
  {
    id: "internal_specs",
    tier: "identity-sensitive",
    pathFragments: ["docs/hc_os", "docs/hc-os"],
  },
  {
    id: "paid_landing",
    tier: "acquisition-sensitive",
    pathFragments: [
      "app/(wisewave-site)/lp/",
      "wisewave-paid-landing-copy",
      "wisewave-paid-landing-metadata",
    ],
  },
  {
    id: "seo_landing",
    tier: "acquisition-sensitive",
    pathFragments: [
      "wisewave-marketing-seo-metadata",
      "wisewave-reflection-without-advice-cluster",
      "wisewave-marketing-faq-items",
      "app/(wisewave-site)/reflection-ai/",
      "app/(wisewave-site)/self-reflection-app/",
      "app/(wisewave-site)/journaling-alternative/",
      "app/(wisewave-site)/reflection-without-advice/",
      "app/(wisewave-site)/quiet-reflection/",
      "app/(wisewave-site)/what-is-wisewave/",
      "app/(wisewave-site)/how-it-works/",
      "app/(wisewave-site)/who-its-for/",
      "app/(wisewave-site)/what-it-is-not/",
      "app/(wisewave-site)/why-people-come-back/",
      "app/(wisewave-site)/faq/",
      "app/(wisewave-site)/app/",
    ],
  },
  {
    id: "store_metadata",
    tier: "acquisition-sensitive",
    pathFragments: [
      "wisewave_app_store_and_play_listing_copy",
      "mobile/app.json",
    ],
  },
  {
    id: "comparison_pages",
    tier: "acquisition-sensitive",
    pathFragments: [
      "reflection-without-advice-vs-coaching",
      "what-ai-reflection-without-advice-means",
      "self-reflection-without-guidance",
    ],
  },
  {
    id: "external_materials",
    tier: "acquisition-sensitive",
    pathFragments: [],
  },
];

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/").toLowerCase();
}

/** Returns all matching surfaces for a repo-relative file path. */
export function getSurfacesForFile(filePath: string): SurfaceId[] {
  const normalized = normalizePath(filePath);
  const matched = SURFACE_DEFINITIONS.filter((def) =>
    def.pathFragments.some((frag) => normalized.includes(frag.toLowerCase())),
  ).map((def) => def.id);
  return matched.length > 0 ? matched : ["seo_landing"];
}

export function getSurfaceTier(surfaceId: SurfaceId): SurfaceTier {
  const def = SURFACE_DEFINITIONS.find((d) => d.id === surfaceId);
  return def?.tier ?? "acquisition-sensitive";
}

export function isIdentitySensitiveSurface(surfaceId: SurfaceId): boolean {
  return getSurfaceTier(surfaceId) === "identity-sensitive";
}

export function fileHasIdentitySensitiveSurface(filePath: string): boolean {
  return getSurfacesForFile(filePath).some(isIdentitySensitiveSurface);
}

export function fileHasAcquisitionSurface(filePath: string): boolean {
  return getSurfacesForFile(filePath).some(
    (id) => getSurfaceTier(id) === "acquisition-sensitive",
  );
}

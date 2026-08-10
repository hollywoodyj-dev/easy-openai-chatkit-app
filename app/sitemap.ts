import type { MetadataRoute } from "next";
import { mergeSitemapPaths } from "@/lib/wisewave-knowledge/sitemap-paths";

const SITE = "https://www.wisewave.io";

/** Marketing + SEO + public legal routes (indexable; no /internal, /api, /chat). */
const PATHS: string[] = [
  "/",
  "/start",
  "/app",
  "/what-is-wisewave",
  "/how-it-works",
  "/who-its-for",
  "/what-it-is-not",
  "/why-people-come-back",
  "/faq",
  "/privacy",
  "/terms",
  "/reflection-ai",
  "/self-reflection-app",
  "/reflection-without-advice",
  "/reflection-without-advice-vs-coaching",
  "/what-ai-reflection-without-advice-means",
  "/self-reflection-without-guidance",
  "/quiet-reflection",
  "/journaling-alternative",
  "/articles/dont-come-with-a-question",
  "/articles/how-to-ask-without-giving-away-your-knowing",
  "/about",
  "/about/founder-note",
  "/legal/privacy",
  "/legal/data-deletion",
];

/** Exported for tests — marketing PATHS only (no unpublished glossary). */
export function getMarketingSitemapBasePaths(): readonly string[] {
  return PATHS;
}

export function buildSitemapPaths(): string[] {
  return mergeSitemapPaths(PATHS);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return buildSitemapPaths().map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/reflection-without-advice"
          ? 0.9
          : path.startsWith("/reflection") ||
              path.includes("journal") ||
              path === "/quiet-reflection" ||
              path === "/what-ai-reflection-without-advice-means" ||
              path === "/self-reflection-without-guidance"
            ? 0.75
            : 0.8,
  }));
}

import type { MetadataRoute } from "next";

const SITE = "https://www.wisewave.io";

/** Marketing + SEO + public legal routes (indexable; no /internal, /api, /chat). */
const PATHS: string[] = [
  "/",
  "/start",
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
  "/quiet-reflection",
  "/journaling-alternative",
  "/about",
  "/about/founder-note",
  "/legal/privacy",
  "/legal/data-deletion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/reflection") ||
            path.includes("journal") ||
            path === "/quiet-reflection"
          ? 0.85
          : 0.8,
  }));
}

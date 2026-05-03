import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/internal/",
          "/api/",
          "/agent-tasks",
          "/agent-tasks/",
          "/embed",
          "/chat",
          "/admin",
          "/account",
        ],
      },
    ],
    sitemap: "https://www.wisewave.io/sitemap.xml",
  };
}

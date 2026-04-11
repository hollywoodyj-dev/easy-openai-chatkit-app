import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wisewave",
    short_name: "Wisewave",
    description:
      "A quieter kind of intelligence — clarity, continuity, and inner steadiness without taking over your process.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F2",
    theme_color: "#6F8596",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

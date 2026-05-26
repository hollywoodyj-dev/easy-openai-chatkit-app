import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/reflection-is-not-advice",
        destination: "/reflection-without-advice",
        permanent: true,
      },
      {
        source: "/ai-reflection-tool",
        destination: "/lp/ai-reflection",
        permanent: false,
      },
      {
        source: "/embed",
        destination: "/chat",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
      // /embed-mobile CSP is set only in middleware so we can strip any other CSP and set one permissive policy (no merge conflict).
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },
};

export default nextConfig;

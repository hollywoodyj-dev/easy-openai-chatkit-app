import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        source: "/embed-mobile",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "frame-ancestors *",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.platform.openai.com",
              "connect-src 'self' https://api.openai.com https://cdn.platform.openai.com",
              "frame-src 'self' https://cdn.platform.openai.com",
            ].join("; "),
          },
        ],
      },
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

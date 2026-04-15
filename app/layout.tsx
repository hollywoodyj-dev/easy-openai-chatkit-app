import Script from "next/script";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Wisewave",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  title: {
    default: "Wisewave — A Quiet Space for Reflection and Inner Clarity",
    template: "%s · Wisewave",
  },
  description:
    "Wisewave is a reflective AI for overthinking and inner noise. It helps you gain clarity and self-understanding without advice, coaching, or direction.",
  keywords: [
    "self reflection AI",
    "reflective AI",
    "overthinking",
    "inner clarity",
    "self-understanding",
    "clarity thinking tool",
    "no advice AI",
    "not coaching AI",
    "not advice chatbot",
    "consciousness reflection"
  ],
  openGraph: {
    title: "Wisewave — Reflection Without Advice",
    description:
      "For reflection, overthinking, and inner clarity. Wisewave helps you see clearly without advice, coaching, or pressure.",
    type: "website",
    url: "https://wisewave.io",
    siteName: "Wisewave",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisewave — Reflection Without Advice",
    description:
      "A reflective AI for inner clarity and self-understanding. No coaching, no advice, no pressure.",
  },
  appleWebApp: {
    capable: true,
    title: "Wisewave",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased min-h-[100dvh] bg-white">{children}</body>
    </html>
  );
}

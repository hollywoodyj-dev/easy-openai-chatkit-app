import Script from "next/script";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Wisewave",
  title: {
    default: "Wisewave",
    template: "%s · Wisewave",
  },
  description:
    "Wisewave — a quieter kind of intelligence: clarity, continuity, and inner steadiness without taking over your process.",
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

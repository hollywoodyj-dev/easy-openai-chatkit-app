import Script from "next/script";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wisewave.io"),
  applicationName: "Wisewave",
  icons: {
    icon: [
      { url: "/brand/wisewave-app-logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  title: {
    default: "Wisewave — A quieter space for reflection",
    template: "%s · Wisewave",
  },
  description:
    "Wisewave is a low-presence reflection space. Not here to give answers, advice, or coaching — it leaves more room for reflection.",
  keywords: [
    "reflection space",
    "low-presence AI",
    "non-directive reflection",
    "not an AI assistant",
    "quiet reflection",
    "Wisewave",
  ],
  openGraph: {
    title: "Wisewave — A quieter space for reflection",
    description:
      "A low-presence reflection space. Not advice, not coaching, not therapy.",
    type: "website",
    url: "https://www.wisewave.io",
    siteName: "Wisewave",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisewave — A quieter space for reflection",
    description:
      "A low-presence reflection space. Not advice, not coaching, not therapy.",
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

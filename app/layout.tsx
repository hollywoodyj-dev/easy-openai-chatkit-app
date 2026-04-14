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
    default: "Wisewave — A Quiet Space for Clear Thinking",
    template: "%s · Wisewave",
  },
  description:
    "Wisewave is not a chatbot or coaching AI. It reflects your thoughts without giving advice, helping you see clearly without being guided or controlled.",
  keywords: [
    "self reflection AI",
    "clarity thinking tool",
    "no advice AI",
    "consciousness reflection",
    "inner clarity",
  ],
  openGraph: {
    title: "Wisewave — A Quiet Space for Clear Thinking",
    description:
      "Not here to give you answers. Wisewave reflects your thoughts without advice, pressure, or direction.",
    type: "website",
    url: "https://wisewave.io",
    siteName: "Wisewave",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisewave — A Quiet Space for Clear Thinking",
    description:
      "Wisewave reflects your thoughts without giving advice, helping you see clearly without being guided or controlled.",
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

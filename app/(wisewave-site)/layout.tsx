import { Inter } from "next/font/google";
import { MarketingSiteAnalytics } from "@/components/wisewave-site/MarketingSiteAnalytics";
import { MarketingSiteWideJsonLd } from "@/components/wisewave-site/MarketingSiteWideJsonLd";
import { MobileOpenAppBanner } from "@/components/wisewave-site/MobileOpenAppBanner";
import { WisewaveSiteFooter } from "@/components/wisewave-site/Footer";
import { WisewaveSiteHeader } from "@/components/wisewave-site/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-wisewave-site",
});

export default function WisewaveSiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-[#f7f5f1] text-[#171717] antialiased`}
    >
      <MarketingSiteAnalytics />
      <MarketingSiteWideJsonLd />
      <MobileOpenAppBanner />
      <WisewaveSiteHeader />
      <main>{children}</main>
      <WisewaveSiteFooter />
    </div>
  );
}

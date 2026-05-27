import Script from "next/script";
import { getGa4MeasurementId } from "@/lib/wisewave-conversion-tracking";

/** Loads GA4 gtag when NEXT_PUBLIC_GA_MEASUREMENT_ID is set. */
export function GoogleAnalytics() {
  const measurementId = getGa4MeasurementId();
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="wisewave-ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}

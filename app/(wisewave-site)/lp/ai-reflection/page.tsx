import { PaidLandingShell } from "@/components/wisewave-site/PaidLandingShell";
import { PAID_LANDING_AI_REFLECTION } from "@/lib/wisewave-site/wisewave-paid-landing-copy";
import { wisewavePaidLandingMetadata } from "@/lib/wisewave-site/wisewave-paid-landing-metadata";

export const metadata = wisewavePaidLandingMetadata("AI reflection | Wisewave");

export default function PaidAiReflectionPage() {
  return <PaidLandingShell config={PAID_LANDING_AI_REFLECTION} />;
}

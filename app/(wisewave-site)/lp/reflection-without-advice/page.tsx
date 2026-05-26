import { PaidLandingShell } from "@/components/wisewave-site/PaidLandingShell";
import { PAID_LANDING_REFLECTION_WITHOUT_ADVICE } from "@/lib/wisewave-site/wisewave-paid-landing-copy";
import { wisewavePaidLandingMetadata } from "@/lib/wisewave-site/wisewave-paid-landing-metadata";

export const metadata = wisewavePaidLandingMetadata(
  "Reflection without advice | Wisewave",
);

export default function PaidReflectionWithoutAdvicePage() {
  return <PaidLandingShell config={PAID_LANDING_REFLECTION_WITHOUT_ADVICE} />;
}

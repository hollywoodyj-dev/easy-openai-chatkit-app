import { PaidLandingShell } from "@/components/wisewave-site/PaidLandingShell";
import { PAID_LANDING_SELF_REFLECTION } from "@/lib/wisewave-site/wisewave-paid-landing-copy";
import { wisewavePaidLandingMetadata } from "@/lib/wisewave-site/wisewave-paid-landing-metadata";

export const metadata = wisewavePaidLandingMetadata(
  "Self reflection app | Wisewave",
);

export default function PaidSelfReflectionAppPage() {
  return <PaidLandingShell config={PAID_LANDING_SELF_REFLECTION} />;
}

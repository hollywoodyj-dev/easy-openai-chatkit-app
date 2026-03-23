import Link from "next/link";

export const metadata = {
  title: "Milestone H — Observation (internal)",
  robots: { index: false, follow: false },
};

export default function HObservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <header className="mb-6 border-b border-neutral-300 pb-4 dark:border-neutral-700">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          Internal — Milestone H observation support (Nova v1)
        </p>
        <h1 className="text-xl font-semibold mt-1">H observation queue</h1>
        <nav className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link className="underline" href="/internal/h-observation/queue">
            Queue
          </Link>
          <Link className="underline" href="/internal/h-observation/summary">
            Daily summary
          </Link>
          <Link className="underline" href="/chat">
            /chat
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}

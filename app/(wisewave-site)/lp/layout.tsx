import type { Metadata } from "next";

/** All /lp/* routes: conversion-only, never indexed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PaidLandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

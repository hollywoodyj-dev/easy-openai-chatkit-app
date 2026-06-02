/**
 * One-off: desktop + mobile screenshots for /lp Innerpro branding QA.
 * Usage: node scripts/capture-paid-lp-screenshots.mjs [baseUrl]
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3000";
const path = "/lp/self-reflection-app";
const outDir = "docs/paid-lp-innerpro-branding";

const shots = [
  { name: "desktop-above-fold", width: 1280, height: 900 },
  { name: "mobile-above-fold", width: 390, height: 844 },
];

const browser = await chromium.launch();
const page = await browser.newPage();

await mkdir(outDir, { recursive: true });

for (const shot of shots) {
  await page.setViewportSize({ width: shot.width, height: shot.height });
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const file = `${outDir}/${shot.name}.png`;
  await page.screenshot({ path: file, fullPage: false });
  console.log(`Wrote ${file}`);
}

await browser.close();

import type { AppProps } from "next/app";
import Head from "next/head";
import "@/app/globals.css";

export default function PagesApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Wisewave</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta
          name="description"
          content="Wisewave — a quieter kind of intelligence: clarity, continuity, and inner steadiness without taking over your process."
        />
        <meta name="application-name" content="Wisewave" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Wisewave" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

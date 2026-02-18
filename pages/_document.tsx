import type { DocumentContext, DocumentInitialProps } from "next/document";
import { Html, Head, Main, NextScript } from "next/document";

const CHATKIT_SCRIPT_URL =
  "https://cdn.platform.openai.com/deployments/chatkit/chatkit.js";

type DocumentProps = DocumentInitialProps & { pathname?: string };

export default function Document({ pathname, ...rest }: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        {pathname === "/embed-mobile" && (
          <script src={CHATKIT_SCRIPT_URL} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (
  ctx: DocumentContext
): Promise<DocumentProps> => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);
  return { ...initialProps, pathname: ctx.pathname };
};

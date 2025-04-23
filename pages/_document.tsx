import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add any additional meta tags, links, or scripts here */}
        <meta name="application-name" content="Dashboard Portal" />
        <meta name="description" content="Dashboard for link building and reporting" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
      <Html lang="en">
      <Head>
        <meta name="description" content="Name of your web site" />
        <meta name="author" content="Marketify" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
      </Head>
        <body>
          <div id="animateTextRoot"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

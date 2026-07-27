import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

interface DocumentProps {
  isRedesignRoute: boolean;
}

/**
 * `scroll-smooth` (Tailwind's `scroll-behavior: smooth`) has to live on
 * `<html>` to affect whole-document/anchor-link scrolling, but this file is
 * shared by every route in the pages router — the old homepage, `/blog`,
 * and `/admin` must not pick up smooth-scroll behavior they were never
 * designed around. `getInitialProps` gives us `ctx.pathname` at render time
 * (works for both SSR and the `/redesign` route's SSG build), so the class
 * is only added there. `motion-safe:` keeps it off entirely for
 * `prefers-reduced-motion: reduce`, matching this project's existing
 * pattern (`ThemeToggle`, tagline rotation) of respecting that preference.
 *
 * `data-route="redesign"` is a second, unrelated route marker: the legacy
 * jQuery theme's global stylesheet (`public/css/style.css`, loaded for
 * every route via `_app.tsx`) sets `overflow-x: hidden` on `html`/`body`,
 * which silently breaks `position: sticky` for `Header.tsx`'s sidebar (the
 * browser falls back to treating it as `static`). `styles/globals.css` uses
 * this attribute to restore `overflow` to `visible` on `/redesign` only —
 * see the comment there for the full explanation.
 */
export default function Document({ isRedesignRoute }: DocumentProps) {
    return (
      <Html
        lang="en"
        className={isRedesignRoute ? 'motion-safe:scroll-smooth' : undefined}
        data-route={isRedesignRoute ? 'redesign' : undefined}
      >
      <Head>
        {/* Blocking inline script: sets the `dark` class on <html> before paint to
            prevent a flash of the wrong theme. Must run before any stylesheet.
            Reads an explicit user choice from localStorage first, falling back to
            the OS-level color-scheme preference on first visit. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
        <meta name="description" content="Name of your web site" />
        <meta name="author" content="Marketify" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </Head>
        <body>
          <div id="animateTextRoot"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

Document.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await NextDocument.getInitialProps(ctx);
  return { ...initialProps, isRedesignRoute: ctx.pathname === '/redesign' };
};

import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

interface DocumentProps {
  appliesRedesignSystem: boolean;
}

/**
 * `scroll-smooth` (Tailwind's `scroll-behavior: smooth`) has to live on
 * `<html>` to affect whole-document/anchor-link scrolling, but this file is
 * shared by every route in the pages router — `/admin` must not pick up
 * smooth-scroll behavior it was never designed around.
 * `getInitialProps` gives us `ctx.pathname` at render time (works for SSR,
 * the homepage's SSG build, and `/blog`'s SSG/ISR build), so the
 * class is only added on routes that have opted into the redesign system
 * (`/` as of #17's cutover, plus `/blog`, `/blog/[slug]` — see #60, and
 * `/redesign` while it remains a redirect). `motion-safe:` keeps it
 * off entirely for `prefers-reduced-motion: reduce`, matching this
 * project's existing pattern (`ThemeToggle`, tagline rotation) of
 * respecting that preference.
 *
 * `data-route="redesign"` scopes redesign-only global CSS to the homepage and
 * blog routes without leaking those rules into the admin panel.
 */
export default function Document({ appliesRedesignSystem }: DocumentProps) {
  return (
    <Html
      lang="en"
      className={appliesRedesignSystem ? 'motion-safe:scroll-smooth' : undefined}
      data-route={appliesRedesignSystem ? 'redesign' : undefined}
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
        <meta name="description" content="Personal site and blog of Laud Tetteh." />
        <meta name="author" content="Laud Tetteh" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// `/` is included as of the homepage cutover (#17) — it now renders
// RedesignLayout, so it needs the same treatment as the other redesign-system
// routes. `/redesign` stays listed while it remains a redirect to `/`.
const REDESIGN_SYSTEM_PATHNAMES = ['/', '/redesign', '/blog', '/blog/[slug]'];

Document.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await NextDocument.getInitialProps(ctx);
  return { ...initialProps, appliesRedesignSystem: REDESIGN_SYSTEM_PATHNAMES.includes(ctx.pathname) };
};

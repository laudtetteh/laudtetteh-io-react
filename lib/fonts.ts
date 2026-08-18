import localFont from 'next/font/local';

/**
 * Self-hosted Inter Variable, not `next/font/google`'s `Inter`.
 *
 * Google Fonts' hosted Inter build (what `next/font/google` fetches) strips
 * the OpenType character-variant/stylistic-set GSUB tables entirely — no
 * `cv01`-`cv11`, no `ss01`-`ss04`, verified via `fonttools` on the actual
 * downloaded `.woff2` (only `calt`, `ccmp`, `dnom`, `frac`, `locl`, `numr`,
 * `pnum`, `tnum` remained). The reference site's font file has the full
 * set. Setting `font-feature-settings: "cv02", "cv11", "ss03"` in CSS
 * against the Google Fonts build was a silent no-op — the browser had
 * nothing to substitute, because the requested glyph variants didn't exist
 * in that file at all. Not a CSS bug; a font-source bug.
 *
 * Fixed by self-hosting Inter's own official `InterVariable.woff2`/
 * `InterVariable-Italic.woff2` (from https://github.com/rsms/inter/releases,
 * SIL OFL-1.1 licensed, see `./fonts/LICENSE.txt`) via `next/font/local`
 * instead. Verified: contains the full `cv01`-`cv14`/`ss01`-`ss08` set.
 * One variable file per style covers the whole weight axis (100-900), so
 * there's no separate per-weight file list to maintain.
 */
export const inter = localFont({
  src: [
    { path: './fonts/InterVariable.woff2', style: 'normal' },
    { path: './fonts/InterVariable-Italic.woff2', style: 'italic' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

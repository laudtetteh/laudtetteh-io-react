import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { useRotatingText } from './hooks/useRotatingText';

/**
 * Rotating taglines — `DOSSIER.md` §12.1 replacement set, verbatim. Both
 * directions: change one and re-sync the other.
 *
 * §12.1 was corrected at source on 2026-08-27 to drop Terraform, Next.js and
 * FastAPI, which §10.4 bars as *claimed* skills. A tagline is a bare keyword
 * line with no room for context, so it is a claim surface; those three remain
 * accurate and permitted inside project descriptions as system composition.
 *
 * Every term is explicitly rated in §10.1: Docker, GitHub Actions, CI/CD
 * architecture, Drupal/PHP, Laravel and GA4/DataLayer as Strong; WordPress
 * multisite as Working; React as defendable and sourced from the hand-written
 * Salesforce work (`SF-APP-01`, `SF-DATA-01`), not the AI-assisted projects.
 * "Deployment Automation" is `SF-CI-06`/`SF-CI-07`; "Release Engineering"
 * is `SF-LEAD-01`. §12.1 deduplicated these on 2026-08-27 so "Release
 * Engineering" appears once, not twice.
 *
 * `Agentic AI · LLM Tooling · Open Source` added 2026-09-06 with the
 * hybrid-engineer re-sequencing. All three terms are on §13's defensible list,
 * and it is placed third so the rotation reads as an arc — platform, then the
 * twelve years, then where that experience is now pointed. Deliberately no
 * model or vendor names: §10.4's rule is that a tool present in a system you
 * work on is not a skill you can defend.
 */
export const TAGLINES = [
  'Platform & Web Engineering',
  '12+ Years Building for the Web',
  'Agentic AI · LLM Tooling · Open Source',
  'CI/CD · Docker · GitHub Actions · Deployment Automation',
  'Drupal 10 · WordPress Multisite · Laravel · React',
  'Observability · Release Engineering · Incident Response',
  'Analytics Engineering · GA4 · DataLayer',
];

export const TAGLINE_INTERVAL_MS = 4000;

interface SiteIdentityProps {
  /**
   * Element for the name. `h1` on the homepage, where `Header` supplies the
   * page's only h1; `p` on blog routes, which each carry their own page-level
   * h1 (the archive's "Blog", the post title on `[slug]`). A second h1 there
   * would leave every blog page with two, breaking the single-h1 convention
   * the rest of the redesign follows.
   */
  nameAs: 'h1' | 'p';
  /** `#header` on the single-page homepage; `/` from any other route. */
  nameHref: string;
}

/**
 * Name, role line and rotating tagline — the shared brand block at the top of
 * every sticky sidebar (#117 item 9).
 *
 * Extracted from `Header.tsx` so the homepage and the blog routes render one
 * identity rather than two that drift. They already had: the blog sidebar
 * showed a bare "Software Engineer" and no tagline at all, while the homepage
 * had moved on twice. Anything shown here appears on **every** page, so it is
 * governed by the dossier — see the `TAGLINES` note above before editing.
 */
export default function SiteIdentity({ nameAs, nameHref }: SiteIdentityProps) {
  const { text: tagline, visible: taglineVisible } = useRotatingText(TAGLINES, TAGLINE_INTERVAL_MS);
  const NameTag = nameAs;
  const isAnchor = nameHref.startsWith('#');

  return (
    <div>
      <NameTag className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
        {isAnchor ? <a href={nameHref}>Laud Tetteh</a> : <Link href={nameHref}>Laud Tetteh</Link>}
      </NameTag>

      {/*
        A trade descriptor, not a job title. `DOSSIER.md` §12.1 ruling
        2026-09-05: the site's role line is "Full Stack Software Engineer",
        while the exact employer title `Software Engineer (MTS)` stays on the
        Experience entry — that is what a reference check verifies.
        The rule that has not changed: never "Senior", "Lead", "Staff" or
        "Principal".
      */}
      <p className="mt-2 text-base font-medium leading-snug tracking-tight text-slate-700 dark:text-slate-300 sm:mt-3 sm:text-xl">
        Full Stack Software Engineer
      </p>

      <p
        aria-live="polite"
        className={classNames(
          // min-h reserves three lines so the rotation never shifts layout.
          // Measured: the longest tagline ('Observability · Release
          // Engineering · Incident Response') wraps to 2 lines / 40px at
          // 375px and above, but to 3 lines / 60px at 320px. 2.5rem was
          // enough for the 375px case only, and responsive.spec.ts tests
          // 375, so CI would not have caught the 320px shift.
          'mt-2 min-h-[3rem] max-w-none text-sm font-medium text-teal-700 transition-opacity duration-200 dark:text-teal-400 motion-reduce:transition-none sm:mt-3 sm:min-h-[3.75rem] sm:max-w-xs',
          taglineVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {tagline}
      </p>
    </div>
  );
}

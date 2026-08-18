import React from 'react';

const EMAIL = 'hello@laudtetteh.io';
const GITHUB_URL = 'https://github.com/laudtetteh';
const LINKEDIN_URL = 'https://www.linkedin.com/in/laudtetteh';

const LINK_CLASSES =
  'text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400';

/**
 * Site-wide footer for the redesigned homepage. Carries the real,
 * currently-live copyright and contact content (dynamic year, mailto
 * link, GitHub/LinkedIn) — not the reference template's tool-credit line.
 */
const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      data-redesign-section="footer"
      className="scroll-mt-16 border-t border-slate-200 bg-slate-50 px-6 py-10 dark:border-slate-800 dark:bg-slate-900 md:px-12 lg:scroll-mt-24"
    >
      {/* max-w-screen-xl + matching gutters line the footer's contents up with
          the page grid above it, rather than sitting on a narrower rail. */}
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Copyright &copy; {year} by Laud Tetteh
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> &mdash; </span>
          All rights reserved
        </p>

        <div className="flex items-center gap-6">
          <a href={`mailto:${EMAIL}`} className={`text-sm ${LINK_CLASSES}`}>
            {EMAIL}
          </a>

          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laud Tetteh on GitHub"
              className={LINK_CLASSES}
            >
              <GitHubIcon />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laud Tetteh on LinkedIn"
              className={LINK_CLASSES}
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const GitHubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export default Footer;

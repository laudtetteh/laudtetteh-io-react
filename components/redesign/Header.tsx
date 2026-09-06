import React from 'react';
import classNames from 'classnames';

import { ThemeToggle } from './ThemeToggle';
import SiteIdentity from './SiteIdentity';
import MobileSectionRail from './MobileSectionRail';
import { useScrollSpy } from './hooks/useScrollSpy';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  // 'sandbox' removed in #101 — the section is not rendered. Restore both
  // together (#108), or scroll-spy will track an anchor that doesn't exist.
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
] as const;

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/laudtetteh', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/laudtetteh', icon: LinkedInIcon },
] as const;

/**
 * Sticky header/sidebar for the redesigned homepage: name, role, rotating
 * hero tagline, in-page scroll-spy nav, social icons, and the theme toggle.
 *
 * Behaves as a sticky left column on large screens (`lg:` breakpoint up) and
 * a stacked block at the top of the page below it. Name/role/nav/social
 * markup is present in the initial server-rendered HTML; only the nav's
 * `.active` highlight depends on the client-side `useScrollSpy` hook.
 */
export default function Header(): React.ReactElement {
  const activeSectionId = useScrollSpy(NAV_ITEMS.map(item => item.id));

  return (
    <>
      {/* Sibling of <header>, not a child: it is `fixed`, so DOM position is
          irrelevant visually, and nesting it made `#header a[href="#about"]`
          match two links — breaking #48's active-nav assertion. */}
      <MobileSectionRail items={NAV_ITEMS} activeId={activeSectionId} />

    <header id="header" className="bg-slate-50 dark:bg-slate-900 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
      <div className="flex items-start justify-between gap-4 px-6 pt-10 lg:block lg:px-0 lg:pt-0">
        <SiteIdentity nameAs="h1" nameHref="#header" />

        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop only — the mobile equivalent is <MobileSectionRail>, which
          stays visible while the stacked sidebar scrolls away (#119). */}
      <nav aria-label="In-page" className="mt-10 hidden px-6 lg:mt-0 lg:block lg:px-0">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:block lg:space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = activeSectionId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={classNames(
                    'group flex items-center py-1 text-xs font-bold uppercase tracking-widest transition-colors',
                    isActive
                      ? 'active text-slate-900 dark:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      'mr-3 hidden h-px transition-all lg:block',
                      isActive ? 'w-10 bg-slate-900 dark:bg-slate-200' : 'w-6 bg-slate-400 group-hover:w-10 group-hover:bg-slate-900 dark:bg-slate-600 dark:group-hover:bg-slate-200'
                    )}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-10 flex items-center gap-5 px-6 pb-10 lg:mt-0 lg:px-0 lg:pb-0">
        <ul className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
    </>
  );
}

function GitHubIcon(): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.28 5.69.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon(): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

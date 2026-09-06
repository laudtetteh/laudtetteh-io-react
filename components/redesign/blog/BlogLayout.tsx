import React from 'react';

import Seo from '@/components/Seo';
import { inter } from '@/lib/fonts';
import Footer from '../Footer';
import { useSpotlight } from '../hooks/useSpotlight';
import BlogSidebar from './BlogSidebar';

interface BlogLayoutProps {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  imagePath?: string;
  imageAlt?: string;
  children: React.ReactNode;
}

/**
 * Page shell for the redesigned blog routes (`/blog`, `/blog/[slug]`) — the
 * same two-column architecture as the homepage's `RedesignLayout` (sticky
 * `BlogSidebar` beside an independently scrolling content column, plus the
 * spotlight cursor effect and self-hosted Inter), with `BlogSidebar`
 * standing in for `Header` since blog routes need real page links instead
 * of homepage scroll-spy anchors (#60).
 */
export default function BlogLayout({
  title,
  description,
  path = '/blog',
  type = 'website',
  imagePath,
  imageAlt,
  children,
}: BlogLayoutProps) {
  const { background: spotlightBackground, ref: spotlightRef } = useSpotlight();

  return (
    <div
      className={`${inter.variable} font-inter group/spotlight relative selection:bg-teal-300 selection:text-teal-900`}
    >
      <Seo title={title} description={description} path={path} type={type} imagePath={imagePath} imageAlt={imageAlt} />

      <a
        href="#content"
        className="absolute left-0 top-0 z-50 block -translate-x-full rounded bg-teal-700 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white focus:outline-none focus-visible:translate-x-0 focus-visible:ring-2 focus-visible:ring-teal-300 dark:bg-teal-400 dark:text-slate-900"
      >
        Skip to Content
      </a>

      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
        style={{ background: spotlightBackground }}
      />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-16 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <BlogSidebar />

          <main id="content" className="pt-24 lg:w-[52%] lg:py-24">
            {children}
          </main>
        </div>
      </div>

      {/* Sibling of the grid, not a child of <main> — see the same note in
          RedesignLayout (#83). Nested inside the `lg:w-[52%]` column, this
          full-bleed footer stopped partway across the page. */}
      <Footer />
    </div>
  );
}

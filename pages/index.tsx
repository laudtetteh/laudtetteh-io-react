import React from 'react';
import { GetStaticProps } from 'next';
import RedesignLayout from '../components/redesign/RedesignLayout';
import Seo from '../components/Seo';
import { PostData } from '../types/blog';
import { getLatestPosts } from '../lib/blog';
import { getPublicCv, getPublicCvHref, getPublicCvLinksEnabled, usePublicCvHref } from '../lib/cv';

const LATEST_POSTS_COUNT = 4;
// Keep the Writing section close to admin/API content changes. Content-only
// edits do not otherwise trigger a deploy or on-demand revalidation.
const POSTS_REVALIDATE_SECONDS = 60;

interface HomePageProps {
  posts: PostData[];
  cvHref: string | null;
}

// Deliberately does NOT use `components/Layout.tsx`; the redesign owns its
// page shell directly, matching the original side-by-side `/redesign` route.
//
// The Sandbox section and its GitHub fetch were removed here in #101 — see the
// comment in `RedesignLayout.tsx` for why, and #108 for restoring them.
// `lib/github.ts` and `components/redesign/SandboxSection.tsx` are intentionally
// left in place and unmodified so that restoration is additive.
const HomePage: React.FC<HomePageProps> = ({ posts, cvHref }) => {
  const visibleCvHref = usePublicCvHref(cvHref);

  return (
    <>
      <Seo
        title="Laud Tetteh | Full Stack Software Engineer"
        description="Software engineer with 12 years building and operating web platforms at enterprise scale. I co-own the build, deployment and reliability automation behind a large enterprise Drupal installation — and write open-source tooling for AI-assisted development."
      />
      <RedesignLayout posts={posts} cvHref={visibleCvHref} />
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  let posts: PostData[] = [];
  let cvHref: string | null = null;

  try {
    posts = await getLatestPosts(LATEST_POSTS_COUNT);
  } catch (error) {
    // The blog API is unreachable at build time in CI (API_SERVER points at a
    // Docker-internal address). The Writing section renders its own empty state.
    console.error(error);
  }

  try {
    const [cv, linksEnabled] = await Promise.all([
      getPublicCv(),
      getPublicCvLinksEnabled(),
    ]);
    cvHref = getPublicCvHref(cv, linksEnabled);
  } catch (error) {
    console.error(error);
  }

  return {
    props: { posts, cvHref },
    revalidate: POSTS_REVALIDATE_SECONDS,
  };
};

export default HomePage;

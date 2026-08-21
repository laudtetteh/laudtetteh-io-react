import React from 'react';
import { GetStaticProps } from 'next';
import RedesignLayout from '../components/redesign/RedesignLayout';
import Seo from '../components/Seo';
import { GithubRepo } from '../types/github';
import { PostData } from '../types/blog';
import { getSandboxRepos, SANDBOX_REVALIDATE_SECONDS } from '../lib/github';
import { getLatestPosts } from '../lib/blog';

const LATEST_POSTS_COUNT = 4;
// Blog content changes more often than GitHub repo topics — a shorter
// revalidate window keeps the Writing section closer to real-time.
const POSTS_REVALIDATE_SECONDS = 3600; // 1 hour

interface HomePageProps {
  repos: GithubRepo[];
  posts: PostData[];
}

// Deliberately does NOT use `components/Layout.tsx`; the redesign owns its
// page shell directly, matching the original side-by-side `/redesign` route.
const HomePage: React.FC<HomePageProps> = ({ repos, posts }) => (
  <>
    <Seo title="Laud Tetteh | Full Stack Developer" description="Personal site and portfolio of Laud Tetteh." />
    <RedesignLayout repos={repos} posts={posts} />
  </>
);

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [reposResult, postsResult] = await Promise.allSettled([getSandboxRepos(), getLatestPosts(LATEST_POSTS_COUNT)]);

  if (reposResult.status === 'rejected') {
    console.error(reposResult.reason);
  }
  if (postsResult.status === 'rejected') {
    console.error(postsResult.reason);
  }

  return {
    props: {
      repos: reposResult.status === 'fulfilled' ? reposResult.value : [],
      posts: postsResult.status === 'fulfilled' ? postsResult.value : [],
    },
    // Shortest of the two sections' desired freshness windows, since both
    // props share one page-level revalidate.
    revalidate: Math.min(SANDBOX_REVALIDATE_SECONDS, POSTS_REVALIDATE_SECONDS),
  };
};

export default HomePage;

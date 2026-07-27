import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import RedesignLayout from '@/components/redesign/RedesignLayout';
import { getSandboxRepos, SANDBOX_REVALIDATE_SECONDS } from '@/lib/github';
import { getLatestPosts } from '@/lib/blog';
import type { GithubRepo } from '@/types/github';
import type { PostData } from '@/types/blog';

const LATEST_POSTS_COUNT = 4;
// Blog content changes more often than GitHub repo topics — a shorter
// revalidate window keeps the Writing section closer to real-time.
const POSTS_REVALIDATE_SECONDS = 3600; // 1 hour

interface RedesignPageProps {
  repos: GithubRepo[];
  posts: PostData[];
}

const Redesign: NextPage<RedesignPageProps> = ({ repos, posts }) => {
  return (
    <>
      <Head>
        <title>Laud Tetteh — Redesign Preview</title>
      </Head>
      <RedesignLayout repos={repos} posts={posts} />
    </>
  );
};

export const getStaticProps: GetStaticProps<RedesignPageProps> = async () => {
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

export default Redesign;

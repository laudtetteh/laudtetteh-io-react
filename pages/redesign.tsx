import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import RedesignLayout from '@/components/redesign/RedesignLayout';
import { getSandboxRepos, SANDBOX_REVALIDATE_SECONDS } from '@/lib/github';
import type { GithubRepo } from '@/types/github';

interface RedesignPageProps {
  repos: GithubRepo[];
}

const Redesign: NextPage<RedesignPageProps> = ({ repos }) => {
  return (
    <>
      <Head>
        <title>Laud Tetteh — Redesign Preview</title>
      </Head>
      <RedesignLayout repos={repos} />
    </>
  );
};

export const getStaticProps: GetStaticProps<RedesignPageProps> = async () => {
  try {
    const repos = await getSandboxRepos();
    return {
      props: { repos },
      revalidate: SANDBOX_REVALIDATE_SECONDS,
    };
  } catch (error) {
    console.error(error);
    return {
      props: { repos: [] },
      revalidate: SANDBOX_REVALIDATE_SECONDS,
    };
  }
};

export default Redesign;
